/**
 * Phiên đăng nhập.
 *
 * Khôi phục lúc khởi động: đọc token đã mã hoá từ main → gọi `/auth/refresh` →
 * nhận `AuthResponse` đầy đủ (gồm cả hồ sơ người dùng). Không cần endpoint `/me`
 * riêng — `/auth/refresh` đã trả về mọi thứ cần thiết.
 *
 * Ba trạng thái khởi động, và phải phân biệt rạch ròi vì cách xử lý khác hẳn:
 *   • `dang-khoi-phuc` — chưa biết gì, đừng vẽ màn hình đăng nhập vội (nhấp
 *     nháy màn đăng nhập rồi nhảy vào app là trải nghiệm tệ nhất).
 *   • `chua-dang-nhap` — không có token, hoặc token đã chết.
 *   • `da-dang-nhap`   — có phiên hợp lệ.
 *
 * Trường hợp thứ tư dễ bị bỏ sót: có token nhưng MẤT MẠNG lúc khởi động. Lúc
 * đó KHÔNG được coi là đăng xuất — nếu không, mở app khi không có mạng sẽ đá
 * người dùng ra ngoài và xoá luôn đường vào dữ liệu ngoại tuyến của họ.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ApiClient, ApiError } from '../api/client';
import { countUnsynced } from '../offline/db';
import { noiSocket, ngatSocket } from '../realtime/socket';

export interface CurrentUser {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  roles: string[];
  role: string;
}

export type SessionPhase =
  | 'dang-khoi-phuc'
  | 'chua-dang-nhap'
  | 'da-dang-nhap'
  /** Có phiên đã lưu nhưng chưa xác minh được vì mất mạng. */
  | 'chua-xac-minh-duoc';

interface SessionContextValue {
  phase: SessionPhase;
  user: CurrentUser | null;
  userId: number | null;
  api: ApiClient | null;
  login: (username: string, password: string) => Promise<void>;
  /** Đăng nhập bằng token OAuth nhận qua cổng vòng 127.0.0.1. */
  dangNhapBangToken: (token: string) => Promise<void>;
  logout: (options?: { discardUnsynced?: boolean }) => Promise<void>;
  /** Số việc chưa gửi — để hỏi trước khi đăng xuất. */
  unsyncedCount: () => Promise<number>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/** Hình dạng `AuthResponse` của backend (src/types/index.ts). */
interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  roles: string[];
  role: string;
  roleVersion: number;
  token: string;
  /** Backend có trả, nhưng KHÔNG endpoint nào nhận lại — xem shared/ipc.ts. */
  refreshToken: string;
}

function toUser(response: AuthResponse): CurrentUser {
  return {
    userId: response.userId,
    username: response.username,
    email: response.email,
    ...(response.fullName === undefined ? {} : { fullName: response.fullName }),
    ...(response.avatarUrl === undefined ? {} : { avatarUrl: response.avatarUrl }),
    roles: response.roles,
    role: response.role,
  };
}

export function SessionProvider({
  apiOrigin,
  children,
}: {
  apiOrigin: string | null;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<SessionPhase>('dang-khoi-phuc');

  // ── Kết nối thời gian thực theo vòng đời phiên ───────────────
  //
  // MỘT chỗ duy nhất, thay vì rắc `noiSocket()` vào từng nhánh đăng nhập —
  // có bảy chỗ gọi `setPhase` trong file này và quên một chỗ nghĩa là người
  // dùng vào được app mà không có socket, hỏng câm.
  useEffect(() => {
    if (phase === 'da-dang-nhap' && apiRef.current && apiOrigin) {
      noiSocket(apiRef.current, apiOrigin);
    } else if (phase === 'chua-dang-nhap') {
      // Đăng xuất thì cắt hẳn: socket còn sống nghĩa là người vừa đăng xuất
      // vẫn nhận được tin nhắn và cuộc gọi của tài khoản đó.
      ngatSocket();
    }
  }, [phase, apiOrigin]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const apiRef = useRef<ApiClient | null>(null);

  // Tạo client MỘT lần cho mỗi gốc API. Tạo lại ở mỗi lần render sẽ mất token
  // đang giữ trong bộ nhớ và mất cả lời hứa làm mới đang chạy.
  if (apiOrigin !== null && apiRef.current === null) {
    apiRef.current = new ApiClient(apiOrigin, (session) => {
      // Client tự làm mới token → ghi lại xuống đĩa để lần mở sau dùng bản mới.
      if (session === null) {
        setUser(null);
        setPhase('chua-dang-nhap');
        void window.cuongthai?.auth.clearSession();
        return;
      }
      void window.cuongthai?.auth.storeSession({
        userId: session.userId,
        sessionToken: session.token,
      });
    });
  }

  const restore = useCallback(async () => {
    const bridge = window.cuongthai;
    const api = apiRef.current;
    if (!bridge || !api) {
      setPhase('chua-dang-nhap');
      return;
    }

    const stored = await bridge.auth.loadSession();
    if (!stored) {
      setPhase('chua-dang-nhap');
      return;
    }

    api.setToken(stored.sessionToken);

    try {
      // `/auth/refresh` chấp nhận token hết hạn, nên đây vừa là phép xác minh
      // vừa là lần gia hạn.
      const fresh = await api.request<AuthResponse>('/api/v1/auth/refresh', {
        method: 'POST',
      });
      api.setToken(fresh.token);
      await bridge.auth.storeSession({
        userId: fresh.userId,
        sessionToken: fresh.token,
      });
      setUser(toUser(fresh));
      setPhase('da-dang-nhap');
    } catch (error) {
      if (error instanceof ApiError && error.failure.kind === 'offline') {
        // Mất mạng KHÔNG phải phiên chết. Giữ token, cho vào app với dữ liệu
        // ngoại tuyến, và xác minh lại khi có mạng. Xoá phiên ở đây là cách
        // chắc chắn nhất để làm người dùng mất quyền đọc chính dữ liệu của họ.
        setUser({
          userId: stored.userId,
          username: '',
          email: '',
          roles: [],
          role: '',
        });
        setPhase('chua-xac-minh-duoc');
        return;
      }
      // 401/403 → phiên đã chết thật.
      await bridge.auth.clearSession();
      api.setToken(null);
      setPhase('chua-dang-nhap');
    }
  }, []);

  useEffect(() => {
    if (apiOrigin === null) return; // chưa biết gốc API (app:getInfo chưa về)
    void restore();
  }, [apiOrigin, restore]);

  const login = useCallback(async (username: string, password: string) => {
    const api = apiRef.current;
    if (!api) throw new Error('Chưa sẵn sàng kết nối máy chủ.');

    // Không gắn token cũ vào lời gọi đăng nhập.
    api.setToken(null);
    const response = await api.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: { username, password },
    });

    api.setToken(response.token);
    await window.cuongthai?.auth.storeSession({
      userId: response.userId,
      sessionToken: response.token,
    });
    setUser(toUser(response));
    setPhase('da-dang-nhap');
  }, []);

  /**
   * Đăng nhập bằng token nhận từ luồng OAuth qua trình duyệt.
   *
   * Token tới từ cổng vòng `127.0.0.1` (xem `main/ipc/oauthVong.ts`), nên nó
   * ĐÃ do máy chủ của ta cấp — không phải thứ người dùng gõ vào.
   *
   * ⚠️ VẪN gọi `/auth/refresh` chứ không tin thẳng: bước đó vừa XÁC MINH token
   * với máy chủ, vừa lấy về hồ sơ người dùng (tên, vai trò) mà bản thân chuỗi
   * token không mang theo. Nhận bừa nghĩa là một token giả cũng đăng nhập được
   * và app sẽ hiện một người dùng rỗng cho tới lời gọi API đầu tiên.
   */
  const dangNhapBangToken = useCallback(async (token: string) => {
    const api = apiRef.current;
    if (!api) throw new Error('Chưa sẵn sàng kết nối máy chủ.');

    api.setToken(token);
    try {
      const fresh = await api.request<AuthResponse>('/api/v1/auth/refresh', { method: 'POST' });
      api.setToken(fresh.token);
      await window.cuongthai?.auth.storeSession({
        userId: fresh.userId,
        sessionToken: fresh.token,
      });
      setUser(toUser(fresh));
      setPhase('da-dang-nhap');
    } catch (err) {
      api.setToken(null);
      throw err;
    }
  }, []);

  const logout = useCallback(async (options?: { discardUnsynced?: boolean }) => {
    const api = apiRef.current;

    // Báo máy chủ (tốt nhất có thể). Máy chủ không có kho token nên việc này
    // chủ yếu để dọn cookie phía nó; hỏng cũng không cản được đăng xuất cục bộ.
    try {
      await api?.request('/api/v1/auth/logout', { method: 'POST' });
    } catch {
      /* mất mạng vẫn phải đăng xuất được */
    }

    if (options?.discardUnsynced === true && user) {
      const { clearUserData } = await import('../offline/db');
      await clearUserData(user.userId);
    }
    // KHÔNG tự xoá dữ liệu ngoại tuyến khi không được yêu cầu. Nháp chưa gửi là
    // dữ liệu người dùng đã gõ ra; đăng xuất không phải là lời cho phép xoá nó.

    api?.setToken(null);
    await window.cuongthai?.auth.clearSession();
    setUser(null);
    setPhase('chua-dang-nhap');
  }, [user]);

  const unsyncedCount = useCallback(async () => {
    if (!user) return 0;
    return countUnsynced(user.userId);
  }, [user]);

  const value = useMemo<SessionContextValue>(
    () => ({
      phase,
      user,
      userId: user?.userId ?? null,
      api: apiRef.current,
      login,
      dangNhapBangToken,
      logout,
      unsyncedCount,
    }),
    [phase, user, login, dangNhapBangToken, logout, unsyncedCount],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession phải nằm trong <SessionProvider>');
  return context;
}
