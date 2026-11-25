package com.thuvien.servlet;

import com.thuvien.testutil.DuLieuTest;
import org.approvaltests.Approvals;
import org.junit.jupiter.api.Test;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;

import static org.mockito.Mockito.*;

class ExportServletDacTaTest {

    @Test
    void xuatCsvSach() throws Exception {
        DuLieuTest.napLai();
        HttpServletResponse res = mock(HttpServletResponse.class);
        when(res.getWriter()).thenReturn(new PrintWriter(new StringWriter()));
        StringWriter csv = new StringWriter();
        ExportServlet servlet = new ExportServlet() {
            @Override
            protected Writer moTepXuat() {
                return csv;
            }
        };
        servlet.doGet(mock(HttpServletRequest.class), res);
        Approvals.verify(csv.toString());       // cùng tệp .approved.txt như trước khi tạo seam
    }
}
