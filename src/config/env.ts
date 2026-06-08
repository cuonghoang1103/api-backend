import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Redis
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: process.env.REDIS_PASSWORD || '',
  redisDb: parseInt(process.env.REDIS_DB || '0', 10),

  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  corsOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),

  // OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',

  // Admin
  adminEmails: (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean),
  adminUsername: process.env.ADMIN_USERNAME || 'admin',

  // File Upload
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSizeImages: parseInt(process.env.MAX_FILE_SIZE_IMAGES || '10485760', 10),
  maxFileSizeAudio: parseInt(process.env.MAX_FILE_SIZE_AUDIO || '104857600', 10),
  maxFileSizeVideo: parseInt(process.env.MAX_FILE_SIZE_VIDEO || '524288000', 10),
  maxFileSizeDocument: parseInt(process.env.MAX_FILE_SIZE_DOCUMENT || '52428800', 10),

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Cookie
  cookieSecret: process.env.COOKIE_SECRET || 'default-cookie-secret',

  // AI
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  aiChatModel: process.env.AI_CHAT_MODEL || 'gemini-2.0-flash-lite',
  aiEmbeddingModel: process.env.AI_EMBEDDING_MODEL || 'gemini-embedding-002',
  aiEmbeddingDimensions: parseInt(process.env.AI_EMBEDDING_DIMENSIONS || '768', 10),
  aiMaxTokens: parseInt(process.env.AI_MAX_TOKENS || '2048', 10),
  aiTemperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  aiChunkSize: parseInt(process.env.AI_CHUNK_SIZE || '1000', 10),
  aiChunkOverlap: parseInt(process.env.AI_CHUNK_OVERLAP || '200', 10),
  aiSimilarityThreshold: parseFloat(process.env.AI_SIMILARITY_THRESHOLD || '0.7'),

  // Email
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || 'noreply@cuonghoangdev.com',

  // Contact
  contactAdminEmail: process.env.CONTACT_ADMIN_EMAIL || '',
} as const;
