-- bài 9.5: CÙNG dữ liệu, hai cách lưu — quan hệ (3 bảng) và tài liệu (1 cột JSONB mỗi phòng lab)
DROP TABLE IF EXISTS issues_r, devices_r, labs_r, labs_d;
CREATE TABLE labs_r (id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE devices_r (id int PRIMARY KEY, lab_id int NOT NULL REFERENCES labs_r, name text NOT NULL, status text NOT NULL);
CREATE TABLE issues_r (id int PRIMARY KEY, device_id int NOT NULL REFERENCES devices_r, title text NOT NULL, status text NOT NULL);
INSERT INTO labs_r SELECT g, 'Lab ' || g FROM generate_series(1, 1000) g;                                   -- 1.000 phòng
INSERT INTO devices_r SELECT g, (g - 1) / 30 + 1, 'Device ' || g, CASE WHEN g % 97 = 0 THEN 'MAINTENANCE' ELSE 'AVAILABLE' END
  FROM generate_series(1, 30000) g;                                                                         -- 30 thiết bị / phòng
INSERT INTO issues_r SELECT g, (g - 1) / 5 + 1, 'Issue ' || g, CASE WHEN g % 4 = 0 THEN 'OPEN' ELSE 'RESOLVED' END
  FROM generate_series(1, 150000) g;                                                                        -- 5 báo hỏng / thiết bị
CREATE INDEX ON devices_r (lab_id); CREATE INDEX ON issues_r (device_id); CREATE INDEX ON devices_r (status);
CREATE TABLE labs_d (id int PRIMARY KEY, doc jsonb NOT NULL);
INSERT INTO labs_d SELECT l.id, jsonb_build_object('id', l.id, 'name', l.name, 'devices', (
  SELECT jsonb_agg(jsonb_build_object('id', d.id, 'name', d.name, 'status', d.status, 'issues', (
    SELECT jsonb_agg(jsonb_build_object('id', i.id, 'title', i.title, 'status', i.status) ORDER BY i.id) FROM issues_r i WHERE i.device_id = d.id))
    ORDER BY d.id) FROM devices_r d WHERE d.lab_id = l.id)) FROM labs_r l;
CREATE INDEX labs_d_gin ON labs_d USING gin (doc jsonb_path_ops);
ANALYZE labs_r; ANALYZE devices_r; ANALYZE issues_r; ANALYZE labs_d;
SELECT pg_size_pretty(avg(pg_column_size(doc))::bigint) AS avg_doc, pg_size_pretty(pg_total_relation_size('labs_d')) AS doc_table,
  pg_size_pretty(pg_total_relation_size('labs_r') + pg_total_relation_size('devices_r') + pg_total_relation_size('issues_r')) AS relational FROM labs_d;
