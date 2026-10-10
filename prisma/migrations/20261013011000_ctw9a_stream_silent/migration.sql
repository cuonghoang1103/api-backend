-- CTW đợt 9a: dòng Stream do 9b/9c đẩy vào với notify=false ⇒ đăng mà không chuông/email (kể cả khi cron đăng hộ lúc tới giờ).
ALTER TABLE "work_class_posts" ADD COLUMN "silent" BOOLEAN NOT NULL DEFAULT false;
