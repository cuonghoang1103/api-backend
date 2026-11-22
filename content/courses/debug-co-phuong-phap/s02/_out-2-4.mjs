/** Output THẬT của bài 2.4 (Python 3.15.2, /tmp/dbg-lab/ch2/2-4/o1–o5.txt), đã thoát HTML — sinh bằng script, đừng sửa tay. */
export const P = {
  P1: `$ python3 diem_danh.py SE1899
SE1801: 0.1
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/diem_danh.py", line 17, in &lt;module&gt;
    print(sys.argv[1] + ":", ty_le_vang(3, cfg, sys.argv[1]))
                             ~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^
  File "/private/tmp/dbg-lab/ch2/2-4/diem_danh.py", line 11, in ty_le_vang
    return so_vang / lay_si_so(cau_hinh, lop)
                     ~~~~~~~~~^^^^^^^^^^^^^^^
  File "/private/tmp/dbg-lab/ch2/2-4/diem_danh.py", line 8, in lay_si_so
    return cau_hinh["lop"][lop]["si_so"]
           ~~~~~~~~~~~~~~~^^^^^
KeyError: 'SE1899'`,
  P2: `$ python3 diem_danh.py SE1802
SE1801: 0.1
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/diem_danh.py", line 17, in &lt;module&gt;
    print(sys.argv[1] + ":", ty_le_vang(3, cfg, sys.argv[1]))
                             ~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^
  File "/private/tmp/dbg-lab/ch2/2-4/diem_danh.py", line 11, in ty_le_vang
    return so_vang / lay_si_so(cau_hinh, lop)
           ~~~~~~~~^~~~~~~~~~~~~~~~~~~~~~~~~~
ZeroDivisionError: division by zero`,
  P3: `$ python3 chuoi_loi.py ngam
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/chuoi_loi.py", line 8, in nap_ngam
    return json.load(open(duong_dan, encoding="utf-8"))
                     ~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
FileNotFoundError: [Errno 2] No such file or directory: 'khong-co.json'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/chuoi_loi.py", line 20, in &lt;module&gt;
    nap_ngam("khong-co.json")
    ~~~~~~~~^^^^^^^^^^^^^^^^^
  File "/private/tmp/dbg-lab/ch2/2-4/chuoi_loi.py", line 10, in nap_ngam
    print("Không thấy " + duong_dan + ", dùng mặc định: " + MAC_DINH)   # MAC_DINH chưa định nghĩa
                                                            ^^^^^^^^
NameError: name 'MAC_DINH' is not defined`,
  P4: `$ python3 chuoi_loi.py ro
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/chuoi_loi.py", line 14, in nap_ro
    return json.load(open(duong_dan, encoding="utf-8"))
           ~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/homebrew/Cellar/python@3.15/3.15.2/Frameworks/Python.framework/Versions/3.15/lib/python3.15/json/__init__.py", line 306, in load
    return loads(fp.read(),
        cls=cls, object_hook=object_hook,
        parse_float=parse_float, parse_int=parse_int,
        parse_constant=parse_constant, object_pairs_hook=object_pairs_hook,
        array_hook=array_hook, **kw)
  File "/opt/homebrew/Cellar/python@3.15/3.15.2/Frameworks/Python.framework/Versions/3.15/lib/python3.15/json/__init__.py", line 371, in loads
    return _default_decoder.decode(s)
           ~~~~~~~~~~~~~~~~~~~~~~~^^^
  File "/opt/homebrew/Cellar/python@3.15/3.15.2/Frameworks/Python.framework/Versions/3.15/lib/python3.15/json/decoder.py", line 358, in decode
    obj, end = self.raw_decode(s, idx=_w(s, 0).end())
               ~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/homebrew/Cellar/python@3.15/3.15.2/Frameworks/Python.framework/Versions/3.15/lib/python3.15/json/decoder.py", line 374, in raw_decode
    obj, end = self.scan_once(s, idx)
               ~~~~~~~~~~~~~~^^^^^^^^
json.decoder.JSONDecodeError: Illegal trailing comma before end of object: line 1 column 33 (char 32)

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/chuoi_loi.py", line 22, in &lt;module&gt;
    nap_ro("hong.json")
    ~~~~~~^^^^^^^^^^^^^
  File "/private/tmp/dbg-lab/ch2/2-4/chuoi_loi.py", line 16, in nap_ro
    raise LoiCauHinh(f"Tệp cấu hình {duong_dan} hỏng") from e
LoiCauHinh: Tệp cấu hình hong.json hỏng`,
  P5: `$ python3 loi_attr.py
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/loi_attr.py", line 2, in &lt;module&gt;
    ds.push("chi")
    ^^^^^^^
AttributeError: 'list' object has no attribute 'push'. Did you mean '.append'?
$ python3 loi_type.py
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/loi_type.py", line 2, in &lt;module&gt;
    print("Tuổi: " + tuoi)
          ~~~~~~~~~^~~~~~
TypeError: can only concatenate str (not "int") to str
$ python3 loi_dict.py
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/ch2/2-4/loi_dict.py", line 2, in &lt;module&gt;
    print(nguoi_dung.ten)
          ^^^^^^^^^^^^^^
AttributeError: 'dict' object has no attribute 'ten'`,
};
