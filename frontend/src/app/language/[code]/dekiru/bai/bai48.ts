/**
 * Bài 48 — 原因と結果 (Nhân quả) · TIẾP SAU SÁCH, cấp N2 (xem ../SOAN-BAI.md mục 8). Bài thứ ba của chặng N2 46–50
 * (Bài 50 = kiểm tra chặng).
 * Người học đã xong Bài 1–15 (ポイント 1–124), Bài 16–25 (N4), Bài 26–40 (N3), Bài 41–47 (N2: ～際に・～に際して・～にあたって・
 * ～をきっかけに · ～に限らず・～をはじめ・～を問わず・～にかかわらず · ～からすると・～にしては・～わりに・～はともかく · ～あげく・～末に・
 * ～きり・～次第 · ～ざるを得ない・～ずにはいられない・～てたまらない · ～得る・～かねない・～かねる・～おそれがある · ～しかない・～ほかない・
 * ～からには・～以上は). Bài 45 và 47 soạn song song — KHÔNG dạy lại các mẫu đó (chỉ nhắc tên khi cần phân biệt).
 * Liên quan trực tiếp, KHÔNG dạy lại (chỉ ghi "ôn: Bài X"): ～せいで・～おかげで・～ため（に）・～によって (Bài 27 — ở bảng ⑨ của Bài 27
 * đã CHỈ NHẬN RA ～ばかりに và ～ことから) · ～ものの (Bài 28 ②) · ～ものだ (Bài 32 ① — ở Bài 32 đã nhắc trước ～ものだから "Bài 48") ·
 * ～わりに (Bài 43 — ở đó đã hẹn dạy ～だけあって／～だけに ở Bài 48) · ～からといって (N3) · Vたばかり／Nばかり (Bài 22 — khác hẳn
 * ～ばかりに) · ～かねない (Bài 46). Kiểm bằng grep 09/11: ～ばかりに, ～ことから, ～ことだから, ～だけに (nghĩa "chính vì… nên càng"),
 * ～だけあって, ～だけの (価値がある), ～ものだから／もんだから CHƯA được dạy chính thức ở Bài 1–47 ⇒ ở đây học CHÍNH THỨC + mở rộng.
 *
 * Ngữ pháp (N2) — nhóm "NÓI VỀ NGUYÊN NHÂN có màu sắc": ① V普通形・イAい・ナAな／である・Nである＋ばかりに: chỉ vì… mà (hậu quả XẤU,
 * tiếc nuối) + Vたいばかりに: chỉ vì muốn… mà (làm điều vất vả / quá mức) · ② 普通形 (ナAな／である, Nである)＋ことから: (1) căn cứ phán
 * đoán (～ことから、～と考えられる／分かる) (2) nguồn gốc tên gọi (～ことから、～と呼ばれる／名付けられた) (3) nguyên nhân (văn viết) +
 * phân biệt Nのことだから (vì là X — biết tính X — nên chắc…) · ③ 普通形 (ナAな／である, N／Nである)＋だけに: chính vì… nên (càng) — kết quả
 * tương xứng, mức độ hơn thường, tốt hay xấu đều được (期待していただけにがっかりした) + ～だけあって (đúng là… có khác — chỉ khen) +
 * ～だけの N (tương xứng / hết mức: それだけの価値がある・できるだけのことはした) + ～だけのことはある · ④ 普通形 (ナAな, Nな)＋ものだから／
 * もんだから: tại vì… nên (lý do cá nhân, BIỆN MINH; lịch sự: ものですから) · ⑤ BẢNG nguyên nhân: ばかりに ↔ せいで ↔ おかげで ↔ ため ↔
 * ものだから ↔ から／ので · ⑥ BẢNG ことから ↔ ことだから ↔ から · ⑦ BẢNG họ だけ: だけに ↔ だけあって ↔ だけの ↔ だけのことはある ↔
 * さすが ↔ わりに (Bài 43) · ⑧ BẢNG họ もの: ものだから ↔ ものの (Bài 28) ↔ ものだ (Bài 32) ↔ もの／もん cuối câu.
 * Từ vựng: 67 từ (N2 là chính, từ N1 có ghi cấp), 5 nhóm: nhân quả & căn cứ · sự cố & giải trình ở công ty · địa danh & nguồn gốc ·
 * đánh giá ("đúng là… có khác") · lý do & hậu quả đời thường — kèm bảng TỪ DỄ NHẦM (類義語) và KẾT HỢP TỪ (コロケーション). Từ đã học
 * ở Bài 1–47 KHÔNG lặp (chỉ "ôn"): {原因|げんいん}・{要因|よういん} xuất hiện ở Bài 27 (原因 là từ vựng Bài 27), {理由|りゆう} (Bài 19), {結果的|けっかてき}に・{判明|はんめい}する・
 * {復旧|ふっきゅう}する・{台無|だいな}し・{水|みず}の{泡|あわ} (Bài 44), {背景|はいけい}・{障害|しょうがい} (Bài 42), {根拠|こんきょ}・{傾向|けいこう}・{立場|たちば} (Bài 28), {証拠|しょうこ} (Bài 31), {偶然|ぐうぜん} (Bài 26),
 * {由来|ゆらい}・{縁起|えんぎ}・{恥|はじ}をかく (Bài 36), {言|い}い{訳|わけ} (Bài 28), {謝罪|しゃざい} (Bài 37), {手順|てじゅん}・{統計|とうけい}・データ (Bài 33), {評判|ひょうばん}・{実力|じつりょく} (Bài 43),
 * {一生懸命|いっしょうけんめい}・{自信|じしん} (Bài 16), {悔|くや}しい (Bài 22), {惜|お}しい・{余計|よけい} (Bài 35), {後悔|こうかい}・{夜更|よふ}かし (Bài 34), {寝不足|ねぶそく} (Bài 27), {油断|ゆだん} (Bài 46),
 * {責任感|せきにんかん}・プレッシャー (Bài 47), {気|き}まずい (Bài 45), {体調|たいちょう}を{崩|くず}す (Bài 44), {素直|すなお} (Bài 23), うっかり・ミス (Bài 19)…
 * Chữ Hán mới (24): 坂 谷 岸 浜 湾 丘 郷 称 縁 遺 釈 慌 遭 詰 陥 嘆 懸 拠 錯 冗 愚 芸 賢 穏 — không trùng hanTu.ts, hanTu16–47.ts,
 * hanTuTiep.ts, hanLop.ts và mọi bảng chữ Hán Bài 1–47 (kiểm bằng script 09/11: ~1.110 chữ đã dạy; Bài 43 = 総 劣 微 妙 星 雰 盛 稿 濃 薄
 * 演 劇 俳 監 督 脚 賞 審 豊 富 迫 鋭 珍 熟 · Bài 44 = 第 挙 句 討 渉 妥 功 粘 再 競 涙 泡 崩 奇 跡 看 舞 捜 索 独 腕 伸 · Bài 45 = 従 拒 罰 償 促
 * 徹 恩 怠 黙 抑 興 奮 激 憧 羨 憎 恨 屈 飽 胸 焦 堪 誇 慰 · Bài 46 = 災 津 波 避 揺 噴 詐 欺 偽 漏 侵 怪 狙 脅 威 菌 炎 免 疫 株 損 益 慎 暴 · Bài 47 =
 * 悟 誓 諦 貫 勇 敢 尽 践 遂 肝 揮 筋 唯 剣 根 克 忍 闘 鍛 宣 叶 壁 維). Cấp chữ theo các bảng tham khảo phổ biến (JLPT không công bố danh sách
 * chính thức): 芸 冗 N3; 坂 谷 岸 浜 湾 丘 郷 称 縁 遺 釈 詰 拠 愚 phần lớn bảng xếp N2; 慌 遭 陥 嘆 懸 錯 賢 穏 nhiều bảng xếp N1 nhưng
 * TỪ chứa chúng (慌てる・事故に遭う・欠陥・嘆く・懸命に・錯覚・賢い・穏やか) là từ N2 hay gặp. Thẻ chữ Hán: hanTu48.ts (HAN_TU_48).
 * (17:15 09/11: 密 頻 昇 lúc đầu chọn đã đổi thành 錯 冗 愚 vì hanTu49.ts — soạn song song — dùng 密 頻 昇; từ 密接・頻度・頻繁・昇進
 * vẫn dạy ở mục Từ vựng nhưng KHÔNG dùng trong câu đọc không furigana. Cũng tránh 繁 của Bài 49.)
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe, bài mẫu: VIẾT MỚI 100%, không chép giáo trình / đề thi nào (新完全マスター, 総まとめ,
 * 公式問題集…). Mọi số liệu (phần trăm, số người, số giờ) là MINH HOẠ của tình huống, KHÔNG phải số liệu thống kê thật; tên công ty
 * (みどり旅行), tên phố (浜見坂・桜が丘), tên trường đều là tên giả.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木,
 * {佐藤先生|さとうせんせい} · nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, {小林店長|こばやしてんちょう}, {森課長|もりかちょう}, {田村|たむら}.
 * Nối tiếp Bài 41–47: ワン (nữ — đã có 内定 ở さくらシステム, đang thực tập), {鈴木|すずき} (nữ — nhân viên kèm ワン), {森課長|もりかちょう} (nam —
 * trưởng phòng) · マリヤム (nữ) và ダニエル (nam) ở {国際寮|こくさいりょう} · リン (nữ, người Việt) và カルロス (nam) — sinh viên năm cuối
 * {みなと大学|みなとだいがく}, đang viết {卒論|そつろん}, ゼミ của cô {佐藤先生|さとうせんせい} (nữ — lần này xuất hiện ở hội thoại ③).
 * Người MỚI: {大野|おおの}さん (nam — tình nguyện viên dẫn đoàn đi bộ tìm hiểu lịch sử khu phố, ja-nam) · ở phần nghe / đọc: ラジオの
 * アナウンサー (nữ — ja-nu), {研究者|けんきゅうしゃ} (nam — ja-nam), {店長|てんちょう} của tiệm bánh lâu năm (nữ — ja-nu), {係|かかり}の{人|ひと} của
 * bảo tàng địa phương (nữ — ja-nu). ナレーター (người dẫn đề) = ja-nu.
 * Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam (trang tự đổi sang giọng thứ hai khi có hai người cùng giới).
 * Nghe: 'ja-nu' = nữ, 'ja-nam' = nam. Hình: tên trong scripts/hinh/fluent-catalog.json (Fluent Emoji).
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

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/**
 * Câu trắc nghiệm soạn với đáp án đúng ở vị trí `correct` (thường 0) → dời đáp án đúng sang vị trí (i % 4) cố định, không ngẫu
 * nhiên (tiến độ lưu theo câu không đổi), để người học không đoán được "đáp án luôn là a)".
 */
const DOI = (items: Mcq[], lech = 0): Mcq[] =>
  items.map((it, i) => {
    const k = (i + lech) % it.options.length;
    const dung = it.options[it.correct];
    const sai = it.options.filter((_, j) => j !== it.correct);
    const options = [...sai.slice(0, k), dung, ...sai.slice(k)];
    return { ...it, options, correct: k };
  });

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b48-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 原因と結果: báo cáo sự cố hệ thống ở công ty, đi bộ tìm nguồn gốc tên phố, sau buổi báo cáo giữa kỳ khoá luận',
  goal: 'Ở công ty, nhận lỗi và nói nguyên nhân đúng giọng: nhận ra lời bào chữa ～ものですから (終電が迫っていたものですから) và vì sao không nên mở đầu báo cáo bằng nó, nói tiếc nuối bằng ～ばかりに (確認を一つ怠ったばかりに), nói "chính vì quan trọng nên càng phải…" bằng ～だけに (大切な取引先だけに), lập luận từ căn cứ bằng ～ことから (確認欄がなかったことから考えると) và khen bằng ～だけあって; khi đi tìm hiểu khu phố, giải thích nguồn gốc tên gọi bằng ～ことから (～ことから「浜見坂」と呼ばれるようになった), nói "đáng để…" bằng ～だけの価値がある, đoán theo tính người quen bằng ～のことだから; sau một buổi báo cáo thất bại, kể lý do bằng ～たいばかりに và ～もんだから, an ủi bằng ～だけに悔しい, phân biệt tương quan (相関) với nhân quả (因果関係).',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 48 — chủ đề: nhân quả — sự cố ở công ty, nguồn gốc địa danh, nghiên cứu khoá luận (cấp N2)',
      items: [
        'Ở N3 (Bài 27) bạn đã nói nguyên nhân bằng **～せいで** (đổ lỗi), **～おかげで** (biết ơn), **～ため（に）** (khách quan, văn viết). Ở N2, đề thi đòi bạn nghe ra **MÀU SẮC** của một lời nói về nguyên nhân: **tiếc nuối** "chỉ vì một chuyện nhỏ mà…" (**～ばかりに**), **suy ra từ căn cứ** hay **giải thích tên gọi** (**～ことから**), **"chính vì… nên càng…"** (**～だけに**), **bào chữa cá nhân** (**～ものだから**). Bốn mẫu này dày đặc trong **bản tin, báo cáo, bài báo lịch sử – văn hoá, lời xin lỗi** — đúng loại văn bản của đề N2.',
        'Bốn mẫu mới: **～ばかりに** (chỉ vì… mà — hậu quả xấu; **～たいばかりに**: chỉ vì muốn…) · **～ことから** (từ việc… → suy ra / đặt tên) · **～だけに** (chính vì… nên càng; cùng họ **～だけあって** "đúng là… có khác" và **～だけの** "tương xứng") · **～ものだから／もんだから** (tại vì… — lý do biện minh). Bẫy lớn của đề: **ばかりに ↔ せいで** (cả hai đều xấu — khác ở chỗ nào?), **ことから ↔ ことだから**, **だけに ↔ だけあって**, **ものだから ↔ ものの** — bốn bảng ⑤–⑧.',
        'Ba tình huống: ① **さくらシステム**: hệ thống đặt tour của khách hàng ngừng chạy hai tiếng sau khi **ワン** cập nhật; chị **{鈴木|すずき}** tìm ra nguyên nhân, **{森課長|もりかちょう}** dạy cách báo cáo · ② **khu phố quanh {国際寮|こくさいりょう}**: **マリヤム** và **ダニエル** theo ông **{大野|おおの}** đi bộ tìm nguồn gốc tên các con dốc, ngọn đồi · ③ **{大学|だいがく}**: **カルロス** vừa báo cáo giữa kỳ khoá luận không tốt; **リン** an ủi, cô **{佐藤先生|さとうせんせい}** chỉ ra lỗi "nhầm tương quan với nhân quả".',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe. Cấp N2: **nghe hai lần không nhìn chữ** — lần 1 nắm "chuyện gì xảy ra, vì sao, thái độ người nói", lần 2 bắt từng mẫu ngữ pháp — rồi mới đọc phân vai.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 48 bạn làm được (できる)',
      items: [
        '**① {失敗|しっぱい}の{原因|げんいん}を{報告|ほうこく}する** — nói tiếc nuối: **たった{一|ひと}つの{確認|かくにん}を{怠|おこた}ったばかりに、ご{迷惑|めいわく}をおかけしてしまいました** · nhấn mức độ: **{大切|たいせつ}な{取引先|とりひきさき}だけに、きちんと{説明|せつめい}しないと** · lập luận từ căn cứ: **{確認|かくにん}する{欄|らん}がなかったことから{考|かんが}えると、{誰|だれ}にでも{起|お}こり{得|え}た** · khen: **{長年|ながねん}{見|み}てこられただけあって、{冷静|れいせい}ですね** · biết vì sao **～ものですから** nghe như lời bào chữa.',
        '**② {地名|ちめい}の{由来|ゆらい}を{説明|せつめい}する** — **{坂|さか}の{上|うえ}から{砂浜|すなはま}が{見|み}えたことから、「{浜見坂|はまみざか}」と{呼|よ}ばれるようになった** · **{桜|さくら}が{多|おお}いことから{名付|なづ}けられた** · **{漁師|りょうし}の{町|まち}だっただけに、{魚料理|さかなりょうり}の{店|みせ}が{多|おお}い** · **{一度|いちど}は{見|み}に{来|く}るだけの{価値|かち}がある** · **ダニエルのことだから、また{百枚|ひゃくまい}ぐらい{撮|と}るでしょう**.',
        '**③ {理由|りゆう}を{話|はな}す・{慰|なぐさ}める** — **いいところを{見|み}せたいばかりに、データを{詰|つ}め{込|こ}みすぎた** · **{朝|あさ}の{四時|よじ}まで{直|なお}してたもんだから、{頭|あたま}が{回|まわ}らなくて** · **{一生懸命|いっしょうけんめい}やっていただけに、{悔|くや}しいよね** · **{相関|そうかん}があるからといって、{因果関係|いんがかんけい}があるとは{言|い}えない**.',
        '**できる！** — kể lại **một thất bại của mình** theo trình tự "chuyện gì → vì sao (nguyên nhân thật, không bào chữa) → học được gì"; giải thích **nguồn gốc tên một nơi / một món ăn** ở quê bạn; trình bày 1 phút **"Một thất bại dạy tôi nhiều nhất"**; viết **bài ý kiến 400–600 chữ** "Khi thất bại, nên tìm nguyên nhân ở bản thân hay ở hoàn cảnh?" và **một báo cáo sự cố ~250 chữ** (経緯 → 原因 → 対策).',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — muốn nói gì, dùng mẫu nào',
      head: ['Bạn muốn nói…', 'Câu then chốt', 'Romaji', 'Mục'],
      rows: [
        ['Chỉ vì (một chuyện nhỏ) mà hậu quả xấu', 'パスワードを{一度|いちど}{間違|まちが}えたばかりに、ロックされてしまった。', 'Pasuwaado o ichido machigaeta bakari ni, rokku sarete shimatta.', '① ばかりに'],
        ['Chỉ vì muốn… mà (làm điều vất vả)', '{彼女|かのじょ}に{会|あ}いたいばかりに、{雨|あめ}の{中|なか}を{二時間|にじかん}も{待|ま}った。', 'Kanojo ni aitai bakari ni, ame no naka o nijikan mo matta.', '① たいばかりに'],
        ['Từ căn cứ này mà suy ra…', '{窓|まど}が{割|わ}れていることから、{犯人|はんにん}は{外|そと}から{入|はい}ったと{考|かんが}えられる。', 'Mado ga warete iru koto kara, hannin wa soto kara haitta to kangaerareru.', '② ことから'],
        ['Vì đặc điểm này nên mới có tên…', '{形|かたち}が{富士山|ふじさん}に{似|に}ていることから、「{津軽富士|つがるふじ}」と{呼|よ}ばれている。', 'Katachi ga Fujisan ni nite iru koto kara, "Tsugaru Fuji" to yobarete iru.', '② ことから'],
        ['Biết tính người đó nên chắc…', '{真面目|まじめ}な{彼|かれ}のことだから、{約束|やくそく}は{守|まも}るだろう。', 'Majime na kare no koto da kara, yakusoku wa mamoru darou.', '② ことだから'],
        ['Chính vì… nên (càng)…', '{期待|きたい}していただけに、{負|ま}けた{時|とき}はショックだった。', 'Kitai shite ita dake ni, maketa toki wa shokku datta.', '③ だけに'],
        ['Đúng là… có khác (khen)', 'プロの{料理人|りょうりにん}だけあって、{包丁|ほうちょう}の{使|つか}い{方|かた}が{違|ちが}う。', 'Puro no ryourinin dake atte, houchou no tsukaikata ga chigau.', '③ だけあって'],
        ['Tại vì… nên (bào chữa)', '{道|みち}が{混|こ}んでいたものですから、{遅|おく}れてしまいました。', 'Michi ga konde ita mono desu kara, okurete shimaimashita.', '④ ものだから'],
      ],
    },

    /* ── ① 障害報告 ── */
    { t: 'h', text: '① {障害|しょうがい}の{報告|ほうこく} — "たった{一|ひと}つの{確認|かくにん}を{怠|おこた}ったばかりに"' },
    {
      t: 'canh',
      anh: ['woman-office-worker', 'desktop-computer', 'warning', 'man-office-worker'],
      caption: 'Phòng phát triển công ty さくらシステム, 9 giờ sáng thứ Ba. Đêm qua hệ thống đặt tour trực tuyến của khách hàng みどり旅行 ngừng chạy gần hai tiếng, ngay sau khi ワン cập nhật phiên bản mới. Chị 鈴木 vừa tìm ra nguyên nhân.',
    },
    {
      t: 'p',
      text: 'Tình huống: **ワン** (nữ, thực tập sinh) lần đầu gây ra một sự cố thật. Lúc đầu bạn ấy giải thích bằng **～ものですから** (lý do cá nhân — mục ④), chị **{鈴木|すずき}** (nữ) nhắc rằng mở đầu báo cáo bằng câu đó **dễ nghe như bào chữa**. ワン chuyển sang **～ばかりに** (tiếc nuối, nhận trách nhiệm — mục ①). Chị 鈴木 dùng **～だけに** để nhấn "chính vì là khách hàng quan trọng nên càng phải…" (mục ③). **{森課長|もりかちょう}** (nam) lập luận từ căn cứ bằng **～ことから** (mục ②) và được khen bằng **～だけあって**. Hai đồng nghiệp nữ nói với nhau thể です・ます nhẹ (chị 鈴木 thân hơn nên nói thể thường); với cấp trên — kính ngữ.',
    },
    DL('Phòng phát triển — "Chỉ vì lơ là đúng một bước kiểm tra"', [
      ['{鈴木|すずき}', 'c', 'ワンさん、{昨夜|さくや}の{不具合|ふぐあい}、{原因|げんいん}が{分|わ}かったわ。{更新|こうしん}の{時|とき}の{設定|せってい}ファイルが、{古|ふる}いままだったの。', 'Wan-san, sakuya no fuguai, gen\'in ga wakatta wa. Koushin no toki no settei fairu ga, furui mama datta no.', 'Wang này, chị tìm ra nguyên nhân sự cố đêm qua rồi. File cấu hình lúc cập nhật vẫn là bản cũ.'],
      ['ワン', 'a', 'やっぱり、{私|わたし}のミスですね……。チェックリストの{最後|さいご}の{項目|こうもく}を、{確認|かくにん}しないで{進|すす}めてしまいました。{終電|しゅうでん}の{時間|じかん}が{迫|せま}っていたものですから……。', 'Yappari, watashi no misu desu ne……. Chekku risuto no saigo no koumoku o, kakunin shinaide susumete shimaimashita. Shuuden no jikan ga sematte ita mono desu kara…….', 'Quả nhiên là lỗi của em… Em đã làm tiếp mà không kiểm tra mục cuối của danh sách kiểm tra. Tại giờ chuyến tàu cuối sắp tới nên…'],
      ['{鈴木|すずき}', 'c', '{気持|きも}ちは{分|わ}かるわ。でも、{課長|かちょう}に{報告|ほうこく}する{時|とき}は、{最初|さいしょ}に「{終電|しゅうでん}が{迫|せま}っていたものですから」とは{言|い}わないほうがいいわね。{言|い}い{訳|わけ}に{聞|き}こえかねないから。', 'Kimochi wa wakaru wa. Demo, kachou ni houkoku suru toki wa, saisho ni "shuuden ga sematte ita mono desu kara" to wa iwanai hou ga ii wa ne. Iiwake ni kikoekanenai kara.', 'Chị hiểu cảm giác đó. Nhưng khi báo cáo với trưởng phòng thì đừng mở đầu bằng "tại giờ tàu cuối sắp tới nên…". Nghe e là thành bào chữa đấy.'],
      ['ワン', 'a', 'はい……。たった{一|ひと}つの{確認|かくにん}を{怠|おこた}ったばかりに、お{客様|きゃくさま}に{大変|たいへん}なご{迷惑|めいわく}をおかけしてしまいました。', 'Hai……. Tatta hitotsu no kakunin o okotatta bakari ni, okyakusama ni taihen na gomeiwaku o okake shite shimaimashita.', 'Vâng… Chỉ vì lơ là đúng một bước kiểm tra mà em đã gây phiền hà lớn cho khách hàng.'],
      ['{鈴木|すずき}', 'c', 'みどり{旅行|りょこう}さんは、うちと{十年|じゅうねん}{以上|いじょう}のお{付|つ}き{合|あ}いがある{大切|たいせつ}な{取引先|とりひきさき}だけに、きちんと{説明|せつめい}しないとね。{週末|しゅうまつ}の{予約|よやく}が{集中|しゅうちゅう}する{時間|じかん}だっただけに、{影響|えいきょう}も{小|ちい}さくないし。', 'Midori Ryokou-san wa, uchi to juunen ijou no otsukiai ga aru taisetsu na torihikisaki dake ni, kichinto setsumei shinai to ne. Shuumatsu no yoyaku ga shuuchuu suru jikan datta dake ni, eikyou mo chiisaku nai shi.', 'Midori Travel là khách hàng quan trọng đã làm ăn với công ty mình hơn mười năm, chính vì thế càng phải giải thích đàng hoàng. Lại đúng giờ đặt tour cuối tuần dồn dập, nên ảnh hưởng cũng không nhỏ.'],
      ['{森課長|もりかちょう}', 'b', 'おはようございます。{二人|ふたり}とも、{昨夜|さくや}の{件|けん}ですね。{鈴木|すずき}さんから{経緯|けいい}は{聞|き}きました。', 'Ohayou gozaimasu. Futari tomo, sakuya no ken desu ne. Suzuki-san kara keii wa kikimashita.', 'Chào buổi sáng. Hai người đang bàn chuyện đêm qua phải không. Tôi đã nghe chị Suzuki kể đầu đuôi rồi.'],
      ['ワン', 'a', '{課長|かちょう}、{申|もう}し{訳|わけ}ございませんでした。{私|わたし}の{不注意|ふちゅうい}で、システムを{二時間|にじかん}も{止|と}めてしまいました。', 'Kachou, moushiwake gozaimasen deshita. Watashi no fuchuui de, shisutemu o nijikan mo tomete shimaimashita.', 'Thưa trưởng phòng, em thành thật xin lỗi. Vì em bất cẩn mà hệ thống đã dừng tới hai tiếng.'],
      ['{森課長|もりかちょう}', 'b', '{謝|あやま}ることは{大事|だいじ}です。でも、{今日|きょう}の{報告書|ほうこくしょ}には「なぜ{起|お}きたか」と「どう{防|ふせ}ぐか」を{書|か}いてください。{気持|きも}ちは{書|か}かなくていいですから。', 'Ayamaru koto wa daiji desu. Demo, kyou no houkokusho ni wa "naze okita ka" to "dou fusegu ka" o kaite kudasai. Kimochi wa kakanakute ii desu kara.', 'Xin lỗi là việc quan trọng. Nhưng trong báo cáo hôm nay, em hãy viết "vì sao xảy ra" và "phòng ngừa thế nào". Cảm xúc thì không cần viết.'],
      ['{森課長|もりかちょう}', 'b', 'それに、ワンさん{一人|ひとり}を{責|せ}めるつもりはありません。{手順書|てじゅんしょ}に{二人|ふたり}で{確認|かくにん}する{欄|らん}がなかったことから{考|かんが}えると、{同|おな}じミスは{誰|だれ}が{作業|さぎょう}しても{起|お}こり{得|え}たはずです。', 'Sore ni, Wan-san hitori o semeru tsumori wa arimasen. Tejunsho ni futari de kakunin suru ran ga nakatta koto kara kangaeru to, onaji misu wa dare ga sagyou shite mo okorieta hazu desu.', 'Hơn nữa, tôi không định trách một mình em. Xét từ việc bản quy trình không có ô để hai người cùng kiểm tra, thì lỗi tương tự ai làm cũng có thể xảy ra.'],
      ['{鈴木|すずき}', 'c', 'さすが{課長|かちょう}、{長年|ながねん}システムを{見|み}てこられただけあって、{冷静|れいせい}ですね。', 'Sasuga kachou, naganen shisutemu o mite korareta dake atte, reisei desu ne.', 'Đúng là trưởng phòng, trông coi hệ thống bao năm có khác, bình tĩnh thật.'],
      ['{森課長|もりかちょう}', 'b', '{冷静|れいせい}じゃありませんよ。これからみどり{旅行|りょこう}さんに{謝|あやま}りに{行|い}くので、{正直|しょうじき}、{緊張|きんちょう}しています。', 'Reisei ja arimasen yo. Kore kara Midori Ryokou-san ni ayamari ni iku node, shoujiki, kinchou shite imasu.', 'Bình tĩnh gì đâu. Giờ tôi phải sang xin lỗi Midori Travel, nói thật là đang căng thẳng.'],
      ['ワン', 'a', '{私|わたし}も{一緒|いっしょ}に{伺|うかが}わせてください。{自分|じぶん}で{直接|ちょくせつ}{謝|あやま}りたいんです。', 'Watashi mo issho ni ukagawasete kudasai. Jibun de chokusetsu ayamaritai n desu.', 'Cho em đi cùng với ạ. Em muốn tự mình xin lỗi trực tiếp.'],
      ['{森課長|もりかちょう}', 'b', '{分|わ}かりました。{十時|じゅうじ}に{出|で}ましょう。それまでに、{再発防止策|さいはつぼうしさく}の{案|あん}を{一|ひと}つでいいから{考|かんが}えておいてください。', 'Wakarimashita. Juuji ni demashou. Sore made ni, saihatsu boushisaku no an o hitotsu de ii kara kangaete oite kudasai.', 'Được rồi. Mười giờ ta đi. Trước lúc đó, em hãy nghĩ sẵn phương án phòng tái diễn, một cái thôi cũng được.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{終電|しゅうでん}の{時間|じかん}が{迫|せま}っていたものですから……。', 'Shuuden no jikan ga sematte ita mono desu kara…….', 'Tại giờ tàu cuối sắp tới nên… (④ ものですから — lý do cá nhân, dễ nghe như bào chữa)'),
        E('たった{一|ひと}つの{確認|かくにん}を{怠|おこた}ったばかりに、ご{迷惑|めいわく}をおかけしてしまいました。', 'Tatta hitotsu no kakunin o okotatta bakari ni, gomeiwaku o okake shite shimaimashita.', 'Chỉ vì lơ là đúng một bước kiểm tra mà đã gây phiền hà. (① ばかりに — tiếc nuối, nhận lỗi)'),
        E('{大切|たいせつ}な{取引先|とりひきさき}だけに、きちんと{説明|せつめい}しないといけない。', 'Taisetsu na torihikisaki dake ni, kichinto setsumei shinai to ikenai.', 'Chính vì là khách hàng quan trọng nên càng phải giải thích đàng hoàng. (③ Nだけに)'),
        E('{確認|かくにん}する{欄|らん}がなかったことから{考|かんが}えると、{誰|だれ}にでも{起|お}こり{得|え}た。', 'Kakunin suru ran ga nakatta koto kara kangaeru to, dare ni demo okorieta.', 'Xét từ việc không có ô kiểm tra thì ai cũng có thể gặp lỗi đó. (② ことから — căn cứ; 起こり得た ôn Bài 46)'),
        E('{長年|ながねん}{見|み}てこられただけあって、{冷静|れいせい}ですね。', 'Naganen mite korareta dake atte, reisei desu ne.', 'Trông coi bao năm có khác, bình tĩnh thật. (③ だけあって — khen)'),
        E('{言|い}い{訳|わけ}に{聞|き}こえかねない。', 'Iiwake ni kikoekanenai.', 'E là nghe thành bào chữa. (～かねない — ôn Bài 46)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**～ものですから** — dạng lịch sự của **～ものだから**. Người Nhật dùng nó RẤT nhiều khi giải thích vì sao mình đến muộn, quên việc… và trong lời nói thì không sai. Nhưng nó mang sắc thái **"tại vì… (nên không phải hoàn toàn lỗi tôi)"** — nên trong **báo cáo chính thức với cấp trên / khách hàng**, mở đầu bằng nó dễ bị nghe là **{言|い}い{訳|わけ}**. Trình tự an toàn: **xin lỗi → sự việc → nguyên nhân (khách quan) → biện pháp**.',
        '**{怠|おこた}ったばかりに** — {怠|おこた}る (lơ là, bỏ bê — từ của Bài 45) thể た + **ばかりに**. Từ **たった{一|ひと}つの** đứng trước làm rõ ý của ばかりに: **nguyên nhân rất nhỏ, hậu quả rất lớn** → người nói **hối hận**. Vế sau thường kết bằng **～てしまった**.',
        '**{取引先|とりひきさき}だけに** — **Nだけに** (danh từ nối thẳng, hoặc Nであるだけに). **{時間|じかん}だっただけに** — thể quá khứ cũng nối được. ～だけに ở đây = "**chính vì (đặc điểm đó) nên càng…**": quan trọng → càng phải giải thích; giờ cao điểm → ảnh hưởng càng lớn.',
        '**～なかったことから{考|かんが}えると** — **ことから** chỉ **căn cứ** của một suy luận; hay đi với **{考|かんが}えると・{考|かんが}えられる・{分|わ}かる・～と{見|み}られる**. **{起|お}こり{得|え}たはずです** — ～{得|え}た (quá khứ của ～{得|う}る — Bài 46) + はず.',
        '**{経緯|けいい}** (đầu đuôi sự việc — N1, nhưng là từ của mọi báo cáo sự cố) · **{不具合|ふぐあい}** (trục trặc, lỗi) · **{再発防止策|さいはつぼうしさく}** (biện pháp phòng tái diễn) · **{手順書|てじゅんしょ}** (bản quy trình — ôn {手順|てじゅん} Bài 33) · **{欄|らん}** (ô, cột trong biểu mẫu) · **{伺|うかが}わせてください** (cho tôi đến thăm — khiêm nhường ngữ Bài 37 + させてください).',
      ],
    },

    /* ── ② まち歩き ── */
    { t: 'h', text: '② まち{歩|ある}き — "{砂浜|すなはま}が{見|み}えたことから、そう{呼|よ}ばれるようになりました"' },
    {
      t: 'canh',
      anh: ['old-man', 'woman-student', 'man-student', 'cherry-blossom'],
      caption: 'Sáng Chủ nhật, マリヤム và ダニエル tham gia buổi "đi bộ tìm hiểu lịch sử khu phố" (まち歩き) do ký túc xá giới thiệu. Người dẫn đoàn là ông 大野 — tình nguyện viên đã sống ở khu này hơn bảy mươi năm. Cả nhóm dừng ở chân một con dốc dài.',
    },
    {
      t: 'p',
      text: 'Tình huống: ông **{大野|おおの}** (nam) giải thích **nguồn gốc tên gọi** bằng **～ことから、～と{呼|よ}ばれるようになった／{名付|なづ}けられた** (mục ②) — đúng giọng của bảng giới thiệu ở các điểm du lịch Nhật. **ダニエル** (nam) khen bằng **～だけあって** và **～だけの{価値|かち}がある** (mục ③); **マリヤム** (nữ) đoán tính bạn bằng **ダニエルのことだから** (bảng ⑥). Ông 大野 kể chuyện mình bằng **～たいばかりに** (mục ①), ダニエル tự thú bằng **もんだから** (mục ④). Với người lớn tuổi → **です・ます + kính ngữ**; hai bạn với nhau → thể thường.',
    },
    DL('Chân dốc 浜見坂 — "Đáng để tới xem một lần"', [
      ['{大野|おおの}', 'examiner', '{皆|みな}さん、ここが「{浜見坂|はまみざか}」です。{昔|むかし}はこの{坂|さか}の{上|うえ}から{海|うみ}の{砂浜|すなはま}がよく{見|み}えたことから、そう{呼|よ}ばれるようになりました。', 'Minasan, koko ga "Hamamizaka" desu. Mukashi wa kono saka no ue kara umi no sunahama ga yoku mieta koto kara, sou yobareru you ni narimashita.', 'Mọi người ơi, đây là "dốc Hamami". Ngày xưa từ đỉnh dốc này nhìn rõ bãi cát ngoài biển, nên người ta gọi như vậy.'],
      ['マリヤム', 'a', 'え、{海|うみ}ですか。{今|いま}はビルばかりで、{全然|ぜんぜん}{見|み}えませんね。', 'E, umi desu ka. Ima wa biru bakari de, zenzen miemasen ne.', 'Ơ, biển ạ? Bây giờ toàn nhà cao tầng, chẳng thấy gì cả.'],
      ['{大野|おおの}', 'examiner', 'ええ。{百年|ひゃくねん}ほど{前|まえ}に{湾|わん}を{埋|う}め{立|た}てたので、{海岸|かいがん}がずっと{遠|とお}くなったんです。', 'Ee. Hyakunen hodo mae ni wan o umetateta node, kaigan ga zutto tooku natta n desu.', 'Vâng. Khoảng trăm năm trước người ta lấp vịnh, nên bờ biển lùi ra xa hẳn.'],
      ['ダニエル', 'b', 'じゃあ、あの{丘|おか}の{上|うえ}の「{桜|さくら}が{丘|おか}{公園|こうえん}」も、{桜|さくら}の{木|き}が{多|おお}いことから{名付|なづ}けられたんですか。', 'Jaa, ano oka no ue no "Sakuragaoka kouen" mo, sakura no ki ga ooi koto kara nazukerareta n desu ka.', 'Vậy "công viên Sakuragaoka" trên ngọn đồi kia cũng được đặt tên vì có nhiều cây anh đào ạ?'],
      ['{大野|おおの}', 'examiner', 'そのとおりです。{春|はる}は{見事|みごと}ですよ。それから、この{辺|あた}りは{昔|むかし}、{漁師|りょうし}の{町|まち}だっただけに、{今|いま}でも{魚料理|さかなりょうり}のおいしい{店|みせ}が{多|おお}いんです。', 'Sono toori desu. Haru wa migoto desu yo. Sore kara, kono atari wa mukashi, ryoushi no machi datta dake ni, ima demo sakana ryouri no oishii mise ga ooi n desu.', 'Đúng vậy. Mùa xuân đẹp lắm. Ngoài ra, khu này xưa là làng chài, chính vì thế đến giờ vẫn nhiều quán đồ cá ngon.'],
      ['マリヤム', 'a', '{大野|おおの}さんは、{本当|ほんとう}に{何|なん}でもご{存|ぞん}じですね。', 'Oono-san wa, hontou ni nan demo gozonji desu ne.', 'Bác Ono thật sự cái gì cũng biết nhỉ.'],
      ['ダニエル', 'b', 'さすが、ここで{七十年|ななじゅうねん}も{暮|く}らしていらっしゃるだけあって、お{話|はなし}に{説得力|せっとくりょく}がありますね。', 'Sasuga, koko de nanajuunen mo kurashite irassharu dake atte, ohanashi ni settokuryoku ga arimasu ne.', 'Đúng là sống ở đây tận bảy mươi năm có khác, bác kể chuyện thuyết phục thật.'],
      ['{大野|おおの}', 'examiner', 'いやいや。{実|じつ}は{私|わたし}も、{子|こ}どもの{頃|ころ}、{地名|ちめい}の{由来|ゆらい}を{知|し}りたいばかりに、{毎日|まいにち}{図書館|としょかん}に{通|かよ}っていたんですよ。', 'Iya iya. Jitsu wa watashi mo, kodomo no koro, chimei no yurai o shiritai bakari ni, mainichi toshokan ni kayotte ita n desu yo.', 'Không đâu không đâu. Thật ra hồi nhỏ, chỉ vì muốn biết nguồn gốc các địa danh mà ngày nào tôi cũng lên thư viện.'],
      ['マリヤム', 'a', 'あの{石|いし}は{何|なん}ですか。{文字|もじ}が{刻|きざ}んでありますね。', 'Ano ishi wa nan desu ka. Moji ga kizande arimasu ne.', 'Hòn đá kia là gì vậy ạ? Có khắc chữ nhỉ.'],
      ['{大野|おおの}', 'examiner', '{江戸時代|えどじだい}の{道|みち}しるべです。この{坂|さか}は{急|きゅう}で、{雨|あめ}の{日|ひ}に{転|ころ}ぶ{人|ひと}が{多|おお}かったことから、「{足元|あしもと}に{気|き}をつけよ」と{刻|きざ}まれたそうです。', 'Edo jidai no michishirube desu. Kono saka wa kyuu de, ame no hi ni korobu hito ga ookatta koto kara, "ashimoto ni ki o tsukeyo" to kizamareta sou desu.', 'Đó là cột chỉ đường thời Edo. Nghe nói con dốc này dựng đứng, ngày mưa nhiều người bị ngã, nên người ta mới khắc chữ "Hãy chú ý bước chân".'],
      ['ダニエル', 'b', '{一度|いちど}は{見|み}に{来|く}るだけの{価値|かち}がありますね。{写真|しゃしん}、{撮|と}ってもいいですか。', 'Ichido wa mi ni kuru dake no kachi ga arimasu ne. Shashin, totte mo ii desu ka.', 'Đúng là đáng để tới xem một lần. Cháu chụp ảnh được không ạ?'],
      ['{大野|おおの}', 'examiner', 'どうぞ、どうぞ。', 'Douzo, douzo.', 'Cứ tự nhiên.'],
      ['マリヤム', 'a', '（{小|ちい}さい{声|こえ}で）ダニエルのことだから、また{百枚|ひゃくまい}ぐらい{撮|と}って、スマホの{電池|でんち}がなくなるんでしょうね。', '(Chiisai koe de) Danieru no koto da kara, mata hyakumai gurai totte, sumaho no denchi ga naku naru n deshou ne.', '(Nói nhỏ) Biết tính Daniel rồi, chắc lại chụp cả trăm tấm rồi hết pin điện thoại cho xem.'],
      ['ダニエル', 'b', '{聞|き}こえてるよ。……でも{実|じつ}は、{昨日|きのう}{充電|じゅうでん}するのを{忘|わす}れちゃったもんだから、もう{二十|にじゅう}パーセントしかないんだ。', 'Kikoeteru yo. …… Demo jitsu wa, kinou juuden suru no o wasurechatta mon da kara, mou nijuu paasento shika nai n da.', 'Nghe thấy rồi nhé. … Mà thật ra hôm qua tớ quên sạc nên giờ chỉ còn hai mươi phần trăm thôi.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{坂|さか}の{上|うえ}から{砂浜|すなはま}が{見|み}えたことから、「{浜見坂|はまみざか}」と{呼|よ}ばれるようになった。', 'Saka no ue kara sunahama ga mieta koto kara, "Hamamizaka" to yobareru you ni natta.', 'Vì từ đỉnh dốc nhìn thấy bãi cát nên mới được gọi là "dốc Hamami". (② ことから — nguồn gốc tên)'),
        E('{桜|さくら}の{木|き}が{多|おお}いことから{名付|なづ}けられた。', 'Sakura no ki ga ooi koto kara nazukerareta.', 'Được đặt tên vì có nhiều cây anh đào. (② ことから＋名付けられる)'),
        E('{漁師|りょうし}の{町|まち}だっただけに、{魚料理|さかなりょうり}の{店|みせ}が{多|おお}い。', 'Ryoushi no machi datta dake ni, sakana ryouri no mise ga ooi.', 'Chính vì xưa là làng chài nên nhiều quán đồ cá. (③ だけに)'),
        E('{地名|ちめい}の{由来|ゆらい}を{知|し}りたいばかりに、{毎日|まいにち}{図書館|としょかん}に{通|かよ}った。', 'Chimei no yurai o shiritai bakari ni, mainichi toshokan ni kayotta.', 'Chỉ vì muốn biết nguồn gốc địa danh mà ngày nào cũng lên thư viện. (① たいばかりに)'),
        E('{一度|いちど}は{見|み}に{来|く}るだけの{価値|かち}がある。', 'Ichido wa mi ni kuru dake no kachi ga aru.', 'Đáng để tới xem một lần. (③ だけの価値)'),
        E('ダニエルのことだから、また{百枚|ひゃくまい}ぐらい{撮|と}るでしょう。', 'Danieru no koto da kara, mata hyakumai gurai toru deshou.', 'Biết tính Daniel, chắc lại chụp cả trăm tấm. (bảng ⑥ — Nのことだから)'),
        E('{充電|じゅうでん}するのを{忘|わす}れちゃったもんだから、{電池|でんち}がない。', 'Juuden suru no o wasurechatta mon da kara, denchi ga nai.', 'Tại quên sạc nên hết pin. (④ もんだから — văn nói thân mật)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**～ことから、～と{呼|よ}ばれるようになった** — khuôn chuẩn để giải thích **nguồn gốc tên gọi** (địa danh, món ăn, tên loài vật, biệt danh). Bảng giới thiệu ở chùa, phố cổ, bảo tàng Nhật viết gần như y hệt: 「～ことから、この{名|な}がついたと{言|い}われている」. Vế trước là **đặc điểm có thật**, vế sau là **cái tên**.',
        '**ダニエルのことだから** — **Nのことだから** = "**vì là N (tôi biết rõ tính N)** nên chắc chắn…". Vế sau là **phán đoán** (～でしょう・きっと～・～に{違|ちが}いない). Đừng nhầm với **ことから** (căn cứ khách quan): **ことだから** dựa vào **tính cách quen thuộc** của một người — bảng ⑥.',
        '**{見|み}に{来|く}るだけの{価値|かち}がある** — **Vる＋だけの＋N** = "N **tương xứng với** việc V" → "đáng để tới xem". Cùng khuôn: **{読|よ}むだけの{価値|かち}がある{本|ほん}**, **{払|はら}うだけの{価値|かち}はない**.',
        '**{七十年|ななじゅうねん}も{暮|く}らしていらっしゃるだけあって** — **だけあって** luôn đi với **lời khen**: vì có điều kiện / kinh nghiệm ấy nên kết quả đúng như mong đợi. **さすが** đứng đầu câu làm tăng ý khen (さすが～だけあって — cặp quen thuộc).',
        '**もんだから** — dạng **văn nói thân mật** của ものだから (もの → もん). Dùng với bạn bè; với người trên thì **ものですから**. **{埋|う}め{立|た}てる** (lấp biển, lấp đất — N1) · **{道|みち}しるべ** (cột chỉ đường) · **{刻|きざ}む** (khắc — chữ 刻 đã học Bài 19) · **{見事|みごと}** (tuyệt đẹp — N2) · **{説得力|せっとくりょく}** (sức thuyết phục).',
      ],
    },

    /* ── ③ 卒論中間発表 ── */
    { t: 'h', text: '③ {卒論|そつろん}の{中間発表|ちゅうかんはっぴょう}のあとで — "いいところを{見|み}せたいばかりに"' },
    {
      t: 'canh',
      anh: ['woman-student', 'man-student', 'bar-chart', 'woman-teacher'],
      caption: 'Phòng seminar của cô 佐藤, ngay sau buổi báo cáo giữa kỳ khoá luận (卒論中間発表). Đề tài của カルロス: "Thời gian dùng mạng xã hội và kết quả học tập của sinh viên". Bạn ấy vừa bị cô nhận xét khá nặng.',
    },
    {
      t: 'p',
      text: 'Tình huống: **カルロス** (nam) kể vì sao bài báo cáo hỏng — **～たいばかりに** (chỉ vì muốn… mà làm quá — mục ①) và **～もんだから** (lý do cá nhân — mục ④). **リン** (nữ) an ủi bằng **～だけに{悔|くや}しいよね** (mục ③). Hai bạn nhận ra lỗi **nhầm tương quan (相関) với nhân quả (因果関係)** — nội dung của bài đọc 3 và bài nghe 3. Cô **{佐藤先生|さとうせんせい}** (nữ) dùng **～だけに** và **～のことだから**. Bạn cùng ゼミ → thể thường; với cô → です・ます.',
    },
    DL('Phòng seminar — "Chính vì đã dốc sức nên càng tiếc"', [
      ['リン', 'a', 'カルロス、お{疲|つか}れさま。……{大丈夫|だいじょうぶ}？', 'Karurosu, otsukaresama. …… Daijoubu?', 'Carlos, vất vả rồi. … Cậu ổn chứ?'],
      ['カルロス', 'b', '{全然|ぜんぜん}{大丈夫|だいじょうぶ}じゃないよ。{先生|せんせい}にいいところを{見|み}せたいばかりに、スライドにデータを{詰|つ}め{込|こ}みすぎちゃった。{三十枚|さんじゅうまい}もあったんだ。', 'Zenzen daijoubu ja nai yo. Sensei ni ii tokoro o misetai bakari ni, suraido ni deeta o tsumekomisugichatta. Sanjuumai mo atta n da.', 'Chẳng ổn tí nào. Chỉ vì muốn thể hiện với cô mà mình nhồi quá nhiều số liệu vào slide. Tận ba mươi trang.'],
      ['リン', 'a', '{一|いっ}か{月|げつ}も{準備|じゅんび}してたもんね。{一生懸命|いっしょうけんめい}やっていただけに、{悔|くや}しいよね。', 'Ikkagetsu mo junbi shiteta mon ne. Isshoukenmei yatte ita dake ni, kuyashii yo ne.', 'Cậu chuẩn bị cả tháng trời mà. Chính vì đã dốc sức nên càng tiếc nhỉ.'],
      ['カルロス', 'b', 'しかも{昨日|きのう}は{朝|あさ}の{四時|よじ}までスライドを{直|なお}してたもんだから、{質問|しつもん}されても{頭|あたま}が{全然|ぜんぜん}{回|まわ}らなくて……。', 'Shikamo kinou wa asa no yoji made suraido o naoshiteta mon da kara, shitsumon sarete mo atama ga zenzen mawaranakute…….', 'Đã thế hôm qua mình sửa slide tới bốn giờ sáng, nên bị hỏi là đầu óc chẳng chạy gì cả…'],
      ['リン', 'a', '{佐藤先生|さとうせんせい}、{何|なん}て{言|い}ってたの？', 'Satou sensei, nante itteta no?', 'Cô Sato đã nói gì vậy?'],
      ['カルロス', 'b', '「SNSを{長|なが}く{使|つか}う{学生|がくせい}ほど{成績|せいせき}が{低|ひく}いというデータがあるからといって、SNSが{原因|げんいん}だとは{言|い}えません。{相関|そうかん}と{因果関係|いんがかんけい}を{混同|こんどう}しないように」って。', '"Esu-enu-esu o nagaku tsukau gakusei hodo seiseki ga hikui to iu deeta ga aru kara to itte, esu-enu-esu ga gen\'in da to wa iemasen. Soukan to inga kankei o kondou shinai you ni" tte.', 'Cô bảo: "Có số liệu cho thấy sinh viên dùng mạng xã hội càng lâu thì điểm càng thấp, nhưng không vì thế mà nói được mạng xã hội là nguyên nhân. Đừng lẫn lộn tương quan với quan hệ nhân quả."'],
      ['リン', 'a', 'ああ、{寝不足|ねぶそく}みたいな{別|べつ}の{要因|よういん}が、{両方|りょうほう}に{影響|えいきょう}しているかもしれないってことね。', 'Aa, nebusoku mitai na betsu no youin ga, ryouhou ni eikyou shite iru kamo shirenai tte koto ne.', 'À, ý là có thể một yếu tố khác, kiểu như thiếu ngủ, đang ảnh hưởng tới cả hai nhỉ.'],
      ['カルロス', 'b', 'そう。グラフを{見直|みなお}したら、SNSの{時間|じかん}が{長|なが}い{学生|がくせい}ほど{睡眠時間|すいみんじかん}が{短|みじか}いことから、{本当|ほんとう}の{要因|よういん}は{睡眠|すいみん}かもしれないって{思|おも}えてきた。', 'Sou. Gurafu o minaoshitara, esu-enu-esu no jikan ga nagai gakusei hodo suimin jikan ga mijikai koto kara, hontou no youin wa suimin kamo shirenai tte omoete kita.', 'Đúng. Xem lại biểu đồ thì thấy sinh viên dùng mạng xã hội càng lâu thì giờ ngủ càng ngắn, từ đó mình bắt đầu nghĩ yếu tố thật có thể là giấc ngủ.'],
      ['リン', 'a', 'すごい、もう{次|つぎ}の{仮説|かせつ}ができてるじゃない。', 'Sugoi, mou tsugi no kasetsu ga dekiteru ja nai.', 'Giỏi thế, có giả thuyết mới rồi còn gì.'],
      ['カルロス', 'b', 'うん。{次|つぎ}はデータを{半分|はんぶん}に{減|へ}らして、その{仮説|かせつ}を{検証|けんしょう}する{形|かたち}にするよ。', 'Un. Tsugi wa deeta o hanbun ni herashite, sono kasetsu o kenshou suru katachi ni suru yo.', 'Ừ. Lần sau mình giảm số liệu đi một nửa, và làm theo hướng kiểm chứng giả thuyết đó.'],
      ['{佐藤先生|さとうせんせい}', 'c', 'あら、{二人|ふたり}とも、まだいたの。カルロスさん、さっきは{厳|きび}しく{言|い}いすぎたかしら。', 'Ara, futari tomo, mada ita no. Karurosu-san, sakki wa kibishiku iisugita kashira.', 'Ồ, hai em vẫn còn ở đây à. Carlos này, lúc nãy cô nói nặng quá chăng.'],
      ['カルロス', 'b', 'いえ。{先生|せんせい}のおかげで、{自分|じぶん}の{思|おも}い{込|こ}みに{気|き}づけました。', 'Ie. Sensei no okage de, jibun no omoikomi ni kizukemashita.', 'Không ạ. Nhờ cô mà em nhận ra được định kiến của mình.'],
      ['{佐藤先生|さとうせんせい}', 'c', 'よかった。{期待|きたい}しているだけに、つい{厳|きび}しくなるのよ。カルロスさんのことだから、{来月|らいげつ}にはきっといい{発表|はっぴょう}になるわ。', 'Yokatta. Kitai shite iru dake ni, tsui kibishiku naru no yo. Karurosu-san no koto da kara, raigetsu ni wa kitto ii happyou ni naru wa.', 'Vậy thì tốt. Chính vì kỳ vọng nên cô mới hay nghiêm khắc thế. Cô biết em mà, tháng sau chắc chắn sẽ là một bài báo cáo tốt.'],
      ['リン', 'a', 'ほら、{先生|せんせい}もああおっしゃってるし。{今日|きょう}は{早|はや}く{帰|かえ}って{寝|ね}よう！', 'Hora, sensei mo aa osshatteru shi. Kyou wa hayaku kaette neyou!', 'Đấy, cô cũng nói thế rồi. Hôm nay về sớm đi ngủ thôi!'],
    ]),
    {
      t: 'examples',
      items: [
        E('いいところを{見|み}せたいばかりに、データを{詰|つ}め{込|こ}みすぎた。', 'Ii tokoro o misetai bakari ni, deeta o tsumekomisugita.', 'Chỉ vì muốn thể hiện mà nhồi quá nhiều số liệu. (① たいばかりに)'),
        E('{一生懸命|いっしょうけんめい}やっていただけに、{悔|くや}しい。', 'Isshoukenmei yatte ita dake ni, kuyashii.', 'Chính vì đã dốc sức nên càng tiếc. (③ だけに)'),
        E('{朝|あさ}の{四時|よじ}まで{直|なお}してたもんだから、{頭|あたま}が{回|まわ}らなかった。', 'Asa no yoji made naoshiteta mon da kara, atama ga mawaranakatta.', 'Tại sửa tới bốn giờ sáng nên đầu óc không chạy. (④ もんだから)'),
        E('{睡眠時間|すいみんじかん}が{短|みじか}いことから、{本当|ほんとう}の{要因|よういん}は{睡眠|すいみん}だと{考|かんが}えられる。', 'Suimin jikan ga mijikai koto kara, hontou no youin wa suimin da to kangaerareru.', 'Từ việc giờ ngủ ngắn, có thể nghĩ yếu tố thật là giấc ngủ. (② ことから — căn cứ)'),
        E('{相関|そうかん}があるからといって、{因果関係|いんがかんけい}があるとは{言|い}えない。', 'Soukan ga aru kara to itte, inga kankei ga aru to wa ienai.', 'Có tương quan không có nghĩa là có quan hệ nhân quả. (～からといって — N3)'),
        E('{期待|きたい}しているだけに、つい{厳|きび}しくなる。', 'Kitai shite iru dake ni, tsui kibishiku naru.', 'Chính vì kỳ vọng nên hay nghiêm khắc. (③ だけに)'),
        E('カルロスさんのことだから、きっといい{発表|はっぴょう}になる。', 'Karurosu-san no koto da kara, kitto ii happyou ni naru.', 'Biết Carlos mà, chắc chắn sẽ báo cáo tốt. (bảng ⑥ — ことだから)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{見|み}せたいばかりに** — **Vたい＋ばかりに** = "**chỉ vì muốn…** (nên đã làm một việc quá mức / vất vả / dại dột)". Khác ばかりに thường: ở đây vế trước là **mong muốn**, vế sau là **hành động mà người đó bất chấp để đạt mong muốn** (nhồi slide, xếp hàng ba tiếng, nói dối…). Vế sau có thể không hẳn "xấu" nhưng luôn có ý **"tới mức đó"**.',
        '**やっていただけに、{悔|くや}しい** — ～だけに + **cảm xúc** (悔しい・残念だ・ショックだ・うれしい): "**chính vì… nên cảm xúc càng mạnh**". Đây là cách dùng だけに **hay gặp nhất** trong đề N2.',
        '**{直|なお}してたもんだから** — {直|なお}していた → văn nói {直|なお}してた + **もんだから**. カルロス đang **kể lý do với bạn** → もんだから tự nhiên. Nếu nói với cô giáo: **{直|なお}していたものですから**.',
        '**{相関|そうかん} ↔ {因果関係|いんがかんけい}** — hai thứ cùng thay đổi (tương quan) **chưa chắc** cái này gây ra cái kia (nhân quả); có thể có **yếu tố thứ ba** ({第三|だいさん}の{要因|よういん}) — ở đây là thiếu ngủ. Đây là chủ đề hay gặp trong bài đọc 主張理解 của N2. **{混同|こんどう}する** (lẫn lộn — N1) · **{仮説|かせつ}を{検証|けんしょう}する** (kiểm chứng giả thuyết) · **{思|おも}い{込|こ}み** (định kiến, tin chắc sai).',
        '**{先生|せんせい}のおかげで** — ôn **～おかげで** (Bài 27 — kết quả TỐT, biết ơn). Trong cùng một hội thoại có ba "nguyên nhân" khác màu: **ばかりに** (tiếc nuối), **もんだから** (bào chữa), **おかげで** (biết ơn) — bảng ⑤.',
      ],
    },
    {
      t: 'note',
      title: 'チャレンジ — luyện cặp sau khi đọc hội thoại',
      items: [
        '**Cặp ①** — A là nhân viên vừa gây lỗi (gửi nhầm file cho khách, quên đặt phòng họp, nhập sai giá). A nói lý do bằng **～ものですから** → B (cấp trên) nhắc: **「{言|い}い{訳|わけ}より、{原因|げんいん}と{対策|たいさく}を{聞|き}かせてください」** → A nói lại bằng **～ばかりに、～てしまいました** + một biện pháp. Đổi vai.',
        '**Cặp ②** — A giới thiệu **một địa danh / một món ăn ở quê mình** và nguồn gốc tên gọi bằng **～ことから、～と{呼|よ}ばれています**; B khen bằng **さすが～だけあって** hoặc **～だけの{価値|かち}がありますね**. Gợi ý: phố cổ Hội An, bánh "xèo" (tiếng kêu khi đổ bột), chợ Bến Thành.',
        '**Cặp ③** — A kể một thất bại gần đây bằng **～たいばかりに** hoặc **～もんだから**. B an ủi bằng **～だけに{悔|くや}しいよね／{残念|ざんねん}だね** và đoán tốt cho bạn bằng **Aさんのことだから、{次|つぎ}はきっと～**. Đổi vai.',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b48-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 67 từ N2: nhân quả & căn cứ, sự cố & giải trình ở công ty, địa danh & nguồn gốc, đánh giá, lý do & hậu quả đời thường',
  goal: 'Thuộc 67 từ để đọc – nghe – nói về nguyên nhân và kết quả: lập luận (因果関係・要因・招く・引き起こす・もたらす・及ぼす・裏付ける・推測・相関・錯覚・仮説・検証・頻度・頻繁・密接), sự cố ở công ty (不具合・欠陥・再発防止・経緯・釈明・弁解・始末書・不注意・思い込み・確認漏れ・慌てる・問い詰める・責める), địa danh & nguồn gốc (名称・愛称・地名・坂・谷・海岸・砂浜・湾・丘・郷土・遺跡・言い伝え・名付ける), đánh giá (芸術・芸能人・腕前・賢い・穏やか・昇進・名門・老舗・本場・期待外れ・張り切る・懸命に), đời thường (寝過ごす・乗り過ごす・遭う・詰め込む・嘆く・二日酔い・見栄を張る・調子に乗る・口を滑らせる・自業自得・早とちり・運悪く・取り返しがつかない・愚痴) — phân biệt các nhóm dễ nhầm (原因・要因・理由・きっかけ, 因果関係・相関, 招く・引き起こす・もたらす・及ぼす, 推測・予想, 不具合・欠陥・故障, 釈明・弁解・言い訳, 慌てる・焦る, 老舗・名門・本場, 寝過ごす・寝坊, 遭う・会う, 懸命・賢明, 責める・攻める) và nói thành cụm (誤解を招く, 影響を及ぼす, 仮説を立てる・検証する, 密接な関係, 経緯を説明する, 再発防止策, 弁解の余地がない, 事故に遭う, 見栄を張る, 調子に乗る, 取り返しのつかない…).',
  minutes: 65,
  blocks: [
    {
      t: 'p',
      text: '**67 từ** chia 5 nhóm theo đúng các tình huống của bài: **A** nhân quả & căn cứ (15) · **B** sự cố & giải trình ở công ty (13) · **C** địa danh & nguồn gốc (13) · **D** đánh giá — "đúng là… có khác" (12) · **E** lý do & hậu quả đời thường (14). Nhóm A là **từ của bài báo, báo cáo nghiên cứu** — gặp nhiều ở bài đọc 主張理解 (tương quan ≠ nhân quả); nhóm B là **từ của báo cáo sự cố, lời xin lỗi** ở công ty Nhật; nhóm C là **từ của bảng giới thiệu điểm du lịch** (nơi ～ことから xuất hiện nhiều nhất). Nhiều từ Hán đọc được nhờ **âm Hán Việt**: {因果|いんが} = NHÂN QUẢ, {要因|よういん} = YẾU NHÂN, {仮説|かせつ} = GIẢ THUYẾT, {検証|けんしょう} = KIỂM CHỨNG, {相関|そうかん} = TƯƠNG QUAN, {密接|みっせつ} = MẬT THIẾT, {欠陥|けっかん} = KHIẾM HÃM (khiếm khuyết), {弁解|べんかい} = BIỆN GIẢI, {名称|めいしょう} = DANH XƯNG, {遺跡|いせき} = DI TÍCH, {芸術|げいじゅつ} = NGHỆ THUẬT, {昇進|しょうしん} = THĂNG TIẾN. Từ đã học ở Bài 1–47 ({原因|げんいん} Bài 27, {理由|りゆう} Bài 19, {結果的|けっかてき}に・{判明|はんめい}する Bài 44, {根拠|こんきょ}・{傾向|けいこう} Bài 28, {証拠|しょうこ} Bài 31, {由来|ゆらい}・{縁起|えんぎ} Bài 36, {言|い}い{訳|わけ} Bài 28, {謝罪|しゃざい} Bài 37, {悔|くや}しい Bài 22, {寝不足|ねぶそく} Bài 27…) không lặp lại — gặp trong câu là ôn.',
    },
    {
      t: 'note',
      title: 'Cách học 67 từ nhân quả trong 4 ngày',
      items: [
        '**Ngày 1** — nhóm A (15 từ): học theo **trình tự của một nghiên cứu**: thấy hai thứ cùng thay đổi (**{相関|そうかん}**) → **{推測|すいそく}** → **{仮説|かせつ}を{立|た}てる** → **{検証|けんしょう}する** → tìm **{要因|よういん}** → chứng minh **{因果関係|いんがかんけい}** → có dữ liệu **{裏付|うらづ}ける**. Rồi học bốn động từ "gây ra" thành cặp với tân ngữ: **{誤解|ごかい}を{招|まね}く · {事故|じこ}を{引|ひ}き{起|お}こす · {変化|へんか}をもたらす · {影響|えいきょう}を{及|およ}ぼす**.',
        '**Ngày 2** — nhóm B (13 từ): học theo **một báo cáo sự cố** từ đầu đến cuối: **{不具合|ふぐあい}が{起|お}きた** → **{経緯|けいい}** → **{原因|げんいん}: {不注意|ふちゅうい}・{思|おも}い{込|こ}み・{確認漏|かくにんも}れ** → (đừng **{弁解|べんかい}**!) → **{再発防止策|さいはつぼうしさく}** → nặng thì **{始末書|しまつしょ}**. Thêm cặp **{慌|あわ}てる ↔ {焦|あせ}る** và **{責|せ}める ↔ {攻|せ}める**.',
        '**Ngày 3** — nhóm C (13 từ) + nhóm D (12 từ): nhóm C vẽ một **bản đồ khu phố tưởng tượng** có {坂|さか}・{谷|たに}・{丘|おか}・{海岸|かいがん}・{砂浜|すなはま}・{湾|わん}, rồi tự đặt tên cho từng nơi bằng **～ことから「～」と{名付|なづ}けた** (nối thẳng với ngữ pháp ②); nhóm D học cặp với **だけあって**: **{老舗|しにせ}だけあって・{名門|めいもん}だけあって・{本場|ほんば}だけあって・{芸能人|げいのうじん}だけあって**.',
        '**Ngày 4** — nhóm E (14 từ) + thẻ hình + bảng **Từ dễ nhầm (類義語)** + bảng **Kết hợp từ (コロケーション)** + trắc nghiệm + viết tay 12 từ. Nhóm E học bằng cách **kể 5 lần mình "xui"**: mỗi câu một từ nhóm E + một mẫu ngữ pháp (**～ばかりに・～もんだから**): {寝過|ねす}ごしたもんだから… · {調子|ちょうし}に{乗|の}ったばかりに…',
        'Romaji: trường âm viết đôi ({要因|よういん} → **you**in, {相関|そうかん} → **sou**kan, {郷土|きょうど} → **kyou**do, {昇進|しょうしん} → **shou**shin, {仮説|かせつ} → kasetsu — KHÔNG dài); âm ngắt ({密接|みっせつ} → mi**ss**etsu, {欠陥|けっかん} → ke**kk**an); ん trước nguyên âm viết **n\'** ({運悪|うんわる}く → **un\'**waruku); cách đọc đặc biệt: **{老舗|しにせ}** (shinise), **{経緯|けいい}** (keii — văn nói còn đọc いきさつ), **{二日酔|ふつかよ}い** (futsukayoi), **{始末書|しまつしょ}** (shimatsusho), **{言|い}い{伝|つた}え** (iitsutae).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Nhân quả & căn cứ (15 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{因果関係|いんがかんけい}', pos: 'danh từ', ipa: 'inga kankei', vi: 'quan hệ nhân quả', ex: '{喫煙|きつえん}と{病気|びょうき}の{因果関係|いんがかんけい}を{調|しら}べる。', exRo: 'Kitsuen to byouki no inga kankei o shiraberu.', exVi: 'Điều tra quan hệ nhân quả giữa hút thuốc và bệnh tật.', more: '**{因果関係|いんがかんけい}がある／ない** · **～を{明|あき}らかにする** · {原因|げんいん} (Bài 27) + {結果|けっか} → {因果|いんが} · ≠ **{相関|そうかん}** (chỉ "cùng thay đổi") — bảng 類義語. N1 (gặp nhiều ở N2).' },
        { w: '{要因|よういん}', pos: 'danh từ', ipa: 'youin', vi: 'yếu tố, nhân tố (góp phần gây ra)', ex: '{人口|じんこう}が{減|へ}った{要因|よういん}は、{一|ひと}つではない。', exRo: 'Jinkou ga hetta youin wa, hitotsu de wa nai.', exVi: 'Yếu tố khiến dân số giảm không chỉ có một.', more: '**{主|おも}な{要因|よういん}** · **{成功|せいこう}の{要因|よういん}** · **{要因|よういん}を{分析|ぶんせき}する** · ≠ {原因|げんいん}: 原因 thường là MỘT nguyên nhân trực tiếp, 要因 là MỘT TRONG NHIỀU yếu tố. N2.' },
        { w: '{招|まね}く', pos: 'động từ nhóm 1', ipa: 'maneku', vi: 'mời; gây ra, chuốc lấy (kết quả xấu)', ex: '{説明|せつめい}が{足|た}りないと、{誤解|ごかい}を{招|まね}く。', exRo: 'Setsumei ga tarinai to, gokai o maneku.', exVi: 'Giải thích không đủ thì gây hiểu lầm.', more: '**{誤解|ごかい}／{混乱|こんらん}／{事故|じこ}を{招|まね}く** · nghĩa gốc: mời ({友人|ゆうじん}を{家|いえ}に{招|まね}く) · {取|と}り{返|かえ}しのつかない{結果|けっか}を{招|まね}く. N2.' },
        { w: '{引|ひ}き{起|お}こす', pos: 'động từ nhóm 1', ipa: 'hikiokosu', vi: 'gây ra, dẫn tới (sự cố, bệnh, vấn đề)', ex: '{小|ちい}さな{不注意|ふちゅうい}が、{大|おお}きな{事故|じこ}を{引|ひ}き{起|お}こすこともある。', exRo: 'Chiisana fuchuui ga, ookina jiko o hikiokosu koto mo aru.', exVi: 'Một chút bất cẩn cũng có khi gây ra tai nạn lớn.', more: '**～を{引|ひ}き{起|お}こす** (tha động từ) · tự động từ tương ứng: **～が{起|お}こる** · {問題|もんだい}／{病気|びょうき}を{引|ひ}き{起|お}こす. N2.' },
        { w: 'もたらす', pos: 'động từ nhóm 1', ipa: 'motarasu', vi: 'mang lại, đem đến (kết quả — tốt hoặc xấu, văn viết)', ex: '{新|あたら}しい{技術|ぎじゅつ}は、{生活|せいかつ}に{大|おお}きな{変化|へんか}をもたらした。', exRo: 'Atarashii gijutsu wa, seikatsu ni ookina henka o motarashita.', exVi: 'Công nghệ mới đã mang lại thay đổi lớn cho cuộc sống.', more: '**{利益|りえき}／{幸|しあわ}せ／{被害|ひがい}をもたらす** · thường viết bằng kana · dùng được cho cả kết quả TỐT (khác 招く — thường xấu). N2.' },
        { w: '{及|およ}ぼす', pos: 'động từ nhóm 1', ipa: 'oyobosu', vi: 'gây (ảnh hưởng) tới, lan tới', ex: '{睡眠不足|すいみんぶそく}は、{集中力|しゅうちゅうりょく}に{悪|わる}い{影響|えいきょう}を{及|およ}ぼす。', exRo: 'Suimin busoku wa, shuuchuuryoku ni warui eikyou o oyobosu.', exVi: 'Thiếu ngủ gây ảnh hưởng xấu tới khả năng tập trung.', more: '**～に{影響|えいきょう}を{及|およ}ぼす** (cụm gần như cố định) · {被害|ひがい}が～に{及|およ}ぶ (tự động từ: lan tới). N2.' },
        { w: '{裏付|うらづ}ける', pos: 'động từ nhóm 2', ipa: 'urazukeru', vi: 'chứng minh, củng cố (bằng chứng cứ, số liệu)', ex: 'その{説|せつ}を{裏付|うらづ}けるデータは、まだ{見|み}つかっていない。', exRo: 'Sono setsu o urazukeru deeta wa, mada mitsukatte inai.', exVi: 'Vẫn chưa tìm thấy số liệu chứng minh thuyết đó.', more: '**～を{裏付|うらづ}ける{証拠|しょうこ}／データ** · danh từ **{裏付|うらづ}け** (bằng chứng xác nhận) · **{裏付|うらづ}けを{取|と}る** (kiểm chứng lại — từ của nhà báo). N1.' },
        { w: '{推測|すいそく}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'suisoku (suru)', vi: 'phỏng đoán (dựa vào thông tin đang có)', ex: '{足跡|あしあと}の{大|おお}きさから、{犯人|はんにん}の{身長|しんちょう}を{推測|すいそく}した。', exRo: 'Ashiato no ookisa kara, hannin no shinchou o suisoku shita.', exVi: 'Từ kích thước dấu chân, người ta phỏng đoán chiều cao của thủ phạm.', more: '**～から{推測|すいそく}する** · **{推測|すいそく}にすぎない** (chỉ là phỏng đoán) · ≠ {予想|よそう} (đoán điều CHƯA xảy ra) — bảng 類義語. N2.' },
        { w: '{相関|そうかん}', pos: 'danh từ', ipa: 'soukan', vi: 'tương quan (hai thứ cùng thay đổi)', ex: '{勉強時間|べんきょうじかん}と{成績|せいせき}の{間|あいだ}には、{相関|そうかん}が{見|み}られる。', exRo: 'Benkyou jikan to seiseki no aida ni wa, soukan ga mirareru.', exVi: 'Giữa thời gian học và điểm số có thấy tương quan.', more: '**{相関関係|そうかんかんけい}** · **{強|つよ}い／{弱|よわ}い{相関|そうかん}** · **～との{間|あいだ}に{相関|そうかん}がある** · tương quan ≠ nhân quả (hội thoại ③, bài đọc 3). N1.' },
        { w: '{錯覚|さっかく}', pos: 'danh từ / động từ nhóm 3', ipa: 'sakkaku', vi: 'ảo giác; sự tưởng nhầm', ex: '{二|ふた}つのことが{同時|どうじ}に{起|お}きると、{一方|いっぽう}が{原因|げんいん}だと{錯覚|さっかく}しやすい。', exRo: 'Futatsu no koto ga douji ni okiru to, ippou ga gen\'in da to sakkaku shiyasui.', exVi: 'Hai việc xảy ra cùng lúc thì dễ tưởng nhầm cái này là nguyên nhân của cái kia.', more: '**～と{錯覚|さっかく}する** (tưởng nhầm là…) · **{目|め}の{錯覚|さっかく}** (ảo giác thị giác) · âm ngắt: sa-**k**-ka-ku · chữ 錯 mới của bài. N1.' },
        { w: '{仮説|かせつ}', pos: 'danh từ', ipa: 'kasetsu', vi: 'giả thuyết', ex: 'まず{仮説|かせつ}を{立|た}てて、それからデータで{確|たし}かめる。', exRo: 'Mazu kasetsu o tatete, sore kara deeta de tashikameru.', exVi: 'Trước hết đặt giả thuyết, rồi kiểm tra bằng số liệu.', more: '**{仮説|かせつ}を{立|た}てる** (đặt giả thuyết) · **{仮説|かせつ}が{正|ただ}しい／{崩|くず}れる** · từ của khoá luận, nghiên cứu. N1.' },
        { w: '{検証|けんしょう}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'kenshou (suru)', vi: 'kiểm chứng', ex: '{新|あたら}しい{勉強法|べんきょうほう}の{効果|こうか}を、{三か月|さんかげつ}かけて{検証|けんしょう}した。', exRo: 'Atarashii benkyouhou no kouka o, sankagetsu kakete kenshou shita.', exVi: 'Đã bỏ ba tháng kiểm chứng hiệu quả của cách học mới.', more: '**{仮説|かせつ}を{検証|けんしょう}する** · **{原因|げんいん}を{検証|けんしょう}する** · {事故|じこ}の{検証|けんしょう} (khám nghiệm hiện trường). N1.' },
        { w: '{頻度|ひんど}', pos: 'danh từ', ipa: 'hindo', vi: 'tần suất', ex: '{運動|うんどう}する{頻度|ひんど}を、{週|しゅう}に{三回|さんかい}に{増|ふ}やした。', exRo: 'Undou suru hindo o, shuu ni sankai ni fuyashita.', exVi: 'Tôi đã tăng tần suất tập thể dục lên ba lần mỗi tuần.', more: '**{頻度|ひんど}が{高|たか}い／{低|ひく}い** · **{使用頻度|しようひんど}** (tần suất sử dụng) · {出題頻度|しゅつだいひんど} (tần suất ra đề). N1.' },
        { w: '{頻繁|ひんぱん}（に）', pos: 'tính từ な / phó từ', ipa: 'hinpan (ni)', vi: 'thường xuyên, liên tục (nhiều lần trong thời gian ngắn)', ex: 'この{交差点|こうさてん}では、{事故|じこ}が{頻繁|ひんぱん}に{起|お}きている。', exRo: 'Kono kousaten de wa, jiko ga hinpan ni okite iru.', exVi: 'Ở ngã tư này tai nạn xảy ra liên tục.', more: '**{頻繁|ひんぱん}に～** · ≈ **しょっちゅう** (văn nói) · **たびたび** · ≈ よく (N5) nhưng 頻繁 nhấn "dày đặc, nhiều bất thường". N2.' },
        { w: '{密接|みっせつ}（な）', pos: 'tính từ な', ipa: 'missetsu (na)', vi: 'mật thiết', ex: '{食生活|しょくせいかつ}と{健康|けんこう}には、{密接|みっせつ}な{関係|かんけい}がある。', exRo: 'Shokuseikatsu to kenkou ni wa, missetsu na kankei ga aru.', exVi: 'Thói quen ăn uống và sức khoẻ có quan hệ mật thiết.', more: '**{密接|みっせつ}な{関係|かんけい}がある** · **{密接|みっせつ}に{関係|かんけい}する／{結|むす}びつく** · âm ngắt: mi-**s**-se-tsu. N2.' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Sự cố & giải trình ở công ty (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{不具合|ふぐあい}', pos: 'danh từ', ipa: 'fuguai', vi: 'trục trặc, lỗi (máy móc, phần mềm)', ex: 'アプリに{不具合|ふぐあい}があって、ログインできない。', exRo: 'Apuri ni fuguai ga atte, roguin dekinai.', exVi: 'Ứng dụng bị lỗi nên không đăng nhập được.', more: '**{不具合|ふぐあい}が{起|お}きる／{生|しょう}じる** · **{不具合|ふぐあい}を{修正|しゅうせい}する** (sửa lỗi) · từ quen của ngành IT và thông báo sản phẩm. N2.' },
        { w: '{欠陥|けっかん}', pos: 'danh từ', ipa: 'kekkan', vi: 'khiếm khuyết, lỗi (thiết kế, cấu tạo)', ex: '{車|くるま}のブレーキに{欠陥|けっかん}が{見|み}つかり、{回収|かいしゅう}されることになった。', exRo: 'Kuruma no bureeki ni kekkan ga mitsukari, kaishuu sareru koto ni natta.', exVi: 'Phát hiện khiếm khuyết ở phanh xe nên xe sẽ bị thu hồi.', more: '**{欠陥商品|けっかんしょうひん}** · **{制度|せいど}の{欠陥|けっかん}** · nặng hơn {不具合|ふぐあい}: lỗi nằm SẴN trong thiết kế — bảng 類義語. N2.' },
        { w: '{再発防止|さいはつぼうし}', pos: 'danh từ', ipa: 'saihatsu boushi', vi: 'ngăn tái diễn', ex: '{同|おな}じミスを{繰|く}り{返|かえ}さないよう、{再発防止策|さいはつぼうしさく}を{考|かんが}える。', exRo: 'Onaji misu o kurikaesanai you, saihatsu boushisaku o kangaeru.', exVi: 'Nghĩ biện pháp phòng tái diễn để không lặp lại lỗi tương tự.', more: '**{再発防止策|さいはつぼうしさく}** (biện pháp) · **{再発|さいはつ}する** (tái phát — bệnh, sự cố) · từ BẮT BUỘC trong báo cáo sự cố ở Nhật. N1.' },
        { w: '{経緯|けいい}', pos: 'danh từ', ipa: 'keii', vi: 'đầu đuôi, diễn biến sự việc', ex: '{事故|じこ}の{経緯|けいい}を、{時間|じかん}の{順|じゅん}に{説明|せつめい}してください。', exRo: 'Jiko no keii o, jikan no jun ni setsumei shite kudasai.', exVi: 'Hãy trình bày diễn biến vụ việc theo thứ tự thời gian.', more: '**{経緯|けいい}を{説明|せつめい}する／{報告|ほうこく}する** · văn nói đọc **いきさつ** (cùng chữ) · ≠ {原因|げんいん}: 経緯 = chuyện đã diễn ra thế nào. N1.' },
        { w: '{釈明|しゃくめい}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'shakumei (suru)', vi: 'giải trình, thanh minh (trước công chúng)', ex: '{社長|しゃちょう}は{記者会見|きしゃかいけん}で、{問題|もんだい}について{釈明|しゃくめい}した。', exRo: 'Shachou wa kisha kaiken de, mondai ni tsuite shakumei shita.', exVi: 'Giám đốc đã giải trình về vấn đề trong buổi họp báo.', more: '**{釈明|しゃくめい}を{求|もと}める** (đòi giải trình) · **{釈明会見|しゃくめいかいけん}** · trang trọng, thường của tổ chức / người có chức vụ — bảng 類義語. N1.' },
        { w: '{弁解|べんかい}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'benkai (suru)', vi: 'biện bạch, chống chế', ex: 'いくら{弁解|べんかい}しても、{約束|やくそく}を{破|やぶ}った{事実|じじつ}は{変|か}わらない。', exRo: 'Ikura benkai shite mo, yakusoku o yabutta jijitsu wa kawaranai.', exVi: 'Biện bạch thế nào thì sự thật thất hứa cũng không đổi.', more: '**{弁解|べんかい}の{余地|よち}がない** (không còn gì để biện bạch — câu nhận lỗi rất mạnh) · ≈ {言|い}い{訳|わけ} (Bài 28 — văn nói). N1.' },
        { w: '{始末書|しまつしょ}', pos: 'danh từ', ipa: 'shimatsusho', vi: 'bản tường trình nhận lỗi (nộp công ty)', ex: '{会社|かいしゃ}のパソコンをなくして、{始末書|しまつしょ}を{書|か}かされた。', exRo: 'Kaisha no pasokon o nakushite, shimatsusho o kakasareta.', exVi: 'Làm mất máy tính của công ty nên bị bắt viết bản tường trình.', more: '**{始末書|しまつしょ}を{書|か}く／{提出|ていしゅつ}する** · nặng hơn {報告書|ほうこくしょ} (báo cáo) — có ý "kiểm điểm". N1.' },
        { w: '{不注意|ふちゅうい}', pos: 'danh từ / tính từ な', ipa: 'fuchuui', vi: 'bất cẩn, sơ ý', ex: '{私|わたし}の{不注意|ふちゅうい}で、ご{迷惑|めいわく}をおかけしました。', exRo: 'Watashi no fuchuui de, gomeiwaku o okake shimashita.', exVi: 'Do tôi sơ ý mà đã gây phiền hà cho anh chị.', more: '**{不注意|ふちゅうい}による{事故|じこ}** · **{私|わたし}の{不注意|ふちゅうい}で** (câu xin lỗi chuẩn) · ≈ うっかり (Bài 19). N2.' },
        { w: '{思|おも}い{込|こ}み', pos: 'danh từ', ipa: 'omoikomi', vi: 'định kiến, sự tin chắc (mà sai)', ex: '「{簡単|かんたん}だろう」という{思|おも}い{込|こ}みが、ミスの{原因|げんいん}だった。', exRo: '"Kantan darou" to iu omoikomi ga, misu no gen\'in datta.', exVi: 'Ý nghĩ chắc mẩm "chắc là dễ" chính là nguyên nhân của lỗi.', more: '**{思|おも}い{込|こ}む** (động từ — tin chắc) · **{思|おも}い{込|こ}みが{激|はげ}しい** (hay tin chắc theo ý mình) · ≈ {勘違|かんちが}い. N2.' },
        { w: '{確認漏|かくにんも}れ', pos: 'danh từ', ipa: 'kakunin more', vi: 'sót khâu kiểm tra', ex: '{確認漏|かくにんも}れを{防|ふせ}ぐため、チェックは{二人|ふたり}で{行|おこな}う。', exRo: 'Kakunin more o fusegu tame, chekku wa futari de okonau.', exVi: 'Để tránh sót kiểm tra, việc kiểm tra do hai người làm.', more: '**～{漏|も}れ** = bị sót (từ {漏|も}れる — Bài 46): **{記入漏|きにゅうも}れ** (sót không điền), **{連絡漏|れんらくも}れ** (sót không báo). N2.' },
        { w: '{慌|あわ}てる', pos: 'động từ nhóm 2', ipa: 'awateru', vi: 'hoảng, cuống lên', ex: '{地震|じしん}の{時|とき}は、{慌|あわ}てずに{机|つくえ}の{下|した}に{入|はい}ってください。', exRo: 'Jishin no toki wa, awatezu ni tsukue no shita ni haitte kudasai.', exVi: 'Khi có động đất, đừng hoảng, hãy chui xuống gầm bàn.', more: '**{慌|あわ}てて～する** (vội vàng làm) · **{慌|あわ}てずに** (= {慌|あわ}てないで) · ≈ {焦|あせ}る — bảng 類義語. N2.' },
        { w: '{問|と}い{詰|つ}める', pos: 'động từ nhóm 2', ipa: 'toitsumeru', vi: 'vặn hỏi tới cùng', ex: '{帰|かえ}りが{遅|おそ}い{理由|りゆう}を、{母|はは}に{問|と}い{詰|つ}められた。', exRo: 'Kaeri ga osoi riyuu o, haha ni toitsumerareta.', exVi: 'Tôi bị mẹ vặn hỏi lý do về muộn.', more: '**～を{問|と}い{詰|つ}める** · hay dùng ở **thể bị động** · {詰|つ}める = dồn chặt. N1.' },
        { w: '{責|せ}める', pos: 'động từ nhóm 2', ipa: 'semeru', vi: 'trách, đổ lỗi', ex: '{失敗|しっぱい}した{人|ひと}だけを{責|せ}めても、{問題|もんだい}は{解決|かいけつ}しない。', exRo: 'Shippai shita hito dake o semete mo, mondai wa kaiketsu shinai.', exVi: 'Chỉ trách người thất bại thì vấn đề cũng không được giải quyết.', more: '**{自分|じぶん}を{責|せ}める** (tự trách) · **{責任|せきにん}を{問|と}う** (truy trách nhiệm) · ≠ **{攻|せ}める** (tấn công — đồng âm). N2.' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Địa danh & nguồn gốc (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{名称|めいしょう}', pos: 'danh từ', ipa: 'meishou', vi: 'tên gọi (chính thức)', ex: '{来年|らいねん}から、この{駅|えき}の{名称|めいしょう}が{変|か}わる。', exRo: 'Rainen kara, kono eki no meishou ga kawaru.', exVi: 'Từ sang năm, tên của nhà ga này sẽ đổi.', more: '**{正式名称|せいしきめいしょう}** (tên chính thức) · ≈ {名前|なまえ} nhưng dùng cho tổ chức, địa điểm, sản phẩm — văn viết. N2.' },
        { w: '{愛称|あいしょう}', pos: 'danh từ', ipa: 'aishou', vi: 'tên thân mật, biệt danh', ex: 'この{電車|でんしゃ}は、{色|いろ}が{黄色|きいろ}いことから「ひまわり{号|ごう}」という{愛称|あいしょう}で{呼|よ}ばれている。', exRo: 'Kono densha wa, iro ga kiiroi koto kara "Himawari-gou" to iu aishou de yobarete iru.', exVi: 'Đoàn tàu này được gọi bằng tên thân mật "Hướng Dương" vì có màu vàng.', more: '**～という{愛称|あいしょう}で{呼|よ}ばれる／{親|した}しまれる** · ≈ あだ{名|な} (biệt danh — hơi trẻ con) · ví dụ dùng **～ことから** (mục ②). N1.' },
        { w: '{地名|ちめい}', pos: 'danh từ', ipa: 'chimei', vi: 'địa danh, tên đất', ex: '{日本|にほん}の{地名|ちめい}には、{地形|ちけい}に{由来|ゆらい}するものが{多|おお}い。', exRo: 'Nihon no chimei ni wa, chikei ni yurai suru mono ga ooi.', exVi: 'Nhiều địa danh Nhật Bản có nguồn gốc từ địa hình.', more: '**{地名|ちめい}の{由来|ゆらい}** · **～に{由来|ゆらい}する** (ôn {由来|ゆらい} Bài 36) · {地形|ちけい} (địa hình). N2.' },
        { w: '{坂|さか}', pos: 'danh từ', ipa: 'saka', vi: 'con dốc', ex: '{駅|えき}から{家|いえ}まで、{長|なが}い{坂|さか}を{上|のぼ}らなければならない。', exRo: 'Eki kara ie made, nagai saka o noboranakereba naranai.', exVi: 'Từ ga về nhà phải leo một con dốc dài.', more: '**{坂道|さかみち}** · **{上|のぼ}り{坂|ざか}／{下|くだ}り{坂|ざか}** (cả nghĩa bóng: {景気|けいき}は{下|くだ}り{坂|ざか}だ — kinh tế đang đi xuống) · {急|きゅう}な{坂|さか} (dốc gắt). N3/N2.' },
        { w: '{谷|たに}', pos: 'danh từ', ipa: 'tani', vi: 'thung lũng, khe núi', ex: '{谷|たに}の{底|そこ}を、{細|ほそ}い{川|かわ}が{流|なが}れている。', exRo: 'Tani no soko o, hosoi kawa ga nagarete iru.', exVi: 'Dưới đáy thung lũng có một con sông nhỏ chảy qua.', more: '**{谷間|たにま}** · ↔ {山|やま} · địa danh **{渋谷|しぶや}** đọc や (đặc biệt). N2.' },
        { w: '{海岸|かいがん}', pos: 'danh từ', ipa: 'kaigan', vi: 'bờ biển', ex: '{夏|なつ}になると、{海岸|かいがん}は{海水浴|かいすいよく}の{客|きゃく}でいっぱいになる。', exRo: 'Natsu ni naru to, kaigan wa kaisuiyoku no kyaku de ippai ni naru.', exVi: 'Cứ đến hè, bờ biển lại chật kín người đi tắm biển.', more: '**{海岸線|かいがんせん}** (đường bờ biển) · {岸|きし} (bờ) · {川岸|かわぎし} (bờ sông) · {海水浴|かいすいよく} (tắm biển). N2.' },
        { w: '{砂浜|すなはま}', pos: 'danh từ', ipa: 'sunahama', vi: 'bãi cát', ex: '{子|こ}どもたちが{砂浜|すなはま}で{貝|かい}を{拾|ひろ}っている。', exRo: 'Kodomotachi ga sunahama de kai o hirotte iru.', exVi: 'Bọn trẻ đang nhặt vỏ sò trên bãi cát.', more: '**{浜辺|はまべ}** (mé bãi biển) · ≈ ビーチ · {砂|すな} (cát) + {浜|はま} (bãi). N2.' },
        { w: '{湾|わん}', pos: 'danh từ', ipa: 'wan', vi: 'vịnh', ex: '{東京湾|とうきょうわん}には、{大|おお}きな{船|ふね}がたくさん{出入|でい}りしている。', exRo: 'Toukyou-wan ni wa, ookina fune ga takusan deiri shite iru.', exVi: 'Rất nhiều tàu lớn ra vào vịnh Tokyo.', more: '**{湾岸|わんがん}** (ven vịnh) · **{湾|わん}を{埋|う}め{立|た}てる** (lấp vịnh) · tên vịnh Hạ Long: **ハロン{湾|わん}**. N2.' },
        { w: '{丘|おか}', pos: 'danh từ', ipa: 'oka', vi: 'đồi', ex: '{丘|おか}の{上|うえ}から、{町|まち}{全体|ぜんたい}が{見渡|みわた}せる。', exRo: 'Oka no ue kara, machi zentai ga miwataseru.', exVi: 'Từ trên đồi có thể nhìn bao quát cả thị trấn.', more: '**～が{丘|おか}** (tên phố: {桜|さくら}が{丘|おか}・{星|ほし}が{丘|おか}) · thấp hơn {山|やま} · {見渡|みわた}す (nhìn bao quát). N2.' },
        { w: '{郷土|きょうど}', pos: 'danh từ', ipa: 'kyoudo', vi: 'quê hương, địa phương', ex: '{旅行|りょこう}の{楽|たの}しみは、その{土地|とち}の{郷土料理|きょうどりょうり}を{食|た}べることだ。', exRo: 'Ryokou no tanoshimi wa, sono tochi no kyoudo ryouri o taberu koto da.', exVi: 'Niềm vui của chuyến đi là được ăn món ăn địa phương của vùng đó.', more: '**{郷土料理|きょうどりょうり}** · **{郷土史|きょうどし}** (lịch sử địa phương) · **{故郷|こきょう}** (cố hương — cũng gặp đọc ふるさと). N1.' },
        { w: '{遺跡|いせき}', pos: 'danh từ', ipa: 'iseki', vi: 'di tích (khảo cổ)', ex: '{道路|どうろ}の{工事中|こうじちゅう}に、{古|ふる}い{遺跡|いせき}が{見|み}つかった。', exRo: 'Douro no koujichuu ni, furui iseki ga mitsukatta.', exVi: 'Trong lúc làm đường, người ta tìm thấy một di tích cổ.', more: '**{遺跡|いせき}を{発掘|はっくつ}する** (khai quật) · **{世界遺産|せかいいさん}** (di sản thế giới) · ôn {跡|あと} (Bài 44 — 奇跡). N2.' },
        { w: '{言|い}い{伝|つた}え', pos: 'danh từ', ipa: 'iitsutae', vi: 'truyền thuyết, lời kể truyền lại', ex: 'この{池|いけ}には、{龍|りゅう}が{住|す}んでいたという{言|い}い{伝|つた}えがある。', exRo: 'Kono ike ni wa, ryuu ga sunde ita to iu iitsutae ga aru.', exVi: 'Có truyền thuyết kể rằng cái ao này từng có rồng sống.', more: '**～という{言|い}い{伝|つた}えがある** · ≈ **{伝説|でんせつ}** (truyền thuyết — văn viết) · {言|い}い{伝|つた}える (kể truyền lại). N1.' },
        { w: '{名付|なづ}ける', pos: 'động từ nhóm 2', ipa: 'nazukeru', vi: 'đặt tên', ex: '{生|う}まれた{子犬|こいぬ}を「ハナ」と{名付|なづ}けた。', exRo: 'Umareta koinu o "Hana" to nazuketa.', exVi: 'Đặt tên cho chú chó con mới sinh là "Hana".', more: '**AをBと{名付|なづ}ける** · bị động: **～と{名付|なづ}けられた** (hay đi với ～ことから) · **{名付|なづ}け{親|おや}** (người đặt tên). N2.' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Đánh giá — "đúng là… có khác" (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{芸術|げいじゅつ}', pos: 'danh từ', ipa: 'geijutsu', vi: 'nghệ thuật', ex: 'この{町|まち}は、{古|ふる}くから{芸術|げいじゅつ}の{町|まち}として{知|し}られている。', exRo: 'Kono machi wa, furuku kara geijutsu no machi to shite shirarete iru.', exVi: 'Thị trấn này từ lâu đã nổi tiếng là thị trấn nghệ thuật.', more: '**{芸術家|げいじゅつか}** (nghệ sĩ) · **{芸術的|げいじゅつてき}** · ～として{知|し}られる (được biết đến là…). N2.' },
        { w: '{芸能人|げいのうじん}', pos: 'danh từ', ipa: 'geinoujin', vi: 'nghệ sĩ, người của giới giải trí (TV)', ex: 'さすが{芸能人|げいのうじん}だけあって、{人前|ひとまえ}での{話|はな}し{方|かた}がうまい。', exRo: 'Sasuga geinoujin dake atte, hitomae de no hanashikata ga umai.', exVi: 'Đúng là người làm nghệ thuật giải trí có khác, nói trước đám đông rất giỏi.', more: '**{芸能界|げいのうかい}** (giới giải trí) · {芸|げい} (tài nghệ, tiết mục) · ví dụ dùng **だけあって** (mục ③). N2.' },
        { w: '{腕前|うでまえ}', pos: 'danh từ', ipa: 'udemae', vi: 'tay nghề', ex: '{父|ちち}の{料理|りょうり}の{腕前|うでまえ}は、プロ{並|な}みだ。', exRo: 'Chichi no ryouri no udemae wa, puro-nami da.', exVi: 'Tay nghề nấu ăn của bố tôi ngang dân chuyên nghiệp.', more: '**{腕前|うでまえ}を{見|み}せる／{上|あ}げる** · ôn **{腕|うで}** (Bài 44) · **～{並|な}み** (ngang với…). N1.' },
        { w: '{賢|かしこ}い', pos: 'tính từ い', ipa: 'kashikoi', vi: 'khôn ngoan, sáng dạ', ex: 'この{犬|いぬ}は{賢|かしこ}くて、{言葉|ことば}をたくさん{覚|おぼ}えている。', exRo: 'Kono inu wa kashikokute, kotoba o takusan oboete iru.', exVi: 'Con chó này khôn, nhớ được rất nhiều từ.', more: '**{賢|かしこ}い{選択|せんたく}** (lựa chọn khôn ngoan) · **{賢|かしこ}く{使|つか}う** (dùng khéo) · ≈ {頭|あたま}がいい. N2.' },
        { w: '{穏|おだ}やか（な）', pos: 'tính từ な', ipa: 'odayaka (na)', vi: 'êm đềm, ôn hoà', ex: '{祖母|そぼ}は、いつも{穏|おだ}やかな{声|こえ}で{話|はな}す。', exRo: 'Sobo wa, itsumo odayaka na koe de hanasu.', exVi: 'Bà tôi lúc nào cũng nói bằng giọng ôn tồn.', more: '**{穏|おだ}やかな{天気|てんき}／{海|うみ}／{性格|せいかく}** · ↔ {激|はげ}しい · **{心|こころ}が{穏|おだ}やかでない** (trong lòng không yên). N2.' },
        { w: '{昇進|しょうしん}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'shoushin (suru)', vi: 'thăng chức', ex: '{兄|あに}は{入社|にゅうしゃ}{五年目|ごねんめ}で、{課長|かちょう}に{昇進|しょうしん}した。', exRo: 'Ani wa nyuusha gonenme de, kachou ni shoushin shita.', exVi: 'Anh tôi lên trưởng phòng vào năm thứ năm sau khi vào công ty.', more: '**～に{昇進|しょうしん}する** · ↔ **{降格|こうかく}** (giáng chức) · {上昇|じょうしょう} (tăng lên — cùng chữ 昇). N1.' },
        { w: '{名門|めいもん}', pos: 'danh từ', ipa: 'meimon', vi: 'danh giá, có tiếng lâu đời (trường, đội, gia đình)', ex: '{彼|かれ}は、サッカーの{名門|めいもん}{高校|こうこう}の{出身|しゅっしん}だ。', exRo: 'Kare wa, sakkaa no meimon koukou no shusshin da.', exVi: 'Anh ấy xuất thân từ một trường cấp ba danh tiếng về bóng đá.', more: '**{名門校|めいもんこう}** · **{名門|めいもん}チーム** · ≈ {有名|ゆうめい} + "lâu đời, đẳng cấp". N1.' },
        { w: '{老舗|しにせ}', pos: 'danh từ', ipa: 'shinise', vi: 'cửa hàng lâu đời (gia truyền)', ex: '{創業|そうぎょう}{二百年|にひゃくねん}の{老舗|しにせ}だけあって、{味|あじ}が{違|ちが}う。', exRo: 'Sougyou nihyakunen no shinise dake atte, aji ga chigau.', exVi: 'Đúng là tiệm lâu đời hai trăm năm có khác, vị khác hẳn.', more: 'Đọc đặc biệt **しにせ** (không phải ろうほ) · **{老舗旅館|しにせりょかん}** · {創業|そうぎょう} (thành lập — doanh nghiệp). N1.' },
        { w: '{本場|ほんば}', pos: 'danh từ', ipa: 'honba', vi: 'nơi gốc, chính gốc', ex: '{一度|いちど}、{本場|ほんば}のイタリア{料理|りょうり}を{食|た}べてみたい。', exRo: 'Ichido, honba no Itaria ryouri o tabete mitai.', exVi: 'Tôi muốn một lần được ăn món Ý chính gốc.', more: '**{本場|ほんば}の{味|あじ}** · **{本場|ほんば}で{学|まな}ぶ** · ≈ {本物|ほんもの} (đồ thật). N2.' },
        { w: '{期待外|きたいはず}れ', pos: 'danh từ / tính từ な', ipa: 'kitai hazure', vi: 'dưới kỳ vọng, gây thất vọng', ex: '{話題|わだい}の{映画|えいが}だっただけに、{期待外|きたいはず}れでがっかりした。', exRo: 'Wadai no eiga datta dake ni, kitai hazure de gakkari shita.', exVi: 'Chính vì là phim đang được bàn tán nên thấy dưới kỳ vọng lại càng thất vọng.', more: '↔ **{期待|きたい}どおり** · **{期待以上|きたいいじょう}** · ví dụ dùng **だけに** (mục ③). N2.' },
        { w: '{張|は}り{切|き}る', pos: 'động từ nhóm 1', ipa: 'harikiru', vi: 'hăng hái, hừng hực khí thế', ex: '{初|はじ}めての{試合|しあい}なので、{息子|むすこ}は{朝|あさ}から{張|は}り{切|き}っている。', exRo: 'Hajimete no shiai na node, musuko wa asa kara harikitte iru.', exVi: 'Trận đấu đầu tiên nên con trai tôi hăng hái từ sáng.', more: '**{張|は}り{切|き}って～する** · {張|は}り{切|き}りすぎる (hăng quá) · ôn {張|は}る (căng). N2.' },
        { w: '{懸命|けんめい}に', pos: 'phó từ', ipa: 'kenmei ni', vi: 'dốc sức, cật lực', ex: '{消防士|しょうぼうし}たちは、{懸命|けんめい}に{火|ひ}を{消|け}そうとした。', exRo: 'Shouboushitachi wa, kenmei ni hi o kesou to shita.', exVi: 'Những người lính cứu hoả đã dốc sức dập lửa.', more: 'Ôn **{一生懸命|いっしょうけんめい}** (Bài 16) · **{懸命|けんめい}な{努力|どりょく}** · ≠ **{賢明|けんめい}** (sáng suốt — đồng âm, khác chữ!). N2.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Lý do & hậu quả đời thường (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{寝過|ねす}ごす', pos: 'động từ nhóm 1', ipa: 'nesugosu', vi: 'ngủ quên, ngủ quá giờ', ex: '{目覚|めざ}ましが{鳴|な}らなかったものだから、{寝過|ねす}ごしてしまった。', exRo: 'Mezamashi ga naranakatta mono da kara, nesugoshite shimatta.', exVi: 'Tại đồng hồ báo thức không kêu nên tôi ngủ quên mất.', more: '≈ **{寝坊|ねぼう}する** (N4) · **{寝過|ねす}ごして{遅刻|ちこく}する** · ví dụ dùng **ものだから** (mục ④). N2.' },
        { w: '{乗|の}り{過|す}ごす', pos: 'động từ nhóm 1', ipa: 'norisugosu', vi: 'đi quá ga, lỡ ga cần xuống', ex: '{電車|でんしゃ}で{寝|ね}てしまって、{二駅|ふたえき}も{乗|の}り{過|す}ごした。', exRo: 'Densha de nete shimatte, futaeki mo norisugoshita.', exVi: 'Ngủ quên trên tàu nên đi quá tận hai ga.', more: '**{駅|えき}を{乗|の}り{過|す}ごす** · ≠ {乗|の}り{遅|おく}れる (lỡ chuyến) · ≠ {乗|の}り{換|か}える (đổi tàu). N2.' },
        { w: '{遭|あ}う', pos: 'động từ nhóm 1', ipa: 'au', vi: 'gặp phải (chuyện không may)', ex: '{帰|かえ}りに{夕立|ゆうだち}に{遭|あ}って、びしょぬれになった。', exRo: 'Kaeri ni yuudachi ni atte, bishonure ni natta.', exVi: 'Trên đường về gặp cơn mưa rào nên ướt sũng.', more: '**{事故|じこ}／{詐欺|さぎ}／{夕立|ゆうだち}に{遭|あ}う** · **ひどい{目|め}に{遭|あ}う** (gặp chuyện tồi tệ) · ≠ {会|あ}う (gặp người) — bảng 類義語. N2.' },
        { w: '{詰|つ}め{込|こ}む', pos: 'động từ nhóm 1', ipa: 'tsumekomu', vi: 'nhồi nhét', ex: '{試験|しけん}の{前|まえ}の{日|ひ}に{全部|ぜんぶ}{詰|つ}め{込|こ}もうとしても、{無理|むり}だ。', exRo: 'Shiken no mae no hi ni zenbu tsumekomou to shite mo, muri da.', exVi: 'Định nhồi hết vào đầu trong ngày trước kỳ thi là không thể.', more: '**かばんに{荷物|にもつ}を{詰|つ}め{込|こ}む** · **{予定|よてい}を{詰|つ}め{込|こ}む** (xếp lịch kín mít) · **{詰|つ}め{込|こ}み{教育|きょういく}** (giáo dục nhồi nhét). N2.' },
        { w: '{嘆|なげ}く', pos: 'động từ nhóm 1', ipa: 'nageku', vi: 'than thở, than vãn', ex: '{失敗|しっぱい}を{嘆|なげ}いてばかりいないで、{次|つぎ}のことを{考|かんが}えよう。', exRo: 'Shippai o nageite bakari inaide, tsugi no koto o kangaeyou.', exVi: 'Đừng chỉ ngồi than thở về thất bại, hãy nghĩ tới việc tiếp theo.', more: '**～を{嘆|なげ}く** · **{嘆|なげ}かわしい** (đáng buồn, đáng than — N1) · ≈ **{愚痴|ぐち}を{言|い}う** (từ ngay dưới). N2.' },
        { w: '{愚痴|ぐち}', pos: 'danh từ', ipa: 'guchi', vi: 'lời than vãn, cằn nhằn', ex: '{上司|じょうし}の{愚痴|ぐち}ばかり{言|い}っていても、{何|なに}も{変|か}わらない。', exRo: 'Joushi no guchi bakari itte ite mo, nani mo kawaranai.', exVi: 'Cứ than vãn về sếp mãi thì cũng chẳng có gì thay đổi.', more: '**{愚痴|ぐち}を{言|い}う／こぼす** · **{愚痴|ぐち}っぽい** (hay cằn nhằn) · văn nói hơn {嘆|なげ}く · chữ 愚 mới của bài. N1.' },
        { w: '{二日酔|ふつかよ}い', pos: 'danh từ', ipa: 'futsukayoi', vi: 'say rượu hôm sau, nôn nao', ex: '{昨夜|さくや}{飲|の}みすぎたもんだから、{今朝|けさ}はひどい{二日酔|ふつかよ}いだ。', exRo: 'Sakuya nomisugita mon da kara, kesa wa hidoi futsukayoi da.', exVi: 'Tại tối qua uống quá chén nên sáng nay nôn nao kinh khủng.', more: 'Đọc đặc biệt **ふつか**よい · {酔|よ}う (say) · ví dụ dùng **もんだから** (mục ④). N2.' },
        { w: '{見栄|みえ}を{張|は}る', pos: 'cụm từ', ipa: 'mie o haru', vi: 'sĩ diện, làm màu', ex: '{見栄|みえ}を{張|は}りたいばかりに、{高|たか}い{時計|とけい}をローンで{買|か}った。', exRo: 'Mie o haritai bakari ni, takai tokei o roon de katta.', exVi: 'Chỉ vì muốn sĩ diện mà mua trả góp một chiếc đồng hồ đắt tiền.', more: '**{見栄|みえ}っ{張|ぱ}り** (người sĩ diện) · ví dụ dùng **～たいばかりに** (mục ①). N1.' },
        { w: '{調子|ちょうし}に{乗|の}る', pos: 'cụm từ', ipa: 'choushi ni noru', vi: 'được đà lấn tới, quá trớn', ex: 'ほめられて{調子|ちょうし}に{乗|の}ったばかりに、{大失敗|だいしっぱい}した。', exRo: 'Homerarete choushi ni notta bakari ni, daishippai shita.', exVi: 'Chỉ vì được khen rồi quá trớn mà thất bại to.', more: '**{調子|ちょうし}に{乗|の}るな** (đừng có quá trớn) · ≠ {調子|ちょうし}がいい (phong độ tốt). N2.' },
        { w: '{口|くち}を{滑|すべ}らせる', pos: 'cụm từ', ipa: 'kuchi o suberaseru', vi: 'lỡ miệng', ex: 'うっかり{口|くち}を{滑|すべ}らせたばかりに、{秘密|ひみつ}がばれてしまった。', exRo: 'Ukkari kuchi o suberaseta bakari ni, himitsu ga barete shimatta.', exVi: 'Chỉ vì lỡ miệng mà bí mật bị lộ.', more: '≈ **{口|くち}が{滑|すべ}る** (tự động từ) · ばれる (bị lộ — văn nói). N1.' },
        { w: '{自業自得|じごうじとく}', pos: 'danh từ', ipa: 'jigou jitoku', vi: 'tự làm tự chịu', ex: '{勉強|べんきょう}しないで{試験|しけん}に{落|お}ちたのは、{自業自得|じごうじとく}だ。', exRo: 'Benkyou shinaide shiken ni ochita no wa, jigou jitoku da.', exVi: 'Không học mà thi trượt là tự làm tự chịu.', more: 'Thành ngữ bốn chữ (四字熟語) — nói kết quả xấu do chính người đó gây ra · dùng cho người khác thì nghe nặng. N1.' },
        { w: '{早|はや}とちり', pos: 'danh từ / động từ nhóm 3', ipa: 'hayatochiri', vi: 'hấp tấp hiểu nhầm', ex: '{会議|かいぎ}が{中止|ちゅうし}だと{早|はや}とちりして、{帰|かえ}ってしまった。', exRo: 'Kaigi ga chuushi da to hayatochiri shite, kaette shimatta.', exVi: 'Vội tưởng cuộc họp bị huỷ nên đã về mất.', more: '**～と{早|はや}とちりする** · ≈ {勘違|かんちが}い (hiểu lầm) nhưng nhấn "vì vội". N1.' },
        { w: '{運悪|うんわる}く', pos: 'phó từ', ipa: 'un\'waruku', vi: 'không may, xui thay', ex: '{急|いそ}いでいる{時|とき}に、{運悪|うんわる}く{電車|でんしゃ}が{止|と}まった。', exRo: 'Isoide iru toki ni, un\'waruku densha ga tomatta.', exVi: 'Đúng lúc đang vội thì xui thay tàu lại dừng.', more: '↔ **{運|うん}よく** (may thay) · **{運|うん}が{悪|わる}い** · romaji: un\'waruku (ん + わ). N2.' },
        { w: '{取|と}り{返|かえ}しがつかない', pos: 'cụm từ', ipa: 'torikaeshi ga tsukanai', vi: 'không thể cứu vãn', ex: '{小|ちい}さなうそが、{取|と}り{返|かえ}しのつかない{結果|けっか}を{招|まね}くこともある。', exRo: 'Chiisana uso ga, torikaeshi no tsukanai kekka o maneku koto mo aru.', exVi: 'Một lời nói dối nhỏ cũng có khi gây ra hậu quả không thể cứu vãn.', more: 'Bổ nghĩa danh từ: **{取|と}り{返|かえ}しのつかない N** (が → の) · đi với **{招|まね}く** (nhóm A). N2.' },
      ],
    },

    /* ── Thẻ hình ── */
    {
      t: 'hinh',
      title: 'Thẻ từ có hình — chạm để nghe (24 từ)',
      items: [
        { anh: 'link', w: '{因果関係|いんがかんけい}', ro: 'inga kankei', vi: 'quan hệ nhân quả (hình: mắt xích)' },
        { anh: 'bar-chart', w: '{相関|そうかん}', ro: 'soukan', vi: 'tương quan (hình: biểu đồ)' },
        { anh: 'light-bulb', w: '{仮説|かせつ}', ro: 'kasetsu', vi: 'giả thuyết (hình: bóng đèn ý tưởng)' },
        { anh: 'magnifying-glass-tilted-left', w: '{検証|けんしょう}', ro: 'kenshou', vi: 'kiểm chứng (hình: kính lúp)' },
        { anh: 'detective', w: '{推測|すいそく}', ro: 'suisoku', vi: 'phỏng đoán (hình: thám tử)' },
        { anh: 'bug', w: '{不具合|ふぐあい}', ro: 'fuguai', vi: 'lỗi phần mềm (hình: con bọ — "bug")' },
        { anh: 'memo', w: '{始末書|しまつしょ}', ro: 'shimatsusho', vi: 'bản tường trình nhận lỗi (hình: tờ giấy viết)' },
        { anh: 'anxious-face-with-sweat', w: '{慌|あわ}てる', ro: 'awateru', vi: 'hoảng, cuống (hình: mặt toát mồ hôi)' },
        { anh: 'beach-with-umbrella', w: '{砂浜|すなはま}', ro: 'sunahama', vi: 'bãi cát' },
        { anh: 'sunrise-over-mountains', w: '{谷|たに}', ro: 'tani', vi: 'thung lũng (hình: giữa hai ngọn núi)' },
        { anh: 'scroll', w: '{言|い}い{伝|つた}え', ro: 'iitsutae', vi: 'truyền thuyết (hình: cuộn giấy cổ)' },
        { anh: 'artist-palette', w: '{芸術|げいじゅつ}', ro: 'geijutsu', vi: 'nghệ thuật (hình: bảng màu)' },
        { anh: 'microphone', w: '{芸能人|げいのうじん}', ro: 'geinoujin', vi: 'nghệ sĩ giải trí (hình: micro)' },
        { anh: 'man-cook', w: '{腕前|うでまえ}', ro: 'udemae', vi: 'tay nghề (hình: đầu bếp)' },
        { anh: 'owl', w: '{賢|かしこ}い', ro: 'kashikoi', vi: 'khôn ngoan (hình: con cú)' },
        { anh: 'relieved-face', w: '{穏|おだ}やか', ro: 'odayaka', vi: 'êm đềm, ôn hoà (hình: mặt thư thái)' },
        { anh: 'chart-increasing', w: '{昇進|しょうしん}', ro: 'shoushin', vi: 'thăng chức (hình: biểu đồ đi lên)' },
        { anh: 'disappointed-face', w: '{期待外|きたいはず}れ', ro: 'kitai hazure', vi: 'dưới kỳ vọng (hình: mặt thất vọng)' },
        { anh: 'flexed-biceps', w: '{張|は}り{切|き}る', ro: 'harikiru', vi: 'hăng hái (hình: cánh tay gồng)' },
        { anh: 'alarm-clock', w: '{寝過|ねす}ごす', ro: 'nesugosu', vi: 'ngủ quên (hình: đồng hồ báo thức)' },
        { anh: 'train', w: '{乗|の}り{過|す}ごす', ro: 'norisugosu', vi: 'đi quá ga (hình: tàu điện)' },
        { anh: 'umbrella-with-rain-drops', w: '{夕立|ゆうだち}に{遭|あ}う', ro: 'yuudachi ni au', vi: 'gặp mưa rào (hình: ô và mưa)' },
        { anh: 'woozy-face', w: '{二日酔|ふつかよ}い', ro: 'futsukayoi', vi: 'nôn nao sau khi say (hình: mặt choáng váng)' },
        { anh: 'face-with-hand-over-mouth', w: '{口|くち}を{滑|すべ}らせる', ro: 'kuchi o suberaseru', vi: 'lỡ miệng (hình: tay che miệng)' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ dễ nhầm (類義語) — đề N2 hay hỏi ở dạng 文脈規定・言い換え類義',
      head: ['Cặp', 'Khác nhau ở đâu', 'Ví dụ', 'Romaji'],
      rows: [
        ['{原因|げんいん} ↔ {要因|よういん} ↔ {理由|りゆう} ↔ きっかけ', '{原因|げんいん}: cái TRỰC TIẾP gây ra kết quả (thường xấu — Bài 27) · {要因|よういん}: MỘT TRONG NHIỀU yếu tố góp phần · {理由|りゆう}: LÝ DO con người đưa ra để giải thích hành động / phán đoán (Bài 19) · きっかけ: CƠ HỘI khởi đầu (Bài 41)', '{事故|じこ}の{原因|げんいん}／{成功|せいこう}の{要因|よういん}／{休|やす}んだ{理由|りゆう}／{始|はじ}めたきっかけ', 'jiko no gen\'in / seikou no youin / yasunda riyuu / hajimeta kikkake'],
        ['{因果関係|いんがかんけい} ↔ {相関|そうかん}', '{因果関係|いんがかんけい}: A GÂY RA B · {相関|そうかん}: A và B CÙNG thay đổi (có thể do C)', '{暑|あつ}い{日|ひ}はアイスも{水難事故|すいなんじこ}も{増|ふ}える — {相関|そうかん}はあるが{因果関係|いんがかんけい}はない', 'atsui hi wa aisu mo suinan jiko mo fueru — soukan wa aru ga inga kankei wa nai'],
        ['{招|まね}く ↔ {引|ひ}き{起|お}こす ↔ もたらす ↔ {及|およ}ぼす', '{招|まね}く: chuốc lấy kết quả XẤU do chính mình (誤解・混乱) · {引|ひ}き{起|お}こす: gây ra SỰ CỐ, hiện tượng cụ thể · もたらす: đem lại kết quả (TỐT hoặc xấu — văn viết) · {及|およ}ぼす: lan ẢNH HƯỞNG tới (～に影響を及ぼす)', '{誤解|ごかい}を{招|まね}く／{事故|じこ}を{引|ひ}き{起|お}こす／{利益|りえき}をもたらす／{影響|えいきょう}を{及|およ}ぼす', 'gokai o maneku / jiko o hikiokosu / rieki o motarasu / eikyou o oyobosu'],
        ['{推測|すいそく} ↔ {予想|よそう} ↔ {想定|そうてい}', '{推測|すいそく}: đoán điều KHÔNG BIẾT (thường đã xảy ra / đang có) từ thông tin sẵn có · {予想|よそう}: đoán điều SẮP xảy ra (Bài 20) · {想定|そうてい}: GIẢ ĐỊNH một tình huống để chuẩn bị (Bài 46)', '{犯人|はんにん}の{年齢|ねんれい}を{推測|すいそく}する／{試合|しあい}の{結果|けっか}を{予想|よそう}する／{地震|じしん}を{想定|そうてい}する', 'hannin no nenrei o suisoku suru / shiai no kekka o yosou suru / jishin o soutei suru'],
        ['{不具合|ふぐあい} ↔ {欠陥|けっかん} ↔ {故障|こしょう}', '{不具合|ふぐあい}: chạy KHÔNG ĐÚNG như mong đợi (lỗi nhẹ – vừa, nhất là phần mềm) · {欠陥|けっかん}: khiếm khuyết nằm SẴN trong thiết kế, cấu tạo (nặng) · {故障|こしょう}: HỎNG, ngừng chạy (máy móc)', 'アプリの{不具合|ふぐあい}／{設計|せっけい}の{欠陥|けっかん}／エアコンの{故障|こしょう}', 'apuri no fuguai / sekkei no kekkan / eakon no koshou'],
        ['{釈明|しゃくめい} ↔ {弁解|べんかい} ↔ {言|い}い{訳|わけ}', '{釈明|しゃくめい}: GIẢI TRÌNH chính thức (trước công chúng, tổ chức) · {弁解|べんかい}: BIỆN BẠCH cho lỗi của mình (văn viết) · {言|い}い{訳|わけ}: lời BÀO CHỮA (văn nói, sắc thái xấu — Bài 28)', '{記者会見|きしゃかいけん}で{釈明|しゃくめい}する／{弁解|べんかい}の{余地|よち}がない／{言|い}い{訳|わけ}ばかりする', 'kisha kaiken de shakumei suru / benkai no yochi ga nai / iiwake bakari suru'],
        ['{慌|あわ}てる ↔ {焦|あせ}る', '{慌|あわ}てる: HOẢNG, cuống nên hành động vội (thấy được bên ngoài) · {焦|あせ}る: SỐT RUỘT, nóng lòng trong bụng vì sợ không kịp', '{地震|じしん}で{慌|あわ}てて{外|そと}に{出|で}た／{時間|じかん}がなくて{焦|あせ}る', 'jishin de awatete soto ni deta / jikan ga nakute aseru'],
        ['{老舗|しにせ} ↔ {名門|めいもん} ↔ {本場|ほんば}', '{老舗|しにせ}: CỬA HÀNG, doanh nghiệp lâu đời · {名門|めいもん}: TRƯỜNG, đội, gia tộc danh giá · {本場|ほんば}: NƠI GỐC của một món ăn / nghề', '{老舗|しにせ}の{和菓子屋|わがしや}／{名門|めいもん}{大学|だいがく}／{本場|ほんば}のカレー', 'shinise no wagashiya / meimon daigaku / honba no karee'],
        ['{寝過|ねす}ごす ↔ {寝坊|ねぼう}する ↔ {乗|の}り{過|す}ごす', '{寝過|ねす}ごす: ngủ quá giờ định dậy (cả ban ngày) · {寝坊|ねぼう}する: dậy muộn buổi sáng (N4) · {乗|の}り{過|す}ごす: đi QUÁ ga định xuống', '{昼寝|ひるね}で{寝過|ねす}ごした／{今朝|けさ}{寝坊|ねぼう}した／{駅|えき}を{乗|の}り{過|す}ごした', 'hirune de nesugoshita / kesa nebou shita / eki o norisugoshita'],
        ['{遭|あ}う ↔ {会|あ}う ↔ {合|あ}う', '{遭|あ}う: GẶP PHẢI chuyện không may (事故・雨) · {会|あ}う: GẶP người · {合|あ}う: HỢP, khớp (サイズが合う)', '{事故|じこ}に{遭|あ}う／{友達|ともだち}に{会|あ}う／{靴|くつ}が{足|あし}に{合|あ}う', 'jiko ni au / tomodachi ni au / kutsu ga ashi ni au'],
        ['{懸命|けんめい} ↔ {賢明|けんめい}', 'Cùng đọc けんめい! {懸命|けんめい}: DỐC SỨC (懸命に努力する) · {賢明|けんめい}: SÁNG SUỐT (賢明な判断)', '{懸命|けんめい}に{働|はたら}く／{賢明|けんめい}な{選択|せんたく}', 'kenmei ni hataraku / kenmei na sentaku'],
        ['{責|せ}める ↔ {攻|せ}める', 'Cùng đọc せめる! {責|せ}める: TRÁCH, đổ lỗi · {攻|せ}める: TẤN CÔNG (thể thao, chiến tranh)', '{部下|ぶか}を{責|せ}める／{相手|あいて}のゴールを{攻|せ}める', 'buka o semeru / aite no gooru o semeru'],
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '**{因果関係|いんがかんけい}を{明|あき}らかにする** · **{主|おも}な{要因|よういん}** · **{誤解|ごかい}／{混乱|こんらん}を{招|まね}く** · **{事故|じこ}／{問題|もんだい}を{引|ひ}き{起|お}こす** · **{変化|へんか}／{利益|りえき}をもたらす** · **～に{影響|えいきょう}を{及|およ}ぼす** · **データが～を{裏付|うらづ}ける・{裏付|うらづ}けを{取|と}る** · **～から{推測|すいそく}する・{推測|すいそく}にすぎない** · **{強|つよ}い{相関|そうかん}がある** · **{仮説|かせつ}を{立|た}てる／{検証|けんしょう}する** · **{頻度|ひんど}が{高|たか}い** · **{頻繁|ひんぱん}に{起|お}こる** · **{密接|みっせつ}な{関係|かんけい}がある**.',
        '**{不具合|ふぐあい}が{生|しょう}じる・{不具合|ふぐあい}を{修正|しゅうせい}する** · **{欠陥|けっかん}が{見|み}つかる** · **{再発防止策|さいはつぼうしさく}を{講|こう}じる** (áp dụng biện pháp — văn viết) · **{経緯|けいい}を{説明|せつめい}する** · **{釈明|しゃくめい}を{求|もと}める** · **{弁解|べんかい}の{余地|よち}がない** · **{始末書|しまつしょ}を{提出|ていしゅつ}する** · **{私|わたし}の{不注意|ふちゅうい}で** · **{思|おも}い{込|こ}みを{捨|す}てる** · **{確認漏|かくにんも}れを{防|ふせ}ぐ** · **{慌|あわ}てて{電話|でんわ}する** · **{理由|りゆう}を{問|と}い{詰|つ}める** · **{自分|じぶん}を{責|せ}める**.',
        '**{正式名称|せいしきめいしょう}** · **～という{愛称|あいしょう}で{親|した}しまれる** · **{地名|ちめい}の{由来|ゆらい}** · **{急|きゅう}な{坂|さか}を{上|のぼ}る** · **{谷|たに}を{渡|わた}る** · **{海岸|かいがん}を{散歩|さんぽ}する** · **{砂浜|すなはま}で{遊|あそ}ぶ** · **{湾|わん}を{埋|う}め{立|た}てる** · **{丘|おか}の{上|うえ}から{見渡|みわた}す** · **{郷土料理|きょうどりょうり}を{味|あじ}わう** · **{遺跡|いせき}を{発掘|はっくつ}する** · **～という{言|い}い{伝|つた}えが{残|のこ}る** · **～ことから「～」と{名付|なづ}けられた**.',
        '**{芸術|げいじゅつ}に{触|ふ}れる** · **{芸能界|げいのうかい}に{入|はい}る** · **{腕前|うでまえ}を{上|あ}げる** · **{賢|かしこ}い{選択|せんたく}** · **{穏|おだ}やかな{性格|せいかく}** · **{課長|かちょう}に{昇進|しょうしん}する** · **{名門|めいもん}{校|こう}に{合格|ごうかく}する** · **{老舗|しにせ}の{味|あじ}を{守|まも}る** · **{本場|ほんば}の{味|あじ}** · **{期待外|きたいはず}れに{終|お}わる** · **{張|は}り{切|き}って{準備|じゅんび}する** · **{懸命|けんめい}に{努力|どりょく}する**.',
        '**{寝過|ねす}ごして{遅刻|ちこく}する** · **{駅|えき}を{乗|の}り{過|す}ごす** · **ひどい{目|め}に{遭|あ}う** · **{知識|ちしき}を{詰|つ}め{込|こ}む** · **{不運|ふうん}を{嘆|なげ}く** · **{二日酔|ふつかよ}いで{頭|あたま}が{痛|いた}い** · **{見栄|みえ}を{張|は}って{高|たか}い{物|もの}を{買|か}う** · **{調子|ちょうし}に{乗|の}って{飲|の}みすぎる** · **うっかり{口|くち}を{滑|すべ}らせる** · **{自業自得|じごうじとく}だ** · **{早|はや}とちりして{帰|かえ}る** · **{運悪|うんわる}く{雨|あめ}に{降|ふ}られる** · **{取|と}り{返|かえ}しのつかないことになる**.',
      ],
    },
    {
      t: 'write',
      id: 'b48-viet-tu',
      title: 'Viết tay 12 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['要因', '相関', '仮説', '欠陥', '経緯', '慌てる', '名称', '海岸', '砂浜', '遺跡', '老舗', '遭う'],
      goi: {
        '要因': 'よういん · yếu tố, nhân tố',
        '相関': 'そうかん · tương quan',
        '仮説': 'かせつ · giả thuyết',
        '欠陥': 'けっかん · khiếm khuyết',
        '経緯': 'けいい · đầu đuôi sự việc',
        '慌てる': 'あわてる · hoảng, cuống',
        '名称': 'めいしょう · tên gọi',
        '海岸': 'かいがん · bờ biển',
        '砂浜': 'すなはま · bãi cát',
        '遺跡': 'いせき · di tích',
        '老舗': 'しにせ · cửa hàng lâu đời',
        '遭う': 'あう · gặp phải (chuyện không may)',
      },
    },
    {
      t: 'mcq',
      id: 'b48-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 18 câu (dạng 文脈規定・言い換え類義・用法 của đề N2)',
      items: DOI([
        { q: '{説明|せつめい}の{仕方|しかた}が{悪|わる}いと、{思|おも}わぬ{誤解|ごかい}を（　）ことがある。', options: ['{招|まね}く', 'もたらす', '{及|およ}ぼす', '{裏付|うらづ}ける'], correct: 0, why: '**{誤解|ごかい}を{招|まね}く** — cụm cố định (chuốc lấy kết quả xấu). もたらす không đi với 誤解 tự nhiên; 及ぼす đi với 影響. 〔Omowanu gokai o maneku koto ga aru.〕' },
        { q: '{気温|きおん}の{変化|へんか}は、{作物|さくもつ}の{成長|せいちょう}に{大|おお}きな{影響|えいきょう}を（　）。', options: ['{及|およ}ぼす', '{招|まね}く', '{名付|なづ}ける', '{推測|すいそく}する'], correct: 0, why: '**～に{影響|えいきょう}を{及|およ}ぼす**. 〔Sakumotsu no seichou ni ookina eikyou o oyobosu.〕' },
        { q: '{勉強時間|べんきょうじかん}と{成績|せいせき}には{強|つよ}い（　）があるが、それだけで{原因|げんいん}とは{言|い}えない。', options: ['{相関|そうかん}', '{頻度|ひんど}', '{経緯|けいい}', '{名称|めいしょう}'], correct: 0, why: 'Hai thứ cùng thay đổi nhưng chưa chắc là nguyên nhân → **{相関|そうかん}**. 〔Tsuyoi soukan ga aru ga…〕' },
        { q: '「{朝食|ちょうしょく}を{食|た}べると{成績|せいせき}が{上|あ}がる」という（　）を{立|た}てて、データで{確|たし}かめた。', options: ['{仮説|かせつ}', '{言|い}い{伝|つた}え', '{始末書|しまつしょ}', '{本場|ほんば}'], correct: 0, why: '**{仮説|かせつ}を{立|た}てる** rồi kiểm tra bằng dữ liệu. 〔… to iu kasetsu o tatete…〕' },
        { q: '{事故|じこ}がどのように{起|お}きたのか、{経緯|けいい}を（　）{説明|せつめい}してください。', options: ['{時間|じかん}の{順|じゅん}に', '{頻繁|ひんぱん}に', '{運悪|うんわる}く', '{穏|おだ}やかに'], correct: 0, why: '**{経緯|けいい}** = diễn biến → kể **{時間|じかん}の{順|じゅん}に** (theo thứ tự thời gian). 〔Keii o jikan no jun ni setsumei shite kudasai.〕' },
        { q: '{新|あたら}しく{発売|はつばい}された{車|くるま}のブレーキに（　）が{見|み}つかり、{全部|ぜんぶ}{回収|かいしゅう}された。', options: ['{欠陥|けっかん}', '{仮説|かせつ}', '{要因|よういん}', '{腕前|うでまえ}'], correct: 0, why: 'Lỗi nằm trong thiết kế → thu hồi → **{欠陥|けっかん}**. 〔Bureeki ni kekkan ga mitsukari…〕' },
        { q: '{地震|じしん}の{時|とき}は（　）{外|そと}に{飛|と}び{出|だ}さないで、まず{身|み}を{守|まも}ってください。', options: ['{慌|あわ}てて', '{張|は}り{切|き}って', '{嘆|なげ}いて', '{責|せ}めて'], correct: 0, why: '**{慌|あわ}てて～する** = vội vàng, hoảng hốt làm. 〔Awatete soto ni tobidasanaide…〕' },
        { q: '{電車|でんしゃ}で{寝|ね}てしまい、{降|お}りる{駅|えき}を（　）。', options: ['{乗|の}り{過|す}ごした', '{寝過|ねす}ごした', '{詰|つ}め{込|こ}んだ', '{名付|なづ}けた'], correct: 0, why: 'Đi quá ga định xuống → **{乗|の}り{過|す}ごす**. {寝過|ねす}ごす là ngủ quá giờ. 〔Oriru eki o norisugoshita.〕' },
        { q: '{登山中|とざんちゅう}に{急|きゅう}な{大雨|おおあめ}に（　）、{山小屋|やまごや}で{一晩|ひとばん}{過|す}ごした。', options: ['{遭|あ}って', '{会|あ}って', '{合|あ}って', '{招|まね}いて'], correct: 0, why: 'Gặp phải chuyện không may (mưa lớn) → **{遭|あ}う**. 〔Kyuu na ooame ni atte…〕' },
        { q: '{創業|そうぎょう}{三百年|さんびゃくねん}の（　）の{和菓子屋|わがしや}で、お{土産|みやげ}を{買|か}った。', options: ['{老舗|しにせ}', '{名門|めいもん}', '{郷土|きょうど}', '{遺跡|いせき}'], correct: 0, why: 'Cửa hàng lâu đời → **{老舗|しにせ}**. {名門|めいもん} dùng cho trường, đội, gia tộc. 〔Sougyou sanbyakunen no shinise no wagashiya…〕' },
        { q: '「{頻繁|ひんぱん}に」に{最|もっと}も{近|ちか}いのは？', options: ['しょっちゅう', 'たまに', 'ようやく', 'いきなり'], correct: 0, why: '**{頻繁|ひんぱん}に** ≈ **しょっちゅう** (rất thường xuyên). 〔Shocchuu.〕' },
        { q: '「{弁解|べんかい}の{余地|よち}がない」に{最|もっと}も{近|ちか}いのは？', options: ['{言|い}い{訳|わけ}できないほど{自分|じぶん}が{悪|わる}い', '{説明|せつめい}する{時間|じかん}がない', '{場所|ばしょ}が{狭|せま}くて{入|はい}れない', '{弁護士|べんごし}を{頼|たの}めない'], correct: 0, why: '**{弁解|べんかい}の{余地|よち}がない** = không còn chỗ nào để biện bạch → mình hoàn toàn có lỗi.' },
        { q: '「{早|はや}とちりした」に{最|もっと}も{近|ちか}いのは？', options: ['よく{確|たし}かめずに{間違|まちが}って{理解|りかい}した', '{朝早|あさはや}く{起|お}きて{出|で}かけた', '{走|はし}って{急|いそ}いで{行|い}った', '{早|はや}めに{仕事|しごと}を{終|お}えた'], correct: 0, why: '**{早|はや}とちり** = vội vàng hiểu nhầm vì không kiểm tra.' },
        { q: '「{取|と}り{返|かえ}しがつかない」に{最|もっと}も{近|ちか}いのは？', options: ['もう{元|もと}に{戻|もど}すことができない', 'もう{一度|いちど}{取|と}りに{行|い}く', 'お{金|かね}を{返|かえ}してもらえる', 'まだ{間|ま}に{合|あ}う'], correct: 0, why: '**{取|と}り{返|かえ}しがつかない** = không thể cứu vãn, không thể quay lại như cũ.' },
        { q: '「{賢|かしこ}い」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{安|やす}い{時|とき}にまとめて{買|か}うのは{賢|かしこ}い{方法|ほうほう}だ。', '{今日|きょう}は{天気|てんき}が{賢|かしこ}くて{気持|きも}ちいい。', 'この{料理|りょうり}は{塩|しお}が{賢|かしこ}い。', '{賢|かしこ}い{雨|あめ}が{一日中|いちにちじゅう}{降|ふ}った。'], correct: 0, why: '**{賢|かしこ}い{方法|ほうほう}／{選択|せんたく}** = cách / lựa chọn khôn ngoan. 〔Kashikoi houhou da.〕' },
        { q: '「{懸命|けんめい}に」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{選手|せんしゅ}たちは{最後|さいご}まで{懸命|けんめい}に{走|はし}った。', '{彼|かれ}は{懸命|けんめい}に{頭|あたま}がいい。', '{懸命|けんめい}にこの{店|みせ}は{高|たか}い。', '{懸命|けんめい}に{雨|あめ}がやんだ。'], correct: 0, why: '**{懸命|けんめい}に＋động từ** = dốc sức làm. "Sáng suốt" là {賢明|けんめい} (đồng âm). 〔Saigo made kenmei ni hashitta.〕' },
        { q: '「{名付|なづ}ける」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{星|ほし}を{見|み}つけた{人|ひと}が、その{星|ほし}に{自分|じぶん}の{名前|なまえ}を{名付|なづ}けた。', '{先生|せんせい}に{名付|なづ}けて{質問|しつもん}した。', '{名付|なづ}けたので、{手紙|てがみ}が{届|とど}いた。', '{友達|ともだち}を{名付|なづ}けて{遊|あそ}びに{行|い}った。'], correct: 0, why: '**～に{名前|なまえ}を{名付|なづ}ける／AをBと{名付|なづ}ける** = đặt tên. 〔Sono hoshi ni jibun no namae o nazuketa.〕' },
        { q: '「{密接|みっせつ}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{言葉|ことば}と{文化|ぶんか}は{密接|みっせつ}に{結|むす}びついている。', '{密接|みっせつ}な{料理|りょうり}を{作|つく}った。', '{今日|きょう}は{密接|みっせつ}に{寒|さむ}い。', '{電車|でんしゃ}が{密接|みっせつ}に{遅|おく}れた。'], correct: 0, why: '**{密接|みっせつ}に{結|むす}びつく／{密接|みっせつ}な{関係|かんけい}** — chỉ dùng cho quan hệ. 〔Kotoba to bunka wa missetsu ni musubitsuite iru.〕' },
      ]),
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b48-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N2 — ～ばかりに（～たいばかりに）· ～ことから（↔ ～のことだから）· ～だけに（＋ ～だけあって・～だけの）· ～ものだから／もんだから + 4 bảng phân biệt',
  goal: 'Nối đúng mọi loại từ vào bốn mẫu (V普通形・イAい・ナAな／である・Nである／Nな); dùng ～ばかりに khi một nguyên nhân (thường nhỏ) dẫn tới hậu quả XẤU và người nói tiếc nuối, ～たいばかりに khi vì quá muốn mà làm điều vất vả; dùng ～ことから để suy luận từ căn cứ và giải thích nguồn gốc tên gọi, phân biệt với Nのことだから (đoán theo tính cách quen thuộc); dùng ～だけに cho "chính vì… nên càng…" (cả tốt lẫn xấu, nhất là cảm xúc), ～だけあって cho lời khen "đúng là… có khác", ～だけの N cho "tương xứng / hết mức"; dùng ～ものだから／もんだから／ものですから để nói lý do cá nhân (biện minh) và biết khi nào KHÔNG được dùng (vế sau mệnh lệnh / nhờ vả, báo cáo chính thức); chọn đúng giữa ばかりに・せいで・おかげで・ため・ものだから, ことから・ことだから, だけに・だけあって・わりに, ものだから・ものの・ものだ trong đề JLPT N2.',
  minutes: 90,
  blocks: [
    {
      t: 'p',
      text: 'Bốn mẫu của Bài 48 đều nói **NGUYÊN NHÂN → KẾT QUẢ**, nhưng mỗi mẫu mang một **thái độ** của người nói: **～ばかりに** — "**chỉ vì**… mà ra nông nỗi" (tiếc nuối) · **～ことから** — "**từ việc**… mà suy ra / mà có tên" (khách quan, văn viết) · **～だけに** — "**chính vì**… nên **càng**…" (nhấn mức độ) · **～ものだから** — "**tại vì**… nên (tôi đã…)" (biện minh cá nhân). Ở N3 (Bài 27) bạn chỉ cần biết nguyên nhân **tốt hay xấu** (おかげで／せいで); ở N2 đề thi hỏi **ai nói, nói với ai, mang cảm xúc gì** — vì thế bốn bảng ⑤–⑧ quan trọng không kém bốn mẫu.',
    },
    {
      t: 'table',
      caption: 'Bản đồ Bài 48',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', 'V普通形・イAい・ナAな／である・Nである ＋ ばかりに · Vたい ＋ ばかりに', 'chỉ vì… mà (hậu quả xấu) · chỉ vì muốn… mà', '{一言|ひとこと}{言|い}ったばかりに · {会|あ}いたいばかりに', 'N2 (Bài 27: nhận ra)'],
        ['②', '普通形 (ナAな／である・Nである) ＋ ことから', 'từ việc… (suy ra) · vì… nên mới có tên', '{形|かたち}が{似|に}ていることから', 'N2 (Bài 27: nhận ra)'],
        ['③', '普通形 (ナAな／である・N／Nである) ＋ だけに · ＋ だけあって · ～だけの N', 'chính vì… nên càng · đúng là… có khác · tương xứng', '{期待|きたい}していただけに · プロだけあって', 'N2'],
        ['④', '普通形 (ナAな・Nな) ＋ ものだから／もんだから（ものですから）', 'tại vì… nên (lý do cá nhân, biện minh)', '{道|みち}が{混|こ}んでいたものですから', 'N2 (Bài 32: nhận ra)'],
        ['⑤', 'BẢNG — ばかりに ↔ せいで ↔ おかげで ↔ ため ↔ ものだから ↔ から／ので', 'bức tranh "nguyên nhân" đủ màu', '—', 'N3–N2'],
        ['⑥', 'BẢNG — ことから ↔ Nのことだから ↔ から', 'căn cứ khách quan hay tính cách quen thuộc?', '—', 'N2'],
        ['⑦', 'BẢNG — だけに ↔ だけあって ↔ だけのことはある ↔ だけの N ↔ わりに (Bài 43)', 'họ "だけ"', '—', 'N2'],
        ['⑧', 'BẢNG — ものだから ↔ ものの (Bài 28) ↔ ものだ (Bài 32) ↔ もの／もん cuối câu', 'họ "もの"', '—', 'N3–N2'],
      ],
    },

    /* ══════ ① ばかりに ══════ */
    { t: 'h', text: '① ～ばかりに — "Chỉ vì… mà (ra nông nỗi)" · ～たいばかりに — "Chỉ vì muốn…"' },
    {
      t: 'p',
      text: '**普通形 ＋ ばかりに** nghĩa là "**chỉ vì (một nguyên nhân ấy) mà** dẫn tới một kết quả **XẤU, không mong muốn**". Người nói thường **tiếc nuối, hối hận** ("giá mà không…"), và nguyên nhân thường **nhỏ / chỉ một chuyện** so với hậu quả lớn — nên hay đi với **たった・ちょっと・一言・一度・うっかり**; vế sau hay kết bằng **～てしまった**. Dạng đặc biệt **Vたい ＋ ばかりに** = "**chỉ vì quá muốn…** (nên đã làm một việc vất vả / quá mức / dại dột)" — vế sau là **hành động bất chấp** để đạt mong muốn, không nhất thiết là hậu quả xấu. Bạn đã **nhận ra** ばかりに ở **Bài 27** (bảng ⑨); ở N2 phải dùng được và phân biệt với **せいで** (bảng ⑤).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ばかりに (giống cách nối của thể thường + danh từ)',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ', 'V普通形 ＋ ばかりに (hay dùng Vた／Vない)', '{一言|ひとこと}{言|い}ったばかりに · {知|し}らなかったばかりに', 'hitokoto itta bakari ni · shiranakatta bakari ni'],
        ['Tính từ い', 'イAい ＋ ばかりに', '{背|せ}が{高|たか}いばかりに', 'se ga takai bakari ni'],
        ['Tính từ な', 'ナAな／ナAである ＋ ばかりに', '{正直|しょうじき}なばかりに · {不器用|ぶきよう}であるばかりに', 'shoujiki na bakari ni · bukiyou de aru bakari ni'],
        ['Danh từ', 'Nである ＋ ばかりに (KHÔNG nối thẳng N)', '{外国人|がいこくじん}であるばかりに · {新人|しんじん}だったばかりに', 'gaikokujin de aru bakari ni · shinjin datta bakari ni'],
        ['Mong muốn', 'Vます ＋ たい ＋ ばかりに', '{会|あ}いたいばかりに · {勝|か}ちたいばかりに', 'aitai bakari ni · kachitai bakari ni'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '普通形 ＋ ばかりに、（hậu quả xấu）～てしまった',
          vi: '**(1) Chỉ vì… mà** — nguyên nhân (thường nhỏ, hoặc là một đặc điểm không thay đổi được) dẫn tới chuyện **không mong muốn**. Giọng **tiếc nuối**, nhiều khi **tự trách**. Vế sau là **sự thật đã / đang xảy ra**, KHÔNG phải ý chí, mệnh lệnh.',
          examples: [
            E('パスワードを{一度|いちど}{間違|まちが}えたばかりに、アカウントがロックされてしまった。', 'Pasuwaado o ichido machigaeta bakari ni, akaunto ga rokku sarete shimatta.', 'Chỉ vì nhập sai mật khẩu một lần mà tài khoản bị khoá mất.'),
            E('{余計|よけい}なことを{言|い}ったばかりに、{友達|ともだち}を{怒|おこ}らせてしまった。', 'Yokei na koto o itta bakari ni, tomodachi o okorasete shimatta.', 'Chỉ vì nói điều thừa thãi mà làm bạn giận.'),
            E('{地図|ちず}をよく{見|み}なかったばかりに、{反対|はんたい}{方向|ほうこう}の{電車|でんしゃ}に{乗|の}ってしまった。', 'Chizu o yoku minakatta bakari ni, hantai houkou no densha ni notte shimatta.', 'Chỉ vì không xem kỹ bản đồ mà lên nhầm tàu đi ngược hướng.'),
            E('{背|せ}が{高|たか}いばかりに、{写真|しゃしん}を{撮|と}る{時|とき}はいつも{後|うし}ろに{立|た}たされる。', 'Se ga takai bakari ni, shashin o toru toki wa itsumo ushiro ni tatasareru.', 'Chỉ vì cao mà lần nào chụp ảnh cũng bị bắt đứng sau.'),
            E('{日本語|にほんご}が{分|わ}からなかったばかりに、{大事|だいじ}な{連絡|れんらく}を{見落|みお}としてしまった。', 'Nihongo ga wakaranakatta bakari ni, daiji na renraku o miotoshite shimatta.', 'Chỉ vì không hiểu tiếng Nhật mà bỏ sót một thông báo quan trọng.'),
            E('{新人|しんじん}であるばかりに、{会議|かいぎ}で{意見|いけん}を{言|い}わせてもらえなかった。', 'Shinjin de aru bakari ni, kaigi de iken o iwasete moraenakatta.', 'Chỉ vì là người mới mà không được phát biểu ý kiến trong cuộc họp.'),
          ],
        },
        {
          formula: 'Vたい ＋ ばかりに、（hành động vất vả / quá mức）',
          vi: '**(2) Chỉ vì quá muốn…** — mong muốn mạnh tới mức người đó **làm một việc khác thường** (chịu khổ, bỏ tiền, nói dối…). Vế sau là **hành động của chính người có mong muốn**. Dùng nhiều để kể chuyện người khác hoặc chuyện của mình ngày xưa.',
          examples: [
            E('{好|す}きな{歌手|かしゅ}に{会|あ}いたいばかりに、{雨|あめ}の{中|なか}を{三時間|さんじかん}も{並|なら}んだ。', 'Suki na kashu ni aitai bakari ni, ame no naka o sanjikan mo naranda.', 'Chỉ vì muốn gặp ca sĩ mình thích mà xếp hàng dưới mưa tận ba tiếng.'),
            E('{試合|しあい}に{出|で}たいばかりに、けがをしたことを{監督|かんとく}に{隠|かく}していた。', 'Shiai ni detai bakari ni, kega o shita koto o kantoku ni kakushite ita.', 'Chỉ vì muốn được ra sân mà giấu huấn luyện viên chuyện mình bị thương.'),
            E('{親|おや}に{褒|ほ}められたいばかりに、{毎晩|まいばん}{遅|おそ}くまで{勉強|べんきょう}していた。', 'Oya ni homeraretai bakari ni, maiban osoku made benkyou shite ita.', 'Chỉ vì muốn được bố mẹ khen mà tối nào cũng học tới khuya.'),
            E('{見栄|みえ}を{張|は}りたいばかりに、{払|はら}えないほど{高|たか}い{車|くるま}を{買|か}ってしまった。', 'Mie o haritai bakari ni, haraenai hodo takai kuruma o katte shimatta.', 'Chỉ vì muốn sĩ diện mà mua chiếc xe đắt tới mức trả không nổi.'),
            E('{早|はや}く{帰|かえ}りたいばかりに、{確認|かくにん}を{省|はぶ}いてしまった。', 'Hayaku kaeritai bakari ni, kakunin o habuite shimatta.', 'Chỉ vì muốn về sớm mà bỏ qua khâu kiểm tra.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ばかりに',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'マリヤム、{元気|げんき}ないね。どうしたの？', ro: 'Mariyamu, genki nai ne. Dou shita no?', vi: 'Mariam, trông cậu ỉu xìu thế. Sao vậy?' },
        { who: 'マリヤム', role: 'a', text: 'レポートのファイル、{保存|ほぞん}しないでパソコンを{閉|と}じちゃったの。{一回|いっかい}{保存|ほぞん}を{忘|わす}れたばかりに、{三時間分|さんじかんぶん}が{全部|ぜんぶ}{消|き}えちゃった。', ro: 'Repooto no fairu, hozon shinaide pasokon o tojichatta no. Ikkai hozon o wasureta bakari ni, sanjikanbun ga zenbu kiechatta.', vi: 'Tớ gập máy mà chưa lưu file báo cáo. Chỉ vì quên lưu một lần mà mất sạch công ba tiếng.' },
        { who: 'ダニエル', role: 'b', text: 'うわ、それはつらいね。どうしてそんなに{急|いそ}いでたの？', ro: 'Uwa, sore wa tsurai ne. Doushite sonna ni isoideta no?', vi: 'Trời, khổ thật. Sao lúc đó cậu vội thế?' },
        { who: 'マリヤム', role: 'a', text: 'セールの{初日|しょにち}だったから、{早|はや}く{店|みせ}に{行|い}きたいばかりに、{確認|かくにん}もしないで{閉|と}じちゃったんだ。', ro: 'Seeru no shonichi datta kara, hayaku mise ni ikitai bakari ni, kakunin mo shinaide tojichatta n da.', vi: 'Hôm đó là ngày đầu đợt giảm giá, chỉ vì muốn ra cửa hàng sớm mà tớ gập máy luôn chẳng kiểm tra gì.' },
        { who: 'ダニエル', role: 'b', text: '{次|つぎ}からは{自動保存|じどうほぞん}を{設定|せってい}しておこうよ。{手伝|てつだ}うから。', ro: 'Tsugi kara wa jidou hozon o settei shite okou yo. Tetsudau kara.', vi: 'Lần sau cài sẵn chế độ tự lưu đi. Tớ giúp cho.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — 普通形 ＋ ばかりに',
      head: ['Nguyên nhân', 'Dạng ～ばかりに', 'Câu', 'Romaji'],
      rows: [
        ['{寝坊|ねぼう}した', '{寝坊|ねぼう}したばかりに', '{寝坊|ねぼう}したばかりに、{試験|しけん}に{間|ま}に{合|あ}わなかった。', 'Nebou shita bakari ni, shiken ni ma ni awanakatta.'],
        ['{口|くち}を{滑|すべ}らせた', '{口|くち}を{滑|すべ}らせたばかりに', 'うっかり{口|くち}を{滑|すべ}らせたばかりに、{秘密|ひみつ}がばれた。', 'Ukkari kuchi o suberaseta bakari ni, himitsu ga bareta.'],
        ['{確認|かくにん}しなかった', '{確認|かくにん}しなかったばかりに', '{日付|ひづけ}を{確認|かくにん}しなかったばかりに、{予約|よやく}を{間違|まちが}えた。', 'Hizuke o kakunin shinakatta bakari ni, yoyaku o machigaeta.'],
        ['{正直|しょうじき}だ', '{正直|しょうじき}なばかりに', '{正直|しょうじき}なばかりに、{損|そん}をすることもある。', 'Shoujiki na bakari ni, son o suru koto mo aru.'],
        ['{留学生|りゅうがくせい}だ', '{留学生|りゅうがくせい}であるばかりに', '{留学生|りゅうがくせい}であるばかりに、アパートを{断|ことわ}られた。', 'Ryuugakusei de aru bakari ni, apaato o kotowarareta.'],
        ['{勝|か}ちたい', '{勝|か}ちたいばかりに', '{勝|か}ちたいばかりに、{無理|むり}な{練習|れんしゅう}を{続|つづ}けた。', 'Kachitai bakari ni, muri na renshuu o tsuzuketa.'],
      ],
    },
    { t: 'rule', formula: 'V普通形・イAい・ナAな／である・Nである ＋ ばかりに · Vたい ＋ ばかりに', vi: 'Chỉ vì (một nguyên nhân, thường nhỏ) mà dẫn tới hậu quả XẤU — người nói tiếc nuối; Vたいばかりに: chỉ vì quá muốn mà làm điều vất vả, quá mức. Vế sau là sự việc, không phải ý chí / mệnh lệnh / nhờ vả.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ばかりに (sai → đúng)',
      items: [
        '**Dùng cho kết quả TỐT**: ~~よく{勉強|べんきょう}したばかりに、{合格|ごうかく}できた~~ → **よく{勉強|べんきょう}したおかげで、{合格|ごうかく}できた** (Bài 27). ばかりに (trừ たいばかりに) gần như luôn đi với kết quả xấu.',
        '**Vế sau là ý chí / mệnh lệnh**: ~~{雨|あめ}が{降|ふ}ったばかりに、{家|いえ}にいよう~~ → **{雨|あめ}が{降|ふ}ったので、{家|いえ}にいよう**. ばかりに kể lại hậu quả **đã xảy ra**.',
        '**Danh từ nối thẳng**: ~~{子|こ}どもばかりに~~ (thành "chỉ toàn trẻ con") → **{子|こ}どもであるばかりに**. Chú ý: **Nばかり** (Bài 22) = "toàn là N" — một mẫu KHÁC: {甘|あま}い{物|もの}ばかり{食|た}べる.',
        '**Nhầm với Vたばかり (vừa mới — Bài 22)**: **{買|か}ったばかりなのに、{壊|こわ}れた** (vừa mới mua mà đã hỏng) ≠ **{安|やす}い{物|もの}を{買|か}ったばかりに、すぐ{壊|こわ}れた** (chỉ vì mua đồ rẻ mà nhanh hỏng). Đề N2 hay đặt cả hai trong 4 lựa chọn — nhìn xem vế trước nói "**vừa mới**" hay "**chỉ vì**".',
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhận ra ～ばかりに trong bài đọc, bài nghe',
      items: [
        'Thấy **たった・ほんの・ちょっと・一言・一度・うっかり** ở vế trước + **～てしまった・～なくなった・～された** ở vế sau ⇒ gần như chắc chắn là ばかりに "tiếc nuối".',
        'Câu hỏi đề đọc kiểu 「{筆者|ひっしゃ}はなぜ{後悔|こうかい}しているのか」 thường lấy đáp án từ **vế TRƯỚC ばかりに**.',
        'Mức độ "đổ lỗi": **せいで** chỉ thẳng vào nguyên nhân (thường là người khác: {彼|かれ}のせいで); **ばかりに** nghiêng về **tiếc nuối hoàn cảnh / lỗi nhỏ của mình** — nghe mềm hơn, "văn chương" hơn.',
      ],
    },

    /* ══════ ② ことから ══════ */
    { t: 'h', text: '② ～ことから — "Từ việc… (mà suy ra)" · "Vì… nên mới có tên…"' },
    {
      t: 'p',
      text: '**普通形 ＋ ことから** nghĩa là "**xuất phát từ việc / sự thật là…**". Có ba cách dùng, đều là **văn viết, giọng khách quan** (bài báo, bảng giới thiệu, sách, bản tin): **(1) CĂN CỨ để phán đoán** — "từ việc… có thể suy ra…": vế sau hay là **～と{考|かんが}えられる・～と{分|わ}かる・～と{見|み}られている・～ようだ** · **(2) NGUỒN GỐC TÊN GỌI** — "vì… nên mới được gọi / đặt tên là…": vế sau là **～と{呼|よ}ばれる・～と{名付|なづ}けられた・～という{名|な}がついた** · **(3) NGUYÊN NHÂN / KHỞI ĐẦU** của một sự việc (tin tức): "do… nên…". Bạn đã **nhận ra** ことから ở **Bài 27**. Đừng nhầm với **Nのことだから** — trông gần giống nhưng nghĩa khác hẳn (bảng ⑥).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ことから',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ', 'V普通形 ＋ ことから', '{見|み}えることから · {降|ふ}ったことから · {来|こ}ないことから', 'mieru koto kara · futta koto kara · konai koto kara'],
        ['Tính từ い', 'イAい ＋ ことから', '{多|おお}いことから · {少|すく}なかったことから', 'ooi koto kara · sukunakatta koto kara'],
        ['Tính từ な', 'ナAな／ナAである ＋ ことから', '{有名|ゆうめい}なことから · {有名|ゆうめい}であることから', 'yuumei na koto kara · yuumei de aru koto kara'],
        ['Danh từ', 'Nである ＋ ことから (Nだった → Nだったことから)', '{港町|みなとまち}であることから · {漁師|りょうし}の{町|まち}だったことから', 'minatomachi de aru koto kara · ryoushi no machi datta koto kara'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '普通形 ＋ ことから、～と{考|かんが}えられる／{分|わ}かる',
          vi: '**(1) Căn cứ để phán đoán** — vế trước là **dấu hiệu, sự thật quan sát được**; vế sau là **kết luận rút ra**. Giọng của thám tử, nhà nghiên cứu, bản tin ("警察は～と見て調べている").',
          examples: [
            E('{道|みち}がぬれていることから、{夜中|よなか}に{雨|あめ}が{降|ふ}ったと{分|わ}かる。', 'Michi ga nurete iru koto kara, yonaka ni ame ga futta to wakaru.', 'Từ việc đường ướt, có thể biết là nửa đêm trời đã mưa.'),
            E('{窓|まど}のかぎが{壊|こわ}されていたことから、{犯人|はんにん}は{窓|まど}から{入|はい}ったと{見|み}られている。', 'Mado no kagi ga kowasarete ita koto kara, hannin wa mado kara haitta to mirarete iru.', 'Từ việc khoá cửa sổ bị phá, người ta cho rằng thủ phạm vào từ cửa sổ.'),
            E('{同|おな}じ{質問|しつもん}が{何度|なんど}も{来|き}ていることから、{説明|せつめい}が{分|わ}かりにくいのだと{考|かんが}えられる。', 'Onaji shitsumon ga nando mo kite iru koto kara, setsumei ga wakarinikui no da to kangaerareru.', 'Từ việc cùng một câu hỏi được gửi tới nhiều lần, có thể nghĩ là phần giải thích khó hiểu.'),
            E('{言葉|ことば}がよく{似|に}ていることから、{二|ふた}つの{国|くに}の{人々|ひとびと}は{昔|むかし}{交流|こうりゅう}があったと{言|い}われている。', 'Kotoba ga yoku nite iru koto kara, futatsu no kuni no hitobito wa mukashi kouryuu ga atta to iwarete iru.', 'Vì ngôn ngữ rất giống nhau nên người ta cho rằng người dân hai nước xưa từng giao lưu.'),
          ],
        },
        {
          formula: '普通形 ＋ ことから、「～」と{呼|よ}ばれる／{名付|なづ}けられた',
          vi: '**(2) Nguồn gốc tên gọi** — vế trước là **đặc điểm** (hình dáng, màu, nơi chốn, sự kiện), vế sau là **cái tên**. Đây là cách dùng gặp NHIỀU NHẤT trong bài đọc về địa danh, món ăn, con vật, sản phẩm.',
          examples: [
            E('{坂|さか}の{上|うえ}から{海|うみ}が{見|み}えたことから、「{浜見坂|はまみざか}」と{呼|よ}ばれるようになった。', 'Saka no ue kara umi ga mieta koto kara, "Hamamizaka" to yobareru you ni natta.', 'Vì từ đỉnh dốc nhìn thấy biển nên được gọi là "dốc Hamami".'),
            E('{形|かたち}が{富士山|ふじさん}に{似|に}ていることから、この{山|やま}は「{津軽富士|つがるふじ}」と{呼|よ}ばれている。', 'Katachi ga Fujisan ni nite iru koto kara, kono yama wa "Tsugaru Fuji" to yobarete iru.', 'Vì hình dáng giống núi Phú Sĩ nên ngọn núi này được gọi là "Phú Sĩ của Tsugaru".'),
            E('{実|み}の{形|かたち}が{星|ほし}に{見|み}えることから、「スターフルーツ」と{名付|なづ}けられた。', 'Mi no katachi ga hoshi ni mieru koto kara, "sutaa furuutsu" to nazukerareta.', 'Vì quả trông như ngôi sao nên được đặt tên là "star fruit" (khế).'),
            E('{焼|や}く{時|とき}にジュージューと{音|おと}がすることから、この{料理|りょうり}の{名前|なまえ}がついたそうだ。', 'Yaku toki ni juujuu to oto ga suru koto kara, kono ryouri no namae ga tsuita sou da.', 'Nghe nói món này có tên như vậy là vì khi nướng phát ra tiếng xèo xèo.'),
            E('いつも{笑|わら}っているように{見|み}えることから、この{店|みせ}の{店長|てんちょう}は「にこにこさん」という{愛称|あいしょう}で{呼|よ}ばれている。', 'Itsumo waratte iru you ni mieru koto kara, kono mise no tenchou wa "Nikoniko-san" to iu aishou de yobarete iru.', 'Vì lúc nào trông cũng như đang cười nên ông chủ quán này được gọi bằng biệt danh "Bác Tươi Cười".'),
          ],
        },
        {
          formula: '普通形 ＋ ことから、（kết quả, thay đổi）',
          vi: '**(3) Nguyên nhân / khởi đầu** — "do việc… nên dẫn tới…" — văn tin tức, báo cáo. Gần với **ため・ことがきっかけで**, nhưng ことから nhấn "**xuất phát điểm** của chuỗi sự việc".',
          examples: [
            E('{駅前|えきまえ}に{大学|だいがく}ができたことから、{町|まち}に{若者|わかもの}が{増|ふ}えた。', 'Ekimae ni daigaku ga dekita koto kara, machi ni wakamono ga fueta.', 'Do có trường đại học mở trước ga nên người trẻ trong thị trấn tăng lên.'),
            E('{小|ちい}さな{誤解|ごかい}があったことから、{二人|ふたり}の{関係|かんけい}が{悪|わる}くなった。', 'Chiisana gokai ga atta koto kara, futari no kankei ga waruku natta.', 'Từ một hiểu lầm nhỏ mà quan hệ hai người trở nên xấu đi.'),
            E('{手順書|てじゅんしょ}に{不備|ふび}があったことから、{同|おな}じミスが{繰|く}り{返|かえ}された。', 'Tejunsho ni fubi ga atta koto kara, onaji misu ga kurikaesareta.', 'Do bản quy trình có thiếu sót nên cùng một lỗi bị lặp lại.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ことから',
      lines: [
        { who: 'マリヤム', role: 'a', text: '{大野|おおの}さん、「{桜|さくら}が{丘|おか}」の{名前|なまえ}は、どうしてついたんですか。', ro: 'Oono-san, "Sakuragaoka" no namae wa, doushite tsuita n desu ka.', vi: 'Bác Ono, cái tên "Sakuragaoka" từ đâu mà có ạ?' },
        { who: '{大野|おおの}', role: 'examiner', text: '{昔|むかし}から{丘|おか}に{桜|さくら}の{木|き}が{多|おお}かったことから、そう{名付|なづ}けられたんですよ。', ro: 'Mukashi kara oka ni sakura no ki ga ookatta koto kara, sou nazukerareta n desu yo.', vi: 'Vì từ xưa trên đồi đã có nhiều cây anh đào nên mới được đặt tên như vậy.' },
        { who: 'マリヤム', role: 'a', text: 'じゃあ、この{辺|あた}りに「{谷|たに}」がつく{地名|ちめい}が{多|おお}いのは？', ro: 'Jaa, kono atari ni "tani" ga tsuku chimei ga ooi no wa?', vi: 'Thế còn việc khu này có nhiều địa danh mang chữ "Tani" thì sao ạ?' },
        { who: '{大野|おおの}', role: 'examiner', text: '{丘|おか}と{丘|おか}の{間|あいだ}に{低|ひく}い{土地|とち}が{多|おお}いことから、そういう{名前|なまえ}が{増|ふ}えたと{考|かんが}えられています。', ro: 'Oka to oka no aida ni hikui tochi ga ooi koto kara, sou iu namae ga fueta to kangaerarete imasu.', vi: 'Người ta cho rằng vì giữa các ngọn đồi có nhiều vùng đất trũng nên những cái tên như thế mới nhiều lên.' },
        { who: 'マリヤム', role: 'a', text: '{地名|ちめい}を{見|み}れば、{昔|むかし}の{地形|ちけい}が{分|わ}かるんですね。', ro: 'Chimei o mireba, mukashi no chikei ga wakaru n desu ne.', vi: 'Vậy nhìn địa danh là biết được địa hình ngày xưa nhỉ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — 普通形 ＋ ことから',
      head: ['Căn cứ / đặc điểm', 'Dạng ～ことから', 'Câu', 'Romaji'],
      rows: [
        ['{部屋|へや}の{電気|でんき}がついている', 'ついていることから', '{部屋|へや}の{電気|でんき}がついていることから、{彼|かれ}はまだ{起|お}きているようだ。', 'Heya no denki ga tsuite iru koto kara, kare wa mada okite iru you da.'],
        ['{足跡|あしあと}が{小|ちい}さい', '{小|ちい}さいことから', '{足跡|あしあと}が{小|ちい}さいことから、{子|こ}どもだと{考|かんが}えられる。', 'Ashiato ga chiisai koto kara, kodomo da to kangaerareru.'],
        ['{形|かたち}が{三日月|みかづき}に{似|に}ている', '{似|に}ていることから', '{形|かたち}が{三日月|みかづき}に{似|に}ていることから、「{三日月湖|みかづきこ}」と{呼|よ}ばれる。', 'Katachi ga mikazuki ni nite iru koto kara, "mikazukiko" to yobareru.'],
        ['{湾|わん}が{穏|おだ}やかだ', '{穏|おだ}やかなことから', '{湾|わん}の{波|なみ}が{穏|おだ}やかなことから、{昔|むかし}から{港|みなと}として{栄|さか}えた。', 'Wan no nami ga odayaka na koto kara, mukashi kara minato to shite sakaeta.'],
        ['{城下町|じょうかまち}だった', '{城下町|じょうかまち}だったことから', '{城下町|じょうかまち}だったことから、{今|いま}も{古|ふる}い{道|みち}が{残|のこ}っている。', 'Joukamachi datta koto kara, ima mo furui michi ga nokotte iru.'],
      ],
    },
    { t: 'rule', formula: 'V普通形・イAい・ナAな／である・Nである ＋ ことから', vi: 'Từ việc / sự thật… (1) suy ra một phán đoán, (2) giải thích nguồn gốc tên gọi, (3) dẫn tới một kết quả. Văn viết, khách quan. Vế sau là phán đoán hoặc sự thật — không dùng cho ý chí, mệnh lệnh.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ことから (sai → đúng)',
      items: [
        '**Dùng cho lý do của hành động có ý chí**: ~~{雨|あめ}が{降|ふ}っていることから、{傘|かさ}を{持|も}っていこう~~ → **{雨|あめ}が{降|ふ}っているから、{傘|かさ}を{持|も}っていこう**. ことから không đi với rủ rê, mệnh lệnh, ý định.',
        '**Nối thẳng danh từ**: ~~{港町|みなとまち}ことから~~ / ~~{港町|みなとまち}のことから~~ → **{港町|みなとまち}であることから**. ("Nのことから" có tồn tại nhưng là nghĩa khác: "từ chuyện về N").',
        '**Nhầm với Nのことだから**: ~~{真面目|まじめ}な{彼|かれ}のことから、{遅刻|ちこく}しないだろう~~ → **{真面目|まじめ}な{彼|かれ}のことだから、{遅刻|ちこく}しないだろう** (đoán theo tính cách người quen — bảng ⑥).',
        '**Dùng trong hội thoại thân mật**: ~~{電気|でんき}がついてることから、まだ{起|お}きてるよ~~ (nghe như đọc báo) → **{電気|でんき}がついてるから、まだ{起|お}きてるよ**. ことから hợp với bài viết, bài thuyết trình, lời hướng dẫn viên.',
      ],
    },

    /* ══════ ③ だけに ══════ */
    { t: 'h', text: '③ ～だけに — "Chính vì… nên (càng)…" · ～だけあって — "Đúng là… có khác" · ～だけの N' },
    {
      t: 'p',
      text: '**普通形 ＋ だけに** nghĩa là "**chính vì** (có điều kiện / đặc điểm đặc biệt ấy) **nên** (kết quả, cảm xúc) **càng**… / quả nhiên…". Người nói thấy kết quả **tương xứng, tự nhiên** với điều kiện — và mức độ **cao hơn bình thường**. Hai cách dùng chính: **(1) cảm xúc mạnh hơn vì điều kiện đặc biệt** — **{期待|きたい}していただけに、がっかりした** (chính vì kỳ vọng nên càng thất vọng) — vế sau có thể là chuyện **xấu, trái mong đợi** · **(2) kết quả đúng như điều kiện cho phép** — **ベテランだけに、{仕事|しごと}が{早|はや}い** — lúc này gần nghĩa với **～だけあって**. Cùng họ: **～だけあって** (chỉ dùng để KHEN, "đúng là… có khác"), **～だけのことはある** (cuối câu, "quả không hổ danh"), **～だけの N** ("tương xứng với…" / "hết mức"). Bài 43 (～わりに) đã hẹn học họ này ở đây — bảng ⑦ đặt chúng cạnh nhau.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～だけに／～だけあって (giống nhau)',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ', 'V普通形 ＋ だけに／だけあって', '{練習|れんしゅう}しただけに · {長年|ながねん}{住|す}んでいるだけあって', 'renshuu shita dake ni · naganen sunde iru dake atte'],
        ['Tính từ い', 'イAい ＋ だけに／だけあって', '{高|たか}いだけに · {高|たか}いだけあって', 'takai dake ni · takai dake atte'],
        ['Tính từ な', 'ナAな／ナAである ＋ だけに／だけあって', '{有名|ゆうめい}なだけに · {有名|ゆうめい}なだけあって', 'yuumei na dake ni · yuumei na dake atte'],
        ['Danh từ', 'N／Nである ＋ だけに／だけあって (nối thẳng được)', 'プロだけに · {老舗|しにせ}だけあって · {取引先|とりひきさき}であるだけに', 'puro dake ni · shinise dake atte · torihikisaki de aru dake ni'],
        ['だけの N', 'V辞書形／Vた ＋ だけの N · できる／ある ＋ だけの N', '{行|い}くだけの{価値|かち} · {努力|どりょく}しただけの{結果|けっか} · できるだけのこと', 'iku dake no kachi · doryoku shita dake no kekka · dekiru dake no koto'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '普通形 ＋ だけに、（cảm xúc / kết quả mạnh hơn thường）',
          vi: '**(1) Chính vì… nên càng…** — điều kiện ở vế trước (kỳ vọng, công sức, tầm quan trọng, sự hiếm có) làm cho **cảm xúc / kết quả** ở vế sau **mạnh hơn bình thường**. Vế sau **tốt hay xấu đều được** — và đây là chỗ だけに khác だけあって.',
          examples: [
            E('{期待|きたい}していただけに、{負|ま}けた{時|とき}のショックは{大|おお}きかった。', 'Kitai shite ita dake ni, maketa toki no shokku wa ookikatta.', 'Chính vì đã kỳ vọng nên cú sốc khi thua càng lớn.'),
            E('{一生懸命|いっしょうけんめい}{準備|じゅんび}しただけに、{合格|ごうかく}の{知|し}らせを{聞|き}いて{泣|な}いてしまった。', 'Isshoukenmei junbi shita dake ni, goukaku no shirase o kiite naite shimatta.', 'Chính vì đã dốc sức chuẩn bị nên nghe tin đỗ tôi đã bật khóc.'),
            E('{大切|たいせつ}な{取引先|とりひきさき}だけに、{今回|こんかい}のミスは{許|ゆる}されない。', 'Taisetsu na torihikisaki dake ni, konkai no misu wa yurusarenai.', 'Chính vì là khách hàng quan trọng nên lỗi lần này không thể được bỏ qua.'),
            E('{人気|にんき}の{店|みせ}だっただけに、{閉店|へいてん}のニュースは{町|まち}の{人|ひと}を{驚|おどろ}かせた。', 'Ninki no mise datta dake ni, heiten no nyuusu wa machi no hito o odorokaseta.', 'Chính vì là quán nổi tiếng nên tin đóng cửa làm người trong phố bất ngờ.'),
            E('{十年|じゅうねん}ぶりの{再会|さいかい}だっただけに、{話|はなし}が{尽|つ}きなかった。', 'Juunenburi no saikai datta dake ni, hanashi ga tsukinakatta.', 'Chính vì mười năm mới gặp lại nên chuyện kể mãi không hết.'),
            E('{若|わか}いだけに、{回復|かいふく}が{早|はや}い。', 'Wakai dake ni, kaifuku ga hayai.', 'Chính vì còn trẻ nên hồi phục nhanh.'),
          ],
        },
        {
          formula: '普通形 ＋ だけあって、（đánh giá TỐT, đúng như mong đợi）',
          vi: '**(2) Đúng là… có khác** — vì có điều kiện / kinh nghiệm / danh tiếng ấy nên kết quả **tốt đúng như mong đợi** → lời **KHEN, công nhận**. Hay đi với **さすが** ở đầu câu. **Không** dùng cho kết quả xấu hay trái mong đợi.',
          examples: [
            E('さすが{老舗|しにせ}だけあって、{味|あじ}が{違|ちが}う。', 'Sasuga shinise dake atte, aji ga chigau.', 'Đúng là tiệm lâu đời có khác, vị khác hẳn.'),
            E('{十年|じゅうねん}も{日本|にほん}に{住|す}んでいるだけあって、{彼|かれ}の{敬語|けいご}は{自然|しぜん}だ。', 'Juunen mo Nihon ni sunde iru dake atte, kare no keigo wa shizen da.', 'Sống ở Nhật tận mười năm có khác, kính ngữ của anh ấy rất tự nhiên.'),
            E('{高|たか}かっただけあって、このかばんは{丈夫|じょうぶ}だ。', 'Takakatta dake atte, kono kaban wa joubu da.', 'Đắt có khác, cái cặp này bền thật.'),
            E('プロの{選手|せんしゅ}だけあって、{動|うご}きが{全然|ぜんぜん}{違|ちが}う。', 'Puro no senshu dake atte, ugoki ga zenzen chigau.', 'Đúng là vận động viên chuyên nghiệp có khác, động tác khác hẳn.'),
            E('{毎日|まいにち}{練習|れんしゅう}しているだけあって、{発音|はつおん}がきれいになった。', 'Mainichi renshuu shite iru dake atte, hatsuon ga kirei ni natta.', 'Ngày nào cũng luyện có khác, phát âm đã đẹp hẳn.'),
          ],
        },
        {
          formula: 'V辞書形／Vた ＋ だけの N · できる／ある ＋ だけの N · ～だけのことはある',
          vi: '**(3) Họ "だけの"** — **(a) tương xứng**: "N xứng với việc V" — **{行|い}くだけの{価値|かち}がある** (đáng để đi), **{努力|どりょく}しただけの{結果|けっか}が{出|で}た** (kết quả xứng với công sức) · **(b) hết mức**: **できるだけのことはした** (đã làm hết những gì có thể), **あるだけのお{金|かね}** (toàn bộ số tiền đang có) · **(c) ～だけのことはある** (cuối câu): "**quả không hổ danh**" — nghĩa như だけあって nhưng đứng cuối câu.',
          examples: [
            E('この{本|ほん}は、{高|たか}くても{買|か}うだけの{価値|かち}がある。', 'Kono hon wa, takakute mo kau dake no kachi ga aru.', 'Cuốn sách này dù đắt cũng đáng mua.'),
            E('{毎日|まいにち}{走|はし}っただけの{結果|けっか}が、マラソンの{記録|きろく}に{出|で}た。', 'Mainichi hashitta dake no kekka ga, marason no kiroku ni deta.', 'Kết quả xứng với việc chạy mỗi ngày đã hiện ra ở thành tích marathon.'),
            E('{結果|けっか}は{残念|ざんねん}だったが、できるだけのことはした。', 'Kekka wa zannen datta ga, dekiru dake no koto wa shita.', 'Kết quả thật đáng tiếc, nhưng tôi đã làm hết những gì có thể.'),
            E('{財布|さいふ}にあるだけのお{金|かね}を{全部|ぜんぶ}{払|はら}った。', 'Saifu ni aru dake no okane o zenbu haratta.', 'Tôi đã trả toàn bộ số tiền có trong ví.'),
            E('この{景色|けしき}は{素晴|すば}らしい。{三時間|さんじかん}かけて{来|き}ただけのことはある。', 'Kono keshiki wa subarashii. Sanjikan kakete kita dake no koto wa aru.', 'Cảnh này tuyệt quá. Bỏ ba tiếng ra đây quả không uổng.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～だけに／～だけあって',
      lines: [
        { who: 'リン', role: 'a', text: 'カルロス、{昨日|きのう}{行|い}ったラーメン{屋|や}、どうだった？', ro: 'Karurosu, kinou itta raamen-ya, dou datta?', vi: 'Carlos, quán mì ramen hôm qua cậu đi thế nào?' },
        { who: 'カルロス', role: 'b', text: 'さすが{本場|ほんば}の{博多|はかた}で{修業|しゅぎょう}した{店長|てんちょう}だけあって、スープが{最高|さいこう}だったよ。', ro: 'Sasuga honba no Hakata de shugyou shita tenchou dake atte, suupu ga saikou datta yo.', vi: 'Đúng là ông chủ từng học nghề ngay tại Hakata chính gốc có khác, nước dùng tuyệt nhất.' },
        { who: 'リン', role: 'a', text: 'いいなあ。{私|わたし}も{先週|せんしゅう}、{話題|わだい}のケーキ{屋|や}に{行|い}ったんだけど……。', ro: 'Ii naa. Watashi mo senshuu, wadai no keeki-ya ni itta n da kedo…….', vi: 'Thích thế. Tuần trước tớ cũng đi tiệm bánh đang hot, nhưng mà…' },
        { who: 'カルロス', role: 'b', text: 'どうだったの？', ro: 'Dou datta no?', vi: 'Thế nào?' },
        { who: 'リン', role: 'a', text: '{一時間|いちじかん}も{並|なら}んだだけに、{普通|ふつう}の{味|あじ}でがっかりしちゃった。', ro: 'Ichijikan mo naranda dake ni, futsuu no aji de gakkari shichatta.', vi: 'Chính vì xếp hàng tận một tiếng nên thấy vị bình thường lại càng thất vọng.' },
        { who: 'カルロス', role: 'b', text: 'それは{残念|ざんねん}だったね。{今度|こんど}、{僕|ぼく}のラーメン{屋|や}に{行|い}こうよ。{並|なら}ぶだけの{価値|かち}はあるから。', ro: 'Sore wa zannen datta ne. Kondo, boku no raamen-ya ni ikou yo. Narabu dake no kachi wa aru kara.', vi: 'Tiếc thật. Lần tới đi quán ramen của tớ đi. Đáng để xếp hàng đấy.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ～だけに・～だけあって・～だけの',
      head: ['Điều kiện', 'Mẫu', 'Câu', 'Romaji'],
      rows: [
        ['{楽|たの}しみにしていた', 'だけに', '{楽|たの}しみにしていただけに、{中止|ちゅうし}は{残念|ざんねん}だ。', 'Tanoshimi ni shite ita dake ni, chuushi wa zannen da.'],
        ['{初|はじ}めての{海外|かいがい}', 'だけに', '{初|はじ}めての{海外|かいがい}だけに、{何|なに}もかも{新鮮|しんせん}だった。', 'Hajimete no kaigai dake ni, nanimo kamo shinsen datta.'],
        ['{名門|めいもん}{大学|だいがく}', 'だけあって', '{名門|めいもん}{大学|だいがく}だけあって、{図書館|としょかん}が{立派|りっぱ}だ。', 'Meimon daigaku dake atte, toshokan ga rippa da.'],
        ['{芸能人|げいのうじん}', 'だけあって', 'さすが{芸能人|げいのうじん}だけあって、{話|はなし}がおもしろい。', 'Sasuga geinoujin dake atte, hanashi ga omoshiroi.'],
        ['{読|よ}む', 'だけの{価値|かち}', 'この{記事|きじ}は{読|よ}むだけの{価値|かち}がある。', 'Kono kiji wa yomu dake no kachi ga aru.'],
        ['できる', 'だけのこと', '{結果|けっか}はどうであれ、できるだけのことはやった。', 'Kekka wa dou de are, dekiru dake no koto wa yatta.'],
      ],
    },
    { t: 'rule', formula: 'V普通形・イAい・ナAな／である・N／Nである ＋ だけに', vi: 'Chính vì (điều kiện đặc biệt) nên kết quả / cảm xúc càng… — tốt hay xấu đều được; hay đi với cảm xúc (残念・悔しい・うれしい・ショック).' },
    { t: 'rule', formula: '普通形 ＋ だけあって ／ ～だけのことはある ／ V＋だけの N', vi: 'だけあって・だけのことはある: đúng là… có khác — CHỈ để khen, kết quả tốt đúng như mong đợi (hay đi với さすが). だけの N: tương xứng với… / hết mức có thể.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～だけに／～だけあって (sai → đúng)',
      items: [
        '**だけあって + kết quả xấu**: ~~{高|たか}いだけあって、すぐ{壊|こわ}れた~~ → **{高|たか}かっただけに、すぐ{壊|こわ}れてがっかりした** (chính vì đắt nên càng thất vọng) hoặc **{高|たか}いわりに、すぐ{壊|こわ}れた** (Bài 43). だけあって chỉ để khen.',
        '**Nhầm だけに với だけ (chỉ)**: **{私|わたし}だけに{教|おし}えてくれた** (chỉ nói cho riêng tôi — だけ + に trợ từ) ≠ **{親友|しんゆう}だけに、{本当|ほんとう}のことを{言|い}えなかった** (chính vì là bạn thân nên không nói được sự thật). Nhìn vế sau: có "**kết quả / cảm xúc**" không, hay chỉ là "**đối tượng**" của động từ?',
        '**Vế trước không có gì "đặc biệt"**: ~~{雨|あめ}だけに、{傘|かさ}を{持|も}っていった~~ (trời mưa thì mang ô là chuyện thường) → **{雨|あめ}なので、{傘|かさ}を{持|も}っていった**. だけに cần vế trước là điều kiện **đáng chú ý** khiến kết quả **mạnh hơn bình thường**.',
        '**だけの + danh từ không hợp**: ~~{行|い}くだけの{店|みせ}がある~~ → **{行|い}くだけの{価値|かち}がある{店|みせ}** · N sau だけの thường là **{価値|かち}・{結果|けっか}・{力|ちから}・{お金|おかね}・{時間|じかん}・こと** — thứ đo được "đủ / tương xứng".',
      ],
    },

    /* ══════ ④ ものだから ══════ */
    { t: 'h', text: '④ ～ものだから／～もんだから（～ものですから）— "Tại vì… nên (tôi đã…)"' },
    {
      t: 'p',
      text: '**普通形 ＋ ものだから** nói **lý do mang tính CÁ NHÂN** của một việc **đã xảy ra** — thường để **giải thích, biện minh** vì sao mình (lỡ) làm gì / không làm được gì: "**tại vì… nên…**". Người nói muốn người nghe **thông cảm** ("không phải tôi cố ý đâu"). Ba mức lịch sự: **もんだから** (văn nói thân mật) · **ものだから** (bình thường) · **ものですから** (lịch sự — rất hay dùng khi xin lỗi người trên: {電車|でんしゃ}が{遅|おく}れたものですから、{遅刻|ちこく}してしまいました). Bạn đã **nhận ra** mẫu này ở **Bài 32** (khi học ～ものだ). Hai giới hạn quan trọng: **vế sau KHÔNG dùng mệnh lệnh, nhờ vả, rủ rê, ý chí**, và trong **báo cáo, văn bản chính thức** nên tránh (dễ nghe như bào chữa — hội thoại ①).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ものだから（chú ý ナA và N dùng な）',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ', 'V普通形 ＋ ものだから', '{遅|おく}れたものだから · {知|し}らなかったものだから', 'okureta mono da kara · shiranakatta mono da kara'],
        ['Tính từ い', 'イAい ＋ ものだから', '{忙|いそが}しいものだから · {寒|さむ}かったものだから', 'isogashii mono da kara · samukatta mono da kara'],
        ['Tính từ な', 'ナAな ＋ ものだから', '{心配|しんぱい}なものだから · {暇|ひま}だったものだから', 'shinpai na mono da kara · hima datta mono da kara'],
        ['Danh từ', 'Nな ＋ ものだから (Nだった → Nだったものだから)', '{子|こ}どもなものだから · {雨|あめ}だったものだから', 'kodomo na mono da kara · ame datta mono da kara'],
        ['Mức lịch sự', 'もんだから (thân) · ものだから · ものですから (lịch sự)', '{寝坊|ねぼう}したもんだから · {寝坊|ねぼう}したものですから', 'nebou shita mon da kara · nebou shita mono desu kara'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '普通形 ＋ ものだから、（việc đã xảy ra）',
          vi: '**(1) Giải thích / biện minh** — lý do cá nhân (thường là hoàn cảnh "không cưỡng được") của một việc mình đã làm hoặc không làm. Vế sau hay là **～てしまった・～られなかった・つい～**.',
          examples: [
            E('{道|みち}がすごく{混|こ}んでいたものですから、{遅|おく}れてしまいました。', 'Michi ga sugoku konde ita mono desu kara, okurete shimaimashita.', 'Tại đường đông quá nên tôi đã đến muộn.'),
            E('あまりにおいしかったものだから、つい{三杯|さんばい}も{食|た}べてしまった。', 'Amari ni oishikatta mono da kara, tsui sanbai mo tabete shimatta.', 'Tại ngon quá nên lỡ ăn tận ba bát.'),
            E('{目覚|めざ}ましが{鳴|な}らなかったもんだから、{寝過|ねす}ごしちゃった。', 'Mezamashi ga naranakatta mon da kara, nesugoshichatta.', 'Tại báo thức không kêu nên ngủ quên mất.'),
            E('{日本語|にほんご}がまだ{下手|へた}なものですから、{失礼|しつれい}なことを{言|い}ったらすみません。', 'Nihongo ga mada heta na mono desu kara, shitsurei na koto o ittara sumimasen.', 'Vì tiếng Nhật của tôi còn kém nên nếu lỡ nói điều gì thất lễ, xin thứ lỗi.'),
            E('{初|はじ}めての{一人暮|ひとりぐ}らしなものだから、{何|なに}をどう{買|か}えばいいか{分|わ}からなかった。', 'Hajimete no hitorigurashi na mono da kara, nani o dou kaeba ii ka wakaranakatta.', 'Tại lần đầu sống một mình nên tôi không biết phải mua gì, mua thế nào.'),
          ],
        },
        {
          formula: '普通形 ＋ ものだから、（lý do khiến mình làm một việc — giọng tâm sự）',
          vi: '**(2) Kể lý do một cách tâm tình** — không hẳn bào chữa, chỉ là **"vì hoàn cảnh của tôi là thế"**: lý do khiến mình làm một việc theo thói quen hoặc phải làm. Nghe **mềm, thân thiện** hơn から.',
          examples: [
            E('{母|はは}がいつも{心配|しんぱい}するものだから、{毎晩|まいばん}{電話|でんわ}している。', 'Haha ga itsumo shinpai suru mono da kara, maiban denwa shite iru.', 'Vì mẹ lúc nào cũng lo nên tối nào tôi cũng gọi điện.'),
            E('{家|いえ}が{駅|えき}から{遠|とお}いものですから、{毎朝|まいあさ}{六時|ろくじ}に{出|で}ています。', 'Ie ga eki kara tooi mono desu kara, maiasa rokuji ni dete imasu.', 'Vì nhà xa ga nên sáng nào tôi cũng ra khỏi nhà lúc sáu giờ.'),
            E('{子|こ}どもがまだ{小|ちい}さいもんだから、{夜|よる}の{飲|の}み{会|かい}にはなかなか{行|い}けないんだ。', 'Kodomo ga mada chiisai mon da kara, yoru no nomikai ni wa nakanaka ikenai n da.', 'Tại con còn nhỏ nên mình khó mà đi nhậu buổi tối được.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ものですから (với người trên) và ～もんだから (với bạn)',
      lines: [
        { who: '{森課長|もりかちょう}', role: 'b', text: 'ワンさん、{今朝|けさ}の{会議|かいぎ}、{十分|じゅっぷん}{遅|おく}れましたね。', ro: 'Wan-san, kesa no kaigi, juppun okuremashita ne.', vi: 'Chị Wang, cuộc họp sáng nay chị đến muộn mười phút nhỉ.' },
        { who: 'ワン', role: 'a', text: '{申|もう}し{訳|わけ}ありません。{前|まえ}の{打|う}ち{合|あ}わせが{長引|ながび}いたものですから……。{次|つぎ}からは{時間|じかん}を{区切|くぎ}って{参加|さんか}します。', ro: 'Moushiwake arimasen. Mae no uchiawase ga nagabiita mono desu kara……. Tsugi kara wa jikan o kugitte sanka shimasu.', vi: 'Em xin lỗi ạ. Tại buổi trao đổi trước kéo dài nên… Từ lần sau em sẽ chia thời gian rõ ràng rồi mới tham dự.' },
        { who: '{森課長|もりかちょう}', role: 'b', text: '{分|わ}かりました。{遅|おく}れそうな{時|とき}は、{先|さき}に{一言|ひとこと}{連絡|れんらく}をください。', ro: 'Wakarimashita. Okuresou na toki wa, saki ni hitokoto renraku o kudasai.', vi: 'Được rồi. Khi thấy sắp muộn thì hãy báo trước một tiếng.' },
        { who: '{鈴木|すずき}', role: 'c', text: '（あとで）ワンさん、{昼|ひる}ご{飯|はん}{食|た}べた？', ro: '(Ato de) Wan-san, hirugohan tabeta?', vi: '(Lát sau) Wang này, ăn trưa chưa?' },
        { who: 'ワン', role: 'a', text: 'まだなんです。{午前中|ごぜんちゅう}ずっとバタバタしてたもんですから……。', ro: 'Mada na n desu. Gozenchuu zutto batabata shiteta mon desu kara…….', vi: 'Em chưa ạ. Tại cả buổi sáng tất bật quá nên…' },
        { who: '{鈴木|すずき}', role: 'c', text: 'じゃあ、{一緒|いっしょ}に{行|い}こう。{少|すこ}し{休|やす}まないと。', ro: 'Jaa, issho ni ikou. Sukoshi yasumanai to.', vi: 'Vậy đi cùng chị. Phải nghỉ một chút chứ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — 普通形 ＋ ものだから',
      head: ['Lý do', 'Dạng ～ものだから', 'Câu', 'Romaji'],
      rows: [
        ['{電車|でんしゃ}が{止|と}まった', '{止|と}まったものですから', '{電車|でんしゃ}が{止|と}まったものですから、{連絡|れんらく}が{遅|おそ}くなりました。', 'Densha ga tomatta mono desu kara, renraku ga osoku narimashita.'],
        ['{安|やす}かった', '{安|やす}かったものだから', 'あまりに{安|やす}かったものだから、{三|みっ}つも{買|か}ってしまった。', 'Amari ni yasukatta mono da kara, mittsu mo katte shimatta.'],
        ['{心配|しんぱい}だ', '{心配|しんぱい}なものだから', '{弟|おとうと}が{心配|しんぱい}なものだから、{様子|ようす}を{見|み}に{行|い}った。', 'Otouto ga shinpai na mono da kara, yousu o mi ni itta.'],
        ['{初心者|しょしんしゃ}だ', '{初心者|しょしんしゃ}なものですから', 'まだ{初心者|しょしんしゃ}なものですから、{説明|せつめい}を{聞|き}いても{分|わ}からないことが{多|おお}いんです。', 'Mada shoshinsha na mono desu kara, setsumei o kiite mo wakaranai koto ga ooi n desu.'],
        ['{飲|の}みすぎた', '{飲|の}みすぎたもんだから', '{昨日|きのう}{飲|の}みすぎたもんだから、{今日|きょう}は{二日酔|ふつかよ}いだ。', 'Kinou nomisugita mon da kara, kyou wa futsukayoi da.'],
      ],
    },
    { t: 'rule', formula: 'V普通形・イAい・ナAな・Nな ＋ ものだから／もんだから／ものですから', vi: 'Tại vì… nên — lý do cá nhân, giải thích / biện minh cho việc đã xảy ra, mong người nghe thông cảm. Vế sau không dùng mệnh lệnh, nhờ vả, rủ rê, ý chí. Tránh trong báo cáo, văn bản chính thức.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ものだから (sai → đúng)',
      items: [
        '**Vế sau là mệnh lệnh / nhờ vả**: ~~{時間|じかん}がないものだから、{急|いそ}いでください~~ → **{時間|じかん}がないので、{急|いそ}いでください** (hoặc から). ~~{暑|あつ}いものだから、{窓|まど}を{開|あ}けましょう~~ → **{暑|あつ}いから、{窓|まど}を{開|あ}けましょう**.',
        '**Danh từ / tính từ な nối bằng だ**: ~~{雨|あめ}だものだから~~ → **{雨|あめ}なものだから** (hoặc {雨|あめ}だったものだから). ~~{心配|しんぱい}だものだから~~ → **{心配|しんぱい}なものだから**.',
        '**Dùng cho nguyên nhân khách quan trong văn bản**: ~~{台風|たいふう}が{来|き}たものだから、{電車|でんしゃ}が{運休|うんきゅう}した~~ (bản tin) → **{台風|たいふう}のため、{電車|でんしゃ}が{運休|うんきゅう}した**. ものだから là giọng **cá nhân, kể lể**.',
        '**Nhầm với ものの (Bài 28)**: **{買|か}ったものだから** (tại đã mua nên…) ≠ **{買|か}ったものの** (tuy đã mua nhưng…). ~~{免許|めんきょ}は{取|と}ったものだから、{運転|うんてん}していない~~ → **{免許|めんきょ}は{取|と}ったものの、{運転|うんてん}していない** (bảng ⑧).',
      ],
    },
    {
      t: 'note',
      title: 'Văn hoá — khi nào ものですから là lịch sự, khi nào là "bào chữa"?',
      items: [
        '**Lịch sự**: khi người khác **hỏi lý do**, hoặc khi bạn **xin lỗi việc nhỏ** và lý do đi kèm lời xin lỗi: **すみません、{道|みち}が{混|こ}んでいたものですから** — người Nhật nói câu này hằng ngày.',
        '**Bào chữa**: khi bạn **mở đầu** bằng lý do **trước** cả lời xin lỗi, hoặc dùng nó cho **sai sót nghiêm trọng** trong công việc. Trình tự an toàn: **① {申|もう}し{訳|わけ}ございません → ② sự việc ({経緯|けいい}) → ③ nguyên nhân (khách quan: ～ため・～ことから) → ④ biện pháp ({再発防止策|さいはつぼうしさく})**. Đây cũng là khuôn của bài viết 2 (báo cáo sự cố).',
      ],
    },

    /* ══════ ⑤ BẢNG 1 ══════ */
    { t: 'h', text: '⑤ BẢNG PHÂN BIỆT — ばかりに ↔ せいで ↔ おかげで ↔ ため（に）↔ ものだから ↔ から／ので' },
    {
      t: 'p',
      text: 'Sáu cách nói "**vì… nên…**" khác nhau ở **ba điểm**: **(a)** kết quả **tốt / xấu / trung tính**, **(b)** **thái độ** người nói (tiếc nuối · đổ lỗi · biết ơn · khách quan · biện minh), **(c)** **văn nói hay văn viết**. Đề N2 thường cho một câu có **dấu hiệu thái độ** (たった一言 → tiếc nuối; 先生の → biết ơn; お詫び → biện minh) — đọc dấu hiệu trước, rồi mới nhìn mẫu.',
    },
    {
      t: 'table',
      caption: 'Sáu cách nói nguyên nhân',
      head: ['Mẫu', 'Kết quả', 'Thái độ', 'Nói / viết', 'Nối', 'Ví dụ'],
      rows: [
        ['～ばかりに', 'XẤU (trừ たいばかりに)', 'tiếc nuối "chỉ vì một chuyện ấy"', 'cả hai (hơi văn viết)', '普通形 (ナAな／である, Nである)', '{一言|ひとこと}{言|い}ったばかりに、{嫌|きら}われた。'],
        ['～せいで', 'XẤU', 'đổ lỗi cho nguyên nhân (người, vật)', 'cả hai', '普通形 (ナAな, Nの)', '{隣|となり}の{工事|こうじ}のせいで、{眠|ねむ}れない。'],
        ['～おかげで', 'TỐT (mỉa mai: xấu)', 'biết ơn', 'cả hai', '普通形 (ナAな, Nの)', '{先輩|せんぱい}のおかげで、{合格|ごうかく}できた。'],
        ['～ため（に）', 'tốt / xấu / trung tính', 'khách quan, thông báo', 'viết · bản tin', '普通形 (ナAな, Nの)', '{大雪|おおゆき}のため、{休校|きゅうこう}になった。'],
        ['～ものだから', 'thường là việc mình đã làm', 'biện minh, mong thông cảm', 'nói (ものですから lịch sự)', '普通形 (ナAな, Nな)', '{寝坊|ねぼう}したものですから、{遅|おく}れました。'],
        ['～から／～ので', 'mọi loại', 'trung tính (ので mềm hơn)', 'cả hai', 'から: 普通形／です · ので: ナAな, Nな', '{雨|あめ}なので、{中止|ちゅうし}です。'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{確認|かくにん}を{一|ひと}つ{省|はぶ}いたばかりに、{大|おお}きな{事故|じこ}になってしまった。', 'Kakunin o hitotsu habuita bakari ni, ookina jiko ni natte shimatta.', 'Chỉ vì bỏ qua một bước kiểm tra mà thành tai nạn lớn. → tiếc nuối, nguyên nhân nhỏ → ばかりに'),
        E('{部長|ぶちょう}が{急|きゅう}に{予定|よてい}を{変|か}えたせいで、{全員|ぜんいん}が{困|こま}った。', 'Buchou ga kyuu ni yotei o kaeta sei de, zen\'in ga komatta.', 'Tại trưởng ban đột ngột đổi lịch mà mọi người khốn đốn. → đổ lỗi cho người khác → せいで'),
        E('{鈴木|すずき}さんが{手伝|てつだ}ってくれたおかげで、{締|し}め{切|き}りに{間|ま}に{合|あ}った。', 'Suzuki-san ga tetsudatte kureta okage de, shimekiri ni ma ni atta.', 'Nhờ chị Suzuki giúp nên kịp hạn. → biết ơn → おかげで'),
        E('システム{点検|てんけん}のため、{明日|あした}は{午前|ごぜん}{中|ちゅう}ご{利用|りよう}いただけません。', 'Shisutemu tenken no tame, ashita wa gozenchuu goriyou itadakemasen.', 'Do bảo trì hệ thống, sáng mai quý khách không sử dụng được. → thông báo khách quan → ため'),
        E('{申|もう}し{訳|わけ}ありません、{電車|でんしゃ}が{遅|おく}れたものですから。', 'Moushiwake arimasen, densha ga okureta mono desu kara.', 'Xin lỗi, tại tàu đến muộn ạ. → biện minh, mong thông cảm → ものですから'),
      ],
    },
    {
      t: 'note',
      title: 'Mẹo làm đề — 3 câu hỏi để chọn đúng',
      items: [
        '**① Kết quả tốt hay xấu?** Tốt → **おかげで** (hoặc ため, から). Xấu → còn **ばかりに・せいで・ものだから・ため**.',
        '**② Có dấu hiệu "chỉ một chuyện nhỏ"** (たった・ちょっと・一言・一度・うっかり) hoặc **Vたい** ở vế trước? → **ばかりに**. Chỉ thẳng **người / vật gây ra** để trách? → **せいで**. Người nói **đang giải thích lý do của mình** với người nghe (thường kèm すみません)? → **ものだから／ものですから**. Văn **thông báo, biển báo, bản tin**? → **ため**.',
        '**③ Vế sau là mệnh lệnh / nhờ vả / ý chí?** → loại **ばかりに・ものだから** (và cả せいで・おかげで) → chỉ còn **から／ので** (và ため trong thông báo: ～ため、ご{注意|ちゅうい}ください).',
      ],
    },

    /* ══════ ⑥ BẢNG 2 ══════ */
    { t: 'h', text: '⑥ BẢNG PHÂN BIỆT — ～ことから ↔ Nのことだから ↔ ～から' },
    {
      t: 'table',
      caption: 'Ba cách nói "vì… nên (suy ra)…"',
      head: ['Mẫu', 'Dựa vào đâu', 'Vế sau', 'Nói / viết', 'Ví dụ', 'Romaji'],
      rows: [
        ['普通形＋ことから', 'SỰ THẬT, dấu hiệu quan sát được (khách quan)', 'phán đoán · tên gọi · kết quả', 'viết', '{部屋|へや}の{電気|でんき}がついていることから、まだ{起|お}きていると{分|わ}かる。', 'Heya no denki ga tsuite iru koto kara, mada okite iru to wakaru.'],
        ['Nのことだから', 'TÍNH CÁCH, thói quen quen thuộc của N (người, tổ chức) mà ai cũng biết', 'phán đoán chắc chắn (きっと～だろう・～に違いない・～はずだ)', 'nói', '{夜型|よるがた}の{彼|かれ}のことだから、まだ{起|お}きているだろう。', 'Yorugata no kare no koto da kara, mada okite iru darou.'],
        ['～から', 'lý do bất kỳ', 'bất kỳ (cả ý chí, mệnh lệnh)', 'cả hai', '{電気|でんき}がついているから、まだ{起|お}きているよ。', 'Denki ga tsuite iru kara, mada okite iru yo.'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{時間|じかん}に{厳|きび}しい{森課長|もりかちょう}のことだから、もう{会議室|かいぎしつ}にいるはずだ。', 'Jikan ni kibishii Mori kachou no koto da kara, mou kaigishitsu ni iru hazu da.', 'Trưởng phòng Mori vốn nghiêm giờ giấc, chắc chắn đã ở phòng họp rồi. (ことだから — tính cách quen thuộc)'),
        E('{会議室|かいぎしつ}のかばんが{森課長|もりかちょう}のものであることから、{課長|かちょう}はもう{来|き}ていると{分|わ}かった。', 'Kaigishitsu no kaban ga Mori kachou no mono de aru koto kara, kachou wa mou kite iru to wakatta.', 'Từ việc cái cặp trong phòng họp là của trưởng phòng Mori, biết được là anh ấy đã đến. (ことから — dấu hiệu quan sát)'),
        E('あの{店|みせ}のことだから、{週末|しゅうまつ}はきっと{行列|ぎょうれつ}ができているよ。', 'Ano mise no koto da kara, shuumatsu wa kitto gyouretsu ga dekite iru yo.', 'Quán đó thì cuối tuần chắc chắn có hàng dài. (ことだから — dùng được cho cửa hàng, tổ chức)'),
      ],
    },
    {
      t: 'note',
      title: 'Mẹo phân biệt nhanh',
      items: [
        '**Trước ことだから luôn là "Nの"** (thường là người: {彼|かれ}の・{母|はは}の・{田中|たなか}さんの, đôi khi là tổ chức: あの{会社|かいしゃ}の). Trước ことから là **cả một mệnh đề** (～ている・～た・～である).',
        '**ことだから = "tôi biết N mà"** → giọng **chủ quan, thân mật**; **ことから = "từ dữ kiện này"** → giọng **khách quan, văn viết**. Trong đề 文法形式, nhìn từ ngay trước chỗ trống: **の** → ことだから; **thể thường của động từ / tính từ** → ことから.',
      ],
    },

    /* ══════ ⑦ BẢNG 3 ══════ */
    { t: 'h', text: '⑦ BẢNG PHÂN BIỆT — họ "だけ": だけに ↔ だけあって ↔ だけのことはある ↔ だけの N ↔ わりに (Bài 43)' },
    {
      t: 'table',
      caption: 'Cùng một điều kiện "đắt tiền" — năm kết quả, năm mẫu',
      head: ['Mẫu', 'Nghĩa', 'Kết quả', 'Ví dụ', 'Romaji'],
      rows: [
        ['～だけあって', 'đúng là… có khác', 'TỐT, đúng như mong đợi (khen)', '{高|たか}いだけあって、{味|あじ}がいい。', 'Takai dake atte, aji ga ii.'],
        ['～だけのことはある (cuối câu)', 'quả không hổ danh', 'TỐT (khen, kết luận)', 'この{味|あじ}なら、{高|たか}いだけのことはある。', 'Kono aji nara, takai dake no koto wa aru.'],
        ['～だけに', 'chính vì… nên càng', 'tốt HOẶC xấu (nhất là cảm xúc mạnh)', '{高|たか}かっただけに、まずくてがっかりした。', 'Takakatta dake ni, mazukute gakkari shita.'],
        ['～わりに (Bài 43)', 'so với… thì lại', 'TRÁI với mức mong đợi', '{高|たか}いわりに、{味|あじ}はいまいちだ。', 'Takai wari ni, aji wa imaichi da.'],
        ['～だけの N', 'N tương xứng với…', 'đánh giá "đáng / không đáng"', '{高|たか}いお{金|かね}を{払|はら}うだけの{価値|かち}はない。', 'Takai okane o harau dake no kachi wa nai.'],
        ['N／V ＋ だけ (N5)', 'chỉ', '(giới hạn — không liên quan)', '{高|たか}いのはこれだけだ。', 'Takai no wa kore dake da.'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('さすが{名門|めいもん}{校|こう}の{生徒|せいと}だけあって、{礼儀正|れいぎただ}しい。', 'Sasuga meimonkou no seito dake atte, reigitadashii.', 'Đúng là học sinh trường danh giá có khác, lễ phép thật. (だけあって — khen)'),
        E('{名門|めいもん}{校|こう}の{生徒|せいと}だけに、{周|まわ}りの{期待|きたい}も{大|おお}きく、プレッシャーもある。', 'Meimonkou no seito dake ni, mawari no kitai mo ookiku, puresshaa mo aru.', 'Chính vì là học sinh trường danh giá nên kỳ vọng của mọi người càng lớn, áp lực cũng có. (だけに — trung tính / tiêu cực)'),
        E('{名門|めいもん}{校|こう}の{生徒|せいと}のわりに、{勉強|べんきょう}はあまりしない。', 'Meimonkou no seito no wari ni, benkyou wa amari shinai.', 'So với học sinh trường danh giá thì lại không học mấy. (わりに — trái mong đợi, Bài 43)'),
      ],
    },
    {
      t: 'note',
      title: 'Mẹo làm đề',
      items: [
        '**Vế sau là lời khen, đúng như mong đợi** → だけあって = だけに (cả hai đều được; だけあって tự nhiên hơn, nhất là có さすが). **Vế sau là thất vọng / cảm xúc tiêu cực mạnh** → CHỈ **だけに**. **Vế sau trái với mong đợi** (đắt mà dở, rẻ mà ngon) → **わりに**.',
        '**だけに** còn hay đi với **かえって** (ngược lại): {有名|ゆうめい}な{店|みせ}だけに、かえって{入|はい}りにくい (chính vì nổi tiếng nên lại khó vào). Chỉ cần nhận ra.',
      ],
    },

    /* ══════ ⑧ BẢNG 4 ══════ */
    { t: 'h', text: '⑧ BẢNG PHÂN BIỆT — họ "もの": ものだから ↔ ものの (Bài 28) ↔ ものだ (Bài 32) ↔ もの／もん cuối câu' },
    {
      t: 'table',
      caption: 'Bốn chữ もの — bốn nghĩa',
      head: ['Mẫu', 'Nghĩa', 'Vị trí', 'Ví dụ', 'Romaji'],
      rows: [
        ['～ものだから／もんだから', 'tại vì… nên (biện minh)', 'giữa câu (nối hai vế)', '{寝坊|ねぼう}したものだから、{遅|おく}れた。', 'Nebou shita mono da kara, okureta.'],
        ['～ものの (Bài 28)', 'tuy… nhưng (thực tế chưa được như mong)', 'giữa câu', '{免許|めんきょ}は{取|と}ったものの、{運転|うんてん}していない。', 'Menkyo wa totta mono no, unten shite inai.'],
        ['～ものだ (Bài 32)', 'lẽ thường · hồi tưởng (～たものだ) · cảm thán', 'cuối câu', '{子|こ}どもの{頃|ころ}、よくここで{遊|あそ}んだものだ。', 'Kodomo no koro, yoku koko de asonda mono da.'],
        ['～もの／～もん', 'vì… mà (lý do nũng nịu, văn nói thân mật)', 'cuối câu', 'だって、{知|し}らなかったんだもん。', 'Datte, shiranakatta n da mon.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ một câu',
      items: [
        '**Có から ⇒ lý do** (ものだから). **Có の ở cuối ⇒ "tuy nhưng"** (ものの). **Đứng cuối câu với だ ⇒ lẽ thường / hồi tưởng** (ものだ). **Đứng cuối câu một mình, giọng nhõng nhẽo ⇒ lý do kiểu trẻ con** (もん).',
        'Câu luyện đọc một hơi: **{日本語|にほんご}は{難|むずか}しいものだ。{毎日|まいにち}{勉強|べんきょう}しているものの、なかなか{上手|じょうず}にならない。{昨日|きのう}も{眠|ねむ}かったものだから、{勉強|べんきょう}しないで{寝|ね}てしまった。だって{疲|つか}れてたんだもん。** (Nihongo wa muzukashii mono da. Mainichi benkyou shite iru mono no, nakanaka jouzu ni naranai. Kinou mo nemukatta mono da kara, benkyou shinaide nete shimatta. Datte tsukareteta n da mon. — Tiếng Nhật vốn khó. Tuy ngày nào cũng học nhưng mãi không giỏi lên. Hôm qua cũng tại buồn ngủ nên không học mà ngủ luôn. Tại mệt mà.)',
      ],
    },

    /* ══════ Luyện tập cuối mục ══════ */
    { t: 'h', text: 'Luyện tập — ghép câu, điền mẫu, đề JLPT' },
    {
      t: 'build',
      id: 'b48-np-ghep',
      title: 'Ghép câu (12 câu) — bấm các mảnh theo đúng thứ tự',
      items: [
        { vi: 'Chỉ vì nói một câu thừa mà làm bạn giận.', chips: ['{余計|よけい}な{一言|ひとこと}を', '{言|い}った', 'ばかりに', '{友達|ともだち}を{怒|おこ}らせてしまった', 'おかげで'], answer: ['{余計|よけい}な{一言|ひとこと}を', '{言|い}った', 'ばかりに', '{友達|ともだち}を{怒|おこ}らせてしまった'], ro: 'Yokei na hitokoto o itta bakari ni tomodachi o okorasete shimatta.' },
        { vi: 'Chỉ vì muốn gặp ca sĩ mà xếp hàng ba tiếng.', chips: ['{歌手|かしゅ}に', '{会|あ}いたい', 'ばかりに', '{三時間|さんじかん}も{並|なら}んだ', '{会|あ}った'], answer: ['{歌手|かしゅ}に', '{会|あ}いたい', 'ばかりに', '{三時間|さんじかん}も{並|なら}んだ'], ro: 'Kashu ni aitai bakari ni sanjikan mo naranda.' },
        { vi: 'Chỉ vì là người nước ngoài mà bị từ chối cho thuê nhà.', chips: ['{外国人|がいこくじん}', 'である', 'ばかりに', '{部屋|へや}を{断|ことわ}られた', 'の'], answer: ['{外国人|がいこくじん}', 'である', 'ばかりに', '{部屋|へや}を{断|ことわ}られた'], ro: 'Gaikokujin de aru bakari ni heya o kotowarareta.' },
        { vi: 'Vì từ đỉnh dốc nhìn thấy biển nên được gọi là "dốc Hamami".', chips: ['{坂|さか}の{上|うえ}から{海|うみ}が', '{見|み}えた', 'ことから', '「{浜見坂|はまみざか}」と{呼|よ}ばれた', 'ことだから'], answer: ['{坂|さか}の{上|うえ}から{海|うみ}が', '{見|み}えた', 'ことから', '「{浜見坂|はまみざか}」と{呼|よ}ばれた'], ro: 'Saka no ue kara umi ga mieta koto kara "Hamamizaka" to yobareta.' },
        { vi: 'Từ việc đường ướt, biết được là đêm qua trời mưa.', chips: ['{道|みち}が', 'ぬれている', 'ことから', '{夜中|よなか}に{雨|あめ}が{降|ふ}ったと{分|わ}かる', 'もんだから'], answer: ['{道|みち}が', 'ぬれている', 'ことから', '{夜中|よなか}に{雨|あめ}が{降|ふ}ったと{分|わ}かる'], ro: 'Michi ga nurete iru koto kara yonaka ni ame ga futta to wakaru.' },
        { vi: 'Anh ấy vốn chăm chỉ, chắc chắn sẽ giữ lời hứa.', chips: ['{真面目|まじめ}な', '{彼|かれ}の', 'ことだから', 'きっと{約束|やくそく}を{守|まも}るだろう', 'ことから'], answer: ['{真面目|まじめ}な', '{彼|かれ}の', 'ことだから', 'きっと{約束|やくそく}を{守|まも}るだろう'], ro: 'Majime na kare no koto da kara kitto yakusoku o mamoru darou.' },
        { vi: 'Chính vì đã kỳ vọng nên khi thua càng sốc.', chips: ['{期待|きたい}していた', 'だけに', '{負|ま}けた{時|とき}は', 'ショックだった', 'だけあって'], answer: ['{期待|きたい}していた', 'だけに', '{負|ま}けた{時|とき}は', 'ショックだった'], ro: 'Kitai shite ita dake ni maketa toki wa shokku datta.' },
        { vi: 'Đúng là tiệm lâu đời có khác, vị khác hẳn.', chips: ['さすが', '{老舗|しにせ}', 'だけあって', '{味|あじ}が{違|ちが}う', 'わりに'], answer: ['さすが', '{老舗|しにせ}', 'だけあって', '{味|あじ}が{違|ちが}う'], ro: 'Sasuga shinise dake atte aji ga chigau.' },
        { vi: 'Cuốn sách này đáng để đọc.', chips: ['この{本|ほん}は', '{読|よ}む', 'だけの', '{価値|かち}がある', 'だけに'], answer: ['この{本|ほん}は', '{読|よ}む', 'だけの', '{価値|かち}がある'], ro: 'Kono hon wa yomu dake no kachi ga aru.' },
        { vi: 'Kết quả đáng tiếc nhưng tôi đã làm hết những gì có thể.', chips: ['{結果|けっか}は{残念|ざんねん}だったが', 'できる', 'だけの', 'ことはした', 'だけに'], answer: ['{結果|けっか}は{残念|ざんねん}だったが', 'できる', 'だけの', 'ことはした'], ro: 'Kekka wa zannen datta ga dekiru dake no koto wa shita.' },
        { vi: 'Xin lỗi, tại đường đông nên tôi đến muộn.', chips: ['すみません、', '{道|みち}が{混|こ}んでいた', 'ものですから', '{遅|おく}れてしまいました', 'ものの'], answer: ['すみません、', '{道|みち}が{混|こ}んでいた', 'ものですから', '{遅|おく}れてしまいました'], ro: 'Sumimasen, michi ga konde ita mono desu kara okurete shimaimashita.' },
        { vi: 'Tại lần đầu sống một mình nên không biết phải mua gì.', chips: ['{初|はじ}めての{一人暮|ひとりぐ}らし', 'な', 'ものだから', '{何|なに}を{買|か}えばいいか{分|わ}からなかった', 'だ'], answer: ['{初|はじ}めての{一人暮|ひとりぐ}らし', 'な', 'ものだから', '{何|なに}を{買|か}えばいいか{分|わ}からなかった'], ro: 'Hajimete no hitorigurashi na mono da kara nani o kaeba ii ka wakaranakatta.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b48-np-dien',
      title: 'Điền mẫu đúng (12 câu) — ばかりに・ことから・ことだから・だけに・だけあって・だけの・ものだから',
      kind: 'fill',
      grammar: '普通形＋ばかりに · 普通形＋ことから · Nのことだから · 普通形＋だけに／だけあって · Vだけの N · 普通形＋ものだから',
      items: [
        { q: '{一度|いちど}{遅刻|ちこく}した（　　　）、{大事|だいじ}な{仕事|しごと}を{任|まか}せてもらえなくなった。（chỉ vì — tiếc nuối）', answers: ['ばかりに'], hint: '普通形＋ばかりに' },
        { q: '{合格|ごうかく}し（　　　）ばかりに、{毎晩|まいばん}{三時間|さんじかん}しか{寝|ね}なかった。（chỉ vì MUỐN）', answers: ['たい'], hint: 'Vたい＋ばかりに' },
        { q: '{新人|しんじん}で（　　　）ばかりに、{意見|いけん}を{聞|き}いてもらえなかった。（2 chữ kana）', answers: ['ある'], hint: 'Nである＋ばかりに' },
        { q: '{形|かたち}が{星|ほし}に{似|に}ている（　　　）、「{星|ほし}の{実|み}」と{名付|なづ}けられた。（4 chữ kana）', answers: ['ことから'], hint: '普通形＋ことから' },
        { q: '{犯人|はんにん}の{足跡|あしあと}が{小|ちい}さい（　　　）、{子|こ}どもだと{考|かんが}えられる。', answers: ['ことから'], hint: 'căn cứ → ことから' },
        { q: 'のんびり{屋|や}の{兄|あに}の（　　　）、また{約束|やくそく}の{時間|じかん}に{遅|おく}れるだろう。（5 chữ kana）', answers: ['ことだから'], hint: 'Nのことだから' },
        { q: '{一生懸命|いっしょうけんめい}{練習|れんしゅう}した（　　　）、{負|ま}けた{時|とき}は{本当|ほんとう}に{悔|くや}しかった。（chính vì… nên càng）', answers: ['だけに'], hint: '普通形＋だけに' },
        { q: 'さすが{本場|ほんば}で{学|まな}んだ{料理人|りょうりにん}（　　　）、{本物|ほんもの}の{味|あじ}だ。（khen — đúng là… có khác）', answers: ['だけあって', 'だけに'], hint: 'N＋だけあって' },
        { q: 'この{映画|えいが}は、{二時間|にじかん}{並|なら}んで{見|み}る（　　　）{価値|かち}がある。（3 chữ kana）', answers: ['だけの'], hint: 'V＋だけの＋価値' },
        { q: '{電車|でんしゃ}が{止|と}まった（　　　）、{遅|おく}れてしまいました。すみません。（lịch sự, 6 chữ kana）', answers: ['ものですから', 'もんですから'], hint: '普通形＋ものですから' },
        { q: '{弟|おとうと}が{心配|しんぱい}（　　　）ものだから、{様子|ようす}を{見|み}に{行|い}った。（1 chữ）', answers: ['な'], hint: 'ナA な＋ものだから' },
        { q: '{昨日|きのう}{飲|の}みすぎた（　　　）、{今日|きょう}は{頭|あたま}が{痛|いた}いよ。（văn nói thân mật, 5 chữ kana）', answers: ['もんだから', 'ものだから'], hint: 'もんだから' },
      ],
    },
    {
      t: 'mcq',
      id: 'b48-np-jlpt',
      title: 'Đề JLPT N2 — 文法形式の判断 (8 câu) + 文の組み立て ★ (4 câu)',
      items: [
        ...DOI([
          { q: '{送信|そうしん}する{前|まえ}に{宛先|あてさき}を{確|たし}かめなかった（　）、{社外|しゃがい}の{人|ひと}に{資料|しりょう}を{送|おく}ってしまった。', options: ['ばかりに', 'おかげで', 'だけあって', 'ことだから'], correct: 0, why: 'Một sơ suất nhỏ + hậu quả xấu + てしまった → **ばかりに** (①). おかげで cho kết quả tốt; だけあって là khen; ことだから cần Nの. 〔Atesaki o tashikamenakatta bakari ni…〕' },
          { q: '{江戸時代|えどじだい}、この{辺|あた}りに{大|おお}きな{市場|いちば}があった（　）、「{市場町|いちばまち}」という{地名|ちめい}が{残|のこ}っている。', options: ['ことから', 'ことだから', 'ものだから', 'だけあって'], correct: 0, why: 'Nguồn gốc địa danh, văn viết khách quan → **ことから** (②). ものだから là lý do cá nhân. 〔Ookina ichiba ga atta koto kara…〕' },
          { q: '{責任感|せきにんかん}の{強|つよ}い{鈴木|すずき}さんの（　）、{一人|ひとり}で{全部|ぜんぶ}やろうとしているに{違|ちが}いない。', options: ['ことだから', 'ことから', 'ばかりに', 'ものの'], correct: 0, why: '**Nの** đứng trước + phán đoán dựa trên tính cách (に違いない) → **ことだから** (bảng ⑥). 〔Suzuki-san no koto da kara…〕' },
          { q: '{二年間|にねんかん}{準備|じゅんび}してきた{計画|けいかく}だった（　）、{中止|ちゅうし}が{決|き}まった{時|とき}は{言葉|ことば}も{出|で}なかった。', options: ['だけに', 'だけあって', 'わりに', 'ばかりか'], correct: 0, why: 'Điều kiện đặc biệt (chuẩn bị 2 năm) → cảm xúc tiêu cực mạnh → **だけに** (③). だけあって không dùng cho kết quả xấu; わりに cần trái mong đợi. 〔Keikaku datta dake ni…〕' },
          { q: 'さすが{世界大会|せかいたいかい}で{優勝|ゆうしょう}した{選手|せんしゅ}（　）、{試合|しあい}の{流|なが}れを{読|よ}むのがうまい。', options: ['だけあって', 'ばかりに', 'ものだから', 'わりに'], correct: 0, why: 'さすが + lời khen đúng như mong đợi → **だけあって** (③). 〔Senshu dake atte…〕' },
          { q: '{部長|ぶちょう}：「どうして{昨日|きのう}{連絡|れんらく}をくれなかったんですか。」　{部下|ぶか}：「すみません。{携帯|けいたい}の{電池|でんち}が{切|き}れていた（　）……。」', options: ['ものですから', 'ものの', 'ことから', 'だけに'], correct: 0, why: 'Trả lời câu hỏi lý do + xin lỗi người trên → **ものですから** (④). ものの = "tuy… nhưng". 〔Denchi ga kirete ita mono desu kara…〕' },
          { q: '{思|おも}ったより{高|たか}かったが、この{景色|けしき}が{見|み}られるなら{払|はら}う（　）{価値|かち}はある。', options: ['だけの', 'だけに', 'ばかりに', 'ことから'], correct: 0, why: '**V＋だけの価値** = đáng để V (③ だけの). 〔Harau dake no kachi wa aru.〕' },
          { q: '{時間|じかん}がない（　）、タクシーで{行|い}きましょう。', options: ['から', 'ものだから', 'ばかりに', 'ことから'], correct: 0, why: 'Vế sau là **rủ rê (～ましょう)** → loại ものだから, ばかりに, ことから → chỉ **から** đúng (bảng ⑤ mẹo ③). 〔Jikan ga nai kara, takushii de ikimashou.〕' },
        ]),
        { q: '★ {彼|かれ}は ＿＿ ＿＿ ★ ＿＿ 、{嘘|うそ}をついてしまった。（ばかりに／いいところを／{見|み}せたい／{彼女|かのじょ}に）', options: ['ばかりに', 'いいところを', '{見|み}せたい', '{彼女|かのじょ}に'], correct: 2, why: 'Câu đúng: {彼|かれ}は **{彼女|かのじょ}に いいところを {見|み}せたい ばかりに**、{嘘|うそ}をついてしまった. ★ (ô 3) = **{見|み}せたい**.' },
        { q: '★ この{島|しま}は ＿＿ ★ ＿＿ ＿＿ 、「{亀島|かめじま}」と{呼|よ}ばれている。（{形|かたち}が／ことから／{似|に}ている／{亀|かめ}に）', options: ['{形|かたち}が', 'ことから', '{似|に}ている', '{亀|かめ}に'], correct: 3, why: 'Câu đúng: この{島|しま}は **{形|かたち}が {亀|かめ}に {似|に}ている ことから**、「{亀島|かめじま}」と{呼|よ}ばれている. ★ (ô 2) = **{亀|かめ}に**.' },
        { q: '★ ＿＿ ＿＿ ★ ＿＿ 、{発音|はつおん}がとてもきれいだ。（だけあって／{日本|にほん}に／{住|す}んでいた／{十年|じゅうねん}も）', options: ['だけあって', '{日本|にほん}に', '{住|す}んでいた', '{十年|じゅうねん}も'], correct: 2, why: 'Câu đúng: **{十年|じゅうねん}も {日本|にほん}に {住|す}んでいた だけあって**、{発音|はつおん}がとてもきれいだ. ★ (ô 3) = **{住|す}んでいた**.' },
        { q: '★ {申|もう}し{訳|わけ}ありません。＿＿ ＿＿ ★ ＿＿ 、{返事|へんじ}が{遅|おそ}くなりました。（ものですから／{出張|しゅっちょう}／{昨日|きのう}まで／だった）', options: ['ものですから', '{出張|しゅっちょう}', '{昨日|きのう}まで', 'だった'], correct: 3, why: 'Câu đúng: **{昨日|きのう}まで {出張|しゅっちょう} だった ものですから**、{返事|へんじ}が{遅|おそ}くなりました. ★ (ô 3) = **だった**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b48-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 24 chữ: 坂 谷 岸 浜 湾 丘 郷 称 縁 遺 釈 慌 遭 詰 陥 嘆 懸 拠 錯 冗 愚 芸 賢 穏',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 24 chữ Hán của chủ đề nhân quả – nguồn gốc: địa hình & địa danh (坂・坂道・谷・岸・海岸・浜・砂浜・湾・東京湾・丘・郷土・名称・愛称・縁・縁起・遺跡・遺産), sự cố & giải trình (解釈・釈明・慌てる・遭う・遭難・詰める・問い詰める・欠陥・陥る・嘆く・懸命・懸念・根拠・証拠・錯覚・冗談・愚か・愚痴), đánh giá (芸術・芸能人・賢い・賢明・穏やか・平穏) — biết khi nào đọc Kun (đứng riêng: 坂・谷・岸・浜・丘・縁・慌てる・遭う・詰める・陥る・嘆く・賢い・愚か・穏やか) và khi nào đọc On (từ ghép), tránh bẫy chữ trông giống (坂↔板↔阪, 谷↔浴, 丘↔兵, 縁↔緑, 釈↔訳, 慌↔荒, 詰↔結, 嘆↔漢, 懸↔県, 拠↔処, 錯↔借, 愚↔偶, 賢↔緊, 穏↔隠, 遺↔遣) và bẫy đồng âm (懸命↔賢明, 遭う↔会う).',
  minutes: 60,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 48 là **24 chữ** đi theo đúng các từ của chủ đề: 坂 谷 岸 浜 湾 丘 郷 称 縁 遺 釈 慌 遭 詰 陥 嘆 懸 拠 錯 冗 愚 芸 賢 穏. Nhóm **địa hình** (坂 谷 岸 浜 湾 丘) là chữ của **địa danh** — đọc bảng giới thiệu, bản đồ, tên ga ở Nhật hằng ngày sẽ gặp (渋谷・横浜・〜が丘・〜坂). Nhiều chữ bạn **đã gặp trong từ** ở bài trước nhưng mới đọc qua furigana: **{一生懸命|いっしょうけんめい}** (Bài 16), **{根拠|こんきょ}** (Bài 28), **{証拠|しょうこ}** (Bài 31), **{縁起|えんぎ}** (Bài 36), **{冗談|じょうだん}** — nay học cho **đọc được không cần furigana** như đề thi. Phần lớn là **chữ hình thanh**: **氵** (nước) trong 浜 湾 — đều liên quan tới NƯỚC; **忄** trong 慌 (LÒNG rối); **心** dưới đáy 懸 愚 (LÒNG); **辶** trong 遺 遭 (BƯỚC ĐI); **言** trong 詰 (LỜI); **扌** trong 拠 (TAY); **糸** trong 縁 (SỢI CHỈ); **阝** (bên trái = gò đất) trong 陥, (bên phải = làng) trong 郷. Học **theo từ** ({海岸|かいがん} = HẢI NGẠN, {郷土|きょうど} = HƯƠNG THỔ, {名称|めいしょう} = DANH XƯNG, {遺跡|いせき} = DI TÍCH, {欠陥|けっかん} = KHIẾM HÃM, {錯覚|さっかく} = THÁC GIÁC, {芸術|げいじゅつ} = NGHỆ THUẬT), không học âm từng chữ rời. Cột **Mức**: ✍ = nên tập viết · 👁 = chỉ cần đọc và hiểu.',
    },
    {
      t: 'table',
      caption: '24 chữ Hán mới của Bài 48',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['坂', 'PHẢN', 'ハン', 'さか', 'con dốc', '{坂|さか} · {坂道|さかみち} · {上|のぼ}り{坂|ざか} · {下|くだ}り{坂|ざか}', '✍ N2'],
        ['谷', 'CỐC', 'コク', 'たに', 'thung lũng', '{谷|たに} · {谷間|たにま} · {渋谷|しぶや} (đọc や — địa danh)', '✍ N2'],
        ['岸', 'NGẠN', 'ガン', 'きし', 'bờ', '{岸|きし} · {海岸|かいがん} (N2) · {川岸|かわぎし} · {対岸|たいがん}', '✍ N2'],
        ['浜', 'TÂN (濱)', 'ヒン', 'はま', 'bãi biển', '{浜|はま} · {砂浜|すなはま} (N2) · {浜辺|はまべ} · {横浜|よこはま}', '👁 N2'],
        ['湾', 'LOAN', 'ワン', '—', 'vịnh', '{湾|わん} · {東京湾|とうきょうわん} · {湾岸|わんがん} · {台湾|たいわん}', '👁 N2'],
        ['丘', 'KHÂU', 'キュウ', 'おか', 'đồi', '{丘|おか} · {砂丘|さきゅう} · {桜|さくら}が{丘|おか} (tên phố)', '✍ N2'],
        ['郷', 'HƯƠNG', 'キョウ・ゴウ', '—', 'quê, làng', '{郷土|きょうど} · {郷土料理|きょうどりょうり} · {故郷|こきょう} · {郷|ごう}に{入|い}っては{郷|ごう}に{従|したが}え', '👁 N2'],
        ['称', 'XƯNG', 'ショウ', '—', 'gọi tên', '{名称|めいしょう} (N2) · {愛称|あいしょう} · {称|しょう}する · {対称|たいしょう}', '👁 N2'],
        ['縁', 'DUYÊN', 'エン', 'ふち', 'duyên; mép viền', '{縁|えん} · {縁起|えんぎ} (Bài 36) · {縁側|えんがわ} · {縁|ふち} (mép)', '👁 N2'],
        ['遺', 'DI', 'イ・ユイ', '—', 'để lại', '{遺跡|いせき} (N2) · {遺産|いさん} · {世界遺産|せかいいさん} · {遺伝|いでん} · {遺言|ゆいごん}', '👁 N2'],
        ['釈', 'THÍCH', 'シャク', '—', 'giải thích', '{解釈|かいしゃく} (N2) · {釈明|しゃくめい} · {注釈|ちゅうしゃく}', '👁 N2'],
        ['慌', 'HOẢNG', 'コウ', 'あわ(てる)・あわ(ただしい)', 'hoảng hốt', '{慌|あわ}てる (N2) · {大慌|おおあわ}て · {慌|あわ}ただしい', '👁 N1 (từ N2)'],
        ['遭', 'TAO', 'ソウ', 'あ(う)', 'gặp phải', '{遭|あ}う (事故に遭う) · {遭難|そうなん} · {遭遇|そうぐう}', '👁 N1 (từ N2)'],
        ['詰', 'CẬT', 'キツ', 'つ(める)・つ(まる)・つ(む)', 'nhồi; vặn hỏi', '{詰|つ}める · {詰|つ}め{込|こ}む · {問|と}い{詰|つ}める · {詰|つ}まる · {缶詰|かんづめ}', '👁 N2'],
        ['陥', 'HÃM', 'カン', 'おちい(る)・おとしい(れる)', 'sa vào; khuyết', '{欠陥|けっかん} (N2) · {陥|おちい}る · {陥没|かんぼつ}', '👁 N1 (từ N2)'],
        ['嘆', 'THÁN', 'タン', 'なげ(く)・なげ(かわしい)', 'than thở', '{嘆|なげ}く (N2) · {嘆|なげ}かわしい · {感嘆|かんたん}', '👁 N1 (từ N2)'],
        ['懸', 'HUYỀN', 'ケン・ケ', 'か(ける)・か(かる)', 'treo; dốc hết', '{一生懸命|いっしょうけんめい} (Bài 16) · {懸命|けんめい}に · {懸念|けねん} · {命|いのち}を{懸|か}ける', '👁 N1 (từ N2)'],
        ['拠', 'CỨ', 'キョ・コ', '—', 'dựa vào', '{根拠|こんきょ} (Bài 28) · {証拠|しょうこ} (Bài 31 — コ) · {拠点|きょてん}', '👁 N2'],
        ['錯', 'THÁC', 'サク', '—', 'lẫn lộn, sai', '{錯覚|さっかく} · {試行錯誤|しこうさくご} · {錯誤|さくご}', '👁 N1'],
        ['冗', 'NHŨNG', 'ジョウ', '—', 'thừa', '{冗談|じょうだん} · {冗談半分|じょうだんはんぶん} · {冗長|じょうちょう}', '👁 N3'],
        ['愚', 'NGU', 'グ', 'おろ(か)', 'ngu dại', '{愚|おろ}か (N2) · {愚痴|ぐち} · {愚問|ぐもん}', '👁 N2'],
        ['芸', 'NGHỆ', 'ゲイ', '—', 'nghệ thuật, tài nghệ', '{芸術|げいじゅつ} (N2) · {芸能人|げいのうじん} · {芸|げい} · {園芸|えんげい}', '✍ N3'],
        ['賢', 'HIỀN', 'ケン', 'かしこ(い)', 'khôn ngoan', '{賢|かしこ}い (N2) · {賢明|けんめい} (≠ 懸命) · {賢者|けんじゃ}', '👁 N1 (từ N2)'],
        ['穏', 'ỔN', 'オン', 'おだ(やか)', 'yên ổn', '{穏|おだ}やか (N2) · {平穏|へいおん} · {穏便|おんびん}', '👁 N1 (từ N2)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**坂** = 土 (đất) + 反 (lật — gợi âm ハン): **mặt đất bị lật nghiêng** = DỐC. **谷** = hai nét 八 chồng nhau (nước tách dòng) + 口 (cửa): **nước chảy ra qua cửa hẹp giữa núi** = THUNG LŨNG. **岸** = 山 + 厂 (vách đá) + 干 (gợi âm): **vách đá dựng ở mép nước** = BỜ. **丘** = hình **hai gò đất nhô lên** = ĐỒI.',
        '**浜** = 氵 + 兵 (chữ cũ 濱 với 賓 gợi âm ヒン): nhớ "**lính đóng trại trên bãi cát cạnh nước**" = BÃI BIỂN. **湾** = 氵 + 弯 (cong): **nước ôm thành đường cong** = VỊNH. **郷** = phần trái (hai người quanh mâm cơm) + 阝 phải (làng): **cả làng cùng ăn** = QUÊ. **称** = 禾 (lúa) + 尔: **nhấc bó lúa lên cân** → định giá → GỌI TÊN. **縁** = 糸 (sợi chỉ) + 彖: **sợi chỉ viền mép vải** → sợi chỉ vô hình nối người = DUYÊN.',
        '**遺** = 辶 (đi) + 貴 (quý): **đi rồi để lại vật quý** = DI. **釈** = 釆 (vết chân thú — phân biệt) + 尺: **tách bạch cho rõ** = GIẢI THÍCH. **慌** = 忄 + 荒 (hoang, gợi âm コウ): **lòng rối như đồng hoang** = HOẢNG. **遭** = 辶 + 曹 (gợi âm ソウ): **đang đi thì gặp phải** = TAO NGỘ. **詰** = 言 + 吉 (gợi âm キツ): **lời dồn tới cùng** = VẶN HỎI → NHỒI CHẶT.',
        '**陥** = 阝 (gò đất, bên trái) + người rơi xuống hố: **rơi từ gò xuống hố** = SA VÀO → 欠陥 ("chỗ lõm, chỗ thiếu"). **嘆** = 口 + phần gợi âm タン (giống bên phải của 漢・難): **miệng thốt tiếng than** = THÁN. **懸** = 県＋系 (treo bằng dây) + 心: **lòng treo lơ lửng** → 懸命 "treo cả mạng sống". **拠** = 扌 + 処 (chỗ): **tay bám vào một chỗ** = DỰA VÀO, CĂN CỨ.',
        '**錯** = 金 + 昔 (gợi âm サク): **dát vàng xen kẽ từng lớp** → LẪN LỘN → 錯覚 (tưởng nhầm). **冗** = 冖 (mái) + 几 (ghế): **ngồi không dưới mái nhà** = THỪA → 冗談 (lời thừa = lời đùa). **愚** = 禺 (con khỉ — gợi âm グ) + 心: **lòng lăng xăng như khỉ** = NGU DẠI. **芸** = 艹 + 云 (chữ cũ 藝: người trồng cây): **trồng cây cần tay nghề** = NGHỆ. **賢** = 臤 (nắm chắc) + 貝 (tiền của): **giữ chắc của cải** = KHÔN NGOAN. **穏** = 禾 (lúa) + ⺕ (tay) + 心: **lúa đầy kho, tay cất kỹ, lòng yên** = ỔN.',
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — đề 表記 hay cài bẫy',
      head: ['Chữ của bài', 'Dễ nhầm với', 'Phân biệt'],
      rows: [
        ['坂 (さか)', '板 (いた — tấm ván) · 阪 (さか — {大阪|おおさか})', 'cùng 反: 坂 trái 土 (đất — dốc) · 板 trái 木 (gỗ) · 阪 trái 阝 (dùng trong tên 大阪)'],
        ['谷 (たに)', '浴 (よく — {海水浴|かいすいよく})', '浴 = 氵 + 谷 (thêm nước bên trái — tắm)'],
        ['丘 (おか)', '兵 (へい — lính)', '兵 = 丘 + 八 (thêm hai chân bên dưới)'],
        ['縁 (えん)', '緑 (みどり — màu xanh lá)', 'cùng 糸: 縁 phải 彖 · 緑 phải 录 — bẫy kinh điển của đề 表記'],
        ['釈 (しゃく)', '訳 (やく・わけ — {通訳|つうやく}・{言|い}い{訳|わけ})', 'cùng 尺: 釈 trái 釆 · 訳 trái 言'],
        ['慌 (あわ)', '荒 (あら — {荒|あら}い)', '慌 = 忄 + 荒 (thêm "lòng")'],
        ['詰 (つ)', '結 (むす — {結|むす}ぶ・{結果|けっか})', 'cùng 吉: 詰 trái 言 (lời) · 結 trái 糸 (sợi)'],
        ['嘆 (なげ)', '漢 (かん — {漢字|かんじ}) · 難 (なん — {難|むずか}しい)', 'cùng phần phải: 嘆 trái 口 · 漢 trái 氵 · 難 có 隹 bên phải'],
        ['懸 (けん)', '県 (けん — {県|けん}, tỉnh)', '懸 = 県 + 系 + 心 — cùng đọc ケン'],
        ['拠 (きょ・こ)', '処 (しょ — {処理|しょり})', '拠 = 扌 + 処 (thêm "tay")'],
        ['錯 (さく)', '借 (しゃく — {借|か}りる) · 惜 (お — {惜|お}しい)', 'cùng 昔: 錯 trái 金 · 借 trái 亻 · 惜 trái 忄'],
        ['愚 (ぐ)', '偶 (ぐう — {偶然|ぐうぜん})', 'cùng 禺: 愚 có 心 bên dưới · 偶 có 亻 bên trái'],
        ['賢 (けん)', '緊 (きん — {緊張|きんちょう})', 'cùng 臤 phía trên: 賢 dưới 貝 (tiền) · 緊 dưới 糸 (sợi)'],
        ['穏 (おん)', '隠 (かく — {隠|かく}す)', 'cùng phần phải: 穏 trái 禾 (lúa) · 隠 trái 阝 (gò)'],
        ['遺 (い)', '遣 (けん — {派遣|はけん}・{気遣|きづか}い)', 'cùng 辶: 遺 bên trong có 貴 (quý) · 遣 bên trong không có 貝'],
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — đọc Kun hay On?',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)', 'Ghi chú'],
      rows: [
        ['坂', '{坂|さか}・{坂道|さかみち}・{下|くだ}り{坂|ざか}', '— (On ハン hầu như không gặp)', 'sau từ khác さか → ざか'],
        ['谷', '{谷|たに}・{谷間|たにま}', '{峡谷|きょうこく} (コク)', '{渋谷|しぶや}: đọc riêng của địa danh'],
        ['岸', '{岸|きし}・{川岸|かわぎし}', '{海岸|かいがん}・{対岸|たいがん} (ガン)', 'きし → ぎし sau 川'],
        ['浜', '{浜|はま}・{砂浜|すなはま}・{浜辺|はまべ}', '{海浜|かいひん} (ヒン)', 'đời thường gần như toàn Kun'],
        ['丘', '{丘|おか}', '{砂丘|さきゅう} (キュウ)', ''],
        ['縁', '{縁|ふち} (mép)', '{縁|えん}・{縁起|えんぎ} (エン)', '{縁|えん} đứng riêng lại đọc On!'],
        ['慌', '{慌|あわ}てる・{慌|あわ}ただしい', '{恐慌|きょうこう} (コウ — N1)', ''],
        ['遭', '{遭|あ}う', '{遭難|そうなん}・{遭遇|そうぐう} (ソウ)', 'chỉ chuyện không may'],
        ['詰', '{詰|つ}める・{詰|つ}まる・{缶詰|かんづめ}', '{詰問|きつもん} (キツ — N1)', 'つめ → づめ sau 缶'],
        ['陥', '{陥|おちい}る', '{欠陥|けっかん} (カン)', ''],
        ['嘆', '{嘆|なげ}く', '{感嘆|かんたん} (タン)', ''],
        ['懸', '{懸|か}ける (命を懸ける)', '{懸命|けんめい} (ケン) · {懸念|けねん} (ケ)', 'ケ chỉ trong vài từ'],
        ['愚', '{愚|おろ}か', '{愚痴|ぐち}・{愚問|ぐもん} (グ)', ''],
        ['賢', '{賢|かしこ}い', '{賢明|けんめい} (ケン)', '{賢明|けんめい} = {懸命|けんめい} về âm!'],
        ['穏', '{穏|おだ}やか', '{平穏|へいおん}・{穏便|おんびん} (オン)', ''],
      ],
    },
    {
      t: 'readkanji',
      id: 'b48-doc-kanji',
      title: 'Đọc KHÔNG furigana — 24 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên. Mọi chữ Hán trong phần này đều đã học ở Bài 1–47 hoặc là chữ mới của bài.',
      items: [
        { text: '{駅|えき}から{家|いえ}までは、{急|きゅう}な{坂|さか}が{続|つづ}いている。', ro: 'Eki kara ie made wa, kyuu na saka ga tsuzuite iru.', vi: 'Từ ga về nhà là một con dốc gắt kéo dài.' },
        { text: '{山|やま}と{山|やま}の{間|あいだ}の{谷|たに}に、{小|ちい}さな{村|むら}がある。', ro: 'Yama to yama no aida no tani ni, chiisana mura ga aru.', vi: 'Ở thung lũng giữa hai ngọn núi có một ngôi làng nhỏ.' },
        { text: '{夏休|なつやす}みに、{家族|かぞく}で{海岸|かいがん}を{散歩|さんぽ}した。', ro: 'Natsuyasumi ni, kazoku de kaigan o sanpo shita.', vi: 'Kỳ nghỉ hè, cả nhà đi dạo trên bờ biển.' },
        { text: '{子|こ}どもたちが{砂浜|すなはま}で{遊|あそ}んでいる。', ro: 'Kodomotachi ga sunahama de asonde iru.', vi: 'Bọn trẻ đang chơi trên bãi cát.' },
        { text: '{東京湾|とうきょうわん}の{近|ちか}くには、{大|おお}きな{工場|こうじょう}が{多|おお}い。', ro: 'Toukyou-wan no chikaku ni wa, ookina koujou ga ooi.', vi: 'Gần vịnh Tokyo có nhiều nhà máy lớn.' },
        { text: '{丘|おか}の{上|うえ}から、{町|まち}{全体|ぜんたい}が{見|み}える。', ro: 'Oka no ue kara, machi zentai ga mieru.', vi: 'Từ trên đồi nhìn thấy cả thị trấn.' },
        { text: 'この{地方|ちほう}の{郷土料理|きょうどりょうり}を{食|た}べてみたい。', ro: 'Kono chihou no kyoudo ryouri o tabete mitai.', vi: 'Tôi muốn thử món ăn địa phương của vùng này.' },
        { text: '{来年|らいねん}から、{駅|えき}の{名称|めいしょう}が{変|か}わるそうだ。', ro: 'Rainen kara, eki no meishou ga kawaru sou da.', vi: 'Nghe nói từ sang năm tên nhà ga sẽ đổi.' },
        { text: '{彼|かれ}とは、{不思議|ふしぎ}な{縁|えん}があるようだ。', ro: 'Kare to wa, fushigi na en ga aru you da.', vi: 'Hình như tôi với anh ấy có một mối duyên kỳ lạ.' },
        { text: '{工事中|こうじちゅう}に、{古|ふる}い{遺跡|いせき}が{見|み}つかった。', ro: 'Koujichuu ni, furui iseki ga mitsukatta.', vi: 'Trong lúc thi công, người ta tìm thấy một di tích cổ.' },
        { text: '{社長|しゃちょう}は、{問題|もんだい}について{記者|きしゃ}に{釈明|しゃくめい}した。', ro: 'Shachou wa, mondai ni tsuite kisha ni shakumei shita.', vi: 'Giám đốc đã giải trình với phóng viên về vấn đề.' },
        { text: '{地震|じしん}の{時|とき}は、{慌|あわ}てないで{安全|あんぜん}な{場所|ばしょ}に{移|うつ}ってください。', ro: 'Jishin no toki wa, awatenaide anzen na basho ni utsutte kudasai.', vi: 'Khi có động đất, đừng hoảng, hãy di chuyển tới chỗ an toàn.' },
        { text: '{帰|かえ}り{道|みち}で、{交通事故|こうつうじこ}に{遭|あ}ってしまった。', ro: 'Kaerimichi de, koutsuu jiko ni atte shimatta.', vi: 'Trên đường về tôi đã gặp tai nạn giao thông.' },
        { text: 'かばんに{荷物|にもつ}を{全部|ぜんぶ}{詰|つ}め{込|こ}んだ。', ro: 'Kaban ni nimotsu o zenbu tsumekonda.', vi: 'Tôi đã nhồi hết đồ đạc vào túi.' },
        { text: '{新|あたら}しい{車|くるま}のブレーキに、{欠陥|けっかん}が{見|み}つかった。', ro: 'Atarashii kuruma no bureeki ni, kekkan ga mitsukatta.', vi: 'Phát hiện khiếm khuyết ở phanh của chiếc xe mới.' },
        { text: '{失敗|しっぱい}を{嘆|なげ}いてばかりいても、しかたがない。', ro: 'Shippai o nageite bakari ite mo, shikata ga nai.', vi: 'Cứ than thở mãi về thất bại cũng chẳng ích gì.' },
        { text: '{選手|せんしゅ}たちは、{最後|さいご}まで{懸命|けんめい}に{走|はし}った。', ro: 'Senshutachi wa, saigo made kenmei ni hashitta.', vi: 'Các vận động viên đã chạy hết sức tới phút cuối.' },
        { text: 'はっきりした{証拠|しょうこ}がないので、まだ{犯人|はんにん}とは{言|い}えない。', ro: 'Hakkiri shita shouko ga nai node, mada hannin to wa ienai.', vi: 'Chưa có chứng cứ rõ ràng nên chưa thể nói là thủ phạm.' },
        { text: '{二|ふた}つのことが{同時|どうじ}に{起|お}きたので、{原因|げんいん}だと{錯覚|さっかく}してしまった。', ro: 'Futatsu no koto ga douji ni okita node, gen\'in da to sakkaku shite shimatta.', vi: 'Vì hai việc xảy ra cùng lúc nên tôi đã tưởng nhầm đó là nguyên nhân.' },
        { text: '{冗談|じょうだん}を{言|い}ったばかりに、{彼女|かのじょ}を{怒|おこ}らせてしまった。', ro: 'Joudan o itta bakari ni, kanojo o okorasete shimatta.', vi: 'Chỉ vì nói đùa mà làm cô ấy giận.' },
        { text: '{自分|じぶん}の{愚|おろ}かさに{気|き}づいて、{恥|は}ずかしくなった。', ro: 'Jibun no orokasa ni kizuite, hazukashiku natta.', vi: 'Nhận ra sự dại dột của mình, tôi thấy xấu hổ.' },
        { text: '{彼女|かのじょ}は{芸術|げいじゅつ}の{大学|だいがく}に{通|かよ}っている。', ro: 'Kanojo wa geijutsu no daigaku ni kayotte iru.', vi: 'Cô ấy đang học trường đại học nghệ thuật.' },
        { text: 'この{犬|いぬ}はとても{賢|かしこ}くて、{言葉|ことば}をよく{覚|おぼ}える。', ro: 'Kono inu wa totemo kashikokute, kotoba o yoku oboeru.', vi: 'Con chó này rất khôn, nhớ từ rất giỏi.' },
        { text: '{今日|きょう}の{海|うみ}は{波|なみ}もなく、とても{穏|おだ}やかだ。', ro: 'Kyou no umi wa nami mo naku, totemo odayaka da.', vi: 'Biển hôm nay không có sóng, rất êm.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b48-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 60 giây như phần Reading của thi nói, rồi mới mở đáp án. Đoạn 1: bảng giới thiệu địa danh · Đoạn 2: báo cáo sự cố · Đoạn 3: nghiên cứu và lời nhận xét.',
      items: [
        { text: '「{浜見坂|はまみざか}」は、{昔|むかし}この{坂|さか}の{上|うえ}から{砂浜|すなはま}がよく{見|み}えたことから、その{名|な}がついた。{今|いま}は{湾|わん}が{小|ちい}さくなり、{海岸|かいがん}は{遠|とお}くなったが、{丘|おか}の{上|うえ}の{公園|こうえん}からは{今|いま}も{海|うみ}が{見|み}える。この{町|まち}には{古|ふる}い{遺跡|いせき}も{残|のこ}っており、{一度|いちど}は{歩|ある}いてみるだけの{価値|かち}がある。', ro: '"Hamamizaka" wa, mukashi kono saka no ue kara sunahama ga yoku mieta koto kara, sono na ga tsuita. Ima wa wan ga chiisaku nari, kaigan wa tooku natta ga, oka no ue no kouen kara wa ima mo umi ga mieru. Kono machi ni wa furui iseki mo nokotte ori, ichido wa aruite miru dake no kachi ga aru.', vi: '"Dốc Hamami" có tên như vậy vì ngày xưa từ đỉnh dốc này nhìn rõ bãi cát. Nay vịnh đã thu nhỏ lại, bờ biển lùi xa, nhưng từ công viên trên đồi vẫn nhìn thấy biển. Thị trấn này còn có cả di tích cổ, rất đáng để đi bộ một lần.' },
        { text: '{昨夜|さくや}、{予約|よやく}システムが{二時間|にじかん}{止|と}まった。{作業者|さぎょうしゃ}が{慌|あわ}てて{手順|てじゅん}を{一|ひと}つ{飛|と}ばしたばかりに、{大|おお}きな{問題|もんだい}になってしまった。{確認|かくにん}する{人|ひと}が{一人|ひとり}しかいなかったことから、{同|おな}じミスは{誰|だれ}にでも{起|お}こり{得|え}たと{考|かんが}えられる。{会社|かいしゃ}は{取引先|とりひきさき}に{釈明|しゃくめい}し、{確認|かくにん}を{二人|ふたり}で{行|おこな}うことにした。', ro: 'Sakuya, yoyaku shisutemu ga nijikan tomatta. Sagyousha ga awatete tejun o hitotsu tobashita bakari ni, ookina mondai ni natte shimatta. Kakunin suru hito ga hitori shika inakatta koto kara, onaji misu wa dare ni demo okorieta to kangaerareru. Kaisha wa torihikisaki ni shakumei shi, kakunin o futari de okonau koto ni shita.', vi: 'Đêm qua hệ thống đặt chỗ dừng hai tiếng. Chỉ vì người thao tác cuống lên bỏ qua một bước của quy trình mà thành vấn đề lớn. Từ việc chỉ có một người kiểm tra, có thể nghĩ lỗi đó ai cũng có thể mắc. Công ty đã giải trình với khách hàng và quyết định cho hai người cùng kiểm tra.' },
        { text: '{睡眠時間|すいみんじかん}と{成績|せいせき}には、{深|ふか}い{関係|かんけい}があると{言|い}われる。しかし、{二|ふた}つが{一緒|いっしょ}に{変|か}わるからといって、{一方|いっぽう}が{原因|げんいん}だと{考|かんが}えるのは{錯覚|さっかく}かもしれない。{賢|かしこ}い{研究者|けんきゅうしゃ}ほど{結論|けつろん}を{急|いそ}がず、{懸命|けんめい}にデータを{確|たし}かめる。{長年|ながねん}{研究|けんきゅう}を{続|つづ}けてきた{先生|せんせい}だけあって、{説明|せつめい}は{穏|おだ}やかで、{説得力|せっとくりょく}があった。', ro: 'Suimin jikan to seiseki ni wa, fukai kankei ga aru to iwareru. Shikashi, futatsu ga issho ni kawaru kara to itte, ippou ga gen\'in da to kangaeru no wa sakkaku kamo shirenai. Kashikoi kenkyuusha hodo ketsuron o isogazu, kenmei ni deeta o tashikameru. Naganen kenkyuu o tsuzukete kita sensei dake atte, setsumei wa odayaka de, settokuryoku ga atta.', vi: 'Người ta nói thời gian ngủ và kết quả học tập có quan hệ sâu sắc. Nhưng không vì hai thứ cùng thay đổi mà nghĩ một bên là nguyên nhân — đó có thể là tưởng nhầm. Nhà nghiên cứu càng khôn ngoan càng không vội kết luận, mà dốc sức kiểm tra số liệu. Đúng là giáo sư nghiên cứu bao năm có khác, lời giải thích ôn tồn mà thuyết phục.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b48-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (16 câu)',
      items: DOI([
        { q: '{駅|えき}までの**坂道**が{急|きゅう}だ。', options: ['さかみち', 'はんみち', 'さかどう', 'ばんみち'], correct: 0, why: '**{坂道|さかみち}** — cả từ đọc Kun: さか + みち.' },
        { q: '{夏|なつ}の**海岸**は{人|ひと}でいっぱいだ。', options: ['かいがん', 'かいかん', 'うみぎし', 'かいがい'], correct: 0, why: '**{海岸|かいがん}** — 岸 On ガン (đục). かいがい là {海外|かいがい} (nước ngoài).' },
        { q: '**砂浜**で{貝|かい}を{拾|ひろ}った。', options: ['すなはま', 'さひん', 'すなばま', 'しゃはま'], correct: 0, why: '**{砂浜|すなはま}** — すな + はま (không đục).' },
        { q: '**東京湾**に{船|ふね}が{入|はい}ってきた。', options: ['とうきょうわん', 'とうきょうまん', 'とうきょうえん', 'とうきょうわ'], correct: 0, why: '**湾** On ワン.' },
        { q: '**丘**の{上|うえ}に{公園|こうえん}がある。', options: ['おか', 'きゅう', 'やま', 'さか'], correct: 0, why: 'Đứng riêng đọc Kun **おか**.' },
        { q: 'この{地方|ちほう}の**郷土**{料理|りょうり}を{食|た}べた。', options: ['きょうど', 'ごうど', 'きょうと', 'こうど'], correct: 0, why: '**{郷土|きょうど}** — 郷 キョウ (trường âm), 土 ド.' },
        { q: '{会社|かいしゃ}の**名称**を{変|か}える。', options: ['めいしょう', 'みょうしょう', 'めいしょ', 'なしょう'], correct: 0, why: '**{名称|めいしょう}** — 名 メイ, 称 ショウ.' },
        { q: '**縁起**のいい{数字|すうじ}だ。', options: ['えんぎ', 'えんき', 'ふちぎ', 'ろくぎ'], correct: 0, why: '**{縁起|えんぎ}** (Bài 36) — 起 đọc ぎ (đục) trong từ này.' },
        { q: '**遺跡**を{見学|けんがく}した。', options: ['いせき', 'ゆいせき', 'いあと', 'きせき'], correct: 0, why: '**{遺跡|いせき}** — 遺 イ, 跡 セキ. ユイ chỉ trong {遺言|ゆいごん}; きせき là {奇跡|きせき}.' },
        { q: '{人|ひと}によって**解釈**が{違|ちが}う。', options: ['かいしゃく', 'かいせき', 'かいやく', 'げしゃく'], correct: 0, why: '**{解釈|かいしゃく}** — 釈 シャク.' },
        { q: '{電話|でんわ}が{鳴|な}って**慌**てた。', options: ['あわ', 'あせ', 'あら', 'こう'], correct: 0, why: '**{慌|あわ}てる**. あせる là {焦|あせ}る (Bài 45 chữ 焦).' },
        { q: '{車|くるま}に**欠陥**が{見|み}つかった。', options: ['けっかん', 'けつかん', 'けっこう', 'かんけつ'], correct: 0, why: '**{欠陥|けっかん}** — âm ngắt: けつ → けっ.' },
        { q: '{不運|ふうん}を**嘆**く。', options: ['なげ', 'なや', 'なつ', 'たん'], correct: 0, why: '**{嘆|なげ}く** — than thở. なやむ là {悩|なや}む.' },
        { q: '{景気|けいき}の{悪化|あっか}が**懸念**されている。', options: ['けねん', 'けんねん', 'かねん', 'げんねん'], correct: 0, why: '**{懸念|けねん}** — 懸 đọc ケ trong từ này (không phải ケン).' },
        { q: '{目|め}の**錯覚**で、{線|せん}が{曲|ま}がって{見|み}える。', options: ['さっかく', 'さくかく', 'しゃっかく', 'せきかく'], correct: 0, why: '**{錯覚|さっかく}** — 錯 サク → âm ngắt さっ.' },
        { q: '{彼|かれ}はいつも**穏**やかに{話|はな}す。', options: ['おだ', 'おん', 'なご', 'ゆる'], correct: 0, why: '**{穏|おだ}やか**. なごやか là {和|なご}やか (từ khác).' },
      ]),
    },
    {
      t: 'mcq',
      id: 'b48-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (10 câu)',
      items: DOI([
        { q: '{選手|せんしゅ}たちは**けんめい**に{走|はし}った。', options: ['懸命', '賢明', '県命', '険命'], correct: 0, why: '"Dốc sức" → **{懸命|けんめい}**. {賢明|けんめい} = sáng suốt (cùng âm).' },
        { q: '{今|いま}は{動|うご}かないほうが**けんめい**だ。', options: ['賢明', '懸命', '堅明', '検明'], correct: 0, why: '"Sáng suốt, khôn ngoan" → **{賢明|けんめい}**.' },
        { q: '{帰|かえ}りに{大雨|おおあめ}に**あ**った。', options: ['遭', '会', '合', '当'], correct: 0, why: 'Gặp phải chuyện không may → **{遭|あ}う**.' },
        { q: '{彼女|かのじょ}とは{不思議|ふしぎ}な**えん**がある。', options: ['縁', '緑', '録', '園'], correct: 0, why: '"Duyên" → **{縁|えん}**. {緑|みどり} (xanh lá) trông giống!' },
        { q: '{言葉|ことば}の**かいしゃく**は{人|ひと}によって{違|ちが}う。', options: ['解釈', '解訳', '回釈', '会釈'], correct: 0, why: '**{解釈|かいしゃく}** — 釈 (釆 + 尺), không phải 訳. {会釈|えしゃく} là từ khác (cúi chào nhẹ).' },
        { q: '{地震|じしん}で**あわ**てて{外|そと}に{出|で}た。', options: ['慌', '荒', '焦', '泡'], correct: 0, why: '**{慌|あわ}てる** — 忄 + 荒. 荒 thiếu "lòng".' },
        { q: 'その{話|はなし}には**こんきょ**がない。', options: ['根拠', '根処', '根居', '根挙'], correct: 0, why: '**{根拠|こんきょ}** — 拠 = 扌 + 処.' },
        { q: '{子|こ}どもの**おろ**かな{行動|こうどう}を{叱|しか}った。', options: ['愚', '偶', '遇', '隅'], correct: 0, why: '**{愚|おろ}か** — 禺 + 心. 偶 (偶然) có 亻.' },
        { q: '{旅行|りょこう}の{荷物|にもつ}をかばんに**つ**めた。', options: ['詰', '結', '積', '包'], correct: 0, why: '**{詰|つ}める** — 言 + 吉. 結 (むすぶ) có 糸.' },
        { q: '{今日|きょう}の{海|うみ}は**おだ**やかだ。', options: ['穏', '隠', '温', '稲'], correct: 0, why: '**{穏|おだ}やか** — 禾 + ⺕ + 心. 隠 (かくす) trái là 阝.' },
      ]),
    },
    {
      t: 'write',
      id: 'b48-viet-kanji',
      title: 'Tập viết — 5 chữ ✍ và 12 từ',
      note: 'Viết 5 chữ ✍ trước (đúng thứ tự nét theo hoạt hình — 坂 viết 土 trước rồi 反; 谷 viết hai nét 八 trên trước; 岸 viết 山 → 厂 → 干; 丘 viết nét phẩy trên trước; 芸 viết 艹 trước rồi 云), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['坂', '谷', '岸', '丘', '芸', '坂道', '海岸', '砂浜', '名称', '遺跡', '解釈', '慌てる', '欠陥', '証拠', '錯覚', '賢い', '穏やか'],
      goi: {
        '坂道': 'さかみち · đường dốc',
        '海岸': 'かいがん · bờ biển',
        '砂浜': 'すなはま · bãi cát',
        '名称': 'めいしょう · tên gọi',
        '遺跡': 'いせき · di tích',
        '解釈': 'かいしゃく · cách hiểu',
        '慌てる': 'あわてる · hoảng, cuống',
        '欠陥': 'けっかん · khiếm khuyết',
        '証拠': 'しょうこ · chứng cứ',
        '錯覚': 'さっかく · tưởng nhầm',
        '賢い': 'かしこい · khôn ngoan',
        '穏やか': 'おだやか · êm đềm',
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
  id: 'b48-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N2 — 6 bài theo đủ 5 dạng đề: 課題理解 · ポイント理解 · 概要理解 · 即時応答 · 統合理解 ×2 (bối cảnh nhân quả: viết báo cáo sự cố, radio phỏng vấn tiệm bánh lâu đời, bài giảng "tương quan ≠ nhân quả", chọn tuyến đi bộ tìm hiểu lịch sử, chọn biện pháp phòng tái diễn)',
  goal: 'Nghe chị Suzuki giao việc để chọn đúng việc phải làm TRƯỚC (loại việc người khác đã làm / việc để sau); nghe phỏng vấn radio để bắt "lý do lớn nhất" sau khi các lý do quen thuộc bị gạt đi; nắm ý chính bài giảng về tương quan và nhân quả (第三の要因・錯覚); đáp ngay câu nói có ～だけあって・～もんだから・～ばかりに・～だけに・～ことから・～のことだから; so sánh ba tuyến đi bộ và ba biện pháp phòng tái diễn theo điều kiện của từng người để chọn (統合理解).',
  minutes: 55,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N2 — 5 dạng, khoảng 50 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo cho chủ đề Bài 48'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó phải làm **trước / tiếp theo**.', 'Gạch việc **người khác đã làm** (～はもう済ませた), việc **không cần** (それは{要|い}らない), việc **để sau** (～てから). Câu chốt hay có **まずは・{何|なに}より{先|さき}に・それがないと{始|はじ}まらない**.'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó.', 'Người được phỏng vấn **gạt lý do mà ai cũng nghĩ** (そう{言|い}っていただくことが{多|おお}いんですが、{実|じつ}は…) rồi nói **lý do thật** sau **{一番|いちばん}{大|おお}きいのは**. Chuyện kể bằng **～ばかりに** thường là "bài học" phụ, không phải đáp án chính.'],
        ['問題3', '概要理解 (hiểu ý khái quát)', 'Nghe **một đoạn nói**, rồi mới nghe câu hỏi (chủ đề / ý chính).', 'Bài giảng: ví dụ gây bất ngờ → **もちろん、そんなことはありません** → giải thích (**～からです・～ことから**) → **このように…** + lời khuyên cuối (**～てみてください**) = ý chính.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', 'Hiểu **thái độ**: **だけあって** (khen → cảm ơn, khiêm tốn) · **もんだから／ものですから** (xin lỗi + lý do → đáp "không sao") · **ばかりに** (tiếc nuối / bị trách → xin lỗi) · **だけに** (thất vọng → đồng cảm) · **ことから** (giải thích tên → "à, ra thế") · **のことだから** (đoán theo tính cách → đồng ý).'],
        ['問題5', '統合理解 (hiểu tổng hợp)', 'Nghe đoạn dài (thông tin + hội thoại), **so sánh nhiều phương án** rồi chọn.', 'Ghi chú thành **bảng**: phương án × tiêu chí (thời gian, chi phí, đặc điểm). Đánh dấu **điều kiện của từng người** (足が{痛|いた}い → loại tuyến nhiều dốc). Bài có 2 câu hỏi: người nữ chọn gì, người nam chọn gì — hai người thường chọn **khác nhau**.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        '**～ばかりに** trong lời người nói = **nguyên nhân của một chuyện xấu đã xảy ra** → thường là chi tiết của câu hỏi "なぜ～" (vì sao khách giảm, vì sao bị lỗi).',
        '**～ことから、～と{呼|よ}ばれている** = lời giải thích **tên gọi** → câu hỏi kiểu 「この{名前|なまえ}はどうしてついたのですか」 lấy đáp án ở vế trước ことから.',
        '**～だけに** trong lời người nói = **cảm xúc mạnh** (thất vọng, xúc động) + lý do. **～だけあって** = **lời khen**.',
        '**もんだから／ものですから** = người nói đang **giải thích lý do của mình** (thường kèm xin lỗi) → người nghe đáp **大丈夫ですよ・気にしないで**.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: viết báo cáo sự cố — làm gì trước?' },
    NG('b48-ng-1', '{新人|しんじん}の{社員|しゃいん}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — thư xin lỗi khách: trưởng phòng viết (không cần); gọi điện cho khách: trưởng phòng đã làm sáng nay; biện pháp phòng tái diễn: làm SAU khi đã rõ nguyên nhân; việc phải làm NGAY: xem nhật ký thao tác, viết lại diễn biến đêm qua theo thứ tự thời gian (まずは… それがないと、何も始まらない).', [
      ['ナレーター', 'ja-nu', '{会社|かいしゃ}で、{先輩|せんぱい}の{社員|しゃいん}と{新人|しんじん}の{社員|しゃいん}が{話|はな}しています。{新人|しんじん}の{社員|しゃいん}はこのあとまず{何|なに}をしますか。', 'Kaisha de, senpai no shain to shinjin no shain ga hanashite imasu. Shinjin no shain wa kono ato mazu nani o shimasu ka.', 'Ở công ty, một nhân viên đàn chị và một nhân viên mới đang nói chuyện. Sau đây, nhân viên mới trước hết sẽ làm gì?'],
      ['{鈴木|すずき}', 'ja-nu', 'ワンさん、{障害|しょうがい}の{報告書|ほうこくしょ}、{今日中|きょうじゅう}に{出|だ}してほしいって{課長|かちょう}が。', 'Wan-san, shougai no houkokusho, kyoujuu ni dashite hoshii tte kachou ga.', 'Wang này, trưởng phòng bảo muốn em nộp báo cáo sự cố trong hôm nay.'],
      ['ワン', 'ja-nu', 'はい。まず、お{客様|きゃくさま}へのお{詫|わ}びの{文|ぶん}から{書|か}けばいいでしょうか。', 'Hai. Mazu, okyakusama e no owabi no bun kara kakeba ii deshou ka.', 'Vâng. Trước hết em nên viết thư xin lỗi gửi khách hàng ạ?'],
      ['{鈴木|すずき}', 'ja-nu', 'ううん、お{客様|きゃくさま}への{文書|ぶんしょ}は{課長|かちょう}が{書|か}くことになっているから、それは{要|い}らないわ。{報告書|ほうこくしょ}は{社内|しゃない}{向|む}けよ。', 'Uun, okyakusama e no bunsho wa kachou ga kaku koto ni natte iru kara, sore wa iranai wa. Houkokusho wa shanai muke yo.', 'Không, văn bản gửi khách thì trưởng phòng viết rồi, cái đó không cần. Báo cáo là để dùng trong công ty.'],
      ['ワン', 'ja-nu', '{分|わ}かりました。では、{再発防止策|さいはつぼうしさく}を{考|かんが}えて、{課長|かちょう}に{相談|そうだん}してみます。', 'Wakarimashita. De wa, saihatsu boushisaku o kangaete, kachou ni soudan shite mimasu.', 'Em hiểu rồi. Vậy em sẽ nghĩ biện pháp phòng tái diễn rồi hỏi ý trưởng phòng.'],
      ['{鈴木|すずき}', 'ja-nu', '{防止策|ぼうしさく}は{大事|だいじ}だけど、{原因|げんいん}がはっきりしないうちに{考|かんが}えても、{的外|まとはず}れになりかねないでしょう。{課長|かちょう}も「{事実|じじつ}をまとめてから」って{言|い}ってたわ。', 'Boushisaku wa daiji da kedo, gen\'in ga hakkiri shinai uchi ni kangaete mo, matohazure ni narikanenai deshou. Kachou mo "jijitsu o matomete kara" tte itteta wa.', 'Biện pháp thì quan trọng, nhưng nguyên nhân chưa rõ mà đã nghĩ thì e là trật lất. Trưởng phòng cũng bảo "tổng hợp sự thật xong đã".'],
      ['ワン', 'ja-nu', 'そうですね……。みどり{旅行|りょこう}さんにも、もう{一度|いちど}お{電話|でんわ}したほうがいいですか。', 'Sou desu ne……. Midori Ryokou-san ni mo, mou ichido odenwa shita hou ga ii desu ka.', 'Đúng ạ… Em có nên gọi lại cho Midori Travel một lần nữa không ạ?'],
      ['{鈴木|すずき}', 'ja-nu', 'それは{課長|かちょう}が{朝|あさ}のうちに{済|す}ませたから{大丈夫|だいじょうぶ}。まずは、{昨夜|さくや}{何時|なんじ}に{何|なに}をしたのか、{作業|さぎょう}の{記録|きろく}を{見|み}ながら{時間|じかん}の{順|じゅん}に{書|か}き{出|だ}して。それがないと、{何|なに}も{始|はじ}まらないから。', 'Sore wa kachou ga asa no uchi ni sumaseta kara daijoubu. Mazu wa, sakuya nanji ni nani o shita no ka, sagyou no kiroku o minagara jikan no jun ni kakidashite. Sore ga nai to, nani mo hajimaranai kara.', 'Việc đó trưởng phòng làm xong từ sáng rồi, không sao. Trước hết, vừa xem nhật ký thao tác vừa viết ra theo thứ tự thời gian đêm qua mấy giờ đã làm gì. Không có cái đó thì chẳng bắt đầu được gì.'],
      ['ワン', 'ja-nu', 'はい、すぐやります。', 'Hai, sugu yarimasu.', 'Vâng, em làm ngay ạ.'],
      ['ナレーター', 'ja-nu', '{新人|しんじん}の{社員|しゃいん}はこのあとまず{何|なに}をしますか。', 'Shinjin no shain wa kono ato mazu nani o shimasu ka.', 'Sau đây, nhân viên mới trước hết sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b48-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: DOI([
        { q: '{新人|しんじん}の{社員|しゃいん}はこのあとまず{何|なに}をしますか。', options: ['{昨夜|さくや}の{作業|さぎょう}の{経緯|けいい}を{時間|じかん}の{順|じゅん}にまとめる', 'お{客様|きゃくさま}へのお{詫|わ}びの{文|ぶん}を{書|か}く', '{再発防止策|さいはつぼうしさく}を{考|かんが}えて{課長|かちょう}に{相談|そうだん}する', '{取引先|とりひきさき}にもう{一度|いちど}{電話|でんわ}をかける'], correct: 0, why: 'Thư xin lỗi: **{課長|かちょう}が{書|か}くことになっている** (loại). Biện pháp: **{原因|げんいん}がはっきりしないうちに{考|かんが}えても…** → để sau (loại). Gọi điện: **{課長|かちょう}が{朝|あさ}のうちに{済|す}ませた** (loại). Câu chốt: **まずは…{時間|じかん}の{順|じゅん}に{書|か}き{出|だ}して** → viết diễn biến (経緯).' },
        { q: '{先輩|せんぱい}の{社員|しゃいん}は、なぜ{防止策|ぼうしさく}を{先|さき}に{考|かんが}えないほうがいいと{言|い}っていますか。', options: ['{原因|げんいん}がまだはっきりしていないから', '{課長|かちょう}が{防止策|ぼうしさく}を{考|かんが}えることになっているから', '{防止策|ぼうしさく}は{報告書|ほうこくしょ}に{書|か}かなくてもいいから', 'お{客様|きゃくさま}が{防止策|ぼうしさく}を{求|もと}めていないから'], correct: 0, why: '**{原因|げんいん}がはっきりしないうちに{考|かんが}えても、{的外|まとはず}れになりかねない** — chưa rõ nguyên nhân mà nghĩ biện pháp thì dễ sai hướng.' },
      ]),
    },
    {
      t: 'note',
      title: 'Từ mới trong bài nghe 1 (không cần học thuộc)',
      items: [
        '**{社内向|しゃないむ}け** (dành cho nội bộ công ty) · **お{詫|わ}び** (lời xin lỗi trang trọng — chữ 詫 ngoài bảng thường dụng, công ty vẫn hay viết: お詫び申し上げます) · **{的外|まとはず}れ** (trật mục tiêu, lạc đề — N1) · **{済|す}ませる** (làm xong) · **{書|か}き{出|だ}す** (viết ra, liệt kê) · **それがないと{何|なに}も{始|はじ}まらない** (không có cái đó thì chẳng làm được gì).',
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題2 ポイント理解: radio — vì sao tiệm bánh tồn tại hai trăm năm?' },
    NG('b48-ng-2', '{店長|てんちょう}は、{店|みせ}が{二百年|にひゃくねん}{続|つづ}いた{一番|いちばん}の{理由|りゆう}は{何|なん}だと{言|い}っていますか', 'Dạng ポイント理解 — câu hỏi hỏi "lý do LỚN NHẤT". Bẫy: vị không đổi (ai cũng nghĩ — bị phủ định: 実は少しずつ変えてきた), vị trí trước ga (それもあります — chỉ là phụ; ga mới có trăm năm). Câu then chốt sau 一番大きいのは: thay đổi những gì cần thay đổi cho hợp thời. Chuyện đời bố (伝統を守りたいばかりに…客が減った) là bài học minh hoạ.', [
      ['ナレーター', 'ja-nu', 'ラジオで、アナウンサーが{老舗|しにせ}の{和菓子屋|わがしや}の{店長|てんちょう}に{話|はなし}を{聞|き}いています。{店長|てんちょう}は、{店|みせ}が{二百年|にひゃくねん}{続|つづ}いた{一番|いちばん}の{理由|りゆう}は{何|なん}だと{言|い}っていますか。', 'Rajio de, anaunsaa ga shinise no wagashiya no tenchou ni hanashi o kiite imasu. Tenchou wa, mise ga nihyakunen tsuzuita ichiban no riyuu wa nan da to itte imasu ka.', 'Trên radio, phát thanh viên đang phỏng vấn bà chủ một tiệm bánh kẹo Nhật lâu đời. Bà chủ nói lý do lớn nhất giúp tiệm tồn tại hai trăm năm là gì?'],
      ['アナウンサー', 'ja-nu', '{創業|そうぎょう}{二百年|にひゃくねん}。こちらのお{店|みせ}が{長|なが}く{続|つづ}いてきたのは、やはり{昔|むかし}から{変|か}わらない{味|あじ}のおかげでしょうか。', 'Sougyou nihyakunen. Kochira no omise ga nagaku tsuzuite kita no wa, yahari mukashi kara kawaranai aji no okage deshou ka.', 'Thành lập đã hai trăm năm. Tiệm mình tồn tại lâu như vậy, có phải là nhờ hương vị không đổi từ xưa không ạ?'],
      ['{店長|てんちょう}', 'ja-nu', 'そう{言|い}っていただくことが{多|おお}いんですが、{実|じつ}は、{味|あじ}は{少|すこ}しずつ{変|か}えてきたんです。{昔|むかし}のお{菓子|かし}は、{今|いま}よりずっと{甘|あま}かったんですよ。{砂糖|さとう}が{貴重|きちょう}だった{時代|じだい}は、{甘|あま}いことがごちそうでしたから。', 'Sou itte itadaku koto ga ooi n desu ga, jitsu wa, aji wa sukoshi zutsu kaete kita n desu. Mukashi no okashi wa, ima yori zutto amakatta n desu yo. Satou ga kichou datta jidai wa, amai koto ga gochisou deshita kara.', 'Nhiều người nói vậy lắm, nhưng thật ra vị bánh đã được đổi dần dần. Bánh ngày xưa ngọt hơn bây giờ nhiều. Thời đường còn quý, ngọt chính là món sang.'],
      ['アナウンサー', 'ja-nu', 'なるほど。{駅前|えきまえ}という{場所|ばしょ}のよさも、{理由|りゆう}の{一|ひと}つでは？', 'Naruhodo. Ekimae to iu basho no yosa mo, riyuu no hitotsu de wa?', 'Ra vậy. Vị trí đẹp ngay trước ga cũng là một lý do chứ ạ?'],
      ['{店長|てんちょう}', 'ja-nu', 'それもあります。でも、{駅|えき}ができたのは{百年|ひゃくねん}ほど{前|まえ}で、それまでは{山道|やまみち}の{途中|とちゅう}の{小|ちい}さな{店|みせ}でした。', 'Sore mo arimasu. Demo, eki ga dekita no wa hyakunen hodo mae de, sore made wa yamamichi no tochuu no chiisana mise deshita.', 'Cũng có lý do đó. Nhưng nhà ga mới có khoảng trăm năm trước, trước đó tiệm chỉ là một quán nhỏ giữa đường núi.'],
      ['アナウンサー', 'ja-nu', 'では、{一番|いちばん}の{理由|りゆう}は……。', 'De wa, ichiban no riyuu wa…….', 'Vậy lý do lớn nhất là…'],
      ['{店長|てんちょう}', 'ja-nu', '{一番|いちばん}{大|おお}きいのは、{時代|じだい}やお{客様|きゃくさま}の{好|この}みに{合|あ}わせて、「{変|か}えるべきところ」を{変|か}えてきたことだと{思|おも}います。{老舗|しにせ}だけに、{変|か}えるのは{勇気|ゆうき}がいりました。{父|ちち}の{代|だい}には、{伝統|でんとう}を{守|まも}りたいばかりに{何|なに}も{変|か}えなかった{時期|じき}があって、お{客様|きゃくさま}がずいぶん{減|へ}ってしまったんです。', 'Ichiban ookii no wa, jidai ya okyakusama no konomi ni awasete, "kaeru beki tokoro" o kaete kita koto da to omoimasu. Shinise dake ni, kaeru no wa yuuki ga irimashita. Chichi no dai ni wa, dentou o mamoritai bakari ni nani mo kaenakatta jiki ga atte, okyakusama ga zuibun hette shimatta n desu.', 'Lớn nhất, tôi nghĩ, là đã thay đổi "những chỗ cần đổi" cho hợp với thời đại và khẩu vị khách. Chính vì là tiệm lâu đời nên thay đổi cần can đảm lắm. Thời bố tôi, có giai đoạn chỉ vì muốn giữ truyền thống mà không đổi gì cả, khách giảm đi rất nhiều.'],
      ['アナウンサー', 'ja-nu', '{守|まも}るだけでは{続|つづ}かない、ということですね。', 'Mamoru dake de wa tsuzukanai, to iu koto desu ne.', 'Nghĩa là chỉ giữ gìn thôi thì không tồn tại được nhỉ.'],
      ['ナレーター', 'ja-nu', '{店長|てんちょう}は、{店|みせ}が{二百年|にひゃくねん}{続|つづ}いた{一番|いちばん}の{理由|りゆう}は{何|なん}だと{言|い}っていますか。', 'Tenchou wa, mise ga nihyakunen tsuzuita ichiban no riyuu wa nan da to itte imasu ka.', 'Bà chủ nói lý do lớn nhất giúp tiệm tồn tại hai trăm năm là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b48-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: DOI([
        { q: '{店長|てんちょう}は、{店|みせ}が{二百年|にひゃくねん}{続|つづ}いた{一番|いちばん}の{理由|りゆう}は{何|なん}だと{言|い}っていますか。', options: ['{時代|じだい}に{合|あ}わせて、{変|か}えるべきところを{変|か}えてきたから', '{昔|むかし}から{味|あじ}を{一度|いちど}も{変|か}えなかったから', '{駅前|えきまえ}のいい{場所|ばしょ}にあったから', '{伝統|でんとう}を{何|なに}よりも{大切|たいせつ}に{守|まも}ってきたから'], correct: 0, why: 'Vị không đổi: **{実|じつ}は、{味|あじ}は{少|すこ}しずつ{変|か}えてきた** (loại). Vị trí: **それもあります** — chỉ phụ, ga mới có trăm năm (loại). Giữ truyền thống: thời bố **何も変えなかった → 客が減った** (ngược lại). **{一番|いちばん}{大|おお}きいのは…「{変|か}えるべきところ」を{変|か}えてきたこと**.' },
        { q: '{父|ちち}の{代|だい}にお{客様|きゃくさま}が{減|へ}ったのは、なぜですか。', options: ['{伝統|でんとう}を{守|まも}りたくて、{何|なに}も{変|か}えなかったから', 'お{菓子|かし}の{値段|ねだん}を{上|あ}げたから', '{駅|えき}が{遠|とお}くに{移|うつ}ったから', 'お{菓子|かし}を{甘|あま}くしすぎたから'], correct: 0, why: '**{伝統|でんとう}を{守|まも}りたいばかりに{何|なに}も{変|か}えなかった{時期|じき}があって、お{客様|きゃくさま}がずいぶん{減|へ}ってしまった** — ～たいばかりに (mục ①).' },
      ]),
    },
    {
      t: 'note',
      title: 'Từ mới trong bài nghe 2 (không cần học thuộc)',
      items: [
        '**{和菓子屋|わがしや}** (tiệm bánh kẹo Nhật) · **{創業|そうぎょう}** (thành lập — doanh nghiệp) · **{貴重|きちょう}** (quý giá — N2) · **ごちそう** (món ngon, đồ sang) · **{好|この}み** (sở thích, khẩu vị — N2) · **～{代|だい}** (đời: {父|ちち}の{代|だい} = thời bố làm chủ) · **{伝統|でんとう}** (truyền thống) · **～べき** (nên — học chính thức ở Bài 52; ở đây chỉ cần hiểu: 変えるべきところ = chỗ nên đổi).',
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題3 概要理解: bài giảng "kem và tai nạn đuối nước"' },
    NG('b48-ng-3', '{話|はなし}を{聞|き}いて、{質問|しつもん}に{答|こた}えてください', 'Dạng 概要理解 — nghe hết rồi mới có câu hỏi. Cấu trúc: dữ liệu gây bất ngờ (kem bán chạy ↔ tai nạn dưới nước) → もちろん、そんなことはありません → vì cả hai cùng tăng khi trời nóng (yếu tố thứ ba) → このように: thấy hai việc cùng xảy ra mà vội cho là nhân quả là ảo giác thường gặp → lời khuyên: dừng lại nghĩ xem có yếu tố khác không.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}の{授業|じゅぎょう}で、{先生|せんせい}が{話|はな}しています。', 'Daigaku no jugyou de, sensei ga hanashite imasu.', 'Trong giờ học ở trường đại học, thầy giáo đang nói.'],
      ['{研究者|けんきゅうしゃ}', 'ja-nam', '{皆|みな}さん、アイスクリームがよく{売|う}れる{日|ひ}ほど、{海|うみ}や{川|かわ}での{事故|じこ}が{多|おお}いというデータがあります。では、アイスクリームが{事故|じこ}の{原因|げんいん}なのでしょうか。もちろん、そんなことはありません。どちらも、{気温|きおん}が{高|たか}い{日|ひ}に{増|ふ}えるからです。', 'Minasan, aisukuriimu ga yoku ureru hi hodo, umi ya kawa de no jiko ga ooi to iu deeta ga arimasu. De wa, aisukuriimu ga jiko no gen\'in na no deshou ka. Mochiron, sonna koto wa arimasen. Dochira mo, kion ga takai hi ni fueru kara desu.', 'Các em, có số liệu cho thấy ngày nào kem bán càng chạy thì tai nạn ở biển và sông càng nhiều. Vậy kem có phải là nguyên nhân gây tai nạn không? Tất nhiên là không. Đó là vì cả hai đều tăng vào những ngày nhiệt độ cao.'],
      ['{研究者|けんきゅうしゃ}', 'ja-nam', '{暑|あつ}い{日|ひ}は、アイスを{食|た}べる{人|ひと}も、{泳|およ}ぎに{行|い}く{人|ひと}も{多|おお}くなります。{二|ふた}つが{一緒|いっしょ}に{増|ふ}えるのは、{気温|きおん}という{第三|だいさん}の{要因|よういん}があるからなんです。', 'Atsui hi wa, aisu o taberu hito mo, oyogi ni iku hito mo ooku narimasu. Futatsu ga issho ni fueru no wa, kion to iu daisan no youin ga aru kara na n desu.', 'Ngày nóng thì người ăn kem cũng nhiều, người đi bơi cũng nhiều. Hai thứ cùng tăng là vì có một yếu tố thứ ba: nhiệt độ.'],
      ['{研究者|けんきゅうしゃ}', 'ja-nam', 'このように、{二|ふた}つのことが{同時|どうじ}に{起|お}きていることから、すぐに「{一方|いっぽう}がもう{一方|いっぽう}の{原因|げんいん}だ」と{考|かんが}えてしまうのは、よくある{錯覚|さっかく}です。ニュースや{広告|こうこく}で「～する{人|ひと}ほど～だ」という{話|はなし}を{聞|き}いたら、ほかの{要因|よういん}がないか、{一度|いちど}{立|た}ち{止|ど}まって{考|かんが}えてみてください。', 'Kono you ni, futatsu no koto ga douji ni okite iru koto kara, sugu ni "ippou ga mou ippou no gen\'in da" to kangaete shimau no wa, yoku aru sakkaku desu. Nyuusu ya koukoku de "~ suru hito hodo ~ da" to iu hanashi o kiitara, hoka no youin ga nai ka, ichido tachidomatte kangaete mite kudasai.', 'Như vậy, từ việc hai chuyện xảy ra cùng lúc mà vội nghĩ ngay "cái này là nguyên nhân của cái kia" là một ảo giác thường gặp. Khi nghe trên tin tức hay quảng cáo câu kiểu "người càng… thì càng…", các em hãy dừng lại một chút và nghĩ xem có yếu tố nào khác không.'],
      ['ナレーター', 'ja-nu', '{先生|せんせい}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', 'Sensei ga ichiban iitai koto wa nan desu ka.', 'Điều thầy giáo muốn nói nhất là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b48-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: DOI([
        { q: '{先生|せんせい}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', options: ['{二|ふた}つのことが{一緒|いっしょ}に{起|お}きても、すぐに{因果関係|いんがかんけい}があると{考|かんが}えないほうがいい。', 'アイスクリームを{食|た}べすぎると、{水|みず}の{事故|じこ}に{遭|あ}いやすくなる。', '{暑|あつ}い{日|ひ}は、{海|うみ}や{川|かわ}で{泳|およ}がないほうがいい。', 'ニュースや{広告|こうこく}のデータは、{信|しん}じないほうがいい。'], correct: 0, why: 'Kem không phải nguyên nhân (**もちろん、そんなことはありません** — loại 2). Bơi lội chỉ là ví dụ (loại 3). Thầy không bảo đừng tin dữ liệu, mà bảo **{立|た}ち{止|ど}まって{考|かんが}えて** (loại 4). Ý chính sau **このように**: vội nghĩ là nhân quả là **{錯覚|さっかく}**.' },
        { q: '「{第三|だいさん}の{要因|よういん}」とは、この{話|はなし}では{何|なん}のことですか。', options: ['{気温|きおん}', 'アイスクリーム', '{水|みず}の{事故|じこ}', '{広告|こうこく}'], correct: 0, why: '**{気温|きおん}という{第三|だいさん}の{要因|よういん}** — nhiệt độ làm cả hai cùng tăng.' },
      ]),
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題4 即時応答: 6 câu ngắn' },
    NG('b48-ng-4', '{即時応答|そくじおうとう} — {文|ぶん}を{聞|き}いて、{一番|いちばん}いい{返事|へんじ}を{選|えら}んでください', 'Dạng 即時応答 — mỗi câu chỉ nghe MỘT lần. Nghe thái độ (khen / xin lỗi + lý do / trách / thất vọng / giải thích tên / đoán theo tính cách) rồi chọn câu đáp. Đáp án ghi ở câu hỏi bên dưới.', [
      ['ナレーター', 'ja-nu', '{一番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['{鈴木|すずき}', 'ja-nu', 'ワンさん、{三回|さんかい}も{見直|みなお}しただけあって、{今度|こんど}の{資料|しりょう}は{完璧|かんぺき}ね。', 'Wan-san, sankai mo minaoshita dake atte, kondo no shiryou wa kanpeki ne.', 'Wang này, xem lại tận ba lần có khác, tài liệu lần này hoàn hảo đấy.'],
      ['ナレーター', 'ja-nu', '{二番|にばん}。', 'Niban.', 'Câu 2.'],
      ['カルロス', 'ja-nam', 'ごめん、{遅|おく}れて。バスが{全然|ぜんぜん}{来|こ}なかったもんだから。', 'Gomen, okurete. Basu ga zenzen konakatta mon da kara.', 'Xin lỗi, tớ đến muộn. Tại xe buýt mãi chẳng tới.'],
      ['ナレーター', 'ja-nu', '{三番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['{森課長|もりかちょう}', 'ja-nam', '{確認|かくにん}を{一|ひと}つ{飛|と}ばしたばかりに、{大変|たいへん}なことになりましたね。', 'Kakunin o hitotsu tobashita bakari ni, taihen na koto ni narimashita ne.', 'Chỉ vì bỏ qua một bước kiểm tra mà thành chuyện lớn rồi nhỉ.'],
      ['ナレーター', 'ja-nu', '{四番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['マリヤム', 'ja-nu', '{楽|たの}しみにしてた{旅行|りょこう}だっただけに、{雨|あめ}で{中止|ちゅうし}なんて{残念|ざんねん}すぎる。', 'Tanoshimi ni shiteta ryokou datta dake ni, ame de chuushi nante zannen sugiru.', 'Chính vì là chuyến đi mong chờ nên bị huỷ vì mưa thì tiếc quá đi mất.'],
      ['ナレーター', 'ja-nu', '{五番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['{大野|おおの}', 'ja-nam', 'この{池|いけ}は、{形|かたち}がひょうたんに{似|に}ていることから、「ひょうたん{池|いけ}」と{呼|よ}ばれているんですよ。', 'Kono ike wa, katachi ga hyoutan ni nite iru koto kara, "Hyoutan-ike" to yobarete iru n desu yo.', 'Cái ao này được gọi là "ao Hồ Lô" vì hình dáng giống quả bầu hồ lô đấy.'],
      ['ナレーター', 'ja-nu', '{六番|ろくばん}。', 'Rokuban.', 'Câu 6.'],
      ['ワン', 'ja-nu', '{几帳面|きちょうめん}な{森課長|もりかちょう}のことだから、{明日|あした}の{準備|じゅんび}はもう{終|お}わってるんじゃないですか。', 'Kichoumen na Mori kachou no koto da kara, ashita no junbi wa mou owatteru n ja nai desu ka.', 'Trưởng phòng Mori vốn chu đáo, chắc việc chuẩn bị cho ngày mai xong rồi chị nhỉ.'],
    ]),
    {
      t: 'mcq',
      id: 'b48-ng-4-q',
      title: 'Bài 4 — chọn câu đáp tự nhiên nhất (6 câu)',
      items: DOI([
        { q: '{一番|いちばん}：「{三回|さんかい}も{見直|みなお}しただけあって、{今度|こんど}の{資料|しりょう}は{完璧|かんぺき}ね。」', options: ['ありがとうございます。{鈴木|すずき}さんが{教|おし}えてくださったおかげです。', 'すみません、すぐ{直|なお}します。', '{三回|さんかい}も{見直|みなお}したのに、{残念|ざんねん}ですね。'], correct: 0, why: '**だけあって** = lời KHEN → đáp **cảm ơn + khiêm tốn** (おかげです). Câu 2, 3 hiểu nhầm là bị chê.' },
        { q: '{二番|にばん}：「ごめん、{遅|おく}れて。バスが{全然|ぜんぜん}{来|こ}なかったもんだから。」', options: ['{大丈夫|だいじょうぶ}、まだ{始|はじ}まってないよ。', 'じゃあ、バスで{来|き}てね。', 'もんだから、{急|いそ}いでね。'], correct: 0, why: '**もんだから** = xin lỗi + lý do → đáp "**không sao**". Câu 2 vô nghĩa (bạn đã đi xe buýt).' },
        { q: '{三番|さんばん}：「{確認|かくにん}を{一|ひと}つ{飛|と}ばしたばかりに、{大変|たいへん}なことになりましたね。」', options: ['はい、{本当|ほんとう}に{申|もう}し{訳|わけ}ありません。{二度|にど}としないようにします。', 'はい、おかげさまで{助|たす}かりました。', 'はい、{確認|かくにん}したので{大丈夫|だいじょうぶ}です。'], correct: 0, why: '**ばかりに** = hậu quả xấu do một sơ suất → đáp **xin lỗi + hứa không tái phạm**. おかげさまで (câu 2) dùng cho chuyện tốt.' },
        { q: '{四番|よんばん}：「{楽|たの}しみにしてた{旅行|りょこう}だっただけに、{雨|あめ}で{中止|ちゅうし}なんて{残念|ざんねん}すぎる。」', options: ['{本当|ほんとう}だね。また{計画|けいかく}しようよ。', '{楽|たの}しみじゃなかったんだね。', '{雨|あめ}でよかったね。'], correct: 0, why: '**だけに** + thất vọng mạnh → đáp **đồng cảm + an ủi**. Câu 2 hiểu ngược (bạn ấy rất mong chờ).' },
        { q: '{五番|ごばん}：「この{池|いけ}は、{形|かたち}がひょうたんに{似|に}ていることから、「ひょうたん{池|いけ}」と{呼|よ}ばれているんですよ。」', options: ['へえ、{言|い}われてみれば、そんな{形|かたち}ですね。', 'ひょうたんを{池|いけ}に{入|い}れたんですか。', '{呼|よ}んでも{来|こ}ないですね。'], correct: 0, why: '**ことから～と{呼|よ}ばれている** = giải thích nguồn gốc tên (vì hình dáng) → đáp "**à, nhìn kỹ đúng là vậy**".' },
        { q: '{六番|ろくばん}：「{几帳面|きちょうめん}な{森課長|もりかちょう}のことだから、{明日|あした}の{準備|じゅんび}はもう{終|お}わってるんじゃないですか。」', options: ['そうね、きっともう{終|お}わってるわね。', 'そうね、{課長|かちょう}は{準備|じゅんび}が{苦手|にがて}だからね。', 'じゃあ、{課長|かちょう}に{準備|じゅんび}をさせましょう。'], correct: 0, why: '**Nのことだから** = đoán theo tính cách (chu đáo) → đồng ý **きっと～**. Câu 2 trái với "几帳面".' },
      ], 1),
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題5 統合理解 (1): chọn tuyến đi bộ tìm hiểu lịch sử khu phố' },
    NG('b48-ng-5', '{二人|ふたり}はどのコースに{参加|さんか}しますか', 'Dạng 統合理解 (thông tin + 2 người bàn) — vẽ bảng: tuyến × (thời gian, phí, đặc điểm). A "Dốc & thung lũng": 2 tiếng, miễn phí, nhiều dốc, cảnh đẹp. B "Bờ biển": 1 tiếng rưỡi, 500 yên, đường bằng, bến cảng cũ + bãi cát xưa, kết thúc ở quán món địa phương. C "Tiệm lâu đời": 1 tiếng, 1.000 yên, thử bánh. Mariam: đau chân sau hôm qua → loại A; muốn ăn món địa phương. Daniel: muốn chụp biển, quá 500 yên thì không. → B.', [
      ['ナレーター', 'ja-nu', '{郷土資料館|きょうどしりょうかん}で、{係|かかり}の{人|ひと}がまち{歩|ある}きのコースについて{説明|せつめい}しています。', 'Kyoudo shiryoukan de, kakari no hito ga machiaruki no koosu ni tsuite setsumei shite imasu.', 'Ở bảo tàng địa phương, nhân viên đang giới thiệu các tuyến đi bộ tìm hiểu khu phố.'],
      ['{係|かかり}の{人|ひと}', 'ja-nu', '{今日|きょう}のコースは{三|みっ}つです。Aの「{坂|さか}と{谷|たに}のコース」は{二時間|にじかん}で、{参加費|さんかひ}は{無料|むりょう}です。{坂|さか}が{多|おお}いので{少|すこ}し{大変|たいへん}ですが、{丘|おか}の{上|うえ}からの{景色|けしき}は{見事|みごと}ですよ。', 'Kyou no koosu wa mittsu desu. Ee no "saka to tani no koosu" wa nijikan de, sankahi wa muryou desu. Saka ga ooi node sukoshi taihen desu ga, oka no ue kara no keshiki wa migoto desu yo.', 'Hôm nay có ba tuyến. Tuyến A "Dốc và thung lũng" đi hai tiếng, phí tham gia miễn phí. Nhiều dốc nên hơi vất vả, nhưng cảnh từ trên đồi nhìn xuống rất đẹp.'],
      ['{係|かかり}の{人|ひと}', 'ja-nu', 'Bの「{海岸|かいがん}コース」は{一時間半|いちじかんはん}で、{五百円|ごひゃくえん}です。{平|たい}らな{道|みち}で、{昔|むかし}の{港|みなと}と{砂浜|すなはま}があった{場所|ばしょ}を{歩|ある}きます。{最後|さいご}は{郷土料理|きょうどりょうり}のお{店|みせ}で{解散|かいさん}なので、そのまま{昼|ひる}ご{飯|はん}も{食|た}べられます。', 'Bii no "kaigan koosu" wa ichijikan han de, gohyaku en desu. Taira na michi de, mukashi no minato to sunahama ga atta basho o arukimasu. Saigo wa kyoudo ryouri no omise de kaisan na node, sono mama hirugohan mo taberaremasu.', 'Tuyến B "Bờ biển" đi một tiếng rưỡi, 500 yên. Đường bằng phẳng, đi qua chỗ ngày xưa có bến cảng và bãi cát. Cuối tuyến giải tán ở quán món ăn địa phương nên có thể ăn trưa luôn.'],
      ['{係|かかり}の{人|ひと}', 'ja-nu', 'Cの「{老舗|しにせ}めぐりコース」は{一時間|いちじかん}で、{千円|せんえん}です。{商店街|しょうてんがい}の{古|ふる}いお{店|みせ}を{回|まわ}って、{和菓子|わがし}の{試食|ししょく}もあります。', 'Shii no "shinise meguri koosu" wa ichijikan de, sen en desu. Shoutengai no furui omise o mawatte, wagashi no shishoku mo arimasu.', 'Tuyến C "Dạo các tiệm lâu đời" đi một tiếng, 1.000 yên. Đi quanh các cửa hàng cũ trong phố buôn bán, có cả thử bánh kẹo Nhật.'],
      ['マリヤム', 'ja-nu', 'Aの{景色|けしき}、{見|み}てみたいけど……{昨日|きのう}{歩|ある}きすぎたもんだから、まだ{足|あし}が{痛|いた}いの。{坂|さか}が{多|おお}いのは{無理|むり}かも。', 'Ee no keshiki, mite mitai kedo…… kinou arukisugita mon da kara, mada ashi ga itai no. Saka ga ooi no wa muri kamo.', 'Cảnh của tuyến A tớ muốn xem lắm, nhưng… tại hôm qua đi bộ nhiều quá nên chân vẫn còn đau. Nhiều dốc thì chắc không nổi.'],
      ['ダニエル', 'ja-nam', 'じゃあ、Cは？ {和菓子|わがし}も{食|た}べられるし。', 'Jaa, shii wa? Wagashi mo taberareru shi.', 'Vậy tuyến C thì sao? Còn được ăn bánh nữa.'],
      ['マリヤム', 'ja-nu', 'うーん、{千円|せんえん}はちょっと……。それに、{私|わたし}は{甘|あま}い{物|もの}より、この{町|まち}の{郷土料理|きょうどりょうり}が{食|た}べてみたいな。', 'Uun, sen en wa chotto……. Sore ni, watashi wa amai mono yori, kono machi no kyoudo ryouri ga tabete mitai na.', 'Ừm, 1.000 yên thì hơi… Với lại, so với đồ ngọt, tớ muốn thử món ăn địa phương của thị trấn này hơn.'],
      ['ダニエル', 'ja-nam', '{僕|ぼく}も{海|うみ}の{写真|しゃしん}が{撮|と}りたかったし、{五百円|ごひゃくえん}ならいいよ。じゃあ、それにしよう。', 'Boku mo umi no shashin ga toritakatta shi, gohyaku en nara ii yo. Jaa, sore ni shiyou.', 'Tớ cũng muốn chụp ảnh biển, 500 yên thì được. Vậy chọn tuyến đó đi.'],
      ['ナレーター', 'ja-nu', '{二人|ふたり}はどのコースに{参加|さんか}しますか。', 'Futari wa dono koosu ni sanka shimasu ka.', 'Hai người sẽ tham gia tuyến nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b48-ng-5-q',
      title: 'Bài 5 — chọn đáp án',
      items: DOI([
        { q: '{二人|ふたり}はどのコースに{参加|さんか}しますか。', options: ['Bの「{海岸|かいがん}コース」', 'Aの「{坂|さか}と{谷|たに}のコース」', 'Cの「{老舗|しにせ}めぐりコース」', 'どのコースにも{参加|さんか}しない'], correct: 0, why: 'A: nhiều dốc — Mariam **{足|あし}が{痛|いた}い**, **{無理|むり}かも** (loại). C: **{千円|せんえん}はちょっと**, muốn ăn **{郷土料理|きょうどりょうり}** hơn đồ ngọt (loại). B: đường bằng, kết thúc ở quán **{郷土料理|きょうどりょうり}**, có biển để chụp, **{五百円|ごひゃくえん}ならいい** → B.' },
        { q: '{女|おんな}の{学生|がくせい}がAのコースを{選|えら}ばなかったのは、なぜですか。', options: ['{前|まえ}の{日|ひ}に{歩|ある}きすぎて、{足|あし}が{痛|いた}いから', '{景色|けしき}に{興味|きょうみ}がないから', '{参加費|さんかひ}が{高|たか}いから', '{時間|じかん}が{短|みじか}すぎるから'], correct: 0, why: '**{昨日|きのう}{歩|ある}きすぎたもんだから、まだ{足|あし}が{痛|いた}い** — もんだから (mục ④) nói lý do cá nhân. Phí của A là **{無料|むりょう}**.' },
      ]),
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題5 統合理解 (2): ba biện pháp phòng tái diễn — hai người chọn khác nhau' },
    NG('b48-ng-6', '{質問|しつもん}1：{女|おんな}の{人|ひと}はどの{案|あん}がいいと{言|い}っていますか　{質問|しつもん}2：{男|おとこ}の{人|ひと}はどの{案|あん}がいいと{言|い}っていますか', 'Dạng 統合理解 (thông tin + 2 người, 2 câu hỏi) — ghi bảng 3 phương án: ① luôn kiểm tra hai người (làm ngay, nhưng ca đêm thiếu người) · ② công cụ kiểm tra tự động (mất một tháng, tốn phí, chạy cả khi không có người) · ③ sửa quy trình + đào tạo (từ tuần sau). Nữ (Suzuki): nhóm làm đêm nhiều, khó có đủ hai người → ②. Nam (Tamura): nhóm nhiều người mới, lỗi do chưa hiểu quy trình → ③.', [
      ['ナレーター', 'ja-nu', '{会社|かいしゃ}の{会議|かいぎ}で、{課長|かちょう}が{再発防止策|さいはつぼうしさく}の{案|あん}を{説明|せつめい}しています。', 'Kaisha no kaigi de, kachou ga saihatsu boushisaku no an o setsumei shite imasu.', 'Trong cuộc họp ở công ty, trưởng phòng đang trình bày các phương án phòng tái diễn.'],
      ['{森課長|もりかちょう}', 'ja-nam', '{先週|せんしゅう}の{障害|しょうがい}を{受|う}けて、{案|あん}を{三|みっ}つ{考|かんが}えました。{一|ひと}つ{目|め}は、{本番|ほんばん}の{作業|さぎょう}は{必|かなら}ず{二人|ふたり}で{確認|かくにん}すること。すぐに{始|はじ}められますが、{夜|よる}の{作業|さぎょう}は{人|ひと}が{足|た}りなくなりがちです。', 'Senshuu no shougai o ukete, an o mittsu kangaemashita. Hitotsume wa, honban no sagyou wa kanarazu futari de kakunin suru koto. Sugu ni hajimeraremasu ga, yoru no sagyou wa hito ga tarinaku narigachi desu.', 'Sau sự cố tuần trước, tôi đã nghĩ ra ba phương án. Thứ nhất, thao tác trên hệ thống thật nhất định phải có hai người cùng kiểm tra. Bắt đầu được ngay, nhưng thao tác ban đêm thì hay bị thiếu người.'],
      ['{森課長|もりかちょう}', 'ja-nam', '{二|ふた}つ{目|め}は、{設定|せってい}の{間違|まちが}いを{見|み}つける{自動|じどう}チェックの{仕組|しく}みを{入|い}れること。{準備|じゅんび}に{一|いっ}か{月|げつ}かかり、{費用|ひよう}も{少|すこ}しかかりますが、{人|ひと}がいなくても{動|うご}きます。{三|みっ}つ{目|め}は、{手順書|てじゅんしょ}を{見直|みなお}して、{全員|ぜんいん}に{研修|けんしゅう}をすること。これは{来週|らいしゅう}から{始|はじ}められます。', 'Futatsume wa, settei no machigai o mitsukeru jidou chekku no shikumi o ireru koto. Junbi ni ikkagetsu kakari, hiyou mo sukoshi kakarimasu ga, hito ga inakute mo ugokimasu. Mittsume wa, tejunsho o minaoshite, zen\'in ni kenshuu o suru koto. Kore wa raishuu kara hajimeraremasu.', 'Thứ hai, đưa vào cơ chế kiểm tra tự động để phát hiện lỗi cấu hình. Chuẩn bị mất một tháng, cũng tốn chút chi phí, nhưng không có người vẫn chạy. Thứ ba, sửa lại bản quy trình và đào tạo cho tất cả mọi người. Cái này bắt đầu được từ tuần sau.'],
      ['{鈴木|すずき}', 'ja-nu', '{私|わたし}のチームは{夜間|やかん}の{作業|さぎょう}が{多|おお}いので、{二人|ふたり}そろうのはなかなか{難|むずか}しいんです。{一|いっ}か{月|げつ}かかっても、{人|ひと}がいなくても{間違|まちが}いを{止|と}められる{仕組|しく}みのほうが{安心|あんしん}だと{思|おも}います。', 'Watashi no chiimu wa yakan no sagyou ga ooi node, futari sorou no wa nakanaka muzukashii n desu. Ikkagetsu kakatte mo, hito ga inakute mo machigai o tomerareru shikumi no hou ga anshin da to omoimasu.', 'Nhóm tôi làm đêm nhiều nên khó mà có đủ hai người. Dù mất một tháng, tôi nghĩ một cơ chế chặn được lỗi cả khi không có người thì yên tâm hơn.'],
      ['{田村|たむら}', 'ja-nam', 'うちのチームは{新人|しんじん}が{多|おお}いだけに、そもそも{手順|てじゅん}をよく{理解|りかい}していないことから{起|お}きるミスが{目立|めだ}つんです。{仕組|しく}みを{入|い}れる{前|まえ}に、まず{全員|ぜんいん}が{手順|てじゅん}の{意味|いみ}を{分|わ}かるようにしたいですね。', 'Uchi no chiimu wa shinjin ga ooi dake ni, somosomo tejun o yoku rikai shite inai koto kara okiru misu ga medatsu n desu. Shikumi o ireru mae ni, mazu zen\'in ga tejun no imi o wakaru you ni shitai desu ne.', 'Nhóm tôi chính vì nhiều người mới nên lỗi phát sinh từ chỗ chưa hiểu rõ quy trình nổi lên rõ. Trước khi đưa cơ chế vào, tôi muốn làm sao để mọi người hiểu ý nghĩa của quy trình đã.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'なるほど。チームによって{必要|ひつよう}なものが{違|ちが}うんですね。{両方|りょうほう}{検討|けんとう}しましょう。', 'Naruhodo. Chiimu ni yotte hitsuyou na mono ga chigau n desu ne. Ryouhou kentou shimashou.', 'Ra vậy. Mỗi nhóm cần một thứ khác nhau nhỉ. Hãy cân nhắc cả hai.'],
      ['ナレーター', 'ja-nu', '{質問|しつもん}1、{女|おんな}の{人|ひと}はどの{案|あん}がいいと{言|い}っていますか。{質問|しつもん}2、{男|おとこ}の{人|ひと}はどの{案|あん}がいいと{言|い}っていますか。', 'Shitsumon ichi, onna no hito wa dono an ga ii to itte imasu ka. Shitsumon ni, otoko no hito wa dono an ga ii to itte imasu ka.', 'Câu hỏi 1: người nữ nói phương án nào tốt? Câu hỏi 2: người nam nói phương án nào tốt?'],
    ]),
    {
      t: 'mcq',
      id: 'b48-ng-6-q',
      title: 'Bài 6 — 2 câu hỏi',
      items: [
        { q: '{質問|しつもん}1：{女|おんな}の{人|ひと}はどの{案|あん}がいいと{言|い}っていますか。', options: ['{必|かなら}ず{二人|ふたり}で{確認|かくにん}する', '{自動|じどう}チェックの{仕組|しく}みを{入|い}れる', '{手順書|てじゅんしょ}を{見直|みなお}して{研修|けんしゅう}をする', 'どの{案|あん}もよくない'], correct: 1, why: 'Nhóm của chị **{夜間|やかん}の{作業|さぎょう}が{多|おお}い** → hai người khó (loại ①). **{一|いっ}か{月|げつ}かかっても、{人|ひと}がいなくても{間違|まちが}いを{止|と}められる{仕組|しく}み** → ② tự động.' },
        { q: '{質問|しつもん}2：{男|おとこ}の{人|ひと}はどの{案|あん}がいいと{言|い}っていますか。', options: ['{必|かなら}ず{二人|ふたり}で{確認|かくにん}する', '{自動|じどう}チェックの{仕組|しく}みを{入|い}れる', '{手順書|てじゅんしょ}を{見直|みなお}して{研修|けんしゅう}をする', 'どの{案|あん}もよくない'], correct: 2, why: '**{新人|しんじん}が{多|おお}いだけに…{手順|てじゅん}をよく{理解|りかい}していないことから{起|お}きるミス** + **{仕組|しく}みを{入|い}れる{前|まえ}に、まず{全員|ぜんいん}が{手順|てじゅん}の{意味|いみ}を{分|わ}かるように** → ③ sửa quy trình + đào tạo.' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới & điểm nghe trong bài 5–6',
      items: [
        '**{郷土資料館|きょうどしりょうかん}** (bảo tàng tư liệu địa phương) · **{参加費|さんかひ}** (phí tham gia) · **{平|たい}らな** (bằng phẳng) · **{解散|かいさん}** (giải tán — kết thúc tour) · **{試食|ししょく}** (ăn thử) · **めぐり** (đi một vòng qua nhiều nơi) · **{本番|ほんばん}** (môi trường thật, buổi chính thức) · **～がちだ** (hay bị… — Bài 34) · **{仕組|しく}み** (cơ chế) · **そろう** (đủ mặt) · **そもそも** (vốn dĩ, ngay từ đầu — N2) · **{目立|めだ}つ** (nổi bật).',
        'Ngữ pháp của bài nằm ngay trong lý do của từng người: **{歩|ある}きすぎたもんだから** (Mariam — lý do cá nhân), **{新人|しんじん}が{多|おお}いだけに** (Tamura — "chính vì… nên càng"), **{理解|りかい}していないことから{起|お}きる** (ことから — nguồn gốc của lỗi). Nghe ra ba mẫu này là nghe ra điều kiện của từng người.',
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b48-doc',
  kind: 'reading',
  title: 'Đọc hiểu N2 — tờ giới thiệu triển lãm "Địa danh kể chuyện" (情報検索), hai ý kiến A/B "khi mắc lỗi, tìm nguyên nhân ở mình hay ở cơ chế?" (統合理解), bài luận ~950 chữ "Hãy nghi ngờ câu “người càng… thì càng…”" (主張理解)',
  goal: 'Tìm nhanh thông tin trong tờ giới thiệu triển lãm (phí theo đối tượng, ngày miễn phí, cách tham gia buổi thuyết minh, điều cấm) — đọc được câu ～ことから「～」の名が付いた; so sánh hai ý kiến về nguyên nhân của sai sót (điểm chung · điểm khác) — nhận ra ～ばかりに・～ものだから・～ことから trong lập luận; nắm chủ trương của người viết trong bài luận dài về tương quan và nhân quả (相関・因果関係・錯覚・仮説・検証).',
  minutes: 60,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc hiểu đề N2 — dạng nào gặp trong bài này',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài 48'],
      rows: [
        ['問題10', '内容理解（短文）', '~200 chữ × 5', 'Bài 1 — từng mục ngắn của tờ giới thiệu'],
        ['問題13', '情報検索', '~700 chữ, 2 câu', 'Bài 1 — tờ giới thiệu triển lãm bảo tàng địa phương (4 câu)'],
        ['問題11', '統合理解', '2 bài ~300 chữ, 2 câu', 'Bài 2 — ý kiến A / B về nguyên nhân của sai sót (3 câu)'],
        ['問題12', '主張理解（長文）', '~900 chữ, 3 câu', 'Bài 3 — bài luận về tương quan và nhân quả'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc văn bản NHÂN QUẢ — N2',
      items: [
        '**Tờ thông báo (情報検索)**: đọc **câu hỏi trước**, gạch **điều kiện của người hỏi** (sinh viên? sống ở khu nào? đi ngày nào? mấy người?) rồi nhảy đúng mục (【{観覧料|かんらんりょう}】【{展示解説|てんじかいせつ}】【ご{注意|ちゅうい}】). Dấu **※** là chỗ hay giấu **ngoại lệ** (giảm nửa giá, ngày miễn phí) — đáp án thường nằm ở đó.',
        '**Hai ý kiến (統合理解)**: kẻ bảng A | B, ghi **lập trường** và **lý do**. Chú ý câu **nhượng bộ** (もちろん～もある・～が{無意味|むいみ}だとは{言|い}わない) — đó thường là **điểm chung** của hai bài.',
        '**Bài luận (主張理解)**: ví dụ cụ thể (朝食・サプリ) chỉ để minh hoạ. Chủ trương ở **đoạn cuối**, sau **{大切|たいせつ}なのは・～ではないだろうか**. Đáp án sai hay là **ý cực đoan** ("đừng tin dữ liệu", "chỉ nhà nghiên cứu mới cần").',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 情報検索: tờ giới thiệu triển lãm của bảo tàng địa phương' },
    {
      t: 'passage',
      title: 'みなと{区|く}{郷土資料館|きょうどしりょうかん}　{秋|あき}の{特別展|とくべつてん}「{地名|ちめい}は{語|かた}る　～{坂|さか}・{谷|たに}・{浜|はま}の{物語|ものがたり}～」',
      intro: 'リンさんは、{卒論|そつろん}の{資料|しりょう}を{集|あつ}めるため、{土曜日|どようび}にカルロスさんとこの{展示|てんじ}を{見|み}に{行|い}こうと{思|おも}っている。{二人|ふたり}ともみなと{区|く}には{住|す}んでいない{大学生|だいがくせい}である。（{施設名|しせつめい}・{料金|りょうきん}は{架空|かくう}のものです。）',
      paras: [
        { label: '内容', text: '【{内容|ないよう}】みなと{区|く}には「{浜見坂|はまみざか}」「{桜|さくら}が{丘|おか}」「{谷町|たにまち}」など、{地形|ちけい}に{由来|ゆらい}する{地名|ちめい}が{数多|かずおお}く{残|のこ}っています。{本展|ほんてん}では、{古|ふる}い{地図|ちず}や{写真|しゃしん}を{通|とお}して、それぞれの{地名|ちめい}がどのような{理由|りゆう}で{付|つ}けられたのかを{紹介|しょうかい}します。{例|たと}えば「{浜見坂|はまみざか}」は、{坂|さか}の{上|うえ}から{砂浜|すなはま}がよく{見|み}えたことから、その{名|な}が{付|つ}いたと{言|い}われています。' },
        { label: '期間', text: '【{期間|きかん}】10{月|がつ}1{日|ついたち}（{火|か}）～11{月|がつ}30{日|にち}（{土|ど}）　{午前|ごぜん}9{時|じ}～{午後|ごご}5{時|じ}（{入館|にゅうかん}は{午後|ごご}4{時|じ}30{分|ぷん}まで）　{休館日|きゅうかんび}：{毎週|まいしゅう}{月曜日|げつようび}（{月曜日|げつようび}が{祝日|しゅくじつ}の{場合|ばあい}は{翌日|よくじつ}）' },
        { label: '料金', text: '【{観覧料|かんらんりょう}】{一般|いっぱん} 500{円|えん}／{大学生|だいがくせい}・{高校生|こうこうせい} 300{円|えん}（{学生証|がくせいしょう}をお{見|み}せください）／{中学生|ちゅうがくせい}{以下|いか} {無料|むりょう}　※みなと{区|く}にお{住|す}まいの{方|かた}は、{一般|いっぱん}・{学生|がくせい}とも{半額|はんがく}になります。　※{毎月|まいつき}{第|だい}3{日曜日|にちようび}は「{郷土|きょうど}の{日|ひ}」のため、どなたでも{無料|むりょう}です。' },
        { label: '解説', text: '【{展示解説|てんじかいせつ}】{学芸員|がくげいいん}による{解説|かいせつ}を、{毎週|まいしゅう}{土曜日|どようび}・{日曜日|にちようび}の{午前|ごぜん}11{時|じ}と{午後|ごご}2{時|じ}に{行|おこな}います（{各回|かくかい}30{分|ぷん}、{定員|ていいん}20{名|めい}）。{参加|さんか}は{無料|むりょう}ですが、{当日|とうじつ}、{受付|うけつけ}で{整理券|せいりけん}をお{受|う}け{取|と}りください。{整理券|せいりけん}は{各回|かくかい}の30{分|ぷん}{前|まえ}からお{配|くば}りします。' },
        { label: '注意', text: '【ご{注意|ちゅうい}】{展示室内|てんじしつない}での{写真撮影|しゃしんさつえい}はご{遠慮|えんりょ}ください（ロビーの{大型|おおがた}{地図|ちず}のみ{撮影|さつえい}できます）。10{名|めい}{以上|いじょう}の{団体|だんたい}でお{越|こ}しの{場合|ばあい}は、1{週間|しゅうかん}{前|まえ}までにお{電話|でんわ}でご{予約|よやく}ください。お{問|と}い{合|あ}わせ{先|さき}は、{資料館|しりょうかん}のホームページをご{覧|らん}ください。' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài đọc (không cần học thuộc)',
      items: [
        '**{語|かた}る** (kể, nói lên) · **{物語|ものがたり}** (câu chuyện) · **{数多|かずおお}く** (rất nhiều — văn viết) · **{本展|ほんてん}** (triển lãm này) · **～を{通|とお}して** (thông qua) · **{入館|にゅうかん}** (vào bảo tàng) · **{休館日|きゅうかんび}** (ngày nghỉ) · **{翌日|よくじつ}** (ngày hôm sau) · **{観覧料|かんらんりょう}** (vé tham quan) · **お{住|す}まいの{方|かた}** (người sống ở — kính ngữ) · **{半額|はんがく}** (nửa giá) · **{学芸員|がくげいいん}** (người phụ trách chuyên môn ở bảo tàng) · **{定員|ていいん}** (số người tối đa) · **{整理券|せいりけん}** (phiếu số thứ tự) · **ご{遠慮|えんりょ}ください** (xin đừng…) · **お{越|こ}しの{場合|ばあい}** (khi quý khách đến — kính ngữ).',
        'Câu của bài: **～ことから、その{名|な}が{付|つ}いたと{言|い}われています** (mục ② — nguồn gốc tên gọi, văn bảng giới thiệu). Số tiền, ngày giờ là **minh hoạ**.',
      ],
    },
    {
      t: 'mcq',
      id: 'b48-doc-1',
      title: 'Bài 1 — 4 câu (情報検索)',
      items: DOI([
        { q: 'リンさんとカルロスさんが、{普通|ふつう}の{土曜日|どようび}に{二人|ふたり}で{展示|てんじ}を{見|み}る{場合|ばあい}、{観覧料|かんらんりょう}は{合計|ごうけい}いくらですか。', options: ['600{円|えん}', '300{円|えん}', '1,000{円|えん}', '{無料|むりょう}'], correct: 0, why: 'Hai người là **{大学生|だいがくせい}** (300{円|えん}/người) và **không sống ở みなと区** (không được giảm nửa giá) → 300 × 2 = **600{円|えん}**. Ngày miễn phí là **{第|だい}3{日曜日|にちようび}**, không phải thứ Bảy.' },
        { q: '{土曜日|どようび}の{午後|ごご}2{時|じ}の{展示解説|てんじかいせつ}に{参加|さんか}したい{場合|ばあい}、どうすればいいですか。', options: ['{当日|とうじつ}の{午後|ごご}1{時|じ}30{分|ぷん}{以降|いこう}に、{受付|うけつけ}で{整理券|せいりけん}をもらう', '1{週間|しゅうかん}{前|まえ}までに{電話|でんわ}で{予約|よやく}する', '{当日|とうじつ}の{午前|ごぜん}9{時|じ}に{受付|うけつけ}で{整理券|せいりけん}をもらう', '{参加費|さんかひ}300{円|えん}を{払|はら}う'], correct: 0, why: '**{当日|とうじつ}、{受付|うけつけ}で{整理券|せいりけん}** + **{各回|かくかい}の30{分|ぷん}{前|まえ}から** → 2 giờ chiều thì từ 1 giờ 30. Đặt trước bằng điện thoại chỉ dành cho **đoàn 10 người trở lên**; thuyết minh **miễn phí**.' },
        { q: 'この{展示|てんじ}について、{正|ただ}しいものはどれですか。', options: ['{毎月|まいつき}{第|だい}3{日曜日|にちようび}は、{区外|くがい}に{住|す}む{大学生|だいがくせい}も{無料|むりょう}で{入|はい}れる。', '{展示室|てんじしつ}の{中|なか}でも、{自由|じゆう}に{写真|しゃしん}を{撮|と}ってよい。', '10{名|めい}{以上|いじょう}で{行|い}くときは、{当日|とうじつ}に{電話|でんわ}で{予約|よやく}すればよい。', '{午後|ごご}5{時|じ}までなら、いつでも{入館|にゅうかん}できる。'], correct: 0, why: '**{郷土|きょうど}の{日|ひ}… どなたでも{無料|むりょう}** → ai cũng được. Chụp ảnh: chỉ **ロビーの{大型|おおがた}{地図|ちず}** (loại). Đoàn: **1{週間|しゅうかん}{前|まえ}まで** (loại). Vào cửa: **{午後|ごご}4{時|じ}30{分|ぷん}まで** (loại).' },
        { q: '「{浜見坂|はまみざか}」という{名前|なまえ}は、どうして{付|つ}いたと{書|か}かれていますか。', options: ['{坂|さか}の{上|うえ}から{砂浜|すなはま}がよく{見|み}えたから', '{浜|はま}という{名前|なまえ}の{人|ひと}が{坂|さか}を{作|つく}ったから', '{坂|さか}の{下|した}に{大|おお}きな{浜|はま}があるから', '{坂|さか}から{富士山|ふじさん}が{見|み}えたから'], correct: 0, why: '**{坂|さか}の{上|うえ}から{砂浜|すなはま}がよく{見|み}えたことから、その{名|な}が{付|つ}いた** — vế trước ことから là lý do của tên gọi.' },
      ]),
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 統合理解: hai ý kiến về nguyên nhân của sai sót' },
    {
      t: 'passage',
      title: 'A と B — 「ミスの{原因|げんいん}は、{自分|じぶん}に{求|もと}めるか、{仕組|しく}みに{求|もと}めるか」',
      paras: [
        { label: 'A', text: '{仕事|しごと}でミスをした{時|とき}、{私|わたし}はまず「{自分|じぶん}に{何|なに}が{足|た}りなかったのか」を{考|かんが}えるようにしている。{新人|しんじん}の{頃|ころ}、{確認|かくにん}を{一|ひと}つ{怠|おこた}ったばかりに、{取引先|とりひきさき}に{大|おお}きな{迷惑|めいわく}をかけたことがあるからだ。その{時|とき}、「{忙|いそが}しかったものですから」と{言|い}いたい{気持|きも}ちもあった。しかし、{原因|げんいん}を{周|まわ}りの{環境|かんきょう}にばかり{求|もと}めていると、{同|おな}じ{失敗|しっぱい}を{繰|く}り{返|かえ}しかねない。{自分|じぶん}の{不注意|ふちゅうい}を{素直|すなお}に{認|みと}めることから、{成長|せいちょう}は{始|はじ}まるのだと{思|おも}う。もちろん、{一人|ひとり}の{努力|どりょく}では{防|ふせ}げないミスもある。だからこそ、まず{自分|じぶん}にできることを{考|かんが}えたい。' },
        { label: 'B', text: 'ミスが{起|お}きると、{私|わたし}たちはつい「{誰|だれ}がやったのか」を{探|さが}してしまう。だが、ある{人|ひと}を{責|せ}めても、{同|おな}じ{条件|じょうけん}なら{別|べつ}の{人|ひと}が{同|おな}じミスをするだろう。ミスの{多|おお}くは、{個人|こじん}の{能力|のうりょく}よりも、{仕組|しく}みの{欠陥|けっかん}から{生|う}まれる。{例|たと}えば、{手順書|てじゅんしょ}に{確認|かくにん}の{欄|らん}がないことから、{確認漏|かくにんも}れが{何度|なんど}も{繰|く}り{返|かえ}される{職場|しょくば}は{少|すく}なくない。{個人|こじん}の{反省|はんせい}が{無意味|むいみ}だとは{言|い}わない。しかし、{最初|さいしょ}に{見直|みなお}すのは{仕組|しく}みのほうだ。{人|ひと}を{責|せ}めるより、{誰|だれ}がやっても{間違|まちが}えにくい{仕組|しく}みを{作|つく}ることが、{再発防止|さいはつぼうし}の{近道|ちかみち}である。' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới & ngữ pháp trong bài đọc 2',
      items: [
        '**～に{求|もと}める** (tìm, quy về: {原因|げんいん}を～に{求|もと}める = cho rằng nguyên nhân nằm ở…) · **{環境|かんきょう}** (môi trường, hoàn cảnh) · **{成長|せいちょう}** (trưởng thành) · **だからこそ** (chính vì thế mà — N2) · **{条件|じょうけん}** (điều kiện) · **{能力|のうりょく}** (năng lực) · **{職場|しょくば}** (nơi làm việc) · **{反省|はんせい}** (tự kiểm điểm) · **{無意味|むいみ}** (vô nghĩa) · **{近道|ちかみち}** (đường tắt).',
        'Ngữ pháp của bài trong lập luận: A dùng **{怠|おこた}ったばかりに** (tiếc nuối) và nhắc lời bào chữa **{忙|いそが}しかったものですから** để **phê phán** nó; A và B đều dùng **～ことから** — A: **{認|みと}めることから{成長|せいちょう}は{始|はじ}まる** (khởi đầu), B: **{欄|らん}がないことから{確認漏|かくにんも}れが{繰|く}り{返|かえ}される** (nguyên nhân).',
      ],
    },
    {
      t: 'mcq',
      id: 'b48-doc-2',
      title: 'Bài 2 — 3 câu (統合理解)',
      items: DOI([
        { q: 'AとBのどちらにも{述|の}べられていることは{何|なん}ですか。', options: ['{個人|こじん}の{努力|どりょく}だけでは{防|ふせ}げないミスもある。', 'ミスの{原因|げんいん}は、すべて{周|まわ}りの{環境|かんきょう}にある。', '{個人|こじん}が{反省|はんせい}することには{意味|いみ}がない。', 'ミスをした{人|ひと}は、{最初|さいしょ}に{取引先|とりひきさき}に{謝|あやま}るべきだ。'], correct: 0, why: 'A: **{一人|ひとり}の{努力|どりょく}では{防|ふせ}げないミスもある**. B: ミスの{多|おお}くは**{仕組|しく}みの{欠陥|けっかん}から{生|う}まれる**. Cả hai thừa nhận có lỗi cá nhân không ngăn nổi. B nói rõ **{反省|はんせい}が{無意味|むいみ}だとは{言|い}わない** (loại 3).' },
        { q: 'AとBの{考|かんが}え{方|かた}について、{正|ただ}しいものはどれですか。', options: ['Aはまず{自分|じぶん}に{足|た}りなかったことを{考|かんが}えると{述|の}べ、Bはまず{仕組|しく}みを{見直|みなお}すと{述|の}べている。', 'Aも Bも、まず{仕組|しく}みを{見直|みなお}すべきだと{述|の}べている。', 'Aは{人|ひと}を{責|せ}めるべきだと{述|の}べ、Bは{誰|だれ}も{責|せ}めるべきではないと{述|の}べている。', 'Aは{忙|いそが}しいことがミスの{原因|げんいん}だと{述|の}べ、Bは{能力|のうりょく}が{原因|げんいん}だと{述|の}べている。'], correct: 0, why: 'A: **まず「{自分|じぶん}に{何|なに}が{足|た}りなかったのか」を{考|かんが}える**. B: **{最初|さいしょ}に{見直|みなお}すのは{仕組|しく}みのほうだ**. B nói lỗi đến từ cơ chế **hơn là năng lực** (loại 4).' },
        { q: 'Bの{筆者|ひっしゃ}によると、{確認漏|かくにんも}れが{何度|なんど}も{繰|く}り{返|かえ}される{職場|しょくば}があるのは、なぜですか。', options: ['{手順書|てじゅんしょ}に{確認|かくにん}の{欄|らん}がないから', '{社員|しゃいん}の{能力|のうりょく}が{低|ひく}いから', 'ミスをした{人|ひと}を{責|せ}めないから', '{仕事|しごと}が{忙|いそが}しすぎるから'], correct: 0, why: '**{手順書|てじゅんしょ}に{確認|かくにん}の{欄|らん}がないことから、{確認漏|かくにんも}れが{何度|なんど}も{繰|く}り{返|かえ}される** — vế trước ことから là nguyên nhân.' },
      ]),
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 主張理解（長文）: "Hãy nghi ngờ câu “người càng… thì càng…”"' },
    {
      t: 'passage',
      title: '「～する{人|ひと}ほど～だ」を{疑|うたが}ってみる（{約|やく}950{字|じ}）',
      paras: [
        { label: '1', text: '「{朝食|ちょうしょく}を{毎日|まいにち}{食|た}べる{子|こ}どもほど、{成績|せいせき}がいい」。こうした{調査|ちょうさ}{結果|けっか}を、{新聞|しんぶん}やテレビで{目|め}にしたことがある{人|ひと}は{多|おお}いだろう。これを{聞|き}くと、「では、{朝|あさ}ご{飯|はん}を{食|た}べさせれば{成績|せいせき}が{上|あ}がるのか」と{考|かんが}えたくなる。しかし、{話|はなし}はそれほど{単純|たんじゅん}ではない。' },
        { label: '2', text: '{朝食|ちょうしょく}を{毎日|まいにち}{食|た}べる{家庭|かてい}は、{生活|せいかつ}のリズムが{規則正|きそくただ}しいことが{多|おお}い。{夜|よる}は{早|はや}く{寝|ね}て、{朝|あさ}は{決|き}まった{時間|じかん}に{起|お}きる。{家族|かぞく}が{子|こ}どもの{勉強|べんきょう}に{関心|かんしん}を{持|も}っている{家庭|かてい}も{多|おお}いかもしれない。つまり、{朝食|ちょうしょく}と{成績|せいせき}の{両方|りょうほう}に{影響|えいきょう}を{及|およ}ぼしている{別|べつ}の{要因|よういん}がある{可能性|かのうせい}があるのだ。そうだとすれば、{朝食|ちょうしょく}だけを{無理|むり}に{食|た}べさせても、{成績|せいせき}は{変|か}わらないということも{考|かんが}えられる。' },
        { label: '3', text: '{二|ふた}つのことが{一緒|いっしょ}に{変化|へんか}することを「{相関|そうかん}」と{言|い}い、{一方|いっぽう}がもう{一方|いっぽう}を{引|ひ}き{起|お}こしていることを「{因果関係|いんがかんけい}」と{言|い}う。{私|わたし}たちは、{相関|そうかん}を{見|み}つけると、ついそれを{因果関係|いんがかんけい}だと{錯覚|さっかく}してしまう。{原因|げんいん}が{分|わ}かれば{安心|あんしん}できるし、{話|はなし}も{分|わ}かりやすくなるからだ。{広告|こうこく}がこの{心理|しんり}を{利用|りよう}することもある。「このサプリを{飲|の}んでいる{人|ひと}ほど{元気|げんき}だ」と{言|い}われると、サプリのおかげだと{思|おも}いたくなる。だが、もともと{健康|けんこう}に{気|き}をつけている{人|ひと}たちだけに、サプリも{飲|の}むし、{運動|うんどう}もしている、ということなのかもしれない。' },
        { label: '4', text: 'では、データは{信|しん}じないほうがいいのだろうか。{私|わたし}はそうは{思|おも}わない。データは、{私|わたし}たちが{自分|じぶん}の{思|おも}い{込|こ}みに{気|き}づくための{大切|たいせつ}な{道具|どうぐ}である。{問題|もんだい}は、データそのものではなく、データから{結論|けつろん}を{急|いそ}ぐ{私|わたし}たちの{側|がわ}にある。' },
        { label: '5', text: '{大切|たいせつ}なのは、「なぜこの{二|ふた}つは{一緒|いっしょ}に{起|お}きるのか」と{一度|いちど}{立|た}ち{止|ど}まって{考|かんが}えることだ。ほかの{要因|よういん}はないか。{関係|かんけい}が{逆|ぎゃく}ではないか ―― {成績|せいせき}のいい{子|こ}どもほど、{朝|あさ}きちんと{起|お}きる{習慣|しゅうかん}を{持|も}ちやすいのではないか。{仮説|かせつ}を{立|た}て、それを{検証|けんしょう}する。それは{研究者|けんきゅうしゃ}だけの{仕事|しごと}ではない。{情報|じょうほう}があふれる{今|いま}の{社会|しゃかい}で、{一人一人|ひとりひとり}に{求|もと}められている{力|ちから}ではないだろうか。' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài đọc 3 (không cần học thuộc)',
      items: [
        '**{疑|うたが}う** (nghi ngờ) · **{目|め}にする** (nhìn thấy, bắt gặp) · **{単純|たんじゅん}** (đơn giản — N2) · **{規則正|きそくただ}しい** (điều độ) · **{関心|かんしん}を{持|も}つ** (quan tâm) · **そうだとすれば** (nếu đúng là vậy thì) · **{心理|しんり}** (tâm lý) · **{利用|りよう}する** (lợi dụng, tận dụng) · **サプリ** (thực phẩm chức năng — サプリメント) · **もともと** (vốn dĩ) · **{道具|どうぐ}** (công cụ) · **{側|がわ}** (phía) · **{逆|ぎゃく}** (ngược lại) · **あふれる** (tràn ngập).',
        'Ngữ pháp & từ của bài: **{影響|えいきょう}を{及|およ}ぼす・{引|ひ}き{起|お}こす・{相関|そうかん}・{因果関係|いんがかんけい}・{錯覚|さっかく}・{仮説|かせつ}・{検証|けんしょう}・{思|おも}い{込|こ}み** (nhóm A từ vựng) · **{人|ひと}たちだけに** (③ だけに — "chính vì vốn là người chú ý sức khoẻ nên…") · **サプリのおかげだと{思|おも}いたくなる** (おかげ — nguyên nhân tốt, Bài 27).',
      ],
    },
    {
      t: 'mcq',
      id: 'b48-doc-3',
      title: 'Bài 3 — 3 câu (主張理解)',
      items: DOI([
        { q: '「{話|はなし}はそれほど{単純|たんじゅん}ではない」とあるが、なぜか。', options: ['{朝食|ちょうしょく}と{成績|せいせき}の{両方|りょうほう}に{影響|えいきょう}している{別|べつ}の{要因|よういん}があるかもしれないから', '{朝食|ちょうしょく}を{食|た}べると、{成績|せいせき}が{下|さ}がることもあるから', '{調査|ちょうさ}の{結果|けっか}が{間違|まちが}っているから', '{朝食|ちょうしょく}を{食|た}べる{子|こ}どもが{少|すく}ないから'], correct: 0, why: 'Đoạn 2: **{両方|りょうほう}に{影響|えいきょう}を{及|およ}ぼしている{別|べつ}の{要因|よういん}がある{可能性|かのうせい}** (nhịp sinh hoạt, sự quan tâm của gia đình). Bài không nói kết quả điều tra sai.' },
        { q: '{筆者|ひっしゃ}によると、{人|ひと}が{相関|そうかん}を{因果関係|いんがかんけい}だと{錯覚|さっかく}しやすいのは、なぜか。', options: ['{原因|げんいん}が{分|わ}かると{安心|あんしん}でき、{話|はなし}も{分|わ}かりやすくなるから', 'データを{信|しん}じない{人|ひと}が{多|おお}いから', '{広告|こうこく}がいつも{正|ただ}しいことを{言|い}うから', '{相関|そうかん}と{因果関係|いんがかんけい}は{同|おな}じ{意味|いみ}だから'], correct: 0, why: 'Đoạn 3: **{原因|げんいん}が{分|わ}かれば{安心|あんしん}できるし、{話|はなし}も{分|わ}かりやすくなるからだ**.' },
        { q: 'この{文章|ぶんしょう}で{筆者|ひっしゃ}が{最|もっと}も{言|い}いたいことは{何|なに}か。', options: ['データから{結論|けつろん}を{急|いそ}がず、なぜ{一緒|いっしょ}に{起|お}きるのかを{考|かんが}える{力|ちから}が、{一人一人|ひとりひとり}に{必要|ひつよう}だ。', 'データは{思|おも}い{込|こ}みを{生|う}むので、{信|しん}じないほうがいい。', '{朝食|ちょうしょく}と{成績|せいせき}には、まったく{関係|かんけい}がない。', '{仮説|かせつ}を{立|た}てて{検証|けんしょう}するのは、{研究者|けんきゅうしゃ}の{仕事|しごと}である。'], correct: 0, why: 'Đoạn 4: データは**{大切|たいせつ}な{道具|どうぐ}** (loại 2). Đoạn 5 (chủ trương): **{一度|いちど}{立|た}ち{止|ど}まって{考|かんが}える…{研究者|けんきゅうしゃ}だけの{仕事|しごと}ではない…{一人一人|ひとりひとり}に{求|もと}められている{力|ちから}** (loại 4). Bài không phủ nhận hoàn toàn quan hệ (loại 3).' },
      ]),
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b48-noi',
  kind: 'speaking',
  title: 'Luyện nói — kể một thất bại và nguyên nhân thật (không bào chữa), giải thích nguồn gốc tên một nơi / món ăn ở quê, trả lời giám thị, trình bày 1 phút "Thất bại dạy tôi nhiều nhất", đọc to',
  goal: 'Trả lời câu hỏi của giám thị về nguyên nhân – kết quả theo khuôn "chuyện gì → vì sao (～ばかりに／～ことから) → học được gì"; giải thích nguồn gốc tên gọi bằng ～ことから～と呼ばれている; khen bằng ～だけあって, nói cảm xúc mạnh bằng ～だけに; biết dùng ～ものですから khi xin lỗi việc nhỏ và tránh nó khi báo cáo; trình bày 1 phút có dàn ý; đọc to đoạn 50 giây đúng trường âm và âm ngắt.',
  minutes: 50,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) nâng lên N2 — chủ đề Bài 48 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 48 xuất hiện ở đâu'],
      rows: [
        ['Reading', '30', 'Chuẩn bị 30 giây, đọc to đoạn ~170 chữ.', 'Đoạn "Nguồn gốc địa danh": {地名|ちめい}・{由来|ゆらい}・～ことから・{坂|さか}・{丘|おか}・{海岸|かいがん}…'],
        ['Talking — có tranh', '3 × 10', 'Nhìn tranh (người ngủ quên trên tàu, biển tên phố, quầy bánh lâu đời) trả lời 2–3 ý.', 'この{人|ひと}はどうして{困|こま}っているのですか · この{名前|なまえ}はどうしてついたと{思|おも}いますか'],
        ['Talking — không tranh', '2 × 10', 'Trả lời câu hỏi có lý do + ví dụ.', '{最近|さいきん}{失敗|しっぱい}したことはありますか · あなたの{国|くに}の{有名|ゆうめい}な{場所|ばしょ}の{名前|なまえ}の{由来|ゆらい}を{教|おし}えてください'],
        ['Presenting / Discussion (N2)', '20', 'Trình bày 1 phút, hoặc thảo luận với giám thị (giám thị phản biện).', 'Trình bày「{一番|いちばん}{多|おお}くを{学|まな}んだ{失敗|しっぱい}」 — dàn ý bên dưới · Phản biện: 「でも、それは{運|うん}が{悪|わる}かっただけじゃありませんか」'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 48 (cấp N2 — "nói nguyên nhân thật, không đổ lỗi")',
      items: [
        '**Ý 1 — chuyện gì xảy ra**: **{以前|いぜん}、～てしまったことがあります** · ngắn gọn, đúng sự thật.',
        '**Ý 2 — nguyên nhân**: **～ばかりに、～てしまいました** (tiếc nuối, nhận phần mình) · nếu là nguyên nhân khách quan: **～ことから、～と{分|わ}かりました** · ⚠ tránh mở đầu bằng **～ものですから** khi giám thị hỏi "vì sao thất bại" — nghe như đổ lỗi.',
        '**Ý 3 — học được gì / làm gì từ đó**: **それ{以来|いらい}、～ようにしています** (Bài 21) · **{同|おな}じことを{繰|く}り{返|かえ}さないように、～**.',
        '**Ý 4 — cảm xúc / kết**: **{一生懸命|いっしょうけんめい}{準備|じゅんび}しただけに、{本当|ほんとう}に{悔|くや}しかったです** · **でも、あの{失敗|しっぱい}があったからこそ、～**.',
        'Giám thị phản biện ("運が悪かっただけでは？") → **{確|たし}かに、{運|うん}もあったかもしれません。でも、{確認|かくにん}していれば{防|ふせ}げたことなので、{自分|じぶん}の{責任|せきにん}だと{思|おも}っています**.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — giám thị ↔ thí sinh',
      lines: [
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{最近|さいきん}、{何|なに}か{失敗|しっぱい}したことはありますか。', ro: 'Saikin, nanika shippai shita koto wa arimasu ka.', vi: 'Gần đây bạn có thất bại chuyện gì không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{先月|せんげつ}、アルバイトのシフトの{日|ひ}を{一日|いちにち}{間違|まちが}えて{覚|おぼ}えていたばかりに、お{店|みせ}に{行|い}かなかったことがあります。', ro: 'Hai. Sengetsu, arubaito no shifuto no hi o ichinichi machigaete oboete ita bakari ni, omise ni ikanakatta koto ga arimasu.', vi: 'Có ạ. Tháng trước, chỉ vì nhớ nhầm ngày ca làm thêm lệch một ngày mà tôi đã không đến cửa hàng.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: 'それは{大変|たいへん}でしたね。どうして{間違|まちが}えたんですか。', ro: 'Sore wa taihen deshita ne. Doushite machigaeta n desu ka.', vi: 'Vậy thì gay nhỉ. Sao bạn lại nhầm?' },
        { who: 'Bạn', role: 'candidate', text: 'シフト{表|ひょう}をスマホで{見|み}ただけで、メモをしなかったからです。{店長|てんちょう}にはとても{迷惑|めいわく}をかけてしまいました。それ{以来|いらい}、シフトが{決|き}まったらすぐカレンダーに{入|い}れるようにしています。', ro: 'Shifutohyou o sumaho de mita dake de, memo o shinakatta kara desu. Tenchou ni wa totemo meiwaku o kakete shimaimashita. Sore irai, shifuto ga kimattara sugu karendaa ni ireru you ni shite imasu.', vi: 'Vì tôi chỉ xem bảng ca trên điện thoại mà không ghi lại. Tôi đã gây phiền rất nhiều cho chủ cửa hàng. Từ đó, cứ có lịch ca là tôi nhập ngay vào lịch.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: 'でも、{一日|いちにち}{間違|まちが}えるくらい、{誰|だれ}にでもありますよ。{運|うん}が{悪|わる}かっただけじゃありませんか。', ro: 'Demo, ichinichi machigaeru kurai, dare ni demo arimasu yo. Un ga warukatta dake ja arimasen ka.', vi: 'Nhưng nhầm một ngày thì ai mà chẳng có. Chẳng phải chỉ là xui thôi sao?' },
        { who: 'Bạn', role: 'candidate', text: '{確|たし}かに、{誰|だれ}にでも{起|お}こり{得|う}ることかもしれません。でも、{確認|かくにん}していれば{防|ふせ}げたことなので、{自分|じぶん}の{責任|せきにん}だと{思|おも}っています。', ro: 'Tashika ni, dare ni demo okoriuru koto kamo shiremasen. Demo, kakunin shite ireba fusegeta koto na node, jibun no sekinin da to omotte imasu.', vi: 'Đúng là có thể ai cũng gặp. Nhưng nếu kiểm tra thì đã tránh được, nên tôi nghĩ đó là trách nhiệm của mình.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: 'では、あなたの{国|くに}で、{名前|なまえ}の{由来|ゆらい}がおもしろい{場所|ばしょ}を{教|おし}えてください。', ro: 'De wa, anata no kuni de, namae no yurai ga omoshiroi basho o oshiete kudasai.', vi: 'Vậy hãy kể một nơi ở nước bạn có nguồn gốc tên gọi thú vị.' },
        { who: 'Bạn', role: 'candidate', text: 'ベトナムのハロン{湾|わん}です。「ハロン」は「{龍|りゅう}が{降|お}りる」という{意味|いみ}で、{龍|りゅう}が{海|うみ}に{降|お}りて{島|しま}を{作|つく}ったという{言|い}い{伝|つた}えがあることから、そう{呼|よ}ばれています。{世界遺産|せかいいさん}だけあって、{景色|けしき}は{本当|ほんとう}に{素晴|すば}らしいですよ。', ro: 'Betonamu no Haron-wan desu. "Haron" wa "ryuu ga oriru" to iu imi de, ryuu ga umi ni orite shima o tsukutta to iu iitsutae ga aru koto kara, sou yobarete imasu. Sekai isan dake atte, keshiki wa hontou ni subarashii desu yo.', vi: 'Đó là vịnh Hạ Long của Việt Nam. "Hạ Long" nghĩa là "rồng đáp xuống"; vì có truyền thuyết kể rằng rồng hạ xuống biển tạo nên các hòn đảo nên mới được gọi như vậy. Đúng là di sản thế giới có khác, cảnh đẹp tuyệt vời.' },
      ],
    },
    {
      t: 'phatam',
      id: 'b48-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 12 câu hay dùng của Bài 48',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý trường âm: よ・う・い・ん (要因), そ・う・か・ん (相関), きょ・う・ど (郷土), けい・い (経緯 — ke-i-i, ba âm tiết); âm ngắt: さ・っ・か・く (錯覚), け・っ・か・ん (欠陥); ばかりに (ba-ka-ri-ni — đừng nuốt り); ことから (ko-to-ka-ra) ≠ ことだから (ko-to-da-ka-ra) — đọc rõ chữ だ vì nó đổi nghĩa!',
      items: [
        { text: 'たった{一|ひと}つの{確認|かくにん}を{怠|おこた}ったばかりに、ご{迷惑|めいわく}をおかけしてしまいました。', ipa: 'tatta hitotsu no kakunin o okotatta bakari ni, gomeiwaku o okake shite shimaimashita', vi: 'Chỉ vì lơ là một bước kiểm tra mà đã gây phiền hà cho quý vị.' },
        { text: '{合格|ごうかく}したいばかりに、{毎晩|まいばん}{遅|おそ}くまで{勉強|べんきょう}しました。', ipa: 'goukaku shitai bakari ni, maiban osoku made benkyou shimashita', vi: 'Chỉ vì muốn đỗ mà tối nào tôi cũng học tới khuya.' },
        { text: '{坂|さか}の{上|うえ}から{海|うみ}が{見|み}えたことから、その{名前|なまえ}が{付|つ}きました。', ipa: 'saka no ue kara umi ga mieta koto kara, sono namae ga tsukimashita', vi: 'Vì từ đỉnh dốc nhìn thấy biển nên mới có cái tên đó.' },
        { text: '{部屋|へや}の{電気|でんき}がついていることから、まだ{起|お}きていると{分|わ}かります。', ipa: 'heya no denki ga tsuite iru koto kara, mada okite iru to wakarimasu', vi: 'Từ việc đèn phòng còn sáng, biết là vẫn còn thức.' },
        { text: '{真面目|まじめ}な{彼|かれ}のことだから、きっと{時間|じかん}どおりに{来|く}るでしょう。', ipa: 'majime na kare no koto da kara, kitto jikan doori ni kuru deshou', vi: 'Anh ấy vốn nghiêm túc, chắc chắn sẽ đến đúng giờ.' },
        { text: '{一生懸命|いっしょうけんめい}{準備|じゅんび}しただけに、{本当|ほんとう}に{悔|くや}しかったです。', ipa: 'isshoukenmei junbi shita dake ni, hontou ni kuyashikatta desu', vi: 'Chính vì đã dốc sức chuẩn bị nên tôi thật sự rất tiếc.' },
        { text: 'さすが{老舗|しにせ}だけあって、{味|あじ}が{違|ちが}いますね。', ipa: 'sasuga shinise dake atte, aji ga chigaimasu ne', vi: 'Đúng là tiệm lâu đời có khác, vị khác hẳn nhỉ.' },
        { text: 'この{本|ほん}は、{何度|なんど}も{読|よ}むだけの{価値|かち}があります。', ipa: 'kono hon wa, nando mo yomu dake no kachi ga arimasu', vi: 'Cuốn sách này đáng để đọc nhiều lần.' },
        { text: 'すみません、{電車|でんしゃ}が{遅|おく}れたものですから。', ipa: 'sumimasen, densha ga okureta mono desu kara', vi: 'Xin lỗi, tại tàu đến muộn ạ.' },
        { text: '{相関|そうかん}があるからといって、{因果関係|いんがかんけい}があるとは{限|かぎ}りません。', ipa: 'soukan ga aru kara to itte, inga kankei ga aru to wa kagirimasen', vi: 'Có tương quan không có nghĩa là có quan hệ nhân quả.' },
        { text: '{事故|じこ}の{経緯|けいい}と{再発防止策|さいはつぼうしさく}を{報告|ほうこく}します。', ipa: 'jiko no keii to saihatsu boushisaku o houkoku shimasu', vi: 'Tôi xin báo cáo diễn biến sự cố và biện pháp phòng tái diễn.' },
        { text: '{説明|せつめい}が{足|た}りないと、{誤解|ごかい}を{招|まね}きかねません。', ipa: 'setsumei ga tarinai to, gokai o manekikanemasen', vi: 'Giải thích không đủ thì e là gây hiểu lầm.' },
      ],
    },
    {
      t: 'note',
      title: 'Trình bày 1 phút (できる！) — dàn ý + bài mẫu "{一番|いちばん}{多|おお}くを{学|まな}んだ{失敗|しっぱい}"',
      items: [
        '**Dàn ý 5 bước (≈ 8–10 câu, 300–350 chữ nói)**: ① **Nêu chủ đề** — {今日|きょう}は、{私|わたし}が{一番|いちばん}{多|おお}くを{学|まな}んだ{失敗|しっぱい}について{話|はな}します → ② **Chuyện gì xảy ra** (～ばかりに、～てしまいました) → ③ **Cảm xúc** (～だけに、{本当|ほんとう}に～) → ④ **Nguyên nhân thật + điều thay đổi** (～ことから、～と{気|き}づきました · それ{以来|いらい}～ようにしています) → ⑤ **Câu chốt** (あの{失敗|しっぱい}があったからこそ、～).',
        '{今日|きょう}は、{私|わたし}が{一番|いちばん}{多|おお}くを{学|まな}んだ{失敗|しっぱい}について{話|はな}します。{大学|だいがく}{一年生|いちねんせい}の{時|とき}、{日本語|にほんご}のスピーチ{大会|たいかい}に{出|で}ました。{上手|じょうず}だと{思|おも}われたいばかりに、{難|むずか}しい{言葉|ことば}をたくさん{使|つか}った{原稿|げんこう}を{書|か}いてしまいました。{本番|ほんばん}では{途中|とちゅう}で{言葉|ことば}を{忘|わす}れて、{何|なに}も{言|い}えなくなりました。{三|さん}か{月|げつ}も{練習|れんしゅう}しただけに、{本当|ほんとう}に{悔|くや}しかったです。あとで{先生|せんせい}に{録画|ろくが}を{見|み}せてもらったことから、{自分|じぶん}でも{意味|いみ}が{分|わ}かっていない{言葉|ことば}ほど{忘|わす}れやすいと{気|き}づきました。それ{以来|いらい}、{発表|はっぴょう}では{自分|じぶん}の{言葉|ことば}で{話|はな}すようにしています。あの{失敗|しっぱい}があったからこそ、{今|いま}は{人前|ひとまえ}で{話|はな}すのが{好|す}きになりました。',
        'Romaji: Kyou wa, watashi ga ichiban ooku o mananda shippai ni tsuite hanashimasu. Daigaku ichinensei no toki, nihongo no supiichi taikai ni demashita. Jouzu da to omowaretai bakari ni, muzukashii kotoba o takusan tsukatta genkou o kaite shimaimashita. Honban de wa tochuu de kotoba o wasurete, nani mo ienaku narimashita. Sankagetsu mo renshuu shita dake ni, hontou ni kuyashikatta desu. Ato de sensei ni rokuga o misete moratta koto kara, jibun demo imi ga wakatte inai kotoba hodo wasureyasui to kizukimashita. Sore irai, happyou de wa jibun no kotoba de hanasu you ni shite imasu. Ano shippai ga atta kara koso, ima wa hitomae de hanasu no ga suki ni narimashita.',
        'Nghĩa: Hôm nay tôi xin kể về thất bại dạy tôi nhiều nhất. Năm nhất đại học, tôi tham gia cuộc thi hùng biện tiếng Nhật. Chỉ vì muốn được nghĩ là giỏi mà tôi viết một bài dùng rất nhiều từ khó. Vào buổi thi thật, giữa chừng tôi quên chữ và không nói được gì nữa. Chính vì đã luyện tận ba tháng nên tôi thật sự rất tiếc. Sau đó, nhờ cô cho xem lại đoạn ghi hình mà tôi nhận ra: từ nào chính mình không hiểu nghĩa thì càng dễ quên. Từ đó, khi thuyết trình tôi luôn nói bằng lời của mình. Chính nhờ thất bại ấy mà bây giờ tôi lại thích nói trước đám đông.',
        'Chỗ dễ vấp khi nói: **{思|おも}われたいばかりに** (o-mo-wa-re-ta-i-ba-ka-ri-ni — bị động + たい + ばかりに) · **{三|さん}か{月|げつ}** (sankagetsu) · **{録画|ろくが}** (rokuga) · **からこそ** (kara koso — nhấn "chính vì") · **ことから、～と{気|き}づきました** (ことから ở đây = "từ việc được xem lại").',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 30 điểm) — đoạn mẫu 50 giây',
      items: [
        '{日本|にほん}の{地名|ちめい}には、{地形|ちけい}に{由来|ゆらい}するものが{多|おお}くあります。{例|たと}えば「{桜|さくら}が{丘|おか}」は、{丘|おか}に{桜|さくら}の{木|き}が{多|おお}かったことから、そう{名付|なづ}けられました。{坂|さか}の{上|うえ}から{海|うみ}が{見|み}えたことから「{浜見坂|はまみざか}」と{呼|よ}ばれる{坂|さか}もあります。{今|いま}は{海岸|かいがん}が{遠|とお}くなり、{海|うみ}は{見|み}えませんが、{名前|なまえ}だけが{昔|むかし}の{景色|けしき}を{伝|つた}えています。{地名|ちめい}の{由来|ゆらい}を{知|し}ると、いつもの{道|みち}を{歩|ある}くのも{楽|たの}しくなるものです。',
        'Romaji: Nihon no chimei ni wa, chikei ni yurai suru mono ga ooku arimasu. Tatoeba "Sakuragaoka" wa, oka ni sakura no ki ga ookatta koto kara, sou nazukeraremashita. Saka no ue kara umi ga mieta koto kara "Hamamizaka" to yobareru saka mo arimasu. Ima wa kaigan ga tooku nari, umi wa miemasen ga, namae dake ga mukashi no keshiki o tsutaete imasu. Chimei no yurai o shiru to, itsumo no michi o aruku no mo tanoshiku naru mono desu.',
        'Nghĩa: Nhiều địa danh Nhật Bản có nguồn gốc từ địa hình. Ví dụ "Sakuragaoka" được đặt tên như vậy vì trên đồi có nhiều cây anh đào. Cũng có con dốc được gọi là "dốc Hamami" vì từ đỉnh dốc nhìn thấy biển. Bây giờ bờ biển đã lùi xa, không còn thấy biển nữa, chỉ còn cái tên truyền lại cảnh sắc ngày xưa. Biết nguồn gốc địa danh rồi, đi trên con đường quen thuộc cũng thấy vui hơn.',
        'Chỗ dễ vấp: **{地形|ちけい}** (chi-ke-i) · **{由来|ゆらい}** (yu-ra-i) · **{名付|なづ}けられました** (na-zu-ke-ra-re-ma-shi-ta) · **{浜見坂|はまみざか}** (ha-ma-mi-za-ka — さか thành ざか) · **{伝|つた}えています** · **～ものです** (cuối câu — ものだ lẽ thường, Bài 32; xuống giọng nhẹ).',
      ],
    },
    {
      t: 'speak',
      id: 'b48-noi-ghi-am',
      part: '1',
      questions: [
        'さいきん、なにか しっぱいした ことが ありますか。どうして しっぱいしましたか。',
        'あなたの くにで、なまえの ゆらいが おもしろい ばしょや たべものを おしえて ください。',
        'ちこくした とき、せんせいや じょうしに どう いいますか。',
        'いっしょうけんめい じゅんびしたのに うまく いかなかった ことが ありますか。',
        'ニュースや こうこくの 「〜する ひとほど 〜だ」 という はなしを しんじますか。どうしてですか。',
        'あなたが いちばん おおくを まなんだ しっぱいについて 1ぷんで はなして ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b48-viet',
  kind: 'writing',
  title: 'Viết — bài nêu ý kiến N2 (400–600 chữ) "Khi thất bại, tìm nguyên nhân ở bản thân hay ở hoàn cảnh?" + báo cáo sự cố ~250 chữ + từ nối của bài luận + đề luyện thêm',
  goal: 'Viết bài ý kiến 400–600 chữ thể だ・である có lập trường rõ, hai lý do có ví dụ, một đoạn phản biện (確かに～。しかし～) và kết luận — dùng tự nhiên ít nhất ba mẫu của bài (～ばかりに, ～ことから, ～だけに, nhắc ～ものだから như một lời bào chữa); viết một báo cáo sự cố ~250 chữ (です・ます) theo khuôn: tóm tắt → diễn biến (経緯) → nguyên nhân → biện pháp phòng tái diễn.',
  minutes: 60,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **「{失敗|しっぱい}した{時|とき}、その{原因|げんいん}を{自分|じぶん}に{求|もと}めるか、{周|まわ}りの{環境|かんきょう}に{求|もと}めるか。あなたの{考|かんが}えを{書|か}きなさい」** — **400–600 chữ**, thể **だ・である** (văn viết). Bạn có thể chọn **bản thân**, **hoàn cảnh / cơ chế**, hoặc **cả hai nhưng theo thứ tự** (bài mẫu chọn hướng này: trước hết nhìn vào mình, rồi sửa cơ chế để người khác không mắc lại). Ghi nhớ: đây là bài nêu ý kiến — ví dụ lấy từ **kinh nghiệm của bạn**, không cần (và không nên bịa) số liệu.',
    },
    {
      t: 'table',
      caption: 'Dàn ý 4 đoạn — bài nêu ý kiến N2 (400–600 chữ)',
      head: ['Đoạn', 'Nội dung', 'Câu mở / từ nối', 'Mẫu Bài 48 dùng được'],
      rows: [
        ['① 序論 (~80 chữ)', 'Bối cảnh + câu hỏi + lập trường', '{誰|だれ}でも～ことがある。その{時|とき}、～だろうか。{私|わたし}は～と{考|かんが}える。', '—'],
        ['② 本論1 (~150 chữ)', 'Lý do 1 + ví dụ của bản thân', '{第一|だいいち}に、～からだ。{私|わたし}は{以前|いぜん}、～。', '～ばかりに (tiếc nuối) · ～ものだから (nhắc như lời bào chữa của mình)'],
        ['③ 本論2 + 反論 (~180 chữ)', 'Lý do 2 + ý kiến trái chiều rồi đáp lại', '{第二|だいに}に、～。{確|たし}かに、～という{意見|いけん}もある。しかし、～。', '～ことから (căn cứ) · ～だけに (mức độ)'],
        ['④ 結論 (~80 chữ)', 'Nhắc lại lập trường + đề xuất', '{以上|いじょう}のことから、{私|わたし}は～と{考|かんが}える。', '～ことが{大切|たいせつ}だ · ～のではないだろうか'],
      ],
    },
    {
      t: 'note',
      title: 'Từ nối & câu "đinh" của bài nghị luận về nguyên nhân (N2)',
      items: [
        '**Mở bài**: **{誰|だれ}でも{一度|いちど}は～た{経験|けいけん}があるだろう** · **～については、さまざまな{考|かんが}え{方|かた}がある** · **{私|わたし}は～という{立場|たちば}をとる**.',
        '**Nêu nguyên nhân (giọng khách quan)**: **～ことから、～と{考|かんが}えられる** · **～が{原因|げんいん}で／～が{要因|よういん}となって** · **～に{影響|えいきょう}を{及|およ}ぼす** · **～を{招|まね}く・～を{引|ひ}き{起|お}こす**.',
        '**Kể kinh nghiệm**: **{私|わたし}は{以前|いぜん}、～ばかりに、～てしまったことがある** · **{当時|とうじ}は「～ものだから」と{言|い}い{訳|わけ}ばかりしていた** (nhắc lời bào chữa để phê phán — dùng ものだから trong ngoặc kép rất tự nhiên).',
        '**Phản biện**: **{確|たし}かに、～という{意見|いけん}もある。しかし、～** · **～からといって、～とは{限|かぎ}らない** · **～だけに、かえって～** (chính vì… nên ngược lại…).',
        '**Kết bài**: **{以上|いじょう}のことから、～** · **～ことこそが{大切|たいせつ}なのではないだろうか** · **～てこそ、～** (phải… thì mới…).',
      ],
    },
    {
      t: 'passage',
      title: 'Bài mẫu — 「{失敗|しっぱい}の{原因|げんいん}は{自分|じぶん}に{求|もと}めるか、{環境|かんきょう}に{求|もと}めるか」（{約|やく}560{字|じ}）',
      paras: [
        { label: '序論', text: '{誰|だれ}でも{一度|いちど}は、{大切|たいせつ}な{場面|ばめん}で{失敗|しっぱい}した{経験|けいけん}があるだろう。その{時|とき}、{原因|げんいん}を{自分|じぶん}に{求|もと}めるべきか、{周|まわ}りの{環境|かんきょう}に{求|もと}めるべきか。{私|わたし}は、まず{自分|じぶん}に{求|もと}め、そのうえで{環境|かんきょう}を{見直|みなお}すべきだと{考|かんが}える。' },
        { label: '本論1', text: '{第一|だいいち}に、{原因|げんいん}を{自分|じぶん}の{外|そと}にばかり{探|さが}していると、{同|おな}じ{失敗|しっぱい}を{繰|く}り{返|かえ}しかねないからだ。{私|わたし}は{以前|いぜん}、{寝坊|ねぼう}したばかりに{大事|だいじ}な{試験|しけん}に{遅|おく}れたことがある。{当時|とうじ}は「{目覚|めざ}ましが{鳴|な}らなかったものだから」と{言|い}い{訳|わけ}ばかりしていた。しかし、{前|まえ}の{晩|ばん}に{夜更|よふ}かしをしていたのは{私|わたし}自身である。そう{認|みと}めてから、{試験|しけん}の{前|まえ}の{日|ひ}は{早|はや}く{寝|ね}るようになった。' },
        { label: '本論2', text: '{第二|だいに}に、{自分|じぶん}の{経験|けいけん}を{振|ふ}り{返|かえ}ることから、{環境|かんきょう}の{問題|もんだい}にも{気|き}づけるからだ。{例|たと}えば、{確認|かくにん}を{一|ひと}つ{忘|わす}れたことを{素直|すなお}に{報告|ほうこく}すれば、「{手順|てじゅん}が{分|わ}かりにくい」という{仕組|しく}みの{欠陥|けっかん}も{見|み}えてくる。{確|たし}かに、{自分|じぶん}を{責|せ}めすぎると{自信|じしん}をなくすという{意見|いけん}もある。しかし、ここで{言|い}う「{自分|じぶん}に{求|もと}める」とは、{自分|じぶん}を{責|せ}めることではなく、{自分|じぶん}にできたことを{考|かんが}えることである。' },
        { label: '結論', text: '{以上|いじょう}のことから、{私|わたし}は、{失敗|しっぱい}の{原因|げんいん}はまず{自分|じぶん}に{求|もと}め、そこから{見|み}えた{環境|かんきょう}の{問題|もんだい}を{改善|かいぜん}していくべきだと{考|かんが}える。{悔|くや}しい{失敗|しっぱい}だっただけに、そこから{学|まな}べることも{多|おお}いはずだ。' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới & điểm ngữ pháp trong bài mẫu',
      items: [
        '**～べきか／～べきだ** (nên — mẫu này học chính thức ở **Bài 52**; ở đây chỉ dùng trong câu nêu vấn đề và câu lập trường, là cách viết chuẩn của bài luận) · **{場面|ばめん}** (tình huống, cảnh) · **そのうえで** (trên cơ sở đó, sau đó) · **{当時|とうじ}** (hồi đó — N2) · **{自身|じしん}** (chính bản thân) · **{振|ふ}り{返|かえ}る** (nhìn lại) · **{改善|かいぜん}する** (cải thiện).',
        'Mẫu của bài: **{寝坊|ねぼう}したばかりに** (① — tiếc nuối) · **「{目覚|めざ}ましが{鳴|な}らなかったものだから」** (④ — trích lời bào chữa của chính mình để phê phán) · **{振|ふ}り{返|かえ}ることから、～にも{気|き}づける** (② — khởi đầu, căn cứ) · **{悔|くや}しい{失敗|しっぱい}だっただけに** (③ — chính vì… nên càng) · **{繰|く}り{返|かえ}しかねない** (ôn Bài 46). Năm mẫu, mỗi mẫu một vai — đó là cách dùng ngữ pháp "tự nhiên" của bài luận N2.',
      ],
    },
    {
      t: 'quiz',
      id: 'b48-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật, thể だ・である (8 câu)',
      kind: 'translate',
      grammar: 'Văn viết だ・である + ～ばかりに・～ことから・～だけに・～ものだから',
      items: [
        { q: 'Ai cũng từng có kinh nghiệm thất bại ở một tình huống quan trọng.', answers: V('{誰|だれ}でも{大切|たいせつ}な{場面|ばめん}で{失敗|しっぱい}した{経験|けいけん}がある。', '{誰|だれ}でも{一度|いちど}は{大切|たいせつ}な{場面|ばめん}で{失敗|しっぱい}した{経験|けいけん}があるだろう。', '{誰|だれ}でも{大事|だいじ}な{場面|ばめん}で{失敗|しっぱい}した{経験|けいけん}がある。'), hint: 'だれでも たいせつな ばめんで しっぱいした けいけんが ある' },
        { q: 'Chỉ vì ngủ quên mà tôi đã đến muộn kỳ thi quan trọng.', answers: V('{寝坊|ねぼう}したばかりに、{大事|だいじ}な{試験|しけん}に{遅|おく}れてしまった。', '{寝坊|ねぼう}したばかりに、{大切|たいせつ}な{試験|しけん}に{遅|おく}れてしまった。', '{寝坊|ねぼう}したばかりに、{大事|だいじ}な{試験|しけん}に{遅刻|ちこく}してしまった。'), hint: 'ねぼうした ばかりに、だいじな しけんに おくれて しまった' },
        { q: 'Hồi đó, tôi toàn bào chữa "tại báo thức không kêu".', answers: V('{当時|とうじ}は「{目覚|めざ}ましが{鳴|な}らなかったものだから」と{言|い}い{訳|わけ}ばかりしていた。', '{当時|とうじ}は「{目覚|めざ}ましが{鳴|な}らなかったもんだから」と{言|い}い{訳|わけ}ばかりしていた。', 'その{時|とき}は「{目覚|めざ}ましが{鳴|な}らなかったものだから」と{言|い}い{訳|わけ}ばかりしていた。'), hint: 'とうじは「めざましが ならなかった ものだから」と いいわけ ばかり していた' },
        { q: 'Tìm nguyên nhân bên ngoài mãi thì e là lặp lại cùng thất bại.', answers: V('{原因|げんいん}を{外|そと}にばかり{探|さが}していると、{同|おな}じ{失敗|しっぱい}を{繰|く}り{返|かえ}しかねない。', '{原因|げんいん}を{外|そと}にばかり{求|もと}めていると、{同|おな}じ{失敗|しっぱい}を{繰|く}り{返|かえ}しかねない。', '{原因|げんいん}を{外|そと}にばかり{探|さが}すと、{同|おな}じ{失敗|しっぱい}を{繰|く}り{返|かえ}しかねない。'), hint: 'げんいんを そとに ばかり さがしていると、おなじ しっぱいを くりかえしかねない' },
        { q: 'Từ việc nhìn lại kinh nghiệm của mình, có thể nhận ra cả vấn đề của cơ chế.', answers: V('{自分|じぶん}の{経験|けいけん}を{振|ふ}り{返|かえ}ることから、{仕組|しく}みの{問題|もんだい}にも{気|き}づける。', '{自分|じぶん}の{経験|けいけん}を{振|ふ}り{返|かえ}ることから、{仕組|しく}みの{問題|もんだい}にも{気|き}づくことができる。', '{自分|じぶん}の{経験|けいけん}を{振|ふ}り{返|かえ}ったことから、{仕組|しく}みの{問題|もんだい}にも{気|き}づいた。'), hint: 'じぶんの けいけんを ふりかえる ことから、しくみの もんだいにも きづける' },
        { q: 'Đúng là có ý kiến cho rằng tự trách quá thì mất tự tin. Nhưng…', answers: V('{確|たし}かに、{自分|じぶん}を{責|せ}めすぎると{自信|じしん}をなくすという{意見|いけん}もある。しかし、', '{確|たし}かに、{自分|じぶん}を{責|せ}めすぎると{自信|じしん}がなくなるという{意見|いけん}もある。しかし、', '{確|たし}かに、{自分|じぶん}を{責|せ}めすぎると{自信|じしん}をなくすという{意見|いけん}もある。だが、'), hint: 'たしかに、じぶんを せめすぎると じしんを なくす という いけんも ある。しかし、' },
        { q: 'Chính vì là thất bại đáng tiếc nên hẳn là học được nhiều điều.', answers: V('{悔|くや}しい{失敗|しっぱい}だっただけに、{学|まな}べることも{多|おお}いはずだ。', '{悔|くや}しい{失敗|しっぱい}だっただけに、そこから{学|まな}べることも{多|おお}いはずだ。', '{悔|くや}しい{失敗|しっぱい}だけに、{学|まな}べることも{多|おお}いはずだ。'), hint: 'くやしい しっぱい だった だけに、まなべる ことも おおい はずだ' },
        { q: 'Từ những điều trên, tôi cho rằng trước hết nên tìm nguyên nhân ở bản thân.', answers: V('{以上|いじょう}のことから、{私|わたし}は、まず{自分|じぶん}に{原因|げんいん}を{求|もと}めるべきだと{考|かんが}える。', '{以上|いじょう}のことから、{私|わたし}は、{原因|げんいん}はまず{自分|じぶん}に{求|もと}めるべきだと{考|かんが}える。', '{以上|いじょう}のことから、まず{自分|じぶん}に{原因|げんいん}を{求|もと}めるべきだと{考|かんが}える。'), hint: 'いじょうの ことから、わたしは、まず じぶんに げんいんを もとめるべきだと かんがえる' },
      ],
    },

    { t: 'h', text: 'Bài viết 2 — báo cáo sự cố ~250 chữ (thể です・ます)' },
    {
      t: 'table',
      caption: 'Khuôn một báo cáo sự cố (障害報告書) — 4 phần',
      head: ['Phần', 'Câu mẫu', 'Romaji'],
      rows: [
        ['① Tóm tắt', '～{月|がつ}～{日|にち}、～が{発生|はっせい}しましたので、ご{報告|ほうこく}いたします。', '~ gatsu ~ nichi, ~ ga hassei shimashita node, gohoukoku itashimasu.'],
        ['② Diễn biến (経緯)', '～{時|じ}～{分|ふん}に～。その{後|ご}、～。', '~ ji ~ fun ni ~. Sono go, ~.'],
        ['③ Nguyên nhân', '～ことから、～が{原因|げんいん}と{考|かんが}えられます。', '~ koto kara, ~ ga gen\'in to kangaeraremasu.'],
        ['④ Biện pháp', '{再発防止|さいはつぼうし}のため、{今後|こんご}は～ことといたします。', 'Saihatsu boushi no tame, kongo wa ~ koto to itashimasu.'],
      ],
    },
    {
      t: 'passage',
      title: 'Báo cáo mẫu — 「{予約|よやく}システム{停止|ていし}についてのご{報告|ほうこく}」（{約|やく}260{字|じ}）',
      paras: [
        { text: '11{月|がつ}4{日|か}（{月|げつ}）の{夜|よる}、みどり{旅行|りょこう}{様|さま}の{予約|よやく}システムが{約|やく}{二時間|にじかん}{停止|ていし}しましたので、ご{報告|ほうこく}いたします。{午後|ごご}11{時|じ}に{新|あたら}しい{版|はん}への{更新|こうしん}を{行|おこな}ったところ、11{時|じ}10{分|ぷん}ごろから{予約|よやく}{画面|がめん}が{表示|ひょうじ}されなくなりました。{午前|ごぜん}1{時|じ}に{古|ふる}い{版|はん}に{戻|もど}し、{復旧|ふっきゅう}いたしました。{調査|ちょうさ}の{結果|けっか}、{設定|せってい}ファイルが{古|ふる}いままだったことから、{更新|こうしん}の{最後|さいご}の{確認|かくにん}が{行|おこな}われていなかったことが{原因|げんいん}と{考|かんが}えられます。{再発防止|さいはつぼうし}のため、{今後|こんご}は{作業|さぎょう}を{必|かなら}ず{二人|ふたり}で{確認|かくにん}し、{手順書|てじゅんしょ}に{確認欄|かくにんらん}を{設|もう}けることといたします。ご{迷惑|めいわく}をおかけし、{誠|まこと}に{申|もう}し{訳|わけ}ございませんでした。' },
      ],
    },
    {
      t: 'note',
      title: 'Vì sao báo cáo mẫu KHÔNG có ばかりに và ものですから?',
      items: [
        '**～ばかりに** mang **cảm xúc tiếc nuối** của người nói — hợp với lời xin lỗi trực tiếp (hội thoại ①), không hợp với **báo cáo sự thật**. **～ものですから** là **lý do cá nhân / bào chữa** — tuyệt đối tránh trong báo cáo. Báo cáo chỉ dùng câu khách quan: **～ことから、～が{原因|げんいん}と{考|かんが}えられます** · **～ため、～**.',
        'Từ của báo cáo: **{発生|はっせい}する** (phát sinh) · **{停止|ていし}する** (dừng) · **{版|はん}** (phiên bản) · **～たところ** (khi làm… thì — N2) · **{表示|ひょうじ}される** (được hiển thị) · **{復旧|ふっきゅう}する** (khôi phục — Bài 44) · **{設|もう}ける** (đặt ra, lập — N2) · **～ことといたします** (chúng tôi quyết định sẽ… — khiêm nhường) · **{誠|まこと}に** (thật sự — trang trọng).',
      ],
    },
    {
      t: 'note',
      title: 'Tiêu chí tự chấm (5 × 4 điểm = 20) + đề luyện thêm',
      items: [
        '**① Lập trường rõ** ở câu cuối mở bài và câu đầu kết bài (bài luận) / đủ 4 phần tóm tắt → diễn biến → nguyên nhân → biện pháp (báo cáo) · **② Lý do có ví dụ cụ thể** từ kinh nghiệm (không bịa số liệu) · **③ Có phản biện** (確かに～しかし) · **④ Dùng đúng ≥ 3 mẫu của Bài 48** (ばかりに・ことから・だけに・ものだから) và **không dùng ばかりに／ものだから trong báo cáo** · **⑤ Văn viết thống nhất** (bài luận: だ・である; báo cáo: です・ます + khiêm nhường ngữ).',
        '**Đề luyện thêm (chọn 1, 400–600 chữ)**: ① 「{老舗|しにせ}は{伝統|でんとう}を{守|まも}るべきか、{時代|じだい}に{合|あ}わせて{変|か}わるべきか」 ② 「データを{見|み}る{時|とき}に{気|き}をつけたいこと」 ③ 「{地名|ちめい}や{建物|たてもの}の{名前|なまえ}を{変|か}えることに{賛成|さんせい}か{反対|はんたい}か」. **Báo cáo luyện thêm (~250 chữ)**: báo cáo việc gửi nhầm email cho khách · báo cáo việc làm vỡ thiết bị ở chỗ làm thêm · báo cáo việc mất chìa khoá phòng ký túc xá.',
        'Mẹo đếm chữ: bản thảo giấy ô vuông {原稿用紙|げんこうようし} có 20 × 20 = 400 ô; mỗi dấu 、。「」 chiếm một ô; xuống đoạn thì bỏ trống ô đầu.',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b48-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 48 — dịch, trắc nghiệm, ghép câu (có đáp án)',
  goal: 'Tự kiểm tra cả bốn mẫu ～ばかりに・～ことから・～だけに・～ものだから và các cặp dễ nhầm (ばかりに ↔ せいで ↔ おかげで, ことから ↔ ことだから, だけに ↔ だけあって ↔ わりに, ものだから ↔ ものの) bằng 12 câu dịch, 12 câu trắc nghiệm và 8 câu ghép.',
  minutes: 55,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm **không nhìn bài** trước, rồi mới mở gợi ý. Mỗi câu dịch có nhiều đáp án chấp nhận (kanji / kana, です・ます / thể thường như ghi trong câu).',
        'Sai ở mẫu nào thì quay lại đúng mục: **①** ばかりに · **②** ことから · **③** だけに／だけあって／だけの · **④** ものだから — và bảng **⑤ ⑥ ⑦ ⑧** nếu nhầm giữa các mẫu gần nghĩa.',
      ],
    },
    {
      t: 'quiz',
      id: 'b48-bt-dich',
      title: 'Dịch Việt → Nhật (12 câu)',
      kind: 'translate',
      grammar: '① 普通形＋ばかりに · ② 普通形＋ことから · Nのことだから · ③ 普通形＋だけに／だけあって · ④ 普通形＋ものだから',
      items: [
        { q: 'Chỉ vì nói một câu thừa mà làm bạn giận. (thể thường)', answers: V('{余計|よけい}な{一言|ひとこと}を{言|い}ったばかりに、{友達|ともだち}を{怒|おこ}らせてしまった。', '{余計|よけい}なことを{言|い}ったばかりに、{友達|ともだち}を{怒|おこ}らせてしまった。', '{一言|ひとこと}{余計|よけい}なことを{言|い}ったばかりに、{友達|ともだち}を{怒|おこ}らせてしまった。'), hint: 'よけいな ひとことを いった ばかりに、ともだちを おこらせて しまった' },
        { q: 'Chỉ vì muốn gặp ca sĩ mà xếp hàng tận ba tiếng. (thể thường)', answers: V('{歌手|かしゅ}に{会|あ}いたいばかりに、{三時間|さんじかん}も{並|なら}んだ。', '{歌手|かしゅ}に{会|あ}いたいばかりに、{三時間|さんじかん}も{並|なら}んでしまった。', '{好|す}きな{歌手|かしゅ}に{会|あ}いたいばかりに、{三時間|さんじかん}も{並|なら}んだ。'), hint: 'かしゅに あいたい ばかりに、さんじかんも ならんだ' },
        { q: 'Chỉ vì là người mới mà không được nghe ý kiến. (thể thường)', answers: V('{新人|しんじん}であるばかりに、{意見|いけん}を{聞|き}いてもらえなかった。', '{新人|しんじん}だったばかりに、{意見|いけん}を{聞|き}いてもらえなかった。', '{新人|しんじん}であるばかりに、{意見|いけん}を{聞|き}いてもらえない。'), hint: 'しんじん である ばかりに、いけんを きいて もらえなかった' },
        { q: 'Vì hình dáng giống ngôi sao nên được gọi là "Hoa Sao". (thể thường)', answers: V('{形|かたち}が{星|ほし}に{似|に}ていることから、「{星|ほし}の{花|はな}」と{呼|よ}ばれている。', '{形|かたち}が{星|ほし}に{似|に}ていることから、「{星|ほし}の{花|はな}」と{呼|よ}ばれる。', '{形|かたち}が{星|ほし}に{似|に}ていることから、「{星|ほし}の{花|はな}」と{名付|なづ}けられた。'), hint: 'かたちが ほしに にている ことから、「ほしの はな」と よばれている' },
        { q: 'Từ việc đường ướt, biết là đêm qua trời đã mưa. (thể thường)', answers: V('{道|みち}がぬれていることから、{夜中|よなか}に{雨|あめ}が{降|ふ}ったと{分|わ}かる。', '{道|みち}がぬれていることから、{昨夜|さくや}{雨|あめ}が{降|ふ}ったと{分|わ}かる。', '{道|みち}がぬれていることから、{夜|よる}に{雨|あめ}が{降|ふ}ったと{分|わ}かる。'), hint: 'みちが ぬれている ことから、よなかに あめが ふったと わかる' },
        { q: 'Anh ấy vốn nghiêm túc, chắc chắn sẽ giữ lời hứa. (thể thường)', answers: V('{真面目|まじめ}な{彼|かれ}のことだから、きっと{約束|やくそく}を{守|まも}るだろう。', '{真面目|まじめ}な{彼|かれ}のことだから、{約束|やくそく}は{守|まも}るだろう。', '{真面目|まじめ}な{彼|かれ}のことだから、きっと{約束|やくそく}を{守|まも}るはずだ。'), hint: 'まじめな かれの ことだから、きっと やくそくを まもるだろう' },
        { q: 'Chính vì đã kỳ vọng nên khi thua càng sốc. (thể thường)', answers: V('{期待|きたい}していただけに、{負|ま}けた{時|とき}はショックだった。', '{期待|きたい}していただけに、{負|ま}けた{時|とき}はショックが{大|おお}きかった。', '{期待|きたい}していただけに、{負|ま}けたのはショックだった。'), hint: 'きたい していた だけに、まけた ときは ショックだった' },
        { q: 'Đúng là sống ở Nhật mười năm có khác, kính ngữ rất tự nhiên. (thể thường)', answers: V('{十年|じゅうねん}も{日本|にほん}に{住|す}んでいるだけあって、{敬語|けいご}が{自然|しぜん}だ。', '{十年|じゅうねん}{日本|にほん}に{住|す}んでいるだけあって、{敬語|けいご}が{自然|しぜん}だ。', '{十年|じゅうねん}も{日本|にほん}に{住|す}んでいただけあって、{敬語|けいご}が{自然|しぜん}だ。'), hint: 'じゅうねんも にほんに すんでいる だけあって、けいごが しぜんだ' },
        { q: 'Cuốn sách này đáng để đọc. (thể thường)', answers: V('この{本|ほん}は{読|よ}むだけの{価値|かち}がある。', 'この{本|ほん}は、{読|よ}むだけの{価値|かち}がある。', 'この{本|ほん}には{読|よ}むだけの{価値|かち}がある。'), hint: 'この ほんは よむ だけの かちが ある' },
        { q: 'Xin lỗi, tại đường đông nên tôi đến muộn. (lịch sự)', answers: V('すみません、{道|みち}が{混|こ}んでいたものですから、{遅|おく}れてしまいました。', '{申|もう}し{訳|わけ}ありません、{道|みち}が{混|こ}んでいたものですから、{遅|おく}れてしまいました。', 'すみません、{道|みち}が{混|こ}んでいたものですから、{遅|おく}れました。'), hint: 'すみません、みちが こんでいた ものですから、おくれて しまいました' },
        { q: 'Tại lần đầu sống một mình nên không biết phải mua gì. (thể thường)', answers: V('{初|はじ}めての{一人暮|ひとりぐ}らしなものだから、{何|なに}を{買|か}えばいいか{分|わ}からなかった。', '{初|はじ}めての{一人暮|ひとりぐ}らしなもんだから、{何|なに}を{買|か}えばいいか{分|わ}からなかった。', '{初|はじ}めて{一人|ひとり}で{暮|く}らすものだから、{何|なに}を{買|か}えばいいか{分|わ}からなかった。'), hint: 'はじめての ひとりぐらし な ものだから、なにを かえば いいか わからなかった' },
        { q: 'Kết quả đáng tiếc nhưng tôi đã làm hết những gì có thể. (thể thường)', answers: V('{結果|けっか}は{残念|ざんねん}だったが、できるだけのことはした。', '{結果|けっか}は{残念|ざんねん}だったけど、できるだけのことはした。', '{結果|けっか}は{残念|ざんねん}だったが、できるだけのことはやった。'), hint: 'けっかは ざんねん だったが、できる だけの ことは した' },
      ],
    },
    {
      t: 'mcq',
      id: 'b48-bt-tn',
      title: 'Trắc nghiệm tổng hợp (12 câu)',
      items: DOI([
        { q: 'うっかり{口|くち}を{滑|すべ}らせた（　）、{秘密|ひみつ}がばれてしまった。', options: ['ばかりに', 'おかげで', 'だけあって', 'ことだから'], correct: 0, why: 'Một sơ suất nhỏ (うっかり) + hậu quả xấu → **ばかりに** (①).' },
        { q: '{先生|せんせい}が{丁寧|ていねい}に{教|おし}えてくださった（　）、{試験|しけん}に{合格|ごうかく}できた。', options: ['おかげで', 'ばかりに', 'せいで', 'ものの'], correct: 0, why: 'Kết quả TỐT + biết ơn → **おかげで** (Bài 27, bảng ⑤).' },
        { q: '{隣|となり}の{部屋|へや}の{工事|こうじ}の（　）、{一晩中|ひとばんじゅう}{眠|ねむ}れなかった。', options: ['せいで', 'おかげで', 'ばかりに', 'ことから'], correct: 0, why: 'N + の + đổ lỗi cho nguyên nhân bên ngoài → **せいで**. ばかりに không nối "Nの".' },
        { q: 'この{寺|てら}は、{秋|あき}になると{庭|にわ}が{真|ま}っ{赤|か}になる（　）、「{紅葉寺|もみじでら}」と{呼|よ}ばれている。', options: ['ことから', 'ことだから', 'ものだから', 'だけあって'], correct: 0, why: 'Nguồn gốc tên gọi → **ことから** (②).' },
        { q: 'いつも{遅刻|ちこく}する{山田|やまだ}さんの（　）、{今日|きょう}もきっと{遅|おく}れてくるよ。', options: ['ことだから', 'ことから', 'ばかりに', 'ものの'], correct: 0, why: '**Nの** + đoán theo thói quen quen thuộc → **ことだから** (bảng ⑥).' },
        { q: '{楽|たの}しみにしていた{旅行|りょこう}だった（　）、{中止|ちゅうし}になってがっかりした。', options: ['だけに', 'だけあって', 'わりに', 'ばかりか'], correct: 0, why: 'Kỳ vọng + thất vọng mạnh → **だけに** (③). だけあって không dùng cho kết quả xấu.' },
        { q: 'さすが{一流|いちりゅう}ホテル（　）、サービスが{素晴|すば}らしい。', options: ['だけあって', 'わりに', 'ばかりに', 'ものだから'], correct: 0, why: 'さすが + khen → **だけあって** (③).' },
        { q: '{値段|ねだん}が{高|たか}い（　）、{味|あじ}はいまいちだった。', options: ['わりに', 'だけあって', 'だけの', 'ことから'], correct: 0, why: 'Trái với mức mong đợi (đắt mà dở) → **わりに** (Bài 43, bảng ⑦).' },
        { q: '{遠|とお}くても、{一度|いちど}は{行|い}く（　）{価値|かち}がある。', options: ['だけの', 'だけに', 'ばかりに', 'ものの'], correct: 0, why: '**V＋だけの価値** — đáng để đi (③).' },
        { q: '{先輩|せんぱい}：「どうして{昨日|きのう}{来|こ}なかったの？」　{後輩|こうはい}：「すみません、{熱|ねつ}が{出|で}た（　）……。」', options: ['ものですから', 'ものの', 'ことから', 'だけあって'], correct: 0, why: 'Trả lời lý do + xin lỗi người trên → **ものですから** (④).' },
        { q: '{免許|めんきょ}は{取|と}った（　）、{一度|いちど}も{運転|うんてん}していない。', options: ['ものの', 'ものだから', 'ことから', 'だけに'], correct: 0, why: '"Tuy… nhưng" → **ものの** (Bài 28, bảng ⑧). ものだから là "tại vì".' },
        { q: '{雨|あめ}が{降|ふ}りそうだ（　）、{傘|かさ}を{持|も}っていきなさい。', options: ['から', 'ものだから', 'ばかりに', 'ことから'], correct: 0, why: 'Vế sau là **mệnh lệnh** (～なさい) → chỉ **から** đúng (bảng ⑤ mẹo ③).' },
      ]),
    },
    {
      t: 'build',
      id: 'b48-bt-ghep',
      title: 'Ghép câu (8 câu)',
      items: [
        { vi: 'Chỉ vì không xem kỹ bản đồ mà lên nhầm tàu.', chips: ['{地図|ちず}をよく', '{見|み}なかった', 'ばかりに', '{電車|でんしゃ}を{間違|まちが}えた', 'おかげで'], answer: ['{地図|ちず}をよく', '{見|み}なかった', 'ばかりに', '{電車|でんしゃ}を{間違|まちが}えた'], ro: 'Chizu o yoku minakatta bakari ni densha o machigaeta.' },
        { vi: 'Chỉ vì muốn được khen mà giấu chuyện bị thương.', chips: ['{褒|ほ}められたい', 'ばかりに', 'けがを', '{隠|かく}していた', 'たいだけに'], answer: ['{褒|ほ}められたい', 'ばかりに', 'けがを', '{隠|かく}していた'], ro: 'Homeraretai bakari ni kega o kakushite ita.' },
        { vi: 'Vì khu này xưa là cảng nên vẫn còn nhiều kho cũ.', chips: ['この{辺|あた}りは{昔|むかし}', '{港|みなと}だった', 'ことから', '{古|ふる}い{倉庫|そうこ}が{多|おお}く{残|のこ}っている', 'ことだから'], answer: ['この{辺|あた}りは{昔|むかし}', '{港|みなと}だった', 'ことから', '{古|ふる}い{倉庫|そうこ}が{多|おお}く{残|のこ}っている'], ro: 'Kono atari wa mukashi minato datta koto kara furui souko ga ooku nokotte iru.' },
        { vi: 'Mẹ tôi hay lo, chắc chắn sẽ gọi điện ngay.', chips: ['{心配性|しんぱいしょう}の', '{母|はは}の', 'ことだから', 'すぐに{電話|でんわ}してくるだろう', 'ことから'], answer: ['{心配性|しんぱいしょう}の', '{母|はは}の', 'ことだから', 'すぐに{電話|でんわ}してくるだろう'], ro: 'Shinpaishou no haha no koto da kara sugu ni denwa shite kuru darou.' },
        { vi: 'Chính vì là lần đầu ra nước ngoài nên cái gì cũng mới mẻ.', chips: ['{初|はじ}めての{海外|かいがい}', 'だけに', '{何|なに}もかも', '{新鮮|しんせん}だった', 'だけあって'], answer: ['{初|はじ}めての{海外|かいがい}', 'だけに', '{何|なに}もかも', '{新鮮|しんせん}だった'], ro: 'Hajimete no kaigai dake ni nanimo kamo shinsen datta.' },
        { vi: 'Đúng là nhà vô địch có khác, động tác khác hẳn.', chips: ['さすが', '{優勝者|ゆうしょうしゃ}', 'だけあって', '{動|うご}きが{違|ちが}う', 'わりに'], answer: ['さすが', '{優勝者|ゆうしょうしゃ}', 'だけあって', '{動|うご}きが{違|ちが}う'], ro: 'Sasuga yuushousha dake atte ugoki ga chigau.' },
        { vi: 'Tại ngon quá nên lỡ ăn tận ba bát.', chips: ['あまりに', 'おいしかった', 'ものだから', 'つい{三杯|さんばい}も{食|た}べてしまった', 'ものの'], answer: ['あまりに', 'おいしかった', 'ものだから', 'つい{三杯|さんばい}も{食|た}べてしまった'], ro: 'Amari ni oishikatta mono da kara tsui sanbai mo tabete shimatta.' },
        { vi: 'Tại lo cho em gái nên tôi đi xem tình hình thế nào.', chips: ['{妹|いもうと}が', '{心配|しんぱい}な', 'ものだから', '{様子|ようす}を{見|み}に{行|い}った', 'だ'], answer: ['{妹|いもうと}が', '{心配|しんぱい}な', 'ものだから', '{様子|ようす}を{見|み}に{行|い}った'], ro: 'Imouto ga shinpai na mono da kara yousu o mi ni itta.' },
      ],
    },
  ],
};

/* ═══════════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════════ */

const BUOI_1: Lesson = {
  id: 'b48-buoi-1-bakarini-monodakara',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 48 (N2): từ mới nhân quả & sự cố · ～ばかりに／～たいばかりに (chỉ vì… mà) · ～ものだから／ものですから (tại vì… nên) · bảng ⑤ · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng câu hỏi "Gần đây em có nhờ ai mà thành công / tại ai mà gặp chuyện không?" (ôn ～おかげで・～せいで Bài 27), học từ nhóm A (nhân quả & căn cứ) và nhóm B (sự cố & giải trình), dùng ～ばかりに để kể chuyện tiếc nuối và ～たいばかりに để kể "vì quá muốn", dùng ～ものですから để xin lỗi việc nhỏ và biết khi nào nó thành bào chữa, đọc hội thoại ① (báo cáo sự cố) và luyện cặp.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — giáo viên hỏi: "Gần đây có ai giúp em thành công việc gì không? Có ai làm em gặp chuyện không?" Các em trả lời bằng mẫu đã học: **～のおかげで** (Bài 27), **～のせいで** (Bài 27). Giáo viên: "Hôm nay ta học thêm hai cách nói nguyên nhân có **cảm xúc**: **tiếc nuối** và **bào chữa**."',
        '**Từ mới (13′)** — nhóm A (nhân quả & căn cứ: {因果関係|いんがかんけい}, {要因|よういん}, {招|まね}く, {引|ひ}き{起|お}こす, もたらす, {及|およ}ぼす, {裏付|うらづ}ける, {推測|すいそく}, {相関|そうかん}, {錯覚|さっかく}, {仮説|かせつ}, {検証|けんしょう}, {頻度|ひんど}, {頻繁|ひんぱん}, {密接|みっせつ}) + nhóm B (sự cố: {不具合|ふぐあい}, {欠陥|けっかん}, {再発防止|さいはつぼうし}, {経緯|けいい}, {釈明|しゃくめい}, {弁解|べんかい}, {始末書|しまつしょ}, {不注意|ふちゅうい}, {思|おも}い{込|こ}み, {確認漏|かくにんも}れ, {慌|あわ}てる, {問|と}い{詰|つ}める, {責|せ}める).',
        '**Ngữ pháp (20′)** — ① **～ばかりに** (chỉ vì… mà — hậu quả xấu; cách nối: Nである) + **～たいばかりに** · ④ **～ものだから／もんだから／ものですから** (lý do cá nhân; vế sau không mệnh lệnh) · bảng ⑤ (ばかりに・せいで・おかげで・ため・ものだから).',
        '**Hội thoại (7′)** — ① ワン báo cáo sự cố hệ thống; vì sao "ものですから" ở đầu báo cáo nghe như bào chữa.',
        '**チャレンジ (5′)** — luyện cặp: A gây lỗi, nói lý do bằng ～ものですから → B (cấp trên) nhắc → A nói lại bằng ～ばかりに、～てしまいました + biện pháp. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b48-b1-slides',
      title: 'Bài 48 原因と結果 — Buổi 1: ばかりに・ものだから',
      slides: [
        {
          tieuDe: '{第|だい}48{課|か} {原因|げんいん}と{結果|けっか}',
          anh: ['link', 'bug', 'sunrise-over-mountains', 'bar-chart'],
          nhan: ['{原因|げんいん}と{結果|けっか}', 'ミス', '{地名|ちめい}', 'データ'],
          dong: ['Hôm nay: **～ばかりに** (chỉ vì… mà) · **～ものだから** (tại vì… nên)'],
          ro: ['~ bakari ni · ~ mono da kara'],
          ghi: 'Bài 48 là bài thứ ba của chặng N2 (46–50). Chủ đề: nguyên nhân → kết quả — sự cố ở công ty, nguồn gốc địa danh, nghiên cứu khoá luận. Bốn mẫu: ばかりに, ことから, だけに, ものだから. Buổi 1: ばかりに + ものだから — hai mẫu "có cảm xúc": tiếc nuối và bào chữa.',
        },
        {
          tieuDe: 'できること — Học xong Bài 48 làm được gì?',
          anh: ['desktop-computer', 'cherry-blossom', 'woman-student'],
          nhan: ['48-1 {障害報告|しょうがいほうこく}', '48-2 まち{歩|ある}き', '48-3 {卒論発表|そつろんはっぴょう}'],
          dong: ['① Báo cáo lỗi: {確認|かくにん}を{一|ひと}つ{怠|おこた}ったばかりに、ご{迷惑|めいわく}をおかけしました。', '② Giải thích tên: {砂浜|すなはま}が{見|み}えたことから「{浜見坂|はまみざか}」と{呼|よ}ばれた。', '③ An ủi: {一生懸命|いっしょうけんめい}やっていただけに、{悔|くや}しいよね。'],
          ro: ['Kakunin o hitotsu okotatta bakari ni, gomeiwaku o okake shimashita.', 'Sunahama ga mieta koto kara "Hamamizaka" to yobareta.', 'Isshoukenmei yatte ita dake ni, kuyashii yo ne.'],
          ghi: 'Ba buổi đi đúng ba tình huống: buổi 1 ばかりに + ものだから (sự cố ở công ty), buổi 2 ことから + ことだから (đi bộ tìm nguồn gốc tên phố), buổi 3 だけに / だけあって / だけの + bảng もの (sau buổi báo cáo khoá luận). Cuối bài: trình bày 1 phút và bài luận 400–600 chữ.',
        },
        {
          tieuDe: 'Khởi động — おかげで？ せいで？',
          anh: ['smiling-face-with-halo', 'crying-face'],
          nhan: ['〜のおかげで (tốt)', '〜のせいで (xấu)'],
          dong: ['{先輩|せんぱい}のおかげで、{合格|ごうかく}できました。', '{隣|となり}の{工事|こうじ}のせいで、{眠|ねむ}れませんでした。'],
          ro: ['Senpai no okage de, goukaku dekimashita.', 'Tonari no kouji no sei de, nemuremasen deshita.'],
          hoi: '{最近|さいきん}、{誰|だれ}かのおかげで{助|たす}かったことがありますか。',
          dap: '（{例|れい}）はい。{友達|ともだち}がノートを{貸|か}してくれたおかげで、テストに{間|ま}に{合|あ}いました。',
          ghi: 'Gọi 3–4 bạn, mỗi bạn một câu おかげで và một câu せいで. Ghi lên bảng hai cột "tốt / xấu". Nói: hôm nay thêm hai màu nữa — "tiếc nuối" (ばかりに) và "bào chữa" (ものだから).',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — {原因|げんいん}を{考|かんが}える',
          anh: ['link', 'bar-chart', 'light-bulb', 'magnifying-glass-tilted-left'],
          nhan: ['{因果関係|いんがかんけい}', '{相関|そうかん}', '{仮説|かせつ}', '{検証|けんしょう}'],
          dong: ['{誤解|ごかい}を{招|まね}く · {事故|じこ}を{引|ひ}き{起|お}こす', '{変化|へんか}をもたらす · {影響|えいきょう}を{及|およ}ぼす', '{仮説|かせつ}を{立|た}てる → {検証|けんしょう}する → {裏付|うらづ}ける'],
          ro: ['Gokai o maneku · jiko o hikiokosu', 'Henka o motarasu · eikyou o oyobosu', 'Kasetsu o tateru → kenshou suru → urazukeru'],
          hoi: '「{相関|そうかん}」と「{因果関係|いんがかんけい}」はどう{違|ちが}いますか。',
          dap: '{相関|そうかん}は{二|ふた}つのことが{一緒|いっしょ}に{変|か}わることで、{因果関係|いんがかんけい}は{一方|いっぽう}がもう{一方|いっぽう}の{原因|げんいん}になることです。',
          ghi: 'Đọc to nhóm A theo 🔊. Bốn động từ "gây ra" học CÙNG tân ngữ: 誤解を招く · 事故を引き起こす · 変化をもたらす · 影響を及ぼす. Vẽ trên bảng: 相関 (hai mũi tên song song) ↔ 因果 (một mũi tên A → B).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — ミスと{報告|ほうこく}',
          anh: ['bug', 'anxious-face-with-sweat', 'clipboard', 'memo'],
          nhan: ['{不具合|ふぐあい}', '{慌|あわ}てる', '{経緯|けいい}', '{始末書|しまつしょ}'],
          dong: ['{不具合|ふぐあい}が{起|お}きる → {経緯|けいい}を{説明|せつめい}する', '{原因|げんいん}：{不注意|ふちゅうい}・{思|おも}い{込|こ}み・{確認漏|かくにんも}れ', '→ {再発防止策|さいはつぼうしさく} · ✕ {弁解|べんかい}'],
          ro: ['Fuguai ga okiru → keii o setsumei suru', 'Gen\'in: fuchuui · omoikomi · kakunin more', '→ saihatsu boushisaku · ✕ benkai'],
          hoi: '{仕事|しごと}でミスをした{時|とき}、{報告書|ほうこくしょ}には{何|なに}を{書|か}きますか。',
          dap: '{経緯|けいい}と{原因|げんいん}と{再発防止策|さいはつぼうしさく}を{書|か}きます。',
          ghi: 'Học nhóm B theo trình tự một báo cáo sự cố. Nhấn: 不具合 (lỗi chạy) ↔ 欠陥 (lỗi thiết kế) ↔ 故障 (hỏng); 釈明 (giải trình chính thức) ↔ 弁解 (biện bạch) ↔ 言い訳 (bào chữa). 経緯 đọc けいい — ba âm tiết ke-i-i.',
        },
        {
          tieuDe: '① ～ばかりに — 「たった{一|ひと}つのことで、{悪|わる}い{結果|けっか}に」',
          anh: ['person-bowing', 'warning'],
          nhan: ['{後悔|こうかい}', '{悪|わる}い{結果|けっか}'],
          dong: ['{普通形|ふつうけい} ＋ ばかりに、～てしまった', 'たった{一言|ひとこと}{言|い}ったばかりに、{嫌|きら}われてしまった。', '{確認|かくにん}しなかったばかりに、{予約|よやく}を{間違|まちが}えた。'],
          ro: ['Futsuukei + bakari ni, ~ te shimatta', 'Tatta hitokoto itta bakari ni, kirawarete shimatta.', 'Kakunin shinakatta bakari ni, yoyaku o machigaeta.'],
          bang: { head: ['Loại', 'Nối'], rows: [['V', '{言|い}ったばかりに'], ['イA', '{高|たか}いばかりに'], ['ナA', '{正直|しょうじき}なばかりに'], ['N', '{新人|しんじん}であるばかりに（✕{新人|しんじん}ばかりに）']] },
          hoi: '「{子|こ}どもばかりに」と「{子|こ}どもであるばかりに」は{同|おな}じ{意味|いみ}ですか。',
          dap: 'いいえ、{違|ちが}います。「{子|こ}どもであるばかりに」は「{子|こ}どもだから、それだけの{理由|りゆう}で」という{意味|いみ}です。',
          ghi: 'Giảng: ばかりに = nguyên nhân (thường nhỏ) + hậu quả XẤU + người nói tiếc. Dấu hiệu: たった・一言・一度・うっかり; vế sau ～てしまった. Bẫy nối danh từ: phải có である (Nばかり là "toàn là N" — Bài 22).',
        },
        {
          tieuDe: '① ～ばかりに — {練習|れんしゅう}',
          anh: ['alarm-clock', 'train'],
          nhan: ['{寝坊|ねぼう}', '{乗|の}り{過|す}ごす'],
          dong: ['{寝坊|ねぼう}したばかりに、{試験|しけん}に{間|ま}に{合|あ}わなかった。', '{電車|でんしゃ}で{寝|ね}てしまったばかりに、{駅|えき}を{乗|の}り{過|す}ごした。'],
          ro: ['Nebou shita bakari ni, shiken ni ma ni awanakatta.', 'Densha de nete shimatta bakari ni, eki o norisugoshita.'],
          hoi: '{最近|さいきん}、「～ばかりに」と{言|い}いたくなる{失敗|しっぱい}はありますか。',
          dap: '（{例|れい}）はい。{傘|かさ}を{持|も}っていかなかったばかりに、びしょぬれになりました。',
          ghi: 'Mỗi bạn một câu về thất bại thật của mình. Sửa ngay nếu vế sau là ý chí (✕ ～ばかりに、～しよう).',
        },
        {
          tieuDe: '① ～たいばかりに — 「どうしても～たくて」',
          anh: ['microphone', 'money-with-wings'],
          nhan: ['{会|あ}いたい', '{見栄|みえ}を{張|は}りたい'],
          dong: ['{歌手|かしゅ}に{会|あ}いたいばかりに、{雨|あめ}の{中|なか}を{三時間|さんじかん}{並|なら}んだ。', '{見栄|みえ}を{張|は}りたいばかりに、{高|たか}い{車|くるま}を{買|か}ってしまった。'],
          ro: ['Kashu ni aitai bakari ni, ame no naka o sanjikan naranda.', 'Mie o haritai bakari ni, takai kuruma o katte shimatta.'],
          hoi: '「～たいばかりに」の{後|うし}ろには、どんな{文|ぶん}が{来|き}ますか。',
          dap: 'その{人|ひと}が{無理|むり}をしてしたことや、{大変|たいへん}なことが{来|き}ます。',
          ghi: 'たいばかりに: vế trước là MONG MUỐN, vế sau là hành động "bất chấp" (xếp hàng, nói dối, mua đắt). Không nhất thiết là hậu quả xấu, nhưng luôn có ý "tới mức ấy".',
        },
        {
          tieuDe: '④ ～ものだから — 「すみません、～ものですから」',
          anh: ['woman-bowing', 'bus'],
          nhan: ['お{詫|わ}び', '{遅|おく}れた'],
          dong: ['{普通形|ふつうけい}（ナAな・Nな）＋ ものだから', 'すみません、バスが{遅|おく}れたものですから。', '{初|はじ}めての{一人暮|ひとりぐ}らしなものだから、{何|なに}も{分|わ}からなかった。'],
          ro: ['Futsuukei (na-A na · N na) + mono da kara', 'Sumimasen, basu ga okureta mono desu kara.', 'Hajimete no hitorigurashi na mono da kara, nani mo wakaranakatta.'],
          bang: { head: ['Mức', 'Dạng'], rows: [['{友達|ともだち}', 'もんだから'], ['ふつう', 'ものだから'], ['{目上|めうえ}・お{客様|きゃくさま}', 'ものですから']] },
          hoi: '{授業|じゅぎょう}に{遅刻|ちこく}した{時|とき}、{先生|せんせい}に{何|なん}と{言|い}いますか。',
          dap: '{遅|おく}れてすみません。{電車|でんしゃ}が{止|と}まっていたものですから。',
          ghi: 'ものだから = lý do CÁ NHÂN, mong người nghe thông cảm. Nhấn cách nối: ナA / N dùng な (心配なものだから · 雨なものだから). ものですから đi kèm lời xin lỗi là rất tự nhiên.',
        },
        {
          tieuDe: '④ ～ものだから — {使|つか}えない{時|とき}',
          anh: ['cross-mark', 'check-mark-button'],
          nhan: ['✕', '○'],
          dong: ['✕ {時間|じかん}がないものだから、{急|いそ}いでください。', '○ {時間|じかん}がないので、{急|いそ}いでください。', '✕ {報告書|ほうこくしょ}：「{忙|いそが}しかったものですから」'],
          ro: ['✕ Jikan ga nai mono da kara, isoide kudasai.', '○ Jikan ga nai node, isoide kudasai.', '✕ Houkokusho: "Isogashikatta mono desu kara"'],
          hoi: '「{暑|あつ}いものだから、{窓|まど}を{開|あ}けましょう」は{正|ただ}しいですか。',
          dap: 'いいえ。{後|うし}ろが「～ましょう」なので、「{暑|あつ}いから」と{言|い}います。',
          ghi: 'Hai giới hạn: (1) vế sau không mệnh lệnh / nhờ vả / rủ rê / ý chí; (2) không dùng trong báo cáo chính thức — nghe như bào chữa (hội thoại ①).',
        },
        {
          tieuDe: '⑤ {原因|げんいん}の{言|い}い{方|かた} — どれを{使|つか}う？',
          dong: ['Kết quả xấu + tiếc nuối → ばかりに', 'Kết quả xấu + đổ lỗi → せいで', 'Kết quả tốt + biết ơn → おかげで', 'Lý do của mình + xin thông cảm → ものだから'],
          ro: ['→ bakari ni', '→ sei de', '→ okage de', '→ mono da kara'],
          bang: { head: ['Mẫu', 'Kết quả', 'Thái độ'], rows: [['ばかりに', 'xấu', 'tiếc nuối'], ['せいで', 'xấu', 'đổ lỗi'], ['おかげで', 'tốt', 'biết ơn'], ['ため', 'mọi loại', 'khách quan (văn viết)'], ['ものだから', 'việc mình làm', 'bào chữa']] },
          hoi: '「{先生|せんせい}が{教|おし}えてくださった（　）、{合格|ごうかく}できた」— {何|なに}が{入|はい}りますか。',
          dap: '「おかげで」です。{結果|けっか}がいいからです。',
          ghi: 'Ba câu hỏi để chọn: kết quả tốt hay xấu? có dấu hiệu "chỉ một chuyện nhỏ" không? người nói đang giải thích lý do của mình không? Vế sau mệnh lệnh → chỉ から／ので.',
        },
        {
          tieuDe: '{会話|かいわ} ① — 「たった{一|ひと}つの{確認|かくにん}を{怠|おこた}ったばかりに」',
          anh: ['woman-office-worker', 'desktop-computer', 'man-office-worker'],
          nhan: ['ワン・{鈴木|すずき}', '{不具合|ふぐあい}', '{森課長|もりかちょう}'],
          dong: ['ワン：{終電|しゅうでん}の{時間|じかん}が{迫|せま}っていたものですから……。', '{鈴木|すずき}：{言|い}い{訳|わけ}に{聞|き}こえかねないから。', 'ワン：たった{一|ひと}つの{確認|かくにん}を{怠|おこた}ったばかりに……。'],
          ro: ['Wan: Shuuden no jikan ga sematte ita mono desu kara…….', 'Suzuki: Iiwake ni kikoekanenai kara.', 'Wan: Tatta hitotsu no kakunin o okotatta bakari ni…….'],
          hoi: '{鈴木|すずき}さんはどうして「ものですから」と{言|い}わないほうがいいと{言|い}いましたか。',
          dap: '{課長|かちょう}への{報告|ほうこく}で{最初|さいしょ}に{言|い}うと、{言|い}い{訳|わけ}に{聞|き}こえかねないからです。',
          ghi: 'Nghe hội thoại ① hai lần không nhìn chữ. Rồi đọc phân vai. Chỉ ra 5 mẫu trong hội thoại: ものですから, ばかりに, だけに (×2), ことから, だけあって — hai mẫu sau học ở buổi 2, 3.',
        },
        {
          tieuDe: 'チャレンジ — ペアで{話|はな}そう',
          anh: ['man-office-worker', 'woman-office-worker'],
          nhan: ['A：ミスをした{人|ひと}', 'B：{上司|じょうし}'],
          dong: ['A：{申|もう}し{訳|わけ}ありません。～ものですから……。', 'B：{言|い}い{訳|わけ}より、{原因|げんいん}と{対策|たいさく}を{聞|き}かせてください。', 'A：～ばかりに、～てしまいました。{今後|こんご}は～ようにします。'],
          ro: ['A: Moushiwake arimasen. ~ mono desu kara…….', 'B: Iiwake yori, gen\'in to taisaku o kikasete kudasai.', 'A: ~ bakari ni, ~ te shimaimashita. Kongo wa ~ you ni shimasu.'],
          ghi: 'Tình huống gợi ý: gửi nhầm file cho khách · quên đặt phòng họp · nhập sai giá. Đổi vai. Giáo viên đi vòng nghe, sửa nối danh từ (Nである) và vế sau của ものだから.',
        },
        {
          tieuDe: 'まとめ — {今日|きょう}のポイント',
          nhan: ['ポイント'],
          dong: ['～ばかりに：chỉ vì… mà (xấu, tiếc) · Nであるばかりに · Vたいばかりに', '～ものだから：tại vì… (lý do mình) · ナA／N＋な · ものですから lịch sự', 'Vế sau ばかりに・ものだから: KHÔNG mệnh lệnh, rủ rê, ý chí'],
          ro: ['~ bakari ni · N de aru bakari ni · V-tai bakari ni', '~ mono da kara · na-A / N + na · mono desu kara', 'bakari ni · mono da kara + ✕ meirei · sasoi · ishi'],
          ghi: 'Bài về nhà: viết 5 câu ～ばかりに về thất bại thật của mình + 3 câu ～ものですから (xin lỗi đi muộn, quên bài tập, trả lời mail chậm). Buổi sau kiểm tra miệng đầu giờ.',
        },
      ],
    },
    {
      t: 'p',
      text: 'Giáo viên kể một chuyện của chính mình: "**{昨日|きのう}、{傘|かさ}を{持|も}たずに{出|で}かけたばかりに、びしょぬれになってしまいました。**" Hỏi cả lớp: "Cô **tiếc** hay **đổ lỗi**?" — "Tiếc ạ." "Đúng. Còn nếu cô đến muộn rồi nói với hiệu trưởng: **{電車|でんしゃ}が{遅|おく}れたものですから**… thì đó là gì?" — "Giải thích… bào chữa ạ." "Hôm nay ta học hai màu đó."',
    },
    {
      t: 'mcq',
      id: 'b48-b1-khoi-dong',
      title: 'Khởi động — ôn mẫu đã học (4 câu)',
      items: DOI([
        { q: '{友達|ともだち}が{手伝|てつだ}ってくれた（　）、{早|はや}く{終|お}わった。（Bài 27）', options: ['おかげで', 'せいで', 'ために', 'くせに'], correct: 0, why: 'Kết quả TỐT + biết ơn → **おかげで** (Bài 27).' },
        { q: '{雨|あめ}の（　）、{試合|しあい}が{中止|ちゅうし}になった。（đổ lỗi — Bài 27）', options: ['せいで', 'おかげで', 'わりに', 'うちに'], correct: 0, why: 'Nの + kết quả xấu, chỉ ra nguyên nhân → **せいで**.' },
        { q: '{大雪|おおゆき}の（　）、{本日|ほんじつ}は{休校|きゅうこう}とします。（thông báo — Bài 27）', options: ['ため', 'せいで', 'おかげで', 'くせに'], correct: 0, why: 'Văn thông báo, khách quan → **ため**.' },
        { q: '{少|すこ}し{言|い}いすぎた（　）、{友達|ともだち}を{怒|おこ}らせてしまった。（Bài 27 — chỉ nhận ra）', options: ['ばかりに', 'おかげで', 'ために', 'わりに'], correct: 0, why: 'Một chuyện nhỏ + hậu quả xấu + tiếc → **ばかりに** (Bài 27 chỉ nhận ra — hôm nay học chính thức).' },
      ]),
    },
    { t: 'h', text: 'Slide 4–5 — Từ mới: nhân quả & sự cố' },
    {
      t: 'p',
      text: 'Giáo viên vẽ lên bảng **trình tự một nghiên cứu**: **{相関|そうかん}** → **{推測|すいそく}** → **{仮説|かせつ}を{立|た}てる** → **{検証|けんしょう}する** → **{要因|よういん}／{因果関係|いんがかんけい}** → **{裏付|うらづ}ける**. Bên cạnh vẽ **trình tự một báo cáo sự cố**: **{不具合|ふぐあい}** → **{経緯|けいい}** → **{原因|げんいん}（{不注意|ふちゅうい}・{思|おも}い{込|こ}み・{確認漏|かくにんも}れ）** → **{再発防止策|さいはつぼうしさく}**. Học sinh đọc to từng nhãn; giáo viên gạch chéo chữ **{弁解|べんかい}** và nói: "Trong báo cáo, không có chỗ cho nó."',
    },
    {
      t: 'examples',
      items: [
        E('{説明|せつめい}が{足|た}りないと、{誤解|ごかい}を{招|まね}く。', 'Setsumei ga tarinai to, gokai o maneku.', 'Giải thích không đủ thì gây hiểu lầm.'),
        E('{睡眠不足|すいみんぶそく}は、{集中力|しゅうちゅうりょく}に{影響|えいきょう}を{及|およ}ぼす。', 'Suimin busoku wa, shuuchuuryoku ni eikyou o oyobosu.', 'Thiếu ngủ ảnh hưởng tới khả năng tập trung.'),
        E('{事故|じこ}の{経緯|けいい}を{時間|じかん}の{順|じゅん}に{説明|せつめい}する。', 'Jiko no keii o jikan no jun ni setsumei suru.', 'Trình bày diễn biến sự cố theo thứ tự thời gian.'),
        E('{私|わたし}の{不注意|ふちゅうい}で、ご{迷惑|めいわく}をおかけしました。', 'Watashi no fuchuui de, gomeiwaku o okake shimashita.', 'Do tôi sơ ý mà đã gây phiền hà.'),
      ],
    },
    { t: 'h', text: 'Slide 6–11 — ばかりに・ものだから: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b48-b1-noi-tu',
      title: 'Luyện nhanh — điền mẫu (8 câu)',
      kind: 'fill',
      items: [
        { q: '{一度|いちど}{間違|まちが}えた（　　　）、アカウントがロックされた。（chỉ vì — tiếc）', answers: ['ばかりに'], hint: 'Vた＋ばかりに' },
        { q: '{会|あ}い（　　）ばかりに、{遠|とお}くまで{行|い}った。（chỉ vì MUỐN gặp）', answers: ['たい'], hint: 'Vたい＋ばかりに' },
        { q: '{留学生|りゅうがくせい}（　　　）ばかりに、{部屋|へや}を{断|ことわ}られた。（2 chữ kana + である）', answers: ['である'], hint: 'Nである＋ばかりに' },
        { q: '{正直|しょうじき}（　）ばかりに、{損|そん}をすることもある。（1 chữ）', answers: ['な'], hint: 'ナA な＋ばかりに' },
        { q: 'すみません、バスが{遅|おく}れた（　　　　　）。（lịch sự, 6 chữ kana）', answers: ['ものですから', 'もんですから'], hint: 'ものですから' },
        { q: '{心配|しんぱい}（　）ものだから、{毎晩|まいばん}{電話|でんわ}している。（1 chữ）', answers: ['な'], hint: 'ナA な＋ものだから' },
        { q: '{雨|あめ}（　）もんだから、{出|で}かけなかった。（1 chữ）', answers: ['な'], hint: 'N な＋もんだから' },
        { q: '{時間|じかん}がない（　　）、{急|いそ}いでください。（vế sau nhờ vả → KHÔNG ものだから; 2 chữ kana）', answers: ['ので', 'から'], hint: 'ので／から' },
      ],
    },
    {
      t: 'quiz',
      id: 'b48-b1-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '普通形＋ばかりに · Vたいばかりに · 普通形＋ものだから／ものですから',
      items: [
        { q: 'Chỉ vì quên lưu một lần mà mất sạch ba tiếng làm việc.', answers: V('{一回|いっかい}{保存|ほぞん}を{忘|わす}れたばかりに、{三時間分|さんじかんぶん}が{全部|ぜんぶ}{消|き}えてしまった。', '{一度|いちど}{保存|ほぞん}を{忘|わす}れたばかりに、{三時間分|さんじかんぶん}が{全部|ぜんぶ}{消|き}えてしまった。', '{一回|いっかい}{保存|ほぞん}を{忘|わす}れたばかりに、{三時間分|さんじかんぶん}が{消|き}えてしまった。'), hint: 'いっかい ほぞんを わすれた ばかりに、さんじかんぶんが ぜんぶ きえて しまった' },
        { q: 'Chỉ vì không xem kỹ bản đồ mà lên nhầm tàu.', answers: V('{地図|ちず}をよく{見|み}なかったばかりに、{電車|でんしゃ}を{間違|まちが}えてしまった。', '{地図|ちず}をよく{見|み}なかったばかりに、{違|ちが}う{電車|でんしゃ}に{乗|の}ってしまった。', '{地図|ちず}をよく{見|み}なかったばかりに、{電車|でんしゃ}を{間違|まちが}えた。'), hint: 'ちずを よく みなかった ばかりに、でんしゃを まちがえて しまった' },
        { q: 'Chỉ vì muốn ra sân mà giấu chuyện bị thương.', answers: V('{試合|しあい}に{出|で}たいばかりに、けがを{隠|かく}していた。', '{試合|しあい}に{出|で}たいばかりに、けがをしたことを{隠|かく}していた。', '{試合|しあい}に{出|で}たいばかりに、けがを{隠|かく}した。'), hint: 'しあいに でたい ばかりに、けがを かくしていた' },
        { q: 'Xin lỗi, tại tàu dừng nên tôi đến muộn. (lịch sự)', answers: V('すみません、{電車|でんしゃ}が{止|と}まったものですから、{遅|おく}れてしまいました。', '{申|もう}し{訳|わけ}ありません、{電車|でんしゃ}が{止|と}まっていたものですから、{遅|おく}れてしまいました。', 'すみません、{電車|でんしゃ}が{止|と}まったものですから、{遅|おく}れました。'), hint: 'すみません、でんしゃが とまった ものですから、おくれて しまいました' },
        { q: 'Tại ngon quá nên lỡ ăn tận ba bát. (thể thường)', answers: V('あまりにおいしかったものだから、つい{三杯|さんばい}も{食|た}べてしまった。', 'あまりにおいしかったもんだから、つい{三杯|さんばい}も{食|た}べてしまった。', 'とてもおいしかったものだから、{三杯|さんばい}も{食|た}べてしまった。'), hint: 'あまりに おいしかった ものだから、つい さんばいも たべて しまった' },
        { q: 'Vì tiếng Nhật còn kém nên nếu lỡ thất lễ thì xin thứ lỗi. (lịch sự)', answers: V('{日本語|にほんご}がまだ{下手|へた}なものですから、{失礼|しつれい}なことを{言|い}ったらすみません。', '{日本語|にほんご}がまだ{下手|へた}なものですから、{失礼|しつれい}があったらすみません。', '{日本語|にほんご}がまだ{下手|へた}なものですから、{失礼|しつれい}なことを{言|い}ったら{申|もう}し{訳|わけ}ありません。'), hint: 'にほんごが まだ へたな ものですから、しつれいな ことを いったら すみません' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**① ばかりに = nguyên nhân nhỏ, hậu quả xấu, người nói tiếc** — vế sau là sự việc đã xảy ra (～てしまった), không phải ý chí. Danh từ phải có **である**: {新人|しんじん}であるばかりに.',
        '**② たいばかりに = "vì quá muốn"** — vế sau là việc người đó bất chấp làm. Không nhầm với **Vたばかり** (vừa mới — Bài 22): {買|か}ったばかりなのに{壊|こわ}れた.',
        '**③ ものだから = lý do của MÌNH** — ナA/N + **な**; ものですから lịch sự đi kèm xin lỗi; không đi với mệnh lệnh, rủ rê; không dùng trong báo cáo.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「ばかりに」を{使|つか}って、{最近|さいきん}の{失敗|しっぱい}を{一|ひと}つ{話|はな}してください。', ro: '"Bakari ni" o tsukatte, saikin no shippai o hitotsu hanashite kudasai.', vi: 'Hãy dùng "bakari ni" để kể một thất bại gần đây.' },
        { who: 'Bạn', role: 'candidate', text: '{先週|せんしゅう}、{目覚|めざ}ましをかけ{忘|わす}れたばかりに、{一時間目|いちじかんめ}の{授業|じゅぎょう}に{遅刻|ちこく}してしまいました。', ro: 'Senshuu, mezamashi o kakewasureta bakari ni, ichijikanme no jugyou ni chikoku shite shimaimashita.', vi: 'Tuần trước, chỉ vì quên đặt báo thức mà em đã đi muộn tiết một.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'じゃあ、その{時|とき}、{先生|せんせい}に{何|なん}と{言|い}いましたか。「ものですから」を{使|つか}ってください。', ro: 'Jaa, sono toki, sensei ni nan to iimashita ka. "Mono desu kara" o tsukatte kudasai.', vi: 'Vậy lúc đó em đã nói gì với thầy cô? Hãy dùng "mono desu kara".' },
        { who: 'Bạn', role: 'candidate', text: '「{遅|おく}れてすみません。{目覚|めざ}ましが{鳴|な}らなかったものですから」と{言|い}いました。', ro: '"Okurete sumimasen. Mezamashi ga naranakatta mono desu kara" to iimashita.', vi: 'Em đã nói: "Em xin lỗi vì đến muộn. Tại đồng hồ báo thức không kêu ạ."' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'いいですね。でも、{本当|ほんとう}は「{鳴|な}らなかった」のではなく、「かけ{忘|わす}れた」んですよね。それを{正直|しょうじき}に{言|い}うと、{先生|せんせい}は{怒|おこ}らないかもしれませんよ。', ro: 'Ii desu ne. Demo, hontou wa "naranakatta" no de wa naku, "kakewasureta" n desu yo ne. Sore o shoujiki ni iu to, sensei wa okoranai kamo shiremasen yo.', vi: 'Tốt lắm. Nhưng thật ra không phải "nó không kêu" mà là "em quên đặt" đúng không. Nói thật điều đó thì thầy cô có khi lại không giận đâu.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b48-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: DOI([
        { q: 'たった{一言|ひとこと}{余計|よけい}なことを{言|い}った（　）、{嫌|きら}われてしまった。', options: ['ばかりに', 'おかげで', 'ものの', 'ので、'], correct: 0, why: 'Nguyên nhân nhỏ (たった一言) + hậu quả xấu + tiếc → **ばかりに** (①).' },
        { q: '{外国人|がいこくじん}（　）ばかりに、アパートを{借|か}りられなかった。', options: ['である', 'の', 'な', 'に'], correct: 0, why: 'Danh từ + **である** + ばかりに.' },
        { q: '{親|おや}に{褒|ほ}められ（　）ばかりに、{毎晩|まいばん}{遅|おそ}くまで{勉強|べんきょう}した。', options: ['たい', 'た', 'ない', 'たり'], correct: 0, why: '"Chỉ vì muốn được khen" → **Vたい＋ばかりに**.' },
        { q: '{遅|おく}れてすみません。{道|みち}が{混|こ}んでいた（　）。', options: ['ものですから', 'ものの', 'ばかりか', 'ことから'], correct: 0, why: 'Xin lỗi + lý do cá nhân → **ものですから** (④).' },
        { q: '「{時間|じかん}がないものだから、{急|いそ}いでください」はどうして{不自然|ふしぜん}ですか。', options: ['{後|うし}ろが{頼|たの}む{文|ぶん}だから', '「{時間|じかん}」が{名詞|めいし}だから', 'ものだからは{過去|かこ}にしか{使|つか}えないから', '「ない」の{後|あと}にはものだからが{来|こ}ないから'], correct: 0, why: 'Vế sau của ものだから không được là **nhờ vả / mệnh lệnh** → dùng ので／から.' },
      ]),
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b48-buoi-2-kotokara',
  kind: 'review',
  title: 'Buổi 2 — Từ mới địa danh & nguồn gốc · ～ことから (căn cứ · nguồn gốc tên gọi · khởi đầu) · ～のことだから (bảng ⑥) · hội thoại ②',
  goal: 'Theo nhịp một buổi trên lớp: kiểm tra miệng ～ばかりに・～ものですから của buổi 1, học từ nhóm C (địa danh & nguồn gốc), dùng ～ことから để suy luận từ dấu hiệu và giải thích tên gọi, phân biệt với Nのことだから (đoán theo tính cách quen thuộc), đọc hội thoại ② (đi bộ tìm nguồn gốc tên phố) và giới thiệu nguồn gốc tên một nơi ở quê mình.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — gọi 3 bạn: một câu **～ばかりに** về thất bại của mình, một câu **～ものですから** xin lỗi đi muộn. Sửa lỗi nối danh từ (Nであるばかりに) và vế sau của ものだから.',
        '**Từ mới (12′)** — nhóm C (địa danh & nguồn gốc: {名称|めいしょう}, {愛称|あいしょう}, {地名|ちめい}, {坂|さか}, {谷|たに}, {海岸|かいがん}, {砂浜|すなはま}, {湾|わん}, {丘|おか}, {郷土|きょうど}, {遺跡|いせき}, {言|い}い{伝|つた}え, {名付|なづ}ける) — học qua một bản đồ khu phố vẽ trên bảng.',
        '**Ngữ pháp (20′)** — ② **～ことから** ba cách dùng: căn cứ (～と{考|かんが}えられる), nguồn gốc tên (～と{呼|よ}ばれる), khởi đầu (～になった) · cách nối Nである · bảng ⑥ **ことから ↔ Nのことだから ↔ から**.',
        '**Hội thoại (8′)** — ② マリヤム, ダニエル và ông 大野 ở chân dốc 浜見坂.',
        '**チャレンジ (5′)** — giới thiệu nguồn gốc tên một nơi / một món ăn ở quê mình bằng ～ことから、～と{呼|よ}ばれています. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b48-b2-slides',
      title: 'Bài 48 原因と結果 — Buổi 2: ことから・ことだから',
      slides: [
        {
          tieuDe: '{第|だい}48{課|か} — {地名|ちめい}の{由来|ゆらい}',
          anh: ['sunrise-over-mountains', 'beach-with-umbrella', 'cherry-blossom', 'scroll'],
          nhan: ['{谷|たに}', '{砂浜|すなはま}', '{桜|さくら}が{丘|おか}', '{言|い}い{伝|つた}え'],
          dong: ['Hôm nay: **～ことから** (từ việc… → suy ra / mà có tên) · **～のことだから** (biết tính N nên chắc…)'],
          ro: ['~ koto kara · ~ no koto da kara'],
          ghi: 'Buổi 2 gắn với tình huống ②: đi bộ tìm nguồn gốc tên phố. ことから là mẫu của bảng giới thiệu ở chùa, phố cổ, bảo tàng — đọc là gặp. Kèm theo: ことだから — trông giống nhưng nghĩa khác.',
        },
        {
          tieuDe: 'ふくしゅう — {先週|せんしゅう}の{失敗|しっぱい}は？',
          anh: ['alarm-clock', 'person-bowing'],
          nhan: ['ばかりに', 'ものですから'],
          dong: ['～ばかりに、～てしまいました。', 'すみません、～ものですから。'],
          ro: ['~ bakari ni, ~ te shimaimashita.', 'Sumimasen, ~ mono desu kara.'],
          hoi: '「ばかりに」を{使|つか}って、{最近|さいきん}の{失敗|しっぱい}を{話|はな}してください。',
          dap: '（{例|れい}）{地図|ちず}を{見|み}なかったばかりに、{道|みち}に{迷|まよ}ってしまいました。',
          ghi: 'Kiểm tra miệng 3 bạn. Nhắc lại: ばかりに — Nである; ものだから — ナA/N + な; vế sau không mệnh lệnh.',
        },
        {
          tieuDe: '{新|あたら}しいことば ③ — {町|まち}の{地形|ちけい}',
          anh: ['sunrise-over-mountains', 'beach-with-umbrella', 'passenger-ship', 'map-of-japan'],
          nhan: ['{谷|たに}・{丘|おか}', '{海岸|かいがん}・{砂浜|すなはま}', '{湾|わん}', '{地名|ちめい}'],
          dong: ['{坂|さか}（{上|のぼ}り{坂|ざか}・{下|くだ}り{坂|ざか}）・{谷|たに}・{丘|おか}', '{海岸|かいがん}・{砂浜|すなはま}・{湾|わん}（{東京湾|とうきょうわん}）', '{地名|ちめい}・{名称|めいしょう}・{愛称|あいしょう}'],
          ro: ['Saka (noborizaka · kudarizaka) · tani · oka', 'Kaigan · sunahama · wan (Toukyou-wan)', 'Chimei · meishou · aishou'],
          hoi: '「{丘|おか}」と「{山|やま}」はどう{違|ちが}いますか。',
          dap: '{丘|おか}は{山|やま}より{低|ひく}くて、なだらかな{所|ところ}です。',
          ghi: 'Vẽ một bản đồ khu phố tưởng tượng: dốc, thung lũng, đồi, bờ biển, bãi cát, vịnh. Học sinh đọc nhãn. Nhắc: 渋谷 đọc しぶや; 坂 sau từ khác thành ざか.',
        },
        {
          tieuDe: '{新|あたら}しいことば ④ — {名前|なまえ}と{歴史|れきし}',
          anh: ['scroll', 'japanese-castle', 'bento-box', 'cherry-blossom'],
          nhan: ['{言|い}い{伝|つた}え', '{遺跡|いせき}', '{郷土料理|きょうどりょうり}', '{名付|なづ}ける'],
          dong: ['～という{言|い}い{伝|つた}えがある', '{古|ふる}い{遺跡|いせき}が{見|み}つかる・{世界遺産|せかいいさん}', '{郷土料理|きょうどりょうり}を{味|あじ}わう · AをBと{名付|なづ}ける'],
          ro: ['~ to iu iitsutae ga aru', 'Furui iseki ga mitsukaru · sekai isan', 'Kyoudo ryouri o ajiwau · A o B to nazukeru'],
          hoi: 'あなたの{国|くに}の{郷土料理|きょうどりょうり}を{一|ひと}つ{紹介|しょうかい}してください。',
          dap: '（{例|れい}）{私|わたし}の{町|まち}の{郷土料理|きょうどりょうり}は「ブンチャー」です。{焼|や}いた{肉|にく}と{麺|めん}を{一緒|いっしょ}に{食|た}べます。',
          ghi: 'Hình 遺跡 dùng tạm ảnh lâu đài — giải thích bằng lời: di tích khảo cổ. 名付ける thường ở thể bị động khi giải thích tên: ～と名付けられた.',
        },
        {
          tieuDe: '② ～ことから — {形|かたち}',
          anh: ['link'],
          nhan: ['{事実|じじつ} → {判断|はんだん}・{名前|なまえ}'],
          dong: ['{普通形|ふつうけい} ＋ ことから、～', 'ナA：{有名|ゆうめい}な／であることから', 'N：{港町|みなとまち}であることから（✕{港町|みなとまち}ことから）'],
          ro: ['Futsuukei + koto kara, ~', 'na-A: yuumei na / de aru koto kara', 'N: minatomachi de aru koto kara'],
          bang: { head: ['Cách dùng', 'Vế sau'], rows: [['(1) căn cứ', '～と{考|かんが}えられる・{分|わ}かる'], ['(2) tên gọi', '～と{呼|よ}ばれる・{名付|なづ}けられた'], ['(3) khởi đầu', '～になった・{増|ふ}えた']] },
          ghi: 'ことから là văn viết, giọng khách quan. Nối giống "thể thường + こと": ナA な / である, N である. Ba cách dùng — vẽ ba mũi tên từ "sự thật" sang "phán đoán / tên / kết quả".',
        },
        {
          tieuDe: '② (1) {根拠|こんきょ} — 「～ことから、～と{分|わ}かる」',
          anh: ['detective', 'footprints'],
          nhan: ['{推測|すいそく}', '{足跡|あしあと}'],
          dong: ['{足跡|あしあと}が{小|ちい}さいことから、{子|こ}どもだと{考|かんが}えられる。', '{道|みち}がぬれていることから、{夜中|よなか}に{雨|あめ}が{降|ふ}ったと{分|わ}かる。'],
          ro: ['Ashiato ga chiisai koto kara, kodomo da to kangaerareru.', 'Michi ga nurete iru koto kara, yonaka ni ame ga futta to wakaru.'],
          hoi: '{部屋|へや}の{電気|でんき}がついています。{何|なに}が{分|わ}かりますか。「ことから」を{使|つか}ってください。',
          dap: '{電気|でんき}がついていることから、まだ{誰|だれ}か{起|お}きていると{分|わ}かります。',
          ghi: 'Đóng vai thám tử: giáo viên đưa "dấu hiệu" (cửa sổ vỡ, giày ướt, cốc cà phê còn ấm), học sinh suy luận bằng ～ことから、～と考えられる.',
        },
        {
          tieuDe: '② (2) {名前|なまえ}の{由来|ゆらい} — 「～ことから、～と{呼|よ}ばれる」',
          anh: ['cherry-blossom', 'sparkles'],
          nhan: ['{桜|さくら}が{丘|おか}', 'スターフルーツ'],
          dong: ['{丘|おか}に{桜|さくら}が{多|おお}かったことから、「{桜|さくら}が{丘|おか}」と{名付|なづ}けられた。', '{実|み}の{形|かたち}が{星|ほし}に{見|み}えることから、「スターフルーツ」と{呼|よ}ばれる。'],
          ro: ['Oka ni sakura ga ookatta koto kara, "Sakuragaoka" to nazukerareta.', 'Mi no katachi ga hoshi ni mieru koto kara, "sutaa furuutsu" to yobareru.'],
          hoi: '「{浜見坂|はまみざか}」という{名前|なまえ}は、どうして{付|つ}いたと{思|おも}いますか。',
          dap: '{坂|さか}の{上|うえ}から{浜|はま}が{見|み}えたことから、{付|つ}いたと{思|おも}います。',
          ghi: 'Đây là cách dùng gặp nhiều nhất trong bài đọc. Khuôn: [đặc điểm] ことから、「[tên]」と呼ばれている／名付けられた／という名がついた.',
        },
        {
          tieuDe: '② (3) {始|はじ}まり — 「～ことから、～になった」',
          anh: ['school', 'busts-in-silhouette'],
          nhan: ['{大学|だいがく}ができた', '{若者|わかもの}が{増|ふ}えた'],
          dong: ['{駅前|えきまえ}に{大学|だいがく}ができたことから、{町|まち}に{若者|わかもの}が{増|ふ}えた。', '{小|ちい}さな{誤解|ごかい}があったことから、{関係|かんけい}が{悪|わる}くなった。'],
          ro: ['Ekimae ni daigaku ga dekita koto kara, machi ni wakamono ga fueta.', 'Chiisana gokai ga atta koto kara, kankei ga waruku natta.'],
          hoi: 'あなたの{町|まち}は、{何|なに}がきっかけで{変|か}わりましたか。',
          dap: '（{例|れい}）{新|あたら}しい{駅|えき}ができたことから、{店|みせ}がたくさん{増|ふ}えました。',
          ghi: 'Cách (3) gần với ～がきっかけで (Bài 41) — ことから nhấn "xuất phát điểm" của chuỗi sự việc. Văn tin tức hay dùng.',
        },
        {
          tieuDe: '② ～ことから — ✕ {使|つか}えない{文|ぶん}',
          anh: ['cross-mark', 'check-mark-button'],
          nhan: ['✕', '○'],
          dong: ['✕ {雨|あめ}が{降|ふ}っていることから、{傘|かさ}を{持|も}っていこう。', '○ {雨|あめ}が{降|ふ}っているから、{傘|かさ}を{持|も}っていこう。', '✕ {港町|みなとまち}ことから → ○ {港町|みなとまち}であることから'],
          ro: ['✕ Ame ga futte iru koto kara, kasa o motte ikou.', '○ Ame ga futte iru kara, kasa o motte ikou.', '✕ Minatomachi koto kara → ○ Minatomachi de aru koto kara'],
          hoi: '「{電気|でんき}がついてることから、まだ{起|お}きてるよ」は{自然|しぜん}ですか。',
          dap: 'あまり{自然|しぜん}ではありません。{友達|ともだち}との{会話|かいわ}なら「ついてるから」のほうが{自然|しぜん}です。',
          ghi: 'Hai lỗi: vế sau ý chí / rủ rê; danh từ thiếu である. Thêm: ことから nghe như đọc báo trong hội thoại thân mật.',
        },
        {
          tieuDe: '⑥ ことから？ ことだから？',
          dong: ['{普通形|ふつうけい}＋ことから：dấu hiệu, sự thật (khách quan, viết)', 'Nの＋ことだから：tính cách quen thuộc (chủ quan, nói)'],
          ro: ['futsuukei + koto kara', 'N no + koto da kara'],
          bang: { head: ['', 'Ví dụ'], rows: [['ことから', '{電気|でんき}がついていることから、{起|お}きていると{分|わ}かる。'], ['ことだから', '{夜型|よるがた}の{彼|かれ}のことだから、まだ{起|お}きているだろう。']] },
          hoi: '「のんびり{屋|や}の{兄|あに}の（　）、また{遅|おく}れるだろう」— ことから？ ことだから？',
          dap: '「ことだから」です。{前|まえ}が「{兄|あに}の」で、{兄|あに}の{性格|せいかく}から{推測|すいそく}しているからです。',
          ghi: 'Mẹo: trước chỗ trống là "Nの" → ことだから; là mệnh đề thể thường → ことから. ことだから dùng được cho tổ chức, cửa hàng quen: あの店のことだから.',
        },
        {
          tieuDe: '⑥ ～のことだから — {練習|れんしゅう}',
          anh: ['woman-office-worker', 'man-office-worker'],
          nhan: ['{責任感|せきにんかん}の{強|つよ}い{鈴木|すずき}さん', '{几帳面|きちょうめん}な{森課長|もりかちょう}'],
          dong: ['{責任感|せきにんかん}の{強|つよ}い{鈴木|すずき}さんのことだから、{一人|ひとり}で{全部|ぜんぶ}やろうとしているに{違|ちが}いない。', '{几帳面|きちょうめん}な{森課長|もりかちょう}のことだから、もう{準備|じゅんび}は{終|お}わっているだろう。'],
          ro: ['Sekininkan no tsuyoi Suzuki-san no koto da kara, hitori de zenbu yarou to shite iru ni chigainai.', 'Kichoumen na Mori kachou no koto da kara, mou junbi wa owatte iru darou.'],
          hoi: 'クラスの{友達|ともだち}を{一人|ひとり}{選|えら}んで、「～のことだから」で{話|はな}してください。',
          dap: '（{例|れい}）{料理|りょうり}が{好|す}きなリンさんのことだから、パーティーにはきっと{何|なに}か{作|つく}ってくるでしょう。',
          ghi: 'Vế sau của ことだから: phán đoán chắc chắn (きっと～だろう・～に違いない・～はずだ). Nói về bạn trong lớp — vui và nhớ lâu.',
        },
        {
          tieuDe: '{会話|かいわ} ② — 「{砂浜|すなはま}が{見|み}えたことから」',
          anh: ['old-man', 'woman-student', 'man-student'],
          nhan: ['{大野|おおの}さん', 'マリヤム', 'ダニエル'],
          dong: ['{大野|おおの}：{砂浜|すなはま}がよく{見|み}えたことから、そう{呼|よ}ばれるようになりました。', 'ダニエル：{桜|さくら}の{木|き}が{多|おお}いことから{名付|なづ}けられたんですか。', 'マリヤム：ダニエルのことだから、また{百枚|ひゃくまい}ぐらい{撮|と}るでしょうね。'],
          ro: ['Oono: Sunahama ga yoku mieta koto kara, sou yobareru you ni narimashita.', 'Danieru: Sakura no ki ga ooi koto kara nazukerareta n desu ka.', 'Mariyamu: Danieru no koto da kara, mata hyakumai gurai toru deshou ne.'],
          hoi: '{道|みち}しるべに「{足元|あしもと}に{気|き}をつけよ」と{刻|きざ}まれたのは、なぜですか。',
          dap: '{坂|さか}が{急|きゅう}で、{雨|あめ}の{日|ひ}に{転|ころ}ぶ{人|ひと}が{多|おお}かったからです。',
          ghi: 'Nghe hội thoại ② hai lần. Đếm số lần ことから xuất hiện (3 lần) và chỉ ra ことだから (1 lần). Ông 大野 dùng thêm だけに, たいばかりに; ダニエル dùng だけあって, だけの価値, もんだから — để buổi 3.',
        },
        {
          tieuDe: 'チャレンジ — {国|くに}の{地名|ちめい}を{紹介|しょうかい}しよう',
          anh: ['map-of-japan', 'speech-balloon'],
          nhan: ['{地名|ちめい}', 'スピーチ'],
          dong: ['～という{所|ところ}があります。', '～ことから、「～」と{呼|よ}ばれています。', '～という{言|い}い{伝|つた}えもあります。'],
          ro: ['~ to iu tokoro ga arimasu.', '~ koto kara, "~" to yobarete imasu.', '~ to iu iitsutae mo arimasu.'],
          ghi: 'Gợi ý cho người Việt: Hạ Long (rồng đáp xuống — 言い伝え) · Bến Thành · Hồ Gươm (truyền thuyết trả gươm) · bánh xèo (tiếng xèo khi đổ bột) · chè "bà ba". Mỗi bạn nói 3 câu, bạn cặp đặt một câu hỏi.',
        },
        {
          tieuDe: 'まとめ — {今日|きょう}のポイント',
          nhan: ['ポイント'],
          dong: ['～ことから：căn cứ · tên gọi · khởi đầu — văn viết · Nである', 'Nのことだから：biết tính N → きっと～だろう', 'ことから không đi với ý chí, rủ rê, mệnh lệnh'],
          ro: ['~ koto kara · N de aru', 'N no koto da kara → kitto ~ darou', 'koto kara + ✕ ishi · sasoi · meirei'],
          ghi: 'Bài về nhà: tìm nguồn gốc tên 3 địa danh / món ăn (Việt Nam hoặc Nhật) và viết mỗi cái một câu ～ことから～と呼ばれている; viết 2 câu ～のことだから về người trong gia đình.',
        },
      ],
    },
    {
      t: 'p',
      text: 'Giáo viên chiếu ảnh một tấm biển ở phố cổ Nhật: 「この{坂|さか}は、{昔|むかし}、{油|あぶら}を{売|う}る{店|みせ}が{並|なら}んでいたことから、{油坂|あぶらざか}と{呼|よ}ばれるようになった」. Hỏi: "Tên dốc từ đâu ra?" — "Từ việc có nhiều tiệm bán dầu." "Đúng. Câu này có ba chữ quan trọng nhất: **ことから**. Hôm nay đọc biển nào ở Nhật các em cũng sẽ thấy nó."',
    },
    {
      t: 'mcq',
      id: 'b48-b2-khoi-dong',
      title: 'Khởi động — ôn buổi 1 + mẫu đã học (4 câu)',
      items: DOI([
        { q: '{確認|かくにん}を{一|ひと}つ{忘|わす}れた（　）、{大|おお}きな{問題|もんだい}になってしまった。', options: ['ばかりに', 'おかげで', 'くせに', 'うちに'], correct: 0, why: 'Ôn buổi 1: nguyên nhân nhỏ + hậu quả xấu → **ばかりに**.' },
        { q: 'すみません、バスが{遅|おく}れた（　）。', options: ['ものですから', 'ものの', 'ことに', 'わけに'], correct: 0, why: 'Ôn buổi 1: xin lỗi + lý do → **ものですから**.' },
        { q: 'この{寺|てら}の{名前|なまえ}は、{昔|むかし}の{言葉|ことば}に（　）している。（nguồn gốc — Bài 36）', options: ['{由来|ゆらい}', '{影響|えいきょう}', '{関係|かんけい}', '{原因|げんいん}'], correct: 0, why: '**～に{由来|ゆらい}する** = có nguồn gốc từ… (Bài 36). Hôm nay học thêm ～ことから để giải thích nguồn gốc.' },
        { q: '{電気|でんき}がついている（　）、{誰|だれ}かいるはずだ。（Bài 31）', options: ['から', 'ので、', 'のに', 'ても'], correct: 0, why: '**から** + はずだ (Bài 31). Văn viết khách quan sẽ nói **ことから** — học hôm nay.' },
      ]),
    },
    { t: 'h', text: 'Slide 3–4 — Từ mới: địa danh & nguồn gốc' },
    {
      t: 'p',
      text: 'Giáo viên vẽ một **bản đồ khu phố**: con **{坂|さか}** dài từ ga lên **{丘|おか}**, một **{谷|たに}** giữa hai ngọn đồi, phía dưới là **{海岸|かいがん}** với **{砂浜|すなはま}** và **{湾|わん}**. Ở góc vẽ một hòn đá có chữ (**{言|い}い{伝|つた}え**), một khu **{遺跡|いせき}**, một quán **{郷土料理|きょうどりょうり}**. Học sinh lên bảng đặt **{名称|めいしょう}** cho từng nơi và giải thích bằng ～ことから.',
    },
    {
      t: 'examples',
      items: [
        E('{丘|おか}の{上|うえ}から、{町|まち}{全体|ぜんたい}が{見渡|みわた}せる。', 'Oka no ue kara, machi zentai ga miwataseru.', 'Từ trên đồi nhìn bao quát cả thị trấn.'),
        E('{夏|なつ}の{海岸|かいがん}は、{海水浴|かいすいよく}の{客|きゃく}でいっぱいだ。', 'Natsu no kaigan wa, kaisuiyoku no kyaku de ippai da.', 'Bờ biển mùa hè chật kín người tắm biển.'),
        E('この{池|いけ}には、{龍|りゅう}が{住|す}んでいたという{言|い}い{伝|つた}えがある。', 'Kono ike ni wa, ryuu ga sunde ita to iu iitsutae ga aru.', 'Có truyền thuyết kể rằng ao này từng có rồng sống.'),
        E('{生|う}まれた{子犬|こいぬ}を「ハナ」と{名付|なづ}けた。', 'Umareta koinu o "Hana" to nazuketa.', 'Đặt tên cho chú chó con mới sinh là "Hana".'),
      ],
    },
    { t: 'h', text: 'Slide 5–11 — ことから・ことだから: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b48-b2-noi-tu',
      title: 'Luyện nhanh — điền mẫu (8 câu)',
      kind: 'fill',
      items: [
        { q: '{足跡|あしあと}が{大|おお}きい（　　　　）、{犯人|はんにん}は{男|おとこ}だと{考|かんが}えられる。（4 chữ kana）', answers: ['ことから'], hint: 'căn cứ → ことから' },
        { q: '{形|かたち}がひょうたんに{似|に}ている（　　　　）、「ひょうたん{池|いけ}」と{呼|よ}ばれる。', answers: ['ことから'], hint: 'tên gọi → ことから' },
        { q: '{港町|みなとまち}（　　　）ことから、{魚料理|さかなりょうり}が{有名|ゆうめい}だ。（3 chữ kana）', answers: ['である', 'だった'], hint: 'Nである＋ことから' },
        { q: '{有名|ゆうめい}（　）ことから、{観光客|かんこうきゃく}が{多|おお}い。（1 chữ）', answers: ['な'], hint: 'ナA な＋ことから' },
        { q: '{真面目|まじめ}な{田中|たなか}さんの（　　　　　）、きっと{時間|じかん}どおりに{来|く}るだろう。（5 chữ kana）', answers: ['ことだから'], hint: 'Nのことだから' },
        { q: 'あの{人気店|にんきてん}の（　　　　　）、{週末|しゅうまつ}は{行列|ぎょうれつ}ができているに{違|ちが}いない。', answers: ['ことだから'], hint: 'tổ chức / cửa hàng quen → ことだから' },
        { q: '{駅前|えきまえ}に{大学|だいがく}ができた（　　　　）、{町|まち}に{若者|わかもの}が{増|ふ}えた。', answers: ['ことから'], hint: 'khởi đầu → ことから' },
        { q: '{雨|あめ}が{降|ふ}っている（　　）、{傘|かさ}を{持|も}っていこう。（vế sau rủ rê → KHÔNG ことから; 2 chữ kana）', answers: ['から', 'ので'], hint: 'から／ので' },
      ],
    },
    {
      t: 'quiz',
      id: 'b48-b2-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '普通形＋ことから · Nのことだから',
      items: [
        { q: 'Vì từ đỉnh dốc nhìn thấy biển nên được gọi là "dốc Hamami".', answers: V('{坂|さか}の{上|うえ}から{海|うみ}が{見|み}えたことから、「{浜見坂|はまみざか}」と{呼|よ}ばれるようになった。', '{坂|さか}の{上|うえ}から{海|うみ}が{見|み}えたことから、「{浜見坂|はまみざか}」と{呼|よ}ばれた。', '{坂|さか}の{上|うえ}から{海|うみ}が{見|み}えたことから、「{浜見坂|はまみざか}」と{呼|よ}ばれている。'), hint: 'さかの うえから うみが みえた ことから、「はまみざか」と よばれる ように なった' },
        { q: 'Vì trên đồi có nhiều cây anh đào nên được đặt tên là "Sakuragaoka".', answers: V('{丘|おか}に{桜|さくら}の{木|き}が{多|おお}かったことから、「{桜|さくら}が{丘|おか}」と{名付|なづ}けられた。', '{丘|おか}に{桜|さくら}が{多|おお}かったことから、「{桜|さくら}が{丘|おか}」と{名付|なづ}けられた。', '{丘|おか}に{桜|さくら}の{木|き}が{多|おお}いことから、「{桜|さくら}が{丘|おか}」と{名付|なづ}けられた。'), hint: 'おかに さくらの きが おおかった ことから、「さくらがおか」と なづけられた' },
        { q: 'Từ việc đèn phòng còn sáng, biết là vẫn còn thức.', answers: V('{部屋|へや}の{電気|でんき}がついていることから、まだ{起|お}きていると{分|わ}かる。', '{部屋|へや}の{電気|でんき}がついていることから、まだ{起|お}きていると{分|わ}かります。', '{部屋|へや}の{電気|でんき}がついていることから、まだ{起|お}きているようだ。'), hint: 'へやの でんきが ついている ことから、まだ おきていると わかる' },
        { q: 'Vì khu này xưa là làng chài nên giờ vẫn nhiều quán đồ cá.', answers: V('この{辺|あた}りは{昔|むかし}{漁師|りょうし}の{町|まち}だったことから、{今|いま}も{魚料理|さかなりょうり}の{店|みせ}が{多|おお}い。', 'この{辺|あた}りは{昔|むかし}{漁師|りょうし}の{町|まち}であったことから、{今|いま}も{魚料理|さかなりょうり}の{店|みせ}が{多|おお}い。', 'この{辺|あた}りは{昔|むかし}{漁師|りょうし}の{町|まち}だったことから、{今|いま}でも{魚料理|さかなりょうり}の{店|みせ}が{多|おお}い。'), hint: 'この あたりは むかし りょうしの まち だった ことから、いまも さかなりょうりの みせが おおい' },
        { q: 'Daniel thì kiểu gì cũng lại chụp cả trăm tấm.', answers: V('ダニエルのことだから、また{百枚|ひゃくまい}ぐらい{撮|と}るだろう。', 'ダニエルのことだから、また{百枚|ひゃくまい}ぐらい{撮|と}るでしょう。', 'ダニエルさんのことだから、また{百枚|ひゃくまい}ぐらい{撮|と}るだろう。'), hint: 'ダニエルの ことだから、また ひゃくまい ぐらい とるだろう' },
        { q: 'Mẹ tôi hay lo, chắc chắn sẽ gọi điện ngay.', answers: V('{心配性|しんぱいしょう}の{母|はは}のことだから、すぐに{電話|でんわ}してくるだろう。', '{心配性|しんぱいしょう}の{母|はは}のことだから、きっとすぐ{電話|でんわ}してくるだろう。', '{心配性|しんぱいしょう}の{母|はは}のことだから、すぐ{電話|でんわ}してくるに{違|ちが}いない。'), hint: 'しんぱいしょうの ははの ことだから、すぐに でんわして くるだろう' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**① ことから = từ SỰ THẬT** → phán đoán / tên gọi / kết quả. Văn viết, khách quan. Danh từ: **Nである**ことから; ナA: **な／である**.',
        '**② Nのことだから = từ TÍNH CÁCH quen thuộc** → phán đoán chắc chắn (きっと～だろう). Văn nói. Trước nó luôn là **Nの**.',
        '**③ Vế sau của ことから** không phải ý chí, rủ rê, mệnh lệnh. Với bạn bè thì dùng **から** cho tự nhiên.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: 'あなたの{国|くに}で、{名前|なまえ}の{由来|ゆらい}がおもしろい{場所|ばしょ}はありますか。「ことから」を{使|つか}って{説明|せつめい}してください。', ro: 'Anata no kuni de, namae no yurai ga omoshiroi basho wa arimasu ka. "Koto kara" o tsukatte setsumei shite kudasai.', vi: 'Ở nước em có nơi nào có nguồn gốc tên thú vị không? Hãy dùng "koto kara" để giải thích.' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイに「ホアンキエム{湖|こ}」があります。{昔|むかし}、{王|おう}がこの{湖|みずうみ}で{亀|かめ}に{剣|けん}を{返|かえ}したという{言|い}い{伝|つた}えがあることから、「{剣|けん}を{返|かえ}した{湖|みずうみ}」という{意味|いみ}の{名前|なまえ}が{付|つ}きました。', ro: 'Hanoi ni "Hoan Kiemu-ko" ga arimasu. Mukashi, ou ga kono mizuumi de kame ni ken o kaeshita to iu iitsutae ga aru koto kara, "ken o kaeshita mizuumi" to iu imi no namae ga tsukimashita.', vi: 'Ở Hà Nội có hồ Hoàn Kiếm. Vì có truyền thuyết kể rằng ngày xưa nhà vua đã trả gươm cho rùa ở hồ này nên hồ có cái tên mang nghĩa "hồ trả gươm".' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'おもしろいですね。では、「ことだから」を{使|つか}って、クラスの{友達|ともだち}について{一|ひと}つ{言|い}ってください。', ro: 'Omoshiroi desu ne. De wa, "koto da kara" o tsukatte, kurasu no tomodachi ni tsuite hitotsu itte kudasai.', vi: 'Thú vị nhỉ. Vậy hãy dùng "koto da kara" nói một câu về một bạn trong lớp.' },
        { who: 'Bạn', role: 'candidate', text: '{勉強熱心|べんきょうねっしん}なリンさんのことだから、{宿題|しゅくだい}はもう{全部|ぜんぶ}{終|お}わっているでしょう。', ro: 'Benkyou nesshin na Rin-san no koto da kara, shukudai wa mou zenbu owatte iru deshou.', vi: 'Lin vốn chăm học, chắc bài tập về nhà đã làm xong hết rồi.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'いいですね。「ことだから」の{後|うし}ろは「でしょう」「に{違|ちが}いない」のような{推量|すいりょう}の{言葉|ことば}が{自然|しぜん}です。', ro: 'Ii desu ne. "Koto da kara" no ushiro wa "deshou" "ni chigainai" no you na suiryou no kotoba ga shizen desu.', vi: 'Tốt lắm. Sau "koto da kara" thì những từ phỏng đoán như "deshou", "ni chigainai" là tự nhiên.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b48-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: DOI([
        { q: '{形|かたち}が{亀|かめ}に{似|に}ている（　）、この{島|しま}は「{亀島|かめじま}」と{呼|よ}ばれている。', options: ['ことから', 'ことだから', 'ものだから', 'ばかりに'], correct: 0, why: 'Nguồn gốc tên gọi → **ことから** (②).' },
        { q: '{時間|じかん}に{厳|きび}しい{部長|ぶちょう}の（　）、もう{来|き}ているはずだ。', options: ['ことだから', 'ことから', 'ばかりに', 'わりに'], correct: 0, why: 'Nの + tính cách + はずだ → **ことだから** (bảng ⑥).' },
        { q: '{城下町|じょうかまち}（　）ことから、{古|ふる}い{道|みち}が{残|のこ}っている。', options: ['である', 'の', 'な', 'に'], correct: 0, why: 'Danh từ + **である** + ことから.' },
        { q: '{窓|まど}が{割|わ}れていた（　）、{犯人|はんにん}は{外|そと}から{入|はい}ったと{見|み}られている。', options: ['ことから', 'ことだから', 'ものの', 'だけあって'], correct: 0, why: 'Dấu hiệu → phán đoán (と見られている) → **ことから** (②).' },
        { q: '「{雨|あめ}が{降|ふ}っていることから、{傘|かさ}を{持|も}っていこう」が{不自然|ふしぜん}なのはなぜですか。', options: ['{後|うし}ろが{誘|さそ}う{文|ぶん}（～よう）だから', '「{雨|あめ}」が{名詞|めいし}だから', 'ことからは{過去|かこ}の{話|はなし}にしか{使|つか}えないから', '「{傘|かさ}」の{前|まえ}に「を」があるから'], correct: 0, why: 'Vế sau của ことから không là ý chí / rủ rê (～よう) → dùng **から**.' },
      ]),
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b48-buoi-3-dakeni',
  kind: 'review',
  title: 'Buổi 3 — Từ mới đánh giá & đời thường · ～だけに · ～だけあって · ～だけの N · bảng ⑦ (họ だけ) · bảng ⑧ (họ もの) · hội thoại ③ · tổng ôn + trình bày 1 phút',
  goal: 'Theo nhịp một buổi trên lớp: kiểm tra miệng ～ことから・～のことだから, học từ nhóm D (đánh giá) và nhóm E (lý do & hậu quả đời thường), dùng ～だけに cho "chính vì… nên càng…" (cả khi thất vọng), ～だけあって để khen, ～だけの N cho "đáng / hết mức"; phân biệt だけに ↔ だけあって ↔ わりに và ものだから ↔ ものの ↔ ものだ; đọc hội thoại ③ (sau buổi báo cáo khoá luận) và trình bày 1 phút "Thất bại dạy tôi nhiều nhất".',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — gọi 3 bạn: một câu **～ことから、～と{呼|よ}ばれている** về một nơi ở quê, một câu **～のことだから** về người trong gia đình.',
        '**Từ mới (10′)** — nhóm D (đánh giá: {芸術|げいじゅつ}, {芸能人|げいのうじん}, {腕前|うでまえ}, {賢|かしこ}い, {穏|おだ}やか, {昇進|しょうしん}, {名門|めいもん}, {老舗|しにせ}, {本場|ほんば}, {期待外|きたいはず}れ, {張|は}り{切|き}る, {懸命|けんめい}に) + nhóm E (đời thường: {寝過|ねす}ごす, {乗|の}り{過|す}ごす, {遭|あ}う, {詰|つ}め{込|こ}む, {嘆|なげ}く, {愚痴|ぐち}, {二日酔|ふつかよ}い, {見栄|みえ}を{張|は}る, {調子|ちょうし}に{乗|の}る, {口|くち}を{滑|すべ}らせる, {自業自得|じごうじとく}, {早|はや}とちり, {運悪|うんわる}く, {取|と}り{返|かえ}しがつかない).',
        '**Ngữ pháp (20′)** — ③ **～だけに** (cảm xúc mạnh hơn thường; tốt hoặc xấu) · **～だけあって** (chỉ khen; さすが) · **～だけの N** (価値・結果・できるだけのこと) · bảng ⑦ (だけに・だけあって・わりに) · bảng ⑧ (ものだから・ものの・ものだ・もん).',
        '**Hội thoại (7′)** — ③ カルロス sau buổi báo cáo giữa kỳ, リン an ủi, cô 佐藤 nhận xét.',
        '**Tổng ôn + trình bày (8′)** — mỗi bạn nói 1 phút "{一番|いちばん}{多|おお}くを{学|まな}んだ{失敗|しっぱい}" dùng ít nhất ba mẫu của bài. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b48-b3-slides',
      title: 'Bài 48 原因と結果 — Buổi 3: だけに・だけあって・だけの',
      slides: [
        {
          tieuDe: '{第|だい}48{課|か} — だけに・だけあって',
          anh: ['trophy', 'disappointed-face', 'sushi', 'artist-palette'],
          nhan: ['だけあって', 'だけに', '{本場|ほんば}の{味|あじ}', '{芸術|げいじゅつ}'],
          dong: ['Hôm nay: **～だけに** (chính vì… nên càng) · **～だけあって** (đúng là… có khác) · **～だけの N**'],
          ro: ['~ dake ni · ~ dake atte · ~ dake no N'],
          ghi: 'Buổi 3 gắn với tình huống ③: sau buổi báo cáo khoá luận. Bài 43 (わりに) đã hẹn học họ だけ ở đây — hôm nay đặt わりに cạnh だけに, だけあって để so.',
        },
        {
          tieuDe: 'ふくしゅう — ことから？ ことだから？',
          anh: ['cherry-blossom', 'woman-office-worker'],
          nhan: ['ことから', 'ことだから'],
          dong: ['～ことから、「～」と{呼|よ}ばれています。', '～のことだから、きっと～でしょう。'],
          ro: ['~ koto kara, "~" to yobarete imasu.', '~ no koto da kara, kitto ~ deshou.'],
          hoi: 'あなたの{町|まち}の{名前|なまえ}の{由来|ゆらい}を{知|し}っていますか。',
          dap: '（{例|れい}）はい。{昔|むかし}、{大|おお}きな{市場|いちば}があったことから、その{名前|なまえ}が{付|つ}いたそうです。',
          ghi: 'Kiểm tra miệng 3 bạn. Nhắc mẹo: trước chỗ trống là "Nの" → ことだから; là mệnh đề → ことから.',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑤ — {評価|ひょうか}',
          anh: ['artist-palette', 'microphone', 'man-cook', 'owl'],
          nhan: ['{芸術|げいじゅつ}', '{芸能人|げいのうじん}', '{腕前|うでまえ}', '{賢|かしこ}い'],
          dong: ['{名門|めいもん}（{大学|だいがく}・{校|こう}）・{老舗|しにせ}（{店|みせ}）・{本場|ほんば}（{味|あじ}）', '{穏|おだ}やかな{性格|せいかく}・{課長|かちょう}に{昇進|しょうしん}する', '{期待外|きたいはず}れ・{張|は}り{切|き}る・{懸命|けんめい}に'],
          ro: ['Meimon (daigaku · kou) · shinise (mise) · honba (aji)', 'Odayaka na seikaku · kachou ni shoushin suru', 'Kitai hazure · harikiru · kenmei ni'],
          hoi: '「{老舗|しにせ}」「{名門|めいもん}」「{本場|ほんば}」は、それぞれ{何|なに}に{使|つか}いますか。',
          dap: '{老舗|しにせ}は{古|ふる}いお{店|みせ}、{名門|めいもん}は{有名|ゆうめい}な{学校|がっこう}やチーム、{本場|ほんば}は{料理|りょうり}などが{生|う}まれた{場所|ばしょ}に{使|つか}います。',
          ghi: 'Nhóm D học CẶP với だけあって: 老舗だけあって・名門校だけあって・本場で学んだだけあって・芸能人だけあって. Nhắc: 老舗 đọc しにせ (đặc biệt); 懸命 ≠ 賢明 (cùng âm けんめい).',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑥ — ついてない{日|ひ}',
          anh: ['alarm-clock', 'train', 'umbrella-with-rain-drops', 'woozy-face'],
          nhan: ['{寝過|ねす}ごす', '{乗|の}り{過|す}ごす', '{夕立|ゆうだち}に{遭|あ}う', '{二日酔|ふつかよ}い'],
          dong: ['{見栄|みえ}を{張|は}る・{調子|ちょうし}に{乗|の}る・{口|くち}を{滑|すべ}らせる', '{早|はや}とちり・{運悪|うんわる}く・{自業自得|じごうじとく}', '{詰|つ}め{込|こ}む・{嘆|なげ}く・{愚痴|ぐち}を{言|い}う・{取|と}り{返|かえ}しがつかない'],
          ro: ['Mie o haru · choushi ni noru · kuchi o suberaseru', 'Hayatochiri · un\'waruku · jigou jitoku', 'Tsumekomu · nageku · guchi o iu · torikaeshi ga tsukanai'],
          hoi: '{最近|さいきん}、ついてない{日|ひ}はありましたか。{今日|きょう}のことばを{使|つか}って{話|はな}してください。',
          dap: '（{例|れい}）{電車|でんしゃ}で{寝|ね}てしまって{駅|えき}を{乗|の}り{過|す}ごしたうえに、{運悪|うんわる}く{夕立|ゆうだち}に{遭|あ}いました。',
          ghi: 'Nhóm E đi cùng ばかりに・もんだから của buổi 1: 調子に乗ったばかりに… / 寝過ごしたもんだから…. Nhắc 遭う (chuyện xấu) ≠ 会う (gặp người).',
        },
        {
          tieuDe: '③ ～だけに — {形|かたち}',
          anh: ['link'],
          nhan: ['{条件|じょうけん} → もっと～'],
          dong: ['{普通形|ふつうけい} ＋ だけに、（cảm xúc / kết quả mạnh hơn）', 'N：プロだけに・{取引先|とりひきさき}であるだけに', 'ナA：{有名|ゆうめい}なだけに'],
          ro: ['Futsuukei + dake ni, ~', 'N: puro dake ni · torihikisaki de aru dake ni', 'na-A: yuumei na dake ni'],
          bang: { head: ['Vế trước', 'Vế sau'], rows: [['{期待|きたい}していた', 'がっかりした（xấu）'], ['{一生懸命|いっしょうけんめい}{練習|れんしゅう}した', '{合格|ごうかく}して{泣|な}いた（tốt）'], ['{大切|たいせつ}な{取引先|とりひきさき}', 'きちんと{説明|せつめい}しないと']] },
          ghi: 'だけに: điều kiện đặc biệt ở vế trước khiến vế sau MẠNH hơn bình thường. Danh từ nối thẳng được (khác ばかりに và ことから cần である).',
        },
        {
          tieuDe: '③ ～だけに — {気持|きも}ちが{強|つよ}くなる',
          anh: ['disappointed-face', 'loudly-crying-face'],
          nhan: ['がっかり', '{嬉|うれ}し{泣|な}き'],
          dong: ['{楽|たの}しみにしていただけに、{中止|ちゅうし}は{残念|ざんねん}だ。', '{三年|さんねん}も{頑張|がんば}っただけに、{合格|ごうかく}した{時|とき}は{泣|な}いてしまった。'],
          ro: ['Tanoshimi ni shite ita dake ni, chuushi wa zannen da.', 'Sannen mo ganbatta dake ni, goukaku shita toki wa naite shimatta.'],
          hoi: '{期待|きたい}していたのに、がっかりしたことはありますか。「だけに」を{使|つか}ってください。',
          dap: '（{例|れい}）{評判|ひょうばん}の{映画|えいが}だっただけに、{期待外|きたいはず}れでがっかりしました。',
          ghi: 'Cách dùng hay gặp nhất trong đề: だけに + cảm xúc (残念・悔しい・ショック・うれしい). Cho học sinh nói về một kỳ vọng thật của mình.',
        },
        {
          tieuDe: '③ ～だけあって — 「さすが～だけあって」',
          anh: ['sushi', 'trophy'],
          nhan: ['{老舗|しにせ}', 'プロ'],
          dong: ['さすが{老舗|しにせ}だけあって、{味|あじ}が{違|ちが}う。', '{十年|じゅうねん}{住|す}んでいるだけあって、{敬語|けいご}が{自然|しぜん}だ。', '✕ {高|たか}いだけあって、すぐ{壊|こわ}れた。'],
          ro: ['Sasuga shinise dake atte, aji ga chigau.', 'Juunen sunde iru dake atte, keigo ga shizen da.', '✕ Takai dake atte, sugu kowareta.'],
          hoi: 'クラスの{友達|ともだち}や{先生|せんせい}を「だけあって」でほめてください。',
          dap: '（{例|れい}）さすが{日本|にほん}に{三年|さんねん}{住|す}んでいたマルコさんだけあって、{聞|き}き{取|と}りが{上手|じょうず}ですね。',
          ghi: 'だけあって CHỈ để khen — kết quả tốt đúng như điều kiện cho phép. Hay đi với さすが. Kết quả xấu → だけに (thất vọng) hoặc わりに (trái mong đợi).',
        },
        {
          tieuDe: '③ ～だけの N — 「それに{合|あ}う」',
          anh: ['books', 'check-mark-button'],
          nhan: ['{読|よ}むだけの{価値|かち}', 'できるだけのこと'],
          dong: ['この{本|ほん}は{読|よ}むだけの{価値|かち}がある。', '{努力|どりょく}しただけの{結果|けっか}が{出|で}た。', '{結果|けっか}は{残念|ざんねん}だったが、できるだけのことはした。'],
          ro: ['Kono hon wa yomu dake no kachi ga aru.', 'Doryoku shita dake no kekka ga deta.', 'Kekka wa zannen datta ga, dekiru dake no koto wa shita.'],
          hoi: '「{行|い}くだけの{価値|かち}がある{場所|ばしょ}」を{一|ひと}つ{教|おし}えてください。',
          dap: '（{例|れい}）ハロン{湾|わん}は、{遠|とお}くても{行|い}くだけの{価値|かち}があります。',
          ghi: 'だけの N: (a) tương xứng — 価値・結果・力 · (b) hết mức — できるだけの・あるだけの. Cuối câu: ～だけのことはある = quả không hổ danh (この景色、三時間かけて来ただけのことはある).',
        },
        {
          tieuDe: '⑦ だけに？ だけあって？ わりに？',
          dong: ['{高|たか}いだけあって、おいしい。（khen）', '{高|たか}かっただけに、まずくてがっかりした。（thất vọng mạnh）', '{高|たか}いわりに、おいしくない。（trái mong đợi — Bài 43）'],
          ro: ['Takai dake atte, oishii.', 'Takakatta dake ni, mazukute gakkari shita.', 'Takai wari ni, oishiku nai.'],
          bang: { head: ['Mẫu', 'Kết quả'], rows: [['だけあって', 'TỐT, đúng mong đợi'], ['だけに', 'tốt / xấu — mạnh hơn thường'], ['わりに', 'TRÁI mong đợi']] },
          hoi: '「{一流|いちりゅう}ホテル（　）、サービスがいい」— だけあって？ わりに？',
          dap: '「だけあって」です。{一流|いちりゅう}ホテルだから、サービスがいいのは{期待|きたい}どおりだからです。',
          ghi: 'Cùng một điều kiện "đắt tiền" cho ba kết quả. Mẹo: vế sau khen → だけあって (hoặc だけに); thất vọng → だけに; lệch mong đợi → わりに.',
        },
        {
          tieuDe: '⑧ 「もの」の{仲間|なかま}',
          dong: ['ものだから：tại vì… (bào chữa)', 'ものの：tuy… nhưng (Bài 28)', 'ものだ：lẽ thường / hồi tưởng (Bài 32)', 'もん：vì… mà (nũng nịu, cuối câu)'],
          ro: ['mono da kara', 'mono no', 'mono da', 'mon'],
          bang: { head: ['Câu', 'Nghĩa'], rows: [['{寝坊|ねぼう}したものだから、{遅|おく}れた。', 'tại ngủ quên nên muộn'], ['{免許|めんきょ}は{取|と}ったものの、{運転|うんてん}していない。', 'tuy có bằng nhưng không lái'], ['{子|こ}どもの{頃|ころ}、よく{遊|あそ}んだものだ。', 'hồi nhỏ hay chơi lắm'], ['だって、{眠|ねむ}かったんだもん。', 'tại buồn ngủ mà']] },
          hoi: '「{買|か}ったものの」と「{買|か}ったものだから」はどう{違|ちが}いますか。',
          dap: '「ものの」は「{買|か}ったけれど」、「ものだから」は「{買|か}ったから」という{意味|いみ}です。',
          ghi: 'Mẹo: có から → lý do; có の cuối → "tuy nhưng"; だ cuối câu → lẽ thường / hồi tưởng; もん một mình → nũng nịu.',
        },
        {
          tieuDe: '{会話|かいわ} ③ — 「{一生懸命|いっしょうけんめい}やっていただけに、{悔|くや}しいよね」',
          anh: ['woman-student', 'man-student', 'woman-teacher'],
          nhan: ['リン', 'カルロス', '{佐藤先生|さとうせんせい}'],
          dong: ['カルロス：いいところを{見|み}せたいばかりに、データを{詰|つ}め{込|こ}みすぎちゃった。', 'リン：{一生懸命|いっしょうけんめい}やっていただけに、{悔|くや}しいよね。', '{佐藤先生|さとうせんせい}：{期待|きたい}しているだけに、つい{厳|きび}しくなるのよ。'],
          ro: ['Karurosu: Ii tokoro o misetai bakari ni, deeta o tsumekomisugichatta.', 'Rin: Isshoukenmei yatte ita dake ni, kuyashii yo ne.', 'Satou sensei: Kitai shite iru dake ni, tsui kibishiku naru no yo.'],
          hoi: '{佐藤先生|さとうせんせい}は、カルロスさんの{発表|はっぴょう}の{何|なに}が{問題|もんだい}だと{言|い}いましたか。',
          dap: '{相関|そうかん}と{因果関係|いんがかんけい}を{混同|こんどう}していることです。',
          ghi: 'Nghe hội thoại ③ hai lần. Tìm 6 mẫu: たいばかりに, だけに (×2), もんだから, ことから, ことだから, おかげで. Nối với bài đọc 3 (tương quan ≠ nhân quả).',
        },
        {
          tieuDe: '{総復習|そうふくしゅう} — {四|よっ}つの{原因|げんいん}',
          anh: ['person-bowing', 'scroll', 'disappointed-face', 'bus'],
          nhan: ['ばかりに', 'ことから', 'だけに', 'ものだから'],
          dong: ['{一言|ひとこと}{言|い}ったばかりに、{怒|おこ}らせてしまった。（tiếc nuối）', '{砂浜|すなはま}が{見|み}えたことから、その{名|な}が{付|つ}いた。（nguồn gốc）', '{期待|きたい}していただけに、がっかりした。（mạnh hơn）', 'バスが{遅|おく}れたものですから。（bào chữa）'],
          ro: ['Hitokoto itta bakari ni, okorasete shimatta.', 'Sunahama ga mieta koto kara, sono na ga tsuita.', 'Kitai shite ita dake ni, gakkari shita.', 'Basu ga okureta mono desu kara.'],
          hoi: '{四|よっ}つの{中|なか}で、{書|か}き{言葉|ことば}（{新聞|しんぶん}・{報告書|ほうこくしょ}）に{一番|いちばん}よく{使|つか}うのはどれですか。',
          dap: '「ことから」です。{客観的|きゃっかんてき}な{言|い}い{方|かた}だからです。',
          ghi: 'Cho cả lớp đọc to bốn câu. Hỏi thêm: mẫu nào KHÔNG được dùng trong báo cáo sự cố? (ものだから — và cả ばかりに vì mang cảm xúc).',
        },
        {
          tieuDe: '1{分|ぷん}スピーチ — 「{一番|いちばん}{多|おお}くを{学|まな}んだ{失敗|しっぱい}」',
          anh: ['speech-balloon', 'stopwatch'],
          nhan: ['スピーチ', '1{分|ぷん}'],
          dong: ['① {今日|きょう}は、～について{話|はな}します。', '② ～ばかりに、～てしまいました。③ ～だけに、{本当|ほんとう}に～。', '④ ～ことから、～と{気|き}づきました。⑤ あの{失敗|しっぱい}があったからこそ、～。'],
          ro: ['① Kyou wa, ~ ni tsuite hanashimasu.', '② ~ bakari ni, ~ te shimaimashita. ③ ~ dake ni, hontou ni ~.', '④ ~ koto kara, ~ to kizukimashita. ⑤ Ano shippai ga atta kara koso, ~.'],
          ghi: 'Mỗi bạn 1 phút, bạn cặp bấm giờ và đếm số mẫu của bài được dùng (mục tiêu ≥ 3). Bài mẫu ở mục Luyện nói. Giáo viên chọn 2 bạn nói trước lớp.',
        },
        {
          tieuDe: 'まとめ — {今日|きょう}のポイント',
          nhan: ['ポイント'],
          dong: ['～だけに：chính vì… nên càng (tốt / xấu) · N nối thẳng', '～だけあって：đúng là… có khác (CHỈ khen) · さすが', '～だけの N：tương xứng / hết mức · ～だけのことはある'],
          ro: ['~ dake ni', '~ dake atte · sasuga', '~ dake no N · ~ dake no koto wa aru'],
          ghi: 'Bài về nhà: làm mục Bài tập + Luyện thêm 1–5; viết bài luận 400–600 chữ của mục Viết. Buổi sau: Bài 49 (～一方で, ～に伴って, ～かと思うと, ～や否や).',
        },
      ],
    },
    {
      t: 'p',
      text: 'Giáo viên đặt hai hộp bánh lên bàn: một hộp của **{老舗|しにせ}** hai trăm năm, một hộp mua ở cửa hàng tiện lợi. Cho cả lớp nếm. Hỏi: "Hộp lâu đời thế nào?" — "Ngon ạ." "Vậy nói bằng tiếng Nhật: **さすが{老舗|しにせ}だけあって、おいしい**." Rồi hỏi tiếp: "Nếu nó lại dở thì sao?" — Cả lớp cười. "Thì nói: **{老舗|しにせ}だっただけに、がっかりした** — hoặc **{老舗|しにせ}のわりに、おいしくない**. Hôm nay ta phân biệt ba cái đó."',
    },
    {
      t: 'mcq',
      id: 'b48-b3-khoi-dong',
      title: 'Khởi động — ôn buổi 2 + mẫu đã học (4 câu)',
      items: DOI([
        { q: '{形|かたち}が{星|ほし}に{見|み}える（　）、「スターフルーツ」と{呼|よ}ばれる。', options: ['ことから', 'ことだから', 'ものの', 'わりに'], correct: 0, why: 'Ôn buổi 2: nguồn gốc tên gọi → **ことから**.' },
        { q: 'のんびり{屋|や}の{弟|おとうと}の（　）、まだ{寝|ね}ているだろう。', options: ['ことだから', 'ことから', 'ばかりに', 'だけあって'], correct: 0, why: 'Ôn buổi 2: Nの + tính cách → **ことだから**.' },
        { q: 'この{店|みせ}は{安|やす}い（　）、おいしい。（Bài 43）', options: ['わりに', 'だけあって', 'ばかりに', 'ものだから'], correct: 0, why: 'Rẻ mà ngon — trái với mức mong đợi → **わりに** (Bài 43). Hôm nay so với だけあって.' },
        { q: '{子|こ}どもの{頃|ころ}は、よくこの{川|かわ}で{泳|およ}いだ（　）。（hồi tưởng — Bài 32）', options: ['ものだ', 'ものだから', 'ものの', 'もんだから'], correct: 0, why: '**Vた＋ものだ** = hồi tưởng (Bài 32) — họ もの, bảng ⑧.' },
      ]),
    },
    { t: 'h', text: 'Slide 3–4 — Từ mới: đánh giá & đời thường' },
    {
      t: 'p',
      text: 'Giáo viên chia bảng làm hai: bên trái **"đúng là… có khác"** — {老舗|しにせ}・{名門|めいもん}・{本場|ほんば}・{芸能人|げいのうじん}・{腕前|うでまえ}・{賢|かしこ}い・{穏|おだ}やか; bên phải **"ngày xui"** — {寝過|ねす}ごす・{乗|の}り{過|す}ごす・{遭|あ}う・{二日酔|ふつかよ}い・{調子|ちょうし}に{乗|の}る・{口|くち}を{滑|すべ}らせる・{早|はや}とちり. Học sinh ghép mỗi từ bên trái với **だけあって**, mỗi từ bên phải với **ばかりに** hoặc **もんだから**.',
    },
    {
      t: 'examples',
      items: [
        E('{創業|そうぎょう}{二百年|にひゃくねん}の{老舗|しにせ}だけあって、{味|あじ}が{違|ちが}う。', 'Sougyou nihyakunen no shinise dake atte, aji ga chigau.', 'Đúng là tiệm lâu đời hai trăm năm có khác, vị khác hẳn.'),
        E('ほめられて{調子|ちょうし}に{乗|の}ったばかりに、{大失敗|だいしっぱい}した。', 'Homerarete choushi ni notta bakari ni, daishippai shita.', 'Chỉ vì được khen rồi quá trớn mà thất bại to.'),
        E('{昨夜|さくや}{飲|の}みすぎたもんだから、{今朝|けさ}はひどい{二日酔|ふつかよ}いだ。', 'Sakuya nomisugita mon da kara, kesa wa hidoi futsukayoi da.', 'Tại tối qua uống quá chén nên sáng nay nôn nao kinh khủng.'),
        E('{期待|きたい}していただけに、{期待外|きたいはず}れでがっかりした。', 'Kitai shite ita dake ni, kitai hazure de gakkari shita.', 'Chính vì đã kỳ vọng nên thấy dưới kỳ vọng lại càng thất vọng.'),
      ],
    },
    { t: 'h', text: 'Slide 5–12 — だけに・だけあって・だけの: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b48-b3-noi-tu',
      title: 'Luyện nhanh — điền mẫu (8 câu)',
      kind: 'fill',
      items: [
        { q: '{楽|たの}しみにしていた（　　　）、{中止|ちゅうし}は{本当|ほんとう}に{残念|ざんねん}だ。（3 chữ kana）', answers: ['だけに'], hint: '普通形＋だけに' },
        { q: 'さすがプロ（　　　　　）、{動|うご}きが{全然|ぜんぜん}{違|ちが}う。（khen, 5 chữ kana）', answers: ['だけあって', 'だけに'], hint: 'N＋だけあって' },
        { q: 'この{景色|けしき}は、{三時間|さんじかん}かけて{来|く}る（　　　）{価値|かち}がある。（3 chữ kana）', answers: ['だけの'], hint: 'V＋だけの＋価値' },
        { q: '{結果|けっか}は{悪|わる}かったが、できる（　　　）ことはした。', answers: ['だけの'], hint: 'できるだけのこと' },
        { q: '{値段|ねだん}が{高|たか}い（　　　）、{味|あじ}はいまいちだ。（trái mong đợi — Bài 43, 3 chữ kana）', answers: ['わりに'], hint: 'わりに' },
        { q: '{有名|ゆうめい}（　）だけに、いつも{混|こ}んでいる。（1 chữ）', answers: ['な'], hint: 'ナA な＋だけに' },
        { q: 'この{味|あじ}なら、{高|たか}い（　　　　　　）。（quả không hổ danh — cuối câu）', answers: ['だけのことはある', 'だけのことはあります'], hint: '～だけのことはある' },
        { q: '{免許|めんきょ}は{取|と}った（　　　）、{一度|いちど}も{運転|うんてん}していない。（tuy… nhưng — Bài 28）', answers: ['ものの'], hint: 'ものの' },
      ],
    },
    {
      t: 'quiz',
      id: 'b48-b3-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '普通形＋だけに · 普通形＋だけあって · V＋だけの N',
      items: [
        { q: 'Chính vì đã dốc sức nên càng tiếc. (thể thường)', answers: V('{一生懸命|いっしょうけんめい}やっただけに、{悔|くや}しい。', '{一生懸命|いっしょうけんめい}やっていただけに、{悔|くや}しい。', '{一生懸命|いっしょうけんめい}{頑張|がんば}っただけに、{悔|くや}しい。'), hint: 'いっしょうけんめい やった だけに、くやしい' },
        { q: 'Chính vì là phim đang được bàn tán nên dưới kỳ vọng lại càng thất vọng. (thể thường)', answers: V('{話題|わだい}の{映画|えいが}だっただけに、{期待外|きたいはず}れでがっかりした。', '{話題|わだい}の{映画|えいが}だっただけに、{期待外|きたいはず}れでがっかりしてしまった。', '{話題|わだい}の{映画|えいが}だけに、{期待外|きたいはず}れでがっかりした。'), hint: 'わだいの えいが だった だけに、きたいはずれで がっかりした' },
        { q: 'Đúng là tiệm lâu đời có khác, vị khác hẳn. (thể thường)', answers: V('さすが{老舗|しにせ}だけあって、{味|あじ}が{違|ちが}う。', '{老舗|しにせ}だけあって、{味|あじ}が{違|ちが}う。', 'さすが{老舗|しにせ}だけあって、{味|あじ}が{全然|ぜんぜん}{違|ちが}う。'), hint: 'さすが しにせ だけあって、あじが ちがう' },
        { q: 'Đúng là người làm nghệ thuật giải trí có khác, nói chuyện rất hay. (thể thường)', answers: V('さすが{芸能人|げいのうじん}だけあって、{話|はなし}がおもしろい。', '{芸能人|げいのうじん}だけあって、{話|はなし}がおもしろい。', 'さすが{芸能人|げいのうじん}だけあって、{話|はな}すのがうまい。'), hint: 'さすが げいのうじん だけあって、はなしが おもしろい' },
        { q: 'Vịnh Hạ Long dù xa cũng đáng để đi. (lịch sự)', answers: V('ハロン{湾|わん}は、{遠|とお}くても{行|い}くだけの{価値|かち}があります。', 'ハロン{湾|わん}は{遠|とお}くても{行|い}くだけの{価値|かち}があります。', 'ハロン{湾|わん}は、{遠|とお}くても{行|い}くだけの{価値|かち}がありますよ。'), hint: 'ハロンわんは、とおくても いく だけの かちが あります' },
        { q: 'Kết quả đáng tiếc nhưng tôi đã làm hết những gì có thể. (thể thường)', answers: V('{結果|けっか}は{残念|ざんねん}だったが、できるだけのことはした。', '{結果|けっか}は{残念|ざんねん}だったけど、できるだけのことはした。', '{結果|けっか}は{残念|ざんねん}だったが、できるだけのことはやった。'), hint: 'けっかは ざんねん だったが、できる だけの ことは した' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**① だけに = chính vì (điều kiện đặc biệt) nên CÀNG…** — tốt hay xấu đều được, hay đi với cảm xúc. Danh từ nối thẳng: プロだけに.',
        '**② だけあって = đúng là… có khác** — CHỈ để khen, kết quả đúng như mong đợi. Kết quả xấu → だけに (thất vọng) / わりに (trái mong đợi).',
        '**③ だけの N = tương xứng / hết mức** — {読|よ}むだけの{価値|かち} · できるだけのこと · cuối câu ～だけのことはある (quả không hổ danh).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「だけあって」を{使|つか}って、あなたの{国|くに}の{有名|ゆうめい}な{物|もの}をほめてください。', ro: '"Dake atte" o tsukatte, anata no kuni no yuumei na mono o homete kudasai.', vi: 'Hãy dùng "dake atte" để khen một thứ nổi tiếng của nước em.' },
        { who: 'Bạn', role: 'candidate', text: 'ベトナムのフォーは、さすが{本場|ほんば}だけあって、ハノイで{食|た}べるとスープの{味|あじ}が{全然|ぜんぜん}{違|ちが}います。', ro: 'Betonamu no foo wa, sasuga honba dake atte, Hanoi de taberu to suupu no aji ga zenzen chigaimasu.', vi: 'Phở Việt Nam, đúng là ăn ở chính gốc có khác, ăn ở Hà Nội thì vị nước dùng khác hẳn.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'いいですね。では、「だけに」を{使|つか}って、がっかりした{経験|けいけん}を{話|はな}してください。', ro: 'Ii desu ne. De wa, "dake ni" o tsukatte, gakkari shita keiken o hanashite kudasai.', vi: 'Tốt lắm. Vậy hãy dùng "dake ni" kể một lần em thất vọng.' },
        { who: 'Bạn', role: 'candidate', text: '{去年|きょねん}、{一年|いちねん}も{楽|たの}しみにしていたコンサートだっただけに、{台風|たいふう}で{中止|ちゅうし}になった{時|とき}は、{本当|ほんとう}にがっかりしました。', ro: 'Kyonen, ichinen mo tanoshimi ni shite ita konsaato datta dake ni, taifuu de chuushi ni natta toki wa, hontou ni gakkari shimashita.', vi: 'Năm ngoái, chính vì là buổi hoà nhạc em mong cả năm trời nên khi bị huỷ vì bão em thật sự rất thất vọng.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'そうですか。それは{残念|ざんねん}でしたね。その{時|とき}、「だけあって」は{使|つか}えますか。', ro: 'Sou desu ka. Sore wa zannen deshita ne. Sono toki, "dake atte" wa tsukaemasu ka.', vi: 'Vậy à. Tiếc thật. Trong trường hợp đó có dùng "dake atte" được không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{使|つか}えません。「だけあって」はいい{結果|けっか}の{時|とき}だけ{使|つか}います。', ro: 'Iie, tsukaemasen. "Dake atte" wa ii kekka no toki dake tsukaimasu.', vi: 'Không ạ. "Dake atte" chỉ dùng khi kết quả tốt.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b48-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: DOI([
        { q: '{三年|さんねん}も{準備|じゅんび}してきた{大会|たいかい}だった（　）、{負|ま}けた{時|とき}は{涙|なみだ}が{止|と}まらなかった。', options: ['だけに', 'だけあって', 'わりに', 'ものの'], correct: 0, why: 'Điều kiện đặc biệt + cảm xúc tiêu cực mạnh → **だけに**.' },
        { q: 'さすが{名門|めいもん}{校|こう}の{選手|せんしゅ}（　）、{礼儀正|れいぎただ}しい。', options: ['だけあって', 'わりに', 'ばかりに', 'ものだから'], correct: 0, why: 'さすが + khen → **だけあって**.' },
        { q: 'この{店|みせ}は{駅|えき}から{遠|とお}い（　）、いつもお{客|きゃく}でいっぱいだ。', options: ['わりに', 'だけあって', 'だけの', 'ことから'], correct: 0, why: 'Xa ga mà lúc nào cũng đông — trái với mức mong đợi → **わりに** (Bài 43, bảng ⑦). だけあって không hợp: "xa ga" không phải lý do để đông khách.' },
        { q: 'この{本|ほん}は、{何度|なんど}も{読|よ}む（　）{価値|かち}がある。', options: ['だけの', 'だけに', 'ばかりに', 'わりに'], correct: 0, why: '**V＋だけの価値** = đáng để V.' },
        { q: '「{高|たか}いだけあって、すぐ{壊|こわ}れた」が{不自然|ふしぜん}なのはなぜですか。', options: ['だけあっては、いい{結果|けっか}の{時|とき}に{使|つか}うから', '「{高|たか}い」はい{形容詞|けいようし}だから', 'だけあっては{過去|かこ}の{文|ぶん}に{使|つか}えないから', '「すぐ」の{前|まえ}には「、」が{要|い}らないから'], correct: 0, why: 'だけあって chỉ dùng cho kết quả TỐT. Nói: **{高|たか}かっただけに、すぐ{壊|こわ}れてがっかりした** / **{高|たか}いわりに、すぐ{壊|こわ}れた**.' },
      ]),
    },
  ],
};

/* ═══════════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════════ */

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 67 từ của mục Từ vựng; nghĩa không trùng nhau). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{因果関係|いんがかんけい}', 'inga kankei', 'quan hệ nhân quả'],
  ['{要因|よういん}', 'youin', 'yếu tố, nhân tố góp phần'],
  ['{招|まね}く', 'maneku', 'chuốc lấy, gây ra (kết quả xấu)'],
  ['{引|ひ}き{起|お}こす', 'hikiokosu', 'gây ra (sự cố, bệnh)'],
  ['もたらす', 'motarasu', 'mang lại, đem đến'],
  ['{及|およ}ぼす', 'oyobosu', 'gây (ảnh hưởng) tới'],
  ['{裏付|うらづ}ける', 'urazukeru', 'chứng minh bằng chứng cứ'],
  ['{推測|すいそく}', 'suisoku', 'phỏng đoán từ thông tin có được'],
  ['{相関|そうかん}', 'soukan', 'tương quan'],
  ['{錯覚|さっかく}', 'sakkaku', 'ảo giác, sự tưởng nhầm'],
  ['{仮説|かせつ}', 'kasetsu', 'giả thuyết'],
  ['{検証|けんしょう}', 'kenshou', 'kiểm chứng'],
  ['{頻度|ひんど}', 'hindo', 'tần suất'],
  ['{頻繁|ひんぱん}', 'hinpan', 'thường xuyên, liên tục'],
  ['{密接|みっせつ}', 'missetsu', 'mật thiết'],
  ['{不具合|ふぐあい}', 'fuguai', 'trục trặc, lỗi (máy, phần mềm)'],
  ['{欠陥|けっかん}', 'kekkan', 'khiếm khuyết trong thiết kế'],
  ['{再発防止|さいはつぼうし}', 'saihatsu boushi', 'ngăn tái diễn'],
  ['{経緯|けいい}', 'keii', 'đầu đuôi, diễn biến sự việc'],
  ['{釈明|しゃくめい}', 'shakumei', 'giải trình (chính thức)'],
  ['{弁解|べんかい}', 'benkai', 'biện bạch, chống chế'],
  ['{始末書|しまつしょ}', 'shimatsusho', 'bản tường trình nhận lỗi'],
  ['{不注意|ふちゅうい}', 'fuchuui', 'bất cẩn, sơ ý'],
  ['{思|おも}い{込|こ}み', 'omoikomi', 'định kiến, sự tin chắc sai'],
  ['{確認漏|かくにんも}れ', 'kakunin more', 'sót khâu kiểm tra'],
  ['{慌|あわ}てる', 'awateru', 'hoảng, cuống lên'],
  ['{問|と}い{詰|つ}める', 'toitsumeru', 'vặn hỏi tới cùng'],
  ['{責|せ}める', 'semeru', 'trách, đổ lỗi'],
  ['{名称|めいしょう}', 'meishou', 'tên gọi chính thức'],
  ['{愛称|あいしょう}', 'aishou', 'tên thân mật, biệt danh'],
  ['{地名|ちめい}', 'chimei', 'địa danh'],
  ['{坂|さか}', 'saka', 'con dốc'],
  ['{谷|たに}', 'tani', 'thung lũng'],
  ['{海岸|かいがん}', 'kaigan', 'bờ biển'],
  ['{砂浜|すなはま}', 'sunahama', 'bãi cát'],
  ['{湾|わん}', 'wan', 'vịnh'],
  ['{丘|おか}', 'oka', 'đồi'],
  ['{郷土|きょうど}', 'kyoudo', 'quê hương, địa phương'],
  ['{遺跡|いせき}', 'iseki', 'di tích khảo cổ'],
  ['{言|い}い{伝|つた}え', 'iitsutae', 'truyền thuyết, lời kể truyền lại'],
  ['{名付|なづ}ける', 'nazukeru', 'đặt tên'],
  ['{芸術|げいじゅつ}', 'geijutsu', 'nghệ thuật'],
  ['{芸能人|げいのうじん}', 'geinoujin', 'nghệ sĩ giải trí'],
  ['{腕前|うでまえ}', 'udemae', 'tay nghề'],
  ['{賢|かしこ}い', 'kashikoi', 'khôn ngoan, sáng dạ'],
  ['{穏|おだ}やか', 'odayaka', 'êm đềm, ôn hoà'],
  ['{昇進|しょうしん}', 'shoushin', 'thăng chức'],
  ['{名門|めいもん}', 'meimon', 'danh giá lâu đời (trường, đội)'],
  ['{老舗|しにせ}', 'shinise', 'cửa hàng lâu đời'],
  ['{本場|ほんば}', 'honba', 'nơi chính gốc'],
  ['{期待外|きたいはず}れ', 'kitai hazure', 'dưới kỳ vọng'],
  ['{張|は}り{切|き}る', 'harikiru', 'hăng hái'],
  ['{懸命|けんめい}に', 'kenmei ni', 'dốc sức, cật lực'],
  ['{寝過|ねす}ごす', 'nesugosu', 'ngủ quá giờ'],
  ['{乗|の}り{過|す}ごす', 'norisugosu', 'đi quá ga'],
  ['{遭|あ}う', 'au', 'gặp phải chuyện không may'],
  ['{詰|つ}め{込|こ}む', 'tsumekomu', 'nhồi nhét'],
  ['{嘆|なげ}く', 'nageku', 'than thở'],
  ['{愚痴|ぐち}', 'guchi', 'lời cằn nhằn, than vãn'],
  ['{二日酔|ふつかよ}い', 'futsukayoi', 'nôn nao sau khi say'],
  ['{見栄|みえ}を{張|は}る', 'mie o haru', 'sĩ diện, làm màu'],
  ['{調子|ちょうし}に{乗|の}る', 'choushi ni noru', 'quá trớn, được đà lấn tới'],
  ['{口|くち}を{滑|すべ}らせる', 'kuchi o suberaseru', 'lỡ miệng'],
  ['{自業自得|じごうじとく}', 'jigou jitoku', 'tự làm tự chịu'],
  ['{早|はや}とちり', 'hayatochiri', 'hấp tấp hiểu nhầm'],
  ['{運悪|うんわる}く', 'un\'waruku', 'xui thay, không may'],
  ['{取|と}り{返|かえ}しがつかない', 'torikaeshi ga tsukanai', 'không thể cứu vãn'],
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
  id: 'b48-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (50 câu)',
  goal: 'Nhớ chắc 67 từ nhân quả của Bài 48 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các nhóm dễ nhầm (原因・要因・理由, 因果関係・相関, 招く・引き起こす・もたらす・及ぼす, 推測・予想, 不具合・欠陥・故障, 釈明・弁解・言い訳, 慌てる・焦る, 老舗・名門・本場, 寝過ごす・乗り過ごす, 遭う・会う, 懸命・賢明).',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 20 câu Nhật → Việt và 15 câu Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi) và đọc câu ví dụ ở mục Từ vựng.',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N2 (4 lựa chọn cùng loại từ — phải hiểu cả câu mới chọn được).',
        'Lỗi hay mắc: {要因|よういん} (một trong nhiều yếu tố) ↔ {原因|げんいん} (nguyên nhân trực tiếp) · {相関|そうかん} (cùng thay đổi) ↔ {因果関係|いんがかんけい} (A gây ra B) · {老舗|しにせ} đọc しにせ · {経緯|けいい} đọc けいい · {寝過|ねす}ごす (ngủ quá giờ) ↔ {乗|の}り{過|す}ごす (đi quá ga) · {遭|あ}う chỉ cho chuyện không may.',
      ],
    },
    { t: 'mcq', id: 'b48-lt1-nv', title: '🟢 Nhật → Việt (20 câu)', items: [...MCQ_NV(0, 10), ...MCQ_NV(28, 38)] },
    { t: 'mcq', id: 'b48-lt1-vn', title: '🟢 Việt → Nhật (15 câu)', items: [...MCQ_VN(15, 22), ...MCQ_VN(53, 61)] },
    {
      t: 'mcq',
      id: 'b48-lt1-dien',
      title: '🟡 Điền từ vào câu — 文脈規定 (15 câu)',
      items: DOI([
        { q: '{売|う}り{上|あ}げが{下|さ}がった（　）は{一|ひと}つではなく、{天気|てんき}や{値上|ねあ}げなど、いくつもある。', options: ['{要因|よういん}', '{経緯|けいい}', '{名称|めいしょう}', '{本場|ほんば}'], correct: 0, why: 'Nhiều yếu tố góp phần → **{要因|よういん}**. 〔Uriage ga sagatta youin wa hitotsu de wa naku…〕' },
        { q: '{新|あたら}しい{薬|くすり}の{効果|こうか}を、{三年|さんねん}かけて（　）した。', options: ['{検証|けんしょう}', '{弁解|べんかい}', '{昇進|しょうしん}', '{推測|すいそく}'], correct: 0, why: 'Kiểm tra cho chắc bằng thí nghiệm → **{検証|けんしょう}**. 〔Kouka o sannen kakete kenshou shita.〕' },
        { q: 'その{説|せつ}を（　）データは、まだ{見|み}つかっていない。', options: ['{裏付|うらづ}ける', '{招|まね}く', '{名付|なづ}ける', '{張|は}り{切|き}る'], correct: 0, why: 'Số liệu chứng minh thuyết → **{裏付|うらづ}ける**. 〔Sono setsu o urazukeru deeta…〕' },
        { q: 'この{道|みち}では{事故|じこ}が（　）に{起|お}きているので、{信号|しんごう}をつけることになった。', options: ['{頻繁|ひんぱん}', '{穏|おだ}やか', '{密接|みっせつ}', '{懸命|けんめい}'], correct: 0, why: 'Tai nạn xảy ra liên tục → **{頻繁|ひんぱん}に**. 〔Jiko ga hinpan ni okite iru…〕' },
        { q: '{言葉|ことば}と{文化|ぶんか}は（　）な{関係|かんけい}にある。', options: ['{密接|みっせつ}', '{頻繁|ひんぱん}', '{穏|おだ}やか', '{賢|かしこ}'], correct: 0, why: '**{密接|みっせつ}な{関係|かんけい}** — cụm cố định. 〔Missetsu na kankei ni aru.〕' },
        { q: 'アプリの（　）で、{一時間|いちじかん}ほどログインできなかった。', options: ['{不具合|ふぐあい}', '{欠陥|けっかん}', '{始末書|しまつしょ}', '{愛称|あいしょう}'], correct: 0, why: 'Lỗi chạy tạm thời của phần mềm → **{不具合|ふぐあい}**. {欠陥|けっかん} là lỗi nằm trong thiết kế (nặng, thường dẫn tới thu hồi).' },
        { q: '{会社|かいしゃ}のパソコンをなくした{社員|しゃいん}は、（　）を{提出|ていしゅつ}させられた。', options: ['{始末書|しまつしょ}', '{仮説|かせつ}', '{言|い}い{伝|つた}え', '{地名|ちめい}'], correct: 0, why: 'Bản tường trình nhận lỗi nộp công ty → **{始末書|しまつしょ}**.' },
        { q: '「{簡単|かんたん}な{作業|さぎょう}だ」という（　）が、{確認|かくにん}を{怠|おこた}らせた。', options: ['{思|おも}い{込|こ}み', '{腕前|うでまえ}', '{名門|めいもん}', '{郷土|きょうど}'], correct: 0, why: 'Tin chắc sai ("chắc là dễ") → **{思|おも}い{込|こ}み**.' },
        { q: '{山|やま}の{上|うえ}から{見|み}ると、（　）の{底|そこ}に{小|ちい}さな{村|むら}が{見|み}えた。', options: ['{谷|たに}', '{湾|わん}', '{砂浜|すなはま}', '{坂|さか}'], correct: 0, why: 'Đáy… giữa núi → **{谷|たに}** (thung lũng). 〔Tani no soko ni…〕' },
        { q: 'この{電車|でんしゃ}は、{色|いろ}が{青|あお}いことから「{海号|うみごう}」という（　）で{親|した}しまれている。', options: ['{愛称|あいしょう}', '{名称|めいしょう}', '{地名|ちめい}', '{遺跡|いせき}'], correct: 0, why: '**～という{愛称|あいしょう}で{親|した}しまれる** — tên thân mật. {名称|めいしょう} là tên chính thức.' },
        { q: '{旅行先|りょこうさき}では、その{土地|とち}の（　）{料理|りょうり}を{食|た}べるのが{楽|たの}しみだ。', options: ['{郷土|きょうど}', '{名門|めいもん}', '{本場|ほんば}', '{芸術|げいじゅつ}'], correct: 0, why: 'Món ăn của chính vùng đất đó → **{郷土料理|きょうどりょうり}** (món ăn địa phương). {本場|ほんば} = nơi gốc của một món / một nghề, không ghép thành từ với 料理 theo cách này.' },
        { q: '{創業|そうぎょう}{三百年|さんびゃくねん}の（　）の{旅館|りょかん}に{泊|と}まった。', options: ['{老舗|しにせ}', '{名門|めいもん}', '{本場|ほんば}', '{郷土|きょうど}'], correct: 0, why: 'Cơ sở kinh doanh lâu đời → **{老舗|しにせ}**.' },
        { q: '{初|はじ}めての{発表|はっぴょう}なので、{弟|おとうと}は{朝|あさ}から（　）いる。', options: ['{張|は}り{切|き}って', '{嘆|なげ}いて', '{詰|つ}め{込|こ}んで', '{慌|あわ}てて'], correct: 0, why: 'Hăng hái chuẩn bị → **{張|は}り{切|き}って**. {慌|あわ}てて là hoảng hốt.' },
        { q: '{駅|えき}で{寝|ね}てしまい、{目|め}が{覚|さ}めたら{終点|しゅうてん}だった。{三駅|みえき}も（　）しまった。', options: ['{乗|の}り{過|す}ごして', '{寝過|ねす}ごして', '{問|と}い{詰|つ}めて', '{名付|なづ}けて'], correct: 0, why: 'Đi quá ga → **{乗|の}り{過|す}ごす**. (Dù ngủ, nhưng "ba ga" là quãng tàu đã đi quá.)' },
        { q: 'うそをついて{信用|しんよう}を{失|うしな}ったら、もう（　）。', options: ['{取|と}り{返|かえ}しがつかない', '{調子|ちょうし}に{乗|の}る', '{見栄|みえ}を{張|は}る', '{自業自得|じごうじとく}だった'], correct: 0, why: 'Không thể lấy lại được nữa → **{取|と}り{返|かえ}しがつかない**.' },
      ]),
    },
  ],
};

const LT_2: Lesson = {
  id: 'b48-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 漢字読み + 表記 (25 câu)',
  goal: 'Đọc đúng và chọn đúng chữ cho 24 chữ mới (坂 谷 岸 浜 湾 丘 郷 称 縁 遺 釈 慌 遭 詰 陥 嘆 懸 拠 錯 冗 愚 芸 賢 穏) trong từ thực tế, tránh các bẫy âm (懸命 ↔ 賢明, 遭う ↔ 会う, 郷 キョウ／ゴウ, 拠 キョ／コ, 懸 ケン／ケ) và bẫy chữ trông giống (縁 ↔ 緑, 釈 ↔ 訳, 詰 ↔ 結, 愚 ↔ 偶, 穏 ↔ 隠).',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**漢字読み (15 câu)** — đọc to từ in đậm TRƯỚC khi nhìn lựa chọn. Bẫy hay gặp: âm đục (かいがん・かわぎし・くだりざか), âm ngắt (けっかん・さっかく), cách đọc đặc biệt (しにせ・しぶや・ゆいごん・けねん・しょうこ).',
        '**表記 (10 câu)** — đọc nghĩa cả câu, rồi chọn chữ: đồng âm khác nghĩa và chữ trông giống là hai bẫy chính.',
      ],
    },
    {
      t: 'mcq',
      id: 'b48-lt2-doc',
      title: '漢字読み — chọn cách đọc (15 câu)',
      items: DOI([
        { q: '{駅|えき}を{出|で}ると、すぐ**下り坂**になる。', options: ['くだりざか', 'くだりさか', 'したりざか', 'げりはん'], correct: 0, why: '**{下|くだ}り{坂|ざか}** — さか thành ざか sau từ khác.' },
        { q: '**川岸**を{散歩|さんぽ}した。', options: ['かわぎし', 'かわきし', 'せんがん', 'かわがん'], correct: 0, why: '**{川岸|かわぎし}** — きし → ぎし.' },
        { q: '**浜辺**で{夕日|ゆうひ}を{見|み}た。', options: ['はまべ', 'はまへ', 'ひんぺん', 'はまぺ'], correct: 0, why: '**{浜辺|はまべ}** — cả từ đọc Kun.' },
        { q: '**湾岸**{道路|どうろ}が{渋滞|じゅうたい}している。', options: ['わんがん', 'わんぎし', 'わんかん', 'まんがん'], correct: 0, why: '**{湾岸|わんがん}** — 湾 ワン, 岸 ガン.' },
        { q: '**砂丘**の{上|うえ}を{歩|ある}いた。', options: ['さきゅう', 'すなおか', 'しゃきゅう', 'さおか'], correct: 0, why: '**{砂丘|さきゅう}** — 砂 サ, 丘 キュウ.' },
        { q: '**故郷**に{帰|かえ}って{家族|かぞく}に{会|あ}った。', options: ['こきょう', 'こごう', 'ここう', 'ゆえさと'], correct: 0, why: '**{故郷|こきょう}** — 郷 キョウ (cũng gặp đọc ふるさと).' },
        { q: '**愛称**で{呼|よ}ばれている。', options: ['あいしょう', 'あいしゅう', 'あいそう', 'あいじょう'], correct: 0, why: '**{愛称|あいしょう}** — 称 ショウ.' },
        { q: '{祖父|そふ}の**遺言**を{読|よ}んだ。', options: ['ゆいごん', 'いげん', 'いごん', 'ゆいげん'], correct: 0, why: '**{遺言|ゆいごん}** — 遺 đọc ユイ, 言 đọc ゴン trong từ này.' },
        { q: '**注釈**を{読|よ}めば{分|わ}かる。', options: ['ちゅうしゃく', 'ちゅうせき', 'ちゅうやく', 'じゅうしゃく'], correct: 0, why: '**{注釈|ちゅうしゃく}** — 釈 シャク.' },
        { q: '{山|やま}で**遭難**した{人|ひと}が{助|たす}けられた。', options: ['そうなん', 'あいなん', 'そうだん', 'ぞうなん'], correct: 0, why: '**{遭難|そうなん}** — 遭 ソウ.' },
        { q: '{予定|よてい}がぎっしり**詰**まっている。', options: ['つ', 'き', 'こ', 'し'], correct: 0, why: '**{詰|つ}まる** — kín, tắc.' },
        { q: '{子|こ}どもの**愚**かないたずら。', options: ['おろ', 'ぐ', 'あさ', 'ばか'], correct: 0, why: '**{愚|おろ}か** — Kun おろ. ばか là từ khác (viết kana / 馬鹿).' },
        { q: 'それは**冗談**ですよ。', options: ['じょうだん', 'じょだん', 'しょうだん', 'じゅうだん'], correct: 0, why: '**{冗談|じょうだん}** — 冗 ジョウ (trường âm).' },
        { q: '**証拠**を{集|あつ}める。', options: ['しょうこ', 'しょうきょ', 'せいこ', 'しょこ'], correct: 0, why: '**{証拠|しょうこ}** — 拠 đọc コ trong từ này (根拠 thì キョ).' },
        { q: '**賢明**な{判断|はんだん}だった。', options: ['けんめい', 'かしこめい', 'げんめい', 'けんみょう'], correct: 0, why: '**{賢明|けんめい}** — sáng suốt (cùng âm với {懸命|けんめい}).' },
      ]),
    },
    {
      t: 'mcq',
      id: 'b48-lt2-chon',
      title: '表記 — chọn chữ đúng (10 câu)',
      items: DOI([
        { q: '{町|まち}の**めいしょう**が{変|か}わった。', options: ['名称', '名賞', '名証', '銘称'], correct: 0, why: '**{名称|めいしょう}** — 称 (禾 + 尔).' },
        { q: '**いせき**から{古|ふる}い{土器|どき}が{出|で}てきた。', options: ['遺跡', '遣跡', '遺積', '移跡'], correct: 0, why: '**{遺跡|いせき}** — 遺 có 貴 bên trong; 遣 (つかう) không có 貝.' },
        { q: '{車|くるま}の**けっかん**が{見|み}つかった。', options: ['欠陥', '欠陷', '血管', '結果'], correct: 0, why: '**{欠陥|けっかん}** (khiếm khuyết). {血管|けっかん} (mạch máu) cùng âm, khác nghĩa!' },
        { q: '{失敗|しっぱい}を**なげ**いてもしかたがない。', options: ['嘆', '漢', '難', '投'], correct: 0, why: '**{嘆|なげ}く** — 口 + phần phải; 投げる (ném) cũng đọc なげ nhưng khác nghĩa.' },
        { q: '{目|め}の**さっかく**で、{線|せん}が{長|なが}く{見|み}える。', options: ['錯覚', '借覚', '昔覚', '察覚'], correct: 0, why: '**{錯覚|さっかく}** — 錯 = 金 + 昔.' },
        { q: '{彼|かれ}はいつも**じょうだん**ばかり{言|い}う。', options: ['冗談', '常談', '情談', '上談'], correct: 0, why: '**{冗談|じょうだん}** — 冗 (冖 + 几).' },
        { q: '{仕事|しごと}の**ぐち**を{言|い}う。', options: ['愚痴', '偶痴', '具痴', '愚知'], correct: 0, why: '**{愚痴|ぐち}** — 愚 = 禺 + 心.' },
        { q: '{彼女|かのじょ}は**げいじゅつ**{大学|だいがく}の{学生|がくせい}だ。', options: ['芸術', '芸述', '云術', '芸衛'], correct: 0, why: '**{芸術|げいじゅつ}**.' },
        { q: 'このあたりは**おか**が{多|おお}い。', options: ['丘', '兵', '岳', '坂'], correct: 0, why: '**{丘|おか}** — 兵 = 丘 + 八.' },
        { q: '{選手|せんしゅ}たちは{最後|さいご}まで**けんめい**に{戦|たたか}った。', options: ['懸命', '賢明', '県命', '健命'], correct: 0, why: '"Dốc sức" → **{懸命|けんめい}** (懸 = 県 + 系 + 心). {賢明|けんめい} = sáng suốt.' },
      ]),
    },
  ],
};

const LT_3: Lesson = {
  id: 'b48-lt-3-ngu-phap',
  kind: 'homework',
  title: 'Luyện thêm 3 · Ngữ pháp — 文法形式の判断 (20 câu) + 文の組み立て ★ (6 câu)',
  goal: 'Chọn đúng mẫu và đúng cách nối cho ばかりに・ことから・だけに・ものだから trong 20 câu dạng đề, phân biệt với せいで・おかげで・ため・ことだから・だけあって・わりに・ものの・から; sắp xếp câu ★ với các mẫu của bài.',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        'Mỗi câu tự hỏi **3 câu**: (1) Kết quả tốt hay xấu, có cảm xúc gì (tiếc · đổ lỗi · biết ơn · khen · thất vọng · bào chữa)? (2) Văn viết khách quan hay lời nói của một người? (3) Từ đứng trước là thể thường, **Nの**, hay **N** trơn (cần である)? Vế sau có mệnh lệnh / rủ rê không?',
        'Sai câu nào → đọc lại đúng mục: ① ばかりに · ② ことから · ③ だけに／だけあって／だけの · ④ ものだから · bảng ⑤ ⑥ ⑦ ⑧.',
      ],
    },
    {
      t: 'mcq',
      id: 'b48-lt3-jlpt',
      title: '文法形式の判断 (20 câu)',
      items: DOI([
        { q: 'たった{一度|いちど}うそをついた（　）、{友達|ともだち}に{信用|しんよう}されなくなった。', options: ['ばかりに', 'おかげで', 'だけあって', 'ことだから'], correct: 0, why: 'たった一度 + hậu quả xấu + tiếc → **ばかりに**.' },
        { q: '{親友|しんゆう}に{会|あ}いたい（　）、{夜行|やこう}バスで{十時間|じゅうじかん}もかけて{行|い}った。', options: ['ばかりに', 'せいで', 'わりに', 'ものの'], correct: 0, why: '**Vたい＋ばかりに** — vì quá muốn gặp mà chịu đi mười tiếng.' },
        { q: '{弟|おとうと}が{夜中|よなか}までゲームをしていた（　）、{家族|かぞく}みんなが{眠|ねむ}れなかった。', options: ['せいで', 'おかげで', 'だけあって', 'ことから'], correct: 0, why: 'Đổ lỗi cho người khác (em trai) → **せいで**. ばかりに thường dùng cho chuyện tiếc của mình; ことから là văn viết khách quan.' },
        { q: '{子|こ}ども（　）ばかりに、{大人|おとな}の{話|はなし}に{入|い}れてもらえなかった。', options: ['である', 'の', 'な', 'に'], correct: 0, why: 'Danh từ + **である** + ばかりに.' },
        { q: 'この{地域|ちいき}は{雪|ゆき}が{多|おお}い（　）、「{雪国|ゆきぐに}」と{呼|よ}ばれている。', options: ['ことから', 'ことだから', 'ばかりに', 'だけあって'], correct: 0, why: 'Nguồn gốc tên gọi → **ことから**.' },
        { q: '{机|つくえ}の{上|うえ}のコーヒーがまだ{温|あたた}かい（　）、{彼|かれ}は{出|で}かけたばかりだと{考|かんが}えられる。', options: ['ことから', 'ことだから', 'ものだから', 'だけに'], correct: 0, why: 'Dấu hiệu → suy luận (と考えられる) → **ことから**.' },
        { q: '{話|はな}し{好|ず}きな{山田|やまだ}さんの（　）、{会議|かいぎ}は{長|なが}くなるに{違|ちが}いない。', options: ['ことだから', 'ことから', 'ものだから', 'わりに'], correct: 0, why: '**Nの** + tính cách quen thuộc + に違いない → **ことだから**.' },
        { q: 'この{町|まち}は{古|ふる}くから{港町|みなとまち}（　）ことから、{外国|がいこく}の{文化|ぶんか}が{早|はや}く{入|はい}ってきた。', options: ['であった', 'の', 'な', 'で'], correct: 0, why: 'N + **である／であった** + ことから.' },
        { q: '{楽|たの}しみにしていた{試合|しあい}だった（　）、{雨|あめ}で{中止|ちゅうし}になって{本当|ほんとう}に{残念|ざんねん}だ。', options: ['だけに', 'だけあって', 'わりに', 'ばかりか'], correct: 0, why: 'Điều kiện đặc biệt + thất vọng mạnh → **だけに**.' },
        { q: 'さすが{世界的|せかいてき}な{指揮者|しきしゃ}（　）、オーケストラの{音|おと}がまるで{違|ちが}う。', options: ['だけあって', 'わりに', 'ばかりに', 'くせに'], correct: 0, why: 'さすが + khen đúng như mong đợi → **だけあって**.' },
        { q: '{有名|ゆうめい}な{店|みせ}の（　）、サービスはあまりよくなかった。', options: ['わりに', 'だけあって', 'おかげで', 'ことだから'], correct: 0, why: 'Nổi tiếng mà phục vụ kém — trái mong đợi → **わりに** (Bài 43). だけあって chỉ cho kết quả tốt.' },
        { q: 'この{映画|えいが}は、{二時間|にじかん}{並|なら}んで{見|み}る（　）{価値|かち}はあった。', options: ['だけの', 'だけに', 'ばかりに', 'わりに'], correct: 0, why: '**V＋だけの価値** = đáng để…' },
        { q: '{私|わたし}たちにできる（　）ことはすべてやった。あとは{結果|けっか}を{待|ま}つだけだ。', options: ['だけの', 'ばかりの', 'だけに', 'ほどに'], correct: 0, why: '**できるだけのこと** = hết những gì có thể.' },
        { q: 'このラーメンは{本当|ほんとう}においしい。{一時間|いちじかん}{並|なら}んだ（　）。', options: ['だけのことはある', 'わけにはいかない', 'ばかりではない', 'ものではない'], correct: 0, why: 'Cuối câu, khen: xếp hàng một tiếng **quả không uổng** → **だけのことはある**.' },
        { q: '{課長|かちょう}：「なぜ{報告|ほうこく}が{遅|おそ}れたんですか。」　{社員|しゃいん}：「{申|もう}し{訳|わけ}ありません。{確認|かくにん}に{時間|じかん}がかかった（　）……。」', options: ['ものですから', 'ものの', 'ことから', 'だけに'], correct: 0, why: 'Trả lời câu hỏi lý do + xin lỗi người trên → **ものですから**.' },
        { q: '{子|こ}どもがまだ{小|ちい}さい（　）、{夜|よる}は{出|で}かけられないんです。', options: ['ものですから', 'ばかりに', 'ことから', 'だけあって'], correct: 0, why: 'Giải thích hoàn cảnh cá nhân, mong thông cảm → **ものですから**.' },
        { q: '{英語|えいご}の{本|ほん}を{買|か}った（　）、{難|むずか}しくてまだ{一|いち}ページも{読|よ}んでいない。', options: ['ものの', 'ものだから', 'ことから', 'だけに'], correct: 0, why: '"Tuy đã mua nhưng chưa đọc" → **ものの** (Bài 28, bảng ⑧).' },
        { q: '{雨|あめ}がひどい（　）、{今日|きょう}は{家|いえ}で{映画|えいが}を{見|み}ましょう。', options: ['から', 'ものだから', 'ばかりに', 'ことから'], correct: 0, why: 'Vế sau rủ rê (～ましょう) → chỉ **から** đúng.' },
        { q: '{台風|たいふう}の（　）、{本日|ほんじつ}の{運転|うんてん}を{見合|みあ}わせます。（駅のアナウンス）', options: ['ため', 'ものだから', 'ばかりに', 'だけに'], correct: 0, why: 'Thông báo khách quan → **ため** (Bài 27). ものだから là lý do cá nhân.' },
        { q: '{先輩|せんぱい}がアドバイスしてくれた（　）、{面接|めんせつ}がうまくいった。', options: ['おかげで', 'ばかりに', 'せいで', 'ものの'], correct: 0, why: 'Kết quả tốt + biết ơn → **おかげで**.' },
      ]),
    },
    {
      t: 'mcq',
      id: 'b48-lt3-sao',
      title: '文の組み立て ★ (6 câu)',
      items: [
        { q: '★ {彼女|かのじょ}は ＿＿ ＿＿ ★ ＿＿ 、{毎朝|まいあさ}{五時|ごじ}に{起|お}きて{練習|れんしゅう}している。（ばかりに／{選手|せんしゅ}に／なりたい／{一流|いちりゅう}の）', options: ['ばかりに', '{選手|せんしゅ}に', 'なりたい', '{一流|いちりゅう}の'], correct: 2, why: 'Câu đúng: {彼女|かのじょ}は **{一流|いちりゅう}の {選手|せんしゅ}に なりたい ばかりに**、… ★ (ô 3) = **なりたい**.' },
        { q: '★ この{坂|さか}は ＿＿ ★ ＿＿ ＿＿ 、「{紅葉坂|もみじざか}」と{呼|よ}ばれている。（{紅葉|もみじ}の／ことから／{秋|あき}に／{美|うつく}しい）', options: ['{紅葉|もみじ}の', 'ことから', '{秋|あき}に', '{美|うつく}しい'], correct: 0, why: 'Câu đúng: この{坂|さか}は **{秋|あき}に {紅葉|もみじ}の {美|うつく}しい ことから**、… ★ (ô 2) = **{紅葉|もみじ}の**. (の thay が trong mệnh đề bổ nghĩa — 紅葉の美しい.)' },
        { q: '★ {心配性|しんぱいしょう}の ＿＿ ＿＿ ★ ＿＿ 。（だろう／{母|はは}の／ことだから／また{電話|でんわ}してくる）', options: ['だろう', '{母|はは}の', 'ことだから', 'また{電話|でんわ}してくる'], correct: 3, why: 'Câu đúng: {心配性|しんぱいしょう}の **{母|はは}の ことだから また{電話|でんわ}してくる だろう**. ★ (ô 3) = **また{電話|でんわ}してくる**.' },
        { q: '★ ＿＿ ★ ＿＿ ＿＿ 、{負|ま}けた{時|とき}は{悔|くや}しくて{眠|ねむ}れなかった。（だけに／{練習|れんしゅう}してきた／{一年間|いちねんかん}／{毎日|まいにち}）', options: ['だけに', '{練習|れんしゅう}してきた', '{一年間|いちねんかん}', '{毎日|まいにち}'], correct: 3, why: 'Câu đúng: **{一年間|いちねんかん} {毎日|まいにち} {練習|れんしゅう}してきた だけに**、… ★ (ô 2) = **{毎日|まいにち}**.' },
        { q: '★ さすが ＿＿ ＿＿ ★ ＿＿ 。（だけあって／{料理人|りょうりにん}／{包丁|ほうちょう}さばきが{見事|みごと}だ／{本場|ほんば}で{修業|しゅぎょう}した）', options: ['だけあって', '{料理人|りょうりにん}', '{包丁|ほうちょう}さばきが{見事|みごと}だ', '{本場|ほんば}で{修業|しゅぎょう}した'], correct: 0, why: 'Câu đúng: さすが **{本場|ほんば}で{修業|しゅぎょう}した {料理人|りょうりにん} だけあって {包丁|ほうちょう}さばきが{見事|みごと}だ**. ★ (ô 3) = **だけあって**.' },
        { q: '★ すみません、＿＿ ＿＿ ★ ＿＿ 、{遅|おく}れてしまいました。（ものですから／{事故|じこ}で／{止|と}まっていた／{電車|でんしゃ}が）', options: ['ものですから', '{事故|じこ}で', '{止|と}まっていた', '{電車|でんしゃ}が'], correct: 2, why: 'Câu đúng: すみません、**{事故|じこ}で {電車|でんしゃ}が {止|と}まっていた ものですから**、… ★ (ô 3) = **{止|と}まっていた**.' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b48-lt-4-van-canh',
  kind: 'homework',
  title: 'Luyện thêm 4 · Văn cảnh — chọn câu nói đúng tình huống (15 câu)',
  goal: 'Chọn câu tự nhiên nhất cho từng tình huống thật — báo cáo với cấp trên, xin lỗi đi muộn, bảng giới thiệu ở điểm du lịch, an ủi bạn, khen đồng nghiệp, bài luận — để dùng đúng "giọng" của ばかりに・ことから・だけに・だけあって・ものだから.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        'Mỗi câu là một **tình huống** (ai nói với ai, ở đâu, nói hay viết). Ba lựa chọn sai thường **đúng ngữ pháp nhưng sai giọng** (báo cáo mà dùng ものですから, bảng giới thiệu mà dùng もんだから, khen mà dùng だけに với kết quả xấu) hoặc **sai nghĩa** (dùng だけあって cho chuyện thất vọng).',
        'Đọc phần giải thích cả khi làm đúng — đó là chỗ học "vì sao người Nhật nói vậy".',
      ],
    },
    {
      t: 'mcq',
      id: 'b48-lt4-canh',
      title: 'Chọn câu đúng tình huống (15 câu)',
      items: DOI([
        { q: 'Tình huống: bạn viết báo cáo sự cố gửi trưởng phòng. Câu nêu nguyên nhân nào phù hợp nhất?', options: ['{設定|せってい}の{確認|かくにん}が{行|おこな}われていなかったことから、{不具合|ふぐあい}が{発生|はっせい}したと{考|かんが}えられます。', '{忙|いそが}しかったものですから、{確認|かくにん}できませんでした。', '{確認|かくにん}を{怠|おこた}ったばかりに、もう{本当|ほんとう}に{悲|かな}しいです。', '{終電|しゅうでん}が{迫|せま}っていたもんだから、{仕方|しかた}なかったんです。'], correct: 0, why: 'Báo cáo → giọng **khách quan**: **～ことから、～と{考|かんが}えられます**. ものですから / もんだから = bào chữa; ばかりに mang cảm xúc.' },
        { q: 'Tình huống: bạn đến lớp muộn 5 phút, giáo viên nhìn bạn. Bạn nói:', options: ['{遅|おく}れてすみません。バスがなかなか{来|こ}なかったものですから。', 'バスが{来|こ}なかったことから、{遅|おく}れたと{考|かんが}えられます。', 'バスが{来|こ}なかったばかりに、{先生|せんせい}は{待|ま}ってください。', '{遅|おく}れただけあって、すみません。'], correct: 0, why: 'Xin lỗi việc nhỏ + lý do → **～ものですから** là tự nhiên. ことから nghe như báo cáo; ばかりに + mệnh lệnh là sai.' },
        { q: 'Tình huống: bảng giới thiệu ở chân một con dốc trong phố cổ.', options: ['{坂|さか}の{上|うえ}から{富士山|ふじさん}がよく{見|み}えたことから、「{富士見坂|ふじみざか}」と{呼|よ}ばれるようになりました。', '{富士山|ふじさん}がよく{見|み}えたもんだから、「{富士見坂|ふじみざか}」なんだよ。', '{富士山|ふじさん}が{見|み}えたばかりに、「{富士見坂|ふじみざか}」になってしまいました。', '{富士山|ふじさん}が{見|み}えるだけあって、「{富士見坂|ふじみざか}」です。'], correct: 0, why: 'Bảng giới thiệu → văn viết khách quan: **～ことから、～と{呼|よ}ばれるようになりました**.' },
        { q: 'Tình huống: bạn thân thi trượt dù đã ôn suốt một năm. Bạn an ủi:', options: ['{一年|いちねん}も{頑張|がんば}っただけに、{悔|くや}しいよね。でも、{次|つぎ}はきっと{大丈夫|だいじょうぶ}だよ。', '{一年|いちねん}も{頑張|がんば}っただけあって、{落|お}ちたね。', '{一年|いちねん}も{頑張|がんば}ったばかりに、{落|お}ちたんだね。', '{一年|いちねん}も{頑張|がんば}ったことから、{落|お}ちたと{考|かんが}えられる。'], correct: 0, why: 'Thất vọng mạnh vì đã cố gắng nhiều → **だけに{悔|くや}しい**. だけあって chỉ cho kết quả tốt; ばかりに làm như việc cố gắng là nguyên nhân thi trượt (vô lý).' },
        { q: 'Tình huống: đồng nghiệp làm thông dịch rất giỏi; bạn biết anh ấy sống ở Nhật 10 năm. Bạn khen:', options: ['さすが{十年|じゅうねん}も{日本|にほん}に{住|す}んでいただけあって、{通訳|つうやく}が{完璧|かんぺき}ですね。', '{十年|じゅうねん}も{日本|にほん}に{住|す}んでいたわりに、{通訳|つうやく}が{完璧|かんぺき}ですね。', '{十年|じゅうねん}も{日本|にほん}に{住|す}んでいたばかりに、{通訳|つうやく}が{完璧|かんぺき}ですね。', '{十年|じゅうねん}も{日本|にほん}に{住|す}んでいたものだから、{通訳|つうやく}が{完璧|かんぺき}ですね。'], correct: 0, why: 'Khen, đúng như mong đợi → **さすが～だけあって**. わりに = trái mong đợi (sống lâu thì giỏi là bình thường).' },
        { q: 'Tình huống: bạn kể cho bạn bè chuyện mình nói đùa làm người yêu giận.', options: ['{冗談|じょうだん}のつもりで{言|い}ったばかりに、すごく{怒|おこ}らせちゃった。', '{冗談|じょうだん}を{言|い}ったおかげで、すごく{怒|おこ}らせちゃった。', '{冗談|じょうだん}を{言|い}ったことから、{怒|おこ}らせたと{考|かんが}えられる。', '{冗談|じょうだん}を{言|い}っただけあって、{怒|おこ}らせちゃった。'], correct: 0, why: 'Chuyện nhỏ + hậu quả xấu + tiếc → **ばかりに**. おかげで chỉ dùng mỉa mai — không hợp giọng hối hận.' },
        { q: 'Tình huống: bạn đoán đồng nghiệp chu đáo đã chuẩn bị xong tài liệu.', options: ['{几帳面|きちょうめん}な{鈴木|すずき}さんのことだから、もう{準備|じゅんび}してあるはずですよ。', '{几帳面|きちょうめん}な{鈴木|すずき}さんのことから、{準備|じゅんび}してあると{考|かんが}えられる。', '{几帳面|きちょうめん}な{鈴木|すずき}さんだけに、{準備|じゅんび}してあるばかりだ。', '{几帳面|きちょうめん}な{鈴木|すずき}さんのものだから、{準備|じゅんび}してある。'], correct: 0, why: 'Đoán theo tính cách quen thuộc → **Nのことだから、～はずです**.' },
        { q: 'Tình huống: bạn viết bài luận về lý do nhiều người trẻ chuyển về nông thôn.', options: ['{在宅勤務|ざいたくきんむ}が{広|ひろ}がったことから、{地方|ちほう}に{移|うつ}り{住|す}む{若者|わかもの}が{増|ふ}えたと{考|かんが}えられる。', '{在宅勤務|ざいたくきんむ}が{広|ひろ}がったもんだから、{若者|わかもの}が{地方|ちほう}に{行|い}っちゃったんだ。', '{在宅勤務|ざいたくきんむ}が{広|ひろ}がったばかりに、{若者|わかもの}が{地方|ちほう}に{移|うつ}った。', '{在宅勤務|ざいたくきんむ}が{広|ひろ}がっただけあって、{若者|わかもの}が{地方|ちほう}に{移|うつ}った。'], correct: 0, why: 'Bài luận → **～ことから、～と{考|かんが}えられる** (khách quan). もんだから là văn nói; ばかりに mang ý xấu, tiếc.' },
        { q: 'Tình huống: bạn được hỏi vì sao không đi nhậu với công ty tối nay.', options: ['すみません、{今日|きょう}は{子|こ}どもの{誕生日|たんじょうび}なものですから。', 'すみません、{今日|きょう}は{子|こ}どもの{誕生日|たんじょうび}であることから。', 'すみません、{今日|きょう}は{子|こ}どもの{誕生日|たんじょうび}だけあって。', 'すみません、{今日|きょう}は{子|こ}どもの{誕生日|たんじょうび}のばかりに。'], correct: 0, why: 'Từ chối nhẹ nhàng bằng lý do cá nhân → **Nなものですから**.' },
        { q: 'Tình huống: bạn ăn ở một tiệm sushi lâu đời và rất hài lòng. Bạn nói với bạn đi cùng:', options: ['さすが{百年|ひゃくねん}{続|つづ}く{老舗|しにせ}だけあって、ネタが{新鮮|しんせん}だね。', '{百年|ひゃくねん}{続|つづ}く{老舗|しにせ}のわりに、ネタが{新鮮|しんせん}だね。', '{百年|ひゃくねん}{続|つづ}く{老舗|しにせ}のせいで、ネタが{新鮮|しんせん}だね。', '{百年|ひゃくねん}{続|つづ}く{老舗|しにせ}ものだから、ネタが{新鮮|しんせん}だね。'], correct: 0, why: 'Khen đúng như mong đợi → **さすが～だけあって**.' },
        { q: 'Tình huống: bạn đã chờ một bộ phim cả năm nhưng phim dở.', options: ['{一年|いちねん}も{待|ま}っていただけに、がっかりした。', '{一年|いちねん}も{待|ま}っていただけあって、がっかりした。', '{一年|いちねん}も{待|ま}っていたおかげで、がっかりした。', '{一年|いちねん}も{待|ま}っていたことだから、がっかりした。'], correct: 0, why: 'Kỳ vọng lớn + thất vọng → **だけに**.' },
        { q: 'Tình huống: bạn giải thích với chủ nhà vì sao nộp tiền nhà chậm (bạn thật sự quên).', options: ['{申|もう}し{訳|わけ}ありません。うっかり{忘|わす}れていました。すぐにお{支払|しはら}いします。', 'うっかり{忘|わす}れたものですから、{待|ま}ってください。', '{忘|わす}れたことから、{遅|おく}れたと{考|かんが}えられます。', '{忘|わす}れただけあって、{遅|おく}れました。'], correct: 0, why: 'Lỗi do chính mình + làm phiền người khác → nhận lỗi thẳng là lịch sự nhất. ものですから + ～てください (mệnh lệnh) sai ngữ pháp; ことから nghe như báo cáo người ngoài.' },
        { q: 'Tình huống: hướng dẫn viên giải thích tên một món ăn.', options: ['{焼|や}く{時|とき}に「ジュー」という{音|おと}がすることから、この{名前|なまえ}が{付|つ}いたと{言|い}われています。', '{焼|や}く{時|とき}に{音|おと}がするばかりに、この{名前|なまえ}が{付|つ}いてしまいました。', '{焼|や}く{時|とき}に{音|おと}がするもんだから、この{名前|なまえ}なんだ。', '{焼|や}く{時|とき}に{音|おと}がするだけあって、この{名前|なまえ}です。'], correct: 0, why: 'Hướng dẫn viên, giải thích nguồn gốc tên → **～ことから、～と{言|い}われています**.' },
        { q: 'Tình huống: bạn kể với bạn bè vì sao mua chiếc đồng hồ đắt tiền dù không đủ tiền.', options: ['{見栄|みえ}を{張|は}りたいばかりに、ローンで{買|か}っちゃったんだ。', '{見栄|みえ}を{張|は}りたいおかげで、ローンで{買|か}っちゃったんだ。', '{見栄|みえ}を{張|は}りたいことから、ローンで{買|か}ったと{考|かんが}えられる。', '{見栄|みえ}を{張|は}りたいだけあって、ローンで{買|か}っちゃったんだ。'], correct: 0, why: '"Chỉ vì muốn…" mà làm điều quá mức → **Vたいばかりに**.' },
        { q: 'Tình huống: phát thanh viên báo tin tàu ngừng chạy.', options: ['{大雨|おおあめ}のため、{全線|ぜんせん}で{運転|うんてん}を{見合|みあ}わせています。', '{大雨|おおあめ}なものですから、{運転|うんてん}を{見合|みあ}わせています。', '{大雨|おおあめ}だっただけに、{運転|うんてん}を{見合|みあ}わせています。', '{大雨|おおあめ}が{降|ふ}ったばかりに、{運転|うんてん}を{見合|みあ}わせてしまいました。'], correct: 0, why: 'Bản tin, thông báo → **Nのため** (Bài 27). ものですから là lý do cá nhân; ばかりに mang cảm xúc tiếc.' },
      ]),
    },
  ],
};

const LT_5: Lesson = {
  id: 'b48-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp Bài 48 — 30 phút, 100 điểm (16 câu)',
  goal: 'Làm một đề mini đủ bốn phần như đề N2 (文字・語彙 · 文法 · 文の組み立て · 読解) trong 30 phút, chấm điểm và biết mình yếu phần nào để ôn lại.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm & thang điểm',
      items: [
        'Bấm giờ **30 phút**, làm hết rồi mới xem đáp án. Thang điểm: **I** 5 câu × 5 = 25 · **II** 5 câu × 6 = 30 · **III** 3 câu × 7 = 21 · **IV** 3 câu × 8 = 24. Tổng 100.',
        '**≥ 80**: vững Bài 48, sang Bài 49 · **60–79**: ôn lại mục bị sai (I → Từ vựng + Chữ Hán; II, III → Ngữ pháp ①–⑧; IV → Đọc) · **< 60**: học lại ba buổi trên lớp rồi làm lại đề này sau 2 ngày.',
      ],
    },
    { t: 'h', text: 'I. 文字・語彙 (5 câu)' },
    {
      t: 'mcq',
      id: 'b48-lt5-tu',
      title: 'I. Chữ Hán – từ vựng (5 câu × 5 điểm)',
      items: DOI([
        { q: '{事故|じこ}の**経緯**を{説明|せつめい}してください。', options: ['けいい', 'けいえい', 'きょうい', 'けいゆ'], correct: 0, why: '**{経緯|けいい}** — đầu đuôi sự việc.' },
        { q: '{夏|なつ}の**かいがん**は{人|ひと}でいっぱいだ。', options: ['海岸', '海丘', '海湾', '海願'], correct: 0, why: '**{海岸|かいがん}** — 岸 = 山 + 厂 + 干.' },
        { q: '{説明|せつめい}が{足|た}りないと、{誤解|ごかい}を（　）。', options: ['{招|まね}く', '{名付|なづ}ける', '{張|は}り{切|き}る', '{遭|あ}う'], correct: 0, why: '**{誤解|ごかい}を{招|まね}く** — cụm cố định.' },
        { q: '「{早|はや}とちり」に{近|ちか}い{意味|いみ}は？', options: ['よく{確|たし}かめずに{間違|まちが}えて{思|おも}い{込|こ}むこと', '{朝早|あさはや}く{出|で}かけること', '{走|はし}るのが{速|はや}いこと', '{仕事|しごと}を{早|はや}く{終|お}わらせること'], correct: 0, why: '**{早|はや}とちり** = vội hiểu nhầm.' },
        { q: '「{遭|あ}う」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{旅行中|りょこうちゅう}に{詐欺|さぎ}に{遭|あ}った。', '{駅|えき}で{友達|ともだち}に{遭|あ}った。', 'この{靴|くつ}は{足|あし}に{遭|あ}う。', '{先生|せんせい}に{遭|あ}いに{行|い}く。'], correct: 0, why: '**{遭|あ}う** chỉ dùng cho chuyện không may ({詐欺|さぎ}・{事故|じこ}・{雨|あめ}に{遭|あ}う). Gặp người → {会|あ}う; vừa vặn → {合|あ}う.' },
      ]),
    },
    { t: 'h', text: 'II. 文法形式の判断 (5 câu)' },
    {
      t: 'mcq',
      id: 'b48-lt5-np',
      title: 'II. Ngữ pháp (5 câu × 6 điểm)',
      items: DOI([
        { q: 'メールの{宛先|あてさき}を{一文字|ひともじ}{間違|まちが}えた（　）、{大切|たいせつ}な{資料|しりょう}が{届|とど}かなかった。', options: ['ばかりに', 'おかげで', 'だけあって', 'ことだから'], correct: 0, why: 'Sơ suất nhỏ + hậu quả xấu → **ばかりに**.' },
        { q: '{形|かたち}が{扇|おうぎ}に{似|に}ている（　）、この{湾|わん}は「{扇湾|おうぎわん}」と{呼|よ}ばれている。', options: ['ことから', 'ことだから', 'ものだから', 'ばかりに'], correct: 0, why: 'Nguồn gốc tên gọi → **ことから**.' },
        { q: '{負|ま}けず{嫌|ぎら}いな{兄|あに}の（　）、{次|つぎ}の{試合|しあい}では{必|かなら}ず{勝|か}とうとするだろう。', options: ['ことだから', 'ことから', 'わりに', 'ものの'], correct: 0, why: 'Nの + tính cách → **ことだから**.' },
        { q: '{初|はじ}めての{子|こ}どもだった（　）、{生|う}まれた{時|とき}の{喜|よろこ}びは{大|おお}きかった。', options: ['だけに', 'だけあって', 'わりに', 'ばかりに'], correct: 0, why: 'Điều kiện đặc biệt + cảm xúc mạnh → **だけに**. だけあって là khen một kết quả, không hợp với "niềm vui".' },
        { q: 'すみません、{道|みち}に{迷|まよ}った（　）、{遅|おく}くなりました。', options: ['ものですから', 'ものの', 'だけに', 'ことから'], correct: 0, why: 'Xin lỗi + lý do cá nhân → **ものですから**.' },
      ]),
    },
    { t: 'h', text: 'III. 文の組み立て ★ (3 câu)' },
    {
      t: 'mcq',
      id: 'b48-lt5-sao',
      title: 'III. Sắp xếp câu (3 câu × 7 điểm)',
      items: [
        { q: '★ {早|はや}く ＿＿ ＿＿ ★ ＿＿ 、{大切|たいせつ}な{確認|かくにん}を{忘|わす}れてしまった。（ばかりに／{帰|かえ}りたい／{仕事|しごと}を{終|お}わらせて／{家|いえ}に）', options: ['ばかりに', '{帰|かえ}りたい', '{仕事|しごと}を{終|お}わらせて', '{家|いえ}に'], correct: 1, why: 'Câu đúng: {早|はや}く **{仕事|しごと}を{終|お}わらせて {家|いえ}に {帰|かえ}りたい ばかりに**、… ★ (ô 3) = **{帰|かえ}りたい**.' },
        { q: '★ {窓|まど}の ＿＿ ★ ＿＿ ＿＿ 、{犯人|はんにん}は{外|そと}から{入|はい}ったと{考|かんが}えられる。（いた／ことから／かぎが／{壊|こわ}されて）', options: ['いた', 'ことから', 'かぎが', '{壊|こわ}されて'], correct: 3, why: 'Câu đúng: {窓|まど}の **かぎが {壊|こわ}されて いた ことから**、… ★ (ô 2) = **{壊|こわ}されて**.' },
        { q: '★ この{本|ほん}は ＿＿ ＿＿ ★ ＿＿ 。（{価値|かち}が／{何度|なんど}も{読|よ}む／ある／だけの）', options: ['{価値|かち}が', '{何度|なんど}も{読|よ}む', 'ある', 'だけの'], correct: 0, why: 'Câu đúng: この{本|ほん}は **{何度|なんど}も{読|よ}む だけの {価値|かち}が ある**. ★ (ô 3) = **{価値|かち}が**.' },
      ],
    },
    { t: 'h', text: 'IV. 読解（短文）(3 câu)' },
    {
      t: 'passage',
      title: '{商店街|しょうてんがい}の{掲示板|けいじばん}より',
      intro: 'Đọc thông báo dán ở bảng tin của một phố buôn bán, rồi trả lời 3 câu hỏi. (Tên phố, tên quán là minh hoạ.)',
      paras: [
        { text: '【「{錦坂|にしきざか}{商店街|しょうてんがい}」の{名前|なまえ}について】{当|とう}{商店街|しょうてんがい}の{名前|なまえ}は、{江戸時代|えどじだい}、この{坂|さか}に{着物|きもの}の{店|みせ}が{並|なら}び、{色|いろ}とりどりの{布|ぬの}が{錦|にしき}のように{見|み}えたことから{付|つ}けられたと{言|い}われています。{今|いま}では{着物|きもの}の{店|みせ}は{一軒|いっけん}だけになりましたが、{創業|そうぎょう}{百五十年|ひゃくごじゅうねん}のこの{店|みせ}は、{今|いま}も{昔|むかし}の{作|つく}り{方|かた}を{守|まも}り{続|つづ}けています。{来月|らいげつ}の「{坂|さか}まつり」では、{商店街|しょうてんがい}の{歴史|れきし}を{紹介|しょうかい}する{展示|てんじ}を{行|おこな}います。なお、{昨年|さくねん}のまつりでは、{案内|あんない}の{看板|かんばん}が{少|すく}なかったばかりに、{会場|かいじょう}が{分|わ}からないというお{問|と}い{合|あ}わせを{多|おお}くいただきました。{今年|ことし}は{坂|さか}の{上|うえ}と{下|した}に{案内所|あんないじょ}を{設|もう}けます。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b48-lt5-doc',
      title: 'IV. Đọc hiểu (3 câu × 8 điểm)',
      items: DOI([
        { q: '「{錦坂|にしきざか}」という{名前|なまえ}は、どうして{付|つ}けられたと{書|か}かれていますか。', options: ['{着物|きもの}の{店|みせ}の{布|ぬの}が、{錦|にしき}のように{美|うつく}しく{見|み}えたから', '{錦|にしき}という{名前|なまえ}の{人|ひと}が{坂|さか}を{作|つく}ったから', '{坂|さか}の{上|うえ}から{海|うみ}が{見|み}えたから', '{今|いま}も{着物|きもの}の{店|みせ}がたくさんあるから'], correct: 0, why: '**{色|いろ}とりどりの{布|ぬの}が{錦|にしき}のように{見|み}えたことから{付|つ}けられた** — vế trước ことから. Nay chỉ còn **一軒** (loại 4).' },
        { q: '{昨年|さくねん}のまつりで{問|と}い{合|あ}わせが{多|おお}かったのは、なぜですか。', options: ['{案内|あんない}の{看板|かんばん}が{少|すく}なかったから', '{着物|きもの}の{店|みせ}が{閉|し}まっていたから', '{展示|てんじ}がなかったから', '{雨|あめ}が{降|ふ}ったから'], correct: 0, why: '**{案内|あんない}の{看板|かんばん}が{少|すく}なかったばかりに** — ばかりに (tiếc nuối, rút kinh nghiệm).' },
        { q: '{今年|ことし}のまつりについて、{正|ただ}しいものはどれですか。', options: ['{坂|さか}の{上|うえ}と{下|した}に{案内所|あんないじょ}ができる。', '{着物|きもの}の{店|みせ}が{新|あたら}しく{開|ひら}く。', '{商店街|しょうてんがい}の{名前|なまえ}が{変|か}わる。', '{展示|てんじ}は{行|おこな}わない。'], correct: 0, why: '**{今年|ことし}は{坂|さか}の{上|うえ}と{下|した}に{案内所|あんないじょ}を{設|もう}けます**. Có **{展示|てんじ}を{行|おこな}います** (loại 4).' },
      ]),
    },
  ],
};

export const BAI_48: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
