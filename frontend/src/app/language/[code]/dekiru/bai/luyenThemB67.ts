/**
 * BỘ LUYỆN THÊM Bài 6 và Bài 7 (khoá できる日本語 /language/ja/dekiru) — từ DỄ → VỪA → KHÓ.
 *
 * Mỗi lesson: mở đầu bằng "Học thế nào", chia 3 mức 🟢 Dễ · 🟡 Vừa · 🔴 Khó, mọi câu có đáp án + giải thích.
 * Bài 6 (lt-b6-…): từ vựng · chữ Hán (来帰会社聞読書今話) · ngữ pháp 1–3 (ポイント 48–60) · hội thoại · đọc hiểu · nghe · nói & viết · đề tổng hợp.
 * Bài 7 (lt-b7-…): từ vựng · chữ Hán (言貝田力門寺肉料理野半大小) · ngữ pháp 1 (61–62, 68–70) · thể て · ngữ pháp 2 (63–65) · ngữ pháp 3 (66, 67, 71 + trộn) · hội thoại · đọc hiểu · nghe · nói & viết · đề tổng hợp.
 * Mọi câu, hội thoại, kịch bản nghe, bài đọc VIẾT MỚI (không chép sách/đề của cô); chữ Hán có furigana {漢字|かな};
 * romaji cho mọi câu tiếng Nhật (nhúng trong câu hỏi dạng 〔romaji〕 hoặc trường ro).
 * FILE SINH TỰ ĐỘNG từ bộ soạn trong scratchpad — nếu cần sửa nội dung thì sửa bản gốc rồi sinh lại.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export const LUYEN_THEM_B6: Lesson[] = [
  {
    "id": "lt-b6-tu-vung",
    "kind": "homework",
    "title": "Luyện thêm Bài 6 · Từ vựng — nhận mặt → điền câu → dịch (3 mức, ~179 câu)",
    "goal": "Nhớ chắc 55/55 từ của cô cho Bài 6: nhìn từ biết nghĩa, nghe nghĩa nhớ ra từ, điền đúng từ vào câu và tự dịch câu Việt → Nhật có dùng từ đó.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đi theo thứ tự **🟢 → 🟡 → 🔴**. Mức Dễ làm hai lượt (Nhật → Việt, rồi Việt → Nhật): hết 55 từ mới sang mức Vừa.",
          "Câu sai thì **đọc to từ đó 3 lần** (có romaji ngay trong câu hỏi) rồi làm lại cả khối sau 10 phút. Mẹo: nhóm từ theo chủ đề (A–G) giống bài từ vựng.",
          "Lỗi hay mắc: nhầm **今週/来週/今月/来月** (kon = nay, rai = sau), nhầm **近い/遠い**, nhầm **まだ/もう**, và nhầm ～枚 (vật mỏng) với ～つ (vật khối)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhìn từ → biết nghĩa; nghe nghĩa → nhớ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-jv1",
        "title": "Nhật → Việt — nhóm A–C: thời gian · giải trí · đồ vật (21 câu)",
        "items": [
          {
            "q": "「{今週|こんしゅう}」 〔konshuu〕 nghĩa là gì?",
            "options": [
              "tháng này",
              "tuần này",
              "việc bận, việc riêng",
              "tháng sau"
            ],
            "correct": 1,
            "why": "**{今週|こんしゅう}** (konshuu) = tuần này"
          },
          {
            "q": "「{来週|らいしゅう}」 〔raishuu〕 nghĩa là gì?",
            "options": [
              "tháng sau",
              "mùa",
              "tuần sau",
              "việc bận, việc riêng"
            ],
            "correct": 2,
            "why": "**{来週|らいしゅう}** (raishuu) = tuần sau"
          },
          {
            "q": "「{今月|こんげつ}」 〔kongetsu〕 nghĩa là gì?",
            "options": [
              "tuần này",
              "tháng này",
              "tuần sau",
              "cuộc hẹn"
            ],
            "correct": 1,
            "why": "**{今月|こんげつ}** (kongetsu) = tháng này"
          },
          {
            "q": "「{来月|らいげつ}」 〔raigetsu〕 nghĩa là gì?",
            "options": [
              "mùa",
              "tháng sau",
              "tháng này",
              "cuộc hẹn"
            ],
            "correct": 1,
            "why": "**{来月|らいげつ}** (raigetsu) = tháng sau"
          },
          {
            "q": "「{約束|やくそく}」 〔yakusoku〕 nghĩa là gì?",
            "options": [
              "tuần sau",
              "tuần này",
              "cuộc hẹn",
              "tháng sau"
            ],
            "correct": 2,
            "why": "**{約束|やくそく}** (yakusoku) = cuộc hẹn; lời hứa (約束があります = có hẹn)"
          },
          {
            "q": "「{用事|ようじ}」 〔youji〕 nghĩa là gì?",
            "options": [
              "tuần này",
              "mùa",
              "việc bận, việc riêng",
              "tuần sau"
            ],
            "correct": 2,
            "why": "**{用事|ようじ}** (youji) = việc bận, việc riêng (lý do từ chối lịch sự nhất)"
          },
          {
            "q": "「{季節|きせつ}」 〔kisetsu〕 nghĩa là gì?",
            "options": [
              "tháng này",
              "tuần này",
              "việc bận, việc riêng",
              "mùa"
            ],
            "correct": 3,
            "why": "**{季節|きせつ}** (kisetsu) = mùa (xuân, hạ, thu, đông)"
          },
          {
            "q": "「カラオケ」 〔karaoke〕 nghĩa là gì?",
            "options": [
              "trận đấu",
              "lái xe đi chơi",
              "karaoke (hát karaoke)",
              "buổi hoà nhạc"
            ],
            "correct": 2,
            "why": "**カラオケ** (karaoke) = hát karaoke (カラオケに行きます = đi karaoke)"
          },
          {
            "q": "「コンサート」 〔konsaato〕 nghĩa là gì?",
            "options": [
              "buổi hoà nhạc",
              "phim hài",
              "đợt giảm giá",
              "lái xe đi chơi"
            ],
            "correct": 0,
            "why": "**コンサート** (konsaato) = buổi hoà nhạc"
          },
          {
            "q": "「{試合|しあい}」 〔shiai〕 nghĩa là gì?",
            "options": [
              "trận đấu",
              "buổi hoà nhạc",
              "bóng chày",
              "ca sĩ"
            ],
            "correct": 0,
            "why": "**{試合|しあい}** (shiai) = trận đấu"
          },
          {
            "q": "「{野球|やきゅう}」 〔yakyuu〕 nghĩa là gì?",
            "options": [
              "lái xe đi chơi",
              "buổi hoà nhạc",
              "bóng chày",
              "trận đấu"
            ],
            "correct": 2,
            "why": "**{野球|やきゅう}** (yakyuu) = bóng chày"
          },
          {
            "q": "「セール」 〔seeru〕 nghĩa là gì?",
            "options": [
              "bóng chày",
              "đợt giảm giá",
              "tour du lịch",
              "phim hài"
            ],
            "correct": 1,
            "why": "**セール** (seeru) = đợt giảm giá, bán hạ giá (sale)"
          },
          {
            "q": "「ドライブ」 〔doraibu〕 nghĩa là gì?",
            "options": [
              "lái xe đi chơi",
              "tour du lịch",
              "buổi hoà nhạc",
              "karaoke (hát karaoke)"
            ],
            "correct": 0,
            "why": "**ドライブ** (doraibu) = lái xe đi dạo, đi chơi bằng ô tô (ドライブをします／ドライブに行きます)"
          },
          {
            "q": "「ジャズ」 〔jazu〕 nghĩa là gì?",
            "options": [
              "bóng chày",
              "nhạc jazz",
              "ca sĩ",
              "phim hài"
            ],
            "correct": 1,
            "why": "**ジャズ** (jazu) = nhạc jazz"
          },
          {
            "q": "「コメディー」 〔komedii〕 nghĩa là gì?",
            "options": [
              "bóng chày",
              "phim hài",
              "ca sĩ",
              "nhạc jazz"
            ],
            "correct": 1,
            "why": "**コメディー** (komedii) = phim hài, hài kịch"
          },
          {
            "q": "「{歌手|かしゅ}」 〔kashu〕 nghĩa là gì?",
            "options": [
              "lái xe đi chơi",
              "bóng chày",
              "ca sĩ",
              "nhạc jazz"
            ],
            "correct": 2,
            "why": "**{歌手|かしゅ}** (kashu) = ca sĩ"
          },
          {
            "q": "「ツアー」 〔tsuaa〕 nghĩa là gì?",
            "options": [
              "karaoke (hát karaoke)",
              "lái xe đi chơi",
              "buổi hoà nhạc",
              "tour du lịch"
            ],
            "correct": 3,
            "why": "**ツアー** (tsuaa) = tour du lịch"
          },
          {
            "q": "「チケット」 〔chiketto〕 nghĩa là gì?",
            "options": [
              "bản đồ",
              "đồ bơi",
              "vé",
              "~ tờ, ~ tấm (đếm vật mỏng)"
            ],
            "correct": 2,
            "why": "**チケット** (chiketto) = vé (xem phim, hoà nhạc, trận đấu)"
          },
          {
            "q": "「～{枚|まい}」 〔~mai〕 nghĩa là gì?",
            "options": [
              "~ tờ, ~ tấm (đếm vật mỏng)",
              "đồ bơi",
              "bản đồ",
              "vé"
            ],
            "correct": 0,
            "why": "**～{枚|まい}** (~mai) = ~ tờ, ~ tấm, ~ chiếc (đồ mỏng, phẳng: vé, giấy, áo phông, đĩa, tem)"
          },
          {
            "q": "「{地図|ちず}」 〔chizu〕 nghĩa là gì?",
            "options": [
              "vé",
              "bản đồ",
              "~ tờ, ~ tấm (đếm vật mỏng)",
              "đồ bơi"
            ],
            "correct": 1,
            "why": "**{地図|ちず}** (chizu) = bản đồ"
          },
          {
            "q": "「{水着|みずぎ}」 〔mizugi〕 nghĩa là gì?",
            "options": [
              "vé",
              "đồ bơi",
              "~ tờ, ~ tấm (đếm vật mỏng)",
              "bản đồ"
            ],
            "correct": 1,
            "why": "**{水着|みずぎ}** (mizugi) = đồ bơi"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-jv2",
        "title": "Nhật → Việt — nhóm D–E: ăn uống · tính từ (20 câu)",
        "items": [
          {
            "q": "「{食|た}べ{物|もの}」 〔tabemono〕 nghĩa là gì?",
            "options": [
              "tàu điện ngầm",
              "mì ramen",
              "thịt nướng",
              "đồ ăn, món ăn"
            ],
            "correct": 3,
            "why": "**{食|た}べ{物|もの}** (tabemono) = đồ ăn, món ăn"
          },
          {
            "q": "「{飲|の}み{物|もの}」 〔nomimono〕 nghĩa là gì?",
            "options": [
              "đồ uống",
              "tàu điện ngầm",
              "đồ ăn, món ăn",
              "quán nhậu kiểu Nhật"
            ],
            "correct": 0,
            "why": "**{飲|の}み{物|もの}** (nomimono) = đồ uống"
          },
          {
            "q": "「{焼|や}き{肉|にく}」 〔yakiniku〕 nghĩa là gì?",
            "options": [
              "thịt nướng",
              "bánh xèo Nhật",
              "tàu điện ngầm",
              "set món"
            ],
            "correct": 0,
            "why": "**{焼|や}き{肉|にく}** (yakiniku) = thịt nướng (kiểu Nhật – Hàn, tự nướng tại bàn)"
          },
          {
            "q": "「ラーメン」 〔raamen〕 nghĩa là gì?",
            "options": [
              "đồ uống",
              "bánh xèo Nhật",
              "mì ramen",
              "đồ ăn, món ăn"
            ],
            "correct": 2,
            "why": "**ラーメン** (raamen) = mì ramen (mì nước Nhật)"
          },
          {
            "q": "「{食|た}べ{放題|ほうだい}」 〔tabehoudai〕 nghĩa là gì?",
            "options": [
              "thịt nướng",
              "ăn thoả thích (buffet)",
              "đồ uống",
              "đồ ăn, món ăn"
            ],
            "correct": 1,
            "why": "**{食|た}べ{放題|ほうだい}** (tabehoudai) = ăn thoả thích, ăn buffet (trả một giá, ăn không giới hạn trong thời gian quy định)"
          },
          {
            "q": "「コース」 〔koosu〕 nghĩa là gì?",
            "options": [
              "set món",
              "ăn thoả thích (buffet)",
              "tàu điện ngầm",
              "mì ramen"
            ],
            "correct": 0,
            "why": "**コース** (koosu) = set món (thực đơn trọn gói); khoá học"
          },
          {
            "q": "「{居酒屋|いざかや}」 〔izakaya〕 nghĩa là gì?",
            "options": [
              "đồ uống",
              "đồ ăn, món ăn",
              "quán nhậu kiểu Nhật",
              "tàu điện ngầm"
            ],
            "correct": 2,
            "why": "**{居酒屋|いざかや}** (izakaya) = quán nhậu kiểu Nhật (vừa uống rượu vừa ăn món nhỏ)"
          },
          {
            "q": "「お{好|この}み{焼|や}き」 〔okonomiyaki〕 nghĩa là gì?",
            "options": [
              "đồ ăn, món ăn",
              "bánh xèo Nhật",
              "tàu điện ngầm",
              "set món"
            ],
            "correct": 1,
            "why": "**お{好|この}み{焼|や}き** (okonomiyaki) = bánh xèo Nhật (bột, bắp cải, thịt, trứng nướng trên vỉ, rưới sốt)"
          },
          {
            "q": "「すき{焼|や}き」 〔sukiyaki〕 nghĩa là gì?",
            "options": [
              "set món",
              "tàu điện ngầm",
              "rạp chiếu phim",
              "món sukiyaki"
            ],
            "correct": 3,
            "why": "**すき{焼|や}き** (sukiyaki) = món sukiyaki (lẩu nhúng thịt bò và rau, nước dùng ngọt)"
          },
          {
            "q": "「{映画館|えいがかん}」 〔eigakan〕 nghĩa là gì?",
            "options": [
              "bánh xèo Nhật",
              "tàu điện ngầm",
              "rạp chiếu phim",
              "mì ramen"
            ],
            "correct": 2,
            "why": "**{映画館|えいがかん}** (eigakan) = rạp chiếu phim"
          },
          {
            "q": "「{地下鉄|ちかてつ}」 〔chikatetsu〕 nghĩa là gì?",
            "options": [
              "bánh xèo Nhật",
              "tàu điện ngầm",
              "quán nhậu kiểu Nhật",
              "đồ uống"
            ],
            "correct": 1,
            "why": "**{地下鉄|ちかてつ}** (chikatetsu) = tàu điện ngầm"
          },
          {
            "q": "「{近|ちか}い」 〔chikai〕 nghĩa là gì?",
            "options": [
              "gần",
              "tất cả, toàn bộ",
              "sớm (về thời gian)",
              "tiếc, đáng tiếc"
            ],
            "correct": 0,
            "why": "**{近|ちか}い** (chikai) = gần"
          },
          {
            "q": "「{遠|とお}い」 〔tooi〕 nghĩa là gì?",
            "options": [
              "cái nào, bên nào (trong hai)",
              "xa",
              "sớm (về thời gian)",
              "tiếc, đáng tiếc"
            ],
            "correct": 1,
            "why": "**{遠|とお}い** (tooi) = xa"
          },
          {
            "q": "「{早|はや}い」 〔hayai〕 nghĩa là gì?",
            "options": [
              "cái nào, bên nào (trong hai)",
              "xa",
              "nhất, số một",
              "sớm (về thời gian)"
            ],
            "correct": 3,
            "why": "**{早|はや}い** (hayai) = sớm; nhanh (về thời gian — đi tàu nào đến sớm hơn)"
          },
          {
            "q": "「{広|ひろ}い」 〔hiroi〕 nghĩa là gì?",
            "options": [
              "gần",
              "sớm (về thời gian)",
              "cả hai",
              "rộng"
            ],
            "correct": 3,
            "why": "**{広|ひろ}い** (hiroi) = rộng"
          },
          {
            "q": "「{残念|ざんねん}（な）」 〔zannen (na)〕 nghĩa là gì?",
            "options": [
              "cả hai",
              "gần",
              "tất cả, toàn bộ",
              "tiếc, đáng tiếc"
            ],
            "correct": 3,
            "why": "**{残念|ざんねん}（な）** (zannen (na)) = tiếc, đáng tiếc (đáp lại khi bị từ chối)"
          },
          {
            "q": "「どちら」 〔dochira〕 nghĩa là gì?",
            "options": [
              "rộng",
              "tất cả, toàn bộ",
              "gần",
              "cái nào, bên nào (trong hai)"
            ],
            "correct": 3,
            "why": "**どちら** (dochira) = cái nào, bên nào (chọn 1 trong 2); cũng là どこ lịch sự"
          },
          {
            "q": "「どちらも」 〔dochira mo〕 nghĩa là gì?",
            "options": [
              "rộng",
              "cả hai",
              "sớm (về thời gian)",
              "gần"
            ],
            "correct": 1,
            "why": "**どちらも** (dochira mo) = cả hai, bên nào cũng"
          },
          {
            "q": "「いちばん」 〔ichiban〕 nghĩa là gì?",
            "options": [
              "tất cả, toàn bộ",
              "nhất, số một",
              "xa",
              "cái nào, bên nào (trong hai)"
            ],
            "correct": 1,
            "why": "**いちばん** (ichiban) = nhất, số một"
          },
          {
            "q": "「{全部|ぜんぶ}」 〔zenbu〕 nghĩa là gì?",
            "options": [
              "sớm (về thời gian)",
              "tiếc, đáng tiếc",
              "tất cả, toàn bộ",
              "xa"
            ],
            "correct": 2,
            "why": "**{全部|ぜんぶ}** (zenbu) = tất cả, toàn bộ"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-jv3",
        "title": "Nhật → Việt — nhóm F–G: động từ · câu giao tiếp (14 câu)",
        "items": [
          {
            "q": "「あります」 〔arimasu〕 nghĩa là gì?",
            "options": [
              "nhất định (muốn)",
              "có (hẹn, việc, sự kiện)",
              "cùng nhau, cùng với",
              "chưa"
            ],
            "correct": 1,
            "why": "**あります** (arimasu) = có (Bài 6: có hẹn, có việc, có sự kiện, có vé; khác Bài 4: ở đâu có cái gì)"
          },
          {
            "q": "「{遊|あそ}びます」 〔asobimasu〕 nghĩa là gì?",
            "options": [
              "cùng nhau, cùng với",
              "có (hẹn, việc, sự kiện)",
              "nhất định (muốn)",
              "chơi, đi chơi"
            ],
            "correct": 3,
            "why": "**{遊|あそ}びます** (asobimasu) = chơi, đi chơi (遊びに行きます = đi chơi)"
          },
          {
            "q": "「{一緒|いっしょ}に」 〔issho ni〕 nghĩa là gì?",
            "options": [
              "chưa",
              "chơi, đi chơi",
              "cùng nhau, cùng với",
              "nhất định (muốn)"
            ],
            "correct": 2,
            "why": "**{一緒|いっしょ}に** (issho ni) = cùng nhau, cùng với"
          },
          {
            "q": "「ぜひ」 〔zehi〕 nghĩa là gì?",
            "options": [
              "đã, rồi",
              "chơi, đi chơi",
              "nhất định (muốn)",
              "chưa"
            ],
            "correct": 2,
            "why": "**ぜひ** (zehi) = nhất định, rất (muốn) (đi với ～たいです)"
          },
          {
            "q": "「まだ」 〔mada〕 nghĩa là gì?",
            "options": [
              "đã, rồi",
              "có (hẹn, việc, sự kiện)",
              "cùng nhau, cùng với",
              "chưa"
            ],
            "correct": 3,
            "why": "**まだ** (mada) = chưa; vẫn (いいえ、まだです = chưa)"
          },
          {
            "q": "「もう」 〔mou〕 nghĩa là gì?",
            "options": [
              "đã, rồi",
              "cùng nhau, cùng với",
              "nhất định (muốn)",
              "chơi, đi chơi"
            ],
            "correct": 0,
            "why": "**もう** (mou) = đã, rồi (もう～ましたか = đã … chưa?)"
          },
          {
            "q": "「いいですね」 〔ii desu ne〕 nghĩa là gì?",
            "options": [
              "xin lỗi",
              "à, ồ (trước khi từ chối)",
              "oa (ngạc nhiên, vui)",
              "hay đấy (nhận lời rủ)"
            ],
            "correct": 3,
            "why": "**いいですね** (ii desu ne) = hay đấy, được đấy (nhận lời rủ)"
          },
          {
            "q": "「ああ」 〔aa〕 nghĩa là gì?",
            "options": [
              "để xem nào… (ngập ngừng)",
              "à, ồ (trước khi từ chối)",
              "xin lỗi",
              "oa (ngạc nhiên, vui)"
            ],
            "correct": 1,
            "why": "**ああ** (aa) = à, ồ (mở đầu câu, nhất là trước khi từ chối)"
          },
          {
            "q": "「すみません」 〔sumimasen〕 nghĩa là gì?",
            "options": [
              "cứ làm như thế đi (đồng ý đề xuất)",
              "xin lỗi",
              "hẹn lần sau",
              "oa (ngạc nhiên, vui)"
            ],
            "correct": 1,
            "why": "**すみません** (sumimasen) = xin lỗi (khi từ chối lời rủ)"
          },
          {
            "q": "「また{今度|こんど}」 〔mata kondo〕 nghĩa là gì?",
            "options": [
              "tôi hiểu rồi (nhận thông tin)",
              "hẹn lần sau",
              "xin lỗi",
              "à, ồ (trước khi từ chối)"
            ],
            "correct": 1,
            "why": "**また{今度|こんど}** (mata kondo) = hẹn lần sau (khi lời rủ không thành)"
          },
          {
            "q": "「わあ」 〔waa〕 nghĩa là gì?",
            "options": [
              "oa (ngạc nhiên, vui)",
              "à, ồ (trước khi từ chối)",
              "để xem nào… (ngập ngừng)",
              "cứ làm như thế đi (đồng ý đề xuất)"
            ],
            "correct": 0,
            "why": "**わあ** (waa) = oa (ngạc nhiên, vui mừng)"
          },
          {
            "q": "「そうですねえ」 〔sou desu nee〕 nghĩa là gì?",
            "options": [
              "hẹn lần sau",
              "cứ làm như thế đi (đồng ý đề xuất)",
              "tôi hiểu rồi (nhận thông tin)",
              "để xem nào… (ngập ngừng)"
            ],
            "correct": 3,
            "why": "**そうですねえ** (sou desu nee) = để xem nào…, ừ thì… (ngập ngừng khi đang nghĩ câu trả lời; kéo dài ねえ)"
          },
          {
            "q": "「そうしましょう」 〔sou shimashou〕 nghĩa là gì?",
            "options": [
              "cứ làm như thế đi (đồng ý đề xuất)",
              "à, ồ (trước khi từ chối)",
              "xin lỗi",
              "để xem nào… (ngập ngừng)"
            ],
            "correct": 0,
            "why": "**そうしましょう** (sou shimashou) = làm như thế đi, cứ vậy nhé (đồng ý với đề xuất)"
          },
          {
            "q": "「わかりました」 〔wakarimashita〕 nghĩa là gì?",
            "options": [
              "à, ồ (trước khi từ chối)",
              "hẹn lần sau",
              "xin lỗi",
              "tôi hiểu rồi (nhận thông tin)"
            ],
            "correct": 3,
            "why": "**わかりました** (wakarimashita) = tôi hiểu rồi, được rồi (chấp nhận thông tin, lời hẹn)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-vj1",
        "title": "Việt → Nhật — nhóm A–C: thời gian · giải trí · đồ vật (21 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"tuần này\" là từ nào?",
            "options": [
              "{今週|こんしゅう} (konshuu)",
              "{用事|ようじ} (youji)",
              "{今月|こんげつ} (kongetsu)",
              "{来月|らいげつ} (raigetsu)"
            ],
            "correct": 0,
            "why": "**{今週|こんしゅう}** (konshuu) = tuần này"
          },
          {
            "q": "Tiếng Nhật của \"tuần sau\" là từ nào?",
            "options": [
              "{来月|らいげつ} (raigetsu)",
              "{用事|ようじ} (youji)",
              "{来週|らいしゅう} (raishuu)",
              "{季節|きせつ} (kisetsu)"
            ],
            "correct": 2,
            "why": "**{来週|らいしゅう}** (raishuu) = tuần sau"
          },
          {
            "q": "Tiếng Nhật của \"tháng này\" là từ nào?",
            "options": [
              "{約束|やくそく} (yakusoku)",
              "{今週|こんしゅう} (konshuu)",
              "{今月|こんげつ} (kongetsu)",
              "{来週|らいしゅう} (raishuu)"
            ],
            "correct": 2,
            "why": "**{今月|こんげつ}** (kongetsu) = tháng này"
          },
          {
            "q": "Tiếng Nhật của \"tháng sau\" là từ nào?",
            "options": [
              "{今月|こんげつ} (kongetsu)",
              "{来月|らいげつ} (raigetsu)",
              "{約束|やくそく} (yakusoku)",
              "{季節|きせつ} (kisetsu)"
            ],
            "correct": 1,
            "why": "**{来月|らいげつ}** (raigetsu) = tháng sau"
          },
          {
            "q": "Tiếng Nhật của \"cuộc hẹn\" là từ nào?",
            "options": [
              "{来月|らいげつ} (raigetsu)",
              "{来週|らいしゅう} (raishuu)",
              "{今週|こんしゅう} (konshuu)",
              "{約束|やくそく} (yakusoku)"
            ],
            "correct": 3,
            "why": "**{約束|やくそく}** (yakusoku) = cuộc hẹn; lời hứa (約束があります = có hẹn)"
          },
          {
            "q": "Tiếng Nhật của \"việc bận, việc riêng\" là từ nào?",
            "options": [
              "{来週|らいしゅう} (raishuu)",
              "{用事|ようじ} (youji)",
              "{季節|きせつ} (kisetsu)",
              "{今週|こんしゅう} (konshuu)"
            ],
            "correct": 1,
            "why": "**{用事|ようじ}** (youji) = việc bận, việc riêng (lý do từ chối lịch sự nhất)"
          },
          {
            "q": "Tiếng Nhật của \"mùa\" là từ nào?",
            "options": [
              "{用事|ようじ} (youji)",
              "{今週|こんしゅう} (konshuu)",
              "{今月|こんげつ} (kongetsu)",
              "{季節|きせつ} (kisetsu)"
            ],
            "correct": 3,
            "why": "**{季節|きせつ}** (kisetsu) = mùa (xuân, hạ, thu, đông)"
          },
          {
            "q": "Tiếng Nhật của \"karaoke (hát karaoke)\" là từ nào?",
            "options": [
              "ドライブ (doraibu)",
              "{試合|しあい} (shiai)",
              "コンサート (konsaato)",
              "カラオケ (karaoke)"
            ],
            "correct": 3,
            "why": "**カラオケ** (karaoke) = hát karaoke (カラオケに行きます = đi karaoke)"
          },
          {
            "q": "Tiếng Nhật của \"buổi hoà nhạc\" là từ nào?",
            "options": [
              "コンサート (konsaato)",
              "セール (seeru)",
              "ドライブ (doraibu)",
              "コメディー (komedii)"
            ],
            "correct": 0,
            "why": "**コンサート** (konsaato) = buổi hoà nhạc"
          },
          {
            "q": "Tiếng Nhật của \"trận đấu\" là từ nào?",
            "options": [
              "{試合|しあい} (shiai)",
              "{野球|やきゅう} (yakyuu)",
              "{歌手|かしゅ} (kashu)",
              "コンサート (konsaato)"
            ],
            "correct": 0,
            "why": "**{試合|しあい}** (shiai) = trận đấu"
          },
          {
            "q": "Tiếng Nhật của \"bóng chày\" là từ nào?",
            "options": [
              "{試合|しあい} (shiai)",
              "ドライブ (doraibu)",
              "{野球|やきゅう} (yakyuu)",
              "コンサート (konsaato)"
            ],
            "correct": 2,
            "why": "**{野球|やきゅう}** (yakyuu) = bóng chày"
          },
          {
            "q": "Tiếng Nhật của \"đợt giảm giá\" là từ nào?",
            "options": [
              "コメディー (komedii)",
              "セール (seeru)",
              "{野球|やきゅう} (yakyuu)",
              "ツアー (tsuaa)"
            ],
            "correct": 1,
            "why": "**セール** (seeru) = đợt giảm giá, bán hạ giá (sale)"
          },
          {
            "q": "Tiếng Nhật của \"lái xe đi chơi\" là từ nào?",
            "options": [
              "カラオケ (karaoke)",
              "ドライブ (doraibu)",
              "ツアー (tsuaa)",
              "コンサート (konsaato)"
            ],
            "correct": 1,
            "why": "**ドライブ** (doraibu) = lái xe đi dạo, đi chơi bằng ô tô (ドライブをします／ドライブに行きます)"
          },
          {
            "q": "Tiếng Nhật của \"nhạc jazz\" là từ nào?",
            "options": [
              "ジャズ (jazu)",
              "{歌手|かしゅ} (kashu)",
              "コメディー (komedii)",
              "{野球|やきゅう} (yakyuu)"
            ],
            "correct": 0,
            "why": "**ジャズ** (jazu) = nhạc jazz"
          },
          {
            "q": "Tiếng Nhật của \"phim hài\" là từ nào?",
            "options": [
              "{野球|やきゅう} (yakyuu)",
              "コメディー (komedii)",
              "{歌手|かしゅ} (kashu)",
              "ジャズ (jazu)"
            ],
            "correct": 1,
            "why": "**コメディー** (komedii) = phim hài, hài kịch"
          },
          {
            "q": "Tiếng Nhật của \"ca sĩ\" là từ nào?",
            "options": [
              "{歌手|かしゅ} (kashu)",
              "ドライブ (doraibu)",
              "ジャズ (jazu)",
              "{野球|やきゅう} (yakyuu)"
            ],
            "correct": 0,
            "why": "**{歌手|かしゅ}** (kashu) = ca sĩ"
          },
          {
            "q": "Tiếng Nhật của \"tour du lịch\" là từ nào?",
            "options": [
              "カラオケ (karaoke)",
              "ツアー (tsuaa)",
              "コンサート (konsaato)",
              "ドライブ (doraibu)"
            ],
            "correct": 1,
            "why": "**ツアー** (tsuaa) = tour du lịch"
          },
          {
            "q": "Tiếng Nhật của \"vé\" là từ nào?",
            "options": [
              "{地図|ちず} (chizu)",
              "{水着|みずぎ} (mizugi)",
              "～{枚|まい} (~mai)",
              "チケット (chiketto)"
            ],
            "correct": 3,
            "why": "**チケット** (chiketto) = vé (xem phim, hoà nhạc, trận đấu)"
          },
          {
            "q": "Tiếng Nhật của \"~ tờ, ~ tấm (đếm vật mỏng)\" là từ nào?",
            "options": [
              "～{枚|まい} (~mai)",
              "{水着|みずぎ} (mizugi)",
              "チケット (chiketto)",
              "{地図|ちず} (chizu)"
            ],
            "correct": 0,
            "why": "**～{枚|まい}** (~mai) = ~ tờ, ~ tấm, ~ chiếc (đồ mỏng, phẳng: vé, giấy, áo phông, đĩa, tem)"
          },
          {
            "q": "Tiếng Nhật của \"bản đồ\" là từ nào?",
            "options": [
              "チケット (chiketto)",
              "{地図|ちず} (chizu)",
              "{水着|みずぎ} (mizugi)",
              "～{枚|まい} (~mai)"
            ],
            "correct": 1,
            "why": "**{地図|ちず}** (chizu) = bản đồ"
          },
          {
            "q": "Tiếng Nhật của \"đồ bơi\" là từ nào?",
            "options": [
              "{地図|ちず} (chizu)",
              "チケット (chiketto)",
              "{水着|みずぎ} (mizugi)",
              "～{枚|まい} (~mai)"
            ],
            "correct": 2,
            "why": "**{水着|みずぎ}** (mizugi) = đồ bơi"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-vj2",
        "title": "Việt → Nhật — nhóm D–E: ăn uống · tính từ (20 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"đồ ăn, món ăn\" là từ nào?",
            "options": [
              "{食|た}べ{物|もの} (tabemono)",
              "{地下鉄|ちかてつ} (chikatetsu)",
              "{焼|や}き{肉|にく} (yakiniku)",
              "ラーメン (raamen)"
            ],
            "correct": 0,
            "why": "**{食|た}べ{物|もの}** (tabemono) = đồ ăn, món ăn"
          },
          {
            "q": "Tiếng Nhật của \"đồ uống\" là từ nào?",
            "options": [
              "{地下鉄|ちかてつ} (chikatetsu)",
              "{飲|の}み{物|もの} (nomimono)",
              "{居酒屋|いざかや} (izakaya)",
              "{食|た}べ{物|もの} (tabemono)"
            ],
            "correct": 1,
            "why": "**{飲|の}み{物|もの}** (nomimono) = đồ uống"
          },
          {
            "q": "Tiếng Nhật của \"thịt nướng\" là từ nào?",
            "options": [
              "{焼|や}き{肉|にく} (yakiniku)",
              "お{好|この}み{焼|や}き (okonomiyaki)",
              "コース (koosu)",
              "{地下鉄|ちかてつ} (chikatetsu)"
            ],
            "correct": 0,
            "why": "**{焼|や}き{肉|にく}** (yakiniku) = thịt nướng (kiểu Nhật – Hàn, tự nướng tại bàn)"
          },
          {
            "q": "Tiếng Nhật của \"mì ramen\" là từ nào?",
            "options": [
              "お{好|この}み{焼|や}き (okonomiyaki)",
              "{食|た}べ{物|もの} (tabemono)",
              "{飲|の}み{物|もの} (nomimono)",
              "ラーメン (raamen)"
            ],
            "correct": 3,
            "why": "**ラーメン** (raamen) = mì ramen (mì nước Nhật)"
          },
          {
            "q": "Tiếng Nhật của \"ăn thoả thích (buffet)\" là từ nào?",
            "options": [
              "{焼|や}き{肉|にく} (yakiniku)",
              "{食|た}べ{物|もの} (tabemono)",
              "{飲|の}み{物|もの} (nomimono)",
              "{食|た}べ{放題|ほうだい} (tabehoudai)"
            ],
            "correct": 3,
            "why": "**{食|た}べ{放題|ほうだい}** (tabehoudai) = ăn thoả thích, ăn buffet (trả một giá, ăn không giới hạn trong thời gian quy định)"
          },
          {
            "q": "Tiếng Nhật của \"set món\" là từ nào?",
            "options": [
              "{地下鉄|ちかてつ} (chikatetsu)",
              "コース (koosu)",
              "ラーメン (raamen)",
              "{食|た}べ{放題|ほうだい} (tabehoudai)"
            ],
            "correct": 1,
            "why": "**コース** (koosu) = set món (thực đơn trọn gói); khoá học"
          },
          {
            "q": "Tiếng Nhật của \"quán nhậu kiểu Nhật\" là từ nào?",
            "options": [
              "{飲|の}み{物|もの} (nomimono)",
              "{地下鉄|ちかてつ} (chikatetsu)",
              "{居酒屋|いざかや} (izakaya)",
              "{食|た}べ{物|もの} (tabemono)"
            ],
            "correct": 2,
            "why": "**{居酒屋|いざかや}** (izakaya) = quán nhậu kiểu Nhật (vừa uống rượu vừa ăn món nhỏ)"
          },
          {
            "q": "Tiếng Nhật của \"bánh xèo Nhật\" là từ nào?",
            "options": [
              "{地下鉄|ちかてつ} (chikatetsu)",
              "お{好|この}み{焼|や}き (okonomiyaki)",
              "コース (koosu)",
              "{食|た}べ{物|もの} (tabemono)"
            ],
            "correct": 1,
            "why": "**お{好|この}み{焼|や}き** (okonomiyaki) = bánh xèo Nhật (bột, bắp cải, thịt, trứng nướng trên vỉ, rưới sốt)"
          },
          {
            "q": "Tiếng Nhật của \"món sukiyaki\" là từ nào?",
            "options": [
              "{地下鉄|ちかてつ} (chikatetsu)",
              "コース (koosu)",
              "すき{焼|や}き (sukiyaki)",
              "{映画館|えいがかん} (eigakan)"
            ],
            "correct": 2,
            "why": "**すき{焼|や}き** (sukiyaki) = món sukiyaki (lẩu nhúng thịt bò và rau, nước dùng ngọt)"
          },
          {
            "q": "Tiếng Nhật của \"rạp chiếu phim\" là từ nào?",
            "options": [
              "ラーメン (raamen)",
              "{映画館|えいがかん} (eigakan)",
              "{地下鉄|ちかてつ} (chikatetsu)",
              "お{好|この}み{焼|や}き (okonomiyaki)"
            ],
            "correct": 1,
            "why": "**{映画館|えいがかん}** (eigakan) = rạp chiếu phim"
          },
          {
            "q": "Tiếng Nhật của \"tàu điện ngầm\" là từ nào?",
            "options": [
              "{居酒屋|いざかや} (izakaya)",
              "{飲|の}み{物|もの} (nomimono)",
              "{地下鉄|ちかてつ} (chikatetsu)",
              "お{好|この}み{焼|や}き (okonomiyaki)"
            ],
            "correct": 2,
            "why": "**{地下鉄|ちかてつ}** (chikatetsu) = tàu điện ngầm"
          },
          {
            "q": "Tiếng Nhật của \"gần\" là từ nào?",
            "options": [
              "{残念|ざんねん}（な） (zannen (na))",
              "{近|ちか}い (chikai)",
              "{全部|ぜんぶ} (zenbu)",
              "{早|はや}い (hayai)"
            ],
            "correct": 1,
            "why": "**{近|ちか}い** (chikai) = gần"
          },
          {
            "q": "Tiếng Nhật của \"xa\" là từ nào?",
            "options": [
              "{残念|ざんねん}（な） (zannen (na))",
              "{遠|とお}い (tooi)",
              "{早|はや}い (hayai)",
              "どちら (dochira)"
            ],
            "correct": 1,
            "why": "**{遠|とお}い** (tooi) = xa"
          },
          {
            "q": "Tiếng Nhật của \"sớm (về thời gian)\" là từ nào?",
            "options": [
              "{遠|とお}い (tooi)",
              "どちら (dochira)",
              "いちばん (ichiban)",
              "{早|はや}い (hayai)"
            ],
            "correct": 3,
            "why": "**{早|はや}い** (hayai) = sớm; nhanh (về thời gian — đi tàu nào đến sớm hơn)"
          },
          {
            "q": "Tiếng Nhật của \"rộng\" là từ nào?",
            "options": [
              "{早|はや}い (hayai)",
              "どちらも (dochira mo)",
              "{広|ひろ}い (hiroi)",
              "{近|ちか}い (chikai)"
            ],
            "correct": 2,
            "why": "**{広|ひろ}い** (hiroi) = rộng"
          },
          {
            "q": "Tiếng Nhật của \"tiếc, đáng tiếc\" là từ nào?",
            "options": [
              "どちらも (dochira mo)",
              "{全部|ぜんぶ} (zenbu)",
              "{残念|ざんねん}（な） (zannen (na))",
              "{近|ちか}い (chikai)"
            ],
            "correct": 2,
            "why": "**{残念|ざんねん}（な）** (zannen (na)) = tiếc, đáng tiếc (đáp lại khi bị từ chối)"
          },
          {
            "q": "Tiếng Nhật của \"cái nào, bên nào (trong hai)\" là từ nào?",
            "options": [
              "どちら (dochira)",
              "{近|ちか}い (chikai)",
              "{広|ひろ}い (hiroi)",
              "{全部|ぜんぶ} (zenbu)"
            ],
            "correct": 0,
            "why": "**どちら** (dochira) = cái nào, bên nào (chọn 1 trong 2); cũng là どこ lịch sự"
          },
          {
            "q": "Tiếng Nhật của \"cả hai\" là từ nào?",
            "options": [
              "{広|ひろ}い (hiroi)",
              "{近|ちか}い (chikai)",
              "{早|はや}い (hayai)",
              "どちらも (dochira mo)"
            ],
            "correct": 3,
            "why": "**どちらも** (dochira mo) = cả hai, bên nào cũng"
          },
          {
            "q": "Tiếng Nhật của \"nhất, số một\" là từ nào?",
            "options": [
              "いちばん (ichiban)",
              "{全部|ぜんぶ} (zenbu)",
              "どちら (dochira)",
              "{遠|とお}い (tooi)"
            ],
            "correct": 0,
            "why": "**いちばん** (ichiban) = nhất, số một"
          },
          {
            "q": "Tiếng Nhật của \"tất cả, toàn bộ\" là từ nào?",
            "options": [
              "{遠|とお}い (tooi)",
              "{早|はや}い (hayai)",
              "{全部|ぜんぶ} (zenbu)",
              "{残念|ざんねん}（な） (zannen (na))"
            ],
            "correct": 2,
            "why": "**{全部|ぜんぶ}** (zenbu) = tất cả, toàn bộ"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-vj3",
        "title": "Việt → Nhật — nhóm F–G: động từ · câu giao tiếp (14 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"có (hẹn, việc, sự kiện)\" là từ nào?",
            "options": [
              "あります (arimasu)",
              "まだ (mada)",
              "{一緒|いっしょ}に (issho ni)",
              "ぜひ (zehi)"
            ],
            "correct": 0,
            "why": "**あります** (arimasu) = có (Bài 6: có hẹn, có việc, có sự kiện, có vé; khác Bài 4: ở đâu có cái gì)"
          },
          {
            "q": "Tiếng Nhật của \"chơi, đi chơi\" là từ nào?",
            "options": [
              "{一緒|いっしょ}に (issho ni)",
              "{遊|あそ}びます (asobimasu)",
              "あります (arimasu)",
              "ぜひ (zehi)"
            ],
            "correct": 1,
            "why": "**{遊|あそ}びます** (asobimasu) = chơi, đi chơi (遊びに行きます = đi chơi)"
          },
          {
            "q": "Tiếng Nhật của \"cùng nhau, cùng với\" là từ nào?",
            "options": [
              "{一緒|いっしょ}に (issho ni)",
              "{遊|あそ}びます (asobimasu)",
              "ぜひ (zehi)",
              "まだ (mada)"
            ],
            "correct": 0,
            "why": "**{一緒|いっしょ}に** (issho ni) = cùng nhau, cùng với"
          },
          {
            "q": "Tiếng Nhật của \"nhất định (muốn)\" là từ nào?",
            "options": [
              "{遊|あそ}びます (asobimasu)",
              "まだ (mada)",
              "ぜひ (zehi)",
              "もう (mou)"
            ],
            "correct": 2,
            "why": "**ぜひ** (zehi) = nhất định, rất (muốn) (đi với ～たいです)"
          },
          {
            "q": "Tiếng Nhật của \"chưa\" là từ nào?",
            "options": [
              "まだ (mada)",
              "{一緒|いっしょ}に (issho ni)",
              "あります (arimasu)",
              "もう (mou)"
            ],
            "correct": 0,
            "why": "**まだ** (mada) = chưa; vẫn (いいえ、まだです = chưa)"
          },
          {
            "q": "Tiếng Nhật của \"đã, rồi\" là từ nào?",
            "options": [
              "{遊|あそ}びます (asobimasu)",
              "{一緒|いっしょ}に (issho ni)",
              "もう (mou)",
              "ぜひ (zehi)"
            ],
            "correct": 2,
            "why": "**もう** (mou) = đã, rồi (もう～ましたか = đã … chưa?)"
          },
          {
            "q": "Tiếng Nhật của \"hay đấy (nhận lời rủ)\" là từ nào?",
            "options": [
              "ああ (aa)",
              "わあ (waa)",
              "すみません (sumimasen)",
              "いいですね (ii desu ne)"
            ],
            "correct": 3,
            "why": "**いいですね** (ii desu ne) = hay đấy, được đấy (nhận lời rủ)"
          },
          {
            "q": "Tiếng Nhật của \"à, ồ (trước khi từ chối)\" là từ nào?",
            "options": [
              "そうですねえ (sou desu nee)",
              "ああ (aa)",
              "すみません (sumimasen)",
              "わあ (waa)"
            ],
            "correct": 1,
            "why": "**ああ** (aa) = à, ồ (mở đầu câu, nhất là trước khi từ chối)"
          },
          {
            "q": "Tiếng Nhật của \"xin lỗi\" là từ nào?",
            "options": [
              "すみません (sumimasen)",
              "そうしましょう (sou shimashou)",
              "また{今度|こんど} (mata kondo)",
              "わあ (waa)"
            ],
            "correct": 0,
            "why": "**すみません** (sumimasen) = xin lỗi (khi từ chối lời rủ)"
          },
          {
            "q": "Tiếng Nhật của \"hẹn lần sau\" là từ nào?",
            "options": [
              "ああ (aa)",
              "また{今度|こんど} (mata kondo)",
              "すみません (sumimasen)",
              "わかりました (wakarimashita)"
            ],
            "correct": 1,
            "why": "**また{今度|こんど}** (mata kondo) = hẹn lần sau (khi lời rủ không thành)"
          },
          {
            "q": "Tiếng Nhật của \"oa (ngạc nhiên, vui)\" là từ nào?",
            "options": [
              "そうですねえ (sou desu nee)",
              "わあ (waa)",
              "ああ (aa)",
              "そうしましょう (sou shimashou)"
            ],
            "correct": 1,
            "why": "**わあ** (waa) = oa (ngạc nhiên, vui mừng)"
          },
          {
            "q": "Tiếng Nhật của \"để xem nào… (ngập ngừng)\" là từ nào?",
            "options": [
              "そうしましょう (sou shimashou)",
              "また{今度|こんど} (mata kondo)",
              "わかりました (wakarimashita)",
              "そうですねえ (sou desu nee)"
            ],
            "correct": 3,
            "why": "**そうですねえ** (sou desu nee) = để xem nào…, ừ thì… (ngập ngừng khi đang nghĩ câu trả lời; kéo dài ねえ)"
          },
          {
            "q": "Tiếng Nhật của \"cứ làm như thế đi (đồng ý đề xuất)\" là từ nào?",
            "options": [
              "そうですねえ (sou desu nee)",
              "そうしましょう (sou shimashou)",
              "すみません (sumimasen)",
              "ああ (aa)"
            ],
            "correct": 1,
            "why": "**そうしましょう** (sou shimashou) = làm như thế đi, cứ vậy nhé (đồng ý với đề xuất)"
          },
          {
            "q": "Tiếng Nhật của \"tôi hiểu rồi (nhận thông tin)\" là từ nào?",
            "options": [
              "すみません (sumimasen)",
              "また{今度|こんど} (mata kondo)",
              "ああ (aa)",
              "わかりました (wakarimashita)"
            ],
            "correct": 3,
            "why": "**わかりました** (wakarimashita) = tôi hiểu rồi, được rồi (chấp nhận thông tin, lời hẹn)"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · khác loại · điền từ vào câu · gõ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-khac-loai",
        "title": "Từ nào KHÁC loại? (7 câu)",
        "items": [
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (món ăn)",
            "options": [
              "すき{焼|や}き (Sukiyaki)",
              "ラーメン (Raamen)",
              "{焼|や}き{肉|にく} (Yakiniku)",
              "{地下鉄|ちかてつ} (Chikatetsu)"
            ],
            "correct": 3,
            "why": "Ba từ kia là món ăn; **地下鉄** là phương tiện (tàu điện ngầm)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (thời gian)",
            "options": [
              "{今月|こんげつ} (Kongetsu)",
              "{今週|こんしゅう} (Konshuu)",
              "{映画館|えいがかん} (Eigakan)",
              "{来月|らいげつ} (Raigetsu)"
            ],
            "correct": 2,
            "why": "Ba từ kia nói về thời gian; **映画館** là nơi chốn (rạp phim)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (loại từ)",
            "options": [
              "{広|ひろ}い (Hiroi)",
              "{遠|とお}い (Tooi)",
              "{近|ちか}い (Chikai)",
              "{約束|やくそく} (Yakusoku)"
            ],
            "correct": 3,
            "why": "Ba từ kia là tính từ い; **約束** là danh từ (cuộc hẹn)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (âm nhạc)",
            "options": [
              "{歌手|かしゅ} (Kashu)",
              "{水着|みずぎ} (Mizugi)",
              "コンサート (Konsaato)",
              "ジャズ (Jazu)"
            ],
            "correct": 1,
            "why": "Ba từ kia thuộc âm nhạc; **水着** là đồ bơi."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (nhận lời hay từ chối)",
            "options": [
              "そうしましょう (Soushimashou)",
              "ぜひ (Zehi)",
              "また{今度|こんど} (Mata kondo)",
              "いいですね (Ii desu ne)"
            ],
            "correct": 2,
            "why": "Ba cụm kia là NHẬN LỜI; **また今度** = hẹn lần sau, là cách từ chối khéo."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (hoạt động)",
            "options": [
              "ドライブ (Doraibu)",
              "{地図|ちず} (Chizu)",
              "コンサート (Konsaato)",
              "カラオケ (Karaoke)"
            ],
            "correct": 1,
            "why": "Ba từ kia là hoạt động/sự kiện giải trí; **地図** là một đồ vật (bản đồ)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (món ăn và quán)",
            "options": [
              "お{好|この}み{焼|や}き (Okonomiyaki)",
              "すき{焼|や}き (Sukiyaki)",
              "{居酒屋|いざかや} (Izakaya)",
              "ラーメン (Raamen)"
            ],
            "correct": 2,
            "why": "Ba từ kia là món ăn; **居酒屋** là quán (nơi chốn)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-dien-cau",
        "title": "Điền từ vào câu — có nghĩa tiếng Việt kèm theo (18 câu)",
        "items": [
          {
            "q": "＿＿の{土曜日|どようび}、{友達|ともだち}と{会|あ}います。　〔__ no doyoubi, tomodachi to aimasu.〕　— Thứ Bảy tuần sau tôi gặp bạn.",
            "options": [
              "{来週|らいしゅう}",
              "{季節|きせつ}",
              "{今月|こんげつ}",
              "{来月|らいげつ}"
            ],
            "correct": 0,
            "why": "**来週** = tuần sau. → **{来週|らいしゅう}の{土曜日|どようび}、{友達|ともだち}と{会|あ}います。** 〔Raishuu no doyoubi, tomodachi to aimasu.〕 — Thứ Bảy tuần sau tôi gặp bạn."
          },
          {
            "q": "＿＿は{忙|いそが}しいです。{来月|らいげつ}はひまです。　〔__ wa isogashii desu. Raigetsu wa hima desu.〕　— Tháng này bận. Tháng sau rảnh.",
            "options": [
              "{今週|こんしゅう}",
              "{来週|らいしゅう}",
              "{季節|きせつ}",
              "{今月|こんげつ}"
            ],
            "correct": 3,
            "why": "**今月** = tháng này. → **{今月|こんげつ}は{忙|いそが}しいです。{来月|らいげつ}はひまです。** 〔Kongetsu wa isogashii desu. Raigetsu wa hima desu.〕 — Tháng này bận. Tháng sau rảnh."
          },
          {
            "q": "{夏|なつ}は＿＿の{中|なか}でいちばん{暑|あつ}いです。　〔Natsu wa __ no naka de ichiban atsui desu.〕　— Mùa hè là mùa nóng nhất trong các mùa.",
            "options": [
              "{季節|きせつ}",
              "{用事|ようじ}",
              "{野球|やきゅう}",
              "{約束|やくそく}"
            ],
            "correct": 0,
            "why": "**季節** = mùa. → **{夏|なつ}は{季節|きせつ}の{中|なか}でいちばん{暑|あつ}いです。** 〔Natsu wa kisetsu no naka de ichiban atsui desu.〕 — Mùa hè là mùa nóng nhất trong các mùa."
          },
          {
            "q": "{今日|きょう}は＿＿があります。すみません、ちょっと……　〔Kyou wa __ ga arimasu. Sumimasen, chotto...〕　— Hôm nay tôi có việc bận. Xin lỗi, hơi…",
            "options": [
              "{用事|ようじ}",
              "{季節|きせつ}",
              "チケット",
              "{地図|ちず}"
            ],
            "correct": 0,
            "why": "**用事** = việc bận — lý do từ chối lịch sự. → **{今日|きょう}は{用事|ようじ}があります。すみません、ちょっと……** 〔Kyou wa youji ga arimasu. Sumimasen, chotto...〕 — Hôm nay tôi có việc bận. Xin lỗi, hơi…"
          },
          {
            "q": "{今週|こんしゅう}の{日曜日|にちようび}、＿＿があります。{山田|やまだ}さんと{会|あ}います。　〔Konshuu no nichiyoubi, __ ga arimasu. Yamadasan to aimasu.〕　— Chủ nhật tuần này tôi có hẹn. Tôi gặp anh Yamada.",
            "options": [
              "{季節|きせつ}",
              "ジャズ",
              "{約束|やくそく}",
              "{地図|ちず}"
            ],
            "correct": 2,
            "why": "**約束** = cuộc hẹn. → **{今週|こんしゅう}の{日曜日|にちようび}、{約束|やくそく}があります。{山田|やまだ}さんと{会|あ}います。** 〔Konshuu no nichiyoubi, yakusoku ga arimasu. Yamadasan to aimasu.〕 — Chủ nhật tuần này tôi có hẹn. Tôi gặp anh Yamada."
          },
          {
            "q": "{野球|やきゅう}の＿＿を{見|み}に{行|い}きませんか。　〔Yakyuu no __ o mi ni ikimasen ka.〕　— Cùng đi xem trận bóng chày không?",
            "options": [
              "{地図|ちず}",
              "{季節|きせつ}",
              "{水着|みずぎ}",
              "{試合|しあい}"
            ],
            "correct": 3,
            "why": "**試合** = trận đấu. → **{野球|やきゅう}の{試合|しあい}を{見|み}に{行|い}きませんか。** 〔Yakyuu no shiai o mi ni ikimasen ka.〕 — Cùng đi xem trận bóng chày không?"
          },
          {
            "q": "コンサートの＿＿が{二枚|にまい}あります。　〔Konsaato no __ ga nimai arimasu.〕　— Tôi có hai vé hoà nhạc.",
            "options": [
              "{季節|きせつ}",
              "チケット",
              "{地図|ちず}",
              "{水着|みずぎ}"
            ],
            "correct": 1,
            "why": "**チケット** = vé. → **コンサートのチケットが{二枚|にまい}あります。** 〔Konsaato no chiketto ga nimai arimasu.〕 — Tôi có hai vé hoà nhạc."
          },
          {
            "q": "＿＿を{見|み}て、{駅|えき}まで{行|い}きます。　〔__ o mite, eki made ikimasu.〕　— Xem bản đồ rồi đi đến ga.",
            "options": [
              "ジャズ",
              "{水着|みずぎ}",
              "チケット",
              "{地図|ちず}"
            ],
            "correct": 3,
            "why": "**地図** = bản đồ. → **{地図|ちず}を{見|み}て、{駅|えき}まで{行|い}きます。** 〔Chizu o mite, eki made ikimasu.〕 — Xem bản đồ rồi đi đến ga."
          },
          {
            "q": "{夏|なつ}、＿＿のセールがあります。　〔Natsu, __ no seeru ga arimasu.〕　— Mùa hè có đợt giảm giá đồ bơi.",
            "options": [
              "{歌手|かしゅ}",
              "{水着|みずぎ}",
              "{地図|ちず}",
              "{野球|やきゅう}"
            ],
            "correct": 1,
            "why": "**水着** = đồ bơi; セール = đợt giảm giá. → **{夏|なつ}、{水着|みずぎ}のセールがあります。** 〔Natsu, mizugi no seeru ga arimasu.〕 — Mùa hè có đợt giảm giá đồ bơi."
          },
          {
            "q": "＿＿のコンサートに{行|い}きます。　〔__ no konsaato ni ikimasu.〕　— Tôi đi buổi hoà nhạc của ca sĩ.",
            "options": [
              "{歌手|かしゅ}",
              "{焼|や}き{肉|にく}",
              "{地下鉄|ちかてつ}",
              "{季節|きせつ}"
            ],
            "correct": 0,
            "why": "**歌手** = ca sĩ. → **{歌手|かしゅ}のコンサートに{行|い}きます。** 〔Kashu no konsaato ni ikimasu.〕 — Tôi đi buổi hoà nhạc của ca sĩ."
          },
          {
            "q": "{今晩|こんばん}、＿＿に{行|い}きませんか。{安|やす}いお{酒|さけ}と{料理|りょうり}があります。　〔Konban, __ ni ikimasen ka. Yasui osake to ryouri ga arimasu.〕　— Tối nay đi quán nhậu không? Có rượu và món rẻ.",
            "options": [
              "{映画館|えいがかん}",
              "{居酒屋|いざかや}",
              "{季節|きせつ}",
              "{地下鉄|ちかてつ}"
            ],
            "correct": 1,
            "why": "**居酒屋** = quán nhậu kiểu Nhật. → **{今晩|こんばん}、{居酒屋|いざかや}に{行|い}きませんか。{安|やす}いお{酒|さけ}と{料理|りょうり}があります。** 〔Konban, izakaya ni ikimasen ka. Yasui osake to ryouri ga arimasu.〕 — Tối nay đi quán nhậu không? Có rượu và món rẻ."
          },
          {
            "q": "＿＿で{映画|えいが}を{見|み}ます。　〔__ de eiga o mimasu.〕　— Xem phim ở rạp chiếu phim.",
            "options": [
              "{地下鉄|ちかてつ}",
              "{野球|やきゅう}",
              "{居酒屋|いざかや}",
              "{映画館|えいがかん}"
            ],
            "correct": 3,
            "why": "**映画館** = rạp chiếu phim. → **{映画館|えいがかん}で{映画|えいが}を{見|み}ます。** 〔Eigakan de eiga o mimasu.〕 — Xem phim ở rạp chiếu phim."
          },
          {
            "q": "＿＿で{新宿|しんじゅく}へ{行|い}きます。{早|はや}いです。　〔__ de shinjuku e ikimasu. Hayai desu.〕　— Đi đến Shinjuku bằng tàu điện ngầm. Nhanh.",
            "options": [
              "{映画館|えいがかん}",
              "{居酒屋|いざかや}",
              "{地下鉄|ちかてつ}",
              "カラオケ"
            ],
            "correct": 2,
            "why": "で (phương tiện) + **地下鉄**. → **{地下鉄|ちかてつ}で{新宿|しんじゅく}へ{行|い}きます。{早|はや}いです。** 〔Chikatetsu de shinjuku e ikimasu. Hayai desu.〕 — Đi đến Shinjuku bằng tàu điện ngầm. Nhanh."
          },
          {
            "q": "{駅|えき}は{家|うち}から＿＿ですから、{歩|ある}いて{行|い}きます。　〔Eki wa uchi kara __ desu kara, aruite ikimasu.〕　— Ga gần nhà nên tôi đi bộ.",
            "options": [
              "{遠|とお}い",
              "{近|ちか}い",
              "{残念|ざんねん}",
              "{広|ひろ}い"
            ],
            "correct": 1,
            "why": "**近い** = gần. → **{駅|えき}は{家|うち}から{近|ちか}いですから、{歩|ある}いて{行|い}きます。** 〔Eki wa uchi kara chikai desu kara, aruite ikimasu.〕 — Ga gần nhà nên tôi đi bộ."
          },
          {
            "q": "{私|わたし}の{部屋|へや}は＿＿です。　〔Watashi no heya wa __ desu.〕　— Phòng của tôi rộng.",
            "options": [
              "{広|ひろ}い",
              "{近|ちか}い",
              "{遠|とお}い",
              "{残念|ざんねん}"
            ],
            "correct": 0,
            "why": "**広い** = rộng. → **{私|わたし}の{部屋|へや}は{広|ひろ}いです。** 〔Watashi no heya wa hiroi desu.〕 — Phòng của tôi rộng."
          },
          {
            "q": "＿＿ですね。また{今度|こんど}{行|い}きましょう。　〔__ desu ne. Mata kondo ikimashou.〕　— Tiếc quá nhỉ. Lần sau đi nhé.",
            "options": [
              "{残念|ざんねん}",
              "{広|ひろ}い",
              "{近|ちか}い",
              "{早|はや}い"
            ],
            "correct": 0,
            "why": "**残念ですね** = đáng tiếc nhỉ (đáp lại khi bị từ chối). → **{残念|ざんねん}ですね。また{今度|こんど}{行|い}きましょう。** 〔Zannen desu ne. Mata kondo ikimashou.〕 — Tiếc quá nhỉ. Lần sau đi nhé."
          },
          {
            "q": "＿＿に{行|い}きませんか。いっしょに{歌|うた}います。　〔__ ni ikimasen ka. Isshoni utaimasu.〕　— Cùng đi karaoke không? Cùng hát.",
            "options": [
              "{映画館|えいがかん}",
              "ドライブ",
              "カラオケ",
              "{野球|やきゅう}"
            ],
            "correct": 2,
            "why": "**カラオケ**. → **カラオケに{行|い}きませんか。いっしょに{歌|うた}います。** 〔Karaoke ni ikimasen ka. Isshoni utaimasu.〕 — Cùng đi karaoke không? Cùng hát."
          },
          {
            "q": "{日曜日|にちようび}、＿＿をしました。{車|くるま}で{海|うみ}へ{行|い}きました。　〔Nichiyoubi, __ o shimashita. Kuruma de umi e ikimashita.〕　— Chủ nhật tôi đi lái xe đi chơi. Đi ra biển bằng ô tô.",
            "options": [
              "カラオケ",
              "コンサート",
              "ドライブ",
              "セール"
            ],
            "correct": 2,
            "why": "**ドライブ** (ドライブをします／ドライブに行きます). → **{日曜日|にちようび}、ドライブをしました。{車|くるま}で{海|うみ}へ{行|い}きました。** 〔Nichiyoubi, doraibu o shimashita. Kuruma de umi e ikimashita.〕 — Chủ nhật tôi đi lái xe đi chơi. Đi ra biển bằng ô tô."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-tv-go-tu",
        "title": "Gõ từ tiếng Nhật theo nghĩa (16 câu)",
        "kind": "translate",
        "items": [
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tuần sau\"",
            "answers": [
              "来週",
              "らいしゅう"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tháng này\"",
            "answers": [
              "今月",
              "こんげつ"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cuộc hẹn\"",
            "answers": [
              "約束",
              "やくそく"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"trận đấu\"",
            "answers": [
              "試合",
              "しあい"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bóng chày\"",
            "answers": [
              "野球",
              "やきゅう"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bản đồ\"",
            "answers": [
              "地図",
              "ちず"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"ca sĩ\"",
            "answers": [
              "歌手",
              "かしゅ"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đồ bơi\"",
            "answers": [
              "水着",
              "みずぎ"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tàu điện ngầm\"",
            "answers": [
              "地下鉄",
              "ちかてつ"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"rạp chiếu phim\"",
            "answers": [
              "映画館",
              "えいがかん"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"quán nhậu kiểu Nhật\"",
            "answers": [
              "居酒屋",
              "いざかや"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"gần\"",
            "answers": [
              "近い",
              "ちかい"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"xa\"",
            "answers": [
              "遠い",
              "とおい"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"rộng\"",
            "answers": [
              "広い",
              "ひろい"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cùng nhau\"",
            "answers": [
              "一緒に",
              "いっしょに"
            ],
            "hint": "Gõ hiragana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"mùa\"",
            "answers": [
              "季節",
              "きせつ"
            ],
            "hint": "Gõ hiragana cũng được."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · câu hoàn chỉnh · tìm câu SAI · dịch"
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-sai",
        "title": "Tìm câu SAI (6 câu)",
        "items": [
          {
            "q": "(あります) Câu nào SAI?",
            "options": [
              "{明日|あした}、{用事|ようじ}をあります。 (Ashita, youji o arimasu.)",
              "{今週|こんしゅう}、{約束|やくそく}があります。 (Konshuu, yakusoku ga arimasu.)",
              "{来月|らいげつ}、コンサートがあります。 (Raigetsu, konsaato ga arimasu.)",
              "{明日|あした}、{用事|ようじ}があります。 (Ashita, youji ga arimasu.)"
            ],
            "correct": 0,
            "why": "Có việc/hẹn/sự kiện → **N が あります**, không dùng を."
          },
          {
            "q": "(tính từ) Câu nào SAI?",
            "options": [
              "{残念|ざんねん}ですね。 (Zannen desu ne.)",
              "{近|ちか}いですね。 (Chikai desu ne.)",
              "{広|ひろ}いですね。 (Hiroi desu ne.)",
              "{残念|ざんねん}いですね。 (Zannen'i desu ne.)"
            ],
            "correct": 3,
            "why": "**残念** là tính từ な (không gắn い): 残念です."
          },
          {
            "q": "(đếm) Câu nào SAI?",
            "options": [
              "チケットが{二枚|にまい}あります。 (Chiketto ga nimai arimasu.)",
              "いすが{二|ふた}つあります。 (Isu ga futatsu arimasu.)",
              "チケットが{二|ふた}つあります。 (Chiketto ga futatsu arimasu.)",
              "{地図|ちず}が{三枚|さんまい}あります。 (Chizu ga sanmai arimasu.)"
            ],
            "correct": 2,
            "why": "Vé là vật mỏng → đếm bằng **～枚**; ghế (vật khối) dùng ～つ."
          },
          {
            "q": "(so sánh) Câu nào SAI?",
            "options": [
              "{食|た}べ{物|もの}で、{何|なに}がいちばん{好|す}きですか。 (Tabemono de, nani ga ichiban suki desu ka.)",
              "ラーメンと{焼|や}き{肉|にく}と、どちらが{好|す}きですか。 (Raamen to yakiniku to, dochiraga suki desu ka.)",
              "ラーメンと{焼|や}き{肉|にく}で、どちらがいちばん{好|す}きですか。 (Raamen to yakiniku de, dochiraga ichiban suki desu ka.)",
              "{季節|きせつ}で、いつがいちばん{好|す}きですか。 (Kisetsu de, itsuga ichiban suki desu ka.)"
            ],
            "correct": 2,
            "why": "Chọn 1 trong 2 → **どちらが**; chọn nhất trong nhiều → **いちばん**. Không trộn hai kiểu."
          },
          {
            "q": "(ドライブ) Câu nào SAI?",
            "options": [
              "ドライブをします。 (Doraibu o shimasu.)",
              "ドライブを{行|い}きます。 (Doraibu o ikimasu.)",
              "{海|うみ}へドライブに{行|い}きます。 (Umi e doraibu ni ikimasu.)",
              "ドライブに{行|い}きます。 (Doraibu ni ikimasu.)"
            ],
            "correct": 1,
            "why": "**ドライブに行きます** hoặc **ドライブをします**; không nói ドライブを行きます."
          },
          {
            "q": "(どちらも) Câu nào SAI?",
            "options": [
              "どちらも{好|す}きです。 (Dochiramo suki desu.)",
              "どちらもが{広|ひろ}いです。 (Dochiramo ga hiroi desu.)",
              "どちらも{広|ひろ}いです。 (Dochiramo hiroi desu.)",
              "どちらも{安|やす}いです。 (Dochiramo yasui desu.)"
            ],
            "correct": 1,
            "why": "**どちらも** đứng thẳng trước vị ngữ, không gắn が."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-tv-nhat-viet",
        "title": "Đọc câu Nhật → chọn nghĩa Việt đúng (6 câu)",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {今週|こんしゅう}は{用事|ようじ}がありますから、{来週|らいしゅう}はどうですか。　〔Konshuu wa youji ga arimasu kara, raishuu wa dou desu ka.〕",
            "options": [
              "Tuần này rảnh nên tuần sau cũng đi nhé.",
              "Tuần sau tôi có việc bận, tuần này thì sao?",
              "Tuần này tôi có hẹn, tuần sau thì sao?",
              "Tuần này tôi có việc bận, tuần sau thì sao?"
            ],
            "correct": 3,
            "why": "今週 = tuần này, 来週 = tuần sau; 用事 = việc bận."
          },
          {
            "q": "Câu này nghĩa là gì? ざんねんですね。また{今度|こんど}。　〔Zannen desu ne. Mata kondo.〕",
            "options": [
              "Tiếc quá nhỉ. Hẹn lần sau nhé.",
              "Hay quá nhỉ. Đi thôi.",
              "Tiếc quá, tôi nhất định đi.",
              "Xin lỗi. Tôi hiểu rồi."
            ],
            "correct": 0,
            "why": "残念ですね = đáng tiếc nhỉ; また今度 = hẹn lần sau."
          },
          {
            "q": "Câu này nghĩa là gì? {野球|やきゅう}の{試合|しあい}のチケットが{二枚|にまい}あります。　〔Yakyuu no shiai no chiketto ga nimai arimasu.〕",
            "options": [
              "Có hai trận bóng chày.",
              "Tôi có hai vé xem phim.",
              "Tôi có hai bản đồ trận bóng chày.",
              "Tôi có hai vé xem trận bóng chày."
            ],
            "correct": 3,
            "why": "試合 = trận đấu; チケット～枚 = ~ vé."
          },
          {
            "q": "Câu này nghĩa là gì? {映画館|えいがかん}は{駅|えき}から{近|ちか}いですが、{居酒屋|いざかや}は{遠|とお}いです。　〔Eigakan wa eki kara chikai desu ga, izakaya wa tooi desu.〕",
            "options": [
              "Rạp phim gần ga nên quán nhậu cũng gần.",
              "Rạp phim xa ga nhưng quán nhậu thì gần.",
              "Rạp phim gần ga nhưng quán nhậu thì xa.",
              "Rạp phim và quán nhậu đều gần ga."
            ],
            "correct": 2,
            "why": "近い = gần, 遠い = xa; が = nhưng."
          },
          {
            "q": "Câu này nghĩa là gì? いいですね。ぜひ{行|い}きましょう。　〔Ii desu ne. Zehi ikimashou.〕",
            "options": [
              "Hay đấy. Nhất định đi nhé.",
              "Hay đấy. Hẹn lần sau nhé.",
              "Xin lỗi, tôi có việc bận.",
              "Tôi hiểu rồi. Không đi."
            ],
            "correct": 0,
            "why": "いいですね = nhận lời; ぜひ = nhất định."
          },
          {
            "q": "Câu này nghĩa là gì? すき{焼|や}きとお{好|この}み{焼|や}き、どちらもおいしいです。　〔Sukiyaki to okonomiyaki, dochiramo oishii desu.〕",
            "options": [
              "Sukiyaki ngon hơn okonomiyaki.",
              "Sukiyaki và okonomiyaki, món nào cũng ngon.",
              "Sukiyaki và okonomiyaki đều đắt.",
              "Chỉ okonomiyaki ngon."
            ],
            "correct": 1,
            "why": "どちらも = cả hai."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-tv-dich",
        "title": "Dịch Việt → Nhật bằng từ của bài (10 câu)",
        "kind": "translate",
        "grammar": "N が あります · V ませんか · A い/な です · どちらも",
        "items": [
          {
            "q": "Tuần sau tôi có hẹn.",
            "answers": [
              "来週、約束があります。",
              "来週、やくそくがあります。",
              "らいしゅう、約束があります。",
              "らいしゅう、やくそくがあります。",
              "来週は約束があります。",
              "来週はやくそくがあります。",
              "らいしゅうは約束があります。",
              "らいしゅうはやくそくがあります。",
              "私は来週、約束があります。",
              "私は来週、やくそくがあります。",
              "私はらいしゅう、約束があります。",
              "私はらいしゅう、やくそくがあります。",
              "わたしは来週、約束があります。",
              "わたしは来週、やくそくがあります。",
              "わたしはらいしゅう、約束があります。",
              "わたしはらいしゅう、やくそくがあります。"
            ],
            "hint": "N が あります · 来週 · 約束"
          },
          {
            "q": "Tháng sau cùng đi ăn thịt nướng nhé?",
            "answers": [
              "来月、一緒に焼き肉を食べませんか。",
              "来月、一緒に焼き肉をたべませんか。",
              "来月、一緒に焼きにくを食べませんか。",
              "来月、一緒に焼きにくをたべませんか。",
              "来月、一緒にやき肉を食べませんか。",
              "来月、一緒にやき肉をたべませんか。",
              "来月、一緒にやきにくを食べませんか。",
              "来月、一緒にやきにくをたべませんか。",
              "来月、いっしょに焼き肉を食べませんか。",
              "来月、いっしょに焼き肉をたべませんか。",
              "来月、いっしょに焼きにくを食べませんか。",
              "来月、いっしょに焼きにくをたべませんか。",
              "来月、いっしょにやき肉を食べませんか。",
              "来月、いっしょにやき肉をたべませんか。",
              "来月、いっしょにやきにくを食べませんか。",
              "来月、いっしょにやきにくをたべませんか。",
              "らいげつ、一緒に焼き肉を食べませんか。",
              "らいげつ、一緒に焼き肉をたべませんか。",
              "らいげつ、一緒に焼きにくを食べませんか。",
              "らいげつ、一緒に焼きにくをたべませんか。",
              "らいげつ、一緒にやき肉を食べませんか。",
              "らいげつ、一緒にやき肉をたべませんか。",
              "らいげつ、一緒にやきにくを食べませんか。",
              "らいげつ、一緒にやきにくをたべませんか。",
              "らいげつ、いっしょに焼き肉を食べませんか。",
              "らいげつ、いっしょに焼き肉をたべませんか。",
              "らいげつ、いっしょに焼きにくを食べませんか。",
              "らいげつ、いっしょに焼きにくをたべませんか。",
              "らいげつ、いっしょにやき肉を食べませんか。",
              "らいげつ、いっしょにやき肉をたべませんか。",
              "らいげつ、いっしょにやきにくを食べませんか。",
              "らいげつ、いっしょにやきにくをたべませんか。"
            ],
            "hint": "V ませんか · 焼き肉"
          },
          {
            "q": "Ngày mai tôi có việc bận.",
            "answers": [
              "明日、用事があります。",
              "明日、ようじがあります。",
              "あした、用事があります。",
              "あした、ようじがあります。",
              "明日は用事があります。",
              "明日はようじがあります。",
              "あしたは用事があります。",
              "あしたはようじがあります。"
            ],
            "hint": "N が あります · 用事"
          },
          {
            "q": "Ga thì gần. Rạp chiếu phim thì xa.",
            "answers": [
              "駅は近いです。映画館は遠いです。",
              "駅は近いです。映画館はとおいです。",
              "駅は近いです。えいがかんは遠いです。",
              "駅は近いです。えいがかんはとおいです。",
              "駅はちかいです。映画館は遠いです。",
              "駅はちかいです。映画館はとおいです。",
              "駅はちかいです。えいがかんは遠いです。",
              "駅はちかいです。えいがかんはとおいです。",
              "えきは近いです。映画館は遠いです。",
              "えきは近いです。映画館はとおいです。",
              "えきは近いです。えいがかんは遠いです。",
              "えきは近いです。えいがかんはとおいです。",
              "えきはちかいです。映画館は遠いです。",
              "えきはちかいです。映画館はとおいです。",
              "えきはちかいです。えいがかんは遠いです。",
              "えきはちかいです。えいがかんはとおいです。"
            ],
            "hint": "A い です · は"
          },
          {
            "q": "Tôi có hai vé hoà nhạc.",
            "answers": [
              "コンサートのチケットが二枚あります。",
              "コンサートのチケットがにまいあります。",
              "私はコンサートのチケットが二枚あります。",
              "私はコンサートのチケットがにまいあります。",
              "わたしはコンサートのチケットが二枚あります。",
              "わたしはコンサートのチケットがにまいあります。"
            ],
            "hint": "～枚 · チケット"
          },
          {
            "q": "Xin lỗi, hẹn lần sau nhé.",
            "answers": [
              "すみません。また今度。",
              "すみません。またこんど。",
              "すみません、また今度。",
              "すみません、またこんど。"
            ],
            "hint": "すみません · また今度"
          },
          {
            "q": "Bên nào cũng rộng.",
            "answers": [
              "どちらも広いです。",
              "どちらもひろいです。"
            ],
            "hint": "どちらも"
          },
          {
            "q": "Tôi đi chơi cùng bạn.",
            "answers": [
              "友達と遊びに行きます。",
              "友達と遊びにいきます。",
              "友達とあそびに行きます。",
              "友達とあそびにいきます。",
              "ともだちと遊びに行きます。",
              "ともだちと遊びにいきます。",
              "ともだちとあそびに行きます。",
              "ともだちとあそびにいきます。",
              "友達と一緒に遊びに行きます。",
              "友達と一緒に遊びにいきます。",
              "友達と一緒にあそびに行きます。",
              "友達と一緒にあそびにいきます。",
              "友達といっしょに遊びに行きます。",
              "友達といっしょに遊びにいきます。",
              "友達といっしょにあそびに行きます。",
              "友達といっしょにあそびにいきます。",
              "ともだちと一緒に遊びに行きます。",
              "ともだちと一緒に遊びにいきます。",
              "ともだちと一緒にあそびに行きます。",
              "ともだちと一緒にあそびにいきます。",
              "ともだちといっしょに遊びに行きます。",
              "ともだちといっしょに遊びにいきます。",
              "ともだちといっしょにあそびに行きます。",
              "ともだちといっしょにあそびにいきます。"
            ],
            "hint": "遊びに行きます"
          },
          {
            "q": "Tôi nhất định muốn đi tour du lịch.",
            "answers": [
              "ぜひツアーに行きたいです。",
              "ぜひツアーにいきたいです。",
              "私はぜひツアーに行きたいです。",
              "私はぜひツアーにいきたいです。",
              "わたしはぜひツアーに行きたいです。",
              "わたしはぜひツアーにいきたいです。"
            ],
            "hint": "ぜひ ～たいです"
          },
          {
            "q": "Bóng chày và nhạc jazz, tôi thích cả hai.",
            "answers": [
              "野球とジャズ、私はどちらも好きです。",
              "野球とジャズ、私はどちらもすきです。",
              "野球とジャズ、わたしはどちらも好きです。",
              "野球とジャズ、わたしはどちらもすきです。",
              "やきゅうとジャズ、私はどちらも好きです。",
              "やきゅうとジャズ、私はどちらもすきです。",
              "やきゅうとジャズ、わたしはどちらも好きです。",
              "やきゅうとジャズ、わたしはどちらもすきです。",
              "野球もジャズもどちらも好きです。",
              "野球もジャズもどちらもすきです。",
              "やきゅうもジャズもどちらも好きです。",
              "やきゅうもジャズもどちらもすきです。",
              "野球もジャズも好きです。",
              "野球もジャズもすきです。",
              "やきゅうもジャズも好きです。",
              "やきゅうもジャズもすきです。"
            ],
            "hint": "どちらも"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-tv-ghep",
        "title": "Ghép câu bằng từ vựng Bài 6 (6 câu)",
        "items": [
          {
            "vi": "Tuần sau tôi có hẹn.",
            "chips": [
              "います",
              "あります",
              "{来週|らいしゅう}",
              "{約束|やくそく}が",
              "{今週|こんしゅう}"
            ],
            "answer": [
              "{来週|らいしゅう}",
              "{約束|やくそく}が",
              "あります"
            ],
            "ro": "Raishuu yakusoku ga arimasu."
          },
          {
            "vi": "Ga gần nhà.",
            "chips": [
              "{遠|とお}いです",
              "{近|ちか}いです",
              "{駅|えき}は",
              "{家|うち}から"
            ],
            "answer": [
              "{駅|えき}は",
              "{家|うち}から",
              "{近|ちか}いです"
            ],
            "ro": "Eki wa uchi kara chikai desu."
          },
          {
            "vi": "Cùng đi xem trận bóng chày không?",
            "chips": [
              "{試合|しあい}を",
              "{見|み}に",
              "{野球|やきゅう}の",
              "{一緒|いっしょ}に",
              "{行|い}きませんか",
              "{行|い}きます"
            ],
            "answer": [
              "{一緒|いっしょ}に",
              "{野球|やきゅう}の",
              "{試合|しあい}を",
              "{見|み}に",
              "{行|い}きませんか"
            ],
            "ro": "Issho ni yakyuu no shiai o mi ni ikimasen ka?"
          },
          {
            "vi": "Tôi có hai vé hoà nhạc.",
            "chips": [
              "あります",
              "います",
              "{二|ふた}つ",
              "コンサートの",
              "{二枚|にまい}",
              "チケットが"
            ],
            "answer": [
              "コンサートの",
              "チケットが",
              "{二枚|にまい}",
              "あります"
            ],
            "ro": "Konsaato no chiketto ga nimai arimasu."
          },
          {
            "vi": "Cả hai đều rộng.",
            "chips": [
              "どちらも",
              "{近|ちか}いです",
              "{広|ひろ}いです"
            ],
            "answer": [
              "どちらも",
              "{広|ひろ}いです"
            ],
            "ro": "Dochira mo hiroi desu."
          },
          {
            "vi": "Xin lỗi, tôi có việc bận.",
            "chips": [
              "あります",
              "すみません",
              "{用事|ようじ}が",
              "{約束|やくそく}"
            ],
            "answer": [
              "すみません",
              "{用事|ようじ}が",
              "あります"
            ],
            "ro": "Sumimasen youji ga arimasu."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b6-chu-han",
    "kind": "kanji",
    "title": "Luyện thêm Bài 6 · Chữ Hán của lớp (来帰会社聞読書今話) — đọc · nghĩa · chọn chữ · đọc không furigana",
    "goal": "Đọc đúng và hiểu nghĩa 9 chữ Hán của lớp Bài 6 và các từ ghép của chúng, chọn đúng chữ giữa các chữ na ná, và đọc câu/đoạn KHÔNG có furigana như đề thi.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Học chữ Hán **theo từ**, không học âm từng chữ rời: 来週 = らいしゅう, 来ます = きます. Mỗi lần sai, ghi cả TỪ vào sổ.",
          "Cách đọc đổi theo vị trí: **Hán Việt (On)** trong từ ghép (会社 かいしゃ) và **thuần Nhật (Kun)** khi đứng với đuôi kana (会います あいます). Mức Vừa luyện đúng chỗ này.",
          "Mức Khó là **không furigana** như đề thi: đọc to trước, bấm hiện đáp án sau. Bẫy hay gặp: 会社 ≠ 社会, 今日 = きょう, 月 trong 来月 là げつ."
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
          "On / Kun",
          "Từ hay gặp"
        ],
        "rows": [
          [
            "来",
            "đến",
            "LAI — On ライ · Kun く(る)/き(ます)",
            "来週 · 来ます"
          ],
          [
            "帰",
            "về, trở về",
            "QUY — On キ · Kun かえ(る)",
            "帰ります · 帰国"
          ],
          [
            "会",
            "gặp",
            "HỘI — On カイ · Kun あ(う)",
            "会います · 会社 · 会話"
          ],
          [
            "社",
            "công ty; đền thờ (xã)",
            "XÃ — On シャ",
            "会社 · 社会"
          ],
          [
            "聞",
            "nghe; hỏi",
            "VĂN — On ブン · Kun き(く)",
            "聞きます · 新聞"
          ],
          [
            "読",
            "đọc",
            "ĐỘC — On ドク · Kun よ(む)",
            "読みます · 読書"
          ],
          [
            "書",
            "viết",
            "THƯ — On ショ · Kun か(く)",
            "書きます · 読書"
          ],
          [
            "今",
            "bây giờ, nay",
            "KIM — On コン · Kun いま",
            "今 · 今週 · 今月"
          ],
          [
            "話",
            "nói chuyện",
            "THOẠI — On ワ · Kun はな(す)",
            "話します · 電話 · 会話"
          ]
        ],
        "caption": "9 chữ Hán của lớp Bài 6"
      },
      {
        "t": "mcq",
        "id": "lt-b6-kj-nghia",
        "title": "Chữ → nghĩa (9 câu)",
        "items": [
          {
            "q": "Chữ 「来」 mang nghĩa nào?",
            "options": [
              "nghe; hỏi",
              "viết",
              "đến",
              "gặp"
            ],
            "correct": 2,
            "why": "**来** = đến (LAI — On ライ · Kun く(る)/き(ます)). Hay gặp trong: 来週 · 来ます."
          },
          {
            "q": "Chữ 「帰」 mang nghĩa nào?",
            "options": [
              "bây giờ, nay",
              "đọc",
              "về, trở về",
              "công ty; đền thờ (xã)"
            ],
            "correct": 2,
            "why": "**帰** = về, trở về (QUY — On キ · Kun かえ(る)). Hay gặp trong: 帰ります · 帰国."
          },
          {
            "q": "Chữ 「会」 mang nghĩa nào?",
            "options": [
              "viết",
              "nghe; hỏi",
              "nói chuyện",
              "gặp"
            ],
            "correct": 3,
            "why": "**会** = gặp (HỘI — On カイ · Kun あ(う)). Hay gặp trong: 会います · 会社 · 会話."
          },
          {
            "q": "Chữ 「社」 mang nghĩa nào?",
            "options": [
              "bây giờ, nay",
              "đọc",
              "công ty; đền thờ (xã)",
              "đến"
            ],
            "correct": 2,
            "why": "**社** = công ty; đền thờ (xã) (XÃ — On シャ). Hay gặp trong: 会社 · 社会."
          },
          {
            "q": "Chữ 「聞」 mang nghĩa nào?",
            "options": [
              "nói chuyện",
              "về, trở về",
              "nghe; hỏi",
              "viết"
            ],
            "correct": 2,
            "why": "**聞** = nghe; hỏi (VĂN — On ブン · Kun き(く)). Hay gặp trong: 聞きます · 新聞."
          },
          {
            "q": "Chữ 「読」 mang nghĩa nào?",
            "options": [
              "đến",
              "bây giờ, nay",
              "gặp",
              "đọc"
            ],
            "correct": 3,
            "why": "**読** = đọc (ĐỘC — On ドク · Kun よ(む)). Hay gặp trong: 読みます · 読書."
          },
          {
            "q": "Chữ 「書」 mang nghĩa nào?",
            "options": [
              "viết",
              "về, trở về",
              "nói chuyện",
              "công ty; đền thờ (xã)"
            ],
            "correct": 0,
            "why": "**書** = viết (THƯ — On ショ · Kun か(く)). Hay gặp trong: 書きます · 読書."
          },
          {
            "q": "Chữ 「今」 mang nghĩa nào?",
            "options": [
              "nghe; hỏi",
              "gặp",
              "đến",
              "bây giờ, nay"
            ],
            "correct": 3,
            "why": "**今** = bây giờ, nay (KIM — On コン · Kun いま). Hay gặp trong: 今 · 今週 · 今月."
          },
          {
            "q": "Chữ 「話」 mang nghĩa nào?",
            "options": [
              "nói chuyện",
              "công ty; đền thờ (xã)",
              "đọc",
              "về, trở về"
            ],
            "correct": 0,
            "why": "**話** = nói chuyện (THOẠI — On ワ · Kun はな(す)). Hay gặp trong: 話します · 電話 · 会話."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-kj-nghia2",
        "title": "Nghĩa → chữ (9 câu)",
        "items": [
          {
            "q": "Chữ nào có nghĩa \"đến\"?",
            "options": [
              "今",
              "読",
              "来",
              "社"
            ],
            "correct": 2,
            "why": "**来** = đến (LAI — On ライ · Kun く(る)/き(ます)). Hay gặp trong: 来週 · 来ます."
          },
          {
            "q": "Chữ nào có nghĩa \"về, trở về\"?",
            "options": [
              "書",
              "話",
              "帰",
              "聞"
            ],
            "correct": 2,
            "why": "**帰** = về, trở về (QUY — On キ · Kun かえ(る)). Hay gặp trong: 帰ります · 帰国."
          },
          {
            "q": "Chữ nào có nghĩa \"gặp\"?",
            "options": [
              "会",
              "今",
              "読",
              "来"
            ],
            "correct": 0,
            "why": "**会** = gặp (HỘI — On カイ · Kun あ(う)). Hay gặp trong: 会います · 会社 · 会話."
          },
          {
            "q": "Chữ nào có nghĩa \"công ty; đền thờ (xã)\"?",
            "options": [
              "帰",
              "話",
              "書",
              "社"
            ],
            "correct": 3,
            "why": "**社** = công ty; đền thờ (xã) (XÃ — On シャ). Hay gặp trong: 会社 · 社会."
          },
          {
            "q": "Chữ nào có nghĩa \"nghe; hỏi\"?",
            "options": [
              "会",
              "来",
              "今",
              "聞"
            ],
            "correct": 3,
            "why": "**聞** = nghe; hỏi (VĂN — On ブン · Kun き(く)). Hay gặp trong: 聞きます · 新聞."
          },
          {
            "q": "Chữ nào có nghĩa \"đọc\"?",
            "options": [
              "社",
              "帰",
              "話",
              "読"
            ],
            "correct": 3,
            "why": "**読** = đọc (ĐỘC — On ドク · Kun よ(む)). Hay gặp trong: 読みます · 読書."
          },
          {
            "q": "Chữ nào có nghĩa \"viết\"?",
            "options": [
              "書",
              "聞",
              "会",
              "来"
            ],
            "correct": 0,
            "why": "**書** = viết (THƯ — On ショ · Kun か(く)). Hay gặp trong: 書きます · 読書."
          },
          {
            "q": "Chữ nào có nghĩa \"bây giờ, nay\"?",
            "options": [
              "今",
              "読",
              "社",
              "帰"
            ],
            "correct": 0,
            "why": "**今** = bây giờ, nay (KIM — On コン · Kun いま). Hay gặp trong: 今 · 今週 · 今月."
          },
          {
            "q": "Chữ nào có nghĩa \"nói chuyện\"?",
            "options": [
              "聞",
              "話",
              "書",
              "会"
            ],
            "correct": 1,
            "why": "**話** = nói chuyện (THOẠI — On ワ · Kun はな(す)). Hay gặp trong: 話します · 電話 · 会話."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-kj-doc",
        "title": "Đọc từ ghép / động từ (24 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　【来週】",
            "options": [
              "こんしゅう (konshuu)",
              "らいねん (rainen)",
              "らいしゅう (raishuu)",
              "らいげつ (raigetsu)"
            ],
            "correct": 2,
            "why": "来 = らい (On) trong từ ghép; 週 = しゅう → tuần sau. Cả câu: 【来週】 〔[raishuu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【来月】",
            "options": [
              "こんげつ (kongetsu)",
              "らいしゅう (raishuu)",
              "らいげつ (raigetsu)",
              "らいがつ (raigatsu)"
            ],
            "correct": 2,
            "why": "月 trong 来月/今月 đọc げつ (không phải がつ — がつ chỉ đi với số: 七月). Cả câu: 【来月】 〔[raigetsu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【来年】",
            "options": [
              "こんねん (konnen)",
              "らいねん (rainen)",
              "きねん (kinen)",
              "らいせん (raisen)"
            ],
            "correct": 1,
            "why": "来 + 年 → らいねん (năm sau). Cả câu: 【来年】 〔[rainen]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【来ます】",
            "options": [
              "こます (komasu)",
              "くます (kumasu)",
              "きます (kimasu)",
              "らいます (raimasu)"
            ],
            "correct": 2,
            "why": "Động từ 来ます đọc **きます** (Kun き) — đừng đọc らい. Cả câu: 【来ます】 〔[kimasu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【来日】",
            "options": [
              "くにち (kunichi)",
              "らいにち (rainichi)",
              "こんにち (konnichi)",
              "らいび (raibi)"
            ],
            "correct": 1,
            "why": "来日 = đến Nhật (らいにち). Cả câu: 【来日】 〔[rainichi]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【帰ります】",
            "options": [
              "かえります (kaerimasu)",
              "きります (kirimasu)",
              "かえします (kaeshimasu)",
              "かりります (karirimasu)"
            ],
            "correct": 0,
            "why": "帰 + ります → かえります (nhóm 1, thể ます: かえります). Cả câu: 【帰ります】 〔[kaerimasu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【帰国】",
            "options": [
              "きごく (kigoku)",
              "きこく (kikoku)",
              "かえくに (kaekuni)",
              "かえこく (kaekoku)"
            ],
            "correct": 1,
            "why": "帰 đọc **キ** (On) trong từ ghép 帰国 = về nước. Cả câu: 【帰国】 〔[kikoku]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【会います】",
            "options": [
              "ごうます (goumasu)",
              "あえます (aemasu)",
              "あいます (aimasu)",
              "かいます (kaimasu)"
            ],
            "correct": 2,
            "why": "会 + います → あいます (gặp). かいます là 買います! Cả câu: 【会います】 〔[aimasu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【会社】",
            "options": [
              "えしゃ (esha)",
              "かいしゃ (kaisha)",
              "かいじゃ (kaija)",
              "あいしゃ (aisha)"
            ],
            "correct": 1,
            "why": "会 = かい (On), 社 = しゃ → công ty. Cả câu: 【会社】 〔[kaisha]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【会社員】",
            "options": [
              "しゃかいいん (shakaiin)",
              "かいじゃいん (kaijain)",
              "かいしゃいん (kaishain)",
              "あいしゃいん (aishain)"
            ],
            "correct": 2,
            "why": "会社 + 員 → nhân viên công ty. Cả câu: 【会社員】 〔[kaishain]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【会話】",
            "options": [
              "かいわ (kaiwa)",
              "あいわ (aiwa)",
              "かいはなし (kaihanashi)",
              "かいが (kaiga)"
            ],
            "correct": 0,
            "why": "会 = かい, 話 = わ → hội thoại. Cả câu: 【会話】 〔[kaiwa]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【社会】",
            "options": [
              "しゃかい (shakai)",
              "じゃかい (jakai)",
              "かいしゃ (kaisha)",
              "しゃえ (shae)"
            ],
            "correct": 0,
            "why": "社会 (xã hội) ≠ 会社 (công ty): đảo hai chữ là đổi nghĩa. Cả câu: 【社会】 〔[shakai]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【聞きます】",
            "options": [
              "もんきます (monkimasu)",
              "ぶんきます (bunkimasu)",
              "ききます (kikimasu)",
              "きこえます (kikoemasu)"
            ],
            "correct": 2,
            "why": "聞 + きます → ききます (nghe/hỏi). Cả câu: 【聞きます】 〔[kikimasu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【新聞】",
            "options": [
              "しんぶん (shinbun)",
              "しんぷん (shinpun)",
              "しんぶ (shinbu)",
              "しんもん (shinmon)"
            ],
            "correct": 0,
            "why": "聞 đọc **ぶん** (On) → 新聞 = báo. Cả câu: 【新聞】 〔[shinbun]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【読みます】",
            "options": [
              "よみます (yomimasu)",
              "よびます (yobimasu)",
              "よります (yorimasu)",
              "どくみます (dokumimasu)"
            ],
            "correct": 0,
            "why": "読 + みます → よみます (đọc). Cả câu: 【読みます】 〔[yomimasu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【読書】",
            "options": [
              "どくがき (dokugaki)",
              "よみしょ (yomisho)",
              "とくしょ (tokusho)",
              "どくしょ (dokusho)"
            ],
            "correct": 3,
            "why": "読 = どく, 書 = しょ (On) → đọc sách. Cả câu: 【読書】 〔[dokusho]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【書きます】",
            "options": [
              "かきます (kakimasu)",
              "しょきます (shokimasu)",
              "かります (karimasu)",
              "かけます (kakemasu)"
            ],
            "correct": 0,
            "why": "書 + きます → かきます (viết). Cả câu: 【書きます】 〔[kakimasu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【今週】",
            "options": [
              "こんしゅう (konshuu)",
              "いましゅう (imashuu)",
              "こんしゅ (konshu)",
              "きんしゅう (kinshuu)"
            ],
            "correct": 0,
            "why": "今 = こん (On) → 今週 = tuần này. Cả câu: 【今週】 〔[konshuu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【今月】",
            "options": [
              "いまげつ (imagetsu)",
              "こんげつ (kongetsu)",
              "こんがつ (kongatsu)",
              "きんげつ (kingetsu)"
            ],
            "correct": 1,
            "why": "今月 = tháng này (こんげつ). Cả câu: 【今月】 〔[kongetsu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【今日】",
            "options": [
              "こんひ (konhi)",
              "きょう (kyou)",
              "きんじつ (kinjitsu)",
              "いまにち (imanichi)"
            ],
            "correct": 1,
            "why": "今日 đọc **きょう** — từ đặc biệt, phải thuộc cả từ. Cả câu: 【今日】 〔[kyou]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【今晩】",
            "options": [
              "きんばん (kinban)",
              "こんあさ (kon'asa)",
              "いまばん (imaban)",
              "こんばん (konban)"
            ],
            "correct": 3,
            "why": "今晩 = tối nay (こんばん). Cả câu: 【今晩】 〔[konban]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【今度】",
            "options": [
              "こんたび (kontabi)",
              "こんど (kondo)",
              "いまど (imado)",
              "きんど (kindo)"
            ],
            "correct": 1,
            "why": "今度 = lần tới / lần này (こんど) — từ trong また今度. Cả câu: 【今度】 〔[kondo]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【電話】",
            "options": [
              "てんわ (tenwa)",
              "でんわ (denwa)",
              "でんが (denga)",
              "でんはなし (denhanashi)"
            ],
            "correct": 1,
            "why": "電 = でん, 話 = わ → điện thoại. Cả câu: 【電話】 〔[denwa]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【話します】",
            "options": [
              "はなしまし (hanashimashi)",
              "かたります (katarimasu)",
              "わします (washimasu)",
              "はなします (hanashimasu)"
            ],
            "correct": 3,
            "why": "話 + します → はなします (nói chuyện). Cách đọc わ chỉ dùng trong từ ghép (電話). Cả câu: 【話します】 〔[hanashimasu]〕"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn chữ đúng · điền chữ vào câu · On hay Kun"
      },
      {
        "t": "mcq",
        "id": "lt-b6-kj-chon-chu",
        "title": "Chọn cách viết đúng từ cho trước (10 câu)",
        "items": [
          {
            "q": "Chọn cách viết đúng: らいしゅう (tuần sau)",
            "options": [
              "今週",
              "来週",
              "今月",
              "来月"
            ],
            "correct": 1,
            "why": "らい = 来; しゅう = 週. 今 là こん."
          },
          {
            "q": "Chọn cách viết đúng: こんげつ (tháng này)",
            "options": [
              "来週",
              "来月",
              "今週",
              "今月"
            ],
            "correct": 3,
            "why": "今 = こん (nay) + 月."
          },
          {
            "q": "Chọn cách viết đúng: かいしゃ (công ty)",
            "options": [
              "会話",
              "会社",
              "社会",
              "今社"
            ],
            "correct": 1,
            "why": "会社 (công ty); 社会 là xã hội (shakai) — đảo thứ tự là sai nghĩa."
          },
          {
            "q": "Chọn cách viết đúng: かいわ (hội thoại)",
            "options": [
              "会話",
              "会社",
              "電話",
              "話会"
            ],
            "correct": 0,
            "why": "会 + 話."
          },
          {
            "q": "Chọn cách viết đúng: でんわ (điện thoại)",
            "options": [
              "会話",
              "電会",
              "電話",
              "電社"
            ],
            "correct": 2,
            "why": "電 + 話."
          },
          {
            "q": "Chọn cách viết đúng: どくしょ (đọc sách)",
            "options": [
              "聞書",
              "読書",
              "読話",
              "話書"
            ],
            "correct": 1,
            "why": "読 (đọc) + 書 (sách/viết)."
          },
          {
            "q": "Chọn cách viết đúng: しんぶん (báo)",
            "options": [
              "新聞",
              "新話",
              "新読",
              "新書"
            ],
            "correct": 0,
            "why": "新 (mới) + 聞 (tin tức, nghe)."
          },
          {
            "q": "Chọn cách viết đúng: きこく (về nước)",
            "options": [
              "帰国",
              "会国",
              "来国",
              "帰話"
            ],
            "correct": 0,
            "why": "帰 (về) + 国."
          },
          {
            "q": "Chọn cách viết đúng: らいげつ (tháng sau)",
            "options": [
              "来週",
              "来年",
              "来月",
              "今月"
            ],
            "correct": 2,
            "why": "来 + 月."
          },
          {
            "q": "Chọn cách viết đúng: こんばん (tối nay)",
            "options": [
              "今晩",
              "今朝",
              "会晩",
              "来晩"
            ],
            "correct": 0,
            "why": "今 + 晩 (tối)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-kj-dien-chu",
        "title": "Điền chữ Hán vào chỗ trống (10 câu)",
        "items": [
          {
            "q": "きのう、ともだちに＿＿いました。　〔Kinou, tomodachi ni __ imashita.〕",
            "options": [
              "話",
              "会",
              "来",
              "今"
            ],
            "correct": 1,
            "why": "会います = gặp; に 会います (gặp ai). → **きのう、ともだちに{会|あ}いました。** 〔Kinou, tomodachi ni a imashita.〕 — Hôm qua tôi đã gặp bạn."
          },
          {
            "q": "毎朝、しんぶんを＿＿みます。　〔Maiasa, shinbun o __ mimasu.〕",
            "options": [
              "読",
              "書",
              "話",
              "聞"
            ],
            "correct": 0,
            "why": "読みます = đọc. → **{毎朝|まいあさ}、しんぶんを{読|よ}みます。** 〔Maiasa, shinbun o yo mimasu.〕 — Mỗi sáng tôi đọc báo."
          },
          {
            "q": "先生の話を＿＿きます。　〔Sensei no hanashi o __ kimasu.〕",
            "options": [
              "帰",
              "聞",
              "読",
              "来"
            ],
            "correct": 1,
            "why": "聞きます = nghe. 来 cũng đọc き nhưng 来きます không có nghĩa. → **{先生|せんせい}の{話|はなし}を{聞|き}きます。** 〔Sensei no hanashi o ki kimasu.〕 — Tôi nghe lời cô giáo nói."
          },
          {
            "q": "ともだちにてがみを＿＿きます。　〔Tomodachi ni tegami o __ kimasu.〕",
            "options": [
              "書",
              "聞",
              "読",
              "帰"
            ],
            "correct": 0,
            "why": "書きます = viết. → **ともだちにてがみを{書|か}きます。** 〔Tomodachi ni tegami o ka kimasu.〕 — Tôi viết thư cho mẹ."
          },
          {
            "q": "六時にうちへ＿＿ります。　〔Rokuji ni uchi e __ rimasu.〕",
            "options": [
              "話",
              "会",
              "来",
              "帰"
            ],
            "correct": 3,
            "why": "帰ります = về. → **{六時|ろくじ}にうちへ{帰|かえ}ります。** 〔Rokuji ni uchi e kae rimasu.〕 — Tôi về nhà lúc 6 giờ."
          },
          {
            "q": "ともだちが日本から＿＿ます。　〔Tomodachi ga nihon kara __ masu.〕",
            "options": [
              "帰",
              "会",
              "来",
              "今"
            ],
            "correct": 2,
            "why": "来ます = đến. → **ともだちが{日本|にほん}から{来|き}ます。** 〔Tomodachi ga nihon kara ki masu.〕 — Bạn tôi từ Nhật đến."
          },
          {
            "q": "＿＿、何時ですか。　〔__, nanji desu ka.〕",
            "options": [
              "今",
              "会",
              "話",
              "来"
            ],
            "correct": 0,
            "why": "今 (いま) = bây giờ. → **{今|いま}、{何時|なんじ}ですか。** 〔Ima, nanji desu ka.〕 — Bây giờ là mấy giờ?"
          },
          {
            "q": "先生と日本語で＿＿します。　〔Sensei to nihongo de __ shimasu.〕",
            "options": [
              "話",
              "会",
              "読",
              "聞"
            ],
            "correct": 0,
            "why": "話します = nói chuyện. → **{先生|せんせい}と{日本語|にほんご}で{話|はな}します。** 〔Sensei to nihongo de hana shimasu.〕 — Tôi nói chuyện với cô bằng tiếng Nhật."
          },
          {
            "q": "＿＿の人は七時に来ます。　〔__ no hito wa shichiji ni kimasu.〕",
            "options": [
              "社会",
              "会話",
              "会社",
              "読書"
            ],
            "correct": 2,
            "why": "会社 = công ty. → **{会社|かいしゃ}の{人|ひと}は{七時|しちじ}に{来|き}ます。** 〔Kaisha no hito wa shichiji ni kimasu.〕 — Người của công ty đến lúc 7 giờ."
          },
          {
            "q": "私のしゅみは＿＿です。　〔Watashi no shumi wa __ desu.〕",
            "options": [
              "読書",
              "社会",
              "会社",
              "会話"
            ],
            "correct": 0,
            "why": "読書 = đọc sách. → **{私|わたし}のしゅみは{読書|どくしょ}です。** 〔Watashi no shumi wa dokusho desu.〕 — Sở thích của tôi là đọc sách."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-kj-on-kun",
        "title": "Cùng một chữ, đọc khác nhau tuỳ từ (12 câu)",
        "items": [
          {
            "q": "Chữ 「月」 trong 「来月」 đọc là gì?",
            "options": [
              "つき",
              "げつ",
              "がつ",
              "ゲツ"
            ],
            "correct": 1,
            "why": "Sau 今/来 (tháng này/sau) đọc **げつ**; がつ chỉ đi với số tháng (七月)."
          },
          {
            "q": "Chữ 「月」 trong 「七月」 đọc là gì?",
            "options": [
              "げつ",
              "ゲツ",
              "つき",
              "がつ"
            ],
            "correct": 3,
            "why": "Số + 月 = **がつ**."
          },
          {
            "q": "Chữ 「話」 trong 「電話」 đọc là gì?",
            "options": [
              "はな",
              "かたり",
              "わ",
              "ばなし"
            ],
            "correct": 2,
            "why": "Trong từ ghép On: 話 = わ."
          },
          {
            "q": "Chữ 「話」 trong 「話します」 đọc là gì?",
            "options": [
              "ばな",
              "はな",
              "わ",
              "かた"
            ],
            "correct": 1,
            "why": "Động từ: 話 = はな(す)."
          },
          {
            "q": "Chữ 「会」 trong 「会社」 đọc là gì?",
            "options": [
              "え",
              "あい",
              "ごう",
              "かい"
            ],
            "correct": 3,
            "why": "Từ ghép On: 会 = かい."
          },
          {
            "q": "Chữ 「会」 trong 「会います」 đọc là gì?",
            "options": [
              "かい",
              "え",
              "ごう",
              "あ"
            ],
            "correct": 3,
            "why": "Động từ: 会 = あ(う)."
          },
          {
            "q": "Chữ 「来」 trong 「来週」 đọc là gì?",
            "options": [
              "く",
              "らい",
              "こ",
              "き"
            ],
            "correct": 1,
            "why": "Từ ghép On: 来 = らい."
          },
          {
            "q": "Chữ 「来」 trong 「来ます」 đọc là gì?",
            "options": [
              "き",
              "こ",
              "らい",
              "く"
            ],
            "correct": 0,
            "why": "きます: 来 đọc き."
          },
          {
            "q": "Chữ 「書」 trong 「読書」 đọc là gì?",
            "options": [
              "しょ",
              "じょ",
              "か",
              "ふみ"
            ],
            "correct": 0,
            "why": "Từ ghép On: 書 = しょ."
          },
          {
            "q": "Chữ 「書」 trong 「書きます」 đọc là gì?",
            "options": [
              "ふみ",
              "しょ",
              "か",
              "き"
            ],
            "correct": 2,
            "why": "書きます: 書 = か."
          },
          {
            "q": "Chữ 「今」 trong 「今日」 đọc là gì?",
            "options": [
              "いま",
              "きょう",
              "きん",
              "こん"
            ],
            "correct": 1,
            "why": "今日 là từ đặc biệt: cả hai chữ đọc きょう."
          },
          {
            "q": "Chữ 「聞」 trong 「新聞」 đọc là gì?",
            "options": [
              "き",
              "ぶん",
              "もん",
              "ふん"
            ],
            "correct": 1,
            "why": "Từ ghép On: 聞 = ぶん."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · không furigana — như đề thi"
      },
      {
        "t": "mcq",
        "id": "lt-b6-kj-doc-cau",
        "title": "Đọc đúng phần trong 【 】 (18 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　私は【来週】、くにへ帰ります。",
            "options": [
              "こんしゅう (konshuu)",
              "らいしゅう (raishuu)",
              "らいげつ (raigetsu)",
              "きしゅう (kishuu)"
            ],
            "correct": 1,
            "why": "来 = らい (On) trong 来週 → tuần sau. Cả câu: 私は【来週】、くにへ帰ります。 〔Watashi wa [raishuu], kuni e kaerimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【今月】はいそがしいです。",
            "options": [
              "こんげつ (kongetsu)",
              "らいげつ (raigetsu)",
              "こんがつ (kongatsu)",
              "いまげつ (imagetsu)"
            ],
            "correct": 0,
            "why": "今 = こん, 月 = げつ. Cả câu: 【今月】はいそがしいです。 〔[kongetsu] wa isogashii desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【会社】はえきのちかくです。",
            "options": [
              "かいしゃ (kaisha)",
              "あいしゃ (aisha)",
              "かいじゃ (kaija)",
              "しゃかい (shakai)"
            ],
            "correct": 0,
            "why": "会社 = かいしゃ; 社会 = しゃかい (xã hội) — khác nghĩa. Cả câu: 【会社】はえきのちかくです。 〔[kaisha] wa eki no chikaku desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【社会】のべんきょうをします。",
            "options": [
              "しゃかい (shakai)",
              "しゃえ (shae)",
              "かいしゃ (kaisha)",
              "じゃかい (jakai)"
            ],
            "correct": 0,
            "why": "社会 = xã hội. Cả câu: 【社会】のべんきょうをします。 〔[shakai] no benkyou o shimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　にほんごで【会話】をします。",
            "options": [
              "あいわ (aiwa)",
              "かいが (kaiga)",
              "かいわ (kaiwa)",
              "かいはなし (kaihanashi)"
            ],
            "correct": 2,
            "why": "会話 = hội thoại. Cả câu: にほんごで【会話】をします。 〔Nihongo de [kaiwa] o shimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【読書】はわたしのしゅみです。",
            "options": [
              "とくしょ (tokusho)",
              "よみしょ (yomisho)",
              "どくしょ (dokusho)",
              "どくがき (dokugaki)"
            ],
            "correct": 2,
            "why": "読書 = đọc sách. Cả câu: 【読書】はわたしのしゅみです。 〔[dokusho] wa watashi no shumi desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　まいにちしんぶんを【読】みます。",
            "options": [
              "とく (toku)",
              "よ (yo)",
              "どく (doku)",
              "かい (kai)"
            ],
            "correct": 1,
            "why": "読みます: 読 = よ(む). Cả câu: まいにちしんぶんを【読】みます。 〔Mainichi shinbun o [yo]mimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　ともだちに【会】います。",
            "options": [
              "かい (kai)",
              "ごう (gou)",
              "え (e)",
              "あ (a)"
            ],
            "correct": 3,
            "why": "会います: 会 = あ(う). Cả câu: ともだちに【会】います。 〔Tomodachi ni [a]imasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【今日】は月曜日です。",
            "options": [
              "いまにち (imanichi)",
              "こんひ (konhi)",
              "きょう (kyou)",
              "きんにち (kinnichi)"
            ],
            "correct": 2,
            "why": "今日 = きょう (từ đặc biệt). Cả câu: 【今日】は月曜日です。 〔[kyou] wa getsuyoubi desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　ラジオを【聞】きます。",
            "options": [
              "もん (mon)",
              "き (ki)",
              "ぶん (bun)",
              "みみ (mimi)"
            ],
            "correct": 1,
            "why": "聞きます: 聞 = き(く). Cả câu: ラジオを【聞】きます。 〔Rajio o [ki]kimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　てがみを【書】きます。",
            "options": [
              "かい (kai)",
              "しょ (sho)",
              "か (ka)",
              "ふみ (fumi)"
            ],
            "correct": 2,
            "why": "書きます: 書 = か(く). Cả câu: てがみを【書】きます。 〔Tegami o [ka]kimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　うちへ【帰】ります。",
            "options": [
              "き (ki)",
              "かえ (kae)",
              "もど (modo)",
              "かい (kai)"
            ],
            "correct": 1,
            "why": "帰ります: 帰 = かえ(る). Cả câu: うちへ【帰】ります。 〔Uchi e [kae]rimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　せんせいと【話】します。",
            "options": [
              "しゃべ (shabe)",
              "はな (hana)",
              "かた (kata)",
              "わ (wa)"
            ],
            "correct": 1,
            "why": "話します: 話 = はな(す). Cả câu: せんせいと【話】します。 〔Sensei to [hana]shimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　ともだちが【来】ます。",
            "options": [
              "く (ku)",
              "こ (ko)",
              "らい (rai)",
              "き (ki)"
            ],
            "correct": 3,
            "why": "来ます: 来 = き. Cả câu: ともだちが【来】ます。 〔Tomodachi ga [ki]masu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【新聞】を読みます。",
            "options": [
              "しんぷん (shinpun)",
              "しんもん (shinmon)",
              "しんぶん (shinbun)",
              "しんぶ (shinbu)"
            ],
            "correct": 2,
            "why": "聞 = ぶん trong 新聞. Cả câu: 【新聞】を読みます。 〔[shinbun] o yomimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【電話】をします。",
            "options": [
              "てんわ (tenwa)",
              "でんが (denga)",
              "でんはなし (denhanashi)",
              "でんわ (denwa)"
            ],
            "correct": 3,
            "why": "電 = でん, 話 = わ. Cả câu: 【電話】をします。 〔[denwa] o shimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【来年】、日本へ行きます。",
            "options": [
              "こんねん (konnen)",
              "らいねん (rainen)",
              "らいせん (raisen)",
              "きねん (kinen)"
            ],
            "correct": 1,
            "why": "来年 = năm sau. Cả câu: 【来年】、日本へ行きます。 〔[rainen], nihon e ikimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【帰国】は来月です。",
            "options": [
              "かえくに (kaekuni)",
              "きごく (kigoku)",
              "かえこく (kaekoku)",
              "きこく (kikoku)"
            ],
            "correct": 3,
            "why": "帰 = キ (On) trong 帰国 = về nước. Cả câu: 【帰国】は来月です。 〔[kikoku] wa raigetsu desu.〕"
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b6-kj-doc-cau-rk",
        "title": "Đọc to câu KHÔNG furigana, rồi bấm xem đáp án (20 câu)",
        "note": "Đọc to cả câu, kể cả hiragana. Chỉ dùng chữ Hán đã học đến Bài 6.",
        "items": [
          {
            "text": "{来週|らいしゅう}、{日本|にほん}からともだちが{来|き}ます。",
            "ro": "Raishuu, nihon kara tomodachi ga kimasu.",
            "vi": "Tuần sau bạn từ Nhật đến."
          },
          {
            "text": "{今週|こんしゅう}の{土曜日|どようび}、やくそくがあります。",
            "ro": "Konshuu no doyoubi, yakusoku ga arimasu.",
            "vi": "Thứ Bảy tuần này tôi có hẹn."
          },
          {
            "text": "{毎朝|まいあさ}、{七時|しちじ}に{会社|かいしゃ}へ{行|い}きます。",
            "ro": "Maiasa, shichiji ni kaisha e ikimasu.",
            "vi": "Mỗi sáng 7 giờ tôi đi đến công ty."
          },
          {
            "text": "{私|わたし}は{毎晩|まいばん}、{九時|くじ}にうちへ{帰|かえ}ります。",
            "ro": "Watashi wa maiban, kuji ni uchi e kaerimasu.",
            "vi": "Mỗi tối 9 giờ tôi về nhà."
          },
          {
            "text": "{朝|あさ}、しんぶんを{読|よ}みます。",
            "ro": "Asa, shinbun o yomimasu.",
            "vi": "Buổi sáng tôi đọc báo."
          },
          {
            "text": "{先週|せんしゅう}、ともだちに{会|あ}いました。",
            "ro": "Senshuu, tomodachi ni aimashita.",
            "vi": "Tuần trước tôi đã gặp bạn."
          },
          {
            "text": "{今晩|こんばん}、{日本語|にほんご}で{話|はな}しませんか。",
            "ro": "Konban, nihongo de hanashimasen ka.",
            "vi": "Tối nay nói chuyện bằng tiếng Nhật nhé?"
          },
          {
            "text": "{来月|らいげつ}、{東京|とうきょう}へ{行|い}きます。",
            "ro": "Raigetsu, toukyou e ikimasu.",
            "vi": "Tháng sau tôi đi Tokyo."
          },
          {
            "text": "{先生|せんせい}の{話|はなし}を{聞|き}きます。",
            "ro": "Sensei no hanashi o kikimasu.",
            "vi": "Tôi nghe cô giáo nói."
          },
          {
            "text": "{私|わたし}は{会社員|かいしゃいん}じゃありません。{学生|がくせい}です。",
            "ro": "Watashi wa kaishain ja arimasen. Gakusei desu.",
            "vi": "Tôi không phải nhân viên công ty. Tôi là sinh viên."
          },
          {
            "text": "{毎日|まいにち}、{本|ほん}を{読|よ}みます。",
            "ro": "Mainichi, hon o yomimasu.",
            "vi": "Ngày nào tôi cũng đọc sách."
          },
          {
            "text": "{火曜日|かようび}の{午後|ごご}、ともだちと{話|はな}します。",
            "ro": "Kayoubi no gogo, tomodachi to hanashimasu.",
            "vi": "Chiều thứ Ba tôi nói chuyện với bạn."
          },
          {
            "text": "{十月|じゅうがつ}に{国|くに}へ{帰|かえ}ります。",
            "ro": "Juugatsu ni kuni e kaerimasu.",
            "vi": "Tháng 10 tôi về nước."
          },
          {
            "text": "{今日|きょう}は{水曜日|すいようび}です。",
            "ro": "Kyou wa suiyoubi desu.",
            "vi": "Hôm nay là thứ Tư."
          },
          {
            "text": "{何時|なんじ}に{来|き}ますか。{五時|ごじ}に{来|き}ます。",
            "ro": "Nanji ni kimasu ka. Goji ni kimasu.",
            "vi": "Mấy giờ bạn đến? Tôi đến lúc 5 giờ."
          },
          {
            "text": "{私|わたし}はははにてがみを{書|か}きます。",
            "ro": "Watashi wa wa wa ni tegami o kakimasu.",
            "vi": "Tôi viết thư cho mẹ."
          },
          {
            "text": "{今|いま}、{九時|くじ}です。",
            "ro": "Ima, kuji desu.",
            "vi": "Bây giờ là 9 giờ."
          },
          {
            "text": "{先週|せんしゅう}の{金曜日|きんようび}、{東京|とうきょう}に{来|き}ました。",
            "ro": "Senshuu no kin'youbi, toukyou ni kimashita.",
            "vi": "Thứ Sáu tuần trước tôi đã đến Tokyo."
          },
          {
            "text": "{英語|えいご}のほんを{毎日|まいにち}{読|よ}みます。",
            "ro": "Eigo no hon o mainichi yomimasu.",
            "vi": "Ngày nào tôi cũng đọc sách tiếng Anh."
          },
          {
            "text": "{木曜日|もくようび}の{朝|あさ}、{会社|かいしゃ}の{人|ひと}と{話|はな}しました。",
            "ro": "Mokuyoubi no asa, kaisha no hito to hanashimashita.",
            "vi": "Sáng thứ Năm tôi đã nói chuyện với người trong công ty."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b6-kj-doc-doan",
        "title": "Đọc to ĐOẠN văn ngắn không furigana (3 đoạn)",
        "items": [
          {
            "text": "{私|わたし}は{会社員|かいしゃいん}です。{毎朝|まいあさ}、{七時|しちじ}にうちをでます。{八時|はちじ}に{会社|かいしゃ}に{来|き}ます。{六時|ろくじ}に{帰|かえ}ります。",
            "ro": "Watashi wa kaishain desu. Maiasa, shichiji ni uchi o demasu. Hachiji ni kaisha ni kimasu. Rokuji ni kaerimasu.",
            "vi": "Tôi là nhân viên công ty. Mỗi sáng 7 giờ tôi ra khỏi nhà. 8 giờ tôi đến công ty. 6 giờ tôi về."
          },
          {
            "text": "{今週|こんしゅう}の{金曜日|きんようび}、ともだちが{日本|にほん}から{来|き}ます。{私|わたし}は{午後|ごご}{三時|さんじ}にえきでともだちに{会|あ}います。{晩|ばん}、いっしょにごはんを{食|た}べます。{日本語|にほんご}で{話|はな}します。",
            "ro": "Konshuu no kin'youbi, tomodachi ga nihon kara kimasu. Watashi wa gogo sanji ni eki de tomodachi ni aimasu. Ban, isshoni gohan o tabemasu. Nihongo de hanashimasu.",
            "vi": "Thứ Sáu tuần này bạn từ Nhật đến. 3 giờ chiều tôi gặp bạn ở ga. Buổi tối cùng ăn cơm, nói chuyện bằng tiếng Nhật."
          },
          {
            "text": "{毎晩|まいばん}、{九時|くじ}に{本|ほん}を{読|よ}みます。{十時|じゅうじ}にてがみを{書|か}きます。{水曜日|すいようび}と{土曜日|どようび}は{日本語|にほんご}のラジオを{聞|き}きます。",
            "ro": "Maiban, kuji ni hon o yomimasu. Juuji ni tegami o kakimasu. Suiyoubi to doyoubi wa nihongo no rajio o kikimasu.",
            "vi": "Mỗi tối 9 giờ tôi đọc sách. 10 giờ viết thư. Thứ Tư và thứ Bảy tôi nghe đài tiếng Nhật."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b6-kj-tu-vung",
        "title": "Đọc chữ Hán trong từ vựng Bài 6 (20 từ)",
        "note": "Từ vựng của cô, không furigana. Sai chữ nào thì mở lại bài chữ Hán Bài 6.",
        "items": [
          {
            "text": "{今週|こんしゅう}",
            "ro": "Konshuu",
            "vi": "tuần này"
          },
          {
            "text": "{来週|らいしゅう}",
            "ro": "Raishuu",
            "vi": "tuần sau"
          },
          {
            "text": "{今月|こんげつ}",
            "ro": "Kongetsu",
            "vi": "tháng này"
          },
          {
            "text": "{来月|らいげつ}",
            "ro": "Raigetsu",
            "vi": "tháng sau"
          },
          {
            "text": "{約束|やくそく}",
            "ro": "Yakusoku",
            "vi": "cuộc hẹn"
          },
          {
            "text": "{用事|ようじ}",
            "ro": "Youji",
            "vi": "việc bận"
          },
          {
            "text": "{季節|きせつ}",
            "ro": "Kisetsu",
            "vi": "mùa"
          },
          {
            "text": "{試合|しあい}",
            "ro": "Shiai",
            "vi": "trận đấu"
          },
          {
            "text": "{野球|やきゅう}",
            "ro": "Yakyuu",
            "vi": "bóng chày"
          },
          {
            "text": "{歌手|かしゅ}",
            "ro": "Kashu",
            "vi": "ca sĩ"
          },
          {
            "text": "{地図|ちず}",
            "ro": "Chizu",
            "vi": "bản đồ"
          },
          {
            "text": "{水着|みずぎ}",
            "ro": "Mizugi",
            "vi": "đồ bơi"
          },
          {
            "text": "{焼|や}き{肉|にく}",
            "ro": "Yakiniku",
            "vi": "thịt nướng"
          },
          {
            "text": "{食|た}べ{放題|ほうだい}",
            "ro": "Tabehoudai",
            "vi": "ăn buffet"
          },
          {
            "text": "{居酒屋|いざかや}",
            "ro": "Izakaya",
            "vi": "quán nhậu"
          },
          {
            "text": "{映画館|えいがかん}",
            "ro": "Eigakan",
            "vi": "rạp chiếu phim"
          },
          {
            "text": "{地下鉄|ちかてつ}",
            "ro": "Chikatetsu",
            "vi": "tàu điện ngầm"
          },
          {
            "text": "{残念|ざんねん}",
            "ro": "Zannen",
            "vi": "đáng tiếc"
          },
          {
            "text": "{全部|ぜんぶ}",
            "ro": "Zenbu",
            "vi": "tất cả"
          },
          {
            "text": "{一緒|いっしょ}に",
            "ro": "Issho ni",
            "vi": "cùng nhau"
          }
        ]
      },
      {
        "t": "write",
        "id": "lt-b6-kj-viet",
        "title": "Tập viết chữ Hán của lớp Bài 6 (9 chữ + 6 từ)",
        "chars": [
          "来",
          "帰",
          "会",
          "社",
          "聞",
          "読",
          "書",
          "今",
          "話",
          "来週",
          "会社",
          "今月",
          "読書",
          "電話",
          "新聞"
        ],
        "goi": {
          "来週": "らいしゅう · tuần sau",
          "会社": "かいしゃ · công ty",
          "今月": "こんげつ · tháng này",
          "読書": "どくしょ · đọc sách",
          "電話": "でんわ · điện thoại",
          "新聞": "しんぶん · báo"
        }
      }
    ]
  },
  {
    "id": "lt-b6-np-1",
    "kind": "homework",
    "title": "Luyện thêm Bài 6 · Ngữ pháp 1 (ポイント 48–52) — rủ · nhận lời · có hẹn/việc/sự kiện · đếm vé và đồ vật (~79 câu)",
    "goal": "Rủ bạn bằng ～ませんか, nhận lời bằng ～ましょう, từ chối khéo bằng ちょっと……, nói có hẹn/việc bận/sự kiện đúng trợ từ (が・で) và đếm vé bằng ～枚, đồ vật bằng ～つ.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Nhớ cặp: **Vませんか = hỏi để RỦ**, **Vましょう = trả lời đồng ý (hoặc hô hào)**. Đừng đáp ええ、行きませんか.",
          "Ba chữ chắc phải thuộc: あります đi với **が** (hẹn/việc/bài thi) — sự kiện thì thêm **N で** (nơi diễn ra) — vé là **枚**, đồ vật là **つ**.",
          "Làm lượt 1 ở mức Dễ trong 15 phút; câu sai ghi lại, làm lại cuối buổi. Mức Khó trộn nhiều ポイント như đề kiểm tra: bấm giờ 20 phút cho 15 câu."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**Vませんか** → rủ: 一緒に映画を見ませんか。 · **ええ、Vましょう** / **いいですね** → nhận lời · **すみません、ちょっと……** → từ chối khéo.",
          "**N が あります** → có hẹn/việc/bài thi: 約束があります。 · **N で N が あります** → sự kiện ở đâu: 公園で花火があります。",
          "**～つ** (1–10: ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお) · **～枚** (vật mỏng: vé, giấy, áo, đĩa)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · điền một chỗ trống · có nghĩa Việt kèm"
      },
      {
        "t": "mcq",
        "id": "lt-b6-np1-48",
        "title": "ポイント 48–49: ませんか / ましょう (12 câu)",
        "items": [
          {
            "q": "{一緒|いっしょ}にカラオケに{行|い}き＿＿。　〔Issho ni karaoke ni iki__.〕　— Cùng đi karaoke không?",
            "options": [
              "ました",
              "ます",
              "ません",
              "ませんか"
            ],
            "correct": 3,
            "why": "Rủ = V**ませんか** (ポイント 48). → **{一緒|いっしょ}にカラオケに{行|い}きませんか。** 〔Issho ni karaoke ni ikimasen ka.〕 — Cùng đi karaoke không?"
          },
          {
            "q": "{今晩|こんばん}、{映画|えいが}を{見|み}＿＿。　〔Konban, eiga o mi__.〕　— Tối nay xem phim không?",
            "options": [
              "ませんか",
              "ます",
              "ません",
              "ました"
            ],
            "correct": 0,
            "why": "Rủ = Vませんか. → **{今晩|こんばん}、{映画|えいが}を{見|み}ませんか。** 〔Konban, eiga o mimasen ka.〕 — Tối nay xem phim không?"
          },
          {
            "q": "{日曜日|にちようび}、{一緒|いっしょ}に{買|か}い{物|もの}をし＿＿。　〔Nichiyoubi, issho ni kaimono o shi__.〕　— Chủ nhật cùng đi mua sắm không?",
            "options": [
              "ました",
              "ませんか",
              "ます",
              "ません"
            ],
            "correct": 1,
            "why": "Rủ = Vませんか. → **{日曜日|にちようび}、{一緒|いっしょ}に{買|か}い{物|もの}をしませんか。** 〔Nichiyoubi, issho ni kaimono o shimasen ka.〕 — Chủ nhật cùng đi mua sắm không?"
          },
          {
            "q": "コーヒーを{飲|の}み＿＿。　〔Koohii o nomi__.〕　— Uống cà phê không?",
            "options": [
              "ませんか",
              "ません",
              "ました",
              "ます"
            ],
            "correct": 0,
            "why": "Rủ = Vませんか. → **コーヒーを{飲|の}みませんか。** 〔Koohii o nomimasen ka.〕 — Uống cà phê không?"
          },
          {
            "q": "{明日|あした}、{図書館|としょかん}で{勉強|べんきょう}し＿＿。　〔Ashita, toshokan de benkyou shi__.〕　— Mai cùng học ở thư viện không?",
            "options": [
              "ませんか",
              "ません",
              "ました",
              "ます"
            ],
            "correct": 0,
            "why": "Rủ = Vませんか. → **{明日|あした}、{図書館|としょかん}で{勉強|べんきょう}しませんか。** 〔Ashita, toshokan de benkyou shimasen ka.〕 — Mai cùng học ở thư viện không?"
          },
          {
            "q": "{山田|やまだ}さん、{一緒|いっしょ}に{帰|かえ}り＿＿。　〔Yamadasan, issho ni kaeri__.〕　— Anh Yamada, cùng về không?",
            "options": [
              "ました",
              "ます",
              "ません",
              "ませんか"
            ],
            "correct": 3,
            "why": "Rủ = Vませんか. → **{山田|やまだ}さん、{一緒|いっしょ}に{帰|かえ}りませんか。** 〔Yamadasan, issho ni kaerimasen ka.〕 — Anh Yamada, cùng về không?"
          },
          {
            "q": "A：{一緒|いっしょ}に{昼|ひる}ご{飯|はん}を{食|た}べませんか。B：ええ、{食|た}べ＿＿。　〔A:issho ni hirugohan o tabemasen ka. B:ee, tabe__.〕　— Ừ, cùng ăn thôi.",
            "options": [
              "ません",
              "ましょう",
              "ませんか",
              "ました"
            ],
            "correct": 1,
            "why": "Nhận lời = V**ましょう** (ポイント 49). → **A：{一緒|いっしょ}に{昼|ひる}ご{飯|はん}を{食|た}べませんか。B：ええ、{食|た}べましょう。** 〔A:issho ni hirugohan o tabemasen ka. B:ee, tabemashou.〕 — Ừ, cùng ăn thôi."
          },
          {
            "q": "A：{土曜日|どようび}、{海|うみ}へ{行|い}きませんか。B：いいですね。{行|い}き＿＿。　〔A:doyoubi, umi e ikimasen ka. B:ii desu ne. Iki__.〕　— Hay đấy. Đi thôi.",
            "options": [
              "ません",
              "ましょう",
              "ました",
              "ませんか"
            ],
            "correct": 1,
            "why": "Nhận lời = Vましょう. → **A：{土曜日|どようび}、{海|うみ}へ{行|い}きませんか。B：いいですね。{行|い}きましょう。** 〔A:doyoubi, umi e ikimasen ka. B:ii desu ne. Ikimashou.〕 — Hay đấy. Đi thôi."
          },
          {
            "q": "{十二時|じゅうにじ}です。{昼|ひる}ご{飯|はん}を{食|た}べ＿＿。　〔Juuniji desu. Hirugohan o tabe__.〕　— Mười hai giờ rồi. Ăn trưa thôi.",
            "options": [
              "ました",
              "ましょう",
              "ませんか",
              "ません"
            ],
            "correct": 1,
            "why": "Đề nghị cùng làm = Vましょう. → **{十二時|じゅうにじ}です。{昼|ひる}ご{飯|はん}を{食|た}べましょう。** 〔Juuniji desu. Hirugohan o tabemashou.〕 — Mười hai giờ rồi. Ăn trưa thôi."
          },
          {
            "q": "{明日|あした}、{駅|えき}で{会|あ}い＿＿。　〔Ashita, eki de ai__.〕　— Mai gặp nhau ở ga nhé.",
            "options": [
              "ましょう",
              "ました",
              "ません",
              "ませんか"
            ],
            "correct": 0,
            "why": "Hẹn/đề nghị = Vましょう. → **{明日|あした}、{駅|えき}で{会|あ}いましょう。** 〔Ashita, eki de aimashou.〕 — Mai gặp nhau ở ga nhé."
          },
          {
            "q": "さあ、{勉強|べんきょう}をはじめ＿＿。　〔Saa, benkyou o hajime__.〕　— Nào, bắt đầu học thôi.",
            "options": [
              "ません",
              "ました",
              "ませんか",
              "ましょう"
            ],
            "correct": 3,
            "why": "Hô hào = Vましょう. → **さあ、{勉強|べんきょう}をはじめましょう。** 〔Saa, benkyou o hajimemashou.〕 — Nào, bắt đầu học thôi."
          },
          {
            "q": "{今日|きょう}はここまでにし＿＿。　〔Kyou wa koko made ni shi__.〕　— Hôm nay dừng ở đây thôi.",
            "options": [
              "ました",
              "ましょう",
              "ません",
              "ませんか"
            ],
            "correct": 1,
            "why": "Vましょう. → **{今日|きょう}はここまでにしましょう。** 〔Kyou wa koko made ni shimashou.〕 — Hôm nay dừng ở đây thôi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np1-50",
        "title": "ポイント 50: N が あります (5 câu)",
        "items": [
          {
            "q": "{来週|らいしゅう}の{火曜日|かようび}、{約束|やくそく}＿＿あります。　〔Raishuu no kayoubi, yakusoku__ arimasu.〕　— Thứ Ba tuần sau tôi có hẹn.",
            "options": [
              "が",
              "を",
              "で",
              "に"
            ],
            "correct": 0,
            "why": "**N が あります** (ポイント 50). → **{来週|らいしゅう}の{火曜日|かようび}、{約束|やくそく}があります。** 〔Raishuu no kayoubi, yakusoku ga arimasu.〕 — Thứ Ba tuần sau tôi có hẹn."
          },
          {
            "q": "{明日|あした}は{用事|ようじ}＿＿あります。　〔Ashita wa youji__ arimasu.〕　— Ngày mai tôi có việc bận.",
            "options": [
              "が",
              "を",
              "で",
              "へ"
            ],
            "correct": 0,
            "why": "あります đi với が. → **{明日|あした}は{用事|ようじ}があります。** 〔Ashita wa youji ga arimasu.〕 — Ngày mai tôi có việc bận."
          },
          {
            "q": "{今日|きょう}は{日本語|にほんご}のテスト＿＿あります。　〔Kyou wa nihongo no tesuto__ arimasu.〕　— Hôm nay có bài kiểm tra tiếng Nhật.",
            "options": [
              "を",
              "が",
              "と",
              "で"
            ],
            "correct": 1,
            "why": "あります đi với が. → **{今日|きょう}は{日本語|にほんご}のテストがあります。** 〔Kyou wa nihongo no tesuto ga arimasu.〕 — Hôm nay có bài kiểm tra tiếng Nhật."
          },
          {
            "q": "{土曜日|どようび}、アルバイト＿＿あります。　〔Doyoubi, arubaito__ arimasu.〕　— Thứ Bảy tôi có việc làm thêm.",
            "options": [
              "へ",
              "が",
              "を",
              "に"
            ],
            "correct": 1,
            "why": "あります đi với が. → **{土曜日|どようび}、アルバイトがあります。** 〔Doyoubi, arubaito ga arimasu.〕 — Thứ Bảy tôi có việc làm thêm."
          },
          {
            "q": "すみません、{今晩|こんばん}は{約束|やくそく}＿＿ありますから……　〔Sumimasen, konban wa yakusoku__ arimasu kara...〕　— Xin lỗi, tối nay tôi có hẹn nên…",
            "options": [
              "と",
              "を",
              "が",
              "で"
            ],
            "correct": 2,
            "why": "あります đi với が. → **すみません、{今晩|こんばん}は{約束|やくそく}がありますから……** 〔Sumimasen, konban wa yakusoku ga arimasu kara...〕 — Xin lỗi, tối nay tôi có hẹn nên…"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np1-51",
        "title": "ポイント 51: N で N が あります (5 câu)",
        "items": [
          {
            "q": "{大学|だいがく}＿＿サッカーの{試合|しあい}があります。　〔Daigaku__ sakkaa no shiai ga arimasu.〕　— Ở trường đại học có trận bóng đá.",
            "options": [
              "を",
              "が",
              "で",
              "に"
            ],
            "correct": 2,
            "why": "Sự kiện diễn ra ở đâu = **N で** (ポイント 51). → **{大学|だいがく}でサッカーの{試合|しあい}があります。** 〔Daigaku de sakkaa no shiai ga arimasu.〕 — Ở trường đại học có trận bóng đá."
          },
          {
            "q": "{駅|えき}の{前|まえ}＿＿コンサートがあります。　〔Eki no mae__ konsaato ga arimasu.〕　— Trước ga có buổi hoà nhạc.",
            "options": [
              "を",
              "と",
              "で",
              "に"
            ],
            "correct": 2,
            "why": "Sự kiện → で. → **{駅|えき}の{前|まえ}でコンサートがあります。** 〔Eki no mae de konsaato ga arimasu.〕 — Trước ga có buổi hoà nhạc."
          },
          {
            "q": "{公園|こうえん}＿＿{花火|はなび}があります。　〔Kouen__ hanabi ga arimasu.〕　— Ở công viên có pháo hoa.",
            "options": [
              "を",
              "へ",
              "で",
              "に"
            ],
            "correct": 2,
            "why": "Sự kiện → で. → **{公園|こうえん}で{花火|はなび}があります。** 〔Kouen de hanabi ga arimasu.〕 — Ở công viên có pháo hoa."
          },
          {
            "q": "{来月|らいげつ}、{京都|きょうと}＿＿ツアーがあります。　〔Raigetsu, kyouto__ tsuaa ga arimasu.〕　— Tháng sau có tour ở Kyoto.",
            "options": [
              "に",
              "で",
              "が",
              "を"
            ],
            "correct": 1,
            "why": "Sự kiện → で. → **{来月|らいげつ}、{京都|きょうと}でツアーがあります。** 〔Raigetsu, kyouto de tsuaa ga arimasu.〕 — Tháng sau có tour ở Kyoto."
          },
          {
            "q": "{私|わたし}のうち＿＿パーティーがあります。　〔Watashi no uchi__ paatii ga arimasu.〕　— Ở nhà tôi có tiệc.",
            "options": [
              "の",
              "を",
              "に",
              "で"
            ],
            "correct": 3,
            "why": "Sự kiện → で. → **{私|わたし}のうちでパーティーがあります。** 〔Watashi no uchi de paatii ga arimasu.〕 — Ở nhà tôi có tiệc."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np1-52",
        "title": "ポイント 52: đếm ～つ / ～枚 (5 câu)",
        "items": [
          {
            "q": "コンサートのチケットが＿＿あります。　〔Konsaato no chiketto ga __ arimasu.〕　— Tôi có hai vé hoà nhạc.",
            "options": [
              "{二時|にじ}",
              "{二枚|にまい}",
              "{二日|ふつか}",
              "{二人|ふたり}"
            ],
            "correct": 1,
            "why": "Vé = vật mỏng → **～枚** (ポイント 52). → **コンサートのチケットが{二枚|にまい}あります。** 〔Konsaato no chiketto ga nimai arimasu.〕 — Tôi có hai vé hoà nhạc."
          },
          {
            "q": "りんごが＿＿あります。　〔Ringo ga __ arimasu.〕　— Có ba quả táo.",
            "options": [
              "{三時|さんじ}",
              "{三|みっ}つ",
              "{三枚|さんまい}",
              "{三人|さんにん}"
            ],
            "correct": 1,
            "why": "Đồ vật nói chung → **～つ**. → **りんごが{三|みっ}つあります。** 〔Ringo ga mittsu arimasu.〕 — Có ba quả táo."
          },
          {
            "q": "いすが＿＿あります。　〔Isu ga __ arimasu.〕　— Có bốn cái ghế.",
            "options": [
              "{四|よっ}つ",
              "{四時|よじ}",
              "{四人|よにん}",
              "{四枚|よんまい}"
            ],
            "correct": 0,
            "why": "四つ đọc **よっつ**. → **いすが{四|よっ}つあります。** 〔Isu ga yottsu arimasu.〕 — Có bốn cái ghế."
          },
          {
            "q": "{切符|きっぷ}が＿＿あります。　〔Kippu ga __ arimasu.〕　— Có năm vé tàu.",
            "options": [
              "{五人|ごにん}",
              "{五|いつ}つ",
              "{五時|ごじ}",
              "{五枚|ごまい}"
            ],
            "correct": 3,
            "why": "Vé tàu → ～枚 (五枚 = ごまい). → **{切符|きっぷ}が{五枚|ごまい}あります。** 〔Kippu ga gomai arimasu.〕 — Có năm vé tàu."
          },
          {
            "q": "テーブルのうえにコップが＿＿あります。　〔Teeburu no ue ni koppu ga __ arimasu.〕　— Trên bàn có sáu cái cốc.",
            "options": [
              "{六人|ろくにん}",
              "{六|むっ}つ",
              "{六枚|ろくまい}",
              "{六時|ろくじ}"
            ],
            "correct": 1,
            "why": "六つ = むっつ. → **テーブルのうえにコップが{六|むっ}つあります。** 〔Teeburu no ue ni koppu ga muttsu arimasu.〕 — Trên bàn có sáu cái cốc."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chia từ · hỏi–đáp · sửa câu sai · ghép câu"
      },
      {
        "t": "quiz",
        "id": "lt-b6-np1-chia",
        "title": "Chia động từ: ～ませんか / ～ましょう (10 câu)",
        "kind": "fill",
        "grammar": "Vます → Vませんか (rủ) · Vましょう (đồng ý)",
        "items": [
          {
            "q": "{一緒|いっしょ}に{映画|えいが}を＿＿。　〔Issho ni eiga o __.〕",
            "answers": [
              "見ませんか",
              "みませんか"
            ],
            "hint": "見ます → rủ: \"… không?\""
          },
          {
            "q": "{今晩|こんばん}、ビールを＿＿。　〔Konban, biiru o __.〕",
            "answers": [
              "飲みませんか",
              "のみませんか"
            ],
            "hint": "飲みます → rủ"
          },
          {
            "q": "{日曜日|にちようび}、デパートへ＿＿。　〔Nichiyoubi, depaato e __.〕",
            "answers": [
              "行きませんか",
              "いきませんか"
            ],
            "hint": "行きます → rủ"
          },
          {
            "q": "{明日|あした}、{一緒|いっしょ}に＿＿。　〔Ashita, issho ni __.〕",
            "answers": [
              "勉強しませんか",
              "べんきょうしませんか"
            ],
            "hint": "勉強します → rủ"
          },
          {
            "q": "{土曜日|どようび}、{友達|ともだち}に＿＿。　〔Doyoubi, tomodachi ni __.〕",
            "answers": [
              "会いませんか",
              "あいませんか"
            ],
            "hint": "会います → rủ"
          },
          {
            "q": "いいですね。{一緒|いっしょ}に＿＿。　〔Ii desu ne. Issho ni __.〕",
            "answers": [
              "食べましょう",
              "たべましょう"
            ],
            "hint": "食べます → đồng ý \"… thôi\""
          },
          {
            "q": "ええ、{六時|ろくじ}に＿＿。　〔Ee, rokuji ni __.〕",
            "answers": [
              "帰りましょう",
              "かえりましょう"
            ],
            "hint": "帰ります → \"… thôi\""
          },
          {
            "q": "{駅|えき}で＿＿。　〔Eki de __.〕",
            "answers": [
              "会いましょう",
              "あいましょう"
            ],
            "hint": "会います → \"… nhé\""
          },
          {
            "q": "{今|いま}から＿＿。　〔Ima kara __.〕",
            "answers": [
              "休みましょう",
              "やすみましょう"
            ],
            "hint": "休みます → \"… thôi\""
          },
          {
            "q": "{一緒|いっしょ}に{買|か}い{物|もの}を＿＿。　〔Issho ni kaimono o __.〕",
            "answers": [
              "しましょう"
            ],
            "hint": "します → \"… thôi\""
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np1-hoi-dap",
        "title": "Hỏi–đáp: chọn câu trả lời tự nhiên (8 câu)",
        "items": [
          {
            "q": "{一緒|いっしょ}に{昼|ひる}ご{飯|はん}を{食|た}べませんか。　〔Issho ni hirugohan o tabemasen ka.〕　Câu trả lời tự nhiên nhất là gì?",
            "options": [
              "ええ、{食|た}べません。 (Ee, tabemasen.)",
              "ええ、{食|た}べましょう。 (Ee, tabemashou.)",
              "はい、{食|た}べました。 (Hai, tabemashita.)",
              "いいえ、{食|た}べませんでした。 (Iie, tabemasen deshita.)"
            ],
            "correct": 1,
            "why": "Lời rủ ～ませんか → nhận lời bằng **ええ、～ましょう**."
          },
          {
            "q": "{今晩|こんばん}、カラオケに{行|い}きませんか。　〔Konban, karaoke ni ikimasen ka.〕　Câu trả lời tự nhiên nhất là gì?",
            "options": [
              "いいえ、{行|い}きました。 (Iie, ikimashita.)",
              "はい、カラオケです。 (Hai, karaoke desu.)",
              "ええ、{行|い}きません。 (Ee, ikimasen.)",
              "すみません、ちょっと……。 (Sumimasen, chotto....)"
            ],
            "correct": 3,
            "why": "Từ chối khéo: **すみません、ちょっと……** (không nêu lý do)."
          },
          {
            "q": "{明日|あした}、{一緒|いっしょ}に{勉強|べんきょう}しませんか。　〔Ashita, issho ni benkyoushimasen ka.〕　Câu trả lời tự nhiên nhất là gì?",
            "options": [
              "いいえ、{勉強|べんきょう}します。 (Iie, benkyoushimasu.)",
              "ええ、{勉強|べんきょう}しません。 (Ee, benkyoushimasen.)",
              "いいですね。{勉強|べんきょう}しましょう。 (Ii desu ne. Benkyoushimashou.)",
              "はい、{勉強|べんきょう}しました。 (Hai, benkyoushimashita.)"
            ],
            "correct": 2,
            "why": "Nhận lời: いいですね + ～ましょう."
          },
          {
            "q": "{来週|らいしゅう}の{土曜日|どようび}、{何|なに}かありますか。　〔Raishuu no doyoubi, nani ka arimasu ka.〕　Câu trả lời tự nhiên nhất là gì?",
            "options": [
              "{友達|ともだち}と{約束|やくそく}にあります。 (Tomodachi to yakusoku ni arimasu.)",
              "{友達|ともだち}をあります。 (Tomodachi o arimasu.)",
              "{友達|ともだち}で{約束|やくそく}があります。 (Tomodachi de yakusoku ga arimasu.)",
              "{友達|ともだち}と{約束|やくそく}があります。 (Tomodachi to yakusoku ga arimasu.)"
            ],
            "correct": 3,
            "why": "**N が あります**; 友達と = với bạn."
          },
          {
            "q": "どこでコンサートがありますか。　〔Doko de konsaato ga arimasu ka.〕　Câu trả lời tự nhiên nhất là gì?",
            "options": [
              "{公園|こうえん}があります。 (Kouen ga arimasu.)",
              "{公園|こうえん}をあります。 (Kouen o arimasu.)",
              "{公園|こうえん}にあります。 (Kouen ni arimasu.)",
              "{公園|こうえん}であります。 (Kouen de arimasu.)"
            ],
            "correct": 3,
            "why": "Hỏi nơi diễn ra sự kiện → **N で あります**."
          },
          {
            "q": "チケットは{何枚|なんまい}ありますか。　〔Chiketto wa nanmai arimasu ka.〕　Câu trả lời tự nhiên nhất là gì?",
            "options": [
              "{三時|さんじ}あります。 (Sanji arimasu.)",
              "{三枚|さんまい}あります。 (Sanmai arimasu.)",
              "{三人|さんにん}あります。 (Sannin arimasu.)",
              "{三|みっ}つあります。 (Mittsu arimasu.)"
            ],
            "correct": 1,
            "why": "Hỏi bao nhiêu vé → **何枚** → trả lời 三枚."
          },
          {
            "q": "{明日|あした}、{一緒|いっしょ}に{海|うみ}へ{行|い}きませんか。　〔Ashita, issho ni umi e ikimasen ka.〕　Câu trả lời tự nhiên nhất là gì?",
            "options": [
              "あしたはちょっと……。{用事|ようじ}をありますから。 (Ashita wa chotto.... Youji o arimasu kara.)",
              "あしたはちょっと……。{用事|ようじ}がありますから。 (Ashita wa chotto.... Youji ga arimasu kara.)",
              "ええ、{用事|ようじ}があります。{行|い}きましょう。 (Ee, youji ga arimasu. Ikimashou.)",
              "いいえ、{用事|ようじ}があります。{行|い}きましょう。 (Iie, youji ga arimasu. Ikimashou.)"
            ],
            "correct": 1,
            "why": "Từ chối: N は ちょっと…… + lý do (用事が あります)."
          },
          {
            "q": "テストはいつありますか。　〔Tesuto wa itsu arimasu ka.〕　Câu trả lời tự nhiên nhất là gì?",
            "options": [
              "{来週|らいしゅう}の{月曜日|げつようび}にあります。 (Raishuu no getsuyoubi ni arimasu.)",
              "{来週|らいしゅう}の{月曜日|げつようび}はありませんね。 (Raishuu no getsuyoubi wa arimasen ne.)",
              "{来週|らいしゅう}の{月曜日|げつようび}をあります。 (Raishuu no getsuyoubi o arimasu.)",
              "{来週|らいしゅう}の{月曜日|げつようび}であります。 (Raishuu no getsuyoubi de arimasu.)"
            ],
            "correct": 0,
            "why": "Có (sự kiện) vào thời điểm: N に あります."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np1-sai",
        "title": "Tìm câu SAI (6 câu)",
        "items": [
          {
            "q": "(rủ)　Câu nào SAI?",
            "options": [
              "{一緒|いっしょ}に{食|た}べましょう。 (Issho ni tabemashou.)",
              "{一緒|いっしょ}に{食|た}べましょうか。 (Issho ni tabemashou ka.)",
              "{一緒|いっしょ}に{食|た}べましたか。 (Issho ni tabemashita ka.)",
              "{一緒|いっしょ}に{食|た}べませんか。 (Issho ni tabemasen ka.)"
            ],
            "correct": 2,
            "why": "Muốn RỦ thì không dùng quá khứ ました (hỏi đã ăn chưa)."
          },
          {
            "q": "(あります)　Câu nào SAI?",
            "options": [
              "{明日|あした}、{約束|やくそく}があります。 (Ashita, yakusoku ga arimasu.)",
              "{明日|あした}、{約束|やくそく}をあります。 (Ashita, yakusoku o arimasu.)",
              "{明日|あした}、テストがあります。 (Ashita, tesuto ga arimasu.)",
              "{明日|あした}、{用事|ようじ}があります。 (Ashita, youji ga arimasu.)"
            ],
            "correct": 1,
            "why": "Có hẹn/việc/bài thi → **が あります**, không を."
          },
          {
            "q": "(sự kiện)　Câu nào SAI?",
            "options": [
              "{駅|えき}でコンサートがあります。 (Eki de konsaato ga arimasu.)",
              "{公園|こうえん}で{花火|はなび}があります。 (Kouen de hanabi ga arimasu.)",
              "{大学|だいがく}でサッカーの{試合|しあい}があります。 (Daigaku de sakkaa no shiai ga arimasu.)",
              "{大学|だいがく}にサッカーの{試合|しあい}があります。 (Daigaku ni sakkaa no shiai ga arimasu.)"
            ],
            "correct": 3,
            "why": "Sự kiện diễn ra ở đâu → **で**, không に."
          },
          {
            "q": "(đếm vé)　Câu nào SAI?",
            "options": [
              "チケットが{二枚|にまい}あります。 (Chiketto ga nimai arimasu.)",
              "いすが{二|ふた}つあります。 (Isu ga futatsu arimasu.)",
              "チケットが{二|ふた}つあります。 (Chiketto ga futatsu arimasu.)",
              "{地図|ちず}が{二枚|にまい}あります。 (Chizu ga nimai arimasu.)"
            ],
            "correct": 2,
            "why": "Vé là vật mỏng → ～枚 (không dùng ふたつ)."
          },
          {
            "q": "(nhận lời)　Câu nào SAI?",
            "options": [
              "ええ、{行|い}きましょう。 (Ee, ikimashou.)",
              "ええ、{行|い}きませんか。 (Ee, ikimasen ka.)",
              "いいですね。{行|い}きましょう。 (Ii desu ne. Ikimashou.)",
              "ええ、{一緒|いっしょ}に{行|い}きましょう。 (Ee, issho ni ikimashou.)"
            ],
            "correct": 1,
            "why": "Nhận lời rủ → ～ましょう, không lặp lại ～ませんか."
          },
          {
            "q": "(từ chối)　Câu nào SAI?",
            "options": [
              "{明日|あした}はちょっと……。 (Ashita wa chotto....)",
              "すみません。{用事|ようじ}がありますから。 (Sumimasen. Youji ga arimasu kara.)",
              "すみません、ちょっと……。{行|い}きましょう。 (Sumimasen, chotto.... Ikimashou.)",
              "すみません、ちょっと……。 (Sumimasen, chotto....)"
            ],
            "correct": 2,
            "why": "Đã từ chối thì không nói ～ましょう nữa (mâu thuẫn)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np1-nhat-viet",
        "title": "Nhật → Việt: chọn nghĩa đúng (5 câu)",
        "items": [
          {
            "q": "Nghĩa của câu: {来週|らいしゅう}の{日曜日|にちようび}、{公園|こうえん}で{花火|はなび}があります。　〔Raishuu no nichiyoubi, kouen de hanabi ga arimasu.〕",
            "options": [
              "Chủ nhật tuần này có pháo hoa ở công viên.",
              "Chủ nhật tuần sau tôi có hẹn ở công viên.",
              "Chủ nhật tuần sau tôi đi công viên chơi.",
              "Chủ nhật tuần sau có pháo hoa ở công viên."
            ],
            "correct": 3,
            "why": "来週 = tuần sau; で = nơi sự kiện diễn ra."
          },
          {
            "q": "Nghĩa của câu: {今晩|こんばん}は{用事|ようじ}がありますから、ちょっと……。　〔Konban wa youji ga arimasu kara, chotto....〕",
            "options": [
              "Tối nay hay quá nhỉ.",
              "Tối nay tôi rảnh nên đi được.",
              "Tối nay tôi có việc bận nên hơi… (khó đi).",
              "Xin lỗi, tối nay tôi hiểu rồi."
            ],
            "correct": 2,
            "why": "から = vì; ちょっと…… = từ chối khéo."
          },
          {
            "q": "Nghĩa của câu: チケットが{三枚|さんまい}あります。　〔Chiketto ga sanmai arimasu.〕",
            "options": [
              "Lúc ba giờ có vé.",
              "Có ba cái bàn.",
              "Có ba người.",
              "Tôi có ba vé."
            ],
            "correct": 3,
            "why": "～枚 đếm vé."
          },
          {
            "q": "Nghĩa của câu: {一緒|いっしょ}に{海|うみ}へ{行|い}きましょう。　〔Issho ni umi e ikimashou.〕",
            "options": [
              "Bạn có đi biển không?",
              "Tôi không đi biển.",
              "Hôm qua tôi đã ra biển.",
              "Cùng đi ra biển thôi."
            ],
            "correct": 3,
            "why": "Vましょう = cùng làm … thôi."
          },
          {
            "q": "Nghĩa của câu: {土曜日|どようび}、{一緒|いっしょ}に{買|か}い{物|もの}に{行|い}きませんか。　〔Doyoubi, issho ni kaimono ni ikimasen ka.〕",
            "options": [
              "Thứ Bảy cùng đi mua sắm không?",
              "Thứ Bảy tôi sẽ đi mua sắm.",
              "Thứ Bảy tôi đã đi mua sắm.",
              "Thứ Bảy cùng đi mua sắm thôi."
            ],
            "correct": 0,
            "why": "ませんか = rủ (hỏi), khác ましょう (khẳng định)."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-np1-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Tối nay cùng đi ăn cơm không?",
            "chips": [
              "{今晩|こんばん}",
              "{一緒|いっしょ}に",
              "{行|い}きませんか",
              "{食|た}べに",
              "{行|い}きましょう",
              "ご{飯|はん}を"
            ],
            "answer": [
              "{今晩|こんばん}",
              "{一緒|いっしょ}に",
              "ご{飯|はん}を",
              "{食|た}べに",
              "{行|い}きませんか"
            ],
            "ro": "Konban issho ni gohan o tabeni ikimasen ka?"
          },
          {
            "vi": "Ừ, đi thôi.",
            "chips": [
              "{行|い}きましょう",
              "ええ",
              "{行|い}きませんか"
            ],
            "answer": [
              "ええ",
              "{行|い}きましょう"
            ],
            "ro": "Ee ikimashou."
          },
          {
            "vi": "Xin lỗi, hôm nay hơi…",
            "chips": [
              "{今日|きょう}は",
              "……",
              "ちょっと",
              "です",
              "すみません"
            ],
            "answer": [
              "すみません",
              "{今日|きょう}は",
              "ちょっと",
              "……"
            ],
            "ro": "Sumimasen kyou wa chotto...."
          },
          {
            "vi": "Thứ Sáu tôi có hẹn.",
            "chips": [
              "{金曜日|きんようび}",
              "あります",
              "を",
              "{約束|やくそく}が"
            ],
            "answer": [
              "{金曜日|きんようび}",
              "{約束|やくそく}が",
              "あります"
            ],
            "ro": "Kin'youbi yakusoku ga arimasu."
          },
          {
            "vi": "Ở nhà tôi có tiệc.",
            "chips": [
              "{私|わたし}の",
              "あります",
              "パーティーが",
              "うちで",
              "に"
            ],
            "answer": [
              "{私|わたし}の",
              "うちで",
              "パーティーが",
              "あります"
            ],
            "ro": "Watashi no uchi de paatii ga arimasu."
          },
          {
            "vi": "Tôi có ba vé.",
            "chips": [
              "{三枚|さんまい}",
              "あります",
              "{三|みっ}つ",
              "チケットが"
            ],
            "answer": [
              "チケットが",
              "{三枚|さんまい}",
              "あります"
            ],
            "ro": "Chiketto ga sanmai arimasu."
          },
          {
            "vi": "Ngày mai cùng học ở thư viện không?",
            "chips": [
              "{勉強|べんきょう}しませんか",
              "{一緒|いっしょ}に",
              "{図書館|としょかん}で",
              "を",
              "{明日|あした}"
            ],
            "answer": [
              "{明日|あした}",
              "{図書館|としょかん}で",
              "{一緒|いっしょ}に",
              "{勉強|べんきょう}しませんか"
            ],
            "ro": "Ashita toshokan de issho ni benkyoushimasen ka?"
          },
          {
            "vi": "Mười hai giờ rồi. Ăn thôi.",
            "chips": [
              "{食|た}べませんか",
              "{十二時|じゅうにじ}です",
              "{食|た}べましょう"
            ],
            "answer": [
              "{十二時|じゅうにじ}です",
              "{食|た}べましょう"
            ],
            "ro": "Juuniji desu tabemashou."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch Việt → Nhật · nhiều chỗ trống như đề thi"
      },
      {
        "t": "quiz",
        "id": "lt-b6-np1-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 48–52",
        "items": [
          {
            "q": "Chủ nhật cùng đi xem phim không?",
            "answers": [
              "日曜日、一緒に映画を見に行きませんか。",
              "日曜日、一緒に映画を見にいきませんか。",
              "日曜日、一緒に映画をみに行きませんか。",
              "日曜日、一緒に映画をみにいきませんか。",
              "日曜日、一緒にえいがを見に行きませんか。",
              "日曜日、一緒にえいがを見にいきませんか。",
              "日曜日、一緒にえいがをみに行きませんか。",
              "日曜日、一緒にえいがをみにいきませんか。",
              "日曜日、いっしょに映画を見に行きませんか。",
              "日曜日、いっしょに映画を見にいきませんか。",
              "日曜日、いっしょに映画をみに行きませんか。",
              "日曜日、いっしょに映画をみにいきませんか。",
              "日曜日、いっしょにえいがを見に行きませんか。",
              "日曜日、いっしょにえいがを見にいきませんか。",
              "日曜日、いっしょにえいがをみに行きませんか。",
              "日曜日、いっしょにえいがをみにいきませんか。",
              "にちようび、一緒に映画を見に行きませんか。",
              "にちようび、一緒に映画を見にいきませんか。",
              "にちようび、一緒に映画をみに行きませんか。",
              "にちようび、一緒に映画をみにいきませんか。",
              "にちようび、一緒にえいがを見に行きませんか。",
              "にちようび、一緒にえいがを見にいきませんか。",
              "にちようび、一緒にえいがをみに行きませんか。",
              "にちようび、一緒にえいがをみにいきませんか。",
              "にちようび、いっしょに映画を見に行きませんか。",
              "にちようび、いっしょに映画を見にいきませんか。",
              "にちようび、いっしょに映画をみに行きませんか。",
              "にちようび、いっしょに映画をみにいきませんか。",
              "にちようび、いっしょにえいがを見に行きませんか。",
              "にちようび、いっしょにえいがを見にいきませんか。",
              "にちようび、いっしょにえいがをみに行きませんか。",
              "にちようび、いっしょにえいがをみにいきませんか。",
              "日曜日、一緒に映画を見ませんか。",
              "日曜日、一緒に映画をみませんか。",
              "日曜日、一緒にえいがを見ませんか。",
              "日曜日、一緒にえいがをみませんか。",
              "日曜日、いっしょに映画を見ませんか。",
              "日曜日、いっしょに映画をみませんか。",
              "日曜日、いっしょにえいがを見ませんか。",
              "日曜日、いっしょにえいがをみませんか。",
              "にちようび、一緒に映画を見ませんか。",
              "にちようび、一緒に映画をみませんか。",
              "にちようび、一緒にえいがを見ませんか。",
              "にちようび、一緒にえいがをみませんか。",
              "にちようび、いっしょに映画を見ませんか。",
              "にちようび、いっしょに映画をみませんか。",
              "にちようび、いっしょにえいがを見ませんか。",
              "にちようび、いっしょにえいがをみませんか。"
            ],
            "hint": "Vませんか · 映画を見に行きます"
          },
          {
            "q": "Xin lỗi, Chủ nhật tôi hơi… Tôi có hẹn.",
            "answers": [
              "すみません。日曜日はちょっと……。約束があります。",
              "すみません。日曜日はちょっと……。やくそくがあります。",
              "すみません。にちようびはちょっと……。約束があります。",
              "すみません。にちようびはちょっと……。やくそくがあります。",
              "すみません、日曜日はちょっと……。約束があります。",
              "すみません、日曜日はちょっと……。やくそくがあります。",
              "すみません、にちようびはちょっと……。約束があります。",
              "すみません、にちようびはちょっと……。やくそくがあります。"
            ],
            "hint": "N は ちょっと…… · N が あります"
          },
          {
            "q": "Tuần sau ở trường đại học có trận bóng đá.",
            "answers": [
              "来週、大学でサッカーの試合があります。",
              "来週、大学でサッカーのしあいがあります。",
              "来週、だいがくでサッカーの試合があります。",
              "来週、だいがくでサッカーのしあいがあります。",
              "らいしゅう、大学でサッカーの試合があります。",
              "らいしゅう、大学でサッカーのしあいがあります。",
              "らいしゅう、だいがくでサッカーの試合があります。",
              "らいしゅう、だいがくでサッカーのしあいがあります。",
              "来週大学でサッカーの試合があります。",
              "来週大学でサッカーのしあいがあります。",
              "来週だいがくでサッカーの試合があります。",
              "来週だいがくでサッカーのしあいがあります。",
              "らいしゅう大学でサッカーの試合があります。",
              "らいしゅう大学でサッカーのしあいがあります。",
              "らいしゅうだいがくでサッカーの試合があります。",
              "らいしゅうだいがくでサッカーのしあいがあります。"
            ],
            "hint": "N で N が あります"
          },
          {
            "q": "Tôi có hai vé hoà nhạc. Cùng đi nhé?",
            "answers": [
              "コンサートのチケットが二枚あります。一緒に行きませんか。",
              "コンサートのチケットが二枚あります。一緒にいきませんか。",
              "コンサートのチケットが二枚あります。いっしょに行きませんか。",
              "コンサートのチケットが二枚あります。いっしょにいきませんか。",
              "コンサートのチケットがにまいあります。一緒に行きませんか。",
              "コンサートのチケットがにまいあります。一緒にいきませんか。",
              "コンサートのチケットがにまいあります。いっしょに行きませんか。",
              "コンサートのチケットがにまいあります。いっしょにいきませんか。"
            ],
            "hint": "～枚 · Vませんか"
          },
          {
            "q": "Ừ, hay đấy. Cùng đi thôi.",
            "answers": [
              "ええ、いいですね。一緒に行きましょう。",
              "ええ、いいですね。一緒にいきましょう。",
              "ええ、いいですね。いっしょに行きましょう。",
              "ええ、いいですね。いっしょにいきましょう。",
              "いいですね。一緒に行きましょう。",
              "いいですね。一緒にいきましょう。",
              "いいですね。いっしょに行きましょう。",
              "いいですね。いっしょにいきましょう。"
            ],
            "hint": "いいですね · Vましょう"
          },
          {
            "q": "Ngày mai gặp nhau ở ga nhé.",
            "answers": [
              "明日、駅で会いましょう。",
              "明日、駅であいましょう。",
              "明日、えきで会いましょう。",
              "明日、えきであいましょう。",
              "あした、駅で会いましょう。",
              "あした、駅であいましょう。",
              "あした、えきで会いましょう。",
              "あした、えきであいましょう。"
            ],
            "hint": "Vましょう"
          },
          {
            "q": "Ở công viên có pháo hoa. Cùng đi xem không?",
            "answers": [
              "公園で花火があります。一緒に見に行きませんか。",
              "公園で花火があります。一緒に見にいきませんか。",
              "公園で花火があります。一緒にみに行きませんか。",
              "公園で花火があります。一緒にみにいきませんか。",
              "公園で花火があります。いっしょに見に行きませんか。",
              "公園で花火があります。いっしょに見にいきませんか。",
              "公園で花火があります。いっしょにみに行きませんか。",
              "公園で花火があります。いっしょにみにいきませんか。",
              "公園ではなびがあります。一緒に見に行きませんか。",
              "公園ではなびがあります。一緒に見にいきませんか。",
              "公園ではなびがあります。一緒にみに行きませんか。",
              "公園ではなびがあります。一緒にみにいきませんか。",
              "公園ではなびがあります。いっしょに見に行きませんか。",
              "公園ではなびがあります。いっしょに見にいきませんか。",
              "公園ではなびがあります。いっしょにみに行きませんか。",
              "公園ではなびがあります。いっしょにみにいきませんか。",
              "こうえんで花火があります。一緒に見に行きませんか。",
              "こうえんで花火があります。一緒に見にいきませんか。",
              "こうえんで花火があります。一緒にみに行きませんか。",
              "こうえんで花火があります。一緒にみにいきませんか。",
              "こうえんで花火があります。いっしょに見に行きませんか。",
              "こうえんで花火があります。いっしょに見にいきませんか。",
              "こうえんで花火があります。いっしょにみに行きませんか。",
              "こうえんで花火があります。いっしょにみにいきませんか。",
              "こうえんではなびがあります。一緒に見に行きませんか。",
              "こうえんではなびがあります。一緒に見にいきませんか。",
              "こうえんではなびがあります。一緒にみに行きませんか。",
              "こうえんではなびがあります。一緒にみにいきませんか。",
              "こうえんではなびがあります。いっしょに見に行きませんか。",
              "こうえんではなびがあります。いっしょに見にいきませんか。",
              "こうえんではなびがあります。いっしょにみに行きませんか。",
              "こうえんではなびがあります。いっしょにみにいきませんか。"
            ],
            "hint": "N で N が あります · Vに行きます"
          },
          {
            "q": "Trên bàn có ba cái cốc.",
            "answers": [
              "テーブルのうえにコップが三つあります。",
              "テーブルのうえにコップがみっつあります。",
              "テーブルの上にコップが三つあります。",
              "テーブルの上にコップがみっつあります。"
            ],
            "hint": "N に N が あります · ～つ"
          },
          {
            "q": "Thứ Tư tuần này tôi có bài kiểm tra tiếng Nhật.",
            "answers": [
              "今週の水曜日、日本語のテストがあります。",
              "今週の水曜日、にほんごのテストがあります。",
              "今週のすいようび、日本語のテストがあります。",
              "今週のすいようび、にほんごのテストがあります。",
              "こんしゅうの水曜日、日本語のテストがあります。",
              "こんしゅうの水曜日、にほんごのテストがあります。",
              "こんしゅうのすいようび、日本語のテストがあります。",
              "こんしゅうのすいようび、にほんごのテストがあります。"
            ],
            "hint": "N が あります"
          },
          {
            "q": "Tối nay cùng uống cà phê nhé?",
            "answers": [
              "今晩、一緒にコーヒーを飲みませんか。",
              "今晩、一緒にコーヒーをのみませんか。",
              "今晩、いっしょにコーヒーを飲みませんか。",
              "今晩、いっしょにコーヒーをのみませんか。",
              "こんばん、一緒にコーヒーを飲みませんか。",
              "こんばん、一緒にコーヒーをのみませんか。",
              "こんばん、いっしょにコーヒーを飲みませんか。",
              "こんばん、いっしょにコーヒーをのみませんか。"
            ],
            "hint": "Vませんか"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np1-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng ①②③ (5 câu)",
        "items": [
          {
            "q": "{今度|こんど}の{日曜日|にちようび}、{野球|やきゅう}の{試合|しあい}（①）{見|み}（②）{行|い}き（③）。　〔Kondo no nichiyoubi, yakyuu no shiai((1)) mi((2)) iki((3)).〕　— Chủ nhật tới cùng đi xem trận bóng chày không?",
            "options": [
              "① を　② に　③ ました",
              "① が　② に　③ ませんか",
              "① を　② に　③ ませんか",
              "① を　② で　③ ましょう"
            ],
            "correct": 2,
            "why": "Cấu trúc: N を V(bỏ ます) に 行きませんか. → **{今度|こんど}の{日曜日|にちようび}、{野球|やきゅう}の{試合|しあい}を{見|み}に{行|い}きませんか。** 〔Kondo no nichiyoubi, yakyuu no shiai o mi ni ikimasen ka.〕 — Chủ nhật tới cùng đi xem trận bóng chày không?"
          },
          {
            "q": "A：{来週|らいしゅう}の{金曜日|きんようび}、{大学|だいがく}（①）コンサート（②）あります。{一緒|いっしょ}に{行|い}き（③）。　〔A:raishuu no kin'youbi, daigaku((1)) konsaato((2)) arimasu. Issho ni iki((3)).〕　— Thứ Sáu tuần sau ở đại học có buổi hoà nhạc. Cùng đi không?",
            "options": [
              "① で　② が　③ ました",
              "① で　② を　③ ませんか",
              "① で　② が　③ ませんか",
              "① に　② を　③ ませんか"
            ],
            "correct": 2,
            "why": "で (nơi sự kiện) + が あります + Vませんか. → **A：{来週|らいしゅう}の{金曜日|きんようび}、{大学|だいがく}でコンサートがあります。{一緒|いっしょ}に{行|い}きませんか。** 〔A:raishuu no kin'youbi, daigaku de konsaato ga arimasu. Issho ni ikimasen ka.〕 — Thứ Sáu tuần sau ở đại học có buổi hoà nhạc. Cùng đi không?"
          },
          {
            "q": "A：{日曜日|にちようび}、{映画|えいが}（①）{見|み}（②）{行|い}きませんか。B：{日曜日|にちようび}はちょっと……。{用事|ようじ}（③）ありますから。　〔A:nichiyoubi, eiga((1)) mi((2)) ikimasen ka. B:nichiyoubi wa chotto.... Youji((3)) arimasu kara.〕　— A: Chủ nhật đi xem phim không? B: Chủ nhật hơi… Vì tôi có việc bận.",
            "options": [
              "① に　② が　③ が",
              "① が　② を　③ を",
              "① を　② に　③ を",
              "① を　② に　③ が"
            ],
            "correct": 3,
            "why": "見に行きます · 用事が あります. → **A：{日曜日|にちようび}、{映画|えいが}を{見|み}に{行|い}きませんか。B：{日曜日|にちようび}はちょっと……。{用事|ようじ}がありますから。** 〔A:nichiyoubi, eiga o mi ni ikimasen ka. B:nichiyoubi wa chotto.... Youji ga arimasu kara.〕 — A: Chủ nhật đi xem phim không? B: Chủ nhật hơi… Vì tôi có việc bận."
          },
          {
            "q": "チケット（①）{二枚|にまい}あります。{土曜日|どようび}、{公園|こうえん}（②）{花火|はなび}（③）あります。　〔Chiketto((1)) nimai arimasu. Doyoubi, kouen((2)) hanabi((3)) arimasu.〕　— Tôi có hai vé. Thứ Bảy ở công viên có pháo hoa.",
            "options": [
              "① を　② に　③ が",
              "① は　② で　③ を",
              "① が　② に　③ を",
              "① が　② で　③ が"
            ],
            "correct": 3,
            "why": "N が ～枚 あります · N で N が あります. → **チケットが{二枚|にまい}あります。{土曜日|どようび}、{公園|こうえん}で{花火|はなび}があります。** 〔Chiketto ga nimai arimasu. Doyoubi, kouen de hanabi ga arimasu.〕 — Tôi có hai vé. Thứ Bảy ở công viên có pháo hoa."
          },
          {
            "q": "A：{一緒|いっしょ}に{帰|かえ}り（①）。B：ええ、{帰|かえ}り（②）。　〔A:issho ni kaeri((1)). B:ee, kaeri((2)).〕　— A: Cùng về không? B: Ừ, về thôi.",
            "options": [
              "① ませんか　② ましょう",
              "① ましょう　② ませんか",
              "① ませんか　② ません",
              "① ました　② ましょう"
            ],
            "correct": 0,
            "why": "Rủ = ～ませんか; nhận lời = ～ましょう. → **A：{一緒|いっしょ}に{帰|かえ}りませんか。B：ええ、{帰|かえ}りましょう。** 〔A:issho ni kaerimasen ka. B:ee, kaerimashou.〕 — A: Cùng về không? B: Ừ, về thôi."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b6-np-2",
    "kind": "homework",
    "title": "Luyện thêm Bài 6 · Ngữ pháp 2 (ポイント 53–56) — nhất · hơn · hỏi chọn 1 trong 2 · N の ほうが (~75 câu)",
    "goal": "Hỏi và trả lời so sánh đúng: \"nhất\" (N で … が いちばん), \"hơn\" (N1 は N2 より), chọn một trong hai (N1 と N2 と どちらが) và trả lời bằng N の ほうが / どちらも.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Quy tắc vàng: **2 thứ → どちら**, **3 thứ trở lên → いちばん**. Đừng trộn hai kiểu vào cùng một câu.",
          "**より đứng sau cái THUA**, **の ほうが đứng sau cái THẮNG**: 電車は バス**より** 早い = バスより 電車**の ほうが** 早い. Vẽ hai mũi tên nhỏ trên giấy nháp nếu hay nhầm.",
          "Sau より muốn nhấn mạnh: **ずっと** (hơn nhiều) · **ちょっと／すこし** (hơn chút). Không dùng とても sau より."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**N1 で N2 が いちばん A です** — nhất trong phạm vi N1. Hỏi: 何／いつ／だれ／どこ が いちばん A ですか。",
          "**N1 は N2 より A です** (N1 hơn N2) = **N2 より N1 の ほうが A です**.",
          "**N1 と N2 と どちらが A ですか** → **N1／N2 の ほうが A です** hoặc **どちらも A です**."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · điền một chỗ trống · có nghĩa Việt kèm"
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-53",
        "title": "ポイント 53: いちばん (6 câu)",
        "items": [
          {
            "q": "{食|た}べ{物|もの}＿＿、{何|なに}がいちばん{好|す}きですか。　〔Tabemono__, nani ga ichiban suki desu ka.〕　— Trong các món ăn, bạn thích món nào nhất?",
            "options": [
              "を",
              "で",
              "が",
              "に"
            ],
            "correct": 1,
            "why": "N1**で** = phạm vi so sánh (ポイント 53). → **{食|た}べ{物|もの}で、{何|なに}がいちばん{好|す}きですか。** 〔Tabemono de, nani ga ichiban suki desu ka.〕 — Trong các món ăn, bạn thích món nào nhất?"
          },
          {
            "q": "{季節|きせつ}で、＿＿がいちばん{好|す}きですか。　〔Kisetsu de, __ ga ichiban suki desu ka.〕　— Trong các mùa, bạn thích mùa nào nhất?",
            "options": [
              "いくら",
              "どこ",
              "だれ",
              "いつ"
            ],
            "correct": 3,
            "why": "Hỏi về mùa/thời gian → **いつ**. → **{季節|きせつ}で、いつがいちばん{好|す}きですか。** 〔Kisetsu de, itsu ga ichiban suki desu ka.〕 — Trong các mùa, bạn thích mùa nào nhất?"
          },
          {
            "q": "クラスで＿＿がいちばん{忙|いそが}しいですか。　〔Kurasu de __ ga ichiban isogashii desu ka.〕　— Trong lớp, ai bận nhất?",
            "options": [
              "いつ",
              "どこ",
              "いくら",
              "だれ"
            ],
            "correct": 3,
            "why": "Hỏi người → **だれ**. → **クラスでだれがいちばん{忙|いそが}しいですか。** 〔Kurasu de dare ga ichiban isogashii desu ka.〕 — Trong lớp, ai bận nhất?"
          },
          {
            "q": "ベトナムで＿＿がいちばん{暑|あつ}いですか。　〔Betonamu de __ ga ichiban atsui desu ka.〕　— Ở Việt Nam, nơi nào nóng nhất?",
            "options": [
              "どこ",
              "いくら",
              "だれ",
              "いつ"
            ],
            "correct": 0,
            "why": "Hỏi nơi chốn → **どこ**. → **ベトナムでどこがいちばん{暑|あつ}いですか。** 〔Betonamu de doko ga ichiban atsui desu ka.〕 — Ở Việt Nam, nơi nào nóng nhất?"
          },
          {
            "q": "スポーツでサッカー＿＿いちばん{好|す}きです。　〔Supootsu de sakkaa__ ichiban suki desu.〕　— Trong các môn thể thao, tôi thích bóng đá nhất.",
            "options": [
              "に",
              "で",
              "を",
              "が"
            ],
            "correct": 3,
            "why": "Cái được chọn + **が** いちばん A です. → **スポーツでサッカーがいちばん{好|す}きです。** 〔Supootsu de sakkaa ga ichiban suki desu.〕 — Trong các môn thể thao, tôi thích bóng đá nhất."
          },
          {
            "q": "{私|わたし}の{国|くに}で、{冬|ふゆ}が＿＿{寒|さむ}いです。　〔Watashi no kuni de, fuyu ga __ samui desu.〕　— Ở nước tôi, mùa đông lạnh nhất.",
            "options": [
              "いちばん",
              "ほう",
              "より",
              "どちら"
            ],
            "correct": 0,
            "why": "**いちばん** = nhất. → **{私|わたし}の{国|くに}で、{冬|ふゆ}がいちばん{寒|さむ}いです。** 〔Watashi no kuni de, fuyu ga ichiban samui desu.〕 — Ở nước tôi, mùa đông lạnh nhất."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-54",
        "title": "ポイント 54: より (6 câu)",
        "items": [
          {
            "q": "{電車|でんしゃ}はバス＿＿{早|はや}いです。　〔Densha wa basu__ hayai desu.〕　— Tàu điện nhanh hơn xe buýt.",
            "options": [
              "まで",
              "ほう",
              "より",
              "から"
            ],
            "correct": 2,
            "why": "N1 は N2**より** A (ポイント 54): đứng SAU cái bị so sánh (thua). → **{電車|でんしゃ}はバスより{早|はや}いです。** 〔Densha wa basu yori hayai desu.〕 — Tàu điện nhanh hơn xe buýt."
          },
          {
            "q": "ハノイはホーチミン＿＿{寒|さむ}いです。　〔Hanoi wa hoochimin__ samui desu.〕　— Hà Nội lạnh hơn TP.HCM.",
            "options": [
              "より",
              "まで",
              "ほう",
              "から"
            ],
            "correct": 0,
            "why": "N1 は N2 より A. → **ハノイはホーチミンより{寒|さむ}いです。** 〔Hanoi wa hoochimin yori samui desu.〕 — Hà Nội lạnh hơn TP.HCM."
          },
          {
            "q": "{日本|にほん}の{夏|なつ}はベトナム＿＿{涼|すず}しいです。　〔Nihon no natsu wa betonamu__ suzushii desu.〕　— Mùa hè Nhật mát hơn Việt Nam.",
            "options": [
              "から",
              "より",
              "まで",
              "ほう"
            ],
            "correct": 1,
            "why": "N1 は N2 より A. → **{日本|にほん}の{夏|なつ}はベトナムより{涼|すず}しいです。** 〔Nihon no natsu wa betonamu yori suzushii desu.〕 — Mùa hè Nhật mát hơn Việt Nam."
          },
          {
            "q": "{東京|とうきょう}は{京都|きょうと}より＿＿{人|ひと}が{多|おお}いです。　〔Toukyou wa kyouto yori __ hito ga ooi desu.〕　— Tokyo đông người hơn Kyoto nhiều.",
            "options": [
              "とても",
              "どちら",
              "いちばん",
              "ずっと"
            ],
            "correct": 3,
            "why": "Sau より dùng **ずっと** (hơn hẳn) / すこし・ちょっと (hơn chút), không dùng とても. → **{東京|とうきょう}は{京都|きょうと}よりずっと{人|ひと}が{多|おお}いです。** 〔Toukyou wa kyouto yori zutto hito ga ooi desu.〕 — Tokyo đông người hơn Kyoto nhiều."
          },
          {
            "q": "このかばんはあのかばん＿＿{高|たか}いです。　〔Kono kaban wa ano kaban__ takai desu.〕　— Cái cặp này đắt hơn cái kia.",
            "options": [
              "より",
              "ほう",
              "から",
              "まで"
            ],
            "correct": 0,
            "why": "N1 は N2 より A. → **このかばんはあのかばんより{高|たか}いです。** 〔Kono kaban wa ano kaban yori takai desu.〕 — Cái cặp này đắt hơn cái kia."
          },
          {
            "q": "このへやはあのへやより＿＿{広|ひろ}いです。　〔Kono heya wa ano heya yori __ hiroi desu.〕　— Phòng này rộng hơn phòng kia một chút.",
            "options": [
              "いちばん",
              "ほう",
              "ちょっと",
              "どちら"
            ],
            "correct": 2,
            "why": "**ちょっと／すこし** = hơn một chút. → **このへやはあのへやよりちょっと{広|ひろ}いです。** 〔Kono heya wa ano heya yori chotto hiroi desu.〕 — Phòng này rộng hơn phòng kia một chút."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-55",
        "title": "ポイント 55: どちらが (4 câu)",
        "items": [
          {
            "q": "{電車|でんしゃ}とバスと、＿＿が{早|はや}いですか。　〔Densha to basu to, __ ga hayai desu ka.〕　— Tàu điện và xe buýt, cái nào nhanh hơn?",
            "options": [
              "どちら",
              "どこ",
              "何",
              "だれ"
            ],
            "correct": 0,
            "why": "Chọn 1 trong 2 → **どちら** (ポイント 55). → **{電車|でんしゃ}とバスと、どちらが{早|はや}いですか。** 〔Densha to basu to, dochira ga hayai desu ka.〕 — Tàu điện và xe buýt, cái nào nhanh hơn?"
          },
          {
            "q": "ラーメンと{焼|や}き{肉|にく}と、どちら＿＿{好|す}きですか。　〔Raamen to yakiniku to, dochira__ suki desu ka.〕　— Ramen và thịt nướng, bạn thích món nào hơn?",
            "options": [
              "が",
              "で",
              "に",
              "を"
            ],
            "correct": 0,
            "why": "どちら**が** A ですか. → **ラーメンと{焼|や}き{肉|にく}と、どちらが{好|す}きですか。** 〔Raamen to yakiniku to, dochira ga suki desu ka.〕 — Ramen và thịt nướng, bạn thích món nào hơn?"
          },
          {
            "q": "{夏|なつ}と{冬|ふゆ}と、＿＿が{好|す}きですか。　〔Natsu to fuyu to, __ ga suki desu ka.〕　— Mùa hè và mùa đông, bạn thích mùa nào hơn?",
            "options": [
              "いつ",
              "どちら",
              "どこ",
              "だれ"
            ],
            "correct": 1,
            "why": "Chỉ có 2 lựa chọn → どちら. → **{夏|なつ}と{冬|ふゆ}と、どちらが{好|す}きですか。** 〔Natsu to fuyu to, dochira ga suki desu ka.〕 — Mùa hè và mùa đông, bạn thích mùa nào hơn?"
          },
          {
            "q": "A：{山|やま}と{海|うみ}と、どちらが{好|す}きですか。B：＿＿{好|す}きです。　〔A:yama to umi to, dochiraga suki desu ka. B:__ suki desu.〕　— A: Núi và biển bạn thích cái nào hơn? B: Cả hai tôi đều thích.",
            "options": [
              "どちらも",
              "いちばん",
              "どちら",
              "ほう"
            ],
            "correct": 0,
            "why": "Cả hai → **どちらも**. → **A：{山|やま}と{海|うみ}と、どちらが{好|す}きですか。B：どちらも{好|す}きです。** 〔A:yama to umi to, dochiraga suki desu ka. B:dochiramo suki desu.〕 — A: Núi và biển bạn thích cái nào hơn? B: Cả hai tôi đều thích."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-56",
        "title": "ポイント 56: の ほうが (4 câu)",
        "items": [
          {
            "q": "{地下鉄|ちかてつ}＿＿ほうが{早|はや}いです。　〔Chikatetsu__ hou ga hayai desu.〕　— Tàu điện ngầm nhanh hơn.",
            "options": [
              "が",
              "を",
              "の",
              "は"
            ],
            "correct": 2,
            "why": "**N の ほうが** A です (ポイント 56). → **{地下鉄|ちかてつ}のほうが{早|はや}いです。** 〔Chikatetsu no hou ga hayai desu.〕 — Tàu điện ngầm nhanh hơn."
          },
          {
            "q": "A：コーヒーとおちゃと、どちらが{好|す}きですか。B：おちゃ＿＿ほうが{好|す}きです。　〔A:koohii to ocha to, dochiraga suki desu ka. B:ocha__ hou ga suki desu.〕　— Tôi thích trà hơn.",
            "options": [
              "の",
              "を",
              "は",
              "が"
            ],
            "correct": 0,
            "why": "N の ほうが. → **A：コーヒーとおちゃと、どちらが{好|す}きですか。B：おちゃのほうが{好|す}きです。** 〔A:koohii to ocha to, dochiraga suki desu ka. B:ocha no hou ga suki desu.〕 — Tôi thích trà hơn."
          },
          {
            "q": "{野球|やきゅう}よりサッカーの＿＿が{好|す}きです。　〔Yakyuu yori sakkaa no __ ga suki desu.〕　— So với bóng chày, tôi thích bóng đá hơn.",
            "options": [
              "ほう",
              "より",
              "いちばん",
              "どちら"
            ],
            "correct": 0,
            "why": "N の **ほう** が. → **{野球|やきゅう}よりサッカーのほうが{好|す}きです。** 〔Yakyuu yori sakkaa no hou ga suki desu.〕 — So với bóng chày, tôi thích bóng đá hơn."
          },
          {
            "q": "バスより{電車|でんしゃ}＿＿ほうが{早|はや}いです。　〔Basu yori densha__ hou ga hayai desu.〕　— Tàu điện nhanh hơn xe buýt.",
            "options": [
              "を",
              "が",
              "は",
              "の"
            ],
            "correct": 3,
            "why": "N の ほうが (N = cái thắng). → **バスより{電車|でんしゃ}のほうが{早|はや}いです。** 〔Basu yori densha no hou ga hayai desu.〕 — Tàu điện nhanh hơn xe buýt."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn câu hỏi hợp · câu cùng nghĩa · tìm câu sai · gõ câu · ghép câu"
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-hoi",
        "title": "Nghe câu trả lời → chọn câu hỏi hợp (6 câu)",
        "items": [
          {
            "q": "B：サッカーがいちばん{好|す}きです。　〔Sakkaa ga ichiban suki desu.〕　Câu hỏi A hỏi phải là gì?",
            "options": [
              "スポーツで{何|なに}がいちばん{好|す}きですか。 (Supootsu de nani ga ichiban suki desu ka.)",
              "スポーツとサッカーと、どちらが{好|す}きですか。 (Supootsu to sakkaa to, dochira ga suki desu ka.)",
              "スポーツでだれがいちばん{好|す}きですか。 (Supootsu de dare ga ichiban suki desu ka.)",
              "スポーツはいつがいちばん{好|す}きですか。 (Supootsu wa itsu ga ichiban suki desu ka.)"
            ],
            "correct": 0,
            "why": "Trả lời \"X が いちばん\" → câu hỏi dạng **～で 何が いちばん ～ですか**."
          },
          {
            "q": "B：{冬|ふゆ}がいちばん{好|す}きです。　〔Fuyu ga ichiban suki desu.〕　Câu hỏi A hỏi phải là gì?",
            "options": [
              "{季節|きせつ}でだれがいちばん{好|す}きですか。 (Kisetsu de dare ga ichiban suki desu ka.)",
              "{季節|きせつ}でいつがいちばん{好|す}きですか。 (Kisetsu de itsu ga ichiban suki desu ka.)",
              "{季節|きせつ}はいくつありますか。 (Kisetsu wa ikutsu arimasu ka.)",
              "{夏|なつ}と{冬|ふゆ}とどちらが{好|す}きですか。 (Natsu to fuyu to dochira ga suki desu ka.)"
            ],
            "correct": 1,
            "why": "Hỏi mùa → いつ + いちばん."
          },
          {
            "q": "B：{電車|でんしゃ}のほうが{早|はや}いです。　〔Densha no hou ga hayai desu.〕　Câu hỏi A hỏi phải là gì?",
            "options": [
              "{電車|でんしゃ}とバスで、だれがいちばん{早|はや}いですか。 (Densha to basu de, dare ga ichiban hayai desu ka.)",
              "{電車|でんしゃ}はいつ{早|はや}いですか。 (Densha wa itsu hayai desu ka.)",
              "{電車|でんしゃ}とバスと、どちらが{早|はや}いですか。 (Densha to basu to, dochira ga hayai desu ka.)",
              "{電車|でんしゃ}が{何|なに}より{早|はや}いですか。 (Densha ga nani yori hayai desu ka.)"
            ],
            "correct": 2,
            "why": "Trả lời \"N の ほうが\" → hỏi **N1 と N2 と どちらが**."
          },
          {
            "q": "B：どちらも{好|す}きです。　〔Dochira mo suki desu.〕　Câu hỏi A hỏi phải là gì?",
            "options": [
              "{夏|なつ}はいつですか。 (Natsu wa itsu desu ka.)",
              "{夏|なつ}で{何|なに}がいちばん{好|す}きですか。 (Natsu de nani ga ichiban suki desu ka.)",
              "{夏|なつ}と{冬|ふゆ}と、どちらが{好|す}きですか。 (Natsu to fuyu to, dochira ga suki desu ka.)",
              "{夏|なつ}と{冬|ふゆ}はだれが{好|す}きですか。 (Natsu to fuyu wa dare ga suki desu ka.)"
            ],
            "correct": 2,
            "why": "どちらも = trả lời cho câu hỏi chọn 1 trong 2."
          },
          {
            "q": "B：クラスでワンさんがいちばん{忙|いそが}しいです。　〔Kurasu de Wan san ga ichiban isogashii desu.〕　Câu hỏi A hỏi phải là gì?",
            "options": [
              "クラスでどこがいちばん{忙|いそが}しいですか。 (Kurasu de doko ga ichiban isogashii desu ka.)",
              "クラスでワンさんとだれが{忙|いそが}しいですか。 (Kurasu de Wan san to dare ga isogashii desu ka.)",
              "クラスのワンさんは{忙|いそが}しいですか。 (Kurasu no Wan san wa isogashii desu ka.)",
              "クラスでだれがいちばん{忙|いそが}しいですか。 (Kurasu de dare ga ichiban isogashii desu ka.)"
            ],
            "correct": 3,
            "why": "Trả lời bằng tên người → hỏi **だれ**."
          },
          {
            "q": "B：ハノイがいちばん{寒|さむ}いです。　〔Hanoi ga ichiban samui desu.〕　Câu hỏi A hỏi phải là gì?",
            "options": [
              "ベトナムでだれが{寒|さむ}いですか。 (Betonamu de dare ga samui desu ka.)",
              "ベトナムでどこがいちばん{寒|さむ}いですか。 (Betonamu de doko ga ichiban samui desu ka.)",
              "ベトナムでいつがいちばん{寒|さむ}いですか。 (Betonamu de itsu ga ichiban samui desu ka.)",
              "ハノイとホーチミンとどちらが{暑|あつ}いですか。 (Hanoi to hoochimin to dochira ga atsui desu ka.)"
            ],
            "correct": 1,
            "why": "Trả lời bằng địa danh → hỏi どこ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-dong-nghia",
        "title": "Chọn câu có NGHĨA GIỐNG (6 câu)",
        "items": [
          {
            "q": "Câu nào có NGHĨA GIỐNG: {電車|でんしゃ}はバスより{早|はや}いです。　〔Densha wa basu yori hayai desu.〕",
            "options": [
              "{電車|でんしゃ}よりバスのほうが{早|はや}いです。 (Densha yori basu no hou ga hayai desu.)",
              "バスより{電車|でんしゃ}のほうが{早|はや}いです。 (Basu yori densha no hou ga hayai desu.)",
              "バスは{電車|でんしゃ}より{早|はや}いです。 (Basu wa densha yori hayai desu.)",
              "{電車|でんしゃ}とバスはどちらも{安|やす}いです。 (Densha to basu wa dochira mo yasui desu.)"
            ],
            "correct": 1,
            "why": "Hai câu cùng nói tàu nhanh hơn xe buýt."
          },
          {
            "q": "Câu nào có NGHĨA GIỐNG: ハノイはホーチミンより{寒|さむ}いです。　〔Hanoi wa hoochimin yori samui desu.〕",
            "options": [
              "ホーチミンのほうが{寒|さむ}いです。 (Hoochimin no hou ga samui desu.)",
              "ホーチミンはハノイより{暑|あつ}いです。 (Hoochimin wa hanoi yori atsui desu.)",
              "ハノイはホーチミンより{暑|あつ}いです。 (Hanoi wa hoochimin yori atsui desu.)",
              "ホーチミンはハノイより{寒|さむ}いです。 (Hoochimin wa hanoi yori samui desu.)"
            ],
            "correct": 1,
            "why": "Hà Nội lạnh hơn ⇔ TP.HCM nóng hơn."
          },
          {
            "q": "Câu nào có NGHĨA GIỐNG: {東京|とうきょう}のほうが{京都|きょうと}より{大|おお}きいです。　〔Toukyou no hou ga kyouto yori ookii desu.〕",
            "options": [
              "{京都|きょうと}は{東京|とうきょう}より{大|おお}きいです。 (Kyouto wa toukyou yori ookii desu.)",
              "{京都|きょうと}は{東京|とうきょう}より{小|ちい}さいです。 (Kyouto wa toukyou yori chiisai desu.)",
              "{東京|とうきょう}と{京都|きょうと}はどちらも{大|おお}きいです。 (Toukyou to kyouto wa dochira mo ookii desu.)",
              "{東京|とうきょう}は{京都|きょうと}より{小|ちい}さいです。 (Toukyou wa kyouto yori chiisai desu.)"
            ],
            "correct": 1,
            "why": "Tokyo to hơn Kyoto ⇔ Kyoto nhỏ hơn Tokyo."
          },
          {
            "q": "Câu nào có NGHĨA GIỐNG: ラーメンは{焼|や}き{肉|にく}より{安|やす}いです。　〔Raamen wa yakiniku yori yasui desu.〕",
            "options": [
              "{焼|や}き{肉|にく}はラーメンより{高|たか}いです。 (Yakiniku wa raamen yori takai desu.)",
              "{焼|や}き{肉|にく}はラーメンより{安|やす}いです。 (Yakiniku wa raamen yori yasui desu.)",
              "{焼|や}き{肉|にく}とラーメンはどちらも{安|やす}いです。 (Yakiniku to raamen wa dochira mo yasui desu.)",
              "ラーメンは{焼|や}き{肉|にく}より{高|たか}いです。 (Raamen wa yakiniku yori takai desu.)"
            ],
            "correct": 0,
            "why": "Ramen rẻ hơn thịt nướng ⇔ thịt nướng đắt hơn ramen."
          },
          {
            "q": "Câu nào có NGHĨA GIỐNG: {冬|ふゆ}より{夏|なつ}のほうが{好|す}きです。　〔Fuyu yori natsu no hou ga suki desu.〕",
            "options": [
              "{夏|なつ}と{冬|ふゆ}はどちらも{好|す}きじゃありません。 (Natsu to fuyu wa dochira mo sukija arimasen.)",
              "{夏|なつ}がいちばんきらいです。 (Natsu ga ichiban kirai desu.)",
              "{夏|なつ}が{冬|ふゆ}より{好|す}きです。 (Natsu ga fuyu yori suki desu.)",
              "{冬|ふゆ}が{夏|なつ}より{好|す}きです。 (Fuyu ga natsu yori suki desu.)"
            ],
            "correct": 2,
            "why": "Thích mùa hè hơn mùa đông."
          },
          {
            "q": "Câu nào có NGHĨA GIỐNG: このへやはあのへやよりずっと{大|おお}きいです。　〔Kono heya wa ano heya yori zutto ookii desu.〕",
            "options": [
              "このへやはあのへやよりちょっと{大|おお}きいです。 (Kono heya wa ano heya yori chotto ookii desu.)",
              "このへやとあのへやはどちらも{大|おお}きいです。 (Kono heya to ano heya wa dochira mo ookii desu.)",
              "あのへやはこのへやよりずっと{小|ちい}さいです。 (Ano heya wa kono heya yori zutto chiisai desu.)",
              "あのへやはこのへやよりずっと{大|おお}きいです。 (Ano heya wa kono heya yori zutto ookii desu.)"
            ],
            "correct": 2,
            "why": "Phòng này to hơn nhiều ⇔ phòng kia nhỏ hơn nhiều."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-sai",
        "title": "Tìm câu SAI (6 câu)",
        "items": [
          {
            "q": "(so sánh)　Câu nào SAI?",
            "options": [
              "{電車|でんしゃ}のほうがバスより{早|はや}いです。 (Densha no hou ga basu yori hayai desu.)",
              "{電車|でんしゃ}はバスより{早|はや}いです。 (Densha wa basu yori hayai desu.)",
              "バスより{電車|でんしゃ}のほうが{早|はや}いです。 (Basu yori densha no hou ga hayai desu.)",
              "{電車|でんしゃ}はバスのより{早|はや}いです。 (Densha wa basu no yori hayai desu.)"
            ],
            "correct": 3,
            "why": "より đi thẳng sau danh từ: **バス より**, không thêm の (×バスの より)."
          },
          {
            "q": "(どちら)　Câu nào SAI?",
            "options": [
              "{季節|きせつ}でいつがいちばん{好|す}きですか。 (Kisetsu de itsu ga ichiban suki desu ka.)",
              "{春|はる}と{夏|なつ}と{秋|あき}と、どちらが{好|す}きですか。 (Haru to natsu to aki to, dochira ga suki desu ka.)",
              "{春|はる}と{夏|なつ}と、どちらが{好|す}きですか。 (Haru to natsu to, dochira ga suki desu ka.)",
              "{夏|なつ}と{冬|ふゆ}と、どちらも{好|す}きです。 (Natsu to fuyu to, dochira mo suki desu.)"
            ],
            "correct": 1,
            "why": "どちら chỉ dùng khi so sánh **2** thứ; có 3 mùa trở lên dùng いつが いちばん."
          },
          {
            "q": "(いちばん)　Câu nào SAI?",
            "options": [
              "{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。 (Tabemono de nani ga ichiban suki desu ka.)",
              "クラスでだれがいちばん{忙|いそが}しいですか。 (Kurasu de dare ga ichiban isogashii desu ka.)",
              "バスと{電車|でんしゃ}で、どちらがいちばん{早|はや}いですか。 (Basu to densha de, dochira ga ichiban hayai desu ka.)",
              "{乗|の}り{物|もの}で{何|なに}がいちばん{早|はや}いですか。 (Norimono de nani ga ichiban hayai desu ka.)"
            ],
            "correct": 2,
            "why": "Không trộn どちら (2 thứ) với いちばん (nhất trong nhiều)."
          },
          {
            "q": "(の ほうが)　Câu nào SAI?",
            "options": [
              "{京都|きょうと}より{東京|とうきょう}のほうが{大|おお}きいです。 (Kyouto yori toukyou no hou ga ookii desu.)",
              "{京都|きょうと}より{東京|とうきょう}ほうが{大|おお}きいです。 (Kyouto yori toukyou hou ga ookii desu.)",
              "{東京|とうきょう}のほうが{京都|きょうと}より{大|おお}きいです。 (Toukyou no hou ga kyouto yori ookii desu.)",
              "{東京|とうきょう}は{京都|きょうと}より{大|おお}きいです。 (Toukyou wa kyouto yori ookii desu.)"
            ],
            "correct": 1,
            "why": "Thiếu **の**: phải là N **の** ほうが (東京の ほうが)."
          },
          {
            "q": "(ずっと)　Câu nào SAI?",
            "options": [
              "このかばんはあのかばんよりちょっと{高|たか}いです。 (Kono kaban wa ano kaban yori chotto takai desu.)",
              "このかばんはあのかばんよりとても{高|たか}いです。 (Kono kaban wa ano kaban yori totemo takai desu.)",
              "このかばんはあのかばんよりすこし{高|たか}いです。 (Kono kaban wa ano kaban yori sukoshi takai desu.)",
              "このかばんはあのかばんよりずっと{高|たか}いです。 (Kono kaban wa ano kaban yori zutto takai desu.)"
            ],
            "correct": 1,
            "why": "Giáo trình dạy dùng ずっと / ちょっと / すこし sau より; **とても** không đi với より."
          },
          {
            "q": "(trợ từ)　Câu nào SAI?",
            "options": [
              "{季節|きせつ}で{冬|ふゆ}がいちばん{好|す}きです。 (Kisetsu de fuyu ga ichiban suki desu.)",
              "スポーツでサッカーがいちばん{好|す}きです。 (Supootsu de sakkaa ga ichiban suki desu.)",
              "スポーツにサッカーがいちばん{好|す}きです。 (Supootsu ni sakkaa ga ichiban suki desu.)",
              "{食|た}べ{物|もの}でラーメンがいちばん{好|す}きです。 (Tabemono de raamen ga ichiban suki desu.)"
            ],
            "correct": 2,
            "why": "Phạm vi so sánh dùng **で**, không dùng に."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-np2-go",
        "title": "Gõ câu so sánh theo gợi ý (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 53–56",
        "items": [
          {
            "q": "Hà Nội lạnh hơn TP.HCM.",
            "answers": [
              "ハノイはホーチミンより寒いです。",
              "ハノイはホーチミンよりさむいです。"
            ],
            "hint": "ハノイ · ホーチミン · 寒い · より"
          },
          {
            "q": "Tàu điện nhanh hơn xe buýt.",
            "answers": [
              "電車はバスより早いです。",
              "電車はバスよりはやいです。",
              "でんしゃはバスより早いです。",
              "でんしゃはバスよりはやいです。",
              "バスより電車のほうが早いです。",
              "バスより電車のほうがはやいです。",
              "バスよりでんしゃのほうが早いです。",
              "バスよりでんしゃのほうがはやいです。"
            ],
            "hint": "電車 · バス · 早い"
          },
          {
            "q": "Trong các món ăn, tôi thích ramen nhất.",
            "answers": [
              "食べ物でラーメンがいちばん好きです。",
              "食べ物でラーメンがいちばんすきです。",
              "食べものでラーメンがいちばん好きです。",
              "食べものでラーメンがいちばんすきです。",
              "たべ物でラーメンがいちばん好きです。",
              "たべ物でラーメンがいちばんすきです。",
              "たべものでラーメンがいちばん好きです。",
              "たべものでラーメンがいちばんすきです。"
            ],
            "hint": "N で N が いちばん A です"
          },
          {
            "q": "Trong lớp, ai bận nhất?",
            "answers": [
              "クラスでだれがいちばん忙しいですか。",
              "クラスでだれがいちばんいそがしいですか。"
            ],
            "hint": "だれ · いちばん"
          },
          {
            "q": "Cà phê và trà, bạn thích cái nào hơn?",
            "answers": [
              "コーヒーとおちゃと、どちらが好きですか。",
              "コーヒーとおちゃと、どちらがすきですか。",
              "コーヒーとおちゃとどちらが好きですか。",
              "コーヒーとおちゃとどちらがすきですか。"
            ],
            "hint": "N1 と N2 と どちらが"
          },
          {
            "q": "Tôi thích trà hơn.",
            "answers": [
              "おちゃのほうが好きです。",
              "おちゃのほうがすきです。"
            ],
            "hint": "N の ほうが"
          },
          {
            "q": "Cả hai tôi đều thích.",
            "answers": [
              "どちらも好きです。",
              "どちらもすきです。"
            ],
            "hint": "どちらも"
          },
          {
            "q": "Nhà ga gần hơn rạp chiếu phim một chút.",
            "answers": [
              "駅は映画館よりちょっと近いです。",
              "駅は映画館よりちょっとちかいです。",
              "駅はえいがかんよりちょっと近いです。",
              "駅はえいがかんよりちょっとちかいです。",
              "えきは映画館よりちょっと近いです。",
              "えきは映画館よりちょっとちかいです。",
              "えきはえいがかんよりちょっと近いです。",
              "えきはえいがかんよりちょっとちかいです。",
              "駅は映画館よりすこし近いです。",
              "駅は映画館よりすこしちかいです。",
              "駅はえいがかんよりすこし近いです。",
              "駅はえいがかんよりすこしちかいです。",
              "えきは映画館よりすこし近いです。",
              "えきは映画館よりすこしちかいです。",
              "えきはえいがかんよりすこし近いです。",
              "えきはえいがかんよりすこしちかいです。"
            ],
            "hint": "より ちょっと"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-np2-ghep",
        "title": "Ghép câu so sánh (8 câu)",
        "items": [
          {
            "vi": "Mùa hè nóng hơn mùa đông.",
            "chips": [
              "{夏|なつ}は",
              "{暑|あつ}いです",
              "いちばん",
              "{冬|ふゆ}より"
            ],
            "answer": [
              "{夏|なつ}は",
              "{冬|ふゆ}より",
              "{暑|あつ}いです"
            ],
            "ro": "Natsu wa fuyu yori atsui desu."
          },
          {
            "vi": "Tàu điện nhanh hơn.",
            "chips": [
              "より",
              "{電車|でんしゃ}の",
              "{早|はや}いです",
              "ほうが"
            ],
            "answer": [
              "{電車|でんしゃ}の",
              "ほうが",
              "{早|はや}いです"
            ],
            "ro": "Densha no hou ga hayai desu."
          },
          {
            "vi": "Bạn thích ramen hay thịt nướng hơn?",
            "chips": [
              "{焼|や}き{肉|にく}と",
              "どちらが",
              "{好|す}きですか",
              "いちばん",
              "ラーメンと"
            ],
            "answer": [
              "ラーメンと",
              "{焼|や}き{肉|にく}と",
              "どちらが",
              "{好|す}きですか"
            ],
            "ro": "Raamen to yakiniku to dochira ga suki desu ka?"
          },
          {
            "vi": "Trong lớp, ai bận nhất?",
            "chips": [
              "{忙|いそが}しいですか",
              "クラスで",
              "いちばん",
              "だれが",
              "より"
            ],
            "answer": [
              "クラスで",
              "だれが",
              "いちばん",
              "{忙|いそが}しいですか"
            ],
            "ro": "Kurasu de dare ga ichiban isogashii desu ka?"
          },
          {
            "vi": "Phòng này rộng hơn nhiều.",
            "chips": [
              "このへやは",
              "{広|ひろ}いです",
              "あのへやより",
              "ずっと",
              "とても"
            ],
            "answer": [
              "このへやは",
              "あのへやより",
              "ずっと",
              "{広|ひろ}いです"
            ],
            "ro": "Kono heya wa ano heya yori zutto hiroi desu."
          },
          {
            "vi": "Trong các mùa, tôi thích mùa đông nhất.",
            "chips": [
              "いちばん",
              "より",
              "{好|す}きです",
              "{冬|ふゆ}が",
              "{季節|きせつ}で"
            ],
            "answer": [
              "{季節|きせつ}で",
              "{冬|ふゆ}が",
              "いちばん",
              "{好|す}きです"
            ],
            "ro": "Kisetsu de fuyu ga ichiban suki desu."
          },
          {
            "vi": "Núi hay biển, bạn thích cái nào hơn?",
            "chips": [
              "{山|やま}と",
              "どちらが",
              "{好|す}きですか",
              "{海|うみ}と",
              "だれ"
            ],
            "answer": [
              "{山|やま}と",
              "{海|うみ}と",
              "どちらが",
              "{好|す}きですか"
            ],
            "ro": "Yama to umi to dochira ga suki desu ka?"
          },
          {
            "vi": "Cái này rẻ hơn cái kia một chút.",
            "chips": [
              "ちょっと",
              "{安|やす}いです",
              "これは",
              "いちばん",
              "あれより"
            ],
            "answer": [
              "これは",
              "あれより",
              "ちょっと",
              "{安|やす}いです"
            ],
            "ro": "Kore wa are yori chotto yasui desu."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đọc bảng giá · dịch Việt → Nhật · nhiều ô trống như đề thi"
      },
      {
        "t": "table",
        "head": [
          "Món",
          "Giá",
          "Cách đọc"
        ],
        "rows": [
          [
            "ラーメン",
            "五百円",
            "ごひゃくえん (500 yên)"
          ],
          [
            "すき焼き",
            "二千五百円",
            "にせんごひゃくえん (2.500 yên)"
          ],
          [
            "焼き肉",
            "三千円",
            "さんぜんえん (3.000 yên)"
          ],
          [
            "お好み焼き",
            "八百円",
            "はっぴゃくえん (800 yên)"
          ]
        ],
        "caption": "Bảng giá một quán nhậu (dùng cho 6 câu dưới đây)"
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-bang-gia",
        "title": "Đọc bảng giá rồi trả lời (6 câu)",
        "items": [
          {
            "q": "Ramen và thịt nướng, món nào đắt hơn? (Xem bảng giá)",
            "options": [
              "ラーメンは{焼|や}き{肉|にく}より{高|たか}いです。 (Raamen wa yakiniku yori takai desu.)",
              "ラーメンのほうが{高|たか}いです。 (Raamen no hou ga takai desu.)",
              "どちらも{高|たか}いです。 (Dochira mo takai desu.)",
              "{焼|や}き{肉|にく}のほうが{高|たか}いです。 (Yakiniku no hou ga takai desu.)"
            ],
            "correct": 3,
            "why": "Thịt nướng 3.000 > ramen 500 → 焼き肉の ほうが 高いです."
          },
          {
            "q": "Món nào rẻ nhất?",
            "options": [
              "{食|た}べ{物|もの}でお{好|この}み{焼|や}きがいちばん{安|やす}いです。 (Tabemono de okonomiyaki ga ichiban yasui desu.)",
              "{食|た}べ{物|もの}で{焼|や}き{肉|にく}がいちばん{安|やす}いです。 (Tabemono de yakiniku ga ichiban yasui desu.)",
              "{食|た}べ{物|もの}でラーメンがいちばん{安|やす}いです。 (Tabemono de raamen ga ichiban yasui desu.)",
              "{食|た}べ{物|もの}ですき{焼|や}きがいちばん{安|やす}いです。 (Tabemono de sukiyaki ga ichiban yasui desu.)"
            ],
            "correct": 2,
            "why": "Ramen 500 yên rẻ nhất."
          },
          {
            "q": "Món nào đắt nhất?",
            "options": [
              "ラーメンがいちばん{高|たか}いです。 (Raamen ga ichiban takai desu.)",
              "すき{焼|や}きがいちばん{高|たか}いです。 (Sukiyaki ga ichiban takai desu.)",
              "{焼|や}き{肉|にく}がいちばん{高|たか}いです。 (Yakiniku ga ichiban takai desu.)",
              "お{好|この}み{焼|や}きがいちばん{高|たか}いです。 (Okonomiyaki ga ichiban takai desu.)"
            ],
            "correct": 2,
            "why": "Thịt nướng 3.000 yên đắt nhất."
          },
          {
            "q": "Sukiyaki và okonomiyaki, món nào rẻ hơn?",
            "options": [
              "お{好|この}み{焼|や}きはすき{焼|や}きより{高|たか}いです。 (Okonomiyaki wa sukiyaki yori takai desu.)",
              "どちらも{高|たか}いです。 (Dochira mo takai desu.)",
              "お{好|この}み{焼|や}きのほうが{安|やす}いです。 (Okonomiyaki no hou ga yasui desu.)",
              "すき{焼|や}きのほうが{安|やす}いです。 (Sukiyaki no hou ga yasui desu.)"
            ],
            "correct": 2,
            "why": "Okonomiyaki 800 < sukiyaki 2.500."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "すき{焼|や}きはお{好|この}み{焼|や}きよりずっと{高|たか}いです。 (Sukiyaki wa okonomiyaki yori zutto takai desu.)",
              "お{好|この}み{焼|や}きはすき{焼|や}きより{高|たか}いです。 (Okonomiyaki wa sukiyaki yori takai desu.)",
              "すき{焼|や}きはお{好|この}み{焼|や}きよりちょっと{安|やす}いです。 (Sukiyaki wa okonomiyaki yori chotto yasui desu.)",
              "ラーメンはお{好|この}み{焼|や}きより{高|たか}いです。 (Raamen wa okonomiyaki yori takai desu.)"
            ],
            "correct": 0,
            "why": "2.500 vs 800: chênh nhiều → ずっと 高いです."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "お{好|この}み{焼|や}きはラーメンより{高|たか}いです。 (Okonomiyaki wa raamen yori takai desu.)",
              "{焼|や}き{肉|にく}はすき{焼|や}きより{高|たか}いです。 (Yakiniku wa sukiyaki yori takai desu.)",
              "ラーメンのほうがお{好|この}み{焼|や}きより{安|やす}いです。 (Raamen no hou ga okonomiyaki yori yasui desu.)",
              "ラーメンはお{好|この}み{焼|や}きより{高|たか}いです。 (Raamen wa okonomiyaki yori takai desu.)"
            ],
            "correct": 3,
            "why": "Ramen 500 < okonomiyaki 800 nên câu này SAI."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-np2-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 53–56",
        "items": [
          {
            "q": "Trong các môn thể thao, bạn thích môn nào nhất?",
            "answers": [
              "スポーツで何がいちばん好きですか。",
              "スポーツで何がいちばんすきですか。",
              "スポーツでなにがいちばん好きですか。",
              "スポーツでなにがいちばんすきですか。"
            ],
            "hint": "N で 何が いちばん"
          },
          {
            "q": "Tôi thích bóng đá hơn bóng chày.",
            "answers": [
              "野球よりサッカーのほうが好きです。",
              "野球よりサッカーのほうがすきです。",
              "やきゅうよりサッカーのほうが好きです。",
              "やきゅうよりサッカーのほうがすきです。",
              "サッカーのほうが野球より好きです。",
              "サッカーのほうが野球よりすきです。",
              "サッカーのほうがやきゅうより好きです。",
              "サッカーのほうがやきゅうよりすきです。",
              "私は野球よりサッカーのほうが好きです。",
              "私は野球よりサッカーのほうがすきです。",
              "私はやきゅうよりサッカーのほうが好きです。",
              "私はやきゅうよりサッカーのほうがすきです。",
              "わたしは野球よりサッカーのほうが好きです。",
              "わたしは野球よりサッカーのほうがすきです。",
              "わたしはやきゅうよりサッカーのほうが好きです。",
              "わたしはやきゅうよりサッカーのほうがすきです。"
            ],
            "hint": "N1 より N2 の ほうが"
          },
          {
            "q": "Mùa hè ở Nhật nóng hơn ở Hà Nội không?",
            "answers": [
              "日本の夏はハノイより暑いですか。",
              "日本の夏はハノイよりあついですか。",
              "日本のなつはハノイより暑いですか。",
              "日本のなつはハノイよりあついですか。",
              "にほんの夏はハノイより暑いですか。",
              "にほんの夏はハノイよりあついですか。",
              "にほんのなつはハノイより暑いですか。",
              "にほんのなつはハノイよりあついですか。"
            ],
            "hint": "より · ですか"
          },
          {
            "q": "Tàu điện ngầm và xe buýt, cái nào nhanh hơn? — Tàu điện ngầm nhanh hơn.",
            "answers": [
              "地下鉄とバスと、どちらが早いですか。地下鉄のほうが早いです。",
              "地下鉄とバスと、どちらが早いですか。地下鉄のほうがはやいです。",
              "地下鉄とバスと、どちらが早いですか。ちかてつのほうが早いです。",
              "地下鉄とバスと、どちらが早いですか。ちかてつのほうがはやいです。",
              "地下鉄とバスと、どちらがはやいですか。地下鉄のほうが早いです。",
              "地下鉄とバスと、どちらがはやいですか。地下鉄のほうがはやいです。",
              "地下鉄とバスと、どちらがはやいですか。ちかてつのほうが早いです。",
              "地下鉄とバスと、どちらがはやいですか。ちかてつのほうがはやいです。",
              "ちかてつとバスと、どちらが早いですか。地下鉄のほうが早いです。",
              "ちかてつとバスと、どちらが早いですか。地下鉄のほうがはやいです。",
              "ちかてつとバスと、どちらが早いですか。ちかてつのほうが早いです。",
              "ちかてつとバスと、どちらが早いですか。ちかてつのほうがはやいです。",
              "ちかてつとバスと、どちらがはやいですか。地下鉄のほうが早いです。",
              "ちかてつとバスと、どちらがはやいですか。地下鉄のほうがはやいです。",
              "ちかてつとバスと、どちらがはやいですか。ちかてつのほうが早いです。",
              "ちかてつとバスと、どちらがはやいですか。ちかてつのほうがはやいです。"
            ],
            "hint": "どちら · の ほうが"
          },
          {
            "q": "Ở Việt Nam, nơi nào đông người nhất?",
            "answers": [
              "ベトナムでどこがいちばん人が多いですか。",
              "ベトナムでどこがいちばん人がおおいですか。",
              "ベトナムでどこがいちばんひとが多いですか。",
              "ベトナムでどこがいちばんひとがおおいですか。",
              "ベトナムでどこがいちばん多いですか。",
              "ベトナムでどこがいちばんおおいですか。"
            ],
            "hint": "どこ · いちばん"
          },
          {
            "q": "Cái này đắt hơn cái kia nhiều.",
            "answers": [
              "これはあれよりずっと高いです。",
              "これはあれよりずっとたかいです。"
            ],
            "hint": "ずっと"
          },
          {
            "q": "Trong lớp tôi, Wang bận nhất.",
            "answers": [
              "クラスでワンさんがいちばん忙しいです。",
              "クラスでワンさんがいちばんいそがしいです。"
            ],
            "hint": "N で N が いちばん"
          },
          {
            "q": "Ramen và okonomiyaki tôi đều thích.",
            "answers": [
              "ラーメンもお好み焼きもどちらも好きです。",
              "ラーメンもお好み焼きもどちらもすきです。",
              "ラーメンもお好みやきもどちらも好きです。",
              "ラーメンもお好みやきもどちらもすきです。",
              "ラーメンもおこのみ焼きもどちらも好きです。",
              "ラーメンもおこのみ焼きもどちらもすきです。",
              "ラーメンもおこのみやきもどちらも好きです。",
              "ラーメンもおこのみやきもどちらもすきです。",
              "ラーメンとお好み焼きはどちらも好きです。",
              "ラーメンとお好み焼きはどちらもすきです。",
              "ラーメンとお好みやきはどちらも好きです。",
              "ラーメンとお好みやきはどちらもすきです。",
              "ラーメンとおこのみ焼きはどちらも好きです。",
              "ラーメンとおこのみ焼きはどちらもすきです。",
              "ラーメンとおこのみやきはどちらも好きです。",
              "ラーメンとおこのみやきはどちらもすきです。"
            ],
            "hint": "どちらも"
          },
          {
            "q": "Cả hai món đều ngon.",
            "answers": [
              "どちらもおいしいです。"
            ],
            "hint": "どちらも"
          },
          {
            "q": "Trong các mùa, tôi thích mùa xuân nhất.",
            "answers": [
              "季節で春がいちばん好きです。",
              "季節で春がいちばんすきです。",
              "季節ではるがいちばん好きです。",
              "季節ではるがいちばんすきです。",
              "きせつで春がいちばん好きです。",
              "きせつで春がいちばんすきです。",
              "きせつではるがいちばん好きです。",
              "きせつではるがいちばんすきです。"
            ],
            "hint": "N で N が いちばん"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np2-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (5 câu)",
        "items": [
          {
            "q": "{食|た}べ{物|もの}（①）ラーメン（②）いちばん{好|す}きです。{焼|や}き{肉|にく}（③）ラーメンのほうが{好|す}きです。　〔Tabemono((1)) raamen((2)) ichiban suki desu. Yakiniku((3)) raamen no hou ga suki desu.〕　— Trong các món ăn, tôi thích ramen nhất. Tôi thích ramen hơn thịt nướng.",
            "options": [
              "① で　② を　③ は",
              "① で　② が　③ より",
              "① に　② が　③ と",
              "① が　② を　③ と"
            ],
            "correct": 1,
            "why": "→ **{食|た}べ{物|もの}でラーメンがいちばん{好|す}きです。{焼|や}き{肉|にく}よりラーメンのほうが{好|す}きです。** 〔Tabemono de raamen ga ichiban suki desu. Yakiniku yori raamen no hou ga suki desu.〕 — Trong các món ăn, tôi thích ramen nhất. Tôi thích ramen hơn thịt nướng."
          },
          {
            "q": "A：{夏|なつ}（①）{冬|ふゆ}（②）、どちら（③）{好|す}きですか。B：{夏|なつ}（④）ほうが{好|す}きです。　〔A:natsu((1)) fuyu((2)), dochira((3)) suki desu ka. B:natsu((4)) hou ga suki desu.〕　— A: Mùa hè và mùa đông, bạn thích mùa nào hơn? B: Tôi thích mùa hè hơn.",
            "options": [
              "① と　② と　③ が　④ を",
              "① と　② と　③ を　④ の",
              "① と　② と　③ が　④ の",
              "① が　② と　③ が　④ の"
            ],
            "correct": 2,
            "why": "N1 と N2 と どちらが + N の ほうが. → **A：{夏|なつ}と{冬|ふゆ}と、どちらが{好|す}きですか。B：{夏|なつ}のほうが{好|す}きです。** 〔A:natsu to fuyu to, dochira ga suki desu ka. B:natsu no hou ga suki desu.〕 — A: Mùa hè và mùa đông, bạn thích mùa nào hơn? B: Tôi thích mùa hè hơn."
          },
          {
            "q": "{季節|きせつ}（①）、いつ（②）いちばん{好|す}きですか。　〔Kisetsu((1)), itsu((2)) ichiban suki desu ka.〕　— Trong các mùa, bạn thích mùa nào nhất?",
            "options": [
              "① で　② を",
              "① に　② が",
              "① を　② が",
              "① で　② が"
            ],
            "correct": 3,
            "why": "N で いつが いちばん. → **{季節|きせつ}で、いつがいちばん{好|す}きですか。** 〔Kisetsu de, itsu ga ichiban suki desu ka.〕 — Trong các mùa, bạn thích mùa nào nhất?"
          },
          {
            "q": "ハノイはホーチミン（①）ずっと{寒|さむ}い（②）。でも、{日本|にほん}の{冬|ふゆ}はハノイ（③）{寒|さむ}いです。　〔Hanoi wa hoochimin((1)) zutto samui((2)). Demo, nihon no fuyu wa hanoi((3)) samui desu.〕　— Hà Nội lạnh hơn TP.HCM nhiều. Nhưng mùa đông Nhật lạnh hơn Hà Nội.",
            "options": [
              "① の　② です　③ より",
              "① より　② ました　③ の",
              "① より　② です　③ より",
              "① から　② です　③ より"
            ],
            "correct": 2,
            "why": "N1 は N2 より A です. → **ハノイはホーチミンよりずっと{寒|さむ}いです。でも、{日本|にほん}の{冬|ふゆ}はハノイより{寒|さむ}いです。** 〔Hanoi wa hoochimin yori zutto samui desu. Demo, nihon no fuyu wa hanoi yori samui desu.〕 — Hà Nội lạnh hơn TP.HCM nhiều. Nhưng mùa đông Nhật lạnh hơn Hà Nội."
          },
          {
            "q": "A：{地下鉄|ちかてつ}（①）バス（②）、どちら（③）{安|やす}いですか。B：バス（④）ほうが{安|やす}いです。　〔A:chikatetsu((1)) basu((2)), dochira((3)) yasui desu ka. B:basu((4)) hou ga yasui desu.〕　— A: Tàu điện ngầm và xe buýt, cái nào rẻ hơn? B: Xe buýt rẻ hơn.",
            "options": [
              "① と　② が　③ が　④ の",
              "① と　② と　③ が　④ は",
              "① の　② と　③ が　④ の",
              "① と　② と　③ が　④ の"
            ],
            "correct": 3,
            "why": "N1 と N2 と どちらが. → **A：{地下鉄|ちかてつ}とバスと、どちらが{安|やす}いですか。B：バスのほうが{安|やす}いです。** 〔A:chikatetsu to basu to, dochira ga yasui desu ka. B:basu no hou ga yasui desu.〕 — A: Tàu điện ngầm và xe buýt, cái nào rẻ hơn? B: Xe buýt rẻ hơn."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b6-np-3",
    "kind": "homework",
    "title": "Luyện thêm Bài 6 · Ngữ pháp 3 (ポイント 57–60) — もう/まだ · どうですか · ね · よ + TRỘN cả 13 điểm (~64 câu)",
    "goal": "Hỏi–đáp \"đã … chưa\" (もう～ましたか／まだです), đề xuất bằng N は どうですか, dùng ね (xin đồng cảm/xác nhận) và よ (báo cho biết) đúng chỗ, rồi trộn cả 13 ポイント như đề kiểm tra.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**もう Vましたか** hỏi \"đã … chưa\"; **はい、もう Vました** = rồi; **いいえ、まだです** = chưa. Đừng nói いいえ、もうです.",
          "**ね** = \"nhỉ/nhé\" (mình muốn người kia đồng ý) — **よ** = \"đấy\" (mình báo điều người kia chưa biết). Hỏi bản thân: *người nghe đã biết chưa?* Biết rồi → ね; chưa biết → よ.",
          "Mức Khó trộn nhiều ポイント: đọc kỹ từng ô trống, tìm trợ từ trước (が・で・を・に・の) rồi mới nhìn cuối câu (ね/よ/か)."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**もう Vましたか** → **はい、もう Vました** / **いいえ、まだです**.",
          "**N は どうですか** → đề xuất (\"7 giờ thì sao?\") hoặc hỏi cảm tưởng (\"Nhật Bản thế nào?\"). Trả lời: いいですね／ちょっと……／そうですねえ。",
          "**ね** = nhỉ (đồng cảm, xác nhận) · **よ** = đấy (báo tin)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · điền một chỗ trống · có nghĩa Việt kèm"
      },
      {
        "t": "mcq",
        "id": "lt-b6-np3-57",
        "title": "ポイント 57: もう / まだ (5 câu)",
        "items": [
          {
            "q": "＿＿ご{飯|はん}を{食|た}べましたか。　〔__ gohan o tabemashita ka.〕　— Bạn ăn cơm chưa (đã ăn chưa)?",
            "options": [
              "いちばん",
              "まだ",
              "もう",
              "ずっと"
            ],
            "correct": 2,
            "why": "**もう Vましたか** = đã … chưa? (ポイント 57). → **もうご{飯|はん}を{食|た}べましたか。** 〔Mou gohan o tabemashita ka.〕 — Bạn ăn cơm chưa (đã ăn chưa)?"
          },
          {
            "q": "A：もう{映画|えいが}を{見|み}ましたか。B：いいえ、＿＿です。　〔A:mou eiga o mimashita ka. B:iie, __ desu.〕　— A: Bạn xem phim chưa? B: Chưa.",
            "options": [
              "もう",
              "ぜひ",
              "もっと",
              "まだ"
            ],
            "correct": 3,
            "why": "Chưa = **いいえ、まだです**. → **A：もう{映画|えいが}を{見|み}ましたか。B：いいえ、まだです。** 〔A:mou eiga o mimashita ka. B:iie, mada desu.〕 — A: Bạn xem phim chưa? B: Chưa."
          },
          {
            "q": "A：もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。B：はい、＿＿{食|た}べました。　〔A:mou hirugohan o tabemashita ka. B:hai, __ tabemashita.〕　— A: Ăn trưa chưa? B: Rồi, tôi ăn rồi.",
            "options": [
              "いちばん",
              "もう",
              "ぜひ",
              "まだ"
            ],
            "correct": 1,
            "why": "Đã = **はい、もう Vました**. → **A：もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。B：はい、もう{食|た}べました。** 〔A:mou hirugohan o tabemashita ka. B:hai, mou tabemashita.〕 — A: Ăn trưa chưa? B: Rồi, tôi ăn rồi."
          },
          {
            "q": "A：もうコンサートのチケットを{買|か}いましたか。B：いいえ、＿＿です。　〔A:mou konsaato no chiketto o kaimashita ka. B:iie, __ desu.〕　— A: Bạn mua vé hoà nhạc chưa? B: Chưa.",
            "options": [
              "ずっと",
              "まだ",
              "ちょっと",
              "もう"
            ],
            "correct": 1,
            "why": "まだです = chưa. → **A：もうコンサートのチケットを{買|か}いましたか。B：いいえ、まだです。** 〔A:mou konsaato no chiketto o kaimashita ka. B:iie, mada desu.〕 — A: Bạn mua vé hoà nhạc chưa? B: Chưa."
          },
          {
            "q": "A：もう{駅|えき}へ{行|い}き＿＿か。B：はい、もう{行|い}きました。　〔A:mou eki e iki__ ka. B:hai, mou ikimashita.〕　— A: Bạn đến ga chưa? B: Rồi.",
            "options": [
              "ましょう",
              "ません",
              "ました",
              "ます"
            ],
            "correct": 2,
            "why": "Hỏi \"đã … chưa\" dùng quá khứ **ました**. → **A：もう{駅|えき}へ{行|い}きましたか。B：はい、もう{行|い}きました。** 〔A:mou eki e ikimashita ka. B:hai, mou ikimashita.〕 — A: Bạn đến ga chưa? B: Rồi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np3-58",
        "title": "ポイント 58: N は どうですか (5 câu)",
        "items": [
          {
            "q": "{明日|あした}の{三時|さんじ}＿＿どうですか。　〔Ashita no sanji__ dou desu ka.〕　— 3 giờ ngày mai thì sao?",
            "options": [
              "に",
              "を",
              "が",
              "は"
            ],
            "correct": 3,
            "why": "**N は どうですか** (ポイント 58): đề xuất / hỏi ý kiến. → **{明日|あした}の{三時|さんじ}はどうですか。** 〔Ashita no sanji wa dou desu ka.〕 — 3 giờ ngày mai thì sao?"
          },
          {
            "q": "{土曜日|どようび}はちょっと……。{日曜日|にちようび}＿＿どうですか。　〔Doyoubi wa chotto.... Nichiyoubi__ dou desu ka.〕　— Thứ Bảy hơi… Chủ nhật thì sao?",
            "options": [
              "を",
              "が",
              "は",
              "で"
            ],
            "correct": 2,
            "why": "N は どうですか. → **{土曜日|どようび}はちょっと……。{日曜日|にちようび}はどうですか。** 〔Doyoubi wa chotto.... Nichiyoubi wa dou desu ka.〕 — Thứ Bảy hơi… Chủ nhật thì sao?"
          },
          {
            "q": "A：{日本|にほん}＿＿どうですか。B：きれいですね。　〔A:nihon__ dou desu ka. B:kirei desu ne.〕　— A: Nhật Bản thế nào? B: Đẹp nhỉ.",
            "options": [
              "を",
              "に",
              "が",
              "は"
            ],
            "correct": 3,
            "why": "Hỏi cảm tưởng: N は どうですか. → **A：{日本|にほん}はどうですか。B：きれいですね。** 〔A:nihon wa dou desu ka. B:kirei desu ne.〕 — A: Nhật Bản thế nào? B: Đẹp nhỉ."
          },
          {
            "q": "{六時|ろくじ}は＿＿ですか。　〔Rokuji wa __ desu ka.〕　— 6 giờ thì sao?",
            "options": [
              "何",
              "だれ",
              "どう",
              "いくら"
            ],
            "correct": 2,
            "why": "N は **どう** ですか (không dùng 何). → **{六時|ろくじ}はどうですか。** 〔Rokuji wa dou desu ka.〕 — 6 giờ thì sao?"
          },
          {
            "q": "A：コーヒーは＿＿ですか。B：ありがとうございます。いただきます。　〔A:koohii wa __ desu ka. B:arigatou gozaimasu. Itadakimasu.〕　— A: Bạn dùng cà phê không (cà phê thì sao)? B: Cảm ơn, tôi xin nhận.",
            "options": [
              "だれ",
              "どこ",
              "どう",
              "何"
            ],
            "correct": 2,
            "why": "Mời/đề nghị nhẹ: N は どうですか. → **A：コーヒーはどうですか。B：ありがとうございます。いただきます。** 〔A:koohii wa dou desu ka. B:arigatou gozaimasu. Itadakimasu.〕 — A: Bạn dùng cà phê không (cà phê thì sao)? B: Cảm ơn, tôi xin nhận."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np3-59",
        "title": "ポイント 59: ね (4 câu)",
        "items": [
          {
            "q": "A：{今日|きょう}は{暑|あつ}いです＿＿。B：ええ、そうですね。　〔A:kyou wa atsuidesu__. B:ee, sou desu ne.〕　— Hôm nay nóng nhỉ. (tìm sự đồng cảm)",
            "options": [
              "ね",
              "が",
              "よ",
              "か"
            ],
            "correct": 0,
            "why": "**～ね** = nhỉ/nhé: xin đồng cảm, xác nhận (ポイント 59). → **A：{今日|きょう}は{暑|あつ}いですね。B：ええ、そうですね。** 〔A:kyou wa atsui desu ne. B:ee, sou desu ne.〕 — Hôm nay nóng nhỉ. (tìm sự đồng cảm)"
          },
          {
            "q": "A：{明日|あした}の{十時|じゅうじ}に{駅|えき}で{会|あ}います。B：{明日|あした}の{十時|じゅうじ}、{駅|えき}＿＿。　〔A:ashita no juuji ni eki de aimasu. B:ashita no juuji, eki__.〕　— Mai 10 giờ ở ga nhỉ. (xác nhận lại)",
            "options": [
              "ですよ",
              "ですね",
              "でした",
              "ですか"
            ],
            "correct": 1,
            "why": "Nhắc lại để xác nhận → **ですね**. → **A：{明日|あした}の{十時|じゅうじ}に{駅|えき}で{会|あ}います。B：{明日|あした}の{十時|じゅうじ}、{駅|えき}ですね。** 〔A:ashita no juuji ni eki de aimasu. B:ashita no juuji, eki desu ne.〕 — Mai 10 giờ ở ga nhỉ. (xác nhận lại)"
          },
          {
            "q": "A：このケーキはおいしいです＿＿。B：ええ、おいしいですね。　〔A:kono keeki wa oishii desu__. B:ee, oishii desu ne.〕　— Bánh này ngon nhỉ. (đồng cảm)",
            "options": [
              "よ",
              "が",
              "ね",
              "か"
            ],
            "correct": 2,
            "why": "ね = nhỉ. → **A：このケーキはおいしいですね。B：ええ、おいしいですね。** 〔A:kono keeki wa oishii desu ne. B:ee, oishii desu ne.〕 — Bánh này ngon nhỉ. (đồng cảm)"
          },
          {
            "q": "A：{一緒|いっしょ}に{行|い}きましょう＿＿。B：ええ、{行|い}きましょう。　〔A:issho ni ikimashou__. B:ee, ikimashou.〕　— Cùng đi nhé.",
            "options": [
              "ね",
              "か",
              "よ",
              "を"
            ],
            "correct": 0,
            "why": "Vましょうね = rủ nhẹ nhàng, xin đồng ý. → **A：{一緒|いっしょ}に{行|い}きましょうね。B：ええ、{行|い}きましょう。** 〔A:issho ni ikimashou ne. B:ee, ikimashou.〕 — Cùng đi nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np3-60",
        "title": "ポイント 60: よ (4 câu)",
        "items": [
          {
            "q": "このラーメンはおいしいです＿＿。{一緒|いっしょ}に{食|た}べましょう。　〔Kono raamen wa oishii desu__. Issho ni tabemashou.〕　— Món ramen này ngon đấy! (báo cho người nghe biết)",
            "options": [
              "が",
              "か",
              "よ",
              "ね"
            ],
            "correct": 2,
            "why": "**～よ** = đấy/nhé: báo điều người nghe chưa biết (ポイント 60). → **このラーメンはおいしいですよ。{一緒|いっしょ}に{食|た}べましょう。** 〔Kono raamen wa oishii desu yo. Issho ni tabemashou.〕 — Món ramen này ngon đấy! (báo cho người nghe biết)"
          },
          {
            "q": "A：{今日|きょう}、{日本語|にほんご}のテストがあります＿＿。B：そうですか。　〔A:kyou, nihongo no tesuto ga arimasu__. B:sou desu ka.〕　— Hôm nay có bài kiểm tra đấy! (báo tin)",
            "options": [
              "か",
              "ね",
              "よ",
              "が"
            ],
            "correct": 2,
            "why": "Báo tin mới → よ. → **A：{今日|きょう}、{日本語|にほんご}のテストがありますよ。B：そうですか。** 〔A:kyou, nihongo no tesuto ga arimasu yo. B:sou desu ka.〕 — Hôm nay có bài kiểm tra đấy! (báo tin)"
          },
          {
            "q": "A：その{店|みせ}は{安|やす}いです＿＿。B：そうですか。{行|い}きましょう。　〔A:sono mise wa yasuidesu__. B:sou desu ka. Ikimashou.〕　— Quán đó rẻ đấy.",
            "options": [
              "よ",
              "ね",
              "が",
              "か"
            ],
            "correct": 0,
            "why": "よ = báo cho biết. → **A：その{店|みせ}は{安|やす}いですよ。B：そうですか。{行|い}きましょう。** 〔A:sono mise wa yasui desu yo. B:sou desu ka. Ikimashou.〕 — Quán đó rẻ đấy."
          },
          {
            "q": "A：{明日|あした}は{休|やす}みです＿＿。B：そうですか。　〔A:ashita wa yasumidesu__. B:sou desu ka.〕　— Ngày mai nghỉ đấy.",
            "options": [
              "ね",
              "が",
              "か",
              "よ"
            ],
            "correct": 3,
            "why": "Thông báo → よ. → **A：{明日|あした}は{休|やす}みですよ。B：そうですか。** 〔A:ashita wa yasumi desu yo. B:sou desu ka.〕 — Ngày mai nghỉ đấy."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · gõ đáp án · hỏi–đáp · tìm câu sai · ghép câu"
      },
      {
        "t": "quiz",
        "id": "lt-b6-np3-go",
        "title": "Trả lời câu hỏi もう～ましたか (8 câu)",
        "kind": "fill",
        "grammar": "はい、もう Vました · いいえ、まだです",
        "items": [
          {
            "q": "A：もう{映画|えいが}を{見|み}ましたか。B：はい、＿＿。　〔A:mou eiga o mimashita ka. B:hai, __.〕",
            "answers": [
              "もう見ました",
              "もうみました",
              "見ました",
              "みました"
            ],
            "hint": "Đã xem rồi: \"はい、もう Vました\""
          },
          {
            "q": "A：もう{映画|えいが}を{見|み}ましたか。B：いいえ、＿＿。　〔A:mou eiga o mimashita ka. B:iie, __.〕",
            "answers": [
              "まだです"
            ],
            "hint": "Chưa xem: \"いいえ、まだです\""
          },
          {
            "q": "A：もうご{飯|はん}を{食|た}べましたか。B：はい、＿＿。　〔A:mou gohan o tabemashita ka. B:hai, __.〕",
            "answers": [
              "もう食べました",
              "もうたべました",
              "食べました",
              "たべました"
            ],
            "hint": "Đã ăn rồi"
          },
          {
            "q": "A：もう{宿題|しゅくだい}をしましたか。B：いいえ、＿＿。　〔A:mou shukudai o shimashita ka. B:iie, __.〕",
            "answers": [
              "まだです"
            ],
            "hint": "Chưa làm"
          },
          {
            "q": "A：もう{銀行|ぎんこう}へ{行|い}きましたか。B：はい、＿＿。　〔A:mou ginkou e ikimashita ka. B:hai, __.〕",
            "answers": [
              "もう行きました",
              "もういきました",
              "行きました",
              "いきました"
            ],
            "hint": "Đã đi rồi"
          },
          {
            "q": "A：もうてがみを{書|か}きましたか。B：いいえ、＿＿。　〔A:mou tegami o kakimashita ka. B:iie, __.〕",
            "answers": [
              "まだです"
            ],
            "hint": "Chưa viết"
          },
          {
            "q": "A：もう{先生|せんせい}に{会|あ}いましたか。B：はい、＿＿。　〔A:mou sensei ni aimashita ka. B:hai, __.〕",
            "answers": [
              "もう会いました",
              "もうあいました",
              "会いました",
              "あいました"
            ],
            "hint": "Đã gặp rồi"
          },
          {
            "q": "A：もう{買|か}い{物|もの}をしましたか。B：いいえ、＿＿。　〔A:mou kaimono o shimashita ka. B:iie, __.〕",
            "answers": [
              "まだです"
            ],
            "hint": "Chưa mua sắm"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np3-hoi-dap",
        "title": "Hỏi–đáp: chọn câu trả lời tự nhiên (6 câu)",
        "items": [
          {
            "q": "もうご{飯|はん}を{食|た}べましたか。　〔Mou gohan o tabemashita ka.〕　Câu trả lời tự nhiên nhất?",
            "options": [
              "はい、{食|た}べましょう。 (Hai, tabemashou.)",
              "いいえ、もうです。 (Iie, mou desu.)",
              "ええ、まだ{食|た}べました。 (Ee, mada tabemashita.)",
              "いいえ、まだです。 (Iie, mada desu.)"
            ],
            "correct": 3,
            "why": "Chưa = まだです (không phải もうです)."
          },
          {
            "q": "{七時|しちじ}はどうですか。　〔Shichiji wa dou desu ka.〕　Câu trả lời tự nhiên nhất?",
            "options": [
              "はい、{七時|しちじ}です。 (Hai, shichiji desu.)",
              "いいえ、{七時|しちじ}をどうですか。 (Iie, shichiji o dou desu ka.)",
              "ええ、{七時|しちじ}を{行|い}きましょうか。 (Ee, shichiji o ikimashou ka.)",
              "すみません、{七時|しちじ}はちょっと……。{八時|はちじ}はどうですか。 (Sumimasen, shichiji wa chotto.... Hachiji wa dou desu ka.)"
            ],
            "correct": 3,
            "why": "Đề xuất giờ → từ chối khéo rồi đề xuất lại: ちょっと…… + N は どうですか."
          },
          {
            "q": "{今日|きょう}は{寒|さむ}いですね。　〔Kyou wa samui desu ne.〕　Câu trả lời tự nhiên nhất?",
            "options": [
              "はい、{寒|さむ}いでしたか。 (Hai, samui deshita ka.)",
              "ええ、そうですか。 (Ee, sou desu ka.)",
              "いいえ、{寒|さむ}いですよか。 (Iie, samui desu yo ka.)",
              "ええ、そうですね。 (Ee, sou desu ne.)"
            ],
            "correct": 3,
            "why": "Đồng cảm với ね → そうですね."
          },
          {
            "q": "{明日|あした}テストがありますよ。　〔Ashita tesuto ga arimasu yo.〕　Câu trả lời tự nhiên nhất?",
            "options": [
              "そうですか。ありがとうございます。 (Sou desu ka. Arigatou gozaimasu.)",
              "ええ、{行|い}きましょう。 (Ee, ikimashou.)",
              "いいえ、まだです。 (Iie, mada desu.)",
              "そうですね。{明日|あした}。 (Sou desu ne. Ashita.)"
            ],
            "correct": 0,
            "why": "Được báo tin mới với よ → そうですか (ra vậy)."
          },
          {
            "q": "もうコンサートのチケットを{買|か}いましたか。　〔Mou konsaato no chiketto o kaimashita ka.〕　Câu trả lời tự nhiên nhất?",
            "options": [
              "はい、もう{買|か}いました。 (Hai, mou kaimashita.)",
              "はい、{買|か}いましょう。 (Hai, kaimashou.)",
              "はい、まだです。 (Hai, mada desu.)",
              "いいえ、もう{買|か}いません。 (Iie, mou kaimasen.)"
            ],
            "correct": 0,
            "why": "Đã mua rồi → はい、もう買いました."
          },
          {
            "q": "ラーメンはどうですか。　〔Raamen wa dou desu ka.〕　Câu trả lời tự nhiên nhất?",
            "options": [
              "いいですね。ラーメンにしましょう。 (Ii desu ne. Raamen ni shimashou.)",
              "はい、ラーメンはどうですか。 (Hai, raamen wa dou desu ka.)",
              "いいえ、ラーメンをどうですか。 (Iie, raamen o dou desu ka.)",
              "ええ、ラーメンはまだです。 (Ee, raamen wa mada desu.)"
            ],
            "correct": 0,
            "why": "Đề xuất ramen → nhận lời いいですね。～にしましょう."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np3-sai",
        "title": "Tìm câu SAI (4 câu)",
        "items": [
          {
            "q": "(trả lời もう)　Câu nào SAI?",
            "options": [
              "はい、{食|た}べました。 (Hai, tabemashita.)",
              "いいえ、まだです。 (Iie, mada desu.)",
              "はい、もう{食|た}べました。 (Hai, mou tabemashita.)",
              "いいえ、もうです。 (Iie, mou desu.)"
            ],
            "correct": 3,
            "why": "Chưa = **まだです**; もうです không có nghĩa."
          },
          {
            "q": "(どうですか)　Câu nào SAI?",
            "options": [
              "{明日|あした}がどうですか。 (Ashita ga dou desu ka.)",
              "{土曜日|どようび}はどうですか。 (Doyoubi wa dou desu ka.)",
              "{七時|しちじ}はどうですか。 (Shichiji wa dou desu ka.)",
              "{明日|あした}はどうですか。 (Ashita wa dou desu ka.)"
            ],
            "correct": 0,
            "why": "Đề xuất: N **は** どうですか, không dùng が."
          },
          {
            "q": "(ね/よ)　Câu nào SAI?",
            "options": [
              "ご{飯|はん}を{食|た}べましたね。 (Gohan o tabemashita ne.)",
              "もうご{飯|はん}を{食|た}べましたか。 (Mou gohan o tabemashita ka.)",
              "もうご{飯|はん}を{食|た}べましたよか。 (Mou gohan o tabemashita yo ka.)",
              "ご{飯|はん}を{食|た}べましたよ。 (Gohan o tabemashita yo.)"
            ],
            "correct": 2,
            "why": "Không đặt よ rồi mới đến か; hỏi chỉ cần か."
          },
          {
            "q": "(hỏi \"đã đến Tokyo chưa?\")　Câu nào SAI?",
            "options": [
              "もうご{飯|はん}を{食|た}べましたか。 (Mou gohan o tabemashita ka.)",
              "もう{東京|とうきょう}へ{行|い}きますか。 (Mou toukyou e ikimasu ka.)",
              "もう{東京|とうきょう}へ{行|い}きましたか。 (Mou toukyou e ikimashita ka.)",
              "もう{映画|えいが}を{見|み}ましたか。 (Mou eiga o mimashita ka.)"
            ],
            "correct": 1,
            "why": "Hỏi \"đã … chưa\" phải dùng quá khứ **ました**."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np3-nhat-viet",
        "title": "Nhật → Việt (4 câu)",
        "items": [
          {
            "q": "Nghĩa của câu: {七時|しちじ}はちょっと……。{八時|はちじ}はどうですか。　〔Shichiji wa chotto.... Hachiji wa dou desu ka.〕",
            "options": [
              "Bây giờ là 7 giờ 8 phút.",
              "7 giờ hơi khó. 8 giờ thì sao?",
              "8 giờ hơi khó. 7 giờ thì sao?",
              "7 giờ được. 8 giờ cũng được."
            ],
            "correct": 1,
            "why": "ちょっと…… = khó; N は どうですか = còn N thì sao."
          },
          {
            "q": "Nghĩa của câu: もう{切符|きっぷ}を{買|か}いましたか。いいえ、まだです。　〔Mou kippu o kaimashita ka. Iie, mada desu.〕",
            "options": [
              "Bạn thích vé không? — Chưa.",
              "Bạn mua vé chưa? — Chưa.",
              "Bạn sẽ mua vé không? — Có.",
              "Bạn mua vé rồi à? — Rồi."
            ],
            "correct": 1,
            "why": "もう～ましたか = đã … chưa; まだです = chưa."
          },
          {
            "q": "Nghĩa của câu: その{店|みせ}はおいしいですよ。　〔Sono mise wa oishii desu yo.〕",
            "options": [
              "Quán đó ngon đấy.",
              "Tôi chưa đến quán đó.",
              "Quán đó ngon không?",
              "Quán đó ngon nhỉ?"
            ],
            "correct": 0,
            "why": "よ = báo cho biết."
          },
          {
            "q": "Nghĩa của câu: {今日|きょう}はいい{天気|てんき}ですね。　〔Kyou wa ii tenki desu ne.〕",
            "options": [
              "Hôm qua thời tiết đẹp.",
              "Hôm nay thời tiết đẹp đấy.",
              "Hôm nay thời tiết đẹp không?",
              "Hôm nay thời tiết đẹp nhỉ."
            ],
            "correct": 3,
            "why": "ね = nhỉ."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-np3-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Bạn ăn trưa chưa?",
            "chips": [
              "まだ",
              "{昼|ひる}ご{飯|はん}を",
              "{食|た}べましたか",
              "もう"
            ],
            "answer": [
              "もう",
              "{昼|ひる}ご{飯|はん}を",
              "{食|た}べましたか"
            ],
            "ro": "Mou hirugohan o tabemashita ka?"
          },
          {
            "vi": "Chưa. Tôi ăn sau.",
            "chips": [
              "まだです",
              "もう",
              "いいえ"
            ],
            "answer": [
              "いいえ",
              "まだです"
            ],
            "ro": "Iie mada desu."
          },
          {
            "vi": "8 giờ thì sao?",
            "chips": [
              "どうですか",
              "が",
              "{八時|はちじ}は"
            ],
            "answer": [
              "{八時|はちじ}は",
              "どうですか"
            ],
            "ro": "Hachiji wa dou desu ka?"
          },
          {
            "vi": "Hôm nay nóng nhỉ.",
            "chips": [
              "{暑|あつ}いですね",
              "よ",
              "{今日|きょう}は"
            ],
            "answer": [
              "{今日|きょう}は",
              "{暑|あつ}いですね"
            ],
            "ro": "Kyou wa atsui desu ne."
          },
          {
            "vi": "Quán này rẻ đấy.",
            "chips": [
              "この",
              "{店|みせ}は",
              "ね",
              "{安|やす}いですよ"
            ],
            "answer": [
              "この",
              "{店|みせ}は",
              "{安|やす}いですよ"
            ],
            "ro": "Kono mise wa yasui desu yo."
          },
          {
            "vi": "Chủ nhật thì sao?",
            "chips": [
              "{日曜日|にちようび}は",
              "どうですか",
              "を"
            ],
            "answer": [
              "{日曜日|にちようび}は",
              "どうですか"
            ],
            "ro": "Nichiyoubi wa dou desu ka?"
          },
          {
            "vi": "Vé thì tôi mua rồi.",
            "chips": [
              "{買|か}いました",
              "もう",
              "チケットは",
              "まだ"
            ],
            "answer": [
              "チケットは",
              "もう",
              "{買|か}いました"
            ],
            "ro": "Chiketto wa mou kaimashita."
          },
          {
            "vi": "Vâng, tôi hiểu rồi.",
            "chips": [
              "はい",
              "わかりました",
              "どうですか"
            ],
            "answer": [
              "はい",
              "わかりました"
            ],
            "ro": "Hai wakarimashita."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · trộn nhiều ポイント như đề kiểm tra"
      },
      {
        "t": "quiz",
        "id": "lt-b6-np3-dich",
        "title": "Dịch Việt → Nhật — trộn ポイント 48–60 (10 câu)",
        "kind": "translate",
        "grammar": "Bài 6: ポイント 48–60",
        "items": [
          {
            "q": "Tối nay cùng ăn cơm không? Nhà hàng thì sao?",
            "answers": [
              "今晩、一緒にご飯を食べませんか。レストランはどうですか。",
              "今晩、一緒にご飯をたべませんか。レストランはどうですか。",
              "今晩、一緒にごはんを食べませんか。レストランはどうですか。",
              "今晩、一緒にごはんをたべませんか。レストランはどうですか。",
              "今晩、いっしょにご飯を食べませんか。レストランはどうですか。",
              "今晩、いっしょにご飯をたべませんか。レストランはどうですか。",
              "今晩、いっしょにごはんを食べませんか。レストランはどうですか。",
              "今晩、いっしょにごはんをたべませんか。レストランはどうですか。",
              "こんばん、一緒にご飯を食べませんか。レストランはどうですか。",
              "こんばん、一緒にご飯をたべませんか。レストランはどうですか。",
              "こんばん、一緒にごはんを食べませんか。レストランはどうですか。",
              "こんばん、一緒にごはんをたべませんか。レストランはどうですか。",
              "こんばん、いっしょにご飯を食べませんか。レストランはどうですか。",
              "こんばん、いっしょにご飯をたべませんか。レストランはどうですか。",
              "こんばん、いっしょにごはんを食べませんか。レストランはどうですか。",
              "こんばん、いっしょにごはんをたべませんか。レストランはどうですか。"
            ],
            "hint": "ポイント 48 + 58"
          },
          {
            "q": "Bạn mua vé chưa? — Chưa. Mai tôi mua.",
            "answers": [
              "もうチケットを買いましたか。いいえ、まだです。明日買います。",
              "もうチケットを買いましたか。いいえ、まだです。明日かいます。",
              "もうチケットを買いましたか。いいえ、まだです。あした買います。",
              "もうチケットを買いましたか。いいえ、まだです。あしたかいます。",
              "もうチケットをかいましたか。いいえ、まだです。明日買います。",
              "もうチケットをかいましたか。いいえ、まだです。明日かいます。",
              "もうチケットをかいましたか。いいえ、まだです。あした買います。",
              "もうチケットをかいましたか。いいえ、まだです。あしたかいます。"
            ],
            "hint": "ポイント 57"
          },
          {
            "q": "Ramen và sukiyaki, cái nào ngon hơn? — Sukiyaki ngon hơn đấy.",
            "answers": [
              "ラーメンとすき焼きと、どちらがおいしいですか。すき焼きのほうがおいしいですよ。",
              "ラーメンとすき焼きと、どちらがおいしいですか。すきやきのほうがおいしいですよ。",
              "ラーメンとすきやきと、どちらがおいしいですか。すき焼きのほうがおいしいですよ。",
              "ラーメンとすきやきと、どちらがおいしいですか。すきやきのほうがおいしいですよ。"
            ],
            "hint": "ポイント 55, 56, 60"
          },
          {
            "q": "7 giờ thì sao? — Xin lỗi, 7 giờ hơi… 8 giờ thì được.",
            "answers": [
              "七時はどうですか。すみません、七時はちょっと……。八時はいいです。",
              "七時はどうですか。すみません、七時はちょっと……。はちじはいいです。",
              "七時はどうですか。すみません、しちじはちょっと……。八時はいいです。",
              "七時はどうですか。すみません、しちじはちょっと……。はちじはいいです。",
              "しちじはどうですか。すみません、七時はちょっと……。八時はいいです。",
              "しちじはどうですか。すみません、七時はちょっと……。はちじはいいです。",
              "しちじはどうですか。すみません、しちじはちょっと……。八時はいいです。",
              "しちじはどうですか。すみません、しちじはちょっと……。はちじはいいです。"
            ],
            "hint": "ポイント 58"
          },
          {
            "q": "Hôm nay nóng nhỉ. — Ừ, đúng nhỉ.",
            "answers": [
              "今日は暑いですね。ええ、そうですね。",
              "今日はあついですね。ええ、そうですね。",
              "きょうは暑いですね。ええ、そうですね。",
              "きょうはあついですね。ええ、そうですね。"
            ],
            "hint": "ポイント 59"
          },
          {
            "q": "Bạn xem bộ phim đó chưa? — Rồi, tôi xem hôm qua. Hay lắm đấy.",
            "answers": [
              "もうその映画を見ましたか。はい、昨日見ました。おもしろいですよ。",
              "もうその映画を見ましたか。はい、昨日みました。おもしろいですよ。",
              "もうその映画を見ましたか。はい、きのう見ました。おもしろいですよ。",
              "もうその映画を見ましたか。はい、きのうみました。おもしろいですよ。",
              "もうその映画をみましたか。はい、昨日見ました。おもしろいですよ。",
              "もうその映画をみましたか。はい、昨日みました。おもしろいですよ。",
              "もうその映画をみましたか。はい、きのう見ました。おもしろいですよ。",
              "もうその映画をみましたか。はい、きのうみました。おもしろいですよ。",
              "もうそのえいがを見ましたか。はい、昨日見ました。おもしろいですよ。",
              "もうそのえいがを見ましたか。はい、昨日みました。おもしろいですよ。",
              "もうそのえいがを見ましたか。はい、きのう見ました。おもしろいですよ。",
              "もうそのえいがを見ましたか。はい、きのうみました。おもしろいですよ。",
              "もうそのえいがをみましたか。はい、昨日見ました。おもしろいですよ。",
              "もうそのえいがをみましたか。はい、昨日みました。おもしろいですよ。",
              "もうそのえいがをみましたか。はい、きのう見ました。おもしろいですよ。",
              "もうそのえいがをみましたか。はい、きのうみました。おもしろいですよ。"
            ],
            "hint": "ポイント 57 + 60"
          },
          {
            "q": "Trong các món Nhật, bạn thích món nào nhất? — Tôi thích okonomiyaki nhất.",
            "answers": [
              "日本の料理で何がいちばん好きですか。お好み焼きがいちばん好きです。",
              "日本の料理で何がいちばん好きですか。お好み焼きがいちばんすきです。",
              "日本の料理で何がいちばん好きですか。お好みやきがいちばん好きです。",
              "日本の料理で何がいちばん好きですか。お好みやきがいちばんすきです。",
              "日本の料理で何がいちばん好きですか。おこのみ焼きがいちばん好きです。",
              "日本の料理で何がいちばん好きですか。おこのみ焼きがいちばんすきです。",
              "日本の料理で何がいちばん好きですか。おこのみやきがいちばん好きです。",
              "日本の料理で何がいちばん好きですか。おこのみやきがいちばんすきです。",
              "日本の料理で何がいちばんすきですか。お好み焼きがいちばん好きです。",
              "日本の料理で何がいちばんすきですか。お好み焼きがいちばんすきです。",
              "日本の料理で何がいちばんすきですか。お好みやきがいちばん好きです。",
              "日本の料理で何がいちばんすきですか。お好みやきがいちばんすきです。",
              "日本の料理で何がいちばんすきですか。おこのみ焼きがいちばん好きです。",
              "日本の料理で何がいちばんすきですか。おこのみ焼きがいちばんすきです。",
              "日本の料理で何がいちばんすきですか。おこのみやきがいちばん好きです。",
              "日本の料理で何がいちばんすきですか。おこのみやきがいちばんすきです。",
              "日本の料理でなにがいちばん好きですか。お好み焼きがいちばん好きです。",
              "日本の料理でなにがいちばん好きですか。お好み焼きがいちばんすきです。",
              "日本の料理でなにがいちばん好きですか。お好みやきがいちばん好きです。",
              "日本の料理でなにがいちばん好きですか。お好みやきがいちばんすきです。",
              "日本の料理でなにがいちばん好きですか。おこのみ焼きがいちばん好きです。",
              "日本の料理でなにがいちばん好きですか。おこのみ焼きがいちばんすきです。",
              "日本の料理でなにがいちばん好きですか。おこのみやきがいちばん好きです。",
              "日本の料理でなにがいちばん好きですか。おこのみやきがいちばんすきです。",
              "日本の料理でなにがいちばんすきですか。お好み焼きがいちばん好きです。",
              "日本の料理でなにがいちばんすきですか。お好み焼きがいちばんすきです。",
              "日本の料理でなにがいちばんすきですか。お好みやきがいちばん好きです。",
              "日本の料理でなにがいちばんすきですか。お好みやきがいちばんすきです。",
              "日本の料理でなにがいちばんすきですか。おこのみ焼きがいちばん好きです。",
              "日本の料理でなにがいちばんすきですか。おこのみ焼きがいちばんすきです。",
              "日本の料理でなにがいちばんすきですか。おこのみやきがいちばん好きです。",
              "日本の料理でなにがいちばんすきですか。おこのみやきがいちばんすきです。",
              "日本のりょうりで何がいちばん好きですか。お好み焼きがいちばん好きです。",
              "日本のりょうりで何がいちばん好きですか。お好み焼きがいちばんすきです。",
              "日本のりょうりで何がいちばん好きですか。お好みやきがいちばん好きです。",
              "日本のりょうりで何がいちばん好きですか。お好みやきがいちばんすきです。",
              "日本のりょうりで何がいちばん好きですか。おこのみ焼きがいちばん好きです。",
              "日本のりょうりで何がいちばん好きですか。おこのみ焼きがいちばんすきです。",
              "日本のりょうりで何がいちばん好きですか。おこのみやきがいちばん好きです。",
              "日本のりょうりで何がいちばん好きですか。おこのみやきがいちばんすきです。",
              "日本のりょうりで何がいちばんすきですか。お好み焼きがいちばん好きです。",
              "日本のりょうりで何がいちばんすきですか。お好み焼きがいちばんすきです。",
              "日本のりょうりで何がいちばんすきですか。お好みやきがいちばん好きです。",
              "日本のりょうりで何がいちばんすきですか。お好みやきがいちばんすきです。",
              "日本のりょうりで何がいちばんすきですか。おこのみ焼きがいちばん好きです。",
              "日本のりょうりで何がいちばんすきですか。おこのみ焼きがいちばんすきです。",
              "日本のりょうりで何がいちばんすきですか。おこのみやきがいちばん好きです。",
              "日本のりょうりで何がいちばんすきですか。おこのみやきがいちばんすきです。",
              "日本のりょうりでなにがいちばん好きですか。お好み焼きがいちばん好きです。",
              "日本のりょうりでなにがいちばん好きですか。お好み焼きがいちばんすきです。",
              "日本のりょうりでなにがいちばん好きですか。お好みやきがいちばん好きです。",
              "日本のりょうりでなにがいちばん好きですか。お好みやきがいちばんすきです。",
              "日本のりょうりでなにがいちばん好きですか。おこのみ焼きがいちばん好きです。",
              "日本のりょうりでなにがいちばん好きですか。おこのみ焼きがいちばんすきです。",
              "日本のりょうりでなにがいちばん好きですか。おこのみやきがいちばん好きです。",
              "日本のりょうりでなにがいちばん好きですか。おこのみやきがいちばんすきです。",
              "日本のりょうりでなにがいちばんすきですか。お好み焼きがいちばん好きです。",
              "日本のりょうりでなにがいちばんすきですか。お好み焼きがいちばんすきです。",
              "日本のりょうりでなにがいちばんすきですか。お好みやきがいちばん好きです。",
              "日本のりょうりでなにがいちばんすきですか。お好みやきがいちばんすきです。",
              "日本のりょうりでなにがいちばんすきですか。おこのみ焼きがいちばん好きです。",
              "日本のりょうりでなにがいちばんすきですか。おこのみ焼きがいちばんすきです。",
              "日本のりょうりでなにがいちばんすきですか。おこのみやきがいちばん好きです。",
              "日本のりょうりでなにがいちばんすきですか。おこのみやきがいちばんすきです。",
              "にほんの料理で何がいちばん好きですか。お好み焼きがいちばん好きです。",
              "にほんの料理で何がいちばん好きですか。お好み焼きがいちばんすきです。",
              "にほんの料理で何がいちばん好きですか。お好みやきがいちばん好きです。",
              "にほんの料理で何がいちばん好きですか。お好みやきがいちばんすきです。",
              "にほんの料理で何がいちばん好きですか。おこのみ焼きがいちばん好きです。",
              "にほんの料理で何がいちばん好きですか。おこのみ焼きがいちばんすきです。",
              "にほんの料理で何がいちばん好きですか。おこのみやきがいちばん好きです。",
              "にほんの料理で何がいちばん好きですか。おこのみやきがいちばんすきです。",
              "にほんの料理で何がいちばんすきですか。お好み焼きがいちばん好きです。",
              "にほんの料理で何がいちばんすきですか。お好み焼きがいちばんすきです。",
              "にほんの料理で何がいちばんすきですか。お好みやきがいちばん好きです。",
              "にほんの料理で何がいちばんすきですか。お好みやきがいちばんすきです。",
              "にほんの料理で何がいちばんすきですか。おこのみ焼きがいちばん好きです。",
              "にほんの料理で何がいちばんすきですか。おこのみ焼きがいちばんすきです。",
              "にほんの料理で何がいちばんすきですか。おこのみやきがいちばん好きです。",
              "にほんの料理で何がいちばんすきですか。おこのみやきがいちばんすきです。",
              "にほんの料理でなにがいちばん好きですか。お好み焼きがいちばん好きです。",
              "にほんの料理でなにがいちばん好きですか。お好み焼きがいちばんすきです。",
              "にほんの料理でなにがいちばん好きですか。お好みやきがいちばん好きです。",
              "にほんの料理でなにがいちばん好きですか。お好みやきがいちばんすきです。",
              "にほんの料理でなにがいちばん好きですか。おこのみ焼きがいちばん好きです。",
              "にほんの料理でなにがいちばん好きですか。おこのみ焼きがいちばんすきです。",
              "にほんの料理でなにがいちばん好きですか。おこのみやきがいちばん好きです。",
              "にほんの料理でなにがいちばん好きですか。おこのみやきがいちばんすきです。",
              "にほんの料理でなにがいちばんすきですか。お好み焼きがいちばん好きです。",
              "にほんの料理でなにがいちばんすきですか。お好み焼きがいちばんすきです。",
              "にほんの料理でなにがいちばんすきですか。お好みやきがいちばん好きです。",
              "にほんの料理でなにがいちばんすきですか。お好みやきがいちばんすきです。",
              "にほんの料理でなにがいちばんすきですか。おこのみ焼きがいちばん好きです。",
              "にほんの料理でなにがいちばんすきですか。おこのみ焼きがいちばんすきです。",
              "にほんの料理でなにがいちばんすきですか。おこのみやきがいちばん好きです。",
              "にほんの料理でなにがいちばんすきですか。おこのみやきがいちばんすきです。",
              "にほんのりょうりで何がいちばん好きですか。お好み焼きがいちばん好きです。",
              "にほんのりょうりで何がいちばん好きですか。お好み焼きがいちばんすきです。",
              "にほんのりょうりで何がいちばん好きですか。お好みやきがいちばん好きです。",
              "にほんのりょうりで何がいちばん好きですか。お好みやきがいちばんすきです。",
              "にほんのりょうりで何がいちばん好きですか。おこのみ焼きがいちばん好きです。",
              "にほんのりょうりで何がいちばん好きですか。おこのみ焼きがいちばんすきです。",
              "にほんのりょうりで何がいちばん好きですか。おこのみやきがいちばん好きです。",
              "にほんのりょうりで何がいちばん好きですか。おこのみやきがいちばんすきです。",
              "にほんのりょうりで何がいちばんすきですか。お好み焼きがいちばん好きです。",
              "にほんのりょうりで何がいちばんすきですか。お好み焼きがいちばんすきです。",
              "にほんのりょうりで何がいちばんすきですか。お好みやきがいちばん好きです。",
              "にほんのりょうりで何がいちばんすきですか。お好みやきがいちばんすきです。",
              "にほんのりょうりで何がいちばんすきですか。おこのみ焼きがいちばん好きです。",
              "にほんのりょうりで何がいちばんすきですか。おこのみ焼きがいちばんすきです。",
              "にほんのりょうりで何がいちばんすきですか。おこのみやきがいちばん好きです。",
              "にほんのりょうりで何がいちばんすきですか。おこのみやきがいちばんすきです。",
              "にほんのりょうりでなにがいちばん好きですか。お好み焼きがいちばん好きです。",
              "にほんのりょうりでなにがいちばん好きですか。お好み焼きがいちばんすきです。",
              "にほんのりょうりでなにがいちばん好きですか。お好みやきがいちばん好きです。",
              "にほんのりょうりでなにがいちばん好きですか。お好みやきがいちばんすきです。",
              "にほんのりょうりでなにがいちばん好きですか。おこのみ焼きがいちばん好きです。",
              "にほんのりょうりでなにがいちばん好きですか。おこのみ焼きがいちばんすきです。",
              "にほんのりょうりでなにがいちばん好きですか。おこのみやきがいちばん好きです。",
              "にほんのりょうりでなにがいちばん好きですか。おこのみやきがいちばんすきです。",
              "にほんのりょうりでなにがいちばんすきですか。お好み焼きがいちばん好きです。",
              "にほんのりょうりでなにがいちばんすきですか。お好み焼きがいちばんすきです。",
              "にほんのりょうりでなにがいちばんすきですか。お好みやきがいちばん好きです。",
              "にほんのりょうりでなにがいちばんすきですか。お好みやきがいちばんすきです。",
              "にほんのりょうりでなにがいちばんすきですか。おこのみ焼きがいちばん好きです。",
              "にほんのりょうりでなにがいちばんすきですか。おこのみ焼きがいちばんすきです。",
              "にほんのりょうりでなにがいちばんすきですか。おこのみやきがいちばん好きです。",
              "にほんのりょうりでなにがいちばんすきですか。おこのみやきがいちばんすきです。"
            ],
            "hint": "ポイント 53"
          },
          {
            "q": "Chủ nhật tôi có hẹn nên… Thứ Bảy thì sao?",
            "answers": [
              "日曜日は約束がありますから……。土曜日はどうですか。",
              "日曜日は約束がありますから……。どようびはどうですか。",
              "日曜日はやくそくがありますから……。土曜日はどうですか。",
              "日曜日はやくそくがありますから……。どようびはどうですか。",
              "にちようびは約束がありますから……。土曜日はどうですか。",
              "にちようびは約束がありますから……。どようびはどうですか。",
              "にちようびはやくそくがありますから……。土曜日はどうですか。",
              "にちようびはやくそくがありますから……。どようびはどうですか。"
            ],
            "hint": "ポイント 50 + 58"
          },
          {
            "q": "Tàu điện nhanh hơn xe buýt nhiều. Cùng đi tàu điện nhé.",
            "answers": [
              "電車はバスよりずっと早いです。電車で行きましょうね。",
              "電車はバスよりずっと早いです。電車でいきましょうね。",
              "電車はバスよりずっと早いです。でんしゃで行きましょうね。",
              "電車はバスよりずっと早いです。でんしゃでいきましょうね。",
              "電車はバスよりずっとはやいです。電車で行きましょうね。",
              "電車はバスよりずっとはやいです。電車でいきましょうね。",
              "電車はバスよりずっとはやいです。でんしゃで行きましょうね。",
              "電車はバスよりずっとはやいです。でんしゃでいきましょうね。",
              "でんしゃはバスよりずっと早いです。電車で行きましょうね。",
              "でんしゃはバスよりずっと早いです。電車でいきましょうね。",
              "でんしゃはバスよりずっと早いです。でんしゃで行きましょうね。",
              "でんしゃはバスよりずっと早いです。でんしゃでいきましょうね。",
              "でんしゃはバスよりずっとはやいです。電車で行きましょうね。",
              "でんしゃはバスよりずっとはやいです。電車でいきましょうね。",
              "でんしゃはバスよりずっとはやいです。でんしゃで行きましょうね。",
              "でんしゃはバスよりずっとはやいです。でんしゃでいきましょうね。"
            ],
            "hint": "ポイント 54 + 49 + 59"
          },
          {
            "q": "Ở công viên có buổi hoà nhạc đấy. Cùng đi xem không?",
            "answers": [
              "公園でコンサートがありますよ。一緒に見に行きませんか。",
              "公園でコンサートがありますよ。一緒に見にいきませんか。",
              "公園でコンサートがありますよ。一緒にみに行きませんか。",
              "公園でコンサートがありますよ。一緒にみにいきませんか。",
              "公園でコンサートがありますよ。いっしょに見に行きませんか。",
              "公園でコンサートがありますよ。いっしょに見にいきませんか。",
              "公園でコンサートがありますよ。いっしょにみに行きませんか。",
              "公園でコンサートがありますよ。いっしょにみにいきませんか。",
              "こうえんでコンサートがありますよ。一緒に見に行きませんか。",
              "こうえんでコンサートがありますよ。一緒に見にいきませんか。",
              "こうえんでコンサートがありますよ。一緒にみに行きませんか。",
              "こうえんでコンサートがありますよ。一緒にみにいきませんか。",
              "こうえんでコンサートがありますよ。いっしょに見に行きませんか。",
              "こうえんでコンサートがありますよ。いっしょに見にいきませんか。",
              "こうえんでコンサートがありますよ。いっしょにみに行きませんか。",
              "こうえんでコンサートがありますよ。いっしょにみにいきませんか。"
            ],
            "hint": "ポイント 51 + 60 + 48"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-np3-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "A：もうチケット（①）{買|か}いました（②）。B：いいえ、（③）です。　〔A:mou chiketto((1)) kaimashita((2)). B:iie, ((3)) desu.〕　— A: Bạn mua vé chưa? B: Chưa.",
            "options": [
              "① を　② か　③ もう",
              "① を　② か　③ まだ",
              "① が　② か　③ まだ",
              "① を　② ね　③ もう"
            ],
            "correct": 1,
            "why": "もう Vましたか → まだです. → **A：もうチケットを{買|か}いましたか。B：いいえ、まだです。** 〔A:mou chiketto o kaimashita ka. B:iie, mada desu.〕 — A: Bạn mua vé chưa? B: Chưa."
          },
          {
            "q": "A：{日曜日|にちようび}、{公園|こうえん}（①）{花火|はなび}があります（②）。{一緒|いっしょ}に{見|み}（③）{行|い}きませんか。　〔A:nichiyoubi, kouen((1)) hanabi ga arimasu((2)). Issho ni mi((3)) ikimasen ka.〕　— Chủ nhật ở công viên có pháo hoa đấy. Cùng đi xem không?",
            "options": [
              "① に　② よ　③ に",
              "① で　② よ　③ に",
              "① で　② か　③ を",
              "① で　② ね　③ で"
            ],
            "correct": 1,
            "why": "N で … あります よ · V に 行きませんか. → **A：{日曜日|にちようび}、{公園|こうえん}で{花火|はなび}がありますよ。{一緒|いっしょ}に{見|み}に{行|い}きませんか。** 〔A:nichiyoubi, kouen de hanabi ga arimasu yo. Issho ni mi ni ikimasen ka.〕 — Chủ nhật ở công viên có pháo hoa đấy. Cùng đi xem không?"
          },
          {
            "q": "A：{土曜日|どようび}（①）どうですか。B：{土曜日|どようび}（②）ちょっと……。{約束|やくそく}（③）ありますから。　〔A:doyoubi((1)) dou desu ka. B:doyoubi((2)) chotto.... Yakusoku((3)) arimasu kara.〕　— A: Thứ Bảy thì sao? B: Thứ Bảy hơi… Vì tôi có hẹn.",
            "options": [
              "① は　② が　③ を",
              "① は　② は　③ が",
              "① が　② は　③ が",
              "① を　② は　③ が"
            ],
            "correct": 1,
            "why": "N は どうですか · N は ちょっと…… · N が あります. → **A：{土曜日|どようび}はどうですか。B：{土曜日|どようび}はちょっと……。{約束|やくそく}がありますから。** 〔A:doyoubi wa dou desu ka. B:doyoubi wa chotto.... Yakusoku ga arimasu kara.〕 — A: Thứ Bảy thì sao? B: Thứ Bảy hơi… Vì tôi có hẹn."
          },
          {
            "q": "A：ラーメン（①）すき{焼|や}き（②）、どちら（③）{安|やす}いですか。B：ラーメン（④）ほうが{安|やす}いですよ。　〔A:raamen((1)) sukiyaki((2)), dochira((3)) yasui desu ka. B:raamen((4)) hou ga yasui desu yo.〕　— Ramen và sukiyaki, cái nào rẻ hơn? — Ramen rẻ hơn đấy.",
            "options": [
              "① と　② と　③ が　④ の",
              "① と　② と　③ が　④ は",
              "① が　② と　③ が　④ の",
              "① と　② と　③ を　④ の"
            ],
            "correct": 0,
            "why": "N1 と N2 と どちらが · N の ほうが · よ. → **A：ラーメンとすき{焼|や}きと、どちらが{安|やす}いですか。B：ラーメンのほうが{安|やす}いですよ。** 〔A:raamen to sukiyaki to, dochira ga yasui desu ka. B:raamen no hou ga yasui desu yo.〕 — Ramen và sukiyaki, cái nào rẻ hơn? — Ramen rẻ hơn đấy."
          },
          {
            "q": "A：{季節|きせつ}（①）、いつ（②）いちばん{好|す}きですか。B：{春|はる}がいちばん{好|す}きです。{夏|なつ}（③）{暑|あつ}いですから……。　〔A:kisetsu((1)), itsu((2)) ichiban suki desu ka. B:haru ga ichiban suki desu. Natsu((3)) atsui desu kara....〕　— A: Trong các mùa bạn thích mùa nào nhất? B: Tôi thích mùa xuân nhất. Vì mùa hè nóng…",
            "options": [
              "① で　② を　③ は",
              "① で　② が　③ を",
              "① で　② が　③ は",
              "① に　② が　③ は"
            ],
            "correct": 2,
            "why": "N で いつが いちばん · N は A です から. → **A：{季節|きせつ}で、いつがいちばん{好|す}きですか。B：{春|はる}がいちばん{好|す}きです。{夏|なつ}は{暑|あつ}いですから……。** 〔A:kisetsu de, itsu ga ichiban suki desu ka. B:haru ga ichiban suki desu. Natsu wa atsui desu kara....〕 — A: Trong các mùa bạn thích mùa nào nhất? B: Tôi thích mùa xuân nhất. Vì mùa hè nóng…"
          },
          {
            "q": "A：{来週|らいしゅう}、{大学|だいがく}（①）サッカーの{試合|しあい}（②）あります（③）。チケット（④）{二枚|にまい}あります。　〔A:raishuu, daigaku((1)) sakkaa no shiai((2)) arimasu((3)). Chiketto((4)) nimai arimasu.〕　— A: Tuần sau ở đại học có trận bóng đá đấy. Tôi có hai vé.",
            "options": [
              "① で　② を　③ よ　④ が",
              "① で　② が　③ よ　④ が",
              "① で　② が　③ か　④ を",
              "① に　② が　③ よ　④ が"
            ],
            "correct": 1,
            "why": "N で N が あります · よ · N が ～枚 あります. → **A：{来週|らいしゅう}、{大学|だいがく}でサッカーの{試合|しあい}がありますよ。チケットが{二枚|にまい}あります。** 〔A:raishuu, daigaku de sakkaa no shiai ga arimasu yo. Chiketto ga nimai arimasu.〕 — A: Tuần sau ở đại học có trận bóng đá đấy. Tôi có hai vé."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b6-hoi-thoai",
    "kind": "conversation",
    "title": "Luyện thêm Bài 6 · Hội thoại — rủ · từ chối · hẹn · chọn quán · mua vé (5 hội thoại mới, ~55 câu)",
    "goal": "Hiểu và tự nói được các hội thoại Bài 6: rủ rê, nhận lời, từ chối khéo, hẹn giờ/nơi, so sánh để chọn quán, hỏi \"đã … chưa\", chốt giờ bằng N は どうですか.",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Mỗi hội thoại làm 4 bước: **đọc + nghe** → **trả lời câu hỏi hiểu** → **điền chỗ trống** → **sắp xếp lượt thoại**. Cuối bài có phần **tự nói** (che một vai, tự nói vai đó).",
          "Khi nghe/đọc, tìm 3 dấu hiệu: **rủ** (ませんか) · **nhận/từ chối** (いいですね／ちょっと……) · **chốt** (giờ – nơi – ね để xác nhận). Hội thoại thi nói và nghe đều theo khuôn này.",
          "Lỗi hay mắc: quên **で** khi nói nơi diễn ra sự kiện, đáp ええ、行きませんか (phải ～ましょう), và chốt giờ/nơi sai vì không nghe lượt cuối cùng."
        ]
      },
      {
        "t": "recap",
        "title": "Khuôn chung của hội thoại rủ rê",
        "items": [
          "**Rủ**: Vませんか ／ N は どうですか → **Trả lời**: いいですね。Vましょう ／ すみません、ちょっと…… + lý do (用事・約束が あります)",
          "**Hẹn**: 何時に 会いますか → ○時は どうですか → ○時ですね。わかりました。(ね xác nhận)",
          "**Chốt**: そうしましょう ／ わかりました。"
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · Hội thoại 1–2: rủ, nhận lời, từ chối khéo"
      },
      {
        "t": "p",
        "text": "**Tình huống 1.** Marco rủ Rin đi xem phim hài vào thứ Bảy. Hai bạn chốt giờ và nơi gặp."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 1 — Marco rủ Rin đi xem phim",
        "lines": [
          {
            "who": "マルコ",
            "role": "a",
            "text": "リンさん、{今度|こんど}の{土曜日|どようび}、ひまですか。",
            "ro": "Rin-san, kondo no doyoubi, hima desu ka.",
            "vi": "Rin ơi, thứ Bảy tới bạn rảnh không?"
          },
          {
            "who": "リン",
            "role": "b",
            "text": "はい、ひまです。{何|なに}かありますか。",
            "ro": "Hai, hima desu. Nani ka arimasu ka.",
            "vi": "Có, mình rảnh. Có gì không?"
          },
          {
            "who": "マルコ",
            "role": "a",
            "text": "{映画館|えいがかん}でコメディーの{映画|えいが}があります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。",
            "ro": "Eigakan de komedii no eiga ga arimasu. Issho ni mi ni ikimasen ka.",
            "vi": "Ở rạp có phim hài. Cùng đi xem không?"
          },
          {
            "who": "リン",
            "role": "b",
            "text": "いいですね。{行|い}きましょう。{何時|なんじ}に{会|あ}いますか。",
            "ro": "Ii desu ne. Ikimashou. Nanji ni aimasu ka.",
            "vi": "Hay đấy. Đi thôi. Mấy giờ gặp?"
          },
          {
            "who": "マルコ",
            "role": "a",
            "text": "{二時|にじ}はどうですか。",
            "ro": "Niji wa dou desu ka.",
            "vi": "2 giờ thì sao?"
          },
          {
            "who": "リン",
            "role": "b",
            "text": "{二時|にじ}ですね。わかりました。{駅|えき}の{前|まえ}で{会|あ}いましょう。",
            "ro": "Niji desu ne. Wakarimashita. Eki no mae de aimashou.",
            "vi": "2 giờ nhỉ. Mình hiểu rồi. Gặp trước ga nhé."
          },
          {
            "who": "マルコ",
            "role": "a",
            "text": "はい、そうしましょう。",
            "ro": "Hai, soushimashou.",
            "vi": "Ừ, cứ vậy nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-ht1-hieu",
        "title": "Hội thoại 1 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Marco rủ Rin làm gì?",
            "options": [
              "Đi xem bóng chày",
              "Đi ăn thịt nướng",
              "Xem phim hài ở rạp",
              "Đi karaoke"
            ],
            "correct": 2,
            "why": "コメディーの映画 + 見に行きませんか."
          },
          {
            "q": "Rin nhận lời hay từ chối?",
            "options": [
              "Từ chối",
              "Chưa quyết định",
              "Hẹn lần sau",
              "Nhận lời"
            ],
            "correct": 3,
            "why": "いいですね。行きましょう = nhận lời."
          },
          {
            "q": "Họ hẹn gặp lúc mấy giờ?",
            "options": [
              "12 giờ",
              "1 giờ",
              "2 giờ",
              "3 giờ"
            ],
            "correct": 2,
            "why": "二時 (にじ) = 2 giờ."
          },
          {
            "q": "Họ hẹn gặp ở đâu?",
            "options": [
              "Trước ga",
              "Trước rạp phim",
              "Ở nhà Rin",
              "Ở công viên"
            ],
            "correct": 0,
            "why": "駅の前で会いましょう."
          },
          {
            "q": "Rin nói 「二時ですね」 nhằm mục đích gì?",
            "options": [
              "Xác nhận lại giờ",
              "Báo tin mới",
              "Từ chối khéo",
              "Hỏi đã làm chưa"
            ],
            "correct": 0,
            "why": "～ね khi nhắc lại = xác nhận."
          },
          {
            "q": "Ngày họ đi xem phim là ngày nào?",
            "options": [
              "Thứ Bảy tới",
              "Hôm nay",
              "Chủ nhật tới",
              "Thứ Sáu tuần này"
            ],
            "correct": 0,
            "why": "今度の土曜日."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-ht1-dien",
        "title": "Hội thoại 1 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "マルコ：{映画館|えいがかん}＿＿コメディーの{映画|えいが}があります。　〔Maruko:eigakan__ komedii no eiga ga arimasu.〕",
            "answers": [
              "で"
            ],
            "hint": "Nơi diễn ra sự kiện"
          },
          {
            "q": "マルコ：{一緒|いっしょ}に{見|み}に{行|い}き＿＿。　〔Maruko:issho ni mi ni iki__.〕",
            "answers": [
              "ませんか"
            ],
            "hint": "Rủ"
          },
          {
            "q": "リン：いいですね。{行|い}き＿＿。　〔Rin:ii desu ne. Iki__.〕",
            "answers": [
              "ましょう"
            ],
            "hint": "Nhận lời"
          },
          {
            "q": "マルコ：{二時|にじ}＿＿どうですか。　〔Maruko:niji__ dou desu ka.〕",
            "answers": [
              "は"
            ],
            "hint": "Đề xuất"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-ht1-sx",
        "title": "Hội thoại 1 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: rủ → nhận lời + hỏi giờ → đề xuất giờ → xác nhận.",
            "chips": [
              "{二時|にじ}ですね。わかりました。",
              "{二時|にじ}はどうですか。",
              "いいですね。{行|い}きましょう。{何時|なんじ}に{会|あ}いますか。",
              "リンさん、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。"
            ],
            "answer": [
              "リンさん、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。",
              "いいですね。{行|い}きましょう。{何時|なんじ}に{会|あ}いますか。",
              "{二時|にじ}はどうですか。",
              "{二時|にじ}ですね。わかりました。"
            ],
            "ro": "Rin-san, issho ni eiga o mi ni ikimasen ka. Ii desu ne. Ikimashou. Nanji ni aimasu ka. Niji wa dou desu ka. Niji desu ne. Wakarimashita.."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 2.** Daniel rủ Wang đi karaoke tối nay nhưng Wang có hẹn. Họ chọn ngày khác."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 2 — Daniel rủ Wang đi karaoke (bị từ chối)",
        "lines": [
          {
            "who": "ダニエル",
            "role": "a",
            "text": "ワンさん、{今晩|こんばん}、カラオケに{行|い}きませんか。",
            "ro": "Wan-san, konban, karaoke ni ikimasen ka.",
            "vi": "Wang ơi, tối nay đi karaoke không?"
          },
          {
            "who": "ワン",
            "role": "b",
            "text": "すみません、{今晩|こんばん}はちょっと……。",
            "ro": "Sumimasen, konban wa chotto....",
            "vi": "Xin lỗi, tối nay hơi…"
          },
          {
            "who": "ダニエル",
            "role": "a",
            "text": "{用事|ようじ}がありますか。",
            "ro": "Youji ga arimasu ka.",
            "vi": "Bạn có việc bận à?"
          },
          {
            "who": "ワン",
            "role": "b",
            "text": "ええ、{友達|ともだち}と{約束|やくそく}があります。",
            "ro": "Ee, tomodachi to yakusoku ga arimasu.",
            "vi": "Ừ, mình có hẹn với bạn."
          },
          {
            "who": "ダニエル",
            "role": "a",
            "text": "そうですか。ざんねんですね。{来週|らいしゅう}はどうですか。",
            "ro": "Sou desu ka. Zannen desu ne. Raishuu wa dou desu ka.",
            "vi": "Vậy à. Tiếc nhỉ. Tuần sau thì sao?"
          },
          {
            "who": "ワン",
            "role": "b",
            "text": "{来週|らいしゅう}の{金曜日|きんようび}はひまですよ。",
            "ro": "Raishuu no kin'youbi wa hima desu yo.",
            "vi": "Thứ Sáu tuần sau mình rảnh đấy."
          },
          {
            "who": "ダニエル",
            "role": "a",
            "text": "じゃあ、{来週|らいしゅう}の{金曜日|きんようび}に{行|い}きましょう。",
            "ro": "Jaa, raishuu no kin'youbi ni ikimashou.",
            "vi": "Vậy thứ Sáu tuần sau đi nhé."
          },
          {
            "who": "ワン",
            "role": "b",
            "text": "ええ、そうしましょう。",
            "ro": "Ee, soushimashou.",
            "vi": "Ừ, cứ vậy nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-ht2-hieu",
        "title": "Hội thoại 2 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Wang trả lời lời rủ của Daniel như thế nào?",
            "options": [
              "Từ chối khéo bằng ちょっと……",
              "Từ chối thẳng \"không đi\"",
              "Hẹn Daniel đi trước",
              "Nhận lời ngay"
            ],
            "correct": 0,
            "why": "すみません、今晩はちょっと…… là cách từ chối khéo."
          },
          {
            "q": "Lý do Wang không đi tối nay?",
            "options": [
              "Bị ốm",
              "Không thích karaoke",
              "Phải đi làm thêm",
              "Có hẹn với bạn"
            ],
            "correct": 3,
            "why": "友達と約束があります."
          },
          {
            "q": "Daniel nói 「ざんねんですね」 có nghĩa gì?",
            "options": [
              "Tiếc nhỉ",
              "Hay quá nhỉ",
              "Xa quá nhỉ",
              "Tôi hiểu rồi"
            ],
            "correct": 0,
            "why": "残念 = đáng tiếc."
          },
          {
            "q": "Họ hẹn lại vào lúc nào?",
            "options": [
              "Thứ Bảy tuần sau",
              "Thứ Sáu tuần sau",
              "Tối mai",
              "Thứ Sáu tuần này"
            ],
            "correct": 1,
            "why": "来週の金曜日."
          },
          {
            "q": "Wang nói 「ひまですよ」, chữ よ có tác dụng gì?",
            "options": [
              "Từ chối",
              "Hỏi Daniel có rảnh không",
              "Báo cho Daniel biết mình rảnh",
              "Xin Daniel đồng ý"
            ],
            "correct": 2,
            "why": "よ = báo cho người nghe biết."
          },
          {
            "q": "「そうしましょう」 của Wang nghĩa là gì?",
            "options": [
              "Xin lỗi",
              "Tôi hiểu rồi",
              "Cùng đi karaoke nhé?",
              "Cứ làm như thế đi"
            ],
            "correct": 3,
            "why": "そうしましょう = đồng ý với đề xuất."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-ht2-dien",
        "title": "Hội thoại 2 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ワン：{今晩|こんばん}は＿＿……。　〔Wan:konban wa __....〕",
            "answers": [
              "ちょっと"
            ],
            "hint": "Từ chối khéo"
          },
          {
            "q": "ワン：{友達|ともだち}と{約束|やくそく}＿＿あります。　〔Wan:tomodachi to yakusoku__ arimasu.〕",
            "answers": [
              "が"
            ],
            "hint": "あります đi với が"
          },
          {
            "q": "ダニエル：{来週|らいしゅう}＿＿どうですか。　〔Danieru:raishuu__ dou desu ka.〕",
            "answers": [
              "は"
            ],
            "hint": "Đề xuất"
          },
          {
            "q": "ワン：{金曜日|きんようび}はひまです＿＿。　〔Wan:kin'youbi wa hima desu__.〕",
            "answers": [
              "よ"
            ],
            "hint": "Báo cho biết"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-ht2-sx",
        "title": "Hội thoại 2 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: rủ → từ chối khéo → tiếc + đề xuất lại → báo rảnh.",
            "chips": [
              "すみません、{今晩|こんばん}はちょっと……。",
              "ざんねんですね。{来週|らいしゅう}はどうですか。",
              "{金曜日|きんようび}はひまですよ。",
              "ワンさん、{今晩|こんばん}、カラオケに{行|い}きませんか。"
            ],
            "answer": [
              "ワンさん、{今晩|こんばん}、カラオケに{行|い}きませんか。",
              "すみません、{今晩|こんばん}はちょっと……。",
              "ざんねんですね。{来週|らいしゅう}はどうですか。",
              "{金曜日|きんようび}はひまですよ。"
            ],
            "ro": "Wan-san, konban, karaoke ni ikimasen ka. Sumimasen, konban wa chotto.... Zannen desu ne. Raishuu wa dou desu ka. Kin'youbi wa hima desu yo.."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · Hội thoại 3–4: chọn quán, hỏi \"đã … chưa\""
      },
      {
        "t": "p",
        "text": "**Tình huống 3.** Ba bạn chọn quán ăn tối: so sánh giá và vị, thích nhất nhưng không đủ tiền."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 3 — Chọn quán ăn tối nay",
        "lines": [
          {
            "who": "アンナ",
            "role": "a",
            "text": "{今晩|こんばん}、ラーメンと{焼|や}き{肉|にく}と、どちらがいいですか。",
            "ro": "Konban, raamen to yakiniku to, dochira ga ii desu ka.",
            "vi": "Tối nay ramen hay thịt nướng thì được hơn?"
          },
          {
            "who": "パク",
            "role": "b",
            "text": "そうですねえ。{焼|や}き{肉|にく}のほうがおいしいですが、ラーメンのほうが{安|やす}いですよ。",
            "ro": "Soudesunee. Yakiniku no hou ga oishii desu ga, raamen no hou ga yasui desu yo.",
            "vi": "Để xem nào. Thịt nướng ngon hơn nhưng ramen rẻ hơn đấy."
          },
          {
            "who": "リン",
            "role": "c",
            "text": "{私|わたし}は{焼|や}き{肉|にく}がいちばん{好|す}きです。でも、{今月|こんげつ}はお{金|かね}があまりありません。",
            "ro": "Watashi wa yakiniku ga ichiban suki desu. Demo, kongetsu wa okane ga amari arimasen.",
            "vi": "Mình thích thịt nướng nhất. Nhưng tháng này mình không có nhiều tiền."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "じゃあ、ラーメンにしましょう。{駅|えき}の{近|ちか}くに{安|やす}い{店|みせ}があります。",
            "ro": "Jaa, raamen ni shimashou. Eki no chikaku ni yasui mise ga arimasu.",
            "vi": "Vậy ăn ramen nhé. Gần ga có quán rẻ."
          },
          {
            "who": "パク",
            "role": "b",
            "text": "いいですね。そうしましょう。",
            "ro": "Ii desu ne. Soushimashou.",
            "vi": "Hay đấy. Cứ vậy nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-ht3-hieu",
        "title": "Hội thoại 3 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Theo Park, món nào ngon hơn?",
            "options": [
              "Park không nói",
              "Cả hai như nhau",
              "Ramen",
              "Thịt nướng"
            ],
            "correct": 3,
            "why": "焼き肉の ほうが おいしい."
          },
          {
            "q": "Theo Park, món nào rẻ hơn?",
            "options": [
              "Cả hai như nhau",
              "Ramen",
              "Park không nói",
              "Thịt nướng"
            ],
            "correct": 1,
            "why": "ラーメンの ほうが 安い."
          },
          {
            "q": "Rin thích món nào nhất?",
            "options": [
              "Thịt nướng",
              "Ramen",
              "Okonomiyaki",
              "Sukiyaki"
            ],
            "correct": 0,
            "why": "焼き肉が いちばん 好き."
          },
          {
            "q": "Vì sao Rin không đòi ăn thịt nướng?",
            "options": [
              "Quán thịt nướng xa",
              "Tháng này không có nhiều tiền",
              "Rin có hẹn",
              "Rin ghét ramen"
            ],
            "correct": 1,
            "why": "お金が あまり ありません."
          },
          {
            "q": "Cuối cùng họ chọn gì?",
            "options": [
              "Không chọn được",
              "Thịt nướng",
              "Sukiyaki",
              "Ramen"
            ],
            "correct": 3,
            "why": "ラーメンに しましょう."
          },
          {
            "q": "Quán ramen ở đâu?",
            "options": [
              "Ở công viên",
              "Trước rạp phim",
              "Gần ga",
              "Gần trường"
            ],
            "correct": 2,
            "why": "駅の近くに 安い店が あります."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-ht3-dien",
        "title": "Hội thoại 3 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "パク：{焼|や}き{肉|にく}のほう＿＿おいしいです。　〔Paku:yakiniku no hou__ oishii desu.〕",
            "answers": [
              "が"
            ],
            "hint": "N の ほうが"
          },
          {
            "q": "アンナ：ラーメンと{焼|や}き{肉|にく}と、＿＿がいいですか。　〔Anna:raamen to yakiniku to, __ ga ii desu ka.〕",
            "answers": [
              "どちら"
            ],
            "hint": "Chọn 1 trong 2"
          },
          {
            "q": "リン：{私|わたし}は{焼|や}き{肉|にく}が＿＿{好|す}きです。　〔Rin:watashi wa yakiniku ga __ suki desu.〕",
            "answers": [
              "いちばん"
            ],
            "hint": "Nhất"
          },
          {
            "q": "アンナ：ラーメンに＿＿。　〔Anna:raamen ni __.〕",
            "answers": [
              "しましょう"
            ],
            "hint": "Đề nghị"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-ht3-sx",
        "title": "Hội thoại 3 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi chọn → so sánh → thích nhất → quyết định.",
            "chips": [
              "{私|わたし}は{焼|や}き{肉|にく}がいちばん{好|す}きです。",
              "じゃあ、ラーメンにしましょう。",
              "{焼|や}き{肉|にく}のほうがおいしいですが、ラーメンのほうが{安|やす}いですよ。",
              "{今晩|こんばん}、ラーメンと{焼|や}き{肉|にく}と、どちらがいいですか。"
            ],
            "answer": [
              "{今晩|こんばん}、ラーメンと{焼|や}き{肉|にく}と、どちらがいいですか。",
              "{焼|や}き{肉|にく}のほうがおいしいですが、ラーメンのほうが{安|やす}いですよ。",
              "{私|わたし}は{焼|や}き{肉|にく}がいちばん{好|す}きです。",
              "じゃあ、ラーメンにしましょう。"
            ],
            "ro": "Konban, raamen to yakiniku to, dochira ga ii desu ka. Yakiniku no hou ga oishii desu ga, raamen no hou ga yasui desu yo. Watashi wa yakiniku ga ichiban suki desu. Jaa, raamen ni shimashou.."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 4.** Rin và Anna nói chuyện về vé hoà nhạc: ai đã mua, diễn ở đâu, khi nào, hẹn gặp."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 4 — Vé hoà nhạc đã mua chưa?",
        "lines": [
          {
            "who": "リン",
            "role": "a",
            "text": "アンナさん、もうコンサートのチケットを{買|か}いましたか。",
            "ro": "Anna-san, mou konsaato no chiketto o kaimashita ka.",
            "vi": "Anna ơi, bạn mua vé hoà nhạc chưa?"
          },
          {
            "who": "アンナ",
            "role": "b",
            "text": "いいえ、まだです。リンさんは？",
            "ro": "Iie, mada desu. Rin-san wa?",
            "vi": "Chưa. Còn Rin?"
          },
          {
            "who": "リン",
            "role": "a",
            "text": "{私|わたし}はもう{買|か}いました。{二枚|にまい}ありますよ。",
            "ro": "Watashi wa mou kaimashita. Nimai arimasu yo.",
            "vi": "Mình mua rồi. Mình có hai vé đấy."
          },
          {
            "who": "アンナ",
            "role": "b",
            "text": "そうですか。いいですね。{一枚|いちまい}ください。",
            "ro": "Sou desu ka. Ii desu ne. Ichimai kudasai.",
            "vi": "Vậy à. Hay quá. Cho mình một vé nhé."
          },
          {
            "who": "リン",
            "role": "a",
            "text": "ええ、どうぞ。{土曜日|どようび}の{六時|ろくじ}からです。{公園|こうえん}でありますよ。",
            "ro": "Ee, douzo. Doyoubi no rokuji kara desu. Kouen de arimasu yo.",
            "vi": "Ừ, đây. Từ 6 giờ thứ Bảy. Diễn ở công viên đấy."
          },
          {
            "who": "アンナ",
            "role": "b",
            "text": "{六時|ろくじ}ですね。じゃあ、{五時|ごじ}に{駅|えき}で{会|あ}いましょう。",
            "ro": "Rokuji desu ne. Jaa, goji ni eki de aimashou.",
            "vi": "6 giờ nhỉ. Vậy 5 giờ gặp ở ga nhé."
          },
          {
            "who": "リン",
            "role": "a",
            "text": "そうしましょう。",
            "ro": "Soushimashou.",
            "vi": "Ừ, cứ vậy nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-ht4-hieu",
        "title": "Hội thoại 4 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Anna đã mua vé chưa?",
            "options": [
              "Anna không có tiền",
              "Anna không thích hoà nhạc",
              "Chưa",
              "Rồi"
            ],
            "correct": 2,
            "why": "いいえ、まだです."
          },
          {
            "q": "Rin có mấy vé?",
            "options": [
              "1 vé",
              "Không có vé",
              "2 vé",
              "3 vé"
            ],
            "correct": 2,
            "why": "二枚 あります."
          },
          {
            "q": "Buổi hoà nhạc diễn ra ở đâu?",
            "options": [
              "Ở nhà Rin",
              "Ở công viên",
              "Ở rạp phim",
              "Ở trường đại học"
            ],
            "correct": 1,
            "why": "公園で あります."
          },
          {
            "q": "Buổi hoà nhạc bắt đầu lúc mấy giờ?",
            "options": [
              "5 giờ Chủ nhật",
              "6 giờ Chủ nhật",
              "6 giờ thứ Bảy",
              "5 giờ thứ Bảy"
            ],
            "correct": 2,
            "why": "土曜日の六時から."
          },
          {
            "q": "Họ hẹn gặp nhau lúc mấy giờ, ở đâu?",
            "options": [
              "6 giờ ở công viên",
              "5 giờ ở công viên",
              "6 giờ ở ga",
              "5 giờ ở ga"
            ],
            "correct": 3,
            "why": "五時に駅で会いましょう."
          },
          {
            "q": "Chữ よ trong 「二枚ありますよ」 có tác dụng gì?",
            "options": [
              "Hỏi Anna có muốn vé không",
              "Từ chối Anna",
              "Báo cho Anna biết Rin có hai vé",
              "Xin Anna đồng ý"
            ],
            "correct": 2,
            "why": "よ = báo cho biết."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-ht4-dien",
        "title": "Hội thoại 4 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "アンナ：いいえ、＿＿です。　〔Anna:iie, __ desu.〕",
            "answers": [
              "まだ"
            ],
            "hint": "Chưa"
          },
          {
            "q": "リン：{私|わたし}は＿＿{買|か}いました。　〔Rin:watashi wa __ kaimashita.〕",
            "answers": [
              "もう"
            ],
            "hint": "Rồi"
          },
          {
            "q": "リン：{公園|こうえん}＿＿ありますよ。　〔Rin:kouen__ arimasu yo.〕",
            "answers": [
              "で"
            ],
            "hint": "Nơi sự kiện"
          },
          {
            "q": "アンナ：{五時|ごじ}に{駅|えき}で{会|あ}い＿＿。　〔Anna:goji ni eki de ai__.〕",
            "answers": [
              "ましょう"
            ],
            "hint": "Hẹn"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-ht4-sx",
        "title": "Hội thoại 4 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi đã mua chưa → chưa → mình có vé → hẹn giờ.",
            "chips": [
              "{私|わたし}はもう{買|か}いました。{二枚|にまい}ありますよ。",
              "いいえ、まだです。",
              "アンナさん、もうチケットを{買|か}いましたか。",
              "{五時|ごじ}に{駅|えき}で{会|あ}いましょう。"
            ],
            "answer": [
              "アンナさん、もうチケットを{買|か}いましたか。",
              "いいえ、まだです。",
              "{私|わたし}はもう{買|か}いました。{二枚|にまい}ありますよ。",
              "{五時|ごじ}に{駅|えき}で{会|あ}いましょう。"
            ],
            "ro": "Anna-san, mou chiketto o kaimashita ka. Iie, mada desu. Watashi wa mou kaimashita. Nimai arimasu yo. Goji ni eki de aimashou.."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · Hội thoại 5 dài hơn + tự nói"
      },
      {
        "t": "p",
        "text": "**Tình huống 5.** Wang rủ Marco lái xe ra biển. Hai người thương lượng giờ xuất phát (7 giờ quá sớm, chốt 8 giờ)."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 5 — Wang rủ Marco đi ô tô ra biển",
        "lines": [
          {
            "who": "ワン",
            "role": "a",
            "text": "マルコさん、{日曜日|にちようび}に{一緒|いっしょ}にドライブに{行|い}きませんか。",
            "ro": "Maruko-san, nichiyoubi ni issho ni doraibu ni ikimasen ka.",
            "vi": "Marco, Chủ nhật cùng đi chơi bằng ô tô không?"
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "ドライブですか。いいですね。どこへ{行|い}きますか。",
            "ro": "Doraibu desu ka. Ii desu ne. Doko e ikimasu ka.",
            "vi": "Lái xe đi chơi à? Hay đấy. Đi đâu?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "{海|うみ}はどうですか。ここからちょっと{遠|とお}いですが、きれいですよ。",
            "ro": "Umi wa dou desu ka. Koko kara chotto tooi desu ga, kirei desu yo.",
            "vi": "Biển thì sao? Hơi xa từ đây nhưng đẹp đấy."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{遠|とお}いですか。{何時|なんじ}に{出|で}ますか。",
            "ro": "Tooi desu ka. Nanji ni demasu ka.",
            "vi": "Xa à? Mấy giờ xuất phát?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "{朝|あさ}{七時|しちじ}はどうですか。",
            "ro": "Asa shichiji wa dou desu ka.",
            "vi": "7 giờ sáng thì sao?"
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "ちょっと{早|はや}いですね。{八時|はちじ}はどうですか。",
            "ro": "Chotto hayai desu ne. Hachiji wa dou desu ka.",
            "vi": "Hơi sớm nhỉ. 8 giờ thì sao?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "いいですよ。{八時|はちじ}にマルコさんのうちへ{行|い}きます。",
            "ro": "Ii desu yo. Hachiji ni Maruko-san no uchi e ikimasu.",
            "vi": "Được thôi. 8 giờ mình đến nhà Marco."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "わかりました。ありがとう。",
            "ro": "Wakarimashita. Arigatou.",
            "vi": "Mình hiểu rồi. Cảm ơn."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-ht5-hieu",
        "title": "Hội thoại 5 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Họ định đi đâu?",
            "options": [
              "Lên núi",
              "Đến công viên",
              "Đến Tokyo",
              "Ra biển"
            ],
            "correct": 3,
            "why": "海は どうですか."
          },
          {
            "q": "Điều Marco lo lắng về nơi đó là gì?",
            "options": [
              "Hơi xa",
              "Nhiều người",
              "Không đẹp",
              "Hơi đắt"
            ],
            "correct": 0,
            "why": "遠いですか."
          },
          {
            "q": "Giờ xuất phát Wang đề xuất đầu tiên?",
            "options": [
              "9 giờ sáng",
              "7 giờ sáng",
              "6 giờ sáng",
              "8 giờ sáng"
            ],
            "correct": 1,
            "why": "朝七時は どうですか."
          },
          {
            "q": "「ちょっと早いですね」 của Marco nghĩa là gì?",
            "options": [
              "Đến sớm quá rồi",
              "Hơi muộn quá",
              "Xe chạy nhanh quá",
              "Hơi sớm quá"
            ],
            "correct": 3,
            "why": "早い = sớm (về thời gian)."
          },
          {
            "q": "Giờ cuối cùng họ chốt?",
            "options": [
              "9 giờ",
              "8 giờ",
              "6 giờ",
              "7 giờ"
            ],
            "correct": 1,
            "why": "八時は どうですか → いいですよ."
          },
          {
            "q": "Ai sẽ đến nhà ai?",
            "options": [
              "Cả hai đến biển riêng",
              "Marco đến nhà Wang",
              "Hai người gặp ở ga",
              "Wang đến nhà Marco"
            ],
            "correct": 3,
            "why": "マルコさんの うちへ 行きます (Wang nói)."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b6-ht5-dien",
        "title": "Hội thoại 5 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ワン：{日曜日|にちようび}にドライブ＿＿{行|い}きませんか。　〔Wan:nichiyoubi ni doraibu__ ikimasen ka.〕",
            "answers": [
              "に"
            ],
            "hint": "Mục đích di chuyển"
          },
          {
            "q": "ワン：{朝|あさ}{七時|しちじ}＿＿どうですか。　〔Wan:asa shichiji__ dou desu ka.〕",
            "answers": [
              "は"
            ],
            "hint": "Đề xuất giờ"
          },
          {
            "q": "マルコ：ちょっと{早|はや}いです＿＿。　〔Maruko:chotto hayai desu__.〕",
            "answers": [
              "ね"
            ],
            "hint": "Xin đồng cảm"
          },
          {
            "q": "ワン：きれいです＿＿。　〔Wan:kirei desu__.〕",
            "answers": [
              "よ"
            ],
            "hint": "Báo cho biết"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-ht5-sx",
        "title": "Hội thoại 5 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: rủ → hỏi đi đâu → đề xuất biển → chốt giờ.",
            "chips": [
              "マルコさん、{日曜日|にちようび}にドライブに{行|い}きませんか。",
              "どこへ{行|い}きますか。",
              "{八時|はちじ}はどうですか。",
              "{海|うみ}はどうですか。"
            ],
            "answer": [
              "マルコさん、{日曜日|にちようび}にドライブに{行|い}きませんか。",
              "どこへ{行|い}きますか。",
              "{海|うみ}はどうですか。",
              "{八時|はちじ}はどうですか。"
            ],
            "ro": "Maruko-san, nichiyoubi ni doraibu ni ikimasen ka. Doko e ikimasu ka. Umi wa dou desu ka. Hachiji wa dou desu ka.."
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
          "Bấm nghe cả bài một lần. Che lời của **B**, tự nói vai B, rồi bấm nghe để so. Sau đó đổi vai.",
          "Thay từ: カラオケ → ドライブ／コンサート／買い物; 今晩 → 日曜日／来週; 六時 → 七時／八時."
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 1 — Rủ bạn đi karaoke tối nay (che một vai và tự nói)",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "{今晩|こんばん}、カラオケに{行|い}きませんか。",
            "ro": "Konban, karaoke ni ikimasen ka.",
            "vi": "Tối nay đi karaoke không?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "いいですね。{行|い}きましょう。{何時|なんじ}に{会|あ}いますか。",
            "ro": "Ii desu ne. Ikimashou. Nanji ni aimasu ka.",
            "vi": "Hay đấy. Đi thôi. Mấy giờ gặp?"
          },
          {
            "who": "A",
            "role": "a",
            "text": "{六時|ろくじ}はどうですか。",
            "ro": "Rokuji wa dou desu ka.",
            "vi": "6 giờ thì sao?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{六時|ろくじ}ですね。{駅|えき}で{会|あ}いましょう。",
            "ro": "Rokuji desu ne. Eki de aimashou.",
            "vi": "6 giờ nhỉ. Gặp ở ga nhé."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 2 — Từ chối khéo và đề xuất ngày khác",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "{日曜日|にちようび}、{一緒|いっしょ}に{買|か}い{物|もの}に{行|い}きませんか。",
            "ro": "Nichiyoubi, issho ni kaimono ni ikimasen ka.",
            "vi": "Chủ nhật cùng đi mua sắm không?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "すみません、{日曜日|にちようび}はちょっと……。{約束|やくそく}があります。{土曜日|どようび}はどうですか。",
            "ro": "Sumimasen, nichiyoubi wa chotto.... Yakusoku ga arimasu. Doyoubi wa dou desu ka.",
            "vi": "Xin lỗi, Chủ nhật hơi… Mình có hẹn. Thứ Bảy thì sao?"
          },
          {
            "who": "A",
            "role": "a",
            "text": "{土曜日|どようび}はいいですよ。そうしましょう。",
            "ro": "Doyoubi wa ii desu yo. Soushimashou.",
            "vi": "Thứ Bảy được đấy. Cứ vậy nhé."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 3 — Chọn món bằng so sánh",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "ラーメンとすき{焼|や}きと、どちらが{好|す}きですか。",
            "ro": "Raamen to sukiyaki to, dochira ga suki desu ka.",
            "vi": "Ramen và sukiyaki, bạn thích món nào hơn?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "すき{焼|や}きのほうが{好|す}きです。でも、ラーメンのほうが{安|やす}いですよ。",
            "ro": "Sukiyaki no hou ga suki desu. Demo, raamen no hou ga yasui desu yo.",
            "vi": "Mình thích sukiyaki hơn. Nhưng ramen rẻ hơn đấy."
          },
          {
            "who": "A",
            "role": "a",
            "text": "じゃあ、ラーメンにしましょう。",
            "ro": "Jaa, raamen ni shimashou.",
            "vi": "Vậy ăn ramen nhé."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 4 — Hỏi \"đã … chưa?\"",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "もう{宿題|しゅくだい}をしましたか。",
            "ro": "Mou shukudai o shimashita ka.",
            "vi": "Bạn làm bài tập chưa?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "いいえ、まだです。リンさんは？",
            "ro": "Iie, mada desu. Rin san wa?",
            "vi": "Chưa. Còn Rin?"
          },
          {
            "who": "A",
            "role": "a",
            "text": "{私|わたし}はもうしました。{一緒|いっしょ}に{勉強|べんきょう}しましょう。",
            "ro": "Watashi wa mou shimashita. Issho ni benkyou shimashou.",
            "vi": "Mình làm rồi. Cùng học nhé."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b6-ht-noi",
        "part": "1",
        "questions": [
          "こんばん、 いっしょに カラオケに いきませんか。",
          "こんしゅうの にちようび、 いっしょに えいがを みませんか。",
          "すみません、 あしたは ちょっと ……。 (ことわってください)",
          "ラーメンと やきにくと、 どちらが すきですか。",
          "もう ひるごはんを たべましたか。",
          "らいしゅうの どようび、 なにか ありますか。",
          "なんじに あいますか。 ごじは どうですか。"
        ]
      }
    ]
  },
  {
    "id": "lt-b6-doc-hieu",
    "kind": "reading",
    "title": "Luyện thêm Bài 6 · Đọc hiểu — 4 đoạn dài dần + 4 đoạn KHÔNG furigana (~39 câu)",
    "goal": "Đọc hiểu đoạn văn ngắn về hẹn hò, vé, so sánh quán ăn và lịch tuần: tìm đúng ngày – giờ – nơi – số lượng, phân biệt Đúng/Sai, và đọc đoạn không furigana như đề thi.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đọc **2 lượt**: lượt 1 lướt để biết ai – ở đâu – làm gì; lượt 2 mới tìm chi tiết (giờ, số, giá). Với câu Đúng/Sai, tìm câu trong đoạn rồi so từng chữ (thường sai ở **tuần này/tuần sau, 2 giờ/3 giờ, が/より**).",
          "Mức Dễ có furigana; mức Khó dùng **readkanji** — đọc to trong đầu, bấm xem cách đọc sau. Chỉ dùng chữ Hán đã học đến Bài 6.",
          "Mỗi đoạn có bảng **romaji + nghĩa** từng câu: chỉ mở SAU khi tự đọc xong, để kiểm tra bản thân."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đoạn 1 — ngắn, có furigana"
      },
      {
        "t": "passage",
        "title": "Đoạn 1 — Anna và buổi hoà nhạc",
        "intro": "Đọc chậm từng câu, có furigana. Rồi trả lời 6 câu.",
        "paras": [
          {
            "label": "A",
            "text": "アンナさんは{来週|らいしゅう}の{土曜日|どようび}、{友達|ともだち}とコンサートに{行|い}きます。コンサートは{公園|こうえん}であります。チケットは{一枚|いちまい}{二千円|にせんえん}です。アンナさんはもうチケットを{二枚|にまい}{買|か}いました。コンサートは{六時|ろくじ}からです。"
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
            "en": "アンナさんは{来週|らいしゅう}の{土曜日|どようび}、{友達|ともだち}とコンサートに{行|い}きます。",
            "ro": "Anna-san wa raishuu no doyoubi, tomodachi to konsaato ni ikimasu.",
            "vi": "Anna thứ Bảy tuần sau đi hoà nhạc với bạn."
          },
          {
            "en": "コンサートは{公園|こうえん}であります。",
            "ro": "Konsaato wa kouen de arimasu.",
            "vi": "Buổi hoà nhạc diễn ra ở công viên."
          },
          {
            "en": "チケットは{一枚|いちまい}{二千円|にせんえん}です。",
            "ro": "Chiketto wa ichimai nisen'en desu.",
            "vi": "Một vé giá 2.000 yên."
          },
          {
            "en": "アンナさんはもうチケットを{二枚|にまい}{買|か}いました。",
            "ro": "Anna-san wa mou chiketto o nimai kaimashita.",
            "vi": "Anna đã mua hai vé rồi."
          },
          {
            "en": "コンサートは{六時|ろくじ}からです。",
            "ro": "Konsaato wa rokuji kara desu.",
            "vi": "Buổi hoà nhạc bắt đầu từ 6 giờ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-doc1-q",
        "title": "Đoạn 1 — Đúng/Sai và chọn đáp án (6 câu)",
        "items": [
          {
            "q": "Buổi hoà nhạc diễn ra ở công viên.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 0,
            "why": "公園で あります."
          },
          {
            "q": "Anna chưa mua vé.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "もう 二枚 買いました = đã mua hai vé."
          },
          {
            "q": "Anna đi hoà nhạc một mình.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "友達と 行きます = đi với bạn."
          },
          {
            "q": "Một vé hoà nhạc giá bao nhiêu?",
            "options": [
              "1.000 yên",
              "20.000 yên",
              "2.000 yên",
              "200 yên"
            ],
            "correct": 2,
            "why": "二千円 = にせんえん = 2.000 yên."
          },
          {
            "q": "Anna đã trả tổng cộng bao nhiêu cho vé?",
            "options": [
              "2.000 yên",
              "4.000 yên",
              "8.000 yên",
              "6.000 yên"
            ],
            "correct": 1,
            "why": "2 vé × 2.000 yên = 4.000 yên."
          },
          {
            "q": "Buổi hoà nhạc bắt đầu lúc mấy giờ?",
            "options": [
              "8 giờ",
              "5 giờ",
              "2 giờ",
              "6 giờ"
            ],
            "correct": 3,
            "why": "六時から."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đoạn 2–3 — thư rủ và so sánh quán"
      },
      {
        "t": "passage",
        "title": "Đoạn 2 — Thư rủ đi xem bóng đá",
        "intro": "Park viết cho Rin. Đọc xong tìm: ngày – nơi – giá vé – giờ hẹn.",
        "paras": [
          {
            "label": "A",
            "text": "リンさんへ{来月|らいげつ}の{十日|とおか}、{大学|だいがく}でサッカーの{試合|しあい}があります。{私|わたし}は{友達|ともだち}と{見|み}に{行|い}きます。リンさんも{一緒|いっしょ}に{行|い}きませんか。"
          },
          {
            "label": "B",
            "text": "チケットは{一枚|いちまい}{五百円|ごひゃくえん}です。{試合|しあい}は{午後|ごご}{三時|さんじ}からです。{駅|えき}で{二時|にじ}に{会|あ}いましょう。パク"
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
            "en": "リンさんへ",
            "ro": "Rin-san e",
            "vi": "Gửi Rin,"
          },
          {
            "en": "{来月|らいげつ}の{十日|とおか}、{大学|だいがく}でサッカーの{試合|しあい}があります。",
            "ro": "Raigetsu no tooka, daigaku de sakkaa no shiai ga arimasu.",
            "vi": "Ngày 10 tháng sau, ở trường đại học có trận bóng đá."
          },
          {
            "en": "{私|わたし}は{友達|ともだち}と{見|み}に{行|い}きます。",
            "ro": "Watashi wa tomodachi to mi ni ikimasu.",
            "vi": "Mình đi xem cùng bạn."
          },
          {
            "en": "リンさんも{一緒|いっしょ}に{行|い}きませんか。",
            "ro": "Rin-san mo issho ni ikimasen ka.",
            "vi": "Rin cũng cùng đi không?"
          },
          {
            "en": "チケットは{一枚|いちまい}{五百円|ごひゃくえん}です。",
            "ro": "Chiketto wa ichimai gohyakuen desu.",
            "vi": "Một vé giá 500 yên."
          },
          {
            "en": "{試合|しあい}は{午後|ごご}{三時|さんじ}からです。",
            "ro": "Shiai wa gogo sanji kara desu.",
            "vi": "Trận đấu bắt đầu từ 3 giờ chiều."
          },
          {
            "en": "{駅|えき}で{二時|にじ}に{会|あ}いましょう。",
            "ro": "Eki de niji ni aimashou.",
            "vi": "Hai giờ mình gặp nhau ở ga nhé."
          },
          {
            "en": "パク",
            "ro": "Paku",
            "vi": "Park"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-doc2-q",
        "title": "Đoạn 2 — câu hỏi (6 câu)",
        "items": [
          {
            "q": "Park rủ Rin làm gì?",
            "options": [
              "Đi hoà nhạc",
              "Đi xem phim",
              "Đi xem trận bóng đá",
              "Đi mua sắm"
            ],
            "correct": 2,
            "why": "サッカーの試合を 見に 行きませんか."
          },
          {
            "q": "Trận đấu diễn ra ở đâu?",
            "options": [
              "Ở ga",
              "Ở trường đại học",
              "Ở nhà Park",
              "Ở công viên"
            ],
            "correct": 1,
            "why": "大学で ... 試合が あります."
          },
          {
            "q": "Trận đấu diễn ra vào ngày nào?",
            "options": [
              "Ngày 10 tháng sau",
              "Ngày 10 tháng này",
              "Ngày 1 tháng sau",
              "Ngày 20 tháng sau"
            ],
            "correct": 0,
            "why": "来月の 十日 (とおか)."
          },
          {
            "q": "Một vé giá 500 yên.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 0,
            "why": "五百円."
          },
          {
            "q": "Họ hẹn gặp lúc mấy giờ, ở đâu?",
            "options": [
              "2 giờ ở ga",
              "3 giờ ở đại học",
              "2 giờ ở đại học",
              "3 giờ ở ga"
            ],
            "correct": 0,
            "why": "駅で 二時に 会いましょう."
          },
          {
            "q": "Trận đấu bắt đầu lúc 2 giờ chiều.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "Trận đấu 3 giờ chiều (午後三時); 2 giờ là giờ hẹn gặp."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đoạn 3 — Nhật ký của Marco: hai quán ăn",
        "intro": "So sánh hai quán rồi chọn. Chú ý より, が (nhưng), どちらも.",
        "paras": [
          {
            "label": "A",
            "text": "マルコさんの{日記|にっき}{今日|きょう}は{友達|ともだち}と{晩|ばん}ご{飯|はん}を{食|た}べました。{店|みせ}は{二|ふた}つありました。{一|ひと}つはラーメンの{店|みせ}で、もう{一|ひと}つは{焼|や}き{肉|にく}の{店|みせ}です。"
          },
          {
            "label": "B",
            "text": "ラーメンの{店|みせ}は{駅|えき}から{近|ちか}いですが、{小|ちい}さいです。{焼|や}き{肉|にく}の{店|みせ}は{駅|えき}からちょっと{遠|とお}いですが、{広|ひろ}いです。ラーメンは{焼|や}き{肉|にく}よりずっと{安|やす}いです。{二人|ふたり}はラーメンの{店|みせ}に{行|い}きました。ラーメンはとてもおいしかったです。でも、{来月|らいげつ}は{焼|や}き{肉|にく}を{食|た}べたいです。"
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
            "en": "マルコさんの{日記|にっき}",
            "ro": "Maruko-san no nikki",
            "vi": "Nhật ký của Marco"
          },
          {
            "en": "{今日|きょう}は{友達|ともだち}と{晩|ばん}ご{飯|はん}を{食|た}べました。",
            "ro": "Kyou wa tomodachi to bangohan o tabemashita.",
            "vi": "Hôm nay tôi ăn tối với bạn."
          },
          {
            "en": "{店|みせ}は{二|ふた}つありました。",
            "ro": "Mise wa futatsu arimashita.",
            "vi": "Có hai quán."
          },
          {
            "en": "{一|ひと}つはラーメンの{店|みせ}で、もう{一|ひと}つは{焼|や}き{肉|にく}の{店|みせ}です。",
            "ro": "Hitotsu wa raamen no mise de, mou hitotsu wa yakiniku no mise desu.",
            "vi": "Một quán là quán ramen, quán còn lại là quán thịt nướng."
          },
          {
            "en": "ラーメンの{店|みせ}は{駅|えき}から{近|ちか}いですが、{小|ちい}さいです。",
            "ro": "Raamen no mise wa eki kara chikai desu ga, chiisai desu.",
            "vi": "Quán ramen gần ga nhưng nhỏ."
          },
          {
            "en": "{焼|や}き{肉|にく}の{店|みせ}は{駅|えき}からちょっと{遠|とお}いですが、{広|ひろ}いです。",
            "ro": "Yakiniku no mise wa eki kara chotto tooi desu ga, hiroi desu.",
            "vi": "Quán thịt nướng hơi xa ga nhưng rộng."
          },
          {
            "en": "ラーメンは{焼|や}き{肉|にく}よりずっと{安|やす}いです。",
            "ro": "Raamen wa yakiniku yori zutto yasui desu.",
            "vi": "Ramen rẻ hơn thịt nướng nhiều."
          },
          {
            "en": "{二人|ふたり}はラーメンの{店|みせ}に{行|い}きました。",
            "ro": "Futari wa raamen no mise ni ikimashita.",
            "vi": "Hai người đã đến quán ramen."
          },
          {
            "en": "ラーメンはとてもおいしかったです。",
            "ro": "Raamen wa totemo oishikatta desu.",
            "vi": "Ramen rất ngon."
          },
          {
            "en": "でも、{来月|らいげつ}は{焼|や}き{肉|にく}を{食|た}べたいです。",
            "ro": "Demo, raigetsu wa yakiniku o tabetai desu.",
            "vi": "Nhưng tháng sau tôi muốn ăn thịt nướng."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-doc3-q",
        "title": "Đoạn 3 — câu hỏi (7 câu)",
        "items": [
          {
            "q": "Quán nào gần ga hơn?",
            "options": [
              "Quán ramen",
              "Hai quán như nhau",
              "Quán thịt nướng",
              "Không có thông tin"
            ],
            "correct": 0,
            "why": "ラーメンの 店は 駅から 近い."
          },
          {
            "q": "Quán nào rộng hơn?",
            "options": [
              "Quán ramen",
              "Hai quán như nhau",
              "Không có thông tin",
              "Quán thịt nướng"
            ],
            "correct": 3,
            "why": "焼き肉の 店は 広い."
          },
          {
            "q": "Món nào rẻ hơn?",
            "options": [
              "Bằng nhau",
              "Không có thông tin",
              "Ramen",
              "Thịt nướng"
            ],
            "correct": 2,
            "why": "ラーメンは 焼き肉より ずっと 安い."
          },
          {
            "q": "Hai người đã ăn thịt nướng hôm nay.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "Họ đến quán ramen."
          },
          {
            "q": "Marco muốn làm gì vào tháng sau?",
            "options": [
              "Ăn thịt nướng",
              "Đi karaoke",
              "Ăn ramen lần nữa",
              "Đi xem phim"
            ],
            "correct": 0,
            "why": "来月は 焼き肉を 食べたいです."
          },
          {
            "q": "Quán ramen vừa gần ga vừa to.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "近いですが、小さいです = gần nhưng nhỏ."
          },
          {
            "q": "Chữ 「が」 trong 「近いですが、小さいです」 có nghĩa gì?",
            "options": [
              "Để",
              "Và",
              "Nhưng",
              "Vì"
            ],
            "correct": 2,
            "why": "です + が = nhưng (đối lập)."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đoạn 4 dài + đoạn không furigana"
      },
      {
        "t": "passage",
        "title": "Đoạn 4 — Lịch trong tuần của Rin",
        "intro": "Đoạn dài hơn, nhiều giờ và nhiều ngày. Gạch chân thứ – giờ – việc khi đọc.",
        "paras": [
          {
            "label": "A",
            "text": "リンさんの{今週|こんしゅう}のよてい（{計画|けいかく}）です。{月曜日|げつようび}は{午前|ごぜん}{九時|くじ}から{午後|ごご}{四時|よじ}まで{学校|がっこう}です。{火曜日|かようび}は{学校|がっこう}のあとで、{友達|ともだち}とラーメンを{食|た}べます。{水曜日|すいようび}はアルバイトがあります。{木曜日|もくようび}は{何|なに}もありません。"
          },
          {
            "label": "B",
            "text": "{金曜日|きんようび}の{晩|ばん}{七時|しちじ}に{大学|だいがく}でコンサートがあります。チケットはもう{買|か}いました。{土曜日|どようび}は{山田|やまだ}さんとドライブに{行|い}きます。{日曜日|にちようび}はうちで{休|やす}みます。{来週|らいしゅう}の{月曜日|げつようび}は{日本語|にほんご}のテストがあります。ですから、{日曜日|にちようび}にすこし{勉強|べんきょう}します。"
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
            "en": "リンさんの{今週|こんしゅう}のよてい（{計画|けいかく}）です。",
            "ro": "Rin-san no konshuu no yotei(keikaku) desu.",
            "vi": "Kế hoạch tuần này của Rin."
          },
          {
            "en": "{月曜日|げつようび}は{午前|ごぜん}{九時|くじ}から{午後|ごご}{四時|よじ}まで{学校|がっこう}です。",
            "ro": "Getsuyoubi wa gozen kuji kara gogo yoji made gakkou desu.",
            "vi": "Thứ Hai ở trường từ 9 giờ sáng đến 4 giờ chiều."
          },
          {
            "en": "{火曜日|かようび}は{学校|がっこう}のあとで、{友達|ともだち}とラーメンを{食|た}べます。",
            "ro": "Kayoubi wa gakkou no ato de, tomodachi to raamen o tabemasu.",
            "vi": "Thứ Ba sau giờ học, đi ăn ramen với bạn."
          },
          {
            "en": "{水曜日|すいようび}はアルバイトがあります。",
            "ro": "Suiyoubi wa arubaito ga arimasu.",
            "vi": "Thứ Tư có việc làm thêm."
          },
          {
            "en": "{木曜日|もくようび}は{何|なに}もありません。",
            "ro": "Mokuyoubi wa nani mo arimasen.",
            "vi": "Thứ Năm không có gì cả."
          },
          {
            "en": "{金曜日|きんようび}の{晩|ばん}{七時|しちじ}に{大学|だいがく}でコンサートがあります。",
            "ro": "Kin'youbi no ban shichiji ni daigaku de konsaato ga arimasu.",
            "vi": "Tối thứ Sáu 7 giờ có hoà nhạc ở trường đại học."
          },
          {
            "en": "チケットはもう{買|か}いました。",
            "ro": "Chiketto wa mou kaimashita.",
            "vi": "Vé thì Rin đã mua rồi."
          },
          {
            "en": "{土曜日|どようび}は{山田|やまだ}さんとドライブに{行|い}きます。",
            "ro": "Doyoubi wa yamadasan to doraibu ni ikimasu.",
            "vi": "Thứ Bảy đi lái xe chơi với anh Yamada."
          },
          {
            "en": "{日曜日|にちようび}はうちで{休|やす}みます。",
            "ro": "Nichiyoubi wa uchi de yasumimasu.",
            "vi": "Chủ nhật nghỉ ở nhà."
          },
          {
            "en": "{来週|らいしゅう}の{月曜日|げつようび}は{日本語|にほんご}のテストがあります。",
            "ro": "Raishuu no getsuyoubi wa nihongo no tesuto ga arimasu.",
            "vi": "Thứ Hai tuần sau có bài kiểm tra tiếng Nhật."
          },
          {
            "en": "ですから、{日曜日|にちようび}にすこし{勉強|べんきょう}します。",
            "ro": "Desu kara, nichiyoubi ni sukoshi benkyou shimasu.",
            "vi": "Vì vậy Chủ nhật sẽ học một chút."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-doc4-q",
        "title": "Đoạn 4 — câu hỏi (8 câu)",
        "items": [
          {
            "q": "Thứ Tư Rin làm gì?",
            "options": [
              "Đi học cả ngày",
              "Đi lái xe",
              "Làm thêm",
              "Xem hoà nhạc"
            ],
            "correct": 2,
            "why": "アルバイト が あります."
          },
          {
            "q": "Ngày nào Rin không có kế hoạch gì?",
            "options": [
              "Chủ nhật",
              "Thứ Hai",
              "Thứ Ba",
              "Thứ Năm"
            ],
            "correct": 3,
            "why": "木曜日は 何も ありません."
          },
          {
            "q": "Rin chưa mua vé hoà nhạc.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "チケットは もう 買いました."
          },
          {
            "q": "Thứ Bảy Rin đi với ai?",
            "options": [
              "Marco",
              "Anh Yamada",
              "Bạn học",
              "Anna"
            ],
            "correct": 1,
            "why": "山田さんと ドライブに 行きます."
          },
          {
            "q": "Hoà nhạc diễn ra vào lúc nào, ở đâu?",
            "options": [
              "Chiều thứ Sáu 7 giờ, ở đại học",
              "Tối thứ Sáu 7 giờ, ở đại học",
              "Tối thứ Sáu 7 giờ, ở công viên",
              "Tối thứ Bảy 7 giờ, ở đại học"
            ],
            "correct": 1,
            "why": "金曜日の 晩 七時に 大学で."
          },
          {
            "q": "Thứ Hai ở trường từ mấy giờ đến mấy giờ?",
            "options": [
              "9 giờ sáng đến 4 giờ chiều",
              "4 giờ sáng đến 9 giờ chiều",
              "9 giờ tối đến 4 giờ sáng",
              "9 giờ sáng đến 4 giờ sáng"
            ],
            "correct": 0,
            "why": "午前 九時 から 午後 四時 まで."
          },
          {
            "q": "Vì sao Chủ nhật Rin học một chút?",
            "options": [
              "Vì Chủ nhật có hẹn",
              "Vì thứ Tư có kiểm tra",
              "Vì thứ Hai có hoà nhạc",
              "Vì thứ Hai tuần sau có kiểm tra tiếng Nhật"
            ],
            "correct": 3,
            "why": "テスト が あります から、 すこし 勉強."
          },
          {
            "q": "Chủ nhật Rin ra ngoài chơi cả ngày.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "うちで 休みます = nghỉ ở nhà."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b6-doc-rk",
        "title": "Đọc to 4 đoạn KHÔNG furigana, rồi bấm xem (4 đoạn)",
        "note": "Đọc cả câu to, kể cả hiragana. Sau đó làm 8 câu hỏi bên dưới.",
        "items": [
          {
            "text": "{来週|らいしゅう}の{火曜日|かようび}、{会社|かいしゃ}でかいぎがあります。{九時|くじ}から{十一時|じゅういちじ}までです。{私|わたし}は{午前|ごぜん}{八時|はちじ}に{会社|かいしゃ}に{行|い}きます。",
            "ro": "Raishuu no kayoubi, kaisha de kaigi ga arimasu. Kuji kara juuichiji made desu. Watashi wa gozen hachiji ni kaisha ni ikimasu.",
            "vi": "Thứ Ba tuần sau ở công ty có cuộc họp, từ 9 giờ đến 11 giờ. Tôi sẽ đến công ty lúc 8 giờ sáng."
          },
          {
            "text": "{先生|せんせい}は{来月|らいげつ}、{日本|にほん}へ{行|い}きます。{私|わたし}も{日本|にほん}へ{行|い}きたいです。{今週|こんしゅう}の{金曜日|きんようび}に{先生|せんせい}と{話|はな}します。",
            "ro": "Sensei wa raigetsu, nihon e ikimasu. Watashi mo nihon e ikitai desu. Konshuu no kin'youbi ni sensei to hanashimasu.",
            "vi": "Tháng sau cô sẽ sang Nhật. Tôi cũng muốn sang Nhật. Thứ Sáu tuần này tôi sẽ nói chuyện với cô."
          },
          {
            "text": "{毎朝|まいあさ}、{本|ほん}を{読|よ}みます。{先週|せんしゅう}の{金曜日|きんようび}、ともだちにてがみを{書|か}きました。{今晩|こんばん}、でんわをします。",
            "ro": "Maiasa, hon o yomimasu. Senshuu no kin'youbi, tomodachi ni tegami o kakimashita. Konban, denwa o shimasu.",
            "vi": "Mỗi sáng tôi đọc sách. Thứ Sáu tuần trước tôi đã viết thư cho bạn. Tối nay tôi sẽ gọi điện."
          },
          {
            "text": "{日曜日|にちようび}の{午後|ごご}、えきのまえでコンサートがあります。{五時|ごじ}から{七時|しちじ}までです。チケットはいちまい{千円|せんえん}です。ふたりで{行|い}きましょう。",
            "ro": "Nichiyoubi no gogo, eki no mae de konsaato ga arimasu. Goji kara shichiji made desu. Chiketto wa ichimai sen'en desu. Futari de ikimashou.",
            "vi": "Chiều Chủ nhật có hoà nhạc trước ga, từ 5 giờ đến 7 giờ. Vé 1.000 yên một tấm. Hai người cùng đi nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-doc-rk-q",
        "title": "Câu hỏi về 4 đoạn không furigana (8 câu)",
        "items": [
          {
            "q": "(Đoạn 1) Cuộc họp bắt đầu lúc mấy giờ?",
            "options": [
              "11 giờ",
              "10 giờ",
              "8 giờ",
              "9 giờ"
            ],
            "correct": 3,
            "why": "九時から 十一時まで; 八時 là giờ đến công ty."
          },
          {
            "q": "(Đoạn 1) Người viết đến công ty lúc nào?",
            "options": [
              "8 giờ sáng",
              "9 giờ sáng",
              "11 giờ sáng",
              "8 giờ tối"
            ],
            "correct": 0,
            "why": "午前 八時に 会社に 行きます."
          },
          {
            "q": "(Đoạn 2) Ai sắp sang Nhật?",
            "options": [
              "Không ai",
              "Cô giáo (và người viết cũng muốn)",
              "Chỉ người viết",
              "Bạn của người viết"
            ],
            "correct": 1,
            "why": "先生は 来月 日本へ 行きます; 私も 行きたい."
          },
          {
            "q": "(Đoạn 2) Người viết nói chuyện với cô vào thứ Sáu tuần này.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 0,
            "why": "今週の 金曜日に 先生と 話します."
          },
          {
            "q": "(Đoạn 3) Người viết viết thư vào lúc nào?",
            "options": [
              "Thứ Sáu tuần sau",
              "Tối nay",
              "Thứ Sáu tuần này",
              "Thứ Sáu tuần trước"
            ],
            "correct": 3,
            "why": "先週の 金曜日."
          },
          {
            "q": "(Đoạn 3) Tối nay người viết làm gì?",
            "options": [
              "Đọc sách",
              "Viết thư",
              "Gọi điện",
              "Gặp bạn"
            ],
            "correct": 2,
            "why": "今晩、 電話を します."
          },
          {
            "q": "(Đoạn 4) Buổi hoà nhạc diễn ra từ mấy giờ đến mấy giờ?",
            "options": [
              "7 giờ đến 9 giờ",
              "1 giờ đến 5 giờ",
              "5 giờ đến 7 giờ",
              "5 giờ đến 9 giờ"
            ],
            "correct": 2,
            "why": "五時から 七時まで."
          },
          {
            "q": "(Đoạn 4) Hai vé giá bao nhiêu?",
            "options": [
              "500 yên",
              "2.000 yên",
              "3.000 yên",
              "1.000 yên"
            ],
            "correct": 1,
            "why": "千円 × 2 = 2.000 yên."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b6-nghe",
    "kind": "listening",
    "title": "Luyện thêm Bài 6 · Nghe — nhận lời/từ chối → số và giờ → đổi ý, bẫy (17 đoạn, ~41 câu)",
    "goal": "Nghe ra nhận lời hay từ chối, ghi đúng số vé – giá – giờ – nơi, so sánh được, và không bị lừa khi người nói đổi ý hay đính chính.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Nghe **2 lần**: lần 1 chỉ bắt ý chính (ai rủ ai – nhận hay từ chối); lần 2 ghi số/giờ/nơi. Xong mới mở lời thoại + romaji để kiểm.",
          "Bẫy quen thuộc: **ちょっと……** = đã từ chối, thông tin sau đó mới là thông tin chốt; số bị **đính chính** (「ごひゃくえん」→「いいえ、はっぴゃくえん」); nhiều người nói thì **đếm đúng ai đi, ai không**.",
          "Luyện 3 vòng: (1) nghe cả bài không xem chữ, (2) vừa nghe vừa xem chữ Nhật, (3) nghe lại, tự đọc theo (shadowing) — rất tốt cho thi nói."
        ]
      },
      {
        "t": "recap",
        "title": "Từ khoá cần bắt tai",
        "items": [
          "**Nhận lời**: いいですね · ～ましょう · ぜひ · そうしましょう. **Từ chối**: ちょっと…… · すみません · 用事／約束が あります から.",
          "**Chốt thông tin**: ～ですね (xác nhận) · わかりました · そうしましょう — luôn lấy thông tin SAU CÙNG.",
          "**Số cần thuộc**: ～枚 (いちまい・にまい・さんまい…) · giờ (にじ・よじ・しちじ・くじ) · tiền (ごひゃくえん・はっぴゃくえん・せん・にせんごひゃくえん)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · chậm, đơn giản — ○ hay ×"
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-1a",
        "title": "① (chậm)",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "アンナさん、{日曜日|にちようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}ませんか。",
            "ro": "Anna-san, nichiyoubi, issho ni eiga o mimasen ka.",
            "vi": "Anna, Chủ nhật cùng xem phim không?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "いいですね。{見|み}ましょう。",
            "ro": "Ii desu ne. Mimashou.",
            "vi": "Hay đấy. Xem thôi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-1b",
        "title": "② (chậm)",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "リンさん、{今晩|こんばん}、カラオケに{行|い}きませんか。",
            "ro": "Rin-san, konban, karaoke ni ikimasen ka.",
            "vi": "Rin, tối nay đi karaoke không?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "すみません、{今晩|こんばん}はちょっと……。",
            "ro": "Sumimasen, konban wa chotto....",
            "vi": "Xin lỗi, tối nay hơi…"
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-1c",
        "title": "③",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "マルコさん、{明日|あした}、{一緒|いっしょ}にドライブに{行|い}きませんか。",
            "ro": "Maruko-san, ashita, issho ni doraibu ni ikimasen ka.",
            "vi": "Marco, mai cùng đi lái xe chơi không?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "ドライブですか。{明日|あした}は{用事|ようじ}がありますから、ちょっと……。",
            "ro": "Doraibu desu ka. Ashita wa youji ga arimasu kara, chotto....",
            "vi": "Lái xe à? Mai mình có việc bận nên hơi…"
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-1d",
        "title": "④",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "パクさん、{土曜日|どようび}、テニスをしませんか。",
            "ro": "Paku-san, doyoubi, tenisu o shimasen ka.",
            "vi": "Park, thứ Bảy chơi tennis không?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "ええ、ぜひ。しましょう。",
            "ro": "Ee, zehi. Shimashou.",
            "vi": "Ừ, nhất định. Chơi thôi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-1e",
        "title": "⑤",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "ワンさん、{来週|らいしゅう}の{火曜日|かようび}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。",
            "ro": "Wan-san, raishuu no kayoubi, issho ni gohan o tabemasen ka.",
            "vi": "Wang, thứ Ba tuần sau cùng ăn cơm không?"
          },
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "いいですね。{火曜日|かようび}はひまです。{食|た}べましょう。",
            "ro": "Ii desu ne. Kayoubi wa hima desu. Tabemashou.",
            "vi": "Hay đấy. Thứ Ba mình rảnh. Ăn thôi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-ng-1-q",
        "title": "Câu hỏi ①–⑤ (8 câu)",
        "items": [
          {
            "q": "① Anna nhận lời hay từ chối?",
            "options": [
              "○ nhận lời",
              "× từ chối"
            ],
            "correct": 0,
            "why": "いいですね。見ましょう = nhận lời."
          },
          {
            "q": "② Rin nhận lời hay từ chối?",
            "options": [
              "○ nhận lời",
              "× từ chối"
            ],
            "correct": 1,
            "why": "すみません、ちょっと…… = từ chối khéo."
          },
          {
            "q": "③ Marco nhận lời hay từ chối?",
            "options": [
              "○ nhận lời",
              "× từ chối"
            ],
            "correct": 1,
            "why": "ちょっと…… + 用事が あります = từ chối."
          },
          {
            "q": "④ Park nhận lời hay từ chối?",
            "options": [
              "○ nhận lời",
              "× từ chối"
            ],
            "correct": 0,
            "why": "ええ、ぜひ。しましょう = nhận lời."
          },
          {
            "q": "⑤ Wang nhận lời hay từ chối?",
            "options": [
              "○ nhận lời",
              "× từ chối"
            ],
            "correct": 0,
            "why": "いいですね…食べましょう = nhận lời."
          },
          {
            "q": "③ Vì sao Marco từ chối?",
            "options": [
              "Xe bị hỏng",
              "Ghét lái xe",
              "Đã có hẹn với Daniel",
              "Ngày mai có việc bận"
            ],
            "correct": 3,
            "why": "用事が あります から."
          },
          {
            "q": "④ Park và Anna sẽ chơi môn gì?",
            "options": [
              "Tennis",
              "Bóng đá",
              "Bóng bàn",
              "Bóng chày"
            ],
            "correct": 0,
            "why": "テニスを しませんか."
          },
          {
            "q": "⑤ Hai người đi ăn vào ngày nào?",
            "options": [
              "Thứ Ba tuần sau",
              "Thứ Ba tuần này",
              "Thứ Tư tuần sau",
              "Thứ Hai tuần sau"
            ],
            "correct": 0,
            "why": "来週の 火曜日."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · số vé, giờ, so sánh"
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-2a",
        "title": "⑥ Số vé và giá",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "コンサートのチケットは{何枚|なんまい}ありますか。",
            "ro": "Konsaato no chiketto wa nanmai arimasu ka.",
            "vi": "Bạn có mấy vé hoà nhạc?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{三枚|さんまい}あります。{一枚|いちまい}{二千円|にせんえん}です。",
            "ro": "Sanmai arimasu. Ichimai nisen'en desu.",
            "vi": "Mình có 3 vé. Một vé 2.000 yên."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-2b",
        "title": "⑦ Giờ bắt đầu và giờ hẹn",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "ワンさん、{何時|なんじ}からですか。",
            "ro": "Wan-san, nanji kara desu ka.",
            "vi": "Wang, mấy giờ bắt đầu?"
          },
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "{午後|ごご}{六時|ろくじ}からです。{五時|ごじ}に{駅|えき}で{会|あ}いましょう。",
            "ro": "Gogo rokuji kara desu. Goji ni eki de aimashou.",
            "vi": "Từ 6 giờ chiều. 5 giờ gặp ở ga nhé."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-3a",
        "title": "⑧ So sánh: nhanh hơn / rẻ hơn",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{電車|でんしゃ}とバスと、どちらが{早|はや}いですか。",
            "ro": "Densha to basu to, dochira ga hayai desu ka.",
            "vi": "Tàu điện và xe buýt, cái nào nhanh hơn?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{電車|でんしゃ}のほうが{早|はや}いです。でも、バスのほうが{安|やす}いですよ。",
            "ro": "Densha no hou ga hayai desu. Demo, basu no hou ga yasui desu yo.",
            "vi": "Tàu điện nhanh hơn. Nhưng xe buýt rẻ hơn đấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-3b",
        "title": "⑨ Mùa nào được thích hơn?",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{季節|きせつ}でいつがいちばん{好|す}きですか。",
            "ro": "Kisetsu de itsu ga ichiban suki desu ka.",
            "vi": "Trong các mùa, bạn thích mùa nào nhất?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{春|はる}がいちばん{好|す}きです。{夏|なつ}より{秋|あき}のほうが{好|す}きです。",
            "ro": "Haru ga ichiban suki desu. Natsu yori aki no hou ga suki desu.",
            "vi": "Mình thích mùa xuân nhất. Mùa thu thì thích hơn mùa hè."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-ng-2-q",
        "title": "Câu hỏi ⑥–⑨ (9 câu)",
        "items": [
          {
            "q": "⑥ Người nói có mấy vé?",
            "options": [
              "1 vé",
              "2 vé",
              "4 vé",
              "3 vé"
            ],
            "correct": 3,
            "why": "三枚 (さんまい)."
          },
          {
            "q": "⑥ Một vé giá bao nhiêu?",
            "options": [
              "200 yên",
              "3.000 yên",
              "2.000 yên",
              "1.000 yên"
            ],
            "correct": 2,
            "why": "二千円 (にせんえん)."
          },
          {
            "q": "⑥ Nếu mua cả 3 vé thì tổng bao nhiêu?",
            "options": [
              "5.000 yên",
              "6.000 yên",
              "9.000 yên",
              "2.000 yên"
            ],
            "correct": 1,
            "why": "3 × 2.000 = 6.000."
          },
          {
            "q": "⑦ Sự kiện bắt đầu lúc mấy giờ?",
            "options": [
              "5 giờ chiều",
              "6 giờ chiều",
              "6 giờ sáng",
              "7 giờ chiều"
            ],
            "correct": 1,
            "why": "午後 六時 から."
          },
          {
            "q": "⑦ Họ hẹn gặp lúc mấy giờ, ở đâu?",
            "options": [
              "6 giờ ở nơi sự kiện",
              "6 giờ ở ga",
              "5 giờ ở ga",
              "5 giờ ở nơi sự kiện"
            ],
            "correct": 2,
            "why": "五時に 駅で."
          },
          {
            "q": "⑧ Cái nào nhanh hơn?",
            "options": [
              "Tàu điện",
              "Như nhau",
              "Không nói",
              "Xe buýt"
            ],
            "correct": 0,
            "why": "電車の ほうが 早い."
          },
          {
            "q": "⑧ Cái nào rẻ hơn?",
            "options": [
              "Xe buýt",
              "Không nói",
              "Tàu điện",
              "Như nhau"
            ],
            "correct": 0,
            "why": "バスの ほうが 安い."
          },
          {
            "q": "⑨ Anna thích mùa nào nhất?",
            "options": [
              "Mùa hè",
              "Mùa xuân",
              "Mùa đông",
              "Mùa thu"
            ],
            "correct": 1,
            "why": "春が いちばん 好き."
          },
          {
            "q": "⑨ Giữa mùa hè và mùa thu, Anna thích mùa nào hơn?",
            "options": [
              "Mùa thu",
              "Không thích mùa nào",
              "Mùa hè",
              "Thích như nhau"
            ],
            "correct": 0,
            "why": "夏より 秋の ほうが 好き."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đổi ý, đính chính, nhiều người — như phần nghe khó của đề"
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-4a",
        "title": "⑩ Bẫy giờ: đổi ý",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{土曜日|どようび}の{三時|さんじ}はどうですか。",
            "ro": "Doyoubi no sanji wa dou desu ka.",
            "vi": "3 giờ thứ Bảy thì sao?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{三時|さんじ}はちょっと……。{四時|よじ}はどうですか。",
            "ro": "Sanji wa chotto.... Yoji wa dou desu ka.",
            "vi": "3 giờ hơi khó. 4 giờ thì sao?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{四時|よじ}ですね。{駅|えき}で{会|あ}いましょう。",
            "ro": "Yoji desu ne. Eki de aimashou.",
            "vi": "4 giờ nhỉ. Gặp ở ga nhé."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-4b",
        "title": "⑪ Bẫy nơi chốn: đổi ý",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "{映画館|えいがかん}の{前|まえ}で{会|あ}いましょう。",
            "ro": "Eigakan no mae de aimashou.",
            "vi": "Gặp trước rạp phim nhé."
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{映画館|えいがかん}の{前|まえ}は{人|ひと}が{多|おお}いですから、{駅|えき}の{前|まえ}はどうですか。",
            "ro": "Eigakan no mae wa hito ga ooi desu kara, eki no mae wa dou desu ka.",
            "vi": "Trước rạp phim đông người, trước ga thì sao?"
          },
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "いいですよ。{駅|えき}の{前|まえ}ですね。",
            "ro": "Ii desu yo. Eki no mae desu ne.",
            "vi": "Được. Trước ga nhỉ."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-4c",
        "title": "⑫ Bẫy ngày: đổi ý hai lần",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{土曜日|どようび}、{映画|えいが}はどうですか。",
            "ro": "Doyoubi, eiga wa dou desu ka.",
            "vi": "Thứ Bảy xem phim thì sao?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{土曜日|どようび}はちょっと……。{日曜日|にちようび}はどうですか。",
            "ro": "Doyoubi wa chotto.... Nichiyoubi wa dou desu ka.",
            "vi": "Thứ Bảy hơi khó. Chủ nhật thì sao?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{日曜日|にちようび}は{用事|ようじ}があります。{金曜日|きんようび}はどうですか。",
            "ro": "Nichiyoubi wa youji ga arimasu. Kin'youbi wa dou desu ka.",
            "vi": "Chủ nhật mình có việc. Thứ Sáu thì sao?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{金曜日|きんようび}ですね。いいですよ。",
            "ro": "Kin'youbi desu ne. Ii desu yo.",
            "vi": "Thứ Sáu nhỉ. Được đấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-5a",
        "title": "⑬ Đã … chưa?",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "もうチケットを{買|か}いましたか。",
            "ro": "Mou chiketto o kaimashita ka.",
            "vi": "Bạn mua vé chưa?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "いいえ、まだです。{今日|きょう}{買|か}います。",
            "ro": "Iie, mada desu. Kyou kaimasu.",
            "vi": "Chưa. Hôm nay mình mua."
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{私|わたし}はもう{買|か}いました。{二枚|にまい}ありますよ。",
            "ro": "Watashi wa mou kaimashita. Nimai arimasu yo.",
            "vi": "Mình mua rồi. Mình có hai vé đấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-5b",
        "title": "⑭ Ai xong rồi, ai chưa?",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "リンさん、もう{宿題|しゅくだい}をしましたか。",
            "ro": "Rin-san, mou shukudai o shimashita ka.",
            "vi": "Rin, bạn làm bài tập chưa?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "いいえ、まだです。ワンさんは？",
            "ro": "Iie, mada desu. Wan-san wa?",
            "vi": "Chưa. Còn Wang?"
          },
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "{私|わたし}はもうしました。{昨日|きのう}しました。",
            "ro": "Watashi wa mou shimashita. Kinou shimashita.",
            "vi": "Mình làm rồi. Mình làm hôm qua."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-6",
        "title": "⑮ Bẫy giá",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "ラーメンは{五百円|ごひゃくえん}ですか。",
            "ro": "Raamen wa gohyakuen desu ka.",
            "vi": "Ramen 500 yên phải không?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "いいえ、{八百円|はっぴゃくえん}です。すき{焼|や}きは{二千五百円|にせんごひゃくえん}、{焼|や}き{肉|にく}は{三千円|さんぜんえん}です。",
            "ro": "Iie, happyakuen desu. Sukiyaki wa nisengohyakuen, yakiniku wa sanzen'en desu.",
            "vi": "Không, 800 yên. Sukiyaki 2.500 yên, thịt nướng 3.000 yên."
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "じゃあ、ラーメンにします。",
            "ro": "Jaa, raamen ni shimasu.",
            "vi": "Vậy mình chọn ramen."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-7",
        "title": "⑯ Nhiều người, nhiều thông tin",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{今度|こんど}の{日曜日|にちようび}、{公園|こうえん}で{花火|はなび}があります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。",
            "ro": "Kondo no nichiyoubi, kouen de hanabi ga arimasu. Issho ni mi ni ikimasen ka.",
            "vi": "Chủ nhật tới ở công viên có pháo hoa. Cùng đi xem không?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "いいですね。{何時|なんじ}からですか。",
            "ro": "Ii desu ne. Nanji kara desu ka.",
            "vi": "Hay đấy. Mấy giờ bắt đầu?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{晩|ばん}{七時|しちじ}からです。",
            "ro": "Ban shichiji kara desu.",
            "vi": "Từ 7 giờ tối."
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "すみません、{私|わたし}はちょっと……。ワンさんは？",
            "ro": "Sumimasen, watashi wa chotto.... Wan-san wa?",
            "vi": "Xin lỗi, mình hơi… Wang thì sao?"
          },
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "{私|わたし}は{行|い}きます。{五時|ごじ}に{駅|えき}で{会|あ}いましょう。",
            "ro": "Watashi wa ikimasu. Goji ni eki de aimashou.",
            "vi": "Mình đi. 5 giờ gặp ở ga nhé."
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "わかりました。アンナさんと{私|わたし}とワンさんと、{三人|さんにん}ですね。",
            "ro": "Wakarimashita. Anna-san to watashi to Wan-san to, sannin desu ne.",
            "vi": "Hiểu rồi. Anna, mình và Wang — ba người nhỉ."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b6-ng-8",
        "title": "⑰ Thông báo bằng よ",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{明日|あした}、{日本語|にほんご}のテストがありますよ。",
            "ro": "Ashita, nihongo no tesuto ga arimasu yo.",
            "vi": "Mai có bài kiểm tra tiếng Nhật đấy."
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "そうですか。{何時|なんじ}からですか。",
            "ro": "Sou desu ka. Nanji kara desu ka.",
            "vi": "Vậy à. Mấy giờ bắt đầu?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{九時|くじ}からです。{八時半|はちじはん}に{教室|きょうしつ}で{会|あ}いましょう。",
            "ro": "Kuji kara desu. Hachijihan ni kyoushitsu de aimashou.",
            "vi": "Từ 9 giờ. 8 giờ rưỡi gặp ở lớp nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-ng-3-q",
        "title": "Câu hỏi ⑩–⑰ (18 câu)",
        "items": [
          {
            "q": "⑩ Giờ cuối cùng họ chốt?",
            "options": [
              "2 giờ",
              "4 giờ",
              "3 giờ",
              "5 giờ"
            ],
            "correct": 1,
            "why": "Bẫy: 3 giờ bị từ chối → 4 giờ được chốt (四時ですね)."
          },
          {
            "q": "⑪ Nơi gặp cuối cùng?",
            "options": [
              "Ở nhà Wang",
              "Trước rạp phim",
              "Trong rạp phim",
              "Trước ga"
            ],
            "correct": 3,
            "why": "Trước rạp đông người → đổi thành trước ga."
          },
          {
            "q": "⑪ Vì sao Anna không muốn gặp trước rạp?",
            "options": [
              "Vì đắt",
              "Vì đông người",
              "Vì xa",
              "Vì đóng cửa"
            ],
            "correct": 1,
            "why": "人が 多いですから."
          },
          {
            "q": "⑫ Ngày xem phim cuối cùng?",
            "options": [
              "Thứ Năm",
              "Thứ Sáu",
              "Thứ Bảy",
              "Chủ nhật"
            ],
            "correct": 1,
            "why": "Thứ Bảy bị từ chối, Chủ nhật có việc → Thứ Sáu."
          },
          {
            "q": "⑫ Vì sao Chủ nhật không được?",
            "options": [
              "Rạp đóng cửa",
              "Marco có việc bận",
              "Hết vé",
              "Rin có việc bận"
            ],
            "correct": 1,
            "why": "Marco nói 日曜日は用事があります."
          },
          {
            "q": "⑬ Park đã mua vé chưa?",
            "options": [
              "Rồi",
              "Chưa, hôm nay sẽ mua",
              "Chưa, ngày mai mua",
              "Không mua"
            ],
            "correct": 1,
            "why": "まだです。今日買います."
          },
          {
            "q": "⑬ Anna có mấy vé?",
            "options": [
              "Chưa có vé",
              "3 vé",
              "2 vé",
              "1 vé"
            ],
            "correct": 2,
            "why": "二枚."
          },
          {
            "q": "⑭ Ai đã làm xong bài tập?",
            "options": [
              "Rin",
              "Cả hai",
              "Wang",
              "Không ai"
            ],
            "correct": 2,
            "why": "ワン: もう しました."
          },
          {
            "q": "⑭ Wang làm bài tập khi nào?",
            "options": [
              "Sáng nay",
              "Hôm nay",
              "Hôm qua",
              "Tuần trước"
            ],
            "correct": 2,
            "why": "昨日 しました."
          },
          {
            "q": "⑮ Giá ramen thật là bao nhiêu?",
            "options": [
              "3.000 yên",
              "2.500 yên",
              "800 yên",
              "500 yên"
            ],
            "correct": 2,
            "why": "Bẫy: 500 là Marco đoán sai; Rin đính chính 八百円."
          },
          {
            "q": "⑮ Món nào đắt nhất?",
            "options": [
              "Không biết",
              "Ramen",
              "Sukiyaki",
              "Thịt nướng"
            ],
            "correct": 3,
            "why": "焼き肉 3.000 yên."
          },
          {
            "q": "⑮ Marco chọn gì?",
            "options": [
              "Không chọn",
              "Ramen",
              "Sukiyaki",
              "Thịt nướng"
            ],
            "correct": 1,
            "why": "ラーメンに します."
          },
          {
            "q": "⑯ Pháo hoa bắt đầu lúc nào?",
            "options": [
              "8 giờ tối",
              "7 giờ sáng",
              "7 giờ tối",
              "5 giờ chiều"
            ],
            "correct": 2,
            "why": "晩 七時; 5 giờ là giờ hẹn."
          },
          {
            "q": "⑯ Ai KHÔNG đi?",
            "options": [
              "Park",
              "Wang",
              "Anna",
              "Rin"
            ],
            "correct": 3,
            "why": "リン: 私は ちょっと……"
          },
          {
            "q": "⑯ Có mấy người đi?",
            "options": [
              "3 người",
              "4 người",
              "5 người",
              "2 người"
            ],
            "correct": 0,
            "why": "アンナ + パク + ワン = 三人."
          },
          {
            "q": "⑯ Hẹn gặp lúc mấy giờ, ở đâu?",
            "options": [
              "7 giờ ở ga",
              "5 giờ ở ga",
              "7 giờ ở công viên",
              "5 giờ ở công viên"
            ],
            "correct": 1,
            "why": "五時に 駅で."
          },
          {
            "q": "⑰ Bài kiểm tra bắt đầu lúc mấy giờ?",
            "options": [
              "10 giờ",
              "9 giờ",
              "8 giờ rưỡi",
              "8 giờ"
            ],
            "correct": 1,
            "why": "九時から; 八時半 là giờ gặp."
          },
          {
            "q": "⑰ Họ hẹn gặp ở đâu?",
            "options": [
              "Ở thư viện",
              "Ở công viên",
              "Ở ga",
              "Trong lớp học"
            ],
            "correct": 3,
            "why": "教室で."
          }
        ]
      },
      {
        "t": "h",
        "text": "Nghe điền chỗ trống — nghe lại các đoạn trên rồi gõ"
      },
      {
        "t": "quiz",
        "id": "lt-b6-ng-dien",
        "title": "Nghe điền chỗ trống (6 câu)",
        "kind": "fill",
        "grammar": "Nghe lại đoạn ⑥, ⑦, ⑧, ⑩, ⑬, ⑮",
        "items": [
          {
            "q": "パク：＿＿あります。{一枚|いちまい}{二千円|にせんえん}です。　〔Paku:__ arimasu. Ichimai nisen'en desu.〕",
            "answers": [
              "三枚",
              "さんまい",
              "3枚"
            ],
            "hint": "Số vé"
          },
          {
            "q": "ワン：{午後|ごご}{六時|ろくじ}からです。＿＿に{駅|えき}で{会|あ}いましょう。　〔Wan:gogo rokuji kara desu. __ ni eki de aimashou.〕",
            "answers": [
              "五時",
              "ごじ",
              "5時"
            ],
            "hint": "Giờ hẹn"
          },
          {
            "q": "パク：{電車|でんしゃ}のほうが＿＿です。でも、バスのほうが{安|やす}いですよ。　〔Paku:densha no hou ga __ desu. Demo, basu no hou ga yasui desu yo.〕",
            "answers": [
              "早い",
              "はやい"
            ],
            "hint": "Nhanh hơn"
          },
          {
            "q": "パク：{三時|さんじ}はちょっと……。＿＿はどうですか。　〔Paku:sanji wa chotto.... __ wa dou desu ka.〕",
            "answers": [
              "四時",
              "よじ",
              "4時"
            ],
            "hint": "Giờ mới"
          },
          {
            "q": "パク：いいえ、＿＿です。{今日|きょう}{買|か}います。　〔Paku:iie, __ desu. Kyou kaimasu.〕",
            "answers": [
              "まだ"
            ],
            "hint": "Chưa"
          },
          {
            "q": "リン：{八百円|はっぴゃくえん}です。すき{焼|や}きは＿＿です。　〔Rin:happyakuen desu. Sukiyaki wa __ desu.〕",
            "answers": [
              "二千五百円",
              "にせんごひゃくえん",
              "2500円"
            ],
            "hint": "Giá sukiyaki"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b6-noi-viet",
    "kind": "speaking",
    "title": "Luyện thêm Bài 6 · Nói & viết — 5 bộ tranh kiểu thi nói (3 câu tranh + 1 cá nhân) · đọc to · viết 3–5 câu",
    "goal": "Trả lời trọn câu các dạng câu hỏi thi nói Bài 6 (vé, giá, so sánh, đã … chưa, nhập vai rủ/từ chối), đọc to đoạn văn trôi chảy và viết được tin nhắn rủ/từ chối/so sánh 3–5 câu.",
    "minutes": 90,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thi nói: **nghe → nghĩ không quá 10 giây → trả lời TRỌN CÂU → thêm 1 câu phụ**. Mỗi bộ dưới đây có 3 câu nhìn \"tranh\" (mô tả bằng chữ) + 1 câu cá nhân: che cột trả lời, tự nói, rồi bấm nghe mẫu.",
          "Không có ảnh thì **vẽ nhanh tranh trong đầu** theo mô tả trong ngoặc. Khi thi thật chỉ cần nhìn tranh, nói đúng những gì thấy (số, giá, giờ, nơi).",
          "Viết ngắn: 3–5 câu, **mỗi câu một ý**, dùng đúng khuôn (rủ → hẹn → xác nhận; từ chối → lý do → đề xuất). Đọc lại tìm lỗi trợ từ **が・で・に・を・の ほうが**."
        ]
      },
      {
        "t": "recap",
        "title": "Cách chấm tự đánh giá (45 điểm Q&A)",
        "items": [
          "✅ Trả lời TRỌN CÂU (có trợ từ, です／ます) · ✅ đúng thông tin theo tranh · ✅ thêm 1 câu phụ (lý do／cảm nhận) · ✅ không im lặng quá 10 giây.",
          "Quên từ? Dùng từ đơn giản bạn nhớ (katakana, số) và vẫn nói trọn câu — im lặng mất cả câu.",
          "Nghe không rõ: 「もう いちど おねがいします。」(tối đa 3 lần)."
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
            "チケットは 何枚 ありますか",
            "チケットが ○枚 あります",
            "友達と 行きます"
          ],
          [
            "～は どこで ありますか",
            "N（nơi）で あります",
            "何時から です"
          ],
          [
            "AとBと どちらが ～ですか",
            "A／Bの ほうが ～です",
            "から + lý do"
          ],
          [
            "どこが／いつが いちばん ～ですか",
            "N が いちばん ～です",
            "N より ずっと ～です"
          ],
          [
            "もう ～ましたか",
            "はい、もう ～ました ／ いいえ、まだ です",
            "明日 ～ます"
          ],
          [
            "～に 行きませんか",
            "いいですね。～ましょう ／ すみません、ちょっと……",
            "用事が あります から"
          ]
        ],
        "caption": "Khung trả lời Bài 6 — luôn trả lời TRỌN CÂU rồi thêm 1 câu phụ"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · bộ tranh 1–2: số vé, nơi, giờ, giá"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Một người đứng ở ga, tay cầm 2 vé. Cạnh đó là lịch: 土 (thứ Bảy) 6:00 コンサート — 公園."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Vé hoà nhạc (3 câu theo tranh + 1 câu cá nhân)",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{人|ひと}はチケットが{何枚|なんまい}ありますか。",
            "ro": "Kono hito wa chiketto ga nanmai arimasu ka.",
            "vi": "(Tranh) Người này có mấy vé?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "チケットが{二枚|にまい}あります。",
            "ro": "Chiketto ga nimai arimasu.",
            "vi": "Có hai vé."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "コンサートはどこでありますか。",
            "ro": "Konsaato wa doko de arimasu ka.",
            "vi": "(Tranh) Buổi hoà nhạc ở đâu?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{公園|こうえん}であります。",
            "ro": "Kouen de arimasu.",
            "vi": "Ở công viên."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "コンサートは{何曜日|なんようび}の{何時|なんじ}からですか。",
            "ro": "Konsaato wa nan'youbi no nanji kara desu ka.",
            "vi": "(Tranh) Buổi hoà nhạc từ mấy giờ thứ mấy?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{土曜日|どようび}の{六時|ろくじ}からです。",
            "ro": "Doyoubi no rokuji kara desu.",
            "vi": "Từ 6 giờ thứ Bảy."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{今週|こんしゅう}の{土曜日|どようび}、{何|なに}かありますか。",
            "ro": "Konshuu no doyoubi, nani ka arimasu ka.",
            "vi": "(Cá nhân) Thứ Bảy tuần này bạn có gì không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、{友達|ともだち}と{約束|やくそく}があります。{一緒|いっしょ}に{映画|えいが}を{見|み}ます。",
            "ro": "Hai, tomodachi to yakusoku ga arimasu. Issho ni eiga o mimasu.",
            "vi": "Có, mình có hẹn với bạn. Mình xem phim cùng nhau."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ 1 — Câu cá nhân: trả lời kiểu \"không có gì\"",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{今週|こんしゅう}の{土曜日|どようび}、{何|なに}かありますか。",
            "ro": "Konshuu no doyoubi, nani ka arimasu ka.",
            "vi": "(Cá nhân) Thứ Bảy tuần này bạn có gì không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいえ、{何|なに}もありません。うちで{休|やす}みます。",
            "ro": "Iie, nani mo arimasen. Uchi de yasumimasu.",
            "vi": "Không, không có gì cả. Mình nghỉ ở nhà."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Hai bát: ラーメン 500 yên và 焼き肉 3.000 yên."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Ramen 500 yên · thịt nướng 3.000 yên",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ラーメンはいくらですか。",
            "ro": "Raamen wa ikura desu ka.",
            "vi": "(Tranh) Ramen bao nhiêu tiền?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{五百円|ごひゃくえん}です。",
            "ro": "Gohyakuen desu.",
            "vi": "500 yên."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ラーメンと{焼|や}き{肉|にく}と、どちらが{高|たか}いですか。",
            "ro": "Raamen to yakiniku to, dochira ga takai desu ka.",
            "vi": "(Tranh) Ramen và thịt nướng, cái nào đắt hơn?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{焼|や}き{肉|にく}のほうが{高|たか}いです。",
            "ro": "Yakiniku no hou ga takai desu.",
            "vi": "Thịt nướng đắt hơn."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ラーメンは{焼|や}き{肉|にく}より{安|やす}いですか。",
            "ro": "Raamen wa yakiniku yori yasui desu ka.",
            "vi": "(Tranh) Ramen rẻ hơn thịt nướng phải không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、ラーメンのほうがずっと{安|やす}いです。",
            "ro": "Hai, raamen no hou ga zutto yasui desu.",
            "vi": "Vâng, ramen rẻ hơn nhiều."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ラーメンと{焼|や}き{肉|にく}と、どちらが{好|す}きですか。",
            "ro": "Raamen to yakiniku to, dochira ga suki desu ka.",
            "vi": "(Cá nhân) Ramen và thịt nướng bạn thích món nào hơn?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ラーメンのほうが{好|す}きです。{安|やす}いですから。",
            "ro": "Raamen no hou ga suki desu. Yasui desu kara.",
            "vi": "Mình thích ramen hơn. Vì nó rẻ."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · bộ tranh 3–4: nhập vai từ chối, so sánh nhiệt độ"
      },
      {
        "t": "note",
        "title": "Tranh 3 (mô tả)",
        "items": [
          "Hai người nói chuyện. Lịch của bạn ghi tối nay: アルバイト; ngày mai: ひま; đồng hồ 7:00 và ga tàu."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 3 — Nhập vai: bạn bị rủ đi karaoke (tranh: lịch ghi アルバイト)",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{今晩|こんばん}、{一緒|いっしょ}にカラオケに{行|い}きませんか。",
            "ro": "Konban, issho ni karaoke ni ikimasen ka.",
            "vi": "(Tranh) Tối nay cùng đi karaoke không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "すみません、{今晩|こんばん}はアルバイトがありますから、ちょっと……。",
            "ro": "Sumimasen, konban wa arubaito ga arimasu kara, chotto....",
            "vi": "Xin lỗi, tối nay mình có việc làm thêm nên hơi…"
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "そうですか。ざんねんですね。{明日|あした}はどうですか。",
            "ro": "Sou desu ka. Zannen desu ne. Ashita wa dou desu ka.",
            "vi": "(Tranh: ngày mai ghi ひま) Vậy à, tiếc nhỉ. Ngày mai thì sao?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{明日|あした}はひまです。{行|い}きましょう。",
            "ro": "Ashita wa hima desu. Ikimashou.",
            "vi": "Ngày mai mình rảnh. Đi thôi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{何時|なんじ}に{会|あ}いますか。",
            "ro": "Nanji ni aimasu ka.",
            "vi": "(Tranh: đồng hồ 7 giờ, hình nhà ga) Mấy giờ gặp?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{七時|しちじ}に{駅|えき}で{会|あ}いましょう。",
            "ro": "Shichiji ni eki de aimashou.",
            "vi": "7 giờ gặp ở ga nhé."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "よくカラオケに{行|い}きますか。",
            "ro": "Yoku karaoke ni ikimasu ka.",
            "vi": "(Cá nhân) Bạn có hay đi karaoke không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、ときどき{行|い}きます。{友達|ともだち}と{歌|うた}います。",
            "ro": "Hai, tokidoki ikimasu. Tomodachi to utaimasu.",
            "vi": "Có, thỉnh thoảng mình đi. Mình hát cùng bạn."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 4 (mô tả)",
        "items": [
          "Biểu đồ cột: ハノイ 15 độ, ダナン 25 độ, ホーチミン 32 độ."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 4 — Biểu đồ nhiệt độ: Hà Nội 15 độ · Đà Nẵng 25 độ · TP.HCM 32 độ",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ハノイとホーチミンと、どちらが{寒|さむ}いですか。",
            "ro": "Hanoi to hoochimin to, dochira ga samui desu ka.",
            "vi": "(Tranh) Hà Nội và TP.HCM, nơi nào lạnh hơn?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ハノイのほうが{寒|さむ}いです。",
            "ro": "Hanoi no hou ga samui desu.",
            "vi": "Hà Nội lạnh hơn."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "どこがいちばん{暑|あつ}いですか。",
            "ro": "Doko ga ichiban atsui desu ka.",
            "vi": "(Tranh) Nơi nào nóng nhất?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ホーチミンがいちばん{暑|あつ}いです。",
            "ro": "Hoochimin ga ichiban atsui desu.",
            "vi": "TP.HCM nóng nhất."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ダナンはハノイより{暑|あつ}いですか。",
            "ro": "Danan wa hanoi yori atsui desu ka.",
            "vi": "(Tranh) Đà Nẵng nóng hơn Hà Nội phải không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、ダナンのほうが{暑|あつ}いです。",
            "ro": "Hai, danan no hou ga atsui desu.",
            "vi": "Vâng, Đà Nẵng nóng hơn."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{季節|きせつ}でいつがいちばん{好|す}きですか。",
            "ro": "Kisetsu de itsu ga ichiban suki desu ka.",
            "vi": "(Cá nhân) Trong các mùa bạn thích mùa nào nhất?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{春|はる}がいちばん{好|す}きです。{涼|すず}しいですから。",
            "ro": "Haru ga ichiban suki desu. Suzushii desu kara.",
            "vi": "Mình thích mùa xuân nhất. Vì mát mẻ."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bộ tranh 5 · đọc to · viết ngắn"
      },
      {
        "t": "note",
        "title": "Tranh 5 (mô tả)",
        "items": [
          "Danh sách chuẩn bị đi chơi: チケット (đã ✓), 地図 (chưa ✓), đồng hồ 2:00."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 5 — Danh sách chuẩn bị đi chơi (✓ チケット, chưa ✓ 地図)",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "もうチケットを{買|か}いましたか。",
            "ro": "Mou chiketto o kaimashita ka.",
            "vi": "(Tranh: có dấu ✓) Bạn mua vé chưa?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、もう{買|か}いました。",
            "ro": "Hai, mou kaimashita.",
            "vi": "Rồi, mình mua rồi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "もう{地図|ちず}を{買|か}いましたか。",
            "ro": "Mou chizu o kaimashita ka.",
            "vi": "(Tranh: chưa ✓) Bạn mua bản đồ chưa?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいえ、まだです。{明日|あした}{買|か}います。",
            "ro": "Iie, mada desu. Ashita kaimasu.",
            "vi": "Chưa. Mai mình mua."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{明日|あした}の{何時|なんじ}に{買|か}い{物|もの}に{行|い}きますか。",
            "ro": "Ashita no nanji ni kaimono ni ikimasu ka.",
            "vi": "(Tranh: đồng hồ 2 giờ) Mai mấy giờ bạn đi mua?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{二時|にじ}に{行|い}きます。",
            "ro": "Niji ni ikimasu.",
            "vi": "Mình đi lúc 2 giờ."
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
            "text": "はい、もう{食|た}べました。ラーメンを{食|た}べました。",
            "ro": "Hai, mou tabemashita. Raamen o tabemashita.",
            "vi": "Rồi, mình ăn rồi. Mình ăn ramen."
          }
        ]
      },
      {
        "t": "h",
        "text": "Đọc to (Reading 40 điểm)"
      },
      {
        "t": "passage",
        "title": "Đọc to 1 (Reading) — Hoà nhạc cuối tuần",
        "intro": "Chuẩn bị 20 giây rồi đọc to, chậm, rõ. Chú ý ngắt ở dấu 、 và 。.",
        "paras": [
          {
            "text": "{私|わたし}は{来週|らいしゅう}の{土曜日|どようび}、{友達|ともだち}とコンサートに{行|い}きます。コンサートは{公園|こうえん}であります。チケットは{一枚|いちまい}{二千円|にせんえん}です。もう{二枚|にまい}{買|か}いました。{六時|ろくじ}からですから、{五時|ごじ}に{駅|えき}で{会|あ}います。とても{楽|たの}しみです。"
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
            "en": "{私|わたし}は{来週|らいしゅう}の{土曜日|どようび}、{友達|ともだち}とコンサートに{行|い}きます。",
            "ro": "Watashi wa raishuu no doyoubi, tomodachi to konsaato ni ikimasu.",
            "vi": "Thứ Bảy tuần sau tôi đi hoà nhạc với bạn."
          },
          {
            "en": "コンサートは{公園|こうえん}であります。",
            "ro": "Konsaato wa kouen de arimasu.",
            "vi": "Buổi hoà nhạc ở công viên."
          },
          {
            "en": "チケットは{一枚|いちまい}{二千円|にせんえん}です。",
            "ro": "Chiketto wa ichimai nisen'en desu.",
            "vi": "Vé một tấm 2.000 yên."
          },
          {
            "en": "もう{二枚|にまい}{買|か}いました。",
            "ro": "Mou nimai kaimashita.",
            "vi": "Tôi mua hai vé rồi."
          },
          {
            "en": "{六時|ろくじ}からですから、{五時|ごじ}に{駅|えき}で{会|あ}います。",
            "ro": "Rokuji kara desu kara, goji ni eki de aimasu.",
            "vi": "Vì bắt đầu từ 6 giờ nên 5 giờ gặp nhau ở ga."
          },
          {
            "en": "とても{楽|たの}しみです。",
            "ro": "Totemo tanoshimi desu.",
            "vi": "Tôi rất mong chờ."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đọc to 2 (Reading) — Chọn quán ăn",
        "intro": "Có nhiều số và so sánh: đọc chậm ở chỗ giá tiền.",
        "paras": [
          {
            "text": "ラーメンの{店|みせ}と{焼|や}き{肉|にく}の{店|みせ}があります。ラーメンは{五百円|ごひゃくえん}、{焼|や}き{肉|にく}は{三千円|さんぜんえん}です。ラーメンのほうがずっと{安|やす}いです。でも、{焼|や}き{肉|にく}のほうがおいしいです。{私|わたし}は{今月|こんげつ}はラーメンにします。{来月|らいげつ}は{焼|や}き{肉|にく}を{食|た}べたいです。"
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
            "en": "ラーメンの{店|みせ}と{焼|や}き{肉|にく}の{店|みせ}があります。",
            "ro": "Raamen no mise to yakiniku no mise ga arimasu.",
            "vi": "Có quán ramen và quán thịt nướng."
          },
          {
            "en": "ラーメンは{五百円|ごひゃくえん}、{焼|や}き{肉|にく}は{三千円|さんぜんえん}です。",
            "ro": "Raamen wa gohyakuen, yakiniku wa sanzen'en desu.",
            "vi": "Ramen 500 yên, thịt nướng 3.000 yên."
          },
          {
            "en": "ラーメンのほうがずっと{安|やす}いです。",
            "ro": "Raamen no hou ga zutto yasui desu.",
            "vi": "Ramen rẻ hơn nhiều."
          },
          {
            "en": "でも、{焼|や}き{肉|にく}のほうがおいしいです。",
            "ro": "Demo, yakiniku no hou ga oishii desu.",
            "vi": "Nhưng thịt nướng ngon hơn."
          },
          {
            "en": "{私|わたし}は{今月|こんげつ}はラーメンにします。",
            "ro": "Watashi wa kongetsu wa raamen ni shimasu.",
            "vi": "Tháng này tôi chọn ramen."
          },
          {
            "en": "{来月|らいげつ}は{焼|や}き{肉|にく}を{食|た}べたいです。",
            "ro": "Raigetsu wa yakiniku o tabetai desu.",
            "vi": "Tháng sau tôi muốn ăn thịt nướng."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b6-noi-ghi-am",
        "part": "1",
        "questions": [
          "チケットが なんまい ありますか。",
          "コンサートは どこで ありますか。",
          "ラーメンと やきにくと、 どちらが たかいですか。",
          "どこが いちばん あついですか。",
          "もう ちずを かいましたか。",
          "こんばん、 いっしょに カラオケに いきませんか。 (ことわってください)",
          "きせつで いつが いちばん すきですか。",
          "こんしゅうの どようび、 なにか ありますか。"
        ]
      },
      {
        "t": "h",
        "text": "Viết ngắn 3–5 câu — 4 đề có bài mẫu"
      },
      {
        "t": "p",
        "text": "**Đề 1.** Viết tin nhắn mời một người bạn đi xem phim vào Chủ nhật tới. (Gọi tên · rủ · nêu nơi/sự kiện · hẹn giờ.) Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{山田|やまだ}さん、{今度|こんど}の{日曜日|にちようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。",
            "ro": "Yamada-san, kondo no nichiyoubi, issho ni eiga o mi ni ikimasen ka.",
            "vi": "Anh Yamada, Chủ nhật tới cùng đi xem phim không?"
          },
          {
            "en": "{映画館|えいがかん}でコメディーの{映画|えいが}があります。",
            "ro": "Eigakan de komedii no eiga ga arimasu.",
            "vi": "Ở rạp có phim hài."
          },
          {
            "en": "{二時|にじ}に{駅|えき}で{会|あ}いましょう。",
            "ro": "Niji ni eki de aimashou.",
            "vi": "2 giờ gặp ở ga nhé."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 2.** Viết tin nhắn từ chối lời rủ vì có việc bận và đề nghị ngày khác. Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{田中|たなか}さん、すみません。",
            "ro": "Tanaka-san, sumimasen.",
            "vi": "Chị Tanaka, xin lỗi chị."
          },
          {
            "en": "{土曜日|どようび}は{用事|ようじ}がありますから、ちょっと……。",
            "ro": "Doyoubi wa youji ga arimasu kara, chotto....",
            "vi": "Thứ Bảy mình có việc bận nên hơi…"
          },
          {
            "en": "{日曜日|にちようび}はどうですか。",
            "ro": "Nichiyoubi wa dou desu ka.",
            "vi": "Chủ nhật thì sao?"
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 3.** Viết 3 câu so sánh hai mùa (thích mùa nào hơn và vì sao). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}は{夏|なつ}より{冬|ふゆ}のほうが{好|す}きです。",
            "ro": "Watashi wa natsu yori fuyu no hou ga suki desu.",
            "vi": "Tôi thích mùa đông hơn mùa hè."
          },
          {
            "en": "{冬|ふゆ}は{涼|すず}しいですから。",
            "ro": "Fuyu wa suzushii desu kara.",
            "vi": "Vì mùa đông mát mẻ."
          },
          {
            "en": "でも、ベトナムの{冬|ふゆ}は{日本|にほん}よりずっと{暑|あつ}いです。",
            "ro": "Demo, betonamu no fuyu wa nihon yori zutto atsui desu.",
            "vi": "Nhưng mùa đông ở Việt Nam nóng hơn Nhật nhiều."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 4.** Viết kế hoạch tuần này của bạn (4 câu). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{今週|こんしゅう}の{土曜日|どようび}、{友達|ともだち}とドライブに{行|い}きます。",
            "ro": "Konshuu no doyoubi, tomodachi to doraibu ni ikimasu.",
            "vi": "Thứ Bảy tuần này tôi đi lái xe chơi với bạn."
          },
          {
            "en": "{海|うみ}は{遠|とお}いですが、きれいです。",
            "ro": "Umi wa tooi desu ga, kirei desu.",
            "vi": "Biển hơi xa nhưng đẹp."
          },
          {
            "en": "{日曜日|にちようび}はうちで{休|やす}みます。",
            "ro": "Nichiyoubi wa uchi de yasumimasu.",
            "vi": "Chủ nhật tôi nghỉ ở nhà."
          },
          {
            "en": "{来週|らいしゅう}の{月曜日|げつようび}はテストがあります。",
            "ro": "Raishuu no getsuyoubi wa tesuto ga arimasu.",
            "vi": "Thứ Hai tuần sau có bài kiểm tra."
          }
        ]
      },
      {
        "t": "note",
        "title": "Checklist trước khi nộp bài viết",
        "items": [
          "Mỗi câu kết thúc bằng です／ます／ませんか／ましょう — không để câu cụt.",
          "Soát trợ từ: có hẹn/việc **が**; sự kiện ở đâu **で**; rủ đi làm gì **V(bỏ ます)に**; so sánh **より／の ほうが**.",
          "Có chữ Hán thì viết đúng chỗ đã học (来週, 今月, 会社…), chưa chắc thì viết hiragana."
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-viet-chon",
        "title": "Chọn bài viết đúng và tự nhiên (6 câu)",
        "items": [
          {
            "q": "Mời bạn đi xem phim thứ Bảy.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "{土曜日|どようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きますか。 (Doyoubi, issho ni eiga o mi ni ikimasu ka.)",
              "{土曜日|どようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。 (Doyoubi, issho ni eiga o mi ni ikimasen ka.)",
              "{土曜日|どようび}を{一緒|いっしょ}に{映画|えいが}に{行|い}きませんか。 (Doyoubi o issho ni eiga ni ikimasen ka.)",
              "{土曜日|どようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きましたか。 (Doyoubi, issho ni eiga o mi ni ikimashita ka.)"
            ],
            "correct": 1,
            "why": "Rủ = Vませんか + 見に行きます."
          },
          {
            "q": "Từ chối vì có việc bận.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "すみません、{用事|ようじ}をありますから、ちょっと……。 (Sumimasen, youji o arimasu kara, chotto....)",
              "すみません、{用事|ようじ}でありますから、ちょっと……。 (Sumimasen, youji de arimasu kara, chotto....)",
              "すみません、{用事|ようじ}がありますから、ちょっと……。 (Sumimasen, youji ga arimasu kara, chotto....)",
              "すみません、{用事|ようじ}がいますから、ちょっと……。 (Sumimasen, youji ga imasu kara, chotto....)"
            ],
            "correct": 2,
            "why": "用事 + が あります."
          },
          {
            "q": "Nói ở công viên có pháo hoa.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "{公園|こうえん}で{花火|はなび}があります。 (Kouen de hanabi ga arimasu.)",
              "{公園|こうえん}で{花火|はなび}をあります。 (Kouen de hanabi o arimasu.)",
              "{公園|こうえん}が{花火|はなび}であります。 (Kouen ga hanabi de arimasu.)",
              "{公園|こうえん}に{花火|はなび}があります。 (Kouen ni hanabi ga arimasu.)"
            ],
            "correct": 0,
            "why": "Sự kiện: N で N が あります."
          },
          {
            "q": "Nói thích mùa đông hơn mùa hè.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "{夏|なつ}と{冬|ふゆ}はいちばん{好|す}きです。 (Natsu to fuyu wa ichiban suki desu.)",
              "{夏|なつ}より{冬|ふゆ}はほうが{好|す}きです。 (Natsu yori fuyu wa hou ga suki desu.)",
              "{夏|なつ}は{冬|ふゆ}のより{好|す}きです。 (Natsu wa fuyu no yori suki desu.)",
              "{夏|なつ}より{冬|ふゆ}のほうが{好|す}きです。 (Natsu yori fuyu no hou ga suki desu.)"
            ],
            "correct": 3,
            "why": "N1 より N2 の ほうが."
          },
          {
            "q": "Báo mình có hai vé.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "チケットに{二枚|にまい}あります。 (Chiketto ni nimai arimasu.)",
              "チケットが{二枚|にまい}あります。 (Chiketto ga nimai arimasu.)",
              "チケットを{二枚|にまい}あります。 (Chiketto o nimai arimasu.)",
              "チケットが{二|ふた}つあります。 (Chiketto ga futatsu arimasu.)"
            ],
            "correct": 1,
            "why": "Vé → ～枚; N が あります."
          },
          {
            "q": "Nói mình chưa mua vé.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "いいえ、まだでした。 (Iie, mada deshita.)",
              "いいえ、まだです。 (Iie, mada desu.)",
              "はい、まだです。 (Hai, mada desu.)",
              "いいえ、もうです。 (Iie, mou desu.)"
            ],
            "correct": 1,
            "why": "Chưa = いいえ、まだです."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b6-viet-sx",
        "title": "Sắp xếp thành tin nhắn hoàn chỉnh (2 câu)",
        "items": [
          {
            "vi": "Sắp xếp thành tin nhắn rủ: gọi tên → rủ → hẹn.",
            "chips": [
              "{山田|やまだ}さん、{明日|あした}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。",
              "{六時|ろくじ}に{駅|えき}で{会|あ}いましょう。"
            ],
            "answer": [
              "{山田|やまだ}さん、{明日|あした}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。",
              "{六時|ろくじ}に{駅|えき}で{会|あ}いましょう。"
            ],
            "ro": "Yamada-san, ashita, issho ni gohan o tabemasen ka. Rokuji ni eki de aimashou.."
          },
          {
            "vi": "Sắp xếp thành tin nhắn từ chối: xin lỗi → lý do → đề xuất ngày khác.",
            "chips": [
              "{日曜日|にちようび}は{約束|やくそく}がありますから、ちょっと……。",
              "すみません。",
              "{土曜日|どようび}はどうですか。"
            ],
            "answer": [
              "すみません。",
              "{日曜日|にちようび}は{約束|やくそく}がありますから、ちょっと……。",
              "{土曜日|どようび}はどうですか。"
            ],
            "ro": "Sumimasen. Nichiyoubi wa yakusoku ga arimasu kara, chotto.... Doyoubi wa dou desu ka.."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b6-de-tong-hop",
    "kind": "review",
    "title": "Luyện thêm Bài 6 · Đề tổng hợp cuối bài — đúng khuôn kiểm tra của cô (59 câu · 45 phút)",
    "goal": "Làm thử một đề đủ các phần: từ vựng, chữ Hán (chữ nhiễu), ngữ pháp, chia từ, đọc hiểu, dịch — bấm giờ 45 phút, tự chấm theo thang điểm và biết mình yếu phần nào.",
    "minutes": 45,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Bấm giờ 45 phút**, không mở bài ôn. Làm theo thứ tự I → VI; phần nào chưa chắc thì đánh dấu và quay lại sau.",
          "Phần II (chữ Hán) đáp án nhiễu là **chữ na ná** — nhìn từng nét: 聞/間/門/開, 会/今/合, 読/続/話.",
          "Hết giờ, bấm nộp từng phần để xem đáp án + giải thích, ghi điểm vào bảng tự chấm bên dưới."
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
            "Chữ Hán — chọn cách viết đúng (có chữ nhiễu)",
            "12",
            "12"
          ],
          [
            "III",
            "Ngữ pháp — chọn đáp án / nhiều ô trống",
            "18",
            "18"
          ],
          [
            "IV",
            "Chia từ — gõ",
            "6",
            "6"
          ],
          [
            "V",
            "Đọc hiểu",
            "4",
            "4"
          ],
          [
            "VI",
            "Dịch Việt → Nhật (5) và Nhật → Việt (4)",
            "9",
            "9"
          ],
          [
            "Tổng",
            "",
            "**59**",
            "**59**"
          ]
        ],
        "caption": "Cấu trúc đề tổng hợp Bài 6"
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
            "≥ 50 / 59 (≥ 85%)",
            "Sẵn sàng",
            "Chuyển sang Bài 7; ôn lại lỗi nhỏ"
          ],
          [
            "41–49 (70–85%)",
            "Khá, còn sơ hở",
            "Xem lại phần sai nhiều nhất, làm lại lesson tương ứng ở mức Vừa"
          ],
          [
            "< 41 (< 70%)",
            "Cần ôn kỹ",
            "Đọc lại bài ngữ pháp + chữ Hán Bài 6, làm lại mức Dễ rồi thi lại sau 1 ngày"
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
        "id": "lt-b6-de-i",
        "title": "I. Từ vựng",
        "items": [
          {
            "q": "{週末|しゅうまつ}、{友達|ともだち}と＿＿に{行|い}きます。{車|くるま}で{海|うみ}へ{行|い}きます。　〔Shuumatsu, tomodachi to __ ni ikimasu. Kuruma de umi e ikimasu.〕",
            "options": [
              "ジャズ",
              "ドライブ",
              "セール",
              "コース"
            ],
            "correct": 1,
            "why": "ドライブに行きます. → **{週末|しゅうまつ}、{友達|ともだち}とドライブに{行|い}きます。{車|くるま}で{海|うみ}へ{行|い}きます。** 〔Shuumatsu, tomodachi to doraibu ni ikimasu. Kuruma de umi e ikimasu.〕 — Cuối tuần tôi đi lái xe chơi với bạn. Đi biển bằng ô tô."
          },
          {
            "q": "＿＿は{春|はる}、{夏|なつ}、{秋|あき}、{冬|ふゆ}です。　〔__ wa haru, natsu, aki, fuyu desu.〕",
            "options": [
              "{約束|やくそく}",
              "{用事|ようじ}",
              "{試合|しあい}",
              "{季節|きせつ}"
            ],
            "correct": 3,
            "why": "季節 = mùa. → **{季節|きせつ}は{春|はる}、{夏|なつ}、{秋|あき}、{冬|ふゆ}です。** 〔Kisetsu wa haru, natsu, aki, fuyu desu.〕 — Mùa là xuân, hạ, thu, đông."
          },
          {
            "q": "{地下鉄|ちかてつ}はバスより＿＿です。　〔Chikatetsu wa basu yori __ desu.〕",
            "options": [
              "{残念|ざんねん}",
              "{早|はや}い",
              "{広|ひろ}い",
              "{遠|とお}い"
            ],
            "correct": 1,
            "why": "早い = sớm; nhanh (thời gian). → **{地下鉄|ちかてつ}はバスより{早|はや}いです。** 〔Chikatetsu wa basu yori hayai desu.〕 — Tàu điện ngầm nhanh hơn xe buýt."
          },
          {
            "q": "{歌手|かしゅ}の＿＿に{行|い}きます。　〔Kashu no __ ni ikimasu.〕",
            "options": [
              "{地図|ちず}",
              "コンサート",
              "ラーメン",
              "{水着|みずぎ}"
            ],
            "correct": 1,
            "why": "コンサート. → **{歌手|かしゅ}のコンサートに{行|い}きます。** 〔Kashu no konsaato ni ikimasu.〕 — Tôi đi buổi hoà nhạc của ca sĩ."
          },
          {
            "q": "{食|た}べ{放題|ほうだい}の＿＿をえらびます。　〔Tabehoudai no __ o erabimasu.〕",
            "options": [
              "ジャズ",
              "コース",
              "セール",
              "ツアー"
            ],
            "correct": 1,
            "why": "コース = set món. → **{食|た}べ{放題|ほうだい}のコースをえらびます。** 〔Tabehoudai no koosu o erabimasu.〕 — Chọn set buffet ăn thoả thích."
          },
          {
            "q": "A：コンサート、{行|い}きませんか。B：＿＿。{行|い}きましょう。　〔A:konsaato, ikimasen ka. B:__. Ikimashou.〕",
            "options": [
              "すみません",
              "ざんねんです",
              "わかりました",
              "いいですね"
            ],
            "correct": 3,
            "why": "Nhận lời = いいですね. → **A：コンサート、{行|い}きませんか。B：いいですね。{行|い}きましょう。** 〔A:konsaato, ikimasen ka. B:ii desu ne. Ikimashou.〕 — A: Đi hoà nhạc không? B: Hay đấy. Đi thôi."
          },
          {
            "q": "A：{土曜日|どようび}はちょっと……。B：そうですか。また＿＿。　〔A:doyoubi wa chotto.... B:sou desu ka. Mata __.〕",
            "options": [
              "{今月|こんげつ}",
              "{今週|こんしゅう}",
              "{来週|らいしゅう}",
              "{今度|こんど}"
            ],
            "correct": 3,
            "why": "また今度. → **A：{土曜日|どようび}はちょっと……。B：そうですか。また{今度|こんど}。** 〔A:doyoubi wa chotto.... B:sou desu ka. Mata kondo.〕 — A: Thứ Bảy hơi… B: Vậy à. Hẹn lần sau nhé."
          },
          {
            "q": "{地図|ちず}を{二|に}＿＿{買|か}いました。　〔Chizu o ni__ kaimashita.〕",
            "options": [
              "{枚|まい}",
              "{人|にん}",
              "{台|だい}",
              "{時|じ}"
            ],
            "correct": 0,
            "why": "～枚. → **{地図|ちず}を{二|に}{枚|まい}{買|か}いました。** 〔Chizu o nimai kaimashita.〕 — Tôi mua hai tấm bản đồ."
          },
          {
            "q": "{駅|えき}は{家|うち}から＿＿ですから、{歩|ある}いて{行|い}きます。　〔Eki wa uchi kara __ desu kara, aruite ikimasu.〕",
            "options": [
              "{広|ひろ}い",
              "{遠|とお}い",
              "{残念|ざんねん}",
              "{近|ちか}い"
            ],
            "correct": 3,
            "why": "近い. → **{駅|えき}は{家|うち}から{近|ちか}いですから、{歩|ある}いて{行|い}きます。** 〔Eki wa uchi kara chikai desu kara, aruite ikimasu.〕 — Ga gần nhà nên tôi đi bộ."
          },
          {
            "q": "コーヒーとおちゃと、＿＿が{好|す}きですか。　〔Koohii to ocha to, __ ga suki desu ka.〕",
            "options": [
              "いつ",
              "いちばん",
              "{全部|ぜんぶ}",
              "どちら"
            ],
            "correct": 3,
            "why": "Chọn 1 trong 2 → どちら. → **コーヒーとおちゃと、どちらが{好|す}きですか。** 〔Koohii to ocha to, dochira ga suki desu ka.〕 — Cà phê và trà, bạn thích cái nào hơn?"
          }
        ]
      },
      {
        "t": "h",
        "text": "II. Chữ Hán (12 câu · 12 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b6-de-ii",
        "title": "II. Chữ Hán",
        "items": [
          {
            "q": "「ききます」 là cách viết nào?",
            "options": [
              "聞きます",
              "間きます",
              "門きます",
              "開きます"
            ],
            "correct": 0,
            "why": "聞 (nghe). 間・門・開 là chữ na ná."
          },
          {
            "q": "「よみます」 là cách viết nào?",
            "options": [
              "誌みます",
              "読みます",
              "続みます",
              "話みます"
            ],
            "correct": 1,
            "why": "読 (đọc)."
          },
          {
            "q": "「どくしょ」 là cách viết nào?",
            "options": [
              "話書",
              "読昼",
              "読書",
              "続書"
            ],
            "correct": 2,
            "why": "読 (đọc) + 書 (sách)."
          },
          {
            "q": "「はなします」 là cách viết nào?",
            "options": [
              "読します",
              "話します",
              "語します",
              "計します"
            ],
            "correct": 1,
            "why": "話 (nói chuyện)."
          },
          {
            "q": "「こんげつ」 là cách viết nào?",
            "options": [
              "今用",
              "今月",
              "合月",
              "令月"
            ],
            "correct": 1,
            "why": "今 (nay) + 月."
          },
          {
            "q": "「らいげつ」 là cách viết nào?",
            "options": [
              "来月",
              "未月",
              "束月",
              "米月"
            ],
            "correct": 0,
            "why": "来 (đến) + 月."
          },
          {
            "q": "「かいわ」 là cách viết nào?",
            "options": [
              "会話",
              "会語",
              "合話",
              "今話"
            ],
            "correct": 0,
            "why": "会 + 話."
          },
          {
            "q": "「かいしゃいん」 là cách viết nào?",
            "options": [
              "会杜員",
              "今社員",
              "合社員",
              "会社員"
            ],
            "correct": 3,
            "why": "会社 (công ty) + 員."
          },
          {
            "q": "「しゃかい」 là cách viết nào?",
            "options": [
              "社会",
              "社今",
              "礼会",
              "杜会"
            ],
            "correct": 0,
            "why": "社会 = xã hội."
          },
          {
            "q": "「こんばん」 là cách viết nào?",
            "options": [
              "令晩",
              "今免",
              "今晩",
              "今脱"
            ],
            "correct": 2,
            "why": "今 + 晩."
          },
          {
            "q": "「きます」 là cách viết nào?",
            "options": [
              "来ます",
              "束ます",
              "未ます",
              "米ます"
            ],
            "correct": 0,
            "why": "来ます = đến."
          },
          {
            "q": "「あいます」 là cách viết nào?",
            "options": [
              "令います",
              "今います",
              "全います",
              "会います"
            ],
            "correct": 3,
            "why": "会います = gặp."
          }
        ]
      },
      {
        "t": "h",
        "text": "III. Ngữ pháp (18 câu · 18 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b6-de-iii",
        "title": "III. Ngữ pháp",
        "items": [
          {
            "q": "「{今度|こんど}の{日曜日|にちようび}、{一緒|いっしょ}に{買|か}い{物|もの}に＿＿。」「ええ、{行|い}きましょう。」　〔\"kondo no nichiyoubi, issho ni kaimono ni __.\"\"ee, ikimashou.\"〕",
            "options": [
              "{行|い}きます",
              "{行|い}きました",
              "{行|い}きませんか",
              "{行|い}きません"
            ],
            "correct": 2,
            "why": "Rủ = Vませんか. → **「{今度|こんど}の{日曜日|にちようび}、{一緒|いっしょ}に{買|か}い{物|もの}に{行|い}きませんか。」「ええ、{行|い}きましょう。」** 〔\"kondo no nichiyoubi, issho ni kaimono ni ikimasen ka.\"\"ee, ikimashou.\"〕 — Lời rủ."
          },
          {
            "q": "「{一緒|いっしょ}に＿＿。」「ええ、{食|た}べましょう。」　〔\"issho ni __.\"\"ee, tabemashou.\"〕",
            "options": [
              "{食|た}べませんか",
              "{食|た}べます",
              "{食|た}べません",
              "{食|た}べました"
            ],
            "correct": 0,
            "why": "Rủ = Vませんか. → **「{一緒|いっしょ}に{食|た}べませんか。」「ええ、{食|た}べましょう。」** 〔\"issho ni tabemasen ka.\"\"ee, tabemashou.\"〕 — Lời rủ."
          },
          {
            "q": "{来週|らいしゅう}の{月曜日|げつようび}、テスト＿＿あります。　〔Raishuu no getsuyoubi, tesuto__ arimasu.〕",
            "options": [
              "で",
              "に",
              "を",
              "が"
            ],
            "correct": 3,
            "why": "N が あります. → **{来週|らいしゅう}の{月曜日|げつようび}、テストがあります。** 〔Raishuu no getsuyoubi, tesuto ga arimasu.〕 — Thứ Hai tuần sau có kiểm tra."
          },
          {
            "q": "{大学|だいがく}＿＿サッカーの{試合|しあい}があります。　〔Daigaku__ sakkaa no shiai ga arimasu.〕",
            "options": [
              "に",
              "で",
              "を",
              "が"
            ],
            "correct": 1,
            "why": "Sự kiện → で. → **{大学|だいがく}でサッカーの{試合|しあい}があります。** 〔Daigaku de sakkaa no shiai ga arimasu.〕 — Ở đại học có trận bóng đá."
          },
          {
            "q": "チケットが＿＿あります。　〔Chiketto ga __ arimasu.〕",
            "options": [
              "{三枚|さんまい}",
              "{三|みっ}つ",
              "{三人|さんにん}",
              "{三時|さんじ}"
            ],
            "correct": 0,
            "why": "Vé → ～枚. → **チケットが{三枚|さんまい}あります。** 〔Chiketto ga sanmai arimasu.〕 — Có ba vé."
          },
          {
            "q": "クラス＿＿、だれがいちばん{忙|いそが}しいですか。　〔Kurasu__, dare ga ichiban isogashii desu ka.〕",
            "options": [
              "に",
              "を",
              "で",
              "が"
            ],
            "correct": 2,
            "why": "N で … いちばん. → **クラスで、だれがいちばん{忙|いそが}しいですか。** 〔Kurasu de, dare ga ichiban isogashii desu ka.〕 — Trong lớp ai bận nhất?"
          },
          {
            "q": "「{季節|きせつ}で＿＿がいちばん{好|す}きですか。」「{冬|ふゆ}がいちばん{好|す}きです。」　〔\"kisetsu de __ ga ichiban sukidesuka.\"\"fuyu ga ichiban suki desu.\"〕",
            "options": [
              "どこ",
              "いくら",
              "いつ",
              "だれ"
            ],
            "correct": 2,
            "why": "いつ. → **「{季節|きせつ}でいつがいちばん{好|す}きですか。」「{冬|ふゆ}がいちばん{好|す}きです。」** 〔\"kisetsu de itsu ga ichiban sukidesuka.\"\"fuyu ga ichiban suki desu.\"〕 — Mùa nào bạn thích nhất?"
          },
          {
            "q": "{東京|とうきょう}は{京都|きょうと}＿＿{大|おお}きいです。　〔Toukyou wa kyouto __ ookii desu.〕",
            "options": [
              "まで",
              "より",
              "ほう",
              "から"
            ],
            "correct": 1,
            "why": "N1 は N2 より A. → **{東京|とうきょう}は{京都|きょうと}より{大|おお}きいです。** 〔Toukyou wa kyouto yori ookii desu.〕 — Tokyo to hơn Kyoto."
          },
          {
            "q": "このかばんはあのかばんより＿＿{高|たか}いです。　〔Kono kaban wa ano kaban yori __ takai desu.〕",
            "options": [
              "どちら",
              "いちばん",
              "ずっと",
              "とても"
            ],
            "correct": 2,
            "why": "より + ずっと. → **このかばんはあのかばんよりずっと{高|たか}いです。** 〔Kono kaban wa ano kaban yori zutto takai desu.〕 — Cặp này đắt hơn cặp kia nhiều."
          },
          {
            "q": "「{電車|でんしゃ}とバスと、＿＿が{早|はや}いですか。」　〔\"densha to basu to, __ ga hayai desu ka.\"〕",
            "options": [
              "だれ",
              "{何|なに}",
              "どれ",
              "どちら"
            ],
            "correct": 3,
            "why": "Chọn 1 trong 2 → どちら. → **「{電車|でんしゃ}とバスと、どちらが{早|はや}いですか。」** 〔\"densha to basu to, dochira ga hayai desu ka.\"〕 — Tàu và xe buýt, cái nào nhanh hơn?"
          },
          {
            "q": "「{電車|でんしゃ}の＿＿が{早|はや}いです。」　〔\"densha no __ ga hayai desu.\"〕",
            "options": [
              "より",
              "ほう",
              "いちばん",
              "どちら"
            ],
            "correct": 1,
            "why": "N の ほうが. → **「{電車|でんしゃ}のほうが{早|はや}いです。」** 〔\"densha no hou ga hayai desu.\"〕 — Tàu điện nhanh hơn."
          },
          {
            "q": "「もうチケットを{買|か}いましたか。」「いいえ、＿＿。」　〔\"mou chiketto o kaimashita ka.\"\"iie, __.\"〕",
            "options": [
              "{買|か}いません でした",
              "{買|か}いません",
              "もう です",
              "まだ です"
            ],
            "correct": 3,
            "why": "Chưa = まだです. → **「もうチケットを{買|か}いましたか。」「いいえ、まだです。」** 〔\"mou chiketto o kaimashita ka.\"\"iie, mada desu.\"〕 — Chưa mua."
          },
          {
            "q": "「もう{昼|ひる}ご{飯|はん}を＿＿か。」「はい、もう{食|た}べました。」　〔\"mou hirugohan o __ ka.\"\"hai, mou tabemashita.\"〕",
            "options": [
              "{食|た}べましょう",
              "{食|た}べます",
              "{食|た}べません",
              "{食|た}べました"
            ],
            "correct": 3,
            "why": "もう Vましたか. → **「もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。」「はい、もう{食|た}べました。」** 〔\"mou hirugohan o tabemashita ka.\"\"hai, mou tabemashita.\"〕 — Đã ăn trưa chưa?"
          },
          {
            "q": "「{明日|あした}の{三時|さんじ}＿＿どうですか。」「いいですね。」　〔\"ashita no sanji__ doudesuka.\"\"ii desu ne.\"〕",
            "options": [
              "が",
              "に",
              "は",
              "を"
            ],
            "correct": 2,
            "why": "N は どうですか. → **「{明日|あした}の{三時|さんじ}はどうですか。」「いいですね。」** 〔\"ashita no sanji wa doudesuka.\"\"ii desu ne.\"〕 — 3 giờ ngày mai thì sao?"
          },
          {
            "q": "「{今日|きょう}はいい{天気|てんき}です＿＿。」「ええ、そうですね。」　〔\"kyou wa ii tenki desu__.\"\"ee, sou desu ne.\"〕",
            "options": [
              "か",
              "よ",
              "ね",
              "が"
            ],
            "correct": 2,
            "why": "Đồng cảm → ね. → **「{今日|きょう}はいい{天気|てんき}ですね。」「ええ、そうですね。」** 〔\"kyou wa ii tenki desu ne.\"\"ee, sou desu ne.\"〕 — Hôm nay trời đẹp nhỉ."
          },
          {
            "q": "「{明日|あした}、テストがあります＿＿。」「そうですか。ありがとう。」　〔\"ashita, tesuto ga arimasu__.\"\"sou desu ka. Arigatou.\"〕",
            "options": [
              "ね",
              "よ",
              "か",
              "が"
            ],
            "correct": 1,
            "why": "Báo tin → よ. → **「{明日|あした}、テストがありますよ。」「そうですか。ありがとう。」** 〔\"ashita, tesuto ga arimasu yo.\"\"sou desu ka. Arigatou.\"〕 — Mai có kiểm tra đấy."
          },
          {
            "q": "{日曜日|にちようび}、{公園|こうえん}（①）コンサートがあります。{一緒|いっしょ}に{行|い}き（②）。　〔Nichiyoubi, kouen((1)) konsaato ga arimasu. Issho ni iki((2)).〕",
            "options": [
              "① で　② ませんか",
              "① に　② ませんか",
              "① で　② ましょう か",
              "① を　② ました"
            ],
            "correct": 0,
            "why": "N で … あります · Vませんか. → **{日曜日|にちようび}、{公園|こうえん}でコンサートがあります。{一緒|いっしょ}に{行|い}きませんか。** 〔Nichiyoubi, kouen de konsaato ga arimasu. Issho ni ikimasen ka.〕 — Chủ nhật ở công viên có hoà nhạc. Cùng đi không?"
          },
          {
            "q": "{私|わたし}は{肉|にく}より{魚|さかな}＿＿ほうが{好|す}きです。　〔Watashi wa niku yori sakana__ hou ga suki desu.〕",
            "options": [
              "が",
              "を",
              "は",
              "の"
            ],
            "correct": 3,
            "why": "N の ほうが. → **{私|わたし}は{肉|にく}より{魚|さかな}のほうが{好|す}きです。** 〔Watashi wa niku yori sakana no hou ga suki desu.〕 — Tôi thích cá hơn thịt."
          }
        ]
      },
      {
        "t": "h",
        "text": "IV. Chia từ (6 câu · 6 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b6-de-iv",
        "title": "IV. Chia từ",
        "kind": "fill",
        "grammar": "Vませんか (rủ) · Vましょう (đồng ý)",
        "items": [
          {
            "q": "{明日|あした}、{一緒|いっしょ}にビールを＿＿。　〔Ashita, issho ni biiru o __.〕",
            "answers": [
              "飲みませんか",
              "のみませんか"
            ],
            "hint": "飲みます → rủ"
          },
          {
            "q": "ええ、{駅|えき}へ＿＿。　〔Ee, eki e __.〕",
            "answers": [
              "行きましょう",
              "いきましょう"
            ],
            "hint": "行きます → \"… thôi\""
          },
          {
            "q": "{土曜日|どようび}、{友達|ともだち}に＿＿。　〔Doyoubi, tomodachi ni __.〕",
            "answers": [
              "会いませんか",
              "あいませんか"
            ],
            "hint": "会います → rủ"
          },
          {
            "q": "いいですね。{一緒|いっしょ}に＿＿。　〔Ii desu ne. Issho ni __.〕",
            "answers": [
              "勉強しましょう",
              "べんきょうしましょう"
            ],
            "hint": "勉強します → \"… thôi\""
          },
          {
            "q": "{六時|ろくじ}です。うちへ＿＿。　〔Rokuji desu. Uchi e __.〕",
            "answers": [
              "帰りましょう",
              "かえりましょう"
            ],
            "hint": "帰ります → \"… thôi\""
          },
          {
            "q": "A：もう{買|か}い{物|もの}をしましたか。B：いいえ、＿＿。　〔A:mou kaimono o shimashita ka. B:iie, __.〕",
            "answers": [
              "まだです"
            ],
            "hint": "Chưa"
          }
        ]
      },
      {
        "t": "h",
        "text": "V. Đọc hiểu (4 câu · 4 điểm)"
      },
      {
        "t": "passage",
        "title": "V. Đọc hiểu — Thư của Rin",
        "intro": "Đọc thư rồi trả lời 4 câu.",
        "paras": [
          {
            "text": "アンナさんへ{今度|こんど}の{日曜日|にちようび}、{駅|えき}の{前|まえ}で{花火|はなび}があります。{晩|ばん}{七時|しちじ}からです。{私|わたし}は{友達|ともだち}と{行|い}きます。アンナさんも{一緒|いっしょ}に{行|い}きませんか。{五時|ごじ}に{駅|えき}で{会|あ}いましょう。リン"
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
            "en": "アンナさんへ",
            "ro": "Anna-san e",
            "vi": "Gửi Anna,"
          },
          {
            "en": "{今度|こんど}の{日曜日|にちようび}、{駅|えき}の{前|まえ}で{花火|はなび}があります。",
            "ro": "Kondo no nichiyoubi, eki no mae de hanabi ga arimasu.",
            "vi": "Chủ nhật tới trước ga có pháo hoa."
          },
          {
            "en": "{晩|ばん}{七時|しちじ}からです。",
            "ro": "Ban shichiji kara desu.",
            "vi": "Từ 7 giờ tối."
          },
          {
            "en": "{私|わたし}は{友達|ともだち}と{行|い}きます。",
            "ro": "Watashi wa tomodachi to ikimasu.",
            "vi": "Mình đi với bạn."
          },
          {
            "en": "アンナさんも{一緒|いっしょ}に{行|い}きませんか。",
            "ro": "Anna-san mo issho ni ikimasen ka.",
            "vi": "Anna cũng cùng đi không?"
          },
          {
            "en": "{五時|ごじ}に{駅|えき}で{会|あ}いましょう。",
            "ro": "Goji ni eki de aimashou.",
            "vi": "5 giờ gặp ở ga nhé."
          },
          {
            "en": "リン",
            "ro": "Rin",
            "vi": "Rin"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-de-v",
        "title": "V. Câu hỏi đọc hiểu",
        "items": [
          {
            "q": "Pháo hoa diễn ra ở đâu?",
            "options": [
              "Ở công viên",
              "Trước ga",
              "Ở trường đại học",
              "Ở nhà Rin"
            ],
            "correct": 1,
            "why": "駅の前で 花火が あります."
          },
          {
            "q": "Pháo hoa bắt đầu lúc mấy giờ?",
            "options": [
              "5 giờ tối",
              "7 giờ tối",
              "5 giờ chiều",
              "7 giờ sáng"
            ],
            "correct": 1,
            "why": "晩 七時 から; 5 giờ là giờ hẹn."
          },
          {
            "q": "Rin hẹn Anna gặp lúc mấy giờ?",
            "options": [
              "7 giờ",
              "6 giờ",
              "5 giờ",
              "4 giờ"
            ],
            "correct": 2,
            "why": "五時に 駅で."
          },
          {
            "q": "Rin đi pháo hoa với ai?",
            "options": [
              "Với giáo viên",
              "Với bạn của Rin",
              "Một mình",
              "Với Anna"
            ],
            "correct": 1,
            "why": "友達と 行きます."
          }
        ]
      },
      {
        "t": "h",
        "text": "VI. Dịch (9 câu · 9 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b6-de-vi-a",
        "title": "VI-a. Dịch Việt → Nhật",
        "kind": "translate",
        "grammar": "ポイント 48–60",
        "items": [
          {
            "q": "Mai cùng đi mua sắm không?",
            "answers": [
              "明日、一緒に買い物に行きませんか。",
              "明日、一緒に買い物にいきませんか。",
              "明日、一緒に買いものに行きませんか。",
              "明日、一緒に買いものにいきませんか。",
              "明日、一緒にかい物に行きませんか。",
              "明日、一緒にかい物にいきませんか。",
              "明日、一緒にかいものに行きませんか。",
              "明日、一緒にかいものにいきませんか。",
              "明日、いっしょに買い物に行きませんか。",
              "明日、いっしょに買い物にいきませんか。",
              "明日、いっしょに買いものに行きませんか。",
              "明日、いっしょに買いものにいきませんか。",
              "明日、いっしょにかい物に行きませんか。",
              "明日、いっしょにかい物にいきませんか。",
              "明日、いっしょにかいものに行きませんか。",
              "明日、いっしょにかいものにいきませんか。",
              "あした、一緒に買い物に行きませんか。",
              "あした、一緒に買い物にいきませんか。",
              "あした、一緒に買いものに行きませんか。",
              "あした、一緒に買いものにいきませんか。",
              "あした、一緒にかい物に行きませんか。",
              "あした、一緒にかい物にいきませんか。",
              "あした、一緒にかいものに行きませんか。",
              "あした、一緒にかいものにいきませんか。",
              "あした、いっしょに買い物に行きませんか。",
              "あした、いっしょに買い物にいきませんか。",
              "あした、いっしょに買いものに行きませんか。",
              "あした、いっしょに買いものにいきませんか。",
              "あした、いっしょにかい物に行きませんか。",
              "あした、いっしょにかい物にいきませんか。",
              "あした、いっしょにかいものに行きませんか。",
              "あした、いっしょにかいものにいきませんか。",
              "明日、一緒に買い物をしませんか。",
              "明日、一緒に買いものをしませんか。",
              "明日、一緒にかい物をしませんか。",
              "明日、一緒にかいものをしませんか。",
              "明日、いっしょに買い物をしませんか。",
              "明日、いっしょに買いものをしませんか。",
              "明日、いっしょにかい物をしませんか。",
              "明日、いっしょにかいものをしませんか。",
              "あした、一緒に買い物をしませんか。",
              "あした、一緒に買いものをしませんか。",
              "あした、一緒にかい物をしませんか。",
              "あした、一緒にかいものをしませんか。",
              "あした、いっしょに買い物をしませんか。",
              "あした、いっしょに買いものをしませんか。",
              "あした、いっしょにかい物をしませんか。",
              "あした、いっしょにかいものをしませんか。"
            ],
            "hint": "Vませんか"
          },
          {
            "q": "Xin lỗi, Chủ nhật tôi có việc bận.",
            "answers": [
              "すみません、日曜日は用事があります。",
              "すみません、日曜日はようじがあります。",
              "すみません、にちようびは用事があります。",
              "すみません、にちようびはようじがあります。",
              "すみません。日曜日は用事がありますから、ちょっと……。",
              "すみません。日曜日はようじがありますから、ちょっと……。",
              "すみません。にちようびは用事がありますから、ちょっと……。",
              "すみません。にちようびはようじがありますから、ちょっと……。"
            ],
            "hint": "N が あります"
          },
          {
            "q": "Ở công viên có buổi hoà nhạc. Tôi có hai vé.",
            "answers": [
              "公園でコンサートがあります。チケットが二枚あります。",
              "公園でコンサートがあります。チケットがにまいあります。",
              "こうえんでコンサートがあります。チケットが二枚あります。",
              "こうえんでコンサートがあります。チケットがにまいあります。"
            ],
            "hint": "N で N が あります · ～枚"
          },
          {
            "q": "Tàu điện nhanh hơn xe buýt.",
            "answers": [
              "電車はバスより早いです。",
              "電車はバスよりはやいです。",
              "でんしゃはバスより早いです。",
              "でんしゃはバスよりはやいです。",
              "バスより電車のほうが早いです。",
              "バスより電車のほうがはやいです。",
              "バスよりでんしゃのほうが早いです。",
              "バスよりでんしゃのほうがはやいです。",
              "電車のほうがバスより早いです。",
              "電車のほうがバスよりはやいです。",
              "でんしゃのほうがバスより早いです。",
              "でんしゃのほうがバスよりはやいです。"
            ],
            "hint": "より / の ほうが"
          },
          {
            "q": "Bạn ăn tối chưa? — Chưa.",
            "answers": [
              "もう晩ご飯を食べましたか。いいえ、まだです。",
              "もう晩ご飯をたべましたか。いいえ、まだです。",
              "もう晩ごはんを食べましたか。いいえ、まだです。",
              "もう晩ごはんをたべましたか。いいえ、まだです。",
              "もうばんご飯を食べましたか。いいえ、まだです。",
              "もうばんご飯をたべましたか。いいえ、まだです。",
              "もうばんごはんを食べましたか。いいえ、まだです。",
              "もうばんごはんをたべましたか。いいえ、まだです。"
            ],
            "hint": "もう … ましたか · まだです"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b6-de-vi-b",
        "title": "VI-b. Dịch Nhật → Việt",
        "items": [
          {
            "q": "Nghĩa của câu: {来週|らいしゅう}の{土曜日|どようび}、{大学|だいがく}でコンサートがあります。　〔Raishuu no doyoubi, daigaku de konsaato ga arimasu.〕",
            "options": [
              "Thứ Bảy tuần sau tôi có hẹn ở đại học.",
              "Thứ Bảy tuần sau đại học nghỉ.",
              "Thứ Bảy tuần này tôi đi hoà nhạc.",
              "Thứ Bảy tuần sau ở đại học có hoà nhạc."
            ],
            "correct": 3,
            "why": "来週 = tuần sau; で … が あります."
          },
          {
            "q": "Nghĩa của câu: ラーメンとすき{焼|や}きと、どちらが{好|す}きですか。　〔Raamen to sukiyaki to, dochira ga suki desu ka.〕",
            "options": [
              "Bạn thích ramen nhất phải không?",
              "Ramen và sukiyaki đều rẻ.",
              "Bạn đã ăn ramen và sukiyaki chưa?",
              "Ramen và sukiyaki, bạn thích món nào hơn?"
            ],
            "correct": 3,
            "why": "どちらが = cái nào (hơn)."
          },
          {
            "q": "Nghĩa của câu: {七時|しちじ}はちょっと……。{八時|はちじ}はどうですか。　〔Shichiji wa chotto.... Hachiji wa dou desu ka.〕",
            "options": [
              "7 giờ và 8 giờ đều được.",
              "7 giờ hơi khó. 8 giờ thì sao?",
              "8 giờ hơi khó. 7 giờ thì sao?",
              "7 giờ rồi, 8 giờ đi nhé."
            ],
            "correct": 1,
            "why": "ちょっと…… = khó; は どうですか = còn … thì sao."
          },
          {
            "q": "Nghĩa của câu: この{店|みせ}は{安|やす}いですよ。　〔Kono mise wa yasui desu yo.〕",
            "options": [
              "Tôi chưa đến quán này.",
              "Quán này rẻ không?",
              "Quán này rẻ nhỉ?",
              "Quán này rẻ đấy."
            ],
            "correct": 3,
            "why": "よ = báo cho biết."
          }
        ]
      }
    ]
  }
];

export const LUYEN_THEM_B7: Lesson[] = [
  {
    "id": "lt-b7-tu-vung",
    "kind": "homework",
    "title": "Luyện thêm Bài 7 · Từ vựng — nhận mặt → điền câu → dịch (3 mức, ~212 câu)",
    "goal": "Nhớ chắc 71/71 từ của cô cho Bài 7 (vị trí, phố, bếp & bàn ăn, động từ chuẩn bị tiệc): nhìn từ biết nghĩa, nhớ từ từ nghĩa, điền đúng vào câu, dịch Việt → Nhật.",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đi **🟢 → 🟡 → 🔴**. Mức Dễ làm 2 lượt (Nhật → Việt, Việt → Nhật). Hết 71 từ mới qua mức Vừa. Đọc to từ trong ngoặc (romaji) mỗi khi sai.",
          "Nhóm theo hình ảnh: **vị trí** (上 下 中 外 前 後ろ 横 隣 近く 間) · **phố** (改札 交番 バス停 ポスト) · **bếp & bàn ăn** · **động từ làm tiệc**. Cặp dễ lẫn: **横 / 隣**, **どれ / どの**, **持って行きます / 持って来ます**, **入れます / 入ります**.",
          "Từ ở mức Dễ cũng sẽ xuất hiện trong bài ngữ pháp thể て: học luôn thể て của từng động từ ngay từ bây giờ (ví dụ 洗います → 洗って)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhìn từ → nghĩa; nghe nghĩa → nhớ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-jv1",
        "title": "Nhật → Việt — nhóm A–C: vị trí · phố · gọi điện (21 câu)",
        "items": [
          {
            "q": "「{上|うえ}」 〔ue〕 nghĩa là gì?",
            "options": [
              "gần, chỗ gần",
              "trong",
              "bên cạnh (không nhất thiết sát)",
              "trên"
            ],
            "correct": 3,
            "why": "**{上|うえ}** (ue) = trên, bên trên"
          },
          {
            "q": "「{下|した}」 〔shita〕 nghĩa là gì?",
            "options": [
              "trong",
              "dưới",
              "bên cạnh (không nhất thiết sát)",
              "sau, phía sau"
            ],
            "correct": 1,
            "why": "**{下|した}** (shita) = dưới, phía dưới"
          },
          {
            "q": "「{中|なか}」 〔naka〕 nghĩa là gì?",
            "options": [
              "trong",
              "trên",
              "bên cạnh sát (cùng loại)",
              "ngoài"
            ],
            "correct": 0,
            "why": "**{中|なか}** (naka) = trong, bên trong"
          },
          {
            "q": "「{外|そと}」 〔soto〕 nghĩa là gì?",
            "options": [
              "giữa, ở giữa",
              "trên",
              "trong",
              "ngoài"
            ],
            "correct": 3,
            "why": "**{外|そと}** (soto) = ngoài, bên ngoài"
          },
          {
            "q": "「{前|まえ}」 〔mae〕 nghĩa là gì?",
            "options": [
              "trong",
              "sau, phía sau",
              "trước",
              "bên cạnh sát (cùng loại)"
            ],
            "correct": 2,
            "why": "**{前|まえ}** (mae) = trước, phía trước"
          },
          {
            "q": "「{後|うし}ろ」 〔ushiro〕 nghĩa là gì?",
            "options": [
              "giữa, ở giữa",
              "trên",
              "dưới",
              "sau, phía sau"
            ],
            "correct": 3,
            "why": "**{後|うし}ろ** (ushiro) = sau, phía sau, đằng sau"
          },
          {
            "q": "「{横|よこ}」 〔yoko〕 nghĩa là gì?",
            "options": [
              "sau, phía sau",
              "bên cạnh (không nhất thiết sát)",
              "giữa, ở giữa",
              "trước"
            ],
            "correct": 1,
            "why": "**{横|よこ}** (yoko) = bên cạnh; chiều ngang (cạnh bên, không nhất thiết sát, không cần cùng loại)"
          },
          {
            "q": "「{隣|となり}」 〔tonari〕 nghĩa là gì?",
            "options": [
              "sau, phía sau",
              "ngoài",
              "bên cạnh sát (cùng loại)",
              "trong"
            ],
            "correct": 2,
            "why": "**{隣|となり}** (tonari) = bên cạnh, sát bên (hai thứ CÙNG LOẠI xếp hàng: nhà – nhà, người – người, lọ – lọ)"
          },
          {
            "q": "「{近|ちか}く」 〔chikaku〕 nghĩa là gì?",
            "options": [
              "trước",
              "trên",
              "gần, chỗ gần",
              "sau, phía sau"
            ],
            "correct": 2,
            "why": "**{近|ちか}く** (chikaku) = gần, chỗ gần (ở vị trí gần) — danh từ, khác tính từ {近|ちか}い (Bài 6)"
          },
          {
            "q": "「{間|あいだ}」 〔aida〕 nghĩa là gì?",
            "options": [
              "trên",
              "ngoài",
              "bên cạnh sát (cùng loại)",
              "giữa, ở giữa"
            ],
            "correct": 3,
            "why": "**{間|あいだ}** (aida) = giữa, ở giữa (N1 と N2 の{間|あいだ})"
          },
          {
            "q": "「{改札|かいさつ}」 〔kaisatsu〕 nghĩa là gì?",
            "options": [
              "con chó",
              "đồn công an khu vực",
              "cổng soát vé",
              "trạm xe buýt"
            ],
            "correct": 2,
            "why": "**{改札|かいさつ}** (kaisatsu) = cổng soát vé (ở ga tàu) — chỗ hẹn gặp phổ biến nhất ở Nhật"
          },
          {
            "q": "「{木|き}」 〔ki〕 nghĩa là gì?",
            "options": [
              "cây",
              "cổng soát vé",
              "hoa",
              "thùng thư"
            ],
            "correct": 0,
            "why": "**{木|き}** (ki) = cây; gỗ"
          },
          {
            "q": "「{交番|こうばん}」 〔kouban〕 nghĩa là gì?",
            "options": [
              "thùng thư",
              "máy bán hàng tự động",
              "cổng soát vé",
              "đồn công an khu vực"
            ],
            "correct": 3,
            "why": "**{交番|こうばん}** (kouban) = đồn công an khu vực, chốt cảnh sát (nhỏ, ở góc phố, gần ga — nơi hỏi đường)"
          },
          {
            "q": "「{自動販売機|じどうはんばいき}」 〔jidou hanbaiki〕 nghĩa là gì?",
            "options": [
              "đồn công an khu vực",
              "máy bán hàng tự động",
              "hoa",
              "thùng thư"
            ],
            "correct": 1,
            "why": "**{自動販売機|じどうはんばいき}** (jidou hanbaiki) = máy bán hàng tự động"
          },
          {
            "q": "「バス{停|てい}」 〔basutei〕 nghĩa là gì?",
            "options": [
              "cây",
              "đồn công an khu vực",
              "trạm xe buýt",
              "máy bán hàng tự động"
            ],
            "correct": 2,
            "why": "**バス{停|てい}** (basutei) = trạm xe buýt, bến xe buýt"
          },
          {
            "q": "「ポスト」 〔posuto〕 nghĩa là gì?",
            "options": [
              "cổng soát vé",
              "thùng thư",
              "trạm xe buýt",
              "cây"
            ],
            "correct": 1,
            "why": "**ポスト** (posuto) = thùng thư, hòm thư (màu đỏ, bỏ thư ở ngoài đường)"
          },
          {
            "q": "「{花|はな}」 〔hana〕 nghĩa là gì?",
            "options": [
              "con chó",
              "đồn công an khu vực",
              "cổng soát vé",
              "hoa"
            ],
            "correct": 3,
            "why": "**{花|はな}** (hana) = hoa"
          },
          {
            "q": "「{犬|いぬ}」 〔inu〕 nghĩa là gì?",
            "options": [
              "máy bán hàng tự động",
              "thùng thư",
              "con chó",
              "trạm xe buýt"
            ],
            "correct": 2,
            "why": "**{犬|いぬ}** (inu) = con chó (con vật → dùng います)"
          },
          {
            "q": "「{迎|むか}えに{行|い}きます」 〔mukae ni ikimasu〕 nghĩa là gì?",
            "options": [
              "có, ở (người, con vật)",
              "nhà bếp",
              "a lô",
              "đi đón"
            ],
            "correct": 3,
            "why": "**{迎|むか}えに{行|い}きます** (mukae ni ikimasu) = đi đón (người) — thể て: {迎|むか}えに{行|い}って (ngoại lệ của {行|い}きます)"
          },
          {
            "q": "「います」 〔imasu〕 nghĩa là gì?",
            "options": [
              "đi đón",
              "thuốc lá",
              "có, ở (người, con vật)",
              "a lô"
            ],
            "correct": 2,
            "why": "**います** (imasu) = có mặt ở, ở (sự tồn tại của NGƯỜI, ĐỘNG VẬT) — thể て: いて"
          },
          {
            "q": "「もしもし」 〔moshimoshi〕 nghĩa là gì?",
            "options": [
              "có, ở (người, con vật)",
              "a lô",
              "đi đón",
              "viết"
            ],
            "correct": 1,
            "why": "**もしもし** (moshimoshi) = a lô (khi gọi / nhận điện thoại)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-jv2",
        "title": "Nhật → Việt — nhóm D–E: bếp & bàn ăn · từ để hỏi (20 câu)",
        "items": [
          {
            "q": "「いす」 〔isu〕 nghĩa là gì?",
            "options": [
              "ghế",
              "đũa",
              "tủ lạnh",
              "cốc"
            ],
            "correct": 0,
            "why": "**いす** (isu) = ghế, cái ghế"
          },
          {
            "q": "「テーブル」 〔teeburu〕 nghĩa là gì?",
            "options": [
              "xì dầu",
              "cốc",
              "bàn",
              "thìa"
            ],
            "correct": 2,
            "why": "**テーブル** (teeburu) = bàn, cái bàn (bàn ăn)"
          },
          {
            "q": "「{電子|でんし}レンジ」 〔denshi renji〕 nghĩa là gì?",
            "options": [
              "đũa",
              "đường (ăn)",
              "lò vi sóng",
              "tủ lạnh"
            ],
            "correct": 2,
            "why": "**{電子|でんし}レンジ** (denshi renji) = lò vi sóng"
          },
          {
            "q": "「{冷蔵庫|れいぞうこ}」 〔reizouko〕 nghĩa là gì?",
            "options": [
              "ghế",
              "dĩa, nĩa",
              "dao",
              "tủ lạnh"
            ],
            "correct": 3,
            "why": "**{冷蔵庫|れいぞうこ}** (reizouko) = tủ lạnh"
          },
          {
            "q": "「{砂糖|さとう}」 〔satou〕 nghĩa là gì?",
            "options": [
              "cốc",
              "đĩa",
              "đường (ăn)",
              "bàn"
            ],
            "correct": 2,
            "why": "**{砂糖|さとう}** (satou) = đường (ăn)"
          },
          {
            "q": "「{塩|しお}」 〔shio〕 nghĩa là gì?",
            "options": [
              "tủ lạnh",
              "đũa",
              "muối",
              "bàn"
            ],
            "correct": 2,
            "why": "**{塩|しお}** (shio) = muối"
          },
          {
            "q": "「しょうゆ」 〔shouyu〕 nghĩa là gì?",
            "options": [
              "tủ lạnh",
              "xì dầu",
              "cốc",
              "muối"
            ],
            "correct": 1,
            "why": "**しょうゆ** (shouyu) = xì dầu, nước tương"
          },
          {
            "q": "「コップ」 〔koppu〕 nghĩa là gì?",
            "options": [
              "dao",
              "đường (ăn)",
              "xì dầu",
              "cốc"
            ],
            "correct": 3,
            "why": "**コップ** (koppu) = cốc, cái cốc (cốc nước, cốc thuỷ tinh)"
          },
          {
            "q": "「（お）{皿|さら}」 〔(o)sara〕 nghĩa là gì?",
            "options": [
              "thìa",
              "xì dầu",
              "đĩa",
              "tủ lạnh"
            ],
            "correct": 2,
            "why": "**（お）{皿|さら}** ((o)sara) = đĩa, cái đĩa (お{皿|さら} = cách nói lịch sự, hay dùng hơn)"
          },
          {
            "q": "「スプーン」 〔supuun〕 nghĩa là gì?",
            "options": [
              "đường (ăn)",
              "dĩa, nĩa",
              "bàn",
              "thìa"
            ],
            "correct": 3,
            "why": "**スプーン** (supuun) = cái thìa, cái muỗng"
          },
          {
            "q": "「ナイフ」 〔naifu〕 nghĩa là gì?",
            "options": [
              "bàn",
              "tủ lạnh",
              "đường (ăn)",
              "dao"
            ],
            "correct": 3,
            "why": "**ナイフ** (naifu) = dao, con dao"
          },
          {
            "q": "「フォーク」 〔fooku〕 nghĩa là gì?",
            "options": [
              "dĩa, nĩa",
              "ghế",
              "đũa",
              "muối"
            ],
            "correct": 0,
            "why": "**フォーク** (fooku) = cái dĩa, cái nĩa"
          },
          {
            "q": "「はし」 〔hashi〕 nghĩa là gì?",
            "options": [
              "thìa",
              "xì dầu",
              "tủ lạnh",
              "đũa"
            ],
            "correct": 3,
            "why": "**はし** (hashi) = đũa (thường nói おはし)"
          },
          {
            "q": "「{漢字|かんじ}」 〔kanji〕 nghĩa là gì?",
            "options": [
              "… nào (đi với danh từ)",
              "cái nào (đứng một mình)",
              "nhiều",
              "chữ Hán"
            ],
            "correct": 3,
            "why": "**{漢字|かんじ}** (kanji) = chữ Hán"
          },
          {
            "q": "「どれ」 〔dore〕 nghĩa là gì?",
            "options": [
              "a, à (nhận ra điều gì)",
              "chữ Hán",
              "được thôi (nhận lời nhờ)",
              "cái nào (đứng một mình)"
            ],
            "correct": 3,
            "why": "**どれ** (dore) = cái nào (trong 3 thứ trở lên; đứng MỘT MÌNH, không kèm danh từ)"
          },
          {
            "q": "「どの～」 〔dono ~〕 nghĩa là gì?",
            "options": [
              "… nào (đi với danh từ)",
              "nhiều",
              "được thôi (nhận lời nhờ)",
              "a, à (nhận ra điều gì)"
            ],
            "correct": 0,
            "why": "**どの～** (dono ~) = … nào (luôn có danh từ theo sau: どのお{皿|さら}, どのナイフ)"
          },
          {
            "q": "「たくさん」 〔takusan〕 nghĩa là gì?",
            "options": [
              "cái nào (đứng một mình)",
              "nhiều",
              "chữ Hán",
              "xin lỗi (mở đầu lời nhờ)"
            ],
            "correct": 1,
            "why": "**たくさん** (takusan) = nhiều"
          },
          {
            "q": "「すみませんが」 〔sumimasen ga〕 nghĩa là gì?",
            "options": [
              "cái nào (đứng một mình)",
              "nhiều",
              "xin lỗi (mở đầu lời nhờ)",
              "… nào (đi với danh từ)"
            ],
            "correct": 2,
            "why": "**すみませんが** (sumimasen ga) = xin lỗi (cho tôi nhờ / hỏi…) — mở đầu trước lời nhờ ～てください"
          },
          {
            "q": "「ああ」 〔aa〕 nghĩa là gì?",
            "options": [
              "a, à (nhận ra điều gì)",
              "nhiều",
              "cái nào (đứng một mình)",
              "chữ Hán"
            ],
            "correct": 0,
            "why": "**ああ** (aa) = a, à (khi nhận ra điều gì)"
          },
          {
            "q": "「いいですよ」 〔ii desu yo〕 nghĩa là gì?",
            "options": [
              "… nào (đi với danh từ)",
              "được thôi (nhận lời nhờ)",
              "chữ Hán",
              "cái nào (đứng một mình)"
            ],
            "correct": 1,
            "why": "**いいですよ** (ii desu yo) = được đấy!, được thôi (nhận lời khi được nhờ)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-jv3",
        "title": "Nhật → Việt — nhóm F: động từ chuẩn bị tiệc (14 câu)",
        "items": [
          {
            "q": "「{洗|あら}います」 〔araimasu〕 nghĩa là gì?",
            "options": [
              "cắt, gọt",
              "viết",
              "hiểu, biết",
              "rửa"
            ],
            "correct": 3,
            "why": "**{洗|あら}います** (araimasu) = rửa (bát, rau, tay…) — thể て: {洗|あら}って"
          },
          {
            "q": "「{置|お}きます」 〔okimasu〕 nghĩa là gì?",
            "options": [
              "rửa",
              "đặt, để",
              "dùng, sử dụng",
              "hiểu, biết"
            ],
            "correct": 1,
            "why": "**{置|お}きます** (okimasu) = đặt, để — thể て: {置|お}いて"
          },
          {
            "q": "「{書|か}きます」 〔kakimasu〕 nghĩa là gì?",
            "options": [
              "viết",
              "lấy ra; nộp",
              "cho vào, bỏ vào",
              "hiểu, biết"
            ],
            "correct": 0,
            "why": "**{書|か}きます** (kakimasu) = viết — thể て: {書|か}いて"
          },
          {
            "q": "「{貸|か}します」 〔kashimasu〕 nghĩa là gì?",
            "options": [
              "viết",
              "đặt, để",
              "cho mượn",
              "dạy; chỉ cho biết"
            ],
            "correct": 2,
            "why": "**{貸|か}します** (kashimasu) = cho mượn — thể て: {貸|か}して (≠ {借|か}ります: mượn)"
          },
          {
            "q": "「{聞|き}きます」 〔kikimasu〕 nghĩa là gì?",
            "options": [
              "nghe; hỏi",
              "dạy; chỉ cho biết",
              "giúp, giúp đỡ",
              "hiểu, biết"
            ],
            "correct": 0,
            "why": "**{聞|き}きます** (kikimasu) = nghe; hỏi (người に 聞きます) — thể て: {聞|き}いて"
          },
          {
            "q": "「{切|き}ります」 〔kirimasu〕 nghĩa là gì?",
            "options": [
              "cắt, gọt",
              "cho mượn",
              "lấy ra; nộp",
              "cầm, lấy (chuyền giúp)"
            ],
            "correct": 0,
            "why": "**{切|き}ります** (kirimasu) = cắt, gọt — thể て: {切|き}って (nhóm 1, dù trông giống nhóm 2!)"
          },
          {
            "q": "「{使|つか}います」 〔tsukaimasu〕 nghĩa là gì?",
            "options": [
              "lấy ra; nộp",
              "dạy; chỉ cho biết",
              "dùng, sử dụng",
              "cắt, gọt"
            ],
            "correct": 2,
            "why": "**{使|つか}います** (tsukaimasu) = dùng, sử dụng — thể て: {使|つか}って"
          },
          {
            "q": "「{手伝|てつだ}います」 〔tetsudaimasu〕 nghĩa là gì?",
            "options": [
              "mang đi",
              "cho vào, bỏ vào",
              "cầm, lấy (chuyền giúp)",
              "giúp, giúp đỡ"
            ],
            "correct": 3,
            "why": "**{手伝|てつだ}います** (tetsudaimasu) = giúp, giúp đỡ (việc tay chân) — thể て: {手伝|てつだ}って"
          },
          {
            "q": "「{取|と}ります」 〔torimasu〕 nghĩa là gì?",
            "options": [
              "dùng, sử dụng",
              "cầm, lấy (chuyền giúp)",
              "cho mượn",
              "viết"
            ],
            "correct": 1,
            "why": "**{取|と}ります** (torimasu) = cầm, lấy (lấy giúp, chuyền cho) — thể て: {取|と}って"
          },
          {
            "q": "「{持|も}って{行|い}きます」 〔motte ikimasu〕 nghĩa là gì?",
            "options": [
              "cầm, lấy (chuyền giúp)",
              "dùng, sử dụng",
              "mang đi",
              "rửa"
            ],
            "correct": 2,
            "why": "**{持|も}って{行|い}きます** (motte ikimasu) = mang đi (mang từ đây đến chỗ khác) — thể て: {持|も}って{行|い}って"
          },
          {
            "q": "「わかります」 〔wakarimasu〕 nghĩa là gì?",
            "options": [
              "mang đi",
              "hiểu, biết",
              "viết",
              "lấy ra; nộp"
            ],
            "correct": 1,
            "why": "**わかります** (wakarimasu) = hiểu, biết (N が わかります) — thể て: わかって"
          },
          {
            "q": "「{出|だ}します」 〔dashimasu〕 nghĩa là gì?",
            "options": [
              "mang đi",
              "lấy ra; nộp",
              "rửa",
              "đặt, để"
            ],
            "correct": 1,
            "why": "**{出|だ}します** (dashimasu) = lấy ra, đưa ra; nộp (bài) — thể て: {出|だ}して"
          },
          {
            "q": "「{入|い}れます」 〔iremasu〕 nghĩa là gì?",
            "options": [
              "đặt, để",
              "cho vào, bỏ vào",
              "hiểu, biết",
              "cầm, lấy (chuyền giúp)"
            ],
            "correct": 1,
            "why": "**{入|い}れます** (iremasu) = cho vào, bỏ vào — thể て: {入|い}れて (≠ {入|はい}ります: đi vào, nhóm 1)"
          },
          {
            "q": "「{教|おし}えます」 〔oshiemasu〕 nghĩa là gì?",
            "options": [
              "đặt, để",
              "hiểu, biết",
              "viết",
              "dạy; chỉ cho biết"
            ],
            "correct": 3,
            "why": "**{教|おし}えます** (oshiemasu) = dạy; chỉ bảo, cho biết — thể て: {教|おし}えて"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-jv4",
        "title": "Nhật → Việt — nhóm G–H: ở bữa tiệc (16 câu)",
        "items": [
          {
            "q": "「{歌|うた}」 〔uta〕 nghĩa là gì?",
            "options": [
              "đàn ghi ta",
              "bài hát",
              "điện thoại",
              "bánh pizza"
            ],
            "correct": 1,
            "why": "**{歌|うた}** (uta) = bài hát"
          },
          {
            "q": "「ギター」 〔gitaa〕 nghĩa là gì?",
            "options": [
              "bài hát",
              "điện thoại",
              "cửa sổ",
              "đàn ghi ta"
            ],
            "correct": 3,
            "why": "**ギター** (gitaa) = đàn ghi ta"
          },
          {
            "q": "「{台所|だいどころ}」 〔daidokoro〕 nghĩa là gì?",
            "options": [
              "nhà bếp",
              "đàn ghi ta",
              "bài hát",
              "thuốc lá"
            ],
            "correct": 0,
            "why": "**{台所|だいどころ}** (daidokoro) = nhà bếp"
          },
          {
            "q": "「たばこ」 〔tabako〕 nghĩa là gì?",
            "options": [
              "bánh pizza",
              "thuốc lá",
              "nhà bếp",
              "bài hát"
            ],
            "correct": 1,
            "why": "**たばこ** (tabako) = thuốc lá"
          },
          {
            "q": "「{電話|でんわ}」 〔denwa〕 nghĩa là gì?",
            "options": [
              "cửa sổ",
              "điện thoại",
              "bánh pizza",
              "bài hát"
            ],
            "correct": 1,
            "why": "**{電話|でんわ}** (denwa) = điện thoại; cuộc gọi"
          },
          {
            "q": "「ピザ」 〔piza〕 nghĩa là gì?",
            "options": [
              "nhà bếp",
              "bài hát",
              "bánh pizza",
              "đàn ghi ta"
            ],
            "correct": 2,
            "why": "**ピザ** (piza) = bánh pizza"
          },
          {
            "q": "「{窓|まど}」 〔mado〕 nghĩa là gì?",
            "options": [
              "đàn ghi ta",
              "nhà bếp",
              "thuốc lá",
              "cửa sổ"
            ],
            "correct": 3,
            "why": "**{窓|まど}** (mado) = cửa sổ"
          },
          {
            "q": "「{歌|うた}います」 〔utaimasu〕 nghĩa là gì?",
            "options": [
              "mở",
              "nói chuyện",
              "hút (thuốc)",
              "hát"
            ],
            "correct": 3,
            "why": "**{歌|うた}います** (utaimasu) = hát — thể て: {歌|うた}って"
          },
          {
            "q": "「{吸|す}います」 〔suimasu〕 nghĩa là gì?",
            "options": [
              "gọi (điện thoại)",
              "mang đến",
              "hút (thuốc)",
              "hát"
            ],
            "correct": 2,
            "why": "**{吸|す}います** (suimasu) = hút (thuốc) — thể て: {吸|す}って"
          },
          {
            "q": "「{話|はな}します」 〔hanashimasu〕 nghĩa là gì?",
            "options": [
              "mang đến",
              "gọi (điện thoại)",
              "hút (thuốc)",
              "nói chuyện"
            ],
            "correct": 3,
            "why": "**{話|はな}します** (hanashimasu) = nói chuyện (người と 話します) — thể て: {話|はな}して"
          },
          {
            "q": "「{弾|ひ}きます」 〔hikimasu〕 nghĩa là gì?",
            "options": [
              "chơi (đàn ghi ta, piano)",
              "cầm, xách, mang theo người",
              "nói chuyện",
              "gọi (điện thoại)"
            ],
            "correct": 0,
            "why": "**{弾|ひ}きます** (hikimasu) = chơi (nhạc cụ có dây / phím: guitar, piano) — thể て: {弾|ひ}いて"
          },
          {
            "q": "「{持|も}ちます」 〔mochimasu〕 nghĩa là gì?",
            "options": [
              "cầm, xách, mang theo người",
              "nói chuyện",
              "gọi (điện thoại)",
              "đóng"
            ],
            "correct": 0,
            "why": "**{持|も}ちます** (mochimasu) = cầm, mang, xách — thể て: {持|も}って"
          },
          {
            "q": "「{開|あ}けます」 〔akemasu〕 nghĩa là gì?",
            "options": [
              "mở",
              "nói chuyện",
              "đóng",
              "hút (thuốc)"
            ],
            "correct": 0,
            "why": "**{開|あ}けます** (akemasu) = mở (cửa, hộp…) — thể て: {開|あ}けて"
          },
          {
            "q": "「{閉|し}めます」 〔shimemasu〕 nghĩa là gì?",
            "options": [
              "mang đến",
              "mở",
              "gọi (điện thoại)",
              "đóng"
            ],
            "correct": 3,
            "why": "**{閉|し}めます** (shimemasu) = đóng — thể て: {閉|し}めて"
          },
          {
            "q": "「かけます」 〔kakemasu〕 nghĩa là gì?",
            "options": [
              "gọi (điện thoại)",
              "hút (thuốc)",
              "cầm, xách, mang theo người",
              "chơi (đàn ghi ta, piano)"
            ],
            "correct": 0,
            "why": "**かけます** (kakemasu) = gọi (điện thoại): người に {電話|でんわ}を かけます — thể て: かけて"
          },
          {
            "q": "「{持|も}って{来|き}ます」 〔motte kimasu〕 nghĩa là gì?",
            "options": [
              "đóng",
              "mang đến",
              "nói chuyện",
              "hát"
            ],
            "correct": 1,
            "why": "**{持|も}って{来|き}ます** (motte kimasu) = mang đến (mang về phía chỗ người nói) — thể て: {持|も}って{来|き}て"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-vj1",
        "title": "Việt → Nhật — nhóm A–C: vị trí · phố · gọi điện (21 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"trên\" là từ nào?",
            "options": [
              "{近|ちか}く (chikaku)",
              "{上|うえ} (ue)",
              "{中|なか} (naka)",
              "{横|よこ} (yoko)"
            ],
            "correct": 1,
            "why": "**{上|うえ}** (ue) = trên, bên trên"
          },
          {
            "q": "Tiếng Nhật của \"dưới\" là từ nào?",
            "options": [
              "{横|よこ} (yoko)",
              "{中|なか} (naka)",
              "{下|した} (shita)",
              "{後|うし}ろ (ushiro)"
            ],
            "correct": 2,
            "why": "**{下|した}** (shita) = dưới, phía dưới"
          },
          {
            "q": "Tiếng Nhật của \"trong\" là từ nào?",
            "options": [
              "{上|うえ} (ue)",
              "{外|そと} (soto)",
              "{中|なか} (naka)",
              "{隣|となり} (tonari)"
            ],
            "correct": 2,
            "why": "**{中|なか}** (naka) = trong, bên trong"
          },
          {
            "q": "Tiếng Nhật của \"ngoài\" là từ nào?",
            "options": [
              "{上|うえ} (ue)",
              "{間|あいだ} (aida)",
              "{外|そと} (soto)",
              "{中|なか} (naka)"
            ],
            "correct": 2,
            "why": "**{外|そと}** (soto) = ngoài, bên ngoài"
          },
          {
            "q": "Tiếng Nhật của \"trước\" là từ nào?",
            "options": [
              "{隣|となり} (tonari)",
              "{前|まえ} (mae)",
              "{中|なか} (naka)",
              "{後|うし}ろ (ushiro)"
            ],
            "correct": 1,
            "why": "**{前|まえ}** (mae) = trước, phía trước"
          },
          {
            "q": "Tiếng Nhật của \"sau, phía sau\" là từ nào?",
            "options": [
              "{後|うし}ろ (ushiro)",
              "{間|あいだ} (aida)",
              "{下|した} (shita)",
              "{上|うえ} (ue)"
            ],
            "correct": 0,
            "why": "**{後|うし}ろ** (ushiro) = sau, phía sau, đằng sau"
          },
          {
            "q": "Tiếng Nhật của \"bên cạnh (không nhất thiết sát)\" là từ nào?",
            "options": [
              "{横|よこ} (yoko)",
              "{後|うし}ろ (ushiro)",
              "{前|まえ} (mae)",
              "{間|あいだ} (aida)"
            ],
            "correct": 0,
            "why": "**{横|よこ}** (yoko) = bên cạnh; chiều ngang (cạnh bên, không nhất thiết sát, không cần cùng loại)"
          },
          {
            "q": "Tiếng Nhật của \"bên cạnh sát (cùng loại)\" là từ nào?",
            "options": [
              "{後|うし}ろ (ushiro)",
              "{外|そと} (soto)",
              "{中|なか} (naka)",
              "{隣|となり} (tonari)"
            ],
            "correct": 3,
            "why": "**{隣|となり}** (tonari) = bên cạnh, sát bên (hai thứ CÙNG LOẠI xếp hàng: nhà – nhà, người – người, lọ – lọ)"
          },
          {
            "q": "Tiếng Nhật của \"gần, chỗ gần\" là từ nào?",
            "options": [
              "{前|まえ} (mae)",
              "{後|うし}ろ (ushiro)",
              "{上|うえ} (ue)",
              "{近|ちか}く (chikaku)"
            ],
            "correct": 3,
            "why": "**{近|ちか}く** (chikaku) = gần, chỗ gần (ở vị trí gần) — danh từ, khác tính từ {近|ちか}い (Bài 6)"
          },
          {
            "q": "Tiếng Nhật của \"giữa, ở giữa\" là từ nào?",
            "options": [
              "{間|あいだ} (aida)",
              "{上|うえ} (ue)",
              "{隣|となり} (tonari)",
              "{外|そと} (soto)"
            ],
            "correct": 0,
            "why": "**{間|あいだ}** (aida) = giữa, ở giữa (N1 と N2 の{間|あいだ})"
          },
          {
            "q": "Tiếng Nhật của \"cổng soát vé\" là từ nào?",
            "options": [
              "{改札|かいさつ} (kaisatsu)",
              "{交番|こうばん} (kouban)",
              "{犬|いぬ} (inu)",
              "バス{停|てい} (basutei)"
            ],
            "correct": 0,
            "why": "**{改札|かいさつ}** (kaisatsu) = cổng soát vé (ở ga tàu) — chỗ hẹn gặp phổ biến nhất ở Nhật"
          },
          {
            "q": "Tiếng Nhật của \"cây\" là từ nào?",
            "options": [
              "{木|き} (ki)",
              "ポスト (posuto)",
              "{改札|かいさつ} (kaisatsu)",
              "{花|はな} (hana)"
            ],
            "correct": 0,
            "why": "**{木|き}** (ki) = cây; gỗ"
          },
          {
            "q": "Tiếng Nhật của \"đồn công an khu vực\" là từ nào?",
            "options": [
              "{自動販売機|じどうはんばいき} (jidou hanbaiki)",
              "{交番|こうばん} (kouban)",
              "{改札|かいさつ} (kaisatsu)",
              "ポスト (posuto)"
            ],
            "correct": 1,
            "why": "**{交番|こうばん}** (kouban) = đồn công an khu vực, chốt cảnh sát (nhỏ, ở góc phố, gần ga — nơi hỏi đường)"
          },
          {
            "q": "Tiếng Nhật của \"máy bán hàng tự động\" là từ nào?",
            "options": [
              "{自動販売機|じどうはんばいき} (jidou hanbaiki)",
              "{交番|こうばん} (kouban)",
              "{花|はな} (hana)",
              "ポスト (posuto)"
            ],
            "correct": 0,
            "why": "**{自動販売機|じどうはんばいき}** (jidou hanbaiki) = máy bán hàng tự động"
          },
          {
            "q": "Tiếng Nhật của \"trạm xe buýt\" là từ nào?",
            "options": [
              "バス{停|てい} (basutei)",
              "{交番|こうばん} (kouban)",
              "{自動販売機|じどうはんばいき} (jidou hanbaiki)",
              "{木|き} (ki)"
            ],
            "correct": 0,
            "why": "**バス{停|てい}** (basutei) = trạm xe buýt, bến xe buýt"
          },
          {
            "q": "Tiếng Nhật của \"thùng thư\" là từ nào?",
            "options": [
              "{木|き} (ki)",
              "ポスト (posuto)",
              "{改札|かいさつ} (kaisatsu)",
              "バス{停|てい} (basutei)"
            ],
            "correct": 1,
            "why": "**ポスト** (posuto) = thùng thư, hòm thư (màu đỏ, bỏ thư ở ngoài đường)"
          },
          {
            "q": "Tiếng Nhật của \"hoa\" là từ nào?",
            "options": [
              "{花|はな} (hana)",
              "{犬|いぬ} (inu)",
              "{改札|かいさつ} (kaisatsu)",
              "{交番|こうばん} (kouban)"
            ],
            "correct": 0,
            "why": "**{花|はな}** (hana) = hoa"
          },
          {
            "q": "Tiếng Nhật của \"con chó\" là từ nào?",
            "options": [
              "ポスト (posuto)",
              "{犬|いぬ} (inu)",
              "バス{停|てい} (basutei)",
              "{自動販売機|じどうはんばいき} (jidou hanbaiki)"
            ],
            "correct": 1,
            "why": "**{犬|いぬ}** (inu) = con chó (con vật → dùng います)"
          },
          {
            "q": "Tiếng Nhật của \"đi đón\" là từ nào?",
            "options": [
              "もしもし (moshimoshi)",
              "{台所|だいどころ} (daidokoro)",
              "{迎|むか}えに{行|い}きます (mukae ni ikimasu)",
              "います (imasu)"
            ],
            "correct": 2,
            "why": "**{迎|むか}えに{行|い}きます** (mukae ni ikimasu) = đi đón (người) — thể て: {迎|むか}えに{行|い}って (ngoại lệ của {行|い}きます)"
          },
          {
            "q": "Tiếng Nhật của \"có, ở (người, con vật)\" là từ nào?",
            "options": [
              "もしもし (moshimoshi)",
              "たばこ (tabako)",
              "います (imasu)",
              "{迎|むか}えに{行|い}きます (mukae ni ikimasu)"
            ],
            "correct": 2,
            "why": "**います** (imasu) = có mặt ở, ở (sự tồn tại của NGƯỜI, ĐỘNG VẬT) — thể て: いて"
          },
          {
            "q": "Tiếng Nhật của \"a lô\" là từ nào?",
            "options": [
              "もしもし (moshimoshi)",
              "{書|か}きます (kakimasu)",
              "います (imasu)",
              "{迎|むか}えに{行|い}きます (mukae ni ikimasu)"
            ],
            "correct": 0,
            "why": "**もしもし** (moshimoshi) = a lô (khi gọi / nhận điện thoại)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-vj2",
        "title": "Việt → Nhật — nhóm D–E: bếp & bàn ăn · từ để hỏi (20 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"ghế\" là từ nào?",
            "options": [
              "はし (hashi)",
              "{冷蔵庫|れいぞうこ} (reizouko)",
              "いす (isu)",
              "コップ (koppu)"
            ],
            "correct": 2,
            "why": "**いす** (isu) = ghế, cái ghế"
          },
          {
            "q": "Tiếng Nhật của \"bàn\" là từ nào?",
            "options": [
              "スプーン (supuun)",
              "コップ (koppu)",
              "しょうゆ (shouyu)",
              "テーブル (teeburu)"
            ],
            "correct": 3,
            "why": "**テーブル** (teeburu) = bàn, cái bàn (bàn ăn)"
          },
          {
            "q": "Tiếng Nhật của \"lò vi sóng\" là từ nào?",
            "options": [
              "{電子|でんし}レンジ (denshi renji)",
              "{砂糖|さとう} (satou)",
              "はし (hashi)",
              "{冷蔵庫|れいぞうこ} (reizouko)"
            ],
            "correct": 0,
            "why": "**{電子|でんし}レンジ** (denshi renji) = lò vi sóng"
          },
          {
            "q": "Tiếng Nhật của \"tủ lạnh\" là từ nào?",
            "options": [
              "いす (isu)",
              "{冷蔵庫|れいぞうこ} (reizouko)",
              "フォーク (fooku)",
              "ナイフ (naifu)"
            ],
            "correct": 1,
            "why": "**{冷蔵庫|れいぞうこ}** (reizouko) = tủ lạnh"
          },
          {
            "q": "Tiếng Nhật của \"đường (ăn)\" là từ nào?",
            "options": [
              "{砂糖|さとう} (satou)",
              "テーブル (teeburu)",
              "（お）{皿|さら} ((o)sara)",
              "コップ (koppu)"
            ],
            "correct": 0,
            "why": "**{砂糖|さとう}** (satou) = đường (ăn)"
          },
          {
            "q": "Tiếng Nhật của \"muối\" là từ nào?",
            "options": [
              "{塩|しお} (shio)",
              "テーブル (teeburu)",
              "はし (hashi)",
              "{冷蔵庫|れいぞうこ} (reizouko)"
            ],
            "correct": 0,
            "why": "**{塩|しお}** (shio) = muối"
          },
          {
            "q": "Tiếng Nhật của \"xì dầu\" là từ nào?",
            "options": [
              "{塩|しお} (shio)",
              "しょうゆ (shouyu)",
              "{冷蔵庫|れいぞうこ} (reizouko)",
              "コップ (koppu)"
            ],
            "correct": 1,
            "why": "**しょうゆ** (shouyu) = xì dầu, nước tương"
          },
          {
            "q": "Tiếng Nhật của \"cốc\" là từ nào?",
            "options": [
              "ナイフ (naifu)",
              "しょうゆ (shouyu)",
              "コップ (koppu)",
              "{砂糖|さとう} (satou)"
            ],
            "correct": 2,
            "why": "**コップ** (koppu) = cốc, cái cốc (cốc nước, cốc thuỷ tinh)"
          },
          {
            "q": "Tiếng Nhật của \"đĩa\" là từ nào?",
            "options": [
              "スプーン (supuun)",
              "{冷蔵庫|れいぞうこ} (reizouko)",
              "（お）{皿|さら} ((o)sara)",
              "しょうゆ (shouyu)"
            ],
            "correct": 2,
            "why": "**（お）{皿|さら}** ((o)sara) = đĩa, cái đĩa (お{皿|さら} = cách nói lịch sự, hay dùng hơn)"
          },
          {
            "q": "Tiếng Nhật của \"thìa\" là từ nào?",
            "options": [
              "テーブル (teeburu)",
              "スプーン (supuun)",
              "{砂糖|さとう} (satou)",
              "フォーク (fooku)"
            ],
            "correct": 1,
            "why": "**スプーン** (supuun) = cái thìa, cái muỗng"
          },
          {
            "q": "Tiếng Nhật của \"dao\" là từ nào?",
            "options": [
              "テーブル (teeburu)",
              "ナイフ (naifu)",
              "{砂糖|さとう} (satou)",
              "{冷蔵庫|れいぞうこ} (reizouko)"
            ],
            "correct": 1,
            "why": "**ナイフ** (naifu) = dao, con dao"
          },
          {
            "q": "Tiếng Nhật của \"dĩa, nĩa\" là từ nào?",
            "options": [
              "はし (hashi)",
              "フォーク (fooku)",
              "{塩|しお} (shio)",
              "いす (isu)"
            ],
            "correct": 1,
            "why": "**フォーク** (fooku) = cái dĩa, cái nĩa"
          },
          {
            "q": "Tiếng Nhật của \"đũa\" là từ nào?",
            "options": [
              "スプーン (supuun)",
              "しょうゆ (shouyu)",
              "はし (hashi)",
              "{冷蔵庫|れいぞうこ} (reizouko)"
            ],
            "correct": 2,
            "why": "**はし** (hashi) = đũa (thường nói おはし)"
          },
          {
            "q": "Tiếng Nhật của \"chữ Hán\" là từ nào?",
            "options": [
              "たくさん (takusan)",
              "どの～ (dono ~)",
              "どれ (dore)",
              "{漢字|かんじ} (kanji)"
            ],
            "correct": 3,
            "why": "**{漢字|かんじ}** (kanji) = chữ Hán"
          },
          {
            "q": "Tiếng Nhật của \"cái nào (đứng một mình)\" là từ nào?",
            "options": [
              "ああ (aa)",
              "{漢字|かんじ} (kanji)",
              "いいですよ (ii desu yo)",
              "どれ (dore)"
            ],
            "correct": 3,
            "why": "**どれ** (dore) = cái nào (trong 3 thứ trở lên; đứng MỘT MÌNH, không kèm danh từ)"
          },
          {
            "q": "Tiếng Nhật của \"… nào (đi với danh từ)\" là từ nào?",
            "options": [
              "ああ (aa)",
              "どの～ (dono ~)",
              "いいですよ (ii desu yo)",
              "たくさん (takusan)"
            ],
            "correct": 1,
            "why": "**どの～** (dono ~) = … nào (luôn có danh từ theo sau: どのお{皿|さら}, どのナイフ)"
          },
          {
            "q": "Tiếng Nhật của \"nhiều\" là từ nào?",
            "options": [
              "{漢字|かんじ} (kanji)",
              "すみませんが (sumimasen ga)",
              "たくさん (takusan)",
              "どれ (dore)"
            ],
            "correct": 2,
            "why": "**たくさん** (takusan) = nhiều"
          },
          {
            "q": "Tiếng Nhật của \"xin lỗi (mở đầu lời nhờ)\" là từ nào?",
            "options": [
              "すみませんが (sumimasen ga)",
              "どれ (dore)",
              "どの～ (dono ~)",
              "たくさん (takusan)"
            ],
            "correct": 0,
            "why": "**すみませんが** (sumimasen ga) = xin lỗi (cho tôi nhờ / hỏi…) — mở đầu trước lời nhờ ～てください"
          },
          {
            "q": "Tiếng Nhật của \"a, à (nhận ra điều gì)\" là từ nào?",
            "options": [
              "ああ (aa)",
              "どれ (dore)",
              "たくさん (takusan)",
              "{漢字|かんじ} (kanji)"
            ],
            "correct": 0,
            "why": "**ああ** (aa) = a, à (khi nhận ra điều gì)"
          },
          {
            "q": "Tiếng Nhật của \"được thôi (nhận lời nhờ)\" là từ nào?",
            "options": [
              "{漢字|かんじ} (kanji)",
              "どれ (dore)",
              "どの～ (dono ~)",
              "いいですよ (ii desu yo)"
            ],
            "correct": 3,
            "why": "**いいですよ** (ii desu yo) = được đấy!, được thôi (nhận lời khi được nhờ)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-vj3",
        "title": "Việt → Nhật — nhóm F: động từ chuẩn bị tiệc (14 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"rửa\" là từ nào?",
            "options": [
              "わかります (wakarimasu)",
              "{書|か}きます (kakimasu)",
              "{洗|あら}います (araimasu)",
              "{切|き}ります (kirimasu)"
            ],
            "correct": 2,
            "why": "**{洗|あら}います** (araimasu) = rửa (bát, rau, tay…) — thể て: {洗|あら}って"
          },
          {
            "q": "Tiếng Nhật của \"đặt, để\" là từ nào?",
            "options": [
              "{置|お}きます (okimasu)",
              "{使|つか}います (tsukaimasu)",
              "{洗|あら}います (araimasu)",
              "わかります (wakarimasu)"
            ],
            "correct": 0,
            "why": "**{置|お}きます** (okimasu) = đặt, để — thể て: {置|お}いて"
          },
          {
            "q": "Tiếng Nhật của \"viết\" là từ nào?",
            "options": [
              "わかります (wakarimasu)",
              "{出|だ}します (dashimasu)",
              "{書|か}きます (kakimasu)",
              "{入|い}れます (iremasu)"
            ],
            "correct": 2,
            "why": "**{書|か}きます** (kakimasu) = viết — thể て: {書|か}いて"
          },
          {
            "q": "Tiếng Nhật của \"cho mượn\" là từ nào?",
            "options": [
              "{貸|か}します (kashimasu)",
              "{書|か}きます (kakimasu)",
              "{教|おし}えます (oshiemasu)",
              "{置|お}きます (okimasu)"
            ],
            "correct": 0,
            "why": "**{貸|か}します** (kashimasu) = cho mượn — thể て: {貸|か}して (≠ {借|か}ります: mượn)"
          },
          {
            "q": "Tiếng Nhật của \"nghe; hỏi\" là từ nào?",
            "options": [
              "{手伝|てつだ}います (tetsudaimasu)",
              "{聞|き}きます (kikimasu)",
              "{教|おし}えます (oshiemasu)",
              "わかります (wakarimasu)"
            ],
            "correct": 1,
            "why": "**{聞|き}きます** (kikimasu) = nghe; hỏi (người に 聞きます) — thể て: {聞|き}いて"
          },
          {
            "q": "Tiếng Nhật của \"cắt, gọt\" là từ nào?",
            "options": [
              "{切|き}ります (kirimasu)",
              "{取|と}ります (torimasu)",
              "{出|だ}します (dashimasu)",
              "{貸|か}します (kashimasu)"
            ],
            "correct": 0,
            "why": "**{切|き}ります** (kirimasu) = cắt, gọt — thể て: {切|き}って (nhóm 1, dù trông giống nhóm 2!)"
          },
          {
            "q": "Tiếng Nhật của \"dùng, sử dụng\" là từ nào?",
            "options": [
              "{切|き}ります (kirimasu)",
              "{教|おし}えます (oshiemasu)",
              "{使|つか}います (tsukaimasu)",
              "{出|だ}します (dashimasu)"
            ],
            "correct": 2,
            "why": "**{使|つか}います** (tsukaimasu) = dùng, sử dụng — thể て: {使|つか}って"
          },
          {
            "q": "Tiếng Nhật của \"giúp, giúp đỡ\" là từ nào?",
            "options": [
              "{手伝|てつだ}います (tetsudaimasu)",
              "{取|と}ります (torimasu)",
              "{持|も}って{行|い}きます (motte ikimasu)",
              "{入|い}れます (iremasu)"
            ],
            "correct": 0,
            "why": "**{手伝|てつだ}います** (tetsudaimasu) = giúp, giúp đỡ (việc tay chân) — thể て: {手伝|てつだ}って"
          },
          {
            "q": "Tiếng Nhật của \"cầm, lấy (chuyền giúp)\" là từ nào?",
            "options": [
              "{使|つか}います (tsukaimasu)",
              "{書|か}きます (kakimasu)",
              "{取|と}ります (torimasu)",
              "{貸|か}します (kashimasu)"
            ],
            "correct": 2,
            "why": "**{取|と}ります** (torimasu) = cầm, lấy (lấy giúp, chuyền cho) — thể て: {取|と}って"
          },
          {
            "q": "Tiếng Nhật của \"mang đi\" là từ nào?",
            "options": [
              "{使|つか}います (tsukaimasu)",
              "{洗|あら}います (araimasu)",
              "{持|も}って{行|い}きます (motte ikimasu)",
              "{取|と}ります (torimasu)"
            ],
            "correct": 2,
            "why": "**{持|も}って{行|い}きます** (motte ikimasu) = mang đi (mang từ đây đến chỗ khác) — thể て: {持|も}って{行|い}って"
          },
          {
            "q": "Tiếng Nhật của \"hiểu, biết\" là từ nào?",
            "options": [
              "{書|か}きます (kakimasu)",
              "わかります (wakarimasu)",
              "{出|だ}します (dashimasu)",
              "{持|も}って{行|い}きます (motte ikimasu)"
            ],
            "correct": 1,
            "why": "**わかります** (wakarimasu) = hiểu, biết (N が わかります) — thể て: わかって"
          },
          {
            "q": "Tiếng Nhật của \"lấy ra; nộp\" là từ nào?",
            "options": [
              "{持|も}って{行|い}きます (motte ikimasu)",
              "{出|だ}します (dashimasu)",
              "{洗|あら}います (araimasu)",
              "{置|お}きます (okimasu)"
            ],
            "correct": 1,
            "why": "**{出|だ}します** (dashimasu) = lấy ra, đưa ra; nộp (bài) — thể て: {出|だ}して"
          },
          {
            "q": "Tiếng Nhật của \"cho vào, bỏ vào\" là từ nào?",
            "options": [
              "{入|い}れます (iremasu)",
              "わかります (wakarimasu)",
              "{取|と}ります (torimasu)",
              "{置|お}きます (okimasu)"
            ],
            "correct": 0,
            "why": "**{入|い}れます** (iremasu) = cho vào, bỏ vào — thể て: {入|い}れて (≠ {入|はい}ります: đi vào, nhóm 1)"
          },
          {
            "q": "Tiếng Nhật của \"dạy; chỉ cho biết\" là từ nào?",
            "options": [
              "{書|か}きます (kakimasu)",
              "わかります (wakarimasu)",
              "{教|おし}えます (oshiemasu)",
              "{置|お}きます (okimasu)"
            ],
            "correct": 2,
            "why": "**{教|おし}えます** (oshiemasu) = dạy; chỉ bảo, cho biết — thể て: {教|おし}えて"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-vj4",
        "title": "Việt → Nhật — nhóm G–H: ở bữa tiệc (16 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"bài hát\" là từ nào?",
            "options": [
              "ギター (gitaa)",
              "ピザ (piza)",
              "{歌|うた} (uta)",
              "{電話|でんわ} (denwa)"
            ],
            "correct": 2,
            "why": "**{歌|うた}** (uta) = bài hát"
          },
          {
            "q": "Tiếng Nhật của \"đàn ghi ta\" là từ nào?",
            "options": [
              "{窓|まど} (mado)",
              "{電話|でんわ} (denwa)",
              "ギター (gitaa)",
              "{歌|うた} (uta)"
            ],
            "correct": 2,
            "why": "**ギター** (gitaa) = đàn ghi ta"
          },
          {
            "q": "Tiếng Nhật của \"nhà bếp\" là từ nào?",
            "options": [
              "ギター (gitaa)",
              "{歌|うた} (uta)",
              "たばこ (tabako)",
              "{台所|だいどころ} (daidokoro)"
            ],
            "correct": 3,
            "why": "**{台所|だいどころ}** (daidokoro) = nhà bếp"
          },
          {
            "q": "Tiếng Nhật của \"thuốc lá\" là từ nào?",
            "options": [
              "たばこ (tabako)",
              "{歌|うた} (uta)",
              "ピザ (piza)",
              "{台所|だいどころ} (daidokoro)"
            ],
            "correct": 0,
            "why": "**たばこ** (tabako) = thuốc lá"
          },
          {
            "q": "Tiếng Nhật của \"điện thoại\" là từ nào?",
            "options": [
              "{歌|うた} (uta)",
              "{窓|まど} (mado)",
              "ピザ (piza)",
              "{電話|でんわ} (denwa)"
            ],
            "correct": 3,
            "why": "**{電話|でんわ}** (denwa) = điện thoại; cuộc gọi"
          },
          {
            "q": "Tiếng Nhật của \"bánh pizza\" là từ nào?",
            "options": [
              "ギター (gitaa)",
              "ピザ (piza)",
              "{歌|うた} (uta)",
              "{台所|だいどころ} (daidokoro)"
            ],
            "correct": 1,
            "why": "**ピザ** (piza) = bánh pizza"
          },
          {
            "q": "Tiếng Nhật của \"cửa sổ\" là từ nào?",
            "options": [
              "{台所|だいどころ} (daidokoro)",
              "たばこ (tabako)",
              "{窓|まど} (mado)",
              "ギター (gitaa)"
            ],
            "correct": 2,
            "why": "**{窓|まど}** (mado) = cửa sổ"
          },
          {
            "q": "Tiếng Nhật của \"hát\" là từ nào?",
            "options": [
              "{話|はな}します (hanashimasu)",
              "{歌|うた}います (utaimasu)",
              "{開|あ}けます (akemasu)",
              "{吸|す}います (suimasu)"
            ],
            "correct": 1,
            "why": "**{歌|うた}います** (utaimasu) = hát — thể て: {歌|うた}って"
          },
          {
            "q": "Tiếng Nhật của \"hút (thuốc)\" là từ nào?",
            "options": [
              "{歌|うた}います (utaimasu)",
              "かけます (kakemasu)",
              "{吸|す}います (suimasu)",
              "{持|も}って{来|き}ます (motte kimasu)"
            ],
            "correct": 2,
            "why": "**{吸|す}います** (suimasu) = hút (thuốc) — thể て: {吸|す}って"
          },
          {
            "q": "Tiếng Nhật của \"nói chuyện\" là từ nào?",
            "options": [
              "{持|も}って{来|き}ます (motte kimasu)",
              "かけます (kakemasu)",
              "{吸|す}います (suimasu)",
              "{話|はな}します (hanashimasu)"
            ],
            "correct": 3,
            "why": "**{話|はな}します** (hanashimasu) = nói chuyện (người と 話します) — thể て: {話|はな}して"
          },
          {
            "q": "Tiếng Nhật của \"chơi (đàn ghi ta, piano)\" là từ nào?",
            "options": [
              "{持|も}ちます (mochimasu)",
              "{話|はな}します (hanashimasu)",
              "{弾|ひ}きます (hikimasu)",
              "かけます (kakemasu)"
            ],
            "correct": 2,
            "why": "**{弾|ひ}きます** (hikimasu) = chơi (nhạc cụ có dây / phím: guitar, piano) — thể て: {弾|ひ}いて"
          },
          {
            "q": "Tiếng Nhật của \"cầm, xách, mang theo người\" là từ nào?",
            "options": [
              "かけます (kakemasu)",
              "{持|も}ちます (mochimasu)",
              "{閉|し}めます (shimemasu)",
              "{話|はな}します (hanashimasu)"
            ],
            "correct": 1,
            "why": "**{持|も}ちます** (mochimasu) = cầm, mang, xách — thể て: {持|も}って"
          },
          {
            "q": "Tiếng Nhật của \"mở\" là từ nào?",
            "options": [
              "{吸|す}います (suimasu)",
              "{開|あ}けます (akemasu)",
              "{話|はな}します (hanashimasu)",
              "{閉|し}めます (shimemasu)"
            ],
            "correct": 1,
            "why": "**{開|あ}けます** (akemasu) = mở (cửa, hộp…) — thể て: {開|あ}けて"
          },
          {
            "q": "Tiếng Nhật của \"đóng\" là từ nào?",
            "options": [
              "かけます (kakemasu)",
              "{持|も}って{来|き}ます (motte kimasu)",
              "{閉|し}めます (shimemasu)",
              "{開|あ}けます (akemasu)"
            ],
            "correct": 2,
            "why": "**{閉|し}めます** (shimemasu) = đóng — thể て: {閉|し}めて"
          },
          {
            "q": "Tiếng Nhật của \"gọi (điện thoại)\" là từ nào?",
            "options": [
              "{吸|す}います (suimasu)",
              "{弾|ひ}きます (hikimasu)",
              "かけます (kakemasu)",
              "{持|も}ちます (mochimasu)"
            ],
            "correct": 2,
            "why": "**かけます** (kakemasu) = gọi (điện thoại): người に {電話|でんわ}を かけます — thể て: かけて"
          },
          {
            "q": "Tiếng Nhật của \"mang đến\" là từ nào?",
            "options": [
              "{話|はな}します (hanashimasu)",
              "{歌|うた}います (utaimasu)",
              "{持|も}って{来|き}ます (motte kimasu)",
              "{閉|し}めます (shimemasu)"
            ],
            "correct": 2,
            "why": "**{持|も}って{来|き}ます** (motte kimasu) = mang đến (mang về phía chỗ người nói) — thể て: {持|も}って{来|き}て"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · khác loại · điền từ vào câu · gõ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-khac-loai",
        "title": "Từ nào KHÁC loại? (8 câu)",
        "items": [
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (dụng cụ ăn)",
            "options": [
              "はし (Hashi)",
              "ナイフ (Naifu)",
              "{砂糖|さとう} (Satou)",
              "フォーク (Fooku)"
            ],
            "correct": 2,
            "why": "Ba từ kia là dụng cụ ăn; **砂糖** (đường) là gia vị."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (gia vị)",
            "options": [
              "{砂糖|さとう} (Satou)",
              "{塩|しお} (Shio)",
              "コップ (Koppu)",
              "しょうゆ (Shouyu)"
            ],
            "correct": 2,
            "why": "Ba từ kia là gia vị; **コップ** (cốc) là đồ dùng."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (vị trí)",
            "options": [
              "{隣|となり} (Tonari)",
              "{上|うえ} (Ue)",
              "{後|うし}ろ (Ushiro)",
              "{花|はな} (Hana)"
            ],
            "correct": 3,
            "why": "Ba từ kia chỉ vị trí; **花** (hoa) là đồ vật."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (trên phố)",
            "options": [
              "{改札|かいさつ} (Kaisatsu)",
              "バス{停|てい} (Basutei)",
              "{交番|こうばん} (Kouban)",
              "ギター (Gitaa)"
            ],
            "correct": 3,
            "why": "Ba từ kia là nơi/đồ vật ngoài phố; **ギター** là nhạc cụ."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (loại từ)",
            "options": [
              "{洗|あら}います (Araimasu)",
              "{使|つか}います (Tsukaimasu)",
              "{台所|だいどころ} (Daidokoro)",
              "{切|き}ります (Kirimasu)"
            ],
            "correct": 2,
            "why": "Ba từ kia là động từ; **台所** là danh từ (nhà bếp)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (âm nhạc)",
            "options": [
              "ギター (Gitaa)",
              "{窓|まど} (Mado)",
              "{歌|うた}います (Utaimasu)",
              "{歌|うた} (Uta)"
            ],
            "correct": 1,
            "why": "Ba từ kia liên quan âm nhạc; **窓** là cửa sổ."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (điện thoại)",
            "options": [
              "もしもし (Moshimoshi)",
              "{電話|でんわ} (Denwa)",
              "かけます (Kakemasu)",
              "{塩|しお} (Shio)"
            ],
            "correct": 3,
            "why": "Ba từ kia liên quan cuộc gọi; **塩** là muối."
          },
          {
            "q": "Từ nào dùng với います (các từ còn lại dùng あります)?",
            "options": [
              "{木|き} (Ki)",
              "ポスト (Posuto)",
              "{花|はな} (Hana)",
              "{犬|いぬ} (Inu)"
            ],
            "correct": 3,
            "why": "**犬** là con vật → います; hoa, cây, hòm thư là vật → あります."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-dien-cau",
        "title": "Điền từ vào câu — có nghĩa tiếng Việt kèm theo (19 câu)",
        "items": [
          {
            "q": "ビールは＿＿の{中|なか}にあります。　〔Biiru wa __ no naka ni arimasu.〕　— Bia ở trong tủ lạnh.",
            "options": [
              "{冷蔵庫|れいぞうこ}",
              "いす",
              "ポスト",
              "{窓|まど}"
            ],
            "correct": 0,
            "why": "冷蔵庫 = tủ lạnh. → **ビールは{冷蔵庫|れいぞうこ}の{中|なか}にあります。** 〔Biiru wa reizouko no naka ni arimasu.〕 — Bia ở trong tủ lạnh."
          },
          {
            "q": "ご{飯|はん}は＿＿で{作|つく}ります。　〔Gohan wa __ de tsukurimasu.〕　— Cơm thì nấu ở nhà bếp.",
            "options": [
              "{交番|こうばん}",
              "{改札|かいさつ}",
              "バス{停|てい}",
              "{台所|だいどころ}"
            ],
            "correct": 3,
            "why": "台所 = nhà bếp. → **ご{飯|はん}は{台所|だいどころ}で{作|つく}ります。** 〔Gohan wa daidokoro de tsukurimasu.〕 — Cơm thì nấu ở nhà bếp."
          },
          {
            "q": "＿＿でご{飯|はん}を{食|た}べます。　〔__ de gohan o tabemasu.〕　— Tôi ăn cơm bằng đũa.",
            "options": [
              "{窓|まど}",
              "ギター",
              "ポスト",
              "はし"
            ],
            "correct": 3,
            "why": "はし = đũa. → **はしでご{飯|はん}を{食|た}べます。** 〔Hashi de gohan o tabemasu.〕 — Tôi ăn cơm bằng đũa."
          },
          {
            "q": "コーヒーに＿＿を{入|い}れます。{甘|あま}いです。　〔Koohii ni __ o iremasu. Amai desu.〕　— Cho đường vào cà phê. Ngọt.",
            "options": [
              "ピザ",
              "{砂糖|さとう}",
              "{塩|しお}",
              "しょうゆ"
            ],
            "correct": 1,
            "why": "砂糖 = đường. → **コーヒーに{砂糖|さとう}を{入|い}れます。{甘|あま}いです。** 〔Koohii ni satou o iremasu. Amai desu.〕 — Cho đường vào cà phê. Ngọt."
          },
          {
            "q": "あついですから、＿＿を{開|あ}けます。　〔Atsui desu kara, __ o akemasu.〕　— Nóng nên tôi mở cửa sổ.",
            "options": [
              "{窓|まど}",
              "ギター",
              "はし",
              "{塩|しお}"
            ],
            "correct": 0,
            "why": "窓 = cửa sổ. → **あついですから、{窓|まど}を{開|あ}けます。** 〔Atsui desu kara, mado o akemasu.〕 — Nóng nên tôi mở cửa sổ."
          },
          {
            "q": "{手紙|てがみ}は＿＿に{入|い}れます。　〔Tegami wa __ ni iremasu.〕　— Thư thì bỏ vào hòm thư.",
            "options": [
              "テーブル",
              "{台所|だいどころ}",
              "ポスト",
              "{冷蔵庫|れいぞうこ}"
            ],
            "correct": 2,
            "why": "ポスト = hòm thư. → **{手紙|てがみ}はポストに{入|い}れます。** 〔Tegami wa posuto ni iremasu.〕 — Thư thì bỏ vào hòm thư."
          },
          {
            "q": "{道|みち}がわかりませんから、＿＿で{聞|き}きましょう。　〔Michi ga wakarimasen kara, __ de kikimashou.〕　— Không biết đường nên hỏi ở đồn công an.",
            "options": [
              "ポスト",
              "{交番|こうばん}",
              "{冷蔵庫|れいぞうこ}",
              "{自動販売機|じどうはんばいき}"
            ],
            "correct": 1,
            "why": "交番 = đồn công an khu vực. → **{道|みち}がわかりませんから、{交番|こうばん}で{聞|き}きましょう。** 〔Michi ga wakarimasen kara, kouban de kikimashou.〕 — Không biết đường nên hỏi ở đồn công an."
          },
          {
            "q": "＿＿でジュースを{買|か}います。コインを{入|い}れます。　〔__ de juusu o kaimasu. Koin o iremasu.〕　— Mua nước ở máy bán hàng tự động. Bỏ tiền xu vào.",
            "options": [
              "{台所|だいどころ}",
              "バス{停|てい}",
              "{自動販売機|じどうはんばいき}",
              "{交番|こうばん}"
            ],
            "correct": 2,
            "why": "自動販売機. → **{自動販売機|じどうはんばいき}でジュースを{買|か}います。コインを{入|い}れます。** 〔Jidouhanbaiki de juusu o kaimasu. Koin o iremasu.〕 — Mua nước ở máy bán hàng tự động. Bỏ tiền xu vào."
          },
          {
            "q": "ここは＿＿です。バスが{来|き}ます。　〔Koko wa __ desu. Basu ga kimasu.〕　— Đây là trạm xe buýt. Xe buýt đến.",
            "options": [
              "{改札|かいさつ}",
              "バス{停|てい}",
              "{交番|こうばん}",
              "ポスト"
            ],
            "correct": 1,
            "why": "バス停. → **ここはバス{停|てい}です。バスが{来|き}ます。** 〔Koko wa basutei desu. Basu ga kimasu.〕 — Đây là trạm xe buýt. Xe buýt đến."
          },
          {
            "q": "＿＿を{弾|ひ}きます。　〔__ o hikimasu.〕　— Tôi chơi ghi ta.",
            "options": [
              "ギター",
              "たばこ",
              "{塩|しお}",
              "ピザ"
            ],
            "correct": 0,
            "why": "弾きます đi với nhạc cụ. → **ギターを{弾|ひ}きます。** 〔Gitaa o hikimasu.〕 — Tôi chơi ghi ta."
          },
          {
            "q": "＿＿を{吸|す}います。　〔__ o suimasu.〕　— Hút thuốc lá.",
            "options": [
              "{砂糖|さとう}",
              "{窓|まど}",
              "たばこ",
              "ピザ"
            ],
            "correct": 2,
            "why": "吸います. → **たばこを{吸|す}います。** 〔Tabako o suimasu.〕 — Hút thuốc lá."
          },
          {
            "q": "{友達|ともだち}に＿＿をかけます。　〔Tomodachi ni __ o kakemasu.〕　— Gọi điện cho bạn.",
            "options": [
              "ピザ",
              "{窓|まど}",
              "{歌|うた}",
              "{電話|でんわ}"
            ],
            "correct": 3,
            "why": "電話をかけます. → **{友達|ともだち}に{電話|でんわ}をかけます。** 〔Tomodachi ni denwa o kakemasu.〕 — Gọi điện cho bạn."
          },
          {
            "q": "＿＿、{山田|やまだ}です。　〔__, yamada desu.〕　— A lô, Yamada đây.",
            "options": [
              "たくさん",
              "ああ",
              "すみませんが",
              "もしもし"
            ],
            "correct": 3,
            "why": "もしもし khi nghe/gọi điện. → **もしもし、{山田|やまだ}です。** 〔Moshimoshi, yamada desu.〕 — A lô, Yamada đây."
          },
          {
            "q": "＿＿、この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。　〔__, kono kanji no yomikata o oshiete kudasai.〕　— Xin lỗi, hãy chỉ cho tôi cách đọc chữ Hán này.",
            "options": [
              "すみませんが",
              "もしもし",
              "たくさん",
              "ああ"
            ],
            "correct": 0,
            "why": "すみませんが mở đầu lời nhờ. → **すみませんが、この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。** 〔Sumimasen ga, kono kanji no yomikata o oshiete kudasai.〕 — Xin lỗi, hãy chỉ cho tôi cách đọc chữ Hán này."
          },
          {
            "q": "A：{塩|しお}を{取|と}ってください。B：＿＿。どうぞ。　〔A:shio o totte kudasai. B:__. Douzo.〕　— A: Lấy giúp tôi muối. B: Được thôi. Đây ạ.",
            "options": [
              "たくさん",
              "ああ",
              "いいですよ",
              "もしもし"
            ],
            "correct": 2,
            "why": "いいですよ = nhận lời nhờ. → **A：{塩|しお}を{取|と}ってください。B：いいですよ。どうぞ。** 〔A:shio o totte kudasai. B:ii desu yo. Douzo.〕 — A: Lấy giúp tôi muối. B: Được thôi. Đây ạ."
          },
          {
            "q": "{冷蔵庫|れいぞうこ}の{中|なか}にビールが＿＿あります。　〔Reizouko no naka ni biiru ga __ arimasu.〕　— Trong tủ lạnh có nhiều bia.",
            "options": [
              "たくさん",
              "すみませんが",
              "ああ",
              "どれ"
            ],
            "correct": 0,
            "why": "たくさん = nhiều. → **{冷蔵庫|れいぞうこ}の{中|なか}にビールがたくさんあります。** 〔Reizouko no naka ni biiru ga takusan arimasu.〕 — Trong tủ lạnh có nhiều bia."
          },
          {
            "q": "{毎日|まいにち}、{台所|だいどころ}で{皿|さら}を＿＿。　〔Mainichi, daidokoro de sara o __.〕　— Mỗi ngày tôi rửa đĩa ở bếp.",
            "options": [
              "{書|か}きます",
              "{洗|あら}います",
              "{教|おし}えます",
              "{聞|き}きます"
            ],
            "correct": 1,
            "why": "洗います = rửa. → **{毎日|まいにち}、{台所|だいどころ}で{皿|さら}を{洗|あら}います。** 〔Mainichi, daidokoro de sara o araimasu.〕 — Mỗi ngày tôi rửa đĩa ở bếp."
          },
          {
            "q": "{先生|せんせい}は{日本語|にほんご}を＿＿。　〔Sensei wa nihongo o __.〕　— Cô giáo dạy tiếng Nhật.",
            "options": [
              "{教|おし}えます",
              "{歌|うた}います",
              "{切|き}ります",
              "{洗|あら}います"
            ],
            "correct": 0,
            "why": "教えます = dạy. → **{先生|せんせい}は{日本語|にほんご}を{教|おし}えます。** 〔Sensei wa nihongo o oshiemasu.〕 — Cô giáo dạy tiếng Nhật."
          },
          {
            "q": "{友達|ともだち}に{本|ほん}を＿＿。　〔Tomodachi ni hon o __.〕　— Tôi cho bạn mượn sách.",
            "options": [
              "{貸|か}します",
              "{開|あ}けます",
              "{切|き}ります",
              "{洗|あら}います"
            ],
            "correct": 0,
            "why": "貸します = cho mượn. → **{友達|ともだち}に{本|ほん}を{貸|か}します。** 〔Tomodachi ni hon o kashimasu.〕 — Tôi cho bạn mượn sách."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-tv-go-tu",
        "title": "Gõ từ tiếng Nhật theo nghĩa (16 câu)",
        "kind": "translate",
        "items": [
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cây\"",
            "answers": [
              "木",
              "き"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"con chó\"",
            "answers": [
              "犬",
              "いぬ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tủ lạnh\"",
            "answers": [
              "冷蔵庫",
              "れいぞうこ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đường (ăn)\"",
            "answers": [
              "砂糖",
              "さとう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"muối\"",
            "answers": [
              "塩",
              "しお"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đũa\"",
            "answers": [
              "はし"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"điện thoại\"",
            "answers": [
              "電話",
              "でんわ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cửa sổ\"",
            "answers": [
              "窓",
              "まど"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"nhà bếp\"",
            "answers": [
              "台所",
              "だいどころ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"chữ Hán\"",
            "answers": [
              "漢字",
              "かんじ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bài hát\"",
            "answers": [
              "歌",
              "うた"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"hoa\"",
            "answers": [
              "花",
              "はな"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"phía sau\"",
            "answers": [
              "後ろ",
              "うしろ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"ở giữa\"",
            "answers": [
              "間",
              "あいだ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bên ngoài\"",
            "answers": [
              "外",
              "そと"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đàn ghi ta\"",
            "answers": [
              "ギター"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đọc câu · tìm câu SAI · dịch"
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-sai",
        "title": "Tìm câu SAI (5 câu)",
        "items": [
          {
            "q": "(います／あります)　Câu nào SAI?",
            "options": [
              "{花|はな}があります。 (Hana ga arimasu.)",
              "{犬|いぬ}があります。 (Inu ga arimasu.)",
              "{木|き}があります。 (Ki ga arimasu.)",
              "{犬|いぬ}がいます。 (Inu ga imasu.)"
            ],
            "correct": 1,
            "why": "Con vật → います; hoa, cây → あります."
          },
          {
            "q": "(nơi tồn tại)　Câu nào SAI?",
            "options": [
              "{木|き}の{下|した}で{犬|いぬ}がいます。 (Ki no shita de inu ga imasu.)",
              "{駅|えき}の{前|まえ}にポストがあります。 (Eki no mae ni posuto ga arimasu.)",
              "{冷蔵庫|れいぞうこ}の{中|なか}にビールがあります。 (Reizouko no naka ni biiru ga arimasu.)",
              "{木|き}の{下|した}に{犬|いぬ}がいます。 (Ki no shita ni inu ga imasu.)"
            ],
            "correct": 0,
            "why": "Nơi TỒN TẠI dùng **に**, không dùng で."
          },
          {
            "q": "(どれ／どの)　Câu nào SAI?",
            "options": [
              "どのナイフですか。 (Dono naifu desu ka.)",
              "どれお{皿|さら}ですか。 (Dore osara desu ka.)",
              "{塩|しお}はどれですか。 (Shio wa dore desu ka.)",
              "どのお{皿|さら}ですか。 (Dono osara desu ka.)"
            ],
            "correct": 1,
            "why": "Có danh từ theo sau → **どの**; đứng một mình → どれ."
          },
          {
            "q": "(動詞)　Câu nào SAI?",
            "options": [
              "{窓|まど}を{閉|し}めてください。 (Mado o shimete kudasai.)",
              "{塩|しお}を{取|と}ってください。 (Shio o totte kudasai.)",
              "{窓|まど}を{開|あ}けてください。 (Mado o akete kudasai.)",
              "{窓|まど}を{開|あ}けるください。 (Mado o akeru kudasai.)"
            ],
            "correct": 3,
            "why": "Nhờ làm gì → thể て + ください."
          },
          {
            "q": "(trợ từ)　Câu nào SAI?",
            "options": [
              "{電話|でんわ}をかけます。 (Denwa o kakemasu.)",
              "{友達|ともだち}を{電話|でんわ}をかけます。 (Tomodachi o denwa o kakemasu.)",
              "{母|はは}に{電話|でんわ}をかけます。 (Haha ni denwa o kakemasu.)",
              "{友達|ともだち}に{電話|でんわ}をかけます。 (Tomodachi ni denwa o kakemasu.)"
            ],
            "correct": 1,
            "why": "Gọi điện cho ai → **人に** 電話を かけます."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-tv-nhat-viet",
        "title": "Đọc câu Nhật → chọn nghĩa Việt (6 câu)",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {木|き}の{下|した}に{犬|いぬ}がいます。　〔Ki no shita ni inu ga imasu.〕",
            "options": [
              "Dưới gốc cây có một con chó.",
              "Con chó đứng cạnh cây.",
              "Trên cây có một con chó.",
              "Dưới gốc cây có một cái ghế."
            ],
            "correct": 0,
            "why": "下 = dưới; 犬 = chó; います."
          },
          {
            "q": "Câu này nghĩa là gì? {冷蔵庫|れいぞうこ}の{中|なか}にビールがたくさんあります。　〔Reizouko no naka ni biiru ga takusan arimasu.〕",
            "options": [
              "Tủ lạnh ở trong nhà bếp.",
              "Có ít bia trong tủ lạnh.",
              "Trong tủ lạnh có nhiều bia.",
              "Ngoài tủ lạnh có nhiều bia."
            ],
            "correct": 2,
            "why": "中 = trong; たくさん = nhiều."
          },
          {
            "q": "Câu này nghĩa là gì? すみませんが、この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。　〔Sumimasen ga, kono kanji no yomikata o oshiete kudasai.〕",
            "options": [
              "Chữ Hán này khó quá.",
              "Xin lỗi, tôi dạy bạn chữ Hán nhé?",
              "Xin lỗi, hãy chỉ cho tôi cách đọc chữ Hán này.",
              "Tôi không biết chữ Hán."
            ],
            "correct": 2,
            "why": "教えて ください = hãy chỉ cho."
          },
          {
            "q": "Câu này nghĩa là gì? {台所|だいどころ}で{母|はは}が{皿|さら}を{洗|あら}っています。　〔Daidokoro de haha ga sara o aratte imasu.〕",
            "options": [
              "Đĩa ở bếp của mẹ.",
              "Mẹ ở bếp nhưng không làm gì.",
              "Mẹ rửa đĩa xong rồi.",
              "Mẹ đang rửa đĩa ở bếp."
            ],
            "correct": 3,
            "why": "洗っています = đang rửa."
          },
          {
            "q": "Câu này nghĩa là gì? {駅|えき}の{前|まえ}のポストは{近|ちか}くです。　〔Eki no mae no posuto wa chikaku desu.〕",
            "options": [
              "Hòm thư trước ga thì ở gần.",
              "Trước ga không có hòm thư.",
              "Hòm thư ở sau ga.",
              "Ga ở trước hòm thư."
            ],
            "correct": 0,
            "why": "前 = trước; 近く = gần."
          },
          {
            "q": "Câu này nghĩa là gì? {電話|でんわ}をかけてください。もしもし、{山田|やまだ}です。　〔Denwa o kakete kudasai. Moshimoshi, yamada desu.〕",
            "options": [
              "Tôi đang nghe điện thoại của Yamada.",
              "Hãy gọi điện giúp. A lô, Yamada đây.",
              "Yamada đang gọi tôi.",
              "Điện thoại bị hỏng."
            ],
            "correct": 1,
            "why": "かけて ください; もしもし."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-tv-dich",
        "title": "Dịch Việt → Nhật bằng từ của bài (10 câu)",
        "kind": "translate",
        "grammar": "N1 に N2 が あります／います · V て ください · V て います",
        "items": [
          {
            "q": "Trong tủ lạnh có bia.",
            "answers": [
              "冷蔵庫の中にビールがあります。",
              "冷蔵庫のなかにビールがあります。",
              "れいぞうこの中にビールがあります。",
              "れいぞうこのなかにビールがあります。"
            ],
            "hint": "N1 に N2 が あります"
          },
          {
            "q": "Con chó ở dưới gốc cây.",
            "answers": [
              "犬は木の下にいます。",
              "犬は木のしたにいます。",
              "犬はきの下にいます。",
              "犬はきのしたにいます。",
              "いぬは木の下にいます。",
              "いぬは木のしたにいます。",
              "いぬはきの下にいます。",
              "いぬはきのしたにいます。"
            ],
            "hint": "N1 は N2 に います"
          },
          {
            "q": "Trước ga có đồn công an.",
            "answers": [
              "駅の前に交番があります。",
              "駅の前にこうばんがあります。",
              "駅のまえに交番があります。",
              "駅のまえにこうばんがあります。",
              "えきの前に交番があります。",
              "えきの前にこうばんがあります。",
              "えきのまえに交番があります。",
              "えきのまえにこうばんがあります。"
            ],
            "hint": "N1 に N2 が あります"
          },
          {
            "q": "Bên cạnh ngân hàng có hiệu sách.",
            "answers": [
              "銀行の隣に本屋があります。",
              "銀行の隣にほんやがあります。",
              "銀行のとなりに本屋があります。",
              "銀行のとなりにほんやがあります。",
              "ぎんこうの隣に本屋があります。",
              "ぎんこうの隣にほんやがあります。",
              "ぎんこうのとなりに本屋があります。",
              "ぎんこうのとなりにほんやがあります。",
              "銀行の横に本屋があります。",
              "銀行の横にほんやがあります。",
              "銀行のよこに本屋があります。",
              "銀行のよこにほんやがあります。",
              "ぎんこうの横に本屋があります。",
              "ぎんこうの横にほんやがあります。",
              "ぎんこうのよこに本屋があります。",
              "ぎんこうのよこにほんやがあります。"
            ],
            "hint": "隣 / 横"
          },
          {
            "q": "Hãy cho muối vào.",
            "answers": [
              "塩を入れてください。",
              "塩をいれてください。",
              "しおを入れてください。",
              "しおをいれてください。"
            ],
            "hint": "V て ください · 入れます"
          },
          {
            "q": "Xin lỗi, hãy cho tôi mượn con dao.",
            "answers": [
              "すみませんが、ナイフを貸してください。",
              "すみませんが、ナイフをかしてください。"
            ],
            "hint": "すみませんが · 貸して ください"
          },
          {
            "q": "Tôi đang rửa đĩa ở bếp.",
            "answers": [
              "台所でお皿を洗っています。",
              "台所でお皿をあらっています。",
              "台所でおさらを洗っています。",
              "台所でおさらをあらっています。",
              "だいどころでお皿を洗っています。",
              "だいどころでお皿をあらっています。",
              "だいどころでおさらを洗っています。",
              "だいどころでおさらをあらっています。",
              "台所で皿を洗っています。",
              "台所で皿をあらっています。",
              "台所でさらを洗っています。",
              "台所でさらをあらっています。",
              "だいどころで皿を洗っています。",
              "だいどころで皿をあらっています。",
              "だいどころでさらを洗っています。",
              "だいどころでさらをあらっています。"
            ],
            "hint": "V て います"
          },
          {
            "q": "Tôi hát một bài hát.",
            "answers": [
              "歌を歌います。",
              "歌をうたいます。",
              "うたを歌います。",
              "うたをうたいます。",
              "私は歌を歌います。",
              "私は歌をうたいます。",
              "私はうたを歌います。",
              "私はうたをうたいます。",
              "わたしは歌を歌います。",
              "わたしは歌をうたいます。",
              "わたしはうたを歌います。",
              "わたしはうたをうたいます。"
            ],
            "hint": "歌を歌います"
          },
          {
            "q": "Ai đang gọi điện thoại?",
            "answers": [
              "だれが電話をかけていますか。",
              "だれがでんわをかけていますか。",
              "誰が電話をかけていますか。",
              "誰がでんわをかけていますか。"
            ],
            "hint": "誰が · かけて います"
          },
          {
            "q": "Trên bàn có nhiều đĩa.",
            "answers": [
              "テーブルの上にお皿がたくさんあります。",
              "テーブルの上におさらがたくさんあります。",
              "テーブルのうえにお皿がたくさんあります。",
              "テーブルのうえにおさらがたくさんあります。"
            ],
            "hint": "たくさん あります"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-tv-ghep",
        "title": "Ghép câu bằng từ vựng Bài 7 (6 câu)",
        "items": [
          {
            "vi": "Trong tủ lạnh có bia.",
            "chips": [
              "ビールが",
              "{冷蔵庫|れいぞうこ}の",
              "{中|なか}に",
              "います",
              "あります"
            ],
            "answer": [
              "{冷蔵庫|れいぞうこ}の",
              "{中|なか}に",
              "ビールが",
              "あります"
            ],
            "ro": "Reizouko no naka ni biiru ga arimasu."
          },
          {
            "vi": "Con chó ở dưới cái cây.",
            "chips": [
              "{犬|いぬ}は",
              "います",
              "あります",
              "{下|した}に",
              "{木|き}の"
            ],
            "answer": [
              "{犬|いぬ}は",
              "{木|き}の",
              "{下|した}に",
              "います"
            ],
            "ro": "Inu wa ki no shita ni imasu."
          },
          {
            "vi": "Trước ga có thùng thư.",
            "chips": [
              "{前|まえ}に",
              "あります",
              "います",
              "{駅|えき}の",
              "ポストが"
            ],
            "answer": [
              "{駅|えき}の",
              "{前|まえ}に",
              "ポストが",
              "あります"
            ],
            "ro": "Eki no mae ni posuto ga arimasu."
          },
          {
            "vi": "Ở nhà bếp có tủ lạnh.",
            "chips": [
              "{台所|だいどころ}に",
              "{冷蔵庫|れいぞうこ}が",
              "います",
              "あります"
            ],
            "answer": [
              "{台所|だいどころ}に",
              "{冷蔵庫|れいぞうこ}が",
              "あります"
            ],
            "ro": "Daidokoro ni reizouko ga arimasu."
          },
          {
            "vi": "Hãy đóng cửa sổ.",
            "chips": [
              "{開|あ}けて",
              "ください",
              "{窓|まど}を",
              "{閉|し}めて"
            ],
            "answer": [
              "{窓|まど}を",
              "{閉|し}めて",
              "ください"
            ],
            "ro": "Mado o shimete kudasai."
          },
          {
            "vi": "Tôi chơi ghi ta.",
            "chips": [
              "{吸|す}います",
              "{弾|ひ}きます",
              "ギターを"
            ],
            "answer": [
              "ギターを",
              "{弾|ひ}きます"
            ],
            "ro": "Gitaa o hikimasu."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b7-chu-han",
    "kind": "kanji",
    "title": "Luyện thêm Bài 7 · Chữ Hán của lớp (言貝田力門寺肉料理野半大小) — đọc · nghĩa · chọn chữ · đọc không furigana",
    "goal": "Đọc đúng, hiểu nghĩa 13 chữ Hán của lớp Bài 7 và các từ ghép, chọn đúng chữ giữa các chữ na ná (門/間/聞, 寺/時/持, 大/太/犬), và đọc câu/đoạn không furigana như đề thi.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Học **chữ theo từ**: 料理 りょうり, 野菜 やさい, 大学 だいがく. Gặp chữ mới trong đề: tách ra thành phần chữ quen (料 = 米 + 斗, 理 = 王 + 里; 門 = hai cánh cửa).",
          "Chữ **na ná** hay làm bẫy: 門・間・聞・開 (cùng bộ 門) · 寺・時・待・持 · 大・太・犬 · 貝・見・目. Mỗi lần sai, viết chữ đúng 5 lần kèm từ.",
          "Mức Khó không furigana. Chỉ dùng chữ đã học đến Bài 7; còn lại viết hiragana như đề thi."
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
            "言",
            "nói; lời nói",
            "NGÔN — On ゲン・ゴン · Kun い(う)・こと",
            "言います · 言葉"
          ],
          [
            "貝",
            "con sò, vỏ sò",
            "BỐI — Kun かい",
            "貝"
          ],
          [
            "田",
            "ruộng lúa",
            "ĐIỀN — On デン · Kun た",
            "田んぼ · 山田 · 田中"
          ],
          [
            "力",
            "sức lực",
            "LỰC — On リョク・リキ · Kun ちから",
            "力"
          ],
          [
            "門",
            "cổng",
            "MÔN — On モン",
            "門 · 大学の門"
          ],
          [
            "寺",
            "chùa",
            "TỰ — On ジ · Kun てら",
            "お寺"
          ],
          [
            "肉",
            "thịt",
            "NHỤC — On ニク",
            "肉 · 焼き肉"
          ],
          [
            "料",
            "nguyên liệu; phí (trong 料理)",
            "LIỆU — On リョウ",
            "料理"
          ],
          [
            "理",
            "lý; sắp xếp (trong 料理)",
            "LÝ — On リ",
            "料理"
          ],
          [
            "野",
            "cánh đồng",
            "DÃ — On ヤ · Kun の",
            "野菜 · 野球"
          ],
          [
            "半",
            "một nửa",
            "BÁN — On ハン",
            "半分 · 八時半"
          ],
          [
            "大",
            "to, lớn",
            "ĐẠI — On ダイ・タイ · Kun おお(きい)",
            "大きい · 大学"
          ],
          [
            "小",
            "nhỏ",
            "TIỂU — On ショウ · Kun ちい(さい)",
            "小さい · 小学生"
          ]
        ],
        "caption": "13 chữ Hán của lớp Bài 7"
      },
      {
        "t": "mcq",
        "id": "lt-b7-kj-nghia",
        "title": "Chữ → nghĩa (13 câu)",
        "items": [
          {
            "q": "Chữ 「言」 mang nghĩa nào?",
            "options": [
              "lý; sắp xếp (trong 料理)",
              "ruộng lúa",
              "nói; lời nói",
              "chùa"
            ],
            "correct": 2,
            "why": "**言** = nói; lời nói (NGÔN — On ゲン・ゴン · Kun い(う)・こと). Hay gặp: 言います · 言葉."
          },
          {
            "q": "Chữ 「貝」 mang nghĩa nào?",
            "options": [
              "sức lực",
              "cánh đồng",
              "thịt",
              "con sò, vỏ sò"
            ],
            "correct": 3,
            "why": "**貝** = con sò, vỏ sò (BỐI — Kun かい). Hay gặp: 貝."
          },
          {
            "q": "Chữ 「田」 mang nghĩa nào?",
            "options": [
              "cổng",
              "nguyên liệu; phí (trong 料理)",
              "ruộng lúa",
              "một nửa"
            ],
            "correct": 2,
            "why": "**田** = ruộng lúa (ĐIỀN — On デン · Kun た). Hay gặp: 田んぼ · 山田 · 田中."
          },
          {
            "q": "Chữ 「力」 mang nghĩa nào?",
            "options": [
              "sức lực",
              "chùa",
              "to, lớn",
              "lý; sắp xếp (trong 料理)"
            ],
            "correct": 0,
            "why": "**力** = sức lực (LỰC — On リョク・リキ · Kun ちから). Hay gặp: 力."
          },
          {
            "q": "Chữ 「門」 mang nghĩa nào?",
            "options": [
              "cổng",
              "cánh đồng",
              "thịt",
              "nhỏ"
            ],
            "correct": 0,
            "why": "**門** = cổng (MÔN — On モン). Hay gặp: 門 · 大学の門."
          },
          {
            "q": "Chữ 「寺」 mang nghĩa nào?",
            "options": [
              "một nửa",
              "nguyên liệu; phí (trong 料理)",
              "nói; lời nói",
              "chùa"
            ],
            "correct": 3,
            "why": "**寺** = chùa (TỰ — On ジ · Kun てら). Hay gặp: お寺."
          },
          {
            "q": "Chữ 「肉」 mang nghĩa nào?",
            "options": [
              "con sò, vỏ sò",
              "thịt",
              "to, lớn",
              "lý; sắp xếp (trong 料理)"
            ],
            "correct": 1,
            "why": "**肉** = thịt (NHỤC — On ニク). Hay gặp: 肉 · 焼き肉."
          },
          {
            "q": "Chữ 「料」 mang nghĩa nào?",
            "options": [
              "nhỏ",
              "ruộng lúa",
              "nguyên liệu; phí (trong 料理)",
              "cánh đồng"
            ],
            "correct": 2,
            "why": "**料** = nguyên liệu; phí (trong 料理) (LIỆU — On リョウ). Hay gặp: 料理."
          },
          {
            "q": "Chữ 「理」 mang nghĩa nào?",
            "options": [
              "lý; sắp xếp (trong 料理)",
              "nói; lời nói",
              "một nửa",
              "sức lực"
            ],
            "correct": 0,
            "why": "**理** = lý; sắp xếp (trong 料理) (LÝ — On リ). Hay gặp: 料理."
          },
          {
            "q": "Chữ 「野」 mang nghĩa nào?",
            "options": [
              "to, lớn",
              "con sò, vỏ sò",
              "cổng",
              "cánh đồng"
            ],
            "correct": 3,
            "why": "**野** = cánh đồng (DÃ — On ヤ · Kun の). Hay gặp: 野菜 · 野球."
          },
          {
            "q": "Chữ 「半」 mang nghĩa nào?",
            "options": [
              "chùa",
              "nhỏ",
              "một nửa",
              "ruộng lúa"
            ],
            "correct": 2,
            "why": "**半** = một nửa (BÁN — On ハン). Hay gặp: 半分 · 八時半."
          },
          {
            "q": "Chữ 「大」 mang nghĩa nào?",
            "options": [
              "sức lực",
              "nói; lời nói",
              "to, lớn",
              "thịt"
            ],
            "correct": 2,
            "why": "**大** = to, lớn (ĐẠI — On ダイ・タイ · Kun おお(きい)). Hay gặp: 大きい · 大学."
          },
          {
            "q": "Chữ 「小」 mang nghĩa nào?",
            "options": [
              "nhỏ",
              "nguyên liệu; phí (trong 料理)",
              "cổng",
              "con sò, vỏ sò"
            ],
            "correct": 0,
            "why": "**小** = nhỏ (TIỂU — On ショウ · Kun ちい(さい)). Hay gặp: 小さい · 小学生."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-kj-nghia2",
        "title": "Nghĩa → chữ (13 câu)",
        "items": [
          {
            "q": "Chữ nào có nghĩa \"nói; lời nói\"?",
            "options": [
              "肉",
              "力",
              "言",
              "野"
            ],
            "correct": 2,
            "why": "**言** = nói; lời nói (NGÔN — On ゲン・ゴン · Kun い(う)・こと). Hay gặp: 言います · 言葉."
          },
          {
            "q": "Chữ nào có nghĩa \"con sò, vỏ sò\"?",
            "options": [
              "料",
              "貝",
              "門",
              "半"
            ],
            "correct": 1,
            "why": "**貝** = con sò, vỏ sò (BỐI — Kun かい). Hay gặp: 貝."
          },
          {
            "q": "Chữ nào có nghĩa \"ruộng lúa\"?",
            "options": [
              "田",
              "理",
              "寺",
              "大"
            ],
            "correct": 0,
            "why": "**田** = ruộng lúa (ĐIỀN — On デン · Kun た). Hay gặp: 田んぼ · 山田 · 田中."
          },
          {
            "q": "Chữ nào có nghĩa \"sức lực\"?",
            "options": [
              "野",
              "力",
              "小",
              "肉"
            ],
            "correct": 1,
            "why": "**力** = sức lực (LỰC — On リョク・リキ · Kun ちから). Hay gặp: 力."
          },
          {
            "q": "Chữ nào có nghĩa \"cổng\"?",
            "options": [
              "料",
              "半",
              "門",
              "言"
            ],
            "correct": 2,
            "why": "**門** = cổng (MÔN — On モン). Hay gặp: 門 · 大学の門."
          },
          {
            "q": "Chữ nào có nghĩa \"chùa\"?",
            "options": [
              "理",
              "貝",
              "大",
              "寺"
            ],
            "correct": 3,
            "why": "**寺** = chùa (TỰ — On ジ · Kun てら). Hay gặp: お寺."
          },
          {
            "q": "Chữ nào có nghĩa \"thịt\"?",
            "options": [
              "小",
              "野",
              "田",
              "肉"
            ],
            "correct": 3,
            "why": "**肉** = thịt (NHỤC — On ニク). Hay gặp: 肉 · 焼き肉."
          },
          {
            "q": "Chữ nào có nghĩa \"nguyên liệu; phí (trong 料理)\"?",
            "options": [
              "力",
              "半",
              "料",
              "言"
            ],
            "correct": 2,
            "why": "**料** = nguyên liệu; phí (trong 料理) (LIỆU — On リョウ). Hay gặp: 料理."
          },
          {
            "q": "Chữ nào có nghĩa \"lý; sắp xếp (trong 料理)\"?",
            "options": [
              "貝",
              "理",
              "大",
              "門"
            ],
            "correct": 1,
            "why": "**理** = lý; sắp xếp (trong 料理) (LÝ — On リ). Hay gặp: 料理."
          },
          {
            "q": "Chữ nào có nghĩa \"cánh đồng\"?",
            "options": [
              "寺",
              "田",
              "野",
              "小"
            ],
            "correct": 2,
            "why": "**野** = cánh đồng (DÃ — On ヤ · Kun の). Hay gặp: 野菜 · 野球."
          },
          {
            "q": "Chữ nào có nghĩa \"một nửa\"?",
            "options": [
              "力",
              "言",
              "肉",
              "半"
            ],
            "correct": 3,
            "why": "**半** = một nửa (BÁN — On ハン). Hay gặp: 半分 · 八時半."
          },
          {
            "q": "Chữ nào có nghĩa \"to, lớn\"?",
            "options": [
              "貝",
              "料",
              "門",
              "大"
            ],
            "correct": 3,
            "why": "**大** = to, lớn (ĐẠI — On ダイ・タイ · Kun おお(きい)). Hay gặp: 大きい · 大学."
          },
          {
            "q": "Chữ nào có nghĩa \"nhỏ\"?",
            "options": [
              "小",
              "寺",
              "田",
              "理"
            ],
            "correct": 0,
            "why": "**小** = nhỏ (TIỂU — On ショウ · Kun ちい(さい)). Hay gặp: 小さい · 小学生."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-kj-doc",
        "title": "Đọc từ ghép / động từ (20 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　【言います】",
            "options": [
              "げんます (genmasu)",
              "ごんます (gonmasu)",
              "ことます (kotomasu)",
              "いいます (iimasu)"
            ],
            "correct": 3,
            "why": "言 + います → いいます (nói). Cả câu: 【言います】 〔[iimasu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【言葉】",
            "options": [
              "げんば (genba)",
              "いいば (iiba)",
              "ことはっぱ (kotohappa)",
              "ことば (kotoba)"
            ],
            "correct": 3,
            "why": "言葉 = từ, lời (ことば) — từ đặc biệt. Cả câu: 【言葉】 〔[kotoba]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【山田】",
            "options": [
              "さんでん (sanden)",
              "やまでん (yamaden)",
              "やまた (yamata)",
              "やまだ (yamada)"
            ],
            "correct": 3,
            "why": "山田 (họ Yamada): 田 đọc だ khi ghép sau 山. Cả câu: 【山田】 〔[yamada]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【田中】",
            "options": [
              "たなか (tanaka)",
              "たなが (tanaga)",
              "たちゅう (tachuu)",
              "でんちゅう (denchuu)"
            ],
            "correct": 0,
            "why": "田中 (họ Tanaka): 田 = た, 中 = なか. Cả câu: 【田中】 〔[tanaka]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【田んぼ】",
            "options": [
              "でんぼ (denbo)",
              "だんぼ (danbo)",
              "たんぼ (tanbo)",
              "たぼ (tabo)"
            ],
            "correct": 2,
            "why": "田んぼ = ruộng lúa. Cả câu: 【田んぼ】 〔[tanbo]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【力】",
            "options": [
              "ちか (chika)",
              "りょく (ryoku)",
              "りき (riki)",
              "ちから (chikara)"
            ],
            "correct": 3,
            "why": "力 đứng riêng đọc ちから. Cả câu: 【力】 〔[chikara]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【門】",
            "options": [
              "ぶん (bun)",
              "かど (kado)",
              "もん (mon)",
              "もんい (mon'i)"
            ],
            "correct": 2,
            "why": "門 = cổng (もん). Cả câu: 【門】 〔[mon]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【お寺】",
            "options": [
              "おてら (otera)",
              "おつら (otsura)",
              "おじ (oji)",
              "おでら (odera)"
            ],
            "correct": 0,
            "why": "お寺 = ngôi chùa; 寺 đứng riêng đọc てら. Cả câu: 【お寺】 〔[otera]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【肉】",
            "options": [
              "ひく (hiku)",
              "にこ (niko)",
              "じく (jiku)",
              "にく (niku)"
            ],
            "correct": 3,
            "why": "肉 = thịt. Cả câu: 【肉】 〔[niku]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【焼き肉】",
            "options": [
              "しょうにく (shouniku)",
              "やきじく (yakijiku)",
              "やきにく (yakiniku)",
              "やきにこ (yakiniko)"
            ],
            "correct": 2,
            "why": "焼き肉 = thịt nướng. Cả câu: 【焼き肉】 〔[yakiniku]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【料理】",
            "options": [
              "りょうい (ryoui)",
              "りょうり (ryouri)",
              "りょり (ryori)",
              "りゅうり (ryuuri)"
            ],
            "correct": 1,
            "why": "料 = りょう, 理 = り → món ăn, nấu ăn. Cả câu: 【料理】 〔[ryouri]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【野菜】",
            "options": [
              "やなさい (yanasai)",
              "やざい (yazai)",
              "のさい (nosai)",
              "やさい (yasai)"
            ],
            "correct": 3,
            "why": "野菜 = rau củ. Cả câu: 【野菜】 〔[yasai]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【野球】",
            "options": [
              "やきゅう (yakyuu)",
              "のたま (notama)",
              "やきゅ (yakyu)",
              "やたま (yatama)"
            ],
            "correct": 0,
            "why": "野球 = bóng chày. Cả câu: 【野球】 〔[yakyuu]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【半分】",
            "options": [
              "はんぶん (hanbun)",
              "ほんぶん (honbun)",
              "はんぷん (hanpun)",
              "はんふん (hanfun)"
            ],
            "correct": 0,
            "why": "半分 = một nửa; 分 đọc ぶん ở đây. Cả câu: 【半分】 〔[hanbun]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【八時半】",
            "options": [
              "はちじなかば (hachijinakaba)",
              "はちじばん (hachijiban)",
              "はちじはん (hachijihan)",
              "はちじぶん (hachijibun)"
            ],
            "correct": 2,
            "why": "半 = はん: 8 giờ rưỡi. Cả câu: 【八時半】 〔[hachijihan]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【大きい】",
            "options": [
              "だいきい (daikii)",
              "ふときい (futokii)",
              "たいきい (taikii)",
              "おおきい (ookii)"
            ],
            "correct": 3,
            "why": "大きい = to (Kun おお). Cả câu: 【大きい】 〔[ookii]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【大学】",
            "options": [
              "たいがく (taigaku)",
              "だいかく (daikaku)",
              "おおがく (oogaku)",
              "だいがく (daigaku)"
            ],
            "correct": 3,
            "why": "大 = だい (On) trong 大学. Cả câu: 【大学】 〔[daigaku]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【小さい】",
            "options": [
              "おさい (osai)",
              "ちいさい (chiisai)",
              "しょうさい (shousai)",
              "こさい (kosai)"
            ],
            "correct": 1,
            "why": "小さい = nhỏ (Kun ちい). Cả câu: 【小さい】 〔[chiisai]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【小学生】",
            "options": [
              "しょうがくせい (shougakusei)",
              "ちいがくせい (chiigakusei)",
              "しょがくせい (shogakusei)",
              "こがくせい (kogakusei)"
            ],
            "correct": 0,
            "why": "小 = しょう (On): học sinh tiểu học. Cả câu: 【小学生】 〔[shougakusei]〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【貝】",
            "options": [
              "かい (kai)",
              "かえ (kae)",
              "ばい (bai)",
              "みぎ (migi)"
            ],
            "correct": 0,
            "why": "貝 = con sò (かい). Cả câu: 【貝】 〔[kai]〕"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn chữ đúng · điền chữ vào câu · On hay Kun"
      },
      {
        "t": "mcq",
        "id": "lt-b7-kj-chon-chu",
        "title": "Chọn cách viết đúng (12 câu)",
        "items": [
          {
            "q": "Chọn cách viết đúng: いいます (nói)",
            "options": [
              "話います",
              "言います",
              "計います",
              "語います"
            ],
            "correct": 1,
            "why": "言 (ngôn). 計・話・語 là chữ na ná hoặc khác nghĩa."
          },
          {
            "q": "Chọn cách viết đúng: おてら (ngôi chùa)",
            "options": [
              "お寺",
              "お持",
              "お時",
              "お待"
            ],
            "correct": 0,
            "why": "寺 (chùa); 時・待・持 có bộ 寺 nhưng khác nghĩa."
          },
          {
            "q": "Chọn cách viết đúng: りょうり (nấu ăn)",
            "options": [
              "料理",
              "科理",
              "斗理",
              "料里"
            ],
            "correct": 0,
            "why": "料 + 理."
          },
          {
            "q": "Chọn cách viết đúng: やさい (rau)",
            "options": [
              "野菜",
              "里菜",
              "野采",
              "予菜"
            ],
            "correct": 0,
            "why": "野 + 菜."
          },
          {
            "q": "Chọn cách viết đúng: もん (cổng)",
            "options": [
              "間",
              "門",
              "開",
              "聞"
            ],
            "correct": 1,
            "why": "門 (cổng). 間・聞・開 chứa 門 bên trong nhưng đọc và nghĩa khác."
          },
          {
            "q": "Chọn cách viết đúng: ちから (sức)",
            "options": [
              "方",
              "力",
              "九",
              "刀"
            ],
            "correct": 1,
            "why": "力 (lực) — nét hất cuối; 刀 là dao."
          },
          {
            "q": "Chọn cách viết đúng: かい (con sò)",
            "options": [
              "目",
              "具",
              "貝",
              "見"
            ],
            "correct": 2,
            "why": "貝 — hai chân dài ở dưới; 見 có thêm nét."
          },
          {
            "q": "Chọn cách viết đúng: たんぼ (ruộng lúa)",
            "options": [
              "由んぼ",
              "田んぼ",
              "甲んぼ",
              "申んぼ"
            ],
            "correct": 1,
            "why": "田 — ô vuông có chữ thập."
          },
          {
            "q": "Chọn cách viết đúng: はんぶん (một nửa)",
            "options": [
              "半分",
              "平分",
              "羊分",
              "年分"
            ],
            "correct": 0,
            "why": "半 (bán)."
          },
          {
            "q": "Chọn cách viết đúng: おおきい (to)",
            "options": [
              "太きい",
              "木きい",
              "犬きい",
              "大きい"
            ],
            "correct": 3,
            "why": "大; 太 thêm chấm, 犬 thêm chấm trên."
          },
          {
            "q": "Chọn cách viết đúng: ちいさい (nhỏ)",
            "options": [
              "少さい",
              "川さい",
              "小さい",
              "水さい"
            ],
            "correct": 2,
            "why": "小 — ba nét."
          },
          {
            "q": "Chọn cách viết đúng: にく (thịt)",
            "options": [
              "円",
              "同",
              "内",
              "肉"
            ],
            "correct": 3,
            "why": "肉 (nhục) có hai chữ 人 bên trong."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-kj-dien-chu",
        "title": "Điền chữ Hán vào chỗ trống (10 câu)",
        "items": [
          {
            "q": "スーパーで＿＿とやさいを買いました。　〔Suupaa de __ to yasai o kaimashita.〕",
            "options": [
              "内",
              "円",
              "肉",
              "力"
            ],
            "correct": 2,
            "why": "肉. → **スーパーで{肉|にく}とやさいを{買|か}いました。** 〔Suupaa de niku to yasai o kaimashita.〕 — Tôi mua thịt và rau ở siêu thị."
          },
          {
            "q": "お寺の＿＿のまえでしゃしんをとります。　〔Otera no __ no mae de shashin o torimasu.〕",
            "options": [
              "門",
              "間",
              "開",
              "聞"
            ],
            "correct": 0,
            "why": "門. → **お{寺|てら}の{門|もん}のまえでしゃしんをとります。** 〔Otera no mon no mae de shashin o torimasu.〕 — Chụp ảnh trước cổng chùa."
          },
          {
            "q": "（①）きいかばんと（②）さいかばんがあります。　〔((1)) kii kaban to ((2)) sai kaban ga arimasu.〕",
            "options": [
              "① 太　② 小",
              "① 小　② 大",
              "① 大　② 小",
              "① 大　② 少"
            ],
            "correct": 2,
            "why": "大きい · 小さい. → **{大|おお}きいかばんと{小|ちい}さいかばんがあります。** 〔Oo kii kaban to chii sai kaban ga arimasu.〕 — Có cặp to và cặp nhỏ."
          },
          {
            "q": "私のおかあさんは＿＿がじょうずです。　〔Watashi no okaasan wa __ ga jouzu desu.〕",
            "options": [
              "言葉",
              "料理",
              "野菜",
              "料金"
            ],
            "correct": 1,
            "why": "料理 = nấu ăn. → **{私|わたし}のおかあさんは{料理|りょうり}がじょうずです。** 〔Watashi no okaasan wa ryouri ga jouzu desu.〕 — Mẹ tôi nấu ăn giỏi."
          },
          {
            "q": "ケーキを＿＿食べました。　〔Keeki o __ tabemashita.〕",
            "options": [
              "全部",
              "大分",
              "小分",
              "半分"
            ],
            "correct": 3,
            "why": "半分. → **ケーキを{半分|はんぶん}{食|た}べました。** 〔Keeki o hanbun tabemashita.〕 — Tôi đã ăn một nửa cái bánh."
          },
          {
            "q": "「ありがとう」はベトナム語で何と＿＿か。　〔\"arigatou\" wa betonamugo de nan to __ ka.〕",
            "options": [
              "言いますか",
              "読みますか",
              "計いますか",
              "話いますか"
            ],
            "correct": 0,
            "why": "言います. → **「ありがとう」はベトナム{語|ご}で{何|なん}と{言|い}いますかか。** 〔\"arigatou\" wa betonamugo de nan to iimasu ka ka.〕 — \"Arigatou\" tiếng Việt nói thế nào?"
          },
          {
            "q": "田んぼの＿＿に水があります。　〔Tanbo no __ ni mizu ga arimasu.〕",
            "options": [
              "中",
              "肉",
              "力",
              "寺"
            ],
            "correct": 0,
            "why": "中. → **{田|た}んぼの{中|なか}に{水|みず}があります。** 〔Tanbo no naka ni mizu ga arimasu.〕 — Trong ruộng có nước."
          },
          {
            "q": "＿＿きゅうのしあいは九時からです。　〔__ kyuu no shiai wa kuji kara desu.〕",
            "options": [
              "貝",
              "予",
              "野",
              "里"
            ],
            "correct": 2,
            "why": "野球. → **{野|や}きゅうのしあいは{九時|くじ}からです。** 〔Ya kyuu no shiai wa kuji kara desu.〕 — Trận bóng chày từ 9 giờ."
          },
          {
            "q": "私のいもうとは＿＿がくせいです。　〔Watashi no imouto wa __ gakusei desu.〕",
            "options": [
              "小",
              "少",
              "水",
              "大"
            ],
            "correct": 0,
            "why": "小学生. → **{私|わたし}のいもうとは{小|しょう}がくせいです。** 〔Watashi no imouto wa shou gakusei desu.〕 — Em gái tôi là học sinh tiểu học."
          },
          {
            "q": "八時＿＿に会社へ行きます。　〔Hachiji__ ni kaisha e ikimasu.〕",
            "options": [
              "半",
              "羊",
              "年",
              "平"
            ],
            "correct": 0,
            "why": "八時半. → **{八時|はちじ}{半|はん}に{会社|かいしゃ}へ{行|い}きます。** 〔Hachijihan ni kaisha e ikimasu.〕 — Tôi đến công ty lúc 8 rưỡi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-kj-on-kun",
        "title": "Cùng một chữ, đọc khác nhau tuỳ từ (12 câu)",
        "items": [
          {
            "q": "Chữ 「大」 trong 「大学」 đọc là gì?",
            "options": [
              "ふと",
              "おお",
              "だい",
              "たい"
            ],
            "correct": 2,
            "why": "Từ ghép On: 大 = だい."
          },
          {
            "q": "Chữ 「大」 trong 「大きい」 đọc là gì?",
            "options": [
              "たい",
              "だい",
              "ふと",
              "おお"
            ],
            "correct": 3,
            "why": "Đuôi kana: 大 = おお(きい)."
          },
          {
            "q": "Chữ 「小」 trong 「小学生」 đọc là gì?",
            "options": [
              "こ",
              "しょう",
              "ちい",
              "お"
            ],
            "correct": 1,
            "why": "Từ ghép On: 小 = しょう."
          },
          {
            "q": "Chữ 「小」 trong 「小さい」 đọc là gì?",
            "options": [
              "こ",
              "お",
              "ちい",
              "しょう"
            ],
            "correct": 2,
            "why": "Đuôi kana: 小 = ちい(さい)."
          },
          {
            "q": "Chữ 「言」 trong 「言葉」 đọc là gì?",
            "options": [
              "ごん",
              "こと",
              "い",
              "げん"
            ],
            "correct": 1,
            "why": "言葉 là từ đặc biệt: 言 = こと."
          },
          {
            "q": "Chữ 「言」 trong 「言います」 đọc là gì?",
            "options": [
              "こと",
              "げん",
              "い",
              "ごん"
            ],
            "correct": 2,
            "why": "言います: 言 = い(う)."
          },
          {
            "q": "Chữ 「野」 trong 「野菜」 đọc là gì?",
            "options": [
              "ぬ",
              "ちゃ",
              "や",
              "の"
            ],
            "correct": 2,
            "why": "Trong từ ghép: 野 = や."
          },
          {
            "q": "Chữ 「田」 trong 「山田」 đọc là gì?",
            "options": [
              "だ",
              "でん",
              "た",
              "ちん"
            ],
            "correct": 0,
            "why": "山田: 田 đọc だ (biến âm)."
          },
          {
            "q": "Chữ 「田」 trong 「田中」 đọc là gì?",
            "options": [
              "だ",
              "ちん",
              "た",
              "でん"
            ],
            "correct": 2,
            "why": "田中: 田 đọc た."
          },
          {
            "q": "Chữ 「理」 trong 「料理」 đọc là gì?",
            "options": [
              "ことわり",
              "り",
              "ごり",
              "ろ"
            ],
            "correct": 1,
            "why": "理 = り (On)."
          },
          {
            "q": "Chữ 「分」 trong 「半分」 đọc là gì?",
            "options": [
              "ふん",
              "ぷん",
              "わ",
              "ぶん"
            ],
            "correct": 3,
            "why": "半分: 分 đọc ぶん (không phải ふん/ぷん)."
          },
          {
            "q": "Chữ 「寺」 trong 「お寺」 đọc là gì?",
            "options": [
              "じ",
              "てら",
              "し",
              "てい"
            ],
            "correct": 1,
            "why": "お寺: 寺 = てら (Kun)."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · không furigana — như đề thi"
      },
      {
        "t": "mcq",
        "id": "lt-b7-kj-doc-cau",
        "title": "Đọc đúng phần trong 【 】 (12 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　【言葉】を勉強します。",
            "options": [
              "いいば (iiba)",
              "げんば (genba)",
              "ごんば (gonba)",
              "ことば (kotoba)"
            ],
            "correct": 3,
            "why": "言葉 = ことば. Cả câu: 【言葉】を勉強します。 〔[kotoba] o benkyoushimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【野菜】を買います。",
            "options": [
              "やなさい (yanasai)",
              "のさい (nosai)",
              "やさい (yasai)",
              "やざい (yazai)"
            ],
            "correct": 2,
            "why": "野菜 = やさい. Cả câu: 【野菜】を買います。 〔[yasai] o kaimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【料理】の先生",
            "options": [
              "りょり (ryori)",
              "りょうり (ryouri)",
              "りょうい (ryoui)",
              "りゅうり (ryuuri)"
            ],
            "correct": 1,
            "why": "料理 = りょうり. Cả câu: 【料理】の先生 〔[ryouri] no sensei〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【半分】食べました。",
            "options": [
              "はんぷん (hanpun)",
              "ほんぶん (honbun)",
              "はんふん (hanfun)",
              "はんぶん (hanbun)"
            ],
            "correct": 3,
            "why": "半分 = はんぶん. Cả câu: 【半分】食べました。 〔[hanbun] tabemashita.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【大】きいかばん",
            "options": [
              "だい (dai)",
              "たい (tai)",
              "おお (oo)",
              "ふと (futo)"
            ],
            "correct": 2,
            "why": "大きい: 大 = おお. Cả câu: 【大】きいかばん 〔[oo]kii kaban〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【小学生】です。",
            "options": [
              "しょうがくせい (shougakusei)",
              "ちいがくせい (chiigakusei)",
              "こがくせい (kogakusei)",
              "しょがくせい (shogakusei)"
            ],
            "correct": 0,
            "why": "小学生. Cả câu: 【小学生】です。 〔[shougakusei] desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　お【寺】に行きます。",
            "options": [
              "し (shi)",
              "てら (tera)",
              "てい (tei)",
              "じ (ji)"
            ],
            "correct": 1,
            "why": "お寺 = おてら. Cả câu: お【寺】に行きます。 〔O[tera] ni ikimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【田中】さん",
            "options": [
              "たちゅう (tachuu)",
              "たなか (tanaka)",
              "でんちゅう (denchuu)",
              "たなが (tanaga)"
            ],
            "correct": 1,
            "why": "田中. Cả câu: 【田中】さん 〔[tanaka]san〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【山田】さん",
            "options": [
              "やまだ (yamada)",
              "やまた (yamata)",
              "さんでん (sanden)",
              "やまでん (yamaden)"
            ],
            "correct": 0,
            "why": "山田. Cả câu: 【山田】さん 〔[yamada]san〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【門】のまえ",
            "options": [
              "ひら (hira)",
              "ぶん (bun)",
              "もん (mon)",
              "かど (kado)"
            ],
            "correct": 2,
            "why": "門 = もん. Cả câu: 【門】のまえ 〔[mon] no mae〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【焼き肉】を食べます。",
            "options": [
              "やきじく (yakijiku)",
              "やきにこ (yakiniko)",
              "やきにく (yakiniku)",
              "しょうにく (shouniku)"
            ],
            "correct": 2,
            "why": "焼き肉. Cả câu: 【焼き肉】を食べます。 〔[yakiniku] o tabemasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【八時半】に会います。",
            "options": [
              "はちじはん (hachijihan)",
              "はちじばん (hachijiban)",
              "はちじぶん (hachijibun)",
              "はちじなかば (hachijinakaba)"
            ],
            "correct": 0,
            "why": "八時半. Cả câu: 【八時半】に会います。 〔[hachijihan] ni aimasu.〕"
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b7-kj-doc-cau-rk",
        "title": "Đọc to câu KHÔNG furigana, rồi bấm xem đáp án (20 câu)",
        "note": "Đọc to cả câu. Chỉ dùng chữ Hán đã học đến Bài 7.",
        "items": [
          {
            "text": "{山田|やまだ}さんは{大学|だいがく}の{先生|せんせい}です。",
            "ro": "Yamadasan wa daigaku no sensei desu.",
            "vi": "Anh Yamada là giáo viên đại học."
          },
          {
            "text": "{田中|たなか}さんは{料理|りょうり}がすきです。",
            "ro": "Tanakasan wa ryouri ga suki desu.",
            "vi": "Anh Tanaka thích nấu ăn."
          },
          {
            "text": "スーパーで{肉|にく}と{野菜|やさい}を{買|か}いました。",
            "ro": "Suupaa de niku to yasai o kaimashita.",
            "vi": "Tôi đã mua thịt và rau ở siêu thị."
          },
          {
            "text": "{東京|とうきょう}のお{寺|てら}は{大|おお}きいです。",
            "ro": "Toukyou no otera wa ookii desu.",
            "vi": "Chùa ở Tokyo to."
          },
          {
            "text": "{小|ちい}さい{門|もん}のまえで{会|あ}います。",
            "ro": "Chiisai mon no mae de aimasu.",
            "vi": "Chúng ta gặp trước cái cổng nhỏ."
          },
          {
            "text": "りんごを{半分|はんぶん}{食|た}べました。",
            "ro": "Ringo o hanbun tabemashita.",
            "vi": "Tôi đã ăn nửa quả táo."
          },
          {
            "text": "{日本語|にほんご}で{何|なん}と{言|い}いますか。",
            "ro": "Nihongo de nan to iimasu ka.",
            "vi": "Cái này tiếng Nhật nói thế nào?"
          },
          {
            "text": "{八時半|はちじはん}に{会社|かいしゃ}へ{行|い}きます。",
            "ro": "Hachijihan ni kaisha e ikimasu.",
            "vi": "Tôi đi đến công ty lúc 8 rưỡi."
          },
          {
            "text": "{野球|やきゅう}のしあいは{九時|くじ}からです。",
            "ro": "Yakyuu no shiai wa kuji kara desu.",
            "vi": "Trận bóng chày từ 9 giờ."
          },
          {
            "text": "{小学生|しょうがくせい}は{毎日|まいにち}がっこうへ{行|い}きます。",
            "ro": "Shougakusei wa mainichi gakkou e ikimasu.",
            "vi": "Học sinh tiểu học ngày nào cũng đến trường."
          },
          {
            "text": "{力|ちから}がある{人|ひと}です。",
            "ro": "Chikara ga aru hito desu.",
            "vi": "Đó là người có sức khoẻ."
          },
          {
            "text": "{田|た}んぼは{大|おお}きいです。",
            "ro": "Tanbo wa ookii desu.",
            "vi": "Ruộng lúa rộng."
          },
          {
            "text": "この{貝|かい}は{小|ちい}さいです。",
            "ro": "Kono kai wa chiisai desu.",
            "vi": "Con sò này nhỏ."
          },
          {
            "text": "{先週|せんしゅう}、{大学|だいがく}の{門|もん}のまえで{先生|せんせい}に{会|あ}いました。",
            "ro": "Senshuu, daigaku no mon no mae de sensei ni aimashita.",
            "vi": "Tuần trước tôi gặp cô giáo trước cổng đại học."
          },
          {
            "text": "{先生|せんせい}は「{読|よ}んでください」と{言|い}いました。",
            "ro": "Sensei wa \"yonde kudasai\" to iimashita.",
            "vi": "Cô giáo đã nói \"Hãy đọc\"."
          },
          {
            "text": "{毎日|まいにち}、{野菜|やさい}と{肉|にく}を{食|た}べます。",
            "ro": "Mainichi, yasai to niku o tabemasu.",
            "vi": "Ngày nào tôi cũng ăn rau và thịt."
          },
          {
            "text": "お{寺|てら}の{門|もん}は{大|おお}きいです。",
            "ro": "Otera no mon wa ookii desu.",
            "vi": "Cổng chùa to."
          },
          {
            "text": "{私|わたし}の{会社|かいしゃ}は{小|ちい}さいです。",
            "ro": "Watashi no kaisha wa chiisai desu.",
            "vi": "Công ty của tôi nhỏ."
          },
          {
            "text": "{料理|りょうり}の{先生|せんせい}は{日本人|にほんじん}です。",
            "ro": "Ryouri no sensei wa nihonjin desu.",
            "vi": "Cô giáo dạy nấu ăn là người Nhật."
          },
          {
            "text": "{大|おお}きい{肉|にく}を{半分|はんぶん}{食|た}べました。",
            "ro": "Ookii niku o hanbun tabemashita.",
            "vi": "Tôi đã ăn một nửa miếng thịt lớn."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b7-kj-doc-doan",
        "title": "Đọc to ĐOẠN văn ngắn không furigana (3 đoạn)",
        "items": [
          {
            "text": "{私|わたし}は{東京|とうきょう}のお{寺|てら}へ{行|い}きました。{大|おお}きい{門|もん}があります。{門|もん}のまえでしゃしんをとりました。{八時半|はちじはん}にかえりました。",
            "ro": "Watashi wa toukyou no otera e ikimashita. Ookii mon ga arimasu. Mon no mae de shashin o torimashita. Hachijihan ni kaerimashita.",
            "vi": "Tôi đã đến chùa ở Tokyo. Có cái cổng lớn. Tôi chụp ảnh trước cổng. 8 rưỡi tôi về."
          },
          {
            "text": "{田中|たなか}さんは{料理|りょうり}がすきです。まいにち{肉|にく}と{野菜|やさい}を{買|か}います。{日曜日|にちようび}はともだちといっしょに{料理|りょうり}をします。{小|ちい}さいいえですが、たのしいです。",
            "ro": "Tanakasan wa ryouri ga suki desu. Mainichi niku to yasai o kaimasu. Nichiyoubi wa tomodachi to issho ni ryouri o shimasu. Chiisai ie desu ga, tanoshii desu.",
            "vi": "Anh Tanaka thích nấu ăn. Ngày nào cũng mua thịt và rau. Chủ nhật nấu ăn cùng bạn. Nhà nhỏ nhưng vui."
          },
          {
            "text": "{野球|やきゅう}のしあいは{今日|きょう}の{午後|ごご}{一時半|いちじはん}からです。{大学|だいがく}の{門|もん}のまえで{会|あ}いましょう。{力|ちから}がある{人|ひと}が{半分|はんぶん}チケットをもちます。",
            "ro": "Yakyuu no shiai wa kyou no gogo ichijihan kara desu. Daigaku no mon no mae de aimashou. Chikara ga aru hito ga hanbun chiketto o mochimasu.",
            "vi": "Trận bóng chày bắt đầu từ 1 rưỡi chiều nay. Gặp nhau trước cổng đại học nhé. Người khoẻ sẽ cầm một nửa số vé."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b7-kj-tu-vung",
        "title": "Đọc chữ Hán trong từ vựng Bài 7 (32 từ)",
        "note": "Từ vựng của cô, không furigana. Chữ nào chưa nhớ thì mở lại bài chữ Hán Bài 7.",
        "items": [
          {
            "text": "{上|うえ}",
            "ro": "Ue",
            "vi": "trên"
          },
          {
            "text": "{下|した}",
            "ro": "Shita",
            "vi": "dưới"
          },
          {
            "text": "{中|なか}",
            "ro": "Naka",
            "vi": "trong"
          },
          {
            "text": "{外|そと}",
            "ro": "Soto",
            "vi": "ngoài"
          },
          {
            "text": "{前|まえ}",
            "ro": "Mae",
            "vi": "trước"
          },
          {
            "text": "{後|うし}ろ",
            "ro": "Ushiro",
            "vi": "sau"
          },
          {
            "text": "{横|よこ}",
            "ro": "Yoko",
            "vi": "bên cạnh"
          },
          {
            "text": "{隣|となり}",
            "ro": "Tonari",
            "vi": "bên cạnh (sát)"
          },
          {
            "text": "{近|ちか}く",
            "ro": "Chikaku",
            "vi": "gần"
          },
          {
            "text": "{間|あいだ}",
            "ro": "Aida",
            "vi": "giữa"
          },
          {
            "text": "{改札|かいさつ}",
            "ro": "Kaisatsu",
            "vi": "cổng soát vé"
          },
          {
            "text": "{交番|こうばん}",
            "ro": "Kouban",
            "vi": "đồn công an"
          },
          {
            "text": "バス{停|てい}",
            "ro": "Basutei",
            "vi": "trạm xe buýt"
          },
          {
            "text": "{自動販売機|じどうはんばいき}",
            "ro": "Jidouhanbaiki",
            "vi": "máy bán hàng tự động"
          },
          {
            "text": "{冷蔵庫|れいぞうこ}",
            "ro": "Reizouko",
            "vi": "tủ lạnh"
          },
          {
            "text": "{電子|でんし}レンジ",
            "ro": "Denshirenji",
            "vi": "lò vi sóng"
          },
          {
            "text": "{砂糖|さとう}",
            "ro": "Satou",
            "vi": "đường"
          },
          {
            "text": "{塩|しお}",
            "ro": "Shio",
            "vi": "muối"
          },
          {
            "text": "{漢字|かんじ}",
            "ro": "Kanji",
            "vi": "chữ Hán"
          },
          {
            "text": "{台所|だいどころ}",
            "ro": "Daidokoro",
            "vi": "bếp"
          },
          {
            "text": "{窓|まど}",
            "ro": "Mado",
            "vi": "cửa sổ"
          },
          {
            "text": "{電話|でんわ}",
            "ro": "Denwa",
            "vi": "điện thoại"
          },
          {
            "text": "{洗|あら}います",
            "ro": "Araimasu",
            "vi": "rửa"
          },
          {
            "text": "{置|お}きます",
            "ro": "Okimasu",
            "vi": "đặt"
          },
          {
            "text": "{貸|か}します",
            "ro": "Kashimasu",
            "vi": "cho mượn"
          },
          {
            "text": "{使|つか}います",
            "ro": "Tsukaimasu",
            "vi": "dùng"
          },
          {
            "text": "{手伝|てつだ}います",
            "ro": "Tetsudaimasu",
            "vi": "giúp"
          },
          {
            "text": "{取|と}ります",
            "ro": "Torimasu",
            "vi": "lấy"
          },
          {
            "text": "{持|も}って{来|き}ます",
            "ro": "Mottekimasu",
            "vi": "mang đến"
          },
          {
            "text": "{教|おし}えます",
            "ro": "Oshiemasu",
            "vi": "dạy"
          },
          {
            "text": "{吸|す}います",
            "ro": "Suimasu",
            "vi": "hút"
          },
          {
            "text": "{弾|ひ}きます",
            "ro": "Hikimasu",
            "vi": "chơi nhạc cụ"
          },
          {
            "text": "{開|あ}けます",
            "ro": "Akemasu",
            "vi": "mở"
          },
          {
            "text": "{閉|し}めます",
            "ro": "Shimemasu",
            "vi": "đóng"
          }
        ]
      },
      {
        "t": "write",
        "id": "lt-b7-kj-viet",
        "title": "Tập viết chữ Hán của lớp Bài 7 (13 chữ + 6 từ)",
        "chars": [
          "言",
          "貝",
          "田",
          "力",
          "門",
          "寺",
          "肉",
          "料",
          "理",
          "野",
          "半",
          "大",
          "小",
          "料理",
          "大学",
          "山田",
          "野球",
          "半分",
          "小学生"
        ],
        "goi": {
          "料理": "りょうり · nấu ăn",
          "大学": "だいがく · đại học",
          "山田": "やまだ · họ Yamada",
          "野球": "やきゅう · bóng chày",
          "半分": "はんぶん · một nửa",
          "小学生": "しょうがくせい · học sinh tiểu học"
        }
      }
    ]
  },
  {
    "id": "lt-b7-np-1",
    "kind": "homework",
    "title": "Luyện thêm Bài 7 · Ngữ pháp 1 (ポイント 61, 62, 68, 69, 70) — ở đâu · có gì · ai · cái nào + vị trí (~84 câu)",
    "goal": "Nói và hỏi vị trí/sự tồn tại đúng: N は N に います／あります, N に N が います／あります, 誰も／何も, 誰が, どの N／どれ và các từ chỉ vị trí (上 下 中 外 前 後ろ 横 隣 近く 間).",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Ba câu hỏi, ba đáp án**: *ở đâu?* → N は **N2 に** あります／います · *có gì/ai?* → N1 に **N2 が** あります／います · *cái nào?* → **どれ** (đứng một mình) / **どの + N**. Luôn hỏi mình: là NGƯỜI/CON VẬT (います) hay ĐỒ VẬT (あります)?",
          "Nơi TỒN TẠI là **に**; **で** chỉ nơi hành động hay sự kiện. Từ để hỏi (誰・何・どれ) làm chủ ngữ thì đi với **が**, không bao giờ với は.",
          "Mức Vừa dùng \"tranh bằng chữ\": đọc bảng vị trí rồi trả lời. Hãy vẽ nhanh tranh ra giấy để nhìn trên/dưới/cạnh cho đúng."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**N1 は N2 に います／あります** — N1 ở N2 (N1 đã biết). Hỏi: N1 は どこ に いますか。",
          "**N1 に N2 が います／あります** — ở N1 có N2 (cái mới). Hỏi: N1 に 何／誰 が ありますか／いますか。 Không có: 何も ありません／誰も いません。",
          "**誰が V ましたか → N が V ました** · **どの N ですか → この／その／あの N** · **N は どれ ですか → これ／それ／あれ**.",
          "Từ chỉ vị trí: N の + 上・下・中・外・前・後ろ・横・隣・近く・間 (N1 と N2 の 間)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · điền một chỗ trống · có nghĩa Việt kèm"
      },
      {
        "t": "mcq",
        "id": "lt-b7-np1-61",
        "title": "ポイント 61: N は N に います／あります (8 câu)",
        "items": [
          {
            "q": "{犬|いぬ}は{木|き}の{下|した}＿＿います。　〔Inu wa ki no shita__ imasu.〕　— Con chó ở dưới gốc cây.",
            "options": [
              "を",
              "で",
              "に",
              "が"
            ],
            "correct": 2,
            "why": "Nơi TỒN TẠI → **に** (ポイント 61). → **{犬|いぬ}は{木|き}の{下|した}にいます。** 〔Inu wa ki no shita ni imasu.〕 — Con chó ở dưới gốc cây."
          },
          {
            "q": "ポストは{駅|えき}の{前|まえ}＿＿あります。　〔Posuto wa eki no mae__ arimasu.〕　— Hòm thư ở trước ga.",
            "options": [
              "を",
              "で",
              "に",
              "が"
            ],
            "correct": 2,
            "why": "N1 は N2 に あります. → **ポストは{駅|えき}の{前|まえ}にあります。** 〔Posuto wa eki no mae ni arimasu.〕 — Hòm thư ở trước ga."
          },
          {
            "q": "{山田|やまだ}さんは{台所|だいどころ}＿＿います。　〔Yamadasan wa daidokoro__ imasu.〕　— Anh Yamada ở trong bếp.",
            "options": [
              "に",
              "を",
              "で",
              "が"
            ],
            "correct": 0,
            "why": "N1 は N2 に います. → **{山田|やまだ}さんは{台所|だいどころ}にいます。** 〔Yamadasan wa daidokoro ni imasu.〕 — Anh Yamada ở trong bếp."
          },
          {
            "q": "ビールは{冷蔵庫|れいぞうこ}の{中|なか}に＿＿。　〔Biiru wa reizouko no naka ni __.〕　— Bia ở trong tủ lạnh.",
            "options": [
              "ありません",
              "います",
              "あります",
              "いません"
            ],
            "correct": 2,
            "why": "Đồ vật → あります. → **ビールは{冷蔵庫|れいぞうこ}の{中|なか}にあります。** 〔Biiru wa reizouko no naka ni arimasu.〕 — Bia ở trong tủ lạnh."
          },
          {
            "q": "パクさんは{教室|きょうしつ}の{外|そと}に＿＿。　〔Paku-san wa kyoushitsu no soto ni __.〕　— Park ở bên ngoài lớp học.",
            "options": [
              "あります",
              "います",
              "ありません",
              "いません"
            ],
            "correct": 1,
            "why": "Người → います. → **パクさんは{教室|きょうしつ}の{外|そと}にいます。** 〔Paku-san wa kyoushitsu no soto ni imasu.〕 — Park ở bên ngoài lớp học."
          },
          {
            "q": "{交番|こうばん}は{駅|えき}の{近|ちか}く＿＿あります。　〔Kouban wa eki no chikaku__ arimasu.〕　— Đồn công an ở gần ga.",
            "options": [
              "に",
              "が",
              "で",
              "を"
            ],
            "correct": 0,
            "why": "に = nơi tồn tại. → **{交番|こうばん}は{駅|えき}の{近|ちか}くにあります。** 〔Kouban wa eki no chikaku ni arimasu.〕 — Đồn công an ở gần ga."
          },
          {
            "q": "{銀行|ぎんこう}は{本屋|ほんや}の{隣|となり}＿＿あります。　〔Ginkou wa hon'ya no tonari__ arimasu.〕　— Ngân hàng ở cạnh hiệu sách.",
            "options": [
              "を",
              "に",
              "が",
              "で"
            ],
            "correct": 1,
            "why": "に = nơi tồn tại. → **{銀行|ぎんこう}は{本屋|ほんや}の{隣|となり}にあります。** 〔Ginkou wa hon'ya no tonari ni arimasu.〕 — Ngân hàng ở cạnh hiệu sách."
          },
          {
            "q": "{先生|せんせい}はどこ＿＿いますか。　〔Sensei wa doko__ imasu ka.〕　— Cô giáo ở đâu?",
            "options": [
              "に",
              "が",
              "を",
              "で"
            ],
            "correct": 0,
            "why": "どこに います か. → **{先生|せんせい}はどこにいますか。** 〔Sensei wa doko ni imasu ka.〕 — Cô giáo ở đâu?"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np1-62",
        "title": "ポイント 62: N に N が います／あります · 誰も／何も (8 câu)",
        "items": [
          {
            "q": "{木|き}の{下|した}に{犬|いぬ}＿＿います。　〔Ki no shita ni inu__ imasu.〕　— Dưới gốc cây có một con chó.",
            "options": [
              "が",
              "で",
              "を",
              "に"
            ],
            "correct": 0,
            "why": "**N1 に N2 が** います (ポイント 62): giới thiệu cái MỚI. → **{木|き}の{下|した}に{犬|いぬ}がいます。** 〔Ki no shita ni inu ga imasu.〕 — Dưới gốc cây có một con chó."
          },
          {
            "q": "テーブルの{上|うえ}にお{皿|さら}＿＿あります。　〔Teeburu no ue ni osara__ arimasu.〕　— Trên bàn có đĩa.",
            "options": [
              "で",
              "に",
              "を",
              "が"
            ],
            "correct": 3,
            "why": "N1 に N2 が あります. → **テーブルの{上|うえ}にお{皿|さら}があります。** 〔Teeburu no ue ni osara ga arimasu.〕 — Trên bàn có đĩa."
          },
          {
            "q": "{教室|きょうしつ}に{誰|だれ}＿＿いますか。　〔Kyoushitsu ni dare__ imasu ka.〕　— Trong lớp có ai?",
            "options": [
              "を",
              "に",
              "で",
              "が"
            ],
            "correct": 3,
            "why": "Từ để hỏi + **が**. → **{教室|きょうしつ}に{誰|だれ}がいますか。** 〔Kyoushitsu ni dare ga imasu ka.〕 — Trong lớp có ai?"
          },
          {
            "q": "{冷蔵庫|れいぞうこ}の{中|なか}に{何|なに}＿＿ありますか。　〔Reizouko no naka ni nani__ arimasu ka.〕　— Trong tủ lạnh có gì?",
            "options": [
              "が",
              "を",
              "に",
              "で"
            ],
            "correct": 0,
            "why": "Từ để hỏi + が. → **{冷蔵庫|れいぞうこ}の{中|なか}に{何|なに}がありますか。** 〔Reizouko no naka ni nani ga arimasu ka.〕 — Trong tủ lạnh có gì?"
          },
          {
            "q": "{教室|きょうしつ}に{誰|だれ}＿＿いません。　〔Kyoushitsu ni dare__ imasen.〕　— Trong lớp không có ai.",
            "options": [
              "を",
              "も",
              "は",
              "が"
            ],
            "correct": 1,
            "why": "誰も + phủ định = không ai. → **{教室|きょうしつ}に{誰|だれ}もいません。** 〔Kyoushitsu ni dare mo imasen.〕 — Trong lớp không có ai."
          },
          {
            "q": "かばんの{中|なか}に{何|なに}＿＿ありません。　〔Kaban no naka ni nani__ arimasen.〕　— Trong cặp không có gì.",
            "options": [
              "が",
              "も",
              "は",
              "を"
            ],
            "correct": 1,
            "why": "何も + phủ định = không gì cả. → **かばんの{中|なか}に{何|なに}もありません。** 〔Kaban no naka ni nani mo arimasen.〕 — Trong cặp không có gì."
          },
          {
            "q": "{駅|えき}の{前|まえ}に{大|おお}きい{本屋|ほんや}＿＿あります。　〔Eki no mae ni ookii hon'ya__ arimasu.〕　— Trước ga có một hiệu sách lớn.",
            "options": [
              "を",
              "で",
              "に",
              "が"
            ],
            "correct": 3,
            "why": "N1 に N2 が あります. → **{駅|えき}の{前|まえ}に{大|おお}きい{本屋|ほんや}があります。** 〔Eki no mae ni ookii hon'ya ga arimasu.〕 — Trước ga có một hiệu sách lớn."
          },
          {
            "q": "{公園|こうえん}に{人|ひと}＿＿たくさんいます。　〔Kouen ni hito__ takusan imasu.〕　— Ở công viên có nhiều người.",
            "options": [
              "に",
              "で",
              "が",
              "を"
            ],
            "correct": 2,
            "why": "N1 に N2 が たくさん います. → **{公園|こうえん}に{人|ひと}がたくさんいます。** 〔Kouen ni hito ga takusan imasu.〕 — Ở công viên có nhiều người."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np1-68",
        "title": "ポイント 68: 誰が (4 câu)",
        "items": [
          {
            "q": "＿＿が{料理|りょうり}を{作|つく}りましたか。　〔__ ga ryouri o tsukurimashita ka.〕　— Ai đã nấu ăn vậy?",
            "options": [
              "どこ",
              "だれ",
              "いつ",
              "なに"
            ],
            "correct": 1,
            "why": "Hỏi người làm → **だれ が** (ポイント 68). → **だれが{料理|りょうり}を{作|つく}りましたか。** 〔Dare ga ryouri o tsukurimashita ka.〕 — Ai đã nấu ăn vậy?"
          },
          {
            "q": "A：だれ（①）ギターを{弾|ひ}きますか。B：ワンさん（②）{弾|ひ}きます。　〔A:dare((1)) gitaa o hikimasu ka. B:wansan((2)) hikimasu.〕　— A: Ai chơi ghi ta? B: Wang chơi.",
            "options": [
              "① を　② が",
              "① は　② が",
              "① が　② が",
              "① が　② は"
            ],
            "correct": 2,
            "why": "Trả lời cho だれが cũng dùng **が**. → **A：だれがギターを{弾|ひ}きますか。B：ワンさんが{弾|ひ}きます。** 〔A:dare ga gitaa o hikimasu ka. B:wansan ga hikimasu.〕 — A: Ai chơi ghi ta? B: Wang chơi."
          },
          {
            "q": "A：だれが{電話|でんわ}をかけましたか。B：{山田|やまだ}さん＿＿かけました。　〔A:dare ga denwa o kakemashita ka. B:yamadasan__ kakemashita.〕　— A: Ai đã gọi điện? B: Anh Yamada gọi.",
            "options": [
              "は",
              "を",
              "に",
              "が"
            ],
            "correct": 3,
            "why": "だれが → N が. → **A：だれが{電話|でんわ}をかけましたか。B：{山田|やまだ}さんがかけました。** 〔A:dare ga denwa o kakemashita ka. B:yamadasan ga kakemashita.〕 — A: Ai đã gọi điện? B: Anh Yamada gọi."
          },
          {
            "q": "A：＿＿が{手伝|てつだ}いましたか。B：パクさんが{手伝|てつだ}いました。　〔A:__ ga tetsudaimashita ka. B:pakusan ga tetsudaimashita.〕　— A: Ai đã giúp? B: Park đã giúp.",
            "options": [
              "どこ",
              "なに",
              "どれ",
              "だれ"
            ],
            "correct": 3,
            "why": "だれが. → **A：だれが{手伝|てつだ}いましたか。B：パクさんが{手伝|てつだ}いました。** 〔A:dare ga tetsudaimashita ka. B:pakusan ga tetsudaimashita.〕 — A: Ai đã giúp? B: Park đã giúp."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np1-6970",
        "title": "ポイント 69–70: どの／どれ／どちら (8 câu)",
        "items": [
          {
            "q": "＿＿お{皿|さら}ですか。　〔__ osara desu ka.〕　— Cái đĩa nào?",
            "options": [
              "どこ",
              "どの",
              "どちら",
              "どれ"
            ],
            "correct": 1,
            "why": "Có danh từ theo sau → **どの** (ポイント 69). → **どのお{皿|さら}ですか。** 〔Dono osara desu ka.〕 — Cái đĩa nào?"
          },
          {
            "q": "{塩|しお}は＿＿ですか。　〔Shio wa __ desu ka.〕　— Muối là cái nào?",
            "options": [
              "どこ",
              "どちら",
              "どれ",
              "どの"
            ],
            "correct": 2,
            "why": "Đứng một mình → **どれ** (ポイント 70). → **{塩|しお}はどれですか。** 〔Shio wa dore desu ka.〕 — Muối là cái nào?"
          },
          {
            "q": "＿＿ナイフを{使|つか}いますか。　〔__ naifu o tsukaimasu ka.〕　— Bạn dùng con dao nào?",
            "options": [
              "どこ",
              "どれ",
              "どちら",
              "どの"
            ],
            "correct": 3,
            "why": "どの + danh từ. → **どのナイフを{使|つか}いますか。** 〔Dono naifu o tsukaimasu ka.〕 — Bạn dùng con dao nào?"
          },
          {
            "q": "A：{砂糖|さとう}は＿＿ですか。B：それです。　〔A:satou wa __ desu ka. B:sore desu.〕　— A: Đường là cái nào? B: Cái đó.",
            "options": [
              "どれ",
              "どこ",
              "どちら",
              "どの"
            ],
            "correct": 0,
            "why": "どれ ⇔ これ/それ/あれ. → **A：{砂糖|さとう}はどれですか。B：それです。** 〔A:satou wa dore desu ka. B:sore desu.〕 — A: Đường là cái nào? B: Cái đó."
          },
          {
            "q": "A：＿＿かさがあなたのですか。B：あのかさです。　〔A:__ kasa ga anata no desu ka. B:ano kasa desu.〕　— A: Cái ô nào là của bạn? B: Cái ô kia.",
            "options": [
              "どの",
              "どちら",
              "どこ",
              "どれ"
            ],
            "correct": 0,
            "why": "どの + danh từ ⇔ この/その/あの + danh từ. → **A：どのかさがあなたのですか。B：あのかさです。** 〔A:dono kasa ga anata no desu ka. B:ano kasa desu.〕 — A: Cái ô nào là của bạn? B: Cái ô kia."
          },
          {
            "q": "この{二|ふた}つの{中|なか}で、＿＿がいいですか。　〔Kono futatsu no naka de, __ ga ii desu ka.〕　— Trong hai cái này, cái nào tốt hơn?",
            "options": [
              "だれ",
              "どちら",
              "どの",
              "どれ"
            ],
            "correct": 1,
            "why": "Chỉ có 2 thứ → どちら. → **この{二|ふた}つの{中|なか}で、どちらがいいですか。** 〔Kono futatsu no naka de, dochira ga ii desu ka.〕 — Trong hai cái này, cái nào tốt hơn?"
          },
          {
            "q": "この{三|みっ}つの{中|なか}で、＿＿がいいですか。　〔Kono mittsu no naka de, __ ga ii desu ka.〕　— Trong ba cái này, cái nào tốt?",
            "options": [
              "どちら",
              "どこ",
              "どの",
              "どれ"
            ],
            "correct": 3,
            "why": "Từ 3 thứ trở lên → どれ. → **この{三|みっ}つの{中|なか}で、どれがいいですか。** 〔Kono mittsu no naka de, dore ga ii desu ka.〕 — Trong ba cái này, cái nào tốt?"
          },
          {
            "q": "A：どの{本|ほん}が{好|す}きですか。B：＿＿{本|ほん}が{好|す}きです。　〔A:dono hon ga suki desu ka. B:__ hon ga suki desu.〕　— A: Bạn thích quyển sách nào? B: Tôi thích quyển này.",
            "options": [
              "どの",
              "この",
              "だれ",
              "これ"
            ],
            "correct": 1,
            "why": "どの 本 ⇔ この 本. → **A：どの{本|ほん}が{好|す}きですか。B：この{本|ほん}が{好|す}きです。** 〔A:dono hon ga suki desu ka. B:kono hon ga suki desu.〕 — A: Bạn thích quyển sách nào? B: Tôi thích quyển này."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đọc \"tranh\" · hỏi–đáp · sửa câu sai · gõ câu · ghép câu"
      },
      {
        "t": "table",
        "head": [
          "Vị trí",
          "Có gì / ai"
        ],
        "rows": [
          [
            "テーブル の 上 (trên bàn)",
            "cốc 2 cái, đĩa 3 cái, 1 bình hoa"
          ],
          [
            "テーブル の 下 (dưới bàn)",
            "một con chó"
          ],
          [
            "テーブル の 横 (bên cạnh bàn)",
            "ghế 4 cái"
          ],
          [
            "冷蔵庫 の 中 (trong tủ lạnh)",
            "bia, nước"
          ],
          [
            "窓 の 外 (ngoài cửa sổ)",
            "một cái cây"
          ],
          [
            "Trong phòng",
            "không có người nào (chỉ có con chó)"
          ]
        ],
        "caption": "Tranh căn phòng (dùng cho 8 câu dưới đây)"
      },
      {
        "t": "mcq",
        "id": "lt-b7-np1-tranh",
        "title": "Nhìn tranh bằng chữ rồi trả lời (8 câu)",
        "items": [
          {
            "q": "Trên bàn có gì? (nhìn tranh)",
            "options": [
              "コップと{犬|いぬ}があります。 (Koppu to inu ga arimasu.)",
              "コップとお{皿|さら}と{花|はな}があります。 (Koppu to osara to hana ga arimasu.)",
              "{何|なに}もありません。 (Nani mo arimasen.)",
              "いすがあります。 (Isu ga arimasu.)"
            ],
            "correct": 1,
            "why": "Trên bàn: cốc, đĩa, hoa."
          },
          {
            "q": "Con chó ở đâu?",
            "options": [
              "テーブルの{下|した}にいます。 (Teeburu no shita ni imasu.)",
              "{冷蔵庫|れいぞうこ}の{中|なか}にいます。 (Reizouko no naka ni imasu.)",
              "テーブルの{上|うえ}にいます。 (Teeburu no ue ni imasu.)",
              "テーブルの{下|した}にあります。 (Teeburu no shita ni arimasu.)"
            ],
            "correct": 0,
            "why": "Chó ở dưới bàn; con vật → います."
          },
          {
            "q": "Ghế ở đâu?",
            "options": [
              "{窓|まど}の{外|そと}にあります。 (Mado no soto ni arimasu.)",
              "テーブルの{横|よこ}にいます。 (Teeburu no yoko ni imasu.)",
              "テーブルの{上|うえ}にあります。 (Teeburu no ue ni arimasu.)",
              "テーブルの{横|よこ}にあります。 (Teeburu no yoko ni arimasu.)"
            ],
            "correct": 3,
            "why": "Ghế (đồ vật) → あります; ở bên cạnh bàn."
          },
          {
            "q": "Bên cạnh bàn có mấy cái ghế?",
            "options": [
              "いすが{四|よっ}つあります。 (Isu ga yottsu arimasu.)",
              "いすが{四枚|よんまい}あります。 (Isu ga yonmai arimasu.)",
              "いすが{三|みっ}つあります。 (Isu ga mittsu arimasu.)",
              "いすが{四|よん}にんいます。 (Isu ga yonnin imasu.)"
            ],
            "correct": 0,
            "why": "Ghế 4 cái = 四つ (よっつ)."
          },
          {
            "q": "Trong tủ lạnh có gì?",
            "options": [
              "{犬|いぬ}がいます。 (Inu ga imasu.)",
              "ビールと{水|みず}がいます。 (Biiru to mizu ga imasu.)",
              "ビールと{水|みず}があります。 (Biiru to mizu ga arimasu.)",
              "{何|なに}もありません。 (Nani mo arimasen.)"
            ],
            "correct": 2,
            "why": "Bia và nước."
          },
          {
            "q": "Ngoài cửa sổ có gì?",
            "options": [
              "{窓|まど}の{外|そと}に{木|き}がいます。 (Mado no soto ni ki ga imasu.)",
              "{窓|まど}の{中|なか}に{木|き}があります。 (Mado no naka ni ki ga arimasu.)",
              "{窓|まど}の{外|そと}で{木|き}があります。 (Mado no soto de ki ga arimasu.)",
              "{窓|まど}の{外|そと}に{木|き}があります。 (Mado no soto ni ki ga arimasu.)"
            ],
            "correct": 3,
            "why": "Cây ngoài cửa sổ; nơi tồn tại → に."
          },
          {
            "q": "Trong phòng có người không?",
            "options": [
              "はい、{誰|だれ}もいます。 (Hai, dare mo imasu.)",
              "いいえ、{誰|だれ}もいません。 (Iie, dare mo imasen.)",
              "いいえ、{何|なに}もありません。 (Iie, nani mo arimasen.)",
              "はい、{誰|だれ}があります。 (Hai, dare ga arimasu.)"
            ],
            "correct": 1,
            "why": "Người → 誰も いません."
          },
          {
            "q": "Trên bàn có mấy cái đĩa?",
            "options": [
              "お{皿|さら}が{三人|さんにん}います。 (Osara ga sannin imasu.)",
              "お{皿|さら}が{三枚|さんまい}あります。 (Osara ga sanmai arimasu.)",
              "お{皿|さら}が{二枚|にまい}あります。 (Osara ga nimai arimasu.)",
              "お{皿|さら}が{三|みっ}ついます。 (Osara ga mittsu imasu.)"
            ],
            "correct": 1,
            "why": "Đĩa 3 cái (三枚 hoặc 三つ)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np1-hoi-dap",
        "title": "Hỏi–đáp: chọn câu trả lời đúng (8 câu)",
        "items": [
          {
            "q": "{冷蔵庫|れいぞうこ}の{中|なか}に{何|なに}がありますか。　〔Reizouko no naka ni nani ga arimasu ka.〕　Câu trả lời đúng là gì?",
            "options": [
              "ビールをいます。 (Biiru o imasu.)",
              "ビールがあります。 (Biiru ga arimasu.)",
              "ビールはありませんか。 (Biiru wa arimasen ka.)",
              "ビールにあります。 (Biiru ni arimasu.)"
            ],
            "correct": 1,
            "why": "Hỏi cái gì có → N が あります."
          },
          {
            "q": "{教室|きょうしつ}に{誰|だれ}がいますか。　〔Kyoushitsu ni dare ga imasu ka.〕　Câu trả lời đúng là gì?",
            "options": [
              "パクさんとワンさんがあります。 (Paku-san to Wan-san ga arimasu.)",
              "パクさんとワンさんがいます。 (Paku-san to Wan-san ga imasu.)",
              "パクさんとワンさんでいます。 (Paku-san to Wan-san de imasu.)",
              "パクさんとワンさんをいます。 (Paku-san to Wan-san o imasu.)"
            ],
            "correct": 1,
            "why": "Hỏi ai có mặt → N が います."
          },
          {
            "q": "{犬|いぬ}はどこにいますか。　〔Inu wa doko ni imasu ka.〕　Câu trả lời đúng là gì?",
            "options": [
              "{木|き}の{下|した}にあります。 (Ki no shita ni arimasu.)",
              "{木|き}の{下|した}をいます。 (Ki no shita o imasu.)",
              "{木|き}の{下|した}にいます。 (Ki no shita ni imasu.)",
              "{木|き}の{下|した}でいます。 (Ki no shita de imasu.)"
            ],
            "correct": 2,
            "why": "どこに → N に います."
          },
          {
            "q": "{塩|しお}はどれですか。　〔Shio wa dore desu ka.〕　Câu trả lời đúng là gì?",
            "options": [
              "どのです。 (Dono desu.)",
              "そのです。 (Sono desu.)",
              "どれです。 (Dore desu.)",
              "それです。 (Sore desu.)"
            ],
            "correct": 3,
            "why": "どれ ⇔ これ/それ/あれ."
          },
          {
            "q": "どの{皿|さら}を{使|つか}いますか。　〔Dono sara o tsukaimasu ka.〕　Câu trả lời đúng là gì?",
            "options": [
              "どの{皿|さら}を{使|つか}います。 (Dono sara o tsukaimasu.)",
              "このを{使|つか}います。 (Kono o tsukaimasu.)",
              "この{皿|さら}を{使|つか}います。 (Kono sara o tsukaimasu.)",
              "これを{使|つか}いますの。 (Kore o tsukaimasu no.)"
            ],
            "correct": 2,
            "why": "どの N ⇔ この N."
          },
          {
            "q": "だれが{電話|でんわ}をかけましたか。　〔Dare ga denwa o kakemashita ka.〕　Câu trả lời đúng là gì?",
            "options": [
              "{山田|やまだ}さんでかけました。 (Yamadasan de kakemashita.)",
              "{山田|やまだ}さんはかけました。 (Yamadasan wa kakemashita.)",
              "{山田|やまだ}さんをかけました。 (Yamadasan o kakemashita.)",
              "{山田|やまだ}さんがかけました。 (Yamadasan ga kakemashita.)"
            ],
            "correct": 3,
            "why": "だれが → N が."
          },
          {
            "q": "{駅|えき}の{近|ちか}くに{何|なに}がありますか。　〔Eki no chikaku ni nani ga arimasu ka.〕　Câu trả lời đúng là gì?",
            "options": [
              "{交番|こうばん}とポストであります。 (Kouban to posuto de arimasu.)",
              "{交番|こうばん}とポストがいます。 (Kouban to posuto ga imasu.)",
              "{交番|こうばん}とポストがあります。 (Kouban to posuto ga arimasu.)",
              "{交番|こうばん}とポストをあります。 (Kouban to posuto o arimasu.)"
            ],
            "correct": 2,
            "why": "建物・もの → あります."
          },
          {
            "q": "{教室|きょうしつ}の{中|なか}に{誰|だれ}かいますか。　〔Kyoushitsu no naka ni dare ka imasu ka.〕　Câu trả lời đúng là gì?",
            "options": [
              "いいえ、{誰|だれ}がいません。 (Iie, dare ga imasen.)",
              "いいえ、{誰|だれ}もいません。 (Iie, dare mo imasen.)",
              "いいえ、{何|なに}もいません。 (Iie, nani mo imasen.)",
              "いいえ、{誰|だれ}はいません。 (Iie, dare wa imasen.)"
            ],
            "correct": 1,
            "why": "誰も + phủ định."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np1-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "(từ để hỏi)　Câu nào SAI?",
            "options": [
              "どこにいますか。 (Doko ni imasu ka.)",
              "{誰|だれ}がいますか。 (Dare ga imasu ka.)",
              "{誰|だれ}はいますか。 (Dare wa imasu ka.)",
              "{何|なに}がありますか。 (Nani ga arimasu ka.)"
            ],
            "correct": 2,
            "why": "Từ để hỏi làm chủ ngữ phải đi với **が**."
          },
          {
            "q": "(います／あります)　Câu nào SAI?",
            "options": [
              "{花|はな}があります。 (Hana ga arimasu.)",
              "{犬|いぬ}があります。 (Inu ga arimasu.)",
              "{山田|やまだ}さんがいます。 (Yamadasan ga imasu.)",
              "{犬|いぬ}がいます。 (Inu ga imasu.)"
            ],
            "correct": 1,
            "why": "Con vật → います."
          },
          {
            "q": "(に／で)　Câu nào SAI?",
            "options": [
              "{木|き}の{下|した}に{犬|いぬ}がいます。 (Ki no shita ni inu ga imasu.)",
              "{公園|こうえん}で{花火|はなび}があります。 (Kouen de hanabi ga arimasu.)",
              "{台所|だいどころ}で{料理|りょうり}をします。 (Daidokoro de ryouri o shimasu.)",
              "{木|き}の{下|した}で{犬|いぬ}がいます。 (Ki no shita de inu ga imasu.)"
            ],
            "correct": 3,
            "why": "Nơi TỒN TẠI → に; で chỉ nơi hành động/sự kiện."
          },
          {
            "q": "(どれ／どの)　Câu nào SAI?",
            "options": [
              "どのナイフですか。 (Dono naifu desu ka.)",
              "どれお{皿|さら}ですか。 (Dore osara desu ka.)",
              "{塩|しお}はどれですか。 (Shio wa dore desu ka.)",
              "どのお{皿|さら}ですか。 (Dono osara desu ka.)"
            ],
            "correct": 1,
            "why": "Có danh từ → どの; đứng một mình → どれ."
          },
          {
            "q": "(trả lời だれが)　Câu nào SAI?",
            "options": [
              "A：だれが{作|つく}りましたか。B：{私|わたし}が{作|つく}りました。 (A:dare ga tsukurimashita ka. B:watashi ga tsukurimashita.)",
              "A：だれが{作|つく}りましたか。B：ワンさんです。 (A:dare ga tsukurimashita ka. B:wansan desu.)",
              "A：だれが{作|つく}りましたか。B：ワンさんが{作|つく}りました。 (A:dare ga tsukurimashita ka. B:wansan ga tsukurimashita.)",
              "A：だれが{作|つく}りましたか。B：ワンさんは{作|つく}りました。 (A:dare ga tsukurimashita ka. B:wansan wa tsukurimashita.)"
            ],
            "correct": 3,
            "why": "Trả lời cho だれが nên dùng **が** (hoặc nói ngắn: ワンさんです)."
          },
          {
            "q": "(vị trí)　Câu nào SAI?",
            "options": [
              "ポストは{駅|えき}の{近|ちか}くにあります。 (Posuto wa eki no chikaku ni arimasu.)",
              "ポストは{駅|えき}の{前|まえ}であります。 (Posuto wa eki no mae de arimasu.)",
              "{駅|えき}の{前|まえ}にポストがあります。 (Eki no mae ni posuto ga arimasu.)",
              "ポストは{駅|えき}の{前|まえ}にあります。 (Posuto wa eki no mae ni arimasu.)"
            ],
            "correct": 1,
            "why": "Vị trí tồn tại → に あります."
          },
          {
            "q": "(誰も)　Câu nào SAI?",
            "options": [
              "{教室|きょうしつ}に{誰|だれ}がいます。 (Kyoushitsu ni dare ga imasu.)",
              "{教室|きょうしつ}に{誰|だれ}かいますか。 (Kyoushitsu ni dare ka imasu ka.)",
              "{教室|きょうしつ}に{誰|だれ}もいません。 (Kyoushitsu ni dare mo imasen.)",
              "{教室|きょうしつ}に{誰|だれ}もいます。 (Kyoushitsu ni dare mo imasu.)"
            ],
            "correct": 3,
            "why": "誰も phải đi với phủ định (いません)."
          },
          {
            "q": "(thiếu の)　Câu nào SAI?",
            "options": [
              "{冷蔵庫|れいぞうこ}の{中|なか}にビールがあります。 (Reizouko no naka ni biiru ga arimasu.)",
              "{冷蔵庫|れいぞうこ}{中|なか}にビールがあります。 (Reizouko naka ni biiru ga arimasu.)",
              "テーブルの{上|うえ}にお{皿|さら}があります。 (Teeburu no ue ni osara ga arimasu.)",
              "{窓|まど}の{外|そと}に{木|き}があります。 (Mado no soto ni ki ga arimasu.)"
            ],
            "correct": 1,
            "why": "Danh từ + **の** + từ chỉ vị trí."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-np1-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 61–62, 68–70",
        "items": [
          {
            "q": "Trong tủ lạnh có bia.",
            "answers": [
              "冷蔵庫の中にビールがあります。",
              "冷蔵庫のなかにビールがあります。",
              "れいぞうこの中にビールがあります。",
              "れいぞうこのなかにビールがあります。"
            ],
            "hint": "N1 の 中 に N2 が あります"
          },
          {
            "q": "Con chó ở dưới bàn.",
            "answers": [
              "犬はテーブルの下にいます。",
              "犬はテーブルのしたにいます。",
              "いぬはテーブルの下にいます。",
              "いぬはテーブルのしたにいます。"
            ],
            "hint": "N1 は N2 に います"
          },
          {
            "q": "Ngoài cửa sổ có một cái cây.",
            "answers": [
              "窓の外に木があります。",
              "窓の外にきがあります。",
              "窓のそとに木があります。",
              "窓のそとにきがあります。",
              "まどの外に木があります。",
              "まどの外にきがあります。",
              "まどのそとに木があります。",
              "まどのそとにきがあります。"
            ],
            "hint": "N1 に N2 が あります"
          },
          {
            "q": "Trong lớp không có ai.",
            "answers": [
              "教室に誰もいません。",
              "教室にだれもいません。",
              "きょうしつに誰もいません。",
              "きょうしつにだれもいません。",
              "教室の中に誰もいません。",
              "教室の中にだれもいません。",
              "教室のなかに誰もいません。",
              "教室のなかにだれもいません。",
              "きょうしつの中に誰もいません。",
              "きょうしつの中にだれもいません。",
              "きょうしつのなかに誰もいません。",
              "きょうしつのなかにだれもいません。"
            ],
            "hint": "誰も いません"
          },
          {
            "q": "Trong cặp không có gì.",
            "answers": [
              "かばんの中に何もありません。",
              "かばんの中になにもありません。",
              "かばんのなかに何もありません。",
              "かばんのなかになにもありません。",
              "かばんに何もありません。",
              "かばんになにもありません。"
            ],
            "hint": "何も ありません"
          },
          {
            "q": "Ai đã nấu ăn?",
            "answers": [
              "だれが料理を作りましたか。",
              "だれが料理をつくりましたか。",
              "だれがりょうりを作りましたか。",
              "だれがりょうりをつくりましたか。",
              "誰が料理を作りましたか。",
              "誰が料理をつくりましたか。",
              "誰がりょうりを作りましたか。",
              "誰がりょうりをつくりましたか。"
            ],
            "hint": "だれが"
          },
          {
            "q": "Cái đĩa nào?",
            "answers": [
              "どのお皿ですか。",
              "どのおさらですか。",
              "どの皿ですか。",
              "どのさらですか。"
            ],
            "hint": "どの + N"
          },
          {
            "q": "Muối là cái nào?",
            "answers": [
              "塩はどれですか。",
              "しおはどれですか。"
            ],
            "hint": "どれ"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-np1-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Dưới gốc cây có một con chó.",
            "chips": [
              "{木|き}の",
              "あります",
              "います",
              "{下|した}に",
              "{犬|いぬ}が"
            ],
            "answer": [
              "{木|き}の",
              "{下|した}に",
              "{犬|いぬ}が",
              "います"
            ],
            "ro": "Ki no shita ni inu ga imasu."
          },
          {
            "vi": "Hòm thư ở trước ga.",
            "chips": [
              "あります",
              "{前|まえ}に",
              "{駅|えき}の",
              "ポストは",
              "います"
            ],
            "answer": [
              "ポストは",
              "{駅|えき}の",
              "{前|まえ}に",
              "あります"
            ],
            "ro": "Posuto wa eki no mae ni arimasu."
          },
          {
            "vi": "Trong lớp có ai?",
            "chips": [
              "を",
              "{教室|きょうしつ}に",
              "{誰|だれ}が",
              "いますか"
            ],
            "answer": [
              "{教室|きょうしつ}に",
              "{誰|だれ}が",
              "いますか"
            ],
            "ro": "Kyoushitsu ni dare ga imasu ka?"
          },
          {
            "vi": "Ngoài cửa sổ có cái gì?",
            "chips": [
              "います",
              "{外|そと}に",
              "{窓|まど}の",
              "ありますか",
              "{何|なに}が"
            ],
            "answer": [
              "{窓|まど}の",
              "{外|そと}に",
              "{何|なに}が",
              "ありますか"
            ],
            "ro": "Mado no soto ni nani ga arimasu ka?"
          },
          {
            "vi": "Ai chơi ghi ta?",
            "chips": [
              "{弾|ひ}きますか",
              "ギターを",
              "{誰|だれ}が",
              "は"
            ],
            "answer": [
              "{誰|だれ}が",
              "ギターを",
              "{弾|ひ}きますか"
            ],
            "ro": "Dare ga gitaa o hikimasu ka?"
          },
          {
            "vi": "Muối là cái nào?",
            "chips": [
              "どれ",
              "ですか",
              "どの",
              "{塩|しお}は"
            ],
            "answer": [
              "{塩|しお}は",
              "どれ",
              "ですか"
            ],
            "ro": "Shio wa dore desu ka?"
          },
          {
            "vi": "Bạn dùng cái dao nào?",
            "chips": [
              "ナイフを",
              "{使|つか}いますか",
              "どれ",
              "どの"
            ],
            "answer": [
              "どの",
              "ナイフを",
              "{使|つか}いますか"
            ],
            "ro": "Dono naifu o tsukaimasu ka?"
          },
          {
            "vi": "Ngân hàng ở bên cạnh hiệu sách.",
            "chips": [
              "あります",
              "{銀行|ぎんこう}は",
              "います",
              "{隣|となり}に",
              "{本屋|ほんや}の"
            ],
            "answer": [
              "{銀行|ぎんこう}は",
              "{本屋|ほんや}の",
              "{隣|となり}に",
              "あります"
            ],
            "ro": "Ginkou wa hon'ya no tonari ni arimasu."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch Việt → Nhật · nhiều ô trống như đề thi"
      },
      {
        "t": "quiz",
        "id": "lt-b7-np1-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 61–62, 68–70",
        "items": [
          {
            "q": "Trước ga có đồn công an và hòm thư.",
            "answers": [
              "駅の前に交番とポストがあります。",
              "駅の前にこうばんとポストがあります。",
              "駅のまえに交番とポストがあります。",
              "駅のまえにこうばんとポストがあります。",
              "えきの前に交番とポストがあります。",
              "えきの前にこうばんとポストがあります。",
              "えきのまえに交番とポストがあります。",
              "えきのまえにこうばんとポストがあります。"
            ],
            "hint": "N1 に N2 と N3 が あります"
          },
          {
            "q": "Cái đĩa nào là của bạn? — Cái đĩa kia.",
            "answers": [
              "どのお皿があなたのですか。あのお皿です。",
              "どのお皿があなたのですか。あのおさらです。",
              "どのおさらがあなたのですか。あのお皿です。",
              "どのおさらがあなたのですか。あのおさらです。"
            ],
            "hint": "どの · あの"
          },
          {
            "q": "Trong ba cái này, cái nào là của bạn?",
            "answers": [
              "この三つの中でどれがあなたのですか。",
              "この三つのなかでどれがあなたのですか。",
              "このみっつの中でどれがあなたのですか。",
              "このみっつのなかでどれがあなたのですか。",
              "この三つの中で、どれがあなたのですか。",
              "この三つのなかで、どれがあなたのですか。",
              "このみっつの中で、どれがあなたのですか。",
              "このみっつのなかで、どれがあなたのですか。"
            ],
            "hint": "どれ"
          },
          {
            "q": "Ai đang ở trong bếp? — Anh Yamada đang ở trong bếp.",
            "answers": [
              "だれが台所にいますか。山田さんが台所にいます。",
              "だれが台所にいますか。山田さんがだいどころにいます。",
              "だれが台所にいますか。やまださんが台所にいます。",
              "だれが台所にいますか。やまださんがだいどころにいます。",
              "だれがだいどころにいますか。山田さんが台所にいます。",
              "だれがだいどころにいますか。山田さんがだいどころにいます。",
              "だれがだいどころにいますか。やまださんが台所にいます。",
              "だれがだいどころにいますか。やまださんがだいどころにいます。",
              "誰が台所にいますか。山田さんが台所にいます。",
              "誰が台所にいますか。山田さんがだいどころにいます。",
              "誰が台所にいますか。やまださんが台所にいます。",
              "誰が台所にいますか。やまださんがだいどころにいます。",
              "誰がだいどころにいますか。山田さんが台所にいます。",
              "誰がだいどころにいますか。山田さんがだいどころにいます。",
              "誰がだいどころにいますか。やまださんが台所にいます。",
              "誰がだいどころにいますか。やまださんがだいどころにいます。"
            ],
            "hint": "だれが · N が います"
          },
          {
            "q": "Bên cạnh hiệu sách có ngân hàng.",
            "answers": [
              "本屋の隣に銀行があります。",
              "本屋の隣にぎんこうがあります。",
              "本屋のとなりに銀行があります。",
              "本屋のとなりにぎんこうがあります。",
              "ほんやの隣に銀行があります。",
              "ほんやの隣にぎんこうがあります。",
              "ほんやのとなりに銀行があります。",
              "ほんやのとなりにぎんこうがあります。",
              "本屋の横に銀行があります。",
              "本屋の横にぎんこうがあります。",
              "本屋のよこに銀行があります。",
              "本屋のよこにぎんこうがあります。",
              "ほんやの横に銀行があります。",
              "ほんやの横にぎんこうがあります。",
              "ほんやのよこに銀行があります。",
              "ほんやのよこにぎんこうがあります。"
            ],
            "hint": "隣 / 横"
          },
          {
            "q": "Giữa ngân hàng và hiệu sách có hòm thư.",
            "answers": [
              "銀行と本屋の間にポストがあります。",
              "銀行と本屋のあいだにポストがあります。",
              "銀行とほんやの間にポストがあります。",
              "銀行とほんやのあいだにポストがあります。",
              "ぎんこうと本屋の間にポストがあります。",
              "ぎんこうと本屋のあいだにポストがあります。",
              "ぎんこうとほんやの間にポストがあります。",
              "ぎんこうとほんやのあいだにポストがあります。"
            ],
            "hint": "N1 と N2 の 間"
          },
          {
            "q": "Trên bàn có cốc và đĩa.",
            "answers": [
              "テーブルの上にコップとお皿があります。",
              "テーブルの上にコップとおさらがあります。",
              "テーブルのうえにコップとお皿があります。",
              "テーブルのうえにコップとおさらがあります。"
            ],
            "hint": "N1 の 上 に"
          },
          {
            "q": "Trên bàn có cốc, đĩa… (nhiều thứ).",
            "answers": [
              "テーブルの上にコップやお皿などがあります。",
              "テーブルの上にコップやおさらなどがあります。",
              "テーブルのうえにコップやお皿などがあります。",
              "テーブルのうえにコップやおさらなどがあります。"
            ],
            "hint": "や … など"
          },
          {
            "q": "Con chó ở đâu? — Nó ở sau nhà bếp.",
            "answers": [
              "犬はどこにいますか。台所の後ろにいます。",
              "犬はどこにいますか。台所のうしろにいます。",
              "犬はどこにいますか。だいどころの後ろにいます。",
              "犬はどこにいますか。だいどころのうしろにいます。",
              "いぬはどこにいますか。台所の後ろにいます。",
              "いぬはどこにいますか。台所のうしろにいます。",
              "いぬはどこにいますか。だいどころの後ろにいます。",
              "いぬはどこにいますか。だいどころのうしろにいます。"
            ],
            "hint": "どこに · 後ろ"
          },
          {
            "q": "Trong tủ lạnh không có gì cả.",
            "answers": [
              "冷蔵庫の中に何もありません。",
              "冷蔵庫の中になにもありません。",
              "冷蔵庫のなかに何もありません。",
              "冷蔵庫のなかになにもありません。",
              "れいぞうこの中に何もありません。",
              "れいぞうこの中になにもありません。",
              "れいぞうこのなかに何もありません。",
              "れいぞうこのなかになにもありません。"
            ],
            "hint": "何も ありません"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np1-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{木|き}の{下|した}（①）{犬|いぬ}（②）います。{犬|いぬ}（③）{木|き}の{下|した}（④）います。　〔Ki no shita((1)) inu((2)) imasu. Inu((3)) ki no shita((4)) imasu.〕　— Dưới gốc cây có một con chó. Con chó ở dưới gốc cây.",
            "options": [
              "① に　② が　③ が　④ で",
              "① に　② を　③ は　④ に",
              "① に　② が　③ は　④ に",
              "① で　② が　③ は　④ に"
            ],
            "correct": 2,
            "why": "N1 に N2 が います (giới thiệu mới) ⇒ N2 は N1 に います (đã biết). → **{木|き}の{下|した}に{犬|いぬ}がいます。{犬|いぬ}は{木|き}の{下|した}にいます。** 〔Ki no shita ni inu ga imasu. Inu wa ki no shita ni imasu.〕 — Dưới gốc cây có một con chó. Con chó ở dưới gốc cây."
          },
          {
            "q": "A：{冷蔵庫|れいぞうこ}（①）{中|なか}（②）{何|なに}（③）ありますか。B：ビール（④）{水|みず}（⑤）あります。　〔A:reizouko((1)) naka((2)) nani((3)) arimasu ka. B:biiru((4)) mizu((5)) arimasu.〕　— A: Trong tủ lạnh có gì? B: Có bia và nước.",
            "options": [
              "① の　② に　③ は　④ と　⑤ が",
              "① の　② で　③ が　④ と　⑤ が",
              "① の　② に　③ が　④ と　⑤ が",
              "① の　② に　③ が　④ や　⑤ を"
            ],
            "correct": 2,
            "why": "N の 中 に 何が ありますか · N1 と N2 が あります. → **A：{冷蔵庫|れいぞうこ}の{中|なか}に{何|なに}がありますか。B：ビールと{水|みず}があります。** 〔A:reizouko no naka ni nani ga arimasu ka. B:biiru to mizu ga arimasu.〕 — A: Trong tủ lạnh có gì? B: Có bia và nước."
          },
          {
            "q": "A：{教室|きょうしつ}（①）{誰|だれ}（②）いますか。B：いいえ、{誰|だれ}（③）いません。　〔A:kyoushitsu((1)) dare((2)) imasu ka. B:iie, dare((3)) imasen.〕　— A: Trong lớp có ai không? B: Không, không có ai.",
            "options": [
              "① に　② か　③ が",
              "① に　② か　③ も",
              "① で　② か　③ も",
              "① に　② が　③ も"
            ],
            "correct": 1,
            "why": "誰か いますか (có ai không?) — 誰も いません. → **A：{教室|きょうしつ}に{誰|だれ}かいますか。B：いいえ、{誰|だれ}もいません。** 〔A:kyoushitsu ni dare ka imasu ka. B:iie, dare mo imasen.〕 — A: Trong lớp có ai không? B: Không, không có ai."
          },
          {
            "q": "A：（①）ナイフ（②）{使|つか}いますか。B：このナイフ（③）{使|つか}います。　〔A:((1)) naifu((2)) tsukaimasu ka. B:kono naifu((3)) tsukaimasu.〕　— A: Bạn dùng con dao nào? B: Tôi dùng con dao này.",
            "options": [
              "① どれ　② を　③ を",
              "① どの　② を　③ が",
              "① どの　② を　③ を",
              "① どの　② が　③ を"
            ],
            "correct": 2,
            "why": "どの N を ⇔ この N を. → **A：どのナイフを{使|つか}いますか。B：このナイフを{使|つか}います。** 〔A:dono naifu o tsukaimasu ka. B:kono naifu o tsukaimasu.〕 — A: Bạn dùng con dao nào? B: Tôi dùng con dao này."
          },
          {
            "q": "A：{塩|しお}（①）（②）ですか。B：それですよ。　〔A:shio((1)) ((2)) desu ka. B:sore desu yo.〕　— A: Muối là cái nào? B: Cái đó đấy.",
            "options": [
              "① は　② どれ",
              "① を　② どれ",
              "① は　② どの",
              "① が　② どの"
            ],
            "correct": 0,
            "why": "N は どれ ですか. → **A：{塩|しお}はどれですか。B：それですよ。** 〔A:shio wa dore desu ka. B:sore desu yo.〕 — A: Muối là cái nào? B: Cái đó đấy."
          },
          {
            "q": "A：（①）がコップ（②）{洗|あら}いましたか。B：{山田|やまだ}さん（③）{洗|あら}いました。　〔A:((1)) ga koppu((2)) araimashita ka. B:yamadasan((3)) araimashita.〕　— A: Ai đã rửa cốc? B: Anh Yamada rửa.",
            "options": [
              "① だれ　② が　③ を",
              "① なに　② を　③ が",
              "① だれ　② を　③ は",
              "① だれ　② を　③ が"
            ],
            "correct": 3,
            "why": "だれ が … を V · N が V. → **A：だれがコップを{洗|あら}いましたか。B：{山田|やまだ}さんが{洗|あら}いました。** 〔A:dare ga koppu o araimashita ka. B:yamadasan ga araimashita.〕 — A: Ai đã rửa cốc? B: Anh Yamada rửa."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ: と và や",
        "items": [
          "**と** liệt kê ĐỦ: コップとお皿があります (chỉ có hai thứ này).",
          "**や** liệt kê VÍ DỤ (còn nữa): コップやお皿などがあります (cốc, đĩa… và những thứ khác).",
          "Hai cách này đều đúng ngữ pháp — đề sẽ cho ngữ cảnh (đủ hay còn nữa) để chọn."
        ]
      }
    ]
  },
  {
    "id": "lt-b7-the-te",
    "kind": "homework",
    "title": "Luyện thêm Bài 7 · Thể て (テ形) — nhận nhóm → chia 70 động từ → bẫy → gõ hàng loạt (~228 câu)",
    "goal": "Chia thể て đúng và nhanh cho cả 3 nhóm động từ (kể cả ngoại lệ 行きます → 行って và các bẫy 帰ります／切ります／入ります／借ります／起きます／見ます), tự nhận nhóm và gõ thể て không cần nhìn bảng.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thể て là \"chìa khoá\" của cả bài (và nhiều bài sau): làm bảng này đến khi **không cần nghĩ**. Cách làm: nhìn **âm đứng ngay trước ます** → áp quy tắc → đọc to thành tiếng (kaite, nonde, matte…).",
          "Thứ tự: nhận **nhóm** trước (Nhóm 3 chỉ có します・来ます; Nhóm 2 thường có âm hàng え trước ます; còn lại Nhóm 1) → rồi chia. Bẫy phải thuộc: **帰る・切る・入る・走る・わかる** = Nhóm 1; **見る・起きる・着る・いる・借りる・出る・寝る** = Nhóm 2.",
          "Mẹo bài hát Nhóm 1: **い・ち・り → って · み・び・に → んで · き → いて · ぎ → いで · し → して** — và 行く 行って (ngoại lệ). Mỗi lần sai, ghi cả động từ vào sổ, chia 3 lần."
        ]
      },
      {
        "t": "table",
        "head": [
          "Nhóm",
          "Nhận biết",
          "Cách chia",
          "Ví dụ"
        ],
        "rows": [
          [
            "Nhóm 1",
            "âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)",
            "い・ち・り → って · み・び・に → んで · き → いて · ぎ → いで · し → して",
            "買います→買って · 飲みます→飲んで · 書きます→書いて · 泳ぎます→泳いで · 話します→話して"
          ],
          [
            "Nhóm 1 ngoại lệ",
            "行きます (và 持って行きます, 迎えに行きます)",
            "→ 行って (không phải 行いて)",
            "行って · 持って行って"
          ],
          [
            "Nhóm 2",
            "đa số có âm hàng え trước ます; thêm 見ます・起きます・着ます・います・借ります・出ます・寝ます",
            "bỏ ます + て",
            "食べて · 見て · 起きて · 借りて"
          ],
          [
            "Nhóm 3",
            "します (N+します) · 来ます",
            "して · 来て (き)",
            "勉強して · 来て · 持って来て"
          ]
        ],
        "caption": "Bảng chia thể て"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhận nhóm → chọn thể て (có quy tắc kèm giải thích)"
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-nhom-1",
        "title": "Nhận nhóm — động từ Nhóm 1 (12 câu)",
        "items": [
          {
            "q": "{書|か}きます (Kakimasu) = viết　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{書|か}きます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{聞|き}きます (Kikimasu) = nghe; hỏi　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{聞|き}きます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{弾|ひ}きます (Hikimasu) = chơi (đàn)　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{弾|ひ}きます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{置|お}きます (Okimasu) = đặt, để　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{置|お}きます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{働|はたら}きます (Hatarakimasu) = làm việc　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{働|はたら}きます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{行|い}きます (Ikimasu) = đi　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{行|い}きます là nhóm 1. Ngoại lệ: 行きます → 行って (không phải 行いて)"
          },
          {
            "q": "{泳|およ}ぎます (Oyogimasu) = bơi　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{泳|およ}ぎます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{急|いそ}ぎます (Isogimasu) = vội, khẩn trương　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{急|いそ}ぎます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{話|はな}します (Hanashimasu) = nói chuyện　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{話|はな}します là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{貸|か}します (Kashimasu) = cho mượn　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{貸|か}します là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{出|だ}します (Dashimasu) = lấy ra; nộp　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{出|だ}します là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{飲|の}みます (Nomimasu) = uống　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{飲|の}みます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-nhom-2",
        "title": "Nhận nhóm — động từ Nhóm 1 (tiếp, 12 câu)",
        "items": [
          {
            "q": "{読|よ}みます (Yomimasu) = đọc　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{読|よ}みます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{休|やす}みます (Yasumimasu) = nghỉ　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{休|やす}みます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{遊|あそ}びます (Asobimasu) = chơi　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{遊|あそ}びます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{呼|よ}びます (Yobimasu) = gọi (người)　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{呼|よ}びます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{死|し}にます (Shinimasu) = chết　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{死|し}にます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{買|か}います (Kaimasu) = mua　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{買|か}います là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{会|あ}います (Aimasu) = gặp　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{会|あ}います là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{使|つか}います (Tsukaimasu) = dùng　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{使|つか}います là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{洗|あら}います (Araimasu) = rửa　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{洗|あら}います là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{手伝|てつだ}います (Tetsudaimasu) = giúp　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{手伝|てつだ}います là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{吸|す}います (Suimasu) = hút　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{吸|す}います là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{歌|うた}います (Utaimasu) = hát　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{歌|うた}います là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-nhom-3",
        "title": "Nhận nhóm — Nhóm 1 còn lại + Nhóm 2 + Nhóm 3 (37 câu)",
        "items": [
          {
            "q": "{習|なら}います (Naraimasu) = học (một kỹ năng)　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{習|なら}います là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{持|も}ちます (Mochimasu) = cầm, mang　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{持|も}ちます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{待|ま}ちます (Machimasu) = đợi　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{待|ま}ちます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{立|た}ちます (Tachimasu) = đứng　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{立|た}ちます là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{取|と}ります (Torimasu) = lấy, cầm　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{取|と}ります là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{帰|かえ}ります (Kaerimasu) = về　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{帰|かえ}ります là nhóm 1. Trông như nhóm 2 nhưng là nhóm 1: 帰ります → 帰って"
          },
          {
            "q": "{入|はい}ります (Hairimasu) = đi vào　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{入|はい}ります là nhóm 1. Nhóm 1: 入ります → 入って (khác 入れます → 入れて)"
          },
          {
            "q": "{切|き}ります (Kirimasu) = cắt　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{切|き}ります là nhóm 1. Nhóm 1: 切ります → 切って (khác 着ます → 着て)"
          },
          {
            "q": "わかります (Wakarimasu) = hiểu, biết　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "わかります là nhóm 1. Nhóm 1: わかります → わかって"
          },
          {
            "q": "{登|のぼ}ります (Noborimasu) = leo　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{登|のぼ}ります là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{乗|の}ります (Norimasu) = đi (tàu xe)　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{乗|の}ります là nhóm 1. Âm trước ます thuộc hàng い (い・ち・り・み・び・に・き・ぎ・し)."
          },
          {
            "q": "{走|はし}ります (Hashirimasu) = chạy　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{走|はし}ります là nhóm 1. Nhóm 1: 走ります → 走って"
          },
          {
            "q": "{食|た}べます (Tabemasu) = ăn　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{食|た}べます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "{寝|ね}ます (Nemasu) = ngủ　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{寝|ね}ます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "{見|み}ます (Mimasu) = xem　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{見|み}ます là nhóm 2. Nhóm 2 ngoại lệ (âm い trước ます): 見ます → 見て"
          },
          {
            "q": "{起|お}きます (Okimasu) = thức dậy　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{起|お}きます là nhóm 2. Nhóm 2 ngoại lệ: 起きます → 起きて (không phải 起いて)"
          },
          {
            "q": "{着|き}ます (Kimasu) = mặc　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{着|き}ます là nhóm 2. Nhóm 2: 着ます → 着て"
          },
          {
            "q": "います (Imasu) = có, ở　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "います là nhóm 2. Nhóm 2: います → いて"
          },
          {
            "q": "{借|か}ります (Karimasu) = mượn　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{借|か}ります là nhóm 2. Nhóm 2 ngoại lệ: 借ります → 借りて (không phải 借って)"
          },
          {
            "q": "{出|で}ます (Demasu) = đi ra　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{出|で}ます là nhóm 2. Nhóm 2: 出ます → 出て (khác 出します → 出して)"
          },
          {
            "q": "{教|おし}えます (Oshiemasu) = dạy　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{教|おし}えます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "{入|い}れます (Iremasu) = cho vào　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{入|い}れます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "{開|あ}けます (Akemasu) = mở　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{開|あ}けます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "{閉|し}めます (Shimemasu) = đóng　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{閉|し}めます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "かけます (Kakemasu) = gọi (điện thoại)　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "かけます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "{覚|おぼ}えます (Oboemasu) = nhớ　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{覚|おぼ}えます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "{始|はじ}めます (Hajimemasu) = bắt đầu　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{始|はじ}めます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "{止|と}めます (Tomemasu) = dừng　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{止|と}めます là nhóm 2. Nhóm 2: thường có âm hàng え trước ます (べ・け・め・れ・え…)."
          },
          {
            "q": "します (Shimasu) = làm　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "します là nhóm 3. Nhóm 3 chỉ có します (và N+します) và 来ます."
          },
          {
            "q": "{来|き}ます (Kimasu) = đến　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{来|き}ます là nhóm 3. Nhóm 3: 来ます → 来て (き, không phải 来って)"
          },
          {
            "q": "{勉強|べんきょう}します (Benkyou shimasu) = học　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{勉強|べんきょう} します là nhóm 3. Nhóm 3 chỉ có します (và N+します) và 来ます."
          },
          {
            "q": "{掃除|そうじ}します (Souji shimasu) = dọn dẹp　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{掃除|そうじ} します là nhóm 3. Nhóm 3 chỉ có します (và N+します) và 来ます."
          },
          {
            "q": "{洗濯|せんたく}します (Sentaku shimasu) = giặt đồ　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{洗濯|せんたく} します là nhóm 3. Nhóm 3 chỉ có します (và N+します) và 来ます."
          },
          {
            "q": "{買|か}い{物|もの}します (Kaimono shimasu) = mua sắm　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{買|か}い{物|もの} します là nhóm 3. Nhóm 3 chỉ có します (và N+します) và 来ます."
          },
          {
            "q": "{食事|しょくじ}します (Shokuji shimasu) = dùng bữa　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{食事|しょくじ} します là nhóm 3. Nhóm 3 chỉ có します (và N+します) và 来ます."
          },
          {
            "q": "{結婚|けっこん}します (Kekkon shimasu) = kết hôn　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{結婚|けっこん} します là nhóm 3. Nhóm 3 chỉ có します (và N+します) và 来ます."
          },
          {
            "q": "{持|も}って{来|き}ます (Motte kimasu) = mang đến　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{持|も}って {来|き}ます là nhóm 3. Nhóm 3 chỉ có します (và N+します) và 来ます."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-1",
        "title": "Chọn thể て — Nhóm 1 (14 câu: き・ぎ・し・行く)",
        "items": [
          {
            "q": "Thể て của {持|も}って{行|い}きます (Motte ikimasu) (mang đi) là gì?",
            "options": [
              "{持|も}って{行|い}きて (Motte ikite)",
              "{持|も}って{行|い}いて (Motte iite)",
              "{持|も}って{行|い}って (Motte itte)",
              "{持|も}って{行|い}して (Motte ishite)"
            ],
            "correct": 2,
            "why": "**{持|も}って {行|い}って** (Motte itte). Nhóm 1: 行く・持って行く・迎えに行く là ngoại lệ → って. 持って行きます → 持って行って."
          },
          {
            "q": "Thể て của {迎|むか}えに{行|い}きます (Mukaeni ikimasu) (đi đón) là gì?",
            "options": [
              "{迎|むか}えに{行|い}って (Mukaeni itte)",
              "{迎|むか}えに{行|い}いで (Mukaeni iide)",
              "{迎|むか}えに{行|い}して (Mukaeni ishite)",
              "{迎|むか}えに{行|い}いて (Mukaeni iite)"
            ],
            "correct": 0,
            "why": "**{迎|むか}えに {行|い}って** (Mukaeni itte). Nhóm 1: 行く・持って行く・迎えに行く là ngoại lệ → って. 迎えに行きます → 迎えに行って."
          },
          {
            "q": "Thể て của {書|か}きます (Kakimasu) (viết) là gì?",
            "options": [
              "{書|か}いで (Kaide)",
              "{書|か}んで (Kande)",
              "{書|か}いて (Kaite)",
              "{書|か}って (Katte)"
            ],
            "correct": 2,
            "why": "**{書|か}いて** (Kaite). Nhóm 1: き → いて (き → いて)."
          },
          {
            "q": "Thể て của {聞|き}きます (Kikimasu) (nghe; hỏi) là gì?",
            "options": [
              "{聞|き}いで (Kiide)",
              "{聞|き}して (Kishite)",
              "{聞|き}いて (Kiite)",
              "{聞|き}きて (Kikite)"
            ],
            "correct": 2,
            "why": "**{聞|き}いて** (Kiite). Nhóm 1: き → いて (き → いて)."
          },
          {
            "q": "Thể て của {弾|ひ}きます (Hikimasu) (chơi (đàn)) là gì?",
            "options": [
              "{弾|ひ}して (Hishite)",
              "{弾|ひ}いで (Hiide)",
              "{弾|ひ}きて (Hikite)",
              "{弾|ひ}いて (Hiite)"
            ],
            "correct": 3,
            "why": "**{弾|ひ}いて** (Hiite). Nhóm 1: き → いて (き → いて)."
          },
          {
            "q": "Thể て của {置|お}きます (Okimasu) (đặt, để) là gì?",
            "options": [
              "{置|お}して (Oshite)",
              "{置|お}きて (Okite)",
              "{置|お}いで (Oide)",
              "{置|お}いて (Oite)"
            ],
            "correct": 3,
            "why": "**{置|お}いて** (Oite). Nhóm 1: き → いて (き → いて)."
          },
          {
            "q": "Thể て của {働|はたら}きます (Hatarakimasu) (làm việc) là gì?",
            "options": [
              "{働|はたら}きて (Hatarakite)",
              "{働|はたら}いて (Hataraite)",
              "{働|はたら}いで (Hataraide)",
              "{働|はたら}って (Hataratte)"
            ],
            "correct": 1,
            "why": "**{働|はたら}いて** (Hataraite). Nhóm 1: き → いて (き → いて)."
          },
          {
            "q": "Thể て của {行|い}きます (Ikimasu) (đi) là gì?",
            "options": [
              "{行|い}いで (Iide)",
              "{行|い}いて (Iite)",
              "{行|い}って (Itte)",
              "{行|い}んで (Inde)"
            ],
            "correct": 2,
            "why": "**{行|い}って** (Itte). Nhóm 1: 行く・持って行く・迎えに行く là ngoại lệ → って. Ngoại lệ: 行きます → 行って (không phải 行いて)."
          },
          {
            "q": "Thể て của {泳|およ}ぎます (Oyogimasu) (bơi) là gì?",
            "options": [
              "{泳|およ}って (Oyotte)",
              "{泳|およ}いて (Oyoite)",
              "{泳|およ}んで (Oyonde)",
              "{泳|およ}いで (Oyoide)"
            ],
            "correct": 3,
            "why": "**{泳|およ}いで** (Oyoide). Nhóm 1: ぎ → いで (ぎ → いで)."
          },
          {
            "q": "Thể て của {急|いそ}ぎます (Isogimasu) (vội, khẩn trương) là gì?",
            "options": [
              "{急|いそ}ぎて (Isogite)",
              "{急|いそ}んで (Isonde)",
              "{急|いそ}いで (Isoide)",
              "{急|いそ}して (Isoshite)"
            ],
            "correct": 2,
            "why": "**{急|いそ}いで** (Isoide). Nhóm 1: ぎ → いで (ぎ → いで)."
          },
          {
            "q": "Thể て của {話|はな}します (Hanashimasu) (nói chuyện) là gì?",
            "options": [
              "{話|はな}いて (Hanaite)",
              "{話|はな}って (Hanatte)",
              "{話|はな}して (Hanashite)",
              "{話|はな}いで (Hanaide)"
            ],
            "correct": 2,
            "why": "**{話|はな}して** (Hanashite). Nhóm 1: し → して (し → して)."
          },
          {
            "q": "Thể て của {貸|か}します (Kashimasu) (cho mượn) là gì?",
            "options": [
              "{貸|か}いて (Kaite)",
              "{貸|か}んで (Kande)",
              "{貸|か}いで (Kaide)",
              "{貸|か}して (Kashite)"
            ],
            "correct": 3,
            "why": "**{貸|か}して** (Kashite). Nhóm 1: し → して (し → して)."
          },
          {
            "q": "Thể て của {出|だ}します (Dashimasu) (lấy ra; nộp) là gì?",
            "options": [
              "{出|だ}って (Datte)",
              "{出|だ}んで (Dande)",
              "{出|だ}して (Dashite)",
              "{出|だ}いて (Daite)"
            ],
            "correct": 2,
            "why": "**{出|だ}して** (Dashite). Nhóm 1: し → して (し → して)."
          },
          {
            "q": "Thể て của {飲|の}みます (Nomimasu) (uống) là gì?",
            "options": [
              "{飲|の}して (Noshite)",
              "{飲|の}って (Notte)",
              "{飲|の}いで (Noide)",
              "{飲|の}んで (Nonde)"
            ],
            "correct": 3,
            "why": "**{飲|の}んで** (Nonde). Nhóm 1: み → んで (み・び・に → んで)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-2",
        "title": "Chọn thể て — Nhóm 1 (12 câu: み・び・に・い)",
        "items": [
          {
            "q": "Thể て của {読|よ}みます (Yomimasu) (đọc) là gì?",
            "options": [
              "{読|よ}して (Yoshite)",
              "{読|よ}って (Yotte)",
              "{読|よ}んで (Yonde)",
              "{読|よ}いで (Yoide)"
            ],
            "correct": 2,
            "why": "**{読|よ}んで** (Yonde). Nhóm 1: み → んで (み・び・に → んで)."
          },
          {
            "q": "Thể て của {休|やす}みます (Yasumimasu) (nghỉ) là gì?",
            "options": [
              "{休|やす}んで (Yasunde)",
              "{休|やす}して (Yasushite)",
              "{休|やす}いで (Yasuide)",
              "{休|やす}いて (Yasuite)"
            ],
            "correct": 0,
            "why": "**{休|やす}んで** (Yasunde). Nhóm 1: み → んで (み・び・に → んで)."
          },
          {
            "q": "Thể て của {遊|あそ}びます (Asobimasu) (chơi) là gì?",
            "options": [
              "{遊|あそ}んで (Asonde)",
              "{遊|あそ}して (Asoshite)",
              "{遊|あそ}いて (Asoite)",
              "{遊|あそ}びて (Asobite)"
            ],
            "correct": 0,
            "why": "**{遊|あそ}んで** (Asonde). Nhóm 1: び → んで (み・び・に → んで)."
          },
          {
            "q": "Thể て của {呼|よ}びます (Yobimasu) (gọi (người)) là gì?",
            "options": [
              "{呼|よ}って (Yotte)",
              "{呼|よ}びて (Yobite)",
              "{呼|よ}んで (Yonde)",
              "{呼|よ}いで (Yoide)"
            ],
            "correct": 2,
            "why": "**{呼|よ}んで** (Yonde). Nhóm 1: び → んで (み・び・に → んで)."
          },
          {
            "q": "Thể て của {死|し}にます (Shinimasu) (chết) là gì?",
            "options": [
              "{死|し}いて (Shiite)",
              "{死|し}いで (Shiide)",
              "{死|し}して (Shishite)",
              "{死|し}んで (Shinde)"
            ],
            "correct": 3,
            "why": "**{死|し}んで** (Shinde). Nhóm 1: に → んで (み・び・に → んで)."
          },
          {
            "q": "Thể て của {買|か}います (Kaimasu) (mua) là gì?",
            "options": [
              "{買|か}して (Kashite)",
              "{買|か}いで (Kaide)",
              "{買|か}んで (Kande)",
              "{買|か}って (Katte)"
            ],
            "correct": 3,
            "why": "**{買|か}って** (Katte). Nhóm 1: い → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {会|あ}います (Aimasu) (gặp) là gì?",
            "options": [
              "{会|あ}って (Atte)",
              "{会|あ}いて (Aite)",
              "{会|あ}いで (Aide)",
              "{会|あ}して (Ashite)"
            ],
            "correct": 0,
            "why": "**{会|あ}って** (Atte). Nhóm 1: い → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {使|つか}います (Tsukaimasu) (dùng) là gì?",
            "options": [
              "{使|つか}して (Tsukashite)",
              "{使|つか}んで (Tsukande)",
              "{使|つか}いで (Tsukaide)",
              "{使|つか}って (Tsukatte)"
            ],
            "correct": 3,
            "why": "**{使|つか}って** (Tsukatte). Nhóm 1: い → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {洗|あら}います (Araimasu) (rửa) là gì?",
            "options": [
              "{洗|あら}いて (Araite)",
              "{洗|あら}いで (Araide)",
              "{洗|あら}って (Aratte)",
              "{洗|あら}んで (Arande)"
            ],
            "correct": 2,
            "why": "**{洗|あら}って** (Aratte). Nhóm 1: い → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {手伝|てつだ}います (Tetsudaimasu) (giúp) là gì?",
            "options": [
              "{手伝|てつだ}いて (Tetsudaite)",
              "{手伝|てつだ}んで (Tetsudande)",
              "{手伝|てつだ}って (Tetsudatte)",
              "{手伝|てつだ}して (Tetsudashite)"
            ],
            "correct": 2,
            "why": "**{手伝|てつだ}って** (Tetsudatte). Nhóm 1: い → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {吸|す}います (Suimasu) (hút) là gì?",
            "options": [
              "{吸|す}んで (Sunde)",
              "{吸|す}いて (Suite)",
              "{吸|す}いで (Suide)",
              "{吸|す}って (Sutte)"
            ],
            "correct": 3,
            "why": "**{吸|す}って** (Sutte). Nhóm 1: い → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {歌|うた}います (Utaimasu) (hát) là gì?",
            "options": [
              "{歌|うた}して (Utashite)",
              "{歌|うた}いて (Utaite)",
              "{歌|うた}いで (Utaide)",
              "{歌|うた}って (Utatte)"
            ],
            "correct": 3,
            "why": "**{歌|うた}って** (Utatte). Nhóm 1: い → って (い・ち・り → って)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-3",
        "title": "Chọn thể て — Nhóm 1 (12 câu: ち・り và bẫy)",
        "items": [
          {
            "q": "Thể て của {習|なら}います (Naraimasu) (học (một kỹ năng)) là gì?",
            "options": [
              "{習|なら}んで (Narande)",
              "{習|なら}いで (Naraide)",
              "{習|なら}いて (Naraite)",
              "{習|なら}って (Naratte)"
            ],
            "correct": 3,
            "why": "**{習|なら}って** (Naratte). Nhóm 1: い → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {持|も}ちます (Mochimasu) (cầm, mang) là gì?",
            "options": [
              "{持|も}って (Motte)",
              "{持|も}いで (Moide)",
              "{持|も}ちて (Mochite)",
              "{持|も}いて (Moite)"
            ],
            "correct": 0,
            "why": "**{持|も}って** (Motte). Nhóm 1: ち → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {待|ま}ちます (Machimasu) (đợi) là gì?",
            "options": [
              "{待|ま}って (Matte)",
              "{待|ま}して (Mashite)",
              "{待|ま}ちて (Machite)",
              "{待|ま}いで (Maide)"
            ],
            "correct": 0,
            "why": "**{待|ま}って** (Matte). Nhóm 1: ち → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {立|た}ちます (Tachimasu) (đứng) là gì?",
            "options": [
              "{立|た}いて (Taite)",
              "{立|た}いで (Taide)",
              "{立|た}って (Tatte)",
              "{立|た}ちて (Tachite)"
            ],
            "correct": 2,
            "why": "**{立|た}って** (Tatte). Nhóm 1: ち → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {取|と}ります (Torimasu) (lấy, cầm) là gì?",
            "options": [
              "{取|と}んで (Tonde)",
              "{取|と}して (Toshite)",
              "{取|と}りて (Torite)",
              "{取|と}って (Totte)"
            ],
            "correct": 3,
            "why": "**{取|と}って** (Totte). Nhóm 1: り → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {帰|かえ}ります (Kaerimasu) (về) là gì?",
            "options": [
              "{帰|かえ}って (Kaette)",
              "{帰|かえ}りて (Kaerite)",
              "{帰|かえ}んで (Kaende)",
              "{帰|かえ}いで (Kaeide)"
            ],
            "correct": 0,
            "why": "**{帰|かえ}って** (Kaette). Nhóm 1: り → って (い・ち・り → って). Trông như nhóm 2 nhưng là nhóm 1: 帰ります → 帰って."
          },
          {
            "q": "Thể て của {入|はい}ります (Hairimasu) (đi vào) là gì?",
            "options": [
              "{入|はい}いで (Haiide)",
              "{入|はい}んで (Hainde)",
              "{入|はい}いて (Haiite)",
              "{入|はい}って (Haitte)"
            ],
            "correct": 3,
            "why": "**{入|はい}って** (Haitte). Nhóm 1: り → って (い・ち・り → って). Nhóm 1: 入ります → 入って (khác 入れます → 入れて)."
          },
          {
            "q": "Thể て của {切|き}ります (Kirimasu) (cắt) là gì?",
            "options": [
              "{切|き}って (Kitte)",
              "{切|き}いで (Kiide)",
              "{切|き}して (Kishite)",
              "{切|き}んで (Kinde)"
            ],
            "correct": 0,
            "why": "**{切|き}って** (Kitte). Nhóm 1: り → って (い・ち・り → って). Nhóm 1: 切ります → 切って (khác 着ます → 着て)."
          },
          {
            "q": "Thể て của わかります (Wakarimasu) (hiểu, biết) là gì?",
            "options": [
              "わかして (Wakashite)",
              "わかいて (Wakaite)",
              "わかって (Wakatte)",
              "わかりて (Wakarite)"
            ],
            "correct": 2,
            "why": "**わかって** (Wakatte). Nhóm 1: り → って (い・ち・り → って). Nhóm 1: わかります → わかって."
          },
          {
            "q": "Thể て của {登|のぼ}ります (Noborimasu) (leo) là gì?",
            "options": [
              "{登|のぼ}いて (Noboite)",
              "{登|のぼ}って (Nobotte)",
              "{登|のぼ}りて (Noborite)",
              "{登|のぼ}んで (Nobonde)"
            ],
            "correct": 1,
            "why": "**{登|のぼ}って** (Nobotte). Nhóm 1: り → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {乗|の}ります (Norimasu) (đi (tàu xe)) là gì?",
            "options": [
              "{乗|の}いて (Noite)",
              "{乗|の}って (Notte)",
              "{乗|の}りて (Norite)",
              "{乗|の}んで (Nonde)"
            ],
            "correct": 1,
            "why": "**{乗|の}って** (Notte). Nhóm 1: り → って (い・ち・り → って)."
          },
          {
            "q": "Thể て của {走|はし}ります (Hashirimasu) (chạy) là gì?",
            "options": [
              "{走|はし}って (Hashitte)",
              "{走|はし}して (Hashishite)",
              "{走|はし}いて (Hashiite)",
              "{走|はし}んで (Hashinde)"
            ],
            "correct": 0,
            "why": "**{走|はし}って** (Hashitte). Nhóm 1: り → って (い・ち・り → って). Nhóm 1: 走ります → 走って."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-4",
        "title": "Chọn thể て — Nhóm 2 (16 câu)",
        "items": [
          {
            "q": "Thể て của {食|た}べます (Tabemasu) (ăn) là gì?",
            "options": [
              "{食|た}べて (Tabete)",
              "{食|た}べんで (Tabende)",
              "{食|た}べいて (Tabeite)",
              "{食|た}べして (Tabeshite)"
            ],
            "correct": 0,
            "why": "**{食|た}べて** (Tabete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của {寝|ね}ます (Nemasu) (ngủ) là gì?",
            "options": [
              "{寝|ね}て (Nete)",
              "{寝|ね}いて (Neite)",
              "{寝|ね}って (Nette)",
              "{寝|ね}んで (Nende)"
            ],
            "correct": 0,
            "why": "**{寝|ね}て** (Nete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của {見|み}ます (Mimasu) (xem) là gì?",
            "options": [
              "{見|み}して (Mishite)",
              "{見|み}いで (Miide)",
              "{見|み}て (Mite)",
              "{見|み}って (Mitte)"
            ],
            "correct": 2,
            "why": "**{見|み}て** (Mite). Nhóm 2: bỏ ます, thêm て. Nhóm 2 ngoại lệ (âm い trước ます): 見ます → 見て."
          },
          {
            "q": "Thể て của {起|お}きます (Okimasu) (thức dậy) là gì?",
            "options": [
              "{起|お}きして (Okishite)",
              "{起|お}きって (Okitte)",
              "{起|お}きて (Okite)",
              "{起|お}きいで (Okiide)"
            ],
            "correct": 2,
            "why": "**{起|お}きて** (Okite). Nhóm 2: bỏ ます, thêm て. Nhóm 2 ngoại lệ: 起きます → 起きて (không phải 起いて)."
          },
          {
            "q": "Thể て của {着|き}ます (Kimasu) (mặc) là gì?",
            "options": [
              "{着|き}って (Kitte)",
              "{着|き}いで (Kiide)",
              "{着|き}して (Kishite)",
              "{着|き}て (Kite)"
            ],
            "correct": 3,
            "why": "**{着|き}て** (Kite). Nhóm 2: bỏ ます, thêm て. Nhóm 2: 着ます → 着て."
          },
          {
            "q": "Thể て của います (Imasu) (có, ở) là gì?",
            "options": [
              "いいで (Iide)",
              "いいて (Iite)",
              "いて (Ite)",
              "いって (Itte)"
            ],
            "correct": 2,
            "why": "**いて** (Ite). Nhóm 2: bỏ ます, thêm て. Nhóm 2: います → いて."
          },
          {
            "q": "Thể て của {借|か}ります (Karimasu) (mượn) là gì?",
            "options": [
              "{借|か}りて (Karite)",
              "{借|か}りって (Karitte)",
              "{借|か}りいで (Kariide)",
              "{借|か}りして (Karishite)"
            ],
            "correct": 0,
            "why": "**{借|か}りて** (Karite). Nhóm 2: bỏ ます, thêm て. Nhóm 2 ngoại lệ: 借ります → 借りて (không phải 借って)."
          },
          {
            "q": "Thể て của {出|で}ます (Demasu) (đi ra) là gì?",
            "options": [
              "{出|で}て (Dete)",
              "{出|で}いて (Deite)",
              "{出|で}いで (Deide)",
              "{出|で}って (Dette)"
            ],
            "correct": 0,
            "why": "**{出|で}て** (Dete). Nhóm 2: bỏ ます, thêm て. Nhóm 2: 出ます → 出て (khác 出します → 出して)."
          },
          {
            "q": "Thể て của {教|おし}えます (Oshiemasu) (dạy) là gì?",
            "options": [
              "{教|おし}えって (Oshiette)",
              "{教|おし}えて (Oshiete)",
              "{教|おし}えいで (Oshieide)",
              "{教|おし}えんで (Oshiende)"
            ],
            "correct": 1,
            "why": "**{教|おし}えて** (Oshiete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của {入|い}れます (Iremasu) (cho vào) là gì?",
            "options": [
              "{入|い}れんで (Irende)",
              "{入|い}れいて (Ireite)",
              "{入|い}れて (Irete)",
              "{入|い}れして (Ireshite)"
            ],
            "correct": 2,
            "why": "**{入|い}れて** (Irete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của {開|あ}けます (Akemasu) (mở) là gì?",
            "options": [
              "{開|あ}けいで (Akeide)",
              "{開|あ}けして (Akeshite)",
              "{開|あ}けいて (Akeite)",
              "{開|あ}けて (Akete)"
            ],
            "correct": 3,
            "why": "**{開|あ}けて** (Akete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của {閉|し}めます (Shimemasu) (đóng) là gì?",
            "options": [
              "{閉|し}めして (Shimeshite)",
              "{閉|し}めって (Shimette)",
              "{閉|し}めて (Shimete)",
              "{閉|し}めいで (Shimeide)"
            ],
            "correct": 2,
            "why": "**{閉|し}めて** (Shimete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của かけます (Kakemasu) (gọi (điện thoại)) là gì?",
            "options": [
              "かけって (Kakette)",
              "かけして (Kakeshite)",
              "かけんで (Kakende)",
              "かけて (Kakete)"
            ],
            "correct": 3,
            "why": "**かけて** (Kakete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của {覚|おぼ}えます (Oboemasu) (nhớ) là gì?",
            "options": [
              "{覚|おぼ}えいて (Oboeite)",
              "{覚|おぼ}えんで (Oboende)",
              "{覚|おぼ}えいで (Oboeide)",
              "{覚|おぼ}えて (Oboete)"
            ],
            "correct": 3,
            "why": "**{覚|おぼ}えて** (Oboete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của {始|はじ}めます (Hajimemasu) (bắt đầu) là gì?",
            "options": [
              "{始|はじ}めて (Hajimete)",
              "{始|はじ}めいて (Hajimeite)",
              "{始|はじ}めんで (Hajimende)",
              "{始|はじ}めして (Hajimeshite)"
            ],
            "correct": 0,
            "why": "**{始|はじ}めて** (Hajimete). Nhóm 2: bỏ ます, thêm て."
          },
          {
            "q": "Thể て của {止|と}めます (Tomemasu) (dừng) là gì?",
            "options": [
              "{止|と}めいて (Tomeite)",
              "{止|と}めいで (Tomeide)",
              "{止|と}めて (Tomete)",
              "{止|と}めって (Tomette)"
            ],
            "correct": 2,
            "why": "**{止|と}めて** (Tomete). Nhóm 2: bỏ ます, thêm て."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-5",
        "title": "Chọn thể て — Nhóm 3 (9 câu)",
        "items": [
          {
            "q": "Thể て của します (Shimasu) (làm) là gì?",
            "options": [
              "して (Shite)",
              "しして (Shishite)",
              "しいて (Shiite)",
              "しって (Shitte)"
            ],
            "correct": 0,
            "why": "**して** (Shite). Nhóm 3: します → して · 来ます → 来て."
          },
          {
            "q": "Thể て của {来|き}ます (Kimasu) (đến) là gì?",
            "options": [
              "{来|き}て (Kite)",
              "{来|き}んで (Kinde)",
              "{来|き}きて (Kikite)",
              "{来|き}いて (Kiite)"
            ],
            "correct": 0,
            "why": "**{来|き}て** (Kite). Nhóm 3: します → して · 来ます → 来て. Nhóm 3: 来ます → 来て (き, không phải 来って)."
          },
          {
            "q": "Thể て của {勉強|べんきょう}します (Benkyou shimasu) (học) là gì?",
            "options": [
              "{勉強|べんきょう}しいて (Benkyou shiite)",
              "{勉強|べんきょう}して (Benkyou shite)",
              "{勉強|べんきょう}しいで (Benkyou shiide)",
              "{勉強|べんきょう}しんで (Benkyou shinde)"
            ],
            "correct": 1,
            "why": "**{勉強|べんきょう} して** (Benkyou shite). Nhóm 3: します → して · 来ます → 来て."
          },
          {
            "q": "Thể て của {掃除|そうじ}します (Souji shimasu) (dọn dẹp) là gì?",
            "options": [
              "{掃除|そうじ}しって (Souji shitte)",
              "{掃除|そうじ}しんで (Souji shinde)",
              "{掃除|そうじ}しいで (Souji shiide)",
              "{掃除|そうじ}して (Souji shite)"
            ],
            "correct": 3,
            "why": "**{掃除|そうじ} して** (Souji shite). Nhóm 3: します → して · 来ます → 来て."
          },
          {
            "q": "Thể て của {洗濯|せんたく}します (Sentaku shimasu) (giặt đồ) là gì?",
            "options": [
              "{洗濯|せんたく}しいて (Sentaku shiite)",
              "{洗濯|せんたく}して (Sentaku shite)",
              "{洗濯|せんたく}しんで (Sentaku shinde)",
              "{洗濯|せんたく}しいで (Sentaku shiide)"
            ],
            "correct": 1,
            "why": "**{洗濯|せんたく} して** (Sentaku shite). Nhóm 3: します → して · 来ます → 来て."
          },
          {
            "q": "Thể て của {買|か}い{物|もの}します (Kaimono shimasu) (mua sắm) là gì?",
            "options": [
              "{買|か}い{物|もの}しして (Kaimono shishite)",
              "{買|か}い{物|もの}しいて (Kaimono shiite)",
              "{買|か}い{物|もの}しって (Kaimono shitte)",
              "{買|か}い{物|もの}して (Kaimono shite)"
            ],
            "correct": 3,
            "why": "**{買|か}い{物|もの} して** (Kaimono shite). Nhóm 3: します → して · 来ます → 来て."
          },
          {
            "q": "Thể て của {食事|しょくじ}します (Shokuji shimasu) (dùng bữa) là gì?",
            "options": [
              "{食事|しょくじ}しんで (Shokuji shinde)",
              "{食事|しょくじ}して (Shokuji shite)",
              "{食事|しょくじ}しして (Shokuji shishite)",
              "{食事|しょくじ}しいで (Shokuji shiide)"
            ],
            "correct": 1,
            "why": "**{食事|しょくじ} して** (Shokuji shite). Nhóm 3: します → して · 来ます → 来て."
          },
          {
            "q": "Thể て của {結婚|けっこん}します (Kekkon shimasu) (kết hôn) là gì?",
            "options": [
              "{結婚|けっこん}しいて (Kekkon shiite)",
              "{結婚|けっこん}しって (Kekkon shitte)",
              "{結婚|けっこん}して (Kekkon shite)",
              "{結婚|けっこん}しして (Kekkon shishite)"
            ],
            "correct": 2,
            "why": "**{結婚|けっこん} して** (Kekkon shite). Nhóm 3: します → して · 来ます → 来て."
          },
          {
            "q": "Thể て của {持|も}って{来|き}ます (Motte kimasu) (mang đến) là gì?",
            "options": [
              "{持|も}って{来|き}て (Motte kite)",
              "{持|も}って{来|き}いで (Motte kiide)",
              "{持|も}って{来|き}きて (Motte kikite)",
              "{持|も}って{来|き}して (Motte kishite)"
            ],
            "correct": 0,
            "why": "**{持|も}って {来|き}て** (Motte kite). Nhóm 3: します → して · 来ます → 来て."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · gõ thể て · từ て về ます · điền vào câu ～てください · tìm chỗ chia sai"
      },
      {
        "t": "quiz",
        "id": "lt-b7-te-go",
        "title": "Gõ thể て của động từ cho trước (31 câu)",
        "kind": "translate",
        "items": [
          {
            "q": "Gõ thể て của 「書きます」 = viết",
            "answers": [
              "書いて",
              "かいて"
            ],
            "hint": "Nhóm 1: き → いて (き → いて)"
          },
          {
            "q": "Gõ thể て của 「弾きます」 = chơi (đàn)",
            "answers": [
              "弾いて",
              "ひいて"
            ],
            "hint": "Nhóm 1: き → いて (き → いて)"
          },
          {
            "q": "Gõ thể て của 「働きます」 = làm việc",
            "answers": [
              "働いて",
              "はたらいて"
            ],
            "hint": "Nhóm 1: き → いて (き → いて)"
          },
          {
            "q": "Gõ thể て của 「泳ぎます」 = bơi",
            "answers": [
              "泳いで",
              "およいで"
            ],
            "hint": "Nhóm 1: ぎ → いで (ぎ → いで)"
          },
          {
            "q": "Gõ thể て của 「話します」 = nói chuyện",
            "answers": [
              "話して",
              "はなして"
            ],
            "hint": "Nhóm 1: し → して (し → して)"
          },
          {
            "q": "Gõ thể て của 「出します」 = lấy ra; nộp",
            "answers": [
              "出して",
              "だして"
            ],
            "hint": "Nhóm 1: し → して (し → して)"
          },
          {
            "q": "Gõ thể て của 「読みます」 = đọc",
            "answers": [
              "読んで",
              "よんで"
            ],
            "hint": "Nhóm 1: み → んで (み・び・に → んで)"
          },
          {
            "q": "Gõ thể て của 「遊びます」 = chơi",
            "answers": [
              "遊んで",
              "あそんで"
            ],
            "hint": "Nhóm 1: び → んで (み・び・に → んで)"
          },
          {
            "q": "Gõ thể て của 「死にます」 = chết",
            "answers": [
              "死んで",
              "しんで"
            ],
            "hint": "Nhóm 1: に → んで (み・び・に → んで)"
          },
          {
            "q": "Gõ thể て của 「会います」 = gặp",
            "answers": [
              "会って",
              "あって"
            ],
            "hint": "Nhóm 1: い → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「洗います」 = rửa",
            "answers": [
              "洗って",
              "あらって"
            ],
            "hint": "Nhóm 1: い → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「吸います」 = hút",
            "answers": [
              "吸って",
              "すって"
            ],
            "hint": "Nhóm 1: い → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「習います」 = học (một kỹ năng)",
            "answers": [
              "習って",
              "ならって"
            ],
            "hint": "Nhóm 1: い → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「待ちます」 = đợi",
            "answers": [
              "待って",
              "まって"
            ],
            "hint": "Nhóm 1: ち → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「取ります」 = lấy, cầm",
            "answers": [
              "取って",
              "とって"
            ],
            "hint": "Nhóm 1: り → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「入ります」 = đi vào",
            "answers": [
              "入って",
              "はいって"
            ],
            "hint": "Nhóm 1: り → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「わかります」 = hiểu, biết",
            "answers": [
              "わかって"
            ],
            "hint": "Nhóm 1: り → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「乗ります」 = đi (tàu xe)",
            "answers": [
              "乗って",
              "のって"
            ],
            "hint": "Nhóm 1: り → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て của 「食べます」 = ăn",
            "answers": [
              "食べて",
              "たべて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て của 「見ます」 = xem",
            "answers": [
              "見て",
              "みて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て của 「着ます」 = mặc",
            "answers": [
              "着て",
              "きて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て của 「借ります」 = mượn",
            "answers": [
              "借りて",
              "かりて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て của 「教えます」 = dạy",
            "answers": [
              "教えて",
              "おしえて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て của 「開けます」 = mở",
            "answers": [
              "開けて",
              "あけて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て của 「かけます」 = gọi (điện thoại)",
            "answers": [
              "かけて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て của 「始めます」 = bắt đầu",
            "answers": [
              "始めて",
              "はじめて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て của 「します」 = làm",
            "answers": [
              "して"
            ],
            "hint": "Nhóm 3: します → して · 来ます → 来て"
          },
          {
            "q": "Gõ thể て của 「勉強します」 = học",
            "answers": [
              "勉強して",
              "べんきょうして"
            ],
            "hint": "Nhóm 3: します → して · 来ます → 来て"
          },
          {
            "q": "Gõ thể て của 「洗濯します」 = giặt đồ",
            "answers": [
              "洗濯して",
              "せんたくして"
            ],
            "hint": "Nhóm 3: します → して · 来ます → 来て"
          },
          {
            "q": "Gõ thể て của 「食事します」 = dùng bữa",
            "answers": [
              "食事して",
              "しょくじして"
            ],
            "hint": "Nhóm 3: します → して · 来ます → 来て"
          },
          {
            "q": "Gõ thể て của 「持って来ます」 = mang đến",
            "answers": [
              "持って来て",
              "持ってきて",
              "もって来て",
              "もってきて"
            ],
            "hint": "Nhóm 3: します → して · 来ます → 来て"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-nguoc",
        "title": "Từ thể て đoán dạng ます (12 câu)",
        "items": [
          {
            "q": "Dạng ます của 「書いて」 là gì? (chọn động từ có thật)",
            "options": [
              "{書|か}います (Kaimasu)",
              "{書|か}ぎます (Kagimasu)",
              "{書|か}ちます (Kachimasu)",
              "{書|か}きます (Kakimasu)"
            ],
            "correct": 3,
            "why": "{書|か}いて ← {書|か}きます (Kakimasu). いて: hàng き."
          },
          {
            "q": "Dạng ます của 「読んで」 là gì? (chọn động từ có thật)",
            "options": [
              "{読|よ}みます (Yomimasu)",
              "{読|よ}びます (Yobimasu)",
              "{読|よ}にます (Yonimasu)",
              "{読|よ}ります (Yorimasu)"
            ],
            "correct": 0,
            "why": "{読|よ}んで ← {読|よ}みます (Yomimasu). んで: hàng み."
          },
          {
            "q": "Dạng ます của 「泳いで」 là gì? (chọn động từ có thật)",
            "options": [
              "{泳|およ}きます (Oyokimasu)",
              "{泳|およ}ぎます (Oyogimasu)",
              "{泳|およ}います (Oyoimasu)",
              "{泳|およ}します (Oyoshimasu)"
            ],
            "correct": 1,
            "why": "{泳|およ}いで ← {泳|およ}ぎます (Oyogimasu). いで: hàng ぎ."
          },
          {
            "q": "Dạng ます của 「話して」 là gì? (chọn động từ có thật)",
            "options": [
              "{話|はな}ります (Hanarimasu)",
              "{話|はな}ちます (Hanachimasu)",
              "{話|はな}きます (Hanakimasu)",
              "{話|はな}します (Hanashimasu)"
            ],
            "correct": 3,
            "why": "{話|はな}して ← {話|はな}します (Hanashimasu). して: hàng し."
          },
          {
            "q": "Dạng ます của 「買って」 là gì? (chọn động từ có thật)",
            "options": [
              "{買|か}います (Kaimasu)",
              "{買|か}きます (Kakimasu)",
              "{買|か}ちます (Kachimasu)",
              "{買|か}みます (Kamimasu)"
            ],
            "correct": 0,
            "why": "{買|か}って ← {買|か}います (Kaimasu). って: hàng い."
          },
          {
            "q": "Dạng ます của 「遊んで」 là gì? (chọn động từ có thật)",
            "options": [
              "{遊|あそ}ぎます (Asogimasu)",
              "{遊|あそ}びます (Asobimasu)",
              "{遊|あそ}にます (Asonimasu)",
              "{遊|あそ}みます (Asomimasu)"
            ],
            "correct": 1,
            "why": "{遊|あそ}んで ← {遊|あそ}びます (Asobimasu). んで: hàng び."
          },
          {
            "q": "Dạng ます của 「待って」 là gì? (chọn động từ có thật)",
            "options": [
              "{待|ま}います (Maimasu)",
              "{待|ま}ります (Marimasu)",
              "{待|ま}します (Mashimasu)",
              "{待|ま}ちます (Machimasu)"
            ],
            "correct": 3,
            "why": "{待|ま}って ← {待|ま}ちます (Machimasu). って: hàng ち."
          },
          {
            "q": "Dạng ます của 「飲んで」 là gì? (chọn động từ có thật)",
            "options": [
              "{飲|の}びます (Nobimasu)",
              "{飲|の}みます (Nomimasu)",
              "{飲|の}にます (Nonimasu)",
              "{飲|の}ります (Norimasu)"
            ],
            "correct": 1,
            "why": "{飲|の}んで ← {飲|の}みます (Nomimasu). んで: hàng み."
          },
          {
            "q": "Dạng ます của 「聞いて」 là gì? (chọn động từ có thật)",
            "options": [
              "{聞|き}います (Kiimasu)",
              "{聞|き}きます (Kikimasu)",
              "{聞|き}ぎます (Kigimasu)",
              "{聞|き}ちます (Kichimasu)"
            ],
            "correct": 1,
            "why": "{聞|き}いて ← {聞|き}きます (Kikimasu). いて: hàng き."
          },
          {
            "q": "Dạng ます của 「貸して」 là gì? (chọn động từ có thật)",
            "options": [
              "{貸|か}きます (Kakimasu)",
              "{貸|か}ります (Karimasu)",
              "{貸|か}ちます (Kachimasu)",
              "{貸|か}します (Kashimasu)"
            ],
            "correct": 3,
            "why": "{貸|か}して ← {貸|か}します (Kashimasu). して: hàng し."
          },
          {
            "q": "Dạng ます của 「洗って」 là gì? (chọn động từ có thật)",
            "options": [
              "{洗|あら}ちます (Arachimasu)",
              "{洗|あら}きます (Arakimasu)",
              "{洗|あら}います (Araimasu)",
              "{洗|あら}みます (Aramimasu)"
            ],
            "correct": 2,
            "why": "{洗|あら}って ← {洗|あら}います (Araimasu). って: hàng い."
          },
          {
            "q": "Dạng ます của 「休んで」 là gì? (chọn động từ có thật)",
            "options": [
              "{休|やす}ります (Yasurimasu)",
              "{休|やす}びます (Yasubimasu)",
              "{休|やす}にます (Yasunimasu)",
              "{休|やす}みます (Yasumimasu)"
            ],
            "correct": 3,
            "why": "{休|やす}んで ← {休|やす}みます (Yasumimasu). んで: hàng み."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-te-cau",
        "title": "Điền thể て vào câu ～てください (15 câu)",
        "kind": "fill",
        "grammar": "V て ください",
        "items": [
          {
            "q": "{窓|まど}を＿＿ください。　〔Mado o __ kudasai.〕",
            "answers": [
              "開けて",
              "あけて"
            ],
            "hint": "Động từ: 開けます → thể て"
          },
          {
            "q": "ここに{名前|なまえ}を＿＿ください。　〔Koko ni namae o __ kudasai.〕",
            "answers": [
              "書いて",
              "かいて"
            ],
            "hint": "Động từ: 書きます → thể て"
          },
          {
            "q": "すみません、{塩|しお}を＿＿ください。　〔Sumimasen, shio o __ kudasai.〕",
            "answers": [
              "取って",
              "とって"
            ],
            "hint": "Động từ: 取ります → thể て"
          },
          {
            "q": "この{漢字|かんじ}の{読|よ}み{方|かた}を＿＿ください。　〔Kono kanji no yomikata o __ kudasai.〕",
            "answers": [
              "教えて",
              "おしえて"
            ],
            "hint": "Động từ: 教えます → thể て"
          },
          {
            "q": "{電話|でんわ}を＿＿ください。　〔Denwa o __ kudasai.〕",
            "answers": [
              "かけて"
            ],
            "hint": "Động từ: かけます → thể て"
          },
          {
            "q": "ドアを＿＿ください。　〔Doa o __ kudasai.〕",
            "answers": [
              "閉めて",
              "しめて"
            ],
            "hint": "Động từ: 閉めます → thể て"
          },
          {
            "q": "すみませんが、ナイフを＿＿ください。　〔Sumimasen ga, naifu o __ kudasai.〕",
            "answers": [
              "貸して",
              "かして"
            ],
            "hint": "Động từ: 貸します → thể て"
          },
          {
            "q": "{皿|さら}を＿＿ください。　〔Sara o __ kudasai.〕",
            "answers": [
              "洗って",
              "あらって"
            ],
            "hint": "Động từ: 洗います → thể て"
          },
          {
            "q": "{冷蔵庫|れいぞうこ}にビールを＿＿ください。　〔Reizouko ni biiru o __ kudasai.〕",
            "answers": [
              "入れて",
              "いれて"
            ],
            "hint": "Động từ: 入れます → thể て"
          },
          {
            "q": "ここで＿＿ください。　〔Koko de __ kudasai.〕",
            "answers": [
              "待って",
              "まって"
            ],
            "hint": "Động từ: 待ちます → thể て"
          },
          {
            "q": "{早|はや}く＿＿ください。　〔Hayaku __ kudasai.〕",
            "answers": [
              "来て",
              "きて"
            ],
            "hint": "Động từ: 来ます → thể て"
          },
          {
            "q": "この{本|ほん}を＿＿ください。　〔Kono hon o __ kudasai.〕",
            "answers": [
              "読んで",
              "よんで"
            ],
            "hint": "Động từ: 読みます → thể て"
          },
          {
            "q": "{先生|せんせい}に＿＿ください。　〔Sensei ni __ kudasai.〕",
            "answers": [
              "聞いて",
              "きいて"
            ],
            "hint": "Động từ: 聞きます → thể て"
          },
          {
            "q": "{一緒|いっしょ}に＿＿ください。　〔Issho ni __ kudasai.〕",
            "answers": [
              "勉強して",
              "べんきょうして"
            ],
            "hint": "Động từ: 勉強します → thể て"
          },
          {
            "q": "{早|はや}く＿＿ください。　〔Hayaku __ kudasai.〕",
            "answers": [
              "寝て",
              "ねて"
            ],
            "hint": "Động từ: 寝ます → thể て"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-sai",
        "title": "Tìm chỗ chia thể て SAI (10 câu)",
        "items": [
          {
            "q": "(nhóm 1 き)　Câu nào chia thể て SAI?",
            "options": [
              "{書|か}いてください。 (Kaite kudasai.)",
              "{聞|き}いてください。 (Kiite kudasai.)",
              "{書|か}きてください。 (Kakite kudasai.)",
              "{置|お}いてください。 (Oite kudasai.)"
            ],
            "correct": 2,
            "why": "き → いて: 書いて (không phải 書きて)."
          },
          {
            "q": "(nhóm 1 み)　Câu nào chia thể て SAI?",
            "options": [
              "{読|よ}んでください。 (Yonde kudasai.)",
              "{飲|の}いでください。 (Noide kudasai.)",
              "{休|やす}んでください。 (Yasunde kudasai.)",
              "{飲|の}んでください。 (Nonde kudasai.)"
            ],
            "correct": 1,
            "why": "み → んで: 飲んで."
          },
          {
            "q": "(nhóm 1 ぎ)　Câu nào chia thể て SAI?",
            "options": [
              "{書|か}いてください。 (Kaite kudasai.)",
              "{急|いそ}いでください。 (Isoide kudasai.)",
              "{泳|およ}んでください。 (Oyonde kudasai.)",
              "{泳|およ}いでください。 (Oyoide kudasai.)"
            ],
            "correct": 2,
            "why": "ぎ → いで: 泳いで."
          },
          {
            "q": "(ngoại lệ)　Câu nào chia thể て SAI?",
            "options": [
              "{聞|き}いてください。 (Kiite kudasai.)",
              "{行|い}ってください。 (Itte kudasai.)",
              "{書|か}いてください。 (Kaite kudasai.)",
              "{行|い}いてください。 (Iite kudasai.)"
            ],
            "correct": 3,
            "why": "Ngoại lệ: 行きます → 行って."
          },
          {
            "q": "(nhóm 2)　Câu nào chia thể て SAI?",
            "options": [
              "{見|み}てください。 (Mite kudasai.)",
              "{食|た}べってください。 (Tabette kudasai.)",
              "{寝|ね}てください。 (Nete kudasai.)",
              "{食|た}べてください。 (Tabete kudasai.)"
            ],
            "correct": 1,
            "why": "Nhóm 2: bỏ ます + て (食べて)."
          },
          {
            "q": "(nhóm 3)　Câu nào chia thể て SAI?",
            "options": [
              "してください。 (Shite kudasai.)",
              "{来|き}てください。 (Kite kudasai.)",
              "{勉強|べんきょう}してください。 (Benkyoushite kudasai.)",
              "{来|き}ってください。 (Kitte kudasai.)"
            ],
            "correct": 3,
            "why": "Nhóm 3: 来て."
          },
          {
            "q": "(bẫy nhóm 1)　Câu nào chia thể て SAI?",
            "options": [
              "{切|き}りてください。 (Kirite kudasai.)",
              "{切|き}ってください。 (Kitte kudasai.)",
              "{帰|かえ}ってください。 (Kaette kudasai.)",
              "{入|はい}ってください。 (Haitte kudasai.)"
            ],
            "correct": 0,
            "why": "切ります là nhóm 1: 切って."
          },
          {
            "q": "(bẫy nhóm 2)　Câu nào chia thể て SAI?",
            "options": [
              "{着|き}てください。 (Kite kudasai.)",
              "{借|か}ってください。 (Katte kudasai.)",
              "{起|お}きてください。 (Okite kudasai.)",
              "{借|か}りてください。 (Karite kudasai.)"
            ],
            "correct": 1,
            "why": "借ります là nhóm 2: 借りて."
          },
          {
            "q": "(し)　Câu nào chia thể て SAI?",
            "options": [
              "{貸|か}してください。 (Kashite kudasai.)",
              "{話|はな}んでください。 (Hanande kudasai.)",
              "{話|はな}してください。 (Hanashite kudasai.)",
              "{出|だ}してください。 (Dashite kudasai.)"
            ],
            "correct": 1,
            "why": "し → して: 話して."
          },
          {
            "q": "(い・ち・り)　Câu nào chia thể て SAI?",
            "options": [
              "{会|あ}んでください。 (Ande kudasai.)",
              "{取|と}ってください。 (Totte kudasai.)",
              "{待|ま}ってください。 (Matte kudasai.)",
              "{会|あ}ってください。 (Atte kudasai.)"
            ],
            "correct": 0,
            "why": "い・ち・り → って: 会って."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-cap",
        "title": "Cặp dễ nhầm (6 câu)",
        "items": [
          {
            "q": "「{切|き}ります」 (cắt) và 「{着|き}ます」 (mặc): thể て của chúng là?",
            "options": [
              "{切|き}て ・ {着|き}って",
              "{切|き}って ・ {着|き}て",
              "{切|き}て ・ {着|き}て",
              "{切|き}って ・ {着|き}って"
            ],
            "correct": 1,
            "why": "切る = nhóm 1 → 切って; 着る = nhóm 2 → 着て."
          },
          {
            "q": "「{入|はい}ります」 (đi vào) và 「{入|い}れます」 (cho vào): thể て là?",
            "options": [
              "{入|はい}って ・ {入|い}って",
              "{入|はい}れて ・ {入|い}って",
              "{入|はい}れて ・ {入|い}れて",
              "{入|はい}って ・ {入|い}れて"
            ],
            "correct": 3,
            "why": "入る = nhóm 1 → 入って; 入れる = nhóm 2 → 入れて."
          },
          {
            "q": "「{出|だ}します」 (lấy ra) và 「{出|で}ます」 (đi ra): thể て là?",
            "options": [
              "{出|だ}て ・ {出|で}て",
              "{出|だ}して ・ {出|で}して",
              "{出|だ}して ・ {出|で}て",
              "{出|だ}て ・ {出|で}して"
            ],
            "correct": 2,
            "why": "出す = nhóm 1 → 出して; 出る = nhóm 2 → 出て."
          },
          {
            "q": "「{帰|かえ}ります」 thể て là?",
            "options": [
              "{帰|かえ}って",
              "{帰|かえ}りて",
              "{帰|かえ}んで",
              "{帰|かえ}て"
            ],
            "correct": 0,
            "why": "帰る là nhóm 1 (ngoại lệ trông như nhóm 2): 帰って."
          },
          {
            "q": "「{行|い}きます」 thể て là?",
            "options": [
              "{行|い}いて",
              "{行|い}って",
              "{行|い}んで",
              "{行|い}きて"
            ],
            "correct": 1,
            "why": "行く là ngoại lệ: 行って."
          },
          {
            "q": "「{持|も}って{来|き}ます」 (mang đến) thể て là?",
            "options": [
              "{持|も}って{来|き}って",
              "{持|も}って{来|き}んで",
              "{持|も}って{来|き}て",
              "{持|も}って{来|き}いて"
            ],
            "correct": 2,
            "why": "Phần sau là 来ます → 来て."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bẫy nhóm · gõ hàng loạt · ghép câu"
      },
      {
        "t": "mcq",
        "id": "lt-b7-te-bay",
        "title": "Nhận nhóm các động từ BẪY (12 câu)",
        "items": [
          {
            "q": "{帰|かえ}ります (Kaerimasu) = về　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{帰|かえ}ります là nhóm 1. Trông như nhóm 2 nhưng là nhóm 1: 帰ります → 帰って"
          },
          {
            "q": "{入|はい}ります (Hairimasu) = đi vào　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{入|はい}ります là nhóm 1. Nhóm 1: 入ります → 入って (khác 入れます → 入れて)"
          },
          {
            "q": "{切|き}ります (Kirimasu) = cắt　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{切|き}ります là nhóm 1. Nhóm 1: 切ります → 切って (khác 着ます → 着て)"
          },
          {
            "q": "わかります (Wakarimasu) = hiểu, biết　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "わかります là nhóm 1. Nhóm 1: わかります → わかって"
          },
          {
            "q": "{走|はし}ります (Hashirimasu) = chạy　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{走|はし}ります là nhóm 1. Nhóm 1: 走ります → 走って"
          },
          {
            "q": "{見|み}ます (Mimasu) = xem　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{見|み}ます là nhóm 2. Nhóm 2 ngoại lệ (âm い trước ます): 見ます → 見て"
          },
          {
            "q": "{起|お}きます (Okimasu) = thức dậy　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{起|お}きます là nhóm 2. Nhóm 2 ngoại lệ: 起きます → 起きて (không phải 起いて)"
          },
          {
            "q": "{借|か}ります (Karimasu) = mượn　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{借|か}ります là nhóm 2. Nhóm 2 ngoại lệ: 借ります → 借りて (không phải 借って)"
          },
          {
            "q": "{着|き}ます (Kimasu) = mặc　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{着|き}ます là nhóm 2. Nhóm 2: 着ます → 着て"
          },
          {
            "q": "います (Imasu) = có, ở　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "います là nhóm 2. Nhóm 2: います → いて"
          },
          {
            "q": "{出|で}ます (Demasu) = đi ra　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{出|で}ます là nhóm 2. Nhóm 2: 出ます → 出て (khác 出します → 出して)"
          },
          {
            "q": "{来|き}ます (Kimasu) = đến　→ thuộc nhóm nào?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{来|き}ます là nhóm 3. Nhóm 3: 来ます → 来て (き, không phải 来って)"
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-te-hang-loat",
        "title": "Gõ thể て hàng loạt (12 câu)",
        "kind": "translate",
        "items": [
          {
            "q": "Gõ thể て: 「置きます」 = đặt, để",
            "answers": [
              "置いて",
              "おいて"
            ],
            "hint": "Nhóm 1: き → いて (き → いて)"
          },
          {
            "q": "Gõ thể て: 「貸します」 = cho mượn",
            "answers": [
              "貸して",
              "かして"
            ],
            "hint": "Nhóm 1: し → して (し → して)"
          },
          {
            "q": "Gõ thể て: 「休みます」 = nghỉ",
            "answers": [
              "休んで",
              "やすんで"
            ],
            "hint": "Nhóm 1: み → んで (み・び・に → んで)"
          },
          {
            "q": "Gõ thể て: 「洗います」 = rửa",
            "answers": [
              "洗って",
              "あらって"
            ],
            "hint": "Nhóm 1: い → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て: 「切ります」 = cắt",
            "answers": [
              "切って",
              "きって"
            ],
            "hint": "Nhóm 1: り → って (い・ち・り → って)"
          },
          {
            "q": "Gõ thể て: 「寝ます」 = ngủ",
            "answers": [
              "寝て",
              "ねて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て: 「起きます」 = thức dậy",
            "answers": [
              "起きて",
              "おきて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て: 「出ます」 = đi ra",
            "answers": [
              "出て",
              "でて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て: 「入れます」 = cho vào",
            "answers": [
              "入れて",
              "いれて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て: 「覚えます」 = nhớ",
            "answers": [
              "覚えて",
              "おぼえて"
            ],
            "hint": "Nhóm 2: bỏ ます, thêm て"
          },
          {
            "q": "Gõ thể て: 「します」 = làm",
            "answers": [
              "して"
            ],
            "hint": "Nhóm 3: します → して · 来ます → 来て"
          },
          {
            "q": "Gõ thể て: 「買い物します」 = mua sắm",
            "answers": [
              "買い物して",
              "買いものして",
              "かい物して",
              "かいものして"
            ],
            "hint": "Nhóm 3: します → して · 来ます → 来て"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-te-ghep",
        "title": "Ghép câu nhờ vả bằng ～てください (6 câu)",
        "items": [
          {
            "vi": "Hãy mở cửa sổ.",
            "chips": [
              "{開|あ}けます",
              "{窓|まど}を",
              "{開|あ}けて",
              "ください"
            ],
            "answer": [
              "{窓|まど}を",
              "{開|あ}けて",
              "ください"
            ],
            "ro": "Mado o akete kudasai."
          },
          {
            "vi": "Hãy viết tên ở đây.",
            "chips": [
              "ください",
              "ここに",
              "{書|か}きて",
              "{書|か}いて",
              "{名前|なまえ}を"
            ],
            "answer": [
              "ここに",
              "{名前|なまえ}を",
              "{書|か}いて",
              "ください"
            ],
            "ro": "Koko ni namae o kaite kudasai."
          },
          {
            "vi": "Hãy cho tôi mượn dao.",
            "chips": [
              "{貸|か}して",
              "{貸|か}んで",
              "ナイフを",
              "ください"
            ],
            "answer": [
              "ナイフを",
              "{貸|か}して",
              "ください"
            ],
            "ro": "Naifu o kashite kudasai."
          },
          {
            "vi": "Hãy đợi ở đây.",
            "chips": [
              "{待|ま}って",
              "ください",
              "{待|ま}いて",
              "ここで"
            ],
            "answer": [
              "ここで",
              "{待|ま}って",
              "ください"
            ],
            "ro": "Koko de matte kudasai."
          },
          {
            "vi": "Hãy đến sớm.",
            "chips": [
              "{早|はや}く",
              "ください",
              "{来|き}って",
              "{来|き}て"
            ],
            "answer": [
              "{早|はや}く",
              "{来|き}て",
              "ください"
            ],
            "ro": "Hayaku kite kudasai."
          },
          {
            "vi": "Hãy chỉ cho tôi cách đọc chữ này.",
            "chips": [
              "{教|おし}えます",
              "{漢字|かんじ}の",
              "{教|おし}えて",
              "この",
              "{読|よ}み{方|かた}を",
              "ください"
            ],
            "answer": [
              "この",
              "{漢字|かんじ}の",
              "{読|よ}み{方|かた}を",
              "{教|おし}えて",
              "ください"
            ],
            "ro": "Kono kanji no yomikata o oshiete kudasai."
          }
        ]
      },
      {
        "t": "note",
        "title": "Cách tự kiểm tra 5 phút mỗi ngày",
        "items": [
          "Lấy 10 động từ bất kỳ trong danh sách của cô, nhìn ます-form và nói to thể て. Sai thì đánh dấu, sáng mai làm lại đúng những từ đó.",
          "Ghi âm giọng bạn đọc: nghe lại xem có nhầm って/んで/いて không."
        ]
      }
    ]
  },
  {
    "id": "lt-b7-np-2",
    "kind": "homework",
    "title": "Luyện thêm Bài 7 · Ngữ pháp 2 (ポイント 63, 64, 65) — ～てください · ～ています · ～ましょうか (~101 câu)",
    "goal": "Dùng thể て đúng để nhờ/mời (V てください), nói đang làm gì (V ています) và chủ động đề nghị giúp (V ましょうか), kèm hỏi–đáp ở bữa tiệc và các trợ từ đi cùng (を・で・に・が).",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Ba mẫu, một \"chìa khoá\": **thể て**. Chia thể て xong mới thêm **ください** (nhờ/mời), **います** (đang) — còn **ましょうか** đi với gốc ます, KHÔNG dùng thể て.",
          "Phân biệt nhanh: **V てください** = người kia làm · **V ています** = đang làm · **V ましょうか** = để TÔI làm. Trước khi chọn, hỏi: *ai làm? bây giờ hay sau này?*",
          "Trợ từ: nơi làm hành động **で**, vật tác động **を**, người nhận **に**, người làm trong câu hỏi **が**. Dụng cụ **で** (ナイフで切る)."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**（N を）V て ください** — nhờ/bảo/mời. Lịch sự hơn: **すみませんが、**V て ください. Mời: **どうぞ、**V て ください.",
          "**N は（nơi で）N を V て います** — đang V. Hỏi: 何を して いますか。 Phủ định: V て いません.",
          "**（N を）V ましょうか** — Để tôi V giúp nhé? Nhận: ありがとうございます／お願いします · Từ chối: いいえ、大丈夫です."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · điền cả cụm động từ / điền ましょう"
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-63",
        "title": "ポイント 63: V て ください (12 câu)",
        "items": [
          {
            "q": "{窓|まど}を＿＿。　〔Mado o __.〕　— Hãy mở cửa sổ.",
            "options": [
              "{開|あ}けない ください",
              "{開|あ}ける ください",
              "{開|あ}けて ください",
              "{開|あ}けます ください"
            ],
            "correct": 2,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **{窓|まど}を{開|あ}けてください。** 〔Mado o akete kudasai.〕 — Hãy mở cửa sổ."
          },
          {
            "q": "ここに{名前|なまえ}を＿＿。　〔Koko ni namae o __.〕　— Hãy viết tên vào đây.",
            "options": [
              "{書|か}く ください",
              "{書|か}きます ください",
              "{書|か}いて ください",
              "{書|か}きて ください"
            ],
            "correct": 2,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **ここに{名前|なまえ}を{書|か}いてください。** 〔Koko ni namae o kaite kudasai.〕 — Hãy viết tên vào đây."
          },
          {
            "q": "すみませんが、{塩|しお}を＿＿。　〔Sumimasen ga, shio o __.〕　— Xin lỗi, hãy lấy giúp tôi muối.",
            "options": [
              "{取|と}って ください",
              "{取|と}りて ください",
              "{取|と}ります ください",
              "{取|と}る ください"
            ],
            "correct": 0,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **すみませんが、{塩|しお}を{取|と}ってください。** 〔Sumimasen ga, shio o totte kudasai.〕 — Xin lỗi, hãy lấy giúp tôi muối."
          },
          {
            "q": "すみませんが、この{漢字|かんじ}の{読|よ}み{方|かた}を＿＿。　〔Sumimasen ga, kono kanji no yomikata o __.〕　— Xin lỗi, hãy chỉ cho tôi cách đọc chữ Hán này.",
            "options": [
              "{教|おし}える ください",
              "{教|おし}えて ください",
              "{教|おし}えない ください",
              "{教|おし}えます ください"
            ],
            "correct": 1,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **すみませんが、この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。** 〔Sumimasen ga, kono kanji no yomikata o oshiete kudasai.〕 — Xin lỗi, hãy chỉ cho tôi cách đọc chữ Hán này."
          },
          {
            "q": "ここにビールを＿＿。　〔Koko ni biiru o __.〕　— Hãy cho bia vào đây.",
            "options": [
              "{入|い}れる ください",
              "{入|い}れます ください",
              "{入|い}れて ください",
              "{入|い}って ください"
            ],
            "correct": 2,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **ここにビールを{入|い}れてください。** 〔Koko ni biiru o irete kudasai.〕 — Hãy cho bia vào đây."
          },
          {
            "q": "ナイフで{肉|にく}を＿＿。　〔Naifu de niku o __.〕　— Hãy cắt thịt bằng dao.",
            "options": [
              "{切|き}りて ください",
              "{切|き}って ください",
              "{切|き}ます ください",
              "{切|き}る ください"
            ],
            "correct": 1,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **ナイフで{肉|にく}を{切|き}ってください。** 〔Naifu de niku o kitte kudasai.〕 — Hãy cắt thịt bằng dao."
          },
          {
            "q": "このペンを＿＿。　〔Kono pen o __.〕　— Hãy dùng cây bút này.",
            "options": [
              "{使|つか}って ください",
              "{使|つか}ます ください",
              "{使|つか}いて ください",
              "{使|つか}う ください"
            ],
            "correct": 0,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **このペンを{使|つか}ってください。** 〔Kono pen o tsukatte kudasai.〕 — Hãy dùng cây bút này."
          },
          {
            "q": "すみません、ちょっと＿＿。　〔Sumimasen, chotto __.〕　— Xin lỗi, hãy giúp tôi một chút.",
            "options": [
              "{手伝|てつだ}いて ください",
              "{手伝|てつだ}います ください",
              "{手伝|てつだ}って ください",
              "{手伝|てつだ}う ください"
            ],
            "correct": 2,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **すみません、ちょっと{手伝|てつだ}ってください。** 〔Sumimasen, chotto tetsudatte kudasai.〕 — Xin lỗi, hãy giúp tôi một chút."
          },
          {
            "q": "ドアを＿＿。　〔Doa o __.〕　— Hãy đóng cửa.",
            "options": [
              "{閉|し}める ください",
              "{閉|し}めます ください",
              "{閉|し}めて ください",
              "{閉|し}って ください"
            ],
            "correct": 2,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **ドアを{閉|し}めてください。** 〔Doa o shimete kudasai.〕 — Hãy đóng cửa."
          },
          {
            "q": "ギターを＿＿。　〔Gitaa o __.〕　— Hãy chơi ghi ta.",
            "options": [
              "{弾|ひ}って ください",
              "{弾|ひ}んで ください",
              "{弾|ひ}いて ください",
              "{弾|ひ}きて ください"
            ],
            "correct": 2,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **ギターを{弾|ひ}いてください。** 〔Gitaa o hiite kudasai.〕 — Hãy chơi ghi ta."
          },
          {
            "q": "{友達|ともだち}に{電話|でんわ}を＿＿。　〔Tomodachi ni denwa o __.〕　— Hãy gọi điện cho bạn.",
            "options": [
              "かって ください",
              "かけます ください",
              "かける ください",
              "かけて ください"
            ],
            "correct": 3,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **{友達|ともだち}に{電話|でんわ}をかけてください。** 〔Tomodachi ni denwa o kakete kudasai.〕 — Hãy gọi điện cho bạn."
          },
          {
            "q": "お{皿|さら}を＿＿。　〔Osara o __.〕　— Hãy rửa đĩa.",
            "options": [
              "{洗|あら}って ください",
              "{洗|あら}いて ください",
              "{洗|あら}う ください",
              "{洗|あら}います ください"
            ],
            "correct": 0,
            "why": "Nhờ làm gì = thể て + **ください** (ポイント 63). → **お{皿|さら}を{洗|あら}ってください。** 〔Osara o aratte kudasai.〕 — Hãy rửa đĩa."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-64",
        "title": "ポイント 64: V て います (8 câu)",
        "items": [
          {
            "q": "A：{何|なに}をしていますか。B：{手紙|てがみ}を＿＿。　〔A:nani o shite imasu ka. B:tegami o __.〕　— A: Bạn đang làm gì? B: Tôi đang viết thư.",
            "options": [
              "{書|か}きて います",
              "{書|か}く います",
              "{書|か}いて います",
              "{書|か}いて あります"
            ],
            "correct": 2,
            "why": "Đang làm gì = thể て + **います** (ポイント 64). → **A：{何|なに}をしていますか。B：{手紙|てがみ}を{書|か}いています。** 〔A:nani o shite imasu ka. B:tegami o kaite imasu.〕 — A: Bạn đang làm gì? B: Tôi đang viết thư."
          },
          {
            "q": "{台所|だいどころ}でお{皿|さら}を＿＿。　〔Daidokoro de osara o __.〕　— Đang rửa đĩa ở bếp.",
            "options": [
              "{洗|あら}います います",
              "{洗|あら}う います",
              "{洗|あら}いて います",
              "{洗|あら}って います"
            ],
            "correct": 3,
            "why": "Đang làm gì = thể て + **います** (ポイント 64). → **{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。** 〔Daidokoro de osara o aratte imasu.〕 — Đang rửa đĩa ở bếp."
          },
          {
            "q": "ワンさんはギターを＿＿。　〔Wan-san wa gitaa o __.〕　— Wang đang chơi ghi ta.",
            "options": [
              "{弾|ひ}きて います",
              "{弾|ひ}んで います",
              "{弾|ひ}く います",
              "{弾|ひ}いて います"
            ],
            "correct": 3,
            "why": "Đang làm gì = thể て + **います** (ポイント 64). → **ワンさんはギターを{弾|ひ}いています。** 〔Wan-san wa gitaa o hiite imasu.〕 — Wang đang chơi ghi ta."
          },
          {
            "q": "リンさんは{電話|でんわ}を＿＿。　〔Rin-san wa denwa o __.〕　— Rin đang gọi điện thoại.",
            "options": [
              "かけて います",
              "かって います",
              "かける います",
              "かけます います"
            ],
            "correct": 0,
            "why": "Đang làm gì = thể て + **います** (ポイント 64). → **リンさんは{電話|でんわ}をかけています。** 〔Rin-san wa denwa o kakete imasu.〕 — Rin đang gọi điện thoại."
          },
          {
            "q": "パクさんは{歌|うた}を＿＿。　〔Paku-san wa uta o __.〕　— Park đang hát.",
            "options": [
              "{歌|うた}いて います",
              "{歌|うた}んで います",
              "{歌|うた}う います",
              "{歌|うた}って います"
            ],
            "correct": 3,
            "why": "Đang làm gì = thể て + **います** (ポイント 64). → **パクさんは{歌|うた}を{歌|うた}っています。** 〔Paku-san wa uta o utatte imasu.〕 — Park đang hát."
          },
          {
            "q": "アンナさんは{本|ほん}を＿＿。　〔Anna-san wa hon o __.〕　— Anna đang đọc sách.",
            "options": [
              "{読|よ}む います",
              "{読|よ}いて います",
              "{読|よ}んで います",
              "{読|よ}って います"
            ],
            "correct": 2,
            "why": "Đang làm gì = thể て + **います** (ポイント 64). → **アンナさんは{本|ほん}を{読|よ}んでいます。** 〔Anna-san wa hon o yonde imasu.〕 — Anna đang đọc sách."
          },
          {
            "q": "ダニエルさんは{窓|まど}を＿＿。　〔Danieru-san wa mado o __.〕　— Daniel đang mở cửa sổ.",
            "options": [
              "{開|あ}ける います",
              "{開|あ}けて います",
              "{開|あ}けます います",
              "{開|あ}けない います"
            ],
            "correct": 1,
            "why": "Đang làm gì = thể て + **います** (ポイント 64). → **ダニエルさんは{窓|まど}を{開|あ}けています。** 〔Danieru-san wa mado o akete imasu.〕 — Daniel đang mở cửa sổ."
          },
          {
            "q": "{今|いま}、コーヒーを＿＿。　〔Ima, koohii o __.〕　— Bây giờ tôi đang uống cà phê.",
            "options": [
              "{飲|の}む います",
              "{飲|の}んで います",
              "{飲|の}いて います",
              "{飲|の}って います"
            ],
            "correct": 1,
            "why": "Đang làm gì = thể て + **います** (ポイント 64). → **{今|いま}、コーヒーを{飲|の}んでいます。** 〔Ima, koohii o nonde imasu.〕 — Bây giờ tôi đang uống cà phê."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-65",
        "title": "ポイント 65: V ましょうか (8 câu)",
        "items": [
          {
            "q": "{窓|まど}を{開|あ}け＿＿か。　〔Mado o ake__ ka.〕　— Để tôi mở cửa sổ nhé?",
            "options": [
              "ません",
              "ましょう",
              "ました",
              "ます"
            ],
            "correct": 1,
            "why": "Để tôi làm giúp nhé? = Vましょう**か** (ポイント 65). → **{窓|まど}を{開|あ}けましょうか。** 〔Mado o akemashou ka.〕 — Để tôi mở cửa sổ nhé?"
          },
          {
            "q": "コップを{洗|あら}い＿＿か。　〔Koppu o arai__ ka.〕　— Để tôi rửa cốc nhé?",
            "options": [
              "ました",
              "ます",
              "ましょう",
              "ません"
            ],
            "correct": 2,
            "why": "Để tôi làm giúp nhé? = Vましょう**か** (ポイント 65). → **コップを{洗|あら}いましょうか。** 〔Koppu o araimashou ka.〕 — Để tôi rửa cốc nhé?"
          },
          {
            "q": "{電話|でんわ}をかけ＿＿か。　〔Denwa o kake__ ka.〕　— Để tôi gọi điện nhé?",
            "options": [
              "ません",
              "ます",
              "ました",
              "ましょう"
            ],
            "correct": 3,
            "why": "Để tôi làm giúp nhé? = Vましょう**か** (ポイント 65). → **{電話|でんわ}をかけましょうか。** 〔Denwa o kakemashou ka.〕 — Để tôi gọi điện nhé?"
          },
          {
            "q": "お{皿|さら}を{出|だ}し＿＿か。　〔Osara o dashi__ ka.〕　— Để tôi lấy đĩa ra nhé?",
            "options": [
              "ましょう",
              "ません",
              "ました",
              "ます"
            ],
            "correct": 0,
            "why": "Để tôi làm giúp nhé? = Vましょう**か** (ポイント 65). → **お{皿|さら}を{出|だ}しましょうか。** 〔Osara o dashimashou ka.〕 — Để tôi lấy đĩa ra nhé?"
          },
          {
            "q": "ドアを{閉|し}め＿＿か。　〔Doa o shime__ ka.〕　— Để tôi đóng cửa nhé?",
            "options": [
              "ました",
              "ましょう",
              "ます",
              "ません"
            ],
            "correct": 1,
            "why": "Để tôi làm giúp nhé? = Vましょう**か** (ポイント 65). → **ドアを{閉|し}めましょうか。** 〔Doa o shimemashou ka.〕 — Để tôi đóng cửa nhé?"
          },
          {
            "q": "{手伝|てつだ}い＿＿か。　〔Tetsudai__ ka.〕　— Để tôi giúp nhé?",
            "options": [
              "ましょう",
              "ました",
              "ません",
              "ます"
            ],
            "correct": 0,
            "why": "Để tôi làm giúp nhé? = Vましょう**か** (ポイント 65). → **{手伝|てつだ}いましょうか。** 〔Tetsudaimashou ka.〕 — Để tôi giúp nhé?"
          },
          {
            "q": "{塩|しお}を{取|と}り＿＿か。　〔Shio o tori__ ka.〕　— Để tôi lấy muối nhé?",
            "options": [
              "ます",
              "ません",
              "ました",
              "ましょう"
            ],
            "correct": 3,
            "why": "Để tôi làm giúp nhé? = Vましょう**か** (ポイント 65). → **{塩|しお}を{取|と}りましょうか。** 〔Shio o torimashou ka.〕 — Để tôi lấy muối nhé?"
          },
          {
            "q": "ビールを{持|も}って{来|き}＿＿か。　〔Biiru o motte ki__ ka.〕　— Để tôi mang bia đến nhé?",
            "options": [
              "ません",
              "ます",
              "ましょう",
              "ました"
            ],
            "correct": 2,
            "why": "Để tôi làm giúp nhé? = Vましょう**か** (ポイント 65). → **ビールを{持|も}って{来|き}ましょうか。** 〔Biiru o motte kimashou ka.〕 — Để tôi mang bia đến nhé?"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn câu nhờ đúng · hỏi–đáp · đọc \"tranh\" · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-nho",
        "title": "Chọn câu nhờ / mời đúng (8 câu)",
        "items": [
          {
            "q": "Bạn muốn nhờ người bên cạnh LẤY GIÚP muối (lịch sự).",
            "options": [
              "すみませんが、{塩|しお}を{取|と}るください。 (Sumimasen ga, shio o toru kudasai.)",
              "すみませんが、{塩|しお}を{取|と}りてください。 (Sumimasen ga, shio o torite kudasai.)",
              "{塩|しお}を{取|と}ります。 (Shio o torimasu.)",
              "すみませんが、{塩|しお}を{取|と}ってください。 (Sumimasen ga, shio o totte kudasai.)"
            ],
            "correct": 3,
            "why": "すみませんが + V て ください."
          },
          {
            "q": "Bạn muốn nhờ ai đó CHO MƯỢN dao.",
            "options": [
              "すみませんが、ナイフを{貸|か}います。 (Sumimasen ga, naifu o kaimasu.)",
              "すみませんが、ナイフを{貸|か}んでください。 (Sumimasen ga, naifu o kande kudasai.)",
              "すみませんが、ナイフを{貸|か}してください。 (Sumimasen ga, naifu o kashite kudasai.)",
              "すみませんが、ナイフを{借|か}りてください。 (Sumimasen ga, naifu o karite kudasai.)"
            ],
            "correct": 2,
            "why": "貸す → 貸して; 借りて là \"mượn\"."
          },
          {
            "q": "Bạn muốn nhờ ai đó CHỈ cho bạn cách đọc chữ này.",
            "options": [
              "この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。 (Kono kanji no yomikata o oshiete kudasai.)",
              "この{漢字|かんじ}の{読|よ}む{方|かた}を{教|おし}えてください。 (Kono kanji no yomukata o oshiete kudasai.)",
              "この{漢字|かんじ}を{読|よ}み{方|かた}を{教|おし}えてください。 (Kono kanji o yomikata o oshiete kudasai.)",
              "この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えますください。 (Kono kanji no yomikata o oshiemasu kudasai.)"
            ],
            "correct": 0,
            "why": "N の + gốc ます + 方; 教えて ください."
          },
          {
            "q": "Bạn muốn nhờ ai đó ĐÓNG cửa sổ.",
            "options": [
              "{窓|まど}を{閉|し}めるください。 (Mado o shimeru kudasai.)",
              "{窓|まど}を{開|あ}けてください。 (Mado o akete kudasai.)",
              "{窓|まど}が{閉|し}めてください。 (Mado ga shimete kudasai.)",
              "{窓|まど}を{閉|し}めてください。 (Mado o shimete kudasai.)"
            ],
            "correct": 3,
            "why": "閉める → 閉めて; 窓 + を."
          },
          {
            "q": "Bạn muốn MỜI bạn bè ăn pizza.",
            "options": [
              "どうぞ、ピザを{食|た}べますください。 (Douzo, piza o tabemasu kudasai.)",
              "どうぞ、ピザを{食|た}べるください。 (Douzo, piza o taberu kudasai.)",
              "どうぞ、ピザを{食|た}べてください。 (Douzo, piza o tabete kudasai.)",
              "どうぞ、ピザが{食|た}べてください。 (Douzo, piza ga tabete kudasai.)"
            ],
            "correct": 2,
            "why": "どうぞ + V て ください = mời."
          },
          {
            "q": "Bạn muốn nhờ ai đó gọi điện cho Yamada.",
            "options": [
              "{山田|やまだ}さんを{電話|でんわ}をかけてください。 (Yamadasan o denwa o kakete kudasai.)",
              "{山田|やまだ}さんに{電話|でんわ}がかけてください。 (Yamadasan ni denwa ga kakete kudasai.)",
              "{山田|やまだ}さんに{電話|でんわ}をかけてください。 (Yamadasan ni denwa o kakete kudasai.)",
              "{山田|やまだ}さんに{電話|でんわ}をかけますください。 (Yamadasan ni denwa o kakemasu kudasai.)"
            ],
            "correct": 2,
            "why": "人に 電話を かけます."
          },
          {
            "q": "Bạn muốn nhờ ai đó cho đường vào cà phê.",
            "options": [
              "コーヒーを{砂糖|さとう}に{入|い}れてください。 (Koohii o satou ni irete kudasai.)",
              "コーヒーに{砂糖|さとう}を{入|い}れてください。 (Koohii ni satou o irete kudasai.)",
              "コーヒーに{砂糖|さとう}を{入|い}れるください。 (Koohii ni satou o ireru kudasai.)",
              "コーヒーに{砂糖|さとう}を{入|はい}ってください。 (Koohii ni satou o haitte kudasai.)"
            ],
            "correct": 1,
            "why": "入れる (cho vào) ≠ 入る (đi vào)."
          },
          {
            "q": "Bạn muốn nhờ ai đó viết tên bằng bút này.",
            "options": [
              "このペンで{名前|なまえ}が{書|か}いてください。 (Kono pen de namae ga kaite kudasai.)",
              "このペンを{名前|なまえ}で{書|か}いてください。 (Kono pen o namae de kaite kudasai.)",
              "このペンで{名前|なまえ}を{書|か}きてください。 (Kono pen de namae o kakite kudasai.)",
              "このペンで{名前|なまえ}を{書|か}いてください。 (Kono pen de namae o kaite kudasai.)"
            ],
            "correct": 3,
            "why": "N（dụng cụ）で N を V."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-dap",
        "title": "Hỏi–đáp với ～ましょうか (6 câu)",
        "items": [
          {
            "q": "ドアを{開|あ}けましょうか。　〔Doa o akemashou ka.〕　(Bạn muốn NHẬN lời giúp.)",
            "options": [
              "ありがとうございます。お{願|ねが}いします。 (Arigatou gozaimasu. Onegai shimasu.)",
              "ええ、{開|あ}けますか。 (Ee, akemasu ka.)",
              "いいえ、{開|あ}けましょう。 (Iie, akemashou.)",
              "はい、{開|あ}けました。 (Hai, akemashita.)"
            ],
            "correct": 0,
            "why": "Nhận: ありがとうございます／お願いします."
          },
          {
            "q": "ドアを{開|あ}けましょうか。　〔Doa o akemashou ka.〕　(Bạn muốn TỪ CHỐI lịch sự.)",
            "options": [
              "はい、お{願|ねが}いします。 (Hai, onegai shimasu.)",
              "ええ、{開|あ}けましょう。 (Ee, akemashou.)",
              "いいえ、{大丈夫|だいじょうぶ}です。ありがとうございます。 (Iie, daijoubu desu. Arigatou gozaimasu.)",
              "いいえ、{開|あ}けました。 (Iie, akemashita.)"
            ],
            "correct": 2,
            "why": "Từ chối: いいえ、大丈夫です (hoặc 結構です)."
          },
          {
            "q": "コップを{洗|あら}いましょうか。　〔Koppu o araimashou ka.〕　(Bạn muốn NHẬN lời giúp.)",
            "options": [
              "はい、{洗|あら}いました。 (Hai, araimashita.)",
              "はい、お{願|ねが}いします。 (Hai, onegai shimasu.)",
              "ええ、{洗|あら}いましょうか。 (Ee, araimashou ka.)",
              "いいえ、{洗|あら}いません。 (Iie, araimasen.)"
            ],
            "correct": 1,
            "why": "Nhận lời giúp."
          },
          {
            "q": "ビールを{持|も}って{来|き}ましょうか。　〔Biiru o motte kimashou ka.〕　(Bạn muốn NHẬN lời giúp.)",
            "options": [
              "ありがとうございます。お{願|ねが}いします。 (Arigatou gozaimasu. Onegai shimasu.)",
              "ええ、{持|も}って{来|き}ましょうか。 (Ee, motte kimashou ka.)",
              "いいえ、{持|も}って{来|き}ます。 (Iie, motte kimasu.)",
              "はい、{持|も}って{来|き}ました。 (Hai, motte kimashita.)"
            ],
            "correct": 0,
            "why": "Nhận lời giúp."
          },
          {
            "q": "{手伝|てつだ}いましょうか。　〔Tetsudaimashou ka.〕　(Bạn muốn TỪ CHỐI lịch sự.)",
            "options": [
              "ええ、{手伝|てつだ}いました。 (Ee, tetsudaimashita.)",
              "いいえ、{手伝|てつだ}います。 (Iie, tetsudaimasu.)",
              "いいえ、{大丈夫|だいじょうぶ}です。ありがとう。 (Iie, daijoubu desu. Arigatou.)",
              "はい、お{願|ねが}いします。 (Hai, onegai shimasu.)"
            ],
            "correct": 2,
            "why": "Từ chối nhẹ: 大丈夫です."
          },
          {
            "q": "{電話|でんわ}をかけましょうか。　〔Denwa o kakemashou ka.〕　(Bạn muốn NHẬN lời giúp.)",
            "options": [
              "ええ、かけましょうか。 (Ee, kakemashou ka.)",
              "ええ、かけました。 (Ee, kakemashita.)",
              "いいえ、かけますか。 (Iie, kakemasu ka.)",
              "ええ、お{願|ねが}いします。 (Ee, onegai shimasu.)"
            ],
            "correct": 3,
            "why": "Nhận lời giúp."
          }
        ]
      },
      {
        "t": "table",
        "head": [
          "Ai",
          "Đang làm gì"
        ],
        "rows": [
          [
            "アンナ",
            "rửa đĩa ở bếp"
          ],
          [
            "パク",
            "cắt thịt bằng dao"
          ],
          [
            "ワン",
            "chơi ghi ta"
          ],
          [
            "リン",
            "gọi điện thoại"
          ],
          [
            "マルコ",
            "hát"
          ],
          [
            "ダニエル",
            "mở cửa sổ"
          ]
        ],
        "caption": "Tranh bữa tiệc chuẩn bị (dùng cho 8 câu dưới đây)"
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-tranh",
        "title": "Nhìn bảng bữa tiệc rồi trả lời (8 câu)",
        "items": [
          {
            "q": "アンナさんは{何|なに}をしていますか。　〔Anna-san wa nani o shite imasu ka.〕",
            "options": [
              "{台所|だいどころ}でお{皿|さら}を{洗|あら}いています。 (Daidokoro de osara o araite imasu.)",
              "{台所|だいどころ}でお{皿|さら}を{洗|あら}います。 (Daidokoro de osara o araimasu.)",
              "{台所|だいどころ}にお{皿|さら}を{洗|あら}っています。 (Daidokoro ni osara o aratte imasu.)",
              "{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。 (Daidokoro de osara o aratte imasu.)"
            ],
            "correct": 3,
            "why": "洗って います; nơi làm hành động → で."
          },
          {
            "q": "パクさんは{何|なに}をしていますか。　〔Paku-san wa nani o shite imasu ka.〕",
            "options": [
              "ナイフで{肉|にく}を{切|き}っています。 (Naifu de niku o kitte imasu.)",
              "ナイフで{肉|にく}が{切|き}っています。 (Naifu de niku ga kitte imasu.)",
              "ナイフで{肉|にく}を{切|き}りています。 (Naifu de niku o kirite imasu.)",
              "ナイフを{肉|にく}で{切|き}っています。 (Naifu o niku de kitte imasu.)"
            ],
            "correct": 0,
            "why": "切って います; ナイフ で (dụng cụ)."
          },
          {
            "q": "だれがギターを{弾|ひ}いていますか。　〔Dare ga gitaa o hiite imasu ka.〕",
            "options": [
              "ワンさんを{弾|ひ}いています。 (Wan-san o hiite imasu.)",
              "ワンさんで{弾|ひ}いています。 (Wan-san de hiite imasu.)",
              "ワンさんは{弾|ひ}いていますか。 (Wan-san wa hiite imasu ka.)",
              "ワンさんが{弾|ひ}いています。 (Wan-san ga hiite imasu.)"
            ],
            "correct": 3,
            "why": "だれが → N が."
          },
          {
            "q": "リンさんは{何|なに}をしていますか。　〔Rin-san wa nani o shite imasu ka.〕",
            "options": [
              "{電話|でんわ}をかけますいます。 (Denwa o kakemasu imasu.)",
              "{電話|でんわ}をかっています。 (Denwa o katte imasu.)",
              "{電話|でんわ}をあります。 (Denwa o arimasu.)",
              "{電話|でんわ}をかけています。 (Denwa o kakete imasu.)"
            ],
            "correct": 3,
            "why": "かけて います."
          },
          {
            "q": "マルコさんは{何|なに}をしていますか。　〔Maruko-san wa nani o shite imasu ka.〕",
            "options": [
              "{歌|うた}を{歌|うた}いています。 (Uta o utaite imasu.)",
              "{歌|うた}を{歌|うた}んでいます。 (Uta o utande imasu.)",
              "{歌|うた}を{歌|うた}いますいます。 (Uta o utaimasu imasu.)",
              "{歌|うた}を{歌|うた}っています。 (Uta o utatte imasu.)"
            ],
            "correct": 3,
            "why": "歌って います."
          },
          {
            "q": "ダニエルさんは{何|なに}をしていますか。　〔Danieru-san wa nani o shite imasu ka.〕",
            "options": [
              "{窓|まど}を{開|あ}けています。 (Mado o akete imasu.)",
              "{窓|まど}に{開|あ}けています。 (Mado ni akete imasu.)",
              "{窓|まど}を{開|あ}けてください。 (Mado o akete kudasai.)",
              "{窓|まど}を{閉|し}めています。 (Mado o shimete imasu.)"
            ],
            "correct": 0,
            "why": "開けて います."
          },
          {
            "q": "だれが{電話|でんわ}をかけていますか。　〔Dare ga denwa o kakete imasu ka.〕",
            "options": [
              "リンさんをかけています。 (Rin-san o kakete imasu.)",
              "リンさんがかけてください。 (Rin-san ga kakete kudasai.)",
              "リンさんがかけています。 (Rin-san ga kakete imasu.)",
              "リンさんはかけていますか。 (Rin-san wa kakete imasu ka.)"
            ],
            "correct": 2,
            "why": "だれが → N が."
          },
          {
            "q": "だれが{窓|まど}を{開|あ}けていますか。　〔Dare ga mado o akete imasu ka.〕",
            "options": [
              "ダニエルさんが{開|あ}けています。 (Danieru-san ga akete imasu.)",
              "ダニエルさんを{開|あ}けています。 (Danieru-san o akete imasu.)",
              "ダニエルさんが{開|あ}けてください。 (Danieru-san ga akete kudasai.)",
              "ダニエルさんは{開|あ}けていますか。 (Danieru-san wa akete imasu ka.)"
            ],
            "correct": 0,
            "why": "だれが → N が."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-sai",
        "title": "Tìm câu SAI (7 câu)",
        "items": [
          {
            "q": "(てください)　Câu nào SAI?",
            "options": [
              "{窓|まど}を{開|あ}けてください。 (Mado o akete kudasai.)",
              "{塩|しお}を{取|と}りてください。 (Shio o torite kudasai.)",
              "{塩|しお}を{取|と}ってください。 (Shio o totte kudasai.)",
              "ギターを{弾|ひ}いてください。 (Gitaa o hiite kudasai.)"
            ],
            "correct": 1,
            "why": "取る → 取って (nhóm 1: り → って)."
          },
          {
            "q": "(ています)　Câu nào SAI?",
            "options": [
              "{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。 (Daidokoro de osara o aratte imasu.)",
              "{台所|だいどころ}にお{皿|さら}を{洗|あら}っています。 (Daidokoro ni osara o aratte imasu.)",
              "{台所|だいどころ}にいます。 (Daidokoro ni imasu.)",
              "{台所|だいどころ}で{料理|りょうり}をしています。 (Daidokoro de ryouri o shite imasu.)"
            ],
            "correct": 1,
            "why": "Nơi làm hành động → で (台所で洗っています); に chỉ nơi tồn tại."
          },
          {
            "q": "(ましょうか)　Câu nào SAI?",
            "options": [
              "{窓|まど}を{開|あ}けましょうか。 (Mado o akemashou ka.)",
              "{窓|まど}を{開|あ}けましょう。か。 (Mado o akemashou. Ka.)",
              "{手伝|てつだ}いましょうか。 (Tetsudaimashou ka.)",
              "{電話|でんわ}をかけましょうか。 (Denwa o kakemashou ka.)"
            ],
            "correct": 1,
            "why": "Dấu 。 chen giữa ましょう và か; viết liền ましょうか."
          },
          {
            "q": "(thể て)　Câu nào SAI?",
            "options": [
              "{飲|の}いています。 (Noite imasu.)",
              "{飲|の}んでいます。 (Nonde imasu.)",
              "{書|か}いています。 (Kaite imasu.)",
              "{読|よ}んでいます。 (Yonde imasu.)"
            ],
            "correct": 0,
            "why": "飲む → 飲んで (み → んで)."
          },
          {
            "q": "(trợ từ)　Câu nào SAI?",
            "options": [
              "{山田|やまだ}さんに{電話|でんわ}をかけてください。 (Yamadasan ni denwa o kakete kudasai.)",
              "{電話|でんわ}をかけてください。 (Denwa o kakete kudasai.)",
              "{友達|ともだち}に{電話|でんわ}をかけてください。 (Tomodachi ni denwa o kakete kudasai.)",
              "{友達|ともだち}を{電話|でんわ}をかけてください。 (Tomodachi o denwa o kakete kudasai.)"
            ],
            "correct": 3,
            "why": "Gọi cho ai → 人 に."
          },
          {
            "q": "(います／ください)　Câu nào SAI?",
            "options": [
              "どうぞ、{食|た}べてください。 (Douzo, tabete kudasai.)",
              "{今|いま}、{食|た}べています。 (Ima, tabete imasu.)",
              "{食|た}べましょうか。 (Tabemashou ka.)",
              "どうぞ、{食|た}べています。 (Douzo, tabete imasu.)"
            ],
            "correct": 3,
            "why": "Mời → どうぞ、食べて ください; 食べて います = đang ăn."
          },
          {
            "q": "(ngoại lệ)　Câu nào SAI?",
            "options": [
              "ここへ{行|い}いてください。 (Koko e iite kudasai.)",
              "ここへ{来|き}てください。 (Koko e kite kudasai.)",
              "いっしょに{行|い}ってください。 (Isshoni itte kudasai.)",
              "{先|さき}に{行|い}ってください。 (Saki ni itte kudasai.)"
            ],
            "correct": 0,
            "why": "行く → 行って (ngoại lệ)."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-np2-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 63–65",
        "items": [
          {
            "q": "Hãy mở cửa sổ.",
            "answers": [
              "窓を開けてください。",
              "窓をあけてください。",
              "まどを開けてください。",
              "まどをあけてください。"
            ],
            "hint": "V て ください"
          },
          {
            "q": "Xin lỗi, hãy lấy giúp tôi muối.",
            "answers": [
              "すみませんが、塩を取ってください。",
              "すみませんが、塩をとってください。",
              "すみませんが、しおを取ってください。",
              "すみませんが、しおをとってください。",
              "すみません、塩を取ってください。",
              "すみません、塩をとってください。",
              "すみません、しおを取ってください。",
              "すみません、しおをとってください。"
            ],
            "hint": "すみませんが · 取って"
          },
          {
            "q": "Hãy viết tên vào đây.",
            "answers": [
              "ここに名前を書いてください。",
              "ここに名前をかいてください。",
              "ここになまえを書いてください。",
              "ここになまえをかいてください。"
            ],
            "hint": "書いて ください"
          },
          {
            "q": "Park đang cắt thịt.",
            "answers": [
              "パクさんは肉を切っています。",
              "パクさんは肉をきっています。",
              "パクさんはにくを切っています。",
              "パクさんはにくをきっています。"
            ],
            "hint": "切って います"
          },
          {
            "q": "Tôi đang uống cà phê.",
            "answers": [
              "コーヒーを飲んでいます。",
              "コーヒーをのんでいます。",
              "私はコーヒーを飲んでいます。",
              "私はコーヒーをのんでいます。",
              "わたしはコーヒーを飲んでいます。",
              "わたしはコーヒーをのんでいます。"
            ],
            "hint": "飲んで います"
          },
          {
            "q": "Để tôi giúp nhé?",
            "answers": [
              "手伝いましょうか。",
              "てつだいましょうか。"
            ],
            "hint": "Vましょうか"
          },
          {
            "q": "Để tôi gọi điện nhé?",
            "answers": [
              "電話をかけましょうか。",
              "でんわをかけましょうか。"
            ],
            "hint": "かけましょうか"
          },
          {
            "q": "Hãy đợi ở đây.",
            "answers": [
              "ここで待ってください。",
              "ここでまってください。"
            ],
            "hint": "待って ください"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-np2-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Hãy lấy giúp tôi cái đĩa.",
            "chips": [
              "{取|と}って",
              "お{皿|さら}を",
              "{取|と}りて",
              "ください"
            ],
            "answer": [
              "お{皿|さら}を",
              "{取|と}って",
              "ください"
            ],
            "ro": "Osara o totte kudasai."
          },
          {
            "vi": "Wang đang chơi ghi ta.",
            "chips": [
              "ギターを",
              "います",
              "ワンさんは",
              "{弾|ひ}いて",
              "{弾|ひ}きて"
            ],
            "answer": [
              "ワンさんは",
              "ギターを",
              "{弾|ひ}いて",
              "います"
            ],
            "ro": "Wan-san wa gitaa o hiite imasu."
          },
          {
            "vi": "Để tôi rửa đĩa nhé?",
            "chips": [
              "{洗|あら}って",
              "お{皿|さら}を",
              "{洗|あら}いましょうか"
            ],
            "answer": [
              "お{皿|さら}を",
              "{洗|あら}いましょうか"
            ],
            "ro": "Osara o araimashou ka?"
          },
          {
            "vi": "Anna đang rửa đĩa ở bếp.",
            "chips": [
              "{洗|あら}っています",
              "に",
              "{台所|だいどころ}で",
              "お{皿|さら}を",
              "アンナさんは"
            ],
            "answer": [
              "アンナさんは",
              "{台所|だいどころ}で",
              "お{皿|さら}を",
              "{洗|あら}っています"
            ],
            "ro": "Anna-san wa daidokoro de osara o aratte imasu."
          },
          {
            "vi": "Xin lỗi, hãy cho tôi mượn cái thìa.",
            "chips": [
              "すみませんが",
              "ください",
              "{貸|か}して",
              "{借|か}りて",
              "スプーンを"
            ],
            "answer": [
              "すみませんが",
              "スプーンを",
              "{貸|か}して",
              "ください"
            ],
            "ro": "Sumimasen ga supuun o kashite kudasai."
          },
          {
            "vi": "Bây giờ tôi đang gọi điện thoại.",
            "chips": [
              "かけます",
              "かけています",
              "{電話|でんわ}を",
              "{今|いま}"
            ],
            "answer": [
              "{今|いま}",
              "{電話|でんわ}を",
              "かけています"
            ],
            "ro": "Ima denwa o kakete imasu."
          },
          {
            "vi": "Hãy ăn pizza đi.",
            "chips": [
              "ピザを",
              "{食|た}べて",
              "ください",
              "{食|た}べます",
              "どうぞ"
            ],
            "answer": [
              "どうぞ",
              "ピザを",
              "{食|た}べて",
              "ください"
            ],
            "ro": "Douzo piza o tabete kudasai."
          },
          {
            "vi": "Để tôi mang bia đến nhé?",
            "chips": [
              "ビールを",
              "{持|も}って{来|き}ましょうか",
              "{持|も}って{行|い}きましょうか"
            ],
            "answer": [
              "ビールを",
              "{持|も}って{来|き}ましょうか"
            ],
            "ro": "Biiru o motte kimashou ka?"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-nhat-viet",
        "title": "Nhật → Việt (6 câu)",
        "items": [
          {
            "q": "Nghĩa của câu: すみませんが、{窓|まど}を{開|あ}けてください。　〔Sumimasen ga, mado o akete kudasai.〕",
            "options": [
              "Để tôi mở cửa sổ nhé?",
              "Cửa sổ đã được mở.",
              "Xin lỗi, tôi đang mở cửa sổ.",
              "Xin lỗi, hãy mở cửa sổ giúp tôi."
            ],
            "correct": 3,
            "why": "V て ください."
          },
          {
            "q": "Nghĩa của câu: {台所|だいどころ}で{山田|やまだ}さんが{料理|りょうり}を{作|つく}っています。　〔Daidokoro de yamadasan ga ryouri o tsukutte imasu.〕",
            "options": [
              "Ở bếp anh Yamada đang nấu ăn.",
              "Anh Yamada nấu ăn xong rồi.",
              "Anh Yamada ở trong bếp.",
              "Ở bếp anh Yamada sẽ nấu ăn."
            ],
            "correct": 0,
            "why": "作って います = đang nấu."
          },
          {
            "q": "Nghĩa của câu: {手伝|てつだ}いましょうか。　〔Tetsudaimashou ka.〕",
            "options": [
              "Tôi đã giúp rồi.",
              "Hãy giúp tôi.",
              "Để tôi giúp nhé?",
              "Bạn đang giúp à?"
            ],
            "correct": 2,
            "why": "Vましょうか."
          },
          {
            "q": "Nghĩa của câu: どうぞ、{食|た}べてください。　〔Douzo, tabete kudasai.〕",
            "options": [
              "Mời bạn ăn.",
              "Để tôi ăn nhé?",
              "Tôi đang ăn.",
              "Bạn đã ăn rồi."
            ],
            "correct": 0,
            "why": "どうぞ + V て ください = mời."
          },
          {
            "q": "Nghĩa của câu: {友達|ともだち}に{電話|でんわ}をかけています。　〔Tomodachi ni denwa o kakete imasu.〕",
            "options": [
              "Tôi đã gọi điện cho bạn.",
              "Để tôi gọi điện cho bạn nhé?",
              "Tôi đang gọi điện cho bạn.",
              "Hãy gọi điện cho bạn."
            ],
            "correct": 2,
            "why": "かけて います = đang gọi."
          },
          {
            "q": "Nghĩa của câu: ここで{待|ま}ってください。　〔Koko de matte kudasai.〕",
            "options": [
              "Để tôi đợi ở đây nhé?",
              "Hãy đợi ở đây.",
              "Tôi đang đợi ở đây.",
              "Đừng đợi ở đây."
            ],
            "correct": 1,
            "why": "待って ください."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch Việt → Nhật · nhiều ô trống · tình huống bữa tiệc"
      },
      {
        "t": "quiz",
        "id": "lt-b7-np2-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 61–71",
        "items": [
          {
            "q": "Xin lỗi, hãy cho tôi mượn cái dao. — Được thôi. Đây ạ.",
            "answers": [
              "すみませんが、ナイフを貸してください。いいですよ。どうぞ。",
              "すみませんが、ナイフをかしてください。いいですよ。どうぞ。"
            ],
            "hint": "すみませんが · いいですよ"
          },
          {
            "q": "Park đang cắt thịt bằng dao ở bếp.",
            "answers": [
              "パクさんは台所でナイフで肉を切っています。",
              "パクさんは台所でナイフで肉をきっています。",
              "パクさんは台所でナイフでにくを切っています。",
              "パクさんは台所でナイフでにくをきっています。",
              "パクさんはだいどころでナイフで肉を切っています。",
              "パクさんはだいどころでナイフで肉をきっています。",
              "パクさんはだいどころでナイフでにくを切っています。",
              "パクさんはだいどころでナイフでにくをきっています。"
            ],
            "hint": "N で … N で … V て います"
          },
          {
            "q": "Ai đang chơi ghi ta? — Wang đang chơi.",
            "answers": [
              "だれがギターを弾いていますか。ワンさんが弾いています。",
              "だれがギターを弾いていますか。ワンさんがひいています。",
              "だれがギターをひいていますか。ワンさんが弾いています。",
              "だれがギターをひいていますか。ワンさんがひいています。",
              "誰がギターを弾いていますか。ワンさんが弾いています。",
              "誰がギターを弾いていますか。ワンさんがひいています。",
              "誰がギターをひいていますか。ワンさんが弾いています。",
              "誰がギターをひいていますか。ワンさんがひいています。"
            ],
            "hint": "だれが · N が"
          },
          {
            "q": "Để tôi mở cửa sổ nhé? — Cảm ơn, nhờ bạn.",
            "answers": [
              "窓を開けましょうか。ありがとうございます。お願いします。",
              "窓を開けましょうか。ありがとうございます。おねがいします。",
              "窓をあけましょうか。ありがとうございます。お願いします。",
              "窓をあけましょうか。ありがとうございます。おねがいします。",
              "まどを開けましょうか。ありがとうございます。お願いします。",
              "まどを開けましょうか。ありがとうございます。おねがいします。",
              "まどをあけましょうか。ありがとうございます。お願いします。",
              "まどをあけましょうか。ありがとうございます。おねがいします。"
            ],
            "hint": "Vましょうか · お願いします"
          },
          {
            "q": "Xin lỗi, hãy chỉ cho tôi cách dùng cái này.",
            "answers": [
              "すみませんが、これの使い方を教えてください。",
              "すみませんが、これの使い方をおしえてください。",
              "すみませんが、これの使いかたを教えてください。",
              "すみませんが、これの使いかたをおしえてください。",
              "すみませんが、これのつかい方を教えてください。",
              "すみませんが、これのつかい方をおしえてください。",
              "すみませんが、これのつかいかたを教えてください。",
              "すみませんが、これのつかいかたをおしえてください。"
            ],
            "hint": "V方 · 教えて ください"
          },
          {
            "q": "Tôi đang viết thư ở trong phòng.",
            "answers": [
              "へやで手紙を書いています。",
              "へやで手紙をかいています。",
              "へやでてがみを書いています。",
              "へやでてがみをかいています。",
              "部屋で手紙を書いています。",
              "部屋で手紙をかいています。",
              "部屋でてがみを書いています。",
              "部屋でてがみをかいています。"
            ],
            "hint": "N で N を V て います"
          },
          {
            "q": "Hãy cho muối vào cái đĩa này.",
            "answers": [
              "このお皿に塩を入れてください。",
              "このお皿に塩をいれてください。",
              "このお皿にしおを入れてください。",
              "このお皿にしおをいれてください。",
              "このおさらに塩を入れてください。",
              "このおさらに塩をいれてください。",
              "このおさらにしおを入れてください。",
              "このおさらにしおをいれてください。"
            ],
            "hint": "N に N を V て ください"
          },
          {
            "q": "Bây giờ Rin không gọi điện thoại. Rin đang hát.",
            "answers": [
              "今、リンさんは電話をかけていません。リンさんは歌っています。",
              "今、リンさんは電話をかけていません。リンさんはうたっています。",
              "今、リンさんはでんわをかけていません。リンさんは歌っています。",
              "今、リンさんはでんわをかけていません。リンさんはうたっています。",
              "いま、リンさんは電話をかけていません。リンさんは歌っています。",
              "いま、リンさんは電話をかけていません。リンさんはうたっています。",
              "いま、リンさんはでんわをかけていません。リンさんは歌っています。",
              "いま、リンさんはでんわをかけていません。リンさんはうたっています。"
            ],
            "hint": "V て いません · V て います"
          },
          {
            "q": "Để tôi lấy bia ra nhé?",
            "answers": [
              "ビールを出しましょうか。",
              "ビールをだしましょうか。"
            ],
            "hint": "Vましょうか"
          },
          {
            "q": "Hãy gọi điện cho Yamada đi, rồi hãy đóng cửa sổ.",
            "answers": [
              "山田さんに電話をかけてください。そして、窓を閉めてください。",
              "山田さんに電話をかけてください。そして、窓をしめてください。",
              "山田さんに電話をかけてください。そして、まどを閉めてください。",
              "山田さんに電話をかけてください。そして、まどをしめてください。",
              "山田さんにでんわをかけてください。そして、窓を閉めてください。",
              "山田さんにでんわをかけてください。そして、窓をしめてください。",
              "山田さんにでんわをかけてください。そして、まどを閉めてください。",
              "山田さんにでんわをかけてください。そして、まどをしめてください。",
              "やまださんに電話をかけてください。そして、窓を閉めてください。",
              "やまださんに電話をかけてください。そして、窓をしめてください。",
              "やまださんに電話をかけてください。そして、まどを閉めてください。",
              "やまださんに電話をかけてください。そして、まどをしめてください。",
              "やまださんにでんわをかけてください。そして、窓を閉めてください。",
              "やまださんにでんわをかけてください。そして、窓をしめてください。",
              "やまださんにでんわをかけてください。そして、まどを閉めてください。",
              "やまださんにでんわをかけてください。そして、まどをしめてください。"
            ],
            "hint": "V て ください · そして"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "すみません（①）、{塩|しお}（②）{取|と}ってください。　〔Sumimasen((1)), shio((2)) totte kudasai.〕　— Xin lỗi, hãy lấy giúp tôi muối. (すみませんが = mở đầu lời nhờ)",
            "options": [
              "① は　② を",
              "① が　② を",
              "① を　② を",
              "① が　② が"
            ],
            "correct": 1,
            "why": "すみません**が**、 N **を** 取って ください. → **すみませんが、{塩|しお}を{取|と}ってください。** 〔Sumimasen ga, shio o totte kudasai.〕 — Xin lỗi, hãy lấy giúp tôi muối. (すみませんが = mở đầu lời nhờ)"
          },
          {
            "q": "A：{何|なに}（①）していますか。B：{台所|だいどころ}（②）お{皿|さら}（③）{洗|あら}っています。　〔A:nani((1)) shite imasu ka. B:daidokoro((2)) osara((3)) aratte imasu.〕　— A: Bạn đang làm gì? B: Tôi đang rửa đĩa ở bếp.",
            "options": [
              "① を　② に　③ を",
              "① が　② で　③ を",
              "① を　② で　③ が",
              "① を　② で　③ を"
            ],
            "correct": 3,
            "why": "何を して います · N で N を V て います. → **A：{何|なに}をしていますか。B：{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。** 〔A:nani o shite imasu ka. B:daidokoro de osara o aratte imasu.〕 — A: Bạn đang làm gì? B: Tôi đang rửa đĩa ở bếp."
          },
          {
            "q": "A：{塩|しお}（①）{取|と}り（②）か。B：ありがとう。お{願|ねが}いします。　〔A:shio((1)) tori((2)) ka. B:arigatou. Onegai shimasu.〕　— A: Để tôi lấy muối nhé? B: Cảm ơn, nhờ bạn.",
            "options": [
              "① を　② ました",
              "① を　② ます",
              "① を　② ましょう",
              "① が　② ましょう"
            ],
            "correct": 2,
            "why": "N を V ましょうか. → **A：{塩|しお}を{取|と}りましょうか。B：ありがとう。お{願|ねが}いします。** 〔A:shio o torimashou ka. B:arigatou. Onegai shimasu.〕 — A: Để tôi lấy muối nhé? B: Cảm ơn, nhờ bạn."
          },
          {
            "q": "A：だれ（①）ピザ（②）{作|つく}っていますか。B：パクさん（③）{作|つく}っています。　〔A:dare((1)) piza((2)) tsukutte imasu ka. B:pakusan((3)) tsukutte imasu.〕　— A: Ai đang làm pizza? B: Park đang làm.",
            "options": [
              "① が　② が　③ が",
              "① は　② を　③ が",
              "① が　② を　③ が",
              "① が　② を　③ は"
            ],
            "correct": 2,
            "why": "だれが … を … ています · N が. → **A：だれがピザを{作|つく}っていますか。B：パクさんが{作|つく}っています。** 〔A:dare ga piza o tsukutte imasu ka. B:pakusan ga tsukutte imasu.〕 — A: Ai đang làm pizza? B: Park đang làm."
          },
          {
            "q": "ここ（①）{名前|なまえ}（②）{書|か}いてください。このペン（③）{書|か}いてください。　〔Koko((1)) namae((2)) kaite kudasai. Kono pen((3)) kaite kudasai.〕　— Hãy viết tên vào đây. Hãy viết bằng cây bút này.",
            "options": [
              "① で　② を　③ で",
              "① に　② を　③ を",
              "① に　② を　③ で",
              "① に　② が　③ で"
            ],
            "correct": 2,
            "why": "N に N を V · N で V. → **ここに{名前|なまえ}を{書|か}いてください。このペンで{書|か}いてください。** 〔Koko ni namae o kaite kudasai. Kono pen de kaite kudasai.〕 — Hãy viết tên vào đây. Hãy viết bằng cây bút này."
          },
          {
            "q": "{私|わたし}（①）{今|いま}、{手紙|てがみ}（②）{書|か}いて（③）。{手伝|てつだ}い（④）か。　〔Watashi((1)) ima, tegami((2)) kaite ((3)). Tetsudai((4)) ka.〕　— Bây giờ tôi đang viết thư. Để tôi giúp nhé?",
            "options": [
              "① は　② に　③ います　④ ましょう",
              "① は　② を　③ あります　④ ました",
              "① が　② を　③ います　④ ましょう",
              "① は　② を　③ います　④ ましょう"
            ],
            "correct": 3,
            "why": "V て います · Vましょうか. → **{私|わたし}は{今|いま}、{手紙|てがみ}を{書|か}いています。{手伝|てつだ}いましょうか。** 〔Watashi wa ima, tegami o kaite imasu. Tetsudaimashou ka.〕 — Bây giờ tôi đang viết thư. Để tôi giúp nhé?"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np2-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Bữa tiệc: Anna cần muối. Anna nói gì với Park?",
            "options": [
              "すみませんが、{塩|しお}は{取|と}ってください。 (Sumimasen ga, shio wa totte kudasai.)",
              "すみませんが、{塩|しお}を{取|と}ってください。 (Sumimasen ga, shio o totte kudasai.)",
              "すみませんが、{塩|しお}を{取|と}っています。 (Sumimasen ga, shio o totte imasu.)",
              "すみませんが、{塩|しお}を{取|と}りましょうか。 (Sumimasen ga, shio o torimashou ka.)"
            ],
            "correct": 1,
            "why": "Nhờ → V て ください."
          },
          {
            "q": "Bữa tiệc: Rin thấy Marco đang bê nhiều đồ nặng, Rin muốn giúp. Rin nói gì?",
            "options": [
              "{手伝|てつだ}っています。 (Tetsudatte imasu.)",
              "{手伝|てつだ}ってください。 (Tetsudatte kudasai.)",
              "{手伝|てつだ}いますか。 (Tetsudaimasu ka.)",
              "{手伝|てつだ}いましょうか。 (Tetsudaimashou ka.)"
            ],
            "correct": 3,
            "why": "Chủ động giúp → Vましょうか."
          },
          {
            "q": "Ai đó gọi điện hỏi: {今|いま}、{何|なに}をしていますか。　〔Ima, nani o shite imasu ka.〕 Bạn đang cắt rau. Bạn trả lời?",
            "options": [
              "{野菜|やさい}を{切|き}りましょうか。 (Yasai o kirimashou ka.)",
              "{野菜|やさい}が{切|き}っています。 (Yasai ga kitte imasu.)",
              "{野菜|やさい}を{切|き}ってください。 (Yasai o kitte kudasai.)",
              "{野菜|やさい}を{切|き}っています。 (Yasai o kitte imasu.)"
            ],
            "correct": 3,
            "why": "Đang làm → V て います."
          },
          {
            "q": "Ở nhà bạn, bạn muốn mời khách ngồi xuống ăn pizza. Bạn nói?",
            "options": [
              "ピザを{食|た}べています。 (Piza o tabete imasu.)",
              "どうぞ、ピザを{食|た}べてください。 (Douzo, piza o tabete kudasai.)",
              "ピザを{食|た}べましょうか。 (Piza o tabemashou ka.)",
              "どうぞ、ピザを{食|た}べます。 (Douzo, piza o tabemasu.)"
            ],
            "correct": 1,
            "why": "Mời → どうぞ、V て ください."
          },
          {
            "q": "Bạn nhờ bạn cùng phòng đóng cửa sổ vì lạnh. Bạn nói?",
            "options": [
              "{窓|まど}を{閉|し}めてください。 (Mado o shimete kudasai.)",
              "{窓|まど}を{閉|し}めています。 (Mado o shimete imasu.)",
              "{窓|まど}を{閉|し}めましょうか。 (Mado o shimemashou ka.)",
              "{窓|まど}が{閉|し}めてください。 (Mado ga shimete kudasai.)"
            ],
            "correct": 0,
            "why": "Nhờ → 閉めて ください."
          },
          {
            "q": "Bạn thấy bạn đang gọi điện nhưng chưa xong; có người hỏi ai đang gọi. Bạn nói?",
            "options": [
              "{私|わたし}が{電話|でんわ}をかけています。 (Watashi ga denwa o kakete imasu.)",
              "{私|わたし}を{電話|でんわ}がかけています。 (Watashi o denwa ga kakete imasu.)",
              "{私|わたし}が{電話|でんわ}をかけましょうか。 (Watashi ga denwa o kakemashou ka.)",
              "{私|わたし}は{電話|でんわ}をかけてください。 (Watashi wa denwa o kakete kudasai.)"
            ],
            "correct": 0,
            "why": "だれが → N が … ています."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**すみませんが** đứng đầu khi nhờ người xa lạ/người trên; **お願いします** là câu nhận lời giúp an toàn nhất.",
          "Khi thi nói bị hỏi **「何をしていますか」** (nhìn tranh): nói **N を V て います** + nơi **で**."
        ]
      }
    ]
  },
  {
    "id": "lt-b7-np-3",
    "kind": "homework",
    "title": "Luyện thêm Bài 7 · Ngữ pháp 3 (ポイント 66, 67, 71) + TRỘN cả 11 điểm — cách làm · còn/hết · dụng cụ (~115 câu)",
    "goal": "Dùng thành thạo N の V方 (cách làm), まだ／もう (còn / hết), N で V (làm bằng dụng cụ) và trộn đủ ポイント 61–71 cùng thể て như đề kiểm tra.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**V方**: bỏ ます rồi thêm 方 (読み方, 作り方, 使い方); tân ngữ đổi を → **の** (カレーの作り方). Hỏi ngược lại: 〜がわかりません (biết/không biết) và 〜を教えてください.",
          "**まだ／もう** ở Bài 7: *vẫn còn* = まだ + khẳng định; *hết rồi/không còn nữa* = もう + phủ định. Đừng nhầm với もう Vましたか (Bài 6, \"đã … chưa\").",
          "**で** có 4 nghĩa: nơi làm hành động · phương tiện · nơi diễn ra sự kiện/phạm vi · **dụng cụ/ngôn ngữ**. Nơi TỒN TẠI luôn là **に**. Mức Khó trộn cả 11 điểm — làm bấm giờ."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**（N の）V(bỏ ます) 方** — cách V: 使い方, 読み方, 作り方. Sai hay gặp: ×カレーを作り方 → ○カレーの作り方.",
          "**N は まだ ありますか → はい、まだ あります／いいえ、もう ありません** (còn / hết). **もう ～ません** = không còn ～ nữa.",
          "**N（dụng cụ）で N を V** — はしで食べます · 日本語で話します · 何で食べますか。",
          "**誰が** · **どの N／どれ** · **V て ください／います／ましょうか** (xem hai bài trước)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · điền một chỗ trống · có nghĩa Việt kèm"
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-66",
        "title": "ポイント 66: V方 (5 câu)",
        "items": [
          {
            "q": "カレー＿＿{作|つく}り{方|かた}を{教|おし}えてください。　〔Karee__ tsukurikata o oshiete kudasai.〕　— Hãy chỉ cho tôi cách nấu cà ri.",
            "options": [
              "の",
              "に",
              "を",
              "が"
            ],
            "correct": 0,
            "why": "N を V → N **の** V方 (ポイント 66). → **カレーの{作|つく}り{方|かた}を{教|おし}えてください。** 〔Karee no tsukurikata o oshiete kudasai.〕 — Hãy chỉ cho tôi cách nấu cà ri."
          },
          {
            "q": "この{漢字|かんじ}の{読|よ}み＿＿がわかりません。　〔Kono kanji no yomi__ ga wakarimasen.〕　— Tôi không biết cách đọc chữ Hán này.",
            "options": [
              "{前|まえ}",
              "{人|ひと}",
              "{方|かた}",
              "{中|なか}"
            ],
            "correct": 2,
            "why": "V(bỏ ます) + **方** = cách V. → **この{漢字|かんじ}の{読|よ}み{方|かた}がわかりません。** 〔Kono kanji no yomikata ga wakarimasen.〕 — Tôi không biết cách đọc chữ Hán này."
          },
          {
            "q": "{電話|でんわ}のかけ＿＿を{教|おし}えてください。　〔Denwa no kake__ o oshiete kudasai.〕　— Hãy chỉ cho tôi cách gọi điện thoại.",
            "options": [
              "{人|ひと}",
              "{前|まえ}",
              "{中|なか}",
              "{方|かた}"
            ],
            "correct": 3,
            "why": "かけ方. → **{電話|でんわ}のかけ{方|かた}を{教|おし}えてください。** 〔Denwa no kakekata o oshiete kudasai.〕 — Hãy chỉ cho tôi cách gọi điện thoại."
          },
          {
            "q": "はしの{使|つか}い＿＿を{教|おし}えてください。　〔Hashi no tsukai__ o oshiete kudasai.〕　— Hãy chỉ cho tôi cách dùng đũa.",
            "options": [
              "{方|かた}",
              "{前|まえ}",
              "{中|なか}",
              "{人|ひと}"
            ],
            "correct": 0,
            "why": "使い方. → **はしの{使|つか}い{方|かた}を{教|おし}えてください。** 〔Hashi no tsukaikata o oshiete kudasai.〕 — Hãy chỉ cho tôi cách dùng đũa."
          },
          {
            "q": "このペンの{使|つか}い＿＿を{教|おし}えてください。　〔Kono pen no tsukai__ o oshiete kudasai.〕　— Hãy chỉ cho tôi cách dùng cây bút này.",
            "options": [
              "{方|かた}",
              "{前|まえ}",
              "{人|ひと}",
              "{中|なか}"
            ],
            "correct": 0,
            "why": "使い方. → **このペンの{使|つか}い{方|かた}を{教|おし}えてください。** 〔Kono pen no tsukaikata o oshiete kudasai.〕 — Hãy chỉ cho tôi cách dùng cây bút này."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-66b",
        "title": "ポイント 66: わかります／教えます đi với が／を (3 câu)",
        "items": [
          {
            "q": "A：このナイフの{使|つか}い{方|かた}がわかり＿＿。B：{教|おし}えましょうか。　〔A:kono naifu no tsukaikata ga wakari__. B:oshiemashou ka.〕　— A: Tôi không biết cách dùng con dao này. B: Để tôi chỉ nhé?",
            "options": [
              "ません",
              "ました",
              "ます",
              "ましょう"
            ],
            "correct": 0,
            "why": "わかりません. → **A：このナイフの{使|つか}い{方|かた}がわかりません。B：{教|おし}えましょうか。** 〔A:kono naifu no tsukaikata ga wakarimasen. B:oshiemashou ka.〕 — A: Tôi không biết cách dùng con dao này. B: Để tôi chỉ nhé?"
          },
          {
            "q": "{漢字|かんじ}の{書|か}き{方|かた}＿＿わかりません。　〔Kanji no kakikata__ wakarimasen.〕　— Tôi không biết cách viết chữ Hán.",
            "options": [
              "に",
              "を",
              "が",
              "で"
            ],
            "correct": 2,
            "why": "わかります đi với **が**. → **{漢字|かんじ}の{書|か}き{方|かた}がわかりません。** 〔Kanji no kakikata ga wakarimasen.〕 — Tôi không biết cách viết chữ Hán."
          },
          {
            "q": "カレーの{作|つく}り{方|かた}＿＿{教|おし}えてください。　〔Karee no tsukurikata__ oshiete kudasai.〕　— Hãy chỉ cho tôi cách nấu cà ri.",
            "options": [
              "に",
              "で",
              "が",
              "を"
            ],
            "correct": 3,
            "why": "教えます đi với **を**. → **カレーの{作|つく}り{方|かた}を{教|おし}えてください。** 〔Karee no tsukurikata o oshiete kudasai.〕 — Hãy chỉ cho tôi cách nấu cà ri."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-66c",
        "title": "Biến động từ thành \"cách …\" (14 câu)",
        "items": [
          {
            "q": "Dạng \"cách viết\" của 「書きます」 là gì?",
            "options": [
              "{書|か}いて{方|かた} (Kaitekata)",
              "{書|か}きます{方|かた} (Kakimasukata)",
              "{書|か}く{方|かた} (Kakukata)",
              "{書|か}き{方|かた} (Kakikata)"
            ],
            "correct": 3,
            "why": "Bỏ ます + **方**: {書|か}き方 (Kakikata)."
          },
          {
            "q": "Dạng \"cách ăn\" của 「食べます」 là gì?",
            "options": [
              "{食|た}べる{方|かた} (Taberukata)",
              "{食|た}べて{方|かた} (Tabetekata)",
              "{食|た}べます{方|かた} (Tabemasukata)",
              "{食|た}べ{方|かた} (Tabekata)"
            ],
            "correct": 3,
            "why": "Bỏ ます + **方**: {食|た}べ方 (Tabekata)."
          },
          {
            "q": "Dạng \"cách dùng\" của 「使います」 là gì?",
            "options": [
              "{使|つか}って{方|かた} (Tsukattekata)",
              "{使|つか}う{方|かた} (Tsukaukata)",
              "{使|つか}います{方|かた} (Tsukaimasukata)",
              "{使|つか}い{方|かた} (Tsukaikata)"
            ],
            "correct": 3,
            "why": "Bỏ ます + **方**: {使|つか}い方 (Tsukaikata)."
          },
          {
            "q": "Dạng \"cách làm\" của 「作ります」 là gì?",
            "options": [
              "{作|つく}る{方|かた} (Tsukurukata)",
              "{作|つく}ります{方|かた} (Tsukurimasukata)",
              "{作|つく}り{方|かた} (Tsukurikata)",
              "{作|つく}って{方|かた} (Tsukuttekata)"
            ],
            "correct": 2,
            "why": "Bỏ ます + **方**: {作|つく}り方 (Tsukurikata)."
          },
          {
            "q": "Dạng \"cách rửa\" của 「洗います」 là gì?",
            "options": [
              "{洗|あら}う{方|かた} (Araukata)",
              "{洗|あら}います{方|かた} (Araimasukata)",
              "{洗|あら}い{方|かた} (Araikata)",
              "{洗|あら}って{方|かた} (Arattekata)"
            ],
            "correct": 2,
            "why": "Bỏ ます + **方**: {洗|あら}い方 (Araikata)."
          },
          {
            "q": "Dạng \"cách đọc\" của 「読みます」 là gì?",
            "options": [
              "{読|よ}む{方|かた} (Yomukata)",
              "{読|よ}み{方|かた} (Yomikata)",
              "{読|よ}みます{方|かた} (Yomimasukata)",
              "{読|よ}んで{方|かた} (Yondekata)"
            ],
            "correct": 1,
            "why": "Bỏ ます + **方**: {読|よ}み方 (Yomikata)."
          },
          {
            "q": "Dạng \"cách nói\" của 「話します」 là gì?",
            "options": [
              "{話|はな}す{方|かた} (Hanasukata)",
              "{話|はな}します{方|かた} (Hanashimasukata)",
              "{話|はな}して{方|かた} (Hanashitekata)",
              "{話|はな}し{方|かた} (Hanashikata)"
            ],
            "correct": 3,
            "why": "Bỏ ます + **方**: {話|はな}し方 (Hanashikata)."
          },
          {
            "q": "Dạng \"cách cắt\" của 「切ります」 là gì?",
            "options": [
              "{切|き}り{方|かた} (Kirikata)",
              "{切|き}って{方|かた} (Kittekata)",
              "{切|き}る{方|かた} (Kirukata)",
              "{切|き}ります{方|かた} (Kirimasukata)"
            ],
            "correct": 0,
            "why": "Bỏ ます + **方**: {切|き}り方 (Kirikata)."
          },
          {
            "q": "Dạng \"cách đi\" của 「行きます」 là gì?",
            "options": [
              "{行|い}き{方|かた} (Ikikata)",
              "{行|い}って{方|かた} (Ittekata)",
              "{行|い}きます{方|かた} (Ikimasukata)",
              "{行|い}く{方|かた} (Ikukata)"
            ],
            "correct": 0,
            "why": "Bỏ ます + **方**: {行|い}き方 (Ikikata)."
          },
          {
            "q": "Dạng \"cách chơi (đàn)\" của 「弾きます」 là gì?",
            "options": [
              "{弾|ひ}いて{方|かた} (Hiitekata)",
              "{弾|ひ}く{方|かた} (Hikukata)",
              "{弾|ひ}き{方|かた} (Hikikata)",
              "{弾|ひ}きます{方|かた} (Hikimasukata)"
            ],
            "correct": 2,
            "why": "Bỏ ます + **方**: {弾|ひ}き方 (Hikikata)."
          },
          {
            "q": "Dạng \"cách mở\" của 「開けます」 là gì?",
            "options": [
              "{開|あ}けます{方|かた} (Akemasukata)",
              "{開|あ}ける{方|かた} (Akerukata)",
              "{開|あ}けて{方|かた} (Aketekata)",
              "{開|あ}け{方|かた} (Akekata)"
            ],
            "correct": 3,
            "why": "Bỏ ます + **方**: {開|あ}け方 (Akekata)."
          },
          {
            "q": "Dạng \"cách dạy\" của 「教えます」 là gì?",
            "options": [
              "{教|おし}え{方|かた} (Oshiekata)",
              "{教|おし}える{方|かた} (Oshierukata)",
              "{教|おし}えて{方|かた} (Oshietekata)",
              "{教|おし}えます{方|かた} (Oshiemasukata)"
            ],
            "correct": 0,
            "why": "Bỏ ます + **方**: {教|おし}え方 (Oshiekata)."
          },
          {
            "q": "Dạng \"cách cho vào\" của 「入れます」 là gì?",
            "options": [
              "{入|い}れる{方|かた} (Irerukata)",
              "{入|い}れ{方|かた} (Irekata)",
              "{入|い}れます{方|かた} (Iremasukata)",
              "{入|い}れて{方|かた} (Iretekata)"
            ],
            "correct": 1,
            "why": "Bỏ ます + **方**: {入|い}れ方 (Irekata)."
          },
          {
            "q": "Dạng \"cách hát\" của 「歌います」 là gì?",
            "options": [
              "{歌|うた}い{方|かた} (Utaikata)",
              "{歌|うた}う{方|かた} (Utaukata)",
              "{歌|うた}います{方|かた} (Utaimasukata)",
              "{歌|うた}って{方|かた} (Utattekata)"
            ],
            "correct": 0,
            "why": "Bỏ ます + **方**: {歌|うた}い方 (Utaikata)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-67",
        "title": "ポイント 67: まだ／もう (10 câu)",
        "items": [
          {
            "q": "A：ビールは（①）ありますか。B：はい、（②）あります。　〔A:biiru wa ((1)) arimasu ka. B:hai, ((2)) arimasu.〕　— A: Còn bia không? B: Còn.",
            "options": [
              "① まだ　② まだ",
              "① もう　② まだ",
              "① もう　② もう",
              "① まだ　② もう"
            ],
            "correct": 0,
            "why": "まだ + khẳng định = vẫn còn (ポイント 67). → **A：ビールはまだありますか。B：はい、まだあります。** 〔A:biiru wa mada arimasu ka. B:hai, mada arimasu.〕 — A: Còn bia không? B: Còn."
          },
          {
            "q": "A：ビールはまだありますか。B：いいえ、＿＿ありません。　〔A:biiru wa mada arimasu ka. B:iie, __ arimasen.〕　— A: Còn bia không? B: Không, hết rồi.",
            "options": [
              "ずっと",
              "ぜひ",
              "まだ",
              "もう"
            ],
            "correct": 3,
            "why": "もう + phủ định = không còn nữa. → **A：ビールはまだありますか。B：いいえ、もうありません。** 〔A:biiru wa mada arimasu ka. B:iie, mou arimasen.〕 — A: Còn bia không? B: Không, hết rồi."
          },
          {
            "q": "＿＿{九時|くじ}です。{帰|かえ}りましょう。　〔__ kuji desu. Kaerimashou.〕　— Đã 9 giờ rồi. Về thôi.",
            "options": [
              "もう",
              "まだ",
              "ずっと",
              "ぜひ"
            ],
            "correct": 0,
            "why": "もう = đã … rồi. → **もう{九時|くじ}です。{帰|かえ}りましょう。** 〔Mou kuji desu. Kaerimashou.〕 — Đã 9 giờ rồi. Về thôi."
          },
          {
            "q": "＿＿{九時|くじ}です。まだだいじょうぶです。　〔__ kuji desu. Mada daijoubu desu.〕　— Mới 9 giờ thôi. Vẫn ổn.",
            "options": [
              "まだ",
              "ぜひ",
              "ずっと",
              "もう"
            ],
            "correct": 0,
            "why": "まだ = mới / vẫn. → **まだ{九時|くじ}です。まだだいじょうぶです。** 〔Mada kuji desu. Mada daijoubu desu.〕 — Mới 9 giờ thôi. Vẫn ổn."
          },
          {
            "q": "＿＿{寒|さむ}くないです。{春|はる}ですから。　〔__ samuku nai desu. Haru desu kara.〕　— Không còn lạnh nữa. Vì đã là mùa xuân.",
            "options": [
              "ぜひ",
              "ずっと",
              "もう",
              "まだ"
            ],
            "correct": 2,
            "why": "もう + phủ định = không còn … nữa. → **もう{寒|さむ}くないです。{春|はる}ですから。** 〔Mou samuku nai desu. Haru desu kara.〕 — Không còn lạnh nữa. Vì đã là mùa xuân."
          },
          {
            "q": "{私|わたし}は＿＿{学生|がくせい}です。{大学|だいがく}で{勉強|べんきょう}しています。　〔Watashi wa __ gakusei desu. Daigaku de benkyoushite imasu.〕　— Tôi vẫn còn là sinh viên. Tôi đang học ở đại học.",
            "options": [
              "まだ",
              "ずっと",
              "もう",
              "ぜひ"
            ],
            "correct": 0,
            "why": "まだ = vẫn. → **{私|わたし}はまだ{学生|がくせい}です。{大学|だいがく}で{勉強|べんきょう}しています。** 〔Watashi wa mada gakusei desu. Daigaku de benkyoushite imasu.〕 — Tôi vẫn còn là sinh viên. Tôi đang học ở đại học."
          },
          {
            "q": "＿＿ありません。ぜんぶ{食|た}べました。　〔__ arimasen. Zenbu tabemashita.〕　— Hết rồi. Tôi đã ăn hết.",
            "options": [
              "ぜひ",
              "まだ",
              "ずっと",
              "もう"
            ],
            "correct": 3,
            "why": "もう ありません = hết rồi. → **もうありません。ぜんぶ{食|た}べました。** 〔Mou arimasen. Zenbu tabemashita.〕 — Hết rồi. Tôi đã ăn hết."
          },
          {
            "q": "A：{先生|せんせい}はまだ{教室|きょうしつ}にいますか。B：いいえ、＿＿いません。　〔A:sensei wa mada kyoushitsu ni imasu ka. B:iie, __ imasen.〕　— A: Cô còn ở trong lớp không? B: Không, cô đi rồi.",
            "options": [
              "もう",
              "まだ",
              "ぜひ",
              "ずっと"
            ],
            "correct": 0,
            "why": "もう いません. → **A：{先生|せんせい}はまだ{教室|きょうしつ}にいますか。B：いいえ、もういません。** 〔A:sensei wa mada kyoushitsu ni imasu ka. B:iie, mou imasen.〕 — A: Cô còn ở trong lớp không? B: Không, cô đi rồi."
          },
          {
            "q": "A：もうご{飯|はん}を{食|た}べましたか。B：いいえ、まだ＿＿。　〔A:mou gohan o tabemashita ka. B:iie, mada __.〕　— A: Bạn ăn cơm chưa? B: Chưa, tôi chưa ăn.",
            "options": [
              "{食|た}べます",
              "{食|た}べません",
              "{食|た}べて いません",
              "{食|た}べました"
            ],
            "correct": 2,
            "why": "まだ V て いません = vẫn chưa V (mở rộng trong slide 18 của cô). → **A：もうご{飯|はん}を{食|た}べましたか。B：いいえ、まだ{食|た}べていません。** 〔A:mou gohan o tabemashita ka. B:iie, mada tabete imasen.〕 — A: Bạn ăn cơm chưa? B: Chưa, tôi chưa ăn."
          },
          {
            "q": "A：ご{飯|はん}はまだありますか。B：はい、＿＿たくさんあります。　〔A:gohan wa mada arimasu ka. B:hai, __ takusan arimasu.〕　— A: Còn cơm không? B: Còn, còn nhiều.",
            "options": [
              "もう",
              "ぜひ",
              "まだ",
              "ずっと"
            ],
            "correct": 2,
            "why": "まだ + あります. → **A：ご{飯|はん}はまだありますか。B：はい、まだたくさんあります。** 〔A:gohan wa mada arimasu ka. B:hai, mada takusan arimasu.〕 — A: Còn cơm không? B: Còn, còn nhiều."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-71",
        "title": "ポイント 71: N で V (8 câu)",
        "items": [
          {
            "q": "はし＿＿ご{飯|はん}を{食|た}べます。　〔Hashi__ gohan o tabemasu.〕　— Tôi ăn cơm bằng đũa.",
            "options": [
              "が",
              "に",
              "で",
              "を"
            ],
            "correct": 2,
            "why": "N（dụng cụ）**で** V (ポイント 71). → **はしでご{飯|はん}を{食|た}べます。** 〔Hashi de gohan o tabemasu.〕 — Tôi ăn cơm bằng đũa."
          },
          {
            "q": "{日本語|にほんご}＿＿{話|はな}します。　〔Nihongo__ hanashimasu.〕　— Tôi nói bằng tiếng Nhật.",
            "options": [
              "で",
              "を",
              "が",
              "に"
            ],
            "correct": 0,
            "why": "Ngôn ngữ cũng dùng で. → **{日本語|にほんご}で{話|はな}します。** 〔Nihongo de hanashimasu.〕 — Tôi nói bằng tiếng Nhật."
          },
          {
            "q": "ナイフ＿＿{肉|にく}を{切|き}ります。　〔Naifu__ niku o kirimasu.〕　— Cắt thịt bằng dao.",
            "options": [
              "で",
              "が",
              "に",
              "を"
            ],
            "correct": 0,
            "why": "Dụng cụ → で. → **ナイフで{肉|にく}を{切|き}ります。** 〔Naifu de niku o kirimasu.〕 — Cắt thịt bằng dao."
          },
          {
            "q": "スプーン＿＿カレーを{食|た}べます。　〔Supuun__ karee o tabemasu.〕　— Ăn cà ri bằng thìa.",
            "options": [
              "が",
              "で",
              "を",
              "に"
            ],
            "correct": 1,
            "why": "Dụng cụ → で. → **スプーンでカレーを{食|た}べます。** 〔Supuun de karee o tabemasu.〕 — Ăn cà ri bằng thìa."
          },
          {
            "q": "A：{何|なに}（①）{食|た}べますか。B：フォーク（②）{食|た}べます。　〔A:nani((1)) tabemasu ka. B:fooku((2)) tabemasu.〕　— A: Bạn ăn bằng gì? B: Tôi ăn bằng dĩa.",
            "options": [
              "① で　② を",
              "① を　② で",
              "① で　② で",
              "① が　② で"
            ],
            "correct": 2,
            "why": "何で (nani de) → N で. → **A：{何|なに}で{食|た}べますか。B：フォークで{食|た}べます。** 〔A:nani de tabemasu ka. B:fooku de tabemasu.〕 — A: Bạn ăn bằng gì? B: Tôi ăn bằng dĩa."
          },
          {
            "q": "このペン＿＿{名前|なまえ}を{書|か}いてください。　〔Kono pen__ namae o kaite kudasai.〕　— Hãy viết tên bằng cây bút này.",
            "options": [
              "を",
              "が",
              "で",
              "に"
            ],
            "correct": 2,
            "why": "Dụng cụ → で. → **このペンで{名前|なまえ}を{書|か}いてください。** 〔Kono pen de namae o kaite kudasai.〕 — Hãy viết tên bằng cây bút này."
          },
          {
            "q": "{電話|でんわ}＿＿{友達|ともだち}と{話|はな}しました。　〔Denwa __ tomodachi to hanashimashita.〕　— Tôi đã nói chuyện với bạn bằng điện thoại.",
            "options": [
              "で",
              "を",
              "が",
              "に"
            ],
            "correct": 0,
            "why": "Phương tiện → で. → **{電話|でんわ}で{友達|ともだち}と{話|はな}しました。** 〔Denwa de tomodachi to hanashimashita.〕 — Tôi đã nói chuyện với bạn bằng điện thoại."
          },
          {
            "q": "A：{何|なに}（①）{肉|にく}を{切|き}りますか。B：ナイフ（②）{切|き}ります。　〔A:nani((1)) niku o kirimasu ka. B:naifu((2)) kirimasu.〕　— A: Bạn cắt thịt bằng gì? B: Cắt bằng dao.",
            "options": [
              "① が　② で",
              "① で　② を",
              "① を　② で",
              "① で　② で"
            ],
            "correct": 3,
            "why": "何で. → **A：{何|なに}で{肉|にく}を{切|き}りますか。B：ナイフで{切|き}ります。** 〔A:nani de niku o kirimasu ka. B:naifu de kirimasu.〕 — A: Bạn cắt thịt bằng gì? B: Cắt bằng dao."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · phân biệt で · gõ · hỏi–đáp · sửa câu sai · ghép · hiểu nghĩa"
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-de",
        "title": "Bốn nghĩa của で (8 câu)",
        "items": [
          {
            "q": "Trong câu này 「で」 có nghĩa gì? {台所|だいどころ}で{料理|りょうり}をします。　〔Daidokoro de ryouri o shimasu.〕",
            "options": [
              "Nơi diễn ra sự kiện",
              "Dụng cụ",
              "Nơi làm hành động",
              "Phương tiện"
            ],
            "correct": 2,
            "why": "台所で + hành động = nơi làm hành động."
          },
          {
            "q": "Trong câu này 「で」 có nghĩa gì? バスで{行|い}きます。　〔Basu de ikimasu.〕",
            "options": [
              "Dụng cụ",
              "Phương tiện",
              "Nơi làm hành động",
              "Nơi diễn ra sự kiện"
            ],
            "correct": 1,
            "why": "バスで = đi bằng xe buýt."
          },
          {
            "q": "Trong câu này 「で」 có nghĩa gì? {公園|こうえん}でコンサートがあります。　〔Kouen de konsaato ga arimasu.〕",
            "options": [
              "Phương tiện",
              "Nơi diễn ra sự kiện",
              "Thời điểm",
              "Dụng cụ"
            ],
            "correct": 1,
            "why": "N で N が あります = sự kiện."
          },
          {
            "q": "Trong câu này 「で」 có nghĩa gì? はしでご{飯|はん}を{食|た}べます。　〔Hashi de gohan o tabemasu.〕",
            "options": [
              "Dụng cụ",
              "Nơi diễn ra sự kiện",
              "Nơi làm hành động",
              "Phương tiện"
            ],
            "correct": 0,
            "why": "はしで = bằng đũa."
          },
          {
            "q": "Trong câu này 「で」 có nghĩa gì? {日本語|にほんご}で{話|はな}します。　〔Nihongo de hanashimasu.〕",
            "options": [
              "Ngôn ngữ / cách thức",
              "Thời điểm",
              "Nơi diễn ra sự kiện",
              "Nơi làm hành động"
            ],
            "correct": 0,
            "why": "日本語で = bằng tiếng Nhật."
          },
          {
            "q": "Trong câu này 「で」 có nghĩa gì? スポーツで{何|なに}がいちばん{好|す}きですか。　〔Supootsu de nani ga ichiban suki desu ka.〕",
            "options": [
              "Phương tiện",
              "Phạm vi so sánh",
              "Nơi làm hành động",
              "Dụng cụ"
            ],
            "correct": 1,
            "why": "N で + いちばん = trong phạm vi N."
          },
          {
            "q": "Câu nào dùng 「で」 SAI?",
            "options": [
              "{台所|だいどころ}で{洗|あら}っています。 (Daidokoro de aratte imasu.)",
              "{公園|こうえん}で{花火|はなび}があります。 (Kouen de hanabi ga arimasu.)",
              "はしで{食|た}べます。 (Hashi de tabemasu.)",
              "{台所|だいどころ}でいます。 (Daidokoro de imasu.)"
            ],
            "correct": 3,
            "why": "Nơi TỒN TẠI (います) dùng に: 台所にいます."
          },
          {
            "q": "Chọn câu có 「で」 chỉ dụng cụ:",
            "options": [
              "{駅|えき}で{会|あ}います。 (Eki de aimasu.)",
              "ペンで{書|か}きます。 (Pen de kakimasu.)",
              "{大学|だいがく}でサッカーの{試合|しあい}があります。 (Daigaku de sakkaa no shiai ga arimasu.)",
              "{電車|でんしゃ}で{行|い}きます。 (Densha de ikimasu.)"
            ],
            "correct": 1,
            "why": "ペンで書きます = viết bằng bút."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-np3-go",
        "title": "Gõ cụm / câu theo nghĩa Việt (7 câu)",
        "kind": "translate",
        "grammar": "ポイント 66–68",
        "items": [
          {
            "q": "Cách đọc chữ Hán này.",
            "answers": [
              "この漢字の読み方",
              "この漢字の読みかた",
              "この漢字のよみ方",
              "この漢字のよみかた",
              "このかんじの読み方",
              "このかんじの読みかた",
              "このかんじのよみ方",
              "このかんじのよみかた"
            ],
            "hint": "N の V方"
          },
          {
            "q": "Cách làm cà ri.",
            "answers": [
              "カレーの作り方",
              "カレーの作りかた",
              "カレーのつくり方",
              "カレーのつくりかた"
            ],
            "hint": "N の V方"
          },
          {
            "q": "Cách dùng đũa.",
            "answers": [
              "はしの使い方",
              "はしの使いかた",
              "はしのつかい方",
              "はしのつかいかた"
            ],
            "hint": "N の V方"
          },
          {
            "q": "Cách gọi điện thoại.",
            "answers": [
              "電話のかけ方",
              "電話のかけかた",
              "でんわのかけ方",
              "でんわのかけかた"
            ],
            "hint": "N の V方"
          },
          {
            "q": "Hãy chỉ cho tôi cách dùng cái này.",
            "answers": [
              "これの使い方を教えてください。",
              "これの使い方をおしえてください。",
              "これの使いかたを教えてください。",
              "これの使いかたをおしえてください。",
              "これのつかい方を教えてください。",
              "これのつかい方をおしえてください。",
              "これのつかいかたを教えてください。",
              "これのつかいかたをおしえてください。"
            ],
            "hint": "V方 · 教えて ください"
          },
          {
            "q": "Tôi không biết cách viết chữ này.",
            "answers": [
              "この字の書き方がわかりません。",
              "この字の書きかたがわかりません。",
              "この字のかき方がわかりません。",
              "この字のかきかたがわかりません。",
              "このじの書き方がわかりません。",
              "このじの書きかたがわかりません。",
              "このじのかき方がわかりません。",
              "このじのかきかたがわかりません。",
              "この漢字の書き方がわかりません。",
              "この漢字の書きかたがわかりません。",
              "この漢字のかき方がわかりません。",
              "この漢字のかきかたがわかりません。",
              "このかんじの書き方がわかりません。",
              "このかんじの書きかたがわかりません。",
              "このかんじのかき方がわかりません。",
              "このかんじのかきかたがわかりません。"
            ],
            "hint": "V方 が わかりません"
          },
          {
            "q": "Cách cắt thịt.",
            "answers": [
              "肉の切り方",
              "肉の切りかた",
              "肉のきり方",
              "肉のきりかた",
              "にくの切り方",
              "にくの切りかた",
              "にくのきり方",
              "にくのきりかた"
            ],
            "hint": "N の V方"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-hoi-dap",
        "title": "Hỏi–đáp trộn ポイント 61–71 (8 câu)",
        "items": [
          {
            "q": "ビールはまだありますか。　〔Biiru wa mada arimasu ka.〕　(bia vẫn còn)　Câu trả lời nào đúng?",
            "options": [
              "ええ、まだありましたか。 (Ee, mada arimashita ka.)",
              "はい、まだあります。 (Hai, mada arimasu.)",
              "いいえ、まだありません。 (Iie, mada arimasen.)",
              "はい、もうあります。 (Hai, mou arimasu.)"
            ],
            "correct": 1,
            "why": "Còn → はい、まだ あります."
          },
          {
            "q": "ビールはまだありますか。　〔Biiru wa mada arimasu ka.〕　(bia đã hết)　Câu trả lời nào đúng?",
            "options": [
              "いいえ、まだありません。 (Iie, mada arimasen.)",
              "いいえ、もうありません。 (Iie, mou arimasen.)",
              "いいえ、もうあります。 (Iie, mou arimasu.)",
              "はい、もうあります。 (Hai, mou arimasu.)"
            ],
            "correct": 1,
            "why": "Hết rồi → もう ありません."
          },
          {
            "q": "このナイフの{使|つか}い{方|かた}がわかりますか。　〔Kono naifu no tsukaikata ga wakarimasu ka.〕　Câu trả lời nào đúng?",
            "options": [
              "いいえ、わかりませんでした。ください。 (Iie, wakarimasen deshita. Kudasai.)",
              "いいえ、わかります。 (Iie, wakarimasu.)",
              "いいえ、わかりません。{教|おし}えてください。 (Iie, wakarimasen. Oshiete kudasai.)",
              "はい、わかりません。 (Hai, wakarimasen.)"
            ],
            "correct": 2,
            "why": "わかりますか → わかります／わかりません."
          },
          {
            "q": "{何|なに}でご{飯|はん}を{食|た}べますか。　〔Nani de gohan o tabemasu ka.〕　Câu trả lời nào đúng?",
            "options": [
              "はしが{食|た}べます。 (Hashi ga tabemasu.)",
              "はしを{食|た}べます。 (Hashi o tabemasu.)",
              "はしに{食|た}べます。 (Hashi ni tabemasu.)",
              "はしで{食|た}べます。 (Hashi de tabemasu.)"
            ],
            "correct": 3,
            "why": "何で → N で."
          },
          {
            "q": "{誰|だれ}がピザを{作|つく}りましたか。　〔Dare ga piza o tsukurimashita ka.〕　Câu trả lời nào đúng?",
            "options": [
              "{山田|やまだ}さんで{作|つく}りました。 (Yamadasan de tsukurimashita.)",
              "{山田|やまだ}さんは{作|つく}りました。 (Yamadasan wa tsukurimashita.)",
              "{山田|やまだ}さんが{作|つく}りました。 (Yamadasan ga tsukurimashita.)",
              "{山田|やまだ}さんを{作|つく}りました。 (Yamadasan o tsukurimashita.)"
            ],
            "correct": 2,
            "why": "だれが → N が."
          },
          {
            "q": "{冷蔵庫|れいぞうこ}の{中|なか}に{何|なに}がありますか。　〔Reizouko no naka ni nani ga arimasu ka.〕　Câu trả lời nào đúng?",
            "options": [
              "ビールと{水|みず}がいます。 (Biiru to mizu ga imasu.)",
              "ビールと{水|みず}があります。 (Biiru to mizu ga arimasu.)",
              "ビールと{水|みず}をあります。 (Biiru to mizu o arimasu.)",
              "ビールと{水|みず}にあります。 (Biiru to mizu ni arimasu.)"
            ],
            "correct": 1,
            "why": "N が あります."
          },
          {
            "q": "{塩|しお}はどれですか。　〔Shio wa dore desu ka.〕　Câu trả lời nào đúng?",
            "options": [
              "それです。 (Sore desu.)",
              "どれです。 (Dore desu.)",
              "ここです。 (Koko desu.)",
              "そのです。 (Sono desu.)"
            ],
            "correct": 0,
            "why": "どれ ⇔ これ／それ／あれ."
          },
          {
            "q": "{窓|まど}を{開|あ}けましょうか。　〔Mado o akemashou ka.〕　Câu trả lời nào đúng?",
            "options": [
              "ええ、{開|あ}けましょうか。 (Ee, akemashou ka.)",
              "ありがとうございます。お{願|ねが}いします。 (Arigatou gozaimasu. Onegai shimasu.)",
              "いいえ、{開|あ}けていますか。 (Iie, akete imasu ka.)",
              "はい、{開|あ}けました。 (Hai, akemashita.)"
            ],
            "correct": 1,
            "why": "Nhận lời giúp."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "(方)　Câu nào SAI?",
            "options": [
              "カレーの{作|つく}り{方|かた}を{教|おし}えてください。 (Karee no tsukurikata o oshiete kudasai.)",
              "カレーを{作|つく}り{方|かた}を{教|おし}えてください。 (Karee o tsukurikata o oshiete kudasai.)",
              "はしの{使|つか}い{方|かた}を{教|おし}えてください。 (Hashi no tsukaikata o oshiete kudasai.)",
              "{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。 (Kanji no yomikata o oshiete kudasai.)"
            ],
            "correct": 1,
            "why": "N **の** V方 (không dùng を)."
          },
          {
            "q": "(方)　Câu nào SAI?",
            "options": [
              "{書|か}き{方|かた}を{教|おし}えてください。 (Kakikata o oshiete kudasai.)",
              "{食|た}べ{方|かた}を{教|おし}えてください。 (Tabekata o oshiete kudasai.)",
              "{作|つく}り{方|かた}を{教|おし}えてください。 (Tsukurikata o oshiete kudasai.)",
              "{作|つく}る{方|かた}を{教|おし}えてください。 (Tsukurukata o oshiete kudasai.)"
            ],
            "correct": 3,
            "why": "Dùng gốc ます (作り) + 方; không dùng dạng từ điển (作る)."
          },
          {
            "q": "(まだ／もう — hỏi \"còn không?\")　Câu nào SAI?",
            "options": [
              "ビールはもうありますか。 (Biiru wa mou arimasu ka.)",
              "ビールはもうありません。 (Biiru wa mou arimasen.)",
              "ビールはまだありますか。 (Biiru wa mada arimasu ka.)",
              "ビールはまだあります。 (Biiru wa mada arimasu.)"
            ],
            "correct": 0,
            "why": "Hỏi \"còn không\" dùng まだ ありますか; もう đi với phủ định."
          },
          {
            "q": "(で)　Câu nào SAI?",
            "options": [
              "{山田|やまだ}さんは{台所|だいどころ}にいます。 (Yamadasan wa daidokoro ni imasu.)",
              "{台所|だいどころ}で{山田|やまだ}さんがいます。 (Daidokoro de yamadasan ga imasu.)",
              "{台所|だいどころ}に{山田|やまだ}さんがいます。 (Daidokoro ni yamadasan ga imasu.)",
              "{台所|だいどころ}で{山田|やまだ}さんが{料理|りょうり}をしています。 (Daidokoro de yamadasan ga ryouri o shite imasu.)"
            ],
            "correct": 1,
            "why": "Tồn tại → に."
          },
          {
            "q": "(だれが)　Câu nào SAI?",
            "options": [
              "{誰|だれ}はギターを{弾|ひ}きますか。 (Dare wa gitaa o hikimasu ka.)",
              "{誰|だれ}がギターを{弾|ひ}きますか。 (Dare ga gitaa o hikimasu ka.)",
              "ワンさんがギターを{弾|ひ}きます。 (Wan-san ga gitaa o hikimasu.)",
              "だれが{弾|ひ}いていますか。 (Dare ga hiite imasu ka.)"
            ],
            "correct": 0,
            "why": "Từ để hỏi + が."
          },
          {
            "q": "(どの)　Câu nào SAI?",
            "options": [
              "どのナイフを{使|つか}いますか。 (Dono naifu o tsukaimasu ka.)",
              "{塩|しお}はどれですか。 (Shio wa dore desu ka.)",
              "{塩|しお}はどのですか。 (Shio wa dono desu ka.)",
              "どのお{皿|さら}ですか。 (Dono osara desu ka.)"
            ],
            "correct": 2,
            "why": "どの cần danh từ theo sau; đứng một mình → どれ."
          },
          {
            "q": "(thể て)　Câu nào SAI?",
            "options": [
              "{窓|まど}を{開|あ}けってください。 (Mado o akette kudasai.)",
              "{窓|まど}を{閉|し}めてください。 (Mado o shimete kudasai.)",
              "ドアを{開|あ}けてください。 (Doa o akete kudasai.)",
              "{窓|まど}を{開|あ}けてください。 (Mado o akete kudasai.)"
            ],
            "correct": 0,
            "why": "開ける (nhóm 2) → 開けて."
          },
          {
            "q": "(ましょうか)　Câu nào SAI?",
            "options": [
              "{塩|しお}を{取|と}りましょうか。 (Shio o torimashou ka.)",
              "ドアを{開|あ}けてましょうか。 (Doa o akete mashou ka.)",
              "ドアを{開|あ}けましょうか。 (Doa o akemashou ka.)",
              "{手伝|てつだ}いましょうか。 (Tetsudaimashou ka.)"
            ],
            "correct": 1,
            "why": "ましょうか đi với gốc ます (開けましょうか), không dùng thể て."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-np3-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Hãy chỉ cho tôi cách dùng đũa.",
            "chips": [
              "ください",
              "{使|つか}い{方|かた}を",
              "はしの",
              "{教|おし}えて",
              "{使|つか}う{方|かた}"
            ],
            "answer": [
              "はしの",
              "{使|つか}い{方|かた}を",
              "{教|おし}えて",
              "ください"
            ],
            "ro": "Hashi no tsukaikata o oshiete kudasai."
          },
          {
            "vi": "Tôi không biết cách đọc chữ này.",
            "chips": [
              "この",
              "わかりません",
              "を",
              "{読|よ}み{方|かた}が",
              "{漢字|かんじ}の"
            ],
            "answer": [
              "この",
              "{漢字|かんじ}の",
              "{読|よ}み{方|かた}が",
              "わかりません"
            ],
            "ro": "Kono kanji no yomikata ga wakarimasen."
          },
          {
            "vi": "Còn bia không? — Còn.",
            "chips": [
              "もう",
              "まだ",
              "ありますか",
              "ビールは"
            ],
            "answer": [
              "ビールは",
              "まだ",
              "ありますか"
            ],
            "ro": "Biiru wa mada arimasu ka?"
          },
          {
            "vi": "Hết rồi.",
            "chips": [
              "まだ",
              "ありません",
              "もう"
            ],
            "answer": [
              "もう",
              "ありません"
            ],
            "ro": "Mou arimasen."
          },
          {
            "vi": "Tôi ăn cơm bằng đũa.",
            "chips": [
              "はしで",
              "に",
              "ご{飯|はん}を",
              "{食|た}べます"
            ],
            "answer": [
              "はしで",
              "ご{飯|はん}を",
              "{食|た}べます"
            ],
            "ro": "Hashi de gohan o tabemasu."
          },
          {
            "vi": "Ai đã làm pizza?",
            "chips": [
              "ピザを",
              "{作|つく}りましたか",
              "{誰|だれ}が",
              "は"
            ],
            "answer": [
              "{誰|だれ}が",
              "ピザを",
              "{作|つく}りましたか"
            ],
            "ro": "Dare ga piza o tsukurimashita ka?"
          },
          {
            "vi": "Muối là cái nào?",
            "chips": [
              "どれ",
              "ですか",
              "どの",
              "{塩|しお}は"
            ],
            "answer": [
              "{塩|しお}は",
              "どれ",
              "ですか"
            ],
            "ro": "Shio wa dore desu ka?"
          },
          {
            "vi": "Cắt thịt bằng dao.",
            "chips": [
              "{切|き}ります",
              "ナイフで",
              "に",
              "{肉|にく}を"
            ],
            "answer": [
              "ナイフで",
              "{肉|にく}を",
              "{切|き}ります"
            ],
            "ro": "Naifu de niku o kirimasu."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-nhat-viet",
        "title": "Nhật → Việt (6 câu)",
        "items": [
          {
            "q": "Nghĩa của câu: このナイフの{使|つか}い{方|かた}を{教|おし}えてください。　〔Kono naifu no tsukaikata o oshiete kudasai.〕",
            "options": [
              "Tôi sẽ dạy bạn dùng dao.",
              "Hãy dùng con dao này.",
              "Hãy chỉ cho tôi cách dùng con dao này.",
              "Con dao này dùng được không?"
            ],
            "correct": 2,
            "why": "使い方 = cách dùng."
          },
          {
            "q": "Nghĩa của câu: ビールはもうありません。　〔Biiru wa mou arimasen.〕",
            "options": [
              "Bia chưa có.",
              "Tôi chưa mua bia.",
              "Bia hết rồi.",
              "Bia vẫn còn."
            ],
            "correct": 2,
            "why": "もう + phủ định = không còn nữa."
          },
          {
            "q": "Nghĩa của câu: ビールはまだたくさんあります。　〔Biiru wa mada takusan arimasu.〕",
            "options": [
              "Bia hết rồi.",
              "Tôi sẽ mua nhiều bia.",
              "Bia vẫn còn nhiều.",
              "Bia đã được mang đến."
            ],
            "correct": 2,
            "why": "まだ = vẫn."
          },
          {
            "q": "Nghĩa của câu: {私|わたし}はまだ{学生|がくせい}です。　〔Watashi wa mada gakusei desu.〕",
            "options": [
              "Tôi chưa từng là sinh viên.",
              "Tôi vẫn còn là sinh viên.",
              "Tôi đã là sinh viên.",
              "Tôi không còn là sinh viên."
            ],
            "correct": 1,
            "why": "まだ + N です = vẫn là."
          },
          {
            "q": "Nghĩa của câu: はしで{食|た}べますが、スプーンも{使|つか}います。　〔Hashi de tabemasu ga, supuun mo tsukaimasu.〕",
            "options": [
              "Tôi ăn bằng thìa nhưng cũng dùng đũa.",
              "Tôi ăn ở quán đũa.",
              "Tôi ăn bằng đũa nhưng cũng dùng thìa.",
              "Tôi không dùng đũa."
            ],
            "correct": 2,
            "why": "N で V; が = nhưng."
          },
          {
            "q": "Nghĩa của câu: {誰|だれ}が{窓|まど}を{開|あ}けましたか。{私|わたし}が{開|あ}けました。　〔Dare ga mado o akemashita ka. Watashi ga akemashita.〕",
            "options": [
              "Ai muốn tôi mở cửa sổ?",
              "Cửa sổ do ai mở? Cô giáo mở.",
              "Ai đã mở cửa sổ? Tôi đã mở.",
              "Tôi đang mở cửa sổ."
            ],
            "correct": 2,
            "why": "だれが … N が."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · trộn cả 11 ポイント + thể て — như đề kiểm tra"
      },
      {
        "t": "quiz",
        "id": "lt-b7-np3-dich",
        "title": "Dịch Việt → Nhật — trộn ポイント 61–71 (12 câu)",
        "kind": "translate",
        "grammar": "Bài 7: ポイント 61–71",
        "items": [
          {
            "q": "Trong tủ lạnh vẫn còn bia không? — Không, hết rồi.",
            "answers": [
              "冷蔵庫の中にまだビールがありますか。いいえ、もうありません。",
              "冷蔵庫のなかにまだビールがありますか。いいえ、もうありません。",
              "れいぞうこの中にまだビールがありますか。いいえ、もうありません。",
              "れいぞうこのなかにまだビールがありますか。いいえ、もうありません。",
              "冷蔵庫にまだビールがありますか。いいえ、もうありません。",
              "れいぞうこにまだビールがありますか。いいえ、もうありません。"
            ],
            "hint": "まだ／もう"
          },
          {
            "q": "Hãy chỉ cho tôi cách làm cà ri.",
            "answers": [
              "カレーの作り方を教えてください。",
              "カレーの作り方をおしえてください。",
              "カレーの作りかたを教えてください。",
              "カレーの作りかたをおしえてください。",
              "カレーのつくり方を教えてください。",
              "カレーのつくり方をおしえてください。",
              "カレーのつくりかたを教えてください。",
              "カレーのつくりかたをおしえてください。"
            ],
            "hint": "N の V方"
          },
          {
            "q": "Xin lỗi, con dao nào là của bạn? — Cái này.",
            "answers": [
              "すみませんが、どのナイフがあなたのですか。これです。"
            ],
            "hint": "どの · これ"
          },
          {
            "q": "Ai đang cắt thịt bằng dao? — Park.",
            "answers": [
              "だれがナイフで肉を切っていますか。パクさんが切っています。",
              "だれがナイフで肉を切っていますか。パクさんがきっています。",
              "だれがナイフで肉をきっていますか。パクさんが切っています。",
              "だれがナイフで肉をきっていますか。パクさんがきっています。",
              "だれがナイフでにくを切っていますか。パクさんが切っています。",
              "だれがナイフでにくを切っていますか。パクさんがきっています。",
              "だれがナイフでにくをきっていますか。パクさんが切っています。",
              "だれがナイフでにくをきっていますか。パクさんがきっています。",
              "誰がナイフで肉を切っていますか。パクさんが切っています。",
              "誰がナイフで肉を切っていますか。パクさんがきっています。",
              "誰がナイフで肉をきっていますか。パクさんが切っています。",
              "誰がナイフで肉をきっていますか。パクさんがきっています。",
              "誰がナイフでにくを切っていますか。パクさんが切っています。",
              "誰がナイフでにくを切っていますか。パクさんがきっています。",
              "誰がナイフでにくをきっていますか。パクさんが切っています。",
              "誰がナイフでにくをきっていますか。パクさんがきっています。"
            ],
            "hint": "だれが · で · ています"
          },
          {
            "q": "Trước ga có hòm thư. Hòm thư ở bên cạnh đồn công an.",
            "answers": [
              "駅の前にポストがあります。ポストは交番の隣にあります。",
              "駅の前にポストがあります。ポストは交番のとなりにあります。",
              "駅の前にポストがあります。ポストはこうばんの隣にあります。",
              "駅の前にポストがあります。ポストはこうばんのとなりにあります。",
              "駅のまえにポストがあります。ポストは交番の隣にあります。",
              "駅のまえにポストがあります。ポストは交番のとなりにあります。",
              "駅のまえにポストがあります。ポストはこうばんの隣にあります。",
              "駅のまえにポストがあります。ポストはこうばんのとなりにあります。",
              "えきの前にポストがあります。ポストは交番の隣にあります。",
              "えきの前にポストがあります。ポストは交番のとなりにあります。",
              "えきの前にポストがあります。ポストはこうばんの隣にあります。",
              "えきの前にポストがあります。ポストはこうばんのとなりにあります。",
              "えきのまえにポストがあります。ポストは交番の隣にあります。",
              "えきのまえにポストがあります。ポストは交番のとなりにあります。",
              "えきのまえにポストがあります。ポストはこうばんの隣にあります。",
              "えきのまえにポストがあります。ポストはこうばんのとなりにあります。",
              "駅の前にポストがあります。ポストは交番の横にあります。",
              "駅の前にポストがあります。ポストは交番のよこにあります。",
              "駅の前にポストがあります。ポストはこうばんの横にあります。",
              "駅の前にポストがあります。ポストはこうばんのよこにあります。",
              "駅のまえにポストがあります。ポストは交番の横にあります。",
              "駅のまえにポストがあります。ポストは交番のよこにあります。",
              "駅のまえにポストがあります。ポストはこうばんの横にあります。",
              "駅のまえにポストがあります。ポストはこうばんのよこにあります。",
              "えきの前にポストがあります。ポストは交番の横にあります。",
              "えきの前にポストがあります。ポストは交番のよこにあります。",
              "えきの前にポストがあります。ポストはこうばんの横にあります。",
              "えきの前にポストがあります。ポストはこうばんのよこにあります。",
              "えきのまえにポストがあります。ポストは交番の横にあります。",
              "えきのまえにポストがあります。ポストは交番のよこにあります。",
              "えきのまえにポストがあります。ポストはこうばんの横にあります。",
              "えきのまえにポストがあります。ポストはこうばんのよこにあります。"
            ],
            "hint": "N に N が あります → N は N に あります"
          },
          {
            "q": "Hãy mở cửa sổ giúp tôi. — Được thôi.",
            "answers": [
              "窓を開けてください。いいですよ。",
              "窓をあけてください。いいですよ。",
              "まどを開けてください。いいですよ。",
              "まどをあけてください。いいですよ。",
              "すみませんが、窓を開けてください。いいですよ。",
              "すみませんが、窓をあけてください。いいですよ。",
              "すみませんが、まどを開けてください。いいですよ。",
              "すみませんが、まどをあけてください。いいですよ。"
            ],
            "hint": "V て ください · いいですよ"
          },
          {
            "q": "Để tôi rửa đĩa nhé? — Cảm ơn, nhờ bạn.",
            "answers": [
              "お皿を洗いましょうか。ありがとうございます。お願いします。",
              "お皿を洗いましょうか。ありがとうございます。おねがいします。",
              "お皿をあらいましょうか。ありがとうございます。お願いします。",
              "お皿をあらいましょうか。ありがとうございます。おねがいします。",
              "おさらを洗いましょうか。ありがとうございます。お願いします。",
              "おさらを洗いましょうか。ありがとうございます。おねがいします。",
              "おさらをあらいましょうか。ありがとうございます。お願いします。",
              "おさらをあらいましょうか。ありがとうございます。おねがいします。"
            ],
            "hint": "Vましょうか"
          },
          {
            "q": "Anh Yamada đang chơi ghi ta trong phòng.",
            "answers": [
              "山田さんはへやでギターを弾いています。",
              "山田さんはへやでギターをひいています。",
              "やまださんはへやでギターを弾いています。",
              "やまださんはへやでギターをひいています。",
              "山田さんは部屋でギターを弾いています。",
              "山田さんは部屋でギターをひいています。",
              "やまださんは部屋でギターを弾いています。",
              "やまださんは部屋でギターをひいています。"
            ],
            "hint": "N で N を V て います"
          },
          {
            "q": "Dưới bàn có một con chó. Con chó tên là Pochi.",
            "answers": [
              "テーブルの下に犬がいます。犬の名前はポチです。",
              "テーブルの下に犬がいます。犬のなまえはポチです。",
              "テーブルの下に犬がいます。いぬの名前はポチです。",
              "テーブルの下に犬がいます。いぬのなまえはポチです。",
              "テーブルの下にいぬがいます。犬の名前はポチです。",
              "テーブルの下にいぬがいます。犬のなまえはポチです。",
              "テーブルの下にいぬがいます。いぬの名前はポチです。",
              "テーブルの下にいぬがいます。いぬのなまえはポチです。",
              "テーブルのしたに犬がいます。犬の名前はポチです。",
              "テーブルのしたに犬がいます。犬のなまえはポチです。",
              "テーブルのしたに犬がいます。いぬの名前はポチです。",
              "テーブルのしたに犬がいます。いぬのなまえはポチです。",
              "テーブルのしたにいぬがいます。犬の名前はポチです。",
              "テーブルのしたにいぬがいます。犬のなまえはポチです。",
              "テーブルのしたにいぬがいます。いぬの名前はポチです。",
              "テーブルのしたにいぬがいます。いぬのなまえはポチです。"
            ],
            "hint": "N に N が います"
          },
          {
            "q": "Chưa mua vé. Hôm nay tôi mua.",
            "answers": [
              "まだチケットを買っていません。今日買います。",
              "まだチケットを買っていません。今日かいます。",
              "まだチケットを買っていません。きょう買います。",
              "まだチケットを買っていません。きょうかいます。",
              "まだチケットをかっていません。今日買います。",
              "まだチケットをかっていません。今日かいます。",
              "まだチケットをかっていません。きょう買います。",
              "まだチケットをかっていません。きょうかいます。",
              "チケットはまだです。今日買います。",
              "チケットはまだです。今日かいます。",
              "チケットはまだです。きょう買います。",
              "チケットはまだです。きょうかいます。"
            ],
            "hint": "まだ V ていません"
          },
          {
            "q": "Trong lớp không có ai. Ngoài cửa sổ có một cái cây.",
            "answers": [
              "教室に誰もいません。窓の外に木があります。",
              "教室に誰もいません。窓の外にきがあります。",
              "教室に誰もいません。窓のそとに木があります。",
              "教室に誰もいません。窓のそとにきがあります。",
              "教室に誰もいません。まどの外に木があります。",
              "教室に誰もいません。まどの外にきがあります。",
              "教室に誰もいません。まどのそとに木があります。",
              "教室に誰もいません。まどのそとにきがあります。",
              "教室にだれもいません。窓の外に木があります。",
              "教室にだれもいません。窓の外にきがあります。",
              "教室にだれもいません。窓のそとに木があります。",
              "教室にだれもいません。窓のそとにきがあります。",
              "教室にだれもいません。まどの外に木があります。",
              "教室にだれもいません。まどの外にきがあります。",
              "教室にだれもいません。まどのそとに木があります。",
              "教室にだれもいません。まどのそとにきがあります。",
              "きょうしつに誰もいません。窓の外に木があります。",
              "きょうしつに誰もいません。窓の外にきがあります。",
              "きょうしつに誰もいません。窓のそとに木があります。",
              "きょうしつに誰もいません。窓のそとにきがあります。",
              "きょうしつに誰もいません。まどの外に木があります。",
              "きょうしつに誰もいません。まどの外にきがあります。",
              "きょうしつに誰もいません。まどのそとに木があります。",
              "きょうしつに誰もいません。まどのそとにきがあります。",
              "きょうしつにだれもいません。窓の外に木があります。",
              "きょうしつにだれもいません。窓の外にきがあります。",
              "きょうしつにだれもいません。窓のそとに木があります。",
              "きょうしつにだれもいません。窓のそとにきがあります。",
              "きょうしつにだれもいません。まどの外に木があります。",
              "きょうしつにだれもいません。まどの外にきがあります。",
              "きょうしつにだれもいません。まどのそとに木があります。",
              "きょうしつにだれもいません。まどのそとにきがあります。"
            ],
            "hint": "誰も · N に N が"
          },
          {
            "q": "Hãy lấy giúp tôi cái thìa và dĩa. Tôi ăn bằng thìa và dĩa.",
            "answers": [
              "スプーンとフォークを取ってください。スプーンとフォークで食べます。",
              "スプーンとフォークを取ってください。スプーンとフォークでたべます。",
              "スプーンとフォークをとってください。スプーンとフォークで食べます。",
              "スプーンとフォークをとってください。スプーンとフォークでたべます。"
            ],
            "hint": "V て ください · N で V"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "A：{台所|だいどころ}（①）{誰|だれ}（②）いますか。B：{山田|やまだ}さん（③）いて、{料理|りょうり}（④）しています。　〔A:daidokoro((1)) dare((2)) imasu ka. B:yamadasan((3)) ite, ryouri((4)) shite imasu.〕　— A: Ở bếp có ai? B: Có anh Yamada, anh ấy đang nấu ăn.",
            "options": [
              "① に　② が　③ が　④ を",
              "① で　② が　③ が　④ を",
              "① に　② は　③ が　④ を",
              "① に　② が　③ は　④ に"
            ],
            "correct": 0,
            "why": "N に 誰が います · N が … て · N を して います. → **A：{台所|だいどころ}に{誰|だれ}がいますか。B：{山田|やまだ}さんがいて、{料理|りょうり}をしています。** 〔A:daidokoro ni dare ga imasu ka. B:yamadasan ga ite, ryouri o shite imasu.〕 — A: Ở bếp có ai? B: Có anh Yamada, anh ấy đang nấu ăn."
          },
          {
            "q": "すみません（①）、このナイフ（②）{使|つか}い{方|かた}（③）{教|おし}えてください。　〔Sumimasen((1)), kono naifu((2)) tsukaikata((3)) oshiete kudasai.〕　— Xin lỗi, hãy chỉ cho tôi cách dùng con dao này.",
            "options": [
              "① は　② の　③ を",
              "① が　② の　③ が",
              "① が　② の　③ を",
              "① が　② を　③ を"
            ],
            "correct": 2,
            "why": "N の V方 を 教えて ください. → **すみませんが、このナイフの{使|つか}い{方|かた}を{教|おし}えてください。** 〔Sumimasen ga, kono naifu no tsukaikata o oshiete kudasai.〕 — Xin lỗi, hãy chỉ cho tôi cách dùng con dao này."
          },
          {
            "q": "A：ビール（①）（②）ありますか。B：いいえ、（③）ありません。{買|か}って{来|き}（④）か。　〔A:biiru((1)) ((2)) arimasu ka. B:iie, ((3)) arimasen. Katte ki((4)) ka.〕　— A: Còn bia không? B: Không, hết rồi. Để tôi đi mua nhé?",
            "options": [
              "① が　② まだ　③ もう　④ ましょう",
              "① は　② もう　③ まだ　④ ましょう",
              "① は　② まだ　③ もう　④ ません",
              "① は　② まだ　③ もう　④ ましょう"
            ],
            "correct": 3,
            "why": "まだ ありますか → もう ありません · Vましょうか. → **A：ビールはまだありますか。B：いいえ、もうありません。{買|か}って{来|き}ましょうか。** 〔A:biiru wa mada arimasu ka. B:iie, mou arimasen. Katte kimashou ka.〕 — A: Còn bia không? B: Không, hết rồi. Để tôi đi mua nhé?"
          },
          {
            "q": "はし（①）ご{飯|はん}（②）{食|た}べています。{誰|だれ}（③）スプーン（④）{使|つか}っていますか。　〔Hashi((1)) gohan((2)) tabete imasu. Dare((3)) supuun((4)) tsukatte imasu ka.〕　— Tôi đang ăn cơm bằng đũa. Ai đang dùng thìa?",
            "options": [
              "① を　② を　③ が　④ を",
              "① で　② を　③ は　④ を",
              "① で　② を　③ が　④ を",
              "① で　② が　③ が　④ を"
            ],
            "correct": 2,
            "why": "N で N を V て います · 誰が. → **はしでご{飯|はん}を{食|た}べています。{誰|だれ}がスプーンを{使|つか}っていますか。** 〔Hashi de gohan o tabete imasu. Dare ga supuun o tsukatte imasu ka.〕 — Tôi đang ăn cơm bằng đũa. Ai đang dùng thìa?"
          },
          {
            "q": "A：（①）お{皿|さら}（②）{洗|あら}いましょうか。B：このお{皿|さら}（③）お{願|ねが}いします。　〔A:((1)) osara((2)) araimashou ka. B:kono osara((3)) onegai shimasu.〕　— A: Để tôi rửa cái đĩa nào nhé? B: Nhờ bạn cái đĩa này.",
            "options": [
              "① どの　② を　③ が",
              "① どの　② が　③ を",
              "① どの　② を　③ を",
              "① どれ　② を　③ を"
            ],
            "correct": 2,
            "why": "どの N を … ましょうか ⇔ この N を. → **A：どのお{皿|さら}を{洗|あら}いましょうか。B：このお{皿|さら}をお{願|ねが}いします。** 〔A:dono osara o araimashou ka. B:kono osara o onegai shimasu.〕 — A: Để tôi rửa cái đĩa nào nhé? B: Nhờ bạn cái đĩa này."
          },
          {
            "q": "{駅|えき}（①）{前|まえ}（②）ポスト（③）あります。ポスト（④）{交番|こうばん}（⑤）{隣|となり}（⑥）あります。　〔Eki((1)) mae((2)) posuto((3)) arimasu. Posuto((4)) kouban((5)) tonari((6)) arimasu.〕　— Trước ga có hòm thư. Hòm thư ở cạnh đồn công an.",
            "options": [
              "① の　② で　③ が　④ は　⑤ の　⑥ に",
              "① の　② に　③ が　④ は　⑤ の　⑥ で",
              "① の　② に　③ は　④ が　⑤ の　⑥ に",
              "① の　② に　③ が　④ は　⑤ の　⑥ に"
            ],
            "correct": 3,
            "why": "N1 の前に N2 が … N2 は N1 の隣に. → **{駅|えき}の{前|まえ}にポストがあります。ポストは{交番|こうばん}の{隣|となり}にあります。** 〔Eki no mae ni posuto ga arimasu. Posuto wa kouban no tonari ni arimasu.〕 — Trước ga có hòm thư. Hòm thư ở cạnh đồn công an."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-np3-mini",
        "title": "Đề nhỏ khuôn kiểm tra: chọn đáp án đúng (12 câu)",
        "items": [
          {
            "q": "「{冷蔵庫|れいぞうこ}の{中|なか}に{何|なに}＿＿ありますか。」　〔\"reizouko no naka ni nani__ arimasu ka.\"〕",
            "options": [
              "は",
              "を",
              "が",
              "に"
            ],
            "correct": 2,
            "why": "Từ để hỏi + が. → **「{冷蔵庫|れいぞうこ}の{中|なか}に{何|なに}がありますか。」** 〔\"reizouko no naka ni nani ga arimasu ka.\"〕 — "
          },
          {
            "q": "「{犬|いぬ}はどこ（①）いますか。」「{木|き}の{下|した}（②）います。」　〔\"inu wa doko((1)) imasuka.\"\"ki no shita((2)) imasu.\"〕",
            "options": [
              "① に　② で",
              "① に　② に",
              "① が　② を",
              "① で　② に"
            ],
            "correct": 1,
            "why": "Nơi tồn tại → に. → **「{犬|いぬ}はどこにいますか。」「{木|き}の{下|した}にいます。」** 〔\"inu wa doko ni imasuka.\"\"ki no shita ni imasu.\"〕 — "
          },
          {
            "q": "「＿＿お{皿|さら}があなたのですか。」「あのお{皿|さら}です。」　〔\"__ osara ga anata no desuka.\"\"ano osara desu.\"〕",
            "options": [
              "どちら",
              "どれ",
              "どの",
              "どこ"
            ],
            "correct": 2,
            "why": "どの + N. → **「どのお{皿|さら}があなたのですか。」「あのお{皿|さら}です。」** 〔\"dono osara ga anata no desuka.\"\"ano osara desu.\"〕 — "
          },
          {
            "q": "「{窓|まど}を＿＿ください。」　〔\"mado o __ kudasai.\"〕",
            "options": [
              "{開|あ}けない",
              "{開|あ}けて",
              "{開|あ}ける",
              "{開|あ}けます"
            ],
            "correct": 1,
            "why": "V て ください. → **「{窓|まど}を{開|あ}けてください。」** 〔\"mado o akete kudasai.\"〕 — "
          },
          {
            "q": "「{山田|やまだ}さんは{今|いま}、{手紙|てがみ}を＿＿。」　〔\"yamadasan wa ima, tegami o __.\"〕",
            "options": [
              "{書|か}く います",
              "{書|か}いて います",
              "{書|か}きます います",
              "{書|か}いて ください"
            ],
            "correct": 1,
            "why": "V て います = đang. → **「{山田|やまだ}さんは{今|いま}、{手紙|てがみ}を{書|か}いています。」** 〔\"yamadasan wa ima, tegami o kaite imasu.\"〕 — "
          },
          {
            "q": "「{手伝|てつだ}い＿＿か。」「ありがとうございます。」　〔\"tetsudai__ ka.\"\"arigatou gozaimasu.\"〕",
            "options": [
              "ます",
              "ましょう",
              "ません",
              "ました"
            ],
            "correct": 1,
            "why": "Vましょうか. → **「{手伝|てつだ}いましょうか。」「ありがとうございます。」** 〔\"tetsudaimashou ka.\"\"arigatou gozaimasu.\"〕 — "
          },
          {
            "q": "「この{漢字|かんじ}の{読|よ}み＿＿を{教|おし}えてください。」　〔\"kono kanji no yomi__ o oshiete kudasai.\"〕",
            "options": [
              "{中|なか}",
              "{前|まえ}",
              "{人|ひと}",
              "{方|かた}"
            ],
            "correct": 3,
            "why": "V方. → **「この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。」** 〔\"kono kanji no yomikata o oshiete kudasai.\"〕 — "
          },
          {
            "q": "「ビールは＿＿ありますか。」「いいえ、もうありません。」　〔\"biiru wa __ arimasuka.\"\"iie, mou arimasen.\"〕",
            "options": [
              "まだ",
              "ぜひ",
              "ずっと",
              "もう"
            ],
            "correct": 0,
            "why": "まだ ありますか → もう ありません. → **「ビールはまだありますか。」「いいえ、もうありません。」** 〔\"biiru wa mada arimasuka.\"\"iie, mou arimasen.\"〕 — "
          },
          {
            "q": "「だれ（①）ギターを{弾|ひ}いていますか。」「ワンさん（②）{弾|ひ}いています。」　〔\"dare((1)) gitaa o hiite imasuka.\"\"wansan((2)) hiite imasu.\"〕",
            "options": [
              "① が　② が",
              "① は　② が",
              "① が　② は",
              "① を　② が"
            ],
            "correct": 0,
            "why": "だれが → N が. → **「だれがギターを{弾|ひ}いていますか。」「ワンさんが{弾|ひ}いています。」** 〔\"dare ga gitaa o hiite imasuka.\"\"wansan ga hiite imasu.\"〕 — "
          },
          {
            "q": "「{何|なに}（①）ご{飯|はん}を{食|た}べますか。」「はし（②）{食|た}べます。」　〔\"nani((1)) gohan o tabemasuka.\"\"hashi((2)) tabemasu.\"〕",
            "options": [
              "① が　② で",
              "① で　② を",
              "① で　② で",
              "① を　② で"
            ],
            "correct": 2,
            "why": "Dụng cụ → で. → **「{何|なに}でご{飯|はん}を{食|た}べますか。」「はしで{食|た}べます。」** 〔\"nani de gohan o tabemasuka.\"\"hashi de tabemasu.\"〕 — "
          },
          {
            "q": "「{教室|きょうしつ}に{誰|だれ}＿＿いません。」　〔\"kyoushitsu ni dare__ imasen.\"〕",
            "options": [
              "も",
              "が",
              "を",
              "は"
            ],
            "correct": 0,
            "why": "誰も + phủ định. → **「{教室|きょうしつ}に{誰|だれ}もいません。」** 〔\"kyoushitsu ni dare mo imasen.\"〕 — "
          },
          {
            "q": "「{銀行|ぎんこう}は{本屋|ほんや}の＿＿にあります。」　〔\"ginkou wa hon'ya no __ ni arimasu.\"〕　— Ngân hàng ở cạnh hiệu sách (hai toà nhà xếp hàng cạnh nhau).",
            "options": [
              "{中|なか}",
              "{隣|となり}",
              "{外|そと}",
              "{上|うえ}"
            ],
            "correct": 1,
            "why": "Hai thứ CÙNG LOẠI cạnh nhau → 隣. → **「{銀行|ぎんこう}は{本屋|ほんや}の{隣|となり}にあります。」** 〔\"ginkou wa hon'ya no tonari ni arimasu.\"〕 — Ngân hàng ở cạnh hiệu sách (hai toà nhà xếp hàng cạnh nhau)."
          }
        ]
      },
      {
        "t": "note",
        "title": "Mẹo trước khi nộp bài",
        "items": [
          "Soát từng ô trống: **người/con vật → います, đồ vật → あります**; **tồn tại → に**; **hành động → で**; **từ để hỏi → が**.",
          "Sau 〜てください／〜ています bạn phải thấy **thể て** (る→って, む→んで, く→いて…). Nhóm 2: bỏ ます + て."
        ]
      }
    ]
  },
  {
    "id": "lt-b7-hoi-thoai",
    "kind": "conversation",
    "title": "Luyện thêm Bài 7 · Hội thoại — ở nhà bạn & bữa tiệc: hỏi đồ ở đâu · nhờ · đề nghị giúp · điện thoại · cách dùng · còn/hết (5 hội thoại mới, ~55 câu)",
    "goal": "Hiểu và tự nói được hội thoại Bài 7: hỏi đồ vật/người ở đâu, nhờ việc bằng V てください, đề nghị giúp bằng Vましょうか, gọi điện thoại, hỏi cách dùng (どれ／〜方) và nói còn/hết (まだ／もう).",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Mỗi hội thoại làm 4 bước: **đọc + nghe** → **câu hỏi hiểu** → **điền chỗ trống** → **sắp xếp lượt thoại**; cuối bài là phần **tự nói** (che một vai).",
          "Khi nghe, bắt 3 thứ: **ở đâu** (N に あります／います), **nhờ gì** (V て ください) và **ai làm gì** (V ています／ましょうか). Câu \"Nhờ\" thường mở bằng **すみませんが**; nhận lời bằng **いいですよ**.",
          "Lỗi hay mắc: dùng **で** thay **に** cho nơi tồn tại, quên **thể て** trước ください, và nhầm **どれ／どの**."
        ]
      },
      {
        "t": "recap",
        "title": "Khuôn chung ở nhà bạn / bữa tiệc",
        "items": [
          "**Hỏi ở đâu**: N は どこ に ありますか／いますか → N は N2 の 上／中／横… に あります／います.",
          "**Nhờ**: すみませんが、V て ください → **Nhận**: いいですよ ／ **Đề nghị giúp**: V ましょうか → お願いします ／ 大丈夫です.",
          "**Hỏi cái nào**: どれ ですか → これ／それ／あれ · **Còn/hết**: まだ ありますか → まだ あります／もう ありません."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · Hội thoại 1–2: hỏi đồ ở đâu · nhờ và đề nghị giúp"
      },
      {
        "t": "p",
        "text": "**Tình huống 1.** Marco đến nhà Anna, hỏi đồ dùng bàn ăn ở đâu."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 1 — Marco hỏi đồ vật ở đâu trong bếp nhà Anna",
        "lines": [
          {
            "who": "マルコ",
            "role": "a",
            "text": "アンナさん、ナイフはどこにありますか。",
            "ro": "Anna-san, naifu wa doko ni arimasu ka.",
            "vi": "Anna, con dao ở đâu vậy?"
          },
          {
            "who": "アンナ",
            "role": "b",
            "text": "ナイフは{台所|だいどころ}のテーブルの{上|うえ}にあります。",
            "ro": "Naifu wa daidokoro no teeburu no ue ni arimasu.",
            "vi": "Dao ở trên bàn trong bếp."
          },
          {
            "who": "マルコ",
            "role": "a",
            "text": "テーブルの{上|うえ}に{何|なに}がありますか。",
            "ro": "Teeburu no ue ni nani ga arimasu ka.",
            "vi": "Trên bàn có gì?"
          },
          {
            "who": "アンナ",
            "role": "b",
            "text": "ナイフとフォークとスプーンがあります。お{皿|さら}は{冷蔵庫|れいぞうこ}の{横|よこ}にあります。",
            "ro": "Naifu to fooku to supuun ga arimasu. Osara wa reizouko no yoko ni arimasu.",
            "vi": "Có dao, dĩa và thìa. Đĩa thì ở bên cạnh tủ lạnh."
          },
          {
            "who": "マルコ",
            "role": "a",
            "text": "わかりました。ありがとう。",
            "ro": "Wakarimashita. Arigatou.",
            "vi": "Mình hiểu rồi. Cảm ơn."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-ht1-hieu",
        "title": "Hội thoại 1 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Marco hỏi tìm gì?",
            "options": [
              "Cái cốc",
              "Con dao",
              "Cái đĩa",
              "Cái thìa"
            ],
            "correct": 1,
            "why": "ナイフは どこに ありますか."
          },
          {
            "q": "Con dao ở đâu?",
            "options": [
              "Trên bàn trong bếp",
              "Ngoài cửa sổ",
              "Trong tủ lạnh",
              "Dưới bàn"
            ],
            "correct": 0,
            "why": "台所の テーブルの 上."
          },
          {
            "q": "Trên bàn có những gì?",
            "options": [
              "Dĩa và cốc",
              "Chỉ có dao",
              "Dao và đĩa",
              "Dao, dĩa và thìa"
            ],
            "correct": 3,
            "why": "ナイフ と フォーク と スプーン."
          },
          {
            "q": "Đĩa ở đâu?",
            "options": [
              "Trong bếp, dưới bàn",
              "Trong tủ lạnh",
              "Trên bàn",
              "Bên cạnh tủ lạnh"
            ],
            "correct": 3,
            "why": "冷蔵庫の 横."
          },
          {
            "q": "Vì sao dùng あります (không dùng います)?",
            "options": [
              "Vì ở trong bếp",
              "Vì đây là đồ vật",
              "Vì đây là con vật",
              "Vì đây là người"
            ],
            "correct": 1,
            "why": "Đồ vật → あります."
          },
          {
            "q": "「テーブルの 上に 何が ありますか」 hỏi điều gì?",
            "options": [
              "Ai ở trên bàn",
              "Bàn ở đâu",
              "Trên bàn có gì",
              "Cái nào ở trên bàn"
            ],
            "correct": 2,
            "why": "N1 に 何が ありますか."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-ht1-dien",
        "title": "Hội thoại 1 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "マルコ：ナイフはどこ＿＿ありますか。　〔Maruko:naifu wa doko__ arimasu ka.〕",
            "answers": [
              "に"
            ],
            "hint": "Nơi tồn tại"
          },
          {
            "q": "アンナ：テーブルの{上|うえ}にナイフ＿＿あります。　〔Anna:teeburu no ue ni naifu__ arimasu.〕",
            "answers": [
              "が"
            ],
            "hint": "Giới thiệu cái có"
          },
          {
            "q": "マルコ：テーブルの{上|うえ}に＿＿がありますか。　〔Maruko:teeburu no ue ni __ ga arimasu ka.〕",
            "answers": [
              "何",
              "なに"
            ],
            "hint": "Từ để hỏi"
          },
          {
            "q": "アンナ：お{皿|さら}は{冷蔵庫|れいぞうこ}の＿＿にあります。　〔Anna:osara wa reizouko no __ ni arimasu.〕",
            "answers": [
              "横",
              "よこ"
            ],
            "hint": "Cạnh tủ lạnh"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-ht1-sx",
        "title": "Hội thoại 1 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi ở đâu → trả lời → hỏi có gì → trả lời.",
            "chips": [
              "ナイフは{台所|だいどころ}のテーブルの{上|うえ}にあります。",
              "アンナさん、ナイフはどこにありますか。",
              "ナイフとフォークとスプーンがあります。",
              "テーブルの{上|うえ}に{何|なに}がありますか。"
            ],
            "answer": [
              "アンナさん、ナイフはどこにありますか。",
              "ナイフは{台所|だいどころ}のテーブルの{上|うえ}にあります。",
              "テーブルの{上|うえ}に{何|なに}がありますか。",
              "ナイフとフォークとスプーンがあります。"
            ],
            "ro": "Anna-san, naifu wa doko ni arimasu ka. Naifu wa daidokoro no teeburu no ue ni arimasu. Teeburu no ue ni nani ga arimasu ka. Naifu to fooku to supuun ga arimasu.."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 2.** Anna nhờ Park bỏ bia vào tủ lạnh; Park đề nghị rửa đĩa."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 2 — Anna nhờ Park chuẩn bị tiệc",
        "lines": [
          {
            "who": "アンナ",
            "role": "a",
            "text": "パクさん、すみませんが、ビールを{冷蔵庫|れいぞうこ}に{入|い}れてください。",
            "ro": "Paku-san, sumimasen ga, biiru o reizouko ni irete kudasai.",
            "vi": "Park, xin lỗi, hãy bỏ bia vào tủ lạnh giúp mình."
          },
          {
            "who": "パク",
            "role": "b",
            "text": "いいですよ。ビールはどこにありますか。",
            "ro": "Ii desu yo. Biiru wa doko ni arimasu ka.",
            "vi": "Được thôi. Bia ở đâu vậy?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "あそこのかばんの{中|なか}にあります。",
            "ro": "Asoko no kaban no naka ni arimasu.",
            "vi": "Ở trong cái cặp đằng kia."
          },
          {
            "who": "パク",
            "role": "b",
            "text": "わかりました。お{皿|さら}も{洗|あら}いましょうか。",
            "ro": "Wakarimashita. Osara mo araimashou ka.",
            "vi": "Mình hiểu rồi. Mình rửa đĩa luôn nhé?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "ありがとう。じゃあ、お{願|ねが}いします。",
            "ro": "Arigatou. Jaa, onegai shimasu.",
            "vi": "Cảm ơn. Vậy nhờ bạn nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-ht2-hieu",
        "title": "Hội thoại 2 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Anna nhờ Park làm gì đầu tiên?",
            "options": [
              "Rửa đĩa",
              "Mở cửa sổ",
              "Bỏ bia vào tủ lạnh",
              "Lấy muối"
            ],
            "correct": 2,
            "why": "ビールを 冷蔵庫に 入れて ください."
          },
          {
            "q": "Park trả lời lời nhờ như thế nào?",
            "options": [
              "Nhận lời (いいですよ)",
              "Hỏi lại tên",
              "Từ chối",
              "Hẹn lần sau"
            ],
            "correct": 0,
            "why": "いいですよ."
          },
          {
            "q": "Bia đang ở đâu?",
            "options": [
              "Trong tủ lạnh",
              "Trong cái cặp đằng kia",
              "Trên bàn",
              "Ngoài cửa sổ"
            ],
            "correct": 1,
            "why": "あそこの かばんの 中."
          },
          {
            "q": "「お皿も 洗いましょうか」 là Park đang làm gì?",
            "options": [
              "Chủ động đề nghị giúp",
              "Từ chối rửa đĩa",
              "Nhờ Anna giúp",
              "Hỏi Anna đã rửa chưa"
            ],
            "correct": 0,
            "why": "Vましょうか = để tôi làm."
          },
          {
            "q": "Anna đáp lại đề nghị đó thế nào?",
            "options": [
              "Không trả lời",
              "Hỏi lại",
              "Từ chối",
              "Nhận lời giúp"
            ],
            "correct": 3,
            "why": "お願いします."
          },
          {
            "q": "「すみませんが」 ở đầu câu nhằm mục đích gì?",
            "options": [
              "Từ chối",
              "Làm câu nhờ lịch sự hơn",
              "Hỏi đường",
              "Xin lỗi vì đến muộn"
            ],
            "correct": 1,
            "why": "すみませんが + V て ください."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-ht2-dien",
        "title": "Hội thoại 2 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "アンナ：ビールを{冷蔵庫|れいぞうこ}に{入|い}れ＿＿ください。　〔Anna:biiru o reizouko ni ire__ kudasai.〕",
            "answers": [
              "て"
            ],
            "hint": "Thể て"
          },
          {
            "q": "パク：ビールはどこに＿＿か。　〔Paku:biiru wa doko ni __ ka.〕",
            "answers": [
              "あります"
            ],
            "hint": "Vật → あります"
          },
          {
            "q": "アンナ：かばんの{中|なか}に＿＿。　〔Anna:kaban no naka ni __.〕",
            "answers": [
              "あります"
            ],
            "hint": "Tồn tại"
          },
          {
            "q": "パク：お{皿|さら}も{洗|あら}い＿＿か。　〔Paku:osara mo arai__ ka.〕",
            "answers": [
              "ましょう"
            ],
            "hint": "Đề nghị giúp"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-ht2-sx",
        "title": "Hội thoại 2 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: nhờ → nhận lời + hỏi → trả lời → đề nghị giúp thêm.",
            "chips": [
              "お{皿|さら}も{洗|あら}いましょうか。",
              "パクさん、すみませんが、ビールを{冷蔵庫|れいぞうこ}に{入|い}れてください。",
              "あそこのかばんの{中|なか}にあります。",
              "いいですよ。ビールはどこにありますか。"
            ],
            "answer": [
              "パクさん、すみませんが、ビールを{冷蔵庫|れいぞうこ}に{入|い}れてください。",
              "いいですよ。ビールはどこにありますか。",
              "あそこのかばんの{中|なか}にあります。",
              "お{皿|さら}も{洗|あら}いましょうか。"
            ],
            "ro": "Paku-san, sumimasen ga, biiru o reizouko ni irete kudasai. Ii desu yo. Biiru wa doko ni arimasu ka. Asoko no kaban no naka ni arimasu. Osara mo araimashou ka.."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · Hội thoại 3–4: điện thoại · cách dùng"
      },
      {
        "t": "p",
        "text": "**Tình huống 3.** Anna gọi điện cho Rin; Rin đang nấu ăn và nhờ Anna đi đón Wang."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 3 — Anna gọi điện cho Rin",
        "lines": [
          {
            "who": "アンナ",
            "role": "a",
            "text": "もしもし、リンさんですか。アンナです。",
            "ro": "Moshimoshi, Rin-san desu ka. Anna desu.",
            "vi": "A lô, có phải Rin không? Anna đây."
          },
          {
            "who": "リン",
            "role": "b",
            "text": "ああ、アンナさん。{今|いま}、{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。",
            "ro": "Aa, Anna-san. Ima, daidokoro de ryouri o tsukutte imasu.",
            "vi": "À, Anna. Bây giờ mình đang nấu ăn trong bếp."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "パーティーのじゅんびですか。{手伝|てつだ}いましょうか。",
            "ro": "Paatii no junbi desu ka. Tetsudaimashou ka.",
            "vi": "Chuẩn bị tiệc à? Để mình giúp nhé?"
          },
          {
            "who": "リン",
            "role": "b",
            "text": "いいえ、{大丈夫|だいじょうぶ}です。でも、すみませんが、ワンさんを{迎|むか}えに{行|い}ってください。",
            "ro": "Iie, daijoubu desu. Demo, sumimasen ga, Wan-san o mukaeni itte kudasai.",
            "vi": "Không, ổn rồi. Nhưng xin lỗi, hãy đi đón Wang giúp mình nhé."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "いいですよ。ワンさんはどこにいますか。",
            "ro": "Ii desu yo. Wan-san wa doko ni imasu ka.",
            "vi": "Được thôi. Wang đang ở đâu?"
          },
          {
            "who": "リン",
            "role": "b",
            "text": "{改札|かいさつ}の{前|まえ}にいます。",
            "ro": "Kaisatsu no mae ni imasu.",
            "vi": "Anh ấy ở trước cổng soát vé."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "わかりました。",
            "ro": "Wakarimashita.",
            "vi": "Mình hiểu rồi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-ht3-hieu",
        "title": "Hội thoại 3 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Rin đang làm gì?",
            "options": [
              "Nấu ăn trong bếp",
              "Đón Wang",
              "Rửa đĩa",
              "Gọi điện cho Wang"
            ],
            "correct": 0,
            "why": "台所で 料理を 作って います."
          },
          {
            "q": "Anna đề nghị gì?",
            "options": [
              "Đi đón Wang",
              "Giúp Rin chuẩn bị tiệc",
              "Mua bia",
              "Nấu thay Rin"
            ],
            "correct": 1,
            "why": "手伝いましょうか."
          },
          {
            "q": "Rin nhận hay từ chối đề nghị giúp?",
            "options": [
              "Nhờ Anna nấu",
              "Không trả lời",
              "Nhận lời",
              "Từ chối (nhưng nhờ việc khác)"
            ],
            "correct": 3,
            "why": "いいえ、大丈夫です + nhờ đón Wang."
          },
          {
            "q": "Rin nhờ Anna làm gì?",
            "options": [
              "Rửa đĩa",
              "Đi đón Wang",
              "Mua muối",
              "Mở cửa sổ"
            ],
            "correct": 1,
            "why": "迎えに 行って ください."
          },
          {
            "q": "Wang đang ở đâu?",
            "options": [
              "Trong bếp",
              "Ở nhà Rin",
              "Trước cổng soát vé",
              "Trước đồn công an"
            ],
            "correct": 2,
            "why": "改札の 前に います."
          },
          {
            "q": "Tại sao nói 「ワンさん は います」 (không phải あります)?",
            "options": [
              "Vì Wang là người",
              "Vì là cổng soát vé",
              "Vì Wang là khách",
              "Vì Wang đứng yên"
            ],
            "correct": 0,
            "why": "Người → います."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-ht3-dien",
        "title": "Hội thoại 3 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "リン：{台所|だいどころ}＿＿{料理|りょうり}を{作|つく}っています。　〔Rin:daidokoro__ ryouri o tsukutte imasu.〕",
            "answers": [
              "で"
            ],
            "hint": "Nơi làm hành động"
          },
          {
            "q": "アンナ：{手伝|てつだ}い＿＿か。　〔Anna:tetsudai__ ka.〕",
            "answers": [
              "ましょう"
            ],
            "hint": "Đề nghị giúp"
          },
          {
            "q": "リン：ワンさんを{迎|むか}えに{行|い}って＿＿。　〔Rin:wansan o mukaeni itte __.〕",
            "answers": [
              "ください"
            ],
            "hint": "Nhờ"
          },
          {
            "q": "リン：{改札|かいさつ}の{前|まえ}に＿＿。　〔Rin:kaisatsu no mae ni __.〕",
            "answers": [
              "います"
            ],
            "hint": "Người → います"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-ht3-sx",
        "title": "Hội thoại 3 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: gọi điện → Rin đang nấu → đề nghị giúp → nhờ đi đón.",
            "chips": [
              "{今|いま}、{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。",
              "{手伝|てつだ}いましょうか。",
              "ワンさんを{迎|むか}えに{行|い}ってください。",
              "もしもし、リンさんですか。アンナです。"
            ],
            "answer": [
              "もしもし、リンさんですか。アンナです。",
              "{今|いま}、{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。",
              "{手伝|てつだ}いましょうか。",
              "ワンさんを{迎|むか}えに{行|い}ってください。"
            ],
            "ro": "Moshimoshi, Rin-san desu ka. Anna desu. Ima, daidokoro de ryouri o tsukutte imasu. Tetsudaimashou ka. Wan-san o mukaeni itte kudasai.."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 4.** Daniel không biết dùng lò vi sóng; Rin chỉ cách."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 4 — Daniel hỏi cách dùng lò vi sóng",
        "lines": [
          {
            "who": "ダニエル",
            "role": "a",
            "text": "リンさん、この{電子|でんし}レンジの{使|つか}い{方|かた}がわかりません。",
            "ro": "Rin-san, kono denshirenji no tsukaikata ga wakarimasen.",
            "vi": "Rin, mình không biết cách dùng lò vi sóng này."
          },
          {
            "who": "リン",
            "role": "b",
            "text": "どれですか。",
            "ro": "Dore desu ka.",
            "vi": "Cái nào vậy?"
          },
          {
            "who": "ダニエル",
            "role": "a",
            "text": "これです。ピザを{入|い}れたいです。",
            "ro": "Kore desu. Piza o iretai desu.",
            "vi": "Cái này. Mình muốn cho pizza vào."
          },
          {
            "who": "リン",
            "role": "b",
            "text": "ああ、これですか。{教|おし}えましょう。ピザを{入|い}れて、ドアを{閉|し}めてください。",
            "ro": "Aa, kore desu ka. Oshiemashou. Piza o irete, doa o shimete kudasai.",
            "vi": "À, cái này à. Để mình chỉ. Hãy cho pizza vào rồi đóng cửa lại."
          },
          {
            "who": "ダニエル",
            "role": "a",
            "text": "はい。ありがとうございます。",
            "ro": "Hai. Arigatou gozaimasu.",
            "vi": "Vâng. Cảm ơn bạn."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-ht4-hieu",
        "title": "Hội thoại 4 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Daniel không biết điều gì?",
            "options": [
              "Cách đọc chữ Hán",
              "Cách nấu cà ri",
              "Cách dùng lò vi sóng",
              "Đường đến ga"
            ],
            "correct": 2,
            "why": "使い方が わかりません."
          },
          {
            "q": "「どれ ですか」 Rin hỏi gì?",
            "options": [
              "Ở đâu",
              "Mấy cái",
              "Là cái nào",
              "Ai dùng"
            ],
            "correct": 2,
            "why": "どれ = cái nào."
          },
          {
            "q": "Daniel trả lời Rin thế nào?",
            "options": [
              "あれ です",
              "どれ です",
              "それ です",
              "これ です (cái này)"
            ],
            "correct": 3,
            "why": "Cái ở gần người nói → これ."
          },
          {
            "q": "Thứ tự thao tác Rin chỉ?",
            "options": [
              "Đóng cửa rồi cho pizza vào",
              "Cho pizza vào rồi đóng cửa",
              "Mở cửa rồi lấy pizza ra",
              "Chỉ cần bật nút"
            ],
            "correct": 1,
            "why": "ピザを 入れて、 ドアを 閉めて ください."
          },
          {
            "q": "Chữ 「ああ」 ở đầu câu của Rin có ý gì?",
            "options": [
              "Hỏi lại",
              "Xin lỗi",
              "Từ chối",
              "À, ra thế (nhận ra)"
            ],
            "correct": 3,
            "why": "ああ = à (nhận ra)."
          },
          {
            "q": "「教えましょう」 nghĩa là gì?",
            "options": [
              "Mình không chỉ",
              "Mình đang chỉ",
              "Để mình chỉ nhé",
              "Hãy chỉ cho mình"
            ],
            "correct": 2,
            "why": "Vましょう = để tôi làm."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-ht4-dien",
        "title": "Hội thoại 4 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ダニエル：この{電子|でんし}レンジの{使|つか}い＿＿がわかりません。　〔Danieru:kono denshirenji no tsukai__ ga wakarimasen.〕",
            "answers": [
              "方",
              "かた"
            ],
            "hint": "Cách dùng"
          },
          {
            "q": "リン：＿＿ですか。　〔Rin:__ desu ka.〕",
            "answers": [
              "どれ"
            ],
            "hint": "Cái nào"
          },
          {
            "q": "ダニエル：ピザを{入|い}れたいです。＿＿です。　〔Danieru:piza o iretai desu. __ desu.〕",
            "answers": [
              "これ"
            ],
            "hint": "Cái này"
          },
          {
            "q": "リン：ピザを{入|い}れ＿＿、ドアを{閉|し}めてください。　〔Rin:piza o ire__, doa o shimete kudasai.〕",
            "answers": [
              "て"
            ],
            "hint": "Nối hành động"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-ht4-sx",
        "title": "Hội thoại 4 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: không biết cách dùng → cái nào? → cái này → chỉ dẫn.",
            "chips": [
              "リンさん、この{電子|でんし}レンジの{使|つか}い{方|かた}がわかりません。",
              "どれですか。",
              "ピザを{入|い}れて、ドアを{閉|し}めてください。",
              "これです。"
            ],
            "answer": [
              "リンさん、この{電子|でんし}レンジの{使|つか}い{方|かた}がわかりません。",
              "どれですか。",
              "これです。",
              "ピザを{入|い}れて、ドアを{閉|し}めてください。"
            ],
            "ro": "Rin-san, kono denshirenji no tsukaikata ga wakarimasen. Dore desu ka. Kore desu. Piza o irete, doa o shimete kudasai.?"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · Hội thoại 5 dài hơn + tự nói"
      },
      {
        "t": "p",
        "text": "**Tình huống 5.** Bữa tiệc đang vui: có người đàn, có người hát, nhưng bia đã hết."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 5 — Ở bữa tiệc: đàn hát và bia hết",
        "lines": [
          {
            "who": "ワン",
            "role": "a",
            "text": "ギターを{弾|ひ}きましょうか。",
            "ro": "Gitaa o hikimashou ka.",
            "vi": "Để mình chơi ghi ta nhé?"
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "いいですね。だれが{歌|うた}いますか。",
            "ro": "Ii desu ne. Dare ga utaimasu ka.",
            "vi": "Hay đấy. Ai hát?"
          },
          {
            "who": "アンナ",
            "role": "c",
            "text": "{私|わたし}が{歌|うた}います。",
            "ro": "Watashi ga utaimasu.",
            "vi": "Mình hát."
          },
          {
            "who": "パク",
            "role": "b",
            "text": "ビールはまだありますか。",
            "ro": "Biiru wa mada arimasu ka.",
            "vi": "Còn bia không?"
          },
          {
            "who": "リン",
            "role": "c",
            "text": "いいえ、もうありません。{買|か}って{来|き}ましょうか。",
            "ro": "Iie, mou arimasen. Katte kimashou ka.",
            "vi": "Không, hết rồi. Để mình đi mua nhé?"
          },
          {
            "who": "パク",
            "role": "b",
            "text": "お{願|ねが}いします。{駅|えき}の{前|まえ}に{自動販売機|じどうはんばいき}がありますよ。",
            "ro": "Onegai shimasu. Eki no mae ni jidouhanbaiki ga arimasu yo.",
            "vi": "Nhờ bạn. Trước ga có máy bán hàng tự động đấy."
          },
          {
            "who": "リン",
            "role": "c",
            "text": "わかりました。{行|い}って{来|き}ます。",
            "ro": "Wakarimashita. Itte kimasu.",
            "vi": "Mình hiểu rồi. Mình đi rồi về."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-ht5-hieu",
        "title": "Hội thoại 5 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Ai đề nghị chơi ghi ta?",
            "options": [
              "Anna",
              "Rin",
              "Marco",
              "Wang"
            ],
            "correct": 3,
            "why": "ギターを 弾きましょうか (ワン)."
          },
          {
            "q": "Ai sẽ hát?",
            "options": [
              "Wang",
              "Anna",
              "Park",
              "Marco"
            ],
            "correct": 1,
            "why": "私が 歌います (アンナ)."
          },
          {
            "q": "Bia còn không?",
            "options": [
              "Còn ít",
              "Còn nhiều",
              "Chưa có",
              "Hết rồi"
            ],
            "correct": 3,
            "why": "もう ありません."
          },
          {
            "q": "Rin đề nghị gì?",
            "options": [
              "Gọi điện",
              "Mở cửa sổ",
              "Đi mua bia",
              "Rửa đĩa"
            ],
            "correct": 2,
            "why": "買って 来ましょうか."
          },
          {
            "q": "Park cho biết điều gì về nơi mua?",
            "options": [
              "Trước ga có máy bán hàng tự động",
              "Gần nhà có siêu thị",
              "Ở đồn công an có bia",
              "Không có chỗ mua"
            ],
            "correct": 0,
            "why": "駅の前に 自動販売機が あります."
          },
          {
            "q": "Chữ よ trong 「ありますよ」 có tác dụng gì?",
            "options": [
              "Từ chối",
              "Xin đồng cảm",
              "Báo cho Rin biết",
              "Hỏi Rin"
            ],
            "correct": 2,
            "why": "よ = báo cho biết."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b7-ht5-dien",
        "title": "Hội thoại 5 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ワン：ギターを{弾|ひ}き＿＿か。　〔Wan:gitaa o hiki__ ka.〕",
            "answers": [
              "ましょう"
            ],
            "hint": "Đề nghị"
          },
          {
            "q": "マルコ：だれ＿＿{歌|うた}いますか。　〔Maruko:dare__ utaimasu ka.〕",
            "answers": [
              "が"
            ],
            "hint": "だれが"
          },
          {
            "q": "パク：ビールは＿＿ありますか。　〔Paku:biiru wa __ arimasu ka.〕",
            "answers": [
              "まだ"
            ],
            "hint": "Còn không"
          },
          {
            "q": "リン：いいえ、＿＿ありません。　〔Rin:iie, __ arimasen.〕",
            "answers": [
              "もう"
            ],
            "hint": "Hết"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-ht5-sx",
        "title": "Hội thoại 5 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi còn bia → hết → đề nghị đi mua → nhờ + báo máy bán hàng.",
            "chips": [
              "いいえ、もうありません。",
              "お{願|ねが}いします。{駅|えき}の{前|まえ}に{自動販売機|じどうはんばいき}がありますよ。",
              "ビールはまだありますか。",
              "{買|か}って{来|き}ましょうか。"
            ],
            "answer": [
              "ビールはまだありますか。",
              "いいえ、もうありません。",
              "{買|か}って{来|き}ましょうか。",
              "お{願|ねが}いします。{駅|えき}の{前|まえ}に{自動販売機|じどうはんばいき}がありますよ。"
            ],
            "ro": "Biiru wa mada arimasu ka. Iie, mou arimasen. Katte kimashou ka. Onegai shimasu. Eki no mae ni jidouhanbaiki ga arimasu yo.."
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
          "Thay từ: しょうゆ → 砂糖／塩; 冷蔵庫の上 → 台所の中／テーブルの下; 洗いましょうか → 開けましょうか／持って来ましょうか."
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 1 — Hỏi đồ ở đâu",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "すみません、しょうゆはどこにありますか。",
            "ro": "Sumimasen, shouyu wa doko ni arimasu ka.",
            "vi": "Xin lỗi, xì dầu ở đâu vậy?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{冷蔵庫|れいぞうこ}の{上|うえ}にあります。",
            "ro": "Reizouko no ue ni arimasu.",
            "vi": "Ở trên tủ lạnh."
          },
          {
            "who": "A",
            "role": "a",
            "text": "ああ、これですか。ありがとう。",
            "ro": "Aa, kore desu ka. Arigatou.",
            "vi": "À, cái này à. Cảm ơn."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 2 — Nhờ và nhận lời",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "すみませんが、{塩|しお}を{取|と}ってください。",
            "ro": "Sumimasen ga, shio o totte kudasai.",
            "vi": "Xin lỗi, hãy lấy giúp mình muối."
          },
          {
            "who": "B",
            "role": "b",
            "text": "いいですよ。はい、どうぞ。",
            "ro": "Ii desu yo. Hai, douzo.",
            "vi": "Được thôi. Đây ạ."
          },
          {
            "who": "A",
            "role": "a",
            "text": "ありがとうございます。",
            "ro": "Arigatou gozaimasu.",
            "vi": "Cảm ơn bạn."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 3 — Đề nghị giúp và nhận/từ chối",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "お{皿|さら}を{洗|あら}いましょうか。",
            "ro": "Osara o araimashou ka.",
            "vi": "Để mình rửa đĩa nhé?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "ありがとうございます。お{願|ねが}いします。",
            "ro": "Arigatou gozaimasu. Onegai shimasu.",
            "vi": "Cảm ơn. Nhờ bạn."
          },
          {
            "who": "A",
            "role": "a",
            "text": "じゃあ、{手伝|てつだ}いますよ。",
            "ro": "Jaa, tetsudai masu yo.",
            "vi": "Vậy mình giúp nhé."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 4 — Điện thoại: bạn đang làm gì?",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "もしもし、{今|いま}、{何|なに}をしていますか。",
            "ro": "Moshimoshi, ima, nani o shite imasu ka.",
            "vi": "A lô, bây giờ bạn đang làm gì?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{台所|だいどころ}でご{飯|はん}を{作|つく}っています。",
            "ro": "Daidokoro de gohan o tsukutte imasu.",
            "vi": "Mình đang nấu cơm ở bếp."
          },
          {
            "who": "A",
            "role": "a",
            "text": "そうですか。{手伝|てつだ}いましょうか。",
            "ro": "Sou desu ka. Tetsudaimashou ka.",
            "vi": "Vậy à. Để mình giúp nhé?"
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b7-ht-noi",
        "part": "1",
        "questions": [
          "すみません、 しおは どこに ありますか。",
          "すみませんが、 まどを あけて ください。",
          "おさらを あらいましょうか。",
          "いま、 なにを して いますか。",
          "この でんしレンジの つかいかたが わかりません。 おしえて ください。",
          "ビールは まだ ありますか。",
          "だれが ギターを ひいて いますか。"
        ]
      }
    ]
  },
  {
    "id": "lt-b7-doc-hieu",
    "kind": "reading",
    "title": "Luyện thêm Bài 7 · Đọc hiểu — 4 đoạn dài dần + 4 đoạn KHÔNG furigana (~43 câu)",
    "goal": "Đọc hiểu đoạn văn về vị trí đồ vật, chuẩn bị tiệc, thư nhờ giúp và công thức nấu ăn: tìm đúng ai–ở đâu–làm gì, hiểu chuỗi V て ください, và đọc đoạn không furigana như đề thi.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đọc **2 lượt**: lượt 1 để biết bối cảnh (ở đâu, ai); lượt 2 tìm chi tiết (vị trí, giờ, số, thứ tự bước). Với Đúng/Sai, đối chiếu từng chữ trong đoạn.",
          "Đoạn 4 là văn bản hướng dẫn: chuỗi **V て、V て、V て ください** — mỗi thể て là MỘT bước, đọc đến hết câu mới biết cả chuỗi là lời nhờ.",
          "Mức Khó dùng **readkanji** không furigana: chỉ có chữ Hán đã học đến Bài 7, còn lại là hiragana. Đọc to, rồi bấm xem."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đoạn 1 — vị trí đồ vật"
      },
      {
        "t": "passage",
        "title": "Đoạn 1 — Căn phòng của Anna",
        "intro": "Có furigana. Vẽ nhanh căn phòng ra giấy khi đọc.",
        "paras": [
          {
            "label": "A",
            "text": "アンナさんのへやにテーブルがあります。テーブルの{上|うえ}に{花|はな}があります。テーブルの{下|した}に{犬|いぬ}がいます。テーブルの{横|よこ}にいすが{四|よっ}つあります。{窓|まど}の{外|そと}に{木|き}があります。へやに{誰|だれ}もいません。"
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
            "en": "アンナさんのへやにテーブルがあります。",
            "ro": "Anna-san no heya ni teeburu ga arimasu.",
            "vi": "Trong phòng Anna có một cái bàn."
          },
          {
            "en": "テーブルの{上|うえ}に{花|はな}があります。",
            "ro": "Teeburu no ue ni hana ga arimasu.",
            "vi": "Trên bàn có hoa."
          },
          {
            "en": "テーブルの{下|した}に{犬|いぬ}がいます。",
            "ro": "Teeburu no shita ni inu ga imasu.",
            "vi": "Dưới bàn có một con chó."
          },
          {
            "en": "テーブルの{横|よこ}にいすが{四|よっ}つあります。",
            "ro": "Teeburu no yoko ni isu ga yottsu arimasu.",
            "vi": "Bên cạnh bàn có 4 cái ghế."
          },
          {
            "en": "{窓|まど}の{外|そと}に{木|き}があります。",
            "ro": "Mado no soto ni ki ga arimasu.",
            "vi": "Ngoài cửa sổ có một cái cây."
          },
          {
            "en": "へやに{誰|だれ}もいません。",
            "ro": "Heya ni dare mo imasen.",
            "vi": "Trong phòng không có ai."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-doc1-q",
        "title": "Đoạn 1 — câu hỏi (6 câu)",
        "items": [
          {
            "q": "Trên bàn có hoa.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 0,
            "why": "テーブルの 上に 花が あります."
          },
          {
            "q": "Con chó ở trên bàn.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "犬は テーブルの 下に います."
          },
          {
            "q": "Bên cạnh bàn có mấy cái ghế?",
            "options": [
              "3 cái",
              "4 cái",
              "2 cái",
              "5 cái"
            ],
            "correct": 1,
            "why": "いすが 四つ."
          },
          {
            "q": "Cái cây ở đâu?",
            "options": [
              "Trong phòng",
              "Dưới bàn",
              "Trên bàn",
              "Ngoài cửa sổ"
            ],
            "correct": 3,
            "why": "窓の 外に 木が あります."
          },
          {
            "q": "Trong phòng có người.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "誰も いません = không có ai."
          },
          {
            "q": "Vì sao nói 「犬が います」 mà không nói 「犬が あります」?",
            "options": [
              "Vì chó là của Anna",
              "Vì chó ở dưới bàn",
              "Vì chó to",
              "Vì chó là con vật"
            ],
            "correct": 3,
            "why": "Con vật → います."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đoạn 2–3 — bữa tiệc & thư nhờ giúp"
      },
      {
        "t": "passage",
        "title": "Đoạn 2 — Chuẩn bị tiệc ở nhà Rin",
        "intro": "Chú ý ai làm gì, ở đâu, và bia còn hay hết.",
        "paras": [
          {
            "label": "A",
            "text": "{今日|きょう}、リンさんのうちでパーティーがあります。みんな{台所|だいどころ}で{料理|りょうり}をしています。アンナさんはお{皿|さら}を{洗|あら}っています。パクさんはナイフで{肉|にく}を{切|き}っています。"
          },
          {
            "label": "B",
            "text": "ワンさんはギターを{弾|ひ}いています。マルコさんは{窓|まど}を{開|あ}けています。{冷蔵庫|れいぞうこ}の{中|なか}にビールはもうありません。ダニエルさんが{駅|えき}の{前|まえ}の{自動販売機|じどうはんばいき}へ{買|か}いに{行|い}きます。"
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
            "en": "{今日|きょう}、リンさんのうちでパーティーがあります。",
            "ro": "Kyou, Rin-san no uchi de paatii ga arimasu.",
            "vi": "Hôm nay ở nhà Rin có tiệc."
          },
          {
            "en": "みんな{台所|だいどころ}で{料理|りょうり}をしています。",
            "ro": "Minna daidokoro de ryouri o shite imasu.",
            "vi": "Mọi người đang nấu ăn ở bếp."
          },
          {
            "en": "アンナさんはお{皿|さら}を{洗|あら}っています。",
            "ro": "Anna-san wa osara o aratte imasu.",
            "vi": "Anna đang rửa đĩa."
          },
          {
            "en": "パクさんはナイフで{肉|にく}を{切|き}っています。",
            "ro": "Paku-san wa naifu de niku o kitte imasu.",
            "vi": "Park đang cắt thịt bằng dao."
          },
          {
            "en": "ワンさんはギターを{弾|ひ}いています。",
            "ro": "Wan-san wa gitaa o hiite imasu.",
            "vi": "Wang đang chơi ghi ta."
          },
          {
            "en": "マルコさんは{窓|まど}を{開|あ}けています。",
            "ro": "Maruko-san wa mado o akete imasu.",
            "vi": "Marco đang mở cửa sổ."
          },
          {
            "en": "{冷蔵庫|れいぞうこ}の{中|なか}にビールはもうありません。",
            "ro": "Reizouko no naka ni biiru wa mou arimasen.",
            "vi": "Trong tủ lạnh không còn bia nữa."
          },
          {
            "en": "ダニエルさんが{駅|えき}の{前|まえ}の{自動販売機|じどうはんばいき}へ{買|か}いに{行|い}きます。",
            "ro": "Danieru-san ga eki no mae no jidouhanbaiki e kaini ikimasu.",
            "vi": "Daniel sẽ đi mua ở máy bán hàng tự động trước ga."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-doc2-q",
        "title": "Đoạn 2 — câu hỏi (7 câu)",
        "items": [
          {
            "q": "Bữa tiệc diễn ra ở đâu?",
            "options": [
              "Ở nhà Rin",
              "Ở trường đại học",
              "Ở nhà Anna",
              "Ở công viên"
            ],
            "correct": 0,
            "why": "リンさんの うちで パーティー."
          },
          {
            "q": "Ai đang cắt thịt?",
            "options": [
              "Wang",
              "Marco",
              "Park",
              "Anna"
            ],
            "correct": 2,
            "why": "パクさんは … 肉を 切って います."
          },
          {
            "q": "Park cắt thịt bằng gì?",
            "options": [
              "Bằng dao",
              "Bằng đũa",
              "Bằng thìa",
              "Bằng dĩa"
            ],
            "correct": 0,
            "why": "ナイフで."
          },
          {
            "q": "Ai đang chơi ghi ta?",
            "options": [
              "Park",
              "Anna",
              "Daniel",
              "Wang"
            ],
            "correct": 3,
            "why": "ワンさんは ギターを 弾いて います."
          },
          {
            "q": "Trong tủ lạnh vẫn còn bia.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "ビールは もう ありません = hết rồi."
          },
          {
            "q": "Ai sẽ đi mua?",
            "options": [
              "Rin",
              "Wang",
              "Daniel",
              "Anna"
            ],
            "correct": 2,
            "why": "ダニエルさんが 買いに 行きます."
          },
          {
            "q": "Anna đang làm gì?",
            "options": [
              "Chơi ghi ta",
              "Mở cửa sổ",
              "Rửa đĩa",
              "Cắt thịt"
            ],
            "correct": 2,
            "why": "お皿を 洗って います."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đoạn 3 — Thư của Rin: nhờ giúp chuẩn bị tiệc",
        "intro": "Tìm: ngày – giờ – nhờ việc gì – nhà Rin ở đâu.",
        "paras": [
          {
            "label": "A",
            "text": "アンナさんへ{土曜日|どようび}、{私|わたし}のうちでパーティーがあります。{十二時|じゅうにじ}に{来|き}てください。{私|わたし}のうちは{交番|こうばん}の{隣|となり}です。"
          },
          {
            "label": "B",
            "text": "すみませんが、ビールを{持|も}って{来|き}てください。ビールは{駅|えき}の{前|まえ}の{店|みせ}にたくさんあります。そして、お{皿|さら}を{洗|あら}ってください。{台所|だいどころ}にスポンジがあります。よろしくお{願|ねが}いします。リン"
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
            "en": "アンナさんへ",
            "ro": "Anna-san e",
            "vi": "Gửi Anna,"
          },
          {
            "en": "{土曜日|どようび}、{私|わたし}のうちでパーティーがあります。",
            "ro": "Doyoubi, watashi no uchi de paatii ga arimasu.",
            "vi": "Thứ Bảy ở nhà mình có tiệc."
          },
          {
            "en": "{十二時|じゅうにじ}に{来|き}てください。",
            "ro": "Juuniji ni kite kudasai.",
            "vi": "Hãy đến lúc 12 giờ nhé."
          },
          {
            "en": "{私|わたし}のうちは{交番|こうばん}の{隣|となり}です。",
            "ro": "Watashi no uchi wa kouban no tonari desu.",
            "vi": "Nhà mình ở cạnh đồn công an."
          },
          {
            "en": "すみませんが、ビールを{持|も}って{来|き}てください。",
            "ro": "Sumimasen ga, biiru o motte kite kudasai.",
            "vi": "Xin lỗi, hãy mang bia đến giúp mình nhé."
          },
          {
            "en": "ビールは{駅|えき}の{前|まえ}の{店|みせ}にたくさんあります。",
            "ro": "Biiru wa eki no mae no mise ni takusan arimasu.",
            "vi": "Bia có rất nhiều ở cửa hàng trước ga."
          },
          {
            "en": "そして、お{皿|さら}を{洗|あら}ってください。",
            "ro": "Soshite, osara o aratte kudasai.",
            "vi": "Và hãy rửa đĩa giúp mình nữa."
          },
          {
            "en": "{台所|だいどころ}にスポンジがあります。",
            "ro": "Daidokoro ni suponji ga arimasu.",
            "vi": "Ở bếp có miếng bọt biển."
          },
          {
            "en": "よろしくお{願|ねが}いします。",
            "ro": "Yoroshiku onegai shimasu.",
            "vi": "Rất mong nhờ bạn."
          },
          {
            "en": "リン",
            "ro": "Rin",
            "vi": "Rin"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-doc3-q",
        "title": "Đoạn 3 — câu hỏi (9 câu)",
        "items": [
          {
            "q": "Rin mời Anna đến lúc mấy giờ?",
            "options": [
              "2 giờ",
              "9 giờ",
              "12 giờ",
              "10 giờ"
            ],
            "correct": 2,
            "why": "十二時に 来て ください."
          },
          {
            "q": "Nhà Rin ở đâu?",
            "options": [
              "Ở cạnh công viên",
              "Ở trên đồi",
              "Ở cạnh đồn công an",
              "Trước ga"
            ],
            "correct": 2,
            "why": "交番の 隣."
          },
          {
            "q": "Rin nhờ Anna mang gì đến?",
            "options": [
              "Hoa",
              "Dao",
              "Đĩa",
              "Bia"
            ],
            "correct": 3,
            "why": "ビールを 持って 来て ください."
          },
          {
            "q": "Mua bia ở đâu được?",
            "options": [
              "Ở bưu điện",
              "Ở cửa hàng trước ga",
              "Ở đồn công an",
              "Ở nhà Rin"
            ],
            "correct": 1,
            "why": "駅の 前の 店に たくさん あります."
          },
          {
            "q": "Rin còn nhờ Anna làm việc gì ở nhà?",
            "options": [
              "Nấu cơm",
              "Mở cửa sổ",
              "Rửa đĩa",
              "Chơi ghi ta"
            ],
            "correct": 2,
            "why": "お皿を 洗って ください."
          },
          {
            "q": "Bữa tiệc diễn ra vào Chủ nhật.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "土曜日 = thứ Bảy."
          },
          {
            "q": "Ở bếp có miếng bọt biển.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 0,
            "why": "台所に スポンジが あります."
          },
          {
            "q": "「すみませんが」 ở đầu câu nhờ để làm gì?",
            "options": [
              "Để xin lỗi vì muộn",
              "Để hỏi đường",
              "Để câu nhờ lịch sự hơn",
              "Để từ chối"
            ],
            "correct": 2,
            "why": "すみませんが + V て ください."
          },
          {
            "q": "「持って 来て ください」 nghĩa là gì?",
            "options": [
              "Hãy mang đi",
              "Hãy lấy ra",
              "Hãy mang đến",
              "Hãy cầm giúp"
            ],
            "correct": 2,
            "why": "持って来る = mang đến."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đoạn 4 dài + đoạn không furigana"
      },
      {
        "t": "passage",
        "title": "Đoạn 4 — Cách nấu cà ri",
        "intro": "Văn bản hướng dẫn: nhiều V て ください nối tiếp. Chú ý thứ tự các bước.",
        "paras": [
          {
            "label": "A",
            "text": "カレーの{作|つく}り{方|かた}①{野菜|やさい}と{肉|にく}をナイフで{切|き}ってください。②フライパンに{肉|にく}を{入|い}れてください。③{野菜|やさい}と{水|みず}を{入|い}れてください。"
          },
          {
            "label": "B",
            "text": "④{三十分|さんじゅっぷん}ぐらい{待|ま}ってください。⑤{塩|しお}とカレーを{入|い}れてください。⑥ご{飯|はん}の{上|うえ}にカレーを{入|い}れて、スプーンで{食|た}べてください。"
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
            "en": "カレーの{作|つく}り{方|かた}",
            "ro": "Karee no tsukurikata",
            "vi": "Cách nấu cà ri"
          },
          {
            "en": "①{野菜|やさい}と{肉|にく}をナイフで{切|き}ってください。",
            "ro": "(1)yasai to niku o naifu de kitte kudasai.",
            "vi": "① Hãy cắt rau và thịt bằng dao."
          },
          {
            "en": "②フライパンに{肉|にく}を{入|い}れてください。",
            "ro": "(2)furaipan ni niku o irete kudasai.",
            "vi": "② Hãy cho thịt vào chảo."
          },
          {
            "en": "③{野菜|やさい}と{水|みず}を{入|い}れてください。",
            "ro": "(3)yasai to mizu o irete kudasai.",
            "vi": "③ Hãy cho rau và nước vào."
          },
          {
            "en": "④{三十分|さんじゅっぷん}ぐらい{待|ま}ってください。",
            "ro": "(4)sanjuppun gurai matte kudasai.",
            "vi": "④ Hãy đợi khoảng 30 phút."
          },
          {
            "en": "⑤{塩|しお}とカレーを{入|い}れてください。",
            "ro": "(5)shio to karee o irete kudasai.",
            "vi": "⑤ Hãy cho muối và bột cà ri vào."
          },
          {
            "en": "⑥ご{飯|はん}の{上|うえ}にカレーを{入|い}れて、スプーンで{食|た}べてください。",
            "ro": "(6)gohan no ue ni karee o irete, supuun de tabete kudasai.",
            "vi": "⑥ Hãy cho cà ri lên cơm rồi ăn bằng thìa."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-doc4-q",
        "title": "Đoạn 4 — câu hỏi (9 câu)",
        "items": [
          {
            "q": "Cắt rau và thịt bằng gì?",
            "options": [
              "Bằng dao",
              "Bằng thìa",
              "Bằng dĩa",
              "Bằng đũa"
            ],
            "correct": 0,
            "why": "ナイフで 切って."
          },
          {
            "q": "Bước ② cho gì vào chảo?",
            "options": [
              "Nước",
              "Rau",
              "Muối",
              "Thịt"
            ],
            "correct": 3,
            "why": "肉を 入れて."
          },
          {
            "q": "Bước ③ cho những gì vào?",
            "options": [
              "Muối và cà ri",
              "Rau và nước",
              "Rau và muối",
              "Thịt và nước"
            ],
            "correct": 1,
            "why": "野菜と 水."
          },
          {
            "q": "Phải đợi bao lâu?",
            "options": [
              "Khoảng 13 phút",
              "Khoảng 30 phút",
              "Khoảng 3 giờ",
              "Khoảng 3 phút"
            ],
            "correct": 1,
            "why": "三十分 (さんじゅっぷん)."
          },
          {
            "q": "Bước nào cho muối và bột cà ri vào?",
            "options": [
              "Bước ⑤",
              "Bước ⑥",
              "Bước ②",
              "Bước ③"
            ],
            "correct": 0,
            "why": "⑤塩と カレーを 入れて."
          },
          {
            "q": "Cuối cùng ăn cà ri bằng gì?",
            "options": [
              "Bằng thìa",
              "Bằng dao",
              "Bằng đũa",
              "Bằng dĩa"
            ],
            "correct": 0,
            "why": "スプーンで 食べて ください."
          },
          {
            "q": "Bước ① dùng thìa để cắt.",
            "options": [
              "Đúng",
              "Sai"
            ],
            "correct": 1,
            "why": "ナイフで 切って (dùng dao)."
          },
          {
            "q": "Tiêu đề 「作り方」 nghĩa là gì?",
            "options": [
              "Thời gian làm",
              "Cách làm",
              "Người làm",
              "Nơi làm"
            ],
            "correct": 1,
            "why": "作り + 方."
          },
          {
            "q": "Thứ tự đúng của các bước là?",
            "options": [
              "① đợi → ② cắt → ③ ăn → …",
              "① cắt → ② cho thịt → ③ cho rau, nước → ④ đợi → ⑤ muối, cà ri → ⑥ ăn",
              "① cho muối → ② cắt → ③ đợi → …",
              "① ăn → ② cắt → ③ cho rau → …"
            ],
            "correct": 1,
            "why": "Theo số thứ tự ①–⑥."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b7-doc-rk",
        "title": "Đọc to 4 đoạn KHÔNG furigana, rồi bấm xem (4 đoạn)",
        "note": "Đọc cả câu to, kể cả hiragana. Sau đó làm 8 câu hỏi bên dưới.",
        "items": [
          {
            "text": "{山田|やまだ}さんのうちは{大学|だいがく}の{門|もん}の{前|まえ}にあります。うちの{中|なか}に{大|おお}きいいぬがいます。",
            "ro": "Yamadasan no uchi wa daigaku no mon no mae ni arimasu. Uchi no naka ni ookii inu ga imasu.",
            "vi": "Nhà anh Yamada ở trước cổng đại học. Trong nhà có một con chó lớn."
          },
          {
            "text": "{今日|きょう}は{料理|りょうり}の{日|ひ}です。{野菜|やさい}と{肉|にく}を{小|ちい}さくきってください。",
            "ro": "Kyou wa ryouri no hi desu. Yasai to niku o chiisaku kitte kudasai.",
            "vi": "Hôm nay là ngày nấu ăn. Hãy cắt rau và thịt thành miếng nhỏ."
          },
          {
            "text": "{大|おお}きいお{寺|てら}が{東京|とうきょう}にあります。{八時半|はちじはん}に{門|もん}があきます。{力|ちから}がある{人|ひと}は{半分|はんぶん}もってください。",
            "ro": "Ookii otera ga toukyou ni arimasu. Hachijihan ni mon ga akimasu. Chikara ga aru hito wa hanbun motte kudasai.",
            "vi": "Ở Tokyo có ngôi chùa lớn. 8 giờ rưỡi cổng mở. Người có sức hãy mang giúp một nửa."
          },
          {
            "text": "{先生|せんせい}は{毎日|まいにち}{会社|かいしゃ}で{日本語|にほんご}をおしえています。{水曜日|すいようび}と{金曜日|きんようび}は{大学|だいがく}へ{行|い}きます。",
            "ro": "Sensei wa mainichi kaisha de nihongo o oshiete imasu. Suiyoubi to kin'youbi wa daigaku e ikimasu.",
            "vi": "Cô giáo mỗi ngày dạy tiếng Nhật ở công ty. Thứ Tư và thứ Sáu cô đến đại học."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-doc-rk-q",
        "title": "Câu hỏi về 4 đoạn không furigana (8 câu)",
        "items": [
          {
            "q": "(Đoạn 1) Nhà anh Yamada ở đâu?",
            "options": [
              "Trong đại học",
              "Sau cổng đại học",
              "Ngoài cổng, xa đại học",
              "Trước cổng đại học"
            ],
            "correct": 3,
            "why": "大学の 門の 前."
          },
          {
            "q": "(Đoạn 1) Trong nhà có gì?",
            "options": [
              "Một con chó lớn",
              "Một cái cây",
              "Không có gì",
              "Một con mèo"
            ],
            "correct": 0,
            "why": "大きい 犬が います."
          },
          {
            "q": "(Đoạn 2) Hôm nay là ngày gì?",
            "options": [
              "Ngày đi chùa",
              "Ngày nấu ăn",
              "Ngày nghỉ",
              "Ngày học"
            ],
            "correct": 1,
            "why": "料理の 日."
          },
          {
            "q": "(Đoạn 2) Cắt rau và thịt như thế nào?",
            "options": [
              "Thành miếng to",
              "Thành miếng nhỏ",
              "Không cắt",
              "Cắt đôi"
            ],
            "correct": 1,
            "why": "小さく 切って ください."
          },
          {
            "q": "(Đoạn 3) Cổng mở lúc mấy giờ?",
            "options": [
              "8 giờ rưỡi",
              "7 giờ rưỡi",
              "8 giờ",
              "9 giờ rưỡi"
            ],
            "correct": 0,
            "why": "八時半."
          },
          {
            "q": "(Đoạn 3) Người có sức làm gì?",
            "options": [
              "Không mang gì",
              "Mang tất cả",
              "Đợi ở cổng",
              "Mang một nửa"
            ],
            "correct": 3,
            "why": "半分 持って ください."
          },
          {
            "q": "(Đoạn 4) Cô giáo dạy ở đâu?",
            "options": [
              "Ở ga",
              "Ở đại học",
              "Ở nhà",
              "Ở công ty"
            ],
            "correct": 3,
            "why": "会社で 日本語を おしえて います."
          },
          {
            "q": "(Đoạn 4) Hai ngày nào cô đến đại học?",
            "options": [
              "Thứ Sáu và thứ Bảy",
              "Thứ Tư và thứ Bảy",
              "Thứ Hai và thứ Ba",
              "Thứ Tư và thứ Sáu"
            ],
            "correct": 3,
            "why": "水曜日と 金曜日."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b7-nghe",
    "kind": "listening",
    "title": "Luyện thêm Bài 7 · Nghe — nhờ và đề nghị → vị trí, đang làm gì, cái nào → bẫy đổi ý/số (15 đoạn, ~41 câu)",
    "goal": "Nghe ra nhận lời hay từ chối, biết đồ/người ở đâu, ai đang làm gì, nghe phân biệt これ／それ／あれ và không bị lừa khi người nói đổi giờ, đổi nơi hay đính chính.",
    "minutes": 65,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Nghe **2 lần**: lần 1 bắt ý chính (ai nhờ ai, nhận hay từ chối); lần 2 ghi **vị trí / số / giờ**. Xem lời thoại + romaji sau cùng để kiểm.",
          "Bẫy quen thuộc: **ちょっと……** rồi đề xuất khác (thông tin sau cùng mới là chốt) · **これ／それ／あれ**: người trả lời đổi cách gọi theo khoảng cách · **số** (四つ vs 五枚) · **nhiều người** (ai làm gì).",
          "Luyện shadowing: sau khi nghe, vừa bật lại vừa nói đuổi theo từng câu — rất tốt cho thi nói (ngữ điệu **V てください／ましょうか**)."
        ]
      },
      {
        "t": "recap",
        "title": "Từ khoá cần bắt tai",
        "items": [
          "**Nhờ**: すみませんが、V て ください · **nhận**: いいですよ／はい、わかりました · **từ chối**: ちょっと……／すみません、～から……",
          "**Đề nghị giúp**: Vましょうか → お願いします（nhận）／大丈夫です（từ chối）",
          "**Vị trí**: 上・下・中・外・前・後ろ・横・隣 + に あります／います · **đang làm**: V て います"
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · chậm, đơn giản — ○ hay ×"
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-1a",
        "title": "① (chậm)",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "すみませんが、{窓|まど}を{開|あ}けてください。",
            "ro": "Sumimasen ga, mado o akete kudasai.",
            "vi": "Xin lỗi, hãy mở cửa sổ giúp mình."
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "いいですよ。",
            "ro": "Ii desu yo.",
            "vi": "Được thôi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-1b",
        "title": "② (chậm)",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "すみませんが、ナイフを{貸|か}してください。",
            "ro": "Sumimasen ga, naifu o kashite kudasai.",
            "vi": "Xin lỗi, cho mình mượn con dao."
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "すみません、{私|わたし}も{使|つか}っていますから……。",
            "ro": "Sumimasen, watashi mo tsukatte imasu kara....",
            "vi": "Xin lỗi, mình cũng đang dùng nên…"
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-1c",
        "title": "③",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "お{皿|さら}を{洗|あら}いましょうか。",
            "ro": "Osara o araimashou ka.",
            "vi": "Để mình rửa đĩa nhé?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "ありがとうございます。お{願|ねが}いします。",
            "ro": "Arigatou gozaimasu. Onegai shimasu.",
            "vi": "Cảm ơn. Nhờ bạn."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-1d",
        "title": "④",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{手伝|てつだ}いましょうか。",
            "ro": "Tetsudaimashou ka.",
            "vi": "Để mình giúp nhé?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "いいえ、{大丈夫|だいじょうぶ}です。ありがとう。",
            "ro": "Iie, daijoubu desu. Arigatou.",
            "vi": "Không, ổn rồi. Cảm ơn."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-1e",
        "title": "⑤",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{窓|まど}を{閉|し}めてください。{寒|さむ}いですから。",
            "ro": "Mado o shimete kudasai. Samui desu kara.",
            "vi": "Hãy đóng cửa sổ giúp mình. Vì lạnh."
          },
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "はい、わかりました。",
            "ro": "Hai, wakarimashita.",
            "vi": "Vâng, mình hiểu rồi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-ng-1-q",
        "title": "Câu hỏi ①–⑤ (7 câu)",
        "items": [
          {
            "q": "① Park nhận lời hay từ chối?",
            "options": [
              "○ nhận lời / đồng ý",
              "× từ chối"
            ],
            "correct": 0,
            "why": "いいですよ = nhận lời nhờ."
          },
          {
            "q": "② Rin nhận lời hay từ chối?",
            "options": [
              "○ nhận lời / đồng ý",
              "× từ chối"
            ],
            "correct": 1,
            "why": "私も 使って います から…… = từ chối (đang dùng)."
          },
          {
            "q": "③ Anna nhận lời giúp hay từ chối?",
            "options": [
              "○ nhận lời / đồng ý",
              "× từ chối"
            ],
            "correct": 0,
            "why": "お願いします = nhận lời giúp."
          },
          {
            "q": "④ Rin nhận lời giúp hay từ chối?",
            "options": [
              "○ nhận lời / đồng ý",
              "× từ chối"
            ],
            "correct": 1,
            "why": "いいえ、大丈夫です = từ chối lịch sự."
          },
          {
            "q": "⑤ Wang đồng ý đóng cửa sổ không?",
            "options": [
              "○ nhận lời / đồng ý",
              "× từ chối"
            ],
            "correct": 0,
            "why": "はい、わかりました = đồng ý."
          },
          {
            "q": "② Vì sao Rin từ chối?",
            "options": [
              "Dao bị hỏng",
              "Rin không có dao",
              "Rin không thích Wang",
              "Rin cũng đang dùng dao"
            ],
            "correct": 3,
            "why": "私も 使って います から."
          },
          {
            "q": "⑤ Vì sao Daniel nhờ đóng cửa sổ?",
            "options": [
              "Vì ồn",
              "Vì nóng",
              "Vì lạnh",
              "Vì có mưa"
            ],
            "correct": 2,
            "why": "寒いですから."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · vị trí · đang làm gì · cái nào"
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-2a",
        "title": "⑥ Muối ở đâu?",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{塩|しお}はどこにありますか。",
            "ro": "Shio wa doko ni arimasu ka.",
            "vi": "Muối ở đâu?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "テーブルの{上|うえ}にあります。しょうゆもそこにあります。",
            "ro": "Teeburu no ue ni arimasu. Shouyu mo soko ni arimasu.",
            "vi": "Ở trên bàn. Xì dầu cũng ở đó."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-2b",
        "title": "⑦ Hòm thư ở đâu?",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "すみません、ポストはどこにありますか。",
            "ro": "Sumimasen, posuto wa doko ni arimasu ka.",
            "vi": "Xin lỗi, hòm thư ở đâu?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{駅|えき}の{前|まえ}にあります。{交番|こうばん}の{横|よこ}です。",
            "ro": "Eki no mae ni arimasu. Kouban no yoko desu.",
            "vi": "Ở trước ga. Nó ở bên cạnh đồn công an."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-2c",
        "title": "⑧ Wang ở đâu?",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "ワンさんはどこにいますか。",
            "ro": "Wan-san wa doko ni imasu ka.",
            "vi": "Wang ở đâu?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "バス{停|てい}にいます。{木|き}の{下|した}です。",
            "ro": "Basutei ni imasu. Ki no shita desu.",
            "vi": "Anh ấy ở trạm xe buýt. Dưới gốc cây."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-3a",
        "title": "⑨ Bây giờ bạn đang làm gì?",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "もしもし、{今|いま}、{何|なに}をしていますか。",
            "ro": "Moshimoshi, ima, nani o shite imasu ka.",
            "vi": "A lô, bây giờ bạn đang làm gì?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。",
            "ro": "Daidokoro de ryouri o tsukutte imasu.",
            "vi": "Mình đang nấu ăn ở bếp."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-3b",
        "title": "⑩ Mọi người đang làm gì?",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "みんな{何|なに}をしていますか。",
            "ro": "Minna nani o shite imasu ka.",
            "vi": "Mọi người đang làm gì?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "マルコさんは{歌|うた}を{歌|うた}っています。ワンさんはギターを{弾|ひ}いています。リンさんは{電話|でんわ}をかけています。",
            "ro": "Maruko-san wa uta o utatte imasu. Wan-san wa gitaa o hiite imasu. Rin-san wa denwa o kakete imasu.",
            "vi": "Marco đang hát. Wang đang chơi ghi ta. Rin đang gọi điện thoại."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-4a",
        "title": "⑪ Cái đĩa nào?",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "どのお{皿|さら}を{使|つか}いますか。",
            "ro": "Dono osara o tsukaimasu ka.",
            "vi": "Bạn dùng cái đĩa nào?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "あの{大|おお}きいお{皿|さら}を{使|つか}ってください。",
            "ro": "Ano ookii osara o tsukatte kudasai.",
            "vi": "Hãy dùng cái đĩa lớn kia."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-4b",
        "title": "⑫ Muối là cái nào? (bẫy これ／あれ)",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{塩|しお}はどれですか。",
            "ro": "Shio wa dore desu ka.",
            "vi": "Muối là cái nào?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "それです。",
            "ro": "Sore desu.",
            "vi": "Cái đó (gần bạn)."
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "これですか。",
            "ro": "Kore desu ka.",
            "vi": "Cái này à?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "いいえ、あれです。{冷蔵庫|れいぞうこ}の{上|うえ}にあります。",
            "ro": "Iie, are desu. Reizouko no ue ni arimasu.",
            "vi": "Không, cái kia kìa. Ở trên tủ lạnh."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-ng-2-q",
        "title": "Câu hỏi ⑥–⑫ (12 câu)",
        "items": [
          {
            "q": "⑥ Muối ở đâu?",
            "options": [
              "Dưới bàn",
              "Trên bàn",
              "Ngoài cửa sổ",
              "Trong tủ lạnh"
            ],
            "correct": 1,
            "why": "テーブルの 上."
          },
          {
            "q": "⑥ Xì dầu ở đâu?",
            "options": [
              "Không biết",
              "Cũng trên bàn",
              "Ở bếp",
              "Trong tủ lạnh"
            ],
            "correct": 1,
            "why": "しょうゆも そこに."
          },
          {
            "q": "⑦ Hòm thư ở đâu?",
            "options": [
              "Trước ga",
              "Ở công viên",
              "Sau ga",
              "Trong ga"
            ],
            "correct": 0,
            "why": "駅の 前."
          },
          {
            "q": "⑦ Hòm thư ở cạnh cái gì?",
            "options": [
              "Máy bán hàng",
              "Trạm xe buýt",
              "Rạp phim",
              "Đồn công an"
            ],
            "correct": 3,
            "why": "交番の 横."
          },
          {
            "q": "⑧ Wang ở đâu?",
            "options": [
              "Ở trạm xe buýt",
              "Ở công viên",
              "Ở nhà",
              "Ở ga"
            ],
            "correct": 0,
            "why": "バス停に います."
          },
          {
            "q": "⑧ Chính xác hơn, Wang đứng ở chỗ nào?",
            "options": [
              "Dưới gốc cây",
              "Trên cây",
              "Sau trạm xe buýt",
              "Cạnh hòm thư"
            ],
            "correct": 0,
            "why": "木の 下."
          },
          {
            "q": "⑨ Rin đang làm gì và ở đâu?",
            "options": [
              "Rửa đĩa ở phòng khách",
              "Gọi điện ở bếp",
              "Nấu ăn ở bếp",
              "Hát ở bếp"
            ],
            "correct": 2,
            "why": "台所で 料理を 作って います."
          },
          {
            "q": "⑩ Ai đang chơi ghi ta?",
            "options": [
              "Wang",
              "Marco",
              "Rin",
              "Park"
            ],
            "correct": 0,
            "why": "ワンさんは ギター."
          },
          {
            "q": "⑩ Marco đang làm gì?",
            "options": [
              "Gọi điện",
              "Hát",
              "Rửa đĩa",
              "Chơi ghi ta"
            ],
            "correct": 1,
            "why": "マルコさんは 歌."
          },
          {
            "q": "⑩ Rin đang làm gì?",
            "options": [
              "Chơi ghi ta",
              "Nấu ăn",
              "Hát",
              "Gọi điện"
            ],
            "correct": 3,
            "why": "リンさんは 電話."
          },
          {
            "q": "⑪ Dùng cái đĩa nào?",
            "options": [
              "Cái đĩa lớn kia",
              "Cái đĩa trên bàn",
              "Cái đĩa nhỏ này",
              "Cái đĩa trong tủ lạnh"
            ],
            "correct": 0,
            "why": "あの 大きい お皿."
          },
          {
            "q": "⑫ Muối cuối cùng là cái nào?",
            "options": [
              "Cái gần Rin (それ)",
              "Không có muối",
              "Cái Park cầm (これ)",
              "Cái ở trên tủ lạnh (あれ)"
            ],
            "correct": 3,
            "why": "Rin đính chính: いいえ、あれです."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bẫy đổi ý, số, nhiều người"
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-5a",
        "title": "⑬ Bẫy giờ",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "パーティーは{土曜日|どようび}の{六時|ろくじ}からです。{五時|ごじ}に{来|き}てください。",
            "ro": "Paatii wa doyoubi no rokuji kara desu. Goji ni kite kudasai.",
            "vi": "Tiệc từ 6 giờ thứ Bảy. Hãy đến lúc 5 giờ."
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{五時|ごじ}ですね。わかりました。",
            "ro": "Goji desu ne. Wakarimashita.",
            "vi": "5 giờ nhỉ. Mình hiểu rồi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-5b",
        "title": "⑭ Bẫy đổi giờ",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{十二時|じゅうにじ}に{来|き}てください。",
            "ro": "Juuniji ni kite kudasai.",
            "vi": "Hãy đến lúc 12 giờ."
          },
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "{十二時|じゅうにじ}はちょっと……。{一時|いちじ}はどうですか。",
            "ro": "Juuniji wa chotto.... Ichiji wa dou desu ka.",
            "vi": "12 giờ hơi khó. 1 giờ thì sao?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{一時|いちじ}ですね。いいですよ。",
            "ro": "Ichiji desu ne. Ii desu yo.",
            "vi": "1 giờ nhỉ. Được thôi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-6",
        "title": "⑮ Đếm đồ vật",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "コップはいくつありますか。",
            "ro": "Koppu wa ikutsu arimasu ka.",
            "vi": "Có mấy cái cốc?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "{四|よっ}つあります。でも、{一|ひと}つは{小|ちい}さいです。お{皿|さら}は{五枚|ごまい}あります。",
            "ro": "Yottsu arimasu. Demo, hitotsu wa chiisai desu. Osara wa gomai arimasu.",
            "vi": "Có 4 cái. Nhưng một cái nhỏ. Đĩa có 5 cái."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-7",
        "title": "⑯ Đổi nơi hẹn",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{改札|かいさつ}の{前|まえ}で{会|あ}いましょう。",
            "ro": "Kaisatsu no mae de aimashou.",
            "vi": "Gặp trước cổng soát vé nhé."
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{改札|かいさつ}の{前|まえ}は{人|ひと}が{多|おお}いですから、バス{停|てい}の{前|まえ}はどうですか。",
            "ro": "Kaisatsu no mae wa hito ga ooi desu kara, basutei no mae wa dou desu ka.",
            "vi": "Trước cổng soát vé đông người, trước trạm xe buýt thì sao?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "いいですよ。バス{停|てい}の{前|まえ}ですね。",
            "ro": "Ii desu yo. Basutei no mae desu ne.",
            "vi": "Được thôi. Trước trạm xe buýt nhỉ."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-8",
        "title": "⑰ Điện thoại: người khác nghe máy",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "もしもし、リンさんのうちですか。",
            "ro": "Moshimoshi, Rin-san no uchi desu ka.",
            "vi": "A lô, nhà của Rin phải không?"
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "はい。リンさんはいま{台所|だいどころ}にいます。すみませんが、あとでかけてください。",
            "ro": "Hai. Rin-san wa ima daidokoro ni imasu. Sumimasen ga, atode kakete kudasai.",
            "vi": "Vâng. Rin đang ở trong bếp. Xin lỗi, hãy gọi lại sau nhé."
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "わかりました。あとでかけます。",
            "ro": "Wakarimashita. Atode kakemasu.",
            "vi": "Mình hiểu rồi. Lát nữa mình gọi lại."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-9",
        "title": "⑱ Bia còn hay hết",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "ビールはまだありますか。",
            "ro": "Biiru wa mada arimasu ka.",
            "vi": "Còn bia không?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "いいえ、もうありません。でも、ジュースはまだたくさんあります。",
            "ro": "Iie, mou arimasen. Demo, juusu wa mada takusan arimasu.",
            "vi": "Không, hết rồi. Nhưng nước ép vẫn còn nhiều."
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "じゃあ、ジュースを{飲|の}みます。",
            "ro": "Jaa, juusu o nomimasu.",
            "vi": "Vậy mình uống nước ép."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b7-ng-10",
        "title": "⑲ Nhiều người nhiều việc",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "パクさん、すみませんが、ナイフで{肉|にく}を{切|き}ってください。ワンさんは{窓|まど}を{開|あ}けてください。",
            "ro": "Paku-san, sumimasen ga, naifu de niku o kitte kudasai. Wan-san wa mado o akete kudasai.",
            "vi": "Park, xin lỗi, hãy cắt thịt bằng dao. Wang hãy mở cửa sổ."
          },
          {
            "who": "パク",
            "voice": "ja-nam",
            "text": "いいですよ。{野菜|やさい}も{切|き}りましょうか。",
            "ro": "Ii desu yo. Yasai mo kirimashou ka.",
            "vi": "Được thôi. Mình cắt cả rau nhé?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "ありがとう。お{願|ねが}いします。リンさんと{私|わたし}はお{皿|さら}を{洗|あら}います。",
            "ro": "Arigatou. Onegai shimasu. Rin-san to watashi wa osara o araimasu.",
            "vi": "Cảm ơn. Nhờ bạn. Rin và mình sẽ rửa đĩa."
          },
          {
            "who": "ワン",
            "voice": "ja-nam",
            "text": "{窓|まど}を{開|あ}けます。ギターも{弾|ひ}きましょうか。",
            "ro": "Mado o akemasu. Gitaa mo hikimashou ka.",
            "vi": "Mình mở cửa sổ. Mình chơi ghi ta luôn nhé?"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-ng-3-q",
        "title": "Câu hỏi ⑬–⑲ (15 câu)",
        "items": [
          {
            "q": "⑬ Tiệc bắt đầu lúc mấy giờ?",
            "options": [
              "4 giờ",
              "7 giờ",
              "5 giờ",
              "6 giờ"
            ],
            "correct": 3,
            "why": "六時から; 五時 là giờ đến."
          },
          {
            "q": "⑬ Park phải đến lúc mấy giờ?",
            "options": [
              "5 giờ",
              "6 giờ",
              "4 giờ",
              "7 giờ"
            ],
            "correct": 0,
            "why": "五時に 来て ください."
          },
          {
            "q": "⑭ Giờ cuối cùng Rin chốt?",
            "options": [
              "11 giờ",
              "1 giờ",
              "2 giờ",
              "12 giờ"
            ],
            "correct": 1,
            "why": "12 giờ bị từ chối → 1 giờ."
          },
          {
            "q": "⑮ Có mấy cái cốc?",
            "options": [
              "3 cái",
              "4 cái (một cái nhỏ)",
              "1 cái",
              "5 cái"
            ],
            "correct": 1,
            "why": "四つ; 一つは 小さい."
          },
          {
            "q": "⑮ Có mấy cái đĩa?",
            "options": [
              "3 cái",
              "4 cái",
              "6 cái",
              "5 cái"
            ],
            "correct": 3,
            "why": "お皿は 五枚."
          },
          {
            "q": "⑯ Nơi hẹn cuối cùng?",
            "options": [
              "Trong ga",
              "Trước trạm xe buýt",
              "Trước cổng soát vé",
              "Ở nhà Anna"
            ],
            "correct": 1,
            "why": "Cổng soát vé đông → đổi sang バス停の前."
          },
          {
            "q": "⑯ Vì sao Anna không muốn gặp trước cổng soát vé?",
            "options": [
              "Vì đông người",
              "Vì đóng cửa",
              "Vì đắt",
              "Vì xa"
            ],
            "correct": 0,
            "why": "人が 多いですから."
          },
          {
            "q": "⑰ Ai nghe điện thoại?",
            "options": [
              "Rin",
              "Wang",
              "Anna",
              "Park"
            ],
            "correct": 3,
            "why": "Park trả lời và nói Rin đang ở bếp."
          },
          {
            "q": "⑰ Rin đang ở đâu?",
            "options": [
              "Trong bếp",
              "Ngoài cửa sổ",
              "Trước ga",
              "Trên bàn"
            ],
            "correct": 0,
            "why": "リンさんは いま 台所に います."
          },
          {
            "q": "⑰ Anna sẽ làm gì?",
            "options": [
              "Gọi lại sau",
              "Gửi thư",
              "Đến nhà Rin",
              "Đợi ở bếp"
            ],
            "correct": 0,
            "why": "あとで かけます."
          },
          {
            "q": "⑱ Còn bia không?",
            "options": [
              "Còn nhiều",
              "Chưa mang ra",
              "Còn ít",
              "Hết rồi"
            ],
            "correct": 3,
            "why": "もう ありません."
          },
          {
            "q": "⑱ Park uống gì?",
            "options": [
              "Trà",
              "Cà phê",
              "Bia",
              "Nước ép"
            ],
            "correct": 3,
            "why": "ジュースを 飲みます."
          },
          {
            "q": "⑲ Ai sẽ cắt thịt?",
            "options": [
              "Anna",
              "Rin",
              "Wang",
              "Park"
            ],
            "correct": 3,
            "why": "パクさん ... 肉を 切って."
          },
          {
            "q": "⑲ Ai sẽ mở cửa sổ?",
            "options": [
              "Anna",
              "Wang",
              "Rin",
              "Park"
            ],
            "correct": 1,
            "why": "ワンさんは 窓を 開けて."
          },
          {
            "q": "⑲ Ai sẽ rửa đĩa?",
            "options": [
              "Chỉ Rin",
              "Chỉ Anna",
              "Park và Wang",
              "Rin và Anna"
            ],
            "correct": 3,
            "why": "リンさんと 私は お皿を 洗います."
          },
          {
            "q": "⑲ Wang đề nghị làm thêm gì?",
            "options": [
              "Rửa đĩa",
              "Nấu ăn",
              "Hát",
              "Chơi ghi ta"
            ],
            "correct": 3,
            "why": "ギターも 弾きましょうか."
          }
        ]
      },
      {
        "t": "h",
        "text": "Nghe điền chỗ trống — nghe lại các đoạn trên rồi gõ"
      },
      {
        "t": "quiz",
        "id": "lt-b7-ng-dien",
        "title": "Nghe điền chỗ trống (6 câu)",
        "kind": "fill",
        "grammar": "Nghe lại đoạn ①, ⑥, ⑩, ⑭, ⑮, ⑱",
        "items": [
          {
            "q": "アンナ：{窓|まど}を{開|あ}けて＿＿。　〔Anna:mado o akete __.〕",
            "answers": [
              "ください"
            ],
            "hint": "Nhờ (nghe ①)"
          },
          {
            "q": "パク：{塩|しお}は＿＿にありますか。　〔Paku:shio wa __ ni arimasu ka.〕",
            "answers": [
              "どこ"
            ],
            "hint": "Hỏi nơi chốn (nghe ⑥)"
          },
          {
            "q": "パク：マルコさんは{歌|うた}を{歌|うた}って＿＿。　〔Paku:marukosan wa uta o utatte __.〕",
            "answers": [
              "います"
            ],
            "hint": "Đang làm (nghe ⑩)"
          },
          {
            "q": "リン：{十二時|じゅうにじ}はちょっと……。＿＿はどうですか。　〔Rin:juuniji wa chotto.... __ wa dou desu ka.〕",
            "answers": [
              "一時",
              "いちじ",
              "1時"
            ],
            "hint": "Giờ mới (nghe ⑭)"
          },
          {
            "q": "リン：ビールは＿＿ありません。　〔Rin:biiru wa __ arimasen.〕",
            "answers": [
              "もう"
            ],
            "hint": "Hết (nghe ⑱)"
          },
          {
            "q": "パク：コップは＿＿あります。　〔Paku:koppu wa __ arimasu.〕",
            "answers": [
              "四つ",
              "よっつ",
              "4つ"
            ],
            "hint": "Số cốc (nghe ⑮)"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b7-noi-viet",
    "kind": "speaking",
    "title": "Luyện thêm Bài 7 · Nói & viết — 5 bộ tranh kiểu thi nói (3 câu tranh + 1 cá nhân) · đọc to · viết 3–5 câu",
    "goal": "Trả lời trọn câu các dạng câu hỏi thi nói Bài 7 (có gì ở đâu, ai đang làm gì, nhờ/đề nghị giúp, cái nào, còn/hết, cách dùng), đọc to trôi chảy, viết tin nhắn/tả phòng/hướng dẫn 3–5 câu.",
    "minutes": 90,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thi nói: **nghe → nghĩ không quá 10 giây → trả lời TRỌN CÂU → thêm 1 câu phụ**. Mỗi bộ có 3 câu nhìn \"tranh\" (mô tả trong ngoặc) + 1 câu cá nhân: che cột trả lời, tự nói, rồi nghe mẫu.",
          "Với tranh **vị trí**: nói rõ **N の 上／下／隣… に あります／います** (người, vật phân biệt います／あります). Với tranh **hành động**: **N で N を V て います**.",
          "Viết ngắn: 3–5 câu, mỗi câu một ý; soát thể て, trợ từ **に／で／が／を／の** và **います／あります**."
        ]
      },
      {
        "t": "recap",
        "title": "Cách tự chấm",
        "items": [
          "✅ Trả lời TRỌN CÂU · ✅ đúng thông tin theo tranh · ✅ thêm 1 câu phụ · ✅ không im lặng quá 10 giây.",
          "Nghe không rõ: 「もう いちど おねがいします。」 (tối đa 3 lần). Quên từ: dùng katakana hoặc từ đơn giản bạn chắc."
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
            "～に 何が ありますか／だれが いますか",
            "N2 が あります／います",
            "N に + vị trí cụ thể"
          ],
          [
            "～は どこに ありますか／いますか",
            "N の 上／下／隣… に あります／います",
            "N が たくさん あります"
          ],
          [
            "～は 何を していますか",
            "N（nơi）で N を V て います",
            "だれ と + V"
          ],
          [
            "だれが ～ていますか",
            "N が V て います",
            "N で + V"
          ],
          [
            "どの N ／ どれ ですか",
            "この N です ／ これ です",
            "N は それ より ～"
          ],
          [
            "～は まだ ありますか",
            "はい、まだ あります ／ いいえ、もう ありません",
            "から + lý do"
          ],
          [
            "～が わかりますか",
            "はい、わかります ／ いいえ、わかりません",
            "教えて ください"
          ]
        ],
        "caption": "Khung trả lời Bài 7 — luôn trả lời TRỌN CÂU rồi thêm 1 câu phụ"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · bộ tranh 1–2: căn phòng · bữa tiệc"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Một căn phòng: trên bàn có cốc, đĩa, hoa; dưới bàn có con chó; cạnh bàn 4 cái ghế; ngoài cửa sổ có cái cây."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Căn phòng (3 câu theo tranh + 1 câu cá nhân)",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "テーブルの{上|うえ}に{何|なに}がありますか。",
            "ro": "Teeburu no ue ni nani ga arimasu ka.",
            "vi": "(Tranh) Trên bàn có gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "コップとお{皿|さら}と{花|はな}があります。",
            "ro": "Koppu to osara to hana ga arimasu.",
            "vi": "Có cốc, đĩa và hoa."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{犬|いぬ}はどこにいますか。",
            "ro": "Inu wa doko ni imasu ka.",
            "vi": "(Tranh) Con chó ở đâu?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "テーブルの{下|した}にいます。",
            "ro": "Teeburu no shita ni imasu.",
            "vi": "Nó ở dưới bàn."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "いすはいくつありますか。",
            "ro": "Isu wa ikutsu arimasu ka.",
            "vi": "(Tranh) Có mấy cái ghế?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いすが{四|よっ}つあります。",
            "ro": "Isu ga yottsu arimasu.",
            "vi": "Có bốn cái ghế."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "あなたのへやに{何|なに}がありますか。",
            "ro": "Anata no heya ni nani ga arimasu ka.",
            "vi": "(Cá nhân) Trong phòng bạn có gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ベッドとつくえがあります。{窓|まど}の{外|そと}に{木|き}があります。",
            "ro": "Beddo to tsukue ga arimasu. Mado no soto ni ki ga arimasu.",
            "vi": "Có giường và bàn học. Ngoài cửa sổ có một cái cây."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Bếp bữa tiệc: Anna rửa đĩa, Wang chơi ghi ta, Park cầm dao cắt thịt, Rin gọi điện, Marco hát."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Bữa tiệc: ai đang làm gì",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "アンナさんは{何|なに}をしていますか。",
            "ro": "Anna-san wa nani o shite imasu ka.",
            "vi": "(Tranh: Anna rửa đĩa) Anna đang làm gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。",
            "ro": "Daidokoro de osara o aratte imasu.",
            "vi": "Chị ấy đang rửa đĩa ở bếp."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "だれがギターを{弾|ひ}いていますか。",
            "ro": "Dare ga gitaa o hiite imasu ka.",
            "vi": "(Tranh: Wang chơi ghi ta) Ai đang chơi ghi ta?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ワンさんが{弾|ひ}いています。",
            "ro": "Wan-san ga hiite imasu.",
            "vi": "Wang đang chơi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "パクさんは{何|なに}で{肉|にく}を{切|き}っていますか。",
            "ro": "Paku-san wa nani de niku o kitte imasu ka.",
            "vi": "(Tranh: Park cầm dao) Park cắt thịt bằng gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ナイフで{切|き}っています。",
            "ro": "Naifu de kitte imasu.",
            "vi": "Anh ấy cắt bằng dao."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{今|いま}、あなたは{何|なに}をしていますか。",
            "ro": "Ima, anata wa nani o shite imasu ka.",
            "vi": "(Cá nhân) Bây giờ bạn đang làm gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{今|いま}、{日本語|にほんご}を{勉強|べんきょう}しています。",
            "ro": "Ima, nihongo o benkyoushite imasu.",
            "vi": "Bây giờ mình đang học tiếng Nhật."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · bộ tranh 3–4: nhờ vả · phố"
      },
      {
        "t": "note",
        "title": "Tranh 3 (mô tả)",
        "items": [
          "Một người ôm nhiều túi trước cửa; trên kệ cao có đĩa, một cái lớn, một cái nhỏ."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 3 — Nhập vai: nhờ và đề nghị giúp",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "すみません、ドアを{開|あ}けてください。",
            "ro": "Sumimasen, doa o akete kudasai.",
            "vi": "(Tranh: người ôm nhiều túi, tay đầy) Xin lỗi, hãy mở cửa giúp tôi."
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、いいですよ。かばんを{持|も}ちましょうか。",
            "ro": "Hai, ii desu yo. Kaban o mochimashou ka.",
            "vi": "Vâng, được ạ. Để tôi cầm cặp giúp nhé?"
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ありがとうございます。お{願|ねが}いします。あのお{皿|さら}を{取|と}ってください。",
            "ro": "Arigatou gozaimasu. Onegai shimasu. Ano osara o totte kudasai.",
            "vi": "(Tranh: đĩa ở trên cao) Cảm ơn. Nhờ bạn. Hãy lấy giúp tôi cái đĩa kia."
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、どうぞ。このお{皿|さら}ですか。",
            "ro": "Hai, douzo. Kono osara desu ka.",
            "vi": "Vâng, mời. Cái đĩa này phải không?"
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "いいえ、あの{大|おお}きいお{皿|さら}です。",
            "ro": "Iie, ano ookii osara desu.",
            "vi": "(Tranh) Không, cái đĩa lớn kia."
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "わかりました。はい、どうぞ。",
            "ro": "Wakarimashita. Hai, douzo.",
            "vi": "Tôi hiểu rồi. Đây ạ."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "よく{友達|ともだち}のうちに{行|い}きますか。",
            "ro": "Yoku tomodachi no uchi ni ikimasu ka.",
            "vi": "(Cá nhân) Bạn có hay đến nhà bạn bè không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、ときどき{行|い}きます。いっしょに{料理|りょうり}をします。",
            "ro": "Hai, tokidoki ikimasu. Isshoni ryouri o shimasu.",
            "vi": "Có, thỉnh thoảng mình đến. Chúng mình nấu ăn cùng nhau."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 4 (mô tả)",
        "items": [
          "Phố trước ga: đồn công an, cạnh đó hòm thư, trạm xe buýt, bên cạnh trạm có máy bán hàng tự động; dưới gốc cây có con chó."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 4 — Phố: trước ga có đồn công an, hòm thư, máy bán hàng, con chó dưới cây",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ポストはどこにありますか。",
            "ro": "Posuto wa doko ni arimasu ka.",
            "vi": "(Tranh) Hòm thư ở đâu?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{交番|こうばん}の{横|よこ}にあります。",
            "ro": "Kouban no yoko ni arimasu.",
            "vi": "Ở bên cạnh đồn công an."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{自動販売機|じどうはんばいき}はどこにありますか。",
            "ro": "Jidouhanbaiki wa doko ni arimasu ka.",
            "vi": "(Tranh) Máy bán hàng tự động ở đâu?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "バス{停|てい}の{横|よこ}にあります。",
            "ro": "Basutei no yoko ni arimasu.",
            "vi": "Ở bên cạnh trạm xe buýt."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{木|き}の{下|した}に{何|なに}がいますか。",
            "ro": "Ki no shita ni nani ga imasu ka.",
            "vi": "(Tranh) Dưới gốc cây có gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{犬|いぬ}がいます。",
            "ro": "Inu ga imasu.",
            "vi": "Có một con chó."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "あなたのうちの{近|ちか}くに{何|なに}がありますか。",
            "ro": "Anata no uchi no chikaku ni nani ga arimasu ka.",
            "vi": "(Cá nhân) Gần nhà bạn có gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "スーパーと{銀行|ぎんこう}と{駅|えき}があります。",
            "ro": "Suupaa to ginkou to eki ga arimasu.",
            "vi": "Có siêu thị, ngân hàng và nhà ga."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bộ tranh 5 · đọc to · viết ngắn"
      },
      {
        "t": "note",
        "title": "Tranh 5 (mô tả)",
        "items": [
          "Ba cái đĩa (lớn, nhỏ, nhỏ) với mũi tên chỉ cái lớn; tủ lạnh trống; người cầm đũa."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 5 — Cái nào · còn hay hết · cách dùng",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "どのお{皿|さら}を{使|つか}いますか。",
            "ro": "Dono osara o tsukaimasu ka.",
            "vi": "(Tranh: mũi tên chỉ cái đĩa lớn) Bạn dùng cái đĩa nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "この{大|おお}きいお{皿|さら}を{使|つか}います。",
            "ro": "Kono ookii osara o tsukaimasu.",
            "vi": "Mình dùng cái đĩa lớn này."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ビールはまだありますか。",
            "ro": "Biiru wa mada arimasu ka.",
            "vi": "(Tranh: tủ lạnh trống) Còn bia không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいえ、もうありません。",
            "ro": "Iie, mou arimasen.",
            "vi": "Không, hết rồi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "はしの{使|つか}い{方|かた}がわかりますか。",
            "ro": "Hashi no tsukaikata ga wakarimasu ka.",
            "vi": "(Tranh: người cầm đũa) Bạn biết cách dùng đũa không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、わかります。でも、スプーンも{使|つか}います。",
            "ro": "Hai, wakarimasu. Demo, supuun mo tsukaimasu.",
            "vi": "Có, mình biết. Nhưng mình cũng dùng thìa."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "はしでご{飯|はん}を{食|た}べますか。",
            "ro": "Hashi de gohan o tabemasu ka.",
            "vi": "(Cá nhân) Bạn có ăn cơm bằng đũa không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、{食|た}べます。{毎日|まいにち}はしを{使|つか}っています。",
            "ro": "Hai, tabemasu. Mainichi hashi o tsukatte imasu.",
            "vi": "Có, mình ăn. Ngày nào mình cũng dùng đũa."
          }
        ]
      },
      {
        "t": "h",
        "text": "Đọc to (Reading 40 điểm)"
      },
      {
        "t": "passage",
        "title": "Đọc to 1 (Reading) — Phòng khách",
        "intro": "Chuẩn bị 20 giây rồi đọc to, chậm, rõ. Chú ý ngắt ở 、 và 。.",
        "paras": [
          {
            "text": "テーブルの{上|うえ}にコップとお{皿|さら}があります。{冷蔵庫|れいぞうこ}の{中|なか}にビールと{水|みず}があります。{窓|まど}の{外|そと}に{木|き}があります。{木|き}の{下|した}に{犬|いぬ}がいます。へやに{誰|だれ}もいません。"
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
            "en": "テーブルの{上|うえ}にコップとお{皿|さら}があります。",
            "ro": "Teeburu no ue ni koppu to osara ga arimasu.",
            "vi": "Trên bàn có cốc và đĩa."
          },
          {
            "en": "{冷蔵庫|れいぞうこ}の{中|なか}にビールと{水|みず}があります。",
            "ro": "Reizouko no naka ni biiru to mizu ga arimasu.",
            "vi": "Trong tủ lạnh có bia và nước."
          },
          {
            "en": "{窓|まど}の{外|そと}に{木|き}があります。",
            "ro": "Mado no soto ni ki ga arimasu.",
            "vi": "Ngoài cửa sổ có một cái cây."
          },
          {
            "en": "{木|き}の{下|した}に{犬|いぬ}がいます。",
            "ro": "Ki no shita ni inu ga imasu.",
            "vi": "Dưới gốc cây có một con chó."
          },
          {
            "en": "へやに{誰|だれ}もいません。",
            "ro": "Heya ni dare mo imasen.",
            "vi": "Trong phòng không có ai."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đọc to 2 (Reading) — Chuẩn bị tiệc",
        "intro": "Có nhiều thể て: đọc rõ って／んで／いて.",
        "paras": [
          {
            "text": "すみませんが、ビールを{冷蔵庫|れいぞうこ}に{入|い}れてください。アンナさんはお{皿|さら}を{洗|あら}っています。パクさんはナイフで{肉|にく}を{切|き}っています。ワンさんはギターを{弾|ひ}いています。{手伝|てつだ}いましょうか。ビールはもうありません。"
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
            "en": "すみませんが、ビールを{冷蔵庫|れいぞうこ}に{入|い}れてください。",
            "ro": "Sumimasen ga, biiru o reizouko ni irete kudasai.",
            "vi": "Xin lỗi, hãy bỏ bia vào tủ lạnh."
          },
          {
            "en": "アンナさんはお{皿|さら}を{洗|あら}っています。",
            "ro": "Anna-san wa osara o aratte imasu.",
            "vi": "Anna đang rửa đĩa."
          },
          {
            "en": "パクさんはナイフで{肉|にく}を{切|き}っています。",
            "ro": "Paku-san wa naifu de niku o kitte imasu.",
            "vi": "Park đang cắt thịt bằng dao."
          },
          {
            "en": "ワンさんはギターを{弾|ひ}いています。",
            "ro": "Wan-san wa gitaa o hiite imasu.",
            "vi": "Wang đang chơi ghi ta."
          },
          {
            "en": "{手伝|てつだ}いましょうか。",
            "ro": "Tetsudaimashou ka.",
            "vi": "Để tôi giúp nhé?"
          },
          {
            "en": "ビールはもうありません。",
            "ro": "Biiru wa mou arimasen.",
            "vi": "Bia hết rồi."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b7-noi-ghi-am",
        "part": "1",
        "questions": [
          "テーブルの うえに なにが ありますか。",
          "いぬは どこに いますか。",
          "アンナさんは なにを していますか。",
          "だれが ギターを ひいて いますか。",
          "ポストは どこに ありますか。",
          "どの おさらを つかいますか。",
          "ビールは まだ ありますか。",
          "すみませんが、 まどを あけて ください。",
          "いま、 なにを して いますか。"
        ]
      },
      {
        "t": "h",
        "text": "Viết ngắn 3–5 câu — 4 đề có bài mẫu"
      },
      {
        "t": "p",
        "text": "**Đề 1.** Tả căn phòng của bạn (4 câu) — dùng vị trí 上・下・横・外. Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}のへやにベッドとつくえがあります。",
            "ro": "Watashi no heya ni beddo to tsukue ga arimasu.",
            "vi": "Trong phòng tôi có giường và bàn học."
          },
          {
            "en": "つくえの{上|うえ}にほんがあります。",
            "ro": "Tsukue no ue ni hon ga arimasu.",
            "vi": "Trên bàn học có sách."
          },
          {
            "en": "ベッドの{下|した}に{犬|いぬ}がいます。",
            "ro": "Beddo no shita ni inu ga imasu.",
            "vi": "Dưới giường có con chó."
          },
          {
            "en": "{窓|まど}の{外|そと}に{木|き}があります。",
            "ro": "Mado no soto ni ki ga arimasu.",
            "vi": "Ngoài cửa sổ có cái cây."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 2.** Viết tin nhắn nhờ bạn mang bia đến tiệc và giúp rửa đĩa. Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "アンナさんへ",
            "ro": "Anna-san e",
            "vi": "Gửi Anna,"
          },
          {
            "en": "{土曜日|どようび}、パーティーがあります。",
            "ro": "Doyoubi, paatii ga arimasu.",
            "vi": "Thứ Bảy có tiệc."
          },
          {
            "en": "すみませんが、ビールを{持|も}って{来|き}てください。",
            "ro": "Sumimasen ga, biiru o motte kite kudasai.",
            "vi": "Xin lỗi, hãy mang bia đến giúp mình."
          },
          {
            "en": "そして、お{皿|さら}を{洗|あら}ってください。",
            "ro": "Soshite, osara o aratte kudasai.",
            "vi": "Và hãy rửa đĩa giúp mình."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 3.** Viết hướng dẫn cách làm một món (3 bước, dùng V てください). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "カレーの{作|つく}り{方|かた}",
            "ro": "Karee no tsukurikata",
            "vi": "Cách nấu cà ri"
          },
          {
            "en": "まず、{野菜|やさい}と{肉|にく}をナイフで{切|き}ってください。",
            "ro": "Mazu, yasai to niku o naifu de kitte kudasai.",
            "vi": "Trước hết hãy cắt rau và thịt bằng dao."
          },
          {
            "en": "それから、フライパンに{入|い}れてください。",
            "ro": "Sorekara, furaipan ni irete kudasai.",
            "vi": "Sau đó hãy cho vào chảo."
          },
          {
            "en": "そして、{塩|しお}を{入|い}れてください。",
            "ro": "Soshite, shio o irete kudasai.",
            "vi": "Rồi hãy cho muối vào."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 4.** Viết 3 câu nói bây giờ bạn và bạn bè đang làm gì. Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{今|いま}、{私|わたし}はうちにいます。",
            "ro": "Ima, watashi wa uchi ni imasu.",
            "vi": "Bây giờ tôi đang ở nhà."
          },
          {
            "en": "{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。",
            "ro": "Daidokoro de ryouri o tsukutte imasu.",
            "vi": "Tôi đang nấu ăn ở bếp."
          },
          {
            "en": "{友達|ともだち}はギターを{弾|ひ}いています。",
            "ro": "Tomodachi wa gitaa o hiite imasu.",
            "vi": "Bạn tôi đang chơi ghi ta."
          }
        ]
      },
      {
        "t": "note",
        "title": "Checklist trước khi nộp bài viết",
        "items": [
          "Mỗi câu kết thúc bằng です／ます／ください／ています — không để câu cụt.",
          "Soát: người/con vật → います, đồ vật → あります; nơi tồn tại → に; nơi hành động → で; V て đúng nhóm.",
          "Có thể thêm そして／それから／まず để nối bước trong hướng dẫn."
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-viet-chon",
        "title": "Chọn bài viết đúng và tự nhiên (6 câu)",
        "items": [
          {
            "q": "Nói trong tủ lạnh có bia.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "{冷蔵庫|れいぞうこ}の{中|なか}でビールがあります。 (Reizouko no naka de biiru ga arimasu.)",
              "{冷蔵庫|れいぞうこ}の{中|なか}にビールがいます。 (Reizouko no naka ni biiru ga imasu.)",
              "{冷蔵庫|れいぞうこ}の{中|なか}にビールをあります。 (Reizouko no naka ni biiru o arimasu.)",
              "{冷蔵庫|れいぞうこ}の{中|なか}にビールがあります。 (Reizouko no naka ni biiru ga arimasu.)"
            ],
            "correct": 3,
            "why": "N1 に N2 が あります."
          },
          {
            "q": "Nhờ bạn mở cửa sổ.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "すみませんが、{窓|まど}を{開|あ}けてください。 (Sumimasen ga, mado o akete kudasai.)",
              "すみませんが、{窓|まど}を{開|あ}けましょうか。 (Sumimasen ga, mado o akemashou ka.)",
              "すみませんが、{窓|まど}を{開|あ}けますください。 (Sumimasen ga, mado o akemasu kudasai.)",
              "すみませんが、{窓|まど}が{開|あ}けてください。 (Sumimasen ga, mado ga akete kudasai.)"
            ],
            "correct": 0,
            "why": "V て ください."
          },
          {
            "q": "Nói bạn đang rửa đĩa ở bếp.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "{台所|だいどころ}でお{皿|さら}を{洗|あら}いますいます。 (Daidokoro de osara o araimasu imasu.)",
              "{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。 (Daidokoro de osara o aratte imasu.)",
              "{台所|だいどころ}でお{皿|さら}が{洗|あら}っています。 (Daidokoro de osara ga aratte imasu.)",
              "{台所|だいどころ}にお{皿|さら}を{洗|あら}っています。 (Daidokoro ni osara o aratte imasu.)"
            ],
            "correct": 1,
            "why": "N で N を V て います."
          },
          {
            "q": "Đề nghị giúp bạn.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "{手伝|てつだ}ってください。 (Tetsudatte kudasai.)",
              "{手伝|てつだ}いませんか。 (Tetsudaimasen ka.)",
              "{手伝|てつだ}っていますか。 (Tetsudatte imasu ka.)",
              "{手伝|てつだ}いましょうか。 (Tetsudaimashou ka.)"
            ],
            "correct": 3,
            "why": "Vましょうか = để tôi giúp."
          },
          {
            "q": "Nói bia đã hết.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "ビールはまだありません。 (Biiru wa mada arimasen.)",
              "ビールはもうありません。 (Biiru wa mou arimasen.)",
              "ビールがもういます。 (Biiru ga mou imasu.)",
              "ビールはもうあります。 (Biiru wa mou arimasu.)"
            ],
            "correct": 1,
            "why": "もう + phủ định = hết rồi."
          },
          {
            "q": "Hỏi cách đọc chữ Hán.　Bài viết nào đúng và tự nhiên nhất?",
            "options": [
              "この{漢字|かんじ}を{読|よ}み{方|かた}を{教|おし}えてください。 (Kono kanji o yomikata o oshiete kudasai.)",
              "この{漢字|かんじ}の{読|よ}んで{方|かた}を{教|おし}えてください。 (Kono kanji no yondekata o oshiete kudasai.)",
              "この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。 (Kono kanji no yomikata o oshiete kudasai.)",
              "この{漢字|かんじ}の{読|よ}む{方|かた}を{教|おし}えてください。 (Kono kanji no yomukata o oshiete kudasai.)"
            ],
            "correct": 2,
            "why": "N の + V(bỏ ます) + 方."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b7-viet-sx",
        "title": "Sắp xếp thành đoạn văn hoàn chỉnh (2 câu)",
        "items": [
          {
            "vi": "Sắp xếp thành tin nhắn nhờ: gọi tên → có tiệc → nhờ mang bia.",
            "chips": [
              "すみませんが、ビールを{持|も}って{来|き}てください。",
              "アンナさん、{土曜日|どようび}にパーティーがあります。"
            ],
            "answer": [
              "アンナさん、{土曜日|どようび}にパーティーがあります。",
              "すみませんが、ビールを{持|も}って{来|き}てください。"
            ],
            "ro": "Anna-san, doyoubi ni paatii ga arimasu. Sumimasen ga, biiru o motte kite kudasai.."
          },
          {
            "vi": "Sắp xếp thành đoạn tả phòng: có bàn → trên bàn có hoa → dưới bàn có chó.",
            "chips": [
              "テーブルの{下|した}に{犬|いぬ}がいます。",
              "{私|わたし}のへやにテーブルがあります。",
              "テーブルの{上|うえ}に{花|はな}があります。"
            ],
            "answer": [
              "{私|わたし}のへやにテーブルがあります。",
              "テーブルの{上|うえ}に{花|はな}があります。",
              "テーブルの{下|した}に{犬|いぬ}がいます。"
            ],
            "ro": "Watashi no heya ni teeburu ga arimasu. Teeburu no ue ni hana ga arimasu. Teeburu no shita ni inu ga imasu.."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b7-de-tong-hop",
    "kind": "review",
    "title": "Luyện thêm Bài 7 · Đề tổng hợp cuối bài — đúng khuôn kiểm tra của cô (65 câu · 50 phút)",
    "goal": "Làm thử một đề đủ các phần: từ vựng, chữ Hán (chữ nhiễu), ngữ pháp, chia thể て, đọc hiểu, dịch — bấm giờ 50 phút, tự chấm theo thang điểm và biết mình yếu phần nào.",
    "minutes": 50,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Bấm giờ 50 phút**, không mở bài ôn. Làm theo thứ tự I → VI; phần chưa chắc thì đánh dấu, quay lại sau.",
          "Phần II (chữ Hán) có **chữ na ná**: 門/間/聞/開 · 寺/時/待/持 · 大/太/犬 · 貝/見/目 · 田/由/甲. Phần IV kiểm tra thể て: nhìn âm trước ます.",
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
            "Chữ Hán — chọn cách viết đúng (có chữ nhiễu)",
            "12",
            "12"
          ],
          [
            "III",
            "Ngữ pháp — chọn đáp án / nhiều ô trống",
            "20",
            "20"
          ],
          [
            "IV",
            "Chia thể て — gõ",
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
            "Dịch Việt → Nhật (5) và Nhật → Việt (4)",
            "9",
            "9"
          ],
          [
            "Tổng",
            "",
            "**65**",
            "**65**"
          ]
        ],
        "caption": "Cấu trúc đề tổng hợp Bài 7"
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
            "Làm đề tổng hợp cuối kỳ Bài 4–7; ôn lại lỗi nhỏ"
          ],
          [
            "46–54 (70–85%)",
            "Khá, còn sơ hở",
            "Xem lại phần sai nhiều nhất; làm lại lesson tương ứng ở mức Vừa"
          ],
          [
            "< 46 (< 70%)",
            "Cần ôn kỹ",
            "Học lại thể て + ポイント 61–71, làm lại mức Dễ rồi thi lại sau 1 ngày"
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
        "id": "lt-b7-de-i",
        "title": "I. Từ vựng",
        "items": [
          {
            "q": "ビールは＿＿の{中|なか}にあります。　〔Biiru wa __ no naka ni arimasu.〕",
            "options": [
              "{自動販売機|じどうはんばいき}",
              "{冷蔵庫|れいぞうこ}",
              "{電子|でんし}レンジ",
              "{改札|かいさつ}"
            ],
            "correct": 1,
            "why": "冷蔵庫. → **ビールは{冷蔵庫|れいぞうこ}の{中|なか}にあります。** 〔Biiru wa reizouko no naka ni arimasu.〕 — Bia ở trong tủ lạnh."
          },
          {
            "q": "＿＿に{手紙|てがみ}を{入|い}れます。　〔__ ni tegami o iremasu.〕",
            "options": [
              "{台所|だいどころ}",
              "{交番|こうばん}",
              "{改札|かいさつ}",
              "ポスト"
            ],
            "correct": 3,
            "why": "ポスト. → **ポストに{手紙|てがみ}を{入|い}れます。** 〔Posuto ni tegami o iremasu.〕 — Thư thì bỏ vào hòm thư."
          },
          {
            "q": "ご{飯|はん}を＿＿で{食|た}べます。　〔Gohan o __ de tabemasu.〕",
            "options": [
              "はし",
              "ギター",
              "{塩|しお}",
              "{窓|まど}"
            ],
            "correct": 0,
            "why": "はし. → **ご{飯|はん}をはしで{食|た}べます。** 〔Gohan o hashi de tabemasu.〕 — Tôi ăn cơm bằng đũa."
          },
          {
            "q": "コーヒーに＿＿を{入|い}れます。{甘|あま}いです。　〔Koohii ni __ o iremasu. Amai desu.〕",
            "options": [
              "しょうゆ",
              "{砂糖|さとう}",
              "ピザ",
              "{塩|しお}"
            ],
            "correct": 1,
            "why": "砂糖. → **コーヒーに{砂糖|さとう}を{入|い}れます。{甘|あま}いです。** 〔Koohii ni satou o iremasu. Amai desu.〕 — Cho đường vào cà phê. Ngọt."
          },
          {
            "q": "＿＿、{山田|やまだ}です。　〔__, yamada desu.〕",
            "options": [
              "もしもし",
              "たくさん",
              "すみませんが",
              "ああ"
            ],
            "correct": 0,
            "why": "もしもし. → **もしもし、{山田|やまだ}です。** 〔Moshimoshi, yamada desu.〕 — A lô, Yamada đây."
          },
          {
            "q": "＿＿、この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。　〔__, kono kanji no yomikata o oshiete kudasai.〕",
            "options": [
              "たくさん",
              "ああ",
              "もしもし",
              "すみませんが"
            ],
            "correct": 3,
            "why": "すみませんが. → **すみませんが、この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。** 〔Sumimasen ga, kono kanji no yomikata o oshiete kudasai.〕 — Xin lỗi, hãy chỉ cho tôi cách đọc chữ Hán này."
          },
          {
            "q": "{友達|ともだち}に{傘|かさ}を＿＿。　〔Tomodachi ni kasa o __.〕",
            "options": [
              "{切|き}ります",
              "{洗|あら}います",
              "{歌|うた}います",
              "{貸|か}します"
            ],
            "correct": 3,
            "why": "貸します. → **{友達|ともだち}に{傘|かさ}を{貸|か}します。** 〔Tomodachi ni kasa o kashimasu.〕 — Tôi cho bạn mượn ô."
          },
          {
            "q": "A：{塩|しお}を{取|と}ってください。B：＿＿。どうぞ。　〔A:shio o totte kudasai. B:__. Douzo.〕",
            "options": [
              "たくさん",
              "ああ",
              "もしもし",
              "いいですよ"
            ],
            "correct": 3,
            "why": "いいですよ. → **A：{塩|しお}を{取|と}ってください。B：いいですよ。どうぞ。** 〔A:shio o totte kudasai. B:ii desu yo. Douzo.〕 — A: Lấy giúp tôi muối. B: Được thôi. Đây ạ."
          },
          {
            "q": "＿＿を{弾|ひ}きます。　〔__ o hikimasu.〕",
            "options": [
              "たばこ",
              "ギター",
              "ピザ",
              "{塩|しお}"
            ],
            "correct": 1,
            "why": "弾きます + ギター. → **ギターを{弾|ひ}きます。** 〔Gitaa o hikimasu.〕 — Tôi chơi ghi ta."
          },
          {
            "q": "ここは＿＿です。バスが{来|き}ます。　〔Koko wa __ desu. Basu ga kimasu.〕",
            "options": [
              "バス{停|てい}",
              "ポスト",
              "{交番|こうばん}",
              "{改札|かいさつ}"
            ],
            "correct": 0,
            "why": "バス停. → **ここはバス{停|てい}です。バスが{来|き}ます。** 〔Koko wa basutei desu. Basu ga kimasu.〕 — Đây là trạm xe buýt. Xe buýt đến."
          }
        ]
      },
      {
        "t": "h",
        "text": "II. Chữ Hán (12 câu · 12 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b7-de-ii",
        "title": "II. Chữ Hán",
        "items": [
          {
            "q": "「だいがく」 là cách viết nào?",
            "options": [
              "大学",
              "犬学",
              "大字",
              "太学"
            ],
            "correct": 0,
            "why": "大 (đại) + 学."
          },
          {
            "q": "「しょうがくせい」 là cách viết nào?",
            "options": [
              "小字生",
              "水学生",
              "小学生",
              "少学生"
            ],
            "correct": 2,
            "why": "小 (tiểu) + 学生."
          },
          {
            "q": "「やきゅう」 là cách viết nào?",
            "options": [
              "予球",
              "野求",
              "野球",
              "里球"
            ],
            "correct": 2,
            "why": "野 + 球."
          },
          {
            "q": "「ことば」 là cách viết nào?",
            "options": [
              "言葉",
              "計葉",
              "語葉",
              "信葉"
            ],
            "correct": 0,
            "why": "言 (ngôn) + 葉."
          },
          {
            "q": "「やまだ」 là cách viết nào?",
            "options": [
              "山申",
              "山由",
              "山甲",
              "山田"
            ],
            "correct": 3,
            "why": "山 + 田 (ruộng)."
          },
          {
            "q": "「おてら」 là cách viết nào?",
            "options": [
              "お寺",
              "お持",
              "お待",
              "お時"
            ],
            "correct": 0,
            "why": "寺 (chùa); 時・待・持 chứa 寺 nhưng khác nghĩa."
          },
          {
            "q": "「にく (thịt)」 là cách viết nào?",
            "options": [
              "肉",
              "内",
              "同",
              "円"
            ],
            "correct": 0,
            "why": "肉 có hai chữ 人 bên trong."
          },
          {
            "q": "「りょうり」 là cách viết nào?",
            "options": [
              "斗理",
              "料理",
              "料里",
              "科理"
            ],
            "correct": 1,
            "why": "料 + 理."
          },
          {
            "q": "「はんぶん」 là cách viết nào?",
            "options": [
              "羊分",
              "半分",
              "平分",
              "年分"
            ],
            "correct": 1,
            "why": "半 (bán) + 分."
          },
          {
            "q": "「ちから (sức)」 là cách viết nào?",
            "options": [
              "方",
              "刀",
              "九",
              "力"
            ],
            "correct": 3,
            "why": "力 (lực)."
          },
          {
            "q": "「もん (cổng)」 là cách viết nào?",
            "options": [
              "聞",
              "門",
              "開",
              "間"
            ],
            "correct": 1,
            "why": "門 (cổng); 間・聞・開 có 門 bên ngoài nhưng khác chữ."
          },
          {
            "q": "「かい (con sò)」 là cách viết nào?",
            "options": [
              "目",
              "貝",
              "見",
              "具"
            ],
            "correct": 1,
            "why": "貝 — hai chân dài ở dưới."
          }
        ]
      },
      {
        "t": "h",
        "text": "III. Ngữ pháp (20 câu · 20 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b7-de-iii",
        "title": "III. Ngữ pháp",
        "items": [
          {
            "q": "ポストは{駅|えき}の{前|まえ}＿＿あります。　〔Posuto wa eki no mae__ arimasu.〕",
            "options": [
              "が",
              "で",
              "に",
              "を"
            ],
            "correct": 2,
            "why": "N は N に あります. → **ポストは{駅|えき}の{前|まえ}にあります。** 〔Posuto wa eki no mae ni arimasu.〕 — Hòm thư ở trước ga."
          },
          {
            "q": "{教室|きょうしつ}に{先生|せんせい}＿＿います。　〔Kyoushitsu ni sensei__ imasu.〕",
            "options": [
              "に",
              "が",
              "を",
              "で"
            ],
            "correct": 1,
            "why": "N1 に N2 が います. → **{教室|きょうしつ}に{先生|せんせい}がいます。** 〔Kyoushitsu ni sensei ga imasu.〕 — Trong lớp có cô giáo."
          },
          {
            "q": "{教室|きょうしつ}に{誰|だれ}＿＿いません。　〔Kyoushitsu ni dare__ imasen.〕",
            "options": [
              "を",
              "も",
              "が",
              "は"
            ],
            "correct": 1,
            "why": "誰も + phủ định. → **{教室|きょうしつ}に{誰|だれ}もいません。** 〔Kyoushitsu ni dare mo imasen.〕 — Trong lớp không có ai."
          },
          {
            "q": "{犬|いぬ}は{木|き}の{下|した}に＿＿。　〔Inu wa ki no shita ni __.〕",
            "options": [
              "しました",
              "ありません",
              "います",
              "あります"
            ],
            "correct": 2,
            "why": "Con vật → います. → **{犬|いぬ}は{木|き}の{下|した}にいます。** 〔Inu wa ki no shita ni imasu.〕 — Con chó ở dưới gốc cây."
          },
          {
            "q": "つくえの{上|うえ}にほん（①）（②）。　〔Tsukue no ue ni hon((1)) ((2)).〕",
            "options": [
              "① は　② いません",
              "① を　② あります",
              "① が　② います",
              "① が　② あります"
            ],
            "correct": 3,
            "why": "N に N が あります. → **つくえの{上|うえ}にほんがあります。** 〔Tsukue no ue ni hon ga arimasu.〕 — Trên bàn học có sách."
          },
          {
            "q": "すみませんが、{窓|まど}を＿＿ください。　〔Sumimasen ga, mado o __ kudasai.〕",
            "options": [
              "{開|あ}けます",
              "{開|あ}き",
              "{開|あ}けて",
              "{開|あ}ける"
            ],
            "correct": 2,
            "why": "V て ください (開ける: nhóm 2). → **すみませんが、{窓|まど}を{開|あ}けてください。** 〔Sumimasen ga, mado o akete kudasai.〕 — Xin lỗi, hãy mở cửa sổ."
          },
          {
            "q": "ここに{名前|なまえ}を＿＿ください。　〔Koko ni namae o __ kudasai.〕",
            "options": [
              "{書|か}きて",
              "{書|か}いて",
              "{書|か}んで",
              "{書|か}って"
            ],
            "correct": 1,
            "why": "書く → 書いて. → **ここに{名前|なまえ}を{書|か}いてください。** 〔Koko ni namae o kaite kudasai.〕 — Hãy viết tên vào đây."
          },
          {
            "q": "{友達|ともだち}に{本|ほん}を＿＿ください。　〔Tomodachi ni hon o __ kudasai.〕",
            "options": [
              "{貸|か}んで",
              "{貸|か}して",
              "{貸|か}って",
              "{貸|か}いて"
            ],
            "correct": 1,
            "why": "貸す → 貸して. → **{友達|ともだち}に{本|ほん}を{貸|か}してください。** 〔Tomodachi ni hon o kashite kudasai.〕 — Hãy cho bạn mượn sách."
          },
          {
            "q": "{今|いま}、コーヒーを＿＿。　〔Ima, koohii o __.〕",
            "options": [
              "{飲|の}んで います",
              "{飲|の}いて います",
              "{飲|の}って います",
              "{飲|の}みて います"
            ],
            "correct": 0,
            "why": "飲む → 飲んで. → **{今|いま}、コーヒーを{飲|の}んでいます。** 〔Ima, koohii o nonde imasu.〕 — Bây giờ tôi đang uống cà phê."
          },
          {
            "q": "{山田|やまだ}さんは{台所|だいどころ}で{料理|りょうり}を＿＿。　〔Yamadasan wa daidokoro de ryouri o __.〕",
            "options": [
              "{作|つく}んで います",
              "{作|つく}いて います",
              "{作|つく}って います",
              "{作|つく}りて います"
            ],
            "correct": 2,
            "why": "作る → 作って. → **{山田|やまだ}さんは{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。** 〔Yamadasan wa daidokoro de ryouri o tsukutte imasu.〕 — Anh Yamada đang nấu ăn ở bếp."
          },
          {
            "q": "{手伝|てつだ}い＿＿か。　〔Tetsudai__ ka.〕",
            "options": [
              "ます",
              "ました",
              "ません",
              "ましょう"
            ],
            "correct": 3,
            "why": "Vましょうか. → **{手伝|てつだ}いましょうか。** 〔Tetsudaimashou ka.〕 — Để tôi giúp nhé?"
          },
          {
            "q": "この{漢字|かんじ}の{読|よ}み＿＿を{教|おし}えてください。　〔Kono kanji no yomi__ o oshiete kudasai.〕",
            "options": [
              "{前|まえ}",
              "{人|ひと}",
              "{方|かた}",
              "{中|なか}"
            ],
            "correct": 2,
            "why": "V方. → **この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。** 〔Kono kanji no yomikata o oshiete kudasai.〕 — Hãy chỉ cho tôi cách đọc chữ Hán này."
          },
          {
            "q": "カレー＿＿{作|つく}り{方|かた}　〔Karee__ tsukurikata〕",
            "options": [
              "が",
              "の",
              "に",
              "を"
            ],
            "correct": 1,
            "why": "N の V方. → **カレーの{作|つく}り{方|かた}** 〔Karee no tsukurikata〕 — Cách nấu cà ri."
          },
          {
            "q": "A：ビールはまだありますか。B：いいえ、＿＿ありません。　〔A:biiru wa mada arimasu ka. B:iie, __ arimasen.〕",
            "options": [
              "まだ",
              "ぜひ",
              "もう",
              "ずっと"
            ],
            "correct": 2,
            "why": "もう + phủ định. → **A：ビールはまだありますか。B：いいえ、もうありません。** 〔A:biiru wa mada arimasu ka. B:iie, mou arimasen.〕 — A: Còn bia không? B: Không, hết rồi."
          },
          {
            "q": "A：＿＿が{電話|でんわ}をかけましたか。B：{山田|やまだ}さんがかけました。　〔A:__ ga denwa o kakemashita ka. B:yamadasan ga kakemashita.〕",
            "options": [
              "だれ",
              "どれ",
              "なに",
              "どこ"
            ],
            "correct": 0,
            "why": "だれが. → **A：だれが{電話|でんわ}をかけましたか。B：{山田|やまだ}さんがかけました。** 〔A:dare ga denwa o kakemashita ka. B:yamadasan ga kakemashita.〕 — A: Ai đã gọi điện? B: Anh Yamada gọi."
          },
          {
            "q": "＿＿お{皿|さら}ですか。あのお{皿|さら}です。　〔__ osara desu ka. Ano osara desu.〕",
            "options": [
              "どの",
              "どこ",
              "どちら",
              "どれ"
            ],
            "correct": 0,
            "why": "どの + N. → **どのお{皿|さら}ですか。あのお{皿|さら}です。** 〔Dono osara desu ka. Ano osara desu.〕 — Cái đĩa nào? — Cái đĩa kia."
          },
          {
            "q": "{塩|しお}は＿＿ですか。それです。　〔Shio wa __ desu ka. Sore desu.〕",
            "options": [
              "どの",
              "どちら",
              "どこ",
              "どれ"
            ],
            "correct": 3,
            "why": "どれ. → **{塩|しお}はどれですか。それです。** 〔Shio wa dore desu ka. Sore desu.〕 — Muối là cái nào? — Cái đó."
          },
          {
            "q": "はし＿＿ご{飯|はん}を{食|た}べます。　〔Hashi__ gohan o tabemasu.〕",
            "options": [
              "で",
              "を",
              "に",
              "が"
            ],
            "correct": 0,
            "why": "Dụng cụ → で. → **はしでご{飯|はん}を{食|た}べます。** 〔Hashi de gohan o tabemasu.〕 — Tôi ăn cơm bằng đũa."
          },
          {
            "q": "{日本語|にほんご}＿＿{話|はな}します。　〔Nihongo__ hanashimasu.〕",
            "options": [
              "で",
              "が",
              "に",
              "を"
            ],
            "correct": 0,
            "why": "Ngôn ngữ → で. → **{日本語|にほんご}で{話|はな}します。** 〔Nihongo de hanashimasu.〕 — Tôi nói bằng tiếng Nhật."
          },
          {
            "q": "{冷蔵庫|れいぞうこ}（①）{中|なか}（②）ビール（③）あります。　〔Reizouko((1)) naka((2)) biiru((3)) arimasu.〕",
            "options": [
              "① の　② に　③ を",
              "① の　② に　③ が",
              "① の　② で　③ が",
              "① に　② に　③ が"
            ],
            "correct": 1,
            "why": "N の 中 に N が あります. → **{冷蔵庫|れいぞうこ}の{中|なか}にビールがあります。** 〔Reizouko no naka ni biiru ga arimasu.〕 — Trong tủ lạnh có bia."
          }
        ]
      },
      {
        "t": "h",
        "text": "IV. Chia thể て (10 câu · 10 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b7-de-iv",
        "title": "IV. Chia thể て",
        "kind": "fill",
        "grammar": "Gõ thể て của động từ trong ngoặc ở phần gợi ý",
        "items": [
          {
            "q": "ここに{名前|なまえ}を＿＿ください。　〔Koko ni namae o __ kudasai.〕",
            "answers": [
              "書いて",
              "かいて"
            ],
            "hint": "書きます"
          },
          {
            "q": "この{本|ほん}を＿＿ください。　〔Kono hon o __ kudasai.〕",
            "answers": [
              "読んで",
              "よんで"
            ],
            "hint": "読みます"
          },
          {
            "q": "{皿|さら}を＿＿ください。　〔Sara o __ kudasai.〕",
            "answers": [
              "洗って",
              "あらって"
            ],
            "hint": "洗います"
          },
          {
            "q": "{窓|まど}を＿＿ください。　〔Mado o __ kudasai.〕",
            "answers": [
              "閉めて",
              "しめて"
            ],
            "hint": "閉めます"
          },
          {
            "q": "ゆっくり＿＿ください。　〔Yukkuri __ kudasai.〕",
            "answers": [
              "話して",
              "はなして"
            ],
            "hint": "話します"
          },
          {
            "q": "{早|はや}く＿＿ください。　〔Hayaku __ kudasai.〕",
            "answers": [
              "来て",
              "きて"
            ],
            "hint": "来ます"
          },
          {
            "q": "{地図|ちず}を＿＿ください。　〔Chizu o __ kudasai.〕",
            "answers": [
              "見て",
              "みて"
            ],
            "hint": "見ます"
          },
          {
            "q": "ここで＿＿ください。　〔Koko de __ kudasai.〕",
            "answers": [
              "待って",
              "まって"
            ],
            "hint": "待ちます"
          },
          {
            "q": "{一緒|いっしょ}に＿＿ください。　〔Issho ni __ kudasai.〕",
            "answers": [
              "勉強して",
              "べんきょうして"
            ],
            "hint": "勉強します"
          },
          {
            "q": "{傘|かさ}を＿＿ください。　〔Kasa o __ kudasai.〕",
            "answers": [
              "貸して",
              "かして"
            ],
            "hint": "貸します"
          }
        ]
      },
      {
        "t": "h",
        "text": "V. Đọc hiểu (4 câu · 4 điểm)"
      },
      {
        "t": "passage",
        "title": "V. Đọc hiểu — Nhà bếp của Marco",
        "intro": "Đọc đoạn rồi trả lời 4 câu.",
        "paras": [
          {
            "text": "マルコさんのうちに{台所|だいどころ}があります。{台所|だいどころ}に{冷蔵庫|れいぞうこ}とテーブルがあります。{冷蔵庫|れいぞうこ}の{中|なか}にビールがあります。テーブルの{上|うえ}にナイフとフォークがあります。マルコさんは{今|いま}、{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。パクさんは{窓|まど}を{開|あ}けています。"
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
            "en": "マルコさんのうちに{台所|だいどころ}があります。",
            "ro": "Maruko-san no uchi ni daidokoro ga arimasu.",
            "vi": "Nhà Marco có một nhà bếp."
          },
          {
            "en": "{台所|だいどころ}に{冷蔵庫|れいぞうこ}とテーブルがあります。",
            "ro": "Daidokoro ni reizouko to teeburu ga arimasu.",
            "vi": "Trong bếp có tủ lạnh và bàn."
          },
          {
            "en": "{冷蔵庫|れいぞうこ}の{中|なか}にビールがあります。",
            "ro": "Reizouko no naka ni biiru ga arimasu.",
            "vi": "Trong tủ lạnh có bia."
          },
          {
            "en": "テーブルの{上|うえ}にナイフとフォークがあります。",
            "ro": "Teeburu no ue ni naifu to fooku ga arimasu.",
            "vi": "Trên bàn có dao và dĩa."
          },
          {
            "en": "マルコさんは{今|いま}、{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。",
            "ro": "Maruko-san wa ima, daidokoro de ryouri o tsukutte imasu.",
            "vi": "Bây giờ Marco đang nấu ăn trong bếp."
          },
          {
            "en": "パクさんは{窓|まど}を{開|あ}けています。",
            "ro": "Paku-san wa mado o akete imasu.",
            "vi": "Park đang mở cửa sổ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-de-v",
        "title": "V. Câu hỏi đọc hiểu",
        "items": [
          {
            "q": "Trong tủ lạnh có gì?",
            "options": [
              "Dao",
              "Dĩa",
              "Bia",
              "Hoa"
            ],
            "correct": 2,
            "why": "冷蔵庫の 中に ビール."
          },
          {
            "q": "Trên bàn có gì?",
            "options": [
              "Bia và dao",
              "Hoa và đĩa",
              "Chỉ có dĩa",
              "Dao và dĩa"
            ],
            "correct": 3,
            "why": "ナイフと フォーク."
          },
          {
            "q": "Marco đang làm gì?",
            "options": [
              "Mở cửa sổ",
              "Chơi ghi ta",
              "Gọi điện",
              "Nấu ăn"
            ],
            "correct": 3,
            "why": "料理を 作って います."
          },
          {
            "q": "Park đang làm gì?",
            "options": [
              "Cắt thịt",
              "Nấu ăn",
              "Mở cửa sổ",
              "Rửa đĩa"
            ],
            "correct": 2,
            "why": "窓を 開けて います."
          }
        ]
      },
      {
        "t": "h",
        "text": "VI. Dịch (9 câu · 9 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b7-de-vi-a",
        "title": "VI-a. Dịch Việt → Nhật",
        "kind": "translate",
        "grammar": "ポイント 61–71",
        "items": [
          {
            "q": "Trước ga có hòm thư.",
            "answers": [
              "駅の前にポストがあります。",
              "駅のまえにポストがあります。",
              "えきの前にポストがあります。",
              "えきのまえにポストがあります。"
            ],
            "hint": "N に N が あります"
          },
          {
            "q": "Hãy cho tôi mượn cái ô.",
            "answers": [
              "傘を貸してください。",
              "傘をかしてください。",
              "かさを貸してください。",
              "かさをかしてください。",
              "すみませんが、傘を貸してください。",
              "すみませんが、傘をかしてください。",
              "すみませんが、かさを貸してください。",
              "すみませんが、かさをかしてください。"
            ],
            "hint": "V て ください"
          },
          {
            "q": "Anh Yamada đang rửa đĩa ở bếp.",
            "answers": [
              "山田さんは台所でお皿を洗っています。",
              "山田さんは台所でお皿をあらっています。",
              "山田さんは台所でおさらを洗っています。",
              "山田さんは台所でおさらをあらっています。",
              "山田さんはだいどころでお皿を洗っています。",
              "山田さんはだいどころでお皿をあらっています。",
              "山田さんはだいどころでおさらを洗っています。",
              "山田さんはだいどころでおさらをあらっています。",
              "やまださんは台所でお皿を洗っています。",
              "やまださんは台所でお皿をあらっています。",
              "やまださんは台所でおさらを洗っています。",
              "やまださんは台所でおさらをあらっています。",
              "やまださんはだいどころでお皿を洗っています。",
              "やまださんはだいどころでお皿をあらっています。",
              "やまださんはだいどころでおさらを洗っています。",
              "やまださんはだいどころでおさらをあらっています。",
              "山田さんは台所で皿を洗っています。",
              "山田さんは台所で皿をあらっています。",
              "山田さんは台所でさらを洗っています。",
              "山田さんは台所でさらをあらっています。",
              "山田さんはだいどころで皿を洗っています。",
              "山田さんはだいどころで皿をあらっています。",
              "山田さんはだいどころでさらを洗っています。",
              "山田さんはだいどころでさらをあらっています。",
              "やまださんは台所で皿を洗っています。",
              "やまださんは台所で皿をあらっています。",
              "やまださんは台所でさらを洗っています。",
              "やまださんは台所でさらをあらっています。",
              "やまださんはだいどころで皿を洗っています。",
              "やまださんはだいどころで皿をあらっています。",
              "やまださんはだいどころでさらを洗っています。",
              "やまださんはだいどころでさらをあらっています。"
            ],
            "hint": "V て います"
          },
          {
            "q": "Để tôi mở cửa sổ nhé?",
            "answers": [
              "窓を開けましょうか。",
              "窓をあけましょうか。",
              "まどを開けましょうか。",
              "まどをあけましょうか。"
            ],
            "hint": "Vましょうか"
          },
          {
            "q": "Hãy chỉ cho tôi cách dùng cái điện thoại này.",
            "answers": [
              "この電話の使い方を教えてください。",
              "この電話の使い方をおしえてください。",
              "この電話の使いかたを教えてください。",
              "この電話の使いかたをおしえてください。",
              "この電話のつかい方を教えてください。",
              "この電話のつかい方をおしえてください。",
              "この電話のつかいかたを教えてください。",
              "この電話のつかいかたをおしえてください。",
              "このでんわの使い方を教えてください。",
              "このでんわの使い方をおしえてください。",
              "このでんわの使いかたを教えてください。",
              "このでんわの使いかたをおしえてください。",
              "このでんわのつかい方を教えてください。",
              "このでんわのつかい方をおしえてください。",
              "このでんわのつかいかたを教えてください。",
              "このでんわのつかいかたをおしえてください。"
            ],
            "hint": "V方 · 教えて ください"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b7-de-vi-b",
        "title": "VI-b. Dịch Nhật → Việt",
        "items": [
          {
            "q": "Nghĩa của câu: テーブルの{下|した}に{犬|いぬ}がいます。　〔Teeburu no shita ni inu ga imasu.〕",
            "options": [
              "Dưới bàn có một cái ghế.",
              "Con chó đang ở trong bàn.",
              "Dưới bàn có một con chó.",
              "Trên bàn có một con chó."
            ],
            "correct": 2,
            "why": "下 = dưới; います = người/con vật."
          },
          {
            "q": "Nghĩa của câu: すみませんが、{塩|しお}を{取|と}ってください。　〔Sumimasen ga, shio o totte kudasai.〕",
            "options": [
              "Để tôi lấy muối nhé?",
              "Xin lỗi, hãy lấy giúp tôi muối.",
              "Xin lỗi, tôi đang lấy muối.",
              "Muối ở đâu vậy?"
            ],
            "correct": 1,
            "why": "V て ください = nhờ."
          },
          {
            "q": "Nghĩa của câu: ビールはもうありません。　〔Biiru wa mou arimasen.〕",
            "options": [
              "Bia chưa mang tới.",
              "Tôi đã uống bia.",
              "Bia hết rồi.",
              "Bia vẫn còn."
            ],
            "correct": 2,
            "why": "もう + phủ định = không còn nữa."
          },
          {
            "q": "Nghĩa của câu: {誰|だれ}がギターを{弾|ひ}いていますか。　〔Dare ga gitaa o hiite imasu ka.〕",
            "options": [
              "Bạn có chơi ghi ta không?",
              "Ghi ta ở đâu?",
              "Ai muốn chơi ghi ta?",
              "Ai đang chơi ghi ta?"
            ],
            "correct": 3,
            "why": "誰が … ています."
          }
        ]
      }
    ]
  }
];
