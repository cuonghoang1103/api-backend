package com.thuvien.servlet;

import com.thuvien.testutil.DuLieuTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URLDecoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Characterization test cho nhánh action=borrow của BookServlet.doPost.
 * Ghi lại hành vi HIỆN TẠI, kể cả bug. Test nào khoá bug thì tên có hậu tố _BUG + mã ticket.
 */
class BookServletMuonSachTest {

    private final BookServlet servlet = new BookServlet();
    private HttpServletRequest req;
    private HttpServletResponse res;
    private final StringWriter body = new StringWriter();

    @BeforeEach
    void chuanBi() throws Exception {
        DuLieuTest.napLai();
        req = mock(HttpServletRequest.class);
        res = mock(HttpServletResponse.class);
        HttpSession session = mock(HttpSession.class);
        when(req.getSession()).thenReturn(session);
        when(session.getAttribute("user")).thenReturn("thuthu");
        when(res.getWriter()).thenReturn(new PrintWriter(body, true));
    }

    /** Gọi doPost như Tomcat gọi; trả về chuỗi redirect đã giải mã, hoặc body HTML nếu không redirect. */
    private String muon(String readerId, String bookId) throws Exception {
        when(req.getParameter("action")).thenReturn("borrow");
        when(req.getParameter("readerId")).thenReturn(readerId);
        when(req.getParameter("bookId")).thenReturn(bookId);
        StringBuilder redirect = new StringBuilder();
        doAnswer(inv -> redirect.append((String) inv.getArgument(0))).when(res).sendRedirect(anyString());
        servlet.doPost(req, res);
        return redirect.length() > 0 ? URLDecoder.decode(redirect.toString(), "UTF-8") : body.toString().trim();
    }

    @Test
    void muonThanhCong_themPhieu_vaTriggerTruSoSach() throws Exception {
        assertEquals("books?msg=Mượn thành công", muon("5", "4"));
        assertEquals(1, DuLieuTest.so("SELECT COUNT(*) FROM loans WHERE reader_id = 5 AND book_id = 4 AND return_date IS NULL"));
        assertEquals(1, DuLieuTest.so("SELECT available FROM books WHERE id = 4"));   // 2 → 1, do trigger
    }

    @Test
    void hanTraCuaSinhVien_la14Ngay() throws Exception {
        muon("5", "4");
        assertEquals(14, DuLieuTest.so("SELECT DATEDIFF(due_date, borrow_date) FROM loans WHERE reader_id = 5"));
    }

    @Test
    void docGiaKhongTonTai() throws Exception {
        assertEquals("books?msg=Độc giả không tồn tại", muon("99", "4"));
    }

    @Test
    void sinhVienDangMuon3_vanMuonDuocCuonThu4_BUG_TV41() throws Exception {
        muon("5", "4"); muon("5", "5"); muon("5", "6");   // SV 5: 0 → 3 cuốn
        assertEquals("books?msg=Mượn thành công", muon("5", "2"));   // luật nói tối đa 3; code so "> max"
        assertEquals(4, DuLieuTest.so("SELECT COUNT(*) FROM loans WHERE reader_id = 5 AND return_date IS NULL"));
    }

    @Test
    void sinhVienDangMuon4_biTuChoi() throws Exception {
        muon("5", "4"); muon("5", "5"); muon("5", "6"); muon("5", "2");
        assertEquals("books?msg=Vượt quá số sách được mượn", muon("5", "7"));
    }

    @Test
    void khachDangMuon1_vanMuonDuocCuonThu2_BUG_TV41() throws Exception {
        assertEquals("books?msg=Mượn thành công", muon("4", "4"));   // KHACH: luật 1, đang có 1 (phiếu 4)
    }

    @Test
    void sachHet() throws Exception {
        muon("5", "5");                                            // sách 5 chỉ có 1 bản
        assertEquals("books?msg=Sách đã hết", muon("2", "5"));
    }

    @Test
    void chuaDangNhap_veTrangLogin_khongGhiGi() throws Exception {
        when(req.getSession().getAttribute("user")).thenReturn(null);
        assertEquals("login", muon("5", "4"));
        assertEquals(0, DuLieuTest.so("SELECT COUNT(*) FROM loans WHERE reader_id = 5"));
    }

    @Test
    void readerIdKhongPhaiSo() throws Exception {
        // Lỗi SQL lọt thẳng ra trang (HTTP 200) — và lộ rằng chữ "abc" bị ghép vào câu SQL (bài 6.3)
        assertEquals("<html><body><h3>Loi: Unknown column 'abc' in 'where clause'</h3></body></html>", muon("abc", "4"));
    }

    @Test
    void bookIdKhongTonTai() throws Exception {
        // Không kiểm rs.next() ở câu SELECT available ⇒ JDBC ném lỗi, servlet in nguyên thông điệp
        assertEquals("<html><body><h3>Loi: Illegal operation on empty result set.</h3></body></html>", muon("5", "99"));
    }

    @Test
    void giangVienDangMuon2_vanMuonDuoc() throws Exception {
        muon("3", "4"); muon("3", "5");                            // GV 3: 1 → 3 cuốn
        assertEquals("books?msg=Mượn thành công", muon("3", "6"));
    }

    @Test
    void hanTraCuaGiangVien_la30Ngay() throws Exception {
        muon("3", "4");
        assertEquals(30, DuLieuTest.so("SELECT DATEDIFF(due_date, borrow_date) FROM loans WHERE reader_id = 3 AND book_id = 4"));
    }

    @Test
    void hanTraCuaKhach_la7Ngay() throws Exception {
        DuLieuTest.chay("UPDATE loans SET return_date = '2026-11-01 09:00:00' WHERE id = 4");   // KHACH 4 trả hết
        muon("4", "4");
        assertEquals(7, DuLieuTest.so("SELECT DATEDIFF(due_date, borrow_date) FROM loans WHERE reader_id = 4 AND book_id = 4"));
    }
}
