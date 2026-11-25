package com.thuvien.servlet;

import com.thuvien.testutil.DuLieuTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.URLDecoder;
import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/** Characterization test nhánh action=return — nhờ seam bayGio() mà "hôm nay" cố định. */
class BookServletTraSachTest {

    // "Hôm nay" của test: 24/11/2026 10:00 giờ Việt Nam
    private static final long HOM_NAY = OffsetDateTime.parse("2026-11-24T10:00:00+07:00").toInstant().toEpochMilli();

    private final BookServlet servlet = new BookServlet() {
        @Override
        protected long bayGio() {
            return HOM_NAY;
        }
    };
    private HttpServletRequest req;
    private HttpServletResponse res;

    @BeforeEach
    void chuanBi() throws Exception {
        DuLieuTest.napLai();
        req = mock(HttpServletRequest.class);
        res = mock(HttpServletResponse.class);
        HttpSession session = mock(HttpSession.class);
        when(req.getSession()).thenReturn(session);
        when(session.getAttribute("user")).thenReturn("thuthu");
    }

    private String tra(String loanId) throws Exception {
        when(req.getParameter("action")).thenReturn("return");
        when(req.getParameter("loanId")).thenReturn(loanId);
        StringBuilder redirect = new StringBuilder();
        doAnswer(inv -> redirect.append((String) inv.getArgument(0))).when(res).sendRedirect(anyString());
        servlet.doPost(req, res);
        return URLDecoder.decode(redirect.toString(), "UTF-8");
    }

    @Test
    void sinhVienTre9Ngay1Gio() throws Exception {
        // Java CẮT phần lẻ ngày: 9 ngày × 2000. (API Node làm tròn lên: 20000 — bài 3.1)
        assertEquals("readers?msg=Trả sách. Phí trễ hạn: 18000.0", tra("1"));       // hạn 15/11 09:00
    }

    @Test
    void giangVienTre13Ngay1Gio() throws Exception {
        assertEquals("readers?msg=Trả sách. Phí trễ hạn: 13000.0", tra("3"));       // hạn 11/11 09:00
    }

    @Test
    void khachTre26Ngay1Gio() throws Exception {
        // KHACH 5000/ngày, KHÔNG có trần (chỉ SV có trần 50000 — quyết định TV-52)
        assertEquals("readers?msg=Trả sách. Phí trễ hạn: 130000.0", tra("4"));       // hạn 29/10 09:00
    }

    @Test
    void chuaToiHan() throws Exception {
        assertEquals("readers?msg=Trả sách thành công", tra("2"));       // hạn 30/11
    }

    @Test
    void traHaiLanCungMotPhieu() throws Exception {
        tra("2");
        // Không kiểm return_date IS NULL ⇒ trả lần 2 vẫn "thành công" và cộng thêm 1 bản sách ma
        assertEquals("readers?msg=Trả sách thành công", tra("2"));
        // sách 1: 5 bản, phiếu 1 vẫn đang giữ 1 bản ⇒ thật ra còn 4 — nhưng CSDL ghi 5
        assertEquals(5, DuLieuTest.so("SELECT available FROM books WHERE id = 1"));
    }
}
