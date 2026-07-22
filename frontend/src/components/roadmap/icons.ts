import {
  Monitor, Server, Infinity as InfinityIcon, Braces, Atom, Database, Binary, FileCode, Palette,
  GitBranch, Wind, Layers, Smartphone, Hexagon, Coffee, Rabbit, Webhook, Share2, Zap, Container,
  Ship, Terminal, Boxes, Code2, GitMerge, GitFork, Hash, Search, ArrowDownUp, Rows3, Grid3x3,
  Route, Map as MapIcon, type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  Monitor, Server, Infinity: InfinityIcon, Braces, Atom, Database, Binary, FileCode, Palette,
  GitBranch, Wind, Layers, Smartphone, Hexagon, Coffee, Rabbit, Webhook, Share2, Zap, Container,
  Ship, Terminal, Boxes, Code2, GitMerge, GitFork, Hash, Search, ArrowDownUp, Rows3, Grid3x3, Route, Map: MapIcon,
};

export function roadmapIcon(name?: string | null): LucideIcon {
  return (name && MAP[name]) || Route;
}
