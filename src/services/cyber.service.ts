import { prisma } from '../config/database.js';

const DAILY_EXP_CAP = 500;
const COMPLETION_COOLDOWN_MS = 2000;

function calcRequiredExp(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(userId: number) {
  let profile = await prisma.cyberProfile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.cyberProfile.create({
      data: { userId, level: 1, currentExp: 0, totalPoints: 0 },
    });
  }
  const requiredExp = calcRequiredExp(profile.level);
  return { ...profile, requiredExp };
}

export async function upsertInventory(userId: number) {
  return prisma.cyberInventory.upsert({
    where: { userId },
    update: {},
    create: { userId, pointBalance: 0 },
  });
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export async function getTasks(userId: number, dateStr: string) {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return prisma.cyberTask.findMany({
    where: { userId, date },
    orderBy: { startTime: 'asc' },
  });
}

export async function createTask(
  userId: number,
  data: {
    title: string;
    description?: string;
    type: string;
    startTime: string;
    endTime: string;
    expReward: number;
    date: string;
  }
) {
  const taskDate = new Date(data.date);
  taskDate.setHours(0, 0, 0, 0);

  const overlapping = await prisma.cyberTask.findFirst({
    where: {
      userId,
      date: taskDate,
      startTime: { lt: data.endTime },
      endTime: { gt: data.startTime },
    },
  });

  if (overlapping) {
    const err: any = new Error('Time slot conflict: another task occupies this time range.');
    err.statusCode = 409;
    throw err;
  }

  return prisma.cyberTask.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      type: data.type as 'TASK' | 'STUDY' | 'ROUTINE',
      startTime: data.startTime,
      endTime: data.endTime,
      expReward: data.expReward,
      date: taskDate,
    },
  });
}

export async function toggleTask(userId: number, taskId: number) {
  const task = await prisma.cyberTask.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    const err: any = new Error('Task not found.');
    err.statusCode = 404;
    throw err;
  }

  if (task.isCompleted) {
    // Uncheck — remove EXP (do not go below 0)
    const profile = await getProfile(userId);
    const expToRemove = Math.min(task.expReward, profile.currentExp);
    await prisma.cyberProfile.update({
      where: { userId },
      data: { currentExp: { decrement: expToRemove } },
    });
    const updated = await prisma.cyberTask.update({
      where: { id: taskId },
      data: { isCompleted: false },
    });
    const newProfile = await getProfile(userId);
    return { task: updated, profile: newProfile, leveledUp: false, expGranted: 0 };
  }

  // ── Check anti-cheat ────────────────────────────────────────────────────────
  const now = Date.now();
  const recentCompletions = await prisma.cyberTask.findFirst({
    where: {
      userId,
      isCompleted: true,
      updatedAt: { gte: new Date(now - COMPLETION_COOLDOWN_MS * 3) },
    },
    orderBy: { updatedAt: 'desc' },
  });

  if (recentCompletions) {
    const elapsed = now - recentCompletions.updatedAt.getTime();
    if (elapsed < COMPLETION_COOLDOWN_MS) {
      const err: any = new Error('Anti-cheat alert: rate limit exceeded. Please wait.');
      err.statusCode = 429;
      throw err;
    }
  }

  // ── Daily EXP cap check ─────────────────────────────────────────────────────
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const todayCompleted = await prisma.cyberTask.findMany({
    where: {
      userId,
      isCompleted: true,
      updatedAt: { gte: dayStart },
      id: { not: taskId },
    },
  });

  let earnedToday = 0;
  for (const t of todayCompleted) {
    earnedToday += t.expReward;
  }

  const capped = earnedToday >= DAILY_EXP_CAP;
  const expGranted = capped ? 0 : task.expReward;

  // ── Atomic update ────────────────────────────────────────────────────────────
  await prisma.cyberTask.update({
    where: { id: taskId },
    data: { isCompleted: true },
  });

  const profile = await getProfile(userId);
  const newExp = profile.currentExp + expGranted;
  let newLevel = profile.level;
  let leveledUp = false;

  // Level-up loop
  let exp = newExp;
  while (exp >= calcRequiredExp(newLevel)) {
    exp -= calcRequiredExp(newLevel);
    newLevel++;
    leveledUp = true;
  }

  const updatedProfile = await prisma.cyberProfile.update({
    where: { userId },
    data: {
      currentExp: leveledUp ? exp : newExp,
      level: newLevel,
    },
  });

  const finalProfile = {
    ...updatedProfile,
    requiredExp: calcRequiredExp(updatedProfile.level),
  };

  return {
    task: { ...task, isCompleted: true },
    profile: finalProfile,
    leveledUp,
    expGranted,
    dailyCapHit: capped,
  };
}

export async function deleteTask(userId: number, taskId: number) {
  const task = await prisma.cyberTask.findFirst({ where: { id: taskId, userId } });
  if (!task) {
    const err: any = new Error('Task not found.');
    err.statusCode = 404;
    throw err;
  }
  await prisma.cyberTask.delete({ where: { id: taskId } });
  return { success: true };
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export async function getInventory(userId: number) {
  let inv = await prisma.cyberInventory.findUnique({ where: { userId } });
  if (!inv) inv = await upsertInventory(userId);

  const coupons = await prisma.discountCode.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return { ...inv, coupons };
}

export async function mintCoupon(userId: number, discountAmount: number) {
  if (discountAmount <= 0 || discountAmount > 100) {
    const err: any = new Error('Discount amount must be between 1 and 100.');
    err.statusCode = 400;
    throw err;
  }

  const inv = await getInventory(userId);
  if (inv.pointBalance < discountAmount) {
    const err: any = new Error('Insufficient point balance.');
    err.statusCode = 400;
    throw err;
  }

  const code = `CYBER-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return prisma.$transaction(async (tx) => {
    await tx.cyberInventory.update({
      where: { userId },
      data: { pointBalance: { decrement: discountAmount } },
    });
    const coupon = await tx.discountCode.create({
      data: {
        code,
        userId,
        discountType: 'PERCENT',
        discountValue: discountAmount,
        maxUses: 1,
        expiresAt,
        description: 'Minted from Cyber Inventory',
      },
    });
    return coupon;
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics(userId: number, period: 'day' | 'month' | 'year') {
  const now = new Date();
  let startDate: Date;
  let groupBy: string;

  if (period === 'day') {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    groupBy = 'hour';
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    groupBy = 'day';
  } else {
    startDate = new Date(now.getFullYear(), 0, 1);
    groupBy = 'month';
  }

  const tasks = await prisma.cyberTask.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
  });

  // CPU = completion rate, RAM = study hours, NET = consistency
  const buckets: Record<string, { total: number; completed: number; studyMins: number; days: Set<string> }> = {};

  for (const task of tasks) {
    const key =
      groupBy === 'hour'
        ? task.startTime.split(':')[0].padStart(2, '0')
        : groupBy === 'day'
        ? task.date.toISOString().split('T')[0]
        : `${task.date.getFullYear()}-${String(task.date.getMonth() + 1).padStart(2, '0')}`;

    if (!buckets[key]) buckets[key] = { total: 0, completed: 0, studyMins: 0, days: new Set() };
    buckets[key].total++;
    if (task.isCompleted) buckets[key].completed++;
    buckets[key].days.add(task.date.toISOString().split('T')[0]);
    if (task.type === 'STUDY') {
      const [sh, sm] = task.startTime.split(':').map(Number);
      const [eh, em] = task.endTime.split(':').map(Number);
      buckets[key].studyMins += (eh * 60 + em) - (sh * 60 + sm);
    }
  }

  const labels = Object.keys(buckets).sort();
  const cpuLoad = labels.map((k) =>
    buckets[k].total > 0 ? Math.round((buckets[k].completed / buckets[k].total) * 100) : 0
  );
  const ramUsage = labels.map((k) => Math.round(buckets[k].studyMins / 60));
  const netLoad = labels.map((k) => Math.min(100, Math.round(buckets[k].days.size * (100 / (period === 'day' ? 1 : period === 'month' ? 30 : 365)))));

  const profile = await getProfile(userId);

  return {
    labels,
    cpuLoad,
    ramUsage,
    netLoad,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.isCompleted).length,
    totalExpEarned: profile.totalPoints,
    level: profile.level,
    currentExp: profile.currentExp,
  };
}
