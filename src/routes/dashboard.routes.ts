import { Router, type Response, type Request } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
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
    const today = todayIso();

    /* Ngày theo giờ MÁY của client. App mới gửi kèm; app cũ không gửi thì lùi
       về ngày UTC — chấp nhận lệch vài giờ còn hơn không sinh việc lặp gì cả. */
    const hn = String((req.query.homNay ?? '') as string);
    await sinhViecLap(userId, /^\d{4}-\d{2}-\d{2}$/.test(hn) ? hn : today);

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

    if (Object.keys(data).length === 0) {
      throw new AppError('Khong co truong hop le de cap nhat', 400);
    }

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

    const task = await prisma.dashboardTask.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError('Task khong ton tai', 404);

    res.json({ success: true, data: serializeTask(task) });
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
    res.json({ success: true, data: { tasks: viec.map(serializeTask) } });
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
    const today = todayIso();

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

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().slice(0, 10);

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
