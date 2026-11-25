// motep.swift — "ứng dụng văng mỗi khi mở tệp" (bài 6.2): đọc tệp cấu hình, lấy dòng "cong=" rồi ép kiểu bằng "!".
// Dịch: swiftc -g -o motep motep.swift    Chạy: ./motep tot.txt (chạy được) · ./motep hong.txt (văng)
import Foundation
import os

let log = Logger(subsystem: "com.example.motep", category: "config")
let duong = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "cauhinh.txt"
log.notice("Mở tệp cấu hình \(duong, privacy: .public)")
let noiDung = try! String(contentsOfFile: duong, encoding: .utf8)
let dong = noiDung.split(separator: "\n").first { $0.hasPrefix("cong=") } ?? "cong="
let cong = Int(dong.dropFirst(5))!          // "cong=80 80" ⇒ Int(...) = nil ⇒ "!" làm văng
log.notice("Lắng nghe cổng \(cong, privacy: .public)")
print("motep: cổng", cong)
