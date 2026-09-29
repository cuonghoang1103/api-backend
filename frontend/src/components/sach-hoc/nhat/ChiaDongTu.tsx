'use client';

/**
 * Mục tra cứu "Chia động từ & tính từ" của khoá Dekiru (khối `chia`):
 *  1. Nhận biết nhóm I/II/III (kèm ngoại lệ).
 *  2. Mỗi thể một khung: quy tắc đổi đuôi theo từng nhóm (đuôi đổi tô màu) +
 *     "dùng khi nào" — các mẫu ngữ pháp dùng thể đó, ở bài mấy, ポイント số mấy.
 *  3. Tính từ い/な (+ danh từ): lịch sự, thể thường, nối, bổ nghĩa danh từ.
 *  4. Ô tra nhanh: gõ động từ (kana/kanji/romaji, thể ます hay từ điển) → đủ thể.
 *  5. Bài tập chia, chấm ngay.
 * Thuật toán: chia.ts (kiểm thử chia.test.ts). Câu ví dụ viết mới, có romaji.
 */
import { useMemo, useState } from 'react';
import { Check, RotateCcw, Search, Shuffle, Volume2, X } from 'lucide-react';
import { Inline } from '../Blocks';
import { play } from '../audio';
import { useTutor } from '../tutorContext';
import s from '../course.module.css';
import c from './chia.module.css';
import {
  ADJS, VERBS, bare, conjugate, conjugateAdj, findVerbs, reading, romajiToKana, splitTail, toRomaji,
  type Adj, type AdjKey, type FormKey, type Nhom, type Verb,
} from './chia';

const G = { 1: c.g1, 2: c.g2, 3: c.g3 } as const;
const GN = { 1: 'Nhóm I', 2: 'Nhóm II', 3: 'Nhóm III' } as const;
const byD = (d: string) => VERBS.find((v) => bare(v.d) === d)!;

/** Một dạng: phần giống gốc để thường, phần đổi tô màu nhóm. */
function Tail({ form, base }: { form: string; base: string }) {
  const [h, t] = splitTail(form, base);
  return <span className={c.jp}><Inline text={h} /><span className={c.tail}><Inline text={t} /></span></span>;
}

function Speak({ text }: { text: string }) {
  return <button type="button" className={c.speak} aria-label={`Nghe: ${bare(text)}`} onClick={() => play({ text: reading(text) })}><Volume2 size={14} /></button>;
}

/* ── Dữ liệu trình bày ─────────────────────────────────────────────────── */

type Use = { pat: string; bai: number; p: string; ex: string; ro: string; vi: string };
type FormDef = {
  id: string; name: string; bai: string; key: FormKey; from: 'jisho' | 'masu';
  rules: Record<Nhom, { text: string; ex: string[] }>;
  uses: Use[]; tip?: string;
};

const U = (pat: string, bai: number, p: string, ex: string, ro: string, vi: string): Use => ({ pat, bai, p, ex, ro, vi });

const FORMS: FormDef[] = [
  {
    id: 'masu', name: 'Thể ます (lịch sự)', bai: 'Bài 3 · ポイント 16', key: 'masu', from: 'jisho',
    rules: {
      1: { text: 'Đuôi âm う → đổi sang âm **い** cùng hàng + ます (う→い, く→き, む→み, る→り…).', ex: ['飲む', '書く', '帰る', '話す', '待つ'] },
      2: { text: 'Bỏ **る** + ます.', ex: ['食べる', '見る', '起きる'] },
      3: { text: 'する → **します** · 来る(くる) → **来ます(きます)**.', ex: ['する', '来る', '勉強する'] },
    },
    uses: [
      U('Vます／Vません', 3, '16', '{毎朝|まいあさ}コーヒーを{飲|の}みます。', 'Maiasa koohii o nomimasu.', 'Sáng nào tôi cũng uống cà phê.'),
      U('Vました／Vませんでした', 5, '37', '{昨日|きのう}、{映画|えいが}を{見|み}ました。', 'Kinou, eiga o mimashita.', 'Hôm qua tôi đã xem phim.'),
      U('V(ます)たいです', 5, '41', '{日本|にほん}へ{行|い}きたいです。', 'Nihon e ikitai desu.', 'Tôi muốn đi Nhật.'),
      U('N へ V(ます)に 行きます', 5, '42', 'デパートへ{服|ふく}を{買|か}いに{行|い}きます。', 'Depaato e fuku o kai ni ikimasu.', 'Tôi đi bách hoá (để) mua quần áo.'),
      U('Vませんか (rủ)', 6, '48', '{一緒|いっしょ}に{映画|えいが}を{見|み}ませんか。', 'Issho ni eiga o mimasen ka.', 'Cùng đi xem phim không?'),
      U('Vましょう', 6, '49', '{駅|えき}で{会|あ}いましょう。', 'Eki de aimashou.', 'Gặp nhau ở ga nhé.'),
      U('Vましょうか (đề nghị giúp)', 7, '65', '{窓|まど}を{開|あ}けましょうか。', 'Mado o akemashou ka.', 'Để tôi mở cửa sổ nhé?'),
      U('V(ます)方 — cách V', 7, '66', 'この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。', 'Kono kanji no yomikata o oshiete kudasai.', 'Chỉ tôi cách đọc chữ Hán này với.'),
    ],
    tip: 'Mọi thể khác đều đi ra từ thể ます: bỏ ます là còn **gốc ます** (飲み・食べ・し・き) — dùng cho たい, に行きます, 方.',
  },
  {
    id: 'jisho', name: 'Thể từ điển (辞書形)', bai: 'Bài 9 · trước ポイント 81', key: 'jisho', from: 'masu',
    rules: {
      1: { text: 'Bỏ ます, âm **い** cuối → âm **う** cùng hàng (み→む, き→く, り→る…).', ex: ['飲む', '書く', '帰る', '話す', '待つ'] },
      2: { text: 'Bỏ ます + **る**.', ex: ['食べる', '見る', '起きる'] },
      3: { text: 'します → **する** · 来ます → **来る(くる)**.', ex: ['する', '来る', '勉強する'] },
    },
    uses: [
      U('趣味は V辞書形 ことです', 9, '81', '{趣味|しゅみ}は{写真|しゃしん}を{撮|と}ることです。', 'Shumi wa shashin o toru koto desu.', 'Sở thích của tôi là chụp ảnh.'),
      U('V辞書形 ことができます (biết làm)', 9, '82', '{私|わたし}は{車|くるま}を{運転|うんてん}することができます。', 'Watashi wa kuruma o unten suru koto ga dekimasu.', 'Tôi biết lái ô tô.'),
      U('(nơi) で V辞書形 ことができます', 10, '93', 'ここで{写真|しゃしん}を{撮|と}ることができます。', 'Koko de shashin o toru koto ga dekimasu.', 'Ở đây được phép chụp ảnh.'),
      U('V辞書形 とき、___', 11, '101', '{日本|にほん}へ{行|い}くとき、カメラを{買|か}いました。', 'Nihon e iku toki, kamera o kaimashita.', 'Lúc (sắp) đi Nhật, tôi đã mua máy ảnh.'),
      U('V辞書形 前に、___', 12, '106', '{寝|ね}る{前|まえ}に、{歯|は}を{磨|みが}きます。', 'Neru mae ni, ha o migakimasu.', 'Trước khi ngủ tôi đánh răng.'),
      U('V辞書形 と、___ (hễ… thì)', 14, '113', 'このボタンを{押|お}すと、{水|みず}が{出|で}ます。', 'Kono botan o osu to, mizu ga demasu.', 'Hễ bấm nút này là nước chảy ra.'),
    ],
    tip: 'Thể từ điển cũng chính là **thể thường hiện tại khẳng định** (nói với bạn bè: {行|い}く？ = đi không?).',
  },
  {
    id: 'te', name: 'Thể て', bai: 'Bài 7 · trước ポイント 63', key: 'te', from: 'masu',
    rules: {
      1: { text: 'Nhìn âm trước ます: **い・ち・り → って** · **み・び・に → んで** · **き → いて** · **ぎ → いで** · **し → して**. Ngoại lệ: 行きます → **行って**.', ex: ['買う', '待つ', '帰る', '飲む', '遊ぶ', '死ぬ', '書く', '泳ぐ', '話す', '行く'] },
      2: { text: 'Bỏ ます + **て**.', ex: ['食べる', '見る', '起きる'] },
      3: { text: 'します → **して** · 来ます → **来て(きて)**.', ex: ['する', '来る', '勉強する'] },
    },
    uses: [
      U('Vて ください', 7, '63', 'ここに{名前|なまえ}を{書|か}いてください。', 'Koko ni namae o kaite kudasai.', 'Hãy viết tên vào đây.'),
      U('Vて います (đang)', 7, '64', '{今|いま}、{雨|あめ}が{降|ふ}っています。', 'Ima, ame ga futte imasu.', 'Bây giờ trời đang mưa.'),
      U('Vて います (trạng thái, nghề)', 8, '72–73', '{東京|とうきょう}に{住|す}んでいます。', 'Toukyou ni sunde imasu.', 'Tôi đang sống ở Tokyo.'),
      U('Vて、Vて、V (lần lượt)', 9, '83', '{朝|あさ}{起|お}きて、{顔|かお}を{洗|あら}って、{学校|がっこう}へ{行|い}きます。', 'Asa okite, kao o aratte, gakkou e ikimasu.', 'Sáng dậy, rửa mặt, rồi đi học.'),
      U('Vて もいいですか (xin phép)', 10, '89', '{写真|しゃしん}を{撮|と}ってもいいですか。', 'Shashin o totte mo ii desu ka.', 'Tôi chụp ảnh được không?'),
      U('まだ Vて いません (chưa)', 10, '91', 'まだ{昼|ひる}ご{飯|はん}を{食|た}べていません。', 'Mada hirugohan o tabete imasen.', 'Tôi chưa ăn trưa.'),
      U('Vて きます (đi rồi về)', 10, '92', 'ちょっとトイレに{行|い}ってきます。', 'Chotto toire ni itte kimasu.', 'Tôi đi vệ sinh chút rồi quay lại.'),
      U('Vて から、___ (xong rồi mới)', 12, '107', '{手|て}を{洗|あら}ってから、{食|た}べます。', 'Te o aratte kara, tabemasu.', 'Rửa tay xong rồi mới ăn.'),
      U('Vて は いけません (cấm)', 14, '114', 'ここでたばこを{吸|す}ってはいけません。', 'Koko de tabako o sutte wa ikemasen.', 'Không được hút thuốc ở đây.'),
      U('Vて も、___ (dù… vẫn)', 15, '121', '{雨|あめ}が{降|ふ}っても、{行|い}きます。', 'Ame ga futte mo, ikimasu.', 'Dù mưa tôi vẫn đi.'),
    ],
    tip: 'Câu thần chú nhóm I: **"い・ち・り って — み・び・に んで — き いて — ぎ いで — し して"**, và nhớ riêng {行|い}って.',
  },
  {
    id: 'nai', name: 'Thể ない (phủ định thường)', bai: 'Bài 10 · trước ポイント 88', key: 'nai', from: 'masu',
    rules: {
      1: { text: 'Âm **い** trước ます → âm **あ** cùng hàng + ない. Đuôi **い** thì thành **わ** (買います → 買わない). Ngoại lệ: あります → **ない**.', ex: ['買う', '飲む', '書く', '帰る', '待つ', 'ある'] },
      2: { text: 'Bỏ ます + **ない**.', ex: ['食べる', '見る', '起きる'] },
      3: { text: 'します → **しない** · 来ます → **来ない(こない)**.', ex: ['する', '来る', '勉強する'] },
    },
    uses: [
      U('Vない でください (xin đừng)', 10, '88', 'ここに{車|くるま}を{止|と}めないでください。', 'Koko ni kuruma o tomenaide kudasai.', 'Xin đừng đỗ xe ở đây.'),
      U('Vない ほうがいいです (không nên)', 12, '105', '{今日|きょう}はお{風呂|ふろ}に{入|はい}らないほうがいいです。', 'Kyou wa ofuro ni hairanai hou ga ii desu.', 'Hôm nay bạn không nên tắm bồn.'),
      U('Vない → なければなりません (phải)', 14, '115', '{毎日|まいにち}{薬|くすり}を{飲|の}まなければなりません。', 'Mainichi kusuri o nomanakereba narimasen.', 'Phải uống thuốc mỗi ngày.'),
      U('Vない → なくてもいいです (không cần)', 14, '116', '{明日|あした}は{来|こ}なくてもいいです。', 'Ashita wa konakute mo ii desu.', 'Mai bạn không cần đến cũng được.'),
      U('Vない とき、___', 11, '101', '{時間|じかん}がないとき、パンを{食|た}べます。', 'Jikan ga nai toki, pan o tabemasu.', 'Lúc không có thời gian tôi ăn bánh mì.'),
    ],
    tip: 'Quá khứ phủ định (thể thường): bỏ い của ない + **かった** → 飲まなかった, 来なかった.',
  },
  {
    id: 'ta', name: 'Thể た (quá khứ thường)', bai: 'Bài 11 · trước ポイント 98', key: 'ta', from: 'masu',
    rules: {
      1: { text: 'Y hệt thể て, chỉ đổi **て → た**, **で → だ** (飲んで → 飲んだ, 行って → 行った).', ex: ['買う', '飲む', '書く', '泳ぐ', '話す', '行く'] },
      2: { text: 'Bỏ ます + **た**.', ex: ['食べる', '見る', '起きる'] },
      3: { text: 'します → **した** · 来ます → **来た(きた)**.', ex: ['する', '来る', '勉強する'] },
    },
    uses: [
      U('Vたり Vたり します', 11, '99', '{休|やす}みの{日|ひ}は{本|ほん}を{読|よ}んだり、{映画|えいが}を{見|み}たりします。', 'Yasumi no hi wa hon o yondari, eiga o mitari shimasu.', 'Ngày nghỉ tôi nào đọc sách, nào xem phim.'),
      U('Vた とき、___', 11, '101', '{日本|にほん}へ{行|い}ったとき、{富士山|ふじさん}に{登|のぼ}りました。', 'Nihon e itta toki, Fujisan ni noborimashita.', 'Khi (đã) đến Nhật, tôi leo núi Phú Sĩ.'),
      U('Vた ほうがいいです (nên)', 12, '105', '{早|はや}く{寝|ね}たほうがいいです。', 'Hayaku neta hou ga ii desu.', 'Bạn nên ngủ sớm.'),
      U('Vた ことがあります (đã từng)', 13, '108', '{納豆|なっとう}を{食|た}べたことがあります。', 'Nattou o tabeta koto ga arimasu.', 'Tôi đã từng ăn natto.'),
      U('Vたら、___ (nếu… thì)', 15, '120', '{雨|あめ}が{降|ふ}ったら、{家|いえ}で{映画|えいが}を{見|み}ます。', 'Ame ga futtara, ie de eiga o mimasu.', 'Nếu mưa thì tôi xem phim ở nhà.'),
    ],
  },
];

/** Thể thường (普通形) — Bài 11 ポイント 103, bảng 表 p.284. */
const FUTSUU_USES: Use[] = [
  U('友達言葉 — nói với bạn bè', 11, '103', 'A：{明日|あした}、{行|い}く？　B：うん、{行|い}く。', 'Ashita, iku? — Un, iku.', 'Mai đi không? — Ừ, đi.'),
  U('普通形 ＋ んです (giải thích)', 12, '104', '{頭|あたま}が{痛|いた}いんです。', 'Atama ga itai n desu.', 'Chả là tôi đau đầu.'),
  U('普通形 ＋ N (câu bổ nghĩa danh từ)', 13, '109', 'これは{私|わたし}が{作|つく}ったケーキです。', 'Kore wa watashi ga tsukutta keeki desu.', 'Đây là cái bánh tôi đã làm.'),
  U('普通形 ＋ と思います', 14, '117 · 123', '{明日|あした}は{雨|あめ}が{降|ふ}ると{思|おも}います。', 'Ashita wa ame ga furu to omoimasu.', 'Tôi nghĩ mai trời mưa.'),
  U('普通形 ＋ そうです (nghe nói)', 15, '119', '{天気予報|てんきよほう}では、{明日|あした}は{寒|さむ}いそうです。', 'Tenki yohou de wa, ashita wa samui sou desu.', 'Dự báo thời tiết nói mai trời lạnh.'),
];

const ADJ_USES: Use[] = [
  U('N は イA です／イA くないです', 4, '24', 'このかばんは{高|たか}くないです。', 'Kono kaban wa takakunai desu.', 'Cái cặp này không đắt.'),
  U('イA ＋ N ／ ナA な ＋ N', 4, '25', 'ハノイはにぎやかな{町|まち}です。', 'Hanoi wa nigiyaka na machi desu.', 'Hà Nội là thành phố nhộn nhịp.'),
  U('Quá khứ: かったです／でした', 5, '38', '{旅行|りょこう}は{楽|たの}しかったです。', 'Ryokou wa tanoshikatta desu.', 'Chuyến du lịch rất vui.'),
  U('イA くて、～ ／ ナA・N で、～', 8, '75', '{姉|あね}は{優|やさ}しくて、きれいです。', 'Ane wa yasashikute, kirei desu.', 'Chị tôi hiền và đẹp.'),
  U('イA くなります ／ ナA・N になります', 10, '95', '{寒|さむ}くなりました。', 'Samuku narimashita.', 'Trời đã trở lạnh.'),
  U('～たら ／ ～ても (tính từ)', 15, '120 · 121', '{高|たか}くても、{買|か}いたいです。', 'Takakute mo, kaitai desu.', 'Dù đắt tôi vẫn muốn mua.'),
];

/* ── Các phần trang ────────────────────────────────────────────────────── */

function Groups() {
  const ex = (ds: string[], key: FormKey = 'masu') => ds.map((d) => { const v = byD(d); return <span key={d} className={c.jp}><Inline text={conjugate(v.d, v.nhom)[key]} /></span>; });
  return (
    <div className={c.groups}>
      <div className={`${c.group} ${c.g1}`}>
        <div className={c.groupName}>Nhóm I <small>五段 — nhiều nhất</small></div>
        <div className={c.groupRule}>Trước ます là âm hàng <b>い</b>: い き ぎ し ち に び み り.</div>
        <div className={c.groupEx}>{ex(['会う', '書く', '泳ぐ', '話す', '待つ', '遊ぶ', '飲む', '帰る'])}</div>
        <div className={c.groupWarn}>⚠ Thể từ điển đuôi <b>る</b> mà vẫn nhóm I (trông như nhóm II): <span className={c.jp}>帰る・入る・走る・知る・切る</span> — học thuộc.</div>
      </div>
      <div className={`${c.group} ${c.g2}`}>
        <div className={c.groupName}>Nhóm II <small>一段</small></div>
        <div className={c.groupRule}>Trước ます là âm hàng <b>え</b> (食べ・寝・教え…), <b>cộng</b> một số từ hàng い phải thuộc lòng.</div>
        <div className={c.groupEx}>{ex(['食べる', '寝る', '教える', '開ける'])}</div>
        <div className={c.groupWarn}>⚠ Hàng い nhưng là nhóm II: <span className={c.jp}>見ます・起きます・借ります・います・できます・浴びます・降ります・着ます</span>.</div>
      </div>
      <div className={`${c.group} ${c.g3}`}>
        <div className={c.groupName}>Nhóm III <small>bất quy tắc — chỉ 2 từ</small></div>
        <div className={c.groupRule}><b>します</b> và <b>来ます(きます)</b> — và mọi <b>danh từ + します</b>.</div>
        <div className={c.groupEx}>{ex(['する', '来る', '勉強する', '結婚する'])}</div>
        <div className={c.groupWarn}>⚠ 来ます đổi cả cách đọc: <span className={c.jp}>くる・きます・こない・きて</span>.</div>
      </div>
    </div>
  );
}

function UseList({ uses }: { uses: Use[] }) {
  return (
    <div className={c.uses}>
      <div className={c.usesTitle}>Dùng khi nào — các mẫu trong sách</div>
      {uses.map((u) => (
        <div key={u.pat} className={c.use}>
          <div>
            <div className={`${c.usePat} ${c.jp}`}><Inline text={u.pat} /></div>
            <div className={c.useMeta}>Bài {u.bai} · ポイント {u.p}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Speak text={u.ex} />
            <div style={{ minWidth: 0 }}>
              <div className={`${c.useEx} ${c.jp}`}><Inline text={u.ex} /></div>
              <div className={s.ro}>{u.ro}</div>
              <div className={c.useVi}>{u.vi}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FormBox({ f }: { f: FormDef }) {
  return (
    <section className={c.form} id={`chia-${f.id}`}>
      <div className={c.formHead}>
        <span className={c.formName}>{f.name}</span>
        <span className={c.formWhen}>{f.bai}</span>
      </div>
      <div className={c.rules}>
        {([1, 2, 3] as Nhom[]).map((g) => (
          <div key={g} className={`${c.rule} ${G[g]}`}>
            <div className={c.ruleTitle}>{GN[g]}</div>
            <div className={c.ruleText}><Inline text={f.rules[g].text} /></div>
            <div className={c.pairs}>
              {f.rules[g].ex.map((d) => {
                const v = byD(d);
                const all = conjugate(v.d, v.nhom);
                const base = all[f.from];
                return (
                  <div key={d} className={c.pair}>
                    <span className={c.jp}><Inline text={base} /></span>
                    <span className={c.arrow}>→</span>
                    <Tail form={all[f.key]} base={base} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <UseList uses={f.uses} />
      {f.tip && <p className={c.tip}>💡 <Inline text={f.tip} /></p>}
    </section>
  );
}

const FF_ROWS: [string, FormKey | null, AdjKey][] = [
  ['Hiện tại khẳng định', 'jisho', 'ffHien'],
  ['Hiện tại phủ định', 'nai', 'ffPhu'],
  ['Quá khứ khẳng định', 'ta', 'ffQua'],
  ['Quá khứ phủ định', 'nakatta', 'ffQuaPhu'],
];

function Futsuu() {
  const v = byD('飲む');
  const vf = conjugate(v.d, v.nhom);
  const iA = conjugateAdj('{高|たか}い', 'i');
  const naA = conjugateAdj('{静|しず}か', 'na');
  const n = { ffHien: '{学生|がくせい}だ', ffPhu: '{学生|がくせい}じゃない', ffQua: '{学生|がくせい}だった', ffQuaPhu: '{学生|がくせい}じゃなかった' } as Record<string, string>;
  const cols: [string, string, (k: [string, FormKey | null, AdjKey]) => React.ReactNode][] = [
    ['Động từ', c.g1, ([, fk]) => <Tail form={vf[fk!]} base="{飲|の}" />],
    ['Tính từ い', c.gi, ([, , ak]) => <Tail form={iA[ak]} base="{高|たか}" />],
    ['Tính từ な / Danh từ', c.gna, ([, , ak]) => <><Tail form={naA[ak]} base="{静|しず}か" /> · <Tail form={n[ak]} base="{学生|がくせい}" /></>],
  ];
  return (
    <section className={c.form} id="chia-futsuu">
      <div className={c.formHead}>
        <span className={c.formName}>Thể thường (普通形) — bảng 4 ô</span>
        <span className={c.formWhen}>Bài 11 · ポイント 103 (表 p.284) · dùng tới hết Bài 15</span>
      </div>
      <div className={c.adjGrid}>
        {cols.map(([name, cls, cell]) => (
          <div key={name} className={`${c.adjCol} ${cls}`}>
            <div className={c.ruleTitle}>{name}</div>
            {FF_ROWS.map((r) => (
              <div key={r[0]} className={c.adjRow}><span className={c.adjLbl}>{r[0]}</span><span className={c.jp}>{cell(r)}</span></div>
            ))}
          </div>
        ))}
      </div>
      <UseList uses={FUTSUU_USES} />
      <p className={c.tip}>💡 Lịch sự ↔ thường: <b>飲みます = 飲む</b> · <b>飲みません = 飲まない</b> · <b>飲みました = 飲んだ</b> · <b>飲みませんでした = 飲まなかった</b>. Tính từ な/danh từ: <b>です → だ</b> — nhưng trước と思います/そうです vẫn giữ だ, còn trước N thì な/の (静かな町, 学生の時).</p>
    </section>
  );
}

const ADJ_ROWS: [string, AdjKey][] = [
  ['Hiện tại', 'hien'], ['Phủ định', 'phu'], ['Quá khứ', 'qua'], ['Quá khứ phủ định', 'quaPhu'],
  ['Bổ nghĩa N', 'bn'], ['Nối câu (て)', 'te'], ['Trở nên', 'naru'], ['Nếu… thì', 'tara'], ['Dù… cũng', 'temo'],
];

function Adjs() {
  const cols: [string, string, string, 'i' | 'na', string][] = [
    ['Tính từ い — 高い', c.gi, '{高|たか}い', 'i', '{高|たか}'],
    ['Ngoại lệ いい (tốt)', c.gi, 'いい', 'i', ''],
    ['Tính từ な — 静か', c.gna, '{静|しず}か', 'na', '{静|しず}か'],
  ];
  return (
    <section className={c.form} id="chia-tinh-tu">
      <div className={c.formHead}>
        <span className={c.formName}>Tính từ い / な</span>
        <span className={c.formWhen}>Bài 4 · ポイント 24–25 · Bài 5 · 38 · Bài 8 · 75 · Bài 10 · 95 · Bài 15</span>
      </div>
      <div className={c.adjGrid}>
        {cols.map(([name, cls, d, loai, base]) => {
          const f = conjugateAdj(d, loai);
          return (
            <div key={name} className={`${c.adjCol} ${cls}`}>
              <div className={c.ruleTitle}>{name}</div>
              {ADJ_ROWS.map(([lbl, k]) => (
                <div key={k} className={c.adjRow}><span className={c.adjLbl}>{lbl}</span><Tail form={f[k]} base={base} /></div>
              ))}
            </div>
          );
        })}
      </div>
      <UseList uses={ADJ_USES} />
      <p className={c.tip}>💡 <b>きれい</b>, <b>有名</b>, <b>嫌い</b> tận cùng bằng い nhưng là tính từ <b>な</b>: きれい<b>じゃありません</b> (không phải ~~きれくない~~). Danh từ chia y như tính từ な: 学生です・学生じゃありません・学生でした.</p>
    </section>
  );
}

/* ── Ô tra nhanh ───────────────────────────────────────────────────────── */

const LOOK_ROWS: { sec: string; rows: [string, FormKey, string][] }[] = [
  { sec: 'Lịch sự (ます)', rows: [
    ['Hiện tại', 'masu', 'B3'], ['Phủ định', 'masen', 'B3'], ['Quá khứ', 'mashita', 'B5'], ['Quá khứ phủ định', 'masendeshita', 'B5'],
    ['Rủ: …nhé', 'mashou', 'B6'], ['Muốn …', 'tai', 'B5'], ['Cách …', 'kata', 'B7'],
  ] },
  { sec: 'Thể thường (普通形)', rows: [
    ['Từ điển (hiện tại)', 'jisho', 'B9'], ['ない (phủ định)', 'nai', 'B10'], ['た (quá khứ)', 'ta', 'B11'], ['なかった (quá khứ phủ định)', 'nakatta', 'B11'],
  ] },
  { sec: 'Thể nối và mẫu hay dùng', rows: [
    ['て', 'te', 'B7'], ['ないで (xin đừng…)', 'naide', 'B10'], ['たら (nếu…)', 'tara', 'B15'], ['ても (dù…)', 'temo', 'B15'],
  ] },
];

const SUGG = ['行きます', '食べます', '来ます', '帰ります', '勉強します', 'あります', '書く', 'nomimasu', 'きます', '高い', 'きれい'];

function VerbResult({ verb, note, known }: { verb: Verb; note?: string; known: boolean }) {
  const f = conjugate(verb.d, verb.nhom);
  const base = verb.d;
  return (
    <div className={`${c.result} ${G[verb.nhom]}`}>
      <div className={c.resHead}>
        <span className={`${c.resWord} ${c.jp}`}><Inline text={f.masu} /></span>
        <span className={c.jp} style={{ fontSize: 18 }}>（<Inline text={verb.d} />）</span>
        <span className={c.badge}>{GN[verb.nhom]}</span>
        {verb.vi && <span>{verb.vi}</span>}
        {known && verb.bai > 0 && <span className={c.useMeta}>Bài {verb.bai}</span>}
      </div>
      {note && <div className={c.resNote}>{note}</div>}
      {LOOK_ROWS.map((g) => (
        <div key={g.sec}>
          <div className={c.resSec}>{g.sec}</div>
          {g.rows.map(([lbl, k, b]) => (
            <div key={k} className={c.resRow}>
              <span className={c.resLbl}>{lbl} <span className={c.resUse}>· {b}</span></span>
              <span className={c.resForm}>
                <Tail form={f[k]} base={base} />
                <div className={c.resRo}>{toRomaji(f[k])}</div>
              </span>
              <Speak text={f[k]} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function AdjResult({ a }: { a: Adj }) {
  const f = conjugateAdj(a.d, a.loai);
  const base = a.loai === 'i' ? (reading(a.d) === 'いい' ? '' : a.d.slice(0, -1)) : a.d;
  return (
    <div className={`${c.result} ${a.loai === 'i' ? c.gi : c.gna}`}>
      <div className={c.resHead}>
        <span className={`${c.resWord} ${c.jp}`}><Inline text={a.d} /></span>
        <span className={c.badge}>Tính từ {a.loai === 'i' ? 'い' : 'な'}</span>
        <span>{a.vi}</span>
        <span className={c.useMeta}>Bài {a.bai}</span>
      </div>
      <div className={c.resSec}>Các dạng</div>
      {ADJ_ROWS.concat([['Thường: hiện tại', 'ffHien'], ['Thường: phủ định', 'ffPhu'], ['Thường: quá khứ', 'ffQua'], ['Thường: quá khứ phủ định', 'ffQuaPhu']]).map(([lbl, k]) => (
        <div key={k} className={c.resRow}>
          <span className={c.resLbl}>{lbl}</span>
          <span className={c.resForm}><Tail form={f[k]} base={base} /><div className={c.resRo}>{toRomaji(f[k].replace(/ N$/, ''))}</div></span>
          <Speak text={f[k].replace(/ N$/, '')} />
        </div>
      ))}
    </div>
  );
}

function findAdj(input: string): Adj[] {
  let t = input.normalize('NFKC').trim().replace(/(です|な|だ)$/, '');
  if (/^[a-z\s']+$/i.test(t)) t = romajiToKana(t);
  return ADJS.filter((a) => bare(a.d) === t || reading(a.d) === t);
}

function Lookup() {
  const [q, setQ] = useState('');
  const verbs = useMemo(() => findVerbs(q), [q]);
  const adjs = useMemo(() => (q.trim() ? findAdj(q) : []), [q]);
  return (
    <section className={c.lookup} id="chia-tra">
      <div className={c.formName}><Search size={18} className="inline" style={{ marginTop: -3 }} /> Tra nhanh — gõ một động từ hoặc tính từ</div>
      <div className={c.formWhen} style={{ marginTop: 4 }}>Kana, chữ Hán hay romaji đều được; thể ます hay thể từ điển đều được (飲みます · のむ · nomimasu · 高い).</div>
      <div className={c.lookupRow}>
        <input className={c.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="vd. 行きます / たべる / kaerimasu" autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="Động từ hoặc tính từ cần chia" />
        {q && <button type="button" className={s.btnGhost} onClick={() => setQ('')} aria-label="Xoá"><X size={16} /></button>}
      </div>
      <div className={c.sugg}>{SUGG.map((x) => <button key={x} type="button" onClick={() => setQ(x)} className={c.jp}>{x}</button>)}</div>
      {q.trim() && !verbs.length && !adjs.length && (
        <div className={c.empty}>Chưa nhận ra từ này. Thử gõ thể ます (…ます) hoặc thể từ điển (đuôi う・く・す・つ・ぬ・む・ぶ・る), hoặc tính từ (…い / tính từ な).</div>
      )}
      {verbs.length > 1 && <div className={c.empty}>Có {verbs.length} động từ đọc giống nhau — nhìn chữ Hán để phân biệt:</div>}
      {verbs.map((f) => <VerbResult key={f.verb.d + f.verb.nhom} {...f} />)}
      {adjs.map((a) => <AdjResult key={a.d} a={a} />)}
    </section>
  );
}

/* ── Bài tập chia ──────────────────────────────────────────────────────── */

const DRILL: [FormKey, string][] = [['jisho', 'thể từ điển'], ['te', 'thể て'], ['nai', 'thể ない'], ['ta', 'thể た'], ['nakatta', 'thể なかった'], ['masendeshita', 'ませんでした']];

function why(v: Verb, k: FormKey): string {
  const f = conjugate(v.d, v.nhom);
  const masu = bare(f.masu);
  const i = masu.slice(-3, -2);
  if (v.nhom === 3) return `${GN[3]} — bất quy tắc, học thuộc: ${bare(f.masu)} → ${bare(f[k])}.`;
  if (v.nhom === 2) return `${GN[2]} — bỏ ます rồi thêm đuôi: ${masu} → ${bare(f[k])}.`;
  if (k === 'te' || k === 'ta') {
    if (bare(v.d).endsWith('行く')) return 'Nhóm I — NGOẠI LỆ: 行きます → 行って／行った.';
    return `Nhóm I — trước ます là 「${i}」: ${'いちり'.includes(i) ? 'い・ち・り → って' : 'みびに'.includes(i) ? 'み・び・に → んで' : i === 'き' ? 'き → いて' : i === 'ぎ' ? 'ぎ → いで' : 'し → して'}${k === 'ta' ? ' (て→た, で→だ)' : ''}.`;
  }
  if (k === 'nai' || k === 'nakatta') return bare(v.d) === 'ある' ? 'NGOẠI LỆ: あります → ない／なかった.' : `Nhóm I — 「${i}」 đổi sang hàng あ${i === 'い' ? ' (い → わ)' : ''} + ない.`;
  if (k === 'jisho') return `Nhóm I — 「${i}」 đổi sang hàng う.`;
  return `${GN[v.nhom]}.`;
}

function Drill() {
  const tutor = useTutor();
  const [forms, setForms] = useState<FormKey[]>(['jisho', 'te', 'nai', 'ta']);
  const [upto, setUpto] = useState(15);
  const pool = useMemo(() => VERBS.filter((v) => v.bai <= upto), [upto]);
  const pick = () => ({ v: pool[Math.floor(Math.random() * pool.length)], k: forms[Math.floor(Math.random() * forms.length)] ?? 'te' });
  const [q, setQ] = useState<{ v: Verb; k: FormKey } | null>(null);
  const [ans, setAns] = useState('');
  const [res, setRes] = useState<boolean | null>(null);
  const [score, setScore] = useState({ ok: 0, all: 0 });

  const next = () => { setQ(pick()); setAns(''); setRes(null); };
  const check = () => {
    if (!q || !ans.trim()) return;
    const right = conjugate(q.v.d, q.v.nhom)[q.k];
    let a = ans.normalize('NFKC').trim().replace(/[。\s]/g, '');
    if (/^[a-z']+$/i.test(a)) a = romajiToKana(a);
    const ok = a === bare(right) || a === reading(right);
    setRes(ok);
    const sc = { ok: score.ok + (ok ? 1 : 0), all: score.all + 1 };
    setScore(sc);
    if (sc.all % 10 === 0) tutor.report('chia-dong-tu-luyen', Math.round((sc.ok / sc.all) * 100));
  };
  const label = (k: FormKey) => DRILL.find((d) => d[0] === k)?.[1] ?? k;

  return (
    <section className={c.drill} id="chia-luyen">
      <div className={c.formName}>✍️ Luyện chia — chấm ngay</div>
      <div className={c.formWhen} style={{ marginTop: 4 }}>Chọn thể cần luyện và phạm vi bài. Gõ kana, chữ Hán hay romaji đều được; Enter để chấm.</div>
      <div className={c.chips}>
        {DRILL.map(([k, name]) => (
          <button key={k} type="button" className={`${c.chip} ${forms.includes(k) ? c.chipOn : ''}`} aria-pressed={forms.includes(k)}
            onClick={() => setForms(forms.includes(k) ? (forms.length > 1 ? forms.filter((x) => x !== k) : forms) : [...forms, k])}>{name}</button>
        ))}
      </div>
      <div className={c.chips}>
        {[5, 7, 9, 11, 15].map((n) => (
          <button key={n} type="button" className={`${c.chip} ${upto === n ? c.chipOn : ''}`} aria-pressed={upto === n} onClick={() => setUpto(n)}>Động từ đến Bài {n}</button>
        ))}
      </div>
      {!q ? (
        <button type="button" className={s.btn} onClick={next}><Shuffle size={15} /> Bắt đầu</button>
      ) : (
        <div className={`${c.q} ${G[q.v.nhom]}`}>
          <div className={`${c.qWord} ${c.jp}`}><Inline text={conjugate(q.v.d, q.v.nhom).masu} /> <span style={{ fontSize: 15, fontWeight: 500 }}>({q.v.vi})</span></div>
          <div className={c.qAsk}>Đổi sang <b>{label(q.k)}</b>:</div>
          <div className={c.lookupRow}>
            <input className={c.input} value={ans} autoFocus onChange={(e) => { setAns(e.target.value); setRes(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { if (res === null) check(); else next(); } }}
              placeholder="Câu trả lời…" autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="Câu trả lời" />
            {res === null
              ? <button type="button" className={s.btn} onClick={check}><Check size={15} /> Chấm</button>
              : <button type="button" className={s.btn} onClick={next}>Câu tiếp</button>}
          </div>
          {res !== null && (
            <div className={c.fb}>
              {res ? <span className={c.good}>✓ Đúng!</span> : <span className={c.bad}>✗ Chưa đúng.</span>}{' '}
              Đáp án: <span className={c.jp} style={{ fontSize: 18 }}><Tail form={conjugate(q.v.d, q.v.nhom)[q.k]} base={q.v.d} /></span>{' '}
              <span className={s.ro} style={{ display: 'inline' }}>{toRomaji(conjugate(q.v.d, q.v.nhom)[q.k])}</span>
              <div>{why(q.v, q.k)}</div>
            </div>
          )}
          <div className={c.fb}>
            <span className={c.score}>Đúng {score.ok}/{score.all}</span>{' '}
            {score.all > 0 && <button type="button" className={s.linkBtn} onClick={() => setScore({ ok: 0, all: 0 })}><RotateCcw size={12} className="inline" /> đếm lại</button>}
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Cả trang ──────────────────────────────────────────────────────────── */

export default function ChiaDongTu() {
  return (
    <div>
      <p className={s.p}>
        Tổng hợp <b>mọi thể động từ và tính từ trong sách (Bài 3 → Bài 15)</b> ở một chỗ: cách nhận biết nhóm, quy tắc đổi đuôi (phần đổi được <b>tô màu</b>), và <b>dùng thể đó trong mẫu câu nào, ở bài mấy</b>. Cuối trang có ô tra nhanh và bài luyện chia chấm ngay.
      </p>
      <nav className={c.jump} aria-label="Mục trong trang">
        <a href="#chia-nhom">Nhận biết nhóm</a>
        {FORMS.map((f) => <a key={f.id} href={`#chia-${f.id}`}>{f.name.replace(/ \(.*\)/, '')}</a>)}
        <a href="#chia-futsuu">Thể thường</a>
        <a href="#chia-tinh-tu">Tính từ</a>
        <a href="#chia-tra">🔎 Tra nhanh</a>
        <a href="#chia-luyen">✍️ Luyện</a>
      </nav>
      <Lookup />
      <h2 className={s.h2} id="chia-nhom"><span className={s.pill}>Bước 1 — Nhận biết nhóm động từ</span></h2>
      <p className={s.p}>Nhìn <b>âm ngay trước ます</b>. Học thuộc nhóm III (2 từ) và các từ ngoại lệ trong khung ⚠ — còn lại suy ra được.</p>
      <Groups />
      <h2 className={s.h2}><span className={s.pill}>Bước 2 — Các thể và khi nào dùng</span></h2>
      {FORMS.map((f) => <FormBox key={f.id} f={f} />)}
      <Futsuu />
      <h2 className={s.h2}><span className={s.pill}>Tính từ và danh từ</span></h2>
      <Adjs />
      <h2 className={s.h2}><span className={s.pill}>Luyện tập</span></h2>
      <Drill />
    </div>
  );
}
