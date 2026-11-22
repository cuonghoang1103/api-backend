package com.thuvien.dao;

import com.thuvien.model.Book;
import com.thuvien.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * Bat dau tach DAO (2018) — moi lam duoc findAll, cac ham khac van nam trong BookServlet.
 */
public class BookDAO {

    public List<Book> findAll() {
        List<Book> list = new ArrayList<Book>();
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DBUtil.getConnection();
            ps = con.prepareStatement("SELECT id, code, title, author, quantity, available FROM books ORDER BY id");
            rs = ps.executeQuery();
            while (rs.next()) {
                list.add(map(rs));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, ps, con);
        }
        return list;
    }

    public Book findById(int id) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DBUtil.getConnection();
            ps = con.prepareStatement("SELECT id, code, title, author, quantity, available FROM books WHERE id = ?");
            ps.setInt(1, id);
            rs = ps.executeQuery();
            if (rs.next()) return map(rs);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, ps, con);
        }
        return null;
    }

    private Book map(ResultSet rs) throws Exception {
        Book b = new Book();
        b.setId(rs.getInt("id"));
        b.setCode(rs.getString("code"));
        b.setTitle(rs.getString("title"));
        b.setAuthor(rs.getString("author"));
        b.setQuantity(rs.getInt("quantity"));
        b.setAvailable(rs.getInt("available"));
        return b;
    }
}
