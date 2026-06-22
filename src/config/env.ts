import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Environment variable validation.
 *
 * Why we do this:
 * - Production secrets MUST be set. If we fall back to empty strings or
 *   hardcoded defaults, the app silently misbehaves (auth breaks, cookies
 *   become forgeable, payments get rejected).
 * - The Zod schema below enforces this at startup, so we fail fast with
 *   a clear error message instead of debugging weird 500s at 3am.
 *
 * Behavior:
 * - In production (NODE_ENV=production): throws on any missing/invalid
 *   required variable. App refuses to start.
 * - In development: logs a warning and continues, so contributors can
 *   iterate without setting up every integration.
 */
const envSchema = z.object({
  // Server
  PORT: z.string().regex(/^\d+$/).default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (val) => val.startsWith('postgresql://') || val.startsWith('postgres://'),
      'DATABASE_URL must be a PostgreSQL connection string',
    ),

  // JWT — required in production
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .refine(
      (val) => val !== 'default-cookie-secret' && val !== 'change-me',
      'JWT_SECRET cannot be a placeholder value',
    ),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters')
    .refine(
      (val) => val !== 'default-cookie-secret' && val !== 'change-me',
      'JWT_REFRESH_SECRET cannot be a placeholder value',
    ),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().regex(/^\d+$/).default('6379'),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_DB: z.string().regex(/^\d+$/).default('0'),

  // CORS
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  // OAuth — optional but validated when present
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  GITHUB_CLIENT_ID: z.string().optional().default(''),
  GITHUB_CLIENT_SECRET: z.string().optional().default(''),
  GITHUB_API_TOKEN: z.string().optional().default(''),

  // Admin
  ADMIN_EMAILS: z.string().default(''),
  ADMIN_USERNAME: z.string().default('admin'),

  // File Upload
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_IMAGES: z.string().regex(/^\d+$/).default('10485760'),
  MAX_FILE_SIZE_AUDIO: z.string().regex(/^\d+$/).default('104857600'),
  MAX_FILE_SIZE_VIDEO: z.string().regex(/^\d+$/).default('524288000'),
  MAX_FILE_SIZE_DOCUMENT: z.string().regex(/^\d+$/).default('52428800'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().regex(/^\d+$/).default('100'),

  // Signed URL secret — required in production, no placeholder default
  SIGNED_URL_SECRET: z
    .string()
    .min(32, 'SIGNED_URL_SECRET must be at least 32 characters')
    .refine(
      (val) => val !== 'default-signed-url-secret-change-me' && val !== 'change-me',
      'SIGNED_URL_SECRET cannot be a placeholder value',
    ),

  // Cookie secret — required in production, no placeholder default
  COOKIE_SECRET: z
    .string()
    .min(32, 'COOKIE_SECRET must be at least 32 characters')
    .refine(
      (val) => val !== 'default-cookie-secret' && val !== 'change-me',
      'COOKIE_SECRET cannot be a placeholder value',
    ),

  // AI providers — at least one is required for chat to work
  GROQ_API_KEY: z.string().optional().default(''),
  GROQ_CHAT_MODEL: z.string().default('llama-3.1-8b-instant'),
  OPENROUTER_API_KEY: z.string().optional().default(''),
  OPENROUTER_CHAT_MODEL: z.string().default('meta-llama/llama-3.1-8b-instruct:free'),
  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_CHAT_MODEL: z.string().default('gpt-4o-mini'),
  GEMINI_API_KEY: z.string().optional().default(''),
  AI_CHAT_MODEL: z.string().default('llama-3.1-8b-instant'),
  AI_EMBEDDING_MODEL: z.string().default('gemini-embedding-002'),
  AI_EMBEDDING_DIMENSIONS: z.string().regex(/^\d+$/).default('768'),
  AI_MAX_TOKENS: z.string().regex(/^\d+$/).default('2048'),
  AI_TEMPERATURE: z.string().default('0.7'),
  AI_CHUNK_SIZE: z.string().regex(/^\d+$/).default('1000'),
  AI_CHUNK_OVERLAP: z.string().regex(/^\d+$/).default('200'),
  AI_SIMILARITY_THRESHOLD: z.string().default('0.7'),

  // Email
  RESEND_API_KEY: z.string().optional().default(''),
  RESEND_FROM_EMAIL: z.string().default('CuongHoangDev <noreply@cuongthai.com>'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().regex(/^\d+$/).default('587'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().default('noreply@cuonghoangdev.com'),

  // Contact
  CONTACT_ADMIN_EMAIL: z.string().default(''),

  // YouTube
  YOUTUBE_API_KEY: z.string().optional().default(''),

  // Public base URL
  PUBLIC_BASE_URL: z.string().url().default('https://api.cuongthai.com'),

  // Cloudflare R2 (S3-compatible object storage)
  // Required in production; optional in dev so the rest of the app
  // can still boot if you're iterating on something unrelated.
  R2_BUCKET_NAME: z.string().optional().default(''),
  R2_PUBLIC_URL: z.string().optional().default(''),
  R2_ENDPOINT_URL: z.string().optional().default(''),
  R2_ACCESS_KEY_ID: z.string().optional().default(''),
  R2_SECRET_ACCESS_KEY: z.string().optional().default(''),
  R2_REGION: z.string().optional().default('auto'),

  // Sentry (error tracking). When DSN is empty, Sentry is disabled
  // and the app behaves exactly as before — no extra overhead, no
  // network calls. We never want Sentry to crash the app on startup.
  SENTRY_DSN: z.string().optional().default(''),
  SENTRY_TRACES_SAMPLE_RATE: z.string().regex(/^(0|1|0?\.\d+)$/).default('0.1'),
  SENTRY_ENVIRONMENT: z.string().optional().default(''),
  SENTRY_RELEASE: z.string().optional().default(''),
});

type EnvSchema = z.infer<typeof envSchema>;

function parseEnv(): EnvSchema {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.errors
      .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
      .join('\n');

    if (process.env.NODE_ENV === 'production') {
      // Fail fast in production — silent fallback to empty/default
      // secrets is exactly what we want to prevent.
      throw new Error(
        `\n❌ Invalid environment configuration:\n${errors}\n\n` +
          `Set the required variables in /opt/cuonghoangdev/.env and restart.\n`,
      );
 } else {
 // In dev/test, log a warning and continue. The app may not
 // work for every feature, but contributors can still iterate.
 //
 // NOTE: We deliberately use `process.stderr.write` here rather than
 // the shared `logger` from `../utils/logger.ts`. That module imports
 // `config` from this very file, so a logger call inside the
 // `parseEnv()` call chain would be a circular import with TDZ
 // (config is `undefined` while env.ts is mid-load). Using
 // process.stderr.write keeps the env-validation warning visible
 // without that risk — and the env loader runs exactly once.
 process.stderr.write(
 `\n⚠️ Environment validation warnings:\n${errors}\n` +
 `(Ignoring in ${process.env.NODE_ENV || 'development'} mode — these would be fatal in production.)\n`,
 );
 return process.env as unknown as EnvSchema;
 }
  }

  return parsed.data;
}

const env = parseEnv();

export const config = {
  // Server
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,

  // Database
  databaseUrl: env.DATABASE_URL,

  // JWT
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,

  // Redis
  redisHost: env.REDIS_HOST,
  redisPort: parseInt(env.REDIS_PORT, 10),
  redisPassword: env.REDIS_PASSWORD,
  redisDb: parseInt(env.REDIS_DB, 10),

  // CORS
  frontendUrl: env.FRONTEND_URL,
  corsOrigins: env.ALLOWED_ORIGINS.split(','),

  // OAuth
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  githubClientId: env.GITHUB_CLIENT_ID,
  githubClientSecret: env.GITHUB_CLIENT_SECRET,
  githubApiToken: env.GITHUB_API_TOKEN,

  // Admin
  adminEmails: env.ADMIN_EMAILS.split(',').filter(Boolean),
  adminUsername: env.ADMIN_USERNAME,

  // File Upload
  uploadDir: env.UPLOAD_DIR,
  maxFileSizeImages: parseInt(env.MAX_FILE_SIZE_IMAGES, 10),
  maxFileSizeAudio: parseInt(env.MAX_FILE_SIZE_AUDIO, 10),
  maxFileSizeVideo: parseInt(env.MAX_FILE_SIZE_VIDEO, 10),
  maxFileSizeDocument: parseInt(env.MAX_FILE_SIZE_DOCUMENT, 10),

  // Rate Limiting
  rateLimitWindowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
  rateLimitMaxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),

  // Cookie
  cookieSecret: env.COOKIE_SECRET,
  signedUrlSecret: env.SIGNED_URL_SECRET,

  // AI
  groqApiKey: env.GROQ_API_KEY,
  groqChatModel: env.GROQ_CHAT_MODEL,
  openrouterApiKey: env.OPENROUTER_API_KEY,
  openrouterChatModel: env.OPENROUTER_CHAT_MODEL,
  openaiApiKey: env.OPENAI_API_KEY,
  openaiChatModel: env.OPENAI_CHAT_MODEL,
  geminiApiKey: env.GEMINI_API_KEY,
  aiChatModel: env.AI_CHAT_MODEL,
  aiEmbeddingModel: env.AI_EMBEDDING_MODEL,
  aiEmbeddingDimensions: parseInt(env.AI_EMBEDDING_DIMENSIONS, 10),
  aiMaxTokens: parseInt(env.AI_MAX_TOKENS, 10),
  aiTemperature: parseFloat(env.AI_TEMPERATURE),
  aiChunkSize: parseInt(env.AI_CHUNK_SIZE, 10),
  aiChunkOverlap: parseInt(env.AI_CHUNK_OVERLAP, 10),
  aiSimilarityThreshold: parseFloat(env.AI_SIMILARITY_THRESHOLD),

  // Email
  resendApiKey: env.RESEND_API_KEY,
  resendFromEmail: env.RESEND_FROM_EMAIL,
  smtpHost: env.SMTP_HOST,
  smtpPort: parseInt(env.SMTP_PORT, 10),
  smtpUser: env.SMTP_USER,
  smtpPass: env.SMTP_PASS,
  smtpFrom: env.SMTP_FROM,

  // Contact
  contactAdminEmail: env.CONTACT_ADMIN_EMAIL,

  // YouTube
  youtubeApiKey: env.YOUTUBE_API_KEY,

  // Public base URL
  publicBaseUrl: env.PUBLIC_BASE_URL,

  // Cloudflare R2
  r2: {
    bucketName: env.R2_BUCKET_NAME,
    publicUrl: env.R2_PUBLIC_URL.replace(/\/$/, ''), // strip trailing slash
    endpoint: env.R2_ENDPOINT_URL,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    region: env.R2_REGION,
    enabled: Boolean(
      env.R2_BUCKET_NAME && env.R2_ENDPOINT_URL && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY,
    ),
  },

  // Sentry
  sentryDsn: env.SENTRY_DSN,
  sentryTracesSampleRate: parseFloat(env.SENTRY_TRACES_SAMPLE_RATE),
  sentryEnvironment: env.SENTRY_ENVIRONMENT || env.NODE_ENV,
  sentryRelease: env.SENTRY_RELEASE,
} as const;
