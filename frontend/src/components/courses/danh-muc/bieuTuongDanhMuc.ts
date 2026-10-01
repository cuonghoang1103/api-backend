import {
  BookOpen, Briefcase, Code2, Cpu, Database, Layout, Rocket, Server, Shield, Sparkles, Video,
  Cloud, Globe, Smartphone, Palette, Brain, Terminal, Network, Lock, LineChart, Layers, GraduationCap,
  type LucideIcon,
} from 'lucide-react';

/**
 * `CourseCategory.icon` lưu TÊN icon lucide dạng chuỗi (do file content/courses/*.mjs khai,
 * vd 'Server', 'Shield'). Không import cả bộ lucide theo tên động (phình bundle) — chỉ map
 * những tên thật đang dùng + vài tên hay gặp; tên lạ rơi về BookOpen.
 */
const BANG: Record<string, LucideIcon> = {
  BookOpen, Briefcase, Code2, Code: Code2, Cpu, Database, Layout, Rocket, Server, Shield, Sparkles,
  Video, Cloud, Globe, Smartphone, Palette, Brain, Terminal, Network, Lock, LineChart, Layers,
  GraduationCap,
};

export function bieuTuongDanhMuc(ten?: string | null): LucideIcon {
  if (!ten) return BookOpen;
  return BANG[ten.trim()] ?? BookOpen;
}

/** Mỗi danh mục một sắc riêng (ổn định theo tên icon) để thẻ không đồng một màu. */
const SAC: Record<string, string> = {
  Server: 'from-sky-500/25 to-cyan-400/10 text-sky-700 [.theme-dark_&]:text-sky-300',
  Shield: 'from-rose-500/25 to-orange-400/10 text-rose-700 [.theme-dark_&]:text-rose-300',
  Sparkles: 'from-fuchsia-500/25 to-violet-400/10 text-fuchsia-700 [.theme-dark_&]:text-fuchsia-300',
  Database: 'from-emerald-500/25 to-teal-400/10 text-emerald-700 [.theme-dark_&]:text-emerald-300',
  Cpu: 'from-amber-500/25 to-yellow-400/10 text-amber-800 [.theme-dark_&]:text-amber-300',
  Layout: 'from-indigo-500/25 to-blue-400/10 text-indigo-700 [.theme-dark_&]:text-indigo-300',
  Briefcase: 'from-orange-500/25 to-amber-400/10 text-orange-700 [.theme-dark_&]:text-orange-300',
  Code2: 'from-violet-500/25 to-indigo-400/10 text-violet-700 [.theme-dark_&]:text-violet-300',
  Rocket: 'from-pink-500/25 to-rose-400/10 text-pink-700 [.theme-dark_&]:text-pink-300',
  Video: 'from-red-500/25 to-pink-400/10 text-red-700 [.theme-dark_&]:text-red-300',
};

export function sacDanhMuc(ten?: string | null): string {
  return (ten && SAC[ten.trim()]) || 'from-neon-indigo/25 to-neon-violet/10 text-violet-700 [.theme-dark_&]:text-violet-300';
}
