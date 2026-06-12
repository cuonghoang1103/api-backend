/**
 * Seed Knowledge Base — CuongMini-OS v2.0
 * ============================================================
 * Reads data/knowledge-base.json and upserts DocumentChunk records.
 * Run with: npx tsx data/seed-knowledge.ts
 * ============================================================
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface KBSection {
  id: string;
  documentType: string;
  title: string;
  questionContexts: string[];
  content: string;
}

interface KBFile {
  meta: { version: string; name: string; lastUpdated: string; author: string };
  sections: KBSection[];
}

const prisma = new PrismaClient();

async function seedKnowledge() {
  console.log('🧠 CuongMini-OS Knowledge Base — Seeding v2.0...\n');

  // ─── 1. Load JSON source-of-truth ─────────────────────────
  const kbPath = resolve(__dirname, 'knowledge-base.json');
  const raw = readFileSync(kbPath, 'utf-8');
  const kb: KBFile = JSON.parse(raw);

  console.log(`📦 Loaded knowledge base: ${kb.meta.name} (v${kb.meta.version})`);
  console.log(`   Sections: ${kb.sections.length}\n`);

  // ─── 2. Track which documentTypes we own ──────────────────
  const ownTypes = [...new Set(kb.sections.map((s) => s.documentType))];
  console.log(`🗂️  Document types: ${ownTypes.join(', ')}\n`);

  // ─── 3. Clear existing chunks for our types ───────────────
  for (const docType of ownTypes) {
    const { count } = await prisma.documentChunk.deleteMany({
      where: { documentType: docType },
    });
    console.log(`   🗑️  Cleared ${count} existing chunks for type: "${docType}"`);
  }

  // ─── 4. Insert new chunks ─────────────────────────────────
  let totalChunks = 0;
  for (const section of kb.sections) {
    // Combine title, question contexts, and content into one searchable chunk
    const contextsText = section.questionContexts.join(' | ');
    const chunkContent = [
      `TITLE: ${section.title}`,
      `QUESTIONS: ${contextsText}`,
      `KNOWLEDGE: ${section.content}`,
    ].join('\n\n');

    const metadata = {
      title: section.title,
      questionContexts: section.questionContexts,
      version: kb.meta.version,
    };

    await prisma.documentChunk.create({
      data: {
        documentId: section.id,
        documentType: section.documentType,
        chunkIndex: 0,
        content: chunkContent,
        metadata: metadata as object,
        // embedding intentionally omitted — vector search not yet active
      },
    });

    totalChunks++;
    console.log(`   ✅ [${section.documentType.padEnd(12)}] "${section.title}"`);
  }

  console.log(`\n🎉 Seed complete! ${totalChunks} chunks inserted across ${ownTypes.length} types.`);
  console.log('📡 Restart the backend to flush any in-memory cache.\n');
}

seedKnowledge()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
