// ─── App types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  roles: string[];
  enabled: boolean;
  accountNonLocked: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName?: string;
}

export interface NextAuthUser {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  provider: string;
  isSocialUser: boolean;
  accounts: Array<{ provider: string }>;
}

// Skill & Project types
export interface Skill {
  id: number;
  name: string;
  slug: string;
  category: string;
  proficiency: number;
  description?: string;
  yearsExperience?: number;
  isFeatured: boolean;
  displayOrder: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  thumbnailUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  technologies?: string[];
  images?: string[];
  role?: string;
  duration?: string;
  status: string;
  featured: boolean;
  startDate?: string;
  endDate?: string;
  skillNames?: string[];
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// Blog types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  postCount?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  status: string;
  viewCount: number;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  authorId?: number;
  authorName?: string;
  tagNames?: string[];
  // Dev Sharing & Source Code Hub
  sourceUrl?: string;
  downloadCount?: number;
  commentCount?: number;
}

export interface BlogComment {
  id: number;
  userName: string;
  userAvatar?: string;
  commentText: string;
  createdAt: string;
}

// PostCard type for listing (no content)
export interface PostCard {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  thumbnailUrl?: string;
  categoryName?: string;
  categorySlug?: string;
  authorName?: string;
  viewCount: number;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  tagNames?: string[];
  sourceUrl?: string;
  downloadCount?: number;
  commentCount?: number;
}

// AI Chat types
export interface ChatMessage {
  id: number;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  tokenCount?: number;
  createdAt: string;
}

export interface ChatSession {
  id: number;
  sessionId: string;
  userId?: number;
  title?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  documentType?: string;
  topK?: number;
}

export interface ChatResponse {
  answer: string;
  sessionId: string;
  sources?: string[];
  tokenUsage?: number;
}

export interface FeedbackRequest {
  messageId: number;
  rating: number;
  feedbackType: 'helpful' | 'not_helpful' | 'accurate' | 'inaccurate';
  comment?: string;
}

// Admin types
export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  roleName: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  password?: string;
  enabled?: boolean;
  accountNonLocked?: boolean;
  roleName?: string;
}

// AI Admin types
export interface DocumentChunk {
  id: number;
  content: string;
  metadata?: string;
  documentId: string;
  documentType: string;
  chunkIndex: number;
  createdAt: string;
}

export interface IndexingResult {
  postsIndexed: number;
  profilesIndexed: number;
  skillsIndexed: number;
  projectsIndexed: number;
  errors: number;
}

export interface IndexStats {
  totalChunks: number;
  postsCount: number;
  profileCount: number;
  skillsCount: number;
  projectsCount: number;
}

// File upload
export interface FileUploadResponse {
  id: number;
  originalName: string;
  storedName: string;
  contentType: string;
  fileSize: number;
  /** Backend returns `url`, not `downloadUrl` */
  url: string;
  uploadedAt: string;
}

// === COURSE TYPES ===

export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  courseCount?: number;
  isActive?: boolean;
}

export interface Semester {
  id: number;
  name: string;
  code: string;
  ordinal: number;
  description?: string;
  isActive?: boolean;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  userId?: number;
  submissionUrl: string;
  notes?: string;
  status: string;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  updatedAt?: string;
}

export interface SubmissionWithUser {
  id: number;
  assignmentId: number;
  studentName?: string;
  studentEmail?: string;
  user?: {
    id: number;
    username?: string;
    email?: string;
    fullName?: string;
    avatarUrl?: string;
  };
  submissionUrl: string;
  notes?: string;
  status: string;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  updatedAt?: string;
}

export interface Assignment {
  id?: number;
  lessonId?: number;
  title: string;
  instructions?: string;
  deadline?: string;
  sortOrder: number;
  isPublished: boolean;
  maxScore?: number;
  mySubmission?: AssignmentSubmission;
}

export interface LessonDetail {
  id: number;
  lessonId?: number;
  videoPlatform?: 'EMBED' | 'YOUTUBE_TAB' | 'DIRECT' | string;
  videoUrl?: string;
  sourceCodeUrl?: string;
  teachingNotes?: string;
}

export interface LessonDto {
  id: number;
  sectionId?: number;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  lessonType: string;
  videoUrl?: string;
  videoDurationSeconds: number;
  thumbnailUrl?: string;
  isFreePreview: boolean;
  isPublished: boolean;
  sortOrder: number;
  videoPlatform?: 'EMBED' | 'YOUTUBE_TAB' | 'DIRECT' | string;
  sourceCodeUrl?: string;
  teachingNotes?: string;
  detail?: LessonDetail;
  documents?: CourseDocument[];
  assignments?: Assignment[];
}

export interface CourseDocument {
  id: number;
  lessonId?: number;
  title: string;
  fileUrl: string;
  fileSizeBytes: number;
  fileType?: string;
  downloadCount: number;
}

export interface CourseSection {
  id: number;
  title: string;
  description?: string;
  sortOrder: number;
  isLocked: boolean;
  lessonCount: number;
  totalDurationSeconds: number;
  lessons?: LessonDto[];
}

export interface Course {
  id: number;
  title: string;
  courseCode?: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  price: number;
  discountPrice?: number;
  discountExpiresAt?: string;
  level: string;
  language: string;
  academyType?: string;
  isFree: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: string;
  totalDurationSeconds: number;
  totalLessons: number;
  totalStudents: number;
  totalReviews: number;
  avgRating: number;
  requirements?: string;
  whatYouLearn?: string;
  status: 'DRAFT' | 'PUBLISHED' | string;
  createdAt: string;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  instructorId?: number;
  instructorName?: string;
  instructorAvatar?: string;
  semesterId?: number;
  semesterName?: string;
  semesterCode?: string;
  semesterOrdinal?: number;
  semester?: Semester;
  sections?: CourseSection[];
  tags?: string[];
  isEnrolled?: boolean;
  enrollmentProgress?: number;
}

export interface Enrollment {
  id: number;
  userId?: number;
  courseId: number;
  courseTitle: string;
  courseSlug: string;
  courseThumbnail?: string;
  courseCode?: string;
  semesterName?: string;
  enrolledAt: string;
  expiresAt?: string;
  status: string;
  progressPercent: number;
  lastLessonId?: number;
  lastLessonTitle?: string;
  lastAccessedAt?: string;
  certificateId?: number;
  certificateNumber?: string;
}

export interface Certificate {
  id: number;
  certificateNumber: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  courseId: number;
  courseTitle: string;
  courseCode?: string;
  semesterName?: string;
  issuedAt?: string;
  createdAt?: string;
}

export interface CourseReview {
  id: number;
  courseId?: number;
  userId?: number;
  userFullName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content?: string;
  createdAt: string;
}

export interface LessonProgress {
  lessonId: number;
  isCompleted: boolean;
  watchTimeSeconds: number;
  lastPositionSeconds: number;
}

// === SHOP + E-COMMERCE TYPES ===

export type ProductCategory = 'Web Template' | 'Tools' | 'Software' | 'Accounts' | 'Ebook';

export type PriceRange = 'all' | 'under200' | '200to500' | 'above500';

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular';

export type ItemType = 'shop' | 'academy';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  /** Category-specific structured key-value pairs (e.g. Warranty Period, OS, Voltage) */
  specs?: ProductSpec[];
  /** Deployment / warranty instructions shown in Tab 3 */
  guidance?: string;
  isHot?: boolean;
  isNew?: boolean;
  stock: number;
  isFeatured?: boolean;
  soldCount?: number;
  createdAt?: string;
  tags?: string[];
  /** URL of the downloadable digital file (e.g. ebook, software zip) */
  fileUrl?: string;
}

// Unified cart item — works for both Shop products and Academy courses
export interface CartItem {
  id: string;           // unique cart item id (uuid)
  itemType: ItemType;   // 'shop' | 'academy'
  product: Product;     // used for shop items
  course?: Course;      // used for academy items
  quantity: number;
}

// Discount / Coupon code
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type DiscountStatus = 'ACTIVE' | 'EXPIRED' | 'DEPLETED' | 'INACTIVE';

export interface DiscountCode {
  id: string;
  code: string;                  // e.g. "SUMMER20"
  description?: string;
  discountType: DiscountType;   // 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number;         // e.g. 20 (=20%) or 50000 (=50,000 VND)
  maxUses: number;               // total uses allowed (e.g. 1 = one-time use)
  currentUses: number;           // how many times used so far
  minOrderValue?: number;        // minimum cart value to apply code
  maxDiscountAmount?: number;    // cap for percentage discounts (e.g. 100000 VND max)
  expiresAt?: string;            // ISO date string
  isActive: boolean;
  createdAt: string;
}

// User's record of having used a discount code
export interface DiscountUsage {
  discountCodeId: string;
  usedAt: string;
  orderId?: string;
}

// Order status
export type OrderStatus = 'Pending' | 'Completed' | 'Failed' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PENDING';

export interface OrderItem {
  id: string;             // unique order item id
  itemType: ItemType;     // 'shop' | 'academy'
  productId?: string;     // for shop items
  courseId?: number;      // for academy items
  name: string;
  thumbnail: string;
  price: number;          // price at time of purchase (after any product discount)
  quantity: number;       // always 1 for academy items
  category: string;       // category name or course category
}

export interface Order {
  id: string;                   // backend numeric ID for status updates
  orderCode?: string;           // display code (ORD-xxxxxx)
  items: OrderItem[];
  subtotal: number;              // before discount
  discountAmount: number;       // amount deducted by discount code
  discountCode?: string;        // code used
  total: number;                // final amount paid
  status: OrderStatus;
  buyerInfo: BuyerInfo;
  createdAt: string;            // ISO date
  completedAt?: string;         // ISO date when payment completed
}

export interface BuyerInfo {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

// === MUSIC TYPES ===

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds?: number;
  audioUrl: string;
  coverImage: string;
  localPath?: string;
  fileSize?: number;
  active?: boolean;
  createdAt?: string;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  coverUrl?: string;
  userId?: number;
  isPublic: boolean;
  user?: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  trackCount: number;
  tracks?: Array<{
    id: number;
    title: string;
    artist: string;
    audioUrl?: string | null;
    coverImage?: string | null;
    durationSeconds?: number | null;
    localPath?: string | null;
    createdAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistSummary {
  id: number;
  name: string;
  description?: string;
  coverUrl?: string;
  userId?: number;
  isPublic: boolean;
  user?: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  trackCount: number;
  tracks?: Array<{
    id: number;
    title: string;
    artist: string;
    coverImage?: string | null;
    durationSeconds?: number | null;
  }>;
  createdAt: string;
}

// === SOCIAL TYPES ===
export * from './social';
