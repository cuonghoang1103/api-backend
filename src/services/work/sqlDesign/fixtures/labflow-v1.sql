-- LabFlow (đồ án mẫu khoá "Một mình đóng 5 vai") — Flyway V1__init.sql, PostgreSQL. 15 bảng.
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  student_code VARCHAR(20),
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT ck_users_status CHECK (status IN ('ACTIVE', 'LOCKED', 'DISABLED'))
);
COMMENT ON COLUMN users.email IS 'Login e-mail (FPT mail)';
CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);
CREATE TABLE labs (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  manager_id BIGINT REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE rooms (
  id BIGSERIAL PRIMARY KEY,
  lab_id BIGINT NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  room_no VARCHAR(20) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  CONSTRAINT uq_rooms_lab_no UNIQUE (lab_id, room_no)
);
CREATE TABLE equipment_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);
CREATE TABLE equipment (
  id BIGSERIAL PRIMARY KEY,
  asset_tag VARCHAR(40) NOT NULL UNIQUE,
  category_id BIGINT NOT NULL REFERENCES equipment_categories(id),
  room_id BIGINT REFERENCES rooms(id) ON DELETE SET NULL,
  name VARCHAR(160) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'AVAILABLE',
  CONSTRAINT ck_equipment_status CHECK (status IN ('AVAILABLE', 'IN_USE', 'BROKEN', 'RETIRED'))
);
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  room_id BIGINT NOT NULL REFERENCES rooms(id),
  requester_id BIGINT NOT NULL REFERENCES users(id),
  approver_id BIGINT REFERENCES users(id),
  start_at TIMESTAMP NOT NULL,
  end_at TIMESTAMP NOT NULL,
  purpose TEXT,
  status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
  version INT NOT NULL DEFAULT 0,
  CONSTRAINT ck_bookings_time CHECK (end_at > start_at)
);
CREATE TABLE booking_items (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  equipment_id BIGINT NOT NULL REFERENCES equipment(id),
  quantity INT NOT NULL DEFAULT 1,
  CONSTRAINT uq_booking_items UNIQUE (booking_id, equipment_id)
);
CREATE TABLE maintenance_requests (
  id BIGSERIAL PRIMARY KEY,
  equipment_id BIGINT NOT NULL REFERENCES equipment(id),
  reported_by BIGINT NOT NULL REFERENCES users(id),
  description TEXT NOT NULL,
  priority VARCHAR(8) NOT NULL DEFAULT 'MEDIUM',
  status VARCHAR(16) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE maintenance_logs (
  id BIGSERIAL PRIMARY KEY,
  request_id BIGINT NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  technician_id BIGINT REFERENCES users(id),
  note TEXT NOT NULL,
  logged_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE issue_reports (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
  reporter_id BIGINT NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false
);
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message VARCHAR(500) NOT NULL,
  read_at TIMESTAMP
);
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(60) NOT NULL,
  entity VARCHAR(60) NOT NULL,
  entity_id BIGINT,
  at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE settings (
  key VARCHAR(80) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_by BIGINT REFERENCES users(id)
);
CREATE UNIQUE INDEX ux_bookings_room_slot ON bookings (room_id, start_at) WHERE status <> 'CANCELLED';
