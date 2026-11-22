package com.thuvien.servlet;

import com.thuvien.util.Constants;
import com.thuvien.util.DBUtil;
import com.thuvien.util.TokenUtil;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class LoginServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if ("logout".equals(request.getParameter("action"))) {
            request.getSession().invalidate();
            Cookie c = new Cookie("remember", "");
            c.setMaxAge(0);
            response.addCookie(c);
            response.sendRedirect("login");
            return;
        }
        // tu dong dang nhap bang cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (c.getName().equals("remember") && c.getValue().contains(":")) {
                    String u = c.getValue().split(":")[0];
                    String t = c.getValue().split(":")[1];
                    if (TokenUtil.makeToken(u).equals(t)) {
                        request.getSession().setAttribute(Constants.SESSION_USER, u);
                        response.sendRedirect("books");
                        return;
                    }
                }
            }
        }
        request.getRequestDispatcher("login.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String u = request.getParameter("username");
        String p = request.getParameter("password");
        Connection con = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            con = DBUtil.getConnection();
            st = con.createStatement();
            rs = st.executeQuery("SELECT * FROM users WHERE username = '" + u + "' AND password = '" + p + "'");
            if (rs.next()) {
                request.getSession().setAttribute(Constants.SESSION_USER, rs.getString("username"));
                request.getSession().setAttribute("role", rs.getString("role"));
                if (request.getParameter("remember") != null) {
                    Cookie c = new Cookie("remember", rs.getString("username") + ":" + TokenUtil.makeToken(rs.getString("username")));
                    c.setMaxAge(60 * 60 * 24 * 30);
                    response.addCookie(c);
                }
                response.sendRedirect("books");
                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, st, con);
        }
        request.setAttribute("error", "Sai tên đăng nhập hoặc mật khẩu");
        request.getRequestDispatcher("login.jsp").forward(request, response);
    }
}
