/**
 * CSD201 · khối Java dùng chung cho các đề cấu trúc dữ liệu (không phải module — tên bắt đầu bằng _).
 * lopKiem(): lớp kiểm chạy theo LỆNH (mỗi dòng stdin một lệnh) — in "lệnh -> kết quả | trạng thái" sau mỗi lệnh, trạng thái
 * đọc từ CHÍNH các liên kết của cấu trúc người học dựng (Kiem.don / kep / vong / cay…), ngoại lệ được in thay vì làm sập.
 */
import { j } from './_chung.mjs';

/**
 * @param {object} o
 *   truoc   — câu lệnh Java chạy trước vòng lặp (tạo đối tượng…)
 *   lenh    — thân xử lý một dòng: có sẵn String line, String[] p, hàm n(i) = Integer.parseInt(p[i]); gán String r
 *   trangThai — biểu thức Java (String) in sau " | " ở mỗi dòng (bỏ trống = không in)
 *   them    — phương thức static thêm vào lớp
 *   imports — dòng import thêm
 */
export function lopKiem({ truoc = '', lenh, trangThai = '', them = '', imports = '' }) {
  return j`
import java.util.*;
${imports}
// Grader test class (do not edit): one command per input line; after each command it prints the result and the
// state read from the REAL links of your structure (Kiem follows the fields node by node).
public class KiemTra {
    static String[] p;

    static int n(int i) {
        return Integer.parseInt(p[i]);
    }
${them}
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${truoc}
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            p = line.split("\\s+");
            String r = "ok";
            try {
${lenh}
            } catch (RuntimeException e) {
                r = "THROWS " + Kiem.ten(e);
            }
            System.out.println(line + " -> " + r${trangThai ? ` + " | " + ${trangThai}` : ''});
        }
    }
}
`;
}
