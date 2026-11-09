/**
 * BỘ LUYỆN THÊM Bài 15 (khoá できる日本語 /language/ja/dekiru) — bài CUỐI sách — từ DỄ → VỪA → KHÓ.
 *
 * Mỗi lesson: mở đầu bằng "Học thế nào", chia 3 mức 🟢 Dễ · 🟡 Vừa · 🔴 Khó, mọi câu có đáp án + giải thích.
 * lt-b15-…: テレビ・雑誌から — từ vựng (48 từ của danh sách chính thức 第１５課 + 10 từ bài đọc/nghe) · chữ Hán
 *   (天気晴雨曇降台震事故急心) · thể たら · thể ても · 普通形＋そうです · ngữ pháp 1 (ポイント 119, 124 — 普通形そうです,
 *   N で nguyên nhân) · ngữ pháp 2 (120, 121, 123 — ～たら, ～ても, きっと／たぶん～と思います) · ngữ pháp 3 (122 —
 *   tự động từ + ています trạng thái + TRỘN cả 6 điểm) · hội thoại · đọc hiểu · nghe · nói & viết · đề tổng hợp ·
 *   ÔN TỔNG Bài 11–15 (bài cuối sách: đủ dạng, bảng "sai câu nào ôn bài nào").
 * Mọi câu, hội thoại, kịch bản nghe, bài đọc VIẾT MỚI (không chép sách/đề của cô); chữ Hán có furigana {漢字|かな};
 * romaji cho mọi câu tiếng Nhật (nhúng trong câu hỏi dạng 〔romaji〕 hoặc trường ro).
 * Vai (bảng nhân vật sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン (giọng ja-nu, vai a/c) ·
 *   nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生 (ja-nam, vai b).
 * FILE SINH TỰ ĐỘNG từ bộ soạn ~/Documents/JPD123/bo-soan-dekiru/lt15/ — sửa bản gốc rồi sinh lại.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export const LUYEN_THEM_B15: Lesson[] = [
  {
    "id": "lt-b15-tu-vung",
    "kind": "homework",
    "title": "Luyện thêm Bài 15 · Từ vựng — nhận mặt → điền câu → dịch (3 mức, ~278 câu)",
    "goal": "Nhớ chắc 58/58 từ của Bài 15 (thời tiết, thiên tai, tin tức · tạp chí, kế hoạch ra phố · tả cảnh ngoài phố · cuộc thi hùng biện): nhìn từ biết nghĩa, nhớ từ từ nghĩa, điền đúng vào câu, dịch Việt → Nhật.",
    "minutes": 85,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đi **🟢 → 🟡 → 🔴**. Mức Dễ có 5 nhóm × 2 lượt (Nhật → Việt, Việt → Nhật) cho đủ 58 từ (48 từ của danh sách chính thức + 10 từ ở bài đọc, bài nghe) — chia 2 buổi nếu cần. Sai từ nào, **đọc to 3 lần** (romaji trong câu hỏi) rồi làm lại cả khối sau 10 phút.",
          "Bài 15 có **rất nhiều tự động từ** (vật tự …, đi với **が**): 電車**が** 止まります · 授業**が** 始まります · 人**が** 集まります · 店**が** 閉まります · 電気**が** 消えます · パソコン**が** 壊れます · コップ**が** 汚れます／割れます. Học kèm tha động từ (người làm, đi với **を**): 止めます · 始めます · 集めます · 閉めます · 消します. Tự động từ + **ています** = trạng thái đang thấy (ポイント 122).",
          "Cặp dễ lẫn: **混みます (đông) / すきます (vắng)** · **勝ちます / 負けます** (đều đi với **に**) · **死にます (nói thẳng) / 亡くなります (lịch sự)** · **きっと (chắc chắn) / たぶん (có lẽ) / もし (nếu)** · **降ります ふる (mưa rơi) / 降ります おりる (xuống xe)** · **風 (gió) / 風邪 (cảm)** · **できます: có thể (Bài 9) / được xây xong, mở ra (Bài 15)**."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhìn từ → biết nghĩa; nghe nghĩa → nhớ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-jv1",
        "title": "Nhật → Việt — nhóm A1: danh từ — thời tiết, tin tức, sự kiện (chủ đề これ、知ってる？) (13 câu)",
        "items": [
          {
            "q": "「ガラス」 〔garasu〕 nghĩa là gì?",
            "options": [
              "kính, thuỷ tinh",
              "bão",
              "chợ đồ cũ, chợ trời",
              "đội (thể thao)"
            ],
            "correct": 0,
            "why": "**ガラス** (garasu) = kính, thuỷ tinh — 窓ガラス = kính cửa sổ"
          },
          {
            "q": "「{曇|くも}り」 〔kumori〕 nghĩa là gì?",
            "options": [
              "ngày xưa, hồi trước",
              "trời nhiều mây, trời râm",
              "đội (thể thao)",
              "kính, thuỷ tinh"
            ],
            "correct": 1,
            "why": "**{曇|くも}り** (kumori) = trời nhiều mây, trời râm — 明日は 曇りです"
          },
          {
            "q": "「{台風|たいふう}」 〔taifuu〕 nghĩa là gì?",
            "options": [
              "trời nhiều mây, trời râm",
              "bão",
              "sự thật, thật",
              "chiều tối, lúc chạng vạng"
            ],
            "correct": 1,
            "why": "**{台風|たいふう}** (taifuu) = bão — 台風が 来ます"
          },
          {
            "q": "「{地震|じしん}」 〔jishin〕 nghĩa là gì?",
            "options": [
              "tai nạn, sự cố",
              "chợ đồ cũ, chợ trời",
              "sự thật, thật",
              "động đất"
            ],
            "correct": 3,
            "why": "**{地震|じしん}** (jishin) = động đất — 地震が あります"
          },
          {
            "q": "「{事故|じこ}」 〔jiko〕 nghĩa là gì?",
            "options": [
              "tai nạn, sự cố",
              "huỷ, hoãn, dừng lại",
              "đại hội, cuộc thi, lễ hội lớn",
              "ngày xưa, hồi trước"
            ],
            "correct": 0,
            "why": "**{事故|じこ}** (jiko) = tai nạn, sự cố — 事故で 電車が 止まりました"
          },
          {
            "q": "「～{大会|たいかい}」 〔~taikai〕 nghĩa là gì?",
            "options": [
              "miễn phí",
              "trời nhiều mây, trời râm",
              "tai nạn, sự cố",
              "đại hội, cuộc thi, lễ hội lớn"
            ],
            "correct": 3,
            "why": "**～{大会|たいかい}** (~taikai) = đại hội, cuộc thi, lễ hội lớn — 花火大会 = lễ hội pháo hoa"
          },
          {
            "q": "「チーム」 〔chiimu〕 nghĩa là gì?",
            "options": [
              "tai nạn, sự cố",
              "chiều tối, lúc chạng vạng",
              "đội (thể thao)",
              "chợ đồ cũ, chợ trời"
            ],
            "correct": 2,
            "why": "**チーム** (chiimu) = đội (thể thao)"
          },
          {
            "q": "「{中止|ちゅうし}」 〔chuushi〕 nghĩa là gì?",
            "options": [
              "huỷ, hoãn, dừng lại",
              "đội (thể thao)",
              "sự thật, thật",
              "chợ đồ cũ, chợ trời"
            ],
            "correct": 0,
            "why": "**{中止|ちゅうし}** (chuushi) = huỷ, hoãn, dừng lại — 雨だったら、中止です"
          },
          {
            "q": "「フリーマーケット」 〔furii maaketto〕 nghĩa là gì?",
            "options": [
              "miễn phí",
              "trời nhiều mây, trời râm",
              "chợ đồ cũ, chợ trời",
              "sự thật, thật"
            ],
            "correct": 2,
            "why": "**フリーマーケット** (furii maaketto) = chợ đồ cũ, chợ trời"
          },
          {
            "q": "「{本当|ほんとう}」 〔hontou〕 nghĩa là gì?",
            "options": [
              "chợ đồ cũ, chợ trời",
              "sự thật, thật",
              "huỷ, hoãn, dừng lại",
              "đại hội, cuộc thi, lễ hội lớn"
            ],
            "correct": 1,
            "why": "**{本当|ほんとう}** (hontou) = sự thật, thật — 本当ですか = thật à?"
          },
          {
            "q": "「{昔|むかし}」 〔mukashi〕 nghĩa là gì?",
            "options": [
              "miễn phí",
              "ngày xưa, hồi trước",
              "đội (thể thao)",
              "huỷ, hoãn, dừng lại"
            ],
            "correct": 1,
            "why": "**{昔|むかし}** (mukashi) = ngày xưa, hồi trước"
          },
          {
            "q": "「{無料|むりょう}」 〔muryou〕 nghĩa là gì?",
            "options": [
              "đội (thể thao)",
              "đại hội, cuộc thi, lễ hội lớn",
              "bão",
              "miễn phí"
            ],
            "correct": 3,
            "why": "**{無料|むりょう}** (muryou) = miễn phí — N + だそうです: 無料だそうです"
          },
          {
            "q": "「{夕方|ゆうがた}」 〔yuugata〕 nghĩa là gì?",
            "options": [
              "chiều tối, lúc chạng vạng",
              "miễn phí",
              "trời nhiều mây, trời râm",
              "sự thật, thật"
            ],
            "correct": 0,
            "why": "**{夕方|ゆうがた}** (yuugata) = chiều tối, lúc chạng vạng"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-jv2",
        "title": "Nhật → Việt — nhóm A2: động từ, tính từ — chuyện xảy ra (chủ đề これ、知ってる？) (14 câu)",
        "items": [
          {
            "q": "「{死|し}にます」 〔shinimasu〕 nghĩa là gì?",
            "options": [
              "(tàu, xe, máy) dừng lại",
              "(việc gì) bắt đầu",
              "thua",
              "chết"
            ],
            "correct": 3,
            "why": "**{死|し}にます** (shinimasu) = chết — nhóm 1 — 死ぬ · 死んで · 死んだ"
          },
          {
            "q": "「{亡|な}くなります」 〔nakunarimasu〕 nghĩa là gì?",
            "options": [
              "(được) xây xong, mở ra, có",
              "(tàu, xe, máy) dừng lại",
              "(việc gì) bắt đầu",
              "qua đời, mất (lịch sự)"
            ],
            "correct": 3,
            "why": "**{亡|な}くなります** (nakunarimasu) = qua đời, mất (lịch sự) — nhóm 1 — dùng cho người"
          },
          {
            "q": "「{止|と}まります」 〔tomarimasu〕 nghĩa là gì?",
            "options": [
              "(cốc, kính) vỡ",
              "chết",
              "(tàu, xe, máy) dừng lại",
              "thắng"
            ],
            "correct": 2,
            "why": "**{止|と}まります** (tomarimasu) = (tàu, xe, máy) dừng lại — nhóm 1, tự động từ — 電車が 止まります (↔ 止めます)"
          },
          {
            "q": "「{始|はじ}まります」 〔hajimarimasu〕 nghĩa là gì?",
            "options": [
              "(cốc, kính) vỡ",
              "chết",
              "lo lắng",
              "(việc gì) bắt đầu"
            ],
            "correct": 3,
            "why": "**{始|はじ}まります** (hajimarimasu) = (việc gì) bắt đầu — nhóm 1, tự động từ — 授業が 始まります (↔ 始めます)"
          },
          {
            "q": "「{降|ふ}ります」 〔furimasu〕 nghĩa là gì?",
            "options": [
              "nhập viện",
              "qua đời, mất (lịch sự)",
              "sợ, đáng sợ",
              "(mưa, tuyết) rơi"
            ],
            "correct": 3,
            "why": "**{降|ふ}ります** (furimasu) = (mưa, tuyết) rơi — nhóm 1 — 雨が 降ります; khác 降ります (おります, xuống xe)"
          },
          {
            "q": "「{勝|か}ちます」 〔kachimasu〕 nghĩa là gì?",
            "options": [
              "sợ, đáng sợ",
              "(việc gì) bắt đầu",
              "thắng",
              "kết hôn"
            ],
            "correct": 2,
            "why": "**{勝|か}ちます** (kachimasu) = thắng — nhóm 1 — N に 勝ちます"
          },
          {
            "q": "「{負|ま}けます」 〔makemasu〕 nghĩa là gì?",
            "options": [
              "kết hôn",
              "qua đời, mất (lịch sự)",
              "(cốc, kính) vỡ",
              "thua"
            ],
            "correct": 3,
            "why": "**{負|ま}けます** (makemasu) = thua — nhóm 2 — N に 負けます"
          },
          {
            "q": "「{倒|たお}れます」 〔taoremasu〕 nghĩa là gì?",
            "options": [
              "(cốc, kính) vỡ",
              "(được) xây xong, mở ra, có",
              "(nhà, cây) đổ; (người) ngã quỵ",
              "(mưa, tuyết) rơi"
            ],
            "correct": 2,
            "why": "**{倒|たお}れます** (taoremasu) = (nhà, cây) đổ; (người) ngã quỵ — nhóm 2 — 木が 倒れます"
          },
          {
            "q": "「できます」 〔dekimasu〕 nghĩa là gì?",
            "options": [
              "(được) xây xong, mở ra, có",
              "(tàu, xe, máy) dừng lại",
              "(mưa, tuyết) rơi",
              "sợ, đáng sợ"
            ],
            "correct": 0,
            "why": "**できます** (dekimasu) = (được) xây xong, mở ra, có — nhóm 2 — 新しい 店が できます (nghĩa mới, khác \"có thể\")"
          },
          {
            "q": "「{割|わ}れます」 〔waremasu〕 nghĩa là gì?",
            "options": [
              "thua",
              "(cốc, kính) vỡ",
              "(được) xây xong, mở ra, có",
              "qua đời, mất (lịch sự)"
            ],
            "correct": 1,
            "why": "**{割|わ}れます** (waremasu) = (cốc, kính) vỡ — nhóm 2 — ガラスが 割れます"
          },
          {
            "q": "「{結婚|けっこん}します」 〔kekkon shimasu〕 nghĩa là gì?",
            "options": [
              "nhập viện",
              "thua",
              "kết hôn",
              "qua đời, mất (lịch sự)"
            ],
            "correct": 2,
            "why": "**{結婚|けっこん}します** (kekkon shimasu) = kết hôn — nhóm 3 — N と 結婚します"
          },
          {
            "q": "「{入院|にゅういん}します」 〔nyuuin shimasu〕 nghĩa là gì?",
            "options": [
              "thắng",
              "qua đời, mất (lịch sự)",
              "nhập viện",
              "(việc gì) bắt đầu"
            ],
            "correct": 2,
            "why": "**{入院|にゅういん}します** (nyuuin shimasu) = nhập viện — nhóm 3"
          },
          {
            "q": "「{怖|こわ}い」 〔kowai〕 nghĩa là gì?",
            "options": [
              "sợ, đáng sợ",
              "lo lắng",
              "kết hôn",
              "thắng"
            ],
            "correct": 0,
            "why": "**{怖|こわ}い** (kowai) = sợ, đáng sợ — tính từ い"
          },
          {
            "q": "「{心配|しんぱい}（な）」 〔shinpai (na)〕 nghĩa là gì?",
            "options": [
              "(tàu, xe, máy) dừng lại",
              "nhập viện",
              "(nhà, cây) đổ; (người) ngã quỵ",
              "lo lắng"
            ],
            "correct": 3,
            "why": "**{心配|しんぱい}（な）** (shinpai (na)) = lo lắng — tính từ な / 心配します"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-jv3",
        "title": "Nhật → Việt — nhóm B: tạp chí, kế hoạch ra phố, đoán (chủ đề 雑誌を見て町へ) (14 câu)",
        "items": [
          {
            "q": "「{風|かぜ}」 〔kaze〕 nghĩa là gì?",
            "options": [
              "mạnh",
              "kịp (giờ)",
              "đông, chật",
              "gió"
            ],
            "correct": 3,
            "why": "**{風|かぜ}** (kaze) = gió — 風が 強いです; khác 風邪 (cảm)"
          },
          {
            "q": "「ストラップ」 〔sutorappu〕 nghĩa là gì?",
            "options": [
              "gió",
              "chỗ ngồi, ghế",
              "dây đeo (điện thoại, máy ảnh)",
              "giảm ～ (giá)"
            ],
            "correct": 2,
            "why": "**ストラップ** (sutorappu) = dây đeo (điện thoại, máy ảnh)"
          },
          {
            "q": "「{席|せき}」 〔seki〕 nghĩa là gì?",
            "options": [
              "đông, chật",
              "chỗ ngồi, ghế",
              "dây đeo (điện thoại, máy ảnh)",
              "kịp (giờ)"
            ],
            "correct": 1,
            "why": "**{席|せき}** (seki) = chỗ ngồi, ghế"
          },
          {
            "q": "「{急|いそ}ぎます」 〔isogimasu〕 nghĩa là gì?",
            "options": [
              "đông, chật",
              "vội, gấp",
              "chỗ ngồi, ghế",
              "dây đeo (điện thoại, máy ảnh)"
            ],
            "correct": 1,
            "why": "**{急|いそ}ぎます** (isogimasu) = vội, gấp — nhóm 1 — 急いで ください"
          },
          {
            "q": "「{混|こ}みます」 〔komimasu〕 nghĩa là gì?",
            "options": [
              "đông, chật",
              "chắc chắn (tin mạnh)",
              "dây đeo (điện thoại, máy ảnh)",
              "(trời) nắng, quang đãng"
            ],
            "correct": 0,
            "why": "**{混|こ}みます** (komimasu) = đông, chật — nhóm 1 — 混んで います"
          },
          {
            "q": "「{間|ま}に{合|あ}います」 〔ma ni aimasu〕 nghĩa là gì?",
            "options": [
              "nếu (giả định)",
              "giảm ～ (giá)",
              "kịp (giờ)",
              "đông, chật"
            ],
            "correct": 2,
            "why": "**{間|ま}に{合|あ}います** (ma ni aimasu) = kịp (giờ) — nhóm 1 — N に 間に合います"
          },
          {
            "q": "「やみます」 〔yamimasu〕 nghĩa là gì?",
            "options": [
              "(mưa, gió) tạnh, ngừng",
              "có lẽ, chắc là",
              "～ phần trăm (%)",
              "chắc chắn (tin mạnh)"
            ],
            "correct": 0,
            "why": "**やみます** (yamimasu) = (mưa, gió) tạnh, ngừng — nhóm 1 — 雨が やみます"
          },
          {
            "q": "「{晴|は}れます」 〔haremasu〕 nghĩa là gì?",
            "options": [
              "chỗ ngồi, ghế",
              "đông, chật",
              "có lẽ, chắc là",
              "(trời) nắng, quang đãng"
            ],
            "correct": 3,
            "why": "**{晴|は}れます** (haremasu) = (trời) nắng, quang đãng — nhóm 2"
          },
          {
            "q": "「～パーセント」 〔~paasento〕 nghĩa là gì?",
            "options": [
              "dây đeo (điện thoại, máy ảnh)",
              "～ phần trăm (%)",
              "chỗ ngồi, ghế",
              "gió"
            ],
            "correct": 1,
            "why": "**～パーセント** (~paasento) = ～ phần trăm (%)"
          },
          {
            "q": "「～{引|び}き」 〔~biki〕 nghĩa là gì?",
            "options": [
              "giảm ～ (giá)",
              "kịp (giờ)",
              "chỗ ngồi, ghế",
              "(trời) nắng, quang đãng"
            ],
            "correct": 0,
            "why": "**～{引|び}き** (~biki) = giảm ～ (giá) — 10パーセント引き = giảm 10%"
          },
          {
            "q": "「{強|つよ}い」 〔tsuyoi〕 nghĩa là gì?",
            "options": [
              "～ phần trăm (%)",
              "mạnh",
              "có lẽ, chắc là",
              "kịp (giờ)"
            ],
            "correct": 1,
            "why": "**{強|つよ}い** (tsuyoi) = mạnh — tính từ い — 強い 風 · 強い チーム"
          },
          {
            "q": "「きっと」 〔kitto〕 nghĩa là gì?",
            "options": [
              "chắc chắn (tin mạnh)",
              "nếu (giả định)",
              "～ phần trăm (%)",
              "dây đeo (điện thoại, máy ảnh)"
            ],
            "correct": 0,
            "why": "**きっと** (kitto) = chắc chắn (tin mạnh) — ～と 思います"
          },
          {
            "q": "「たぶん」 〔tabun〕 nghĩa là gì?",
            "options": [
              "có lẽ, chắc là",
              "dây đeo (điện thoại, máy ảnh)",
              "đông, chật",
              "～ phần trăm (%)"
            ],
            "correct": 0,
            "why": "**たぶん** (tabun) = có lẽ, chắc là — ít chắc hơn きっと"
          },
          {
            "q": "「もし」 〔moshi〕 nghĩa là gì?",
            "options": [
              "mạnh",
              "chỗ ngồi, ghế",
              "nếu (giả định)",
              "vội, gấp"
            ],
            "correct": 2,
            "why": "**もし** (moshi) = nếu (giả định) — もし ～たら"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-jv4",
        "title": "Nhật → Việt — nhóm C: tả cảnh ngoài phố — tự động từ (chủ đề 町を歩いて) (7 câu)",
        "items": [
          {
            "q": "「{集|あつ}まります」 〔atsumarimasu〕 nghĩa là gì?",
            "options": [
              "gật đầu",
              "(người) tập trung, tụ tập",
              "qua đời, mất (lịch sự)",
              "gió"
            ],
            "correct": 1,
            "why": "**{集|あつ}まります** (atsumarimasu) = (người) tập trung, tụ tập — nhóm 1, tự động từ — 人が 集まります"
          },
          {
            "q": "「{閉|し}まります」 〔shimarimasu〕 nghĩa là gì?",
            "options": [
              "(mưa, gió) tạnh, ngừng",
              "bẩn, dơ",
              "hội trường",
              "(cửa, cửa hàng) đóng"
            ],
            "correct": 3,
            "why": "**{閉|し}まります** (shimarimasu) = (cửa, cửa hàng) đóng — nhóm 1, tự động từ — 店が 閉まって います"
          },
          {
            "q": "「すきます」 〔sukimasu〕 nghĩa là gì?",
            "options": [
              "vắng, thưa (↔ 混みます)",
              "(người) tập trung, tụ tập",
              "vội, gấp",
              "chỗ ngồi, ghế"
            ],
            "correct": 0,
            "why": "**すきます** (sukimasu) = vắng, thưa (↔ 混みます) — nhóm 1 — すいて います"
          },
          {
            "q": "「{落|お}ちます」 〔ochimasu〕 nghĩa là gì?",
            "options": [
              "cuộc thi hùng biện",
              "rơi, rớt",
              "hạng ～, giải ～",
              "(cửa, cửa hàng) đóng"
            ],
            "correct": 1,
            "why": "**{落|お}ちます** (ochimasu) = rơi, rớt — nhóm 2 — 財布が 落ちて います"
          },
          {
            "q": "「{消|き}えます」 〔kiemasu〕 nghĩa là gì?",
            "options": [
              "(mưa, tuyết) rơi",
              "cuộc thi hùng biện",
              "qua đời, mất (lịch sự)",
              "(đèn) tắt; biến mất"
            ],
            "correct": 3,
            "why": "**{消|き}えます** (kiemasu) = (đèn) tắt; biến mất — nhóm 2, tự động từ — 電気が 消えます (↔ 消します)"
          },
          {
            "q": "「{壊|こわ}れます」 〔kowaremasu〕 nghĩa là gì?",
            "options": [
              "(cốc, kính) vỡ",
              "mạnh",
              "(việc gì) bắt đầu",
              "(máy, đồ vật) hỏng"
            ],
            "correct": 3,
            "why": "**{壊|こわ}れます** (kowaremasu) = (máy, đồ vật) hỏng — nhóm 2 — パソコンが 壊れて います"
          },
          {
            "q": "「{汚|よご}れます」 〔yogoremasu〕 nghĩa là gì?",
            "options": [
              "bẩn, dơ",
              "kỷ niệm",
              "tai nạn, sự cố",
              "động đất"
            ],
            "correct": 0,
            "why": "**{汚|よご}れます** (yogoremasu) = bẩn, dơ — nhóm 2 — コップが 汚れて います"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-jv5",
        "title": "Nhật → Việt — nhóm D: từ của bài đọc, bài nghe — cuộc thi hùng biện (10 câu)",
        "items": [
          {
            "q": "「スピーチコンテスト」 〔supiichi kontesuto〕 nghĩa là gì?",
            "options": [
              "hội trường",
              "cười",
              "cuộc thi hùng biện",
              "gật đầu"
            ],
            "correct": 2,
            "why": "**スピーチコンテスト** (supiichi kontesuto) = cuộc thi hùng biện"
          },
          {
            "q": "「～{位|い}」 〔~i〕 nghĩa là gì?",
            "options": [
              "hạng ～, giải ～",
              "địa điểm tổ chức, hội trường",
              "thật không ngờ, vậy mà",
              "cười"
            ],
            "correct": 0,
            "why": "**～{位|い}** (~i) = hạng ～, giải ～ — 1位 = hạng nhất"
          },
          {
            "q": "「{最後|さいご}」 〔saigo〕 nghĩa là gì?",
            "options": [
              "hạng ～, giải ～",
              "cuối cùng",
              "cuộc thi hùng biện",
              "kỷ niệm"
            ],
            "correct": 1,
            "why": "**{最後|さいご}** (saigo) = cuối cùng — 最後まで = đến cuối"
          },
          {
            "q": "「ホール」 〔hooru〕 nghĩa là gì?",
            "options": [
              "hội trường",
              "gật đầu",
              "hạng ～, giải ～",
              "kỷ niệm"
            ],
            "correct": 0,
            "why": "**ホール** (hooru) = hội trường"
          },
          {
            "q": "「{思|おも}い{出|で}」 〔omoide〕 nghĩa là gì?",
            "options": [
              "thật không ngờ, vậy mà",
              "cuối cùng",
              "kỷ niệm",
              "cười"
            ],
            "correct": 2,
            "why": "**{思|おも}い{出|で}** (omoide) = kỷ niệm — いい 思い出に なりました"
          },
          {
            "q": "「うなずきます」 〔unazukimasu〕 nghĩa là gì?",
            "options": [
              "thật không ngờ, vậy mà",
              "địa điểm tổ chức, hội trường",
              "gật đầu",
              "hội trường"
            ],
            "correct": 2,
            "why": "**うなずきます** (unazukimasu) = gật đầu — nhóm 1"
          },
          {
            "q": "「{緊張|きんちょう}します」 〔kinchou shimasu〕 nghĩa là gì?",
            "options": [
              "hồi hộp, căng thẳng",
              "hội trường",
              "cuộc thi hùng biện",
              "gật đầu"
            ],
            "correct": 0,
            "why": "**{緊張|きんちょう}します** (kinchou shimasu) = hồi hộp, căng thẳng — nhóm 3"
          },
          {
            "q": "「{笑|わら}います」 〔waraimasu〕 nghĩa là gì?",
            "options": [
              "thật không ngờ, vậy mà",
              "cười",
              "hạng ～, giải ～",
              "hồi hộp, căng thẳng"
            ],
            "correct": 1,
            "why": "**{笑|わら}います** (waraimasu) = cười — nhóm 1"
          },
          {
            "q": "「なんと」 〔nanto〕 nghĩa là gì?",
            "options": [
              "cuối cùng",
              "thật không ngờ, vậy mà",
              "kỷ niệm",
              "hồi hộp, căng thẳng"
            ],
            "correct": 1,
            "why": "**なんと** (nanto) = thật không ngờ, vậy mà — dẫn tới điều bất ngờ"
          },
          {
            "q": "「{会場|かいじょう}」 〔kaijou〕 nghĩa là gì?",
            "options": [
              "cuộc thi hùng biện",
              "địa điểm tổ chức, hội trường",
              "hạng ～, giải ～",
              "hồi hộp, căng thẳng"
            ],
            "correct": 1,
            "why": "**{会場|かいじょう}** (kaijou) = địa điểm tổ chức, hội trường"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-vj1",
        "title": "Việt → Nhật — nhóm A1: danh từ — thời tiết, tin tức, sự kiện (chủ đề これ、知ってる？) (13 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"kính, thuỷ tinh\" là từ nào?",
            "options": [
              "{事故|じこ} (jiko)",
              "ガラス (garasu)",
              "チーム (chiimu)",
              "{台風|たいふう} (taifuu)"
            ],
            "correct": 1,
            "why": "**ガラス** (garasu) = kính, thuỷ tinh — 窓ガラス = kính cửa sổ"
          },
          {
            "q": "Tiếng Nhật của \"trời nhiều mây, trời râm\" là từ nào?",
            "options": [
              "{本当|ほんとう} (hontou)",
              "チーム (chiimu)",
              "{曇|くも}り (kumori)",
              "ガラス (garasu)"
            ],
            "correct": 2,
            "why": "**{曇|くも}り** (kumori) = trời nhiều mây, trời râm — 明日は 曇りです"
          },
          {
            "q": "Tiếng Nhật của \"bão\" là từ nào?",
            "options": [
              "チーム (chiimu)",
              "{台風|たいふう} (taifuu)",
              "{曇|くも}り (kumori)",
              "{地震|じしん} (jishin)"
            ],
            "correct": 1,
            "why": "**{台風|たいふう}** (taifuu) = bão — 台風が 来ます"
          },
          {
            "q": "Tiếng Nhật của \"động đất\" là từ nào?",
            "options": [
              "{無料|むりょう} (muryou)",
              "フリーマーケット (furii maaketto)",
              "{台風|たいふう} (taifuu)",
              "{地震|じしん} (jishin)"
            ],
            "correct": 3,
            "why": "**{地震|じしん}** (jishin) = động đất — 地震が あります"
          },
          {
            "q": "Tiếng Nhật của \"tai nạn, sự cố\" là từ nào?",
            "options": [
              "{地震|じしん} (jishin)",
              "{台風|たいふう} (taifuu)",
              "{事故|じこ} (jiko)",
              "～{大会|たいかい} (~taikai)"
            ],
            "correct": 2,
            "why": "**{事故|じこ}** (jiko) = tai nạn, sự cố — 事故で 電車が 止まりました"
          },
          {
            "q": "Tiếng Nhật của \"đại hội, cuộc thi, lễ hội lớn\" là từ nào?",
            "options": [
              "{曇|くも}り (kumori)",
              "ガラス (garasu)",
              "チーム (chiimu)",
              "～{大会|たいかい} (~taikai)"
            ],
            "correct": 3,
            "why": "**～{大会|たいかい}** (~taikai) = đại hội, cuộc thi, lễ hội lớn — 花火大会 = lễ hội pháo hoa"
          },
          {
            "q": "Tiếng Nhật của \"đội (thể thao)\" là từ nào?",
            "options": [
              "{曇|くも}り (kumori)",
              "ガラス (garasu)",
              "～{大会|たいかい} (~taikai)",
              "チーム (chiimu)"
            ],
            "correct": 3,
            "why": "**チーム** (chiimu) = đội (thể thao)"
          },
          {
            "q": "Tiếng Nhật của \"huỷ, hoãn, dừng lại\" là từ nào?",
            "options": [
              "フリーマーケット (furii maaketto)",
              "{本当|ほんとう} (hontou)",
              "{夕方|ゆうがた} (yuugata)",
              "{中止|ちゅうし} (chuushi)"
            ],
            "correct": 3,
            "why": "**{中止|ちゅうし}** (chuushi) = huỷ, hoãn, dừng lại — 雨だったら、中止です"
          },
          {
            "q": "Tiếng Nhật của \"chợ đồ cũ, chợ trời\" là từ nào?",
            "options": [
              "{地震|じしん} (jishin)",
              "{無料|むりょう} (muryou)",
              "{曇|くも}り (kumori)",
              "フリーマーケット (furii maaketto)"
            ],
            "correct": 3,
            "why": "**フリーマーケット** (furii maaketto) = chợ đồ cũ, chợ trời"
          },
          {
            "q": "Tiếng Nhật của \"sự thật, thật\" là từ nào?",
            "options": [
              "{曇|くも}り (kumori)",
              "{無料|むりょう} (muryou)",
              "{本当|ほんとう} (hontou)",
              "ガラス (garasu)"
            ],
            "correct": 2,
            "why": "**{本当|ほんとう}** (hontou) = sự thật, thật — 本当ですか = thật à?"
          },
          {
            "q": "Tiếng Nhật của \"ngày xưa, hồi trước\" là từ nào?",
            "options": [
              "{事故|じこ} (jiko)",
              "～{大会|たいかい} (~taikai)",
              "{昔|むかし} (mukashi)",
              "{曇|くも}り (kumori)"
            ],
            "correct": 2,
            "why": "**{昔|むかし}** (mukashi) = ngày xưa, hồi trước"
          },
          {
            "q": "Tiếng Nhật của \"miễn phí\" là từ nào?",
            "options": [
              "{夕方|ゆうがた} (yuugata)",
              "{中止|ちゅうし} (chuushi)",
              "{無料|むりょう} (muryou)",
              "{台風|たいふう} (taifuu)"
            ],
            "correct": 2,
            "why": "**{無料|むりょう}** (muryou) = miễn phí — N + だそうです: 無料だそうです"
          },
          {
            "q": "Tiếng Nhật của \"chiều tối, lúc chạng vạng\" là từ nào?",
            "options": [
              "{昔|むかし} (mukashi)",
              "{無料|むりょう} (muryou)",
              "チーム (chiimu)",
              "{夕方|ゆうがた} (yuugata)"
            ],
            "correct": 3,
            "why": "**{夕方|ゆうがた}** (yuugata) = chiều tối, lúc chạng vạng"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-vj2",
        "title": "Việt → Nhật — nhóm A2: động từ, tính từ — chuyện xảy ra (chủ đề これ、知ってる？) (14 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"chết\" là từ nào?",
            "options": [
              "{死|し}にます (shinimasu)",
              "{心配|しんぱい}（な） (shinpai (na))",
              "できます (dekimasu)",
              "{怖|こわ}い (kowai)"
            ],
            "correct": 0,
            "why": "**{死|し}にます** (shinimasu) = chết — nhóm 1 — 死ぬ · 死んで · 死んだ"
          },
          {
            "q": "Tiếng Nhật của \"qua đời, mất (lịch sự)\" là từ nào?",
            "options": [
              "{割|わ}れます (waremasu)",
              "{亡|な}くなります (nakunarimasu)",
              "{止|と}まります (tomarimasu)",
              "{降|ふ}ります (furimasu)"
            ],
            "correct": 1,
            "why": "**{亡|な}くなります** (nakunarimasu) = qua đời, mất (lịch sự) — nhóm 1 — dùng cho người"
          },
          {
            "q": "Tiếng Nhật của \"(tàu, xe, máy) dừng lại\" là từ nào?",
            "options": [
              "{怖|こわ}い (kowai)",
              "{死|し}にます (shinimasu)",
              "{入院|にゅういん}します (nyuuin shimasu)",
              "{止|と}まります (tomarimasu)"
            ],
            "correct": 3,
            "why": "**{止|と}まります** (tomarimasu) = (tàu, xe, máy) dừng lại — nhóm 1, tự động từ — 電車が 止まります (↔ 止めます)"
          },
          {
            "q": "Tiếng Nhật của \"(việc gì) bắt đầu\" là từ nào?",
            "options": [
              "{心配|しんぱい}（な） (shinpai (na))",
              "{結婚|けっこん}します (kekkon shimasu)",
              "{入院|にゅういん}します (nyuuin shimasu)",
              "{始|はじ}まります (hajimarimasu)"
            ],
            "correct": 3,
            "why": "**{始|はじ}まります** (hajimarimasu) = (việc gì) bắt đầu — nhóm 1, tự động từ — 授業が 始まります (↔ 始めます)"
          },
          {
            "q": "Tiếng Nhật của \"(mưa, tuyết) rơi\" là từ nào?",
            "options": [
              "{降|ふ}ります (furimasu)",
              "{怖|こわ}い (kowai)",
              "{勝|か}ちます (kachimasu)",
              "{死|し}にます (shinimasu)"
            ],
            "correct": 0,
            "why": "**{降|ふ}ります** (furimasu) = (mưa, tuyết) rơi — nhóm 1 — 雨が 降ります; khác 降ります (おります, xuống xe)"
          },
          {
            "q": "Tiếng Nhật của \"thắng\" là từ nào?",
            "options": [
              "{亡|な}くなります (nakunarimasu)",
              "{勝|か}ちます (kachimasu)",
              "できます (dekimasu)",
              "{入院|にゅういん}します (nyuuin shimasu)"
            ],
            "correct": 1,
            "why": "**{勝|か}ちます** (kachimasu) = thắng — nhóm 1 — N に 勝ちます"
          },
          {
            "q": "Tiếng Nhật của \"thua\" là từ nào?",
            "options": [
              "{負|ま}けます (makemasu)",
              "{亡|な}くなります (nakunarimasu)",
              "{勝|か}ちます (kachimasu)",
              "{降|ふ}ります (furimasu)"
            ],
            "correct": 0,
            "why": "**{負|ま}けます** (makemasu) = thua — nhóm 2 — N に 負けます"
          },
          {
            "q": "Tiếng Nhật của \"(nhà, cây) đổ; (người) ngã quỵ\" là từ nào?",
            "options": [
              "{心配|しんぱい}（な） (shinpai (na))",
              "{倒|たお}れます (taoremasu)",
              "できます (dekimasu)",
              "{結婚|けっこん}します (kekkon shimasu)"
            ],
            "correct": 1,
            "why": "**{倒|たお}れます** (taoremasu) = (nhà, cây) đổ; (người) ngã quỵ — nhóm 2 — 木が 倒れます"
          },
          {
            "q": "Tiếng Nhật của \"(được) xây xong, mở ra, có\" là từ nào?",
            "options": [
              "{止|と}まります (tomarimasu)",
              "{勝|か}ちます (kachimasu)",
              "{割|わ}れます (waremasu)",
              "できます (dekimasu)"
            ],
            "correct": 3,
            "why": "**できます** (dekimasu) = (được) xây xong, mở ra, có — nhóm 2 — 新しい 店が できます (nghĩa mới, khác \"có thể\")"
          },
          {
            "q": "Tiếng Nhật của \"(cốc, kính) vỡ\" là từ nào?",
            "options": [
              "{割|わ}れます (waremasu)",
              "{死|し}にます (shinimasu)",
              "{降|ふ}ります (furimasu)",
              "{始|はじ}まります (hajimarimasu)"
            ],
            "correct": 0,
            "why": "**{割|わ}れます** (waremasu) = (cốc, kính) vỡ — nhóm 2 — ガラスが 割れます"
          },
          {
            "q": "Tiếng Nhật của \"kết hôn\" là từ nào?",
            "options": [
              "できます (dekimasu)",
              "{死|し}にます (shinimasu)",
              "{入院|にゅういん}します (nyuuin shimasu)",
              "{結婚|けっこん}します (kekkon shimasu)"
            ],
            "correct": 3,
            "why": "**{結婚|けっこん}します** (kekkon shimasu) = kết hôn — nhóm 3 — N と 結婚します"
          },
          {
            "q": "Tiếng Nhật của \"nhập viện\" là từ nào?",
            "options": [
              "{入院|にゅういん}します (nyuuin shimasu)",
              "{勝|か}ちます (kachimasu)",
              "{結婚|けっこん}します (kekkon shimasu)",
              "{降|ふ}ります (furimasu)"
            ],
            "correct": 0,
            "why": "**{入院|にゅういん}します** (nyuuin shimasu) = nhập viện — nhóm 3"
          },
          {
            "q": "Tiếng Nhật của \"sợ, đáng sợ\" là từ nào?",
            "options": [
              "{割|わ}れます (waremasu)",
              "{止|と}まります (tomarimasu)",
              "{怖|こわ}い (kowai)",
              "{勝|か}ちます (kachimasu)"
            ],
            "correct": 2,
            "why": "**{怖|こわ}い** (kowai) = sợ, đáng sợ — tính từ い"
          },
          {
            "q": "Tiếng Nhật của \"lo lắng\" là từ nào?",
            "options": [
              "{割|わ}れます (waremasu)",
              "{心配|しんぱい}（な） (shinpai (na))",
              "{倒|たお}れます (taoremasu)",
              "{亡|な}くなります (nakunarimasu)"
            ],
            "correct": 1,
            "why": "**{心配|しんぱい}（な）** (shinpai (na)) = lo lắng — tính từ な / 心配します"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-vj3",
        "title": "Việt → Nhật — nhóm B: tạp chí, kế hoạch ra phố, đoán (chủ đề 雑誌を見て町へ) (14 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"gió\" là từ nào?",
            "options": [
              "{風|かぜ} (kaze)",
              "きっと (kitto)",
              "{間|ま}に{合|あ}います (ma ni aimasu)",
              "{席|せき} (seki)"
            ],
            "correct": 0,
            "why": "**{風|かぜ}** (kaze) = gió — 風が 強いです; khác 風邪 (cảm)"
          },
          {
            "q": "Tiếng Nhật của \"dây đeo (điện thoại, máy ảnh)\" là từ nào?",
            "options": [
              "{席|せき} (seki)",
              "{風|かぜ} (kaze)",
              "～{引|び}き (~biki)",
              "ストラップ (sutorappu)"
            ],
            "correct": 3,
            "why": "**ストラップ** (sutorappu) = dây đeo (điện thoại, máy ảnh)"
          },
          {
            "q": "Tiếng Nhật của \"chỗ ngồi, ghế\" là từ nào?",
            "options": [
              "～{引|び}き (~biki)",
              "{席|せき} (seki)",
              "ストラップ (sutorappu)",
              "{強|つよ}い (tsuyoi)"
            ],
            "correct": 1,
            "why": "**{席|せき}** (seki) = chỗ ngồi, ghế"
          },
          {
            "q": "Tiếng Nhật của \"vội, gấp\" là từ nào?",
            "options": [
              "～{引|び}き (~biki)",
              "もし (moshi)",
              "{席|せき} (seki)",
              "{急|いそ}ぎます (isogimasu)"
            ],
            "correct": 3,
            "why": "**{急|いそ}ぎます** (isogimasu) = vội, gấp — nhóm 1 — 急いで ください"
          },
          {
            "q": "Tiếng Nhật của \"đông, chật\" là từ nào?",
            "options": [
              "{急|いそ}ぎます (isogimasu)",
              "{混|こ}みます (komimasu)",
              "たぶん (tabun)",
              "{晴|は}れます (haremasu)"
            ],
            "correct": 1,
            "why": "**{混|こ}みます** (komimasu) = đông, chật — nhóm 1 — 混んで います"
          },
          {
            "q": "Tiếng Nhật của \"kịp (giờ)\" là từ nào?",
            "options": [
              "{晴|は}れます (haremasu)",
              "もし (moshi)",
              "{間|ま}に{合|あ}います (ma ni aimasu)",
              "ストラップ (sutorappu)"
            ],
            "correct": 2,
            "why": "**{間|ま}に{合|あ}います** (ma ni aimasu) = kịp (giờ) — nhóm 1 — N に 間に合います"
          },
          {
            "q": "Tiếng Nhật của \"(mưa, gió) tạnh, ngừng\" là từ nào?",
            "options": [
              "やみます (yamimasu)",
              "たぶん (tabun)",
              "{席|せき} (seki)",
              "{風|かぜ} (kaze)"
            ],
            "correct": 0,
            "why": "**やみます** (yamimasu) = (mưa, gió) tạnh, ngừng — nhóm 1 — 雨が やみます"
          },
          {
            "q": "Tiếng Nhật của \"(trời) nắng, quang đãng\" là từ nào?",
            "options": [
              "～パーセント (~paasento)",
              "{強|つよ}い (tsuyoi)",
              "{晴|は}れます (haremasu)",
              "{間|ま}に{合|あ}います (ma ni aimasu)"
            ],
            "correct": 2,
            "why": "**{晴|は}れます** (haremasu) = (trời) nắng, quang đãng — nhóm 2"
          },
          {
            "q": "Tiếng Nhật của \"～ phần trăm (%)\" là từ nào?",
            "options": [
              "たぶん (tabun)",
              "{混|こ}みます (komimasu)",
              "～パーセント (~paasento)",
              "やみます (yamimasu)"
            ],
            "correct": 2,
            "why": "**～パーセント** (~paasento) = ～ phần trăm (%)"
          },
          {
            "q": "Tiếng Nhật của \"giảm ～ (giá)\" là từ nào?",
            "options": [
              "～{引|び}き (~biki)",
              "～パーセント (~paasento)",
              "{晴|は}れます (haremasu)",
              "{混|こ}みます (komimasu)"
            ],
            "correct": 0,
            "why": "**～{引|び}き** (~biki) = giảm ～ (giá) — 10パーセント引き = giảm 10%"
          },
          {
            "q": "Tiếng Nhật của \"mạnh\" là từ nào?",
            "options": [
              "{席|せき} (seki)",
              "{間|ま}に{合|あ}います (ma ni aimasu)",
              "{強|つよ}い (tsuyoi)",
              "もし (moshi)"
            ],
            "correct": 2,
            "why": "**{強|つよ}い** (tsuyoi) = mạnh — tính từ い — 強い 風 · 強い チーム"
          },
          {
            "q": "Tiếng Nhật của \"chắc chắn (tin mạnh)\" là từ nào?",
            "options": [
              "～{引|び}き (~biki)",
              "{席|せき} (seki)",
              "きっと (kitto)",
              "たぶん (tabun)"
            ],
            "correct": 2,
            "why": "**きっと** (kitto) = chắc chắn (tin mạnh) — ～と 思います"
          },
          {
            "q": "Tiếng Nhật của \"có lẽ, chắc là\" là từ nào?",
            "options": [
              "たぶん (tabun)",
              "{強|つよ}い (tsuyoi)",
              "やみます (yamimasu)",
              "{席|せき} (seki)"
            ],
            "correct": 0,
            "why": "**たぶん** (tabun) = có lẽ, chắc là — ít chắc hơn きっと"
          },
          {
            "q": "Tiếng Nhật của \"nếu (giả định)\" là từ nào?",
            "options": [
              "きっと (kitto)",
              "{混|こ}みます (komimasu)",
              "もし (moshi)",
              "{晴|は}れます (haremasu)"
            ],
            "correct": 2,
            "why": "**もし** (moshi) = nếu (giả định) — もし ～たら"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-vj4",
        "title": "Việt → Nhật — nhóm C: tả cảnh ngoài phố — tự động từ (chủ đề 町を歩いて) (7 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"(người) tập trung, tụ tập\" là từ nào?",
            "options": [
              "やみます (yamimasu)",
              "{集|あつ}まります (atsumarimasu)",
              "{地震|じしん} (jishin)",
              "{本当|ほんとう} (hontou)"
            ],
            "correct": 1,
            "why": "**{集|あつ}まります** (atsumarimasu) = (người) tập trung, tụ tập — nhóm 1, tự động từ — 人が 集まります"
          },
          {
            "q": "Tiếng Nhật của \"(cửa, cửa hàng) đóng\" là từ nào?",
            "options": [
              "{閉|し}まります (shimarimasu)",
              "{昔|むかし} (mukashi)",
              "～パーセント (~paasento)",
              "{壊|こわ}れます (kowaremasu)"
            ],
            "correct": 0,
            "why": "**{閉|し}まります** (shimarimasu) = (cửa, cửa hàng) đóng — nhóm 1, tự động từ — 店が 閉まって います"
          },
          {
            "q": "Tiếng Nhật của \"vắng, thưa (↔ 混みます)\" là từ nào?",
            "options": [
              "たぶん (tabun)",
              "すきます (sukimasu)",
              "{負|ま}けます (makemasu)",
              "～{大会|たいかい} (~taikai)"
            ],
            "correct": 1,
            "why": "**すきます** (sukimasu) = vắng, thưa (↔ 混みます) — nhóm 1 — すいて います"
          },
          {
            "q": "Tiếng Nhật của \"rơi, rớt\" là từ nào?",
            "options": [
              "{落|お}ちます (ochimasu)",
              "{晴|は}れます (haremasu)",
              "{昔|むかし} (mukashi)",
              "～{引|び}き (~biki)"
            ],
            "correct": 0,
            "why": "**{落|お}ちます** (ochimasu) = rơi, rớt — nhóm 2 — 財布が 落ちて います"
          },
          {
            "q": "Tiếng Nhật của \"(đèn) tắt; biến mất\" là từ nào?",
            "options": [
              "{消|き}えます (kiemasu)",
              "すきます (sukimasu)",
              "もし (moshi)",
              "{集|あつ}まります (atsumarimasu)"
            ],
            "correct": 0,
            "why": "**{消|き}えます** (kiemasu) = (đèn) tắt; biến mất — nhóm 2, tự động từ — 電気が 消えます (↔ 消します)"
          },
          {
            "q": "Tiếng Nhật của \"(máy, đồ vật) hỏng\" là từ nào?",
            "options": [
              "なんと (nanto)",
              "{最後|さいご} (saigo)",
              "{壊|こわ}れます (kowaremasu)",
              "{間|ま}に{合|あ}います (ma ni aimasu)"
            ],
            "correct": 2,
            "why": "**{壊|こわ}れます** (kowaremasu) = (máy, đồ vật) hỏng — nhóm 2 — パソコンが 壊れて います"
          },
          {
            "q": "Tiếng Nhật của \"bẩn, dơ\" là từ nào?",
            "options": [
              "{降|ふ}ります (furimasu)",
              "{笑|わら}います (waraimasu)",
              "{汚|よご}れます (yogoremasu)",
              "{昔|むかし} (mukashi)"
            ],
            "correct": 2,
            "why": "**{汚|よご}れます** (yogoremasu) = bẩn, dơ — nhóm 2 — コップが 汚れて います"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-vj5",
        "title": "Việt → Nhật — nhóm D: từ của bài đọc, bài nghe — cuộc thi hùng biện (10 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"cuộc thi hùng biện\" là từ nào?",
            "options": [
              "{思|おも}い{出|で} (omoide)",
              "～{位|い} (~i)",
              "スピーチコンテスト (supiichi kontesuto)",
              "{最後|さいご} (saigo)"
            ],
            "correct": 2,
            "why": "**スピーチコンテスト** (supiichi kontesuto) = cuộc thi hùng biện"
          },
          {
            "q": "Tiếng Nhật của \"hạng ～, giải ～\" là từ nào?",
            "options": [
              "スピーチコンテスト (supiichi kontesuto)",
              "なんと (nanto)",
              "うなずきます (unazukimasu)",
              "～{位|い} (~i)"
            ],
            "correct": 3,
            "why": "**～{位|い}** (~i) = hạng ～, giải ～ — 1位 = hạng nhất"
          },
          {
            "q": "Tiếng Nhật của \"cuối cùng\" là từ nào?",
            "options": [
              "ホール (hooru)",
              "なんと (nanto)",
              "{最後|さいご} (saigo)",
              "うなずきます (unazukimasu)"
            ],
            "correct": 2,
            "why": "**{最後|さいご}** (saigo) = cuối cùng — 最後まで = đến cuối"
          },
          {
            "q": "Tiếng Nhật của \"hội trường\" là từ nào?",
            "options": [
              "{最後|さいご} (saigo)",
              "ホール (hooru)",
              "なんと (nanto)",
              "{会場|かいじょう} (kaijou)"
            ],
            "correct": 1,
            "why": "**ホール** (hooru) = hội trường"
          },
          {
            "q": "Tiếng Nhật của \"kỷ niệm\" là từ nào?",
            "options": [
              "{笑|わら}います (waraimasu)",
              "{思|おも}い{出|で} (omoide)",
              "{最後|さいご} (saigo)",
              "{会場|かいじょう} (kaijou)"
            ],
            "correct": 1,
            "why": "**{思|おも}い{出|で}** (omoide) = kỷ niệm — いい 思い出に なりました"
          },
          {
            "q": "Tiếng Nhật của \"gật đầu\" là từ nào?",
            "options": [
              "{笑|わら}います (waraimasu)",
              "ホール (hooru)",
              "{思|おも}い{出|で} (omoide)",
              "うなずきます (unazukimasu)"
            ],
            "correct": 3,
            "why": "**うなずきます** (unazukimasu) = gật đầu — nhóm 1"
          },
          {
            "q": "Tiếng Nhật của \"hồi hộp, căng thẳng\" là từ nào?",
            "options": [
              "{緊張|きんちょう}します (kinchou shimasu)",
              "スピーチコンテスト (supiichi kontesuto)",
              "{笑|わら}います (waraimasu)",
              "うなずきます (unazukimasu)"
            ],
            "correct": 0,
            "why": "**{緊張|きんちょう}します** (kinchou shimasu) = hồi hộp, căng thẳng — nhóm 3"
          },
          {
            "q": "Tiếng Nhật của \"cười\" là từ nào?",
            "options": [
              "{最後|さいご} (saigo)",
              "～{位|い} (~i)",
              "{思|おも}い{出|で} (omoide)",
              "{笑|わら}います (waraimasu)"
            ],
            "correct": 3,
            "why": "**{笑|わら}います** (waraimasu) = cười — nhóm 1"
          },
          {
            "q": "Tiếng Nhật của \"thật không ngờ, vậy mà\" là từ nào?",
            "options": [
              "ホール (hooru)",
              "うなずきます (unazukimasu)",
              "{笑|わら}います (waraimasu)",
              "なんと (nanto)"
            ],
            "correct": 3,
            "why": "**なんと** (nanto) = thật không ngờ, vậy mà — dẫn tới điều bất ngờ"
          },
          {
            "q": "Tiếng Nhật của \"địa điểm tổ chức, hội trường\" là từ nào?",
            "options": [
              "スピーチコンテスト (supiichi kontesuto)",
              "{笑|わら}います (waraimasu)",
              "なんと (nanto)",
              "{会場|かいじょう} (kaijou)"
            ],
            "correct": 3,
            "why": "**{会場|かいじょう}** (kaijou) = địa điểm tổ chức, hội trường"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · khác loại · điền từ vào câu · gõ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-khac-loai",
        "title": "Từ nào KHÁC loại? (12 câu)",
        "items": [
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (thời tiết / thiên tai)",
            "options": [
              "{曇|くも}り (Kumori)",
              "チーム (Chiimu)",
              "{地震|じしん} (Jishin)",
              "{台風|たいふう} (Taifuu)"
            ],
            "correct": 1,
            "why": "Ba từ kia nói về thời tiết, thiên tai; **チーム** là đội thể thao."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (tự động từ (vật tự …))",
            "options": [
              "{閉|し}まります (Shimarimasu)",
              "{始|はじ}まります (Hajimarimasu)",
              "{止|と}まります (Tomarimasu)",
              "{集|あつ}めます (Atsumemasu)"
            ],
            "correct": 3,
            "why": "Ba từ kia là tự động từ (N が ～); **集めます** là tha động từ (N を 集めます — thu gom). Bài 15 học **集まります**."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (động từ NHÓM 2)",
            "options": [
              "{割|わ}れます (Waremasu)",
              "{混|こ}みます (Komimasu)",
              "{倒|たお}れます (Taoremasu)",
              "{負|ま}けます (Makemasu)"
            ],
            "correct": 1,
            "why": "Ba từ kia nhóm 2 (負ける, 倒れる, 割れる); **混みます** là nhóm 1 (混む → 混んで)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (động từ NHÓM 1)",
            "options": [
              "{急|いそ}ぎます (Isogimasu)",
              "{勝|か}ちます (Kachimasu)",
              "{晴|は}れます (Haremasu)",
              "やみます (Yamimasu)"
            ],
            "correct": 2,
            "why": "Ba từ kia nhóm 1 (勝つ, 急ぐ, やむ); **晴れます** là nhóm 2 (晴れる → 晴れて)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (trạng thái đồ vật \"có vấn đề\")",
            "options": [
              "{晴|は}れます (Haremasu)",
              "{割|わ}れます (Waremasu)",
              "{壊|こわ}れます (Kowaremasu)",
              "{汚|よご}れます (Yogoremasu)"
            ],
            "correct": 0,
            "why": "Ba từ kia nói đồ vật bị hỏng, bẩn, vỡ; **晴れます** là trời nắng."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (phó từ đoán / giả định)",
            "options": [
              "きっと (Kitto)",
              "もし (Moshi)",
              "{本当|ほんとう} (Hontou)",
              "たぶん (Tabun)"
            ],
            "correct": 2,
            "why": "Ba từ kia là phó từ (đoán, giả định); **本当** là danh từ \"sự thật\"."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (thời gian)",
            "options": [
              "{昔|むかし} (Mukashi)",
              "{夕方|ゆうがた} (Yuugata)",
              "{席|せき} (Seki)",
              "{最後|さいご} (Saigo)"
            ],
            "correct": 2,
            "why": "Ba từ kia chỉ thời gian / thời điểm; **席** là chỗ ngồi."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (chuyện vui)",
            "options": [
              "{勝|か}ちます (Kachimasu)",
              "{入院|にゅういん}します (Nyuuin shimasu)",
              "{晴|は}れます (Haremasu)",
              "{結婚|けっこん}します (Kekkon shimasu)"
            ],
            "correct": 1,
            "why": "Ba từ kia là chuyện vui; **入院します** (nhập viện) là chuyện đáng lo."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (cảm xúc)",
            "options": [
              "{強|つよ}い (Tsuyoi)",
              "{緊張|きんちょう}します (Kinchou shimasu)",
              "{怖|こわ}い (Kowai)",
              "{心配|しんぱい} (Shinpai)"
            ],
            "correct": 0,
            "why": "Ba từ kia là cảm xúc (sợ, lo, hồi hộp); **強い** là mạnh."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (đông / vắng)",
            "options": [
              "すきます (Sukimasu)",
              "{落|お}ちます (Ochimasu)",
              "{集|あつ}まります (Atsumarimasu)",
              "{混|こ}みます (Komimasu)"
            ],
            "correct": 1,
            "why": "Ba từ kia nói nơi chốn đông / vắng / người tụ tập; **落ちます** là rơi."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (nơi chốn)",
            "options": [
              "{席|せき} (Seki)",
              "ホール (Hooru)",
              "{思|おも}い{出|で} (Omoide)",
              "{会場|かいじょう} (Kaijou)"
            ],
            "correct": 2,
            "why": "Ba từ kia là chỗ, nơi; **思い出** là kỷ niệm."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (sự kiện)",
            "options": [
              "フリーマーケット (Furiimaaketto)",
              "ガラス (Garasu)",
              "{大会|たいかい} (Taikai)",
              "スピーチコンテスト (Supiichikontesuto)"
            ],
            "correct": 1,
            "why": "Ba từ kia là sự kiện; **ガラス** là kính, thuỷ tinh."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-dien-cau",
        "title": "Điền từ vào câu — có nghĩa tiếng Việt kèm theo (58 câu)",
        "items": [
          {
            "q": "{地震|じしん}で{窓|まど}の＿＿が{割|わ}れました。　〔Jishin de mado no __ ga waremashita.〕　— Vì động đất mà kính cửa sổ bị vỡ.",
            "options": [
              "ホール",
              "ストラップ",
              "ガラス",
              "チーム"
            ],
            "correct": 2,
            "why": "Kính cửa sổ = 窓ガラス. → **{地震|じしん}で{窓|まど}のガラスが{割|わ}れました。** 〔Jishin de mado no garasu ga waremashita.〕 — Vì động đất mà kính cửa sổ bị vỡ."
          },
          {
            "q": "{明日|あした}は{晴|は}れじゃなくて、＿＿だそうです。　〔Ashita wa hare ja nakute, __ da sou desu.〕　— Nghe nói ngày mai không nắng mà nhiều mây.",
            "options": [
              "{曇|くも}り",
              "{風|かぜ}",
              "{昔|むかし}",
              "{席|せき}"
            ],
            "correct": 0,
            "why": "Trời nhiều mây = 曇り. → **{明日|あした}は{晴|は}れじゃなくて、{曇|くも}りだそうです。** 〔Ashita wa hare ja nakute, kumori da sou desu.〕 — Nghe nói ngày mai không nắng mà nhiều mây."
          },
          {
            "q": "{大|おお}きい＿＿が{来|く}るそうですから、{窓|まど}を{閉|し}めてください。　〔Ookii __ ga kuru sou desu kara, mado o shimete kudasai.〕　— Nghe nói bão lớn sắp đến, hãy đóng cửa sổ lại.",
            "options": [
              "{夕方|ゆうがた}",
              "{事故|じこ}",
              "{会場|かいじょう}",
              "{台風|たいふう}"
            ],
            "correct": 3,
            "why": "Bão đến = 台風が 来ます. → **{大|おお}きい{台風|たいふう}が{来|く}るそうですから、{窓|まど}を{閉|し}めてください。** 〔Ookii taifuu ga kuru sou desu kara, mado o shimete kudasai.〕 — Nghe nói bão lớn sắp đến, hãy đóng cửa sổ lại."
          },
          {
            "q": "{昨日|きのう}の{夜|よる}、{大|おお}きい＿＿がありました。{怖|こわ}かったです。　〔Kinou no yoru, ookii __ ga arimashita. Kowakatta desu.〕　— Tối qua có trận động đất lớn. Sợ lắm.",
            "options": [
              "{中止|ちゅうし}",
              "{地震|じしん}",
              "{無料|むりょう}",
              "ストラップ"
            ],
            "correct": 1,
            "why": "Động đất = 地震 (地震が あります). → **{昨日|きのう}の{夜|よる}、{大|おお}きい{地震|じしん}がありました。{怖|こわ}かったです。** 〔Kinou no yoru, ookii jishin ga arimashita. Kowakatta desu.〕 — Tối qua có trận động đất lớn. Sợ lắm."
          },
          {
            "q": "＿＿で{電車|でんしゃ}が{止|と}まっています。　〔__ de densha ga tomatte imasu.〕　— Vì có sự cố nên tàu điện đang dừng.",
            "options": [
              "{昔|むかし}",
              "{本当|ほんとう}",
              "{事故|じこ}",
              "{席|せき}"
            ],
            "correct": 2,
            "why": "Nguyên nhân N で: 事故で (vì sự cố). → **{事故|じこ}で{電車|でんしゃ}が{止|と}まっています。** 〔Jiko de densha ga tomatte imasu.〕 — Vì có sự cố nên tàu điện đang dừng."
          },
          {
            "q": "{夏|なつ}になると、{川|かわ}の{近|ちか}くで{花火|はなび}＿＿があります。　〔Natsu ni naru to, kawa no chikaku de hanabi __ ga arimasu.〕　— Cứ đến mùa hè là gần sông có lễ hội pháo hoa.",
            "options": [
              "チーム",
              "ホール",
              "ガラス",
              "{大会|たいかい}"
            ],
            "correct": 3,
            "why": "Lễ hội pháo hoa = 花火大会. → **{夏|なつ}になると、{川|かわ}の{近|ちか}くで{花火|はなび}{大会|たいかい}があります。** 〔Natsu ni naru to, kawa no chikaku de hanabi taikai ga arimasu.〕 — Cứ đến mùa hè là gần sông có lễ hội pháo hoa."
          },
          {
            "q": "{私|わたし}の{好|す}きなサッカー＿＿が{勝|か}ちました。　〔Watashi no sukina sakkaa __ ga kachimashita.〕　— Đội bóng đá tôi thích đã thắng.",
            "options": [
              "ホール",
              "チーム",
              "ガラス",
              "パーセント"
            ],
            "correct": 1,
            "why": "Đội (thể thao) = チーム. → **{私|わたし}の{好|す}きなサッカーチームが{勝|か}ちました。** 〔Watashi no sukina sakkaa chiimu ga kachimashita.〕 — Đội bóng đá tôi thích đã thắng."
          },
          {
            "q": "{雨|あめ}だったら、{試合|しあい}は＿＿です。　〔Ame dattara, shiai wa __ desu.〕　— Nếu mưa thì trận đấu bị huỷ.",
            "options": [
              "{曇|くも}り",
              "{中止|ちゅうし}",
              "{最後|さいご}",
              "{無料|むりょう}"
            ],
            "correct": 1,
            "why": "Huỷ = 中止. → **{雨|あめ}だったら、{試合|しあい}は{中止|ちゅうし}です。** 〔Ame dattara, shiai wa chuushi desu.〕 — Nếu mưa thì trận đấu bị huỷ."
          },
          {
            "q": "{日曜日|にちようび}、{公園|こうえん}で＿＿があるそうです。{古|ふる}い{服|ふく}が{安|やす}いですよ。　〔Nichiyoubi, kouen de __ ga aru sou desu. Furui fuku ga yasui desu yo.〕　— Nghe nói Chủ nhật ở công viên có chợ đồ cũ. Quần áo cũ rẻ lắm.",
            "options": [
              "フリーマーケット",
              "ストラップ",
              "ガラス",
              "スピーチコンテスト"
            ],
            "correct": 0,
            "why": "Chợ đồ cũ = フリーマーケット. → **{日曜日|にちようび}、{公園|こうえん}でフリーマーケットがあるそうです。{古|ふる}い{服|ふく}が{安|やす}いですよ。** 〔Nichiyoubi, kouen de furiimaaketto ga aru sou desu. Furui fuku ga yasui desu yo.〕 — Nghe nói Chủ nhật ở công viên có chợ đồ cũ. Quần áo cũ rẻ lắm."
          },
          {
            "q": "A：マルコさんが{結婚|けっこん}したそうですよ。B：えっ、＿＿ですか。　〔A: Maruko-san ga kekkon shita sou desu yo. B: e, __ desu ka.〕　— A: Nghe nói anh Marco đã kết hôn rồi đấy. B: Hả, thật à?",
            "options": [
              "{最後|さいご}",
              "{本当|ほんとう}",
              "{無料|むりょう}",
              "{中止|ちゅうし}"
            ],
            "correct": 1,
            "why": "Ngạc nhiên: 本当ですか (thật à?). → **A：マルコさんが{結婚|けっこん}したそうですよ。B：えっ、{本当|ほんとう}ですか。** 〔A: Maruko-san ga kekkon shita sou desu yo. B: e, hontou desu ka.〕 — A: Nghe nói anh Marco đã kết hôn rồi đấy. B: Hả, thật à?"
          },
          {
            "q": "＿＿、この{町|まち}には{大|おお}きい{木|き}がたくさんあったそうです。　〔__, kono machi ni wa ookii ki ga takusan atta sou desu.〕　— Nghe nói ngày xưa thị trấn này có nhiều cây to.",
            "options": [
              "{夕方|ゆうがた}",
              "{最後|さいご}",
              "{昔|むかし}",
              "{本当|ほんとう}"
            ],
            "correct": 2,
            "why": "Ngày xưa = 昔. → **{昔|むかし}、この{町|まち}には{大|おお}きい{木|き}がたくさんあったそうです。** 〔Mukashi, kono machi ni wa ookii ki ga takusan atta sou desu.〕 — Nghe nói ngày xưa thị trấn này có nhiều cây to."
          },
          {
            "q": "{来月|らいげつ}、この{美術館|びじゅつかん}は＿＿だそうです。お{金|かね}を{払|はら}わなくてもいいです。　〔Raigetsu, kono bijutsukan wa __ da sou desu. Okane o harawanakute mo ii desu.〕　— Nghe nói tháng sau bảo tàng này miễn phí. Không cần trả tiền.",
            "options": [
              "{無料|むりょう}",
              "{心配|しんぱい}",
              "{会場|かいじょう}",
              "{中止|ちゅうし}"
            ],
            "correct": 0,
            "why": "Miễn phí = 無料. → **{来月|らいげつ}、この{美術館|びじゅつかん}は{無料|むりょう}だそうです。お{金|かね}を{払|はら}わなくてもいいです。** 〔Raigetsu, kono bijutsukan wa muryou da sou desu. Okane o harawanakute mo ii desu.〕 — Nghe nói tháng sau bảo tàng này miễn phí. Không cần trả tiền."
          },
          {
            "q": "＿＿になると、{空|そら}が{赤|あか}くなります。　〔__ ni naru to, sora ga akaku narimasu.〕　— Cứ đến chiều tối là bầu trời đỏ lên.",
            "options": [
              "{夕方|ゆうがた}",
              "{台風|たいふう}",
              "{昔|むかし}",
              "{席|せき}"
            ],
            "correct": 0,
            "why": "Chiều tối = 夕方. → **{夕方|ゆうがた}になると、{空|そら}が{赤|あか}くなります。** 〔Yuugata ni naru to, sora ga akaku narimasu.〕 — Cứ đến chiều tối là bầu trời đỏ lên."
          },
          {
            "q": "{事故|じこ}で{三人|さんにん}＿＿そうです。　〔Jiko de sannin __ sou desu.〕　— Nghe nói vì tai nạn mà ba người đã chết.",
            "options": [
              "やんだ",
              "{晴|は}れた",
              "{勝|か}った",
              "{死|し}んだ"
            ],
            "correct": 3,
            "why": "Chết = 死にます → 死んだ. → **{事故|じこ}で{三人|さんにん}{死|し}んだそうです。** 〔Jiko de sannin shinda sou desu.〕 — Nghe nói vì tai nạn mà ba người đã chết."
          },
          {
            "q": "{祖父|そふ}は{去年|きょねん}＿＿。　〔Sofu wa kyonen __.〕　— Ông tôi đã mất năm ngoái.",
            "options": [
              "{割|わ}れました",
              "{倒|たお}れました",
              "{亡|な}くなりました",
              "{止|と}まりました"
            ],
            "correct": 2,
            "why": "Qua đời (lịch sự, nói về người) = 亡くなります. → **{祖父|そふ}は{去年|きょねん}{亡|な}くなりました。** 〔Sofu wa kyonen nakunarimashita.〕 — Ông tôi đã mất năm ngoái."
          },
          {
            "q": "{雪|ゆき}でバスが＿＿。　〔Yuki de basu ga __.〕　— Vì tuyết mà xe buýt đã dừng chạy.",
            "options": [
              "{止|と}めました",
              "{止|と}まりました",
              "{閉|し}まりました",
              "{割|わ}れました"
            ],
            "correct": 1,
            "why": "Tự động từ: バスが 止まります (xe tự dừng). → **{雪|ゆき}でバスが{止|と}まりました。** 〔Yuki de basu ga tomarimashita.〕 — Vì tuyết mà xe buýt đã dừng chạy."
          },
          {
            "q": "{授業|じゅぎょう}は{九時|くじ}に＿＿。　〔Jugyou wa kuji ni __.〕　— Giờ học bắt đầu lúc 9 giờ.",
            "options": [
              "{止|と}まります",
              "{始|はじ}めます",
              "{始|はじ}まります",
              "{集|あつ}まります"
            ],
            "correct": 2,
            "why": "Tự động từ: 授業が 始まります. → **{授業|じゅぎょう}は{九時|くじ}に{始|はじ}まります。** 〔Jugyou wa kuji ni hajimarimasu.〕 — Giờ học bắt đầu lúc 9 giờ."
          },
          {
            "q": "{明日|あした}は{雨|あめ}が＿＿そうです。　〔Ashita wa ame ga __ sou desu.〕　— Nghe nói ngày mai trời mưa.",
            "options": [
              "{消|き}える",
              "{降|ふ}る",
              "{晴|は}れる",
              "{降|お}りる"
            ],
            "correct": 1,
            "why": "Mưa rơi = 雨が 降ります (ふる). → **{明日|あした}は{雨|あめ}が{降|ふ}るそうです。** 〔Ashita wa ame ga furu sou desu.〕 — Nghe nói ngày mai trời mưa."
          },
          {
            "q": "{日本|にほん}のチームはブラジルに＿＿そうです。　〔Nihon no chiimu wa Burajiru ni __ sou desu.〕　— Nghe nói đội Nhật đã thắng Brazil.",
            "options": [
              "{集|あつ}まった",
              "{勝|か}った",
              "{割|わ}れた",
              "{倒|たお}れた"
            ],
            "correct": 1,
            "why": "Thắng N = N に 勝ちます. → **{日本|にほん}のチームはブラジルに{勝|か}ったそうです。** 〔Nihon no chiimu wa Burajiru ni katta sou desu.〕 — Nghe nói đội Nhật đã thắng Brazil."
          },
          {
            "q": "{私|わたし}たちのチームは{一対三|いったいさん}で＿＿。{残念|ざんねん}です。　〔Watashi tachi no chiimu wa ittaisan de __. Zannen desu.〕　— Đội chúng tôi đã thua 1–3. Tiếc quá.",
            "options": [
              "できました",
              "{負|ま}けました",
              "{勝|か}ちました",
              "{晴|は}れました"
            ],
            "correct": 1,
            "why": "Thua = 負けます. → **{私|わたし}たちのチームは{一対三|いったいさん}で{負|ま}けました。{残念|ざんねん}です。** 〔Watashi tachi no chiimu wa ittaisan de makemashita. Zannen desu.〕 — Đội chúng tôi đã thua 1–3. Tiếc quá."
          },
          {
            "q": "{強|つよ}い{風|かぜ}で{公園|こうえん}の{木|き}が＿＿。　〔Tsuyoi kaze de kouen no ki ga __.〕　— Vì gió mạnh mà cây ở công viên bị đổ.",
            "options": [
              "{閉|し}まりました",
              "{消|き}えました",
              "{倒|たお}れました",
              "{割|わ}れました"
            ],
            "correct": 2,
            "why": "Cây đổ = 木が 倒れます. → **{強|つよ}い{風|かぜ}で{公園|こうえん}の{木|き}が{倒|たお}れました。** 〔Tsuyoi kaze de kouen no ki ga taoremashita.〕 — Vì gió mạnh mà cây ở công viên bị đổ."
          },
          {
            "q": "{駅|えき}の{前|まえ}に{新|あたら}しいラーメン{屋|や}が＿＿そうです。　〔Eki no mae ni atarashii raamen'ya ga __ sou desu.〕　— Nghe nói trước ga mới mở một quán ramen.",
            "options": [
              "{勝|か}った",
              "{降|ふ}った",
              "{死|し}んだ",
              "できた"
            ],
            "correct": 3,
            "why": "Mở ra, xây xong = できます → できた. → **{駅|えき}の{前|まえ}に{新|あたら}しいラーメン{屋|や}ができたそうです。** 〔Eki no mae ni atarashii raamen'ya ga dekita sou desu.〕 — Nghe nói trước ga mới mở một quán ramen."
          },
          {
            "q": "コップが{落|お}ちて、＿＿。　〔Koppu ga ochite, __.〕　— Cái cốc rơi xuống và vỡ.",
            "options": [
              "{止|と}まりました",
              "すきました",
              "{割|わ}れました",
              "{倒|たお}れました"
            ],
            "correct": 2,
            "why": "Cốc vỡ = 割れます. → **コップが{落|お}ちて、{割|わ}れました。** 〔Koppu ga ochite, waremashita.〕 — Cái cốc rơi xuống và vỡ."
          },
          {
            "q": "{姉|あね}は{来月|らいげつ}{大学|だいがく}の{友達|ともだち}と＿＿。　〔Ane wa raigetsu daigaku no tomodachi to __.〕　— Tháng sau chị tôi kết hôn với một người bạn đại học.",
            "options": [
              "{結婚|けっこん}します",
              "{緊張|きんちょう}します",
              "{心配|しんぱい}します",
              "{入院|にゅういん}します"
            ],
            "correct": 0,
            "why": "Kết hôn với N = N と 結婚します. → **{姉|あね}は{来月|らいげつ}{大学|だいがく}の{友達|ともだち}と{結婚|けっこん}します。** 〔Ane wa raigetsu daigaku no tomodachi to kekkon shimasu.〕 — Tháng sau chị tôi kết hôn với một người bạn đại học."
          },
          {
            "q": "{父|ちち}は{病気|びょうき}で{一週間|いっしゅうかん}＿＿。　〔Chichi wa byouki de isshuukan __.〕　— Bố tôi bị ốm nên đã nằm viện một tuần.",
            "options": [
              "{結婚|けっこん}しました",
              "{入院|にゅういん}しました",
              "{急|いそ}ぎました",
              "うなずきました"
            ],
            "correct": 1,
            "why": "Nhập viện = 入院します. → **{父|ちち}は{病気|びょうき}で{一週間|いっしゅうかん}{入院|にゅういん}しました。** 〔Chichi wa byouki de isshuukan nyuuin shimashita.〕 — Bố tôi bị ốm nên đã nằm viện một tuần."
          },
          {
            "q": "{地震|じしん}のニュースを{見|み}ました。＿＿ですね。　〔Jishin no nyuusu o mimashita. __ desu ne.〕　— Tôi đã xem tin động đất. Đáng sợ nhỉ.",
            "options": [
              "{怖|こわ}い",
              "すいた",
              "{強|つよ}い",
              "{無料|むりょう}"
            ],
            "correct": 0,
            "why": "Cảm tưởng khi nghe tin xấu: 怖いですね. → **{地震|じしん}のニュースを{見|み}ました。{怖|こわ}いですね。** 〔Jishin no nyuusu o mimashita. Kowai desu ne.〕 — Tôi đã xem tin động đất. Đáng sợ nhỉ."
          },
          {
            "q": "{母|はは}が{入院|にゅういん}しましたから、＿＿です。　〔Haha ga nyuuin shimashita kara, __ desu.〕　— Mẹ tôi nhập viện nên tôi lo lắm.",
            "options": [
              "{無料|むりょう}",
              "{曇|くも}り",
              "{心配|しんぱい}",
              "{本当|ほんとう}"
            ],
            "correct": 2,
            "why": "Lo lắng = 心配です. → **{母|はは}が{入院|にゅういん}しましたから、{心配|しんぱい}です。** 〔Haha ga nyuuin shimashita kara, shinpai desu.〕 — Mẹ tôi nhập viện nên tôi lo lắm."
          },
          {
            "q": "{今日|きょう}は＿＿が{強|つよ}いですから、{傘|かさ}が{使|つか}えません。　〔Kyou wa __ ga tsuyoi desu kara, kasa ga tsukaemasen.〕　— Hôm nay gió mạnh nên không dùng ô được.",
            "options": [
              "ガラス",
              "{席|せき}",
              "{風|かぜ}",
              "ホール"
            ],
            "correct": 2,
            "why": "Gió mạnh = 風が 強い (khác 風邪 = cảm). → **{今日|きょう}は{風|かぜ}が{強|つよ}いですから、{傘|かさ}が{使|つか}えません。** 〔Kyou wa kaze ga tsuyoi desu kara, kasa ga tsukaemasen.〕 — Hôm nay gió mạnh nên không dùng ô được."
          },
          {
            "q": "この{携帯|けいたい}の＿＿はかわいいですね。　〔Kono keitai no __ wa kawaii desu ne.〕　— Dây đeo của điện thoại này dễ thương nhỉ.",
            "options": [
              "パーセント",
              "ストラップ",
              "チーム",
              "フリーマーケット"
            ],
            "correct": 1,
            "why": "Dây đeo điện thoại = ストラップ. → **この{携帯|けいたい}のストラップはかわいいですね。** 〔Kono keitai no sutorappu wa kawaii desu ne.〕 — Dây đeo của điện thoại này dễ thương nhỉ."
          },
          {
            "q": "{電車|でんしゃ}が{混|こ}んでいますから、＿＿がありません。　〔Densha ga konde imasu kara, __ ga arimasen.〕　— Tàu đông nên không có chỗ ngồi.",
            "options": [
              "{地震|じしん}",
              "{席|せき}",
              "{風|かぜ}",
              "{昔|むかし}"
            ],
            "correct": 1,
            "why": "Chỗ ngồi = 席. → **{電車|でんしゃ}が{混|こ}んでいますから、{席|せき}がありません。** 〔Densha ga konde imasu kara, seki ga arimasen.〕 — Tàu đông nên không có chỗ ngồi."
          },
          {
            "q": "{時間|じかん}がありません。＿＿ください。　〔Jikan ga arimasen. __ kudasai.〕　— Không có thời gian. Nhanh lên.",
            "options": [
              "{混|こ}んで",
              "{急|いそ}いで",
              "やんで",
              "{晴|は}れて"
            ],
            "correct": 1,
            "why": "Nhanh lên = 急いで ください. → **{時間|じかん}がありません。{急|いそ}いでください。** 〔Jikan ga arimasen. Isoide kudasai.〕 — Không có thời gian. Nhanh lên."
          },
          {
            "q": "{土曜日|どようび}は{店|みせ}が＿＿いますから、{平日|へいじつ}に{行|い}きましょう。　〔Doyoubi wa mise ga __ imasu kara, heijitsu ni ikimashou.〕　— Thứ Bảy quán đông nên hãy đi vào ngày thường.",
            "options": [
              "すいて",
              "{混|こ}んで",
              "{急|いそ}いで",
              "{勝|か}って"
            ],
            "correct": 1,
            "why": "Đông = 混みます → 混んで います. → **{土曜日|どようび}は{店|みせ}が{混|こ}んでいますから、{平日|へいじつ}に{行|い}きましょう。** 〔Doyoubi wa mise ga konde imasu kara, heijitsu ni ikimashou.〕 — Thứ Bảy quán đông nên hãy đi vào ngày thường."
          },
          {
            "q": "タクシーで{行|い}ったら、{九時|くじ}の{電車|でんしゃ}に＿＿と{思|おも}います。　〔Takushii de ittara, kuji no densha ni __ to omoimasu.〕　— Tôi nghĩ nếu đi taxi thì sẽ kịp chuyến tàu 9 giờ.",
            "options": [
              "やむ",
              "{混|こ}む",
              "{始|はじ}まる",
              "{間|ま}に{合|あ}う"
            ],
            "correct": 3,
            "why": "Kịp = N に 間に合います. → **タクシーで{行|い}ったら、{九時|くじ}の{電車|でんしゃ}に{間|ま}に{合|あ}うと{思|おも}います。** 〔Takushii de ittara, kuji no densha ni maniau to omoimasu.〕 — Tôi nghĩ nếu đi taxi thì sẽ kịp chuyến tàu 9 giờ."
          },
          {
            "q": "{雨|あめ}が＿＿から、{出|で}かけましょう。　〔Ame ga __ kara, dekakemashou.〕　— Mưa tạnh rồi, ta ra ngoài thôi.",
            "options": [
              "やんだ",
              "{混|こ}んだ",
              "{降|ふ}った",
              "{急|いそ}いだ"
            ],
            "correct": 0,
            "why": "Mưa tạnh = 雨が やみます → やんだ. → **{雨|あめ}がやんだから、{出|で}かけましょう。** 〔Ame ga yanda kara, dekakemashou.〕 — Mưa tạnh rồi, ta ra ngoài thôi."
          },
          {
            "q": "{明日|あした}＿＿たら、{海|うみ}へ{行|い}きませんか。　〔Ashita __ tara, umi e ikimasen ka.〕　— Nếu mai trời nắng thì đi biển không?",
            "options": [
              "{降|ふ}っ",
              "{混|こ}ん",
              "{曇|くも}っ",
              "{晴|は}れ"
            ],
            "correct": 3,
            "why": "Trời nắng = 晴れます → 晴れたら. → **{明日|あした}{晴|は}れたら、{海|うみ}へ{行|い}きませんか。** 〔Ashita hare tara, umi e ikimasen ka.〕 — Nếu mai trời nắng thì đi biển không?"
          },
          {
            "q": "{今日|きょう}は{全部|ぜんぶ}{二十|にじゅっ}＿＿{引|び}きです。　〔Kyou wa zenbu niju __ biki desu.〕　— Hôm nay tất cả giảm 20%.",
            "options": [
              "ガラス",
              "ホール",
              "チーム",
              "パーセント"
            ],
            "correct": 3,
            "why": "Phần trăm = パーセント. → **{今日|きょう}は{全部|ぜんぶ}{二十|にじゅっ}パーセント{引|び}きです。** 〔Kyou wa zenbu niju paasento biki desu.〕 — Hôm nay tất cả giảm 20%."
          },
          {
            "q": "{雨|あめ}の{日|ひ}は、{全部|ぜんぶ}{十|じゅっ}パーセント＿＿だそうです。　〔Ame no hi wa, zenbu ju paasento __ da sou desu.〕　— Nghe nói ngày mưa thì tất cả giảm 10%.",
            "options": [
              "{席|せき}",
              "{引|び}き",
              "{大会|たいかい}",
              "{位|い}"
            ],
            "correct": 1,
            "why": "Giảm (giá) = ～引き. → **{雨|あめ}の{日|ひ}は、{全部|ぜんぶ}{十|じゅっ}パーセント{引|び}きだそうです。** 〔Ame no hi wa, zenbu ju paasento biki da sou desu.〕 — Nghe nói ngày mưa thì tất cả giảm 10%."
          },
          {
            "q": "あのチームはとても＿＿ですから、きっと{勝|か}つと{思|おも}います。　〔Ano chiimu wa totemo __ desu kara, kitto katsu to omoimasu.〕　— Đội kia rất mạnh nên tôi nghĩ chắc chắn sẽ thắng.",
            "options": [
              "すいた",
              "{強|つよ}い",
              "{怖|こわ}い",
              "{心配|しんぱい}"
            ],
            "correct": 1,
            "why": "Mạnh = 強い. → **あのチームはとても{強|つよ}いですから、きっと{勝|か}つと{思|おも}います。** 〔Ano chiimu wa totemo tsuyoi desu kara, kitto katsu to omoimasu.〕 — Đội kia rất mạnh nên tôi nghĩ chắc chắn sẽ thắng."
          },
          {
            "q": "あの{店|みせ}のケーキは＿＿おいしいと{思|おも}います。{人気|にんき}がありますから。　〔Ano mise no keeki wa __ oishii to omoimasu. Ninki ga arimasu kara.〕　— Tôi nghĩ bánh quán đó chắc chắn ngon. Vì nó được ưa chuộng.",
            "options": [
              "なんと",
              "もし",
              "{本当|ほんとう}",
              "きっと"
            ],
            "correct": 3,
            "why": "Đoán chắc chắn = きっと ～と 思います. → **あの{店|みせ}のケーキはきっとおいしいと{思|おも}います。{人気|にんき}がありますから。** 〔Ano mise no keeki wa kitto oishii to omoimasu. Ninki ga arimasu kara.〕 — Tôi nghĩ bánh quán đó chắc chắn ngon. Vì nó được ưa chuộng."
          },
          {
            "q": "カルロスさんは＿＿{来|こ}ないと{思|おも}います。{忙|いそが}しいそうですから。　〔Karurosu-san wa __ konai to omoimasu. Isogashii sou desu kara.〕　— Tôi nghĩ có lẽ anh Carlos không đến. Nghe nói anh ấy bận.",
            "options": [
              "たぶん",
              "もし",
              "なんと",
              "きちんと"
            ],
            "correct": 0,
            "why": "Có lẽ = たぶん. → **カルロスさんはたぶん{来|こ}ないと{思|おも}います。{忙|いそが}しいそうですから。** 〔Karurosu-san wa tabun konai to omoimasu. Isogashii sou desu kara.〕 — Tôi nghĩ có lẽ anh Carlos không đến. Nghe nói anh ấy bận."
          },
          {
            "q": "＿＿{雨|あめ}が{降|ふ}ったら、{家|うち}で{映画|えいが}を{見|み}ましょう。　〔__ ame ga futtara, uchi de eiga o mimashou.〕　— Nếu trời mưa thì ở nhà xem phim nhé.",
            "options": [
              "きっと",
              "もし",
              "なんと",
              "たぶん"
            ],
            "correct": 1,
            "why": "Nếu (giả định) = もし ～たら. → **もし{雨|あめ}が{降|ふ}ったら、{家|うち}で{映画|えいが}を{見|み}ましょう。** 〔Moshi ame ga futtara, uchi de eiga o mimashou.〕 — Nếu trời mưa thì ở nhà xem phim nhé."
          },
          {
            "q": "{会場|かいじょう}に{人|ひと}がたくさん＿＿います。　〔Kaijou ni hito ga takusan __ imasu.〕　— Ở hội trường có rất nhiều người đang tụ tập.",
            "options": [
              "{始|はじ}まって",
              "{集|あつ}めて",
              "{閉|し}まって",
              "{集|あつ}まって"
            ],
            "correct": 3,
            "why": "Người tụ tập = 人が 集まります → 集まって います. → **{会場|かいじょう}に{人|ひと}がたくさん{集|あつ}まっています。** 〔Kaijou ni hito ga takusan atsumatte imasu.〕 — Ở hội trường có rất nhiều người đang tụ tập."
          },
          {
            "q": "もう{八時|はちじ}ですから、{店|みせ}は＿＿います。　〔Mou hachiji desu kara, mise wa __ imasu.〕　— Đã 8 giờ rồi nên cửa hàng đóng cửa rồi.",
            "options": [
              "{閉|し}まって",
              "{閉|し}めて",
              "{集|あつ}まって",
              "{始|はじ}まって"
            ],
            "correct": 0,
            "why": "Cửa hàng đóng = 店が 閉まります → 閉まって います. → **もう{八時|はちじ}ですから、{店|みせ}は{閉|し}まっています。** 〔Mou hachiji desu kara, mise wa shimatte imasu.〕 — Đã 8 giờ rồi nên cửa hàng đóng cửa rồi."
          },
          {
            "q": "{平日|へいじつ}の{朝|あさ}は、この{電車|でんしゃ}は＿＿います。{座|すわ}ることができます。　〔Heijitsu no asa wa, kono densha wa __ imasu. Suwaru koto ga dekimasu.〕　— Sáng ngày thường tàu này vắng. Có thể ngồi được.",
            "options": [
              "すいて",
              "{落|お}ちて",
              "{汚|よご}れて",
              "{混|こ}んで"
            ],
            "correct": 0,
            "why": "Vắng = すきます → すいて います. → **{平日|へいじつ}の{朝|あさ}は、この{電車|でんしゃ}はすいています。{座|すわ}ることができます。** 〔Heijitsu no asa wa, kono densha wa suite imasu. Suwaru koto ga dekimasu.〕 — Sáng ngày thường tàu này vắng. Có thể ngồi được."
          },
          {
            "q": "あ、{道|みち}に{財布|さいふ}が＿＿いますよ。　〔A, michi ni saifu ga __ imasu yo.〕　— Ơ, có cái ví rơi trên đường kìa.",
            "options": [
              "すいて",
              "{倒|たお}れて",
              "{落|お}ちて",
              "{割|わ}れて"
            ],
            "correct": 2,
            "why": "Rơi = 落ちます → 落ちて います. → **あ、{道|みち}に{財布|さいふ}が{落|お}ちていますよ。** 〔A, michi ni saifu ga ochite imasu yo.〕 — Ơ, có cái ví rơi trên đường kìa."
          },
          {
            "q": "{部屋|へや}の{電気|でんき}が＿＿います。だれもいないと{思|おも}います。　〔Heya no denki ga __ imasu. Dare mo inai to omoimasu.〕　— Đèn phòng đang tắt. Tôi nghĩ không có ai.",
            "options": [
              "{消|け}して",
              "{閉|し}まって",
              "ついて",
              "{消|き}えて"
            ],
            "correct": 3,
            "why": "Đèn tắt (trạng thái) = 電気が 消えて います. → **{部屋|へや}の{電気|でんき}が{消|き}えています。だれもいないと{思|おも}います。** 〔Heya no denki ga kiete imasu. Dare mo inai to omoimasu.〕 — Đèn phòng đang tắt. Tôi nghĩ không có ai."
          },
          {
            "q": "このパソコンは＿＿いますから、{使|つか}うことができません。　〔Kono pasokon wa __ imasu kara, tsukau koto ga dekimasen.〕　— Máy tính này hỏng nên không dùng được.",
            "options": [
              "{倒|たお}れて",
              "{壊|こわ}れて",
              "{割|わ}れて",
              "{汚|よご}れて"
            ],
            "correct": 1,
            "why": "Máy hỏng = 壊れます → 壊れて います. → **このパソコンは{壊|こわ}れていますから、{使|つか}うことができません。** 〔Kono pasokon wa kowarete imasu kara, tsukau koto ga dekimasen.〕 — Máy tính này hỏng nên không dùng được."
          },
          {
            "q": "すみません、このコップ、＿＿います。ほかのコップをください。　〔Sumimasen, kono koppu, __ imasu. Hoka no koppu o kudasai.〕　— Xin lỗi, cái cốc này bị bẩn. Cho tôi cái cốc khác.",
            "options": [
              "{消|き}えて",
              "{倒|たお}れて",
              "{汚|よご}れて",
              "{壊|こわ}れて"
            ],
            "correct": 2,
            "why": "Bẩn = 汚れます → 汚れて います. → **すみません、このコップ、{汚|よご}れています。ほかのコップをください。** 〔Sumimasen, kono koppu, yogorete imasu. Hoka no koppu o kudasai.〕 — Xin lỗi, cái cốc này bị bẩn. Cho tôi cái cốc khác."
          },
          {
            "q": "{来月|らいげつ}、{大学|だいがく}で{日本語|にほんご}の＿＿があります。　〔Raigetsu, daigaku de Nihongo no __ ga arimasu.〕　— Tháng sau ở trường đại học có cuộc thi hùng biện tiếng Nhật.",
            "options": [
              "ガラス",
              "ストラップ",
              "フリーマーケット",
              "スピーチコンテスト"
            ],
            "correct": 3,
            "why": "Cuộc thi hùng biện = スピーチコンテスト. → **{来月|らいげつ}、{大学|だいがく}で{日本語|にほんご}のスピーチコンテストがあります。** 〔Raigetsu, daigaku de Nihongo no supiichikontesuto ga arimasu.〕 — Tháng sau ở trường đại học có cuộc thi hùng biện tiếng Nhật."
          },
          {
            "q": "ワンさんはスピーチコンテストで{一|いち}＿＿になりました。　〔Wan-san wa supiichikontesuto de ichi__ ni narimashita.〕　— Chị Wang đã đạt hạng nhất cuộc thi hùng biện.",
            "options": [
              "{位|い}",
              "{大会|たいかい}",
              "{引|び}き",
              "パーセント"
            ],
            "correct": 0,
            "why": "Hạng ~ = ～位 (1位 = hạng nhất). → **ワンさんはスピーチコンテストで{一|いち}{位|い}になりました。** 〔Wan-san wa supiichikontesuto de ichii ni narimashita.〕 — Chị Wang đã đạt hạng nhất cuộc thi hùng biện."
          },
          {
            "q": "{緊張|きんちょう}しましたが、＿＿まで{話|はな}すことができました。　〔Kinchou shimashita ga, __ made hanasu koto ga dekimashita.〕　— Tôi hồi hộp nhưng đã nói được đến cuối.",
            "options": [
              "{昔|むかし}",
              "{夕方|ゆうがた}",
              "{最後|さいご}",
              "{本当|ほんとう}"
            ],
            "correct": 2,
            "why": "Đến cuối = 最後まで. → **{緊張|きんちょう}しましたが、{最後|さいご}まで{話|はな}すことができました。** 〔Kinchou shimashita ga, saigo made hanasu koto ga dekimashita.〕 — Tôi hồi hộp nhưng đã nói được đến cuối."
          },
          {
            "q": "{大学|だいがく}の＿＿に{三百人|さんびゃくにん}{集|あつ}まりました。　〔Daigaku no __ ni sanbyakunin atsumarimashita.〕　— Ba trăm người đã tụ tập ở hội trường trường đại học.",
            "options": [
              "チーム",
              "ガラス",
              "ホール",
              "ストラップ"
            ],
            "correct": 2,
            "why": "Hội trường = ホール. → **{大学|だいがく}のホールに{三百人|さんびゃくにん}{集|あつ}まりました。** 〔Daigaku no hooru ni sanbyakunin atsumarimashita.〕 — Ba trăm người đã tụ tập ở hội trường trường đại học."
          },
          {
            "q": "{日本|にほん}の{旅行|りょこう}はいい＿＿になりました。　〔Nihon no ryokou wa ii __ ni narimashita.〕　— Chuyến du lịch Nhật Bản đã trở thành kỷ niệm đẹp.",
            "options": [
              "{本当|ほんとう}",
              "{会場|かいじょう}",
              "{思|おも}い{出|で}",
              "{最後|さいご}"
            ],
            "correct": 2,
            "why": "Kỷ niệm = 思い出. → **{日本|にほん}の{旅行|りょこう}はいい{思|おも}い{出|で}になりました。** 〔Nihon no ryokou wa ii omoide ni narimashita.〕 — Chuyến du lịch Nhật Bản đã trở thành kỷ niệm đẹp."
          },
          {
            "q": "{私|わたし}の{話|はなし}を{聞|き}いて、{先生|せんせい}は「そうですね」と＿＿。　〔Watashi no hanashi o kiite, sensei wa \"sou desu ne\" to __.〕　— Nghe chuyện của tôi, thầy gật đầu: \"Đúng vậy nhỉ.\"",
            "options": [
              "{倒|たお}れました",
              "{急|いそ}ぎました",
              "うなずきました",
              "{緊張|きんちょう}しました"
            ],
            "correct": 2,
            "why": "Gật đầu = うなずきます. → **{私|わたし}の{話|はなし}を{聞|き}いて、{先生|せんせい}は「そうですね」とうなずきました。** 〔Watashi no hanashi o kiite, sensei wa \"sou desu ne\" to unazukimashita.〕 — Nghe chuyện của tôi, thầy gật đầu: \"Đúng vậy nhỉ.\""
          },
          {
            "q": "{初|はじ}めてのスピーチでしたから、とても＿＿。　〔Hajimete no supiichi deshita kara, totemo __.〕　— Vì là bài hùng biện đầu tiên nên tôi rất hồi hộp.",
            "options": [
              "{入院|にゅういん}しました",
              "{結婚|けっこん}しました",
              "うなずきました",
              "{緊張|きんちょう}しました"
            ],
            "correct": 3,
            "why": "Hồi hộp = 緊張します. → **{初|はじ}めてのスピーチでしたから、とても{緊張|きんちょう}しました。** 〔Hajimete no supiichi deshita kara, totemo kinchou shimashita.〕 — Vì là bài hùng biện đầu tiên nên tôi rất hồi hộp."
          },
          {
            "q": "{私|わたし}の{話|はなし}を{聞|き}いて、みんな＿＿。　〔Watashi no hanashi o kiite, minna __.〕　— Nghe chuyện của tôi, mọi người đều cười.",
            "options": [
              "{倒|たお}れました",
              "{笑|わら}いました",
              "{止|と}まりました",
              "{割|わ}れました"
            ],
            "correct": 1,
            "why": "Cười = 笑います. → **{私|わたし}の{話|はなし}を{聞|き}いて、みんな{笑|わら}いました。** 〔Watashi no hanashi o kiite, minna waraimashita.〕 — Nghe chuyện của tôi, mọi người đều cười."
          },
          {
            "q": "{一年|いちねん}しか{勉強|べんきょう}していませんが、＿＿、ワンさんは{一位|いちい}でした。　〔Ichinen shika benkyou shite imasen ga, __, Wan-san wa ichii deshita.〕　— Mới học có một năm, vậy mà chị Wang được hạng nhất.",
            "options": [
              "きっと",
              "もし",
              "たぶん",
              "なんと"
            ],
            "correct": 3,
            "why": "Bất ngờ \"vậy mà\" = なんと. → **{一年|いちねん}しか{勉強|べんきょう}していませんが、なんと、ワンさんは{一位|いちい}でした。** 〔Ichinen shika benkyou shite imasen ga, nanto, Wan-san wa ichii deshita.〕 — Mới học có một năm, vậy mà chị Wang được hạng nhất."
          },
          {
            "q": "コンサートの＿＿は{駅|えき}の{近|ちか}くのホールです。　〔Konsaato no __ wa eki no chikaku no hooru desu.〕　— Địa điểm buổi hoà nhạc là hội trường gần ga.",
            "options": [
              "{思|おも}い{出|で}",
              "チーム",
              "{会場|かいじょう}",
              "{席|せき}"
            ],
            "correct": 2,
            "why": "Địa điểm tổ chức = 会場. → **コンサートの{会場|かいじょう}は{駅|えき}の{近|ちか}くのホールです。** 〔Konsaato no kaijou wa eki no chikaku no hooru desu.〕 — Địa điểm buổi hoà nhạc là hội trường gần ga."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-tv-go-tu",
        "title": "Gõ từ tiếng Nhật theo nghĩa (54 câu)",
        "kind": "translate",
        "items": [
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"kính, thuỷ tinh\"",
            "answers": [
              "ガラス"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"trời nhiều mây\"",
            "answers": [
              "曇り",
              "くもり"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bão\"",
            "answers": [
              "台風",
              "たいふう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"động đất\"",
            "answers": [
              "地震",
              "じしん"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tai nạn, sự cố\"",
            "answers": [
              "事故",
              "じこ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đại hội, lễ hội lớn\"",
            "answers": [
              "大会",
              "たいかい"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đội (thể thao)\"",
            "answers": [
              "チーム"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"huỷ, hoãn\"",
            "answers": [
              "中止",
              "ちゅうし"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"chợ đồ cũ\"",
            "answers": [
              "フリーマーケット"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"sự thật\"",
            "answers": [
              "本当",
              "ほんとう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"ngày xưa\"",
            "answers": [
              "昔",
              "むかし"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"miễn phí\"",
            "answers": [
              "無料",
              "むりょう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"chiều tối\"",
            "answers": [
              "夕方",
              "ゆうがた"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"chết\"",
            "answers": [
              "死にます",
              "しにます",
              "死ぬ",
              "しぬ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"qua đời (lịch sự)\"",
            "answers": [
              "亡くなります",
              "なくなります",
              "亡くなる",
              "なくなる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(tàu, xe) dừng lại\"",
            "answers": [
              "止まります",
              "とまります",
              "止まる",
              "とまる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(việc gì) bắt đầu\"",
            "answers": [
              "始まります",
              "はじまります",
              "始まる",
              "はじまる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(mưa) rơi\"",
            "answers": [
              "降ります",
              "ふります",
              "降る",
              "ふる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"thắng\"",
            "answers": [
              "勝ちます",
              "かちます",
              "勝つ",
              "かつ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"thua\"",
            "answers": [
              "負けます",
              "まけます",
              "負ける",
              "まける"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(cây) đổ\"",
            "answers": [
              "倒れます",
              "たおれます",
              "倒れる",
              "たおれる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(cốc) vỡ\"",
            "answers": [
              "割れます",
              "われます",
              "割れる",
              "われる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"kết hôn\"",
            "answers": [
              "結婚します",
              "けっこんします",
              "結婚する",
              "けっこんする"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"nhập viện\"",
            "answers": [
              "入院します",
              "にゅういんします",
              "入院する",
              "にゅういんする"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"sợ, đáng sợ\"",
            "answers": [
              "怖い",
              "こわい"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"lo lắng\"",
            "answers": [
              "心配",
              "しんぱい",
              "心配な",
              "しんぱいな"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"gió\"",
            "answers": [
              "風",
              "かぜ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"dây đeo điện thoại\"",
            "answers": [
              "ストラップ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"chỗ ngồi\"",
            "answers": [
              "席",
              "せき"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"vội\"",
            "answers": [
              "急ぎます",
              "いそぎます",
              "急ぐ",
              "いそぐ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đông, chật\"",
            "answers": [
              "混みます",
              "こみます",
              "混む",
              "こむ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"kịp\"",
            "answers": [
              "間に合います",
              "間にあいます",
              "まに合います",
              "まにあいます",
              "間に合う",
              "間にあう",
              "まに合う",
              "まにあう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(mưa) tạnh\"",
            "answers": [
              "やみます",
              "やむ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(trời) nắng\"",
            "answers": [
              "晴れます",
              "はれます",
              "晴れる",
              "はれる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"phần trăm\"",
            "answers": [
              "パーセント"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"mạnh\"",
            "answers": [
              "強い",
              "つよい"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"chắc chắn\"",
            "answers": [
              "きっと"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"có lẽ\"",
            "answers": [
              "たぶん"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"nếu\"",
            "answers": [
              "もし"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(người) tụ tập\"",
            "answers": [
              "集まります",
              "あつまります",
              "集まる",
              "あつまる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(cửa hàng) đóng\"",
            "answers": [
              "閉まります",
              "しまります",
              "閉まる",
              "しまる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"vắng\"",
            "answers": [
              "すきます",
              "すく"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"rơi, rớt\"",
            "answers": [
              "落ちます",
              "おちます",
              "落ちる",
              "おちる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"(đèn) tắt\"",
            "answers": [
              "消えます",
              "きえます",
              "消える",
              "きえる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"hỏng\"",
            "answers": [
              "壊れます",
              "こわれます",
              "壊れる",
              "こわれる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bẩn\"",
            "answers": [
              "汚れます",
              "よごれます",
              "汚れる",
              "よごれる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cuộc thi hùng biện\"",
            "answers": [
              "スピーチコンテスト"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cuối cùng\"",
            "answers": [
              "最後",
              "さいご"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"hội trường\"",
            "answers": [
              "ホール",
              "会場",
              "かいじょう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"kỷ niệm\"",
            "answers": [
              "思い出",
              "思いで",
              "おもい出",
              "おもいで"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"gật đầu\"",
            "answers": [
              "うなずきます",
              "うなずく"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"hồi hộp\"",
            "answers": [
              "緊張します",
              "きんちょうします",
              "緊張する",
              "きんちょうする"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cười\"",
            "answers": [
              "笑います",
              "わらいます",
              "笑う",
              "わらう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"địa điểm tổ chức\"",
            "answers": [
              "会場",
              "かいじょう"
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
        "id": "lt-b15-tv-sai",
        "title": "Tìm câu SAI (9 câu)",
        "items": [
          {
            "q": "(止まります／止めます)　Câu nào SAI?",
            "options": [
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まりました。 (Jiko de densha ga tomarimashita.)",
              "ここに{車|くるま}を{止|と}めてください。 (Koko ni kuruma o tomete kudasai.)",
              "{事故|じこ}で{電車|でんしゃ}を{止|と}まりました。 (Jiko de densha o tomarimashita.)",
              "バスが{駅|えき}の{前|まえ}に{止|と}まっています。 (Basu ga eki no mae ni tomatte imasu.)"
            ],
            "correct": 2,
            "why": "Tự động từ **止まります** đi với **が**: 電車が 止まりました."
          },
          {
            "q": "(始まります／始めます)　Câu nào SAI?",
            "options": [
              "{授業|じゅぎょう}を{九時|くじ}に{始|はじ}まります。 (Jugyou o kuji ni hajimarimasu.)",
              "{先生|せんせい}が{授業|じゅぎょう}を{始|はじ}めます。 (Sensei ga jugyou o hajimemasu.)",
              "コンサートがもう{始|はじ}まっています。 (Konsaato ga mou hajimatte imasu.)",
              "{授業|じゅぎょう}は{九時|くじ}に{始|はじ}まります。 (Jugyou wa kuji ni hajimarimasu.)"
            ],
            "correct": 0,
            "why": "Tự động từ: 授業**が／は** 始まります; 始めます cần người làm + を."
          },
          {
            "q": "(降ります)　Câu nào SAI?",
            "options": [
              "{雨|あめ}が{降|ふ}っています。 (Ame ga futte imasu.)",
              "{次|つぎ}の{駅|えき}で{電車|でんしゃ}を{降|お}ります。 (Tsugi no eki de densha o orimasu.)",
              "{雨|あめ}が{降|お}りています。 (Ame ga orite imasu.)",
              "{雪|ゆき}が{降|ふ}ったら、{出|で}かけません。 (Yuki ga futtara, dekakemasen.)"
            ],
            "correct": 2,
            "why": "Mưa rơi = 降る (**ふ**る → 降って); 降りる (おりる) là xuống xe."
          },
          {
            "q": "(勝ちます／負けます)　Câu nào SAI?",
            "options": [
              "{私|わたし}たちは{強|つよ}いチームに{負|ま}けました。 (Watashi tachi wa tsuyoi chiimu ni makemashita.)",
              "{昨日|きのう}の{試合|しあい}は{負|ま}けました。 (Kinou no shiai wa makemashita.)",
              "{日本|にほん}のチームはブラジルを{勝|か}ちました。 (Nihon no chiimu wa Burajiru o kachimashita.)",
              "{日本|にほん}のチームはブラジルに{勝|か}ちました。 (Nihon no chiimu wa Burajiru ni kachimashita.)"
            ],
            "correct": 2,
            "why": "Thắng / thua ai → **に** 勝ちます／負けます."
          },
          {
            "q": "(結婚します)　Câu nào SAI?",
            "options": [
              "{兄|あに}は{山口|やまぐち}さんを{結婚|けっこん}しました。 (Ani wa Yamaguchi-san o kekkon shimashita.)",
              "マルコさんは{結婚|けっこん}しています。 (Maruko-san wa kekkon shite imasu.)",
              "{来年|らいねん}{結婚|けっこん}したいです。 (Rainen kekkon shitai desu.)",
              "{兄|あに}は{山口|やまぐち}さんと{結婚|けっこん}しました。 (Ani wa Yamaguchi-san to kekkon shimashita.)"
            ],
            "correct": 0,
            "why": "Kết hôn với ai → **と** 結婚します."
          },
          {
            "q": "(混みます／すきます)　Câu nào SAI?",
            "options": [
              "{日曜日|にちようび}は{人|ひと}が{多|おお}いですから、{店|みせ}が{混|こ}んでいます。 (Nichiyoubi wa hito ga ooi desu kara, mise ga konde imasu.)",
              "{日曜日|にちようび}は{人|ひと}が{多|おお}いですから、{店|みせ}がすいています。 (Nichiyoubi wa hito ga ooi desu kara, mise ga suite imasu.)",
              "{平日|へいじつ}の{朝|あさ}は{電車|でんしゃ}がすいています。 (Heijitsu no asa wa densha ga suite imasu.)",
              "{夕方|ゆうがた}は{道|みち}が{混|こ}んでいます。 (Yuugata wa michi ga konde imasu.)"
            ],
            "correct": 1,
            "why": "Đông người → **混んで います**; すいて います = vắng."
          },
          {
            "q": "(間に合います)　Câu nào SAI?",
            "options": [
              "{急|いそ}いだら、{電車|でんしゃ}に{間|ま}に{合|あ}います。 (Isoidara, densha ni maniaimasu.)",
              "{急|いそ}いだら、{電車|でんしゃ}を{間|ま}に{合|あ}います。 (Isoidara, densha o maniaimasu.)",
              "{授業|じゅぎょう}に{間|ま}に{合|あ}いませんでした。 (Jugyou ni maniaimasendeshita.)",
              "タクシーで{行|い}ったら、{間|ま}に{合|あ}うと{思|おも}います。 (Takushii de ittara, maniau to omoimasu.)"
            ],
            "correct": 1,
            "why": "Kịp cái gì → **に** 間に合います."
          },
          {
            "q": "(心配)　Câu nào SAI?",
            "options": [
              "{母|はは}が{入院|にゅういん}しましたから、{心配|しんぱい}いです。 (Haha ga nyuuin shimashita kara, shinpaii desu.)",
              "{心配|しんぱい}しないでください。 (Shinpai shinaide kudasai.)",
              "{母|はは}が{入院|にゅういん}しましたから、{心配|しんぱい}です。 (Haha ga nyuuin shimashita kara, shinpai desu.)",
              "{試験|しけん}が{心配|しんぱい}です。 (Shiken ga shinpai desu.)"
            ],
            "correct": 0,
            "why": "心配 là tính từ な / danh từ → **心配です** (không có ~~心配い~~)."
          },
          {
            "q": "(消えます／消します)　Câu nào SAI?",
            "options": [
              "{電気|でんき}が{消|き}えています。 (Denki ga kiete imasu.)",
              "{部屋|へや}を{出|で}るとき、{電気|でんき}を{消|け}してください。 (Heya o deru toki, denki o keshite kudasai.)",
              "{部屋|へや}を{出|で}るとき、{電気|でんき}を{消|き}えてください。 (Heya o deru toki, denki o kiete kudasai.)",
              "{地震|じしん}で{電気|でんき}が{消|き}えました。 (Jishin de denki ga kiemashita.)"
            ],
            "correct": 2,
            "why": "Người làm tắt → **消します** (電気を 消して); 消えます là đèn tự tắt (電気が 消えます)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tv-nhat-viet",
        "title": "Đọc câu Nhật → chọn nghĩa Việt (9 câu)",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {台風|たいふう}で{木|き}が{倒|たお}れたそうです。　〔Taifuu de ki ga taoreta sou desu.〕",
            "options": [
              "Dù có bão cây cũng không đổ.",
              "Tôi nghĩ bão sẽ làm đổ cây.",
              "Nghe nói vì bão mà cây đã đổ.",
              "Nếu có bão thì cây sẽ đổ."
            ],
            "correct": 2,
            "why": "N で = vì N; ～そうです = nghe nói."
          },
          {
            "q": "Câu này nghĩa là gì? {雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。　〔Ame ga futte mo, shiai wa arimasu.〕",
            "options": [
              "Dù mưa trận đấu vẫn diễn ra.",
              "Trời mưa nên trận đấu đã diễn ra.",
              "Nghe nói trời mưa nên không có trận đấu.",
              "Nếu mưa thì trận đấu bị huỷ."
            ],
            "correct": 0,
            "why": "～ても = dù … vẫn."
          },
          {
            "q": "Câu này nghĩa là gì? {時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。　〔Jikan ga attara, issho ni ikimasen ka.〕",
            "options": [
              "Nếu có thời gian thì đi cùng không?",
              "Vì có thời gian nên đi cùng nhau.",
              "Dù có thời gian cũng không đi.",
              "Có thời gian rồi, đi thôi."
            ],
            "correct": 0,
            "why": "～たら = nếu … thì."
          },
          {
            "q": "Câu này nghĩa là gì? {店|みせ}の{前|まえ}に{人|ひと}がたくさん{並|なら}んでいます。　〔Mise no mae ni hito ga takusan narande imasu.〕",
            "options": [
              "Hãy xếp hàng trước cửa hàng.",
              "Trước cửa hàng không có ai.",
              "Nghe nói trước cửa hàng sẽ có nhiều người.",
              "Trước cửa hàng có nhiều người đang xếp hàng."
            ],
            "correct": 3,
            "why": "Vています = trạng thái trước mắt (ポイント 122)."
          },
          {
            "q": "Câu này nghĩa là gì? あのチームはたぶん{負|ま}けると{思|おも}います。　〔Ano chiimu wa tabun makeru to omoimasu.〕",
            "options": [
              "Tôi chắc chắn đội kia thắng.",
              "Tôi nghĩ có lẽ đội kia sẽ thua.",
              "Nghe nói đội kia đã thua.",
              "Nếu đội kia thua thì tôi buồn."
            ],
            "correct": 1,
            "why": "たぶん ～と 思います = đoán có lẽ."
          },
          {
            "q": "Câu này nghĩa là gì? {駅|えき}の{近|ちか}くに{新|あたら}しい{図書館|としょかん}ができたそうです。　〔Eki no chikaku ni atarashii toshokan ga dekita sou desu.〕",
            "options": [
              "Nghe nói gần ga mới có thư viện mới.",
              "Thư viện gần ga đã đóng cửa.",
              "Tôi nghĩ sẽ xây thư viện gần ga.",
              "Gần ga có thể học ở thư viện."
            ],
            "correct": 0,
            "why": "できます (nghĩa mới) = được xây xong, mở ra."
          },
          {
            "q": "Câu này nghĩa là gì? もし{電車|でんしゃ}に{間|ま}に{合|あ}わなかったら、タクシーで{行|い}きます。　〔Moshi densha ni maniawanakattara, takushii de ikimasu.〕",
            "options": [
              "Dù kịp tàu tôi vẫn đi taxi.",
              "Nếu không kịp tàu thì tôi đi taxi.",
              "Tôi nghĩ sẽ không kịp tàu.",
              "Vì không kịp tàu nên tôi đi taxi."
            ],
            "correct": 1,
            "why": "もし ～なかったら = nếu không …."
          },
          {
            "q": "Câu này nghĩa là gì? コップが{汚|よご}れています。　〔Koppu ga yogorete imasu.〕",
            "options": [
              "Cái cốc bị bẩn.",
              "Hãy làm bẩn cái cốc.",
              "Cái cốc sắp bẩn.",
              "Nghe nói cái cốc bị bẩn."
            ],
            "correct": 0,
            "why": "Tự động từ + ています = trạng thái."
          },
          {
            "q": "Câu này nghĩa là gì? {最後|さいご}まで{話|はな}すことができて、いい{思|おも}い{出|で}になりました。　〔Saigo made hanasu koto ga dekite, ii omoide ni narimashita.〕",
            "options": [
              "Lần cuối tôi nói chuyện là một kỷ niệm buồn.",
              "Tôi không thể nói đến cuối.",
              "Tôi muốn nói đến cuối để có kỷ niệm.",
              "Tôi đã nói được đến cuối, và nó trở thành kỷ niệm đẹp."
            ],
            "correct": 3,
            "why": "最後まで · ～ことが できます · 思い出に なります."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-tv-dich",
        "title": "Dịch Việt → Nhật bằng từ của bài (12 câu)",
        "kind": "translate",
        "grammar": "Tự động từ: 止まる · 始まる · 集まる · 閉まる · 消える · 壊れる · 汚れる · 割れる (N が ～)",
        "items": [
          {
            "q": "Nghe nói ngày mai có bão.",
            "answers": [
              "明日台風が来るそうです。",
              "明日台風がくるそうです。",
              "明日たいふうが来るそうです。",
              "明日たいふうがくるそうです。",
              "あした台風が来るそうです。",
              "あした台風がくるそうです。",
              "あしたたいふうが来るそうです。",
              "あしたたいふうがくるそうです。",
              "明日は台風が来るそうです。",
              "明日は台風がくるそうです。",
              "明日はたいふうが来るそうです。",
              "明日はたいふうがくるそうです。",
              "あしたは台風が来るそうです。",
              "あしたは台風がくるそうです。",
              "あしたはたいふうが来るそうです。",
              "あしたはたいふうがくるそうです。",
              "明日台風があるそうです。",
              "明日たいふうがあるそうです。",
              "あした台風があるそうです。",
              "あしたたいふうがあるそうです。"
            ],
            "hint": "来る そうです"
          },
          {
            "q": "Vì tai nạn mà tàu điện đã dừng.",
            "answers": [
              "事故で電車が止まりました。",
              "事故で電車がとまりました。",
              "事故ででんしゃが止まりました。",
              "事故ででんしゃがとまりました。",
              "じこで電車が止まりました。",
              "じこで電車がとまりました。",
              "じこででんしゃが止まりました。",
              "じこででんしゃがとまりました。"
            ],
            "hint": "事故で"
          },
          {
            "q": "Nếu mưa thì trận đấu bị huỷ.",
            "answers": [
              "雨だったら、試合は中止です。",
              "雨だったら、試合はちゅうしです。",
              "雨だったら、しあいは中止です。",
              "雨だったら、しあいはちゅうしです。",
              "あめだったら、試合は中止です。",
              "あめだったら、試合はちゅうしです。",
              "あめだったら、しあいは中止です。",
              "あめだったら、しあいはちゅうしです。",
              "雨が降ったら、試合は中止です。",
              "雨が降ったら、試合はちゅうしです。",
              "雨が降ったら、しあいは中止です。",
              "雨が降ったら、しあいはちゅうしです。",
              "雨がふったら、試合は中止です。",
              "雨がふったら、試合はちゅうしです。",
              "雨がふったら、しあいは中止です。",
              "雨がふったら、しあいはちゅうしです。",
              "あめが降ったら、試合は中止です。",
              "あめが降ったら、試合はちゅうしです。",
              "あめが降ったら、しあいは中止です。",
              "あめが降ったら、しあいはちゅうしです。",
              "あめがふったら、試合は中止です。",
              "あめがふったら、試合はちゅうしです。",
              "あめがふったら、しあいは中止です。",
              "あめがふったら、しあいはちゅうしです。"
            ],
            "hint": "雨だったら"
          },
          {
            "q": "Dù mưa tôi vẫn đi.",
            "answers": [
              "雨が降っても、行きます。",
              "雨が降っても、いきます。",
              "雨がふっても、行きます。",
              "雨がふっても、いきます。",
              "あめが降っても、行きます。",
              "あめが降っても、いきます。",
              "あめがふっても、行きます。",
              "あめがふっても、いきます。",
              "雨でも、行きます。",
              "雨でも、いきます。",
              "あめでも、行きます。",
              "あめでも、いきます。"
            ],
            "hint": "降っても"
          },
          {
            "q": "Tôi nghĩ có lẽ ngày mai trời nắng.",
            "answers": [
              "あしたはたぶん晴れると思います。",
              "あしたはたぶん晴れるとおもいます。",
              "あしたはたぶんはれると思います。",
              "あしたはたぶんはれるとおもいます。",
              "たぶん明日は晴れると思います。",
              "たぶん明日は晴れるとおもいます。",
              "たぶん明日ははれると思います。",
              "たぶん明日ははれるとおもいます。",
              "たぶんあしたは晴れると思います。",
              "たぶんあしたは晴れるとおもいます。",
              "たぶんあしたははれると思います。",
              "たぶんあしたははれるとおもいます。"
            ],
            "hint": "たぶん ～と 思います"
          },
          {
            "q": "Cửa hàng đang đóng cửa.",
            "answers": [
              "店が閉まっています。",
              "店がしまっています。",
              "みせが閉まっています。",
              "みせがしまっています。",
              "店は閉まっています。",
              "店はしまっています。",
              "みせは閉まっています。",
              "みせはしまっています。"
            ],
            "hint": "閉まって います"
          },
          {
            "q": "Tàu vắng.",
            "answers": [
              "電車がすいています。",
              "でんしゃがすいています。",
              "電車はすいています。",
              "でんしゃはすいています。"
            ],
            "hint": "すいて います"
          },
          {
            "q": "Máy tính bị hỏng.",
            "answers": [
              "パソコンが壊れています。",
              "パソコンがこわれています。",
              "パソコンが壊れました。",
              "パソコンがこわれました。"
            ],
            "hint": "壊れて います"
          },
          {
            "q": "Nhanh lên kẻo không kịp.",
            "answers": [
              "急がないと、間に合いません。",
              "急がないと、間にあいません。",
              "急がないと、まに合いません。",
              "急がないと、まにあいません。",
              "いそがないと、間に合いません。",
              "いそがないと、間にあいません。",
              "いそがないと、まに合いません。",
              "いそがないと、まにあいません。",
              "急いでください。間に合いません。",
              "急いでください。間にあいません。",
              "急いでください。まに合いません。",
              "急いでください。まにあいません。",
              "いそいでください。間に合いません。",
              "いそいでください。間にあいません。",
              "いそいでください。まに合いません。",
              "いそいでください。まにあいません。"
            ],
            "hint": "間に合いません"
          },
          {
            "q": "Hôm nay giảm 20%.",
            "answers": [
              "今日は二十パーセント引きです。",
              "今日は二十パーセントびきです。",
              "今日はにじゅっパーセント引きです。",
              "今日はにじゅっパーセントびきです。",
              "きょうは二十パーセント引きです。",
              "きょうは二十パーセントびきです。",
              "きょうはにじゅっパーセント引きです。",
              "きょうはにじゅっパーセントびきです。"
            ],
            "hint": "パーセント引き"
          },
          {
            "q": "Tôi rất hồi hộp.",
            "answers": [
              "とても緊張しました。",
              "とてもきんちょうしました。",
              "とても緊張しています。",
              "とてもきんちょうしています。"
            ],
            "hint": "緊張します"
          },
          {
            "q": "Gió mạnh nhỉ.",
            "answers": [
              "風が強いですね。",
              "風がつよいですね。",
              "かぜが強いですね。",
              "かぜがつよいですね。"
            ],
            "hint": "風が 強い"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-tv-ghep",
        "title": "Ghép câu bằng từ vựng Bài 15 (8 câu)",
        "items": [
          {
            "vi": "Nghe nói vì động đất mà toà nhà đã đổ.",
            "chips": [
              "{倒|たお}れた",
              "{地震|じしん}で",
              "そうです",
              "{倒|たお}れます",
              "ビルが"
            ],
            "answer": [
              "{地震|じしん}で",
              "ビルが",
              "{倒|たお}れた",
              "そうです"
            ],
            "ro": "Jishin de biru ga taoreta sou desu"
          },
          {
            "vi": "Nghe nói ngày mai bảo tàng miễn phí.",
            "chips": [
              "{無料|むりょう}な",
              "{無料|むりょう}だ",
              "そうです",
              "{美術館|びじゅつかん}は",
              "{明日|あした}、"
            ],
            "answer": [
              "{明日|あした}、",
              "{美術館|びじゅつかん}は",
              "{無料|むりょう}だ",
              "そうです"
            ],
            "ro": "Ashita, bijutsukan wa muryou da sou desu"
          },
          {
            "vi": "Nếu trời nắng thì đi biển nhé.",
            "chips": [
              "{海|うみ}へ",
              "{行|い}きましょう",
              "{晴|は}れても、",
              "{晴|は}れたら、"
            ],
            "answer": [
              "{晴|は}れたら、",
              "{海|うみ}へ",
              "{行|い}きましょう"
            ],
            "ro": "Haretara, umi e ikimashou"
          },
          {
            "vi": "Dù đông tôi vẫn muốn đi.",
            "chips": [
              "{混|こ}んでいても、",
              "です",
              "{行|い}きたい",
              "{混|こ}んだら、"
            ],
            "answer": [
              "{混|こ}んでいても、",
              "{行|い}きたい",
              "です"
            ],
            "ro": "Konde ite mo, ikitai desu"
          },
          {
            "vi": "Ơ, cửa kính bị vỡ kìa.",
            "chips": [
              "{割|わ}っています",
              "{窓|まど}ガラスが",
              "あっ、",
              "{割|わ}れています"
            ],
            "answer": [
              "あっ、",
              "{窓|まど}ガラスが",
              "{割|わ}れています"
            ],
            "ro": "A, mado garasu ga warete imasu"
          },
          {
            "vi": "Ở hội trường có nhiều người đang tụ tập.",
            "chips": [
              "{会場|かいじょう}に",
              "{集|あつ}まっています",
              "{集|あつ}めています",
              "{人|ひと}がたくさん"
            ],
            "answer": [
              "{会場|かいじょう}に",
              "{人|ひと}がたくさん",
              "{集|あつ}まっています"
            ],
            "ro": "Kaijou ni hito ga takusan atsumatte imasu"
          },
          {
            "vi": "Tôi nghĩ chắc chắn đội Nhật sẽ thắng.",
            "chips": [
              "{思|おも}います",
              "もし{勝|か}つと",
              "{日本|にほん}のチームが",
              "きっと{勝|か}つと"
            ],
            "answer": [
              "{日本|にほん}のチームが",
              "きっと{勝|か}つと",
              "{思|おも}います"
            ],
            "ro": "Nihon no chiimu ga kitto katsu to omoimasu"
          },
          {
            "vi": "Mưa tạnh rồi. Ra ngoài thôi.",
            "chips": [
              "やみました。",
              "{雨|あめ}が",
              "{降|ふ}りました。",
              "{出|で}かけましょう"
            ],
            "answer": [
              "{雨|あめ}が",
              "やみました。",
              "{出|で}かけましょう"
            ],
            "ro": "Ame ga yamimashita. Dekakemashou"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b15-chu-han",
    "kind": "kanji",
    "title": "Luyện thêm Bài 15 · Chữ Hán của lớp (天気晴雨曇降台震事故急心) — đọc · nghĩa · chọn chữ · đọc không furigana",
    "goal": "Đọc đúng, hiểu nghĩa 12 chữ Hán Bài 15 (trời, khí, nắng, mưa, mây, rơi, đài, chấn, sự, cố, vội, tâm) và các từ (天気, 晴れ, 雨, 曇り, 降ります, 台風, 地震, 事故, 急ぎます, 心配…), phân biệt chữ na ná (天/夫, 晴/清/青, 雨/両/雪, 曇/雲, 降/院, 台/合, 震/振, 事/車, 故/古, 急/思, 心/必…), đọc câu/đoạn không furigana như đề thi.",
    "minutes": 65,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Học **chữ theo cụm của bài**: 明日の天気 · 晴れたら、海へ行きます · 雨が降って も · 曇りです · 台風で電車が止まりました · 大きい地震がありました · 事故があったそうです · 急いでください · 心配です. Cả bài là **chữ thời tiết và tin tức** — xem thời sự, đọc dự báo thời tiết là gặp ngay.",
          "Chữ **na ná**: **天/夫/大** (天 có nét ngang trên) · **晴/清/青** (晴 = 日 + 青: mặt trời trên trời xanh) · **雨/両/雪** (雨 có 4 chấm mưa; 雪 = 雨 + ヨ) · **曇/雲** (曇 = 日 trên 雲) · **震/振** (震 có 雨 ở trên) · **降/院** (cùng bộ 阝 bên trái) · **台/合/治/始** (台 có ム trên 口; 治, 始 là chữ Bài 11–12 có 台 bên phải) · **事/車** · **故/古** · **急/思/忘** (cùng 心 ở dưới) · **心/必**. Mỗi lần sai, viết chữ đúng 5 lần kèm từ.",
          "Mức Khó không furigana: chỉ dùng chữ đã học đến Bài 15; chữ chưa học viết hiragana như đề thi — nên sẽ gặp cách viết lẫn như じ{震|しん} (じしん, vì 地 chưa học), {台|たい}ふう (たいふう), {心|しん}ぱい (しんぱい). Đọc to cả câu rồi mới bấm xem."
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
            "天",
            "trời",
            "THIÊN — On テン · Kun あめ",
            "天気 · 天気予報 · 天ぷら"
          ],
          [
            "気",
            "khí, hơi; tinh thần",
            "KHÍ — On キ・ケ · Kun ",
            "天気 · 元気 · 空気 · 人気 · 気持ち"
          ],
          [
            "晴",
            "trời nắng, quang đãng",
            "TÌNH — On セイ · Kun は・れます",
            "晴れます · 晴れ · 明日は晴れるでしょう"
          ],
          [
            "雨",
            "mưa",
            "VŨ — On ウ · Kun あめ",
            "雨 · 雨が降ります · 大雨"
          ],
          [
            "曇",
            "trời nhiều mây, âm u",
            "ĐÀM — On ドン · Kun くも・ります",
            "曇り · 曇ります"
          ],
          [
            "降",
            "rơi (mưa, tuyết); xuống (xe)",
            "GIÁNG — On コウ · Kun ふ・ります・お・ります",
            "雨が降ります · 降ります"
          ],
          [
            "台",
            "bệ, đài; (đếm) xe, máy",
            "ĐÀI — On ダイ・タイ · Kun ",
            "台風 · 台所 · 一台"
          ],
          [
            "震",
            "rung, chấn động",
            "CHẤN — On シン · Kun ふる・えます",
            "地震 · 震えます"
          ],
          [
            "事",
            "việc, sự việc",
            "SỰ — On ジ · Kun こと",
            "事故 · 仕事 · 食事 · 用事 · お大事に"
          ],
          [
            "故",
            "sự cố; cũ",
            "CỐ — On コ · Kun ",
            "事故 · 故障"
          ],
          [
            "急",
            "gấp, vội",
            "CẤP — On キュウ · Kun いそ・ぎます",
            "急ぎます · 急に · 急行"
          ],
          [
            "心",
            "tim, lòng",
            "TÂM — On シン · Kun こころ",
            "心配 · 心 · 安心"
          ]
        ],
        "caption": "12 chữ Hán của lớp Bài 15"
      },
      {
        "t": "mcq",
        "id": "lt-b15-kj-nghia",
        "title": "Chữ → nghĩa (12 câu)",
        "items": [
          {
            "q": "Chữ 「天」 mang nghĩa nào?",
            "options": [
              "rung, chấn động",
              "bệ, đài; (đếm) xe, máy",
              "trời",
              "tim, lòng"
            ],
            "correct": 2,
            "why": "**天** = trời (THIÊN — On テン · Kun あめ). Hay gặp: 天気 · 天気予報 · 天ぷら."
          },
          {
            "q": "Chữ 「気」 mang nghĩa nào?",
            "options": [
              "gấp, vội",
              "khí, hơi; tinh thần",
              "rơi (mưa, tuyết); xuống (xe)",
              "trời"
            ],
            "correct": 1,
            "why": "**気** = khí, hơi; tinh thần (KHÍ — On キ・ケ · Kun ). Hay gặp: 天気 · 元気 · 空気 · 人気 · 気持ち."
          },
          {
            "q": "Chữ 「晴」 mang nghĩa nào?",
            "options": [
              "mưa",
              "trời nắng, quang đãng",
              "tim, lòng",
              "khí, hơi; tinh thần"
            ],
            "correct": 1,
            "why": "**晴** = trời nắng, quang đãng (TÌNH — On セイ · Kun は・れます). Hay gặp: 晴れます · 晴れ · 明日は晴れるでしょう."
          },
          {
            "q": "Chữ 「雨」 mang nghĩa nào?",
            "options": [
              "trời nhiều mây, âm u",
              "mưa",
              "khí, hơi; tinh thần",
              "bệ, đài; (đếm) xe, máy"
            ],
            "correct": 1,
            "why": "**雨** = mưa (VŨ — On ウ · Kun あめ). Hay gặp: 雨 · 雨が降ります · 大雨."
          },
          {
            "q": "Chữ 「曇」 mang nghĩa nào?",
            "options": [
              "trời nhiều mây, âm u",
              "khí, hơi; tinh thần",
              "việc, sự việc",
              "sự cố; cũ"
            ],
            "correct": 0,
            "why": "**曇** = trời nhiều mây, âm u (ĐÀM — On ドン · Kun くも・ります). Hay gặp: 曇り · 曇ります."
          },
          {
            "q": "Chữ 「降」 mang nghĩa nào?",
            "options": [
              "rung, chấn động",
              "mưa",
              "rơi (mưa, tuyết); xuống (xe)",
              "việc, sự việc"
            ],
            "correct": 2,
            "why": "**降** = rơi (mưa, tuyết); xuống (xe) (GIÁNG — On コウ · Kun ふ・ります・お・ります). Hay gặp: 雨が降ります · 降ります."
          },
          {
            "q": "Chữ 「台」 mang nghĩa nào?",
            "options": [
              "bệ, đài; (đếm) xe, máy",
              "khí, hơi; tinh thần",
              "tim, lòng",
              "trời nhiều mây, âm u"
            ],
            "correct": 0,
            "why": "**台** = bệ, đài; (đếm) xe, máy (ĐÀI — On ダイ・タイ · Kun ). Hay gặp: 台風 · 台所 · 一台."
          },
          {
            "q": "Chữ 「震」 mang nghĩa nào?",
            "options": [
              "trời",
              "rung, chấn động",
              "rơi (mưa, tuyết); xuống (xe)",
              "bệ, đài; (đếm) xe, máy"
            ],
            "correct": 1,
            "why": "**震** = rung, chấn động (CHẤN — On シン · Kun ふる・えます). Hay gặp: 地震 · 震えます."
          },
          {
            "q": "Chữ 「事」 mang nghĩa nào?",
            "options": [
              "rung, chấn động",
              "việc, sự việc",
              "khí, hơi; tinh thần",
              "rơi (mưa, tuyết); xuống (xe)"
            ],
            "correct": 1,
            "why": "**事** = việc, sự việc (SỰ — On ジ · Kun こと). Hay gặp: 事故 · 仕事 · 食事 · 用事 · お大事に."
          },
          {
            "q": "Chữ 「故」 mang nghĩa nào?",
            "options": [
              "sự cố; cũ",
              "bệ, đài; (đếm) xe, máy",
              "tim, lòng",
              "rung, chấn động"
            ],
            "correct": 0,
            "why": "**故** = sự cố; cũ (CỐ — On コ · Kun ). Hay gặp: 事故 · 故障."
          },
          {
            "q": "Chữ 「急」 mang nghĩa nào?",
            "options": [
              "trời",
              "sự cố; cũ",
              "gấp, vội",
              "tim, lòng"
            ],
            "correct": 2,
            "why": "**急** = gấp, vội (CẤP — On キュウ · Kun いそ・ぎます). Hay gặp: 急ぎます · 急に · 急行."
          },
          {
            "q": "Chữ 「心」 mang nghĩa nào?",
            "options": [
              "tim, lòng",
              "việc, sự việc",
              "trời nắng, quang đãng",
              "rung, chấn động"
            ],
            "correct": 0,
            "why": "**心** = tim, lòng (TÂM — On シン · Kun こころ). Hay gặp: 心配 · 心 · 安心."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-kj-nghia2",
        "title": "Nghĩa → chữ (12 câu)",
        "items": [
          {
            "q": "Chữ nào có nghĩa \"trời\"?",
            "options": [
              "気",
              "急",
              "天",
              "震"
            ],
            "correct": 2,
            "why": "**天** = trời (THIÊN — On テン · Kun あめ). Hay gặp: 天気 · 天気予報 · 天ぷら."
          },
          {
            "q": "Chữ nào có nghĩa \"khí, hơi; tinh thần\"?",
            "options": [
              "故",
              "降",
              "天",
              "気"
            ],
            "correct": 3,
            "why": "**気** = khí, hơi; tinh thần (KHÍ — On キ・ケ · Kun ). Hay gặp: 天気 · 元気 · 空気 · 人気 · 気持ち."
          },
          {
            "q": "Chữ nào có nghĩa \"trời nắng, quang đãng\"?",
            "options": [
              "晴",
              "台",
              "雨",
              "事"
            ],
            "correct": 0,
            "why": "**晴** = trời nắng, quang đãng (TÌNH — On セイ · Kun は・れます). Hay gặp: 晴れます · 晴れ · 明日は晴れるでしょう."
          },
          {
            "q": "Chữ nào có nghĩa \"mưa\"?",
            "options": [
              "急",
              "雨",
              "降",
              "曇"
            ],
            "correct": 1,
            "why": "**雨** = mưa (VŨ — On ウ · Kun あめ). Hay gặp: 雨 · 雨が降ります · 大雨."
          },
          {
            "q": "Chữ nào có nghĩa \"trời nhiều mây, âm u\"?",
            "options": [
              "降",
              "曇",
              "天",
              "台"
            ],
            "correct": 1,
            "why": "**曇** = trời nhiều mây, âm u (ĐÀM — On ドン · Kun くも・ります). Hay gặp: 曇り · 曇ります."
          },
          {
            "q": "Chữ nào có nghĩa \"rơi (mưa, tuyết); xuống (xe)\"?",
            "options": [
              "晴",
              "事",
              "降",
              "台"
            ],
            "correct": 2,
            "why": "**降** = rơi (mưa, tuyết); xuống (xe) (GIÁNG — On コウ · Kun ふ・ります・お・ります). Hay gặp: 雨が降ります · 降ります."
          },
          {
            "q": "Chữ nào có nghĩa \"bệ, đài; (đếm) xe, máy\"?",
            "options": [
              "天",
              "晴",
              "降",
              "台"
            ],
            "correct": 3,
            "why": "**台** = bệ, đài; (đếm) xe, máy (ĐÀI — On ダイ・タイ · Kun ). Hay gặp: 台風 · 台所 · 一台."
          },
          {
            "q": "Chữ nào có nghĩa \"rung, chấn động\"?",
            "options": [
              "雨",
              "急",
              "震",
              "故"
            ],
            "correct": 2,
            "why": "**震** = rung, chấn động (CHẤN — On シン · Kun ふる・えます). Hay gặp: 地震 · 震えます."
          },
          {
            "q": "Chữ nào có nghĩa \"việc, sự việc\"?",
            "options": [
              "天",
              "事",
              "台",
              "降"
            ],
            "correct": 1,
            "why": "**事** = việc, sự việc (SỰ — On ジ · Kun こと). Hay gặp: 事故 · 仕事 · 食事 · 用事 · お大事に."
          },
          {
            "q": "Chữ nào có nghĩa \"sự cố; cũ\"?",
            "options": [
              "降",
              "天",
              "急",
              "故"
            ],
            "correct": 3,
            "why": "**故** = sự cố; cũ (CỐ — On コ · Kun ). Hay gặp: 事故 · 故障."
          },
          {
            "q": "Chữ nào có nghĩa \"gấp, vội\"?",
            "options": [
              "気",
              "雨",
              "震",
              "急"
            ],
            "correct": 3,
            "why": "**急** = gấp, vội (CẤP — On キュウ · Kun いそ・ぎます). Hay gặp: 急ぎます · 急に · 急行."
          },
          {
            "q": "Chữ nào có nghĩa \"tim, lòng\"?",
            "options": [
              "心",
              "曇",
              "晴",
              "震"
            ],
            "correct": 0,
            "why": "**心** = tim, lòng (TÂM — On シン · Kun こころ). Hay gặp: 心配 · 心 · 安心."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-kj-doc",
        "title": "Đọc từ ghép / từ có chữ Hán của bài (20 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　【天気】",
            "options": [
              "てんけ (tenke)",
              "てっき (tekki)",
              "あまき (amaki)",
              "てんき (tenki)"
            ],
            "correct": 3,
            "why": "天気 = てんき (tenki) — thời tiết — On てん + き."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【天ぷら】",
            "options": [
              "でんぷら (denpura)",
              "てぷら (tepura)",
              "あまぷら (amapura)",
              "てんぷら (tenpura)"
            ],
            "correct": 3,
            "why": "天ぷら = てんぷら (tenpura) — món tempura — 天 đọc てん."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【元気】",
            "options": [
              "もとき (motoki)",
              "げんけ (genke)",
              "げんき (genki)",
              "けんき (kenki)"
            ],
            "correct": 2,
            "why": "元気 = げんき (genki) — khoẻ — 気 đọc き."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【人気】",
            "options": [
              "にんけ (ninke)",
              "ひとき (hitoki)",
              "にんき (ninki)",
              "じんき (jinki)"
            ],
            "correct": 2,
            "why": "人気 = にんき (ninki) — được yêu thích — 人 đọc にん, 気 đọc き."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【晴れ】",
            "options": [
              "はれい (harei)",
              "ばれ (bare)",
              "せい (sei)",
              "はれ (hare)"
            ],
            "correct": 3,
            "why": "晴れ = はれ (hare) — trời nắng — Kun は(れ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【雨】",
            "options": [
              "う (u)",
              "あま (ama)",
              "あみ (ami)",
              "あめ (ame)"
            ],
            "correct": 3,
            "why": "雨 = あめ (ame) — mưa — Kun あめ."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【大雨】",
            "options": [
              "たいう (taiu)",
              "おおあま (ooama)",
              "だいう (daiu)",
              "おおあめ (ooame)"
            ],
            "correct": 3,
            "why": "大雨 = おおあめ (ooame) — mưa to — おお + あめ."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【曇り】",
            "options": [
              "ぐもり (gumori)",
              "くもうり (kumouri)",
              "くもり (kumori)",
              "どんり (donri)"
            ],
            "correct": 2,
            "why": "曇り = くもり (kumori) — trời nhiều mây — Kun くも(り)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【（雨が）降ります】",
            "options": [
              "ふります (furimasu)",
              "ぶります (burimasu)",
              "おります (orimasu)",
              "こうります (kourimasu)"
            ],
            "correct": 0,
            "why": "（雨が）降ります = ふります (furimasu) — mưa rơi — Kun ふ(る)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【（電車を）降ります】",
            "options": [
              "おります (orimasu)",
              "くだります (kudarimasu)",
              "こうります (kourimasu)",
              "ふります (furimasu)"
            ],
            "correct": 0,
            "why": "（電車を）降ります = おります (orimasu) — xuống tàu — Kun お(りる)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【台風】",
            "options": [
              "だいふう (daifuu)",
              "たいふう (taifuu)",
              "たいふ (taifu)",
              "だいかぜ (daikaze)"
            ],
            "correct": 1,
            "why": "台風 = たいふう (taifuu) — bão — 台 đọc たい ở từ này."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【台所】",
            "options": [
              "たいどころ (taidokoro)",
              "だいところ (daitokoro)",
              "たいしょ (taisho)",
              "だいどころ (daidokoro)"
            ],
            "correct": 3,
            "why": "台所 = だいどころ (daidokoro) — nhà bếp — 台 đọc だい."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【地震】",
            "options": [
              "ちじん (chijin)",
              "じじん (jijin)",
              "じしん (jishin)",
              "ちしん (chishin)"
            ],
            "correct": 2,
            "why": "地震 = じしん (jishin) — động đất — じ + しん."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【事故】",
            "options": [
              "ことこ (kotoko)",
              "じこ (jiko)",
              "じご (jigo)",
              "しこ (shiko)"
            ],
            "correct": 1,
            "why": "事故 = じこ (jiko) — tai nạn — On じ + こ."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【仕事】",
            "options": [
              "しこと (shikoto)",
              "じごと (jigoto)",
              "しごと (shigoto)",
              "しじ (shiji)"
            ],
            "correct": 2,
            "why": "仕事 = しごと (shigoto) — công việc — 事 đọc ごと (こと đục)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【食事】",
            "options": [
              "たべじ (tabeji)",
              "しょっじ (shojji)",
              "しょくじ (shokuji)",
              "しょくこと (shokukoto)"
            ],
            "correct": 2,
            "why": "食事 = しょくじ (shokuji) — bữa ăn — 事 đọc じ."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【急ぎます】",
            "options": [
              "いしぎます (ishigimasu)",
              "きゅうぎます (kyuugimasu)",
              "いそぎます (isogimasu)",
              "いそいます (isoimasu)"
            ],
            "correct": 2,
            "why": "急ぎます = いそぎます (isogimasu) — vội — Kun いそ(ぐ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【急に】",
            "options": [
              "いそに (isoni)",
              "きゅに (kyuni)",
              "きゅうに (kyuuni)",
              "ぎゅうに (gyuuni)"
            ],
            "correct": 2,
            "why": "急に = きゅうに (kyuuni) — đột nhiên — On きゅう."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【心配】",
            "options": [
              "じんぱい (jinpai)",
              "しんはい (shinhai)",
              "しんぱい (shinpai)",
              "こころぱい (kokoropai)"
            ],
            "correct": 2,
            "why": "心配 = しんぱい (shinpai) — lo lắng — On しん + ぱい."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【心】",
            "options": [
              "しん (shin)",
              "こころ (kokoro)",
              "ここ (koko)",
              "こごろ (kogoro)"
            ],
            "correct": 1,
            "why": "心 = こころ (kokoro) — trái tim, tấm lòng — Kun こころ."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn chữ đúng · điền chữ vào câu · On hay Kun"
      },
      {
        "t": "mcq",
        "id": "lt-b15-kj-chon-chu",
        "title": "Chọn cách viết đúng (12 câu)",
        "items": [
          {
            "q": "Chọn cách viết đúng: てんき (thời tiết)",
            "options": [
              "大気",
              "天気",
              "夫気",
              "天汽"
            ],
            "correct": 1,
            "why": "天 = 一 + 大: nét ngang trên đầu người = trời. 夫 (chồng) có nét dọc nhô lên; 汽 có bộ 氵."
          },
          {
            "q": "Chọn cách viết đúng: はれます (trời nắng)",
            "options": [
              "清れます",
              "晴れます",
              "睛れます",
              "青れます"
            ],
            "correct": 1,
            "why": "晴 = 日 + 青. 清 (trong) có bộ 氵; 睛 có bộ 目."
          },
          {
            "q": "Chọn cách viết đúng: あめ (mưa)",
            "options": [
              "南",
              "両",
              "雪",
              "雨"
            ],
            "correct": 3,
            "why": "雨 có 4 chấm mưa trong khung. 両 (hai), 南 (nam) không có chấm; 雪 (tuyết) = 雨 + ヨ."
          },
          {
            "q": "Chọn cách viết đúng: くもり (trời nhiều mây)",
            "options": [
              "景り",
              "雲り",
              "曇り",
              "量り"
            ],
            "correct": 2,
            "why": "曇 = 日 + 雲 (mặt trời bị mây che). 雲 (mây) thiếu 日 ở trên."
          },
          {
            "q": "Chọn cách viết đúng: ふります (rơi)",
            "options": [
              "院ります",
              "陸ります",
              "降ります",
              "隆ります"
            ],
            "correct": 2,
            "why": "降 = 阝 + bước chân đi xuống. 院 (viện, Bài 12) cùng bộ 阝 nhưng phải là 完."
          },
          {
            "q": "Chọn cách viết đúng: たいふう (bão)",
            "options": [
              "会風",
              "合風",
              "台風",
              "治風"
            ],
            "correct": 2,
            "why": "台 = ム + 口. 合 (hợp) có mái 人; 治 (Bài 12) = 氵 + 台."
          },
          {
            "q": "Chọn cách viết đúng: じしん (động đất)",
            "options": [
              "地雷",
              "地震",
              "地辰",
              "地振"
            ],
            "correct": 1,
            "why": "震 = 雨 + 辰. 振 (vẫy) có bộ 扌; 雷 (sấm) = 雨 + 田."
          },
          {
            "q": "Chọn cách viết đúng: じこ (tai nạn) — chữ đầu",
            "options": [
              "書故",
              "事故",
              "争故",
              "車故"
            ],
            "correct": 1,
            "why": "事 có nét dọc xuyên suốt và móc ở cuối. 車 (xe) có 田 ở giữa; 書 (viết, Bài 6) có 日 ở dưới."
          },
          {
            "q": "Chọn cách viết đúng: じこ (tai nạn) — chữ sau",
            "options": [
              "事古",
              "事枚",
              "事故",
              "事放"
            ],
            "correct": 2,
            "why": "故 = 古 + 攵. 古 (cũ) thiếu 攵; 放 có 方 bên trái."
          },
          {
            "q": "Chọn cách viết đúng: いそぎます (vội)",
            "options": [
              "忘ぎます",
              "思ぎます",
              "意ぎます",
              "急ぎます"
            ],
            "correct": 3,
            "why": "急, 思 (Bài 14), 忘 (Bài 11) đều có 心 ở dưới — nhìn phần trên: 急 = ⺈ + ヨ."
          },
          {
            "q": "Chọn cách viết đúng: しんぱい (lo lắng)",
            "options": [
              "小配",
              "心配",
              "心記",
              "必配"
            ],
            "correct": 1,
            "why": "心 = 3 chấm + nét cong. 必 (tất) có thêm nét chéo; 小 (Bài 7) không có nét cong."
          },
          {
            "q": "Chọn cách viết đúng: しょくじ (bữa ăn)",
            "options": [
              "飲事",
              "食事",
              "食争",
              "食車"
            ],
            "correct": 1,
            "why": "食事 = 食 (ăn) + 事 (việc). 飲 (uống) cùng bộ 食."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-kj-dien-chu",
        "title": "Điền chữ Hán vào chỗ trống (12 câu)",
        "items": [
          {
            "q": "{明日|あした}の＿＿{気|き}はどうですか。　〔Ashita no __ki wa dou desu ka.〕　— Thời tiết (てんき) ngày mai thế nào?",
            "options": [
              "未",
              "天",
              "夫",
              "大"
            ],
            "correct": 1,
            "why": "てん(き) = 天. → **{明日|あした}の{天|てん}{気|き}はどうですか。** 〔Ashita no tenki wa dou desu ka.〕 — Thời tiết (てんき) ngày mai thế nào?"
          },
          {
            "q": "{天|てん}＿＿がいいですから、{散歩|さんぽ}しましょう。　〔Ten__ ga ii desu kara, sanpo shimashou.〕　— Thời tiết (てんき) đẹp nên đi dạo thôi.",
            "options": [
              "丸",
              "気",
              "汽",
              "氏"
            ],
            "correct": 1,
            "why": "(てん)き = 気. → **{天|てん}{気|き}がいいですから、{散歩|さんぽ}しましょう。** 〔Tenki ga ii desu kara, sanpo shimashou.〕 — Thời tiết (てんき) đẹp nên đi dạo thôi."
          },
          {
            "q": "{明日|あした}＿＿れたら、{海|うみ}へ{行|い}きます。　〔Ashita __retara, umi e ikimasu.〕　— Nếu mai trời nắng (はれたら) thì tôi đi biển.",
            "options": [
              "清",
              "睛",
              "青",
              "晴"
            ],
            "correct": 3,
            "why": "は(れたら) = 晴. → **{明日|あした}{晴|は}れたら、{海|うみ}へ{行|い}きます。** 〔Ashita haretara, umi e ikimasu.〕 — Nếu mai trời nắng (はれたら) thì tôi đi biển."
          },
          {
            "q": "＿＿が{降|ふ}っています。　〔__ ga futte imasu.〕　— Trời đang mưa (あめ).",
            "options": [
              "雪",
              "雨",
              "両",
              "南"
            ],
            "correct": 1,
            "why": "あめ = 雨. → **{雨|あめ}が{降|ふ}っています。** 〔Ame ga futte imasu.〕 — Trời đang mưa (あめ)."
          },
          {
            "q": "{今日|きょう}は＿＿りです。　〔Kyou wa __ri desu.〕　— Hôm nay trời nhiều mây (くもり).",
            "options": [
              "景",
              "曇",
              "量",
              "雲"
            ],
            "correct": 1,
            "why": "くも(り) = 曇. → **{今日|きょう}は{曇|くも}りです。** 〔Kyou wa kumori desu.〕 — Hôm nay trời nhiều mây (くもり)."
          },
          {
            "q": "{雨|あめ}が＿＿っても、{試合|しあい}はあります。　〔Ame ga __tte mo, shiai wa arimasu.〕　— Dù mưa rơi (ふっても) trận đấu vẫn diễn ra.",
            "options": [
              "隆",
              "院",
              "降",
              "陸"
            ],
            "correct": 2,
            "why": "ふ(っても) = 降. → **{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。** 〔Ame ga futte mo, shiai wa arimasu.〕 — Dù mưa rơi (ふっても) trận đấu vẫn diễn ra."
          },
          {
            "q": "＿＿{風|ふう}で{電車|でんしゃ}が{止|と}まりました。　〔__fuu de densha ga tomarimashita.〕　— Vì bão (たいふう) mà tàu điện dừng.",
            "options": [
              "台",
              "治",
              "始",
              "合"
            ],
            "correct": 0,
            "why": "たい(ふう) = 台. → **{台|たい}{風|ふう}で{電車|でんしゃ}が{止|と}まりました。** 〔Taifuu de densha ga tomarimashita.〕 — Vì bão (たいふう) mà tàu điện dừng."
          },
          {
            "q": "{地|じ}＿＿がありました。{怖|こわ}かったです。　〔Ji__ ga arimashita. Kowakatta desu.〕　— Có động đất (じしん). Sợ quá.",
            "options": [
              "振",
              "震",
              "雷",
              "辰"
            ],
            "correct": 1,
            "why": "(じ)しん = 震. → **{地|じ}{震|しん}がありました。{怖|こわ}かったです。** 〔Jishin ga arimashita. Kowakatta desu.〕 — Có động đất (じしん). Sợ quá."
          },
          {
            "q": "＿＿{故|こ}でバスが{遅|おく}れています。　〔__ko de basu ga okurete imasu.〕　— Vì tai nạn (じこ) mà xe buýt đang chậm.",
            "options": [
              "事",
              "書",
              "車",
              "争"
            ],
            "correct": 0,
            "why": "じ(こ) = 事. → **{事|じ}{故|こ}でバスが{遅|おく}れています。** 〔Jiko de basu ga okurete imasu.〕 — Vì tai nạn (じこ) mà xe buýt đang chậm."
          },
          {
            "q": "{事|じ}＿＿があったそうです。　〔Ji__ ga atta sou desu.〕　— Nghe nói đã có tai nạn (じこ).",
            "options": [
              "古",
              "枚",
              "放",
              "故"
            ],
            "correct": 3,
            "why": "(じ)こ = 故. → **{事|じ}{故|こ}があったそうです。** 〔Jiko ga atta sou desu.〕 — Nghe nói đã có tai nạn (じこ)."
          },
          {
            "q": "{時間|じかん}がありません。＿＿いでください。　〔Jikan ga arimasen. __ide kudasai.〕　— Không có thời gian. Nhanh (いそいで) lên.",
            "options": [
              "意",
              "急",
              "思",
              "忘"
            ],
            "correct": 1,
            "why": "いそ(いで) = 急. → **{時間|じかん}がありません。{急|いそ}いでください。** 〔Jikan ga arimasen. Isoide kudasai.〕 — Không có thời gian. Nhanh (いそいで) lên."
          },
          {
            "q": "{母|はは}が{入院|にゅういん}して、＿＿{配|ぱい}です。　〔Haha ga nyuuin shite, __pai desu.〕　— Mẹ tôi nhập viện, tôi lo lắng (しんぱい).",
            "options": [
              "必",
              "小",
              "少",
              "心"
            ],
            "correct": 3,
            "why": "しん(ぱい) = 心. → **{母|はは}が{入院|にゅういん}して、{心|しん}{配|ぱい}です。** 〔Haha ga nyuuin shite, shinpai desu.〕 — Mẹ tôi nhập viện, tôi lo lắng (しんぱい)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-kj-on-kun",
        "title": "Cùng một chữ, đọc khác nhau tuỳ từ (13 câu)",
        "items": [
          {
            "q": "Chữ 「天」 trong 「天気」 đọc là gì?",
            "options": [
              "てん",
              "あめ",
              "でん",
              "あま"
            ],
            "correct": 0,
            "why": "On てん: てんき."
          },
          {
            "q": "Chữ 「気」 trong 「人気」 đọc là gì?",
            "options": [
              "げ",
              "け",
              "き",
              "ぎ"
            ],
            "correct": 2,
            "why": "On き: にんき."
          },
          {
            "q": "Chữ 「晴」 trong 「晴れます」 đọc là gì?",
            "options": [
              "せい",
              "はれ",
              "ば",
              "は"
            ],
            "correct": 3,
            "why": "Kun は(れる) — chỉ は, phần れます là kana."
          },
          {
            "q": "Chữ 「雨」 trong 「大雨」 đọc là gì?",
            "options": [
              "さめ",
              "あめ",
              "う",
              "あま"
            ],
            "correct": 1,
            "why": "Kun あめ: おおあめ."
          },
          {
            "q": "Chữ 「降」 trong 「雨が降ります」 đọc là gì?",
            "options": [
              "ふ",
              "こう",
              "くだ",
              "お"
            ],
            "correct": 0,
            "why": "Mưa rơi → Kun ふ(る)."
          },
          {
            "q": "Chữ 「降」 trong 「電車を降ります」 đọc là gì?",
            "options": [
              "くだ",
              "こう",
              "お",
              "ふ"
            ],
            "correct": 2,
            "why": "Xuống tàu → Kun お(りる)."
          },
          {
            "q": "Chữ 「台」 trong 「台風」 đọc là gì?",
            "options": [
              "たえ",
              "だい",
              "たい",
              "うてな"
            ],
            "correct": 2,
            "why": "Ở 台風 đọc たい."
          },
          {
            "q": "Chữ 「台」 trong 「台所」 đọc là gì?",
            "options": [
              "だい",
              "たい",
              "だ",
              "ところ"
            ],
            "correct": 0,
            "why": "Ở 台所 đọc だい: だいどころ."
          },
          {
            "q": "Chữ 「事」 trong 「事故」 đọc là gì?",
            "options": [
              "こと",
              "し",
              "ごと",
              "じ"
            ],
            "correct": 3,
            "why": "On じ: じこ."
          },
          {
            "q": "Chữ 「事」 trong 「仕事」 đọc là gì?",
            "options": [
              "ごと",
              "じ",
              "しご",
              "こと"
            ],
            "correct": 0,
            "why": "Kun こと → đục thành ごと: しごと."
          },
          {
            "q": "Chữ 「急」 trong 「急ぎます」 đọc là gì?",
            "options": [
              "いそ",
              "きゅう",
              "いそぎ",
              "きゅ"
            ],
            "correct": 0,
            "why": "Kun いそ(ぐ)."
          },
          {
            "q": "Chữ 「急」 trong 「急に」 đọc là gì?",
            "options": [
              "ぎゅう",
              "きゅ",
              "きゅう",
              "いそ"
            ],
            "correct": 2,
            "why": "On きゅう: きゅうに (đột nhiên)."
          },
          {
            "q": "Chữ 「心」 trong 「心配」 đọc là gì?",
            "options": [
              "しん",
              "じん",
              "こころ",
              "ここ"
            ],
            "correct": 0,
            "why": "On しん: しんぱい."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · không furigana — như đề thi"
      },
      {
        "t": "mcq",
        "id": "lt-b15-kj-doc-cau",
        "title": "Đọc đúng phần trong 【 】 (12 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　明日の【天気】はどうですか。",
            "options": [
              "あまき (amaki)",
              "てんけ (tenke)",
              "でんき (denki)",
              "てんき (tenki)"
            ],
            "correct": 3,
            "why": "天気 = てんき. Cả câu: 明日の【天気】はどうですか。 〔Ashita no [tenki] wa dou desu ka.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　明日は【晴れる】と思います。",
            "options": [
              "あれる (areru)",
              "せいる (seiru)",
              "はれる (hareru)",
              "ばれる (bareru)"
            ],
            "correct": 2,
            "why": "晴れる = はれる. Cả câu: 明日は【晴れる】と思います。 〔Ashita wa [hareru] to omoimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　雨が【降って】も、行きます。",
            "options": [
              "こうって (koutte)",
              "ふって (futte)",
              "ぶって (butte)",
              "おりて (orite)"
            ],
            "correct": 1,
            "why": "降って = ふって. Cả câu: 雨が【降って】も、行きます。 〔Ame ga [futte] mo, ikimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　次の駅で【降ります】。",
            "options": [
              "こうります (kourimasu)",
              "おります (orimasu)",
              "くだります (kudarimasu)",
              "ふります (furimasu)"
            ],
            "correct": 1,
            "why": "降ります = おります. Cả câu: 次の駅で【降ります】。 〔Tsugi no eki de [orimasu].〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　今日は一日【曇り】です。",
            "options": [
              "くもうり (kumouri)",
              "くもり (kumori)",
              "どんり (donri)",
              "ぐもり (gumori)"
            ],
            "correct": 1,
            "why": "曇り = くもり. Cả câu: 今日は一日【曇り】です。 〔Kyou wa ichinichi [kumori] desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【台風】で電車が止まっています。",
            "options": [
              "たいふう (taifuu)",
              "たいふ (taifu)",
              "だいかぜ (daikaze)",
              "だいふう (daifuu)"
            ],
            "correct": 0,
            "why": "台風 = たいふう. Cả câu: 【台風】で電車が止まっています。 〔[taifuu] de densha ga tomatte imasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　昨日、大きい【地震】がありました。",
            "options": [
              "じじん (jijin)",
              "じしん (jishin)",
              "ちじん (chijin)",
              "ちしん (chishin)"
            ],
            "correct": 1,
            "why": "地震 = じしん. Cả câu: 昨日、大きい【地震】がありました。 〔Kinou, ookii [jishin] ga arimashita.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　駅の前で【事故】があったそうです。",
            "options": [
              "しこ (shiko)",
              "じご (jigo)",
              "ことこ (kotoko)",
              "じこ (jiko)"
            ],
            "correct": 3,
            "why": "事故 = じこ. Cả câu: 駅の前で【事故】があったそうです。 〔Eki no mae de [jiko] ga atta sou desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　時間がありませんから、【急いで】ください。",
            "options": [
              "いそいで (isoide)",
              "きゅういで (kyuuide)",
              "いしいで (ishiide)",
              "いそうで (isoude)"
            ],
            "correct": 0,
            "why": "急いで = いそいで. Cả câu: 時間がありませんから、【急いで】ください。 〔Jikan ga arimasen kara, [isoide] kudasai.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【急に】雨が降ってきました。",
            "options": [
              "きゅに (kyuni)",
              "きゅうに (kyuuni)",
              "ぎゅうに (gyuuni)",
              "いそに (isoni)"
            ],
            "correct": 1,
            "why": "急に = きゅうに. Cả câu: 【急に】雨が降ってきました。 〔[kyuuni] ame ga futte kimashita.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　母がとても【心配】しています。",
            "options": [
              "しんはい (shinhai)",
              "じんぱい (jinpai)",
              "こころぱい (kokoropai)",
              "しんぱい (shinpai)"
            ],
            "correct": 3,
            "why": "心配 = しんぱい. Cả câu: 母がとても【心配】しています。 〔Haha ga totemo [shinpai] shite imasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　父は毎日【仕事】が忙しいです。",
            "options": [
              "しこと (shikoto)",
              "しごと (shigoto)",
              "しじ (shiji)",
              "じごと (jigoto)"
            ],
            "correct": 1,
            "why": "仕事 = しごと. Cả câu: 父は毎日【仕事】が忙しいです。 〔Chichi wa mainichi [shigoto] ga isogashii desu.〕"
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b15-kj-doc-cau-rk",
        "title": "Đọc to câu KHÔNG furigana, rồi bấm xem đáp án (21 câu)",
        "note": "Đọc to cả câu. Chỉ dùng chữ Hán đã học đến Bài 15; các từ khác viết hiragana như đề thi (vd: じしん có chữ 震 nhưng 地 chưa học → viết じ{震|しん}; たいふう → {台|たい}ふう).",
        "items": [
          {
            "text": "あしたの{天気|てんき}はどうですか。",
            "ro": "Ashita no tenki wa dou desu ka.",
            "vi": "Thời tiết ngày mai thế nào?"
          },
          {
            "text": "{午前|ごぜん}は{晴|は}れますが、{午後|ごご}は{雨|あめ}が{降|ふ}るそうです。",
            "ro": "Gozen wa haremasu ga, gogo wa ame ga furu sou desu.",
            "vi": "Nghe nói buổi sáng nắng nhưng buổi chiều có mưa."
          },
          {
            "text": "{今日|きょう}は{一日|いちにち}{曇|くも}りです。",
            "ro": "Kyou wa ichinichi kumori desu.",
            "vi": "Hôm nay trời nhiều mây cả ngày."
          },
          {
            "text": "{雨|あめ}が{降|ふ}ったら、しあいはちゅうしです。",
            "ro": "Ame ga futtara, shiai wa chuushi desu.",
            "vi": "Nếu trời mưa thì trận đấu bị huỷ."
          },
          {
            "text": "{雨|あめ}が{降|ふ}っても、{行|い}きたいです。",
            "ro": "Ame ga futte mo, ikitai desu.",
            "vi": "Dù mưa tôi vẫn muốn đi."
          },
          {
            "text": "{台|たい}ふうででんしゃがとまっています。",
            "ro": "Taifuu de densha ga tomatte imasu.",
            "vi": "Vì bão nên tàu điện đang dừng."
          },
          {
            "text": "きのうのよる、{大|おお}きいじ{震|しん}がありました。",
            "ro": "Kinou no yoru, ookii jishin ga arimashita.",
            "vi": "Tối qua có một trận động đất lớn."
          },
          {
            "text": "えきの{近|ちか}くで{事故|じこ}があったそうです。",
            "ro": "Eki no chikaku de jiko ga atta sou desu.",
            "vi": "Nghe nói gần ga đã xảy ra tai nạn."
          },
          {
            "text": "{時間|じかん}がありませんから、{急|いそ}いでください。",
            "ro": "Jikan ga arimasen kara, isoide kudasai.",
            "vi": "Không có thời gian đâu, nhanh lên."
          },
          {
            "text": "{急|きゅう}に{雨|あめ}が{降|ふ}ってきました。",
            "ro": "Kyuuni ame ga futte kimashita.",
            "vi": "Đột nhiên trời đổ mưa."
          },
          {
            "text": "{母|はは}が{心|しん}ぱいしています。",
            "ro": "Haha ga shinpai shite imasu.",
            "vi": "Mẹ tôi đang lo lắng."
          },
          {
            "text": "つぎのえきで{降|お}ります。",
            "ro": "Tsugi no eki de orimasu.",
            "vi": "Tôi xuống ở ga tiếp theo."
          },
          {
            "text": "{天気|てんき}がいいですから、{空気|くうき}がきもちいいです。",
            "ro": "Tenki ga ii desu kara, kuuki ga kimochi ii desu.",
            "vi": "Vì trời đẹp nên không khí dễ chịu."
          },
          {
            "text": "{会場|かいじょう}に{人|ひと}がたくさん{集|あつ}まっています。",
            "ro": "Kaijou ni hito ga takusan atsumatte imasu.",
            "vi": "Ở hội trường có rất nhiều người đang tụ tập."
          },
          {
            "text": "{大会|たいかい}は{午後|ごご}{二時|にじ}に{始|はじ}まるそうです。",
            "ro": "Taikai wa gogo niji ni hajimaru sou desu.",
            "vi": "Nghe nói đại hội bắt đầu lúc 2 giờ chiều."
          },
          {
            "text": "{父|ちち}は{食事|しょくじ}の{後|あと}で、いつもしん{聞|ぶん}を{読|よ}みます。",
            "ro": "Chichi wa shokuji no ato de, itsumo shinbun o yomimasu.",
            "vi": "Bố tôi lúc nào ăn xong cũng đọc báo."
          },
          {
            "text": "{大雨|おおあめ}で{学校|がっこう}が{休|やす}みになりました。",
            "ro": "Ooame de gakkou ga yasumi ni narimashita.",
            "vi": "Vì mưa to nên trường được nghỉ."
          },
          {
            "text": "あしたはたぶん{晴|は}れると{思|おも}います。",
            "ro": "Ashita wa tabun hareru to omoimasu.",
            "vi": "Tôi nghĩ ngày mai có lẽ trời nắng."
          },
          {
            "text": "{事故|じこ}でにゅう{院|いん}した{人|ひと}がいるそうです。{心|しん}ぱいですね。",
            "ro": "Jiko de nyuuin shita hito ga iru sou desu. Shinpai desu ne.",
            "vi": "Nghe nói có người phải nhập viện vì tai nạn. Lo nhỉ."
          },
          {
            "text": "{急|いそ}いだら{間|ま}にあうと{思|おも}います。",
            "ro": "Isoidara mani au to omoimasu.",
            "vi": "Tôi nghĩ nếu nhanh lên thì sẽ kịp."
          },
          {
            "text": "{雨|あめ}がやんだら、{天気|てんき}がよくなると{思|おも}います。",
            "ro": "Ame ga yandara, tenki ga yoku naru to omoimasu.",
            "vi": "Tôi nghĩ mưa tạnh thì trời sẽ đẹp lên."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b15-kj-doc-doan",
        "title": "Đọc to ĐOẠN văn ngắn không furigana (3 đoạn)",
        "items": [
          {
            "text": "あしたの{天気|てんき}です。{午前|ごぜん}は{晴|は}れですが、{午後|ごご}は{曇|くも}りで、ゆうがたから{雨|あめ}が{降|ふ}るそうです。{雨|あめ}が{降|ふ}ったら、はなび{大会|たいかい}はちゅうしです。でも、{雨|あめ}が{降|ふ}っても、{会場|かいじょう}の{近|ちか}くのみせはあいていると{思|おも}います。",
            "ro": "Ashita no tenki desu. Gozen wa hare desu ga, gogo wa kumori de, yuugata kara ame ga furu sou desu. Ame ga futtara, hanabi taikai wa chuushi desu. Demo, ame ga futte mo, kaijou no chikaku no mise wa aite iru to omoimasu.",
            "vi": "Thời tiết ngày mai. Nghe nói buổi sáng nắng, buổi chiều nhiều mây, từ chiều tối có mưa. Nếu mưa thì lễ hội pháo hoa bị huỷ. Nhưng tôi nghĩ dù mưa thì các cửa hàng gần địa điểm vẫn mở."
          },
          {
            "text": "きのうのよる、{大|おお}きいじ{震|しん}がありました。ニュースで{見|み}ましたが、じ{震|しん}でふるいビルがたおれたそうです。{事故|じこ}もあって、でんしゃがとまっています。{国|くに}のかぞくが{心|しん}ぱいして、でん{話|わ}をくれました。",
            "ro": "Kinou no yoru, ookii jishin ga arimashita. Nyuusu de mimashita ga, jishin de furui biru ga taoreta sou desu. Jiko mo atte, densha ga tomatte imasu. Kuni no kazoku ga shinpai shite, denwa o kuremashita.",
            "vi": "Tối qua có một trận động đất lớn. Tôi xem trên thời sự, nghe nói vì động đất mà một toà nhà cũ bị đổ. Còn có cả tai nạn nên tàu điện đang dừng. Gia đình ở quê lo lắng nên đã gọi điện cho tôi."
          },
          {
            "text": "{時間|じかん}がありません。{急|いそ}がないと、スピーチコンテストに{間|ま}にあいません。{会場|かいじょう}にはもう{人|ひと}がたくさん{集|あつ}まっていると{思|おも}います。{心|しん}ぱいですが、さいごまで{話|はな}したいです。",
            "ro": "Jikan ga arimasen. Isoganai to, supiichi kontesuto ni mani aimasen. Kaijou ni wa mou hito ga takusan atsumatte iru to omoimasu. Shinpai desu ga, saigo made hanashitai desu.",
            "vi": "Không có thời gian. Không nhanh lên thì không kịp cuộc thi hùng biện. Tôi nghĩ ở hội trường đã có rất nhiều người tụ tập. Tôi lo nhưng muốn nói được đến cuối."
          }
        ]
      },
      {
        "t": "write",
        "id": "lt-b15-kj-viet",
        "title": "Tập viết chữ Hán của lớp Bài 15 (12 chữ + 6 từ)",
        "chars": [
          "天",
          "気",
          "晴",
          "雨",
          "曇",
          "降",
          "台",
          "震",
          "事",
          "故",
          "急",
          "心",
          "天気",
          "大雨",
          "晴れ",
          "曇り",
          "事故",
          "食事"
        ],
        "goi": {
          "天気": "てんき · thời tiết",
          "大雨": "おおあめ · mưa to",
          "晴れ": "はれ · trời nắng",
          "曇り": "くもり · trời nhiều mây",
          "事故": "じこ · tai nạn",
          "食事": "しょくじ · bữa ăn"
        }
      }
    ]
  },
  {
    "id": "lt-b15-the-tara",
    "kind": "homework",
    "title": "Luyện thêm Bài 15 · Thể たら · Thể ても · 普通形＋そうです — chia → ráp → gõ hàng loạt → bẫy (~199 câu)",
    "goal": "Chia đúng thể たら (nếu … thì) và thể ても (dù … cũng) của mọi động từ, tính từ, danh từ đã học, ráp đúng thể thường + そうです (nghe nói) — ba \"phần chia mới\" của Bài 15 (表 p.281) — không còn nhầm ~~行きたら~~, ~~高いだったら~~, ~~いかったら~~, ~~静かくても~~, ~~来ますそうです~~, ~~雨そうです~~.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Thể たら = thể た + ら** (Bài 13 đã học thể た): 行った → 行った**ら** · 食べた → 食べた**ら** · した → した**ら** · 来た → 来た**ら** (きたら). Tính từ: 高い → 高**かったら** · **いい → よかったら** · 暇 → 暇**だったら** · 雨 → 雨**だったら**. Phủ định: 行かない → 行か**なかったら**.",
          "**Thể ても = thể て + も**: 行って → 行って**も** · 降って → 降って**も**. Tính từ: 高い → 高**くても** · **いい → よくても** · 暇 → 暇**でも** · 雨 → 雨**でも**. Nhớ: ～**なくても** いいです của Bài 14 chính là thể ても của thể ない.",
          "**普通形 + そうです** (nghe nói): V／イA thể thường + そうです (降る**そうです** · 寒い**そうです**); ナA／N + **だ**そうです (暇**だ**そうです · 雨**だ**そうです). Sai câu nào: đọc to cả dòng (降ります → 降った → 降ったら → 降って も → 降るそうです) 3 lần, làm lại khối đó sau 10 phút."
        ]
      },
      {
        "t": "table",
        "head": [
          "Loại",
          "Gốc",
          "Thể たら (nếu)",
          "Thể ても (dù)",
          "Thể thường + そうです"
        ],
        "rows": [
          [
            "V nhóm 1",
            "降ります · 待ちます · 飲みます · 書きます · 急ぎます · 話します",
            "降ったら · 待ったら · 飲んだら · 書いたら · 急いだら · 話したら",
            "降って も · 待って も · 飲んで も · 書いて も · 急いで も · 話しても",
            "降るそうです · 降ったそうです"
          ],
          [
            "V nhóm 1 (ngoại lệ)",
            "行きます",
            "行ったら",
            "行っても",
            "行くそうです"
          ],
          [
            "V nhóm 2",
            "晴れます · 負けます · 食べます",
            "晴れたら · 負けたら · 食べたら",
            "晴れて も · 負けて も · 食べても",
            "晴れるそうです"
          ],
          [
            "V nhóm 3",
            "します · 来ます",
            "したら · 来たら (きたら)",
            "して も · 来ても (きても)",
            "するそうです · 来るそうです"
          ],
          [
            "V phủ định",
            "行かない · 来ない",
            "行かなかったら · 来なかったら",
            "行かなくて も · 来なくても",
            "行かないそうです"
          ],
          [
            "イA",
            "高い · 寒い",
            "高かったら · 寒かったら",
            "高くて も · 寒くても",
            "高いそうです"
          ],
          [
            "いい (ngoại lệ)",
            "いい",
            "よかったら",
            "よくても",
            "いいそうです"
          ],
          [
            "ナA",
            "暇 · 静か",
            "暇だったら · 静かだったら",
            "暇でも · 静かでも",
            "暇だそうです"
          ],
          [
            "N",
            "雨 · 無料",
            "雨だったら · 無料だったら",
            "雨でも · 無料でも",
            "雨だそうです"
          ]
        ],
        "caption": "Ba phần chia mới của Bài 15 (表 p.281 + ポイント 119)"
      },
      {
        "t": "recap",
        "title": "6 bẫy phải thuộc",
        "items": [
          "**たら dựa trên thể た**, không dựa trên thể ます: ~~行きたら~~ → **行ったら** · ~~書きたら~~ → **書いたら** · ~~急ぎたら~~ → **急いだら**.",
          "**来ます → 来たら (きたら), 来ても (きても)** — chỉ thể ない mới đọc こ: 来なかったら (こなかったら).",
          "**イA bỏ い**: 高い → 高**かったら** / 高**くても** (~~高いだったら~~, ~~高いでも~~). **いい → よかったら / よくても** (~~いかったら~~).",
          "**ナA／N dùng だったら / でも**: 暇だったら · 雨でも (~~暇かったら~~, ~~静かくても~~).",
          "**ても dùng thể て**: 降って**も** (~~降ったも~~, ~~降るても~~).",
          "**そうです đứng sau thể thường**: ~~来ますそうです~~ → **来るそうです**; ナA／N phải có **だ**: ~~雨そうです~~ → **雨だそうです**; và **không** chia そうでした."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · chia thể たら từng nhóm · tính từ / danh từ"
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-tara1",
        "title": "Chia thể たら — NHÓM 1 (20 câu)",
        "items": [
          {
            "q": "Thể たら của {亡|な}くなります 〔nakunarimasu〕 (qua đời) là gì?",
            "options": [
              "{亡|な}くなりたら",
              "{亡|な}くなんだら",
              "{亡|な}くなったら",
              "{亡|な}くなしたら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {亡|な}くなります → {亡|な}くなった → **{亡|な}くなったら** 〔nakunattara〕."
          },
          {
            "q": "Thể たら của {勝|か}ちます 〔kachimasu〕 (thắng) là gì?",
            "options": [
              "{勝|か}ちたら",
              "{勝|か}ったら",
              "{勝|か}したら",
              "{勝|か}いだら"
            ],
            "correct": 1,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {勝|か}ちます → {勝|か}った → **{勝|か}ったら** 〔kattara〕."
          },
          {
            "q": "Thể たら của {行|い}きます 〔ikimasu〕 (đi (ngoại lệ: 行って)) là gì?",
            "options": [
              "{行|い}したら",
              "{行|い}いだら",
              "{行|い}ったら",
              "{行|い}んだら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {行|い}きます → {行|い}った → **{行|い}ったら** 〔ittara〕."
          },
          {
            "q": "Thể たら của {話|はな}します 〔hanashimasu〕 (nói chuyện) là gì?",
            "options": [
              "{話|はな}んだら",
              "{話|はな}ったら",
              "{話|はな}したら",
              "{話|はな}いだら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {話|はな}します → {話|はな}した → **{話|はな}したら** 〔hanashitara〕."
          },
          {
            "q": "Thể たら của {書|か}きます 〔kakimasu〕 (viết) là gì?",
            "options": [
              "{書|か}ったら",
              "{書|か}んだら",
              "{書|か}いだら",
              "{書|か}いたら"
            ],
            "correct": 3,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {書|か}きます → {書|か}いた → **{書|か}いたら** 〔kaitara〕."
          },
          {
            "q": "Thể たら của {待|ま}ちます 〔machimasu〕 (chờ) là gì?",
            "options": [
              "{待|ま}したら",
              "{待|ま}んだら",
              "{待|ま}ったら",
              "{待|ま}ちたら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {待|ま}ちます → {待|ま}った → **{待|ま}ったら** 〔mattara〕."
          },
          {
            "q": "Thể たら của {飲|の}みます 〔nomimasu〕 (uống) là gì?",
            "options": [
              "{飲|の}んだら",
              "{飲|の}したら",
              "{飲|の}いたら",
              "{飲|の}ったら"
            ],
            "correct": 0,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {飲|の}みます → {飲|の}んだ → **{飲|の}んだら** 〔nondara〕."
          },
          {
            "q": "Thể たら của {泳|およ}ぎます 〔oyogimasu〕 (bơi) là gì?",
            "options": [
              "{泳|およ}ったら",
              "{泳|およ}したら",
              "{泳|およ}いだら",
              "{泳|およ}ぐたら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {泳|およ}ぎます → {泳|およ}いだ → **{泳|およ}いだら** 〔oyoidara〕."
          },
          {
            "q": "Thể たら của {遊|あそ}びます 〔asobimasu〕 (chơi) là gì?",
            "options": [
              "{遊|あそ}びたら",
              "{遊|あそ}んだら",
              "{遊|あそ}したら",
              "{遊|あそ}いたら"
            ],
            "correct": 1,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {遊|あそ}びます → {遊|あそ}んだ → **{遊|あそ}んだら** 〔asondara〕."
          },
          {
            "q": "Thể たら của {混|こ}みます 〔komimasu〕 (đông) là gì?",
            "options": [
              "{混|こ}みたら",
              "{混|こ}いたら",
              "{混|こ}んだら",
              "{混|こ}ったら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {混|こ}みます → {混|こ}んだ → **{混|こ}んだら** 〔kondara〕."
          },
          {
            "q": "Thể たら của うなずきます 〔unazukimasu〕 (gật đầu) là gì?",
            "options": [
              "うなずいたら",
              "うなずくたら",
              "うなずんだら",
              "うなずしたら"
            ],
            "correct": 0,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: うなずきます → うなずいた → **うなずいたら** 〔unazuitara〕."
          },
          {
            "q": "Thể たら của {買|か}います 〔kaimasu〕 (mua) là gì?",
            "options": [
              "{買|か}したら",
              "{買|か}ったら",
              "{買|か}いたら",
              "{買|か}うたら"
            ],
            "correct": 1,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {買|か}います → {買|か}った → **{買|か}ったら** 〔kattara〕."
          },
          {
            "q": "Thể たら của {閉|し}まります 〔shimarimasu〕 ((cửa) đóng) là gì?",
            "options": [
              "{閉|し}まいだら",
              "{閉|し}ましたら",
              "{閉|し}まったら",
              "{閉|し}まりたら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {閉|し}まります → {閉|し}まった → **{閉|し}まったら** 〔shimattara〕."
          },
          {
            "q": "Thể たら của {帰|かえ}ります 〔kaerimasu〕 (về) là gì?",
            "options": [
              "{帰|かえ}したら",
              "{帰|かえ}ったら",
              "{帰|かえ}いだら",
              "{帰|かえ}んだら"
            ],
            "correct": 1,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {帰|かえ}ります → {帰|かえ}った → **{帰|かえ}ったら** 〔kaettara〕."
          },
          {
            "q": "Thể たら của {止|と}まります 〔tomarimasu〕 ((tàu) dừng) là gì?",
            "options": [
              "{止|と}ましたら",
              "{止|と}まるたら",
              "{止|と}まったら",
              "{止|と}まんだら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {止|と}まります → {止|と}まった → **{止|と}まったら** 〔tomattara〕."
          },
          {
            "q": "Thể たら của {消|け}します 〔keshimasu〕 (tắt (đèn)) là gì?",
            "options": [
              "{消|け}んだら",
              "{消|け}いたら",
              "{消|け}すたら",
              "{消|け}したら"
            ],
            "correct": 3,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {消|け}します → {消|け}した → **{消|け}したら** 〔keshitara〕."
          },
          {
            "q": "Thể たら của {間|ま}に{合|あ}います 〔maniaimasu〕 (kịp) là gì?",
            "options": [
              "{間|ま}に{合|あ}したら",
              "{間|ま}に{合|あ}ったら",
              "{間|ま}に{合|あ}うたら",
              "{間|ま}に{合|あ}んだら"
            ],
            "correct": 1,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {間|ま}に{合|あ}います → {間|ま}に{合|あ}った → **{間|ま}に{合|あ}ったら** 〔maniattara〕."
          },
          {
            "q": "Thể たら của すきます 〔sukimasu〕 (vắng) là gì?",
            "options": [
              "すんだら",
              "すしたら",
              "すいたら",
              "すいだら"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: すきます → すいた → **すいたら** 〔suitara〕."
          },
          {
            "q": "Thể たら của {始|はじ}まります 〔hajimarimasu〕 ((việc) bắt đầu) là gì?",
            "options": [
              "{始|はじ}まったら",
              "{始|はじ}ましたら",
              "{始|はじ}まいたら",
              "{始|はじ}まいだら"
            ],
            "correct": 0,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {始|はじ}まります → {始|はじ}まった → **{始|はじ}まったら** 〔hajimattara〕."
          },
          {
            "q": "Thể たら của {休|やす}みます 〔yasumimasu〕 (nghỉ) là gì?",
            "options": [
              "{休|やす}んだら",
              "{休|やす}したら",
              "{休|やす}いだら",
              "{休|やす}みたら"
            ],
            "correct": 0,
            "why": "**Nhóm 1**: thể た đổi âm như thể て (う・つ・る → った · む・ぶ・ぬ → んだ · く → いた · ぐ → いだ · す → した; 行く → 行った), rồi thêm **ら**: {休|やす}みます → {休|やす}んだ → **{休|やす}んだら** 〔yasundara〕."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-tara2",
        "title": "Chia thể たら — NHÓM 2 (10 câu)",
        "items": [
          {
            "q": "Thể たら của できます 〔dekimasu〕 ((được) mở ra, xây xong) là gì?",
            "options": [
              "できりたら",
              "できるたら",
              "できったら",
              "できたら"
            ],
            "correct": 3,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: できます → できた → **できたら** 〔dekitara〕."
          },
          {
            "q": "Thể たら của {起|お}きます 〔okimasu〕 (dậy) là gì?",
            "options": [
              "{起|お}きたら",
              "{起|お}きるたら",
              "{起|お}きてら",
              "{起|お}きりたら"
            ],
            "correct": 0,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {起|お}きます → {起|お}きた → **{起|お}きたら** 〔okitara〕."
          },
          {
            "q": "Thể たら của {割|わ}れます 〔waremasu〕 ((cốc) vỡ) là gì?",
            "options": [
              "{割|わ}れったら",
              "{割|わ}れたら",
              "{割|わ}れてら",
              "{割|わ}れるたら"
            ],
            "correct": 1,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {割|わ}れます → {割|わ}れた → **{割|わ}れたら** 〔waretara〕."
          },
          {
            "q": "Thể たら của {壊|こわ}れます 〔kowaremasu〕 (hỏng) là gì?",
            "options": [
              "{壊|こわ}れりたら",
              "{壊|こわ}れるたら",
              "{壊|こわ}れたら",
              "{壊|こわ}れてら"
            ],
            "correct": 2,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {壊|こわ}れます → {壊|こわ}れた → **{壊|こわ}れたら** 〔kowaretara〕."
          },
          {
            "q": "Thể たら của {倒|たお}れます 〔taoremasu〕 ((cây) đổ) là gì?",
            "options": [
              "{倒|たお}れるたら",
              "{倒|たお}れたら",
              "{倒|たお}れったら",
              "{倒|たお}れりたら"
            ],
            "correct": 1,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {倒|たお}れます → {倒|たお}れた → **{倒|たお}れたら** 〔taoretara〕."
          },
          {
            "q": "Thể たら của {汚|よご}れます 〔yogoremasu〕 (bẩn) là gì?",
            "options": [
              "{汚|よご}れてら",
              "{汚|よご}れりたら",
              "{汚|よご}れるたら",
              "{汚|よご}れたら"
            ],
            "correct": 3,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {汚|よご}れます → {汚|よご}れた → **{汚|よご}れたら** 〔yogoretara〕."
          },
          {
            "q": "Thể たら của {見|み}ます 〔mimasu〕 (xem) là gì?",
            "options": [
              "{見|み}たら",
              "{見|み}てら",
              "{見|み}ったら",
              "{見|み}りたら"
            ],
            "correct": 0,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {見|み}ます → {見|み}た → **{見|み}たら** 〔mitara〕."
          },
          {
            "q": "Thể たら của {落|お}ちます 〔ochimasu〕 (rơi) là gì?",
            "options": [
              "{落|お}ちたら",
              "{落|お}ちりたら",
              "{落|お}ちてら",
              "{落|お}ちるたら"
            ],
            "correct": 0,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {落|お}ちます → {落|お}ちた → **{落|お}ちたら** 〔ochitara〕."
          },
          {
            "q": "Thể たら của {出|で}かけます 〔dekakemasu〕 (ra ngoài) là gì?",
            "options": [
              "{出|で}かけりたら",
              "{出|で}かけてら",
              "{出|で}かけったら",
              "{出|で}かけたら"
            ],
            "correct": 3,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {出|で}かけます → {出|で}かけた → **{出|で}かけたら** 〔dekaketara〕."
          },
          {
            "q": "Thể たら của {消|き}えます 〔kiemasu〕 ((đèn) tắt) là gì?",
            "options": [
              "{消|き}えりたら",
              "{消|き}えたら",
              "{消|き}えったら",
              "{消|き}えてら"
            ],
            "correct": 1,
            "why": "**Nhóm 2**: bỏ ます + た, rồi thêm **ら**: {消|き}えます → {消|き}えた → **{消|き}えたら** 〔kietara〕."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-tara3",
        "title": "Chia thể たら — NHÓM 3 + ある (6 câu)",
        "items": [
          {
            "q": "Thể たら của します 〔shimasu〕 là gì?",
            "options": [
              "したら",
              "さたら",
              "すたら",
              "しったら"
            ],
            "correct": 0,
            "why": "します → した → **したら**."
          },
          {
            "q": "Thể たら của {来|き}ます 〔kimasu〕 là gì?",
            "options": [
              "{来|き}たら",
              "{来|こ}たら",
              "{来|き}ったら",
              "{来|く}るたら"
            ],
            "correct": 0,
            "why": "来ます → 来た (**きた**) → **来たら** (きたら). Khác 来ない (こない)."
          },
          {
            "q": "Thể たら của {結婚|けっこん}します 〔kekkon shimasu〕 là gì?",
            "options": [
              "{結婚|けっこん}するたら",
              "{結婚|けっこん} しったら",
              "{結婚|けっこん}すたら",
              "{結婚|けっこん} したら"
            ],
            "correct": 3,
            "why": "N + します → N + **したら**."
          },
          {
            "q": "Thể たら của あります 〔arimasu〕 là gì?",
            "options": [
              "あったら",
              "あるたら",
              "ありたら",
              "あんだら"
            ],
            "correct": 0,
            "why": "ある → あった → **あったら** (時間が あったら)."
          },
          {
            "q": "Thể たら của {入院|にゅういん}します 〔nyuuin shimasu〕 (nhập viện) là gì?",
            "options": [
              "{入院|にゅういん}してら",
              "{入院|にゅういん}するたら",
              "{入院|にゅういん}しったら",
              "{入院|にゅういん}したら"
            ],
            "correct": 3,
            "why": "**Nhóm 3**: します → した · 来ます → 来た (きた), rồi thêm **ら**: {入院|にゅういん}します → {入院|にゅういん}した → **{入院|にゅういん}したら** 〔nyuuin shitara〕."
          },
          {
            "q": "Thể たら của {緊張|きんちょう}します 〔kinchou shimasu〕 (hồi hộp) là gì?",
            "options": [
              "{緊張|きんちょう}したら",
              "{緊張|きんちょう}しったら",
              "{緊張|きんちょう}するたら",
              "{緊張|きんちょう}してら"
            ],
            "correct": 0,
            "why": "**Nhóm 3**: します → した · 来ます → 来た (きた), rồi thêm **ら**: {緊張|きんちょう}します → {緊張|きんちょう}した → **{緊張|きんちょう}したら** 〔kinchou shitara〕."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-tara-an",
        "title": "Thể たら của tính từ, danh từ (12 câu)",
        "items": [
          {
            "q": "\"Nếu thích\" — thể たら của {好|す}き 〔suki〕 (tính từ な) là gì?",
            "options": [
              "{好|す}きたら",
              "{好|す}きかったら",
              "{好|す}きじゃたら",
              "{好|す}きだったら"
            ],
            "correct": 3,
            "why": "ナA／N: + **だったら**: {好|す}き → **{好|す}きだったら** 〔suki dattara〕."
          },
          {
            "q": "\"Nếu gần\" — thể たら của {近|ちか}い 〔chikai〕 (tính từ い) là gì?",
            "options": [
              "{近|ちか}いたら",
              "{近|ちか}かったら",
              "{近|ちか}いだったら",
              "{近|ちか}くたら"
            ],
            "correct": 1,
            "why": "イA: bỏ い + **かったら**: {近|ちか}い → **{近|ちか}かったら** 〔chikakattara〕."
          },
          {
            "q": "\"Nếu trẻ con\" — thể たら của {子|こ}ども 〔kodomo〕 (danh từ) là gì?",
            "options": [
              "{子|こ}どもだったら",
              "{子|こ}どもなだったら",
              "{子|こ}どもじゃたら",
              "{子|こ}どもかったら"
            ],
            "correct": 0,
            "why": "ナA／N: + **だったら**: {子|こ}ども → **{子|こ}どもだったら** 〔kodomo dattara〕."
          },
          {
            "q": "\"Nếu miễn phí\" — thể たら của {無料|むりょう} 〔muryou〕 (danh từ) là gì?",
            "options": [
              "{無料|むりょう}たら",
              "{無料|むりょう}じゃたら",
              "{無料|むりょう}かったら",
              "{無料|むりょう}だったら"
            ],
            "correct": 3,
            "why": "ナA／N: + **だったら**: {無料|むりょう} → **{無料|むりょう}だったら** 〔muryou dattara〕."
          },
          {
            "q": "\"Nếu huỷ\" — thể たら của {中止|ちゅうし} 〔chuushi〕 (danh từ) là gì?",
            "options": [
              "{中止|ちゅうし}だったら",
              "{中止|ちゅうし}じゃたら",
              "{中止|ちゅうし}なだったら",
              "{中止|ちゅうし}かったら"
            ],
            "correct": 0,
            "why": "ナA／N: + **だったら**: {中止|ちゅうし} → **{中止|ちゅうし}だったら** 〔chuushi dattara〕."
          },
          {
            "q": "\"Nếu khoẻ\" — thể たら của {元気|げんき} 〔genki〕 (tính từ な) là gì?",
            "options": [
              "{元気|げんき}だったら",
              "{元気|げんき}じゃたら",
              "{元気|げんき}なだったら",
              "{元気|げんき}たら"
            ],
            "correct": 0,
            "why": "ナA／N: + **だったら**: {元気|げんき} → **{元気|げんき}だったら** 〔genki dattara〕."
          },
          {
            "q": "\"Nếu đắt\" — thể たら của {高|たか}い 〔takai〕 (tính từ い) là gì?",
            "options": [
              "{高|たか}かったら",
              "{高|たか}いたら",
              "{高|たか}かたら",
              "{高|たか}くたら"
            ],
            "correct": 0,
            "why": "イA: bỏ い + **かったら**: {高|たか}い → **{高|たか}かったら** 〔takakattara〕."
          },
          {
            "q": "\"Nếu lo lắng\" — thể たら của {心配|しんぱい} 〔shinpai〕 (tính từ な) là gì?",
            "options": [
              "{心配|しんぱい}たら",
              "{心配|しんぱい}だったら",
              "{心配|しんぱい}なだったら",
              "{心配|しんぱい}かったら"
            ],
            "correct": 1,
            "why": "ナA／N: + **だったら**: {心配|しんぱい} → **{心配|しんぱい}だったら** 〔shinpai dattara〕."
          },
          {
            "q": "\"Nếu yên tĩnh\" — thể たら của {静|しず}か 〔shizuka〕 (tính từ な) là gì?",
            "options": [
              "{静|しず}かなだったら",
              "{静|しず}かだったら",
              "{静|しず}かたら",
              "{静|しず}かかったら"
            ],
            "correct": 1,
            "why": "ナA／N: + **だったら**: {静|しず}か → **{静|しず}かだったら** 〔shizuka dattara〕."
          },
          {
            "q": "\"Nếu rảnh\" — thể たら của {暇|ひま} 〔hima〕 (tính từ な) là gì?",
            "options": [
              "{暇|ひま}じゃたら",
              "{暇|ひま}かったら",
              "{暇|ひま}だったら",
              "{暇|ひま}たら"
            ],
            "correct": 2,
            "why": "ナA／N: + **だったら**: {暇|ひま} → **{暇|ひま}だったら** 〔hima dattara〕."
          },
          {
            "q": "\"Nếu lạnh\" — thể たら của {寒|さむ}い 〔samui〕 (tính từ い) là gì?",
            "options": [
              "{寒|さむ}いたら",
              "{寒|さむ}いだったら",
              "{寒|さむ}かたら",
              "{寒|さむ}かったら"
            ],
            "correct": 3,
            "why": "イA: bỏ い + **かったら**: {寒|さむ}い → **{寒|さむ}かったら** 〔samukattara〕."
          },
          {
            "q": "\"Nếu không sao\" — thể たら của {大丈夫|だいじょうぶ} 〔daijoubu〕 (tính từ な) là gì?",
            "options": [
              "{大丈夫|だいじょうぶ}だったら",
              "{大丈夫|だいじょうぶ}なだったら",
              "{大丈夫|だいじょうぶ}じゃたら",
              "{大丈夫|だいじょうぶ}かったら"
            ],
            "correct": 0,
            "why": "ナA／N: + **だったら**: {大丈夫|だいじょうぶ} → **{大丈夫|だいじょうぶ}だったら** 〔daijoubu dattara〕."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-tara-phu",
        "title": "Thể たら phủ định: ～なかったら (4 câu)",
        "items": [
          {
            "q": "\"Nếu KHÔNG kịp\" — {間|ま}に{合|あ}わない 〔maniawanai〕 → ?",
            "options": [
              "{間|ま}に{合|あ}わなくたら",
              "{間|ま}に{合|あ}わないたら",
              "{間|ま}に{合|あ}わなかったら",
              "{間|ま}に{合|あ}わないだったら"
            ],
            "correct": 2,
            "why": "Thể ない: bỏ い + **かったら**: 間に合わない → **間に合わなかったら**."
          },
          {
            "q": "\"Nếu KHÔNG đến\" — {来|こ}ない 〔konai〕 → ?",
            "options": [
              "{来|き}なかったら",
              "{来|こ}なかったら",
              "{来|く}なかったら",
              "{来|こ}ないたら"
            ],
            "correct": 1,
            "why": "来ない (こない) → **来なかったら** (こなかったら)."
          },
          {
            "q": "\"Nếu KHÔNG đắt\" — {高|たか}くない 〔takakunai〕 → ?",
            "options": [
              "{高|たか}いなかったら",
              "{高|たか}くなかったら",
              "{高|たか}くないたら",
              "{高|たか}くないだったら"
            ],
            "correct": 1,
            "why": "イA phủ định 高くない → bỏ い + **かったら**."
          },
          {
            "q": "\"Nếu KHÔNG phải mưa\" — {雨|あめ}じゃない 〔ame ja nai〕 → ?",
            "options": [
              "{雨|あめ}なかったら",
              "{雨|あめ}じゃなかったら",
              "{雨|あめ}じゃないたら",
              "{雨|あめ}だなかったら"
            ],
            "correct": 1,
            "why": "N じゃない → **じゃなかったら**."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · thể ても · thể thường + そうです · gõ hàng loạt"
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-temo",
        "title": "Chia thể ても — động từ (16 câu)",
        "items": [
          {
            "q": "Thể ても của {来|き}ます 〔kimasu〕 (đến) là gì?",
            "options": [
              "{来|く}るても",
              "{来|き}ては",
              "{来|き}ても",
              "{来|き}たも"
            ],
            "correct": 2,
            "why": "**Thể て + も**: {来|き}て → **{来|き}ても** 〔kitemo〕 = dù đến cũng… (ポイント 121). Không dùng thể た (~~{来|き}たも~~)."
          },
          {
            "q": "Thể ても của {買|か}います 〔kaimasu〕 (mua) là gì?",
            "options": [
              "{買|か}うても",
              "{買|か}しても",
              "{買|か}っても",
              "{買|か}いでも"
            ],
            "correct": 2,
            "why": "**Thể て + も**: {買|か}って → **{買|か}っても** 〔kattemo〕 = dù mua cũng… (ポイント 121). Không dùng thể た (~~{買|か}ったも~~)."
          },
          {
            "q": "Thể ても của {消|き}えます 〔kiemasu〕 ((đèn) tắt) là gì?",
            "options": [
              "{消|き}えても",
              "{消|き}えたも",
              "{消|き}えるても",
              "{消|き}えては"
            ],
            "correct": 0,
            "why": "**Thể て + も**: {消|き}えて → **{消|き}えても** 〔kietemo〕 = dù (đèn) tắt cũng… (ポイント 121). Không dùng thể た (~~{消|き}えたも~~)."
          },
          {
            "q": "Thể ても của {食|た}べます 〔tabemasu〕 (ăn) là gì?",
            "options": [
              "{食|た}べたも",
              "{食|た}べるても",
              "{食|た}べても",
              "{食|た}べては"
            ],
            "correct": 2,
            "why": "**Thể て + も**: {食|た}べて → **{食|た}べても** 〔tabetemo〕 = dù ăn cũng… (ポイント 121). Không dùng thể た (~~{食|た}べたも~~)."
          },
          {
            "q": "Thể ても của {飲|の}みます 〔nomimasu〕 (uống) là gì?",
            "options": [
              "{飲|の}んでも",
              "{飲|の}いても",
              "{飲|の}んだも",
              "{飲|の}いでも"
            ],
            "correct": 0,
            "why": "**Thể て + も**: {飲|の}んで → **{飲|の}んでも** 〔nondemo〕 = dù uống cũng… (ポイント 121). Không dùng thể た (~~{飲|の}んだも~~)."
          },
          {
            "q": "Thể ても của {負|ま}けます 〔makemasu〕 (thua) là gì?",
            "options": [
              "{負|ま}けたも",
              "{負|ま}けても",
              "{負|ま}けるても",
              "{負|ま}けては"
            ],
            "correct": 1,
            "why": "**Thể て + も**: {負|ま}けて → **{負|ま}けても** 〔maketemo〕 = dù thua cũng… (ポイント 121). Không dùng thể た (~~{負|ま}けたも~~)."
          },
          {
            "q": "Thể ても của {行|い}きます 〔ikimasu〕 (đi (ngoại lệ: 行って)) là gì?",
            "options": [
              "{行|い}っても",
              "{行|い}ったも",
              "{行|い}きても",
              "{行|い}っては"
            ],
            "correct": 0,
            "why": "**Thể て + も**: {行|い}って → **{行|い}っても** 〔ittemo〕 = dù đi (ngoại lệ: 行って) cũng… (ポイント 121). Không dùng thể た (~~{行|い}ったも~~)."
          },
          {
            "q": "Thể ても của {集|あつ}まります 〔atsumarimasu〕 ((người) tụ tập) là gì?",
            "options": [
              "{集|あつ}まったも",
              "{集|あつ}まいても",
              "{集|あつ}まりても",
              "{集|あつ}まっても"
            ],
            "correct": 3,
            "why": "**Thể て + も**: {集|あつ}まって → **{集|あつ}まっても** 〔atsumattemo〕 = dù (người) tụ tập cũng… (ポイント 121). Không dùng thể た (~~{集|あつ}まったも~~)."
          },
          {
            "q": "Thể ても của {割|わ}れます 〔waremasu〕 ((cốc) vỡ) là gì?",
            "options": [
              "{割|わ}れたも",
              "{割|わ}れても",
              "{割|わ}れるても",
              "{割|わ}れては"
            ],
            "correct": 1,
            "why": "**Thể て + も**: {割|わ}れて → **{割|わ}れても** 〔waretemo〕 = dù (cốc) vỡ cũng… (ポイント 121). Không dùng thể た (~~{割|わ}れたも~~)."
          },
          {
            "q": "Thể ても của {起|お}きます 〔okimasu〕 (dậy) là gì?",
            "options": [
              "{起|お}きるても",
              "{起|お}きては",
              "{起|お}きても",
              "{起|お}きたも"
            ],
            "correct": 2,
            "why": "**Thể て + も**: {起|お}きて → **{起|お}きても** 〔okitemo〕 = dù dậy cũng… (ポイント 121). Không dùng thể た (~~{起|お}きたも~~)."
          },
          {
            "q": "Thể ても của {会|あ}います 〔aimasu〕 (gặp) là gì?",
            "options": [
              "{会|あ}うても",
              "{会|あ}ったも",
              "{会|あ}っても",
              "{会|あ}んでも"
            ],
            "correct": 2,
            "why": "**Thể て + も**: {会|あ}って → **{会|あ}っても** 〔attemo〕 = dù gặp cũng… (ポイント 121). Không dùng thể た (~~{会|あ}ったも~~)."
          },
          {
            "q": "Thể ても của うなずきます 〔unazukimasu〕 (gật đầu) là gì?",
            "options": [
              "うなずんでも",
              "うなずくても",
              "うなずいたも",
              "うなずいても"
            ],
            "correct": 3,
            "why": "**Thể て + も**: うなずいて → **うなずいても** 〔unazuitemo〕 = dù gật đầu cũng… (ポイント 121). Không dùng thể た (~~うなずいたも~~)."
          },
          {
            "q": "Thể ても của {話|はな}します 〔hanashimasu〕 (nói chuyện) là gì?",
            "options": [
              "{話|はな}しても",
              "{話|はな}いでも",
              "{話|はな}いても",
              "{話|はな}すても"
            ],
            "correct": 0,
            "why": "**Thể て + も**: {話|はな}して → **{話|はな}しても** 〔hanashitemo〕 = dù nói chuyện cũng… (ポイント 121). Không dùng thể た (~~{話|はな}したも~~)."
          },
          {
            "q": "Thể ても của {落|お}ちます 〔ochimasu〕 (rơi) là gì?",
            "options": [
              "{落|お}ちても",
              "{落|お}ちては",
              "{落|お}ちるても",
              "{落|お}ちたも"
            ],
            "correct": 0,
            "why": "**Thể て + も**: {落|お}ちて → **{落|お}ちても** 〔ochitemo〕 = dù rơi cũng… (ポイント 121). Không dùng thể た (~~{落|お}ちたも~~)."
          },
          {
            "q": "Thể ても của {見|み}ます 〔mimasu〕 (xem) là gì?",
            "options": [
              "{見|み}たも",
              "{見|み}ては",
              "{見|み}ても",
              "{見|み}るても"
            ],
            "correct": 2,
            "why": "**Thể て + も**: {見|み}て → **{見|み}ても** 〔mitemo〕 = dù xem cũng… (ポイント 121). Không dùng thể た (~~{見|み}たも~~)."
          },
          {
            "q": "Thể ても của {休|やす}みます 〔yasumimasu〕 (nghỉ) là gì?",
            "options": [
              "{休|やす}んだも",
              "{休|やす}んでも",
              "{休|やす}っても",
              "{休|やす}んでは"
            ],
            "correct": 1,
            "why": "**Thể て + も**: {休|やす}んで → **{休|やす}んでも** 〔yasundemo〕 = dù nghỉ cũng… (ポイント 121). Không dùng thể た (~~{休|やす}んだも~~)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-temo-an",
        "title": "Thể ても của tính từ, danh từ (10 câu)",
        "items": [
          {
            "q": "\"Dù đắt\" — thể ても của {高|たか}い 〔takai〕 (tính từ い) là gì?",
            "options": [
              "{高|たか}くても",
              "{高|たか}くでも",
              "{高|たか}いでも",
              "{高|たか}いても"
            ],
            "correct": 0,
            "why": "イA: bỏ い + **くても**: {高|たか}い → **{高|たか}くても** 〔takakutemo〕."
          },
          {
            "q": "\"Dù lạnh\" — thể ても của {寒|さむ}い 〔samui〕 (tính từ い) là gì?",
            "options": [
              "{寒|さむ}くても",
              "{寒|さむ}かっても",
              "{寒|さむ}くでも",
              "{寒|さむ}いても"
            ],
            "correct": 0,
            "why": "イA: bỏ い + **くても**: {寒|さむ}い → **{寒|さむ}くても** 〔samukutemo〕."
          },
          {
            "q": "\"Dù mạnh\" — thể ても của {強|つよ}い 〔tsuyoi〕 (tính từ い) là gì?",
            "options": [
              "{強|つよ}くても",
              "{強|つよ}かっても",
              "{強|つよ}くでも",
              "{強|つよ}いても"
            ],
            "correct": 0,
            "why": "イA: bỏ い + **くても**: {強|つよ}い → **{強|つよ}くても** 〔tsuyokutemo〕."
          },
          {
            "q": "\"Dù tốt\" — thể ても của いい 〔ii〕 (いい (ngoại lệ → よ～)) là gì?",
            "options": [
              "いいても",
              "いくても",
              "よいでも",
              "よくても"
            ],
            "correct": 3,
            "why": "**いい → よくても**: いい → **よくても** 〔yokutemo〕."
          },
          {
            "q": "\"Dù rảnh\" — thể ても của {暇|ひま} 〔hima〕 (tính từ な) là gì?",
            "options": [
              "{暇|ひま}なでも",
              "{暇|ひま}でも",
              "{暇|ひま}くても",
              "{暇|ひま}ても"
            ],
            "correct": 1,
            "why": "ナA／N: + **でも**: {暇|ひま} → **{暇|ひま}でも** 〔hima demo〕."
          },
          {
            "q": "\"Dù yên tĩnh\" — thể ても của {静|しず}か 〔shizuka〕 (tính từ な) là gì?",
            "options": [
              "{静|しず}かくても",
              "{静|しず}かでも",
              "{静|しず}かても",
              "{静|しず}かなでも"
            ],
            "correct": 1,
            "why": "ナA／N: + **でも**: {静|しず}か → **{静|しず}かでも** 〔shizuka demo〕."
          },
          {
            "q": "\"Dù thích\" — thể ても của {好|す}き 〔suki〕 (tính từ な) là gì?",
            "options": [
              "{好|す}きくても",
              "{好|す}きなでも",
              "{好|す}きだでも",
              "{好|す}きでも"
            ],
            "correct": 3,
            "why": "ナA／N: + **でも**: {好|す}き → **{好|す}きでも** 〔suki demo〕."
          },
          {
            "q": "\"Dù mưa\" — thể ても của {雨|あめ} 〔ame〕 (danh từ) là gì?",
            "options": [
              "{雨|あめ}くても",
              "{雨|あめ}でも",
              "{雨|あめ}ても",
              "{雨|あめ}だでも"
            ],
            "correct": 1,
            "why": "ナA／N: + **でも**: {雨|あめ} → **{雨|あめ}でも** 〔ame demo〕."
          },
          {
            "q": "\"Dù trẻ con\" — thể ても của {子|こ}ども 〔kodomo〕 (danh từ) là gì?",
            "options": [
              "{子|こ}どもなでも",
              "{子|こ}どもくても",
              "{子|こ}どもでも",
              "{子|こ}どもだでも"
            ],
            "correct": 2,
            "why": "ナA／N: + **でも**: {子|こ}ども → **{子|こ}どもでも** 〔kodomo demo〕."
          },
          {
            "q": "\"Dù Chủ nhật\" — thể ても của {日曜日|にちようび} 〔nichiyoubi〕 (danh từ) là gì?",
            "options": [
              "{日曜日|にちようび}ても",
              "{日曜日|にちようび}でも",
              "{日曜日|にちようび}なでも",
              "{日曜日|にちようび}だでも"
            ],
            "correct": 1,
            "why": "ナA／N: + **でも**: {日曜日|にちようび} → **{日曜日|にちようび}でも** 〔nichiyoubi demo〕."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-sou",
        "title": "Ráp \"nghe nói\": thể thường + そうです (14 câu)",
        "items": [
          {
            "q": "\"Nghe nói mai bão đến.\" — chọn câu đúng:",
            "options": [
              "{明日|あした}{台風|たいふう}が{来|き}ますそうです",
              "{明日|あした}{台風|たいふう}が{来|く}るそうでした",
              "{明日|あした}{台風|たいふう}が{来|く}るだそうです",
              "{明日|あした}{台風|たいふう}が{来|く}るそうです"
            ],
            "correct": 3,
            "why": "**Thể thường + そうです**: {来|き}ます → {来|く}る → **{明日|あした}{台風|たいふう}が{来|く}るそうです** 〔ashita taifuu ga kuru sou desu〕. Không dùng thể ます trước そうです; V／イA không thêm だ; そうです không chia quá khứ."
          },
          {
            "q": "\"Nghe nói trước ga mới mở một cửa hàng.\" — chọn câu đúng:",
            "options": [
              "{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}ができましたそうです",
              "{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}ができたそうです",
              "{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}ができたそうでした",
              "{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}ができただそうです"
            ],
            "correct": 1,
            "why": "**Thể thường + そうです**: できました → できた → **{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}ができたそうです** 〔eki no mae ni atarashii mise ga dekita sou desu〕. Không dùng thể ます trước そうです; V／イA không thêm だ; そうです không chia quá khứ."
          },
          {
            "q": "\"Nghe nói vì tai nạn mà tàu đã dừng.\" — chọn câu đúng:",
            "options": [
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まりましたそうです",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まっただそうです",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まったそうでした",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まったそうです"
            ],
            "correct": 3,
            "why": "**Thể thường + そうです**: {止|と}まりました → {止|と}まった → **{事故|じこ}で{電車|でんしゃ}が{止|と}まったそうです** 〔jiko de densha ga tomatta sou desu〕. Không dùng thể ます trước そうです; V／イA không thêm だ; そうです không chia quá khứ."
          },
          {
            "q": "\"Nghe nói Carlos không đến bữa tiệc.\" — chọn câu đúng:",
            "options": [
              "カルロスさんはパーティーに{来|こ}ないそうでした",
              "カルロスさんはパーティーに{来|こ}ないそうです",
              "カルロスさんはパーティーに{来|き}ませんそうです",
              "カルロスさんはパーティーに{来|こ}ないだそうです"
            ],
            "correct": 1,
            "why": "**Thể thường + そうです**: {来|き}ません → {来|こ}ない → **カルロスさんはパーティーに{来|こ}ないそうです** 〔karurosu-san wa paatii ni konai sou desu〕. Không dùng thể ます trước そうです; V／イA không thêm だ; そうです không chia quá khứ."
          },
          {
            "q": "\"Nghe nói trận hôm qua Nhật thắng.\" — chọn câu đúng:",
            "options": [
              "{昨日|きのう}の{試合|しあい}は{日本|にほん}が{勝|か}ちましたそうです",
              "{昨日|きのう}の{試合|しあい}は{日本|にほん}が{勝|か}ったそうです",
              "{昨日|きのう}の{試合|しあい}は{日本|にほん}が{勝|か}ったそうでした",
              "{昨日|きのう}の{試合|しあい}は{日本|にほん}が{勝|か}っただそうです"
            ],
            "correct": 1,
            "why": "**Thể thường + そうです**: {勝|か}ちました → {勝|か}った → **{昨日|きのう}の{試合|しあい}は{日本|にほん}が{勝|か}ったそうです** 〔kinou no shiai wa nihon ga katta sou desu〕. Không dùng thể ます trước そうです; V／イA không thêm だ; そうです không chia quá khứ."
          },
          {
            "q": "\"Nghe nói chị gái của chị Yamaguchi tháng sau kết hôn.\" — chọn câu đúng:",
            "options": [
              "{山口|やまぐち}さんのお{姉|ねえ}さんは{来月|らいげつ}{結婚|けっこん}するそうです",
              "{山口|やまぐち}さんのお{姉|ねえ}さんは{来月|らいげつ}{結婚|けっこん}しますそうです",
              "{山口|やまぐち}さんのお{姉|ねえ}さんは{来月|らいげつ}{結婚|けっこん}するだそうです",
              "{山口|やまぐち}さんのお{姉|ねえ}さんは{来月|らいげつ}{結婚|けっこん}するそうでした"
            ],
            "correct": 0,
            "why": "**Thể thường + そうです**: {結婚|けっこん}します → {結婚|けっこん}する → **{山口|やまぐち}さんのお{姉|ねえ}さんは{来月|らいげつ}{結婚|けっこん}するそうです** 〔yamaguchi-san no oneesan wa raigetsu kekkon suru sou desu〕. Không dùng thể ます trước そうです; V／イA không thêm だ; そうです không chia quá khứ."
          },
          {
            "q": "\"Nghe nói không có ai thiệt mạng vì động đất.\" — chọn câu đúng:",
            "options": [
              "{地震|じしん}で{亡|な}くなった{人|ひと}はいないだそうです",
              "{地震|じしん}で{亡|な}くなった{人|ひと}はいないそうでした",
              "{地震|じしん}で{亡|な}くなった{人|ひと}はいませんそうです",
              "{地震|じしん}で{亡|な}くなった{人|ひと}はいないそうです"
            ],
            "correct": 3,
            "why": "**Thể thường + そうです**: いません → いない → **{地震|じしん}で{亡|な}くなった{人|ひと}はいないそうです** 〔jishin de nakunatta hito wa inai sou desu〕. Không dùng thể ます trước そうです; V／イA không thêm だ; そうです không chia quá khứ."
          },
          {
            "q": "\"Nghe nói thầy Honda tuần trước nhập viện.\" — chọn câu đúng:",
            "options": [
              "{本田先生|ほんだせんせい}は{先週|せんしゅう}{入院|にゅういん}しましたそうです",
              "{本田先生|ほんだせんせい}は{先週|せんしゅう}{入院|にゅういん}しただそうです",
              "{本田先生|ほんだせんせい}は{先週|せんしゅう}{入院|にゅういん}したそうです",
              "{本田先生|ほんだせんせい}は{先週|せんしゅう}{入院|にゅういん}したそうでした"
            ],
            "correct": 2,
            "why": "**Thể thường + そうです**: {入院|にゅういん}しました → {入院|にゅういん}した → **{本田先生|ほんだせんせい}は{先週|せんしゅう}{入院|にゅういん}したそうです** 〔hondasensei wa senshuu nyuuin shita sou desu〕. Không dùng thể ます trước そうです; V／イA không thêm だ; そうです không chia quá khứ."
          },
          {
            "q": "\"Nghe nói mì ramen quán này ngon.\" — chọn câu đúng:",
            "options": [
              "この{店|みせ}のラーメンはおいしくそうです",
              "この{店|みせ}のラーメンはおいしいそうです",
              "この{店|みせ}のラーメンはおいしいですそうです",
              "この{店|みせ}のラーメンはおいしいだそうです"
            ],
            "correct": 1,
            "why": "イA + **そうです** (không thêm だ) → **この{店|みせ}のラーメンはおいしいそうです** 〔kono mise no raamen wa oishii sou desu〕."
          },
          {
            "q": "\"Nghe nói mùa đông Hokkaido rất lạnh.\" — chọn câu đúng:",
            "options": [
              "{北海道|ほっかいどう}の{冬|ふゆ}はとても{寒|さむ}いそうです",
              "{北海道|ほっかいどう}の{冬|ふゆ}はとても{寒|さむ}くそうです",
              "{北海道|ほっかいどう}の{冬|ふゆ}はとても{寒|さむ}いだそうです",
              "{北海道|ほっかいどう}の{冬|ふゆ}はとても{寒|さむ}いですそうです"
            ],
            "correct": 0,
            "why": "イA + **そうです** (không thêm だ) → **{北海道|ほっかいどう}の{冬|ふゆ}はとても{寒|さむ}いそうです** 〔hokkaidou no fuyu wa totemo samui sou desu〕."
          },
          {
            "q": "\"Nghe nói tháng sau bảo tàng miễn phí.\" — chọn câu đúng:",
            "options": [
              "{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}なそうです",
              "{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}そうです",
              "{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}だそうです",
              "{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}ですそうです"
            ],
            "correct": 2,
            "why": "ナA／N + **だそうです** → **{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}だそうです** 〔raigetsu, bijutsukan wa muryou da sou desu〕."
          },
          {
            "q": "\"Nghe nói thị trấn đó rất yên tĩnh.\" — chọn câu đúng:",
            "options": [
              "あの{町|まち}はとても{静|しず}かですそうです",
              "あの{町|まち}はとても{静|しず}かなそうです",
              "あの{町|まち}はとても{静|しず}かだそうです",
              "あの{町|まち}はとても{静|しず}かそうです"
            ],
            "correct": 2,
            "why": "ナA／N + **だそうです** → **あの{町|まち}はとても{静|しず}かだそうです** 〔ano machi wa totemo shizuka da sou desu〕."
          },
          {
            "q": "\"Nghe nói ngày mai mưa.\" — chọn câu đúng:",
            "options": [
              "{明日|あした}は{雨|あめ}そうです",
              "{明日|あした}は{雨|あめ}ですそうです",
              "{明日|あした}は{雨|あめ}だそうです",
              "{明日|あした}は{雨|あめ}なそうです"
            ],
            "correct": 2,
            "why": "ナA／N + **だそうです** → **{明日|あした}は{雨|あめ}だそうです** 〔ashita wa ame da sou desu〕."
          },
          {
            "q": "\"Nghe nói Daniel thích bài hát Nhật.\" — chọn câu đúng:",
            "options": [
              "ダニエルさんは{日本|にほん}の{歌|うた}が{好|す}きなそうです",
              "ダニエルさんは{日本|にほん}の{歌|うた}が{好|す}きですそうです",
              "ダニエルさんは{日本|にほん}の{歌|うた}が{好|す}きだそうです",
              "ダニエルさんは{日本|にほん}の{歌|うた}が{好|す}きそうです"
            ],
            "correct": 2,
            "why": "ナA／N + **だそうです** → **ダニエルさんは{日本|にほん}の{歌|うた}が{好|す}きだそうです** 〔danieru-san wa nihon no uta ga suki da sou desu〕."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-tt-go-tara",
        "title": "Gõ thể たら — động từ (24 câu)",
        "kind": "fill",
        "grammar": "Thể た + ら: ～ったら · ～んだら · ～いたら · ～いだら · ～したら · nhóm 2 ～たら",
        "items": [
          {
            "q": "{帰|かえ}ります 〔kaerimasu〕 (về) → thể たら ＿＿",
            "answers": [
              "帰ったら",
              "かえったら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{食|た}べます 〔tabemasu〕 (ăn) → thể たら ＿＿",
            "answers": [
              "食べたら",
              "たべたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "します 〔shimasu〕 (làm) → thể たら ＿＿",
            "answers": [
              "したら"
            ],
            "hint": "Nhóm 3: したら · 来たら (きたら)"
          },
          {
            "q": "すきます 〔sukimasu〕 (vắng) → thể たら ＿＿",
            "answers": [
              "すいたら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "うなずきます 〔unazukimasu〕 (gật đầu) → thể たら ＿＿",
            "answers": [
              "うなずいたら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{結婚|けっこん}します 〔kekkon shimasu〕 (kết hôn) → thể たら ＿＿",
            "answers": [
              "結婚したら",
              "けっこんしたら"
            ],
            "hint": "Nhóm 3: したら · 来たら (きたら)"
          },
          {
            "q": "{行|い}きます 〔ikimasu〕 (đi (ngoại lệ: 行って)) → thể たら ＿＿",
            "answers": [
              "行ったら",
              "いったら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{死|し}にます 〔shinimasu〕 (chết) → thể たら ＿＿",
            "answers": [
              "死んだら",
              "しんだら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{消|き}えます 〔kiemasu〕 ((đèn) tắt) → thể たら ＿＿",
            "answers": [
              "消えたら",
              "きえたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "{倒|たお}れます 〔taoremasu〕 ((cây) đổ) → thể たら ＿＿",
            "answers": [
              "倒れたら",
              "たおれたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "やみます 〔yamimasu〕 ((mưa) tạnh) → thể たら ＿＿",
            "answers": [
              "やんだら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{入院|にゅういん}します 〔nyuuin shimasu〕 (nhập viện) → thể たら ＿＿",
            "answers": [
              "入院したら",
              "にゅういんしたら"
            ],
            "hint": "Nhóm 3: したら · 来たら (きたら)"
          },
          {
            "q": "{見|み}ます 〔mimasu〕 (xem) → thể たら ＿＿",
            "answers": [
              "見たら",
              "みたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "{休|やす}みます 〔yasumimasu〕 (nghỉ) → thể たら ＿＿",
            "answers": [
              "休んだら",
              "やすんだら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{落|お}ちます 〔ochimasu〕 (rơi) → thể たら ＿＿",
            "answers": [
              "落ちたら",
              "おちたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "{負|ま}けます 〔makemasu〕 (thua) → thể たら ＿＿",
            "answers": [
              "負けたら",
              "まけたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "{笑|わら}います 〔waraimasu〕 (cười) → thể たら ＿＿",
            "answers": [
              "笑ったら",
              "わらったら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "できます 〔dekimasu〕 ((được) mở ra, xây xong) → thể たら ＿＿",
            "answers": [
              "できたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "{話|はな}します 〔hanashimasu〕 (nói chuyện) → thể たら ＿＿",
            "answers": [
              "話したら",
              "はなしたら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{止|と}まります 〔tomarimasu〕 ((tàu) dừng) → thể たら ＿＿",
            "answers": [
              "止まったら",
              "とまったら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{割|わ}れます 〔waremasu〕 ((cốc) vỡ) → thể たら ＿＿",
            "answers": [
              "割れたら",
              "われたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "{集|あつ}まります 〔atsumarimasu〕 ((người) tụ tập) → thể たら ＿＿",
            "answers": [
              "集まったら",
              "あつまったら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          },
          {
            "q": "{汚|よご}れます 〔yogoremasu〕 (bẩn) → thể たら ＿＿",
            "answers": [
              "汚れたら",
              "よごれたら"
            ],
            "hint": "Nhóm 2: bỏ ます + たら"
          },
          {
            "q": "{消|け}します 〔keshimasu〕 (tắt (đèn)) → thể たら ＿＿",
            "answers": [
              "消したら",
              "けしたら"
            ],
            "hint": "Nhóm 1: thể た (った・んだ・いた・いだ・した) + ら"
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-tt-go-tara-an",
        "title": "Gõ thể たら — tính từ, danh từ (13 câu)",
        "kind": "fill",
        "grammar": "イA ～かったら · いい → よかったら · ナA／N ～だったら",
        "items": [
          {
            "q": "{高|たか}い 〔takai〕 (tính từ い, đắt) → \"nếu …\" ＿＿",
            "answers": [
              "高かったら",
              "たかかったら"
            ],
            "hint": "bỏ い + かったら"
          },
          {
            "q": "{寒|さむ}い 〔samui〕 (tính từ い, lạnh) → \"nếu …\" ＿＿",
            "answers": [
              "寒かったら",
              "さむかったら"
            ],
            "hint": "bỏ い + かったら"
          },
          {
            "q": "{強|つよ}い 〔tsuyoi〕 (tính từ い, mạnh) → \"nếu …\" ＿＿",
            "answers": [
              "強かったら",
              "つよかったら"
            ],
            "hint": "bỏ い + かったら"
          },
          {
            "q": "{怖|こわ}い 〔kowai〕 (tính từ い, đáng sợ) → \"nếu …\" ＿＿",
            "answers": [
              "怖かったら",
              "こわかったら"
            ],
            "hint": "bỏ い + かったら"
          },
          {
            "q": "{近|ちか}い 〔chikai〕 (tính từ い, gần) → \"nếu …\" ＿＿",
            "answers": [
              "近かったら",
              "ちかかったら"
            ],
            "hint": "bỏ い + かったら"
          },
          {
            "q": "{安|やす}い 〔yasui〕 (tính từ い, rẻ) → \"nếu …\" ＿＿",
            "answers": [
              "安かったら",
              "やすかったら"
            ],
            "hint": "bỏ い + かったら"
          },
          {
            "q": "いい 〔ii〕 (いい (ngoại lệ → よ～), tốt) → \"nếu …\" ＿＿",
            "answers": [
              "よかったら"
            ],
            "hint": "いい → よかったら"
          },
          {
            "q": "{暇|ひま} 〔hima〕 (tính từ な, rảnh) → \"nếu …\" ＿＿",
            "answers": [
              "暇だったら",
              "ひまだったら"
            ],
            "hint": "+ だったら"
          },
          {
            "q": "{静|しず}か 〔shizuka〕 (tính từ な, yên tĩnh) → \"nếu …\" ＿＿",
            "answers": [
              "静かだったら",
              "しずかだったら"
            ],
            "hint": "+ だったら"
          },
          {
            "q": "{心配|しんぱい} 〔shinpai〕 (tính từ な, lo lắng) → \"nếu …\" ＿＿",
            "answers": [
              "心配だったら",
              "しんぱいだったら"
            ],
            "hint": "+ だったら"
          },
          {
            "q": "{好|す}き 〔suki〕 (tính từ な, thích) → \"nếu …\" ＿＿",
            "answers": [
              "好きだったら",
              "すきだったら"
            ],
            "hint": "+ だったら"
          },
          {
            "q": "{大丈夫|だいじょうぶ} 〔daijoubu〕 (tính từ な, không sao) → \"nếu …\" ＿＿",
            "answers": [
              "大丈夫だったら",
              "だいじょうぶだったら"
            ],
            "hint": "+ だったら"
          },
          {
            "q": "{元気|げんき} 〔genki〕 (tính từ な, khoẻ) → \"nếu …\" ＿＿",
            "answers": [
              "元気だったら",
              "げんきだったら"
            ],
            "hint": "+ だったら"
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-tt-go-temo",
        "title": "Gõ thể ても — động từ (16 câu)",
        "kind": "fill",
        "grammar": "Thể て + も",
        "items": [
          {
            "q": "{行|い}きます 〔ikimasu〕 (đi (ngoại lệ: 行って)) → thể ても ＿＿",
            "answers": [
              "行っても",
              "いっても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{割|わ}れます 〔waremasu〕 ((cốc) vỡ) → thể ても ＿＿",
            "answers": [
              "割れても",
              "われても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "やみます 〔yamimasu〕 ((mưa) tạnh) → thể ても ＿＿",
            "answers": [
              "やんでも"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{書|か}きます 〔kakimasu〕 (viết) → thể ても ＿＿",
            "answers": [
              "書いても",
              "かいても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{話|はな}します 〔hanashimasu〕 (nói chuyện) → thể ても ＿＿",
            "answers": [
              "話しても",
              "はなしても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "できます 〔dekimasu〕 ((được) mở ra, xây xong) → thể ても ＿＿",
            "answers": [
              "できても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{休|やす}みます 〔yasumimasu〕 (nghỉ) → thể ても ＿＿",
            "answers": [
              "休んでも",
              "やすんでも"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{泳|およ}ぎます 〔oyogimasu〕 (bơi) → thể ても ＿＿",
            "answers": [
              "泳いでも",
              "およいでも"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{壊|こわ}れます 〔kowaremasu〕 (hỏng) → thể ても ＿＿",
            "answers": [
              "壊れても",
              "こわれても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{始|はじ}まります 〔hajimarimasu〕 ((việc) bắt đầu) → thể ても ＿＿",
            "answers": [
              "始まっても",
              "はじまっても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{急|いそ}ぎます 〔isogimasu〕 (vội) → thể ても ＿＿",
            "answers": [
              "急いでも",
              "いそいでも"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{閉|し}まります 〔shimarimasu〕 ((cửa) đóng) → thể ても ＿＿",
            "answers": [
              "閉まっても",
              "しまっても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{死|し}にます 〔shinimasu〕 (chết) → thể ても ＿＿",
            "answers": [
              "死んでも",
              "しんでも"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{遊|あそ}びます 〔asobimasu〕 (chơi) → thể ても ＿＿",
            "answers": [
              "遊んでも",
              "あそんでも"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{買|か}います 〔kaimasu〕 (mua) → thể ても ＿＿",
            "answers": [
              "買っても",
              "かっても"
            ],
            "hint": "Thể て + も"
          },
          {
            "q": "{緊張|きんちょう}します 〔kinchou shimasu〕 (hồi hộp) → thể ても ＿＿",
            "answers": [
              "緊張しても",
              "きんちょうしても"
            ],
            "hint": "Thể て + も"
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-tt-go-temo-an",
        "title": "Gõ thể ても — tính từ, danh từ (12 câu)",
        "kind": "fill",
        "grammar": "イA ～くて も · いい → よくて も · ナA／N ～でも",
        "items": [
          {
            "q": "{安|やす}い 〔yasui〕 (tính từ い, rẻ) → \"dù …\" ＿＿",
            "answers": [
              "安くても",
              "やすくても"
            ],
            "hint": "bỏ い + くても"
          },
          {
            "q": "いい 〔ii〕 (いい (ngoại lệ → よ～), tốt) → \"dù …\" ＿＿",
            "answers": [
              "よくても"
            ],
            "hint": "いい → よくても"
          },
          {
            "q": "{暇|ひま} 〔hima〕 (tính từ な, rảnh) → \"dù …\" ＿＿",
            "answers": [
              "暇でも",
              "ひまでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{静|しず}か 〔shizuka〕 (tính từ な, yên tĩnh) → \"dù …\" ＿＿",
            "answers": [
              "静かでも",
              "しずかでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{心配|しんぱい} 〔shinpai〕 (tính từ な, lo lắng) → \"dù …\" ＿＿",
            "answers": [
              "心配でも",
              "しんぱいでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{好|す}き 〔suki〕 (tính từ な, thích) → \"dù …\" ＿＿",
            "answers": [
              "好きでも",
              "すきでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{大丈夫|だいじょうぶ} 〔daijoubu〕 (tính từ な, không sao) → \"dù …\" ＿＿",
            "answers": [
              "大丈夫でも",
              "だいじょうぶでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{元気|げんき} 〔genki〕 (tính từ な, khoẻ) → \"dù …\" ＿＿",
            "answers": [
              "元気でも",
              "げんきでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{雨|あめ} 〔ame〕 (danh từ, mưa) → \"dù …\" ＿＿",
            "answers": [
              "雨でも",
              "あめでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{無料|むりょう} 〔muryou〕 (danh từ, miễn phí) → \"dù …\" ＿＿",
            "answers": [
              "無料でも",
              "むりょうでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{中止|ちゅうし} 〔chuushi〕 (danh từ, huỷ) → \"dù …\" ＿＿",
            "answers": [
              "中止でも",
              "ちゅうしでも"
            ],
            "hint": "+ でも"
          },
          {
            "q": "{子|こ}ども 〔kodomo〕 (danh từ, trẻ con) → \"dù …\" ＿＿",
            "answers": [
              "子どもでも",
              "こどもでも"
            ],
            "hint": "+ でも"
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-tt-go-sou",
        "title": "Gõ phần trước そうです (12 câu)",
        "kind": "fill",
        "grammar": "V／イA thể thường · ナA／N + だ",
        "items": [
          {
            "q": "{明日|あした}は{雨|あめ}が＿＿そうです。　〔Ashita wa ame ga __ sou desu.〕",
            "answers": [
              "降る",
              "ふる"
            ],
            "hint": "ふります → thể thường"
          },
          {
            "q": "{駅|えき}の{近|ちか}くに{新|あたら}しい{店|みせ}が＿＿そうです。　〔Eki no chikaku ni atarashii mise ga __ sou desu.〕",
            "answers": [
              "できた"
            ],
            "hint": "できました → thể thường"
          },
          {
            "q": "{台風|たいふう}で{木|き}が＿＿そうです。　〔Taifuu de ki ga __ sou desu.〕",
            "answers": [
              "倒れた",
              "たおれた"
            ],
            "hint": "たおれました → thể thường"
          },
          {
            "q": "{西川|にしかわ}さんは{明日|あした}{学校|がっこう}へ＿＿そうです。　〔Nishikawa-san wa ashita gakkou e __ sou desu.〕",
            "answers": [
              "来ない",
              "こない"
            ],
            "hint": "きません → thể thường"
          },
          {
            "q": "あの{店|みせ}のケーキは＿＿そうです。　〔Ano mise no keeki wa __ sou desu.〕",
            "answers": [
              "おいしい"
            ],
            "hint": "おいしいです → thể thường"
          },
          {
            "q": "{来週|らいしゅう}のコンサートは＿＿そうです。　〔Raishuu no konsaato wa __ sou desu.〕",
            "answers": [
              "中止だ",
              "ちゅうしだ"
            ],
            "hint": "ちゅうしです → thể thường (N + だ)"
          },
          {
            "q": "{子|こ}どもは{入場料|にゅうじょうりょう}が＿＿そうです。　〔Kodomo wa nyuujouryou ga __ sou desu.〕",
            "answers": [
              "無料だ",
              "むりょうだ"
            ],
            "hint": "むりょうです → N + だ"
          },
          {
            "q": "{昨日|きのう}の{試合|しあい}は{日本|にほん}が＿＿そうです。　〔Kinou no shiai wa Nihon ga __ sou desu.〕",
            "answers": [
              "負けた",
              "まけた"
            ],
            "hint": "まけました → thể thường"
          },
          {
            "q": "ワンさんは{日本|にほん}の{映画|えいが}が＿＿そうです。　〔Wan-san wa Nihon no eiga ga __ sou desu.〕",
            "answers": [
              "好きだ",
              "すきだ"
            ],
            "hint": "すきです → ナA + だ"
          },
          {
            "q": "{地震|じしん}で{窓|まど}ガラスが＿＿そうです。　〔Jishin de mado garasu ga __ sou desu.〕",
            "answers": [
              "割れた",
              "われた"
            ],
            "hint": "われました → thể thường"
          },
          {
            "q": "{本田先生|ほんだせんせい}は{今|いま}＿＿そうです。　〔Hondasensei wa ima __ sou desu.〕",
            "answers": [
              "入院している",
              "にゅういんしている"
            ],
            "hint": "にゅういんしています → thể thường"
          },
          {
            "q": "{北海道|ほっかいどう}は{今日|きょう}とても＿＿そうです。　〔Hokkaidou wa kyou totemo __ sou desu.〕",
            "answers": [
              "寒い",
              "さむい"
            ],
            "hint": "さむいです → thể thường"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bẫy trong câu · gõ trong câu · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b15-tt-bay",
        "title": "Bẫy — chọn câu ĐÚNG (12 câu)",
        "items": [
          {
            "q": "Câu nào ĐÚNG? (nếu có thời gian)",
            "options": [
              "{時間|じかん}があっても、{行|い}きたら。 (Jikan ga atte mo, ikitara.)",
              "{時間|じかん}があったら、{行|い}きます。 (Jikan ga attara, ikimasu.)",
              "{時間|じかん}があるたら、{行|い}きます。 (Jikan ga arutara, ikimasu.)",
              "{時間|じかん}がありたら、{行|い}きます。 (Jikan ga aritara, ikimasu.)"
            ],
            "correct": 1,
            "why": "ある → あった → **あったら**."
          },
          {
            "q": "Câu nào ĐÚNG? (nếu rẻ thì mua)",
            "options": [
              "{安|やす}いだったら、{買|か}います。 (Yasuidattara, kaimasu.)",
              "{安|やす}くたら、{買|か}います。 (Yasukutara, kaimasu.)",
              "{安|やす}いたら、{買|か}います。 (Yasuitara, kaimasu.)",
              "{安|やす}かったら、{買|か}います。 (Yasukattara, kaimasu.)"
            ],
            "correct": 3,
            "why": "イA: 安い → **安かったら**."
          },
          {
            "q": "Câu nào ĐÚNG? (nếu được thì…)",
            "options": [
              "よかったら、{一緒|いっしょ}に{行|い}きませんか。 (Yokattara, issho ni ikimasen ka.)",
              "いかったら、{一緒|いっしょ}に{行|い}きませんか。 (Ikattara, issho ni ikimasen ka.)",
              "いいだったら、{一緒|いっしょ}に{行|い}きませんか。 (Iidattara, issho ni ikimasen ka.)",
              "いいたら、{一緒|いっしょ}に{行|い}きませんか。 (Iitara, issho ni ikimasen ka.)"
            ],
            "correct": 0,
            "why": "**いい → よかったら** (ngoại lệ)."
          },
          {
            "q": "Câu nào ĐÚNG? (nếu rảnh)",
            "options": [
              "{暇|ひま}かったら、{遊|あそ}びに{来|き}てください。 (Hima kattara, asobi ni kite kudasai.)",
              "{暇|ひま}たら、{遊|あそ}びに{来|き}てください。 (Hima tara, asobi ni kite kudasai.)",
              "{暇|ひま}だったら、{遊|あそ}びに{来|き}てください。 (Hima dattara, asobi ni kite kudasai.)",
              "{暇|ひま}なたら、{遊|あそ}びに{来|き}てください。 (Hima na tara, asobi ni kite kudasai.)"
            ],
            "correct": 2,
            "why": "ナA: **暇だったら**."
          },
          {
            "q": "Câu nào ĐÚNG? (dù mưa)",
            "options": [
              "{雨|あめ}が{降|ふ}りても、{行|い}きます。 (Ame ga furitemo, ikimasu.)",
              "{雨|あめ}が{降|ふ}ったも、{行|い}きます。 (Ame ga futta mo, ikimasu.)",
              "{雨|あめ}が{降|ふ}っても、{行|い}きます。 (Ame ga futte mo, ikimasu.)",
              "{雨|あめ}が{降|ふ}るても、{行|い}きます。 (Ame ga furu temo, ikimasu.)"
            ],
            "correct": 2,
            "why": "Thể て 降って + **も**."
          },
          {
            "q": "Câu nào ĐÚNG? (dù yên tĩnh)",
            "options": [
              "{静|しず}かでも、{寝|ね}ることができません。 (Shizuka demo, neru koto ga dekimasen.)",
              "{静|しず}かだっても、{寝|ね}ることができません。 (Shizuka datte mo, neru koto ga dekimasen.)",
              "{静|しず}かなくても、{寝|ね}ることができません。 (Shizuka nakute mo, neru koto ga dekimasen.)",
              "{静|しず}かくても、{寝|ね}ることができません。 (Shizuka kute mo, neru koto ga dekimasen.)"
            ],
            "correct": 0,
            "why": "ナA: **静かでも**."
          },
          {
            "q": "Câu nào ĐÚNG? (dù lạnh)",
            "options": [
              "{寒|さむ}かっても、{毎朝|まいあさ}ジョギングをします。 (Samukatte mo, maiasa jogingu o shimasu.)",
              "{寒|さむ}いでも、{毎朝|まいあさ}ジョギングをします。 (Samui demo, maiasa jogingu o shimasu.)",
              "{寒|さむ}くても、{毎朝|まいあさ}ジョギングをします。 (Samukute mo, maiasa jogingu o shimasu.)",
              "{寒|さむ}いても、{毎朝|まいあさ}ジョギングをします。 (Samuite mo, maiasa jogingu o shimasu.)"
            ],
            "correct": 2,
            "why": "イA: 寒い → **寒くても**."
          },
          {
            "q": "Câu nào ĐÚNG? (nghe nói mai bão đến)",
            "options": [
              "{明日|あした}{台風|たいふう}が{来|く}るだそうです。 (Ashita taifuu ga kuru da sou desu.)",
              "{明日|あした}{台風|たいふう}が{来|く}るそうです。 (Ashita taifuu ga kuru sou desu.)",
              "{明日|あした}{台風|たいふう}が{来|き}ますそうです。 (Ashita taifuu ga kimasu sou desu.)",
              "{明日|あした}{台風|たいふう}が{来|く}るそうでした。 (Ashita taifuu ga kuru sou deshita.)"
            ],
            "correct": 1,
            "why": "Thể thường 来る + **そうです**."
          },
          {
            "q": "Câu nào ĐÚNG? (nghe nói miễn phí)",
            "options": [
              "{子|こ}どもは{無料|むりょう}なそうです。 (Kodomo wa muryou na sou desu.)",
              "{子|こ}どもは{無料|むりょう}ですそうです。 (Kodomo wa muryou desu sou desu.)",
              "{子|こ}どもは{無料|むりょう}そうです。 (Kodomo wa muryou sou desu.)",
              "{子|こ}どもは{無料|むりょう}だそうです。 (Kodomo wa muryou da sou desu.)"
            ],
            "correct": 3,
            "why": "N + **だそうです**."
          },
          {
            "q": "Câu nào ĐÚNG? (nếu bạn đến)",
            "options": [
              "{明日|あした}{来|き}たら、{電話|でんわ}してください。 (Ashita kitara, denwa shite kudasai.)",
              "{明日|あした}{来|き}ったら、{電話|でんわ}してください。 (Ashita kittara, denwa shite kudasai.)",
              "{明日|あした}{来|く}るたら、{電話|でんわ}してください。 (Ashita kurutara, denwa shite kudasai.)",
              "{明日|あした}{来|こ}たら、{電話|でんわ}してください。 (Ashita kotara, denwa shite kudasai.)"
            ],
            "correct": 0,
            "why": "来ます → 来た (きた) → **来たら** (きたら)."
          },
          {
            "q": "Câu nào ĐÚNG? (nếu không kịp)",
            "options": [
              "{間|ま}に{合|あ}わないたら、{先|さき}に{行|い}ってください。 (Maniawanaitara, saki ni itte kudasai.)",
              "{間|ま}に{合|あ}わなくたら、{先|さき}に{行|い}ってください。 (Maniawanakutara, saki ni itte kudasai.)",
              "{間|ま}に{合|あ}わなかったら、{先|さき}に{行|い}ってください。 (Maniawanakattara, saki ni itte kudasai.)",
              "{間|ま}に{合|あ}いなかったら、{先|さき}に{行|い}ってください。 (Maniainakattara, saki ni itte kudasai.)"
            ],
            "correct": 2,
            "why": "Thể ない 間に合わない → **間に合わなかったら**."
          },
          {
            "q": "Câu nào ĐÚNG? (nghe nói cửa hàng mới thì rẻ)",
            "options": [
              "{新|あたら}しい{店|みせ}は{安|やす}いそうです。 (Atarashii mise wa yasui sou desu.)",
              "{新|あたら}しい{店|みせ}は{安|やす}くそうです。 (Atarashii mise wa yasuku sou desu.)",
              "{新|あたら}しい{店|みせ}は{安|やす}いだそうです。 (Atarashii mise wa yasui da sou desu.)",
              "{新|あたら}しい{店|みせ}は{安|やす}いですそうです。 (Atarashii mise wa yasui desu sou desu.)"
            ],
            "correct": 0,
            "why": "イA + **そうです** (không thêm だ)."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-tt-cau",
        "title": "Gõ dạng đúng của từ trong gợi ý (12 câu)",
        "kind": "fill",
        "grammar": "たら · ても · そうです",
        "items": [
          {
            "q": "{明日|あした}＿＿、{海|うみ}へ{行|い}きましょう。　〔Ashita __, umi e ikimashou.〕",
            "answers": [
              "晴れたら",
              "はれたら"
            ],
            "hint": "はれます → nếu"
          },
          {
            "q": "{雨|あめ}が＿＿、{試合|しあい}はあります。　〔Ame ga __, shiai wa arimasu.〕",
            "answers": [
              "降っても",
              "ふっても"
            ],
            "hint": "ふります → dù"
          },
          {
            "q": "＿＿、{一緒|いっしょ}に{食|た}べませんか。　〔__, issho ni tabemasen ka.〕",
            "answers": [
              "よかったら"
            ],
            "hint": "いい → nếu"
          },
          {
            "q": "{電車|でんしゃ}が＿＿、タクシーで{行|い}きます。　〔Densha ga __, takushii de ikimasu.〕",
            "answers": [
              "止まったら",
              "とまったら"
            ],
            "hint": "とまります → nếu"
          },
          {
            "q": "{高|たか}くても、{人|ひと}が＿＿、{行|い}きたいです。　〔Takakute mo, hito ga __, ikitai desu.〕",
            "answers": [
              "多くても",
              "おおくても"
            ],
            "hint": "おおい → dù"
          },
          {
            "q": "{日曜日|にちようび}＿＿、{仕事|しごと}があります。　〔Nichiyoubi __, shigoto ga arimasu.〕",
            "answers": [
              "でも"
            ],
            "hint": "N → dù"
          },
          {
            "q": "{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}が＿＿そうです。　〔Eki no mae ni atarashii mise ga __ sou desu.〕",
            "answers": [
              "できた"
            ],
            "hint": "できます → nghe nói (quá khứ)"
          },
          {
            "q": "この{映画|えいが}はとても＿＿そうです。　〔Kono eiga wa totemo __ sou desu.〕",
            "answers": [
              "怖い",
              "こわい"
            ],
            "hint": "こわい → nghe nói"
          },
          {
            "q": "{明日|あした}は＿＿そうです。　〔Ashita wa __ sou desu.〕",
            "answers": [
              "雨だ",
              "あめだ"
            ],
            "hint": "あめ → nghe nói (N)"
          },
          {
            "q": "{急|いそ}いでも、もう＿＿と{思|おも}います。　〔Isoide mo, mou __ to omoimasu.〕",
            "answers": [
              "間に合わない",
              "間にあわない",
              "まに合わない",
              "まにあわない"
            ],
            "hint": "まにあいます → phủ định thể thường"
          },
          {
            "q": "お{金|かね}が＿＿、{大|おお}きい{家|いえ}を{買|か}いたいです。　〔Okane ga __, ookii ie o kaitai desu.〕",
            "answers": [
              "あったら"
            ],
            "hint": "あります → nếu"
          },
          {
            "q": "{暇|ひま}＿＿、{手伝|てつだ}ってください。　〔Hima __, tetsudatte kudasai.〕",
            "answers": [
              "だったら"
            ],
            "hint": "ナA → nếu"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-tt-ghep",
        "title": "Ghép câu (6 câu)",
        "items": [
          {
            "vi": "Nếu mai trời nắng thì đi dạo nhé.",
            "chips": [
              "{散歩|さんぽ}しましょう",
              "{晴|は}れたら、",
              "{明日|あした}",
              "{晴|は}れても、"
            ],
            "answer": [
              "{明日|あした}",
              "{晴|は}れたら、",
              "{散歩|さんぽ}しましょう"
            ],
            "ro": "Ashita haretara, sanpo shimashou"
          },
          {
            "vi": "Dù mưa trận đấu vẫn diễn ra.",
            "chips": [
              "{降|ふ}ったも、",
              "{降|ふ}っても、",
              "{雨|あめ}が",
              "{試合|しあい}はあります"
            ],
            "answer": [
              "{雨|あめ}が",
              "{降|ふ}っても、",
              "{試合|しあい}はあります"
            ],
            "ro": "Ame ga futte mo, shiai wa arimasu"
          },
          {
            "vi": "Nếu rảnh thì đến chơi nhé.",
            "chips": [
              "{遊|あそ}びに",
              "{暇|ひま}かったら、",
              "{来|き}てください",
              "{暇|ひま}だったら、"
            ],
            "answer": [
              "{暇|ひま}だったら、",
              "{遊|あそ}びに",
              "{来|き}てください"
            ],
            "ro": "Hima dattara, asobini kite kudasai"
          },
          {
            "vi": "Dù đắt tôi vẫn muốn mua.",
            "chips": [
              "{高|たか}くても、",
              "{買|か}いたい",
              "です",
              "{高|たか}いでも、"
            ],
            "answer": [
              "{高|たか}くても、",
              "{買|か}いたい",
              "です"
            ],
            "ro": "Takakute mo, kaitai desu"
          },
          {
            "vi": "Nghe nói ngày mai trời mưa.",
            "chips": [
              "{雨|あめ}な",
              "{雨|あめ}だ",
              "{明日|あした}は",
              "そうです"
            ],
            "answer": [
              "{明日|あした}は",
              "{雨|あめ}だ",
              "そうです"
            ],
            "ro": "Ashita wa ame da sou desu"
          },
          {
            "vi": "Nghe nói anh Nishikawa kết hôn rồi.",
            "chips": [
              "{結婚|けっこん}しました",
              "{西川|にしかわ}さんは",
              "{結婚|けっこん}した",
              "そうです"
            ],
            "answer": [
              "{西川|にしかわ}さんは",
              "{結婚|けっこん}した",
              "そうです"
            ],
            "ro": "Nishikawa-san wa kekkon shita sou desu"
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**たら = thể た + ら** (イA ～かったら · いい → よかったら · ナA／N ～だったら · phủ định ～なかったら) · **ても = thể て + も** (イA ～くて も · いい → よくて も · ナA／N ～でも · phủ định ～なくても) · **普通形 + そうです** (ナA／N + だ).",
          "Đọc to mỗi ngày 6 dòng: 行く→行ったら／行って も · 来る→来たら／来ても · する→したら／して も · 降る→降ったら／降って も · 高い→高かったら／高くて も · 雨→雨だったら／雨でも."
        ]
      }
    ]
  },
  {
    "id": "lt-b15-np-1",
    "kind": "homework",
    "title": "Luyện thêm Bài 15 · Ngữ pháp 1 (ポイント 119, 124) — これ、知ってる？: 普通形＋そうです (nghe nói) · N で (vì N) (~76 câu)",
    "goal": "Kể lại cho bạn tin xem được trên ti vi, tạp chí, nghe được từ người khác bằng 普通形＋そうです (台風が 来るそうです · 店が できたそうです · 無料だそうです), nói nguyên nhân bằng N で (事故で 電車が 止まりました · 地震で ビルが 倒れました), và đáp lại tin bằng cảm tưởng (本当ですか · 怖いですね · 心配ですね · よかったですね).",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**ポイント 119 — 普通形 + そうです** = nghe nói, người ta nói là (truyền lại thông tin, **không phải ý mình**): 台風が 来る**そうです** · 新しい 店が できた**そうです** · 雨**だ**そうです. Thì và phủ định đổi ở phần thể thường (来る／来た／来ない／来なかった); **そうです không đổi** (không có ~~そうでした~~). Nguồn tin: **ニュースで 見ましたが、～そうです** · **天気予報で 聞きましたが、～そうです**.",
          "**ポイント 124 — N で** = vì N (nguyên nhân, thường là sự kiện tự nhiên, tai nạn, bệnh): **台風で** 電車が 止まりました · **地震で** ビルが 倒れました · **病気で** 学校を 休みました. Vế sau là **kết quả đã xảy ra**, thường là **tự động từ** (止まる · 倒れる · 割れる). Không dùng để xin phép, rủ rê.",
          "Đáp lại tin: tin xấu → **本当ですか。怖いですね／心配ですね／大変ですね**; tin vui → **よかったですね** · **へえ、知りませんでした**. Đây là câu thi nói hay gặp: 「何か ニュースを 知っていますか」 → 「～そうです」."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**V／イA thể thường + そうです** — 雨が 降る**そうです** · 寒い**そうです** · 勝った**そうです** · 来ない**そうです** (119).",
          "**ナA／N + だ + そうです** — 暇**だ**そうです · 無料**だ**そうです · 中止**だ**そうです (119).",
          "**N で、～ました** — 事故**で** 電車が 止まりました · 台風**で** 木が 倒れました (124)."
        ]
      },
      {
        "t": "table",
        "head": [
          "で của bài nào",
          "Nghĩa",
          "Ví dụ"
        ],
        "rows": [
          [
            "Bài 3–4",
            "nơi xảy ra hành động",
            "公園**で** フリーマーケットが あります。"
          ],
          [
            "Bài 5–7",
            "phương tiện, cách thức",
            "バス**で** 行きます。 · 日本語**で** 話します。"
          ],
          [
            "**Bài 15 (124)**",
            "**nguyên nhân**",
            "台風**で** 電車が 止まりました。"
          ]
        ],
        "caption": "Ba nghĩa của で — nhìn danh từ đứng trước"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng ポイント một"
      },
      {
        "t": "mcq",
        "id": "lt-b15-np1-119",
        "title": "ポイント 119: 普通形 ＋ そうです (12 câu)",
        "items": [
          {
            "q": "{明日|あした}、{台風|たいふう}が＿＿そうです。　〔Ashita, taifuu ga __ sou desu.〕　— Nghe nói ngày mai bão đến.",
            "options": [
              "{来|き}ます",
              "{来|く}る",
              "{来|き}て",
              "{来|く}るだ"
            ],
            "correct": 1,
            "why": "Trước そうです dùng **thể thường**: 来る. → **{明日|あした}、{台風|たいふう}が{来|く}るそうです。** 〔Ashita, taifuu ga kuru sou desu.〕 — Nghe nói ngày mai bão đến."
          },
          {
            "q": "{駅|えき}の{前|まえ}に{新|あたら}しいカフェが＿＿そうです。　〔Eki no mae ni atarashii kafe ga __ sou desu.〕　— Nghe nói trước ga mới mở một quán cà phê.",
            "options": [
              "できた",
              "できました",
              "できるだ",
              "できて"
            ],
            "correct": 0,
            "why": "Việc đã xảy ra → thể thường quá khứ: できた. → **{駅|えき}の{前|まえ}に{新|あたら}しいカフェができたそうです。** 〔Eki no mae ni atarashii kafe ga dekita sou desu.〕 — Nghe nói trước ga mới mở một quán cà phê."
          },
          {
            "q": "{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}＿＿そうです。　〔Raigetsu, bijutsukan wa muryou __ sou desu.〕　— Nghe nói tháng sau bảo tàng miễn phí.",
            "options": [
              "だ",
              "な",
              "の",
              "です"
            ],
            "correct": 0,
            "why": "N + **だ** そうです. → **{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}だそうです。** 〔Raigetsu, bijutsukan wa muryou da sou desu.〕 — Nghe nói tháng sau bảo tàng miễn phí."
          },
          {
            "q": "この{店|みせ}のケーキはとても＿＿そうです。　〔Kono mise no keeki wa totemo __ sou desu.〕　— Nghe nói bánh của quán này rất ngon.",
            "options": [
              "おいしい",
              "おいしいです",
              "おいしく",
              "おいしいだ"
            ],
            "correct": 0,
            "why": "イA + そうです (không thêm だ). → **この{店|みせ}のケーキはとてもおいしいそうです。** 〔Kono mise no keeki wa totemo oishii sou desu.〕 — Nghe nói bánh của quán này rất ngon."
          },
          {
            "q": "{昨日|きのう}の{試合|しあい}は{日本|にほん}のチームが＿＿そうです。　〔Kinou no shiai wa Nihon no chiimu ga __ sou desu.〕　— Nghe nói trận hôm qua đội Nhật thắng.",
            "options": [
              "{勝|か}って",
              "{勝|か}った",
              "{勝|か}ちました",
              "{勝|か}つだ"
            ],
            "correct": 1,
            "why": "Quá khứ thể thường: 勝った. → **{昨日|きのう}の{試合|しあい}は{日本|にほん}のチームが{勝|か}ったそうです。** 〔Kinou no shiai wa Nihon no chiimu ga katta sou desu.〕 — Nghe nói trận hôm qua đội Nhật thắng."
          },
          {
            "q": "マルコさんは{明日|あした}のパーティーに＿＿そうです。　〔Maruko-san wa ashita no paatii ni __ sou desu.〕　— Nghe nói ngày mai Marco không đến bữa tiệc.",
            "options": [
              "{来|き}ない",
              "{来|こ}なくて",
              "{来|き}ません",
              "{来|こ}ない"
            ],
            "correct": 3,
            "why": "Phủ định thể thường: 来ない (こない). → **マルコさんは{明日|あした}のパーティーに{来|こ}ないそうです。** 〔Maruko-san wa ashita no paatii ni konai sou desu.〕 — Nghe nói ngày mai Marco không đến bữa tiệc."
          },
          {
            "q": "{北海道|ほっかいどう}は{今|いま}{雪|ゆき}が＿＿そうです。　〔Hokkaidou wa ima yuki ga __ sou desu.〕　— Nghe nói bây giờ ở Hokkaido tuyết đang rơi.",
            "options": [
              "{降|ふ}っています",
              "{降|ふ}るだ",
              "{降|ふ}っている",
              "{降|ふ}りている"
            ],
            "correct": 2,
            "why": "Đang diễn ra → 降っている (thể thường của 降っています). → **{北海道|ほっかいどう}は{今|いま}{雪|ゆき}が{降|ふ}っているそうです。** 〔Hokkaidou wa ima yuki ga futte iru sou desu.〕 — Nghe nói bây giờ ở Hokkaido tuyết đang rơi."
          },
          {
            "q": "{週末|しゅうまつ}のフリーマーケットは＿＿そうです。　〔Shuumatsu no furiimaaketto wa __ sou desu.〕　— Nghe nói chợ đồ cũ cuối tuần bị huỷ.",
            "options": [
              "{中止|ちゅうし}な",
              "{中止|ちゅうし}",
              "{中止|ちゅうし}です",
              "{中止|ちゅうし}だ"
            ],
            "correct": 3,
            "why": "N + だ そうです. → **{週末|しゅうまつ}のフリーマーケットは{中止|ちゅうし}だそうです。** 〔Shuumatsu no furiimaaketto wa chuushi da sou desu.〕 — Nghe nói chợ đồ cũ cuối tuần bị huỷ."
          },
          {
            "q": "Câu này nghĩa là gì? ニュースで{見|み}ましたが、{九州|きゅうしゅう}で{大|おお}きい{地震|じしん}があったそうです。　〔Nyuusu de mimashita ga, Kyuushuu de ookii jishin ga atta sou desu.〕",
            "options": [
              "Tôi nghĩ ở Kyushu sẽ có động đất lớn.",
              "Ở Kyushu có động đất lớn nên tôi đã xem thời sự.",
              "Tôi xem trên thời sự, nghe nói ở Kyushu có động đất lớn.",
              "Nếu có động đất lớn ở Kyushu thì tôi sẽ xem thời sự."
            ],
            "correct": 2,
            "why": "ニュースで 見ましたが、～そうです = nguồn tin + nghe nói."
          },
          {
            "q": "Câu nào là \"nghe nói\" (thông tin của người khác)?",
            "options": [
              "{明日|あした}{晴|は}れたら、{出|で}かけます。 (Ashita haretara, dekakemasu.)",
              "{明日|あした}はきっと{晴|は}れると{思|おも}います。 (Ashita wa kitto hareru to omoimasu.)",
              "{明日|あした}は{晴|は}れても、{出|で}かけません。 (Ashita wa harete mo, dekakemasen.)",
              "{天気予報|てんきよほう}で{聞|き}きましたが、{明日|あした}は{晴|は}れるそうです。 (Tenkiyohou de kikimashita ga, ashita wa hareru sou desu.)"
            ],
            "correct": 3,
            "why": "～そうです = truyền lại tin; ～と 思います = ý mình đoán."
          },
          {
            "q": "A：{田中|たなか}さんのお{父|とう}さんが{亡|な}くなったそうです。B：＿＿。　〔A: Tanaka-san no otousan ga nakunatta sou desu. B: __.〕　— A: Nghe nói bố của anh Tanaka mất rồi. B: Vậy à. Vất vả cho anh ấy quá.",
            "options": [
              "いただきます",
              "そうですか。{大変|たいへん}ですね",
              "おめでとうございます",
              "よかったですね"
            ],
            "correct": 1,
            "why": "Tin buồn → そうですか。大変ですね. → **A：{田中|たなか}さんのお{父|とう}さんが{亡|な}くなったそうです。B：そうですか。{大変|たいへん}ですね。** 〔A: Tanaka-san no otousan ga nakunatta sou desu. B: sou desu ka. Taihen desu ne.〕 — A: Nghe nói bố của anh Tanaka mất rồi. B: Vậy à. Vất vả cho anh ấy quá."
          },
          {
            "q": "A：{山口|やまぐち}さんが{結婚|けっこん}したそうですよ。B：えっ、＿＿ですか。　〔A: Yamaguchi-san ga kekkon shita sou desu yo. B: e, __ desu ka.〕　— A: Nghe nói chị Yamaguchi kết hôn rồi đấy. B: Hả, thật à?",
            "options": [
              "{中止|ちゅうし}",
              "{無料|むりょう}",
              "{本当|ほんとう}",
              "{心配|しんぱい}"
            ],
            "correct": 2,
            "why": "Ngạc nhiên → 本当ですか. → **A：{山口|やまぐち}さんが{結婚|けっこん}したそうですよ。B：えっ、{本当|ほんとう}ですか。** 〔A: Yamaguchi-san ga kekkon shita sou desu yo. B: e, hontou desu ka.〕 — A: Nghe nói chị Yamaguchi kết hôn rồi đấy. B: Hả, thật à?"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np1-124",
        "title": "ポイント 124: N で (vì N) (10 câu)",
        "items": [
          {
            "q": "{台風|たいふう}＿＿{電車|でんしゃ}が{止|と}まりました。　〔Taifuu __ densha ga tomarimashita.〕　— Vì bão mà tàu điện đã dừng.",
            "options": [
              "に",
              "が",
              "で",
              "を"
            ],
            "correct": 2,
            "why": "Nguyên nhân → **で**. → **{台風|たいふう}で{電車|でんしゃ}が{止|と}まりました。** 〔Taifuu de densha ga tomarimashita.〕 — Vì bão mà tàu điện đã dừng."
          },
          {
            "q": "{地震|じしん}で{古|ふる}いビルが＿＿。　〔Jishin de furui biru ga __.〕　— Vì động đất mà toà nhà cũ bị đổ.",
            "options": [
              "{倒|たお}れましょう",
              "{倒|たお}れました",
              "{倒|たお}れてください",
              "{倒|たお}れたいです"
            ],
            "correct": 1,
            "why": "Vế sau là kết quả đã xảy ra. → **{地震|じしん}で{古|ふる}いビルが{倒|たお}れました。** 〔Jishin de furui biru ga taoremashita.〕 — Vì động đất mà toà nhà cũ bị đổ."
          },
          {
            "q": "＿＿で{学校|がっこう}を{休|やす}みました。　〔__ de gakkou o yasumimashita.〕　— Vì ốm nên tôi đã nghỉ học.",
            "options": [
              "バス",
              "{日本語|にほんご}",
              "{病気|びょうき}",
              "{学校|がっこう}"
            ],
            "correct": 2,
            "why": "Bệnh là nguyên nhân → 病気で. → **{病気|びょうき}で{学校|がっこう}を{休|やす}みました。** 〔Byouki de gakkou o yasumimashita.〕 — Vì ốm nên tôi đã nghỉ học."
          },
          {
            "q": "{強|つよ}い{風|かぜ}で{窓|まど}ガラスが＿＿。　〔Tsuyoi kaze de mado garasu ga __.〕　— Vì gió mạnh mà kính cửa sổ bị vỡ.",
            "options": [
              "{割|わ}れました",
              "{割|わ}りました",
              "{割|わ}れましょう",
              "{割|わ}ってください"
            ],
            "correct": 0,
            "why": "Tự động từ 割れます (kính tự vỡ). → **{強|つよ}い{風|かぜ}で{窓|まど}ガラスが{割|わ}れました。** 〔Tsuyoi kaze de mado garasu ga waremashita.〕 — Vì gió mạnh mà kính cửa sổ bị vỡ."
          },
          {
            "q": "{事故|じこ}でバスが{一時間|いちじかん}＿＿。　〔Jiko de basu ga ichijikan __.〕　— Vì tai nạn mà xe buýt trễ một tiếng.",
            "options": [
              "{遅|おく}れました",
              "{遅|おく}れてください",
              "{遅|おく}れましょう",
              "{遅|おく}れたいです"
            ],
            "correct": 0,
            "why": "Kết quả: xe buýt bị trễ. → **{事故|じこ}でバスが{一時間|いちじかん}{遅|おく}れました。** 〔Jiko de basu ga ichijikan okuremashita.〕 — Vì tai nạn mà xe buýt trễ một tiếng."
          },
          {
            "q": "{大雨|おおあめ}で{花火大会|はなびたいかい}が＿＿になりました。　〔Ooame de hanabitaikai ga __ ni narimashita.〕　— Vì mưa to mà lễ hội pháo hoa bị huỷ.",
            "options": [
              "{無料|むりょう}",
              "{中止|ちゅうし}",
              "{本当|ほんとう}",
              "{最後|さいご}"
            ],
            "correct": 1,
            "why": "Bị huỷ = 中止に なります. → **{大雨|おおあめ}で{花火大会|はなびたいかい}が{中止|ちゅうし}になりました。** 〔Ooame de hanabitaikai ga chuushi ni narimashita.〕 — Vì mưa to mà lễ hội pháo hoa bị huỷ."
          },
          {
            "q": "\"で\" nào là NGUYÊN NHÂN?",
            "options": [
              "{公園|こうえん}でフリーマーケットがあります。 (Kouen de furiimaaketto ga arimasu.)",
              "{日本語|にほんご}でスピーチをしました。 (Nihongo de supiichi o shimashita.)",
              "{雪|ゆき}で{電車|でんしゃ}が{止|と}まりました。 (Yuki de densha ga tomarimashita.)",
              "バスで{会場|かいじょう}へ{行|い}きます。 (Basu de kaijou e ikimasu.)"
            ],
            "correct": 2,
            "why": "雪で = vì tuyết (124); 公園で = nơi chốn; バスで = phương tiện; 日本語で = cách thức."
          },
          {
            "q": "Câu này nghĩa là gì? {地震|じしん}で{電気|でんき}が{消|き}えました。　〔Jishin de denki ga kiemashita.〕",
            "options": [
              "Hãy tắt điện khi có động đất.",
              "Ở chỗ động đất đèn đã tắt.",
              "Động đất bằng điện.",
              "Vì động đất mà điện bị tắt."
            ],
            "correct": 3,
            "why": "N で (nguyên nhân) + 消えました (tự động từ)."
          },
          {
            "q": "{台風|たいふう}で{公園|こうえん}の{木|き}が{倒|たお}れた＿＿。{怖|こわ}いですね。　〔Taifuu de kouen no ki ga taoreta __. Kowai desu ne.〕　— Nghe nói vì bão mà cây ở công viên bị đổ. Đáng sợ nhỉ.",
            "options": [
              "と{思|おも}います",
              "そうです",
              "たら",
              "でも"
            ],
            "correct": 1,
            "why": "124 + 119: N で ～た そうです. → **{台風|たいふう}で{公園|こうえん}の{木|き}が{倒|たお}れたそうです。{怖|こわ}いですね。** 〔Taifuu de kouen no ki ga taoreta sou desu. Kowai desu ne.〕 — Nghe nói vì bão mà cây ở công viên bị đổ. Đáng sợ nhỉ."
          },
          {
            "q": "A：どうして{遅|おく}れましたか。B：すみません。{事故|じこ}＿＿{電車|でんしゃ}が{止|と}まっていました。　〔A: doushite okuremashita ka. B: sumimasen. Jiko __ densha ga tomatte imashita.〕　— A: Sao bạn đến muộn? B: Xin lỗi. Vì có sự cố nên tàu đã dừng.",
            "options": [
              "から",
              "で",
              "を",
              "に"
            ],
            "correct": 1,
            "why": "Giải thích nguyên nhân → 事故で. → **A：どうして{遅|おく}れましたか。B：すみません。{事故|じこ}で{電車|でんしゃ}が{止|と}まっていました。** 〔A: doushite okuremashita ka. B: sumimasen. Jiko de densha ga tomatte imashita.〕 — A: Sao bạn đến muộn? B: Xin lỗi. Vì có sự cố nên tàu đã dừng."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · nghe nói ↔ đoán ↔ ý mình · đáp tin · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b15-np1-dap",
        "title": "Nghe tin — chọn câu đáp hợp (8 câu)",
        "items": [
          {
            "q": "A： {台風|たいふう} で {木|き} が たくさん {倒|たお}れた そう です 。 — B đáp:",
            "options": [
              "いただきます。 (Itadakimasu.)",
              "{本当|ほんとう}ですか。{怖|こわ}いですね。 (Hontou desu ka. Kowai desu ne.)",
              "よかったですね。 (Yokatta desu ne.)",
              "おめでとうございます。 (Omedetou gozaimasu.)"
            ],
            "correct": 1,
            "why": "Tin xấu → 本当ですか。怖いですね."
          },
          {
            "q": "A： {母|はは} が {入院|にゅういん} した そう です 。 — B đáp:",
            "options": [
              "いいですね。{行|い}きましょう。 (Ii desu ne. Ikimashou.)",
              "そうですか。よかったですね。 (Sou desu ka. Yokatta desu ne.)",
              "{楽|たの}しいですね。 (Tanoshii desu ne.)",
              "そうですか。{心配|しんぱい}ですね。 (Sou desu ka. Shinpai desu ne.)"
            ],
            "correct": 3,
            "why": "Tin đáng lo → 心配ですね."
          },
          {
            "q": "A： {日本|にほん} が {勝|か}った そう です よ 。 — B đáp:",
            "options": [
              "{心配|しんぱい}ですね。 (Shinpai desu ne.)",
              "お{大事|だいじ}に。 (Odaijini.)",
              "{本当|ほんとう}ですか。{怖|こわ}いですね。 (Hontou desu ka. Kowai desu ne.)",
              "えっ、{本当|ほんとう}ですか。よかったですね。 (E, hontou desu ka. Yokatta desu ne.)"
            ],
            "correct": 3,
            "why": "Tin vui → よかったですね."
          },
          {
            "q": "A： {新|あたら}しい {店|みせ} が できた そう です よ 。 {一緒|いっしょ} に {行|い}きません か 。 — B đáp:",
            "options": [
              "いいえ、{知|し}っています。 (Iie, shitte imasu.)",
              "{怖|こわ}いですね。 (Kowai desu ne.)",
              "いいですね。{行|い}きましょう。 (Ii desu ne. Ikimashou.)",
              "そうですか。お{大事|だいじ}に。 (Sou desu ka. Odaijini.)"
            ],
            "correct": 2,
            "why": "Được rủ → いいですね。行きましょう."
          },
          {
            "q": "A： この {店|みせ} 、 {今日|きょう} は {全部|ぜんぶ} {無料|むりょう} だ そう です よ 。 — B đáp:",
            "options": [
              "ごちそうさまでした。 (Gochisousama deshita.)",
              "へえ、{知|し}りませんでした。 (Hee, shirimasen deshita.)",
              "{心配|しんぱい}ですね。 (Shinpai desu ne.)",
              "お{大事|だいじ}に。 (Odaijini.)"
            ],
            "correct": 1,
            "why": "Tin lạ → へえ、知りませんでした."
          },
          {
            "q": "Bạn muốn kể tin xem trên thời sự cho bạn. Câu mở đầu tự nhiên:",
            "options": [
              "{大|おお}きい{地震|じしん}でニュースを{見|み}てください。 (Ookii jishin de nyuusu o mite kudasai.)",
              "ニュースを{見|み}ましたか。{大|おお}きい{地震|じしん}があったそうですよ。 (Nyuusu o mimashita ka. Ookii jishin ga atta sou desu yo.)",
              "{大|おお}きい{地震|じしん}があると{思|おも}います。 (Ookii jishin ga aru to omoimasu.)",
              "{大|おお}きい{地震|じしん}があったら、{見|み}ます。 (Ookii jishin ga attara, mimasu.)"
            ],
            "correct": 1,
            "why": "Hỏi bạn đã xem tin chưa + kể bằng ～そうです."
          },
          {
            "q": "Bạn KHÔNG tự thấy, chỉ đọc trong tạp chí rằng quán đó ngon. Câu đúng:",
            "options": [
              "あの{店|みせ}はおいしいだそうです。 (Ano mise wa oishii da sou desu.)",
              "{雑誌|ざっし}で{見|み}ましたが、あの{店|みせ}はおいしいそうです。 (Zasshi de mimashita ga, ano mise wa oishii sou desu.)",
              "あの{店|みせ}はおいしかったです。 (Ano mise wa oishikatta desu.)",
              "あの{店|みせ}はおいしいです。 (Ano mise wa oishii desu.)"
            ],
            "correct": 1,
            "why": "Thông tin từ tạp chí → ～そうです (イA không thêm だ)."
          },
          {
            "q": "Bạn TỰ nghĩ là ngày mai sẽ nắng (không phải nghe ai nói). Câu đúng:",
            "options": [
              "{明日|あした}は{晴|は}れるそうです。 (Ashita wa hareru sou desu.)",
              "{明日|あした}は{晴|は}れてもです。 (Ashita wa harete mo desu.)",
              "{明日|あした}は{晴|は}れると{思|おも}います。 (Ashita wa hareru to omoimasu.)",
              "{明日|あした}は{晴|は}れたらです。 (Ashita wa haretara desu.)"
            ],
            "correct": 2,
            "why": "Ý mình đoán → ～と 思います (ポイント 123); そうです là nghe người khác nói."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np1-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "{昨日|きのう}{雨|あめ}が{降|ふ}ったそうです。 (Kinou ame ga futta sou desu.)",
              "{明日|あした}{雨|あめ}が{降|ふ}りますそうです。 (Ashita ame ga furimasu sou desu.)",
              "{明日|あした}{雨|あめ}が{降|ふ}るそうです。 (Ashita ame ga furu sou desu.)",
              "{明日|あした}は{雨|あめ}だそうです。 (Ashita wa ame da sou desu.)"
            ],
            "correct": 1,
            "why": "Trước そうです dùng **thể thường** (降る), không dùng 降ります."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "この{町|まち}は{静|しず}かそうです。 (Kono machi wa shizuka sou desu.)",
              "この{町|まち}は{古|ふる}いそうです。 (Kono machi wa furui sou desu.)",
              "この{町|まち}は{便利|べんり}だそうです。 (Kono machi wa benri da sou desu.)",
              "この{町|まち}は{静|しず}かだそうです。 (Kono machi wa shizuka da sou desu.)"
            ],
            "correct": 0,
            "why": "ナA + **だ** そうです (静かだそうです). \"静かそうです\" là mẫu khác (trông có vẻ) — chưa học."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "この{本|ほん}は{高|たか}かったそうです。 (Kono hon wa takakatta sou desu.)",
              "この{本|ほん}はおもしろいそうです。 (Kono hon wa omoshiroi sou desu.)",
              "この{本|ほん}は{有名|ゆうめい}だそうです。 (Kono hon wa yuumei da sou desu.)",
              "この{本|ほん}はおもしろいだそうです。 (Kono hon wa omoshiroi da sou desu.)"
            ],
            "correct": 3,
            "why": "イA **không thêm だ**: おもしろいそうです."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{昨日|きのう}、{地震|じしん}があったそうでした。 (Kinou, jishin ga atta sou deshita.)",
              "{明日|あした}、{台風|たいふう}が{来|く}るそうです。 (Ashita, taifuu ga kuru sou desu.)",
              "{昨日|きのう}、{地震|じしん}があったそうです。 (Kinou, jishin ga atta sou desu.)",
              "{昨日|きのう}、{事故|じこ}があったそうです。 (Kinou, jiko ga atta sou desu.)"
            ],
            "correct": 0,
            "why": "そうです **không chia quá khứ**; quá khứ nằm ở あった."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{病気|びょうき}で{入院|にゅういん}しました。 (Byouki de nyuuin shimashita.)",
              "{台風|たいふう}で{電車|でんしゃ}が{止|と}まりました。 (Taifuu de densha ga tomarimashita.)",
              "{事故|じこ}で{道|みち}が{混|こ}んでいます。 (Jiko de michi ga konde imasu.)",
              "{台風|たいふう}に{電車|でんしゃ}が{止|と}まりました。 (Taifuu ni densha ga tomarimashita.)"
            ],
            "correct": 3,
            "why": "Nguyên nhân → **で**, không phải に."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{地震|じしん}でガラスが{割|わ}れました。 (Jishin de garasu ga waremashita.)",
              "{雪|ゆき}でバスが{遅|おく}れました。 (Yuki de basu ga okuremashita.)",
              "{雨|あめ}で{出|で}かけましょう。 (Ame de dekakemashou.)",
              "{雨|あめ}で{試合|しあい}が{中止|ちゅうし}になりました。 (Ame de shiai ga chuushi ni narimashita.)"
            ],
            "correct": 2,
            "why": "N で (nguyên nhân) + kết quả đã xảy ra; không dùng với lời rủ ～ましょう."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{地震|じしん}でビルが{倒|たお}れました。 (Jishin de biru ga taoremashita.)",
              "{地震|じしん}でビルを{倒|たお}れました。 (Jishin de biru o taoremashita.)",
              "{風|かぜ}で{窓|まど}が{閉|し}まりました。 (Kaze de mado ga shimarimashita.)",
              "{台風|たいふう}で{木|き}が{倒|たお}れたそうです。 (Taifuu de ki ga taoreta sou desu.)"
            ],
            "correct": 1,
            "why": "Tự động từ 倒れます đi với **が**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "マルコさんは{来|こ}ないだそうです。 (Maruko-san wa konai da sou desu.)",
              "マルコさんは{来|こ}ないそうです。 (Maruko-san wa konai sou desu.)",
              "マルコさんは{学生|がくせい}だそうです。 (Maruko-san wa gakusei da sou desu.)",
              "マルコさんは{学生|がくせい}じゃないそうです。 (Maruko-san wa gakusei ja nai sou desu.)"
            ],
            "correct": 0,
            "why": "V phủ định thể thường (来ない) + そうです — không thêm だ."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-np1-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "119: 普通形 + そうです (ナA／N + だ) · 124: N で + kết quả",
        "items": [
          {
            "q": "Nghe nói ngày mai trời mưa.",
            "answers": [
              "明日は雨だそうです。",
              "明日はあめだそうです。",
              "あしたは雨だそうです。",
              "あしたはあめだそうです。",
              "明日は雨が降るそうです。",
              "明日は雨がふるそうです。",
              "明日はあめが降るそうです。",
              "明日はあめがふるそうです。",
              "あしたは雨が降るそうです。",
              "あしたは雨がふるそうです。",
              "あしたはあめが降るそうです。",
              "あしたはあめがふるそうです。",
              "明日雨が降るそうです。",
              "明日雨がふるそうです。",
              "明日あめが降るそうです。",
              "明日あめがふるそうです。",
              "あした雨が降るそうです。",
              "あした雨がふるそうです。",
              "あしたあめが降るそうです。",
              "あしたあめがふるそうです。"
            ],
            "hint": "雨だそうです／降るそうです"
          },
          {
            "q": "Nghe nói gần ga mới mở một cửa hàng.",
            "answers": [
              "駅の近くに新しい店ができたそうです。",
              "駅の近くに新しいみせができたそうです。",
              "駅の近くにあたらしい店ができたそうです。",
              "駅の近くにあたらしいみせができたそうです。",
              "駅のちかくに新しい店ができたそうです。",
              "駅のちかくに新しいみせができたそうです。",
              "駅のちかくにあたらしい店ができたそうです。",
              "駅のちかくにあたらしいみせができたそうです。",
              "えきの近くに新しい店ができたそうです。",
              "えきの近くに新しいみせができたそうです。",
              "えきの近くにあたらしい店ができたそうです。",
              "えきの近くにあたらしいみせができたそうです。",
              "えきのちかくに新しい店ができたそうです。",
              "えきのちかくに新しいみせができたそうです。",
              "えきのちかくにあたらしい店ができたそうです。",
              "えきのちかくにあたらしいみせができたそうです。",
              "駅の近くに店ができたそうです。",
              "駅の近くにみせができたそうです。",
              "駅のちかくに店ができたそうです。",
              "駅のちかくにみせができたそうです。",
              "えきの近くに店ができたそうです。",
              "えきの近くにみせができたそうです。",
              "えきのちかくに店ができたそうです。",
              "えきのちかくにみせができたそうです。"
            ],
            "hint": "できた そうです"
          },
          {
            "q": "Vì bão mà tàu điện đã dừng.",
            "answers": [
              "台風で電車が止まりました。",
              "台風で電車がとまりました。",
              "台風ででんしゃが止まりました。",
              "台風ででんしゃがとまりました。",
              "たいふうで電車が止まりました。",
              "たいふうで電車がとまりました。",
              "たいふうででんしゃが止まりました。",
              "たいふうででんしゃがとまりました。"
            ],
            "hint": "台風で"
          },
          {
            "q": "Vì động đất mà toà nhà đã đổ.",
            "answers": [
              "地震でビルが倒れました。",
              "地震でビルがたおれました。",
              "じしんでビルが倒れました。",
              "じしんでビルがたおれました。"
            ],
            "hint": "地震で"
          },
          {
            "q": "Nghe nói bảo tàng miễn phí.",
            "answers": [
              "美術館は無料だそうです。",
              "美術館はむりょうだそうです。",
              "びじゅつかんは無料だそうです。",
              "びじゅつかんはむりょうだそうです。"
            ],
            "hint": "無料だ そうです"
          },
          {
            "q": "Thật à? Đáng sợ nhỉ.",
            "answers": [
              "本当ですか。怖いですね。",
              "本当ですか。こわいですね。",
              "ほんとうですか。怖いですね。",
              "ほんとうですか。こわいですね。"
            ],
            "hint": "本当ですか"
          },
          {
            "q": "Vì ốm nên tôi đã nghỉ học.",
            "answers": [
              "病気で学校を休みました。",
              "病気で学校をやすみました。",
              "病気でがっこうを休みました。",
              "病気でがっこうをやすみました。",
              "びょうきで学校を休みました。",
              "びょうきで学校をやすみました。",
              "びょうきでがっこうを休みました。",
              "びょうきでがっこうをやすみました。"
            ],
            "hint": "病気で"
          },
          {
            "q": "Nghe nói Carlos không đến.",
            "answers": [
              "カルロスさんは来ないそうです。",
              "カルロスさんはこないそうです。"
            ],
            "hint": "来ない そうです"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-np1-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Nghe nói thứ Bảy ở công viên có chợ đồ cũ.",
            "chips": [
              "フリーマーケットがあります",
              "{公園|こうえん}で",
              "フリーマーケットがある",
              "{土曜日|どようび}、",
              "そうです"
            ],
            "answer": [
              "{土曜日|どようび}、",
              "{公園|こうえん}で",
              "フリーマーケットがある",
              "そうです"
            ],
            "ro": "Doyoubi, kouen de furiimaaketto ga aru sou desu"
          },
          {
            "vi": "Nghe nói vì tai nạn mà tàu điện đã dừng.",
            "chips": [
              "{電車|でんしゃ}が",
              "そうです",
              "{止|と}まった",
              "{事故|じこ}で",
              "{事故|じこ}に"
            ],
            "answer": [
              "{事故|じこ}で",
              "{電車|でんしゃ}が",
              "{止|と}まった",
              "そうです"
            ],
            "ro": "Jiko de densha ga tomatta sou desu"
          },
          {
            "vi": "Nghe nói tháng sau chị Kimura kết hôn.",
            "chips": [
              "{木村|きむら}さんは",
              "{来月|らいげつ}、",
              "{結婚|けっこん}する",
              "そうです",
              "{結婚|けっこん}します"
            ],
            "answer": [
              "{来月|らいげつ}、",
              "{木村|きむら}さんは",
              "{結婚|けっこん}する",
              "そうです"
            ],
            "ro": "Raigetsu, Kimura-san wa kekkon suru sou desu"
          },
          {
            "vi": "Vì gió mạnh mà kính cửa sổ đã vỡ.",
            "chips": [
              "{窓|まど}ガラスが",
              "{割|わ}れました",
              "{強|つよ}い{風|かぜ}で",
              "{窓|まど}ガラスを"
            ],
            "answer": [
              "{強|つよ}い{風|かぜ}で",
              "{窓|まど}ガラスが",
              "{割|わ}れました"
            ],
            "ro": "Tsuyoi kaze de mado garasu ga waremashita"
          },
          {
            "vi": "Nghe nói buổi hoà nhạc bị huỷ.",
            "chips": [
              "コンサートは",
              "{中止|ちゅうし}な",
              "そうです",
              "{中止|ちゅうし}だ"
            ],
            "answer": [
              "コンサートは",
              "{中止|ちゅうし}だ",
              "そうです"
            ],
            "ro": "Konsaato wa chuushi da sou desu"
          },
          {
            "vi": "Tôi xem thời sự, nghe nói có động đất lớn.",
            "chips": [
              "{大|おお}きい{地震|じしん}が",
              "あったと{思|おも}います",
              "あったそうです",
              "ニュースで{見|み}ましたが、"
            ],
            "answer": [
              "ニュースで{見|み}ましたが、",
              "{大|おお}きい{地震|じしん}が",
              "あったそうです"
            ],
            "ro": "Nyuusu de mimashita ga, ookii jishin ga atta sou desu"
          },
          {
            "vi": "Vì tuyết nên xe buýt bị trễ.",
            "chips": [
              "{雪|ゆき}で",
              "{遅|おく}れましょう",
              "{遅|おく}れました",
              "バスが"
            ],
            "answer": [
              "{雪|ゆき}で",
              "バスが",
              "{遅|おく}れました"
            ],
            "ro": "Yuki de basu ga okuremashita"
          },
          {
            "vi": "Nghe nói bánh quán đó ngon.",
            "chips": [
              "そうです",
              "あの{店|みせ}のケーキは",
              "おいしい",
              "おいしいだ"
            ],
            "answer": [
              "あの{店|みせ}のケーキは",
              "おいしい",
              "そうです"
            ],
            "ro": "Ano mise no keeki wa oishii sou desu"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch · nhiều ô trống · tình huống \"kể tin cho bạn\""
      },
      {
        "t": "quiz",
        "id": "lt-b15-np1-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "119 · 124",
        "items": [
          {
            "q": "Nghe nói tối qua ở Kyushu có động đất lớn.",
            "answers": [
              "昨日の夜、九州で大きい地震があったそうです。",
              "昨日の夜、九州で大きいじしんがあったそうです。",
              "昨日の夜、九州でおおきい地震があったそうです。",
              "昨日の夜、九州でおおきいじしんがあったそうです。",
              "昨日の夜、きゅうしゅうで大きい地震があったそうです。",
              "昨日の夜、きゅうしゅうで大きいじしんがあったそうです。",
              "昨日の夜、きゅうしゅうでおおきい地震があったそうです。",
              "昨日の夜、きゅうしゅうでおおきいじしんがあったそうです。",
              "昨日のよる、九州で大きい地震があったそうです。",
              "昨日のよる、九州で大きいじしんがあったそうです。",
              "昨日のよる、九州でおおきい地震があったそうです。",
              "昨日のよる、九州でおおきいじしんがあったそうです。",
              "昨日のよる、きゅうしゅうで大きい地震があったそうです。",
              "昨日のよる、きゅうしゅうで大きいじしんがあったそうです。",
              "昨日のよる、きゅうしゅうでおおきい地震があったそうです。",
              "昨日のよる、きゅうしゅうでおおきいじしんがあったそうです。",
              "きのうの夜、九州で大きい地震があったそうです。",
              "きのうの夜、九州で大きいじしんがあったそうです。",
              "きのうの夜、九州でおおきい地震があったそうです。",
              "きのうの夜、九州でおおきいじしんがあったそうです。",
              "きのうの夜、きゅうしゅうで大きい地震があったそうです。",
              "きのうの夜、きゅうしゅうで大きいじしんがあったそうです。",
              "きのうの夜、きゅうしゅうでおおきい地震があったそうです。",
              "きのうの夜、きゅうしゅうでおおきいじしんがあったそうです。",
              "きのうのよる、九州で大きい地震があったそうです。",
              "きのうのよる、九州で大きいじしんがあったそうです。",
              "きのうのよる、九州でおおきい地震があったそうです。",
              "きのうのよる、九州でおおきいじしんがあったそうです。",
              "きのうのよる、きゅうしゅうで大きい地震があったそうです。",
              "きのうのよる、きゅうしゅうで大きいじしんがあったそうです。",
              "きのうのよる、きゅうしゅうでおおきい地震があったそうです。",
              "きのうのよる、きゅうしゅうでおおきいじしんがあったそうです。",
              "昨日の夜九州で大きい地震があったそうです。",
              "昨日の夜九州で大きいじしんがあったそうです。",
              "昨日の夜九州でおおきい地震があったそうです。",
              "昨日の夜九州でおおきいじしんがあったそうです。",
              "昨日の夜きゅうしゅうで大きい地震があったそうです。",
              "昨日の夜きゅうしゅうで大きいじしんがあったそうです。",
              "昨日の夜きゅうしゅうでおおきい地震があったそうです。",
              "昨日の夜きゅうしゅうでおおきいじしんがあったそうです。",
              "昨日のよる九州で大きい地震があったそうです。",
              "昨日のよる九州で大きいじしんがあったそうです。",
              "昨日のよる九州でおおきい地震があったそうです。",
              "昨日のよる九州でおおきいじしんがあったそうです。",
              "昨日のよるきゅうしゅうで大きい地震があったそうです。",
              "昨日のよるきゅうしゅうで大きいじしんがあったそうです。",
              "昨日のよるきゅうしゅうでおおきい地震があったそうです。",
              "昨日のよるきゅうしゅうでおおきいじしんがあったそうです。",
              "きのうの夜九州で大きい地震があったそうです。",
              "きのうの夜九州で大きいじしんがあったそうです。",
              "きのうの夜九州でおおきい地震があったそうです。",
              "きのうの夜九州でおおきいじしんがあったそうです。",
              "きのうの夜きゅうしゅうで大きい地震があったそうです。",
              "きのうの夜きゅうしゅうで大きいじしんがあったそうです。",
              "きのうの夜きゅうしゅうでおおきい地震があったそうです。",
              "きのうの夜きゅうしゅうでおおきいじしんがあったそうです。",
              "きのうのよる九州で大きい地震があったそうです。",
              "きのうのよる九州で大きいじしんがあったそうです。",
              "きのうのよる九州でおおきい地震があったそうです。",
              "きのうのよる九州でおおきいじしんがあったそうです。",
              "きのうのよるきゅうしゅうで大きい地震があったそうです。",
              "きのうのよるきゅうしゅうで大きいじしんがあったそうです。",
              "きのうのよるきゅうしゅうでおおきい地震があったそうです。",
              "きのうのよるきゅうしゅうでおおきいじしんがあったそうです。"
            ],
            "hint": "あった そうです"
          },
          {
            "q": "Nghe nói vì động đất mà nhiều kính cửa sổ bị vỡ.",
            "answers": [
              "地震で窓ガラスがたくさん割れたそうです。",
              "地震で窓ガラスがたくさんわれたそうです。",
              "地震でまどガラスがたくさん割れたそうです。",
              "地震でまどガラスがたくさんわれたそうです。",
              "じしんで窓ガラスがたくさん割れたそうです。",
              "じしんで窓ガラスがたくさんわれたそうです。",
              "じしんでまどガラスがたくさん割れたそうです。",
              "じしんでまどガラスがたくさんわれたそうです。"
            ],
            "hint": "地震で … 割れた そうです"
          },
          {
            "q": "Nghe nói không có ai thiệt mạng.",
            "answers": [
              "亡くなった人はいないそうです。",
              "亡くなったひとはいないそうです。",
              "なくなった人はいないそうです。",
              "なくなったひとはいないそうです。",
              "死んだ人はいないそうです。",
              "死んだひとはいないそうです。",
              "しんだ人はいないそうです。",
              "しんだひとはいないそうです。"
            ],
            "hint": "いない そうです"
          },
          {
            "q": "Vì bão nên trận đấu bị huỷ.",
            "answers": [
              "台風で試合が中止になりました。",
              "台風で試合がちゅうしになりました。",
              "台風でしあいが中止になりました。",
              "台風でしあいがちゅうしになりました。",
              "たいふうで試合が中止になりました。",
              "たいふうで試合がちゅうしになりました。",
              "たいふうでしあいが中止になりました。",
              "たいふうでしあいがちゅうしになりました。",
              "台風で試合は中止になりました。",
              "台風で試合はちゅうしになりました。",
              "台風でしあいは中止になりました。",
              "台風でしあいはちゅうしになりました。",
              "たいふうで試合は中止になりました。",
              "たいふうで試合はちゅうしになりました。",
              "たいふうでしあいは中止になりました。",
              "たいふうでしあいはちゅうしになりました。"
            ],
            "hint": "中止に なりました"
          },
          {
            "q": "Nghe nói đội Nhật đã thắng Brazil.",
            "answers": [
              "日本のチームがブラジルに勝ったそうです。",
              "日本のチームがブラジルにかったそうです。",
              "にほんのチームがブラジルに勝ったそうです。",
              "にほんのチームがブラジルにかったそうです。",
              "日本のチームはブラジルに勝ったそうです。",
              "日本のチームはブラジルにかったそうです。",
              "にほんのチームはブラジルに勝ったそうです。",
              "にほんのチームはブラジルにかったそうです。"
            ],
            "hint": "に 勝った そうです"
          },
          {
            "q": "Nghe nói từ tháng sau quán đó giảm 10%.",
            "answers": [
              "来月から、あの店は十パーセント引きだそうです。",
              "来月から、あの店は十パーセントびきだそうです。",
              "来月から、あの店はじゅっパーセント引きだそうです。",
              "来月から、あの店はじゅっパーセントびきだそうです。",
              "来月から、あのみせは十パーセント引きだそうです。",
              "来月から、あのみせは十パーセントびきだそうです。",
              "来月から、あのみせはじゅっパーセント引きだそうです。",
              "来月から、あのみせはじゅっパーセントびきだそうです。",
              "らいげつから、あの店は十パーセント引きだそうです。",
              "らいげつから、あの店は十パーセントびきだそうです。",
              "らいげつから、あの店はじゅっパーセント引きだそうです。",
              "らいげつから、あの店はじゅっパーセントびきだそうです。",
              "らいげつから、あのみせは十パーセント引きだそうです。",
              "らいげつから、あのみせは十パーセントびきだそうです。",
              "らいげつから、あのみせはじゅっパーセント引きだそうです。",
              "らいげつから、あのみせはじゅっパーセントびきだそうです。"
            ],
            "hint": "パーセント引きだ そうです"
          },
          {
            "q": "Xin lỗi, vì tai nạn mà tàu đã dừng.",
            "answers": [
              "すみません。事故で電車が止まりました。",
              "すみません。事故で電車がとまりました。",
              "すみません。事故ででんしゃが止まりました。",
              "すみません。事故ででんしゃがとまりました。",
              "すみません。じこで電車が止まりました。",
              "すみません。じこで電車がとまりました。",
              "すみません。じこででんしゃが止まりました。",
              "すみません。じこででんしゃがとまりました。",
              "すみません。事故で電車が止まっていました。",
              "すみません。事故で電車がとまっていました。",
              "すみません。事故ででんしゃが止まっていました。",
              "すみません。事故ででんしゃがとまっていました。",
              "すみません。じこで電車が止まっていました。",
              "すみません。じこで電車がとまっていました。",
              "すみません。じこででんしゃが止まっていました。",
              "すみません。じこででんしゃがとまっていました。"
            ],
            "hint": "事故で"
          },
          {
            "q": "Nghe nói chị Wang đang nằm viện. Lo nhỉ.",
            "answers": [
              "ワンさんは入院しているそうです。心配ですね。",
              "ワンさんは入院しているそうです。しんぱいですね。",
              "ワンさんはにゅういんしているそうです。心配ですね。",
              "ワンさんはにゅういんしているそうです。しんぱいですね。"
            ],
            "hint": "して いる そうです"
          },
          {
            "q": "Nghe nói ngày xưa ở đây là công viên.",
            "answers": [
              "昔、ここは公園だったそうです。",
              "昔、ここはこうえんだったそうです。",
              "むかし、ここは公園だったそうです。",
              "むかし、ここはこうえんだったそうです。"
            ],
            "hint": "だった そうです"
          },
          {
            "q": "Bạn xem thời sự sáng nay chưa?",
            "answers": [
              "今朝のニュースを見ましたか。",
              "今朝のニュースをみましたか。",
              "けさのニュースを見ましたか。",
              "けさのニュースをみましたか。"
            ],
            "hint": "ニュースを 見ましたか"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np1-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{台風|たいふう}（①）{木|き}が{倒|たお}れた（②）。　〔Taifuu ((1)) ki ga taoreta ((2)).〕　— Nghe nói vì bão mà cây bị đổ.",
            "options": [
              "①を②そうでした",
              "①で②と{思|おも}います",
              "①に②そうです",
              "①で②そうです"
            ],
            "correct": 3,
            "why": "Nguyên nhân で; nghe nói そうです. → **{台風|たいふう}で{木|き}が{倒|たお}れたそうです。** 〔Taifuu de ki ga taoreta sou desu.〕 — Nghe nói vì bão mà cây bị đổ."
          },
          {
            "q": "{明日|あした}の{大会|たいかい}は（①）そうです。{雨|あめ}（②）から。　〔Ashita no taikai wa ((1)) sou desu. Ame ((2)) kara.〕　— Nghe nói đại hội ngày mai bị huỷ. Vì trời mưa.",
            "options": [
              "①{中止|ちゅうし}です②で",
              "①{中止|ちゅうし}②だ",
              "①{中止|ちゅうし}な②です",
              "①{中止|ちゅうし}だ②です"
            ],
            "correct": 3,
            "why": "N + だそうです; 雨ですから. → **{明日|あした}の{大会|たいかい}は{中止|ちゅうし}だそうです。{雨|あめ}ですから。** 〔Ashita no taikai wa chuushi da sou desu. Ame desu kara.〕 — Nghe nói đại hội ngày mai bị huỷ. Vì trời mưa."
          },
          {
            "q": "ニュースで（①）が、{事故|じこ}（②）{電車|でんしゃ}が{止|と}まっているそうです。　〔Nyuusu de ((1)) ga, jiko ((2)) densha ga tomatte iru sou desu.〕　— Tôi xem trên thời sự, nghe nói vì tai nạn mà tàu đang dừng.",
            "options": [
              "①{見|み}ました②で",
              "①{見|み}ます②に",
              "①{見|み}ました②を",
              "①{見|み}て②が"
            ],
            "correct": 0,
            "why": "Nguồn tin: 見ましたが; nguyên nhân で. → **ニュースで{見|み}ましたが、{事故|じこ}で{電車|でんしゃ}が{止|と}まっているそうです。** 〔Nyuusu de mimashita ga, jiko de densha ga tomatte iru sou desu.〕 — Tôi xem trên thời sự, nghe nói vì tai nạn mà tàu đang dừng."
          },
          {
            "q": "A：{田中|たなか}さんが{入院|にゅういん}したそうです。B：（①）ですか。（②）ですね。　〔A: Tanaka-san ga nyuuin shita sou desu. B: ((1)) desu ka. ((2)) desu ne.〕　— A: Nghe nói anh Tanaka nhập viện. B: Thật à? Lo nhỉ.",
            "options": [
              "①{本当|ほんとう}②よかった",
              "①{本当|ほんとう}②{心配|しんぱい}",
              "①{無料|むりょう}②{心配|しんぱい}",
              "①{中止|ちゅうし}②{楽|たの}しい"
            ],
            "correct": 1,
            "why": "Ngạc nhiên + lo lắng. → **A：{田中|たなか}さんが{入院|にゅういん}したそうです。B：{本当|ほんとう}ですか。{心配|しんぱい}ですね。** 〔A: Tanaka-san ga nyuuin shita sou desu. B: hontou desu ka. Shinpai desu ne.〕 — A: Nghe nói anh Tanaka nhập viện. B: Thật à? Lo nhỉ."
          },
          {
            "q": "{昨日|きのう}の{試合|しあい}は{日本|にほん}が（①）そうです。ブラジルのチームはとても（②）そうです。　〔Kinou no shiai wa Nihon ga ((1)) sou desu. Burajiru no chiimu wa totemo ((2)) sou desu.〕　— Nghe nói trận hôm qua Nhật thắng. Nghe nói đội Brazil rất mạnh.",
            "options": [
              "①{勝|か}った②{強|つよ}かった",
              "①{勝|か}ちました②{強|つよ}かった",
              "①{勝|か}つだ②{強|つよ}い",
              "①{勝|か}った②{強|つよ}かっただ"
            ],
            "correct": 0,
            "why": "Thể thường quá khứ + そうです; イA không thêm だ. → **{昨日|きのう}の{試合|しあい}は{日本|にほん}が{勝|か}ったそうです。ブラジルのチームはとても{強|つよ}かったそうです。** 〔Kinou no shiai wa Nihon ga katta sou desu. Burajiru no chiimu wa totemo tsuyokatta sou desu.〕 — Nghe nói trận hôm qua Nhật thắng. Nghe nói đội Brazil rất mạnh."
          },
          {
            "q": "{地震|じしん}（①）{電気|でんき}が（②）。　〔Jishin ((1)) denki ga ((2)).〕　— Vì động đất mà điện bị tắt.",
            "options": [
              "①で②{消|け}しました",
              "①を②{消|け}しました",
              "①に②{消|き}えました",
              "①で②{消|き}えました"
            ],
            "correct": 3,
            "why": "Nguyên nhân で; đèn tự tắt → 消えました. → **{地震|じしん}で{電気|でんき}が{消|き}えました。** 〔Jishin de denki ga kiemashita.〕 — Vì động đất mà điện bị tắt."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np1-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Bạn đọc tạp chí thấy cuối tuần có chợ đồ cũ, muốn kể và rủ bạn.",
            "options": [
              "{週末|しゅうまつ}、フリーマーケットがあったら、{行|い}きました。 (Shuumatsu, furiimaaketto ga attara, ikimashita.)",
              "{週末|しゅうまつ}、フリーマーケットで{行|い}きましょう。 (Shuumatsu, furiimaaketto de ikimashou.)",
              "{週末|しゅうまつ}、{公園|こうえん}でフリーマーケットがありますと{思|おも}います。 (Shuumatsu, kouen de furiimaaketto ga arimasu to omoimasu.)",
              "{週末|しゅうまつ}、{公園|こうえん}でフリーマーケットがあるそうですよ。{一緒|いっしょ}に{行|い}きませんか。 (Shuumatsu, kouen de furiimaaketto ga aru sou desu yo. Issho ni ikimasen ka.)"
            ],
            "correct": 3,
            "why": "Kể tin ～そうです + rủ ～ませんか."
          },
          {
            "q": "Bạn đến lớp muộn vì tàu dừng do tai nạn. Bạn xin lỗi thầy.",
            "options": [
              "すみません。{事故|じこ}で{電車|でんしゃ}が{止|と}まっていました。 (Sumimasen. Jiko de densha ga tomatte imashita.)",
              "すみません。{事故|じこ}だそうです。 (Sumimasen. Jiko da sou desu.)",
              "すみません。{電車|でんしゃ}が{止|と}まったら、{遅|おく}れます。 (Sumimasen. Densha ga tomattara, okuremasu.)",
              "すみません。{事故|じこ}に{電車|でんしゃ}を{止|と}めました。 (Sumimasen. Jiko ni densha o tomemashita.)"
            ],
            "correct": 0,
            "why": "Giải thích nguyên nhân: 事故で ～ました／ていました."
          },
          {
            "q": "Bạn nghe tin bạn mình bị thương và nhập viện.",
            "options": [
              "えっ、いただきます。 (E, itadakimasu.)",
              "えっ、よかったですね。 (E, yokatta desu ne.)",
              "えっ、おめでとうございます。 (E, omedetou gozaimasu.)",
              "えっ、{本当|ほんとう}ですか。{心配|しんぱい}ですね。 (E, hontou desu ka. Shinpai desu ne.)"
            ],
            "correct": 3,
            "why": "Tin đáng lo → 本当ですか。心配ですね."
          },
          {
            "q": "Bạn xem dự báo thời tiết: mai trời nắng. Bạn kể cho bạn.",
            "options": [
              "{天気予報|てんきよほう}は{晴|は}れるだそうです。 (Tenkiyohou wa hareru da sou desu.)",
              "{天気予報|てんきよほう}で、{明日|あした}は{晴|は}れたらです。 (Tenkiyohou de, ashita wa haretara desu.)",
              "{天気予報|てんきよほう}で{見|み}ましたが、{明日|あした}は{晴|は}れるそうですよ。 (Tenkiyohou de mimashita ga, ashita wa hareru sou desu yo.)",
              "{天気予報|てんきよほう}で{見|み}ましたが、{明日|あした}は{晴|は}れますそうですよ。 (Tenkiyohou de mimashita ga, ashita wa haremasu sou desu yo.)"
            ],
            "correct": 2,
            "why": "Nguồn tin + 晴れる そうです."
          },
          {
            "q": "Bạn kể tin: thần tượng của bạn mình đã kết hôn.",
            "options": [
              "ねえ、ケンが{結婚|けっこん}しましたそうです。 (Nee, ken ga kekkon shimashita sou desu.)",
              "ねえ、ケンで{結婚|けっこん}しました。 (Nee, ken de kekkon shimashita.)",
              "ねえ、{知|し}ってる？ケンが{結婚|けっこん}したそうだよ。 (Nee, shitteru? Ken ga kekkon shita sou da yo.)",
              "ねえ、ケンが{結婚|けっこん}したら、いい？ (Nee, ken ga kekkon shitara, ii?)"
            ],
            "correct": 2,
            "why": "Với bạn thân: これ／～、知ってる？ + ～そうだよ (thể thường của そうです)."
          },
          {
            "q": "Bạn giải thích vì sao trường nghỉ hôm nay.",
            "options": [
              "{台風|たいふう}に{学校|がっこう}を{休|やす}みましょう。 (Taifuu ni gakkou o yasumimashou.)",
              "{台風|たいふう}で{学校|がっこう}が{休|やす}みになりました。 (Taifuu de gakkou ga yasumi ni narimashita.)",
              "{台風|たいふう}でも、{学校|がっこう}が{休|やす}みになりました。 (Taifuu demo, gakkou ga yasumi ni narimashita.)",
              "{台風|たいふう}だったら、{学校|がっこう}が{休|やす}みました。 (Taifuu dattara, gakkou ga yasumimashita.)"
            ],
            "correct": 1,
            "why": "台風で (nguyên nhân) + kết quả."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**普通形 + そうです** = nghe nói (V／イA thể thường · ナA／N + だ); thì nằm ở phần trước (来る／来た／来ない), そうです không đổi. Nói nguồn: ニュースで／天気予報で／雑誌で 見ましたが、～そうです.",
          "**N で + kết quả** = vì N (台風で · 地震で · 事故で · 病気で · 雪で). Vế sau thường là tự động từ (止まる · 倒れる · 割れる · 消える) hoặc ～に なりました. Đáp tin: 本当ですか · 怖いですね · 心配ですね · よかったですね."
        ]
      }
    ]
  },
  {
    "id": "lt-b15-np-2",
    "kind": "homework",
    "title": "Luyện thêm Bài 15 · Ngữ pháp 2 (ポイント 120, 121, 123) — 雑誌を見て町へ: ～たら (nếu) · ～ても (dù) · きっと／たぶん ～と思います (đoán) (~90 câu)",
    "goal": "Vừa xem thông tin trong tạp chí vừa bàn kế hoạch với bạn: đặt điều kiện bằng ～たら (時間が あったら · 晴れたら · 雨だったら · よかったら · もし～たら), nói \"dù … vẫn\" bằng ～ても (雨が 降って も · 高くて も · 雨でも), đoán bằng きっと／たぶん ～と思います (きっと 混んでいると 思います · たぶん 間に合わないと 思います).",
    "minutes": 85,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**ポイント 120 — ～たら、___** = nếu … thì …: 時間が あった**ら**、一緒に 行きません か · 雨**だったら**、中止です. Vế sau dùng được **mọi kiểu câu**: rủ (～ませんか), đề nghị (～ましょう), nhờ (～てください), mong muốn (～たいです) — khác ～と (Bài 14) không dùng được. **もし** nhấn mạnh giả định: **もし** 雨が 降ったら….",
          "**ポイント 121 — ～ても、___** = dù … cũng / vẫn …: 雨が 降って**も**、試合は あります · 高く**ても**、買いたいです · 雨**でも**、行きます. Vế sau là điều **trái với dự đoán** từ vế trước. Đối nghĩa với たら: 雨が 降っ**たら**、行きません ↔ 雨が 降っ**ても**、行きます.",
          "**ポイント 123 — 普通形 + と思います** (đoán việc chưa biết chắc): **きっと** (gần như chắc chắn) · **たぶん** (có lẽ). Bài 14 dùng と思います để nêu **ý kiến**; Bài 15 dùng để **đoán**: きっと 混んでいる**と 思います** · たぶん 来ない**と 思います**. ナA／N giữ **だ**: 無料**だ**と 思います."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**(もし) V た／イA かった／ナA・N だった + ら、～** (120).",
          "**V て／イA くて／ナA・N で + も、～** (121).",
          "**きっと／たぶん + 普通形 (ナA・N + だ) + と 思います** (123)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng ポイント một"
      },
      {
        "t": "mcq",
        "id": "lt-b15-np2-120",
        "title": "ポイント 120: ～たら、___ (12 câu)",
        "items": [
          {
            "q": "{時間|じかん}が＿＿、{一緒|いっしょ}に{行|い}きませんか。　〔Jikan ga __, issho ni ikimasen ka.〕　— Nếu có thời gian thì đi cùng không?",
            "options": [
              "あったら",
              "ありたら",
              "あるたら",
              "あっても"
            ],
            "correct": 0,
            "why": "Nếu có → ある → **あったら**. → **{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。** 〔Jikan ga attara, issho ni ikimasen ka.〕 — Nếu có thời gian thì đi cùng không?"
          },
          {
            "q": "{明日|あした}＿＿、{海|うみ}で{泳|およ}ぎましょう。　〔Ashita __, umi de oyogimashou.〕　— Nếu mai trời nắng thì bơi ở biển nhé.",
            "options": [
              "{晴|は}れて",
              "{晴|は}れても",
              "{晴|は}れると",
              "{晴|は}れたら"
            ],
            "correct": 3,
            "why": "Nếu nắng → 晴れたら; vế sau rủ ～ましょう (と không dùng được). → **{明日|あした}{晴|は}れたら、{海|うみ}で{泳|およ}ぎましょう。** 〔Ashita haretara, umi de oyogimashou.〕 — Nếu mai trời nắng thì bơi ở biển nhé."
          },
          {
            "q": "{雨|あめ}＿＿、{花火大会|はなびたいかい}は{中止|ちゅうし}です。　〔Ame __, hanabitaikai wa chuushi desu.〕　— Nếu mưa thì lễ hội pháo hoa bị huỷ.",
            "options": [
              "でも",
              "かったら",
              "だったら",
              "たら"
            ],
            "correct": 2,
            "why": "N + **だったら**. → **{雨|あめ}だったら、{花火大会|はなびたいかい}は{中止|ちゅうし}です。** 〔Ame dattara, hanabitaikai wa chuushi desu.〕 — Nếu mưa thì lễ hội pháo hoa bị huỷ."
          },
          {
            "q": "＿＿、このストラップ、どうぞ。　〔__, kono sutorappu, douzo.〕　— Nếu bạn thích thì tặng bạn cái dây đeo này.",
            "options": [
              "よくても",
              "よかったら",
              "いいだったら",
              "いかったら"
            ],
            "correct": 1,
            "why": "Mời lịch sự: **よかったら** (nếu được thì…). → **よかったら、このストラップ、どうぞ。** 〔Yokattara, kono sutorappu, douzo.〕 — Nếu bạn thích thì tặng bạn cái dây đeo này."
          },
          {
            "q": "{安|やす}＿＿、{買|か}いたいです。　〔Yasu__, kaitai desu.〕　— Nếu rẻ thì tôi muốn mua.",
            "options": [
              "いたら",
              "くても",
              "かったら",
              "いだったら"
            ],
            "correct": 2,
            "why": "イA: 安い → 安**かったら**. → **{安|やす}かったら、{買|か}いたいです。** 〔Yasukattara, kaitai desu.〕 — Nếu rẻ thì tôi muốn mua."
          },
          {
            "q": "＿＿{電車|でんしゃ}に{間|ま}に{合|あ}わなかったら、タクシーで{行|い}きます。　〔__ densha ni maniawanakattara, takushii de ikimasu.〕　— Nếu không kịp tàu thì tôi đi taxi.",
            "options": [
              "なんと",
              "たぶん",
              "もし",
              "きっと"
            ],
            "correct": 2,
            "why": "Giả định \"nếu\" → **もし** ～たら. → **もし{電車|でんしゃ}に{間|ま}に{合|あ}わなかったら、タクシーで{行|い}きます。** 〔Moshi densha ni maniawanakattara, takushii de ikimasu.〕 — Nếu không kịp tàu thì tôi đi taxi."
          },
          {
            "q": "{駅|えき}に＿＿、{電話|でんわ}してください。　〔Eki ni __, denwa shite kudasai.〕　— Đến ga thì gọi điện cho tôi nhé.",
            "options": [
              "{着|つ}きたら",
              "{着|つ}くと",
              "{着|つ}いても",
              "{着|つ}いたら"
            ],
            "correct": 3,
            "why": "Vế sau nhờ ～てください → dùng たら: 着いた + ら. → **{駅|えき}に{着|つ}いたら、{電話|でんわ}してください。** 〔Eki ni tsuitara, denwa shite kudasai.〕 — Đến ga thì gọi điện cho tôi nhé."
          },
          {
            "q": "{暇|ひま}＿＿、{手伝|てつだ}ってください。　〔Hima __, tetsudatte kudasai.〕　— Nếu rảnh thì giúp tôi với.",
            "options": [
              "たら",
              "でも",
              "だったら",
              "かったら"
            ],
            "correct": 2,
            "why": "ナA: 暇**だったら**. → **{暇|ひま}だったら、{手伝|てつだ}ってください。** 〔Hima dattara, tetsudatte kudasai.〕 — Nếu rảnh thì giúp tôi với."
          },
          {
            "q": "Câu này nghĩa là gì? お{金|かね}があったら、{外国|がいこく}を{旅行|りょこう}したいです。　〔Okane ga attara, gaikoku o ryokou shitai desu.〕",
            "options": [
              "Dù có tiền tôi cũng không muốn du lịch.",
              "Nếu có tiền thì tôi muốn đi du lịch nước ngoài.",
              "Vì có tiền nên tôi đã đi du lịch.",
              "Nghe nói có tiền thì đi du lịch được."
            ],
            "correct": 1,
            "why": "～たら + ～たいです (mong muốn)."
          },
          {
            "q": "Câu nào dùng ĐÚNG?",
            "options": [
              "{雨|あめ}が{降|ふ}ると、{家|うち}で{映画|えいが}を{見|み}ましょう。 (Ame ga furu to, uchi de eiga o mimashou.)",
              "{雨|あめ}が{降|ふ}ったら、{家|うち}で{映画|えいが}を{見|み}ましょう。 (Ame ga futtara, uchi de eiga o mimashou.)",
              "{雨|あめ}が{降|ふ}りたら、{家|うち}で{映画|えいが}を{見|み}ましょう。 (Ame ga furitara, uchi de eiga o mimashou.)",
              "{雨|あめ}が{降|ふ}るたら、{家|うち}で{映画|えいが}を{見|み}ましょう。 (Ame ga furutara, uchi de eiga o mimashou.)"
            ],
            "correct": 1,
            "why": "Vế sau rủ ～ましょう → dùng **たら** (không dùng と)."
          },
          {
            "q": "{子|こ}ども＿＿、{入場料|にゅうじょうりょう}は{無料|むりょう}です。　〔Kodomo __, nyuujouryou wa muryou desu.〕　— Nếu là trẻ em thì phí vào cửa miễn phí.",
            "options": [
              "かったら",
              "だったら",
              "ならたら",
              "でも"
            ],
            "correct": 1,
            "why": "N + だったら. → **{子|こ}どもだったら、{入場料|にゅうじょうりょう}は{無料|むりょう}です。** 〔Kodomo dattara, nyuujouryou wa muryou desu.〕 — Nếu là trẻ em thì phí vào cửa miễn phí."
          },
          {
            "q": "{二十|にじゅっ}パーセント{引|び}き＿＿、{買|か}いたいです。　〔Niju paasento biki __, kaitai desu.〕　— Nếu giảm 20% thì tôi muốn mua.",
            "options": [
              "かったら",
              "たら",
              "だったら",
              "でも"
            ],
            "correct": 2,
            "why": "N (〜引き) + だったら. → **{二十|にじゅっ}パーセント{引|び}きだったら、{買|か}いたいです。** 〔Niju paasento biki dattara, kaitai desu.〕 — Nếu giảm 20% thì tôi muốn mua."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np2-121",
        "title": "ポイント 121: ～ても、___ (12 câu)",
        "items": [
          {
            "q": "{雨|あめ}が＿＿、{試合|しあい}はあります。　〔Ame ga __, shiai wa arimasu.〕　— Dù mưa trận đấu vẫn diễn ra.",
            "options": [
              "{降|ふ}ったも",
              "{降|ふ}っても",
              "{降|ふ}ったら",
              "{降|ふ}ると"
            ],
            "correct": 1,
            "why": "Dù mưa vẫn có → **降っても**. → **{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。** 〔Ame ga futtemo, shiai wa arimasu.〕 — Dù mưa trận đấu vẫn diễn ra."
          },
          {
            "q": "{高|たか}＿＿、このかばんがほしいです。　〔Taka__, kono kaban ga hoshii desu.〕　— Dù đắt tôi vẫn muốn cái túi này.",
            "options": [
              "くても",
              "かったら",
              "いでも",
              "いても"
            ],
            "correct": 0,
            "why": "イA: 高い → 高**くても**. → **{高|たか}くても、このかばんがほしいです。** 〔Takakutemo, kono kaban ga hoshii desu.〕 — Dù đắt tôi vẫn muốn cái túi này."
          },
          {
            "q": "{日曜日|にちようび}＿＿、{仕事|しごと}があります。　〔Nichiyoubi __, shigoto ga arimasu.〕　— Dù là Chủ nhật vẫn có việc.",
            "options": [
              "くても",
              "ても",
              "だったら",
              "でも"
            ],
            "correct": 3,
            "why": "N + **でも**. → **{日曜日|にちようび}でも、{仕事|しごと}があります。** 〔Nichiyoubi demo, shigoto ga arimasu.〕 — Dù là Chủ nhật vẫn có việc."
          },
          {
            "q": "{人|ひと}が{多|おお}くても、＿＿です。　〔Hito ga ookute mo, __ desu.〕　— Dù đông người tôi vẫn muốn đi.",
            "options": [
              "{行|い}けません",
              "{行|い}かない",
              "{行|い}きたい",
              "{行|い}きません"
            ],
            "correct": 2,
            "why": "Dù đông → vẫn muốn đi (điều trái dự đoán). → **{人|ひと}が{多|おお}くても、{行|い}きたいです。** 〔Hito ga ookute mo, ikitai desu.〕 — Dù đông người tôi vẫn muốn đi."
          },
          {
            "q": "{薬|くすり}を＿＿、{風邪|かぜ}が{治|なお}りません。　〔Kusuri o __, kaze ga naorimasen.〕　— Dù uống thuốc mà cảm vẫn không khỏi.",
            "options": [
              "{飲|の}みても",
              "{飲|の}んだら",
              "{飲|の}むと",
              "{飲|の}んでも"
            ],
            "correct": 3,
            "why": "Thể て 飲んで + も. → **{薬|くすり}を{飲|の}んでも、{風邪|かぜ}が{治|なお}りません。** 〔Kusuri o nondemo, kaze ga naorimasen.〕 — Dù uống thuốc mà cảm vẫn không khỏi."
          },
          {
            "q": "{静|しず}か＿＿、{寝|ね}ることができません。　〔Shizuka __, neru koto ga dekimasen.〕　— Dù yên tĩnh tôi vẫn không ngủ được.",
            "options": [
              "なくても",
              "くても",
              "だったら",
              "でも"
            ],
            "correct": 3,
            "why": "ナA + でも. → **{静|しず}かでも、{寝|ね}ることができません。** 〔Shizuka demo, neru koto ga dekimasen.〕 — Dù yên tĩnh tôi vẫn không ngủ được."
          },
          {
            "q": "{急|いそ}いで＿＿、もう{間|ま}に{合|あ}わないと{思|おも}います。　〔Isoide __, mou maniawanai to omoimasu.〕　— Dù có vội tôi nghĩ cũng không kịp nữa.",
            "options": [
              "から",
              "たら",
              "は",
              "も"
            ],
            "correct": 3,
            "why": "Thể て + も: 急いでも. → **{急|いそ}いでも、もう{間|ま}に{合|あ}わないと{思|おも}います。** 〔Isoide mo, mou maniawanai to omoimasu.〕 — Dù có vội tôi nghĩ cũng không kịp nữa."
          },
          {
            "q": "Câu này nghĩa là gì? {何回|なんかい}{聞|き}いても、わかりません。　〔Nankai kiite mo, wakarimasen.〕",
            "options": [
              "Dù nghe bao nhiêu lần tôi cũng không hiểu.",
              "Tôi đã nghe nhiều lần nên hiểu.",
              "Nếu nghe nhiều lần thì sẽ hiểu.",
              "Nghe nói nghe nhiều lần sẽ hiểu."
            ],
            "correct": 0,
            "why": "何回 + ても = dù bao nhiêu lần."
          },
          {
            "q": "Câu nào dùng ĐÚNG?",
            "options": [
              "{寒|さむ}いでも、{毎朝|まいあさ}{散歩|さんぽ}します。 (Samui demo, maiasa sanpo shimasu.)",
              "{寒|さむ}かったらも、{毎朝|まいあさ}{散歩|さんぽ}します。 (Samukattara mo, maiasa sanpo shimasu.)",
              "{寒|さむ}くても、{毎朝|まいあさ}{散歩|さんぽ}します。 (Samukute mo, maiasa sanpo shimasu.)",
              "{寒|さむ}いても、{毎朝|まいあさ}{散歩|さんぽ}します。 (Samuite mo, maiasa sanpo shimasu.)"
            ],
            "correct": 2,
            "why": "イA 寒い → **寒くても**."
          },
          {
            "q": "いい{天気|てんき}＿＿、{今日|きょう}は{出|で}かけません。{宿題|しゅくだい}がありますから。　〔Ii tenki __, kyou wa dekakemasen. Shukudai ga arimasu kara.〕　— Dù trời đẹp, hôm nay tôi không ra ngoài. Vì có bài tập.",
            "options": [
              "だったら",
              "くても",
              "でも",
              "たら"
            ],
            "correct": 2,
            "why": "N (いい天気) + でも. → **いい{天気|てんき}でも、{今日|きょう}は{出|で}かけません。{宿題|しゅくだい}がありますから。** 〔Ii tenki demo, kyou wa dekakemasen. Shukudai ga arimasu kara.〕 — Dù trời đẹp, hôm nay tôi không ra ngoài. Vì có bài tập."
          },
          {
            "q": "A：{雨|あめ}でも{行|い}きますか。B：ええ、{雨|あめ}が＿＿{行|い}きます。　〔A: ame demo ikimasu ka. B: ee, ame ga __ ikimasu.〕　— A: Mưa bạn vẫn đi à? B: Ừ, dù mưa tôi vẫn đi.",
            "options": [
              "{降|ふ}ったから",
              "{降|ふ}ったら",
              "{降|ふ}ると",
              "{降|ふ}っても"
            ],
            "correct": 3,
            "why": "Dù mưa vẫn đi → 降っても. → **A：{雨|あめ}でも{行|い}きますか。B：ええ、{雨|あめ}が{降|ふ}っても{行|い}きます。** 〔A: ame demo ikimasu ka. B: ee, ame ga futte mo ikimasu.〕 — A: Mưa bạn vẫn đi à? B: Ừ, dù mưa tôi vẫn đi."
          },
          {
            "q": "{緊張|きんちょう}して＿＿、{最後|さいご}まで{話|はな}してください。　〔Kinchou shite __, saigo made hanashite kudasai.〕　— Dù hồi hộp hãy nói đến cuối.",
            "options": [
              "も",
              "から",
              "は",
              "たら"
            ],
            "correct": 0,
            "why": "Dù hồi hộp → 緊張しても. → **{緊張|きんちょう}しても、{最後|さいご}まで{話|はな}してください。** 〔Kinchou shite mo, saigo made hanashite kudasai.〕 — Dù hồi hộp hãy nói đến cuối."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np2-123",
        "title": "ポイント 123: きっと／たぶん ～と思います (10 câu)",
        "items": [
          {
            "q": "{土曜日|どようび}ですから、{店|みせ}は＿＿{混|こ}んでいると{思|おも}います。　〔Doyoubi desu kara, mise wa __ konde iru to omoimasu.〕　— Vì là thứ Bảy nên tôi nghĩ chắc chắn cửa hàng đông.",
            "options": [
              "なんと",
              "もし",
              "きっと",
              "いつでも"
            ],
            "correct": 2,
            "why": "Đoán chắc chắn → **きっと**. → **{土曜日|どようび}ですから、{店|みせ}はきっと{混|こ}んでいると{思|おも}います。** 〔Doyoubi desu kara, mise wa kitto konde iru to omoimasu.〕 — Vì là thứ Bảy nên tôi nghĩ chắc chắn cửa hàng đông."
          },
          {
            "q": "カルロスさんは＿＿{来|こ}ないと{思|おも}います。{熱|ねつ}があるそうですから。　〔Karurosu-san wa __ konai to omoimasu. Netsu ga aru sou desu kara.〕　— Tôi nghĩ có lẽ Carlos không đến. Vì nghe nói cậu ấy bị sốt.",
            "options": [
              "もし",
              "なんと",
              "ほら",
              "たぶん"
            ],
            "correct": 3,
            "why": "Có lẽ → **たぶん**. → **カルロスさんはたぶん{来|こ}ないと{思|おも}います。{熱|ねつ}があるそうですから。** 〔Karurosu-san wa tabun konai to omoimasu. Netsu ga aru sou desu kara.〕 — Tôi nghĩ có lẽ Carlos không đến. Vì nghe nói cậu ấy bị sốt."
          },
          {
            "q": "{明日|あした}はたぶん{雨|あめ}＿＿と{思|おも}います。　〔Ashita wa tabun ame __ to omoimasu.〕　— Tôi nghĩ có lẽ mai trời mưa.",
            "options": [
              "な",
              "—",
              "です",
              "だ"
            ],
            "correct": 3,
            "why": "N + **だ** と 思います. → **{明日|あした}はたぶん{雨|あめ}だと{思|おも}います。** 〔Ashita wa tabun ame da to omoimasu.〕 — Tôi nghĩ có lẽ mai trời mưa."
          },
          {
            "q": "あの{店|みせ}のケーキはきっと＿＿と{思|おも}います。　〔Ano mise no keeki wa kitto __ to omoimasu.〕　— Tôi nghĩ bánh quán đó chắc chắn ngon.",
            "options": [
              "おいしいです",
              "おいしい",
              "おいしく",
              "おいしいだ"
            ],
            "correct": 1,
            "why": "イA + と 思います (không thêm だ). → **あの{店|みせ}のケーキはきっとおいしいと{思|おも}います。** 〔Ano mise no keeki wa kitto oishii to omoimasu.〕 — Tôi nghĩ bánh quán đó chắc chắn ngon."
          },
          {
            "q": "タクシーで{行|い}ったら、きっと＿＿と{思|おも}います。　〔Takushii de ittara, kitto __ to omoimasu.〕　— Tôi nghĩ nếu đi taxi thì chắc chắn kịp.",
            "options": [
              "{間|ま}に{合|あ}って",
              "{間|ま}に{合|あ}っただ",
              "{間|ま}に{合|あ}います",
              "{間|ま}に{合|あ}う"
            ],
            "correct": 3,
            "why": "Thể thường 間に合う + と 思います. → **タクシーで{行|い}ったら、きっと{間|ま}に{合|あ}うと{思|おも}います。** 〔Takushii de ittara, kitto maniau to omoimasu.〕 — Tôi nghĩ nếu đi taxi thì chắc chắn kịp."
          },
          {
            "q": "{日本|にほん}のチームは{強|つよ}いですから、きっと＿＿と{思|おも}います。　〔Nihon no chiimu wa tsuyoi desu kara, kitto __ to omoimasu.〕　— Đội Nhật mạnh nên tôi nghĩ chắc chắn sẽ thắng.",
            "options": [
              "{負|ま}ける",
              "{勝|か}ちます",
              "{勝|か}っただ",
              "{勝|か}つ"
            ],
            "correct": 3,
            "why": "Đội mạnh → chắc chắn thắng: 勝つ. → **{日本|にほん}のチームは{強|つよ}いですから、きっと{勝|か}つと{思|おも}います。** 〔Nihon no chiimu wa tsuyoi desu kara, kitto katsu to omoimasu.〕 — Đội Nhật mạnh nên tôi nghĩ chắc chắn sẽ thắng."
          },
          {
            "q": "{子|こ}どもはたぶん{無料|むりょう}＿＿{思|おも}います。　〔Kodomo wa tabun muryou __ omoimasu.〕　— Tôi nghĩ có lẽ trẻ em được miễn phí.",
            "options": [
              "だと",
              "と",
              "なと",
              "ですと"
            ],
            "correct": 0,
            "why": "N + だと 思います. → **{子|こ}どもはたぶん{無料|むりょう}だと{思|おも}います。** 〔Kodomo wa tabun muryou da to omoimasu.〕 — Tôi nghĩ có lẽ trẻ em được miễn phí."
          },
          {
            "q": "Câu nào đoán \"có lẽ\" (ít chắc chắn hơn)?",
            "options": [
              "{明日|あした}{晴|は}れたら、{行|い}きます。 (Ashita haretara, ikimasu.)",
              "きっと{明日|あした}は{晴|は}れると{思|おも}います。 (Kitto ashita wa hareru to omoimasu.)",
              "{明日|あした}は{晴|は}れるそうです。 (Ashita wa hareru sou desu.)",
              "たぶん{明日|あした}は{晴|は}れると{思|おも}います。 (Tabun ashita wa hareru to omoimasu.)"
            ],
            "correct": 3,
            "why": "たぶん = có lẽ; きっと = chắc chắn; そうです = nghe nói."
          },
          {
            "q": "Câu này nghĩa là gì? {雨|あめ}が{降|ふ}っても、{花火大会|はなびたいかい}はきっとあると{思|おも}います。　〔Ame ga futte mo, hanabitaikai wa kitto aru to omoimasu.〕",
            "options": [
              "Nghe nói nếu mưa thì lễ hội bị huỷ.",
              "Tôi nghĩ có lẽ không có lễ hội.",
              "Nếu mưa thì tôi không đi lễ hội.",
              "Tôi nghĩ dù mưa thì lễ hội pháo hoa chắc chắn vẫn có."
            ],
            "correct": 3,
            "why": "ても + きっと ～と 思います."
          },
          {
            "q": "A：{田中|たなか}さんは{来|き}ますか。B：＿＿。{今日|きょう}は{忙|いそが}しいそうですから。　〔A: Tanaka-san wa kimasu ka. B: __. Kyou wa isogashii sou desu kara.〕　— A: Anh Tanaka có đến không? B: Tôi nghĩ có lẽ không đến. Nghe nói hôm nay anh ấy bận.",
            "options": [
              "きっと{来|く}るだと{思|おも}います",
              "もし{来|こ}ないと{思|おも}います",
              "たぶん{来|こ}ないと{思|おも}います",
              "たぶん{来|き}ないと{思|おも}います"
            ],
            "correct": 2,
            "why": "Đoán phủ định: たぶん 来ない (こない) と 思います. → **A：{田中|たなか}さんは{来|き}ますか。B：たぶん{来|こ}ないと{思|おも}います。{今日|きょう}は{忙|いそが}しいそうですから。** 〔A: Tanaka-san wa kimasu ka. B: tabun konai to omoimasu. Kyou wa isogashii sou desu kara.〕 — A: Anh Tanaka có đến không? B: Tôi nghĩ có lẽ không đến. Nghe nói hôm nay anh ấy bận."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · たら hay ても · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b15-np2-tara-temo",
        "title": "Chọn たら hay ても cho đúng nghĩa (10 câu)",
        "items": [
          {
            "q": "{雨|あめ}が＿＿、{行|い}きません。　〔Ame ga __, ikimasen.〕　— Nếu mưa thì tôi không đi.",
            "options": [
              "{降|ふ}っても",
              "{降|ふ}るでも",
              "{降|ふ}りたら",
              "{降|ふ}ったら"
            ],
            "correct": 3,
            "why": "Mưa → không đi: điều kiện → たら. → **{雨|あめ}が{降|ふ}ったら、{行|い}きません。** 〔Ame ga futtara, ikimasen.〕 — Nếu mưa thì tôi không đi."
          },
          {
            "q": "{雨|あめ}が＿＿、{行|い}きます。　〔Ame ga __, ikimasu.〕　— Dù mưa tôi vẫn đi.",
            "options": [
              "{降|ふ}ったも",
              "{降|ふ}っても",
              "{降|ふ}ったら",
              "{降|ふ}るたら"
            ],
            "correct": 1,
            "why": "Mưa mà vẫn đi: trái dự đoán → ても. → **{雨|あめ}が{降|ふ}っても、{行|い}きます。** 〔Ame ga futtemo, ikimasu.〕 — Dù mưa tôi vẫn đi."
          },
          {
            "q": "{安|やす}＿＿、{買|か}います。　〔Yasu__, kaimasu.〕　— Nếu rẻ thì tôi mua.",
            "options": [
              "かったら",
              "くたら",
              "いでも",
              "くても"
            ],
            "correct": 0,
            "why": "Rẻ thì mua → たら. → **{安|やす}かったら、{買|か}います。** 〔Yasukattara, kaimasu.〕 — Nếu rẻ thì tôi mua."
          },
          {
            "q": "{安|やす}＿＿、{買|か}いません。いりませんから。　〔Yasu__, kaimasen. Irimasen kara.〕　— Dù rẻ tôi cũng không mua. Vì không cần.",
            "options": [
              "かっても",
              "かったら",
              "くても",
              "いだったら"
            ],
            "correct": 2,
            "why": "Rẻ mà vẫn không mua → ても. → **{安|やす}くても、{買|か}いません。いりませんから。** 〔Yasukutemo, kaimasen. Irimasen kara.〕 — Dù rẻ tôi cũng không mua. Vì không cần."
          },
          {
            "q": "{電車|でんしゃ}が{止|と}まって＿＿、バスで{行|い}きましょう。　〔Densha ga tomatte __, basu de ikimashou.〕　— Nếu tàu đang dừng thì đi xe buýt nhé.",
            "options": [
              "いると",
              "いても",
              "いて",
              "いたら"
            ],
            "correct": 3,
            "why": "Nếu tàu đang dừng thì đi xe buýt → たら (vế sau rủ). → **{電車|でんしゃ}が{止|と}まっていたら、バスで{行|い}きましょう。** 〔Densha ga tomatte itara, basu de ikimashou.〕 — Nếu tàu đang dừng thì đi xe buýt nhé."
          },
          {
            "q": "{混|こ}んで＿＿、あの{店|みせ}のラーメンが{食|た}べたいです。　〔Konde __, ano mise no raamen ga tabetai desu.〕　— Dù đông tôi vẫn muốn ăn mì ở quán đó.",
            "options": [
              "いると",
              "いたら",
              "いるから",
              "いても"
            ],
            "correct": 3,
            "why": "Dù đông vẫn muốn ăn → ても. → **{混|こ}んでいても、あの{店|みせ}のラーメンが{食|た}べたいです。** 〔Konde itemo, ano mise no raamen ga tabetai desu.〕 — Dù đông tôi vẫn muốn ăn mì ở quán đó."
          },
          {
            "q": "{暇|ひま}＿＿、{映画|えいが}を{見|み}に{行|い}きませんか。　〔Hima __, eiga o mi ni ikimasen ka.〕　— Nếu rảnh thì đi xem phim không?",
            "options": [
              "かったら",
              "だったら",
              "でも",
              "くても"
            ],
            "correct": 1,
            "why": "Nếu rảnh thì rủ → だったら. → **{暇|ひま}だったら、{映画|えいが}を{見|み}に{行|い}きませんか。** 〔Hima dattara, eiga o mi ni ikimasen ka.〕 — Nếu rảnh thì đi xem phim không?"
          },
          {
            "q": "{忙|いそが}しく＿＿、{毎日|まいにち}{日本語|にほんご}を{勉強|べんきょう}します。　〔Isogashiku__, mainichi Nihongo o benkyou shimasu.〕　— Dù bận tôi vẫn học tiếng Nhật mỗi ngày.",
            "options": [
              "たら",
              "ても",
              "から",
              "て"
            ],
            "correct": 1,
            "why": "Dù bận vẫn học → 忙しくても. → **{忙|いそが}しくても、{毎日|まいにち}{日本語|にほんご}を{勉強|べんきょう}します。** 〔Isogashikutemo, mainichi Nihongo o benkyou shimasu.〕 — Dù bận tôi vẫn học tiếng Nhật mỗi ngày."
          },
          {
            "q": "\"Nếu đội mình thắng thì cả nhóm đi ăn nhé.\" — câu đúng:",
            "options": [
              "{勝|か}つと、みんなで{食|た}べに{行|い}きましょう。 (Katsu to, minna de tabe ni ikimashou.)",
              "{勝|か}ったら、みんなで{食|た}べに{行|い}きましょう。 (Kattara, minna de tabe ni ikimashou.)",
              "{勝|か}っても、みんなで{食|た}べに{行|い}きましょう。 (Katte mo, minna de tabe ni ikimashou.)",
              "{勝|か}ちたら、みんなで{食|た}べに{行|い}きましょう。 (Kachitara, minna de tabe ni ikimashou.)"
            ],
            "correct": 1,
            "why": "Điều kiện + rủ → 勝ったら."
          },
          {
            "q": "\"Dù thua cũng không sao.\" — câu đúng:",
            "options": [
              "{負|ま}けったも、{大丈夫|だいじょうぶ}です。 (Maketta mo, daijoubu desu.)",
              "{負|ま}けるでも、{大丈夫|だいじょうぶ}です。 (Makeru demo, daijoubu desu.)",
              "{負|ま}けたら、{大丈夫|だいじょうぶ}です。 (Maketara, daijoubu desu.)",
              "{負|ま}けても、{大丈夫|だいじょうぶ}です。 (Makete mo, daijoubu desu.)"
            ],
            "correct": 3,
            "why": "Dù … → 負けても."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np2-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "{時間|じかん}があっても、{行|い}きません。 (Jikan ga atte mo, ikimasen.)",
              "{時間|じかん}がありたら、{行|い}きます。 (Jikan ga aritara, ikimasu.)",
              "{時間|じかん}があったら、{行|い}きます。 (Jikan ga attara, ikimasu.)",
              "{時間|じかん}がなかったら、{行|い}きません。 (Jikan ga nakattara, ikimasen.)"
            ],
            "correct": 1,
            "why": "ある → あった → **あったら** (không có ~~ありたら~~)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "いかったら、{食|た}べてください。 (Ikattara, tabete kudasai.)",
              "よくても、{買|か}いません。 (Yokute mo, kaimasen.)",
              "よかったら、{食|た}べてください。 (Yokattara, tabete kudasai.)",
              "よかったら、{一緒|いっしょ}にどうですか。 (Yokattara, issho ni dou desu ka.)"
            ],
            "correct": 0,
            "why": "**いい → よかったら**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{雨|あめ}でも、{行|い}きます。 (Ame demo, ikimasu.)",
              "{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}です。 (Ame ga futtara, chuushi desu.)",
              "{雨|あめ}だったら、{中止|ちゅうし}です。 (Ame dattara, chuushi desu.)",
              "{雨|あめ}かったら、{中止|ちゅうし}です。 (Ame kattara, chuushi desu.)"
            ],
            "correct": 3,
            "why": "N + **だったら**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{静|しず}かくても、{寝|ね}られません。 (Shizuka kute mo, neraremasen.)",
              "{雨|あめ}でも、{試合|しあい}があります。 (Ame demo, shiai ga arimasu.)",
              "{静|しず}かでも、{寝|ね}ることができません。 (Shizuka demo, neru koto ga dekimasen.)",
              "{寒|さむ}くても、{泳|およ}ぎます。 (Samukute mo, oyogimasu.)"
            ],
            "correct": 0,
            "why": "ナA + **でも** (静かでも)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{明日|あした}はたぶん{寒|さむ}いと{思|おも}います。 (Ashita wa tabun samui to omoimasu.)",
              "{明日|あした}はきっと{晴|は}れると{思|おも}います。 (Ashita wa kitto hareru to omoimasu.)",
              "{明日|あした}はたぶん{雨|あめ}だと{思|おも}います。 (Ashita wa tabun ame da to omoimasu.)",
              "{明日|あした}はきっと{晴|は}れますと{思|おも}います。 (Ashita wa kitto haremasu to omoimasu.)"
            ],
            "correct": 3,
            "why": "Trước と 思います dùng **thể thường** (晴れる)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{明日|あした}はたぶん{雨|あめ}だと{思|おも}います。 (Ashita wa tabun ame da to omoimasu.)",
              "{明日|あした}はたぶん{雨|あめ}が{降|ふ}ると{思|おも}います。 (Ashita wa tabun ame ga furu to omoimasu.)",
              "{明日|あした}はたぶん{雨|あめ}と{思|おも}います。 (Ashita wa tabun ame to omoimasu.)",
              "{明日|あした}はたぶん{晴|は}れないと{思|おも}います。 (Ashita wa tabun harenai to omoimasu.)"
            ],
            "correct": 2,
            "why": "N + **だ** と 思います."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "ボタンを{押|お}すと、ドアが{開|あ}きます。 (Botan o osu to, doa ga akimasu.)",
              "{駅|えき}に{着|つ}いたら、{電話|でんわ}してください。 (Eki ni tsuitara, denwa shite kudasai.)",
              "{駅|えき}に{着|つ}くと、{電話|でんわ}してください。 (Eki ni tsuku to, denwa shite kudasai.)",
              "{駅|えき}に{着|つ}いたら、{電話|でんわ}します。 (Eki ni tsuitara, denwa shimasu.)"
            ],
            "correct": 2,
            "why": "Vế sau nhờ ～てください → phải dùng **たら**, không dùng と (Bài 14)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{雨|あめ}が{降|ふ}っても、{行|い}きます。 (Ame ga futte mo, ikimasu.)",
              "{雨|あめ}が{降|ふ}ったも、{行|い}きます。 (Ame ga futtamo, ikimasu.)",
              "どんなに{雨|あめ}が{降|ふ}っても、{行|い}きます。 (Donnani ame ga futte mo, ikimasu.)",
              "{雨|あめ}でも、{行|い}きます。 (Ame demo, ikimasu.)"
            ],
            "correct": 1,
            "why": "ても dùng **thể て**: 降って + も."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-np2-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "120: ～たら · 121: ～ても · 123: きっと／たぶん ～と思います",
        "items": [
          {
            "q": "Nếu có thời gian thì đi cùng không?",
            "answers": [
              "時間があったら、一緒に行きませんか。",
              "時間があったら、一緒にいきませんか。",
              "時間があったら、いっしょに行きませんか。",
              "時間があったら、いっしょにいきませんか。",
              "じかんがあったら、一緒に行きませんか。",
              "じかんがあったら、一緒にいきませんか。",
              "じかんがあったら、いっしょに行きませんか。",
              "じかんがあったら、いっしょにいきませんか。"
            ],
            "hint": "あったら"
          },
          {
            "q": "Nếu trời mưa thì trận đấu bị huỷ.",
            "answers": [
              "雨だったら、試合は中止です。",
              "雨だったら、試合はちゅうしです。",
              "雨だったら、しあいは中止です。",
              "雨だったら、しあいはちゅうしです。",
              "あめだったら、試合は中止です。",
              "あめだったら、試合はちゅうしです。",
              "あめだったら、しあいは中止です。",
              "あめだったら、しあいはちゅうしです。",
              "雨が降ったら、試合は中止です。",
              "雨が降ったら、試合はちゅうしです。",
              "雨が降ったら、しあいは中止です。",
              "雨が降ったら、しあいはちゅうしです。",
              "雨がふったら、試合は中止です。",
              "雨がふったら、試合はちゅうしです。",
              "雨がふったら、しあいは中止です。",
              "雨がふったら、しあいはちゅうしです。",
              "あめが降ったら、試合は中止です。",
              "あめが降ったら、試合はちゅうしです。",
              "あめが降ったら、しあいは中止です。",
              "あめが降ったら、しあいはちゅうしです。",
              "あめがふったら、試合は中止です。",
              "あめがふったら、試合はちゅうしです。",
              "あめがふったら、しあいは中止です。",
              "あめがふったら、しあいはちゅうしです。"
            ],
            "hint": "雨だったら"
          },
          {
            "q": "Dù mưa tôi vẫn muốn đi.",
            "answers": [
              "雨が降っても、行きたいです。",
              "雨が降っても、いきたいです。",
              "雨がふっても、行きたいです。",
              "雨がふっても、いきたいです。",
              "あめが降っても、行きたいです。",
              "あめが降っても、いきたいです。",
              "あめがふっても、行きたいです。",
              "あめがふっても、いきたいです。",
              "雨でも、行きたいです。",
              "雨でも、いきたいです。",
              "あめでも、行きたいです。",
              "あめでも、いきたいです。"
            ],
            "hint": "降っても"
          },
          {
            "q": "Dù đắt tôi vẫn mua.",
            "answers": [
              "高くても、買います。",
              "高くても、かいます。",
              "たかくても、買います。",
              "たかくても、かいます。"
            ],
            "hint": "高くても"
          },
          {
            "q": "Tôi nghĩ chắc chắn sẽ đông.",
            "answers": [
              "きっと混むと思います。",
              "きっと混むとおもいます。",
              "きっとこむと思います。",
              "きっとこむとおもいます。",
              "きっと混んでいると思います。",
              "きっと混んでいるとおもいます。",
              "きっとこんでいると思います。",
              "きっとこんでいるとおもいます。"
            ],
            "hint": "きっと ～と 思います"
          },
          {
            "q": "Tôi nghĩ có lẽ không kịp.",
            "answers": [
              "たぶん間に合わないと思います。",
              "たぶん間に合わないとおもいます。",
              "たぶん間にあわないと思います。",
              "たぶん間にあわないとおもいます。",
              "たぶんまに合わないと思います。",
              "たぶんまに合わないとおもいます。",
              "たぶんまにあわないと思います。",
              "たぶんまにあわないとおもいます。"
            ],
            "hint": "たぶん"
          },
          {
            "q": "Nếu bạn thích thì mời bạn dùng.",
            "answers": [
              "よかったら、どうぞ。"
            ],
            "hint": "よかったら"
          },
          {
            "q": "Nếu rảnh thì giúp tôi nhé.",
            "answers": [
              "暇だったら、手伝ってください。",
              "暇だったら、てつだってください。",
              "ひまだったら、手伝ってください。",
              "ひまだったら、てつだってください。"
            ],
            "hint": "暇だったら"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-np2-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Nếu có thời gian thì đi chợ đồ cũ không?",
            "chips": [
              "フリーマーケットに",
              "{時間|じかん}があったら、",
              "{時間|じかん}があっても、",
              "{行|い}きませんか"
            ],
            "answer": [
              "{時間|じかん}があったら、",
              "フリーマーケットに",
              "{行|い}きませんか"
            ],
            "ro": "Jikan ga attara, furiimaaketto ni ikimasenka"
          },
          {
            "vi": "Dù mưa lễ hội vẫn diễn ra.",
            "chips": [
              "{雨|あめ}が{降|ふ}ったら、",
              "{雨|あめ}が{降|ふ}っても、",
              "{花火大会|はなびたいかい}は",
              "あります"
            ],
            "answer": [
              "{雨|あめ}が{降|ふ}っても、",
              "{花火大会|はなびたいかい}は",
              "あります"
            ],
            "ro": "Ame ga futte mo, hanabitaikai wa arimasu"
          },
          {
            "vi": "Tôi nghĩ chắc chắn quán đó đông.",
            "chips": [
              "{思|おも}います",
              "きっと{混|こ}んでいると",
              "あの{店|みせ}は",
              "もし{混|こ}んでいると"
            ],
            "answer": [
              "あの{店|みせ}は",
              "きっと{混|こ}んでいると",
              "{思|おも}います"
            ],
            "ro": "Ano mise wa kitto konde iru to omoimasu"
          },
          {
            "vi": "Nếu không kịp tàu thì đi taxi.",
            "chips": [
              "もし{電車|でんしゃ}に",
              "{間|ま}に{合|あ}わなかったら、",
              "タクシーで{行|い}きます",
              "{間|ま}に{合|あ}わないたら、"
            ],
            "answer": [
              "もし{電車|でんしゃ}に",
              "{間|ま}に{合|あ}わなかったら、",
              "タクシーで{行|い}きます"
            ],
            "ro": "Moshi densha ni maniawanakattara, takushii de ikimasu"
          },
          {
            "vi": "Dù đông người tôi vẫn muốn đi.",
            "chips": [
              "{人|ひと}が{多|おお}いでも、",
              "{行|い}きたい",
              "です",
              "{人|ひと}が{多|おお}くても、"
            ],
            "answer": [
              "{人|ひと}が{多|おお}くても、",
              "{行|い}きたい",
              "です"
            ],
            "ro": "Hito ga ookute mo, ikitai desu"
          },
          {
            "vi": "Tôi nghĩ có lẽ mai trời mưa.",
            "chips": [
              "たぶん{雨|あめ}と",
              "{思|おも}います",
              "{明日|あした}は",
              "たぶん{雨|あめ}だと"
            ],
            "answer": [
              "{明日|あした}は",
              "たぶん{雨|あめ}だと",
              "{思|おも}います"
            ],
            "ro": "Ashita wa tabun ame da to omoimasu"
          },
          {
            "vi": "Nếu rẻ thì tôi muốn mua cái ô.",
            "chips": [
              "{買|か}いたいです",
              "{安|やす}かったら、",
              "{安|やす}いだったら、",
              "{傘|かさ}を"
            ],
            "answer": [
              "{安|やす}かったら、",
              "{傘|かさ}を",
              "{買|か}いたいです"
            ],
            "ro": "Yasukattara, kasa o kaitai desu"
          },
          {
            "vi": "Dù là Chủ nhật vẫn phải làm việc.",
            "chips": [
              "{働|はたら}かなければ",
              "なりません",
              "{日曜日|にちようび}だったら、",
              "{日曜日|にちようび}でも、"
            ],
            "answer": [
              "{日曜日|にちようび}でも、",
              "{働|はたら}かなければ",
              "なりません"
            ],
            "ro": "Nichiyoubi demo, hatarakanakereba narimasen"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch · nhiều ô trống · tình huống \"bàn kế hoạch theo tạp chí\""
      },
      {
        "t": "quiz",
        "id": "lt-b15-np2-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "120 · 121 · 123",
        "items": [
          {
            "q": "Nếu mai trời nắng thì đi lễ hội pháo hoa nhé.",
            "answers": [
              "明日晴れたら、花火大会に行きましょう。",
              "明日晴れたら、花火大会にいきましょう。",
              "明日晴れたら、はなびたいかいに行きましょう。",
              "明日晴れたら、はなびたいかいにいきましょう。",
              "明日はれたら、花火大会に行きましょう。",
              "明日はれたら、花火大会にいきましょう。",
              "明日はれたら、はなびたいかいに行きましょう。",
              "明日はれたら、はなびたいかいにいきましょう。",
              "あした晴れたら、花火大会に行きましょう。",
              "あした晴れたら、花火大会にいきましょう。",
              "あした晴れたら、はなびたいかいに行きましょう。",
              "あした晴れたら、はなびたいかいにいきましょう。",
              "あしたはれたら、花火大会に行きましょう。",
              "あしたはれたら、花火大会にいきましょう。",
              "あしたはれたら、はなびたいかいに行きましょう。",
              "あしたはれたら、はなびたいかいにいきましょう。",
              "明日晴れたら、花火大会へ行きましょう。",
              "明日晴れたら、花火大会へいきましょう。",
              "明日晴れたら、はなびたいかいへ行きましょう。",
              "明日晴れたら、はなびたいかいへいきましょう。",
              "明日はれたら、花火大会へ行きましょう。",
              "明日はれたら、花火大会へいきましょう。",
              "明日はれたら、はなびたいかいへ行きましょう。",
              "明日はれたら、はなびたいかいへいきましょう。",
              "あした晴れたら、花火大会へ行きましょう。",
              "あした晴れたら、花火大会へいきましょう。",
              "あした晴れたら、はなびたいかいへ行きましょう。",
              "あした晴れたら、はなびたいかいへいきましょう。",
              "あしたはれたら、花火大会へ行きましょう。",
              "あしたはれたら、花火大会へいきましょう。",
              "あしたはれたら、はなびたいかいへ行きましょう。",
              "あしたはれたら、はなびたいかいへいきましょう。"
            ],
            "hint": "晴れたら"
          },
          {
            "q": "Nghe nói dù mưa lễ hội vẫn có.",
            "answers": [
              "雨が降っても、大会はあるそうです。",
              "雨が降っても、たいかいはあるそうです。",
              "雨がふっても、大会はあるそうです。",
              "雨がふっても、たいかいはあるそうです。",
              "あめが降っても、大会はあるそうです。",
              "あめが降っても、たいかいはあるそうです。",
              "あめがふっても、大会はあるそうです。",
              "あめがふっても、たいかいはあるそうです。",
              "雨でも、大会はあるそうです。",
              "雨でも、たいかいはあるそうです。",
              "あめでも、大会はあるそうです。",
              "あめでも、たいかいはあるそうです。"
            ],
            "hint": "降って も … そうです"
          },
          {
            "q": "Tôi nghĩ chắc chắn sẽ rất náo nhiệt và vui.",
            "answers": [
              "きっとにぎやかで楽しいと思います。",
              "きっとにぎやかで楽しいとおもいます。",
              "きっとにぎやかでたのしいと思います。",
              "きっとにぎやかでたのしいとおもいます。"
            ],
            "hint": "きっと"
          },
          {
            "q": "Nếu mua từ 1.000 yên thì giảm 10%.",
            "answers": [
              "千円以上買ったら、十パーセント引きです。",
              "千円以上買ったら、十パーセントびきです。",
              "千円以上買ったら、じゅっパーセント引きです。",
              "千円以上買ったら、じゅっパーセントびきです。",
              "千円以上かったら、十パーセント引きです。",
              "千円以上かったら、十パーセントびきです。",
              "千円以上かったら、じゅっパーセント引きです。",
              "千円以上かったら、じゅっパーセントびきです。",
              "千円いじょう買ったら、十パーセント引きです。",
              "千円いじょう買ったら、十パーセントびきです。",
              "千円いじょう買ったら、じゅっパーセント引きです。",
              "千円いじょう買ったら、じゅっパーセントびきです。",
              "千円いじょうかったら、十パーセント引きです。",
              "千円いじょうかったら、十パーセントびきです。",
              "千円いじょうかったら、じゅっパーセント引きです。",
              "千円いじょうかったら、じゅっパーセントびきです。",
              "せんえん以上買ったら、十パーセント引きです。",
              "せんえん以上買ったら、十パーセントびきです。",
              "せんえん以上買ったら、じゅっパーセント引きです。",
              "せんえん以上買ったら、じゅっパーセントびきです。",
              "せんえん以上かったら、十パーセント引きです。",
              "せんえん以上かったら、十パーセントびきです。",
              "せんえん以上かったら、じゅっパーセント引きです。",
              "せんえん以上かったら、じゅっパーセントびきです。",
              "せんえんいじょう買ったら、十パーセント引きです。",
              "せんえんいじょう買ったら、十パーセントびきです。",
              "せんえんいじょう買ったら、じゅっパーセント引きです。",
              "せんえんいじょう買ったら、じゅっパーセントびきです。",
              "せんえんいじょうかったら、十パーセント引きです。",
              "せんえんいじょうかったら、十パーセントびきです。",
              "せんえんいじょうかったら、じゅっパーセント引きです。",
              "せんえんいじょうかったら、じゅっパーセントびきです。"
            ],
            "hint": "買ったら"
          },
          {
            "q": "Nếu được thì cùng đi với tôi không?",
            "answers": [
              "よかったら、一緒に行きませんか。",
              "よかったら、一緒にいきませんか。",
              "よかったら、いっしょに行きませんか。",
              "よかったら、いっしょにいきませんか。"
            ],
            "hint": "よかったら"
          },
          {
            "q": "Dù đắt nhưng nếu là đồ tốt thì tôi muốn mua.",
            "answers": [
              "高くても、いいものだったら、買いたいです。",
              "高くても、いいものだったら、かいたいです。",
              "たかくても、いいものだったら、買いたいです。",
              "たかくても、いいものだったら、かいたいです。"
            ],
            "hint": "高くて も … だったら"
          },
          {
            "q": "Tôi nghĩ có lẽ chỗ ngồi đã hết.",
            "answers": [
              "たぶん席がないと思います。",
              "たぶん席がないとおもいます。",
              "たぶんせきがないと思います。",
              "たぶんせきがないとおもいます。",
              "たぶんもう席がないと思います。",
              "たぶんもう席がないとおもいます。",
              "たぶんもうせきがないと思います。",
              "たぶんもうせきがないとおもいます。"
            ],
            "hint": "たぶん ～ない と"
          },
          {
            "q": "Nếu đông thì đi quán khác nhé.",
            "answers": [
              "混んでいたら、ほかの店に行きましょう。",
              "混んでいたら、ほかの店にいきましょう。",
              "混んでいたら、ほかのみせに行きましょう。",
              "混んでいたら、ほかのみせにいきましょう。",
              "こんでいたら、ほかの店に行きましょう。",
              "こんでいたら、ほかの店にいきましょう。",
              "こんでいたら、ほかのみせに行きましょう。",
              "こんでいたら、ほかのみせにいきましょう。",
              "混んだら、ほかの店へ行きましょう。",
              "混んだら、ほかの店へいきましょう。",
              "混んだら、ほかのみせへ行きましょう。",
              "混んだら、ほかのみせへいきましょう。",
              "こんだら、ほかの店へ行きましょう。",
              "こんだら、ほかの店へいきましょう。",
              "こんだら、ほかのみせへ行きましょう。",
              "こんだら、ほかのみせへいきましょう。"
            ],
            "hint": "混んで いたら"
          },
          {
            "q": "Dù có vội cũng không kịp đâu.",
            "answers": [
              "急いでも、間に合いませんよ。",
              "急いでも、間にあいませんよ。",
              "急いでも、まに合いませんよ。",
              "急いでも、まにあいませんよ。",
              "いそいでも、間に合いませんよ。",
              "いそいでも、間にあいませんよ。",
              "いそいでも、まに合いませんよ。",
              "いそいでも、まにあいませんよ。",
              "急いでも、間に合わないと思います。",
              "急いでも、間に合わないとおもいます。",
              "急いでも、間にあわないと思います。",
              "急いでも、間にあわないとおもいます。",
              "急いでも、まに合わないと思います。",
              "急いでも、まに合わないとおもいます。",
              "急いでも、まにあわないと思います。",
              "急いでも、まにあわないとおもいます。",
              "いそいでも、間に合わないと思います。",
              "いそいでも、間に合わないとおもいます。",
              "いそいでも、間にあわないと思います。",
              "いそいでも、間にあわないとおもいます。",
              "いそいでも、まに合わないと思います。",
              "いそいでも、まに合わないとおもいます。",
              "いそいでも、まにあわないと思います。",
              "いそいでも、まにあわないとおもいます。"
            ],
            "hint": "急いでも"
          },
          {
            "q": "Nếu trời nắng thì tôi nghĩ có thể thấy núi Phú Sĩ.",
            "answers": [
              "晴れたら、富士山が見えると思います。",
              "晴れたら、富士山が見えるとおもいます。",
              "晴れたら、富士山がみえると思います。",
              "晴れたら、富士山がみえるとおもいます。",
              "晴れたら、ふじさんが見えると思います。",
              "晴れたら、ふじさんが見えるとおもいます。",
              "晴れたら、ふじさんがみえると思います。",
              "晴れたら、ふじさんがみえるとおもいます。",
              "はれたら、富士山が見えると思います。",
              "はれたら、富士山が見えるとおもいます。",
              "はれたら、富士山がみえると思います。",
              "はれたら、富士山がみえるとおもいます。",
              "はれたら、ふじさんが見えると思います。",
              "はれたら、ふじさんが見えるとおもいます。",
              "はれたら、ふじさんがみえると思います。",
              "はれたら、ふじさんがみえるとおもいます。"
            ],
            "hint": "晴れたら … と 思います"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np2-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{雨|あめ}（①）、{中止|ちゅうし}です。でも、{風|かぜ}が{強|つよ}く（②）、あります。　〔Ame ((1)), chuushi desu. Demo, kaze ga tsuyoku ((2)), arimasu.〕　— Nếu mưa thì huỷ. Nhưng dù gió mạnh vẫn diễn ra.",
            "options": [
              "① だったら ② ても",
              "① でも ② たら",
              "① かったら ② でも",
              "① だったら ② たら"
            ],
            "correct": 0,
            "why": "Mưa → huỷ (たら); gió mạnh vẫn có (ても). → **{雨|あめ}だったら、{中止|ちゅうし}です。でも、{風|かぜ}が{強|つよ}くても、あります。** 〔Ame dattara, chuushi desu. Demo, kaze ga tsuyokute mo, arimasu.〕 — Nếu mưa thì huỷ. Nhưng dù gió mạnh vẫn diễn ra."
          },
          {
            "q": "（①）{明日|あした}{晴|は}れたら、{海|うみ}へ{行|い}きます。（②）{晴|は}れると{思|おも}います。　〔((1)) ashita haretara, umi e ikimasu. ((2)) hareru to omoimasu.〕　— Nếu mai nắng thì tôi đi biển. Tôi nghĩ chắc chắn sẽ nắng.",
            "options": [
              "① もし ② きっと",
              "① もし ② なんと",
              "① きっと ② もし",
              "① なんと ② もし"
            ],
            "correct": 0,
            "why": "Giả định もし ～たら; đoán chắc きっと. → **もし{明日|あした}{晴|は}れたら、{海|うみ}へ{行|い}きます。きっと{晴|は}れると{思|おも}います。** 〔Moshi ashita haretara, umi e ikimasu. Kitto hareru to omoimasu.〕 — Nếu mai nắng thì tôi đi biển. Tôi nghĩ chắc chắn sẽ nắng."
          },
          {
            "q": "{高|たか}（①）、このストラップがほしいです。（②）、{一緒|いっしょ}に{見|み}に{行|い}きませんか。　〔Taka((1)), kono sutorappu ga hoshii desu. ((2)), issho ni mi ni ikimasen ka.〕　— Dù đắt tôi vẫn muốn dây đeo này. Nếu được thì đi xem cùng tôi không?",
            "options": [
              "① かったら ② よくても",
              "① くて も ② いかったら",
              "① くて も ② よかったら",
              "① いで も ② よかったら"
            ],
            "correct": 2,
            "why": "高くても; よかったら. → **{高|たか}くても、このストラップがほしいです。よかったら、{一緒|いっしょ}に{見|み}に{行|い}きませんか。** 〔Takakute mo, kono sutorappu ga hoshii desu. Yokattara, issho ni mi ni ikimasen ka.〕 — Dù đắt tôi vẫn muốn dây đeo này. Nếu được thì đi xem cùng tôi không?"
          },
          {
            "q": "{土曜日|どようび}はたぶん{混|こ}んでいる（①）{思|おも}います。{平日|へいじつ}（②）、すいていると{思|おも}います。　〔Doyoubi wa tabun konde iru ((1)) omoimasu. Heijitsu ((2)), suite iru to omoimasu.〕　— Tôi nghĩ thứ Bảy có lẽ đông. Nếu là ngày thường thì tôi nghĩ vắng.",
            "options": [
              "① と ② でも",
              "① そう ② でも",
              "① と ② だったら",
              "① だ と ② たら"
            ],
            "correct": 2,
            "why": "と 思います; 平日だったら. → **{土曜日|どようび}はたぶん{混|こ}んでいると{思|おも}います。{平日|へいじつ}だったら、すいていると{思|おも}います。** 〔Doyoubi wa tabun konde iru to omoimasu. Heijitsu dattara, suite iru to omoimasu.〕 — Tôi nghĩ thứ Bảy có lẽ đông. Nếu là ngày thường thì tôi nghĩ vắng."
          },
          {
            "q": "{電車|でんしゃ}が（①）、{急|いそ}いでも（②）と{思|おも}います。　〔Densha ga ((1)), isoide mo ((2)) to omoimasu.〕　— Tôi nghĩ nếu tàu đang dừng thì dù vội cũng không kịp.",
            "options": [
              "①{止|と}まっていたら②{間|ま}に{合|あ}わない",
              "①{止|と}まったも②{間|ま}に{合|あ}います",
              "①{止|と}めていたら②{間|ま}に{合|あ}わない",
              "①{止|と}まっていても②{間|ま}に{合|あ}う"
            ],
            "correct": 0,
            "why": "Nếu tàu dừng thì dù vội cũng không kịp. → **{電車|でんしゃ}が{止|と}まっていたら、{急|いそ}いでも{間|ま}に{合|あ}わないと{思|おも}います。** 〔Densha ga tomatte itara, isoide mo maniawanai to omoimasu.〕 — Tôi nghĩ nếu tàu đang dừng thì dù vội cũng không kịp."
          },
          {
            "q": "{子|こ}ども（①）、{無料|むりょう}です。{大人|おとな}（②）、{五百円|ごひゃくえん}です。　〔Kodomo ((1)), muryou desu. Otona ((2)), gohyakuen desu.〕　— Nếu là trẻ em thì miễn phí. Nếu là người lớn thì 500 yên.",
            "options": [
              "① だったら ② だったら",
              "① でも ② でも",
              "① だったら ② でも",
              "① かったら ② かったら"
            ],
            "correct": 0,
            "why": "N だったら … N だったら. → **{子|こ}どもだったら、{無料|むりょう}です。{大人|おとな}だったら、{五百円|ごひゃくえん}です。** 〔Kodomo dattara, muryou desu. Otona dattara, gohyakuen desu.〕 — Nếu là trẻ em thì miễn phí. Nếu là người lớn thì 500 yên."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np2-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Bạn thấy trong tạp chí có lễ hội pháo hoa, muốn rủ bạn nếu bạn rảnh.",
            "options": [
              "{土曜日|どようび}、{暇|ひま}と、{花火大会|はなびたいかい}に{行|い}きませんか。 (Doyoubi, hima to, hanabitaikai ni ikimasen ka.)",
              "{土曜日|どようび}、{暇|ひま}かったら、{花火大会|はなびたいかい}に{行|い}きませんか。 (Doyoubi, hima kattara, hanabitaikai ni ikimasen ka.)",
              "{土曜日|どようび}、{暇|ひま}でも、{花火大会|はなびたいかい}に{行|い}きませんか。 (Doyoubi, hima demo, hanabitaikai ni ikimasen ka.)",
              "{土曜日|どようび}、{暇|ひま}だったら、{花火大会|はなびたいかい}に{行|い}きませんか。 (Doyoubi, hima dattara, hanabitaikai ni ikimasen ka.)"
            ],
            "correct": 3,
            "why": "Rủ có điều kiện → 暇だったら."
          },
          {
            "q": "Bạn của bạn lo trời mưa. Bạn muốn nói \"dù mưa lễ hội vẫn có\".",
            "options": [
              "{雨|あめ}が{降|ふ}ったら、{大会|たいかい}はあるそうですよ。 (Ame ga futtara, taikai wa aru sou desu yo.)",
              "{雨|あめ}だったら、{大会|たいかい}がありますと{思|おも}います。 (Ame dattara, taikai ga arimasu to omoimasu.)",
              "{雨|あめ}が{降|ふ}っても、{大会|たいかい}はあるそうですよ。 (Ame ga futte mo, taikai wa aru sou desu yo.)",
              "{雨|あめ}で、{大会|たいかい}はあるそうですよ。 (Ame de, taikai wa aru sou desu yo.)"
            ],
            "correct": 2,
            "why": "ても + そうです."
          },
          {
            "q": "Bạn đoán quán ramen nổi tiếng chắc chắn sẽ đông vào cuối tuần.",
            "options": [
              "{週末|しゅうまつ}はきっと{混|こ}んでいると{思|おも}います。 (Shuumatsu wa kitto konde iru to omoimasu.)",
              "{週末|しゅうまつ}は{混|こ}んでいるそうでした。 (Shuumatsu wa konde iru sou deshita.)",
              "{週末|しゅうまつ}はもし{混|こ}んでいると{思|おも}います。 (Shuumatsu wa moshi konde iru to omoimasu.)",
              "{週末|しゅうまつ}は{混|こ}んだらと{思|おも}います。 (Shuumatsu wa kondara to omoimasu.)"
            ],
            "correct": 0,
            "why": "Đoán chắc → きっと ～と 思います."
          },
          {
            "q": "Bạn mời bạn cùng phòng ăn bánh mình mua.",
            "options": [
              "よかったら、{食|た}べてください。 (Yokattara, tabete kudasai.)",
              "いかったら、{食|た}べてください。 (Ikattara, tabete kudasai.)",
              "いいと、{食|た}べてください。 (Ii to, tabete kudasai.)",
              "よくても、{食|た}べてください。 (Yokute mo, tabete kudasai.)"
            ],
            "correct": 0,
            "why": "Mời lịch sự → よかったら."
          },
          {
            "q": "Bạn nói với bạn: \"Nếu không kịp tàu thì cứ đi trước.\"",
            "options": [
              "もし{間|ま}に{合|あ}わなかったら、{先|さき}に{行|い}ってください。 (Moshi maniawanakattara, saki ni itte kudasai.)",
              "もし{間|ま}に{合|あ}わなくても、{先|さき}に{行|い}ってください。 (Moshi maniawanakute mo, saki ni itte kudasai.)",
              "きっと{間|ま}に{合|あ}わなかったら、{先|さき}に{行|い}ってください。 (Kitto maniawanakattara, saki ni itte kudasai.)",
              "もし{間|ま}に{合|あ}わないと、{先|さき}に{行|い}ってください。 (Moshi maniawanai to, saki ni itte kudasai.)"
            ],
            "correct": 0,
            "why": "もし ～なかったら + ～てください."
          },
          {
            "q": "Bạn muốn nói: \"Dù đắt tôi vẫn muốn đi buổi hoà nhạc đó.\"",
            "options": [
              "{高|たか}いでも、あのコンサートに{行|い}きたいです。 (Takai demo, ano konsaato ni ikitai desu.)",
              "{高|たか}くても、あのコンサートに{行|い}きたいです。 (Takakute mo, ano konsaato ni ikitai desu.)",
              "{高|たか}かったら、あのコンサートに{行|い}きたいです。 (Takakattara, ano konsaato ni ikitai desu.)",
              "{高|たか}いと、あのコンサートに{行|い}きたいです。 (Takai to, ano konsaato ni ikitai desu.)"
            ],
            "correct": 1,
            "why": "Dù … → 高くても."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**～たら** = nếu (vế sau dùng được rủ, nhờ, mong muốn) · **もし** nhấn giả định · **よかったら** = nếu được thì… (mời). **～ても** = dù … vẫn (vế sau trái dự đoán) · イA くて も · ナA／N でも.",
          "**きっと** (chắc chắn) / **たぶん** (có lẽ) + 普通形 + と 思います — ナA／N + だ. Phân biệt: ～と 思います (mình đoán) · ～そうです (nghe người khác nói)."
        ]
      }
    ]
  },
  {
    "id": "lt-b15-np-3",
    "kind": "homework",
    "title": "Luyện thêm Bài 15 · Ngữ pháp 3 (ポイント 122) + TRỘN cả 6 điểm (119–124) — 町を歩いて: N が V（tự động từ）て います (trạng thái) (~104 câu)",
    "goal": "Ra phố tả ngắn gọn những gì đang thấy bằng tự động từ + ています (電車が 止まって います · 店が 閉まって います · 人が 並んで います · コップが 汚れて います · 席が すいて います), chọn đúng cặp tự / tha động từ (止まる／止める · 閉まる／閉める · 消える／消す), rồi đề nghị cách khác; cuối bài TRỘN cả 6 điểm 119–124.",
    "minutes": 85,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**ポイント 122 — N が V (tự động từ) て います** = trạng thái **còn lại sau khi việc đã xảy ra**, đang nhìn thấy trước mắt: 電車が 止まって**います** (tàu đã dừng và vẫn đang dừng) · 店が 閉まって**います** · 窓ガラスが 割れて**います** · 財布が 落ちて**います**. Chủ ngữ là **vật**, trợ từ **が**.",
          "Phân biệt 3 nghĩa của ～ています: **đang làm** (Bài 6: 今 テレビを 見て います) · **thói quen / giai đoạn** (Bài 11: 毎朝 ジョギングを して います) · **trạng thái** (Bài 13: 帽子を かぶって います; **Bài 15: 電気が 消えて います**). Bài 15 dùng **tự động từ**: 止まる・閉まる・消える・壊れる・汚れる・割れる・落ちる・集まる・混む・すく・並ぶ.",
          "Cặp tự / tha (表 p.288): 止まる／止める · 始まる／始める · 集まる／集める · 閉まる／閉める · 開く／開ける · 消える／消す · つく／つける · 出る／出す. **Tự (が) + ています = trạng thái**; tha (を) + ています = người đang làm. Đề hay bắt: ~~電気を 消えて います~~ · ~~ドアが 閉めて います~~."
        ]
      },
      {
        "t": "recap",
        "title": "Khuôn tả cảnh + đề nghị (đúng kiểu sách)",
        "items": [
          "**あっ、N が ～て います。** — あっ、電車が 止まって います。 → **本当だ。** (nói với bạn)",
          "**あのう、N が ～て います。** (báo nhân viên) — あのう、コップが 汚れて います。 → **あっ、すみません。**",
          "**～て いますね。じゃ、～ませんか。** — 店が 閉まって いますね。じゃ、ほかの 店に 行きませんか。"
        ]
      },
      {
        "t": "table",
        "head": [
          "Tự động từ (が) — Bài 15",
          "Trạng thái (122)",
          "Tha động từ (を)",
          "Người đang làm"
        ],
        "rows": [
          [
            "止まる (dừng)",
            "電車が 止まって います",
            "止める",
            "車を 止めて います"
          ],
          [
            "閉まる (đóng)",
            "店が 閉まって います",
            "閉める",
            "窓を 閉めて います"
          ],
          [
            "消える (tắt)",
            "電気が 消えて います",
            "消す",
            "電気を 消して います"
          ],
          [
            "集まる (tụ tập)",
            "人が 集まって います",
            "集める",
            "切手を 集めて います"
          ],
          [
            "始まる (bắt đầu)",
            "もう 授業が 始まって います",
            "始める",
            "練習を 始めて います"
          ],
          [
            "割れる · 壊れる · 汚れる · 落ちる",
            "コップが 割れて います · 時計が 壊れて います …",
            "(chưa học tha động từ)",
            "—"
          ]
        ],
        "caption": "Cặp tự / tha động từ và ～ています"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · ポイント 122 · chọn tự / tha động từ"
      },
      {
        "t": "mcq",
        "id": "lt-b15-np3-122",
        "title": "ポイント 122: N が V て います (trạng thái) (12 câu)",
        "items": [
          {
            "q": "あっ、{電車|でんしゃ}が＿＿います。　〔A, densha ga __ imasu.〕　— Ơ, tàu đang dừng kìa.",
            "options": [
              "{止|と}めて",
              "{止|と}まって",
              "{止|と}まり",
              "{止|と}まる"
            ],
            "correct": 1,
            "why": "Tàu đã dừng, vẫn đang dừng → 止まって います. → **あっ、{電車|でんしゃ}が{止|と}まっています。** 〔A, densha ga tomatte imasu.〕 — Ơ, tàu đang dừng kìa."
          },
          {
            "q": "もう{九時|くじ}ですから、{店|みせ}が＿＿います。　〔Mou kuji desu kara, mise ga __ imasu.〕　— Đã 9 giờ rồi nên cửa hàng đóng cửa rồi.",
            "options": [
              "{閉|し}まった",
              "{閉|し}まって",
              "{閉|し}まる",
              "{閉|し}めて"
            ],
            "correct": 1,
            "why": "Cửa hàng đã đóng → 閉まって います. → **もう{九時|くじ}ですから、{店|みせ}が{閉|し}まっています。** 〔Mou kuji desu kara, mise ga shimatte imasu.〕 — Đã 9 giờ rồi nên cửa hàng đóng cửa rồi."
          },
          {
            "q": "あのう、このコップ、＿＿います。　〔Anou, kono koppu, __ imasu.〕　— Dạ, cái cốc này bị bẩn ạ.",
            "options": [
              "{汚|よご}れ",
              "{汚|よご}れて",
              "{汚|よご}れた",
              "{汚|よご}れる"
            ],
            "correct": 1,
            "why": "Bẩn (trạng thái) → 汚れて います. → **あのう、このコップ、{汚|よご}れています。** 〔Anou, kono koppu, yogorete imasu.〕 — Dạ, cái cốc này bị bẩn ạ."
          },
          {
            "q": "{入|い}り{口|ぐち}に{人|ひと}がたくさん＿＿います。　〔Iriguchi ni hito ga takusan __ imasu.〕　— Ở cửa vào có rất nhiều người đang xếp hàng.",
            "options": [
              "{並|なら}べて",
              "{並|なら}ぶ",
              "{並|なら}んだ",
              "{並|なら}んで"
            ],
            "correct": 3,
            "why": "Người xếp hàng → 並んで います. → **{入|い}り{口|ぐち}に{人|ひと}がたくさん{並|なら}んでいます。** 〔Iriguchi ni hito ga takusan narande imasu.〕 — Ở cửa vào có rất nhiều người đang xếp hàng."
          },
          {
            "q": "{窓|まど}ガラスが＿＿いますよ。{危|あぶ}ないです。　〔Mado garasu ga __ imasu yo. Abunai desu.〕　— Kính cửa sổ bị vỡ đấy. Nguy hiểm.",
            "options": [
              "{割|わ}れ",
              "{割|わ}れて",
              "{割|わ}れる",
              "{割|わ}れた"
            ],
            "correct": 1,
            "why": "Kính đã vỡ → 割れて います. → **{窓|まど}ガラスが{割|わ}れていますよ。{危|あぶ}ないです。** 〔Mado garasu ga warete imasu yo. Abunai desu.〕 — Kính cửa sổ bị vỡ đấy. Nguy hiểm."
          },
          {
            "q": "{部屋|へや}の{電気|でんき}が＿＿います。　〔Heya no denki ga __ imasu.〕　— Đèn trong phòng đang tắt.",
            "options": [
              "{消|き}えた",
              "{消|き}えて",
              "{消|き}える",
              "{消|け}して"
            ],
            "correct": 1,
            "why": "Đèn tắt (trạng thái) → 消えて います. → **{部屋|へや}の{電気|でんき}が{消|き}えています。** 〔Heya no denki ga kiete imasu.〕 — Đèn trong phòng đang tắt."
          },
          {
            "q": "このエアコンは＿＿います。{使|つか}わないでください。　〔Kono eakon wa __ imasu. Tsukawanaide kudasai.〕　— Máy điều hoà này bị hỏng. Đừng dùng.",
            "options": [
              "{壊|こわ}れ",
              "{壊|こわ}れる",
              "{壊|こわ}れた",
              "{壊|こわ}れて"
            ],
            "correct": 3,
            "why": "Hỏng → 壊れて います. → **このエアコンは{壊|こわ}れています。{使|つか}わないでください。** 〔Kono eakon wa kowarete imasu. Tsukawanaide kudasai.〕 — Máy điều hoà này bị hỏng. Đừng dùng."
          },
          {
            "q": "{道|みち}に{財布|さいふ}が＿＿います。　〔Michi ni saifu ga __ imasu.〕　— Trên đường có cái ví bị rơi.",
            "options": [
              "{落|お}ちた",
              "{落|お}ちて",
              "{落|お}ちる",
              "{落|お}ち"
            ],
            "correct": 1,
            "why": "Rơi (nằm đó) → 落ちて います. → **{道|みち}に{財布|さいふ}が{落|お}ちています。** 〔Michi ni saifu ga ochite imasu.〕 — Trên đường có cái ví bị rơi."
          },
          {
            "q": "{平日|へいじつ}の{午後|ごご}ですから、{電車|でんしゃ}は＿＿います。　〔Heijitsu no gogo desu kara, densha wa __ imasu.〕　— Vì là buổi chiều ngày thường nên tàu vắng.",
            "options": [
              "すいた",
              "{混|こ}んで",
              "すく",
              "すいて"
            ],
            "correct": 3,
            "why": "Vắng → すいて います. → **{平日|へいじつ}の{午後|ごご}ですから、{電車|でんしゃ}はすいています。** 〔Heijitsu no gogo desu kara, densha wa suite imasu.〕 — Vì là buổi chiều ngày thường nên tàu vắng."
          },
          {
            "q": "ホールに{人|ひと}がたくさん＿＿います。　〔Hooru ni hito ga takusan __ imasu.〕　— Ở hội trường có rất nhiều người đang tụ tập.",
            "options": [
              "{集|あつ}まって",
              "{集|あつ}めて",
              "{集|あつ}まる",
              "{集|あつ}まった"
            ],
            "correct": 0,
            "why": "Người tụ tập → 集まって います. → **ホールに{人|ひと}がたくさん{集|あつ}まっています。** 〔Hooru ni hito ga takusan atsumatte imasu.〕 — Ở hội trường có rất nhiều người đang tụ tập."
          },
          {
            "q": "Câu này nghĩa là gì? あっ、{店|みせ}の{電気|でんき}が{消|き}えています。　〔A, mise no denki ga kiete imasu.〕",
            "options": [
              "Hãy tắt đèn cửa hàng.",
              "Ơ, người ta đang tắt đèn cửa hàng.",
              "Nghe nói đèn cửa hàng sẽ tắt.",
              "Ơ, đèn cửa hàng tắt rồi."
            ],
            "correct": 3,
            "why": "Tự động từ + ています = trạng thái trước mắt."
          },
          {
            "q": "A：あっ、{電車|でんしゃ}が{止|と}まっています。B：＿＿。{事故|じこ}ですかね。　〔A: a, densha ga tomatte imasu. B: __. Jiko desu ka ne.〕　— A: Ơ, tàu đang dừng. B: Thật này. Tai nạn hay sao nhỉ.",
            "options": [
              "よかったですね",
              "いただきます",
              "おめでとう",
              "{本当|ほんとう}だ"
            ],
            "correct": 3,
            "why": "Với bạn: 本当だ (thật này). → **A：あっ、{電車|でんしゃ}が{止|と}まっています。B：{本当|ほんとう}だ。{事故|じこ}ですかね。** 〔A: a, densha ga tomatte imasu. B: hontou da. Jiko desu ka ne.〕 — A: Ơ, tàu đang dừng. B: Thật này. Tai nạn hay sao nhỉ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np3-tutha",
        "title": "Chọn tự động từ / tha động từ đúng (10 câu)",
        "items": [
          {
            "q": "{部屋|へや}を{出|で}るとき、{電気|でんき}を＿＿ください。　〔Heya o deru toki, denki o __ kudasai.〕　— Khi ra khỏi phòng hãy tắt đèn.",
            "options": [
              "{消|け}して",
              "{消|け}した",
              "{消|き}えた",
              "{消|き}えて"
            ],
            "correct": 0,
            "why": "Người tắt đèn → tha động từ 消します (を 消して). → **{部屋|へや}を{出|で}るとき、{電気|でんき}を{消|け}してください。** 〔Heya o deru toki, denki o keshite kudasai.〕 — Khi ra khỏi phòng hãy tắt đèn."
          },
          {
            "q": "{地震|じしん}で{電気|でんき}が＿＿。　〔Jishin de denki ga __.〕　— Vì động đất mà đèn tắt.",
            "options": [
              "{消|き}えました",
              "{消|き}えてください",
              "{消|け}してください",
              "{消|け}しました"
            ],
            "correct": 0,
            "why": "Đèn tự tắt → 消えました. → **{地震|じしん}で{電気|でんき}が{消|き}えました。** 〔Jishin de denki ga kiemashita.〕 — Vì động đất mà đèn tắt."
          },
          {
            "q": "すみません、{窓|まど}を＿＿もいいですか。　〔Sumimasen, mado o __ mo ii desu ka.〕　— Xin lỗi, tôi đóng cửa sổ được không?",
            "options": [
              "{閉|し}まって",
              "{閉|し}まる",
              "{閉|し}めて",
              "{閉|し}めた"
            ],
            "correct": 2,
            "why": "Mình đóng → tha động từ 閉めます. → **すみません、{窓|まど}を{閉|し}めてもいいですか。** 〔Sumimasen, mado o shimete mo ii desu ka.〕 — Xin lỗi, tôi đóng cửa sổ được không?"
          },
          {
            "q": "{風|かぜ}でドアが＿＿。　〔Kaze de doa ga __.〕　— Vì gió mà cửa đóng lại.",
            "options": [
              "{閉|し}まりました",
              "{閉|し}めました",
              "{閉|し}まってください",
              "{閉|し}めてください"
            ],
            "correct": 0,
            "why": "Cửa tự đóng (do gió) → 閉まりました. → **{風|かぜ}でドアが{閉|し}まりました。** 〔Kaze de doa ga shimarimashita.〕 — Vì gió mà cửa đóng lại."
          },
          {
            "q": "ここに{車|くるま}を＿＿はいけません。　〔Koko ni kuruma o __ wa ikemasen.〕　— Không được đỗ xe ở đây.",
            "options": [
              "{止|と}まる",
              "{止|と}まって",
              "{止|と}めて",
              "{止|と}めた"
            ],
            "correct": 2,
            "why": "Người đỗ xe → 止めます. → **ここに{車|くるま}を{止|と}めてはいけません。** 〔Koko ni kuruma o tomete wa ikemasen.〕 — Không được đỗ xe ở đây."
          },
          {
            "q": "{授業|じゅぎょう}はもう＿＿いますよ。{急|いそ}いで！　〔Jugyou wa mou __ imasu yo. Isoide!〕　— Giờ học bắt đầu rồi đấy. Nhanh lên!",
            "options": [
              "{始|はじ}めて",
              "{始|はじ}まる",
              "{始|はじ}まって",
              "{始|はじ}めた"
            ],
            "correct": 2,
            "why": "Giờ học đã bắt đầu → 始まって います. → **{授業|じゅぎょう}はもう{始|はじ}まっていますよ。{急|いそ}いで！** 〔Jugyou wa mou hajimatte imasu yo. Isoide!〕 — Giờ học bắt đầu rồi đấy. Nhanh lên!"
          },
          {
            "q": "{先生|せんせい}が{学生|がくせい}の{宿題|しゅくだい}を＿＿います。　〔Sensei ga gakusei no shukudai o __ imasu.〕　— Thầy đang thu bài tập của sinh viên.",
            "options": [
              "{集|あつ}まる",
              "{集|あつ}まって",
              "{集|あつ}めて",
              "{集|あつ}めた"
            ],
            "correct": 2,
            "why": "Người thu gom → tha động từ 集めます. → **{先生|せんせい}が{学生|がくせい}の{宿題|しゅくだい}を{集|あつ}めています。** 〔Sensei ga gakusei no shukudai o atsumete imasu.〕 — Thầy đang thu bài tập của sinh viên."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "あっ、{電気|でんき}が{消|き}えています。 (A, denki ga kiete imasu.)",
              "あっ、{電気|でんき}が{消|け}しています。 (A, denki ga keshite imasu.)",
              "あっ、{電気|でんき}を{消|き}えています。 (A, denki o kiete imasu.)",
              "あっ、{電気|でんき}を{消|き}えます。 (A, denki o kiemasu.)"
            ],
            "correct": 0,
            "why": "Trạng thái: 電気**が** 消えて います."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{店|みせ}のドアを{閉|し}まっています。 (Mise no doa o shimatte imasu.)",
              "{店|みせ}のドアが{閉|し}まりますいます。 (Mise no doa ga shimarimasu imasu.)",
              "{店|みせ}のドアが{閉|し}めています。 (Mise no doa ga shimete imasu.)",
              "{店|みせ}のドアが{閉|し}まっています。 (Mise no doa ga shimatte imasu.)"
            ],
            "correct": 3,
            "why": "Trạng thái: ドア**が** 閉まって います."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "バスが{駅|えき}の{前|まえ}を{止|と}まっています。 (Basu ga eki no mae o tomatte imasu.)",
              "バスが{駅|えき}の{前|まえ}に{止|と}めています。 (Basu ga eki no mae ni tomete imasu.)",
              "バスが{駅|えき}の{前|まえ}に{止|と}まっています。 (Basu ga eki no mae ni tomatte imasu.)",
              "バスを{駅|えき}の{前|まえ}に{止|と}まっています。 (Basu o eki no mae ni tomatte imasu.)"
            ],
            "correct": 2,
            "why": "Xe đang đỗ (trạng thái): バス**が** ～**に** 止まって います."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np3-nghia",
        "title": "Ba nghĩa của ～ています: đang làm · thói quen · trạng thái (8 câu)",
        "items": [
          {
            "q": "Nghĩa của ～ています trong: {電車|でんしゃ}が{止|と}まっています。　〔Densha ga tomatte imasu.〕",
            "options": [
              "Thói quen",
              "Trạng thái còn lại (đã dừng, vẫn đang dừng)",
              "Đang làm (hành động đang diễn ra)",
              "Kế hoạch tương lai"
            ],
            "correct": 1,
            "why": "Tự động từ + ています → trạng thái (122)."
          },
          {
            "q": "Nghĩa của ～ています trong: {今|いま}{友達|ともだち}と{電話|でんわ}をしています。　〔Ima tomodachi to denwa o shite imasu.〕",
            "options": [
              "Đang làm (hành động đang diễn ra)",
              "Thói quen",
              "Trạng thái còn lại",
              "Đã xong"
            ],
            "correct": 0,
            "why": "Bài 6: 今 ～て います = đang làm."
          },
          {
            "q": "Nghĩa của ～ています trong: {毎朝|まいあさ}ジョギングをしています。　〔Maiasa jogingu o shite imasu.〕",
            "options": [
              "Đã xong",
              "Đang làm ngay lúc này",
              "Thói quen",
              "Trạng thái còn lại"
            ],
            "correct": 2,
            "why": "Bài 11: 毎朝 ～て います = thói quen."
          },
          {
            "q": "Nghĩa của ～ています trong: {窓|まど}ガラスが{割|わ}れています。　〔Mado garasu ga warete imasu.〕",
            "options": [
              "Đang vỡ dần",
              "Sắp vỡ",
              "Trạng thái còn lại (kính đã vỡ)",
              "Thói quen"
            ],
            "correct": 2,
            "why": "Tự động từ 割れる + ています → trạng thái."
          },
          {
            "q": "Nghĩa của ～ています trong: あの{人|ひと}は{眼鏡|めがね}をかけています。　〔Ano hito wa megane o kakete imasu.〕",
            "options": [
              "Đang đeo vào (động tác)",
              "Trạng thái (đang đeo kính)",
              "Thói quen",
              "Kế hoạch"
            ],
            "correct": 1,
            "why": "Bài 13: mặc / đội / đeo + ています = trạng thái."
          },
          {
            "q": "Nghĩa của ～ています trong: {入|い}り{口|ぐち}に{人|ひと}が{集|あつ}まっています。　〔Iriguchi ni hito ga atsumatte imasu.〕",
            "options": [
              "Kế hoạch tương lai",
              "Thói quen",
              "Trạng thái (người đã tụ tập, đang ở đó)",
              "Đã giải tán"
            ],
            "correct": 2,
            "why": "集まる (tự) + ています → trạng thái."
          },
          {
            "q": "Nghĩa của ～ています trong: {姉|あね}は{銀行|ぎんこう}で{働|はたら}いています。　〔Ane wa ginkou de hataraite imasu.〕",
            "options": [
              "Đang làm ngay giây này",
              "Đã nghỉ việc",
              "Trạng thái còn lại",
              "Việc làm trong giai đoạn này (thói quen)"
            ],
            "correct": 3,
            "why": "Bài 11: 働いて います = làm việc (giai đoạn)."
          },
          {
            "q": "Nghĩa của ～ています trong: この{店|みせ}はもう{閉|し}まっています。　〔Kono mise wa mou shimatte imasu.〕",
            "options": [
              "Trạng thái (đã đóng cửa)",
              "Thói quen đóng cửa",
              "Đang đóng cửa dần",
              "Sắp đóng cửa"
            ],
            "correct": 0,
            "why": "閉まる + ています → trạng thái."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · tả cảnh + đề nghị · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b15-np3-dap",
        "title": "Tả cảnh — chọn câu tiếp theo hợp lý (8 câu)",
        "items": [
          {
            "q": "{店|みせ} が {閉|し}まって います ね 。 — câu tiếp theo:",
            "options": [
              "じゃ、ほかの{店|みせ}に{行|い}きませんか。 (Ja, hoka no mise ni ikimasen ka.)",
              "じゃ、この{店|みせ}で{食|た}べましょう。 (Ja, kono mise de tabemashou.)",
              "じゃ、{店|みせ}に{入|はい}りましょう。 (Ja, mise ni hairimashou.)",
              "よかったですね。 (Yokatta desu ne.)"
            ],
            "correct": 0,
            "why": "Đóng cửa → đề nghị đi quán khác."
          },
          {
            "q": "あっ 、 {電車|でんしゃ} が {止|と}まって います 。 — câu tiếp theo:",
            "options": [
              "バスで{行|い}きませんか。 (Basu de ikimasen ka.)",
              "{電車|でんしゃ}で{行|い}きましょう。 (Densha de ikimashou.)",
              "いただきます。 (Itadakimasu.)",
              "{電車|でんしゃ}に{乗|の}りましょう。 (Densha ni norimashou.)"
            ],
            "correct": 0,
            "why": "Tàu dừng → đề nghị đi xe buýt."
          },
          {
            "q": "（{店|みせ} の {人|ひと} に） あのう 、 フォーク が {汚|よご}れて います 。 — nhân viên đáp:",
            "options": [
              "じゃ、ほかの{店|みせ}に{行|い}きましょう。 (Ja, hoka no mise ni ikimashou.)",
              "よかったですね。 (Yokatta desu ne.)",
              "{本当|ほんとう}だ。 (Hontou da.)",
              "あっ、すみません。すぐ{持|も}って{来|き}ます。 (A, sumimasen. Sugu motte kimasu.)"
            ],
            "correct": 3,
            "why": "Nhân viên xin lỗi và mang cái khác."
          },
          {
            "q": "{入|い}り{口|ぐち} に {人|ひと} が たくさん {並|なら}んで います ね 。 — câu tiếp theo:",
            "options": [
              "だれもいないと{思|おも}います。 (Dare mo inai to omoimasu.)",
              "たぶんすいていると{思|おも}います。 (Tabun suite iru to omoimasu.)",
              "{店|みせ}が{閉|し}まっています。 (Mise ga shimatte imasu.)",
              "きっと{人気|にんき}があると{思|おも}います。 (Kitto ninki ga aru to omoimasu.)"
            ],
            "correct": 3,
            "why": "Xếp hàng dài → đoán quán nổi tiếng."
          },
          {
            "q": "A： {席|せき} 、 すいて います か 。 B： すみません 。 {今|いま} {全部|ぜんぶ} {混|こ}んで います 。 — A đáp:",
            "options": [
              "じゃ、{待|ま}ちます。 (Ja, machimasu.)",
              "じゃ、{座|すわ}ります。 (Ja, suwarimasu.)",
              "よかった。 (Yokatta.)",
              "じゃ、{席|せき}を{閉|し}めてください。 (Ja, seki o shimete kudasai.)"
            ],
            "correct": 0,
            "why": "Hết chỗ → chờ."
          },
          {
            "q": "あっ 、 {財布|さいふ} が {落|お}ちて います よ 。 — câu tiếp theo:",
            "options": [
              "{財布|さいふ}が{閉|し}まっています。 (Saifu ga shimatte imasu.)",
              "{財布|さいふ}を{落|お}ちましょう。 (Saifu o ochimashou.)",
              "よかった、{本当|ほんとう}だ。 (Yokatta, hontou da.)",
              "{交番|こうばん}に{持|も}って{行|い}きましょう。 (Kouban ni motte ikimashou.)"
            ],
            "correct": 3,
            "why": "Thấy ví rơi → đem tới đồn cảnh sát."
          },
          {
            "q": "{雨|あめ} が やんで います よ 。 — câu tiếp theo:",
            "options": [
              "じゃ、{出|で}かけましょう。 (Ja, dekakemashou.)",
              "{怖|こわ}いですね。 (Kowai desu ne.)",
              "じゃ、{傘|かさ}を{持|も}って{行|い}きましょう。 (Ja, kasa o motte ikimashou.)",
              "{雨|あめ}が{降|ふ}っていますね。 (Ame ga futte imasu ne.)"
            ],
            "correct": 0,
            "why": "Mưa tạnh → ra ngoài."
          },
          {
            "q": "この エレベーター 、 {壊|こわ}れて います 。 — câu tiếp theo:",
            "options": [
              "じゃ、{歩|ある}いて{行|い}きましょう。 (Ja, aruite ikimashou.)",
              "エレベーターが{止|と}めています。 (Erebeetaa ga tomete imasu.)",
              "{楽|たの}しいですね。 (Tanoshii desu ne.)",
              "エレベーターに{乗|の}りましょう。 (Erebeetaa ni norimashou.)"
            ],
            "correct": 0,
            "why": "Thang máy hỏng → đi bộ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np3-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "あっ、{電車|でんしゃ}が{止|と}まっています。 (A, densha ga tomatte imasu.)",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まっています。 (Jiko de densha ga tomatte imasu.)",
              "{駅|えき}の{前|まえ}にバスが{止|と}まっています。 (Eki no mae ni basu ga tomatte imasu.)",
              "あっ、{電車|でんしゃ}を{止|と}まっています。 (A, densha o tomatte imasu.)"
            ],
            "correct": 3,
            "why": "Tự động từ 止まる đi với **が**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{店|みせ}が{閉|し}まっています。 (Mise ga shimatte imasu.)",
              "{母|はは}が{窓|まど}を{閉|し}めています。 (Haha ga mado o shimete imasu.)",
              "{店|みせ}が{閉|し}めています。 (Mise ga shimete imasu.)",
              "{窓|まど}が{閉|し}まっています。 (Mado ga shimatte imasu.)"
            ],
            "correct": 2,
            "why": "Trạng thái của cửa hàng → **閉まって** います (tự động từ)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "シャツが{汚|よご}れています。 (Shatsu ga yogorete imasu.)",
              "テーブルが{汚|よご}れています。 (Teeburu ga yogorete imasu.)",
              "コップが{汚|よご}れますいます。 (Koppu ga yogoremasu imasu.)",
              "コップが{汚|よご}れています。 (Koppu ga yogorete imasu.)"
            ],
            "correct": 2,
            "why": "Thể て 汚れて + います."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{電気|でんき}を{消|け}してください。 (Denki o keshite kudasai.)",
              "{電気|でんき}が{消|き}えました。 (Denki ga kiemashita.)",
              "{電気|でんき}が{消|け}しています。 (Denki ga keshite imasu.)",
              "{電気|でんき}が{消|き}えています。 (Denki ga kiete imasu.)"
            ],
            "correct": 2,
            "why": "Trạng thái đèn → **消えて** います (tự); 消して là tha."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{店|みせ}がすいています。 (Mise ga suite imasu.)",
              "{電車|でんしゃ}が{混|こ}んでいます。 (Densha ga konde imasu.)",
              "{電車|でんしゃ}がすきています。 (Densha ga sukite imasu.)",
              "{電車|でんしゃ}がすいています。 (Densha ga suite imasu.)"
            ],
            "correct": 2,
            "why": "すく (nhóm 1) → **すいて** います."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{入|い}り{口|ぐち}に{人|ひと}が{並|なら}んでいます。 (Iriguchi ni hito ga narande imasu.)",
              "{入|い}り{口|ぐち}に{人|ひと}が{並|なら}びています。 (Iriguchi ni hito ga narabite imasu.)",
              "{会場|かいじょう}に{人|ひと}が{集|あつ}まっています。 (Kaijou ni hito ga atsumatte imasu.)",
              "ホールに{人|ひと}が{集|あつ}まっていました。 (Hooru ni hito ga atsumatte imashita.)"
            ],
            "correct": 1,
            "why": "並ぶ (nhóm 1) → **並んで**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "テーブルの{下|した}にペンが{落|お}ちています。 (Teeburu no shita ni pen ga ochite imasu.)",
              "{道|みち}に{財布|さいふ}が{落|お}ちています。 (Michi ni saifu ga ochite imasu.)",
              "{道|みち}に{財布|さいふ}を{落|お}ちています。 (Michi ni saifu o ochite imasu.)",
              "{駅|えき}に{傘|かさ}が{落|お}ちています。 (Eki ni kasa ga ochite imasu.)"
            ],
            "correct": 2,
            "why": "Tự động từ 落ちる → **が**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{先生|せんせい}が{授業|じゅぎょう}を{始|はじ}めました。 (Sensei ga jugyou o hajimemashita.)",
              "コンサートはもう{始|はじ}まっています。 (Konsaato wa mou hajimatte imasu.)",
              "{授業|じゅぎょう}がもう{始|はじ}めています。 (Jugyou ga mou hajimete imasu.)",
              "{授業|じゅぎょう}がもう{始|はじ}まっています。 (Jugyou ga mou hajimatte imasu.)"
            ],
            "correct": 2,
            "why": "Giờ học (tự bắt đầu) → **始まって** います."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-np3-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "122: N が V (tự động từ) て います",
        "items": [
          {
            "q": "Ơ, tàu đang dừng kìa.",
            "answers": [
              "あっ、電車が止まっています。",
              "あっ、電車がとまっています。",
              "あっ、でんしゃが止まっています。",
              "あっ、でんしゃがとまっています。"
            ],
            "hint": "止まって います"
          },
          {
            "q": "Cửa hàng đóng cửa rồi.",
            "answers": [
              "店が閉まっています。",
              "店がしまっています。",
              "みせが閉まっています。",
              "みせがしまっています。",
              "店は閉まっています。",
              "店はしまっています。",
              "みせは閉まっています。",
              "みせはしまっています。"
            ],
            "hint": "閉まって います"
          },
          {
            "q": "Dạ, cái cốc bị bẩn ạ.",
            "answers": [
              "あのう、コップが汚れています。",
              "あのう、コップがよごれています。"
            ],
            "hint": "汚れて います"
          },
          {
            "q": "Có nhiều người đang xếp hàng.",
            "answers": [
              "人がたくさん並んでいます。",
              "人がたくさんならんでいます。",
              "ひとがたくさん並んでいます。",
              "ひとがたくさんならんでいます。"
            ],
            "hint": "並んで います"
          },
          {
            "q": "Đèn đang tắt.",
            "answers": [
              "電気が消えています。",
              "電気がきえています。",
              "でんきが消えています。",
              "でんきがきえています。"
            ],
            "hint": "消えて います"
          },
          {
            "q": "Kính cửa sổ bị vỡ.",
            "answers": [
              "窓ガラスが割れています。",
              "窓ガラスがわれています。",
              "まどガラスが割れています。",
              "まどガラスがわれています。",
              "窓が割れています。",
              "窓がわれています。",
              "まどが割れています。",
              "まどがわれています。"
            ],
            "hint": "割れて います"
          },
          {
            "q": "Quán vắng nhỉ.",
            "answers": [
              "店がすいていますね。",
              "みせがすいていますね。",
              "店はすいていますね。",
              "みせはすいていますね。"
            ],
            "hint": "すいて います"
          },
          {
            "q": "Máy tính bị hỏng.",
            "answers": [
              "パソコンが壊れています。",
              "パソコンがこわれています。"
            ],
            "hint": "壊れて います"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-np3-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Ơ, tàu đang dừng. Đi xe buýt không?",
            "chips": [
              "{止|と}まっています。",
              "バスで{行|い}きませんか",
              "あっ、{電車|でんしゃ}が",
              "{止|と}めています。"
            ],
            "answer": [
              "あっ、{電車|でんしゃ}が",
              "{止|と}まっています。",
              "バスで{行|い}きませんか"
            ],
            "ro": "A, densha ga tomatte imasu. Basu de ikimasenka"
          },
          {
            "vi": "Cửa hàng đóng cửa rồi nhỉ. Đi quán khác nhé.",
            "chips": [
              "{閉|し}めていますね。",
              "ほかの{店|みせ}に{行|い}きましょう",
              "{閉|し}まっていますね。",
              "{店|みせ}が"
            ],
            "answer": [
              "{店|みせ}が",
              "{閉|し}まっていますね。",
              "ほかの{店|みせ}に{行|い}きましょう"
            ],
            "ro": "Mise ga shimatte imasu ne. Hoka no mise ni ikimashou"
          },
          {
            "vi": "Dạ, cái cốc này bị bẩn.",
            "chips": [
              "このコップが",
              "あのう、",
              "{汚|よご}れます",
              "{汚|よご}れています"
            ],
            "answer": [
              "あのう、",
              "このコップが",
              "{汚|よご}れています"
            ],
            "ro": "Anou, kono koppu ga yogorete imasu"
          },
          {
            "vi": "Ở cửa vào có nhiều người đang xếp hàng.",
            "chips": [
              "{並|なら}びています",
              "{人|ひと}がたくさん",
              "{並|なら}んでいます",
              "{入|い}り{口|ぐち}に"
            ],
            "answer": [
              "{入|い}り{口|ぐち}に",
              "{人|ひと}がたくさん",
              "{並|なら}んでいます"
            ],
            "ro": "Iriguchi ni hito ga takusan narande imasu"
          },
          {
            "vi": "Vì tai nạn mà tàu điện đang dừng.",
            "chips": [
              "{電車|でんしゃ}が",
              "{事故|じこ}に",
              "{止|と}まっています",
              "{事故|じこ}で"
            ],
            "answer": [
              "{事故|じこ}で",
              "{電車|でんしゃ}が",
              "{止|と}まっています"
            ],
            "ro": "Jiko de densha ga tomatte imasu"
          },
          {
            "vi": "Trên đường có cái ví bị rơi.",
            "chips": [
              "{落|お}ちています",
              "{財布|さいふ}が",
              "{財布|さいふ}を",
              "{道|みち}に"
            ],
            "answer": [
              "{道|みち}に",
              "{財布|さいふ}が",
              "{落|お}ちています"
            ],
            "ro": "Michi ni saifu ga ochite imasu"
          },
          {
            "vi": "Đèn phòng đang tắt. Chắc không có ai.",
            "chips": [
              "{消|け}しています。",
              "たぶんだれもいないと{思|おも}います",
              "{消|き}えています。",
              "{部屋|へや}の{電気|でんき}が"
            ],
            "answer": [
              "{部屋|へや}の{電気|でんき}が",
              "{消|き}えています。",
              "たぶんだれもいないと{思|おも}います"
            ],
            "ro": "Heya no denki ga kiete imasu. Tabun dare mo inai to omoimasu"
          },
          {
            "vi": "Tàu vắng. Ngồi thôi.",
            "chips": [
              "{電車|でんしゃ}が",
              "{座|すわ}りましょう",
              "{混|こ}んでいます。",
              "すいています。"
            ],
            "answer": [
              "{電車|でんしゃ}が",
              "すいています。",
              "{座|すわ}りましょう"
            ],
            "ro": "Densha ga suite imasu. Suwarimashou"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · TRỘN cả 6 điểm (119–124) · dịch · nhiều ô trống · tình huống"
      },
      {
        "t": "mcq",
        "id": "lt-b15-np3-tron",
        "title": "TRỘN ポイント 119–124 (20 câu)",
        "items": [
          {
            "q": "{明日|あした}は{雨|あめ}＿＿そうです。　〔Ashita wa ame __ sou desu.〕　— Nghe nói mai mưa.",
            "options": [
              "だ",
              "の",
              "です",
              "な"
            ],
            "correct": 0,
            "why": "119: N + だ そうです. → **{明日|あした}は{雨|あめ}だそうです。** 〔Ashita wa ame da sou desu.〕 — Nghe nói mai mưa."
          },
          {
            "q": "{台風|たいふう}＿＿{電車|でんしゃ}が{止|と}まりました。　〔Taifuu __ densha ga tomarimashita.〕　— Vì bão mà tàu dừng.",
            "options": [
              "に",
              "で",
              "を",
              "と"
            ],
            "correct": 1,
            "why": "124: nguyên nhân で. → **{台風|たいふう}で{電車|でんしゃ}が{止|と}まりました。** 〔Taifuu de densha ga tomarimashita.〕 — Vì bão mà tàu dừng."
          },
          {
            "q": "{雨|あめ}が＿＿、{中止|ちゅうし}です。　〔Ame ga __, chuushi desu.〕　— Nếu mưa thì huỷ.",
            "options": [
              "{降|ふ}っても",
              "{降|ふ}ったら",
              "{降|ふ}るそう",
              "{降|ふ}っていて"
            ],
            "correct": 1,
            "why": "120: nếu mưa → huỷ. → **{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}です。** 〔Ame ga futtara, chuushi desu.〕 — Nếu mưa thì huỷ."
          },
          {
            "q": "{雨|あめ}が＿＿、{試合|しあい}はあります。　〔Ame ga __, shiai wa arimasu.〕　— Dù mưa trận đấu vẫn diễn ra.",
            "options": [
              "{降|ふ}っても",
              "{降|ふ}ったら",
              "{降|ふ}ったから",
              "{降|ふ}ると"
            ],
            "correct": 0,
            "why": "121: dù mưa vẫn có. → **{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。** 〔Ame ga futtemo, shiai wa arimasu.〕 — Dù mưa trận đấu vẫn diễn ra."
          },
          {
            "q": "{土曜日|どようび}はきっと{混|こ}んでいる＿＿{思|おも}います。　〔Doyoubi wa kitto konde iru __ omoimasu.〕　— Tôi nghĩ thứ Bảy chắc chắn đông.",
            "options": [
              "と",
              "そう",
              "でも",
              "たら"
            ],
            "correct": 0,
            "why": "123: と 思います. → **{土曜日|どようび}はきっと{混|こ}んでいると{思|おも}います。** 〔Doyoubi wa kitto konde iru to omoimasu.〕 — Tôi nghĩ thứ Bảy chắc chắn đông."
          },
          {
            "q": "あっ、{店|みせ}が＿＿います。　〔A, mise ga __ imasu.〕　— Ơ, cửa hàng đóng cửa rồi.",
            "options": [
              "{閉|し}まった",
              "{閉|し}まって",
              "{閉|し}まる",
              "{閉|し}めて"
            ],
            "correct": 1,
            "why": "122: tự động từ + ています. → **あっ、{店|みせ}が{閉|し}まっています。** 〔A, mise ga shimatte imasu.〕 — Ơ, cửa hàng đóng cửa rồi."
          },
          {
            "q": "ニュースで{見|み}ましたが、{地震|じしん}でビルが{倒|たお}れた＿＿。　〔Nyuusu de mimashita ga, jishin de biru ga taoreta __.〕　— Tôi xem trên thời sự, nghe nói vì động đất mà toà nhà bị đổ.",
            "options": [
              "たら",
              "ても",
              "そうです",
              "と{思|おも}います"
            ],
            "correct": 2,
            "why": "119 + 124. → **ニュースで{見|み}ましたが、{地震|じしん}でビルが{倒|たお}れたそうです。** 〔Nyuusu de mimashita ga, jishin de biru ga taoreta sou desu.〕 — Tôi xem trên thời sự, nghe nói vì động đất mà toà nhà bị đổ."
          },
          {
            "q": "{電車|でんしゃ}が{止|と}まって＿＿、タクシーで{行|い}きましょう。　〔Densha ga tomatte __, takushii de ikimashou.〕　— Nếu tàu đang dừng thì đi taxi nhé.",
            "options": [
              "いると",
              "いても",
              "いたら",
              "いるそう"
            ],
            "correct": 2,
            "why": "122 + 120. → **{電車|でんしゃ}が{止|と}まっていたら、タクシーで{行|い}きましょう。** 〔Densha ga tomatte itara, takushii de ikimashou.〕 — Nếu tàu đang dừng thì đi taxi nhé."
          },
          {
            "q": "＿＿{高|たか}くても、{人|ひと}が{集|あつ}まると{思|おも}います。　〔__ takakute mo, hito ga atsumaru to omoimasu.〕　— Tôi nghĩ dù đắt chắc chắn vẫn có nhiều người đến.",
            "options": [
              "なんと",
              "もし",
              "きっと",
              "ほら"
            ],
            "correct": 2,
            "why": "121 + 123: きっと ～と 思います. → **きっと{高|たか}くても、{人|ひと}が{集|あつ}まると{思|おも}います。** 〔Kitto takakute mo, hito ga atsumaru to omoimasu.〕 — Tôi nghĩ dù đắt chắc chắn vẫn có nhiều người đến."
          },
          {
            "q": "{雪|ゆき}＿＿バスが{遅|おく}れているそうです。　〔Yuki __ basu ga okurete iru sou desu.〕　— Nghe nói vì tuyết mà xe buýt đang trễ.",
            "options": [
              "が",
              "で",
              "に",
              "を"
            ],
            "correct": 1,
            "why": "124 + 119. → **{雪|ゆき}でバスが{遅|おく}れているそうです。** 〔Yuki de basu ga okurete iru sou desu.〕 — Nghe nói vì tuyết mà xe buýt đang trễ."
          },
          {
            "q": "{時間|じかん}が＿＿、{一緒|いっしょ}に{行|い}きませんか。　〔Jikan ga __, issho ni ikimasen ka.〕　— Nếu có thời gian thì đi cùng không?",
            "options": [
              "あったら",
              "あると",
              "あっても",
              "あるそう"
            ],
            "correct": 0,
            "why": "120. → **{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。** 〔Jikan ga attara, issho ni ikimasen ka.〕 — Nếu có thời gian thì đi cùng không?"
          },
          {
            "q": "この{店|みせ}のラーメンはおいしい＿＿。{雑誌|ざっし}で{読|よ}みました。　〔Kono mise no raamen wa oishii __. Zasshi de yomimashita.〕　— Nghe nói mì quán này ngon. Tôi đọc trên tạp chí.",
            "options": [
              "たら",
              "と{思|おも}います",
              "そうです",
              "でも"
            ],
            "correct": 2,
            "why": "119: nguồn là tạp chí → そうです. → **この{店|みせ}のラーメンはおいしいそうです。{雑誌|ざっし}で{読|よ}みました。** 〔Kono mise no raamen wa oishii sou desu. Zasshi de yomimashita.〕 — Nghe nói mì quán này ngon. Tôi đọc trên tạp chí."
          },
          {
            "q": "{暇|ひま}＿＿、{手伝|てつだ}ってください。　〔Hima __, tetsudatte kudasai.〕　— Nếu rảnh thì giúp tôi nhé.",
            "options": [
              "かったら",
              "だったら",
              "でも",
              "なたら"
            ],
            "correct": 1,
            "why": "120: ナA だったら. → **{暇|ひま}だったら、{手伝|てつだ}ってください。** 〔Hima dattara, tetsudatte kudasai.〕 — Nếu rảnh thì giúp tôi nhé."
          },
          {
            "q": "{人|ひと}が{多|おお}＿＿、{行|い}きたいです。　〔Hito ga oo__, ikitai desu.〕　— Dù đông tôi vẫn muốn đi.",
            "options": [
              "かったら",
              "くても",
              "いでも",
              "いと"
            ],
            "correct": 1,
            "why": "121: イA くても. → **{人|ひと}が{多|おお}くても、{行|い}きたいです。** 〔Hito ga ookutemo, ikitai desu.〕 — Dù đông tôi vẫn muốn đi."
          },
          {
            "q": "{明日|あした}はたぶん{晴|は}れ＿＿と{思|おも}います。　〔Ashita wa tabun hare __ to omoimasu.〕　— Tôi nghĩ có lẽ mai trời nắng.",
            "options": [
              "る",
              "て",
              "たら",
              "ます"
            ],
            "correct": 0,
            "why": "123: thể thường 晴れる. → **{明日|あした}はたぶん{晴|は}れると{思|おも}います。** 〔Ashita wa tabun hare ru to omoimasu.〕 — Tôi nghĩ có lẽ mai trời nắng."
          },
          {
            "q": "Câu nào ĐÚNG cả ngữ pháp lẫn nghĩa?",
            "options": [
              "{事故|じこ}で{電車|でんしゃ}が{止|と}めているだそうです。 (Jiko de densha ga tomete iru da sou desu.)",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まっていますそうです。 (Jiko de densha ga tomatte imasu sou desu.)",
              "{事故|じこ}に{電車|でんしゃ}を{止|と}まっているそうです。 (Jiko ni densha o tomatte iru sou desu.)",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まっているそうです。 (Jiko de densha ga tomatte iru sou desu.)"
            ],
            "correct": 3,
            "why": "124 + 122 + 119: 事故で 電車が 止まって いる そうです."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "もし{雨|あめ}かったら、{花火大会|はなびたいかい}は{中止|ちゅうし}そうです。 (Moshi ame kattara, hanabitaikai wa chuushi sou desu.)",
              "もし{雨|あめ}でも、{花火大会|はなびたいかい}は{中止|ちゅうし}だそうです。 (Moshi ame demo, hanabitaikai wa chuushi da sou desu.)",
              "きっと{雨|あめ}だったら、{花火大会|はなびたいかい}は{中止|ちゅうし}なそうです。 (Kitto ame dattara, hanabitaikai wa chuushi na sou desu.)",
              "もし{雨|あめ}だったら、{花火大会|はなびたいかい}は{中止|ちゅうし}だそうです。 (Moshi ame dattara, hanabitaikai wa chuushi da sou desu.)"
            ],
            "correct": 3,
            "why": "もし ～だったら + N だ そうです."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{急|いそ}いだらも、たぶん{間|ま}に{合|あ}わないと{思|おも}います。 (Isoidara mo, tabun maniawanai to omoimasu.)",
              "{急|いそ}いでも、たぶん{間|ま}に{合|あ}わないと{思|おも}います。 (Isoide mo, tabun maniawanai to omoimasu.)",
              "{急|いそ}ぐでも、たぶん{間|ま}に{合|あ}いませんと{思|おも}います。 (Isogu demo, tabun maniaimasen to omoimasu.)",
              "{急|いそ}いでも、もし{間|ま}に{合|あ}わないと{思|おも}います。 (Isoide mo, moshi maniawanai to omoimasu.)"
            ],
            "correct": 1,
            "why": "ても + たぶん ～ない と 思います."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "あっ、{窓|まど}ガラスが{割|わ}れますいます。{台風|たいふう}で{割|わ}れましたと{思|おも}います。 (A, mado garasu ga waremasu imasu. Taifuu de waremashita to omoimasu.)",
              "あっ、{窓|まど}ガラスが{割|わ}れています。{昨日|きのう}の{台風|たいふう}で{割|わ}れたと{思|おも}います。 (A, mado garasu ga warete imasu. Kinou no taifuu de wareta to omoimasu.)",
              "あっ、{窓|まど}ガラスを{割|わ}れています。{昨日|きのう}の{台風|たいふう}に{割|わ}れたと{思|おも}います。 (A, mado garasu o warete imasu. Kinou no taifuu ni wareta to omoimasu.)",
              "あっ、{窓|まど}ガラスが{割|わ}れています。{台風|たいふう}で{割|わ}れただと{思|おも}います。 (A, mado garasu ga warete imasu. Taifuu de wareta da to omoimasu.)"
            ],
            "correct": 1,
            "why": "122 + 124 + 123."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{安|やす}くたら、{買|か}います。でも、{高|たか}かっても、{買|か}います。 (Yasukutara, kaimasu. Demo, takakatte mo, kaimasu.)",
              "{安|やす}かったら、{買|か}います。でも、{高|たか}くても、{好|す}きかったら、{買|か}います。 (Yasukattara, kaimasu. Demo, takakute mo, suki kattara, kaimasu.)",
              "{安|やす}かったら、{買|か}います。でも、{高|たか}くても、{好|す}きだったら、{買|か}います。 (Yasukattara, kaimasu. Demo, takakute mo, suki dattara, kaimasu.)",
              "{安|やす}いだったら、{買|か}います。でも、{高|たか}いでも、{買|か}います。 (Yasuidattara, kaimasu. Demo, takaide mo, kaimasu.)"
            ],
            "correct": 2,
            "why": "安かったら · 高くて も · 好きだったら."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-np3-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "119–124",
        "items": [
          {
            "q": "Ơ, cửa hàng đóng cửa rồi. Đi quán khác không?",
            "answers": [
              "あっ、店が閉まっています。ほかの店に行きませんか。",
              "あっ、店が閉まっています。ほかの店にいきませんか。",
              "あっ、店が閉まっています。ほかのみせに行きませんか。",
              "あっ、店が閉まっています。ほかのみせにいきませんか。",
              "あっ、店がしまっています。ほかの店に行きませんか。",
              "あっ、店がしまっています。ほかの店にいきませんか。",
              "あっ、店がしまっています。ほかのみせに行きませんか。",
              "あっ、店がしまっています。ほかのみせにいきませんか。",
              "あっ、みせが閉まっています。ほかの店に行きませんか。",
              "あっ、みせが閉まっています。ほかの店にいきませんか。",
              "あっ、みせが閉まっています。ほかのみせに行きませんか。",
              "あっ、みせが閉まっています。ほかのみせにいきませんか。",
              "あっ、みせがしまっています。ほかの店に行きませんか。",
              "あっ、みせがしまっています。ほかの店にいきませんか。",
              "あっ、みせがしまっています。ほかのみせに行きませんか。",
              "あっ、みせがしまっています。ほかのみせにいきませんか。"
            ],
            "hint": "閉まって います"
          },
          {
            "q": "Vì tai nạn mà tàu điện đang dừng. Đi xe buýt nhé.",
            "answers": [
              "事故で電車が止まっています。バスで行きましょう。",
              "事故で電車が止まっています。バスでいきましょう。",
              "事故で電車がとまっています。バスで行きましょう。",
              "事故で電車がとまっています。バスでいきましょう。",
              "事故ででんしゃが止まっています。バスで行きましょう。",
              "事故ででんしゃが止まっています。バスでいきましょう。",
              "事故ででんしゃがとまっています。バスで行きましょう。",
              "事故ででんしゃがとまっています。バスでいきましょう。",
              "じこで電車が止まっています。バスで行きましょう。",
              "じこで電車が止まっています。バスでいきましょう。",
              "じこで電車がとまっています。バスで行きましょう。",
              "じこで電車がとまっています。バスでいきましょう。",
              "じこででんしゃが止まっています。バスで行きましょう。",
              "じこででんしゃが止まっています。バスでいきましょう。",
              "じこででんしゃがとまっています。バスで行きましょう。",
              "じこででんしゃがとまっています。バスでいきましょう。"
            ],
            "hint": "事故で … 止まって います"
          },
          {
            "q": "Dạ, cái đĩa này bị bẩn ạ.",
            "answers": [
              "あのう、このお皿が汚れています。",
              "あのう、このお皿がよごれています。",
              "あのう、このおさらが汚れています。",
              "あのう、このおさらがよごれています。",
              "あのう、この皿が汚れています。",
              "あのう、この皿がよごれています。",
              "あのう、このさらが汚れています。",
              "あのう、このさらがよごれています。"
            ],
            "hint": "汚れて います"
          },
          {
            "q": "Nghe nói dù mưa, chợ đồ cũ vẫn có.",
            "answers": [
              "雨が降っても、フリーマーケットはあるそうです。",
              "雨がふっても、フリーマーケットはあるそうです。",
              "あめが降っても、フリーマーケットはあるそうです。",
              "あめがふっても、フリーマーケットはあるそうです。",
              "雨でも、フリーマーケットはあるそうです。",
              "あめでも、フリーマーケットはあるそうです。"
            ],
            "hint": "ても … そうです"
          },
          {
            "q": "Nếu quán vắng thì vào nhé.",
            "answers": [
              "店がすいていたら、入りましょう。",
              "店がすいていたら、はいりましょう。",
              "みせがすいていたら、入りましょう。",
              "みせがすいていたら、はいりましょう。"
            ],
            "hint": "すいて いたら"
          },
          {
            "q": "Tôi nghĩ có lẽ chỗ ngồi đã kín.",
            "answers": [
              "たぶん席がもうないと思います。",
              "たぶん席がもうないとおもいます。",
              "たぶんせきがもうないと思います。",
              "たぶんせきがもうないとおもいます。",
              "たぶん席は全部混んでいると思います。",
              "たぶん席は全部混んでいるとおもいます。",
              "たぶん席は全部こんでいると思います。",
              "たぶん席は全部こんでいるとおもいます。",
              "たぶん席はぜんぶ混んでいると思います。",
              "たぶん席はぜんぶ混んでいるとおもいます。",
              "たぶん席はぜんぶこんでいると思います。",
              "たぶん席はぜんぶこんでいるとおもいます。",
              "たぶんせきは全部混んでいると思います。",
              "たぶんせきは全部混んでいるとおもいます。",
              "たぶんせきは全部こんでいると思います。",
              "たぶんせきは全部こんでいるとおもいます。",
              "たぶんせきはぜんぶ混んでいると思います。",
              "たぶんせきはぜんぶ混んでいるとおもいます。",
              "たぶんせきはぜんぶこんでいると思います。",
              "たぶんせきはぜんぶこんでいるとおもいます。"
            ],
            "hint": "たぶん ～と 思います"
          },
          {
            "q": "Ở hội trường đã có rất nhiều người tụ tập.",
            "answers": [
              "会場には人がたくさん集まっていました。",
              "会場には人がたくさんあつまっていました。",
              "会場にはひとがたくさん集まっていました。",
              "会場にはひとがたくさんあつまっていました。",
              "かいじょうには人がたくさん集まっていました。",
              "かいじょうには人がたくさんあつまっていました。",
              "かいじょうにはひとがたくさん集まっていました。",
              "かいじょうにはひとがたくさんあつまっていました。",
              "会場に人がたくさん集まっていました。",
              "会場に人がたくさんあつまっていました。",
              "会場にひとがたくさん集まっていました。",
              "会場にひとがたくさんあつまっていました。",
              "かいじょうに人がたくさん集まっていました。",
              "かいじょうに人がたくさんあつまっていました。",
              "かいじょうにひとがたくさん集まっていました。",
              "かいじょうにひとがたくさんあつまっていました。"
            ],
            "hint": "集まって いました"
          },
          {
            "q": "Nghe nói vì động đất mà điện đã tắt.",
            "answers": [
              "地震で電気が消えたそうです。",
              "地震で電気がきえたそうです。",
              "地震ででんきが消えたそうです。",
              "地震ででんきがきえたそうです。",
              "じしんで電気が消えたそうです。",
              "じしんで電気がきえたそうです。",
              "じしんででんきが消えたそうです。",
              "じしんででんきがきえたそうです。"
            ],
            "hint": "消えた そうです"
          },
          {
            "q": "Thang máy hỏng rồi. Đi bộ thôi.",
            "answers": [
              "エレベーターが壊れています。歩いて行きましょう。",
              "エレベーターが壊れています。歩いていきましょう。",
              "エレベーターが壊れています。あるいて行きましょう。",
              "エレベーターが壊れています。あるいていきましょう。",
              "エレベーターがこわれています。歩いて行きましょう。",
              "エレベーターがこわれています。歩いていきましょう。",
              "エレベーターがこわれています。あるいて行きましょう。",
              "エレベーターがこわれています。あるいていきましょう。"
            ],
            "hint": "壊れて います"
          },
          {
            "q": "Nếu được thì ngồi chỗ này đi. Tàu vắng mà.",
            "answers": [
              "よかったら、ここに座ってください。電車はすいていますから。",
              "よかったら、ここに座ってください。でんしゃはすいていますから。",
              "よかったら、ここにすわってください。電車はすいていますから。",
              "よかったら、ここにすわってください。でんしゃはすいていますから。",
              "よかったら、ここに座ってください。",
              "よかったら、ここにすわってください。"
            ],
            "hint": "よかったら"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np3-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "あっ、{電車|でんしゃ}（①）{止|と}まっています。{事故|じこ}（②）そうです。　〔A, densha ((1)) tomatte imasu. Jiko ((2)) sou desu.〕　— Ơ, tàu đang dừng. Nghe nói là tai nạn.",
            "options": [
              "①が②です",
              "①が②だ",
              "①を②だ",
              "①が②な"
            ],
            "correct": 1,
            "why": "Tự động từ + が; N だ そうです. → **あっ、{電車|でんしゃ}が{止|と}まっています。{事故|じこ}だそうです。** 〔A, densha ga tomatte imasu. Jiko da sou desu.〕 — Ơ, tàu đang dừng. Nghe nói là tai nạn."
          },
          {
            "q": "{店|みせ}が（①）いますね。じゃ、ほかの{店|みせ}に（②）。　〔Mise ga ((1)) imasu ne. Ja, hoka no mise ni ((2)).〕　— Cửa hàng đóng rồi nhỉ. Vậy đi quán khác không?",
            "options": [
              "①{閉|し}まる②{行|い}きましょうかね",
              "①{閉|し}まって②{行|い}きました",
              "①{閉|し}まって②{行|い}きませんか",
              "①{閉|し}めて②{行|い}きませんか"
            ],
            "correct": 2,
            "why": "Trạng thái + đề nghị. → **{店|みせ}が{閉|し}まっていますね。じゃ、ほかの{店|みせ}に{行|い}きませんか。** 〔Mise ga shimatte imasu ne. Ja, hoka no mise ni ikimasen ka.〕 — Cửa hàng đóng rồi nhỉ. Vậy đi quán khác không?"
          },
          {
            "q": "{部屋|へや}の{電気|でんき}が（①）います。たぶんだれもいない（②）{思|おも}います。　〔Heya no denki ga ((1)) imasu. Tabun dare mo inai ((2)) omoimasu.〕　— Đèn phòng tắt. Tôi nghĩ có lẽ không có ai.",
            "options": [
              "①{消|き}えて②そう",
              "①{消|き}えて②と",
              "①{消|け}して②だと",
              "①{消|け}して②と"
            ],
            "correct": 1,
            "why": "消えて います; と 思います. → **{部屋|へや}の{電気|でんき}が{消|き}えています。たぶんだれもいないと{思|おも}います。** 〔Heya no denki ga kiete imasu. Tabun dare mo inai to omoimasu.〕 — Đèn phòng tắt. Tôi nghĩ có lẽ không có ai."
          },
          {
            "q": "{雨|あめ}が（①）、{出|で}かけましょう。{今|いま}はまだ（②）います。　〔Ame ga ((1)), dekakemashou. Ima wa mada ((2)) imasu.〕　— Mưa tạnh thì ra ngoài nhé. Bây giờ vẫn đang mưa.",
            "options": [
              "①{降|ふ}ったら②やんで",
              "①やんだら②{降|ふ}って",
              "①やんだら②やんで",
              "①やんでも②{降|ふ}って"
            ],
            "correct": 1,
            "why": "Nếu tạnh → đi; bây giờ vẫn đang mưa. → **{雨|あめ}がやんだら、{出|で}かけましょう。{今|いま}はまだ{降|ふ}っています。** 〔Ame ga yandara, dekakemashou. Ima wa mada futte imasu.〕 — Mưa tạnh thì ra ngoài nhé. Bây giờ vẫn đang mưa."
          },
          {
            "q": "{入|い}り{口|ぐち}に{人|ひと}がたくさん（①）います。（②）{人気|にんき}があると{思|おも}います。　〔Iriguchi ni hito ga takusan ((1)) imasu. ((2)) ninki ga aru to omoimasu.〕　— Ở cửa vào nhiều người xếp hàng. Tôi nghĩ chắc chắn được ưa chuộng.",
            "options": [
              "①{並|なら}べて②きっと",
              "①{並|なら}んで②きっと",
              "①{並|なら}んで②もし",
              "①{並|なら}びて②なんと"
            ],
            "correct": 1,
            "why": "並んで います; きっと. → **{入|い}り{口|ぐち}に{人|ひと}がたくさん{並|なら}んでいます。きっと{人気|にんき}があると{思|おも}います。** 〔Iriguchi ni hito ga takusan narande imasu. Kitto ninki ga aru to omoimasu.〕 — Ở cửa vào nhiều người xếp hàng. Tôi nghĩ chắc chắn được ưa chuộng."
          },
          {
            "q": "{台風|たいふう}（①）{木|き}が{倒|たお}れています。{道|みち}が（②）いるそうです。　〔Taifuu ((1)) ki ga taorete imasu. Michi ga ((2)) iru sou desu.〕　— Vì bão mà cây đổ. Nghe nói đường đang tắc.",
            "options": [
              "①を②{混|こ}んだ",
              "①で②すいて",
              "①に②{混|こ}んで",
              "①で②{混|こ}んで"
            ],
            "correct": 3,
            "why": "Nguyên nhân で; đường đang tắc → 混んで いる. → **{台風|たいふう}で{木|き}が{倒|たお}れています。{道|みち}が{混|こ}んでいるそうです。** 〔Taifuu de ki ga taorete imasu. Michi ga konde iru sou desu.〕 — Vì bão mà cây đổ. Nghe nói đường đang tắc."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-np3-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Ở nhà hàng, bạn thấy cái cốc mang ra bị bẩn. Bạn nói với nhân viên:",
            "options": [
              "あのう、コップが{汚|よご}れたら、いいです。 (Anou, koppu ga yogoretara, ii desu.)",
              "あのう、コップを{汚|よご}れてください。 (Anou, koppu o yogorete kudasai.)",
              "ほら、コップが{汚|よご}れるそうです。 (Hora, koppu ga yogoreru sou desu.)",
              "あのう、コップが{汚|よご}れています。 (Anou, koppu ga yogorete imasu.)"
            ],
            "correct": 3,
            "why": "Báo nhân viên: あのう、N が ～て います."
          },
          {
            "q": "Bạn và bạn thân đến ga thì thấy tàu không chạy.",
            "options": [
              "あっ、{電車|でんしゃ}を{止|と}めている。バスで{行|い}かない？ (A, densha o tomete iru. Basu de ikanai?)",
              "あっ、{電車|でんしゃ}が{止|と}まると{思|おも}う。 (A, densha ga tomaru to omou.)",
              "あっ、{電車|でんしゃ}が{止|と}まっている。バスで{行|い}かない？ (A, densha ga tomatte iru. Basu de ikanai?)",
              "あっ、{電車|でんしゃ}が{止|と}まったら、いい。 (A, densha ga tomattara, ii.)"
            ],
            "correct": 2,
            "why": "Với bạn: thể thường; 止まって いる."
          },
          {
            "q": "Bạn muốn vào quán nhưng thấy cửa đã đóng.",
            "options": [
              "{閉|し}まるそうです。{入|はい}りましょう。 (Shimaru sou desu. Hairimashou.)",
              "{閉|し}まっていますね。ほかの{店|みせ}に{行|い}きましょう。 (Shimatte imasu ne. Hoka no mise ni ikimashou.)",
              "{閉|し}めていますね。ほかの{店|みせ}に{行|い}きましょう。 (Shimete imasu ne. Hoka no mise ni ikimashou.)",
              "{閉|し}まっても、{入|はい}りましょう。 (Shimatte mo, hairimashou.)"
            ],
            "correct": 1,
            "why": "Trạng thái + đề nghị khác."
          },
          {
            "q": "Bạn thấy hàng dài trước tiệm bánh, muốn đi chỗ khác.",
            "options": [
              "{人|ひと}がたくさん{並|なら}んでいますね。コンビニで{買|か}いませんか。 (Hito ga takusan narande imasu ne. Konbini de kaimasen ka.)",
              "{人|ひと}がたくさん{並|なら}べていますね。コンビニで{買|か}いませんか。 (Hito ga takusan narabete imasu ne. Konbini de kaimasen ka.)",
              "{人|ひと}がたくさん{並|なら}ぶと、コンビニです。 (Hito ga takusan narabu to, konbini desu.)",
              "{人|ひと}が{並|なら}んでも、{帰|かえ}りましょう。 (Hito ga narande mo, kaerimashou.)"
            ],
            "correct": 0,
            "why": "並んで います + đề nghị."
          },
          {
            "q": "Bạn đến muộn hội trường; bạn kể lại cho thầy lúc đó thế nào.",
            "options": [
              "{会場|かいじょう}にはもう{人|ひと}がたくさん{集|あつ}まっていました。 (Kaijou ni wa mou hito ga takusan atsumatte imashita.)",
              "{会場|かいじょう}にはもう{人|ひと}がたくさん{集|あつ}めていました。 (Kaijou ni wa mou hito ga takusan atsumete imashita.)",
              "{会場|かいじょう}に{人|ひと}が{集|あつ}まるそうでした。 (Kaijou ni hito ga atsumaru sou deshita.)",
              "{会場|かいじょう}に{人|ひと}が{集|あつ}まったら、いいです。 (Kaijou ni hito ga atsumattara, ii desu.)"
            ],
            "correct": 0,
            "why": "Kể trạng thái trong quá khứ: ～て いました."
          },
          {
            "q": "Bạn chỉ cho bạn: điều hoà phòng này hỏng, đừng bật.",
            "options": [
              "このエアコンが{壊|こわ}していますから、つけないでください。 (Kono eakon ga kowashite imasu kara, tsukenaide kudasai.)",
              "このエアコンは{壊|こわ}れますから、つけてください。 (Kono eakon wa kowaremasu kara, tsukete kudasai.)",
              "このエアコンは{壊|こわ}れていますから、つけないでください。 (Kono eakon wa kowarete imasu kara, tsukenaide kudasai.)",
              "このエアコンは{壊|こわ}れても、つけないでください。 (Kono eakon wa kowarete mo, tsukenaide kudasai.)"
            ],
            "correct": 2,
            "why": "Trạng thái 壊れて います + lời khuyên."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**N が V (tự động từ) て います** = trạng thái đang thấy: 止まって · 閉まって · 消えて · 割れて · 壊れて · 汚れて · 落ちて · 集まって · 並んで · 混んで · すいて います. Tha động từ (を) + ています = người đang làm.",
          "Cả bài: **119** 普通形そうです · **124** N で · **120** ～たら · **121** ～ても · **123** きっと／たぶん～と思います · **122** ～て います. Kể tin → bàn kế hoạch → ra phố tả cảnh: ba bước của Bài 15."
        ]
      }
    ]
  },
  {
    "id": "lt-b15-hoi-thoai",
    "kind": "conversation",
    "title": "Luyện thêm Bài 15 · Hội thoại — quán mới trong tạp chí · tin bão · lễ hội pháo hoa · ngoài phố · cuộc thi hùng biện (5 hội thoại mới, ~55 câu)",
    "goal": "Hiểu và tự nói được hội thoại Bài 15: kể tin xem trên ti vi / tạp chí (～そうです, N で) và đáp lại tin (本当ですか · 怖いですね · よかったですね), rủ bạn có điều kiện (～たら · ～ても · よかったら), đoán (きっと／たぶん ～と思います), ra phố tả cảnh trước mắt (～が ～て います) và kể kỷ niệm bằng thể thường.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Mỗi hội thoại làm 4 bước: **đọc + nghe** → **câu hỏi hiểu** → **điền chỗ trống** → **sắp xếp lượt thoại**; cuối bài là phần **tự nói** (che một vai).",
          "Khi nghe, bắt 4 thứ: **tin nghe được** (～そうです · ニュースで 見ましたが), **nguyên nhân** (台風で · 事故で), **điều kiện / dù** (～たら · ～ても · よかったら · もし), **đoán** (きっと／たぶん ～と思います) và **cảnh trước mắt** (～が ～て います).",
          "Lỗi hay mắc: ~~来ますそうです~~ (phải 来るそうです) · ~~無料そうです~~ (phải 無料だそうです) · ~~ありたら~~ (phải あったら) · ~~高いでも~~ (phải 高くても) · ~~電車を 止まって います~~ (phải 電車が 止まって います) · ~~店が 閉めて います~~ (phải 閉まって います)."
        ]
      },
      {
        "t": "recap",
        "title": "Khuôn chung của Bài 15 (テレビ・雑誌から)",
        "items": [
          "**これ、知ってる？**: ～、知って いますか／知ってる？ → ～そうです(よ) · 本当ですか · 怖いですね／心配ですね／よかったですね · 台風で／事故で ～.",
          "**雑誌を見て町へ**: よかったら／暇だったら、～ません か · ～ても、～そうです · きっと／たぶん ～と 思います · じゃ、～で 会いましょう.",
          "**町を歩いて**: あっ、～が ～て います → 本当だ · じゃ、～ません か · あのう、～が 汚れて います → あっ、すみません."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · Hội thoại 1–2: quán mới trong tạp chí · tin bão trên ti vi"
      },
      {
        "t": "p",
        "text": "**Tình huống 1.** Ở thư viện trường, Wang đọc tạp chí thấy tin một quán ramen mới mở gần ga. Chị kể cho Daniel và rủ anh đi cùng."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 1 — Quán mới mở — \"Nghe nói thứ Bảy sinh viên được miễn phí!\"",
        "lines": [
          {
            "who": "ワン",
            "role": "a",
            "text": "ダニエルさん、これ、{知|し}っていますか。{駅|えき}の{前|まえ}に{新|あたら}しいラーメン{屋|や}ができたそうですよ。",
            "ro": "Danieru-san, kore, shitte imasu ka. Eki no mae ni atarashii raamen'ya ga dekita sou desu yo.",
            "vi": "Daniel, anh biết cái này chưa? Nghe nói trước ga mới mở một quán ramen đấy."
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "へえ、{知|し}りませんでした。どんな{店|みせ}ですか。",
            "ro": "Hee, shirimasen deshita. Donna mise desu ka.",
            "vi": "Ồ, tôi không biết. Quán thế nào vậy?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "この{雑誌|ざっし}を{見|み}てください。{北海道|ほっかいどう}のラーメンで、とてもおいしいそうです。",
            "ro": "Kono zasshi o mite kudasai. Hokkaidou no raamen de, totemo oishii sou desu.",
            "vi": "Anh xem tạp chí này đi. Là ramen Hokkaido, nghe nói ngon lắm."
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "いいですね。{高|たか}いですか。",
            "ro": "Ii desu ne. Takai desu ka.",
            "vi": "Hay nhỉ. Có đắt không?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "{今週|こんしゅう}は{全部|ぜんぶ}{二十|にじゅっ}パーセント{引|び}きだそうです。それに、{土曜日|どようび}は{学生|がくせい}は{無料|むりょう}だそうです。",
            "ro": "Konshuu wa zenbu niju paasento biki da sou desu. Soreni, doyoubi wa gakusei wa muryou da sou desu.",
            "vi": "Nghe nói tuần này tất cả giảm 20%. Hơn nữa, nghe nói thứ Bảy sinh viên được miễn phí."
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "{無料|むりょう}ですか。{本当|ほんとう}ですか。じゃ、{土曜日|どようび}に{一緒|いっしょ}に{行|い}きませんか。",
            "ro": "Muryou desu ka. Hontou desu ka. Ja, doyoubi ni issho ni ikimasen ka.",
            "vi": "Miễn phí à? Thật không? Vậy thứ Bảy đi cùng nhau không?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "いいですね。でも、{土曜日|どようび}はきっと{混|こ}むと{思|おも}います。{早|はや}く{行|い}きましょう。",
            "ro": "Ii desu ne. Demo, doyoubi wa kitto komu to omoimasu. Hayaku ikimashou.",
            "vi": "Hay đấy. Nhưng tôi nghĩ thứ Bảy chắc chắn sẽ đông. Đi sớm nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ht1-hieu",
        "title": "Hội thoại 1 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Wang biết tin về quán mới từ đâu?",
            "options": [
              "Bạn cùng lớp",
              "Tạp chí",
              "Ti vi",
              "Tờ rơi ở ga"
            ],
            "correct": 1,
            "why": "この 雑誌を 見て ください."
          },
          {
            "q": "Quán mới ở đâu?",
            "options": [
              "Trước ga",
              "Ở Hokkaido",
              "Trong trường",
              "Cạnh thư viện"
            ],
            "correct": 0,
            "why": "駅の 前に 新しい ラーメン屋が できた そうです."
          },
          {
            "q": "Nghe nói ramen ở quán đó thế nào?",
            "options": [
              "Rất ngon",
              "Rất cay",
              "Rất đắt",
              "Không ngon lắm"
            ],
            "correct": 0,
            "why": "とても おいしい そうです."
          },
          {
            "q": "Tuần này giá thế nào?",
            "options": [
              "Giảm 10%",
              "Tất cả giảm 20%",
              "Tất cả miễn phí",
              "Không giảm"
            ],
            "correct": 1,
            "why": "全部 20パーセント引きだ そうです."
          },
          {
            "q": "Thứ Bảy ai được miễn phí?",
            "options": [
              "Sinh viên",
              "Mọi người",
              "Người lớn",
              "Trẻ em"
            ],
            "correct": 0,
            "why": "土曜日は 学生は 無料だ そうです."
          },
          {
            "q": "Vì sao Wang muốn đi sớm?",
            "options": [
              "Chỉ có ít đồ ăn",
              "Chị nghĩ thứ Bảy chắc chắn đông",
              "Chị có việc buổi chiều",
              "Quán đóng cửa sớm"
            ],
            "correct": 1,
            "why": "きっと 混むと 思います。早く 行きましょう."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-ht1-dien",
        "title": "Hội thoại 1 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ワン：{駅|えき}の{前|まえ}に{新|あたら}しいラーメン{屋|や}が＿＿そうですよ。　〔Wan: eki no mae ni atarashii raamen'ya ga __ sou desu yo.〕",
            "answers": [
              "できた"
            ],
            "hint": "できます → nghe nói (đã mở)"
          },
          {
            "q": "ワン：{土曜日|どようび}は{学生|がくせい}は{無料|むりょう}＿＿そうです。　〔Wan: doyoubi wa gakusei wa muryou __ sou desu.〕",
            "answers": [
              "だ"
            ],
            "hint": "N + ? + そうです"
          },
          {
            "q": "ダニエル：{無料|むりょう}ですか。＿＿ですか。　〔Danieru: muryou desu ka. __ desu ka.〕",
            "answers": [
              "本当",
              "ほんとう"
            ],
            "hint": "thật à?"
          },
          {
            "q": "ワン：{土曜日|どようび}はきっと{混|こ}むと＿＿。　〔Wan: doyoubi wa kitto komu to __.〕",
            "answers": [
              "思います",
              "おもいます"
            ],
            "hint": "tôi đoán"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-ht1-sx",
        "title": "Hội thoại 1 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi đã biết tin chưa (quán mới) → chưa biết, hỏi quán thế nào → ramen Hokkaido ngon → hỏi có đắt không.",
            "chips": [
              "ダニエルさん、これ、{知|し}っていますか。{駅|えき}の{前|まえ}に{新|あたら}しいラーメン{屋|や}ができたそうですよ。",
              "この{雑誌|ざっし}を{見|み}てください。{北海道|ほっかいどう}のラーメンで、とてもおいしいそうです。",
              "へえ、{知|し}りませんでした。どんな{店|みせ}ですか。",
              "いいですね。{高|たか}いですか。"
            ],
            "answer": [
              "ダニエルさん、これ、{知|し}っていますか。{駅|えき}の{前|まえ}に{新|あたら}しいラーメン{屋|や}ができたそうですよ。",
              "へえ、{知|し}りませんでした。どんな{店|みせ}ですか。",
              "この{雑誌|ざっし}を{見|み}てください。{北海道|ほっかいどう}のラーメンで、とてもおいしいそうです。",
              "いいですね。{高|たか}いですか。"
            ],
            "ro": "Danieru-san, kore, shitte imasu ka. Eki no mae ni atarashii raamen'ya ga dekita sou desu yo. Hee, shirimasen deshita. Donna mise desu ka. Kono zasshi o mite kudasai. Hokkaidou no raamen de, totemo oishii sou desu. Ii desu ne. Takai desu ka."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 2.** Buổi tối ở ký túc xá. Natapon vừa xem dự báo thời tiết trên ti vi, kể cho Lin — ngày mai Lin có trận bóng đá."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 2 — Tin bão — \"Trận đấu ngày mai chắc bị huỷ\"",
        "lines": [
          {
            "who": "ナタポン",
            "role": "b",
            "text": "リンさん、{天気予報|てんきよほう}を{見|み}ましたか。{明日|あした}、{大|おお}きい{台風|たいふう}が{来|く}るそうです。",
            "ro": "Rin-san, tenkiyohou o mimashita ka. Ashita, ookii taifuu ga kuru sou desu.",
            "vi": "Lin, chị xem dự báo thời tiết chưa? Nghe nói mai có cơn bão lớn đến."
          },
          {
            "who": "リン",
            "role": "a",
            "text": "えっ、{本当|ほんとう}ですか。{明日|あした}はサッカーの{試合|しあい}があります。",
            "ro": "E, hontou desu ka. Ashita wa sakkaa no shiai ga arimasu.",
            "vi": "Hả, thật à? Mai tôi có trận bóng đá."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "{台風|たいふう}で{電車|でんしゃ}も{止|と}まるそうですよ。{試合|しあい}はたぶん{中止|ちゅうし}だと{思|おも}います。",
            "ro": "Taifuu de densha mo tomaru sou desu yo. Shiai wa tabun chuushi da to omoimasu.",
            "vi": "Nghe nói vì bão mà tàu cũng ngừng chạy. Tôi nghĩ trận đấu có lẽ bị huỷ."
          },
          {
            "who": "リン",
            "role": "a",
            "text": "そうですか。{残念|ざんねん}です。{私|わたし}たちのチームは{強|つよ}いですから、{勝|か}ちたかったです。",
            "ro": "Sou desu ka. Zannen desu. Watashi tachi no chiimu wa tsuyoi desu kara, kachitakatta desu.",
            "vi": "Vậy à. Tiếc quá. Đội chúng tôi mạnh nên tôi muốn thắng lắm."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "{来週|らいしゅう}{晴|は}れたら、きっと{試合|しあい}ができると{思|おも}いますよ。",
            "ro": "Raishuu haretara, kitto shiai ga dekiru to omoimasu yo.",
            "vi": "Tôi nghĩ nếu tuần sau trời nắng thì chắc chắn sẽ đá được."
          },
          {
            "who": "リン",
            "role": "a",
            "text": "そうですね。{明日|あした}は{風|かぜ}も{強|つよ}いそうですから、{窓|まど}を{閉|し}めて、{部屋|へや}にいましょう。",
            "ro": "Sou desu ne. Ashita wa kaze mo tsuyoi sou desu kara, mado o shimete, heya ni imashou.",
            "vi": "Đúng nhỉ. Nghe nói mai gió cũng mạnh, nên đóng cửa sổ rồi ở trong phòng thôi."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "ええ。{怖|こわ}いですね。",
            "ro": "Ee. Kowai desu ne.",
            "vi": "Ừ. Đáng sợ nhỉ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ht2-hieu",
        "title": "Hội thoại 2 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Natapon biết tin bão từ đâu?",
            "options": [
              "Dự báo thời tiết",
              "Tạp chí",
              "Thầy giáo",
              "Bạn cùng phòng"
            ],
            "correct": 0,
            "why": "天気予報を 見ましたか."
          },
          {
            "q": "Ngày mai Lin có gì?",
            "options": [
              "Lễ hội pháo hoa",
              "Bài kiểm tra",
              "Cuộc thi hùng biện",
              "Trận bóng đá"
            ],
            "correct": 3,
            "why": "サッカーの 試合が あります."
          },
          {
            "q": "Vì bão thì điều gì sẽ xảy ra?",
            "options": [
              "Tàu điện ngừng chạy",
              "Mất điện",
              "Trường đóng cửa",
              "Cây đổ"
            ],
            "correct": 0,
            "why": "台風で 電車も 止まる そうです."
          },
          {
            "q": "Natapon đoán trận đấu thế nào?",
            "options": [
              "Hoãn một tiếng",
              "Đá trong nhà",
              "Có lẽ bị huỷ",
              "Chắc chắn diễn ra"
            ],
            "correct": 2,
            "why": "たぶん 中止だと 思います."
          },
          {
            "q": "Vì sao Lin tiếc?",
            "options": [
              "Chị đã mua vé",
              "Đội chị mạnh, chị muốn thắng",
              "Chị không thích bão",
              "Chị là đội trưởng"
            ],
            "correct": 1,
            "why": "強いですから、勝ちたかったです."
          },
          {
            "q": "Hai người định làm gì ngày mai?",
            "options": [
              "Đi mua sắm",
              "Đóng cửa sổ, ở trong phòng",
              "Về quê",
              "Đi xem bóng đá"
            ],
            "correct": 1,
            "why": "窓を 閉めて、部屋に いましょう."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-ht2-dien",
        "title": "Hội thoại 2 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ナタポン：{明日|あした}、{大|おお}きい{台風|たいふう}が＿＿そうです。　〔Natapon: ashita, ookii taifuu ga __ sou desu.〕",
            "answers": [
              "来る",
              "くる"
            ],
            "hint": "きます → thể thường"
          },
          {
            "q": "ナタポン：{台風|たいふう}＿＿{電車|でんしゃ}も{止|と}まるそうですよ。　〔Natapon: taifuu __ densha mo tomaru sou desu yo.〕",
            "answers": [
              "で"
            ],
            "hint": "nguyên nhân"
          },
          {
            "q": "ナタポン：{試合|しあい}はたぶん{中止|ちゅうし}＿＿と{思|おも}います。　〔Natapon: shiai wa tabun chuushi __ to omoimasu.〕",
            "answers": [
              "だ"
            ],
            "hint": "N + ? + と思います"
          },
          {
            "q": "ナタポン：{来週|らいしゅう}＿＿、きっと{試合|しあい}ができると{思|おも}いますよ。　〔Natapon: raishuu __, kitto shiai ga dekiru to omoimasu yo.〕",
            "answers": [
              "晴れたら",
              "はれたら"
            ],
            "hint": "はれます → nếu"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-ht2-sx",
        "title": "Hội thoại 2 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi đã xem dự báo chưa (bão lớn) → thật à, mai có trận → vì bão tàu ngừng, chắc huỷ → tiếc, muốn thắng.",
            "chips": [
              "{台風|たいふう}で{電車|でんしゃ}も{止|と}まるそうですよ。{試合|しあい}はたぶん{中止|ちゅうし}だと{思|おも}います。",
              "リンさん、{天気予報|てんきよほう}を{見|み}ましたか。{明日|あした}、{大|おお}きい{台風|たいふう}が{来|く}るそうです。",
              "えっ、{本当|ほんとう}ですか。{明日|あした}はサッカーの{試合|しあい}があります。",
              "そうですか。{残念|ざんねん}です。{私|わたし}たちのチームは{強|つよ}いですから、{勝|か}ちたかったです。"
            ],
            "answer": [
              "リンさん、{天気予報|てんきよほう}を{見|み}ましたか。{明日|あした}、{大|おお}きい{台風|たいふう}が{来|く}るそうです。",
              "えっ、{本当|ほんとう}ですか。{明日|あした}はサッカーの{試合|しあい}があります。",
              "{台風|たいふう}で{電車|でんしゃ}も{止|と}まるそうですよ。{試合|しあい}はたぶん{中止|ちゅうし}だと{思|おも}います。",
              "そうですか。{残念|ざんねん}です。{私|わたし}たちのチームは{強|つよ}いですから、{勝|か}ちたかったです。"
            ],
            "ro": "Rin-san, tenkiyohou o mimashita ka. Ashita, ookii taifuu ga kuru sou desu. E, hontou desu ka. Ashita wa sakkaa no shiai ga arimasu. Taifuu de densha mo tomaru sou desu yo. Shiai wa tabun chuushi da to omoimasu. Sou desu ka. Zannen desu. Watashi tachi no chiimu wa tsuyoi desu kara, kachitakatta desu."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · Hội thoại 3–4: rủ đi lễ hội theo tạp chí · ra phố tả cảnh"
      },
      {
        "t": "p",
        "text": "**Tình huống 3.** Anna đọc tạp chí thấy thứ Bảy có lễ hội pháo hoa ven sông. Chị rủ Carlos, hai người bàn: nếu mưa thì sao, có đông không, mặc yukata thì được giảm giá."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 3 — Lễ hội pháo hoa — \"Dù mưa nhỏ vẫn có\"",
        "lines": [
          {
            "who": "アンナ",
            "role": "a",
            "text": "カルロスさん、{土曜日|どようび}、{暇|ひま}だったら、{花火大会|はなびたいかい}に{行|い}きませんか。",
            "ro": "Karurosu-san, doyoubi, hima dattara, hanabitaikai ni ikimasen ka.",
            "vi": "Carlos, thứ Bảy nếu rảnh thì đi lễ hội pháo hoa không?"
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "いいですね。でも、{天気予報|てんきよほう}で{聞|き}きましたが、{土曜日|どようび}は{雨|あめ}が{降|ふ}るそうですよ。",
            "ro": "Ii desu ne. Demo, tenkiyohou de kikimashita ga, doyoubi wa ame ga furu sou desu yo.",
            "vi": "Hay đấy. Nhưng tôi nghe dự báo thời tiết, nghe nói thứ Bảy trời mưa đấy."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "この{雑誌|ざっし}を{見|み}てください。{少|すこ}し{雨|あめ}が{降|ふ}っても、{大会|たいかい}はあるそうです。でも、{風|かぜ}が{強|つよ}かったら、{中止|ちゅうし}です。",
            "ro": "Kono zasshi o mite kudasai. Sukoshi ame ga futte mo, taikai wa aru sou desu. Demo, kaze ga tsuyokattara, chuushi desu.",
            "vi": "Anh xem tạp chí này. Nghe nói dù mưa nhỏ lễ hội vẫn có. Nhưng nếu gió mạnh thì huỷ."
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "そうですか。{人|ひと}が{多|おお}いと{思|おも}いますか。",
            "ro": "Sou desu ka. Hito ga ooi to omoimasu ka.",
            "vi": "Vậy à. Chị nghĩ có đông người không?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "ええ、きっと{混|こ}むと{思|おも}います。{夕方|ゆうがた}{早|はや}く{行|い}きましょう。それから、{浴衣|ゆかた}を{着|き}て{行|い}ったら、{店|みせ}の{物|もの}が{十|じゅっ}パーセント{引|び}きだそうですよ。",
            "ro": "Ee, kitto komu to omoimasu. Yuugata hayaku ikimashou. Sorekara, yukata o kite ittara, mise no mono ga ju paasento biki da sou desu yo.",
            "vi": "Ừ, tôi nghĩ chắc chắn đông. Mình đi sớm lúc chiều tối nhé. Còn nữa, nghe nói nếu mặc yukata đến thì đồ ở các quán giảm 10% đấy."
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "へえ、おもしろいですね。{浴衣|ゆかた}はちょっと{高|たか}いですが、{高|たか}くても、{着|き}たいです。",
            "ro": "Hee, omoshiroi desu ne. Yukata wa chotto takai desu ga, takakute mo, kitai desu.",
            "vi": "Ồ, thú vị nhỉ. Yukata hơi đắt, nhưng dù đắt tôi vẫn muốn mặc."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "じゃ、{土曜日|どようび}の{四時|よじ}に{駅|えき}で{会|あ}いましょう。",
            "ro": "Ja, doyoubi no yoji ni eki de aimashou.",
            "vi": "Vậy 4 giờ thứ Bảy gặp nhau ở ga nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ht3-hieu",
        "title": "Hội thoại 3 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Anna rủ Carlos đi đâu?",
            "options": [
              "Lễ hội pháo hoa",
              "Buổi hoà nhạc",
              "Chợ đồ cũ",
              "Trận bóng đá"
            ],
            "correct": 0,
            "why": "花火大会に 行きませんか."
          },
          {
            "q": "Carlos lo điều gì?",
            "options": [
              "Vé đắt",
              "Thứ Bảy trời mưa",
              "Anh không có yukata",
              "Anh không rảnh"
            ],
            "correct": 1,
            "why": "土曜日は 雨が 降る そうです."
          },
          {
            "q": "Nếu mưa nhỏ thì lễ hội thế nào?",
            "options": [
              "Vẫn có",
              "Bị huỷ",
              "Hoãn sang Chủ nhật",
              "Không biết"
            ],
            "correct": 0,
            "why": "少し 雨が 降っても、大会は ある そうです."
          },
          {
            "q": "Khi nào lễ hội bị huỷ?",
            "options": [
              "Khi gió mạnh",
              "Khi đông người",
              "Khi trời nhiều mây",
              "Khi mưa nhỏ"
            ],
            "correct": 0,
            "why": "風が 強かったら、中止です."
          },
          {
            "q": "Mặc yukata đến thì sao?",
            "options": [
              "Vào cửa miễn phí",
              "Đồ ở quán giảm 10%",
              "Được chỗ ngồi tốt",
              "Được tặng quà"
            ],
            "correct": 1,
            "why": "浴衣を 着て 行ったら、10パーセント引きだ そうです."
          },
          {
            "q": "Hai người hẹn gặp ở đâu, lúc mấy giờ?",
            "options": [
              "Ở ga, 4 giờ",
              "Ở bờ sông, 4 giờ",
              "Ở ký túc xá, 4 giờ",
              "Ở ga, 7 giờ"
            ],
            "correct": 0,
            "why": "土曜日の 四時に 駅で 会いましょう."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-ht3-dien",
        "title": "Hội thoại 3 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "アンナ：{土曜日|どようび}、{暇|ひま}＿＿、{花火大会|はなびたいかい}に{行|い}きませんか。　〔Anna: doyoubi, hima __, hanabitaikai ni ikimasen ka.〕",
            "answers": [
              "だったら"
            ],
            "hint": "ナA → nếu"
          },
          {
            "q": "アンナ：{少|すこ}し{雨|あめ}が＿＿、{大会|たいかい}はあるそうです。　〔Anna: sukoshi ame ga __, taikai wa aru sou desu.〕",
            "answers": [
              "降っても",
              "ふっても"
            ],
            "hint": "ふります → dù"
          },
          {
            "q": "アンナ：{風|かぜ}が＿＿、{中止|ちゅうし}です。　〔Anna: kaze ga __, chuushi desu.〕",
            "answers": [
              "強かったら",
              "つよかったら"
            ],
            "hint": "つよい → nếu"
          },
          {
            "q": "カルロス：{高|たか}＿＿、{着|き}たいです。　〔Karurosu: taka__, kitai desu.〕",
            "answers": [
              "くても"
            ],
            "hint": "たかい → dù"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-ht3-sx",
        "title": "Hội thoại 3 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: rủ đi lễ hội nếu rảnh → nghe nói thứ Bảy mưa → xem tạp chí: dù mưa nhỏ vẫn có, gió mạnh thì huỷ → hỏi có đông không.",
            "chips": [
              "この{雑誌|ざっし}を{見|み}てください。{少|すこ}し{雨|あめ}が{降|ふ}っても、{大会|たいかい}はあるそうです。でも、{風|かぜ}が{強|つよ}かったら、{中止|ちゅうし}です。",
              "いいですね。でも、{天気予報|てんきよほう}で{聞|き}きましたが、{土曜日|どようび}は{雨|あめ}が{降|ふ}るそうですよ。",
              "そうですか。{人|ひと}が{多|おお}いと{思|おも}いますか。",
              "カルロスさん、{土曜日|どようび}、{暇|ひま}だったら、{花火大会|はなびたいかい}に{行|い}きませんか。"
            ],
            "answer": [
              "カルロスさん、{土曜日|どようび}、{暇|ひま}だったら、{花火大会|はなびたいかい}に{行|い}きませんか。",
              "いいですね。でも、{天気予報|てんきよほう}で{聞|き}きましたが、{土曜日|どようび}は{雨|あめ}が{降|ふ}るそうですよ。",
              "この{雑誌|ざっし}を{見|み}てください。{少|すこ}し{雨|あめ}が{降|ふ}っても、{大会|たいかい}はあるそうです。でも、{風|かぜ}が{強|つよ}かったら、{中止|ちゅうし}です。",
              "そうですか。{人|ひと}が{多|おお}いと{思|おも}いますか。"
            ],
            "ro": "Karurosu-san, doyoubi, hima dattara, hanabitaikai ni ikimasen ka. Ii desu ne. Demo, tenkiyohou de kikimashita ga, doyoubi wa ame ga furu sou desu yo. Kono zasshi o mite kudasai. Sukoshi ame ga futte mo, taikai wa aru sou desu. Demo, kaze ga tsuyokattara, chuushi desu. Sou desu ka. Hito ga ooi to omoimasu ka."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 4.** Mary và Marco ra phố tìm quán cà phê trong tạp chí. Đến nơi thì gặp đủ chuyện: người xếp hàng dài, tiệm bên cạnh đóng cửa, vào quán ramen thì cốc bị bẩn."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 4 — Ngoài phố — \"Ơ, đóng cửa rồi kìa\"",
        "lines": [
          {
            "who": "メアリー",
            "role": "a",
            "text": "あっ、マルコさん、あのカフェ、{人|ひと}がたくさん{並|なら}んでいますよ。",
            "ro": "A, Maruko-san, ano kafe, hito ga takusan narande imasu yo.",
            "vi": "Ơ, Marco, quán cà phê kia có nhiều người đang xếp hàng kìa."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{本当|ほんとう}だ。{雑誌|ざっし}に{出|で}ていた{店|みせ}ですからね。たぶん{一時間|いちじかん}{以上|いじょう}{待|ま}たなければならないと{思|おも}います。",
            "ro": "Hontou da. Zasshi ni dete ita mise desu kara ne. Tabun ichijikan ijou matanakereba naranai to omoimasu.",
            "vi": "Thật này. Vì là quán có trong tạp chí mà. Tôi nghĩ có lẽ phải chờ hơn một tiếng."
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "じゃ、{隣|となり}のパン{屋|や}はどうですか。…あれ？{閉|し}まっていますね。",
            "ro": "Ja, tonari no pan'ya wa dou desu ka.... Are? Shimatte imasu ne.",
            "vi": "Vậy tiệm bánh mì bên cạnh thì sao? … Ơ? Đóng cửa rồi nhỉ."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{今日|きょう}は{休|やす}みですね。あ、あそこのラーメン{屋|や}はすいていますよ。{入|はい}りませんか。",
            "ro": "Kyou wa yasumi desu ne. A, asoko no raamen'ya wa suite imasu yo. Hairimasen ka.",
            "vi": "Hôm nay họ nghỉ nhỉ. À, quán ramen đằng kia vắng đấy. Vào không?"
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "いいですね。（{店|みせ}の{中|なか}で）すみません、このコップ、{汚|よご}れています。",
            "ro": "Ii desu ne. (Mise no naka de) sumimasen, kono koppu, yogorete imasu.",
            "vi": "Được đấy. (Trong quán) Xin lỗi, cái cốc này bị bẩn."
          },
          {
            "who": "店員",
            "role": "c",
            "text": "あっ、すみません。すぐ{新|あたら}しいのを{持|も}って{来|き}ます。",
            "ro": "A, sumimasen. Sugu atarashii no o motte kimasu.",
            "vi": "Ôi, xin lỗi chị. Tôi mang cái mới ngay ạ."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{外|そと}は{混|こ}んでいましたが、ここは{静|しず}かでいいですね。",
            "ro": "Soto wa konde imashita ga, koko wa shizuka de ii desu ne.",
            "vi": "Ngoài kia đông thế mà ở đây yên tĩnh, dễ chịu nhỉ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ht4-hieu",
        "title": "Hội thoại 4 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Ở quán cà phê có gì?",
            "options": [
              "Nhiều người đang xếp hàng",
              "Quán vắng",
              "Quán đóng cửa",
              "Quán đang giảm giá"
            ],
            "correct": 0,
            "why": "人が たくさん 並んで います."
          },
          {
            "q": "Vì sao quán cà phê đông?",
            "options": [
              "Trời mưa",
              "Quán mới mở",
              "Quán đang miễn phí",
              "Quán có trong tạp chí"
            ],
            "correct": 3,
            "why": "雑誌に 出て いた 店ですから."
          },
          {
            "q": "Marco đoán phải chờ bao lâu?",
            "options": [
              "Hai tiếng chắc chắn",
              "Không cần chờ",
              "Mười phút",
              "Có lẽ hơn một tiếng"
            ],
            "correct": 3,
            "why": "たぶん 一時間以上 待たなければ ならないと 思います."
          },
          {
            "q": "Tiệm bánh mì bên cạnh thế nào?",
            "options": [
              "Vắng",
              "Đang giảm giá",
              "Đông người",
              "Đóng cửa (hôm nay nghỉ)"
            ],
            "correct": 3,
            "why": "閉まって いますね。今日は 休みですね."
          },
          {
            "q": "Hai người vào đâu? Vì sao?",
            "options": [
              "Quán cà phê — vì ngon",
              "Không vào đâu",
              "Tiệm bánh — vì rẻ",
              "Quán ramen — vì vắng"
            ],
            "correct": 3,
            "why": "ラーメン屋は すいて いますよ."
          },
          {
            "q": "Trong quán có chuyện gì?",
            "options": [
              "Đèn tắt",
              "Cốc bị vỡ",
              "Không có chỗ ngồi",
              "Cốc bị bẩn"
            ],
            "correct": 3,
            "why": "この コップ、汚れて います."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-ht4-dien",
        "title": "Hội thoại 4 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "メアリー：あのカフェ、{人|ひと}がたくさん＿＿いますよ。　〔Mearii: ano kafe, hito ga takusan __ imasu yo.〕",
            "answers": [
              "並んで",
              "ならんで"
            ],
            "hint": "ならびます → thể て"
          },
          {
            "q": "メアリー：あれ？＿＿いますね。　〔Mearii: are? __ imasu ne.〕",
            "answers": [
              "閉まって",
              "しまって"
            ],
            "hint": "しまります → thể て"
          },
          {
            "q": "マルコ：あそこのラーメン{屋|や}は＿＿いますよ。　〔Maruko: asoko no raamen'ya wa __ imasu yo.〕",
            "answers": [
              "すいて"
            ],
            "hint": "すきます → thể て"
          },
          {
            "q": "メアリー：すみません、このコップ、＿＿います。　〔Mearii: sumimasen, kono koppu, __ imasu.〕",
            "answers": [
              "汚れて",
              "よごれて"
            ],
            "hint": "よごれます → thể て"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-ht4-sx",
        "title": "Hội thoại 4 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: thấy người xếp hàng ở quán cà phê → thật này, chắc phải chờ hơn 1 tiếng → hỏi tiệm bánh bên cạnh, nhưng đóng cửa → hôm nay nghỉ, quán ramen vắng.",
            "chips": [
              "{本当|ほんとう}だ。{雑誌|ざっし}に{出|で}ていた{店|みせ}ですからね。たぶん{一時間|いちじかん}{以上|いじょう}{待|ま}たなければならないと{思|おも}います。",
              "あっ、マルコさん、あのカフェ、{人|ひと}がたくさん{並|なら}んでいますよ。",
              "じゃ、{隣|となり}のパン{屋|や}はどうですか。…あれ？{閉|し}まっていますね。",
              "{今日|きょう}は{休|やす}みですね。あ、あそこのラーメン{屋|や}はすいていますよ。{入|はい}りませんか。"
            ],
            "answer": [
              "あっ、マルコさん、あのカフェ、{人|ひと}がたくさん{並|なら}んでいますよ。",
              "{本当|ほんとう}だ。{雑誌|ざっし}に{出|で}ていた{店|みせ}ですからね。たぶん{一時間|いちじかん}{以上|いじょう}{待|ま}たなければならないと{思|おも}います。",
              "じゃ、{隣|となり}のパン{屋|や}はどうですか。…あれ？{閉|し}まっていますね。",
              "{今日|きょう}は{休|やす}みですね。あ、あそこのラーメン{屋|や}はすいていますよ。{入|はい}りませんか。"
            ],
            "ro": "A, Maruko-san, ano kafe, hito ga takusan narande imasu yo. Hontou da. Zasshi ni dete ita mise desu kara ne. Tabun ichijikan ijou matanakereba naranai to omoimasu. Ja, tonari no pan'ya wa dou desu ka.... Are? Shimatte imasu ne. Kyou wa yasumi desu ne. A, asoko no raamen'ya wa suite imasu yo. Hairimasen ka."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · Hội thoại 5: kể chuyện cuộc thi hùng biện (thể thường, bạn bè)"
      },
      {
        "t": "p",
        "text": "**Tình huống 5.** Sáng thứ Hai, Nishikawa hỏi Park về cuộc thi hùng biện tiếng Nhật hôm qua. Hai người là bạn nên nói bằng thể thường."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 5 — Cuộc thi hùng biện — \"Vậy mà Wang được hạng nhất!\"",
        "lines": [
          {
            "who": "西川",
            "role": "b",
            "text": "パクさん、{昨日|きのう}のスピーチコンテスト、どうだった？",
            "ro": "Paku-san, kinou no supiichikontesuto, dou datta?",
            "vi": "Park, cuộc thi hùng biện hôm qua thế nào?"
          },
          {
            "who": "パク",
            "role": "a",
            "text": "すごく{緊張|きんちょう}したよ。ホールに{人|ひと}が{三百人|さんびゃくにん}ぐらい{集|あつ}まっていたから。",
            "ro": "Sugoku kinchou shita yo. Hooru ni hito ga sanbyakunin gurai atsumatte ita kara.",
            "vi": "Hồi hộp lắm luôn. Vì ở hội trường có khoảng ba trăm người tụ tập."
          },
          {
            "who": "西川",
            "role": "b",
            "text": "へえ。{最後|さいご}まで{話|はな}すことができた？",
            "ro": "Hee. Saigo made hanasu koto ga dekita?",
            "vi": "Ồ. Cậu nói được đến cuối không?"
          },
          {
            "who": "パク",
            "role": "a",
            "text": "うん。{初|はじ}めは{手|て}が{冷|つめ}たくなったけど、お{客|きゃく}さんがうなずいたり、{笑|わら}ったりしていたから、{最後|さいご}まで{話|はな}すことができたよ。",
            "ro": "Un. Hajime wa te ga tsumetaku natta kedo, okyakusan ga unazuitari, warattari shite ita kara, saigo made hanasu koto ga dekita yo.",
            "vi": "Ừ. Lúc đầu tay lạnh ngắt, nhưng khán giả cứ gật gù rồi cười, nên tớ nói được đến cuối."
          },
          {
            "who": "西川",
            "role": "b",
            "text": "よかったね。それで、{何位|なんい}だった？",
            "ro": "Yokatta ne. Sorede, nan'i datta?",
            "vi": "Tốt quá. Thế được hạng mấy?"
          },
          {
            "who": "パク",
            "role": "a",
            "text": "{私|わたし}は{三位|さんい}。それから、なんと、ワンさんが{一位|いちい}だった！",
            "ro": "Watashi wa san'i. Sorekara, nanto, Wan-san ga ichii datta!",
            "vi": "Tớ hạng ba. Còn nữa, không ngờ là Wang được hạng nhất!"
          },
          {
            "who": "西川",
            "role": "b",
            "text": "{本当|ほんとう}？すごいね。{僕|ぼく}も{来年|らいねん}{出|で}たいな。",
            "ro": "Hontou? Sugoi ne. Boku mo rainen detai na.",
            "vi": "Thật hả? Giỏi ghê. Năm sau tớ cũng muốn thi."
          },
          {
            "who": "パク",
            "role": "a",
            "text": "{出|で}たら、きっといい{思|おも}い{出|で}になると{思|おも}うよ。",
            "ro": "Detara, kitto ii omoide ni naru to omou yo.",
            "vi": "Nếu cậu thi thì tớ nghĩ chắc chắn sẽ thành kỷ niệm đẹp đấy."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ht5-hieu",
        "title": "Hội thoại 5 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Vì sao Park hồi hộp?",
            "options": [
              "Thầy giáo nhìn chị",
              "Có khoảng 300 người ở hội trường",
              "Chị quên bài",
              "Chị đến muộn"
            ],
            "correct": 1,
            "why": "ホールに 人が 三百人ぐらい 集まって いたから."
          },
          {
            "q": "Lúc đầu Park thế nào?",
            "options": [
              "Không nói được",
              "Cười to",
              "Đau đầu",
              "Tay lạnh ngắt"
            ],
            "correct": 3,
            "why": "初めは 手が 冷たく なった."
          },
          {
            "q": "Khán giả làm gì khi Park nói?",
            "options": [
              "Ngủ",
              "Gật gù và cười",
              "Nói chuyện riêng",
              "Ra về"
            ],
            "correct": 1,
            "why": "お客さんが うなずいたり、笑ったり して いた."
          },
          {
            "q": "Park đã nói được đến cuối không?",
            "options": [
              "Được",
              "Không nói gì",
              "Chỉ nói được một nửa",
              "Không"
            ],
            "correct": 0,
            "why": "最後まで 話す ことが できたよ."
          },
          {
            "q": "Park được hạng mấy? Ai hạng nhất?",
            "options": [
              "Park hạng 1, Wang hạng 3",
              "Park hạng 3, Wang hạng 1",
              "Park hạng 2, Wang hạng 1",
              "Cả hai hạng 1"
            ],
            "correct": 1,
            "why": "私は 三位。なんと、ワンさんが 一位だった！"
          },
          {
            "q": "Park nghĩ gì nếu Nishikawa thi năm sau?",
            "options": [
              "Không nên thi",
              "Chắc chắn sẽ thành kỷ niệm đẹp",
              "Có lẽ sẽ thua",
              "Sẽ rất mệt"
            ],
            "correct": 1,
            "why": "出たら、きっと いい 思い出に なると 思うよ."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-ht5-dien",
        "title": "Hội thoại 5 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "パク：ホールに{人|ひと}が{三百人|さんびゃくにん}ぐらい＿＿いたから。　〔Paku: hooru ni hito ga sanbyakunin gurai __ ita kara.〕",
            "answers": [
              "集まって",
              "あつまって"
            ],
            "hint": "あつまります → thể て"
          },
          {
            "q": "パク：お{客|きゃく}さんがうなずいたり、＿＿していた。　〔Paku: okyakusan ga unazuitari, __ shite ita.〕",
            "answers": [
              "笑ったり",
              "わらったり"
            ],
            "hint": "わらいます → ～たり"
          },
          {
            "q": "パク：＿＿、ワンさんが{一位|いちい}だった！　〔Paku: __, Wan-san ga ichii datta!〕",
            "answers": [
              "なんと"
            ],
            "hint": "bất ngờ, không ngờ"
          },
          {
            "q": "パク：{出|で}たら、きっといい{思|おも}い{出|で}になると＿＿よ。　〔Paku: detara, kitto ii omoide ni naru to __ yo.〕",
            "answers": [
              "思う",
              "おもう"
            ],
            "hint": "thể thường của 思います"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-ht5-sx",
        "title": "Hội thoại 5 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi cuộc thi thế nào → rất hồi hộp vì 300 người → hỏi có nói đến cuối không → lúc đầu tay lạnh, khán giả gật gù nên nói được.",
            "chips": [
              "うん。{初|はじ}めは{手|て}が{冷|つめ}たくなったけど、お{客|きゃく}さんがうなずいたり、{笑|わら}ったりしていたから、{最後|さいご}まで{話|はな}すことができたよ。",
              "すごく{緊張|きんちょう}したよ。ホールに{人|ひと}が{三百人|さんびゃくにん}ぐらい{集|あつ}まっていたから。",
              "へえ。{最後|さいご}まで{話|はな}すことができた？",
              "パクさん、{昨日|きのう}のスピーチコンテスト、どうだった？"
            ],
            "answer": [
              "パクさん、{昨日|きのう}のスピーチコンテスト、どうだった？",
              "すごく{緊張|きんちょう}したよ。ホールに{人|ひと}が{三百人|さんびゃくにん}ぐらい{集|あつ}まっていたから。",
              "へえ。{最後|さいご}まで{話|はな}すことができた？",
              "うん。{初|はじ}めは{手|て}が{冷|つめ}たくなったけど、お{客|きゃく}さんがうなずいたり、{笑|わら}ったりしていたから、{最後|さいご}まで{話|はな}すことができたよ。"
            ],
            "ro": "Paku-san, kinou no supiichikontesuto, dou datta? Sugoku kinchou shita yo. Hooru ni hito ga sanbyakunin gurai atsumatte ita kara. Hee. Saigo made hanasu koto ga dekita? Un. Hajime wa te ga tsumetaku natta kedo, okyakusan ga unazuitari, warattari shite ita kara, saigo made hanasu koto ga dekita yo."
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
          "Che lời của vai **B**, đọc lời vai A rồi tự nói vai B thành tiếng; sau đó đổi vai. Mỗi mẫu nói 3 lượt — lượt 3 không nhìn chữ.",
          "Mẫu 1–3 **lịch sự** (nói với người mới quen, thầy cô); mẫu 4 **thể thường** (nói với bạn thân)."
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 1 — Kể tin nghe được",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "{何|なに}かニュースを{知|し}っていますか。",
            "ro": "Nani ka nyuusu o shitte imasu ka.",
            "vi": "Bạn có biết tin gì không?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "ええ。{昨日|きのう}{大|おお}きい{地震|じしん}があったそうです。",
            "ro": "Ee. Kinou ookii jishin ga atta sou desu.",
            "vi": "Có. Nghe nói hôm qua có động đất lớn."
          },
          {
            "who": "A",
            "role": "a",
            "text": "{本当|ほんとう}ですか。{怖|こわ}いですね。",
            "ro": "Hontou desu ka. Kowai desu ne.",
            "vi": "Thật à? Đáng sợ nhỉ."
          },
          {
            "who": "B",
            "role": "b",
            "text": "{地震|じしん}で{古|ふる}いビルが{倒|たお}れたそうです。",
            "ro": "Jishin de furui biru ga taoreta sou desu.",
            "vi": "Nghe nói vì động đất mà toà nhà cũ bị đổ."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 2 — Rủ đi có điều kiện",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "{日曜日|にちようび}、{暇|ひま}だったら、フリーマーケットに{行|い}きませんか。",
            "ro": "Nichiyoubi, hima dattara, furiimaaketto ni ikimasen ka.",
            "vi": "Chủ nhật nếu rảnh thì đi chợ đồ cũ không?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "いいですね。{雨|あめ}が{降|ふ}ったら、どうしますか。",
            "ro": "Ii desu ne. Ame ga futtara, dou shimasu ka.",
            "vi": "Hay đấy. Nếu mưa thì sao?"
          },
          {
            "who": "A",
            "role": "a",
            "text": "{雨|あめ}が{降|ふ}っても、あるそうですよ。",
            "ro": "Ame ga futte mo, aru sou desu yo.",
            "vi": "Nghe nói dù mưa vẫn có đấy."
          },
          {
            "who": "B",
            "role": "b",
            "text": "じゃ、きっと{楽|たの}しいと{思|おも}います。{行|い}きましょう。",
            "ro": "Ja, kitto tanoshii to omoimasu. Ikimashou.",
            "vi": "Vậy tôi nghĩ chắc chắn vui. Đi thôi."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 3 — Tả cảnh ngoài phố",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "あっ、{電車|でんしゃ}が{止|と}まっています。",
            "ro": "A, densha ga tomatte imasu.",
            "vi": "Ơ, tàu đang dừng."
          },
          {
            "who": "B",
            "role": "b",
            "text": "{本当|ほんとう}ですね。{事故|じこ}で{止|と}まっているそうです。",
            "ro": "Hontou desu ne. Jiko de tomatte iru sou desu.",
            "vi": "Đúng thật. Nghe nói dừng vì tai nạn."
          },
          {
            "who": "A",
            "role": "a",
            "text": "じゃ、バスで{行|い}きませんか。",
            "ro": "Ja, basu de ikimasen ka.",
            "vi": "Vậy đi xe buýt không?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "そうですね。バスはたぶんすいていると{思|おも}います。",
            "ro": "Sou desu ne. Basu wa tabun suite iru to omoimasu.",
            "vi": "Ừ nhỉ. Tôi nghĩ xe buýt có lẽ vắng."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 4 — Với bạn thân (thể thường)",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "ねえ、これ、{知|し}ってる？{駅|えき}の{前|まえ}にカフェができたそうだよ。",
            "ro": "Nee, kore, shitteru? Eki no mae ni kafe ga dekita sou da yo.",
            "vi": "Này, biết cái này chưa? Nghe nói trước ga mới mở quán cà phê đấy."
          },
          {
            "who": "B",
            "role": "b",
            "text": "{本当|ほんとう}？{行|い}きたいな。{土曜日|どようび}、{暇|ひま}だったら、{行|い}かない？",
            "ro": "Hontou? Ikitai na. Doyoubi, hima dattara, ikanai?",
            "vi": "Thật hả? Muốn đi ghê. Thứ Bảy rảnh thì đi không?"
          },
          {
            "who": "A",
            "role": "a",
            "text": "うん、{行|い}く。でも、きっと{混|こ}んでいると{思|おも}うよ。",
            "ro": "Un, iku. Demo, kitto konde iru to omou yo.",
            "vi": "Ừ, tớ đi. Nhưng tớ nghĩ chắc chắn đông lắm đấy."
          },
          {
            "who": "B",
            "role": "b",
            "text": "{混|こ}んでいても、{大丈夫|だいじょうぶ}。{待|ま}つよ。",
            "ro": "Konde ite mo, daijoubu. Matsu yo.",
            "vi": "Đông cũng không sao. Tớ chờ."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b15-ht-noi",
        "part": "1",
        "questions": [
          "なにか ニュースを しって いますか。",
          "あした の てんきは どうだ そうですか。",
          "じしんの ニュースを きいた とき、なんと いいますか。",
          "じかんが あったら、なにを したいですか。",
          "あめが ふっても、でかけますか。",
          "あした、きっと はれると おもいますか。",
          "（まちで）でんしゃが とまって います。どうしますか。",
          "（ともだちに）これ、しってる？"
        ]
      }
    ]
  },
  {
    "id": "lt-b15-doc-hieu",
    "kind": "reading",
    "title": "Luyện thêm Bài 15 · Đọc hiểu — 4 đoạn dài dần + 4 đoạn KHÔNG furigana (~41 câu)",
    "goal": "Đọc hiểu tờ quảng cáo trong tạp chí, nhật ký kể lại tin bão, blog đi phố và bài văn \"私の思い出\": tìm đúng tin nghe được (～そうです), nguyên nhân (N で), điều kiện / dù (～たら · ～ても), điều người viết đoán (～と思います) và trạng thái lúc đó (～て いました); đọc được đoạn không furigana như đề thi.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đọc **2 lượt**: lượt 1 tìm **sự kiện / thời gian / nơi chốn**; lượt 2 gạch dưới **tin nghe được** (～そうです), **nguyên nhân** (N で), **điều kiện** (～たら · ～だったら), **dù** (～ても · ～でも), **đoán** (きっと／たぶん ～と思います) và **trạng thái** (～て います／～て いました).",
          "Bẫy hay gặp: **たら (nếu) ≠ ても (dù)** — câu hỏi hay đảo hai ý này · tờ quảng cáo có **～パーセント引き**, **無料**, **以上** · bản tin dùng **～そうです** liên tục — người viết không tự chứng kiến · bài văn có **でも** (đảo chiều) và **なんと** (điều bất ngờ).",
          "Mức Khó dùng **readkanji** không furigana: chỉ chữ Hán đã học đến Bài 15. Đọc to, rồi bấm xem."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đoạn 1 — tờ quảng cáo chợ đồ cũ (trong tạp chí)"
      },
      {
        "t": "passage",
        "title": "Đoạn 1 — Quảng cáo \"Chợ đồ cũ công viên Midori\"",
        "intro": "Có furigana. Tìm: ngày giờ · phí vào · nếu mưa · mua bao nhiêu thì có quà · lưu ý.",
        "paras": [
          {
            "label": "A",
            "text": "〈みどり{公園|こうえん}フリーマーケット〉{日曜日|にちようび}{十時|じゅうじ}～{四時|よじ}。{入場料|にゅうじょうりょう}は{無料|むりょう}です。{服|ふく}、{本|ほん}、{電気製品|でんきせいひん}など、{安|やす}くていいものがたくさんあります。※{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}です。※{千円|せんえん}{以上|いじょう}{買|か}ったら、かわいいストラップをプレゼントします。※{車|くるま}で{来|こ}ないでください。"
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
            "en": "〈みどり{公園|こうえん}フリーマーケット〉{日曜日|にちようび}{十時|じゅうじ}～{四時|よじ}。",
            "ro": "〈midorikouen furiimaaketto〉 nichiyoubi juuji ~ yoji.",
            "vi": "Chợ đồ cũ công viên Midori — Chủ nhật, 10 giờ đến 4 giờ."
          },
          {
            "en": "{入場料|にゅうじょうりょう}は{無料|むりょう}です。",
            "ro": "Nyuujouryou wa muryou desu.",
            "vi": "Vào cửa miễn phí."
          },
          {
            "en": "{服|ふく}、{本|ほん}、{電気製品|でんきせいひん}など、{安|やす}くていいものがたくさんあります。",
            "ro": "Fuku, hon, denkiseihin nado, yasukute ii mono ga takusan arimasu.",
            "vi": "Có rất nhiều đồ rẻ mà tốt như quần áo, sách, đồ điện."
          },
          {
            "en": "{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}です。",
            "ro": "Ame ga futtara, chuushi desu.",
            "vi": "Nếu mưa thì huỷ."
          },
          {
            "en": "{千円|せんえん}{以上|いじょう}{買|か}ったら、かわいいストラップをプレゼントします。",
            "ro": "Sen'en ijou kattara, kawaii sutorappu o purezento shimasu.",
            "vi": "Nếu mua từ 1.000 yên trở lên thì được tặng một dây đeo dễ thương."
          },
          {
            "en": "{車|くるま}で{来|こ}ないでください。",
            "ro": "Kuruma de konaide kudasai.",
            "vi": "Xin đừng đến bằng ô tô."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-doc1-q",
        "title": "Đoạn 1 — câu hỏi (6 câu)",
        "items": [
          {
            "q": "Chợ đồ cũ mở khi nào?",
            "options": [
              "Thứ Bảy, 10 giờ – 4 giờ",
              "Chủ nhật, 10 giờ – 4 giờ",
              "Chủ nhật, 4 giờ – 10 giờ",
              "Mỗi ngày"
            ],
            "correct": 1,
            "why": "日曜日 十時～四時."
          },
          {
            "q": "Phí vào cửa bao nhiêu?",
            "options": [
              "100 yên",
              "Miễn phí",
              "Trẻ em miễn phí, người lớn 500 yên",
              "1.000 yên"
            ],
            "correct": 1,
            "why": "入場料は 無料です."
          },
          {
            "q": "Nếu trời mưa thì sao?",
            "options": [
              "Chuyển vào trong nhà",
              "Dời sang thứ Bảy",
              "Bị huỷ",
              "Vẫn có"
            ],
            "correct": 2,
            "why": "雨が 降ったら、中止です."
          },
          {
            "q": "Mua bao nhiêu thì được quà?",
            "options": [
              "Từ 10.000 yên",
              "Mua bất kỳ thứ gì",
              "Dưới 1.000 yên",
              "Từ 1.000 yên trở lên"
            ],
            "correct": 3,
            "why": "千円以上 買ったら."
          },
          {
            "q": "Quà là gì?",
            "options": [
              "Sách",
              "Phiếu giảm giá",
              "Quần áo",
              "Dây đeo dễ thương"
            ],
            "correct": 3,
            "why": "かわいい ストラップを プレゼント します."
          },
          {
            "q": "Điều gì KHÔNG nên làm?",
            "options": [
              "Mang túi",
              "Đến lúc 10 giờ",
              "Đến bằng ô tô",
              "Mua đồ điện"
            ],
            "correct": 2,
            "why": "車で 来ないで ください."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đoạn 2–3 — nhật ký kể tin bão · blog đi phố"
      },
      {
        "t": "passage",
        "title": "Đoạn 2 — Nhật ký của Mariyam: \"Tin bão sáng nay\"",
        "intro": "Kiểu kể lại tin: tìm cái gì đã xảy ra · vì sao · người có sao không · bây giờ thế nào.",
        "paras": [
          {
            "label": "A",
            "text": "{十月|じゅうがつ}{五日|いつか}（{月|げつ}）{曇|くも}り。{今朝|けさ}、テレビのニュースで{見|み}ましたが、{昨日|きのう}の{夜|よる}、{大|おお}きい{台風|たいふう}が{九州|きゅうしゅう}に{来|き}たそうです。{強|つよ}い{風|かぜ}で{木|き}が{倒|たお}れたり、{窓|まど}ガラスが{割|わ}れたりしたそうです。"
          },
          {
            "label": "B",
            "text": "{台風|たいふう}で{電車|でんしゃ}も{止|と}まって、{今|いま}も{止|と}まっているそうです。けがをして{入院|にゅういん}した{人|ひと}が{三人|さんにん}いるそうですが、{亡|な}くなった{人|ひと}はいないそうです。よかったです。"
          },
          {
            "label": "C",
            "text": "{九州|きゅうしゅう}には{友達|ともだち}のリンさんが{住|す}んでいますから、{心配|しんぱい}でした。すぐメールをしました。リンさんは{大丈夫|だいじょうぶ}だそうです。{雨|あめ}は{今日|きょう}の{夕方|ゆうがた}やむそうです。"
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
            "en": "{十月|じゅうがつ}{五日|いつか}（{月|げつ}）{曇|くも}り。",
            "ro": "Juugatsu itsuka (getsu) kumori.",
            "vi": "Ngày 5 tháng 10 (thứ Hai), trời nhiều mây."
          },
          {
            "en": "{今朝|けさ}、テレビのニュースで{見|み}ましたが、{昨日|きのう}の{夜|よる}、{大|おお}きい{台風|たいふう}が{九州|きゅうしゅう}に{来|き}たそうです。",
            "ro": "Kesa, terebi no nyuusu de mimashita ga, kinou no yoru, ookii taifuu ga Kyuushuu ni kita sou desu.",
            "vi": "Sáng nay tôi xem thời sự trên ti vi, nghe nói tối qua có cơn bão lớn vào Kyushu."
          },
          {
            "en": "{強|つよ}い{風|かぜ}で{木|き}が{倒|たお}れたり、{窓|まど}ガラスが{割|わ}れたりしたそうです。",
            "ro": "Tsuyoi kaze de ki ga taoretari, mado garasu ga waretari shita sou desu.",
            "vi": "Nghe nói vì gió mạnh mà cây đổ, kính cửa sổ vỡ."
          },
          {
            "en": "{台風|たいふう}で{電車|でんしゃ}も{止|と}まって、{今|いま}も{止|と}まっているそうです。",
            "ro": "Taifuu de densha mo tomatte, ima mo tomatte iru sou desu.",
            "vi": "Nghe nói vì bão mà tàu cũng dừng, đến giờ vẫn đang dừng."
          },
          {
            "en": "けがをして{入院|にゅういん}した{人|ひと}が{三人|さんにん}いるそうですが、{亡|な}くなった{人|ひと}はいないそうです。",
            "ro": "Kega o shite nyuuin shita hito ga sannin iru sou desu ga, nakunatta hito wa inai sou desu.",
            "vi": "Nghe nói có ba người bị thương phải nhập viện, nhưng không có ai thiệt mạng."
          },
          {
            "en": "よかったです。",
            "ro": "Yokatta desu.",
            "vi": "May quá."
          },
          {
            "en": "{九州|きゅうしゅう}には{友達|ともだち}のリンさんが{住|す}んでいますから、{心配|しんぱい}でした。",
            "ro": "Kyuushuu ni wa tomodachi no Rin-san ga sunde imasu kara, shinpai deshita.",
            "vi": "Bạn tôi là Lin sống ở Kyushu nên tôi đã lo."
          },
          {
            "en": "すぐメールをしました。",
            "ro": "Sugu meeru o shimashita.",
            "vi": "Tôi liền gửi email."
          },
          {
            "en": "リンさんは{大丈夫|だいじょうぶ}だそうです。",
            "ro": "Rin-san wa daijoubu da sou desu.",
            "vi": "Nghe nói Lin không sao."
          },
          {
            "en": "{雨|あめ}は{今日|きょう}の{夕方|ゆうがた}やむそうです。",
            "ro": "Ame wa kyou no yuugata yamu sou desu.",
            "vi": "Nghe nói mưa sẽ tạnh vào chiều tối nay."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-doc2-q",
        "title": "Đoạn 2 — câu hỏi (8 câu)",
        "items": [
          {
            "q": "Mariyam biết tin bão từ đâu?",
            "options": [
              "Thời sự trên ti vi",
              "Bạn Lin gọi điện",
              "Tạp chí",
              "Tự mình thấy"
            ],
            "correct": 0,
            "why": "テレビの ニュースで 見ました."
          },
          {
            "q": "Bão đến Kyushu khi nào?",
            "options": [
              "Tuần trước",
              "Tối qua",
              "Chiều tối nay",
              "Sáng nay"
            ],
            "correct": 1,
            "why": "昨日の 夜."
          },
          {
            "q": "Vì gió mạnh mà chuyện gì xảy ra?",
            "options": [
              "Xe buýt lật",
              "Nhà sập",
              "Mất điện cả thành phố",
              "Cây đổ, kính cửa sổ vỡ"
            ],
            "correct": 3,
            "why": "木が 倒れたり、窓ガラスが 割れたり した そうです."
          },
          {
            "q": "Tàu điện bây giờ thế nào?",
            "options": [
              "Vẫn chưa chạy",
              "Đã chạy lại",
              "Chạy chậm",
              "Không nói"
            ],
            "correct": 0,
            "why": "今も 止まって いる そうです."
          },
          {
            "q": "Có bao nhiêu người nhập viện?",
            "options": [
              "3 người",
              "30 người",
              "1 người",
              "Không ai"
            ],
            "correct": 0,
            "why": "入院した 人が 三人 いる そうです."
          },
          {
            "q": "Vì sao Mariyam lo lắng?",
            "options": [
              "Bạn Lin sống ở Kyushu",
              "Chị sợ bão",
              "Gia đình chị ở Kyushu",
              "Chị sắp đi Kyushu"
            ],
            "correct": 0,
            "why": "九州には 友達の リンさんが 住んで いますから."
          },
          {
            "q": "Lin có sao không?",
            "options": [
              "Không sao",
              "Chưa biết",
              "Nhập viện",
              "Bị thương nhẹ"
            ],
            "correct": 0,
            "why": "リンさんは 大丈夫だ そうです."
          },
          {
            "q": "Thông tin nào Mariyam KHÔNG tự thấy mà nghe kể lại?",
            "options": [
              "Tất cả tin về bão",
              "Chị đã lo lắng",
              "Chị đã gửi email",
              "Trời hôm nay nhiều mây"
            ],
            "correct": 0,
            "why": "Tin bão đều dùng ～そうです; 曇り là chị tự thấy (ghi đầu nhật ký)."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đoạn 3 — Blog của Natapon: \"Một ngày đi phố\"",
        "intro": "Kiểu kể chuyện ngoài phố: tìm điều bất ngờ · trạng thái lúc đó (～て いました) · cách giải quyết.",
        "paras": [
          {
            "label": "A",
            "text": "{日曜日|にちようび}、{雑誌|ざっし}で{見|み}たカフェに{行|い}きました。{駅|えき}に{着|つ}いたら、{電車|でんしゃ}が{止|と}まっていました。{事故|じこ}で{止|と}まっているそうでした。バスも{混|こ}んでいましたから、{三十分|さんじゅっぷん}{歩|ある}いて{行|い}きました。"
          },
          {
            "label": "B",
            "text": "カフェの{前|まえ}には{人|ひと}がたくさん{並|なら}んでいました。{一時間|いちじかん}{待|ま}たなければなりませんでしたが、{待|ま}っても、{入|はい}りたかったです。{中|なか}は{席|せき}が{全部|ぜんぶ}{混|こ}んでいて、とてもにぎやかでした。"
          },
          {
            "label": "C",
            "text": "ケーキは{雑誌|ざっし}の{写真|しゃしん}と{同|おな}じで、{本当|ほんとう}においしかったです。{帰|かえ}るとき、{外|そと}に{出|で}たら、{雨|あめ}が{降|ふ}っていました。でも、{店|みせ}の{人|ひと}が{傘|かさ}を{貸|か}してくれました。いい{一日|いちにち}でした。"
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
            "en": "{日曜日|にちようび}、{雑誌|ざっし}で{見|み}たカフェに{行|い}きました。",
            "ro": "Nichiyoubi, zasshi de mita kafe ni ikimashita.",
            "vi": "Chủ nhật tôi đã đến quán cà phê thấy trong tạp chí."
          },
          {
            "en": "{駅|えき}に{着|つ}いたら、{電車|でんしゃ}が{止|と}まっていました。",
            "ro": "Eki ni tsuitara, densha ga tomatte imashita.",
            "vi": "Đến ga thì tàu điện đang dừng."
          },
          {
            "en": "{事故|じこ}で{止|と}まっているそうでした。",
            "ro": "Jiko de tomatte iru sou deshita.",
            "vi": "Nghe nói dừng vì tai nạn."
          },
          {
            "en": "バスも{混|こ}んでいましたから、{三十分|さんじゅっぷん}{歩|ある}いて{行|い}きました。",
            "ro": "Basu mo konde imashita kara, sanjuppun aruite ikimashita.",
            "vi": "Xe buýt cũng đông nên tôi đi bộ 30 phút."
          },
          {
            "en": "カフェの{前|まえ}には{人|ひと}がたくさん{並|なら}んでいました。",
            "ro": "Kafe no mae ni wa hito ga takusan narande imashita.",
            "vi": "Trước quán có rất nhiều người đang xếp hàng."
          },
          {
            "en": "{一時間|いちじかん}{待|ま}たなければなりませんでしたが、{待|ま}っても、{入|はい}りたかったです。",
            "ro": "Ichijikan matanakereba narimasen deshita ga, matte mo, hairitakatta desu.",
            "vi": "Phải chờ một tiếng, nhưng dù chờ tôi vẫn muốn vào."
          },
          {
            "en": "{中|なか}は{席|せき}が{全部|ぜんぶ}{混|こ}んでいて、とてもにぎやかでした。",
            "ro": "Naka wa seki ga zenbu konde ite, totemo nigiyaka deshita.",
            "vi": "Bên trong chỗ ngồi kín hết, rất náo nhiệt."
          },
          {
            "en": "ケーキは{雑誌|ざっし}の{写真|しゃしん}と{同|おな}じで、{本当|ほんとう}においしかったです。",
            "ro": "Keeki wa zasshi no shashin to onaji de, hontou ni oishikatta desu.",
            "vi": "Bánh giống ảnh trong tạp chí, ngon thật sự."
          },
          {
            "en": "{帰|かえ}るとき、{外|そと}に{出|で}たら、{雨|あめ}が{降|ふ}っていました。",
            "ro": "Kaeru toki, soto ni detara, ame ga futte imashita.",
            "vi": "Lúc về, ra ngoài thì trời đang mưa."
          },
          {
            "en": "でも、{店|みせ}の{人|ひと}が{傘|かさ}を{貸|か}してくれました。",
            "ro": "Demo, mise no hito ga kasa o kashite kuremashita.",
            "vi": "Nhưng nhân viên quán đã cho tôi mượn ô."
          },
          {
            "en": "いい{一日|いちにち}でした。",
            "ro": "Ii ichinichi deshita.",
            "vi": "Một ngày thật tuyệt."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-doc3-q",
        "title": "Đoạn 3 — câu hỏi (7 câu)",
        "items": [
          {
            "q": "Natapon biết quán cà phê từ đâu?",
            "options": [
              "Bạn bè",
              "Tạp chí",
              "Internet",
              "Ti vi"
            ],
            "correct": 1,
            "why": "雑誌で 見た カフェ."
          },
          {
            "q": "Đến ga thì có chuyện gì?",
            "options": [
              "Tàu đến muộn 5 phút",
              "Ga đóng cửa",
              "Tàu điện đang dừng",
              "Ga rất vắng"
            ],
            "correct": 2,
            "why": "駅に 着いたら、電車が 止まって いました."
          },
          {
            "q": "Vì sao tàu dừng?",
            "options": [
              "Vì tuyết",
              "Vì bão",
              "Vì tai nạn",
              "Vì động đất"
            ],
            "correct": 2,
            "why": "事故で 止まって いる そうでした."
          },
          {
            "q": "Natapon đến quán bằng cách nào? Vì sao?",
            "options": [
              "Đi xe buýt — vì vắng",
              "Đi taxi — vì nhanh",
              "Không đến",
              "Đi bộ 30 phút — xe buýt cũng đông"
            ],
            "correct": 3,
            "why": "バスも 混んで いましたから、三十分 歩いて 行きました."
          },
          {
            "q": "Ở quán phải chờ bao lâu?",
            "options": [
              "30 phút",
              "Một tiếng",
              "Hai tiếng",
              "Không phải chờ"
            ],
            "correct": 1,
            "why": "一時間 待たなければ なりませんでした."
          },
          {
            "q": "Natapon nghĩ gì khi phải chờ?",
            "options": [
              "Tức giận",
              "Muốn đi quán khác",
              "Muốn về ngay",
              "Dù chờ vẫn muốn vào"
            ],
            "correct": 3,
            "why": "待っても、入りたかったです."
          },
          {
            "q": "Khi về, Natapon gặp chuyện gì và ai giúp?",
            "options": [
              "Trời nắng — không cần giúp",
              "Trời mưa — nhân viên quán cho mượn ô",
              "Tàu dừng — bạn đón",
              "Mất ví — cảnh sát giúp"
            ],
            "correct": 1,
            "why": "雨が 降って いました。店の 人が 傘を 貸して くれました."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đoạn 4 dài + đoạn không furigana"
      },
      {
        "t": "passage",
        "title": "Đoạn 4 — Bài văn của Mary: \"私の思い出\"",
        "intro": "Đoạn dài, 3 khối: trước cuộc thi · lúc thi · kết quả và cảm nghĩ. Chú ý ～て いました, ～ても, なんと.",
        "paras": [
          {
            "label": "A",
            "text": "{去年|きょねん}の{十二月|じゅうにがつ}、{私|わたし}は{大学|だいがく}の{日本語|にほんご}スピーチコンテストに{出|で}ました。テーマは「{私|わたし}の{国|くに}の{昔|むかし}の{話|はなし}」でした。{一か月|いっかげつ}{毎日|まいにち}{練習|れんしゅう}しました。{先生|せんせい}は「{毎日|まいにち}{練習|れんしゅう}したら、きっと{上手|じょうず}になりますよ」と{言|い}いました。"
          },
          {
            "label": "B",
            "text": "コンテストの{日|ひ}、{会場|かいじょう}のホールには{人|ひと}がたくさん{集|あつ}まっていました。{私|わたし}はとても{緊張|きんちょう}して、{手|て}が{冷|つめ}たくなりました。でも、スピーチが{始|はじ}まったら、お{客|きゃく}さんはうなずいたり、{笑|わら}ったりしていました。{緊張|きんちょう}していても、{最後|さいご}まで{話|はな}すことができました。"
          },
          {
            "label": "C",
            "text": "{結果|けっか}は、なんと{二位|にい}でした。とてもうれしかったです。{勝|か}っても{負|ま}けても、いい{経験|けいけん}になると{思|おも}っていましたが、{本当|ほんとう}にいい{思|おも}い{出|で}になりました。みなさんもコンテストがあったら、ぜひ{出|で}てください。"
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
            "en": "{去年|きょねん}の{十二月|じゅうにがつ}、{私|わたし}は{大学|だいがく}の{日本語|にほんご}スピーチコンテストに{出|で}ました。",
            "ro": "Kyonen no juunigatsu, watashi wa daigaku no Nihongo supiichikontesuto ni demashita.",
            "vi": "Tháng 12 năm ngoái, tôi đã tham gia cuộc thi hùng biện tiếng Nhật của trường đại học."
          },
          {
            "en": "テーマは「{私|わたし}の{国|くに}の{昔|むかし}の{話|はなし}」でした。",
            "ro": "Teema wa \"watashi no kuni no mukashi no hanashi\" deshita.",
            "vi": "Chủ đề là \"Chuyện ngày xưa của đất nước tôi\"."
          },
          {
            "en": "{一か月|いっかげつ}{毎日|まいにち}{練習|れんしゅう}しました。",
            "ro": "Ikkagetsu mainichi renshuu shimashita.",
            "vi": "Tôi luyện tập mỗi ngày trong một tháng."
          },
          {
            "en": "{先生|せんせい}は「{毎日|まいにち}{練習|れんしゅう}したら、きっと{上手|じょうず}になりますよ」と{言|い}いました。",
            "ro": "Sensei wa \"mainichi renshuu shitara, kitto jouzu ni narimasu yo\" to iimashita.",
            "vi": "Cô giáo nói: \"Nếu luyện tập mỗi ngày thì chắc chắn sẽ giỏi lên.\""
          },
          {
            "en": "コンテストの{日|ひ}、{会場|かいじょう}のホールには{人|ひと}がたくさん{集|あつ}まっていました。",
            "ro": "Kontesuto no hi, kaijou no hooru ni wa hito ga takusan atsumatte imashita.",
            "vi": "Ngày thi, ở hội trường nơi tổ chức có rất nhiều người tụ tập."
          },
          {
            "en": "{私|わたし}はとても{緊張|きんちょう}して、{手|て}が{冷|つめ}たくなりました。",
            "ro": "Watashi wa totemo kinchou shite, te ga tsumetaku narimashita.",
            "vi": "Tôi rất hồi hộp, tay lạnh ngắt."
          },
          {
            "en": "でも、スピーチが{始|はじ}まったら、お{客|きゃく}さんはうなずいたり、{笑|わら}ったりしていました。",
            "ro": "Demo, supiichi ga hajimattara, okyakusan wa unazuitari, warattari shite imashita.",
            "vi": "Nhưng khi bài hùng biện bắt đầu, khán giả gật gù, cười."
          },
          {
            "en": "{緊張|きんちょう}していても、{最後|さいご}まで{話|はな}すことができました。",
            "ro": "Kinchou shite ite mo, saigo made hanasu koto ga dekimashita.",
            "vi": "Dù đang hồi hộp, tôi vẫn nói được đến cuối."
          },
          {
            "en": "{結果|けっか}は、なんと{二位|にい}でした。",
            "ro": "Kekka wa, nanto nii deshita.",
            "vi": "Kết quả, không ngờ là tôi được hạng hai."
          },
          {
            "en": "とてもうれしかったです。",
            "ro": "Totemo ureshikatta desu.",
            "vi": "Tôi rất vui."
          },
          {
            "en": "{勝|か}っても{負|ま}けても、いい{経験|けいけん}になると{思|おも}っていましたが、{本当|ほんとう}にいい{思|おも}い{出|で}になりました。",
            "ro": "Katte mo makete mo, ii keiken ni naru to omotte imashita ga, hontou ni ii omoide ni narimashita.",
            "vi": "Tôi đã nghĩ dù thắng hay thua cũng sẽ là trải nghiệm tốt, và nó thật sự đã thành kỷ niệm đẹp."
          },
          {
            "en": "みなさんもコンテストがあったら、ぜひ{出|で}てください。",
            "ro": "Minasan mo kontesuto ga attara, zehi dete kudasai.",
            "vi": "Mọi người nếu có cuộc thi thì nhất định hãy tham gia nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-doc4-q",
        "title": "Đoạn 4 — câu hỏi (8 câu)",
        "items": [
          {
            "q": "Mary thi hùng biện khi nào?",
            "options": [
              "Tháng 12 năm nay",
              "Tháng 1 năm ngoái",
              "Tuần trước",
              "Tháng 12 năm ngoái"
            ],
            "correct": 3,
            "why": "去年の 十二月."
          },
          {
            "q": "Chủ đề bài hùng biện là gì?",
            "options": [
              "Cuộc sống ở Nhật",
              "Chuyện ngày xưa của nước tôi",
              "Gia đình tôi",
              "Món ăn nước tôi"
            ],
            "correct": 1,
            "why": "「私の 国の 昔の 話」."
          },
          {
            "q": "Mary đã chuẩn bị thế nào?",
            "options": [
              "Luyện một tuần",
              "Luyện tập mỗi ngày trong một tháng",
              "Nhờ bạn viết hộ",
              "Không luyện"
            ],
            "correct": 1,
            "why": "一か月 毎日 練習しました."
          },
          {
            "q": "Cô giáo đã nói gì?",
            "options": [
              "Đừng hồi hộp",
              "Nếu luyện mỗi ngày thì chắc chắn sẽ giỏi",
              "Nghe nói cuộc thi rất khó",
              "Dù luyện cũng khó thắng"
            ],
            "correct": 1,
            "why": "毎日 練習したら、きっと 上手に なりますよ."
          },
          {
            "q": "Ở hội trường ngày thi thế nào?",
            "options": [
              "Bị mất điện",
              "Có rất nhiều người",
              "Rất vắng",
              "Đóng cửa"
            ],
            "correct": 1,
            "why": "ホールには 人が たくさん 集まって いました."
          },
          {
            "q": "Khi Mary bắt đầu nói, khán giả làm gì?",
            "options": [
              "Ra về",
              "Gật gù và cười",
              "Nói chuyện riêng",
              "Ngủ"
            ],
            "correct": 1,
            "why": "うなずいたり、笑ったり して いました."
          },
          {
            "q": "Kết quả của Mary?",
            "options": [
              "Hạng ba",
              "Hạng nhất",
              "Không được giải",
              "Hạng hai (bất ngờ)"
            ],
            "correct": 3,
            "why": "なんと 二位でした."
          },
          {
            "q": "Câu cuối có ý gì?",
            "options": [
              "Kể kết quả của bạn",
              "Mời đến xem năm sau",
              "Khuyên mọi người nếu có dịp hãy tham gia",
              "Xin lỗi người đọc"
            ],
            "correct": 2,
            "why": "コンテストが あったら、ぜひ 出て ください."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b15-doc-rk",
        "title": "Đọc to 4 đoạn KHÔNG furigana, rồi bấm xem (4 đoạn)",
        "note": "Đọc cả câu to, kể cả hiragana. Sau đó làm 8 câu hỏi bên dưới.",
        "items": [
          {
            "text": "{日曜日|にちようび}にこうえんでフリーマーケットがあります。{雨|あめ}が{降|ふ}ったら、ちゅうしです。{千円|せんえん}いじょう{買|か}ったら、プレゼントがあるそうです。",
            "ro": "Nichiyoubi ni kouen de furiimaaketto ga arimasu. Ame ga futtara, chuushi desu. Sen'en ijou kattara, purezento ga aru sou desu.",
            "vi": "Chủ nhật ở công viên có chợ đồ cũ. Nếu mưa thì huỷ. Nghe nói mua từ 1.000 yên trở lên thì có quà."
          },
          {
            "text": "きのうのよる、{大|おお}きい{台|たい}ふうがきました。{台|たい}ふうで{木|き}がたおれたそうです。{事故|じこ}もあって、でんしゃがとまっています。ともだちが{心|しん}ぱいです。",
            "ro": "Kinou no yoru, ookii taifuu ga kimashita. Taifuu de ki ga taoreta sou desu. Jiko mo atte, densha ga tomatte imasu. Tomodachi ga shinpai desu.",
            "vi": "Tối qua có bão lớn. Nghe nói vì bão mà cây bị đổ. Còn có tai nạn nên tàu điện đang dừng. Tôi lo cho bạn."
          },
          {
            "text": "えきについたら、{人|ひと}がたくさんならんでいました。{急|いそ}いでも、{間|ま}にあわないと{思|おも}いましたから、タクシーで{行|い}きました。",
            "ro": "Eki ni tsuitara, hito ga takusan narande imashita. Isoide mo, mani awanai to omoimashita kara, takushii de ikimashita.",
            "vi": "Đến ga thì có rất nhiều người đang xếp hàng. Tôi nghĩ dù vội cũng không kịp nên đã đi taxi."
          },
          {
            "text": "あしたは{雨|あめ}が{降|ふ}るそうですが、{雨|あめ}が{降|ふ}っても、{大会|たいかい}はあります。{会場|かいじょう}にはきっと{人|ひと}がたくさん{集|あつ}まると{思|おも}います。",
            "ro": "Ashita wa ame ga furu sou desu ga, ame ga futte mo, taikai wa arimasu. Kaijou ni wa kitto hito ga takusan atsumaru to omoimasu.",
            "vi": "Nghe nói mai trời mưa, nhưng dù mưa đại hội vẫn diễn ra. Tôi nghĩ chắc chắn sẽ có nhiều người tụ tập ở hội trường."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-doc-rk-q",
        "title": "Câu hỏi về 4 đoạn không furigana (8 câu)",
        "items": [
          {
            "q": "(Đoạn 1) Nếu mưa thì chợ đồ cũ thế nào?",
            "options": [
              "Vẫn có",
              "Bị huỷ",
              "Không nói",
              "Dời sang thứ Bảy"
            ],
            "correct": 1,
            "why": "雨が 降ったら、ちゅうしです."
          },
          {
            "q": "(Đoạn 1) Khi nào có quà?",
            "options": [
              "Mua từ 1.000 yên trở lên",
              "Luôn có quà",
              "Mua dưới 1.000 yên",
              "Đến sớm"
            ],
            "correct": 0,
            "why": "千円 いじょう 買ったら."
          },
          {
            "q": "(Đoạn 2) Vì bão chuyện gì xảy ra?",
            "options": [
              "Cây bị đổ",
              "Nhà sập",
              "Không có gì",
              "Mất điện"
            ],
            "correct": 0,
            "why": "台ふうで 木が たおれた そうです."
          },
          {
            "q": "(Đoạn 2) Vì sao tàu đang dừng?",
            "options": [
              "Hết điện",
              "Tuyết rơi",
              "Không nói",
              "Có tai nạn"
            ],
            "correct": 3,
            "why": "事故も あって、でんしゃが とまって います."
          },
          {
            "q": "(Đoạn 3) Ở ga thế nào?",
            "options": [
              "Có tai nạn",
              "Vắng",
              "Nhiều người đang xếp hàng",
              "Đóng cửa"
            ],
            "correct": 2,
            "why": "人が たくさん ならんで いました."
          },
          {
            "q": "(Đoạn 3) Người viết đã đi bằng gì? Vì sao?",
            "options": [
              "Tàu — vì nhanh",
              "Xe buýt — vì rẻ",
              "Đi bộ — vì gần",
              "Taxi — vì nghĩ dù vội cũng không kịp"
            ],
            "correct": 3,
            "why": "急いでも、間に あわないと 思いましたから、タクシーで."
          },
          {
            "q": "(Đoạn 4) Nếu mai mưa thì đại hội thế nào?",
            "options": [
              "Không nói",
              "Bị huỷ",
              "Hoãn",
              "Vẫn diễn ra"
            ],
            "correct": 3,
            "why": "雨が 降っても、大会は あります."
          },
          {
            "q": "(Đoạn 4) Người viết đoán gì?",
            "options": [
              "Chắc chắn sẽ nhiều người",
              "Không đoán",
              "Nghe nói sẽ huỷ",
              "Có lẽ vắng"
            ],
            "correct": 0,
            "why": "きっと 人が たくさん 集まると 思います."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b15-nghe",
    "kind": "listening",
    "title": "Luyện thêm Bài 15 · Nghe — nghe nói, nếu / dù, đang thấy gì → tin động đất, cửa hàng mới, kế hoạch, đoán, ngoài phố → bẫy たら／ても, sửa tin, bản tin thời tiết, tả cảnh dài (19 đoạn, ~35 câu)",
    "goal": "Nghe ra tin người khác kể (～そうです) và nguyên nhân (N で), điều kiện và \"dù\" (～たら · ～ても), điều người nói đoán (きっと／たぶん ～と思います), cảnh trước mắt (～て います) — không bị lừa khi người nói sửa tin, khi たら và ても đứng gần nhau, hoặc khi bản tin thời tiết đổi theo giờ.",
    "minutes": 65,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Nghe **2 lần**: lần 1 bắt ý chính (kể tin · bàn kế hoạch · tả cảnh); lần 2 ghi **chi tiết**: chuyện gì xảy ra, vì sao (N で), nếu … thì …, dù … vẫn …, ai đoán thế nào.",
          "Bẫy quen thuộc: **～たら** (nếu) nghe gần **～ても** (dù) — bắt đuôi **ら** hay **も** · **きっと** (chắc chắn) ≠ **たぶん** (có lẽ) · người nói **sửa tin** (でも、～そうです) · **止まって います** (đang dừng) ≠ **止まります** (sẽ dừng).",
          "Luyện shadowing: bật lại từng đoạn và nói đuổi theo — rất tốt cho câu thi nói 「何か ニュースを 知っていますか」「～たら、どう しますか」「～が ～て います。どう しますか」."
        ]
      },
      {
        "t": "recap",
        "title": "Từ khoá cần bắt tai",
        "items": [
          "**Tin**: ～そうです · ニュース／天気予報で · 本当ですか · 怖い · 心配 · よかった · 台風で／地震で／事故で.",
          "**Kế hoạch**: ～たら · ～だったら · よかったら · もし · ～ても · ～でも · きっと · たぶん · ～と 思います.",
          "**Ngoài phố**: 止まって · 閉まって · 並んで · 混んで · すいて · 汚れて · 壊れて · 落ちて います · 本当だ."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · chậm, ngắn — nghe nói, nếu / dù, đang thấy gì"
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-1a",
        "title": "① (chậm)",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{明日|あした}の{天気|てんき}はどうですか。",
            "ro": "Ashita no tenki wa dou desu ka.",
            "vi": "Thời tiết mai thế nào?"
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{天気予報|てんきよほう}で{聞|き}きましたが、{雨|あめ}だそうです。",
            "ro": "Tenkiyohou de kikimashita ga, ame da sou desu.",
            "vi": "Tôi nghe dự báo, nghe nói trời mưa."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-1b",
        "title": "② (chậm)",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。",
            "ro": "Jikan ga attara, issho ni ikimasen ka.",
            "vi": "Nếu có thời gian thì đi cùng không?"
          },
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "すみません。{今日|きょう}は{時間|じかん}がありません。",
            "ro": "Sumimasen. Kyou wa jikan ga arimasen.",
            "vi": "Xin lỗi. Hôm nay tôi không có thời gian."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-1c",
        "title": "③",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "{雨|あめ}が{降|ふ}っても、{行|い}きますか。",
            "ro": "Ame ga futte mo, ikimasu ka.",
            "vi": "Dù mưa bạn vẫn đi à?"
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "ええ、{降|ふ}っても{行|い}きます。",
            "ro": "Ee, futte mo ikimasu.",
            "vi": "Ừ, dù mưa tôi vẫn đi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-1d",
        "title": "④",
        "lines": [
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "あっ、{電車|でんしゃ}が{止|と}まっています。",
            "ro": "A, densha ga tomatte imasu.",
            "vi": "Ơ, tàu đang dừng."
          },
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "{事故|じこ}で{止|と}まっているそうですよ。",
            "ro": "Jiko de tomatte iru sou desu yo.",
            "vi": "Nghe nói dừng vì tai nạn đấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-1e",
        "title": "⑤",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "あの{店|みせ}、{混|こ}んでいると{思|おも}う？",
            "ro": "Ano mise, konde iru to omou?",
            "vi": "Cậu nghĩ quán kia có đông không?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "うん、きっと{混|こ}んでいると{思|おも}う。",
            "ro": "Un, kitto konde iru to omou.",
            "vi": "Ừ, tớ nghĩ chắc chắn đông."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ng-1-q",
        "title": "Câu hỏi ①–⑤ (7 câu)",
        "items": [
          {
            "q": "① Thời tiết mai thế nào?",
            "options": [
              "Có bão",
              "Nhiều mây",
              "Nắng",
              "Mưa"
            ],
            "correct": 3,
            "why": "雨だ そうです."
          },
          {
            "q": "① Daniel biết tin từ đâu?",
            "options": [
              "Tự đoán",
              "Tạp chí",
              "Bạn bè",
              "Dự báo thời tiết"
            ],
            "correct": 3,
            "why": "天気予報で 聞きました."
          },
          {
            "q": "② Wang có đi không?",
            "options": [
              "Có",
              "Không — không có thời gian",
              "Có, nếu rảnh",
              "Chưa quyết định"
            ],
            "correct": 1,
            "why": "今日は 時間が ありません."
          },
          {
            "q": "③ Nếu mưa Carlos có đi không?",
            "options": [
              "Không nói",
              "Không đi",
              "Vẫn đi",
              "Đi nếu tạnh"
            ],
            "correct": 2,
            "why": "降って も 行きます."
          },
          {
            "q": "④ Vì sao tàu dừng?",
            "options": [
              "Không biết",
              "Vì tai nạn",
              "Vì bão",
              "Vì tuyết"
            ],
            "correct": 1,
            "why": "事故で 止まって いる そうです."
          },
          {
            "q": "⑤ Marco đoán quán thế nào?",
            "options": [
              "Có lẽ vắng",
              "Chắc chắn đông",
              "Không biết",
              "Đóng cửa"
            ],
            "correct": 1,
            "why": "きっと 混んで いると 思う."
          },
          {
            "q": "Trong ①–⑤, đoạn nào có \"dù … vẫn …\"?",
            "options": [
              "④",
              "①",
              "②",
              "③"
            ],
            "correct": 3,
            "why": "③ 雨が 降っても、行きます."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · kể tin dài hơn, bàn kế hoạch, tả cảnh"
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-2a",
        "title": "⑥ Tin trên ti vi",
        "lines": [
          {
            "who": "木村",
            "voice": "ja-nu",
            "text": "ニュースを{見|み}ましたか。{昨日|きのう}、{北海道|ほっかいどう}で{大|おお}きい{地震|じしん}があったそうです。",
            "ro": "Nyuusu o mimashita ka. Kinou, Hokkaidou de ookii jishin ga atta sou desu.",
            "vi": "Bạn xem thời sự chưa? Nghe nói hôm qua ở Hokkaido có động đất lớn."
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{本当|ほんとう}ですか。{怖|こわ}いですね。けがをした{人|ひと}はいますか。",
            "ro": "Hontou desu ka. Kowai desu ne. Kega o shita hito wa imasu ka.",
            "vi": "Thật à? Đáng sợ nhỉ. Có ai bị thương không?"
          },
          {
            "who": "木村",
            "voice": "ja-nu",
            "text": "{少|すこ}しいるそうですが、{亡|な}くなった{人|ひと}はいないそうです。",
            "ro": "Sukoshi iru sou desu ga, nakunatta hito wa inai sou desu.",
            "vi": "Nghe nói có vài người, nhưng không ai thiệt mạng."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-2b",
        "title": "⑦ Cửa hàng mới",
        "lines": [
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "{駅|えき}の{近|ちか}くに{大|おお}きいデパートができたそうですよ。",
            "ro": "Eki no chikaku ni ookii depaato ga dekita sou desu yo.",
            "vi": "Nghe nói gần ga mới mở một cửa hàng bách hoá lớn đấy."
          },
          {
            "who": "山口",
            "voice": "ja-nu",
            "text": "{知|し}っています。{今週|こんしゅう}は{全部|ぜんぶ}{三十|さんじゅっ}パーセント{引|び}きだそうです。",
            "ro": "Shitte imasu. Konshuu wa zenbu sanju paasento biki da sou desu.",
            "vi": "Tôi biết. Nghe nói tuần này tất cả giảm 30%."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-2c",
        "title": "⑧ Kế hoạch",
        "lines": [
          {
            "who": "マリヤム",
            "voice": "ja-nu",
            "text": "{明日|あした}、{晴|は}れたら、{海|うみ}へ{行|い}きませんか。",
            "ro": "Ashita, haretara, umi e ikimasen ka.",
            "vi": "Mai nếu nắng thì đi biển không?"
          },
          {
            "who": "西川",
            "voice": "ja-nam",
            "text": "いいですね。でも、{雨|あめ}だったら、どうしますか。",
            "ro": "Ii desu ne. Demo, ame dattara, dou shimasu ka.",
            "vi": "Hay đấy. Nhưng nếu mưa thì sao?"
          },
          {
            "who": "マリヤム",
            "voice": "ja-nu",
            "text": "{雨|あめ}だったら、{映画|えいが}を{見|み}ましょう。",
            "ro": "Ame dattara, eiga o mimashou.",
            "vi": "Nếu mưa thì xem phim nhé."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-2d",
        "title": "⑨ Đoán",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "ナタポンさんはパーティーに{来|き}ますか。",
            "ro": "Natapon-san wa paatii ni kimasu ka.",
            "vi": "Natapon có đến tiệc không?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "たぶん{来|こ}ないと{思|おも}います。{風邪|かぜ}をひいたそうですから。",
            "ro": "Tabun konai to omoimasu. Kaze o hiita sou desu kara.",
            "vi": "Tôi nghĩ có lẽ không đến. Nghe nói cậu ấy bị cảm."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-2e",
        "title": "⑩ Ở nhà hàng",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "あのう、すみません。このお{皿|さら}、{汚|よご}れています。",
            "ro": "Anou, sumimasen. Kono osara, yogorete imasu.",
            "vi": "Dạ, xin lỗi. Cái đĩa này bị bẩn ạ."
          },
          {
            "who": "店員",
            "voice": "ja-nu",
            "text": "あっ、すみません。すぐ{新|あたら}しいのを{持|も}って{来|き}ます。",
            "ro": "A, sumimasen. Sugu atarashii no o motte kimasu.",
            "vi": "Ôi, xin lỗi. Tôi mang cái mới ngay."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-2f",
        "title": "⑪ Ngoài phố",
        "lines": [
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "あれ？パン{屋|や}が{閉|し}まっていますね。",
            "ro": "Are? Pan'ya ga shimatte imasu ne.",
            "vi": "Ơ? Tiệm bánh mì đóng cửa rồi nhỉ."
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "{本当|ほんとう}だ。じゃ、コンビニで{買|か}いましょう。コンビニはいつでも{開|あ}いていますから。",
            "ro": "Hontou da. Ja, konbini de kaimashou. Konbini wa itsudemo aite imasu kara.",
            "vi": "Thật này. Vậy mua ở cửa hàng tiện lợi nhé. Cửa hàng tiện lợi lúc nào cũng mở."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-2g",
        "title": "⑫ Thể thao",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "{昨日|きのう}の{試合|しあい}、どうでしたか。",
            "ro": "Kinou no shiai, dou deshita ka.",
            "vi": "Trận hôm qua thế nào?"
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{日本|にほん}のチームが{三対一|さんたいいち}で{勝|か}ったそうです。{僕|ぼく}は{見|み}ませんでしたけど。",
            "ro": "Nihon no chiimu ga santaiichi de katta sou desu. Boku wa mimasen deshita kedo.",
            "vi": "Nghe nói đội Nhật thắng 3–1. Tôi thì không xem."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ng-2-q",
        "title": "Câu hỏi ⑥–⑫ (10 câu)",
        "items": [
          {
            "q": "⑥ Ở đâu có động đất?",
            "options": [
              "Hokkaido",
              "Tokyo",
              "Osaka",
              "Kyushu"
            ],
            "correct": 0,
            "why": "北海道で 大きい 地震が あった そうです."
          },
          {
            "q": "⑥ Có người thiệt mạng không?",
            "options": [
              "Có vài người",
              "Chưa biết",
              "Có nhiều người",
              "Không"
            ],
            "correct": 3,
            "why": "亡くなった 人は いない そうです."
          },
          {
            "q": "⑦ Cái gì mới mở gần ga?",
            "options": [
              "Quán ramen",
              "Cửa hàng bách hoá lớn",
              "Thư viện",
              "Công viên"
            ],
            "correct": 1,
            "why": "大きい デパートが できた そうです."
          },
          {
            "q": "⑦ Tuần này giảm bao nhiêu?",
            "options": [
              "Miễn phí",
              "20%",
              "10%",
              "30%"
            ],
            "correct": 3,
            "why": "全部 三十パーセント引きだ そうです."
          },
          {
            "q": "⑧ Nếu mưa thì hai người làm gì?",
            "options": [
              "Vẫn đi biển",
              "Xem phim",
              "Đi mua sắm",
              "Ở nhà ngủ"
            ],
            "correct": 1,
            "why": "雨だったら、映画を 見ましょう."
          },
          {
            "q": "⑨ Marco đoán Natapon thế nào?",
            "options": [
              "Đến muộn",
              "Không biết",
              "Chắc chắn đến",
              "Có lẽ không đến"
            ],
            "correct": 3,
            "why": "たぶん 来ないと 思います."
          },
          {
            "q": "⑨ Vì sao?",
            "options": [
              "Natapon không thích tiệc",
              "Nghe nói Natapon bị cảm",
              "Natapon bận",
              "Natapon về nước"
            ],
            "correct": 1,
            "why": "風邪を ひいた そうです から."
          },
          {
            "q": "⑩ Có vấn đề gì?",
            "options": [
              "Cái đĩa bị bẩn",
              "Không có chỗ ngồi",
              "Cái đĩa bị vỡ",
              "Món ăn nguội"
            ],
            "correct": 0,
            "why": "この お皿、汚れて います."
          },
          {
            "q": "⑪ Vì sao mua ở cửa hàng tiện lợi?",
            "options": [
              "Tiệm bánh đông",
              "Cửa hàng tiện lợi rẻ hơn",
              "Tiệm bánh hết bánh",
              "Tiệm bánh đóng cửa, cửa hàng tiện lợi luôn mở"
            ],
            "correct": 3,
            "why": "パン屋が 閉まって います … コンビニは いつでも 開いて います."
          },
          {
            "q": "⑫ Daniel có xem trận đấu không?",
            "options": [
              "Không nói",
              "Có xem trên ti vi",
              "Có xem ở sân",
              "Không — anh chỉ nghe nói"
            ],
            "correct": 3,
            "why": "勝った そうです。僕は 見ませんでした けど."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bẫy: たら ↔ ても, sửa tin, bản tin dài, tả cảnh nhiều chi tiết"
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-3a",
        "title": "⑬ Bẫy たら／ても",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{明日|あした}の{大会|たいかい}、{雨|あめ}だったら{中止|ちゅうし}ですか。",
            "ro": "Ashita no taikai, ame dattara chuushi desu ka.",
            "vi": "Đại hội mai nếu mưa thì huỷ à?"
          },
          {
            "who": "本田先生",
            "voice": "ja-nam",
            "text": "いいえ、{雨|あめ}でも、あります。でも、{台風|たいふう}が{来|き}たら、{中止|ちゅうし}です。",
            "ro": "Iie, ame demo, arimasu. Demo, taifuu ga kitara, chuushi desu.",
            "vi": "Không, dù mưa vẫn có. Nhưng nếu bão đến thì huỷ."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-3b",
        "title": "⑭ Sửa tin",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "{来月|らいげつ}から、{美術館|びじゅつかん}は{無料|むりょう}だそうですよ。",
            "ro": "Raigetsu kara, bijutsukan wa muryou da sou desu yo.",
            "vi": "Nghe nói từ tháng sau bảo tàng miễn phí đấy."
          },
          {
            "who": "西川",
            "voice": "ja-nam",
            "text": "えっ、{全部|ぜんぶ}{無料|むりょう}ですか。",
            "ro": "E, zenbu muryou desu ka.",
            "vi": "Hả, miễn phí hết à?"
          },
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "あ、すみません。{学生|がくせい}だけ{無料|むりょう}だそうです。{大人|おとな}は{五百円|ごひゃくえん}です。",
            "ro": "A, sumimasen. Gakusei dake muryou da sou desu. Otona wa gohyakuen desu.",
            "vi": "À, xin lỗi. Nghe nói chỉ sinh viên miễn phí. Người lớn 500 yên."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-3c",
        "title": "⑮ Bản tin thời tiết",
        "lines": [
          {
            "who": "山口",
            "voice": "ja-nu",
            "text": "{明日|あした}の{天気|てんき}です。{午前|ごぜん}は{晴|は}れますが、{午後|ごご}から{曇|くも}って、{夕方|ゆうがた}には{雨|あめ}が{降|ふ}るそうです。{風|かぜ}も{強|つよ}くなるそうですから、{傘|かさ}を{持|も}って{出|で}かけてください。",
            "ro": "Ashita no tenki desu. Gozen wa haremasu ga, gogo kara kumotte, yuugata ni wa ame ga furu sou desu. Kaze mo tsuyoku naru sou desu kara, kasa o motte dekakete kudasai.",
            "vi": "Thời tiết ngày mai. Buổi sáng nắng nhưng từ chiều kéo mây, chiều tối có mưa. Nghe nói gió cũng mạnh lên, nên hãy mang ô khi ra ngoài."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-3d",
        "title": "⑯ Tả cảnh nhiều chi tiết",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{駅|えき}の{前|まえ}は{大変|たいへん}でした。{事故|じこ}でバスが{止|と}まっていて、{人|ひと}がたくさん{並|なら}んでいました。タクシーも{全部|ぜんぶ}{混|こ}んでいましたから、{歩|ある}いて{来|き}ました。",
            "ro": "Eki no mae wa taihen deshita. Jiko de basu ga tomatte ite, hito ga takusan narande imashita. Takushii mo zenbu konde imashita kara, aruite kimashita.",
            "vi": "Trước ga vất vả lắm. Vì tai nạn mà xe buýt dừng, nhiều người xếp hàng. Taxi cũng kín hết nên tôi đi bộ đến."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-3e",
        "title": "⑰ Đoán + lý do",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "カルロスさん、{間|ま}に{合|あ}うと{思|おも}いますか。",
            "ro": "Karurosu-san, maniau to omoimasu ka.",
            "vi": "Carlos, anh nghĩ có kịp không?"
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "うーん、{急|いそ}いでも、たぶん{間|ま}に{合|あ}わないと{思|おも}います。でも、タクシーで{行|い}ったら、きっと{間|ま}に{合|あ}いますよ。",
            "ro": "Uun, isoide mo, tabun maniawanai to omoimasu. Demo, takushii de ittara, kitto maniaimasu yo.",
            "vi": "Ừm, tôi nghĩ dù vội cũng có lẽ không kịp. Nhưng nếu đi taxi thì chắc chắn kịp."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-3f",
        "title": "⑱ Bạn bè — tin bất ngờ",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "ねえ、{知|し}ってる？{西川|にしかわ}さん、{結婚|けっこん}するそうだよ。",
            "ro": "Nee, shitteru? Nishikawa-san, kekkon suru sou da yo.",
            "vi": "Này, biết chưa? Nghe nói anh Nishikawa sắp kết hôn đấy."
          },
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "えっ、{本当|ほんとう}？だれと？",
            "ro": "E, hontou? Dare to?",
            "vi": "Hả, thật á? Với ai?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "なんと、{木村|きむら}さんと{結婚|けっこん}するそうだよ。",
            "ro": "Nanto, Kimura-san to kekkon suru sou da yo.",
            "vi": "Không ngờ là nghe nói cưới chị Kimura đấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b15-ng-3g",
        "title": "⑲ Kể kỷ niệm",
        "lines": [
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "{初|はじ}めて{日本|にほん}に{来|き}たとき、{空港|くうこう}で{財布|さいふ}をなくしました。とても{心配|しんぱい}でしたが、{空港|くうこう}の{人|ひと}が{持|も}って{来|き}てくれました。{財布|さいふ}はトイレに{落|お}ちていたそうです。{日本|にほん}は{親切|しんせつ}な{人|ひと}が{多|おお}い{国|くに}だと{思|おも}います。",
            "ro": "Hajimete Nihon ni kita toki, kuukou de saifu o nakushimashita. Totemo shinpai deshita ga, kuukou no hito ga motte kite kuremashita. Saifu wa toire ni ochite ita sou desu. Nihon wa shinsetsu na hito ga ooi kuni da to omoimasu.",
            "vi": "Lần đầu sang Nhật, tôi làm mất ví ở sân bay. Tôi rất lo, nhưng nhân viên sân bay đã mang đến cho tôi. Nghe nói ví rơi trong nhà vệ sinh. Tôi nghĩ Nhật là nước có nhiều người tốt bụng."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ng-3-q",
        "title": "Câu hỏi ⑬–⑲ (12 câu)",
        "items": [
          {
            "q": "⑬ Nếu mưa thì đại hội thế nào?",
            "options": [
              "Vẫn có",
              "Không nói",
              "Hoãn",
              "Bị huỷ"
            ],
            "correct": 0,
            "why": "雨でも、あります."
          },
          {
            "q": "⑬ Khi nào thì huỷ?",
            "options": [
              "Khi bão đến",
              "Khi mưa",
              "Khi trời nhiều mây",
              "Không bao giờ"
            ],
            "correct": 0,
            "why": "台風が 来たら、中止です."
          },
          {
            "q": "⑭ Cuối cùng, ai được miễn phí?",
            "options": [
              "Chỉ sinh viên",
              "Trẻ em",
              "Chỉ người lớn",
              "Tất cả mọi người"
            ],
            "correct": 0,
            "why": "学生だけ 無料だ そうです — Wang sửa lại tin."
          },
          {
            "q": "⑭ Người lớn trả bao nhiêu?",
            "options": [
              "300 yên",
              "1.000 yên",
              "500 yên",
              "Miễn phí"
            ],
            "correct": 2,
            "why": "大人は 五百円です."
          },
          {
            "q": "⑮ Thời tiết chiều tối mai?",
            "options": [
              "Nhiều mây",
              "Tuyết",
              "Mưa",
              "Nắng"
            ],
            "correct": 2,
            "why": "夕方には 雨が 降る そうです."
          },
          {
            "q": "⑮ Lời khuyên là gì?",
            "options": [
              "Đóng cửa sổ",
              "Ở nhà",
              "Đi sớm",
              "Mang ô khi ra ngoài"
            ],
            "correct": 3,
            "why": "傘を 持って 出かけて ください."
          },
          {
            "q": "⑯ Vì sao xe buýt dừng?",
            "options": [
              "Vì bão",
              "Vì đông người",
              "Không nói",
              "Vì tai nạn"
            ],
            "correct": 3,
            "why": "事故で バスが 止まって いて."
          },
          {
            "q": "⑯ Marco đến bằng gì?",
            "options": [
              "Taxi",
              "Tàu điện",
              "Đi bộ",
              "Xe buýt"
            ],
            "correct": 2,
            "why": "タクシーも 混んで いましたから、歩いて 来ました."
          },
          {
            "q": "⑰ Theo Carlos, đi taxi thì sao?",
            "options": [
              "Chắc chắn kịp",
              "Có lẽ không kịp",
              "Dù vội cũng không kịp",
              "Không biết"
            ],
            "correct": 0,
            "why": "タクシーで 行ったら、きっと 間に合いますよ."
          },
          {
            "q": "⑱ Tin bất ngờ là gì?",
            "options": [
              "Nishikawa sắp cưới Kimura",
              "Kimura được hạng nhất",
              "Nishikawa về nước",
              "Kimura nhập viện"
            ],
            "correct": 0,
            "why": "西川さん、結婚する … なんと、木村さんと."
          },
          {
            "q": "⑲ Mary gặp chuyện gì ở sân bay?",
            "options": [
              "Làm mất ví (ví rơi trong nhà vệ sinh)",
              "Lỡ máy bay",
              "Bị ốm",
              "Mất hộ chiếu"
            ],
            "correct": 0,
            "why": "空港で 財布を なくしました … トイレに 落ちて いた そうです."
          },
          {
            "q": "⑲ Mary nghĩ gì về Nhật?",
            "options": [
              "Là nước đắt đỏ",
              "Là nước đáng sợ",
              "Là nước ồn ào",
              "Là nước có nhiều người tốt bụng"
            ],
            "correct": 3,
            "why": "親切な 人が 多い 国だと 思います."
          }
        ]
      },
      {
        "t": "h",
        "text": "Nghe điền chỗ trống — nghe lại các đoạn trên rồi gõ"
      },
      {
        "t": "quiz",
        "id": "lt-b15-ng-dien",
        "title": "Nghe điền chỗ trống (6 câu)",
        "kind": "fill",
        "grammar": "Nghe lại đoạn được ghi trong gợi ý",
        "items": [
          {
            "q": "ダニエル：{天気予報|てんきよほう}で{聞|き}きましたが、{雨|あめ}＿＿そうです。　〔Danieru: tenkiyohou de kikimashita ga, ame __ sou desu.〕",
            "answers": [
              "だ"
            ],
            "hint": "nghe ①"
          },
          {
            "q": "カルロス：ええ、{降|ふ}って＿＿{行|い}きます。　〔Karurosu: ee, futte __ ikimasu.〕",
            "answers": [
              "も"
            ],
            "hint": "nghe ③"
          },
          {
            "q": "メアリー：{事故|じこ}＿＿{止|と}まっているそうですよ。　〔Mearii: jiko __ tomatte iru sou desu yo.〕",
            "answers": [
              "で"
            ],
            "hint": "nghe ④"
          },
          {
            "q": "マリヤム：{雨|あめ}＿＿、{映画|えいが}を{見|み}ましょう。　〔Mariyamu: ame __, eiga o mimashou.〕",
            "answers": [
              "だったら"
            ],
            "hint": "nghe ⑧"
          },
          {
            "q": "マルコ：＿＿{来|こ}ないと{思|おも}います。　〔Maruko: __ konai to omoimasu.〕",
            "answers": [
              "たぶん"
            ],
            "hint": "nghe ⑨"
          },
          {
            "q": "メアリー：あれ？パン{屋|や}が＿＿いますね。　〔Mearii: are? Pan'ya ga __ imasu ne.〕",
            "answers": [
              "閉まって",
              "しまって"
            ],
            "hint": "nghe ⑪"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b15-noi-viet",
    "kind": "speaking",
    "title": "Luyện thêm Bài 15 · Nói & viết — 5 bộ tranh kiểu thi nói (3 câu tranh + 1 cá nhân) · đọc to · viết 3–5 câu",
    "goal": "Trả lời trọn câu các câu hỏi thi nói Bài 15 (tin trên ti vi, thời tiết, trang tạp chí, đoán, tả cảnh ngoài phố), đọc to trôi chảy, viết bản tin ngắn / tin nhắn rủ đi / tả phố hôm nay / kỷ niệm đáng nhớ 3–5 câu.",
    "minutes": 90,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thi nói: **nghe → nghĩ không quá 10 giây → trả lời TRỌN CÂU → thêm 1 câu phụ**. Mỗi bộ có 3 câu nhìn \"tranh\" (mô tả trong khung) + 1 câu cá nhân: che lời \"Bạn\", tự nói, rồi nghe mẫu.",
          "Năm khung \"ăn điểm\" của Bài 15: **kể tin** (～そうです · ニュースで 見ましたが) · **nguyên nhân** (台風で／事故で ～ました) · **nếu / dù** (～たら · ～ても · よかったら) · **đoán** (きっと／たぶん ～と思います) · **tả cảnh** (～が ～て います).",
          "Viết ngắn: 3–5 câu; soát **thể thường trước そうです** (ナA／N + だ), **thể た + ら**, **thể て + も** (イA くて も · ナA／N でも), **tự động từ + が + ています**."
        ]
      },
      {
        "t": "recap",
        "title": "Cách tự chấm",
        "items": [
          "✅ Trả lời TRỌN CÂU · ✅ đúng thông tin theo tranh · ✅ thêm 1 câu phụ (cảm tưởng 怖いですね／よかったですね, đề nghị ～ませんか, lý do ～から) · ✅ không im lặng quá 10 giây · ✅ nói **lịch sự** với giám khảo.",
          "Giám khảo hỏi bằng thể thường (vai bạn bè) thì trả lời bằng thể thường: 「これ、知ってる？」 → 「うん、知ってる。～そうだね。」／「ううん、知らない。」"
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
            "何か ニュースを 知って いますか",
            "ええ。～で ～が あった そうです。",
            "怖いですね／心配です。"
          ],
          [
            "どうして 電車が 止まって いますか",
            "事故で 止まって いる そうです。",
            "バスで 行きませんか。"
          ],
          [
            "～たら、どう しますか",
            "～たら、～ます。",
            "でも、～ても、～ます。"
          ],
          [
            "雨が 降って も 行きますか",
            "はい、降って も 行きます。／いいえ、雨だったら 行きません。",
            "～から です。"
          ],
          [
            "明日は 晴れると 思いますか",
            "きっと／たぶん ～と 思います。",
            "天気予報で ～と 聞きました。"
          ],
          [
            "(tranh phố) 何が 見えますか",
            "～が ～て います。",
            "じゃ、～ませんか。"
          ],
          [
            "(bạn bè) これ、知ってる？",
            "うん、～そうだね。／ううん、知らない。",
            "一緒に 行かない？"
          ]
        ],
        "caption": "Khung trả lời Bài 15 — luôn trả lời TRỌN CÂU rồi thêm 1 câu phụ"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · bộ tranh 1–2: tin trên ti vi · thời tiết"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Ba ô: ① màn hình thời sự — toà nhà đổ, chữ \"地震\"; ② ga tàu, đoàn tàu đứng im, biển \"事故\"; ③ sân bóng ngập nước, chữ \"中止\"."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Tin trên ti vi",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{何|なに}かニュースを{知|し}っていますか。",
            "ro": "Nani ka nyuusu o shitte imasu ka.",
            "vi": "(Tranh ①) Bạn có biết tin gì không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ええ。{地震|じしん}でビルが{倒|たお}れたそうです。",
            "ro": "Ee. Jishin de biru ga taoreta sou desu.",
            "vi": "Có. Nghe nói vì động đất mà toà nhà bị đổ."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{電車|でんしゃ}はどうですか。",
            "ro": "Densha wa dou desu ka.",
            "vi": "(Tranh ②) Tàu điện thì sao?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{事故|じこ}で{止|と}まっているそうです。",
            "ro": "Jiko de tomatte iru sou desu.",
            "vi": "Nghe nói đang dừng vì tai nạn."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{明日|あした}の{試合|しあい}は？",
            "ro": "Ashita no shiai wa?",
            "vi": "(Tranh ③) Trận đấu ngày mai thì sao?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{雨|あめ}で{中止|ちゅうし}だそうです。{残念|ざんねん}です。",
            "ro": "Ame de chuushi da sou desu. Zannen desu.",
            "vi": "Nghe nói bị huỷ vì mưa. Tiếc quá."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{最近|さいきん}、どんなニュースを{見|み}ましたか。",
            "ro": "Saikin, donna nyuusu o mimashita ka.",
            "vi": "(Cá nhân) Gần đây bạn xem tin gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ベトナムに{大|おお}きい{台風|たいふう}が{来|き}たそうです。{家族|かぞく}が{心配|しんぱい}です。",
            "ro": "Betonamu ni ookii taifuu ga kita sou desu. Kazoku ga shinpai desu.",
            "vi": "Nghe nói có bão lớn vào Việt Nam. Tôi lo cho gia đình."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Ba ô: ① bảng thời tiết: sáng ☀, chiều ☁, tối ☂; ② hai người cầm vé \"花火大会\" nhìn trời; ③ cậu bé mặc áo mưa vẫn đi đá bóng."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Dự báo thời tiết",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{明日|あした}の{天気|てんき}はどうですか。",
            "ro": "Ashita no tenki wa dou desu ka.",
            "vi": "(Tranh ①) Thời tiết ngày mai thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{午前|ごぜん}は{晴|は}れですが、{夜|よる}は{雨|あめ}が{降|ふ}るそうです。",
            "ro": "Gozen wa hare desu ga, yoru wa ame ga furu sou desu.",
            "vi": "Nghe nói buổi sáng nắng nhưng buổi tối mưa."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{雨|あめ}だったら、{花火大会|はなびたいかい}はどうなりますか。",
            "ro": "Ame dattara, hanabitaikai wa dou narimasu ka.",
            "vi": "(Tranh ②) Nếu mưa thì lễ hội pháo hoa sẽ thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{雨|あめ}だったら、{中止|ちゅうし}だと{思|おも}います。",
            "ro": "Ame dattara, chuushi da to omoimasu.",
            "vi": "Tôi nghĩ nếu mưa thì sẽ bị huỷ."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{子|こ}どもは？",
            "ro": "Kono kodomo wa?",
            "vi": "(Tranh ③) Còn cậu bé này?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{雨|あめ}が{降|ふ}っても、サッカーをしています。",
            "ro": "Ame ga futte mo, sakkaa o shite imasu.",
            "vi": "Dù mưa cậu bé vẫn đá bóng."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "あなたは{雨|あめ}が{降|ふ}っても、{出|で}かけますか。",
            "ro": "Anata wa ame ga futte mo, dekakemasu ka.",
            "vi": "(Cá nhân) Dù mưa bạn có ra ngoài không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、{約束|やくそく}があったら、{雨|あめ}でも{出|で}かけます。",
            "ro": "Hai, yakusoku ga attara, ame demo dekakemasu.",
            "vi": "Có, nếu có hẹn thì dù mưa tôi vẫn đi."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · bộ tranh 3–4: rủ đi theo tạp chí · đoán"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Ba ô: ① trang quảng cáo \"フリーマーケット 入場無料 · 雨天中止\"; ② quán ramen mới \"OPEN · 20%OFF\"; ③ áo khoác giá cao, có chữ \"SALE\"."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Trang tạp chí",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "これは{何|なん}ですか。",
            "ro": "Kore wa nan desu ka.",
            "vi": "(Tranh ①) Đây là gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{日曜日|にちようび}にフリーマーケットがあるそうです。{無料|むりょう}です。でも、{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}です。",
            "ro": "Nichiyoubi ni furiimaaketto ga aru sou desu. Muryou desu. Demo, ame ga futtara, chuushi desu.",
            "vi": "Nghe nói Chủ nhật có chợ đồ cũ. Miễn phí. Nhưng nếu mưa thì huỷ."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{店|みせ}は？",
            "ro": "Kono mise wa?",
            "vi": "(Tranh ②) Còn quán này?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{新|あたら}しいラーメン{屋|や}ができたそうです。{今|いま}は{二十|にじゅっ}パーセント{引|び}きです。",
            "ro": "Atarashii raamen'ya ga dekita sou desu. Ima wa niju paasento biki desu.",
            "vi": "Nghe nói mới mở một quán ramen. Bây giờ giảm 20%."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "このコートを{買|か}いますか。",
            "ro": "Kono kooto o kaimasu ka.",
            "vi": "(Tranh ③) Bạn có mua cái áo khoác này không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ちょっと{高|たか}いですが、{高|たか}くても、{買|か}いたいです。",
            "ro": "Chotto takai desu ga, takakute mo, kaitai desu.",
            "vi": "Hơi đắt nhưng dù đắt tôi vẫn muốn mua."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{時間|じかん}があったら、{週末|しゅうまつ}{何|なに}をしたいですか。",
            "ro": "Jikan ga attara, shuumatsu nani o shitai desu ka.",
            "vi": "(Cá nhân) Nếu có thời gian, cuối tuần bạn muốn làm gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{時間|じかん}があったら、{友達|ともだち}とフリーマーケットに{行|い}きたいです。",
            "ro": "Jikan ga attara, tomodachi to furiimaaketto ni ikitai desu.",
            "vi": "Nếu có thời gian tôi muốn đi chợ đồ cũ với bạn."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Ba ô: ① hàng dài trước quán bánh; ② đồng hồ chỉ 8:55, tàu chạy lúc 9:00, ga còn xa; ③ hai đội bóng: một đội cao lớn, cúp vô địch."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Đoán xem",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{店|みせ}はどうだと{思|おも}いますか。",
            "ro": "Kono mise wa dou da to omoimasu ka.",
            "vi": "(Tranh ①) Bạn nghĩ quán này thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{人|ひと}がたくさん{並|なら}んでいますから、きっとおいしいと{思|おも}います。",
            "ro": "Hito ga takusan narande imasu kara, kitto oishii to omoimasu.",
            "vi": "Có nhiều người xếp hàng nên tôi nghĩ chắc chắn ngon."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{九時|くじ}の{電車|でんしゃ}に{間|ま}に{合|あ}いますか。",
            "ro": "Kuji no densha ni maniaimasu ka.",
            "vi": "(Tranh ②) Có kịp tàu 9 giờ không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{急|いそ}いでも、たぶん{間|ま}に{合|あ}わないと{思|おも}います。",
            "ro": "Isoide mo, tabun maniawanai to omoimasu.",
            "vi": "Tôi nghĩ dù vội có lẽ cũng không kịp."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "どちらのチームが{勝|か}つと{思|おも}いますか。",
            "ro": "Dochira no chiimu ga katsu to omoimasu ka.",
            "vi": "(Tranh ③) Bạn nghĩ đội nào sẽ thắng?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{青|あお}いチームは{強|つよ}いですから、きっと{勝|か}つと{思|おも}います。",
            "ro": "Aoi chiimu wa tsuyoi desu kara, kitto katsu to omoimasu.",
            "vi": "Đội xanh mạnh nên tôi nghĩ chắc chắn thắng."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{明日|あした}の{天気|てんき}はどうだと{思|おも}いますか。",
            "ro": "Ashita no tenki wa dou da to omoimasu ka.",
            "vi": "(Cá nhân) Bạn nghĩ thời tiết mai thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "たぶん{晴|は}れると{思|おも}います。{今日|きょう}の{夕方|ゆうがた}、{空|そら}が{赤|あか}かったですから。",
            "ro": "Tabun hareru to omoimasu. Kyou no yuugata, sora ga akakatta desu kara.",
            "vi": "Tôi nghĩ có lẽ trời nắng. Vì chiều tối nay bầu trời đỏ."
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
          "Một bức tranh lớn: quán cà phê \"CLOSED\", trước ngân hàng có hàng dài, cột đèn bị đổ, kính cửa hàng vỡ, cái ví rơi trên vỉa hè, xe buýt đỗ ở bến nhưng không có ai."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Ngoài phố",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "カフェはどうですか。",
            "ro": "Kafe wa dou desu ka.",
            "vi": "Quán cà phê thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "カフェは{閉|し}まっています。ほかの{店|みせ}に{行|い}きませんか。",
            "ro": "Kafe wa shimatte imasu. Hoka no mise ni ikimasen ka.",
            "vi": "Quán cà phê đóng cửa. Đi quán khác không?"
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{銀行|ぎんこう}の{前|まえ}は？",
            "ro": "Ginkou no mae wa?",
            "vi": "Trước ngân hàng thì sao?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{人|ひと}がたくさん{並|なら}んでいます。",
            "ro": "Hito ga takusan narande imasu.",
            "vi": "Nhiều người đang xếp hàng."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ほかに{何|なに}が{見|み}えますか。",
            "ro": "Hoka ni nani ga miemasu ka.",
            "vi": "Bạn còn thấy gì nữa?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{店|みせ}のガラスが{割|わ}れています。それから、{道|みち}に{財布|さいふ}が{落|お}ちています。{昨日|きのう}の{台風|たいふう}で{割|わ}れたと{思|おも}います。",
            "ro": "Mise no garasu ga warete imasu. Sorekara, michi ni saifu ga ochite imasu. Kinou no taifuu de wareta to omoimasu.",
            "vi": "Kính cửa hàng bị vỡ. Và trên đường có cái ví bị rơi. Tôi nghĩ kính vỡ vì cơn bão hôm qua."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{道|みち}に{財布|さいふ}が{落|お}ちていたら、どうしますか。",
            "ro": "Michi ni saifu ga ochite itara, dou shimasu ka.",
            "vi": "(Cá nhân) Nếu thấy ví rơi trên đường thì bạn làm gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{財布|さいふ}が{落|お}ちていたら、{交番|こうばん}に{持|も}って{行|い}きます。",
            "ro": "Saifu ga ochite itara, kouban ni motte ikimasu.",
            "vi": "Nếu có ví rơi thì tôi mang đến đồn cảnh sát."
          }
        ]
      },
      {
        "t": "h",
        "text": "Đọc to (Reading 40 điểm)"
      },
      {
        "t": "passage",
        "title": "Đọc to 1 (Reading) — Tin trên ti vi",
        "intro": "Chuẩn bị 20 giây rồi đọc to, chậm, rõ. Chú ý âm dài và âm ngắt: たいふう・ちゅうし・ほんとう・しんぱい.",
        "paras": [
          {
            "text": "{今朝|けさ}、ニュースで{見|み}ましたが、{大|おお}きい{台風|たいふう}が{来|く}るそうです。{台風|たいふう}で{電車|でんしゃ}も{止|と}まるそうです。{明日|あした}の{試合|しあい}はたぶん{中止|ちゅうし}だと{思|おも}います。{本当|ほんとう}に{心配|しんぱい}です。"
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
            "en": "{今朝|けさ}、ニュースで{見|み}ましたが、{大|おお}きい{台風|たいふう}が{来|く}るそうです。",
            "ro": "Kesa, nyuusu de mimashita ga, ookii taifuu ga kuru sou desu.",
            "vi": "Sáng nay tôi xem thời sự, nghe nói có cơn bão lớn sắp đến."
          },
          {
            "en": "{台風|たいふう}で{電車|でんしゃ}も{止|と}まるそうです。",
            "ro": "Taifuu de densha mo tomaru sou desu.",
            "vi": "Nghe nói vì bão mà tàu cũng ngừng chạy."
          },
          {
            "en": "{明日|あした}の{試合|しあい}はたぶん{中止|ちゅうし}だと{思|おも}います。{本当|ほんとう}に{心配|しんぱい}です。",
            "ro": "Ashita no shiai wa tabun chuushi da to omoimasu. Hontou ni shinpai desu.",
            "vi": "Tôi nghĩ trận đấu mai có lẽ bị huỷ. Thật sự lo lắm."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đọc to 2 (Reading) — Ngày đi phố",
        "intro": "Nhiều âm ngắt và âm mũi: とまって・ならんで・こんで・すいて.",
        "paras": [
          {
            "text": "{駅|えき}に{着|つ}いたら、{電車|でんしゃ}が{止|と}まっていました。カフェの{前|まえ}には{人|ひと}がたくさん{並|なら}んでいました。{混|こ}んでいても、{入|はい}りたかったです。{雨|あめ}が{降|ふ}っても、いい{一日|いちにち}でした。"
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
            "en": "{駅|えき}に{着|つ}いたら、{電車|でんしゃ}が{止|と}まっていました。",
            "ro": "Eki ni tsuitara, densha ga tomatte imashita.",
            "vi": "Đến ga thì tàu đang dừng."
          },
          {
            "en": "カフェの{前|まえ}には{人|ひと}がたくさん{並|なら}んでいました。",
            "ro": "Kafe no mae ni wa hito ga takusan narande imashita.",
            "vi": "Trước quán cà phê có nhiều người đang xếp hàng."
          },
          {
            "en": "{混|こ}んでいても、{入|はい}りたかったです。{雨|あめ}が{降|ふ}っても、いい{一日|いちにち}でした。",
            "ro": "Konde ite mo, hairitakatta desu. Ame ga futte mo, ii ichinichi deshita.",
            "vi": "Dù đông tôi vẫn muốn vào. Dù mưa vẫn là một ngày đẹp."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b15-noi-ghi-am",
        "part": "1",
        "questions": [
          "なにか ニュースを しって いますか。",
          "どうして でんしゃが とまって いますか。",
          "じかんが あったら、なにを したいですか。",
          "あめが ふっても、でかけますか。",
          "あしたは はれると おもいますか。",
          "みちに さいふが おちて いたら、どう しますか。",
          "スピーチコンテストに でた ことが ありますか。",
          "（ともだちに）これ、しってる？"
        ]
      },
      {
        "t": "h",
        "text": "Viết ngắn 3–5 câu — 4 đề có bài mẫu"
      },
      {
        "t": "p",
        "text": "**Đề 1.** Viết một \"bản tin\" ngắn kể lại tin bạn xem trên ti vi (4 câu, dùng ～そうです · N で · cảm tưởng). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{昨日|きのう}、テレビでニュースを{見|み}ました。",
            "ro": "Kinou, terebi de nyuusu o mimashita.",
            "vi": "Hôm qua tôi xem thời sự trên ti vi."
          },
          {
            "en": "{九州|きゅうしゅう}で{大|おお}きい{地震|じしん}があったそうです。",
            "ro": "Kyuushuu de ookii jishin ga atta sou desu.",
            "vi": "Nghe nói ở Kyushu có động đất lớn."
          },
          {
            "en": "{地震|じしん}で{古|ふる}い{家|いえ}が{倒|たお}れたそうです。",
            "ro": "Jishin de furui ie ga taoreta sou desu.",
            "vi": "Nghe nói vì động đất mà ngôi nhà cũ bị đổ."
          },
          {
            "en": "{亡|な}くなった{人|ひと}はいないそうですから、よかったです。",
            "ro": "Nakunatta hito wa inai sou desu kara, yokatta desu.",
            "vi": "Nghe nói không ai thiệt mạng, may quá."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 2.** Viết tin nhắn rủ bạn đi một sự kiện trong tạp chí (4 câu, dùng ～たら · ～ても · きっと ～と思います). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{土曜日|どようび}に{川|かわ}で{花火大会|はなびたいかい}があるそうです。",
            "ro": "Doyoubi ni kawa de hanabitaikai ga aru sou desu.",
            "vi": "Nghe nói thứ Bảy có lễ hội pháo hoa ở sông."
          },
          {
            "en": "{暇|ひま}だったら、{一緒|いっしょ}に{行|い}きませんか。",
            "ro": "Hima dattara, issho ni ikimasen ka.",
            "vi": "Nếu rảnh thì đi cùng không?"
          },
          {
            "en": "{少|すこ}し{雨|あめ}が{降|ふ}っても、あるそうです。",
            "ro": "Sukoshi ame ga futte mo, aru sou desu.",
            "vi": "Nghe nói dù mưa nhỏ vẫn có."
          },
          {
            "en": "きっと{人|ひと}が{多|おお}いと{思|おも}いますから、{早|はや}く{行|い}きましょう。",
            "ro": "Kitto hito ga ooi to omoimasu kara, hayaku ikimashou.",
            "vi": "Tôi nghĩ chắc chắn đông nên đi sớm nhé."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 3.** Tả những gì bạn thấy khi ra phố hôm nay (4 câu, dùng ～が ～て います／～て いました · じゃ、～ませんか). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{今日|きょう}、{駅|えき}の{前|まえ}は{大変|たいへん}でした。",
            "ro": "Kyou, eki no mae wa taihen deshita.",
            "vi": "Hôm nay trước ga vất vả lắm."
          },
          {
            "en": "{事故|じこ}でバスが{止|と}まっていました。",
            "ro": "Jiko de basu ga tomatte imashita.",
            "vi": "Vì tai nạn mà xe buýt đang dừng."
          },
          {
            "en": "コンビニの{前|まえ}に{人|ひと}がたくさん{並|なら}んでいました。",
            "ro": "Konbini no mae ni hito ga takusan narande imashita.",
            "vi": "Trước cửa hàng tiện lợi có nhiều người xếp hàng."
          },
          {
            "en": "でも、{図書館|としょかん}はすいていましたから、そこで{勉強|べんきょう}しました。",
            "ro": "Demo, toshokan wa suite imashita kara, soko de benkyou shimashita.",
            "vi": "Nhưng thư viện vắng nên tôi học ở đó."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 4.** Viết về một kỷ niệm đáng nhớ (thi, đi chơi…) (4–5 câu, dùng ～て いました · ～ても · なんと · いい思い出). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{去年|きょねん}、{初|はじ}めてスピーチコンテストに{出|で}ました。",
            "ro": "Kyonen, hajimete supiichikontesuto ni demashita.",
            "vi": "Năm ngoái lần đầu tôi tham gia cuộc thi hùng biện."
          },
          {
            "en": "{会場|かいじょう}には{人|ひと}がたくさん{集|あつ}まっていました。",
            "ro": "Kaijou ni wa hito ga takusan atsumatte imashita.",
            "vi": "Ở hội trường có rất nhiều người tụ tập."
          },
          {
            "en": "とても{緊張|きんちょう}しましたが、{最後|さいご}まで{話|はな}すことができました。",
            "ro": "Totemo kinchou shimashita ga, saigo made hanasu koto ga dekimashita.",
            "vi": "Tôi rất hồi hộp nhưng đã nói được đến cuối."
          },
          {
            "en": "なんと{三位|さんい}でした。いい{思|おも}い{出|で}になりました。",
            "ro": "Nanto san'i deshita. Ii omoide ni narimashita.",
            "vi": "Không ngờ được hạng ba. Đã thành một kỷ niệm đẹp."
          }
        ]
      },
      {
        "t": "note",
        "title": "Checklist trước khi nộp bài viết",
        "items": [
          "**普通形 + そうです**: 来る／来た／来ない そうです · ナA／N + **だ**そうです (無料だ · 中止だ) · イA không thêm だ.",
          "**たら = thể た + ら** (あったら · 晴れたら · よかったら · 暇だったら) · **ても = thể て + も** (降って も · 高くて も · 雨でも).",
          "**N が V (tự động từ) て います**: 止まって · 閉まって · 並んで · 割れて (không ~~電車を 止まって~~). Đoán: **きっと／たぶん ～と 思います**."
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-viet-chon",
        "title": "Chọn bài viết đúng và tự nhiên (6 câu)",
        "items": [
          {
            "q": "Viết: \"Nghe nói mai bão đến.\"",
            "options": [
              "{明日|あした}{台風|たいふう}が{来|く}るだそうです。 (Ashita taifuu ga kuru da sou desu.)",
              "{明日|あした}{台風|たいふう}が{来|き}ますそうです。 (Ashita taifuu ga kimasu sou desu.)",
              "{明日|あした}{台風|たいふう}が{来|く}るそうでした。 (Ashita taifuu ga kuru sou deshita.)",
              "{明日|あした}{台風|たいふう}が{来|く}るそうです。 (Ashita taifuu ga kuru sou desu.)"
            ],
            "correct": 3,
            "why": "来る そうです."
          },
          {
            "q": "Viết: \"Vì tai nạn mà tàu đang dừng.\"",
            "options": [
              "{事故|じこ}で{電車|でんしゃ}を{止|と}まっています。 (Jiko de densha o tomatte imasu.)",
              "{事故|じこ}に{電車|でんしゃ}が{止|と}まっています。 (Jiko ni densha ga tomatte imasu.)",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まっています。 (Jiko de densha ga tomatte imasu.)",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}めています。 (Jiko de densha ga tomete imasu.)"
            ],
            "correct": 2,
            "why": "事故で 電車が 止まって います."
          },
          {
            "q": "Viết: \"Nếu rảnh thì đi cùng không?\"",
            "options": [
              "{暇|ひま}と、{一緒|いっしょ}に{行|い}きませんか。 (Hima to, issho ni ikimasen ka.)",
              "{暇|ひま}かったら、{一緒|いっしょ}に{行|い}きませんか。 (Hima kattara, issho ni ikimasen ka.)",
              "{暇|ひま}だったら、{一緒|いっしょ}に{行|い}きませんか。 (Hima dattara, issho ni ikimasen ka.)",
              "{暇|ひま}でも、{一緒|いっしょ}に{行|い}きませんか。 (Hima demo, issho ni ikimasen ka.)"
            ],
            "correct": 2,
            "why": "暇だったら."
          },
          {
            "q": "Viết: \"Dù mưa vẫn có.\"",
            "options": [
              "{雨|あめ}が{降|ふ}るでも、あります。 (Ame ga furu demo, arimasu.)",
              "{雨|あめ}が{降|ふ}ったら、あります。 (Ame ga futtara, arimasu.)",
              "{雨|あめ}が{降|ふ}ったも、あります。 (Ame ga futta mo, arimasu.)",
              "{雨|あめ}が{降|ふ}っても、あります。 (Ame ga futte mo, arimasu.)"
            ],
            "correct": 3,
            "why": "降っても."
          },
          {
            "q": "Viết: \"Tôi nghĩ chắc chắn đông.\"",
            "options": [
              "きっと{混|こ}んでいるそうでした。 (Kitto konde iru sou deshita.)",
              "もし{混|こ}んでいると{思|おも}います。 (Moshi konde iru to omoimasu.)",
              "きっと{混|こ}んでいますと{思|おも}います。 (Kitto konde imasu to omoimasu.)",
              "きっと{混|こ}んでいると{思|おも}います。 (Kitto konde iru to omoimasu.)"
            ],
            "correct": 3,
            "why": "きっと + thể thường + と 思います."
          },
          {
            "q": "Viết: \"Cửa hàng đóng cửa rồi.\"",
            "options": [
              "{店|みせ}が{閉|し}まっています。 (Mise ga shimatte imasu.)",
              "{店|みせ}が{閉|し}めています。 (Mise ga shimete imasu.)",
              "{店|みせ}を{閉|し}まっています。 (Mise o shimatte imasu.)",
              "{店|みせ}が{閉|し}まりますいます。 (Mise ga shimarimasu imasu.)"
            ],
            "correct": 0,
            "why": "閉まって います."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b15-viet-sx",
        "title": "Sắp xếp thành đoạn văn hoàn chỉnh (2 câu)",
        "items": [
          {
            "vi": "Sắp xếp đoạn \"kể tin\": nguồn tin → chuyện xảy ra → hậu quả → cảm tưởng.",
            "chips": [
              "ニュースで{見|み}ました。",
              "{怖|こわ}いですね。",
              "{台風|たいふう}が{来|き}たそうです。",
              "{台風|たいふう}で{木|き}が{倒|たお}れたそうです。"
            ],
            "answer": [
              "ニュースで{見|み}ました。",
              "{台風|たいふう}が{来|き}たそうです。",
              "{台風|たいふう}で{木|き}が{倒|たお}れたそうです。",
              "{怖|こわ}いですね。"
            ],
            "ro": "Nyuusu de mimashita. Taifuu ga kita sou desu. Taifuu de ki ga taoreta sou desu. Kowai desu ne."
          },
          {
            "vi": "Sắp xếp đoạn \"rủ đi\": tin → rủ → điều kiện mưa → đoán.",
            "chips": [
              "{雨|あめ}が{降|ふ}っても、あるそうです。",
              "よかったら、{一緒|いっしょ}に{行|い}きませんか。",
              "きっと{楽|たの}しいと{思|おも}います。",
              "{日曜日|にちようび}にフリーマーケットがあるそうです。"
            ],
            "answer": [
              "{日曜日|にちようび}にフリーマーケットがあるそうです。",
              "よかったら、{一緒|いっしょ}に{行|い}きませんか。",
              "{雨|あめ}が{降|ふ}っても、あるそうです。",
              "きっと{楽|たの}しいと{思|おも}います。"
            ],
            "ro": "Nichiyoubi ni furiimaaketto ga aru sou desu. Yokattara, issho ni ikimasen ka. Ame ga futte mo, aru sou desu. Kitto tanoshii to omoimasu."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b15-de-tong-hop",
    "kind": "review",
    "title": "Luyện thêm Bài 15 · Đề tổng hợp cuối bài — đúng khuôn kiểm tra của cô (65 câu · 50 phút)",
    "goal": "Làm thử một đề đủ các phần: từ vựng, chữ Hán (chữ nhiễu), ngữ pháp 6 điểm, gõ thể たら／ても／thể thường trước そうです, đọc hiểu, dịch — bấm giờ 50 phút, tự chấm theo thang điểm và biết mình yếu phần nào.",
    "minutes": 50,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Bấm giờ 50 phút**, không mở bài ôn. Làm theo thứ tự I → VI; câu chưa chắc thì đánh dấu, quay lại sau.",
          "Phần II (chữ Hán) có **chữ na ná**: 天/夫 · 晴/清 · 雨/両 · 曇/雲 · 降/院 · 台/合 · 震/振 · 事/車 · 故/古 · 急/思 · 心/必. Phần IV gõ **thể たら / ても / thể thường trước そうです** — nhớ bẫy あったら · よかったら · 来たら (きたら) · 高くて も · 雨でも · 雨だそうです.",
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
            "Ngữ pháp — そうです, N で, たら, ても, と思います (đoán), ています (trạng thái)",
            "20",
            "20"
          ],
          [
            "IV",
            "Gõ thể たら / ても / thể thường trước そうです",
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
        "caption": "Cấu trúc đề tổng hợp Bài 15"
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
            "Sang \"Ôn tổng Bài 11–15\"; làm lại phần IV sau 3 ngày để giữ たら／ても"
          ],
          [
            "46–54 (70–85%)",
            "Khá, còn sơ hở",
            "Xem lại phần sai nhiều nhất; làm lại lesson tương ứng ở mức Vừa"
          ],
          [
            "< 46 (< 70%)",
            "Chưa chắc",
            "Làm lại \"Thể たら · ても · そうです\" + 3 lesson ngữ pháp từ mức Dễ, rồi làm lại đề này sau 2 ngày"
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
        "id": "lt-b15-de-i",
        "title": "I. Từ vựng",
        "items": [
          {
            "q": "{大|おお}きい＿＿が{来|く}るそうです。{窓|まど}を{閉|し}めてください。　〔Ookii __ ga kuru sou desu. Mado o shimete kudasai.〕　— Nghe nói bão lớn sắp đến. Hãy đóng cửa sổ.",
            "options": [
              "{席|せき}",
              "{事故|じこ}",
              "{台風|たいふう}",
              "{夕方|ゆうがた}"
            ],
            "correct": 2,
            "why": "Bão = 台風. → **{大|おお}きい{台風|たいふう}が{来|く}るそうです。{窓|まど}を{閉|し}めてください。** 〔Ookii taifuu ga kuru sou desu. Mado o shimete kudasai.〕 — Nghe nói bão lớn sắp đến. Hãy đóng cửa sổ."
          },
          {
            "q": "{雨|あめ}だったら、{試合|しあい}は＿＿です。　〔Ame dattara, shiai wa __ desu.〕　— Nếu mưa thì trận đấu bị huỷ.",
            "options": [
              "{昔|むかし}",
              "{無料|むりょう}",
              "{中止|ちゅうし}",
              "{本当|ほんとう}"
            ],
            "correct": 2,
            "why": "Huỷ = 中止. → **{雨|あめ}だったら、{試合|しあい}は{中止|ちゅうし}です。** 〔Ame dattara, shiai wa chuushi desu.〕 — Nếu mưa thì trận đấu bị huỷ."
          },
          {
            "q": "{子|こ}どもは{入場料|にゅうじょうりょう}が＿＿だそうです。　〔Kodomo wa nyuujouryou ga __ da sou desu.〕　— Nghe nói trẻ em được miễn phí vào cửa.",
            "options": [
              "{無料|むりょう}",
              "{中止|ちゅうし}",
              "{心配|しんぱい}",
              "{曇|くも}り"
            ],
            "correct": 0,
            "why": "Miễn phí = 無料. → **{子|こ}どもは{入場料|にゅうじょうりょう}が{無料|むりょう}だそうです。** 〔Kodomo wa nyuujouryou ga muryou da sou desu.〕 — Nghe nói trẻ em được miễn phí vào cửa."
          },
          {
            "q": "{日本|にほん}のチームはブラジルに＿＿そうです。　〔Nihon no chiimu wa Burajiru ni __ sou desu.〕　— Nghe nói đội Nhật đã thắng Brazil.",
            "options": [
              "{倒|たお}れた",
              "{勝|か}った",
              "{閉|し}まった",
              "{割|わ}れた"
            ],
            "correct": 1,
            "why": "Thắng N = N に 勝ちます. → **{日本|にほん}のチームはブラジルに{勝|か}ったそうです。** 〔Nihon no chiimu wa Burajiru ni katta sou desu.〕 — Nghe nói đội Nhật đã thắng Brazil."
          },
          {
            "q": "{地震|じしん}で{窓|まど}ガラスが＿＿。　〔Jishin de mado garasu ga __.〕　— Vì động đất mà kính cửa sổ bị vỡ.",
            "options": [
              "すきました",
              "{勝|か}ちました",
              "やみました",
              "{割|わ}れました"
            ],
            "correct": 3,
            "why": "Vỡ = 割れます. → **{地震|じしん}で{窓|まど}ガラスが{割|わ}れました。** 〔Jishin de mado garasu ga waremashita.〕 — Vì động đất mà kính cửa sổ bị vỡ."
          },
          {
            "q": "{土曜日|どようび}は{店|みせ}が＿＿いますから、{平日|へいじつ}に{行|い}きましょう。　〔Doyoubi wa mise ga __ imasu kara, heijitsu ni ikimashou.〕　— Thứ Bảy quán đông nên đi ngày thường nhé.",
            "options": [
              "すいて",
              "{混|こ}んで",
              "{急|いそ}いで",
              "{晴|は}れて"
            ],
            "correct": 1,
            "why": "Đông = 混んで います. → **{土曜日|どようび}は{店|みせ}が{混|こ}んでいますから、{平日|へいじつ}に{行|い}きましょう。** 〔Doyoubi wa mise ga konde imasu kara, heijitsu ni ikimashou.〕 — Thứ Bảy quán đông nên đi ngày thường nhé."
          },
          {
            "q": "タクシーで{行|い}ったら、{電車|でんしゃ}に＿＿と{思|おも}います。　〔Takushii de ittara, densha ni __ to omoimasu.〕　— Tôi nghĩ nếu đi taxi thì kịp tàu.",
            "options": [
              "{集|あつ}まる",
              "{負|ま}ける",
              "{間|ま}に{合|あ}う",
              "{始|はじ}まる"
            ],
            "correct": 2,
            "why": "Kịp = 間に合います. → **タクシーで{行|い}ったら、{電車|でんしゃ}に{間|ま}に{合|あ}うと{思|おも}います。** 〔Takushii de ittara, densha ni maniau to omoimasu.〕 — Tôi nghĩ nếu đi taxi thì kịp tàu."
          },
          {
            "q": "{雨|あめ}が＿＿から、{出|で}かけましょう。　〔Ame ga __ kara, dekakemashou.〕　— Mưa tạnh rồi, ra ngoài thôi.",
            "options": [
              "やんだ",
              "{落|お}ちた",
              "{消|き}えた",
              "{降|ふ}った"
            ],
            "correct": 0,
            "why": "Mưa tạnh = やみます. → **{雨|あめ}がやんだから、{出|で}かけましょう。** 〔Ame ga yanda kara, dekakemashou.〕 — Mưa tạnh rồi, ra ngoài thôi."
          },
          {
            "q": "あっ、{道|みち}に{財布|さいふ}が＿＿いますよ。　〔A, michi ni saifu ga __ imasu yo.〕　— Ơ, trên đường có cái ví bị rơi kìa.",
            "options": [
              "すいて",
              "{落|お}ちて",
              "{倒|たお}れて",
              "{割|わ}れて"
            ],
            "correct": 1,
            "why": "Rơi = 落ちます. → **あっ、{道|みち}に{財布|さいふ}が{落|お}ちていますよ。** 〔A, michi ni saifu ga ochite imasu yo.〕 — Ơ, trên đường có cái ví bị rơi kìa."
          },
          {
            "q": "とても＿＿しましたが、{最後|さいご}まで{話|はな}すことができました。　〔Totemo __ shimashita ga, saigo made hanasu koto ga dekimashita.〕　— Tôi rất hồi hộp nhưng đã nói được đến cuối.",
            "options": [
              "{緊張|きんちょう}",
              "{中止|ちゅうし}",
              "{結婚|けっこん}",
              "{入院|にゅういん}"
            ],
            "correct": 0,
            "why": "Hồi hộp = 緊張します. → **とても{緊張|きんちょう}しましたが、{最後|さいご}まで{話|はな}すことができました。** 〔Totemo kinchou shimashita ga, saigo made hanasu koto ga dekimashita.〕 — Tôi rất hồi hộp nhưng đã nói được đến cuối."
          }
        ]
      },
      {
        "t": "h",
        "text": "II. Chữ Hán (12 câu · 12 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b15-de-ii",
        "title": "II. Chữ Hán",
        "items": [
          {
            "q": "Chọn cách viết đúng: てんき (thời tiết)",
            "options": [
              "天汽",
              "夫気",
              "天気",
              "大気"
            ],
            "correct": 2,
            "why": "天 = trời; 気 = khí."
          },
          {
            "q": "Chọn cách viết đúng: はれます (trời nắng)",
            "options": [
              "睛れます",
              "晴れます",
              "清れます",
              "青れます"
            ],
            "correct": 1,
            "why": "晴 = 日 + 青."
          },
          {
            "q": "Chọn cách viết đúng: あめ (mưa)",
            "options": [
              "雪",
              "雨",
              "両",
              "南"
            ],
            "correct": 1,
            "why": "雨 có 4 chấm mưa."
          },
          {
            "q": "Chọn cách viết đúng: くもり (nhiều mây)",
            "options": [
              "量り",
              "曇り",
              "景り",
              "雲り"
            ],
            "correct": 1,
            "why": "曇 = 日 + 雲."
          },
          {
            "q": "Chọn cách viết đúng: たいふう (bão)",
            "options": [
              "台風",
              "治風",
              "合風",
              "会風"
            ],
            "correct": 0,
            "why": "台 = ム + 口."
          },
          {
            "q": "Chọn cách viết đúng: じしん (động đất)",
            "options": [
              "地辰",
              "地振",
              "地震",
              "地雷"
            ],
            "correct": 2,
            "why": "震 = 雨 + 辰."
          },
          {
            "q": "Chọn cách viết đúng: じこ (tai nạn)",
            "options": [
              "事故",
              "書故",
              "事古",
              "車故"
            ],
            "correct": 0,
            "why": "事 + 故 (古 + 攵)."
          },
          {
            "q": "Chọn cách viết đúng: いそぎます (vội)",
            "options": [
              "急ぎます",
              "忘ぎます",
              "意ぎます",
              "思ぎます"
            ],
            "correct": 0,
            "why": "急 = ⺈ + ヨ + 心."
          },
          {
            "q": "Đọc đúng: 【雨】が降っても、行きます。",
            "options": [
              "あめ",
              "あま",
              "ゆき",
              "う"
            ],
            "correct": 0,
            "why": "雨 = あめ."
          },
          {
            "q": "Đọc đúng: 次の駅で【降】ります。",
            "options": [
              "こう",
              "ふ",
              "くだ",
              "お"
            ],
            "correct": 3,
            "why": "Xuống tàu → 降りる (おりる)."
          },
          {
            "q": "Đọc đúng: 母が【心配】しています。",
            "options": [
              "こころぱい",
              "じんぱい",
              "しんぱい",
              "しんはい"
            ],
            "correct": 2,
            "why": "心配 = しんぱい."
          },
          {
            "q": "Đọc đúng: 【急】に雨が降ってきました。",
            "options": [
              "ぎゅう",
              "きゅう",
              "いそ",
              "きゅ"
            ],
            "correct": 1,
            "why": "急に = きゅうに."
          }
        ]
      },
      {
        "t": "h",
        "text": "III. Ngữ pháp (20 câu · 20 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b15-de-iii",
        "title": "III. Ngữ pháp",
        "items": [
          {
            "q": "{明日|あした}は{雨|あめ}＿＿そうです。　〔Ashita wa ame __ sou desu.〕　— Nghe nói mai mưa.",
            "options": [
              "の",
              "な",
              "だ",
              "です"
            ],
            "correct": 2,
            "why": "119: N + だ そうです. → **{明日|あした}は{雨|あめ}だそうです。** 〔Ashita wa ame da sou desu.〕 — Nghe nói mai mưa."
          },
          {
            "q": "{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}が＿＿そうです。　〔Eki no mae ni atarashii mise ga __ sou desu.〕　— Nghe nói trước ga mới mở cửa hàng.",
            "options": [
              "できて",
              "できるだ",
              "できた",
              "できました"
            ],
            "correct": 2,
            "why": "119: thể thường. → **{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}ができたそうです。** 〔Eki no mae ni atarashii mise ga dekita sou desu.〕 — Nghe nói trước ga mới mở cửa hàng."
          },
          {
            "q": "この{本|ほん}はとてもおもしろい＿＿。　〔Kono hon wa totemo omoshiroi __.〕　— Nghe nói cuốn sách này rất hay.",
            "options": [
              "なそうです",
              "そうでした",
              "だそうです",
              "そうです"
            ],
            "correct": 3,
            "why": "119: イA + そうです. → **この{本|ほん}はとてもおもしろいそうです。** 〔Kono hon wa totemo omoshiroi sou desu.〕 — Nghe nói cuốn sách này rất hay."
          },
          {
            "q": "{台風|たいふう}＿＿{電車|でんしゃ}が{止|と}まりました。　〔Taifuu __ densha ga tomarimashita.〕　— Vì bão mà tàu dừng.",
            "options": [
              "で",
              "が",
              "に",
              "を"
            ],
            "correct": 0,
            "why": "124: nguyên nhân で. → **{台風|たいふう}で{電車|でんしゃ}が{止|と}まりました。** 〔Taifuu de densha ga tomarimashita.〕 — Vì bão mà tàu dừng."
          },
          {
            "q": "{病気|びょうき}＿＿{学校|がっこう}を{休|やす}みました。　〔Byouki __ gakkou o yasumimashita.〕　— Vì ốm nên nghỉ học.",
            "options": [
              "から",
              "に",
              "で",
              "と"
            ],
            "correct": 2,
            "why": "124: 病気で. → **{病気|びょうき}で{学校|がっこう}を{休|やす}みました。** 〔Byouki de gakkou o yasumimashita.〕 — Vì ốm nên nghỉ học."
          },
          {
            "q": "{時間|じかん}が＿＿、{一緒|いっしょ}に{行|い}きませんか。　〔Jikan ga __, issho ni ikimasen ka.〕　— Nếu có thời gian thì đi cùng không?",
            "options": [
              "あるたら",
              "あったら",
              "あっても",
              "ありたら"
            ],
            "correct": 1,
            "why": "120: あったら. → **{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。** 〔Jikan ga attara, issho ni ikimasen ka.〕 — Nếu có thời gian thì đi cùng không?"
          },
          {
            "q": "＿＿、これ、どうぞ。　〔__, kore, douzo.〕　— Nếu được thì mời bạn cái này.",
            "options": [
              "いかったら",
              "いいだったら",
              "よかったら",
              "よくても"
            ],
            "correct": 2,
            "why": "120: いい → よかったら. → **よかったら、これ、どうぞ。** 〔Yokattara, kore, douzo.〕 — Nếu được thì mời bạn cái này."
          },
          {
            "q": "{暇|ひま}＿＿、{遊|あそ}びに{来|き}てください。　〔Hima __, asobi ni kite kudasai.〕　— Nếu rảnh thì đến chơi nhé.",
            "options": [
              "かったら",
              "だったら",
              "くても",
              "でも"
            ],
            "correct": 1,
            "why": "120: ナA だったら. → **{暇|ひま}だったら、{遊|あそ}びに{来|き}てください。** 〔Hima dattara, asobi ni kite kudasai.〕 — Nếu rảnh thì đến chơi nhé."
          },
          {
            "q": "{雨|あめ}が＿＿、{試合|しあい}はあります。　〔Ame ga __, shiai wa arimasu.〕　— Dù mưa trận đấu vẫn có.",
            "options": [
              "{降|ふ}ったら",
              "{降|ふ}ったも",
              "{降|ふ}っても",
              "{降|ふ}ると"
            ],
            "correct": 2,
            "why": "121: 降っても. → **{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。** 〔Ame ga futtemo, shiai wa arimasu.〕 — Dù mưa trận đấu vẫn có."
          },
          {
            "q": "{高|たか}＿＿、{買|か}いたいです。　〔Taka__, kaitai desu.〕　— Dù đắt tôi vẫn muốn mua.",
            "options": [
              "かったら",
              "いても",
              "くても",
              "いでも"
            ],
            "correct": 2,
            "why": "121: 高くても. → **{高|たか}くても、{買|か}いたいです。** 〔Takakutemo, kaitai desu.〕 — Dù đắt tôi vẫn muốn mua."
          },
          {
            "q": "{日曜日|にちようび}＿＿、{仕事|しごと}があります。　〔Nichiyoubi __, shigoto ga arimasu.〕　— Dù Chủ nhật vẫn có việc.",
            "options": [
              "だったら",
              "でも",
              "ても",
              "くても"
            ],
            "correct": 1,
            "why": "121: N でも. → **{日曜日|にちようび}でも、{仕事|しごと}があります。** 〔Nichiyoubi demo, shigoto ga arimasu.〕 — Dù Chủ nhật vẫn có việc."
          },
          {
            "q": "{土曜日|どようび}は＿＿{混|こ}んでいると{思|おも}います。　〔Doyoubi wa __ konde iru to omoimasu.〕　— Tôi nghĩ thứ Bảy chắc chắn đông.",
            "options": [
              "なんと",
              "いつでも",
              "きっと",
              "もし"
            ],
            "correct": 2,
            "why": "123: きっと. → **{土曜日|どようび}はきっと{混|こ}んでいると{思|おも}います。** 〔Doyoubi wa kitto konde iru to omoimasu.〕 — Tôi nghĩ thứ Bảy chắc chắn đông."
          },
          {
            "q": "{明日|あした}はたぶん{雨|あめ}＿＿{思|おも}います。　〔Ashita wa tabun ame __ omoimasu.〕　— Tôi nghĩ có lẽ mai mưa.",
            "options": [
              "ですと",
              "だと",
              "なと",
              "と"
            ],
            "correct": 1,
            "why": "123: N + だ と 思います. → **{明日|あした}はたぶん{雨|あめ}だと{思|おも}います。** 〔Ashita wa tabun ame da to omoimasu.〕 — Tôi nghĩ có lẽ mai mưa."
          },
          {
            "q": "カルロスさんはたぶん＿＿と{思|おも}います。　〔Karurosu-san wa tabun __ to omoimasu.〕　— Tôi nghĩ có lẽ Carlos không đến.",
            "options": [
              "{来|こ}ない",
              "{来|き}ません",
              "{来|こ}ないだ",
              "{来|き}ない"
            ],
            "correct": 0,
            "why": "123: thể thường 来ない (こない). → **カルロスさんはたぶん{来|こ}ないと{思|おも}います。** 〔Karurosu-san wa tabun konai to omoimasu.〕 — Tôi nghĩ có lẽ Carlos không đến."
          },
          {
            "q": "あっ、{電車|でんしゃ}が＿＿います。　〔A, densha ga __ imasu.〕　— Ơ, tàu đang dừng.",
            "options": [
              "{止|と}まる",
              "{止|と}まり",
              "{止|と}まって",
              "{止|と}めて"
            ],
            "correct": 2,
            "why": "122: 止まって います. → **あっ、{電車|でんしゃ}が{止|と}まっています。** 〔A, densha ga tomatte imasu.〕 — Ơ, tàu đang dừng."
          },
          {
            "q": "{店|みせ}が＿＿いますね。ほかの{店|みせ}に{行|い}きましょう。　〔Mise ga __ imasu ne. Hoka no mise ni ikimashou.〕　— Cửa hàng đóng rồi nhỉ. Đi quán khác thôi.",
            "options": [
              "{閉|し}める",
              "{閉|し}まって",
              "{閉|し}めて",
              "{閉|し}まる"
            ],
            "correct": 1,
            "why": "122: 閉まって います. → **{店|みせ}が{閉|し}まっていますね。ほかの{店|みせ}に{行|い}きましょう。** 〔Mise ga shimatte imasu ne. Hoka no mise ni ikimashou.〕 — Cửa hàng đóng rồi nhỉ. Đi quán khác thôi."
          },
          {
            "q": "{部屋|へや}の{電気|でんき}＿＿{消|き}えています。　〔Heya no denki __ kiete imasu.〕　— Đèn phòng đang tắt.",
            "options": [
              "を",
              "で",
              "が",
              "に"
            ],
            "correct": 2,
            "why": "122: tự động từ + が. → **{部屋|へや}の{電気|でんき}が{消|き}えています。** 〔Heya no denki ga kiete imasu.〕 — Đèn phòng đang tắt."
          },
          {
            "q": "もし{雨|あめ}が＿＿、{家|うち}で{映画|えいが}を{見|み}ましょう。　〔Moshi ame ga __, uchi de eiga o mimashou.〕　— Nếu mưa thì xem phim ở nhà nhé.",
            "options": [
              "{降|ふ}って",
              "{降|ふ}ると",
              "{降|ふ}っても",
              "{降|ふ}ったら"
            ],
            "correct": 3,
            "why": "120: もし ～たら + rủ. → **もし{雨|あめ}が{降|ふ}ったら、{家|うち}で{映画|えいが}を{見|み}ましょう。** 〔Moshi ame ga futtara, uchi de eiga o mimashou.〕 — Nếu mưa thì xem phim ở nhà nhé."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まっているそうです。 (Jiko de densha ga tomatte iru sou desu.)",
              "{事故|じこ}で{電車|でんしゃ}を{止|と}まっているそうです。 (Jiko de densha o tomatte iru sou desu.)",
              "{事故|じこ}に{電車|でんしゃ}が{止|と}まっているそうです。 (Jiko ni densha ga tomatte iru sou desu.)",
              "{事故|じこ}で{電車|でんしゃ}が{止|と}まっていますそうです。 (Jiko de densha ga tomatte imasu sou desu.)"
            ],
            "correct": 0,
            "why": "124 + 122 + 119."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{急|いそ}ぐでも、たぶん{間|ま}に{合|あ}いませんと{思|おも}います。 (Isogu demo, tabun maniaimasen to omoimasu.)",
              "{急|いそ}いだらも、たぶん{間|ま}に{合|あ}わないと{思|おも}います。 (Isoidara mo, tabun maniawanai to omoimasu.)",
              "{急|いそ}いでも、たぶん{間|ま}に{合|あ}わないと{思|おも}います。 (Isoide mo, tabun maniawanai to omoimasu.)",
              "{急|いそ}いでも、もし{間|ま}に{合|あ}わないと{思|おも}います。 (Isoide mo, moshi maniawanai to omoimasu.)"
            ],
            "correct": 2,
            "why": "121 + 123."
          }
        ]
      },
      {
        "t": "h",
        "text": "IV. Gõ thể たら / ても / thể thường trước そうです (10 câu · 10 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b15-de-iv",
        "title": "IV. Gõ dạng đúng của từ trong gợi ý",
        "kind": "fill",
        "grammar": "たら · ても · 普通形そうです",
        "items": [
          {
            "q": "{明日|あした}＿＿、{海|うみ}へ{行|い}きましょう。　〔Ashita __, umi e ikimashou.〕",
            "answers": [
              "晴れたら",
              "はれたら"
            ],
            "hint": "はれます → nếu"
          },
          {
            "q": "{雨|あめ}が＿＿、{行|い}きます。　〔Ame ga __, ikimasu.〕",
            "answers": [
              "降っても",
              "ふっても"
            ],
            "hint": "ふります → dù"
          },
          {
            "q": "{駅|えき}に＿＿、{電話|でんわ}してください。　〔Eki ni __, denwa shite kudasai.〕",
            "answers": [
              "着いたら",
              "ついたら"
            ],
            "hint": "つきます → nếu / khi"
          },
          {
            "q": "＿＿、{一緒|いっしょ}に{食|た}べませんか。　〔__, issho ni tabemasen ka.〕",
            "answers": [
              "よかったら"
            ],
            "hint": "いい → nếu"
          },
          {
            "q": "{寒|さむ}＿＿、{毎朝|まいあさ}{散歩|さんぽ}します。　〔Samu__, maiasa sanpo shimasu.〕",
            "answers": [
              "くても"
            ],
            "hint": "さむい → dù"
          },
          {
            "q": "{雨|あめ}＿＿、{中止|ちゅうし}です。　〔Ame __, chuushi desu.〕",
            "answers": [
              "だったら"
            ],
            "hint": "あめ → nếu (N)"
          },
          {
            "q": "{明日|あした}{台風|たいふう}が＿＿そうです。　〔Ashita taifuu ga __ sou desu.〕",
            "answers": [
              "来る",
              "くる"
            ],
            "hint": "きます → thể thường"
          },
          {
            "q": "{日本|にほん}のチームが＿＿そうです。　〔Nihon no chiimu ga __ sou desu.〕",
            "answers": [
              "勝った",
              "かった"
            ],
            "hint": "かちました → thể thường"
          },
          {
            "q": "{来週|らいしゅう}のコンサートは＿＿そうです。　〔Raishuu no konsaato wa __ sou desu.〕",
            "answers": [
              "中止だ",
              "ちゅうしだ"
            ],
            "hint": "ちゅうしです → N + だ"
          },
          {
            "q": "{明日|あした}＿＿、{電話|でんわ}をください。　〔Ashita __, denwa o kudasai.〕",
            "answers": [
              "来たら",
              "きたら"
            ],
            "hint": "きます → nếu (đọc きたら)"
          }
        ]
      },
      {
        "t": "h",
        "text": "V. Đọc hiểu (4 câu · 4 điểm)"
      },
      {
        "t": "passage",
        "title": "V. Đọc hiểu — Tin nhắn của Anna gửi Marco",
        "intro": "Đọc đoạn rồi trả lời 4 câu.",
        "paras": [
          {
            "text": "マルコさん、{日曜日|にちようび}のフリーマーケットのことです。{天気予報|てんきよほう}では、{日曜日|にちようび}は{雨|あめ}だそうです。でも、{少|すこ}し{雨|あめ}が{降|ふ}っても、フリーマーケットはあるそうです。{風|かぜ}が{強|つよ}かったら、{中止|ちゅうし}です。{電車|でんしゃ}は{事故|じこ}で{止|と}まっていますから、バスで{行|い}きましょう。たぶん{人|ひと}が{少|すく}ないと{思|おも}いますから、いいものを{安|やす}く{買|か}うことができると{思|おも}いますよ。アンナ"
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
            "en": "マルコさん、{日曜日|にちようび}のフリーマーケットのことです。",
            "ro": "Maruko-san, nichiyoubi no furiimaaketto no koto desu.",
            "vi": "Marco, về chợ đồ cũ Chủ nhật."
          },
          {
            "en": "{天気予報|てんきよほう}では、{日曜日|にちようび}は{雨|あめ}だそうです。",
            "ro": "Tenkiyohou de wa, nichiyoubi wa ame da sou desu.",
            "vi": "Theo dự báo, nghe nói Chủ nhật mưa."
          },
          {
            "en": "でも、{少|すこ}し{雨|あめ}が{降|ふ}っても、フリーマーケットはあるそうです。",
            "ro": "Demo, sukoshi ame ga futte mo, furiimaaketto wa aru sou desu.",
            "vi": "Nhưng nghe nói dù mưa nhỏ chợ vẫn có."
          },
          {
            "en": "{風|かぜ}が{強|つよ}かったら、{中止|ちゅうし}です。",
            "ro": "Kaze ga tsuyokattara, chuushi desu.",
            "vi": "Nếu gió mạnh thì huỷ."
          },
          {
            "en": "{電車|でんしゃ}は{事故|じこ}で{止|と}まっていますから、バスで{行|い}きましょう。",
            "ro": "Densha wa jiko de tomatte imasu kara, basu de ikimashou.",
            "vi": "Tàu điện đang dừng vì tai nạn, nên đi xe buýt nhé."
          },
          {
            "en": "たぶん{人|ひと}が{少|すく}ないと{思|おも}いますから、いいものを{安|やす}く{買|か}うことができると{思|おも}いますよ。アンナ",
            "ro": "Tabun hito ga sukunai to omoimasu kara, ii mono o yasuku kau koto ga dekiru to omoimasu yo. Anna",
            "vi": "Tôi nghĩ có lẽ ít người nên chắc mua được đồ tốt với giá rẻ đấy. Anna"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-de-v",
        "title": "V. Câu hỏi đọc hiểu",
        "items": [
          {
            "q": "Theo dự báo, Chủ nhật thời tiết thế nào?",
            "options": [
              "Có bão",
              "Mưa",
              "Nắng",
              "Nhiều mây"
            ],
            "correct": 1,
            "why": "日曜日は 雨だ そうです."
          },
          {
            "q": "Nếu mưa nhỏ thì chợ đồ cũ thế nào?",
            "options": [
              "Không nói",
              "Bị huỷ",
              "Hoãn",
              "Vẫn có"
            ],
            "correct": 3,
            "why": "少し 雨が 降っても、ある そうです."
          },
          {
            "q": "Vì sao Anna muốn đi xe buýt?",
            "options": [
              "Ga quá đông",
              "Xe buýt rẻ",
              "Đường trước ga bị chặn",
              "Tàu điện đang dừng vì tai nạn"
            ],
            "correct": 3,
            "why": "電車は 事故で 止まって いますから."
          },
          {
            "q": "Anna đoán gì?",
            "options": [
              "Chắc chắn đông",
              "Có lẽ ít người, sẽ mua được đồ tốt giá rẻ",
              "Không đoán gì",
              "Chợ sẽ bị huỷ"
            ],
            "correct": 1,
            "why": "たぶん 人が 少ないと 思います … 安く 買う ことが できると 思いますよ."
          }
        ]
      },
      {
        "t": "h",
        "text": "VI. Dịch (9 câu · 9 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b15-de-vi-a",
        "title": "VI-a. Dịch Việt → Nhật",
        "kind": "translate",
        "grammar": "119 · 124 · 120 · 121 · 122",
        "items": [
          {
            "q": "Nghe nói mai trời mưa.",
            "answers": [
              "明日は雨だそうです。",
              "明日はあめだそうです。",
              "あしたは雨だそうです。",
              "あしたはあめだそうです。",
              "明日は雨が降るそうです。",
              "明日は雨がふるそうです。",
              "明日はあめが降るそうです。",
              "明日はあめがふるそうです。",
              "あしたは雨が降るそうです。",
              "あしたは雨がふるそうです。",
              "あしたはあめが降るそうです。",
              "あしたはあめがふるそうです。",
              "明日雨が降るそうです。",
              "明日雨がふるそうです。",
              "明日あめが降るそうです。",
              "明日あめがふるそうです。",
              "あした雨が降るそうです。",
              "あした雨がふるそうです。",
              "あしたあめが降るそうです。",
              "あしたあめがふるそうです。"
            ],
            "hint": "そうです"
          },
          {
            "q": "Vì tai nạn mà tàu đã dừng.",
            "answers": [
              "事故で電車が止まりました。",
              "事故で電車がとまりました。",
              "事故ででんしゃが止まりました。",
              "事故ででんしゃがとまりました。",
              "じこで電車が止まりました。",
              "じこで電車がとまりました。",
              "じこででんしゃが止まりました。",
              "じこででんしゃがとまりました。"
            ],
            "hint": "事故で"
          },
          {
            "q": "Nếu có thời gian thì đi cùng không?",
            "answers": [
              "時間があったら、一緒に行きませんか。",
              "時間があったら、一緒にいきませんか。",
              "時間があったら、いっしょに行きませんか。",
              "時間があったら、いっしょにいきませんか。",
              "じかんがあったら、一緒に行きませんか。",
              "じかんがあったら、一緒にいきませんか。",
              "じかんがあったら、いっしょに行きませんか。",
              "じかんがあったら、いっしょにいきませんか。"
            ],
            "hint": "あったら"
          },
          {
            "q": "Dù đắt tôi vẫn muốn mua.",
            "answers": [
              "高くても、買いたいです。",
              "高くても、かいたいです。",
              "たかくても、買いたいです。",
              "たかくても、かいたいです。"
            ],
            "hint": "高くても"
          },
          {
            "q": "Ơ, cửa hàng đóng cửa rồi.",
            "answers": [
              "あっ、店が閉まっています。",
              "あっ、店がしまっています。",
              "あっ、みせが閉まっています。",
              "あっ、みせがしまっています。"
            ],
            "hint": "閉まって います"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-de-vi-b",
        "title": "VI-b. Dịch Nhật → Việt",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {地震|じしん}でビルが{倒|たお}れたそうです。　〔Jishin de biru ga taoreta sou desu.〕",
            "options": [
              "Nghe nói vì động đất mà toà nhà bị đổ.",
              "Dù động đất toà nhà cũng không đổ.",
              "Nếu có động đất thì toà nhà đổ.",
              "Tôi nghĩ động đất sẽ làm toà nhà đổ."
            ],
            "correct": 0,
            "why": "124 + 119."
          },
          {
            "q": "Câu này nghĩa là gì? {雨|あめ}でも、{行|い}きます。　〔Ame demo, ikimasu.〕",
            "options": [
              "Nghe nói mưa nên tôi đi.",
              "Vì mưa nên tôi đi.",
              "Dù mưa tôi vẫn đi.",
              "Nếu mưa thì tôi đi."
            ],
            "correct": 2,
            "why": "121: N でも."
          },
          {
            "q": "Câu này nghĩa là gì? きっと{勝|か}つと{思|おも}います。　〔Kitto katsu to omoimasu.〕",
            "options": [
              "Tôi nghĩ có lẽ sẽ thắng.",
              "Nếu thắng thì tốt.",
              "Tôi nghĩ chắc chắn sẽ thắng.",
              "Nghe nói đã thắng."
            ],
            "correct": 2,
            "why": "123: きっと = chắc chắn."
          },
          {
            "q": "Câu này nghĩa là gì? {入|い}り{口|ぐち}に{人|ひと}がたくさん{並|なら}んでいます。　〔Iriguchi ni hito ga takusan narande imasu.〕",
            "options": [
              "Ở cửa vào không có ai.",
              "Nghe nói ở cửa vào sẽ đông.",
              "Ở cửa vào có nhiều người đang xếp hàng.",
              "Hãy xếp hàng ở cửa vào."
            ],
            "correct": 2,
            "why": "122: trạng thái."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b15-on-tong",
    "kind": "review",
    "title": "Luyện thêm Bài 15 · ÔN TỔNG Bài 11–15 (bài cuối sách) — đủ dạng, có bảng \"sai câu nào ôn bài nào\" (~103 câu · 75 phút)",
    "goal": "Ôn trọn 5 bài cuối sách できる日本語 初級 (Bài 11–15): từ vựng, chữ Hán của lớp, 27 điểm ngữ pháp (ポイント 98–124), chia thể て／た／ない／thể thường／たら／ても, đọc hiểu, đọc không furigana, dịch, tình huống — mỗi câu ghi rõ thuộc bài nào để biết mình cần ôn lại bài nào trước kỳ thi.",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đây là **đề ôn tổng 5 bài cuối sách** (Bài 11 私の生活 · 12 病気・けが · 13 私のおすすめ · 14 国の習慣 · 15 テレビ・雑誌から). **Bấm giờ 75 phút**, làm một lượt không mở bài; mỗi câu có nhãn **[Bài N]** để biết câu đó thuộc bài nào.",
          "Đi **🟢 → 🟡 → 🔴**: 🟢 từ vựng + chữ Hán (nhận mặt) · 🟡 ngữ pháp từng bài + gõ chia thể · 🔴 đọc hiểu, đọc không furigana, dịch, tình huống trộn nhiều bài. Câu chưa chắc thì đánh dấu, làm hết rồi mới quay lại.",
          "Chấm xong, dò **bảng \"Sai câu nào ôn bài nào\"** bên dưới: bài nào sai ≥ 3 câu thì quay lại lesson Ngữ pháp + Luyện thêm của bài đó, làm lại từ mức 🟡, rồi làm lại đề này sau 3 ngày."
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
            "Từ vựng Bài 11–15 — điền từ vào câu",
            "15",
            "15"
          ],
          [
            "II",
            "Chữ Hán của lớp Bài 11–15 — đọc / chọn cách viết",
            "15",
            "15"
          ],
          [
            "III",
            "Ngữ pháp từng bài (ポイント 98–124)",
            "30",
            "30"
          ],
          [
            "IV",
            "Gõ chia thể (て · た · ない · thể thường · たら · ても)",
            "12",
            "12"
          ],
          [
            "V",
            "Đọc hiểu — thư dài trộn 5 bài",
            "6",
            "6"
          ],
          [
            "VI",
            "Đọc to câu KHÔNG furigana",
            "5",
            "5"
          ],
          [
            "VII",
            "Dịch Việt → Nhật (8) · Nhật → Việt (6)",
            "14",
            "14"
          ],
          [
            "VIII",
            "Tình huống — nói câu nào?",
            "6",
            "6"
          ],
          [
            "Tổng",
            "",
            "103",
            "103"
          ]
        ],
        "caption": "Cấu trúc đề ôn tổng Bài 11–15"
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
            "≥ 88 / 103 (≥ 85%)",
            "Sẵn sàng thi cuối kỳ phần Bài 11–15",
            "Làm đề tổng hợp từng bài một lượt nữa sau 1 tuần để giữ"
          ],
          [
            "72–87 (70–85%)",
            "Khá, còn sơ hở",
            "Dò bảng dưới, ôn bài sai nhiều nhất ở mức 🟡 → làm lại đề sau 3 ngày"
          ],
          [
            "< 72 (< 70%)",
            "Chưa chắc",
            "Ôn lại từng bài theo thứ tự 11 → 15 (Ngữ pháp + Luyện thêm), mỗi ngày 1 bài, rồi làm lại đề"
          ]
        ],
        "caption": "Thang điểm tự chấm"
      },
      {
        "t": "table",
        "head": [
          "Sai câu nào",
          "Thuộc bài",
          "Ôn lại phần nào"
        ],
        "rows": [
          [
            "I.1–3 · II.1–3 · III.1–6 · IV.1–2",
            "Bài 11 — 私の生活",
            "Từ vựng · Chữ Hán (起寝働始終住通活初忘慣卒) · ポイント 98–103: Vています (thói quen) · ～たり～たりします · N1は～が、N2は～ · ～とき · 友達言葉 → lesson Ngữ pháp Bài 11 + Luyện thêm Bài 11"
          ],
          [
            "I.4–6 · II.4–6 · III.7–11 · IV.3–4",
            "Bài 12 — 病気・けが",
            "Từ vựng · Chữ Hán (病院医者体頭薬熱痛歯悪治) · ポイント 104–107: ～んです · Vた／Vないほうがいいです · ～前に · Vてから → Ngữ pháp Bài 12 + Luyện thêm Bài 12"
          ],
          [
            "I.7–9 · II.7–9 · III.12–17 · IV.5–6",
            "Bài 13 — 私のおすすめ",
            "Từ vựng · Chữ Hán (赤青黄色若売知場所品全部) · ポイント 108–112: Vたことがあります · 普通形＋N · Vています (mặc / đội / đeo) · 知っています／知りません · N1というN2 → Ngữ pháp Bài 13 + Luyện thêm Bài 13"
          ],
          [
            "I.10–12 · II.10–12 · III.18–23 · IV.7–9",
            "Bài 14 — 国の習慣",
            "Từ vựng · Chữ Hán (空字思便利不同笑経験化手) · ポイント 113–118: V辞書形と · ～てはいけません · ～なければなりません · ～なくてもいいです · ～と思います · 「～」と言います → Ngữ pháp Bài 14 + Luyện thêm Bài 14"
          ],
          [
            "I.13–15 · II.13–15 · III.24–30 · IV.10–12",
            "Bài 15 — テレビ・雑誌から",
            "Từ vựng · Chữ Hán (天気晴雨曇降台震事故急心) · ポイント 119–124: 普通形そうです · N で · ～たら · ～ても · きっと／たぶん～と思います · Vています (trạng thái) → Luyện thêm Bài 15 (Thể たら · ても · そうです + Ngữ pháp 1–3)"
          ],
          [
            "V · VI · VII · VIII",
            "Trộn nhiều bài",
            "Mỗi câu có nhãn [Bài N] — câu trộn ghi nhiều bài (vd [Bài 12+15]): ôn bài có điểm ngữ pháp bị sai trong lời giải"
          ]
        ],
        "caption": "Sai câu nào ôn bài nào — số câu tính theo thứ tự trong từng phần"
      },
      {
        "t": "recap",
        "title": "Cả 5 bài trong 10 dòng",
        "items": [
          "**B11**: 毎朝 ジョギングを して います · 映画を 見たり、買い物を したり します · 肉は 好きですが、魚は 好きじゃ ありません · 子どもの とき · 行く？ うん、行く.",
          "**B12**: 頭が 痛いんです · 早く 寝た ほうが いいです · お風呂に 入らない ほうが いいです · 寝る 前に · 手を 洗ってから.",
          "**B13**: 相撲を 見た ことが あります · 母が 作った ケーキ · 帽子を かぶって いる 人 · 知って います／知りません · 「さくら」という 店.",
          "**B14**: 押すと、ドアが 開きます · 撮っては いけません · 脱がなければ なりません · 払わなくて も いいです · 便利だと 思います · 「いただきます」と 言います.",
          "**B15**: 台風が 来るそうです · 事故で 止まりました · 晴れたら · 雨でも · きっと 混んで いると 思います · 店が 閉まって います."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · I. Từ vựng (15 câu) · II. Chữ Hán (15 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b15-ot-i",
        "title": "I. Từ vựng Bài 11–15 (15 câu)",
        "items": [
          {
            "q": "[Bài 11] {日本|にほん}の{生活|せいかつ}にもう＿＿か。　〔Nihon no seikatsu ni mou __ ka.〕　— Bạn đã quen với cuộc sống ở Nhật chưa?",
            "options": [
              "{通|かよ}いました",
              "{終|お}わりました",
              "{慣|な}れました",
              "{忘|わす}れました"
            ],
            "correct": 2,
            "why": "Quen với N = N に 慣れます. → **{日本|にほん}の{生活|せいかつ}にもう{慣|な}れましたか。** 〔Nihon no seikatsu ni mou naremashita ka.〕 — Bạn đã quen với cuộc sống ở Nhật chưa?"
          },
          {
            "q": "[Bài 11] {一人|ひとり}{暮|ぐ}らしはちょっと＿＿です。　〔Hitorigurashi wa chotto __ desu.〕　— Sống một mình hơi cô đơn.",
            "options": [
              "{若|わか}い",
              "かゆい",
              "{寂|さび}しい",
              "{眠|ねむ}い"
            ],
            "correct": 2,
            "why": "Cô đơn = 寂しい. → **{一人|ひとり}{暮|ぐ}らしはちょっと{寂|さび}しいです。** 〔Hitorigurashi wa chotto sabishii desu.〕 — Sống một mình hơi cô đơn."
          },
          {
            "q": "[Bài 11] {来年|らいねん}、{大学|だいがく}を＿＿。　〔Rainen, daigaku o __.〕　— Năm sau tôi tốt nghiệp đại học.",
            "options": [
              "{入学|にゅうがく}します",
              "{散歩|さんぽ}します",
              "{入院|にゅういん}します",
              "{卒業|そつぎょう}します"
            ],
            "correct": 3,
            "why": "Tốt nghiệp trường = 大学を 卒業します. → **{来年|らいねん}、{大学|だいがく}を{卒業|そつぎょう}します。** 〔Rainen, daigaku o sotsugyou shimasu.〕 — Năm sau tôi tốt nghiệp đại học."
          },
          {
            "q": "[Bài 12] {熱|ねつ}が{三十八度|さんじゅうはちど}＿＿あります。　〔Netsu ga sanjuuhachido __ arimasu.〕　— Tôi sốt tới 38 độ.",
            "options": [
              "も",
              "に",
              "が",
              "を"
            ],
            "correct": 0,
            "why": "～度も = tới tận ~ độ (nhấn mạnh nhiều). → **{熱|ねつ}が{三十八度|さんじゅうはちど}もあります。** 〔Netsu ga sanjuuhachido mo arimasu.〕 — Tôi sốt tới 38 độ."
          },
          {
            "q": "[Bài 12] サッカーの{練習|れんしゅう}で＿＿をしました。　〔Sakkaa no renshuu de __ o shimashita.〕　— Tôi bị thương khi tập bóng đá.",
            "options": [
              "けが",
              "やけど",
              "{食欲|しょくよく}",
              "{病気|びょうき}"
            ],
            "correct": 0,
            "why": "Bị thương = けがを します. → **サッカーの{練習|れんしゅう}でけがをしました。** 〔Sakkaa no renshuu de kega o shimashita.〕 — Tôi bị thương khi tập bóng đá."
          },
          {
            "q": "[Bài 12] A：{大丈夫|だいじょうぶ}ですか。B：ええ、＿＿、もう{元気|げんき}です。　〔A: daijoubu desu ka. B: ee, __, mou genki desu.〕　— A: Bạn có sao không? B: Vâng, nhờ trời, giờ khoẻ rồi.",
            "options": [
              "お{大事|だいじ}に",
              "それはいけませんね",
              "おかげさまで",
              "いただきます"
            ],
            "correct": 2,
            "why": "Đáp lời hỏi thăm khi đã ổn = おかげさまで. → **A：{大丈夫|だいじょうぶ}ですか。B：ええ、おかげさまで、もう{元気|げんき}です。** 〔A: daijoubu desu ka. B: ee, okagesamade, mou genki desu.〕 — A: Bạn có sao không? B: Vâng, nhờ trời, giờ khoẻ rồi."
          },
          {
            "q": "[Bài 13] あの{店|みせ}は{若|わか}い{人|ひと}に＿＿があります。　〔Ano mise wa wakai hito ni __ ga arimasu.〕　— Quán kia được giới trẻ yêu thích.",
            "options": [
              "{場所|ばしょ}",
              "サービス",
              "{人気|にんき}",
              "{材料|ざいりょう}"
            ],
            "correct": 2,
            "why": "Được yêu thích = 人気が あります. → **あの{店|みせ}は{若|わか}い{人|ひと}に{人気|にんき}があります。** 〔Ano mise wa wakai hito ni ninki ga arimasu.〕 — Quán kia được giới trẻ yêu thích."
          },
          {
            "q": "[Bài 13] {夏|なつ}のお{祭|まつ}りで＿＿を{着|き}ました。　〔Natsu no omatsuri de __ o kimashita.〕　— Ở lễ hội mùa hè tôi đã mặc yukata.",
            "options": [
              "{帽子|ぼうし}",
              "{浴衣|ゆかた}",
              "スカート",
              "{眼鏡|めがね}"
            ],
            "correct": 1,
            "why": "Mặc yukata = 浴衣を 着ます. → **{夏|なつ}のお{祭|まつ}りで{浴衣|ゆかた}を{着|き}ました。** 〔Natsu no omatsuri de yukata o kimashita.〕 — Ở lễ hội mùa hè tôi đã mặc yukata."
          },
          {
            "q": "[Bài 13] {眼鏡|めがね}を＿＿いる{人|ひと}が{田中|たなか}さんです。　〔Megane o __ iru hito ga Tanaka-san desu.〕　— Người đang đeo kính là anh Tanaka.",
            "options": [
              "かけて",
              "{着|き}て",
              "はいて",
              "かぶって"
            ],
            "correct": 0,
            "why": "Đeo kính = 眼鏡を かけます. → **{眼鏡|めがね}をかけている{人|ひと}が{田中|たなか}さんです。** 〔Megane o kakete iru hito ga Tanaka-san desu.〕 — Người đang đeo kính là anh Tanaka."
          },
          {
            "q": "[Bài 14] {日本|にほん}のうちでは、＿＿で{靴|くつ}を{脱|ぬ}ぎます。　〔Nihon no uchi de wa, __ de kutsu o nugimasu.〕　— Ở nhà Nhật người ta cởi giày ở hiên.",
            "options": [
              "{交通|こうつう}",
              "{玄関|げんかん}",
              "{以下|いか}",
              "{田舎|いなか}"
            ],
            "correct": 1,
            "why": "Hiên vào nhà = 玄関. → **{日本|にほん}のうちでは、{玄関|げんかん}で{靴|くつ}を{脱|ぬ}ぎます。** 〔Nihon no uchi de wa, genkan de kutsu o nugimasu.〕 — Ở nhà Nhật người ta cởi giày ở hiên."
          },
          {
            "q": "[Bài 14] {田舎|いなか}はバスが{少|すく}ないですから、＿＿です。　〔Inaka wa basu ga sukunai desu kara, __ desu.〕　— Ở quê xe buýt ít nên bất tiện.",
            "options": [
              "{不便|ふべん}",
              "{自由|じゆう}",
              "おしゃれ",
              "{便利|べんり}"
            ],
            "correct": 0,
            "why": "Bất tiện = 不便. → **{田舎|いなか}はバスが{少|すく}ないですから、{不便|ふべん}です。** 〔Inaka wa basu ga sukunai desu kara, fuben desu.〕 — Ở quê xe buýt ít nên bất tiện."
          },
          {
            "q": "[Bài 14] {六歳|ろくさい}{以下|いか}の{子|こ}どもは＿＿を{払|はら}わなくてもいいです。　〔Rokusai ika no kodomo wa __ o harawanakute mo ii desu.〕　— Trẻ từ 6 tuổi trở xuống không cần trả phí vào cửa.",
            "options": [
              "お{釣|つ}り",
              "{入場料|にゅうじょうりょう}",
              "{時給|じきゅう}",
              "{空気|くうき}"
            ],
            "correct": 1,
            "why": "Phí vào cửa = 入場料. → **{六歳|ろくさい}{以下|いか}の{子|こ}どもは{入場料|にゅうじょうりょう}を{払|はら}わなくてもいいです。** 〔Rokusai ika no kodomo wa nyuujouryou o harawanakute mo ii desu.〕 — Trẻ từ 6 tuổi trở xuống không cần trả phí vào cửa."
          },
          {
            "q": "[Bài 15] {大|おお}きい＿＿が{来|く}るそうです。　〔Ookii __ ga kuru sou desu.〕　— Nghe nói bão lớn sắp đến.",
            "options": [
              "ガラス",
              "{台風|たいふう}",
              "{事故|じこ}",
              "{夕方|ゆうがた}"
            ],
            "correct": 1,
            "why": "Bão = 台風. → **{大|おお}きい{台風|たいふう}が{来|く}るそうです。** 〔Ookii taifuu ga kuru sou desu.〕 — Nghe nói bão lớn sắp đến."
          },
          {
            "q": "[Bài 15] {土曜日|どようび}は{店|みせ}が＿＿います。　〔Doyoubi wa mise ga __ imasu.〕　— Thứ Bảy cửa hàng đông.",
            "options": [
              "{混|こ}んで",
              "{晴|は}れて",
              "{急|いそ}いで",
              "すいて"
            ],
            "correct": 0,
            "why": "Đông = 混んで います. → **{土曜日|どようび}は{店|みせ}が{混|こ}んでいます。** 〔Doyoubi wa mise ga konde imasu.〕 — Thứ Bảy cửa hàng đông."
          },
          {
            "q": "[Bài 15] {急|いそ}いだら、{九時|くじ}の{電車|でんしゃ}に＿＿と{思|おも}います。　〔Isoidara, kuji no densha ni __ to omoimasu.〕　— Tôi nghĩ nếu nhanh lên thì kịp tàu 9 giờ.",
            "options": [
              "{集|あつ}まる",
              "{負|ま}ける",
              "{始|はじ}まる",
              "{間|ま}に{合|あ}う"
            ],
            "correct": 3,
            "why": "Kịp = 間に合います. → **{急|いそ}いだら、{九時|くじ}の{電車|でんしゃ}に{間|ま}に{合|あ}うと{思|おも}います。** 〔Isoidara, kuji no densha ni maniau to omoimasu.〕 — Tôi nghĩ nếu nhanh lên thì kịp tàu 9 giờ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ot-ii",
        "title": "II. Chữ Hán của lớp Bài 11–15 (15 câu)",
        "items": [
          {
            "q": "[Bài 11] Đọc đúng: 毎朝 六時に【起】きます。",
            "options": [
              "た",
              "き",
              "お",
              "ね"
            ],
            "correct": 2,
            "why": "起きます = おきます (Bài 11)."
          },
          {
            "q": "[Bài 11] Đọc đúng: 来年 大学を【卒業】します。",
            "options": [
              "しゅつぎょう",
              "そつぎょう",
              "そつごう",
              "そつぎょ"
            ],
            "correct": 1,
            "why": "卒業 = そつぎょう."
          },
          {
            "q": "[Bài 11] Chọn cách viết đúng: すんで います (đang sống)",
            "options": [
              "注んで",
              "柱んで",
              "住んで",
              "往んで"
            ],
            "correct": 2,
            "why": "住 = 亻 + 主 (người + chủ: nơi người ở). 注 có bộ 氵."
          },
          {
            "q": "[Bài 12] Đọc đúng: 【病院】へ 行きました。",
            "options": [
              "やまいいん",
              "びょういい",
              "びょういん",
              "びよういん"
            ],
            "correct": 2,
            "why": "病院 = びょういん (khác 美容院 びよういん)."
          },
          {
            "q": "[Bài 12] Đọc đúng: 【薬】を 飲みます。",
            "options": [
              "やく",
              "くずり",
              "くすり",
              "すり"
            ],
            "correct": 2,
            "why": "薬 = くすり."
          },
          {
            "q": "[Bài 12] Chọn cách viết đúng: いたい (đau)",
            "options": [
              "病い",
              "疲い",
              "通い",
              "痛い"
            ],
            "correct": 3,
            "why": "痛 = 疒 + 甬. 病 cũng bộ 疒 nhưng là \"bệnh\"; 通 (Bài 11) có bộ 辶."
          },
          {
            "q": "[Bài 13] Đọc đúng: 【黄色】い シャツ",
            "options": [
              "きしょく",
              "きいろ",
              "おういろ",
              "こうしょく"
            ],
            "correct": 1,
            "why": "黄色い = きいろい."
          },
          {
            "q": "[Bài 13] Đọc đúng: パーティーの【場所】は どこですか。",
            "options": [
              "ばところ",
              "ばしょう",
              "ばしょ",
              "じょうしょ"
            ],
            "correct": 2,
            "why": "場所 = ばしょ."
          },
          {
            "q": "[Bài 13] Chọn cách viết đúng: うって います (đang bán)",
            "options": [
              "買って",
              "売って",
              "読って",
              "続って"
            ],
            "correct": 1,
            "why": "売 (bán) ≠ 買 (mua, Bài 5). 読 = 言 + 売."
          },
          {
            "q": "[Bài 14] Đọc đúng: コンビニは【便利】です。",
            "options": [
              "びんり",
              "べんい",
              "へんり",
              "べんり"
            ],
            "correct": 3,
            "why": "便利 = べんり."
          },
          {
            "q": "[Bài 14] Đọc đúng: いろいろな ことを【経験】しました。",
            "options": [
              "きょうけん",
              "けいけん",
              "けけん",
              "けいげん"
            ],
            "correct": 1,
            "why": "経験 = けいけん."
          },
          {
            "q": "[Bài 14] Chọn cách viết đúng: おなじ (giống nhau)",
            "options": [
              "同じ",
              "司じ",
              "向じ",
              "回じ"
            ],
            "correct": 0,
            "why": "同 = 冂 + 一 + 口."
          },
          {
            "q": "[Bài 15] Đọc đúng: 明日の【天気】は どうですか。",
            "options": [
              "でんき",
              "あまき",
              "てんき",
              "てんけ"
            ],
            "correct": 2,
            "why": "天気 = てんき."
          },
          {
            "q": "[Bài 15] Đọc đúng: 大きい【地震】が ありました。",
            "options": [
              "じしん",
              "ちしん",
              "ちじん",
              "じじん"
            ],
            "correct": 0,
            "why": "地震 = じしん."
          },
          {
            "q": "[Bài 15] Chọn cách viết đúng: いそいで (vội)",
            "options": [
              "急いで",
              "意いで",
              "忘いで",
              "思いで"
            ],
            "correct": 0,
            "why": "急 = ⺈ + ヨ + 心."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · III. Ngữ pháp từng bài (30 câu) · IV. Gõ chia thể (12 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b15-ot-iii",
        "title": "III. Ngữ pháp Bài 11–15 (30 câu)",
        "items": [
          {
            "q": "[Bài 11] {今|いま}、{日本語|にほんご}の{学校|がっこう}に＿＿います。　〔Ima, Nihongo no gakkou ni __ imasu.〕　— Bây giờ tôi đang theo học trường tiếng Nhật.",
            "options": [
              "{通|かよ}って",
              "{通|かよ}う",
              "{通|かよ}い",
              "{通|かよ}った"
            ],
            "correct": 0,
            "why": "ポイント 98: Vて います (việc làm trong giai đoạn này). → **{今|いま}、{日本語|にほんご}の{学校|がっこう}に{通|かよ}っています。** 〔Ima, Nihongo no gakkou ni kayotte imasu.〕 — Bây giờ tôi đang theo học trường tiếng Nhật."
          },
          {
            "q": "[Bài 11] {週末|しゅうまつ}は{映画|えいが}を{見|み}たり、{買|か}い{物|もの}を＿＿します。　〔Shuumatsu wa eiga o mitari, kaimono o __ shimasu.〕　— Cuối tuần tôi nào xem phim, nào đi mua sắm.",
            "options": [
              "して",
              "する",
              "した",
              "したり"
            ],
            "correct": 3,
            "why": "ポイント 99: Vたり Vたり します. → **{週末|しゅうまつ}は{映画|えいが}を{見|み}たり、{買|か}い{物|もの}をしたりします。** 〔Shuumatsu wa eiga o mitari, kaimono o shitari shimasu.〕 — Cuối tuần tôi nào xem phim, nào đi mua sắm."
          },
          {
            "q": "[Bài 11] {肉|にく}は{好|す}きですが、{魚|さかな}＿＿あまり{好|す}きじゃありません。　〔Niku wa suki desu ga, sakana __ amari suki ja arimasen.〕　— Thịt thì tôi thích, còn cá thì không thích lắm.",
            "options": [
              "が",
              "を",
              "も",
              "は"
            ],
            "correct": 3,
            "why": "ポイント 100: N1は ～が、N2は ～ (đối chiếu). → **{肉|にく}は{好|す}きですが、{魚|さかな}はあまり{好|す}きじゃありません。** 〔Niku wa suki desu ga, sakana wa amari suki ja arimasen.〕 — Thịt thì tôi thích, còn cá thì không thích lắm."
          },
          {
            "q": "[Bài 11] {子|こ}ども＿＿とき、よく{川|かわ}で{泳|およ}ぎました。　〔Kodomo __ toki, yoku kawa de oyogimashita.〕　— Hồi nhỏ tôi hay bơi ở sông.",
            "options": [
              "の",
              "で",
              "な",
              "だ"
            ],
            "correct": 0,
            "why": "ポイント 101: N の とき. → **{子|こ}どものとき、よく{川|かわ}で{泳|およ}ぎました。** 〔Kodomo no toki, yoku kawa de oyogimashita.〕 — Hồi nhỏ tôi hay bơi ở sông."
          },
          {
            "q": "[Bài 11] {暇|ひま}＿＿とき、{何|なに}をしますか。　〔Hima __ toki, nani o shimasu ka.〕　— Lúc rảnh bạn làm gì?",
            "options": [
              "で",
              "な",
              "だ",
              "の"
            ],
            "correct": 1,
            "why": "ポイント 101–102: ナA な とき. → **{暇|ひま}なとき、{何|なに}をしますか。** 〔Hima na toki, nani o shimasu ka.〕 — Lúc rảnh bạn làm gì?"
          },
          {
            "q": "[Bài 11] Nói với bạn thân: \"Mai bạn có đến trường không?\" (ポイント 103)",
            "options": [
              "{明日|あした}、{学校|がっこう}{来|く}る？ (Ashita, gakkou kuru?)",
              "{明日|あした}、{学校|がっこう}{来|こ}る？ (Ashita, gakkou koru?)",
              "{明日|あした}、{学校|がっこう}に{来|き}ますか。 (Ashita, gakkou ni kimasu ka.)",
              "{明日|あした}、{学校|がっこう}{来|き}る？ (Ashita, gakkou kiru?)"
            ],
            "correct": 0,
            "why": "友達言葉: thể thường 来る + lên giọng (không か, có thể bỏ trợ từ)."
          },
          {
            "q": "[Bài 12] A：どうしたんですか。B：{頭|あたま}が{痛|いた}い＿＿。　〔A: dou shita n desu ka. B: atama ga itai __.〕　— A: Bạn sao thế? B: Tôi bị đau đầu.",
            "options": [
              "んです",
              "ますんです",
              "だんです",
              "なんです"
            ],
            "correct": 0,
            "why": "ポイント 104: イA + んです (giải thích). → **A：どうしたんですか。B：{頭|あたま}が{痛|いた}いんです。** 〔A: dou shita n desu ka. B: atama ga itai n desu.〕 — A: Bạn sao thế? B: Tôi bị đau đầu."
          },
          {
            "q": "[Bài 12] {熱|ねつ}がありますから、{早|はや}く＿＿ほうがいいですよ。　〔Netsu ga arimasu kara, hayaku __ hou ga ii desu yo.〕　— Bạn bị sốt nên đi ngủ sớm thì hơn.",
            "options": [
              "{寝|ね}た",
              "{寝|ね}る",
              "{寝|ね}ます",
              "{寝|ね}て"
            ],
            "correct": 0,
            "why": "ポイント 105: Vた ほうが いいです (khuyên nên). → **{熱|ねつ}がありますから、{早|はや}く{寝|ね}たほうがいいですよ。** 〔Netsu ga arimasu kara, hayaku neta hou ga ii desu yo.〕 — Bạn bị sốt nên đi ngủ sớm thì hơn."
          },
          {
            "q": "[Bài 12] {今日|きょう}はお{風呂|ふろ}に＿＿ほうがいいです。　〔Kyou wa ofuro ni __ hou ga ii desu.〕　— Hôm nay bạn không nên tắm bồn.",
            "options": [
              "{入|はい}りない",
              "{入|はい}らない",
              "{入|はい}って",
              "{入|はい}らなかった"
            ],
            "correct": 1,
            "why": "ポイント 105: Vない ほうが いいです (khuyên không nên). → **{今日|きょう}はお{風呂|ふろ}に{入|はい}らないほうがいいです。** 〔Kyou wa ofuro ni hairanai hou ga ii desu.〕 — Hôm nay bạn không nên tắm bồn."
          },
          {
            "q": "[Bài 12] {寝|ね}る＿＿、この{薬|くすり}を{飲|の}んでください。　〔Neru __, kono kusuri o nonde kudasai.〕　— Trước khi ngủ hãy uống thuốc này.",
            "options": [
              "{後|あと}に",
              "たら",
              "から",
              "{前|まえ}に"
            ],
            "correct": 3,
            "why": "ポイント 106: V辞書形 前に. → **{寝|ね}る{前|まえ}に、この{薬|くすり}を{飲|の}んでください。** 〔Neru mae ni, kono kusuri o nonde kudasai.〕 — Trước khi ngủ hãy uống thuốc này."
          },
          {
            "q": "[Bài 12] {手|て}を{洗|あら}って＿＿、{食|た}べましょう。　〔Te o aratte __, tabemashou.〕　— Rửa tay xong rồi mới ăn nhé.",
            "options": [
              "{前|まえ}に",
              "と",
              "から",
              "ても"
            ],
            "correct": 2,
            "why": "ポイント 107: Vて から (làm xong rồi mới). → **{手|て}を{洗|あら}ってから、{食|た}べましょう。** 〔Te o aratte kara, tabemashou.〕 — Rửa tay xong rồi mới ăn nhé."
          },
          {
            "q": "[Bài 13] {相撲|すもう}を＿＿ことがありますか。　〔Sumou o __ koto ga arimasu ka.〕　— Bạn đã từng xem sumo chưa?",
            "options": [
              "{見|み}て",
              "{見|み}る",
              "{見|み}た",
              "{見|み}ました"
            ],
            "correct": 2,
            "why": "ポイント 108: Vた ことが あります. → **{相撲|すもう}を{見|み}たことがありますか。** 〔Sumou o mita koto ga arimasu ka.〕 — Bạn đã từng xem sumo chưa?"
          },
          {
            "q": "[Bài 13] これは{母|はは}が＿＿ケーキです。　〔Kore wa haha ga __ keeki desu.〕　— Đây là bánh mẹ tôi làm.",
            "options": [
              "{作|つく}って",
              "{作|つく}りました",
              "{作|つく}った",
              "{作|つく}ったの"
            ],
            "correct": 2,
            "why": "ポイント 109: thể thường + N. → **これは{母|はは}が{作|つく}ったケーキです。** 〔Kore wa haha ga tsukutta keeki desu.〕 — Đây là bánh mẹ tôi làm."
          },
          {
            "q": "[Bài 13] あの{帽子|ぼうし}を＿＿いる{人|ひと}はだれですか。　〔Ano boushi o __ iru hito wa dare desu ka.〕　— Người đang đội mũ kia là ai?",
            "options": [
              "はいて",
              "かぶって",
              "かけて",
              "{着|き}て"
            ],
            "correct": 1,
            "why": "ポイント 110: đội mũ = かぶって います. → **あの{帽子|ぼうし}をかぶっている{人|ひと}はだれですか。** 〔Ano boushi o kabutte iru hito wa dare desu ka.〕 — Người đang đội mũ kia là ai?"
          },
          {
            "q": "[Bài 13] A：いいホテルを{知|し}っていますか。B：いいえ、＿＿。　〔A: ii hoteru o shitte imasu ka. B: iie, __.〕　— A: Bạn biết khách sạn nào tốt không? B: Không, tôi không biết.",
            "options": [
              "{知|し}っていません",
              "{知|し}りません",
              "{知|し}るません",
              "{知|し}ってありません"
            ],
            "correct": 1,
            "why": "ポイント 111: phủ định là 知りません. → **A：いいホテルを{知|し}っていますか。B：いいえ、{知|し}りません。** 〔A: ii hoteru o shitte imasu ka. B: iie, shirimasen.〕 — A: Bạn biết khách sạn nào tốt không? B: Không, tôi không biết."
          },
          {
            "q": "[Bài 13] 「さくら」＿＿{店|みせ}を{知|し}っていますか。　〔\"Sakura\" __ mise o shitte imasu ka.〕　— Bạn có biết quán tên là \"Sakura\" không?",
            "options": [
              "の",
              "という",
              "がいう",
              "と{言|い}います"
            ],
            "correct": 1,
            "why": "ポイント 112: N1 という N2. → **「さくら」という{店|みせ}を{知|し}っていますか。** 〔\"Sakura\" to iu mise o shitte imasu ka.〕 — Bạn có biết quán tên là \"Sakura\" không?"
          },
          {
            "q": "[Bài 13] {北海道|ほっかいどう}へは{一回|いっかい}も＿＿ことがありません。　〔Hokkaidou e wa ikkai mo __ koto ga arimasen.〕　— Tôi chưa từng đến Hokkaido lần nào.",
            "options": [
              "{行|い}って",
              "{行|い}かない",
              "{行|い}った",
              "{行|い}く"
            ],
            "correct": 2,
            "why": "ポイント 108: 一回も Vた ことが ありません. → **{北海道|ほっかいどう}へは{一回|いっかい}も{行|い}ったことがありません。** 〔Hokkaidou e wa ikkai mo itta koto ga arimasen.〕 — Tôi chưa từng đến Hokkaido lần nào."
          },
          {
            "q": "[Bài 14] このボタンを＿＿と、ドアが{開|あ}きます。　〔Kono botan o __ to, doa ga akimasu.〕　— Bấm nút này thì cửa mở.",
            "options": [
              "{押|お}して",
              "{押|お}す",
              "{押|お}した",
              "{押|お}します"
            ],
            "correct": 1,
            "why": "ポイント 113: V辞書形 と. → **このボタンを{押|お}すと、ドアが{開|あ}きます。** 〔Kono botan o osu to, doa ga akimasu.〕 — Bấm nút này thì cửa mở."
          },
          {
            "q": "[Bài 14] ここで{写真|しゃしん}を{撮|と}って＿＿いけません。　〔Koko de shashin o totte __ ikemasen.〕　— Không được chụp ảnh ở đây.",
            "options": [
              "も",
              "を",
              "が",
              "は"
            ],
            "correct": 3,
            "why": "ポイント 114: Vて は いけません. → **ここで{写真|しゃしん}を{撮|と}ってはいけません。** 〔Koko de shashin o totte wa ikemasen.〕 — Không được chụp ảnh ở đây."
          },
          {
            "q": "[Bài 14] {玄関|げんかん}で{靴|くつ}を{脱|ぬ}が＿＿なりません。　〔Genkan de kutsu o nuga __ narimasen.〕　— Phải cởi giày ở hiên.",
            "options": [
              "なければ",
              "なくても",
              "ないければ",
              "なくて"
            ],
            "correct": 0,
            "why": "ポイント 115: Vない (bỏ い) + ければ なりません. → **{玄関|げんかん}で{靴|くつ}を{脱|ぬ}がなければなりません。** 〔Genkan de kutsu o nuga nakereba narimasen.〕 — Phải cởi giày ở hiên."
          },
          {
            "q": "[Bài 14] A：{予約|よやく}しなければなりませんか。B：いいえ、＿＿。　〔A: yoyaku shinakereba narimasen ka. B: iie, __.〕　— A: Có phải đặt trước không? B: Không, không cần.",
            "options": [
              "しないくてもいいです",
              "しなくてもいいです",
              "しなければなりません",
              "してはいけません"
            ],
            "correct": 1,
            "why": "ポイント 116: trả lời \"không cần\" → なくて も いいです. → **A：{予約|よやく}しなければなりませんか。B：いいえ、しなくてもいいです。** 〔A: yoyaku shinakereba narimasen ka. B: iie, shinakute mo ii desu.〕 — A: Có phải đặt trước không? B: Không, không cần."
          },
          {
            "q": "[Bài 14] {都会|とかい}は{便利|べんり}＿＿{思|おも}います。　〔Tokai wa benri __ omoimasu.〕　— Tôi nghĩ thành phố tiện lợi.",
            "options": [
              "だと",
              "なと",
              "ですと",
              "と"
            ],
            "correct": 0,
            "why": "ポイント 117: ナA + だ と 思います. → **{都会|とかい}は{便利|べんり}だと{思|おも}います。** 〔Tokai wa benri da to omoimasu.〕 — Tôi nghĩ thành phố tiện lợi."
          },
          {
            "q": "[Bài 14] {食|た}べる{前|まえ}に「いただきます」＿＿{言|い}います。　〔Taberu mae ni \"itadakimasu\" __ iimasu.〕　— Trước khi ăn người ta nói \"itadakimasu\".",
            "options": [
              "が",
              "に",
              "と",
              "を"
            ],
            "correct": 2,
            "why": "ポイント 118: 「～」と 言います. → **{食|た}べる{前|まえ}に「いただきます」と{言|い}います。** 〔Taberu mae ni \"itadakimasu\" to iimasu.〕 — Trước khi ăn người ta nói \"itadakimasu\"."
          },
          {
            "q": "[Bài 15] {明日|あした}、{台風|たいふう}が＿＿そうです。　〔Ashita, taifuu ga __ sou desu.〕　— Nghe nói mai bão đến.",
            "options": [
              "{来|く}るだ",
              "{来|き}て",
              "{来|き}ます",
              "{来|く}る"
            ],
            "correct": 3,
            "why": "ポイント 119: thể thường + そうです. → **{明日|あした}、{台風|たいふう}が{来|く}るそうです。** 〔Ashita, taifuu ga kuru sou desu.〕 — Nghe nói mai bão đến."
          },
          {
            "q": "[Bài 15] {来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}＿＿そうです。　〔Raigetsu, bijutsukan wa muryou __ sou desu.〕　— Nghe nói tháng sau bảo tàng miễn phí.",
            "options": [
              "です",
              "の",
              "だ",
              "な"
            ],
            "correct": 2,
            "why": "ポイント 119: N + だ そうです. → **{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}だそうです。** 〔Raigetsu, bijutsukan wa muryou da sou desu.〕 — Nghe nói tháng sau bảo tàng miễn phí."
          },
          {
            "q": "[Bài 15] {事故|じこ}＿＿{電車|でんしゃ}が{止|と}まりました。　〔Jiko __ densha ga tomarimashita.〕　— Vì tai nạn mà tàu dừng.",
            "options": [
              "に",
              "が",
              "を",
              "で"
            ],
            "correct": 3,
            "why": "ポイント 124: N で (nguyên nhân). → **{事故|じこ}で{電車|でんしゃ}が{止|と}まりました。** 〔Jiko de densha ga tomarimashita.〕 — Vì tai nạn mà tàu dừng."
          },
          {
            "q": "[Bài 15] {時間|じかん}が＿＿、{一緒|いっしょ}に{行|い}きませんか。　〔Jikan ga __, issho ni ikimasen ka.〕　— Nếu có thời gian thì đi cùng không?",
            "options": [
              "あったら",
              "あるたら",
              "あっても",
              "ありたら"
            ],
            "correct": 0,
            "why": "ポイント 120: ある → あったら. → **{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。** 〔Jikan ga attara, issho ni ikimasen ka.〕 — Nếu có thời gian thì đi cùng không?"
          },
          {
            "q": "[Bài 15] {雨|あめ}＿＿、{試合|しあい}はあります。　〔Ame __, shiai wa arimasu.〕　— Dù mưa trận đấu vẫn có.",
            "options": [
              "くても",
              "でも",
              "だったら",
              "ても"
            ],
            "correct": 1,
            "why": "ポイント 121: N でも. → **{雨|あめ}でも、{試合|しあい}はあります。** 〔Ame demo, shiai wa arimasu.〕 — Dù mưa trận đấu vẫn có."
          },
          {
            "q": "[Bài 15] {土曜日|どようび}は＿＿{混|こ}んでいると{思|おも}います。　〔Doyoubi wa __ konde iru to omoimasu.〕　— Tôi nghĩ thứ Bảy chắc chắn đông.",
            "options": [
              "もし",
              "なんと",
              "いつでも",
              "きっと"
            ],
            "correct": 3,
            "why": "ポイント 123: きっと ～と 思います. → **{土曜日|どようび}はきっと{混|こ}んでいると{思|おも}います。** 〔Doyoubi wa kitto konde iru to omoimasu.〕 — Tôi nghĩ thứ Bảy chắc chắn đông."
          },
          {
            "q": "[Bài 15] あっ、{店|みせ}が＿＿います。　〔A, mise ga __ imasu.〕　— Ơ, cửa hàng đóng cửa rồi.",
            "options": [
              "{閉|し}まる",
              "{閉|し}まって",
              "{閉|し}まった",
              "{閉|し}めて"
            ],
            "correct": 1,
            "why": "ポイント 122: tự động từ + て います. → **あっ、{店|みせ}が{閉|し}まっています。** 〔A, mise ga shimatte imasu.〕 — Ơ, cửa hàng đóng cửa rồi."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-ot-iv",
        "title": "IV. Gõ dạng đúng của từ trong gợi ý (12 câu)",
        "kind": "fill",
        "grammar": "て · たり · た · ない · thể thường · なければ · なくて · たら · ても",
        "items": [
          {
            "q": "[Bài 11] {毎日|まいにち}{日本語|にほんご}を＿＿います。　〔Mainichi Nihongo o __ imasu.〕",
            "answers": [
              "勉強して",
              "べんきょうして"
            ],
            "hint": "べんきょうします → thể て (thói quen)"
          },
          {
            "q": "[Bài 11] {日曜日|にちようび}は{本|ほん}を{読|よ}んだり、{音楽|おんがく}を＿＿します。　〔Nichiyoubi wa hon o yondari, ongaku o __ shimasu.〕",
            "answers": [
              "聞いたり",
              "きいたり"
            ],
            "hint": "ききます → ～たり"
          },
          {
            "q": "[Bài 12] {風邪|かぜ}ですから、{薬|くすり}を＿＿ほうがいいですよ。　〔Kaze desu kara, kusuri o __ hou ga ii desu yo.〕",
            "answers": [
              "飲んだ",
              "のんだ"
            ],
            "hint": "のみます → thể た"
          },
          {
            "q": "[Bài 12] {熱|ねつ}があるときは、お{酒|さけ}を＿＿ほうがいいです。　〔Netsu ga aru toki wa, osake o __ hou ga ii desu.〕",
            "answers": [
              "飲まない",
              "のまない"
            ],
            "hint": "のみます → thể ない"
          },
          {
            "q": "[Bài 13] {日本|にほん}の{映画|えいが}を＿＿ことがあります。　〔Nihon no eiga o __ koto ga arimasu.〕",
            "answers": [
              "見た",
              "みた"
            ],
            "hint": "みます → thể た"
          },
          {
            "q": "[Bài 13] これは{昨日|きのう}{駅|えき}の{前|まえ}で＿＿{本|ほん}です。　〔Kore wa kinou eki no mae de __ hon desu.〕",
            "answers": [
              "買った",
              "かった"
            ],
            "hint": "かいます → thể thường quá khứ + N"
          },
          {
            "q": "[Bài 14] {明日|あした}は{試験|しけん}ですから、{早|はや}く＿＿なりません。　〔Ashita wa shiken desu kara, hayaku __ narimasen.〕",
            "answers": [
              "起きなければ",
              "おきなければ"
            ],
            "hint": "おきます → phải"
          },
          {
            "q": "[Bài 14] {名前|なまえ}は＿＿もいいです。　〔Namae wa __ mo ii desu.〕",
            "answers": [
              "書かなくて",
              "かかなくて"
            ],
            "hint": "かきます → không cần"
          },
          {
            "q": "[Bài 14] あの{人|ひと}はたぶん{学生|がくせい}＿＿と{思|おも}います。　〔Ano hito wa tabun gakusei __ to omoimasu.〕",
            "answers": [
              "だ"
            ],
            "hint": "N + ? + と思います"
          },
          {
            "q": "[Bài 15] お{金|かね}が＿＿、{旅行|りょこう}したいです。　〔Okane ga __, ryokou shitai desu.〕",
            "answers": [
              "あったら"
            ],
            "hint": "あります → nếu"
          },
          {
            "q": "[Bài 15] {安|やす}＿＿、いらないものは{買|か}いません。　〔Yasu__, iranai mono wa kaimasen.〕",
            "answers": [
              "くても"
            ],
            "hint": "やすい → dù"
          },
          {
            "q": "[Bài 15] {事故|じこ}で{電車|でんしゃ}が＿＿そうです。　〔Jiko de densha ga __ sou desu.〕",
            "answers": [
              "止まった",
              "とまった"
            ],
            "hint": "とまりました → thể thường + そうです"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · V. Đọc hiểu · VI. Đọc không furigana · VII. Dịch · VIII. Tình huống"
      },
      {
        "t": "passage",
        "title": "V. Đọc hiểu — Thư của Daniel gửi thầy Honda",
        "intro": "Thư dài trộn cả 5 bài: cuộc sống (B11) · ốm (B12) · giới thiệu (B13) · phong tục (B14) · tin tức (B15). Đọc rồi trả lời 6 câu.",
        "paras": [
          {
            "text": "{本田先生|ほんだせんせい}、お{元気|げんき}ですか。{私|わたし}は{今|いま}、{大阪|おおさか}の{会社|かいしゃ}で{働|はたら}いています。{毎朝|まいあさ}{七時|しちじ}に{起|お}きて、{電車|でんしゃ}で{会社|かいしゃ}に{通|かよ}っています。{週末|しゅうまつ}は{料理|りょうり}をしたり、{散歩|さんぽ}したりしています。"
          },
          {
            "text": "{先月|せんげつ}、{風邪|かぜ}をひいて、{熱|ねつ}が{三十九度|さんじゅうくど}もありました。{医者|いしゃ}は「{三日|みっか}{会社|かいしゃ}を{休|やす}んだほうがいいですよ」と{言|い}いました。{今|いま}はもう{元気|げんき}です。"
          },
          {
            "text": "{大阪|おおさか}には「たこ{八|はち}」というたこ{焼|や}きの{店|みせ}があります。{私|わたし}は{何回|なんかい}も{行|い}ったことがあります。{先生|せんせい}も{大阪|おおさか}に{来|き}たら、ぜひ{行|い}ってください。{店|みせ}の{前|まえ}にいつも{人|ひと}が{並|なら}んでいますが、{並|なら}んでも、{食|た}べたほうがいいと{思|おも}います。"
          },
          {
            "text": "それから、{昨日|きのう}ニュースで{見|み}ましたが、{来週|らいしゅう}{大|おお}きい{台風|たいふう}が{来|く}るそうです。{台風|たいふう}が{来|き}たら、{会社|かいしゃ}は{休|やす}みになると{思|おも}います。{先生|せんせい}も{台風|たいふう}に{注意|ちゅうい}してください。ダニエル"
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
            "en": "{本田先生|ほんだせんせい}、お{元気|げんき}ですか。",
            "ro": "Hondasensei, ogenki desu ka.",
            "vi": "Thầy Honda, thầy có khoẻ không ạ?"
          },
          {
            "en": "{私|わたし}は{今|いま}、{大阪|おおさか}の{会社|かいしゃ}で{働|はたら}いています。",
            "ro": "Watashi wa ima, Oosaka no kaisha de hataraite imasu.",
            "vi": "Bây giờ em đang làm việc ở một công ty tại Osaka."
          },
          {
            "en": "{毎朝|まいあさ}{七時|しちじ}に{起|お}きて、{電車|でんしゃ}で{会社|かいしゃ}に{通|かよ}っています。",
            "ro": "Maiasa shichiji ni okite, densha de kaisha ni kayotte imasu.",
            "vi": "Sáng nào em cũng dậy lúc 7 giờ và đi tàu đến công ty."
          },
          {
            "en": "{週末|しゅうまつ}は{料理|りょうり}をしたり、{散歩|さんぽ}したりしています。",
            "ro": "Shuumatsu wa ryouri o shitari, sanpo shitari shite imasu.",
            "vi": "Cuối tuần em nào nấu ăn, nào đi dạo."
          },
          {
            "en": "{先月|せんげつ}、{風邪|かぜ}をひいて、{熱|ねつ}が{三十九度|さんじゅうくど}もありました。",
            "ro": "Sengetsu, kaze o hiite, netsu ga sanjuukudo mo arimashita.",
            "vi": "Tháng trước em bị cảm, sốt tới 39 độ."
          },
          {
            "en": "{医者|いしゃ}は「{三日|みっか}{会社|かいしゃ}を{休|やす}んだほうがいいですよ」と{言|い}いました。",
            "ro": "Isha wa \"mikka kaisha o yasunda hou ga ii desu yo\" to iimashita.",
            "vi": "Bác sĩ nói: \"Cậu nên nghỉ làm ba ngày.\""
          },
          {
            "en": "{今|いま}はもう{元気|げんき}です。",
            "ro": "Ima wa mou genki desu.",
            "vi": "Bây giờ em khoẻ rồi."
          },
          {
            "en": "{大阪|おおさか}には「たこ{八|はち}」というたこ{焼|や}きの{店|みせ}があります。",
            "ro": "Oosaka ni wa \"takohachi\" to iu takoyaki no mise ga arimasu.",
            "vi": "Ở Osaka có quán takoyaki tên là \"Tako Hachi\"."
          },
          {
            "en": "{私|わたし}は{何回|なんかい}も{行|い}ったことがあります。",
            "ro": "Watashi wa nankai mo itta koto ga arimasu.",
            "vi": "Em đã đến đó nhiều lần."
          },
          {
            "en": "{先生|せんせい}も{大阪|おおさか}に{来|き}たら、ぜひ{行|い}ってください。",
            "ro": "Sensei mo Oosaka ni kitara, zehi itte kudasai.",
            "vi": "Nếu thầy đến Osaka thì nhất định hãy ghé nhé."
          },
          {
            "en": "{店|みせ}の{前|まえ}にいつも{人|ひと}が{並|なら}んでいますが、{並|なら}んでも、{食|た}べたほうがいいと{思|おも}います。",
            "ro": "Mise no mae ni itsumo hito ga narande imasu ga, narande mo, tabeta hou ga ii to omoimasu.",
            "vi": "Trước quán lúc nào cũng có người xếp hàng, nhưng em nghĩ dù phải xếp hàng cũng nên ăn thử."
          },
          {
            "en": "それから、{昨日|きのう}ニュースで{見|み}ましたが、{来週|らいしゅう}{大|おお}きい{台風|たいふう}が{来|く}るそうです。",
            "ro": "Sorekara, kinou nyuusu de mimashita ga, raishuu ookii taifuu ga kuru sou desu.",
            "vi": "Còn nữa, hôm qua em xem thời sự, nghe nói tuần sau có bão lớn."
          },
          {
            "en": "{台風|たいふう}が{来|き}たら、{会社|かいしゃ}は{休|やす}みになると{思|おも}います。",
            "ro": "Taifuu ga kitara, kaisha wa yasumi ni naru to omoimasu.",
            "vi": "Em nghĩ nếu bão đến thì công ty sẽ cho nghỉ."
          },
          {
            "en": "{先生|せんせい}も{台風|たいふう}に{注意|ちゅうい}してください。ダニエル",
            "ro": "Sensei mo taifuu ni chuui shite kudasai. Danieru",
            "vi": "Thầy cũng cẩn thận với bão nhé. Daniel"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ot-v",
        "title": "V. Câu hỏi đọc hiểu (6 câu)",
        "items": [
          {
            "q": "[Bài 11] Bây giờ Daniel đang làm gì?",
            "options": [
              "Về nước",
              "Làm việc ở công ty tại Osaka",
              "Học đại học ở Osaka",
              "Làm ở quán takoyaki"
            ],
            "correct": 1,
            "why": "大阪の 会社で 働いて います (Vて います — việc trong giai đoạn này)."
          },
          {
            "q": "[Bài 11] Cuối tuần Daniel thường làm gì?",
            "options": [
              "Đi xem bóng đá",
              "Ngủ cả ngày",
              "Nấu ăn, đi dạo",
              "Đi làm thêm"
            ],
            "correct": 2,
            "why": "料理を したり、散歩 したり して います."
          },
          {
            "q": "[Bài 12] Bác sĩ khuyên Daniel điều gì?",
            "options": [
              "Không nên uống thuốc",
              "Nên nghỉ làm ba ngày",
              "Phải nhập viện",
              "Nên đi làm bình thường"
            ],
            "correct": 1,
            "why": "三日 会社を 休んだ ほうが いいですよ."
          },
          {
            "q": "[Bài 13] Daniel giới thiệu quán gì?",
            "options": [
              "Quán takoyaki tên \"Tako Hachi\"",
              "Nhà hàng Ý",
              "Quán ramen mới mở",
              "Quán cà phê trong tạp chí"
            ],
            "correct": 0,
            "why": "「たこ八」という たこ焼きの 店."
          },
          {
            "q": "[Bài 13+15] Daniel nghĩ gì về việc xếp hàng ở quán đó?",
            "options": [
              "Nếu đông thì không nên đi",
              "Dù phải xếp hàng cũng nên ăn",
              "Không nói",
              "Nên đi quán khác"
            ],
            "correct": 1,
            "why": "並んでも、食べた ほうが いいと 思います."
          },
          {
            "q": "[Bài 15] Daniel đoán điều gì nếu bão đến?",
            "options": [
              "Thầy sẽ đến Osaka",
              "Quán takoyaki sẽ đóng cửa",
              "Tàu sẽ chạy bình thường",
              "Công ty sẽ cho nghỉ"
            ],
            "correct": 3,
            "why": "台風が 来たら、会社は 休みに なると 思います."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b15-ot-vi",
        "title": "VI. Đọc to câu KHÔNG furigana, rồi bấm xem (5 câu)",
        "note": "Chỉ dùng chữ Hán đã học đến Bài 15; chữ chưa học viết hiragana như đề thi.",
        "items": [
          {
            "text": "{毎|まい}あさ{六時|ろくじ}に{起|お}きて、{学校|がっこう}に{通|かよ}っています。",
            "ro": "Maiasa rokuji ni okite, gakkou ni kayotte imasu.",
            "vi": "[Bài 11] Sáng nào tôi cũng dậy lúc 6 giờ và đi học."
          },
          {
            "text": "{熱|ねつ}があって、{頭|あたま}が{痛|いた}いんです。{病院|びょういん}へ{行|い}ったほうがいいですよ。",
            "ro": "Netsu ga atte, atama ga itai n desu. Byouin e itta hou ga ii desu yo.",
            "vi": "[Bài 12] Tôi bị sốt và đau đầu. — Bạn nên đi bệnh viện đấy."
          },
          {
            "text": "{赤|あか}いぼうしをかぶっている{人|ひと}を{知|し}っていますか。",
            "ro": "Akai boushi o kabutte iru hito o shitte imasu ka.",
            "vi": "[Bài 13] Bạn có biết người đang đội mũ đỏ kia không?"
          },
          {
            "text": "いなかは{空気|くうき}がきれいだと{思|おも}いますが、こう{通|つう}が{不便|ふべん}です。",
            "ro": "Inaka wa kuuki ga kirei da to omoimasu ga, koutsuu ga fuben desu.",
            "vi": "[Bài 14] Tôi nghĩ ở quê không khí trong lành, nhưng giao thông bất tiện."
          },
          {
            "text": "あした{晴|は}れたら、{天気|てんき}がいいですから、いっしょに{歩|ある}きませんか。{雨|あめ}が{降|ふ}っても、{行|い}きます。",
            "ro": "Ashita haretara, tenki ga ii desu kara, issho ni arukimasen ka. Ame ga futte mo, ikimasu.",
            "vi": "[Bài 15] Nếu mai nắng thì trời đẹp, cùng đi bộ không? Dù mưa tôi vẫn đi."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b15-ot-vii-a",
        "title": "VII-a. Dịch Việt → Nhật (8 câu)",
        "kind": "translate",
        "grammar": "Mỗi câu ghi bài của mẫu chính",
        "items": [
          {
            "q": "[Bài 11] Cuối tuần tôi nào đi mua sắm, nào xem phim.",
            "answers": [
              "週末は買い物をしたり、映画を見たりします。",
              "週末は買い物をしたり、映画をみたりします。",
              "週末は買い物をしたり、えいがを見たりします。",
              "週末は買い物をしたり、えいがをみたりします。",
              "週末は買いものをしたり、映画を見たりします。",
              "週末は買いものをしたり、映画をみたりします。",
              "週末は買いものをしたり、えいがを見たりします。",
              "週末は買いものをしたり、えいがをみたりします。",
              "週末はかい物をしたり、映画を見たりします。",
              "週末はかい物をしたり、映画をみたりします。",
              "週末はかい物をしたり、えいがを見たりします。",
              "週末はかい物をしたり、えいがをみたりします。",
              "週末はかいものをしたり、映画を見たりします。",
              "週末はかいものをしたり、映画をみたりします。",
              "週末はかいものをしたり、えいがを見たりします。",
              "週末はかいものをしたり、えいがをみたりします。",
              "しゅうまつは買い物をしたり、映画を見たりします。",
              "しゅうまつは買い物をしたり、映画をみたりします。",
              "しゅうまつは買い物をしたり、えいがを見たりします。",
              "しゅうまつは買い物をしたり、えいがをみたりします。",
              "しゅうまつは買いものをしたり、映画を見たりします。",
              "しゅうまつは買いものをしたり、映画をみたりします。",
              "しゅうまつは買いものをしたり、えいがを見たりします。",
              "しゅうまつは買いものをしたり、えいがをみたりします。",
              "しゅうまつはかい物をしたり、映画を見たりします。",
              "しゅうまつはかい物をしたり、映画をみたりします。",
              "しゅうまつはかい物をしたり、えいがを見たりします。",
              "しゅうまつはかい物をしたり、えいがをみたりします。",
              "しゅうまつはかいものをしたり、映画を見たりします。",
              "しゅうまつはかいものをしたり、映画をみたりします。",
              "しゅうまつはかいものをしたり、えいがを見たりします。",
              "しゅうまつはかいものをしたり、えいがをみたりします。"
            ],
            "hint": "～たり ～たり します"
          },
          {
            "q": "[Bài 12] Bạn nên uống thuốc rồi ngủ.",
            "answers": [
              "薬を飲んで、寝たほうがいいです。",
              "薬を飲んで、ねたほうがいいです。",
              "薬をのんで、寝たほうがいいです。",
              "薬をのんで、ねたほうがいいです。",
              "くすりを飲んで、寝たほうがいいです。",
              "くすりを飲んで、ねたほうがいいです。",
              "くすりをのんで、寝たほうがいいです。",
              "くすりをのんで、ねたほうがいいです。",
              "薬を飲んでから、寝たほうがいいです。",
              "薬を飲んでから、ねたほうがいいです。",
              "薬をのんでから、寝たほうがいいです。",
              "薬をのんでから、ねたほうがいいです。",
              "くすりを飲んでから、寝たほうがいいです。",
              "くすりを飲んでから、ねたほうがいいです。",
              "くすりをのんでから、寝たほうがいいです。",
              "くすりをのんでから、ねたほうがいいです。"
            ],
            "hint": "寝た ほうが いいです"
          },
          {
            "q": "[Bài 13] Bạn đã từng mặc yukata chưa?",
            "answers": [
              "浴衣を着たことがありますか。",
              "浴衣をきたことがありますか。",
              "ゆかたを着たことがありますか。",
              "ゆかたをきたことがありますか。"
            ],
            "hint": "着た ことが ありますか"
          },
          {
            "q": "[Bài 14] Không được hút thuốc ở đây.",
            "answers": [
              "ここでたばこを吸ってはいけません。",
              "ここでたばこをすってはいけません。"
            ],
            "hint": "吸っては いけません"
          },
          {
            "q": "[Bài 14] Không cần mang hộ chiếu.",
            "answers": [
              "パスポートを持って来なくてもいいです。",
              "パスポートを持ってこなくてもいいです。",
              "パスポートをもって来なくてもいいです。",
              "パスポートをもってこなくてもいいです。",
              "パスポートを持って行かなくてもいいです。",
              "パスポートを持っていかなくてもいいです。",
              "パスポートをもって行かなくてもいいです。",
              "パスポートをもっていかなくてもいいです。"
            ],
            "hint": "なくて も いいです"
          },
          {
            "q": "[Bài 15] Nghe nói vì bão mà tàu điện đã dừng.",
            "answers": [
              "台風で電車が止まったそうです。",
              "台風で電車がとまったそうです。",
              "台風ででんしゃが止まったそうです。",
              "台風ででんしゃがとまったそうです。",
              "たいふうで電車が止まったそうです。",
              "たいふうで電車がとまったそうです。",
              "たいふうででんしゃが止まったそうです。",
              "たいふうででんしゃがとまったそうです。"
            ],
            "hint": "台風で … そうです"
          },
          {
            "q": "[Bài 15] Nếu rảnh thì đi chợ đồ cũ cùng không?",
            "answers": [
              "暇だったら、一緒にフリーマーケットに行きませんか。",
              "暇だったら、一緒にフリーマーケットにいきませんか。",
              "暇だったら、いっしょにフリーマーケットに行きませんか。",
              "暇だったら、いっしょにフリーマーケットにいきませんか。",
              "ひまだったら、一緒にフリーマーケットに行きませんか。",
              "ひまだったら、一緒にフリーマーケットにいきませんか。",
              "ひまだったら、いっしょにフリーマーケットに行きませんか。",
              "ひまだったら、いっしょにフリーマーケットにいきませんか。",
              "暇だったら、一緒にフリーマーケットへ行きませんか。",
              "暇だったら、一緒にフリーマーケットへいきませんか。",
              "暇だったら、いっしょにフリーマーケットへ行きませんか。",
              "暇だったら、いっしょにフリーマーケットへいきませんか。",
              "ひまだったら、一緒にフリーマーケットへ行きませんか。",
              "ひまだったら、一緒にフリーマーケットへいきませんか。",
              "ひまだったら、いっしょにフリーマーケットへ行きませんか。",
              "ひまだったら、いっしょにフリーマーケットへいきませんか。"
            ],
            "hint": "暇だったら"
          },
          {
            "q": "[Bài 13+15] Dù đắt, tôi vẫn muốn mua cái túi mẹ tôi thích.",
            "answers": [
              "高くても、母が好きなかばんを買いたいです。",
              "高くても、母が好きなかばんをかいたいです。",
              "高くても、母がすきなかばんを買いたいです。",
              "高くても、母がすきなかばんをかいたいです。",
              "高くても、ははが好きなかばんを買いたいです。",
              "高くても、ははが好きなかばんをかいたいです。",
              "高くても、ははがすきなかばんを買いたいです。",
              "高くても、ははがすきなかばんをかいたいです。",
              "たかくても、母が好きなかばんを買いたいです。",
              "たかくても、母が好きなかばんをかいたいです。",
              "たかくても、母がすきなかばんを買いたいです。",
              "たかくても、母がすきなかばんをかいたいです。",
              "たかくても、ははが好きなかばんを買いたいです。",
              "たかくても、ははが好きなかばんをかいたいです。",
              "たかくても、ははがすきなかばんを買いたいです。",
              "たかくても、ははがすきなかばんをかいたいです。",
              "高くても、母の好きなかばんを買いたいです。",
              "高くても、母の好きなかばんをかいたいです。",
              "高くても、母のすきなかばんを買いたいです。",
              "高くても、母のすきなかばんをかいたいです。",
              "高くても、ははの好きなかばんを買いたいです。",
              "高くても、ははの好きなかばんをかいたいです。",
              "高くても、ははのすきなかばんを買いたいです。",
              "高くても、ははのすきなかばんをかいたいです。",
              "たかくても、母の好きなかばんを買いたいです。",
              "たかくても、母の好きなかばんをかいたいです。",
              "たかくても、母のすきなかばんを買いたいです。",
              "たかくても、母のすきなかばんをかいたいです。",
              "たかくても、ははの好きなかばんを買いたいです。",
              "たかくても、ははの好きなかばんをかいたいです。",
              "たかくても、ははのすきなかばんを買いたいです。",
              "たかくても、ははのすきなかばんをかいたいです。"
            ],
            "hint": "高くて も · 普通形＋N"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ot-vii-b",
        "title": "VII-b. Dịch Nhật → Việt (6 câu)",
        "items": [
          {
            "q": "[Bài 11] Câu này nghĩa là gì? {初|はじ}めは{寂|さび}しかったですが、{今|いま}はもう{慣|な}れました。　〔Hajime wa sabishikatta desu ga, ima wa mou naremashita.〕",
            "options": [
              "Lần đầu tiên tôi buồn, giờ vẫn chưa quen.",
              "Lúc đầu thì buồn, nhưng giờ tôi đã quen rồi.",
              "Tôi chưa bao giờ buồn.",
              "Lúc đầu tôi quen, giờ thì buồn."
            ],
            "correct": 1,
            "why": "Bài 11: 初めは ～が、今は ～ · 慣れます."
          },
          {
            "q": "[Bài 12] Câu này nghĩa là gì? どうして{学校|がっこう}を{休|やす}んだんですか。　〔Doushite gakkou o yasunda n desu ka.〕",
            "options": [
              "Bạn đã nghỉ học bao lâu?",
              "Sao bạn nghỉ học vậy?",
              "Nghe nói bạn nghỉ học.",
              "Bạn nên nghỉ học."
            ],
            "correct": 1,
            "why": "Bài 12: ～んですか (hỏi lý do)."
          },
          {
            "q": "[Bài 13] Câu này nghĩa là gì? {駅|えき}の{前|まえ}にある{店|みせ}は{安|やす}くておいしいですよ。　〔Eki no mae ni aru mise wa yasukute oishii desu yo.〕",
            "options": [
              "Nghe nói quán trước ga ngon.",
              "Trước ga sẽ có quán rẻ.",
              "Nếu có quán trước ga thì tốt.",
              "Quán ở trước ga rẻ mà ngon đấy."
            ],
            "correct": 3,
            "why": "Bài 13: 普通形＋N (駅の 前に ある 店)."
          },
          {
            "q": "[Bài 14] Câu này nghĩa là gì? このボタンを{押|お}すと、お{湯|ゆ}が{出|で}ます。　〔Kono botan o osu to, oyu ga demasu.〕",
            "options": [
              "Dù bấm nút cũng không có nước nóng.",
              "Bấm nút này thì nước nóng chảy ra.",
              "Không được bấm nút này.",
              "Hãy bấm nút này để có nước nóng."
            ],
            "correct": 1,
            "why": "Bài 14: V辞書形 と."
          },
          {
            "q": "[Bài 15] Câu này nghĩa là gì? {雨|あめ}がやんだら、{出|で}かけましょう。　〔Ame ga yandara, dekakemashou.〕",
            "options": [
              "Mưa tạnh thì ra ngoài nhé.",
              "Vì mưa tạnh nên đã ra ngoài.",
              "Dù mưa cũng ra ngoài.",
              "Nghe nói mưa tạnh."
            ],
            "correct": 0,
            "why": "Bài 15: ～たら."
          },
          {
            "q": "[Bài 12+15] Câu này nghĩa là gì? {事故|じこ}でけがをした{人|ひと}が{入院|にゅういん}しているそうです。　〔Jiko de kega o shita hito ga nyuuin shite iru sou desu.〕",
            "options": [
              "Nếu bị tai nạn thì phải nhập viện.",
              "Tôi nghĩ người bị tai nạn sẽ nhập viện.",
              "Nghe nói người bị thương vì tai nạn đang nằm viện.",
              "Người bị thương đã ra viện."
            ],
            "correct": 2,
            "why": "Bài 12 (けが) + 15 (N で · ～そうです)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b15-ot-viii",
        "title": "VIII. Tình huống — nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "[Bài 11] Bạn thân hỏi: 「明日、暇？」. Bạn bận, trả lời bằng thể thường.",
            "options": [
              "ううん、{明日|あした}はちょっと{忙|いそが}しい。 (Uun, ashita wa chotto isogashii.)",
              "いいえ、{明日|あした}は{忙|いそが}しいです。 (Iie, ashita wa isogashii desu.)",
              "はい、{忙|いそが}しくないです。 (Hai, isogashiku nai desu.)",
              "ううん、{明日|あした}は{忙|いそが}しいでした。 (Uun, ashita wa isogashii deshita.)"
            ],
            "correct": 0,
            "why": "Bài 11: 友達言葉 — ううん + thể thường."
          },
          {
            "q": "[Bài 12] Bạn cùng lớp trông mệt, bạn hỏi lý do.",
            "options": [
              "どうしたらいいですか。 (Dou shitara ii desu ka.)",
              "どうしたんですか。 (Dou shita n desu ka.)",
              "どうしたそうですか。 (Dou shita sou desu ka.)",
              "どうしましたと{思|おも}いますか。 (Dou shimashita to omoimasu ka.)"
            ],
            "correct": 1,
            "why": "Bài 12: どう したんですか."
          },
          {
            "q": "[Bài 13] Bạn muốn biết bạn mình có biết quán ramen tên \"Yume\" không.",
            "options": [
              "「ゆめ」ラーメン{屋|や}が{知|し}っていますか。 (\"Yume\" raamen'ya ga shitte imasu ka.)",
              "「ゆめ」のラーメン{屋|や}を{知|し}りますか。 (\"Yume\" no raamen'ya o shirimasu ka.)",
              "「ゆめ」というラーメン{屋|や}を{知|し}っていますか。 (\"Yume\" to iu raamen'ya o shitte imasu ka.)",
              "「ゆめ」と{言|い}いますラーメン{屋|や}を{知|し}っていますか。 (\"Yume\" to iimasu raamen'ya o shitte imasu ka.)"
            ],
            "correct": 2,
            "why": "Bài 13: N1という N2 · 知って いますか."
          },
          {
            "q": "[Bài 14] Bạn giải thích cho bạn mới: ở hồ bơi này phải đội mũ bơi.",
            "options": [
              "ここでは{帽子|ぼうし}をかぶらなくてもいいです。 (Koko de wa boushi o kaburanakute mo ii desu.)",
              "ここでは{帽子|ぼうし}をかぶってはいけません。 (Koko de wa boushi o kabutte wa ikemasen.)",
              "ここでは{帽子|ぼうし}をかぶらなければなりません。 (Koko de wa boushi o kaburanakereba narimasen.)",
              "ここでは{帽子|ぼうし}をかぶると{思|おも}います。 (Koko de wa boushi o kaburu to omoimasu.)"
            ],
            "correct": 2,
            "why": "Bài 14: なければ なりません."
          },
          {
            "q": "[Bài 15] Bạn nghe thời sự: động đất ở Kyushu. Bạn kể cho đồng nghiệp.",
            "options": [
              "{九州|きゅうしゅう}で{地震|じしん}だそうでした。 (Kyuushuu de jishin da sou deshita.)",
              "{九州|きゅうしゅう}で{地震|じしん}がありますと{思|おも}います。 (Kyuushuu de jishin ga arimasu to omoimasu.)",
              "ニュースで{見|み}ましたが、{九州|きゅうしゅう}で{地震|じしん}があったそうです。 (Nyuusu de mimashita ga, Kyuushuu de jishin ga atta sou desu.)",
              "{九州|きゅうしゅう}で{地震|じしん}があったら、{見|み}ました。 (Kyuushuu de jishin ga attara, mimashita.)"
            ],
            "correct": 2,
            "why": "Bài 15: ～そうです."
          },
          {
            "q": "[Bài 14+15] Đến nhà hàng thì thấy đã đóng cửa. Bạn đề nghị với bạn.",
            "options": [
              "{閉|し}まるそうです。{入|はい}りましょう。 (Shimaru sou desu. Hairimashou.)",
              "{閉|し}まっても、{入|はい}らなければなりません。 (Shimatte mo, hairanakereba narimasen.)",
              "{閉|し}まっていますね。{駅|えき}の{前|まえ}の{店|みせ}はいつでも{開|あ}いていると{思|おも}いますから、そこに{行|い}きませんか。 (Shimatte imasu ne. Eki no mae no mise wa itsudemo aite iru to omoimasu kara, soko ni ikimasen ka.)",
              "{閉|し}めていますね。{駅|えき}の{前|まえ}の{店|みせ}に{行|い}かなくてもいいです。 (Shimete imasu ne. Eki no mae no mise ni ikanakute mo ii desu.)"
            ],
            "correct": 2,
            "why": "Bài 15: 閉まって います + Bài 14: いつでも · ～と 思います."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ — 5 bài, 27 điểm ngữ pháp",
        "items": [
          "**B11 (98–103)** ています thói quen · たり · は～が、は～ · とき · 友達言葉 · **B12 (104–107)** んです · た／ないほうがいい · 前に · てから · **B13 (108–112)** たことがある · 普通形＋N · かぶって／かけて います · 知っています／知りません · という.",
          "**B14 (113–118)** と · てはいけない · なければならない · なくてもいい · と思う (ý kiến) · と言う · **B15 (119–124)** そうです · N で · たら · ても · きっと／たぶん～と思う (đoán) · Vています (trạng thái). Sai bài nào → về đúng lesson của bài đó (bảng ở đầu đề)."
        ]
      }
    ]
  }
];
