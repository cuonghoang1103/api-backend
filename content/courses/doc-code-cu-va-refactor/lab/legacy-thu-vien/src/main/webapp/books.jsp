<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.*, com.thuvien.model.Book" %>
<html>
<head><title>Sách - Thư viện</title></head>
<body>
<%@ include file="header.jsp" %>
<% if (request.getParameter("msg") != null) { %>
  <p style="color:green"><%= request.getParameter("msg") %></p>
<% } %>
<form method="get" action="books">
  <input name="q" value="<%= request.getParameter("q") == null ? "" : request.getParameter("q") %>">
  <button>Tìm</button>
</form>
<table border="1" cellpadding="4">
  <tr><th>ID</th><th>Mã</th><th>Tên sách</th><th>Tác giả</th><th>Còn/Tổng</th><th>Mượn</th></tr>
<%
    List<Book> books = (List<Book>) request.getAttribute("books");
    for (Book b : books) {
%>
  <tr>
    <td><%= b.getId() %></td>
    <td><%= b.getCode() %></td>
    <td><%= b.getTitle() %></td>
    <td><%= b.getAuthor() %></td>
    <td><%= b.getAvailable() %>/<%= b.getQuantity() %></td>
    <td>
      <form method="post" action="books" style="margin:0">
        <input type="hidden" name="action" value="borrow">
        <input type="hidden" name="bookId" value="<%= b.getId() %>">
        Mã ĐG: <input name="readerId" size="3">
        <button>Mượn</button>
      </form>
    </td>
  </tr>
<% } %>
</table>
<h3>Thêm sách</h3>
<form method="post" action="books">
  <input type="hidden" name="action" value="add">
  Mã <input name="code" size="6"> Tên <input name="title"> Tác giả <input name="author"> SL <input name="quantity" size="3">
  <button>Thêm</button>
</form>
</body>
</html>
