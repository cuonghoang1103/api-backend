'use client';

// Re-export of the shared Shiki-based CodeBlock.
// All call sites (Database Schema, Milestone Code review,
// admin schema preview) flow through the same component
// to guarantee identical visual output.
export { default } from '@/components/markdown/CodeBlock';
