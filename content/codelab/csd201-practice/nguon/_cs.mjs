/**
 * CSD201 · khuôn đề ⭐ Chuyên sâu (CS.1–CS.10) — không phải module (tên bắt đầu bằng _).
 * Đề kiểu phỏng vấn: người học viết MỘT lớp với các hàm static; lớp kiểm KiemTra chạy theo lệnh:
 *   RUN …    — gọi hàm với dữ liệu trên dòng, in kết quả (mảng viết liền "1,2,3", "-" = mảng rỗng);
 *   RANDOM   — so với lời giải vét cạn (nằm trong lớp kiểm) trên hàng nghìn đầu vào ngẫu nhiên có hạt giống cố định,
 *              in "all N agree" hoặc ca SAI ĐẦU TIÊN (đầu vào, kết quả của bạn, kết quả đúng) — y như các chương trình
 *              Ex*.java của gen/java/csN tự kiểm PASS/FAIL;
 *   PERF     — ⏱ kiểm độ phức tạp (Kiem.hen).
 * Nguồn lời giải + vét cạn: ~/Documents/FLM-nguon/_repo/CSD201/gen/java/csN/Ex*.java (CHỈ ĐỌC).
 */
import { deJava } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

export const UTIL = `
    static int[] arr(String s) {
        if (s.equals("-")) {
            return new int[0];
        }
        String[] t = s.split(",");
        int[] a = new int[t.length];
        for (int i = 0; i < t.length; i++) {
            a[i] = Integer.parseInt(t[i].trim());
        }
        return a;
    }

    static String str(int[] a) {
        return Arrays.toString(a);
    }

    static String ketQua(String label, int n, String sai) {
        return sai == null ? label + ": all " + n + " agree with the brute force" : label + ": MISMATCH " + sai;
    }
`;

const DAU_VAO = {
  en: 'One command per line: RUN with the data written on the line (arrays as 1,2,3 without spaces, - for an empty array), RANDOM, PERF.',
  vi: 'Mỗi dòng một lệnh: RUN kèm dữ liệu trên dòng (mảng viết 1,2,3 không dấu cách, - là mảng rỗng), RANDOM, PERF.',
};
const DAU_RA = {
  en: 'The answer of each RUN. RANDOM compares your method with a slow brute force (inside the grader) on thousands of random inputs and prints the first mismatch; PERF is the complexity check.',
  vi: 'Đáp án của mỗi RUN. RANDOM so hàm của bạn với lời giải vét cạn chậm (nằm trong máy chấm) trên hàng nghìn đầu vào ngẫu nhiên và in ca sai đầu tiên; PERF là phép kiểm độ phức tạp.',
};

/** s = spec của deJava + { them, lenh, truoc, imports } cho lớp kiểm. */
export function deCs(s) {
  const { them = '', lenh, truoc = '', imports = '', ...rest } = s;
  return deJava({
    ...rest,
    main: 'KiemTra',
    the: ['interview', 'advanced', ...(s.the || [])],
    dauVao: s.dauVao || DAU_VAO,
    dauRa: s.dauRa || DAU_RA,
    harness: { 'KiemTra.java': lopKiem({ them: UTIL + them, lenh, truoc, imports }) },
  });
}
