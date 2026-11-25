/**
 * 7.7 — Mốc dự án 7: tài khoản, vai trò và quyền sở hữu trong dự án (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: scratchpad/nst/lab/c7/moc7 (lab-booking, nối tiếp c6/moc6): Prisma 7.10.1 + PostgreSQL 16.16 (DB moc7, moc7_test, container nst-pg
 * 127.0.0.1:41601 — đã xoá), @nestjs/jwt 12.0.5, argon2 0.45.2, @casl/ability 7.1.3, @nestjs/throttler 6.8.0. Migration tai_khoan (enum Role,
 * users, refresh_tokens, manager_id, user_id) + migration viết tay huy_giai_phong_khung (EXCLUDE bỏ qua CANCELLED). Bẫy thật: @Throttle default
 * limit 5 ở login siết cả bộ đếm IP ⇒ test đỏ [401,401,429,429,429,429] ⇒ sửa bằng throttler tên 'login-email'. Vitest 31/31 xanh; xem.sh cổng
 * 41712 (41702 lúc đó bận, EADDRINUSE).
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-6-7-moc-du-an', title: 'NestJS 6.7 — Mốc dự án 6', sub: 'Điểm xuất phát của mốc này: PostgreSQL, ràng buộc chống đặt trùng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Dự án xuyên suốt', sub: 'Đề tài, 11 mốc và thang điểm 100.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-5-5-cuoc-dua-refresh', title: 'Authentication 5.5 — Cuộc đua refresh', sub: 'Hai tab cùng refresh một lúc: vì sao UPDATE có điều kiện.', cta: 'Mở bài →' }),
].join('\n');
const MA_SCHEMA = "enum Role {\n  STUDENT\n  LECTURER\n  ADMIN\n}\n\nmodel User {\n  id           Int            @id @default(autoincrement())\n  email        String         @unique @db.VarChar(120)\n  passwordHash String         @map(\"password_hash\")\n  role         Role           @default(STUDENT)\n  studentCode  String?        @unique @map(\"student_code\") @db.VarChar(8)\n  tokenVersion Int            @default(0) @map(\"token_version\")   // tăng ⇒ mọi access token cũ hết hiệu lực\n  createdAt    DateTime       @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n  bookings     Booking[]\n  rooms        Room[]         @relation(\"RoomManager\")\n  refresh      RefreshToken[]\n\n  @@map(\"users\")\n}\n\nmodel RefreshToken {\n  id        Int       @id @default(autoincrement())\n  hash      String    @unique @db.Char(64)          // SHA-256 của token — không lưu token gốc\n  userId    Int       @map(\"user_id\")\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  family    String    @db.Uuid                      // mọi token sinh ra từ một lần đăng nhập\n  expiresAt DateTime  @map(\"expires_at\") @db.Timestamptz(3)\n  revokedAt DateTime? @map(\"revoked_at\") @db.Timestamptz(3)\n\n  @@index([userId])\n  @@map(\"refresh_tokens\")\n}";
const MA_MIG = "-- Viết tay (mốc 7): lịch đã HUỶ cũng phải trả lại khung giờ — ràng buộc mốc 6 chỉ bỏ qua REJECTED\nALTER TABLE \"bookings\" DROP CONSTRAINT \"bookings_khong_trung\";\nALTER TABLE \"bookings\" ADD CONSTRAINT \"bookings_khong_trung\"\n  EXCLUDE USING gist (room_id WITH =, tstzrange(\"start\", \"end\", '[)') WITH &&)\n  WHERE (status NOT IN ('REJECTED', 'CANCELLED'));";
const OUT_MIG = "$ npx prisma migrate deploy && npx prisma migrate dev --name tai_khoan\nAll migrations have been successfully applied.\nYour database is now in sync with your schema.";
const MA_DEC = "// decorators.ts — mọi route PHẢI có đúng một trong ba: @Public(), @AnyUser(), @CanPerm(...). Thiếu ⇒ 403 (mặc định đóng)\nimport { createParamDecorator, ExecutionContext } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport type { Perm } from './permissions.js';\n\nexport type CurrentUserT = { id: number; role: 'STUDENT' | 'LECTURER' | 'ADMIN'; studentCode: string | null };\nexport const Public = Reflector.createDecorator<boolean>({ transform: () => true });\nexport const AnyUser = Reflector.createDecorator<boolean>({ transform: () => true });   // đăng nhập là đủ; luật chi tiết ở service\nexport const CanPerm = Reflector.createDecorator<Perm>();\nexport const CurrentUser = createParamDecorator((_: unknown, c: ExecutionContext): CurrentUserT => c.switchToHttp().getRequest().user);";
const MA_PERM = "// permissions.ts — MỘT chỗ nói vai trò nào làm được gì (luật theo từng bản ghi ở booking.policy.ts)\nimport type { CurrentUserT } from './decorators.js';\nexport type Perm = 'room:write' | 'booking:create' | 'user:manage';\nexport const QUYEN: Record<CurrentUserT['role'], Perm[]> = {\n  STUDENT: ['booking:create'],\n  LECTURER: ['booking:create'],\n  ADMIN: ['room:write', 'booking:create', 'user:manage'],\n};";
const MA_JWT = "/** Guard toàn cục #1: ai đang gọi. Đọc vai trò HIỆN TẠI từ DB (1 truy vấn theo khoá chính) và so tokenVersion (bài 7.3). */\n@Injectable()\nexport class JwtAuthGuard implements CanActivate {\n  private readonly log = new Logger(JwtAuthGuard.name);\n  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector, private readonly db: PrismaService) {}\n  async canActivate(ctx: ExecutionContext) {\n    if (this.reflector.getAllAndOverride(Public, [ctx.getHandler(), ctx.getClass()])) return true;\n    const req = ctx.switchToHttp().getRequest();\n    const token = /^Bearer (\\S+)$/.exec(req.headers.authorization ?? '')?.[1];\n    if (!token) throw new UnauthorizedException('Thiếu Bearer token');\n    let p: { sub: string; ver: number };\n    try { p = await this.jwt.verifyAsync(token); } catch (e) {\n      this.log.warn(`token bị từ chối: ${(e as Error).message}`);\n      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');\n    }\n    const u = await this.db.user.findUnique({ where: { id: Number(p.sub) }, select: { id: true, role: true, studentCode: true, tokenVersion: true } });\n    if (!u || u.tokenVersion !== p.ver) throw new UnauthorizedException('Phiên đã bị thu hồi');\n    req.user = { id: u.id, role: u.role, studentCode: u.studentCode };\n    return true;\n  }\n}";
const MA_PG = "/** Guard toàn cục #2 (đứng SAU JwtAuthGuard): quyền theo vai trò. Route không khai gì ⇒ 403. */\n@Injectable()\nexport class PermGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n  canActivate(ctx: ExecutionContext) {\n    const dich = [ctx.getHandler(), ctx.getClass()];\n    if (this.reflector.getAllAndOverride(Public, dich) || this.reflector.getAllAndOverride(AnyUser, dich)) return true;\n    const perm = this.reflector.getAllAndOverride(CanPerm, dich);\n    if (!perm) throw new ForbiddenException('Route chưa khai quyền', { errorCode: 'ROUTE_NOT_DECLARED' });\n    const u: CurrentUserT = ctx.switchToHttp().getRequest().user;\n    if (!QUYEN[u.role].includes(perm)) throw new ForbiddenException(`Cần quyền ${perm}`, { errorCode: 'FORBIDDEN' });\n    return true;\n  }\n}";
const MA_POL = "// booking.policy.ts — luật theo TỪNG lịch (CASL, bài 7.4). Hàm thuần: test không cần HTTP/DB\nimport { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';\nimport type { CurrentUserT } from './decorators.js';\n\nexport type BookingSubject = { userId: number | null; roomId: number; status: string; managerId: number | null };\nexport type Act = 'read' | 'cancel' | 'approve' | 'reject';\nexport type BookingAbility = MongoAbility<[Act | 'manage', 'Booking' | (BookingSubject & { __caslSubjectType__?: 'Booking' })]>;\n\nexport function bookingAbility(u: CurrentUserT): BookingAbility {\n  const { can, cannot, build } = new AbilityBuilder<BookingAbility>(createMongoAbility);\n  if (u.role === 'ADMIN') can('manage', 'Booking');\n  can('read', 'Booking', { userId: u.id });\n  can('cancel', 'Booking', { userId: u.id, status: { $in: ['PENDING', 'APPROVED'] } });\n  if (u.role === 'LECTURER') {\n    can('read', 'Booking', { managerId: u.id });\n    can(['approve', 'reject'], 'Booking', { managerId: u.id, status: 'PENDING' });\n  }\n  cannot(['cancel', 'approve', 'reject'], 'Booking', { status: { $in: ['CANCELLED', 'REJECTED'] } }).because('Lịch đã kết thúc');\n  return build();\n}";
const MA_SVC = "const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');\nconst SAI = 'Email hoặc mật khẩu không đúng';\n\n@Injectable()\nexport class AuthService {\n  private readonly hashGia = argon2.hash(randomBytes(16).toString('hex'));   // để email không tồn tại cũng tốn một lần verify\n  private readonly refreshDays: number;\n  constructor(private readonly db: PrismaService, private readonly jwt: JwtService, c: ConfigService<Env, true>) {\n    this.refreshDays = c.get('REFRESH_DAYS', { infer: true });\n  }\n\n  async register(d: RegisterDto) {\n    try {\n      const u = await this.db.user.create({ data: { email: d.email.toLowerCase(), studentCode: d.studentCode, passwordHash: await argon2.hash(d.password) } });\n      return { id: u.id, email: u.email, role: u.role };\n    } catch (e) {\n      if (laPrisma(e, 'P2002')) throw new ConflictException('Email hoặc mã sinh viên đã được đăng ký', { errorCode: 'ACCOUNT_EXISTS' });\n      throw e;\n    }\n  }\n\n  async login(d: LoginDto) {\n    const u = await this.db.user.findUnique({ where: { email: d.email.toLowerCase() } });\n    const dung = await argon2.verify(u?.passwordHash ?? (await this.hashGia), d.password);\n    if (!u || !dung) throw new UnauthorizedException(SAI, { errorCode: 'BAD_CREDENTIALS' });\n    return this.capMoi(u, randomUUID());\n  }\n\n  /** Xoay vòng: token cũ thu hồi, cấp cặp mới cùng họ. Token đã thu hồi mà quay lại ⇒ thu hồi cả họ (auth 5.2). */\n  async refresh(token: string) {\n    const r = await this.db.refreshToken.findUnique({ where: { hash: sha256(token) }, include: { user: true } });\n    if (!r || r.expiresAt < new Date()) throw new UnauthorizedException('Refresh token không hợp lệ', { errorCode: 'BAD_REFRESH' });\n    // đánh dấu đã dùng bằng UPDATE có điều kiện: hai request cùng token thì chỉ một bên thắng\n    const { count } = await this.db.refreshToken.updateMany({ where: { id: r.id, revokedAt: null }, data: { revokedAt: new Date() } });\n    if (count === 0) {\n      await this.db.refreshToken.updateMany({ where: { family: r.family, revokedAt: null }, data: { revokedAt: new Date() } });\n      throw new UnauthorizedException('Refresh token đã dùng — mọi phiên của lần đăng nhập này bị thu hồi', { errorCode: 'REFRESH_REUSED' });\n    }\n    return this.capMoi(r.user, r.family);\n  }\n\n  async logout(token: string) {\n    await this.db.refreshToken.updateMany({ where: { hash: sha256(token), revokedAt: null }, data: { revokedAt: new Date() } });\n  }\n\n  private async capMoi(u: { id: number; tokenVersion: number }, family: string) {\n    const refreshToken = randomBytes(32).toString('base64url');            // 43 ký tự, token mờ\n    await this.db.refreshToken.create({ data: { hash: sha256(refreshToken), userId: u.id, family, expiresAt: new Date(Date.now() + this.refreshDays * 864e5) } });\n    return { accessToken: await this.jwt.signAsync({ sub: String(u.id), ver: u.tokenVersion }), refreshToken };\n  }\n}";
const MA_THR = "// login-throttle.ts — bộ đếm thứ hai, CHỈ cho route có @DemDangNhap(): 5 lần / 15 phút / EMAIL (botnet đổi IP vẫn bị chặn).\n// Bộ đếm 'default' (100/phút/IP) giữ nguyên cho mọi route — cả phòng máy chung một IP NAT vẫn đăng nhập được.\nimport { Reflector } from '@nestjs/core';\nimport type { ExecutionContext } from '@nestjs/common';\nimport type { ThrottlerOptions } from '@nestjs/throttler';\n\nexport const DemDangNhap = Reflector.createDecorator<boolean>({ transform: () => true });\nexport const THROTTLERS: ThrottlerOptions[] = [\n  { name: 'default', ttl: 60_000, limit: 100 },\n  {\n    name: 'login-email', ttl: 15 * 60_000, limit: 5,\n    skipIf: (ctx: ExecutionContext) => !Reflect.getMetadata(DemDangNhap.KEY, ctx.getHandler()),\n    getTracker: (req: Record<string, any>) => `email:${String(req.body?.email ?? '').toLowerCase()}`,\n  },\n];";
const MA_CTRL = "@Controller('auth')\nexport class AuthController {\n  constructor(private readonly auth: AuthService) {}\n  @Post('register') @Public() register(@Body() d: RegisterDto) { return this.auth.register(d); }\n\n  @Post('login') @Public() @HttpCode(200) @DemDangNhap()      // bộ đếm 'login-email' (bài 7.5)\n  login(@Body() d: LoginDto) { return this.auth.login(d); }\n\n  @Post('refresh') @Public() @HttpCode(200) refresh(@Body() d: RefreshDto) { return this.auth.refresh(d.refreshToken); }\n  @Post('logout') @Public() @HttpCode(204) async logout(@Body() d: RefreshDto) { await this.auth.logout(d.refreshToken); }\n  @Get('me') @AnyUser() me(@CurrentUser() u: CurrentUserT) { return u; }\n}";
const MA_APPM = "  providers: [\n    { provide: APP_GUARD, useClass: ThrottlerGuard },   // thứ tự = thứ tự chạy: đếm trước (kể cả request không token)\n    { provide: APP_GUARD, useClass: JwtAuthGuard },     // ai đang gọi\n    { provide: APP_GUARD, useClass: PermGuard },        // được làm gì\n    { provide: APP_FILTER, useClass: ProblemFilter },\n    {\n      provide: APP_PIPE,                       // trong module ⇒ test nạp AppModule cũng có cùng cấu hình\n      useFactory: () => new ValidationPipe({\n        whitelist: true, forbidNonWhitelisted: true, transform: true, stopAtFirstError: true,\n        validationError: { target: false, value: false },\n      }),\n    },\n  ],\n})\nexport class AppModule {}";
const MA_BKS = "  /** Không được XEM ⇒ 404 (không lộ là lịch có tồn tại); xem được mà không được làm ⇒ 403 kèm lý do (bài 7.4) */\n  private async kiem(u: CurrentUserT, id: number, act: Act) {\n    const b = await this.db.booking.findUnique({ where: { id }, include: { room: { select: { managerId: true } } } });\n    if (!b) throw new NotFoundException(`không có lịch ${id}`, { errorCode: 'BOOKING_NOT_FOUND' });\n    const a = bookingAbility(u), sub = subject('Booking', { userId: b.userId, roomId: b.roomId, status: b.status, managerId: b.room.managerId });\n    if (!a.can('read', sub)) throw new NotFoundException(`không có lịch ${id}`, { errorCode: 'BOOKING_NOT_FOUND' });\n    if (act !== 'read' && !a.can(act, sub)) throw new ForbiddenException(a.relevantRuleFor(act, sub)?.reason ?? `không được ${act} lịch này`, { errorCode: 'FORBIDDEN' });\n    return b;\n  }\n  findOne(u: CurrentUserT, id: number) { return this.kiem(u, id, 'read'); }\n\n  async setStatus(u: CurrentUserT, id: number, act: 'cancel' | 'approve' | 'reject') {\n    const b = await this.kiem(u, id, act);\n    const status = { cancel: 'CANCELLED', approve: 'APPROVED', reject: 'REJECTED' }[act];\n    // UPDATE có điều kiện version: hai người cùng bấm thì một người nhận 409 (bài 6.5)\n    const { count } = await this.db.booking.updateMany({ where: { id, version: b.version }, data: { status, version: { increment: 1 } } });\n    if (count === 0) throw new ConflictException('lịch vừa bị người khác thay đổi', { errorCode: 'BOOKING_CHANGED' });\n    return { ...b, status, version: b.version + 1 };\n  }\n}";
const MA_SAI = "/** Đếm số lần đăng nhập theo EMAIL (thêm vào bộ đếm theo IP toàn cục) — botnet đổi IP vẫn bị chặn (bài 7.5) */\n@Injectable()\nexport class LoginByEmailGuard extends ThrottlerGuard {\n  protected async getTracker(req: Record<string, any>) { return `login:${String(req.body?.email ?? '').toLowerCase()}`; }\n}\n// …\n  @Post('login') @Public() @HttpCode(200)\n  @UseGuards(LoginByEmailGuard) @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } })";
const OUT_SAI = "$ npx vitest run src/common/moc7.e2e.spec.ts   # bản đầu: @Throttle({ default: { limit: 5, ttl: 15 phút } }) + guard theo email\n FAIL  src/common/moc7.e2e.spec.ts > Mốc 7 — tài khoản, vai trò, quyền sở hữu > dò mật khẩu một tài khoản: lần thứ 6 ⇒ 429 có Retry-After\nAssertionError: expected [ 401, 401, 429, 429, 429, 429 ] to deeply equal [ 401, 401, 401, 401, 401, 429 ]";
const MA_E2E = "  it('đăng ký: không trả hash, không tự đặt vai trò, email trùng ⇒ 409', async () => {\n    const D = { email: 'chi@fpt.edu.vn', password: 'mot-mat-khau-dai', studentCode: 'SE170009' };\n    expect((await http().post('/auth/register').send(D).expect(201)).body).toEqual({ id: 6, email: 'chi@fpt.edu.vn', role: 'STUDENT' });\n    expect((await http().post('/auth/register').send({ ...D, email: 'x@fpt.edu.vn', studentCode: 'SE170010', role: 'ADMIN' }).expect(400)).body.errors).toEqual(['property role should not exist']);\n    expect((await http().post('/auth/register').send({ ...D, studentCode: 'SE170011' }).expect(409)).body.type).toMatch(/ACCOUNT_EXISTS$/);\n  });\n  it('đăng nhập: sai email và sai mật khẩu trả CÙNG một câu', async () => {\n    const a = await http().post('/auth/login').send({ email: 'khong-co@fpt.edu.vn', password: 'x' }).expect(401);\n    const b = await http().post('/auth/login').send({ email: NGUOI.an.email, password: 'sai' }).expect(401);\n    expect(a.body.detail).toBe(b.body.detail);\n  });\n  it('refresh xoay vòng; dùng lại token cũ ⇒ thu hồi cả họ, token mới nhất cũng chết', async () => {\n    const l = (await http().post('/auth/login').send({ email: NGUOI.binh.email, password: MAT_KHAU }).expect(200)).body;\n    const r2 = (await http().post('/auth/refresh').send({ refreshToken: l.refreshToken }).expect(200)).body;\n    expect((await http().post('/auth/refresh').send({ refreshToken: l.refreshToken }).expect(401)).body.type).toMatch(/REFRESH_REUSED$/);\n    await http().post('/auth/refresh').send({ refreshToken: r2.refreshToken }).expect(401);\n    expect(await db.refreshToken.count({ where: { userId: NGUOI.binh.id, revokedAt: null } })).toBe(0);\n    expect((await http().get('/auth/me').set('authorization', `Bearer ${r2.accessToken}`).expect(200)).body.role).toBe('STUDENT');\n  });\n  it('mặc định đóng: không token ⇒ 401; sinh viên tạo phòng ⇒ 403; admin ⇒ 201', async () => {\n    await http().get('/bookings/mine').expect(401);\n    await http().post('/rooms').set(bearer(app, 'an')).send({ code: 'GA-310', building: 'Gamma', capacity: 40 }).expect(403);\n    await http().post('/rooms').set(bearer(app, 'admin')).send({ code: 'GA-310', building: 'Gamma', capacity: 40 }).expect(201);\n  });\n  it('chủ lịch lấy từ token — body có studentId ⇒ 400', async () => {\n    await http().post('/bookings').set(bearer(app, 'an')).send({ roomId: 1, studentId: 'SE170002', start: '2027-01-04T07:30:00+07:00', end: '2027-01-04T09:30:00+07:00', attendees: 5 }).expect(400);\n    const b = (await dat('an', 1, '05').expect(201)).body;\n    expect(b.userId).toBe(NGUOI.an.id);\n  });\n  it('IDOR: Bình không xem/huỷ được lịch của An (404); An huỷ được; huỷ lần hai ⇒ 403', async () => {\n    const id = (await dat('an', 1, '06').expect(201)).body.id;\n    await http().get(`/bookings/${id}`).set(bearer(app, 'binh')).expect(404);\n    await http().delete(`/bookings/${id}`).set(bearer(app, 'binh')).expect(404);\n    expect((await http().delete(`/bookings/${id}`).set(bearer(app, 'an')).expect(200)).body.status).toBe('CANCELLED');\n    expect((await http().delete(`/bookings/${id}`).set(bearer(app, 'an')).expect(403)).body.detail).toBe('Lịch đã kết thúc');\n    await dat('binh', 1, '06').expect(201);                   // lịch huỷ trả lại khung giờ (migration mốc 7)\n  });\n  it('duyệt: giảng viên quản lý phòng ⇒ 200; giảng viên khác ⇒ 404; sinh viên chủ lịch ⇒ 403', async () => {\n    const id = (await dat('an', 1, '07').expect(201)).body.id;\n    await http().patch(`/bookings/${id}/approve`).set(bearer(app, 'gv2')).expect(404);\n    await http().patch(`/bookings/${id}/approve`).set(bearer(app, 'an')).expect(403);\n    expect((await http().patch(`/bookings/${id}/approve`).set(bearer(app, 'gv')).expect(200)).body.status).toBe('APPROVED');\n  });\n  it('/bookings/mine chỉ có lịch của mình', async () => {\n    const r = await http().get('/bookings/mine').set(bearer(app, 'binh')).expect(200);\n    expect(r.body.every((b: { userId: number }) => b.userId === NGUOI.binh.id)).toBe(true);\n  });\n  it('hạ vai trò / tăng tokenVersion ⇒ token cũ 401 ngay, không chờ hết hạn', async () => {\n    await http().get('/auth/me').set(bearer(app, 'gv2')).expect(200);\n    await db.user.update({ where: { id: NGUOI.gv2.id }, data: { role: 'STUDENT', tokenVersion: { increment: 1 } } });\n    expect((await http().get('/auth/me').set(bearer(app, 'gv2')).expect(401)).body.detail).toBe('Phiên đã bị thu hồi');\n  });\n  it('dò mật khẩu một tài khoản: lần thứ 6 ⇒ 429 có Retry-After', async () => {\n    const ma: number[] = []; let cuoi: request.Response | undefined;\n    for (let i = 0; i < 6; i++) { cuoi = await http().post('/auth/login').send({ email: NGUOI.gv.email, password: `doan-${i}` }); ma.push(cuoi.status); }\n    expect(ma).toEqual([401, 401, 401, 401, 401, 429]);\n    expect(Number(cuoi!.headers['retry-after-login-email'])).toBeGreaterThan(0);\n  });\n});";
const OUT_TEST = "$ npx vitest run\n RUN  v4.1.12 /home/sv/lab-booking\n Test Files  7 passed (7)\n      Tests  31 passed (31)\n   Start at  07:31:39\n   Duration  10.39s (transform 286ms, setup 1.62s, import 2.36s, tests 4.04s, environment 1ms)";
const OUT_TV = "$ npx vitest run src/common/moc7.e2e.spec.ts --reporter=verbose\n ✓ đăng ký: không trả hash, không tự đặt vai trò, email trùng ⇒ 409 161ms\n ✓ đăng nhập: sai email và sai mật khẩu trả CÙNG một câu 113ms\n ✓ refresh xoay vòng; dùng lại token cũ ⇒ thu hồi cả họ, token mới nhất cũng chết 114ms\n ✓ mặc định đóng: không token ⇒ 401; sinh viên tạo phòng ⇒ 403; admin ⇒ 201 17ms\n ✓ chủ lịch lấy từ token — body có studentId ⇒ 400 20ms\n ✓ IDOR: Bình không xem/huỷ được lịch của An (404); An huỷ được; huỷ lần hai ⇒ 403 62ms\n ✓ duyệt: giảng viên quản lý phòng ⇒ 200; giảng viên khác ⇒ 404; sinh viên chủ lịch ⇒ 403 34ms\n ✓ /bookings/mine chỉ có lịch của mình 9ms\n ✓ hạ vai trò / tăng tokenVersion ⇒ token cũ 401 ngay, không chờ hết hạn 16ms\n ✓ dò mật khẩu một tài khoản: lần thứ 6 ⇒ 429 có Retry-After 247ms\n      Tests  10 passed (10)";
const OUT_XEM = "$ node dist/seed.js\nseed: tài khoản = 3 · phòng = 3\n$ POST /auth/register (Bình) → {\"id\":7,\"email\":\"binh.se170002@fpt.edu.vn\",\"role\":\"STUDENT\"}\n$ GET /auth/me (An) → {\"id\":3,\"role\":\"STUDENT\",\"studentCode\":\"SE170001\"}\n$ POST /bookings (An) → {\"id\":1,\"roomId\":1,\"userId\":3,\"start\":\"2027-03-02T00:30:00.000Z\",\"end\":\"2027-03-02T02:30:00.000Z\",\"attendees\":12,\"status\":\"PENDING\"}\n$ DELETE /bookings/1 (Bình) → {\"status\":404,\"type\":\"https://lab-booking.example/errors/BOOKING_NOT_FOUND\",\"detail\":\"không có lịch 1\"}\n$ PATCH /bookings/1/approve (gv.lan, quản lý AL-201) → {\"id\":1,\"status\":\"APPROVED\",\"userId\":3}\n$ POST /rooms (An) → {\"status\":403,\"detail\":\"Cần quyền room:write\"}\n$ GET /bookings/mine (không token) → {\"status\":401,\"detail\":\"Thiếu Bearer token\"}";
const OUT_DIFF = "$ diff -r moc6/src moc7/src --brief   (bỏ src/generated)\nFiles moc6/src/app.module.ts and moc7/src/app.module.ts differ\nOnly in moc7/src: auth\nFiles moc6/src/bookings/bookings.controller.ts and moc7/src/bookings/bookings.controller.ts differ\nFiles moc6/src/bookings/bookings.service.spec.ts and moc7/src/bookings/bookings.service.spec.ts differ\nFiles moc6/src/bookings/bookings.service.ts and moc7/src/bookings/bookings.service.ts differ\nFiles moc6/src/bookings/dto/booking.response.ts and moc7/src/bookings/dto/booking.response.ts differ\nFiles moc6/src/bookings/dto/create-booking.dto.ts and moc7/src/bookings/dto/create-booking.dto.ts differ\nOnly in moc6/src/common: api-key.guard.ts\nFiles moc6/src/common/moc4.e2e.spec.ts and moc7/src/common/moc4.e2e.spec.ts differ\nFiles moc6/src/common/moc5.e2e.spec.ts and moc7/src/common/moc5.e2e.spec.ts differ\nFiles moc6/src/common/moc6.e2e.spec.ts and moc7/src/common/moc6.e2e.spec.ts differ\nOnly in moc7/src/common: moc7.e2e.spec.ts\nFiles moc6/src/common/pipeline.e2e.spec.ts and moc7/src/common/pipeline.e2e.spec.ts differ\nFiles moc6/src/config/env.schema.spec.ts and moc7/src/config/env.schema.spec.ts differ\nFiles moc6/src/config/env.schema.ts and moc7/src/config/env.schema.ts differ\nFiles moc6/src/main.ts and moc7/src/main.ts differ\nFiles moc6/src/rooms/rooms.controller.ts and moc7/src/rooms/rooms.controller.ts differ\nFiles moc6/src/seed.ts and moc7/src/seed.ts differ\nOnly in moc7/src/test: auth.ts\nFiles moc6/src/test/db-reset.ts and moc7/src/test/db-reset.ts differ\n$ thêm: 2 migration (tai_khoan, huy_giai_phong_khung); bỏ: API_KEYS, x-api-key";
const MA_ENV = "  JWT_SECRET: z.string().min(32, 'JWT_SECRET cần ≥ 32 ký tự (openssl rand -base64 32)'),\n  JWT_TTL_SECONDS: z.coerce.number().int().min(60).max(3600).default(900),     // access token: 15 phút\n  REFRESH_DAYS: z.coerce.number().int().min(1).max(90).default(14),\n  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0),               // số proxy đứng trước (nginx = 1)";

export default {
  title: '7.7 — Project milestone 7: accounts, roles and ownership in your project|||7.7 — Mốc dự án 7: tài khoản, vai trò và quyền sở hữu trong dự án',
  slug: 'nst-7-7-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'lab-booking bỏ khoá API dùng chung: bảng users và refresh_tokens, đăng ký/đăng nhập argon2, refresh xoay vòng trong PostgreSQL, ba guard toàn cục (throttler, JWT có tokenVersion, quyền mặc định đóng), luật CASL cho lịch, chủ lịch lấy từ token. Bẫy thật khi làm: @Throttle ở route đăng nhập siết cả bộ đếm theo IP, cả phòng máy chung một IP NAT bị 429 sau 5 lần đăng nhập — sửa bằng throttler riêng theo email. 31/31 test xanh, chạy thật bằng curl.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Project milestone 7</span>
<h2>7.7 — Milestone 7: your project knows who is calling</h2>
<p class="lead">After milestone 6 lab-booking stores data in PostgreSQL, but every caller is "whoever has the API key", and the booking's <code>studentId</code> is whatever the client writes in the body. This milestone adds accounts, roles and ownership. Do the same for your own topic: who are the actors, which actions does each role have, and which record belongs to whom?</p>

<h3>What changes</h3>
<div class="out">${esc(OUT_DIFF)}</div>

<h3>Schema: users, refresh tokens, owners</h3>
<pre><code class="language-prisma">${esc(MA_SCHEMA)}</code></pre>
<p>Two existing tables change too: <code>rooms</code> gets <code>manager_id</code> (the lecturer who approves its bookings) and <code>bookings</code> gets <code>user_id</code> (the owner). <code>user_id</code> is nullable on purpose — bookings created with the API key in milestones 3–6 have no owner, and only an admin may manage them. <code>student_id</code> stays but is now filled from the account, never from the body.</p>
<div class="out">${esc(OUT_MIG)}</div>
<p>Writing the cancel endpoint revealed a bug in milestone 6: the exclusion constraint ignored only <code>REJECTED</code> bookings, so a <strong>cancelled</strong> booking kept blocking its time slot. A hand-written migration fixes it:</p>
<pre><code class="language-sql">${esc(MA_MIG)}</code></pre>

<h3>Decorators, permissions, guards</h3>
<pre><code class="language-ts">${esc(MA_DEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_PERM)}</code></pre>
<pre><code class="language-ts">${esc(MA_JWT)}</code></pre>
<pre><code class="language-ts">${esc(MA_PG)}</code></pre>
<pre><code class="language-ts">${esc(MA_APPM)}</code></pre>
<p>Three global guards in a fixed order: count the request (also unauthenticated ones), find out who is calling — reading the <em>current</em> role and <code>tokenVersion</code> from the database (lesson 7.3) — and check the permission. A route that declares nothing is 403.</p>

<h3>The auth service on Prisma</h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<p>Compared with lesson 7.2: tokens live in <code>refresh_tokens</code>; marking a token used is an <code>updateMany</code> with <code>revokedAt: null</code> in the <code>where</code>, so two parallel refresh calls with the same token cannot both succeed — the loser is treated as reuse (Authentication 5.5 discusses when that is too strict). New secrets in the schema: <code>JWT_SECRET</code> (≥ 32 characters, sample values refused in production), <code>JWT_TTL_SECONDS</code>, <code>REFRESH_DAYS</code>, <code>TRUST_PROXY</code>:</p>
<pre><code class="language-ts">${esc(MA_ENV)}</code></pre>

<h3>Ownership in the bookings service</h3>
<pre><code class="language-ts">${esc(MA_POL)}</code></pre>
<pre><code class="language-ts">${esc(MA_BKS)}</code></pre>
<p>The policy from lesson 7.4 with real data: the room's <code>managerId</code> is loaded together with the booking. Status changes use the <code>version</code> column from milestone 6, so an approve and a cancel at the same moment cannot both win.</p>

<h3>A real trap: one decorator, two counters</h3>
<p>The first version limited login like this:</p>
<pre><code class="language-ts">${esc(MA_SAI)}</code></pre>
<div class="out">${esc(OUT_SAI)}</div>
<p>The test expected five 401s then a 429, and got 429 from the <em>third</em> attempt. Earlier tests in the same file had logged in from the same IP (127.0.0.1). <code>@Throttle({ default: … })</code> does not only configure the email guard — the global per-IP <code>ThrottlerGuard</code> reads the same <code>default</code> throttler and applied "5 per 15 minutes per IP" to the login route. In production, a computer lab of 40 students behind one campus NAT address would be locked out after five logins. The fix gives the email counter its own name, active only on the login route:</p>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>

<h3>Tests</h3>
<p>Old tests were updated, not deleted: <code>x-api-key</code> became a Bearer token signed by the app's <code>JwtService</code> (helper <code>src/test/auth.ts</code>; <code>db-reset.ts</code> now creates five accounts), <code>studentId</code> left the request bodies, and two expected responses gained <code>managerId</code>/<code>userId</code>.</p>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<div class="out">${esc(OUT_TV)}</div>

<h3>Running it for real</h3>
<div class="out">${esc(OUT_XEM)}</div>
<p>The seed takes its password from <code>SEED_PASSWORD</code> instead of the source code. Bình registers, An books room AL-201, Bình's attempt to cancel it is a 404, the lecturer who manages AL-201 approves it, and An cannot create rooms.</p>

<h3>Self-assessment (10 points toward the project rubric)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Register/login/refresh/logout; passwords hashed with argon2id or bcrypt; refresh tokens stored hashed and rotated; no hash in any response</td><td>3</td></tr>
<tr><td>Closed by default: global auth + permission guards; a route without a declaration is refused (test proves it)</td><td>2</td></tr>
<tr><td>At least 2 roles and 1 ownership rule; the owner comes from the token, never from the body; another user's record is 404</td><td>2</td></tr>
<tr><td>A demoted/disabled account loses access on the next request (tokenVersion or equivalent), with a test</td><td>1</td></tr>
<tr><td>Login limited per account and per IP without locking a whole NAT; <code>TRUST_PROXY</code> documented; all earlier tests green</td><td>2</td></tr>
</tbody>
</table>

<h3>README section</h3>
<pre><code class="language-markdown">## Authentication &amp; authorization (milestone 7)
- POST /auth/register · /auth/login · /auth/refresh · /auth/logout · GET /auth/me
- Access token 15 min (JWT_TTL_SECONDS), refresh 14 days (REFRESH_DAYS), rotated, stored as SHA-256
- Roles: STUDENT · LECTURER (approves bookings of rooms they manage) · ADMIN
- Every route declares @Public / @AnyUser / @CanPerm — undeclared routes return 403
- Behind nginx set TRUST_PROXY=1. Login: 100/min per IP, 5 per 15 min per email
- Dev data: SEED_PASSWORD=… node dist/seed.js</code></pre>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Mốc dự án 7</span>
<h2>7.7 — Mốc 7: dự án của bạn biết ai đang gọi</h2>
<p class="lead">Sau mốc 6, lab-booking lưu dữ liệu trong PostgreSQL, nhưng người gọi nào cũng là "ai đó có khoá API", và <code>studentId</code> của lịch là bất cứ thứ gì client ghi vào body. Mốc này thêm tài khoản, vai trò và quyền sở hữu. Làm tương tự cho đề tài của bạn: ai là các tác nhân, mỗi vai trò có những thao tác nào, và bản ghi nào thuộc về ai?</p>

<h3>Những gì thay đổi</h3>
<div class="out">${esc(OUT_DIFF)}</div>

<h3>Schema: người dùng, refresh token, chủ sở hữu</h3>
<pre><code class="language-prisma">${esc(MA_SCHEMA)}</code></pre>
<p>Hai bảng cũ cũng đổi: <code>rooms</code> có thêm <code>manager_id</code> (giảng viên duyệt lịch của phòng) và <code>bookings</code> có thêm <code>user_id</code> (chủ lịch). <code>user_id</code> cố ý cho phép null — các lịch tạo bằng khoá API ở mốc 3–6 không có chủ, và chỉ admin được xử lý chúng. <code>student_id</code> vẫn giữ nhưng giờ lấy từ tài khoản, không bao giờ từ body.</p>
<div class="out">${esc(OUT_MIG)}</div>
<p>Khi viết endpoint huỷ lịch thì lộ ra một lỗi của mốc 6: ràng buộc loại trừ chỉ bỏ qua lịch <code>REJECTED</code>, nên lịch <strong>đã huỷ</strong> vẫn chiếm khung giờ. Một migration viết tay sửa nó:</p>
<pre><code class="language-sql">${esc(MA_MIG)}</code></pre>

<h3>Decorator, quyền, guard</h3>
<pre><code class="language-ts">${esc(MA_DEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_PERM)}</code></pre>
<pre><code class="language-ts">${esc(MA_JWT)}</code></pre>
<pre><code class="language-ts">${esc(MA_PG)}</code></pre>
<pre><code class="language-ts">${esc(MA_APPM)}</code></pre>
<p>Ba guard toàn cục theo thứ tự cố định: đếm request (cả request chưa xác thực), tìm xem ai đang gọi — đọc vai trò <em>hiện tại</em> và <code>tokenVersion</code> từ cơ sở dữ liệu (bài 7.3) — rồi kiểm quyền. Route không khai gì nhận 403.</p>

<h3>Service xác thực trên Prisma</h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<p>So với bài 7.2: token nằm trong <code>refresh_tokens</code>; đánh dấu đã dùng bằng <code>updateMany</code> có <code>revokedAt: null</code> trong <code>where</code>, nên hai lần refresh song song cùng một token không thể cùng thành công — bên thua bị coi là tái dùng (Authentication 5.5 bàn khi nào như vậy là quá chặt). Bí mật mới trong schema: <code>JWT_SECRET</code> (≥ 32 ký tự, giá trị mẫu bị chặn ở production), <code>JWT_TTL_SECONDS</code>, <code>REFRESH_DAYS</code>, <code>TRUST_PROXY</code>:</p>
<pre><code class="language-ts">${esc(MA_ENV)}</code></pre>

<h3>Quyền sở hữu trong service đặt lịch</h3>
<pre><code class="language-ts">${esc(MA_POL)}</code></pre>
<pre><code class="language-ts">${esc(MA_BKS)}</code></pre>
<p>Policy của bài 7.4 với dữ liệu thật: <code>managerId</code> của phòng được nạp cùng với lịch. Đổi trạng thái dùng cột <code>version</code> từ mốc 6, nên một lần duyệt và một lần huỷ cùng lúc không thể cùng thắng.</p>

<h3>Một bẫy thật: một decorator, hai bộ đếm</h3>
<p>Bản đầu giới hạn đăng nhập như sau:</p>
<pre><code class="language-ts">${esc(MA_SAI)}</code></pre>
<div class="out">${esc(OUT_SAI)}</div>
<p>Test chờ năm lần 401 rồi một lần 429, nhưng nhận 429 từ lần thử <em>thứ ba</em>. Các test trước trong cùng tệp đã đăng nhập từ cùng một IP (127.0.0.1). <code>@Throttle({ default: … })</code> không chỉ cấu hình guard theo email — <code>ThrottlerGuard</code> toàn cục theo IP cũng đọc cùng throttler <code>default</code> và áp "5 lần mỗi 15 phút mỗi IP" cho route đăng nhập. Trên production, một phòng máy 40 sinh viên sau một địa chỉ NAT của trường sẽ bị khoá sau năm lần đăng nhập. Cách sửa cho bộ đếm theo email một tên riêng, chỉ bật ở route đăng nhập:</p>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>

<h3>Test</h3>
<p>Test cũ được sửa, không bị xoá: <code>x-api-key</code> thành Bearer token ký bằng <code>JwtService</code> của ứng dụng (hàm phụ <code>src/test/auth.ts</code>; <code>db-reset.ts</code> giờ tạo năm tài khoản), <code>studentId</code> rời khỏi body, và hai phản hồi mong đợi có thêm <code>managerId</code>/<code>userId</code>.</p>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<div class="out">${esc(OUT_TV)}</div>

<h3>Chạy thật</h3>
<div class="out">${esc(OUT_XEM)}</div>
<p>Seed lấy mật khẩu từ <code>SEED_PASSWORD</code> thay vì viết trong mã nguồn. Bình đăng ký, An đặt phòng AL-201, Bình thử huỷ thì nhận 404, giảng viên quản lý AL-201 duyệt được, và An không tạo được phòng.</p>

<h3>Tự chấm (10 điểm trong thang điểm dự án)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Đăng ký/đăng nhập/refresh/đăng xuất; mật khẩu băm bằng argon2id hoặc bcrypt; refresh token lưu băm và xoay vòng; không phản hồi nào chứa chuỗi băm</td><td>3</td></tr>
<tr><td>Mặc định đóng: guard xác thực + guard quyền toàn cục; route không khai bị từ chối (có test chứng minh)</td><td>2</td></tr>
<tr><td>Ít nhất 2 vai trò và 1 luật sở hữu; chủ lấy từ token, không bao giờ từ body; bản ghi của người khác trả 404</td><td>2</td></tr>
<tr><td>Tài khoản bị hạ/khoá mất quyền ở request kế tiếp (tokenVersion hoặc tương đương), có test</td><td>1</td></tr>
<tr><td>Đăng nhập bị giới hạn theo tài khoản và theo IP mà không khoá cả một NAT; có ghi <code>TRUST_PROXY</code>; mọi test cũ xanh</td><td>2</td></tr>
</tbody>
</table>

<h3>Mục README</h3>
<pre><code class="language-markdown">## Xác thực và phân quyền (mốc 7)
- POST /auth/register · /auth/login · /auth/refresh · /auth/logout · GET /auth/me
- Access token 15 phút (JWT_TTL_SECONDS), refresh 14 ngày (REFRESH_DAYS), xoay vòng, lưu SHA-256
- Vai trò: STUDENT · LECTURER (duyệt lịch của phòng mình quản lý) · ADMIN
- Mọi route khai @Public / @AnyUser / @CanPerm — route không khai trả 403
- Sau nginx đặt TRUST_PROXY=1. Đăng nhập: 100/phút mỗi IP, 5 lần/15 phút mỗi email
- Dữ liệu dev: SEED_PASSWORD=… node dist/seed.js</code></pre>
${THE}
</div>
`,
};
