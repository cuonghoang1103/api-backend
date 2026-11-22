<%@ page isErrorPage="true" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html><body>
<h2>Có lỗi xảy ra</h2>
<pre><% if (exception != null) exception.printStackTrace(new java.io.PrintWriter(out)); %></pre>
</body></html>
