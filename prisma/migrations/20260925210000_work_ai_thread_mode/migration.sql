-- CT Work: chế độ hội thoại AI (CHAT | DEFENSE). Thuần ADD COLUMN có mặc định.
ALTER TABLE "work_ai_threads" ADD COLUMN "mode" VARCHAR(12) NOT NULL DEFAULT 'CHAT';
