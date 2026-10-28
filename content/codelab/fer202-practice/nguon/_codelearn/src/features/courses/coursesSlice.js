//@from F3
// src/features/courses/coursesSlice.js — danh mục khoá học (catalog)
//#F4
//   + chi tiết một khoá (detail)
//#end
//#F9
//   + khu quản trị (admin: mọi khoá, kể cả bản nháp)
//#end
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import courseApi from '../../api/courseApi';
//#F9
import enrollApi from '../../api/enrollApi';
import quizApi from '../../api/quizApi';
//#end

// Danh sách công khai + danh mục: tải SONG SONG (Promise.all), một trạng thái tải chung
export const fetchCatalog = createAsyncThunk('courses/fetchCatalog', async () => {
  const [courses, categories] = await Promise.all([courseApi.getPublishedCourses(), courseApi.getCategories()]);
  return { courses, categories };
});
//#F4

const byOrder = (a, b) => a.order - b.order;

export const fetchCourseDetail = createAsyncThunk('courses/fetchDetail', async (id, { getState, rejectWithValue }) => {
  try {
    const [course, chapters, categories] = await Promise.all([
      courseApi.getCourse(id),
      courseApi.getCurriculum(id),
      courseApi.getCategories(),
    ]);
    // bản nháp: chỉ admin xem được — người khác coi như không tồn tại
    if (!course.published && getState().auth.user?.role !== 'admin') return rejectWithValue('notFound');
    return {
      course,
      categoryName: categories.find((c) => c.id === course.categoryId)?.name ?? 'Uncategorized',
      // _embed KHÔNG sắp bài học bên trong ⇒ tự sắp theo order (trên bản sao)
      chapters: chapters.slice().sort(byOrder).map((ch) => ({ ...ch, lessons: (ch.lessons ?? []).slice().sort(byOrder) })),
    };
  } catch (err) {
    if (err.response?.status === 404) return rejectWithValue('notFound');
    throw err;
  }
});
//#end
//#F9

// ── admin ──
export const fetchAdminCourses = createAsyncThunk('courses/fetchAdmin', async () => {
  const [courses, categories, enrollments] = await Promise.all([courseApi.getAllCourses(), courseApi.getCategories(), enrollApi.getAll()]);
  const students = {};
  enrollments.forEach((e) => {
    students[e.courseId] = (students[e.courseId] ?? 0) + 1;
  });
  return { courses, categories, students };
});

export const createCourse = createAsyncThunk('courses/create', (course) => courseApi.createCourse(course));

export const updateCourse = createAsyncThunk('courses/update', ({ id, ...changes }) => courseApi.updateCourse(id, changes));

// Luật nghiệp vụ: khoá ĐÃ có học viên thì không xoá (mất tiến độ của họ) — chỉ được ẩn (Draft).
export const deleteCourse = createAsyncThunk('courses/delete', async (course, { rejectWithValue }) => {
  const enrolled = (await enrollApi.getByCourse(course.id)).length;
  if (enrolled > 0) {
    return rejectWithValue(`Cannot delete "${course.title}": ${enrolled} ${enrolled === 1 ? 'student is' : 'students are'} enrolled. Unpublish it instead.`);
  }
  // xoá con trước, khoá sau (json-server 0.17 tự dọn bản ghi con, nhưng đừng dựa vào điều đó)
  const [chapters, lessons, questions] = await Promise.all([
    courseApi.getByCourse('chapters', course.id),
    courseApi.getByCourse('lessons', course.id),
    quizApi.getByCourse(course.id),
  ]);
  await courseApi.deleteMany('lessons', lessons.map((l) => l.id));
  await courseApi.deleteMany('questions', questions.map((q) => q.id));
  await courseApi.deleteMany('chapters', chapters.map((c) => c.id));
  await courseApi.deleteCourse(course.id);
  return course.id;
});
//#end

const initialState = {
  items: [],          // khoá đã xuất bản (trang /courses)
  categories: [],
  status: 'idle',     // idle | loading | succeeded | failed
  error: null,
//#F4
  detail: { course: null, categoryName: '', chapters: [], status: 'idle', error: null },
//#end
//#F9
  admin: { items: [], students: {}, status: 'idle', error: null },
//#end
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.courses;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
//#F4
      .addCase(fetchCourseDetail.pending, (state) => {
        // xoá khoá cũ ⇒ không "nháy" khoá trước trong lúc tải khoá mới
        state.detail = { ...initialState.detail, status: 'loading' };
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action) => {
        state.detail = { ...action.payload, status: 'succeeded', error: null };
      })
      .addCase(fetchCourseDetail.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error = action.payload ?? action.error.message;
      })
//#end
//#F9
      .addCase(fetchAdminCourses.pending, (state) => {
        state.admin.status = 'loading';
        state.admin.error = null;
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.admin.status = 'succeeded';
        state.admin.items = action.payload.courses;
        state.admin.students = action.payload.students;
        state.categories = action.payload.categories;
      })
      .addCase(fetchAdminCourses.rejected, (state, action) => {
        state.admin.status = 'failed';
        state.admin.error = action.error.message;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.admin.items.push(action.payload);
        state.status = 'idle';   // danh mục công khai đã cũ ⇒ /courses tải lại lần tới
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const i = state.admin.items.findIndex((c) => c.id === action.payload.id);
        if (i >= 0) state.admin.items[i] = action.payload;
        state.status = 'idle';
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.admin.items = state.admin.items.filter((c) => c.id !== action.payload);
        state.status = 'idle';
      })
//#end
      ;
  },
});

export default coursesSlice.reducer;
