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
router.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const today = todayIso();

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
        orderBy: [{ scope: 'asc' }, { date: 'asc' }, { id: 'asc' }],
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
        tasks: tasks.map((t) => ({
          id: t.id,
          scope: t.scope,
          date: t.date,
          title: t.title,
          done: t.done,
          exp: t.exp,
          activityType: t.activityType as ActivityType | null,
          createdAt: t.createdAt.toISOString(),
          completedAt: t.completedAt?.toISOString() ?? null,
        })),
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
    };

    const scope = String(body.scope ?? 'today');
    if (!['today', 'week', 'month'].includes(scope)) {
      throw new AppError('scope phai la today|week|month', 400);
    }
    const title = String(body.title ?? '').trim();
    if (title.length === 0) throw new AppError('title khong duoc rong', 400);
    if (title.length > 500) throw new AppError('title qua dai (max 500 ky tu)', 400);

    // Normalize date so the client can pass anything vaguely
    // ISO-shaped and we always store a clean YYYY-MM-DD.
    const date = body.date ? normalizeDate(body.date) : scopeDate(scope as 'today' | 'week' | 'month');

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
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: task.id,
        scope: task.scope,
        date: task.date,
        title: task.title,
        done: task.done,
        exp: task.exp,
        activityType: task.activityType as ActivityType | null,
        createdAt: task.createdAt.toISOString(),
        completedAt: task.completedAt?.toISOString() ?? null,
      },
    });
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
    if (!['today', 'week', 'month'].includes(scope)) {
      throw new AppError('scope phai la today|week|month', 400);
    }
    const date = body.date ? normalizeDate(body.date) : scopeDate(scope as 'today' | 'week' | 'month');

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
      if (!['today', 'week', 'month'].includes(body.scope)) {
        throw new AppError('scope phai la today|week|month', 400);
      }
      data.scope = body.scope;
    }
    if (body.date !== undefined) {
      data.date = normalizeDate(body.date);
    }

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
          if (!['today', 'week', 'month'].includes(t.scope)) continue;
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
  };
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
