-- schema.sql — ba bảng cho bài 5.4: ghế của một suất chiếu, ví tiền, và các khoản thanh toán.
DROP TABLE IF EXISTS seats, wallets, payments, idempotency_keys;
CREATE TABLE seats    (show_id int, seat text, booked_by text, PRIMARY KEY (show_id, seat));
CREATE TABLE wallets  (id int PRIMARY KEY, balance int NOT NULL);
CREATE TABLE payments (id serial PRIMARY KEY, order_id int, amount int);
CREATE TABLE idempotency_keys (key text PRIMARY KEY, order_id int, response text);
INSERT INTO seats   VALUES (1, 'A7', NULL);
INSERT INTO wallets VALUES (1, 100);
