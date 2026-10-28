-- accounts.sql — hai tài khoản, mỗi cái 1000.
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (id int PRIMARY KEY, owner text, balance int NOT NULL CHECK (balance >= 0));
INSERT INTO accounts VALUES (1, 'alice', 1000), (2, 'bob', 1000);
