/**
 * EXP_Hub — Seed Script
 *
 * Creates sample categories, tags, and snippets for development/testing.
 * Run: npx tsx prisma/seed.exp-hub.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EXP_Hub...');

  // ─── Categories ────────────────────────────────────────────────────────────

  const nodejsCat = await prisma.snippetCategory.upsert({
    where: { slug: 'nodejs' },
    update: {},
    create: { name: 'Node.js', slug: 'nodejs', sortOrder: 1 },
  });
  const javaCat = await prisma.snippetCategory.upsert({
    where: { slug: 'java' },
    update: {},
    create: { name: 'Java', slug: 'java', sortOrder: 2 },
  });
  const sqlCat = await prisma.snippetCategory.upsert({
    where: { slug: 'sql' },
    update: {},
    create: { name: 'SQL', slug: 'sql', sortOrder: 3 },
  });

  const nodejsAuth = await prisma.snippetCategory.upsert({
    where: { slug: 'nodejs-auth' },
    update: {},
    create: { name: 'Auth', slug: 'nodejs-auth', parentId: nodejsCat.id, sortOrder: 1 },
  });
  const nodejsDatabase = await prisma.snippetCategory.upsert({
    where: { slug: 'nodejs-database' },
    update: {},
    create: { name: 'Database', slug: 'nodejs-database', parentId: nodejsCat.id, sortOrder: 2 },
  });
  await prisma.snippetCategory.upsert({
    where: { slug: 'nodejs-utils' },
    update: {},
    create: { name: 'Utils', slug: 'nodejs-utils', parentId: nodejsCat.id, sortOrder: 3 },
  });
  await prisma.snippetCategory.upsert({
    where: { slug: 'java-core' },
    update: {},
    create: { name: 'Core', slug: 'java-core', parentId: javaCat.id, sortOrder: 1 },
  });
  await prisma.snippetCategory.upsert({
    where: { slug: 'java-spring' },
    update: {},
    create: { name: 'Spring', slug: 'java-spring', parentId: javaCat.id, sortOrder: 2 },
  });
  await prisma.snippetCategory.upsert({
    where: { slug: 'sql-queries' },
    update: {},
    create: { name: 'Queries', slug: 'sql-queries', parentId: sqlCat.id, sortOrder: 1 },
  });
  await prisma.snippetCategory.upsert({
    where: { slug: 'sql-schemas' },
    update: {},
    create: { name: 'Schemas', slug: 'sql-schemas', parentId: sqlCat.id, sortOrder: 2 },
  });

  console.log('Categories created');

  // ─── Tags ──────────────────────────────────────────────────────────────────

  const tagData = [
    { name: 'Auth', slug: 'auth' },
    { name: 'Security', slug: 'security' },
    { name: 'JWT', slug: 'jwt' },
    { name: 'API', slug: 'api' },
    { name: 'Database', slug: 'database' },
    { name: 'Validation', slug: 'validation' },
    { name: 'Async', slug: 'async' },
    { name: 'Error Handling', slug: 'error-handling' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Middleware', slug: 'middleware' },
  ];

  const tags: Record<string, number> = {};
  for (const t of tagData) {
    const tag = await prisma.snippetTag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
    tags[t.slug] = tag.id;
  }

  console.log('Tags created');

  // ─── Snippets ──────────────────────────────────────────────────────────────

  const jwtCode = `const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;`;

  const rateLimitCode = `const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});

app.use('/api', apiLimiter);`;

  const prismaPoolCode = `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10'
    }
  }
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;`;

  const asyncHandlerCode = `const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
}));`;

  const streamCollectorsCode = `import java.util.*;
import java.util.stream.*;

List<Product> products = getProducts();

// Group by category
Map<String, List<Product>> byCategory = products.stream()
    .collect(Collectors.groupingBy(Product::getCategory));

// Count occurrences
Map<String, Long> categoryCount = products.stream()
    .collect(Collectors.groupingBy(Product::getCategory, Collectors.counting()));

// Sum by category
Map<String, Double> totalByCategory = products.stream()
    .collect(Collectors.groupingBy(Product::getCategory, Collectors.summingDouble(Product::getPrice)));`;

  const cteCode = `-- Recursive CTE
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, 0 AS depth
    FROM categories
    WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.name, c.parent_id, ct.depth + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY depth, name;

-- CTE with aggregation
WITH monthly_sales AS (
    SELECT DATE_TRUNC('month', created_at) AS month,
           SUM(amount) AS total_sales
    FROM orders
    GROUP BY DATE_TRUNC('month', created_at)
)
SELECT * FROM monthly_sales ORDER BY month;`;

  const windowFunctionsCode = `-- Running total
SELECT order_date, amount,
    SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;

-- Rank within groups
SELECT department, name, salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
FROM employees;

-- Moving average
SELECT sale_date, daily_sales,
    AVG(daily_sales) OVER (
        ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_avg
FROM daily_sales;`;

  const jsonFunctionsCode = `-- Extract from JSON
SELECT data->>'name' AS name,
       data->'address'->>'city' AS city
FROM products;

-- JSON aggregation
SELECT category,
    json_agg(json_build_object('id', id, 'name', name)) AS products
FROM products GROUP BY category;

-- JSONB indexing
CREATE INDEX idx_metadata ON products USING GIN (metadata);
SELECT * FROM products WHERE metadata @> '{"featured": true}';`;

  const envValidatorCode = `interface EnvSchema {
  NODE_ENV: 'development' | 'production';
  PORT: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

const required = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'JWT_SECRET'];

function validateEnv() {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('Missing env vars:', missing);
    process.exit(1);
  }
  console.log('Environment validated');
}

validateEnv();`;

  const snippets = [
    {
      title: 'JWT Authentication Middleware',
      slug: 'jwt-auth-middleware',
      description: 'Express middleware for validating JWT tokens',
      language: 'javascript',
      categoryId: nodejsAuth.id,
      tagIds: [tags.jwt, tags.auth, tags.middleware],
      code: jwtCode,
    },
    {
      title: 'Express Rate Limiter',
      slug: 'express-rate-limiter',
      description: 'Protect API with per-IP rate limiting',
      language: 'javascript',
      categoryId: nodejsAuth.id,
      tagIds: [tags.security, tags.middleware],
      code: rateLimitCode,
    },
    {
      title: 'Prisma Connection Pool',
      slug: 'prisma-connection-pool',
      description: 'Configure Prisma with production-ready pooling',
      language: 'typescript',
      categoryId: nodejsDatabase.id,
      tagIds: [tags.database, tags.performance],
      code: prismaPoolCode,
    },
    {
      title: 'Async Error Handler',
      slug: 'async-error-handler',
      description: 'Wrapper to catch async errors in Express',
      language: 'javascript',
      categoryId: nodejsCat.id,
      tagIds: [tags.async, tags['error-handling']],
      code: asyncHandlerCode,
    },
    {
      title: 'Java Stream Collectors',
      slug: 'java-stream-collectors',
      description: 'Common Java Stream collector patterns',
      language: 'java',
      categoryId: javaCat.id,
      tagIds: [tags.api],
      code: streamCollectorsCode,
    },
    {
      title: 'Common Table Expression',
      slug: 'sql-common-table-expression',
      description: 'Using CTEs for complex queries',
      language: 'sql',
      categoryId: sqlCat.id,
      tagIds: [tags.database],
      code: cteCode,
    },
    {
      title: 'Window Functions',
      slug: 'sql-window-functions',
      description: 'SQL window functions for analytics',
      language: 'sql',
      categoryId: sqlCat.id,
      tagIds: [tags.database, tags.performance],
      code: windowFunctionsCode,
    },
    {
      title: 'PostgreSQL JSON Functions',
      slug: 'postgresql-json-functions',
      description: 'Working with JSON data in PostgreSQL',
      language: 'sql',
      categoryId: sqlCat.id,
      tagIds: [tags.database],
      code: jsonFunctionsCode,
    },
    {
      title: 'Environment Validator',
      slug: 'nodejs-env-validator',
      description: 'Validate required environment variables at startup',
      language: 'typescript',
      categoryId: nodejsCat.id,
      tagIds: [tags.validation, tags['error-handling']],
      code: envValidatorCode,
    },
  ];

  for (const s of snippets) {
    // Idempotent: re-running the seed repairs missing tag links and
    // versions on existing snippets (an earlier run created the
    // snippets but silently failed on the associations because the
    // Prisma client was generated from a drifted schema).
    const existing = await prisma.snippet.findUnique({ where: { slug: s.slug } });
    const snippet = existing ?? await prisma.snippet.create({
      data: {
        title: s.title,
        slug: s.slug,
        description: s.description,
        language: s.language,
        code: s.code,
        categoryId: s.categoryId,
        status: 'PUBLISHED',
      },
    });

    // Ensure tag associations via SnippetToTag (upsert = idempotent)
    for (const tagId of s.tagIds) {
      await prisma.snippetToTag.upsert({
        where: { snippetId_tagId: { snippetId: snippet.id, tagId } },
        update: {},
        create: { snippetId: snippet.id, tagId },
      });
    }

    // Ensure the initial version exists
    const versionCount = await prisma.snippetVersion.count({ where: { snippetId: snippet.id } });
    if (versionCount === 0) {
      await prisma.snippetVersion.create({
        data: { snippetId: snippet.id, code: s.code },
      });
    }

    console.log(`${existing ? 'Repaired' : 'Created'}: ${s.title}`);
  }

  console.log('\nSeed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
