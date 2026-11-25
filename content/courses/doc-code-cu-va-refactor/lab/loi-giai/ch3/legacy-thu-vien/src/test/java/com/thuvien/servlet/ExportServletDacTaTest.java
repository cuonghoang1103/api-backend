package com.thuvien.servlet;

import com.thuvien.testutil.DuLieuTest;
import org.approvaltests.Approvals;
import org.junit.jupiter.api.Test;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Files;

import static org.mockito.Mockito.*;

class ExportServletDacTaTest {

    @Test
    void xuatCsvSach() throws Exception {
        DuLieuTest.napLai();
        HttpServletResponse res = mock(HttpServletResponse.class);
        when(res.getWriter()).thenReturn(new PrintWriter(new StringWriter()));
        new ExportServlet().doGet(mock(HttpServletRequest.class), res);

        File[] moi = new File(".").listFiles((d, ten) -> ten.endsWith(".csv"));
        System.out.println("Tệp CSV vừa sinh: " + moi[0].getName());
        Approvals.verify(new String(Files.readAllBytes(moi[0].toPath()), "UTF-8"));
    }
}
