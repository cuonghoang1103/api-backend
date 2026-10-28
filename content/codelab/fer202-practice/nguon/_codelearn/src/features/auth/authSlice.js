//@from F2
// src/features/auth/authSlice.js — đăng nhập / đăng ký trên bảng users của json-server + phiên trong localStorage
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import { todayISO } from '../../utils/format';

export const STORAGE_KEY = 'codelearn_user';

// Đọc phiên cũ MỘT lần khi tạo store. Dữ liệu hỏng/không có ⇒ null (không làm sập app).
function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Không bao giờ giữ mật khẩu trong Redux hay localStorage
const withoutPassword = ({ password, ...user }) => user;

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  const users = await authApi.findByEmail(email.trim().toLowerCase());
  const user = users.find((u) => u.password === password);
  // cùng một thông điệp cho "sai email" và "sai mật khẩu" — không tiết lộ email nào đã có tài khoản
  if (!user) return rejectWithValue('Invalid email or password');
  if (user.active === false) return rejectWithValue('Your account has been locked. Please contact the admin.');
  return withoutPassword(user);
});

export const register = createAsyncThunk('auth/register', async ({ fullName, email, password }, { rejectWithValue }) => {
  const mail = email.trim().toLowerCase();
  const existing = await authApi.findByEmail(mail);
  if (existing.length > 0) return rejectWithValue('Email is already registered');
  // vai trò do HỆ THỐNG đặt (student) — không bao giờ lấy từ form
  const user = await authApi.create({ fullName: fullName.trim(), email: mail, password, role: 'student', active: true, createdAt: todayISO() });
  return withoutPassword(user);
});

const initialState = { user: loadUser(), status: 'idle', error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = 'loading';
      state.error = null;
    };
    const fulfilled = (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
    };
    const rejected = (state, action) => {
      state.status = 'failed';
      // payload = thông điệp từ rejectWithValue; không có ⇒ lỗi mạng / json-server chưa chạy
      state.error = action.payload ?? 'Cannot reach the server. Is json-server running on port 9999?';
    };
    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilled)
      .addCase(login.rejected, rejected)
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, fulfilled)
      .addCase(register.rejected, rejected);
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';

export default authSlice.reducer;
