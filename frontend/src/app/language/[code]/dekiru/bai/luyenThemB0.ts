/**
 * BỘ LUYỆN THÊM Bài 0 — bảng chữ (khoá できる日本語 /language/ja/dekiru) cho người BẮT ĐẦU LẠI TỪ SỐ 0.
 *
 * Mỗi lesson: mở đầu "Học thế nào", chia 3 mức 🟢 Dễ · 🟡 Vừa · 🔴 Khó, mọi câu có đáp án + giải thích.
 * Gồm: hiragana theo hàng (あ→わ) · cặp chữ dễ nhầm (さ/ち, ぬ/め, ね/れ/わ, る/ろ, は/ほ, い/り, シ/ツ, ソ/ン…) ·
 * âm đục ゛/bán đục ゜/âm ghép ゃゅょ · っ, trường âm, ん, は・へ・を (nghe phân biệt おばさん/おばあさん, きて/きって…) ·
 * katakana (tên nước, đồ ăn, từ mượn của sách) · đọc từ thật Bài 1–2 + viết tay · đề kiểm tra bảng chữ cuối (80 câu).
 * Romaji: ở phần giải thích (câu đọc chữ — để không lộ đáp án), trường `ro` (nghe, ghép), `ipa` (phát âm).
 * FILE SINH TỰ ĐỘNG (gen_b0.py trong scratchpad): romaji tính bằng bộ chuyển Hepburn từ kana, không gõ tay.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export const LUYEN_THEM_B0: Lesson[] = [
  {
    "id": "lt-b0-hiragana-hang",
    "kind": "homework",
    "title": "Luyện thêm Bài 0 · Hiragana theo hàng あ → わ (3 mức, 148 câu)",
    "goal": "Nhìn 46 chữ hiragana đọc ngay ra âm, nghe âm viết/chọn đúng chữ, đọc được từ 2–4 chữ không cần nhìn bảng.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Bài này dành cho người **bắt đầu lại từ số 0**. Đi theo thứ tự **🟢 → 🟡 → 🔴**, mỗi ngày 2–3 hàng, không cần làm hết trong một buổi.",
          "🟢 nhìn chữ → chọn cách đọc · 🟡 nghe/nhìn romaji → chọn chữ, gõ romaji của từ · 🔴 điền chữ còn thiếu trong hàng, đọc to cả hàng cho máy chấm.",
          "Romaji của mỗi câu nằm trong **phần giải thích** hiện ra sau khi bạn chọn — cố tự đọc trước rồi mới xem. Câu sai: viết chữ đó 5 lần ra giấy, đọc to, rồi làm lại cả khối sau 10 phút.",
          "Lỗi hay mắc nhất: đọc **し = si, ち = ti, つ = tu, ふ = hu** (nên gõ được nhưng hãy nhớ cách đọc Hepburn: shi · chi · tsu · fu), và đọc **を** thành \"wo\" (đọc **o**)."
        ]
      },
      {
        "t": "table",
        "head": [
          "Hàng",
          "Chữ",
          "Romaji"
        ],
        "rows": [
          [
            "Hàng あ",
            "あ　い　う　え　お",
            "a · i · u · e · o"
          ],
          [
            "Hàng か",
            "か　き　く　け　こ",
            "ka · ki · ku · ke · ko"
          ],
          [
            "Hàng さ",
            "さ　し　す　せ　そ",
            "sa · shi · su · se · so"
          ],
          [
            "Hàng た",
            "た　ち　つ　て　と",
            "ta · chi · tsu · te · to"
          ],
          [
            "Hàng な",
            "な　に　ぬ　ね　の",
            "na · ni · nu · ne · no"
          ],
          [
            "Hàng は",
            "は　ひ　ふ　へ　ほ",
            "ha · hi · fu · he · ho"
          ],
          [
            "Hàng ま",
            "ま　み　む　め　も",
            "ma · mi · mu · me · mo"
          ],
          [
            "Hàng や",
            "や　ゆ　よ",
            "ya · yu · yo"
          ],
          [
            "Hàng ら",
            "ら　り　る　れ　ろ",
            "ra · ri · ru · re · ro"
          ],
          [
            "Hàng わ",
            "わ　を",
            "wa · o"
          ],
          [
            "Hàng ん",
            "ん",
            "n"
          ]
        ],
        "caption": "Bảng 46 chữ — đọc theo HÀNG NGANG: một phụ âm + a・i・u・e・o"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhìn chữ → chọn cách đọc (46 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-hh-doc-1",
        "title": "Hàng あ・か・さ (15 câu)",
        "items": [
          {
            "q": "Chữ **あ** đọc là gì?",
            "options": [
              "o",
              "a",
              "me",
              "no"
            ],
            "correct": 1,
            "why": "あ = **a** — nét chéo cắt qua giữa."
          },
          {
            "q": "Chữ **い** đọc là gì?",
            "options": [
              "i",
              "ri",
              "ko",
              "ni"
            ],
            "correct": 0,
            "why": "い = **i** — nét phải NGẮN."
          },
          {
            "q": "Chữ **う** đọc là gì?",
            "options": [
              "tsu",
              "ra",
              "ro",
              "u"
            ],
            "correct": 3,
            "why": "う = **u**."
          },
          {
            "q": "Chữ **え** đọc là gì?",
            "options": [
              "fu",
              "so",
              "e",
              "n"
            ],
            "correct": 2,
            "why": "え = **e**."
          },
          {
            "q": "Chữ **お** đọc là gì?",
            "options": [
              "a",
              "o",
              "mu",
              "su"
            ],
            "correct": 1,
            "why": "お = **o** — có chấm nhỏ góc trên phải."
          },
          {
            "q": "Chữ **か** đọc là gì?",
            "options": [
              "ka",
              "ya",
              "ke",
              "na"
            ],
            "correct": 0,
            "why": "か = **ka**."
          },
          {
            "q": "Chữ **き** đọc là gì?",
            "options": [
              "sa",
              "ma",
              "chi",
              "ki"
            ],
            "correct": 3,
            "why": "き = **ki**."
          },
          {
            "q": "Chữ **く** đọc là gì?",
            "options": [
              "he",
              "shi",
              "ku",
              "tsu"
            ],
            "correct": 2,
            "why": "く = **ku**."
          },
          {
            "q": "Chữ **け** đọc là gì?",
            "options": [
              "ha",
              "ke",
              "ho",
              "ni"
            ],
            "correct": 1,
            "why": "け = **ke**."
          },
          {
            "q": "Chữ **こ** đọc là gì?",
            "options": [
              "ko",
              "i",
              "ni",
              "ta"
            ],
            "correct": 0,
            "why": "こ = **ko**."
          },
          {
            "q": "Chữ **さ** đọc là gì?",
            "options": [
              "chi",
              "ki",
              "so",
              "sa"
            ],
            "correct": 3,
            "why": "さ = **sa** — bụng quay sang trái."
          },
          {
            "q": "Chữ **し** đọc là gì?",
            "options": [
              "tsu",
              "mo",
              "shi",
              "ku"
            ],
            "correct": 2,
            "why": "し = **shi** (Hepburn; gõ \"si\" cũng được nhưng sách và đề viết shi)."
          },
          {
            "q": "Chữ **す** đọc là gì?",
            "options": [
              "mu",
              "su",
              "o",
              "a"
            ],
            "correct": 1,
            "why": "す = **su**."
          },
          {
            "q": "Chữ **せ** đọc là gì?",
            "options": [
              "se",
              "sa",
              "ya",
              "ki"
            ],
            "correct": 0,
            "why": "せ = **se**."
          },
          {
            "q": "Chữ **そ** đọc là gì?",
            "options": [
              "te",
              "ro",
              "e",
              "so"
            ],
            "correct": 3,
            "why": "そ = **so**."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-hh-doc-2",
        "title": "Hàng た・な・は (15 câu)",
        "items": [
          {
            "q": "Chữ **た** đọc là gì?",
            "options": [
              "na",
              "ni",
              "ta",
              "ko"
            ],
            "correct": 2,
            "why": "た = **ta**."
          },
          {
            "q": "Chữ **ち** đọc là gì?",
            "options": [
              "sa",
              "chi",
              "ra",
              "ro"
            ],
            "correct": 1,
            "why": "ち = **chi** — bụng quay sang phải như số 5."
          },
          {
            "q": "Chữ **つ** đọc là gì?",
            "options": [
              "tsu",
              "shi",
              "u",
              "te"
            ],
            "correct": 0,
            "why": "つ = **tsu** (không phải \"tu\"/\"su\")."
          },
          {
            "q": "Chữ **て** đọc là gì?",
            "options": [
              "so",
              "tsu",
              "he",
              "te"
            ],
            "correct": 3,
            "why": "て = **te**."
          },
          {
            "q": "Chữ **と** đọc là gì?",
            "options": [
              "ko",
              "te",
              "to",
              "na"
            ],
            "correct": 2,
            "why": "と = **to**."
          },
          {
            "q": "Chữ **な** đọc là gì?",
            "options": [
              "ta",
              "na",
              "ma",
              "fu"
            ],
            "correct": 1,
            "why": "な = **na**."
          },
          {
            "q": "Chữ **に** đọc là gì?",
            "options": [
              "ni",
              "ko",
              "ke",
              "ta"
            ],
            "correct": 0,
            "why": "に = **ni**."
          },
          {
            "q": "Chữ **ぬ** đọc là gì?",
            "options": [
              "me",
              "no",
              "ne",
              "nu"
            ],
            "correct": 3,
            "why": "ぬ = **nu** — có nút thắt ở đuôi (め thì không)."
          },
          {
            "q": "Chữ **ね** đọc là gì?",
            "options": [
              "re",
              "wa",
              "ne",
              "nu"
            ],
            "correct": 2,
            "why": "ね = **ne** — đuôi cuộn vòng như đuôi mèo (ねこ)."
          },
          {
            "q": "Chữ **の** đọc là gì?",
            "options": [
              "me",
              "no",
              "a",
              "nu"
            ],
            "correct": 1,
            "why": "の = **no**."
          },
          {
            "q": "Chữ **は** đọc là gì?",
            "options": [
              "ha",
              "ho",
              "ke",
              "ma"
            ],
            "correct": 0,
            "why": "は = **ha** — một nét ngang bên phải."
          },
          {
            "q": "Chữ **ひ** đọc là gì?",
            "options": [
              "i",
              "chi",
              "shi",
              "hi"
            ],
            "correct": 3,
            "why": "ひ = **hi**."
          },
          {
            "q": "Chữ **ふ** đọc là gì?",
            "options": [
              "na",
              "u",
              "fu",
              "e"
            ],
            "correct": 2,
            "why": "ふ = **fu** — thổi nhẹ qua hai môi."
          },
          {
            "q": "Chữ **へ** đọc là gì?",
            "options": [
              "ku",
              "he",
              "shi",
              "so"
            ],
            "correct": 1,
            "why": "へ = **he**."
          },
          {
            "q": "Chữ **ほ** đọc là gì?",
            "options": [
              "ho",
              "ha",
              "ke",
              "ma"
            ],
            "correct": 0,
            "why": "ほ = **ho** — hai nét ngang bên phải."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-hh-doc-3",
        "title": "Hàng ま・や・ら・わ・ん (16 câu)",
        "items": [
          {
            "q": "Chữ **ま** đọc là gì?",
            "options": [
              "mo",
              "ho",
              "ha",
              "ma"
            ],
            "correct": 3,
            "why": "ま = **ma**."
          },
          {
            "q": "Chữ **み** đọc là gì?",
            "options": [
              "mu",
              "ru",
              "mi",
              "ro"
            ],
            "correct": 2,
            "why": "み = **mi**."
          },
          {
            "q": "Chữ **む** đọc là gì?",
            "options": [
              "su",
              "mu",
              "o",
              "mi"
            ],
            "correct": 1,
            "why": "む = **mu**."
          },
          {
            "q": "Chữ **め** đọc là gì?",
            "options": [
              "me",
              "nu",
              "a",
              "no"
            ],
            "correct": 0,
            "why": "め = **me** — đuôi không có nút (ぬ thì có)."
          },
          {
            "q": "Chữ **も** đọc là gì?",
            "options": [
              "ma",
              "shi",
              "ki",
              "mo"
            ],
            "correct": 3,
            "why": "も = **mo**."
          },
          {
            "q": "Chữ **や** đọc là gì?",
            "options": [
              "yu",
              "ka",
              "ya",
              "se"
            ],
            "correct": 2,
            "why": "や = **ya**."
          },
          {
            "q": "Chữ **ゆ** đọc là gì?",
            "options": [
              "ya",
              "yu",
              "yo",
              "nu"
            ],
            "correct": 1,
            "why": "ゆ = **yu**."
          },
          {
            "q": "Chữ **よ** đọc là gì?",
            "options": [
              "yo",
              "ma",
              "ha",
              "ho"
            ],
            "correct": 0,
            "why": "よ = **yo**."
          },
          {
            "q": "Chữ **ら** đọc là gì?",
            "options": [
              "u",
              "ro",
              "chi",
              "ra"
            ],
            "correct": 3,
            "why": "ら = **ra**."
          },
          {
            "q": "Chữ **り** đọc là gì?",
            "options": [
              "i",
              "ko",
              "ri",
              "ke"
            ],
            "correct": 2,
            "why": "り = **ri** — nét phải DÀI kéo xuống."
          },
          {
            "q": "Chữ **る** đọc là gì?",
            "options": [
              "ro",
              "ru",
              "ra",
              "re"
            ],
            "correct": 1,
            "why": "る = **ru** — có vòng tròn ở cuối."
          },
          {
            "q": "Chữ **れ** đọc là gì?",
            "options": [
              "re",
              "ne",
              "wa",
              "ru"
            ],
            "correct": 0,
            "why": "れ = **re** — đuôi đá ra ngoài."
          },
          {
            "q": "Chữ **ろ** đọc là gì?",
            "options": [
              "ru",
              "ra",
              "chi",
              "ro"
            ],
            "correct": 3,
            "why": "ろ = **ro** — không có vòng."
          },
          {
            "q": "Chữ **わ** đọc là gì?",
            "options": [
              "ne",
              "re",
              "wa",
              "ra"
            ],
            "correct": 2,
            "why": "わ = **wa** — đuôi tròn khép vào."
          },
          {
            "q": "Chữ **を** đọc là gì?",
            "options": [
              "to",
              "o",
              "chi",
              "ra"
            ],
            "correct": 1,
            "why": "を = **o** — đọc y hệt お, chỉ dùng làm trợ từ."
          },
          {
            "q": "Chữ **ん** đọc là gì?",
            "options": [
              "n",
              "so",
              "ru",
              "ro"
            ],
            "correct": 0,
            "why": "ん = **n** — âm mũi, đứng một mình thành một nhịp."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · romaji → chọn đúng chữ (46 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-hh-chon-1",
        "title": "Hàng あ・か・さ (15 câu)",
        "items": [
          {
            "q": "Chữ nào đọc là **a**?",
            "options": [
              "お",
              "め",
              "の",
              "あ"
            ],
            "correct": 3,
            "why": "**あ** = a — nét chéo cắt qua giữa. Ba chữ còn lại: お = o · め = me · の = no."
          },
          {
            "q": "Chữ nào đọc là **i**?",
            "options": [
              "り",
              "こ",
              "い",
              "に"
            ],
            "correct": 2,
            "why": "**い** = i — nét phải NGẮN. Ba chữ còn lại: り = ri · こ = ko · に = ni."
          },
          {
            "q": "Chữ nào đọc là **u**?",
            "options": [
              "つ",
              "う",
              "ら",
              "ろ"
            ],
            "correct": 1,
            "why": "**う** = u. Ba chữ còn lại: つ = tsu · ら = ra · ろ = ro."
          },
          {
            "q": "Chữ nào đọc là **e**?",
            "options": [
              "え",
              "ふ",
              "そ",
              "ん"
            ],
            "correct": 0,
            "why": "**え** = e. Ba chữ còn lại: ふ = fu · そ = so · ん = n."
          },
          {
            "q": "Chữ nào đọc là **o**?",
            "options": [
              "あ",
              "む",
              "す",
              "お"
            ],
            "correct": 3,
            "why": "**お** = o — có chấm nhỏ góc trên phải. Ba chữ còn lại: あ = a · む = mu · す = su."
          },
          {
            "q": "Chữ nào đọc là **ka**?",
            "options": [
              "や",
              "け",
              "か",
              "な"
            ],
            "correct": 2,
            "why": "**か** = ka. Ba chữ còn lại: や = ya · け = ke · な = na."
          },
          {
            "q": "Chữ nào đọc là **ki**?",
            "options": [
              "さ",
              "き",
              "ま",
              "ち"
            ],
            "correct": 1,
            "why": "**き** = ki. Ba chữ còn lại: さ = sa · ま = ma · ち = chi."
          },
          {
            "q": "Chữ nào đọc là **ku**?",
            "options": [
              "く",
              "へ",
              "し",
              "つ"
            ],
            "correct": 0,
            "why": "**く** = ku. Ba chữ còn lại: へ = he · し = shi · つ = tsu."
          },
          {
            "q": "Chữ nào đọc là **ke**?",
            "options": [
              "は",
              "ほ",
              "に",
              "け"
            ],
            "correct": 3,
            "why": "**け** = ke. Ba chữ còn lại: は = ha · ほ = ho · に = ni."
          },
          {
            "q": "Chữ nào đọc là **ko**?",
            "options": [
              "い",
              "に",
              "こ",
              "た"
            ],
            "correct": 2,
            "why": "**こ** = ko. Ba chữ còn lại: い = i · に = ni · た = ta."
          },
          {
            "q": "Chữ nào đọc là **sa**?",
            "options": [
              "ち",
              "さ",
              "き",
              "そ"
            ],
            "correct": 1,
            "why": "**さ** = sa — bụng quay sang trái. Ba chữ còn lại: ち = chi · き = ki · そ = so."
          },
          {
            "q": "Chữ nào đọc là **shi**?",
            "options": [
              "し",
              "つ",
              "も",
              "く"
            ],
            "correct": 0,
            "why": "**し** = shi (Hepburn; gõ \"si\" cũng được nhưng sách và đề viết shi). Ba chữ còn lại: つ = tsu · も = mo · く = ku."
          },
          {
            "q": "Chữ nào đọc là **su**?",
            "options": [
              "む",
              "お",
              "あ",
              "す"
            ],
            "correct": 3,
            "why": "**す** = su. Ba chữ còn lại: む = mu · お = o · あ = a."
          },
          {
            "q": "Chữ nào đọc là **se**?",
            "options": [
              "さ",
              "や",
              "せ",
              "き"
            ],
            "correct": 2,
            "why": "**せ** = se. Ba chữ còn lại: さ = sa · や = ya · き = ki."
          },
          {
            "q": "Chữ nào đọc là **so**?",
            "options": [
              "て",
              "そ",
              "ろ",
              "え"
            ],
            "correct": 1,
            "why": "**そ** = so. Ba chữ còn lại: て = te · ろ = ro · え = e."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-hh-chon-2",
        "title": "Hàng た・な・は (15 câu)",
        "items": [
          {
            "q": "Chữ nào đọc là **ta**?",
            "options": [
              "た",
              "な",
              "に",
              "こ"
            ],
            "correct": 0,
            "why": "**た** = ta. Ba chữ còn lại: な = na · に = ni · こ = ko."
          },
          {
            "q": "Chữ nào đọc là **chi**?",
            "options": [
              "さ",
              "ら",
              "ろ",
              "ち"
            ],
            "correct": 3,
            "why": "**ち** = chi — bụng quay sang phải như số 5. Ba chữ còn lại: さ = sa · ら = ra · ろ = ro."
          },
          {
            "q": "Chữ nào đọc là **tsu**?",
            "options": [
              "し",
              "う",
              "つ",
              "て"
            ],
            "correct": 2,
            "why": "**つ** = tsu (không phải \"tu\"/\"su\"). Ba chữ còn lại: し = shi · う = u · て = te."
          },
          {
            "q": "Chữ nào đọc là **te**?",
            "options": [
              "そ",
              "て",
              "つ",
              "へ"
            ],
            "correct": 1,
            "why": "**て** = te. Ba chữ còn lại: そ = so · つ = tsu · へ = he."
          },
          {
            "q": "Chữ nào đọc là **to**?",
            "options": [
              "と",
              "こ",
              "て",
              "な"
            ],
            "correct": 0,
            "why": "**と** = to. Ba chữ còn lại: こ = ko · て = te · な = na."
          },
          {
            "q": "Chữ nào đọc là **na**?",
            "options": [
              "た",
              "ま",
              "ふ",
              "な"
            ],
            "correct": 3,
            "why": "**な** = na. Ba chữ còn lại: た = ta · ま = ma · ふ = fu."
          },
          {
            "q": "Chữ nào đọc là **ni**?",
            "options": [
              "こ",
              "け",
              "に",
              "た"
            ],
            "correct": 2,
            "why": "**に** = ni. Ba chữ còn lại: こ = ko · け = ke · た = ta."
          },
          {
            "q": "Chữ nào đọc là **nu**?",
            "options": [
              "め",
              "ぬ",
              "の",
              "ね"
            ],
            "correct": 1,
            "why": "**ぬ** = nu — có nút thắt ở đuôi (め thì không). Ba chữ còn lại: め = me · の = no · ね = ne."
          },
          {
            "q": "Chữ nào đọc là **ne**?",
            "options": [
              "ね",
              "れ",
              "わ",
              "ぬ"
            ],
            "correct": 0,
            "why": "**ね** = ne — đuôi cuộn vòng như đuôi mèo (ねこ). Ba chữ còn lại: れ = re · わ = wa · ぬ = nu."
          },
          {
            "q": "Chữ nào đọc là **no**?",
            "options": [
              "め",
              "あ",
              "ぬ",
              "の"
            ],
            "correct": 3,
            "why": "**の** = no. Ba chữ còn lại: め = me · あ = a · ぬ = nu."
          },
          {
            "q": "Chữ nào đọc là **ha**?",
            "options": [
              "ほ",
              "け",
              "は",
              "ま"
            ],
            "correct": 2,
            "why": "**は** = ha — một nét ngang bên phải. Ba chữ còn lại: ほ = ho · け = ke · ま = ma."
          },
          {
            "q": "Chữ nào đọc là **hi**?",
            "options": [
              "い",
              "ひ",
              "ち",
              "し"
            ],
            "correct": 1,
            "why": "**ひ** = hi. Ba chữ còn lại: い = i · ち = chi · し = shi."
          },
          {
            "q": "Chữ nào đọc là **fu**?",
            "options": [
              "ふ",
              "な",
              "う",
              "え"
            ],
            "correct": 0,
            "why": "**ふ** = fu — thổi nhẹ qua hai môi. Ba chữ còn lại: な = na · う = u · え = e."
          },
          {
            "q": "Chữ nào đọc là **he**?",
            "options": [
              "く",
              "し",
              "そ",
              "へ"
            ],
            "correct": 3,
            "why": "**へ** = he. Ba chữ còn lại: く = ku · し = shi · そ = so."
          },
          {
            "q": "Chữ nào đọc là **ho**?",
            "options": [
              "は",
              "け",
              "ほ",
              "ま"
            ],
            "correct": 2,
            "why": "**ほ** = ho — hai nét ngang bên phải. Ba chữ còn lại: は = ha · け = ke · ま = ma."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-hh-chon-3",
        "title": "Hàng ま・や・ら・わ・ん (16 câu)",
        "items": [
          {
            "q": "Chữ nào đọc là **ma**?",
            "options": [
              "も",
              "ま",
              "ほ",
              "は"
            ],
            "correct": 1,
            "why": "**ま** = ma. Ba chữ còn lại: も = mo · ほ = ho · は = ha."
          },
          {
            "q": "Chữ nào đọc là **mi**?",
            "options": [
              "み",
              "む",
              "る",
              "ろ"
            ],
            "correct": 0,
            "why": "**み** = mi. Ba chữ còn lại: む = mu · る = ru · ろ = ro."
          },
          {
            "q": "Chữ nào đọc là **mu**?",
            "options": [
              "す",
              "お",
              "み",
              "む"
            ],
            "correct": 3,
            "why": "**む** = mu. Ba chữ còn lại: す = su · お = o · み = mi."
          },
          {
            "q": "Chữ nào đọc là **me**?",
            "options": [
              "ぬ",
              "あ",
              "め",
              "の"
            ],
            "correct": 2,
            "why": "**め** = me — đuôi không có nút (ぬ thì có). Ba chữ còn lại: ぬ = nu · あ = a · の = no."
          },
          {
            "q": "Chữ nào đọc là **mo**?",
            "options": [
              "ま",
              "も",
              "し",
              "き"
            ],
            "correct": 1,
            "why": "**も** = mo. Ba chữ còn lại: ま = ma · し = shi · き = ki."
          },
          {
            "q": "Chữ nào đọc là **ya**?",
            "options": [
              "や",
              "ゆ",
              "か",
              "せ"
            ],
            "correct": 0,
            "why": "**や** = ya. Ba chữ còn lại: ゆ = yu · か = ka · せ = se."
          },
          {
            "q": "Chữ nào đọc là **yu**?",
            "options": [
              "や",
              "よ",
              "ぬ",
              "ゆ"
            ],
            "correct": 3,
            "why": "**ゆ** = yu. Ba chữ còn lại: や = ya · よ = yo · ぬ = nu."
          },
          {
            "q": "Chữ nào đọc là **yo**?",
            "options": [
              "ま",
              "は",
              "よ",
              "ほ"
            ],
            "correct": 2,
            "why": "**よ** = yo. Ba chữ còn lại: ま = ma · は = ha · ほ = ho."
          },
          {
            "q": "Chữ nào đọc là **ra**?",
            "options": [
              "う",
              "ら",
              "ろ",
              "ち"
            ],
            "correct": 1,
            "why": "**ら** = ra. Ba chữ còn lại: う = u · ろ = ro · ち = chi."
          },
          {
            "q": "Chữ nào đọc là **ri**?",
            "options": [
              "り",
              "い",
              "こ",
              "け"
            ],
            "correct": 0,
            "why": "**り** = ri — nét phải DÀI kéo xuống. Ba chữ còn lại: い = i · こ = ko · け = ke."
          },
          {
            "q": "Chữ nào đọc là **ru**?",
            "options": [
              "ろ",
              "ら",
              "れ",
              "る"
            ],
            "correct": 3,
            "why": "**る** = ru — có vòng tròn ở cuối. Ba chữ còn lại: ろ = ro · ら = ra · れ = re."
          },
          {
            "q": "Chữ nào đọc là **re**?",
            "options": [
              "ね",
              "わ",
              "れ",
              "る"
            ],
            "correct": 2,
            "why": "**れ** = re — đuôi đá ra ngoài. Ba chữ còn lại: ね = ne · わ = wa · る = ru."
          },
          {
            "q": "Chữ nào đọc là **ro**?",
            "options": [
              "る",
              "ろ",
              "ら",
              "ち"
            ],
            "correct": 1,
            "why": "**ろ** = ro — không có vòng. Ba chữ còn lại: る = ru · ら = ra · ち = chi."
          },
          {
            "q": "Chữ nào đọc là **wa**?",
            "options": [
              "わ",
              "ね",
              "れ",
              "ら"
            ],
            "correct": 0,
            "why": "**わ** = wa — đuôi tròn khép vào. Ba chữ còn lại: ね = ne · れ = re · ら = ra."
          },
          {
            "q": "Chữ nào là **trợ từ を (đọc o)** — không phải お?",
            "options": [
              "と",
              "ち",
              "お",
              "を"
            ],
            "correct": 3,
            "why": "**を** = o — đọc y hệt お, chỉ dùng làm trợ từ. Ba chữ còn lại: と = to · ち = chi · お = o."
          },
          {
            "q": "Chữ nào đọc là **n**?",
            "options": [
              "そ",
              "る",
              "ん",
              "ろ"
            ],
            "correct": 2,
            "why": "**ん** = n — âm mũi, đứng một mình thành một nhịp. Ba chữ còn lại: そ = so · る = ru · ろ = ro."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b0-hh-go-tu",
        "title": "Gõ romaji của từ — chỉ dùng 46 chữ cơ bản (40 từ có thật, nhiều từ của Bài 1–4)",
        "kind": "fill",
        "items": [
          {
            "q": "「あさ」 (buổi sáng) → romaji",
            "answers": [
              "asa"
            ]
          },
          {
            "q": "「いえ」 (ngôi nhà) → romaji",
            "answers": [
              "ie"
            ]
          },
          {
            "q": "「うみ」 (biển) → romaji",
            "answers": [
              "umi"
            ]
          },
          {
            "q": "「えき」 (nhà ga) → romaji",
            "answers": [
              "eki"
            ]
          },
          {
            "q": "「かさ」 (cái ô) → romaji",
            "answers": [
              "kasa"
            ]
          },
          {
            "q": "「きた」 (phía bắc) → romaji",
            "answers": [
              "kita"
            ]
          },
          {
            "q": "「くに」 (đất nước) → romaji",
            "answers": [
              "kuni"
            ]
          },
          {
            "q": "「さくら」 (hoa anh đào) → romaji",
            "answers": [
              "sakura"
            ]
          },
          {
            "q": "「すし」 (món sushi) → romaji",
            "answers": [
              "sushi",
              "susi"
            ]
          },
          {
            "q": "「つくえ」 (cái bàn) → romaji",
            "answers": [
              "tsukue",
              "tukue"
            ]
          },
          {
            "q": "「なまえ」 (tên) → romaji",
            "answers": [
              "namae"
            ]
          },
          {
            "q": "「にし」 (phía tây) → romaji",
            "answers": [
              "nishi",
              "nisi"
            ]
          },
          {
            "q": "「ねこ」 (con mèo) → romaji",
            "answers": [
              "neko"
            ]
          },
          {
            "q": "「はな」 (hoa) → romaji",
            "answers": [
              "hana"
            ]
          },
          {
            "q": "「ひと」 (người) → romaji",
            "answers": [
              "hito"
            ]
          },
          {
            "q": "「ふゆ」 (mùa đông) → romaji",
            "answers": [
              "fuyu",
              "huyu"
            ]
          },
          {
            "q": "「ほん」 (quyển sách) → romaji",
            "answers": [
              "hon"
            ]
          },
          {
            "q": "「まち」 (thị trấn, thành phố) → romaji",
            "answers": [
              "machi",
              "mati"
            ]
          },
          {
            "q": "「みみ」 (cái tai) → romaji",
            "answers": [
              "mimi"
            ]
          },
          {
            "q": "「むし」 (con sâu, côn trùng) → romaji",
            "answers": [
              "mushi",
              "musi"
            ]
          },
          {
            "q": "「やま」 (núi) → romaji",
            "answers": [
              "yama"
            ]
          },
          {
            "q": "「ゆき」 (tuyết) → romaji",
            "answers": [
              "yuki"
            ]
          },
          {
            "q": "「よる」 (buổi tối) → romaji",
            "answers": [
              "yoru"
            ]
          },
          {
            "q": "「わたし」 (tôi) → romaji",
            "answers": [
              "watashi",
              "watasi"
            ]
          },
          {
            "q": "「かわ」 (sông) → romaji",
            "answers": [
              "kawa"
            ]
          },
          {
            "q": "「はる」 (mùa xuân) → romaji",
            "answers": [
              "haru"
            ]
          },
          {
            "q": "「なつ」 (mùa hè) → romaji",
            "answers": [
              "natsu",
              "natu"
            ]
          },
          {
            "q": "「あき」 (mùa thu) → romaji",
            "answers": [
              "aki"
            ]
          },
          {
            "q": "「いぬ」 (con chó) → romaji",
            "answers": [
              "inu"
            ]
          },
          {
            "q": "「ふね」 (con thuyền) → romaji",
            "answers": [
              "fune",
              "hune"
            ]
          },
          {
            "q": "「くるま」 (ô tô) → romaji",
            "answers": [
              "kuruma"
            ]
          },
          {
            "q": "「みなみ」 (phía nam) → romaji",
            "answers": [
              "minami"
            ]
          },
          {
            "q": "「ここ」 (chỗ này) → romaji",
            "answers": [
              "koko"
            ]
          },
          {
            "q": "「さかな」 (con cá) → romaji",
            "answers": [
              "sakana"
            ]
          },
          {
            "q": "「あめ」 (mưa) → romaji",
            "answers": [
              "ame"
            ]
          },
          {
            "q": "「おかね」 (tiền) → romaji",
            "answers": [
              "okane"
            ]
          },
          {
            "q": "「すこし」 (một chút) → romaji",
            "answers": [
              "sukoshi",
              "sukosi"
            ]
          },
          {
            "q": "「とても」 (rất) → romaji",
            "answers": [
              "totemo"
            ]
          },
          {
            "q": "「いつ」 (khi nào) → romaji",
            "answers": [
              "itsu",
              "itu"
            ]
          },
          {
            "q": "「なに」 (cái gì) → romaji",
            "answers": [
              "nani"
            ]
          }
        ],
        "grammar": "Đọc từng chữ một rồi ghép: さ・く・ら → sakura. Gõ chữ thường, không dấu cách."
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · điền chữ còn thiếu, đọc to cả hàng"
      },
      {
        "t": "mcq",
        "id": "lt-b0-hh-thieu",
        "title": "Điền chữ còn thiếu · tìm chữ lạc hàng (15 câu)",
        "items": [
          {
            "q": "Hàng あ: あ　＿　う　え　お — chữ còn thiếu là?",
            "options": [
              "り",
              "い",
              "こ",
              "に"
            ],
            "correct": 1,
            "why": "Hàng あ đủ là **あ・い・う・え・お** (a i u e o). Chỗ trống = **い** (i)."
          },
          {
            "q": "Hàng か: か　き　く　＿　こ — chữ còn thiếu là?",
            "options": [
              "け",
              "は",
              "ほ",
              "に"
            ],
            "correct": 0,
            "why": "Hàng か đủ là **か・き・く・け・こ** (ka ki ku ke ko). Chỗ trống = **け** (ke)."
          },
          {
            "q": "Hàng さ: ＿　し　す　せ　そ — chữ còn thiếu là?",
            "options": [
              "ち",
              "き",
              "あ",
              "さ"
            ],
            "correct": 3,
            "why": "Hàng さ đủ là **さ・し・す・せ・そ** (sa shi su se so). Chỗ trống = **さ** (sa)."
          },
          {
            "q": "Hàng た: た　ち　＿　て　と — chữ còn thiếu là?",
            "options": [
              "し",
              "う",
              "つ",
              "あ"
            ],
            "correct": 2,
            "why": "Hàng た đủ là **た・ち・つ・て・と** (ta chi tsu te to). Chỗ trống = **つ** (tsu)."
          },
          {
            "q": "Hàng な: な　に　ぬ　ね　＿ — chữ còn thiếu là?",
            "options": [
              "め",
              "の",
              "あ",
              "い"
            ],
            "correct": 1,
            "why": "Hàng な đủ là **な・に・ぬ・ね・の** (na ni nu ne no). Chỗ trống = **の** (no)."
          },
          {
            "q": "Hàng は: は　＿　ふ　へ　ほ — chữ còn thiếu là?",
            "options": [
              "ひ",
              "い",
              "ち",
              "し"
            ],
            "correct": 0,
            "why": "Hàng は đủ là **は・ひ・ふ・へ・ほ** (ha hi fu he ho). Chỗ trống = **ひ** (hi)."
          },
          {
            "q": "Hàng ま: ま　み　む　＿　も — chữ còn thiếu là?",
            "options": [
              "ぬ",
              "あ",
              "の",
              "め"
            ],
            "correct": 3,
            "why": "Hàng ま đủ là **ま・み・む・め・も** (ma mi mu me mo). Chỗ trống = **め** (me)."
          },
          {
            "q": "Hàng や: ＿　ゆ　よ — chữ còn thiếu là?",
            "options": [
              "か",
              "せ",
              "や",
              "あ"
            ],
            "correct": 2,
            "why": "Hàng や đủ là **や・ゆ・よ** (ya yu yo). Chỗ trống = **や** (ya)."
          },
          {
            "q": "Hàng ら: ら　り　＿　れ　ろ — chữ còn thiếu là?",
            "options": [
              "あ",
              "る",
              "い",
              "う"
            ],
            "correct": 1,
            "why": "Hàng ら đủ là **ら・り・る・れ・ろ** (ra ri ru re ro). Chỗ trống = **る** (ru)."
          },
          {
            "q": "Hàng わ: わ　＿ — chữ còn thiếu là?",
            "options": [
              "を",
              "と",
              "ち",
              "お"
            ],
            "correct": 0,
            "why": "Hàng わ đủ là **わ・を** (wa o). Chỗ trống = **を** (o)."
          },
          {
            "q": "Chữ nào **KHÔNG** thuộc hàng か?",
            "options": [
              "き",
              "く",
              "け",
              "さ"
            ],
            "correct": 3,
            "why": "**さ** đọc là sa — không thuộc hàng か (ka ki ku ke ko)."
          },
          {
            "q": "Chữ nào **KHÔNG** thuộc hàng さ?",
            "options": [
              "し",
              "す",
              "ち",
              "せ"
            ],
            "correct": 2,
            "why": "**ち** đọc là chi — không thuộc hàng さ (sa shi su se so)."
          },
          {
            "q": "Chữ nào **KHÔNG** thuộc hàng た?",
            "options": [
              "ち",
              "さ",
              "つ",
              "て"
            ],
            "correct": 1,
            "why": "**さ** đọc là sa — không thuộc hàng た (ta chi tsu te to)."
          },
          {
            "q": "Chữ nào **KHÔNG** thuộc hàng な?",
            "options": [
              "め",
              "に",
              "ぬ",
              "ね"
            ],
            "correct": 0,
            "why": "**め** đọc là me — không thuộc hàng な (na ni nu ne no)."
          },
          {
            "q": "Chữ nào **KHÔNG** thuộc hàng は?",
            "options": [
              "ひ",
              "ふ",
              "へ",
              "ま"
            ],
            "correct": 3,
            "why": "**ま** đọc là ma — không thuộc hàng は (ha hi fu he ho)."
          },
          {
            "q": "Chữ nào **KHÔNG** thuộc hàng ら?",
            "options": [
              "り",
              "る",
              "う",
              "れ"
            ],
            "correct": 2,
            "why": "**う** đọc là u — không thuộc hàng ら (ra ri ru re ro)."
          }
        ]
      },
      {
        "t": "phatam",
        "id": "lt-b0-hh-doc-to",
        "title": "Đọc to từng hàng — máy chấm phát âm",
        "items": [
          {
            "text": "あ　い　う　え　お",
            "ipa": "a i u e o",
            "vi": "Hàng あ"
          },
          {
            "text": "か　き　く　け　こ",
            "ipa": "ka ki ku ke ko",
            "vi": "Hàng か"
          },
          {
            "text": "さ　し　す　せ　そ",
            "ipa": "sa shi su se so",
            "vi": "Hàng さ"
          },
          {
            "text": "た　ち　つ　て　と",
            "ipa": "ta chi tsu te to",
            "vi": "Hàng た"
          },
          {
            "text": "な　に　ぬ　ね　の",
            "ipa": "na ni nu ne no",
            "vi": "Hàng な"
          },
          {
            "text": "は　ひ　ふ　へ　ほ",
            "ipa": "ha hi fu he ho",
            "vi": "Hàng は"
          },
          {
            "text": "ま　み　む　め　も",
            "ipa": "ma mi mu me mo",
            "vi": "Hàng ま"
          },
          {
            "text": "や　ゆ　よ",
            "ipa": "ya yu yo",
            "vi": "Hàng や"
          },
          {
            "text": "ら　り　る　れ　ろ",
            "ipa": "ra ri ru re ro",
            "vi": "Hàng ら"
          },
          {
            "text": "わ　を",
            "ipa": "wa o",
            "vi": "Hàng わ"
          }
        ],
        "note": "Bấm 🔊 nghe mẫu, rồi 🎙️ đọc to cả hàng. Đọc rõ từng chữ, đều nhịp (mỗi chữ một nhịp)."
      },
      {
        "t": "write",
        "id": "lt-b0-hh-viet-1",
        "title": "Viết lại hàng あ・か (tự viết không nhìn bảng)",
        "chars": [
          "あ",
          "い",
          "う",
          "え",
          "お",
          "か",
          "き",
          "く",
          "け",
          "こ"
        ]
      },
      {
        "t": "write",
        "id": "lt-b0-hh-viet-2",
        "title": "Viết lại hàng さ・た (tự viết không nhìn bảng)",
        "chars": [
          "さ",
          "し",
          "す",
          "せ",
          "そ",
          "た",
          "ち",
          "つ",
          "て",
          "と"
        ]
      },
      {
        "t": "write",
        "id": "lt-b0-hh-viet-3",
        "title": "Viết lại hàng な・は (tự viết không nhìn bảng)",
        "chars": [
          "な",
          "に",
          "ぬ",
          "ね",
          "の",
          "は",
          "ひ",
          "ふ",
          "へ",
          "ほ"
        ]
      },
      {
        "t": "write",
        "id": "lt-b0-hh-viet-4",
        "title": "Viết lại hàng ま・や (tự viết không nhìn bảng)",
        "chars": [
          "ま",
          "み",
          "む",
          "め",
          "も",
          "や",
          "ゆ",
          "よ"
        ]
      },
      {
        "t": "write",
        "id": "lt-b0-hh-viet-5",
        "title": "Viết lại hàng ら・わ・ん (tự viết không nhìn bảng)",
        "chars": [
          "ら",
          "り",
          "る",
          "れ",
          "ろ",
          "わ",
          "を",
          "ん"
        ]
      }
    ]
  },
  {
    "id": "lt-b0-cap-nham",
    "kind": "homework",
    "title": "Luyện thêm Bài 0 · Cặp chữ dễ nhầm (さ/ち, ぬ/め, ね/れ/わ, る/ろ, シ/ツ, ソ/ン…) — 80 câu",
    "goal": "Không còn nhầm các chữ giống hình khi đọc to phần Reading: nhìn đuôi chữ, hướng nét cuối là phân biệt được.",
    "minutes": 45,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đây là phần người mất gốc **mất điểm Reading nhiều nhất**: mỗi chữ đọc sai trừ 0,2 điểm, và những chữ hay sai luôn là các cặp dưới đây.",
          "Trước khi làm, đọc bảng \"Cặp hay nhầm\" và **nói to điểm khác nhau** của từng cặp. Làm 🟢 (nhận chữ) → 🟡 (từ viết đúng) → 🔴 (katakana).",
          "Mẹo: khi phân vân, nhìn **đuôi chữ** (ぬ/め, ね/れ/わ, る/ろ) hoặc **hướng nét cuối** (シ/ツ, ソ/ン)."
        ]
      },
      {
        "t": "table",
        "head": [
          "Cặp",
          "Khác nhau ở đâu",
          "Từ để nhớ"
        ],
        "rows": [
          [
            "さ (sa) · ち (chi) · き (ki)",
            "さ bụng quay **trái**; ち bụng quay **phải** (như số 5); き = さ thêm một nét ngang",
            "さくら sakura · ちかてつ chikatetsu · きた kita"
          ],
          [
            "ぬ (nu) · め (me)",
            "ぬ có **nút thắt** ở đuôi (nu = nút); め không có",
            "いぬ inu (chó) · あめ ame (mưa)"
          ],
          [
            "ね (ne) · れ (re) · わ (wa)",
            "ね đuôi **cuộn vòng**; れ đuôi **đá ra**; わ đuôi **tròn khép**",
            "ねこ neko · これ kore · わたし watashi"
          ],
          [
            "る (ru) · ろ (ro)",
            "る có **vòng** ở cuối; ろ không",
            "よる yoru · ふろ furo (bồn tắm)"
          ],
          [
            "は (ha) · ほ (ho) · け (ke)",
            "は một nét ngang; ほ **hai** nét ngang; け không có vòng",
            "はな hana · ほん hon · いけ ike (ao)"
          ],
          [
            "い (i) · り (ri) · こ (ko)",
            "い hai nét dọc, nét phải ngắn; り nét phải **dài**; こ hai nét **ngang**",
            "いぬ inu · りんご ringo · ここ koko"
          ],
          [
            "あ (a) · お (o)",
            "あ nét chéo cắt giữa; お có **chấm** góc trên phải",
            "あき aki · おかね okane"
          ],
          [
            "く (ku) · へ (he)",
            "く mở sang phải \"<\"; へ là mái nhà \"^\"",
            "くに kuni · へや heya (căn phòng)"
          ],
          [
            "し (shi) · つ (tsu)",
            "し lưỡi câu **dựng đứng**; つ con sóng **nằm ngang**",
            "すし sushi · なつ natsu"
          ],
          [
            "シ (shi) · ツ (tsu)",
            "シ hai chấm xếp **dọc** bên trái, nét dài hất **từ dưới lên**; ツ hai chấm **ngang** phía trên, nét dài kéo **từ trên xuống**",
            "シャツ shatsu · サッカー sakkaa"
          ],
          [
            "ソ (so) · ン (n)",
            "ソ nét dài **từ trên xuống**; ン nét dài **hất từ dưới lên**",
            "ソース soosu · パン pan"
          ],
          [
            "ク (ku) · ケ (ke) · タ (ta)",
            "タ = ク thêm nét chéo giữa; ケ nét ngang **chìa ra** phải",
            "クラス kurasu · ケーキ keeki · タイ tai"
          ],
          [
            "ウ (u) · ワ (wa) · フ (fu)",
            "ウ có chấm trên đầu; ワ không chấm; フ chỉ **một nét** gập",
            "ウール uuru (len) · ワイン wain · フランス furansu"
          ],
          [
            "ノ (no) · メ (me) · ヌ (nu)",
            "メ = ノ + nét chéo; ヌ = フ + nét chéo",
            "ノート nooto · メロン meron · カヌー kanuu"
          ]
        ],
        "caption": "Cặp hay nhầm — đọc to cột giữa trước khi làm bài"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhận đúng chữ trong nhóm giống nhau (24 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-cn-nhan",
        "title": "Chọn đúng chữ (24 câu)",
        "items": [
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **sa**?",
            "options": [
              "ち",
              "さ",
              "き",
              "そ"
            ],
            "correct": 1,
            "why": "**さ** = sa — bụng quay sang trái. ち = chi · き = ki · そ = so."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **chi**?",
            "options": [
              "ち",
              "さ",
              "ら",
              "ろ"
            ],
            "correct": 0,
            "why": "**ち** = chi — bụng quay sang phải như số 5. さ = sa · ら = ra · ろ = ro."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ki**?",
            "options": [
              "さ",
              "ま",
              "ち",
              "き"
            ],
            "correct": 3,
            "why": "**き** = ki. さ = sa · ま = ma · ち = chi."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **nu**?",
            "options": [
              "め",
              "の",
              "ぬ",
              "ね"
            ],
            "correct": 2,
            "why": "**ぬ** = nu — có nút thắt ở đuôi (め thì không). め = me · の = no · ね = ne."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **me**?",
            "options": [
              "ぬ",
              "め",
              "あ",
              "の"
            ],
            "correct": 1,
            "why": "**め** = me — đuôi không có nút (ぬ thì có). ぬ = nu · あ = a · の = no."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ne**?",
            "options": [
              "ね",
              "れ",
              "わ",
              "ぬ"
            ],
            "correct": 0,
            "why": "**ね** = ne — đuôi cuộn vòng như đuôi mèo (ねこ). れ = re · わ = wa · ぬ = nu."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **re**?",
            "options": [
              "ね",
              "わ",
              "る",
              "れ"
            ],
            "correct": 3,
            "why": "**れ** = re — đuôi đá ra ngoài. ね = ne · わ = wa · る = ru."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **wa**?",
            "options": [
              "ね",
              "れ",
              "わ",
              "ら"
            ],
            "correct": 2,
            "why": "**わ** = wa — đuôi tròn khép vào. ね = ne · れ = re · ら = ra."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ru**?",
            "options": [
              "ろ",
              "る",
              "ら",
              "れ"
            ],
            "correct": 1,
            "why": "**る** = ru — có vòng tròn ở cuối. ろ = ro · ら = ra · れ = re."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ro**?",
            "options": [
              "ろ",
              "る",
              "ら",
              "ち"
            ],
            "correct": 0,
            "why": "**ろ** = ro — không có vòng. る = ru · ら = ra · ち = chi."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ha**?",
            "options": [
              "ほ",
              "け",
              "ま",
              "は"
            ],
            "correct": 3,
            "why": "**は** = ha — một nét ngang bên phải. ほ = ho · け = ke · ま = ma."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ho**?",
            "options": [
              "は",
              "け",
              "ほ",
              "ま"
            ],
            "correct": 2,
            "why": "**ほ** = ho — hai nét ngang bên phải. は = ha · け = ke · ま = ma."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ke**?",
            "options": [
              "は",
              "け",
              "ほ",
              "に"
            ],
            "correct": 1,
            "why": "**け** = ke. は = ha · ほ = ho · に = ni."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **i**?",
            "options": [
              "い",
              "り",
              "こ",
              "に"
            ],
            "correct": 0,
            "why": "**い** = i — nét phải NGẮN. り = ri · こ = ko · に = ni."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ri**?",
            "options": [
              "い",
              "こ",
              "け",
              "り"
            ],
            "correct": 3,
            "why": "**り** = ri — nét phải DÀI kéo xuống. い = i · こ = ko · け = ke."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ko**?",
            "options": [
              "い",
              "に",
              "こ",
              "た"
            ],
            "correct": 2,
            "why": "**こ** = ko. い = i · に = ni · た = ta."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **a**?",
            "options": [
              "お",
              "あ",
              "め",
              "の"
            ],
            "correct": 1,
            "why": "**あ** = a — nét chéo cắt qua giữa. お = o · め = me · の = no."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **o**?",
            "options": [
              "お",
              "あ",
              "む",
              "す"
            ],
            "correct": 0,
            "why": "**お** = o — có chấm nhỏ góc trên phải. あ = a · む = mu · す = su."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ku**?",
            "options": [
              "へ",
              "し",
              "つ",
              "く"
            ],
            "correct": 3,
            "why": "**く** = ku. へ = he · し = shi · つ = tsu."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **he**?",
            "options": [
              "く",
              "し",
              "へ",
              "そ"
            ],
            "correct": 2,
            "why": "**へ** = he. く = ku · し = shi · そ = so."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **shi**?",
            "options": [
              "つ",
              "し",
              "も",
              "く"
            ],
            "correct": 1,
            "why": "**し** = shi (Hepburn; gõ \"si\" cũng được nhưng sách và đề viết shi). つ = tsu · も = mo · く = ku."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **tsu**?",
            "options": [
              "つ",
              "し",
              "う",
              "て"
            ],
            "correct": 0,
            "why": "**つ** = tsu (không phải \"tu\"/\"su\"). し = shi · う = u · て = te."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **ma**?",
            "options": [
              "も",
              "ほ",
              "は",
              "ま"
            ],
            "correct": 3,
            "why": "**ま** = ma. も = mo · ほ = ho · は = ha."
          },
          {
            "q": "Trong các chữ trông giống nhau, chữ nào là **mo**?",
            "options": [
              "ま",
              "し",
              "も",
              "き"
            ],
            "correct": 2,
            "why": "**も** = mo. ま = ma · し = shi · き = ki."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · từ nào viết ĐÚNG? (20 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-cn-tu",
        "title": "Từ nào viết đúng? (20 câu)",
        "items": [
          {
            "q": "\"hoa anh đào\" (sakura) viết là:",
            "options": [
              "ちくら",
              "さくら",
              "きくら",
              "さくろ"
            ],
            "correct": 1,
            "why": "**さくら** (sakura). Các cách kia nhầm một chữ giống hình: ちくら = chikura · きくら = kikura · さくろ = sakuro."
          },
          {
            "q": "\"con chó\" (inu) viết là:",
            "options": [
              "いぬ",
              "いめ",
              "りぬ",
              "いね"
            ],
            "correct": 0,
            "why": "**いぬ** (inu). Các cách kia nhầm một chữ giống hình: いめ = ime · りぬ = rinu · いね = ine."
          },
          {
            "q": "\"mưa\" (ame) viết là:",
            "options": [
              "あぬ",
              "おめ",
              "あの",
              "あめ"
            ],
            "correct": 3,
            "why": "**あめ** (ame). Các cách kia nhầm một chữ giống hình: あぬ = anu · おめ = ome · あの = ano."
          },
          {
            "q": "\"con mèo\" (neko) viết là:",
            "options": [
              "れこ",
              "わこ",
              "ねこ",
              "ねい"
            ],
            "correct": 2,
            "why": "**ねこ** (neko). Các cách kia nhầm một chữ giống hình: れこ = reko · わこ = wako · ねい = nei."
          },
          {
            "q": "\"tôi\" (watashi) viết là:",
            "options": [
              "ねたし",
              "わたし",
              "れたし",
              "わたつ"
            ],
            "correct": 1,
            "why": "**わたし** (watashi). Các cách kia nhầm một chữ giống hình: ねたし = netashi · れたし = retashi · わたつ = watatsu."
          },
          {
            "q": "\"buổi tối\" (yoru) viết là:",
            "options": [
              "よる",
              "よろ",
              "まる",
              "よら"
            ],
            "correct": 0,
            "why": "**よる** (yoru). Các cách kia nhầm một chữ giống hình: よろ = yoro · まる = maru · よら = yora."
          },
          {
            "q": "\"hoa\" (hana) viết là:",
            "options": [
              "ほな",
              "けな",
              "はた",
              "はな"
            ],
            "correct": 3,
            "why": "**はな** (hana). Các cách kia nhầm một chữ giống hình: ほな = hona · けな = kena · はた = hata."
          },
          {
            "q": "\"quyển sách\" (hon) viết là:",
            "options": [
              "はん",
              "まん",
              "ほん",
              "ほそ"
            ],
            "correct": 2,
            "why": "**ほん** (hon). Các cách kia nhầm một chữ giống hình: はん = han · まん = man · ほそ = hoso."
          },
          {
            "q": "\"ngôi nhà\" (ie) viết là:",
            "options": [
              "りえ",
              "いえ",
              "こえ",
              "いふ"
            ],
            "correct": 1,
            "why": "**いえ** (ie). Các cách kia nhầm một chữ giống hình: りえ = rie · こえ = koe · いふ = ifu."
          },
          {
            "q": "\"chỗ này\" (koko) viết là:",
            "options": [
              "ここ",
              "いい",
              "にこ",
              "こい"
            ],
            "correct": 0,
            "why": "**ここ** (koko). Các cách kia nhầm một chữ giống hình: いい = ii · にこ = niko · こい = koi."
          },
          {
            "q": "\"tiền\" (okane) viết là:",
            "options": [
              "あかね",
              "おかれ",
              "おがね",
              "おかね"
            ],
            "correct": 3,
            "why": "**おかね** (okane). Các cách kia nhầm một chữ giống hình: あかね = akane · おかれ = okare · おがね = ogane."
          },
          {
            "q": "\"đất nước\" (kuni) viết là:",
            "options": [
              "へに",
              "くこ",
              "くに",
              "しに"
            ],
            "correct": 2,
            "why": "**くに** (kuni). Các cách kia nhầm một chữ giống hình: へに = heni · くこ = kuko · しに = shini."
          },
          {
            "q": "\"sushi\" (sushi) viết là:",
            "options": [
              "すつ",
              "すし",
              "むし",
              "すも"
            ],
            "correct": 1,
            "why": "**すし** (sushi). Các cách kia nhầm một chữ giống hình: すつ = sutsu · むし = mushi · すも = sumo."
          },
          {
            "q": "\"mùa hè\" (natsu) viết là:",
            "options": [
              "なつ",
              "なし",
              "たつ",
              "なう"
            ],
            "correct": 0,
            "why": "**なつ** (natsu). Các cách kia nhầm một chữ giống hình: なし = nashi · たつ = tatsu · なう = nau."
          },
          {
            "q": "\"tàu điện ngầm\" (chikatetsu) viết là:",
            "options": [
              "さかてつ",
              "ちかてし",
              "らかてつ",
              "ちかてつ"
            ],
            "correct": 3,
            "why": "**ちかてつ** (chikatetsu). Các cách kia nhầm một chữ giống hình: さかてつ = sakatetsu · ちかてし = chikateshi · らかてつ = rakatetsu."
          },
          {
            "q": "\"phía nam\" (minami) viết là:",
            "options": [
              "むなみ",
              "みたみ",
              "みなみ",
              "みなむ"
            ],
            "correct": 2,
            "why": "**みなみ** (minami). Các cách kia nhầm một chữ giống hình: むなみ = munami · みたみ = mitami · みなむ = minamu."
          },
          {
            "q": "\"phía bắc\" (kita) viết là:",
            "options": [
              "さた",
              "きた",
              "きな",
              "まだ"
            ],
            "correct": 1,
            "why": "**きた** (kita). Các cách kia nhầm một chữ giống hình: さた = sata · きな = kina · まだ = mada."
          },
          {
            "q": "\"mùa đông\" (fuyu) viết là:",
            "options": [
              "ふゆ",
              "ふよ",
              "ふや",
              "ぶゆ"
            ],
            "correct": 0,
            "why": "**ふゆ** (fuyu). Các cách kia nhầm một chữ giống hình: ふよ = fuyo · ふや = fuya · ぶゆ = buyu."
          },
          {
            "q": "\"cái này\" (kore) viết là:",
            "options": [
              "こね",
              "こわ",
              "いれ",
              "これ"
            ],
            "correct": 3,
            "why": "**これ** (kore). Các cách kia nhầm một chữ giống hình: こね = kone · こわ = kowa · いれ = ire."
          },
          {
            "q": "\"thành phố\" (machi) viết là:",
            "options": [
              "もち",
              "まさ",
              "まち",
              "ほち"
            ],
            "correct": 2,
            "why": "**まち** (machi). Các cách kia nhầm một chữ giống hình: もち = mochi · まさ = masa · ほち = hochi."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · katakana dễ nhầm (24 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-cn-kata",
        "title": "Chọn đúng chữ katakana (24 câu)",
        "items": [
          {
            "q": "Chữ katakana nào là **shi**?",
            "options": [
              "ツ",
              "シ",
              "ソ",
              "ン"
            ],
            "correct": 1,
            "why": "**シ** = shi. ツ = tsu · ソ = so · ン = n."
          },
          {
            "q": "Chữ katakana nào là **tsu**?",
            "options": [
              "ツ",
              "シ",
              "ソ",
              "ン"
            ],
            "correct": 0,
            "why": "**ツ** = tsu. シ = shi · ソ = so · ン = n."
          },
          {
            "q": "Chữ katakana nào là **so**?",
            "options": [
              "ン",
              "ツ",
              "リ",
              "ソ"
            ],
            "correct": 3,
            "why": "**ソ** = so. ン = n · ツ = tsu · リ = ri."
          },
          {
            "q": "Chữ katakana nào là **n**?",
            "options": [
              "ソ",
              "シ",
              "ン",
              "ツ"
            ],
            "correct": 2,
            "why": "**ン** = n. ソ = so · シ = shi · ツ = tsu."
          },
          {
            "q": "Chữ katakana nào là **ku**?",
            "options": [
              "ケ",
              "ク",
              "タ",
              "ワ"
            ],
            "correct": 1,
            "why": "**ク** = ku. ケ = ke · タ = ta · ワ = wa."
          },
          {
            "q": "Chữ katakana nào là **ke**?",
            "options": [
              "ケ",
              "ク",
              "タ",
              "ナ"
            ],
            "correct": 0,
            "why": "**ケ** = ke. ク = ku · タ = ta · ナ = na."
          },
          {
            "q": "Chữ katakana nào là **ta**?",
            "options": [
              "ク",
              "ケ",
              "ヌ",
              "タ"
            ],
            "correct": 3,
            "why": "**タ** = ta. ク = ku · ケ = ke · ヌ = nu."
          },
          {
            "q": "Chữ katakana nào là **u**?",
            "options": [
              "ワ",
              "フ",
              "ウ",
              "ラ"
            ],
            "correct": 2,
            "why": "**ウ** = u. ワ = wa · フ = fu · ラ = ra."
          },
          {
            "q": "Chữ katakana nào là **wa**?",
            "options": [
              "ウ",
              "ワ",
              "フ",
              "ク"
            ],
            "correct": 1,
            "why": "**ワ** = wa. ウ = u · フ = fu · ク = ku."
          },
          {
            "q": "Chữ katakana nào là **fu**?",
            "options": [
              "フ",
              "ワ",
              "ウ",
              "ヌ"
            ],
            "correct": 0,
            "why": "**フ** = fu. ワ = wa · ウ = u · ヌ = nu."
          },
          {
            "q": "Chữ katakana nào là **no**?",
            "options": [
              "ソ",
              "ン",
              "イ",
              "ノ"
            ],
            "correct": 3,
            "why": "**ノ** = no. ソ = so · ン = n · イ = i."
          },
          {
            "q": "Chữ katakana nào là **me**?",
            "options": [
              "ヌ",
              "ナ",
              "メ",
              "ノ"
            ],
            "correct": 2,
            "why": "**メ** = me. ヌ = nu · ナ = na · ノ = no."
          },
          {
            "q": "Chữ katakana nào là **nu**?",
            "options": [
              "ス",
              "ヌ",
              "メ",
              "フ"
            ],
            "correct": 1,
            "why": "**ヌ** = nu. ス = su · メ = me · フ = fu."
          },
          {
            "q": "Chữ katakana nào là **su**?",
            "options": [
              "ス",
              "ヌ",
              "ラ",
              "フ"
            ],
            "correct": 0,
            "why": "**ス** = su. ヌ = nu · ラ = ra · フ = fu."
          },
          {
            "q": "Chữ katakana nào là **chi**?",
            "options": [
              "テ",
              "ナ",
              "キ",
              "チ"
            ],
            "correct": 3,
            "why": "**チ** = chi. テ = te · ナ = na · キ = ki."
          },
          {
            "q": "Chữ katakana nào là **te**?",
            "options": [
              "チ",
              "ラ",
              "テ",
              "モ"
            ],
            "correct": 2,
            "why": "**テ** = te. チ = chi · ラ = ra · モ = mo."
          },
          {
            "q": "Chữ katakana nào là **ko**?",
            "options": [
              "ユ",
              "コ",
              "ロ",
              "エ"
            ],
            "correct": 1,
            "why": "**コ** = ko. ユ = yu · ロ = ro · エ = e."
          },
          {
            "q": "Chữ katakana nào là **yu**?",
            "options": [
              "ユ",
              "コ",
              "エ",
              "ヨ"
            ],
            "correct": 0,
            "why": "**ユ** = yu. コ = ko · エ = e · ヨ = yo."
          },
          {
            "q": "Chữ katakana nào là **ro**?",
            "options": [
              "コ",
              "ユ",
              "ヨ",
              "ロ"
            ],
            "correct": 3,
            "why": "**ロ** = ro. コ = ko · ユ = yu · ヨ = yo."
          },
          {
            "q": "Chữ katakana nào là **ru**?",
            "options": [
              "レ",
              "ハ",
              "ル",
              "リ"
            ],
            "correct": 2,
            "why": "**ル** = ru. レ = re · ハ = ha · リ = ri."
          },
          {
            "q": "Chữ katakana nào là **re**?",
            "options": [
              "ル",
              "レ",
              "ン",
              "ヒ"
            ],
            "correct": 1,
            "why": "**レ** = re. ル = ru · ン = n · ヒ = hi."
          },
          {
            "q": "Chữ katakana nào là **na**?",
            "options": [
              "ナ",
              "メ",
              "チ",
              "テ"
            ],
            "correct": 0,
            "why": "**ナ** = na. メ = me · チ = chi · テ = te."
          },
          {
            "q": "Chữ katakana nào là **ma**?",
            "options": [
              "ア",
              "ム",
              "ヤ",
              "マ"
            ],
            "correct": 3,
            "why": "**マ** = ma. ア = a · ム = mu · ヤ = ya."
          },
          {
            "q": "Chữ katakana nào là **a**?",
            "options": [
              "マ",
              "イ",
              "ア",
              "ヤ"
            ],
            "correct": 2,
            "why": "**ア** = a. マ = ma · イ = i · ヤ = ya."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-cn-kata-tu",
        "title": "Từ katakana nào viết đúng? (12 câu)",
        "items": [
          {
            "q": "\"áo sơ mi\" (shatsu) viết bằng katakana là:",
            "options": [
              "ツャツ",
              "シャツ",
              "シャシ",
              "ソャツ"
            ],
            "correct": 1,
            "why": "**シャツ** (shatsu). Các cách kia nhầm chữ: ツャツ · シャシ · ソャツ."
          },
          {
            "q": "\"bóng đá\" (sakkaa) viết bằng katakana là:",
            "options": [
              "サッカー",
              "サシカー",
              "サッケー",
              "サッター"
            ],
            "correct": 0,
            "why": "**サッカー** (sakkaa). Các cách kia nhầm chữ: サシカー · サッケー · サッター."
          },
          {
            "q": "\"bánh mì\" (pan) viết bằng katakana là:",
            "options": [
              "パソ",
              "パツ",
              "ハン",
              "パン"
            ],
            "correct": 3,
            "why": "**パン** (pan). Các cách kia nhầm chữ: パソ · パツ · ハン."
          },
          {
            "q": "\"nước sốt\" (soosu) viết bằng katakana là:",
            "options": [
              "ンース",
              "ソーヌ",
              "ソース",
              "ツース"
            ],
            "correct": 2,
            "why": "**ソース** (soosu). Các cách kia nhầm chữ: ンース · ソーヌ · ツース."
          },
          {
            "q": "\"bánh ngọt\" (keeki) viết bằng katakana là:",
            "options": [
              "クーキ",
              "ケーキ",
              "ターキ",
              "ケーモ"
            ],
            "correct": 1,
            "why": "**ケーキ** (keeki). Các cách kia nhầm chữ: クーキ · ターキ · ケーモ."
          },
          {
            "q": "\"rượu vang\" (wain) viết bằng katakana là:",
            "options": [
              "ワイン",
              "ウイン",
              "フイン",
              "ワイソ"
            ],
            "correct": 0,
            "why": "**ワイン** (wain). Các cách kia nhầm chữ: ウイン · フイン · ワイソ."
          },
          {
            "q": "\"dưa lưới\" (meron) viết bằng katakana là:",
            "options": [
              "ヌロン",
              "メコン",
              "ナロン",
              "メロン"
            ],
            "correct": 3,
            "why": "**メロン** (meron). Các cách kia nhầm chữ: ヌロン · メコン · ナロン."
          },
          {
            "q": "\"quần vợt\" (tenisu) viết bằng katakana là:",
            "options": [
              "チニス",
              "テニヌ",
              "テニス",
              "テコス"
            ],
            "correct": 2,
            "why": "**テニス** (tenisu). Các cách kia nhầm chữ: チニス · テニヌ · テコス."
          },
          {
            "q": "\"quyển vở\" (nooto) viết bằng katakana là:",
            "options": [
              "メート",
              "ノート",
              "ソート",
              "ノーイ"
            ],
            "correct": 1,
            "why": "**ノート** (nooto). Các cách kia nhầm chữ: メート · ソート · ノーイ."
          },
          {
            "q": "\"siêu thị\" (suupaa) viết bằng katakana là:",
            "options": [
              "スーパー",
              "ヌーパー",
              "ラーパー",
              "スーバー"
            ],
            "correct": 0,
            "why": "**スーパー** (suupaa). Các cách kia nhầm chữ: ヌーパー · ラーパー · スーバー."
          },
          {
            "q": "\"cà phê\" (koohii) viết bằng katakana là:",
            "options": [
              "ユーヒー",
              "ローヒー",
              "コーセー",
              "コーヒー"
            ],
            "correct": 3,
            "why": "**コーヒー** (koohii). Các cách kia nhầm chữ: ユーヒー · ローヒー · コーセー."
          },
          {
            "q": "\"nhà hàng\" (resutoran) viết bằng katakana là:",
            "options": [
              "ルストラン",
              "レヌトラン",
              "レストラン",
              "レストラソ"
            ],
            "correct": 2,
            "why": "**レストラン** (resutoran). Các cách kia nhầm chữ: ルストラン · レヌトラン · レストラソ."
          }
        ]
      },
      {
        "t": "write",
        "id": "lt-b0-cn-viet",
        "title": "Viết các cặp hay nhầm — viết cả cặp cạnh nhau, nói to chỗ khác nhau",
        "chars": [
          "さ",
          "ち",
          "ぬ",
          "め",
          "ね",
          "れ",
          "わ",
          "る",
          "ろ",
          "は",
          "ほ",
          "シ",
          "ツ",
          "ソ",
          "ン"
        ]
      }
    ]
  },
  {
    "id": "lt-b0-am-duc-ghep",
    "kind": "homework",
    "title": "Luyện thêm Bài 0 · Âm đục ゛, bán đục ゜ và âm ghép ゃゅょ — 97 câu",
    "goal": "Đọc đúng mọi chữ có dấu và âm ghép, phân biệt được かき/かぎ, びよういん/びょういん khi nhìn và khi nghe.",
    "minutes": 50,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "゛ (tenten) làm phụ âm \"đục\" đi: **k→g, s→z, t→d, h→b**. ゜ (maru) chỉ có ở hàng は: **h→p**.",
          "Âm ghép = chữ cột **i** + **ゃ ゅ ょ viết NHỎ** → đọc liền **một nhịp**: き+ゃ = きゃ kya. Viết ゃ to thì thành hai nhịp ki-ya — nghĩa khác hẳn.",
          "Làm 🟢 đọc chữ có dấu → 🟡 phân biệt cặp tối thiểu (かき/かぎ, びよういん/びょういん) → 🔴 gõ romaji của từ thật trong Bài 1–4 → nghe phân biệt."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đọc chữ có ゛ ゜ (25 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-dk-doc",
        "title": "Đọc chữ có dấu (25 câu)",
        "items": [
          {
            "q": "**が** đọc là gì?",
            "options": [
              "ka",
              "ga",
              "gi",
              "gu"
            ],
            "correct": 1,
            "why": "か (ka) + ゛ = **が ga**."
          },
          {
            "q": "**ぎ** đọc là gì?",
            "options": [
              "gi",
              "ki",
              "ga",
              "gu"
            ],
            "correct": 0,
            "why": "き (ki) + ゛ = **ぎ gi**."
          },
          {
            "q": "**ぐ** đọc là gì?",
            "options": [
              "ku",
              "ga",
              "gi",
              "gu"
            ],
            "correct": 3,
            "why": "く (ku) + ゛ = **ぐ gu**."
          },
          {
            "q": "**げ** đọc là gì?",
            "options": [
              "ke",
              "ga",
              "ge",
              "gi"
            ],
            "correct": 2,
            "why": "け (ke) + ゛ = **げ ge**."
          },
          {
            "q": "**ご** đọc là gì?",
            "options": [
              "ko",
              "go",
              "ga",
              "gi"
            ],
            "correct": 1,
            "why": "こ (ko) + ゛ = **ご go**."
          },
          {
            "q": "**ざ** đọc là gì?",
            "options": [
              "za",
              "sa",
              "zi",
              "zu"
            ],
            "correct": 0,
            "why": "さ (sa) + ゛ = **ざ za**."
          },
          {
            "q": "**じ** đọc là gì?",
            "options": [
              "shi",
              "chi",
              "gi",
              "ji"
            ],
            "correct": 3,
            "why": "し (shi) + ゛ = **じ ji**."
          },
          {
            "q": "**ず** đọc là gì?",
            "options": [
              "su",
              "tsu",
              "zu",
              "zo"
            ],
            "correct": 2,
            "why": "す (su) + ゛ = **ず zu**."
          },
          {
            "q": "**ぜ** đọc là gì?",
            "options": [
              "se",
              "ze",
              "za",
              "zi"
            ],
            "correct": 1,
            "why": "せ (se) + ゛ = **ぜ ze**."
          },
          {
            "q": "**ぞ** đọc là gì?",
            "options": [
              "zo",
              "so",
              "za",
              "zi"
            ],
            "correct": 0,
            "why": "そ (so) + ゛ = **ぞ zo**."
          },
          {
            "q": "**だ** đọc là gì?",
            "options": [
              "ta",
              "di",
              "du",
              "da"
            ],
            "correct": 3,
            "why": "た (ta) + ゛ = **だ da**."
          },
          {
            "q": "**ぢ** đọc là gì?",
            "options": [
              "chi",
              "shi",
              "ji",
              "gi"
            ],
            "correct": 2,
            "why": "ち (chi) + ゛ = **ぢ ji**. ぢ đọc giống じ — rất hiếm gặp (はなぢ, つづく)."
          },
          {
            "q": "**づ** đọc là gì?",
            "options": [
              "tsu",
              "zu",
              "su",
              "zo"
            ],
            "correct": 1,
            "why": "つ (tsu) + ゛ = **づ zu**. づ đọc giống ず — rất hiếm gặp (はなぢ, つづく)."
          },
          {
            "q": "**で** đọc là gì?",
            "options": [
              "de",
              "te",
              "da",
              "di"
            ],
            "correct": 0,
            "why": "て (te) + ゛ = **で de**."
          },
          {
            "q": "**ど** đọc là gì?",
            "options": [
              "to",
              "da",
              "di",
              "do"
            ],
            "correct": 3,
            "why": "と (to) + ゛ = **ど do**."
          },
          {
            "q": "**ば** đọc là gì?",
            "options": [
              "ha",
              "pa",
              "ba",
              "bi"
            ],
            "correct": 2,
            "why": "は (ha) + ゛ = **ば ba**."
          },
          {
            "q": "**び** đọc là gì?",
            "options": [
              "hi",
              "bi",
              "pi",
              "ba"
            ],
            "correct": 1,
            "why": "ひ (hi) + ゛ = **び bi**."
          },
          {
            "q": "**ぶ** đọc là gì?",
            "options": [
              "bu",
              "fu",
              "pu",
              "ba"
            ],
            "correct": 0,
            "why": "ふ (fu) + ゛ = **ぶ bu**."
          },
          {
            "q": "**べ** đọc là gì?",
            "options": [
              "he",
              "pe",
              "ba",
              "be"
            ],
            "correct": 3,
            "why": "へ (he) + ゛ = **べ be**."
          },
          {
            "q": "**ぼ** đọc là gì?",
            "options": [
              "ho",
              "po",
              "bo",
              "ba"
            ],
            "correct": 2,
            "why": "ほ (ho) + ゛ = **ぼ bo**."
          },
          {
            "q": "**ぱ** đọc là gì?",
            "options": [
              "ha",
              "pa",
              "ba",
              "pi"
            ],
            "correct": 1,
            "why": "は (ha) + ゜ = **ぱ pa**."
          },
          {
            "q": "**ぴ** đọc là gì?",
            "options": [
              "pi",
              "hi",
              "bi",
              "pa"
            ],
            "correct": 0,
            "why": "ひ (hi) + ゜ = **ぴ pi**."
          },
          {
            "q": "**ぷ** đọc là gì?",
            "options": [
              "fu",
              "bu",
              "pa",
              "pu"
            ],
            "correct": 3,
            "why": "ふ (fu) + ゜ = **ぷ pu**."
          },
          {
            "q": "**ぺ** đọc là gì?",
            "options": [
              "he",
              "be",
              "pe",
              "pa"
            ],
            "correct": 2,
            "why": "へ (he) + ゜ = **ぺ pe**."
          },
          {
            "q": "**ぽ** đọc là gì?",
            "options": [
              "ho",
              "po",
              "bo",
              "pa"
            ],
            "correct": 1,
            "why": "ほ (ho) + ゜ = **ぽ po**."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · có dấu hay không? to hay nhỏ? (24 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-dk-cap",
        "title": "Có dấu hay không? ゃゅょ to hay nhỏ? (24 câu)",
        "items": [
          {
            "q": "\"chìa khoá\" (kagi) viết là:",
            "options": [
              "かぎ",
              "かき",
              "がき",
              "がぎ"
            ],
            "correct": 0,
            "why": "**かぎ** = kagi (chìa khoá). かき = kaki là \"quả hồng\" — chỉ khác dấu ゛ mà đổi cả nghĩa."
          },
          {
            "q": "\"điện, đèn\" (denki) viết là:",
            "options": [
              "てんき",
              "でんぎ",
              "てんぎ",
              "でんき"
            ],
            "correct": 3,
            "why": "**でんき** = denki (điện, đèn). てんき = tenki là \"thời tiết\" — chỉ khác dấu ゛ mà đổi cả nghĩa."
          },
          {
            "q": "\"con lợn\" (buta) viết là:",
            "options": [
              "ふた",
              "ぷた",
              "ぶた",
              "ぶだ"
            ],
            "correct": 2,
            "why": "**ぶた** = buta (con lợn). ふた = futa là \"cái nắp\" — chỉ khác dấu ゛ mà đổi cả nghĩa."
          },
          {
            "q": "\"buổi chiều\" (gogo) viết là:",
            "options": [
              "ここ",
              "ごご",
              "こご",
              "ごこ"
            ],
            "correct": 1,
            "why": "**ごご** = gogo (buổi chiều). ここ = koko là \"chỗ này\" — chỉ khác dấu ゛ mà đổi cả nghĩa."
          },
          {
            "q": "\"trường học\" (gakkou) viết là:",
            "options": [
              "がっこう",
              "かっこう",
              "がっごう",
              "かっごう"
            ],
            "correct": 0,
            "why": "**がっこう** = gakkou (trường học). かっこう = kakkou là \"dáng vẻ\" — chỉ khác dấu ゛ mà đổi cả nghĩa."
          },
          {
            "q": "\"đại học\" (daigaku) viết là:",
            "options": [
              "たいがく",
              "だいかく",
              "たいかく",
              "だいがく"
            ],
            "correct": 3,
            "why": "**だいがく** = daigaku (đại học). Các cách kia thiếu/thừa dấu ゛ ゜ nên đọc sai: たいがく = taigaku · だいかく = daikaku · たいかく = taikaku."
          },
          {
            "q": "\"thời gian\" (jikan) viết là:",
            "options": [
              "しかん",
              "じがん",
              "じかん",
              "ちかん"
            ],
            "correct": 2,
            "why": "**じかん** = jikan (thời gian). Các cách kia thiếu/thừa dấu ゛ ゜ nên đọc sai: しかん = shikan · じがん = jigan · ちかん = chikan."
          },
          {
            "q": "\"đi dạo\" (sanpo) viết là:",
            "options": [
              "さんぼ",
              "さんぽ",
              "さんほ",
              "ざんぽ"
            ],
            "correct": 1,
            "why": "**さんぽ** = sanpo (đi dạo). Các cách kia thiếu/thừa dấu ゛ ゜ nên đọc sai: さんぼ = sanbo · さんほ = sanho · ざんぽ = zanpo."
          },
          {
            "q": "\"tempura\" (tenpura) viết là:",
            "options": [
              "てんぷら",
              "てんぶら",
              "でんぷら",
              "てんふら"
            ],
            "correct": 0,
            "why": "**てんぷら** = tenpura (tempura). Các cách kia thiếu/thừa dấu ゛ ゜ nên đọc sai: てんぶら = tenbura · でんぷら = denpura · てんふら = tenfura."
          },
          {
            "q": "\"cái cặp\" (kaban) viết là:",
            "options": [
              "かぱん",
              "がばん",
              "かはん",
              "かばん"
            ],
            "correct": 3,
            "why": "**かばん** = kaban (cái cặp). Các cách kia thiếu/thừa dấu ゛ ゜ nên đọc sai: かぱん = kapan · がばん = gaban · かはん = kahan."
          },
          {
            "q": "\"ngân hàng\" (ginkou) viết là:",
            "options": [
              "きんこう",
              "ぎんごう",
              "ぎんこう",
              "きんごう"
            ],
            "correct": 2,
            "why": "**ぎんこう** = ginkou (ngân hàng). Các cách kia thiếu/thừa dấu ゛ ゜ nên đọc sai: きんこう = kinkou · ぎんごう = gingou · きんごう = kingou."
          },
          {
            "q": "\"tiếng Nhật\" (nihongo) viết là:",
            "options": [
              "にほんこ",
              "にほんご",
              "にぼんご",
              "にほんごう"
            ],
            "correct": 1,
            "why": "**にほんご** = nihongo (tiếng Nhật). Các cách kia thiếu/thừa dấu ゛ ゜ nên đọc sai: にほんこ = nihonko · にぼんご = nibongo · にほんごう = nihongou."
          },
          {
            "q": "\"bệnh viện\" (byouin) viết là:",
            "options": [
              "びよういん",
              "びょういん",
              "びゅういん"
            ],
            "correct": 1,
            "why": "**びょういん** = byouin — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. びよういん (biyouin, chữ to) là \"tiệm làm tóc\"."
          },
          {
            "q": "\"mười\" (juu) viết là:",
            "options": [
              "じゆう",
              "じゅう",
              "じょう"
            ],
            "correct": 1,
            "why": "**じゅう** = juu — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. じゆう (jiyuu, chữ to) là \"tự do\"."
          },
          {
            "q": "\"hôm nay\" (kyou) viết là:",
            "options": [
              "きよう",
              "きょう",
              "きゅう"
            ],
            "correct": 1,
            "why": "**きょう** = kyou — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. きよう (kiyou, chữ to) là \"khéo tay\"."
          },
          {
            "q": "\"ký túc xá\" (ryou) viết là:",
            "options": [
              "りよう",
              "りょう",
              "りゅう"
            ],
            "correct": 1,
            "why": "**りょう** = ryou — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. りよう (riyou, chữ to) là \"sử dụng\"."
          },
          {
            "q": "\"một trăm\" (hyaku) viết là:",
            "options": [
              "ひやく",
              "ひゃく",
              "ひょく"
            ],
            "correct": 1,
            "why": "**ひゃく** = hyaku — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. ひやく (hiyaku, chữ to) là \"nhảy vọt\"."
          },
          {
            "q": "\"nhân viên công ty\" (shain) viết là:",
            "options": [
              "しやいん",
              "しゃいん",
              "しょいん"
            ],
            "correct": 1,
            "why": "**しゃいん** = shain — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. しやいん (chữ to) sẽ đọc thành shiyain — sai."
          },
          {
            "q": "\"trà\" (ocha) viết là:",
            "options": [
              "おちや",
              "おちゃ",
              "おちょ"
            ],
            "correct": 1,
            "why": "**おちゃ** = ocha — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. おちや (chữ to) sẽ đọc thành ochiya — sai."
          },
          {
            "q": "\"du lịch\" (ryokou) viết là:",
            "options": [
              "りよこう",
              "りょこう",
              "りゅこう"
            ],
            "correct": 1,
            "why": "**りょこう** = ryokou — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. りよこう (chữ to) sẽ đọc thành riyokou — sai."
          },
          {
            "q": "\"sở thích\" (shumi) viết là:",
            "options": [
              "しゆみ",
              "しゅみ",
              "しょみ"
            ],
            "correct": 1,
            "why": "**しゅみ** = shumi — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. しゆみ (chữ to) sẽ đọc thành shiyumi — sai."
          },
          {
            "q": "\"giờ học\" (jugyou) viết là:",
            "options": [
              "じゆぎよう",
              "じゅぎょう",
              "じゅぎゅう"
            ],
            "correct": 1,
            "why": "**じゅぎょう** = jugyou — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. じゆぎよう (chữ to) sẽ đọc thành jiyugiyou — sai."
          },
          {
            "q": "\"Trung Quốc\" (chuugoku) viết là:",
            "options": [
              "ちゆうごく",
              "ちゅうごく",
              "ちょうごく"
            ],
            "correct": 1,
            "why": "**ちゅうごく** = chuugoku — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. ちゆうごく (chữ to) sẽ đọc thành chiyuugoku — sai."
          },
          {
            "q": "\"thư viện\" (toshokan) viết là:",
            "options": [
              "としよかん",
              "としょかん",
              "としゅかん"
            ],
            "correct": 1,
            "why": "**としょかん** = toshokan — chữ ゃゅょ viết **nhỏ**, đọc liền một nhịp. としよかん (chữ to) sẽ đọc thành toshiyokan — sai."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · âm ghép: đọc và đếm nhịp (18 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-dk-ghep",
        "title": "Đọc âm ghép (18 câu)",
        "items": [
          {
            "q": "**きゃ** đọc là gì?",
            "options": [
              "kya",
              "kiya",
              "kyu",
              "ka"
            ],
            "correct": 0,
            "why": "き + ゃ (nhỏ) = **kya**, một nhịp."
          },
          {
            "q": "**きゅ** đọc là gì?",
            "options": [
              "kiyu",
              "kyo",
              "ku",
              "kyu"
            ],
            "correct": 3,
            "why": "き + ゅ (nhỏ) = **kyu**, một nhịp."
          },
          {
            "q": "**きょ** đọc là gì?",
            "options": [
              "kiyo",
              "kya",
              "kyo",
              "ko"
            ],
            "correct": 2,
            "why": "き + ょ (nhỏ) = **kyo**, một nhịp."
          },
          {
            "q": "**しゃ** đọc là gì?",
            "options": [
              "shiya",
              "sha",
              "shu",
              "sa"
            ],
            "correct": 1,
            "why": "し + ゃ (nhỏ) = **sha**, một nhịp. (Hepburn viết sh/ch/j, không viết sy/ty/zy.)"
          },
          {
            "q": "**しゅ** đọc là gì?",
            "options": [
              "shu",
              "shiyu",
              "sho",
              "su"
            ],
            "correct": 0,
            "why": "し + ゅ (nhỏ) = **shu**, một nhịp. (Hepburn viết sh/ch/j, không viết sy/ty/zy.)"
          },
          {
            "q": "**しょ** đọc là gì?",
            "options": [
              "shiyo",
              "sha",
              "so",
              "sho"
            ],
            "correct": 3,
            "why": "し + ょ (nhỏ) = **sho**, một nhịp. (Hepburn viết sh/ch/j, không viết sy/ty/zy.)"
          },
          {
            "q": "**ちゃ** đọc là gì?",
            "options": [
              "chiya",
              "chu",
              "cha",
              "ca"
            ],
            "correct": 2,
            "why": "ち + ゃ (nhỏ) = **cha**, một nhịp. (Hepburn viết sh/ch/j, không viết sy/ty/zy.)"
          },
          {
            "q": "**ちゅ** đọc là gì?",
            "options": [
              "chiyu",
              "chu",
              "cho",
              "cu"
            ],
            "correct": 1,
            "why": "ち + ゅ (nhỏ) = **chu**, một nhịp. (Hepburn viết sh/ch/j, không viết sy/ty/zy.)"
          },
          {
            "q": "**ちょ** đọc là gì?",
            "options": [
              "cho",
              "chiyo",
              "cha",
              "co"
            ],
            "correct": 0,
            "why": "ち + ょ (nhỏ) = **cho**, một nhịp. (Hepburn viết sh/ch/j, không viết sy/ty/zy.)"
          },
          {
            "q": "**にゃ** đọc là gì?",
            "options": [
              "niya",
              "nyu",
              "na",
              "nya"
            ],
            "correct": 3,
            "why": "に + ゃ (nhỏ) = **nya**, một nhịp."
          },
          {
            "q": "**ひゃ** đọc là gì?",
            "options": [
              "hiya",
              "hyu",
              "hya",
              "ha"
            ],
            "correct": 2,
            "why": "ひ + ゃ (nhỏ) = **hya**, một nhịp."
          },
          {
            "q": "**みゃ** đọc là gì?",
            "options": [
              "miya",
              "mya",
              "myu",
              "ma"
            ],
            "correct": 1,
            "why": "み + ゃ (nhỏ) = **mya**, một nhịp."
          },
          {
            "q": "**りゃ** đọc là gì?",
            "options": [
              "rya",
              "riya",
              "ryu",
              "ra"
            ],
            "correct": 0,
            "why": "り + ゃ (nhỏ) = **rya**, một nhịp."
          },
          {
            "q": "**りゅ** đọc là gì?",
            "options": [
              "riyu",
              "ryo",
              "ru",
              "ryu"
            ],
            "correct": 3,
            "why": "り + ゅ (nhỏ) = **ryu**, một nhịp."
          },
          {
            "q": "**りょ** đọc là gì?",
            "options": [
              "riyo",
              "rya",
              "ryo",
              "ro"
            ],
            "correct": 2,
            "why": "り + ょ (nhỏ) = **ryo**, một nhịp."
          },
          {
            "q": "**ぎゃ** đọc là gì?",
            "options": [
              "giya",
              "gya",
              "gyu",
              "ga"
            ],
            "correct": 1,
            "why": "ぎ + ゃ (nhỏ) = **gya**, một nhịp."
          },
          {
            "q": "**じゅ** đọc là gì?",
            "options": [
              "ju",
              "jiyu",
              "jo",
              "zu"
            ],
            "correct": 0,
            "why": "じ + ゅ (nhỏ) = **ju**, một nhịp. (Hepburn viết sh/ch/j, không viết sy/ty/zy.)"
          },
          {
            "q": "**びょ** đọc là gì?",
            "options": [
              "biyo",
              "bya",
              "bo",
              "byo"
            ],
            "correct": 3,
            "why": "び + ょ (nhỏ) = **byo**, một nhịp."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · gõ romaji của từ thật Bài 1–4 (24 câu)"
      },
      {
        "t": "quiz",
        "id": "lt-b0-dk-go",
        "title": "Gõ romaji — từ có dấu và âm ghép (24 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "「がくせい」 (học sinh) → romaji",
            "answers": [
              "gakusei"
            ]
          },
          {
            "q": "「だいがく」 (đại học) → romaji",
            "answers": [
              "daigaku"
            ]
          },
          {
            "q": "「でんしゃ」 (tàu điện) → romaji",
            "answers": [
              "densha",
              "densya"
            ]
          },
          {
            "q": "「じゅぎょう」 (giờ học) → romaji",
            "answers": [
              "jugyou",
              "jugyō",
              "zyugyou",
              "zyugyō"
            ]
          },
          {
            "q": "「しゅみ」 (sở thích) → romaji",
            "answers": [
              "shumi",
              "syumi"
            ]
          },
          {
            "q": "「りょこう」 (du lịch) → romaji",
            "answers": [
              "ryokou",
              "ryokō"
            ]
          },
          {
            "q": "「りょうり」 (nấu ăn) → romaji",
            "answers": [
              "ryouri",
              "ryōri"
            ]
          },
          {
            "q": "「ぎゅうにゅう」 (sữa bò) → romaji",
            "answers": [
              "gyuunyuu",
              "gyūnyū"
            ]
          },
          {
            "q": "「びょういん」 (bệnh viện) → romaji",
            "answers": [
              "byouin",
              "byōin"
            ]
          },
          {
            "q": "「ちゅうごく」 (Trung Quốc) → romaji",
            "answers": [
              "chuugoku",
              "chūgoku",
              "tyuugoku",
              "tyūgoku"
            ]
          },
          {
            "q": "「きょうし」 (giáo viên) → romaji",
            "answers": [
              "kyoushi",
              "kyousi",
              "kyōshi",
              "kyōsi"
            ]
          },
          {
            "q": "「しゃいん」 (nhân viên) → romaji",
            "answers": [
              "shain",
              "syain"
            ]
          },
          {
            "q": "「おちゃ」 (trà) → romaji",
            "answers": [
              "ocha",
              "otya"
            ]
          },
          {
            "q": "「ひゃく」 (một trăm) → romaji",
            "answers": [
              "hyaku"
            ]
          },
          {
            "q": "「さんびゃく」 (ba trăm) → romaji",
            "answers": [
              "sanbyaku"
            ]
          },
          {
            "q": "「としょかん」 (thư viện) → romaji",
            "answers": [
              "toshokan",
              "tosyokan"
            ]
          },
          {
            "q": "「にほんご」 (tiếng Nhật) → romaji",
            "answers": [
              "nihongo"
            ]
          },
          {
            "q": "「ぎんこう」 (ngân hàng) → romaji",
            "answers": [
              "ginkou",
              "ginkō"
            ]
          },
          {
            "q": "「じかん」 (thời gian) → romaji",
            "answers": [
              "jikan",
              "zikan"
            ]
          },
          {
            "q": "「どくしょ」 (đọc sách) → romaji",
            "answers": [
              "dokusho",
              "dokusyo"
            ]
          },
          {
            "q": "「たんじょうび」 (sinh nhật) → romaji",
            "answers": [
              "tanjoubi",
              "tanjōbi",
              "tanzyoubi",
              "tanzyōbi"
            ]
          },
          {
            "q": "「ゆうびんきょく」 (bưu điện) → romaji",
            "answers": [
              "yuubinkyoku",
              "yūbinkyoku"
            ]
          },
          {
            "q": "「じんじゃ」 (đền) → romaji",
            "answers": [
              "jinja",
              "zinzya"
            ]
          },
          {
            "q": "「しんかんせん」 (tàu Shinkansen) → romaji",
            "answers": [
              "shinkansen",
              "sinkansen"
            ]
          }
        ],
        "grammar": "Gõ Hepburn: sha/shu/sho, cha/chu/cho, ja/ju/jo; trường âm gõ đôi (ou, uu)."
      },
      {
        "t": "h",
        "text": "🔴 Nghe phân biệt — ゃゅょ to hay nhỏ, có ゛ hay không"
      },
      {
        "t": "listen",
        "id": "lt-b0-dk-nghe",
        "title": "Nghe 6 từ — mỗi từ một lần",
        "lines": [
          {
            "who": "①",
            "voice": "ja-nu",
            "text": "びょういん",
            "ro": "byouin",
            "vi": "bệnh viện"
          },
          {
            "who": "②",
            "voice": "ja-nu",
            "text": "じゆう",
            "ro": "jiyuu",
            "vi": "tự do"
          },
          {
            "who": "③",
            "voice": "ja-nu",
            "text": "かぎ",
            "ro": "kagi",
            "vi": "chìa khoá"
          },
          {
            "who": "④",
            "voice": "ja-nu",
            "text": "きょう",
            "ro": "kyou",
            "vi": "hôm nay"
          },
          {
            "who": "⑤",
            "voice": "ja-nu",
            "text": "てんき",
            "ro": "tenki",
            "vi": "thời tiết"
          },
          {
            "who": "⑥",
            "voice": "ja-nu",
            "text": "ひゃく",
            "ro": "hyaku",
            "vi": "một trăm"
          }
        ],
        "note": "Nghe từng từ, chưa mở lời thoại; làm câu hỏi bên dưới rồi mới bấm xem."
      },
      {
        "t": "mcq",
        "id": "lt-b0-dk-nghe-q",
        "title": "Câu hỏi nghe ①–⑥",
        "items": [
          {
            "q": "① Bạn nghe thấy từ nào?",
            "options": [
              "びょういん",
              "びよういん"
            ],
            "correct": 0,
            "why": "Đã đọc **びょういん** (byouin, bệnh viện). びよういん đọc là biyouin."
          },
          {
            "q": "② Bạn nghe thấy từ nào?",
            "options": [
              "じゅう",
              "じゆう"
            ],
            "correct": 1,
            "why": "Đã đọc **じゆう** (jiyuu, tự do). じゅう đọc là juu."
          },
          {
            "q": "③ Bạn nghe thấy từ nào?",
            "options": [
              "かぎ",
              "かき"
            ],
            "correct": 0,
            "why": "Đã đọc **かぎ** (kagi, chìa khoá). かき đọc là kaki."
          },
          {
            "q": "④ Bạn nghe thấy từ nào?",
            "options": [
              "きよう",
              "きょう"
            ],
            "correct": 1,
            "why": "Đã đọc **きょう** (kyou, hôm nay). きよう đọc là kiyou."
          },
          {
            "q": "⑤ Bạn nghe thấy từ nào?",
            "options": [
              "てんき",
              "でんき"
            ],
            "correct": 0,
            "why": "Đã đọc **てんき** (tenki, thời tiết). でんき đọc là denki."
          },
          {
            "q": "⑥ Bạn nghe thấy từ nào?",
            "options": [
              "ひやく",
              "ひゃく"
            ],
            "correct": 1,
            "why": "Đã đọc **ひゃく** (hyaku, một trăm). ひやく đọc là hiyaku."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b0-am-dac-biet",
    "kind": "homework",
    "title": "Luyện thêm Bài 0 · っ, trường âm, ん và は・へ・を — nghe phân biệt (おばさん/おばあさん, きて/きって…) — 62 câu",
    "goal": "Nghe và đọc đúng độ dài âm: phân biệt được おばさん/おばあさん, きて/きって, ビル/ビール; đếm đúng nhịp; đọc đúng は・へ・を khi là trợ từ.",
    "minutes": 50,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Tiếng Nhật đọc theo **nhịp** (mỗi chữ thường = 1 nhịp). **っ nhỏ** = 1 nhịp im lặng (ngắt hơi); **trường âm** (kéo dài nguyên âm) = thêm 1 nhịp; **ん** = 1 nhịp riêng.",
          "Thiếu hay thừa một nhịp là **đổi nghĩa**: おばさん (cô) ≠ おばあさん (bà), きて (hãy đến) ≠ きって (con tem). Đây là lỗi Reading phổ biến nhất của người Việt vì tiếng Việt không có độ dài nguyên âm.",
          "Làm theo thứ tự: nghe 🟢 → chọn chữ khi nghe romaji 🟡 → đếm nhịp 🟡 → は・へ・を 🔴 → đọc to cho máy chấm 🔴. Khi nghe: **vỗ tay theo nhịp** — mỗi tiếng vỗ một nhịp."
        ]
      },
      {
        "t": "table",
        "head": [
          "Hiện tượng",
          "Viết",
          "Đọc",
          "Ví dụ"
        ],
        "rows": [
          [
            "Âm ngắt っ (nhỏ)",
            "っ đứng trước phụ âm",
            "ngừng 1 nhịp, rồi bật phụ âm sau (gõ đôi phụ âm)",
            "きって kitte · がっこう gakkou · ざっし zasshi"
          ],
          [
            "Trường âm",
            "あ/い/う/え/お kéo dài; えい, おう; katakana ー",
            "kéo dài thêm 1 nhịp",
            "おばあさん obaasan · せんせい sensei · こうこう koukou · コーヒー koohii"
          ],
          [
            "ん",
            "ん / ン",
            "1 nhịp mũi; trước b/p/m nghe như \"m\"",
            "ほん hon · さんぽ sanpo · きんえん kin'en"
          ],
          [
            "Trợ từ は・へ・を",
            "viết は・へ・を",
            "đọc **wa · e · o**",
            "わたしは wa · がっこうへ e · パンを o"
          ]
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nghe và chọn — trường âm & っ (20 câu)"
      },
      {
        "t": "listen",
        "id": "lt-b0-db-nghe-1",
        "title": "① Trường âm — 10 từ",
        "lines": [
          {
            "who": "①",
            "voice": "ja-nu",
            "text": "おばあさん",
            "ro": "obaasan",
            "vi": "bà"
          },
          {
            "who": "②",
            "voice": "ja-nu",
            "text": "おじさん",
            "ro": "ojisan",
            "vi": "chú, bác"
          },
          {
            "who": "③",
            "voice": "ja-nu",
            "text": "こうこう",
            "ro": "koukou",
            "vi": "trường cấp 3"
          },
          {
            "who": "④",
            "voice": "ja-nu",
            "text": "とり",
            "ro": "tori",
            "vi": "con chim"
          },
          {
            "who": "⑤",
            "voice": "ja-nu",
            "text": "ええ",
            "ro": "ee",
            "vi": "vâng (thân mật)"
          },
          {
            "who": "⑥",
            "voice": "ja-nu",
            "text": "ゆき",
            "ro": "yuki",
            "vi": "tuyết"
          },
          {
            "who": "⑦",
            "voice": "ja-nu",
            "text": "いいえ",
            "ro": "iie",
            "vi": "không"
          },
          {
            "who": "⑧",
            "voice": "ja-nu",
            "text": "ビル",
            "ro": "biru",
            "vi": "toà nhà"
          },
          {
            "who": "⑨",
            "voice": "ja-nu",
            "text": "せんせい",
            "ro": "sensei",
            "vi": "thầy cô"
          },
          {
            "who": "⑩",
            "voice": "ja-nu",
            "text": "くき",
            "ro": "kuki",
            "vi": "thân cây"
          }
        ],
        "note": "Mỗi từ đọc một lần. Đếm nhịp bằng tay khi nghe."
      },
      {
        "t": "mcq",
        "id": "lt-b0-db-nghe-1-q",
        "title": "Câu hỏi ① — trường âm (10 câu)",
        "items": [
          {
            "q": "① Bạn nghe thấy từ nào?",
            "options": [
              "おばあさん",
              "おばさん"
            ],
            "correct": 0,
            "why": "Đã đọc **おばあさん** (obaasan, bà) — 5 nhịp. おばさん (obasan) có 4 nhịp, nghĩa là \"cô, dì\"."
          },
          {
            "q": "② Bạn nghe thấy từ nào?",
            "options": [
              "おじいさん",
              "おじさん"
            ],
            "correct": 1,
            "why": "Đã đọc **おじさん** (ojisan, chú, bác) — 4 nhịp. おじいさん (ojiisan) có 5 nhịp, nghĩa là \"ông\"."
          },
          {
            "q": "③ Bạn nghe thấy từ nào?",
            "options": [
              "こうこう",
              "ここ"
            ],
            "correct": 0,
            "why": "Đã đọc **こうこう** (koukou, trường cấp 3) — 4 nhịp. ここ (koko) có 2 nhịp, nghĩa là \"chỗ này\"."
          },
          {
            "q": "④ Bạn nghe thấy từ nào?",
            "options": [
              "とおり",
              "とり"
            ],
            "correct": 1,
            "why": "Đã đọc **とり** (tori, con chim) — 2 nhịp. とおり (toori) có 3 nhịp, nghĩa là \"con đường\"."
          },
          {
            "q": "⑤ Bạn nghe thấy từ nào?",
            "options": [
              "ええ",
              "え"
            ],
            "correct": 0,
            "why": "Đã đọc **ええ** (ee, vâng (thân mật)) — 2 nhịp. え (e) có 1 nhịp, nghĩa là \"bức tranh\"."
          },
          {
            "q": "⑥ Bạn nghe thấy từ nào?",
            "options": [
              "ゆうき",
              "ゆき"
            ],
            "correct": 1,
            "why": "Đã đọc **ゆき** (yuki, tuyết) — 2 nhịp. ゆうき (yuuki) có 3 nhịp, nghĩa là \"dũng khí\"."
          },
          {
            "q": "⑦ Bạn nghe thấy từ nào?",
            "options": [
              "いいえ",
              "いえ"
            ],
            "correct": 0,
            "why": "Đã đọc **いいえ** (iie, không) — 3 nhịp. いえ (ie) có 2 nhịp, nghĩa là \"ngôi nhà\"."
          },
          {
            "q": "⑧ Bạn nghe thấy từ nào?",
            "options": [
              "ビール",
              "ビル"
            ],
            "correct": 1,
            "why": "Đã đọc **ビル** (biru, toà nhà) — 2 nhịp. ビール (biiru) có 3 nhịp, nghĩa là \"bia\"."
          },
          {
            "q": "⑨ Bạn nghe thấy từ nào?",
            "options": [
              "せんせい",
              "せんせ"
            ],
            "correct": 0,
            "why": "Đã đọc **せんせい** (sensei, thầy cô) — 4 nhịp. せんせ (sense) có 3 nhịp."
          },
          {
            "q": "⑩ Bạn nghe thấy từ nào?",
            "options": [
              "くうき",
              "くき"
            ],
            "correct": 1,
            "why": "Đã đọc **くき** (kuki, thân cây) — 2 nhịp. くうき (kuuki) có 3 nhịp, nghĩa là \"không khí\"."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b0-db-nghe-2",
        "title": "② Âm ngắt っ — 10 từ",
        "lines": [
          {
            "who": "①",
            "voice": "ja-nam",
            "text": "きって",
            "ro": "kitte",
            "vi": "con tem"
          },
          {
            "who": "②",
            "voice": "ja-nam",
            "text": "さか",
            "ro": "saka",
            "vi": "con dốc"
          },
          {
            "who": "③",
            "voice": "ja-nam",
            "text": "いった",
            "ro": "itta",
            "vi": "đã đi"
          },
          {
            "who": "④",
            "voice": "ja-nam",
            "text": "おと",
            "ro": "oto",
            "vi": "âm thanh"
          },
          {
            "who": "⑤",
            "voice": "ja-nam",
            "text": "かっこ",
            "ro": "kakko",
            "vi": "dấu ngoặc"
          },
          {
            "who": "⑥",
            "voice": "ja-nam",
            "text": "ぶか",
            "ro": "buka",
            "vi": "cấp dưới"
          },
          {
            "who": "⑦",
            "voice": "ja-nam",
            "text": "いっち",
            "ro": "itchi",
            "vi": "sự trùng khớp"
          },
          {
            "who": "⑧",
            "voice": "ja-nam",
            "text": "はか",
            "ro": "haka",
            "vi": "ngôi mộ"
          },
          {
            "who": "⑨",
            "voice": "ja-nam",
            "text": "ざっし",
            "ro": "zasshi",
            "vi": "tạp chí"
          },
          {
            "who": "⑩",
            "voice": "ja-nam",
            "text": "がっこう",
            "ro": "gakkou",
            "vi": "trường học"
          }
        ],
        "note": "Nghe chỗ \"khựng\" một nhịp trước phụ âm: きって = ki・(ngừng)・te."
      },
      {
        "t": "mcq",
        "id": "lt-b0-db-nghe-2-q",
        "title": "Câu hỏi ② — âm ngắt っ (10 câu)",
        "items": [
          {
            "q": "① Bạn nghe thấy từ nào?",
            "options": [
              "きて",
              "きって"
            ],
            "correct": 1,
            "why": "Đã đọc **きって** (kitte, con tem). きて (kite) = \"hãy đến\"."
          },
          {
            "q": "② Bạn nghe thấy từ nào?",
            "options": [
              "さか",
              "さっか"
            ],
            "correct": 0,
            "why": "Đã đọc **さか** (saka, con dốc). さっか (sakka) = \"nhà văn\"."
          },
          {
            "q": "③ Bạn nghe thấy từ nào?",
            "options": [
              "いた",
              "いった"
            ],
            "correct": 1,
            "why": "Đã đọc **いった** (itta, đã đi). いた (ita) = \"đã ở\"."
          },
          {
            "q": "④ Bạn nghe thấy từ nào?",
            "options": [
              "おと",
              "おっと"
            ],
            "correct": 0,
            "why": "Đã đọc **おと** (oto, âm thanh). おっと (otto) = \"chồng\"."
          },
          {
            "q": "⑤ Bạn nghe thấy từ nào?",
            "options": [
              "かこ",
              "かっこ"
            ],
            "correct": 1,
            "why": "Đã đọc **かっこ** (kakko, dấu ngoặc). かこ (kako) = \"quá khứ\"."
          },
          {
            "q": "⑥ Bạn nghe thấy từ nào?",
            "options": [
              "ぶか",
              "ぶっか"
            ],
            "correct": 0,
            "why": "Đã đọc **ぶか** (buka, cấp dưới). ぶっか (bukka) = \"vật giá\"."
          },
          {
            "q": "⑦ Bạn nghe thấy từ nào?",
            "options": [
              "いち",
              "いっち"
            ],
            "correct": 1,
            "why": "Đã đọc **いっち** (itchi, sự trùng khớp). いち (ichi) = \"số một\"."
          },
          {
            "q": "⑧ Bạn nghe thấy từ nào?",
            "options": [
              "はか",
              "はっか"
            ],
            "correct": 0,
            "why": "Đã đọc **はか** (haka, ngôi mộ). はっか (hakka) = \"bạc hà\"."
          },
          {
            "q": "⑨ Bạn nghe thấy từ nào?",
            "options": [
              "ざし",
              "ざっし"
            ],
            "correct": 1,
            "why": "Đã đọc **ざっし** (zasshi, tạp chí). ざし (zashi) không phải từ đúng."
          },
          {
            "q": "⑩ Bạn nghe thấy từ nào?",
            "options": [
              "がっこう",
              "がこう"
            ],
            "correct": 0,
            "why": "Đã đọc **がっこう** (gakkou, trường học). がこう (gakou) không phải từ đúng."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · nhìn romaji → chọn đúng chữ (16 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-db-chon",
        "title": "Nhìn romaji chọn chữ (16 câu)",
        "items": [
          {
            "q": "**obaasan** viết là:",
            "options": [
              "おばあさん",
              "おばさん",
              "おばあさ",
              "おばあん"
            ],
            "correct": 0,
            "why": "obaasan = **おばあさん**. Đếm nhịp: お・ば・あ・さ・ん → 5 nhịp."
          },
          {
            "q": "**ojisan** viết là:",
            "options": [
              "おじいさん",
              "おしさん",
              "おじさ",
              "おじさん"
            ],
            "correct": 3,
            "why": "ojisan = **おじさん**. Đếm nhịp: お・じ・さ・ん → 4 nhịp."
          },
          {
            "q": "**kitte** viết là:",
            "options": [
              "きて",
              "きつて",
              "きって",
              "きいて"
            ],
            "correct": 2,
            "why": "kitte = **きって**. Đếm nhịp: き・っ・て → 3 nhịp."
          },
          {
            "q": "**gakkou** viết là:",
            "options": [
              "がこう",
              "がっこう",
              "がっこ",
              "がつこう"
            ],
            "correct": 1,
            "why": "gakkou = **がっこう**. Đếm nhịp: が・っ・こ・う → 4 nhịp."
          },
          {
            "q": "**sensei** viết là:",
            "options": [
              "せんせい",
              "せんせ",
              "せいせい",
              "せんせえ"
            ],
            "correct": 0,
            "why": "sensei = **せんせい**. Đếm nhịp: せ・ん・せ・い → 4 nhịp."
          },
          {
            "q": "**koukou** viết là:",
            "options": [
              "ここ",
              "こっこう",
              "こうこ",
              "こうこう"
            ],
            "correct": 3,
            "why": "koukou = **こうこう**. Đếm nhịp: こ・う・こ・う → 4 nhịp."
          },
          {
            "q": "**zasshi** viết là:",
            "options": [
              "ざし",
              "ざつし",
              "ざっし",
              "さっし"
            ],
            "correct": 2,
            "why": "zasshi = **ざっし**. Đếm nhịp: ざ・っ・し → 3 nhịp."
          },
          {
            "q": "**kyou** viết là:",
            "options": [
              "きよう",
              "きょう",
              "きょ",
              "きゅう"
            ],
            "correct": 1,
            "why": "kyou = **きょう**. Đếm nhịp: きょ・う → 2 nhịp."
          },
          {
            "q": "**ryokou** viết là:",
            "options": [
              "りょこう",
              "りょうこう",
              "りよこう",
              "りょこ"
            ],
            "correct": 0,
            "why": "ryokou = **りょこう**. Đếm nhịp: りょ・こ・う → 3 nhịp."
          },
          {
            "q": "**ryouri** viết là:",
            "options": [
              "りょり",
              "りようり",
              "りょうりい",
              "りょうり"
            ],
            "correct": 3,
            "why": "ryouri = **りょうり**. Đếm nhịp: りょ・う・り → 3 nhịp."
          },
          {
            "q": "**juu** viết là:",
            "options": [
              "じゆう",
              "じゅ",
              "じゅう",
              "じょう"
            ],
            "correct": 2,
            "why": "juu = **じゅう**. Đếm nhịp: じゅ・う → 2 nhịp."
          },
          {
            "q": "**chotto** viết là:",
            "options": [
              "ちょと",
              "ちょっと",
              "ちよっと",
              "ちょっとう"
            ],
            "correct": 1,
            "why": "chotto = **ちょっと**. Đếm nhịp: ちょ・っ・と → 3 nhịp."
          },
          {
            "q": "**kin'en** viết là:",
            "options": [
              "きんえん",
              "きねん",
              "きんねん",
              "きえん"
            ],
            "correct": 0,
            "why": "kin'en = **きんえん**. Đếm nhịp: き・ん・え・ん → 4 nhịp."
          },
          {
            "q": "**shinbun** viết là:",
            "options": [
              "しぶん",
              "しんぶ",
              "しんぷん",
              "しんぶん"
            ],
            "correct": 3,
            "why": "shinbun = **しんぶん**. Đếm nhịp: し・ん・ぶ・ん → 4 nhịp."
          },
          {
            "q": "**hon** viết là:",
            "options": [
              "ほ",
              "ほお",
              "ほん",
              "ほんん"
            ],
            "correct": 2,
            "why": "hon = **ほん**. Đếm nhịp: ほ・ん → 2 nhịp."
          },
          {
            "q": "**kooto** viết là:",
            "options": [
              "コト",
              "コート",
              "コオト",
              "コーットー"
            ],
            "correct": 1,
            "why": "kooto = **コート**. Đếm nhịp: コ・ー・ト → 3 nhịp."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đếm nhịp (14 câu)"
      },
      {
        "t": "quiz",
        "id": "lt-b0-db-nhip",
        "title": "Đếm nhịp — viết số (14 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "「きって」 (con tem) có mấy nhịp? (viết số)",
            "answers": [
              "3"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「がっこう」 (trường học) có mấy nhịp? (viết số)",
            "answers": [
              "4"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「おばあさん」 (bà) có mấy nhịp? (viết số)",
            "answers": [
              "5"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「おばさん」 (cô, dì) có mấy nhịp? (viết số)",
            "answers": [
              "4"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「せんせい」 (thầy cô) có mấy nhịp? (viết số)",
            "answers": [
              "4"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「とうきょう」 (Tokyo) có mấy nhịp? (viết số)",
            "answers": [
              "4"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「しゃしん」 (ảnh) có mấy nhịp? (viết số)",
            "answers": [
              "3"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「じゅぎょう」 (giờ học) có mấy nhịp? (viết số)",
            "answers": [
              "3"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「にほん」 (Nhật Bản) có mấy nhịp? (viết số)",
            "answers": [
              "3"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「コーヒー」 (cà phê) có mấy nhịp? (viết số)",
            "answers": [
              "4"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「びょういん」 (bệnh viện) có mấy nhịp? (viết số)",
            "answers": [
              "4"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「びよういん」 (tiệm làm tóc) có mấy nhịp? (viết số)",
            "answers": [
              "5"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「ちょっと」 (một chút) có mấy nhịp? (viết số)",
            "answers": [
              "3"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          },
          {
            "q": "「きょう」 (hôm nay) có mấy nhịp? (viết số)",
            "answers": [
              "2"
            ],
            "hint": "ゃゅょ nhỏ không tính nhịp riêng; っ, ー, ん mỗi cái 1 nhịp"
          }
        ],
        "grammar": "Mỗi chữ = 1 nhịp, trừ ゃゅょ nhỏ (ghép vào chữ trước). っ = 1 nhịp, ー = 1 nhịp, ん = 1 nhịp."
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · trợ từ は・へ・を và ん đọc thế nào (12 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-db-tro-tu",
        "title": "は・へ・を · cách đọc ん (12 câu)",
        "items": [
          {
            "q": "Trong 「わたし**は** がくせいです。」, chữ in đậm đọc là gì?",
            "options": [
              "wa",
              "ha",
              "ba",
              "o"
            ],
            "correct": 0,
            "why": "Trợ từ chủ đề は đọc **wa**. Romaji: watashi wa gakusei desu."
          },
          {
            "q": "Trong 「がっこう**へ** いきます。」, chữ in đậm đọc là gì?",
            "options": [
              "he",
              "hi",
              "o",
              "e"
            ],
            "correct": 3,
            "why": "Trợ từ hướng へ đọc **e**. Romaji: gakkou e ikimasu."
          },
          {
            "q": "Trong 「パン**を** たべます。」, chữ in đậm đọc là gì?",
            "options": [
              "wo (bật rõ w)",
              "wa",
              "o",
              "e"
            ],
            "correct": 2,
            "why": "Trợ từ を đọc **o** (y hệt お). Romaji: pan o tabemasu."
          },
          {
            "q": "Trong 「**は**な (hoa)」, chữ in đậm đọc là gì?",
            "options": [
              "wa",
              "ha",
              "ho",
              "ba"
            ],
            "correct": 1,
            "why": "は nằm TRONG từ (không phải trợ từ) → đọc **ha**. Romaji: hana."
          },
          {
            "q": "Trong 「**へ**や (căn phòng)」, chữ in đậm đọc là gì?",
            "options": [
              "he",
              "e",
              "ha",
              "ke"
            ],
            "correct": 0,
            "why": "へ trong từ → **he**; chỉ khi là trợ từ mới đọc e. Romaji: heya."
          },
          {
            "q": "Trong 「こんにち**は**」, chữ in đậm đọc là gì?",
            "options": [
              "ha",
              "ba",
              "a",
              "wa"
            ],
            "correct": 3,
            "why": "こんにちは viết は, đọc **wa** (gốc là trợ từ). ~~こんにちわ~~ là sai chính tả. Romaji: konnichiwa."
          },
          {
            "q": "Trong 「うち**へ** かえります。」, chữ in đậm đọc là gì?",
            "options": [
              "he",
              "we",
              "e",
              "hi"
            ],
            "correct": 2,
            "why": "Trợ từ へ → **e**. Romaji: uchi e kaerimasu."
          },
          {
            "q": "Trong 「ほん**を** よみます。」, chữ in đậm đọc là gì?",
            "options": [
              "wo (bật rõ w)",
              "o",
              "wa",
              "u"
            ],
            "correct": 1,
            "why": "を → **o**. Romaji: hon o yomimasu."
          },
          {
            "q": "Trong 「さんぽ」 (sanpo), ん đọc thế nào?",
            "options": [
              "m",
              "ng",
              "n mũi kéo dài",
              "không đọc"
            ],
            "correct": 0,
            "why": "ん đứng trước **p** → môi khép lại thành \"m\": sanpo nghe như \"sampo\"."
          },
          {
            "q": "Trong 「しんぶん」 (shinbun), ん đọc thế nào?",
            "options": [
              "ng",
              "n mũi kéo dài",
              "không đọc",
              "m"
            ],
            "correct": 3,
            "why": "ん trước **b** → nghe như \"m\": shinbun ~ \"shimbun\"."
          },
          {
            "q": "Trong 「ほん」 (hon), ん đọc thế nào?",
            "options": [
              "m",
              "ng",
              "n mũi kéo dài",
              "không đọc"
            ],
            "correct": 2,
            "why": "ん cuối từ là âm mũi kéo dài 1 nhịp, lưỡi không chạm răng như \"n\" của ta."
          },
          {
            "q": "Trong 「きんえん」 (kin'en), ん đọc thế nào?",
            "options": [
              "dính thành ki・nen",
              "tách nhịp kin・en",
              "bỏ ん",
              "đọc thành m"
            ],
            "correct": 1,
            "why": "ん trước nguyên âm vẫn là MỘT nhịp riêng: ki・n・e・n (4 nhịp) — khác きねん (ki・ne・n, \"kỷ niệm\")."
          }
        ]
      },
      {
        "t": "phatam",
        "id": "lt-b0-db-doc-to",
        "title": "Đọc to từng cặp — máy chấm độ dài âm",
        "items": [
          {
            "text": "おばさん・おばあさん",
            "ipa": "obasan obaasan",
            "vi": "cô, dì · bà"
          },
          {
            "text": "おじさん・おじいさん",
            "ipa": "ojisan ojiisan",
            "vi": "chú · ông"
          },
          {
            "text": "きて・きって",
            "ipa": "kite kitte",
            "vi": "hãy đến · con tem"
          },
          {
            "text": "ここ・こうこう",
            "ipa": "koko koukou",
            "vi": "chỗ này · trường cấp 3"
          },
          {
            "text": "ゆき・ゆうき",
            "ipa": "yuki yuuki",
            "vi": "tuyết · dũng khí"
          },
          {
            "text": "いえ・いいえ",
            "ipa": "ie iie",
            "vi": "ngôi nhà · không"
          },
          {
            "text": "ビル・ビール",
            "ipa": "biru biiru",
            "vi": "toà nhà · bia"
          },
          {
            "text": "さか・さっか",
            "ipa": "saka sakka",
            "vi": "con dốc · nhà văn"
          },
          {
            "text": "きねん・きんえん",
            "ipa": "kinen kin'en",
            "vi": "kỷ niệm · cấm hút thuốc"
          },
          {
            "text": "びよういん・びょういん",
            "ipa": "biyouin byouin",
            "vi": "tiệm làm tóc · bệnh viện"
          }
        ],
        "note": "Đọc cả cặp, cố ý làm rõ chỗ khác nhau (kéo dài / ngắt / ん). Máy chấm báo chữ nào sai độ dài."
      }
    ]
  },
  {
    "id": "lt-b0-katakana",
    "kind": "homework",
    "title": "Luyện thêm Bài 0 · Katakana — 46 chữ, tên nước, đồ ăn, từ mượn trong sách — 125 câu",
    "goal": "Đọc trôi katakana trong phần Reading: 46 chữ, tên nước, đồ ăn uống và từ mượn của Bài 1–4; viết đúng ー, ッ, ャュョ.",
    "minutes": 60,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Katakana cùng âm với hiragana, chỉ khác dáng (nét thẳng, góc cạnh). Phần Reading thi nói luôn có **4 từ katakana = 12 điểm** — toàn là tên nước, đồ ăn, từ mượn như dưới đây.",
          "🟢 đọc 46 chữ → 🟡 đọc từ có thật trong sách (tên nước, đồ ăn, đồ dùng) → 🔴 chọn cách viết đúng (ー, ッ, ャュョ) và gõ romaji.",
          "Mẹo đoán nghĩa: đọc to rồi nghĩ tới tiếng Anh — テレビ terebi = television, パソコン pasokon = personal computer."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đọc 46 chữ katakana (46 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-doc-1",
        "title": "ア → ソ (15 câu)",
        "items": [
          {
            "q": "Chữ katakana **ア** đọc là gì?",
            "options": [
              "a",
              "ma",
              "i",
              "ya"
            ],
            "correct": 0,
            "why": "**ア** = a (hiragana tương ứng: あ)."
          },
          {
            "q": "Chữ katakana **イ** đọc là gì?",
            "options": [
              "to",
              "no",
              "re",
              "i"
            ],
            "correct": 3,
            "why": "**イ** = i (hiragana tương ứng: い)."
          },
          {
            "q": "Chữ katakana **ウ** đọc là gì?",
            "options": [
              "wa",
              "fu",
              "u",
              "ra"
            ],
            "correct": 2,
            "why": "**ウ** = u (hiragana tương ứng: う)."
          },
          {
            "q": "Chữ katakana **エ** đọc là gì?",
            "options": [
              "yu",
              "e",
              "ko",
              "ni"
            ],
            "correct": 1,
            "why": "**エ** = e (hiragana tương ứng: え)."
          },
          {
            "q": "Chữ katakana **オ** đọc là gì?",
            "options": [
              "o",
              "ho",
              "ne",
              "ki"
            ],
            "correct": 0,
            "why": "**オ** = o (hiragana tương ứng: お)."
          },
          {
            "q": "Chữ katakana **カ** đọc là gì?",
            "options": [
              "ya",
              "ke",
              "ku",
              "ka"
            ],
            "correct": 3,
            "why": "**カ** = ka (hiragana tương ứng: か)."
          },
          {
            "q": "Chữ katakana **キ** đọc là gì?",
            "options": [
              "mo",
              "chi",
              "ki",
              "te"
            ],
            "correct": 2,
            "why": "**キ** = ki (hiragana tương ứng: き)."
          },
          {
            "q": "Chữ katakana **ク** đọc là gì?",
            "options": [
              "ke",
              "ku",
              "ta",
              "wa"
            ],
            "correct": 1,
            "why": "**ク** = ku (hiragana tương ứng: く)."
          },
          {
            "q": "Chữ katakana **ケ** đọc là gì?",
            "options": [
              "ke",
              "ku",
              "ta",
              "na"
            ],
            "correct": 0,
            "why": "**ケ** = ke (hiragana tương ứng: け)."
          },
          {
            "q": "Chữ katakana **コ** đọc là gì?",
            "options": [
              "yu",
              "ro",
              "e",
              "ko"
            ],
            "correct": 3,
            "why": "**コ** = ko (hiragana tương ứng: こ)."
          },
          {
            "q": "Chữ katakana **サ** đọc là gì?",
            "options": [
              "se",
              "ke",
              "sa",
              "ya"
            ],
            "correct": 2,
            "why": "**サ** = sa (hiragana tương ứng: さ)."
          },
          {
            "q": "Chữ katakana **シ** đọc là gì?",
            "options": [
              "tsu",
              "shi",
              "so",
              "n"
            ],
            "correct": 1,
            "why": "**シ** = shi (hiragana tương ứng: し)."
          },
          {
            "q": "Chữ katakana **ス** đọc là gì?",
            "options": [
              "su",
              "nu",
              "ra",
              "fu"
            ],
            "correct": 0,
            "why": "**ス** = su (hiragana tương ứng: す)."
          },
          {
            "q": "Chữ katakana **セ** đọc là gì?",
            "options": [
              "sa",
              "ya",
              "mo",
              "se"
            ],
            "correct": 3,
            "why": "**セ** = se (hiragana tương ứng: せ)."
          },
          {
            "q": "Chữ katakana **ソ** đọc là gì?",
            "options": [
              "n",
              "tsu",
              "so",
              "ri"
            ],
            "correct": 2,
            "why": "**ソ** = so (hiragana tương ứng: そ)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-doc-2",
        "title": "タ → ホ (15 câu)",
        "items": [
          {
            "q": "Chữ katakana **タ** đọc là gì?",
            "options": [
              "ku",
              "ta",
              "ke",
              "nu"
            ],
            "correct": 1,
            "why": "**タ** = ta (hiragana tương ứng: た)."
          },
          {
            "q": "Chữ katakana **チ** đọc là gì?",
            "options": [
              "chi",
              "te",
              "na",
              "ki"
            ],
            "correct": 0,
            "why": "**チ** = chi (hiragana tương ứng: ち)."
          },
          {
            "q": "Chữ katakana **ツ** đọc là gì?",
            "options": [
              "shi",
              "so",
              "n",
              "tsu"
            ],
            "correct": 3,
            "why": "**ツ** = tsu (hiragana tương ứng: つ)."
          },
          {
            "q": "Chữ katakana **テ** đọc là gì?",
            "options": [
              "chi",
              "ra",
              "te",
              "mo"
            ],
            "correct": 2,
            "why": "**テ** = te (hiragana tương ứng: て)."
          },
          {
            "q": "Chữ katakana **ト** đọc là gì?",
            "options": [
              "i",
              "to",
              "hi",
              "no"
            ],
            "correct": 1,
            "why": "**ト** = to (hiragana tương ứng: と)."
          },
          {
            "q": "Chữ katakana **ナ** đọc là gì?",
            "options": [
              "na",
              "me",
              "chi",
              "te"
            ],
            "correct": 0,
            "why": "**ナ** = na (hiragana tương ứng: な)."
          },
          {
            "q": "Chữ katakana **ニ** đọc là gì?",
            "options": [
              "e",
              "yu",
              "ko",
              "ni"
            ],
            "correct": 3,
            "why": "**ニ** = ni (hiragana tương ứng: に)."
          },
          {
            "q": "Chữ katakana **ヌ** đọc là gì?",
            "options": [
              "su",
              "me",
              "nu",
              "fu"
            ],
            "correct": 2,
            "why": "**ヌ** = nu (hiragana tương ứng: ぬ)."
          },
          {
            "q": "Chữ katakana **ネ** đọc là gì?",
            "options": [
              "ho",
              "ne",
              "o",
              "nu"
            ],
            "correct": 1,
            "why": "**ネ** = ne (hiragana tương ứng: ね)."
          },
          {
            "q": "Chữ katakana **ノ** đọc là gì?",
            "options": [
              "no",
              "so",
              "n",
              "i"
            ],
            "correct": 0,
            "why": "**ノ** = no (hiragana tương ứng: の)."
          },
          {
            "q": "Chữ katakana **ハ** đọc là gì?",
            "options": [
              "ru",
              "so",
              "he",
              "ha"
            ],
            "correct": 3,
            "why": "**ハ** = ha (hiragana tương ứng: は)."
          },
          {
            "q": "Chữ katakana **ヒ** đọc là gì?",
            "options": [
              "to",
              "se",
              "hi",
              "re"
            ],
            "correct": 2,
            "why": "**ヒ** = hi (hiragana tương ứng: ひ)."
          },
          {
            "q": "Chữ katakana **フ** đọc là gì?",
            "options": [
              "wa",
              "fu",
              "u",
              "nu"
            ],
            "correct": 1,
            "why": "**フ** = fu (hiragana tương ứng: ふ)."
          },
          {
            "q": "Chữ katakana **ヘ** đọc là gì?",
            "options": [
              "he",
              "ha",
              "no",
              "hi"
            ],
            "correct": 0,
            "why": "**ヘ** = he (hiragana tương ứng: へ)."
          },
          {
            "q": "Chữ katakana **ホ** đọc là gì?",
            "options": [
              "o",
              "ne",
              "ki",
              "ho"
            ],
            "correct": 3,
            "why": "**ホ** = ho (hiragana tương ứng: ほ)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-doc-3",
        "title": "マ → ン (16 câu)",
        "items": [
          {
            "q": "Chữ katakana **マ** đọc là gì?",
            "options": [
              "a",
              "mu",
              "ma",
              "ya"
            ],
            "correct": 2,
            "why": "**マ** = ma (hiragana tương ứng: ま)."
          },
          {
            "q": "Chữ katakana **ミ** đọc là gì?",
            "options": [
              "shi",
              "mi",
              "ni",
              "tsu"
            ],
            "correct": 1,
            "why": "**ミ** = mi (hiragana tương ứng: み)."
          },
          {
            "q": "Chữ katakana **ム** đọc là gì?",
            "options": [
              "mu",
              "ma",
              "su",
              "nu"
            ],
            "correct": 0,
            "why": "**ム** = mu (hiragana tương ứng: む)."
          },
          {
            "q": "Chữ katakana **メ** đọc là gì?",
            "options": [
              "nu",
              "na",
              "no",
              "me"
            ],
            "correct": 3,
            "why": "**メ** = me (hiragana tương ứng: め)."
          },
          {
            "q": "Chữ katakana **モ** đọc là gì?",
            "options": [
              "ki",
              "chi",
              "mo",
              "te"
            ],
            "correct": 2,
            "why": "**モ** = mo (hiragana tương ứng: も)."
          },
          {
            "q": "Chữ katakana **ヤ** đọc là gì?",
            "options": [
              "se",
              "ya",
              "ka",
              "ma"
            ],
            "correct": 1,
            "why": "**ヤ** = ya (hiragana tương ứng: や)."
          },
          {
            "q": "Chữ katakana **ユ** đọc là gì?",
            "options": [
              "yu",
              "ko",
              "e",
              "yo"
            ],
            "correct": 0,
            "why": "**ユ** = yu (hiragana tương ứng: ゆ)."
          },
          {
            "q": "Chữ katakana **ヨ** đọc là gì?",
            "options": [
              "yu",
              "ko",
              "o",
              "yo"
            ],
            "correct": 3,
            "why": "**ヨ** = yo (hiragana tương ứng: よ)."
          },
          {
            "q": "Chữ katakana **ラ** đọc là gì?",
            "options": [
              "u",
              "fu",
              "ra",
              "o"
            ],
            "correct": 2,
            "why": "**ラ** = ra (hiragana tương ứng: ら)."
          },
          {
            "q": "Chữ katakana **リ** đọc là gì?",
            "options": [
              "so",
              "ri",
              "n",
              "ru"
            ],
            "correct": 1,
            "why": "**リ** = ri (hiragana tương ứng: り)."
          },
          {
            "q": "Chữ katakana **ル** đọc là gì?",
            "options": [
              "ru",
              "re",
              "ha",
              "ri"
            ],
            "correct": 0,
            "why": "**ル** = ru (hiragana tương ứng: る)."
          },
          {
            "q": "Chữ katakana **レ** đọc là gì?",
            "options": [
              "ru",
              "n",
              "hi",
              "re"
            ],
            "correct": 3,
            "why": "**レ** = re (hiragana tương ứng: れ)."
          },
          {
            "q": "Chữ katakana **ロ** đọc là gì?",
            "options": [
              "ko",
              "yu",
              "ro",
              "yo"
            ],
            "correct": 2,
            "why": "**ロ** = ro (hiragana tương ứng: ろ)."
          },
          {
            "q": "Chữ katakana **ワ** đọc là gì?",
            "options": [
              "u",
              "wa",
              "fu",
              "ku"
            ],
            "correct": 1,
            "why": "**ワ** = wa (hiragana tương ứng: わ)."
          },
          {
            "q": "Chữ katakana **ヲ** đọc là gì?",
            "options": [
              "o",
              "ra",
              "yo",
              "fu"
            ],
            "correct": 0,
            "why": "**ヲ** = o (hiragana tương ứng: を). Chỉ dùng làm trợ từ, gần như không gặp trong từ mượn."
          },
          {
            "q": "Chữ katakana **ン** đọc là gì?",
            "options": [
              "so",
              "shi",
              "tsu",
              "n"
            ],
            "correct": 3,
            "why": "**ン** = n (hiragana tương ứng: ん)."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đọc từ katakana trong sách → nghĩa (44 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-nuoc",
        "title": "Tên nước (10 câu)",
        "items": [
          {
            "q": "「ベトナム」 nghĩa là gì?",
            "options": [
              "Ý",
              "Thái Lan",
              "Việt Nam",
              "Brazil"
            ],
            "correct": 2,
            "why": "**ベトナム** (betonamu) = Việt Nam."
          },
          {
            "q": "「アメリカ」 nghĩa là gì?",
            "options": [
              "Úc",
              "Mỹ",
              "Nga",
              "Ấn Độ"
            ],
            "correct": 1,
            "why": "**アメリカ** (amerika) = Mỹ."
          },
          {
            "q": "「イタリア」 nghĩa là gì?",
            "options": [
              "Ý",
              "Thái Lan",
              "Brazil",
              "Đức"
            ],
            "correct": 0,
            "why": "**イタリア** (itaria) = Ý."
          },
          {
            "q": "「オーストラリア」 nghĩa là gì?",
            "options": [
              "Nga",
              "Ấn Độ",
              "Pháp",
              "Úc"
            ],
            "correct": 3,
            "why": "**オーストラリア** (oosutoraria) = Úc."
          },
          {
            "q": "「タイ」 nghĩa là gì?",
            "options": [
              "Brazil",
              "Đức",
              "Thái Lan",
              "Việt Nam"
            ],
            "correct": 2,
            "why": "**タイ** (tai) = Thái Lan."
          },
          {
            "q": "「ロシア」 nghĩa là gì?",
            "options": [
              "Ấn Độ",
              "Nga",
              "Pháp",
              "Mỹ"
            ],
            "correct": 1,
            "why": "**ロシア** (roshia) = Nga."
          },
          {
            "q": "「ブラジル」 nghĩa là gì?",
            "options": [
              "Brazil",
              "Đức",
              "Việt Nam",
              "Ý"
            ],
            "correct": 0,
            "why": "**ブラジル** (burajiru) = Brazil."
          },
          {
            "q": "「インド」 nghĩa là gì?",
            "options": [
              "Pháp",
              "Mỹ",
              "Úc",
              "Ấn Độ"
            ],
            "correct": 3,
            "why": "**インド** (indo) = Ấn Độ."
          },
          {
            "q": "「ドイツ」 nghĩa là gì?",
            "options": [
              "Việt Nam",
              "Ý",
              "Đức",
              "Thái Lan"
            ],
            "correct": 2,
            "why": "**ドイツ** (doitsu) = Đức."
          },
          {
            "q": "「フランス」 nghĩa là gì?",
            "options": [
              "Mỹ",
              "Pháp",
              "Úc",
              "Nga"
            ],
            "correct": 1,
            "why": "**フランス** (furansu) = Pháp."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-do-an",
        "title": "Đồ ăn, đồ uống (14 câu)",
        "items": [
          {
            "q": "「コーヒー」 nghĩa là gì?",
            "options": [
              "cà phê",
              "bánh ngọt",
              "cà ri",
              "thịt băm viên"
            ],
            "correct": 0,
            "why": "**コーヒー** (koohii) = cà phê."
          },
          {
            "q": "「ジュース」 nghĩa là gì?",
            "options": [
              "bánh mì",
              "súp",
              "bia",
              "nước hoa quả"
            ],
            "correct": 3,
            "why": "**ジュース** (juusu) = nước hoa quả."
          },
          {
            "q": "「ケーキ」 nghĩa là gì?",
            "options": [
              "cà ri",
              "thịt băm viên",
              "bánh ngọt",
              "rượu vang"
            ],
            "correct": 2,
            "why": "**ケーキ** (keeki) = bánh ngọt."
          },
          {
            "q": "「パン」 nghĩa là gì?",
            "options": [
              "súp",
              "bánh mì",
              "bia",
              "dâu tây"
            ],
            "correct": 1,
            "why": "**パン** (pan) = bánh mì."
          },
          {
            "q": "「カレー」 nghĩa là gì?",
            "options": [
              "cà ri",
              "thịt băm viên",
              "rượu vang",
              "táo"
            ],
            "correct": 0,
            "why": "**カレー** (karee) = cà ri."
          },
          {
            "q": "「スープ」 nghĩa là gì?",
            "options": [
              "bia",
              "dâu tây",
              "dưa lưới",
              "súp"
            ],
            "correct": 3,
            "why": "**スープ** (suupu) = súp."
          },
          {
            "q": "「ハンバーグ」 nghĩa là gì?",
            "options": [
              "rượu vang",
              "táo",
              "thịt băm viên",
              "phô mai"
            ],
            "correct": 2,
            "why": "**ハンバーグ** (hanbaagu) = thịt băm viên."
          },
          {
            "q": "「ビール」 nghĩa là gì?",
            "options": [
              "dâu tây",
              "bia",
              "dưa lưới",
              "salad"
            ],
            "correct": 1,
            "why": "**ビール** (biiru) = bia."
          },
          {
            "q": "「ワイン」 nghĩa là gì?",
            "options": [
              "rượu vang",
              "táo",
              "phô mai",
              "cà phê"
            ],
            "correct": 0,
            "why": "**ワイン** (wain) = rượu vang."
          },
          {
            "q": "「イチゴ」 nghĩa là gì?",
            "options": [
              "dưa lưới",
              "salad",
              "nước hoa quả",
              "dâu tây"
            ],
            "correct": 3,
            "why": "**イチゴ** (ichigo) = dâu tây."
          },
          {
            "q": "「リンゴ」 nghĩa là gì?",
            "options": [
              "phô mai",
              "cà phê",
              "táo",
              "bánh ngọt"
            ],
            "correct": 2,
            "why": "**リンゴ** (ringo) = táo."
          },
          {
            "q": "「メロン」 nghĩa là gì?",
            "options": [
              "salad",
              "dưa lưới",
              "nước hoa quả",
              "bánh mì"
            ],
            "correct": 1,
            "why": "**メロン** (meron) = dưa lưới."
          },
          {
            "q": "「チーズ」 nghĩa là gì?",
            "options": [
              "phô mai",
              "cà phê",
              "bánh ngọt",
              "cà ri"
            ],
            "correct": 0,
            "why": "**チーズ** (chiizu) = phô mai."
          },
          {
            "q": "「サラダ」 nghĩa là gì?",
            "options": [
              "nước hoa quả",
              "bánh mì",
              "súp",
              "salad"
            ],
            "correct": 3,
            "why": "**サラダ** (sarada) = salad."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-tu-muon",
        "title": "Từ mượn trong Bài 1–4 (20 câu)",
        "items": [
          {
            "q": "「テレビ」 nghĩa là gì?",
            "options": [
              "máy ảnh",
              "thang cuốn",
              "ti vi",
              "siêu thị"
            ],
            "correct": 2,
            "why": "**テレビ** (terebi) = ti vi."
          },
          {
            "q": "「パソコン」 nghĩa là gì?",
            "options": [
              "thang máy",
              "máy tính cá nhân",
              "nhà vệ sinh",
              "nhà hàng"
            ],
            "correct": 1,
            "why": "**パソコン** (pasokon) = máy tính cá nhân."
          },
          {
            "q": "「カメラ」 nghĩa là gì?",
            "options": [
              "máy ảnh",
              "thang cuốn",
              "siêu thị",
              "cửa hàng tiện lợi"
            ],
            "correct": 0,
            "why": "**カメラ** (kamera) = máy ảnh."
          },
          {
            "q": "「エレベーター」 nghĩa là gì?",
            "options": [
              "nhà vệ sinh",
              "nhà hàng",
              "việc làm thêm",
              "thang máy"
            ],
            "correct": 3,
            "why": "**エレベーター** (erebeetaa) = thang máy."
          },
          {
            "q": "「エスカレーター」 nghĩa là gì?",
            "options": [
              "siêu thị",
              "cửa hàng tiện lợi",
              "thang cuốn",
              "bài kiểm tra"
            ],
            "correct": 2,
            "why": "**エスカレーター** (esukareetaa) = thang cuốn."
          },
          {
            "q": "「トイレ」 nghĩa là gì?",
            "options": [
              "nhà hàng",
              "nhà vệ sinh",
              "việc làm thêm",
              "bữa tiệc"
            ],
            "correct": 1,
            "why": "**トイレ** (toire) = nhà vệ sinh."
          },
          {
            "q": "「スーパー」 nghĩa là gì?",
            "options": [
              "siêu thị",
              "cửa hàng tiện lợi",
              "bài kiểm tra",
              "trượt tuyết"
            ],
            "correct": 0,
            "why": "**スーパー** (suupaa) = siêu thị."
          },
          {
            "q": "「レストラン」 nghĩa là gì?",
            "options": [
              "việc làm thêm",
              "bữa tiệc",
              "xe buýt",
              "nhà hàng"
            ],
            "correct": 3,
            "why": "**レストラン** (resutoran) = nhà hàng."
          },
          {
            "q": "「コンビニ」 nghĩa là gì?",
            "options": [
              "bài kiểm tra",
              "trượt tuyết",
              "cửa hàng tiện lợi",
              "toà nhà"
            ],
            "correct": 2,
            "why": "**コンビニ** (konbini) = cửa hàng tiện lợi."
          },
          {
            "q": "「アルバイト」 nghĩa là gì?",
            "options": [
              "bữa tiệc",
              "việc làm thêm",
              "xe buýt",
              "bóng đá"
            ],
            "correct": 1,
            "why": "**アルバイト** (arubaito) = việc làm thêm."
          },
          {
            "q": "「テスト」 nghĩa là gì?",
            "options": [
              "bài kiểm tra",
              "trượt tuyết",
              "toà nhà",
              "quần vợt"
            ],
            "correct": 0,
            "why": "**テスト** (tesuto) = bài kiểm tra."
          },
          {
            "q": "「パーティー」 nghĩa là gì?",
            "options": [
              "xe buýt",
              "bóng đá",
              "quần dài",
              "bữa tiệc"
            ],
            "correct": 3,
            "why": "**パーティー** (paatii) = bữa tiệc."
          },
          {
            "q": "「スキー」 nghĩa là gì?",
            "options": [
              "toà nhà",
              "quần vợt",
              "trượt tuyết",
              "bút"
            ],
            "correct": 2,
            "why": "**スキー** (sukii) = trượt tuyết."
          },
          {
            "q": "「バス」 nghĩa là gì?",
            "options": [
              "bóng đá",
              "xe buýt",
              "quần dài",
              "internet"
            ],
            "correct": 1,
            "why": "**バス** (basu) = xe buýt."
          },
          {
            "q": "「ビル」 nghĩa là gì?",
            "options": [
              "toà nhà",
              "quần vợt",
              "bút",
              "ti vi"
            ],
            "correct": 0,
            "why": "**ビル** (biru) = toà nhà."
          },
          {
            "q": "「サッカー」 nghĩa là gì?",
            "options": [
              "quần dài",
              "internet",
              "máy tính cá nhân",
              "bóng đá"
            ],
            "correct": 3,
            "why": "**サッカー** (sakkaa) = bóng đá."
          },
          {
            "q": "「テニス」 nghĩa là gì?",
            "options": [
              "bút",
              "ti vi",
              "quần vợt",
              "máy ảnh"
            ],
            "correct": 2,
            "why": "**テニス** (tenisu) = quần vợt."
          },
          {
            "q": "「ズボン」 nghĩa là gì?",
            "options": [
              "internet",
              "quần dài",
              "máy tính cá nhân",
              "thang máy"
            ],
            "correct": 1,
            "why": "**ズボン** (zubon) = quần dài."
          },
          {
            "q": "「ペン」 nghĩa là gì?",
            "options": [
              "bút",
              "ti vi",
              "máy ảnh",
              "thang cuốn"
            ],
            "correct": 0,
            "why": "**ペン** (pen) = bút."
          },
          {
            "q": "「インターネット」 nghĩa là gì?",
            "options": [
              "máy tính cá nhân",
              "thang máy",
              "nhà vệ sinh",
              "internet"
            ],
            "correct": 3,
            "why": "**インターネット** (intaanetto) = internet."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · cách viết đúng (ー, ッ, ャュョ) và gõ romaji"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-viet-dung",
        "title": "Chọn cách viết katakana đúng (15 câu)",
        "items": [
          {
            "q": "\"cà phê\" (koohii) viết đúng là:",
            "options": [
              "コヒー",
              "コーヒ",
              "コーヒー",
              "コオヒイ"
            ],
            "correct": 2,
            "why": "**コーヒー** = koohii. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"bánh ngọt\" (keeki) viết đúng là:",
            "options": [
              "ケキ",
              "ケーキ",
              "ケーキー",
              "ケエキ"
            ],
            "correct": 1,
            "why": "**ケーキ** = keeki. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"siêu thị\" (suupaa) viết đúng là:",
            "options": [
              "スーパー",
              "スパー",
              "スーパ",
              "スウパア"
            ],
            "correct": 0,
            "why": "**スーパー** = suupaa. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"bóng đá\" (sakkaa) viết đúng là:",
            "options": [
              "サカー",
              "サッカ",
              "サツカー",
              "サッカー"
            ],
            "correct": 3,
            "why": "**サッカー** = sakkaa. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"bữa tiệc\" (paatii) viết đúng là:",
            "options": [
              "パティー",
              "パーティ",
              "パーティー",
              "パーテー"
            ],
            "correct": 2,
            "why": "**パーティー** = paatii. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"Việt Nam\" (betonamu) viết đúng là:",
            "options": [
              "ベットナム",
              "ベトナム",
              "ベトナン",
              "ペトナム"
            ],
            "correct": 1,
            "why": "**ベトナム** = betonamu. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"thang máy\" (erebeetaa) viết đúng là:",
            "options": [
              "エレベーター",
              "エレベタ",
              "エレベーダー",
              "エレベター"
            ],
            "correct": 0,
            "why": "**エレベーター** = erebeetaa. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"phô mai\" (chiizu) viết đúng là:",
            "options": [
              "チズ",
              "チーヅ",
              "チース",
              "チーズ"
            ],
            "correct": 3,
            "why": "**チーズ** = chiizu. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"nước hoa quả\" (juusu) viết đúng là:",
            "options": [
              "ジュス",
              "ジユース",
              "ジュース",
              "シュース"
            ],
            "correct": 2,
            "why": "**ジュース** = juusu. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"internet\" (intaanetto) viết đúng là:",
            "options": [
              "インタネト",
              "インターネット",
              "インターネト",
              "インダーネット"
            ],
            "correct": 1,
            "why": "**インターネット** = intaanetto. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"nhà hàng\" (resutoran) viết đúng là:",
            "options": [
              "レストラン",
              "レストラーン",
              "レスラン",
              "レストラソ"
            ],
            "correct": 0,
            "why": "**レストラン** = resutoran. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"áo sơ mi\" (shatsu) viết đúng là:",
            "options": [
              "シャッ",
              "シヤツ",
              "シャソ",
              "シャツ"
            ],
            "correct": 3,
            "why": "**シャツ** = shatsu. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"thịt băm viên\" (hanbaagu) viết đúng là:",
            "options": [
              "ハンバグ",
              "ハンパーグ",
              "ハンバーグ",
              "ハンバーク"
            ],
            "correct": 2,
            "why": "**ハンバーグ** = hanbaagu. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"việc làm thêm\" (arubaito) viết đúng là:",
            "options": [
              "アルバト",
              "アルバイト",
              "アルバイド",
              "アルパイト"
            ],
            "correct": 1,
            "why": "**アルバイト** = arubaito. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          },
          {
            "q": "\"máy ảnh\" (kamera) viết đúng là:",
            "options": [
              "カメラ",
              "カメーラ",
              "カメル",
              "ガメラ"
            ],
            "correct": 0,
            "why": "**カメラ** = kamera. ー kéo dài nguyên âm trước nó; ッ nhỏ = ngắt 1 nhịp; ャュョ viết nhỏ."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b0-kt-go",
        "title": "Gõ romaji của từ katakana (20 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "「ベトナム」 → romaji",
            "answers": [
              "betonamu"
            ]
          },
          {
            "q": "「アメリカ」 → romaji",
            "answers": [
              "amerika"
            ]
          },
          {
            "q": "「コーヒー」 → romaji",
            "answers": [
              "koohii",
              "kōhī"
            ]
          },
          {
            "q": "「ケーキ」 → romaji",
            "answers": [
              "keeki",
              "kēki"
            ]
          },
          {
            "q": "「テレビ」 → romaji",
            "answers": [
              "terebi"
            ]
          },
          {
            "q": "「パソコン」 → romaji",
            "answers": [
              "pasokon"
            ]
          },
          {
            "q": "「カメラ」 → romaji",
            "answers": [
              "kamera"
            ]
          },
          {
            "q": "「トイレ」 → romaji",
            "answers": [
              "toire"
            ]
          },
          {
            "q": "「スーパー」 → romaji",
            "answers": [
              "suupaa",
              "sūpā"
            ]
          },
          {
            "q": "「レストラン」 → romaji",
            "answers": [
              "resutoran"
            ]
          },
          {
            "q": "「コンビニ」 → romaji",
            "answers": [
              "konbini"
            ]
          },
          {
            "q": "「アルバイト」 → romaji",
            "answers": [
              "arubaito"
            ]
          },
          {
            "q": "「サッカー」 → romaji",
            "answers": [
              "sakkaa",
              "sakkā"
            ]
          },
          {
            "q": "「テニス」 → romaji",
            "answers": [
              "tenisu"
            ]
          },
          {
            "q": "「ビール」 → romaji",
            "answers": [
              "biiru",
              "bīru"
            ]
          },
          {
            "q": "「ジュース」 → romaji",
            "answers": [
              "juusu",
              "jūsu",
              "zyuusu",
              "zyūsu"
            ]
          },
          {
            "q": "「カレー」 → romaji",
            "answers": [
              "karee",
              "karē"
            ]
          },
          {
            "q": "「オーストラリア」 → romaji",
            "answers": [
              "oosutoraria",
              "ōsutoraria"
            ]
          },
          {
            "q": "「パーティー」 → romaji",
            "answers": [
              "paatii",
              "pātī"
            ]
          },
          {
            "q": "「エスカレーター」 → romaji",
            "answers": [
              "esukareetaa",
              "esukarētā"
            ]
          }
        ],
        "grammar": "ー gõ bằng cách lặp nguyên âm trước: コーヒー → koohii (hoặc kōhī)."
      },
      {
        "t": "write",
        "id": "lt-b0-kt-viet",
        "title": "Tập viết từ katakana hay vào đề",
        "chars": [
          "ベトナム",
          "コーヒー",
          "テレビ",
          "パン",
          "カメラ",
          "トイレ",
          "サッカー",
          "テニス",
          "ケーキ",
          "ジュース"
        ],
        "note": "Viết cả từ: dòng trên tô theo mẫu, dòng dưới tự viết. Bật \"Che mẫu\" để tự nhớ.",
        "goi": {
          "ベトナム": "betonamu · Việt Nam",
          "コーヒー": "koohii · cà phê",
          "テレビ": "terebi · ti vi",
          "パン": "pan · bánh mì",
          "カメラ": "kamera · máy ảnh",
          "トイレ": "toire · nhà vệ sinh",
          "サッカー": "sakkaa · bóng đá",
          "テニス": "tenisu · quần vợt",
          "ケーキ": "keeki · bánh ngọt",
          "ジュース": "juusu · nước hoa quả"
        }
      }
    ]
  },
  {
    "id": "lt-b0-doc-tu-viet",
    "kind": "homework",
    "title": "Luyện thêm Bài 0 · Đọc từ thật của Bài 1–2, đọc câu tự giới thiệu, viết tay — 80 câu",
    "goal": "Đọc được từ và câu của Bài 1–2 viết bằng kana, gõ được romaji/kana, viết tay được 12 từ hay vào đề.",
    "minutes": 50,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đây là cầu nối sang Bài 1: toàn bộ từ dưới đây là **từ của danh sách cô phát cho Bài 1–2**, viết bằng kana (chưa cần chữ Hán).",
          "🟢 đọc từ → romaji · 🟡 đọc từ → nghĩa, romaji → chữ · 🔴 đọc cả câu tự giới thiệu, ghép chữ thành từ, viết tay.",
          "Đọc to từng từ trước khi chọn. Gặp từ có っ, ー, ゃゅょ thì đếm nhịp bằng tay."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đọc từ → romaji (20 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-dt-doc",
        "title": "Đọc từ Bài 1–2 (20 câu)",
        "items": [
          {
            "q": "「わたし」 (tôi) đọc là:",
            "options": [
              "watachi",
              "wadashi",
              "wotashi",
              "watashi"
            ],
            "correct": 3,
            "why": "**わたし** = watashi. Đọc từng chữ: わ・た・し."
          },
          {
            "q": "「なまえ」 (tên) đọc là:",
            "options": [
              "nomae",
              "namai",
              "namae",
              "nanae"
            ],
            "correct": 2,
            "why": "**なまえ** = namae. Đọc từng chữ: な・ま・え."
          },
          {
            "q": "「くに」 (đất nước) đọc là:",
            "options": [
              "guni",
              "kuni",
              "kumi",
              "kuri"
            ],
            "correct": 1,
            "why": "**くに** = kuni. Đọc từng chữ: く・に."
          },
          {
            "q": "「にほん」 (Nhật Bản) đọc là:",
            "options": [
              "nihon",
              "nihom",
              "niho",
              "nehon"
            ],
            "correct": 0,
            "why": "**にほん** = nihon. Đọc từng chữ: に・ほ・ん."
          },
          {
            "q": "「がくせい」 (học sinh, sinh viên) đọc là:",
            "options": [
              "kakusei",
              "gakuse",
              "gakkusei",
              "gakusei"
            ],
            "correct": 3,
            "why": "**がくせい** = gakusei. Đọc từng chữ: が・く・せ・い."
          },
          {
            "q": "「せんせい」 (thầy/cô (dùng để gọi)) đọc là:",
            "options": [
              "sense",
              "sansei",
              "sensei",
              "senshei"
            ],
            "correct": 2,
            "why": "**せんせい** = sensei. Đọc từng chữ: せ・ん・せ・い."
          },
          {
            "q": "「だいがく」 (trường đại học) đọc là:",
            "options": [
              "taigaku",
              "daigaku",
              "daikaku",
              "daigagu"
            ],
            "correct": 1,
            "why": "**だいがく** = daigaku. Đọc từng chữ: だ・い・が・く."
          },
          {
            "q": "「こうこう」 (trường cấp 3) đọc là:",
            "options": [
              "koukou",
              "koko",
              "kokou",
              "goukou"
            ],
            "correct": 0,
            "why": "**こうこう** = koukou. Đọc từng chữ: こ・う・こ・う."
          },
          {
            "q": "「きょうし」 (giáo viên (tên nghề)) đọc là:",
            "options": [
              "kyoshi",
              "kiyoushi",
              "kyuushi",
              "kyoushi"
            ],
            "correct": 3,
            "why": "**きょうし** = kyoushi. Đọc từng chữ: きょ・う・し."
          },
          {
            "q": "「かいしゃいん」 (nhân viên công ty) đọc là:",
            "options": [
              "kaisain",
              "kaishiyain",
              "kaishain",
              "gaishain"
            ],
            "correct": 2,
            "why": "**かいしゃいん** = kaishain. Đọc từng chữ: か・い・しゃ・い・ん."
          },
          {
            "q": "「しごと」 (công việc) đọc là:",
            "options": [
              "shikoto",
              "shigoto",
              "shigodo",
              "chigoto"
            ],
            "correct": 1,
            "why": "**しごと** = shigoto. Đọc từng chữ: し・ご・と."
          },
          {
            "q": "「しゅみ」 (sở thích) đọc là:",
            "options": [
              "shumi",
              "shiyumi",
              "sumi",
              "shomi"
            ],
            "correct": 0,
            "why": "**しゅみ** = shumi. Đọc từng chữ: しゅ・み."
          },
          {
            "q": "「えいが」 (phim) đọc là:",
            "options": [
              "eika",
              "iega",
              "eigo",
              "eiga"
            ],
            "correct": 3,
            "why": "**えいが** = eiga. Đọc từng chữ: え・い・が."
          },
          {
            "q": "「おんがく」 (âm nhạc) đọc là:",
            "options": [
              "onkaku",
              "ongagu",
              "ongaku",
              "okaku"
            ],
            "correct": 2,
            "why": "**おんがく** = ongaku. Đọc từng chữ: お・ん・が・く."
          },
          {
            "q": "「どくしょ」 (đọc sách) đọc là:",
            "options": [
              "dokushiyo",
              "dokusho",
              "tokusho",
              "dokushou"
            ],
            "correct": 1,
            "why": "**どくしょ** = dokusho. Đọc từng chữ: ど・く・しょ."
          },
          {
            "q": "「りょこう」 (du lịch) đọc là:",
            "options": [
              "ryokou",
              "riyokou",
              "ryoukou",
              "ryoko"
            ],
            "correct": 0,
            "why": "**りょこう** = ryokou. Đọc từng chữ: りょ・こ・う."
          },
          {
            "q": "「りょうり」 (nấu ăn) đọc là:",
            "options": [
              "ryori",
              "riyouri",
              "ryuuri",
              "ryouri"
            ],
            "correct": 3,
            "why": "**りょうり** = ryouri. Đọc từng chữ: りょ・う・り."
          },
          {
            "q": "「すいえい」 (bơi lội) đọc là:",
            "options": [
              "suie",
              "sueei",
              "suiei",
              "shuiei"
            ],
            "correct": 2,
            "why": "**すいえい** = suiei. Đọc từng chữ: す・い・え・い."
          },
          {
            "q": "「たんじょうび」 (sinh nhật) đọc là:",
            "options": [
              "tanjobi",
              "tanjoubi",
              "tanjiyoubi",
              "danjoubi"
            ],
            "correct": 1,
            "why": "**たんじょうび** = tanjoubi. Đọc từng chữ: た・ん・じょ・う・び."
          },
          {
            "q": "「はじめまして」 (rất vui được gặp) đọc là:",
            "options": [
              "hajimemashite",
              "hajimemashita",
              "hashimemashite",
              "hajimemasute"
            ],
            "correct": 0,
            "why": "**はじめまして** = hajimemashite. Đọc từng chữ: は・じ・め・ま・し・て."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đọc từ → nghĩa · romaji → chữ (30 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-dt-nghia",
        "title": "Đọc từ → nghĩa (20 câu)",
        "items": [
          {
            "q": "「りょこう」 nghĩa là gì?",
            "options": [
              "đất nước",
              "trường cấp 3",
              "sở thích",
              "du lịch"
            ],
            "correct": 3,
            "why": "**りょこう** (ryokou) = du lịch."
          },
          {
            "q": "「りょうり」 nghĩa là gì?",
            "options": [
              "thầy/cô (dùng để gọi)",
              "phim",
              "nấu ăn",
              "rất vui được gặp"
            ],
            "correct": 2,
            "why": "**りょうり** (ryouri) = nấu ăn."
          },
          {
            "q": "「すいえい」 nghĩa là gì?",
            "options": [
              "giáo viên (tên nghề)",
              "bơi lội",
              "sinh nhật",
              "cặp, túi"
            ],
            "correct": 1,
            "why": "**すいえい** (suiei) = bơi lội."
          },
          {
            "q": "「たんじょうび」 nghĩa là gì?",
            "options": [
              "sinh nhật",
              "sở thích",
              "đồng hồ",
              "ai"
            ],
            "correct": 0,
            "why": "**たんじょうび** (tanjoubi) = sinh nhật."
          },
          {
            "q": "「はじめまして」 nghĩa là gì?",
            "options": [
              "đọc sách",
              "cá",
              "thầy/cô (dùng để gọi)",
              "rất vui được gặp"
            ],
            "correct": 3,
            "why": "**はじめまして** (hajimemashite) = rất vui được gặp."
          },
          {
            "q": "「ここ」 nghĩa là gì?",
            "options": [
              "bơi lội",
              "ai",
              "chỗ này",
              "phim"
            ],
            "correct": 2,
            "why": "**ここ** (koko) = chỗ này."
          },
          {
            "q": "「どこ」 nghĩa là gì?",
            "options": [
              "chỗ này",
              "ở đâu",
              "Nhật Bản",
              "rất vui được gặp"
            ],
            "correct": 1,
            "why": "**どこ** (doko) = ở đâu."
          },
          {
            "q": "「いくら」 nghĩa là gì?",
            "options": [
              "bao nhiêu tiền",
              "ví tiền",
              "giáo viên (tên nghề)",
              "trứng"
            ],
            "correct": 0,
            "why": "**いくら** (ikura) = bao nhiêu tiền."
          },
          {
            "q": "「とけい」 nghĩa là gì?",
            "options": [
              "trứng",
              "âm nhạc",
              "nhân viên bán hàng",
              "đồng hồ"
            ],
            "correct": 3,
            "why": "**とけい** (tokei) = đồng hồ."
          },
          {
            "q": "「さいふ」 nghĩa là gì?",
            "options": [
              "cơm",
              "sinh nhật",
              "ví tiền",
              "trường đại học"
            ],
            "correct": 2,
            "why": "**さいふ** (saifu) = ví tiền."
          },
          {
            "q": "「くつ」 nghĩa là gì?",
            "options": [
              "ai",
              "giày",
              "đồng hồ",
              "âm nhạc"
            ],
            "correct": 1,
            "why": "**くつ** (kutsu) = giày."
          },
          {
            "q": "「かばん」 nghĩa là gì?",
            "options": [
              "cặp, túi",
              "tên",
              "rau",
              "chỗ này"
            ],
            "correct": 0,
            "why": "**かばん** (kaban) = cặp, túi."
          },
          {
            "q": "「たまご」 nghĩa là gì?",
            "options": [
              "học sinh, sinh viên",
              "nhân viên bán hàng",
              "cá",
              "trứng"
            ],
            "correct": 3,
            "why": "**たまご** (tamago) = trứng."
          },
          {
            "q": "「さかな」 nghĩa là gì?",
            "options": [
              "trường cấp 3",
              "học sinh, sinh viên",
              "cá",
              "tôi"
            ],
            "correct": 2,
            "why": "**さかな** (sakana) = cá."
          },
          {
            "q": "「やさい」 nghĩa là gì?",
            "options": [
              "công việc",
              "rau",
              "nhân viên công ty",
              "trường cấp 3"
            ],
            "correct": 1,
            "why": "**やさい** (yasai) = rau."
          },
          {
            "q": "「ごはん」 nghĩa là gì?",
            "options": [
              "âm nhạc",
              "cơm",
              "đọc sách"
            ],
            "correct": 1,
            "why": "**ごはん** (gohan) = cơm."
          },
          {
            "q": "「おちゃ」 nghĩa là gì?",
            "options": [
              "nấu ăn",
              "rất vui được gặp",
              "ở đâu",
              "trà"
            ],
            "correct": 3,
            "why": "**おちゃ** (ocha) = trà."
          },
          {
            "q": "「えいご」 nghĩa là gì?",
            "options": [
              "rất vui được gặp",
              "ví tiền",
              "tiếng Anh",
              "cá"
            ],
            "correct": 2,
            "why": "**えいご** (eigo) = tiếng Anh."
          },
          {
            "q": "「だれ」 nghĩa là gì?",
            "options": [
              "bao nhiêu tiền",
              "ai",
              "rau",
              "tên"
            ],
            "correct": 1,
            "why": "**だれ** (dare) = ai."
          },
          {
            "q": "「てんいん」 nghĩa là gì?",
            "options": [
              "nhân viên bán hàng",
              "giày",
              "tôi",
              "giáo viên (tên nghề)"
            ],
            "correct": 0,
            "why": "**てんいん** (ten'in) = nhân viên bán hàng."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b0-dt-chon",
        "title": "Romaji → chọn chữ (10 câu)",
        "items": [
          {
            "q": "**gakusei** viết bằng hiragana là:",
            "options": [
              "かくせい",
              "がくせ",
              "がっせい",
              "がくせい"
            ],
            "correct": 3,
            "why": "gakusei = **がくせい**."
          },
          {
            "q": "**sensei** viết bằng hiragana là:",
            "options": [
              "せんせ",
              "せいせい",
              "せんせい",
              "せんぜい"
            ],
            "correct": 2,
            "why": "sensei = **せんせい**."
          },
          {
            "q": "**shumi** viết bằng hiragana là:",
            "options": [
              "しゆみ",
              "しゅみ",
              "すみ",
              "しょみ"
            ],
            "correct": 1,
            "why": "shumi = **しゅみ**."
          },
          {
            "q": "**ryokou** viết bằng hiragana là:",
            "options": [
              "りょこう",
              "りょうこう",
              "りよこう",
              "りょこ"
            ],
            "correct": 0,
            "why": "ryokou = **りょこう**."
          },
          {
            "q": "**ryouri** viết bằng hiragana là:",
            "options": [
              "りょり",
              "りようり",
              "りゅうり",
              "りょうり"
            ],
            "correct": 3,
            "why": "ryouri = **りょうり**."
          },
          {
            "q": "**kaishain** viết bằng hiragana là:",
            "options": [
              "かいしやいん",
              "かいしゃん",
              "かいしゃいん",
              "がいしゃいん"
            ],
            "correct": 2,
            "why": "kaishain = **かいしゃいん**."
          },
          {
            "q": "**tanjoubi** viết bằng hiragana là:",
            "options": [
              "たんじょび",
              "たんじょうび",
              "たんじようび",
              "だんじょうび"
            ],
            "correct": 1,
            "why": "tanjoubi = **たんじょうび**."
          },
          {
            "q": "**kyoushi** viết bằng hiragana là:",
            "options": [
              "きょうし",
              "きょし",
              "きようし",
              "きゅうし"
            ],
            "correct": 0,
            "why": "kyoushi = **きょうし**."
          },
          {
            "q": "**ocha** viết bằng hiragana là:",
            "options": [
              "おちや",
              "おさ",
              "おしゃ",
              "おちゃ"
            ],
            "correct": 3,
            "why": "ocha = **おちゃ**."
          },
          {
            "q": "**dokusho** viết bằng hiragana là:",
            "options": [
              "どくしよ",
              "とくしょ",
              "どくしょ",
              "どくしょう"
            ],
            "correct": 2,
            "why": "dokusho = **どくしょ**."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đọc câu tự giới thiệu · ghép chữ · viết tay"
      },
      {
        "t": "quiz",
        "id": "lt-b0-dt-cau",
        "title": "Đọc câu → gõ romaji (10 câu, chú ý は・を)",
        "kind": "fill",
        "items": [
          {
            "q": "「わたしは がくせいです。」 (Tôi là sinh viên.) → romaji",
            "answers": [
              "watashi wa gakusei desu",
              "watashi wa gakusee desu",
              "watashi wa gakusee desu.",
              "watashi wa gakusei desu.",
              "watashi wa gakusē desu",
              "watashi wa gakusē desu.",
              "watashiwagakuseedesu",
              "watashiwagakuseedesu.",
              "watashiwagakuseidesu",
              "watashiwagakuseidesu.",
              "watashiwagakusēdesu",
              "watashiwagakusēdesu.",
              "watasi wa gakusee desu",
              "watasi wa gakusee desu.",
              "watasi wa gakusei desu",
              "watasi wa gakusei desu.",
              "watasi wa gakusē desu",
              "watasi wa gakusē desu.",
              "watasiwagakuseedesu",
              "watasiwagakuseedesu.",
              "watasiwagakuseidesu",
              "watasiwagakuseidesu.",
              "watasiwagakusēdesu",
              "watasiwagakusēdesu."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「はじめまして。ワンです。」 (Rất vui được gặp. Tôi là Wan.) → romaji",
            "answers": [
              "hajimemashite wan desu",
              "hajimemashite wan desu.",
              "hajimemashite. wan desu",
              "hajimemashite. wan desu.",
              "hajimemashitewandesu",
              "hajimemashitewandesu.",
              "hazimemasite wan desu",
              "hazimemasite wan desu.",
              "hazimemasitewandesu",
              "hazimemasitewandesu."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「どうぞ よろしく おねがいします。」 (Rất mong được giúp đỡ.) → romaji",
            "answers": [
              "douzo yoroshiku onegaishimasu",
              "douzo yoroshiku onegai shimasu",
              "douzo yoroshiku onegai shimasu.",
              "douzo yoroshiku onegaishimasu.",
              "douzo yorosiku onegai simasu",
              "douzo yorosiku onegai simasu.",
              "douzo yorosiku onegaisimasu",
              "douzo yorosiku onegaisimasu.",
              "douzoyoroshikuonegaishimasu",
              "douzoyoroshikuonegaishimasu.",
              "douzoyorosikuonegaisimasu",
              "douzoyorosikuonegaisimasu.",
              "dōzo yoroshiku onegai shimasu",
              "dōzo yoroshiku onegai shimasu.",
              "dōzo yoroshiku onegaishimasu",
              "dōzo yoroshiku onegaishimasu.",
              "dōzo yorosiku onegai simasu",
              "dōzo yorosiku onegai simasu.",
              "dōzo yorosiku onegaisimasu",
              "dōzo yorosiku onegaisimasu.",
              "dōzoyoroshikuonegaishimasu",
              "dōzoyoroshikuonegaishimasu.",
              "dōzoyorosikuonegaisimasu",
              "dōzoyorosikuonegaisimasu."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「わたしの しゅみは りょこうです。」 (Sở thích của tôi là du lịch.) → romaji",
            "answers": [
              "watashi no shumi wa ryokou desu",
              "watashi no shumi wa ryokou desu.",
              "watashi no shumi wa ryokō desu",
              "watashi no shumi wa ryokō desu.",
              "watashinoshumiwaryokoudesu",
              "watashinoshumiwaryokoudesu.",
              "watashinoshumiwaryokōdesu",
              "watashinoshumiwaryokōdesu.",
              "watasi no syumi wa ryokou desu",
              "watasi no syumi wa ryokou desu.",
              "watasi no syumi wa ryokō desu",
              "watasi no syumi wa ryokō desu.",
              "watasinosyumiwaryokoudesu",
              "watasinosyumiwaryokoudesu.",
              "watasinosyumiwaryokōdesu",
              "watasinosyumiwaryokōdesu."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「ベトナムじんです。」 (Tôi là người Việt Nam.) → romaji",
            "answers": [
              "betonamujin desu",
              "betonamu jin desu",
              "betonamu jin desu.",
              "betonamu zin desu",
              "betonamu zin desu.",
              "betonamujin desu.",
              "betonamujindesu",
              "betonamujindesu.",
              "betonamuzin desu",
              "betonamuzin desu.",
              "betonamuzindesu",
              "betonamuzindesu."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「トイレは どこですか。」 (Nhà vệ sinh ở đâu?) → romaji",
            "answers": [
              "toire wa doko desu ka",
              "toire wa doko desu ka.",
              "toirewadokodesuka",
              "toirewadokodesuka."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「この とけいは いくらですか。」 (Cái đồng hồ này bao nhiêu tiền?) → romaji",
            "answers": [
              "kono tokei wa ikura desu ka",
              "kono tokei wa ikura desu ka.",
              "konotokeiwaikuradesuka",
              "konotokeiwaikuradesuka."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「コーヒーを ください。」 (Cho tôi cà phê.) → romaji",
            "answers": [
              "koohii o kudasai",
              "koohii o kudasai.",
              "koohiiokudasai",
              "koohiiokudasai.",
              "kōhī o kudasai",
              "kōhī o kudasai.",
              "kōhīokudasai",
              "kōhīokudasai."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「たんじょうびは いつですか。」 (Sinh nhật bạn khi nào?) → romaji",
            "answers": [
              "tanjoubi wa itsu desu ka",
              "tanjoubi wa itsu desu ka.",
              "tanjoubiwaitsudesuka",
              "tanjoubiwaitsudesuka.",
              "tanjōbi wa itsu desu ka",
              "tanjōbi wa itsu desu ka.",
              "tanjōbiwaitsudesuka",
              "tanjōbiwaitsudesuka.",
              "tanzyoubi wa itu desu ka",
              "tanzyoubi wa itu desu ka.",
              "tanzyoubiwaitudesuka",
              "tanzyoubiwaitudesuka.",
              "tanzyōbi wa itu desu ka",
              "tanzyōbi wa itu desu ka.",
              "tanzyōbiwaitudesuka",
              "tanzyōbiwaitudesuka."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          },
          {
            "q": "「ここは がっこうです。」 (Đây là trường học.) → romaji",
            "answers": [
              "koko wa gakkou desu",
              "koko wa gakkou desu.",
              "koko wa gakkō desu",
              "koko wa gakkō desu.",
              "kokowagakkoudesu",
              "kokowagakkoudesu.",
              "kokowagakkōdesu",
              "kokowagakkōdesu."
            ],
            "hint": "は (trợ từ) = wa · を = o · へ = e"
          }
        ],
        "grammar": "Gõ romaji chữ thường, có thể có hoặc không có dấu cách giữa các từ."
      },
      {
        "t": "build",
        "id": "lt-b0-dt-ghep",
        "title": "Ghép chữ thành từ (8 câu — có chữ gây nhiễu)",
        "items": [
          {
            "vi": "học sinh",
            "chips": [
              "が",
              "く",
              "せ",
              "い",
              "か",
              "ぜ"
            ],
            "answer": [
              "が",
              "く",
              "せ",
              "い"
            ],
            "ro": "gakusei"
          },
          {
            "vi": "thầy cô",
            "chips": [
              "せ",
              "ん",
              "せ",
              "い",
              "え",
              "さ"
            ],
            "answer": [
              "せ",
              "ん",
              "せ",
              "い"
            ],
            "ro": "sensei"
          },
          {
            "vi": "sở thích",
            "chips": [
              "しゅ",
              "み",
              "ゆ",
              "す"
            ],
            "answer": [
              "しゅ",
              "み"
            ],
            "ro": "shumi"
          },
          {
            "vi": "du lịch",
            "chips": [
              "りょ",
              "こ",
              "う",
              "よ",
              "ご"
            ],
            "answer": [
              "りょ",
              "こ",
              "う"
            ],
            "ro": "ryokou"
          },
          {
            "vi": "con tem",
            "chips": [
              "き",
              "っ",
              "て",
              "つ",
              "い"
            ],
            "answer": [
              "き",
              "っ",
              "て"
            ],
            "ro": "kitte"
          },
          {
            "vi": "cà phê",
            "chips": [
              "コ",
              "ー",
              "ヒ",
              "ー",
              "オ",
              "イ"
            ],
            "answer": [
              "コ",
              "ー",
              "ヒ",
              "ー"
            ],
            "ro": "koohii"
          },
          {
            "vi": "Việt Nam",
            "chips": [
              "ベ",
              "ト",
              "ナ",
              "ム",
              "ペ",
              "ッ"
            ],
            "answer": [
              "ベ",
              "ト",
              "ナ",
              "ム"
            ],
            "ro": "betonamu"
          },
          {
            "vi": "bệnh viện",
            "chips": [
              "びょ",
              "う",
              "い",
              "ん",
              "よ",
              "ぴ"
            ],
            "answer": [
              "びょ",
              "う",
              "い",
              "ん"
            ],
            "ro": "byouin"
          }
        ]
      },
      {
        "t": "write",
        "id": "lt-b0-dt-viet",
        "title": "Viết tay 12 từ của Bài 1–2 (hay vào đề)",
        "chars": [
          "わたし",
          "なまえ",
          "がくせい",
          "せんせい",
          "しゅみ",
          "りょこう",
          "えいが",
          "おんがく",
          "にほん",
          "ベトナム",
          "コーヒー",
          "いくら"
        ],
        "note": "Viết cả từ. Bật \"Che mẫu\" để tự nhớ ra cách viết từ nghĩa.",
        "goi": {
          "わたし": "watashi · tôi",
          "なまえ": "namae · tên",
          "がくせい": "gakusei · sinh viên",
          "せんせい": "sensei · thầy cô",
          "しゅみ": "shumi · sở thích",
          "りょこう": "ryokou · du lịch",
          "えいが": "eiga · phim",
          "おんがく": "ongaku · âm nhạc",
          "にほん": "nihon · Nhật Bản",
          "ベトナム": "betonamu · Việt Nam",
          "コーヒー": "koohii · cà phê",
          "いくら": "ikura · bao nhiêu tiền"
        }
      },
      {
        "t": "quiz",
        "id": "lt-b0-dt-go-kana",
        "title": "Viết bằng hiragana (gõ kana) — 12 từ",
        "kind": "fill",
        "items": [
          {
            "q": "Viết bằng hiragana: **watashi** (tôi)",
            "answers": [
              "わたし"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **namae** (tên)",
            "answers": [
              "なまえ"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **kuni** (đất nước)",
            "answers": [
              "くに"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **gakusei** (sinh viên)",
            "answers": [
              "がくせい"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **sensei** (thầy cô)",
            "answers": [
              "せんせい"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **shumi** (sở thích)",
            "answers": [
              "しゅみ"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **ryokou** (du lịch)",
            "answers": [
              "りょこう"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **eiga** (phim)",
            "answers": [
              "えいが"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **ocha** (trà)",
            "answers": [
              "おちゃ"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **kitte** (con tem)",
            "answers": [
              "きって"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **byouin** (bệnh viện)",
            "answers": [
              "びょういん"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          },
          {
            "q": "Viết bằng hiragana: **tanjoubi** (sinh nhật)",
            "answers": [
              "たんじょうび"
            ],
            "hint": "Gõ bằng bàn phím tiếng Nhật (IME): gõ romaji rồi Enter."
          }
        ],
        "grammar": "Trường âm viết bằng chữ: せんせい (không viết せんせー). っ và ゃゅょ phải là chữ NHỎ."
      }
    ]
  },
  {
    "id": "lt-b0-de-kiem-tra",
    "kind": "homework",
    "title": "Luyện thêm Bài 0 · Đề kiểm tra bảng chữ (40 phút, 80 câu, 100 điểm)",
    "goal": "Tự kiểm tra đã vững hiragana, katakana, âm đục, âm ghép, っ/trường âm/ん và nghe phân biệt chưa — đủ 85 điểm thì sang Bài 1.",
    "minutes": 40,
    "blocks": [
      {
        "t": "recap",
        "items": [
          "Làm trong **40 phút**, không mở bảng chữ. 80 câu · mỗi câu 1,25 điểm · tổng **100 điểm**.",
          "Phần A–B đọc chữ · C cặp dễ nhầm · D âm đục/âm ghép · E っ/trường âm/ん · F đọc từ → nghĩa · G nghe.",
          "Chấm xong xem bảng \"sai câu nào ôn mục nào\" ở cuối. **≥ 85 điểm** = sẵn sàng học Bài 1."
        ],
        "title": "Đề kiểm tra bảng chữ — cuối Bài 0"
      },
      {
        "t": "h",
        "text": "A. Đọc hiragana (12 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-a",
        "title": "A. Hiragana → romaji",
        "items": [
          {
            "q": "**あ** đọc là:",
            "options": [
              "o",
              "a",
              "me",
              "no"
            ],
            "correct": 1,
            "why": "あ = **a**."
          },
          {
            "q": "**く** đọc là:",
            "options": [
              "ku",
              "he",
              "shi",
              "tsu"
            ],
            "correct": 0,
            "why": "く = **ku**."
          },
          {
            "q": "**そ** đọc là:",
            "options": [
              "te",
              "ro",
              "e",
              "so"
            ],
            "correct": 3,
            "why": "そ = **so**."
          },
          {
            "q": "**に** đọc là:",
            "options": [
              "ko",
              "ke",
              "ni",
              "ta"
            ],
            "correct": 2,
            "why": "に = **ni**."
          },
          {
            "q": "**へ** đọc là:",
            "options": [
              "ku",
              "he",
              "shi",
              "so"
            ],
            "correct": 1,
            "why": "へ = **he**."
          },
          {
            "q": "**や** đọc là:",
            "options": [
              "ya",
              "yu",
              "ka",
              "se"
            ],
            "correct": 0,
            "why": "や = **ya**."
          },
          {
            "q": "**ろ** đọc là:",
            "options": [
              "ru",
              "ra",
              "chi",
              "ro"
            ],
            "correct": 3,
            "why": "ろ = **ro**."
          },
          {
            "q": "**え** đọc là:",
            "options": [
              "fu",
              "so",
              "e",
              "n"
            ],
            "correct": 2,
            "why": "え = **e**."
          },
          {
            "q": "**さ** đọc là:",
            "options": [
              "chi",
              "sa",
              "ki",
              "so"
            ],
            "correct": 1,
            "why": "さ = **sa**."
          },
          {
            "q": "**つ** đọc là:",
            "options": [
              "tsu",
              "shi",
              "u",
              "te"
            ],
            "correct": 0,
            "why": "つ = **tsu**."
          },
          {
            "q": "**の** đọc là:",
            "options": [
              "me",
              "a",
              "nu",
              "no"
            ],
            "correct": 3,
            "why": "の = **no**."
          },
          {
            "q": "**み** đọc là:",
            "options": [
              "mu",
              "ru",
              "mi",
              "ro"
            ],
            "correct": 2,
            "why": "み = **mi**."
          }
        ]
      },
      {
        "t": "h",
        "text": "B. Đọc katakana (12 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-b",
        "title": "B. Katakana → romaji",
        "items": [
          {
            "q": "**ア** đọc là:",
            "options": [
              "ma",
              "a",
              "i",
              "ya"
            ],
            "correct": 1,
            "why": "ア = **a**."
          },
          {
            "q": "**シ** đọc là:",
            "options": [
              "shi",
              "tsu",
              "so",
              "n"
            ],
            "correct": 0,
            "why": "シ = **shi**."
          },
          {
            "q": "**ヌ** đọc là:",
            "options": [
              "su",
              "me",
              "fu",
              "nu"
            ],
            "correct": 3,
            "why": "ヌ = **nu**."
          },
          {
            "q": "**メ** đọc là:",
            "options": [
              "nu",
              "na",
              "me",
              "no"
            ],
            "correct": 2,
            "why": "メ = **me**."
          },
          {
            "q": "**ヲ** đọc là:",
            "options": [
              "ra",
              "o",
              "yo",
              "fu"
            ],
            "correct": 1,
            "why": "ヲ = **o**."
          },
          {
            "q": "**コ** đọc là:",
            "options": [
              "ko",
              "yu",
              "ro",
              "e"
            ],
            "correct": 0,
            "why": "コ = **ko**."
          },
          {
            "q": "**ナ** đọc là:",
            "options": [
              "me",
              "chi",
              "te",
              "na"
            ],
            "correct": 3,
            "why": "ナ = **na**."
          },
          {
            "q": "**ミ** đọc là:",
            "options": [
              "shi",
              "ni",
              "mi",
              "tsu"
            ],
            "correct": 2,
            "why": "ミ = **mi**."
          },
          {
            "q": "**ロ** đọc là:",
            "options": [
              "ko",
              "ro",
              "yu",
              "yo"
            ],
            "correct": 1,
            "why": "ロ = **ro**."
          },
          {
            "q": "**ク** đọc là:",
            "options": [
              "ku",
              "ke",
              "ta",
              "wa"
            ],
            "correct": 0,
            "why": "ク = **ku**."
          },
          {
            "q": "**テ** đọc là:",
            "options": [
              "chi",
              "ra",
              "mo",
              "te"
            ],
            "correct": 3,
            "why": "テ = **te**."
          },
          {
            "q": "**ホ** đọc là:",
            "options": [
              "o",
              "ne",
              "ho",
              "ki"
            ],
            "correct": 2,
            "why": "ホ = **ho**."
          }
        ]
      },
      {
        "t": "h",
        "text": "C. Cặp dễ nhầm (12 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-c",
        "title": "C. Chọn đúng chữ",
        "items": [
          {
            "q": "Chữ nào là **nu**?",
            "options": [
              "め",
              "ぬ",
              "の",
              "ね"
            ],
            "correct": 1,
            "why": "**ぬ** = nu."
          },
          {
            "q": "Chữ nào là **ne**?",
            "options": [
              "ね",
              "れ",
              "わ",
              "ぬ"
            ],
            "correct": 0,
            "why": "**ね** = ne."
          },
          {
            "q": "Chữ nào là **ru**?",
            "options": [
              "ろ",
              "ら",
              "れ",
              "る"
            ],
            "correct": 3,
            "why": "**る** = ru."
          },
          {
            "q": "Chữ nào là **sa**?",
            "options": [
              "ち",
              "き",
              "さ",
              "そ"
            ],
            "correct": 2,
            "why": "**さ** = sa."
          },
          {
            "q": "Chữ nào là **ho**?",
            "options": [
              "は",
              "ほ",
              "け",
              "ま"
            ],
            "correct": 1,
            "why": "**ほ** = ho."
          },
          {
            "q": "Chữ nào là **ri**?",
            "options": [
              "り",
              "い",
              "こ",
              "け"
            ],
            "correct": 0,
            "why": "**り** = ri."
          },
          {
            "q": "Chữ nào là **shi**?",
            "options": [
              "ツ",
              "ソ",
              "ン",
              "シ"
            ],
            "correct": 3,
            "why": "**シ** = shi."
          },
          {
            "q": "Chữ nào là **tsu**?",
            "options": [
              "シ",
              "ソ",
              "ツ",
              "ン"
            ],
            "correct": 2,
            "why": "**ツ** = tsu."
          },
          {
            "q": "Chữ nào là **so**?",
            "options": [
              "ン",
              "ソ",
              "ツ",
              "リ"
            ],
            "correct": 1,
            "why": "**ソ** = so."
          },
          {
            "q": "Chữ nào là **n**?",
            "options": [
              "ン",
              "ソ",
              "シ",
              "ツ"
            ],
            "correct": 0,
            "why": "**ン** = n."
          },
          {
            "q": "Chữ nào là **ku**?",
            "options": [
              "ケ",
              "タ",
              "ワ",
              "ク"
            ],
            "correct": 3,
            "why": "**ク** = ku."
          },
          {
            "q": "Chữ nào là **me**?",
            "options": [
              "ヌ",
              "ナ",
              "メ",
              "ノ"
            ],
            "correct": 2,
            "why": "**メ** = me."
          }
        ]
      },
      {
        "t": "h",
        "text": "D. Âm đục · âm ghép (12 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-d",
        "title": "D. Đọc chữ có dấu và âm ghép",
        "items": [
          {
            "q": "**ぎ** đọc là:",
            "options": [
              "ki",
              "gi",
              "ga",
              "gu"
            ],
            "correct": 1,
            "why": "ぎ = **gi**."
          },
          {
            "q": "**ず** đọc là:",
            "options": [
              "zu",
              "su",
              "za",
              "zi"
            ],
            "correct": 0,
            "why": "ず = **zu**."
          },
          {
            "q": "**ぱ** đọc là:",
            "options": [
              "ha",
              "ba",
              "pi",
              "pa"
            ],
            "correct": 3,
            "why": "ぱ = **pa**."
          },
          {
            "q": "**ぼ** đọc là:",
            "options": [
              "ho",
              "po",
              "bo",
              "ba"
            ],
            "correct": 2,
            "why": "ぼ = **bo**."
          },
          {
            "q": "**じゃ** đọc là:",
            "options": [
              "jiya",
              "ja",
              "ju",
              "jo"
            ],
            "correct": 1,
            "why": "じゃ = **ja**."
          },
          {
            "q": "**しゅ** đọc là:",
            "options": [
              "shu",
              "shiyu",
              "sho",
              "sha"
            ],
            "correct": 0,
            "why": "しゅ = **shu**."
          },
          {
            "q": "**ちょ** đọc là:",
            "options": [
              "chiyo",
              "cha",
              "chu",
              "cho"
            ],
            "correct": 3,
            "why": "ちょ = **cho**."
          },
          {
            "q": "**りょ** đọc là:",
            "options": [
              "riyo",
              "rya",
              "ryo",
              "ryu"
            ],
            "correct": 2,
            "why": "りょ = **ryo**."
          },
          {
            "q": "**びょ** đọc là:",
            "options": [
              "biyo",
              "byo",
              "bya",
              "byu"
            ],
            "correct": 1,
            "why": "びょ = **byo**."
          },
          {
            "q": "**ぎゅ** đọc là:",
            "options": [
              "gyu",
              "giyu",
              "gyo",
              "gya"
            ],
            "correct": 0,
            "why": "ぎゅ = **gyu**."
          },
          {
            "q": "**にゃ** đọc là:",
            "options": [
              "niya",
              "nyu",
              "nyo",
              "nya"
            ],
            "correct": 3,
            "why": "にゃ = **nya**."
          },
          {
            "q": "**ひゃ** đọc là:",
            "options": [
              "hiya",
              "hyu",
              "hya",
              "hyo"
            ],
            "correct": 2,
            "why": "ひゃ = **hya**."
          }
        ]
      },
      {
        "t": "h",
        "text": "E. っ · trường âm · ん · trợ từ (12 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-e",
        "title": "E. Độ dài âm và trợ từ",
        "items": [
          {
            "q": "**obaasan** viết là:",
            "options": [
              "おばさん",
              "おばあさん",
              "おばあさ",
              "おばあん"
            ],
            "correct": 1,
            "why": "obaasan = **おばあさん**."
          },
          {
            "q": "**kitte** viết là:",
            "options": [
              "きって",
              "きて",
              "きつて",
              "きいて"
            ],
            "correct": 0,
            "why": "kitte = **きって**."
          },
          {
            "q": "**gakkou** viết là:",
            "options": [
              "がこう",
              "がっこ",
              "がつこう",
              "がっこう"
            ],
            "correct": 3,
            "why": "gakkou = **がっこう**."
          },
          {
            "q": "**sensei** viết là:",
            "options": [
              "せんせ",
              "せいせい",
              "せんせい",
              "せんせえ"
            ],
            "correct": 2,
            "why": "sensei = **せんせい**."
          },
          {
            "q": "**zasshi** viết là:",
            "options": [
              "ざし",
              "ざっし",
              "ざつし",
              "さっし"
            ],
            "correct": 1,
            "why": "zasshi = **ざっし**."
          },
          {
            "q": "**ryokou** viết là:",
            "options": [
              "りょこう",
              "りょうこう",
              "りよこう",
              "りょこ"
            ],
            "correct": 0,
            "why": "ryokou = **りょこう**."
          },
          {
            "q": "**juu** viết là:",
            "options": [
              "じゆう",
              "じゅ",
              "じょう",
              "じゅう"
            ],
            "correct": 3,
            "why": "juu = **じゅう**."
          },
          {
            "q": "**kin'en** viết là:",
            "options": [
              "きねん",
              "きんねん",
              "きんえん",
              "きえん"
            ],
            "correct": 2,
            "why": "kin'en = **きんえん**."
          },
          {
            "q": "**kooto** viết là:",
            "options": [
              "コト",
              "コート",
              "コオト",
              "コーットー"
            ],
            "correct": 1,
            "why": "kooto = **コート**."
          },
          {
            "q": "「わたし**は**」 — は đọc là:",
            "options": [
              "wa",
              "ha",
              "ba",
              "o"
            ],
            "correct": 0,
            "why": "Trợ từ は đọc **wa**."
          },
          {
            "q": "「パン**を**ください」 — を đọc là:",
            "options": [
              "wo (bật rõ w)",
              "wa",
              "e",
              "o"
            ],
            "correct": 3,
            "why": "Trợ từ を đọc **o**."
          },
          {
            "q": "「がっこう」 có mấy nhịp?",
            "options": [
              "3",
              "5",
              "4",
              "6"
            ],
            "correct": 2,
            "why": "が・っ・こ・う = **4** nhịp."
          }
        ]
      },
      {
        "t": "h",
        "text": "F. Đọc từ → nghĩa (12 câu)"
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-f",
        "title": "F. Nghĩa của từ",
        "items": [
          {
            "q": "「がくせい」 nghĩa là:",
            "options": [
              "du lịch",
              "sinh viên",
              "cà phê",
              "siêu thị"
            ],
            "correct": 1,
            "why": "**がくせい** (gakusei) = sinh viên."
          },
          {
            "q": "「せんせい」 nghĩa là:",
            "options": [
              "thầy cô",
              "đồng hồ",
              "bia",
              "bà"
            ],
            "correct": 0,
            "why": "**せんせい** (sensei) = thầy cô."
          },
          {
            "q": "「しゅみ」 nghĩa là:",
            "options": [
              "ví tiền",
              "nhà vệ sinh",
              "con tem",
              "sở thích"
            ],
            "correct": 3,
            "why": "**しゅみ** (shumi) = sở thích."
          },
          {
            "q": "「りょこう」 nghĩa là:",
            "options": [
              "cà phê",
              "siêu thị",
              "du lịch",
              "sinh viên"
            ],
            "correct": 2,
            "why": "**りょこう** (ryokou) = du lịch."
          },
          {
            "q": "「とけい」 nghĩa là:",
            "options": [
              "bia",
              "đồng hồ",
              "bà",
              "thầy cô"
            ],
            "correct": 1,
            "why": "**とけい** (tokei) = đồng hồ."
          },
          {
            "q": "「さいふ」 nghĩa là:",
            "options": [
              "ví tiền",
              "nhà vệ sinh",
              "con tem",
              "sở thích"
            ],
            "correct": 0,
            "why": "**さいふ** (saifu) = ví tiền."
          },
          {
            "q": "「コーヒー」 nghĩa là:",
            "options": [
              "siêu thị",
              "sinh viên",
              "du lịch",
              "cà phê"
            ],
            "correct": 3,
            "why": "**コーヒー** (koohii) = cà phê."
          },
          {
            "q": "「ビール」 nghĩa là:",
            "options": [
              "bà",
              "thầy cô",
              "bia",
              "đồng hồ"
            ],
            "correct": 2,
            "why": "**ビール** (biiru) = bia."
          },
          {
            "q": "「トイレ」 nghĩa là:",
            "options": [
              "con tem",
              "nhà vệ sinh",
              "sở thích",
              "ví tiền"
            ],
            "correct": 1,
            "why": "**トイレ** (toire) = nhà vệ sinh."
          },
          {
            "q": "「スーパー」 nghĩa là:",
            "options": [
              "siêu thị",
              "sinh viên",
              "du lịch",
              "cà phê"
            ],
            "correct": 0,
            "why": "**スーパー** (suupaa) = siêu thị."
          },
          {
            "q": "「おばあさん」 nghĩa là:",
            "options": [
              "thầy cô",
              "đồng hồ",
              "bia",
              "bà"
            ],
            "correct": 3,
            "why": "**おばあさん** (obaasan) = bà."
          },
          {
            "q": "「きって」 nghĩa là:",
            "options": [
              "sở thích",
              "ví tiền",
              "con tem",
              "nhà vệ sinh"
            ],
            "correct": 2,
            "why": "**きって** (kitte) = con tem."
          }
        ]
      },
      {
        "t": "h",
        "text": "G. Nghe (8 câu)"
      },
      {
        "t": "listen",
        "id": "lt-b0-kt-g-nghe",
        "title": "Nghe 8 từ — mỗi từ một lần",
        "lines": [
          {
            "who": "①",
            "voice": "ja-nu",
            "text": "おばあさん",
            "ro": "obaasan",
            "vi": "bà"
          },
          {
            "who": "②",
            "voice": "ja-nam",
            "text": "きって",
            "ro": "kitte",
            "vi": "con tem"
          },
          {
            "who": "③",
            "voice": "ja-nu",
            "text": "びょういん",
            "ro": "byouin",
            "vi": "bệnh viện"
          },
          {
            "who": "④",
            "voice": "ja-nam",
            "text": "ビール",
            "ro": "biiru",
            "vi": "bia"
          },
          {
            "who": "⑤",
            "voice": "ja-nu",
            "text": "ゆき",
            "ro": "yuki",
            "vi": "tuyết"
          },
          {
            "who": "⑥",
            "voice": "ja-nam",
            "text": "かぎ",
            "ro": "kagi",
            "vi": "chìa khoá"
          },
          {
            "who": "⑦",
            "voice": "ja-nu",
            "text": "さっか",
            "ro": "sakka",
            "vi": "nhà văn"
          },
          {
            "who": "⑧",
            "voice": "ja-nam",
            "text": "じゅう",
            "ro": "juu",
            "vi": "mười"
          }
        ],
        "note": "Chưa mở lời thoại; nghe xong làm 8 câu hỏi."
      },
      {
        "t": "mcq",
        "id": "lt-b0-kt-g",
        "title": "G. Bạn nghe thấy từ nào?",
        "items": [
          {
            "q": "① Bạn nghe thấy từ nào?",
            "options": [
              "おばあさん",
              "おばさん"
            ],
            "correct": 0,
            "why": "Đã đọc **おばあさん** (obaasan, bà); おばさん = obasan."
          },
          {
            "q": "② Bạn nghe thấy từ nào?",
            "options": [
              "きて",
              "きって"
            ],
            "correct": 1,
            "why": "Đã đọc **きって** (kitte, con tem); きて = kite."
          },
          {
            "q": "③ Bạn nghe thấy từ nào?",
            "options": [
              "びょういん",
              "びよういん"
            ],
            "correct": 0,
            "why": "Đã đọc **びょういん** (byouin, bệnh viện); びよういん = biyouin."
          },
          {
            "q": "④ Bạn nghe thấy từ nào?",
            "options": [
              "ビル",
              "ビール"
            ],
            "correct": 1,
            "why": "Đã đọc **ビール** (biiru, bia); ビル = biru."
          },
          {
            "q": "⑤ Bạn nghe thấy từ nào?",
            "options": [
              "ゆき",
              "ゆうき"
            ],
            "correct": 0,
            "why": "Đã đọc **ゆき** (yuki, tuyết); ゆうき = yuuki."
          },
          {
            "q": "⑥ Bạn nghe thấy từ nào?",
            "options": [
              "かき",
              "かぎ"
            ],
            "correct": 1,
            "why": "Đã đọc **かぎ** (kagi, chìa khoá); かき = kaki."
          },
          {
            "q": "⑦ Bạn nghe thấy từ nào?",
            "options": [
              "さっか",
              "さか"
            ],
            "correct": 0,
            "why": "Đã đọc **さっか** (sakka, nhà văn); さか = saka."
          },
          {
            "q": "⑧ Bạn nghe thấy từ nào?",
            "options": [
              "じゆう",
              "じゅう"
            ],
            "correct": 1,
            "why": "Đã đọc **じゅう** (juu, mười); じゆう = jiyuu."
          }
        ]
      },
      {
        "t": "table",
        "head": [
          "Điểm",
          "Đánh giá",
          "Làm gì tiếp"
        ],
        "rows": [
          [
            "85–100",
            "✅ Vững bảng chữ",
            "Sang Bài 1. Mỗi ngày đọc to 5 phút một đoạn kana để giữ tốc độ."
          ],
          [
            "70–84",
            "🟡 Còn hổng vài chỗ",
            "Làm lại phần có ≥ 3 câu sai (xem bảng dưới), rồi làm lại đề sau 1 ngày."
          ],
          [
            "< 70",
            "🔴 Chưa đủ để học Bài 1",
            "Học lại theo hàng (bài \"Hiragana theo hàng\"), mỗi ngày 2 hàng; làm lại đề sau 3 ngày."
          ]
        ],
        "caption": "Thang điểm (mỗi câu 1,25 điểm)"
      },
      {
        "t": "table",
        "head": [
          "Sai nhiều ở phần",
          "Ôn lại bài"
        ],
        "rows": [
          [
            "A, C (hiragana, cặp nhầm)",
            "Luyện thêm · Hiragana theo hàng + Cặp chữ dễ nhầm"
          ],
          [
            "B (katakana)",
            "Luyện thêm · Katakana"
          ],
          [
            "D (âm đục, âm ghép)",
            "Luyện thêm · Âm đục ゛, bán đục ゜ và âm ghép ゃゅょ"
          ],
          [
            "E, G (độ dài âm, nghe)",
            "Luyện thêm · っ, trường âm, ん và は・へ・を"
          ],
          [
            "F (nghĩa từ)",
            "Luyện thêm · Đọc từ thật của Bài 1–2"
          ]
        ],
        "caption": "Sai câu nào — ôn mục nào"
      }
    ]
  }
];
