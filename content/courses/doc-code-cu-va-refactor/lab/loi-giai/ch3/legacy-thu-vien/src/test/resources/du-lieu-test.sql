-- Dữ liệu cố định cho test: ngày tháng CỐ ĐỊNH (không dùng NOW()) để kết quả lặp lại được
DELETE FROM loans;
DELETE FROM books;
DELETE FROM readers;
INSERT INTO readers (id, name, type, phone) VALUES (1,'Nguyễn Văn An','SV','0901000001'),(2,'Trần Thị Bình','SV','0901000002'),(3,'Lê Minh Châu','GV','0901000003'),(4,'Phạm Quốc Dũng','KHACH','0901000004'),(5,'Hoàng Gia Huy','SV','0901000005');
-- available = quantity: trigger trg_loans_ai sẽ tự trừ khi nạp loans bên dưới (kể cả phiếu đã trả, y như dump)
INSERT INTO books VALUES (1,'CNTT001','Lập trình Java căn bản','Phạm Văn Ất',5,5),(2,'CNTT002','Cấu trúc dữ liệu và giải thuật','Đỗ Xuân Lôi',3,3),(3,'CNTT003','Clean Code','Robert C. Martin',2,2),(4,'CNTT004','Refactoring','Martin Fowler',2,2),(5,'CNTT005','Working Effectively with Legacy Code','Michael Feathers',1,1),(6,'KT001','Kinh tế vi mô','N. Gregory Mankiw',4,4),(7,'NN001','Tiếng Nhật sơ cấp 1','Minna no Nihongo',6,6);
INSERT INTO loans (id, book_id, reader_id, borrow_date, due_date, return_date, fine) VALUES (1,1,1,'2026-11-01 09:00:00','2026-11-15 09:00:00',NULL,0),(2,1,2,'2026-11-16 09:00:00','2026-11-30 09:00:00',NULL,0),(3,2,3,'2026-10-12 09:00:00','2026-11-11 09:00:00',NULL,0),(4,3,4,'2026-10-22 09:00:00','2026-10-29 09:00:00',NULL,0),(5,7,1,'2026-09-22 09:00:00','2026-10-06 09:00:00','2026-10-12 09:00:00',12000);
