import { Router, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { saveUserCode } from './savedCodes.routes.js';
import { llmComplete, checkTokenQuota, isAiAvailable, aiOffReason } from '../services/interview/llm/index.js';
import { ADVISOR_SPECS, ADVISOR_SUGGESTED_QUESTIONS, MARKET_REPORTS, type AdvisorSpec } from '../data/academyAdvisor.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.get('/semesters', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const semesters = await prisma.semester.findMany({
      where: { isActive: true },
      orderBy: [{ ordinal: 'asc' }, { id: 'asc' }],
    });
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json({ success: true, data: semesters });
  } catch (error) {
    next(error);
  }
});

router.post('/semesters', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const code = String(req.body.code || '').trim();
    const ordinal = Number(req.body.ordinal ?? 0);
    if (!name || !code) throw new AppError('name and code are required', 400);

    // Reject early with a friendly 409 instead of a Prisma P2002
    // stack trace, so the admin can fix the form (or pick a different
    // code) without having to dig into the server log.
    const duplicate = await prisma.semester.findFirst({ where: { code } });
    if (duplicate) {
      throw new AppError(`Mã kỳ học "${code}" đã tồn tại (đang dùng cho "${duplicate.name}"). Vui lòng chọn mã khác.`, 409);
    }

    const created = await prisma.semester.create({
      data: {
        name,
        code,
        ordinal,
        description: req.body.description ? String(req.body.description) : null,
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
      },
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.put('/semesters/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    // If the admin is changing the code, make sure it doesn't collide
    // with another semester. The Prisma `@@unique` constraint on
    // `code` would otherwise throw P2002 ("Unique constraint failed")
    // and the user would see a raw 500 in the toast. Translating it
    // to a 409 with a Vietnamese message here turns a confusing
    // stack trace into actionable feedback.
    if (req.body.code !== undefined) {
      const nextCode = String(req.body.code).trim();
      if (nextCode) {
        const duplicate = await prisma.semester.findFirst({
          where: { code: nextCode, NOT: { id } },
        });
        if (duplicate) {
          throw new AppError(
            `Mã kỳ học "${nextCode}" đã tồn tại (đang dùng cho "${duplicate.name}"). Vui lòng chọn mã khác.`,
            409
          );
        }
      }
    }

    const updated = await prisma.semester.update({
      where: { id },
      data: {
        ...(req.body.name !== undefined ? { name: String(req.body.name).trim() } : {}),
        ...(req.body.code !== undefined ? { code: String(req.body.code).trim() } : {}),
        ...(req.body.ordinal !== undefined ? { ordinal: Number(req.body.ordinal) } : {}),
        ...(req.body.description !== undefined ? { description: req.body.description ? String(req.body.description) : null } : {}),
        ...(req.body.isActive !== undefined ? { isActive: Boolean(req.body.isActive) } : {}),
      },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    // Last-resort translation: Prisma P2002 → friendly 409 in case a
    // race condition slips through (two admins editing at the same
    // time, etc.).
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      next(new AppError('Mã kỳ học đã tồn tại. Vui lòng chọn mã khác.', 409));
      return;
    }
    next(error);
  }
});

router.delete('/semesters/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.semester.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

router.get('/courses/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        semester: true,
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              include: {
                details: true,
                documents: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
                assignments: { orderBy: { sortOrder: 'asc' } },
              },
            },
          },
        },
      },
    });

    if (!course) throw new AppError('Course not found', 404);

    res.json({
      success: true,
      data: {
        ...course,
        sections: course.sections.map((section) => ({
          ...section,
          lessons: section.lessons.map((lesson) => ({
            ...lesson,
            videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
            sourceCodeUrl: lesson.details?.sourceCodeUrl,
            teachingNotes: lesson.details?.teachingNotes,
            documents: lesson.documents.map((document) => ({
              ...document,
              fileSizeBytes: Number(document.fileSizeBytes),
            })),
          })),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/assignments/:assignmentId/submissions', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId, 10);
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId },
      orderBy: [{ submittedAt: 'desc' }],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
});

router.post('/assignments/grade', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const submissionId = Number(req.body.submissionId);
    if (!submissionId) throw new AppError('submissionId is required', 400);

    const existingSubmission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      select: { id: true },
    });

    if (!existingSubmission) {
      throw new AppError('Submission not found', 404);
    }

    if (req.body.grade !== undefined && (Number.isNaN(Number(req.body.grade)) || !Number.isFinite(Number(req.body.grade)))) {
      throw new AppError('grade must be a valid number', 400);
    }

    const updated = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        ...(req.body.grade !== undefined ? { grade: Number(req.body.grade) } : {}),
        ...(req.body.feedback !== undefined ? { feedback: req.body.feedback ? String(req.body.feedback) : null } : {}),
        ...(req.body.status !== undefined ? { status: String(req.body.status) } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// ─── Code Academy (Course Code Management) ────────────────────────────────────

// GET /api/v1/academy/codes — list all course codes (admin)
router.get('/codes', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { courseId } = req.query;
    const where: Record<string, unknown> = {};
    if (courseId) where.courseId = Number(courseId);

    const codes = await prisma.courseCode.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: codes });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/academy/codes — create a new course code (admin)
router.post('/codes', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = Number(req.body.courseId);
    if (!courseId || Number.isNaN(courseId)) {
      throw new AppError('courseId is required', 400);
    }
    const code = String(req.body.code || '').trim().toUpperCase();
    if (!code || code.length < 4 || code.length > 10) {
      throw new AppError('Code must be 4-10 uppercase characters', 400);
    }
    const maxUses = Number(req.body.maxUses ?? 1);
    if (Number.isNaN(maxUses) || maxUses < 1) {
      throw new AppError('maxUses must be at least 1', 400);
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    // Check duplicate
    const existing = await prisma.courseCode.findFirst({
      where: { courseId, code },
    });
    if (existing) {
      throw new AppError(`Mã "${code}" đã tồn tại cho khóa học này.`, 409);
    }

    const created = await prisma.courseCode.create({
      data: {
        code,
        courseId,
        maxUses,
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      next(new AppError('Mã code đã tồn tại. Vui lòng chọn mã khác.', 409));
      return;
    }
    next(error);
  }
});

// PUT /api/v1/academy/codes/:id — update a course code (admin)
router.put('/codes/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid code id', 400);

    const existing = await prisma.courseCode.findUnique({ where: { id } });
    if (!existing) throw new AppError('Code not found', 404);

    // If changing code, check uniqueness
    if (req.body.code !== undefined) {
      const nextCode = String(req.body.code).trim().toUpperCase();
      if (nextCode && (nextCode.length < 4 || nextCode.length > 10)) {
        throw new AppError('Code must be 4-10 uppercase characters', 400);
      }
      if (nextCode && nextCode !== existing.code) {
        const dup = await prisma.courseCode.findFirst({
          where: { courseId: existing.courseId, code: nextCode, NOT: { id } },
        });
        if (dup) throw new AppError(`Mã "${nextCode}" đã tồn tại cho khóa học này.`, 409);
      }
    }

    const updated = await prisma.courseCode.update({
      where: { id },
      data: {
        ...(req.body.code !== undefined ? { code: String(req.body.code).trim().toUpperCase() } : {}),
        ...(req.body.maxUses !== undefined ? { maxUses: Number(req.body.maxUses) } : {}),
        ...(req.body.isActive !== undefined ? { isActive: Boolean(req.body.isActive) } : {}),
        ...(req.body.expiresAt !== undefined ? { expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt as string) : null } : {}),
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      next(new AppError('Mã code đã tồn tại. Vui lòng chọn mã khác.', 409));
      return;
    }
    next(error);
  }
});

// DELETE /api/v1/academy/codes/:id — delete a course code (admin)
router.delete('/codes/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid code id', 400);
    await prisma.courseCode.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/academy/activate-code — activate a course code (user)
router.post('/activate-code', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const courseId = Number(req.body.courseId);
    const code = String(req.body.code || '').trim().toUpperCase();

    if (!courseId || Number.isNaN(courseId)) {
      throw new AppError('courseId is required', 400);
    }
    if (!code || code.length < 4 || code.length > 10) {
      throw new AppError('Mã kích hoạt không hợp lệ', 400);
    }

    // Check course exists and accepts activation codes.
    // CODE = code-only courses (legacy). PAID = "Trả phí or Mã kích hoạt" (accepts both).
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, accessType: true, isPublished: true },
    });
    if (!course) throw new AppError('Course not found', 404);
    if (!course.isPublished) throw new AppError('Khoa hoc chua duoc xuat ban', 400);
    if (course.accessType !== 'CODE' && course.accessType !== 'PAID') {
      throw new AppError('Khoa hoc nay khong chap nhan ma kich hoat', 400);
    }

    // Find the code
    const courseCode = await prisma.courseCode.findFirst({
      where: { courseId, code },
      include: { course: { select: { title: true } } },
    });
    if (!courseCode) throw new AppError('Ma kich hoat khong ton tai', 404);
    if (!courseCode.isActive) throw new AppError('Ma kich hoat da bi khoa', 403);
    if (courseCode.expiresAt && courseCode.expiresAt.getTime() < Date.now()) {
      throw new AppError('Ma kich hoat da het han', 403);
    }
    if (courseCode.usedCount >= courseCode.maxUses) {
      throw new AppError('Ma kich hoat da het luot su dung', 403);
    }

    // Check if user already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existingEnrollment) {
      // If upgrading from FREE/PAID enrollment to CODE, update the source
      if (existingEnrollment.source !== 'CODE') {
        await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { source: 'CODE', courseCodeId: courseCode.id },
        });
        await prisma.courseCode.update({
          where: { id: courseCode.id },
          data: { usedCount: { increment: 1 } },
        });
        await saveUserCode(userId, {
          label: `Mã kích hoạt: ${course.title}`,
          code,
          codeType: 'COURSE',
          note: 'Mã vào học khoá này',
          expiresAt: courseCode.expiresAt,
          source: 'AUTO',
        });
        res.json({
          success: true,
          data: { message: 'Kich hoat thanh cong! Ban co the bat dau hoc ngay.', courseId },
        });
      } else {
        res.json({
          success: true,
          data: { message: 'Khoa hoc da duoc kich hoat roi.', courseId },
        });
      }
      return;
    }

    // Create enrollment + increment usedCount in a transaction
    await prisma.$transaction([
      prisma.courseCode.update({
        where: { id: courseCode.id },
        data: { usedCount: { increment: 1 } },
      }),
      prisma.enrollment.create({
        data: {
          userId,
          courseId,
          source: 'CODE',
          courseCodeId: courseCode.id,
          status: 'ACTIVE',
        },
      }),
    ]);

    // Auto-save the activation code into the user's "My Code" wallet so
    // they don't have to remember it for the next study session.
    await saveUserCode(userId, {
      label: `Mã kích hoạt: ${course.title}`,
      code,
      codeType: 'COURSE',
      note: 'Mã vào học khoá này',
      expiresAt: courseCode.expiresAt,
      source: 'AUTO',
    });

    res.json({
      success: true,
      data: { message: 'Kich hoat thanh cong! Ban co the bat dau hoc ngay.', courseId },
    });
  } catch (error) {
    next(error);
  }
});

/* ─── Phòng tư vấn chọn ngành hẹp (AI) ─────────────────────────────────────
 * `GET /advisor/catalog` (công khai): dữ liệu ngành để vẽ thẻ so sánh + biểu đồ
 * + câu hỏi gợi ý sẵn. `POST /advisor` (đăng nhập + quota): chat AI, NEO cứng vào
 * ADVISOR_SPECS để không bịa số liệu; số chính xác thì trỏ người dùng tới báo cáo. */

router.get('/advisor/catalog', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=1200');
    res.json({ success: true, data: { specs: ADVISOR_SPECS, questions: ADVISOR_SUGGESTED_QUESTIONS, reports: MARKET_REPORTS } });
  } catch (error) {
    next(error);
  }
});

function fmtAdvisorSpec(s: AdvisorSpec): string {
  return [
    `### ${s.nameVi}  [key: ${s.key}]`,
    `- Ngôn ngữ/công nghệ: ${s.languages.join(', ')}`,
    `- Làm ra được: ${s.builds.join('; ')}`,
    `- Sản phẩm/công ty THẬT: ${s.products.join('; ')}`,
    `- Ưu điểm: ${s.pros.join('; ')}`,
    `- Nhược điểm: ${s.cons.join('; ')}`,
    `- Độ khó ${s.difficulty}/5 · Nhu cầu tuyển VN ${s.demand}/5 · Lương ${s.salary}/5 (${s.salaryRange})`,
    `- Môn Academy tiêu biểu: ${s.academyCourses.join(', ')}`,
  ].join('\n');
}

function buildAdvisorSystem(
  specs: AdvisorSpec[], semester: number, completed: string[],
  facultyName: string, majorName: string,
): string {
  const ctx: string[] = [];
  if (facultyName) ctx.push(`Sinh viên thuộc khối "${facultyName}"${majorName ? `, ngành "${majorName}"` : ''}.`);
  if (semester > 0) ctx.push(`Sinh viên đang học KỲ ${semester}.`);
  if (completed.length) ctx.push(`Các môn Academy sinh viên ĐÃ HỌC (mã): ${completed.join(', ')}.`);
  // Khối chưa có dữ liệu ngành hẹp curated (v1 mới phủ khối CNTT): tư vấn TỔNG
  // QUÁT & trung thực, không bịa và không lấy dữ liệu ngành IT áp cho khối khác.
  const groundBlock = specs.length
    ? 'DỮ LIỆU NGÀNH HẸP (nguồn neo — CHỈ được dựa vào đây, KHÔNG bịa số):\n' + specs.map(fmtAdvisorSpec).join('\n\n')
    : 'LƯU Ý: Academy CHƯA có dữ liệu chi tiết (lương/nhu cầu/sản phẩm) cho các ngành hẹp của khối này — dữ liệu chi tiết hiện tập trung ở khối Công nghệ thông tin. Hãy nói THẲNG điều đó, tư vấn TỔNG QUÁT dựa trên hiểu biết chung, KHÔNG bịa con số cụ thể, và khuyên sinh viên xem báo cáo thị trường + hỏi thầy cô/khoa để có số chính xác.';
  return [
    'Bạn là CỐ VẤN HƯỚNG NGHIỆP chuyên nghiệp của FPT University Academy, tư vấn sinh viên CHỌN NGÀNH HẸP (chuyên ngành). Trả lời bằng TIẾNG VIỆT, thân thiện, thẳng thắn, NGẮN GỌN và có cấu trúc (markdown, gạch đầu dòng, in đậm ý chính).',
    '',
    'TUYỆT ĐỐI KHÔNG bịa thêm con số lương/tuyển dụng. Khi người dùng cần số CHÍNH XÁC, hãy nói mức định tính rồi khuyên họ xem báo cáo (TopDev/ITviec/VietnamWorks).',
    '',
    groundBlock,
    '',
    ctx.length ? 'NGỮ CẢNH SINH VIÊN:\n' + ctx.join('\n') : 'Chưa biết sinh viên học kỳ mấy — nếu cần thì hỏi lại.',
    '',
    'NGUYÊN TẮC TƯ VẤN:',
    '- Nếu sinh viên chưa biết điểm mạnh của mình: gợi ý vài câu hỏi tự vấn (thích logic/toán/sáng tạo/thiết kế? thích làm sản phẩm nhìn thấy hay hệ thống ẩn?) để họ tự nhận ra.',
    '- Khi biết môn đã học: NÓI RÕ môn nào tận dụng được sang ngành hẹp đang bàn (ví dụ đã học Java/PRO192 → nền OOP dùng tiếp cho .NET/C#, cho Android; đã học C/PRF192 → tư duy con trỏ/bộ nhớ dùng cho nhúng, game). Nêu ngành hẹp code bằng NGÔN NGỮ gì và sẽ học thêm MÔN Academy nào (dùng mã môn ở trên).',
    '- So sánh khách quan: ưu/nhược, độ khó, nhu cầu, lương (định tính), tương lai lâu dài. Nêu sản phẩm/công ty thật để minh hoạ ngành hẹp làm ra được gì.',
    '- Không phán "ngành này tốt nhất" tuyệt đối — gợi ý theo sở thích & thế mạnh của CHÍNH sinh viên, và khuyến khích họ tự quyết.',
    '- Cuối câu trả lời, nếu hợp lý, gợi ý 2–3 câu hỏi tiếp theo sinh viên có thể hỏi.',
    '- Độ dài vừa phải (không lan man). Chỉ chèn khối code khi thật sự giúp so sánh cú pháp.',
  ].join('\n');
}

const ADVISOR_MAX_HISTORY = 8;
router.post('/advisor', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    if (!isAiAvailable()) throw new AppError(aiOffReason() || 'AI đang tạm nghỉ, thử lại sau nhé.', 503);
    const question = String(req.body?.question || '').trim();
    if (!question) throw new AppError('Thiếu câu hỏi.', 400);
    if (question.length > 2000) throw new AppError('Câu hỏi quá dài (tối đa 2000 ký tự).', 400);
    await checkTokenQuota(req.userId);

    const facultyId = String(req.body?.facultyId || '').trim();
    const majorId = String(req.body?.majorId || '').trim();
    const semester = Math.max(0, Math.min(9, Number(req.body?.semester) || 0));
    const completed: string[] = Array.isArray(req.body?.completedCourses)
      ? req.body.completedCourses.map((c: unknown) => String(c).trim().toUpperCase()).filter(Boolean).slice(0, 80)
      : [];
    const history: { role: 'user' | 'assistant'; content: string }[] = Array.isArray(req.body?.history)
      ? req.body.history
          .filter((m: { role?: string; content?: unknown }) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .map((m: { role: 'user' | 'assistant'; content: string }) => ({ role: m.role, content: String(m.content).slice(0, 4000) }))
          .slice(-ADVISOR_MAX_HISTORY)
      : [];

    // Neo vào các ngành hẹp ĐÚNG khối đã chọn. KHÔNG lấy dữ liệu khối khác làm nền
    // cho một khối chưa có dữ liệu (tránh đổ nhầm ngành IT cho SV Kinh doanh).
    const specs = facultyId
      ? ADVISOR_SPECS.filter((s) => s.facultyId === facultyId && (!majorId || s.majorId === majorId))
      : ADVISOR_SPECS;
    const facultyName = String(req.body?.facultyName || '').trim().slice(0, 80);
    const majorName = String(req.body?.majorName || '').trim().slice(0, 80);

    const system = buildAdvisorSystem(specs, semester, completed, facultyName, majorName);
    const messages = [...history, { role: 'user' as const, content: question }];
    const result = await llmComplete({
      step: 'generation',
      feature: 'chat',
      purpose: 'academy_advisor',
      system,
      messages,
      maxTokens: 1800,
      maxRetries: 2,
      timeoutMs: 120_000,
      userId: req.userId,
    });
    const answer = ((result.text || '').trim()
      + (result.biCat ? '\n\n> ⚠️ *Trả lời hơi dài nên bị cắt. Hỏi tiếp “nói tiếp” để nghe nốt.*' : '')).trim();
    if (!answer) throw new AppError('AI chưa trả lời được. Thử lại nhé.', 502);
    res.json({ success: true, data: { answer } });
  } catch (error) {
    next(error);
  }
});

export default router;
