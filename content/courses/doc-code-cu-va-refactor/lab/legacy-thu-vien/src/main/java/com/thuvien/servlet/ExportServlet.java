package com.thuvien.servlet;

import com.thuvien.util.Constants;
import com.thuvien.util.DBUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Xuat danh sach sach ra CSV cho phong ke toan (2017).
 */
public class ExportServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Connection con = null;
        Statement st = null;
        ResultSet rs = null;
        FileWriter fw = null;
        try {
            con = DBUtil.getConnection();
            st = con.createStatement();
            rs = st.executeQuery("SELECT * FROM books");
            fw = new FileWriter(Constants.EXPORT_DIR + "books.csv");
            while (rs.next()) {
                fw.write(rs.getString("code") + "," + rs.getString("title") + "," + rs.getInt("quantity") + "\n");
            }
            response.getWriter().println("OK");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fw != null) fw.close();
            DBUtil.close(rs, st, con);
        }
    }
}
