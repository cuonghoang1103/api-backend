//@from F7
// src/features/quiz/quizSlice.js — làm quiz cuối chương: tải câu hỏi, giữ câu trả lời, chấm + lưu kết quả
//#F8
//   + lịch sử làm bài của học viên (trang My Progress)
//#end
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import quizApi from '../../api/quizApi';
import { logout } from '../auth/authSlice';
import { scoreQuiz } from '../../utils/learning';

export const fetchQuiz = createAsyncThunk('quiz/fetch', async (chapterId, { rejectWithValue }) => {
  try {
    const [chapter, questions] = await Promise.all([quizApi.getChapter(chapterId), quizApi.getQuestions(chapterId)]);
    return { chapter, questions };
  } catch (err) {
    if (err.response?.status === 404) return rejectWithValue('notFound');
    throw err;
  }
});

// chấm ở client (json-server không chấm được), rồi LƯU kết quả — chỉ hiện điểm khi đã lưu xong
export const submitQuiz = createAsyncThunk('quiz/submit', async ({ userId }, { getState }) => {
  const { chapter, questions, answers } = getState().quiz;
  const { score, total, percent, passed } = scoreQuiz(questions, answers);
  return quizApi.saveResult({
    userId,
    courseId: chapter.courseId,
    chapterId: chapter.id,
    score,
    total,
    percent,
    passed,
    answers: questions.map((q) => answers[q.id]),
    submittedAt: new Date().toISOString(),
  });
});
//#F8

export const fetchMyResults = createAsyncThunk('quiz/fetchMyResults', (userId) => quizApi.getResultsByUser(userId));
//#end

const initialState = {
  chapter: null,
  questions: [],
  answers: {},          // { [questionId]: optionIndex }
  result: null,         // bản ghi results vừa lưu
  status: 'idle',
  error: null,
  submitStatus: 'idle',
//#F8
  history: [],
  historyStatus: 'idle',
//#end
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    answerSelected(state, action) {
      if (state.result) return;                    // đã nộp ⇒ khoá câu trả lời
      const { questionId, optionIndex } = action.payload;
      state.answers[questionId] = optionIndex;
    },
    retakeQuiz(state) {
      state.answers = {};
      state.result = null;
      state.submitStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        // làm bài mới ⇒ bỏ câu trả lời / điểm của chương trước
        Object.assign(state, { chapter: null, questions: [], answers: {}, result: null, status: 'loading', error: null, submitStatus: 'idle' });
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chapter = action.payload.chapter;
        state.questions = action.payload.questions;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      })
      .addCase(submitQuiz.pending, (state) => {
        state.submitStatus = 'loading';
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.result = action.payload;
      })
      .addCase(submitQuiz.rejected, (state) => {
        state.submitStatus = 'failed';
      })
//#F8
      .addCase(fetchMyResults.pending, (state) => {
        state.historyStatus = 'loading';
      })
      .addCase(fetchMyResults.fulfilled, (state, action) => {
        state.historyStatus = 'succeeded';
        state.history = action.payload;
      })
      .addCase(fetchMyResults.rejected, (state) => {
        state.historyStatus = 'failed';
      })
//#end
      .addCase(logout, () => initialState);
  },
});

export const { answerSelected, retakeQuiz } = quizSlice.actions;
export default quizSlice.reducer;
