/**
 * 6.3 — TypeORM trong Nest: entity, repository, quan hệ và migration (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, typeorm 1.1.3, @nestjs/typeorm 12.0.3, pg 8.23.1, PostgreSQL 16.16, DB lab_typeorm/lab_typeorm2):
 * b63/sync.ts — synchronize:true: đổi tên cột chỉ { name } ⇒ TypeORM 1.1 RENAME (giữ dữ liệu); đổi kiểu integer → smallint ⇒
 * "DROP COLUMN floor" + "ADD floor smallint NOT NULL DEFAULT '0'" ⇒ 3,2 thành 0,0 không một lời báo. data-source.ts + CLI:
 * migration:generate sinh đúng DROP + ADD, sửa tay thành ALTER COLUMN TYPE, migration:run ⇒ dữ liệu giữ 3,2. repo.ts: thiếu
 * forFeature ⇒ "argument BookingRepository"; transaction bằng EntityManager; relations ⇒ JOIN.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'spring-boot', bai: 'sb-6-3-quan-he-jpa', title: 'Spring Boot 6.3 — Quan hệ JPA', sub: 'Để so: @ManyToOne/@OneToMany, LAZY/EAGER ở Hibernate.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-8-1-vi-sao-flyway', title: 'Spring Boot 8.1 — Vì sao cần Flyway', sub: 'ddl-auto=update là synchronize:true của Hibernate — cùng một bài học.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-6-5-tren-production', title: 'Prisma ORM 6.5 — Migration trên production', sub: 'Quy trình migration an toàn — áp dụng y nguyên cho TypeORM.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS — Database (TypeORM)', 'TypeOrmModule.forRoot/forRootAsync, forFeature, @InjectRepository.', 'https://docs.nestjs.com/techniques/database'),
  nguon('🧯', 'GitLab — Postmortem of database outage of January 31 (2017)', 'Mất ~6 giờ dữ liệu; 5 cơ chế sao lưu không cái nào dùng được ngay.', 'https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/'),
].join('\n');
const MA_ENT = "// entities.ts — giống JPA: lớp + decorator ⇒ bảng\nimport { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';\n\n@Entity('rooms')\nexport class Room {\n  @PrimaryGeneratedColumn() id: number;\n  @Column({ unique: true }) code: string;\n  @Column(process.env.DOI_TEN ? { name: 'seats' } : {}) capacity: number;   // DOI_TEN=1: \"chỉ đổi tên cột cho đẹp\"\n  @Column({ type: process.env.DOI_KIEU ? 'smallint' : 'integer', default: 0 }) floor: number;   // DOI_KIEU=1: \"int phí chỗ, đổi smallint\"\n  @OneToMany(() => Booking, (b) => b.room) bookings: Booking[];\n}\n\n@Entity('bookings')\nexport class Booking {\n  @PrimaryGeneratedColumn() id: number;\n  @ManyToOne(() => Room, (r) => r.bookings, { nullable: false }) room: Room;\n  @Column() studentId: string;\n  @Column({ type: 'timestamptz' }) start: Date;\n  @Column({ type: 'timestamptz' }) end: Date;\n  @Column({ default: 'PENDING' }) status: string;\n  @VersionColumn() version: number;\n  @CreateDateColumn({ type: 'timestamptz' }) createdAt: Date;\n}";
const MA_SYNC = "@Injectable()\nclass RoomsService {\n  constructor(@InjectRepository(Room) private readonly rooms: Repository<Room>) {}\n  async seedNeuRong() { if (!(await this.rooms.count())) await this.rooms.save([{ code: 'AL-301', capacity: 30, floor: 3 }, { code: 'BE-205', capacity: 24, floor: 2 }]); }\n  list() { return this.rooms.find({ order: { id: 'ASC' } }); }\n}\n@Module({ imports: [TypeOrmModule.forFeature([Room, Booking])], providers: [RoomsService] })\nclass RoomsModule {}\n\n@Module({ imports: [\n  TypeOrmModule.forRootAsync({ useFactory: () => ({\n    type: 'postgres', url: process.env.TYPEORM_URL, entities: [Room, Booking],\n    synchronize: true,                                   // ⚠ so lược đồ với entity rồi ALTER ngay khi khởi động\n    logging: process.env.SQL ? ['schema', 'query'] : ['schema'],\n  }) }),\n  RoomsModule,\n] })\nclass AppModule {}";
const OUT_SYNC = "$ node dist/b63/sync.js                 # lần 1: DB rỗng\ncreating a new table: public.rooms\ncreating a new table: public.bookings\ncreating a foreign keys: FK_0172b36e4e054d6ebb819d58efb on table \"bookings\"\nphòng: [{\"id\":1,\"code\":\"AL-301\",\"capacity\":30,\"floor\":3},{\"id\":2,\"code\":\"BE-205\",\"capacity\":24,\"floor\":2}]\n$ DOI_TEN=1 node dist/b63/sync.js       # chỉ đổi tên cột: { name: \"seats\" }\nrenaming column \"capacity\" in \"rooms\" to \"seats\"\nphòng: [{\"id\":1,\"code\":\"AL-301\",\"capacity\":30,\"floor\":3},{\"id\":2,\"code\":\"BE-205\",\"capacity\":24,\"floor\":2}]\n$ DOI_TEN=1 DOI_KIEU=1 node dist/b63/sync.js   # đổi kiểu floor: integer → smallint\nrenaming column \"floor\" in \"rooms\" to \"floor\"\ncolumns changed in \"rooms\". updating: floor\nphòng: [{\"id\":1,\"code\":\"AL-301\",\"capacity\":30,\"floor\":0},{\"id\":2,\"code\":\"BE-205\",\"capacity\":24,\"floor\":0}]";
const OUT_SQL = "$ SQL=1 DOI_KIEU=1 node dist/b63/sync.js | grep ALTER\nquery: ALTER TABLE \"rooms\" DROP COLUMN \"floor\"\nquery: ALTER TABLE \"rooms\" ADD \"floor\" smallint NOT NULL DEFAULT '0'\nphòng: [{\"id\":1,\"code\":\"AL-301\",\"capacity\":30,\"floor\":0},{\"id\":2,\"code\":\"BE-205\",\"capacity\":24,\"floor\":0}]";
const MA_DS = "// data-source.ts — cho CLI của TypeORM (migration:generate/run); ứng dụng Nest dùng cùng cấu hình này\nimport 'reflect-metadata';\nimport { DataSource } from 'typeorm';\nimport { Booking, Room } from './entities.js';\n\nexport default new DataSource({\n  type: 'postgres', url: process.env.TYPEORM_URL, entities: [Room, Booking],\n  migrations: ['dist/b63/migrations/*.js'],\n  synchronize: false,\n});";
const OUT_RUN = "$ npx typeorm migration:run -d dist/b63/data-source.js\nquery: CREATE TABLE \"migrations\" (\"id\" SERIAL NOT NULL, \"timestamp\" bigint NOT NULL, \"name\" character varying NOT NULL, CONSTRAINT \"PK_8c82d7f526340ab734260ea46be\" PRIMARY KEY (\"id\"))\n0 migrations are already loaded in the database.\n1 migrations were found in the source code.\n1 migrations are new migrations must be executed.\nquery: CREATE TABLE \"rooms\" (\"id\" SERIAL NOT NULL, \"code\" character varying NOT NULL, \"capacity\" integer NOT NULL, \"floor\" integer NOT NULL DEFAULT '0', CONSTRAINT \"UQ_368d83b661b9670e7be1bbb9cdd\" UNIQUE (\"code\"), CONSTRAINT \"PK_0\nquery: CREATE TABLE \"bookings\" (\"id\" SERIAL NOT NULL, \"studentId\" character varying NOT NULL, \"start\" TIMESTAMP WITH TIME ZONE NOT NULL, \"end\" TIMESTAMP WITH TIME ZONE NOT NULL, \"status\" character varying NOT NULL DEFAULT 'PENDING\nquery: ALTER TABLE \"bookings\" ADD CONSTRAINT \"FK_0172b36e4e054d6ebb819d58efb\" FOREIGN KEY (\"roomId\") REFERENCES \"rooms\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION\nquery: INSERT INTO \"migrations\"(\"timestamp\", \"name\") VALUES ($1, $2) -- PARAMETERS: [1795477430968,\"Init1795477430968\"]\nMigration Init1795477430968 has been executed successfully.";
const OUT_GEN2 = "$ DOI_KIEU=1 npx typeorm migration:generate -d dist/b63/data-source.js src/b63/migrations/FloorSmallint\nMigration /home/sv/app/src/b63/migrations/1795477457606-FloorSmallint.ts has been generated successfully.\n$ grep query src/b63/migrations/1795477457606-FloorSmallint.ts\n7:        await queryRunner.query(`ALTER TABLE \"rooms\" DROP COLUMN \"floor\"`);\n8:        await queryRunner.query(`ALTER TABLE \"rooms\" ADD \"floor\" smallint NOT NULL DEFAULT '0'`);\n12:        await queryRunner.query(`ALTER TABLE \"rooms\" DROP COLUMN \"floor\"`);\n13:        await queryRunner.query(`ALTER TABLE \"rooms\" ADD \"floor\" integer NOT NULL DEFAULT '0'`);";
const MA_SUA = "\n    public async up(queryRunner: QueryRunner): Promise<void> {\n        // sửa tay: đổi kiểu TẠI CHỖ, giữ dữ liệu (máy sinh ra DROP + ADD)\n        await queryRunner.query(`ALTER TABLE \"rooms\" ALTER COLUMN \"floor\" TYPE smallint`);\n    }\n\n    public async down(queryRunner: QueryRunner): Promise<void> {\n        await queryRunner.query(`ALTER TABLE \"rooms\" ALTER COLUMN \"floor\" TYPE integer`);\n    }";
const OUT_RUN2 = "$ npx typeorm migration:run -d dist/b63/data-source.js\nInit1795477430968 is the last executed migration. It was executed on Tue Nov 24 2026 06:43:50 GMT+0700 (Indochina Time).\n1 migrations are new migrations must be executed.\nquery: ALTER TABLE \"rooms\" ALTER COLUMN \"floor\" TYPE smallint\nMigration FloorSmallint1795477457606 has been executed successfully.\n$ psql -c \"SELECT code, floor, pg_typeof(floor) FROM rooms\"\n  code  | floor | pg_typeof \n--------+-------+-----------\n AL-301 |     3 | smallint\n BE-205 |     2 | smallint\n(2 rows)";
const MA_REPO = "@Injectable()\nclass BookingsService {\n  constructor(@InjectRepository(Booking) private readonly bookings: Repository<Booking>, private readonly ds: DataSource) {}\n  async dat(roomId: number) {\n    return this.ds.transaction(async (m) => {                 // m = EntityManager của transaction — dùng m, KHÔNG dùng this.bookings\n      const room = await m.findOneByOrFail(Room, { id: roomId });\n      return m.save(Booking, { room, studentId: 'SE170001', start: new Date('2027-01-05T00:30:00Z'), end: new Date('2027-01-05T02:30:00Z') });\n    });\n  }\n  lichCuaPhong(roomId: number) { return this.bookings.find({ where: { room: { id: roomId } }, relations: { room: true } }); }\n}\nconst thieu = process.env.KICH === 'thieu-feature';\n@Module({ imports: thieu ? [] : [TypeOrmModule.forFeature([Booking])], providers: [BookingsService] })\nclass BookingsModule {}\n@Module({ imports: [TypeOrmModule.forRoot({ type: 'postgres', url: process.env.TYPEORM_URL, entities: [Room, Booking],\n  logging: process.env.SQL ? ['query'] : false }), BookingsModule] })\nclass AppModule {}";
const OUT_REPO = "$ KICH=thieu-feature node dist/b63/repo.js\n[Nest] ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the BookingsService (?, DataSource). Please make sure that the argument \"BookingRepository\" at index [0] is available in the BookingsModule module.\n\nPotential solutions:\n- Is BookingsModule a valid NestJS module?\n- If \"BookingRepository\" is a provider, is it part of the current BookingsModule?\n- If \"BookingRepository\" is exported from a separate @Module, is that module imported within BookingsModule?\n  @Module({\n    imports: [ /* the Module containing \"BookingRepository\" */ ]\n  })\n\nFor more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n  type: 'BookingsService',\n$ SQL=1 node dist/b63/repo.js\nquery: SELECT version()\nquery: SELECT * FROM current_schema()\nquery: START TRANSACTION\nquery: SELECT \"Room\".\"id\" AS \"Room_id\", \"Room\".\"code\" AS \"Room_code\", \"Room\".\"capacity\" AS \"Room_capacity\", \"Room\".\"floor\" AS \"Room_floor\" FROM \"rooms\" \"Room\" WHERE ((\"Room\".\"id\" = $1)) LIMIT 1 -- PARAMETERS: [1]\nquery: INSERT INTO \"bookings\"(\"studentId\", \"start\", \"end\", \"status\", \"version\", \"createdAt\", \"roomId\") VALUES ($1, $2, $3, DEFAULT, 1, DEFAULT, $4) RETURNING \"id\", \"status\", \"version\", \"createdAt\" -- PARAMETERS: [\"SE170001\",\"2027-01-05T00:30:00.000Z\",\"2027-01-\nquery: COMMIT\nđã đặt booking 1 · version 1\nlịch phòng 1: 1 booking · phòng của booking đầu: AL-301";
const MA_BT = "@Injectable()\nclass MigrationGuard implements OnApplicationBootstrap {\n  constructor(private readonly ds: DataSource) {}\n  async onApplicationBootstrap() {\n    if (await this.ds.showMigrations()) {                       // true = còn migration trong mã mà DB chưa chạy\n      throw new Error('DB chưa chạy hết migration — chạy \"typeorm migration:run\" trước khi triển khai');\n    }\n    new Logger('MigrationGuard').log('lược đồ DB khớp với mã');\n  }\n}\n@Module({\n  imports: [TypeOrmModule.forRootAsync({ useFactory: () => ({ type: 'postgres', url: process.env.TYPEORM_URL, entities: [Room, Booking],\n    migrations: ['dist/b63/migrations/*.js'], synchronize: false }) })],\n  providers: [MigrationGuard],\n})\nclass AppModule {}";
const OUT_BT = "$ node dist/b63/bt.js; echo \"mã thoát $?\"     # DB mới tinh, 2 migration chưa chạy\nError: DB chưa chạy hết migration — chạy \"typeorm migration:run\" trước khi triển khai\nmã thoát 1\n$ npx typeorm migration:run -d dist/b63/data-source.js && node dist/b63/bt.js\n(migration đã chạy: 2)\n[Nest] LOG [MigrationGuard] lược đồ DB khớp với mã\n[Nest] LOG [NestApplication] Nest application successfully started +1ms\n>> đang phục vụ";

export default {
  title: '6.3 — TypeORM in Nest: entities, repositories, relations and migrations (the JPA-like option)|||6.3 — TypeORM trong Nest: entity, repository, quan hệ và migration (lựa chọn giống JPA)',
  slug: 'nst-6-3-typeorm',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nhiều dự án Nest ở công ty dùng TypeORM — gần như JPA viết bằng TypeScript. Chạy thật TypeORM 1.1: TypeOrmModule.forRootAsync, forFeature, @InjectRepository, quên forFeature thì lỗi gì, transaction bằng EntityManager; synchronize:true đổi tên cột thì giữ dữ liệu nhưng đổi kiểu integer → smallint thì DROP COLUMN, dữ liệu 3 và 2 thành 0 không một lời báo; migration:generate sinh đúng câu DROP đó, sửa tay thành ALTER COLUMN TYPE; ứng dụng từ chối khởi động khi còn migration chưa chạy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>6.3 — TypeORM: the option that looks like JPA</h2>
<p class="lead">This course uses Prisma for lab-booking, but many Nest code bases you will inherit at a company use <strong>TypeORM</strong> — and if you know Spring, it will feel familiar: classes with decorators become tables, a <code>Repository&lt;T&gt;</code> per entity, relations with <code>@ManyToOne</code>, an <code>EntityManager</code>. There is no separate TypeORM course on this site, so this lesson covers the essentials end to end, with the one setting that destroys data quietly: <code>synchronize: true</code>.</p>

<h3>Everyday analogy: a builder who reads your drawing every morning</h3>
<p><code>synchronize</code> is a builder who arrives each morning, compares the building with today's drawing and fixes every difference on the spot — no questions. Move a window on the drawing and he moves it, fine. Change "oak floor" to "pine floor" and he rips out the oak, furniture and all, and lays new pine. A migration is the same builder handing you a written work order first, so you can say "no — sand and re-varnish, keep the furniture".</p>

<h3>Step 1 — entities</h3>
<pre><code class="language-ts">${esc(MA_ENT)}</code></pre>
<p>Compared with JPA: <code>@Entity</code>/<code>@Column</code>/<code>@ManyToOne</code> mean what they mean in Hibernate, <code>@VersionColumn</code> is <code>@Version</code> (optimistic locking, Lesson 6.5), <code>@CreateDateColumn</code> is <code>@CreationTimestamp</code>. The two env switches (<code>DOI_TEN</code>, <code>DOI_KIEU</code>) simulate edits a developer makes to the entity later.</p>

<h3>Step 2 — wiring it into Nest</h3>
<pre><code class="language-ts">${esc(MA_SYNC)}</code></pre>
<p><code>forRootAsync</code> builds the <code>DataSource</code> once for the app (in a real project <code>inject: [ConfigService]</code> provides the URL — Lesson 5.1). <code>forFeature([Room, Booking])</code> registers a <code>Repository</code> provider per entity <em>in that module</em>, and <code>@InjectRepository(Room)</code> asks for it. Forget <code>forFeature</code> and Nest tells you exactly what is missing:</p>
<pre><code class="language-ts">${esc(MA_REPO)}</code></pre>
<div class="out">${esc(OUT_REPO)}</div>
<p>Two things to read in that output. The error names the token <code>"BookingRepository"</code> — that is what <code>@InjectRepository(Booking)</code> means. And with <code>SQL=1</code>, the transaction is visible: <code>START TRANSACTION</code>, the room lookup and the insert, <code>COMMIT</code>. Inside <code>ds.transaction(async (m) =&gt; …)</code> you must use <code>m</code>; calling <code>this.bookings.save()</code> there would run on another connection, outside the transaction — the same leak as <code>PrismaService</code> in Lesson 6.2 (nestjs-cls has a TypeORM adapter for the same <code>@Transactional</code> style).</p>

<h3>Experiment — synchronize: true on a database that has data</h3>
<div class="out">${esc(OUT_SYNC)}</div>
<ul>
<li><strong>Run 1</strong> — empty database: tables and the foreign key created, two rooms seeded with floors 3 and 2.</li>
<li><strong>Run 2</strong> — only the column name changed (<code>{ name: 'seats' }</code>, same type): TypeORM 1.1 detects a rename and runs a <code>RENAME</code>. Data kept. (Older folklore says it always drops; measure, don't repeat.)</li>
<li><strong>Run 3</strong> — <code>floor</code> changed from <code>integer</code> to <code>smallint</code>, "to save space". Floors became 0 and 0. No error, no warning, exit 0.</li>
</ul>
<p>The SQL behind run 3:</p>
<div class="out">${esc(OUT_SQL)}</div>
<p>For a type change, synchronize drops the column and adds a new one. PostgreSQL could do it in place (<code>ALTER COLUMN … TYPE smallint</code>) — synchronize simply does not try. Hibernate's <code>ddl-auto=update</code> belongs to the same family (see the Spring Boot link). <strong>Rule: <code>synchronize: true</code> only on a throw-away local database; everywhere else, migrations.</strong></p>

<h3>Step 3 — migrations with the TypeORM CLI</h3>
<pre><code class="language-ts">${esc(MA_DS)}</code></pre>
<p>The CLI needs a <code>DataSource</code> file. Generate the first migration from the entities and run it:</p>
<div class="out">${esc(OUT_RUN)}</div>
<p>Now the same type change, but through a migration:</p>
<div class="out">${esc(OUT_GEN2)}</div>
<p>The generator produced exactly the destructive SQL synchronize ran — the difference is that it is now <em>a file you review</em>. Rewrite it:</p>
<pre><code class="language-ts">${esc(MA_SUA)}</code></pre>
<div class="out">${esc(OUT_RUN2)}</div>
<p>Floors 3 and 2 survived, type is <code>smallint</code>. A generated migration is a draft; the developer who commits it owns every statement in it.</p>

<h3>Prisma or TypeORM?</h3>
<table>
<tr><th></th><th>Prisma 7</th><th>TypeORM 1.1</th></tr>
<tr><td>Model lives in</td><td><code>schema.prisma</code> (own language)</td><td>TypeScript classes + decorators</td></tr>
<tr><td>Query results</td><td>Plain objects, types computed per query (<code>select</code>)</td><td>Entity class instances</td></tr>
<tr><td>Migrations</td><td><code>migrate dev</code> / <code>deploy</code>, SQL files</td><td><code>migration:generate</code> / <code>run</code>, TS files</td></tr>
<tr><td>Feels like</td><td>A typed query builder</td><td>JPA/Hibernate (EntityManager, repositories, lazy relations)</td></tr>
<tr><td>Nest integration</td><td>Write PrismaService yourself (Lesson 6.1)</td><td>Official <code>@nestjs/typeorm</code></td></tr>
</table>
<p>Both are fine. On a new project pick one with the team; on an existing project, learn the one it uses — the Nest patterns of this chapter (one client, fail fast, short transactions, errors mapped to HTTP, constraints in the database) are the same.</p>

<h3>🛡 Real incident: GitLab.com, 31 January 2017</h3>
<p>While fighting a replication problem late at night, an engineer ran a delete on the data directory of what they believed was the secondary database — it was the primary. GitLab's public postmortem: roughly 6 hours of data lost (about 5,000 projects, 5,000 comments and 700 new user accounts), because of the five backup or replication mechanisms they had, none was working well enough to restore from directly; the restore came from a snapshot taken manually about 6 hours earlier. The lesson for this chapter is not "type carefully". It is that changes to a production database must be <strong>reviewed, rehearsed on a copy and reversible</strong> — exactly what a migration file gives you and <code>synchronize</code> does not.</p>

<h3>🧪 Exercise</h3>
<p>With <code>synchronize: false</code>, a new deployment can start against a database whose migrations have not been run yet — the code expects columns that do not exist. Make the Nest app refuse to start when migrations are pending.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>DataSource.showMigrations()</code> returns <code>true</code> when the code contains migrations the database has not executed. Throwing in <code>onApplicationBootstrap</code> stops the start with exit code 1 — the same "fail fast" as Lesson 6.1. (Alternative: <code>migrationsRun: true</code> runs them at startup — convenient, but then several replicas starting together race to migrate. Running migrations as a separate deploy step is the safer default — Lesson 11.3.)</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Why is synchronize: true forbidden in production?</strong> It applies schema diffs without review; for a type change it drops and re-adds the column (measured: data replaced by the default).</li>
<li><strong>forRoot vs forFeature?</strong> forRoot creates the DataSource once for the app; forFeature registers repositories for given entities in a module so they can be injected with <code>@InjectRepository</code>.</li>
<li><strong>How do you run a TypeORM transaction across repositories?</strong> <code>dataSource.transaction(async (manager) =&gt; …)</code> and use only <code>manager</code> inside — or nestjs-cls with the TypeORM adapter.</li>
<li><strong>Prisma vs TypeORM?</strong> Schema language and query-shaped types vs decorated classes and an EntityManager; pick per team, the Nest patterns are the same.</li>
</ol>

<h3>💼 On the job</h3>
<p>Day one on a legacy Nest project: search for <code>synchronize</code>. If it is <code>true</code> or reads from an env variable that might be true in staging, raise it immediately — then generate a baseline migration from the current production schema before anyone changes an entity.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TypeOrmModule.forRoot(Async)</span><span class="v">Creates the app's DataSource (connection pool + metadata) once.</span></div>
  <div class="kv"><span class="k">forFeature / @InjectRepository</span><span class="v">Registers and injects Repository&lt;Entity&gt;; missing forFeature ⇒ "argument EntityRepository" error.</span></div>
  <div class="kv"><span class="k">EntityManager</span><span class="v">Unit of work API; inside dataSource.transaction you get one bound to the transaction.</span></div>
  <div class="kv"><span class="k">synchronize</span><span class="v">Auto-ALTER schema to match entities at startup; type change ⇒ DROP + ADD column.</span></div>
  <div class="kv"><span class="k">migration:generate / run</span><span class="v">Diff entities vs database into a reviewable TS file; execute pending ones and record them in "migrations".</span></div>
  <div class="kv"><span class="k">showMigrations()</span><span class="v">true if the code has migrations not yet executed on this database.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>TypeORM maps closely to JPA: entities, repositories, EntityManager, version column.</li>
<li>forRootAsync once, forFeature per module, @InjectRepository in services; transactions through the manager.</li>
<li>synchronize silently destroyed data on a type change; migrations make the same change reviewable — and fixable.</li>
<li>Refuse to start when migrations are pending; run migrations as a deliberate deploy step.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>6.3 — TypeORM: lựa chọn trông giống JPA</h2>
<p class="lead">Khoá này dùng Prisma cho lab-booking, nhưng nhiều mã nguồn Nest bạn sẽ nhận ở công ty dùng <strong>TypeORM</strong> — và nếu đã học Spring, bạn sẽ thấy quen: lớp có decorator thành bảng, mỗi entity một <code>Repository&lt;T&gt;</code>, quan hệ bằng <code>@ManyToOne</code>, có <code>EntityManager</code>. Trang này chưa có khoá TypeORM riêng, nên bài này đi trọn phần cốt lõi, kèm một thiết lập phá dữ liệu trong im lặng: <code>synchronize: true</code>.</p>

<h3>Liên hệ đời thường: ông thợ sáng nào cũng đọc bản vẽ</h3>
<p><code>synchronize</code> là ông thợ sáng nào cũng tới, so ngôi nhà với bản vẽ hôm nay và sửa mọi chỗ khác biệt ngay tại chỗ — không hỏi ai. Dời cửa sổ trên bản vẽ thì ông dời, không sao. Đổi "sàn gỗ sồi" thành "sàn gỗ thông" thì ông lột cả sàn sồi, đồ đạc trên đó cũng đi luôn, rồi lát thông mới. Migration là chính ông thợ đó nhưng đưa bạn tờ lệnh công việc trước, để bạn kịp nói "không — chà nhám rồi sơn lại, giữ đồ đạc".</p>

<h3>Bước 1 — entity</h3>
<pre><code class="language-ts">${esc(MA_ENT)}</code></pre>
<p>So với JPA: <code>@Entity</code>/<code>@Column</code>/<code>@ManyToOne</code> mang đúng nghĩa như ở Hibernate, <code>@VersionColumn</code> là <code>@Version</code> (khoá lạc quan, Bài 6.5), <code>@CreateDateColumn</code> là <code>@CreationTimestamp</code>. Hai công tắc môi trường (<code>DOI_TEN</code>, <code>DOI_KIEU</code>) giả lập những lần lập trình viên sửa entity về sau.</p>

<h3>Bước 2 — nối vào Nest</h3>
<pre><code class="language-ts">${esc(MA_SYNC)}</code></pre>
<p><code>forRootAsync</code> dựng <code>DataSource</code> một lần cho cả ứng dụng (dự án thật dùng <code>inject: [ConfigService]</code> để lấy URL — Bài 5.1). <code>forFeature([Room, Booking])</code> đăng ký mỗi entity một provider <code>Repository</code> <em>trong module đó</em>, và <code>@InjectRepository(Room)</code> xin nó. Quên <code>forFeature</code> thì Nest nói rõ thiếu gì:</p>
<pre><code class="language-ts">${esc(MA_REPO)}</code></pre>
<div class="out">${esc(OUT_REPO)}</div>
<p>Hai điều cần đọc trong output. Lỗi gọi tên token <code>"BookingRepository"</code> — đó chính là ý nghĩa của <code>@InjectRepository(Booking)</code>. Và với <code>SQL=1</code>, transaction hiện ra rõ: <code>START TRANSACTION</code>, tra phòng rồi chèn, <code>COMMIT</code>. Trong <code>ds.transaction(async (m) =&gt; …)</code> bạn phải dùng <code>m</code>; gọi <code>this.bookings.save()</code> ở đó sẽ chạy trên kết nối khác, ngoài transaction — đúng kiểu rò rỉ như <code>PrismaService</code> ở Bài 6.2 (nestjs-cls có adapter TypeORM cho cùng kiểu <code>@Transactional</code>).</p>

<h3>Thí nghiệm — synchronize: true trên DB đã có dữ liệu</h3>
<div class="out">${esc(OUT_SYNC)}</div>
<ul>
<li><strong>Lần 1</strong> — DB rỗng: tạo bảng và khoá ngoại, nạp hai phòng tầng 3 và tầng 2.</li>
<li><strong>Lần 2</strong> — chỉ đổi tên cột (<code>{ name: 'seats' }</code>, cùng kiểu): TypeORM 1.1 nhận ra là đổi tên và chạy <code>RENAME</code>. Dữ liệu còn nguyên. (Lời truyền miệng cũ bảo lúc nào nó cũng xoá; hãy đo, đừng nhắc lại.)</li>
<li><strong>Lần 3</strong> — đổi <code>floor</code> từ <code>integer</code> sang <code>smallint</code> "cho đỡ tốn chỗ". Tầng thành 0 và 0. Không lỗi, không cảnh báo, mã thoát 0.</li>
</ul>
<p>Câu SQL đằng sau lần 3:</p>
<div class="out">${esc(OUT_SQL)}</div>
<p>Khi đổi kiểu, synchronize xoá cột rồi thêm cột mới. PostgreSQL làm được tại chỗ (<code>ALTER COLUMN … TYPE smallint</code>) — synchronize đơn giản là không thử. <code>ddl-auto=update</code> của Hibernate cùng một họ (xem liên kết Spring Boot). <strong>Luật: <code>synchronize: true</code> chỉ dùng trên DB cục bộ vứt đi được; mọi nơi khác dùng migration.</strong></p>

<h3>Bước 3 — migration bằng CLI của TypeORM</h3>
<pre><code class="language-ts">${esc(MA_DS)}</code></pre>
<p>CLI cần một tệp <code>DataSource</code>. Sinh migration đầu tiên từ entity rồi chạy:</p>
<div class="out">${esc(OUT_RUN)}</div>
<p>Giờ cũng thay đổi kiểu ấy, nhưng đi qua migration:</p>
<div class="out">${esc(OUT_GEN2)}</div>
<p>Bộ sinh tạo ra đúng câu SQL phá huỷ mà synchronize đã chạy — khác ở chỗ giờ nó là <em>một tệp để bạn review</em>. Viết lại:</p>
<pre><code class="language-ts">${esc(MA_SUA)}</code></pre>
<div class="out">${esc(OUT_RUN2)}</div>
<p>Tầng 3 và 2 còn nguyên, kiểu đã là <code>smallint</code>. Migration sinh tự động chỉ là bản nháp; người commit nó chịu trách nhiệm từng câu lệnh bên trong.</p>

<h3>Prisma hay TypeORM?</h3>
<table>
<tr><th></th><th>Prisma 7</th><th>TypeORM 1.1</th></tr>
<tr><td>Mô hình nằm ở</td><td><code>schema.prisma</code> (ngôn ngữ riêng)</td><td>Lớp TypeScript + decorator</td></tr>
<tr><td>Kết quả truy vấn</td><td>Object thường, kiểu tính theo từng truy vấn (<code>select</code>)</td><td>Thể hiện của lớp entity</td></tr>
<tr><td>Migration</td><td><code>migrate dev</code> / <code>deploy</code>, tệp SQL</td><td><code>migration:generate</code> / <code>run</code>, tệp TS</td></tr>
<tr><td>Cảm giác giống</td><td>Query builder có kiểu</td><td>JPA/Hibernate (EntityManager, repository, quan hệ lazy)</td></tr>
<tr><td>Tích hợp Nest</td><td>Tự viết PrismaService (Bài 6.1)</td><td>Gói chính thức <code>@nestjs/typeorm</code></td></tr>
</table>
<p>Cả hai đều ổn. Dự án mới thì chọn cùng nhóm; dự án có sẵn thì học cái nó đang dùng — các mẫu Nest của chương này (một client, hỏng sớm, transaction ngắn, lỗi đổi thành mã HTTP, ràng buộc nằm trong DB) đều như nhau.</p>

<h3>🛡 Sự cố thật: GitLab.com, 31/01/2017</h3>
<p>Đang xử lý sự cố sao chép dữ liệu lúc khuya, một kỹ sư chạy lệnh xoá thư mục dữ liệu của máy mà anh tin là DB phụ — thật ra là DB chính. Bản postmortem công khai của GitLab: mất khoảng 6 giờ dữ liệu (chừng 5.000 dự án, 5.000 bình luận và 700 tài khoản mới), vì trong năm cơ chế sao lưu và sao chép họ có, không cơ chế nào đủ tốt để khôi phục ngay; bản khôi phục lấy từ một snapshot được tạo tay khoảng 6 giờ trước đó. Bài học cho chương này không phải "gõ lệnh cẩn thận". Mà là: thay đổi trên DB production phải <strong>được review, được tập trên bản sao, và đảo ngược được</strong> — đúng những gì tệp migration cho bạn còn <code>synchronize</code> thì không.</p>

<h3>🧪 Bài tập</h3>
<p>Với <code>synchronize: false</code>, một lần triển khai mới có thể khởi động trên DB chưa chạy migration — mã mong có những cột chưa tồn tại. Hãy làm cho ứng dụng Nest từ chối khởi động khi còn migration chưa chạy.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>DataSource.showMigrations()</code> trả <code>true</code> khi mã có migration mà DB chưa chạy. Ném lỗi trong <code>onApplicationBootstrap</code> chặn khởi động với mã thoát 1 — cùng tinh thần "hỏng sớm" của Bài 6.1. (Cách khác: <code>migrationsRun: true</code> chạy chúng lúc khởi động — tiện, nhưng khi nhiều bản cùng khởi động thì chúng tranh nhau chạy migration. Chạy migration thành một bước triển khai riêng là mặc định an toàn hơn — Bài 11.3.)</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Vì sao cấm synchronize: true ở production?</strong> Nó áp thay đổi lược đồ không qua review; đổi kiểu thì xoá rồi thêm lại cột (đo được: dữ liệu bị thay bằng giá trị mặc định).</li>
<li><strong>forRoot khác forFeature thế nào?</strong> forRoot tạo DataSource một lần cho ứng dụng; forFeature đăng ký repository của các entity trong một module để tiêm bằng <code>@InjectRepository</code>.</li>
<li><strong>Chạy transaction TypeORM qua nhiều repository thế nào?</strong> <code>dataSource.transaction(async (manager) =&gt; …)</code> và bên trong chỉ dùng <code>manager</code> — hoặc nestjs-cls với adapter TypeORM.</li>
<li><strong>Prisma hay TypeORM?</strong> Ngôn ngữ schema và kiểu theo truy vấn, so với lớp có decorator và EntityManager; chọn theo nhóm, các mẫu Nest giống nhau.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ngày đầu nhận một dự án Nest cũ: tìm chữ <code>synchronize</code>. Nếu nó là <code>true</code> hoặc đọc từ biến môi trường có thể là true ở staging, báo ngay — rồi sinh một migration nền từ lược đồ production hiện tại trước khi ai đó sửa entity.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TypeOrmModule.forRoot(Async)</span><span class="v">Tạo DataSource của ứng dụng (pool kết nối + metadata) một lần.</span></div>
  <div class="kv"><span class="k">forFeature / @InjectRepository</span><span class="v">Đăng ký và tiêm Repository&lt;Entity&gt;; thiếu forFeature ⇒ lỗi "argument EntityRepository".</span></div>
  <div class="kv"><span class="k">EntityManager</span><span class="v">API đơn vị công việc; trong dataSource.transaction bạn nhận một bản gắn với transaction.</span></div>
  <div class="kv"><span class="k">synchronize</span><span class="v">Tự ALTER lược đồ cho khớp entity lúc khởi động; đổi kiểu ⇒ DROP + ADD cột.</span></div>
  <div class="kv"><span class="k">migration:generate / run</span><span class="v">So entity với DB thành tệp TS review được; chạy các migration còn chờ và ghi vào bảng "migrations".</span></div>
  <div class="kv"><span class="k">showMigrations()</span><span class="v">true nếu mã có migration chưa chạy trên DB này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>TypeORM tương ứng khá sát JPA: entity, repository, EntityManager, cột version.</li>
<li>forRootAsync một lần, forFeature theo module, @InjectRepository trong service; transaction đi qua manager.</li>
<li>synchronize xoá dữ liệu trong im lặng khi đổi kiểu; migration biến cùng thay đổi đó thành thứ review được — và sửa được.</li>
<li>Từ chối khởi động khi còn migration chờ; chạy migration như một bước triển khai có chủ đích.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
