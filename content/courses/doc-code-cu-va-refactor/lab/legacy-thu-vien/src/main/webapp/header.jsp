<%@ page import="java.sql.*, com.thuvien.util.DBUtil" %>
<%
    int quaHan = 0;
    Connection hc = DBUtil.getConnection();
    Statement hs = hc.createStatement();
    ResultSet hr = hs.executeQuery("SELECT COUNT(*) FROM loans WHERE return_date IS NULL AND due_date < NOW()");
    if (hr.next()) quaHan = hr.getInt(1);
    hr.close(); hs.close(); hc.close();
%>
<div style="background:#2b5797;color:#fff;padding:8px">
  <b>THƯ VIỆN</b> |
  <a style="color:#fff" href="books">Sách</a> |
  <a style="color:#fff" href="readers">Độc giả</a> |
  <a style="color:#fff" href="report">Quá hạn (<%= quaHan %>)</a> |
  Xin chào <%= session.getAttribute("user") %> |
  <a style="color:#fff" href="login?action=logout">Thoát</a>
</div>
