#!/usr/bin/env python3
"""
Dựng lịch sử git GIẢ LẬP cho repo lab legacy-thu-vien (khoá doc-code-cu-va-refactor).

Vì sao cần: Chương 2.4 dạy đọc lịch sử (git log -S, blame, log -p) để hiểu "vì sao" — repo lab phải có
lịch sử như một dự án thật 2016–2019 (ba người viết, commit message tệ lẫn tốt, ticket TV-xx).
Mọi tên người/ticket là HƯ CẤU.

Chạy:  python3 _tao-lich-su.py <thu-muc-nguon legacy-thu-vien> <thu-muc-dich>
  ⇒ <dich> là một repo git mới, commit cuối có nội dung TRÙNG KHÍT thư mục nguồn (script tự kiểm).
Gói cho người học:  (cd <dich>/.. && zip -qr legacy-thu-vien.zip legacy-thu-vien)
"""
import os, shutil, subprocess, sys, filecmp

SRC, DST = sys.argv[1], sys.argv[2]
TUAN = ('Nguyen Anh Tuan', 'tuan@thuvien.local')
HUNG = ('Tran Quoc Hung', 'hung@thuvien.local')
LAN = ('Le Thi Lan', 'lan@thuvien.local')

def doc(p):
    with open(os.path.join(SRC, p), encoding='utf-8') as f:
        return f.read()

def ghi(p, s):
    d = os.path.join(DST, p)
    os.makedirs(os.path.dirname(d), exist_ok=True)
    with open(d, 'w', encoding='utf-8') as f:
        f.write(s)

def chep(*ps):
    for p in ps:
        ghi(p, doc(p))

def xoa(p):
    os.remove(os.path.join(DST, p))

def thay(s, cu, moi):
    assert cu in s, 'không thấy đoạn cần thay:\n' + cu[:200]
    return s.replace(cu, moi, 1)

def commit(ai, ngay, msg):
    env = dict(os.environ, GIT_AUTHOR_NAME=ai[0], GIT_AUTHOR_EMAIL=ai[1], GIT_COMMITTER_NAME=ai[0],
               GIT_COMMITTER_EMAIL=ai[1], GIT_AUTHOR_DATE=ngay, GIT_COMMITTER_DATE=ngay)
    subprocess.run(['git', 'add', '-A'], cwd=DST, check=True)
    subprocess.run(['git', 'commit', '-q', '-m', msg], cwd=DST, check=True, env=env)

if os.path.exists(DST):
    shutil.rmtree(DST)
os.makedirs(DST)
subprocess.run(['git', 'init', '-q', '-b', 'master'], cwd=DST, check=True)

# ── Các phiên bản cũ của những tệp bị sửa nhiều lần ──────────────────────────
BS = doc('src/main/java/com/thuvien/servlet/BookServlet.java')
KHOI_GIOI_HAN = '''                int max;
                if (type.equals("SV")) {
                    max = 3;
                } else if (type.equals("GV")) {
                    max = 10;
                } else {
                    max = 1;
                }
                if (dangMuon > max) {
                    response.sendRedirect("books?msg=" + URLEncoder.encode("Vượt quá số sách được mượn", "UTF-8"));
                    return;
                }
'''
KHOI_PHI = '''                double fine = 0;
                if (days > 0) {
                    if (type.equals("SV")) {
                        fine = days * 2000;
                        if (fine > 50000) fine = 50000;
                    } else if (type.equals("GV")) {
                        fine = days * 1000;
                    } else {
                        fine = days * 5000;
                    }
                }
'''
KHOI_PHI_CHUA_TRAN = KHOI_PHI.replace('                        if (fine > 50000) fine = 50000;\n', '')
KHOI_PHI_V1 = '                double fine = 0;\n'
INSERT_LOG = '''                ps.executeUpdate();
                log.info("borrow book=" + bookId + " reader=" + readerId);
'''
INSERT_TRU_TAY = '''                ps.executeUpdate();
                st.executeUpdate("UPDATE books SET available = available - 1 WHERE id = " + bookId);
                log.info("borrow book=" + bookId + " reader=" + readerId);
'''
TIM_MOI = '''        if (StringUtils.isNotBlank(q)) {
            // tim theo ten hoac tac gia
            Connection con = null;'''
TIM_CU = '''        if (q == null) q = "";
        {
            // tim theo ten hoac tac gia
            Connection con = null;'''
ELSE_DAO = '''        } else {
            books = new BookDAO().findAll();
        }
'''

bs_v4 = thay(thay(BS, TIM_MOI, TIM_CU), ELSE_DAO, '        }\n')           # trước khi tách DAO
bs_v4 = thay(bs_v4, 'import com.thuvien.dao.BookDAO;\n', '')
bs_v4 = thay(bs_v4, 'import org.apache.commons.lang.StringUtils;\n', '')
bs_v3c = bs_v4                                                              # có trần phí SV
bs_v3b = thay(bs_v3c, KHOI_PHI, KHOI_PHI_CHUA_TRAN)                        # phí chưa có trần
bs_v3a = thay(bs_v3b, KHOI_PHI_CHUA_TRAN, KHOI_PHI_V1)                     # có giới hạn, chưa phí
bs_v2 = thay(bs_v3a, KHOI_GIOI_HAN, '')                                    # dùng trigger, chưa giới hạn
bs_v1 = thay(bs_v2, INSERT_LOG, INSERT_TRU_TAY)                            # trừ số lượng bằng Java

WEB = doc('src/main/webapp/WEB-INF/web.xml')
EXPORT_TAT = WEB[WEB.index('  <!-- tam tat 2018'):WEB.index('  -->\n') + len('  -->\n')]
EXPORT_BAT = EXPORT_TAT.replace('  <!-- tam tat 2018\n', '').replace('  -->\n', '')
KHOI_READER = WEB[WEB.index('  <servlet>\n    <servlet-name>ReaderServlet'):WEB.index('  <!-- tam tat 2018')]
KHOI_LOI = WEB[WEB.index('  <error-page>'):WEB.index('</web-app>')]
WEB_KHONG_LOI = WEB.replace(KHOI_LOI, '')
web_v1 = WEB_KHONG_LOI.replace(KHOI_READER, '').replace(EXPORT_TAT, '')
web_v2 = WEB_KHONG_LOI.replace(EXPORT_TAT, '')
web_v3 = WEB_KHONG_LOI.replace(EXPORT_TAT, EXPORT_BAT)

SQL = doc('db/thuvien.sql')
KHOI_TRIGGER = SQL[SQL.index('--\n-- Trigger:'):SQL.index('--\n-- Procedure:')]
KHOI_PROC = SQL[SQL.index('--\n-- Procedure:'):SQL.index('/*!40014 SET FOREIGN_KEY_CHECKS=@OLD')]
sql_v1 = SQL.replace(KHOI_TRIGGER, '').replace(KHOI_PROC, '')
sql_v2 = SQL.replace(KHOI_PROC, '')

HEADER = doc('src/main/webapp/header.jsp')
header_v1 = '''<div style="background:#2b5797;color:#fff;padding:8px">
  <b>THƯ VIỆN</b> |
  <a style="color:#fff" href="books">Sách</a> |
  <a style="color:#fff" href="readers">Độc giả</a> |
  Xin chào <%= session.getAttribute("user") %> |
  <a style="color:#fff" href="login?action=logout">Thoát</a>
</div>
'''

LOGIN = doc('src/main/java/com/thuvien/servlet/LoginServlet.java')
COOKIE_DOC = LOGIN[LOGIN.index('        // tu dong dang nhap bang cookie'):LOGIN.index('        request.getRequestDispatcher("login.jsp").forward(request, response);\n    }\n\n    protected void doPost')]
COOKIE_GHI = LOGIN[LOGIN.index('                if (request.getParameter("remember") != null) {'):LOGIN.index('                response.sendRedirect("books");\n                return;\n            }\n        } catch')]
login_v1 = LOGIN.replace(COOKIE_DOC, '').replace(COOKIE_GHI, '').replace('import com.thuvien.util.TokenUtil;\n', '')
LOGIN_JSP = doc('src/main/webapp/login.jsp')
login_jsp_v1 = thay(LOGIN_JSP, '  <label><input type="checkbox" name="remember"> Ghi nhớ</label><br>\n', '')

# ── 1. Khởi tạo (Tuấn, 03/2016) ──────────────────────────────────────────────
chep('pom.xml', '.gitignore', 'README.md', 'src/main/resources/db.properties', 'src/main/resources/log4j.properties',
     'src/main/java/com/thuvien/util/DBUtil.java', 'src/main/java/com/thuvien/model/Book.java',
     'src/main/java/com/thuvien/model/Reader.java', 'src/main/java/com/thuvien/model/Loan.java',
     'src/main/webapp/index.jsp', 'src/main/webapp/books.jsp')
ghi('src/main/java/com/thuvien/util/Constants.java', doc('src/main/java/com/thuvien/util/Constants.java')
    .replace('    public static final String EXPORT_DIR = "C:\\\\thuvien\\\\export\\\\";   // may cua anh Tuan\n', ''))
ghi('src/main/java/com/thuvien/servlet/LoginServlet.java', login_v1)
ghi('src/main/webapp/login.jsp', login_jsp_v1)
ghi('src/main/java/com/thuvien/servlet/BookServlet.java', bs_v1)
ghi('src/main/webapp/WEB-INF/web.xml', web_v1)
ghi('src/main/webapp/header.jsp', header_v1)
ghi('db/thuvien.sql', sql_v1)
commit(TUAN, '2016-03-02T09:14:00+07:00', 'init project')

# ── 2. Độc giả ───────────────────────────────────────────────────────────────
chep('src/main/java/com/thuvien/servlet/ReaderServlet.java', 'src/main/webapp/readers.jsp')
ghi('src/main/webapp/WEB-INF/web.xml', web_v2)
commit(TUAN, '2016-03-15T16:40:00+07:00', 'them chuc nang doc gia')

# ── 3. Trigger thay cho trừ tay (lý do nằm trong message) ────────────────────
ghi('src/main/java/com/thuvien/servlet/BookServlet.java', bs_v2)
ghi('db/thuvien.sql', sql_v2)
commit(TUAN, '2016-09-20T11:05:00+07:00',
       'fix loi so luong am (TV-23)\n\nHai thu thu bam muon cung luc thi available bi tru 2 lan / am.\n'
       'Chuyen viec tru so luong vao trigger trg_loans_ai cho chac. Phan TRA SACH van cong trong Java, chua sua.')

# ── 4. Giới hạn số sách (lỗi > thay vì >= sinh ra ở đây) ─────────────────────
ghi('src/main/java/com/thuvien/servlet/BookServlet.java', bs_v3a)
commit(HUNG, '2017-04-11T14:22:00+07:00', 'TV-41 gioi han so sach muon theo loai doc gia (SV 3, GV 10, khach 1)')

# ── 5. Phí trễ hạn ───────────────────────────────────────────────────────────
ghi('src/main/java/com/thuvien/servlet/BookServlet.java', bs_v3b)
commit(HUNG, '2017-05-02T10:01:00+07:00', 'TV-45 tinh phi tre han khi tra sach')

# ── 6. Trần phí cho SV ───────────────────────────────────────────────────────
ghi('src/main/java/com/thuvien/servlet/BookServlet.java', bs_v3c)
commit(HUNG, '2017-06-19T17:48:00+07:00', 'TV-52 SV khieu nai phi qua cao -> tran 50k (chi ap dung SV theo y kien phong CTSV)')

# ── 7. Ghi nhớ đăng nhập ─────────────────────────────────────────────────────
chep('src/main/java/com/thuvien/util/TokenUtil.java', 'src/test/java/com/thuvien/util/TokenUtilTest.java',
     'src/main/java/com/thuvien/servlet/LoginServlet.java', 'src/main/webapp/login.jsp')
commit(HUNG, '2017-08-30T09:30:00+07:00', 'ghi nho dang nhap')

# ── 8. Xuất CSV cho kế toán ──────────────────────────────────────────────────
chep('src/main/java/com/thuvien/servlet/ExportServlet.java', 'src/main/java/com/thuvien/util/Constants.java')
ghi('src/main/webapp/WEB-INF/web.xml', web_v3)
commit(HUNG, '2017-10-10T15:12:00+07:00', 'xuat csv cho ke toan')

# ── 9. Tắt export ────────────────────────────────────────────────────────────
ghi('src/main/webapp/WEB-INF/web.xml', WEB_KHONG_LOI)
commit(TUAN, '2018-01-08T08:55:00+07:00', 'tam tat export, server moi chay linux khong co o C')

# ── 10. Bắt đầu tách DAO ─────────────────────────────────────────────────────
chep('src/main/java/com/thuvien/dao/BookDAO.java')
ghi('src/main/java/com/thuvien/servlet/BookServlet.java', BS)
commit(HUNG, '2018-06-20T13:37:00+07:00', 'refactor')

# ── 11. Báo cáo quá hạn (logic trong stored procedure) ──────────────────────
chep('src/main/java/com/thuvien/servlet/ReportServlet.java', 'src/main/webapp/report.jsp', 'db/thuvien.sql',
     'src/main/webapp/header.jsp')
commit(LAN, '2019-11-04T16:25:00+07:00', 'TV-77 bao cao phieu qua han + dem qua han tren menu')

# ── 12. "update" ─────────────────────────────────────────────────────────────
chep('src/main/webapp/WEB-INF/web.xml', 'src/main/webapp/error.jsp')
commit(LAN, '2019-11-05T10:02:00+07:00', 'update')

# ── 13. Phần khoá học thêm (KHÔNG thuộc dự án gốc) ───────────────────────────
chep('Dockerfile', 'docker-compose.yml')
commit(('cuongthai.com lab', 'lab@cuongthai.invalid'), '2026-11-22T20:00:00+07:00',
       'chore(lab): them Dockerfile + docker-compose de chay lab (khoa hoc them, du an goc khong co)')

# ── Kiểm: commit cuối trùng khít nguồn ───────────────────────────────────────
for goc, _, tep in os.walk(SRC):
    if 'target' in goc.split(os.sep):
        continue
    for t in tep:
        p = os.path.relpath(os.path.join(goc, t), SRC)
        assert filecmp.cmp(os.path.join(SRC, p), os.path.join(DST, p), shallow=False), 'lệch: ' + p
print('OK — lịch sử 13 commit, commit cuối trùng khít', SRC)
