// shopmac.swift — ứng dụng dòng lệnh thử của bài 6.1/6.4: ghi log bằng Logger (framework os) có subsystem + category.
// Dịch: swiftc -O -o shopmac shopmac.swift    Chạy: ./shopmac khach@example.com
import Foundation
import os

let mang = Logger(subsystem: "com.example.shopmac", category: "network")
let csdl = Logger(subsystem: "com.example.shopmac", category: "db")

let email = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "chua-nhap"   // giá trị lúc CHẠY
let emailCoDinh = "hotro@example.com"                                                   // hằng số viết sẵn trong mã
let maDon = 1042

mang.info("Bắt đầu đồng bộ đơn hàng")
mang.debug("Gọi GET /api/orders?since=\(maDon, privacy: .public)")
mang.notice("Đăng nhập: email=\(email) mã đơn=\(maDon, privacy: .public)")
mang.notice("Liên hệ hỗ trợ: \(emailCoDinh)")
mang.notice("Liên hệ hỗ trợ (đánh dấu private): \(emailCoDinh, privacy: .private)")
mang.error("Hết thời gian chờ sau \(30, privacy: .public) s tới api.example.com")
csdl.error("Mở CSDL thất bại: \("disk I/O error", privacy: .public)")
csdl.fault("Tệp CSDL hỏng, mã \(11, privacy: .public)")
mang.log("Token = \("GIA_TOKEN·VIDU", privacy: .private(mask: .hash))")
print("shopmac: xong")
