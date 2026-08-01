/**
 * NHÀ XE — danh mục phương tiện và vũ khí cho bảng Cài đặt.
 *
 * ─── VÌ SAO LÀ MỘT FILE DỮ LIỆU ───
 * Để thêm một chiếc xe hay một khẩu súng mới, chỉ cần THÊM MỘT MỤC vào đây:
 * đặt file `.glb` vào `static/vehicle/`, khai một dòng, xong. Không phải sờ
 * vào giao diện — `Options.setGarageButtons()` tự sinh nút từ danh sách này.
 *
 * Đây là yêu cầu user đặt ngày 1/8: "để sau mình còn làm thêm xe cộ, vũ khí".
 *
 * ─── LƯU Ý KHI THÊM XE ───
 * `VisualVehicle` tìm các bộ phận trong model theo TÊN NODE (`chassis`,
 * `wheelContainer`, `blinkerLeft`, `stopLights`…). Model ngoài không đặt tên
 * theo quy ước đó sẽ dựng lên nhưng thiếu bánh quay, thiếu đèn phanh, thiếu
 * xi-nhan — không lỗi nào cả, chỉ là xe đứng đờ. Xem `VisualVehicle.setParts()`.
 *
 * `path` KHÔNG kèm hậu tố `-compressed`: `Options` tự thêm khi bản dựng bật
 * `VITE_COMPRESSED`, y như `Game.js` đang làm với các model khác.
 */

export const VEHICLES = [
    {
        id: 'default',
        label: 'Mặc định',
        path: 'vehicle/default',
        description: 'Chiếc xe gốc của bản mẫu — nhẹ nhất (34 KB), đủ mọi bộ phận.',
    },
    {
        id: 'antenna',
        label: 'Ăng-ten',
        path: 'vehicle/defaultAntenna',
        description: 'Cùng thân xe nhưng có ăng-ten trên nóc.',
    },
    {
        id: 'oldschool',
        label: 'Cổ điển',
        path: 'vehicle/oldSchool',
        description: 'Xe cổ — chính là chiếc mà mã Konami vẫn đổi sang.',
    },
]

/**
 * Vũ khí. Hiện `VehicleRocket` tự quản hai loại này bằng `setWeaponPreference()`,
 * nên ở đây chỉ khai để bảng Cài đặt dựng nút; thêm loại mới thì phải bổ sung
 * cả nhánh xử lý trong `VehicleRocket`.
 */
export const WEAPONS = [
    { id: 'rocket', label: 'Pháo', description: 'Vòng cung thấp, bắn nhanh.' },
    { id: 'missile', label: 'Tên lửa', description: 'Bốc lên, lượn vòng rồi bổ nhào. Mạnh gấp 5, máy quay bám theo.' },
]

/** Xe mặc định khi mở game lần đầu. */
export const DEFAULT_VEHICLE = 'default'
