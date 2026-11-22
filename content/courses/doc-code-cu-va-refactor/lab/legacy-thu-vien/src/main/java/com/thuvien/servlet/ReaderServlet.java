package com.thuvien.servlet;

import com.thuvien.model.Loan;
import com.thuvien.model.Reader;
import com.thuvien.util.DBUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ReaderServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getSession().getAttribute("user") == null) {
            response.sendRedirect("login");
            return;
        }
        List<Reader> readers = new ArrayList<Reader>();
        List<Loan> loans = new ArrayList<Loan>();
        Connection con = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            con = DBUtil.getConnection();
            st = con.createStatement();
            rs = st.executeQuery("SELECT * FROM readers ORDER BY id");
            while (rs.next()) {
                Reader r = new Reader();
                r.setId(rs.getInt("id"));
                r.setName(rs.getString("name"));
                r.setType(rs.getString("type"));
                r.setPhone(rs.getString("phone"));
                readers.add(r);
            }
            rs.close();
            rs = st.executeQuery("SELECT l.*, b.title, r.name FROM loans l JOIN books b ON b.id = l.book_id "
                    + "JOIN readers r ON r.id = l.reader_id WHERE l.return_date IS NULL ORDER BY l.due_date");
            while (rs.next()) {
                Loan l = new Loan();
                l.id = rs.getInt("id");
                l.bookId = rs.getInt("book_id");
                l.readerId = rs.getInt("reader_id");
                l.bookTitle = rs.getString("title");
                l.readerName = rs.getString("name");
                l.borrowDate = rs.getTimestamp("borrow_date");
                l.dueDate = rs.getTimestamp("due_date");
                loans.add(l);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, st, con);
        }
        request.setAttribute("readers", readers);
        request.setAttribute("loans", loans);
        request.getRequestDispatcher("readers.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getSession().getAttribute("user") == null) {
            response.sendRedirect("login");
            return;
        }
        request.setCharacterEncoding("UTF-8");
        String action = request.getParameter("action");
        Connection con = null;
        Statement st = null;
        try {
            con = DBUtil.getConnection();
            st = con.createStatement();
            if ("add".equals(action)) {
                st.executeUpdate("INSERT INTO readers(name, type, phone) VALUES ('" + request.getParameter("name") + "', '"
                        + request.getParameter("type") + "', '" + request.getParameter("phone") + "')");
            } else if ("delete".equals(action)) {
                st.executeUpdate("DELETE FROM readers WHERE id = " + request.getParameter("id"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(st, con);
        }
        response.sendRedirect("readers");
    }
}
