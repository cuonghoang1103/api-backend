package com.thuvien.servlet;

import com.thuvien.dao.BookDAO;
import com.thuvien.model.Book;
import com.thuvien.util.DBUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * Quan ly sach + muon/tra. (Tuan 2016, Hung sua 2017, Lan sua 2019)
 */
public class BookServlet extends HttpServlet {

    private static Logger log = Logger.getLogger(BookServlet.class);

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getSession().getAttribute("user") == null) {
            response.sendRedirect("login");
            return;
        }
        request.setCharacterEncoding("UTF-8");
        String q = request.getParameter("q");
        List<Book> books = new ArrayList<Book>();
        if (StringUtils.isNotBlank(q)) {
            // tim theo ten hoac tac gia
            Connection con = null;
            Statement st = null;
            ResultSet rs = null;
            try {
                con = DBUtil.getConnection();
                st = con.createStatement();
                String sql = "SELECT * FROM books WHERE title LIKE '%" + q + "%' OR author LIKE '%" + q + "%'";
                log.debug(sql);
                rs = st.executeQuery(sql);
                while (rs.next()) {
                    Book b = new Book();
                    b.setId(rs.getInt("id"));
                    b.setCode(rs.getString("code"));
                    b.setTitle(rs.getString("title"));
                    b.setAuthor(rs.getString("author"));
                    b.setQuantity(rs.getInt("quantity"));
                    b.setAvailable(rs.getInt("available"));
                    books.add(b);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                DBUtil.close(rs, st, con);
            }
        } else {
            books = new BookDAO().findAll();
        }
        request.setAttribute("books", books);
        request.getRequestDispatcher("books.jsp").forward(request, response);
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
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DBUtil.getConnection();
            if (action.equals("borrow")) {
                String readerId = request.getParameter("readerId");
                String bookId = request.getParameter("bookId");
                st = con.createStatement();
                rs = st.executeQuery("SELECT * FROM readers WHERE id = " + readerId);
                if (!rs.next()) {
                    response.sendRedirect("books?msg=" + URLEncoder.encode("Độc giả không tồn tại", "UTF-8"));
                    return;
                }
                String type = rs.getString("type");
                rs.close();
                rs = st.executeQuery("SELECT COUNT(*) FROM loans WHERE reader_id = " + readerId + " AND return_date IS NULL");
                rs.next();
                int dangMuon = rs.getInt(1);
                rs.close();
                int max;
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
                rs = st.executeQuery("SELECT available FROM books WHERE id = " + bookId);
                rs.next();
                if (rs.getInt(1) <= 0) {
                    response.sendRedirect("books?msg=" + URLEncoder.encode("Sách đã hết", "UTF-8"));
                    return;
                }
                rs.close();
                Calendar cal = Calendar.getInstance();
                Timestamp now = new Timestamp(cal.getTimeInMillis());
                if (type.equals("SV")) {
                    cal.add(Calendar.DATE, 14);
                } else if (type.equals("GV")) {
                    cal.add(Calendar.DATE, 30);
                } else {
                    cal.add(Calendar.DATE, 7);
                }
                ps = con.prepareStatement("INSERT INTO loans(book_id, reader_id, borrow_date, due_date) VALUES (?, ?, ?, ?)");
                ps.setInt(1, Integer.parseInt(bookId));
                ps.setInt(2, Integer.parseInt(readerId));
                ps.setTimestamp(3, now);
                ps.setTimestamp(4, new Timestamp(cal.getTimeInMillis()));
                ps.executeUpdate();
                log.info("borrow book=" + bookId + " reader=" + readerId);
                response.sendRedirect("books?msg=" + URLEncoder.encode("Mượn thành công", "UTF-8"));
            } else if (action.equals("return")) {
                String loanId = request.getParameter("loanId");
                st = con.createStatement();
                rs = st.executeQuery("SELECT l.*, r.type FROM loans l JOIN readers r ON r.id = l.reader_id WHERE l.id = " + loanId);
                if (!rs.next()) {
                    response.sendRedirect("readers?msg=" + URLEncoder.encode("Không tìm thấy phiếu mượn", "UTF-8"));
                    return;
                }
                int bookId = rs.getInt("book_id");
                String type = rs.getString("type");
                Timestamp due = rs.getTimestamp("due_date");
                rs.close();
                long diff = System.currentTimeMillis() - due.getTime();
                int days = (int) (diff / (1000 * 60 * 60 * 24));
                double fine = 0;
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
                ps = con.prepareStatement("UPDATE loans SET return_date = ?, fine = ? WHERE id = ?");
                ps.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
                ps.setDouble(2, fine);
                ps.setInt(3, Integer.parseInt(loanId));
                ps.executeUpdate();
                st.executeUpdate("UPDATE books SET available = available + 1 WHERE id = " + bookId);
                String msg = fine > 0 ? "Trả sách. Phí trễ hạn: " + fine : "Trả sách thành công";
                response.sendRedirect("readers?msg=" + URLEncoder.encode(msg, "UTF-8"));
            } else if (action.equals("add")) {
                st = con.createStatement();
                st.executeUpdate("INSERT INTO books(code, title, author, quantity, available) VALUES ('"
                        + request.getParameter("code") + "', '" + request.getParameter("title") + "', '"
                        + request.getParameter("author") + "', " + request.getParameter("quantity") + ", "
                        + request.getParameter("quantity") + ")");
                response.sendRedirect("books?msg=" + URLEncoder.encode("Đã thêm sách", "UTF-8"));
            } else if (action.equals("delete")) {
                st = con.createStatement();
                st.executeUpdate("DELETE FROM books WHERE id = " + request.getParameter("id"));
                response.sendRedirect("books");
            } else {
                PrintWriter out = response.getWriter();
                out.println("<html><body><h3>Action khong hop le: " + action + "</h3></body></html>");
            }
        } catch (Exception e) {
            e.printStackTrace();
            PrintWriter out = response.getWriter();
            out.println("<html><body><h3>Loi: " + e.getMessage() + "</h3></body></html>");
        } finally {
            DBUtil.close(rs, st, ps, con);
        }
    }
}
