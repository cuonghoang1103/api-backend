/**
 * KHUÔN VIÊN ĐẠI HỌC FPT (cơ sở Hoà Lạc) — số liệu bố cục.
 *
 * ─── NGUỒN BỐ CỤC ───
 * Xếp theo BẢN ĐỒ CHÍNH THỨC của trường (daihoc.fpt.edu.vn, "Bản đồ Trường Đại
 * học FPT cơ sở Hà Nội") mà người dùng cung cấp, xoay 90° cho khớp hướng vào từ
 * cầu: đường chính của bản đồ (mép Nam) trở thành con đường chạy dọc mép Đông
 * đảo, nơi cầu cập vào.
 *
 * Nhìn từ cổng vào (đi về hướng Tây), đúng thứ tự bản đồ thật:
 *   cầu → cổng → CON ĐƯỜNG dọc mép trường → sảnh + biển xếp hạng
 *       → chữ FPT UNIVERSITY → thảm cỏ + hàng cọ → TOÀ ALPHA (giật cấp)
 *       → HỒ SEN LỚN SAU LƯNG ALPHA (toà nhà soi bóng xuống hồ)
 *       → BETA bên kia hồ · DELTA, GAMMA phía Bắc
 *   Dom A–D cụm giữa, Dom E–H cụm Tây (phía Nam đảo) · sân bóng đá giữa
 *   trường · sân bóng rổ góc Bắc cạnh đường · bãi gửi xe mép đường · tượng
 *   SELF MADE MAN giữa vườn ký túc xá.
 *
 * ─── VÌ SAO LÀ MỘT MẢNH ĐẤT RIÊNG ───
 * Bản đầu chen trường vào góc Tây-Nam đảo chính và bị bác đúng cả bốn điểm
 * (đè hồ cũ, chữ chồng nhà cũ, nhà che xe, sai trục). Đảo riêng ngoài khơi
 * phía Tây, nối bằng cầu — đảo cũ trả nguyên trạng, không đụng một khối nào.
 *
 * Ba điều kiện "ra khơi" đã kiểm trong mã: không có kiểm tra biên giết người
 * chơi; mặt biển bám theo máy quay; sàn vật lý toàn cục 1000×1000 đỡ sẵn.
 *
 * ─── ĐƠN VỊ ───
 * Xe dài ~2 đơn vị (~4 m thật) ⇒ 1 đơn vị ≈ 2 m. Khoảng cách co theo tỉ lệ
 * tương đối của bản đồ thật, không theo mét tuyệt đối.
 */

/** Tâm mảnh đất riêng và kích thước nền. */
export const ISLAND = { x: -162, z: 30, width: 160, depth: 148, y: 0 }

/** Cầu nối từ rìa Tây đảo chính sang mảnh đất trường. */
export const BRIDGE = { fromX: -84, toX: -94, z: 40, width: 9 }

/** Cổng chính — ngay đầu cầu, trước khi vào con đường dọc trường. */
export const GATE = { x: -100, z: 40 }

/**
 * CON ĐƯỜNG chạy dọc mép Đông trường (bản đồ thật: đường chính mép Nam).
 * "Trước cái biển và sảnh đó là con đường" — đường này.
 */
export const MAIN_ROAD = { x: -106, z: 40, length: 96, width: 8 }

/** Trục lễ nghi từ cổng thẳng vào toà Alpha. */
export const AXIS = { z: 40, halfWidth: 5, fromX: -96, toX: -146 }

/**
 * CON ĐƯỜNG XUYÊN SẢNH — chui qua sảnh lớn giữa toà Alpha rồi chạy thẳng ra
 * tới cuối đảo (nét đen người dùng vẽ trên bản đồ). Vì đường này phải THÔNG
 * suốt, hồ sen đã được dời lệch xuống dải z nhỏ hơn để không chắn ngang.
 */
export const THROUGH_ROAD = { z: 40, halfWidth: 5.5, fromX: -152, toX: -232 }

/** Sảnh xuyên qua toà Alpha: bề rộng lối chui (theo trục z) và chiều cao. */
export const ALPHA_LOBBY = { halfWidth: 5, height: 3.6 }

/** Sảnh + biển top xếp hạng đại học thế giới — ngay sau con đường. */
export const RANKING_PLAZA = { x: -116, z: 40, width: 10, depth: 30 }
export const RANKING_SIGN = { x: -116, z: 52, height: 2.1, width: 5 }

/** Hàng chữ FPT UNIVERSITY — mặt đường, ngay trước thảm cỏ dẫn vào Alpha. */
export const SIGN = { x: -127, y: 0, z: 40, rotationY: Math.PI * 0.5, scale: 1.35 }

/** Thảm cỏ + lối đi bộ + hai hàng cọ giữa hàng chữ và toà Alpha. */
export const LAWN = { x: -137, z: 40, width: 14, depth: 34 }

/** Sân trước chân toà Alpha. */
export const FORECOURT = { x: -147, z: 40, width: 6, depth: 46 }

/**
 * TOÀ ALPHA — giật cấp bậc thang 3-4-5-6-7-7-6-5-4-3, cong nhẹ ôm sân trước,
 * mặt tiền quay về phía cổng (+X). `bow` dương = cột nhô về phía trước.
 */
export const ALPHA = {
    x: -156,
    z: 40,
    columnWidth: 4,
    depth: 7,
    floorHeight: 1.35,
    columns: [
        { floors: 3, bow: 2.6 },
        { floors: 4, bow: 1.7 },
        { floors: 5, bow: 0.9 },
        { floors: 6, bow: 0.3 },
        { floors: 7, bow: 0 },
        { floors: 7, bow: 0 },
        { floors: 6, bow: 0.3 },
        { floors: 5, bow: 0.9 },
        { floors: 4, bow: 1.7 },
        { floors: 3, bow: 2.6 },
    ],
}

/**
 * HỒ SEN LỚN — sau lưng toà Alpha, đúng điểm nhận diện "toà nhà hình rồng soi
 * bóng xuống hồ". Kéo dài theo trục z như hồ thật.
 */
export const LAKE = { x: -196, z: 6, radiusX: 30, radiusZ: 21 }

/**
 * CÙ LAO GIỮA HỒ SEN — gò đất nổi giữa lòng hồ, cây mọc um tùm, đúng như ảnh
 * thật của hồ sen trường (một mảng xanh nổi giữa mặt sen).
 */
export const LAKE_ISLET = { x: -196, z: 6, radius: 9, height: 1.5 }

/** Beta bên kia hồ (soi mặt với Alpha) · Delta, Gamma phía Bắc như bản đồ. */
export const BUILDINGS = [
    { name: 'Beta', x: -200, z: 60, width: 18, depth: 9, floors: 5 },
    { name: 'Delta', x: -112, z: 4, width: 16, depth: 8, floors: 4 },
    { name: 'Gamma', x: -226, z: 56, width: 12, depth: 8, floors: 4 },
]

/**
 * 8 toà ký túc xá — hai cụm như bản đồ thật: Dom A–D cụm giữa, Dom E–H cụm
 * Tây, đều ở nửa Nam đảo, cách xa trục lễ nghi.
 */
export const DORMS = [
    { name: 'A', x: -128, z: 76 }, { name: 'B', x: -142, z: 76 },
    { name: 'C', x: -128, z: 90 }, { name: 'D', x: -142, z: 90 },
    { name: 'E', x: -172, z: 76 }, { name: 'F', x: -186, z: 76 },
    { name: 'G', x: -172, z: 90 }, { name: 'H', x: -186, z: 90 },
]

/** Tượng SELF MADE MAN — giữa vườn hai cụm ký túc xá, như ảnh thật. */
/**
 * ĐỒI THÔNG — gò đất cao trước toà Delta, trên đỉnh đặt tượng SELF MADE MAN.
 * Trời tuyết thì thông phủ trắng và người tuyết hiện ra; trời thường thì xanh.
 */
export const PINE_HILL = { x: -116, z: -16, radius: 14, height: 5.5 }

/** Tượng Self Made Man đứng trên đỉnh đồi thông. */
export const STATUE = { x: PINE_HILL.x, z: PINE_HILL.z }

/**
 * HỒ THIÊN NGA — kế bên đồi thông. Không thả sen mà thả thiên nga biết bơi,
 * biết né xe và bị tông thì bỏ chạy.
 */
export const SWAN_LAKE = { x: -146, z: -18, radiusX: 14, radiusZ: 9 }

/** Sân bóng đá giữa trường (bản đồ: 16, giữa khu). */
export const FOOTBALL = { x: -112, z: 74, width: 16, depth: 24 }

/** Sân bóng rổ — góc Bắc cạnh con đường (bản đồ: 18, góc phải sát đường). */
export const BASKETBALL = { x: -96, z: 8, width: 10, depth: 14 }

/** Sân võ nhỏ cạnh sân bóng (bản đồ: 15/17). */
export const MARTIAL = { x: -206, z: 84, width: 9, depth: 12 }

/** Nhà ăn (bản đồ: 5/6) — khối nhỏ gần cụm Dom giữa. */
export const CANTEEN = { x: -157, z: 76, width: 10, depth: 6, floors: 2 }

/** Bãi gửi xe dọc mép đường phía Bắc cổng (bản đồ: 19, mép phải). */
export const PARKING = { x: -95, z: 56, width: 6, depth: 20 }

/**
 * Điểm hồi sinh: đầu cầu phía trường, mũi xe quay vào cổng.
 * ⚠️ ĐO THỰC NGHIỆM (lần đo SẠCH, 31/7): respawn với yaw 0 rồi giữ W → xe chạy
 * về +X. Vậy mũi xe ở yaw 0 hướng +X, muốn quay vào trường (−X) thì rotation = π.
 * Lần đo trước đó cho kết quả ngược là vì bị `respawn('landing')` bất đồng bộ
 * teleport đè lên `moveTo` — đừng tin phép đo nào chạy xen giữa một respawn.
 */
export const RESPAWN = { x: -92, z: 40, rotation: Math.PI }

/** Khối "?" — dọc con đường và trục lễ nghi, lệch khỏi tim đường. */
export const QUESTION_BLOCKS = [
    { x: -96, z: 34 }, { x: -103, z: 46 }, { x: -110, z: 33 },
    { x: -118, z: 47 }, { x: -126, z: 33 }, { x: -134, z: 47 },
    { x: -142, z: 34 }, { x: -160, z: 46 }, { x: -172, z: 33 },
    { x: -186, z: 47 }, { x: -200, z: 34 }, { x: -216, z: 46 },
]

/** Bảng màu — cam/xanh lá/xanh dương theo bộ nhận diện FPT. */
export const COLORS = {
    orange: '#f37021',
    green: '#a6ce39',
    blue: '#00a3e0',
    wall: '#f4f2ec',
    windowDark: '#3b4450',
    foliage: '#5aa832',
    plazaBrick: '#b4573c',
    road: '#8f8a80',
    ground: '#c98c5a',
    grass: '#6f9e3f',
    court: '#3a7abf',      // sân bóng rổ xanh dương như ảnh bản đồ
    pitch: '#4e8f3a',
    roof: '#d8d3c7',
    trunk: '#7a5b3a',
    water: '#2f6f7a',
    bronze: '#4f3b24',     // tượng Self Made Man
    stone: '#8a8578',
}
