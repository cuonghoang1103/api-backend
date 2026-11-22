package com.thuvien.servlet;

import com.thuvien.util.DBUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Lan them 2019 — bao cao qua han, logic nam trong stored procedure
@WebServlet("/report")
public class ReportServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getSession().getAttribute("user") == null) {
            response.sendRedirect("login");
            return;
        }
        int minDays = 1;
        if (request.getParameter("days") != null) minDays = Integer.parseInt(request.getParameter("days"));
        List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
        Connection con = null;
        CallableStatement cs = null;
        ResultSet rs = null;
        try {
            con = DBUtil.getConnection();
            cs = con.prepareCall("{call sp_overdue_report(?)}");
            cs.setInt(1, minDays);
            rs = cs.executeQuery();
            while (rs.next()) {
                Map<String, Object> m = new HashMap<String, Object>();
                m.put("loanId", rs.getInt("loan_id"));
                m.put("reader", rs.getString("reader_name"));
                m.put("title", rs.getString("title"));
                m.put("daysLate", rs.getInt("days_late"));
                m.put("estFine", rs.getDouble("est_fine"));
                rows.add(m);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, cs, con);
        }
        request.setAttribute("rows", rows);
        request.setAttribute("days", minDays);
        request.getRequestDispatcher("/report.jsp").forward(request, response);
    }
}
