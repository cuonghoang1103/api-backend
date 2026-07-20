# Batch 8 — J1.S.P0010 (linear search) and J1.S.P0058 (dictionary with a file).
import re
from solkit import solution

VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Value must be between " + min + " and " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    public static String getNonEmpty(String message, String error) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }
}
'''


# ════════════════════════════════════════════════════════════════
# J1.S.P0010 — Linear search (50 LOC)
# ════════════════════════════════════════════════════════════════

P0010_BO = '''package bo;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/** Array generation and linear search. No printing. */
public class SearchManager {

    private final Random random = new Random();

    public int[] generate(int size, int bound) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = random.nextInt(bound);
        }
        return array;
    }

    /**
     * Linear search: check every element in order until the value is found.
     *
     * Returns the index of the FIRST match, or -1 when the value is absent.
     * -1 is safe here in a way it was not for a stack: an index can never
     * legitimately be negative, so the caller cannot confuse it with real data.
     */
    public int search(int[] array, int key) {
        for (int i = 0; i < array.length; i++) {
            if (array[i] == key) {
                return i;               // stop at the first hit
            }
        }
        return -1;
    }

    /**
     * Every position the value appears at.
     *
     * A random array can easily hold the same value twice, and reporting only
     * the first one then looks like the program missed something. An empty
     * list means "not present" - not an error.
     */
    public List<Integer> searchAll(int[] array, int key) {
        List<Integer> indexes = new ArrayList<>();
        for (int i = 0; i < array.length; i++) {
            if (array[i] == key) {
                indexes.add(i);
            }
        }
        return indexes;
    }
}
'''

P0010_MAIN = '''package ui;

import bo.SearchManager;
import java.util.Arrays;
import java.util.List;
import utils.Validator;

/** Screen only. */
public class Main {

    private static final int BOUND = 20;

    public static void main(String[] args) {
        SearchManager manager = new SearchManager();

        System.out.println("===== Linear Search Program =====");
        int size = Validator.getInt("Please input the number of array: ", 1, 1000);

        int[] array = manager.generate(size, BOUND);
        System.out.println("Array: " + Arrays.toString(array));

        int key = Validator.getInt("Please input the search number: ", Integer.MIN_VALUE, Integer.MAX_VALUE);

        int index = manager.search(array, key);
        if (index < 0) {
            System.out.println("Number " + key + " is not in the array.");
        } else {
            System.out.println("Number " + key + " found at index " + index + ".");
            List<Integer> all = manager.searchAll(array, key);
            if (all.size() > 1) {
                System.out.println("It appears " + all.size() + " times, at indexes " + all + ".");
            }
        }
    }
}
'''


def _p0010_check(out):
    m = re.search(r'Array: \[([^\]]*)\]', out)
    if not m:
        return False, 'expected the array to be printed'
    array = [int(x) for x in re.findall(r'-?\d+', m.group(1))]
    if len(array) != 12:
        return False, f'expected 12 elements, got {len(array)}'

    found = re.search(r'Number (-?\d+) found at index (\d+)\.', out)
    missing = re.search(r'Number (-?\d+) is not in the array\.', out)
    if found:
        key, idx = int(found.group(1)), int(found.group(2))
        if array[idx] != key:
            return False, f'reported index {idx} does not hold {key}: array[{idx}]={array[idx]}'
        if key in array[:idx]:
            return False, f'index {idx} is not the FIRST occurrence of {key}'
        listed = re.search(r'at indexes \[([^\]]*)\]', out)
        if listed:
            idxs = [int(x) for x in re.findall(r'\d+', listed.group(1))]
            if idxs != [i for i, v in enumerate(array) if v == key]:
                return False, 'the list of all positions is wrong'
    elif missing:
        key = int(missing.group(1))
        if key in array:
            return False, f'{key} IS in the array but was reported missing'
    else:
        return False, 'expected either a found or a not-found message'
    return True, ''


solution(
    'J1.S.P0010',
    title_vi='Thuật toán tìm kiếm tuyến tính',
    files=[('src/bo/SearchManager.java', P0010_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0010_MAIN)],
    main_class='ui.Main',
    runs=[
        # 12 values drawn from 0..19, so a repeat is very likely
        ('12\n7\n', _p0010_check),
        # a value that cannot be in the array
        ('12\n999\n', _p0010_check),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Generate a random array, ask for a
value, report where it is. The algorithm is trivial; the marks are in what you do about the two cases
the brief does not spell out — the value is missing, and the value appears more than once.</p>
<p><strong>Returning -1 is safe here, and it was not in the stack exercise.</strong> An index can
never legitimately be negative, so <code>-1</code> cannot be mistaken for a real answer. In the stack
exercise <code>-1</code> could have been a value someone pushed, which is why that one throws instead.
Knowing when a sentinel value is acceptable and when it is not is worth more than either rule on its
own.</p>
<p><strong>Why a second method for all the positions.</strong> The array holds 12 values drawn from
0–19, so a repeat is very likely. Reporting only the first index is correct, but a marker who can see
the same number twice in the printed array will ask about the second one. <code>searchAll</code>
answers before the question is asked, and an empty list means "absent" rather than being an error.</p>
<p><strong>Best case, worst case — the question the background section is setting up.</strong> If the
value is first, one comparison. If it is missing, all <em>n</em> comparisons: linear search cannot
know something is absent until it has looked everywhere. That is O(n), and it is why binary search
exists — but binary search would need the array sorted first, which for a single lookup costs more
than the scan you avoided.</p>
<p><strong>How this is verified despite the randomness.</strong> The test does not compare fixed text.
It reads the printed array back, then checks that the reported index really holds the value, that it
is the FIRST such index, and that the list of all positions matches every occurrence. A search that
returned a plausible-looking wrong index cannot pass.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Sinh mảng ngẫu nhiên, hỏi một giá trị, báo nó
nằm ở đâu. Thuật toán thì tầm thường; điểm nằm ở chỗ bạn xử lý hai trường hợp mà đề không nói rõ —
giá trị không có trong mảng, và giá trị xuất hiện nhiều lần.</p>
<p><strong>Trả về -1 ở đây là an toàn, còn ở bài ngăn xếp thì không.</strong> Một chỉ số không bao giờ
có thể âm một cách hợp lệ, nên <code>-1</code> không thể bị nhầm với một câu trả lời thật. Ở bài ngăn
xếp, <code>-1</code> có thể là giá trị ai đó đã push vào, nên bài đó phải ném ngoại lệ. Biết khi nào
một giá trị báo hiệu là chấp nhận được và khi nào thì không, còn giá trị hơn cả hai quy tắc cộng
lại.</p>
<p><strong>Vì sao có thêm phương thức tìm mọi vị trí.</strong> Mảng chứa 12 giá trị lấy trong khoảng
0–19, nên trùng lặp là rất dễ xảy ra. Chỉ báo vị trí đầu tiên là đúng, nhưng người chấm nhìn thấy cùng
một số xuất hiện hai lần trong mảng đã in ra sẽ hỏi về cái thứ hai. Hàm <code>searchAll</code> trả lời
trước khi bị hỏi, và một danh sách rỗng nghĩa là "không có" chứ không phải lỗi.</p>
<p><strong>Trường hợp tốt nhất, xấu nhất — chính là câu hỏi mà phần Bối cảnh đang dọn đường.</strong>
Nếu giá trị nằm đầu, chỉ một phép so sánh. Nếu không có, phải đủ <em>n</em> phép: tìm tuyến tính không
thể biết một thứ vắng mặt cho tới khi đã nhìn khắp nơi. Đó là O(n), và cũng là lý do tìm nhị phân tồn
tại — nhưng tìm nhị phân đòi mảng phải sắp trước, mà với một lần tra cứu thì việc sắp còn tốn hơn phép
duyệt bạn định né.</p>
<p><strong>Kiểm chứng thế nào khi có yếu tố ngẫu nhiên.</strong> Bài kiểm không so với văn bản cố định.
Nó đọc ngược lại mảng đã in, rồi kiểm rằng chỉ số được báo thật sự chứa giá trị đó, rằng đó là chỉ số
ĐẦU TIÊN, và rằng danh sách mọi vị trí khớp với mọi lần xuất hiện. Một phép tìm trả về chỉ số sai
nhưng trông hợp lý sẽ không thể lọt qua.</p>''',
    hints_en=[
        'Return the index of the FIRST match and stop; do not keep scanning.',
        'Handle "not found" explicitly — a marker will search for a value that is not there.',
        'A random array of 12 values from 0..19 will often repeat; decide what you report then.',
        'To test it, read your own printed array back and check array[index] really is the key.',
    ],
    hints_vi=[
        'Trả về chỉ số của lần khớp ĐẦU TIÊN rồi dừng; đừng duyệt tiếp.',
        'Xử lý rõ trường hợp "không tìm thấy" — người chấm sẽ tìm một giá trị không có trong mảng.',
        'Mảng ngẫu nhiên 12 giá trị lấy từ 0..19 rất hay bị trùng; hãy quyết định khi đó bạn báo gì.',
        'Muốn tự kiểm, hãy đọc lại chính mảng đã in và xác nhận array[index] đúng là giá trị cần tìm.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0058 — English-Vietnamese dictionary with a file (48 LOC)
# ════════════════════════════════════════════════════════════════

P0058_BO = '''package bo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * The dictionary itself: the word pairs, the rules about them, and the file
 * they live in. It never prints and never reads the keyboard.
 *
 * A LinkedHashMap rather than a HashMap: lookup by English word is instant
 * either way, but LinkedHashMap keeps the order words were added, so the file
 * on disk does not reshuffle itself every time the program runs. A file whose
 * line order changes for no reason is very hard to trust.
 */
public class DictionaryManager {

    private static final String SEPARATOR = "=";

    private final String path;
    private final Map<String, String> words = new LinkedHashMap<>();

    public DictionaryManager(String path) {
        this.path = path;
    }

    /** Lower-cased so "Cat", "cat" and "CAT" are the same entry. */
    private String key(String english) {
        return english.trim().toLowerCase();
    }

    /** false when the word is already in the dictionary - the caller reports it. */
    public boolean add(String english, String vietnamese) {
        String k = key(english);
        if (words.containsKey(k)) {
            return false;
        }
        words.put(k, vietnamese.trim());
        return true;
    }

    /** false when there was nothing to delete. */
    public boolean delete(String english) {
        return words.remove(key(english)) != null;
    }

    /** null when the word is not in the dictionary. */
    public String translate(String english) {
        return words.get(key(english));
    }

    public int size() {
        return words.size();
    }

    /** Missing file on the first run is normal, not an error. */
    public void load() throws IOException {
        File file = new File(path);
        if (!file.exists()) {
            return;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                // limit 2 so a Vietnamese meaning containing "=" survives
                String[] parts = line.split(SEPARATOR, 2);
                if (parts.length == 2) {
                    words.put(key(parts[0]), parts[1].trim());
                }
            }
        }
    }

    public void save() throws IOException {
        try (PrintWriter writer = new PrintWriter(new FileWriter(path))) {
            for (Map.Entry<String, String> entry : words.entrySet()) {
                writer.println(entry.getKey() + SEPARATOR + entry.getValue());
            }
        }
    }
}
'''

P0058_MAIN = '''package ui;

import bo.DictionaryManager;
import java.io.IOException;
import utils.Validator;

/**
 * Menu and screen.
 *
 * The dictionary is saved after every change rather than only on exit: a
 * marker who closes the window instead of choosing option 4 must not lose the
 * words they just typed.
 */
public class Main {

    private static final String FILE = "dictionary.txt";

    public static void main(String[] args) {
        DictionaryManager dictionary = new DictionaryManager(FILE);
        try {
            dictionary.load();
        } catch (IOException e) {
            System.out.println("Could not read the dictionary file: " + e.getMessage());
        }
        System.out.println("Loaded " + dictionary.size() + " word(s).");

        boolean running = true;
        while (running) {
            System.out.println("======== Dictionary program ========");
            System.out.println("1. Add Word");
            System.out.println("2. Delete Word");
            System.out.println("3. Translate");
            System.out.println("4. Exit");

            int choice = Validator.getInt("Your choice: ", 1, 4);
            switch (choice) {
                case 1:
                    add(dictionary);
                    break;
                case 2:
                    delete(dictionary);
                    break;
                case 3:
                    translate(dictionary);
                    break;
                default:
                    running = false;
                    System.out.println("Bye");
            }
        }
    }

    private static void add(DictionaryManager dictionary) {
        System.out.println("------------- Add -------------");
        String english = Validator.getNonEmpty("Enter English: ", "English word must not be empty.");
        String vietnamese = Validator.getNonEmpty("Enter Vietnamese: ", "Vietnamese word must not be empty.");
        if (dictionary.add(english, vietnamese)) {
            persist(dictionary);
            System.out.println("Added.");
        } else {
            System.out.println("The word [" + english + "] is already in the dictionary.");
        }
    }

    private static void delete(DictionaryManager dictionary) {
        System.out.println("------------ Delete ------------");
        String english = Validator.getNonEmpty("Enter English: ", "English word must not be empty.");
        if (dictionary.delete(english)) {
            persist(dictionary);
            System.out.println("Deleted.");
        } else {
            System.out.println("The word [" + english + "] is not in the dictionary.");
        }
    }

    private static void translate(DictionaryManager dictionary) {
        System.out.println("---------- Translate ----------");
        String english = Validator.getNonEmpty("Enter English: ", "English word must not be empty.");
        String vietnamese = dictionary.translate(english);
        if (vietnamese == null) {
            System.out.println("The word [" + english + "] is not in the dictionary.");
        } else {
            System.out.println(english + " = " + vietnamese);
        }
    }

    private static void persist(DictionaryManager dictionary) {
        try {
            dictionary.save();
        } catch (IOException e) {
            System.out.println("Could not save the dictionary: " + e.getMessage());
        }
    }
}
'''


def _p0058_check(out):
    for needed in ['Loaded 0 word(s).',
                   'Added.',
                   'The word [Cat] is already in the dictionary.',  # duplicate refused
                   'Cat = con meo',                                  # case-insensitive lookup
                   'cat = con meo',
                   'Deleted.',
                   'The word [Cat] is not in the dictionary.']:     # gone after delete
        if needed not in out:
            return False, f'missing from the console: {needed!r}'
    return True, ''


solution(
    'J1.S.P0058',
    title_vi='Từ điển Anh - Việt đơn giản, lưu ra tệp',
    files=[('src/bo/DictionaryManager.java', P0058_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0058_MAIN)],
    main_class='ui.Main',
    runs=[
        # add Cat, add Cat again (refused), translate Cat and cat, delete, translate again
        ('1\nCat\ncon meo\n'
         '1\nCat\nmeo khac\n'
         '3\nCat\n'
         '3\ncat\n'
         '2\nCat\n'
         '3\nCat\n'
         '4\n', _p0058_check),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> A four-option menu over a set of
word pairs that survives between runs. This is the first assignment in the track with all three of
menu, collection and file, and the shape here is the shape every management program later reuses.</p>
<p><strong>Why a Map and not a List.</strong> Every operation is "find the pair for this English
word": translate, delete, and the duplicate check when adding. That is lookup by key, which is what a
Map is for and is instant no matter how many words there are. With a List, all three would scan the
whole dictionary.</p>
<p><strong>Why LinkedHashMap specifically.</strong> A plain <code>HashMap</code> has no order at all,
so the file on disk would reshuffle its lines every time the program ran. Nothing would be lost, but a
data file whose order changes for no reason is very hard to trust and impossible to diff.
<code>LinkedHashMap</code> keeps insertion order and costs nothing extra.</p>
<p><strong>Keys are lower-cased.</strong> A dictionary in which <em>Cat</em> and <em>cat</em> are
different entries is broken. Normalising the key in one private method means every operation agrees —
add, delete and translate all call <code>key()</code>, so they cannot drift apart. The test looks up
both spellings.</p>
<p><strong>The split with a limit of 2.</strong> <code>line.split("=", 2)</code> stops after the first
separator, so a Vietnamese meaning that itself contains <code>=</code> survives the round trip.
<code>split("=")</code> without the limit would silently truncate it. This is the kind of detail that
never shows up until someone types real data.</p>
<p><strong>Saving after every change, not only on exit.</strong> A marker who closes the console
window instead of choosing option 4 must not lose the words they just added. The cost is one small
file write per operation; the benefit is that the program cannot lose data.</p>
<p><strong>The first run has no file.</strong> <code>load</code> returns quietly when the file is
absent — that is a normal first run, not an error. The test starts from an empty folder and asserts
<em>Loaded 0 word(s).</em></p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Một menu bốn mục thao tác trên tập các cặp từ,
và tập đó phải tồn tại giữa các lần chạy. Đây là bài đầu tiên trong lộ trình có đủ cả ba thứ menu,
collection và tệp, và khuôn hình ở đây chính là khuôn mà mọi chương trình quản lý sau này dùng lại.</p>
<p><strong>Vì sao dùng Map chứ không dùng List.</strong> Mọi thao tác đều là "tìm cặp ứng với từ tiếng
Anh này": dịch, xoá, và kiểm tra trùng khi thêm. Đó là tra cứu theo khoá, đúng việc của Map, và cho
kết quả tức thì bất kể từ điển có bao nhiêu từ. Nếu dùng List thì cả ba thao tác đều phải duyệt toàn
bộ.</p>
<p><strong>Vì sao lại là LinkedHashMap.</strong> <code>HashMap</code> thuần không có thứ tự nào cả, nên
tệp trên đĩa sẽ xáo lại thứ tự dòng sau mỗi lần chạy. Không mất dữ liệu, nhưng một tệp dữ liệu tự đổi
thứ tự vô cớ thì rất khó tin và không thể so sánh phiên bản. <code>LinkedHashMap</code> giữ đúng thứ
tự thêm vào mà không tốn thêm gì.</p>
<p><strong>Khoá được đưa về chữ thường.</strong> Một cuốn từ điển mà <em>Cat</em> và <em>cat</em> là
hai mục khác nhau là cuốn từ điển hỏng. Chuẩn hoá khoá trong đúng một phương thức private khiến mọi
thao tác đồng thuận — thêm, xoá và dịch đều gọi <code>key()</code> nên không thể lệch nhau. Bài kiểm
tra tra cứu cả hai cách viết.</p>
<p><strong>Phép split có giới hạn 2.</strong> <code>line.split("=", 2)</code> dừng sau dấu ngăn đầu
tiên, nên một nghĩa tiếng Việt có chứa dấu <code>=</code> vẫn sống sót qua vòng ghi-đọc.
<code>split("=")</code> không có giới hạn sẽ lặng lẽ cắt cụt nó. Đây đúng kiểu chi tiết chỉ lộ ra khi
có người gõ dữ liệu thật.</p>
<p><strong>Lưu sau mỗi thay đổi, không đợi tới lúc thoát.</strong> Người chấm đóng cửa sổ console thay
vì chọn mục 4 thì không được mất những từ vừa thêm. Cái giá là một lần ghi tệp nhỏ cho mỗi thao tác;
đổi lại là chương trình không thể làm mất dữ liệu.</p>
<p><strong>Lần chạy đầu chưa có tệp.</strong> Hàm <code>load</code> lặng lẽ trở về khi tệp không tồn
tại — đó là một lần chạy đầu bình thường, không phải lỗi. Bài kiểm bắt đầu từ thư mục trống và khẳng
định dòng <em>Loaded 0 word(s).</em></p>''',
    hints_en=[
        'Use a Map keyed by the English word: translate, delete and the duplicate check are all lookups.',
        'Lower-case the key in ONE private method so add, delete and translate cannot disagree.',
        'split("=", 2) — the limit protects a meaning that contains an equals sign.',
        'Save after every change, and let load() return quietly when the file does not exist yet.',
    ],
    hints_vi=[
        'Dùng Map với khoá là từ tiếng Anh: dịch, xoá và kiểm tra trùng đều là thao tác tra cứu.',
        'Đưa khoá về chữ thường trong ĐÚNG MỘT phương thức private để thêm, xoá và dịch không thể lệch nhau.',
        'split("=", 2) — con số giới hạn bảo vệ phần nghĩa có chứa dấu bằng.',
        'Lưu sau mỗi thay đổi, và để load() lặng lẽ trở về khi tệp chưa tồn tại.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────
from solkit import SOLUTIONS

VI8 = {
 'J1.S.P0010': '''<p><strong>Short Assignment · J1.S.P0010 · 50 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Tìm kiếm tuyến tính (hay tìm kiếm tuần tự) là phương pháp tìm một giá trị trong danh sách bằng cách
kiểm tra lần lượt từng phần tử theo thứ tự, cho tới khi gặp phần tử cần tìm.</p>
<p>Đây là thuật toán tìm kiếm đơn giản nhất. Với danh sách n phần tử, trường hợp tốt nhất là khi giá
trị cần tìm bằng phần tử đầu tiên — chỉ cần một phép so sánh. Trường hợp xấu nhất là khi giá trị không
có trong danh sách (hoặc chỉ xuất hiện đúng một lần ở cuối) — cần đủ n phép so sánh.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình cho phép người dùng nhập số phần tử của mảng. Sinh số nguyên ngẫu nhiên trong
khoảng cho trước. Sau đó cho người dùng nhập số cần tìm. Hiển thị mảng và vị trí của số cần tìm trong
mảng.</p>
<h3>Chi tiết chức năng</h3>
<ol>
<li><strong>Hiện màn hình yêu cầu nhập một số nguyên dương.</strong> Người dùng chạy chương trình,
chương trình hỏi số phần tử của mảng và số cần tìm. Nhập xong thì thực hiện Chức năng 2.</li>
<li><strong>Hiển thị vị trí tìm được.</strong> Sinh số nguyên ngẫu nhiên cho từng phần tử, hiển thị
mảng, rồi hiển thị vị trí của số cần tìm trong mảng.</li>
</ol>''',

 'J1.S.P0058': '''<p><strong>Short Assignment · J1.S.P0058 · 48 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Sinh viên được yêu cầu viết chương trình “Từ điển Anh - Việt đơn giản” với các chức năng:</p>
<ul><li>Thêm từ mới</li><li>Xoá từ</li><li>Tra từ</li><li>Thoát</li></ul>
<p>Người dùng sẽ dùng chương trình để thêm các cặp từ Anh - Việt vào tệp trên ổ đĩa; tra và hiển thị
nghĩa tiếng Việt của từ tiếng Anh nhập vào; hoặc xoá một cặp từ khỏi từ điển đang có.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện menu và yêu cầu người dùng chọn</h4>
<p>Người dùng chạy chương trình, chương trình nhắc chọn một mục. Chọn xong thì thực hiện Chức năng 2.</p>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<ul>
<li><strong>Mục 1: Thêm từ.</strong> Yêu cầu nhập một cặp từ Anh - Việt, thêm cặp đó vào từ điển
(tệp), rồi quay về màn hình chính.</li>
<li><strong>Mục 2: Xoá từ.</strong> Yêu cầu nhập từ tiếng Anh cần xoá, tìm và xoá cặp từ tương ứng
khỏi từ điển, rồi quay về màn hình chính.</li>
<li><strong>Mục 3: Tra từ.</strong> Yêu cầu nhập từ tiếng Anh, tìm cặp tương ứng và hiển thị nghĩa
tiếng Việt, rồi quay về màn hình chính.</li>
<li><strong>Mục 4:</strong> Thoát chương trình.</li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>======== Dictionary program ========
Add Word
Delete Word
Translate
Exit
Your choice:
------------- Add -------------
Enter English: Cat
Enter Vietnamese: con meo</pre>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI8:
        s['problemVi'] = VI8[s['lab']]
