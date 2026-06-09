export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Nexus Dashboard — React Admin Template',
    slug: 'nexus-dashboard-react-admin-template',
    price: 499000,
    originalPrice: 799000,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    category: 'Web Template' as const,
    rating: 4.8,
    reviewCount: 124,
    description:
      'Nexus Dashboard is a premium React admin template built with Tailwind CSS, featuring 60+ pre-built components, dark mode support, and 15+ complete page layouts. Perfect for SaaS applications, e-commerce backends, and analytics dashboards.',
    features: [
      '60+ React components',
      '15+ page layouts',
      'Dark & light mode',
      'Responsive design',
      'Chart.js & Recharts integration',
      'JWT authentication ready',
      'Figma source file included',
      'Lifetime updates',
    ],
    specs: [
      { label: 'Framework', value: 'React 18 + Vite' },
      { label: 'Styling', value: 'Tailwind CSS 3.4' },
      { label: 'Components', value: '60+ Pre-built' },
      { label: 'Page Layouts', value: '15+ Complete pages' },
      { label: 'Charts', value: 'Chart.js, Recharts' },
      { label: 'Auth', value: 'JWT ready' },
      { label: 'Figma', value: 'Source file included' },
      { label: 'Updates', value: 'Lifetime free' },
    ],
    guidance: `## Hướng dẫn cài đặt

1. **Giải nén** file ZIP đã tải về
2. Chạy \`npm install\` để cài dependencies
3. Copy file \`.env.example\` thành \`.env\` và điền API keys
4. Chạy \`npm run dev\` để khởi động dev server

## Bảo hành

- **30 ngày** hoàn tiền nếu template có lỗi kỹ thuật
- Hỗ trợ qua email trong vòng **6 tháng** kể từ ngày mua
- Không bao gồm tùy chỉnh riêng`,
    isHot: true,
    isNew: false,
    stock: 50,
    isFeatured: true,
    soldCount: 892,
    createdAt: '2024-11-15T10:00:00Z',
    tags: ['React', 'Tailwind', 'Admin', 'Dashboard'],
  },
  {
    id: '2',
    name: 'SEO Master Tool — All-in-One SEO Suite',
    slug: 'seo-master-tool',
    price: 299000,
    thumbnail: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&q=80',
    category: 'Tools' as const,
    rating: 4.6,
    reviewCount: 89,
    description:
      'A powerful CLI tool that automates SEO audits, keyword research, and backlink analysis. Built with Node.js, it integrates with Google Search Console, Ahrefs, and SEMrush APIs to generate comprehensive SEO reports.',
    features: [
      'Automated SEO audits',
      'Keyword research automation',
      'Backlink analysis',
      'Google Search Console integration',
      'Custom report generation',
      'API key management',
      'Cross-platform CLI',
    ],
    specs: [
      { label: 'Runtime', value: 'Node.js 18+' },
      { label: 'Package Manager', value: 'npm, yarn' },
      { label: 'Supported OS', value: 'Windows, macOS, Linux' },
      { label: 'Architecture', value: 'CLI + REST API' },
      { label: 'Latest Version', value: 'v2.4.1' },
      { label: 'Hardware Requirements', value: '2GB RAM, 500MB disk' },
    ],
    guidance: `## Hướng dẫn cài đặt

\`\`\`bash
npm install -g seo-master-tool
seo-master init --api-key YOUR_KEY
\`\`\`

## Yêu cầu hệ thống

- Node.js 18 trở lên
- API keys từ Google Search Console, Ahrefs hoặc SEMrush

## Bảo hành

- Hỗ trợ cài đặt qua remote desktop
- Cập nhật miễn phí trong **3 tháng**`,
    isHot: true,
    isNew: true,
    stock: 999,
    isFeatured: true,
    soldCount: 456,
    createdAt: '2024-12-01T10:00:00Z',
    tags: ['SEO', 'Node.js', 'CLI', 'Automation'],
  },
  {
    id: '3',
    name: 'DevFlow IDE Plugin Pack',
    slug: 'devflow-ide-plugin-pack',
    price: 199000,
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80',
    category: 'Software' as const,
    rating: 4.9,
    reviewCount: 234,
    description:
      'A curated collection of IDE plugins for VS Code and JetBrains IDEs that boosts developer productivity. Includes smart code snippets, AI-powered completions, git helpers, and productivity timers.',
    features: [
      '500+ code snippets',
      'AI completion engine',
      'Git integration suite',
      'Pomodoro timer',
      'Multi-cursor helpers',
      'Works with VS Code & WebStorm',
    ],
    specs: [
      { label: 'Supported IDEs', value: 'VS Code, WebStorm, IntelliJ, PyCharm' },
      { label: 'Latest Version', value: 'v3.1.0' },
      { label: 'Snippets', value: '500+ across 20 languages' },
      { label: 'AI Engine', value: 'Local + OpenAI fallback' },
      { label: 'Supported OS', value: 'Windows, macOS, Linux' },
      { label: 'License', value: 'Perpetual, 3 devices' },
    ],
    guidance: `## Cài đặt

1. Mở VS Code → Extensions → Install from VSIX
2. Hoặc JetBrains: Settings → Plugins → Install from disk
3. Khởi động lại IDE sau khi cài

## Kích hoạt license

Nhập license key được gửi qua email sau khi thanh toán.

## Bảo hành

- Đổi license sang thiết bị mới: miễn phí 1 lần/năm
- Hoàn tiền trong 7 ngày nếu plugin không hoạt động`,
    isHot: false,
    isNew: false,
    stock: 999,
    isFeatured: false,
    soldCount: 1203,
    createdAt: '2024-09-20T10:00:00Z',
    tags: ['VS Code', 'IDE', 'Productivity', 'Plugin'],
  },
  {
    id: '4',
    name: 'ChatGPT Pro — 1 Year Subscription',
    slug: 'chatgpt-pro-1-year-subscription',
    price: 599000,
    originalPrice: 900000,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    category: 'Accounts' as const,
    rating: 4.7,
    reviewCount: 567,
    description:
      'Pre-activated ChatGPT Pro account with 1-year subscription. Includes access to GPT-4, DALL-E 3, Advanced Data Analysis, and priority access during peak hours.',
    features: [
      'GPT-4 access',
      'DALL-E 3 image generation',
      'Advanced Data Analysis',
      'Priority server access',
      'Instant delivery via email',
      'Account replacement guarantee',
    ],
    specs: [
      { label: 'Warranty Period', value: '12 months from delivery' },
      { label: 'Login Method', value: 'Email + Password (shared)' },
      { label: 'Validity', value: '12 months active' },
      { label: 'Access', value: 'GPT-4, DALL-E 3, Advanced Data Analysis' },
      { label: 'Delivery', value: 'Via email within 2 hours' },
      { label: 'Replacement', value: 'Free if banned within 24h' },
    ],
    guidance: `## Thông tin giao hàng

Tài khoản sẽ được gửi qua **email đăng ký** trong vòng **2 giờ** sau khi thanh toán.

## Hướng dẫn đăng nhập

1. Truy cập chat.openai.com
2. Đăng nhập bằng email và mật khẩu được cung cấp
3. **Không thay đổi** email/password để giữ bảo hành

## Chính sách bảo hành

- **24 giờ đầu**: Đổi tài khoản mới miễn phí nếu bị ban
- **12 tháng**: Hỗ trợ khôi phục quyền truy cập nếu tài khoản có vấn đề
- **Không hoàn tiền** sau khi nhận được tài khoản`,
    isHot: true,
    isNew: false,
    stock: 12,
    isFeatured: true,
    soldCount: 3421,
    createdAt: '2024-10-05T10:00:00Z',
    tags: ['AI', 'ChatGPT', 'Subscription', 'Account'],
  },
  {
    id: '5',
    name: 'System Design Mastery — Ebook Bundle',
    slug: 'system-design-mastery-ebook',
    price: 149000,
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80',
    category: 'Ebook' as const,
    rating: 4.9,
    reviewCount: 312,
    description:
      'A comprehensive 3-book bundle covering system design fundamentals, distributed systems patterns, and real-world architecture case studies from top tech companies like Netflix, Uber, and Amazon.',
    features: [
      '500+ system design diagrams',
      'Real interview questions',
      'Step-by-step solutions',
      'PDF + EPUB + MOBI formats',
      'Updated for 2024',
      'Free bonus chapter',
    ],
    specs: [
      { label: 'Book Count', value: '3 volumes' },
      { label: 'Format', value: 'PDF, EPUB, MOBI' },
      { label: 'Diagrams', value: '500+' },
      { label: 'Language', value: 'English' },
      { label: 'Last Updated', value: '2024 Edition' },
      { label: 'Bonus', value: 'Free chapter download' },
    ],
    guidance: `## Nội dung gói

Bao gồm 3 cuốn sách dạng PDF/EPUB/MOBI:
- **Volume 1**: System Design Fundamentals
- **Volume 2**: Distributed Systems Patterns
- **Volume 3**: Real-world Architecture Case Studies

## Bảo hành

- Hoàn tiền trong **7 ngày** nếu file bị lỗi
- Không hỗ trợ đổi format sau khi giao`,
    isHot: false,
    isNew: true,
    stock: 999,
    isFeatured: false,
    soldCount: 2156,
    createdAt: '2025-01-10T10:00:00Z',
    tags: ['System Design', 'Ebook', 'Architecture', 'Backend'],
  },
  {
    id: '6',
    name: 'SaaS Landing Page Template',
    slug: 'saas-landing-page-template',
    price: 349000,
    originalPrice: 499000,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    category: 'Web Template' as const,
    rating: 4.5,
    reviewCount: 67,
    description:
      'A conversion-optimized landing page template designed for SaaS products. Features smooth animations, pricing tables, feature sections, testimonials, and FAQ blocks.',
    features: [
      'Conversion-optimized layout',
      'Smooth Framer Motion animations',
      'Pricing table included',
      'Testimonial section',
      'FAQ accordion',
      'Mobile-first responsive',
      'Figma source included',
    ],
    specs: [
      { label: 'Framework', value: 'Next.js 14 + Tailwind' },
      { label: 'Animations', value: 'Framer Motion' },
      { label: 'Responsive', value: 'Mobile-first' },
      { label: 'Figma Source', value: 'Included' },
      { label: 'Sections', value: 'Hero, Features, Pricing, FAQ, Testimonials' },
      { label: 'License', value: 'Single project' },
    ],
    guidance: `## Cài đặt nhanh

1. Clone repository
2. \`npm install && npm run dev\`
3. Thay đổi nội dung trong \`/content\`

## Bảo hành

- Hoàn tiền trong 14 ngày
- Hỗ trợ cài đặt qua Zoom`,
    isHot: false,
    isNew: false,
    stock: 200,
    isFeatured: false,
    soldCount: 445,
    createdAt: '2024-08-15T10:00:00Z',
    tags: ['Landing Page', 'SaaS', 'Conversion', 'Template'],
  },
  {
    id: '7',
    name: 'API Debugger Pro — Postman Alternative',
    slug: 'api-debugger-pro',
    price: 399000,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80',
    category: 'Software' as const,
    rating: 4.8,
    reviewCount: 178,
    description:
      'A lightweight, cross-platform API debugging tool with a beautiful interface. Supports REST, GraphQL, WebSocket, and gRPC. Features collaborative workspaces and team sync.',
    features: [
      'REST, GraphQL, WebSocket, gRPC',
      'Collaborative workspaces',
      'Team sync & sharing',
      'Environment variables',
      'Code generation',
      'Dark mode native',
      'Offline mode',
    ],
    specs: [
      { label: 'Supported Protocols', value: 'REST, GraphQL, WebSocket, gRPC' },
      { label: 'License', value: 'Perpetual, 1 device' },
      { label: 'Latest Version', value: 'v1.8.0' },
      { label: 'Supported OS', value: 'Windows, macOS, Linux' },
      { label: 'Workspace', value: 'Collaborative, team sync' },
    ],
    guidance: `## Cài đặt

Tải file cài đặt tương ứng với hệ điều hành từ link được gửi qua email.

## Kích hoạt

Nhập license key từ email vào mục Help → Activate License.

## Bảo hành

- Cập nhật miễn phí trong **1 năm**
- Hoàn tiền trong 30 ngày`,
    isHot: true,
    isNew: true,
    stock: 300,
    isFeatured: true,
    soldCount: 789,
    createdAt: '2025-01-20T10:00:00Z',
    tags: ['API', 'Developer Tools', 'Software', 'Debugging'],
  },
  {
    id: '8',
    name: 'Midnight Portfolio — Figma Template',
    slug: 'midnight-portfolio-figma-template',
    price: 99000,
    thumbnail: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=600&q=80',
    category: 'Web Template' as const,
    rating: 4.4,
    reviewCount: 45,
    description:
      'A sleek, dark-themed portfolio template for developers and designers. Includes 8 sections: hero, about, skills, projects, experience, testimonials, blog, and contact.',
    features: [
      '8 pre-built sections',
      'Dark mode default',
      'Easy customization',
      'Responsive breakpoints',
      'Figma + HTML export',
      'Case study layouts',
    ],
    specs: [
      { label: 'Format', value: 'Figma + HTML export' },
      { label: 'Sections', value: '8 pre-built sections' },
      { label: 'Theme', value: 'Dark mode default' },
      { label: 'Responsive', value: 'Desktop, tablet, mobile' },
    ],
    guidance: `## Cách sử dụng

Mở file Figma bằng Figma app hoặc trình duyệt. Export sang HTML/CSS nếu cần.

## Bảo hành

- Hoàn tiền trong 7 ngày nếu template lỗi
- Không hỗ trợ tùy chỉnh riêng`,
    isHot: false,
    isNew: false,
    stock: 500,
    isFeatured: false,
    soldCount: 234,
    createdAt: '2024-07-01T10:00:00Z',
    tags: ['Portfolio', 'Figma', 'Developer', 'Template'],
  },
  {
    id: '9',
    name: 'Claude AI — 6 Month Team Plan',
    slug: 'claude-ai-6-month-team-plan',
    price: 449000,
    originalPrice: 699000,
    thumbnail: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=600&q=80',
    category: 'Accounts' as const,
    rating: 4.6,
    reviewCount: 289,
    description:
      'Access to Claude AI Team workspace for 6 months. Includes higher rate limits, priority access to new features, and team collaboration features.',
    features: [
      'Team workspace access',
      '5x higher rate limits',
      'Priority feature access',
      'Team collaboration',
      'Admin dashboard',
      'Instant email delivery',
    ],
    specs: [
      { label: 'AI Model', value: 'Claude Opus/Sonnet/Haiku' },
      { label: 'Team Seats', value: 'Up to 5 members' },
      { label: 'Rate Limit', value: '5x standard' },
      { label: 'Validity', value: '6 months' },
      { label: 'Access', value: 'Team workspace, Admin dashboard' },
      { label: 'Delivery', value: 'Email within 24 hours' },
    ],
    guidance: `## Thông tin giao hàng

Workspace access sẽ được gửi qua **email** trong vòng **24 giờ** sau thanh toán.

## Hướng dẫn đăng nhập

1. Truy cập claude.ai
2. Chọn "Team" workspace
3. Sử dụng credentials được cung cấp

## Bảo hành

- **7 ngày** đầu: Đổi mới nếu workspace không hoạt động
- Không hoàn tiền sau khi đã truy cập workspace`,
    isHot: false,
    isNew: false,
    stock: 25,
    isFeatured: false,
    soldCount: 1102,
    createdAt: '2024-11-01T10:00:00Z',
    tags: ['Claude', 'AI', 'Team', 'Account'],
  },
  {
    id: '10',
    name: 'Modern CSS Masterclass — Ebook',
    slug: 'modern-css-masterclass-ebook',
    price: 199000,
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80',
    category: 'Ebook' as const,
    rating: 4.7,
    reviewCount: 156,
    description:
      'A deep-dive into modern CSS: Grid, Flexbox, Container Queries, Cascade Layers, :has(), View Transitions, and more. 300+ pages with real-world examples and exercises.',
    features: [
      '300+ pages of content',
      '50+ hands-on exercises',
      'Modern CSS features covered',
      'PDF + EPUB formats',
      'Source code included',
      'Updated for 2025',
    ],
    specs: [
      { label: 'Format', value: 'PDF, EPUB' },
      { label: 'Pages', value: '300+ pages' },
      { label: 'Exercises', value: '50+ hands-on' },
      { label: 'Last Updated', value: '2025 Edition' },
    ],
    guidance: `## Nội dung giao

File PDF/EPUB sẽ được gửi qua email trong vòng **1 giờ** sau thanh toán.

## Bảo hành

- Hoàn tiền trong 7 ngày nếu file không mở được
- Không đổi format sau khi giao`,
    isHot: false,
    isNew: true,
    stock: 999,
    isFeatured: false,
    soldCount: 876,
    createdAt: '2025-02-01T10:00:00Z',
    tags: ['CSS', 'Ebook', 'Frontend', 'Web Development'],
  },
  {
    id: '11',
    name: 'Logify — Real-time Log Analyzer',
    slug: 'logify-log-analyzer',
    price: 249000,
    thumbnail: 'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?w=600&q=80',
    category: 'Tools' as const,
    rating: 4.3,
    reviewCount: 58,
    description:
      'A powerful log analysis tool that parses, filters, and visualizes application logs in real-time. Supports JSON, Apache, Nginx, and custom log formats.',
    features: [
      'Real-time log streaming',
      'Multi-format parsing',
      'Custom filter rules',
      'Visual dashboard',
      'Alert system',
      'Export to CSV/JSON',
    ],
    specs: [
      { label: 'Runtime', value: 'Go 1.21+' },
      { label: 'Supported Formats', value: 'JSON, Apache, Nginx, Syslog, Custom' },
      { label: 'Supported OS', value: 'Windows, macOS, Linux (x86 + ARM)' },
      { label: 'Latest Version', value: 'v1.2.0' },
      { label: 'Hardware Requirements', value: '1GB RAM, 100MB disk' },
    ],
    guidance: `## Cài đặt nhanh

\`\`\`bash
# macOS (Homebrew)
brew install logify

# Linux
curl -sSL https://get.logify.io | sh

# Windows
scoop install logify
\`\`\`

## Bảo hành

- Hỗ trợ cài đặt trong 30 ngày
- Cập nhật miễn phí trong 6 tháng`,
    isHot: false,
    isNew: false,
    stock: 400,
    isFeatured: false,
    soldCount: 312,
    createdAt: '2024-06-15T10:00:00Z',
    tags: ['DevOps', 'Log Analysis', 'Monitoring', 'Tools'],
  },
  {
    id: '12',
    name: 'Stripe Billing Toolkit',
    slug: 'stripe-billing-toolkit',
    price: 349000,
    originalPrice: 499000,
    thumbnail: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&q=80',
    category: 'Software' as const,
    rating: 4.8,
    reviewCount: 93,
    description:
      'Complete Stripe billing integration toolkit for SaaS. Includes subscription management, invoice handling, usage-based billing, and dunning automation scripts.',
    features: [
      'Subscription management',
      'Usage-based billing',
      'Invoice automation',
      'Dunning sequences',
      'Webhook handlers',
      'TypeScript source code',
      'Postman collection included',
    ],
    specs: [
      { label: 'Language', value: 'TypeScript + Node.js' },
      { label: 'Framework', value: 'Express / Next.js compatible' },
      { label: 'Latest Version', value: 'v2.0.3' },
      { label: 'Stripe Version', value: '2023+ API' },
      { label: 'Supported OS', value: 'Cross-platform (Node.js)' },
      { label: 'License', value: 'Perpetual, unlimited projects' },
    ],
    guidance: `## Cách sử dụng

1. Thêm toolkit vào project: \`npm install stripe-billing-toolkit\`
2. Import và cấu hình: \`import { StripeBilling } from 'stripe-billing-toolkit'\`
3. Đọc README.md trong file ZIP để biết chi tiết từng module

## Bảo hành

- **Hoàn tiền 30 ngày** nếu code không hoạt động theo mô tả
- Hỗ trợ tích hợp qua Discord trong **3 tháng**`,
    isHot: true,
    isNew: false,
    stock: 150,
    isFeatured: true,
    soldCount: 634,
    createdAt: '2024-10-20T10:00:00Z',
    tags: ['Stripe', 'SaaS', 'Billing', 'Payments'],
  },
];

export const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'Web Template', label: 'Web Templates' },
  { value: 'Tools', label: 'Tools & Scripts' },
  { value: 'Software', label: 'Software' },
  { value: 'Accounts', label: 'Digital Accounts' },
  { value: 'Ebook', label: 'Ebooks' },
] as const;

export const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: 'under200', label: 'Under 200k' },
  { value: '200to500', label: '200k — 500k' },
  { value: 'above500', label: 'Above 500k' },
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'popular', label: 'Most Popular' },
] as const;
