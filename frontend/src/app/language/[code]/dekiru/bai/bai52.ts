/**
 * Bài 52 — レポート (Báo cáo, luận) · TIẾP SAU SÁCH, cấp N2 (xem ../SOAN-BAI.md mục 8). Bài thứ hai của chặng cuối N2 51–55
 * (Bài 50 = kiểm tra chặng 46–50 · Bài 55 = thi thử N2 — Bài 52 KHÔNG có mục kiểm tra chặng).
 * Người học đã xong Bài 1–15 (ポイント 1–124), Bài 16–25 (N4), Bài 26–40 (N3), Bài 41–49 (N2: ～際に・～に際して・～にあたって・
 * ～をきっかけに · ～に限らず・～をはじめ・～を問わず・～にかかわらず · ～からすると・～にしては・～わりに・～はともかく · ～あげく・～末に・
 * ～きり・～次第 · ～ざるを得ない・～ずにはいられない・～てたまらない · ～得る・～かねない・～かねる・～おそれがある · ～しかない・～ほかない・
 * ～からには・～以上は · ～ばかりに・～ことから・～だけに・～ものだから · ～一方で・～に伴って・～かと思うと・～や否や). Bài 50 (～に比べて・
 * ～に反して・～反面・～どころか + kiểm tra chặng) và Bài 51 (～さえ・～すら・～こそ・～ものがある・～ことか) soạn song song — KHÔNG dạy
 * các mẫu đó (chỉ nhắc một dòng khi cần phân biệt).
 *
 * Liên quan trực tiếp, KHÔNG dạy lại (chỉ "ôn: Bài X" + mở rộng / so sánh) — kiểm bằng grep 09/11/2026:
 *   · ～べきだ: Bài 32 ⑤ đã GIỚI THIỆU trong bảng "bốn cách nên" (ものだ・ことだ・べきだ・ほうがいい) và ghi "Bài 52 dạy kỹ"; Bài 35 có
 *     ～べきだった (bảng hối tiếc); Bài 41–49 dùng すべき／べきだ trong câu ⇒ ở đây ÔN rồi dạy CHÍNH THỨC đủ: すべき・べき＋N・べきではない・
 *     べきだった・Nであるべきだ・べきか + bảng với はずだ (Bài 20) · ものだ (Bài 32) · なければならない · ほうがいい · ことだ (Bài 32).
 *   · ～上で: Bài 29 ⑨ chỉ cho NHẬN RA ⇒ ở đây học chính thức (Vた上で／Nの上で · Vる上で／Nの上で · N上 · ～上では).
 *   · だ・である体: Bài 39 (要約), Bài 41/43/44 (bài luận) đã YÊU CẦU viết thể だ・である và cấm trộn です・ます, nhưng chưa có bảng chuyển
 *     đầy đủ ⇒ ở đây hệ thống hoá: bảng chuyển mọi loại câu + 中止形 (～であり・～く・～ず・～ており) + văn nói → văn viết.
 *   · ～ざるを得ない (Bài 45), ～しかない (Bài 47), ～によると (Bài 33), ～と述べている (Bài 38/39 — tóm tắt), 序論・本論・結論 (dàn ý bài
 *     luận Bài 42–50), ～に対して (Bài 28), ～にとって (Bài 30) — chỉ ôn trong bảng phân biệt.
 *   ～面で, ～点で (mẫu ngữ pháp), ～において, ～ねばならない: CHƯA dạy ở Bài 1–51 (において chỉ gặp một lần ở Bài 7) ⇒ học chính thức
 *   (において ở mức NHẬN RA + dùng trong văn viết, vì OUTLINE không ghi; ～ねばならぬ・～ねば・～べからず chỉ nhận ra).
 *
 * Ngữ pháp (N2) — nhóm "VĂN VIẾT HỌC THUẬT": ① Vた＋上で／Nの＋上で "sau khi (làm A cẩn thận) rồi mới B" · Vる＋上で／Nの＋上で "trong
 * việc / khi làm…" (+ N上 "về mặt", ～上では "theo / trên phương diện") · ② N（の）＋面で／～的な面で "về mặt" + bảng 面で ↔ 点で ↔ において ↔
 * 上(じょう) ↔ にとって ↔ について · ③ だ・である体 — bảng chuyển です／ます → である cho mọi loại câu (N, ナA, イA, V, phủ định, quá khứ,
 * ～のだ→～のである, ～だろう→～であろう, ～ましょう→～よう, ～と思う→～と考えられる) + 中止形 văn viết · ④ V辞書形＋べきだ／べきではない
 * (する→すべき) · べき＋N · べきだった · ⑤ Vない（bỏ ない）＋ねばならない (する→せねばならない) + ～ねば · ⑥ BẢNG 上で ↔ てから ↔ 後で ↔ 際に
 * ↔ ために ↔ には · ⑦ BẢNG べきだ ↔ はずだ ↔ ものだ ↔ なければならない ↔ ほうがいい ↔ ことだ · ⑧ BẢNG ねばならない ↔ なければならない ↔
 * ざるを得ない ↔ しかない ↔ べきだ.
 * Cấp JLPT của mẫu (theo các bảng tham khảo phổ biến — JLPT không công bố danh sách chính thức): ～上で N2; ～面で nhiều bảng không tách
 * thành mẫu riêng (xếp là từ vựng 面 — N2); ～べきだ N3 (đề N2 vẫn hỏi べきではない・すべき・べきだった); ～ねばならない N2 (một số bảng xếp N1);
 * だ・である体 là kiến thức văn viết (đề N2 phần đọc toàn văn である; phần viết luận ở trường đòi hỏi).
 *
 * TRỌNG TÂM BÀI: KỸ NĂNG VIẾT レポート — mục Viết (b52-viet) là mục nặng nhất: bố cục 序論・本論・結論 (+ 表紙・参考文献), từ nối văn viết
 * theo chức năng, cách trích dẫn (直接引用「」・間接引用 ～によると／～と述べている・出典 trong ngoặc + danh mục tài liệu), bảng văn nói → văn viết
 * (≥30 cặp), văn kết câu của レポート (～と考えられる・～と言える・～ではないだろうか・～が明らかになった…), bài mẫu レポート ~820 chữ, đề viết +
 * tiêu chí tự chấm.
 * ⚠ MỌI số liệu khảo sát, tên tài liệu, tên tác giả, năm xuất bản trong bài mẫu và bài đọc là MINH HOẠ do người soạn đặt ra (ghi rõ
 * 〔架空〕 ở danh mục tài liệu), KHÔNG phải trích dẫn thật — người học không được chép vào bài của mình như nguồn thật.
 *
 * Từ vựng: 66 từ (N2 là chính, từ N1 có ghi cấp), 5 nhóm: bố cục & soạn thảo · nghiên cứu & phương pháp · trích dẫn & lập luận · văn viết &
 * cách diễn đạt · báo cáo công việc & khía cạnh — kèm bảng TỪ DỄ NHẦM (類義語) và KẾT HỢP TỪ (コロケーション). Từ đã học ở Bài 1–51 KHÔNG lặp
 * (chỉ "ôn"): {論文|ろんぶん}・レポート・{講義|こうぎ}・{締|し}め{切|き}り (Bài 26), {結論|けつろん}・{根拠|こんきょ}・{主張|しゅちょう}・{述|の}べる・{示|しめ}す・{提案|ていあん}・{感想|かんそう}・{一般的|いっぱんてき} (Bài 28), {要点|ようてん}・{内容|ないよう} (Bài 30),
 * {分析|ぶんせき}・{引用|いんよう}・{統計|とうけい}・{回答者|かいとうしゃ}・{規模|きぼ} (Bài 33), {改善|かいぜん} (Bài 34), {指摘|してき}・{記入|きにゅう}・{部署|ぶしょ}・{新人|しんじん} (Bài 35), {定義|ていぎ}・{尊重|そんちょう} (Bài 36), {筆者|ひっしゃ}・{下記|かき}・{具体的|ぐたいてき}・{対策|たいさく}
 * (Bài 38), {視点|してん}・{観点|かんてん}・{客観的|きゃっかんてき}・{主観的|しゅかんてき} (Bài 43), {検討|けんとう}・{妥協|だきょう} (Bài 44), {仮説|かせつ}・{検証|けんしょう}・{推測|すいそく}・{裏付|うらづ}ける (Bài 48)…
 * Chữ Hán mới (24): 序 章 構 執 旨 範 括 欄 箇 冒 尾 典 唆 視 堅 潔 該 遍 唱 模 盤 版 倫 刊 — không trùng hanTu.ts, hanTu16–51.ts, hanTu53.ts,
 * hanTuTiep.ts, hanLop.ts và mọi bảng chữ Hán Bài 1–51, 53 (kiểm bằng script 09/11: 1.245 chữ đã dạy). Theo quyết định của người
 * điều phối: 底 và 是 thuộc Bài 51 (hanTu51) ⇒ ở đây chỉ "ôn: Bài 51" (徹底・到底・是非・是正 dùng được, không dạy lại); thay bằng 該 và 盤. Chữ "học thuật" đã dạy trước: 論 述 考 察 概 仮 証 拠 献 引 用 稿 筆 摘 析 検 討 査 項 示 載 掲 傾 ⇒ đọc được
 * 序論・考察・概要・出典・引用・執筆 không cần furigana. Thẻ chữ Hán: hanTu52.ts (HAN_TU_52).
 * Câu 読み không furigana (readkanji) chỉ dùng chữ đã dạy + chữ của bài này (kiểm bằng script). Romaji khớp furigana (kiểm bằng script).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe, bài mẫu: VIẾT MỚI 100%, không chép giáo trình / đề thi / sách hướng dẫn viết nào
 * (新完全マスター, 総まとめ, 公式問題集, sách レポートの書き方…). Dạng sai chỉ xuất hiện trong ghi chú "lỗi hay mắc" với ~~…~~.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木,
 * {佐藤先生|さとうせんせい} · nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, {小林店長|こばやしてんちょう}, {森課長|もりかちょう}, {田村|たむら}.
 * Nối tiếp Bài 41–49: リン (nữ, người Việt) và カルロス (nam) — sinh viên năm cuối {みなと大学|みなとだいがく}, đang viết {卒論|そつろん} ở ゼミ của cô
 * {佐藤先生|さとうせんせい} (nữ; đề tài của リン: "Sự thay đổi của địa điểm du lịch" — Bài 49) · ワン (nữ — đã vào さくらシステム), {鈴木|すずき} (nữ — chị
 * kèm ワン), {森課長|もりかちょう} (nam — trưởng phòng; công cụ dịch AI đang dùng thử từ Bài 49) · マリヤム (nữ) và ダニエル (nam) ở {国際寮|こくさいりょう}.
 * Người MỚI (chỉ ở phần nghe): {図書館|としょかん}の{職員|しょくいん} (nữ — nghe Bài 3, ja-nu), {先輩|せんぱい}の{山本|やまもと} (nam — nghe Bài 2, ja-nam),
 * ライティングセンターの{職員|しょくいん} (nam — nghe Bài 5, ja-nam). ナレーター (người dẫn đề) = ja-nu.
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
 * Câu trắc nghiệm: viết đáp án ĐÚNG trước rồi các đáp án nhiễu; hàm đặt đáp án đúng vào một vị trí
 * cố định suy từ nội dung câu hỏi (không ngẫu nhiên — tiến độ lưu theo câu không đổi), để đáp án đúng
 * không luôn nằm ở ô đầu.
 */
const MQ = (q: string, dung: string, sai: string[], why: string): Mcq => {
  let h = 7;
  for (const ch of q) h = (h * 31 + (ch.codePointAt(0) ?? 0)) % 100003;
  const k = h % (sai.length + 1);
  return { q, options: [...sai.slice(0, k), dung, ...sai.slice(k)], correct: k, why };
};

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b52-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — レポート: cô 佐藤 trả bản báo cáo giữa kỳ đầy vết đỏ cho リン, trưởng phòng 森 sửa bản báo cáo dùng thử công cụ AI của ワン, マリヤム nhờ ダニエル xem bài レポート "Sinh viên có nên đi làm thêm?"',
  goal: 'Hiểu và trả lời được lời nhận xét về bài viết theo từng mặt (内容の面では～、文体の面では～), nói thứ tự "làm A cẩn thận rồi mới B" bằng ～た上で (データを示した上で、考えを述べる) và điều quan trọng khi làm một việc bằng ～る上で (先行研究を読む上で大切なのは～); biết vì sao レポート phải viết thể だ・である và đổi được câu văn nói sang văn viết (すごく増えた → 大幅に増加した); ở công ty, nghe nhận xét báo cáo theo mặt (費用の面・安全面) và điểm (～という点), hiểu vì sao báo cáo công việc đặt kết luận lên đầu (結論は冒頭に書くべきだ); ở ký túc xá, bàn về chủ trương của bài luận bằng ～べきだ／べきではない, nhận ra ～ねばならない trong câu trích sách cũ và biết cách trích dẫn đúng (「」 + tên tác giả + năm xuất bản + ～と述べている).',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 52 — chủ đề: báo cáo, luận — viết như người làm nghiên cứu (cấp N2)',
      items: [
        'Năm cuối đại học, đi thực tập, vào công ty — đâu cũng phải **VIẾT**: {卒論|そつろん} (khoá luận), レポート môn học, {報告書|ほうこくしょ} (báo cáo công việc), {議事録|ぎじろく} (biên bản họp). Người Nhật đọc bài của bạn và **chấm cả văn phong**: lẫn một chữ "すごく" hay một câu "です" giữa bài "である" là bài bị đánh giá "chưa biết viết". Đề đọc N2 cũng viết toàn bằng **だ・である**, nên học văn viết = học đọc N2.',
        'Năm mẫu mới: **～{上|うえ}で** (sau khi… rồi mới / trong việc…) · **～{面|めん}で** (về mặt…) · **だ・である{体|たい}** (thể văn viết) · **～べきだ／べきではない** (nên / không nên — ý kiến, đạo lý) · **～ねばならない** (phải — văn viết, cổ). Ôn kèm: **～べきだ** (Bài 32 — giới thiệu), **～ざるを{得|え}ない** (Bài 45), **～しかない** (Bài 47), **～によると** (Bài 33), **{序論|じょろん}・{本論|ほんろん}・{結論|けつろん}** (dàn ý bài luận Bài 42–50).',
        'Ba tình huống: ① **ゼミ室**: cô **{佐藤|さとう}** trả bản báo cáo giữa kỳ (中間レポート) của **リン** — nội dung tốt, văn phong lẫn văn nói; **カルロス** hỏi cách đọc nghiên cứu đi trước · ② **さくらシステム**: **{森課長|もりかちょう}** nhận xét bản báo cáo dùng thử công cụ dịch AI của **ワン**; chị **{鈴木|すずき}** chỉ cách viết báo cáo công việc · ③ **{国際寮|こくさいりょう}**: **マリヤム** nhờ **ダニエル** xem bài レポート "Sinh viên có nên đi làm thêm?" — cách trích dẫn một cuốn sách cũ.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe. Cấp N2: **nghe hai lần không nhìn chữ** — lần 1 nắm "ai sửa gì cho ai, vì sao", lần 2 bắt từng mẫu ngữ pháp — rồi mới đọc phân vai. Để ý: hội thoại là **văn nói**, nhưng các nhân vật đang **bàn về văn viết** — chỗ nào họ đọc to câu trong bài viết, chỗ đó là văn viết.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 52 bạn làm được (できる)',
      items: [
        '**① レポートの{指導|しどう}を{受|う}ける** — nghe nhận xét theo mặt: **{内容|ないよう}の{面|めん}では、よく{書|か}けている** · **{問題|もんだい}は{文体|ぶんたい}の{面|めん}だ** · hiểu yêu cầu: **データを{示|しめ}した{上|うえ}で、{考|かんが}えを{述|の}べる** · hỏi cách làm: **{先行研究|せんこうけんきゅう}を{読|よ}む{上|うえ}で、{気|き}をつけることは？** · tự sửa câu: **すごく{増|ふ}えた → {大幅|おおはば}に{増加|ぞうか}した** · nhận ra: **{出典|しゅってん}は{必|かなら}ず{書|か}かねばならない**.',
        '**② {報告書|ほうこくしょ}を{書|か}き{直|なお}す** — **{費用|ひよう}の{面|めん}と{安全面|あんぜんめん}の{記述|きじゅつ}が{足|た}りない** · **{作業時間|さぎょうじかん}が{三割|さんわり}{減|へ}ったという{点|てん}** · **{導入|どうにゅう}を{判断|はんだん}する{上|うえ}で、{一番|いちばん}{大事|だいじ}なところ** · **システム{部|ぶ}に{確認|かくにん}した{上|うえ}で、{書|か}き{加|くわ}えます** · **{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきだ**.',
        '**③ {意見|いけん}を{書|か}く・{引用|いんよう}する** — **{大学生|だいがくせい}はアルバイトをすべきか** · **「すべきではない」と{言|い}い{切|き}るより** · **{学業|がくぎょう}に{影響|えいきょう}が{出|で}ない{範囲|はんい}で{働|はたら}くべきだ** · trích: **「{学生|がくせい}はまず{学|まな}ばねばならない」と{述|の}べている** · **{経済的|けいざいてき}な{面|めん}と{学業|がくぎょう}の{面|めん}から{考|かんが}えた{上|うえ}で、{結論|けつろん}を{出|だ}す**.',
        '**できる！** — nhận xét một bài viết theo **từng mặt** (nội dung · văn phong · cấu trúc · trích dẫn); đổi một đoạn văn nói sang **だ・である**; trình bày 1 phút **"Cách tôi viết một bản báo cáo"**; viết **một bản レポート 800–1.200 chữ** có 序論・本論・結論, có số liệu, có trích dẫn đúng cách và danh mục tài liệu.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — muốn nói / viết gì, dùng mẫu nào',
      head: ['Bạn muốn…', 'Câu then chốt', 'Romaji', 'Mục'],
      rows: [
        ['Nói thứ tự: làm A cẩn thận XONG rồi mới B', '{両親|りょうしん}と{相談|そうだん}した{上|うえ}で、{決|き}めます。', 'Ryoushin to soudan shita ue de, kimemasu.', '① た上で'],
        ['Nói điều quan trọng / cần thiết KHI làm một việc', '{日本|にほん}で{働|はたら}く{上|うえ}で、{敬語|けいご}は{欠|か}かせない。', 'Nihon de hataraku ue de, keigo wa kakasenai.', '① る上で'],
        ['Đánh giá theo từng MẶT', '{費用|ひよう}の{面|めん}では{問題|もんだい}ないが、{安全面|あんぜんめん}に{不安|ふあん}がある。', 'Hiyou no men de wa mondai nai ga, anzenmen ni fuan ga aru.', '② 面で'],
        ['Viết câu văn viết (thể thường trang trọng)', 'この{結果|けっか}は{予想外|よそうがい}であった。', 'Kono kekka wa yosougai de atta.', '③ である'],
        ['Nêu ý kiến / chủ trương mạnh', '{大学|だいがく}はもっと{留学生|りゅうがくせい}を{支援|しえん}すべきだ。', 'Daigaku wa motto ryuugakusei o shien subeki da.', '④ べきだ'],
        ['Nói "không nên"', '{他人|たにん}の{文章|ぶんしょう}をそのまま{使|つか}うべきではない。', 'Tanin no bunshou o sono mama tsukau beki de wa nai.', '④ べきではない'],
        ['Nói "phải" trong văn viết trang trọng, cổ', '{我々|われわれ}はこの{問題|もんだい}を{真剣|しんけん}に{考|かんが}えねばならない。', 'Wareware wa kono mondai o shinken ni kangaeneba naranai.', '⑤ ねばならない'],
      ],
    },

    /* ── ① 中間レポートの赤ペン ── */
    { t: 'h', text: '① {中間|ちゅうかん}レポートの{赤|あか}ペン — "データを{示|しめ}した{上|うえ}で、{自分|じぶん}の{考|かんが}えを{述|の}べてください"' },
    {
      t: 'canh',
      anh: ['woman-teacher', 'page-facing-up', 'woman-student', 'man-student'],
      caption: 'Phòng ゼミ của cô 佐藤 ở みなと大学, chiều thứ Năm. Cô trả lại cho リン bản báo cáo giữa kỳ của khoá luận — trang nào cũng có nét bút đỏ. カルロス ngồi bàn bên cạnh, đang chờ tới lượt mình.',
    },
    {
      t: 'p',
      text: 'Tình huống: cô **{佐藤|さとう}** (nữ) nhận xét bản báo cáo giữa kỳ của **リン** (nữ) theo **từng mặt** — nội dung (**{内容|ないよう}の{面|めん}**) tốt, văn phong (**{文体|ぶんたい}の{面|めん}**) có vấn đề (mục ② ～面で). Cô giải thích vì sao レポート phải viết **だ・である{体|たい}** (mục ③) và **không nên trộn hai văn phong** (**～べきではありません** — mục ④). Hai yêu cầu sửa của cô dùng **～た{上|うえ}で** (làm A rồi mới B) và câu hỏi của **カルロス** (nam) dùng **～る{上|うえ}で** (khi làm việc gì thì…) — mục ①. Cuối đoạn cô buột miệng dùng **～ねばならない** (mục ⑤) và tự nhận là "cách nói hơi cũ". Thầy/cô ↔ sinh viên: hai bên đều nói **です・ます**.',
    },
    DL('Phòng ゼミ — "Nội dung thì tốt, nhưng về mặt văn phong…"', [
      ['{佐藤先生|さとうせんせい}', 'c', 'リンさん、{中間|ちゅうかん}レポート、{読|よ}みましたよ。{内容|ないよう}の{面|めん}では、とてもよく{書|か}けています。', 'Rin-san, chuukan repooto, yomimashita yo. Naiyou no men de wa, totemo yoku kakete imasu.', 'Lin này, cô đọc bản báo cáo giữa kỳ rồi. Về mặt nội dung, em viết rất tốt.'],
      ['リン', 'a', 'ありがとうございます。でも……{赤|あか}い{線|せん}がたくさんありますね。', 'Arigatou gozaimasu. Demo…… akai sen ga takusan arimasu ne.', 'Em cảm ơn cô. Nhưng… nhiều gạch đỏ quá ạ.'],
      ['{佐藤先生|さとうせんせい}', 'c', 'ええ。{問題|もんだい}は{文体|ぶんたい}の{面|めん}です。「すごく」や「でも」……{話|はな}し{言葉|ことば}がかなり{混|ま}じっていますね。', 'Ee. Mondai wa buntai no men desu. "Sugoku" ya "demo"…… hanashikotoba ga kanari majitte imasu ne.', 'Ừ. Vấn đề nằm ở mặt văn phong. Nào "sugoku", nào "demo"… văn nói lẫn vào khá nhiều.'],
      ['リン', 'a', 'あ……。です・ますのほうが{丁寧|ていねい}かと{思|おも}って、{途中|とちゅう}まではそう{書|か}いたんですが……。', 'A……. Desu masu no hou ga teinei ka to omotte, tochuu made wa sou kaita n desu ga…….', 'À… Em nghĩ thể です・ます lịch sự hơn nên viết như thế được nửa bài thì…'],
      ['{佐藤先生|さとうせんせい}', 'c', 'レポートや{論文|ろんぶん}は、だ・である{体|たい}で{書|か}くのが{基本|きほん}です。それに、{一|ひと}つの{文章|ぶんしょう}の{中|なか}で{二|ふた}つの{文体|ぶんたい}を{混|ま}ぜるべきではありません。', 'Repooto ya ronbun wa, da de aru tai de kaku no ga kihon desu. Sore ni, hitotsu no bunshou no naka de futatsu no buntai o mazeru beki de wa arimasen.', 'Báo cáo hay luận văn thì cơ bản là viết thể だ・である. Hơn nữa, không nên trộn hai văn phong trong cùng một bài.'],
      ['リン', 'a', 'はい。じゃあ、「{観光客|かんこうきゃく}がすごく{増|ふ}えた」は、「{観光客|かんこうきゃく}が{大幅|おおはば}に{増加|ぞうか}した」……ですね。', 'Hai. Jaa, "kankoukyaku ga sugoku fueta" wa, "kankoukyaku ga oohaba ni zouka shita"…… desu ne.', 'Vâng ạ. Vậy câu "khách du lịch tăng ghê lắm" sẽ thành "khách du lịch đã tăng mạnh"… phải không ạ.'],
      ['{佐藤先生|さとうせんせい}', 'c', 'そのとおり。それから{第二章|だいにしょう}ですが、{自分|じぶん}の{感想|かんそう}ばかりで、{根拠|こんきょ}が{見|み}えません。データを{示|しめ}した{上|うえ}で、{自分|じぶん}の{考|かんが}えを{述|の}べてください。', 'Sono toori. Sore kara dai nishou desu ga, jibun no kansou bakari de, konkyo ga miemasen. Deeta o shimeshita ue de, jibun no kangae o nobete kudasai.', 'Đúng vậy. Còn chương hai thì toàn cảm tưởng của em, không thấy căn cứ đâu. Em đưa số liệu ra trước rồi hãy trình bày ý kiến của mình.'],
      ['リン', 'a', 'わかりました。{先行研究|せんこうけんきゅう}も、もう{少|すこ}し{読|よ}んだ{上|うえ}で{書|か}き{直|なお}します。', 'Wakarimashita. Senkou kenkyuu mo, mou sukoshi yonda ue de kakinaoshimasu.', 'Em hiểu rồi ạ. Em sẽ đọc thêm các nghiên cứu trước rồi mới viết lại.'],
      ['カルロス', 'b', '{先生|せんせい}、{先行研究|せんこうけんきゅう}を{読|よ}む{上|うえ}で、{気|き}をつけることはありますか。{僕|ぼく}はいつも、{読|よ}むだけで{終|お}わってしまうんです。', 'Sensei, senkou kenkyuu o yomu ue de, ki o tsukeru koto wa arimasu ka. Boku wa itsumo, yomu dake de owatte shimau n desu.', 'Thưa cô, khi đọc nghiên cứu đi trước thì có gì cần chú ý không ạ? Em lúc nào cũng chỉ đọc xong là hết.'],
      ['{佐藤先生|さとうせんせい}', 'c', '{大切|たいせつ}なのは、{自分|じぶん}の{研究|けんきゅう}とどこが{同|おな}じで、どこが{違|ちが}うかを{考|かんが}えながら{読|よ}むことです。それから、{引用|いんよう}するなら、{出典|しゅってん}は{必|かなら}ず{書|か}かねばなりません。……ちょっと{古|ふる}い{言|い}い{方|かた}でしたね。', 'Taisetsu na no wa, jibun no kenkyuu to doko ga onaji de, doko ga chigau ka o kangaenagara yomu koto desu. Sore kara, in\'you suru nara, shutten wa kanarazu kakaneba narimasen. …… Chotto furui iikata deshita ne.', 'Điều quan trọng là vừa đọc vừa nghĩ xem chỗ nào giống, chỗ nào khác với nghiên cứu của mình. Còn nữa, đã trích dẫn thì nhất thiết phải ghi nguồn. … Cô vừa dùng một cách nói hơi cũ nhỉ.'],
      ['カルロス', 'b', '「{書|か}かねばなりません」は、「{書|か}かなければなりません」と{同|おな}じ{意味|いみ}ですか。', '"Kakaneba narimasen" wa, "kakanakereba narimasen" to onaji imi desu ka.', '"Kakaneba narimasen" có cùng nghĩa với "kakanakereba narimasen" không ạ?'],
      ['{佐藤先生|さとうせんせい}', 'c', 'ええ、{意味|いみ}は{同|おな}じです。{書|か}き{言葉|ことば}で、{少|すこ}し{古|ふる}くて{堅|かた}い{言|い}い{方|かた}ですね。{新聞|しんぶん}の{社説|しゃせつ}や{演説|えんぜつ}では、{今|いま}でもよく{見|み}かけますよ。', 'Ee, imi wa onaji desu. Kakikotoba de, sukoshi furukute katai iikata desu ne. Shinbun no shasetsu ya enzetsu de wa, ima demo yoku mikakemasu yo.', 'Ừ, nghĩa giống nhau. Đó là văn viết, cách nói hơi cũ và cứng. Trong xã luận báo hay bài diễn văn thì giờ vẫn hay gặp.'],
      ['リン', 'a', 'じゃあ、{私|わたし}たちのレポートなら、「なければならない」で{十分|じゅうぶん}ですね。', 'Jaa, watashitachi no repooto nara, "nakereba naranai" de juubun desu ne.', 'Vậy với bài báo cáo của tụi em thì dùng "nakereba naranai" là đủ cô nhỉ.'],
      ['{佐藤先生|さとうせんせい}', 'c', 'そうですね。では、{全体|ぜんたい}の{構成|こうせい}を{見直|みなお}した{上|うえ}で、{来週|らいしゅう}の{金曜日|きんようび}までにもう{一度|いちど}{出|だ}してください。', 'Sou desu ne. De wa, zentai no kousei o minaoshita ue de, raishuu no kin\'youbi made ni mou ichido dashite kudasai.', 'Đúng vậy. Thế thì em xem lại bố cục toàn bài rồi nộp lại cho cô trước thứ Sáu tuần sau nhé.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{内容|ないよう}の{面|めん}では、とてもよく{書|か}けている。', 'Naiyou no men de wa, totemo yoku kakete iru.', 'Về mặt nội dung, viết rất tốt. (② 面で)'),
        E('{一|ひと}つの{文章|ぶんしょう}の{中|なか}で、{二|ふた}つの{文体|ぶんたい}を{混|ま}ぜるべきではない。', 'Hitotsu no bunshou no naka de, futatsu no buntai o mazeru beki de wa nai.', 'Không nên trộn hai văn phong trong cùng một bài. (④ べきではない)'),
        E('データを{示|しめ}した{上|うえ}で、{自分|じぶん}の{考|かんが}えを{述|の}べる。', 'Deeta o shimeshita ue de, jibun no kangae o noberu.', 'Đưa số liệu ra trước, rồi mới trình bày ý kiến của mình. (① た上で)'),
        E('{先行研究|せんこうけんきゅう}を{読|よ}む{上|うえ}で{大切|たいせつ}なのは、{自分|じぶん}の{研究|けんきゅう}との{違|ちが}いを{考|かんが}えることだ。', 'Senkou kenkyuu o yomu ue de taisetsu na no wa, jibun no kenkyuu to no chigai o kangaeru koto da.', 'Điều quan trọng khi đọc nghiên cứu đi trước là nghĩ về chỗ khác với nghiên cứu của mình. (① る上で)'),
        E('{観光客|かんこうきゃく}が{大幅|おおはば}に{増加|ぞうか}した。', 'Kankoukyaku ga oohaba ni zouka shita.', 'Khách du lịch đã tăng mạnh. (③ văn viết — thay cho すごく増えた)'),
        E('{引用|いんよう}するなら、{出典|しゅってん}は{必|かなら}ず{書|か}かねばならない。', 'In\'you suru nara, shutten wa kanarazu kakaneba naranai.', 'Đã trích dẫn thì nhất thiết phải ghi nguồn. (⑤ ねばならない — văn viết, cổ)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**{内容|ないよう}の{面|めん}では～。{問題|もんだい}は{文体|ぶんたい}の{面|めん}です** — **N の{面|めん}で（は）** = "**về mặt** N". Cô 佐藤 chia bài nhận xét thành **hai mặt** (nội dung tốt / văn phong có vấn đề) — đây là cách nhận xét rất "Nhật": khen một mặt trước, rồi mới nói mặt cần sửa. **は** sau 面で để **đối chiếu** hai mặt.',
        '**だ・である{体|たい}** (cũng gọi **である{調|ちょう}／{常体|じょうたい}**) — thể văn viết dùng cho レポート, {論文|ろんぶん}, báo, sách. Không phải "thô lỗ" — đó là văn **khách quan, trung tính**, không hướng tới một người nghe cụ thể. **です・ます{体|たい}** (**{敬体|けいたい}**) dùng cho thư, email, bài phát biểu, văn bản gửi người đọc cụ thể. Hai thể **không được trộn** trong một bài.',
        '**データを{示|しめ}した{上|うえ}で、{考|かんが}えを{述|の}べてください** — **Vた ＋ {上|うえ}で**: "**làm A (cẩn thận, đầy đủ) RỒI MỚI làm B**". A là **bước bắt buộc phải có trước**. Câu cuối của cô (**{構成|こうせい}を{見直|みなお}した{上|うえ}で、～{出|だ}してください**) cũng vậy. Khác **～てから** (chỉ thứ tự thời gian) ở chỗ: た上で nhấn **"A là điều kiện cần cho B"**, giọng trang trọng.',
        '**{先行研究|せんこうけんきゅう}を{読|よ}む{上|うえ}で、{気|き}をつけること** — **Vる ＋ {上|うえ}で**: "**trong việc / khi** làm V thì…" — vế sau là **điều quan trọng, cần thiết, cần chú ý, có ích** ({大切|たいせつ}だ・{必要|ひつよう}だ・{気|き}をつける・{役|やく}に{立|た}つ). Hai nghĩa của 上で phân biệt bằng **thể động từ đứng trước**: **た** → "rồi mới", **る** → "khi làm".',
        '**{書|か}かねばなりません** — **{書|か}か（thể ない bỏ ない）＋ ねばならない** = **{書|か}かなければならない**. Văn viết, cổ, cứng — đúng như cô nói: gặp trong **{社説|しゃせつ}** (xã luận), **{演説|えんぜつ}** (diễn văn), sách cũ. **{感想|かんそう}ばかりで、{根拠|こんきょ}が{見|み}えない** — lời phê "kinh điển" của giảng viên Nhật: レポート ≠ {感想文|かんそうぶん} (bài cảm tưởng).',
      ],
    },

    /* ── ② 報告書は結論から ── */
    { t: 'h', text: '② {報告書|ほうこくしょ}は{結論|けつろん}から — "{費用|ひよう}の{面|めん}と{安全面|あんぜんめん}の{記述|きじゅつ}が{足|た}りません"' },
    {
      t: 'canh',
      anh: ['man-office-worker', 'page-facing-up', 'woman-office-worker', 'laptop'],
      caption: 'Phòng phát triển công ty さくらシステム, sáng thứ Ba. Công cụ dịch AI (Bài 49) đã được dùng thử một tháng. ワン nộp bản báo cáo kết quả dùng thử; 森課長 đọc xong, gọi ワン lại bàn mình. Chị 鈴木 ngồi bàn bên.',
    },
    {
      t: 'p',
      text: 'Tình huống: **{森課長|もりかちょう}** (nam) nhận xét bản **{報告書|ほうこくしょ}** của **ワン** (nữ) theo từng mặt — **{効果|こうか}の{面|めん}** (hiệu quả) tốt, **{費用|ひよう}の{面|めん}・{安全面|あんぜんめん}** (chi phí, an toàn) còn thiếu; khen một **{点|てん}** cụ thể (～という{点|てん}) — so sánh **面** (mặt rộng) ↔ **点** (điểm cụ thể) ở mục ②. Anh dùng **～る{上|うえ}で** (導入を判断する上で) và yêu cầu **結論は冒頭に書くべきだ** (mục ④). ワン hứa **～た{上|うえ}で** (確認した上で). Sau đó chị **{鈴木|すずき}** (nữ) giải thích **báo cáo công việc khác レポート ở trường** thế nào và quy định văn phong của phòng (**だ・である{体|たい}** — mục ③). Cấp trên ↔ nhân viên: です・ます; chị 鈴木 thân với ワン nên nói thể thường.',
    },
    DL('Phòng phát triển — "Kết luận thì nên viết ngay phần đầu"', [
      ['{森課長|もりかちょう}', 'b', 'ワンさん、AI{翻訳|ほんやく}ツールの{試験導入|しけんどうにゅう}の{報告書|ほうこくしょ}、{読|よ}みました。', 'Wan-san, eeai hon\'yaku tsuuru no shiken dounyuu no houkokusho, yomimashita.', 'Wang, tôi đọc bản báo cáo dùng thử công cụ dịch AI rồi.'],
      ['ワン', 'a', 'ありがとうございます。いかがでしたか。', 'Arigatou gozaimasu. Ikaga deshita ka.', 'Em cảm ơn anh. Anh thấy thế nào ạ?'],
      ['{森課長|もりかちょう}', 'b', '{効果|こうか}の{面|めん}では、よくまとまっています。{翻訳|ほんやく}の{作業時間|さぎょうじかん}が{三割|さんわり}{減|へ}ったという{点|てん}は、{部長|ぶちょう}にもアピールできますね。', 'Kouka no men de wa, yoku matomatte imasu. Hon\'yaku no sagyou jikan ga sanwari hetta to iu ten wa, buchou ni mo apiiru dekimasu ne.', 'Về mặt hiệu quả thì tổng hợp tốt. Điểm thời gian dịch giảm được ba mươi phần trăm thì có thể trình cả trưởng ban đấy.'],
      ['{森課長|もりかちょう}', 'b', 'ただ、{費用|ひよう}の{面|めん}と{安全面|あんぜんめん}の{記述|きじゅつ}が{足|た}りません。', 'Tada, hiyou no men to anzenmen no kijutsu ga tarimasen.', 'Có điều, phần viết về mặt chi phí và mặt an toàn còn thiếu.'],
      ['ワン', 'a', '{安全面|あんぜんめん}、ですか。', 'Anzenmen, desu ka.', 'Mặt an toàn ạ?'],
      ['{森課長|もりかちょう}', 'b', 'ええ。お{客様|きゃくさま}の{文書|ぶんしょ}を{外部|がいぶ}のサービスに{入|い}れるわけですから、{情報管理|じょうほうかんり}の{面|めん}で{問題|もんだい}がないか、{必|かなら}ず{書|か}いてください。{導入|どうにゅう}を{判断|はんだん}する{上|うえ}で、{一番|いちばん}{大事|だいじ}なところです。', 'Ee. Okyakusama no bunsho o gaibu no saabisu ni ireru wake desu kara, jouhou kanri no men de mondai ga nai ka, kanarazu kaite kudasai. Dounyuu o handan suru ue de, ichiban daiji na tokoro desu.', 'Ừ. Mình đưa tài liệu của khách hàng vào một dịch vụ bên ngoài mà, nên em nhất định phải viết là về mặt quản lý thông tin có vấn đề gì không. Đó là chỗ quan trọng nhất khi quyết định có đưa vào dùng hay không.'],
      ['ワン', 'a', 'わかりました。システム{部|ぶ}に{確認|かくにん}した{上|うえ}で、{書|か}き{加|くわ}えます。', 'Wakarimashita. Shisutemubu ni kakunin shita ue de, kakikuwaemasu.', 'Em hiểu rồi ạ. Em sẽ hỏi lại phòng hệ thống rồi viết bổ sung.'],
      ['{森課長|もりかちょう}', 'b', 'それから、{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきです。{忙|いそが}しい{人|ひと}は、{最初|さいしょ}の{数行|すうぎょう}しか{読|よ}みませんから。……じゃ、{会議|かいぎ}に{行|い}ってきます。', 'Sore kara, ketsuron wa boutou ni kaku beki desu. Isogashii hito wa, saisho no suugyou shika yomimasen kara. …… Ja, kaigi ni itte kimasu.', 'Còn nữa, kết luận thì nên viết ngay phần đầu. Người bận chỉ đọc vài dòng đầu thôi. … Thôi, tôi đi họp đây.'],
      ['{鈴木|すずき}', 'c', '{課長|かちょう}、{報告書|ほうこくしょ}には{厳|きび}しいのよ。{私|わたし}も{新人|しんじん}の{頃|ころ}は、{何度|なんど}も{書|か}き{直|なお}したわ。', 'Kachou, houkokusho ni wa kibishii no yo. Watashi mo shinjin no koro wa, nando mo kakinaoshita wa.', 'Trưởng phòng khó tính với báo cáo lắm đấy. Hồi mới vào chị cũng phải viết lại không biết bao nhiêu lần.'],
      ['ワン', 'a', '{大学|だいがく}のレポートとは、{書|か}き{方|かた}が{違|ちが}うんですね。レポートは、{序論|じょろん}から{順番|じゅんばん}に{書|か}きましたから。', 'Daigaku no repooto to wa, kakikata ga chigau n desu ne. Repooto wa, joron kara junban ni kakimashita kara.', 'Cách viết khác với báo cáo ở đại học chị nhỉ. Báo cáo ở trường thì em viết theo thứ tự từ phần mở đầu mà.'],
      ['{鈴木|すずき}', 'c', 'そうね。{報告書|ほうこくしょ}は{結論|けつろん}が{先|さき}。それと、うちの{部署|ぶしょ}では、{報告書|ほうこくしょ}はだ・である{体|たい}で{書|か}くことになってるの。です・ますと{混|ま}ぜないようにね。', 'Sou ne. Houkokusho wa ketsuron ga saki. Sore to, uchi no busho de wa, houkokusho wa da de aru tai de kaku koto ni natteru no. Desu masu to mazenai you ni ne.', 'Ừ. Báo cáo công việc thì kết luận đi trước. Với lại, phòng mình quy định báo cáo viết thể だ・である. Em đừng trộn với です・ます nhé.'],
      ['ワン', 'a', 'はい。「〜と{思|おも}います」も、「〜と{考|かんが}えられる」に{直|なお}します。', 'Hai. "~to omoimasu" mo, "~to kangaerareru" ni naoshimasu.', 'Vâng. Em sẽ sửa cả "~to omoimasu" thành "~to kangaerareru".'],
      ['{鈴木|すずき}', 'c', 'いいわね。あと、{長|なが}い{文|ぶん}は{箇条書|かじょうが}きにすると、ぐっと{読|よ}みやすくなるわよ。{仕事|しごと}を{進|すす}める{上|うえ}で、{読|よ}む{人|ひと}の{時間|じかん}を{大切|たいせつ}にするのも{大事|だいじ}なことだから。', 'Ii wa ne. Ato, nagai bun wa kajougaki ni suru to, gutto yomiyasuku naru wa yo. Shigoto o susumeru ue de, yomu hito no jikan o taisetsu ni suru no mo daiji na koto da kara.', 'Được đấy. Còn nữa, câu dài mà chuyển thành gạch đầu dòng thì dễ đọc hơn hẳn. Vì khi làm việc, trân trọng thời gian của người đọc cũng là điều quan trọng.'],
      ['ワン', 'a', '{勉強|べんきょう}になります。{今日中|きょうじゅう}に{直|なお}して、もう{一度|いちど}{課長|かちょう}に{出|だ}します。', 'Benkyou ni narimasu. Kyoujuu ni naoshite, mou ichido kachou ni dashimasu.', 'Em học được nhiều quá. Em sẽ sửa trong hôm nay rồi nộp lại cho trưởng phòng.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{効果|こうか}の{面|めん}では、よくまとまっています。', 'Kouka no men de wa, yoku matomatte imasu.', 'Về mặt hiệu quả thì tổng hợp tốt. (② 面で)'),
        E('{作業時間|さぎょうじかん}が{三割|さんわり}{減|へ}ったという{点|てん}は{評価|ひょうか}できる。', 'Sagyou jikan ga sanwari hetta to iu ten wa hyouka dekiru.', 'Điểm thời gian làm việc giảm 30% thì đáng ghi nhận. (② ～という点 — điểm cụ thể)'),
        E('{導入|どうにゅう}を{判断|はんだん}する{上|うえ}で、{一番|いちばん}{大事|だいじ}なところです。', 'Dounyuu o handan suru ue de, ichiban daiji na tokoro desu.', 'Đó là chỗ quan trọng nhất khi quyết định có đưa vào dùng hay không. (① る上で)'),
        E('システム{部|ぶ}に{確認|かくにん}した{上|うえ}で、{書|か}き{加|くわ}えます。', 'Shisutemubu ni kakunin shita ue de, kakikuwaemasu.', 'Em hỏi lại phòng hệ thống rồi mới viết bổ sung. (① た上で)'),
        E('{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきだ。', 'Ketsuron wa boutou ni kaku beki da.', 'Kết luận nên viết ở phần đầu. (④ べきだ)'),
        E('{長|なが}い{文|ぶん}は{箇条書|かじょうが}きにすると{読|よ}みやすくなる。', 'Nagai bun wa kajougaki ni suru to yomiyasuku naru.', 'Câu dài chuyển thành gạch đầu dòng thì dễ đọc hơn. (từ vựng nhóm A)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**{効果|こうか}の{面|めん}では～。{費用|ひよう}の{面|めん}と{安全面|あんぜんめん}の～** — 面 gắn được theo hai cách: **N ＋ の ＋ {面|めん}** ({費用|ひよう}の{面|めん}) hoặc **dính liền thành từ ghép** ({安全面|あんぜんめん}・{精神面|せいしんめん}・{経済面|けいざいめん}・{健康面|けんこうめん} — đọc **めん**). Nghĩa như nhau; từ ghép ngắn gọn hơn, hay dùng trong văn bản công việc.',
        '**{作業時間|さぎょうじかん}が{三割|さんわり}{減|へ}ったという{点|てん}** — **{点|てん}** = một **điểm cụ thể** (một kết quả, một đặc điểm), thường đứng sau **mệnh đề ＋ という**. **{面|めん}** = một **mặt rộng** (chi phí, an toàn, tinh thần). Mẹo: hỏi "**cái gì cụ thể?**" — trả lời được bằng một câu → 点; chỉ là một lĩnh vực → 面.',
        '**{導入|どうにゅう}を{判断|はんだん}する{上|うえ}で、{一番|いちばん}{大事|だいじ}な～** — る上で + **đánh giá** (大事だ). **{確認|かくにん}した{上|うえ}で、{書|か}き{加|くわ}えます** — た上で + **hành động có chủ ý** của chính người nói. Một hội thoại — hai nghĩa của 上で.',
        '**{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきです** — trưởng phòng dùng **べきです** (không phải ～てください): đây là **nguyên tắc, chủ trương** viết báo cáo, không chỉ là một lời nhờ. **Báo cáo công việc**: **kết luận TRƯỚC** (結論 → 理由 → 詳細); **レポート ở trường**: 序論 → 本論 → 結論. Cả hai đều có lý — người đọc khác nhau.',
        '**{書|か}くことになってるの** — ôn **～ことになっている** (quy định, nề nếp — Bài 21). **「〜と{思|おも}います」→「〜と{考|かんが}えられる」** — trong văn viết, **{思|おも}う** nghe chủ quan; **{考|かんが}える／{考|かんが}えられる** (có thể cho rằng) khách quan hơn — bảng ③. **ぐっと** = hẳn, rõ rệt (văn nói) · **{勉強|べんきょう}になります** = em học được nhiều (cảm ơn lời góp ý).',
      ],
    },

    /* ── ③ 寮でレポートの相談 ── */
    { t: 'h', text: '③ {寮|りょう}でレポートの{相談|そうだん} — "{大学生|だいがくせい}はアルバイトをすべきか"' },
    {
      t: 'canh',
      anh: ['woman-student', 'books', 'man-student', 'writing-hand'],
      caption: 'Phòng sinh hoạt chung của 国際寮, tối thứ Tư. マリヤム phải nộp bài レポート môn 日本事情 (Nhật Bản học) vào 9 giờ sáng mai. Đề do mình tự chọn: "Sinh viên đại học có nên đi làm thêm không?". ダニエル đi thư viện về, tay ôm mấy cuốn sách.',
    },
    {
      t: 'p',
      text: 'Tình huống: **マリヤム** (nữ) nhờ **ダニエル** (nam) đọc bài レポート có chủ trương **～すべきではない** (mục ④). ダニエル gợi ý **trích dẫn** một cuốn sách cũ có câu **～ねばならない** (mục ⑤) và chỉ **cách trích dẫn đúng** (giữ nguyên chữ, cho vào 「」, ghi tác giả + năm xuất bản, tóm lại bằng **～と{述|の}べている**). Sau đó hai bạn bàn: nói **"không nên"** một cách tuyệt đối hay **"nên làm trong phạm vi…"** thì thuyết phục hơn — xem xét **từ hai mặt** (**～{面|めん}**) **rồi mới** kết luận (**～た{上|うえ}で**). Câu cuối: ダニエル đổi **{書|か}かなきゃ** (văn nói) thành văn viết. Bạn cùng ký túc xá → **thể thường**.',
    },
    DL('Phòng sinh hoạt chung — "Nói \'không nên\' tuyệt đối, hay \'nên… trong phạm vi…\'?"', [
      ['マリヤム', 'a', 'ダニエル、ちょっと{見|み}てくれる？ 「{日本事情|にほんじじょう}」のレポート。テーマは「{大学生|だいがくせい}はアルバイトをすべきか」なの。', 'Danieru, chotto mite kureru? "Nihon jijou" no repooto. Teema wa "daigakusei wa arubaito o subeki ka" na no.', 'Daniel, xem giúp mình một chút được không? Bài báo cáo môn "Nhật Bản học". Đề tài là "Sinh viên đại học có nên đi làm thêm không".'],
      ['ダニエル', 'b', 'いいよ。……{結論|けつろん}は「すべきではない」か。はっきりしていていいね。', 'Ii yo. …… Ketsuron wa "subeki de wa nai" ka. Hakkiri shite ite ii ne.', 'Được thôi. … Kết luận là "không nên" à. Rõ ràng, tốt đấy.'],
      ['マリヤム', 'a', 'うん。でも、{根拠|こんきょ}がクラスのアンケート{一|ひと}つしかなくて。', 'Un. Demo, konkyo ga kurasu no ankeeto hitotsu shika nakute.', 'Ừ. Nhưng căn cứ chỉ có mỗi một bản khảo sát trong lớp.'],
      ['ダニエル', 'b', 'じゃあ、{本|ほん}を{引用|いんよう}したら？ {図書館|としょかん}で{見|み}つけた{古|ふる}い{本|ほん}に、こう{書|か}いてあったよ。「{学生|がくせい}はまず{学|まな}ばねばならない。{働|はたら}くのはその{後|あと}でも{遅|おそ}くはない」。', 'Jaa, hon o in\'you shitara? Toshokan de mitsuketa furui hon ni, kou kaite atta yo. "Gakusei wa mazu manabaneba naranai. Hataraku no wa sono ato demo osoku wa nai".', 'Vậy trích dẫn một cuốn sách đi? Trong cuốn sách cũ mình tìm thấy ở thư viện có viết thế này: "Sinh viên trước hết phải học. Đi làm thì để sau cũng chưa muộn".'],
      ['マリヤム', 'a', '「{学|まな}ばねばならない」……{古|ふる}い{言|い}い{方|かた}だね。', '"Manabaneba naranai"…… furui iikata da ne.', '"Manabaneba naranai"… cách nói cũ nhỉ.'],
      ['ダニエル', 'b', '{四十年前|よんじゅうねんまえ}の{本|ほん}だからね。{引用|いんよう}する{時|とき}は、{言葉|ことば}を{変|か}えずにかぎ{括弧|かっこ}に{入|い}れて、{著者|ちょしゃ}の{名前|なまえ}と{出版|しゅっぱん}された{年|とし}を{書|か}くんだ。', 'Yonjuunen mae no hon da kara ne. In\'you suru toki wa, kotoba o kaezu ni kagikakko ni irete, chosha no namae to shuppan sareta toshi o kaku n da.', 'Sách bốn mươi năm trước mà. Khi trích dẫn thì giữ nguyên chữ, cho vào ngoặc kép kiểu Nhật, rồi ghi tên tác giả với năm xuất bản.'],
      ['マリヤム', 'a', '{言葉|ことば}を{変|か}えずに……じゃあ、「ねばならない」もそのまま？', 'Kotoba o kaezu ni…… jaa, "neba naranai" mo sono mama?', 'Giữ nguyên chữ… vậy "neba naranai" cũng để nguyên à?'],
      ['ダニエル', 'b', 'うん、そのまま。{自分|じぶん}の{言葉|ことば}で{説明|せつめい}する{時|とき}は、「{著者|ちょしゃ}は、{学生|がくせい}はまず{勉強|べんきょう}すべきだと{述|の}べている」みたいにまとめればいいよ。', 'Un, sono mama. Jibun no kotoba de setsumei suru toki wa, "chosha wa, gakusei wa mazu benkyou subeki da to nobete iru" mitai ni matomereba ii yo.', 'Ừ, để nguyên. Khi giải thích bằng lời của mình thì tóm lại kiểu "Tác giả cho rằng sinh viên trước hết nên học" là được.'],
      ['マリヤム', 'a', 'わかった。でも{考|かんが}えてみると、アルバイトをしないと{生活|せいかつ}できない{学生|がくせい}もいるよね。', 'Wakatta. Demo kangaete miru to, arubaito o shinai to seikatsu dekinai gakusei mo iru yo ne.', 'Hiểu rồi. Nhưng nghĩ lại thì cũng có sinh viên không làm thêm là không sống nổi nhỉ.'],
      ['ダニエル', 'b', 'そう。だから「すべきではない」と{言|い}い{切|き}るより、「{学業|がくぎょう}に{影響|えいきょう}が{出|で}ない{範囲|はんい}で{働|はたら}くべきだ」みたいに{書|か}いたほうが、{説得力|せっとくりょく}があるかもね。', 'Sou. Dakara "subeki de wa nai" to iikiru yori, "gakugyou ni eikyou ga denai han\'i de hataraku beki da" mitai ni kaita hou ga, settokuryoku ga aru kamo ne.', 'Đúng thế. Nên thay vì khẳng định chắc nịch "không nên", viết kiểu "nên làm trong phạm vi không ảnh hưởng tới việc học" có lẽ thuyết phục hơn.'],
      ['マリヤム', 'a', 'なるほど。{経済的|けいざいてき}な{面|めん}と{学業|がくぎょう}の{面|めん}、{両方|りょうほう}から{考|かんが}えた{上|うえ}で、{結論|けつろん}を{書|か}き{直|なお}してみる。', 'Naruhodo. Keizaiteki na men to gakugyou no men, ryouhou kara kangaeta ue de, ketsuron o kakinaoshite miru.', 'Ra vậy. Mình sẽ suy nghĩ từ cả hai mặt — mặt kinh tế và mặt học tập — rồi viết lại phần kết luận.'],
      ['ダニエル', 'b', 'うん、それがいいと{思|おも}う。{締|し}め{切|き}りはいつ？', 'Un, sore ga ii to omou. Shimekiri wa itsu?', 'Ừ, mình nghĩ thế là tốt. Hạn nộp khi nào?'],
      ['マリヤム', 'a', '{明日|あした}の{朝|あさ}{九時|くじ}。{今夜|こんや}は{寝|ね}ないで{書|か}かなきゃ。', 'Ashita no asa kuji. Kon\'ya wa nenaide kakanakya.', 'Chín giờ sáng mai. Tối nay phải thức viết thôi.'],
      ['ダニエル', 'b', '「{書|か}かなきゃ」は、レポートの{中|なか}なら「{書|か}かなければならない」だね。……でも、{徹夜|てつや}はやめたほうがいいよ。', '"Kakanakya" wa, repooto no naka nara "kakanakereba naranai" da ne. …… Demo, tetsuya wa yameta hou ga ii yo.', '"Kakanakya" mà ở trong bài báo cáo thì thành "kakanakereba naranai" nhỉ. … Nhưng đừng thức trắng thì hơn đấy.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{大学生|だいがくせい}はアルバイトをすべきか。', 'Daigakusei wa arubaito o subeki ka.', 'Sinh viên đại học có nên đi làm thêm không? (④ すべきか — đề bài luận)'),
        E('{学生|がくせい}はまず{学|まな}ばねばならない。', 'Gakusei wa mazu manabaneba naranai.', 'Sinh viên trước hết phải học. (⑤ ねばならない — câu trích sách cũ)'),
        E('{著者|ちょしゃ}は、{学生|がくせい}はまず{勉強|べんきょう}すべきだと{述|の}べている。', 'Chosha wa, gakusei wa mazu benkyou subeki da to nobete iru.', 'Tác giả cho rằng sinh viên trước hết nên học. (trích dẫn gián tiếp — ～と述べている)'),
        E('{学業|がくぎょう}に{影響|えいきょう}が{出|で}ない{範囲|はんい}で{働|はたら}くべきだ。', 'Gakugyou ni eikyou ga denai han\'i de hataraku beki da.', 'Nên đi làm trong phạm vi không ảnh hưởng tới việc học. (④ べきだ + 範囲)'),
        E('{経済的|けいざいてき}な{面|めん}と{学業|がくぎょう}の{面|めん}から{考|かんが}えた{上|うえ}で、{結論|けつろん}を{書|か}く。', 'Keizaiteki na men to gakugyou no men kara kangaeta ue de, ketsuron o kaku.', 'Suy xét từ mặt kinh tế và mặt học tập rồi mới viết kết luận. (② 面 + ① た上で)'),
        E('{言葉|ことば}を{変|か}えずに、かぎ{括弧|かっこ}に{入|い}れて{引用|いんよう}する。', 'Kotoba o kaezu ni, kagikakko ni irete in\'you suru.', 'Giữ nguyên chữ, cho vào ngoặc 「」 để trích dẫn. (cách trích dẫn trực tiếp)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{大学生|だいがくせい}はアルバイトをすべきか** — **する → すべき**: dạng của する trước べき (cũng nói **するべき**). **～べきか** = "có nên… không" — dạng **đề bài luận** kinh điển (～の{是非|ぜひ}を{論|ろん}じる). Kết luận của マリヤム: **すべきではない** (phủ định đặt ở **べき**, không phải ở động từ: ~~しないべきだ~~).',
        '**{学生|がくせい}はまず{学|まな}ばねばならない** — **{学|まな}ぶ → {学|まな}ば（ない）→ {学|まな}ばねばならない** = {学|まな}ばなければならない. Văn của sách cũ — マリヤム nhận ra ngay "cách nói cũ". Khi **trích dẫn trực tiếp** phải **giữ nguyên** từng chữ, kể cả ねばならない; chỉ khi **tóm bằng lời mình** (trích gián tiếp) mới đổi: **～すべきだと{述|の}べている**.',
        '**かぎ{括弧|かっこ}「」** — tiếng Nhật trích dẫn bằng **「」** (không dùng " "). Trích **dài** (≥ 3 dòng) thì tách thành đoạn riêng, thụt vào. Luôn kèm **{著者|ちょしゃ}名 + {出版年|しゅっぱんねん}** ngay sau câu trích, và danh mục **{参考文献|さんこうぶんけん}** ở cuối bài — xem mục Viết.',
        '**「すべきではない」と{言|い}い{切|き}るより～べきだ と{書|か}いたほうが{説得力|せっとくりょく}がある** — lời khuyên viết luận rất quan trọng: **phủ định tuyệt đối** dễ bị phản bác (có sinh viên **buộc phải** làm thêm — ôn ～ざるを得ない Bài 45); **có điều kiện** (～{範囲|はんい}で・～{限|かぎ}り) thì vững hơn. **{言|い}い{切|き}る** = nói chắc nịch, khẳng định dứt khoát.',
        '**{書|か}かなきゃ → {書|か}かなければならない** — **～なきゃ** là dạng rút gọn **văn nói** của ～なければ(ならない); trong レポート phải viết đủ. **{徹夜|てつや}はやめたほうがいいよ** — với bạn bè, lời khuyên dùng **～たほうがいい** (nhẹ), không dùng **べきだ** (nghe như lên lớp) — bảng ⑦.',
      ],
    },
    {
      t: 'note',
      title: 'チャレンジ — luyện cặp sau khi đọc hội thoại',
      items: [
        '**Cặp ①** — A là giảng viên, B là sinh viên. A "trả bài" cho B: nhận xét **hai mặt** (**～の{面|めん}では～が、～の{面|めん}では～**), đưa **hai yêu cầu** bằng **～た{上|うえ}で** (データを示した上で・先行研究を読んだ上で…). B hỏi một câu bằng **～る{上|うえ}で** (～を書く上で、何に気をつければいいですか). Đổi vai.',
        '**Cặp ②** — A là trưởng phòng, B nộp "báo cáo" về một việc tự chọn (dùng thử phần mềm, đổi giờ làm, sự kiện của công ty). A khen một **{点|てん}** (～という点), chỉ ra một **{面|めん}** còn thiếu, và nêu một nguyên tắc bằng **～べきだ**. B hứa sửa bằng **～た{上|うえ}で**. Đổi vai.',
        '**Cặp ③** — A đọc một câu "trích sách cũ" có **～ねばならない** (tự đặt: 若者は～ねばならない), B nói lại bằng văn hiện đại (**～なければならない**) rồi tóm bằng **～と{述|の}べている**. Sau đó hai bạn tranh luận một đề **「～べきか」** (học sinh có nên dùng điện thoại trong lớp, công ty có nên cho làm việc ở nhà…) — mỗi người nêu chủ trương bằng **～べきだ／べきではない** có **điều kiện**.',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b52-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 66 từ N2: bố cục & soạn thảo, nghiên cứu & phương pháp, trích dẫn & lập luận, văn viết & cách diễn đạt, báo cáo công việc & khía cạnh',
  goal: 'Thuộc 66 từ để đọc – viết – nói về báo cáo và luận văn: bố cục (序論・本論・構成・章・段落・見出し・要旨・要約・概要・箇条書き・冒頭・末尾・字数・執筆), nghiên cứu (先行研究・考察・手法・範囲・前提・枠組み・実証・示唆・明らかにする・概念・典型的・普遍的・段階), trích dẫn & lập luận (出典・参考文献・参照・言及・論じる・提唱・唱える・反論・論点・是非・妥当・一貫・倫理), văn viết (書き言葉・話し言葉・文体・統一・簡潔・明確・堅い・記述・補足・留意・きわめて・いわゆる・前述), công việc & khía cạnh (報告書・議事録・進捗・費用対効果・改善策・重視・視野・徹底・模範・側面・精神的・出版・改訂) — phân biệt các nhóm dễ nhầm (要旨・要約・概要・要点, 考察・感想・分析, 示唆・示す・指摘, 言及・触れる・述べる, 論じる・議論する, 提唱・提案, 手法・方法・手段, 普遍的・一般的・典型的, 簡潔・簡単, 堅い・硬い・固い, 参照・参考・引用, 前述・上記・下記) và nói thành cụm (構成を見直す, 要旨をまとめる, 考察を加える, 出典を明記する, 異論を唱える, 論点を整理する, 文体を統一する, 簡潔に述べる, 進捗を報告する, 視野が広がる, 管理を徹底する…).',
  minutes: 65,
  blocks: [
    {
      t: 'p',
      text: '**66 từ** chia 5 nhóm: **A** bố cục & soạn thảo (14) · **B** nghiên cứu & phương pháp (13) · **C** trích dẫn & lập luận (13) · **D** văn viết & cách diễn đạt (13) · **E** báo cáo công việc & khía cạnh (13). Đây là **từ của đề bài, hướng dẫn làm bài, bài đọc học thuật, báo cáo công việc** — đề N2 hay đặt chúng ở dạng **文脈規定** và **言い換え類義**, và **đề đọc** dùng chính các từ này trong câu hỏi (**{筆者|ひっしゃ}の{主張|しゅちょう}の{要旨|ようし}**・**{冒頭|ぼうとう}の「～」とは**・**{筆者|ひっしゃ}が{言及|げんきゅう}していないのは**). Phần lớn đọc được nhờ **âm Hán Việt**: {序論|じょろん} = TỰ LUẬN, {構成|こうせい} = CẤU THÀNH, {要旨|ようし} = YẾU CHỈ, {考察|こうさつ} = KHẢO SÁT, {範囲|はんい} = PHẠM VI, {前提|ぜんてい} = TIỀN ĐỀ, {実証|じっしょう} = THỰC CHỨNG, {出典|しゅってん} = XUẤT ĐIỂN, {参照|さんしょう} = THAM CHIẾU, {言及|げんきゅう} = NGÔN CẬP, {提唱|ていしょう} = ĐỀ XƯỚNG, {反論|はんろん} = PHẢN LUẬN, {妥当|だとう} = THOẢ ĐÁNG, {一貫|いっかん} = NHẤT QUÁN, {倫理|りんり} = LUÂN LÝ, {統一|とういつ} = THỐNG NHẤT, {簡潔|かんけつ} = GIẢN KHIẾT, {明確|めいかく} = MINH XÁC, {留意|りゅうい} = LƯU Ý, {徹底|てってい} = TRIỆT ĐỂ, {模範|もはん} = MÔ PHẠM, {出版|しゅっぱん} = XUẤT BẢN. Từ đã học ở Bài 1–51 ({論文|ろんぶん} Bài 26, {結論|けつろん}・{根拠|こんきょ}・{主張|しゅちょう}・{述|の}べる Bài 28, {要点|ようてん} Bài 30, {分析|ぶんせき}・{引用|いんよう}・{回答者|かいとうしゃ} Bài 33, {指摘|してき} Bài 35, {定義|ていぎ} Bài 36, {筆者|ひっしゃ}・{下記|かき} Bài 38, {視点|してん}・{観点|かんてん}・{客観的|きゃっかんてき} Bài 43, {検討|けんとう} Bài 44, {仮説|かせつ}・{検証|けんしょう} Bài 48…) không lặp lại — gặp trong câu là ôn.',
    },
    {
      t: 'note',
      title: 'Cách học 66 từ báo cáo trong 4 ngày',
      items: [
        '**Ngày 1** — nhóm A (14): học theo **một bản レポート thật** — lấy một bài báo cáo bất kỳ của bạn (hoặc bài mẫu ở mục Viết) và dán nhãn: **{表紙|ひょうし}** → **{要旨|ようし}** → **{序論|じょろん}** (đoạn **{冒頭|ぼうとう}**) → **{本論|ほんろん}** (chia **{章|しょう}**, mỗi chương có **{見出|みだ}し**, mỗi ý một **{段落|だんらく}**) → **{結論|けつろん}** → **{参考文献|さんこうぶんけん}** ở **{末尾|まつび}**. Từ chỉ việc viết: **{執筆|しっぴつ}・{構成|こうせい}・{要約|ようやく}・{概要|がいよう}・{箇条書|かじょうが}き・{字数|じすう}**.',
        '**Ngày 2** — nhóm B (13) + nhóm C (13): học theo **quy trình nghiên cứu**: đọc **{先行研究|せんこうけんきゅう}** → xác định **{範囲|はんい}・{前提|ぜんてい}・{枠組|わくぐ}み** → chọn **{手法|しゅほう}** → **{実証|じっしょう}** → **{考察|こうさつ}** (kết quả **{示唆|しさ}** điều gì?) → **{明|あき}らかにする**. Nhóm C theo **cuộc tranh luận**: có người **{提唱|ていしょう}** một ý → người khác **{異論|いろん}を{唱|とな}える／{反論|はんろん}する** → mọi người **{論点|ろんてん}を{整理|せいり}する**, bàn **{是非|ぜひ}**, xem ý nào **{妥当|だとう}**, ai **{一貫|いっかん}** → khi viết thì **{言及|げんきゅう}・{参照|さんしょう}**, ghi **{出典|しゅってん}**, giữ **{倫理|りんり}**.',
        '**Ngày 3** — nhóm D (13) + nhóm E (13): nhóm D học theo **bút đỏ của giảng viên**: "{文体|ぶんたい}を{統一|とういつ}しなさい／{話|はな}し{言葉|ことば}→{書|か}き{言葉|ことば}／もっと{簡潔|かんけつ}に／{結論|けつろん}を{明確|めいかく}に／{少|すこ}し{堅|かた}すぎる／ここに{補足|ほそく}を／～に{留意|りゅうい}すること／{前述|ぜんじゅつ}のとおり". Nhóm E học theo **một ngày ở công ty**: viết **{議事録|ぎじろく}** → báo **{進捗|しんちょく}** → nộp **{報告書|ほうこくしょ}** (có **{費用対効果|ひようたいこうか}**, **{改善策|かいぜんさく}**, **{側面|そくめん}**) → sếp **{重視|じゅうし}** gì, cần **{徹底|てってい}** gì.',
        '**Ngày 4** — thẻ hình + bảng **Từ dễ nhầm (類義語)** + bảng **Kết hợp từ (コロケーション)** + trắc nghiệm cuối mục + viết tay 12 từ. Ôn bằng cách **viết lại một đoạn 5 câu** về bài báo cáo gần nhất của bạn: mỗi câu dùng một từ nhóm A–C và một mẫu của bài (～た上で・～面で・～べきだ).',
      ],
    },
    { t: 'h', text: 'A. Bố cục & soạn thảo (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{序論|じょろん}', pos: 'danh từ', ipa: 'joron', vi: 'phần mở đầu (của bài luận, báo cáo)', ex: '{序論|じょろん}では、{研究|けんきゅう}の{背景|はいけい}と{目的|もくてき}を{述|の}べる。', exRo: 'Joron de wa, kenkyuu no haikei to mokuteki o noberu.', exVi: 'Trong phần mở đầu, trình bày bối cảnh và mục đích nghiên cứu.', more: '**{序論|じょろん}・{本論|ほんろん}・{結論|けつろん}** — ba phần của một レポート · tiêu đề phần mở đầu hay ghi **はじめに** · 序 = TỰ (thứ tự, mở đầu — chữ mới). N1 (rất hay gặp ở đại học).' },
        { w: '{本論|ほんろん}', pos: 'danh từ', ipa: 'honron', vi: 'phần thân, phần chính (của bài luận)', ex: '{本論|ほんろん}は{三|みっ}つの{章|しょう}に{分|わ}けて{書|か}いた。', exRo: 'Honron wa mittsu no shou ni wakete kaita.', exVi: 'Phần thân tôi chia thành ba chương.', more: '**{本論|ほんろん}に{入|はい}る** (đi vào phần chính) · trong 本論 thường có **{方法|ほうほう} → {結果|けっか} → {考察|こうさつ}** · 本 = chính. N1.' },
        { w: '{構成|こうせい}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'kousei (suru)', vi: 'bố cục; cấu thành', ex: '{書|か}き{始|はじ}める{前|まえ}に、レポートの{構成|こうせい}を{考|かんが}えよう。', exRo: 'Kakihajimeru mae ni, repooto no kousei o kangaeyou.', exVi: 'Trước khi bắt đầu viết, hãy nghĩ bố cục bài báo cáo.', more: '**{構成|こうせい}を{見直|みなお}す** · **～から{構成|こうせい}される** (gồm có…) · **{家族構成|かぞくこうせい}** (thành phần gia đình) · 構 = CẤU (chữ mới). N2.' },
        { w: '{章|しょう}', pos: 'danh từ', ipa: 'shou', vi: 'chương', ex: '{第三章|だいさんしょう}では、アンケートの{結果|けっか}を{分析|ぶんせき}する。', exRo: 'Dai sanshou de wa, ankeeto no kekka o bunseki suru.', exVi: 'Ở chương ba, phân tích kết quả khảo sát.', more: '**{第一章|だいいっしょう}** (có っ) · **{章立|しょうだ}て** (cách chia chương) · **{節|せつ}** (mục nhỏ trong chương: 第2章第1節) · {文章|ぶんしょう} (đoạn văn) cũng có chữ 章. N2.' },
        { w: '{段落|だんらく}', pos: 'danh từ', ipa: 'danraku', vi: 'đoạn văn', ex: '{一|ひと}つの{段落|だんらく}には、{一|ひと}つの{内容|ないよう}だけを{書|か}くのが{基本|きほん}だ。', exRo: 'Hitotsu no danraku ni wa, hitotsu no naiyou dake o kaku no ga kihon da.', exVi: 'Nguyên tắc cơ bản là mỗi đoạn văn chỉ viết một nội dung.', more: '**{段落|だんらく}を{分|わ}ける** · **{段落|だんらく}の{最初|さいしょ}は{一字下|いちじさ}げる** (đầu đoạn lùi vào một ô) · câu hỏi đề đọc: **{第|だい}2{段落|だんらく}で{筆者|ひっしゃ}が{言|い}いたいこと**. N2.' },
        { w: '{見出|みだ}し', pos: 'danh từ', ipa: 'midashi', vi: 'tiêu đề mục, đầu đề', ex: 'それぞれの{章|しょう}に、{内容|ないよう}が{分|わ}かる{見出|みだ}しをつける。', exRo: 'Sorezore no shou ni, naiyou ga wakaru midashi o tsukeru.', exVi: 'Đặt cho mỗi chương một tiêu đề cho biết nội dung.', more: '**{見出|みだ}しをつける** · **{新聞|しんぶん}の{見出|みだ}し** (tít báo) · {見出|みだ}し{語|ご} (từ mục trong từ điển). N2.' },
        { w: '{要旨|ようし}', pos: 'danh từ', ipa: 'youshi', vi: 'ý chính tóm tắt; bản tóm tắt (abstract) của luận văn', ex: '{論文|ろんぶん}の{最初|さいしょ}に、{四百字|よんひゃくじ}の{要旨|ようし}をつけること。', exRo: 'Ronbun no saisho ni, yonhyakuji no youshi o tsukeru koto.', exVi: 'Ở đầu luận văn phải kèm bản tóm tắt 400 chữ.', more: '**{要旨|ようし}をまとめる** · nhấn **ý chính của người viết** · câu hỏi đề đọc: **{筆者|ひっしゃ}の{主張|しゅちょう}の{要旨|ようし}** · ～こと (cuối câu) = quy định phải làm (văn hướng dẫn). N1.' },
        { w: '{要約|ようやく}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'youyaku (suru)', vi: 'tóm tắt (rút gọn nội dung)', ex: '{講義|こうぎ}の{内容|ないよう}を{二百字|にひゃくじ}で{要約|ようやく}しなさい。', exRo: 'Kougi no naiyou o nihyakuji de youyaku shinasai.', exVi: 'Hãy tóm tắt nội dung bài giảng trong 200 chữ.', more: 'đã gặp ở Bài 39 (tóm tắt bài nghe) · **{要約|ようやく}すると** (tóm lại thì) · bảng 類義語: 要旨 ↔ 要約 ↔ 概要 ↔ 要点. N2.' },
        { w: '{概要|がいよう}', pos: 'danh từ', ipa: 'gaiyou', vi: 'khái quát, đại cương', ex: 'まず、{調査|ちょうさ}の{概要|がいよう}を{説明|せつめい}します。', exRo: 'Mazu, chousa no gaiyou o setsumei shimasu.', exVi: 'Trước hết, tôi xin giải thích khái quát về cuộc khảo sát.', more: '**{概要|がいよう}を{説明|せつめい}する／つかむ** · **{事業|じぎょう}の{概要|がいよう}** · 概 = KHÁI (chữ Bài 50). N2.' },
        { w: '{箇条書|かじょうが}き', pos: 'danh từ', ipa: 'kajougaki', vi: 'viết gạch đầu dòng, liệt kê từng mục', ex: '{注意点|ちゅういてん}は{箇条書|かじょうが}きにすると{読|よ}みやすい。', exRo: 'Chuuiten wa kajougaki ni suru to yomiyasui.', exVi: 'Các điểm cần lưu ý viết thành gạch đầu dòng thì dễ đọc.', more: '**{箇条書|かじょうが}きにする** · trong レポート: phần liệt kê kết quả / đề xuất dùng được, nhưng **{考察|こうさつ}** phải viết thành đoạn văn · 箇 = CÁ (chữ mới). N1.' },
        { w: '{冒頭|ぼうとう}', pos: 'danh từ', ipa: 'boutou', vi: 'phần đầu (bài viết, câu chuyện, cuộc họp)', ex: '{社長|しゃちょう}は{会議|かいぎ}の{冒頭|ぼうとう}で、{今年|ことし}の{目標|もくひょう}を{話|はな}した。', exRo: 'Shachou wa kaigi no boutou de, kotoshi no mokuhyou o hanashita.', exVi: 'Giám đốc nói về mục tiêu năm nay ở phần đầu cuộc họp.', more: '**{冒頭|ぼうとう}で{述|の}べたように** (như đã nói ở đầu) · câu hỏi đề đọc: **{冒頭|ぼうとう}の「～」とはどういうことか** · ↔ {末尾|まつび}. N1.' },
        { w: '{末尾|まつび}', pos: 'danh từ', ipa: 'matsubi', vi: 'phần cuối (văn bản, câu, dãy số)', ex: '{参考文献|さんこうぶんけん}は、レポートの{末尾|まつび}にまとめて{書|か}く。', exRo: 'Sankou bunken wa, repooto no matsubi ni matomete kaku.', exVi: 'Tài liệu tham khảo được ghi gộp ở cuối bài báo cáo.', more: '**{文|ぶん}の{末尾|まつび}** (cuối câu) · **{番号|ばんごう}の{末尾|まつび}** (số cuối) · 尾 = VĨ (đuôi — chữ mới). N1.' },
        { w: '{字数|じすう}', pos: 'danh từ', ipa: 'jisuu', vi: 'số chữ', ex: '{字数|じすう}は{二千字|にせんじ}{以上|いじょう}、{三千字|さんぜんじ}{以内|いない}とする。', exRo: 'Jisuu wa nisenji ijou, sanzenji inai to suru.', exVi: 'Số chữ từ 2.000 đến 3.000 chữ.', more: '**{字数制限|じすうせいげん}** (giới hạn số chữ) · **～{字|じ}{以内|いない}** · tiếng Nhật đếm **mỗi ô** (kể cả dấu câu) như 原稿用紙 · ～とする = quy định là (văn hướng dẫn). N2.' },
        { w: '{執筆|しっぴつ}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'shippitsu (suru)', vi: 'chấp bút, viết (sách, bài báo, luận văn)', ex: '{先生|せんせい}は{今|いま}、{新|あたら}しい{教科書|きょうかしょ}を{執筆|しっぴつ}している。', exRo: 'Sensei wa ima, atarashii kyoukasho o shippitsu shite iru.', exVi: 'Thầy đang viết một cuốn giáo trình mới.', more: '**{論文|ろんぶん}を{執筆|しっぴつ}する** · **{執筆者|しっぴつしゃ}** (người viết) · ≠ 書く (mọi thứ) — 執筆 = viết tác phẩm, bài đăng · 執 = CHẤP (chữ mới). N1.' },
      ],
    },
    { t: 'h', text: 'B. Nghiên cứu & phương pháp (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{先行研究|せんこうけんきゅう}', pos: 'danh từ', ipa: 'senkou kenkyuu', vi: 'nghiên cứu đi trước (đã có trước đề tài của mình)', ex: 'このテーマについての{先行研究|せんこうけんきゅう}は、まだ{少|すく}ない。', exRo: 'Kono teema ni tsuite no senkou kenkyuu wa, mada sukunai.', exVi: 'Nghiên cứu đi trước về đề tài này còn ít.', more: '**{先行研究|せんこうけんきゅう}を{調|しら}べる／{整理|せいり}する** · 先行 = đi trước · phần bắt buộc của 卒論 (chương 2 thường là {先行研究|せんこうけんきゅう}). N1.' },
        { w: '{考察|こうさつ}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'kousatsu (suru)', vi: 'khảo sát, bàn luận (diễn giải ý nghĩa của kết quả)', ex: '{結果|けっか}を{示|しめ}した{上|うえ}で、その{原因|げんいん}を{考察|こうさつ}する。', exRo: 'Kekka o shimeshita ue de, sono gen\'in o kousatsu suru.', exVi: 'Trình bày kết quả rồi mới bàn luận về nguyên nhân.', more: '**{考察|こうさつ}を{加|くわ}える** · **{結果|けっか}と{考察|こうさつ}** (Kết quả và Thảo luận — tên chương) · ≠ {感想|かんそう} (Bài 28 — cảm tưởng): 考察 phải có căn cứ. N1.' },
        { w: '{手法|しゅほう}', pos: 'danh từ', ipa: 'shuhou', vi: 'phương pháp, kỹ thuật (chuyên môn)', ex: 'この{研究|けんきゅう}では、インタビューという{手法|しゅほう}を{用|もち}いた。', exRo: 'Kono kenkyuu de wa, intabyuu to iu shuhou o mochiita.', exVi: 'Nghiên cứu này dùng phương pháp phỏng vấn.', more: '**{新|あたら}しい{手法|しゅほう}** · **{調査手法|ちょうさしゅほう}** · ≈ {方法|ほうほう} (Bài 21) nhưng 手法 = kỹ thuật chuyên môn · **{用|もち}いる** = dùng (văn viết của 使う). N1.' },
        { w: '{範囲|はんい}', pos: 'danh từ', ipa: 'han\'i', vi: 'phạm vi', ex: '{今回|こんかい}の{調査|ちょうさ}の{範囲|はんい}は、{市内|しない}の{大学生|だいがくせい}に{限|かぎ}る。', exRo: 'Konkai no chousa no han\'i wa, shinai no daigakusei ni kagiru.', exVi: 'Phạm vi khảo sát lần này giới hạn ở sinh viên trong thành phố.', more: '**{試験|しけん}の{範囲|はんい}** · **～の{範囲内|はんいない}で** · **{範囲|はんい}が{広|ひろ}い／{狭|せま}い** · đọc **はんい** (ん + い: han-i) · 範 = PHẠM (chữ mới). N2.' },
        { w: '{前提|ぜんてい}', pos: 'danh từ', ipa: 'zentei', vi: 'tiền đề, điều kiện đặt ra trước', ex: 'この{計画|けいかく}は、{予算|よさん}が{増|ふ}えることを{前提|ぜんてい}にしている。', exRo: 'Kono keikaku wa, yosan ga fueru koto o zentei ni shite iru.', exVi: 'Kế hoạch này đặt tiền đề là ngân sách sẽ tăng.', more: '**～を{前提|ぜんてい}に（して）** · **{前提条件|ぜんていじょうけん}** · **{前提|ぜんてい}が{崩|くず}れる** (tiền đề sụp đổ). N1.' },
        { w: '{枠組|わくぐ}み', pos: 'danh từ', ipa: 'wakugumi', vi: 'khung, khuôn khổ (lý thuyết, chế độ)', ex: '{先行研究|せんこうけんきゅう}の{枠組|わくぐ}みを{使|つか}って、データを{整理|せいり}した。', exRo: 'Senkou kenkyuu no wakugumi o tsukatte, deeta o seiri shita.', exVi: 'Tôi dùng khung lý thuyết của nghiên cứu đi trước để sắp xếp dữ liệu.', more: '**{理論的|りろんてき}な{枠組|わくぐ}み** · **{枠|わく}** (khung) · **{枠|わく}にとらわれない** (không bị gò bó khuôn khổ). N1.' },
        { w: '{実証|じっしょう}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'jisshou (suru)', vi: 'chứng minh bằng thực tế, dữ liệu', ex: '{仮説|かせつ}が{正|ただ}しいことを、{実験|じっけん}で{実証|じっしょう}した。', exRo: 'Kasetsu ga tadashii koto o, jikken de jisshou shita.', exVi: 'Đã chứng minh bằng thí nghiệm rằng giả thuyết là đúng.', more: 'ôn **{仮説|かせつ}・{検証|けんしょう}** (Bài 48) · **{実証的|じっしょうてき}な{研究|けんきゅう}** · ≈ {証明|しょうめい} (chứng minh — cả bằng lý luận, toán học); 実証 = bằng dữ liệu thật. N1.' },
        { w: '{示唆|しさ}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'shisa (suru)', vi: 'gợi ý, cho thấy (một khả năng — gián tiếp)', ex: 'この{結果|けっか}は、{睡眠|すいみん}と{成績|せいせき}の{関係|かんけい}を{示唆|しさ}している。', exRo: 'Kono kekka wa, suimin to seiseki no kankei o shisa shite iru.', exVi: 'Kết quả này cho thấy (gợi ý) mối quan hệ giữa giấc ngủ và thành tích.', more: '**～を{示唆|しさ}する** · **{示唆|しさ}に{富|と}む** (giàu gợi mở) · ≠ {示|しめ}す (Bài 28 — cho thấy rõ): 示唆 = cho thấy GIÁN TIẾP, chưa khẳng định · 唆 = TOA (chữ mới). N1.' },
        { w: '{明|あき}らかにする', pos: 'cụm động từ', ipa: 'akiraka ni suru', vi: 'làm rõ', ex: '{本研究|ほんけんきゅう}の{目的|もくてき}は、{留学生|りゅうがくせい}の{悩|なや}みを{明|あき}らかにすることである。', exRo: 'Honkenkyuu no mokuteki wa, ryuugakusei no nayami o akiraka ni suru koto de aru.', exVi: 'Mục đích của nghiên cứu này là làm rõ những khó khăn của du học sinh.', more: 'ôn **{明|あき}らかな** (Bài 31) · **～が{明|あき}らかになった** (đã làm rõ được — câu "đinh" của phần kết luận) · **{本研究|ほんけんきゅう}** = nghiên cứu này (người viết tự gọi). N2.' },
        { w: '{概念|がいねん}', pos: 'danh từ', ipa: 'gainen', vi: 'khái niệm', ex: '「{幸|しあわ}せ」という{概念|がいねん}は、{国|くに}によって{少|すこ}しずつ{違|ちが}う。', exRo: '"Shiawase" to iu gainen wa, kuni ni yotte sukoshi zutsu chigau.', exVi: 'Khái niệm "hạnh phúc" khác nhau đôi chút tuỳ từng nước.', more: '**～という{概念|がいねん}** · **{概念|がいねん}を{定義|ていぎ}する** (ôn {定義|ていぎ} Bài 36) · **{新|あたら}しい{概念|がいねん}を{提唱|ていしょう}する**. N1.' },
        { w: '{典型的|てんけいてき}（な）', pos: 'tính từ ナ', ipa: 'tenkeiteki (na)', vi: 'điển hình', ex: 'これは、{地方|ちほう}の{過疎化|かそか}の{典型的|てんけいてき}な{例|れい}である。', exRo: 'Kore wa, chihou no kasoka no tenkeiteki na rei de aru.', exVi: 'Đây là một ví dụ điển hình của tình trạng thưa dân ở địa phương.', more: '**{典型的|てんけいてき}な{例|れい}** · **{典型|てんけい}** (điển hình — danh từ) · 典 = ĐIỂN (chữ mới). N1.' },
        { w: '{普遍的|ふへんてき}（な）', pos: 'tính từ ナ', ipa: 'fuhenteki (na)', vi: 'phổ quát, đúng ở mọi nơi mọi thời', ex: '{家族|かぞく}を{大切|たいせつ}にする{気持|きも}ちは、{普遍的|ふへんてき}なものだろう。', exRo: 'Kazoku o taisetsu ni suru kimochi wa, fuhenteki na mono darou.', exVi: 'Tình cảm trân trọng gia đình có lẽ là điều phổ quát.', more: '**{普遍的|ふへんてき}な{価値|かち}** · ↔ **{特殊|とくしゅ}** (đặc thù) · ≠ {一般的|いっぱんてき} (Bài 28 — nói chung, đa số) — bảng 類義語 · 遍 = BIẾN (chữ mới). N1.' },
        { w: '{段階|だんかい}', pos: 'danh từ', ipa: 'dankai', vi: 'giai đoạn, bước', ex: '{計画|けいかく}はまだ{準備|じゅんび}の{段階|だんかい}だ。', exRo: 'Keikaku wa mada junbi no dankai da.', exVi: 'Kế hoạch vẫn đang ở giai đoạn chuẩn bị.', more: '**～の{段階|だんかい}で** · **{段階的|だんかいてき}に** (từng bước) · **{最終段階|さいしゅうだんかい}** · ≈ {過程|かてい} (Bài 44 — quá trình liền mạch); 段階 = từng bậc tách bạch. N2.' },
      ],
    },
    { t: 'h', text: 'C. Trích dẫn & lập luận (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{出典|しゅってん}', pos: 'danh từ', ipa: 'shutten', vi: 'nguồn trích dẫn', ex: '{図|ず}や{表|ひょう}を{使|つか}う{時|とき}は、{必|かなら}ず{出典|しゅってん}を{示|しめ}すこと。', exRo: 'Zu ya hyou o tsukau toki wa, kanarazu shutten o shimesu koto.', exVi: 'Khi dùng hình hay bảng, nhất thiết phải ghi nguồn.', more: '**{出典|しゅってん}を{明記|めいき}する** (ghi rõ nguồn) · dưới bảng biểu ghi **{出典|しゅってん}：～（2024）** · không ghi nguồn = **{盗用|とうよう}** (đạo văn) · 典 = ĐIỂN (chữ mới). N1.' },
        { w: '{参考文献|さんこうぶんけん}', pos: 'danh từ', ipa: 'sankou bunken', vi: 'tài liệu tham khảo', ex: 'レポートの{最後|さいご}に、{参考文献|さんこうぶんけん}の{一覧|いちらん}をつける。', exRo: 'Repooto no saigo ni, sankou bunken no ichiran o tsukeru.', exVi: 'Cuối bài báo cáo kèm danh mục tài liệu tham khảo.', more: '**{文献|ぶんけん}** = tài liệu nghiên cứu (sách, bài báo khoa học) · **{文献|ぶんけん}を{調|しら}べる** · **{一覧|いちらん}** = danh sách · cách ghi: xem mục Viết. N1.' },
        { w: '{参照|さんしょう}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'sanshou (suru)', vi: 'tham chiếu, xem (một chỗ khác trong tài liệu)', ex: '{詳|くわ}しいデータについては、{表|ひょう}2を{参照|さんしょう}してください。', exRo: 'Kuwashii deeta ni tsuite wa, hyou ni o sanshou shite kudasai.', exVi: 'Về số liệu chi tiết, xin xem bảng 2.', more: '**～を{参照|さんしょう}する** · trong văn bản ghi gọn **（{表|ひょう}2{参照|さんしょう}）** · ≈ {参考|さんこう}にする — bảng 類義語 参照 ↔ 参考 ↔ 引用. N2.' },
        { w: '{言及|げんきゅう}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'genkyuu (suru)', vi: 'đề cập, nhắc tới', ex: '{筆者|ひっしゃ}は、この{問題|もんだい}の{原因|げんいん}には{言及|げんきゅう}していない。', exRo: 'Hissha wa, kono mondai no gen\'in ni wa genkyuu shite inai.', exVi: 'Tác giả không đề cập tới nguyên nhân của vấn đề này.', more: '**～に{言及|げんきゅう}する** · ≈ ～に{触|ふ}れる (nhắc qua) · câu hỏi đề đọc: **{筆者|ひっしゃ}が{言及|げんきゅう}していないのはどれか**. N1.' },
        { w: '{論|ろん}じる', pos: 'động từ nhóm 2', ipa: 'ronjiru', vi: 'bàn luận, luận bàn (trình bày có lập luận)', ex: '{本|ほん}レポートでは、{在宅勤務|ざいたくきんむ}の{長所|ちょうしょ}と{短所|たんしょ}を{論|ろん}じる。', exRo: 'Hon repooto de wa, zaitaku kinmu no chousho to tansho o ronjiru.', exVi: 'Bản báo cáo này bàn luận về ưu điểm và nhược điểm của làm việc tại nhà.', more: '**～について{論|ろん}じる** · = **{論|ろん}ずる** (dạng cũ) · ≠ {議論|ぎろん}する (Bài 28 — nhiều người bàn với nhau); 論じる = MỘT người trình bày có lập luận · **{本|ほん}レポート** = bản báo cáo này. N1.' },
        { w: '{提唱|ていしょう}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'teishou (suru)', vi: 'đề xướng (một lý thuyết, khái niệm, tư tưởng mới)', ex: 'その{学者|がくしゃ}は、{新|あたら}しい{学習|がくしゅう}の{方法|ほうほう}を{提唱|ていしょう}した。', exRo: 'Sono gakusha wa, atarashii gakushuu no houhou o teishou shita.', exVi: 'Học giả đó đã đề xướng một phương pháp học mới.', more: '**{理論|りろん}を{提唱|ていしょう}する** · ≠ {提案|ていあん} (Bài 28 — đề xuất một phương án cụ thể); 提唱 = đưa một tư tưởng MỚI ra xã hội · 唱 = XƯỚNG (chữ mới). N1.' },
        { w: '{唱|とな}える', pos: 'động từ nhóm 2', ipa: 'tonaeru', vi: 'nêu lên (ý kiến, học thuyết); hô, niệm', ex: '{会議|かいぎ}で{一人|ひとり}だけ、その{案|あん}に{異論|いろん}を{唱|とな}えた。', exRo: 'Kaigi de hitori dake, sono an ni iron o tonaeta.', exVi: 'Trong cuộc họp, chỉ một người nêu ý kiến phản đối phương án đó.', more: '**{異論|いろん}を{唱|とな}える** (nêu ý kiến trái) · **{新説|しんせつ}を{唱|とな}える** (đưa ra thuyết mới) · nghĩa gốc: hô to, niệm (お{経|きょう}を{唱|とな}える). N1.' },
        { w: '{反論|はんろん}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'hanron (suru)', vi: 'phản bác', ex: '{相手|あいて}の{意見|いけん}に、データを{使|つか}って{反論|はんろん}した。', exRo: 'Aite no iken ni, deeta o tsukatte hanron shita.', exVi: 'Tôi dùng số liệu để phản bác ý kiến của đối phương.', more: '**～に{反論|はんろん}する** · **{反論|はんろん}の{余地|よち}がない** (không thể phản bác) · trong bài luận: đoạn **{確|たし}かに～。しかし～** chính là đoạn 反論. N2.' },
        { w: '{論点|ろんてん}', pos: 'danh từ', ipa: 'ronten', vi: 'luận điểm, điểm cần bàn', ex: '{議論|ぎろん}の{論点|ろんてん}を{整理|せいり}してから、{話|はな}し{合|あ}おう。', exRo: 'Giron no ronten o seiri shite kara, hanashiaou.', exVi: 'Hãy sắp xếp các luận điểm của cuộc tranh luận rồi mới bàn.', more: '**{論点|ろんてん}を{整理|せいり}する** · **{論点|ろんてん}がずれる** (lạc đề) · **{主|おも}な{論点|ろんてん}**. N1.' },
        { w: '{是非|ぜひ}', pos: 'danh từ', ipa: 'zehi', vi: 'đúng sai, nên hay không', ex: '{学校|がっこう}でスマホを{使|つか}うことの{是非|ぜひ}について{議論|ぎろん}した。', exRo: 'Gakkou de sumaho o tsukau koto no zehi ni tsuite giron shita.', exVi: 'Chúng tôi đã tranh luận về việc dùng điện thoại ở trường là nên hay không.', more: '**～の{是非|ぜひ}を{問|と}う／{論|ろん}じる** · cùng chữ với phó từ **ぜひ** (nhất định — ぜひ{来|き}てください) nhưng ở đây là **danh từ**: 是 (đúng) + 非 (sai) · 是 = THỊ (ôn: Bài 51). N1–N2.' },
        { w: '{妥当|だとう}（な）', pos: 'tính từ ナ', ipa: 'datou (na)', vi: 'hợp lý, thoả đáng', ex: 'この{結論|けつろん}は、データから{見|み}て{妥当|だとう}だと{言|い}える。', exRo: 'Kono ketsuron wa, deeta kara mite datou da to ieru.', exVi: 'Xét từ số liệu, có thể nói kết luận này là hợp lý.', more: '**{妥当|だとう}な{判断|はんだん}／{金額|きんがく}** · **{妥当性|だとうせい}** (tính hợp lý) · 妥 = THOẢ (như {妥協|だきょう} Bài 44). N1.' },
        { w: '{一貫|いっかん}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'ikkan (suru)', vi: 'nhất quán, xuyên suốt', ex: '{彼|かれ}の{主張|しゅちょう}は、{最初|さいしょ}から{最後|さいご}まで{一貫|いっかん}している。', exRo: 'Kare no shuchou wa, saisho kara saigo made ikkan shite iru.', exVi: 'Chủ trương của anh ấy nhất quán từ đầu đến cuối.', more: '**{一貫|いっかん}して～** · **{一貫性|いっかんせい}がある／ない** · 貫 = QUÁN (như {貫|つらぬ}く Bài 47). N1.' },
        { w: '{倫理|りんり}', pos: 'danh từ', ipa: 'rinri', vi: 'luân lý, đạo đức', ex: '{他人|たにん}の{文章|ぶんしょう}をそのまま{使|つか}うのは、{研究|けんきゅう}の{倫理|りんり}に{反|はん}する。', exRo: 'Tanin no bunshou o sono mama tsukau no wa, kenkyuu no rinri ni hansuru.', exVi: 'Dùng nguyên văn bài viết của người khác là trái với đạo đức nghiên cứu.', more: '**{研究倫理|けんきゅうりんり}** · **{倫理的|りんりてき}な{問題|もんだい}** · ～に{反|はん}する (trái với — Bài 50) · 倫 = LUÂN (chữ mới). N2.' },
      ],
    },
    { t: 'h', text: 'D. Văn viết & cách diễn đạt (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{書|か}き{言葉|ことば}', pos: 'danh từ', ipa: 'kakikotoba', vi: 'văn viết, ngôn ngữ viết', ex: '「しかし」は{書|か}き{言葉|ことば}で、「でも」は{話|はな}し{言葉|ことば}だ。', exRo: '"Shikashi" wa kakikotoba de, "demo" wa hanashikotoba da.', exVi: '"Shikashi" là văn viết, còn "demo" là văn nói.', more: '↔ **{話|はな}し{言葉|ことば}** · bảng chuyển văn nói → văn viết (30+ cặp) ở mục Viết · ≈ {文語|ぶんご} (văn ngữ — cũ). N2.' },
        { w: '{話|はな}し{言葉|ことば}', pos: 'danh từ', ipa: 'hanashikotoba', vi: 'văn nói, khẩu ngữ', ex: 'レポートに{話|はな}し{言葉|ことば}が{混|ま}じらないように{気|き}をつける。', exRo: 'Repooto ni hanashikotoba ga majiranai you ni ki o tsukeru.', exVi: 'Chú ý để văn nói không lẫn vào bài báo cáo.', more: '≈ {口語|こうご} (khẩu ngữ — N1) · **{混|ま}じる** (lẫn vào) · dấu hiệu văn nói: ～ちゃう・～なきゃ・～って・すごく・でも・だから đầu câu. N2.' },
        { w: '{文体|ぶんたい}', pos: 'danh từ', ipa: 'buntai', vi: 'văn phong, thể văn', ex: 'レポートでは、だ・である{体|たい}に{文体|ぶんたい}を{統一|とういつ}する。', exRo: 'Repooto de wa, da de aru tai ni buntai o touitsu suru.', exVi: 'Trong báo cáo, thống nhất văn phong theo thể だ・である.', more: '**です・ます{体|たい}（{敬体|けいたい}）↔ だ・である{体|たい}（{常体|じょうたい}）** · **{文体|ぶんたい}が{堅|かた}い／{柔|やわ}らかい** · ngữ pháp ③. N1.' },
        { w: '{統一|とういつ}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'touitsu (suru)', vi: 'thống nhất', ex: '{表記|ひょうき}を{統一|とういつ}しないと、{読|よ}みにくい{文章|ぶんしょう}になる。', exRo: 'Hyouki o touitsu shinai to, yominikui bunshou ni naru.', exVi: 'Không thống nhất cách ghi chữ thì bài văn sẽ khó đọc.', more: '**{表記|ひょうき}の{統一|とういつ}** (thống nhất cách viết: {子|こ}ども／{子供|こども} chọn MỘT) · **{統一感|とういつかん}** · {表記|ひょうき} = cách ghi chữ. N2.' },
        { w: '{簡潔|かんけつ}（な）', pos: 'tính từ ナ', ipa: 'kanketsu (na)', vi: 'ngắn gọn, súc tích', ex: '{報告書|ほうこくしょ}は、{要点|ようてん}を{簡潔|かんけつ}にまとめることが{大切|たいせつ}だ。', exRo: 'Houkokusho wa, youten o kanketsu ni matomeru koto ga taisetsu da.', exVi: 'Với báo cáo công việc, điều quan trọng là tổng hợp ý chính một cách ngắn gọn.', more: '**{簡潔|かんけつ}に{述|の}べる** · ôn {要点|ようてん} (Bài 30) · ≠ {簡単|かんたん} (dễ, đơn giản) — 簡潔 = ít chữ mà đủ ý · ↔ {冗長|じょうちょう} (dài dòng — N1) · 潔 = KHIẾT (chữ mới). N2.' },
        { w: '{明確|めいかく}（な）', pos: 'tính từ ナ', ipa: 'meikaku (na)', vi: 'rõ ràng, minh bạch', ex: '{結論|けつろん}を{明確|めいかく}に{書|か}かないと、{読|よ}む{人|ひと}が{迷|まよ}ってしまう。', exRo: 'Ketsuron o meikaku ni kakanai to, yomu hito ga mayotte shimau.', exVi: 'Không viết kết luận rõ ràng thì người đọc sẽ bối rối.', more: '**{明確|めいかく}な{目標|もくひょう}／{基準|きじゅん}** · **{明確|めいかく}にする** · ≈ はっきり (văn nói). N2.' },
        { w: '{堅|かた}い', pos: 'tính từ イ', ipa: 'katai', vi: 'cứng nhắc (văn, cách nói); chắc chắn, vững', ex: '{友達|ともだち}へのメールにしては、{文章|ぶんしょう}が{堅|かた}すぎる。', exRo: 'Tomodachi e no meeru ni shite wa, bunshou ga katasugiru.', exVi: 'Là email gửi bạn bè mà văn thì cứng quá.', more: '**{堅|かた}い{文章|ぶんしょう}／{表現|ひょうげん}** · **{口|くち}が{堅|かた}い** (kín miệng) · **{堅|かた}い{仕事|しごと}** (nghề ổn định) · ～にしては (Bài 43) · bảng 堅い ↔ 硬い (Bài 50) ↔ 固い. N2.' },
        { w: '{記述|きじゅつ}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'kijutsu (suru)', vi: 'ghi chép, mô tả bằng chữ', ex: '{調査|ちょうさ}の{方法|ほうほう}を、できるだけ{詳|くわ}しく{記述|きじゅつ}する。', exRo: 'Chousa no houhou o, dekiru dake kuwashiku kijutsu suru.', exVi: 'Mô tả phương pháp khảo sát càng chi tiết càng tốt.', more: '**{記述問題|きじゅつもんだい}** (câu hỏi tự luận) · **～についての{記述|きじゅつ}がない** · ≠ {記入|きにゅう} (Bài 35 — điền vào ô). N1.' },
        { w: '{補足|ほそく}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'hosoku (suru)', vi: 'bổ sung, nói thêm', ex: '{前回|ぜんかい}の{説明|せつめい}に、{少|すこ}し{補足|ほそく}させてください。', exRo: 'Zenkai no setsumei ni, sukoshi hosoku sasete kudasai.', exVi: 'Cho phép tôi bổ sung một chút vào phần giải thích lần trước.', more: '**{補足説明|ほそくせつめい}** · **{補足|ほそく}すると** (nói thêm thì) · ≈ {付|つ}け{加|くわ}える. N2.' },
        { w: '{留意|りゅうい}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'ryuui (suru)', vi: 'lưu ý', ex: 'アンケートを{作|つく}る{際|さい}は、{質問|しつもん}の{順番|じゅんばん}に{留意|りゅうい}する{必要|ひつよう}がある。', exRo: 'Ankeeto o tsukuru sai wa, shitsumon no junban ni ryuui suru hitsuyou ga aru.', exVi: 'Khi soạn bảng khảo sát, cần lưu ý thứ tự câu hỏi.', more: '**～に{留意|りゅうい}する** · **{留意点|りゅういてん}** · ≈ {注意|ちゅうい}する nhưng trang trọng, văn viết · ～{際|さい}は (Bài 41). N1.' },
        { w: 'きわめて', pos: 'phó từ', ipa: 'kiwamete', vi: 'cực kỳ, hết sức (văn viết)', ex: 'この{方法|ほうほう}は、きわめて{効果的|こうかてき}であることが{分|わ}かった。', exRo: 'Kono houhou wa, kiwamete koukateki de aru koto ga wakatta.', exVi: 'Đã biết được rằng phương pháp này cực kỳ hiệu quả.', more: '= {非常|ひじょう}に (văn viết) · chữ Hán: **{極|きわ}めて** · ≠ とても／すごく (văn nói) · ～であることが{分|わ}かった = câu kết luận chuẩn. N2.' },
        { w: 'いわゆる', pos: 'liên thể từ', ipa: 'iwayuru', vi: 'cái gọi là, thường được gọi là', ex: '{彼|かれ}は、いわゆる「{指示待|しじま}ち{人間|にんげん}」ではない。', exRo: 'Kare wa, iwayuru "shijimachi ningen" de wa nai.', exVi: 'Anh ấy không phải loại người gọi là "chờ chỉ thị mới làm".', more: '**いわゆる＋N** — giới thiệu một cách gọi phổ biến (thường kèm 「」) · ≈ ～と{呼|よ}ばれる · {指示待|しじま}ち = chờ lệnh. N2.' },
        { w: '{前述|ぜんじゅつ}', pos: 'danh từ', ipa: 'zenjutsu', vi: 'đã nói ở trên (trong cùng văn bản)', ex: '{前述|ぜんじゅつ}のとおり、{回答者|かいとうしゃ}の{多|おお}くは{一年生|いちねんせい}である。', exRo: 'Zenjutsu no toori, kaitousha no ooku wa ichinensei de aru.', exVi: 'Như đã nói ở trên, phần lớn người trả lời là sinh viên năm nhất.', more: '**{前述|ぜんじゅつ}のとおり／ように** · ↔ **{後述|こうじゅつ}** (sẽ nói ở sau) · ≈ {上記|じょうき} (ghi ở trên — văn bản công việc; Bài 38 có {下記|かき}). N1.' },
      ],
    },
    { t: 'h', text: 'E. Báo cáo công việc & khía cạnh (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{報告書|ほうこくしょ}', pos: 'danh từ', ipa: 'houkokusho', vi: 'bản báo cáo (công việc)', ex: '{出張|しゅっちょう}から{戻|もど}ったら、{三日|みっか}{以内|いない}に{報告書|ほうこくしょ}を{提出|ていしゅつ}すること。', exRo: 'Shutchou kara modottara, mikka inai ni houkokusho o teishutsu suru koto.', exVi: 'Đi công tác về thì phải nộp báo cáo trong vòng ba ngày.', more: '**{報告書|ほうこくしょ}を{作成|さくせい}する／まとめる** · **{日報|にっぽう}** (báo cáo ngày) · ≠ レポート (bài báo cáo ở trường) — xem hội thoại ②. N2.' },
        { w: '{議事録|ぎじろく}', pos: 'danh từ', ipa: 'gijiroku', vi: 'biên bản cuộc họp', ex: '{会議|かいぎ}の{議事録|ぎじろく}は、{新人|しんじん}が{書|か}くことになっている。', exRo: 'Kaigi no gijiroku wa, shinjin ga kaku koto ni natte iru.', exVi: 'Biên bản họp theo lệ là do nhân viên mới viết.', more: '**{議事録|ぎじろく}をとる／{作成|さくせい}する** · {議事|ぎじ} = nội dung bàn bạc · việc đầu tiên của nhân viên mới ở nhiều công ty. N1.' },
        { w: '{進捗|しんちょく}', pos: 'danh từ', ipa: 'shinchoku', vi: 'tiến độ', ex: '{毎週|まいしゅう}{金曜日|きんようび}に、プロジェクトの{進捗|しんちょく}を{報告|ほうこく}する。', exRo: 'Maishuu kin\'youbi ni, purojekuto no shinchoku o houkoku suru.', exVi: 'Thứ Sáu hằng tuần báo cáo tiến độ dự án.', more: '**{進捗状況|しんちょくじょうきょう}** · **{進捗|しんちょく}が{遅|おく}れる** · từ công ty IT dùng hằng ngày (chữ 捗 khó — chỉ cần đọc được). N1.' },
        { w: '{費用対効果|ひようたいこうか}', pos: 'danh từ', ipa: 'hiyou tai kouka', vi: 'hiệu quả so với chi phí', ex: '{新|あたら}しいシステムは、{費用対効果|ひようたいこうか}の{面|めん}で{優|すぐ}れている。', exRo: 'Atarashii shisutemu wa, hiyou tai kouka no men de sugurete iru.', exVi: 'Hệ thống mới vượt trội về mặt hiệu quả so với chi phí.', more: '**{費用対効果|ひようたいこうか}が{高|たか}い／{低|ひく}い** · 対 = ĐỐI (so với) · tiếng Anh: cost-effectiveness · ～の{面|めん}で (ngữ pháp ②). N1.' },
        { w: '{改善策|かいぜんさく}', pos: 'danh từ', ipa: 'kaizensaku', vi: 'biện pháp cải thiện', ex: '{問題点|もんだいてん}を{分析|ぶんせき}した{上|うえ}で、{改善策|かいぜんさく}を{提案|ていあん}する。', exRo: 'Mondaiten o bunseki shita ue de, kaizensaku o teian suru.', exVi: 'Phân tích các vấn đề rồi mới đề xuất biện pháp cải thiện.', more: 'ôn **{改善|かいぜん}** (Bài 34) · **～{策|さく}** = biện pháp: {対策|たいさく} (Bài 38)・{解決策|かいけつさく} (biện pháp giải quyết) · ～た{上|うえ}で (ngữ pháp ①). N2.' },
        { w: '{重視|じゅうし}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'juushi (suru)', vi: 'coi trọng', ex: 'この{会社|かいしゃ}は、{学歴|がくれき}より{経験|けいけん}を{重視|じゅうし}している。', exRo: 'Kono kaisha wa, gakureki yori keiken o juushi shite iru.', exVi: 'Công ty này coi trọng kinh nghiệm hơn bằng cấp.', more: '↔ **{軽視|けいし}** (xem nhẹ) · ≈ {大切|たいせつ}にする · **{重視|じゅうし}される{点|てん}** · 視 = THỊ (chữ mới). N2.' },
        { w: '{視野|しや}', pos: 'danh từ', ipa: 'shiya', vi: 'tầm nhìn', ex: '{留学|りゅうがく}をして、{視野|しや}が{広|ひろ}がった。', exRo: 'Ryuugaku o shite, shiya ga hirogatta.', exVi: 'Nhờ đi du học, tầm nhìn của tôi đã rộng ra.', more: '**{視野|しや}が{広|ひろ}い／{狭|せま}い** · **～を{視野|しや}に{入|い}れる** (tính tới cả…) · ôn {視点|してん} (Bài 43 — điểm nhìn). N2.' },
        { w: '{徹底|てってい}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'tettei (suru)', vi: 'triệt để, quán triệt', ex: '{個人情報|こじんじょうほう}の{管理|かんり}を{徹底|てってい}する。', exRo: 'Kojin jouhou no kanri o tettei suru.', exVi: 'Quản lý thông tin cá nhân một cách triệt để.', more: '**{徹底的|てっていてき}に{調|しら}べる** · **ルールを{徹底|てってい}させる** · 徹 = TRIỆT (Bài 45), 底 = ĐỂ (đáy — ôn: Bài 51): "xuyên tới đáy". N2.' },
        { w: '{模範|もはん}', pos: 'danh từ', ipa: 'mohan', vi: 'mẫu mực, gương mẫu', ex: '{先生|せんせい}が{配|くば}った{模範解答|もはんかいとう}を{見|み}て、{自分|じぶん}の{答案|とうあん}を{直|なお}した。', exRo: 'Sensei ga kubatta mohan kaitou o mite, jibun no touan o naoshita.', exVi: 'Tôi xem đáp án mẫu thầy phát rồi sửa bài làm của mình.', more: '**{模範解答|もはんかいとう}** (đáp án mẫu) · **{模範|もはん}となる** (làm gương) · 模・範 = MÔ PHẠM (cả hai chữ mới). N1.' },
        { w: '{側面|そくめん}', pos: 'danh từ', ipa: 'sokumen', vi: 'mặt, khía cạnh', ex: 'SNSには、{便利|べんり}な{側面|そくめん}と{危険|きけん}な{側面|そくめん}がある。', exRo: 'Esu-enu-esu ni wa, benri na sokumen to kiken na sokumen ga aru.', exVi: 'Mạng xã hội có mặt tiện lợi và mặt nguy hiểm.', more: '**～という{側面|そくめん}** · **{様々|さまざま}な{側面|そくめん}から{考|かんが}える** · ≈ {面|めん} (ngữ pháp ② — ～の面で). N1.' },
        { w: '{精神的|せいしんてき}（な）', pos: 'tính từ ナ', ipa: 'seishinteki (na)', vi: '(thuộc) tinh thần', ex: '{一人暮|ひとりぐ}らしは、{経済的|けいざいてき}にも{精神的|せいしんてき}にも{大変|たいへん}だ。', exRo: 'Hitorigurashi wa, keizaiteki ni mo seishinteki ni mo taihen da.', exVi: 'Sống một mình vất vả cả về kinh tế lẫn tinh thần.', more: '**{精神的|せいしんてき}な{面|めん}で／{精神面|せいしんめん}で** (ngữ pháp ②) · ↔ {肉体的|にくたいてき} (thể xác) · **{精神的|せいしんてき}に{疲|つか}れる**. N2.' },
        { w: '{出版|しゅっぱん}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'shuppan (suru)', vi: 'xuất bản', ex: '{先生|せんせい}は{去年|きょねん}、{留学生|りゅうがくせい}のための{文法|ぶんぽう}の{本|ほん}を{出版|しゅっぱん}した。', exRo: 'Sensei wa kyonen, ryuugakusei no tame no bunpou no hon o shuppan shita.', exVi: 'Năm ngoái thầy đã xuất bản cuốn sách ngữ pháp dành cho du học sinh.', more: '**{出版社|しゅっぱんしゃ}** · **{出版年|しゅっぱんねん}** (năm xuất bản — phải ghi khi trích dẫn) · 版 = BẢN (chữ mới). N2.' },
        { w: '{改訂|かいてい}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'kaitei (suru)', vi: 'sửa đổi, hiệu đính (sách, tài liệu, quy định)', ex: 'この{辞書|じしょ}は{十年|じゅうねん}ぶりに{改訂|かいてい}された。', exRo: 'Kono jisho wa juunen buri ni kaitei sareta.', exVi: 'Cuốn từ điển này được sửa đổi sau mười năm.', more: '**{改訂版|かいていばん}** (bản sửa đổi) · ≈ {改正|かいせい} (sửa luật) · khi trích dẫn sách có nhiều bản: ghi rõ **{第|だい}2{版|はん}**. N1.' },
      ],
    },
    /* ── Thẻ hình ── */
    {
      t: 'hinh',
      title: 'Thẻ từ có hình — chạm để nghe (22 từ)',
      items: [
        { anh: 'writing-hand', w: '{執筆|しっぴつ}', ro: 'shippitsu', vi: 'chấp bút, viết (hình: tay đang viết)' },
        { anh: 'open-book', w: '{章|しょう}', ro: 'shou', vi: 'chương (hình: cuốn sách mở)' },
        { anh: 'bookmark-tabs', w: '{見出|みだ}し', ro: 'midashi', vi: 'tiêu đề mục (hình: các tab đánh dấu mục)' },
        { anh: 'memo', w: '{箇条書|かじょうが}き', ro: 'kajougaki', vi: 'gạch đầu dòng (hình: tờ ghi chú từng dòng)' },
        { anh: 'scissors', w: '{要約|ようやく}', ro: 'youyaku', vi: 'tóm tắt (hình: cái kéo — cắt còn ý chính)' },
        { anh: 'books', w: '{参考文献|さんこうぶんけん}', ro: 'sankou bunken', vi: 'tài liệu tham khảo (hình: chồng sách)' },
        { anh: 'link', w: '{参照|さんしょう}', ro: 'sanshou', vi: 'tham chiếu (hình: mắt xích nối tới chỗ khác)' },
        { anh: 'magnifying-glass-tilted-left', w: '{考察|こうさつ}', ro: 'kousatsu', vi: 'khảo sát, bàn luận (hình: kính lúp)' },
        { anh: 'light-bulb', w: '{示唆|しさ}', ro: 'shisa', vi: 'gợi ý (hình: bóng đèn)' },
        { anh: 'framed-picture', w: '{枠組|わくぐ}み', ro: 'wakugumi', vi: 'khung, khuôn khổ (hình: khung tranh)' },
        { anh: 'ladder', w: '{段階|だんかい}', ro: 'dankai', vi: 'giai đoạn, bước (hình: cái thang — từng bậc)' },
        { anh: 'megaphone', w: '{提唱|ていしょう}', ro: 'teishou', vi: 'đề xướng (hình: cái loa — kêu gọi mọi người)' },
        { anh: 'balance-scale', w: '{是非|ぜひ}', ro: 'zehi', vi: 'đúng sai, nên hay không (hình: cái cân)' },
        { anh: 'speaking-head', w: '{話|はな}し{言葉|ことば}', ro: 'hanashikotoba', vi: 'văn nói (hình: người đang nói)' },
        { anh: 'fountain-pen', w: '{書|か}き{言葉|ことば}', ro: 'kakikotoba', vi: 'văn viết (hình: bút máy)' },
        { anh: 'page-facing-up', w: '{報告書|ほうこくしょ}', ro: 'houkokusho', vi: 'bản báo cáo (hình: tờ giấy văn bản)' },
        { anh: 'clipboard', w: '{議事録|ぎじろく}', ro: 'gijiroku', vi: 'biên bản họp (hình: bảng kẹp giấy)' },
        { anh: 'chart-increasing', w: '{進捗|しんちょく}', ro: 'shinchoku', vi: 'tiến độ (hình: biểu đồ đi lên)' },
        { anh: 'hammer-and-wrench', w: '{改善策|かいぜんさく}', ro: 'kaizensaku', vi: 'biện pháp cải thiện (hình: dụng cụ sửa chữa)' },
        { anh: 'telescope', w: '{視野|しや}', ro: 'shiya', vi: 'tầm nhìn (hình: kính viễn vọng)' },
        { anh: 'printer', w: '{出版|しゅっぱん}', ro: 'shuppan', vi: 'xuất bản (hình: máy in)' },
        { anh: 'check-mark-button', w: '{妥当|だとう}', ro: 'datou', vi: 'hợp lý, thoả đáng (hình: dấu tích đúng)' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ dễ nhầm (類義語) — đề N2 hay hỏi ở dạng 文脈規定・言い換え類義',
      head: ['Cặp', 'Khác nhau ở đâu', 'Ví dụ', 'Romaji'],
      rows: [
        ['{要旨|ようし} ↔ {要約|ようやく} ↔ {概要|がいよう} ↔ {要点|ようてん}', '{要旨|ようし}: Ý CHÍNH của người viết (chủ trương cốt lõi) · {要約|ようやく}: RÚT GỌN cả nội dung theo trình tự · {概要|がいよう}: bức tranh KHÁI QUÁT (sự việc, dự án) · {要点|ようてん}: các ĐIỂM quan trọng (Bài 30)', '{筆者|ひっしゃ}の{主張|しゅちょう}の{要旨|ようし}／{講義|こうぎ}を{要約|ようやく}する／{事業|じぎょう}の{概要|がいよう}／{要点|ようてん}をメモする', 'hissha no shuchou no youshi / kougi o youyaku suru / jigyou no gaiyou / youten o memo suru'],
        ['{考察|こうさつ} ↔ {感想|かんそう} ↔ {分析|ぶんせき}', '{考察|こうさつ}: suy luận ý nghĩa, nguyên nhân CÓ CĂN CỨ · {感想|かんそう}: cảm nghĩ cá nhân (Bài 28) · {分析|ぶんせき}: chia nhỏ dữ liệu để thấy cấu trúc (Bài 33)', '{結果|けっか}を{分析|ぶんせき}し、その{原因|げんいん}を{考察|こうさつ}する／{読書|どくしょ}の{感想|かんそう}', 'kekka o bunseki shi, sono gen\'in o kousatsu suru / dokusho no kansou'],
        ['{示唆|しさ} ↔ {示|しめ}す ↔ {指摘|してき}', '{示唆|しさ}: cho thấy GIÁN TIẾP, gợi ra khả năng · {示|しめ}す: cho thấy RÕ (Bài 28) · {指摘|してき}: CHỈ RA một điểm (thường là vấn đề, lỗi — Bài 35)', '{結果|けっか}が～を{示唆|しさ}する／グラフが{増加|ぞうか}を{示|しめ}す／{問題点|もんだいてん}を{指摘|してき}する', 'kekka ga ~ o shisa suru / gurafu ga zouka o shimesu / mondaiten o shiteki suru'],
        ['{言及|げんきゅう} ↔ {触|ふ}れる ↔ {述|の}べる', '{言及|げんきゅう}: ĐỀ CẬP tới một chủ đề (văn viết) · {触|ふ}れる: NHẮC QUA (thuần Nhật) · {述|の}べる: TRÌNH BÀY nội dung, ý kiến (Bài 28)', '{原因|げんいん}に{言及|げんきゅう}する／{少|すこ}しだけ{触|ふ}れる／{意見|いけん}を{述|の}べる', 'gen\'in ni genkyuu suru / sukoshi dake fureru / iken o noberu'],
        ['{論|ろん}じる ↔ {議論|ぎろん}する', '{論|ろん}じる: MỘT người trình bày có lập luận (bài viết) · {議論|ぎろん}する: NHIỀU người bàn, tranh luận với nhau (Bài 28)', '{本稿|ほんこう}では～を{論|ろん}じる／ゼミで～について{議論|ぎろん}した', 'honkou de wa ~ o ronjiru / zemi de ~ ni tsuite giron shita'],
        ['{提唱|ていしょう} ↔ {提案|ていあん} ↔ {唱|とな}える', '{提唱|ていしょう}: đưa ra tư tưởng, lý thuyết MỚI cho xã hội · {提案|ていあん}: đề xuất một PHƯƠNG ÁN cụ thể (Bài 28) · {唱|とな}える: nêu lên (ý kiến, thuyết) — thuần Nhật, hay đi với {異論|いろん}', '{新|あたら}しい{理論|りろん}を{提唱|ていしょう}する／{改善策|かいぜんさく}を{提案|ていあん}する／{異論|いろん}を{唱|とな}える', 'atarashii riron o teishou suru / kaizensaku o teian suru / iron o tonaeru'],
        ['{手法|しゅほう} ↔ {方法|ほうほう} ↔ {手段|しゅだん}', '{手法|しゅほう}: KỸ THUẬT chuyên môn (nghiên cứu, nghệ thuật) · {方法|ほうほう}: cách làm nói chung (Bài 21) · {手段|しゅだん}: PHƯƠNG TIỆN để đạt mục đích (Bài 27)', '{調査|ちょうさ}の{手法|しゅほう}／{勉強|べんきょう}の{方法|ほうほう}／{交通手段|こうつうしゅだん}', 'chousa no shuhou / benkyou no houhou / koutsuu shudan'],
        ['{普遍的|ふへんてき} ↔ {一般的|いっぱんてき} ↔ {典型的|てんけいてき}', '{普遍的|ふへんてき}: đúng ở MỌI nơi, mọi thời · {一般的|いっぱんてき}: phần ĐÔNG, thông thường (Bài 28) · {典型的|てんけいてき}: tiêu biểu nhất cho một loại', '{普遍的|ふへんてき}な{価値|かち}／{一般的|いっぱんてき}な{考|かんが}え{方|かた}／{典型的|てんけいてき}な{例|れい}', 'fuhenteki na kachi / ippanteki na kangaekata / tenkeiteki na rei'],
        ['{簡潔|かんけつ} ↔ {簡単|かんたん} ↔ {明確|めいかく}', '{簡潔|かんけつ}: ÍT CHỮ mà đủ ý (văn) · {簡単|かんたん}: DỄ, đơn giản (việc, câu hỏi) · {明確|めいかく}: RÕ RÀNG, không mơ hồ', '{簡潔|かんけつ}な{文章|ぶんしょう}／{簡単|かんたん}な{問題|もんだい}／{明確|めいかく}な{基準|きじゅん}', 'kanketsu na bunshou / kantan na mondai / meikaku na kijun'],
        ['{堅|かた}い ↔ {硬|かた}い ↔ {固|かた}い', '{堅|かた}い: CHẮC, nghiêm (文章・仕事・口が～) · {硬|かた}い: CỨNG về chất (đá, kim loại; 表情が～ — Bài 50) · {固|かた}い: RẮN, CHẶT (決意・結び目)', '{文章|ぶんしょう}が{堅|かた}い／{石|いし}が{硬|かた}い／{決意|けつい}が{固|かた}い', 'bunshou ga katai / ishi ga katai / ketsui ga katai'],
        ['{参照|さんしょう} ↔ {参考|さんこう} ↔ {引用|いんよう}', '{参照|さんしょう}: XEM một chỗ khác để đối chiếu · {参考|さんこう}にする: lấy làm THAM KHẢO (không chép) · {引用|いんよう}: CHÉP nguyên câu của người khác vào bài, có ghi nguồn (Bài 33)', '{表|ひょう}2を{参照|さんしょう}／{先輩|せんぱい}のレポートを{参考|さんこう}にする／{本|ほん}の{一文|いちぶん}を{引用|いんよう}する', 'hyou ni o sanshou / senpai no repooto o sankou ni suru / hon no ichibun o in\'you suru'],
        ['{前述|ぜんじゅつ} ↔ {上記|じょうき} ↔ {下記|かき} ↔ {後述|こうじゅつ}', '{前述|ぜんじゅつ}: đã NÓI ở trên (văn luận) · {上記|じょうき}: GHI ở trên (văn bản công việc, thông báo) · {下記|かき}: ghi ở DƯỚI (Bài 38) · {後述|こうじゅつ}: sẽ nói ở SAU', '{前述|ぜんじゅつ}のとおり／{上記|じょうき}の{日程|にってい}／{下記|かき}の{通|とお}り／{詳|くわ}しくは{後述|こうじゅつ}する', 'zenjutsu no toori / jouki no nittei / kaki no toori / kuwashiku wa koujutsu suru'],
        ['{報告書|ほうこくしょ} ↔ レポート ↔ {議事録|ぎじろく}', '{報告書|ほうこくしょ}: báo cáo CÔNG VIỆC gửi cấp trên (kết luận trước) · レポート: bài báo cáo Ở TRƯỜNG (序論→本論→結論) · {議事録|ぎじろく}: BIÊN BẢN ghi lại cuộc họp', '{出張|しゅっちょう}の{報告書|ほうこくしょ}／{期末|きまつ}レポート／{会議|かいぎ}の{議事録|ぎじろく}', 'shucchou no houkokusho / kimatsu repooto / kaigi no gijiroku'],
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '**{序論|じょろん}で{目的|もくてき}を{述|の}べる** · **{本論|ほんろん}に{入|はい}る** · **{構成|こうせい}を{考|かんが}える／{見直|みなお}す** · **{章|しょう}を{分|わ}ける** · **{段落|だんらく}を{改|あらた}める** (xuống đoạn) · **{見出|みだ}しをつける** · **{要旨|ようし}をまとめる** · **{内容|ないよう}を{要約|ようやく}する** · **{概要|がいよう}を{説明|せつめい}する** · **{箇条書|かじょうが}きにする** · **{冒頭|ぼうとう}で{述|の}べる** · **{末尾|まつび}に{記|しる}す** · **{字数|じすう}を{守|まも}る** · **{論文|ろんぶん}を{執筆|しっぴつ}する**.',
        '**{先行研究|せんこうけんきゅう}を{整理|せいり}する** · **{考察|こうさつ}を{加|くわ}える** · **{手法|しゅほう}を{用|もち}いる** · **{範囲|はんい}を{限定|げんてい}する** · **～を{前提|ぜんてい}とする** · **{枠組|わくぐ}みを{示|しめ}す** · **{仮説|かせつ}を{実証|じっしょう}する** · **～を{強|つよ}く{示唆|しさ}する** · **{原因|げんいん}を{明|あき}らかにする** · **{概念|がいねん}を{定義|ていぎ}する** · **{典型的|てんけいてき}な{例|れい}を{挙|あ}げる** · **{普遍的|ふへんてき}な{問題|もんだい}** · **{段階的|だんかいてき}に{進|すす}める**.',
        '**{出典|しゅってん}を{明記|めいき}する** · **{参考文献|さんこうぶんけん}を{挙|あ}げる** · **{表|ひょう}を{参照|さんしょう}する** · **～に{言及|げんきゅう}する** · **～について{論|ろん}じる** · **{新説|しんせつ}を{提唱|ていしょう}する** · **{異論|いろん}を{唱|とな}える** · **{反論|はんろん}の{余地|よち}がない** · **{論点|ろんてん}を{整理|せいり}する** · **～の{是非|ぜひ}を{問|と}う** · **{妥当|だとう}な{判断|はんだん}** · **{一貫|いっかん}した{主張|しゅちょう}** · **{倫理|りんり}に{反|はん}する**.',
        '**{話|はな}し{言葉|ことば}を{書|か}き{言葉|ことば}に{直|なお}す** · **{文体|ぶんたい}を{統一|とういつ}する** · **{簡潔|かんけつ}に{述|の}べる** · **{明確|めいかく}な{根拠|こんきょ}** · **{表現|ひょうげん}が{堅|かた}い** · **{詳|くわ}しく{記述|きじゅつ}する** · **{説明|せつめい}を{補足|ほそく}する** · **～に{留意|りゅうい}する** · **きわめて{重要|じゅうよう}である** · **いわゆる「～」** · **{前述|ぜんじゅつ}のとおり**.',
        '**{報告書|ほうこくしょ}を{作成|さくせい}する** · **{議事録|ぎじろく}をとる** · **{進捗|しんちょく}を{報告|ほうこく}する** · **{費用対効果|ひようたいこうか}が{高|たか}い** · **{改善策|かいぜんさく}を{講|こう}じる** (thi hành biện pháp — N1) · **{経験|けいけん}を{重視|じゅうし}する** · **{視野|しや}が{広|ひろ}がる・～を{視野|しや}に{入|い}れる** · **{管理|かんり}を{徹底|てってい}する** · **{模範|もはん}となる** · **{様々|さまざま}な{側面|そくめん}** · **{精神的|せいしんてき}な{負担|ふたん}** · **{本|ほん}を{出版|しゅっぱん}する** · **{規則|きそく}を{改訂|かいてい}する**.',
      ],
    },
    {
      t: 'write',
      id: 'b52-viet-tu',
      title: 'Viết tay 12 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['序論', '構成', '要旨', '冒頭', '考察', '範囲', '出典', '示唆', '文体', '簡潔', '重視', '視野'],
      goi: {
        '序論': 'じょろん · phần mở đầu',
        '構成': 'こうせい · bố cục',
        '要旨': 'ようし · ý chính tóm tắt',
        '冒頭': 'ぼうとう · phần đầu',
        '考察': 'こうさつ · bàn luận (kết quả)',
        '範囲': 'はんい · phạm vi',
        '出典': 'しゅってん · nguồn trích',
        '示唆': 'しさ · gợi ý, cho thấy',
        '文体': 'ぶんたい · văn phong',
        '簡潔': 'かんけつ · ngắn gọn',
        '重視': 'じゅうし · coi trọng',
        '視野': 'しや · tầm nhìn',
      },
    },
    {
      t: 'mcq',
      id: 'b52-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 18 câu (dạng 文脈規定・言い換え類義・用法 của đề N2)',
      items: [
        MQ('レポートの（　）では、{研究|けんきゅう}の{背景|はいけい}と{目的|もくてき}を{述|の}べる。', '{序論|じょろん}', ['{末尾|まつび}', '{出典|しゅってん}', '{議事録|ぎじろく}'], 'Phần đầu bài, trình bày bối cảnh + mục đích → **{序論|じょろん}**. 〔Repooto no joron de wa…〕'),
        MQ('{本|ほん}や{論文|ろんぶん}から{引用|いんよう}した{時|とき}は、{必|かなら}ず（　）を{書|か}くこと。', '{出典|しゅってん}', ['{見出|みだ}し', '{要旨|ようし}', '{字数|じすう}'], 'Trích dẫn thì ghi **nguồn** → **{出典|しゅってん}**. 〔Kanarazu shutten o kaku koto.〕'),
        MQ('アンケートの{結果|けっか}を{示|しめ}した{後|あと}、なぜそうなったのかを（　）する。', '{考察|こうさつ}', ['{執筆|しっぴつ}', '{出版|しゅっぱん}', '{参照|さんしょう}'], 'Suy luận nguyên nhân của kết quả → **{考察|こうさつ}**. 〔Naze sou natta no ka o kousatsu suru.〕'),
        MQ('この{調査|ちょうさ}の（　）は、{市内|しない}に{住|す}む{二十代|にじゅうだい}の{会社員|かいしゃいん}に{限|かぎ}られている。', '{範囲|はんい}', ['{段落|だんらく}', '{側面|そくめん}', '{概念|がいねん}'], 'Giới hạn đối tượng khảo sát → **{範囲|はんい}**. 〔Kono chousa no han\'i wa…〕'),
        MQ('{今回|こんかい}の{結果|けっか}は、{運動|うんどう}と{記憶力|きおくりょく}に{関係|かんけい}があることを（　）している。', '{示唆|しさ}', ['{改訂|かいてい}', '{統一|とういつ}', '{補足|ほそく}'], 'Kết quả GỢI RA một khả năng → **{示唆|しさ}する**. 〔Kankei ga aru koto o shisa shite iru.〕'),
        MQ('{会議|かいぎ}で、{部長|ぶちょう}の{案|あん}に{異論|いろん}を（　）{人|ひと}はいなかった。', '{唱|とな}える', ['{論|ろん}じる', '{記述|きじゅつ}する', '{要約|ようやく}する'], 'Cụm cố định **{異論|いろん}を{唱|とな}える** (nêu ý kiến phản đối). 〔Iron o tonaeru hito wa inakatta.〕'),
        MQ('レポートでは、です・ます{体|たい}とだ・である{体|たい}を{混|ま}ぜずに、{文体|ぶんたい}を（　）すること。', '{統一|とういつ}', ['{実証|じっしょう}', '{提唱|ていしょう}', '{徹底|てってい}'], 'Không trộn → **{文体|ぶんたい}を{統一|とういつ}する**. 〔Buntai o touitsu suru koto.〕'),
        MQ('{報告書|ほうこくしょ}は{長|なが}く{書|か}かず、{要点|ようてん}を（　）にまとめてください。', '{簡潔|かんけつ}', ['{典型的|てんけいてき}', '{普遍的|ふへんてき}', '{精神的|せいしんてき}'], 'Không viết dài, gom ý chính ngắn gọn → **{簡潔|かんけつ}に**. 〔Youten o kanketsu ni matomete kudasai.〕'),
        MQ('{毎週|まいしゅう}の{会議|かいぎ}で、プロジェクトの（　）を{報告|ほうこく}する。', '{進捗|しんちょく}', ['{冒頭|ぼうとう}', '{論点|ろんてん}', '{模範|もはん}'], 'Tiến độ dự án → **{進捗|しんちょく}**. 〔Purojekuto no shinchoku o houkoku suru.〕'),
        MQ('{今回|こんかい}の{会議|かいぎ}の（　）は、{新人|しんじん}の{田村|たむら}さんにお{願|ねが}いします。', '{議事録|ぎじろく}', ['{出典|しゅってん}', '{字数|じすう}', '{先行研究|せんこうけんきゅう}'], 'Ghi lại cuộc họp → **{議事録|ぎじろく}**. 〔Kaigi no gijiroku wa…〕'),
        MQ('「{要旨|ようし}」に{最|もっと}も{近|ちか}いのは？', '{一番|いちばん}{言|い}いたい{内容|ないよう}', ['{最初|さいしょ}の{一文|いちぶん}', '{使|つか}った{資料|しりょう}の{名前|なまえ}', '{書|か}いた{人|ひと}の{感想|かんそう}'], '**{要旨|ようし}** = ý chính (điều người viết muốn nói nhất). 〔Ichiban iitai naiyou.〕'),
        MQ('「この{問題|もんだい}には{言及|げんきゅう}していない」に{最|もっと}も{近|ちか}いのは？', 'この{問題|もんだい}には{触|ふ}れていない', ['この{問題|もんだい}を{解決|かいけつ}していない', 'この{問題|もんだい}に{反対|はんたい}していない', 'この{問題|もんだい}を{調|しら}べていない'], '**{言及|げんきゅう}する** ≈ **{触|ふ}れる** (nhắc tới). 〔Kono mondai ni wa furete inai.〕'),
        MQ('「きわめて{重要|じゅうよう}だ」に{最|もっと}も{近|ちか}いのは？', '{非常|ひじょう}に{重要|じゅうよう}だ', ['{少|すこ}し{重要|じゅうよう}だ', '{意外|いがい}に{重要|じゅうよう}だ', 'それほど{重要|じゅうよう}ではない'], '**きわめて** = {非常|ひじょう}に (văn viết). 〔Hijou ni juuyou da.〕'),
        MQ('「{前述|ぜんじゅつ}のとおり」に{最|もっと}も{近|ちか}いのは？', '{先|さき}に{述|の}べたように', ['これから{述|の}べるように', '{誰|だれ}もが{言|い}うように', '{先生|せんせい}が{言|い}ったように'], '**{前述|ぜんじゅつ}** = đã nói ở trước (trong cùng bài). ↔ {後述|こうじゅつ}. 〔Saki ni nobeta you ni.〕'),
        MQ('「{妥当|だとう}な{結論|けつろん}」に{最|もっと}も{近|ちか}いのは？', '{無理|むり}のない、{納得|なっとく}できる{結論|けつろん}', ['{誰|だれ}も{考|かんが}えなかった{結論|けつろん}', 'まだ{出|で}ていない{結論|けつろん}', '{短|みじか}くまとめた{結論|けつろん}'], '**{妥当|だとう}** = hợp lý, thoả đáng → không gượng ép, thuyết phục được. 〔Muri no nai, nattoku dekiru ketsuron.〕'),
        MQ('「{一貫|いっかん}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', '{彼|かれ}の{主張|しゅちょう}は、{最初|さいしょ}から{最後|さいご}まで{一貫|いっかん}している。', ['{駅|えき}まで{一貫|いっかん}して{歩|ある}いて{十分|じゅっぷん}かかる。', '{昨日|きのう}、{一貫|いっかん}の{本|ほん}を{買|か}った。', '{料理|りょうり}を{一貫|いっかん}に{作|つく}った。'], '**{主張|しゅちょう}が{一貫|いっかん}している** = nhất quán. Các câu kia ghép sai nghĩa. 〔Shuchou wa… ikkan shite iru.〕'),
        MQ('「{留意|りゅうい}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', 'アンケートを{作|つく}る{際|さい}は、{質問|しつもん}の{順番|じゅんばん}に{留意|りゅうい}する{必要|ひつよう}がある。', ['{友達|ともだち}を{駅|えき}で{留意|りゅうい}した。', '{来年|らいねん}、アメリカに{留意|りゅうい}する{予定|よてい}だ。', '{会議|かいぎ}の{時間|じかん}を{留意|りゅうい}して{遅|おく}れた。'], '**～に{留意|りゅうい}する** = lưu ý tới. Đi du học là **{留学|りゅうがく}**. 〔Junban ni ryuui suru hitsuyou ga aru.〕'),
        MQ('「{視野|しや}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', '{海外|かいがい}で{働|はたら}いて、{視野|しや}が{広|ひろ}がった。', ['{視野|しや}が{高|たか}くて、{店|みせ}の{料理|りょうり}は{有名|ゆうめい}だ。', '{明日|あした}の{視野|しや}は{晴|は}れるそうだ。', 'この{部屋|へや}は{視野|しや}が{寒|さむ}い。'], '**{視野|しや}が{広|ひろ}がる** = tầm nhìn rộng ra. 〔Shiya ga hirogatta.〕'),
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b52-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N2 — ～上で (た上で · る上で), ～面で (+ ～点で · ～において), だ・である体 (bảng chuyển + 中止形), ～べきだ／べきではない, ～ねばならない + 4 bảng phân biệt (上で・てから・際に・ために・うえに · 面で・点で・において・上・にとって · べきだ・はずだ・ものだ・なければならない・ほうがいい · ねばならない・ざるを得ない・しかない)',
  goal: 'Nối đúng năm mẫu (Vた上で／Nの上で; Vる上で／Nの上で; Nの面で／N面で／～的な面で; V辞書形＋べきだ, する→すべき; Vない（bỏ ない）＋ねばならない, する→せねば); dùng ～た上で cho "làm A cẩn thận rồi mới B" (相談した上で決める・ご確認の上) và ～る上で cho "khi làm việc gì thì điều gì quan trọng" (日本で働く上で、敬語は欠かせない), nhận ra N上 (法律上・健康上) và ～上では (暦の上では); đánh giá theo từng mặt bằng ～面で, phân biệt với ～という点で (điểm cụ thể) và ～において (văn viết của で); đổi mọi loại câu です・ます sang だ・である (N・ナA thêm である, イA và động từ KHÔNG thêm だ／である, ～のです→～のである, ～でしょう→～だろう／～であろう) và nối câu văn viết bằng 中止形 (～であり・～く・～ず・～ており); nêu chủ trương, nghĩa vụ đạo lý bằng ～べきだ／べきではない (không phải ~~ないべきだ~~), dùng べき＋N, べきだった, Nであるべきだ, phân biệt với はずだ・ものだ・なければならない・ほうがいい; hiểu ～ねばならない (văn viết, cổ) và đổi được sang なければならない, phân biệt với ざるを得ない (Bài 45) và しかない (Bài 47) — làm được dạng đề 文法形式の判断 và 文の組み立て ★.',
  minutes: 180,
  blocks: [
    {
      t: 'p',
      text: 'Năm mẫu của Bài 52 là **bộ đồ nghề của người VIẾT**: mỗi mẫu trả lời một câu hỏi bạn sẽ tự hỏi khi ngồi viết レポート hay {報告書|ほうこくしょ}. **(1) Làm việc này theo thứ tự nào, và cần gì khi làm?** — **～{上|うえ}で** (た上で = làm A cẩn thận rồi mới B; る上で = khi làm V thì…) · **(2) Đánh giá theo mặt nào?** — **～{面|めん}で** (về mặt kinh tế, an toàn, tinh thần…) và anh em **～という{点|てん}で** (ở điểm cụ thể), **～において** (văn viết của で) · **(3) Viết bằng giọng nào?** — **だ・である{体|たい}** (thể văn viết — nền của mọi bài luận và mọi bài đọc N2) · **(4) Chủ trương của mình là gì?** — **～べきだ／べきではない** · **(5) Nghĩa vụ nói bằng văn trang trọng thế nào?** — **～ねばならない** (= なければならない, văn viết cổ). Đề N2 thích đặt **上で ↔ うえに ↔ てから**, **べきだ ↔ はずだ ↔ ものだ**, **ねばならない ↔ ざるを得ない** làm đáp án nhiễu của nhau, nên bốn bảng phân biệt cuối mục là **phần bắt buộc**.',
    },
    {
      t: 'table',
      caption: 'Bản đồ Bài 52',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', 'Vた・Nの ＋ {上|うえ}で · Vる・Nの ＋ {上|うえ}で（は）· N{上|じょう}', '(a) sau khi (làm A cẩn thận) rồi mới B · (b) trong việc / khi làm V thì… · (c) về mặt N', '{相談|そうだん}した{上|うえ}で · {働|はたら}く{上|うえ}で · {法律上|ほうりつじょう}', 'N2 (Bài 29: nhận ra)'],
        ['②', 'Nの ＋ {面|めん}で · N{面|めん}で · ～{的|てき}な{面|めん}で (+ ～という{点|てん}で · Nにおいて)', 'về mặt N (+ ở điểm… · ở, trong — văn viết)', '{費用|ひよう}の{面|めん}で · {安全面|あんぜんめん}で', 'N2'],
        ['③', 'だ・である{体|たい} (常体)', 'thể văn viết: ～だ／～である · ～のである · ～であろう · 中止形 ～であり・～ず', '{学生|がくせい}である · {増加|ぞうか}したのである', 'kiến thức văn viết (đọc N2)'],
        ['④', 'V{辞書形|じしょけい} ＋ べきだ／べきではない (する→すべき) · べき＋N', 'nên / không nên (đạo lý, ý kiến của người nói)', '{守|まも}るべきだ · すべきではない', 'N3–N2 (Bài 32: giới thiệu)'],
        ['⑤', 'Vない（bỏ ない）＋ ねばならない (する→せねば)', 'phải (văn viết, cổ, trang trọng)', '{考|かんが}えねばならない', 'N2 (có bảng xếp N1)'],
        ['⑥', 'BẢNG — た{上|うえ}で ↔ てから ↔ た{後|あと}で ↔ {際|さい}に (Bài 41) ↔ うえに (Bài 29) · る{上|うえ}で ↔ ために ↔ には', '"rồi mới" / "khi làm…"', '—', 'N2'],
        ['⑦', 'BẢNG — {面|めん}で ↔ {点|てん}で ↔ において ↔ {上|じょう} ↔ にとって (Bài 30) ↔ について', '"về mặt / ở điểm / ở trong"', '—', 'N2'],
        ['⑧', 'BẢNG — べきだ ↔ はずだ (Bài 20) ↔ ものだ (Bài 32) ↔ なければならない ↔ ほうがいい ↔ ことだ (Bài 32)', '"nên / phải / chắc là"', '—', 'N3–N2'],
        ['⑨', 'BẢNG — ねばならない ↔ なければならない ↔ ざるを得ない (Bài 45) ↔ しかない (Bài 47) ↔ べきだ', '"phải"', '—', 'N2'],
      ],
    },

    /* ══════ ① 上で ══════ */
    { t: 'h', text: '① ～{上|うえ}で — "Sau khi… rồi mới…" · "Trong việc / khi làm…"' },
    {
      t: 'p',
      text: '**{上|うえ}** nghĩa đen là "**phía trên**". **～{上|うえ}で** có **hai cách dùng chính**, phân biệt bằng **thể của động từ đứng trước**. **(a) Vた ＋ {上|うえ}で** (hoặc **Nの ＋ {上|うえ}で** với danh từ chỉ hành động: {相談|そうだん}の{上|うえ}で・{検討|けんとう}の{上|うえ}で・{確認|かくにん}の{上|うえ}で): "**làm A (cẩn thận, đầy đủ) RỒI MỚI làm B**" — A là **bước cần có trước**, đứng "bên dưới" làm nền cho B. Vế B thường là **hành động có chủ ý** (quyết định, trả lời, nộp, đăng ký). **(b) Vる ＋ {上|うえ}で** (hoặc **Nの ＋ {上|うえ}で**: {仕事|しごと}の{上|うえ}で・{生活|せいかつ}の{上|うえ}で): "**trong việc / khi làm V thì…**" — vế sau là **lời đánh giá**: điều gì **quan trọng, cần thiết, cần chú ý, có ích, có vấn đề**. Cả hai đều mang giọng **trang trọng** — rất hay gặp trong hướng dẫn, thông báo, báo cáo, bài luận. Ngoài ra nhận ra **(c) N{上|じょう}** (đọc **じょう**, dính liền danh từ Hán: {法律上|ほうりつじょう}・{健康上|けんこうじょう}) = "về mặt N" và **～{上|うえ}では** = "theo / trên phương diện (con số, sổ sách)".',
    },
    {
      t: 'table',
      caption: 'Cách nối ～上で',
      head: ['Nghĩa', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['(a) rồi mới', 'Vた ＋ {上|うえ}で', '{相談|そうだん}した{上|うえ}で · よく{考|かんが}えた{上|うえ}で · {確認|かくにん}した{上|うえ}で', 'soudan shita ue de · yoku kangaeta ue de · kakunin shita ue de'],
        ['(a) rồi mới', 'N（hành động）＋ の ＋ {上|うえ}（で）', '{相談|そうだん}の{上|うえ}で · ご{確認|かくにん}の{上|うえ}、{検討|けんとう}の{上|うえ}', 'soudan no ue de · gokakunin no ue, kentou no ue'],
        ['(b) khi làm', 'V{辞書形|じしょけい} ＋ {上|うえ}で', '{働|はたら}く{上|うえ}で · {論文|ろんぶん}を{書|か}く{上|うえ}で', 'hataraku ue de · ronbun o kaku ue de'],
        ['(b) khi làm', 'N ＋ の ＋ {上|うえ}で', '{仕事|しごと}の{上|うえ}で · {生活|せいかつ}の{上|うえ}で', 'shigoto no ue de · seikatsu no ue de'],
        ['(b) đứng trước danh từ', 'Vる／Nの ＋ {上|うえ}での ＋ N', '{留学生|りゅうがくせい}を{受|う}け{入|い}れる{上|うえ}での{課題|かだい}', 'ryuugakusei o ukeireru ue de no kadai'],
        ['(c) về mặt (nhận ra)', 'N（Hán）＋ {上|じょう}', '{法律上|ほうりつじょう} · {健康上|けんこうじょう}の{理由|りゆう} · {歴史上|れきしじょう}', 'houritsujou · kenkoujou no riyuu · rekishijou'],
        ['(c) theo, trên… (nhận ra)', 'N ＋ の ＋ {上|うえ}では', '{暦|こよみ}の{上|うえ}では · データの{上|うえ}では', 'koyomi no ue de wa · deeta no ue de wa'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(a) A（Vた／Nの）＋ {上|うえ}で、B — LÀM A CẨN THẬN RỒI MỚI B',
          vi: 'A là **bước chuẩn bị bắt buộc** (bàn bạc, xem xét, kiểm tra, hiểu rõ); B là **hành động có chủ ý** dựa trên kết quả của A. Người làm A và B thường là **cùng một người** (hoặc A là điều người nghe được yêu cầu làm trước). Giọng trang trọng.',
          examples: [
            E('{両親|りょうしん}とよく{相談|そうだん}した{上|うえ}で、{留学|りゅうがく}するかどうか{決|き}めます。', 'Ryoushin to yoku soudan shita ue de, ryuugaku suru ka dou ka kimemasu.', 'Tôi sẽ bàn kỹ với bố mẹ rồi mới quyết định có đi du học hay không.'),
            E('{契約書|けいやくしょ}の{内容|ないよう}をよく{読|よ}んだ{上|うえ}で、サインしてください。', 'Keiyakusho no naiyou o yoku yonda ue de, sain shite kudasai.', 'Xin hãy đọc kỹ nội dung hợp đồng rồi mới ký.'),
            E('{先行研究|せんこうけんきゅう}を{整理|せいり}した{上|うえ}で、{研究|けんきゅう}のテーマを{決|き}めた。', 'Senkou kenkyuu o seiri shita ue de, kenkyuu no teema o kimeta.', 'Tôi sắp xếp lại các nghiên cứu đi trước rồi mới chọn đề tài nghiên cứu.'),
            E('{検討|けんとう}の{上|うえ}、{改|あらた}めてご{連絡|れんらく}いたします。', 'Kentou no ue, aratamete gorenraku itashimasu.', 'Chúng tôi sẽ xem xét rồi liên lạc lại với quý vị. (câu chuẩn của thư công việc)'),
            E('{注意事項|ちゅういじこう}をご{確認|かくにん}の{上|うえ}、お{申|もう}し{込|こ}みください。', 'Chuui jikou o gokakunin no ue, omoushikomi kudasai.', 'Xin vui lòng xem các điều cần lưu ý rồi mới đăng ký. (văn thông báo)'),
          ],
        },
        {
          formula: '(b) Vる／Nの ＋ {上|うえ}で、～（{大切|たいせつ}だ・{必要|ひつよう}だ・{役|やく}に{立|た}つ…）— TRONG VIỆC / KHI LÀM V THÌ…',
          vi: 'Vế trước là **một hoạt động** (lĩnh vực, mục tiêu); vế sau **đánh giá** điều gì cần, quan trọng, có ích, có vấn đề **cho hoạt động đó**. Hay đứng trong cấu trúc **～{上|うえ}で{大切|たいせつ}なのは～だ**. Không dùng để kể một hành động cụ thể đã xảy ra.',
          examples: [
            E('{日本|にほん}で{働|はたら}く{上|うえ}で、{敬語|けいご}は{欠|か}かせない。', 'Nihon de hataraku ue de, keigo wa kakasenai.', 'Khi làm việc ở Nhật, kính ngữ là thứ không thể thiếu.'),
            E('{論文|ろんぶん}を{書|か}く{上|うえ}で{最|もっと}も{大切|たいせつ}なのは、はっきりした{問|と}いを{立|た}てることだ。', 'Ronbun o kaku ue de mottomo taisetsu na no wa, hakkiri shita toi o tateru koto da.', 'Điều quan trọng nhất khi viết luận văn là đặt ra một câu hỏi rõ ràng.'),
            E('この{辞書|じしょ}は、{専門書|せんもんしょ}を{読|よ}む{上|うえ}で{役|やく}に{立|た}つ。', 'Kono jisho wa, senmonsho o yomu ue de yaku ni tatsu.', 'Cuốn từ điển này có ích khi đọc sách chuyên ngành.'),
            E('{仕事|しごと}の{上|うえ}で{困|こま}ったことがあれば、いつでも{相談|そうだん}してください。', 'Shigoto no ue de komatta koto ga areba, itsu demo soudan shite kudasai.', 'Nếu có gì khó khăn trong công việc, cứ hỏi tôi bất cứ lúc nào.'),
            E('{留学生|りゅうがくせい}を{増|ふ}やす{上|うえ}での{課題|かだい}は、{住|す}む{場所|ばしょ}の{確保|かくほ}である。', 'Ryuugakusei o fuyasu ue de no kadai wa, sumu basho no kakuho de aru.', 'Vấn đề đặt ra trong việc tăng du học sinh là bảo đảm chỗ ở. (上での＋N)'),
          ],
        },
        {
          formula: '(c — nhận ra) N{上|じょう} "về mặt N" · Nの{上|うえ}では "theo / trên phương diện N"',
          vi: '**N{上|じょう}** dính liền **danh từ Hán** (法律・健康・教育・歴史・計算・仕事…), đọc **じょう** — văn viết, ngắn gọn. **Nの{上|うえ}では** = "**nếu chỉ nhìn theo** (con số, lịch, giấy tờ) thì…" — thường hàm ý **thực tế lại khác**.',
          examples: [
            E('{健康上|けんこうじょう}の{理由|りゆう}で、{会社|かいしゃ}を{辞|や}めることになった。', 'Kenkoujou no riyuu de, kaisha o yameru koto ni natta.', 'Vì lý do sức khoẻ, tôi phải nghỉ việc ở công ty.'),
            E('{法律上|ほうりつじょう}は{問題|もんだい}ないが、{倫理|りんり}の{面|めん}では{疑問|ぎもん}が{残|のこ}る。', 'Houritsujou wa mondai nai ga, rinri no men de wa gimon ga nokoru.', 'Về mặt luật thì không vấn đề gì, nhưng về mặt đạo đức vẫn còn nghi vấn.'),
            E('{暦|こよみ}の{上|うえ}ではもう{春|はる}だが、まだ{毎日|まいにち}{寒|さむ}い。', 'Koyomi no ue de wa mou haru da ga, mada mainichi samui.', 'Theo lịch thì đã sang xuân, nhưng ngày nào cũng còn lạnh.'),
            E('データの{上|うえ}では{景気|けいき}は{回復|かいふく}しているが、{実感|じっかん}はない。', 'Deeta no ue de wa keiki wa kaifuku shite iru ga, jikkan wa nai.', 'Trên số liệu thì kinh tế đang hồi phục, nhưng không cảm nhận được.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～上で',
      lines: [
        { who: 'カルロス', role: 'b', text: 'リン、{就職先|しゅうしょくさき}、もう{決|き}めた？', ro: 'Rin, shuushokusaki, mou kimeta?', vi: 'Lin, chỗ làm cậu quyết chưa?' },
        { who: 'リン', role: 'a', text: 'ううん、まだ。{両親|りょうしん}と{相談|そうだん}した{上|うえ}で{決|き}めるつもり。', ro: 'Uun, mada. Ryoushin to soudan shita ue de kimeru tsumori.', vi: 'Chưa. Mình định bàn với bố mẹ rồi mới quyết.' },
        { who: 'カルロス', role: 'b', text: '{会社|かいしゃ}を{選|えら}ぶ{上|うえ}で、{一番|いちばん}{大切|たいせつ}にしていることは{何|なに}？', ro: 'Kaisha o erabu ue de, ichiban taisetsu ni shite iru koto wa nani?', vi: 'Khi chọn công ty, điều cậu coi trọng nhất là gì?' },
        { who: 'リン', role: 'a', text: '{長|なが}く{働|はたら}く{上|うえ}で、{人間関係|にんげんかんけい}がいいかどうかが{一番|いちばん}{大事|だいじ}だと{思|おも}う。', ro: 'Nagaku hataraku ue de, ningen kankei ga ii ka dou ka ga ichiban daiji da to omou.', vi: 'Để làm lâu dài, mình nghĩ quan trọng nhất là quan hệ giữa mọi người có tốt không.' },
        { who: 'カルロス', role: 'b', text: '{僕|ぼく}はインターンで{働|はたら}いてみた{上|うえ}で、{決|き}めようと{思|おも}ってる。', ro: 'Boku wa intaan de hataraite mita ue de, kimeyou to omotteru.', vi: 'Mình thì định làm thực tập thử rồi mới quyết.' },
        { who: 'リン', role: 'a', text: 'それがいいね。{実際|じっさい}に{働|はたら}いてみないと、{分|わ}からないこともあるし。', ro: 'Sore ga ii ne. Jissai ni hataraite minai to, wakaranai koto mo aru shi.', vi: 'Thế là hay đấy. Không thực sự làm thử thì có những chuyện mình không biết được.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — A ＋ 上で、B',
      head: ['Vế A', 'Câu hoàn chỉnh', 'Romaji', 'Nghĩa'],
      rows: [
        ['{説明|せつめい}を{聞|き}いた', '{説明|せつめい}を{聞|き}いた{上|うえ}で、{参加|さんか}するかどうか{決|き}めてください。', 'Setsumei o kiita ue de, sanka suru ka dou ka kimete kudasai.', '(a) nghe giải thích rồi mới quyết'],
        ['{内容|ないよう}を{理解|りかい}した', '{内容|ないよう}を{理解|りかい}した{上|うえ}で、{署名|しょめい}をお{願|ねが}いします。', 'Naiyou o rikai shita ue de, shomei o onegai shimasu.', '(a) hiểu nội dung rồi mới ký'],
        ['{面接|めんせつ}の', '{面接|めんせつ}の{上|うえ}、{採用|さいよう}を{決定|けってい}します。', 'Mensetsu no ue, saiyou o kettei shimasu.', '(a) phỏng vấn rồi mới quyết định tuyển'],
        ['{外国語|がいこくご}を{学|まな}ぶ', '{外国語|がいこくご}を{学|まな}ぶ{上|うえ}で、{毎日|まいにち}{続|つづ}けることが{大切|たいせつ}だ。', 'Gaikokugo o manabu ue de, mainichi tsuzukeru koto ga taisetsu da.', '(b) khi học ngoại ngữ, quan trọng là đều đặn'],
        ['チームで{働|はたら}く', 'チームで{働|はたら}く{上|うえ}で、{報告|ほうこく}と{連絡|れんらく}は{欠|か}かせない。', 'Chiimu de hataraku ue de, houkoku to renraku wa kakasenai.', '(b) làm việc nhóm thì báo cáo, liên lạc là thiết yếu'],
        ['{生活|せいかつ}の', '{生活|せいかつ}の{上|うえ}で{不便|ふべん}なことがあれば、{寮|りょう}の{事務室|じむしつ}に{言|い}ってください。', 'Seikatsu no ue de fuben na koto ga areba, ryou no jimushitsu ni itte kudasai.', '(b) có gì bất tiện trong sinh hoạt'],
      ],
    },
    { t: 'rule', formula: 'Vた／Nの ＋ 上で、B（意志）　·　Vる／Nの ＋ 上で、～（大切だ・必要だ・役に立つ）', vi: '(a) Vた上で = làm A cẩn thận rồi mới B (B là hành động có chủ ý) · (b) Vる上で = khi / trong việc làm V thì điều gì quan trọng, cần thiết. Thể た hay thể từ điển quyết định nghĩa. Giọng trang trọng.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～上で (sai → đúng)',
      items: [
        '**Dùng (a) cho hai việc nối tiếp bình thường**: ~~ご{飯|はん}を{食|た}べた{上|うえ}で、{歯|は}を{磨|みが}いた~~ (ăn rồi đánh răng — không có quan hệ "chuẩn bị → quyết định") → **ご{飯|はん}を{食|た}べてから、{歯|は}を{磨|みが}いた**. た上で chỉ dùng khi A là **bước cần có để làm B cho đúng**.',
        '**Vế sau (a) là hiện tượng tự nhiên**: ~~{雨|あめ}が{降|ふ}った{上|うえ}で、{風|かぜ}が{吹|ふ}いた~~ → vế sau phải là **hành động có chủ ý** (決める・答える・申し込む・提出する).',
        '**Nhầm thể**: ~~{日本|にほん}で{働|はたら}いた{上|うえ}で、{敬語|けいご}は{大切|たいせつ}だ~~ (thể た → nghĩa "rồi mới", không hợp với vế đánh giá) → **{日本|にほん}で{働|はたら}く{上|うえ}で、{敬語|けいご}は{大切|たいせつ}だ**.',
        '**Nhầm 上で với うえに (Bài 29)**: **～うえに** = "**không những… mà còn**" (cộng thêm): この{店|みせ}は{安|やす}い**うえに**おいしい. ~~この{店|みせ}は{安|やす}い{上|うえ}で、おいしい~~. Ghi nhớ: **うえに** cộng thêm ý · **上で** thứ tự / phạm vi hoạt động.',
        '**Danh từ (a) phải là danh từ CHỈ HÀNH ĐỘNG**: {相談|そうだん}の{上|うえ}・{確認|かくにん}の{上|うえ}・{検討|けんとう}の{上|うえ} ✓ · ~~{書類|しょるい}の{上|うえ}で{決|き}める~~ (書類 không phải hành động — và còn bị hiểu là "ở trên tờ giấy") → **{書類|しょるい}を{読|よ}んだ{上|うえ}で{決|き}める**.',
      ],
    },
    {
      t: 'note',
      title: 'Mở rộng — họ "上" cần nhận ra ở N2',
      items: [
        '**～{上|うえ}で** ↔ **～{上|うえ}は** (N1): **～{上|うえ}は** = "**một khi đã… thì**" (≈ **～{以上|いじょう}は** Bài 47): {引|ひ}き{受|う}けた{上|うえ}は、{最後|さいご}までやる. Chỉ cần nhận ra; tự viết thì dùng **以上は／からには** (Bài 47).',
        '**～{上|うえ}に** (Bài 29) = **thêm vào đó** · **～{上|うえ}で** (bài này) = **rồi mới / khi làm** · **～{上|うえ}は** (N1) = **một khi đã** · **N{上|じょう}** = **về mặt** · **～{上|うえ}では** = **theo (con số, lịch)**. Một chữ 上 — năm cách dùng; nhìn **chữ đi sau (に／で／は)** và **cách đọc (うえ／じょう)**.',
        '**N{上|じょう}** hay gặp trong bài đọc: **{教育上|きょういくじょう}よくない** (về mặt giáo dục thì không tốt) · **{歴史上|れきしじょう}{初|はじ}めて** (lần đầu trong lịch sử) · **{仕事上|しごとじょう}の{付|つ}き{合|あ}い** (quan hệ vì công việc) · **{計算上|けいさんじょう}は** (theo tính toán thì) · **インターネット{上|じょう}で** (trên mạng).',
      ],
    },

    /* ══════ ② 面で ══════ */
    { t: 'h', text: '② ～{面|めん}で — "Về mặt…" (+ ～という{点|てん}で · ～において)' },
    {
      t: 'p',
      text: '**{面|めん}** = "**mặt, phương diện**" (như một mặt của khối hộp). **～{面|めん}で** chia một sự việc thành **nhiều mặt** rồi nói về **một mặt**: {費用|ひよう}の{面|めん}で (về chi phí), {安全面|あんぜんめん}で (về an toàn), {精神的|せいしんてき}な{面|めん}で (về tinh thần). Rất hay đi theo **cặp đối chiếu**: **A の{面|めん}では～が、B の{面|めん}では～** (về mặt A thì…, nhưng về mặt B thì…) — đúng cách cô 佐藤 và trưởng phòng 森 nhận xét bài. Ngoài ～で còn gặp **～{面|めん}から** (từ mặt…), **～{面|めん}に** ({安全面|あんぜんめん}に{配慮|はいりょ}する), **～{面|めん}でも** (cả về mặt…), **～{面|めん}がある** (có mặt… — cả về tính cách: {優|やさ}しい{面|めん}もある). Đi cùng hai "anh em" của văn viết: **～という{点|てん}で** (ở **điểm cụ thể**) và **～において** (văn viết của **で** — nơi chốn, thời gian, lĩnh vực).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～面で',
      head: ['Khuôn', 'Ví dụ', 'Romaji', 'Ghi chú'],
      rows: [
        ['N ＋ の ＋ {面|めん}で', '{費用|ひよう}の{面|めん}で · {効果|こうか}の{面|めん}で · {健康|けんこう}の{面|めん}で', 'hiyou no men de · kouka no men de · kenkou no men de', 'dạng cơ bản'],
        ['N ＋ {面|めん}で (từ ghép)', '{安全面|あんぜんめん}で · {経済面|けいざいめん}で · {精神面|せいしんめん}で · {技術面|ぎじゅつめん}で', 'anzenmen de · keizaimen de · seishinmen de · gijutsumen de', 'gọn, văn bản công việc'],
        ['～{的|てき}な ＋ {面|めん}で', '{経済的|けいざいてき}な{面|めん}で · {精神的|せいしんてき}な{面|めん}で', 'keizaiteki na men de · seishinteki na men de', 'tính từ ナ ～的 + な'],
        ['A の{面|めん}では～が、B の{面|めん}では～', '{価格|かかく}の{面|めん}では{安|やす}いが、{品質|ひんしつ}の{面|めん}では{不安|ふあん}だ', 'kakaku no men de wa yasui ga, hinshitsu no men de wa fuan da', 'đối chiếu hai mặt (は)'],
        ['～{面|めん}から／～{面|めん}に／～{面|めん}でも', '{様々|さまざま}な{面|めん}から{考|かんが}える · {安全面|あんぜんめん}に{配慮|はいりょ}する', 'samazama na men kara kangaeru · anzenmen ni hairyo suru', 'trợ từ đổi theo động từ'],
        ['～{面|めん}がある', '{彼|かれ}には{子|こ}どもっぽい{面|めん}もある', 'kare ni wa kodomoppoi men mo aru', 'mặt tính cách'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（の）＋ {面|めん}で（は）、～ — VỀ MẶT N',
          vi: 'Giới hạn lời đánh giá vào **một mặt** của sự việc. Hay đi thành cặp với **は** để đối chiếu mặt tốt ↔ mặt chưa tốt. Văn nói lẫn văn viết đều dùng; trong báo cáo cực kỳ phổ biến.',
          examples: [
            E('{新|あたら}しいシステムは、{費用|ひよう}の{面|めん}で{大|おお}きなメリットがある。', 'Atarashii shisutemu wa, hiyou no men de ookina meritto ga aru.', 'Hệ thống mới có lợi lớn về mặt chi phí.'),
            E('{一人暮|ひとりぐ}らしを{始|はじ}めて、{経済的|けいざいてき}な{面|めん}で{苦労|くろう}している。', 'Hitorigurashi o hajimete, keizaiteki na men de kurou shite iru.', 'Bắt đầu sống một mình, tôi đang chật vật về mặt kinh tế.'),
            E('この{車|くるま}はデザインの{面|めん}では{人気|にんき}があるが、{安全面|あんぜんめん}では{評価|ひょうか}が{低|ひく}い。', 'Kono kuruma wa dezain no men de wa ninki ga aru ga, anzenmen de wa hyouka ga hikui.', 'Chiếc xe này về mặt thiết kế thì được ưa chuộng, nhưng về mặt an toàn bị đánh giá thấp.'),
            E('{留学生|りゅうがくせい}を{生活面|せいかつめん}でも{支|ささ}える{仕組|しく}みが{必要|ひつよう}だ。', 'Ryuugakusei o seikatsumen demo sasaeru shikumi ga hitsuyou da.', 'Cần có cơ chế hỗ trợ du học sinh cả về mặt sinh hoạt.'),
            E('この{問題|もんだい}は、{様々|さまざま}な{面|めん}から{考|かんが}える{必要|ひつよう}がある。', 'Kono mondai wa, samazama na men kara kangaeru hitsuyou ga aru.', 'Vấn đề này cần được suy xét từ nhiều mặt.'),
          ],
        },
        {
          formula: '（～という）＋ {点|てん}で（は）、～ — Ở ĐIỂM (cụ thể)…',
          vi: '**{点|てん}** = **một điểm, một tiêu chí cụ thể** — rất hay đứng sau **mệnh đề + という**: "ở điểm là…". Dùng khi **so sánh, đánh giá ưu – nhược** theo một tiêu chí. Với danh từ, **Nの{点|てん}で** và **Nの{面|めん}で** nhiều khi thay được cho nhau ({価格|かかく}の{点|てん}で／{価格|かかく}の{面|めん}で); khác biệt rõ khi có **mệnh đề**: ～という{点|てん}で tự nhiên hơn hẳn.',
          examples: [
            E('A{社|しゃ}の{製品|せいひん}は、{使|つか}いやすいという{点|てん}で{優|すぐ}れている。', 'Ee-sha no seihin wa, tsukaiyasui to iu ten de sugurete iru.', 'Sản phẩm của công ty A vượt trội ở điểm dễ sử dụng.'),
            E('{二|ふた}つの{案|あん}は、{費用|ひよう}がかからないという{点|てん}では{同|おな}じだ。', 'Futatsu no an wa, hiyou ga kakaranai to iu ten de wa onaji da.', 'Hai phương án giống nhau ở điểm không tốn chi phí.'),
            E('その{点|てん}で、{私|わたし}は{筆者|ひっしゃ}の{意見|いけん}に{賛成|さんせい}できない。', 'Sono ten de, watashi wa hissha no iken ni sansei dekinai.', 'Ở điểm đó, tôi không thể tán thành ý kiến của tác giả.'),
          ],
        },
        {
          formula: 'N ＋ において／における N — Ở, TRONG (văn viết của で)',
          vi: '**～において** = **で** (nơi chốn, thời gian, lĩnh vực, tình huống) nhưng **trang trọng, văn viết**: thông báo sự kiện, luận văn, báo chí. Đứng trước danh từ thì đổi thành **～における N**. Không dùng cho hành động đời thường ({家|いえ}においてご{飯|はん}を{食|た}べる — rất gượng).',
          examples: [
            E('{入学式|にゅうがくしき}は、{大学|だいがく}の{講堂|こうどう}において{行|おこな}われる。', 'Nyuugakushiki wa, daigaku no koudou ni oite okonawareru.', 'Lễ nhập học được tổ chức tại hội trường của trường đại học.'),
            E('{現代|げんだい}の{社会|しゃかい}において、{情報|じょうほう}を{選|えら}ぶ{力|ちから}はきわめて{重要|じゅうよう}である。', 'Gendai no shakai ni oite, jouhou o erabu chikara wa kiwamete juuyou de aru.', 'Trong xã hội hiện đại, năng lực chọn lọc thông tin là cực kỳ quan trọng.'),
            E('{日本|にほん}における{留学生|りゅうがくせい}の{数|かず}は、{年々|ねんねん}{増|ふ}えている。', 'Nihon ni okeru ryuugakusei no kazu wa, nennen fuete iru.', 'Số du học sinh ở Nhật tăng lên hằng năm.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～面で・～点で',
      lines: [
        { who: '{森課長|もりかちょう}', role: 'b', text: 'ワンさん、A{社|しゃ}とB{社|しゃ}のツール、どちらがいいと{思|おも}いますか。', ro: 'Wan-san, ee-sha to bii-sha no tsuuru, dochira ga ii to omoimasu ka.', vi: 'Wang, công cụ của công ty A với công ty B, em thấy cái nào tốt hơn?' },
        { who: 'ワン', role: 'a', text: '{費用|ひよう}の{面|めん}では、A{社|しゃ}のほうが{安|やす}いです。', ro: 'Hiyou no men de wa, ee-sha no hou ga yasui desu.', vi: 'Về mặt chi phí thì công ty A rẻ hơn ạ.' },
        { who: '{森課長|もりかちょう}', role: 'b', text: '{安全面|あんぜんめん}ではどうですか。', ro: 'Anzenmen de wa dou desu ka.', vi: 'Còn về mặt an toàn thì sao?' },
        { who: 'ワン', role: 'a', text: 'データを{社外|しゃがい}に{出|だ}さないという{点|てん}で、B{社|しゃ}のほうが{優|すぐ}れていると{思|おも}います。', ro: 'Deeta o shagai ni dasanai to iu ten de, bii-sha no hou ga sugurete iru to omoimasu.', vi: 'Ở điểm không đưa dữ liệu ra ngoài công ty, em nghĩ công ty B vượt trội hơn ạ.' },
        { who: '{森課長|もりかちょう}', role: 'b', text: 'なるほど。お{客様|きゃくさま}の{文書|ぶんしょ}を{扱|あつか}う{以上|いじょう}、{安全面|あんぜんめん}を{重視|じゅうし}すべきですね。', ro: 'Naruhodo. Okyakusama no bunsho o atsukau ijou, anzenmen o juushi subeki desu ne.', vi: 'Ra vậy. Đã xử lý tài liệu của khách hàng thì nên coi trọng mặt an toàn nhỉ.' },
        { who: 'ワン', role: 'a', text: 'はい。{両方|りょうほう}の{面|めん}から{比較|ひかく}した{表|ひょう}を、{報告書|ほうこくしょ}に{入|い}れておきます。', ro: 'Hai. Ryouhou no men kara hikaku shita hyou o, houkokusho ni irete okimasu.', vi: 'Vâng. Em sẽ đưa vào báo cáo một bảng so sánh từ cả hai mặt ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — N の面で（は）、～',
      head: ['Mặt', 'Câu hoàn chỉnh', 'Romaji', 'Nghĩa'],
      rows: [
        ['{経済的|けいざいてき}な{面|めん}', '{両親|りょうしん}は{経済的|けいざいてき}な{面|めん}で{私|わたし}の{留学|りゅうがく}を{支|ささ}えてくれた。', 'Ryoushin wa keizaiteki na men de watashi no ryuugaku o sasaete kureta.', 'bố mẹ hỗ trợ về kinh tế'],
        ['{精神面|せいしんめん}', '{試合|しあい}の{前|まえ}は、{技術|ぎじゅつ}より{精神面|せいしんめん}の{準備|じゅんび}が{大切|たいせつ}だ。', 'Shiai no mae wa, gijutsu yori seishinmen no junbi ga taisetsu da.', 'chuẩn bị về tinh thần'],
        ['{安全面|あんぜんめん}', '{安全面|あんぜんめん}に{問題|もんだい}があるので、この{計画|けいかく}は{見直|みなお}すべきだ。', 'Anzenmen ni mondai ga aru node, kono keikaku wa minaosubeki da.', 'có vấn đề về an toàn'],
        ['{健康|けんこう}の{面|めん}', '{夜|よる}{遅|おそ}くまで{働|はたら}くのは、{健康|けんこう}の{面|めん}でよくない。', 'Yoru osoku made hataraku no wa, kenkou no men de yokunai.', 'không tốt cho sức khoẻ'],
        ['{教育|きょういく}の{面|めん}', 'この{制度|せいど}は、{教育|きょういく}の{面|めん}でも{効果|こうか}が{期待|きたい}できる。', 'Kono seido wa, kyouiku no men demo kouka ga kitai dekiru.', 'có thể kỳ vọng cả về giáo dục'],
        ['{時間|じかん}の{面|めん}', 'オンライン{授業|じゅぎょう}は、{時間|じかん}の{面|めん}では{自由|じゆう}だが、{集中|しゅうちゅう}しにくい。', 'Onrain jugyou wa, jikan no men de wa jiyuu da ga, shuuchuu shinikui.', 'tự do về thời gian, nhưng khó tập trung'],
      ],
    },
    { t: 'rule', formula: 'N の面で（は）／N面で／～的な面で ＋ đánh giá　·　～という点で（は）　·　N において／N における N', vi: '面 = một mặt rộng (kinh tế, an toàn, tinh thần) · 点 = một điểm cụ thể, hay sau mệnh đề + という · において = で của văn viết (nơi chốn, thời gian, lĩnh vực). Đối chiếu hai mặt: A の面では～が、B の面では～.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～面で・～点で・～において',
      items: [
        '**Thiếu の / な**: ~~{費用面|ひようめん}の{面|めん}で~~ (lặp) · ~~{経済的|けいざいてき}{面|めん}で~~ → **{経済的|けいざいてき}な{面|めん}で** hoặc **{経済面|けいざいめん}で** (không có 的).',
        '**Dùng 面 cho một chi tiết rất cụ thể có mệnh đề**: ~~データを{社外|しゃがい}に{出|だ}さない{面|めん}で{優|すぐ}れている~~ (nghe lạ) → **データを{社外|しゃがい}に{出|だ}さないという{点|てん}で{優|すぐ}れている**.',
        '**において cho chuyện đời thường**: ~~{駅|えき}において{友達|ともだち}を{待|ま}った~~ → **{駅|えき}で{友達|ともだち}を{待|ま}った**. において để dành cho **sự kiện chính thức, lĩnh vực, văn viết**.',
        '**において ↔ における lẫn lộn**: trước **danh từ** phải là **における**: ~~{日本|にほん}において{留学生|りゅうがくせい}の{数|かず}~~ → **{日本|にほん}における{留学生|りゅうがくせい}の{数|かず}**.',
        '**面 đọc sai**: trong 安全面・精神面・経済面 đọc **めん**, không phải つら／おもて.',
      ],
    },

    /* ══════ ③ だ・である体 ══════ */
    { t: 'h', text: '③ だ・である{体|たい} — Thể văn viết: bảng chuyển です・ます → である' },
    {
      t: 'p',
      text: 'Tiếng Nhật có hai thể văn chính: **です・ます{体|たい}（{敬体|けいたい}）** — lịch sự, hướng tới **một người nghe / người đọc cụ thể** (thư, email, phát biểu, thông báo gửi khách) — và **だ・である{体|たい}（{常体|じょうたい}・である{調|ちょう}）** — **khách quan, trung tính**, không hướng tới ai cụ thể: レポート, {論文|ろんぶん}, {報告書|ほうこくしょ} nội bộ, báo, sách, **toàn bộ đề đọc N2**. Thể だ・である **không phải văn nói thân mật**: nó **không có** ～ちゃう・～じゃん・～よね・すごく…; nó là thể thường **cộng với từ vựng và cấu trúc văn viết**. Quy tắc vàng: **một bài — một thể**, không trộn. Bảng dưới đổi **từng loại câu**; để ý nhất ba chỗ hay sai: **(1)** tính từ イ và động từ **KHÔNG** thêm だ／である · **(2)** ～のです → **～のである** · **(3)** ～でしょう → **～だろう／～であろう**.',
    },
    {
      t: 'table',
      caption: '⭐ Bảng chuyển です・ます体 → だ・である体 (học thuộc)',
      head: ['Loại câu', 'です・ます体', 'だ・である体', 'Romaji (である体)'],
      rows: [
        ['Danh từ', '{学生|がくせい}です', '{学生|がくせい}だ／{学生|がくせい}である', 'gakusei da / gakusei de aru'],
        ['Danh từ — quá khứ', '{学生|がくせい}でした', '{学生|がくせい}だった／{学生|がくせい}であった', 'gakusei datta / gakusei de atta'],
        ['Danh từ — phủ định', '{学生|がくせい}ではありません', '{学生|がくせい}ではない', 'gakusei de wa nai'],
        ['Danh từ — phủ định quá khứ', '{学生|がくせい}ではありませんでした', '{学生|がくせい}ではなかった', 'gakusei de wa nakatta'],
        ['Tính từ ナ', '{重要|じゅうよう}です', '{重要|じゅうよう}だ／{重要|じゅうよう}である', 'juuyou da / juuyou de aru'],
        ['Tính từ ナ — quá khứ', '{重要|じゅうよう}でした', '{重要|じゅうよう}だった／{重要|じゅうよう}であった', 'juuyou datta / juuyou de atta'],
        ['Tính từ イ', '{高|たか}いです', '{高|たか}い（✗ {高|たか}いだ ✗ {高|たか}いである）', 'takai'],
        ['Tính từ イ — quá khứ / phủ định', '{高|たか}かったです／{高|たか}くないです', '{高|たか}かった／{高|たか}くない', 'takakatta / takakunai'],
        ['Động từ', '{増|ふ}えます／{増|ふ}えました', '{増|ふ}える／{増|ふ}えた（✗ {増|ふ}えるである）', 'fueru / fueta'],
        ['Động từ — phủ định', '{増|ふ}えません／{増|ふ}えませんでした', '{増|ふ}えない／{増|ふ}えなかった', 'fuenai / fuenakatta'],
        ['Tiếp diễn', '{増|ふ}えています', '{増|ふ}えている', 'fuete iru'],
        ['Giải thích (のです)', '{増|ふ}えたのです／{増|ふ}えたんです', '{増|ふ}えたのだ／{増|ふ}えたのである', 'fueta no da / fueta no de aru'],
        ['Phỏng đoán', '{増|ふ}えるでしょう／{重要|じゅうよう}でしょう', '{増|ふ}えるだろう（であろう）／{重要|じゅうよう}だろう（であろう）', 'fueru darou (de arou) / juuyou darou (de arou)'],
        ['Câu hỏi tu từ', '～ではないでしょうか', '～ではないだろうか', '~ de wa nai darou ka'],
        ['Rủ / đề nghị', '{考|かんが}えてみましょう', '{考|かんが}えてみよう／{考|かんが}えてみたい', 'kangaete miyou / kangaete mitai'],
        ['Ý kiến', '～と{思|おも}います', '～と{考|かんが}える／～と{考|かんが}えられる', '~ to kangaeru / ~ to kangaerareru'],
        ['Nghĩa vụ', '～なければなりません', '～なければならない（／～ねばならない）', '~ nakereba naranai (/ ~ neba naranai)'],
        ['Khả năng', '～かもしれません', '～かもしれない', '~ kamo shirenai'],
        ['Mong muốn', '～たいです', '～たい', '~ tai'],
        ['Yêu cầu', '～てください', '（tránh）→ ～{必要|ひつよう}がある／～てほしい', '~ hitsuyou ga aru / ~ te hoshii'],
      ],
    },
    {
      t: 'table',
      caption: '中止形 — nối câu kiểu văn viết (thay cho thể て)',
      head: ['Văn nói (thể て)', 'Văn viết (中止形)', 'Ví dụ văn viết', 'Romaji'],
      rows: [
        ['Vて', 'V（ます bỏ ます）', '{調査|ちょうさ}を{行|おこな}い、{結果|けっか}をまとめた。', 'Chousa o okonai, kekka o matometa.'],
        ['Vていて', 'Vており', '{人口|じんこう}は{減|へ}っており、{対策|たいさく}が{必要|ひつよう}だ。', 'Jinkou wa hette ori, taisaku ga hitsuyou da.'],
        ['イAくて', 'イAく', '{家賃|やちん}が{高|たか}く、{生活|せいかつ}は{楽|らく}ではない。', 'Yachin ga takaku, seikatsu wa raku de wa nai.'],
        ['ナAで／Nで', 'ナA・N ＋ であり', '{東京|とうきょう}は{日本|にほん}の{首都|しゅと}であり、{最大|さいだい}の{都市|とし}でもある。', 'Toukyou wa Nihon no shuto de ari, saidai no toshi de mo aru.'],
        ['Vないで／Vなくて', 'Vず（に）', '{辞書|じしょ}を{使|つか}わずに{読|よ}んだ。{理由|りゆう}が{分|わ}からず、{困|こま}った。', 'Jisho o tsukawazu ni yonda. Riyuu ga wakarazu, komatta.'],
        ['しないで', 'せず（に）', '{確認|かくにん}せずに{提出|ていしゅつ}してはならない。', 'Kakunin sezu ni teishutsu shite wa naranai.'],
        ['イAくなくて', 'イAくなく', '{費用|ひよう}も{高|たか}くなく、{使|つか}いやすい。', 'Hiyou mo takaku naku, tsukaiyasui.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N・ナA ＋ である／であった／であろう／であり — đuôi văn viết của danh từ & tính từ ナ',
          vi: '**である** chỉ đứng sau **danh từ** và **tính từ ナ** (và sau ～の → のである). Trong レポート, **である** trang trọng hơn **だ**; nhiều người viết dùng cả hai trong cùng một bài (đều là thể thường) — miễn **không lẫn です・ます**. Ở giữa câu, **である** hiện ra ở dạng **であり** (nối câu), **である N** (bổ nghĩa: {学生|がくせい}である{私|わたし}), **であれば** (nếu là).',
          examples: [
            E('この{調査|ちょうさ}の{目的|もくてき}は、{留学生|りゅうがくせい}の{悩|なや}みを{明|あき}らかにすることである。', 'Kono chousa no mokuteki wa, ryuugakusei no nayami o akiraka ni suru koto de aru.', 'Mục đích của cuộc khảo sát này là làm rõ những khó khăn của du học sinh.'),
            E('{回答者|かいとうしゃ}の{多|おお}くは{一年生|いちねんせい}であった。', 'Kaitousha no ooku wa ichinensei de atta.', 'Phần lớn người trả lời là sinh viên năm nhất.'),
            E('この{問題|もんだい}は、{今後|こんご}さらに{深刻|しんこく}になるであろう。', 'Kono mondai wa, kongo sara ni shinkoku ni naru de arou.', 'Vấn đề này có lẽ từ nay sẽ càng nghiêm trọng hơn.'),
            E('{日本語|にほんご}は{難|むずか}しい{言語|げんご}であり、{同時|どうじ}に{面白|おもしろ}い{言語|げんご}でもある。', 'Nihongo wa muzukashii gengo de ari, douji ni omoshiroi gengo de mo aru.', 'Tiếng Nhật là ngôn ngữ khó, đồng thời cũng là ngôn ngữ thú vị.'),
            E('{留学生|りゅうがくせい}である{私|わたし}にとって、この{制度|せいど}はありがたい。', 'Ryuugakusei de aru watashi ni totte, kono seido wa arigatai.', 'Với tôi — một du học sinh — chế độ này thật đáng quý.'),
          ],
        },
        {
          formula: '～のである／～のだ — GIẢI THÍCH, NHẤN MẠNH kết luận (văn viết của ～んです)',
          vi: 'Đặt cuối câu để **giải thích lý do** hoặc **nhấn mạnh điều vừa suy ra** — rất hay ở câu chốt của một đoạn. Đừng lạm dụng: câu nào cũng ～のである thì bài nặng nề.',
          examples: [
            E('{多|おお}くの{学生|がくせい}は、{時間|じかん}がないのではなく、{使|つか}い{方|かた}を{知|し}らないのである。', 'Ooku no gakusei wa, jikan ga nai no de wa naku, tsukaikata o shiranai no de aru.', 'Nhiều sinh viên không phải là không có thời gian, mà là không biết cách dùng thời gian.'),
            E('つまり、{翻訳|ほんやく}アプリは{学習|がくしゅう}の{道具|どうぐ}にもなり{得|う}るのだ。', 'Tsumari, hon\'yaku apuri wa gakushuu no dougu ni mo nariuru no da.', 'Tức là, ứng dụng dịch cũng có thể trở thành công cụ học tập. (～得る Bài 46)'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: đổi sang だ・である体',
      lines: [
        { who: '{佐藤先生|さとうせんせい}', role: 'c', text: 'カルロスさん、「{結果|けっか}は{予想|よそう}と{違|ちが}いました」を、レポートの{文|ぶん}にしてください。', ro: 'Karurosu-san, "kekka wa yosou to chigaimashita" o, repooto no bun ni shite kudasai.', vi: 'Carlos, em đổi câu "Kết quả đã khác với dự đoán" thành câu văn báo cáo xem.' },
        { who: 'カルロス', role: 'b', text: '「{結果|けっか}は{予想|よそう}と{異|こと}なった。」です。', ro: '"Kekka wa yosou to kotonatta." desu.', vi: 'Là "Kekka wa yosou to kotonatta." ạ.' },
        { who: '{佐藤先生|さとうせんせい}', role: 'c', text: 'いいですね。「{違|ちが}う」を「{異|こと}なる」にしたのもいいです。では、「この{方法|ほうほう}は{便利|べんり}です」は？', ro: 'Ii desu ne. "Chigau" o "kotonaru" ni shita no mo ii desu. De wa, "kono houhou wa benri desu" wa?', vi: 'Tốt lắm. Đổi "chigau" thành "kotonaru" cũng hay. Thế còn "Phương pháp này tiện lợi" thì sao?' },
        { who: 'カルロス', role: 'b', text: '「この{方法|ほうほう}は{便利|べんり}である。」……「{有効|ゆうこう}である」のほうが、レポートらしいですか。', ro: '"Kono houhou wa benri de aru."…… "Yuukou de aru" no hou ga, repooto rashii desu ka.', vi: '"Kono houhou wa benri de aru." … Dùng "yuukou de aru" (hữu hiệu) thì có giống văn báo cáo hơn không ạ?' },
        { who: '{佐藤先生|さとうせんせい}', role: 'c', text: 'ええ、そうですね。では「{参加者|さんかしゃ}が{多|おお}いです」は？', ro: 'Ee, sou desu ne. De wa "sankasha ga ooi desu" wa?', vi: 'Ừ, đúng thế. Vậy "Người tham gia đông" thì sao?' },
        { who: 'カルロス', role: 'b', text: '「{参加者|さんかしゃ}が{多|おお}い。」です。イ{形容詞|けいようし}には「だ」も「である」もつけません。', ro: '"Sankasha ga ooi." desu. I-keiyoushi ni wa "da" mo "de aru" mo tsukemasen.', vi: 'Là "Sankasha ga ooi." ạ. Tính từ イ thì không gắn "da" hay "de aru".' },
      ],
    },
    { t: 'rule', formula: 'N・ナA：だ／である（であった・であろう・であり）　·　イA・V：thể thường, KHÔNG だ／である　·　のです→のである　·　でしょう→だろう（であろう）', vi: 'Một bài — một thể. Văn viết còn đổi cách nối câu (中止形: ～し・～ており・～く・～であり・～ず) và đổi từ văn nói sang văn viết (bảng ở mục Viết).' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với だ・である体 (sai → đúng)',
      items: [
        '**Thêm である sau tính từ イ / động từ**: ~~{費用|ひよう}が{高|たか}いである~~ → **{費用|ひよう}が{高|たか}い** · ~~{人口|じんこう}が{減|へ}るである~~ → **{人口|じんこう}が{減|へ}る**. (Muốn nhấn mạnh thì: **{高|たか}いのである／{減|へ}るのである**.)',
        '**Trộn thể**: ~~{調査|ちょうさ}の{結果|けっか}は{以下|いか}の{通|とお}りです。{回答者|かいとうしゃ}は{百名|ひゃくめい}であった。~~ → toàn bài **である**: **{調査|ちょうさ}の{結果|けっか}は{以下|いか}の{通|とお}りである。{回答者|かいとうしゃ}は{百名|ひゃくめい}であった。**',
        '**だ・である nhưng vẫn văn nói**: ~~すごく{増|ふ}えちゃった~~ (đúng thể thường nhưng là văn nói) → **{大幅|おおはば}に{増加|ぞうか}した** · ~~でも、～~~ → **しかし、～** · ~~～けど、～~~ → **～が、～**.',
        '**～でしょう đổi nhầm**: ~~{増|ふ}えるでしょうである~~ / ~~{増|ふ}えるであろうだ~~ → **{増|ふ}えるだろう** hoặc **{増|ふ}えるであろう** (một trong hai).',
        '**Câu ngắn cụt vì quên 中止形**: ~~{調査|ちょうさ}をした。そして、まとめた。~~ (đúng nhưng non) → **{調査|ちょうさ}を{行|おこな}い、{結果|けっか}をまとめた。**',
      ],
    },

    /* ══════ ④ べきだ ══════ */
    { t: 'h', text: '④ ～べきだ／～べきではない — "Nên… / Không nên…" (đạo lý, chủ trương)' },
    {
      t: 'p',
      text: 'Ôn Bài 32 (bảng "bốn cách nên") rồi học **đủ**. **～べきだ** nói điều **đúng ra phải làm** theo **đạo lý, lẽ phải, trách nhiệm** — **theo ý kiến của người nói**. Vì vậy nó là mẫu **"đinh" của bài luận**: câu chủ trương (**～すべきだ**), câu phản đối (**～べきではない**), câu đặt vấn đề (**～すべきか**). Giọng **mạnh**: nói với **bạn bè** nghe như lên lớp, với **người trên** thì thất lễ (nói với người trên: **～たほうがいいと{思|おも}います**). Đừng dùng cho **quy định, luật** (luật thì **～なければならない**) và cho **suy đoán** (đó là **～はずだ**). Các dạng: **べきではない** (không nên — phủ định ở べき), **べきだった** (lẽ ra nên — hối tiếc, Bài 35), **べき＋N** ({守|まも}るべきルール), **Nであるべきだ** (phải là…), **～べきか** (có nên… không).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～べきだ',
      head: ['Loại từ / dạng', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ', 'V{辞書形|じしょけい} ＋ べきだ', '{守|まも}るべきだ · {謝|あやま}るべきだ · {読|よ}むべきだ', 'mamoru beki da · ayamaru beki da · yomu beki da'],
        ['する', 'する → すべきだ／するべきだ', '{勉強|べんきょう}すべきだ · {検討|けんとう}するべきだ', 'benkyou subeki da · kentou suru beki da'],
        ['Phủ định', 'V{辞書形|じしょけい} ＋ べきではない', '{使|つか}うべきではない · すべきではない', 'tsukau beki de wa nai · subeki de wa nai'],
        ['Quá khứ (hối tiếc — Bài 35)', 'V{辞書形|じしょけい} ＋ べきだった／べきではなかった', '{相談|そうだん}すべきだった · {言|い}うべきではなかった', 'soudan subeki datta · iu beki de wa nakatta'],
        ['Bổ nghĩa danh từ', 'V{辞書形|じしょけい} ＋ べき ＋ N', '{守|まも}るべきルール · {学|まな}ぶべき{点|てん} · すべきこと', 'mamoru beki ruuru · manabu beki ten · subeki koto'],
        ['Danh từ / ナA', 'N・ナA ＋ であるべきだ', '{教師|きょうし}は{手本|てほん}であるべきだ · {公平|こうへい}であるべきだ', 'kyoushi wa tehon de aru beki da · kouhei de aru beki da'],
        ['Câu hỏi (đề bài luận)', '～べきか · どう～べきか', '{大学生|だいがくせい}はアルバイトをすべきか · どうすべきか', 'daigakusei wa arubaito o subeki ka · dou subeki ka'],
        ['Nhận ra (N1, biển cấm)', 'V{辞書形|じしょけい} ＋ べからず', '{芝生|しばふ}に{入|はい}るべからず', 'shibafu ni hairu bekarazu'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '[chủ thể] は V{辞書形|じしょけい} ＋ べきだ — ĐÚNG RA NÊN (chủ trương, đạo lý)',
          vi: 'Người nói **đánh giá** điều đúng đắn: xã hội, tổ chức, con người **nên** làm gì. Trong bài luận hay đi với **{私|わたし}は～べきだと{考|かんが}える** (mềm hơn một chút).',
          examples: [
            E('{大学|だいがく}は、{留学生|りゅうがくせい}のための{相談窓口|そうだんまどぐち}を{増|ふ}やすべきだ。', 'Daigaku wa, ryuugakusei no tame no soudan madoguchi o fuyasu beki da.', 'Trường đại học nên tăng thêm các bàn tư vấn cho du học sinh.'),
            E('{約束|やくそく}の{時間|じかん}に{遅|おく}れるなら、{前|まえ}もって{連絡|れんらく}すべきだ。', 'Yakusoku no jikan ni okureru nara, maemotte renraku subeki da.', 'Nếu đến trễ giờ hẹn thì nên báo trước.'),
            E('{私|わたし}は、{企業|きぎょう}はもっと{柔軟|じゅうなん}な{働|はたら}き{方|かた}を{認|みと}めるべきだと{考|かんが}える。', 'Watashi wa, kigyou wa motto juunan na hatarakikata o mitomeru beki da to kangaeru.', 'Tôi cho rằng doanh nghiệp nên chấp nhận những cách làm việc linh hoạt hơn.'),
            E('リーダーは、{誰|だれ}に{対|たい}しても{公平|こうへい}であるべきだ。', 'Riidaa wa, dare ni taishite mo kouhei de aru beki da.', 'Người lãnh đạo phải công bằng với bất kỳ ai.'),
          ],
        },
        {
          formula: 'V{辞書形|じしょけい} ＋ べきではない — KHÔNG NÊN',
          vi: 'Phủ định đặt ở **べき**: **～べきではない** (không phải ~~～ないべきだ~~). Dùng để **phê phán** một việc làm, hoặc nêu **giới hạn đạo lý**.',
          examples: [
            E('{他人|たにん}の{文章|ぶんしょう}を、{出典|しゅってん}を{書|か}かずに{使|つか}うべきではない。', 'Tanin no bunshou o, shutten o kakazu ni tsukau beki de wa nai.', 'Không nên dùng bài viết của người khác mà không ghi nguồn.'),
            E('{子|こ}どもの{前|まえ}で、そんな{言葉|ことば}を{使|つか}うべきではない。', 'Kodomo no mae de, sonna kotoba o tsukau beki de wa nai.', 'Không nên dùng những lời như thế trước mặt trẻ con.'),
            E('{一度|いちど}の{失敗|しっぱい}で、{人|ひと}を{判断|はんだん}すべきではない。', 'Ichido no shippai de, hito o handan subeki de wa nai.', 'Không nên đánh giá con người qua một lần thất bại.'),
          ],
        },
        {
          formula: 'V{辞書形|じしょけい} ＋ べき ＋ N · ～べきだった — VIỆC NÊN LÀM · LẼ RA NÊN',
          vi: '**べき＋N** = "N **cần / đáng** để làm" — rất hay trong báo cáo: **{今後|こんご}{取|と}り{組|く}むべき{課題|かだい}** (vấn đề cần giải quyết từ nay). **べきだった** = hối tiếc (Bài 35): lẽ ra nên làm mà đã không làm.',
          examples: [
            E('{今後|こんご}{取|と}り{組|く}むべき{課題|かだい}は、{三|みっ}つある。', 'Kongo torikumu beki kadai wa, mittsu aru.', 'Có ba vấn đề cần giải quyết từ nay.'),
            E('この{本|ほん}には、{学|まな}ぶべき{点|てん}がたくさんある。', 'Kono hon ni wa, manabu beki ten ga takusan aru.', 'Cuốn sách này có nhiều điểm đáng học hỏi.'),
            E('もっと{早|はや}く{先生|せんせい}に{相談|そうだん}すべきだった。', 'Motto hayaku sensei ni soudan subeki datta.', 'Lẽ ra tôi nên hỏi ý kiến thầy sớm hơn.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～べきだ (thảo luận ゼミ)',
      lines: [
        { who: '{佐藤先生|さとうせんせい}', role: 'c', text: '{今日|きょう}のテーマは「{大学|だいがく}の{授業|じゅぎょう}はすべてオンラインにすべきか」です。カルロスさん、どう{思|おも}いますか。', ro: 'Kyou no teema wa "daigaku no jugyou wa subete onrain ni subeki ka" desu. Karurosu-san, dou omoimasu ka.', vi: 'Chủ đề hôm nay là "Có nên chuyển toàn bộ giờ học đại học lên trực tuyến không". Carlos, em nghĩ sao?' },
        { who: 'カルロス', role: 'b', text: '{僕|ぼく}は、すべてオンラインにすべきではないと{思|おも}います。{実験|じっけん}や{話|はな}し{合|あ}いは、{対面|たいめん}で{行|おこな}うべきです。', ro: 'Boku wa, subete onrain ni subeki de wa nai to omoimasu. Jikken ya hanashiai wa, taimen de okonau beki desu.', vi: 'Em nghĩ không nên chuyển hết lên trực tuyến. Thí nghiệm và thảo luận thì nên học trực tiếp ạ.' },
        { who: '{佐藤先生|さとうせんせい}', role: 'c', text: 'リンさんは？', ro: 'Rin-san wa?', vi: 'Còn Lin?' },
        { who: 'リン', role: 'a', text: '{講義|こうぎ}だけなら、オンラインにすべきだと{思|おも}います。{何度|なんど}も{見直|みなお}せるので、{留学生|りゅうがくせい}にとっては{理解|りかい}の{面|めん}で{助|たす}かります。', ro: 'Kougi dake nara, onrain ni subeki da to omoimasu. Nando mo minaoseru node, ryuugakusei ni totte wa rikai no men de tasukarimasu.', vi: 'Nếu chỉ là giờ giảng lý thuyết thì em nghĩ nên chuyển lên trực tuyến. Xem lại được nhiều lần nên với du học sinh thì đỡ hẳn về mặt hiểu bài ạ.' },
        { who: '{佐藤先生|さとうせんせい}', role: 'c', text: '{二人|ふたり}とも、{理由|りゆう}をはっきり{述|の}べていますね。レポートでは、「すべきだ」と{書|か}いた{後|あと}に、{必|かなら}ず{根拠|こんきょ}を{示|しめ}すべきです。', ro: 'Futari tomo, riyuu o hakkiri nobete imasu ne. Repooto de wa, "subeki da" to kaita ato ni, kanarazu konkyo o shimesu beki desu.', vi: 'Cả hai em đều nêu lý do rõ ràng. Trong báo cáo, viết "subeki da" xong thì nhất định nên đưa ra căn cứ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — [chủ thể] は ～べきだ／べきではない',
      head: ['Chủ thể + việc', 'Câu hoàn chỉnh', 'Romaji', 'Nghĩa'],
      rows: [
        ['{国|くに}・{支援|しえん}する', '{国|くに}は、{子育|こそだ}て{世代|せだい}をもっと{支援|しえん}すべきだ。', 'Kuni wa, kosodate sedai o motto shien subeki da.', 'nhà nước nên hỗ trợ thế hệ nuôi con'],
        ['{会社|かいしゃ}・{減|へ}らす', '{会社|かいしゃ}は、{無駄|むだ}な{会議|かいぎ}を{減|へ}らすべきだ。', 'Kaisha wa, muda na kaigi o herasu beki da.', 'công ty nên giảm họp vô ích'],
        ['{学生|がくせい}・{頼|たよ}る', '{学生|がくせい}は、{翻訳|ほんやく}アプリに{頼|たよ}りすぎるべきではない。', 'Gakusei wa, hon\'yaku apuri ni tayorisugiru beki de wa nai.', 'sinh viên không nên quá dựa vào app dịch'],
        ['{私|わたし}たち・{考|かんが}える', '{私|わたし}たちは、ごみを{出|だ}す{前|まえ}に、まず{減|へ}らす{方法|ほうほう}を{考|かんが}えるべきだ。', 'Watashitachi wa, gomi o dasu mae ni, mazu herasu houhou o kangaeru beki da.', 'trước khi vứt rác nên nghĩ cách giảm'],
        ['{政治家|せいじか}・{正直|しょうじき}', '{政治家|せいじか}は、{国民|こくみん}に{対|たい}して{正直|しょうじき}であるべきだ。', 'Seijika wa, kokumin ni taishite shoujiki de aru beki da.', 'chính khách phải trung thực với dân'],
        ['{企業|きぎょう}・{取|と}り{組|く}む', '{企業|きぎょう}が{取|と}り{組|く}むべき{課題|かだい}は{多|おお}い。', 'Kigyou ga torikumu beki kadai wa ooi.', 'nhiều vấn đề doanh nghiệp cần giải quyết (べき＋N)'],
      ],
    },
    { t: 'rule', formula: 'V辞書形（する→すべき）＋ べきだ／べきではない／べきだった　·　べき＋N　·　N・ナAであるべきだ', vi: 'Nên / không nên theo đạo lý, theo ý kiến của người nói — mẫu chủ trương của bài luận. Không dùng cho luật lệ (→ なければならない), suy đoán (→ はずだ), lời khuyên với bạn hay người trên (→ ほうがいい).' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～べきだ (sai → đúng)',
      items: [
        '**Phủ định sai chỗ**: ~~{使|つか}わないべきだ~~ → **{使|つか}うべきではない**.',
        '**する chia sai**: ~~しべきだ~~ · ~~するべきではありません~~ (đúng ngữ pháp nhưng hiếm) → **すべきだ／するべきだ**, **すべきではない**.',
        '**Dùng cho luật, quy định khách quan**: ~~{日本|にほん}では{車|くるま}は{左側|ひだりがわ}を{走|はし}るべきだ~~ → **{左側|ひだりがわ}を{走|はし}らなければならない** (luật). べきだ = ý kiến của người nói.',
        '**Dùng cho suy đoán**: ~~{彼|かれ}はもう{家|いえ}に{着|つ}いたべきだ~~ (sai cả thể) / ~~{着|つ}くべきだ~~ (hiểu thành "anh ấy nên về") → **もう{着|つ}いたはずだ** (chắc là đã về — Bài 20).',
        '**Nói với người trên / người lạ**: ~~{部長|ぶちょう}、この{案|あん}は{見直|みなお}すべきです~~ (như ra lệnh) → **{見直|みなお}したほうがいいのではないかと{思|おも}います**. Trong văn bản (báo cáo, luận) thì **～べきである／～べきだと{考|かんが}える** hoàn toàn bình thường.',
        '**Tự nói về bản thân hằng ngày**: ~~{明日|あした}は{早|はや}く{起|お}きるべきだ~~ (với chính mình — nghe như tự lên lớp) → **{早|はや}く{起|お}きなきゃ／{起|お}きないと** (văn nói).',
      ],
    },

    /* ══════ ⑤ ねばならない ══════ */
    { t: 'h', text: '⑤ ～ねばならない — "Phải…" (văn viết, cổ, trang trọng)' },
    {
      t: 'p',
      text: '**～ねばならない** = **～なければならない**, nhưng là **văn viết cổ, trang trọng**: gặp trong **{社説|しゃせつ}** (xã luận), **{演説|えんぜつ}** (diễn văn), **sách cũ, luận văn kiểu cũ, khẩu hiệu**, lời người lớn tuổi nói nghiêm. **ね** chính là dạng cổ của **phủ định ない** (～ねば = ～なければ). Đề N2 kiểm tra bạn **nhận ra và nối đúng** (書か＋ねば, せ＋ねば). Khi **tự viết** レポート, dùng **～なければならない** là đủ và tự nhiên; ～ねばならない dùng được trong câu chủ trương mạnh, nhưng **đừng rải khắp bài** — đọc sẽ như diễn văn. Dạng cổ hơn: **～ねばならぬ** (ぬ = ない). Dạng rút gọn hay gặp trong lời độc thoại: **～ねば** ({急|いそ}がねば = phải nhanh lên mới được).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ねばならない (giống thể ない bỏ ない — trừ する)',
      head: ['Nhóm', 'Thể ない', '＋ ねばならない', 'Romaji'],
      rows: [
        ['Nhóm I', '{書|か}かない · {急|いそ}がない · {学|まな}ばない', '{書|か}かねばならない · {急|いそ}がねばならない · {学|まな}ばねばならない', 'kakaneba naranai · isoganeba naranai · manabaneba naranai'],
        ['Nhóm II', '{考|かんが}えない · {認|みと}めない', '{考|かんが}えねばならない · {認|みと}めねばならない', 'kangaeneba naranai · mitomeneba naranai'],
        ['する', 'しない', '**せ**ねばならない（✗ しねばならない）', 'seneba naranai'],
        ['来る', '{来|こ}ない', '{来|こ}ねばならない', 'koneba naranai'],
        ['ある／Nである', '（ない）', 'あらねばならない · Nであらねばならない', 'araneba naranai · N de araneba naranai'],
        ['Lịch sự', '—', '～ねばなりません', '~ neba narimasen'],
        ['Cổ hơn (nhận ra)', '—', '～ねばならぬ', '~ neba naranu'],
        ['Rút gọn (độc thoại)', '—', '～ねば（{急|いそ}がねば）', '~ neba (isoganeba)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Vない（bỏ ない）＋ ねばならない — PHẢI (giọng văn viết trang trọng)',
          vi: 'Nghĩa = なければならない. Chủ ngữ hay là **"chúng ta, con người, xã hội, mỗi người"** (我々・私たち・人間・社会) — giọng **kêu gọi, xã luận**.',
          examples: [
            E('{我々|われわれ}は、{次|つぎ}の{世代|せだい}のために{自然|しぜん}を{守|まも}らねばならない。', 'Wareware wa, tsugi no sedai no tame ni shizen o mamoraneba naranai.', 'Chúng ta phải bảo vệ thiên nhiên vì thế hệ sau.'),
            E('{研究者|けんきゅうしゃ}は、{常|つね}にデータに{対|たい}して{誠実|せいじつ}であらねばならない。', 'Kenkyuusha wa, tsune ni deeta ni taishite seijitsu de araneba naranai.', 'Nhà nghiên cứu phải luôn trung thực với dữ liệu.'),
            E('この{問題|もんだい}は、{社会全体|しゃかいぜんたい}で{解決|かいけつ}せねばならない。', 'Kono mondai wa, shakai zentai de kaiketsu seneba naranai.', 'Vấn đề này phải được giải quyết bằng sức của toàn xã hội.'),
            E('{約束|やくそく}した{以上|いじょう}、{最後|さいご}までやり{遂|と}げねばならない。', 'Yakusoku shita ijou, saigo made yaritogeneba naranai.', 'Đã hứa thì phải làm đến cùng. (～以上 Bài 47)'),
            E('もう{九時|くじ}か。{急|いそ}がねば。', 'Mou kuji ka. Isoganeba.', 'Chín giờ rồi à. Phải nhanh lên thôi. (～ねば — độc thoại, giọng cứng)'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: nhận ra ～ねばならない',
      lines: [
        { who: 'マリヤム', role: 'a', text: 'ダニエル、この{新聞|しんぶん}の{社説|しゃせつ}、「{政府|せいふ}は{早急|そうきゅう}に{対策|たいさく}を{講|こう}じねばならない」って、どういう{意味|いみ}？', ro: 'Danieru, kono shinbun no shasetsu, "seifu wa soukyuu ni taisaku o koujineba naranai" tte, dou iu imi?', vi: 'Daniel, câu trong bài xã luận này "seifu wa soukyuu ni taisaku o koujineba naranai" nghĩa là gì?' },
        { who: 'ダニエル', role: 'b', text: '「{政府|せいふ}はすぐに{対策|たいさく}をとらなければならない」っていう{意味|いみ}だよ。「{講|こう}じる」は「とる」の{堅|かた}い{言|い}い{方|かた}。', ro: '"Seifu wa sugu ni taisaku o toranakereba naranai" tte iu imi da yo. "Koujiru" wa "toru" no katai iikata.', vi: 'Nghĩa là "Chính phủ phải lập tức đưa ra biện pháp". "Koujiru" là cách nói cứng của "toru".' },
        { who: 'マリヤム', role: 'a', text: '「する」なら「せねばならない」だよね。「しねば」じゃなくて。', ro: '"Suru" nara "seneba naranai" da yo ne. "Shineba" ja nakute.', vi: 'Với "suru" thì là "seneba naranai" nhỉ. Không phải "shineba".' },
        { who: 'ダニエル', role: 'b', text: 'そう。でも{自分|じぶん}のレポートなら、「なければならない」のほうが{自然|しぜん}だと{思|おも}うよ。', ro: 'Sou. Demo jibun no repooto nara, "nakereba naranai" no hou ga shizen da to omou yo.', vi: 'Đúng. Nhưng trong bài báo cáo của mình thì mình nghĩ "nakereba naranai" tự nhiên hơn.' },
      ],
    },
    { t: 'rule', formula: 'Vない（bỏ ない）＋ ねばならない　·　する → せねばならない　·　来る → 来（こ）ねばならない　·　Nである → Nであらねばならない', vi: '= なければならない, nhưng là văn viết cổ, trang trọng (xã luận, diễn văn, sách cũ). Đọc thì hiểu ngay; tự viết レポート thì なければならない là đủ.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ねばならない (sai → đúng)',
      items: [
        '**する chia sai**: ~~しねばならない~~ → **せねばならない** (せ là gốc cổ của する trước ね／ず: せず・せねば).',
        '**Nối vào thể ます**: ~~{書|か}きねばならない~~ → **{書|か}かねばならない** (nối vào gốc thể ない).',
        '**Dùng trong văn nói đời thường**: ~~{明日|あした}{宿題|しゅくだい}を{出|だ}さねばならないんだ~~ (với bạn — nghe như diễn kịch) → **{出|だ}さなきゃいけないんだ**.',
        '**Nhầm với ～ねば (điều kiện)**: **～ねば** cũng là **～なければ** (nếu không…): {急|いそ}がねば{間|ま}に{合|あ}わない = {急|いそ}がなければ{間|ま}に{合|あ}わない (không nhanh thì không kịp). Đọc cả câu để biết là "phải" hay "nếu không".',
      ],
    },

    /* ══════ ⑥ BẢNG 上で ══════ */
    { t: 'h', text: '⑥ Bảng phân biệt — た{上|うえ}で ↔ てから ↔ た{後|あと}で ↔ {際|さい}に ↔ うえに · る{上|うえ}で ↔ ために ↔ には' },
    {
      t: 'table',
      head: ['Mẫu', 'Nghĩa / sắc thái', 'Ví dụ', 'Romaji', 'Nói / viết'],
      rows: [
        ['Vた{上|うえ}で', 'A là BƯỚC CẦN có, làm cẩn thận, RỒI MỚI B (B có chủ ý)', '{家族|かぞく}と{相談|そうだん}した{上|うえ}で{決|き}める', 'kazoku to soudan shita ue de kimeru', 'cả hai, trang trọng'],
        ['Vてから', 'thứ tự thời gian: làm A xong rồi làm B (trung tính)', '{手|て}を{洗|あら}ってから{食|た}べる', 'te o aratte kara taberu', 'cả hai'],
        ['Vた{後|あと}で', 'sau A (mốc thời gian), B xảy ra — không cần quan hệ chuẩn bị', '{授業|じゅぎょう}が{終|お}わった{後|あと}で{会|あ}おう', 'jugyou ga owatta ato de aou', 'cả hai'],
        ['V{辞書形|じしょけい}／Vた・Nの{際|さい}に (Bài 41)', 'vào DỊP / LÚC làm A (trang trọng, thông báo)', 'ご{利用|りよう}の{際|さい}は、{身分証|みぶんしょう}をお{見|み}せください', 'goriyou no sai wa, mibunshou o omise kudasai', 'viết, thông báo'],
        ['～うえに (Bài 29)', 'KHÔNG NHỮNG… MÀ CÒN (cộng thêm ý cùng chiều)', 'この{部屋|へや}は{広|ひろ}いうえに{安|やす}い', 'kono heya wa hiroi ue ni yasui', 'cả hai'],
        ['V{辞書形|じしょけい}{上|うえ}で', 'TRONG VIỆC / KHI làm V thì (điều gì quan trọng, cần thiết)', '{日本|にほん}で{暮|く}らす{上|うえ}で{大切|たいせつ}なこと', 'Nihon de kurasu ue de taisetsu na koto', 'trang trọng'],
        ['V{辞書形|じしょけい}ために', 'MỤC ĐÍCH của một hành động cụ thể', '{合格|ごうかく}するために{毎日|まいにち}{勉強|べんきょう}する', 'goukaku suru tame ni mainichi benkyou suru', 'cả hai'],
        ['V{辞書形|じしょけい}には', 'muốn làm V thì (cần…) — văn nói, ngắn', '{駅|えき}に{行|い}くには、このバスが{便利|べんり}だ', 'eki ni iku ni wa, kono basu ga benri da', 'nói'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('ご{飯|はん}を{食|た}べてから、{歯|は}を{磨|みが}く。', 'Gohan o tabete kara, ha o migaku.', 'Ăn cơm xong rồi đánh răng. (thứ tự — KHÔNG dùng た上で)'),
        E('{契約|けいやく}の{内容|ないよう}を{確認|かくにん}した{上|うえ}で、サインする。', 'Keiyaku no naiyou o kakunin shita ue de, sain suru.', 'Kiểm tra nội dung hợp đồng rồi mới ký. (bước cần có → た上で)'),
        E('{日本|にほん}で{暮|く}らす{上|うえ}で、ごみの{出|だ}し{方|かた}を{知|し}ることは{大切|たいせつ}だ。', 'Nihon de kurasu ue de, gomi no dashikata o shiru koto wa taisetsu da.', 'Khi sống ở Nhật, biết cách đổ rác là điều quan trọng. (る上で + đánh giá)'),
        E('{日本|にほん}で{暮|く}らすために、アパートを{探|さが}している。', 'Nihon de kurasu tame ni, apaato o sagashite iru.', 'Tôi đang tìm căn hộ để sống ở Nhật. (ために — mục đích của hành động 探す)'),
        E('この{仕事|しごと}は{楽|らく}なうえに、{給料|きゅうりょう}もいい。', 'Kono shigoto wa raku na ue ni, kyuuryou mo ii.', 'Công việc này nhẹ nhàng, lại còn lương cao. (うえに — cộng thêm, Bài 29)'),
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chọn nhanh',
      items: [
        '**Hỏi 1**: vế trước là **thể た** + có ý "chuẩn bị kỹ / xem xét" + vế sau là **quyết định, hành động có chủ ý** → **た{上|うえ}で**. Chỉ là thứ tự → **てから**.',
        '**Hỏi 2**: vế trước **thể từ điển** + vế sau là **đánh giá** (大切だ・必要だ・欠かせない・役に立つ・問題がある) → **る{上|うえ}で**. Vế sau là **một hành động cụ thể** để đạt mục đích → **ために**.',
        '**Hỏi 3**: thấy **うえに** (có に) + hai ý cùng chiều (tốt + tốt / xấu + xấu) → "không những… mà còn" (Bài 29) — không liên quan gì tới 上で.',
      ],
    },

    /* ══════ ⑦ BẢNG 面で ══════ */
    { t: 'h', text: '⑦ Bảng phân biệt — {面|めん}で ↔ {点|てん}で ↔ において ↔ N{上|じょう} ↔ にとって ↔ について' },
    {
      t: 'table',
      head: ['Mẫu', 'Nghĩa / dùng khi', 'Ví dụ', 'Romaji'],
      rows: [
        ['Nの{面|めん}で／N{面|めん}で', 'VỀ MẶT (một phương diện rộng): kinh tế, an toàn, tinh thần, chi phí', '{費用|ひよう}の{面|めん}で{問題|もんだい}がある', 'hiyou no men de mondai ga aru'],
        ['～という{点|てん}で', 'Ở ĐIỂM (một tiêu chí, một đặc điểm cụ thể — hay có mệnh đề)', '{軽|かる}いという{点|てん}で{優|すぐ}れている', 'karui to iu ten de sugurete iru'],
        ['Nにおいて／Nにおける N', 'Ở, TRONG (nơi chốn, thời gian, lĩnh vực) — văn viết của で', '{会議|かいぎ}は{本社|ほんしゃ}において{行|おこな}われる', 'kaigi wa honsha ni oite okonawareru'],
        ['N{上|じょう}', 'VỀ MẶT N (dính liền danh từ Hán, văn viết gọn)', '{法律上|ほうりつじょう}の{問題|もんだい} · {健康上|けんこうじょう}の{理由|りゆう}', 'houritsujou no mondai · kenkoujou no riyuu'],
        ['Nにとって (Bài 30)', 'ĐỐI VỚI (người, tổ chức) — từ lập trường của N + đánh giá', '{留学生|りゅうがくせい}にとって{大切|たいせつ}な{制度|せいど}', 'ryuugakusei ni totte taisetsu na seido'],
        ['Nについて', 'VỀ (chủ đề của nói, viết, nghĩ)', '{環境問題|かんきょうもんだい}について{論|ろん}じる', 'kankyou mondai ni tsuite ronjiru'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('この{製品|せいひん}は、{価格|かかく}の{面|めん}では{問題|もんだい}ないが、{品質|ひんしつ}の{面|めん}で{不安|ふあん}がある。', 'Kono seihin wa, kakaku no men de wa mondai nai ga, hinshitsu no men de fuan ga aru.', 'Sản phẩm này về giá thì không vấn đề gì, nhưng về chất lượng thì còn lo ngại. (面 — hai mặt)'),
        E('{充電|じゅうでん}が{長|なが}く{持|も}つという{点|てん}で、このスマホを{選|えら}んだ。', 'Juuden ga nagaku motsu to iu ten de, kono sumaho o eranda.', 'Tôi chọn chiếc điện thoại này ở điểm pin dùng được lâu. (点 — tiêu chí cụ thể)'),
        E('{現代|げんだい}の{教育|きょういく}において、{考|かんが}える{力|ちから}が{重視|じゅうし}されている。', 'Gendai no kyouiku ni oite, kangaeru chikara ga juushi sarete iru.', 'Trong giáo dục hiện đại, năng lực tư duy được coi trọng. (において — lĩnh vực)'),
        E('{子|こ}どもにとって、{遊|あそ}ぶことは{学|まな}ぶことでもある。', 'Kodomo ni totte, asobu koto wa manabu koto de mo aru.', 'Đối với trẻ em, chơi cũng là học. (にとって — lập trường)'),
        E('{教育上|きょういくじょう}、このようなゲームは{好|この}ましくない。', 'Kyouikujou, kono you na geemu wa konomashiku nai.', 'Về mặt giáo dục, loại trò chơi như thế này không đáng khuyến khích. (N上)'),
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chọn nhanh',
      items: [
        '**Sau chỗ trống là một LĨNH VỰC rộng** (費用・安全・精神・経済・健康) + đánh giá → **{面|めん}で**. **Trước chỗ trống là một MỆNH ĐỀ + という** → **{点|てん}で**.',
        '**Câu thông báo sự kiện / văn luận + nơi chốn, thời đại, lĩnh vực** → **において**; trước danh từ → **における**.',
        '**Trước chỗ trống là NGƯỜI / tổ chức** (留学生・子ども・会社) + đánh giá (大切だ・難しい) → **にとって**. **Nói / viết / nghĩ VỀ một chủ đề** → **について**.',
      ],
    },

    /* ══════ ⑧ BẢNG べきだ ══════ */
    { t: 'h', text: '⑧ Bảng phân biệt — べきだ ↔ はずだ ↔ ものだ ↔ なければならない ↔ ほうがいい ↔ ことだ' },
    {
      t: 'table',
      head: ['Mẫu', 'Sắc thái', 'Ai nói / dựa vào đâu', 'Ví dụ', 'Romaji'],
      rows: [
        ['V{辞書形|じしょけい}＋べきだ', 'NÊN theo đạo lý — Ý KIẾN mạnh', 'người nói đánh giá; bài luận', '{約束|やくそく}は{守|まも}るべきだ', 'yakusoku wa mamoru beki da'],
        ['{普通形|ふつうけい}＋はずだ (Bài 20)', 'CHẮC LÀ / LẼ RA (suy luận có căn cứ) — KHÔNG phải "nên"', 'người nói suy luận', '{彼|かれ}はもう{着|つ}いたはずだ', 'kare wa mou tsuita hazu da'],
        ['V{辞書形|じしょけい}＋ものだ (Bài 32)', 'LẼ THƯỜNG, chuẩn mực chung của xã hội', '"người ta vốn…"', '{目上|めうえ}の{人|ひと}には{敬語|けいご}を{使|つか}うものだ', 'meue no hito ni wa keigo o tsukau mono da'],
        ['～なければならない', 'PHẢI — nghĩa vụ khách quan, quy định, hoàn cảnh', 'luật, quy định, tình huống', '{期限|きげん}までに{書類|しょるい}を{出|だ}さなければならない', 'kigen made ni shorui o dasanakereba naranai'],
        ['Vた＋ほうがいい', 'KHUYÊN NHẸ, so hai lựa chọn', 'với hầu hết mọi người', '{早|はや}く{寝|ね}たほうがいいよ', 'hayaku neta hou ga ii yo'],
        ['V{辞書形|じしょけい}＋ことだ (Bài 32)', 'LỜI KHUYÊN CỤ THỂ từ người trên', 'người trên → người dưới', '{上手|じょうず}になりたければ、{毎日|まいにち}{練習|れんしゅう}することだ', 'jouzu ni naritakereba, mainichi renshuu suru koto da'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{田中|たなか}さんは{会議|かいぎ}に{来|く}るべきだ。', 'Tanaka-san wa kaigi ni kuru beki da.', 'Anh Tanaka NÊN đến họp. (ý kiến của tôi: đúng ra anh ấy phải có mặt)'),
        E('{田中|たなか}さんは{会議|かいぎ}に{来|く}るはずだ。', 'Tanaka-san wa kaigi ni kuru hazu da.', 'Anh Tanaka CHẮC SẼ đến họp. (suy luận: anh ấy đã nói sẽ đến)'),
        E('この{会社|かいしゃ}では、{会議|かいぎ}の{前|まえ}に{資料|しりょう}を{送|おく}らなければならない。', 'Kono kaisha de wa, kaigi no mae ni shiryou o okuranakereba naranai.', 'Ở công ty này, phải gửi tài liệu trước cuộc họp. (quy định)'),
        E('{人|ひと}の{話|はなし}は{最後|さいご}まで{聞|き}くものだ。', 'Hito no hanashi wa saigo made kiku mono da.', 'Người ta thì vốn phải nghe người khác nói hết câu. (lẽ thường)'),
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chọn nhanh',
      items: [
        '**Có căn cứ để ĐOÁN** (đã hẹn, đã gửi, theo kế hoạch) → **はずだ**. **Ý KIẾN về điều đúng đắn** → **べきだ**. Bẫy kinh điển: "{来|く}るべきだ" (nên đến) ↔ "{来|く}るはずだ" (chắc sẽ đến).',
        '**Luật, quy định, điều kiện bắt buộc** → **なければならない** (không phải べきだ). **Lẽ thường của xã hội** (ai cũng thế) → **ものだ**.',
        '**Khuyên bạn bè** → **ほうがいい**. **Người trên khuyên cụ thể** → **ことだ**. **Viết luận / báo cáo** → **べきだ／べきである**.',
      ],
    },

    /* ══════ ⑨ BẢNG ねばならない ══════ */
    { t: 'h', text: '⑨ Bảng phân biệt — ねばならない ↔ なければならない ↔ ざるを{得|え}ない ↔ しかない ↔ べきだ' },
    {
      t: 'table',
      head: ['Mẫu', 'Sắc thái', 'Ví dụ', 'Romaji', 'Nói / viết'],
      rows: [
        ['Vない＋ねばならない', 'PHẢI — văn viết cổ, trang trọng, giọng kêu gọi', '{我々|われわれ}は{真実|しんじつ}を{伝|つた}えねばならない', 'wareware wa shinjitsu o tsutaeneba naranai', 'viết (xã luận, diễn văn)'],
        ['～なければならない', 'PHẢI — trung tính (nghĩa vụ, quy định, hoàn cảnh)', 'レポートを{金曜日|きんようび}までに{出|だ}さなければならない', 'repooto o kin\'youbi made ni dasanakereba naranai', 'cả hai'],
        ['Vない＋ざるを{得|え}ない (Bài 45)', 'ĐÀNH PHẢI — không muốn nhưng hoàn cảnh ép', '{雨|あめ}で{中止|ちゅうし}せざるを{得|え}なかった', 'ame de chuushi sezaru o enakatta', 'cả hai, hơi cứng'],
        ['V{辞書形|じしょけい}＋しかない (Bài 47)', 'CHỈ CÒN CÁCH — không còn lựa chọn khác', '{終電|しゅうでん}がないので、タクシーで{帰|かえ}るしかない', 'shuuden ga nai node, takushii de kaeru shika nai', 'cả hai'],
        ['V{辞書形|じしょけい}＋べきだ', 'NÊN — ý kiến về điều đúng đắn (không bắt buộc khách quan)', '{国|くに}はもっと{支援|しえん}すべきだ', 'kuni wa motto shien subeki da', 'cả hai, luận'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{台風|たいふう}のため、{旅行|りょこう}を{中止|ちゅうし}せざるを{得|え}なかった。', 'Taifuu no tame, ryokou o chuushi sezaru o enakatta.', 'Vì bão nên đành phải huỷ chuyến đi. (không muốn — hoàn cảnh ép)'),
        E('{留学|りゅうがく}するには、ビザを{取|と}らなければならない。', 'Ryuugaku suru ni wa, biza o toranakereba naranai.', 'Muốn đi du học thì phải xin visa. (điều kiện bắt buộc)'),
        E('{人類|じんるい}は、{戦争|せんそう}のない{世界|せかい}を{目指|めざ}さねばならない。', 'Jinrui wa, sensou no nai sekai o mezasaneba naranai.', 'Nhân loại phải hướng tới một thế giới không chiến tranh. (giọng kêu gọi)'),
        E('{誰|だれ}も{手伝|てつだ}ってくれないなら、{一人|ひとり}でやるしかない。', 'Dare mo tetsudatte kurenai nara, hitori de yaru shika nai.', 'Nếu không ai giúp thì chỉ còn cách làm một mình. (không còn lựa chọn)'),
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chọn nhanh',
      items: [
        '**Thấy giọng xã luận, kêu gọi, chủ ngữ 我々・人類・社会** → **ねばならない** (= なければならない).',
        '**Có ý "không muốn mà vẫn phải" + nguyên nhân bên ngoài** (台風・病気・会社の命令) → **ざるを{得|え}ない**. **Có ý "không còn cách nào khác"** → **しかない**.',
        '**Là ý kiến, có thể tranh cãi** → **べきだ**; **là nghĩa vụ ai cũng phải theo** → **なければならない**.',
      ],
    },

    { t: 'h', text: 'Luyện tập — ghép câu, điền mẫu, chuyển văn phong, đề JLPT' },
    {
      t: 'build',
      id: 'b52-np-ghep',
      title: 'Ghép câu (12 câu) — bấm các mảnh theo đúng thứ tự',
      items: [
        { vi: 'Tôi sẽ bàn với bố mẹ rồi mới quyết định.', chips: ['{両親|りょうしん}と', '{相談|そうだん}した', '{上|うえ}で、', '{決|き}めます', '{相談|そうだん}する'], answer: ['{両親|りょうしん}と', '{相談|そうだん}した', '{上|うえ}で、', '{決|き}めます'], ro: 'Ryoushin to soudan shita ue de, kimemasu.' },
        { vi: 'Khi làm việc ở Nhật, kính ngữ là không thể thiếu.', chips: ['{日本|にほん}で', '{働|はたら}く', '{上|うえ}で、', '{敬語|けいご}は{欠|か}かせない', '{働|はたら}いた'], answer: ['{日本|にほん}で', '{働|はたら}く', '{上|うえ}で、', '{敬語|けいご}は{欠|か}かせない'], ro: 'Nihon de hataraku ue de, keigo wa kakasenai.' },
        { vi: 'Xin hãy xem các điều cần lưu ý rồi mới đăng ký.', chips: ['{注意事項|ちゅういじこう}を', 'ご{確認|かくにん}の', '{上|うえ}、', 'お{申|もう}し{込|こ}みください', 'うえに'], answer: ['{注意事項|ちゅういじこう}を', 'ご{確認|かくにん}の', '{上|うえ}、', 'お{申|もう}し{込|こ}みください'], ro: 'Chuui jikou o gokakunin no ue, omoushikomi kudasai.' },
        { vi: 'Hệ thống mới có lợi lớn về mặt chi phí.', chips: ['{新|あたら}しいシステムは', '{費用|ひよう}の', '{面|めん}で', '{大|おお}きなメリットがある', '{点|てん}に'], answer: ['{新|あたら}しいシステムは', '{費用|ひよう}の', '{面|めん}で', '{大|おお}きなメリットがある'], ro: 'Atarashii shisutemu wa hiyou no men de ookina meritto ga aru.' },
        { vi: 'Sản phẩm của công ty A vượt trội ở điểm dễ sử dụng.', chips: ['A{社|しゃ}の{製品|せいひん}は', '{使|つか}いやすい', 'という{点|てん}で', '{優|すぐ}れている', 'の{面|めん}で'], answer: ['A{社|しゃ}の{製品|せいひん}は', '{使|つか}いやすい', 'という{点|てん}で', '{優|すぐ}れている'], ro: 'Ee-sha no seihin wa tsukaiyasui to iu ten de sugurete iru.' },
        { vi: 'Số du học sinh ở Nhật tăng lên hằng năm.', chips: ['{日本|にほん}', 'における', '{留学生|りゅうがくせい}の{数|かず}は', '{年々|ねんねん}{増|ふ}えている', 'において'], answer: ['{日本|にほん}', 'における', '{留学生|りゅうがくせい}の{数|かず}は', '{年々|ねんねん}{増|ふ}えている'], ro: 'Nihon ni okeru ryuugakusei no kazu wa nennen fuete iru.' },
        { vi: 'Mục đích của nghiên cứu này là làm rõ khó khăn của du học sinh.', chips: ['{本研究|ほんけんきゅう}の{目的|もくてき}は', '{留学生|りゅうがくせい}の{悩|なや}みを', '{明|あき}らかにすること', 'である', 'です'], answer: ['{本研究|ほんけんきゅう}の{目的|もくてき}は', '{留学生|りゅうがくせい}の{悩|なや}みを', '{明|あき}らかにすること', 'である'], ro: 'Honkenkyuu no mokuteki wa ryuugakusei no nayami o akiraka ni suru koto de aru.' },
        { vi: 'Tiền nhà đắt, cuộc sống không dễ dàng.', chips: ['{家賃|やちん}が', '{高|たか}く、', '{生活|せいかつ}は', '{楽|らく}ではない', '{高|たか}いで、'], answer: ['{家賃|やちん}が', '{高|たか}く、', '{生活|せいかつ}は', '{楽|らく}ではない'], ro: 'Yachin ga takaku, seikatsu wa raku de wa nai.' },
        { vi: 'Không nên dùng bài viết của người khác mà không ghi nguồn.', chips: ['{出典|しゅってん}を{書|か}かずに', '{他人|たにん}の{文章|ぶんしょう}を', '{使|つか}う', 'べきではない', '{使|つか}わない'], answer: ['{出典|しゅってん}を{書|か}かずに', '{他人|たにん}の{文章|ぶんしょう}を', '{使|つか}う', 'べきではない'], alt: [['{他人|たにん}の{文章|ぶんしょう}を', '{出典|しゅってん}を{書|か}かずに', '{使|つか}う', 'べきではない']], ro: 'Shutten o kakazu ni tanin no bunshou o tsukau beki de wa nai.' },
        { vi: 'Có ba vấn đề cần giải quyết từ nay.', chips: ['{今後|こんご}', '{取|と}り{組|く}む', 'べき', '{課題|かだい}は{三|みっ}つある', 'べきだ'], answer: ['{今後|こんご}', '{取|と}り{組|く}む', 'べき', '{課題|かだい}は{三|みっ}つある'], ro: 'Kongo torikumu beki kadai wa mittsu aru.' },
        { vi: 'Chúng ta phải bảo vệ thiên nhiên vì thế hệ sau.', chips: ['{我々|われわれ}は', '{次|つぎ}の{世代|せだい}のために', '{自然|しぜん}を', '{守|まも}らねばならない', '{守|まも}りねばならない'], answer: ['{我々|われわれ}は', '{次|つぎ}の{世代|せだい}のために', '{自然|しぜん}を', '{守|まも}らねばならない'], ro: 'Wareware wa tsugi no sedai no tame ni shizen o mamoraneba naranai.' },
        { vi: 'Vấn đề này phải được toàn xã hội cùng giải quyết.', chips: ['この{問題|もんだい}は', '{社会全体|しゃかいぜんたい}で', '{解決|かいけつ}', 'せねばならない', 'しねばならない'], answer: ['この{問題|もんだい}は', '{社会全体|しゃかいぜんたい}で', '{解決|かいけつ}', 'せねばならない'], ro: 'Kono mondai wa shakai zentai de kaiketsu seneba naranai.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b52-np-dien',
      title: 'Điền mẫu (12 câu) — gõ phần còn thiếu',
      kind: 'fill',
      items: [
        { q: 'よく{考|かんが}えた（　　）で、{返事|へんじ}をします。（rồi mới）', answers: V('{上|うえ}'), hint: 'Vた＋上で' },
        { q: '{論文|ろんぶん}を{書|か}く{上|うえ}で（　　）なのは、はっきりした{問|と}いを{立|た}てることだ。（quan trọng）', answers: V('{大切|たいせつ}', '{大事|だいじ}', '{重要|じゅうよう}'), hint: 'る上で＋大切だ' },
        { q: '{検討|けんとう}の（　　）、ご{連絡|れんらく}いたします。（xem xét rồi mới）', answers: V('{上|うえ}'), hint: 'Nの上' },
        { q: 'この{計画|けいかく}は、{安全|あんぜん}の（　　）で{問題|もんだい}がある。（về mặt）', answers: V('{面|めん}'), hint: 'Nの面で' },
        { q: '{軽|かる}いという（　　）で、このパソコンを{選|えら}んだ。（ở điểm）', answers: V('{点|てん}'), hint: '～という点で' },
        { q: '{会議|かいぎ}は{本社|ほんしゃ}（　　）{行|おこな}われる。（tại — văn viết）', answers: V('において'), hint: 'Nにおいて' },
        { q: '{回答者|かいとうしゃ}の{多|おお}くは{一年生|いちねんせい}（　　）。（である体 — quá khứ）', answers: V('であった', 'だった'), hint: 'N＋であった' },
        { q: 'この{傾向|けいこう}は、{今後|こんご}も{続|つづ}く（　　）。（である体 — phỏng đoán）', answers: V('だろう', 'であろう'), hint: '～でしょう → ～だろう' },
        { q: '{約束|やくそく}は{守|まも}る（　　）だ。（nên — đạo lý）', answers: V('べき'), hint: 'V辞書形＋べきだ' },
        { q: '{他人|たにん}の{意見|いけん}を{無視|むし}（　　）ではない。（không nên — する）', answers: V('すべき', 'するべき'), hint: 'する → すべき' },
        { q: '{我々|われわれ}はこの{問題|もんだい}を{真剣|しんけん}に{考|かんが}え（　　）ならない。（phải — văn viết cổ）', answers: V('ねば'), hint: 'Vない（bỏ ない）＋ねばならない' },
        { q: '{国|くに}はすぐに{対策|たいさく}を（　　）ねばならない。（する — dạng ねば）', answers: V('せ'), hint: 'する → せねばならない' },
      ],
    },
    {
      t: 'quiz',
      id: 'b52-np-van-viet',
      title: 'Chuyển sang だ・である体 (10 câu) — gõ câu văn viết',
      kind: 'translate',
      grammar: 'N・ナA → である／であった · イA・V → thể thường (không thêm だ／である) · のです → のである · でしょう → だろう／であろう · と思います → と考える／と考えられる',
      items: [
        { q: 'この{調査|ちょうさ}の{目的|もくてき}は、{留学生|りゅうがくせい}の{生活|せいかつ}を{知|し}ることです。', answers: V('この{調査|ちょうさ}の{目的|もくてき}は、{留学生|りゅうがくせい}の{生活|せいかつ}を{知|し}ることである。', 'この{調査|ちょうさ}の{目的|もくてき}は、{留学生|りゅうがくせい}の{生活|せいかつ}を{知|し}ることだ。'), hint: '～ことです → ～ことである' },
        { q: '{回答者|かいとうしゃ}は{百二十人|ひゃくにじゅうにん}でした。', answers: V('{回答者|かいとうしゃ}は{百二十人|ひゃくにじゅうにん}であった。', '{回答者|かいとうしゃ}は{百二十人|ひゃくにじゅうにん}だった。', '{回答者|かいとうしゃ}は120{人|にん}であった。', '{回答者|かいとうしゃ}は120{人|にん}だった。'), hint: 'でした → であった／だった' },
        { q: 'アルバイトをしている{学生|がくせい}は{多|おお}いです。', answers: V('アルバイトをしている{学生|がくせい}は{多|おお}い。'), hint: 'イA：です を取るだけ' },
        { q: '{睡眠時間|すいみんじかん}が{減|へ}っています。', answers: V('{睡眠時間|すいみんじかん}が{減|へ}っている。'), hint: 'ています → ている' },
        { q: 'その{理由|りゆう}は{明|あき}らかではありません。', answers: V('その{理由|りゆう}は{明|あき}らかではない。'), hint: 'ではありません → ではない' },
        { q: 'この{問題|もんだい}は{今後|こんご}も{続|つづ}くでしょう。', answers: V('この{問題|もんだい}は{今後|こんご}も{続|つづ}くだろう。', 'この{問題|もんだい}は{今後|こんご}も{続|つづ}くであろう。'), hint: 'でしょう → だろう／であろう' },
        { q: '{学生|がくせい}は{時間|じかん}がないのではなく、{使|つか}い{方|かた}を{知|し}らないのです。', answers: V('{学生|がくせい}は{時間|じかん}がないのではなく、{使|つか}い{方|かた}を{知|し}らないのである。', '{学生|がくせい}は{時間|じかん}がないのではなく、{使|つか}い{方|かた}を{知|し}らないのだ。'), hint: 'のです → のである' },
        { q: '{大学|だいがく}はもっと{支援|しえん}を{増|ふ}やすべきだと{思|おも}います。', answers: V('{大学|だいがく}はもっと{支援|しえん}を{増|ふ}やすべきだと{考|かんが}える。', '{大学|だいがく}はもっと{支援|しえん}を{増|ふ}やすべきである。', '{大学|だいがく}はもっと{支援|しえん}を{増|ふ}やすべきだ。', '{大学|だいがく}はもっと{支援|しえん}を{増|ふ}やすべきだと{思|おも}う。'), hint: 'と思います → と考える' },
        { q: '{次|つぎ}に、{調査|ちょうさ}の{結果|けっか}を{見|み}てみましょう。', answers: V('{次|つぎ}に、{調査|ちょうさ}の{結果|けっか}を{見|み}てみよう。', '{次|つぎ}に、{調査|ちょうさ}の{結果|けっか}を{見|み}ていく。', '{次|つぎ}に、{調査|ちょうさ}の{結果|けっか}を{見|み}ていきたい。'), hint: 'ましょう → よう／ていく' },
        { q: 'この{方法|ほうほう}は{便利|べんり}で、{費用|ひよう}もかかりません。（中止形 であり）', answers: V('この{方法|ほうほう}は{便利|べんり}であり、{費用|ひよう}もかからない。'), hint: 'ナAで → ナAであり' },
      ],
    },
    {
      t: 'mcq',
      id: 'b52-np-jlpt',
      title: 'Đề JLPT N2 — 文法形式の判断 (12 câu) + 文の組み立て ★ (4 câu)',
      items: [
        MQ('{留学|りゅうがく}するかどうかは、{家族|かぞく}とよく{話|はな}し{合|あ}った（　）{決|き}めたい。', '{上|うえ}で', ['うえに', '{際|さい}に', 'ために'], 'Vた + bàn bạc kỹ (bước cần có) + quyết định → **た{上|うえ}で** (①a). うえに = "không những… mà còn". 〔Yoku hanashiatta ue de kimetai.〕'),
        MQ('{外国語|がいこくご}を{身|み}につける（　）、{大切|たいせつ}なのは{毎日|まいにち}{続|つづ}けることだ。', '{上|うえ}で', ['うえに', 'かと{思|おも}うと', '{際|さい}に'], 'V辞書形 + đánh giá (大切なのは) → **る{上|うえ}で** (①b). 〔Mi ni tsukeru ue de, taisetsu na no wa…〕'),
        MQ('この{部屋|へや}は{駅|えき}から{近|ちか}い（　）、{家賃|やちん}も{安|やす}い。', 'うえに', ['{上|うえ}で', '{面|めん}で', 'べきで'], 'Hai ý tốt cộng thêm (gần ga + rẻ) → **うえに** (Bài 29), không phải 上で. 〔Eki kara chikai ue ni, yachin mo yasui.〕'),
        MQ('この{車|くるま}は、デザインはいいが、{安全|あんぜん}の（　）では{問題|もんだい}がある。', '{面|めん}', ['{上|うえ}', 'べき', 'はず'], 'Về một mặt rộng (an toàn) → **Nの{面|めん}では** (②). 〔Anzen no men de wa mondai ga aru.〕'),
        MQ('{操作|そうさ}が{簡単|かんたん}だという（　）、この{機械|きかい}は{高齢者|こうれいしゃ}に{人気|にんき}がある。', '{点|てん}で', ['{面|めん}に', 'において', '{上|うえ}に'], 'Mệnh đề + という + tiêu chí cụ thể → **という{点|てん}で** (②). 〔Kantan da to iu ten de…〕'),
        MQ('{卒業式|そつぎょうしき}は、{三月|さんがつ}{二十日|はつか}に{大学|だいがく}の{講堂|こうどう}（　）{行|おこな}われる。', 'において', ['にとって', 'について', 'の{面|めん}で'], 'Nơi diễn ra sự kiện, văn thông báo → **において** (②). 〔Koudou ni oite okonawareru.〕'),
        MQ('レポートの{文|ぶん}として{正|ただ}しいのはどれか。', 'この{結果|けっか}は{予想|よそう}と{大|おお}きく{異|こと}なっていた。', ['この{結果|けっか}は{予想|よそう}とすごく{違|ちが}ってた。', 'この{結果|けっか}は{予想|よそう}と{大|おお}きく{異|こと}なっていたである。', 'この{結果|けっか}は{予想|よそう}と{大|おお}きく{異|こと}なっていました。'], 'Thể だ・である + từ văn viết → đúng. Các câu kia: văn nói (すごく・違ってた); thêm である sau động từ (sai); です・ます (trộn thể). 〔Yosou to ookiku kotonatte ita.〕'),
        MQ('{他人|たにん}のデータを、{許可|きょか}なく{使|つか}う（　）。', 'べきではない', ['べきだ', 'ないべきだ', 'べきでなくて'], 'Phê phán + phủ định đặt ở べき → **べきではない** (④). ~~ないべきだ~~ sai. 〔Kyoka naku tsukau beki de wa nai.〕'),
        MQ('{会議|かいぎ}の{資料|しりょう}は{昨日|きのう}{送|おく}ったから、もう{届|とど}いている（　）。', 'はずだ', ['わけがない', 'ものだ', 'ことだ'], 'Có căn cứ (đã gửi hôm qua) → suy đoán **はずだ** (bảng ⑧), không phải "nên". 〔Mou todoite iru hazu da.〕'),
        MQ('{困|こま}っている{人|ひと}がいたら、{助|たす}ける（　）。', 'べきだ', ['はずだ', 'わけだ', 'おそれがある'], 'Ý kiến về điều đúng đắn (đạo lý) → **べきだ** (④). はずだ là suy đoán; わけだ là kết luận logic; おそれがある là lo điều xấu. 〔Tasukeru beki da.〕'),
        MQ('この{問題|もんだい}は、{国|くに}が{責任|せきにん}を{持|も}って{解決|かいけつ}（　）ならない。', 'せねば', ['しねば', 'すねば', 'さねば'], 'する + ねばならない → **せねばならない** (⑤). 〔Kaiketsu seneba naranai.〕'),
        MQ('{大雪|おおゆき}で{電車|でんしゃ}が{止|と}まったので、{会議|かいぎ}を{延期|えんき}せざるを（　）。', '{得|え}なかった', ['ならなかった', 'べきだった', 'しかなかった'], 'Bị hoàn cảnh ép (tuyết lớn) + せざるを → **{得|え}なかった** (ôn Bài 45, bảng ⑨). 〔Enki sezaru o enakatta.〕'),
        { q: '★ {契約書|けいやくしょ}の ＿＿ ＿＿ ★ ＿＿ ください。（{上|うえ}で／{内容|ないよう}を／サインして／{確認|かくにん}した）', options: ['{上|うえ}で', '{内容|ないよう}を', 'サインして', '{確認|かくにん}した'], correct: 0, why: 'Câu đúng: {契約書|けいやくしょ}の **{内容|ないよう}を {確認|かくにん}した {上|うえ}で サインして** ください. ★ (ô 3) = **{上|うえ}で**.' },
        { q: '★ この{案|あん}は ＿＿ ★ ＿＿ ＿＿ {不安|ふあん}が{残|のこ}る。（{面|めん}では／{安全|あんぜん}の／{費用|ひよう}は{安|やす}いが／まだ）', options: ['{面|めん}では', '{安全|あんぜん}の', '{費用|ひよう}は{安|やす}いが', 'まだ'], correct: 1, why: 'Câu đúng: この{案|あん}は **{費用|ひよう}は{安|やす}いが {安全|あんぜん}の {面|めん}では まだ** {不安|ふあん}が{残|のこ}る. ★ (ô 2) = **{安全|あんぜん}の**.' },
        { q: '★ {研究者|けんきゅうしゃ}は ＿＿ ＿＿ ★ ＿＿ 。（{誠実|せいじつ}で／ならない／データに{対|たい}して／あらねば）', options: ['{誠実|せいじつ}で', 'ならない', 'データに{対|たい}して', 'あらねば'], correct: 3, why: 'Câu đúng: {研究者|けんきゅうしゃ}は **データに{対|たい}して {誠実|せいじつ}で あらねば ならない**. ★ (ô 3) = **あらねば**.' },
        { q: '★ {今後|こんご} ＿＿ ★ ＿＿ ＿＿ {整理|せいり}しておきたい。（べき／{取|と}り{組|く}む／{課題|かだい}を／{最後|さいご}に）', options: ['べき', '{取|と}り{組|く}む', '{課題|かだい}を', '{最後|さいご}に'], correct: 0, why: 'Câu đúng: {今後|こんご} **{取|と}り{組|く}む べき {課題|かだい}を {最後|さいご}に** {整理|せいり}しておきたい. ★ (ô 2) = **べき**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b52-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 24 chữ: 序 章 構 執 旨 範 括 欄 箇 冒 尾 典 唆 視 堅 潔 該 遍 唱 模 盤 版 倫 刊',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 24 chữ Hán của báo cáo, luận văn: bố cục (序論・順序・文章・第一章・構成・構造・冒頭・末尾・箇所・箇条書き), soạn thảo (執筆・要旨・趣旨・総括・一括・空欄・記入欄), nguồn & xuất bản (出典・辞典・典型的・出版・改訂版・朝刊・夕刊・刊行), lập luận (示唆・視点・重視・無視・視野・普遍的・提唱・唱える・倫理), đánh giá & nền tảng (範囲・模範・規模・該当・該当者・基盤・序盤・終盤・堅い・簡潔・清潔) — biết khi nào đọc Kun (構える・執る・旨・括る・冒す・尾・唆す・堅い・潔い・唱える) và khi nào đọc On, nhớ các bẫy: 規模 đọc きぼ (模 = ボ), 執筆 có っ (しっぴつ), 出版 = しゅっぱん (ハ → パ), 改訂版 = ～ばん, 第一章 = だいいっしょう, 範囲 = はんい (han-i).',
  minutes: 60,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 52 là **24 chữ** đi theo đúng các từ của **báo cáo và luận văn**: 序 章 構 執 旨 範 括 欄 箇 冒 尾 典 唆 視 堅 潔 該 遍 唱 模 盤 版 倫 刊. Nhiều chữ "học thuật" khác bạn **đã học** ở bài trước — 論 (Bài 26), 述・考・察・証・拠・引・用・筆・摘・析・検・討・査・示・献・稿 — nên ghép với chữ mới là đọc được ngay: **{序論|じょろん}・{執筆|しっぴつ}・{出典|しゅってん}・{示唆|しさ}・{視点|してん}・{模範|もはん}**. Nhiều từ bạn đã **gặp có furigana**: **{規模|きぼ}** (Bài 33), **{視点|してん}** (Bài 43), **{徹底|てってい}**, **{結構|けっこう}**, **{文章|ぶんしょう}**, **{清潔|せいけつ}**, **{辞典|じてん}** — nay học để **đọc không cần furigana** như đề thi. Phần lớn là **chữ hình thanh**: một bộ chỉ nghĩa + một phần gợi âm (構・講・購 cùng đọc コウ; 版・板・坂・販 cùng có 反 → ハン／バン; 倫・論・輪 cùng có 侖 → リン／ロン) — nhớ phần gợi âm là đoán được cách đọc On.',
    },
    {
      t: 'table',
      caption: '24 chữ Hán mới của Bài 52',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['序', 'TỰ', 'ジョ', '—', 'thứ tự; mở đầu', '{序論|じょろん} (phần mở đầu — N1) · {順序|じゅんじょ} (thứ tự — N2) · {序盤|じょばん} (giai đoạn đầu)', '👁 N2'],
        ['章', 'CHƯƠNG', 'ショウ', '—', 'chương; văn chương', '{文章|ぶんしょう} (bài văn — N3) · {第一章|だいいっしょう} (chương một) · {章|しょう} (chương)', '✍ N3'],
        ['構', 'CẤU', 'コウ', 'かま(える)・かま(う)', 'kết cấu, dựng', '{構成|こうせい} (bố cục — N2) · {構造|こうぞう} (cấu trúc) · {結構|けっこう} · {構|かま}わない', '✍ N3'],
        ['執', 'CHẤP', 'シツ・シュウ', 'と(る)', 'cầm, nắm', '{執筆|しっぴつ} (chấp bút — N1) · {執着|しゅうちゃく} (bám chặt) · {筆|ふで}を{執|と}る', '👁 N1'],
        ['旨', 'CHỈ', 'シ', 'むね', 'ý chính', '{要旨|ようし} (ý chính tóm tắt — N1) · {趣旨|しゅし} (mục đích) · ～{旨|むね} (nội dung là…)', '👁 N1'],
        ['範', 'PHẠM', 'ハン', '—', 'khuôn mẫu; giới hạn', '{範囲|はんい} (phạm vi — N2) · {模範|もはん} (mẫu mực) · {規範|きはん}', '👁 N2'],
        ['括', 'QUÁT', 'カツ', 'くく(る)', 'buộc, gom lại', '{総括|そうかつ} (tổng kết) · {一括|いっかつ} (gộp một lần) · {括弧|かっこ} (dấu ngoặc) · {括|くく}る', '👁 N1'],
        ['欄', 'LAN', 'ラン', '—', 'cột, ô (trên giấy)', '{空欄|くうらん} (ô trống — N2) · {記入欄|きにゅうらん} (ô điền) · {欄|らん} (cột, mục)', '👁 N1'],
        ['箇', 'CÁ', 'カ', '—', 'cái, chỗ (đếm)', '{箇所|かしょ} (chỗ — N2) · {箇条書|かじょうが}き (gạch đầu dòng) · {一箇所|いっかしょ}', '👁 N1'],
        ['冒', 'MẠO', 'ボウ', 'おか(す)', 'liều; phần đầu', '{冒頭|ぼうとう} (phần đầu — N1) · {冒険|ぼうけん} (phiêu lưu — N2) · {危険|きけん}を{冒|おか}す', '👁 N1'],
        ['尾', 'VĨ', 'ビ', 'お', 'đuôi; phần cuối', '{末尾|まつび} (phần cuối) · {尾|お} (đuôi) · {尾根|おね} (sống núi)', '👁 N2'],
        ['典', 'ĐIỂN', 'テン', '—', 'sách quý; khuôn phép', '{出典|しゅってん} (nguồn trích) · {辞典|じてん} (từ điển) · {典型的|てんけいてき} (điển hình) · {古典|こてん}', '✍ N2'],
        ['唆', 'TOA', 'サ', 'そそのか(す)', 'xúi; gợi ý', '{示唆|しさ} (gợi ý, cho thấy — N1) · {唆|そそのか}す (xúi giục)', '👁 N1'],
        ['視', 'THỊ', 'シ', '—', 'nhìn kỹ, coi', '{視点|してん} (điểm nhìn) · {重視|じゅうし} (coi trọng) · {無視|むし} (phớt lờ) · {視野|しや} (tầm nhìn)', '✍ N2'],
        ['堅', 'KIÊN', 'ケン', 'かた(い)', 'cứng, chắc', '{堅|かた}い (chắc; cứng nhắc — N2) · {堅実|けんじつ} (vững vàng) · {中堅|ちゅうけん} (nòng cốt)', '👁 N2'],
        ['潔', 'KHIẾT', 'ケツ', 'いさぎよ(い)', 'trong sạch; gọn', '{簡潔|かんけつ} (ngắn gọn — N2) · {清潔|せいけつ} (sạch sẽ — N3) · {潔|いさぎよ}い (dứt khoát)', '👁 N2'],
        ['該', 'CAI', 'ガイ', '—', 'đúng vào, thuộc về', '{該当|がいとう}（する） (khớp, thuộc diện — N1, hay gặp trong đơn từ) · {該当者|がいとうしゃ} (người thuộc diện) · {当該|とうがい} (… nói trên)', '👁 N1'],
        ['遍', 'BIẾN', 'ヘン', '—', 'khắp; lượt', '{普遍的|ふへんてき} (phổ quát — N1) · {普遍|ふへん} · {一遍|いっぺん} (một lượt)', '👁 N1'],
        ['唱', 'XƯỚNG', 'ショウ', 'とな(える)', 'hô to; đề xướng', '{提唱|ていしょう} (đề xướng — N1) · {唱|とな}える (nêu lên — N1) · {合唱|がっしょう} (đồng ca)', '👁 N2'],
        ['模', 'MÔ', 'モ・ボ', '—', 'khuôn, mẫu', '{模範|もはん} (mẫu mực) · {規模|きぼ} (quy mô — đọc ボ!) · {模型|もけい} · {模様|もよう}', '👁 N2'],
        ['盤', 'BÀN', 'バン', '—', 'cái mâm; nền; ván (cờ)', '{基盤|きばん} (nền tảng — N2) · {序盤|じょばん}・{終盤|しゅうばん} (giai đoạn đầu / cuối) · {地盤|じばん} (nền đất)', '👁 N2'],
        ['版', 'BẢN', 'ハン', '—', 'bản in, ấn bản', '{出版|しゅっぱん} (xuất bản — N2) · {出版社|しゅっぱんしゃ} · {改訂版|かいていばん} (bản sửa đổi) · {初版|しょはん}', '✍ N2'],
        ['倫', 'LUÂN', 'リン', '—', 'luân lý, đạo đức', '{倫理|りんり} (luân lý — N2) · {倫理的|りんりてき} · {倫理観|りんりかん}', '👁 N1'],
        ['刊', 'SAN', 'カン', '—', 'in, phát hành', '{朝刊|ちょうかん} (báo sáng — N2) · {夕刊|ゆうかん} (báo chiều) · {週刊誌|しゅうかんし} (tuần san) · {刊行|かんこう}', '✍ N2'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**序** = 广 (mái nhà) + 予 (trước, gợi âm ヨ → ジョ): dưới **mái nhà** xếp đồ theo thứ tự đã định **từ trước** = THỨ TỰ, phần ĐẦU → {序論|じょろん}. **章** = 音 (bản nhạc) + 十 (trọn): một bản **nhạc** tấu **trọn** = một CHƯƠNG → {文章|ぶんしょう}. **構** = 木 (gỗ) + 冓 (khung gỗ đan nhau, gợi âm コウ): **gỗ ghép thành khung** = CẤU trúc → {構成|こうせい}.',
        '**執** = 幸 (ở đây là hình cái **cùm** tay) + 丸 (người quỳ chìa tay): tay **bị cùm giữ chặt** = NẮM GIỮ → {執筆|しっぴつ} (cầm bút). **旨** = 匕 (thìa) + 日 (vốn là 甘 — vị ngọt): **thìa đưa món ngon** vào miệng → phần "ngon nhất" của bài = Ý CHÍNH → {要旨|ようし}. **範** = ⺮ (tre) + 車 (xe) + 㔾: **khuôn tre** đo cỡ bánh **xe** = KHUÔN, GIỚI HẠN → {範囲|はんい}, {模範|もはん}.',
        '**括** = 扌 (tay) + 舌 (thật ra là 𠯑 viết gọn — gợi âm カツ): **tay thắt miệng túi** gom lại = BUỘC, TỔNG QUÁT → {総括|そうかつ}. **欄** = 木 (gỗ) + 闌 (cửa có thanh chắn, gợi âm ラン): **thanh gỗ chắn** = LAN CAN; trên giấy: đường kẻ chia ô → {空欄|くうらん}. **箇** = ⺮ (tre) + 固 (gợi âm コ → カ): **thẻ tre** đếm từng cái = CÁ → {箇所|かしょ}.',
        '**冒** = 冃 (mũ trùm) + 目 (mắt): **mũ trùm tới mắt** vẫn xông lên = LIỀU; mũ ở **trên đầu** → {冒頭|ぼうとう} (phần đầu). **尾** = 尸 (thân sau) + 毛 (lông): **lông ở phía sau** thân = ĐUÔI → {末尾|まつび}. **典** = 冊 (sách thẻ tre) + 丌 (giá kê): **sách quý đặt trên giá** = KINH ĐIỂN → {辞典|じてん}, {出典|しゅってん}.',
        '**唆** = 口 (miệng) + 夋 (gợi âm): **dùng miệng** đẩy người khác làm = XÚI → {示唆|しさ} (gợi ý — nghĩa trung tính). **視** = 礻 (vốn là 示 — bày ra, gợi âm シ) + 見 (nhìn): **nhìn thứ bày ra** = NHÌN KỸ → {視点|してん}. **堅** = 臤 (giữ chắc, gợi âm ケン) + 土 (đất): **đất nện chắc** = CỨNG → {堅|かた}い. **潔** = 氵 (nước) + 絜 (buộc gọn, gợi âm ケツ): **nước rửa sạch, gọn** → {簡潔|かんけつ}, {清潔|せいけつ}.',
        '**該** = 言 (lời) + 亥 (gợi âm ガイ): **lời nói khớp đúng** vào trường hợp đang xét = ĐÚNG VÀO → {該当|がいとう} (thuộc diện, khớp với điều kiện). **遍** = 辶 (đi) + 扁 (tấm biển, gợi âm ヘン): **đi khắp nơi** = KHẮP → {普遍|ふへん}. **唱** = 口 + 昌 (rực rỡ, gợi âm ショウ): **tiếng vang rực rỡ** = XƯỚNG → {提唱|ていしょう}. **模** = 木 + 莫 (gợi âm モ): **khuôn gỗ** để đúc theo = MẪU → {模範|もはん}, {規模|きぼ}.',
        '**盤** = 般 (con thuyền chở hàng — gợi âm ハン → バン) + 皿 (cái mâm, cái đĩa): **cái MÂM lớn, phẳng** = BÀN; mặt phẳng làm chỗ dựa = NỀN → {基盤|きばん}; bàn cờ → {序盤|じょばん}・{終盤|しゅうばん} (giai đoạn đầu / cuối ván). **版** = 片 (mảnh gỗ) + 反 (gợi âm ハン): **mảnh gỗ khắc để in** = BẢN → {出版|しゅっぱん}. **倫** = 亻 (người) + 侖 (thẻ tre xếp thứ tự, gợi âm リン): **thứ bậc giữa người với người** = LUÂN → {倫理|りんり}. **刊** = 干 (gợi âm カン) + 刂 (dao): **dao khắc chữ** để in = SAN → {朝刊|ちょうかん}.',
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — đề 表記 hay cài bẫy',
      head: ['Chữ của bài', 'Dễ nhầm với', 'Phân biệt'],
      rows: [
        ['序 (じょ)', '予 (よ — dự) · 預 (あず — gửi)', '序 = **广** bọc ngoài 予; 預 = 予 + 頁'],
        ['章 (しょう)', '障 (しょう — {故障|こしょう}) · 意 (い)', '障 = **阝** + 章 (vật cản) · 意 dưới là **心**, 章 dưới là **十**'],
        ['構 (こう)', '講 (こう — {講義|こうぎ}) · 購 (こう — {購入|こうにゅう})', 'Cùng 冓: 構 **木** (khung gỗ) · 講 **言** (giảng) · 購 **貝** (mua bằng tiền)'],
        ['執 (しつ)', '熱 (ねつ) · 勢 (せい)', '執: phải là **丸** · 熱: dưới có **灬** (lửa) · 勢: dưới có **力**'],
        ['旨 (し)', '指 (ゆび) · 脂 (あぶら)', '指 = **扌** + 旨 (ngón tay) · 脂 = **月** + 旨 (mỡ)'],
        ['括 (かつ)', '活 (かつ — {生活|せいかつ}) · 話 (わ)', 'Cùng 舌: 括 **扌** (tay buộc) · 活 **氵** (sống) · 話 **言** (nói)'],
        ['箇 (か)', '個 (こ — {個人|こじん}) · 固 (こ)', 'Cùng 固: 箇 **⺮** trên đầu · 個 **亻** bên trái · 固 đứng một mình'],
        ['冒 (ぼう)', '帽 (ぼう — {帽子|ぼうし})', '帽 = **巾** (vải) + 冒 — cái mũ bằng vải'],
        ['視 (し)', '規 (き — {規則|きそく}) · 現 (げん)', 'Cùng 見: 視 **礻** bên trái · 規 **夫** bên trái · 現 **王** bên trái'],
        ['堅 (かたい)', '賢 (けん — {賢|かしこ}い, Bài 48) · 緊 (きん — {緊張|きんちょう})', 'Cùng 臤: 堅 dưới **土** · 賢 dưới **貝** · 緊 dưới **糸**'],
        ['該 (がい)', '刻 (こく — {時刻|じこく}) · 核 (かく — {核心|かくしん})', 'Cùng 亥: 該 **言** (lời) · 刻 **刂** (dao khắc) · 核 **木** (hạt nhân)'],
        ['遍 (へん)', '編 (へん — {編集|へんしゅう}) · 偏 (へん — {偏見|へんけん})', 'Cùng 扁: 遍 **辶** (đi khắp) · 編 **糸** (đan, biên tập) · 偏 **亻** (lệch)'],
        ['盤 (ばん)', '般 (はん — {一般|いっぱん}) · 船 (ふね)', '盤 = 般 + **皿** (mâm) bên dưới · 般 không có 皿 · 船 bên trái là 舟 + 㕣'],
        ['版 (はん)', '板 (いた) · 坂 (さか — Bài 48) · 販 (はん — {販売|はんばい})', 'Cùng 反: 版 **片** · 板 **木** · 坂 **土** · 販 **貝**'],
        ['倫 (りん)', '論 (ろん) · 輪 (わ)', 'Cùng 侖: 倫 **亻** (người) · 論 **言** (lời) · 輪 **車** (bánh xe)'],
        ['刊 (かん)', '刑 (けい) · 判 (はん)', '刊 = **干** + 刂 · 刑 = 开 + 刂 · 判 = 半 + 刂'],
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — đọc Kun hay On?',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)', 'Ghi chú'],
      rows: [
        ['構', '{構|かま}える · {構|かま}わない', '{構成|こうせい} · {構造|こうぞう} · {結構|けっこう}', '{結構|けっこう}: âm ngắt けっ'],
        ['執', '{筆|ふで}を{執|と}る', '{執筆|しっぴつ} · {執着|しゅうちゃく}', 'On hai âm: シツ (執筆 — có っ) / シュウ (執着)'],
        ['旨', '～{旨|むね}', '{要旨|ようし} · {趣旨|しゅし}', 'うまい (旨い) là cách đọc ngoài bảng thường dụng'],
        ['括', '{括|くく}る', '{総括|そうかつ} · {一括|いっかつ} · {括弧|かっこ}', '{一括|いっかつ}・{括弧|かっこ}: âm ngắt'],
        ['冒', '{冒|おか}す', '{冒頭|ぼうとう} · {冒険|ぼうけん}', '{冒|おか}す (liều) ≠ {犯|おか}す (phạm tội) — khác chữ'],
        ['尾', '{尾|お} · {尾根|おね}', '{末尾|まつび} · {首尾|しゅび}', '—'],
        ['唆', '{唆|そそのか}す', '{示唆|しさ}', '—'],
        ['堅', '{堅|かた}い', '{堅実|けんじつ} · {中堅|ちゅうけん}', 'かたい có ba chữ: 堅い・硬い (Bài 50)・固い — xem bảng 類義語'],
        ['潔', '{潔|いさぎよ}い', '{簡潔|かんけつ} · {清潔|せいけつ}', 'いさぎよい — 5 âm tiết, hay bị hỏi'],
        ['唱', '{唱|とな}える', '{提唱|ていしょう} · {合唱|がっしょう}', '{合唱|がっしょう}: âm ngắt'],
        ['模', '—', '{模範|もはん}（モ）· {規模|きぼ}（ボ）', '⚠ Hai âm On: モ (模範・模型・模様) và **ボ** (規模)'],
        ['版', '—', '{出版|しゅっぱん}（パン）· {改訂版|かいていばん}（バン）· {初版|しょはん}（ハン）', '⚠ ハン đổi thành パン sau っ, thành バン sau ～い (改訂版)'],
        ['序・章・範・欄・箇・典・視・該・遍・盤・倫・刊', '—', '{序論|じょろん} · {文章|ぶんしょう} · {範囲|はんい} · {空欄|くうらん} · {箇所|かしょ} · {出典|しゅってん} · {視点|してん} · {該当|がいとう} · {普遍|ふへん} · {基盤|きばん} · {倫理|りんり} · {朝刊|ちょうかん}', 'Mười hai chữ chỉ có âm On'], ['(ôn: Bài 51) 底・是', '{底|そこ}', '{徹底|てってい} · {到底|とうてい} · {是非|ぜひ} · {是正|ぜせい}', 'Đã học ở Bài 51 — dùng lại trong từ của bài này'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b52-doc-kanji',
      title: 'Đọc KHÔNG furigana — 26 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên. Mọi chữ Hán trong phần này đều đã học ở Bài 1–51 hoặc là chữ mới của bài.',
      items: [
        { text: '{序論|じょろん}では、この{研究|けんきゅう}の{目的|もくてき}を{述|の}べる。', ro: 'Joron de wa, kono kenkyuu no mokuteki o noberu.', vi: 'Trong phần mở đầu, trình bày mục đích của nghiên cứu này.' },
        { text: '{第三章|だいさんしょう}の{文章|ぶんしょう}は、もう{少|すこ}し{短|みじか}くしたほうがいい。', ro: 'Dai sanshou no bunshou wa, mou sukoshi mijikaku shita hou ga ii.', vi: 'Văn của chương ba nên viết ngắn lại một chút.' },
        { text: '{書|か}き{始|はじ}める{前|まえ}に、レポートの{構成|こうせい}を{考|かんが}える。', ro: 'Kakihajimeru mae ni, repooto no kousei o kangaeru.', vi: 'Trước khi bắt đầu viết, nghĩ bố cục của bài báo cáo.' },
        { text: '{先生|せんせい}は{今|いま}、{新|あたら}しい{教科書|きょうかしょ}を{執筆|しっぴつ}している。', ro: 'Sensei wa ima, atarashii kyoukasho o shippitsu shite iru.', vi: 'Thầy đang viết một cuốn giáo trình mới.' },
        { text: '{論文|ろんぶん}の{最初|さいしょ}に、{四百字|よんひゃくじ}の{要旨|ようし}をつける。', ro: 'Ronbun no saisho ni, yonhyakuji no youshi o tsukeru.', vi: 'Ở đầu luận văn kèm bản tóm tắt 400 chữ.' },
        { text: '{試験|しけん}の{範囲|はんい}は、{第一章|だいいっしょう}から{第五章|だいごしょう}までだ。', ro: 'Shiken no han\'i wa, dai isshou kara dai goshou made da.', vi: 'Phạm vi thi là từ chương một đến chương năm.' },
        { text: '{一年間|いちねんかん}の{活動|かつどう}を{総括|そうかつ}して、{報告書|ほうこくしょ}にまとめた。', ro: 'Ichinenkan no katsudou o soukatsu shite, houkokusho ni matometa.', vi: 'Tổng kết hoạt động của một năm rồi gom vào bản báo cáo.' },
        { text: '{空欄|くうらん}に{入|はい}る{最|もっと}もよい{言葉|ことば}を{選|えら}びなさい。', ro: 'Kuuran ni hairu mottomo yoi kotoba o erabinasai.', vi: 'Hãy chọn từ thích hợp nhất điền vào chỗ trống.' },
        { text: '{間違|まちが}っている{箇所|かしょ}に、{線|せん}を{引|ひ}いてください。', ro: 'Machigatte iru kasho ni, sen o hiite kudasai.', vi: 'Hãy gạch dưới những chỗ sai.' },
        { text: '{会議|かいぎ}の{冒頭|ぼうとう}で、{社長|しゃちょう}があいさつをした。', ro: 'Kaigi no boutou de, shachou ga aisatsu o shita.', vi: 'Ở phần đầu cuộc họp, giám đốc phát biểu chào mừng.' },
        { text: '{参考文献|さんこうぶんけん}は、レポートの{末尾|まつび}にまとめて{書|か}く。', ro: 'Sankou bunken wa, repooto no matsubi ni matomete kaku.', vi: 'Tài liệu tham khảo được ghi gộp ở cuối bài báo cáo.' },
        { text: '{図|ず}や{表|ひょう}を{使|つか}う{時|とき}は、{必|かなら}ず{出典|しゅってん}を{示|しめ}すこと。', ro: 'Zu ya hyou o tsukau toki wa, kanarazu shutten o shimesu koto.', vi: 'Khi dùng hình hay bảng, nhất thiết phải ghi nguồn.' },
        { text: 'この{結果|けっか}は、{二|ふた}つの{問題|もんだい}の{関係|かんけい}を{示唆|しさ}している。', ro: 'Kono kekka wa, futatsu no mondai no kankei o shisa shite iru.', vi: 'Kết quả này gợi ý mối quan hệ giữa hai vấn đề.' },
        { text: '{相手|あいて}の{視点|してん}に{立|た}って{考|かんが}えることが{大切|たいせつ}だ。', ro: 'Aite no shiten ni tatte kangaeru koto ga taisetsu da.', vi: 'Điều quan trọng là đứng ở góc nhìn của đối phương mà suy nghĩ.' },
        { text: '{友達|ともだち}へのメールにしては、{文章|ぶんしょう}が{堅|かた}すぎる。', ro: 'Tomodachi e no meeru ni shite wa, bunshou ga katasugiru.', vi: 'Là email gửi bạn bè mà văn thì cứng quá.' },
        { text: '{報告書|ほうこくしょ}は、{要点|ようてん}を{簡潔|かんけつ}にまとめることが{大切|たいせつ}だ。', ro: 'Houkokusho wa, youten o kanketsu ni matomeru koto ga taisetsu da.', vi: 'Với báo cáo, điều quan trọng là tóm ý chính ngắn gọn.' },
        { text: '{該当|がいとう}する{項目|こうもく}に{丸|まる}をつけてください。', ro: 'Gaitou suru koumoku ni maru o tsukete kudasai.', vi: 'Hãy khoanh tròn vào mục đúng với trường hợp của bạn.' },
        { text: '{家族|かぞく}を{大切|たいせつ}にする{気持|きも}ちは、{普遍的|ふへんてき}なものだろう。', ro: 'Kazoku o taisetsu ni suru kimochi wa, fuhenteki na mono darou.', vi: 'Tình cảm trân trọng gia đình có lẽ là điều phổ quát.' },
        { text: 'その{学者|がくしゃ}は、{新|あたら}しい{学習|がくしゅう}の{方法|ほうほう}を{提唱|ていしょう}した。', ro: 'Sono gakusha wa, atarashii gakushuu no houhou o teishou shita.', vi: 'Học giả đó đã đề xướng một phương pháp học mới.' },
        { text: '{会議|かいぎ}で{一人|ひとり}だけ、その{案|あん}に{異論|いろん}を{唱|とな}えた。', ro: 'Kaigi de hitori dake, sono an ni iron o tonaeta.', vi: 'Trong cuộc họp, chỉ một người nêu ý kiến phản đối phương án đó.' },
        { text: '{先生|せんせい}が{配|くば}った{模範解答|もはんかいとう}を{見|み}て、{自分|じぶん}の{答|こた}えを{直|なお}した。', ro: 'Sensei ga kubatta mohan kaitou o mite, jibun no kotae o naoshita.', vi: 'Tôi xem đáp án mẫu thầy phát rồi sửa câu trả lời của mình.' },
        { text: '{安全|あんぜん}のためのルールを{徹底|てってい}する。', ro: 'Anzen no tame no ruuru o tettei suru.', vi: 'Quán triệt các quy tắc vì an toàn.' },
        { text: 'この{本|ほん}は、{三十年前|さんじゅうねんまえ}に{出版|しゅっぱん}された。', ro: 'Kono hon wa, sanjuunen mae ni shuppan sareta.', vi: 'Cuốn sách này được xuất bản ba mươi năm trước.' },
        { text: '{他人|たにん}の{文章|ぶんしょう}をそのまま{使|つか}うのは、{研究|けんきゅう}の{倫理|りんり}に{反|はん}する。', ro: 'Tanin no bunshou o sono mama tsukau no wa, kenkyuu no rinri ni hansuru.', vi: 'Dùng nguyên văn bài của người khác là trái với đạo đức nghiên cứu.' },
        { text: '{父|ちち}は{毎朝|まいあさ}、{朝刊|ちょうかん}を{読|よ}んでから{会社|かいしゃ}に{行|い}く。', ro: 'Chichi wa maiasa, choukan o yonde kara kaisha ni iku.', vi: 'Sáng nào bố tôi cũng đọc báo sáng rồi mới đi làm.' },
        { text: '{健康|けんこう}は、{生活|せいかつ}の{基盤|きばん}である。', ro: 'Kenkou wa, seikatsu no kiban de aru.', vi: 'Sức khoẻ là nền tảng của cuộc sống.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b52-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 60 giây như phần Reading của thi nói, rồi mới mở đáp án. Đoạn 1: hướng dẫn viết レポート · Đoạn 2: báo cáo công việc · Đoạn 3: đoạn xã luận ngắn.',
      items: [
        { text: 'レポートは、{序論|じょろん}・{本論|ほんろん}・{結論|けつろん}の{三|みっ}つの{部分|ぶぶん}から{構成|こうせい}される。{序論|じょろん}では、テーマを{選|えら}んだ{理由|りゆう}と{目的|もくてき}を{簡潔|かんけつ}に{述|の}べる。{本論|ほんろん}では、{資料|しりょう}や{調査|ちょうさ}の{結果|けっか}を{示|しめ}した{上|うえ}で、{自分|じぶん}の{考|かんが}えを{論|ろん}じる。{結論|けつろん}では、{全体|ぜんたい}の{要旨|ようし}をまとめ、{今後|こんご}の{課題|かだい}を{述|の}べる。なお、{他人|たにん}の{文章|ぶんしょう}を{引用|いんよう}する{場合|ばあい}は、{必|かなら}ず{出典|しゅってん}を{明記|めいき}しなければならない。', ro: 'Repooto wa, joron, honron, ketsuron no mittsu no bubun kara kousei sareru. Joron de wa, teema o eranda riyuu to mokuteki o kanketsu ni noberu. Honron de wa, shiryou ya chousa no kekka o shimeshita ue de, jibun no kangae o ronjiru. Ketsuron de wa, zentai no youshi o matome, kongo no kadai o noberu. Nao, tanin no bunshou o in\'you suru baai wa, kanarazu shutten o meiki shinakereba naranai.', vi: 'Một bài báo cáo gồm ba phần: mở đầu, thân bài và kết luận. Ở phần mở đầu, trình bày ngắn gọn lý do chọn đề tài và mục đích. Ở thân bài, đưa ra tư liệu và kết quả khảo sát rồi mới bàn luận ý kiến của mình. Ở kết luận, tóm lại ý chính của toàn bài và nêu vấn đề cần làm tiếp. Ngoài ra, khi trích dẫn bài viết của người khác thì nhất thiết phải ghi rõ nguồn.' },
        { text: '{新|あたら}しいAIツールの{試験導入|しけんどうにゅう}について{報告|ほうこく}する。{結論|けつろん}から{述|の}べると、{本格的|ほんかくてき}な{導入|どうにゅう}を{提案|ていあん}したい。{効果|こうか}の{面|めん}では、{作業時間|さぎょうじかん}が{約|やく}{三割|さんわり}{短|みじか}くなった。{一方|いっぽう}、{安全面|あんぜんめん}では、お{客様|きゃくさま}の{文書|ぶんしょ}を{外部|がいぶ}に{送|おく}るという{点|てん}に{問題|もんだい}が{残|のこ}る。この{点|てん}については、システム{部|ぶ}と{確認|かくにん}した{上|うえ}で、{改|あらた}めて{報告|ほうこく}する。', ro: 'Atarashii eeai tsuuru no shiken dounyuu ni tsuite houkoku suru. Ketsuron kara noberu to, honkakuteki na dounyuu o teian shitai. Kouka no men de wa, sagyou jikan ga yaku sanwari mijikaku natta. Ippou, anzenmen de wa, okyakusama no bunsho o gaibu ni okuru to iu ten ni mondai ga nokoru. Kono ten ni tsuite wa, shisutemubu to kakunin shita ue de, aratamete houkoku suru.', vi: 'Xin báo cáo về việc dùng thử công cụ AI mới. Nói từ kết luận: tôi muốn đề xuất đưa vào sử dụng chính thức. Về mặt hiệu quả, thời gian làm việc ngắn đi khoảng ba mươi phần trăm. Mặt khác, về mặt an toàn, vẫn còn vấn đề ở điểm phải gửi tài liệu của khách hàng ra bên ngoài. Về điểm này, tôi sẽ xác nhận với phòng hệ thống rồi báo cáo lại.' },
        { text: '{情報|じょうほう}があふれる{現代|げんだい}において、{私|わたし}たちは{何|なに}を{信|しん}じるべきか。ネットの{記事|きじ}の{中|なか}には、{出典|しゅってん}の{分|わ}からないものも{多|おお}い。そのため、{一|ひと}つの{視点|してん}だけで{判断|はんだん}せず、{複数|ふくすう}の{資料|しりょう}を{比|くら}べる{習慣|しゅうかん}を{身|み}につけねばならない。それは、{学生|がくせい}がレポートを{書|か}く{上|うえ}でも、{社会人|しゃかいじん}が{仕事|しごと}をする{上|うえ}でも、きわめて{重要|じゅうよう}なことである。', ro: 'Jouhou ga afureru gendai ni oite, watashitachi wa nani o shinjiru beki ka. Netto no kiji no naka ni wa, shutten no wakaranai mono mo ooi. Sono tame, hitotsu no shiten dake de handan sezu, fukusuu no shiryou o kuraberu shuukan o mi ni tsukeneba naranai. Sore wa, gakusei ga repooto o kaku ue de mo, shakaijin ga shigoto o suru ue de mo, kiwamete juuyou na koto de aru.', vi: 'Trong thời hiện đại tràn ngập thông tin, chúng ta nên tin vào điều gì? Trong các bài viết trên mạng có nhiều bài không rõ nguồn. Vì thế, chúng ta phải tập thói quen không phán đoán chỉ từ một góc nhìn mà so sánh nhiều tư liệu. Đó là điều cực kỳ quan trọng, cả khi sinh viên viết báo cáo lẫn khi người đi làm làm việc.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b52-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (16 câu)',
      items: [
        MQ('レポートの**序論**を{書|か}く。', 'じょろん', ['じょうろん', 'よろん', 'じょろう'], '**{序論|じょろん}** — 序 ジョ (ngắn, không trường âm). よろん là {世論|よろん} (dư luận).'),
        MQ('**第一章**を{読|よ}んだ。', 'だいいっしょう', ['だいいちしょう', 'だいいっしょ', 'だいいちしょ'], '**{第一章|だいいっしょう}** — いち → いっ (âm ngắt) + しょう (trường âm).'),
        MQ('{全体|ぜんたい}の**構成**を{見直|みなお}す。', 'こうせい', ['こせい', 'こうぜい', 'かませい'], '**{構成|こうせい}** — 構 コウ (trường âm). {個性|こせい} là "cá tính".'),
        MQ('{論文|ろんぶん}を**執筆**する。', 'しっぴつ', ['しつひつ', 'しゅうひつ', 'しっぷつ'], '**{執筆|しっぴつ}** — シツ + ヒツ → しっぴつ (âm ngắt + ヒ thành ピ).'),
        MQ('{発表|はっぴょう}の**要旨**をまとめる。', 'ようし', ['ようじ', 'よし', 'ようむね'], '**{要旨|ようし}** — 旨 シ. {用事|ようじ} là "việc bận".'),
        MQ('{調査|ちょうさ}の**範囲**を{決|き}める。', 'はんい', ['はんにん', 'ばんい', 'はない'], '**{範囲|はんい}** — han-i (ん rồi い, không nối thành "ni").'),
        MQ('**空欄**に{言葉|ことば}を{入|い}れる。', 'くうらん', ['からん', 'くうかん', 'そららん'], '**{空欄|くうらん}** — 空 クウ + 欄 ラン.'),
        MQ('{間違|まちが}っている**箇所**を{直|なお}す。', 'かしょ', ['こしょ', 'かじょ', 'かところ'], '**{箇所|かしょ}** — 箇 カ (không phải コ như 個).'),
        MQ('{話|はなし}の**冒頭**で{結論|けつろん}を{述|の}べる。', 'ぼうとう', ['ぼとう', 'もうとう', 'ぼうず'], '**{冒頭|ぼうとう}** — 冒 ボウ + 頭 トウ (hai trường âm).'),
        MQ('{必|かなら}ず**出典**を{書|か}くこと。', 'しゅってん', ['でてん', 'しゅつてん', 'しゅってい'], '**{出典|しゅってん}** — シュツ → しゅっ (âm ngắt).'),
        MQ('この{結果|けっか}は{重要|じゅうよう}なことを**示唆**している。', 'しさ', ['じさ', 'しさく', 'しめさ'], '**{示唆|しさ}** — 示 シ + 唆 サ. ({示|しめ}す là cách đọc Kun của 示.)'),
        MQ('**視点**を{変|か}えて{考|かんが}える。', 'してん', ['じてん', 'みてん', 'しいてん'], '**{視点|してん}** — 視 シ. {辞典|じてん} (từ điển) đọc じ.'),
        MQ('{要点|ようてん}を**簡潔**に{書|か}く。', 'かんけつ', ['かんけい', 'かんせつ', 'がんけつ'], '**{簡潔|かんけつ}** — 潔 ケツ. {関係|かんけい}・{間接|かんせつ} là từ khác.'),
        MQ('{会社|かいしゃ}の**規模**が{大|おお}きくなった。', 'きぼ', ['きも', 'きぼう', 'ぎも'], '**{規模|きぼ}** — 模 đọc **ボ** ở từ này (khác {模範|もはん}). {希望|きぼう} là "hy vọng".'),
        MQ('{条件|じょうけん}に**該当**する{人|ひと}は{申|もう}し{込|こ}める。', 'がいとう', ['かいとう', 'がいどう', 'がいと'], '**{該当|がいとう}** — 該 ガイ (đục). {回答|かいとう} là "trả lời".'),
        MQ('その{本|ほん}は{去年|きょねん}**出版**された。', 'しゅっぱん', ['しゅつはん', 'しゅっはん', 'でばん'], '**{出版|しゅっぱん}** — シュツ + ハン → しゅっぱん (ハ thành パ sau っ).'),
      ],
    },
    {
      t: 'mcq',
      id: 'b52-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (14 câu)',
      items: [
        MQ('{本|ほん}の**じょろん**を{読|よ}む。', '序論', ['予論', '叙論', '除論'], '**序論** — 广 + 予. 予 (dự) thiếu mái 广.'),
        MQ('いい**ぶんしょう**を{書|か}く。', '文章', ['文障', '文彰', '文商'], '**文章** — 音 + 十. 障 ({故障|こしょう}) có 阝.'),
        MQ('ビルの**こうぞう**を{調|しら}べる。', '構造', ['講造', '購造', '溝造'], '**構造** — 木 + 冓 (khung gỗ). 講 có 言, 購 có 貝.'),
        MQ('{筆者|ひっしゃ}の**ろんし**をまとめる。', '論旨', ['論指', '論脂', '論紙'], '**論旨** (luận điểm chính) — 旨 = 匕 + 日. 指 (ngón tay) có 扌.'),
        MQ('**そうかつ**して{報告|ほうこく}する。', '総括', ['総活', '総話', '総刮'], '**総括** — 扌 (tay buộc lại). 活 có 氵.'),
        MQ('{間違|まちが}いが{三|さん}**かしょ**ある。', '箇所', ['過所', '固所', '箇処'], '**箇所** — ⺮ + 固 (thẻ tre đếm từng chỗ). 処 không dùng ở từ này; 過・固 đồng âm khác nghĩa.'),
        MQ('{会議|かいぎ}の**ぼうとう**で{説明|せつめい}する。', '冒頭', ['帽頭', '冒答', '胃頭'], '**冒頭** — 冒 (không có 巾). 帽 (mũ) = 巾 + 冒; 胃 (dạ dày) dưới là 月.'),
        MQ('{必|かなら}ず**しゅってん**を{示|しめ}す。', '出典', ['出点', '出展', '出店'], '**出典** (nguồn trích). 出展 = trưng bày ở triển lãm; 出店 = mở cửa hàng.'),
        MQ('{相手|あいて}の**してん**に{立|た}つ。', '視点', ['規点', '支点', '始点'], '**視点** — 礻 + 見. 規 có 夫. (支点 = điểm tựa; 始点 = điểm bắt đầu — khác nghĩa.)'),
        MQ('**けんじつ**な{方法|ほうほう}を{選|えら}ぶ。', '堅実', ['賢実', '緊実', '健実'], '**堅実** — 臤 + 土. 賢 (hiền) có 貝; 健 (kiện) có 亻.'),
        MQ('{条件|じょうけん}に**がいとう**する。', '該当', ['刻当', '核当', '外当'], '**該当** — 言 + 亥. 刻 có 刂, 核 có 木.'),
        MQ('**ふへんてき**な{価値|かち}。', '普遍的', ['普編的', '普偏的', '普返的'], '**普遍的** — 辶 + 扁. 編 có 糸, 偏 có 亻.'),
        MQ('{生活|せいかつ}の**きばん**を{作|つく}る。', '基盤', ['基般', '基板', '基番'], '**基盤** — 般 + 皿 (mâm). 般 thiếu 皿; 基板 là "bảng mạch" — từ khác.'),
        MQ('**りんり**の{問題|もんだい}。', '倫理', ['論理', '輪理', '倫里'], '**倫理** (đạo đức) — 亻 + 侖. **論理** (logic — ろんり) là từ KHÁC!'),
      ],
    },
    {
      t: 'write',
      id: 'b52-viet-kanji',
      title: 'Tập viết — 6 chữ ✍ và 12 từ',
      note: 'Viết 6 chữ ✍ trước (đúng thứ tự nét theo hoạt hình — 章 viết 立 rồi 早; 構 viết 木 rồi 冓; 典 viết 曲 rồi hai nét chân; 尾 viết 尸 rồi 毛; 版 viết 片 rồi 反; 刊 viết 干 rồi 刂), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['章', '構', '典', '尾', '版', '刊', '序論', '文章', '構成', '要旨', '範囲', '冒頭', '出典', '示唆', '視点', '簡潔', '該当', '出版'],
      goi: {
        '序論': 'じょろん · phần mở đầu',
        '文章': 'ぶんしょう · bài văn',
        '構成': 'こうせい · bố cục',
        '要旨': 'ようし · ý chính tóm tắt',
        '範囲': 'はんい · phạm vi',
        '冒頭': 'ぼうとう · phần đầu',
        '出典': 'しゅってん · nguồn trích',
        '示唆': 'しさ · gợi ý',
        '視点': 'してん · điểm nhìn',
        '簡潔': 'かんけつ · ngắn gọn',
        '該当': 'がいとう · thuộc diện, khớp với',
        '出版': 'しゅっぱん · xuất bản',
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
  id: 'b52-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N2 — 6 bài theo đủ 5 dạng đề: 課題理解 · ポイント理解 · 概要理解 · 即時応答 · 統合理解 ×2 (bối cảnh viết báo cáo: chuẩn bị báo cáo giữa kỳ, vì sao bài レポート năm nhất bị điểm thấp, bài nói về cách trích dẫn, chọn dịch vụ hỗ trợ viết, chọn lớp hướng dẫn của thư viện)',
  goal: 'Nghe giảng viên hướng dẫn để chọn đúng việc phải làm TRƯỚC (loại việc "làm sau cũng được" và việc phụ thuộc vào việc khác — ～た上で); nghe người kể để bắt "lý do lớn nhất" sau khi các lý do quen thuộc bị gạt đi; nắm ý chính bài nói về cách trích dẫn (ところが～／～べきです／私は～と考えています); đáp ngay câu nói có ～上で・～面で・～べきだ・～ねばならない・だ・である体; so sánh ba dịch vụ / ba lớp hướng dẫn theo điều kiện của từng người để chọn (統合理解).',
  minutes: 55,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N2 — 5 dạng, khoảng 50 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo cho chủ đề Bài 52'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó phải làm **trước / tiếp theo**.', '**～た{上|うえ}で** báo thứ tự: "X した上で Y" ⇒ X làm TRƯỚC Y. Gạch việc **đã xong** (～はもう{作|つく}りました), việc **để sau** (～は{後|あと}で{構|かま}いません).'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó.', 'Người kể gạt dần lý do hay gặp (字数・締め切り・出典) bằng **～は{大丈夫|だいじょうぶ}だった・～も{守|まも}った**, rồi mới nói lý do thật sau **{一番|いちばん}{大|おお}きかったのは**.'],
        ['問題3', '概要理解 (hiểu ý khái quát)', 'Nghe **một đoạn nói**, rồi mới nghe câu hỏi (chủ đề / ý chính).', 'Quy tắc ai cũng biết (**これは{当然|とうぜん}のルールです**) → **ところが** (vấn đề thật) → **～べきです** → **{私|わたし}は～と{考|かんが}えています** = ý chính.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', 'Hiểu **ý** của câu: **～た{上|うえ}で** (yêu cầu làm trước → hứa làm) · **～の{面|めん}では？** (hỏi một mặt → trả lời đúng mặt đó) · **～べきじゃない** (phê bình → nhận lỗi) · **～ねばならない** (than việc nặng → đề nghị giúp).'],
        ['問題5', '統合理解 (hiểu tổng hợp)', 'Nghe đoạn dài (giới thiệu nhiều phương án + hội thoại), **so sánh** rồi chọn.', 'Ghi chú thành **bảng**: phương án × (làm gì · khi nào · điều kiện). Đánh dấu điều kiện của từng người ({締|し}め{切|き}りは{明後日|あさって}・{一対一|いちたいいち}は{苦手|にがて}・{水曜|すいよう}の{夜|よる}は{空|あ}いている).'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        '**X した{上|うえ}で Y** = X **trước**, Y **sau** — nghe được cặp này là xếp được thứ tự việc trong bài 課題理解. Ngược lại, **X する{上|うえ}で{大切|たいせつ}なのは～** = "khi làm X thì điều quan trọng là…" — câu báo **trọng tâm**.',
        '**～の{面|めん}では／～という{点|てん}では** = người nói đang **chia nhỏ** đánh giá — thường mặt đầu tốt, mặt sau mới là vấn đề (ý chính ở vế sau **が／ただ**).',
        '**～べきです／～べきではありません** trong bài nói = **chủ trương** của người nói → rất gần với đáp án câu "người nói muốn nói gì nhất".',
        'Bài 統合理解: vẽ bảng ngay khi nghe phần giới thiệu ba phương án; lần 2 mới nghe điều kiện của từng người và gạch dần.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: chuẩn bị báo cáo giữa kỳ' },
    NG('b52-ng-1', '{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — slide: làm SAU khi có bản tóm tắt (要旨を書いた上で); biểu đồ kết quả khảo sát: ĐÃ làm tuần trước; danh sách nghiên cứu đi trước: để sau buổi báo cáo cũng được; việc phải làm NGAY: viết bản tóm tắt ý chính trong 400 chữ, gửi cô trong ngày mai.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で、{先生|せんせい}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Daigaku de, sensei to otoko no gakusei ga hanashite imasu. Otoko no gakusei wa kono ato mazu nani o shimasu ka.', 'Ở trường đại học, cô giáo và một nam sinh viên đang nói chuyện. Sau đây, nam sinh viên trước hết sẽ làm gì?'],
      ['カルロス', 'ja-nam', '{先生|せんせい}、{来週|らいしゅう}の{中間発表|ちゅうかんはっぴょう}の{準備|じゅんび}ですが、{何|なに}から{始|はじ}めればいいでしょうか。スライドを{作|つく}りましょうか。', 'Sensei, raishuu no chuukan happyou no junbi desu ga, nani kara hajimereba ii deshou ka. Suraido o tsukurimashou ka.', 'Thưa cô, về việc chuẩn bị buổi báo cáo giữa kỳ tuần sau, em nên bắt đầu từ việc gì ạ? Em làm slide nhé?'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'スライドは、{発表|はっぴょう}の{要旨|ようし}を{書|か}いた{上|うえ}で{作|つく}ってください。{何|なに}を{一番|いちばん}{言|い}いたいのかが{決|き}まらないと、スライドの{構成|こうせい}も{決|き}まりませんから。', 'Suraido wa, happyou no youshi o kaita ue de tsukutte kudasai. Nani o ichiban iitai no ka ga kimaranai to, suraido no kousei mo kimarimasen kara.', 'Slide thì em viết bản tóm tắt ý chính của bài báo cáo xong rồi hãy làm. Chưa quyết được điều mình muốn nói nhất thì cũng chưa quyết được bố cục slide.'],
      ['カルロス', 'ja-nam', 'わかりました。でも、{要旨|ようし}を{書|か}く{前|まえ}に、アンケートの{結果|けっか}をまとめなくてもいいですか。', 'Wakarimashita. Demo, youshi o kaku mae ni, ankeeto no kekka o matomenakute mo ii desu ka.', 'Em hiểu rồi ạ. Nhưng trước khi viết tóm tắt, em có cần tổng hợp kết quả khảo sát không ạ?'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', '{結果|けっか}は、もうグラフにしてありましたよね。', 'Kekka wa, mou gurafu ni shite arimashita yo ne.', 'Kết quả thì em đã làm thành biểu đồ rồi mà, phải không?'],
      ['カルロス', 'ja-nam', 'はい、{先週|せんしゅう}{作|つく}りました。', 'Hai, senshuu tsukurimashita.', 'Vâng, em làm tuần trước rồi ạ.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'それなら{十分|じゅうぶん}です。{先行研究|せんこうけんきゅう}のリストは、{発表|はっぴょう}では{使|つか}わないので、{発表|はっぴょう}の{後|あと}で{構|かま}いません。', 'Sore nara juubun desu. Senkou kenkyuu no risuto wa, happyou de wa tsukawanai node, happyou no ato de kamaimasen.', 'Vậy là đủ rồi. Còn danh sách nghiên cứu đi trước thì không dùng trong buổi báo cáo, nên để sau buổi báo cáo cũng được.'],
      ['カルロス', 'ja-nam', 'はい。{要旨|ようし}は、どのぐらいの{長|なが}さで{書|か}けばいいですか。', 'Hai. Youshi wa, dono gurai no nagasa de kakeba ii desu ka.', 'Vâng ạ. Bản tóm tắt thì em nên viết dài khoảng bao nhiêu ạ?'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', '{四百字|よんひゃくじ}{以内|いない}で、だ・である{体|たい}で{書|か}いてください。{明日中|あしたじゅう}に{私|わたし}にメールしてくれれば、{金曜日|きんようび}までに{見|み}ておきます。', 'Yonhyakuji inai de, da de aru tai de kaite kudasai. Ashitajuu ni watashi ni meeru shite kurereba, kin\'youbi made ni mite okimasu.', 'Em viết trong vòng 400 chữ, thể だ・である nhé. Gửi email cho cô trong ngày mai thì cô sẽ xem trước thứ Sáu.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Otoko no gakusei wa kono ato mazu nani o shimasu ka.', 'Sau đây, nam sinh viên trước hết sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b52-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', options: ['{発表|はっぴょう}のスライドを{作|つく}る', 'アンケートの{結果|けっか}をグラフにする', '{先行研究|せんこうけんきゅう}のリストを{作|つく}る', '{発表|はっぴょう}の{要旨|ようし}を{書|か}く'], correct: 3, why: 'Slide: **{要旨|ようし}を{書|か}いた{上|うえ}で{作|つく}って** (làm SAU tóm tắt). Biểu đồ: **{先週|せんしゅう}{作|つく}りました** (đã xong). Danh sách: **{発表|はっぴょう}の{後|あと}で{構|かま}いません** (để sau). → việc làm ngay: **viết bản tóm tắt**.' },
        { q: '{要旨|ようし}について、{先生|せんせい}は{何|なん}と{言|い}いましたか。', options: ['です・ます{体|たい}で、{四百字|よんひゃくじ}{以上|いじょう}{書|か}く', 'だ・である{体|たい}で、{四百字|よんひゃくじ}{以内|いない}で{書|か}く', '{金曜日|きんようび}までにメールで{送|おく}る', 'スライドと{一緒|いっしょ}に{出|だ}す'], correct: 1, why: '**{四百字|よんひゃくじ}{以内|いない}で、だ・である{体|たい}で**. Hạn gửi là **{明日中|あしたじゅう}** (thứ Sáu là hạn CÔ xem xong).' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題2 ポイント理解: vì sao bài レポート năm nhất bị điểm thấp' },
    NG('b52-ng-2', '{男|おとこ}の{人|ひと}は、{一年生|いちねんせい}の{時|とき}のレポートの{評価|ひょうか}が{低|ひく}かった{一番|いちばん}の{理由|りゆう}は{何|なん}だと{言|い}っていますか', 'Dạng ポイント理解 — câu hỏi hỏi "lý do LỚN NHẤT". Bẫy: số chữ (đủ), hạn nộp (giữ đúng), nguồn trích (có ghi — chỉ hơi sơ sài). Câu then chốt sau 一番大きかったのは: toàn "～と思う・～と感じた", thành bài cảm tưởng, không có căn cứ.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で、{女|おんな}の{学生|がくせい}と{先輩|せんぱい}の{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{人|ひと}は、{一年生|いちねんせい}の{時|とき}のレポートの{評価|ひょうか}が{低|ひく}かった{一番|いちばん}の{理由|りゆう}は{何|なん}だと{言|い}っていますか。', 'Daigaku de, onna no gakusei to senpai no otoko no gakusei ga hanashite imasu. Otoko no hito wa, ichinensei no toki no repooto no hyouka ga hikukatta ichiban no riyuu wa nan da to itte imasu ka.', 'Ở trường, một nữ sinh và một nam sinh khoá trên đang nói chuyện. Người nam nói lý do lớn nhất khiến bài báo cáo hồi năm nhất của anh bị đánh giá thấp là gì?'],
      ['リン', 'ja-nu', '{山本|やまもと}さんのレポート、いつも{先生|せんせい}に{褒|ほ}められてますよね。{最初|さいしょ}から{上手|じょうず}だったんですか。', 'Yamamoto-san no repooto, itsumo sensei ni homeraretemasu yo ne. Saisho kara jouzu datta n desu ka.', 'Bài báo cáo của anh Yamamoto lúc nào cũng được thầy cô khen nhỉ. Anh giỏi viết từ đầu luôn ạ?'],
      ['{山本|やまもと}', 'ja-nam', 'まさか。{一年生|いちねんせい}の{最初|さいしょ}のレポートなんて、Cだったよ。', 'Masaka. Ichinensei no saisho no repooto nante, shii datta yo.', 'Làm gì có. Bài báo cáo đầu tiên hồi năm nhất của anh được điểm C đấy.'],
      ['リン', 'ja-nu', 'えっ、{字数|じすう}が{足|た}りなかったとか？', 'E, jisuu ga tarinakatta toka?', 'Ơ, kiểu thiếu số chữ ạ?'],
      ['{山本|やまもと}', 'ja-nam', 'ううん、{字数|じすう}は{十分|じゅうぶん}だったし、{締|し}め{切|き}りもちゃんと{守|まも}った。{出典|しゅってん}も、まあ、{一応|いちおう}{書|か}いてあったんだ。{少|すこ}し{雑|ざつ}だったけどね。', 'Uun, jisuu wa juubun datta shi, shimekiri mo chanto mamotta. Shutten mo, maa, ichiou kaite atta n da. Sukoshi zatsu datta kedo ne.', 'Không, số chữ thì đủ, hạn nộp cũng giữ đúng. Nguồn trích thì, ừ, cũng có ghi. Hơi sơ sài thôi.'],
      ['リン', 'ja-nu', 'じゃあ、どうしてですか。', 'Jaa, doushite desu ka.', 'Vậy tại sao ạ?'],
      ['{山本|やまもと}', 'ja-nam', '{一番|いちばん}{大|おお}きかったのは、{全部|ぜんぶ}「～と{思|おも}う」「～と{感|かん}じた」で{書|か}いていたことだね。{読|よ}み{返|かえ}すと、レポートじゃなくて{感想文|かんそうぶん}になってたんだ。{先生|せんせい}に「{根拠|こんきょ}を{示|しめ}した{上|うえ}で{論|ろん}じるべきだ」って{赤|あか}で{書|か}かれたよ。', 'Ichiban ookikatta no wa, zenbu "~to omou" "~to kanjita" de kaite ita koto da ne. Yomikaesu to, repooto ja nakute kansoubun ni natteta n da. Sensei ni "konkyo o shimeshita ue de ronjiru beki da" tte aka de kakareta yo.', 'Lớn nhất là anh viết toàn bằng "tôi nghĩ…", "tôi cảm thấy…". Đọc lại thì thấy nó không phải báo cáo mà thành bài cảm tưởng. Thầy phê bằng mực đỏ: "Phải đưa ra căn cứ rồi mới bàn luận".'],
      ['リン', 'ja-nu', '……{私|わたし}も{同|おな}じことを{言|い}われました。', '…… Watashi mo onaji koto o iwaremashita.', '… Em cũng bị nói y như vậy ạ.'],
      ['{山本|やまもと}', 'ja-nam', 'みんな{最初|さいしょ}はそうだよ。それから{僕|ぼく}は、{一|ひと}つ{意見|いけん}を{書|か}いたら、{必|かなら}ずデータか{引用|いんよう}を{一|ひと}つつけるようにしたんだ。', 'Minna saisho wa sou da yo. Sore kara boku wa, hitotsu iken o kaitara, kanarazu deeta ka in\'you o hitotsu tsukeru you ni shita n da.', 'Ai lúc đầu cũng vậy thôi. Từ đó, cứ viết một ý kiến là anh tập thói quen nhất định kèm theo một số liệu hoặc một trích dẫn.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}は、{一年生|いちねんせい}の{時|とき}のレポートの{評価|ひょうか}が{低|ひく}かった{一番|いちばん}の{理由|りゆう}は{何|なん}だと{言|い}っていますか。', 'Otoko no hito wa, ichinensei no toki no repooto no hyouka ga hikukatta ichiban no riyuu wa nan da to itte imasu ka.', 'Người nam nói lý do lớn nhất khiến bài báo cáo hồi năm nhất của anh bị đánh giá thấp là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b52-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}は、レポートの{評価|ひょうか}が{低|ひく}かった{一番|いちばん}の{理由|りゆう}は{何|なん}だと{言|い}っていますか。', options: ['{字数|じすう}が{足|た}りなかったこと', '{締|し}め{切|き}りに{遅|おく}れたこと', '{出典|しゅってん}を{書|か}かなかったこと', '{感想|かんそう}ばかりで、{根拠|こんきょ}がなかったこと'], correct: 3, why: '{字数|じすう}: **{十分|じゅうぶん}だった** · {締|し}め{切|き}り: **ちゃんと{守|まも}った** · {出典|しゅってん}: **{一応|いちおう}{書|か}いてあった** → đều bị gạt. Sau **{一番|いちばん}{大|おお}きかったのは**: toàn ～と{思|おも}う・～と{感|かん}じた → **{感想文|かんそうぶん}** (không có căn cứ).' },
        { q: 'そのあと、{男|おとこ}の{人|ひと}はどうするようにしましたか。', options: ['{意見|いけん}を{書|か}かないようにした', '{意見|いけん}に{必|かなら}ずデータか{引用|いんよう}をつけるようにした', '{先生|せんせい}に{毎回|まいかい}{相談|そうだん}するようにした', '{感想|かんそう}を{最後|さいご}にまとめて{書|か}くようにした'], correct: 1, why: '**{一|ひと}つ{意見|いけん}を{書|か}いたら、{必|かなら}ずデータか{引用|いんよう}を{一|ひと}つつけるようにした**.' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題3 概要理解: bài nói của nhân viên thư viện về trích dẫn' },
    NG('b52-ng-3', '{職員|しょくいん}が{一番|いちばん}{伝|つた}えたいことは{何|なん}ですか', 'Dạng 概要理解 — cấu trúc: chủ đề (quy tắc trích dẫn) → quy tắc cơ bản ("これは当然のルールです" — KHÔNG phải ý chính) → ところが: vấn đề thật (trích dẫn chiếm quá nửa bài, không thấy ý kiến người viết) → ～べきです → 私は～と考えています = ý chính: chỉ trích dẫn vừa đủ để làm chỗ dựa cho chủ trương của mình.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}の{図書館|としょかん}で、{職員|しょくいん}が{新入生|しんにゅうせい}に{話|はな}しています。', 'Daigaku no toshokan de, shokuin ga shinnyuusei ni hanashite imasu.', 'Ở thư viện trường đại học, một nhân viên đang nói chuyện với sinh viên mới.'],
      ['{図書館|としょかん}の{職員|しょくいん}', 'ja-nu', 'みなさん、こんにちは。{今日|きょう}は、レポートで{他|ほか}の{人|ひと}の{文章|ぶんしょう}を{引用|いんよう}する{時|とき}のルールについてお{話|はな}しします。{引用|いんよう}する{時|とき}は、{言葉|ことば}を{変|か}えずにかぎ{括弧|かっこ}に{入|い}れ、{著者|ちょしゃ}の{名前|なまえ}と{出版|しゅっぱん}された{年|とし}、ページを{書|か}きます。これは{当然|とうぜん}のルールです。', 'Minasan, konnichiwa. Kyou wa, repooto de hoka no hito no bunshou o in\'you suru toki no ruuru ni tsuite ohanashi shimasu. In\'you suru toki wa, kotoba o kaezu ni kagikakko ni ire, chosha no namae to shuppan sareta toshi, peeji o kakimasu. Kore wa touzen no ruuru desu.', 'Chào các bạn. Hôm nay tôi xin nói về quy tắc khi trích dẫn bài viết của người khác trong báo cáo. Khi trích dẫn, giữ nguyên chữ, cho vào ngoặc 「」, ghi tên tác giả, năm xuất bản và số trang. Đó là quy tắc đương nhiên.'],
      ['{図書館|としょかん}の{職員|しょくいん}', 'ja-nu', 'ところが、{毎年|まいとし}、ルールはきちんと{守|まも}っているのに、{評価|ひょうか}の{低|ひく}いレポートがたくさんあります。{読|よ}んでみると、{本|ほん}やネットからの{引用|いんよう}が{全体|ぜんたい}の{半分|はんぶん}{以上|いじょう}を{占|し}めていて、{書|か}いた{人|ひと}{自身|じしん}の{考|かんが}えがほとんど{見|み}えないのです。', 'Tokoro ga, maitoshi, ruuru wa kichinto mamotte iru noni, hyouka no hikui repooto ga takusan arimasu. Yonde miru to, hon ya netto kara no in\'you ga zentai no hanbun ijou o shimete ite, kaita hito jishin no kangae ga hotondo mienai no desu.', 'Thế nhưng, năm nào cũng có nhiều bài báo cáo giữ đúng quy tắc mà vẫn bị đánh giá thấp. Đọc thử thì thấy phần trích từ sách và mạng chiếm hơn một nửa toàn bài, hầu như không thấy suy nghĩ của chính người viết.'],
      ['{図書館|としょかん}の{職員|しょくいん}', 'ja-nu', '{引用|いんよう}は、{自分|じぶん}の{主張|しゅちょう}を{支|ささ}えるための{材料|ざいりょう}にすぎません。{引用|いんよう}した{後|あと}には、その{意見|いけん}について{自分|じぶん}はどう{考|かんが}えるのかを、{必|かなら}ず{書|か}くべきです。では、どのぐらい{引用|いんよう}すればいいのでしょうか。{私|わたし}は、{自分|じぶん}の{主張|しゅちょう}を{支|ささ}えるのに{必要|ひつよう}な{分|ぶん}だけで{十分|じゅうぶん}だと{考|かんが}えています。', 'In\'you wa, jibun no shuchou o sasaeru tame no zairyou ni sugimasen. In\'you shita ato ni wa, sono iken ni tsuite jibun wa dou kangaeru no ka o, kanarazu kaku beki desu. De wa, dono gurai in\'you sureba ii no deshou ka. Watashi wa, jibun no shuchou o sasaeru no ni hitsuyou na bun dake de juubun da to kangaete imasu.', 'Trích dẫn chẳng qua chỉ là vật liệu để làm chỗ dựa cho chủ trương của chính mình. Sau khi trích, nhất định nên viết mình nghĩ thế nào về ý kiến đó. Vậy nên trích bao nhiêu thì vừa? Tôi cho rằng chỉ cần đúng phần cần thiết để chống đỡ chủ trương của mình là đủ.'],
      ['ナレーター', 'ja-nu', '{職員|しょくいん}が{一番|いちばん}{伝|つた}えたいことは{何|なん}ですか。', 'Shokuin ga ichiban tsutaetai koto wa nan desu ka.', 'Điều nhân viên muốn truyền đạt nhất là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b52-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{職員|しょくいん}が{一番|いちばん}{伝|つた}えたいことは{何|なん}ですか。', options: ['{引用|いんよう}する{時|とき}は、{必|かなら}ず{出典|しゅってん}とページを{書|か}くべきだ', 'インターネットの{文章|ぶんしょう}は{引用|いんよう}するべきではない', '{引用|いんよう}は、{自分|じぶん}の{主張|しゅちょう}を{支|ささ}えるのに{必要|ひつよう}な{分|ぶん}だけにするべきだ', '{引用|いんよう}が{多|おお}いレポートほど、{評価|ひょうか}が{高|たか}くなる'], correct: 2, why: 'Quy tắc ghi nguồn được nói là **{当然|とうぜん}のルール** (nền, không phải ý chính). Sau **ところが** là vấn đề thật (trích quá nhiều), rồi câu chốt **{私|わたし}は、{自分|じぶん}の{主張|しゅちょう}を{支|ささ}えるのに{必要|ひつよう}な{分|ぶん}だけで{十分|じゅうぶん}だと{考|かんが}えています** → đáp án 3. Đáp án 2 không được nói; đáp án 4 ngược lại.' },
        { q: '{評価|ひょうか}の{低|ひく}いレポートの{問題|もんだい}は{何|なん}だと{言|い}っていますか。', options: ['{引用|いんよう}のルールを{守|まも}っていないこと', '{引用|いんよう}が{多|おお}すぎて、{書|か}いた{人|ひと}の{考|かんが}えが{見|み}えないこと', '{字数|じすう}が{足|た}りないこと', '{出典|しゅってん}が{古|ふる}すぎること'], correct: 1, why: '**ルールはきちんと{守|まも}っているのに** + **{引用|いんよう}が{全体|ぜんたい}の{半分|はんぶん}{以上|いじょう}…{書|か}いた{人|ひと}{自身|じしん}の{考|かんが}えがほとんど{見|み}えない**. **～にすぎない** = chẳng qua chỉ là (N2).' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題4 即時応答: 6 câu ngắn' },
    NG('b52-ng-4', '{即時応答|そくじおうとう} — {文|ぶん}を{聞|き}いて、{一番|いちばん}いい{返事|へんじ}を{選|えら}んでください', 'Dạng 即時応答 — mỗi câu chỉ nghe MỘT lần. Nghe ý (yêu cầu làm trước / hỏi một mặt / phê bình / than việc nặng / hỏi kinh nghiệm) rồi chọn câu đáp. Đáp án ghi ở câu hỏi bên dưới.', [
      ['ナレーター', 'ja-nu', '{一番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'このデータ、{元|もと}の{資料|しりょう}を{確認|かくにん}した{上|うえ}で{使|つか}ってくださいね。', 'Kono deeta, moto no shiryou o kakunin shita ue de tsukatte kudasai ne.', 'Số liệu này, em kiểm tra tài liệu gốc rồi hãy dùng nhé.'],
      ['ナレーター', 'ja-nu', '{二番|にばん}。', 'Niban.', 'Câu 2.'],
      ['{鈴木|すずき}', 'ja-nu', '{新|あたら}しい{企画|きかく}、{費用|ひよう}の{面|めん}ではどうなの？', 'Atarashii kikaku, hiyou no men de wa dou na no?', 'Dự án mới ấy, về mặt chi phí thì thế nào?'],
      ['ナレーター', 'ja-nu', '{三番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['ダニエル', 'ja-nam', 'そんなこと、{先生|せんせい}に{直接|ちょくせつ}{言|い}うべきじゃないよ。', 'Sonna koto, sensei ni chokusetsu iu beki ja nai yo.', 'Chuyện như thế, không nên nói thẳng với thầy cô đâu.'],
      ['ナレーター', 'ja-nu', '{四番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['リン', 'ja-nu', 'このレポート、だ・である{体|たい}で{書|か}かなきゃいけないんだって。', 'Kono repooto, da de aru tai de kakanakya ikenai n datte.', 'Nghe nói bài báo cáo này phải viết thể だ・である đấy.'],
      ['ナレーター', 'ja-nu', '{五番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['{森課長|もりかちょう}', 'ja-nam', '{明日|あした}の{朝|あさ}までに、この{報告書|ほうこくしょ}を{仕上|しあ}げねばならないんですよ。', 'Ashita no asa made ni, kono houkokusho o shiageneba naranai n desu yo.', 'Trước sáng mai tôi phải hoàn thành bản báo cáo này đấy.'],
      ['ナレーター', 'ja-nu', '{六番|ろくばん}。', 'Rokuban.', 'Câu 6.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', '{日本|にほん}で{生活|せいかつ}する{上|うえ}で、{何|なに}が{一番|いちばん}{大変|たいへん}でしたか。', 'Nihon de seikatsu suru ue de, nani ga ichiban taihen deshita ka.', 'Khi sống ở Nhật, điều gì vất vả nhất với em?'],
    ]),
    {
      t: 'mcq',
      id: 'b52-ng-4-q',
      title: 'Bài 4 — chọn câu đáp tự nhiên nhất (6 câu)',
      items: [
        MQ('{一番|いちばん}：「このデータ、{元|もと}の{資料|しりょう}を{確認|かくにん}した{上|うえ}で{使|つか}ってくださいね。」', 'はい、{元|もと}の{資料|しりょう}を{見|み}てから{使|つか}います。', ['はい、{使|つか}った{後|あと}で{確認|かくにん}します。', '{確認|かくにん}は{上|うえ}の{人|ひと}がするんですね。'], '**～た{上|うえ}で** = kiểm tra TRƯỚC rồi mới dùng → hứa **{見|み}てから{使|つか}う**. Câu 2 đảo thứ tự; câu 3 hiểu 上 thành "người trên".'),
        MQ('{二番|にばん}：「{新|あたら}しい{企画|きかく}、{費用|ひよう}の{面|めん}ではどうなの？」', '{予算|よさん}の{中|なか}で{十分|じゅうぶん}できそうです。', ['とても{面白|おもしろ}い{企画|きかく}だと{思|おも}います。', '{来週|らいしゅう}から{始|はじ}まる{予定|よてい}です。'], 'Hỏi **về mặt chi phí** → trả lời đúng mặt đó (ngân sách). Hai câu kia trả lời mặt khác (nội dung, thời gian).'),
        MQ('{三番|さんばん}：「そんなこと、{先生|せんせい}に{直接|ちょくせつ}{言|い}うべきじゃないよ。」', 'そうだね。{言|い}い{方|かた}を{考|かんが}えてみるよ。', ['うん、{直接|ちょくせつ}{言|い}うべきだよね。', '{先生|せんせい}はもう{帰|かえ}ったはずだよ。'], '**～べきじゃない** = phê bình "không nên" → đáp **nhận lời khuyên**. Câu 2 nói ngược; câu 3 lạc đề (はずだ = suy đoán).'),
        MQ('{四番|よんばん}：「このレポート、だ・である{体|たい}で{書|か}かなきゃいけないんだって。」', 'じゃあ、です・ますは{使|つか}わないほうがいいね。', ['{丁寧|ていねい}に、です・ますで{書|か}くってことだね。', '{話|はな}し{言葉|ことば}で{書|か}いてもいいんだね。'], '**だ・である{体|たい}** = thể văn viết, không dùng です・ます và không dùng văn nói → câu 1.'),
        MQ('{五番|ごばん}：「{明日|あした}の{朝|あさ}までに、この{報告書|ほうこくしょ}を{仕上|しあ}げねばならないんですよ。」', '{何|なに}かお{手伝|てつだ}いできることはありますか。', ['じゃあ、もう{仕上|しあ}げなくてもいいんですね。', '{明日|あした}はお{休|やす}みなんですか。'], '**～ねばならない** = phải (= なければならない) → việc gấp → **đề nghị giúp**. Câu 2 hiểu ngược thành "không cần".'),
        MQ('{六番|ろくばん}：「{日本|にほん}で{生活|せいかつ}する{上|うえ}で、{何|なに}が{一番|いちばん}{大変|たいへん}でしたか。」', 'やはり、{言葉|ことば}の{問題|もんだい}でしょうか。', ['{生活|せいかつ}した{上|うえ}で{決|き}めます。', '{上|うえ}の{階|かい}に{住|す}んでいました。'], '**～る{上|うえ}で** = "khi sống ở Nhật" → trả lời **điều vất vả**. Câu 2 nhầm sang た上で; câu 3 hiểu 上 thành "tầng trên".'),
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題5 統合理解 (1): chọn dịch vụ của trung tâm hỗ trợ viết' },
    NG('b52-ng-5', 'リンさんとカルロスさんは、どのサービスを{使|つか}いますか', 'Dạng 統合理解 — ba dịch vụ: A tư vấn một-một 30 phút (bố cục + lập luận, đặt lịch trước 3 ngày) · B sửa bài online (gửi bản thảo, ngày hôm sau trả — chỉ ngữ pháp và cách diễn đạt, văn nói lẫn vào; không nhận xét nội dung) · C buổi workshop chiều thứ Năm (nhóm ~10 người, tập dựng 序論・本論・結論, không cần đặt lịch). Điều kiện: リン — nội dung tốt, văn phong cần sửa, hạn là ngày kia. カルロス — chưa biết dựng bố cục, hạn tháng sau, ngại nói chuyện một-một.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}のライティングセンターで、{職員|しょくいん}がサービスについて{説明|せつめい}しています。そのあと、{学生|がくせい}{二人|ふたり}が{話|はな}しています。', 'Daigaku no raitingu sentaa de, shokuin ga saabisu ni tsuite setsumei shite imasu. Sono ato, gakusei futari ga hanashite imasu.', 'Ở trung tâm hỗ trợ viết của trường, một nhân viên đang giới thiệu các dịch vụ. Sau đó, hai sinh viên nói chuyện với nhau.'],
      ['ライティングセンターの{職員|しょくいん}', 'ja-nam', 'このセンターには、{三|みっ}つのサービスがあります。Aは{個別相談|こべつそうだん}です。スタッフと{一対一|いちたいいち}で{三十分|さんじゅっぷん}、レポートの{構成|こうせい}や{論理|ろんり}を{一緒|いっしょ}に{見|み}ていきます。{予約|よやく}は{三日前|みっかまえ}までにお{願|ねが}いします。', 'Kono sentaa ni wa, mittsu no saabisu ga arimasu. Ee wa kobetsu soudan desu. Sutaffu to ichitaiichi de sanjuppun, repooto no kousei ya ronri o issho ni mite ikimasu. Yoyaku wa mikka mae made ni onegai shimasu.', 'Trung tâm có ba dịch vụ. A là tư vấn riêng: một-một với nhân viên trong ba mươi phút, cùng xem bố cục và lập luận của bài. Xin đặt lịch trước ít nhất ba ngày.'],
      ['ライティングセンターの{職員|しょくいん}', 'ja-nam', 'Bはオンライン{添削|てんさく}です。{原稿|げんこう}を{送|おく}っていただければ、{次|つぎ}の{日|ひ}までに、{文法|ぶんぽう}や{表現|ひょうげん}、たとえば{話|はな}し{言葉|ことば}が{混|ま}じっていないかなどをチェックしてお{返|かえ}しします。ただし、{内容|ないよう}や{構成|こうせい}についてはコメントしません。', 'Bii wa onrain tensaku desu. Genkou o okutte itadakereba, tsugi no hi made ni, bunpou ya hyougen, tatoeba hanashikotoba ga majitte inai ka nado o chekku shite okaeshi shimasu. Tadashi, naiyou ya kousei ni tsuite wa komento shimasen.', 'B là sửa bài trực tuyến. Nếu các bạn gửi bản thảo, trước ngày hôm sau chúng tôi sẽ kiểm tra ngữ pháp và cách diễn đạt — chẳng hạn có lẫn văn nói không — rồi gửi lại. Tuy nhiên, chúng tôi không nhận xét về nội dung và bố cục.'],
      ['ライティングセンターの{職員|しょくいん}', 'ja-nam', 'Cはワークショップです。{毎週|まいしゅう}{木曜日|もくようび}の{夕方|ゆうがた}、{十人|じゅうにん}ぐらいのグループで、{序論|じょろん}・{本論|ほんろん}・{結論|けつろん}の{組|く}み{立|た}て{方|かた}を{練習|れんしゅう}します。{予約|よやく}はいりません。', 'Shii wa waakushoppu desu. Maishuu mokuyoubi no yuugata, juunin gurai no guruupu de, joron, honron, ketsuron no kumitatekata o renshuu shimasu. Yoyaku wa irimasen.', 'C là workshop. Chiều thứ Năm hằng tuần, theo nhóm khoảng mười người, luyện cách dựng phần mở đầu, thân bài và kết luận. Không cần đặt lịch.'],
      ['リン', 'ja-nu', '{私|わたし}、{先生|せんせい}に{内容|ないよう}はいいって{言|い}われたんだけど、{文体|ぶんたい}の{面|めん}で{直|なお}すところが{多|おお}くて。{締|し}め{切|き}りは{明後日|あさって}なんだ。', 'Watashi, sensei ni naiyou wa ii tte iwareta n da kedo, buntai no men de naosu tokoro ga ookute. Shimekiri wa asatte na n da.', 'Mình được cô khen nội dung tốt, nhưng về mặt văn phong thì có nhiều chỗ phải sửa. Hạn nộp là ngày kia.'],
      ['カルロス', 'ja-nam', 'それなら、{内容|ないよう}は{見|み}てもらわなくていいんだから、{明日|あした}{返|かえ}ってくるのがいいね。', 'Sore nara, naiyou wa mite morawanakute ii n da kara, ashita kaette kuru no ga ii ne.', 'Vậy thì nội dung không cần ai xem, nên chọn cái mai đã gửi lại là được nhỉ.'],
      ['リン', 'ja-nu', 'うん、それにする。カルロスは？', 'Un, sore ni suru. Karurosu wa?', 'Ừ, mình chọn cái đó. Còn Carlos?'],
      ['カルロス', 'ja-nam', '{僕|ぼく}は、そもそもどう{構成|こうせい}すればいいか{分|わ}からなくて。{締|し}め{切|き}りは{来月|らいげつ}だから、{時間|じかん}はあるんだ。でも、{一対一|いちたいいち}で{話|はな}すのはどうも{緊張|きんちょう}しちゃって……。みんなと{一緒|いっしょ}のほうが{気|き}が{楽|らく}かな。', 'Boku wa, somosomo dou kousei sureba ii ka wakaranakute. Shimekiri wa raigetsu da kara, jikan wa aru n da. Demo, ichitaiichi de hanasu no wa doumo kinchou shichatte……. Minna to issho no hou ga ki ga raku ka na.', 'Mình thì ngay từ đầu đã không biết dựng bố cục thế nào. Hạn là tháng sau nên có thời gian. Nhưng nói chuyện một-một thì mình cứ căng thẳng… Chắc học cùng mọi người thì thoải mái hơn.'],
      ['リン', 'ja-nu', 'じゃあ、{木曜日|もくようび}のがぴったりだね。', 'Jaa, mokuyoubi no ga pittari da ne.', 'Vậy cái hôm thứ Năm hợp quá rồi.'],
      ['ナレーター', 'ja-nu', '{質問|しつもん}は{二|ふた}つです。{一番|いちばん}、リンさんはどのサービスを{使|つか}いますか。{二番|にばん}、カルロスさんはどのサービスを{使|つか}いますか。', 'Shitsumon wa futatsu desu. Ichiban, Rin-san wa dono saabisu o tsukaimasu ka. Niban, Karurosu-san wa dono saabisu o tsukaimasu ka.', 'Có hai câu hỏi. Câu 1: Lin sẽ dùng dịch vụ nào? Câu 2: Carlos sẽ dùng dịch vụ nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b52-ng-5-q',
      title: 'Bài 5 — 2 câu (統合理解)',
      items: [
        { q: '{一番|いちばん}：リンさんはどのサービスを{使|つか}いますか。', options: ['Aの{個別相談|こべつそうだん}', 'Bのオンライン{添削|てんさく}', 'Cのワークショップ', 'どれも{使|つか}わない'], correct: 1, why: 'リン: nội dung tốt, cần sửa **{文体|ぶんたい}の{面|めん}**, hạn **{明後日|あさって}** → cần dịch vụ sửa **cách diễn đạt** và trả **ngày hôm sau** = B. A phải đặt trước 3 ngày (không kịp); C dạy bố cục.' },
        { q: '{二番|にばん}：カルロスさんはどのサービスを{使|つか}いますか。', options: ['Aの{個別相談|こべつそうだん}', 'Bのオンライン{添削|てんさく}', 'Cのワークショップ', 'AとBの{両方|りょうほう}'], correct: 2, why: 'カルロス: cần học **{構成|こうせい}** (B không nhận xét bố cục); có thời gian nhưng **{一対一|いちたいいち}は{緊張|きんちょう}** → **みんなと{一緒|いっしょ}** = C (workshop nhóm, thứ Năm). リン xác nhận: **{木曜日|もくようび}のがぴったり**.' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題5 統合理解 (2): thư viện thành phố giới thiệu ba lớp hướng dẫn' },
    NG('b52-ng-6', '{二人|ふたり}は、それぞれどれに{参加|さんか}しますか', 'Dạng 統合理解 — thông tin trước (ba chương trình cho người viết báo cáo: ① lớp "cách tìm tài liệu" sáng thứ Bảy tại thư viện; ② lớp "cách dùng cơ sở dữ liệu bài báo khoa học" tối thứ Tư, trực tuyến; ③ từ ngày 15 mở cửa tới 10 giờ tối trong mùa thi) rồi hội thoại. マリヤム: cần SÁCH cho bài 日本事情, không biết tìm, thứ Bảy rảnh → ①. ダニエル: cần nghiên cứu đi trước (bài báo khoa học), tối thứ Tư không đi làm thêm → ②.', [
      ['ナレーター', 'ja-nu', '{寮|りょう}で、{市|し}の{図書館|としょかん}のお{知|し}らせを{聞|き}いたあと、{女|おんな}の{学生|がくせい}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。', 'Ryou de, shi no toshokan no oshirase o kiita ato, onna no gakusei to otoko no gakusei ga hanashite imasu.', 'Ở ký túc xá, sau khi nghe thông báo của thư viện thành phố, một nữ sinh và một nam sinh đang nói chuyện.'],
      ['アナウンサー', 'ja-nu', '{市立図書館|しりつとしょかん}からのお{知|し}らせです。レポートや{論文|ろんぶん}を{書|か}く{学生|がくせい}のみなさんのために、{三|みっ}つのプログラムを{用意|ようい}しました。', 'Shiritsu toshokan kara no oshirase desu. Repooto ya ronbun o kaku gakusei no minasan no tame ni, mittsu no puroguramu o youi shimashita.', 'Đây là thông báo của thư viện thành phố. Chúng tôi đã chuẩn bị ba chương trình dành cho các bạn sinh viên đang viết báo cáo, luận văn.'],
      ['アナウンサー', 'ja-nu', '{一|ひと}つ{目|め}は「{資料|しりょう}の{探|さが}し{方|かた}{講座|こうざ}」です。{毎週|まいしゅう}{土曜日|どようび}の{午前|ごぜん}、{図書館|としょかん}の{二階|にかい}で、{本|ほん}や{新聞|しんぶん}の{探|さが}し{方|かた}を{説明|せつめい}します。{二|ふた}つ{目|め}は「{論文|ろんぶん}データベース{講座|こうざ}」です。{毎週|まいしゅう}{水曜日|すいようび}の{夜|よる}、オンラインで、{研究論文|けんきゅうろんぶん}を{探|さが}す{方法|ほうほう}を{紹介|しょうかい}します。{三|みっ}つ{目|め}は{夜間開館|やかんかいかん}です。{試験期間|しけんきかん}に{伴|ともな}い、{十五日|じゅうごにち}から、{閉館|へいかん}{時間|じかん}を{夜|よる}{十時|じゅうじ}まで{延長|えんちょう}します。', 'Hitotsume wa "shiryou no sagashikata kouza" desu. Maishuu doyoubi no gozen, toshokan no nikai de, hon ya shinbun no sagashikata o setsumei shimasu. Futatsume wa "ronbun deetabeesu kouza" desu. Maishuu suiyoubi no yoru, onrain de, kenkyuu ronbun o sagasu houhou o shoukai shimasu. Mittsume wa yakan kaikan desu. Shiken kikan ni tomonai, juugonichi kara, heikan jikan o yoru juuji made enchou shimasu.', 'Thứ nhất là "Lớp hướng dẫn tìm tài liệu": sáng thứ Bảy hằng tuần, ở tầng hai thư viện, hướng dẫn cách tìm sách và báo. Thứ hai là "Lớp cơ sở dữ liệu bài báo khoa học": tối thứ Tư hằng tuần, trực tuyến, giới thiệu cách tìm bài nghiên cứu. Thứ ba là mở cửa buổi tối: nhân mùa thi, từ ngày 15 giờ đóng cửa được kéo dài tới 10 giờ tối.'],
      ['マリヤム', 'ja-nu', '{私|わたし}、{日本事情|にほんじじょう}のレポートで{本|ほん}をもう{二冊|にさつ}ぐらい{読|よ}みたいんだけど、どうやって{探|さが}せばいいか{分|わ}からなくて。{土曜日|どようび}なら{空|あ}いてるから、{一|ひと}つ{目|め}に{行|い}ってみる。', 'Watashi, Nihon jijou no repooto de hon o mou nisatsu gurai yomitai n da kedo, dou yatte sagaseba ii ka wakaranakute. Doyoubi nara aiteru kara, hitotsume ni itte miru.', 'Mình muốn đọc thêm khoảng hai cuốn sách cho bài báo cáo Nhật Bản học, mà không biết tìm thế nào. Thứ Bảy mình rảnh nên sẽ đi thử cái thứ nhất.'],
      ['ダニエル', 'ja-nam', '{僕|ぼく}は{卒論|そつろん}の{先行研究|せんこうけんきゅう}を{探|さが}してるんだけど、{本|ほん}より{論文|ろんぶん}が{必要|ひつよう}なんだよね。', 'Boku wa sotsuron no senkou kenkyuu o sagashiteru n da kedo, hon yori ronbun ga hitsuyou na n da yo ne.', 'Mình đang tìm nghiên cứu đi trước cho khoá luận, mà cần bài báo khoa học hơn là sách.'],
      ['マリヤム', 'ja-nu', '{夜|よる}{十時|じゅうじ}まで{開|あ}いてるのも{助|たす}かるよね。', 'Yoru juuji made aiteru no mo tasukaru yo ne.', 'Mở tới mười giờ tối cũng đỡ lắm nhỉ.'],
      ['ダニエル', 'ja-nam', 'うん、でも{今|いま}{必要|ひつよう}なのは{場所|ばしょ}より{探|さが}し{方|かた}なんだ。{水曜|すいよう}の{夜|よる}はバイトがないし、{家|いえ}から{参加|さんか}できるなら、それにするよ。', 'Un, demo ima hitsuyou na no wa basho yori sagashikata na n da. Suiyou no yoru wa baito ga nai shi, ie kara sanka dekiru nara, sore ni suru yo.', 'Ừ, nhưng cái mình cần bây giờ là cách tìm chứ không phải chỗ ngồi. Tối thứ Tư mình không đi làm thêm, lại tham gia từ nhà được thì mình chọn cái đó.'],
      ['ナレーター', 'ja-nu', '{質問|しつもん}は{二|ふた}つです。{一番|いちばん}、{女|おんな}の{学生|がくせい}はどれに{参加|さんか}しますか。{二番|にばん}、{男|おとこ}の{学生|がくせい}はどれに{参加|さんか}しますか。', 'Shitsumon wa futatsu desu. Ichiban, onna no gakusei wa dore ni sanka shimasu ka. Niban, otoko no gakusei wa dore ni sanka shimasu ka.', 'Có hai câu hỏi. Câu 1: Nữ sinh sẽ tham gia cái nào? Câu 2: Nam sinh sẽ tham gia cái nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b52-ng-6-q',
      title: 'Bài 6 — 2 câu (統合理解)',
      items: [
        { q: '{一番|いちばん}：{女|おんな}の{学生|がくせい}はどれに{参加|さんか}しますか。', options: ['{資料|しりょう}の{探|さが}し{方|かた}{講座|こうざ}', '{論文|ろんぶん}データベース{講座|こうざ}', '{夜間開館|やかんかいかん}', 'どれにも{参加|さんか}しない'], correct: 0, why: 'マリヤム cần **sách**, không biết **cách tìm**, **{土曜日|どようび}なら{空|あ}いてる** → **{一|ひと}つ{目|め}に{行|い}ってみる** = lớp tìm tài liệu (thứ Bảy).' },
        { q: '{二番|にばん}：{男|おとこ}の{学生|がくせい}はどれに{参加|さんか}しますか。', options: ['{資料|しりょう}の{探|さが}し{方|かた}{講座|こうざ}', '{論文|ろんぶん}データベース{講座|こうざ}', '{夜間開館|やかんかいかん}', '{三|みっ}つ{全部|ぜんぶ}'], correct: 1, why: 'ダニエル cần **{論文|ろんぶん}** (bài báo khoa học), **{場所|ばしょ}より{探|さが}し{方|かた}**, **{水曜|すいよう}の{夜|よる}はバイトがない** + **{家|いえ}から{参加|さんか}できる** (trực tuyến) → lớp cơ sở dữ liệu bài báo (tối thứ Tư).' },
      ],
    },
    {
      t: 'note',
      title: 'Sau khi nghe — ghi vào sổ',
      items: [
        'Câu chuẩn của **lời hướng dẫn làm bài**: **～た{上|うえ}で{作|つく}ってください** · **～は{後|あと}で{構|かま}いません** · **～{字|じ}{以内|いない}で、だ・である{体|たい}で{書|か}いてください** · **{明日中|あしたじゅう}にメールしてください** — gặp ở mọi trường đại học Nhật.',
        'Câu chuẩn của **bài nói nêu ý kiến**: **これは{当然|とうぜん}の～です。ところが、～** (đưa ra cái ai cũng biết rồi lật sang vấn đề thật) · **～にすぎません** (chẳng qua chỉ là) · **～べきです** · **{私|わたし}は～と{考|かんが}えています** (ý chính).',
        'Câu chuẩn của **thông báo dịch vụ**: **～のために、～を{用意|ようい}しました** · **{予約|よやく}は～までにお{願|ねが}いします／{予約|よやく}はいりません** · **ただし、～については～しません** (giới hạn dịch vụ — đề 統合理解 rất hay giấu đáp án ở câu ただし) · **～に{伴|ともな}い、～を{延長|えんちょう}します** (ôn Bài 49).',
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b52-doc',
  kind: 'reading',
  title: 'Đọc hiểu N2 — tờ đề bài レポート cuối kỳ (情報検索), hai ý kiến A/B về dùng AI khi viết báo cáo (統合理解), bài luận ~950 chữ "Viết để phá vỡ cái \'tưởng là đã hiểu\'" (主張理解・長文)',
  goal: 'Đọc tờ đề bài レポート (yêu cầu số chữ, văn phong, tài liệu, hạn nộp, trường hợp ngoại lệ) để trả lời đúng cho từng tình huống cụ thể (情報検索 — chú ý ただし・～にかかわらず・～は含めない); so sánh hai ý kiến về việc dùng AI khi viết báo cáo, tìm điểm chung và lập trường của từng người (統合理解); đọc bài luận dài thể である, bám từ nối (ところが・つまり・むしろ・もちろん～しかし) để tìm chủ trương của tác giả và hiểu các câu gạch chân (主張理解).',
  minutes: 60,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N2 — các dạng gặp trong bài này',
      head: ['Dạng', 'Đề cho gì', 'Làm thế nào'],
      rows: [
        ['情報検索 (tìm thông tin)', 'Một tờ thông báo / hướng dẫn / đề bài + 2 câu hỏi theo tình huống của một người.', 'Đọc **câu hỏi trước**, gạch điều kiện của người đó (テーマ・字数・資料・日付) rồi mới dò tờ giấy. Đáp án hay nằm ở **※・ただし・なお・～は含めない・～にかかわらず**.'],
        ['統合理解 (so sánh A/B)', 'Hai bài ngắn về cùng một đề tài.', 'Mỗi bài tóm **lập trường** trong một dòng (賛成／反対／条件付き). Câu hỏi "AとBが共通して述べている" → tìm ý **cả hai** cùng nói, dù lập trường khác.'],
        ['主張理解・長文 (ý kiến tác giả)', 'Bài luận 900–1.000 chữ, thể である.', 'Chủ trương thường ở **đoạn cuối** (～べきだ・～ではないだろうか・～なのである). Đoạn giữa có **ví dụ** (ある学生がこう言った) — ví dụ để **chứng minh**, không phải ý chính. Bám từ nối: **ところが** (lật) · **つまり** (tóm lại) · **むしろ** (ngược lại thì đúng hơn) · **もちろん～。しかし～** (nhượng bộ rồi khẳng định).'],
      ],
    },
    {
      t: 'note',
      title: 'Văn của bài đọc N2 = văn của Bài 52',
      items: [
        'Cả ba bài viết bằng **だ・である体** — đúng thể bạn vừa học. Câu kết **～のである／～なのである** = tác giả **nhấn mạnh kết luận** của đoạn — thường là câu nên gạch chân.',
        '**～ねばならない・～べきである** trong bài đọc = **chủ trương mạnh** của tác giả → ứng viên số một cho câu hỏi "筆者の考えに合うものはどれか".',
        '**～上で** · **～の面から見れば** · **～という点で** = tác giả đang **giới hạn** nhận xét vào một mặt. Câu sau **しかし** mới là điều tác giả muốn nói.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 情報検索: tờ đề bài レポート cuối kỳ' },
    {
      t: 'passage',
      title: '「{日本事情|にほんじじょう}Ⅱ」{期末|きまつ}レポート{課題|かだい}',
      intro: 'Tờ đề bài phát cho sinh viên môn Nhật Bản học II (tên môn, ngày tháng là minh hoạ). Đọc câu hỏi bên dưới TRƯỚC, rồi mới dò tờ giấy.',
      paras: [
        { label: '1', text: '**テーマ**：{次|つぎ}のA～Cから{一|ひと}つを{選|えら}ぶこと。A「{日本|にほん}の{若者|わかもの}と{働|はたら}き{方|かた}」 B「{地域|ちいき}の{祭|まつ}りの{役割|やくわり}」 C「{外国人住民|がいこくじんじゅうみん}と{地域社会|ちいきしゃかい}」' },
        { label: '2', text: '**{字数|じすう}**：{本文|ほんぶん}{二千字|にせんじ}{以上|いじょう}、{三千字|さんぜんじ}{以内|いない}。{表紙|ひょうし}と{参考文献|さんこうぶんけん}の{一覧|いちらん}は{字数|じすう}に{含|ふく}めない。' },
        { label: '3', text: '**{形式|けいしき}**：A4{横書|よこが}き、だ・である{体|たい}で{書|か}くこと。{表紙|ひょうし}に{氏名|しめい}、{学籍番号|がくせきばんごう}、{選|えら}んだテーマの{記号|きごう}（A～C）を{書|か}くこと。' },
        { label: '4', text: '**{資料|しりょう}**：{二|ふた}つ{以上|いじょう}の{文献|ぶんけん}を{引用|いんよう}すること。そのうち{少|すく}なくとも{一|ひと}つは{本|ほん}または{論文|ろんぶん}とし、ウェブサイトだけで{書|か}いたレポートは{認|みと}めない。{自分|じぶん}で{行|おこな}ったアンケートやインタビューを{使|つか}ってもよいが、{文献|ぶんけん}の{数|かず}には{含|ふく}めない。' },
        { label: '5', text: '**{提出|ていしゅつ}**：{一月|いちがつ}{二十日|はつか}（{月|げつ}）{午後|ごご}{五時|ごじ}までに、{学習|がくしゅう}システムで{提出|ていしゅつ}すること。' },
        { label: '6', text: '**{注意|ちゅうい}**：{締|し}め{切|き}りを{過|す}ぎたレポートは、{理由|りゆう}にかかわらず{受|う}け{付|つ}けない。ただし、{病気|びょうき}など、やむを{得|え}ない{事情|じじょう}がある{場合|ばあい}は、{締|し}め{切|き}りの{前|まえ}に{担当教員|たんとうきょういん}にメールで{連絡|れんらく}すること。また、{他人|たにん}の{文章|ぶんしょう}を{出典|しゅってん}を{示|しめ}さずに{使|つか}った{場合|ばあい}は、{零点|れいてん}とする。' },
      ],
    },
    {
      t: 'note',
      title: 'Từ & cấu trúc của tờ đề bài',
      items: [
        '**～こと。** (cuối câu) = **quy định phải làm** — văn hướng dẫn, nội quy · **～とする** = quy định là · **～は{認|みと}めない** = không chấp nhận · **～に{含|ふく}めない** = không tính vào.',
        '**{理由|りゆう}にかかわらず** (ôn Bài 42) = dù lý do gì · **ただし、～** = tuy nhiên (ngoại lệ — đọc kỹ!) · **やむを{得|え}ない{事情|じじょう}** = hoàn cảnh bất khả kháng · **{零点|れいてん}** = điểm không.',
        '**{横書|よこが}き** (viết ngang) ↔ **{縦書|たてが}き** (viết dọc) · **{学籍番号|がくせきばんごう}** (mã số sinh viên) · **{担当教員|たんとうきょういん}** (giảng viên phụ trách) · **{本文|ほんぶん}** (phần thân văn bản).',
      ],
    },
    {
      t: 'mcq',
      id: 'b52-doc-1',
      title: 'Bài 1 — 3 câu (情報検索)',
      items: [
        { q: 'マリヤムさんはテーマCを{選|えら}び、ウェブサイトの{記事|きじ}を{二|ふた}つと、{自分|じぶん}で{行|おこな}ったアンケートの{結果|けっか}を{使|つか}ってレポートを{書|か}いた。このまま{出|だ}す{前|まえ}に、{何|なに}をしなければならないか。', options: ['アンケートの{結果|けっか}を{消|け}す', '{本|ほん}か{論文|ろんぶん}を{少|すく}なくとも{一|ひと}つ{引用|いんよう}する', 'ウェブサイトの{記事|きじ}をもう{一|ひと}つ{加|くわ}える', 'テーマをAかBに{変|か}える'], correct: 1, why: 'Mục 4: **{少|すく}なくとも{一|ひと}つは{本|ほん}または{論文|ろんぶん}**, **ウェブサイトだけ…{認|みと}めない**. Khảo sát tự làm **được dùng** nhưng **không tính** là tài liệu → phải thêm một sách / bài báo khoa học.' },
        { q: '{本文|ほんぶん}が{千八百字|せんはっぴゃくじ}、{参考文献|さんこうぶんけん}の{一覧|いちらん}が{三百字|さんびゃくじ}のレポートについて、{正|ただ}しいものはどれか。', options: ['{合計|ごうけい}で{二千字|にせんじ}を{超|こ}えているので、このまま{出|だ}してよい', '{本文|ほんぶん}をあと{二百字|にひゃくじ}{以上|いじょう}{増|ふ}やさなければならない', '{参考文献|さんこうぶんけん}を{減|へ}らさなければならない', '{三千字|さんぜんじ}を{超|こ}えているので、{短|みじか}くしなければならない'], correct: 1, why: 'Mục 2: **{本文|ほんぶん}{二千字|にせんじ}{以上|いじょう}** + **{参考文献|さんこうぶんけん}の{一覧|いちらん}は{字数|じすう}に{含|ふく}めない** → 1.800 chữ thân bài là thiếu ít nhất 200 chữ. Cộng cả danh mục (2.100) là bẫy.' },
        { q: '{一月|いちがつ}{十九日|じゅうくにち}に{高|たか}い{熱|ねつ}が{出|で}て、{締|し}め{切|き}りまでに{出|だ}せそうにない。どうすればよいか。', options: ['{治|なお}ってから、{理由|りゆう}を{書|か}いてレポートを{出|だ}す', '{締|し}め{切|き}りの{前|まえ}に、{担当教員|たんとうきょういん}にメールで{連絡|れんらく}する', '{病院|びょういん}の{書類|しょるい}を{学習|がくしゅう}システムで{出|だ}す', '{友達|ともだち}に{代|か}わりに{出|だ}してもらう'], correct: 1, why: 'Mục 6: **ただし、{病気|びょうき}など…{締|し}め{切|き}りの{前|まえ}に{担当教員|たんとうきょういん}にメールで{連絡|れんらく}すること**. Đáp án 1 sai vì quá hạn thì **{理由|りゆう}にかかわらず{受|う}け{付|つ}けない** (nếu chưa báo trước).' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 統合理解: hai ý kiến về dùng AI khi viết báo cáo' },
    {
      t: 'passage',
      title: 'レポートの{作成|さくせい}に{生成|せいせい}AIを{使|つか}ってもよいか',
      intro: 'Hai ý kiến đăng trên báo trường (người viết là nhân vật giả định). Đọc A và B, rồi trả lời câu hỏi.',
      paras: [
        { label: 'A', text: '{生成|せいせい}AIの{使用|しよう}を{一律|いちりつ}に{禁止|きんし}すべきではない。{計算|けいさん}に{電卓|でんたく}を{使|つか}うのと{同|おな}じように、AIも{道具|どうぐ}の{一|ひと}つにすぎないからだ。{実際|じっさい}、{社会|しゃかい}に{出|で}れば、AIを{使|つか}って{資料|しりょう}を{作|つく}る{場面|ばめん}は{増|ふ}えていくだろう。{大学|だいがく}はむしろ、その{正|ただ}しい{使|つか}い{方|かた}を{教|おし}えるべきである。ただし、{条件|じょうけん}がある。AIを{使|つか}った{場合|ばあい}は、どの{部分|ぶぶん}にどう{使|つか}ったかをレポートに{明記|めいき}すること。そして、AIが{示|しめ}した{情報|じょうほう}は、{必|かなら}ず{元|もと}の{資料|しりょう}を{確認|かくにん}した{上|うえ}で{使|つか}うことだ。AIは、もっともらしい{間違|まちが}いを{書|か}くことがあるからである。{考|かんが}える{力|ちから}は、AIに{何|なに}を{問|と}い、その{答|こた}えをどう{判断|はんだん}するかという{点|てん}でも{育|そだ}てられるはずだ。' },
        { label: 'B', text: '{少|すく}なくとも{一年生|いちねんせい}のレポートでは、{生成|せいせい}AIを{使|つか}うべきではないと{考|かんが}える。{書|か}くことは、{考|かんが}えることそのものだからだ。{何|なに}を{最初|さいしょ}に{述|の}べ、どの{根拠|こんきょ}を{選|えら}び、どう{結論|けつろん}につなげるか。この{構成|こうせい}を{自分|じぶん}で{悩|なや}みながら{組|く}み{立|た}てる{経験|けいけん}の{積|つ}み{重|かさ}ねが、{考|かんが}える{力|ちから}を{育|そだ}てるのである。{下書|したが}きをAIに{任|まか}せれば、レポートは{早|はや}く{完成|かんせい}するかもしれない。しかし、その{分|ぶん}、{学生|がくせい}は{考|かんが}える{練習|れんしゅう}の{機会|きかい}を{失|うしな}うことになる。もちろん、{道具|どうぐ}としての{便利|べんり}さは{認|みと}める。{自分|じぶん}で{書|か}く{力|ちから}を{身|み}につけた{上|うえ}でなら、{使|つか}ってもよいだろう。{順番|じゅんばん}を{間違|まちが}えてはならないのである。' },
      ],
    },
    {
      t: 'note',
      title: 'Đọc A/B thế nào',
      items: [
        '**Lập trường A**: **{禁止|きんし}すべきではない** + **ただし、{条件|じょうけん}がある** = **tán thành có điều kiện** (ghi rõ đã dùng ở đâu; kiểm tra tài liệu gốc rồi mới dùng — **～た{上|うえ}で**).',
        '**Lập trường B**: **{使|つか}うべきではない** (ít nhất với năm nhất) + **{自分|じぶん}で{書|か}く{力|ちから}を{身|み}につけた{上|うえ}でなら、{使|つか}ってもよい** = **phản đối ở giai đoạn đầu**, chấp nhận về sau.',
        '**Điểm chung**: cả hai đều coi trọng **{考|かんが}える{力|ちから}** và đều thừa nhận AI là **{道具|どうぐ}** (A: {道具|どうぐ}の{一|ひと}つにすぎない · B: {道具|どうぐ}としての{便利|べんり}さは{認|みと}める). Khác nhau ở **thời điểm / điều kiện** dùng.',
        '**もっともらしい** = nghe có vẻ hợp lý (mà chưa chắc đúng) · **{一律|いちりつ}に** = đồng loạt, một mức như nhau · **{積|つ}み{重|かさ}ね** = sự tích luỹ · **{任|まか}せる** = giao phó.',
      ],
    },
    {
      t: 'mcq',
      id: 'b52-doc-2',
      title: 'Bài 2 — 3 câu (統合理解)',
      items: [
        { q: 'AとBが{共通|きょうつう}して{述|の}べていることはどれか。', options: ['AIはレポートの{作成|さくせい}に{全|まった}く{役|やく}に{立|た}たない', '{学生|がくせい}の{考|かんが}える{力|ちから}を{育|そだ}てることが{大切|たいせつ}だ', '{大学|だいがく}はAIの{使|つか}い{方|かた}を{教|おし}えるべきだ', 'AIを{使|つか}ったレポートは{零点|れいてん}にすべきだ'], correct: 1, why: 'A: **{考|かんが}える{力|ちから}は…{育|そだ}てられるはずだ** · B: **{考|かんが}える{力|ちから}を{育|そだ}てる** → cả hai coi trọng năng lực tư duy. Đáp án 3 chỉ A nói; 1 và 4 không ai nói.' },
        { q: 'AとBの{立場|たちば}について、{正|ただ}しいものはどれか。', options: ['Aは{条件|じょうけん}つきで{使用|しよう}を{認|みと}め、Bは{少|すく}なくとも{一年生|いちねんせい}には{使|つか}わせるべきではないと{考|かんが}えている', 'AもBも、AIの{使用|しよう}に{完全|かんぜん}に{反対|はんたい}している', 'AはAIの{使用|しよう}に{反対|はんたい}し、Bは{賛成|さんせい}している', 'AもBも、{条件|じょうけん}なしにAIを{使|つか}ってよいと{考|かんが}えている'], correct: 0, why: 'A: **{禁止|きんし}すべきではない。ただし、{条件|じょうけん}がある** · B: **{少|すく}なくとも{一年生|いちねんせい}のレポートでは…{使|つか}うべきではない**, sau khi có năng lực viết thì **{使|つか}ってもよい**.' },
        { q: 'Bが{一番|いちばん}{心配|しんぱい}していることは{何|なん}か。', options: ['AIが{間違|まちが}った{情報|じょうほう}を{書|か}くこと', 'レポートの{完成|かんせい}が{遅|おそ}くなること', '{構成|こうせい}を{自分|じぶん}で{考|かんが}える{練習|れんしゅう}の{機会|きかい}がなくなること', '{社会|しゃかい}に{出|で}てからAIが{使|つか}えないこと'], correct: 2, why: 'B: **{下書|したが}きをAIに{任|まか}せれば…{学生|がくせい}は{考|かんが}える{練習|れんしゅう}の{機会|きかい}を{失|うしな}う**. "AI viết sai" (đáp án 1) là lo ngại của **A**.' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 主張理解（長文）: "Viết để phá vỡ cái \'tưởng là đã hiểu\'" (~950 chữ)' },
    {
      t: 'passage',
      title: '{分|わ}かったつもりを{壊|こわ}すために{書|か}く',
      intro: 'Bài luận (tác giả giả định — một giảng viên dạy kỹ năng viết cho sinh viên năm nhất). Thể である. Đọc một lượt lấy ý chính, lần hai gạch dưới từ nối và câu chủ trương.',
      paras: [
        { label: '①', text: '「{分|わ}かった」と「{書|か}ける」の{間|あいだ}には、{大|おお}きな{距離|きょり}がある。{授業|じゅぎょう}で{先生|せんせい}の{説明|せつめい}を{聞|き}いている{時|とき}、{私|わたし}たちは{多|おお}くのことを{分|わ}かったつもりになる。ところが、いざそれをレポートにまとめようとすると、{手|て}が{止|と}まってしまう。{一行目|いちぎょうめ}から{何|なに}を{書|か}けばいいのかが{分|わ}からないのである。' },
        { label: '②', text: 'なぜこのようなことが{起|お}きるのだろうか。{理由|りゆう}の{一|ひと}つは、{話|はなし}を{聞|き}く{時|とき}と{文章|ぶんしょう}を{書|か}く{時|とき}とでは、{頭|あたま}の{使|つか}い{方|かた}が{異|こと}なることにある。{聞|き}く{時|とき}は、{話|はな}し{手|て}がすでに{順序|じゅんじょ}を{決|き}めてくれている。{私|わたし}たちはそれについていけばよい。しかし{書|か}く{時|とき}は、{何|なに}から{述|の}べ、どの{根拠|こんきょ}を{使|つか}い、どこで{結論|けつろん}を{出|だ}すのかを、すべて{自分|じぶん}で{決|き}めねばならない。つまり、{書|か}くという{作業|さぎょう}は、{自分|じぶん}の{頭|あたま}の{中|なか}を{一|ひと}つずつ{点検|てんけん}する{作業|さぎょう}なのである。' },
        { label: '③', text: '{以前|いぜん}、{一年生|いちねんせい}の{授業|じゅぎょう}で、ある{学生|がくせい}がこう{言|い}った。「{書|か}いているうちに、{自分|じぶん}の{考|かんが}えが{最初|さいしょ}と{変|か}わってしまいました。これは{失敗|しっぱい}でしょうか」。{私|わたし}はそうは{思|おも}わない。むしろ、それは{書|か}くことによって{考|かんが}えが{深|ふか}まった{証拠|しょうこ}である。{書|か}く{前|まえ}の{考|かんが}えは、{多|おお}くの{場合|ばあい}、まだはっきりした{形|かたち}になっていない。{書|か}きながら{根拠|こんきょ}を{探|さが}し、{反論|はんろん}を{想定|そうてい}し、{言葉|ことば}を{選|えら}ぶ{中|なか}で、{初|はじ}めて{考|かんが}えは{形|かたち}を{持|も}つのである。' },
        { label: '④', text: 'そうであれば、レポートを「{評価|ひょうか}されるための{作業|さぎょう}」とだけ{考|かんが}えるのはもったいない。もちろん、{成績|せいせき}の{面|めん}から{見|み}れば、レポートは{評価|ひょうか}の{対象|たいしょう}である。{字数|じすう}や{形式|けいしき}を{守|まも}ることも{大切|たいせつ}だ。しかし、{学生|がくせい}がレポートを{書|か}く{上|うえ}で{最|もっと}も{重視|じゅうし}すべきなのは、{点数|てんすう}ではない。{自分|じぶん}の{考|かんが}えを{確|たし}かめ、{時|とき}には{壊|こわ}し、もう{一度|いちど}{組|く}み{立|た}て{直|なお}すという{経験|けいけん}そのものである。' },
        { label: '⑤', text: '{書|か}き{直|なお}しを{恐|おそ}れる{必要|ひつよう}はない。{一度|いちど}で{完成|かんせい}する{文章|ぶんしょう}など、ほとんどないのだから。{分|わ}かったつもりを{壊|こわ}すために{書|か}く。それが、{大学|だいがく}で{書|か}くことの{本当|ほんとう}の{意味|いみ}ではないだろうか。' },
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật 主張理解 cho bài này',
      items: [
        '**Đoạn ①** nêu hiện tượng (hiểu ≠ viết được) — **ところが** lật sang vấn đề · **Đoạn ②** giải thích nguyên nhân — **つまり** tóm lại: viết = kiểm tra lại đầu óc mình · **Đoạn ③** là **ví dụ** (một sinh viên) — **むしろ** đảo cách nhìn: đổi ý khi viết KHÔNG phải thất bại · **Đoạn ④** **もちろん～。しかし～** = nhượng bộ (điểm số cũng quan trọng) rồi khẳng định điều quan trọng NHẤT · **Đoạn ⑤** chốt: **～ではないだろうか** (chủ trương mềm).',
        'Chủ trương tác giả = đoạn ④ + ⑤: **viết báo cáo để kiểm tra, phá vỡ và dựng lại suy nghĩ của mình — không chỉ để được chấm điểm**. Câu hỏi "{筆者|ひっしゃ}の{考|かんが}え" chọn đáp án gần câu này.',
        'Mẫu của Bài 52 trong bài: **{決|き}めねばならない** (②) · **{成績|せいせき}の{面|めん}から{見|み}れば** (④) · **レポートを{書|か}く{上|うえ}で{最|もっと}も{重視|じゅうし}すべきなのは** (④ — 上で + べき) · thể **である** xuyên suốt, **～のである** chốt đoạn ①②③.',
        'Từ mới trong bài: **～つもりになる** (tưởng là đã…) · **いざ～しようとすると** (đến lúc thực sự định làm thì) · **{点検|てんけん}** (kiểm tra) · **{想定|そうてい}する** (giả định trước) · **もったいない** (phí, uổng) · **{恐|おそ}れる** (sợ).',
      ],
    },
    {
      t: 'mcq',
      id: 'b52-doc-3',
      title: 'Bài 3 — 4 câu (主張理解)',
      items: [
        { q: '①「{分|わ}かったつもりになる」とあるが、どういうことか。', options: ['{説明|せつめい}を{全部|ぜんぶ}{覚|おぼ}えてしまうこと', '{本当|ほんとう}は{十分|じゅうぶん}に{理解|りかい}していないのに、{理解|りかい}したと{思|おも}うこと', '{分|わ}からないことを{先生|せんせい}に{質問|しつもん}すること', '{理解|りかい}したことをすぐにレポートに{書|か}けること'], correct: 1, why: '**～つもりになる** = tưởng là đã… (mà thực tế chưa). Câu sau xác nhận: đến lúc viết thì **{手|て}が{止|と}まってしまう**.' },
        { q: '{筆者|ひっしゃ}によると、{書|か}こうとすると{手|て}が{止|と}まるのはなぜか。', options: ['{授業|じゅぎょう}の{内容|ないよう}が{難|むずか}しすぎるから', '{字数|じすう}が{多|おお}すぎるから', '{何|なに}をどの{順序|じゅんじょ}で{述|の}べるかを、すべて{自分|じぶん}で{決|き}めなければならないから', '{話|はな}し{手|て}の{説明|せつめい}が{分|わ}かりにくいから'], correct: 2, why: 'Đoạn ②: **{書|か}く{時|とき}は、{何|なに}から{述|の}べ、どの{根拠|こんきょ}を{使|つか}い、どこで{結論|けつろん}を{出|だ}すのかを、すべて{自分|じぶん}で{決|き}めねばならない** (ねばならない = なければならない).' },
        { q: '③の{学生|がくせい}の{経験|けいけん}について、{筆者|ひっしゃ}はどう{考|かんが}えているか。', options: ['{最初|さいしょ}に{考|かんが}えをしっかり{決|き}めなかった{失敗|しっぱい}だ', '{書|か}くことで{考|かんが}えが{深|ふか}まったことを{示|しめ}している', 'レポートの{評価|ひょうか}が{下|さ}がる{原因|げんいん}になる', '{書|か}く{前|まえ}に{先生|せんせい}に{相談|そうだん}すべきだった'], correct: 1, why: '**{私|わたし}はそうは{思|おも}わない。むしろ、それは{書|か}くことによって{考|かんが}えが{深|ふか}まった{証拠|しょうこ}である**. Đáp án 1 là điều tác giả phủ định.' },
        { q: 'この{文章|ぶんしょう}で{筆者|ひっしゃ}が{最|もっと}も{言|い}いたいことは{何|なん}か。', options: ['レポートは、{字数|じすう}と{形式|けいしき}を{守|まも}ることが{一番|いちばん}{大切|たいせつ}だ', 'レポートは、{一度|いちど}で{完成|かんせい}させるべきだ', 'レポートは、{自分|じぶん}の{考|かんが}えを{確|たし}かめ、{組|く}み{立|た}て{直|なお}す{機会|きかい}として{書|か}くべきだ', 'レポートは、{評価|ひょうか}されないほうが{学生|がくせい}のためになる'], correct: 2, why: 'Đoạn ④ (**しかし**…**{最|もっと}も{重視|じゅうし}すべきなのは**…**{経験|けいけん}そのもの**) + ⑤ (**{分|わ}かったつもりを{壊|こわ}すために{書|か}く**). Đáp án 1 là phần nhượng bộ (もちろん); 2 trái với ⑤; 4 tác giả không nói.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b52-noi',
  kind: 'speaking',
  title: 'Luyện nói — trả lời giám thị về cách viết báo cáo, khác biệt レポート ↔ 報告書, "sinh viên có nên đi làm thêm", dùng AI khi viết bài; trình bày 1 phút "Cách tôi viết một bản báo cáo"; đọc to đoạn văn viết thể である',
  goal: 'Trả lời câu hỏi của giám thị theo khuôn "kết luận → lý do có căn cứ (～上で・～面で) → ví dụ thật → câu chốt"; nêu chủ trương bằng ～べきだと思います một cách lịch sự (không ra lệnh cho người nghe), đáp lại phản biện bằng 確かに～。ですから～べきだと思います; trình bày 1 phút về quy trình viết báo cáo có từ nối thứ tự (まず・次に・最後に) và ～た上で; đọc to đoạn văn thể である đúng nhịp, đúng trường âm và âm ngắt.',
  minutes: 50,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) nâng lên N2 — chủ đề Bài 52 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 52 xuất hiện ở đâu'],
      rows: [
        ['Reading', '30', 'Chuẩn bị 30 giây, đọc to đoạn ~170 chữ.', 'Đoạn "Báo cáo không phải bài cảm tưởng": thể である · ～た{上|うえ}で · ～なければならない · ～べきである · ～ではないだろうか'],
        ['Talking — có tranh', '3 × 10', 'Nhìn tranh (bản báo cáo đầy vết đỏ, biểu đồ khảo sát, hai người tranh luận) trả lời 2–3 ý.', 'この{人|ひと}は{何|なに}を{直|なお}されていると{思|おも}いますか · このグラフからどんなことが{分|わ}かりますか'],
        ['Talking — không tranh', '2 × 10', 'Trả lời câu hỏi có lý do + ví dụ.', 'レポートを{書|か}く{時|とき}、{何|なに}に{気|き}をつけていますか · {大学生|だいがくせい}はアルバイトをすべきだと{思|おも}いますか'],
        ['Presenting / Discussion (N2)', '20', 'Trình bày 1 phút, hoặc thảo luận với giám thị (giám thị phản biện).', 'Trình bày「{私|わたし}のレポートの{書|か}き{方|かた}」 — dàn ý bên dưới · Phản biện: 「でも、{生活|せいかつ}のために{働|はたら}かざるを{得|え}ない{学生|がくせい}もいますよね」'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 52 (cấp N2 — "có căn cứ, có mặt, có điều kiện")',
      items: [
        '**Ý 1 — kết luận trước**: **{一番|いちばん}{気|き}をつけているのは～です** · **{私|わたし}は、～べきだと{思|おも}います** · **{一番|いちばん}の{違|ちが}いは～だと{思|おも}います**.',
        '**Ý 2 — lý do theo mặt**: **～の{面|めん}で（も）～からです** · **～る{上|うえ}で～だからです** · tránh lý do chung chung ("{大切|たいせつ}だから") — giám thị N2 chấm cao **lý do cụ thể**.',
        '**Ý 3 — ví dụ thật**: **{以前|いぜん}、～と{言|い}われたことがあります** · **それからは、～ようにしています** (ôn Bài 21) — một câu chuyện nhỏ của chính bạn.',
        '**Ý 4 — điều kiện / câu chốt**: **ただ、～はやめたほうがいいと{思|おも}います** · **～{範囲|はんい}でなら** — chủ trương có điều kiện nghe chín chắn hơn.',
        '**⚠ べきだ khi NÓI với giám thị**: nêu **ý kiến của mình về xã hội, sinh viên, trường** thì được (**～すべきだと{思|おも}います**); nhưng **không** dùng べきだ để bảo **giám thị** làm gì. Giám thị phản biện → **{確|たし}かにそうですね。ですから、～べきだと{思|おも}います**.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — giám thị ↔ thí sinh',
      lines: [
        { who: '{試験官|しけんかん}', role: 'examiner', text: 'レポートを{書|か}く{時|とき}、{何|なに}に{一番|いちばん}{気|き}をつけていますか。', ro: 'Repooto o kaku toki, nani ni ichiban ki o tsukete imasu ka.', vi: 'Khi viết báo cáo, bạn chú ý nhất điều gì?' },
        { who: 'Bạn', role: 'candidate', text: '{一番|いちばん}{気|き}をつけているのは、{意見|いけん}を{書|か}く{時|とき}に{必|かなら}ず{根拠|こんきょ}を{示|しめ}すことです。{以前|いぜん}は{感想|かんそう}ばかり{書|か}いてしまって、{先生|せんせい}に「データを{示|しめ}した{上|うえ}で{論|ろん}じなさい」と{言|い}われました。それからは、{意見|いけん}を{一|ひと}つ{書|か}いたら、データか{引用|いんよう}を{一|ひと}つつけるようにしています。', ro: 'Ichiban ki o tsukete iru no wa, iken o kaku toki ni kanarazu konkyo o shimesu koto desu. Izen wa kansou bakari kaite shimatte, sensei ni "deeta o shimeshita ue de ronjinasai" to iwaremashita. Sore kara wa, iken o hitotsu kaitara, deeta ka in\'you o hitotsu tsukeru you ni shite imasu.', vi: 'Điều tôi chú ý nhất là khi viết ý kiến thì nhất định đưa ra căn cứ. Trước đây tôi toàn viết cảm tưởng, bị thầy nhắc "Hãy đưa số liệu ra rồi mới bàn luận". Từ đó, cứ viết một ý kiến là tôi kèm một số liệu hoặc một trích dẫn.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{大学|だいがく}のレポートと{会社|かいしゃ}の{報告書|ほうこくしょ}は、どう{違|ちが}うと{思|おも}いますか。', ro: 'Daigaku no repooto to kaisha no houkokusho wa, dou chigau to omoimasu ka.', vi: 'Bạn nghĩ báo cáo ở trường đại học và báo cáo ở công ty khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{一番|いちばん}の{違|ちが}いは、{結論|けつろん}の{位置|いち}だと{思|おも}います。レポートは{序論|じょろん}から{順番|じゅんばん}に{書|か}きますが、{報告書|ほうこくしょ}は{結論|けつろん}を{最初|さいしょ}に{書|か}くべきだと{聞|き}きました。{読|よ}む{人|ひと}は{忙|いそが}しいので、{時間|じかん}の{面|めん}でも、そのほうがいいと{思|おも}います。', ro: 'Ichiban no chigai wa, ketsuron no ichi da to omoimasu. Repooto wa joron kara junban ni kakimasu ga, houkokusho wa ketsuron o saisho ni kaku beki da to kikimashita. Yomu hito wa isogashii node, jikan no men demo, sono hou ga ii to omoimasu.', vi: 'Tôi nghĩ khác biệt lớn nhất là vị trí của kết luận. Báo cáo ở trường thì viết theo thứ tự từ phần mở đầu, còn báo cáo công việc thì nghe nói nên viết kết luận trước. Người đọc bận nên xét về mặt thời gian, cách đó cũng tốt hơn.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{大学生|だいがくせい}はアルバイトをすべきだと{思|おも}いますか。', ro: 'Daigakusei wa arubaito o subeki da to omoimasu ka.', vi: 'Bạn có nghĩ sinh viên đại học nên đi làm thêm không?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}は、{学業|がくぎょう}に{影響|えいきょう}が{出|で}ない{範囲|はんい}でならすべきだと{思|おも}います。{経済的|けいざいてき}な{面|めん}で{助|たす}かるだけでなく、{社会|しゃかい}のルールを{学|まな}ぶ{上|うえ}でもいい{経験|けいけん}になるからです。ただ、{週|しゅう}に{二十時間|にじゅうじかん}{以上|いじょう}{働|はたら}くのは、やめたほうがいいと{思|おも}います。', ro: 'Watashi wa, gakugyou ni eikyou ga denai han\'i de nara subeki da to omoimasu. Keizaiteki na men de tasukaru dake de naku, shakai no ruuru o manabu ue de mo ii keiken ni naru kara desu. Tada, shuu ni nijuujikan ijou hataraku no wa, yameta hou ga ii to omoimasu.', vi: 'Tôi nghĩ nên làm, nếu trong phạm vi không ảnh hưởng đến việc học. Vì không chỉ đỡ về mặt kinh tế mà còn là trải nghiệm tốt để học các quy tắc của xã hội. Có điều, làm trên hai mươi tiếng một tuần thì tốt hơn là không nên.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: 'でも、{生活|せいかつ}のために{働|はたら}かざるを{得|え}ない{学生|がくせい}もいますよね。', ro: 'Demo, seikatsu no tame ni hatarakazaru o enai gakusei mo imasu yo ne.', vi: 'Nhưng cũng có sinh viên buộc phải đi làm để sống chứ?' },
        { who: 'Bạn', role: 'candidate', text: '{確|たし}かにそうですね。ですから、{大学|だいがく}や{国|くに}は、{奨学金|しょうがくきん}などで、そういう{学生|がくせい}をもっと{支援|しえん}すべきだと{思|おも}います。', ro: 'Tashika ni sou desu ne. Desu kara, daigaku ya kuni wa, shougakukin nado de, sou iu gakusei o motto shien subeki da to omoimasu.', vi: 'Đúng là như vậy. Vì thế tôi nghĩ trường và nhà nước nên hỗ trợ những sinh viên đó nhiều hơn, bằng học bổng chẳng hạn.' },
      ],
    },
    {
      t: 'phatam',
      id: 'b52-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 12 câu hay dùng của Bài 52',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý trường âm: こ・う・せ・い, ぼ・う・と・う, じょ・う・ほ・う; âm ngắt: し・っ・ぴ・つ, しゅ・っ・て・ん, て・っ・て・い; ん trước nguyên âm: は・ん・い (han-i — đừng đọc "ha-ni"); うえで (u-e de) — "ue" hai âm rõ, không nuốt thành "ủe".',
      items: [
        { text: 'データを{示|しめ}した{上|うえ}で、{自分|じぶん}の{考|かんが}えを{述|の}べます。', ipa: 'deeta o shimeshita ue de, jibun no kangae o nobemasu', vi: 'Tôi đưa số liệu ra rồi mới trình bày ý kiến của mình.' },
        { text: '{日本|にほん}で{働|はたら}く{上|うえ}で、{敬語|けいご}は{欠|か}かせません。', ipa: 'nihon de hataraku ue de, keigo wa kakasemasen', vi: 'Khi làm việc ở Nhật, kính ngữ là không thể thiếu.' },
        { text: '{費用|ひよう}の{面|めん}では{問題|もんだい}ありませんが、{安全面|あんぜんめん}に{不安|ふあん}があります。', ipa: 'hiyou no men de wa mondai arimasen ga, anzenmen ni fuan ga arimasu', vi: 'Về mặt chi phí thì không vấn đề gì, nhưng về an toàn thì còn lo ngại.' },
        { text: '{使|つか}いやすいという{点|てん}で、こちらのほうが{優|すぐ}れています。', ipa: 'tsukaiyasui to iu ten de, kochira no hou ga sugurete imasu', vi: 'Ở điểm dễ sử dụng, cái này vượt trội hơn.' },
        { text: 'この{調査|ちょうさ}の{目的|もくてき}は、{留学生|りゅうがくせい}の{悩|なや}みを{明|あき}らかにすることである。', ipa: 'kono chousa no mokuteki wa, ryuugakusei no nayami o akiraka ni suru koto de aru', vi: 'Mục đích của khảo sát này là làm rõ khó khăn của du học sinh.' },
        { text: '{結果|けっか}は{予想|よそう}と{大|おお}きく{異|こと}なっていた。', ipa: 'kekka wa yosou to ookiku kotonatte ita', vi: 'Kết quả đã khác nhiều so với dự đoán.' },
        { text: '{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきです。', ipa: 'ketsuron wa boutou ni kaku beki desu', vi: 'Kết luận nên viết ở phần đầu.' },
        { text: '{他人|たにん}の{文章|ぶんしょう}を、{出典|しゅってん}を{書|か}かずに{使|つか}うべきではありません。', ipa: 'tanin no bunshou o, shutten o kakazu ni tsukau beki de wa arimasen', vi: 'Không nên dùng bài viết của người khác mà không ghi nguồn.' },
        { text: '{我々|われわれ}はこの{問題|もんだい}を{真剣|しんけん}に{考|かんが}えねばならない。', ipa: 'wareware wa kono mondai o shinken ni kangaeneba naranai', vi: 'Chúng ta phải suy nghĩ nghiêm túc về vấn đề này.' },
        { text: '{先行研究|せんこうけんきゅう}を{読|よ}む{上|うえ}で{大切|たいせつ}なのは、{違|ちが}いを{考|かんが}えることです。', ipa: 'senkou kenkyuu o yomu ue de taisetsu na no wa, chigai o kangaeru koto desu', vi: 'Điều quan trọng khi đọc nghiên cứu đi trước là nghĩ về chỗ khác biệt.' },
        { text: '{文体|ぶんたい}を{統一|とういつ}して、{要点|ようてん}を{簡潔|かんけつ}にまとめます。', ipa: 'buntai o touitsu shite, youten o kanketsu ni matomemasu', vi: 'Thống nhất văn phong và tóm ý chính ngắn gọn.' },
        { text: '{以上|いじょう}のことから、{使|つか}い{方|かた}を{指導|しどう}すべきだと{考|かんが}えられる。', ipa: 'ijou no koto kara, tsukaikata o shidou subeki da to kangaerareru', vi: 'Từ những điều trên, có thể cho rằng nên hướng dẫn cách sử dụng.' },
      ],
    },
    {
      t: 'note',
      title: 'Trình bày 1 phút (できる！) — dàn ý + bài mẫu "{私|わたし}のレポートの{書|か}き{方|かた}"',
      items: [
        '**Dàn ý 5 bước (≈ 9–10 câu, 330–360 chữ nói)**: ① **Giới thiệu** — {今日|きょう}は、{私|わたし}がレポートを{書|か}く{時|とき}の{手順|てじゅん}についてお{話|はな}しします → ② **まず** (đọc tài liệu → ～た{上|うえ}で quyết định mục đích) → ③ **{次|つぎ}に** (dàn bố cục, thân bài: dữ liệu → ý kiến) → ④ **{書|か}き{終|お}わったら／{最後|さいご}に** (soát văn phong + nguồn — ～の{面|めん}で) → ⑤ **Câu chốt** (～{上|うえ}で{一番|いちばん}{大切|たいせつ}なのは～だと{思|おも}います).',
        '{今日|きょう}は、{私|わたし}がレポートを{書|か}く{時|とき}の{手順|てじゅん}についてお{話|はな}しします。まず、{書|か}き{始|はじ}める{前|まえ}に、テーマに{関|かん}する{本|ほん}や{論文|ろんぶん}を{読|よ}みます。{先行研究|せんこうけんきゅう}を{読|よ}んだ{上|うえ}で、{自分|じぶん}が{何|なに}を{明|あき}らかにしたいのかを{決|き}めます。{次|つぎ}に、{序論|じょろん}・{本論|ほんろん}・{結論|けつろん}の{構成|こうせい}を{簡単|かんたん}なメモにします。{本論|ほんろん}では、データを{示|しめ}した{上|うえ}で、{自分|じぶん}の{考|かんが}えを{述|の}べるようにしています。{書|か}き{終|お}わったら、{文体|ぶんたい}の{面|めん}で{問題|もんだい}がないか、{必|かなら}ず{確認|かくにん}します。{私|わたし}の{文章|ぶんしょう}には、{話|はな}し{言葉|ことば}がよく{混|ま}じってしまうからです。{最後|さいご}に、{出典|しゅってん}がきちんと{書|か}いてあるかを{見直|みなお}します。レポートを{書|か}く{上|うえ}で{一番|いちばん}{大切|たいせつ}なのは、{自分|じぶん}の{考|かんが}えに{根拠|こんきょ}を{持|も}たせることだと{思|おも}います。',
        'Romaji: Kyou wa, watashi ga repooto o kaku toki no tejun ni tsuite ohanashi shimasu. Mazu, kakihajimeru mae ni, teema ni kansuru hon ya ronbun o yomimasu. Senkou kenkyuu o yonda ue de, jibun ga nani o akiraka ni shitai no ka o kimemasu. Tsugi ni, joron, honron, ketsuron no kousei o kantan na memo ni shimasu. Honron de wa, deeta o shimeshita ue de, jibun no kangae o noberu you ni shite imasu. Kakiowattara, buntai no men de mondai ga nai ka, kanarazu kakunin shimasu. Watashi no bunshou ni wa, hanashikotoba ga yoku majitte shimau kara desu. Saigo ni, shutten ga kichinto kaite aru ka o minaoshimasu. Repooto o kaku ue de ichiban taisetsu na no wa, jibun no kangae ni konkyo o motaseru koto da to omoimasu.',
        'Nghĩa: Hôm nay tôi xin nói về trình tự khi tôi viết một bản báo cáo. Trước hết, trước khi bắt đầu viết, tôi đọc sách và bài báo khoa học liên quan tới đề tài. Đọc các nghiên cứu đi trước rồi, tôi mới quyết định mình muốn làm rõ điều gì. Tiếp theo, tôi ghi bố cục mở đầu – thân bài – kết luận thành một bản ghi chú đơn giản. Ở thân bài, tôi cố gắng đưa số liệu ra rồi mới trình bày ý kiến của mình. Viết xong, tôi nhất định kiểm tra xem về mặt văn phong có vấn đề gì không, vì văn của tôi hay bị lẫn văn nói. Cuối cùng, tôi soát lại xem nguồn trích đã ghi đầy đủ chưa. Tôi nghĩ điều quan trọng nhất khi viết báo cáo là làm cho ý kiến của mình có căn cứ.',
        'Chỗ dễ vấp khi nói: **{手順|てじゅん}** (te-ju-n) · **{先行研究|せんこうけんきゅう}** (se-n-ko-u-ke-n-kyu-u — ba trường âm) · **{読|よ}んだ{上|うえ}で** (yo-n-da u-e de) · **{構成|こうせい}** (ko-u-se-i) · **{示|しめ}した{上|うえ}で** · **{出典|しゅってん}** (shu-t-te-n — âm ngắt) · **{持|も}たせる** (mo-ta-se-ru — thể sai khiến của 持つ).',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 30 điểm) — đoạn mẫu 50 giây (thể である)',
      items: [
        'レポートは、{感想文|かんそうぶん}ではない。{自分|じぶん}の{主張|しゅちょう}を、{根拠|こんきょ}とともに{示|しめ}す{文章|ぶんしょう}である。そのためには、{資料|しりょう}をよく{読|よ}んだ{上|うえ}で、{何|なに}を{論|ろん}じるのかを{決|き}めなければならない。{書|か}き{終|お}わったら、{文体|ぶんたい}の{面|めん}でも{内容|ないよう}の{面|めん}でも、もう{一度|いちど}{見直|みなお}すべきである。{分|わ}かったつもりを{壊|こわ}し、{考|かんが}えを{組|く}み{立|た}て{直|なお}すこと。それが、{書|か}くことの{本当|ほんとう}の{意味|いみ}ではないだろうか。',
        'Romaji: Repooto wa, kansoubun de wa nai. Jibun no shuchou o, konkyo to tomo ni shimesu bunshou de aru. Sono tame ni wa, shiryou o yoku yonda ue de, nani o ronjiru no ka o kimenakereba naranai. Kakiowattara, buntai no men de mo naiyou no men de mo, mou ichido minaosu beki de aru. Wakatta tsumori o kowashi, kangae o kumitatenaosu koto. Sore ga, kaku koto no hontou no imi de wa nai darou ka.',
        'Nghĩa: Báo cáo không phải bài cảm tưởng. Nó là bài văn trình bày chủ trương của mình kèm theo căn cứ. Muốn vậy, phải đọc kỹ tư liệu rồi mới quyết định sẽ bàn luận điều gì. Viết xong, nên soát lại một lần nữa cả về văn phong lẫn nội dung. Phá vỡ cái "tưởng là đã hiểu", dựng lại suy nghĩ của mình — đó chẳng phải là ý nghĩa thật sự của việc viết sao?',
        'Chỗ dễ vấp: **{感想文|かんそうぶん}** (ka-n-so-u-bu-n) · **{根拠|こんきょ}とともに** (ko-n-kyo to to-mo ni) · **{文章|ぶんしょう}である** (bu-n-sho-u de a-ru — "de aru" đọc tách hai nhịp) · **{読|よ}んだ{上|うえ}で** · **{見直|みなお}すべきである** (mi-na-o-su be-ki de a-ru) · **{組|く}み{立|た}て{直|なお}す** (ku-mi-ta-te-na-o-su) · ngữ điệu câu cuối **ではないだろうか** hạ giọng, không lên giọng như câu hỏi thường.',
      ],
    },
    {
      t: 'speak',
      id: 'b52-noi-ghi-am',
      part: '1',
      questions: [
        'レポートを かく とき、 なにに いちばん きを つけて いますか。',
        'だいがくの レポートと かいしゃの ほうこくしょは、 どう ちがうと おもいますか。',
        'だいがくせいは アルバイトを すべきだと おもいますか。 りゆうも いって ください。',
        'レポートを かく ときに AIを つかう ことに ついて、 どう おもいますか。',
        'にほんで せいかつする うえで、 いちばん たいせつな ことは なんですか。',
        '「わたしの レポートの かきかた」に ついて 1ぷんで はなして ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b52-viet',
  kind: 'writing',
  title: 'Viết レポート — bố cục 序論・本論・結論, từ nối văn viết, cách trích dẫn + danh mục tài liệu, bảng văn nói → văn viết (35 cặp), văn kết câu của báo cáo, bài mẫu ~900 chữ, đề viết 800–1.200 chữ + tiêu chí tự chấm',
  goal: 'Viết một bản レポート 800–1.200 chữ thể だ・である có đủ 序論 (bối cảnh · câu hỏi · mục đích · báo trước bố cục) → 本論 (phương pháp · kết quả có số liệu · 考察) → 結論 (tóm tắt · chủ trương · giới hạn & hướng tiếp) → 参考文献; dùng đúng từ nối theo chức năng; trích dẫn trực tiếp「」và gián tiếp (～によると・～と述べている・～と指摘している) có ghi nguồn (tác giả, năm, trang) và danh mục tài liệu đúng khuôn; đổi văn nói sang văn viết (でも→しかし, すごく→非常に, ～けど→～が…); kết câu bằng văn kết câu của báo cáo (～と考えられる・～と言える・～が明らかになった・～べきである); tự chấm bài theo 5 tiêu chí.',
  minutes: 90,
  blocks: [
    {
      t: 'p',
      text: 'Đây là **mục nặng nhất của Bài 52**. Ở đại học Nhật, điểm môn học phần lớn đến từ **{期末|きまつ}レポート**; khi tốt nghiệp là **{卒論|そつろん}**; đi làm thì **{報告書|ほうこくしょ}**. Một bản レポート tốt **không cần văn hay** — nó cần **đúng khuôn**: có **câu hỏi rõ**, có **số liệu / tài liệu làm căn cứ**, **phân biệt rõ ý người khác (trích dẫn) và ý mình (考察)**, và **văn phong だ・である nhất quán**. Mục này đi theo thứ tự: **(1)** レポート khác bài cảm tưởng, bài văn thế nào → **(2)** bố cục 5 phần → **(3)** từ nối văn viết → **(4)** cách trích dẫn → **(5)** bảng văn nói → văn viết → **(6)** văn kết câu → **(7)** bài mẫu ~900 chữ (phân tích từng đoạn) → **(8)** bài tập chuyển văn → **(9)** đề viết + tiêu chí tự chấm.',
    },
    {
      t: 'table',
      caption: '(1) レポート ≠ 感想文 ≠ 作文 — đừng viết nhầm loại',
      head: ['Loại', 'Mục đích', 'Câu điển hình', 'Văn phong'],
      rows: [
        ['**レポート**／{論文|ろんぶん}', 'Trả lời một CÂU HỎI bằng CĂN CỨ (số liệu, tài liệu) — người đọc phải được thuyết phục', '～が{明|あき}らかになった。～と{考|かんが}えられる。', 'だ・である, khách quan, không cảm xúc'],
        ['{感想文|かんそうぶん}', 'Kể CẢM NGHĨ của bản thân sau khi đọc / xem / trải nghiệm', '～と{感|かん}じた。とても{感動|かんどう}した。', 'thường です・ます hoặc thể thường, chủ quan'],
        ['{作文|さくぶん}', 'Kể / tả một trải nghiệm, bày tỏ suy nghĩ (bài văn ở trường, đề thi viết)', '{私|わたし}は～と{思|おも}う。～ことを{学|まな}んだ。', 'tuỳ đề; được dùng {私|わたし}, kể chuyện'],
        ['{報告書|ほうこくしょ}', 'Báo cho cấp trên KẾT QUẢ một việc để họ quyết định', '{結論|けつろん}から{述|の}べると、～。', 'だ・である hoặc です・ます (theo quy định công ty), kết luận TRƯỚC'],
      ],
    },
    {
      t: 'table',
      caption: '(2) Bố cục một bản レポート (800–3.000 chữ) — 5 phần',
      head: ['Phần', 'Viết gì', 'Câu mẫu', 'Tỉ lệ'],
      rows: [
        ['{表紙|ひょうし}／タイトル', 'Tên bài (có thể thêm tiêu đề phụ sau ―), môn học, họ tên, mã số SV, ngày nộp', '{留学生|りゅうがくせい}の{翻訳|ほんやく}アプリ{利用|りよう}と{日本語学習|にほんごがくしゅう} ―アンケート{調査|ちょうさ}から―', '—'],
        ['① {序論|じょろん}（はじめに）', 'Bối cảnh → CÂU HỎI của bài → mục đích → báo trước bố cục', '{近年|きんねん}、～。では、～だろうか。{本|ほん}レポートでは、～を{考察|こうさつ}する。まず～、{次|つぎ}に～、{最後|さいご}に～。', '~15%'],
        ['② {本論|ほんろん} — {方法|ほうほう}・{結果|けっか}', 'Làm gì, với ai, khi nào, bao nhiêu người → số liệu (có bảng / biểu đồ, có nguồn)', '～を{対象|たいしょう}に、～を{行|おこな}った。その{結果|けっか}、～であった（{図|ず}1）。', '~30%'],
        ['③ {本論|ほんろん} — {考察|こうさつ}', 'Số liệu NÓI LÊN điều gì; so với tài liệu khác (trích dẫn); lý do', '{以上|いじょう}の{結果|けっか}から、～ことが{分|わ}かる。～（{山田|やまだ} 2023）は～と{述|の}べている。したがって、～と{考|かんが}えられる。', '~35%'],
        ['④ {結論|けつろん}（おわりに）', 'Tóm tắt điều đã làm rõ → chủ trương → GIỚI HẠN của bài → hướng nghiên cứu tiếp', '{本|ほん}レポートでは、～を{考察|こうさつ}した。その{結果|けっか}、～が{明|あき}らかになった。ただし、～。{今後|こんご}は～{必要|ひつよう}がある。', '~20%'],
        ['⑤ {参考文献|さんこうぶんけん}', 'Mọi tài liệu đã trích, xếp theo tên tác giả', '{山田花子|やまだはなこ}（2023）『{書名|しょめい}』{出版社|しゅっぱんしゃ}', '—'],
      ],
    },
    {
      t: 'note',
      title: 'Ba quy tắc vàng của bố cục',
      items: [
        '**Một câu hỏi — một câu trả lời.** Câu hỏi đặt ở {序論|じょろん} (**～だろうか**) phải được **trả lời** ở {結論|けつろん} (**～が{明|あき}らかになった／～と{考|かんが}えられる**). Đọc {序論|じょろん} và {結論|けつろん} liền nhau mà khớp là bố cục đúng.',
        '**Kết quả ≠ 考察.** Phần kết quả chỉ **nêu số liệu** (～であった・～と{答|こた}えた); phần {考察|こうさつ} mới **giải thích** (～ことが{分|わ}かる・～と{考|かんが}えられる). Trộn hai phần là lỗi số một của sinh viên năm nhất.',
        '**Câu báo trước bố cục** ở cuối {序論|じょろん} (**まず～、{次|つぎ}に～、{最後|さいご}に～**) giúp giảng viên đọc nhanh — và bắt bạn tự kiểm tra bài có đủ phần chưa.',
      ],
    },
    {
      t: 'table',
      caption: '(3) Từ nối văn viết — theo chức năng',
      head: ['Chức năng', 'Từ nối (văn viết)', 'Ví dụ', 'Tránh (văn nói)'],
      rows: [
        ['Thứ tự', 'まず・{次|つぎ}に・さらに・{最後|さいご}に · {第一|だいいち}に・{第二|だいに}に', 'まず{調査|ちょうさ}の{方法|ほうほう}を{述|の}べる。{次|つぎ}に{結果|けっか}を{示|しめ}す。', 'それで・で・あと'],
        ['Thêm ý', 'また・さらに・{加|くわ}えて・その{上|うえ}', 'また、{回答者|かいとうしゃ}の{半数|はんすう}は{一年生|いちねんせい}であった。', 'それに・あと (văn nói)'],
        ['Đối lập', 'しかし・だが・{一方|いっぽう}・それに{対|たい}して', 'しかし、{確認|かくにん}する{学生|がくせい}は{少|すく}なかった。', 'でも・だけど・けど'],
        ['Nhượng bộ → khẳng định', '{確|たし}かに～。しかし～ · もちろん～。だが～', '{確|たし}かにアプリは{便利|べんり}である。しかし、～。', '—'],
        ['Nguyên nhân → kết quả', 'そのため・したがって・その{結果|けっか}・ゆえに (rất cứng)', 'したがって、{確認|かくにん}の{段階|だんかい}を{加|くわ}える{必要|ひつよう}がある。', 'だから・なので'],
        ['Nói lại, tóm lại', 'つまり・すなわち・{言|い}い{換|か}えれば', 'すなわち、{問題|もんだい}は{使|つか}い{方|かた}にある。', 'ってことは・要は'],
        ['Ví dụ', '{例|たと}えば・{具体的|ぐたいてき}には', '{具体的|ぐたいてき}には、{次|つぎ}の{三点|さんてん}である。', 'たとえばさ・とか'],
        ['Lưu ý, ngoại lệ', 'なお・ただし', 'なお、{回答|かいとう}は{匿名|とくめい}とした。', 'ちなみに (văn nói)'],
        ['Kết luận', '{以上|いじょう}のことから・このように・{以上|いじょう}をまとめると', '{以上|いじょう}のことから、～と{考|かんが}えられる。', 'というわけで・結局'],
      ],
    },
    {
      t: 'table',
      caption: '(4) Cách trích dẫn (引用) và ghi nguồn',
      head: ['Kiểu', 'Khuôn', 'Ví dụ (tên tác giả, năm là minh hoạ)', 'Lưu ý'],
      rows: [
        ['{直接引用|ちょくせついんよう} — ngắn', '{著者|ちょしゃ}（{年|ねん}）は「～」と{述|の}べている。 · 「～」（{著者|ちょしゃ} {年|ねん}: ページ）', '{山田|やまだ}（2023）は「{道具|どうぐ}に{頼|たよ}ること{自体|じたい}が{問題|もんだい}なのではない」と{述|の}べている。', 'Giữ NGUYÊN chữ, kể cả chữ cổ (ねばならない); ghi trang nếu có'],
        ['{直接引用|ちょくせついんよう} — dài (≥ 3 dòng)', 'Tách thành đoạn riêng, lùi vào 2 chữ, không dùng 「」, ghi nguồn cuối đoạn', '（đoạn trích lùi vào）……（{山田|やまだ} 2023: 45）', 'Dùng ít — trích dài nhiều = bài của người khác'],
        ['{間接引用|かんせついんよう} — tóm ý', '{著者|ちょしゃ}（{年|ねん}）によると、～という。 · {著者|ちょしゃ}（{年|ねん}）は、～と{指摘|してき}している。 · ～とされている（{著者|ちょしゃ} {年|ねん}）。', '{山田|やまだ}（2023）は、{道具|どうぐ}を{使|つか}った{後|あと}に{考|かんが}えないことが{問題|もんだい}だと{指摘|してき}している。', 'Viết lại bằng lời mình — vẫn PHẢI ghi nguồn'],
        ['Danh mục — sách', '{著者名|ちょしゃめい}（{出版年|しゅっぱんねん}）『{書名|しょめい}』{出版社|しゅっぱんしゃ}', '{山田花子|やまだはなこ}（2023）『{道具|どうぐ}と{学|まな}びの{間|あいだ}で』みなと{出版|しゅっぱん}', 'Tên sách để trong 『』'],
        ['Danh mục — bài báo khoa học', '{著者名|ちょしゃめい}（{年|ねん}）「{論文名|ろんぶんめい}」『{雑誌名|ざっしめい}』{巻|かん}（{号|ごう}）, ページ', '{田中一郎|たなかいちろう}（2021）「～」『{日本語教育研究|にほんごきょういくけんきゅう}』12（3）, 20–35', 'Tên bài trong 「」, tên tạp chí trong 『』'],
        ['Danh mục — trang web', '{作成者|さくせいしゃ}「ページ{名|めい}」サイト{名|めい}, URL（{閲覧日|えつらんび}）', '○○{市|し}「{留学生|りゅうがくせい}の{皆様|みなさま}へ」○○{市|し}ホームページ, https://…（2025{年|ねん}10{月|がつ}1{日|ついたち}{閲覧|えつらん}）', 'Ghi ngày xem — trang web có thể đổi'],
      ],
    },
    {
      t: 'note',
      title: 'Đạo đức trích dẫn (研究倫理) — phải nhớ',
      items: [
        '**Chép câu của người khác mà không ghi nguồn = {盗用|とうよう}（{剽窃|ひょうせつ}）** — kể cả khi bạn sửa vài chữ. Nhiều trường cho **0 điểm cả môn**. Câu nào **không phải ý của bạn** thì phải có nguồn — dù là trích nguyên văn hay tóm ý.',
        '**Phân biệt rõ** ý người khác và ý mình: sau mỗi trích dẫn, viết một câu **của bạn** (**この{指摘|してき}は、{今回|こんかい}の{結果|けっか}とも{一致|いっち}する・しかし、{本調査|ほんちょうさ}では～**) — đúng điều nhân viên thư viện nói ở bài nghe 3.',
        '**Không trích "lại"** (孫引き) khi có thể đọc tài liệu gốc. **Không bịa** nguồn, số trang, năm. Khi dùng AI hay công cụ dịch, ghi rõ đã dùng ở đâu nếu trường yêu cầu (xem bài đọc 2).',
        '⚠ Tên tác giả, tên sách, số liệu trong **mọi bài mẫu của khoá này** là **giả định để học** (ghi 〔架空〕) — **không được** đưa vào bài của bạn như nguồn thật.',
      ],
    },
    {
      t: 'table',
      caption: '(5) ⭐ Bảng văn nói → văn viết (học thuộc — giảng viên Nhật gạch đỏ đúng những chữ này)',
      head: ['Văn nói', 'Văn viết', 'Ví dụ văn viết', 'Romaji'],
      rows: [
        ['でも、～', 'しかし、～／だが、～', 'しかし、{問題|もんだい}も{残|のこ}る。', 'Shikashi, mondai mo nokoru.'],
        ['だから、～／なので、～', 'したがって、～／そのため、～', 'したがって、{対策|たいさく}が{必要|ひつよう}である。', 'Shitagatte, taisaku ga hitsuyou de aru.'],
        ['～けど、～', '～が、～', '{調査|ちょうさ}を{行|おこな}ったが、{回答|かいとう}は{少|すく}なかった。', 'Chousa o okonatta ga, kaitou wa sukunakatta.'],
        ['～から（lý do）', '～ため', '{時間|じかん}が{不足|ふそく}しているため、～。', 'Jikan ga fusoku shite iru tame, ~.'],
        ['すごく／とても', '{非常|ひじょう}に／きわめて', '{非常|ひじょう}に{重要|じゅうよう}である。', 'Hijou ni juuyou de aru.'],
        ['ちょっと', '{少|すこ}し／やや', 'やや{意外|いがい}な{結果|けっか}であった。', 'Yaya igai na kekka de atta.'],
        ['たくさん／いっぱい', '{多|おお}く／{多数|たすう}', '{多|おお}くの{学生|がくせい}が～と{答|こた}えた。', 'Ooku no gakusei ga ~ to kotaeta.'],
        ['ちゃんと', 'きちんと／{適切|てきせつ}に', '{出典|しゅってん}をきちんと{示|しめ}す。', 'Shutten o kichinto shimesu.'],
        ['どんどん', '{急速|きゅうそく}に／{次第|しだい}に', '{利用者|りようしゃ}が{急速|きゅうそく}に{増加|ぞうか}した。', 'Riyousha ga kyuusoku ni zouka shita.'],
        ['だんだん', '{徐々|じょじょ}に／{次第|しだい}に', '{徐々|じょじょ}に{改善|かいぜん}している。', 'Jojo ni kaizen shite iru.'],
        ['やっぱり', 'やはり', 'やはり{時間|じかん}が{課題|かだい}である。', 'Yahari jikan ga kadai de aru.'],
        ['なんで', 'なぜ', 'なぜこのような{結果|けっか}になったのか。', 'Naze kono you na kekka ni natta no ka.'],
        ['どっち', 'どちら', 'どちらの{方法|ほうほう}が{有効|ゆうこう}か。', 'Dochira no houhou ga yuukou ka.'],
        ['こんな／そんな／あんな', 'このような／そのような／あのような', 'そのような{意見|いけん}もある。', 'Sono you na iken mo aru.'],
        ['～みたいだ', '～ようだ', '{増加|ぞうか}しているようである。', 'Zouka shite iru you de aru.'],
        ['～じゃない', '～ではない', 'これは{単|たん}なる{偶然|ぐうぜん}ではない。', 'Kore wa tannaru guuzen de wa nai.'],
        ['～って（＝という／とは）', '～という／～とは', '「{考察|こうさつ}」とは、～ことである。', '"Kousatsu" to wa, ~ koto de aru.'],
        ['～とか～とか', '～や～など', 'スマートフォンやパソコンなど', 'sumaatofon ya pasokon nado'],
        ['～なんか', '～など', '{本|ほん}や{論文|ろんぶん}などを{調|しら}べた。', 'Hon ya ronbun nado o shirabeta.'],
        ['～ちゃう／～じゃう', '～てしまう', '{忘|わす}れてしまう{学生|がくせい}も{多|おお}い。', 'Wasurete shimau gakusei mo ooi.'],
        ['～なきゃ／～なくちゃ', '～なければならない', '{確認|かくにん}しなければならない。', 'Kakunin shinakereba naranai.'],
        ['～てる／～でる', '～ている／～でいる', '{利用|りよう}している。{進|すす}んでいる。', 'Riyou shite iru. Susunde iru.'],
        ['～とく', '～ておく', '{事前|じぜん}に{確認|かくにん}しておく。', 'Jizen ni kakunin shite oku.'],
        ['～と{思|おも}います', '～と{考|かんが}える／～と{考|かんが}えられる／～と{思|おも}われる', '～が{原因|げんいん}であると{考|かんが}えられる。', '~ ga gen\'in de aru to kangaerareru.'],
        ['{一番|いちばん}', '{最|もっと}も', '{最|もっと}も{多|おお}かったのは～である。', 'Mottomo ookatta no wa ~ de aru.'],
        ['{全然|ぜんぜん}～ない', '{全|まった}く～ない', '{全|まった}く{効果|こうか}がなかった。', 'Mattaku kouka ga nakatta.'],
        ['あんまり～ない', 'あまり～ない', 'あまり{知|し}られていない。', 'Amari shirarete inai.'],
        ['だいたい', 'おおよそ／{約|やく}', '{約|やく}{八割|はちわり}が{利用|りよう}している。', 'Yaku hachiwari ga riyou shite iru.'],
        ['もっと', 'より／さらに', 'より{詳|くわ}しい{調査|ちょうさ}が{必要|ひつよう}である。', 'Yori kuwashii chousa ga hitsuyou de aru.'],
        ['{絶対|ぜったい}（に）', '{必|かなら}ず', '{必|かなら}ず{出典|しゅってん}を{示|しめ}す。', 'Kanarazu shutten o shimesu.'],
        ['～し、～し', '～うえ（に）／～だけでなく', '{費用|ひよう}が{高|たか}いうえに、{時間|じかん}もかかる。', 'Hiyou ga takai ue ni, jikan mo kakaru.'],
        ['～たら', '～と／～{場合|ばあい}', '{確認|かくにん}しない{場合|ばあい}、{誤|あやま}りが{残|のこ}る。', 'Kakunin shinai baai, ayamari ga nokoru.'],
        ['{今|いま}', '{現在|げんざい}', '{現在|げんざい}、{多|おお}くの{大学|だいがく}で～。', 'Genzai, ooku no daigaku de ~.'],
        ['この{前|まえ}', '{先日|せんじつ}／{以前|いぜん}', '{以前|いぜん}の{調査|ちょうさ}では～。', 'Izen no chousa de wa ~.'],
        ['{違|ちが}う', '{異|こと}なる', '{結果|けっか}は{予想|よそう}と{異|こと}なった。', 'Kekka wa yosou to kotonatta.'],
      ],
    },
    {
      t: 'table',
      caption: '(6) Văn kết câu (文末表現) của レポート — mỗi câu một "độ chắc"',
      head: ['Cách kết', 'Sắc thái', 'Dùng khi', 'Ví dụ'],
      rows: [
        ['～である／～だ', 'khẳng định sự thật', 'nêu sự thật, định nghĩa, số liệu', '{回答者|かいとうしゃ}は80{名|めい}である。'],
        ['～ことが{分|わ}かった／～が{明|あき}らかになった', 'kết quả rút ra từ dữ liệu', 'phần kết quả, kết luận', '{確認|かくにん}の{習慣|しゅうかん}が{少|すく}ないことが{明|あき}らかになった。'],
        ['～を{示|しめ}している／～が{示唆|しさ}される', 'số liệu cho thấy (rõ / gián tiếp)', 'mô tả biểu đồ, 考察', 'この{結果|けっか}は～を{示唆|しさ}している。'],
        ['～と{言|い}える', 'có thể nói (khá chắc)', 'tổng kết có căn cứ', '{翻訳|ほんやく}アプリは{広|ひろ}く{普及|ふきゅう}していると{言|い}える。'],
        ['～と{考|かんが}えられる', 'có thể cho rằng (khách quan, an toàn)', 'suy luận trong 考察 — dùng nhiều nhất', '～が{原因|げんいん}の{一|ひと}つだと{考|かんが}えられる。'],
        ['～と{思|おも}われる', 'có vẻ là (dè dặt hơn)', 'suy đoán chưa đủ căn cứ', '{学年|がくねん}による{差|さ}もあると{思|おも}われる。'],
        ['～のではないだろうか', 'chẳng phải là… sao (chủ trương mềm)', 'kết đoạn, kết bài', '{使|つか}い{方|かた}を{教|おし}えることが{大切|たいせつ}なのではないだろうか。'],
        ['～べきである／～{必要|ひつよう}がある', 'chủ trương / đề xuất', 'kết luận, đề xuất', '{大学|だいがく}は{使|つか}い{方|かた}を{指導|しどう}すべきである。'],
        ['～と{述|の}べている／～と{指摘|してき}している／～とされている', 'ý của NGƯỜI KHÁC', 'trích dẫn', '{山田|やまだ}（2023）は～と{述|の}べている。'],
        ['～であろう／～だろう', 'phỏng đoán tương lai', 'triển vọng, kết luận', '{今後|こんご}も{利用者|りようしゃ}は{増|ふ}えるであろう。'],
      ],
    },
    {
      t: 'note',
      title: 'Ba lỗi văn kết câu hay gặp',
      items: [
        '**Kết bằng cảm xúc**: ~~～と{感|かん}じた。とても{驚|おどろ}いた。~~ → **～は{予想外|よそうがい}の{結果|けっか}であった。** (レポート không kể cảm xúc).',
        '**Chắc quá mức dữ liệu**: chỉ khảo sát 80 người mà viết ~~{日本|にほん}の{留学生|りゅうがくせい}は{全員|ぜんいん}～である~~ → **{本調査|ほんちょうさ}の{回答者|かいとうしゃ}については、～と{言|い}える。**',
        '**Câu nào cũng ～と{思|おも}う**: thay bằng thang **～である → ～と{言|い}える → ～と{考|かんが}えられる → ～と{思|おも}われる** tuỳ độ chắc của căn cứ.',
      ],
    },

    /* ── (7) Bài mẫu ── */
    { t: 'h', text: '(7) Bài mẫu レポート (~900 chữ) — {留学生|りゅうがくせい}の{翻訳|ほんやく}アプリ{利用|りよう}と{日本語学習|にほんごがくしゅう}' },
    {
      t: 'chart',
      kind: 'bar',
      title: '{図|ず}1　{翻訳|ほんやく}アプリを{使|つか}う{場面|ばめん}（{複数回答|ふくすうかいとう}・{回答者|かいとうしゃ}80{名|めい}）— số liệu MINH HOẠ, không phải khảo sát thật',
      unit: 'người',
      labels: ['授業の資料を読む', 'レポートを書く', '買い物・生活', 'メールを書く', 'ほとんど使わない'],
      series: [{ name: '回答者数', values: [54, 41, 30, 23, 6] }],
    },
    {
      t: 'passage',
      title: '{留学生|りゅうがくせい}の{翻訳|ほんやく}アプリ{利用|りよう}と{日本語学習|にほんごがくしゅう} ―みなと{大学|だいがく}の{留学生|りゅうがくせい}へのアンケートから―',
      intro: 'Bài mẫu thể だ・である. ⚠ Mọi số liệu, tên trường, tên tác giả và tên sách ở đây là GIẢ ĐỊNH để học (〔架空〕) — không phải khảo sát hay tài liệu thật. Đọc một lượt, rồi xem bảng phân tích bên dưới.',
      paras: [
        { label: '1. はじめに', text: '{近年|きんねん}、スマートフォンの{翻訳|ほんやく}アプリの{性能|せいのう}は{大|おお}きく{向上|こうじょう}し、{日本語|にほんご}を{学|まな}ぶ{留学生|りゅうがくせい}の{間|あいだ}でも{広|ひろ}く{使|つか}われるようになった。では、{翻訳|ほんやく}アプリは{日本語|にほんご}の{学習|がくしゅう}を{助|たす}けるのだろうか、それとも{妨|さまた}げるのだろうか。{本|ほん}レポートでは、{留学生|りゅうがくせい}へのアンケートの{結果|けっか}をもとに、{翻訳|ほんやく}アプリの{利用|りよう}と{日本語学習|にほんごがくしゅう}の{関係|かんけい}を{考察|こうさつ}する。まず{調査|ちょうさ}の{方法|ほうほう}と{結果|けっか}を{示|しめ}し、{次|つぎ}にその{結果|けっか}について{考察|こうさつ}した{上|うえ}で、{最後|さいご}に{今後|こんご}の{課題|かだい}を{述|の}べる。' },
        { label: '2. 調査の方法と結果', text: '2025{年|ねん}10{月|がつ}、みなと{大学|だいがく}の{留学生|りゅうがくせい}80{名|めい}を{対象|たいしょう}に、アンケート{調査|ちょうさ}を{行|おこな}った。{翻訳|ほんやく}アプリを「ほぼ{毎日|まいにち}{使|つか}う」と{答|こた}えた{学生|がくせい}は62{名|めい}（78%）であった。{使|つか}う{場面|ばめん}としては、「{授業|じゅぎょう}の{資料|しりょう}を{読|よ}む{時|とき}」が{最|もっと}も{多|おお}く、「レポートを{書|か}く{時|とき}」がそれに{続|つづ}いた（{図|ず}1）。{一方|いっぽう}、「アプリが{訳|やく}した{文|ぶん}を、{自分|じぶん}で{確認|かくにん}するか」という{質問|しつもん}に「いつも{確認|かくにん}する」と{答|こた}えた{学生|がくせい}は、わずか15{名|めい}（19%）にとどまった。' },
        { label: '3. 考察', text: '{以上|いじょう}の{結果|けっか}から、{多|おお}くの{留学生|りゅうがくせい}が{翻訳|ほんやく}アプリを{日常的|にちじょうてき}に{使|つか}っている{一方|いっぽう}で、その{結果|けっか}を{確|たし}かめる{習慣|しゅうかん}はあまりないことが{分|わ}かる。{翻訳|ほんやく}アプリは、{時間|じかん}の{面|めん}では{学習者|がくしゅうしゃ}を{大|おお}いに{助|たす}ける。しかし、{訳|やく}された{文|ぶん}をそのまま{使|つか}うだけでは、{新|あたら}しい{言葉|ことば}や{文|ぶん}の{形|かたち}を{身|み}につける{機会|きかい}は{生|う}まれにくい。{言語教育|げんごきょういく}の{研究者|けんきゅうしゃ}である{山田|やまだ}（2023）は、「{道具|どうぐ}に{頼|たよ}ること{自体|じたい}が{問題|もんだい}なのではない。{問題|もんだい}は、{頼|たよ}った{後|あと}に{考|かんが}えないことである」と{述|の}べている。この{指摘|してき}は、{今回|こんかい}の{結果|けっか}とも{一致|いっち}する。したがって、{翻訳|ほんやく}アプリを{日本語学習|にほんごがくしゅう}に{役立|やくだ}てる{上|うえ}で{重要|じゅうよう}なのは、アプリの{利用|りよう}をやめることではなく、{使|つか}った{後|あと}に{自分|じぶん}で{確|たし}かめる{段階|だんかい}を{加|くわ}えることであると{考|かんが}えられる。' },
        { label: '4. おわりに', text: '{本|ほん}レポートでは、{留学生|りゅうがくせい}の{翻訳|ほんやく}アプリの{利用|りよう}と{日本語学習|にほんごがくしゅう}の{関係|かんけい}を{考察|こうさつ}した。その{結果|けっか}、アプリは{広|ひろ}く{使|つか}われているが、{学習|がくしゅう}に{生|い}かすための{確認|かくにん}の{習慣|しゅうかん}は{十分|じゅうぶん}ではないことが{明|あき}らかになった。{大学|だいがく}は、アプリを{禁止|きんし}するのではなく、その{使|つか}い{方|かた}を{授業|じゅぎょう}の{中|なか}で{指導|しどう}すべきである。ただし、{今回|こんかい}の{調査|ちょうさ}は{一|ひと}つの{大学|だいがく}の80{名|めい}に{限|かぎ}られている。{今後|こんご}は、{調査|ちょうさ}の{範囲|はんい}を{広|ひろ}げた{上|うえ}で、{学年|がくねん}や{日本語|にほんご}のレベルによる{違|ちが}いも{検討|けんとう}する{必要|ひつよう}がある。' },
        { label: '参考文献', text: '{山田花子|やまだはなこ}（2023）『{道具|どうぐ}と{学|まな}びの{間|あいだ}で ―{言語教育|げんごきょういく}とテクノロジー』みなと{出版|しゅっぱん}〔{架空|かくう}の{文献|ぶんけん}・{学習用|がくしゅうよう}の{例|れい}〕　※アンケートの{数字|すうじ}は、すべて{学習用|がくしゅうよう}に{作|つく}った{例|れい}である。' },
      ],
    },
    {
      t: 'table',
      caption: 'Phân tích bài mẫu — mỗi đoạn làm gì, dùng gì',
      head: ['Đoạn', 'Việc của đoạn', 'Câu then chốt', 'Mẫu / từ của Bài 52'],
      rows: [
        ['1. はじめに', 'Bối cảnh → CÂU HỎI (～だろうか、それとも～だろうか) → mục đích → báo trước bố cục', '{本|ほん}レポートでは、～を{考察|こうさつ}する。まず～、{次|つぎ}に～{考察|こうさつ}した{上|うえ}で、{最後|さいご}に～', '～た{上|うえ}で · {考察|こうさつ} · である体'],
        ['2. 調査の方法と結果', 'Ai, khi nào, bao nhiêu người → CHỈ nêu số liệu, có (図1)', '～を{対象|たいしょう}に、～を{行|おこな}った。～は62{名|めい}（78%）であった。', '{行|おこな}った (văn viết của した) · ～であった · わずか～にとどまった (chỉ dừng ở)'],
        ['3. 考察', 'Số liệu NÓI LÊN gì → mặt tốt / mặt chưa tốt → trích dẫn → nối với dữ liệu mình → suy luận', '{以上|いじょう}の{結果|けっか}から～ことが{分|わ}かる · {山田|やまだ}（2023）は「～」と{述|の}べている · したがって、～と{考|かんが}えられる', '～{一方|いっぽう}で (Bài 49) · {時間|じかん}の{面|めん}では · ～る{上|うえ}で{重要|じゅうよう}なのは'],
        ['4. おわりに', 'Tóm điều đã làm rõ (trả lời câu hỏi đoạn 1) → chủ trương → GIỚI HẠN → hướng tiếp', '～が{明|あき}らかになった · ～すべきである · ただし、～に{限|かぎ}られている · {今後|こんご}は～{必要|ひつよう}がある', 'べきである · ～た{上|うえ}で · {範囲|はんい}'],
        ['参考文献', 'Mọi tài liệu đã trích', '{著者|ちょしゃ}（{年|ねん}）『{書名|しょめい}』{出版社|しゅっぱんしゃ}', '{出版|しゅっぱん}'],
      ],
    },
    {
      t: 'note',
      title: 'Vì sao bài mẫu được điểm cao (giảng viên nhìn gì)',
      items: [
        '**Câu hỏi và câu trả lời khớp**: đoạn 1 hỏi "**{助|たす}けるのか、{妨|さまた}げるのか**" → đoạn 4 trả lời "**{使|つか}われているが、{確認|かくにん}の{習慣|しゅうかん}は{十分|じゅうぶん}ではない**" + chủ trương "**{使|つか}い{方|かた}を{指導|しどう}すべきである**" (không chọn phe cực đoan).',
        '**Số liệu đúng chỗ**: đoạn 2 chỉ có số, **không** bình luận; đoạn 3 mới giải thích. Có **(図1)** dẫn tới biểu đồ.',
        '**Trích dẫn đúng cách**: tác giả + năm + 「」 nguyên văn + **～と{述|の}べている**, rồi ngay sau là câu **của người viết** (**この{指摘|してき}は、{今回|こんかい}の{結果|けっか}とも{一致|いっち}する**). Danh mục ở cuối khớp với chỗ trích.',
        '**Biết giới hạn của mình**: "**ただし、{今回|こんかい}の{調査|ちょうさ}は{一|ひと}つの{大学|だいがく}の80{名|めい}に{限|かぎ}られている**" — giảng viên Nhật đánh giá rất cao câu này (không khẳng định quá mức dữ liệu).',
        '**Văn phong**: toàn bài **である**; không một chữ văn nói; kết câu thay đổi theo độ chắc (**～であった → ～ことが{分|わ}かる → ～と{考|かんが}えられる → ～べきである**).',
      ],
    },

    /* ── (8) Luyện chuyển văn ── */
    { t: 'h', text: '(8) Luyện tập — chuyển văn nói → văn viết, chọn từ nối, bắt lỗi' },
    {
      t: 'quiz',
      id: 'b52-viet-chuyen',
      title: 'Viết lại bằng văn viết thể である (10 câu)',
      kind: 'translate',
      grammar: 'でも→しかし · だから→したがって · けど→が · すごく→非常に · ちゃんと→きちんと · どんどん→急速に · ～とか→～や～など · ～なきゃ→～なければならない · と思います→と考える／と考えられる · です・ます→である',
      items: [
        { q: 'でも、この{方法|ほうほう}はすごく{便利|べんり}だ。', answers: V('しかし、この{方法|ほうほう}は{非常|ひじょう}に{便利|べんり}である。', 'しかし、この{方法|ほうほう}は{非常|ひじょう}に{便利|べんり}だ。', 'しかし、この{方法|ほうほう}はきわめて{便利|べんり}である。', 'だが、この{方法|ほうほう}は{非常|ひじょう}に{便利|べんり}である。'), hint: 'しかし・非常に・である' },
        { q: 'だから、もっと{調|しら}べなきゃいけない。', answers: V('したがって、さらに{調|しら}べなければならない。', 'したがって、より{詳|くわ}しく{調|しら}べなければならない。', 'そのため、さらに{調|しら}べなければならない。', 'したがって、もっと{調|しら}べなければならない。'), hint: 'したがって・さらに・なければならない' },
        { q: 'アンケートをとったけど、{答|こた}えた{人|ひと}は{少|すく}なかった。', answers: V('アンケートを{行|おこな}ったが、{回答者|かいとうしゃ}は{少|すく}なかった。', 'アンケートを{行|おこな}ったが、{答|こた}えた{人|ひと}は{少|すく}なかった。', 'アンケートを{実施|じっし}したが、{回答者|かいとうしゃ}は{少|すく}なかった。', 'アンケートをとったが、{回答者|かいとうしゃ}は{少|すく}なかった。'), hint: '行った・が・回答者' },
        { q: 'ちゃんと{出典|しゅってん}を{書|か}かないとダメだ。', answers: V('{出典|しゅってん}をきちんと{書|か}かなければならない。', 'きちんと{出典|しゅってん}を{書|か}かなければならない。', '{出典|しゅってん}をきちんと{示|しめ}さなければならない。', '{出典|しゅってん}は{必|かなら}ず{書|か}かなければならない。'), hint: 'きちんと・なければならない' },
        { q: '{留学生|りゅうがくせい}がどんどん{増|ふ}えている。', answers: V('{留学生|りゅうがくせい}が{急速|きゅうそく}に{増加|ぞうか}している。', '{留学生|りゅうがくせい}が{急速|きゅうそく}に{増|ふ}えている。', '{留学生|りゅうがくせい}が{次第|しだい}に{増加|ぞうか}している。'), hint: '急速に・増加している' },
        { q: 'なんでこうなったのか、よく{分|わ}からない。', answers: V('なぜこのような{結果|けっか}になったのかは、{明|あき}らかではない。', 'なぜこのようになったのかは、{明|あき}らかではない。', 'なぜこのような{結果|けっか}になったのかは{分|わ}かっていない。', 'なぜこのようになったのかは、よく{分|わ}からない。'), hint: 'なぜ・このような・明らかではない' },
        { q: 'スマホとかパソコンとかを{使|つか}う{人|ひと}が{多|おお}い。', answers: V('スマートフォンやパソコンなどを{使|つか}う{人|ひと}が{多|おお}い。', 'スマホやパソコンなどを{使|つか}う{人|ひと}が{多|おお}い。', 'スマートフォンやパソコンなどを{利用|りよう}する{人|ひと}が{多|おお}い。'), hint: '～や～など' },
        { q: '{一番|いちばん}{大事|だいじ}なのは、{自分|じぶん}で{考|かんが}えることだと{思|おも}います。', answers: V('{最|もっと}も{重要|じゅうよう}なのは、{自分|じぶん}で{考|かんが}えることだと{考|かんが}える。', '{最|もっと}も{重要|じゅうよう}なのは、{自分|じぶん}で{考|かんが}えることだと{考|かんが}えられる。', '{最|もっと}も{重要|じゅうよう}なのは、{自分|じぶん}で{考|かんが}えることである。', '{最|もっと}も{大切|たいせつ}なのは、{自分|じぶん}で{考|かんが}えることだと{考|かんが}える。'), hint: '最も・重要・と考える' },
        { q: 'この{結果|けっか}はちょっと{意外|いがい}でした。', answers: V('この{結果|けっか}はやや{意外|いがい}であった。', 'この{結果|けっか}は{少|すこ}し{意外|いがい}であった。', 'この{結果|けっか}はやや{意外|いがい}だった。', 'この{結果|けっか}はやや{予想外|よそうがい}であった。'), hint: 'やや・であった' },
        { q: 'やっぱり、{時間|じかん}が{足|た}りないみたいだ。', answers: V('やはり、{時間|じかん}が{不足|ふそく}しているようである。', 'やはり、{時間|じかん}が{足|た}りないようである。', 'やはり、{時間|じかん}が{不足|ふそく}しているようだ。', 'やはり、{時間|じかん}が{足|た}りないようだ。'), hint: 'やはり・ようである' },
      ],
    },
    {
      t: 'quiz',
      id: 'b52-viet-noi',
      title: 'Chọn từ nối — điền vào chỗ trống (8 câu)',
      kind: 'fill',
      items: [
        { q: '{本|ほん}レポートでは、（　　）{調査|ちょうさ}の{方法|ほうほう}を{説明|せつめい}し、{次|つぎ}に{結果|けっか}を{示|しめ}す。（trước hết）', answers: V('まず', '{最初|さいしょ}に'), hint: 'まず～、次に～' },
        { q: '{回答者|かいとうしゃ}の{多|おお}くは{一年生|いちねんせい}であった。（　　）、その{半数|はんすう}はアジア{出身|しゅっしん}であった。（thêm ý）', answers: V('また', 'さらに', '{加|くわ}えて'), hint: 'また／さらに' },
        { q: '{翻訳|ほんやく}アプリは{便利|べんり}である。（　　）、{頼|たよ}りすぎると{学習|がくしゅう}の{機会|きかい}が{減|へ}る。（đối lập — văn viết）', answers: V('しかし', 'だが'), hint: 'しかし／だが' },
        { q: '{回答者|かいとうしゃ}は80{名|めい}に{限|かぎ}られている。（　　）、この{結果|けっか}をすべての{留学生|りゅうがくせい}に{当|あ}てはめることはできない。（vì vậy）', answers: V('したがって', 'そのため', 'ゆえに'), hint: 'したがって' },
        { q: '（　　）の{結果|けっか}から、{次|つぎ}のことが{分|わ}かる。（trên đây）', answers: V('{以上|いじょう}'), hint: '以上の結果から' },
        { q: '{山田|やまだ}（2023）は、「{道具|どうぐ}に{頼|たよ}ること{自体|じたい}が{問題|もんだい}なのではない」と（　　）いる。（trình bày — trích dẫn）', answers: V('{述|の}べて', '{指摘|してき}して'), hint: '～と述べている' },
        { q: '{調査|ちょうさ}は10{月|がつ}に{行|おこな}った。（　　）、{回答|かいとう}はすべて{名前|なまえ}を{書|か}かない{形|かたち}で{集|あつ}めた。（lưu ý thêm）', answers: V('なお'), hint: 'なお' },
        { q: '{本調査|ほんちょうさ}には{限界|げんかい}もある。（　　）、{対象|たいしょう}が{一|ひと}つの{大学|だいがく}に{限|かぎ}られている{点|てん}である。（cụ thể là / tức là）', answers: V('すなわち', 'つまり', 'それは'), hint: 'すなわち' },
      ],
    },
    {
      t: 'mcq',
      id: 'b52-viet-loi',
      title: 'Bắt lỗi văn viết & trích dẫn (8 câu)',
      items: [
        MQ('レポートの{文|ぶん}として{最|もっと}も{適切|てきせつ}なものはどれか。', '{回答者|かいとうしゃ}の{約|やく}{八割|はちわり}が、アプリを{毎日|まいにち}{使|つか}っていると{答|こた}えた。', ['{回答者|かいとうしゃ}のだいたい{八割|はちわり}が、アプリを{毎日|まいにち}{使|つか}ってるって{答|こた}えた。', '{回答者|かいとうしゃ}の{約|やく}{八割|はちわり}が、アプリを{毎日|まいにち}{使|つか}っていると{答|こた}えました。', '{回答者|かいとうしゃ}の{約|やく}{八割|はちわり}が、アプリを{毎日|まいにち}{使|つか}っていると{答|こた}えたである。'], 'Đúng: thể thường + từ văn viết (約). Sai: văn nói (だいたい・使ってる・って) · です・ます · thêm である sau động từ.'),
        MQ('{次|つぎ}の{中|なか}で、{盗用|とうよう}にあたるものはどれか。', '{本|ほん}の{文章|ぶんしょう}を{少|すこ}し{言葉|ことば}を{変|か}えて、{出典|しゅってん}を{書|か}かずに{使|つか}った。', ['{本|ほん}の{文章|ぶんしょう}をかぎ{括弧|かっこ}に{入|い}れ、{著者|ちょしゃ}と{年|ねん}を{書|か}いた。', '{本|ほん}の{内容|ないよう}を{自分|じぶん}の{言葉|ことば}でまとめ、{出典|しゅってん}を{書|か}いた。', '{自分|じぶん}で{行|おこな}ったアンケートの{結果|けっか}を{使|つか}った。'], 'Đổi vài chữ mà **không ghi nguồn** vẫn là **{盗用|とうよう}**. Trích gián tiếp có ghi nguồn là hợp lệ.'),
        MQ('{本|ほん}を{参考文献|さんこうぶんけん}の{一覧|いちらん}に{書|か}く{時|とき}、{正|ただ}しい{形|かたち}はどれか。', '{山田花子|やまだはなこ}（2023）『{道具|どうぐ}と{学|まな}びの{間|あいだ}で』みなと{出版|しゅっぱん}', ['『{道具|どうぐ}と{学|まな}びの{間|あいだ}で』', '{山田花子|やまだはなこ}「{面白|おもしろ}い{本|ほん}だった」', 'みなと{出版|しゅっぱん}のホームページ'], 'Sách: **{著者名|ちょしゃめい}（{出版年|しゅっぱんねん}）『{書名|しょめい}』{出版社|しゅっぱんしゃ}**. Thiếu tác giả / năm / NXB là sai khuôn.'),
        MQ('「{結果|けっか}」の{部分|ぶぶん}に{書|か}く{文|ぶん}として{最|もっと}も{適切|てきせつ}なものはどれか。', '「いつも{確認|かくにん}する」と{答|こた}えた{学生|がくせい}は15{名|めい}（19%）であった。', ['{確認|かくにん}しない{学生|がくせい}が{多|おお}いのは、{本当|ほんとう}に{残念|ざんねん}だと{感|かん}じた。', '{学生|がくせい}はもっと{確認|かくにん}すべきである。', '{確認|かくにん}しないのは、{忙|いそが}しいからだと{考|かんが}えられる。'], 'Phần **kết quả** chỉ nêu **số liệu**. Cảm xúc (残念だと感じた) không dùng; chủ trương (べきである) để ở kết luận; suy luận (考えられる) để ở 考察.'),
        MQ('{序論|じょろん}の{最後|さいご}に{書|か}く{文|ぶん}として{最|もっと}も{適切|てきせつ}なものはどれか。', 'まず{調査|ちょうさ}の{方法|ほうほう}を{述|の}べ、{次|つぎ}に{結果|けっか}を{示|しめ}した{上|うえ}で、{最後|さいご}に{今後|こんご}の{課題|かだい}を{論|ろん}じる。', ['{以上|いじょう}のことから、{大学|だいがく}は{指導|しどう}すべきである。', '{山田|やまだ}（2023）は「～」と{述|の}べている。', 'この{結果|けっか}を{見|み}て、とても{驚|おどろ}いた。'], 'Cuối 序論 = **câu báo trước bố cục** (まず～、次に～、最後に～). 以上のことから là câu kết luận; câu trích dẫn thuộc 考察; câu cảm xúc không dùng.'),
        MQ('{一|ひと}つの{大学|だいがく}で80{名|めい}に{調査|ちょうさ}した{結果|けっか}を{書|か}く{時|とき}、{最|もっと}も{適切|てきせつ}な{結論|けつろん}はどれか。', '{本調査|ほんちょうさ}の{回答者|かいとうしゃ}については、{確認|かくにん}の{習慣|しゅうかん}が{十分|じゅうぶん}ではないと{言|い}える。', ['{日本|にほん}の{留学生|りゅうがくせい}は{全員|ぜんいん}、{確認|かくにん}の{習慣|しゅうかん}がない。', '{世界|せかい}の{学生|がくせい}は、{翻訳|ほんやく}アプリを{確認|かくにん}しない。', '{留学生|りゅうがくせい}は{確認|かくにん}しないに{決|き}まっている。'], 'Kết luận phải **trong phạm vi dữ liệu**: 80 người của một trường → "**{本調査|ほんちょうさ}の{回答者|かいとうしゃ}については**". Ba câu kia khẳng định quá mức.'),
        MQ('{次|つぎ}の{文|ぶん}のうち、だ・である{体|たい}として{正|ただ}しいものはどれか。', 'この{問題|もんだい}は、{今後|こんご}さらに{深刻|しんこく}になるであろう。', ['この{問題|もんだい}は、{今後|こんご}さらに{深刻|しんこく}になるでしょう。', 'この{問題|もんだい}は、{今後|こんご}さらに{深刻|しんこく}になるであろうだ。', 'この{問題|もんだい}は、{今後|こんご}さらに{深刻|しんこく}になるだろうです。'], '**でしょう → だろう／であろう** (chọn một). Các câu kia: です・ます; であろう＋だ (thừa); だろう＋です (trộn thể).'),
        MQ('{他人|たにん}の{意見|いけん}を{紹介|しょうかい}した{後|あと}に{続|つづ}ける{文|ぶん}として{最|もっと}も{適切|てきせつ}なものはどれか。', 'この{指摘|してき}は、{本調査|ほんちょうさ}の{結果|けっか}とも{一致|いっち}する。', ['だから{私|わたし}も{山田|やまだ}さんと{全|まった}く{同|おな}じ{意見|いけん}です。', 'この{本|ほん}はすごく{面白|おもしろ}かった。', '{山田|やまだ}さんはきっといい{人|ひと}だと{思|おも}う。'], 'Sau trích dẫn: một câu **của người viết** nối ý đó với **dữ liệu của mình** (一致する／異なる). Ba câu kia: văn nói, cảm tưởng, nhận xét cá nhân.'),
      ],
    },

    /* ── (9) Đề viết ── */
    { t: 'h', text: '(9) Đề viết — レポート 800–1.200 chữ + tiêu chí tự chấm' },
    {
      t: 'p',
      text: 'Đề chính: **「{大学生|だいがくせい}のアルバイトと{学業|がくぎょう}の{両立|りょうりつ}について」** — **800–1.200 chữ**, thể **だ・である**, có **序論・本論（結果・考察）・結論・参考文献**. Dùng **bảng số liệu minh hoạ** bên dưới làm kết quả khảo sát (ghi rõ trong bài: "{学習用|がくしゅうよう}の{例|れい}"). Yêu cầu: ít nhất **một trích dẫn** đúng cách (tìm một sách / bài báo **thật** ở thư viện trường — hoặc nếu chỉ luyện tập thì trích bài đọc 3 của mục Đọc và ghi rõ "{教材|きょうざい}より"), dùng tự nhiên ít nhất **ba mẫu** của bài (～た{上|うえ}で・～る{上|うえ}で・～の{面|めん}で・～べきである・～ねばならない…), và **một câu nêu giới hạn** của dữ liệu.',
    },
    {
      t: 'table',
      caption: '{表|ひょう}1　{週|しゅう}のアルバイト{時間|じかん}と「アルバイトのために{授業|じゅぎょう}を{休|やす}んだことがある」{学生|がくせい}の{割合|わりあい}（ある{大学|だいがく}の{二年生|にねんせい}100{名|めい}）— số liệu MINH HOẠ',
      head: ['{週|しゅう}のアルバイト{時間|じかん}', '{人数|にんずう}', '{授業|じゅぎょう}を{休|やす}んだことがある', '「{生活|せいかつ}のために{働|はたら}く{必要|ひつよう}がある」'],
      rows: [
        ['0{時間|じかん}', '20{名|めい}', '—', '—'],
        ['1～10{時間|じかん}', '35{名|めい}', '9%', '31%'],
        ['11～20{時間|じかん}', '30{名|めい}', '23%', '57%'],
        ['21{時間|じかん}{以上|いじょう}', '15{名|めい}', '60%', '87%'],
      ],
    },
    {
      t: 'table',
      caption: 'Dàn ý gợi ý (bạn được đổi)',
      head: ['Phần', 'Nên viết', 'Câu mở gợi ý'],
      rows: [
        ['{序論|じょろん} (~150 chữ)', 'Bối cảnh: nhiều SV làm thêm · câu hỏi: làm thêm ảnh hưởng tới việc học thế nào, nên làm trong giới hạn nào · báo trước bố cục', '{現在|げんざい}、{多|おお}くの{大学生|だいがくせい}がアルバイトをしている。では、～だろうか。{本|ほん}レポートでは、～。'],
        ['{結果|けっか} (~200 chữ)', 'Đọc bảng: số người theo giờ làm · tỉ lệ nghỉ học tăng theo giờ làm · tỉ lệ "phải làm để sống"', '{表|ひょう}1は、～を{示|しめ}したものである。～{時間|じかん}{以上|いじょう}{働|はたら}く{学生|がくせい}では、～%が～と{答|こた}えた。'],
        ['{考察|こうさつ} (~350 chữ)', 'Ý nghĩa: giờ làm càng nhiều càng ảnh hưởng · mặt kinh tế ↔ mặt học tập · trích dẫn · vì sao (cần tiền sống)', '{以上|いじょう}の{結果|けっか}から、～ことが{分|わ}かる。{経済的|けいざいてき}な{面|めん}では～が、{学業|がくぎょう}の{面|めん}では～。○○（{年|ねん}）は「～」と{述|の}べている。'],
        ['{結論|けつろん} (~200 chữ)', 'Trả lời câu hỏi · chủ trương (SV nên…/ trường nên…) · giới hạn dữ liệu · hướng tiếp', '{本|ほん}レポートでは、～を{考察|こうさつ}した。～と{考|かんが}えられる。{大学|だいがく}は～べきである。ただし、～。'],
        ['{参考文献|さんこうぶんけん}', 'Đúng khuôn', '{著者名|ちょしゃめい}（{年|ねん}）『{書名|しょめい}』{出版社|しゅっぱんしゃ}'],
      ],
    },
    {
      t: 'table',
      caption: 'Tiêu chí tự chấm (5 tiêu chí × 5 điểm = 25)',
      head: ['Tiêu chí', '5 điểm', '3 điểm', '1 điểm'],
      rows: [
        ['① {構成|こうせい}', 'Đủ 4 phần + danh mục; câu hỏi ở 序論 được trả lời ở 結論; có câu báo trước bố cục', 'Đủ phần nhưng 序論 và 結論 không khớp', 'Không chia phần / thiếu kết luận'],
        ['② {根拠|こんきょ}', 'Dùng số liệu đúng bảng, có (表1); không bịa số', 'Có số liệu nhưng chép sai / thiếu nguồn bảng', 'Không dùng số liệu'],
        ['③ {考察|こうさつ}', 'Giải thích ý nghĩa của số liệu, xét ≥ 2 mặt (～の面で), nêu giới hạn', 'Chỉ kể lại số, ít giải thích', 'Toàn cảm tưởng (～と感じた)'],
        ['④ {引用|いんよう}', '≥ 1 trích dẫn đúng khuôn + danh mục khớp; có câu của mình sau trích dẫn', 'Có trích dẫn nhưng thiếu năm / trang / danh mục', 'Không trích / trích không ghi nguồn'],
        ['⑤ {文体|ぶんたい}・{文法|ぶんぽう}', 'Toàn bài である; 0 lỗi văn nói; ≥ 3 mẫu Bài 52 dùng tự nhiên; 800–1.200 chữ', '1–3 chỗ văn nói / lẫn です・ます', 'Lẫn thể nhiều chỗ'],
      ],
    },
    {
      t: 'note',
      title: 'Kiểm tra trước khi nộp (チェックリスト)',
      items: [
        '☐ Toàn bài **だ・である**? Tìm bằng Ctrl+F: **です・ます・でしょう** — phải ra 0 kết quả (trừ trong 「」 trích dẫn).',
        '☐ Không còn: **でも・だから・けど・すごく・ちゃんと・やっぱり・なんで・～ちゃう・～てる・～って・～とか・～なきゃ**.',
        '☐ Không có **イA＋である** hay **V＋である** (~~{多|おお}いである~~, ~~{増|ふ}えるである~~).',
        '☐ Câu hỏi ở 序論 (～だろうか) có câu trả lời ở 結論 (～が{明|あき}らかになった／～と{考|かんが}えられる)?',
        '☐ Phần kết quả **chỉ** có số liệu; mọi câu "vì sao" nằm ở 考察?',
        '☐ Mỗi trích dẫn có **tác giả + năm (+ trang)**, và có trong **参考文献**? Câu sau trích dẫn là câu **của mình**?',
        '☐ Có một câu **giới hạn** (ただし、～に{限|かぎ}られている)?',
        '☐ Số chữ **800–1.200** (không tính tiêu đề, danh mục)? Mỗi đoạn một ý, đầu đoạn lùi một ô?',
      ],
    },
    {
      t: 'note',
      title: 'Đề luyện thêm (tự viết, 800–1.200 chữ, cùng khuôn)',
      items: [
        '**「オンライン{授業|じゅぎょう}と{対面授業|たいめんじゅぎょう}の{比較|ひかく}」** — tự làm một khảo sát nhỏ 10–20 bạn trong lớp (ghi rõ phạm vi), so sánh theo từng mặt (**{理解|りかい}の{面|めん}・{時間|じかん}の{面|めん}・{交流|こうりゅう}の{面|めん}**), kết luận bằng **～べきである**.',
        '**「{大学生|だいがくせい}の{睡眠時間|すいみんじかん}と{生活習慣|せいかつしゅうかん}」** — dùng **～た{上|うえ}で** cho phương pháp (アンケートを{行|おこな}った{上|うえ}で、～に{聞|き}き{取|と}りをした), trích một tài liệu thật về giấc ngủ.',
        '**{報告書|ほうこくしょ}版** — viết lại bài mẫu (7) thành **báo cáo công việc ~400 chữ** gửi trưởng phòng: **{結論|けつろん}から{述|の}べると、～**, các ý dùng **{箇条書|かじょうが}き**, có **{費用対効果|ひようたいこうか}・{安全面|あんぜんめん}** (như hội thoại ②).',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b52-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — dịch Việt → Nhật (14 câu), trắc nghiệm (14 câu), ghép câu (10 câu)',
  goal: 'Tự dùng năm mẫu của Bài 52 (～た上で／る上で, ～面で／という点で, だ・である体, ～べきだ／べきではない／べきだった, ～ねばならない) và từ vựng báo cáo trong câu của mình; phân biệt các mẫu gần nghĩa ở dạng đề JLPT.',
  minutes: 55,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        '**Dịch** — viết cả câu (chữ Hán hoặc kana đều được, máy chấm bỏ qua dấu câu và dấu cách). Câu có ghi **（である体）** thì viết thể văn viết. Bấm 💡 để xem gợi ý.',
        '**Trắc nghiệm** — câu nào sai thì đọc phần giải thích rồi quay lại đúng mục ngữ pháp (①–⑨) hoặc bảng 類義語 ở mục Từ vựng.',
        '**Ghép câu** — có một mảnh thừa (dạng sai hoặc mẫu gần nghĩa). Đọc to câu đã ghép.',
      ],
    },
    {
      t: 'quiz',
      id: 'b52-bt-dich',
      title: 'Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: 'Vた上で · Vる上で · Nの面で／という点で · である体 · V辞書形＋べきだ（する→すべき）· Vない＋ねばならない（する→せねば）',
      items: [
        { q: 'Tôi sẽ bàn với cô giáo rồi mới quyết định đề tài.', answers: V('{先生|せんせい}と{相談|そうだん}した{上|うえ}で、テーマを{決|き}めます。', '{先生|せんせい}と{相談|そうだん}した{上|うえ}で、テーマを{決|き}める。', '{先生|せんせい}に{相談|そうだん}した{上|うえ}で、テーマを{決|き}めます。'), hint: 'せんせいと そうだんした うえで、テーマを きめます' },
        { q: 'Khi sống ở Nhật, biết cách đổ rác là điều quan trọng.', answers: V('{日本|にほん}で{生活|せいかつ}する{上|うえ}で、ごみの{出|だ}し{方|かた}を{知|し}ることは{大切|たいせつ}だ。', '{日本|にほん}で{生活|せいかつ}する{上|うえ}で、ごみの{出|だ}し{方|かた}を{知|し}ることは{大切|たいせつ}です。', '{日本|にほん}で{暮|く}らす{上|うえ}で、ごみの{出|だ}し{方|かた}を{知|し}ることは{大切|たいせつ}だ。'), hint: 'にほんで せいかつする うえで、ごみの だしかたを しる ことは たいせつだ' },
        { q: 'Xin hãy đọc kỹ nội dung rồi mới ký.', answers: V('{内容|ないよう}をよく{読|よ}んだ{上|うえ}で、サインしてください。', '{内容|ないよう}をよく{読|よ}んだ{上|うえ}で、{署名|しょめい}してください。'), hint: 'ないようを よく よんだ うえで、サインして ください' },
        { q: 'Về mặt chi phí thì không có vấn đề, nhưng về mặt an toàn thì có lo ngại.', answers: V('{費用|ひよう}の{面|めん}では{問題|もんだい}ないが、{安全面|あんぜんめん}では{不安|ふあん}がある。', '{費用|ひよう}の{面|めん}では{問題|もんだい}ありませんが、{安全面|あんぜんめん}では{不安|ふあん}があります。', '{費用|ひよう}の{面|めん}では{問題|もんだい}ないが、{安全|あんぜん}の{面|めん}では{不安|ふあん}がある。'), hint: 'ひようの めんでは もんだい ないが、あんぜんめんでは ふあんが ある' },
        { q: 'Bố mẹ đã hỗ trợ tôi về mặt kinh tế.', answers: V('{両親|りょうしん}は{経済的|けいざいてき}な{面|めん}で{私|わたし}を{支|ささ}えてくれた。', '{両親|りょうしん}は{経済面|けいざいめん}で{私|わたし}を{支|ささ}えてくれた。', '{両親|りょうしん}は{経済的|けいざいてき}な{面|めん}で{私|わたし}を{支|ささ}えてくれました。'), hint: 'りょうしんは けいざいてきな めんで わたしを ささえて くれた' },
        { q: 'Sản phẩm này vượt trội ở điểm nhẹ.', answers: V('この{製品|せいひん}は{軽|かる}いという{点|てん}で{優|すぐ}れている。', 'この{製品|せいひん}は{軽|かる}いという{点|てん}で{優|すぐ}れています。'), hint: 'この せいひんは かるいと いう てんで すぐれて いる' },
        { q: 'Mục đích của khảo sát này là làm rõ thời gian ngủ của sinh viên. （である体）', answers: V('この{調査|ちょうさ}の{目的|もくてき}は、{学生|がくせい}の{睡眠時間|すいみんじかん}を{明|あき}らかにすることである。', 'この{調査|ちょうさ}の{目的|もくてき}は、{学生|がくせい}の{睡眠時間|すいみんじかん}を{明|あき}らかにすることだ。'), hint: 'この ちょうさの もくてきは、がくせいの すいみんじかんを あきらかに する ことで ある' },
        { q: 'Kết quả đã khác với dự đoán. （である体・văn viết）', answers: V('{結果|けっか}は{予想|よそう}と{異|こと}なっていた。', '{結果|けっか}は{予想|よそう}と{異|こと}なった。', '{結果|けっか}は{予想|よそう}と{違|ちが}っていた。', '{結果|けっか}は{予想|よそう}と{違|ちが}った。'), hint: 'けっかは よそうと ことなって いた' },
        { q: 'Không nên dùng nguyên văn bài viết của người khác.', answers: V('{他人|たにん}の{文章|ぶんしょう}をそのまま{使|つか}うべきではない。', '{他人|たにん}の{文章|ぶんしょう}をそのまま{使|つか}うべきではありません。', '{人|ひと}の{文章|ぶんしょう}をそのまま{使|つか}うべきではない。'), hint: 'たにんの ぶんしょうを そのまま つかう べきでは ない' },
        { q: 'Lẽ ra tôi nên hỏi ý kiến cô giáo sớm hơn.', answers: V('もっと{早|はや}く{先生|せんせい}に{相談|そうだん}すべきだった。', 'もっと{早|はや}く{先生|せんせい}に{相談|そうだん}するべきだった。', 'もっと{早|はや}く{先生|せんせい}に{相談|そうだん}すべきでした。'), hint: 'もっと はやく せんせいに そうだん すべきだった' },
        { q: 'Cuốn sách này có nhiều điểm đáng học hỏi.', answers: V('この{本|ほん}には{学|まな}ぶべき{点|てん}が{多|おお}い。', 'この{本|ほん}には{学|まな}ぶべき{点|てん}がたくさんある。', 'この{本|ほん}には{学|まな}ぶべき{点|てん}が{多|おお}くある。'), hint: 'この ほんには まなぶ べき てんが おおい' },
        { q: 'Chúng ta phải suy nghĩ về tương lai của trái đất. （ねばならない）', answers: V('{我々|われわれ}は{地球|ちきゅう}の{未来|みらい}について{考|かんが}えねばならない。', '{私|わたし}たちは{地球|ちきゅう}の{未来|みらい}について{考|かんが}えねばならない。'), hint: 'われわれは ちきゅうの みらいに ついて かんがえねば ならない' },
        { q: 'Vấn đề này phải được giải quyết ngay. （する → ねばならない）', answers: V('この{問題|もんだい}はすぐに{解決|かいけつ}せねばならない。', 'この{問題|もんだい}は{早急|そうきゅう}に{解決|かいけつ}せねばならない。', 'この{問題|もんだい}はすぐ{解決|かいけつ}せねばならない。'), hint: 'この もんだいは すぐに かいけつ せねば ならない' },
        { q: 'Kết luận nên viết ở phần đầu.', answers: V('{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきだ。', '{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきです。', '{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきである。', '{結論|けつろん}は{最初|さいしょ}に{書|か}くべきだ。'), hint: 'けつろんは ぼうとうに かく べきだ' },
      ],
    },
    {
      t: 'mcq',
      id: 'b52-bt-chon',
      title: 'Trắc nghiệm (14 câu)',
      items: [
        MQ('{面接|めんせつ}の（　）、{採用|さいよう}するかどうかを{決|き}めます。', '{上|うえ}', ['うえに', '{面|めん}', '{点|てん}'], 'Danh từ hành động (面接) + **の{上|うえ}** = phỏng vấn rồi mới quyết định (①a).'),
        MQ('{子|こ}どもを{育|そだ}てる（　）、{家族|かぞく}の{協力|きょうりょく}は{欠|か}かせない。', '{上|うえ}で', ['{上|うえ}に', 'べきで', '{面|めん}で'], 'V辞書形 + đánh giá (欠かせない) → **る{上|うえ}で** (①b).'),
        MQ('この{店|みせ}は{料理|りょうり}がおいしい（　）、{値段|ねだん}も{安|やす}い。', 'うえに', ['{上|うえ}で', '{面|めん}で', 'べきで'], 'Cộng thêm ý cùng chiều → **うえに** (Bài 29).'),
        MQ('{一人暮|ひとりぐ}らしは、{精神的|せいしんてき}な（　）で{大変|たいへん}なこともある。', '{面|めん}', ['{上|うえ}', 'はず', 'べき'], '**～{的|てき}な{面|めん}で** = về mặt (②).'),
        MQ('{持|も}ち{運|はこ}びやすいという（　）で、このパソコンは{人気|にんき}がある。', '{点|てん}', ['{面|めん}', '{上|うえ}', 'わけ'], 'Mệnh đề + という + tiêu chí cụ thể → **{点|てん}で** (②).'),
        MQ('{次|つぎ}の{会議|かいぎ}は、{本社|ほんしゃ}の{会議室|かいぎしつ}（　）{行|おこな}われる。', 'において', ['にとって', 'に{対|たい}して', 'について'], 'Nơi diễn ra (văn thông báo) → **において** (②).'),
        MQ('だ・である{体|たい}として{正|ただ}しいものはどれか。', '{調査|ちょうさ}の{結果|けっか}は{以下|いか}の{通|とお}りである。', ['{調査|ちょうさ}の{結果|けっか}は{以下|いか}の{通|とお}りです。', '{調査|ちょうさ}の{結果|けっか}は{以下|いか}の{通|とお}りであります。', '{調査|ちょうさ}の{結果|けっか}は{以下|いか}の{通|とお}りなんだ。'], '**～の{通|とお}りである** — đúng thể văn viết. であります là văn diễn thuyết; なんだ là văn nói.'),
        MQ('だ・である{体|たい}として{正|ただ}しいものはどれか。', 'アルバイトをしている{学生|がくせい}は{多|おお}い。', ['アルバイトをしている{学生|がくせい}は{多|おお}いである。', 'アルバイトをしている{学生|がくせい}は{多|おお}いだ。', 'アルバイトをしている{学生|がくせい}は{多|おお}いです。'], 'Tính từ イ **không** thêm だ／である (③).'),
        MQ('{困|こま}っている{人|ひと}を{見|み}たら、{助|たす}けて（　）。', 'あげるべきだ', ['あげるはずだ', 'あげたべきだ', 'あげないべきだ'], 'Ý kiến đạo lý → **V{辞書形|じしょけい}＋べきだ** (④). Không có べき sau thể た / thể ない.'),
        MQ('{試験|しけん}の{前|まえ}の{日|ひ}に{遊|あそ}んでしまった。もっと{勉強|べんきょう}（　）。', 'すべきだった', ['すべきだ', 'するはずだった', 'しないべきだった'], 'Hối tiếc việc đã qua → **すべきだった** (④ — ôn Bài 35).'),
        MQ('{田中|たなか}さんは{東京|とうきょう}に{住|す}んでいたから、{東京|とうきょう}の{地理|ちり}に{詳|くわ}しい（　）。', 'はずだ', ['べきだ', 'ことだ', 'ねばならない'], 'Có căn cứ (đã sống ở Tokyo) → suy đoán **はずだ** (bảng ⑧).'),
        MQ('{我々|われわれ}は、{同|おな}じ{失敗|しっぱい}を{二度|にど}と{繰|く}り{返|かえ}さないようにせ（　）ならない。', 'ねば', ['なきゃ', 'ずに', 'ないと'], 'せ＋**ねば**ならない = しなければならない (⑤).'),
        MQ('「{要旨|ようし}」の{意味|いみ}に{最|もっと}も{近|ちか}いのはどれか。', '{主|おも}な{内容|ないよう}', ['{最初|さいしょ}の{部分|ぶぶん}', '{使|つか}った{資料|しりょう}', '{書|か}いた{人|ひと}の{名前|なまえ}'], '**{要旨|ようし}** = ý chính / nội dung chính.'),
        MQ('（　）、この{調査|ちょうさ}の{対象|たいしょう}は{一|ひと}つの{大学|だいがく}に{限|かぎ}られている。（lưu ý ngoại lệ）', 'ただし', ['したがって', 'つまり', 'まず'], 'Nêu giới hạn / ngoại lệ → **ただし** (từ nối mục Viết).'),
      ],
    },
    {
      t: 'build',
      id: 'b52-bt-ghep',
      title: 'Ghép câu (10 câu) — mỗi câu có một mảnh thừa',
      items: [
        { vi: 'Hãy suy nghĩ kỹ rồi mới trả lời.', chips: ['よく', '{考|かんが}えた', '{上|うえ}で', '{答|こた}えてください', '{考|かんが}える'], answer: ['よく', '{考|かんが}えた', '{上|うえ}で', '{答|こた}えてください'], ro: 'Yoku kangaeta ue de kotaete kudasai.' },
        { vi: 'Khi học ngoại ngữ, đều đặn mỗi ngày là quan trọng.', chips: ['{外国語|がいこくご}を{学|まな}ぶ', '{上|うえ}で', '{毎日|まいにち}{続|つづ}けることが', '{大切|たいせつ}だ', 'うえに'], answer: ['{外国語|がいこくご}を{学|まな}ぶ', '{上|うえ}で', '{毎日|まいにち}{続|つづ}けることが', '{大切|たいせつ}だ'], ro: 'Gaikokugo o manabu ue de mainichi tsuzukeru koto ga taisetsu da.' },
        { vi: 'Về mặt thời gian thì tự do, nhưng khó tập trung.', chips: ['{時間|じかん}の', '{面|めん}では', '{自由|じゆう}だが', '{集中|しゅうちゅう}しにくい', '{点|てん}に'], answer: ['{時間|じかん}の', '{面|めん}では', '{自由|じゆう}だが', '{集中|しゅうちゅう}しにくい'], ro: 'Jikan no men de wa jiyuu da ga, shuuchuu shinikui.' },
        { vi: 'Hai phương án giống nhau ở điểm không tốn chi phí.', chips: ['{二|ふた}つの{案|あん}は', '{費用|ひよう}がかからない', 'という{点|てん}では', '{同|おな}じだ', 'の{面|めん}では'], answer: ['{二|ふた}つの{案|あん}は', '{費用|ひよう}がかからない', 'という{点|てん}では', '{同|おな}じだ'], ro: 'Futatsu no an wa hiyou ga kakaranai to iu ten de wa onaji da.' },
        { vi: 'Phần lớn người trả lời là sinh viên năm nhất. (văn viết)', chips: ['{回答者|かいとうしゃ}の', '{多|おお}くは', '{一年生|いちねんせい}', 'であった', 'でした'], answer: ['{回答者|かいとうしゃ}の', '{多|おお}くは', '{一年生|いちねんせい}', 'であった'], ro: 'Kaitousha no ooku wa ichinensei de atta.' },
        { vi: 'Vấn đề này có lẽ từ nay sẽ càng nghiêm trọng. (văn viết)', chips: ['この{問題|もんだい}は', '{今後|こんご}さらに', '{深刻|しんこく}になる', 'であろう', 'でしょう'], answer: ['この{問題|もんだい}は', '{今後|こんご}さらに', '{深刻|しんこく}になる', 'であろう'], ro: 'Kono mondai wa kongo sara ni shinkoku ni naru de arou.' },
        { vi: 'Người lãnh đạo phải công bằng với bất kỳ ai.', chips: ['リーダーは', '{誰|だれ}に{対|たい}しても', '{公平|こうへい}で', 'あるべきだ', 'べきだ'], answer: ['リーダーは', '{誰|だれ}に{対|たい}しても', '{公平|こうへい}で', 'あるべきだ'], ro: 'Riidaa wa dare ni taishite mo kouhei de aru beki da.' },
        { vi: 'Không nên đánh giá con người qua một lần thất bại.', chips: ['{一度|いちど}の{失敗|しっぱい}で', '{人|ひと}を', '{判断|はんだん}す', 'べきではない', 'ないべきだ'], answer: ['{一度|いちど}の{失敗|しっぱい}で', '{人|ひと}を', '{判断|はんだん}す', 'べきではない'], ro: 'Ichido no shippai de hito o handan subeki de wa nai.' },
        { vi: 'Nhà nghiên cứu phải trung thực với dữ liệu.', chips: ['{研究者|けんきゅうしゃ}は', 'データに{対|たい}して', '{誠実|せいじつ}で', 'あらねばならない', 'ありねばならない'], answer: ['{研究者|けんきゅうしゃ}は', 'データに{対|たい}して', '{誠実|せいじつ}で', 'あらねばならない'], ro: 'Kenkyuusha wa deeta ni taishite seijitsu de araneba naranai.' },
        { vi: 'Phân tích các vấn đề rồi mới đề xuất biện pháp cải thiện.', chips: ['{問題点|もんだいてん}を', '{分析|ぶんせき}した', '{上|うえ}で', '{改善策|かいぜんさく}を{提案|ていあん}する', '{分析|ぶんせき}する'], answer: ['{問題点|もんだいてん}を', '{分析|ぶんせき}した', '{上|うえ}で', '{改善策|かいぜんさく}を{提案|ていあん}する'], ro: 'Mondaiten o bunseki shita ue de kaizensaku o teian suru.' },
      ],
    },
  ],
};

/* ═══════════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════════ */

const BUOI_1: Lesson = {
  id: 'b52-buoi-1-ue-de',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 52 (N2): từ mới bố cục & nghiên cứu · ～た上で (rồi mới) · ～る上で (khi làm…) + bảng 上で・てから・うえに · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng câu hỏi "Khi viết báo cáo em bắt đầu từ đâu?" (ôn ～てから, ～後で, ～ために, ～うえに), học từ nhóm A (bố cục & soạn thảo) và nhóm B (nghiên cứu & phương pháp), dùng ～た上で cho "làm A cẩn thận rồi mới B" và ～る上で cho "khi làm V thì điều gì quan trọng", phân biệt với てから và うえに, nhận ra N上 / ～上では, đọc hội thoại ① (cô 佐藤 trả bài cho リン) và luyện cặp.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — giáo viên hỏi: "Khi viết レポート, các em bắt đầu từ việc gì?" Các em trả lời bằng câu đã học: **～てから** (N5), **～た{後|あと}で** (N4), **～ために** (Bài 21). Giáo viên: "Hôm nay ta học cách nói thứ tự **trang trọng hơn**, kiểu người viết báo cáo: **～た{上|うえ}で**."',
        '**Từ mới (13′)** — nhóm A (bố cục: {序論|じょろん}, {本論|ほんろん}, {構成|こうせい}, {章|しょう}, {段落|だんらく}, {見出|みだ}し, {要旨|ようし}, {要約|ようやく}, {概要|がいよう}, {箇条書|かじょうが}き, {冒頭|ぼうとう}, {末尾|まつび}, {字数|じすう}, {執筆|しっぴつ}) + nhóm B (nghiên cứu: {先行研究|せんこうけんきゅう}, {考察|こうさつ}, {手法|しゅほう}, {範囲|はんい}, {前提|ぜんてい}, {枠組|わくぐ}み, {実証|じっしょう}, {示唆|しさ}, {明|あき}らかにする, {概念|がいねん}, {典型的|てんけいてき}, {普遍的|ふへんてき}, {段階|だんかい}).',
        '**Ngữ pháp (20′)** — ① **～た{上|うえ}で** (rồi mới) · **～る{上|うえ}で** (khi làm…) · nhận ra **N{上|じょう}** / **～{上|うえ}では** · phân biệt **た{上|うえ}で ↔ てから ↔ うえに** (bảng ⑥).',
        '**Hội thoại (7′)** — ① cô 佐藤 trả bản báo cáo giữa kỳ đầy vết đỏ cho リン.',
        '**チャレンジ (5′)** — luyện cặp "trả bài": A (giảng viên) đưa yêu cầu bằng **～た{上|うえ}で**, B (sinh viên) hỏi bằng **～る{上|うえ}で**. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b52-b1-slides',
      title: 'Bài 52 レポート — Buổi 1: 上で',
      slides: [
        {
          tieuDe: '{第|だい}52{課|か} レポート',
          anh: ['page-facing-up', 'writing-hand', 'books', 'woman-teacher'],
          nhan: ['レポート', '{執筆|しっぴつ}', '{文献|ぶんけん}', '{先生|せんせい}'],
          dong: ['Hôm nay: **～{上|うえ}で** (た上で = rồi mới · る上で = khi làm…)'],
          ro: ['~ ue de'],
          ghi: 'Bài 52 là bài thứ hai của chặng cuối N2 (51–55). Chủ đề: viết — báo cáo ở trường, báo cáo công việc, trích dẫn. Năm mẫu: 上で, 面で, である体, べきだ, ねばならない. Buổi 1: 上で. Trọng tâm cả bài là KỸ NĂNG VIẾT — mục Viết là mục nặng nhất, buổi 3 sẽ dựng bố cục một bản レポート.',
        },
        {
          tieuDe: 'できること — Học xong Bài 52 làm được gì?',
          anh: ['woman-teacher', 'office-building', 'man-student'],
          nhan: ['52-1 {中間|ちゅうかん}レポート', '52-2 {報告書|ほうこくしょ}', '52-3 {寮|りょう}で{相談|そうだん}'],
          dong: ['データを{示|しめ}した{上|うえ}で、{考|かんが}えを{述|の}べる。', '{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきだ。', '{経済的|けいざいてき}な{面|めん}と{学業|がくぎょう}の{面|めん}から{考|かんが}える。'],
          ro: ['Deeta o shimeshita ue de, kangae o noberu.', 'Ketsuron wa boutou ni kaku beki da.', 'Keizaiteki na men to gakugyou no men kara kangaeru.'],
          ghi: 'Ba buổi đi đúng ba tình huống: buổi 1 上で (cô 佐藤 trả bài cho リン), buổi 2 面で + である体 (báo cáo công việc của ワン), buổi 3 べきだ + ねばならない + bố cục レポート (マリヤム và ダニエル). Cuối bài: trình bày 1 phút và một bản レポート 800–1.200 chữ.',
        },
        {
          tieuDe: 'Khởi động — どこから{始|はじ}める？',
          anh: ['books', 'right-arrow', 'writing-hand'],
          nhan: ['{読|よ}む', '→', '{書|か}く'],
          dong: ['{本|ほん}を{読|よ}んでから、{書|か}き{始|はじ}めます。', '{授業|じゅぎょう}が{終|お}わった{後|あと}で、{図書館|としょかん}に{行|い}きます。', 'いいレポートを{書|か}くために、{資料|しりょう}を{集|あつ}めます。'],
          ro: ['Hon o yonde kara, kakihajimemasu.', 'Jugyou ga owatta ato de, toshokan ni ikimasu.', 'Ii repooto o kaku tame ni, shiryou o atsumemasu.'],
          hoi: 'レポートを{書|か}く{時|とき}、{何|なに}から{始|はじ}めますか。',
          dap: '（{例|れい}）まず{本|ほん}や{論文|ろんぶん}を{読|よ}んでから、{書|か}き{始|はじ}めます。',
          ghi: 'Gọi 3–4 bạn. Ghi lên bảng các bước các em nói (đọc → ghi chú → viết). Slide 6 sẽ nối hai bước bằng た上で và hỏi: "Bước đọc có phải là bước BẮT BUỘC trước khi viết không?"',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — レポートの{形|かたち}',
          anh: ['open-book', 'bookmark-tabs', 'memo', 'scissors'],
          nhan: ['{章|しょう}', '{見出|みだ}し', '{箇条書|かじょうが}き', '{要約|ようやく}'],
          dong: ['{序論|じょろん}・{本論|ほんろん}・{結論|けつろん}', '{構成|こうせい}を{考|かんが}える ・ {見出|みだ}しをつける', '{要旨|ようし}をまとめる ・ {内容|ないよう}を{要約|ようやく}する', '{冒頭|ぼうとう}で{述|の}べる ・ {末尾|まつび}に{書|か}く'],
          ro: ['Joron, honron, ketsuron', 'Kousei o kangaeru · midashi o tsukeru', 'Youshi o matomeru · naiyou o youyaku suru', 'Boutou de noberu · matsubi ni kaku'],
          hoi: '「{要旨|ようし}」と「{要約|ようやく}」はどう{違|ちが}いますか。',
          dap: '{要旨|ようし}は{書|か}いた{人|ひと}が{一番|いちばん}{言|い}いたいこと、{要約|ようやく}は{内容|ないよう}を{短|みじか}くまとめたものです。',
          ghi: 'Nhóm A — dạy bằng một bản レポート thật dán lên bảng: dán nhãn 序論 / 本論 (章, 見出し) / 結論 / 参考文献 (末尾). Cảnh báo đọc: 第一章 = だいいっしょう (âm ngắt), 箇条書き = かじょうがき (が đục).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {研究|けんきゅう}の{言葉|ことば}',
          anh: ['magnifying-glass-tilted-left', 'light-bulb', 'framed-picture', 'ladder'],
          nhan: ['{考察|こうさつ}', '{示唆|しさ}', '{枠組|わくぐ}み', '{段階|だんかい}'],
          dong: ['{先行研究|せんこうけんきゅう}を{整理|せいり}する', '{結果|けっか}を{考察|こうさつ}する ・ ～を{示唆|しさ}する', '{範囲|はんい}を{限|かぎ}る ・ ～を{前提|ぜんてい}にする', '{原因|げんいん}を{明|あき}らかにする'],
          ro: ['Senkou kenkyuu o seiri suru', 'Kekka o kousatsu suru · ~ o shisa suru', 'Han\'i o kagiru · ~ o zentei ni suru', 'Gen\'in o akiraka ni suru'],
          hoi: '「{考察|こうさつ}」と「{感想|かんそう}」の{違|ちが}いは{何|なん}ですか。',
          dap: '{考察|こうさつ}には{根拠|こんきょ}がありますが、{感想|かんそう}は{自分|じぶん}の{気持|きも}ちです。',
          ghi: 'Nhóm B — dạy theo quy trình nghiên cứu (đọc 先行研究 → 範囲・前提 → 手法 → 実証 → 考察 → 明らかにする). Nhấn: 示唆 = cho thấy GIÁN TIẾP; 示す = cho thấy rõ (Bài 28).',
        },
        {
          tieuDe: 'ポイント① — Vた{上|うえ}で：rồi mới',
          anh: ['speaking-head', 'right-arrow', 'check-mark-button'],
          nhan: ['{相談|そうだん}した', '{上|うえ}で', '{決|き}める'],
          dong: ['{両親|りょうしん}と{相談|そうだん}した{上|うえ}で、{決|き}めます。', 'ご{確認|かくにん}の{上|うえ}、お{申|もう}し{込|こ}みください。', 'Vた／Nの ＋ {上|うえ}で → làm A cẩn thận RỒI MỚI B'],
          ro: ['Ryoushin to soudan shita ue de, kimemasu.', 'Gokakunin no ue, omoushikomi kudasai.', 'V-ta / N no + ue de'],
          hoi: '{留学|りゅうがく}するかどうか、どうやって{決|き}めますか。（た{上|うえ}で）',
          dap: '{家族|かぞく}とよく{話|はな}し{合|あ}った{上|うえ}で、{決|き}めます。',
          ghi: 'Vẽ hai bậc thang: bậc dưới = A (bước cần có), bậc trên = B (quyết định). "上" = đứng TRÊN nền A. Vế B là hành động có chủ ý: 決める・答える・申し込む・サインする. Danh từ hành động: 相談の上・確認の上・検討の上 (văn thông báo hay bỏ で).',
        },
        {
          tieuDe: 'ポイント① — Vる{上|うえ}で：khi làm…',
          anh: ['office-building', 'speaking-head'],
          nhan: ['{働|はたら}く{上|うえ}で', '{敬語|けいご}'],
          dong: ['{日本|にほん}で{働|はたら}く{上|うえ}で、{敬語|けいご}は{欠|か}かせない。', '{論文|ろんぶん}を{書|か}く{上|うえ}で{大切|たいせつ}なのは、{問|と}いを{立|た}てることだ。', 'Vる／Nの ＋ {上|うえ}で → khi / trong việc làm V thì (đánh giá)'],
          ro: ['Nihon de hataraku ue de, keigo wa kakasenai.', 'Ronbun o kaku ue de taisetsu na no wa, toi o tateru koto da.', 'V-ru / N no + ue de'],
          hoi: '{日本語|にほんご}を{勉強|べんきょう}する{上|うえ}で、{何|なに}が{一番|いちばん}{大切|たいせつ}だと{思|おも}いますか。',
          dap: '{毎日|まいにち}{続|つづ}けることが{一番|いちばん}{大切|たいせつ}だと{思|おも}います。',
          ghi: 'Viết hai câu cạnh nhau, khoanh thể động từ: 働いた上で (rồi mới) ↔ 働く上で (khi làm). Vế sau của る上で là ĐÁNH GIÁ: 大切だ・必要だ・欠かせない・役に立つ・問題がある.',
        },
        {
          tieuDe: 'た{上|うえ}で ↔ てから ↔ うえに',
          bang: {
            head: ['Mẫu', 'Dùng khi', 'Ví dụ'],
            rows: [
              ['Vた{上|うえ}で', 'A là bước CẦN CÓ → B có chủ ý', '{相談|そうだん}した{上|うえ}で{決|き}める'],
              ['Vてから', 'chỉ thứ tự thời gian', '{手|て}を{洗|あら}ってから{食|た}べる'],
              ['～うえに (Bài 29)', 'cộng thêm ý cùng chiều', '{安|やす}いうえにおいしい'],
              ['Vる{上|うえ}で', 'khi làm V thì (đánh giá)', '{働|はたら}く{上|うえ}で{大切|たいせつ}だ'],
            ],
          },
          hoi: '「ご{飯|はん}を{食|た}べた{上|うえ}で、{歯|は}を{磨|みが}く」は{自然|しぜん}ですか。',
          dap: 'いいえ。ただの{順番|じゅんばん}なので、「{食|た}べてから」が{自然|しぜん}です。',
          ghi: 'Bẫy đề N2: 上で ↔ うえに (khác một chữ!). Mẹo: có に + hai ý cùng chiều (tốt + tốt) → うえに.',
        },
        {
          tieuDe: 'Nhận ra — N{上|じょう}・～{上|うえ}では',
          dong: ['{健康上|けんこうじょう}の{理由|りゆう}で、{会社|かいしゃ}を{辞|や}めた。', '{暦|こよみ}の{上|うえ}ではもう{春|はる}だが、まだ{寒|さむ}い。'],
          ro: ['Kenkoujou no riyuu de, kaisha o yameta.', 'Koyomi no ue de wa mou haru da ga, mada samui.'],
          ghi: 'N上 đọc じょう, dính liền danh từ Hán: 法律上・健康上・教育上・歴史上. ～上では = "theo (con số, lịch, sổ sách)" — thường hàm ý thực tế khác. Chỉ cần nhận ra khi đọc.',
        },
        {
          tieuDe: '{会話|かいわ}① — {中間|ちゅうかん}レポートの{赤|あか}ペン',
          anh: ['woman-teacher', 'page-facing-up', 'woman-student'],
          nhan: ['{佐藤先生|さとうせんせい}', '{中間|ちゅうかん}レポート', 'リン'],
          dong: ['{内容|ないよう}の{面|めん}では、よく{書|か}けています。', 'データを{示|しめ}した{上|うえ}で、{考|かんが}えを{述|の}べてください。', '{先行研究|せんこうけんきゅう}を{読|よ}んだ{上|うえ}で、{書|か}き{直|なお}します。'],
          ro: ['Naiyou no men de wa, yoku kakete imasu.', 'Deeta o shimeshita ue de, kangae o nobete kudasai.', 'Senkou kenkyuu o yonda ue de, kakinaoshimasu.'],
          hoi: '{先生|せんせい}はリンさんに{何|なに}を{直|なお}すように{言|い}いましたか。',
          dap: '{話|はな}し{言葉|ことば}が{混|ま}じっているので、だ・である{体|たい}で{統一|とういつ}するように{言|い}いました。',
          ghi: 'Nghe 2 lần không nhìn chữ. Hỏi: cô khen mặt nào, chê mặt nào (面で — buổi 2 học kỹ). Đếm số lần た上で trong hội thoại (3 lần) và る上で (1 lần — câu của カルロス).',
        },
        {
          tieuDe: 'チャレンジ — {赤|あか}ペンロールプレイ',
          anh: ['woman-teacher', 'man-student'],
          nhan: ['A：{先生|せんせい}', 'B：{学生|がくせい}'],
          dong: ['A：{二|ふた}つの{面|めん}から{評価|ひょうか}する → ～た{上|うえ}で{直|なお}してください', 'B：～る{上|うえ}で、{何|なに}に{気|き}をつければいいですか'],
          ro: ['A: futatsu no men kara hyouka suru → ~ta ue de naoshite kudasai', 'B: ~ru ue de, nani ni ki o tsukereba ii desu ka'],
          hoi: '（ペアで）レポートを{書|か}く{上|うえ}で、{気|き}をつけることは{何|なん}ですか。',
          dap: '{意見|いけん}を{書|か}く{時|とき}は、データを{示|しめ}した{上|うえ}で{書|か}くことです。',
          ghi: '3 phút mỗi vai. Giáo viên đi quanh nghe: lỗi hay gặp nhất là nói 上で mà vế sau không phải hành động có chủ ý, và nhầm thể (働いた上で大切だ).',
        },
        {
          tieuDe: 'まとめ — Buổi 1',
          anh: ['check-mark-button'],
          nhan: ['ポイント'],
          dong: ['Vた{上|うえ}で：rồi mới (B là hành động có chủ ý)', 'Vる{上|うえ}で：khi làm V thì (đánh giá)', 'うえに：cộng thêm (Bài 29) — KHÁC 上で'],
          ro: ['V-ta ue de', 'V-ru ue de', 'ue ni'],
          ghi: 'Bài về nhà: viết 5 câu ～た上で về kế hoạch của mình (thi cử, chọn việc, du học) + 3 câu ～る上で (điều quan trọng khi học / làm thêm / viết báo cáo) + thuộc 27 từ nhóm A, B. Buổi sau kiểm tra miệng đầu giờ.',
        },
      ],
    },
    {
      t: 'p',
      text: 'Giáo viên dán lên bảng một bản báo cáo in sẵn, có mấy chỗ bút đỏ: "**データは？**" "**話し言葉！**" "**出典は？**". Hỏi cả lớp: "Nếu được trả lại bài như thế này, các em sẽ làm gì TRƯỚC, làm gì SAU?" Cả lớp nói, giáo viên ghi hai cột: **TRƯỚC** ({資料|しりょう}を{読|よ}む・データを{集|あつ}める) | **SAU** ({書|か}き{直|なお}す・{出|だ}す). Rồi nối bằng mũi tên và viết ở giữa: **～た{上|うえ}で、～**. "Đó là câu N2 đầu tiên của hôm nay."',
    },
    {
      t: 'mcq',
      id: 'b52-b1-khoi-dong',
      title: 'Khởi động — ôn mẫu đã học (4 câu)',
      items: [
        MQ('{手|て}を{洗|あら}って（　）、ご{飯|はん}を{食|た}べましょう。（N5 — thứ tự）', 'から', ['ために', 'うえに', 'のに'], 'Thứ tự đơn giản → **Vてから**.'),
        MQ('{留学|りゅうがく}する（　）、お{金|かね}をためている。（Bài 21 — mục đích）', 'ために', ['{上|うえ}で', 'うえに', 'てから'], 'Mục đích của hành động (ためている) → **ために**.'),
        MQ('この{部屋|へや}は{広|ひろ}い（　）、{駅|えき}からも{近|ちか}い。（Bài 29 — cộng thêm）', 'うえに', ['{上|うえ}で', 'ために', 'てから'], 'Hai ý tốt cộng thêm → **うえに** (Bài 29).'),
        MQ('お{申|もう}し{込|こ}みの（　）は、{身分証明書|みぶんしょうめいしょ}をお{持|も}ちください。（Bài 41 — khi, vào dịp）', '{際|さい}', ['{上|うえ}', 'ため', 'うえに'], 'Văn thông báo "khi / vào dịp" → **Nの{際|さい}は** (Bài 41). Hôm nay học một mẫu trang trọng khác: ～た上で.'),
      ],
    },
    { t: 'h', text: 'Slide 4–5 — Từ mới: bố cục & nghiên cứu' },
    {
      t: 'p',
      text: 'Giáo viên vẽ một tờ A4 lên bảng, chia thành các khối: **{表紙|ひょうし}** → **{序論|じょろん}** (đoạn **{冒頭|ぼうとう}**) → **{本論|ほんろん}** (hai **{章|しょう}**, mỗi chương một **{見出|みだ}し**, trong chương có các **{段落|だんらく}**) → **{結論|けつろん}** → **{参考文献|さんこうぶんけん}** (ở **{末尾|まつび}**). Bên cạnh vẽ một mũi tên quy trình nghiên cứu: **{先行研究|せんこうけんきゅう}** → **{範囲|はんい}・{前提|ぜんてい}** → **{手法|しゅほう}** → **{実証|じっしょう}** → **{考察|こうさつ}** → **{明|あき}らかにする**. Học sinh đọc to từng nhãn rồi đặt câu.',
    },
    {
      t: 'examples',
      items: [
        E('{書|か}き{始|はじ}める{前|まえ}に、レポートの{構成|こうせい}を{考|かんが}えよう。', 'Kakihajimeru mae ni, repooto no kousei o kangaeyou.', 'Trước khi bắt đầu viết, hãy nghĩ bố cục bài báo cáo.'),
        E('{論文|ろんぶん}の{最初|さいしょ}に、{要旨|ようし}をつけること。', 'Ronbun no saisho ni, youshi o tsukeru koto.', 'Ở đầu luận văn phải kèm bản tóm tắt.'),
        E('{結果|けっか}を{示|しめ}した{上|うえ}で、その{原因|げんいん}を{考察|こうさつ}する。', 'Kekka o shimeshita ue de, sono gen\'in o kousatsu suru.', 'Trình bày kết quả rồi mới bàn luận nguyên nhân.'),
        E('この{結果|けっか}は、{睡眠|すいみん}と{成績|せいせき}の{関係|かんけい}を{示唆|しさ}している。', 'Kono kekka wa, suimin to seiseki no kankei o shisa shite iru.', 'Kết quả này cho thấy mối quan hệ giữa giấc ngủ và thành tích.'),
      ],
    },
    { t: 'h', text: 'Slide 6–9 — 上で: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b52-b1-noi-tu',
      title: 'Luyện nhanh — điền mẫu (8 câu)',
      kind: 'fill',
      items: [
        { q: '{家族|かぞく}と{相談|そうだん}した（　　）で、{返事|へんじ}をします。', answers: V('{上|うえ}'), hint: 'Vた＋上で' },
        { q: '{内容|ないよう}をよく（　　）{上|うえ}で、サインしてください。（đọc — thể た）', answers: V('{読|よ}んだ'), hint: 'よんだ うえで' },
        { q: 'ご{確認|かくにん}の（　　）、お{申|もう}し{込|こ}みください。', answers: V('{上|うえ}'), hint: 'Nの上' },
        { q: '{日本|にほん}で{働|はたら}く（　　）で、{敬語|けいご}は{欠|か}かせない。', answers: V('{上|うえ}'), hint: 'Vる＋上で' },
        { q: 'レポートを（　　）{上|うえ}で{大切|たいせつ}なのは、{根拠|こんきょ}を{示|しめ}すことだ。（viết — thể từ điển）', answers: V('{書|か}く'), hint: 'かく うえで' },
        { q: '{仕事|しごと}の（　　）で{困|こま}ったことがあれば、{相談|そうだん}してください。', answers: V('{上|うえ}'), hint: 'Nの上で' },
        { q: 'この{店|みせ}は{安|やす}い（　　）、おいしい。（cộng thêm — Bài 29）', answers: V('うえに', '{上|うえ}に'), hint: 'うえに' },
        { q: '{手|て}を{洗|あら}って（　　）、{食|た}べてください。（thứ tự đơn giản）', answers: ['から'], hint: 'てから' },
      ],
    },
    {
      t: 'quiz',
      id: 'b52-b1-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: 'Vた／Nの＋上で（rồi mới）· Vる／Nの＋上で（khi làm…）',
      items: [
        { q: 'Tôi sẽ bàn với bố mẹ rồi mới quyết định.', answers: V('{両親|りょうしん}と{相談|そうだん}した{上|うえ}で、{決|き}めます。', '{両親|りょうしん}と{相談|そうだん}した{上|うえ}で{決|き}める。', '{親|おや}と{相談|そうだん}した{上|うえ}で、{決|き}めます。'), hint: 'りょうしんと そうだんした うえで、きめます' },
        { q: 'Đưa số liệu ra rồi mới trình bày ý kiến của mình.', answers: V('データを{示|しめ}した{上|うえ}で、{自分|じぶん}の{考|かんが}えを{述|の}べる。', 'データを{示|しめ}した{上|うえ}で、{自分|じぶん}の{考|かんが}えを{述|の}べます。', 'データを{示|しめ}した{上|うえ}で、{自分|じぶん}の{意見|いけん}を{述|の}べる。'), hint: 'データを しめした うえで、じぶんの かんがえを のべる' },
        { q: 'Tôi sẽ đọc thêm nghiên cứu đi trước rồi viết lại.', answers: V('{先行研究|せんこうけんきゅう}をもう{少|すこ}し{読|よ}んだ{上|うえ}で、{書|か}き{直|なお}します。', '{先行研究|せんこうけんきゅう}を{読|よ}んだ{上|うえ}で、{書|か}き{直|なお}します。', '{先行研究|せんこうけんきゅう}をもっと{読|よ}んだ{上|うえ}で、{書|か}き{直|なお}します。'), hint: 'せんこうけんきゅうを よんだ うえで、かきなおします' },
        { q: 'Khi làm việc ở Nhật, kính ngữ là không thể thiếu.', answers: V('{日本|にほん}で{働|はたら}く{上|うえ}で、{敬語|けいご}は{欠|か}かせない。', '{日本|にほん}で{働|はたら}く{上|うえ}で、{敬語|けいご}は{欠|か}かせません。'), hint: 'にほんで はたらく うえで、けいごは かかせない' },
        { q: 'Khi đọc nghiên cứu đi trước, có điều gì cần chú ý không ạ?', answers: V('{先行研究|せんこうけんきゅう}を{読|よ}む{上|うえ}で、{気|き}をつけることはありますか。', '{先行研究|せんこうけんきゅう}を{読|よ}む{上|うえ}で、{注意|ちゅうい}することはありますか。'), hint: 'せんこうけんきゅうを よむ うえで、きを つける ことは ありますか' },
        { q: 'Điều quan trọng nhất khi học ngoại ngữ là đều đặn mỗi ngày.', answers: V('{外国語|がいこくご}を{学|まな}ぶ{上|うえ}で{一番|いちばん}{大切|たいせつ}なのは、{毎日|まいにち}{続|つづ}けることだ。', '{外国語|がいこくご}を{学|まな}ぶ{上|うえ}で{最|もっと}も{大切|たいせつ}なのは、{毎日|まいにち}{続|つづ}けることだ。', '{外国語|がいこくご}を{勉強|べんきょう}する{上|うえ}で{一番|いちばん}{大切|たいせつ}なのは、{毎日|まいにち}{続|つづ}けることです。'), hint: 'がいこくごを まなぶ うえで いちばん たいせつなのは、まいにち つづける ことだ' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**① Thể た → "rồi mới"; thể từ điển → "khi làm"** — nhìn động từ trước 上で trước tiên.',
        '**② た上で: A là bước CẦN CÓ, B là hành động có chủ ý** — không dùng cho thứ tự vặt (→ てから) hay hiện tượng tự nhiên.',
        '**③ 上で ≠ うえに** — うえに (Bài 29) = không những… mà còn. Đề N2 rất hay đặt hai mẫu cạnh nhau.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「た{上|うえ}で」を{使|つか}って、{大事|だいじ}なことをどうやって{決|き}めるか{言|い}ってください。', ro: '"Ta ue de" o tsukatte, daiji na koto o dou yatte kimeru ka itte kudasai.', vi: 'Hãy dùng "ta ue de" nói xem em quyết định việc quan trọng như thế nào.' },
        { who: 'Bạn', role: 'candidate', text: '{大事|だいじ}なことは、いつも{家族|かぞく}や{先生|せんせい}に{相談|そうだん}した{上|うえ}で{決|き}めるようにしています。', ro: 'Daiji na koto wa, itsumo kazoku ya sensei ni soudan shita ue de kimeru you ni shite imasu.', vi: 'Việc quan trọng thì em luôn hỏi ý kiến gia đình và thầy cô rồi mới quyết.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'では、「る{上|うえ}で」を{使|つか}って、{日本|にほん}で{生活|せいかつ}する{時|とき}に{大切|たいせつ}なことを{言|い}ってください。', ro: 'De wa, "ru ue de" o tsukatte, Nihon de seikatsu suru toki ni taisetsu na koto o itte kudasai.', vi: 'Vậy dùng "ru ue de" nói điều quan trọng khi sống ở Nhật.' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}で{生活|せいかつ}する{上|うえ}で、{一番|いちばん}{大切|たいせつ}なのはルールを{守|まも}ることだと{思|おも}います。たとえば、ごみの{出|だ}し{方|かた}です。', ro: 'Nihon de seikatsu suru ue de, ichiban taisetsu na no wa ruuru o mamoru koto da to omoimasu. Tatoeba, gomi no dashikata desu.', vi: 'Em nghĩ khi sống ở Nhật, quan trọng nhất là giữ quy tắc. Ví dụ như cách đổ rác.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'いいですね。「た{上|うえ}で」と「る{上|うえ}で」は、{動詞|どうし}の{形|かたち}で{意味|いみ}が{変|か}わりますから、{気|き}をつけてください。', ro: 'Ii desu ne. "Ta ue de" to "ru ue de" wa, doushi no katachi de imi ga kawarimasu kara, ki o tsukete kudasai.', vi: 'Tốt lắm. "Ta ue de" và "ru ue de" đổi nghĩa theo thể của động từ, các em chú ý nhé.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b52-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        MQ('よく{考|かんが}えた（　）、{返事|へんじ}をしてください。', '{上|うえ}で', ['うえに', 'ために', 'から'], 'Vた + quyết định có chủ ý → **{上|うえ}で** (rồi mới).'),
        MQ('{子|こ}どもを{育|そだ}てる（　）、{一番|いちばん}{大切|たいせつ}なことは{何|なん}だろうか。', '{上|うえ}で', ['うえに', 'てから', 'た{後|あと}で'], 'V辞書形 + đánh giá (大切なこと) → **る{上|うえ}で**.'),
        MQ('このホテルは{駅|えき}から{近|ちか}い（　）、{朝|あさ}ご{飯|はん}もおいしい。', 'うえに', ['{上|うえ}で', 'ために', '{際|さい}に'], 'Cộng thêm ý tốt → **うえに** (Bài 29).'),
        MQ('{検討|けんとう}の（　）、ご{連絡|れんらく}いたします。', '{上|うえ}', ['うえに', '{一方|いっぽう}', 'まま'], 'Danh từ hành động + **の{上|うえ}** (văn thư công việc).'),
        MQ('「{上|うえ}で」の{使|つか}い{方|かた}が{正|ただ}しいのはどれか。', '{説明|せつめい}を{聞|き}いた{上|うえ}で、{参加|さんか}するかどうか{決|き}めます。', ['ご{飯|はん}を{食|た}べた{上|うえ}で、{歯|は}を{磨|みが}きます。', '{雨|あめ}が{降|ふ}った{上|うえ}で、{風|かぜ}が{吹|ふ}いた。', '{日本|にほん}で{働|はたら}いた{上|うえ}で、{敬語|けいご}は{大切|たいせつ}だ。'], 'Nghe giải thích (bước cần) → quyết định (có chủ ý) → đúng. Các câu kia: thứ tự vặt (→ てから); hiện tượng tự nhiên; nhầm thể (→ 働く上で).'),
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b52-buoi-2-men-de-de-aru',
  kind: 'review',
  title: 'Buổi 2 — ～面で (+ ～という点で · ～において) · だ・である体 (bảng chuyển + 中止形 + văn nói → văn viết) · từ mới văn viết & công việc · hội thoại ②',
  goal: 'Theo nhịp một buổi trên lớp: kiểm tra miệng ～た上で／る上で, học từ nhóm D (văn viết & diễn đạt) và nhóm E (báo cáo công việc & khía cạnh), đánh giá theo từng mặt bằng ～面で và phân biệt với ～という点で, ～において; đổi câu です・ます sang だ・である cho mọi loại câu, nối câu bằng 中止形, đổi văn nói sang văn viết; đọc hội thoại ② (trưởng phòng 森 sửa báo cáo của ワン) và luyện cặp.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — kiểm tra miệng: mỗi bạn một câu **～た{上|うえ}で** + một câu **～る{上|うえ}で**. Giáo viên cầm hai sản phẩm (hai chiếc điện thoại) hỏi: "Cái nào tốt hơn?" — các em sẽ thấy cần nói **"về MẶT nào"**.',
        '**Từ mới (12′)** — nhóm D (văn viết: {書|か}き{言葉|ことば}, {話|はな}し{言葉|ことば}, {文体|ぶんたい}, {統一|とういつ}, {簡潔|かんけつ}, {明確|めいかく}, {堅|かた}い, {記述|きじゅつ}, {補足|ほそく}, {留意|りゅうい}, きわめて, いわゆる, {前述|ぜんじゅつ}) + nhóm E (công việc: {報告書|ほうこくしょ}, {議事録|ぎじろく}, {進捗|しんちょく}, {費用対効果|ひようたいこうか}, {改善策|かいぜんさく}, {重視|じゅうし}, {視野|しや}, {徹底|てってい}, {模範|もはん}, {側面|そくめん}, {精神的|せいしんてき}, {出版|しゅっぱん}, {改訂|かいてい}).',
        '**Ngữ pháp (22′)** — ② **～{面|めん}で** ↔ **～という{点|てん}で** ↔ **～において** (bảng ⑦) · ③ **だ・である{体|たい}**: bảng chuyển, 中止形, ba lỗi hay gặp · bảng **văn nói → văn viết** (mười cặp đầu).',
        '**Hội thoại (6′)** — ② trưởng phòng 森 nhận xét báo cáo dùng thử công cụ AI của ワン; chị 鈴木 chỉ cách viết báo cáo công việc.',
        '**チャレンジ (5′)** — "sửa bút đỏ": mỗi cặp nhận một đoạn văn nói, đổi thành văn viết thể である. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b52-b2-slides',
      title: 'Bài 52 レポート — Buổi 2: 面で・である体',
      slides: [
        {
          tieuDe: '{第|だい}52{課|か} — Buổi 2',
          anh: ['balance-scale', 'fountain-pen', 'page-facing-up'],
          nhan: ['{面|めん}で', 'である{体|たい}', '{報告書|ほうこくしょ}'],
          dong: ['Hôm nay: **～{面|めん}で** (về mặt…) · **だ・である{体|たい}** (thể văn viết)'],
          ro: ['~ men de · da / de aru tai'],
          ghi: 'Buổi 2 gắn với tình huống ② (công ty さくらシステム). Mở bằng câu hỏi khởi động về 上で (buổi 1).',
        },
        {
          tieuDe: 'Khởi động — {上|うえ}で（{復習|ふくしゅう}）',
          anh: ['check-mark-button'],
          nhan: ['{復習|ふくしゅう}'],
          dong: ['{資料|しりょう}を{読|よ}んだ{上|うえ}で、{書|か}き{始|はじ}める。', 'レポートを{書|か}く{上|うえ}で、{出典|しゅってん}は{欠|か}かせない。'],
          ro: ['Shiryou o yonda ue de, kakihajimeru.', 'Repooto o kaku ue de, shutten wa kakasenai.'],
          hoi: '{就職|しゅうしょく}する{会社|かいしゃ}は、どうやって{決|き}めますか。',
          dap: '（{例|れい}）インターンで{働|はたら}いてみた{上|うえ}で、{決|き}めたいと{思|おも}います。',
          ghi: 'Gọi 4–5 bạn, mỗi bạn một câu た上で + một câu る上で. Sửa ngay lỗi thể (働いた上で大切だ ✗).',
        },
        {
          tieuDe: '{新|あたら}しいことば ③ — {書|か}き{言葉|ことば}',
          anh: ['speaking-head', 'fountain-pen', 'scissors', 'check-mark-button'],
          nhan: ['{話|はな}し{言葉|ことば}', '{書|か}き{言葉|ことば}', '{簡潔|かんけつ}', '{明確|めいかく}'],
          dong: ['{文体|ぶんたい}を{統一|とういつ}する', '{要点|ようてん}を{簡潔|かんけつ}にまとめる', '{結論|けつろん}を{明確|めいかく}に{書|か}く', '{前述|ぜんじゅつ}のとおり ・ {説明|せつめい}を{補足|ほそく}する'],
          ro: ['Buntai o touitsu suru', 'Youten o kanketsu ni matomeru', 'Ketsuron o meikaku ni kaku', 'Zenjutsu no toori · setsumei o hosoku suru'],
          hoi: '「{簡潔|かんけつ}」と「{簡単|かんたん}」はどう{違|ちが}いますか。',
          dap: '{簡潔|かんけつ}は{短|みじか}くて{要点|ようてん}がはっきりしていること、{簡単|かんたん}はやさしいことです。',
          ghi: 'Nhóm D — dạy như "bút đỏ của giảng viên": 文体を統一しなさい / もっと簡潔に / 結論を明確に / 少し堅すぎる / ここに補足を. Nhắc: 堅い (văn cứng) ≠ 硬い (Bài 50 — vật cứng).',
        },
        {
          tieuDe: '{新|あたら}しいことば ④ — {仕事|しごと}の{言葉|ことば}',
          anh: ['page-facing-up', 'clipboard', 'chart-increasing', 'telescope'],
          nhan: ['{報告書|ほうこくしょ}', '{議事録|ぎじろく}', '{進捗|しんちょく}', '{視野|しや}'],
          dong: ['{報告書|ほうこくしょ}を{作成|さくせい}する ・ {議事録|ぎじろく}をとる', '{進捗|しんちょく}を{報告|ほうこく}する', '{経験|けいけん}を{重視|じゅうし}する ・ {視野|しや}が{広|ひろ}がる', '{管理|かんり}を{徹底|てってい}する'],
          ro: ['Houkokusho o sakusei suru · gijiroku o toru', 'Shinchoku o houkoku suru', 'Keiken o juushi suru · shiya ga hirogaru', 'Kanri o tettei suru'],
          hoi: '{新人|しんじん}が{会議|かいぎ}でよく{頼|たの}まれる{仕事|しごと}は{何|なん}ですか。',
          dap: '{議事録|ぎじろく}をとることです。',
          ghi: 'Nhóm E — dạy theo một ngày ở công ty IT. 進捗 (chữ 捗 khó) chỉ cần đọc được; 費用対効果 = cost-effectiveness.',
        },
        {
          tieuDe: 'ポイント② — ～{面|めん}で：về mặt…',
          anh: ['balance-scale'],
          nhan: ['{二|ふた}つの{面|めん}'],
          dong: ['{費用|ひよう}の{面|めん}では{問題|もんだい}ないが、{安全面|あんぜんめん}に{不安|ふあん}がある。', '{両親|りょうしん}は{経済的|けいざいてき}な{面|めん}で{支|ささ}えてくれた。', 'Nの{面|めん}で · N{面|めん}で · ～{的|てき}な{面|めん}で'],
          ro: ['Hiyou no men de wa mondai nai ga, anzenmen ni fuan ga aru.', 'Ryoushin wa keizaiteki na men de sasaete kureta.', 'N no men de · N-men de · ~teki na men de'],
          hoi: 'あなたの{国|くに}と{日本|にほん}の{生活|せいかつ}を、{二|ふた}つの{面|めん}から{比|くら}べてください。',
          dap: '{交通|こうつう}の{面|めん}では{日本|にほん}のほうが{便利|べんり}ですが、{物価|ぶっか}の{面|めん}では{私|わたし}の{国|くに}のほうが{安|やす}いです。',
          ghi: 'Vẽ khối hộp, mỗi mặt một nhãn (費用・安全・効果・精神). Cặp đối chiếu: A の面では～が、B の面では～ — chính là cách 森課長 nhận xét. 面 trong từ ghép đọc めん.',
        },
        {
          tieuDe: '{面|めん} ↔ {点|てん} ↔ において',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Ví dụ'],
            rows: [
              ['Nの{面|めん}で', 'về MẶT (phương diện rộng)', '{安全|あんぜん}の{面|めん}で{問題|もんだい}がある'],
              ['～という{点|てん}で', 'ở ĐIỂM (tiêu chí cụ thể, có mệnh đề)', '{軽|かる}いという{点|てん}で{優|すぐ}れている'],
              ['Nにおいて／における N', 'ở, trong (văn viết của で)', '{本社|ほんしゃ}において{行|おこな}われる'],
              ['N{上|じょう}', 'về mặt (dính liền danh từ Hán)', '{法律上|ほうりつじょう}の{問題|もんだい}'],
            ],
          },
          hoi: '「{使|つか}いやすい（　）で、このスマホを{選|えら}んだ」— {面|めん}と{点|てん}、どちらが{自然|しぜん}ですか。',
          dap: '「{使|つか}いやすいという{点|てん}で」が{自然|しぜん}です。',
          ghi: 'Mẹo: trước chỗ trống là MỆNH ĐỀ + という → 点; là LĨNH VỰC rộng → 面. において: chỉ dùng cho văn viết, sự kiện chính thức.',
        },
        {
          tieuDe: 'ポイント③ — だ・である{体|たい}',
          bang: {
            head: ['', 'です・ます', 'だ・である'],
            rows: [
              ['N・ナA', '{学生|がくせい}です・{重要|じゅうよう}です', '{学生|がくせい}だ／である・{重要|じゅうよう}だ／である'],
              ['quá khứ', '{学生|がくせい}でした', '{学生|がくせい}だった／であった'],
              ['イA', '{高|たか}いです', '{高|たか}い（✗だ ✗である）'],
              ['V', '{増|ふ}えました', '{増|ふ}えた（✗である）'],
              ['のです', '{増|ふ}えたのです', '{増|ふ}えたのだ／のである'],
              ['でしょう', '{増|ふ}えるでしょう', '{増|ふ}えるだろう／であろう'],
            ],
          },
          hoi: '「{参加者|さんかしゃ}が{多|おお}いです」をだ・である{体|たい}にしてください。',
          dap: '「{参加者|さんかしゃ}が{多|おお}い。」です。イ{形容詞|けいようし}には「だ」も「である」もつけません。',
          ghi: 'Chép bảng lên góc bảng — giữ cả buổi. Ba chỗ hay sai: イA/V + である; のです → のである; でしょう → だろう/であろう.',
        },
        {
          tieuDe: 'である{体|たい} — {中止形|ちゅうしけい}（{文|ぶん}をつなぐ）',
          dong: ['{調査|ちょうさ}を{行|おこな}い、{結果|けっか}をまとめた。', '{家賃|やちん}が{高|たか}く、{生活|せいかつ}は{楽|らく}ではない。', '{東京|とうきょう}は{首都|しゅと}であり、{最大|さいだい}の{都市|とし}でもある。', '{辞書|じしょ}を{使|つか}わずに{読|よ}んだ。'],
          ro: ['Chousa o okonai, kekka o matometa.', 'Yachin ga takaku, seikatsu wa raku de wa nai.', 'Toukyou wa shuto de ari, saidai no toshi de mo aru.', 'Jisho o tsukawazu ni yonda.'],
          hoi: '「{人口|じんこう}が{減|へ}っていて、{対策|たいさく}が{必要|ひつよう}だ」を{書|か}き{言葉|ことば}にしてください。',
          dap: '{人口|じんこう}が{減|へ}っており、{対策|たいさく}が{必要|ひつよう}である。',
          ghi: 'Bảng nhỏ: て → (ます bỏ ます) · ていて → ており · くて → く · で → であり · ないで → ず(に) · しないで → せず(に).',
        },
        {
          tieuDe: '{話|はな}し{言葉|ことば} → {書|か}き{言葉|ことば}',
          bang: {
            head: ['{話|はな}し{言葉|ことば}', '{書|か}き{言葉|ことば}'],
            rows: [
              ['でも', 'しかし'],
              ['だから', 'したがって・そのため'],
              ['～けど', '～が'],
              ['すごく・とても', '{非常|ひじょう}に・きわめて'],
              ['ちゃんと', 'きちんと'],
              ['どんどん', '{急速|きゅうそく}に'],
              ['～とか', '～や～など'],
              ['～なきゃ', '～なければならない'],
            ],
          },
          hoi: '「でも、すごく{増|ふ}えた」をレポートの{文|ぶん}にしてください。',
          dap: 'しかし、{大幅|おおはば}に{増加|ぞうか}した。',
          ghi: 'Đây là đúng những chữ cô 佐藤 gạch đỏ trong bài của リン. Bảng đầy đủ 35 cặp ở mục Viết — giao về nhà học thuộc.',
        },
        {
          tieuDe: '{会話|かいわ}② — {報告書|ほうこくしょ}は{結論|けつろん}から',
          anh: ['man-office-worker', 'page-facing-up', 'woman-office-worker'],
          nhan: ['{森課長|もりかちょう}', '{報告書|ほうこくしょ}', 'ワン'],
          dong: ['{効果|こうか}の{面|めん}では、よくまとまっています。', '{導入|どうにゅう}を{判断|はんだん}する{上|うえ}で、{一番|いちばん}{大事|だいじ}なところです。', '{報告書|ほうこくしょ}は{結論|けつろん}が{先|さき}。'],
          ro: ['Kouka no men de wa, yoku matomatte imasu.', 'Dounyuu o handan suru ue de, ichiban daiji na tokoro desu.', 'Houkokusho wa ketsuron ga saki.'],
          hoi: 'レポートと{報告書|ほうこくしょ}の{書|か}き{方|かた}は、どう{違|ちが}いますか。',
          dap: 'レポートは{序論|じょろん}から{順番|じゅんばん}に{書|か}きますが、{報告書|ほうこくしょ}は{結論|けつろん}を{先|さき}に{書|か}きます。',
          ghi: 'Nghe 2 lần. Hỏi: trưởng phòng khen mặt nào (効果), điểm nào (作業時間が三割減った), chê mặt nào (費用・安全). Ghi chú: 面 = mặt rộng, 点 = điểm cụ thể.',
        },
        {
          tieuDe: 'チャレンジ — {赤|あか}ペンで{直|なお}そう',
          anh: ['writing-hand'],
          nhan: ['{書|か}き{直|なお}す'],
          dong: ['{話|はな}し{言葉|ことば}の{文|ぶん}を、だ・である{体|たい}に{直|なお}す', '{費用|ひよう}・{安全|あんぜん}・{効果|こうか}の{面|めん}から{評価|ひょうか}する'],
          ro: ['Hanashikotoba no bun o, da de aru tai ni naosu', 'Hiyou, anzen, kouka no men kara hyouka suru'],
          hoi: '「アンケートをとったけど、{答|こた}えた{人|ひと}は{少|すく}なかった」を{直|なお}してください。',
          dap: 'アンケートを{行|おこな}ったが、{回答者|かいとうしゃ}は{少|すく}なかった。',
          ghi: 'Phát mỗi cặp một đoạn 5 câu văn nói (về một khảo sát nhỏ). 5 phút sửa, rồi đổi bài cho cặp bên cạnh chấm bằng bảng ở slide 9.',
        },
        {
          tieuDe: 'まとめ — Buổi 2',
          anh: ['check-mark-button'],
          nhan: ['ポイント'],
          dong: ['Nの{面|めん}で：về mặt (rộng) · という{点|てん}で：ở điểm (cụ thể)', 'N・ナA＋である · イA・V：KHÔNG だ／である', 'でも→しかし · すごく→{非常|ひじょう}に · けど→が'],
          ro: ['N no men de · to iu ten de', 'N / na-A + de aru · i-A / V: da / de aru wa tsukenai', 'demo → shikashi · sugoku → hijou ni · kedo → ga'],
          ghi: 'Bài về nhà: viết lại một bài văn cũ của mình (Bài 41–49) sang thể である — ít nhất 10 câu, đánh dấu chỗ đã đổi; viết 3 câu ～面では～が、～面では～ so sánh hai thứ tự chọn. Học thuộc 26 từ nhóm D, E.',
        },
      ],
    },
    {
      t: 'p',
      text: 'Giáo viên giơ hai chiếc điện thoại: một chiếc rẻ nhưng pin yếu, một chiếc đắt nhưng camera đẹp. Hỏi: "Cái nào tốt hơn?" Cả lớp cãi nhau — vì mỗi người nói về một chuyện. Giáo viên viết lên bảng bốn chữ: **{価格|かかく}・{性能|せいのう}・デザイン・{安全|あんぜん}**, rồi thêm **の{面|めん}では** sau mỗi chữ. "Muốn so sánh cho công bằng thì phải nói **về MẶT nào**. Và khi viết vào báo cáo, cả câu phải ở **thể である**."',
    },
    {
      t: 'mcq',
      id: 'b52-b2-khoi-dong',
      title: 'Khởi động — ôn buổi 1 (4 câu)',
      items: [
        MQ('{内容|ないよう}をよく{確認|かくにん}した（　）、{提出|ていしゅつ}してください。', '{上|うえ}で', ['うえに', '{面|めん}で', 'ために'], 'Vた + nộp (có chủ ý) → **た{上|うえ}で**.'),
        MQ('{日本|にほん}で{暮|く}らす（　）、{日本語|にほんご}は{必要|ひつよう}だ。', '{上|うえ}で', ['うえに', 'た{上|うえ}で', '{面|めん}に'], 'V辞書形 + đánh giá (必要だ) → **る{上|うえ}で**.'),
        MQ('「{要約|ようやく}」の{意味|いみ}は？', '{内容|ないよう}を{短|みじか}くまとめること', ['{内容|ないよう}を{長|なが}く{説明|せつめい}すること', '{他人|たにん}の{文|ぶん}を{写|うつ}すこと', '{質問|しつもん}に{答|こた}えること'], '**{要約|ようやく}** = tóm tắt (từ nhóm A).'),
        MQ('{結果|けっか}の{原因|げんいん}を{根拠|こんきょ}に{基|もと}づいて{論|ろん}じることを{何|なん}と{言|い}うか。', '{考察|こうさつ}', ['{感想|かんそう}', '{目次|もくじ}', '{字数|じすう}'], '**{考察|こうさつ}** (có căn cứ) ≠ {感想|かんそう} (cảm nghĩ).'),
      ],
    },
    { t: 'h', text: 'Slide 3–4 — Từ mới: văn viết & công việc' },
    {
      t: 'examples',
      items: [
        E('レポートでは、{文体|ぶんたい}を{統一|とういつ}すること。', 'Repooto de wa, buntai o touitsu suru koto.', 'Trong báo cáo, phải thống nhất văn phong.'),
        E('{報告書|ほうこくしょ}は、{要点|ようてん}を{簡潔|かんけつ}にまとめる。', 'Houkokusho wa, youten o kanketsu ni matomeru.', 'Báo cáo công việc thì tóm ý chính ngắn gọn.'),
        E('{毎週|まいしゅう}{金曜日|きんようび}に、プロジェクトの{進捗|しんちょく}を{報告|ほうこく}する。', 'Maishuu kin\'youbi ni, purojekuto no shinchoku o houkoku suru.', 'Thứ Sáu hằng tuần báo cáo tiến độ dự án.'),
        E('この{会社|かいしゃ}は、{学歴|がくれき}より{経験|けいけん}を{重視|じゅうし}している。', 'Kono kaisha wa, gakureki yori keiken o juushi shite iru.', 'Công ty này coi trọng kinh nghiệm hơn bằng cấp.'),
      ],
    },
    { t: 'h', text: 'Slide 5–9 — 面で・である体: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b52-b2-noi-tu',
      title: 'Luyện nhanh — điền mẫu (8 câu)',
      kind: 'fill',
      items: [
        { q: 'この{計画|けいかく}は、{費用|ひよう}の（　　）で{問題|もんだい}がある。', answers: V('{面|めん}'), hint: 'Nの面で' },
        { q: '{両親|りょうしん}は{経済的|けいざいてき}（　　）{面|めん}で{支|ささ}えてくれた。', answers: ['な'], hint: '～的な面で' },
        { q: '{軽|かる}いという（　　）で、このパソコンを{選|えら}んだ。', answers: V('{点|てん}'), hint: '～という点で' },
        { q: '{卒業式|そつぎょうしき}は{講堂|こうどう}（　　）{行|おこな}われる。（văn viết của で）', answers: V('において'), hint: 'Nにおいて' },
        { q: '{回答者|かいとうしゃ}の{多|おお}くは{一年生|いちねんせい}（　　）。（である体・quá khứ）', answers: V('であった', 'だった'), hint: 'であった' },
        { q: 'この{傾向|けいこう}は{今後|こんご}も{続|つづ}く（　　）。（でしょう → である体）', answers: V('だろう', 'であろう'), hint: 'だろう／であろう' },
        { q: '（　　）、この{方法|ほうほう}には{問題|もんだい}もある。（でも → văn viết）', answers: V('しかし', 'だが'), hint: 'しかし' },
        { q: '{家賃|やちん}が{高|たか}（　　）、{生活|せいかつ}は{楽|らく}ではない。（高くて → 中止形）', answers: ['く'], hint: 'イAく、' },
      ],
    },
    {
      t: 'quiz',
      id: 'b52-b2-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: 'Nの面で（は）／N面で／～的な面で · ～という点で · だ・である体',
      items: [
        { q: 'Về mặt hiệu quả thì tổng hợp tốt.', answers: V('{効果|こうか}の{面|めん}では、よくまとまっています。', '{効果|こうか}の{面|めん}では、よくまとまっている。', '{効果|こうか}の{面|めん}ではよくまとまっています。'), hint: 'こうかの めんでは、よく まとまって います' },
        { q: 'Phần viết về mặt chi phí và mặt an toàn còn thiếu.', answers: V('{費用|ひよう}の{面|めん}と{安全面|あんぜんめん}の{記述|きじゅつ}が{足|た}りません。', '{費用|ひよう}の{面|めん}と{安全面|あんぜんめん}の{記述|きじゅつ}が{足|た}りない。', '{費用|ひよう}の{面|めん}と{安全|あんぜん}の{面|めん}の{記述|きじゅつ}が{足|た}りない。'), hint: 'ひようの めんと あんぜんめんの きじゅつが たりません' },
        { q: 'Về mặt thời gian thì tự do, nhưng khó tập trung.', answers: V('{時間|じかん}の{面|めん}では{自由|じゆう}だが、{集中|しゅうちゅう}しにくい。', '{時間|じかん}の{面|めん}では{自由|じゆう}ですが、{集中|しゅうちゅう}しにくいです。'), hint: 'じかんの めんでは じゆうだが、しゅうちゅう しにくい' },
        { q: 'Mục đích của khảo sát này là làm rõ thời gian ngủ của sinh viên. (である体)', answers: V('この{調査|ちょうさ}の{目的|もくてき}は、{学生|がくせい}の{睡眠時間|すいみんじかん}を{明|あき}らかにすることである。', 'この{調査|ちょうさ}の{目的|もくてき}は、{学生|がくせい}の{睡眠時間|すいみんじかん}を{明|あき}らかにすることだ。'), hint: '～ことである' },
        { q: 'Tiền nhà đắt, cuộc sống không dễ dàng. (中止形)', answers: V('{家賃|やちん}が{高|たか}く、{生活|せいかつ}は{楽|らく}ではない。'), hint: 'たかく、' },
        { q: 'Nhưng mà phương pháp này cực kỳ tiện lợi. (văn viết)', answers: V('しかし、この{方法|ほうほう}は{非常|ひじょう}に{便利|べんり}である。', 'しかし、この{方法|ほうほう}はきわめて{便利|べんり}である。', 'しかし、この{方法|ほうほう}は{非常|ひじょう}に{便利|べんり}だ。', 'だが、この{方法|ほうほう}は{非常|ひじょう}に{便利|べんり}である。'), hint: 'しかし・非常に・である' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**① 面 = mặt rộng, 点 = điểm cụ thể** — có mệnh đề + という thì gần như luôn là 点.',
        '**② Tính từ イ và động từ KHÔNG thêm だ／である** — ~~高いである~~ · ~~増えるである~~. Danh từ và tính từ ナ mới thêm.',
        '**③ Thể である chưa đủ — còn phải đổi TỪ** — でも → しかし, すごく → 非常に, けど → が. Một chữ văn nói là cả bài bị đánh giá "chưa biết viết".',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{面|めん}で」を{使|つか}って、オンライン{授業|じゅぎょう}のいいところと{困|こま}るところを{言|い}ってください。', ro: '"Men de" o tsukatte, onrain jugyou no ii tokoro to komaru tokoro o itte kudasai.', vi: 'Hãy dùng "men de" nói điểm tốt và điểm khó của học trực tuyến.' },
        { who: 'Bạn', role: 'candidate', text: '{時間|じかん}の{面|めん}では{自由|じゆう}でいいですが、{集中力|しゅうちゅうりょく}の{面|めん}では{少|すこ}し{困|こま}ります。{家|いえ}だと、ついスマホを{見|み}てしまうからです。', ro: 'Jikan no men de wa jiyuu de ii desu ga, shuuchuuryoku no men de wa sukoshi komarimasu. Ie da to, tsui sumaho o mite shimau kara desu.', vi: 'Về mặt thời gian thì tự do, tốt; nhưng về mặt tập trung thì hơi khó. Vì ở nhà là em cứ lỡ xem điện thoại.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'では、{今|いま}の{答|こた}えを、レポートの{文|ぶん}にしてください。', ro: 'De wa, ima no kotae o, repooto no bun ni shite kudasai.', vi: 'Vậy hãy đổi câu trả lời vừa rồi thành câu văn báo cáo.' },
        { who: 'Bạn', role: 'candidate', text: 'オンライン{授業|じゅぎょう}は、{時間|じかん}の{面|めん}では{自由|じゆう}であるが、{集中力|しゅうちゅうりょく}の{面|めん}では{課題|かだい}がある。', ro: 'Onrain jugyou wa, jikan no men de wa jiyuu de aru ga, shuuchuuryoku no men de wa kadai ga aru.', vi: 'Học trực tuyến về mặt thời gian thì tự do, nhưng về mặt tập trung thì còn vấn đề.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'いいですね。「{困|こま}ります」を「{課題|かだい}がある」に{変|か}えたのも、とてもレポートらしいです。', ro: 'Ii desu ne. "Komarimasu" o "kadai ga aru" ni kaeta no mo, totemo repooto rashii desu.', vi: 'Tốt lắm. Đổi "komarimasu" thành "kadai ga aru" cũng rất có chất văn báo cáo.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b52-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        MQ('この{製品|せいひん}は、{価格|かかく}の（　）では{問題|もんだい}ないが、{品質|ひんしつ}に{不安|ふあん}がある。', '{面|めん}', ['{上|うえ}', 'べき', 'はず'], 'Về một mặt rộng → **{面|めん}**.'),
        MQ('{操作|そうさ}が{簡単|かんたん}だという（　）で、{高齢者|こうれいしゃ}に{人気|にんき}がある。', '{点|てん}', ['{面|めん}', '{上|うえ}', 'ため'], 'Mệnh đề + という → **{点|てん}で**.'),
        MQ('だ・である{体|たい}として{正|ただ}しいものはどれか。', '{参加者|さんかしゃ}は{予想|よそう}より{多|おお}かった。', ['{参加者|さんかしゃ}は{予想|よそう}より{多|おお}かったである。', '{参加者|さんかしゃ}は{予想|よそう}より{多|おお}かったです。', '{参加者|さんかしゃ}は{予想|よそう}よりすごく{多|おお}かった。'], 'イA quá khứ: **{多|おお}かった** (không thêm である, không です, không văn nói すごく).'),
        MQ('「{人口|じんこう}が{減|へ}っていて、{対策|たいさく}が{必要|ひつよう}だ」を{書|か}き{言葉|ことば}にしたものはどれか。', '{人口|じんこう}が{減|へ}っており、{対策|たいさく}が{必要|ひつよう}である。', ['{人口|じんこう}が{減|へ}ってて、{対策|たいさく}が{必要|ひつよう}だ。', '{人口|じんこう}が{減|へ}っていまして、{対策|たいさく}が{必要|ひつよう}です。', '{人口|じんこう}が{減|へ}っていて、{対策|たいさく}が{必要|ひつよう}であるです。'], '**～ていて → ～ており** (中止形) + **である**.'),
        MQ('「だから」の{書|か}き{言葉|ことば}として{最|もっと}も{適切|てきせつ}なものはどれか。', 'したがって', ['でも', 'なので', 'それで'], '**だから → したがって／そのため** (văn viết). なので・それで vẫn là văn nói.'),
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b52-buoi-3-beki-neba',
  kind: 'review',
  title: 'Buổi 3 — ～べきだ／べきではない／べきだった · ～ねばならない + bảng べきだ・はずだ・なければならない・ほうがいい · ねばならない・ざるを得ない・しかない · từ mới trích dẫn & lập luận · hội thoại ③ · bố cục レポート · trình bày 1 phút',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～べきだ (Bài 32) rồi học đủ các dạng (すべき, べきではない, べきだった, べき＋N, Nであるべきだ), phân biệt với はずだ・ものだ・なければならない・ほうがいい; nhận ra và nối đúng ～ねばならない (する→せねば), phân biệt với ざるを得ない・しかない; học từ nhóm C (trích dẫn & lập luận), cách trích dẫn và bố cục một bản レポート; đọc hội thoại ③ (マリヤム và ダニエル) và trình bày 1 phút "Cách tôi viết một bản báo cáo".',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — kiểm tra miệng 面で + đổi một câu sang である. Giáo viên viết đề tranh luận lên bảng: "**{大学生|だいがくせい}はアルバイトをすべきか**" — hỏi: "Câu này dùng mẫu gì? Đã gặp ở bài nào?" (Bài 32).',
        '**Từ mới (8′)** — nhóm C (trích dẫn & lập luận: {出典|しゅってん}, {参考文献|さんこうぶんけん}, {参照|さんしょう}, {言及|げんきゅう}, {論|ろん}じる, {提唱|ていしょう}, {唱|とな}える, {反論|はんろん}, {論点|ろんてん}, {是非|ぜひ}, {妥当|だとう}, {一貫|いっかん}, {倫理|りんり}).',
        '**Ngữ pháp (20′)** — ④ **～べきだ** đủ dạng + bảng ⑧ (べきだ ↔ はずだ ↔ なければならない ↔ ほうがいい) · ⑤ **～ねばならない** + bảng ⑨ (↔ ざるを得ない ↔ しかない).',
        '**Viết (7′)** — cách trích dẫn「」+ ～と述べている + danh mục tài liệu · bố cục 序論・本論・結論.',
        '**Hội thoại + trình bày (10′)** — ③ マリヤム nhờ ダニエル xem bài レポート; trình bày 1 phút "Cách tôi viết một bản báo cáo". Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b52-b3-slides',
      title: 'Bài 52 レポート — Buổi 3: べきだ・ねばならない',
      slides: [
        {
          tieuDe: '{第|だい}52{課|か} — Buổi 3',
          anh: ['balance-scale', 'books', 'writing-hand'],
          nhan: ['べきだ', '{引用|いんよう}', 'レポート'],
          dong: ['Hôm nay: **～べきだ** (nên — đạo lý) · **～ねばならない** (phải — văn viết cổ) · bố cục レポート'],
          ro: ['~ beki da · ~ neba naranai'],
          ghi: 'Buổi 3 gắn với tình huống ③ (ký túc xá). Cuối buổi có trình bày 1 phút — nhắc các em chuẩn bị dàn ý ngay từ đầu buổi.',
        },
        {
          tieuDe: 'Khởi động — ～べきか？',
          anh: ['woman-student', 'man-student'],
          nhan: ['{賛成|さんせい}', '{反対|はんたい}'],
          dong: ['{大学生|だいがくせい}はアルバイトをすべきか。', '{約束|やくそく}は{守|まも}るべきだ。'],
          ro: ['Daigakusei wa arubaito o subeki ka.', 'Yakusoku wa mamoru beki da.'],
          hoi: '{大学生|だいがくせい}は{何|なに}をすべきだと{思|おも}いますか。',
          dap: '（{例|れい}）{大学生|だいがくせい}は、いろいろな{人|ひと}と{話|はな}して{視野|しや}を{広|ひろ}げるべきだと{思|おも}います。',
          ghi: 'Ôn Bài 32 (bảng "bốn cách nên"). Gọi 3–4 bạn. Ghi lên bảng: すべき (する → す), 守るべき. Nhắc: べきだ là Ý KIẾN của người nói.',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑤ — {引用|いんよう}と{議論|ぎろん}',
          anh: ['books', 'link', 'megaphone', 'balance-scale'],
          nhan: ['{参考文献|さんこうぶんけん}', '{参照|さんしょう}', '{提唱|ていしょう}', '{是非|ぜひ}'],
          dong: ['{出典|しゅってん}を{明記|めいき}する ・ {参考文献|さんこうぶんけん}を{挙|あ}げる', '～に{言及|げんきゅう}する ・ ～について{論|ろん}じる', '{異論|いろん}を{唱|とな}える ・ {反論|はんろん}する', '～の{是非|ぜひ}を{問|と}う ・ {研究|けんきゅう}の{倫理|りんり}'],
          ro: ['Shutten o meiki suru · sankou bunken o ageru', '~ ni genkyuu suru · ~ ni tsuite ronjiru', 'Iron o tonaeru · hanron suru', '~ no zehi o tou · kenkyuu no rinri'],
          hoi: '「{提唱|ていしょう}」と「{提案|ていあん}」はどう{違|ちが}いますか。',
          dap: '{提唱|ていしょう}は{新|あたら}しい{考|かんが}えや{理論|りろん}を{社会|しゃかい}に{示|しめ}すこと、{提案|ていあん}は{具体的|ぐたいてき}な{案|あん}を{出|だ}すことです。',
          ghi: 'Nhóm C — dạy theo một cuộc tranh luận: 提唱 → 異論を唱える／反論 → 論点を整理 → 是非・妥当・一貫 → khi viết: 言及・参照・出典・倫理. 是非 (danh từ: đúng sai) cùng chữ với ぜひ (phó từ: nhất định).',
        },
        {
          tieuDe: 'ポイント④ — ～べきだ（{全部|ぜんぶ}の{形|かたち}）',
          bang: {
            head: ['Dạng', 'Ví dụ'],
            rows: [
              ['V{辞書形|じしょけい}＋べきだ', '{約束|やくそく}は{守|まも}るべきだ'],
              ['する → すべきだ', 'もっと{勉強|べんきょう}すべきだ'],
              ['べきではない', 'そのまま{使|つか}うべきではない'],
              ['べきだった', 'もっと{早|はや}く{相談|そうだん}すべきだった'],
              ['べき＋N', '{取|と}り{組|く}むべき{課題|かだい}'],
              ['N・ナA＋であるべきだ', '{公平|こうへい}であるべきだ'],
            ],
          },
          hoi: '「{使|つか}わないべきだ」は{正|ただ}しいですか。',
          dap: 'いいえ。「{使|つか}うべきではない」が{正|ただ}しいです。',
          ghi: 'Ba lỗi: ないべきだ (→ べきではない), しべきだ (→ すべきだ), dùng cho luật (→ なければならない). Nói với người trên: tránh べきです → ～たほうがいいと思います.',
        },
        {
          tieuDe: 'べきだ ↔ はずだ ↔ なければならない ↔ ほうがいい',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Ví dụ'],
            rows: [
              ['べきだ', 'nên (ý kiến, đạo lý)', '{田中|たなか}さんは{会議|かいぎ}に{来|く}るべきだ'],
              ['はずだ', 'chắc là (suy luận)', '{田中|たなか}さんは{会議|かいぎ}に{来|く}るはずだ'],
              ['なければならない', 'phải (quy định)', '{資料|しりょう}を{送|おく}らなければならない'],
              ['ほうがいい', 'khuyên nhẹ', '{早|はや}く{寝|ね}たほうがいいよ'],
            ],
          },
          hoi: '「{田中|たなか}さんは{来|く}るべきだ」と「{来|く}るはずだ」の{違|ちが}いは？',
          dap: '「べきだ」は{来|く}ることが{正|ただ}しいという{意見|いけん}、「はずだ」は{来|く}ると{予想|よそう}していることです。',
          ghi: 'Bẫy kinh điển của đề N2: 来るべきだ ↔ 来るはずだ. Viết hai câu lên bảng, khoanh: ý kiến ↔ suy đoán.',
        },
        {
          tieuDe: 'ポイント⑤ — ～ねばならない',
          bang: {
            head: ['Động từ', 'ねばならない'],
            rows: [
              ['{書|か}く → {書|か}かない', '{書|か}かねばならない'],
              ['{考|かんが}える', '{考|かんが}えねばならない'],
              ['する', 'せねばならない（✗しねば）'],
              ['{来|く}る', '{来|こ}ねばならない'],
              ['Nである', 'Nであらねばならない'],
            ],
          },
          hoi: '「{解決|かいけつ}する」を「ねばならない」の{形|かたち}にしてください。',
          dap: '{解決|かいけつ}せねばならない。',
          ghi: 'ね = phủ định cổ (ねば = なければ). Văn viết, cổ, trang trọng: xã luận, diễn văn, sách cũ. Đọc hiểu ngay; tự viết レポート thì なければならない là đủ.',
        },
        {
          tieuDe: 'ねばならない ↔ ざるを{得|え}ない ↔ しかない',
          bang: {
            head: ['Mẫu', 'Sắc thái', 'Ví dụ'],
            rows: [
              ['ねばならない', 'phải (văn viết, kêu gọi)', '{我々|われわれ}は{自然|しぜん}を{守|まも}らねばならない'],
              ['ざるを{得|え}ない (Bài 45)', 'đành phải (hoàn cảnh ép)', '{雨|あめ}で{中止|ちゅうし}せざるを{得|え}なかった'],
              ['しかない (Bài 47)', 'chỉ còn cách', '{一人|ひとり}でやるしかない'],
            ],
          },
          hoi: '{台風|たいふう}で{旅行|りょこう}をやめた{時|とき}、どう{言|い}いますか。',
          dap: '{台風|たいふう}のため、{旅行|りょこう}を{中止|ちゅうし}せざるを{得|え}なかった。',
          ghi: 'Mẹo: không muốn mà vẫn phải + nguyên nhân bên ngoài → ざるを得ない; không còn lựa chọn → しかない; giọng xã luận, chủ ngữ 我々・人類 → ねばならない.',
        },
        {
          tieuDe: '{引用|いんよう}の{仕方|しかた}',
          dong: ['{山田|やまだ}（2023）は「～」と{述|の}べている。', '{山田|やまだ}（2023）によると、～という。', '{参考文献|さんこうぶんけん}：{著者名|ちょしゃめい}（{年|ねん}）『{書名|しょめい}』{出版社|しゅっぱんしゃ}'],
          ro: ['Yamada (2023) wa "~" to nobete iru.', 'Yamada (2023) ni yoru to, ~ to iu.', 'Sankou bunken: chosha mei (nen) "shomei" shuppansha'],
          hoi: '{本|ほん}の{文|ぶん}をそのまま{使|つか}う{時|とき}、{何|なに}をしなければなりませんか。',
          dap: 'かぎ{括弧|かっこ}に{入|い}れて、{著者|ちょしゃ}の{名前|なまえ}と{出版|しゅっぱん}された{年|とし}を{書|か}かなければなりません。',
          ghi: 'Nhắc đạo đức: đổi vài chữ mà không ghi nguồn vẫn là 盗用. Sau mỗi trích dẫn phải có một câu của mình. Tên tác giả, sách trong khoá học là GIẢ ĐỊNH — không dùng như nguồn thật.',
        },
        {
          tieuDe: 'レポートの{構成|こうせい}',
          bang: {
            head: ['{部分|ぶぶん}', '{書|か}くこと'],
            rows: [
              ['{序論|じょろん}', '{背景|はいけい}・{問|と}い（～だろうか）・{目的|もくてき}・まず～、{次|つぎ}に～'],
              ['{本論|ほんろん}', '{方法|ほうほう}・{結果|けっか}（{数字|すうじ}だけ）・{考察|こうさつ}（{引用|いんよう}）'],
              ['{結論|けつろん}', 'まとめ・{主張|しゅちょう}（～べきである）・ただし～・{今後|こんご}の{課題|かだい}'],
              ['{参考文献|さんこうぶんけん}', '{著者名|ちょしゃめい}（{年|ねん}）『{書名|しょめい}』{出版社|しゅっぱんしゃ}'],
            ],
          },
          hoi: '{序論|じょろん}で{書|か}いた「{問|と}い」には、どこで{答|こた}えますか。',
          dap: '{結論|けつろん}で{答|こた}えます。',
          ghi: 'Một câu hỏi — một câu trả lời. Kết quả ≠ 考察. Bài mẫu đầy đủ ở mục Viết; giao đề viết 800–1.200 chữ về nhà.',
        },
        {
          tieuDe: '{会話|かいわ}③ — {寮|りょう}でレポートの{相談|そうだん}',
          anh: ['woman-student', 'books', 'man-student'],
          nhan: ['マリヤム', '{古|ふる}い{本|ほん}', 'ダニエル'],
          dong: ['{学生|がくせい}はまず{学|まな}ばねばならない。', '{学業|がくぎょう}に{影響|えいきょう}が{出|で}ない{範囲|はんい}で{働|はたら}くべきだ。', '{両方|りょうほう}の{面|めん}から{考|かんが}えた{上|うえ}で、{結論|けつろん}を{書|か}き{直|なお}す。'],
          ro: ['Gakusei wa mazu manabaneba naranai.', 'Gakugyou ni eikyou ga denai han\'i de hataraku beki da.', 'Ryouhou no men kara kangaeta ue de, ketsuron o kakinaosu.'],
          hoi: 'なぜダニエルさんは「すべきではない」より「～{範囲|はんい}で{働|はたら}くべきだ」がいいと{言|い}いましたか。',
          dap: '{生活|せいかつ}のために{働|はたら}かなければならない{学生|がくせい}もいるので、{条件|じょうけん}をつけたほうが{説得力|せっとくりょく}があるからです。',
          ghi: 'Nghe 2 lần. Hỏi: câu trích sách cũ dùng mẫu gì (ねばならない), vì sao phải giữ nguyên khi trích (直接引用). Cả bài học trong một hội thoại: べき・ねば・面・上で.',
        },
        {
          tieuDe: '1{分|ぷん}スピーチ — {私|わたし}のレポートの{書|か}き{方|かた}',
          anh: ['speaking-head', 'stopwatch'],
          nhan: ['{話|はな}す', '1{分|ぷん}'],
          dong: ['まず、{先行研究|せんこうけんきゅう}を{読|よ}んだ{上|うえ}で、{目的|もくてき}を{決|き}めます。', '{次|つぎ}に、{序論|じょろん}・{本論|ほんろん}・{結論|けつろん}の{構成|こうせい}を{考|かんが}えます。', '{最後|さいご}に、{文体|ぶんたい}の{面|めん}で{問題|もんだい}がないか{確認|かくにん}します。'],
          ro: ['Mazu, senkou kenkyuu o yonda ue de, mokuteki o kimemasu.', 'Tsugi ni, joron, honron, ketsuron no kousei o kangaemasu.', 'Saigo ni, buntai no men de mondai ga nai ka kakunin shimasu.'],
          hoi: 'レポートを{書|か}く{上|うえ}で、{一番|いちばん}{大切|たいせつ}なことは{何|なん}ですか。',
          dap: '{自分|じぶん}の{考|かんが}えに{根拠|こんきょ}を{持|も}たせることだと{思|おも}います。',
          ghi: 'Dàn ý 5 bước ở mục Nói. Mỗi em 1 phút, bạn bên cạnh bấm giờ và đếm số lần dùng 上で・面で・べき.',
        },
        {
          tieuDe: 'まとめ — Buổi 3',
          anh: ['check-mark-button'],
          nhan: ['ポイント'],
          dong: ['べきだ：nên (ý kiến) · べきではない · べきだった · べき＋N', 'はずだ：chắc là (suy luận) — KHÁC べきだ', 'ねばならない = なければならない (văn viết cổ) · する → せねば'],
          ro: ['beki da · beki de wa nai · beki datta · beki + N', 'hazu da', 'neba naranai = nakereba naranai · suru → seneba'],
          ghi: 'Bài về nhà: viết bản レポート 800–1.200 chữ theo đề ở mục Viết (đề "アルバイトと学業の両立"), tự chấm theo 5 tiêu chí; học thuộc 13 từ nhóm C. Buổi sau đổi bài cho bạn chấm chéo.',
        },
      ],
    },
    {
      t: 'p',
      text: 'Giáo viên viết lên bảng một câu trích từ "một cuốn sách cũ": **「{若者|わかもの}は{苦労|くろう}を{恐|おそ}れてはならない。{自|みずか}ら{学|まな}ばねばならない。」** Hỏi: "Câu này cũ hay mới? Vì sao các em biết?" — rồi gạch chân **ねばならない**. "Hôm nay ta học hai cách nói “nên / phải” của người viết: **べきだ** (ý kiến của mình) và **ねばならない** (giọng xã luận, sách cũ)."',
    },
    {
      t: 'mcq',
      id: 'b52-b3-khoi-dong',
      title: 'Khởi động — ôn mẫu đã học (4 câu)',
      items: [
        MQ('{人|ひと}の{悪口|わるぐち}は{言|い}う（　）ではない。（Bài 32 — lẽ thường）', 'もの', ['こと', 'はず', 'わけ'], 'Lẽ thường xã hội → **～ものではない** (Bài 32).'),
        MQ('{熱|ねつ}があるなら、{今日|きょう}は{休|やす}んだ（　）がいいよ。（khuyên nhẹ）', 'ほう', ['べき', 'もの', 'はず'], 'Khuyên bạn → **～たほうがいい**.'),
        MQ('{雨|あめ}で、{試合|しあい}は{中止|ちゅうし}せざるを（　）。（Bài 45）', '{得|え}なかった', ['ならなかった', 'いけなかった', 'しなかった'], '**～ざるを{得|え}ない** (Bài 45) — đành phải.'),
        MQ('{終電|しゅうでん}がないので、タクシーで{帰|かえ}る（　）。（Bài 47）', 'しかない', ['べきだ', 'はずだ', 'ものだ'], 'Không còn lựa chọn khác → **しかない** (Bài 47).'),
      ],
    },
    { t: 'h', text: 'Slide 3 — Từ mới: trích dẫn & lập luận' },
    {
      t: 'examples',
      items: [
        E('{図|ず}や{表|ひょう}を{使|つか}う{時|とき}は、{必|かなら}ず{出典|しゅってん}を{示|しめ}すこと。', 'Zu ya hyou o tsukau toki wa, kanarazu shutten o shimesu koto.', 'Khi dùng hình, bảng thì nhất thiết phải ghi nguồn.'),
        E('{筆者|ひっしゃ}は、この{問題|もんだい}の{原因|げんいん}には{言及|げんきゅう}していない。', 'Hissha wa, kono mondai no gen\'in ni wa genkyuu shite inai.', 'Tác giả không đề cập tới nguyên nhân của vấn đề này.'),
        E('{会議|かいぎ}で、その{案|あん}に{異論|いろん}を{唱|とな}える{人|ひと}はいなかった。', 'Kaigi de, sono an ni iron o tonaeru hito wa inakatta.', 'Trong cuộc họp, không ai nêu ý kiến phản đối phương án đó.'),
        E('{他人|たにん}の{文章|ぶんしょう}をそのまま{使|つか}うのは、{研究|けんきゅう}の{倫理|りんり}に{反|はん}する。', 'Tanin no bunshou o sono mama tsukau no wa, kenkyuu no rinri ni hansuru.', 'Dùng nguyên văn bài của người khác là trái với đạo đức nghiên cứu.'),
      ],
    },
    { t: 'h', text: 'Slide 4–7 — べきだ・ねばならない: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b52-b3-noi-tu',
      title: 'Luyện nhanh — điền mẫu (8 câu)',
      kind: 'fill',
      items: [
        { q: '{約束|やくそく}は{守|まも}る（　　）だ。', answers: V('べき'), hint: 'V辞書形＋べきだ' },
        { q: 'もっと{勉強|べんきょう}（　　）だ。（する → ?）', answers: V('すべき', 'するべき'), hint: 'すべき' },
        { q: '{他人|たにん}の{文章|ぶんしょう}をそのまま{使|つか}うべき（　　）。（không nên）', answers: V('ではない', 'じゃない', 'ではありません'), hint: 'べきではない' },
        { q: 'もっと{早|はや}く{相談|そうだん}すべき（　　）。（lẽ ra nên — quá khứ）', answers: V('だった', 'でした'), hint: 'べきだった' },
        { q: '{今後|こんご}{取|と}り{組|く}む（　　）{課題|かだい}は{多|おお}い。（べき＋N）', answers: V('べき'), hint: 'べき＋N' },
        { q: 'リーダーは{公平|こうへい}で（　　）べきだ。', answers: V('ある'), hint: 'ナAであるべきだ' },
        { q: '{我々|われわれ}は{自然|しぜん}を{守|まも}ら（　　）ならない。', answers: V('ねば'), hint: 'Vない＋ねばならない' },
        { q: 'この{問題|もんだい}はすぐに{解決|かいけつ}（　　）ねばならない。（する → ?）', answers: V('せ'), hint: 'せねばならない' },
      ],
    },
    {
      t: 'quiz',
      id: 'b52-b3-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: 'V辞書形＋べきだ（する→すべき）／べきではない／べきだった · Vない＋ねばならない（する→せねば）',
      items: [
        { q: 'Sinh viên đại học có nên đi làm thêm không?', answers: V('{大学生|だいがくせい}はアルバイトをすべきか。', '{大学生|だいがくせい}はアルバイトをするべきか。', '{大学生|だいがくせい}はアルバイトをすべきですか。'), hint: 'だいがくせいは アルバイトを すべきか' },
        { q: 'Nên đi làm trong phạm vi không ảnh hưởng tới việc học.', answers: V('{学業|がくぎょう}に{影響|えいきょう}が{出|で}ない{範囲|はんい}で{働|はたら}くべきだ。', '{勉強|べんきょう}に{影響|えいきょう}が{出|で}ない{範囲|はんい}で{働|はたら}くべきだ。', '{学業|がくぎょう}に{影響|えいきょう}が{出|で}ない{範囲|はんい}で{働|はたら}くべきです。'), hint: 'がくぎょうに えいきょうが でない はんいで はたらく べきだ' },
        { q: 'Không nên trộn hai văn phong trong một bài.', answers: V('{一|ひと}つの{文章|ぶんしょう}の{中|なか}で{二|ふた}つの{文体|ぶんたい}を{混|ま}ぜるべきではない。', '{一|ひと}つの{文章|ぶんしょう}で{二|ふた}つの{文体|ぶんたい}を{混|ま}ぜるべきではない。', '{一|ひと}つの{文章|ぶんしょう}の{中|なか}で{二|ふた}つの{文体|ぶんたい}を{混|ま}ぜるべきではありません。'), hint: 'ひとつの ぶんしょうの なかで ふたつの ぶんたいを まぜる べきでは ない' },
        { q: 'Lẽ ra tôi nên viết báo cáo sớm hơn.', answers: V('もっと{早|はや}くレポートを{書|か}くべきだった。', 'もっと{早|はや}くレポートを{書|か}き{始|はじ}めるべきだった。', 'もっと{早|はや}くレポートを{書|か}くべきでした。'), hint: 'もっと はやく レポートを かく べきだった' },
        { q: 'Sinh viên trước hết phải học. (ねばならない)', answers: V('{学生|がくせい}はまず{学|まな}ばねばならない。', '{学生|がくせい}はまず{勉強|べんきょう}せねばならない。'), hint: 'がくせいは まず まなばねば ならない' },
        { q: 'Kết luận nên viết ở phần đầu.', answers: V('{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきだ。', '{結論|けつろん}は{冒頭|ぼうとう}に{書|か}くべきです。', '{結論|けつろん}は{最初|さいしょ}に{書|か}くべきだ。'), hint: 'けつろんは ぼうとうに かく べきだ' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**① べきだ = ý kiến; はずだ = suy đoán; なければならない = quy định** — đề N2 đặt ba mẫu này cạnh nhau.',
        '**② Phủ định ở べき: べきではない** — ~~ないべきだ~~. **する → すべき**.',
        '**③ ねばならない: đọc hiểu ngay, tự viết thì dùng ít** — する → **せ**ねばならない; khi trích dẫn giữ nguyên.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「べきだ」を{使|つか}って、{大学|だいがく}がもっとすべきことを{一|ひと}つ{言|い}ってください。{理由|りゆう}も{言|い}ってください。', ro: '"Beki da" o tsukatte, daigaku ga motto subeki koto o hitotsu itte kudasai. Riyuu mo itte kudasai.', vi: 'Hãy dùng "beki da" nói một việc mà trường đại học nên làm nhiều hơn. Nói cả lý do.' },
        { who: 'Bạn', role: 'candidate', text: '{大学|だいがく}は、{留学生|りゅうがくせい}のためのレポートの{書|か}き{方|かた}の{授業|じゅぎょう}を{増|ふ}やすべきだと{思|おも}います。{日本|にほん}のレポートの{形|かたち}は、{国|くに}によって{違|ちが}うからです。', ro: 'Daigaku wa, ryuugakusei no tame no repooto no kakikata no jugyou o fuyasu beki da to omoimasu. Nihon no repooto no katachi wa, kuni ni yotte chigau kara desu.', vi: 'Em nghĩ trường nên tăng các giờ dạy cách viết báo cáo cho du học sinh. Vì khuôn báo cáo của Nhật khác với từng nước.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'では、「{学生|がくせい}は{勉強|べんきょう}せねばならない」を、{今|いま}の{話|はな}し{言葉|ことば}にしてください。', ro: 'De wa, "gakusei wa benkyou seneba naranai" o, ima no hanashikotoba ni shite kudasai.', vi: 'Vậy hãy đổi câu "gakusei wa benkyou seneba naranai" sang văn nói hiện nay.' },
        { who: 'Bạn', role: 'candidate', text: '「{学生|がくせい}は{勉強|べんきょう}しなければならない」です。もっとくだけた{言|い}い{方|かた}なら、「{勉強|べんきょう}しなきゃいけない」です。', ro: '"Gakusei wa benkyou shinakereba naranai" desu. Motto kudaketa iikata nara, "benkyou shinakya ikenai" desu.', vi: 'Là "gakusei wa benkyou shinakereba naranai" ạ. Nói thân mật hơn thì là "benkyou shinakya ikenai".' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'そのとおりです。{書|か}く{時|とき}と{話|はな}す{時|とき}で、{形|かたち}を{使|つか}い{分|わ}けてくださいね。', ro: 'Sono toori desu. Kaku toki to hanasu toki de, katachi o tsukaiwakete kudasai ne.', vi: 'Đúng vậy. Các em nhớ dùng phân biệt hình thức khi viết và khi nói nhé.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b52-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        MQ('{他人|たにん}の{意見|いけん}を、{最後|さいご}まで{聞|き}かずに{否定|ひてい}（　）。', 'すべきではない', ['しないべきだ', 'すべきだった', 'するはずだ'], 'Phê phán → **すべきではない** (phủ định ở べき).'),
        MQ('{資料|しりょう}は{昨日|きのう}{送|おく}ったので、もう{届|とど}いている（　）。', 'はずだ', ['わけがない', 'ねばならない', 'ものだ'], 'Có căn cứ (đã gửi) → suy đoán **はずだ**.'),
        MQ('{我々|われわれ}は、{同|おな}じ{過|あやま}ちを{繰|く}り{返|かえ}さないよう{努力|どりょく}せ（　）ならない。', 'ねば', ['ずに', 'なきゃ', 'ないと'], 'せ＋**ねば**ならない (giọng xã luận).'),
        MQ('{大雪|おおゆき}のため、{会議|かいぎ}を{延期|えんき}せざるを（　）。', '{得|え}なかった', ['ならなかった', 'べきだった', 'しかなかった'], 'Hoàn cảnh ép → **せざるを{得|え}なかった** (Bài 45).'),
        MQ('{引用|いんよう}の{仕方|しかた}として{正|ただ}しいものはどれか。', '{山田|やまだ}（2023）は「{書|か}くことは{考|かんが}えることだ」と{述|の}べている。', ['{山田|やまだ}さんがいい{本|ほん}を{書|か}いたと{思|おも}う。', '{本|ほん}の{文|ぶん}を{少|すこ}し{変|か}えて、{出典|しゅってん}は{書|か}かない。', '「{書|か}くことは{考|かんが}えることだ」。'], 'Trích dẫn trực tiếp: **tác giả（năm）+「」+ ～と述べている**. Thiếu nguồn hoặc đổi chữ mà không ghi nguồn đều sai.'),
      ],
    },
  ],
};

/* ═══════════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════════ */

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 66 từ của mục Từ vựng; nghĩa không trùng nhau). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{序論|じょろん}', 'joron', 'phần mở đầu của bài luận'],
  ['{本論|ほんろん}', 'honron', 'phần thân, phần chính của bài luận'],
  ['{構成|こうせい}', 'kousei', 'bố cục'],
  ['{章|しょう}', 'shou', 'chương'],
  ['{段落|だんらく}', 'danraku', 'đoạn văn'],
  ['{見出|みだ}し', 'midashi', 'tiêu đề mục'],
  ['{要旨|ようし}', 'youshi', 'ý chính tóm tắt'],
  ['{要約|ようやく}', 'youyaku', 'tóm tắt, rút gọn nội dung'],
  ['{概要|がいよう}', 'gaiyou', 'khái quát, đại cương'],
  ['{箇条書|かじょうが}き', 'kajougaki', 'viết gạch đầu dòng'],
  ['{冒頭|ぼうとう}', 'boutou', 'phần đầu (bài viết, cuộc họp)'],
  ['{末尾|まつび}', 'matsubi', 'phần cuối (văn bản, câu)'],
  ['{字数|じすう}', 'jisuu', 'số chữ'],
  ['{執筆|しっぴつ}', 'shippitsu', 'chấp bút, viết (sách, bài)'],
  ['{先行研究|せんこうけんきゅう}', 'senkou kenkyuu', 'nghiên cứu đi trước'],
  ['{考察|こうさつ}', 'kousatsu', 'bàn luận, diễn giải kết quả'],
  ['{手法|しゅほう}', 'shuhou', 'kỹ thuật, phương pháp chuyên môn'],
  ['{範囲|はんい}', 'han\'i', 'phạm vi'],
  ['{前提|ぜんてい}', 'zentei', 'tiền đề'],
  ['{枠組|わくぐ}み', 'wakugumi', 'khung, khuôn khổ'],
  ['{実証|じっしょう}', 'jisshou', 'chứng minh bằng dữ liệu thật'],
  ['{示唆|しさ}', 'shisa', 'gợi ý, cho thấy gián tiếp'],
  ['{明|あき}らかにする', 'akiraka ni suru', 'làm rõ'],
  ['{概念|がいねん}', 'gainen', 'khái niệm'],
  ['{典型的|てんけいてき}', 'tenkeiteki', 'điển hình'],
  ['{普遍的|ふへんてき}', 'fuhenteki', 'phổ quát, đúng ở mọi nơi'],
  ['{段階|だんかい}', 'dankai', 'giai đoạn, bước'],
  ['{出典|しゅってん}', 'shutten', 'nguồn trích dẫn'],
  ['{参考文献|さんこうぶんけん}', 'sankou bunken', 'tài liệu tham khảo'],
  ['{参照|さんしょう}', 'sanshou', 'tham chiếu, xem chỗ khác'],
  ['{言及|げんきゅう}', 'genkyuu', 'đề cập, nhắc tới'],
  ['{論|ろん}じる', 'ronjiru', 'bàn luận có lập luận'],
  ['{提唱|ていしょう}', 'teishou', 'đề xướng (lý thuyết mới)'],
  ['{唱|とな}える', 'tonaeru', 'nêu lên (ý kiến, học thuyết)'],
  ['{反論|はんろん}', 'hanron', 'phản bác'],
  ['{論点|ろんてん}', 'ronten', 'luận điểm, điểm cần bàn'],
  ['{是非|ぜひ}', 'zehi', 'đúng sai, nên hay không'],
  ['{妥当|だとう}', 'datou', 'hợp lý, thoả đáng'],
  ['{一貫|いっかん}', 'ikkan', 'nhất quán, xuyên suốt'],
  ['{倫理|りんり}', 'rinri', 'luân lý, đạo đức'],
  ['{書|か}き{言葉|ことば}', 'kakikotoba', 'văn viết'],
  ['{話|はな}し{言葉|ことば}', 'hanashikotoba', 'văn nói'],
  ['{文体|ぶんたい}', 'buntai', 'văn phong'],
  ['{統一|とういつ}', 'touitsu', 'thống nhất'],
  ['{簡潔|かんけつ}', 'kanketsu', 'ngắn gọn, súc tích'],
  ['{明確|めいかく}', 'meikaku', 'rõ ràng, minh bạch'],
  ['{堅|かた}い', 'katai', 'cứng nhắc (văn); chắc chắn'],
  ['{記述|きじゅつ}', 'kijutsu', 'mô tả bằng chữ'],
  ['{補足|ほそく}', 'hosoku', 'bổ sung, nói thêm'],
  ['{留意|りゅうい}', 'ryuui', 'lưu ý'],
  ['きわめて', 'kiwamete', 'cực kỳ (văn viết)'],
  ['いわゆる', 'iwayuru', 'cái gọi là'],
  ['{前述|ぜんじゅつ}', 'zenjutsu', 'đã nói ở trên'],
  ['{報告書|ほうこくしょ}', 'houkokusho', 'bản báo cáo công việc'],
  ['{議事録|ぎじろく}', 'gijiroku', 'biên bản cuộc họp'],
  ['{進捗|しんちょく}', 'shinchoku', 'tiến độ'],
  ['{費用対効果|ひようたいこうか}', 'hiyou tai kouka', 'hiệu quả so với chi phí'],
  ['{改善策|かいぜんさく}', 'kaizensaku', 'biện pháp cải thiện'],
  ['{重視|じゅうし}', 'juushi', 'coi trọng'],
  ['{視野|しや}', 'shiya', 'tầm nhìn'],
  ['{徹底|てってい}', 'tettei', 'triệt để, quán triệt'],
  ['{模範|もはん}', 'mohan', 'mẫu mực, gương mẫu'],
  ['{側面|そくめん}', 'sokumen', 'mặt, khía cạnh'],
  ['{精神的|せいしんてき}', 'seishinteki', '(thuộc) tinh thần'],
  ['{出版|しゅっぱん}', 'shuppan', 'xuất bản'],
  ['{改訂|かいてい}', 'kaitei', 'sửa đổi (sách, quy định)'],
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
  id: 'b52-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (50 câu)',
  goal: 'Nhớ chắc 66 từ báo cáo của Bài 52 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các nhóm dễ nhầm (要旨・要約・概要, 考察・感想・分析, 示唆・示す・指摘, 言及・述べる, 提唱・提案, 簡潔・簡単・明確, 参照・参考・引用, 前述・上記・下記, 報告書・レポート・議事録).',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 20 câu Nhật → Việt và 15 câu Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi) và đọc câu ví dụ ở mục Từ vựng.',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N2 (4 lựa chọn cùng loại từ — phải hiểu cả câu mới chọn được).',
        'Lỗi hay mắc: {要旨|ようし} (ý chính của người viết) ↔ {要約|ようやく} (rút gọn cả nội dung) · {考察|こうさつ} (có căn cứ) ↔ {感想|かんそう} (cảm nghĩ) · {提唱|ていしょう} (lý thuyết mới) ↔ {提案|ていあん} (phương án cụ thể) · {簡潔|かんけつ} (ít chữ, đủ ý) ↔ {簡単|かんたん} (dễ) · {出典|しゅってん} đọc しゅってん · {執筆|しっぴつ} có っ · {範囲|はんい} = han-i.',
      ],
    },
    { t: 'mcq', id: 'b52-lt1-nv', title: '🟢 Nhật → Việt (20 câu)', items: [...MCQ_NV(0, 10), ...MCQ_NV(27, 37)] },
    { t: 'mcq', id: 'b52-lt1-vn', title: '🟢 Việt → Nhật (15 câu)', items: [...MCQ_VN(14, 21), ...MCQ_VN(53, 61)] },
    {
      t: 'mcq',
      id: 'b52-lt1-dien',
      title: '🟡 Điền từ vào câu — 文脈規定 (15 câu)',
      items: [
        MQ('{書|か}き{始|はじ}める{前|まえ}に、レポート{全体|ぜんたい}の（　）を{考|かんが}えておこう。', '{構成|こうせい}', ['{出典|しゅってん}', '{倫理|りんり}', '{進捗|しんちょく}'], 'Bố cục toàn bài → **{構成|こうせい}**. 〔Repooto zentai no kousei o…〕'),
        MQ('{各章|かくしょう}の{最初|さいしょ}に、{内容|ないよう}が{一目|ひとめ}で{分|わ}かる（　）をつける。', '{見出|みだ}し', ['{末尾|まつび}', '{前提|ぜんてい}', '{側面|そくめん}'], 'Tiêu đề cho mỗi chương → **{見出|みだ}し**. 〔Midashi o tsukeru.〕'),
        MQ('{三十分|さんじゅっぷん}の{講義|こうぎ}の{内容|ないよう}を、{二百字|にひゃくじ}に（　）した。', '{要約|ようやく}', ['{改訂|かいてい}', '{実証|じっしょう}', '{提唱|ていしょう}'], 'Rút gọn nội dung → **{要約|ようやく}する**. 〔Nihyakuji ni youyaku shita.〕'),
        MQ('{会議|かいぎ}の（　）で、{部長|ぶちょう}が{今月|こんげつ}の{目標|もくひょう}を{発表|はっぴょう}した。', '{冒頭|ぼうとう}', ['{末尾|まつび}', '{字数|じすう}', '{範囲|はんい}'], 'Phần đầu cuộc họp → **{冒頭|ぼうとう}**. 〔Kaigi no boutou de…〕'),
        MQ('このテーマについては、すでに{多|おお}くの（　）がある。', '{先行研究|せんこうけんきゅう}', ['{議事録|ぎじろく}', '{改善策|かいぜんさく}', '{話|はな}し{言葉|ことば}'], 'Nghiên cứu đã có trước → **{先行研究|せんこうけんきゅう}**. 〔Ooku no senkou kenkyuu ga aru.〕'),
        MQ('この{調査|ちょうさ}は、{回答者|かいとうしゃ}が{正直|しょうじき}に{答|こた}えることを（　）にしている。', '{前提|ぜんてい}', ['{見出|みだ}し', '{模範|もはん}', '{視野|しや}'], 'Điều kiện đặt ra trước → **～を{前提|ぜんてい}にする**. 〔… koto o zentei ni shite iru.〕'),
        MQ('{実験|じっけん}によって、{仮説|かせつ}が{正|ただ}しいことが（　）された。', '{実証|じっしょう}', ['{参照|さんしょう}', '{要約|ようやく}', '{補足|ほそく}'], 'Chứng minh bằng thí nghiệm → **{実証|じっしょう}**. 〔Kasetsu ga tadashii koto ga jisshou sareta.〕'),
        MQ('{表|ひょう}や{図|ず}を{他|ほか}の{資料|しりょう}から{使|つか}う{場合|ばあい}は、（　）を{明記|めいき}すること。', '{出典|しゅってん}', ['{段落|だんらく}', '{概念|がいねん}', '{論点|ろんてん}'], 'Ghi rõ nguồn → **{出典|しゅってん}を{明記|めいき}する**. 〔Shutten o meiki suru koto.〕'),
        MQ('{筆者|ひっしゃ}は、{費用|ひよう}の{問題|もんだい}には{一言|ひとこと}も（　）していない。', '{言及|げんきゅう}', ['{執筆|しっぴつ}', '{統一|とういつ}', '{重視|じゅうし}'], 'Không đề cập → **{言及|げんきゅう}していない**. 〔Hitokoto mo genkyuu shite inai.〕'),
        MQ('{相手|あいて}の{意見|いけん}に、{具体的|ぐたいてき}なデータを{挙|あ}げて（　）した。', '{反論|はんろん}', ['{執筆|しっぴつ}', '{出版|しゅっぱん}', '{記述|きじゅつ}'], 'Đáp lại ý kiến đối phương → **{反論|はんろん}する**. 〔Deeta o agete hanron shita.〕'),
        MQ('{議論|ぎろん}が{長|なが}くなったので、{一度|いちど}（　）を{整理|せいり}しましょう。', '{論点|ろんてん}', ['{字数|じすう}', '{視野|しや}', '{冒頭|ぼうとう}'], 'Sắp xếp các điểm đang bàn → **{論点|ろんてん}を{整理|せいり}する**. 〔Ronten o seiri shimashou.〕'),
        MQ('{予算|よさん}を{考|かんが}えると、この{金額|きんがく}は（　）だと{思|おも}う。', '{妥当|だとう}', ['{典型的|てんけいてき}', '{精神的|せいしんてき}', '{普遍的|ふへんてき}'], 'Hợp lý, thoả đáng → **{妥当|だとう}**. 〔Kono kingaku wa datou da.〕'),
        MQ('レポートでは、「です・ます」と「だ・である」を{混|ま}ぜずに、（　）を{統一|とういつ}する。', '{文体|ぶんたい}', ['{進捗|しんちょく}', '{範囲|はんい}', '{章|しょう}'], '**{文体|ぶんたい}を{統一|とういつ}する**. 〔Buntai o touitsu suru.〕'),
        MQ('{前回|ぜんかい}の{説明|せつめい}が{足|た}りなかったので、{少|すこ}し（　）します。', '{補足|ほそく}', ['{前述|ぜんじゅつ}', '{留意|りゅうい}', '{実証|じっしょう}'], 'Nói thêm cho đủ → **{補足|ほそく}する**. 〔Sukoshi hosoku shimasu.〕'),
        MQ('{留学|りゅうがく}を{通|とお}して、{世界|せかい}を{見|み}る（　）が{広|ひろ}がった。', '{視野|しや}', ['{側面|そくめん}', '{模範|もはん}', '{手法|しゅほう}'], '**{視野|しや}が{広|ひろ}がる** = tầm nhìn rộng ra. 〔Sekai o miru shiya ga hirogatta.〕'),
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b52-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 漢字読み + 表記 (30 câu)',
  goal: 'Đọc đúng và viết đúng 24 chữ mới trong từ (không furigana), tránh các bẫy âm đục, trường âm, âm ngắt và chữ trông giống.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**漢字読み (15 câu)** — chọn cách đọc của từ in đậm. Bẫy hay gặp: **{規模|きぼ}** (模 = ボ) · **{執筆|しっぴつ}** (âm ngắt + ピ) · **{出版|しゅっぱん}** (ハ → パ) · **{改訂版|かいていばん}** (バン) · **{範囲|はんい}** (han-i) · **{潔|いさぎよ}い**.',
        '**表記 (15 câu)** — chọn chữ Hán đúng. Bẫy hay gặp: **構↔講↔購** · **旨↔指** · **括↔活** · **視↔規** · **堅↔賢↔緊** · **遍↔編↔偏** · **該↔刻↔核** · **盤↔般** · **版↔板↔販** · **倫↔論↔輪**.',
      ],
    },
    {
      t: 'mcq',
      id: 'b52-lt2-doc',
      title: '漢字読み (15 câu)',
      items: [
        MQ('{物事|ものごと}には**順序**がある。', 'じゅんじょ', ['じゅんよ', 'じゅんじょう', 'しゅんじょ'], '**{順序|じゅんじょ}** — 序 ジョ (ngắn).'),
        MQ('{建物|たてもの}の**構造**を{調|しら}べる。', 'こうぞう', ['こうそう', 'かまぞう', 'こぞう'], '**{構造|こうぞう}** — 造 ゾウ (đục).'),
        MQ('{過去|かこ}に**執着**しない。', 'しゅうちゃく', ['しつちゃく', 'しっちゃく', 'とりちゃく'], '**{執着|しゅうちゃく}** — 執 đọc **シュウ** ở từ này (khác {執筆|しっぴつ}).'),
        MQ('{会|かい}の**趣旨**を{説明|せつめい}する。', 'しゅし', ['しゅじ', 'しゅうし', 'おもむね'], '**{趣旨|しゅし}** — mục đích, ý chính.'),
        MQ('**模範**となる{行動|こうどう}。', 'もはん', ['もぱん', 'ぼはん', 'もばん'], '**{模範|もはん}** — 模 モ ở từ này.'),
        MQ('{代金|だいきん}を**一括**で{払|はら}う。', 'いっかつ', ['いちかつ', 'いっかく', 'いちくく'], '**{一括|いっかつ}** — いち → いっ (âm ngắt).'),
        MQ('**記入欄**に{名前|なまえ}を{書|か}く。', 'きにゅうらん', ['きにゅらん', 'きいりらん', 'きにゅうかん'], '**{記入欄|きにゅうらん}** — 入 ニュウ (trường âm) + 欄 ラン.'),
        MQ('**冒険**の{物語|ものがたり}を{読|よ}む。', 'ぼうけん', ['ぼけん', 'もうけん', 'ぼうげん'], '**{冒険|ぼうけん}** — 冒 ボウ.'),
        MQ('{山|やま}の**尾根**を{歩|ある}く。', 'おね', ['びね', 'おこん', 'しっぽね'], '**{尾根|おね}** — cả hai chữ đọc Kun (お + ね).'),
        MQ('これは**典型的**な{例|れい}だ。', 'てんけいてき', ['でんけいてき', 'てんかたてき', 'てんけてき'], '**{典型的|てんけいてき}** — 典 テン (không đục).'),
        MQ('**重視**すべき{点|てん}を{整理|せいり}する。', 'じゅうし', ['じゅし', 'おもし', 'ちょうし'], '**{重視|じゅうし}** — 重 ジュウ (trường âm).'),
        MQ('{失敗|しっぱい}を**潔**く{認|みと}める。', 'いさぎよ', ['きよ', 'いさぎ', 'けつ'], '**{潔|いさぎよ}く** — thẳng thắn, dứt khoát (5 âm tiết).'),
        MQ('{試合|しあい}の**終盤**に{逆転|ぎゃくてん}した。', 'しゅうばん', ['しゅうはん', 'しゅばん', 'おわりばん'], '**{終盤|しゅうばん}** — 盤 バン (đục).'),
        MQ('**改訂版**が{出|で}た。', 'かいていばん', ['かいていはん', 'かいていぱん', 'かいちょうばん'], '**{改訂版|かいていばん}** — 版 → バン.'),
        MQ('{毎朝|まいあさ}**朝刊**を{読|よ}む。', 'ちょうかん', ['あさかん', 'ちょうがん', 'ちょかん'], '**{朝刊|ちょうかん}** — 朝 チョウ + 刊 カン.'),
      ],
    },
    {
      t: 'mcq',
      id: 'b52-lt2-viet',
      title: '表記 (15 câu)',
      items: [
        MQ('**じょばん**から{点|てん}を{取|と}られた。', '序盤', ['予盤', '除盤', '叙盤'], '**序盤** — 广 + 予.'),
        MQ('{彼|かれ}の**ぶんしょう**は{読|よ}みやすい。', '文章', ['文障', '文彰', '文商'], '**文章** — 音 + 十.'),
        MQ('{気|き}にしなくても**かま**わない。', '構', ['講', '購', '溝'], '**構わない** — 木 + 冓.'),
        MQ('{論文|ろんぶん}を**しっぴつ**する。', '執筆', ['熱筆', '執必', '勢筆'], '**執筆** — 執 (phải là 丸). 熱 có 灬.'),
        MQ('{発表|はっぴょう}の**ようし**をまとめる。', '要旨', ['要指', '要脂', '要紙'], '**要旨** — 匕 + 日. 指 có 扌.'),
        MQ('{今年|ことし}の{活動|かつどう}を**そうかつ**する。', '総括', ['総活', '総話', '総括弧'], '**総括** — 扌 + 舌.'),
        MQ('{答|こた}えを**くうらん**に{書|か}く。', '空欄', ['空蘭', '空闌', '空覧'], '**空欄** — 木 + 闌.'),
        MQ('{間違|まちが}いの**かしょ**に{印|しるし}をつける。', '箇所', ['箇処', '過所', '固所'], '**箇所** — ⺮ + 固 (thẻ tre đếm từng chỗ).'),
        MQ('{犬|いぬ}が**お**を{振|ふ}っている。', '尾', ['屋', '毛', '局'], '**尾** — 尸 + 毛.'),
        MQ('**じてん**で{意味|いみ}を{調|しら}べる。', '辞典', ['辞点', '辞展', '時典'], '**辞典** — 典 (冊 trên giá).'),
        MQ('{規則|きそく}を**むし**してはいけない。', '無視', ['無規', '無示', '無試'], '**無視** — 礻 + 見. 規 có 夫.'),
        MQ('{口|くち}が**かた**い{人|ひと}。（kín miệng）', '堅', ['硬', '賢', '緊'], '**口が堅い** — dùng **堅**. 硬 (Bài 50) cho vật cứng.'),
        MQ('{人間|にんげん}にとって**ふへん**な{価値|かち}。', '普遍', ['普編', '普偏', '普返'], '**普遍** — 辶 + 扁. 編 (biên tập) có 糸.'),
        MQ('**がいとうしゃ**は{窓口|まどぐち}に{来|き}てください。', '該当者', ['刻当者', '核当者', '外当者'], '**該当者** (người thuộc diện) — 言 + 亥.'),
        MQ('**りんり**{的|てき}な{問題|もんだい}。', '倫理', ['論理', '輪理', '倫里'], '**倫理** (đạo đức). **論理** (logic) là từ KHÁC.'),
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b52-lt-3-ngu-phap',
  kind: 'homework',
  title: 'Luyện thêm 3 · Ngữ pháp — nối đúng thể → chọn đúng mẫu (30 câu)',
  goal: 'Nối đúng thể trước năm mẫu (た上で／る上で, Nの面で／～的な面で, ～という点で, である, べきだ／すべき／べきではない, ねばならない／せねば) rồi chọn đúng mẫu giữa các anh em gần nghĩa (上で・うえに・てから · 面で・点で・において · べきだ・はずだ・なければならない・ほうがいい・ものだ · ねばならない・ざるを得ない・しかない).',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟡 Nối đúng thể (15 câu)** — chỉ hỏi một việc: chữ đứng trước mẫu phải ở dạng nào. Sai câu nào: xem lại bảng "Cách nối" của mẫu đó.',
        '**🔴 Chọn đúng mẫu (15 câu)** — bốn lựa chọn đều là mẫu thật; phải hiểu ý câu. Sai câu nào: xem bảng phân biệt ⑥⑦⑧⑨.',
      ],
    },
    {
      t: 'mcq',
      id: 'b52-lt3-noi',
      title: '🟡 Nối đúng thể (15 câu)',
      items: [
        MQ('{先生|せんせい}に{相談|そうだん}（　）{上|うえ}で、テーマを{決|き}める。', 'した', ['する', 'して', 'し'], '(a) rồi mới → **Vた＋{上|うえ}で**.'),
        MQ('{日本|にほん}で{生活|せいかつ}（　）{上|うえ}で、{大切|たいせつ}なことは{何|なん}だろう。', 'する', ['した', 'して', 'しない'], '(b) khi làm → **V{辞書形|じしょけい}＋{上|うえ}で**.'),
        MQ('ご{確認|かくにん}（　）{上|うえ}、お{申|もう}し{込|こ}みください。', 'の', ['を', 'に', 'が'], 'Danh từ hành động + **の{上|うえ}**.'),
        MQ('{両親|りょうしん}は{経済的|けいざいてき}（　）{面|めん}で{支|ささ}えてくれた。', 'な', ['の', 'に', 'だ'], '～{的|てき} là tính từ ナ → **～{的|てき}な{面|めん}で**.'),
        MQ('この{計画|けいかく}は{安全|あんぜん}（　）{面|めん}に{問題|もんだい}がある。', 'の', ['な', 'に', 'を'], 'Danh từ + **の{面|めん}**.'),
        MQ('{持|も}ち{運|はこ}びやすい（　）{点|てん}で、このパソコンを{選|えら}んだ。', 'という', ['の', 'な', 'に'], 'Mệnh đề + **という{点|てん}で**.'),
        MQ('{回答者|かいとうしゃ}は{百名|ひゃくめい}（　）。（である体・quá khứ）', 'であった', ['でした', 'であるだ', 'だったです'], 'N + **であった** (văn viết, quá khứ).'),
        MQ('この{方法|ほうほう}は{費用|ひよう}が（　）。（である体）', '{高|たか}い', ['{高|たか}いである', '{高|たか}いだ', '{高|たか}いです'], 'Tính từ イ: **không** thêm だ／である.'),
        MQ('{利用者|りようしゃ}は{大幅|おおはば}に{増加|ぞうか}した（　）。（のです → である体）', 'のである', ['のです', 'のであるだ', 'んです'], '**～のです → ～のである**.'),
        MQ('{約束|やくそく}は{守|まも}る（　）だ。', 'べき', ['べく', 'べきの', 'べきに'], 'V{辞書形|じしょけい} + **べきだ**.'),
        MQ('もっと{勉強|べんきょう}（　）べきだ。', 'す', ['し', 'せ', 'さ'], '**する → すべき**.'),
        MQ('{人|ひと}の{日記|にっき}を{勝手|かって}に{読|よ}む（　）。', 'べきではない', ['ないべきだ', 'べきないだ', 'べきにない'], 'Phủ định ở べき → **べきではない**.'),
        MQ('{出典|しゅってん}は{必|かなら}ず{書|か}か（　）ならない。', 'ねば', ['ねは', 'ないば', 'ずば'], 'Vない（bỏ ない）+ **ねばならない**.'),
        MQ('この{問題|もんだい}は{社会全体|しゃかいぜんたい}で{解決|かいけつ}（　）ねばならない。', 'せ', ['し', 'す', 'さ'], '**する → せねばならない**.'),
        MQ('{裁判官|さいばんかん}は{公平|こうへい}（　）べきだ。', 'である', ['だ', 'な', 'に'], 'ナA + **であるべきだ**.'),
      ],
    },
    {
      t: 'mcq',
      id: 'b52-lt3-chon',
      title: '🔴 Chọn đúng mẫu (15 câu)',
      items: [
        MQ('{契約書|けいやくしょ}の{内容|ないよう}をよく{読|よ}んだ（　）、サインしてください。', '{上|うえ}で', ['うえに', 'ばかりに', 'からには'], 'Bước cần có (đọc kỹ) → hành động có chủ ý (ký) → **た{上|うえ}で**.'),
        MQ('ご{飯|はん}を{食|た}べて（　）、{歯|は}を{磨|みが}きなさい。', 'から', ['{上|うえ}で', 'うえに', 'ばかりに'], 'Thứ tự đơn giản → **てから** (không dùng た上で cho việc vặt).'),
        MQ('このパソコンは{軽|かる}い（　）、{電池|でんち}も{長|なが}く{持|も}つ。', 'うえに', ['{上|うえ}で', '{面|めん}で', 'べきで'], 'Cộng thêm ý tốt → **うえに** (Bài 29).'),
        MQ('{留学生|りゅうがくせい}が{日本|にほん}で{部屋|へや}を{探|さが}す（　）、{一番|いちばん}{困|こま}ることは{何|なん}か。', '{上|うえ}で', ['うえに', 'てから', 'た{後|あと}で'], 'V{辞書形|じしょけい} + đánh giá (困ること) → **る{上|うえ}で**.'),
        MQ('この{車|くるま}は、{燃費|ねんぴ}の（　）では{優|すぐ}れているが、{値段|ねだん}が{高|たか}い。', '{面|めん}', ['{上|うえ}', 'はず', 'べき'], 'Về một mặt (tiêu hao nhiên liệu) → **{面|めん}**.'),
        MQ('{子|こ}どもでも{使|つか}えるという（　）、この{アプリ|あぷり}は{評価|ひょうか}されている。', '{点|てん}で', ['{面|めん}に', '{上|うえ}に', 'において'], 'Mệnh đề + という → **{点|てん}で**.'),
        MQ('{国際会議|こくさいかいぎ}は{来月|らいげつ}、{京都|きょうと}（　）{開|ひら}かれる。', 'において', ['にとって', 'について', 'に{対|たい}して'], 'Nơi diễn ra sự kiện → **において**.'),
        MQ('{留学生|りゅうがくせい}（　）、{日本|にほん}の{敬語|けいご}は{難|むずか}しい。', 'にとって', ['において', 'について', 'の{面|めん}で'], 'Lập trường của NGƯỜI + đánh giá → **にとって** (Bài 30).'),
        MQ('{困|こま}っている{友達|ともだち}がいたら、{助|たす}ける（　）。', 'べきだ', ['はずだ', 'わけだ', 'おそれがある'], 'Ý kiến đạo lý → **べきだ**. はずだ = suy đoán; おそれがある = lo điều xấu.'),
        MQ('{彼|かれ}は{十年|じゅうねん}も{日本|にほん}に{住|す}んでいたから、{日本語|にほんご}が{上手|じょうず}な（　）。', 'はずだ', ['べきだ', 'ことだ', 'ねばならない'], 'Suy luận có căn cứ → **はずだ**.'),
        MQ('この{国|くに}では、{車|くるま}は{道|みち}の{左側|ひだりがわ}を{走|はし}ら（　）。', 'なければならない', ['べきだ', 'はずだ', 'ものだ'], 'Luật, quy định → **なければならない**, không phải べきだ.'),
        MQ('{熱|ねつ}があるなら、{今日|きょう}は{早|はや}く{寝|ね}た（　）よ。（bạn bè）', 'ほうがいい', ['べきだ', 'はずだ', 'ねばならない'], 'Khuyên bạn nhẹ nhàng → **ほうがいい**.'),
        MQ('{我々|われわれ}は、{平和|へいわ}の{大切|たいせつ}さを{次|つぎ}の{世代|せだい}に{伝|つた}え（　）。', 'ねばならない', ['てはならない', 'しかない', 'はずがない'], 'Giọng kêu gọi, chủ ngữ 我々 → **ねばならない**. 伝えてはならない ngược nghĩa; しかない・はずがない không nối được sau 伝え.'),
        MQ('{会社|かいしゃ}の{命令|めいれい}なので、{行|い}きたくないが{出張|しゅっちょう}に{行|い}か（　）。', 'ざるを{得|え}ない', ['ずにはいられない', 'べきだ', 'しかない'], 'Không muốn mà vẫn phải, do bên ngoài ép → **ざるを{得|え}ない** (Bài 45). 行かずにはいられない = không kìm được mà đi (trái với 行きたくない); べきだ・しかない không nối được sau 行か.'),
        MQ('バスも{電車|でんしゃ}もないので、{歩|ある}いて{帰|かえ}る（　）。', 'しかない', ['わけがない', 'ものか', 'ねばならない'], 'Không còn lựa chọn khác → **しかない** (Bài 47). わけがない・ものか trái với hoàn cảnh; ねばならない không nối sau 帰る.'),
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b52-lt-4-van-canh',
  kind: 'homework',
  title: 'Luyện thêm 4 · Văn cảnh, văn viết & 文の組み立て ★ (20 câu)',
  goal: 'Chọn đúng mẫu / từ trong đoạn văn bản thật (thông báo, báo cáo, email, bài luận), nhận ra câu văn viết đúng, và sắp xếp câu kiểu ★ của đề N2.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**Văn cảnh (12 câu)** — đọc cả câu dài, xác định loại văn bản (thông báo · báo cáo · luận · nói) rồi mới chọn. Văn viết → である, しかし, したがって, において; văn nói → です・ます, でも, だから.',
        '**★ (8 câu)** — xếp 4 mảnh; mẹo: tìm cặp **dính nhau** trước (～た + 上で · ～という + 点で · ～べき + N · ～で + あらねばならない).',
      ],
    },
    {
      t: 'mcq',
      id: 'b52-lt4-van-canh',
      title: 'Văn cảnh & văn viết (12 câu)',
      items: [
        MQ('【{大学|だいがく}のお{知|し}らせ】{奨学金|しょうがくきん}の{申請|しんせい}を{希望|きぼう}する{学生|がくせい}は、{募集要項|ぼしゅうようこう}を{読|よ}んだ（　）、{必要|ひつよう}な{書類|しょるい}をそろえて{提出|ていしゅつ}すること。', '{上|うえ}で', ['うえに', '{面|めん}で', 'べきで'], 'Đọc hướng dẫn (bước cần) → nộp (có chủ ý) → **た{上|うえ}で**.'),
        MQ('【{報告書|ほうこくしょ}】{新|しん}システムは、{作業効率|さぎょうこうりつ}の（　）では{大|おお}きな{効果|こうか}があったが、{費用|ひよう}がかかりすぎるという{問題|もんだい}が{残|のこ}る。', '{面|めん}', ['{上|うえ}', '{点|てん}に', 'はず'], 'Về mặt hiệu suất ↔ vấn đề chi phí → **の{面|めん}では～が**.'),
        MQ('【レポート】アンケートの{結果|けっか}、{回答者|かいとうしゃ}の{七割|ななわり}が「{満足|まんぞく}している」と{答|こた}えた。（　）、{自由記述|じゆうきじゅつ}には{不満|ふまん}の{声|こえ}も{多|おお}く{見|み}られた。', 'しかし', ['でも', 'だから', 'それに'], 'Văn viết + đối lập → **しかし** (でも là văn nói; だから・それに sai nghĩa).'),
        MQ('【レポート】{以上|いじょう}の{結果|けっか}から、{睡眠時間|すいみんじかん}と{成績|せいせき}には{関係|かんけい}があると（　）。', '{考|かんが}えられる', ['{思|おも}います', '{感|かん}じた', '{思|おも}っちゃう'], 'Suy luận khách quan trong 考察 → **～と{考|かんが}えられる**.'),
        MQ('【{社説|しゃせつ}】{子|こ}どもたちの{未来|みらい}のために、{我々|われわれ}{大人|おとな}は{今|いま}こそ{行動|こうどう}せ（　）。', 'ねばならない', ['なければならない', 'てはならない', 'べきではない'], 'Giọng xã luận kêu gọi + せ → **せねばならない**. Ba lựa chọn kia không nối được sau せ.'),
        MQ('【ゼミ】{学生|がくせい}：{先生|せんせい}、{卒論|そつろん}のテーマを{決|き}める（　）、{何|なに}を{一番|いちばん}{大切|たいせつ}にすればいいですか。', '{上|うえ}で', ['うえに', 'てから', 'た{上|うえ}で'], 'Khi làm V (決める) + điều quan trọng → **る{上|うえ}で**.'),
        MQ('【メール】{田中|たなか}さん、{会議|かいぎ}の{資料|しりょう}は{昨日|きのう}お{送|おく}りしましたので、もう{届|とど}いている（　）。', 'はずです', ['わけがありません', 'ものです', 'ことです'], 'Có căn cứ (đã gửi hôm qua) → **はずです**.'),
        MQ('【レポート】{本調査|ほんちょうさ}の{対象|たいしょう}は{一|ひと}つの{大学|だいがく}に{限|かぎ}られている。（　）、この{結果|けっか}をすべての{大学生|だいがくせい}に{当|あ}てはめることはできない。', 'したがって', ['しかし', 'たとえば', 'なお'], 'Nguyên nhân → kết quả (văn viết) → **したがって**.'),
        MQ('レポートの{文|ぶん}として{最|もっと}も{適切|てきせつ}なものはどれか。', '{回答者|かいとうしゃ}の{多|おお}くは、アプリを{毎日|まいにち}{使|つか}っていると{答|こた}えた。', ['{回答者|かいとうしゃ}の{多|おお}くは、アプリを{毎日|まいにち}{使|つか}ってるって{答|こた}えた。', '{回答者|かいとうしゃ}の{多|おお}くは、アプリを{毎日|まいにち}{使|つか}っていると{答|こた}えました。', '{回答者|かいとうしゃ}の{多|おお}くは、アプリをいっぱい{使|つか}っているみたいだ。'], 'Văn viết, thể thường: đúng. Các câu kia: ～てる・って (văn nói) · です・ます · いっぱい・みたい (văn nói).'),
        MQ('「{結果|けっか}は{予想|よそう}とすごく{違|ちが}った」をレポートの{文|ぶん}にしたものはどれか。', '{結果|けっか}は{予想|よそう}と{大|おお}きく{異|こと}なった。', ['{結果|けっか}は{予想|よそう}とすごく{異|こと}なった。', '{結果|けっか}は{予想|よそう}と{大|おお}きく{違|ちが}ったです。', '{結果|けっか}は{予想|よそう}と{大|おお}きく{違|ちが}ったである。'], 'すごく → **{大|おお}きく**, {違|ちが}う → **{異|こと}なる**; không thêm です／である sau động từ.'),
        MQ('{引用|いんよう}の{書|か}き{方|かた}として{正|ただ}しいものはどれか。', '{鈴木|すずき}（2020）は、「{読|よ}むことは{書|か}くことの{始|はじ}まりである」と{述|の}べている。', ['{鈴木|すずき}さんの{本|ほん}に、{読|よ}むことが{大事|だいじ}って{書|か}いてあった。', '「{読|よ}むことは{書|か}くことの{始|はじ}まりである」。', '{読|よ}むことは{書|か}くことの{始|はじ}まりであると{私|わたし}は{考|かんが}えた。（{出典|しゅってん}なし）'], 'Trực tiếp: **tác giả（năm）、「nguyên văn」と{述|の}べている**. Câu 4 lấy ý người khác làm ý mình — 盗用.'),
        MQ('{報告書|ほうこくしょ}の{冒頭|ぼうとう}の{文|ぶん}として{最|もっと}も{適切|てきせつ}なものはどれか。', '{結論|けつろん}から{述|の}べると、{新|しん}システムの{導入|どうにゅう}を{提案|ていあん}したい。', ['まず、{私|わたし}がこの{仕事|しごと}を{始|はじ}めたきっかけを{話|はな}したい。', '{結論|けつろん}は{最後|さいご}に{述|の}べることにする。', 'この{報告書|ほうこくしょ}はすごく{長|なが}くなってしまった。'], 'Báo cáo công việc: **kết luận TRƯỚC** (hội thoại ②).'),
      ],
    },
    {
      t: 'mcq',
      id: 'b52-lt4-sap-xep',
      title: '文の組み立て ★ (8 câu)',
      items: [
        { q: '★ {留学|りゅうがく}するかどうかは、＿＿ ＿＿ ★ ＿＿ つもりだ。（{上|うえ}で／{両親|りょうしん}と／{決|き}める／{相談|そうだん}した）', options: ['{上|うえ}で', '{両親|りょうしん}と', '{決|き}める', '{相談|そうだん}した'], correct: 0, why: 'Câu đúng: **{両親|りょうしん}と {相談|そうだん}した {上|うえ}で {決|き}める** つもりだ. ★ (ô 3) = **{上|うえ}で**.' },
        { q: '★ {外国語|がいこくご}を ＿＿ ★ ＿＿ ＿＿ {毎日|まいにち}{続|つづ}けることだ。（{上|うえ}で／{学|まな}ぶ／{大切|たいせつ}なのは／{最|もっと}も）', options: ['{上|うえ}で', '{学|まな}ぶ', '{大切|たいせつ}なのは', '{最|もっと}も'], correct: 0, why: 'Câu đúng: {外国語|がいこくご}を **{学|まな}ぶ {上|うえ}で {最|もっと}も {大切|たいせつ}なのは** {毎日|まいにち}{続|つづ}けることだ. ★ (ô 2) = **{上|うえ}で**.' },
        { q: '★ この{案|あん}は ＿＿ ＿＿ ★ ＿＿ {問題|もんだい}がある。（{面|めん}では／{安全|あんぜん}の／{費用|ひよう}は{安|やす}いが／まだ）', options: ['{面|めん}では', '{安全|あんぜん}の', '{費用|ひよう}は{安|やす}いが', 'まだ'], correct: 0, why: 'Câu đúng: この{案|あん}は **{費用|ひよう}は{安|やす}いが {安全|あんぜん}の {面|めん}では まだ** {問題|もんだい}がある. ★ (ô 3) = **{面|めん}では**.' },
        { q: '★ A{社|しゃ}の{製品|せいひん}は ＿＿ ★ ＿＿ ＿＿ 。（{点|てん}で／{壊|こわ}れにくい／という／{優|すぐ}れている）', options: ['{点|てん}で', '{壊|こわ}れにくい', 'という', '{優|すぐ}れている'], correct: 2, why: 'Câu đúng: A{社|しゃ}の{製品|せいひん}は **{壊|こわ}れにくい という {点|てん}で {優|すぐ}れている**. ★ (ô 2) = **という**.' },
        { q: '★ {他人|たにん}の ＿＿ ＿＿ ★ ＿＿ 。（{使|つか}う／{出典|しゅってん}を{書|か}かずに／べきではない／{文章|ぶんしょう}を）', options: ['{使|つか}う', '{出典|しゅってん}を{書|か}かずに', 'べきではない', '{文章|ぶんしょう}を'], correct: 0, why: 'Câu đúng: {他人|たにん}の **{文章|ぶんしょう}を {出典|しゅってん}を{書|か}かずに {使|つか}う べきではない**. ★ (ô 3) = **{使|つか}う**.' },
        { q: '★ {今回|こんかい}の{調査|ちょうさ}で ＿＿ ★ ＿＿ ＿＿ ある。（{課題|かだい}が／{取|と}り{組|く}む／べき／{三|みっ}つ）', options: ['{課題|かだい}が', '{取|と}り{組|く}む', 'べき', '{三|みっ}つ'], correct: 2, why: 'Câu đúng: {今回|こんかい}の{調査|ちょうさ}で **{取|と}り{組|く}む べき {課題|かだい}が {三|みっ}つ** ある. ★ (ô 2) = **べき**.' },
        { q: '★ {教師|きょうし}は ＿＿ ＿＿ ★ ＿＿ 。（{公平|こうへい}で／ならない／{生徒|せいと}に{対|たい}して／あらねば）', options: ['{公平|こうへい}で', 'ならない', '{生徒|せいと}に{対|たい}して', 'あらねば'], correct: 3, why: 'Câu đúng: {教師|きょうし}は **{生徒|せいと}に{対|たい}して {公平|こうへい}で あらねば ならない**. ★ (ô 3) = **あらねば**.' },
        { q: '★ {本|ほん}レポートでは、＿＿ ★ ＿＿ ＿＿ {考察|こうさつ}する。（アンケートの／{結果|けっか}を{示|しめ}した／{上|うえ}で／その{原因|げんいん}を）', options: ['アンケートの', '{結果|けっか}を{示|しめ}した', '{上|うえ}で', 'その{原因|げんいん}を'], correct: 1, why: 'Câu đúng: {本|ほん}レポートでは、**アンケートの {結果|けっか}を{示|しめ}した {上|うえ}で その{原因|げんいん}を** {考察|こうさつ}する. ★ (ô 2) = **{結果|けっか}を{示|しめ}した**.' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b52-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp Bài 52 — 22 câu, thang 100 điểm',
  goal: 'Làm một đề mini đủ phần (từ vựng · chữ Hán · ngữ pháp · đọc hiểu) trong 30 phút, tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Thang điểm & cách ôn',
      items: [
        '**Cấu trúc**: I. 文字・語彙 (8 câu × 4 điểm = 32) · II. 文法 (10 câu × 4 = 40) · III. 読解 (một đoạn ~450 chữ, 4 câu × 7 = 28). Tổng **100 điểm**, thời gian **30 phút**.',
        '**Đánh giá**: ≥ 80 — vững Bài 52, sang Bài 53 · 60–79 — ôn lại bốn bảng phân biệt (mục Ngữ pháp ⑥⑦⑧⑨) và bảng văn nói → văn viết · < 60 — học lại 3 buổi trên lớp rồi làm lại đề.',
        '**Sai câu nào ôn mục nào**: phần I câu 1–4 → mục Từ vựng (bảng 類義語) · câu 5–8 → mục Chữ Hán · phần II câu 1–3 → ① 上で + bảng ⑥ · câu 4–5 → ② 面で + bảng ⑦ · câu 6 → ③ である体 · câu 7–8 → ④ べきだ + bảng ⑧ · câu 9–10 → ⑤ ねばならない + bảng ⑨ · phần III → mục Đọc + mục Viết (bố cục レポート).',
      ],
    },
    { t: 'h', text: 'I. 文字・語彙 (8 câu × 4 điểm)' },
    {
      t: 'mcq',
      id: 'b52-lt5-tu',
      title: 'I. 文字・語彙',
      items: [
        MQ('（{文脈|ぶんみゃく}）{結果|けっか}を{示|しめ}すだけでなく、その{意味|いみ}を{根拠|こんきょ}に{基|もと}づいて（　）しなければならない。', '{考察|こうさつ}', ['{感想|かんそう}', '{執筆|しっぴつ}', '{出版|しゅっぱん}'], 'Giải thích ý nghĩa có căn cứ → **{考察|こうさつ}**.'),
        MQ('（{文脈|ぶんみゃく}）レポートの{最後|さいご}には、{使|つか}った{本|ほん}や{論文|ろんぶん}を（　）として{挙|あ}げる。', '{参考文献|さんこうぶんけん}', ['{議事録|ぎじろく}', '{見出|みだ}し', '{要旨|ようし}'], 'Danh mục tài liệu đã dùng → **{参考文献|さんこうぶんけん}**.'),
        MQ('（{言|い}い{換|か}え）「{彼|かれ}の{説明|せつめい}は{簡潔|かんけつ}だ」に{最|もっと}も{近|ちか}いのは？', '{彼|かれ}の{説明|せつめい}は{短|みじか}くて{分|わ}かりやすい', ['{彼|かれ}の{説明|せつめい}は{長|なが}くて{詳|くわ}しい', '{彼|かれ}の{説明|せつめい}は{難|むずか}しい', '{彼|かれ}の{説明|せつめい}は{間違|まちが}っている'], '**{簡潔|かんけつ}** = ngắn gọn, súc tích.'),
        MQ('（{用法|ようほう}）「{言及|げんきゅう}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', '{社長|しゃちょう}は{記者会見|きしゃかいけん}で、{事故|じこ}の{原因|げんいん}にも{言及|げんきゅう}した。', ['{毎朝|まいあさ}、{駅|えき}まで{言及|げんきゅう}して{行|い}く。', '{友達|ともだち}に{手紙|てがみ}を{言及|げんきゅう}した。', 'この{料理|りょうり}はよく{言及|げんきゅう}されている。'], '**～に{言及|げんきゅう}する** = đề cập tới (một chủ đề).'),
        MQ('（{読|よ}み）レポートの**構成**を{考|かんが}える。', 'こうせい', ['こせい', 'こうぜい', 'かませい'], '**{構成|こうせい}** — 構 コウ.'),
        MQ('（{読|よ}み）{会社|かいしゃ}の**規模**が{大|おお}きい。', 'きぼ', ['きも', 'きぼう', 'ぎぼ'], '**{規模|きぼ}** — 模 = ボ ở từ này.'),
        MQ('（{表記|ひょうき}）{必|かなら}ず**しゅってん**を{書|か}くこと。', '出典', ['出展', '出点', '出店'], '**出典** (nguồn trích dẫn).'),
        MQ('（{表記|ひょうき}）{相手|あいて}の**してん**に{立|た}つ。', '視点', ['規点', '支点', '始点'], '**視点** — 礻 + 見.'),
      ],
    },
    { t: 'h', text: 'II. 文法 (10 câu × 4 điểm)' },
    {
      t: 'mcq',
      id: 'b52-lt5-ngu-phap',
      title: 'II. 文法',
      items: [
        MQ('{内容|ないよう}を{十分|じゅうぶん}に{理解|りかい}した（　）、{署名|しょめい}をお{願|ねが}いします。', '{上|うえ}で', ['うえに', 'ばかりに', 'ものの'], 'Vた + bước cần có → **{上|うえ}で**.'),
        MQ('{日本|にほん}の{会社|かいしゃ}で{働|はたら}く（　）、{報告|ほうこく}・{連絡|れんらく}・{相談|そうだん}は{欠|か}かせない。', '{上|うえ}で', ['うえに', 'た{上|うえ}で', '{一方|いっぽう}で'], 'V{辞書形|じしょけい} + đánh giá → **る{上|うえ}で**.'),
        MQ('このかばんは{丈夫|じょうぶ}な（　）、{軽|かる}くて{持|も}ちやすい。', 'うえに', ['{上|うえ}で', '{面|めん}で', 'べきで'], 'Cộng thêm ý tốt → **うえに** (Bài 29).'),
        MQ('{一人暮|ひとりぐ}らしを{始|はじ}めて、{経済的|けいざいてき}な（　）で{苦労|くろう}している。', '{面|めん}', ['{点|てん}', '{上|うえ}', 'はず'], '～{的|てき}な + **{面|めん}で**.'),
        MQ('{子|こ}どもでも{安全|あんぜん}に{使|つか}えるという（　）、この{製品|せいひん}は{人気|にんき}がある。', '{点|てん}で', ['{面|めん}に', 'において', '{上|うえ}に'], 'Mệnh đề + という → **{点|てん}で**.'),
        MQ('だ・である{体|たい}として{正|ただ}しいものはどれか。', 'この{結果|けっか}は{予想外|よそうがい}であった。', ['この{結果|けっか}は{予想外|よそうがい}でした。', 'この{結果|けっか}は{予想外|よそうがい}だったです。', 'この{結果|けっか}は{予想外|よそうがい}であったです。'], 'N + **であった** (không trộn です).'),
        MQ('{一度|いちど}の{失敗|しっぱい}で、{人|ひと}を{判断|はんだん}（　）。', 'すべきではない', ['しないべきだ', 'すべきだった', 'するはずだ'], 'Phê phán → **すべきではない**.'),
        MQ('{田中|たなか}さんは{出張|しゅっちょう}から{今日|きょう}{戻|もど}る{予定|よてい}だから、{明日|あした}は{会社|かいしゃ}に{来|く}る（　）。', 'はずだ', ['わけがない', 'ことだ', 'ねばならない'], 'Có căn cứ (theo lịch trình) → suy đoán **はずだ**.'),
        MQ('{政府|せいふ}は、この{問題|もんだい}に{早急|そうきゅう}に{対応|たいおう}せ（　）。', 'ねばならない', ['なければならない', 'べきではない', 'てはならない'], 'Giọng xã luận + せ → **せねばならない**. Ba lựa chọn kia không nối được sau せ (しなければ・すべきでは・してはならない).'),
        MQ('{大雪|おおゆき}で{飛行機|ひこうき}が{飛|と}ばず、{旅行|りょこう}を{中止|ちゅうし}（　）。', 'せざるを{得|え}なかった', ['するべきだ', 'するはずだ', 'しかなかった'], 'Hoàn cảnh ép + việc đã xảy ra → **せざるを{得|え}なかった** (Bài 45). するべきだ・するはずだ không hợp ngữ cảnh quá khứ; 中止しかなかった thiếu する (đúng phải là 中止するしかなかった).'),
      ],
    },
    { t: 'h', text: 'III. 読解 (4 câu × 7 điểm)' },
    {
      t: 'passage',
      title: '{報告書|ほうこくしょ}は{誰|だれ}のために{書|か}くのか',
      intro: 'Bài luận ngắn (~450 chữ, tác giả giả định). Đọc rồi trả lời 4 câu.',
      paras: [
        { label: '①', text: '{新入社員|しんにゅうしゃいん}の{報告書|ほうこくしょ}を{読|よ}むと、{一|ひと}つの{共通点|きょうつうてん}に{気|き}づく。{書|か}いた{本人|ほんにん}が{何|なに}をしたかは{詳|くわ}しく{書|か}いてあるのに、{読|よ}む{人|ひと}が{何|なに}を{判断|はんだん}すべきかが{書|か}いていないのである。' },
        { label: '②', text: '{大学|だいがく}のレポートでは、{調|しら}べた{順|じゅん}に、{序論|じょろん}から{丁寧|ていねい}に{書|か}くことが{求|もと}められる。その{習慣|しゅうかん}のまま{報告書|ほうこくしょ}を{書|か}くと、{結論|けつろん}は{最後|さいご}の{数行|すうぎょう}になってしまう。しかし、{上司|じょうし}は{忙|いそが}しい。{最後|さいご}まで{読|よ}む{時間|じかん}がないことも{多|おお}い。' },
        { label: '③', text: 'もちろん、レポートの{書|か}き{方|かた}が{間違|まちが}っているわけではない。{読|よ}む{人|ひと}も{目的|もくてき}も{違|ちが}うのである。{報告書|ほうこくしょ}を{書|か}く{上|うえ}で{大切|たいせつ}なのは、「{自分|じぶん}が{何|なに}をしたか」ではなく、「{読|よ}む{人|ひと}が{次|つぎ}に{何|なに}をすればよいか」を{冒頭|ぼうとう}で{示|しめ}すことだ。{報告書|ほうこくしょ}は、{書|か}き{手|て}のためではなく、{読|よ}み{手|て}のために{書|か}かねばならないのである。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b52-lt5-doc',
      title: 'III. 読解',
      items: [
        { q: '①によると、{新入社員|しんにゅうしゃいん}の{報告書|ほうこくしょ}に{共通|きょうつう}する{問題|もんだい}は{何|なに}か。', options: ['{自分|じぶん}がしたことが{書|か}いていない', '{読|よ}む{人|ひと}が{判断|はんだん}すべきことが{書|か}いていない', '{字数|じすう}が{足|た}りない', '{序論|じょろん}がない'], correct: 1, why: '**{書|か}いた{本人|ほんにん}が{何|なに}をしたかは{詳|くわ}しく{書|か}いてあるのに、{読|よ}む{人|ひと}が{何|なに}を{判断|はんだん}すべきかが{書|か}いていない**.' },
        { q: '②で、{報告書|ほうこくしょ}の{結論|けつろん}が{最後|さいご}になってしまうのはなぜか。', options: ['{上司|じょうし}がそう{指示|しじ}するから', '{大学|だいがく}のレポートの{書|か}き{方|かた}の{習慣|しゅうかん}が{残|のこ}っているから', '{結論|けつろん}がまだ{決|き}まっていないから', '{報告書|ほうこくしょ}は{短|みじか}いほうがいいから'], correct: 1, why: '**その{習慣|しゅうかん}のまま{報告書|ほうこくしょ}を{書|か}くと、{結論|けつろん}は{最後|さいご}の{数行|すうぎょう}になってしまう** (習慣 = cách viết レポート từ序論).' },
        { q: '③「レポートの{書|か}き{方|かた}が{間違|まちが}っているわけではない」とあるが、{筆者|ひっしゃ}がそう{言|い}うのはなぜか。', options: ['レポートと{報告書|ほうこくしょ}では、{読|よ}む{人|ひと}も{目的|もくてき}も{違|ちが}うから', '{大学|だいがく}の{先生|せんせい}はみんな{忙|いそが}しくないから', '{報告書|ほうこくしょ}もレポートと{同|おな}じように{書|か}くべきだから', 'レポートのほうが{報告書|ほうこくしょ}より{難|むずか}しいから'], correct: 0, why: 'Câu ngay sau: **{読|よ}む{人|ひと}も{目的|もくてき}も{違|ちが}うのである**. (～わけではない = không phải là — Bài 31.)' },
        { q: '{筆者|ひっしゃ}の{考|かんが}えに{最|もっと}も{近|ちか}いのはどれか。', options: ['{報告書|ほうこくしょ}には、{自分|じぶん}がしたことをできるだけ{詳|くわ}しく{書|か}くべきだ', '{報告書|ほうこくしょ}は、{読|よ}む{人|ひと}が{次|つぎ}にすべきことを{最初|さいしょ}に{示|しめ}すべきだ', '{報告書|ほうこくしょ}も、{序論|じょろん}から{順番|じゅんばん}に{書|か}くべきだ', '{新入社員|しんにゅうしゃいん}には{報告書|ほうこくしょ}を{書|か}かせるべきではない'], correct: 1, why: '**{報告書|ほうこくしょ}を{書|か}く{上|うえ}で{大切|たいせつ}なのは…「{読|よ}む{人|ひと}が{次|つぎ}に{何|なに}をすればよいか」を{冒頭|ぼうとう}で{示|しめ}すこと** + **{読|よ}み{手|て}のために{書|か}かねばならない**.' },
      ],
    },
  ],
};

export const BAI_52: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
