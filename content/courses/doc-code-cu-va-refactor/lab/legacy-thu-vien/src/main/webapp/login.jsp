<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head><title>Đăng nhập - Thư viện</title></head>
<body>
<h2>Đăng nhập hệ thống thư viện</h2>
<% if (request.getAttribute("error") != null) { %>
  <p style="color:red"><%= request.getAttribute("error") %></p>
<% } %>
<form method="post" action="login">
  Tên đăng nhập: <input name="username"><br>
  Mật khẩu: <input type="password" name="password"><br>
  <label><input type="checkbox" name="remember"> Ghi nhớ</label><br>
  <button type="submit">Đăng nhập</button>
</form>
</body>
</html>
