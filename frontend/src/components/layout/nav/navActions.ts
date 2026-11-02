'use client';

import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

/** Same sequence the old Navbar and NavigationDock each carried a copy of. */
export async function logoutEverywhere(message: string): Promise<void> {
  useAuthStore.getState().logout();
  try { await signOut({ redirect: false }); } catch { /* already signed out */ }
  try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch { /* offline */ }
  toast.success(message);
  window.location.href = '/login';
}
