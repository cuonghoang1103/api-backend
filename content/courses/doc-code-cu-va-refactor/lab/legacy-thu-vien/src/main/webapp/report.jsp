<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head><title>Quá hạn - Thư viện</title></head>
<body>
<%@ include file="header.jsp" %>
<h3>Phiếu quá hạn từ ${days} ngày</h3>
<table border="1" cellpadding="4">
  <tr><th>Phiếu</th><th>Độc giả</th><th>Sách</th><th>Số ngày trễ</th><th>Phí dự kiến</th></tr>
  <c:forEach var="r" items="${rows}">
    <tr><td>${r.loanId}</td><td><c:out value="${r.reader}"/></td><td><c:out value="${r.title}"/></td><td>${r.daysLate}</td><td>${r.estFine}</td></tr>
  </c:forEach>
</table>
</body>
</html>
