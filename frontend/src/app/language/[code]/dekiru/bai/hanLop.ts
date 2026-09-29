/**
 * Bài "Chữ Hán của lớp" (`bN-han-lop`, kind `kanji`) cho từng bài — đặt ngay SAU
 * bài `bN-kanji` sẵn có (bài cũ giữ nguyên để học thêm).
 *
 * Danh sách chữ mỗi bài:
 *  - `nguon: 'slide'`   = khớp ĐÚNG slide của cô (hiện có Bài 5: 先 週 毎 午 後 見 食 飲 買 物 行 休);
 *  - `nguon: 'du-kien'` = dự kiến — chọn chữ Hán N5/N4 phổ biến trong từ vựng/ngữ pháp
 *    của bài, không trùng bài khác; sẽ sửa cho khớp slide khi người học gửi ảnh.
 * Chi tiết từng chữ (Hán Việt, On/Kun, cách nhớ, từ đi chung) ở hanTu.ts — tải chậm.
 *
 * Bộ nạp (index.ts) và script mục lục (scripts/course-manifest.mts) cùng gọi
 * `chenHanLop` — một luật chèn duy nhất. Tệp chỉ được có `import type`.
 */
import type { Block, Lesson } from '@/components/sach-hoc/types';
import type { HanLopBai } from '@/components/sach-hoc/kanji';

type Doc = { text: string; ro: string; vi: string };
type VocabItem = Extract<Block, { t: 'vocab' }>['items'][number];

export type HanLopSoan = HanLopBai & {
  /** Chủ đề ngắn của nhóm chữ (hiện ở tiêu đề bài). */
  chuDe: string;
  /** ≥ 10 câu đọc KHÔNG furigana, chỉ dùng chữ của bài này + bài trước. */
  doc: Doc[];
  /** Từ cô chép trên bảng mà danh sách từ mới chưa có — bổ sung (mục D). */
  them?: { ghi: string; items: VocabItem[] };
};

export const HAN_LOP: Record<number, HanLopSoan> = {
  1: {
    chars: '日本人名前国学生語何私会',
    nguon: 'du-kien',
    chuDe: 'giới thiệu bản thân: tên, nước, người, trường học, công ty',
    doc: [
      { text: '{私|わたし}の{名前|なまえ}はマルコです。', ro: 'Watashi no namae wa Maruko desu.', vi: 'Tên tôi là Marco.' },
      { text: '{私|わたし}はイタリア{人|じん}です。', ro: 'Watashi wa Itaria-jin desu.', vi: 'Tôi là người Ý.' },
      { text: 'お{国|くに}はどちらですか。', ro: 'O-kuni wa dochira desu ka.', vi: 'Bạn đến từ nước nào?' },
      { text: 'ワンさんは{中国人|ちゅうごくじん}です。', ro: 'Wan-san wa Chuugoku-jin desu.', vi: 'Chị Vương là người Trung Quốc.' },
      { text: '{私|わたし}は{日本語|にほんご}の{学生|がくせい}です。', ro: 'Watashi wa nihongo no gakusei desu.', vi: 'Tôi là sinh viên học tiếng Nhật.' },
      { text: 'アンナさんも{学生|がくせい}です。', ro: 'Anna-san mo gakusei desu.', vi: 'Anna cũng là sinh viên.' },
      { text: 'お{名前|なまえ}は{何|なん}ですか。', ro: 'O-namae wa nan desu ka.', vi: 'Tên bạn là gì?' },
      { text: 'ダニエルさんは{会社員|かいしゃいん}ですか。', ro: 'Danieru-san wa kaishain desu ka.', vi: 'Anh Daniel là nhân viên công ty à?' },
      { text: 'いいえ、{会社員|かいしゃいん}じゃありません。{学生|がくせい}です。', ro: 'Iie, kaishain ja arimasen. Gakusei desu.', vi: 'Không, tôi không phải nhân viên công ty. Tôi là sinh viên.' },
      { text: '{日本|にほん}の{会社|かいしゃ}の{人|ひと}です。', ro: 'Nihon no kaisha no hito desu.', vi: 'Đó là người của một công ty Nhật.' },
      { text: '{私|わたし}の{国|くに}はベトナムです。', ro: 'Watashi no kuni wa Betonamu desu.', vi: 'Nước tôi là Việt Nam.' },
      { text: '{誕生日|たんじょうび}はいつですか。', ro: 'Tanjoubi wa itsu desu ka.', vi: 'Sinh nhật bạn là khi nào?' },
    ],
  },
  2: {
    chars: '一二三四五六七八九十百千万円',
    nguon: 'du-kien',
    chuDe: 'con số, đếm đồ vật và giá tiền khi mua sắm',
    doc: [
      { text: 'このりんごは{一|ひと}つ{百円|ひゃくえん}です。', ro: 'Kono ringo wa hitotsu hyaku-en desu.', vi: 'Táo này 100 yên một quả.' },
      { text: 'コーヒーを{二|ふた}つください。', ro: 'Koohii o futatsu kudasai.', vi: 'Cho tôi hai cà phê.' },
      { text: 'これは{三千円|さんぜんえん}です。', ro: 'Kore wa sanzen-en desu.', vi: 'Cái này 3.000 yên.' },
      { text: 'あのかばんは{一万円|いちまんえん}です。', ro: 'Ano kaban wa ichiman-en desu.', vi: 'Cái túi kia 10.000 yên.' },
      { text: 'ケーキは{八百円|はっぴゃくえん}です。', ro: 'Keeki wa happyaku-en desu.', vi: 'Bánh ngọt 800 yên.' },
      { text: 'すみません、それはいくらですか。', ro: 'Sumimasen, sore wa ikura desu ka.', vi: 'Xin lỗi, cái đó bao nhiêu tiền?' },
      { text: '{四千五百円|よんせんごひゃくえん}です。', ro: 'Yonsen gohyaku-en desu.', vi: '4.500 yên.' },
      { text: 'この{本|ほん}は{七百円|ななひゃくえん}です。', ro: 'Kono hon wa nanahyaku-en desu.', vi: 'Quyển sách này 700 yên.' },
      { text: 'ジュースを{一|ひと}つとパンを{三|みっ}つください。', ro: 'Juusu o hitotsu to pan o mittsu kudasai.', vi: 'Cho tôi một nước ép và ba cái bánh mì.' },
      { text: 'その{時計|とけい}は{二万六千円|にまんろくせんえん}です。', ro: 'Sono tokei wa niman rokusen-en desu.', vi: 'Cái đồng hồ đó 26.000 yên.' },
      { text: '100{円|えん}ショップはどこですか。', ro: 'Hyaku-en shoppu wa doko desu ka.', vi: 'Cửa hàng 100 yên ở đâu?' },
      { text: '{全部|ぜんぶ}で{九百六十円|きゅうひゃくろくじゅうえん}です。', ro: 'Zenbu de kyuuhyaku rokujuu-en desu.', vi: 'Tất cả là 960 yên.' },
    ],
  },
  3: {
    chars: '時分半今月火水木金土曜朝',
    nguon: 'du-kien',
    chuDe: 'giờ giấc, buổi sáng và bảy ngày trong tuần',
    doc: [
      { text: '{今|いま}、{何時|なんじ}ですか。', ro: 'Ima, nanji desu ka.', vi: 'Bây giờ là mấy giờ?' },
      { text: '{九時|くじ}{十分|じゅっぷん}です。', ro: 'Kuji juppun desu.', vi: 'Chín giờ mười phút.' },
      { text: '{毎朝|まいあさ}{七時半|しちじはん}に{起|お}きます。', ro: 'Maiasa shichiji han ni okimasu.', vi: 'Sáng nào tôi cũng dậy lúc 7 giờ rưỡi.' },
      { text: '{月曜日|げつようび}から{金曜日|きんようび}まで{学校|がっこう}へ{行|い}きます。', ro: 'Getsuyoubi kara kin\'youbi made gakkou e ikimasu.', vi: 'Từ thứ Hai đến thứ Sáu tôi đi học.' },
      { text: '{土曜日|どようび}と{日曜日|にちようび}は{休|やす}みです。', ro: 'Doyoubi to nichiyoubi wa yasumi desu.', vi: 'Thứ Bảy và Chủ nhật được nghỉ.' },
      { text: '{火曜日|かようび}と{木曜日|もくようび}にアルバイトをします。', ro: 'Kayoubi to mokuyoubi ni arubaito o shimasu.', vi: 'Tôi làm thêm vào thứ Ba và thứ Năm.' },
      { text: '{水曜日|すいようび}の{午後|ごご}、{日本語|にほんご}を{勉強|べんきょう}します。', ro: 'Suiyoubi no gogo, nihongo o benkyou shimasu.', vi: 'Chiều thứ Tư tôi học tiếng Nhật.' },
      { text: '{授業|じゅぎょう}は{八時|はちじ}から{十時半|じゅうじはん}までです。', ro: 'Jugyou wa hachiji kara juuji han made desu.', vi: 'Giờ học từ 8 giờ đến 10 giờ rưỡi.' },
      { text: '{今日|きょう}は{何曜日|なんようび}ですか。', ro: 'Kyou wa nan\'youbi desu ka.', vi: 'Hôm nay là thứ mấy?' },
      { text: '{毎日|まいにち}{二時間|にじかん}{勉強|べんきょう}します。', ro: 'Mainichi nijikan benkyou shimasu.', vi: 'Mỗi ngày tôi học hai tiếng.' },
      { text: '{日曜日|にちようび}の{朝|あさ}、{新聞|しんぶん}を{読|よ}みます。', ro: 'Nichiyoubi no asa, shinbun o yomimasu.', vi: 'Sáng Chủ nhật tôi đọc báo.' },
      { text: '{朝|あさ}ご{飯|はん}は{六時|ろくじ}{四十五分|よんじゅうごふん}です。', ro: 'Asagohan wa rokuji yonjuugo-fun desu.', vi: 'Bữa sáng lúc 6 giờ 45.' },
    ],
  },
  4: {
    chars: '山川町駅東西南北大小高新',
    nguon: 'du-kien',
    chuDe: 'đất nước, thành phố: phương hướng, núi sông, nhà ga, to nhỏ cao mới',
    doc: [
      { text: '{私|わたし}の{町|まち}は{小|ちい}さいです。', ro: 'Watashi no machi wa chiisai desu.', vi: 'Thị trấn của tôi nhỏ.' },
      { text: '{町|まち}の{北|きた}に{山|やま}があります。', ro: 'Machi no kita ni yama ga arimasu.', vi: 'Phía bắc thị trấn có núi.' },
      { text: '{駅|えき}の{東|ひがし}に{大|おお}きい{川|かわ}があります。', ro: 'Eki no higashi ni ookii kawa ga arimasu.', vi: 'Phía đông nhà ga có một con sông lớn.' },
      { text: '{富士山|ふじさん}はとても{高|たか}いです。', ro: 'Fujisan wa totemo takai desu.', vi: 'Núi Phú Sĩ rất cao.' },
      { text: '{新|あたら}しい{駅|えき}はきれいです。', ro: 'Atarashii eki wa kirei desu.', vi: 'Nhà ga mới rất đẹp.' },
      { text: 'ハノイはベトナムの{北|きた}にあります。', ro: 'Hanoi wa Betonamu no kita ni arimasu.', vi: 'Hà Nội ở phía bắc Việt Nam.' },
      { text: 'ホーチミンはベトナムの{南|みなみ}にあります。', ro: 'Hoochimin wa Betonamu no minami ni arimasu.', vi: 'TP. Hồ Chí Minh ở phía nam Việt Nam.' },
      { text: '{西|にし}の{町|まち}は{古|ふる}くて、きれいです。', ro: 'Nishi no machi wa furukute, kirei desu.', vi: 'Thị trấn phía tây cổ kính và đẹp.' },
      { text: '{東京|とうきょう}は{大|おお}きい{町|まち}です。', ro: 'Toukyou wa ookii machi desu.', vi: 'Tokyo là một thành phố lớn.' },
      { text: '{新幹線|しんかんせん}は{高|たか}いです。', ro: 'Shinkansen wa takai desu.', vi: 'Tàu Shinkansen đắt.' },
      { text: 'うちから{駅|えき}まで{二十分|にじゅっぷん}です。', ro: 'Uchi kara eki made nijuppun desu.', vi: 'Từ nhà đến ga mất 20 phút.' },
      { text: 'この{町|まち}は{山|やま}も{川|かわ}もきれいです。', ro: 'Kono machi wa yama mo kawa mo kirei desu.', vi: 'Thị trấn này cả núi lẫn sông đều đẹp.' },
    ],
  },
  5: {
    chars: '先週毎午後見食飲買物行休',
    nguon: 'slide',
    chuDe: 'thời gian (tuần, mỗi, chiều) và việc làm ngày nghỉ (xem, ăn, uống, mua, đi, nghỉ)',
    them: {
      ghi: 'Những từ cô chép trên bảng khi giảng chữ Hán Bài 5 — danh sách "Từ mới bài 5" không có, nên bổ sung ở đây.',
      items: [
        { w: '{後|うし}ろ', pos: 'danh từ (vị trí)', ipa: 'ushiro', vi: 'phía sau', ex: '{後|うし}ろを{見|み}てください。', exRo: 'Ushiro o mite kudasai.', exVi: 'Hãy nhìn ra phía sau.' },
        { w: '{午後|ごご}', pos: 'danh từ (thời gian)', ipa: 'gogo', vi: 'buổi chiều, p.m.', ex: '{午後|ごご}、{友達|ともだち}と{映画|えいが}を{見|み}ました。', exRo: 'Gogo, tomodachi to eiga o mimashita.', exVi: 'Buổi chiều tôi đã xem phim với bạn.' },
        { w: '{見学|けんがく}します', pos: 'động từ nhóm 3', ipa: 'kengaku shimasu', vi: 'tham quan học tập (nhà máy, trường…)', ex: '{先週|せんしゅう}、{工場|こうじょう}を{見学|けんがく}しました。', exRo: 'Senshuu, koujou o kengaku shimashita.', exVi: 'Tuần trước tôi đã đi tham quan nhà máy.' },
        { w: '{飲食|いんしょく}', pos: 'danh từ', ipa: 'inshoku', vi: 'ăn uống (biển 飲食禁止 = cấm ăn uống)', ex: 'ここは{飲食|いんしょく}できません。', exRo: 'Koko wa inshoku dekimasen.', exVi: 'Ở đây không được ăn uống.' },
        { w: '{毎週|まいしゅう}', pos: 'danh từ (thời gian)', ipa: 'maishuu', vi: 'hằng tuần', ex: '{毎週|まいしゅう}{土曜日|どようび}に{買|か}い{物|もの}に{行|い}きます。', exRo: 'Maishuu doyoubi ni kaimono ni ikimasu.', exVi: 'Thứ bảy hằng tuần tôi đi mua sắm.' },
        { w: '{後|あと}で', pos: 'trạng từ', ipa: 'ato de', vi: 'lát nữa, sau đó', ex: '{後|あと}で{食|た}べます。', exRo: 'Ato de tabemasu.', exVi: 'Lát nữa tôi ăn.' },
      ],
    },
    doc: [
      { text: '{先週|せんしゅう}の{週末|しゅうまつ}、{友達|ともだち}と{映画|えいが}を{見|み}ました。', ro: 'Senshuu no shuumatsu, tomodachi to eiga o mimashita.', vi: 'Cuối tuần trước tôi xem phim với bạn.' },
      { text: '{毎朝|まいあさ}、コーヒーを{飲|の}みます。', ro: 'Maiasa, koohii o nomimasu.', vi: 'Sáng nào tôi cũng uống cà phê.' },
      { text: '{午後|ごご}、デパートで{服|ふく}を{買|か}いました。', ro: 'Gogo, depaato de fuku o kaimashita.', vi: 'Buổi chiều tôi đã mua quần áo ở bách hoá.' },
      { text: '{昨日|きのう}は{学校|がっこう}を{休|やす}みました。', ro: 'Kinou wa gakkou o yasumimashita.', vi: 'Hôm qua tôi nghỉ học.' },
      { text: '{休|やす}みの{日|ひ}、{一人|ひとり}で{買|か}い{物|もの}に{行|い}きます。', ro: 'Yasumi no hi, hitori de kaimono ni ikimasu.', vi: 'Ngày nghỉ tôi đi mua sắm một mình.' },
      { text: '{先生|せんせい}の{後|うし}ろにパクさんがいます。', ro: 'Sensei no ushiro ni Paku-san ga imasu.', vi: 'Phía sau cô giáo có chị Park.' },
      { text: '{毎晩|まいばん}、{家族|かぞく}と{食事|しょくじ}をします。', ro: 'Maiban, kazoku to shokuji o shimasu.', vi: 'Tối nào tôi cũng dùng bữa cùng gia đình.' },
      { text: '{飲|の}み{物|もの}は{何|なに}がいいですか。', ro: 'Nomimono wa nani ga ii desu ka.', vi: 'Bạn muốn uống gì?' },
      { text: '{来週|らいしゅう}、{日本|にほん}の{大学|だいがく}を{見学|けんがく}します。', ro: 'Raishuu, Nihon no daigaku o kengaku shimasu.', vi: 'Tuần sau tôi đi tham quan một trường đại học Nhật.' },
      { text: '{後|あと}で{一緒|いっしょ}に{昼|ひる}ご{飯|はん}を{食|た}べましょう。', ro: 'Ato de issho ni hirugohan o tabemashou.', vi: 'Lát nữa cùng ăn trưa nhé.' },
      { text: '{毎週|まいしゅう}{日曜日|にちようび}は{美術館|びじゅつかん}へ{絵|え}を{見|み}に{行|い}きます。', ro: 'Maishuu nichiyoubi wa bijutsukan e e o mi ni ikimasu.', vi: 'Chủ nhật hằng tuần tôi đến bảo tàng mỹ thuật để xem tranh.' },
      { text: 'ここは{飲食|いんしょく}できません。', ro: 'Koko wa inshoku dekimasen.', vi: 'Ở đây không được ăn uống.' },
    ],
  },
  6: {
    chars: '手歌近遠早広全部約束遊野',
    nguon: 'du-kien',
    chuDe: 'rủ nhau đi chơi, hẹn hò (hẹn, chơi, hát, gần/xa, sớm, rộng, tất cả, bóng chày)',
    doc: [
      { text: '{土曜日|どようび}、{一緒|いっしょ}に{遊|あそ}びに{行|い}きませんか。', ro: 'Doyoubi, issho ni asobi ni ikimasen ka.', vi: 'Thứ bảy, đi chơi cùng nhau không?' },
      { text: 'すみません、{土曜日|どようび}は{約束|やくそく}があります。', ro: 'Sumimasen, doyoubi wa yakusoku ga arimasu.', vi: 'Xin lỗi, thứ bảy tôi có hẹn rồi.' },
      { text: '{駅|えき}は{近|ちか}いですか。', ro: 'Eki wa chikai desu ka.', vi: 'Nhà ga có gần không?' },
      { text: 'いいえ、ちょっと{遠|とお}いです。', ro: 'Iie, chotto tooi desu.', vi: 'Không, hơi xa.' },
      { text: '{明日|あした}は{早|はや}いですから、{早|はや}く{寝|ね}ます。', ro: 'Ashita wa hayai desu kara, hayaku nemasu.', vi: 'Ngày mai phải dậy sớm nên tôi ngủ sớm.' },
      { text: 'この{公園|こうえん}は{広|ひろ}いですね。', ro: 'Kono kouen wa hiroi desu ne.', vi: 'Công viên này rộng nhỉ.' },
      { text: '{野球|やきゅう}の{試合|しあい}を{見|み}に{行|い}きましょう。', ro: 'Yakyuu no shiai o mi ni ikimashou.', vi: 'Cùng đi xem trận bóng chày nhé.' },
      { text: '{私|わたし}は{歌|うた}が{好|す}きです。{日本|にほん}の{歌手|かしゅ}も{好|す}きです。', ro: 'Watashi wa uta ga suki desu. Nihon no kashu mo suki desu.', vi: 'Tôi thích hát. Tôi cũng thích ca sĩ Nhật.' },
      { text: '{全部|ぜんぶ}でいくらですか。', ro: 'Zenbu de ikura desu ka.', vi: 'Tất cả bao nhiêu tiền?' },
      { text: '{手|て}が{冷|つめ}たいです。', ro: 'Te ga tsumetai desu.', vi: 'Tay tôi lạnh.' },
      { text: '{食|た}べ{放題|ほうだい}の{店|みせ}で{野菜|やさい}を{全部|ぜんぶ}{食|た}べました。', ro: 'Tabehoudai no mise de yasai o zenbu tabemashita.', vi: 'Ở quán ăn thả ga, tôi đã ăn hết chỗ rau.' },
    ],
  },
  7: {
    chars: '上下中外横出入開閉使貸置',
    nguon: 'du-kien',
    chuDe: 'vị trí (trên, dưới, trong, ngoài, cạnh) và nhờ vả trong nhà (ra/vào, mở/đóng, dùng, cho mượn, đặt)',
    doc: [
      { text: '{机|つくえ}の{上|うえ}に{本|ほん}があります。', ro: 'Tsukue no ue ni hon ga arimasu.', vi: 'Trên bàn có quyển sách.' },
      { text: 'ベッドの{下|した}に{猫|ねこ}がいます。', ro: 'Beddo no shita ni neko ga imasu.', vi: 'Dưới giường có con mèo.' },
      { text: '{箱|はこ}の{中|なか}に{何|なに}がありますか。', ro: 'Hako no naka ni nani ga arimasu ka.', vi: 'Trong hộp có gì vậy?' },
      { text: '{外|そと}は{寒|さむ}いですから、{窓|まど}を{閉|し}めてください。', ro: 'Soto wa samui desu kara, mado o shimete kudasai.', vi: 'Ngoài trời lạnh nên hãy đóng cửa sổ lại.' },
      { text: 'すみません、{窓|まど}を{開|あ}けてください。', ro: 'Sumimasen, mado o akete kudasai.', vi: 'Xin lỗi, hãy mở cửa sổ ra.' },
      { text: 'テレビの{横|よこ}に{写真|しゃしん}があります。', ro: 'Terebi no yoko ni shashin ga arimasu.', vi: 'Bên cạnh ti vi có bức ảnh.' },
      { text: 'どうぞ、{中|なか}に{入|はい}ってください。', ro: 'Douzo, naka ni haitte kudasai.', vi: 'Mời vào trong.' },
      { text: '{冷蔵庫|れいぞうこ}からジュースを{出|だ}してください。', ro: 'Reizouko kara juusu o dashite kudasai.', vi: 'Hãy lấy nước ép từ tủ lạnh ra.' },
      { text: 'このペンを{使|つか}ってください。', ro: 'Kono pen o tsukatte kudasai.', vi: 'Hãy dùng cây bút này.' },
      { text: 'すみません、{辞書|じしょ}を{貸|か}してください。', ro: 'Sumimasen, jisho o kashite kudasai.', vi: 'Xin lỗi, cho tôi mượn từ điển.' },
      { text: 'かばんはここに{置|お}いてください。', ro: 'Kaban wa koko ni oite kudasai.', vi: 'Hãy để cặp ở đây.' },
      { text: 'コップに{水|みず}を{入|い}れてください。', ro: 'Koppu ni mizu o irete kudasai.', vi: 'Hãy rót nước vào cốc.' },
    ],
  },
  8: {
    chars: '父母兄弟姉妹子目口耳足長',
    nguon: 'du-kien',
    chuDe: 'gia đình (bố, mẹ, anh, em, chị, con) và cơ thể (mắt, miệng, tai, chân, dài)',
    doc: [
      { text: '{父|ちち}は{会社員|かいしゃいん}です。{母|はは}は{先生|せんせい}です。', ro: 'Chichi wa kaishain desu. Haha wa sensei desu.', vi: 'Bố tôi là nhân viên công ty. Mẹ tôi là giáo viên.' },
      { text: '{兄|あに}が{一人|ひとり}と{妹|いもうと}が{一人|ひとり}います。', ro: 'Ani ga hitori to imouto ga hitori imasu.', vi: 'Tôi có một anh trai và một em gái.' },
      { text: 'お{兄|にい}さんは{何|なに}をしていますか。', ro: 'Oniisan wa nani o shite imasu ka.', vi: 'Anh trai bạn đang làm gì?' },
      { text: '{姉|あね}は{東京|とうきょう}に{住|す}んでいます。', ro: 'Ane wa Toukyou ni sunde imasu.', vi: 'Chị gái tôi đang sống ở Tokyo.' },
      { text: '{弟|おとうと}は{大学|だいがく}で{勉強|べんきょう}しています。', ro: 'Otouto wa daigaku de benkyou shite imasu.', vi: 'Em trai tôi đang học ở trường đại học.' },
      { text: 'ご{兄弟|きょうだい}は{何人|なんにん}ですか。', ro: 'Go-kyoudai wa nannin desu ka.', vi: 'Bạn có mấy anh chị em?' },
      { text: '{妹|いもうと}さんは{目|め}が{大|おお}きいですね。', ro: 'Imouto-san wa me ga ookii desu ne.', vi: 'Em gái bạn mắt to nhỉ.' },
      { text: '{姉|あね}は{髪|かみ}が{長|なが}いです。', ro: 'Ane wa kami ga nagai desu.', vi: 'Chị tôi tóc dài.' },
      { text: 'お{母|かあ}さんはお{元気|げんき}ですか。', ro: 'Okaasan wa o-genki desu ka.', vi: 'Mẹ bạn có khoẻ không?' },
      { text: '{子|こ}どもは{二人|ふたり}います。{息子|むすこ}と{娘|むすめ}です。', ro: 'Kodomo wa futari imasu. Musuko to musume desu.', vi: 'Tôi có hai con: một con trai và một con gái.' },
      { text: 'うさぎは{耳|みみ}が{長|なが}くて、{口|くち}が{小|ちい}さいです。', ro: 'Usagi wa mimi ga nagakute, kuchi ga chiisai desu.', vi: 'Con thỏ tai dài, miệng nhỏ.' },
      { text: '{父|ちち}は{足|あし}が{長|なが}いです。', ro: 'Chichi wa ashi ga nagai desu.', vi: 'Bố tôi chân dài.' },
    ],
  },
  9: {
    chars: '読書聞話言泳乗習運転集描',
    nguon: 'du-kien',
    chuDe: 'sở thích và khả năng (đọc, viết, nghe, nói, bơi, lên xe, học, lái xe, sưu tầm, vẽ)',
    doc: [
      { text: '{私|わたし}の{趣味|しゅみ}は{本|ほん}を{読|よ}むことです。', ro: 'Watashi no shumi wa hon o yomu koto desu.', vi: 'Sở thích của tôi là đọc sách.' },
      { text: '{漢字|かんじ}を{書|か}くことができますか。', ro: 'Kanji o kaku koto ga dekimasu ka.', vi: 'Bạn có viết được chữ Hán không?' },
      { text: '{毎晩|まいばん}、{日本|にほん}の{音楽|おんがく}を{聞|き}きます。', ro: 'Maiban, Nihon no ongaku o kikimasu.', vi: 'Tối nào tôi cũng nghe nhạc Nhật.' },
      { text: '{日本語|にほんご}で{話|はな}すのが{好|す}きです。', ro: 'Nihongo de hanasu no ga suki desu.', vi: 'Tôi thích nói chuyện bằng tiếng Nhật.' },
      { text: 'すみません、もう{一度|いちど}{言|い}ってください。', ro: 'Sumimasen, mou ichido itte kudasai.', vi: 'Xin lỗi, hãy nói lại một lần nữa.' },
      { text: '{私|わたし}は{泳|およ}ぐことができません。', ro: 'Watashi wa oyogu koto ga dekimasen.', vi: 'Tôi không biết bơi.' },
      { text: '{毎朝|まいあさ}、{電車|でんしゃ}に{乗|の}って{会社|かいしゃ}へ{行|い}きます。', ro: 'Maiasa, densha ni notte kaisha e ikimasu.', vi: 'Sáng nào tôi cũng đi tàu điện đến công ty.' },
      { text: '{先月|せんげつ}から{書道|しょどう}を{習|なら}っています。', ro: 'Sengetsu kara shodou o naratte imasu.', vi: 'Từ tháng trước tôi đang học thư pháp.' },
      { text: '{兄|あに}は{車|くるま}の{運転|うんてん}ができます。', ro: 'Ani wa kuruma no unten ga dekimasu.', vi: 'Anh tôi biết lái ô tô.' },
      { text: '{切手|きって}を{集|あつ}めるのが{好|す}きです。', ro: 'Kitte o atsumeru no ga suki desu.', vi: 'Tôi thích sưu tầm tem.' },
      { text: '{休|やす}みの{日|ひ}は{公園|こうえん}で{絵|え}を{描|か}きます。', ro: 'Yasumi no hi wa kouen de e o kakimasu.', vi: 'Ngày nghỉ tôi vẽ tranh ở công viên.' },
      { text: '{自転車|じてんしゃ}に{乗|の}って{学校|がっこう}へ{行|い}きます。', ro: 'Jitensha ni notte gakkou e ikimasu.', vi: 'Tôi đi xe đạp đến trường.' },
    ],
  },
  10: {
    chars: '右左立座歩待持帰道橋危曲',
    nguon: 'du-kien',
    chuDe: 'hỏi đường và quy tắc khi đi tour (trái/phải, đứng/ngồi, đi bộ, chờ, mang, về, đường, cầu, nguy hiểm, rẽ)',
    doc: [
      { text: 'あの{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。', ro: 'Ano shingou o migi ni magatte kudasai.', vi: 'Hãy rẽ phải ở cái đèn giao thông kia.' },
      { text: '{二|ふた}つ{目|め}の{角|かど}を{左|ひだり}に{曲|ま}がります。', ro: 'Futatsume no kado o hidari ni magarimasu.', vi: 'Rẽ trái ở góc phố thứ hai.' },
      { text: '{橋|はし}を{渡|わた}って、まっすぐ{行|い}ってください。', ro: 'Hashi o watatte, massugu itte kudasai.', vi: 'Qua cầu rồi đi thẳng.' },
      { text: '{駅|えき}から{歩|ある}いて{十分|じゅっぷん}です。', ro: 'Eki kara aruite juppun desu.', vi: 'Từ ga đi bộ mất 10 phút.' },
      { text: 'ここに{座|すわ}ってもいいですか。', ro: 'Koko ni suwatte mo ii desu ka.', vi: 'Tôi ngồi đây được không?' },
      { text: 'バスの{中|なか}で{立|た}たないでください。{危|あぶ}ないです。', ro: 'Basu no naka de tatanaide kudasai. Abunai desu.', vi: 'Xin đừng đứng trong xe buýt. Nguy hiểm.' },
      { text: 'ここで{少|すこ}し{待|ま}ってください。', ro: 'Koko de sukoshi matte kudasai.', vi: 'Hãy đợi ở đây một chút.' },
      { text: 'ごみは{持|も}って{帰|かえ}ってください。', ro: 'Gomi wa motte kaette kudasai.', vi: 'Hãy mang rác về.' },
      { text: '{道|みち}がわかりませんから、{地図|ちず}を{見|み}ます。', ro: 'Michi ga wakarimasen kara, chizu o mimasu.', vi: 'Tôi không biết đường nên xem bản đồ.' },
      { text: '{五時|ごじ}までにバスに{帰|かえ}ってください。', ro: 'Goji made ni basu ni kaette kudasai.', vi: 'Hãy quay lại xe buýt trước 5 giờ.' },
      { text: 'この{道|みち}は{車|くるま}が{多|おお}いですから、{危|あぶ}ないです。', ro: 'Kono michi wa kuruma ga ooi desu kara, abunai desu.', vi: 'Đường này nhiều xe nên nguy hiểm.' },
      { text: '{右|みぎ}の{写真|しゃしん}は{父|ちち}で、{左|ひだり}は{母|はは}です。', ro: 'Migi no shashin wa chichi de, hidari wa haha desu.', vi: 'Ảnh bên phải là bố tôi, bên trái là mẹ tôi.' },
    ],
  },
  11: {
    chars: '起寝働始終住通活初忘慣卒',
    nguon: 'du-kien',
    chuDe: 'sinh hoạt hằng ngày (dậy, ngủ, làm việc, bắt đầu, kết thúc) và cuộc sống mới (sống, theo học, quen, quên, tốt nghiệp)',
    doc: [
      { text: '{毎朝|まいあさ}{六時|ろくじ}に{起|お}きます。', ro: 'Maiasa rokuji ni okimasu.', vi: 'Sáng nào tôi cũng dậy lúc 6 giờ.' },
      { text: '{昨日|きのう}は{十二時|じゅうにじ}に{寝|ね}ました。', ro: 'Kinou wa juuniji ni nemashita.', vi: 'Hôm qua tôi ngủ lúc 12 giờ.' },
      { text: '{兄|あに}は{銀行|ぎんこう}で{働|はたら}いています。', ro: 'Ani wa ginkou de hataraite imasu.', vi: 'Anh trai tôi đang làm việc ở ngân hàng.' },
      { text: '{授業|じゅぎょう}は{九時|くじ}に{始|はじ}まって、{十二時|じゅうにじ}に{終|お}わります。', ro: 'Jugyou wa kuji ni hajimatte, juuniji ni owarimasu.', vi: 'Giờ học bắt đầu lúc 9 giờ và kết thúc lúc 12 giờ.' },
      { text: '{今|いま}、ハノイに{住|す}んでいます。', ro: 'Ima, Hanoi ni sunde imasu.', vi: 'Bây giờ tôi đang sống ở Hà Nội.' },
      { text: '{毎日|まいにち}、{自転車|じてんしゃ}で{学校|がっこう}に{通|かよ}っています。', ro: 'Mainichi, jitensha de gakkou ni kayotte imasu.', vi: 'Ngày nào tôi cũng đi học bằng xe đạp.' },
      { text: '{日本|にほん}の{生活|せいかつ}はどうですか。', ro: 'Nihon no seikatsu wa dou desu ka.', vi: 'Cuộc sống ở Nhật thế nào?' },
      { text: '{初|はじ}めは{大変|たいへん}でしたが、{今|いま}は{楽|たの}しいです。', ro: 'Hajime wa taihen deshita ga, ima wa tanoshii desu.', vi: 'Lúc đầu vất vả nhưng bây giờ thì vui.' },
      { text: '{初|はじ}めて{一人|ひとり}で{日本|にほん}へ{来|き}ました。', ro: 'Hajimete hitori de Nihon e kimashita.', vi: 'Lần đầu tiên tôi đến Nhật một mình.' },
      { text: '{宿題|しゅくだい}を{忘|わす}れました。すみません。', ro: 'Shukudai o wasuremashita. Sumimasen.', vi: 'Em quên bài tập rồi. Em xin lỗi.' },
      { text: '{日本|にほん}の{生活|せいかつ}にもう{慣|な}れましたか。', ro: 'Nihon no seikatsu ni mou naremashita ka.', vi: 'Bạn đã quen với cuộc sống ở Nhật chưa?' },
      { text: '{来年|らいねん}、{大学|だいがく}を{卒業|そつぎょう}します。', ro: 'Rainen, daigaku o sotsugyou shimasu.', vi: 'Năm sau tôi tốt nghiệp đại học.' },
    ],
  },
  12: {
    chars: '病院医者体頭薬熱痛歯悪治',
    nguon: 'du-kien',
    chuDe: 'ốm đau và khám bệnh (bệnh viện, bác sĩ, cơ thể, đầu, thuốc, sốt, đau, răng, xấu, khỏi)',
    doc: [
      { text: '{昨日|きのう}から{熱|ねつ}があります。', ro: 'Kinou kara netsu ga arimasu.', vi: 'Tôi bị sốt từ hôm qua.' },
      { text: '{頭|あたま}が{痛|いた}いんです。', ro: 'Atama ga itai n desu.', vi: 'Tôi đau đầu.' },
      { text: '{病院|びょういん}へ{行|い}ったほうがいいですよ。', ro: 'Byouin e itta hou ga ii desu yo.', vi: 'Bạn nên đi bệnh viện đấy.' },
      { text: '{医者|いしゃ}に{薬|くすり}をもらいました。', ro: 'Isha ni kusuri o moraimashita.', vi: 'Tôi đã được bác sĩ cho thuốc.' },
      { text: '{寝|ね}る{前|まえ}に、この{薬|くすり}を{飲|の}んでください。', ro: 'Neru mae ni, kono kusuri o nonde kudasai.', vi: 'Hãy uống thuốc này trước khi ngủ.' },
      { text: '{歯|は}が{痛|いた}いですから、{歯医者|はいしゃ}へ{行|い}きます。', ro: 'Ha ga itai desu kara, haisha e ikimasu.', vi: 'Vì đau răng nên tôi đi nha sĩ.' },
      { text: '{気持|きも}ちが{悪|わる}いですから、{少|すこ}し{休|やす}みます。', ro: 'Kimochi ga warui desu kara, sukoshi yasumimasu.', vi: 'Vì thấy buồn nôn nên tôi nghỉ một chút.' },
      { text: '{野菜|やさい}は{体|からだ}にいいです。', ro: 'Yasai wa karada ni ii desu.', vi: 'Rau tốt cho cơ thể.' },
      { text: 'おかげさまで、{病気|びょうき}はもう{治|なお}りました。', ro: 'Okagesama de, byouki wa mou naorimashita.', vi: 'Nhờ trời, bệnh tôi đã khỏi rồi.' },
      { text: '{熱|ねつ}があるときは、お{風呂|ふろ}に{入|はい}らないでください。', ro: 'Netsu ga aru toki wa, ofuro ni hairanaide kudasai.', vi: 'Khi bị sốt thì đừng tắm bồn.' },
      { text: '{毎晩|まいばん}、{寝|ね}る{前|まえ}に{歯|は}を{磨|みが}きます。', ro: 'Maiban, neru mae ni ha o migakimasu.', vi: 'Tối nào tôi cũng đánh răng trước khi ngủ.' },
      { text: 'お{大事|だいじ}に。{早|はや}く{治|なお}るといいですね。', ro: 'Odaiji ni. Hayaku naoru to ii desu ne.', vi: 'Giữ gìn sức khoẻ nhé. Mong bạn mau khỏi.' },
    ],
  },
  13: {
    chars: '男女赤青黄色若売知場所品',
    nguon: 'du-kien',
    chuDe: 'tả người và đồ vật (nam, nữ, màu đỏ/xanh/vàng, trẻ) và giới thiệu nơi mua sắm (bán, biết, địa điểm, hàng hoá)',
    doc: [
      { text: 'あの{赤|あか}いシャツを{着|き}ている{男|おとこ}の{人|ひと}はだれですか。', ro: 'Ano akai shatsu o kite iru otoko no hito wa dare desu ka.', vi: 'Người đàn ông đang mặc áo sơ mi đỏ kia là ai?' },
      { text: '{青|あお}い{帽子|ぼうし}をかぶっている{女|おんな}の{人|ひと}がパクさんです。', ro: 'Aoi boushi o kabutte iru onna no hito ga Paku-san desu.', vi: 'Người phụ nữ đang đội mũ xanh là chị Park.' },
      { text: '{黄色|きいろ}いネクタイをしている{人|ひと}が{先生|せんせい}です。', ro: 'Kiiroi nekutai o shite iru hito ga sensei desu.', vi: 'Người đang đeo cà vạt vàng là thầy giáo.' },
      { text: '{何色|なにいろ}が{好|す}きですか。', ro: 'Naniiro ga suki desu ka.', vi: 'Bạn thích màu gì?' },
      { text: 'この{店|みせ}は{若|わか}い{人|ひと}に{人気|にんき}があります。', ro: 'Kono mise wa wakai hito ni ninki ga arimasu.', vi: 'Cửa hàng này được giới trẻ yêu thích.' },
      { text: 'あの{店|みせ}では{安|やす}い{電気製品|でんきせいひん}を{売|う}っています。', ro: 'Ano mise de wa yasui denki seihin o utte imasu.', vi: 'Cửa hàng kia bán đồ điện rẻ.' },
      { text: 'いいホテルを{知|し}っていますか。', ro: 'Ii hoteru o shitte imasu ka.', vi: 'Bạn có biết khách sạn nào tốt không?' },
      { text: 'いいえ、{知|し}りません。', ro: 'Iie, shirimasen.', vi: 'Không, tôi không biết.' },
      { text: 'パーティーの{場所|ばしょ}はどこですか。', ro: 'Paatii no basho wa doko desu ka.', vi: 'Địa điểm bữa tiệc ở đâu?' },
      { text: '{住所|じゅうしょ}と{名前|なまえ}を{書|か}いてください。', ro: 'Juusho to namae o kaite kudasai.', vi: 'Hãy viết địa chỉ và tên.' },
      { text: 'この{品物|しなもの}はどこで{売|う}っていますか。', ro: 'Kono shinamono wa doko de utte imasu ka.', vi: 'Món hàng này bán ở đâu?' },
      { text: '{紅葉|こうよう}がきれいな{場所|ばしょ}を{知|し}っています。', ro: 'Kouyou ga kirei na basho o shitte imasu.', vi: 'Tôi biết một nơi lá đỏ rất đẹp.' },
    ],
  },
  14: {
    chars: '田空字思便利不同笑経験化',
    nguon: 'du-kien',
    chuDe: 'so sánh quê và phố, nêu ý kiến (ruộng, không khí, chữ, nghĩ, tiện lợi, bất tiện, giống nhau) và kể trải nghiệm phong tục (cười, kinh nghiệm, văn hoá)',
    doc: [
      { text: '{田舎|いなか}は{空気|くうき}がきれいです。', ro: 'Inaka wa kuuki ga kirei desu.', vi: 'Ở quê không khí trong lành.' },
      { text: '{都会|とかい}は{便利|べんり}ですが、{少|すこ}しうるさいと{思|おも}います。', ro: 'Tokai wa benri desu ga, sukoshi urusai to omoimasu.', vi: 'Thành phố tiện lợi nhưng tôi nghĩ hơi ồn.' },
      { text: '{田舎|いなか}は{交通|こうつう}が{不便|ふべん}です。', ro: 'Inaka wa koutsuu ga fuben desu.', vi: 'Ở quê giao thông bất tiện.' },
      { text: '{私|わたし}もそう{思|おも}います。', ro: 'Watashi mo sou omoimasu.', vi: 'Tôi cũng nghĩ vậy.' },
      { text: '{空|そら}がとても{青|あお}いです。', ro: 'Sora ga totemo aoi desu.', vi: 'Bầu trời rất xanh.' },
      { text: 'ここに{名前|なまえ}を{大|おお}きい{字|じ}で{書|か}いてください。', ro: 'Koko ni namae o ookii ji de kaite kudasai.', vi: 'Hãy viết tên vào đây bằng chữ to.' },
      { text: '{田中|たなか}さんと{同|おな}じクラスです。', ro: 'Tanaka-san to onaji kurasu desu.', vi: 'Tôi học cùng lớp với anh Tanaka.' },
      { text: '{日本|にほん}の{習慣|しゅうかん}はベトナムと{同|おな}じですか。', ro: 'Nihon no shuukan wa Betonamu to onaji desu ka.', vi: 'Phong tục Nhật có giống Việt Nam không?' },
      { text: 'みんなが{私|わたし}の{話|はなし}を{聞|き}いて{笑|わら}いました。', ro: 'Minna ga watashi no hanashi o kiite waraimashita.', vi: 'Mọi người nghe chuyện của tôi và bật cười.' },
      { text: '{日本|にほん}でいろいろなことを{経験|けいけん}しました。', ro: 'Nihon de iroiro na koto o keiken shimashita.', vi: 'Tôi đã trải nghiệm nhiều điều ở Nhật.' },
      { text: '{日本|にほん}では{毎朝|まいあさ}{化粧|けしょう}する{女|おんな}の{人|ひと}が{多|おお}いです。', ro: 'Nihon de wa maiasa keshou suru onna no hito ga ooi desu.', vi: 'Ở Nhật nhiều phụ nữ trang điểm mỗi sáng.' },
      { text: 'コンビニは{便利|べんり}だと{思|おも}います。', ro: 'Konbini wa benri da to omoimasu.', vi: 'Tôi nghĩ cửa hàng tiện lợi thì tiện.' },
    ],
  },
  15: {
    chars: '天気晴雨曇降台震事故急心',
    nguon: 'du-kien',
    chuDe: 'thời tiết và tin tức (trời, khí, nắng, mưa, mây, rơi, bão, động đất, tai nạn, vội, lo lắng)',
    doc: [
      { text: '{明日|あした}の{天気|てんき}はどうですか。', ro: 'Ashita no tenki wa dou desu ka.', vi: 'Thời tiết ngày mai thế nào?' },
      { text: '{午前|ごぜん}は{晴|は}れますが、{午後|ごご}は{雨|あめ}が{降|ふ}るでしょう。', ro: 'Gozen wa haremasu ga, gogo wa ame ga furu deshou.', vi: 'Buổi sáng trời nắng nhưng buổi chiều có lẽ sẽ mưa.' },
      { text: '{今日|きょう}は{一日|いちにち}{曇|くも}りです。', ro: 'Kyou wa ichinichi kumori desu.', vi: 'Hôm nay trời nhiều mây cả ngày.' },
      { text: '{雨|あめ}が{降|ふ}ったら、{試合|しあい}は{中止|ちゅうし}です。', ro: 'Ame ga futtara, shiai wa chuushi desu.', vi: 'Nếu trời mưa thì trận đấu bị huỷ.' },
      { text: '{台風|たいふう}で{電車|でんしゃ}が{止|と}まっています。', ro: 'Taifuu de densha ga tomatte imasu.', vi: 'Vì bão nên tàu điện đang dừng.' },
      { text: '{昨日|きのう}の{夜|よる}、{大|おお}きい{地震|じしん}がありました。', ro: 'Kinou no yoru, ookii jishin ga arimashita.', vi: 'Tối qua đã có một trận động đất lớn.' },
      { text: '{事故|じこ}があったそうです。', ro: 'Jiko ga atta sou desu.', vi: 'Nghe nói đã có tai nạn.' },
      { text: '{時間|じかん}がありませんから、{急|いそ}いでください。', ro: 'Jikan ga arimasen kara, isoide kudasai.', vi: 'Không có thời gian đâu, hãy nhanh lên.' },
      { text: '{急|きゅう}に{雨|あめ}が{降|ふ}ってきました。', ro: 'Kyuu ni ame ga futte kimashita.', vi: 'Đột nhiên trời đổ mưa.' },
      { text: '{母|はは}が{心配|しんぱい}しています。', ro: 'Haha ga shinpai shite imasu.', vi: 'Mẹ tôi đang lo lắng.' },
      { text: '{次|つぎ}の{駅|えき}で{降|お}ります。', ro: 'Tsugi no eki de orimasu.', vi: 'Tôi xuống ở ga tiếp theo.' },
      { text: '{天気|てんき}がいいですから、{空気|くうき}が{気持|きも}ちいいです。', ro: 'Tenki ga ii desu kara, kuuki ga kimochi ii desu.', vi: 'Vì trời đẹp nên không khí dễ chịu.' },
    ],
  },
};

/** Danh sách chữ mọi bài (nhẹ) — cho thẻ chữ Hán biết chữ nào "đã học" ở bài mấy. */
export const LOP: Record<number, HanLopBai> = Object.fromEntries(
  Object.entries(HAN_LOP).map(([n, b]) => [n, { chars: b.chars, nguon: b.nguon }]),
);

export function hanLopLesson(n: number): Lesson | null {
  const d = HAN_LOP[n];
  if (!d) return null;
  const chars = [...d.chars];
  const slide = d.nguon === 'slide';
  const blocks: Block[] = [
    {
      t: 'p',
      text: slide
        ? `Đây là **đúng ${chars.length} chữ trên slide của cô** cho Bài ${n}: **${chars.join(' ')}**. Chạm vào một chữ để xem **thứ tự nét chạy từng nét**, âm Hán Việt, On/Kun (viết kiểu cô: み・ます), cách nhớ bằng hình, **các từ đi chung** — kể cả từ ghép với chữ Hán đã học ở bài trước — và tập viết ngay trong thẻ.`
        : `Bài ${n} có ${chars.length} chữ Hán của lớp: **${chars.join(' ')}**. Chạm vào một chữ để xem thứ tự nét, âm Hán Việt, On/Kun, cách nhớ, các từ đi chung (kể cả từ ghép với chữ đã học ở bài trước) và tập viết.`,
    },
  ];
  if (!slide) {
    blocks.push({
      t: 'note',
      title: 'Danh sách dự kiến — sẽ khớp slide của cô khi có ảnh',
      items: [
        'Chưa có ảnh slide chữ Hán của cô cho bài này, nên danh sách được chọn từ chữ Hán **xuất hiện trong từ vựng và ngữ pháp Bài ' + n + '**, ưu tiên chữ mức JLPT N5 (rồi N4) hay gặp, không trùng chữ của bài khác.',
        'Khi lên lớp thấy cô dạy chữ khác: chụp slide gửi lên, danh sách sẽ được sửa cho khớp. Mọi chữ ở đây vẫn là chữ cần biết để đọc đề không furigana.',
      ],
    });
  }
  blocks.push({ t: 'hanlop', bai: n });
  if (d.them) {
    blocks.push({ t: 'h', text: 'Từ cô chép trên bảng — bổ sung' });
    blocks.push({ t: 'p', text: d.them.ghi });
    blocks.push({ t: 'vocab', items: d.them.items });
  }
  blocks.push({
    t: 'readkanji',
    id: `b${n}-han-doc`,
    title: `Đọc không furigana — chữ Hán của lớp Bài ${n}`,
    note: 'Như đề thi: chữ Hán không có furigana. Đọc to cả câu trước, rồi mới bấm xem cách đọc. Chạm vào một chữ Hán để mở thẻ chữ đó.',
    items: d.doc,
  });
  blocks.push({
    t: 'write',
    id: `b${n}-han-viet`,
    title: `Tập viết ${chars.length} chữ của lớp — Bài ${n}`,
    chars,
  });
  return {
    id: `b${n}-han-lop`,
    kind: 'kanji',
    title: `Chữ Hán của lớp · Bài ${n}${slide ? ' — đúng slide của cô' : ' — dự kiến'}`,
    goal: `Nhận mặt, đọc, hiểu nghĩa và viết đúng thứ tự nét ${chars.length} chữ ${chars.join(' ')} — ${d.chuDe} — cùng các từ đi chung với chúng.`,
    minutes: 35,
    blocks,
  };
}

/** Chèn bài "Chữ Hán của lớp" ngay sau `bN-kanji` (không có thì trước bài nghe/cuối). */
export function chenHanLop(n: number, lessons: Lesson[]): Lesson[] {
  const han = hanLopLesson(n);
  if (!han || lessons.some((l) => l.id === han.id)) return lessons;
  const i = lessons.findIndex((l) => l.id === `b${n}-kanji`);
  const at = i >= 0 ? i + 1 : lessons.length;
  return [...lessons.slice(0, at), han, ...lessons.slice(at)];
}
