/**
 * Chữ Hán MỚI của Bài 21 (目標 — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 標 努 健 康 貯 続 必 要 成 績 格 復 増 減 禁 (N3 theo các bảng tham khảo phổ biến; 続 có bảng xếp N4, 貯 có
 * bảng xếp N2) — bảng `b21-han-tu` trong bai21.ts.
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm; chữ mà mẹo nhìn hình
 * không phải gốc chữ (標, 康, 必) thì nói rõ là mẹo. Từ đi chung ưu tiên từ dùng trong bai21.ts.
 * On / Kun theo bảng thường dụng (常用): 標 康 績 格 復 禁 không có âm Kun; 貯 chỉ có On (ためる viết 貯める là cách
 * viết ngoài bảng thường dụng).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_21: Record<string, HanTu> = {
  '標': {
    hv: 'TIÊU', nghia: 'mốc, dấu hiệu; mục tiêu', en: 'mark / target',
    on: ['ヒョウ'], kun: [],
    nho: 'Bên trái 木 (cây, gỗ), bên phải 票 (phiếu — gợi âm ヒョウ). Mẹo nhìn (không phải gốc chữ): cái cọc gỗ cắm làm MỐC để mắt nhắm tới = TIÊU → 目標 (cái mốc mắt nhìn tới), 標識 (biển báo). Thiếu 木 là 票 (phiếu bầu).',
    tu: [
      { w: '{目標|もくひょう}', ro: 'mokuhyou', vi: 'mục tiêu' },
      { w: '{標準|ひょうじゅん}', ro: 'hyoujun', vi: 'tiêu chuẩn (N3)' },
      { w: '{標識|ひょうしき}', ro: 'hyoushiki', vi: 'biển báo (N2)' },
    ],
  },
  '努': {
    hv: 'NỖ', nghia: 'gắng sức, cố gắng', en: 'effort',
    on: ['ド'], kun: ['つと・める'],
    nho: 'Trên là 奴 (gợi âm ド), dưới là 力 (sức): dồn HẾT SỨC mà làm = NỖ (lực) → 努力. Khác 怒 (giận — Bài 19): cùng 奴 ở trên nhưng dưới là 心.',
    tu: [
      { w: '{努力|どりょく}', ro: 'doryoku', vi: 'nỗ lực' },
      { w: '{努力|どりょく}する', ro: 'doryoku suru', vi: 'nỗ lực, cố gắng' },
      { w: '{努|つと}める', ro: 'tsutomeru', vi: 'cố gắng, ra sức (N2)' },
    ],
  },
  '健': {
    hv: 'KIỆN', nghia: 'khoẻ mạnh, vững vàng', en: 'healthy',
    on: ['ケン'], kun: ['すこ・やか'],
    nho: 'Bên trái 亻 (người), bên phải 建 (dựng, xây — gợi âm ケン; chữ của Bài 18): người đứng VỮNG như toà nhà mới dựng = KHOẺ → 健康. Khác 建 (xây) — thiếu 亻.',
    tu: [
      { w: '{健康|けんこう}', ro: 'kenkou', vi: 'sức khoẻ' },
      { w: '{健康的|けんこうてき}', ro: 'kenkouteki', vi: 'lành mạnh (N3)' },
      { w: '{保健室|ほけんしつ}', ro: 'hokenshitsu', vi: 'phòng y tế trường (N3)' },
    ],
  },
  '康': {
    hv: 'KHANG', nghia: 'yên ổn, khoẻ', en: 'peace / health',
    on: ['コウ'], kun: [],
    nho: 'Gốc chữ là 庚 (gợi âm コウ) thêm các chấm vốn vẽ hạt thóc. Mẹo nhìn (không phải gốc chữ): dưới mái nhà 广 có bàn tay (⺕) và nước (氺) — nhà có lương thực, nước uống thì YÊN ỔN, KHOẺ = KHANG → 健康. Gần như chỉ gặp trong 健康.',
    tu: [
      { w: '{健康|けんこう}', ro: 'kenkou', vi: 'sức khoẻ' },
      { w: '{健康診断|けんこうしんだん}', ro: 'kenkou shindan', vi: 'khám sức khoẻ định kỳ (N3)' },
      { w: '{健康|けんこう}な{生活|せいかつ}', ro: 'kenkou na seikatsu', vi: 'cuộc sống lành mạnh' },
    ],
  },
  '貯': {
    hv: 'TRỮ', nghia: 'tích trữ, để dành', en: 'save / store',
    on: ['チョ'], kun: [],
    nho: 'Bên trái 貝 (vỏ sò — tiền thời xưa), bên phải 宁 (gợi âm チョ; vốn vẽ cái tủ cất đồ): cất tiền vào tủ = TRỮ, ĐỂ DÀNH → 貯金. ためる thường viết 貯める nhưng âm này nằm ngoài bảng thường dụng. Cùng bộ 貝 với 財 (財布).',
    tu: [
      { w: '{貯金|ちょきん}', ro: 'chokin', vi: 'tiền tiết kiệm; để dành tiền' },
      { w: '{貯金箱|ちょきんばこ}', ro: 'chokinbako', vi: 'ống heo' },
      { w: '{貯|た}める', ro: 'tameru', vi: 'để dành (Bài 16)' },
    ],
  },
  '続': {
    hv: 'TỤC', nghia: 'tiếp tục, nối tiếp', en: 'continue',
    on: ['ゾク'], kun: ['つづ・く', 'つづ・ける'],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 売 (chữ cũ 續 = 糸 + 賣 — gợi âm): nối sợi chỉ cho dài thêm = TIẾP TỤC → 続く, 続ける. Khác 読 (đọc — trái là 言) và 売 (bán).',
    tu: [
      { w: '{続|つづ}く', ro: 'tsuzuku', vi: '(việc gì) tiếp diễn, kéo dài' },
      { w: '{続|つづ}ける', ro: 'tsuzukeru', vi: 'tiếp tục (làm gì)' },
      { w: '{続|つづ}き', ro: 'tsuzuki', vi: 'phần tiếp theo' },
      { w: '{連続|れんぞく}', ro: 'renzoku', vi: 'liên tục (N3)' },
      { w: '{手続|てつづ}き', ro: 'tetsuzuki', vi: 'thủ tục (N3)' },
    ],
  },
  '必': {
    hv: 'TẤT', nghia: 'tất yếu, nhất định', en: 'certainly / necessary',
    on: ['ヒツ'], kun: ['かなら・ず'],
    nho: 'Mẹo nhìn (không phải gốc chữ — gốc vẽ cái cán buộc chặt): một nét phẩy CẮT QUA 心 (lòng) — đã quyết trong lòng thì NHẤT ĐỊNH làm = TẤT → 必ず, 必要. ⚠ Thứ tự nét đặc biệt: xem hoạt hình, đừng viết 心 rồi mới gạch.',
    tu: [
      { w: '{必|かなら}ず', ro: 'kanarazu', vi: 'nhất định (Bài 16)' },
      { w: '{必要|ひつよう}', ro: 'hitsuyou', vi: 'cần thiết' },
      { w: '{必要|ひつよう}な{物|もの}', ro: 'hitsuyou na mono', vi: 'đồ cần thiết' },
    ],
  },
  '要': {
    hv: 'YẾU', nghia: 'cần; trọng yếu', en: 'need / essential',
    on: ['ヨウ'], kun: ['い・る'],
    nho: 'Trên là 覀, dưới là 女: gốc vẽ người phụ nữ chống hai tay vào EO (腰) — eo là chỗ trọng yếu của thân = YẾU → 重要, 必要; kun 要る = cần. Khác 票 (phiếu) — dưới là 示.',
    tu: [
      { w: '{必要|ひつよう}', ro: 'hitsuyou', vi: 'cần thiết' },
      { w: '{要|い}る', ro: 'iru', vi: 'cần (nhóm 1: いります)' },
      { w: '{重要|じゅうよう}', ro: 'juuyou', vi: 'quan trọng (N3)' },
      { w: '{不要|ふよう}', ro: 'fuyou', vi: 'không cần thiết (N2)' },
    ],
  },
  '成': {
    hv: 'THÀNH', nghia: 'thành, làm nên', en: 'become / achieve',
    on: ['セイ', 'ジョウ'], kun: ['な・る', 'な・す'],
    nho: 'Gốc chữ: 戊 (cái rìu) + 丁 (gợi âm): cầm công cụ làm cho XONG = THÀNH → 成績 (thành tích), 成功 (thành công). Chữ 城 (thành trì — N3) = 土 + 成.',
    tu: [
      { w: '{成績|せいせき}', ro: 'seiseki', vi: 'thành tích, điểm số' },
      { w: '{成功|せいこう}', ro: 'seikou', vi: 'thành công (N3)' },
      { w: '{成長|せいちょう}', ro: 'seichou', vi: 'lớn lên, tăng trưởng (N3)' },
      { w: '{成人|せいじん}', ro: 'seijin', vi: 'người trưởng thành' },
    ],
  },
  '績': {
    hv: 'TÍCH', nghia: 'thành quả tích luỹ', en: 'achievement',
    on: ['セキ'], kun: [],
    nho: 'Bên trái 糸 (sợi), bên phải 責 (gợi âm セキ): xe sợi từng chút, TÍCH DẦN thành cuộn = thành quả tích luỹ → 成績. Khác 積 (chất đống — 面積) — trái là 禾.',
    tu: [
      { w: '{成績|せいせき}', ro: 'seiseki', vi: 'thành tích, điểm số' },
      { w: '{実績|じっせき}', ro: 'jisseki', vi: 'thành tích thực tế (N2)' },
    ],
  },
  '格': {
    hv: 'CÁCH', nghia: 'khuôn, chuẩn; tư cách', en: 'standard / status',
    on: ['カク', 'コウ'], kun: [],
    nho: 'Bên trái 木 (gỗ), bên phải 各 (gợi âm カク): cái khung gỗ — KHUÔN, CHUẨN = CÁCH → 合格 = "hợp cách" = đạt chuẩn → đỗ; 性格 = khuôn của tính tình. Khác 絡 (連絡) — trái là 糸.',
    tu: [
      { w: '{合格|ごうかく}', ro: 'goukaku', vi: 'đỗ, thi đậu' },
      { w: '{性格|せいかく}', ro: 'seikaku', vi: 'tính cách (N3)' },
      { w: '{資格|しかく}', ro: 'shikaku', vi: 'chứng chỉ, tư cách (N3)' },
      { w: '{格好|かっこう}', ro: 'kakkou', vi: 'dáng vẻ, bề ngoài (N3)' },
    ],
  },
  '復': {
    hv: 'PHỤC', nghia: 'trở lại, làm lại', en: 'return / again',
    on: ['フク'], kun: [],
    nho: 'Bên trái 彳 (bước đi), bên phải 复 (đi rồi quay lại): đi TRỞ LẠI con đường cũ = PHỤC → 復習 (học lại), 往復 (đi và về). Khác 複 (phức — trái 衤 áo) và 腹 (bụng — trái 月).',
    tu: [
      { w: '{復習|ふくしゅう}', ro: 'fukushuu', vi: 'ôn tập' },
      { w: '{往復|おうふく}', ro: 'oufuku', vi: 'khứ hồi (N3)' },
      { w: '{回復|かいふく}', ro: 'kaifuku', vi: 'hồi phục (N2)' },
    ],
  },
  '増': {
    hv: 'TĂNG', nghia: 'tăng thêm', en: 'increase',
    on: ['ゾウ'], kun: ['ふ・える', 'ふ・やす', 'ま・す'],
    nho: 'Bên trái 土 (đất), bên phải 曽 (gợi âm ゾウ; chồng lớp): đắp đất CHỒNG THÊM LỚP = TĂNG → 増える (tự), 増やす (tha). Khác 贈 (tặng — 贈り物) — trái là 貝.',
    tu: [
      { w: '{増|ふ}える', ro: 'fueru', vi: '(số lượng) tăng lên' },
      { w: '{増|ふ}やす', ro: 'fuyasu', vi: 'làm tăng' },
      { w: '{増加|ぞうか}', ro: 'zouka', vi: 'gia tăng (N2)' },
    ],
  },
  '減': {
    hv: 'GIẢM', nghia: 'giảm bớt', en: 'decrease',
    on: ['ゲン'], kun: ['へ・る', 'へ・らす'],
    nho: 'Bên trái 氵 (nước), bên phải 咸 (gợi âm ゲン): nước VƠI ĐI = GIẢM → 減る (tự), 減らす (tha). Khác 感 (cảm — 感想): 感 có 心 ở dưới, không có 氵.',
    tu: [
      { w: '{減|へ}る', ro: 'heru', vi: '(số lượng) giảm đi — nhóm 1' },
      { w: '{減|へ}らす', ro: 'herasu', vi: 'làm giảm, cắt giảm' },
      { w: '{減少|げんしょう}', ro: 'genshou', vi: 'sụt giảm (N2)' },
      { w: 'お{腹|なか}が{減|へ}る', ro: 'onaka ga heru', vi: 'đói bụng (văn nói)' },
    ],
  },
  '禁': {
    hv: 'CẤM', nghia: 'cấm', en: 'prohibit',
    on: ['キン'], kun: [],
    nho: 'Trên là 林 (rừng), dưới là 示 (bàn thờ, thần linh): khu rừng thiêng có thần — KHÔNG ĐƯỢC VÀO = CẤM → 禁止, 禁煙.',
    tu: [
      { w: '{禁煙|きんえん}', ro: 'kin\'en', vi: 'cấm hút thuốc; bỏ thuốc' },
      { w: '{禁止|きんし}', ro: 'kinshi', vi: 'cấm (N3)' },
      { w: '{立入禁止|たちいりきんし}', ro: 'tachiiri kinshi', vi: 'cấm vào (biển báo)' },
    ],
  },
};
