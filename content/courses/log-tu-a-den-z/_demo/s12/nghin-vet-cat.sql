\set a random(1, 1900000)
SELECT sum(total) FROM orders WHERE id BETWEEN :a AND :a + 60000;
