/** PRO192 · 1.2 — Java syntax essentials (from C to Java): Scanner, kiểu nguyên thuỷ, vòng lặp, mảng, String, phương thức static. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-1-2-stats',
  tieuDe: { en: 'Sum, min, max and average of n integers', vi: 'Tổng, nhỏ nhất, lớn nhất và trung bình của n số nguyên' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['Scanner', 'for loop', 'long vs int', 'printf / String.format'],
  moTa: {
    en: `<p>The first program of every Java course, written the Java way. Read ${c('n')} and then ${c('n')} integers (they may be spread over several lines, several per line). Print four lines:</p>
<pre>Sum: 15
Min: 1
Max: 5
Average: 3.00</pre>
<p>The average has exactly two decimals. The numbers can be as large as ±2 000 000 000, so the sum must not overflow. When ${c('n')} is 0 print only ${c('No data')}.</p>`,
    vi: `<p>Chương trình đầu tiên của mọi khoá Java, viết theo kiểu Java. Đọc ${c('n')} rồi ${c('n')} số nguyên (có thể nằm trên nhiều dòng, nhiều số một dòng). In bốn dòng:</p>
<pre>Sum: 15
Min: 1
Max: 5
Average: 3.00</pre>
<p>Trung bình có đúng hai chữ số thập phân. Các số có thể lớn tới ±2 000 000 000, nên tổng không được tràn. Khi ${c('n')} bằng 0 chỉ in ${c('No data')}.</p>`,
  },
  yeuCau: {
    en: ['Use <code>Scanner</code>; tokens may be separated by spaces or newlines.', 'Keep the sum in a <code>long</code>.', 'Print the average with <code>String.format("%.2f", …)</code> or <code>printf</code>.'],
    vi: ['Dùng <code>Scanner</code>; các số cách nhau bằng dấu cách hoặc xuống dòng.', 'Giữ tổng trong <code>long</code>.', 'In trung bình bằng <code>String.format("%.2f", …)</code> hoặc <code>printf</code>.'],
  },
  dauVao: { en: 'n (0 ≤ n ≤ 10^5), then n integers.', vi: 'n (0 ≤ n ≤ 10^5), rồi n số nguyên.' },
  dauRa: { en: 'Sum / Min / Max / Average lines, or "No data".', vi: 'Các dòng Sum / Min / Max / Average, hoặc "No data".' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        //>> // TODO: read n integers; print Sum, Min, Max, Average (2 decimals) or "No data"
        if (n == 0) {
            System.out.println("No data");
            return;
        }
        long sum = 0;
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            sum += x;
            min = Math.min(min, x);
            max = Math.max(max, x);
        }
        System.out.println("Sum: " + sum);
        System.out.println("Min: " + min);
        System.out.println("Max: " + max);
        System.out.println(String.format("Average: %.2f", (double) sum / n));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'five numbers on one line', vi: 'năm số trên một dòng' }, vao: '5\n3 1 4 5 2\n' },
    { ten: { en: 'negative numbers over several lines', vi: 'số âm trên nhiều dòng' }, vao: '4\n-7\n-2 -9\n-3\n' },
    { ten: { en: 'n = 0', vi: 'n = 0' }, vao: '0\n', an: true },
    { ten: { en: 'a sum that overflows int', vi: 'tổng tràn int' }, vao: '3\n2000000000 2000000000 1999999999\n', an: true },
    { ten: { en: 'one number, non-terminating average', vi: 'một số; trung bình chia lẻ' }, vao: '3\n1 1 2\n', an: true },
  ],
  goiY: [
    { en: 'Start min at Integer.MAX_VALUE and max at Integer.MIN_VALUE (or at the first number) so any input replaces them.', vi: 'Khởi tạo min = Integer.MAX_VALUE, max = Integer.MIN_VALUE (hoặc bằng số đầu tiên) để số nào cũng thay được.' },
    { en: '(double) sum / n — cast BEFORE dividing; sum / n on two integers drops the decimals.', vi: '(double) sum / n — ép kiểu TRƯỚC khi chia; sum / n trên hai số nguyên mất phần lẻ.' },
  ],
  loiHayGap: [
    { en: 'int sum — 2 000 000 000 + 2 000 000 000 wraps around to a negative number.', vi: 'int sum — 2 000 000 000 + 2 000 000 000 bị tràn thành số âm.' },
    { en: 'Starting max at 0: with only negative numbers the "maximum" stays 0.', vi: 'Khởi tạo max = 0: khi toàn số âm thì "lớn nhất" vẫn là 0.' },
    { en: '(double) (sum / n) casts after the integer division — 4/3 already became 1.', vi: '(double) (sum / n) ép kiểu sau phép chia nguyên — 4/3 đã thành 1.' },
  ],
  giaiThich: { en: '<p><code>Scanner.nextInt()</code> skips spaces and newlines, so the layout of the input does not matter. <code>long</code> holds the sum safely, <code>Math.min/max</code> keep the extremes, and the cast to <code>double</code> happens before the division.</p>', vi: '<p><code>Scanner.nextInt()</code> bỏ qua dấu cách và xuống dòng, nên cách xếp số trong input không quan trọng. <code>long</code> giữ tổng an toàn, <code>Math.min/max</code> giữ giá trị cực trị, và ép sang <code>double</code> xảy ra trước phép chia.</p>' },
});

const de2 = deJava({
  id: 'pro192-1-2-chars',
  tieuDe: { en: 'Classify the characters of a line', vi: 'Phân loại ký tự của một dòng' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['String', 'char', 'Character methods', 'nextLine'],
  moTa: {
    en: `<p>In C a string is a ${c('char[]')} ending with ${c("'\\0'")}; in Java it is an object with ${c('length()')} and ${c('charAt(i)')}. Read <b>one whole line</b> (it may contain spaces, or be empty) and print:</p>
<pre>Letters: 10
Vowels: 3
Digits: 4
Spaces: 2
Others: 1
Upper: HELLO WORLD 2026!</pre>
<p>Vowels are a, e, i, o, u in either case (they are also counted as letters). ${c('Upper')} is the line in upper case.</p>`,
    vi: `<p>Trong C chuỗi là ${c('char[]')} kết thúc bằng ${c("'\\0'")}; trong Java nó là đối tượng có ${c('length()')} và ${c('charAt(i)')}. Đọc <b>nguyên một dòng</b> (có thể có dấu cách, hoặc rỗng) và in:</p>
<pre>Letters: 10
Vowels: 3
Digits: 4
Spaces: 2
Others: 1
Upper: HELLO WORLD 2026!</pre>
<p>Nguyên âm là a, e, i, o, u, hoa hay thường đều tính (chúng cũng được đếm là chữ cái). ${c('Upper')} là dòng đã viết hoa.</p>`,
  },
  yeuCau: {
    en: ['Read with <code>nextLine()</code> — <code>next()</code> stops at the first space.', 'Use <code>Character.isLetter</code>, <code>isDigit</code>, <code>isWhitespace</code>.'],
    vi: ['Đọc bằng <code>nextLine()</code> — <code>next()</code> dừng ở dấu cách đầu tiên.', 'Dùng <code>Character.isLetter</code>, <code>isDigit</code>, <code>isWhitespace</code>.'],
  },
  dauVao: { en: 'One line of ASCII text (possibly empty).', vi: 'Một dòng chữ ASCII (có thể rỗng).' },
  dauRa: { en: 'Six lines as shown.', vi: 'Sáu dòng như mẫu.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.hasNextLine() ? sc.nextLine() : "";
        int letters = 0, vowels = 0, digits = 0, spaces = 0, others = 0;
        //>> // TODO: count with a loop over line.charAt(i)
        for (int i = 0; i < line.length(); i++) {
            char ch = line.charAt(i);
            if (Character.isLetter(ch)) {
                letters++;
                if ("aeiouAEIOU".indexOf(ch) >= 0) {
                    vowels++;
                }
            } else if (Character.isDigit(ch)) {
                digits++;
            } else if (Character.isWhitespace(ch)) {
                spaces++;
            } else {
                others++;
            }
        }
        //<<
        System.out.println("Letters: " + letters);
        System.out.println("Vowels: " + vowels);
        System.out.println("Digits: " + digits);
        System.out.println("Spaces: " + spaces);
        System.out.println("Others: " + others);
        //>> System.out.println("Upper: " + line);
        System.out.println("Upper: " + line.toUpperCase());
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'letters, digits, spaces, a symbol', vi: 'chữ, số, dấu cách, một ký hiệu' }, vao: 'Hello World 2026!\n' },
    { ten: { en: 'upper-case vowels count too', vi: 'nguyên âm viết hoa cũng tính' }, vao: 'AEIOU xyz, 42 #PRO192\n' },
    { ten: { en: 'an empty line', vi: 'dòng rỗng' }, vao: '\n', an: true },
    { ten: { en: 'leading and trailing spaces', vi: 'dấu cách đầu và cuối' }, vao: '   a1 b2   \n', an: true },
  ],
  goiY: [
    { en: 'for (int i = 0; i < line.length(); i++) { char ch = line.charAt(i); … } — length() is a method, with parentheses.', vi: 'for (int i = 0; i < line.length(); i++) { char ch = line.charAt(i); … } — length() là phương thức, có ngoặc.' },
    { en: '"aeiouAEIOU".indexOf(ch) >= 0 tells you whether ch is a vowel in one call.', vi: '"aeiouAEIOU".indexOf(ch) >= 0 cho biết ch có phải nguyên âm chỉ bằng một lời gọi.' },
  ],
  loiHayGap: [
    { en: 'Reading with next() — only the first word is read and every count is wrong.', vi: 'Đọc bằng next() — chỉ đọc được từ đầu tiên, mọi số đếm đều sai.' },
    { en: 'Calling line.toUpperCase() without using its result — Strings are immutable, the method returns a NEW string.', vi: 'Gọi line.toUpperCase() mà không dùng kết quả — String bất biến, phương thức trả về chuỗi MỚI.' },
    { en: 'Counting vowels only in lower case.', vi: 'Chỉ đếm nguyên âm chữ thường.' },
  ],
  giaiThich: { en: '<p>One pass over the characters with an if/else-if chain puts every character in exactly one bucket (a vowel is also a letter, so it is counted inside the letter branch). <code>toUpperCase()</code> returns a new String — the original is unchanged.</p>', vi: '<p>Một lượt duyệt ký tự với chuỗi if/else-if đặt mỗi ký tự vào đúng một nhóm (nguyên âm cũng là chữ cái nên được đếm bên trong nhánh chữ cái). <code>toUpperCase()</code> trả về String mới — chuỗi gốc không đổi.</p>' },
});

const de3 = deJava({
  id: 'pro192-1-2-primes',
  tieuDe: { en: 'A static method: primes in a range', vi: 'Phương thức static: số nguyên tố trong một khoảng' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['static method', 'boolean', 'loop to sqrt(n)', 'StringBuilder'],
  moTa: {
    en: `<p>Write ${c('static boolean isPrime(int n)')} in ${c('Main')} (no object needed yet — a static method belongs to the class, like a C function). Then read ${c('a b')} and print all primes in ${c('[a, b]')} on one line separated by single spaces, then their count:</p>
<pre>2 3 5 7
Count: 4</pre>
<p>If ${c('a > b')} swap them first. When there is no prime print ${c('none')} on the first line. Numbers below 2 are not prime. Ranges go up to 10<sup>6</sup>, so test divisors only up to √n.</p>`,
    vi: `<p>Viết ${c('static boolean isPrime(int n)')} trong ${c('Main')} (chưa cần đối tượng — phương thức static thuộc về lớp, giống hàm trong C). Rồi đọc ${c('a b')} và in mọi số nguyên tố trong ${c('[a, b]')} trên một dòng, cách nhau một dấu cách, rồi số lượng:</p>
<pre>2 3 5 7
Count: 4</pre>
<p>Nếu ${c('a > b')} thì đổi chỗ trước. Không có số nào thì dòng đầu in ${c('none')}. Số nhỏ hơn 2 không phải số nguyên tố. Khoảng lên tới 10<sup>6</sup>, nên chỉ thử ước tới √n.</p>`,
  },
  yeuCau: {
    en: ['<code>isPrime</code> is a <code>static</code> method with the exact signature above.', 'Build the line with a <code>StringBuilder</code> (no trailing space).'],
    vi: ['<code>isPrime</code> là phương thức <code>static</code> đúng chữ ký trên.', 'Dựng dòng bằng <code>StringBuilder</code> (không dư dấu cách cuối).'],
  },
  dauVao: { en: 'Two integers a b (−10^6 ≤ a, b ≤ 10^6).', vi: 'Hai số nguyên a b (−10^6 ≤ a, b ≤ 10^6).' },
  dauRa: { en: 'The primes (or "none"), then "Count: k".', vi: 'Các số nguyên tố (hoặc "none"), rồi "Count: k".' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.Scanner;

public class Main {
    static boolean isPrime(int n) {
        //>> return false; // TODO: n < 2 is not prime; try divisors d while d * d <= n
        if (n < 2) {
            return false;
        }
        for (int d = 2; (long) d * d <= n; d++) {
            if (n % d == 0) {
                return false;
            }
        }
        return true;
        //<<
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        //>> // TODO: swap if a > b, collect the primes in [a, b], print them and the count
        if (a > b) {
            int t = a;
            a = b;
            b = t;
        }
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (int x = a; x <= b; x++) {
            if (isPrime(x)) {
                if (count > 0) {
                    sb.append(' ');
                }
                sb.append(x);
                count++;
            }
        }
        System.out.println(count == 0 ? "none" : sb.toString());
        System.out.println("Count: " + count);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: '1..10', vi: '1..10' }, vao: '1 10\n' },
    { ten: { en: 'reversed bounds', vi: 'cận bị đảo' }, vao: '30 20\n' },
    { ten: { en: 'no prime (24..28)', vi: 'không có số nguyên tố (24..28)' }, vao: '24 28\n', an: true },
    { ten: { en: 'negative bounds and 2', vi: 'cận âm và số 2' }, vao: '-5 2\n', an: true },
    { ten: { en: 'near one million (speed)', vi: 'gần một triệu (tốc độ)' }, vao: '999900 1000000\n', an: true },
  ],
  goiY: [
    { en: 'A divisor larger than √n would pair with one smaller than √n, so the loop can stop when d * d > n.', vi: 'Một ước lớn hơn √n luôn đi cặp với một ước nhỏ hơn √n, nên vòng lặp dừng khi d * d > n.' },
    { en: 'Append the separator BEFORE every number except the first: if (count > 0) sb.append(\' \').', vi: 'Thêm dấu cách TRƯỚC mỗi số trừ số đầu: if (count > 0) sb.append(\' \').' },
  ],
  loiHayGap: [
    { en: 'Saying 1 (or 0, or a negative number) is prime — the loop never runs and the method returns true.', vi: 'Coi 1 (hoặc 0, số âm) là số nguyên tố — vòng lặp không chạy và hàm trả true.' },
    { en: 'Forgetting to swap a and b — the loop from 30 to 20 never runs.', vi: 'Quên đổi chỗ a và b — vòng lặp từ 30 tới 20 không chạy lần nào.' },
    { en: 'Trailing space after the last prime (sb.append(x).append(\' \')).', vi: 'Dư dấu cách sau số cuối (sb.append(x).append(\' \')).' },
  ],
  giaiThich: { en: '<p><code>isPrime</code> rejects n &lt; 2, then tries divisors up to √n (written <code>d * d &lt;= n</code> to avoid floating point). The main loop swaps the bounds when needed and joins the primes with a separator added before each one except the first.</p>', vi: '<p><code>isPrime</code> loại n &lt; 2, rồi thử ước tới √n (viết <code>d * d &lt;= n</code> để tránh số thực). Vòng lặp chính đổi cận khi cần và nối các số bằng dấu cách thêm trước mỗi số trừ số đầu.</p>' },
});

const de4 = deJava({
  id: 'pro192-1-2-array',
  tieuDe: { en: 'Arrays in Java: reverse, second largest, frequency', vi: 'Mảng trong Java: đảo ngược, lớn thứ hai, tần suất' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['int[]', 'array.length', 'enhanced for', 'Arrays.toString'],
  moTa: {
    en: `<p>A Java array knows its own length (${c('a.length')}) and is checked: ${c('a[a.length]')} throws instead of reading garbage like C. Read ${c('n')} and ${c('n')} integers into an ${c('int[]')}, then print:</p>
<pre>Reversed: [5, 4, 3, 3, 1]
Second largest: 4
Most frequent: 3 (2 times)</pre>
<ul><li>${c('Reversed')}: the array reversed <b>in place</b> (swap a[i] with a[n-1-i]), printed with ${c('Arrays.toString')}.</li>
<li>${c('Second largest')}: the largest value strictly smaller than the maximum, or ${c('none')} if all values are equal.</li>
<li>${c('Most frequent')}: the value with the highest count; on a tie the <b>smallest</b> value.</li></ul>`,
    vi: `<p>Mảng Java tự biết độ dài (${c('a.length')}) và được kiểm tra: ${c('a[a.length]')} ném ngoại lệ thay vì đọc rác như C. Đọc ${c('n')} và ${c('n')} số nguyên vào ${c('int[]')}, rồi in:</p>
<pre>Reversed: [5, 4, 3, 3, 1]
Second largest: 4
Most frequent: 3 (2 times)</pre>
<ul><li>${c('Reversed')}: mảng đảo <b>tại chỗ</b> (đổi a[i] với a[n-1-i]), in bằng ${c('Arrays.toString')}.</li>
<li>${c('Second largest')}: giá trị lớn nhất nhưng NHỎ HƠN HẲN giá trị lớn nhất, hoặc ${c('none')} nếu mọi giá trị bằng nhau.</li>
<li>${c('Most frequent')}: giá trị xuất hiện nhiều nhất; hoà thì lấy giá trị <b>nhỏ nhất</b>.</li></ul>`,
  },
  yeuCau: {
    en: ['Write three static methods: <code>reverse(int[] a)</code>, <code>secondLargest(int[] a)</code> (returns <code>Integer</code>, null = none), <code>mostFrequent(int[] a)</code>.', 'n ≥ 1.'],
    vi: ['Viết ba phương thức static: <code>reverse(int[] a)</code>, <code>secondLargest(int[] a)</code> (trả <code>Integer</code>, null = không có), <code>mostFrequent(int[] a)</code>.', 'n ≥ 1.'],
  },
  dauVao: { en: 'n (1 ≤ n ≤ 1000), then n integers.', vi: 'n (1 ≤ n ≤ 1000), rồi n số nguyên.' },
  dauRa: { en: 'Three lines as shown.', vi: 'Ba dòng như mẫu.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    static void reverse(int[] a) {
        //>> // TODO: swap a[i] and a[a.length - 1 - i] for the first half
        for (int i = 0; i < a.length / 2; i++) {
            int t = a[i];
            a[i] = a[a.length - 1 - i];
            a[a.length - 1 - i] = t;
        }
        //<<
    }

    static Integer secondLargest(int[] a) {
        //>> return null; // TODO: the largest value strictly below the maximum, or null
        int max = Integer.MIN_VALUE;
        for (int x : a) {
            max = Math.max(max, x);
        }
        Integer second = null;
        for (int x : a) {
            if (x < max && (second == null || x > second)) {
                second = x;
            }
        }
        return second;
        //<<
    }

    static int mostFrequent(int[] a) {
        //>> return a[0]; // TODO: highest count; on a tie the smallest value
        int best = a[0];
        int bestCount = 0;
        for (int x : a) {
            int count = 0;
            for (int y : a) {
                if (y == x) {
                    count++;
                }
            }
            if (count > bestCount || (count == bestCount && x < best)) {
                best = x;
                bestCount = count;
            }
        }
        return best;
        //<<
    }

    static int countOf(int[] a, int v) {
        int count = 0;
        for (int x : a) {
            if (x == v) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
        }
        reverse(a);
        System.out.println("Reversed: " + Arrays.toString(a));
        Integer second = secondLargest(a);
        System.out.println("Second largest: " + (second == null ? "none" : second));
        int f = mostFrequent(a);
        System.out.println("Most frequent: " + f + " (" + countOf(a, f) + " times)");
    }
}
`,
  },
  ca: [
    { ten: { en: 'a duplicate value', vi: 'có giá trị lặp' }, vao: '5\n1 3 3 4 5\n' },
    { ten: { en: 'all values equal', vi: 'mọi giá trị bằng nhau' }, vao: '3\n7 7 7\n' },
    { ten: { en: 'tie on frequency keeps the smallest', vi: 'hoà tần suất lấy giá trị nhỏ nhất' }, vao: '6\n9 2 9 2 5 -1\n', an: true },
    { ten: { en: 'a single element', vi: 'một phần tử' }, vao: '1\n-4\n', an: true },
    { ten: { en: 'maximum repeated, negatives', vi: 'giá trị lớn nhất lặp, số âm' }, vao: '7\n-3 -1 -1 -8 -1 -3 -2\n', an: true },
  ],
  goiY: [
    { en: 'Reverse: loop i from 0 to a.length / 2 (exclusive) — going to a.length swaps every pair twice and restores the original.', vi: 'Đảo: lặp i từ 0 tới a.length / 2 (không gồm) — lặp tới a.length sẽ đổi mỗi cặp hai lần và trả lại như cũ.' },
    { en: 'Second largest: first find the max, then the largest x with x < max; an Integer that stays null means "none".', vi: 'Lớn thứ hai: tìm max trước, rồi x lớn nhất mà x < max; Integer còn null nghĩa là "không có".' },
  ],
  loiHayGap: [
    { en: 'Taking the second element after sorting as the "second largest" — with [5, 5, 4] that gives 5.', vi: 'Lấy phần tử thứ hai sau khi sắp xếp làm "lớn thứ hai" — với [5, 5, 4] ra 5.' },
    { en: 'Printing the array with System.out.println(a) — it prints something like [I@1b6d3586 (the reference), not the values.', vi: 'In mảng bằng System.out.println(a) — nó in kiểu [I@1b6d3586 (tham chiếu), không phải các giá trị.' },
    { en: 'Using > only in the frequency comparison and scanning in input order — the tie goes to the first value seen, not the smallest.', vi: 'Chỉ dùng > khi so tần suất và duyệt theo thứ tự nhập — hoà thì giá trị gặp trước thắng, không phải giá trị nhỏ nhất.' },
  ],
  giaiThich: { en: '<p>The array is passed by reference, so <code>reverse</code> changes the caller’s array. <code>secondLargest</code> returns <code>Integer</code> so that <code>null</code> can mean "none" — a primitive <code>int</code> has no such value. The O(n²) frequency count is fine for n ≤ 1000.</p>', vi: '<p>Mảng được truyền theo tham chiếu, nên <code>reverse</code> đổi chính mảng của nơi gọi. <code>secondLargest</code> trả <code>Integer</code> để <code>null</code> nghĩa là "không có" — <code>int</code> nguyên thuỷ không có giá trị như vậy. Đếm tần suất O(n²) đủ nhanh với n ≤ 1000.</p>' },
});

export default moDun({ slug: 'pro192-1-2-cu-phap-java', ten: '1.2 Java syntax essentials (from C to Java)', de: [de1, de2, de3, de4] });
