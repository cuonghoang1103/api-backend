/**
 * Nội dung cố định của trang cửa hàng Flying Pencil (08/10/2026).
 *
 * Phần ĐỔI THEO BẢN (phiên bản, dung lượng, ngày, nhật ký, ảnh/video) đến từ
 * `phien_ban.json` qua main — xem `main/troChoi/caiGame.ts`. Phần ở đây là thứ
 * ít đổi: tên, mô tả, tính năng, cấu hình, phím, lộ trình. Ảnh bìa nhỏ nằm sẵn
 * trong bó app (`public/games/flying-pencil-bia.jpg`) để thẻ và trang vẽ được
 * kể cả khi mất mạng; ảnh/video lớn tải từ release, không nhét vào bó.
 */
export type Chu = { vi: string; en: string };

export const FP = {
  ma: 'flying-pencil' as const,
  duong: '/games/flying-pencil',
  ten: 'Flying Pencil',
  phuDe: { vi: 'Thế chiến · Màn 1: Trân Châu Cảng', en: 'World War · Mission 1: Pearl Harbor' },
  khauHieu: {
    vi: 'Sáng Chủ nhật, 7/12/1941. Bạn có 20 phút để giữ USS Nevada nổi.',
    en: 'Sunday morning, 7 December 1941. You have 20 minutes to keep USS Nevada afloat.',
  },
  moTaNgan: {
    vi: 'Hải chiến lịch sử góc nhìn thứ nhất: đứng khẩu súng máy trên boong, cầm ống nhòm, lái khu trục ra cửa cảng — giữa hai đợt tấn công đường không.',
    en: 'First-person historical naval combat: man the deck machine gun, raise the binoculars, steer a destroyer to the harbor mouth — through two waves of air attack.',
  },
  moTaDai: {
    vi: [
      '07:55, Battleship Row. Những chiếc Kate đầu tiên hạ thấp trên mặt nước, ngư lôi rời giá. Bạn là xạ thủ khẩu .50 trên USS Nevada — thiết giáp hạm duy nhất tìm cách ra khơi trong buổi sáng ấy.',
      'Màn 1 kéo dài khoảng 20 phút, theo bốn pha bám giờ thật: đợt tấn công thứ nhất, khoảng lặng, đợt thứ hai và cuộc chạy ra cửa cảng. Bắn hạ máy bay phóng ngư lôi trước khi chúng thả, chuyển sang khu trục săn tàu ngầm mini ở luồng, giao việc cho thuỷ thủ chữa cháy và cứu người, quyết định cho Nevada ra biển hay ở lại.',
      'Đây là BẢN THỬ: mới có Màn 1, chơi đơn với máy. Lưu tự động đầu mỗi pha, ba mức khó (Tân binh · Sĩ quan · Đô đốc), chấm 1–3 sao theo kết quả.',
    ],
    en: [
      '07:55, Battleship Row. The first Kates drop low over the water, torpedoes away. You crew a .50 on USS Nevada — the only battleship to try for the open sea that morning.',
      'Mission 1 runs about 20 minutes across four phases on real time: the first wave, the lull, the second wave and the run for the harbor mouth. Down torpedo bombers before they release, jump to a destroyer to hunt a midget submarine in the channel, assign sailors to fight fires and rescue men, and decide whether Nevada sorties or holds.',
      'This is a PREVIEW: Mission 1 only, single-player against AI. Autosave at the start of each phase, three difficulties (Recruit · Officer · Admiral), 1–3 stars by outcome.',
    ],
  },
  nhan: [
    { vi: 'Hải chiến', en: 'Naval' },
    { vi: 'Lịch sử 1941', en: 'WWII 1941' },
    { vi: 'Góc nhìn thứ nhất', en: 'First person' },
    { vi: 'Chơi đơn', en: 'Single-player' },
    { vi: 'Chiến thuật', en: 'Tactics' },
  ] as Chu[],
  tinhNang: [
    {
      bieuTuong: 'anchor',
      ten: { vi: 'Hải chiến lịch sử 1941', en: 'Historical naval battle, 1941' },
      chu: { vi: 'Cảng Trân Châu dựng từ địa hình và ảnh vệ tinh thật, bốn pha theo giờ thật của buổi sáng 7/12.', en: 'Pearl Harbor built from real terrain and satellite imagery, four phases on the real 7 December timeline.' },
    },
    {
      bieuTuong: 'crosshair',
      ten: { vi: 'Súng phòng không & ống nhòm', en: 'Anti-aircraft gun & binoculars' },
      chu: { vi: 'Ngắm đón có tính đạn rơi, ống ngắm vòng bánh xe, chớp nòng và vỏ đạn văng — giữ cò là cảm được nhịp súng.', en: 'Lead your shots with real ballistics, ring sight, muzzle flash and spent casings — you feel the gun’s rhythm.' },
    },
    {
      bieuTuong: 'ship',
      ten: { vi: 'Lái khu trục, săn tàu ngầm', en: 'Command a destroyer, hunt a submarine' },
      chu: { vi: 'Nhảy sang khu trục: pháo 5", ngư lôi, bom chìm, thả khói, đèn pha — săn tàu ngầm mini trong luồng.', en: 'Jump to a destroyer: 5" guns, torpedoes, depth charges, smoke, searchlight — hunt the midget sub in the channel.' },
    },
    {
      bieuTuong: 'torpedo',
      ten: { vi: 'Ngư lôi, cháy dầu, tàu lật', en: 'Torpedoes, burning oil, capsizing' },
      chu: { vi: 'Bám theo một quả ngư lôi tới đích, nhìn dầu cháy trên mặt nước và Oklahoma lật — hiệu ứng dựng bằng mô phỏng thật.', en: 'Follow a torpedo to its target, watch oil burn on the water and Oklahoma roll over — effects built from real simulation.' },
    },
    {
      bieuTuong: 'radio',
      ten: { vi: 'Nhạc động + radio chiến trường', en: 'Dynamic music + battlefield radio' },
      chu: { vi: 'Nhạc đổi theo nhịp trận, hơn 120 câu radio và hiệu lệnh trên loa tàu, âm thanh 3D quanh bạn.', en: 'Music follows the fight, 120+ radio calls and ship PA orders, 3D sound all around you.' },
    },
    {
      bieuTuong: 'sparkles',
      ten: { vi: 'Đồ hoạ URP hiện đại', en: 'Modern URP graphics' },
      chu: { vi: 'Biển phản chiếu, mây thể tích, khói lửa flipbook dựng từ mô phỏng Blender, thép tàu PBR có gỉ và sơn chống hà.', en: 'Reflective sea, volumetric clouds, smoke and fire flipbooks from Blender simulation, PBR ship steel with rust and anti-fouling paint.' },
    },
  ],
  cauHinh: {
    toiThieu: [
      { nhan: { vi: 'Hệ điều hành', en: 'OS' }, gt: { vi: 'macOS 13 Ventura', en: 'macOS 13 Ventura' } },
      { nhan: { vi: 'Chip', en: 'Chip' }, gt: { vi: 'Apple M1', en: 'Apple M1' } },
      { nhan: { vi: 'Bộ nhớ', en: 'Memory' }, gt: { vi: '8 GB RAM', en: '8 GB RAM' } },
      { nhan: { vi: 'Ổ đĩa trống', en: 'Free disk' }, gt: { vi: '2 GB (1,1 GB sau khi cài)', en: '2 GB (1.1 GB installed)' } },
    ],
    khuyenDung: [
      { nhan: { vi: 'Hệ điều hành', en: 'OS' }, gt: { vi: 'macOS 14 trở lên', en: 'macOS 14 or later' } },
      { nhan: { vi: 'Chip', en: 'Chip' }, gt: { vi: 'Apple M1 Pro / M2 trở lên', en: 'Apple M1 Pro / M2 or better' } },
      { nhan: { vi: 'Bộ nhớ', en: 'Memory' }, gt: { vi: '16 GB RAM', en: '16 GB RAM' } },
      { nhan: { vi: 'Điều khiển', en: 'Input' }, gt: { vi: 'Chuột + bàn phím', en: 'Mouse + keyboard' } },
    ],
  },
  /** Phím — chép từ chuỗi gợi ý trong game (`chuoi_m1.json`) và mã `M1Tran/M1KhuTruc/M1ThuyThu`. */
  dieuKhien: [
    { phim: ['Chuột'], en: ['Mouse'], vi: 'Ngắm', viEn: 'Aim' },
    { phim: ['Giữ trái'], en: ['Hold left'], vi: 'Bắn', viEn: 'Fire' },
    { phim: ['Chuột phải'], en: ['Right click'], vi: 'Ống ngắm', viEn: 'Gun sight' },
    { phim: ['R'], en: ['R'], vi: 'Nạp đạn', viEn: 'Reload' },
    { phim: ['B'], en: ['B'], vi: 'Ống nhòm', viEn: 'Binoculars' },
    { phim: ['1', '2'], en: ['1', '2'], vi: 'Về khẩu súng máy · sang khu trục', viEn: 'Back to the gun · to the destroyer' },
    { phim: ['Tab'], en: ['Tab'], vi: 'Góc chiến thuật (WASD kéo · cuộn zoom · Q/E xoay)', viEn: 'Tactical view (WASD pan · scroll zoom · Q/E rotate)' },
    { phim: ['3', '4', '5'], en: ['3', '4', '5'], vi: 'Khu trục: pháo · ngư lôi · bom chìm', viEn: 'Destroyer: guns · torpedoes · depth charges' },
    { phim: ['G', 'J'], en: ['G', 'J'], vi: 'Khu trục: thả khói · đèn pha', viEn: 'Destroyer: smoke · searchlight' },
    { phim: ['7', '8', '9'], en: ['7', '8', '9'], vi: 'Giao thuỷ thủ: pháo · chữa cháy · cứu người (Shift = rút)', viEn: 'Assign sailors: guns · firefighting · rescue (Shift = withdraw)' },
    { phim: ['N', 'K'], en: ['N', 'K'], vi: 'Ra lệnh Nevada · khu trục', viEn: 'Order Nevada · the destroyer' },
    { phim: ['C'], en: ['C'], vi: 'Bám theo ngư lôi / bom', viEn: 'Follow a torpedo / bomb' },
    { phim: ['Alt'], en: ['Alt'], vi: 'Hiện con trỏ', viEn: 'Show cursor' },
    { phim: ['L'], en: ['L'], vi: 'Đổi ngôn ngữ Việt / Anh', viEn: 'Switch Vietnamese / English' },
    { phim: ['Space', 'Esc'], en: ['Space', 'Esc'], vi: 'Bỏ qua cảnh · menu', viEn: 'Skip cutscene · menu' },
  ],
  loTrinh: [
    { trangThai: 'xong', ten: { vi: 'Màn 1 — Trân Châu Cảng (bản thử)', en: 'Mission 1 — Pearl Harbor (preview)' }, chu: { vi: 'Đang cho chơi thử trong app.', en: 'Playable now in the app.' } },
    { trangThai: 'dang', ten: { vi: 'Màn 2 — Midway 1942', en: 'Mission 2 — Midway 1942' }, chu: { vi: 'Hải chiến tàu sân bay: trinh sát, bổ nhào, phòng không hạm đội.', en: 'Carrier battle: scouting, dive bombing, fleet air defense.' } },
    { trangThai: 'sau', ten: { vi: 'Chiến dịch Thái Bình Dương', en: 'Pacific campaign' }, chu: { vi: 'Bản đồ chiến lược nối các trận, quản lý hạm đội giữa các màn.', en: 'A strategic map linking battles, fleet management between missions.' } },
    { trangThai: 'sau', ten: { vi: 'Bản Windows', en: 'Windows build' }, chu: { vi: 'Sau khi Màn 1–2 ổn định.', en: 'Once Missions 1–2 are stable.' } },
  ] as { trangThai: 'xong' | 'dang' | 'sau'; ten: Chu; chu: Chu }[],
  ghiCong: {
    vi: 'Mô hình 3D Sketchfab (CC BY 4.0), hoạt cảnh Mixamo, âm thanh Freesound (CC0), ảnh NASA / USGS / Natural Earth (công cộng), địa hình Copernicus DEM, vật liệu ambientCG / Poly Haven (CC0), hiệu ứng War FX & Particle Pack (Unity Asset Store), giọng radio Microsoft Azure AI Speech. Danh sách đầy đủ tác giả nằm ở màn Ghi công trong game.',
    en: 'Sketchfab 3D models (CC BY 4.0), Mixamo animations, Freesound audio (CC0), NASA / USGS / Natural Earth imagery (public domain), Copernicus DEM terrain, ambientCG / Poly Haven materials (CC0), War FX & Particle Pack (Unity Asset Store), radio voices by Microsoft Azure AI Speech. The full author list is on the in-game Credits screen.',
  },
  anhBia: '/games/flying-pencil-bia.jpg',
  /** Ô "Sắp ra mắt: Màn 2" — ảnh nhỏ trong bó app (Zero trên trời Màn 1, đứng thay tới khi có ảnh Midway). */
  anhMidway: '/games/flying-pencil-midway.jpg',
};

export function chu(c: Chu, nn: string): string {
  return nn === 'en' ? c.en : c.vi;
}

export function coChu(byte: number, nn: string): string {
  const phay = (s: string) => (nn === 'en' ? s : s.replace('.', ','));
  if (byte >= 1e9) return `${phay((byte / 1e9).toFixed(2))} GB`;
  if (byte >= 1e6) return `${Math.round(byte / 1e6)} MB`;
  return `${Math.round(byte / 1e3)} KB`;
}
