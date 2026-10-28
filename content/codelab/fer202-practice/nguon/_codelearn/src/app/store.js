// src/app/store.js — store Redux duy nhất của app: mỗi "feature" một slice
import { configureStore } from '@reduxjs/toolkit';
//#F2
import authReducer, { STORAGE_KEY } from '../features/auth/authSlice';
//#end
//#F3
import coursesReducer from '../features/courses/coursesSlice';
//#end
//#F5
import enrollmentsReducer from '../features/enrollments/enrollmentsSlice';
//#end
//#F7
import quizReducer from '../features/quiz/quizSlice';
//#end

export const store = configureStore({
  reducer: {
//#<F2
    // reducer giữ chỗ — F2 thay bằng auth, các F sau thêm courses / enrollments / quiz
    app: (state = { name: 'CodeLearn' }) => state,
//#end
//#F2
    auth: authReducer,
//#end
//#F3
    courses: coursesReducer,
//#end
//#F5
    enrollments: enrollmentsReducer,
//#end
//#F7
    quiz: quizReducer,
//#end
  },
});
//#F2

// Lưu phiên đăng nhập NGOÀI reducer (reducer phải thuần — không đụng localStorage).
// Chỉ ghi khi user thật sự đổi (đăng nhập / đăng ký / đăng xuất), không ghi lại ở mọi action.
let lastUser = store.getState().auth.user;
store.subscribe(() => {
  const { user } = store.getState().auth;
  if (user === lastUser) return;
  lastUser = user;
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
});
//#end

export default store;
