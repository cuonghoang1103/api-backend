'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Database, Upload, Trash2, RefreshCw, Search, AlertCircle,
  CheckCircle2, FileText, Tag, X, ChevronLeft, ChevronRight,
  FileUp, ClipboardPaste,
} from 'lucide-react';

const API = '/api/v1';
const PAGE_SIZE = 50;

interface Chunk {
  id: number;
  documentId: string;
  documentType: string;
  chunkIndex: number;
  content: string;
  createdAt: string;
}

interface PageMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DOCUMENT_TYPE_PRESETS = [
  { value: 'personal_bio', label: 'Thông tin cá nhân (bio)' },
  { value: 'contact', label: 'Liên hệ' },
  { value: 'skills', label: 'Kỹ năng' },
  { value: 'projects', label: 'Projects / Portfolio' },
  { value: 'pricing', label: 'Bảng giá dịch vụ' },
  { value: 'education', label: 'Học vấn' },
  { value: 'faq', label: 'Câu hỏi thường gặp' },
  { value: 'blog', label: 'Bài viết blog' },
  { value: 'service', label: 'Dịch vụ' },
  { value: 'policy', label: 'Chính sách' },
  { value: 'custom', label: 'Khác (tự điền)' },
];

export default function AIKnowledgePage() {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [meta, setMeta] = useState<PageMeta>({ total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [page, setPage] = useState(1);

  // Form state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTab, setUploadTab] = useState<'paste' | 'file'>('paste');
  const [documentId, setDocumentId] = useState('');
  const [documentType, setDocumentType] = useState('personal_bio');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileDocType, setFileDocType] = useState('blog');
  const [fileIdPrefix, setFileIdPrefix] = useState('');

  const loadChunks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterType) params.set('documentType', filterType);
      params.set('page', String(page));
      params.set('pageSize', String(PAGE_SIZE));
      const url = `${API}/ai/admin/documents?${params.toString()}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const payload = data.data || { chunks: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 };
      // Backend returns { chunks, total, page, pageSize, totalPages } OR legacy array
      if (Array.isArray(payload)) {
        setChunks(payload);
        setMeta({ total: payload.length, page: 1, pageSize: PAGE_SIZE, totalPages: 1 });
      } else {
        setChunks(payload.chunks || []);
        setMeta({
          total: payload.total ?? 0,
          page: payload.page ?? 1,
          pageSize: payload.pageSize ?? PAGE_SIZE,
          totalPages: payload.totalPages ?? 1,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chunks');
    } finally {
      setLoading(false);
    }
  }, [filterType, page]);

  useEffect(() => {
    setPage(1); // reset to page 1 when filter changes
  }, [filterType]);

  useEffect(() => {
    loadChunks();
  }, [loadChunks]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId.trim() || !content.trim()) {
      setError('Document ID và content là bắt buộc');
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API}/ai/admin/documents`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: documentId.trim(),
          documentType: documentType.trim(),
          content: content.trim(),
        }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody}`);
      }
      const data = await res.json();
      const created = data.data?.chunksCreated ?? 0;
      setSuccess(`✓ Đã upload "${documentId}" → ${created} chunks`);
      setDocumentId('');
      setContent('');
      setShowUpload(false);
      await loadChunks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Chọn ít nhất 1 file .md hoặc .txt');
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      selectedFiles.forEach((f) => formData.append('files', f));
      formData.append('documentType', fileDocType.trim() || 'custom');
      if (fileIdPrefix.trim()) formData.append('documentIdPrefix', fileIdPrefix.trim());

      const res = await fetch(`${API}/ai/admin/documents/upload-files`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody}`);
      }
      const data = await res.json();
      const payload = data.data;
      setSuccess(
        `✓ Đã upload ${payload.uploaded}/${payload.uploaded + payload.failed} files → ${payload.totalChunks} chunks` +
        (payload.failed > 0 ? ` (${payload.failed} lỗi)` : ''),
      );
      setSelectedFiles([]);
      setFileIdPrefix('');
      setShowUpload(false);
      await loadChunks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, docType: string) => {
    if (!confirm(`Xoá tất cả chunks của "${docId}"?`)) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `${API}/ai/admin/documents/${encodeURIComponent(docId)}?documentType=${encodeURIComponent(docType)}`,
        { method: 'DELETE', credentials: 'include' },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSuccess(`✓ Đã xoá "${docId}"`);
      await loadChunks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const filteredChunks = chunks.filter((c) =>
    !searchQuery || c.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group chunks by documentId for display
  const grouped = filteredChunks.reduce<Record<string, Chunk[]>>((acc, c) => {
    const key = `${c.documentType}::${c.documentId}`;
    (acc[key] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Database className="w-6 h-6 text-neon-violet" />
            AI Knowledge Base
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Quản lý dữ liệu mà AI Chatbot CuongMini dùng để trả lời về bạn.
            Mỗi document sẽ được tự động chia thành chunks (~1000 ký tự/chunk).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadChunks}
            disabled={loading}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-text-primary rounded-xl text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-emerald-300 text-sm font-medium flex-1">{success}</p>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-darkcard border border-darkborder rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-bold text-text-primary">Upload Knowledge Document</h3>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFiles([]);
                  setUploadTab('paste');
                }}
                className="p-1 hover:bg-white/5 rounded-lg"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-darkborder mb-4">
              <button
                type="button"
                onClick={() => setUploadTab('paste')}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                  uploadTab === 'paste'
                    ? 'border-neon-violet text-text-primary'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <ClipboardPaste className="w-4 h-4" />
                Paste Content
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                  uploadTab === 'file'
                    ? 'border-neon-violet text-text-primary'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <FileUp className="w-4 h-4" />
                Upload Files (.md / .txt)
              </button>
            </div>

            {uploadTab === 'paste' ? (
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Document ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="vd: bio-cuongthai-2026"
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-violet text-sm"
                  required
                />
                <p className="text-xs text-text-muted mt-1">
                  ID duy nhất. Upload lại cùng ID sẽ thay thế (xoá chunks cũ, tạo mới).
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Loại tài liệu <span className="text-red-400">*</span>
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-text-primary focus:outline-none focus:border-neon-violet text-sm"
                >
                  {DOCUMENT_TYPE_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                {documentType === 'custom' && (
                  <input
                    type="text"
                    placeholder="Nhập document type tuỳ chỉnh"
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full mt-2 px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-text-primary text-sm"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Nội dung <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder="Dán nội dung cần AI biết vào đây. Có thể dài tới vài nghìn ký tự, hệ thống sẽ tự động chia chunks."
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-violet text-sm font-mono"
                  required
                />
                <p className="text-xs text-text-muted mt-1">
                  {content.length} ký tự {content.length > 0 && `(~${Math.ceil(content.length / 1000)} chunks dự kiến)`}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-text-primary rounded-xl text-sm"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {uploading ? 'Đang upload...' : 'Upload'}
                </button>
              </div>
            </form>
            ) : (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Chọn files <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  accept=".md,.txt,.markdown,.text,text/markdown,text/plain"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-text-primary text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-neon-violet/20 file:text-neon-violet file:text-sm file:font-medium hover:file:bg-neon-violet/30"
                />
                <p className="text-xs text-text-muted mt-1">
                  Hỗ trợ .md, .markdown, .txt. Tối đa 20 files, 5MB mỗi file.
                </p>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 p-2 bg-darkbg/50 border border-darkborder/50 rounded-lg">
                    <p className="text-xs text-text-muted mb-1">Đã chọn ({selectedFiles.length}):</p>
                    <ul className="space-y-1">
                      {selectedFiles.map((f, i) => (
                        <li key={i} className="text-xs text-text-secondary flex items-center gap-2">
                          <FileText className="w-3 h-3 text-text-muted" />
                          <span className="truncate flex-1">{f.name}</span>
                          <span className="text-text-muted">{(f.size / 1024).toFixed(1)}KB</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Loại tài liệu (áp dụng cho tất cả files)
                </label>
                <select
                  value={fileDocType}
                  onChange={(e) => setFileDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-text-primary focus:outline-none focus:border-neon-violet text-sm"
                >
                  {DOCUMENT_TYPE_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Document ID Prefix (tuỳ chọn)
                </label>
                <input
                  type="text"
                  value={fileIdPrefix}
                  onChange={(e) => setFileIdPrefix(e.target.value)}
                  placeholder="vd: blog-2026 (sẽ tạo ID: blog-2026-tên-file)"
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-violet text-sm"
                />
                <p className="text-xs text-text-muted mt-1">
                  Nếu để trống, ID sẽ lấy từ tên file (vd: <code>bài-viết-1.md</code> → <code>bai-viet-1</code>).
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-text-primary rounded-xl text-sm"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {uploading ? `Đang upload ${selectedFiles.length} files...` : `Upload ${selectedFiles.length} file(s)`}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm trong nội dung chunks..."
            className="w-full pl-10 pr-3 py-2 bg-darkcard border border-darkborder rounded-xl text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-violet text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-darkcard border border-darkborder rounded-xl text-text-primary text-sm"
        >
          <option value="">Tất cả loại</option>
          {DOCUMENT_TYPE_PRESETS.filter((p) => p.value !== 'custom').map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-darkcard border border-darkborder rounded-xl">
          <p className="text-xs text-text-muted">Tổng chunks</p>
          <p className="text-2xl font-heading font-bold text-text-primary">
            {meta.total}
            {meta.total > chunks.length && (
              <span className="text-xs text-text-muted font-normal ml-1">
                (trang {meta.page}/{meta.totalPages})
              </span>
            )}
          </p>
        </div>
        <div className="p-4 bg-darkcard border border-darkborder rounded-xl">
          <p className="text-xs text-text-muted">Số documents (trang này)</p>
          <p className="text-2xl font-heading font-bold text-text-primary">{Object.keys(grouped).length}</p>
        </div>
        <div className="p-4 bg-darkcard border border-darkborder rounded-xl">
          <p className="text-xs text-text-muted">Loại duy nhất</p>
          <p className="text-2xl font-heading font-bold text-text-primary">
            {new Set(chunks.map((c) => c.documentType)).size}
          </p>
        </div>
        <div className="p-4 bg-darkcard border border-darkborder rounded-xl">
          <p className="text-xs text-text-muted">Ký tự (trang này)</p>
          <p className="text-2xl font-heading font-bold text-text-primary">
            {chunks.reduce((s, c) => s + c.content.length, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chunks list (grouped by document) */}
      {loading ? (
        <div className="text-center py-12 text-text-muted">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          Đang tải...
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 bg-darkcard border border-darkborder rounded-xl">
          <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">
            Chưa có chunks nào. Bấm "Upload Document" để bắt đầu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([key, group]) => {
            const [type, docId] = key.split('::');
            return (
              <div key={key} className="bg-darkcard border border-darkborder rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-neon-violet/15 text-neon-violet text-xs font-medium rounded-md flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {type}
                      </span>
                      <span className="text-text-primary font-medium text-sm truncate">{docId}</span>
                      <span className="text-xs text-text-muted">({group.length} chunks)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(docId, type)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    title="Xoá document này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {group.map((chunk) => (
                    <div
                      key={chunk.id}
                      className="p-3 bg-darkbg/50 border border-darkborder/50 rounded-lg text-sm text-text-secondary leading-relaxed"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-text-muted">chunk #{chunk.chunkIndex}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{chunk.content.length} chars</span>
                      </div>
                      <p className="whitespace-pre-wrap break-words">{chunk.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Pagination controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-darkborder">
              <p className="text-sm text-text-muted">
                Trang {meta.page}/{meta.totalPages} • {meta.total} chunks tổng
                ({meta.pageSize}/trang)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-text-primary rounded-lg text-sm flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </button>
                <span className="text-sm text-text-secondary px-2">
                  {page} / {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages || loading}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-text-primary rounded-lg text-sm flex items-center gap-1 transition-colors"
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
