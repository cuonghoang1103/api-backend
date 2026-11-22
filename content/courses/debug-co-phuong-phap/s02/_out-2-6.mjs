/** Mã + output THẬT của lab 2.6 (/tmp/dbg-lab/ch2/2-6 · OpenJDK 21.0.9 · Node v26.8.1 · Python 3.15.2), đã thoát HTML — sinh bằng script, đừng sửa tay. */
export const P = {
  O1: `$ java T1
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
	at T1.diemCuoi(T1.java:2)
	at T1.main(T1.java:3)`,
  S1: `public class T1 {
    static int diemCuoi(int[] diem) { return diem[diem.length]; }
    public static void main(String[] a) { System.out.println(diemCuoi(new int[]{7, 8, 9})); }
}`,
  O2: `$ java T2
20
21
Exception in thread "main" java.lang.IllegalArgumentException: Tuổi không hợp lệ trong hồ sơ
	at T2.docTuoi(T2.java:5)
	at T2.main(T2.java:8)
Caused by: java.lang.NumberFormatException: For input string: "hai mươi"
	at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:67)
	at java.base/java.lang.Integer.parseInt(Integer.java:662)
	at java.base/java.lang.Integer.parseInt(Integer.java:778)
	at T2.docTuoi(T2.java:4)
	... 1 more`,
  S2: `import java.util.*;
public class T2 {
    static int docTuoi(String s) {
        try { return Integer.parseInt(s.trim()); }
        catch (NumberFormatException e) { throw new IllegalArgumentException("Tuổi không hợp lệ trong hồ sơ", e); }
    }
    public static void main(String[] a) {
        for (String s : List.of("20", " 21 ", "hai mươi")) System.out.println(docTuoi(s));
    }
}`,
  O3: `$ java T3
Exception in thread "main" java.lang.ClassCastException: class java.lang.String cannot be cast to class java.lang.Integer (java.lang.String and java.lang.Integer are in module java.base of loader 'bootstrap')
	at T3.main(T3.java:6)`,
  S3: `import java.util.*;
public class T3 {
    public static void main(String[] a) {
        Map&lt;String, Object&gt; json = new HashMap&lt;&gt;();
        json.put("soLuong", "3");                    // API trả chuỗi, không phải số
        Integer soLuong = (Integer) json.get("soLuong");
        System.out.println(soLuong * 2);
    }
}`,
  O4: `$ java T4
Exception in thread "main" java.util.ConcurrentModificationException
	at java.base/java.util.ArrayList$Itr.checkForComodification(ArrayList.java:1095)
	at java.base/java.util.ArrayList$Itr.next(ArrayList.java:1049)
	at T4.main(T4.java:5)`,
  S4: `import java.util.*;
public class T4 {
    public static void main(String[] a) {
        List&lt;String&gt; ds = new ArrayList&lt;&gt;(List.of("an", "", "binh", ""));
        for (String ten : ds) if (ten.isEmpty()) ds.remove(ten);
        System.out.println(ds);
    }
}`,
  O5: `$ node t5.js
/private/tmp/dbg-lab/ch2/2-6/t5.js:2
function kichHoat(nut) { nut.onClick(); }
                             ^

TypeError: nut.onClick is not a function
    at kichHoat (/private/tmp/dbg-lab/ch2/2-6/t5.js:2:30)
    at Object.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch2/2-6/t5.js:3:1)
    at Module._compile (node:internal/modules/cjs/loader:1934:14)
    at Object..js (node:internal/modules/cjs/loader:2074:10)
    at Module.load (node:internal/modules/cjs/loader:1656:32)
    at Module._load (node:internal/modules/cjs/loader:1448:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47

Node.js v26.8.1`,
  S5: `const nutBam = { onClick: 'luu()' };          // cấu hình đọc từ JSON: chuỗi, không phải hàm
function kichHoat(nut) { nut.onClick(); }
kichHoat(nutBam);`,
  O6: `$ node t6.js
2026-11-30
/private/tmp/dbg-lab/ch2/2-6/t6.js:1
function ngayHen(chuoi) { return new Date(chuoi).toISOString().slice(0, 10); }
                                                 ^

RangeError: Invalid time value
    at Date.toISOString (&lt;anonymous&gt;)
    at ngayHen (/private/tmp/dbg-lab/ch2/2-6/t6.js:1:50)
    at Object.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch2/2-6/t6.js:3:13)
    at Module._compile (node:internal/modules/cjs/loader:1934:14)
    at Object..js (node:internal/modules/cjs/loader:2074:10)
    at Module.load (node:internal/modules/cjs/loader:1656:32)
    at Module._load (node:internal/modules/cjs/loader:1448:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47

Node.js v26.8.1`,
  S6: `function ngayHen(chuoi) { return new Date(chuoi).toISOString().slice(0, 10); }
console.log(ngayHen('2026-11-30'));
console.log(ngayHen('30/11/2026'));`,
  O7: `$ node t7.js
&lt;anonymous_script&gt;:1
{ 'cong': 18260 }
  ^

SyntaxError: Expected property name or '}' in JSON at position 2 (line 1 column 3)
    at JSON.parse (&lt;anonymous&gt;)
    at Object.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch2/2-6/t7.js:3:18)
    at Module._compile (node:internal/modules/cjs/loader:1934:14)
    at Object..js (node:internal/modules/cjs/loader:2074:10)
    at Module.load (node:internal/modules/cjs/loader:1656:32)
    at Module._load (node:internal/modules/cjs/loader:1448:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47

Node.js v26.8.1`,
  S7: `const fs = require('node:fs');
fs.writeFileSync('cfg.json', "{ 'cong': 18260 }");      // ai đó dùng nháy đơn
const cfg = JSON.parse(fs.readFileSync('cfg.json', 'utf8'));
console.log(cfg.cong);`,
  O8: `$ python3 t8.py
(9, 8, 7)
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-6/t8.py", line 5, in &lt;module&gt;
    print(top3([10, 6]))
          ~~~~^^^^^^^^^
  File "/private/tmp/dbg-lab/ch2/2-6/t8.py", line 3, in top3
    return ds[0], ds[1], ds[2]
                         ~~^^^
IndexError: list index out of range`,
  S8: `def top3(diem):
    ds = sorted(diem, reverse=True)
    return ds[0], ds[1], ds[2]
print(top3([9, 7, 8]))
print(top3([10, 6]))`,
  O9: `$ python3 t9.py
3
4
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-6/t9.py", line 3, in doc_so_luong
    return int(dong.split(",")[1])
ValueError: invalid literal for int() with base 10: 'ba'

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-6/t9.py", line 7, in &lt;module&gt;
    print(doc_so_luong(d))
          ~~~~~~~~~~~~^^^
  File "/private/tmp/dbg-lab/ch2/2-6/t9.py", line 5, in doc_so_luong
    raise RuntimeError(f"Dòng CSV sai: {dong!r}") from e
RuntimeError: Dòng CSV sai: 'DH03,ba'`,
  S9: `def doc_so_luong(dong):
    try:
        return int(dong.split(",")[1])
    except ValueError as e:
        raise RuntimeError(f"Dòng CSV sai: {dong!r}") from e
for d in ["DH01,3", "DH02, 4", "DH03,ba"]:
    print(doc_so_luong(d))`,
  O10: `$ python3 t10.py
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-6/t10.py", line 6, in &lt;module&gt;
    print(nguoi["lop"])
          ~~~~~^^^^^^^
TypeError: 'NoneType' object is not subscriptable`,
  S10: `def tim_nguoi(ds, ten):
    for n in ds:
        if n["ten"] == ten:
            return n
nguoi = tim_nguoi([{"ten": "An", "lop": "SE1801"}], "Binh")
print(nguoi["lop"])`,
};
