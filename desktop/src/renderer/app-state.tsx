/**
 * Trạng thái nền của shell: điều hướng, cấu hình, theme, mạng.
 *
 * Gộp vào một provider thay vì bốn provider lồng nhau, vì cả bốn đều nhỏ và
 * đều đọc từ cùng một nguồn (cầu nối IPC). Tách ra chỉ tạo bốn tầng context
 * mà không giảm được liên kết nào.
 *
 * Không dùng react-router: app này có tập route đóng, biết trước lúc biên
 * dịch, và chạy trên scheme `app://` nơi URL không phải thứ người dùng gõ. Một
 * router dựa trên URL sẽ thêm một phụ thuộc và một tầng ngữ nghĩa để đổi lấy
 * đúng cái ta không cần.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SettingKey, SettingValue, ThemeSetting } from '../shared/ipc';
import { INTERNAL_ROUTES } from './routes';

type Settings = Partial<Record<SettingKey, SettingValue>>;

interface AppState {
  route: string;
  navigate: (path: string) => void;

  settings: Settings;
  setSetting: (key: SettingKey, value: SettingValue) => void;

  theme: ThemeSetting;
  /** Theme đang áp dụng thật, sau khi giải nghĩa 'system'. */
  resolvedTheme: 'light' | 'dark';

  online: boolean;
  /** `true` khi app chạy trong Electron. `false` nếu mở bundle bằng trình duyệt. */
  hasBridge: boolean;
}

const AppStateContext = createContext<AppState | null>(null);

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const bridge = window.cuongthai;

  const [settings, setSettings] = useState<Settings>({});
  const [route, setRoute] = useState<string>('/dashboard');
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);

  // Nạp cấu hình đã lưu. Cho tới khi xong, app dùng mặc định — không chặn
  // render bằng màn hình chờ, vì cấu hình chỉ ảnh hưởng vẻ ngoài chứ không
  // ảnh hưởng tính đúng đắn.
  useEffect(() => {
    if (!bridge) return;
    void bridge.settings.getAll().then((loaded) => {
      setSettings(loaded);
      const last = loaded.lastRoute;
      if (typeof last === 'string') setRoute(last);
    });
  }, [bridge]);

  useEffect(() => {
    if (!bridge) return;
    return bridge.on('app:networkChanged', (payload) => {
      const next = payload as { online?: boolean };
      if (typeof next.online === 'boolean') setOnline(next.online);
    });
  }, [bridge]);

  // Deep link (cuongthai://) — main gửi sang đường dẫn đã tách sẵn.
  useEffect(() => {
    if (!bridge) return;
    return bridge.on('app:navigate', (payload) => {
      const next = payload as { path?: string };
      if (typeof next.path === 'string') setRoute(next.path);
    });
  }, [bridge]);

  // Theo dõi theme hệ thống. `addEventListener` trên MediaQueryList — không
  // dùng `addListener` (đã bỏ) để tránh cảnh báo và để dọn dẹp đúng cách.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const theme: ThemeSetting =
    settings.theme === 'light' || settings.theme === 'dark' || settings.theme === 'system'
      ? settings.theme
      : 'system';

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  // Gắn lên <html> để CSS đổi biến. Làm ở đây thay vì trong component để chỉ
  // có MỘT chỗ ghi thuộc tính này — hai chỗ ghi sẽ đá nhau lúc chuyển theme.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const setSetting = useCallback(
    (key: SettingKey, value: SettingValue) => {
      // Cập nhật cục bộ ngay để giao diện phản hồi tức thì, rồi mới ghi xuống
      // đĩa. Ghi hỏng thì cấu hình vẫn đúng trong phiên này và sẽ được ghi lại
      // ở lần đổi kế tiếp — không đáng để chặn giao diện.
      setSettings((previous) => ({ ...previous, [key]: value }));
      void bridge?.settings.set(key, value);
    },
    [bridge],
  );

  const navigate = useCallback(
    (path: string) => {
      setRoute(path);
      // Không ghi nhớ route nội bộ (Cài đặt, Giới thiệu): mở lại app mà rơi
      // thẳng vào màn hình Cài đặt là hành vi khó hiểu.
      const isInternal = Object.values(INTERNAL_ROUTES).some((r) => r === path);
      if (!isInternal) setSetting('lastRoute', path);
    },
    [setSetting],
  );

  const value = useMemo<AppState>(
    () => ({
      route,
      navigate,
      settings,
      setSetting,
      theme,
      resolvedTheme,
      online,
      hasBridge: bridge !== undefined,
    }),
    [route, navigate, settings, setSetting, theme, resolvedTheme, online, bridge],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState phải nằm trong <AppStateProvider>');
  return context;
}
