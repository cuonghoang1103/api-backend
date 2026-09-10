#!/usr/bin/env python3
"""
============================================================
ĐỀ NÊU TÊN PHƯƠNG THỨC NÀO, LỜI GIẢI PHẢI CÓ ĐÚNG TÊN ĐÓ
============================================================

Người chấm dò theo TÊN. Một bài chạy đúng, in đúng, mà đặt tên `add` trong khi
đề viết `addWord` thì ô đối chiếu trong phiếu chấm không tích được — và `javac`
lẫn `solkit.verify_all()` đều không nói gì, vì cả hai chỉ biết chương trình chạy
ra cái gì, không biết đề đòi gọi nó là gì.

Đã lọt lưới HAI lần trước khi có file này:
  · P0068  đề viết `List<Student> sortStudent(...)`, lời giải khai `void`
  · P0058  đề viết `addWord`/`removeWord`/`loadData`/`updateDatabase`,
           lời giải đặt `add`/`delete`/`load`/`save` — bốn cái một lúc

Chạy:  python3 solutions/khopchuky.py        (từ docs/codelab-authoring/lab211)
"""
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

# Chữ ký trong đề, dạng `public boolean addWord (String eng, String vi)`.
# Đề FPTU gõ tay nên có bài chèn dấu cách vào giữa tên và ngoặc, và có bài viết
# `add Doctor` tách đôi — nên mẫu ở đây rộng, còn phần so thì chuẩn hoá lại.
CHU_KY = re.compile(
    r'\bpublic\s+(?:static\s+)?'
    r'(?P<kieu>[A-Za-z_][\w<>,\[\]\s]*?)\s+'
    r'(?P<ten>[A-Za-z_][\w\s]*?)\s*\(',
)

# Những từ khoá không phải tên phương thức, lọt vào vì đề viết văn xuôi.
BO_QUA = {'class', 'void', 'new', 'if', 'for', 'while', 'return', 'switch'}

# Lỗi CHÍNH TẢ CỦA ĐỀ, đã đối chiếu tay: cùng một phương thức được đề gõ sai ở
# chỗ này và gõ đúng ở dòng cho chữ ký. Lời giải cài theo dòng chữ ký (đúng),
# nên nếu không ghi ra đây thì phép kiểm này báo đỏ vĩnh viễn — và một phép kiểm
# lúc nào cũng đỏ là một phép kiểm không ai đọc nữa.
#
#   P0053: đề gõ "chechIn" trong văn xuôi và "checkln" (chữ L thường) trong
#          danh sách Hướng dẫn, còn dòng chữ ký viết
#          "public Integer checkIn(String inputVal)" — cái này mới là hợp đồng.
TYPO_CUA_DE = {
    'J1.S.P0053': {'chechIn', 'checkln'},
}


def chuan(t: str) -> str:
    """Bỏ khoảng trắng thừa — đề gõ `add Doctor` mà mã viết `addDoctor`."""
    return re.sub(r'\s+', '', t)


def de_thuan(html_de: str) -> str:
    t = re.sub(r'<br\s*/?>', '\n', html_de or '')
    t = re.sub(r'</(p|div|li|h[1-6]|tr|pre)>', '\n', t)
    return html.unescape(re.sub(r'<[^>]+>', ' ', t))


# Khối Hướng dẫn: "Student must implement methods / addWord / removeWord /
# translate / in startup code." Đây là DANH SÁCH CHÍNH THỨC và là thứ duy nhất
# nêu tên những phương thức đề không kèm chữ ký đầy đủ ở đâu khác — P0053 giấu
# cả ba (checkIn, sortAscending, sortDescending) đúng ở chỗ này.
KHOI_HD = re.compile(
    r'implement\s+(?:the\s+)?methods?\s+(?P<ds>.*?)\s+in\s+startup\s+code',
    re.I | re.S,
)


def ten_trong_de(html_de: str) -> set[str]:
    t = de_thuan(html_de)
    ra = set()

    # 1) chữ ký đầy đủ trong phần mô tả từng chức năng
    for m in CHU_KY.finditer(t):
        ten = chuan(m.group('ten'))
        if ten and ten.lower() not in BO_QUA and not ten[0].isupper():
            ra.add(ten)

    # 2) danh sách trần trong khối Hướng dẫn
    for m in KHOI_HD.finditer(t):
        for tu in re.split(r'[\s,;]+', m.group('ds')):
            tu = tu.strip('.()')
            if re.fullmatch(r'[a-z][A-Za-z0-9]{2,30}', tu) and tu.lower() not in BO_QUA:
                ra.add(tu)
    return ra


def main() -> int:
    import importlib
    import solkit
    for i in range(1, 40):
        try:
            importlib.import_module(f'batch{i}')
        except ModuleNotFoundError:
            pass

    briefs = {e['lab']: e for e in json.load(open(os.path.join(HERE, '..', 'payload.json')))}
    thieu_tong = 0
    for s in solkit.SOLUTIONS:
        de = briefs.get(s['lab'])
        if not de:
            continue
        can = ten_trong_de(de['problemHtml'])
        if not can:
            continue
        ma = chuan('\n'.join(c for _, c in s['files']))

        def co(ten: str) -> bool:
            if (ten + '(') in ma:
                return True
            # `overridingtoString` là do đề viết văn xuôi "overriding toString()",
            # `settingsgetDataTasks` là "public function settings getDataTasks()".
            # Ranh giới từ KHÔNG nằm ở chữ hoa nên không tách theo chữ hoa được;
            # thử thẳng mọi hậu tố đủ dài bắt đầu bằng chữ thường.
            for i in range(1, len(ten) - 3):
                if ten[i].islower() and (ten[i:] + '(') in ma:
                    return True
            return False

        bo_qua_lab = TYPO_CUA_DE.get(s['lab'], set())
        thieu = sorted(t for t in can if t not in bo_qua_lab and not co(t))
        if thieu:
            thieu_tong += len(thieu)
            print(f"  {s['lab']:<12} thiếu: {', '.join(thieu)}")
    print(f"\nTên đề nêu mà lời giải không có: {thieu_tong}")
    return 1 if thieu_tong else 0


if __name__ == '__main__':
    raise SystemExit(main())
