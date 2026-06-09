'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  Clock, Eye, Calendar, ArrowLeft, Share2,
  Twitter, Facebook, Linkedin, Link2, Check,
  MessageSquare, Send, Tag, Download, Loader2
} from 'lucide-react';
import Image from 'next/image';
import { blogApi } from '@/lib/api';
import type { Post, BlogComment } from '@/types';
import BlogCard from '@/components/blog/BlogCard';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function estimateReadingTime(content?: string) {
  if (!content) return 5;
  const text = content.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  const words = text.split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Mock data for fallback ───────────────────────────────────────────────────

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Tối ưu upload file với Signed URL',
    slug: 'toi-uu-upload-file-voi-signed-url',
    excerpt: 'Hướng dẫn chi tiết cách implement signed URL để upload file trực tiếp lên S3/Cloudinary mà không cần server làm trung gian.',
    content: '## Giới thiệu\n\nSigned URL là một trong những cách hiệu quả nhất để upload file...\n\n## Cách hoạt động\n\n1. Client gửi request lên server yêu cầu signed URL\n2. Server ký URL với secret key và trả về\n3. Client upload trực tiếp lên storage provider\n\n```javascript\nconst { url } = await generateSignedUrl(bucket, filename);\n```',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    status: 'PUBLISHED',
    viewCount: 1247,
    isFeatured: true,
    publishedAt: '2024-11-15T10:00:00Z',
    createdAt: '2024-11-14T08:00:00Z',
    categoryId: 1,
    categoryName: 'DevOps',
    categorySlug: 'devops',
    authorName: 'CuongHoang',
    tagNames: ['AWS', 'S3', 'Node.js'],
    sourceUrl: 'https://github.com/cuonghoang/upload-signed-url',
    downloadCount: 89,
    commentCount: 12,
  },
  {
    id: 2,
    title: 'Nâng cấp AI Chatbot cho Website',
    slug: 'nang-cap-ai-chatbot-cho-website',
    excerpt: 'Cách tích hợp Gemini Pro vào website với streaming response, context preservation và vector search.',
    content: '## Tại sao cần AI Chatbot?\n\nAI Chatbot giúp tự động hóa hỗ trợ khách hàng...\n\n## Architecture\n\n```\nUser -> Next.js -> API Route -> Gemini API\n                    |\n              Vector DB (Pinecone)\n```',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    status: 'PUBLISHED',
    viewCount: 892,
    isFeatured: false,
    publishedAt: '2024-11-20T14:00:00Z',
    createdAt: '2024-11-19T09:00:00Z',
    categoryId: 2,
    categoryName: 'AI',
    categorySlug: 'ai',
    authorName: 'CuongHoang',
    tagNames: ['Gemini', 'Next.js', 'Vector DB'],
    downloadCount: 0,
    commentCount: 5,
  },
];

// ─── Table of Contents ────────────────────────────────────────────────────────

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    items.push({ id, text, level });
  }
  return items;
}

function TableOfContents({ toc, activeId }: { toc: TocItem[]; activeId: string }) {
  if (toc.length === 0) return null;

  return (
    <nav className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Table of Contents</p>
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block text-xs py-1 transition-all duration-200 ${
            item.level === 3 ? 'pl-4' : ''
          } ${
            activeId === item.id
              ? 'text-neon-violet font-semibold'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

// ─── Reading Progress ──────────────────────────────────────────────────────────

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-darkbg/80 backdrop-blur-sm">
      <motion.div
        className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
        style={{ width: `${progress}%` }}
        transition={{ ease: 'linear' }}
      />
    </div>
  );
}

// ─── Share Buttons ────────────────────────────────────────────────────────────

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:text-sky-400',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:text-blue-500',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:text-blue-600',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-muted mr-1">Share:</span>
      {shareLinks.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-lg text-text-muted ${s.color} transition-colors`}
          title={s.name}
        >
          <s.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg text-text-muted hover:text-neon-violet transition-colors"
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── Copy Code Button ─────────────────────────────────────────────────────────

function CopyCodeBtn() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const pre = document.querySelector('.prose pre');
    const code = pre?.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.innerText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-mono font-bold transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{ background: 'rgba(168,85,247,0.2)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ─── Comment Item ─────────────────────────────────────────────────────────────

function CommentItem({ comment }: { comment: BlogComment }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'rgba(15,10,30,0.6)', border: '1px solid rgba(168,85,247,0.15)' }}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5">
          <Image
            src={comment.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.userName)}`}
            alt={comment.userName}
            width={28}
            height={28}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold" style={{ color: '#f8fafc' }}>{comment.userName}</span>
            <span className="text-[10px] font-mono" style={{ color: '#64748b' }}>{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{comment.commentText}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Comment Form ─────────────────────────────────────────────────────────────

function CommentForm({ postId, onSuccess }: { postId: number; onSuccess: (comment: BlogComment) => void }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [localComments, setLocalComments] = useState<BlogComment[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'anon')}`;
      const res = await blogApi.addComment(postId, {
        userName: name.trim() || 'Anonymous',
        userAvatar: avatar,
        commentText: text.trim(),
      });
      if (res.data.success && res.data.data) {
        setLocalComments(prev => [...prev, res.data.data]);
        onSuccess(res.data.data);
        setText('');
        setName('');
      }
    } catch {
      setSubmitError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(168,85,247,0.15)', color: '#f8fafc' }}
      />
      <textarea
        placeholder="Share your technical insight..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 rounded-lg text-xs resize-none outline-none transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(168,85,247,0.15)', color: '#f8fafc' }}
        onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = '#a855f7')}
        onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = 'rgba(168,85,247,0.15)')}
      />
      {submitError && <p className="text-xs" style={{ color: '#f87171' }}>{submitError}</p>}
      <button
        type="submit"
        disabled={!text.trim() || submitting}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff' }}
      >
        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        Submit Comment
      </button>

      {localComments.map(c => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </form>
  );
}

// ─── Not Found View ───────────────────────────────────────────────────────────

function NotFoundView() {
  return (
    <div className="min-h-screen bg-darkbg pt-20 flex flex-col items-center justify-center">
      <div className="relative text-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(20px)' }}
          />
        </div>
        <div className="relative">
          <div className="font-mono text-xs text-neon-violet/60 mb-4 tracking-widest">
            {'> SYSTEM_LOG: RESOURCE_NOT_FOUND'}
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <span className="text-2xl" style={{ color: '#f87171' }}>!</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Post not found</h1>
          <p className="text-text-secondary mb-6 max-w-md">
            The requested technical resource does not exist or may have been removed from the system log.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Terminal / Blog
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toc = post ? extractToc(post.content) : [];

  // Hydration guard
  useEffect(() => { setMounted(true); }, []);

  const fetchPost = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const response = await blogApi.getPostBySlug(slug);
      const postData = response.data?.data;
      if (postData) {
        setPost(postData);
        if (postData.categorySlug) {
          const relatedResponse = await blogApi.search({ category: postData.categorySlug, size: 4 });
          const relatedData = Array.isArray(relatedResponse.data?.data) ? relatedResponse.data.data : [];
          const related = (relatedData as Post[]).filter(
            (p: Post) => p.slug !== slug
          );
          setRelatedPosts(related.slice(0, 3));
        }
      } else {
        // Fallback: try mock data
        const found = MOCK_POSTS.find(p => p.slug === slug);
        if (found) {
          setPost(found);
        } else {
          setError('Post not found');
        }
      }
    } catch {
      // Network error — try mock data fallback
      const found = MOCK_POSTS.find(p => p.slug === slug);
      if (found) {
        setPost(found);
      } else {
        setError('Unable to load post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Intersection Observer for ToC active tracking
  useEffect(() => {
    if (!mounted) return;
    const headings = document.querySelectorAll('.prose h2, .prose h3');
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [mounted, post]);

  // Scroll to heading when ToC item clicked
  const handleTocClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeadingId(id);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-neon-violet/30 border-t-neon-violet rounded-full animate-spin" />
          <p className="text-text-secondary">Loading post...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-neon-violet/30 border-t-neon-violet rounded-full animate-spin" />
          <p className="text-text-secondary">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <NotFoundView />;
  }

  const readingTime = estimateReadingTime(post.content);

  return (
    <article className="min-h-screen bg-darkbg">
      <ReadingProgress />

      {/* Hero */}
      <section className="relative h-[45vh] min-h-[360px]">
        <div className="absolute inset-0">
          {post.thumbnailUrl ? (
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-indigo via-neon-violet to-neon-fuchsia" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-darkbg/50 to-darkbg/20" />
        </div>

        {/* Back button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-darkbg/80 backdrop-blur-sm rounded-xl text-text-primary hover:text-neon-violet transition-colors border border-darkborder"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            {post.categoryName && (
              <Link
                href={`/blog?category=${post.categorySlug}`}
                className="inline-block px-3 py-1 bg-neon-violet text-white text-sm font-medium rounded-full mb-4 hover:bg-neon-violet/80 transition-colors"
              >
                {post.categoryName}
              </Link>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text-primary leading-tight mb-6"
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap items-center gap-5 text-sm text-text-secondary"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-indigo to-neon-fuchsia flex items-center justify-center text-white font-bold">
                  {post.authorName?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{post.authorName || 'CuongHoang'}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {post.viewCount > 0 ? post.viewCount.toLocaleString() : '0'} views
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content: Two-column layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left: Article content (3 cols) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Share bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center justify-between pb-6 border-b border-darkborder"
            >
              <ShareButtons title={post.title} slug={post.slug} />
            </motion.div>

            {/* Article */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-darkcard rounded-2xl border border-darkborder p-6 md:p-10"
              ref={contentRef}
            >
              {post.excerpt && (
                <p className="text-xl text-text-secondary italic border-l-4 border-neon-violet pl-6 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Markdown content */}
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-heading prose-headings:text-text-primary prose-headings:scroll-mt-24
                  prose-p:text-text-secondary prose-p:leading-relaxed
                  prose-a:text-neon-violet prose-a:no-underline hover:prose-a:underline
                  prose-code:text-neon-cyan prose-code:bg-darkbg prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-[rgba(5,3,15,0.9)] prose-pre:border prose-pre:border-darkborder prose-pre:rounded-xl prose-pre:relative prose-pre:group
                  prose-blockquote:border-neon-violet prose-blockquote:text-text-muted
                  prose-img:rounded-2xl
                  prose-li:text-text-secondary"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    pre: ({ children }) => (
                      <pre className="relative group rounded-xl overflow-hidden" style={{ background: 'rgba(5,3,15,0.9)', border: '1px solid rgba(168,85,247,0.15)' }}>
                        <CopyCodeBtn />
                        {children}
                      </pre>
                    ),
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      return <h2 id={id} className="scroll-mt-24" {...props}>{children}</h2>;
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      return <h3 id={id} className="scroll-mt-24" {...props}>{children}</h3>;
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {post.tagNames && post.tagNames.length > 0 && (
                <div className="mt-10 pt-8 border-t border-darkborder">
                  <div className="flex flex-wrap gap-2">
                    {post.tagNames.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 bg-neon-indigo/10 text-neon-indigo rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Code Download */}
              {post.sourceUrl && (
                <div className="mt-6 pt-8 border-t border-darkborder">
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      color: '#fff',
                      boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download Source Code
                    {post.downloadCount != null && post.downloadCount > 0 && (
                      <span className="text-xs opacity-70">({post.downloadCount} downloads)</span>
                    )}
                  </a>
                </div>
              )}
            </motion.div>

            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-neon-indigo/10 to-neon-violet/10 rounded-2xl border border-neon-violet/15 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-indigo to-neon-fuchsia flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {post.authorName?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-0.5">Written by</p>
                  <h3 className="text-lg font-heading font-bold text-text-primary">
                    {post.authorName || 'CuongHoang'}
                  </h3>
                  <p className="text-sm text-text-muted">
                    Software Developer & Tech Content Creator
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Technical Exchange Thread */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-darkcard rounded-2xl border border-darkborder p-6"
            >
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-darkborder">
                <MessageSquare className="w-4 h-4 text-neon-violet" />
                <h2 className="text-lg font-heading font-bold text-text-primary">
                  Technical Exchange Thread
                </h2>
                <span className="ml-2 text-xs text-text-muted font-mono">
                  ({post.commentCount ?? 0} comments)
                </span>
              </div>

              <div className="mb-4">
                <CommentForm
                  postId={post.id}
                  onSuccess={(c) => setPost(p => p ? { ...p, commentCount: (p.commentCount ?? 0) + 1 } : p)}
                />
              </div>
            </motion.div>

            {/* Share bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between"
            >
              <ShareButtons title={post.title} slug={post.slug} />
              <Link
                href="/blog"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">
                  Related Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rp, i) => (
                    <BlogCard key={rp.id} post={rp} index={i} variant="compact" />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right: Table of Contents (1 col) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-darkcard rounded-2xl border border-darkborder p-5">
                <TableOfContents toc={toc} activeId={activeHeadingId} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
