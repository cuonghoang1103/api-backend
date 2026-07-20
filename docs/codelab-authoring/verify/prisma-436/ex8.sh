setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}'
migrate init
echo "clean $([ -z "$(drift_script)" ] && echo yes || echo no)"
# drift: a hand-run statement no migration knows about
psql_x 'ALTER TABLE "User" ADD COLUMN "legacyFlag" BOOLEAN'
echo "drift $(drift_script | grep -o 'legacyFlag' | head -1)"
# repair: schema now describes reality, and a migration records it
write_schema '
model User {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  name       String
  legacyFlag Boolean?
}'
raw_migration 20260720120000_record_legacy_flag 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "legacyFlag" BOOLEAN;'
npx prisma migrate resolve --applied 20260720120000_record_legacy_flag >/dev/null 2>&1
echo "after $([ -z "$(drift_script)" ] && echo clean || echo dirty)"
echo "migrations $(ls -d prisma/migrations/*/ | wc -l | tr -d ' ')"
