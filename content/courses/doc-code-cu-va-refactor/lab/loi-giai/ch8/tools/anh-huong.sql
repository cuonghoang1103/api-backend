-- TV-108: dữ liệu đã hỏng chưa? Sách có "available" lệch với số bản thật còn trong kho
SELECT b.id, b.title, b.quantity, b.available,
       b.quantity - COUNT(l.id) AS dung_ra_phai_la
FROM books b LEFT JOIN loans l ON l.book_id = b.id AND l.return_date IS NULL
GROUP BY b.id, b.title, b.quantity, b.available
HAVING b.available <> b.quantity - COUNT(l.id);
