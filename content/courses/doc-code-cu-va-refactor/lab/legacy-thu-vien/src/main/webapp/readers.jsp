<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.*, java.text.SimpleDateFormat, com.thuvien.model.*" %>
<html>
<head><title>Độc giả - Thư viện</title></head>
<body>
<%@ include file="header.jsp" %>
<% if (request.getParameter("msg") != null) { %>
  <p style="color:green"><%= request.getParameter("msg") %></p>
<% } %>
<h3>Độc giả</h3>
<table border="1" cellpadding="4">
  <tr><th>ID</th><th>Tên</th><th>Loại</th><th>SĐT</th><th></th></tr>
<% for (Reader r : (List<Reader>) request.getAttribute("readers")) { %>
  <tr>
    <td><%= r.getId() %></td><td><%= r.getName() %></td><td><%= r.getType() %></td><td><%= r.getPhone() %></td>
    <td>
      <form method="post" action="readers" style="margin:0">
        <input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<%= r.getId() %>">
        <button>Xoá</button>
      </form>
    </td>
  </tr>
<% } %>
</table>
<h3>Đang mượn</h3>
<table border="1" cellpadding="4">
  <tr><th>Phiếu</th><th>Sách</th><th>Độc giả</th><th>Hạn trả</th><th></th></tr>
<%
   SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
   for (Loan l : (List<Loan>) request.getAttribute("loans")) {
%>
  <tr>
    <td><%= l.id %></td><td><%= l.bookTitle %></td><td><%= l.readerName %></td><td><%= f.format(l.dueDate) %></td>
    <td>
      <form method="post" action="books" style="margin:0">
        <input type="hidden" name="action" value="return"><input type="hidden" name="loanId" value="<%= l.id %>">
        <button>Trả</button>
      </form>
    </td>
  </tr>
<% } %>
</table>
<h3>Thêm độc giả</h3>
<form method="post" action="readers">
  <input type="hidden" name="action" value="add">
  Tên <input name="name"> Loại <select name="type"><option>SV</option><option>GV</option><option>KHACH</option></select>
  SĐT <input name="phone"> <button>Thêm</button>
</form>
</body>
</html>
