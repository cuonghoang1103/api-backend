import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Create default roles ───────────────────────────
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ROLE_ADMIN' },
    update: {},
    create: { name: 'ROLE_ADMIN' },
  });

  const roleUser = await prisma.role.upsert({
    where: { name: 'ROLE_USER' },
    update: {},
    create: { name: 'ROLE_USER' },
  });

  console.log('✅ Roles created');

  // ─── Create admin user ─────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'cuonghoang1103@gmail.com',
      fullName: 'Cuong Hoang Dev',
      password: adminPassword,
      roles: {
        create: [{ roleId: roleAdmin.id }],
      },
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // ─── Seed AI Config ────────────────────────────────
  const aiConfigs = [
    { configKey: 'embedding_model', configValue: 'gemini-embedding-002', description: 'Embedding model' },
    { configKey: 'chat_model', configValue: 'gemini-2.0-flash-lite', description: 'Chat model' },
    { configKey: 'max_tokens', configValue: '2048', description: 'Max tokens per response' },
    { configKey: 'temperature', configValue: '0.7', description: 'AI temperature (0-1)' },
    { configKey: 'chunk_size', configValue: '1000', description: 'Document chunk size' },
    { configKey: 'chunk_overlap', configValue: '200', description: 'Chunk overlap' },
    { configKey: 'similarity_threshold', configValue: '0.7', description: 'Min similarity threshold' },
  ];

  for (const config of aiConfigs) {
    await prisma.aiConfig.upsert({
      where: { configKey: config.configKey },
      update: {},
      create: config,
    });
  }
  console.log('✅ AI configs seeded');

  // ─── Seed AI Prompts ────────────────────────────────
  const aiPrompts = [
    {
      promptKey: 'system_default',
      promptTemplate: 'Bạn là trợ lý AI thông minh của CuongHoangDev Portfolio. Hãy trả lời bằng tiếng Việt, thân thiện và chính xác.',
      description: 'System prompt mặc định',
    },
    {
      promptKey: 'greeting',
      promptTemplate: 'Xin chào! Tôi là trợ lý AI của CuongHoangDev. Tôi có thể giúp gì cho bạn hôm nay?',
      description: 'Lời chào khi bắt đầu chat',
    },
    {
      promptKey: 'fallback',
      promptTemplate: 'Xin lỗi, tôi không có đủ thông tin để trả lời câu hỏi này. Bạn có thể hỏi tôi về portfolio, kỹ năng, dự án, hoặc các khóa học của CuongHoangDev nhé!',
      description: 'Tin nhắn khi không tìm thấy thông tin',
    },
  ];

  for (const prompt of aiPrompts) {
    await prisma.aiPrompt.upsert({
      where: { promptKey: prompt.promptKey },
      update: {},
      create: prompt,
    });
  }
  console.log('✅ AI prompts seeded');

  // ─── Seed Discount Codes ───────────────────────────
  const discountCodes = [
    { code: 'WELCOME10', discountType: 'PERCENT', discountValue: 10, minOrderAmount: 0, description: 'Welcome 10% off' },
    { code: 'SUMMER50', discountType: 'PERCENT', discountValue: 50, minOrderAmount: 200000, maxDiscountAmount: 100000, maxUses: 100, description: 'Summer sale 50% off' },
    { code: 'VIP20', discountType: 'PERCENT', discountValue: 20, minOrderAmount: 100000, maxDiscountAmount: 50000, description: 'VIP 20% off' },
    { code: 'FREESHIP', discountType: 'FIXED', discountValue: 30000, minOrderAmount: 100000, maxUses: 200, description: 'Free shipping' },
    { code: 'LAUNCH50K', discountType: 'FIXED', discountValue: 50000, minOrderAmount: 150000, maxUses: 50, description: 'Launch special 50k off' },
  ];

  for (const code of discountCodes) {
    await prisma.discountCode.upsert({
      where: { code: code.code },
      update: {},
      create: code,
    });
  }
  console.log('✅ Discount codes seeded');

  console.log('🌱 Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
