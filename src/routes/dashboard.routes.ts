import { Router, type Response, type Request } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { isAiAvailable, llmComplete } from '../services/interview/llm/index.js';
import {
  ghiUyTin, khiTichXong, layUyTin, ngayVN, quetQuaHan,
} from '../services/dashboard/chamCong.js';
import {
  bacUyTin, mocHetGio, mucTru, TRUOC_HET_GIO_PHUT, UY_TIN_DAU,
} from '../services/dashboard/uyTin.js';
import {
  isValidIsoDate,
  normalizeDate,
  todayIso,
  scopeDate,
  completedExpiryCutoff,
  COMPLETED_TASK_RETENTION_DAYS,
  TASK_SCOPES,
  type TaskScope,
} from '../utils/dashboard.js';

const router = Router();

// All dashboard routes require auth. The dashboard is strictly
// personal — there is no shared view, no admin view, no public
// view. Every endpoint scopes by req.userId and refuses to touch
// rows that don't belong to the caller. The DB has the matching
// FK + ON DELETE CASCADE so if the user is deleted their rows go
// with them (and the user can't resurrect old data by re-signing
// up with the same email).
router.use(authenticate);

// ─── TimelineSlot type mirrors the frontend ───────────────────────
// We re-declare it here (instead of importing the TS type from
// the Next.js app) because the API runs in a separate compilation
// unit and the frontend types are a million lines of unrelated
// stuff. Keep this in sync manually.
type ActivityType = 'study' | 'work' | 'exercise' | 'cook' | 'sleep' | 'rest' | 'leisure' | 'social';
type TimelineSlot = { hour: number; activity?: { type: ActivityType; label: string } };

// ─── GET /api/v1/dashboard ────────────────────────────────────────
// Returns the full dashboard snapshot for the current user: state
// row + active tasks + today's celebration. The frontend calls
// this once on mount, then patches locally. We DO NOT 404 on
// missing rows — a brand-new user just gets an empty snapshot.
/**
 * SINH BẢN MỚI CHO VIỆC LẶP.
 *
 * Việc có `repeat` mà mốc `date` đã thuộc về kỳ TRƯỚC ⇒ chép sang kỳ hiện tại
 * (giữ tên, ghi chú, ưu tiên, EXP, nhịp lặp) rồi TẮT `repeat` ở bản cũ. Tắt là
 * điều bắt buộc: không tắt thì lần đọc sau nó lại sinh thêm một bản nữa, và
 * người dùng mở app buổi sáng thấy mười bản giống hệt nhau.
 *
 * ⚠️ Mốc kỳ hiện tại lấy từ THAM SỐ `homNay` của client, không tự tính bằng
 * UTC. Máy chủ ở UTC còn người dùng ở UTC+7: tự tính thì từ 00:00 tới 07:00 giờ
 * Việt Nam, "hôm nay" của máy chủ vẫn là hôm qua, nên việc hằng ngày không sinh
 * bản mới cho tới quá 7 giờ sáng.
 */
async function sinhViecLap(userId: number, homNayClient: string): Promise<void> {
  const cho = await prisma.dashboardTask.findMany({
    where: { userId, archivedAt: null, repeat: { not: 'none' } },
    // Trần: người bỏ app ba tháng rồi quay lại không nên phải chờ một vòng sinh
    // hàng trăm bản. Số còn lại sinh ở lần mở sau.
    take: 50,
  });
  if (cho.length === 0) return;

  const moc = new Date(`${homNayClient}T00:00:00Z`);
  if (Number.isNaN(moc.getTime())) return;

  for (const v of cho) {
    const kyNay = scopeDate(v.scope as TaskScope, moc);
    if (v.date >= kyNay) continue; // vẫn trong kỳ hiện tại, chưa tới lúc sinh

    /* Đã có bản của kỳ này chưa? Hai tab cùng mở, hoặc hai lần đọc trùng nhịp,
       đều gọi hàm này — không kiểm thì mỗi lần là một bản trùng. */
    const daCo = await prisma.dashboardTask.findFirst({
      where: { userId, scope: v.scope, date: kyNay, title: v.title, archivedAt: null },
      select: { id: true },
    });
    if (!daCo) {
      await prisma.dashboardTask.create({
        data: {
          userId, scope: v.scope, date: kyNay, title: v.title,
          exp: v.exp, activityType: v.activityType,
          note: v.note, priority: v.priority, repeat: v.repeat,
          sortOrder: v.sortOrder,
          /* KHÔNG chép `dueAt`/`remindAt`: chúng là mốc TUYỆT ĐỐI của kỳ cũ.
             Chép sang thì bản mới sinh ra đã quá hạn từ hôm qua, và lời nhắc
             kêu ngay lập tức. */
        },
      });
    }
    await prisma.dashboardTask.update({ where: { id: v.id }, data: { repeat: 'none' } });
  }
}

router.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;

    /* ⛔⛔ NGÀY THEO GIỜ MÁY, DÙNG CHO CẢ HÀM — không phải chỉ cho việc lặp.
     *
     * Bản cũ giữ `today = todayIso()` (UTC) rồi chỉ truyền ngày của client vào
     * riêng `sinhViecLap`. Mọi chỗ CÒN LẠI trong hàm vẫn so với UTC:
     *   · `celebratedToday` → ở UTC+7, từ 00:00 tới 07:00 nó đọc dòng tổng kết
     *     của HÔM QUA, nên app báo "đã kết thúc ngày hôm nay" khi chưa hề;
     *   · chuỗi ngày → lệch đúng một ngày, đo thật: 5 ngày liên tiếp ra 4.
     *
     * Đây là lần thứ BA cùng một cái bẫy trong đúng tệp này (trước đó:
     * `/celebrate` trả 0 EXP, `/plan-tomorrow` đặt việc vào hôm nay). Quy tắc:
     * trong tệp này, hễ chạm tới "hôm nay" thì dùng `today` DƯỚI ĐÂY, và
     * `todayIso()` chỉ được phép xuất hiện đúng ở dòng lùi dự phòng này. */
    const hn = String((req.query.homNay ?? '') as string);
    const today = isValidIsoDate(hn) ? hn : todayIso();
    await sinhViecLap(userId, today);

    // Fetch state + today's tasks + today's celebration in parallel.
    // Three small reads beat one big join when the user is offline
    // and we want a fast initial paint.
    const [state, tasks, todayCeleb] = await Promise.all([
      prisma.dashboardState.findUnique({ where: { userId } }),
      prisma.dashboardTask.findMany({
        // Auto-expiry: hide completed tasks older than the retention
        // window even before the nightly cron physically removes them,
        // so the dashboard reflects the rule the instant it applies.
        // The NOT clause means: drop rows where (done = true AND
        // completedAt < cutoff). Active tasks and recently-completed
        // tasks are always kept. completedExpiryCutoff() reads the
        // COMPLETED_TASK_RETENTION_DAYS knob (default 7d).
        where: {
          userId,
          archivedAt: null,
          NOT: { done: true, completedAt: { lt: completedExpiryCutoff() } },
        },
        /* `sortOrder` TRƯỚC `id`: nó là thứ tự người dùng tự kéo, và nó phải
           thắng thứ tự tạo. Mọi việc cũ có sortOrder = 0 nên chúng vẫn xếp theo
           id như trước — nâng cấp không đảo lộn danh sách của ai. */
        orderBy: [{ scope: 'asc' }, { date: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
      }),
      prisma.dashboardCelebration.findFirst({
        where: { userId, celebratedDate: today },
      }),
    ]);

    /* ── Chuỗi ngày học liên tiếp ─────────────────────────────────────
     * Đếm từ `DashboardCelebration`, không cần bảng mới: mỗi ngày người dùng
     * bấm "Kết thúc ngày" là một dòng, và ràng buộc (user_id, celebrated_date)
     * bảo đảm mỗi ngày đúng một dòng.
     *
     * ⚠️ Mốc bắt đầu là HÔM NAY **hoặc HÔM QUA**. Nếu chỉ chấp nhận hôm nay
     * thì suốt cả ngày — trước lúc người dùng kịp tổng kết — chuỗi hiện 0 và
     * họ tưởng mình vừa mất chuỗi. Đó đúng là lúc con số cần khích lệ nhất.
     *
     * Ngày dùng ở đây là `today` theo GIỜ MÁY (xem đầu hàm). */
    const ngayMung = await prisma.dashboardCelebration.findMany({
      where: { userId },
      select: { celebratedDate: true },
      orderBy: { celebratedDate: 'desc' },
      take: 400,
    });
    const tapNgay = new Set(ngayMung.map((c) => c.celebratedDate));
    const lui = (iso: string, n: number) => {
      const d = new Date(`${iso}T12:00:00.000Z`);   // neo 12:00Z: không múi giờ nào kéo lệch ngày
      d.setUTCDate(d.getUTCDate() - n);
      return d.toISOString().slice(0, 10);
    };
    let chuoi = 0;
    let moc = tapNgay.has(today) ? today : (tapNgay.has(lui(today, 1)) ? lui(today, 1) : null);
    while (moc && tapNgay.has(moc)) {
      chuoi += 1;
      moc = lui(moc, 1);
    }

    // Parse the timeline JSON. We never trust it blindly — a
    // corrupted row should still give the user a working dashboard.
    let timeline: TimelineSlot[] = Array.from({ length: 24 }, (_, h) => ({ hour: h }));
    if (state?.timeline) {
      try {
        const parsed = JSON.parse(state.timeline) as unknown;
        if (Array.isArray(parsed) && parsed.length === 24) {
          timeline = parsed as TimelineSlot[];
        }
      } catch {
        // Corrupt row → fall back to default empty timeline.
        // We don't overwrite the DB here; the next successful PUT
        // /timeline will repair it.
      }
    }

    res.json({
      success: true,
      data: {
        level: state?.level ?? 1,
        exp: state?.exp ?? 0,
        totalExp: state?.totalExp ?? 0,
        // How long completed tasks live before auto-expiring. Sent
        // so the UI can show "completed tasks vanish after N days".
        completedRetentionDays: COMPLETED_TASK_RETENTION_DAYS,
        timeline,
        lastCelebratedAt: state?.lastCelebratedAt ?? null,
        tomorrowPlanLockedDate: state?.tomorrowPlanLockedDate ?? null,
        celebratedToday: Boolean(todayCeleb),
        /** Số ngày học liên tiếp, tính tới hôm nay hoặc hôm qua. */
        streak: chuoi,
        todayStats: todayCeleb
          ? {
              expAwarded: todayCeleb.expAwarded,
              tasksDone: todayCeleb.tasksDone,
              tasksTotal: todayCeleb.tasksTotal,
            }
          : null,
        tasks: tasks.map(serializeTask),
      },
    });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/dashboard/state ──────────────────────────────────
// Partial update of the DashboardState row. We only accept a
// known-safe subset of fields (level, exp, totalExp, timeline,
// tomorrowPlanLockedDate). lastCelebratedAt is server-controlled
// and only mutated via the /celebrate endpoint below.
router.put('/state', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const body = req.body as {
      level?: number;
      exp?: number;
      totalExp?: number;
      timeline?: TimelineSlot[];
      tomorrowPlanLockedDate?: string | null;
    };

    const data: {
      level?: number;
      exp?: number;
      totalExp?: number;
      timeline?: string;
      tomorrowPlanLockedDate?: Date | null;
    } = {};

    if (body.level !== undefined) {
      if (typeof body.level !== 'number' || body.level < 1 || body.level > 999) {
        throw new AppError('level phai la so nguyen 1..999', 400);
      }
      data.level = Math.floor(body.level);
    }
    if (body.exp !== undefined) {
      if (typeof body.exp !== 'number' || body.exp < 0) {
        throw new AppError('exp phai la so khong am', 400);
      }
      data.exp = Math.floor(body.exp);
    }
    if (body.totalExp !== undefined) {
      if (typeof body.totalExp !== 'number' || body.totalExp < 0) {
        throw new AppError('totalExp phai la so khong am', 400);
      }
      data.totalExp = Math.floor(body.totalExp);
    }
    if (body.timeline !== undefined) {
      if (!Array.isArray(body.timeline) || body.timeline.length !== 24) {
        throw new AppError('timeline phai la mang 24 phan tu', 400);
      }
      // Validate each hour
      for (const slot of body.timeline) {
        if (typeof slot.hour !== 'number' || slot.hour < 0 || slot.hour > 23) {
          throw new AppError('timeline.hour phai 0..23', 400);
        }
        if (slot.activity !== undefined && slot.activity !== null) {
          if (typeof slot.activity.type !== 'string' || typeof slot.activity.label !== 'string') {
            throw new AppError('timeline.activity khong hop le', 400);
          }
        }
      }
      data.timeline = JSON.stringify(body.timeline);
    }
    if (body.tomorrowPlanLockedDate !== undefined) {
      if (body.tomorrowPlanLockedDate === null) {
        data.tomorrowPlanLockedDate = null;
      } else if (typeof body.tomorrowPlanLockedDate === 'string' && isValidIsoDate(body.tomorrowPlanLockedDate)) {
        data.tomorrowPlanLockedDate = new Date(`${body.tomorrowPlanLockedDate}T00:00:00.000Z`);
      } else {
        throw new AppError('tomorrowPlanLockedDate phai la YYYY-MM-DD hoac null', 400);
      }
    }

    if (Object.keys(data).length === 0) {
      throw new AppError('Khong co truong hop le de cap nhat', 400);
    }

    const state = await prisma.dashboardState.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });

    res.json({
      success: true,
      data: {
        level: state.level,
        exp: state.exp,
        totalExp: state.totalExp,
        lastCelebratedAt: state.lastCelebratedAt?.toISOString() ?? null,
        tomorrowPlanLockedDate: state.tomorrowPlanLockedDate?.toISOString() ?? null,
        updatedAt: state.updatedAt.toISOString(),
      },
    });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/dashboard/tasks ─────────────────────────────────
// Add a single task. Scope/date are normalized server-side so
// the client doesn't have to think about timezone edges.
router.post('/tasks', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const body = req.body as {
      scope?: string;
      date?: string;
      title?: string;
      exp?: number;
      activityType?: ActivityType | null;
      note?: string | null;
      dueAt?: string | null;
      remindAt?: string | null;
      priority?: number;
      repeat?: string;
      parentId?: number | null;
    };

    const scope = String(body.scope ?? 'today');
    if (!(TASK_SCOPES as readonly string[]).includes(scope)) {
      throw new AppError(`scope phai la ${TASK_SCOPES.join('|')}`, 400);
    }
    const title = String(body.title ?? '').trim();
    if (title.length === 0) throw new AppError('title khong duoc rong', 400);
    if (title.length > 500) throw new AppError('title qua dai (max 500 ky tu)', 400);

    // Normalize date so the client can pass anything vaguely
    // ISO-shaped and we always store a clean YYYY-MM-DD.
    const date = body.date ? normalizeDate(body.date) : scopeDate(scope as TaskScope);

    const exp = typeof body.exp === 'number' && body.exp > 0 && body.exp <= 1000
      ? Math.floor(body.exp)
      : 25;

    const task = await prisma.dashboardTask.create({
      data: {
        userId,
        scope,
        date,
        title,
        exp,
        activityType: body.activityType ?? null,
        note: docGhiChu(body.note) ?? null,
        dueAt: docMoc(body.dueAt, 'dueAt') ?? null,
        remindAt: docMoc(body.remindAt, 'remindAt') ?? null,
        priority: docUuTien(body.priority) ?? 0,
        repeat: docNhipLap(body.repeat) ?? 'none',
        doKho: docDoKho((body as { doKho?: number }).doKho) ?? 0,
        batDauAt: docMoc((body as { batDauAt?: string | null }).batDauAt, 'batDauAt') ?? null,
        phutLam: docPhutLam((body as { phutLam?: number | null }).phutLam) ?? null,
        /* Việc con: kiểm CHA có thật và thuộc về đúng người này. Không kiểm thì
           một client thù địch gắn việc của mình vào cây việc của người khác —
           và nó sẽ hiện lên màn hình của họ. */
        parentId: typeof body.parentId === 'number'
          ? (await prisma.dashboardTask.findFirst({
              where: { id: body.parentId, userId }, select: { id: true },
            }))?.id ?? null
          : null,
      },
    });

    res.status(201).json({ success: true, data: serializeTask(task) });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/dashboard/tasks/bulk ────────────────────────────
// Seed a list of default tasks (used by the "ensureScopeSeeded"
// path on the frontend). We replace any existing tasks for the
// requested (scope, date) to make this idempotent — a reload
// shouldn't double-seed.
router.post('/tasks/bulk', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const body = req.body as {
      scope?: string;
      date?: string;
      titles?: string[];
      activityType?: ActivityType | null;
      replace?: boolean;
    };

    const scope = String(body.scope ?? 'today');
    if (!(TASK_SCOPES as readonly string[]).includes(scope)) {
      throw new AppError(`scope phai la ${TASK_SCOPES.join('|')}`, 400);
    }
    const date = body.date ? normalizeDate(body.date) : scopeDate(scope as TaskScope);

    const titles = Array.isArray(body.titles)
      ? body.titles.map((t) => String(t).trim()).filter((t) => t.length > 0).slice(0, 50)
      : [];
    if (titles.length === 0) throw new AppError('titles phai la mang khong rong', 400);

    // Idempotency: by default we skip if any task already exists
    // for the (user, scope, date) triple. The frontend uses this
    // to avoid re-seeding on every page load. If `replace=true`
    // we wipe and re-create — useful after the user manually
    // deletes all tasks and we want to restore defaults.
    if (!body.replace) {
      const existing = await prisma.dashboardTask.findFirst({
        where: { userId, scope, date, archivedAt: null },
        select: { id: true },
      });
      if (existing) {
        // Don't seed twice — but still return the existing tasks
        // so the client can hydrate without a second round-trip.
        const tasks = await prisma.dashboardTask.findMany({
          where: { userId, scope, date, archivedAt: null },
          orderBy: { id: 'asc' },
        });
        res.json({
          success: true,
          data: { skipped: true, tasks: tasks.map(serializeTask) },
        });
        return;
      }
    } else {
      // Replace mode: archive any existing tasks for this slot.
      await prisma.dashboardTask.updateMany({
        where: { userId, scope, date, archivedAt: null },
        data: { archivedAt: new Date() },
      });
    }

    const created = await prisma.$transaction(
      titles.map((title) =>
        prisma.dashboardTask.create({
          data: {
            userId,
            scope,
            date,
            title,
            exp: 25,
            activityType: body.activityType ?? null,
          },
        }),
      ),
    );

    res.status(201).json({
      success: true,
      data: { skipped: false, tasks: created.map(serializeTask) },
    });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/dashboard/tasks/:id ───────────────────────────
// Partial update. Used for toggle-done and (in the future) edit
// title, change scope, etc. We only allow the caller to update
// rows they own — the where clause includes userId.
router.patch('/tasks/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new AppError('id khong hop le', 400);
    }
    const body = req.body as {
      title?: string;
      done?: boolean;
      exp?: number;
      activityType?: ActivityType | null;
      scope?: string;
      date?: string;
      note?: string | null;
      dueAt?: string | null;
      remindAt?: string | null;
      priority?: number;
      repeat?: string;
      /** Đánh dấu ĐÃ NHẮC — app gọi sau khi hiện thông báo. */
      remindedNow?: boolean;
      doKho?: number;
      batDauAt?: string | null;
      phutLam?: number | null;
      lyDoTruot?: string | null;
      /** Đã bắn câu "sắp hết giờ" — app gọi sau khi hiện. */
      canhBaoNow?: boolean;
    };

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) {
      const title = String(body.title).trim();
      if (title.length === 0) throw new AppError('title khong duoc rong', 400);
      if (title.length > 500) throw new AppError('title qua dai', 400);
      data.title = title;
    }
    if (body.done !== undefined) {
      if (typeof body.done !== 'boolean') throw new AppError('done phai la boolean', 400);
      data.done = body.done;
      data.completedAt = body.done ? new Date() : null;
    }
    if (body.exp !== undefined) {
      if (typeof body.exp !== 'number' || body.exp < 0 || body.exp > 1000) {
        throw new AppError('exp phai 0..1000', 400);
      }
      data.exp = Math.floor(body.exp);
    }
    if (body.activityType !== undefined) {
      data.activityType = body.activityType ?? null;
    }
    if (body.scope !== undefined) {
      if (!(TASK_SCOPES as readonly string[]).includes(body.scope)) {
        throw new AppError(`scope phai la ${TASK_SCOPES.join('|')}`, 400);
      }
      data.scope = body.scope;
    }
    if (body.date !== undefined) {
      data.date = normalizeDate(body.date);
    }
    const ghiChu = docGhiChu(body.note);
    if (ghiChu !== undefined) data.note = ghiChu;
    const han = docMoc(body.dueAt, 'dueAt');
    if (han !== undefined) data.dueAt = han;
    const nhac = docMoc(body.remindAt, 'remindAt');
    if (nhac !== undefined) {
      data.remindAt = nhac;
      /* Đổi giờ nhắc ⇒ XOÁ dấu đã-nhắc. Không xoá thì dời lịch nhắc sang mai
         xong nó không bao giờ kêu nữa, vì hệ thống vẫn nhớ là "đã nhắc rồi". */
      data.remindedAt = null;
    }
    const uuTien = docUuTien(body.priority);
    if (uuTien !== undefined) data.priority = uuTien;
    if (body.remindedNow === true) data.remindedAt = new Date();
    const nhip = docNhipLap(body.repeat);
    if (nhip !== undefined) data.repeat = nhip;
    const kho = docDoKho(body.doKho);
    if (kho !== undefined) data.doKho = kho;
    const batDau = docMoc(body.batDauAt, 'batDauAt');
    if (batDau !== undefined) data.batDauAt = batDau;
    const phut = docPhutLam(body.phutLam);
    if (phut !== undefined) data.phutLam = phut;
    const lyDo = docGhiChu(body.lyDoTruot);
    if (lyDo !== undefined) data.lyDoTruot = lyDo;
    if (body.canhBaoNow === true) data.canhBaoLuc = new Date();
    /* Dời giờ (bắt đầu hoặc hạn) ⇒ XOÁ dấu đã-cảnh-báo, cùng lý do như
       `remindedAt` ở trên: không xoá thì dời sang chiều xong nó không
       bao giờ cảnh báo nữa vì hệ thống vẫn nhớ "đã báo rồi". */
    if (batDau !== undefined || han !== undefined) data.canhBaoLuc = null;

    if (Object.keys(data).length === 0) {
      throw new AppError('Khong co truong hop le de cap nhat', 400);
    }

    /* Ảnh chụp TRƯỚC khi sửa. Cần nó để chấm uy tín: sau `update` thì
       `truotLuc`/`daTruUyTin` vẫn còn, nhưng mốc hết giờ có thể vừa bị
       chính lời gọi này dời đi — và khi đó "xong đúng hạn hay trễ" sẽ
       được chấm theo hạn MỚI, tức là ai cũng đúng hạn nếu biết dời hạn
       trong cùng một request. */
    const truoc = await prisma.dashboardTask.findFirst({
      where: { id: taskId, userId },
      select: {
        id: true, title: true, done: true, doKho: true, priority: true,
        dueAt: true, batDauAt: true, phutLam: true,
        truotLuc: true, daTruUyTin: true,
      },
    });
    if (!truoc) throw new AppError('Task khong ton tai hoac khong thuoc ve ban', 404);

    // updateMany returns the count, not the row. We use it
    // because it lets us put userId in the WHERE — that way
    // a hostile client can't PATCH someone else's task.
    const result = await prisma.dashboardTask.updateMany({
      where: { id: taskId, userId },
      data,
    });
    if (result.count === 0) {
      throw new AppError('Task khong ton tai hoac khong thuoc ve ban', 404);
    }

    /* Chỉ chấm khi CHUYỂN từ chưa xong → xong. Không có chốt `!truoc.done`
       thì mỗi lần PATCH một việc đã xong (đổi tên, đổi ghi chú) lại cộng
       điểm thêm một lần. */
    let uyTin: Awaited<ReturnType<typeof khiTichXong>> | null = null;
    if (body.done === true && !truoc.done) {
      uyTin = await khiTichXong(userId, truoc);
    }

    const task = await prisma.dashboardTask.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError('Task khong ton tai', 404);

    res.json({ success: true, data: { ...serializeTask(task), uyTin } });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/dashboard/tasks/reorder ────────────────────────
// Đặt lại thứ tự sau khi người dùng kéo thả. Nhận NGUYÊN danh sách
// id theo thứ tự mới, không nhận "chuyển việc X lên trên việc Y":
// gửi cả danh sách thì kết quả không phụ thuộc vào việc client và
// máy chủ có cùng cách hiểu về trạng thái trước đó hay không.
router.post('/tasks/reorder', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const ids = (req.body as { ids?: unknown }).ids;
    if (!Array.isArray(ids) || ids.length === 0) throw new AppError('ids phai la mang', 400);
    if (ids.length > 500) throw new AppError('qua nhieu id (max 500)', 400);
    const so = ids.map(Number).filter((n) => Number.isInteger(n) && n > 0);
    if (so.length !== ids.length) throw new AppError('ids chua gia tri khong hop le', 400);

    /* `updateMany` có `userId` trong WHERE ⇒ một client thù địch gửi id của
       người khác thì lệnh đó khớp 0 dòng, không phải đổi thứ tự việc của họ. */
    await prisma.$transaction(
      so.map((id, i) => prisma.dashboardTask.updateMany({
        where: { id, userId },
        data: { sortOrder: i },
      })),
    );
    res.json({ success: true, data: { count: so.length } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/dashboard/reminders ─────────────────────────────
// Việc TỚI GIỜ NHẮC mà chưa nhắc. Endpoint RIÊNG, cố ý nhẹ:
// app hỏi nó mỗi phút ở nền, nên nó không được kéo theo timeline,
// EXP, celebration như `GET /`. Chỉ trả đúng thứ cần để hiện một
// thông báo, và dựa lên `idx_dashboard_tasks_remind`.
router.get('/reminders', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const bayGio = new Date();
    const viec = await prisma.dashboardTask.findMany({
      where: {
        userId,
        done: false,
        archivedAt: null,
        remindedAt: null,
        remindAt: { not: null, lte: bayGio },
      },
      // Trần 20: nếu người dùng đi vắng ba ngày thì có thể có hàng chục việc
      // quá hạn nhắc cùng lúc. Bắn 40 thông báo liên tiếp là cách chắc chắn
      // nhất để họ tắt hẳn tính năng này.
      take: 20,
      orderBy: { remindAt: 'asc' },
    });
    /* ─── QUÉT QUÁ HẠN ngay trong vòng dò nhắc ───────────────────
       Vì sao không cron: xem chú thích đầu `chamCong.ts`. Tóm tắt: cron
       chạy cho TOÀN BỘ người dùng mỗi phút để phục vụ một nhúm đang mở
       app, và mất một nhịp khi container restart thì không ai biết.
       Quét ở đây rẻ hơn nhiều bậc và tự lành — `truotLuc` tính từ MỐC
       THỜI GIAN chứ không từ lúc vòng quét chạy, nên vắng ba ngày rồi
       mở lại vẫn ra đúng kết quả, đúng một lượt. */
    const quet = await quetQuaHan(userId, bayGio);

    /* ─── Việc SẮP hết giờ (còn ≤ 15 phút) ───────────────────────
       Tách khỏi `remindAt` có chủ ý: `remindAt` là lời nhắc người dùng
       tự đặt, còn cái này là cảnh báo hệ thống tự tính từ hạn. Gộp hai
       thứ thì đặt nhắc lúc 9h sáng sẽ nuốt mất cảnh báo lúc 17h45. */
    const sapHet = await prisma.dashboardTask.findMany({
      where: {
        userId, done: false, archivedAt: null, truotLuc: null, canhBaoLuc: null,
        OR: [{ dueAt: { not: null } }, { batDauAt: { not: null } }],
      },
      take: 50,
    });
    const canhBao = sapHet.filter((t) => {
      const moc = mocHetGio(t);
      if (!moc) return false;
      const conPhut = (moc.getTime() - bayGio.getTime()) / 60_000;
      return conPhut > 0 && conPhut <= TRUOC_HET_GIO_PHUT;
    });

    res.json({
      success: true,
      data: {
        tasks: viec.map(serializeTask),
        sapHetGio: canhBao.map(serializeTask),
        vuaTruot: quet.truot,
        uyTin: quet.diem,
      },
    });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/dashboard/uy-tin ────────────────────────────────
// Điểm uy tín + 50 dòng sổ gần nhất.
//
// Trả cả sổ chứ không chỉ con số: một điểm số không giải thích được là
// một điểm số không ai tin, và người đầu tiên thấy mình tụt xuống 83 sẽ
// hỏi "vì sao 83" — nếu không trả lời được thì họ tắt tính năng.
router.get('/uy-tin', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    /* Quét trước khi đọc: mở thẳng bảng uy tín mà chưa quét thì điểm hiện
       ra là điểm CŨ, và vài giây sau nó tự tụt — trông như lỗi. */
    await quetQuaHan(userId);
    const kq = await layUyTin(userId);
    res.json({
      success: true,
      data: { ...kq, bac: bacUyTin(kq.diem), moc: UY_TIN_DAU },
    });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/dashboard/tasks/:id/hoan ───────────────────────
// DỜI một việc sang ngày khác. KHÔNG bị trừ điểm.
//
// Vì sao phải có: thiếu nó, cách duy nhất để không mất điểm cho một việc
// không kịp làm là XOÁ nó. Và khi người dùng học được điều đó thì bảng kế
// hoạch chỉ còn lại những việc đã xong — nó thành một cuốn album, không
// còn là công cụ. `soLanHoan` đếm lại để dời vô hạn vẫn nhìn thấy được.
router.post('/tasks/:id/hoan', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) throw new AppError('id khong hop le', 400);

    const body = req.body as { date?: string; batDauAt?: string | null };
    /* Không nói dời đi đâu thì dời sang MAI — đó là ca thường gặp nhất,
       và `normalizeDate('')` ném `Error` trần (thành 500), không phải
       `AppError` 400. */
    const mai = new Date(Date.now() + 7 * 3600_000 + 86_400_000).toISOString().slice(0, 10);
    let ngayMoi: string;
    try {
      ngayMoi = body.date ? normalizeDate(String(body.date)) : mai;
    } catch { throw new AppError('date khong hop le', 400); }

    const cu = await prisma.dashboardTask.findFirst({
      where: { id: taskId, userId },
      select: { id: true, truotLuc: true, daTruUyTin: true, title: true, soLanHoan: true },
    });
    if (!cu) throw new AppError('Task khong ton tai hoac khong thuoc ve ban', 404);

    /* Dời một việc ĐÃ trượt thì hoàn lại NGUYÊN số điểm đã trừ: nó không
       còn là việc bị bỏ, nó là việc được xếp lại. Chỉ hoàn một nửa như
       ca "làm nốt muộn" sẽ phạt đúng hành vi mình muốn khuyến khích. */
    let hoanLai = 0;
    if (cu.truotLuc && cu.daTruUyTin && cu.daTruUyTin > 0) {
      const kq = await ghiUyTin(userId, cu.daTruUyTin, 'hoan-tac', `Dời sang ${ngayMoi}: ${cu.title}`, cu.id);
      hoanLai = kq.thuc;
    }

    const moi = await prisma.dashboardTask.update({
      where: { id: taskId },
      data: {
        date: ngayMoi,
        batDauAt: docMoc(body.batDauAt, 'batDauAt') ?? null,
        dueAt: null,
        truotLuc: null,
        daTruUyTin: null,
        canhBaoLuc: null,
        remindedAt: null,
        soLanHoan: cu.soLanHoan + 1,
      },
    });
    res.json({ success: true, data: { ...serializeTask(moi), hoanLai } });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/dashboard/danh-gia ────────────────────────────
// AI xem lại kế hoạch của MỘT ngày và nói thẳng chỗ xếp quá tay.
//
// ⚠️ Số liệu được TÍNH Ở ĐÂY rồi mới đưa vào lời nhắc — không đưa danh sách
// thô rồi bảo model tự cộng. Model cộng giờ sai là chuyện thường, và một lời
// khuyên dựa trên tổng sai thì tệ hơn không có lời khuyên nào.
// Xem [[feedback_let_model_describe_let_code_compute_geometry]].
router.post('/danh-gia', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    let date: string;
    try { date = normalizeDate(String((req.body as { date?: string }).date ?? '')); }
    catch { throw new AppError('date phai dang YYYY-MM-DD', 400); }

    const ds = await prisma.dashboardTask.findMany({
      where: { userId, archivedAt: null, date, parentId: null },
      orderBy: [{ batDauAt: 'asc' }, { id: 'asc' }],
      take: 60,
    });
    if (ds.length === 0) {
      res.json({ success: true, data: { nhanXet: 'Ngày này chưa có việc nào để xem.', so: null } });
      return;
    }

    /* ─── PHẦN SỐ: mã tính, không hỏi model ─── */
    const tongPhut = ds.reduce((t, v) => t + (v.phutLam ?? 0), 0);
    const khongGio = ds.filter((v) => !v.batDauAt).length;
    const khongDoDai = ds.filter((v) => !v.phutLam).length;
    const kho3 = ds.filter((v) => v.doKho === 3).length;
    const chuaChon = ds.filter((v) => v.doKho === 0 || v.priority === 0).length;
    const rui = ds.reduce((t, v) => t + (v.done || v.truotLuc ? 0 : mucTru(v.doKho, v.priority)), 0);

    /* Chồng giờ — tính bằng mã, vì nó là so sánh khoảng, thứ model làm sai
       lặng lẽ và tự tin. */
    const coGio = ds
      .filter((v) => v.batDauAt && v.phutLam)
      .map((v) => ({ t: v.title, d: v.batDauAt!.getTime(), c: v.batDauAt!.getTime() + v.phutLam! * 60_000 }))
      .sort((a, b) => a.d - b.d);
    const chong: string[] = [];
    for (let i = 1; i < coGio.length; i += 1) {
      for (let j = i - 1; j >= 0; j -= 1) {
        if (coGio[j]!.c > coGio[i]!.d) chong.push(`${coGio[j]!.t} ↔ ${coGio[i]!.t}`);
      }
    }

    const so = {
      tongViec: ds.length,
      tongPhut,
      khongGio,
      khongDoDai,
      viecKho: kho3,
      chuaChonMuc: chuaChon,
      chongGio: chong.slice(0, 5),
      uyTinRuiRo: rui,
    };

    if (!isAiAvailable()) {
      /* Không có khoá AI thì vẫn trả SỐ LIỆU. Phần đắt giá nhất của tính năng
         này là mấy con số — tổng giờ, chỗ chồng, uy tín đang đặt cược — và
         chúng do mã tính, không cần model. Trả rỗng chỉ vì thiếu khoá là vứt
         đi thứ vẫn dùng được. */
      res.json({ success: true, data: { nhanXet: null, so, lyDo: 'ai_unavailable' } });
      return;
    }

    const bang = ds.map((v) => [
      v.batDauAt ? new Date(v.batDauAt.getTime() + 7 * 3600_000).toISOString().slice(11, 16) : '--:--',
      v.phutLam ? `${v.phutLam}p` : '?',
      ['?', 'dễ', 'vừa', 'khó'][v.doKho] ?? '?',
      ['?', 'thường', 'quan trọng', 'rất quan trọng'][v.priority] ?? '?',
      v.done ? '[xong]' : v.truotLuc ? '[TRƯỢT]' : '[đang]',
      v.title,
    ].join(' | ')).join('\n');

    const kq = await llmComplete({
      step: 'generation',
      purpose: 'plan_review',
      feature: 'chat',
      userId,
      maxTokens: 420,
      system: 'Bạn xem kế hoạch trong ngày của một người và nói thẳng, ngắn gọn, bằng TIẾNG VIỆT.\n'
        + 'Viết TỐI ĐA 4 gạch đầu dòng, mỗi dòng dưới 22 từ. Không mở bài, không chúc, không khen xã giao.\n'
        + 'CHỈ nói điều RÚT RA TỪ SỐ LIỆU đã cho — TUYỆT ĐỐI không tự cộng lại giờ, không tự suy ra tổng nào khác.\n'
        + 'Ưu tiên theo thứ tự: xếp quá sức → trùng giờ → việc khó dồn cục → việc thiếu giờ/thiếu thời lượng.\n'
        + 'Nếu kế hoạch ổn thì nói đúng một dòng là ổn, đừng bịa ra vấn đề.',
      messages: [{
        role: 'user',
        content: `Ngày ${date}.\n`
          + `Số liệu đã tính sẵn: ${JSON.stringify(so)}\n\n`
          + `Bảng việc (giờ | thời lượng | khó | quan trọng | trạng thái | tên):\n${bang}`,
      }],
    });

    res.json({ success: true, data: { nhanXet: kq?.text?.trim() || null, so } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/dashboard/ngay?date=YYYY-MM-DD ─────────────────
// Việc của ĐÚNG MỘT ngày, cho bảng kế hoạch chi tiết.
//
// Endpoint riêng chứ không lọc từ `GET /`: cái đó trả về MỌI việc chưa
// lưu trữ ở mọi phạm vi, và bảng kế hoạch chỉ cần một ngày. Tải cả năm
// về để hiện một ngày là thứ chạy được lúc có 30 việc và chậm dần đều
// cho tới khi không ai nhớ vì sao.
router.get('/ngay', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    let date: string;
    try { date = normalizeDate(String(req.query.date ?? '')); }
    catch { throw new AppError('date phai dang YYYY-MM-DD', 400); }

    /* Quét TRƯỚC khi đọc: mở một ngày đã qua mà chưa quét thì việc quá
       hạn hiện ra là "đang làm", rồi vài giây sau tự đổi sang "trượt" —
       trông như bảng tự sửa sau lưng người dùng. */
    await quetQuaHan(userId);

    const ds = await prisma.dashboardTask.findMany({
      where: { userId, archivedAt: null, date },
      orderBy: [{ batDauAt: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
    });
    res.json({ success: true, data: { date, tasks: ds.map(serializeTask) } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/dashboard/thang?ym=YYYY-MM ──────────────────────
// Tóm tắt từng NGÀY trong tháng, cho các chấm màu dưới ô lịch.
//
// Trả về đếm, KHÔNG trả về cả danh sách việc: một tháng dày có thể hàng
// trăm việc, và lịch chỉ cần biết mỗi ngày có bao nhiêu xong/trượt/còn.
router.get('/thang', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const ym = String(req.query.ym ?? '').trim() || ngayVN().slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(ym)) throw new AppError('ym phai dang YYYY-MM', 400);

    await quetQuaHan(userId);

    const ds = await prisma.dashboardTask.findMany({
      where: { userId, archivedAt: null, parentId: null, date: { startsWith: ym } },
      select: { date: true, done: true, truotLuc: true, doKho: true },
    });

    const theoNgay: Record<string, { tong: number; xong: number; truot: number; khoNhat: number }> = {};
    for (const t of ds) {
      const o = theoNgay[t.date] ?? { tong: 0, xong: 0, truot: 0, khoNhat: 0 };
      o.tong += 1;
      if (t.done) o.xong += 1;
      else if (t.truotLuc) o.truot += 1;
      if (t.doKho > o.khoNhat) o.khoNhat = t.doKho;
      theoNgay[t.date] = o;
    }
    res.json({ success: true, data: { ym, ngay: theoNgay } });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/dashboard/tasks/:id ──────────────────────────
// HARD delete: when the user explicitly deletes a task it is
// removed immediately and permanently — there is no archive
// limbo for a manual delete. (Auto-expiry of *completed* tasks is
// the only path that hides tasks without the user asking; that's
// handled by the GET filter + the nightly cron.)
//
// We still scope by userId in the WHERE so a hostile client can't
// delete another user's task by guessing the id (IDOR guard). The
// deleteMany return count lets us 404 cleanly when nothing matched.
router.delete('/tasks/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new AppError('id khong hop le', 400);
    }
    const result = await prisma.dashboardTask.deleteMany({
      where: { id: taskId, userId },
    });
    if (result.count === 0) {
      throw new AppError('Task khong ton tai hoac khong thuoc ve ban', 404);
    }
    res.json({ success: true, data: { id: taskId, deleted: true } });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/dashboard/celebrate ─────────────────────────────
// Idempotent "end of day" celebration. Awards EXP for tasks done
// today and locks the day so the user can't double-claim. We use
// a unique index on (user_id, celebrated_date) and rely on Prisma
// throwing P2002 if the user tries twice — we surface that as 409.
router.post('/celebrate', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;

    /* ⛔⛔ NGÀY THEO GIỜ MÁY, KHÔNG PHẢI UTC.
     *
     * Bản cũ dùng thẳng `todayIso()` (UTC) và BỎ QUA ngày client gửi. Ở UTC+7,
     * từ 00:00 tới 07:00 thì "hôm nay" của máy chủ vẫn là HÔM QUA, trong khi
     * việc được tạo với ngày theo giờ máy (app gửi kèm `date` — xem `GET /`
     * ngay trên). Hậu quả đo thật lúc 03:39 giờ Việt: một việc đã xong đáng 25
     * EXP mà tổng kết trả về **0 EXP**, rồi vẫn đóng dấu đã-tổng-kết cho NGÀY
     * HÔM QUA — người dùng mất luôn lượt của ngày hôm nay và không hiểu vì sao.
     *
     * Lỗi này có ở CẢ app desktop, cùng khung giờ. Nhận `homNay` từ client,
     * lùi về UTC nếu client cũ không gửi. */
    const hnRaw = String((req.body?.homNay ?? '') as string);
    const today = isValidIsoDate(hnRaw) ? hnRaw : todayIso();

    // 1. Compute today's stats. We do this BEFORE the celebration
    // row so the numbers we persist reflect the moment the user
    // clicked, not a later re-read that could include new tasks
    // they added after celebrating.
    const todayTasks = await prisma.dashboardTask.findMany({
      where: { userId, date: today, archivedAt: null },
    });
    const done = todayTasks.filter((t) => t.done).length;
    const total = todayTasks.length;
    const expGained = todayTasks.filter((t) => t.done).reduce((s, t) => s + t.exp, 0);

    // 2. Insert the celebration row. The unique constraint on
    // (user_id, celebrated_date) makes this a no-op for repeat
    // requests, but we also short-circuit by checking first
    // so the response is friendlier than a Prisma 500.
    const existing = await prisma.dashboardCelebration.findFirst({
      where: { userId, celebratedDate: today },
    });
    if (existing) {
      res.status(409).json({
        success: false,
        code: 'ALREADY_CELEBRATED',
        message: 'Ban da tong ket hom nay roi',
        data: serializeCelebration(existing),
      });
      return;
    }

    const celebration = await prisma.dashboardCelebration.create({
      data: {
        userId,
        celebratedDate: today,
        expAwarded: expGained,
        tasksDone: done,
        tasksTotal: total,
      },
    });

    // 3. Update the state row: bump level/exp, mark celebrated.
    // We do this in a single upsert so the math is atomic.
    const state = await prisma.dashboardState.upsert({
      where: { userId },
      create: {
        userId,
        exp: expGained,
        totalExp: expGained,
        level: 1,
        lastCelebratedAt: new Date(),
      },
      update: {
        exp: { increment: expGained },
        totalExp: { increment: expGained },
        lastCelebratedAt: new Date(),
      },
    });

    // 4. Roll level-ups. Same logic as the old client: subtract
    // expForNextLevel repeatedly until exp fits in the current
    // level. We keep the math server-side so the client can't
    // inflate its own level by sending a hand-crafted level=99
    // on the next /state call — the level you see here came
    // from the server's own counter.
    const EXP_PER_LEVEL_BASE = 200;
    let exp = state.exp;
    let level = state.level;
    let needed = EXP_PER_LEVEL_BASE + (level - 1) * 50;
    let safety = 0;
    while (exp >= needed && safety < 1000) {
      exp -= needed;
      level += 1;
      needed = EXP_PER_LEVEL_BASE + (level - 1) * 50;
      safety += 1;
    }
    if (level !== state.level || exp !== state.exp) {
      const updated = await prisma.dashboardState.update({
        where: { userId },
        data: { exp, level },
      });
      Object.assign(state, updated);
    }

    res.json({
      success: true,
      data: {
        celebration: serializeCelebration(celebration),
        state: {
          level: state.level,
          exp: state.exp,
          totalExp: state.totalExp,
          lastCelebratedAt: state.lastCelebratedAt?.toISOString() ?? null,
        },
        todayStats: { expGained, done, total },
      },
    });
  } catch (error) {
    // Race guard: two near-simultaneous celebrate requests can both
    // pass the findFirst pre-check and then collide on the
    // (user_id, celebrated_date) unique index. Prisma surfaces that
    // as P2002 — treat it as "already celebrated" (409) rather than
    // leaking a 500.
    if ((error as { code?: string }).code === 'P2002') {
      res.status(409).json({
        success: false,
        code: 'ALREADY_CELEBRATED',
        message: 'Ban da tong ket hom nay roi',
      });
      return;
    }
    next(error);
  }
});

// ─── POST /api/v1/dashboard/plan-tomorrow ────────────────────────
// Pre-create tomorrow's tasks from a list of titles. We use a
// separate endpoint so the celebrate flow can stay simple. If
// tomorrow's tasks already exist (e.g. the user already planned
// yesterday and the day rolled over), we replace them.
router.post('/plan-tomorrow', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const body = req.body as { titles?: string[]; activityType?: ActivityType | null };

    const titles = Array.isArray(body.titles)
      ? body.titles.map((t) => String(t).trim()).filter((t) => t.length > 0).slice(0, 20)
      : [];
    if (titles.length === 0) throw new AppError('titles phai la mang khong rong', 400);

    /* ⛔⛔ Cùng bẫy UTC như `/celebrate`: `new Date()` rồi `toISOString()` cho
     * ra ngày UTC. Ở UTC+7 lúc 03:39 giờ máy thì UTC vẫn là hôm qua, nên
     * "ngày mai" tính ra lại đúng bằng HÔM NAY của người dùng — kế hoạch mai
     * đổ thẳng vào danh sách việc đang làm dở. Nhận `homNay` theo giờ máy. */
    const hnRaw = String((body as { homNay?: string }).homNay ?? '');
    const goc = isValidIsoDate(hnRaw) ? new Date(`${hnRaw}T12:00:00.000Z`) : new Date();
    goc.setUTCDate(goc.getUTCDate() + 1);
    const iso = goc.toISOString().slice(0, 10);

    // Archive any existing tomorrow tasks so the plan replaces
    // instead of stacks. The user explicitly chose these titles.
    await prisma.dashboardTask.updateMany({
      where: { userId, scope: 'today', date: iso, archivedAt: null },
      data: { archivedAt: new Date() },
    });

    const created = await prisma.$transaction(
      titles.map((title) =>
        prisma.dashboardTask.create({
          data: {
            userId,
            scope: 'today',
            date: iso,
            title,
            exp: 25,
            activityType: body.activityType ?? null,
          },
        }),
      ),
    );

    // Mark the lock. This is what stops the celebrate modal
    // from nagging the user again on the same day.
    await prisma.dashboardState.upsert({
      where: { userId },
      create: {
        userId,
        tomorrowPlanLockedDate: new Date(),
      },
      update: {
        tomorrowPlanLockedDate: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        tomorrowDate: iso,
        tasks: created.map(serializeTask),
      },
    });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/dashboard/export ────────────────────────────────
// Returns a single JSON blob of the full dashboard state. The
// client uses this for the "Export to JSON" backup button. We
// include both active and recently archived tasks so the user
// can recover from a mistake.
router.get('/export', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const [state, tasks, celebrations] = await Promise.all([
      prisma.dashboardState.findUnique({ where: { userId } }),
      prisma.dashboardTask.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 5000,
      }),
      prisma.dashboardCelebration.findMany({
        where: { userId },
        orderBy: { celebratedDate: 'desc' },
        take: 1000,
      }),
    ]);

    res.json({
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        version: 1,
        state: state
          ? {
              level: state.level,
              exp: state.exp,
              totalExp: state.totalExp,
              timeline: state.timeline,
            }
          : null,
        tasks: tasks.map((t) => ({
          id: t.id,
          scope: t.scope,
          date: t.date,
          title: t.title,
          done: t.done,
          exp: t.exp,
          activityType: t.activityType,
          createdAt: t.createdAt.toISOString(),
          completedAt: t.completedAt?.toISOString() ?? null,
          archivedAt: t.archivedAt?.toISOString() ?? null,
        })),
        celebrations: celebrations.map((c) => ({
          celebratedDate: c.celebratedDate,
          expAwarded: c.expAwarded,
          tasksDone: c.tasksDone,
          tasksTotal: c.tasksTotal,
          createdAt: c.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/dashboard/import ───────────────────────────────
// Restores a previously-exported JSON blob. Strategy: delete all
// of the user's current active tasks, then re-create from the
// import. We do NOT touch archived tasks — those stay in the DB
// for the history view. Use a "wipe everything" button on the
// frontend if you want a true reset.
router.post('/import', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const body = req.body as {
      version?: number;
      state?: { level: number; exp: number; totalExp: number; timeline: string } | null;
      tasks?: Array<{
        scope: string;
        date: string;
        title: string;
        done: boolean;
        exp: number;
        activityType: string | null;
      }>;
    };

    if (body.version !== 1) {
      throw new AppError('Chi ho tro phien ban export = 1', 400);
    }

    // Wrap in a transaction so a bad import can't half-write.
    await prisma.$transaction(async (tx) => {
      // Clear current active tasks (preserve archived for history).
      await tx.dashboardTask.updateMany({
        where: { userId, archivedAt: null },
        data: { archivedAt: new Date() },
      });

      if (body.state) {
        await tx.dashboardState.upsert({
          where: { userId },
          create: {
            userId,
            level: body.state.level,
            exp: body.state.exp,
            totalExp: body.state.totalExp,
            timeline: body.state.timeline,
          },
          update: {
            level: body.state.level,
            exp: body.state.exp,
            totalExp: body.state.totalExp,
            timeline: body.state.timeline,
          },
        });
      }

      if (Array.isArray(body.tasks)) {
        for (const t of body.tasks) {
          if (!(TASK_SCOPES as readonly string[]).includes(t.scope)) continue;
          if (typeof t.title !== 'string' || t.title.length === 0) continue;
          if (typeof t.date !== 'string' || !isValidIsoDate(t.date)) continue;
          await tx.dashboardTask.create({
            data: {
              userId,
              scope: t.scope,
              date: t.date,
              title: t.title.slice(0, 500),
              done: Boolean(t.done),
              exp: typeof t.exp === 'number' ? Math.max(0, Math.min(1000, t.exp)) : 25,
              activityType: t.activityType ?? null,
              completedAt: t.done ? new Date() : null,
            },
          });
        }
      }
    });

    res.json({ success: true, data: { imported: true } });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/dashboard ────────────────────────────────────
// "Reset to factory defaults" — wipes state + active tasks for
// the caller. Archived tasks and celebration history are kept
// (move them out of the way to /export first if you want them
// gone permanently). Requires ?confirm=YES in the body to
// protect against accidental clicks.
router.delete('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const confirm = req.query.confirm ?? req.body?.confirm;
    if (confirm !== 'YES') {
      throw new AppError('Can xac nhan bang cach gui ?confirm=YES', 400);
    }
    await prisma.$transaction([
      prisma.dashboardTask.updateMany({
        where: { userId, archivedAt: null },
        data: { archivedAt: new Date() },
      }),
      prisma.dashboardState.upsert({
        where: { userId },
        create: { userId, level: 1, exp: 0, totalExp: 0, timeline: '[]' },
        update: { level: 1, exp: 0, totalExp: 0, timeline: '[]' },
      }),
    ]);
    res.json({ success: true, data: { reset: true } });
  } catch (error) { next(error); }
});

// ─── helpers ─────────────────────────────────────────────────────

function serializeTask(t: {
  id: number; scope: string; date: string; title: string;
  done: boolean; exp: number; activityType: string | null;
  createdAt: Date; completedAt: Date | null;
  note?: string | null; dueAt?: Date | null; remindAt?: Date | null;
  remindedAt?: Date | null; priority?: number;
  repeat?: string; parentId?: number | null; sortOrder?: number;
  doKho?: number; batDauAt?: Date | null; phutLam?: number | null;
  truotLuc?: Date | null; lyDoTruot?: string | null;
  daTruUyTin?: number | null; canhBaoLuc?: Date | null; soLanHoan?: number;
}) {
  return {
    id: t.id,
    scope: t.scope,
    date: t.date,
    title: t.title,
    done: t.done,
    exp: t.exp,
    activityType: t.activityType as ActivityType | null,
    createdAt: t.createdAt.toISOString(),
    completedAt: t.completedAt?.toISOString() ?? null,
    note: t.note ?? null,
    dueAt: t.dueAt?.toISOString() ?? null,
    remindAt: t.remindAt?.toISOString() ?? null,
    remindedAt: t.remindedAt?.toISOString() ?? null,
    priority: t.priority ?? 0,
    repeat: t.repeat ?? 'none',
    parentId: t.parentId ?? null,
    sortOrder: t.sortOrder ?? 0,
    doKho: t.doKho ?? 0,
    batDauAt: t.batDauAt?.toISOString() ?? null,
    phutLam: t.phutLam ?? null,
    truotLuc: t.truotLuc?.toISOString() ?? null,
    lyDoTruot: t.lyDoTruot ?? null,
    daTruUyTin: t.daTruUyTin ?? null,
    soLanHoan: t.soLanHoan ?? 0,
    /* Mức sẽ bị trừ NẾU trượt. Gửi kèm để giao diện nói được "trượt
       mất 6 điểm" ngay trên thẻ việc, thay vì bắt người dùng tự nhân
       hai con số trong đầu — mà nếu họ phải nhân thì họ sẽ không nhân. */
    truNeuTruot: mucTru(t.doKho, t.priority),
  };
}

/** Nhịp lặp hợp lệ. Chuỗi lạ ⇒ từ chối, đừng lặng lẽ coi như 'none'. */
export const NHIP_LAP = ['none', 'daily', 'weekly', 'monthly'] as const;
function docNhipLap(v: unknown): string | undefined {
  if (v === undefined) return undefined;
  const t = String(v);
  if (!(NHIP_LAP as readonly string[]).includes(t)) {
    throw new AppError(`repeat phai la ${NHIP_LAP.join('|')}`, 400);
  }
  return t;
}

/**
 * Đọc một mốc thời gian từ thân yêu cầu.
 *
 * `null` là GIÁ TRỊ HỢP LỆ (xoá hạn), khác hẳn `undefined` (không đụng tới) —
 * gộp hai thứ lại thì người dùng không bao giờ bỏ được cái hạn đã đặt.
 */
function docMoc(v: unknown, ten: string): Date | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) throw new AppError(`${ten} khong phai thoi diem hop le`, 400);
  return d;
}

/** Ưu tiên 0..3. Ngoài khoảng ⇒ từ chối, đừng lặng lẽ kẹp về biên. */
/**
 * Mức KHÓ: 1 = dễ · 2 = vừa · 3 = khó.
 *
 * Nhận `0` để client xoá lựa chọn, nhưng giao diện BẮT chọn 1–3 khi
 * tạo việc mới — mức trừ uy tín dựa vào nó, và "chưa chọn" nghĩa là
 * máy chủ phải đoán thay người dùng.
 */
function docDoKho(v: unknown): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 0 || n > 3) throw new AppError('doKho phai 0..3', 400);
  return n;
}

/** Thời lượng dự kiến, PHÚT. Trần 24 giờ — quá đó là gõ nhầm. */
function docPhutLam(v: unknown): number | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0 || n > 1440) throw new AppError('phutLam phai 1..1440', 400);
  return n;
}

function docUuTien(v: unknown): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 0 || n > 3) throw new AppError('priority phai 0..3', 400);
  return n;
}

/** Ghi chú: chuỗi rỗng ⇒ `null`, để DB không đầy chuỗi rỗng vô nghĩa. */
function docGhiChu(v: unknown): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const t = String(v);
  if (t.length > 20000) throw new AppError('note qua dai (max 20000 ky tu)', 400);
  return t.trim() === '' ? null : t;
}

function serializeCelebration(c: {
  celebratedDate: string; expAwarded: number;
  tasksDone: number; tasksTotal: number; createdAt: Date;
}) {
  return {
    celebratedDate: c.celebratedDate,
    expAwarded: c.expAwarded,
    tasksDone: c.tasksDone,
    tasksTotal: c.tasksTotal,
    createdAt: c.createdAt.toISOString(),
  };
}

export default router;
