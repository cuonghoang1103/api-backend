/**
 * seed.ja-extra.ts — ADDITIVE, IDEMPOTENT seed for the "My Language" module (Japanese, code 'ja').
 *
 * - Never modifies existing rows (find-before-create everywhere; re-run = all skipped).
 * - Does NOT touch the alphabet section (kana already seeded elsewhere).
 * - All UI-facing text (meanings, notes, translations, explanations) is in VIETNAMESE.
 * - Content: N5/N4 vocab (12 categories), grammar N5→N3, listening (verified YouTube),
 *   daily conversation (50), reading (10), Q&A (10).
 *
 * Run: npx tsx prisma/seed.ja-extra.ts
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const summary = {
  categories: { created: 0, skipped: 0 },
  words: { created: 0, skipped: 0 },
  pronunciations: { created: 0 },
  grammar: { created: 0, skipped: 0 },
  listening: { created: 0, skipped: 0 },
  conversation: { created: 0, skipped: 0 },
  reading: { created: 0, skipped: 0 },
  qna: { created: 0, skipped: 0 },
};

// ============================ TYPES ============================
interface WordSeed {
  word: string;
  meaningVi: string;
  exampleSentence: string;
  exampleMeaning: string;
  note: string;
  hiragana: string;
  romaji: string;
}

interface CategorySeed {
  name: string;
  icon: string;
  words: WordSeed[];
}

interface GrammarExample {
  sentence: string;
  pronunciation: string;
  meaningVi: string;
}

interface GrammarSeed {
  level: string; // "N5" | "N4" | "N3"
  title: string;
  structure: string;
  explanation: string; // HTML string (Vietnamese)
  examples: GrammarExample[];
  commonMistakes?: string;
  comparedWith?: string;
}

interface ListeningSeed {
  title: string;
  youtubeUrl: string;
  transcript: string;
  translation: string;
  questions: { question: string; answer: string }[];
}

interface ConversationSeed {
  question: string;
  answer: string;
  questionPronunciation: string;
  answerPronunciation: string;
  meaningVi: string;
  note: string;
}

interface ReadingSeed {
  title: string;
  content: string; // HTML string (Japanese)
  translation: string; // HTML string (Vietnamese)
}

interface QnaSeed {
  question: string;
  answer: string;
  pronunciation: string;
  meaningVi: string;
}

// ============================ SEED HELPERS ============================
async function seedVocab(languageId: number, categories: CategorySeed[]): Promise<void> {
  const maxCat = await prisma.langVocabCategory.aggregate({
    where: { languageId },
    _max: { order: true },
  });
  let catOrder = (maxCat._max.order ?? -1) + 1;

  for (const cat of categories) {
    let category = await prisma.langVocabCategory.findFirst({
      where: { languageId, name: cat.name },
    });
    if (category) {
      summary.categories.skipped++;
    } else {
      // A category can be absent for two reasons: a fresh database (create it),
      // or it was deliberately MERGED into the level-tagged catalogue and its
      // shell deleted. Recreating it in the second case resurrects the legacy
      // set on every deploy and duplicates every word it carried — which is
      // exactly what happened the night the merge ran. If most of its words
      // already live elsewhere in this language, it was merged, not missing.
      const already = await prisma.langVocabWord.count({
        where: { category: { languageId }, word: { in: cat.words.map((w) => w.word) } },
      });
      if (already >= Math.ceil(cat.words.length / 2)) {
        summary.categories.skipped++;
        continue;
      }
      category = await prisma.langVocabCategory.create({
        data: { languageId, name: cat.name, icon: cat.icon, order: catOrder++ },
      });
      summary.categories.created++;
    }
    for (let wi = 0; wi < cat.words.length; wi++) {
      const w = cat.words[wi];
      const existingWord = await prisma.langVocabWord.findFirst({
        where: { categoryId: category.id, word: w.word },
      });
      if (existingWord) {
        summary.words.skipped++;
        continue;
      }
      await prisma.langVocabWord.create({
        data: {
          categoryId: category.id,
          word: w.word,
          meaningVi: w.meaningVi,
          exampleSentence: w.exampleSentence,
          exampleMeaning: w.exampleMeaning,
          note: w.note,
          order: wi,
          pronunciations: {
            create: [
              { type: 'hiragana', value: w.hiragana, order: 0 },
              { type: 'romaji', value: w.romaji, order: 1 },
            ],
          },
        },
      });
      summary.words.created++;
      summary.pronunciations.created += 2;
    }
  }
}

async function seedGrammar(languageId: number, points: GrammarSeed[]): Promise<void> {
  const maxOrder = await prisma.langGrammarPoint.aggregate({
    where: { languageId },
    _max: { order: true },
  });
  let order = (maxOrder._max.order ?? -1) + 1;

  for (const g of points) {
    const existing = await prisma.langGrammarPoint.findFirst({
      where: { languageId, title: g.title },
    });
    if (existing) {
      summary.grammar.skipped++;
      continue;
    }
    await prisma.langGrammarPoint.create({
      data: {
        languageId,
        level: g.level,
        title: g.title,
        structure: g.structure,
        explanation: g.explanation as Prisma.InputJsonValue,
        examples: g.examples as unknown as Prisma.InputJsonValue,
        commonMistakes: g.commonMistakes ?? null,
        comparedWith: g.comparedWith ?? null,
        order: order++,
      },
    });
    summary.grammar.created++;
  }
}

async function seedListening(languageId: number, items: ListeningSeed[]): Promise<void> {
  const maxOrder = await prisma.langListeningItem.aggregate({
    where: { languageId },
    _max: { order: true },
  });
  let order = (maxOrder._max.order ?? -1) + 1;

  for (const item of items) {
    const existing = await prisma.langListeningItem.findFirst({
      where: { languageId, title: item.title },
    });
    if (existing) {
      summary.listening.skipped++;
      continue;
    }
    await prisma.langListeningItem.create({
      data: {
        languageId,
        title: item.title,
        sourceType: 'YOUTUBE',
        youtubeUrl: item.youtubeUrl,
        transcript: item.transcript,
        translation: item.translation,
        questions: item.questions as unknown as Prisma.InputJsonValue,
        order: order++,
      },
    });
    summary.listening.created++;
  }
}

async function seedConversation(languageId: number, items: ConversationSeed[]): Promise<void> {
  const maxOrder = await prisma.langConversationItem.aggregate({
    where: { languageId },
    _max: { order: true },
  });
  let order = (maxOrder._max.order ?? -1) + 1;

  for (const c of items) {
    const existing = await prisma.langConversationItem.findFirst({
      where: { languageId, question: c.question },
    });
    if (existing) {
      summary.conversation.skipped++;
      continue;
    }
    await prisma.langConversationItem.create({
      data: {
        languageId,
        question: c.question,
        answer: c.answer,
        questionPronunciation: c.questionPronunciation,
        answerPronunciation: c.answerPronunciation,
        meaningVi: c.meaningVi,
        note: c.note,
        order: order++,
      },
    });
    summary.conversation.created++;
  }
}

async function seedReading(languageId: number, items: ReadingSeed[]): Promise<void> {
  const maxOrder = await prisma.langReadingArticle.aggregate({
    where: { languageId },
    _max: { order: true },
  });
  let order = (maxOrder._max.order ?? -1) + 1;

  for (const r of items) {
    const existing = await prisma.langReadingArticle.findFirst({
      where: { languageId, title: r.title },
    });
    if (existing) {
      summary.reading.skipped++;
      continue;
    }
    await prisma.langReadingArticle.create({
      data: {
        languageId,
        title: r.title,
        type: 'TEXT',
        content: r.content as Prisma.InputJsonValue,
        translation: r.translation as Prisma.InputJsonValue,
        order: order++,
      },
    });
    summary.reading.created++;
  }
}

async function seedQna(languageId: number, items: QnaSeed[]): Promise<void> {
  const maxOrder = await prisma.langQnaItem.aggregate({
    where: { languageId },
    _max: { order: true },
  });
  let order = (maxOrder._max.order ?? -1) + 1;

  for (const q of items) {
    const existing = await prisma.langQnaItem.findFirst({
      where: { languageId, question: q.question },
    });
    if (existing) {
      summary.qna.skipped++;
      continue;
    }
    await prisma.langQnaItem.create({
      data: {
        languageId,
        question: q.question,
        answer: q.answer,
        pronunciation: q.pronunciation,
        meaningVi: q.meaningVi,
        order: order++,
      },
    });
    summary.qna.created++;
  }
}

// ============================ DATA: VOCAB ============================
const JA_VOCAB_PART1: CategorySeed[] = [
  {
    name: 'Giáo dục & Trường học',
    icon: '🎓',
    words: [
      { word: '学校', meaningVi: 'trường học', exampleSentence: '毎日学校へ行きます。', exampleMeaning: 'Hằng ngày tôi đến trường.', note: 'N5', hiragana: 'がっこう', romaji: 'gakkou' },
      { word: '先生', meaningVi: 'giáo viên, thầy/cô', exampleSentence: '田中先生は優しいです。', exampleMeaning: 'Thầy Tanaka rất hiền.', note: 'N5', hiragana: 'せんせい', romaji: 'sensei' },
      { word: '学生', meaningVi: 'học sinh, sinh viên', exampleSentence: '私は大学の学生です。', exampleMeaning: 'Tôi là sinh viên đại học.', note: 'N5', hiragana: 'がくせい', romaji: 'gakusei' },
      { word: '大学', meaningVi: 'trường đại học', exampleSentence: '兄は東京の大学で勉強しています。', exampleMeaning: 'Anh tôi đang học ở một trường đại học tại Tokyo.', note: 'N5', hiragana: 'だいがく', romaji: 'daigaku' },
      { word: '教室', meaningVi: 'phòng học, lớp học', exampleSentence: '教室に学生が二十人います。', exampleMeaning: 'Trong phòng học có 20 học sinh.', note: 'N5', hiragana: 'きょうしつ', romaji: 'kyoushitsu' },
      { word: '授業', meaningVi: 'giờ học, tiết học', exampleSentence: '授業は九時に始まります。', exampleMeaning: 'Giờ học bắt đầu lúc 9 giờ.', note: 'N5', hiragana: 'じゅぎょう', romaji: 'jugyou' },
      { word: '宿題', meaningVi: 'bài tập về nhà', exampleSentence: '今日は宿題がたくさんあります。', exampleMeaning: 'Hôm nay có nhiều bài tập về nhà.', note: 'N5', hiragana: 'しゅくだい', romaji: 'shukudai' },
      { word: '試験', meaningVi: 'kỳ thi, bài thi', exampleSentence: '来週日本語の試験があります。', exampleMeaning: 'Tuần sau có kỳ thi tiếng Nhật.', note: 'N5', hiragana: 'しけん', romaji: 'shiken' },
      { word: '質問', meaningVi: 'câu hỏi', exampleSentence: '質問があったら、手を挙げてください。', exampleMeaning: 'Nếu có câu hỏi thì hãy giơ tay.', note: 'N5', hiragana: 'しつもん', romaji: 'shitsumon' },
      { word: '答え', meaningVi: 'câu trả lời, đáp án', exampleSentence: 'この問題の答えが分かりません。', exampleMeaning: 'Tôi không biết đáp án của bài này.', note: 'N5', hiragana: 'こたえ', romaji: 'kotae' },
      { word: '辞書', meaningVi: 'từ điển', exampleSentence: '辞書で新しい言葉を調べます。', exampleMeaning: 'Tôi tra từ mới bằng từ điển.', note: 'N5', hiragana: 'じしょ', romaji: 'jisho' },
      { word: '鉛筆', meaningVi: 'bút chì', exampleSentence: '鉛筆で名前を書いてください。', exampleMeaning: 'Hãy viết tên bằng bút chì.', note: 'N5', hiragana: 'えんぴつ', romaji: 'enpitsu' },
      { word: '消しゴム', meaningVi: 'cục tẩy', exampleSentence: '消しゴムを貸してくれませんか。', exampleMeaning: 'Bạn cho tôi mượn cục tẩy được không?', note: 'N5', hiragana: 'けしごむ', romaji: 'keshigomu' },
      { word: '黒板', meaningVi: 'bảng đen', exampleSentence: '先生は黒板に漢字を書きました。', exampleMeaning: 'Thầy giáo đã viết chữ Hán lên bảng.', note: 'N5', hiragana: 'こくばん', romaji: 'kokuban' },
      { word: '図書館', meaningVi: 'thư viện', exampleSentence: '図書館で本を借りました。', exampleMeaning: 'Tôi đã mượn sách ở thư viện.', note: 'N5', hiragana: 'としょかん', romaji: 'toshokan' },
      { word: '勉強', meaningVi: 'việc học, học tập', exampleSentence: '毎晩二時間日本語を勉強します。', exampleMeaning: 'Mỗi tối tôi học tiếng Nhật hai tiếng.', note: 'N5', hiragana: 'べんきょう', romaji: 'benkyou' },
      { word: '練習', meaningVi: 'luyện tập', exampleSentence: '毎日漢字の練習をしています。', exampleMeaning: 'Hằng ngày tôi luyện viết chữ Hán.', note: 'N5', hiragana: 'れんしゅう', romaji: 'renshuu' },
      { word: '復習', meaningVi: 'ôn tập, ôn bài', exampleSentence: '家に帰ってから復習します。', exampleMeaning: 'Về nhà xong tôi sẽ ôn bài.', note: 'N4', hiragana: 'ふくしゅう', romaji: 'fukushuu' },
      { word: '予習', meaningVi: 'chuẩn bị bài trước', exampleSentence: '明日の授業の予習をしました。', exampleMeaning: 'Tôi đã chuẩn bị bài cho tiết học ngày mai.', note: 'N4', hiragana: 'よしゅう', romaji: 'yoshuu' },
      { word: '留学生', meaningVi: 'du học sinh', exampleSentence: 'このクラスには留学生が五人います。', exampleMeaning: 'Lớp này có 5 du học sinh.', note: 'N5', hiragana: 'りゅうがくせい', romaji: 'ryuugakusei' },
      { word: '専門', meaningVi: 'chuyên ngành, chuyên môn', exampleSentence: '専門は経済です。', exampleMeaning: 'Chuyên ngành của tôi là kinh tế.', note: 'N4', hiragana: 'せんもん', romaji: 'senmon' },
      { word: '成績', meaningVi: 'thành tích, điểm số', exampleSentence: '今学期の成績はよかったです。', exampleMeaning: 'Điểm số học kỳ này của tôi khá tốt.', note: 'N4', hiragana: 'せいせき', romaji: 'seiseki' },
      { word: '入学', meaningVi: 'nhập học', exampleSentence: '四月に大学に入学します。', exampleMeaning: 'Tháng 4 tôi sẽ nhập học đại học.', note: 'N4', hiragana: 'にゅうがく', romaji: 'nyuugaku' },
      { word: '卒業', meaningVi: 'tốt nghiệp', exampleSentence: '来年大学を卒業する予定です。', exampleMeaning: 'Dự định năm sau tôi tốt nghiệp đại học.', note: 'N4', hiragana: 'そつぎょう', romaji: 'sotsugyou' },
      { word: '教科書', meaningVi: 'sách giáo khoa', exampleSentence: '教科書の三十ページを開いてください。', exampleMeaning: 'Hãy mở trang 30 của sách giáo khoa.', note: 'N5', hiragana: 'きょうかしょ', romaji: 'kyoukasho' },
      { word: '夏休み', meaningVi: 'kỳ nghỉ hè', exampleSentence: '夏休みに国へ帰ります。', exampleMeaning: 'Kỳ nghỉ hè tôi sẽ về nước.', note: 'N5', hiragana: 'なつやすみ', romaji: 'natsuyasumi' },
    ],
  },
  {
    name: 'Sở thích',
    icon: '🎨',
    words: [
      { word: '趣味', meaningVi: 'sở thích', exampleSentence: '趣味は写真を撮ることです。', exampleMeaning: 'Sở thích của tôi là chụp ảnh.', note: 'N5', hiragana: 'しゅみ', romaji: 'shumi' },
      { word: '映画', meaningVi: 'phim, điện ảnh', exampleSentence: '週末に友達と映画を見ました。', exampleMeaning: 'Cuối tuần tôi đã xem phim với bạn.', note: 'N5', hiragana: 'えいが', romaji: 'eiga' },
      { word: '音楽', meaningVi: 'âm nhạc', exampleSentence: '電車の中で音楽を聞きます。', exampleMeaning: 'Tôi nghe nhạc trên tàu điện.', note: 'N5', hiragana: 'おんがく', romaji: 'ongaku' },
      { word: '歌', meaningVi: 'bài hát', exampleSentence: 'この歌が大好きです。', exampleMeaning: 'Tôi rất thích bài hát này.', note: 'N5', hiragana: 'うた', romaji: 'uta' },
      { word: '絵', meaningVi: 'bức tranh, hội hoạ', exampleSentence: '妹は絵を描くのが上手です。', exampleMeaning: 'Em gái tôi vẽ tranh rất giỏi.', note: 'N5', hiragana: 'え', romaji: 'e' },
      { word: '写真', meaningVi: 'bức ảnh', exampleSentence: '旅行でたくさん写真を撮りました。', exampleMeaning: 'Tôi đã chụp rất nhiều ảnh trong chuyến du lịch.', note: 'N5', hiragana: 'しゃしん', romaji: 'shashin' },
      { word: '読書', meaningVi: 'việc đọc sách', exampleSentence: '寝る前に読書をします。', exampleMeaning: 'Trước khi ngủ tôi đọc sách.', note: 'N4', hiragana: 'どくしょ', romaji: 'dokusho' },
      { word: 'スポーツ', meaningVi: 'thể thao', exampleSentence: 'どんなスポーツが好きですか。', exampleMeaning: 'Bạn thích môn thể thao nào?', note: 'N5', hiragana: 'すぽーつ', romaji: 'supootsu' },
      { word: 'サッカー', meaningVi: 'bóng đá', exampleSentence: '日曜日に公園でサッカーをします。', exampleMeaning: 'Chủ nhật tôi chơi bóng đá ở công viên.', note: 'N5', hiragana: 'さっかー', romaji: 'sakkaa' },
      { word: '野球', meaningVi: 'bóng chày', exampleSentence: '父は野球の試合をよく見ます。', exampleMeaning: 'Bố tôi hay xem các trận bóng chày.', note: 'N5', hiragana: 'やきゅう', romaji: 'yakyuu' },
      { word: '水泳', meaningVi: 'bơi lội', exampleSentence: '子供のとき水泳を習いました。', exampleMeaning: 'Hồi nhỏ tôi đã học bơi.', note: 'N4', hiragana: 'すいえい', romaji: 'suiei' },
      { word: '釣り', meaningVi: 'câu cá', exampleSentence: '週末に川へ釣りに行きます。', exampleMeaning: 'Cuối tuần tôi đi câu cá ở sông.', note: 'N4', hiragana: 'つり', romaji: 'tsuri' },
      { word: '料理', meaningVi: 'nấu ăn, món ăn', exampleSentence: '母は料理が上手です。', exampleMeaning: 'Mẹ tôi nấu ăn rất giỏi.', note: 'N5', hiragana: 'りょうり', romaji: 'ryouri' },
      { word: 'ダンス', meaningVi: 'nhảy, khiêu vũ', exampleSentence: '姉は毎週ダンスを習っています。', exampleMeaning: 'Chị tôi học nhảy mỗi tuần.', note: 'N5', hiragana: 'だんす', romaji: 'dansu' },
      { word: 'ゲーム', meaningVi: 'trò chơi điện tử', exampleSentence: '弟は毎日ゲームをしています。', exampleMeaning: 'Em trai tôi chơi game mỗi ngày.', note: 'N5', hiragana: 'げーむ', romaji: 'geemu' },
      { word: '漫画', meaningVi: 'truyện tranh', exampleSentence: '日本の漫画を読んで日本語を覚えました。', exampleMeaning: 'Tôi học tiếng Nhật qua việc đọc truyện tranh Nhật.', note: 'N4', hiragana: 'まんが', romaji: 'manga' },
      { word: 'アニメ', meaningVi: 'phim hoạt hình', exampleSentence: 'アニメを見るのが趣味です。', exampleMeaning: 'Sở thích của tôi là xem anime.', note: 'N5', hiragana: 'あにめ', romaji: 'anime' },
      { word: 'ピアノ', meaningVi: 'đàn piano', exampleSentence: '娘はピアノを弾くことができます。', exampleMeaning: 'Con gái tôi biết chơi piano.', note: 'N5', hiragana: 'ぴあの', romaji: 'piano' },
      { word: 'ギター', meaningVi: 'đàn ghi-ta', exampleSentence: '兄はギターを弾きながら歌います。', exampleMeaning: 'Anh tôi vừa đánh ghi-ta vừa hát.', note: 'N5', hiragana: 'ぎたー', romaji: 'gitaa' },
      { word: '散歩', meaningVi: 'đi dạo', exampleSentence: '朝ご飯の前に犬と散歩します。', exampleMeaning: 'Trước bữa sáng tôi đi dạo cùng chó.', note: 'N5', hiragana: 'さんぽ', romaji: 'sanpo' },
      { word: '山登り', meaningVi: 'leo núi', exampleSentence: '夏に友達と山登りをしました。', exampleMeaning: 'Mùa hè tôi đã đi leo núi với bạn.', note: 'N4', hiragana: 'やまのぼり', romaji: 'yamanobori' },
      { word: 'カラオケ', meaningVi: 'karaoke', exampleSentence: '会社の人とカラオケに行きました。', exampleMeaning: 'Tôi đã đi hát karaoke với đồng nghiệp.', note: 'N5', hiragana: 'からおけ', romaji: 'karaoke' },
      { word: 'ジョギング', meaningVi: 'chạy bộ', exampleSentence: '健康のために毎朝ジョギングをしています。', exampleMeaning: 'Vì sức khoẻ, tôi chạy bộ mỗi sáng.', note: 'N4', hiragana: 'じょぎんぐ', romaji: 'jogingu' },
      { word: '切手', meaningVi: 'tem thư (sưu tầm tem)', exampleSentence: '祖父は古い切手を集めています。', exampleMeaning: 'Ông tôi sưu tầm tem cũ.', note: 'N5', hiragana: 'きって', romaji: 'kitte' },
      { word: '楽しみ', meaningVi: 'niềm vui, điều mong chờ', exampleSentence: '週末の旅行が楽しみです。', exampleMeaning: 'Tôi rất mong chờ chuyến du lịch cuối tuần.', note: 'N4', hiragana: 'たのしみ', romaji: 'tanoshimi' },
    ],
  },
  {
    name: 'Nghề nghiệp',
    icon: '💼',
    words: [
      { word: '仕事', meaningVi: 'công việc', exampleSentence: '父の仕事はエンジニアです。', exampleMeaning: 'Công việc của bố tôi là kỹ sư.', note: 'N5', hiragana: 'しごと', romaji: 'shigoto' },
      { word: '会社', meaningVi: 'công ty', exampleSentence: '毎朝八時に会社へ行きます。', exampleMeaning: 'Mỗi sáng tôi đến công ty lúc 8 giờ.', note: 'N5', hiragana: 'かいしゃ', romaji: 'kaisha' },
      { word: '会社員', meaningVi: 'nhân viên công ty', exampleSentence: '私は会社員です。', exampleMeaning: 'Tôi là nhân viên công ty.', note: 'N5', hiragana: 'かいしゃいん', romaji: 'kaishain' },
      { word: '医者', meaningVi: 'bác sĩ', exampleSentence: '姉は病院の医者です。', exampleMeaning: 'Chị tôi là bác sĩ ở bệnh viện.', note: 'N5', hiragana: 'いしゃ', romaji: 'isha' },
      { word: '看護師', meaningVi: 'y tá, điều dưỡng', exampleSentence: '看護師は患者の世話をします。', exampleMeaning: 'Y tá chăm sóc bệnh nhân.', note: 'N4', hiragana: 'かんごし', romaji: 'kangoshi' },
      { word: '警察官', meaningVi: 'cảnh sát', exampleSentence: '道が分からなくて、警察官に聞きました。', exampleMeaning: 'Không biết đường nên tôi đã hỏi cảnh sát.', note: 'N4', hiragana: 'けいさつかん', romaji: 'keisatsukan' },
      { word: '銀行員', meaningVi: 'nhân viên ngân hàng', exampleSentence: '友達は銀行員になりました。', exampleMeaning: 'Bạn tôi đã trở thành nhân viên ngân hàng.', note: 'N5', hiragana: 'ぎんこういん', romaji: 'ginkouin' },
      { word: 'エンジニア', meaningVi: 'kỹ sư', exampleSentence: 'ITエンジニアとして働いています。', exampleMeaning: 'Tôi đang làm việc với tư cách kỹ sư IT.', note: 'N4', hiragana: 'えんじにあ', romaji: 'enjinia' },
      { word: '店員', meaningVi: 'nhân viên cửa hàng', exampleSentence: '店員にサイズを聞きました。', exampleMeaning: 'Tôi đã hỏi nhân viên cửa hàng về cỡ áo.', note: 'N4', hiragana: 'てんいん', romaji: 'tenin' },
      { word: '運転手', meaningVi: 'tài xế', exampleSentence: 'タクシーの運転手に道を説明しました。', exampleMeaning: 'Tôi đã chỉ đường cho tài xế taxi.', note: 'N4', hiragana: 'うんてんしゅ', romaji: 'untenshu' },
      { word: '歌手', meaningVi: 'ca sĩ', exampleSentence: 'あの歌手はベトナムでも有名です。', exampleMeaning: 'Ca sĩ đó nổi tiếng cả ở Việt Nam.', note: 'N4', hiragana: 'かしゅ', romaji: 'kashu' },
      { word: '記者', meaningVi: 'nhà báo, phóng viên', exampleSentence: '記者が社長にインタビューしました。', exampleMeaning: 'Phóng viên đã phỏng vấn giám đốc.', note: 'N4', hiragana: 'きしゃ', romaji: 'kisha' },
      { word: '弁護士', meaningVi: 'luật sư', exampleSentence: '弁護士に相談したほうがいいですよ。', exampleMeaning: 'Bạn nên trao đổi với luật sư thì hơn.', note: 'N4', hiragana: 'べんごし', romaji: 'bengoshi' },
      { word: '公務員', meaningVi: 'công chức', exampleSentence: '兄は市役所の公務員です。', exampleMeaning: 'Anh tôi là công chức ở toà thị chính.', note: 'N4', hiragana: 'こうむいん', romaji: 'koumuin' },
      { word: '社長', meaningVi: 'giám đốc công ty', exampleSentence: '社長は今会議中です。', exampleMeaning: 'Giám đốc hiện đang họp.', note: 'N4', hiragana: 'しゃちょう', romaji: 'shachou' },
      { word: '部長', meaningVi: 'trưởng phòng', exampleSentence: '部長に報告してください。', exampleMeaning: 'Hãy báo cáo với trưởng phòng.', note: 'N4', hiragana: 'ぶちょう', romaji: 'buchou' },
      { word: '給料', meaningVi: 'tiền lương', exampleSentence: '給料は毎月二十五日にもらいます。', exampleMeaning: 'Tôi nhận lương vào ngày 25 hằng tháng.', note: 'N4', hiragana: 'きゅうりょう', romaji: 'kyuuryou' },
      { word: '会議', meaningVi: 'cuộc họp, hội nghị', exampleSentence: '午後三時から会議があります。', exampleMeaning: 'Từ 3 giờ chiều có cuộc họp.', note: 'N4', hiragana: 'かいぎ', romaji: 'kaigi' },
      { word: '残業', meaningVi: 'làm thêm giờ, tăng ca', exampleSentence: '今日は残業で遅くなります。', exampleMeaning: 'Hôm nay tôi tăng ca nên sẽ về muộn.', note: 'N4', hiragana: 'ざんぎょう', romaji: 'zangyou' },
      { word: '出張', meaningVi: 'đi công tác', exampleSentence: '来週大阪へ出張します。', exampleMeaning: 'Tuần sau tôi đi công tác Osaka.', note: 'N4', hiragana: 'しゅっちょう', romaji: 'shucchou' },
      { word: '面接', meaningVi: 'phỏng vấn (xin việc)', exampleSentence: '明日会社の面接があります。', exampleMeaning: 'Ngày mai tôi có buổi phỏng vấn ở công ty.', note: 'N4', hiragana: 'めんせつ', romaji: 'mensetsu' },
      { word: 'アルバイト', meaningVi: 'việc làm thêm', exampleSentence: 'コンビニでアルバイトをしています。', exampleMeaning: 'Tôi đang làm thêm ở cửa hàng tiện lợi.', note: 'N5', hiragana: 'あるばいと', romaji: 'arubaito' },
      { word: '働く', meaningVi: 'làm việc', exampleSentence: '姉は銀行で働いています。', exampleMeaning: 'Chị tôi đang làm việc ở ngân hàng.', note: 'N5', hiragana: 'はたらく', romaji: 'hataraku' },
      { word: '休む', meaningVi: 'nghỉ, nghỉ ngơi', exampleSentence: '熱があるので、今日は会社を休みます。', exampleMeaning: 'Vì bị sốt nên hôm nay tôi nghỉ làm.', note: 'N5', hiragana: 'やすむ', romaji: 'yasumu' },
      { word: '辞める', meaningVi: 'nghỉ việc, thôi việc', exampleSentence: '彼は先月会社を辞めました。', exampleMeaning: 'Anh ấy đã nghỉ việc ở công ty tháng trước.', note: 'N4', hiragana: 'やめる', romaji: 'yameru' },
    ],
  },
];

const JA_VOCAB_PART2: CategorySeed[] = [
  {
    name: 'Thời gian & Lịch',
    icon: '⏰',
    words: [
      { word: '時間', meaningVi: 'thời gian, giờ', exampleSentence: '今、時間がありますか。', exampleMeaning: 'Bây giờ bạn có thời gian không?', note: 'N5', hiragana: 'じかん', romaji: 'jikan' },
      { word: '今日', meaningVi: 'hôm nay', exampleSentence: '今日はいい天気ですね。', exampleMeaning: 'Hôm nay trời đẹp nhỉ.', note: 'N5', hiragana: 'きょう', romaji: 'kyou' },
      { word: '明日', meaningVi: 'ngày mai', exampleSentence: '明日、友達に会います。', exampleMeaning: 'Ngày mai tôi sẽ gặp bạn.', note: 'N5', hiragana: 'あした', romaji: 'ashita' },
      { word: '昨日', meaningVi: 'hôm qua', exampleSentence: '昨日は雨でした。', exampleMeaning: 'Hôm qua trời mưa.', note: 'N5', hiragana: 'きのう', romaji: 'kinou' },
      { word: '今週', meaningVi: 'tuần này', exampleSentence: '今週は忙しいです。', exampleMeaning: 'Tuần này tôi bận.', note: 'N5', hiragana: 'こんしゅう', romaji: 'konshuu' },
      { word: '来週', meaningVi: 'tuần sau', exampleSentence: '来週の月曜日に試験があります。', exampleMeaning: 'Thứ hai tuần sau có bài thi.', note: 'N5', hiragana: 'らいしゅう', romaji: 'raishuu' },
      { word: '先週', meaningVi: 'tuần trước', exampleSentence: '先週、京都へ行きました。', exampleMeaning: 'Tuần trước tôi đã đi Kyoto.', note: 'N5', hiragana: 'せんしゅう', romaji: 'senshuu' },
      { word: '今月', meaningVi: 'tháng này', exampleSentence: '今月の終わりに引っ越します。', exampleMeaning: 'Cuối tháng này tôi sẽ chuyển nhà.', note: 'N5', hiragana: 'こんげつ', romaji: 'kongetsu' },
      { word: '来月', meaningVi: 'tháng sau', exampleSentence: '来月から新しい仕事が始まります。', exampleMeaning: 'Từ tháng sau công việc mới sẽ bắt đầu.', note: 'N5', hiragana: 'らいげつ', romaji: 'raigetsu' },
      { word: '先月', meaningVi: 'tháng trước', exampleSentence: '先月、日本に来ました。', exampleMeaning: 'Tháng trước tôi đã đến Nhật.', note: 'N5', hiragana: 'せんげつ', romaji: 'sengetsu' },
      { word: '今年', meaningVi: 'năm nay', exampleSentence: '今年の夏は暑いですね。', exampleMeaning: 'Mùa hè năm nay nóng nhỉ.', note: 'N5', hiragana: 'ことし', romaji: 'kotoshi' },
      { word: '来年', meaningVi: 'năm sau', exampleSentence: '来年、N4を受けるつもりです。', exampleMeaning: 'Năm sau tôi định thi N4.', note: 'N5', hiragana: 'らいねん', romaji: 'rainen' },
      { word: '去年', meaningVi: 'năm ngoái', exampleSentence: '去年、日本語の勉強を始めました。', exampleMeaning: 'Năm ngoái tôi bắt đầu học tiếng Nhật.', note: 'N5', hiragana: 'きょねん', romaji: 'kyonen' },
      { word: '毎日', meaningVi: 'hằng ngày', exampleSentence: '毎日三十分単語を覚えます。', exampleMeaning: 'Hằng ngày tôi học từ vựng 30 phút.', note: 'N5', hiragana: 'まいにち', romaji: 'mainichi' },
      { word: '毎週', meaningVi: 'hằng tuần', exampleSentence: '毎週土曜日にテニスをします。', exampleMeaning: 'Thứ bảy hằng tuần tôi chơi tennis.', note: 'N5', hiragana: 'まいしゅう', romaji: 'maishuu' },
      { word: '午前', meaningVi: 'buổi sáng (trước 12h)', exampleSentence: '午前九時に会いましょう。', exampleMeaning: 'Hẹn gặp lúc 9 giờ sáng nhé.', note: 'N5', hiragana: 'ごぜん', romaji: 'gozen' },
      { word: '午後', meaningVi: 'buổi chiều (sau 12h)', exampleSentence: '午後は図書館で勉強します。', exampleMeaning: 'Buổi chiều tôi học ở thư viện.', note: 'N5', hiragana: 'ごご', romaji: 'gogo' },
      { word: '朝', meaningVi: 'buổi sáng', exampleSentence: '朝六時に起きます。', exampleMeaning: 'Tôi dậy lúc 6 giờ sáng.', note: 'N5', hiragana: 'あさ', romaji: 'asa' },
      { word: '昼', meaningVi: 'buổi trưa, ban ngày', exampleSentence: '昼はいつも社員食堂で食べます。', exampleMeaning: 'Buổi trưa tôi luôn ăn ở nhà ăn công ty.', note: 'N5', hiragana: 'ひる', romaji: 'hiru' },
      { word: '夜', meaningVi: 'buổi tối, ban đêm', exampleSentence: '夜遅くまで働きました。', exampleMeaning: 'Tôi đã làm việc đến tận khuya.', note: 'N5', hiragana: 'よる', romaji: 'yoru' },
      { word: '週末', meaningVi: 'cuối tuần', exampleSentence: '週末は何をしますか。', exampleMeaning: 'Cuối tuần bạn làm gì?', note: 'N4', hiragana: 'しゅうまつ', romaji: 'shuumatsu' },
      { word: '誕生日', meaningVi: 'sinh nhật', exampleSentence: '誕生日はいつですか。', exampleMeaning: 'Sinh nhật của bạn là khi nào?', note: 'N5', hiragana: 'たんじょうび', romaji: 'tanjoubi' },
      { word: 'カレンダー', meaningVi: 'lịch (treo tường)', exampleSentence: 'カレンダーに予定を書きました。', exampleMeaning: 'Tôi đã ghi kế hoạch lên lịch.', note: 'N5', hiragana: 'かれんだー', romaji: 'karendaa' },
      { word: '予定', meaningVi: 'kế hoạch, dự định', exampleSentence: '週末の予定はもう決めましたか。', exampleMeaning: 'Bạn đã quyết định kế hoạch cuối tuần chưa?', note: 'N4', hiragana: 'よてい', romaji: 'yotei' },
      { word: '最近', meaningVi: 'gần đây, dạo này', exampleSentence: '最近、忙しくて運動していません。', exampleMeaning: 'Dạo này bận quá nên tôi không tập thể dục.', note: 'N4', hiragana: 'さいきん', romaji: 'saikin' },
      { word: '将来', meaningVi: 'tương lai', exampleSentence: '将来、日本で働きたいです。', exampleMeaning: 'Tương lai tôi muốn làm việc ở Nhật.', note: 'N4', hiragana: 'しょうらい', romaji: 'shourai' },
    ],
  },
  {
    name: 'Món ăn & Nhà hàng',
    icon: '🍜',
    words: [
      { word: '食べ物', meaningVi: 'đồ ăn, thức ăn', exampleSentence: '日本の食べ物で何が一番好きですか。', exampleMeaning: 'Trong các món ăn Nhật, bạn thích món nào nhất?', note: 'N5', hiragana: 'たべもの', romaji: 'tabemono' },
      { word: '飲み物', meaningVi: 'đồ uống', exampleSentence: '飲み物は何にしますか。', exampleMeaning: 'Bạn chọn đồ uống gì?', note: 'N5', hiragana: 'のみもの', romaji: 'nomimono' },
      { word: 'ご飯', meaningVi: 'cơm, bữa ăn', exampleSentence: 'もうご飯を食べましたか。', exampleMeaning: 'Bạn đã ăn cơm chưa?', note: 'N5', hiragana: 'ごはん', romaji: 'gohan' },
      { word: 'パン', meaningVi: 'bánh mì', exampleSentence: '朝はパンとコーヒーです。', exampleMeaning: 'Buổi sáng tôi ăn bánh mì và uống cà phê.', note: 'N5', hiragana: 'ぱん', romaji: 'pan' },
      { word: '魚', meaningVi: 'cá', exampleSentence: '日本人はよく魚を食べます。', exampleMeaning: 'Người Nhật hay ăn cá.', note: 'N5', hiragana: 'さかな', romaji: 'sakana' },
      { word: '肉', meaningVi: 'thịt', exampleSentence: 'スーパーで肉と野菜を買いました。', exampleMeaning: 'Tôi đã mua thịt và rau ở siêu thị.', note: 'N5', hiragana: 'にく', romaji: 'niku' },
      { word: '野菜', meaningVi: 'rau, rau củ', exampleSentence: '野菜をもっと食べたほうがいいですよ。', exampleMeaning: 'Bạn nên ăn nhiều rau hơn đấy.', note: 'N5', hiragana: 'やさい', romaji: 'yasai' },
      { word: '果物', meaningVi: 'trái cây, hoa quả', exampleSentence: 'ベトナムの果物は甘くて美味しいです。', exampleMeaning: 'Trái cây Việt Nam ngọt và ngon.', note: 'N5', hiragana: 'くだもの', romaji: 'kudamono' },
      { word: '卵', meaningVi: 'trứng', exampleSentence: '毎朝卵を一つ食べます。', exampleMeaning: 'Mỗi sáng tôi ăn một quả trứng.', note: 'N5', hiragana: 'たまご', romaji: 'tamago' },
      { word: '牛乳', meaningVi: 'sữa bò', exampleSentence: '冷蔵庫に牛乳があります。', exampleMeaning: 'Trong tủ lạnh có sữa.', note: 'N5', hiragana: 'ぎゅうにゅう', romaji: 'gyuunyuu' },
      { word: '水', meaningVi: 'nước', exampleSentence: 'すみません、水をください。', exampleMeaning: 'Xin lỗi, cho tôi xin nước.', note: 'N5', hiragana: 'みず', romaji: 'mizu' },
      { word: 'お茶', meaningVi: 'trà', exampleSentence: '食事の後でお茶を飲みます。', exampleMeaning: 'Sau bữa ăn tôi uống trà.', note: 'N5', hiragana: 'おちゃ', romaji: 'ocha' },
      { word: 'コーヒー', meaningVi: 'cà phê', exampleSentence: 'ベトナムのコーヒーは有名です。', exampleMeaning: 'Cà phê Việt Nam rất nổi tiếng.', note: 'N5', hiragana: 'こーひー', romaji: 'koohii' },
      { word: 'ビール', meaningVi: 'bia', exampleSentence: 'とりあえずビールをお願いします。', exampleMeaning: 'Trước tiên cho tôi bia.', note: 'N5', hiragana: 'びーる', romaji: 'biiru' },
      { word: '寿司', meaningVi: 'sushi', exampleSentence: '昨日、初めて寿司を食べました。', exampleMeaning: 'Hôm qua tôi ăn sushi lần đầu tiên.', note: 'N5', hiragana: 'すし', romaji: 'sushi' },
      { word: 'ラーメン', meaningVi: 'mì ramen', exampleSentence: 'この店のラーメンは安くて美味しいです。', exampleMeaning: 'Mì ramen ở quán này vừa rẻ vừa ngon.', note: 'N5', hiragana: 'らーめん', romaji: 'raamen' },
      { word: '天ぷら', meaningVi: 'tempura (đồ chiên kiểu Nhật)', exampleSentence: '天ぷらは野菜や魚を揚げた料理です。', exampleMeaning: 'Tempura là món rau hoặc cá chiên giòn.', note: 'N5', hiragana: 'てんぷら', romaji: 'tenpura' },
      { word: '味噌汁', meaningVi: 'canh miso', exampleSentence: '朝ご飯に味噌汁を飲みます。', exampleMeaning: 'Bữa sáng tôi ăn canh miso.', note: 'N4', hiragana: 'みそしる', romaji: 'misoshiru' },
      { word: 'レストラン', meaningVi: 'nhà hàng', exampleSentence: '駅の近くに新しいレストランができました。', exampleMeaning: 'Gần nhà ga mới mở một nhà hàng.', note: 'N5', hiragana: 'れすとらん', romaji: 'resutoran' },
      { word: '食堂', meaningVi: 'nhà ăn, quán cơm', exampleSentence: '大学の食堂は安いです。', exampleMeaning: 'Nhà ăn của trường đại học rất rẻ.', note: 'N5', hiragana: 'しょくどう', romaji: 'shokudou' },
      { word: 'メニュー', meaningVi: 'thực đơn', exampleSentence: 'メニューを見せてください。', exampleMeaning: 'Cho tôi xem thực đơn.', note: 'N5', hiragana: 'めにゅー', romaji: 'menyuu' },
      { word: '注文', meaningVi: 'gọi món, đặt hàng', exampleSentence: 'ご注文はお決まりですか。', exampleMeaning: 'Quý khách đã chọn món chưa ạ?', note: 'N4', hiragana: 'ちゅうもん', romaji: 'chuumon' },
      { word: '会計', meaningVi: 'thanh toán, tính tiền', exampleSentence: 'すみません、お会計をお願いします。', exampleMeaning: 'Xin lỗi, cho tôi thanh toán.', note: 'N4', hiragana: 'かいけい', romaji: 'kaikei' },
      { word: '甘い', meaningVi: 'ngọt', exampleSentence: 'このケーキは甘すぎます。', exampleMeaning: 'Cái bánh này ngọt quá.', note: 'N5', hiragana: 'あまい', romaji: 'amai' },
      { word: '辛い', meaningVi: 'cay', exampleSentence: '辛い料理が好きですか。', exampleMeaning: 'Bạn có thích món cay không?', note: 'N5', hiragana: 'からい', romaji: 'karai' },
      { word: '美味しい', meaningVi: 'ngon', exampleSentence: '母の料理は世界で一番美味しいです。', exampleMeaning: 'Món mẹ nấu là ngon nhất thế giới.', note: 'N5', hiragana: 'おいしい', romaji: 'oishii' },
      { word: '朝ご飯', meaningVi: 'bữa sáng', exampleSentence: '今朝は朝ご飯を食べませんでした。', exampleMeaning: 'Sáng nay tôi không ăn sáng.', note: 'N5', hiragana: 'あさごはん', romaji: 'asagohan' },
    ],
  },
  {
    name: 'Gia đình',
    icon: '👨‍👩‍👧',
    words: [
      { word: '家族', meaningVi: 'gia đình', exampleSentence: '家族は五人です。', exampleMeaning: 'Gia đình tôi có 5 người.', note: 'N5', hiragana: 'かぞく', romaji: 'kazoku' },
      { word: '父', meaningVi: 'bố (của mình, cách nói khiêm tốn)', exampleSentence: '父は五十歳です。', exampleMeaning: 'Bố tôi 50 tuổi.', note: 'N5', hiragana: 'ちち', romaji: 'chichi' },
      { word: '母', meaningVi: 'mẹ (của mình, cách nói khiêm tốn)', exampleSentence: '母は料理が上手です。', exampleMeaning: 'Mẹ tôi nấu ăn giỏi.', note: 'N5', hiragana: 'はは', romaji: 'haha' },
      { word: 'お父さん', meaningVi: 'bố (người khác / gọi trong nhà)', exampleSentence: 'お父さんはお元気ですか。', exampleMeaning: 'Bố của bạn có khoẻ không?', note: 'N5', hiragana: 'おとうさん', romaji: 'otousan' },
      { word: 'お母さん', meaningVi: 'mẹ (người khác / gọi trong nhà)', exampleSentence: 'お母さんによろしくお伝えください。', exampleMeaning: 'Cho tôi gửi lời hỏi thăm mẹ bạn.', note: 'N5', hiragana: 'おかあさん', romaji: 'okaasan' },
      { word: '兄', meaningVi: 'anh trai (của mình)', exampleSentence: '兄はハノイに住んでいます。', exampleMeaning: 'Anh trai tôi sống ở Hà Nội.', note: 'N5', hiragana: 'あに', romaji: 'ani' },
      { word: '姉', meaningVi: 'chị gái (của mình)', exampleSentence: '姉は私より三歳年上です。', exampleMeaning: 'Chị tôi hơn tôi 3 tuổi.', note: 'N5', hiragana: 'あね', romaji: 'ane' },
      { word: '弟', meaningVi: 'em trai', exampleSentence: '弟はまだ高校生です。', exampleMeaning: 'Em trai tôi vẫn còn là học sinh cấp ba.', note: 'N5', hiragana: 'おとうと', romaji: 'otouto' },
      { word: '妹', meaningVi: 'em gái', exampleSentence: '妹と一緒に買い物に行きました。', exampleMeaning: 'Tôi đã đi mua sắm cùng em gái.', note: 'N5', hiragana: 'いもうと', romaji: 'imouto' },
      { word: 'お兄さん', meaningVi: 'anh trai (người khác)', exampleSentence: 'お兄さんは何をしていますか。', exampleMeaning: 'Anh trai bạn đang làm nghề gì?', note: 'N5', hiragana: 'おにいさん', romaji: 'oniisan' },
      { word: 'お姉さん', meaningVi: 'chị gái (người khác)', exampleSentence: 'お姉さんはとてもきれいですね。', exampleMeaning: 'Chị gái bạn đẹp quá nhỉ.', note: 'N5', hiragana: 'おねえさん', romaji: 'oneesan' },
      { word: '祖父', meaningVi: 'ông (của mình)', exampleSentence: '祖父は八十歳ですが、とても元気です。', exampleMeaning: 'Ông tôi 80 tuổi nhưng rất khoẻ.', note: 'N4', hiragana: 'そふ', romaji: 'sofu' },
      { word: '祖母', meaningVi: 'bà (của mình)', exampleSentence: '祖母は毎朝庭の花に水をやります。', exampleMeaning: 'Bà tôi tưới hoa trong vườn mỗi sáng.', note: 'N4', hiragana: 'そぼ', romaji: 'sobo' },
      { word: 'おじいさん', meaningVi: 'ông (người khác), ông lão', exampleSentence: 'おじいさんに席を譲りました。', exampleMeaning: 'Tôi đã nhường ghế cho một ông cụ.', note: 'N5', hiragana: 'おじいさん', romaji: 'ojiisan' },
      { word: 'おばあさん', meaningVi: 'bà (người khác), bà lão', exampleSentence: 'おばあさんは昔の話をしてくれました。', exampleMeaning: 'Bà cụ đã kể cho tôi nghe chuyện ngày xưa.', note: 'N5', hiragana: 'おばあさん', romaji: 'obaasan' },
      { word: '両親', meaningVi: 'bố mẹ, song thân', exampleSentence: '両親は田舎に住んでいます。', exampleMeaning: 'Bố mẹ tôi sống ở quê.', note: 'N5', hiragana: 'りょうしん', romaji: 'ryoushin' },
      { word: '夫', meaningVi: 'chồng (của mình)', exampleSentence: '夫は今出張中です。', exampleMeaning: 'Chồng tôi hiện đang đi công tác.', note: 'N4', hiragana: 'おっと', romaji: 'otto' },
      { word: '妻', meaningVi: 'vợ (của mình)', exampleSentence: '妻と二人で旅行に行きました。', exampleMeaning: 'Tôi đã đi du lịch cùng vợ.', note: 'N4', hiragana: 'つま', romaji: 'tsuma' },
      { word: 'ご主人', meaningVi: 'chồng (của người khác)', exampleSentence: 'ご主人はどちらにお勤めですか。', exampleMeaning: 'Chồng chị làm việc ở đâu ạ?', note: 'N4', hiragana: 'ごしゅじん', romaji: 'goshujin' },
      { word: '子供', meaningVi: 'con, trẻ em', exampleSentence: '子供が二人います。', exampleMeaning: 'Tôi có hai người con.', note: 'N5', hiragana: 'こども', romaji: 'kodomo' },
      { word: '息子', meaningVi: 'con trai (của mình)', exampleSentence: '息子は今年小学校に入りました。', exampleMeaning: 'Con trai tôi năm nay vào tiểu học.', note: 'N4', hiragana: 'むすこ', romaji: 'musuko' },
      { word: '娘', meaningVi: 'con gái (của mình)', exampleSentence: '娘は音楽が大好きです。', exampleMeaning: 'Con gái tôi rất thích âm nhạc.', note: 'N4', hiragana: 'むすめ', romaji: 'musume' },
      { word: '赤ちゃん', meaningVi: 'em bé', exampleSentence: '赤ちゃんが泣いています。', exampleMeaning: 'Em bé đang khóc.', note: 'N4', hiragana: 'あかちゃん', romaji: 'akachan' },
      { word: '親戚', meaningVi: 'họ hàng, bà con', exampleSentence: 'お正月に親戚が集まります。', exampleMeaning: 'Dịp năm mới họ hàng tụ họp lại.', note: 'N4', hiragana: 'しんせき', romaji: 'shinseki' },
      { word: 'いとこ', meaningVi: 'anh chị em họ', exampleSentence: 'いとこと同じ学校に通っています。', exampleMeaning: 'Tôi học cùng trường với anh họ.', note: 'N4', hiragana: 'いとこ', romaji: 'itoko' },
      { word: '結婚', meaningVi: 'kết hôn', exampleSentence: '姉は去年結婚しました。', exampleMeaning: 'Chị tôi đã kết hôn năm ngoái.', note: 'N5', hiragana: 'けっこん', romaji: 'kekkon' },
    ],
  },
];

const JA_VOCAB_PART3: CategorySeed[] = [
  {
    name: 'Mua sắm',
    icon: '🛍️',
    words: [
      { word: '店', meaningVi: 'cửa hàng, quán', exampleSentence: 'あの店は何時まで開いていますか。', exampleMeaning: 'Cửa hàng kia mở đến mấy giờ?', note: 'N5', hiragana: 'みせ', romaji: 'mise' },
      { word: 'デパート', meaningVi: 'trung tâm thương mại', exampleSentence: 'デパートで母へのプレゼントを買いました。', exampleMeaning: 'Tôi đã mua quà cho mẹ ở trung tâm thương mại.', note: 'N5', hiragana: 'でぱーと', romaji: 'depaato' },
      { word: 'スーパー', meaningVi: 'siêu thị', exampleSentence: '帰りにスーパーに寄ります。', exampleMeaning: 'Trên đường về tôi sẽ ghé siêu thị.', note: 'N5', hiragana: 'すーぱー', romaji: 'suupaa' },
      { word: 'コンビニ', meaningVi: 'cửa hàng tiện lợi', exampleSentence: 'コンビニでお弁当を買いました。', exampleMeaning: 'Tôi đã mua cơm hộp ở cửa hàng tiện lợi.', note: 'N5', hiragana: 'こんびに', romaji: 'konbini' },
      { word: '値段', meaningVi: 'giá cả', exampleSentence: 'この靴の値段はいくらですか。', exampleMeaning: 'Giá đôi giày này là bao nhiêu?', note: 'N4', hiragana: 'ねだん', romaji: 'nedan' },
      { word: 'お金', meaningVi: 'tiền', exampleSentence: 'お金が足りません。', exampleMeaning: 'Tôi không đủ tiền.', note: 'N5', hiragana: 'おかね', romaji: 'okane' },
      { word: '円', meaningVi: 'yên (đơn vị tiền Nhật)', exampleSentence: 'このりんごは三百円です。', exampleMeaning: 'Quả táo này giá 300 yên.', note: 'N5', hiragana: 'えん', romaji: 'en' },
      { word: '安い', meaningVi: 'rẻ', exampleSentence: 'この店は安くて人気があります。', exampleMeaning: 'Cửa hàng này rẻ nên rất được ưa chuộng.', note: 'N5', hiragana: 'やすい', romaji: 'yasui' },
      { word: '高い', meaningVi: 'đắt; cao', exampleSentence: 'このかばんは高すぎて買えません。', exampleMeaning: 'Cái túi này đắt quá tôi không mua nổi.', note: 'N5', hiragana: 'たかい', romaji: 'takai' },
      { word: '財布', meaningVi: 'ví tiền', exampleSentence: '電車の中で財布をなくしました。', exampleMeaning: 'Tôi đã làm mất ví trên tàu điện.', note: 'N4', hiragana: 'さいふ', romaji: 'saifu' },
      { word: 'おつり', meaningVi: 'tiền thừa, tiền thối lại', exampleSentence: 'おつりは二百円です。', exampleMeaning: 'Tiền thối lại là 200 yên.', note: 'N4', hiragana: 'おつり', romaji: 'otsuri' },
      { word: 'レジ', meaningVi: 'quầy thu ngân', exampleSentence: 'レジに並んでください。', exampleMeaning: 'Vui lòng xếp hàng ở quầy thu ngân.', note: 'N5', hiragana: 'れじ', romaji: 'reji' },
      { word: '袋', meaningVi: 'túi, bao', exampleSentence: '袋はいりますか。', exampleMeaning: 'Quý khách có cần túi không?', note: 'N4', hiragana: 'ふくろ', romaji: 'fukuro' },
      { word: '服', meaningVi: 'quần áo', exampleSentence: '新しい服を買いたいです。', exampleMeaning: 'Tôi muốn mua quần áo mới.', note: 'N5', hiragana: 'ふく', romaji: 'fuku' },
      { word: '靴', meaningVi: 'giày', exampleSentence: '日本では家に入る前に靴を脱ぎます。', exampleMeaning: 'Ở Nhật, trước khi vào nhà phải cởi giày.', note: 'N5', hiragana: 'くつ', romaji: 'kutsu' },
      { word: '帽子', meaningVi: 'mũ, nón', exampleSentence: '暑いので帽子をかぶってください。', exampleMeaning: 'Trời nóng nên hãy đội mũ vào.', note: 'N5', hiragana: 'ぼうし', romaji: 'boushi' },
      { word: 'かばん', meaningVi: 'cặp, túi xách', exampleSentence: 'このかばんは軽くて便利です。', exampleMeaning: 'Cái túi này nhẹ và tiện lợi.', note: 'N5', hiragana: 'かばん', romaji: 'kaban' },
      { word: 'プレゼント', meaningVi: 'quà tặng', exampleSentence: '誕生日に友達からプレゼントをもらいました。', exampleMeaning: 'Sinh nhật tôi được bạn tặng quà.', note: 'N5', hiragana: 'ぷれぜんと', romaji: 'purezento' },
      { word: 'セール', meaningVi: 'đợt giảm giá', exampleSentence: '今デパートでセールをしています。', exampleMeaning: 'Bây giờ trung tâm thương mại đang có đợt giảm giá.', note: 'N4', hiragana: 'せーる', romaji: 'seeru' },
      { word: '試着', meaningVi: 'mặc thử', exampleSentence: 'このシャツを試着してもいいですか。', exampleMeaning: 'Tôi mặc thử cái áo này được không?', note: 'N4', hiragana: 'しちゃく', romaji: 'shichaku' },
      { word: 'サイズ', meaningVi: 'kích cỡ', exampleSentence: 'もう少し大きいサイズはありますか。', exampleMeaning: 'Có cỡ lớn hơn một chút không?', note: 'N5', hiragana: 'さいず', romaji: 'saizu' },
      { word: '色', meaningVi: 'màu sắc', exampleSentence: 'ほかの色も見せてください。', exampleMeaning: 'Cho tôi xem cả màu khác nữa.', note: 'N5', hiragana: 'いろ', romaji: 'iro' },
      { word: '買う', meaningVi: 'mua', exampleSentence: '駅前の店でパンを買いました。', exampleMeaning: 'Tôi đã mua bánh mì ở cửa hàng trước ga.', note: 'N5', hiragana: 'かう', romaji: 'kau' },
      { word: '売る', meaningVi: 'bán', exampleSentence: 'あの店では古い本を売っています。', exampleMeaning: 'Cửa hàng kia bán sách cũ.', note: 'N5', hiragana: 'うる', romaji: 'uru' },
      { word: '払う', meaningVi: 'trả tiền, thanh toán', exampleSentence: 'カードで払ってもいいですか。', exampleMeaning: 'Tôi trả bằng thẻ được không?', note: 'N4', hiragana: 'はらう', romaji: 'harau' },
    ],
  },
  {
    name: 'Giao thông & Đi lại',
    icon: '🚉',
    words: [
      { word: '駅', meaningVi: 'nhà ga', exampleSentence: '駅まで歩いて十分かかります。', exampleMeaning: 'Đi bộ đến ga mất 10 phút.', note: 'N5', hiragana: 'えき', romaji: 'eki' },
      { word: '電車', meaningVi: 'tàu điện', exampleSentence: '電車で会社へ行きます。', exampleMeaning: 'Tôi đi làm bằng tàu điện.', note: 'N5', hiragana: 'でんしゃ', romaji: 'densha' },
      { word: '地下鉄', meaningVi: 'tàu điện ngầm', exampleSentence: '地下鉄のほうが速いですよ。', exampleMeaning: 'Đi tàu điện ngầm nhanh hơn đấy.', note: 'N5', hiragana: 'ちかてつ', romaji: 'chikatetsu' },
      { word: '新幹線', meaningVi: 'tàu cao tốc shinkansen', exampleSentence: '新幹線で大阪へ行きました。', exampleMeaning: 'Tôi đã đi Osaka bằng shinkansen.', note: 'N5', hiragana: 'しんかんせん', romaji: 'shinkansen' },
      { word: 'バス', meaningVi: 'xe buýt', exampleSentence: 'バスが遅れています。', exampleMeaning: 'Xe buýt đang đến muộn.', note: 'N5', hiragana: 'ばす', romaji: 'basu' },
      { word: 'タクシー', meaningVi: 'taxi', exampleSentence: '荷物が多いので、タクシーで帰りましょう。', exampleMeaning: 'Nhiều hành lý nên mình về bằng taxi đi.', note: 'N5', hiragana: 'たくしー', romaji: 'takushii' },
      { word: '飛行機', meaningVi: 'máy bay', exampleSentence: '飛行機でベトナムへ帰ります。', exampleMeaning: 'Tôi về Việt Nam bằng máy bay.', note: 'N5', hiragana: 'ひこうき', romaji: 'hikouki' },
      { word: '自転車', meaningVi: 'xe đạp', exampleSentence: '自転車で学校に通っています。', exampleMeaning: 'Tôi đi học bằng xe đạp.', note: 'N5', hiragana: 'じてんしゃ', romaji: 'jitensha' },
      { word: '車', meaningVi: 'ô tô, xe hơi', exampleSentence: '父は新しい車を買いました。', exampleMeaning: 'Bố tôi đã mua ô tô mới.', note: 'N5', hiragana: 'くるま', romaji: 'kuruma' },
      { word: '切符', meaningVi: 'vé (tàu, xe)', exampleSentence: '切符を二枚買ってください。', exampleMeaning: 'Hãy mua giúp tôi hai vé.', note: 'N5', hiragana: 'きっぷ', romaji: 'kippu' },
      { word: '空港', meaningVi: 'sân bay', exampleSentence: '空港まで友達を迎えに行きます。', exampleMeaning: 'Tôi ra sân bay đón bạn.', note: 'N4', hiragana: 'くうこう', romaji: 'kuukou' },
      { word: '道', meaningVi: 'con đường', exampleSentence: 'この道をまっすぐ行ってください。', exampleMeaning: 'Hãy đi thẳng con đường này.', note: 'N5', hiragana: 'みち', romaji: 'michi' },
      { word: '交差点', meaningVi: 'ngã tư, giao lộ', exampleSentence: '次の交差点を右に曲がってください。', exampleMeaning: 'Hãy rẽ phải ở ngã tư tiếp theo.', note: 'N4', hiragana: 'こうさてん', romaji: 'kousaten' },
      { word: '信号', meaningVi: 'đèn giao thông', exampleSentence: '信号が赤のときは止まってください。', exampleMeaning: 'Khi đèn đỏ thì phải dừng lại.', note: 'N4', hiragana: 'しんごう', romaji: 'shingou' },
      { word: '橋', meaningVi: 'cây cầu', exampleSentence: 'この橋を渡ると駅があります。', exampleMeaning: 'Qua cây cầu này là đến nhà ga.', note: 'N5', hiragana: 'はし', romaji: 'hashi' },
      { word: '角', meaningVi: 'góc (phố)', exampleSentence: 'あの角を左に曲がってください。', exampleMeaning: 'Hãy rẽ trái ở góc phố kia.', note: 'N5', hiragana: 'かど', romaji: 'kado' },
      { word: 'まっすぐ', meaningVi: 'thẳng', exampleSentence: 'まっすぐ行くと、銀行が見えます。', exampleMeaning: 'Đi thẳng sẽ thấy ngân hàng.', note: 'N5', hiragana: 'まっすぐ', romaji: 'massugu' },
      { word: '右', meaningVi: 'bên phải', exampleSentence: '銀行の右に郵便局があります。', exampleMeaning: 'Bên phải ngân hàng có bưu điện.', note: 'N5', hiragana: 'みぎ', romaji: 'migi' },
      { word: '左', meaningVi: 'bên trái', exampleSentence: '左に曲がってください。', exampleMeaning: 'Hãy rẽ trái.', note: 'N5', hiragana: 'ひだり', romaji: 'hidari' },
      { word: '近く', meaningVi: 'gần, vùng lân cận', exampleSentence: '家の近くに公園があります。', exampleMeaning: 'Gần nhà tôi có công viên.', note: 'N5', hiragana: 'ちかく', romaji: 'chikaku' },
      { word: '遠い', meaningVi: 'xa', exampleSentence: '会社は家から遠いです。', exampleMeaning: 'Công ty xa nhà tôi.', note: 'N5', hiragana: 'とおい', romaji: 'tooi' },
      { word: '乗る', meaningVi: 'lên, đi (xe, tàu)', exampleSentence: '七時の電車に乗ります。', exampleMeaning: 'Tôi sẽ lên chuyến tàu 7 giờ.', note: 'N5', hiragana: 'のる', romaji: 'noru' },
      { word: '降りる', meaningVi: 'xuống (xe, tàu)', exampleSentence: '次の駅で降ります。', exampleMeaning: 'Tôi xuống ở ga tiếp theo.', note: 'N5', hiragana: 'おりる', romaji: 'oriru' },
      { word: '乗り換える', meaningVi: 'chuyển tàu, đổi tuyến', exampleSentence: '新宿駅で山手線に乗り換えてください。', exampleMeaning: 'Hãy đổi sang tuyến Yamanote ở ga Shinjuku.', note: 'N4', hiragana: 'のりかえる', romaji: 'norikaeru' },
      { word: '急行', meaningVi: 'tàu tốc hành', exampleSentence: 'この駅に急行は止まりません。', exampleMeaning: 'Tàu tốc hành không dừng ở ga này.', note: 'N4', hiragana: 'きゅうこう', romaji: 'kyuukou' },
      { word: '出発', meaningVi: 'xuất phát, khởi hành', exampleSentence: 'バスは八時に出発します。', exampleMeaning: 'Xe buýt khởi hành lúc 8 giờ.', note: 'N4', hiragana: 'しゅっぱつ', romaji: 'shuppatsu' },
    ],
  },
  {
    name: 'Thời tiết & Mùa',
    icon: '🌤️',
    words: [
      { word: '天気', meaningVi: 'thời tiết', exampleSentence: '明日の天気はどうですか。', exampleMeaning: 'Thời tiết ngày mai thế nào?', note: 'N5', hiragana: 'てんき', romaji: 'tenki' },
      { word: '晴れ', meaningVi: 'trời nắng, quang đãng', exampleSentence: '今日は晴れですから、洗濯しましょう。', exampleMeaning: 'Hôm nay trời nắng nên mình giặt đồ thôi.', note: 'N5', hiragana: 'はれ', romaji: 'hare' },
      { word: '雨', meaningVi: 'mưa', exampleSentence: '午後から雨が降るそうです。', exampleMeaning: 'Nghe nói từ chiều trời sẽ mưa.', note: 'N5', hiragana: 'あめ', romaji: 'ame' },
      { word: '雪', meaningVi: 'tuyết', exampleSentence: '北海道は雪がたくさん降ります。', exampleMeaning: 'Ở Hokkaido tuyết rơi rất nhiều.', note: 'N5', hiragana: 'ゆき', romaji: 'yuki' },
      { word: '曇り', meaningVi: 'trời nhiều mây, âm u', exampleSentence: '今日は曇りで少し寒いです。', exampleMeaning: 'Hôm nay trời âm u và hơi lạnh.', note: 'N5', hiragana: 'くもり', romaji: 'kumori' },
      { word: '風', meaningVi: 'gió', exampleSentence: '今日は風が強いですね。', exampleMeaning: 'Hôm nay gió mạnh nhỉ.', note: 'N5', hiragana: 'かぜ', romaji: 'kaze' },
      { word: '台風', meaningVi: 'bão', exampleSentence: '台風が近づいているので、早く帰りましょう。', exampleMeaning: 'Bão đang đến gần nên mình về sớm thôi.', note: 'N4', hiragana: 'たいふう', romaji: 'taifuu' },
      { word: '地震', meaningVi: 'động đất', exampleSentence: '昨夜、小さい地震がありました。', exampleMeaning: 'Đêm qua có một trận động đất nhỏ.', note: 'N4', hiragana: 'じしん', romaji: 'jishin' },
      { word: '春', meaningVi: 'mùa xuân', exampleSentence: '春になると、桜が咲きます。', exampleMeaning: 'Cứ đến mùa xuân là hoa anh đào nở.', note: 'N5', hiragana: 'はる', romaji: 'haru' },
      { word: '夏', meaningVi: 'mùa hè', exampleSentence: '夏は海へ泳ぎに行きます。', exampleMeaning: 'Mùa hè tôi đi biển bơi.', note: 'N5', hiragana: 'なつ', romaji: 'natsu' },
      { word: '秋', meaningVi: 'mùa thu', exampleSentence: '秋は涼しくて過ごしやすいです。', exampleMeaning: 'Mùa thu mát mẻ, dễ chịu.', note: 'N5', hiragana: 'あき', romaji: 'aki' },
      { word: '冬', meaningVi: 'mùa đông', exampleSentence: '冬はスキーをしに行きたいです。', exampleMeaning: 'Mùa đông tôi muốn đi trượt tuyết.', note: 'N5', hiragana: 'ふゆ', romaji: 'fuyu' },
      { word: '季節', meaningVi: 'mùa', exampleSentence: 'どの季節が一番好きですか。', exampleMeaning: 'Bạn thích mùa nào nhất?', note: 'N4', hiragana: 'きせつ', romaji: 'kisetsu' },
      { word: '暑い', meaningVi: 'nóng (thời tiết)', exampleSentence: 'ハノイの夏はとても暑いです。', exampleMeaning: 'Mùa hè ở Hà Nội rất nóng.', note: 'N5', hiragana: 'あつい', romaji: 'atsui' },
      { word: '寒い', meaningVi: 'lạnh (thời tiết)', exampleSentence: '今朝は寒かったですね。', exampleMeaning: 'Sáng nay lạnh nhỉ.', note: 'N5', hiragana: 'さむい', romaji: 'samui' },
      { word: '暖かい', meaningVi: 'ấm áp', exampleSentence: '今日は暖かくて気持ちがいいです。', exampleMeaning: 'Hôm nay trời ấm, dễ chịu.', note: 'N5', hiragana: 'あたたかい', romaji: 'atatakai' },
      { word: '涼しい', meaningVi: 'mát mẻ', exampleSentence: '朝は涼しいですが、昼は暑いです。', exampleMeaning: 'Buổi sáng mát nhưng buổi trưa nóng.', note: 'N5', hiragana: 'すずしい', romaji: 'suzushii' },
      { word: '蒸し暑い', meaningVi: 'oi bức, nóng ẩm', exampleSentence: '日本の夏は蒸し暑いです。', exampleMeaning: 'Mùa hè ở Nhật rất oi bức.', note: 'N4', hiragana: 'むしあつい', romaji: 'mushiatsui' },
      { word: '天気予報', meaningVi: 'dự báo thời tiết', exampleSentence: '天気予報によると、明日は雨です。', exampleMeaning: 'Theo dự báo thời tiết, ngày mai trời mưa.', note: 'N4', hiragana: 'てんきよほう', romaji: 'tenkiyohou' },
      { word: '気温', meaningVi: 'nhiệt độ (không khí)', exampleSentence: '今日の気温は三十五度です。', exampleMeaning: 'Nhiệt độ hôm nay là 35 độ.', note: 'N4', hiragana: 'きおん', romaji: 'kion' },
      { word: '梅雨', meaningVi: 'mùa mưa (ở Nhật)', exampleSentence: '六月は梅雨で雨の日が多いです。', exampleMeaning: 'Tháng 6 là mùa mưa nên nhiều ngày mưa.', note: 'N4', hiragana: 'つゆ', romaji: 'tsuyu' },
      { word: '桜', meaningVi: 'hoa anh đào', exampleSentence: '公園の桜がとてもきれいです。', exampleMeaning: 'Hoa anh đào ở công viên rất đẹp.', note: 'N5', hiragana: 'さくら', romaji: 'sakura' },
      { word: '花見', meaningVi: 'ngắm hoa (anh đào)', exampleSentence: '週末に家族と花見をしました。', exampleMeaning: 'Cuối tuần tôi đã đi ngắm hoa cùng gia đình.', note: 'N4', hiragana: 'はなみ', romaji: 'hanami' },
      { word: '紅葉', meaningVi: 'lá đỏ mùa thu', exampleSentence: '京都の紅葉は有名です。', exampleMeaning: 'Lá đỏ ở Kyoto rất nổi tiếng.', note: 'N4', hiragana: 'こうよう', romaji: 'kouyou' },
      { word: '空', meaningVi: 'bầu trời', exampleSentence: '今日は空がとても青いです。', exampleMeaning: 'Hôm nay bầu trời rất xanh.', note: 'N5', hiragana: 'そら', romaji: 'sora' },
    ],
  },
];

const JA_VOCAB_PART4: CategorySeed[] = [
  {
    name: 'Sức khoẻ & Cơ thể',
    icon: '🏥',
    words: [
      { word: '体', meaningVi: 'cơ thể', exampleSentence: '体に気をつけてください。', exampleMeaning: 'Hãy giữ gìn sức khoẻ nhé.', note: 'N5', hiragana: 'からだ', romaji: 'karada' },
      { word: '頭', meaningVi: 'đầu', exampleSentence: '朝から頭が痛いです。', exampleMeaning: 'Từ sáng tôi bị đau đầu.', note: 'N5', hiragana: 'あたま', romaji: 'atama' },
      { word: '顔', meaningVi: 'khuôn mặt', exampleSentence: '朝起きて顔を洗います。', exampleMeaning: 'Sáng dậy tôi rửa mặt.', note: 'N5', hiragana: 'かお', romaji: 'kao' },
      { word: '目', meaningVi: 'mắt', exampleSentence: 'パソコンの使いすぎで目が疲れました。', exampleMeaning: 'Dùng máy tính nhiều quá nên mắt tôi mỏi.', note: 'N5', hiragana: 'め', romaji: 'me' },
      { word: '耳', meaningVi: 'tai', exampleSentence: '祖父は耳が少し遠いです。', exampleMeaning: 'Ông tôi hơi lãng tai.', note: 'N5', hiragana: 'みみ', romaji: 'mimi' },
      { word: '鼻', meaningVi: 'mũi', exampleSentence: '風邪で鼻が詰まっています。', exampleMeaning: 'Vì cảm nên tôi bị nghẹt mũi.', note: 'N5', hiragana: 'はな', romaji: 'hana' },
      { word: '口', meaningVi: 'miệng', exampleSentence: '口を大きく開けてください。', exampleMeaning: 'Hãy há miệng to ra.', note: 'N5', hiragana: 'くち', romaji: 'kuchi' },
      { word: '歯', meaningVi: 'răng', exampleSentence: '寝る前に歯を磨きます。', exampleMeaning: 'Trước khi ngủ tôi đánh răng.', note: 'N5', hiragana: 'は', romaji: 'ha' },
      { word: '手', meaningVi: 'tay', exampleSentence: '食事の前に手を洗いましょう。', exampleMeaning: 'Trước khi ăn hãy rửa tay.', note: 'N5', hiragana: 'て', romaji: 'te' },
      { word: '足', meaningVi: 'chân, bàn chân', exampleSentence: 'たくさん歩いて足が痛いです。', exampleMeaning: 'Đi bộ nhiều nên chân tôi đau.', note: 'N5', hiragana: 'あし', romaji: 'ashi' },
      { word: 'お腹', meaningVi: 'bụng', exampleSentence: 'お腹が空きました。', exampleMeaning: 'Tôi đói bụng rồi.', note: 'N5', hiragana: 'おなか', romaji: 'onaka' },
      { word: '背中', meaningVi: 'lưng', exampleSentence: '背中が痛くて眠れません。', exampleMeaning: 'Lưng đau quá tôi không ngủ được.', note: 'N4', hiragana: 'せなか', romaji: 'senaka' },
      { word: '喉', meaningVi: 'cổ họng', exampleSentence: '喉が痛いので、声が出ません。', exampleMeaning: 'Họng đau nên tôi không nói ra tiếng.', note: 'N4', hiragana: 'のど', romaji: 'nodo' },
      { word: '熱', meaningVi: 'sốt', exampleSentence: '熱が三十八度あります。', exampleMeaning: 'Tôi sốt 38 độ.', note: 'N5', hiragana: 'ねつ', romaji: 'netsu' },
      { word: '風邪', meaningVi: 'cảm, cảm cúm', exampleSentence: '風邪を引いて学校を休みました。', exampleMeaning: 'Tôi bị cảm nên đã nghỉ học.', note: 'N5', hiragana: 'かぜ', romaji: 'kaze' },
      { word: '病気', meaningVi: 'bệnh, ốm', exampleSentence: '病気のときは無理をしないでください。', exampleMeaning: 'Khi ốm thì đừng cố quá sức.', note: 'N5', hiragana: 'びょうき', romaji: 'byouki' },
      { word: '病院', meaningVi: 'bệnh viện', exampleSentence: '足を怪我して病院へ行きました。', exampleMeaning: 'Tôi bị thương ở chân nên đã đến bệnh viện.', note: 'N5', hiragana: 'びょういん', romaji: 'byouin' },
      { word: '薬', meaningVi: 'thuốc', exampleSentence: 'この薬は食後に飲んでください。', exampleMeaning: 'Thuốc này hãy uống sau bữa ăn.', note: 'N5', hiragana: 'くすり', romaji: 'kusuri' },
      { word: '歯医者', meaningVi: 'nha sĩ, phòng khám răng', exampleSentence: '明日、歯医者に行かなければなりません。', exampleMeaning: 'Ngày mai tôi phải đi khám răng.', note: 'N4', hiragana: 'はいしゃ', romaji: 'haisha' },
      { word: '注射', meaningVi: 'tiêm', exampleSentence: '子供は注射が怖いと言いました。', exampleMeaning: 'Đứa bé nói là sợ tiêm.', note: 'N4', hiragana: 'ちゅうしゃ', romaji: 'chuusha' },
      { word: '怪我', meaningVi: 'vết thương, bị thương', exampleSentence: 'サッカーで足に怪我をしました。', exampleMeaning: 'Tôi bị thương ở chân khi đá bóng.', note: 'N4', hiragana: 'けが', romaji: 'kega' },
      { word: '入院', meaningVi: 'nhập viện', exampleSentence: '祖母は一週間入院しました。', exampleMeaning: 'Bà tôi đã nằm viện một tuần.', note: 'N4', hiragana: 'にゅういん', romaji: 'nyuuin' },
      { word: '退院', meaningVi: 'xuất viện', exampleSentence: '父は昨日退院しました。', exampleMeaning: 'Bố tôi đã xuất viện hôm qua.', note: 'N4', hiragana: 'たいいん', romaji: 'taiin' },
      { word: '具合', meaningVi: 'tình trạng (sức khoẻ)', exampleSentence: '具合はどうですか。', exampleMeaning: 'Tình hình sức khoẻ của bạn thế nào?', note: 'N4', hiragana: 'ぐあい', romaji: 'guai' },
      { word: '元気', meaningVi: 'khoẻ, khoẻ mạnh', exampleSentence: 'おかげさまで元気です。', exampleMeaning: 'Nhờ trời tôi vẫn khoẻ.', note: 'N5', hiragana: 'げんき', romaji: 'genki' },
      { word: '痛い', meaningVi: 'đau', exampleSentence: '歯が痛くて何も食べられません。', exampleMeaning: 'Răng đau quá tôi không ăn được gì.', note: 'N5', hiragana: 'いたい', romaji: 'itai' },
      { word: '疲れる', meaningVi: 'mệt, mệt mỏi', exampleSentence: '今日は仕事でとても疲れました。', exampleMeaning: 'Hôm nay làm việc mệt quá.', note: 'N5', hiragana: 'つかれる', romaji: 'tsukareru' },
    ],
  },
  {
    name: 'Nhà cửa & Đồ vật',
    icon: '🏠',
    words: [
      { word: '家', meaningVi: 'nhà', exampleSentence: '私の家は駅から近いです。', exampleMeaning: 'Nhà tôi gần nhà ga.', note: 'N5', hiragana: 'いえ', romaji: 'ie' },
      { word: '部屋', meaningVi: 'căn phòng', exampleSentence: '部屋をきれいに掃除しました。', exampleMeaning: 'Tôi đã dọn phòng sạch sẽ.', note: 'N5', hiragana: 'へや', romaji: 'heya' },
      { word: '台所', meaningVi: 'nhà bếp', exampleSentence: '母は台所で晩ご飯を作っています。', exampleMeaning: 'Mẹ đang nấu bữa tối trong bếp.', note: 'N5', hiragana: 'だいどころ', romaji: 'daidokoro' },
      { word: 'お風呂', meaningVi: 'bồn tắm, phòng tắm', exampleSentence: '寝る前にお風呂に入ります。', exampleMeaning: 'Trước khi ngủ tôi đi tắm.', note: 'N5', hiragana: 'おふろ', romaji: 'ofuro' },
      { word: 'トイレ', meaningVi: 'nhà vệ sinh', exampleSentence: 'すみません、トイレはどこですか。', exampleMeaning: 'Xin lỗi, nhà vệ sinh ở đâu?', note: 'N5', hiragana: 'といれ', romaji: 'toire' },
      { word: '玄関', meaningVi: 'cửa ra vào, sảnh nhà', exampleSentence: '玄関で靴を脱いでください。', exampleMeaning: 'Hãy cởi giày ở cửa ra vào.', note: 'N4', hiragana: 'げんかん', romaji: 'genkan' },
      { word: '庭', meaningVi: 'sân vườn', exampleSentence: '庭に花を植えました。', exampleMeaning: 'Tôi đã trồng hoa trong vườn.', note: 'N5', hiragana: 'にわ', romaji: 'niwa' },
      { word: '窓', meaningVi: 'cửa sổ', exampleSentence: '暑いですから、窓を開けてください。', exampleMeaning: 'Trời nóng nên hãy mở cửa sổ.', note: 'N5', hiragana: 'まど', romaji: 'mado' },
      { word: 'ドア', meaningVi: 'cửa', exampleSentence: 'ドアを閉めてもいいですか。', exampleMeaning: 'Tôi đóng cửa được không?', note: 'N5', hiragana: 'どあ', romaji: 'doa' },
      { word: '壁', meaningVi: 'bức tường', exampleSentence: '壁に家族の写真を掛けました。', exampleMeaning: 'Tôi treo ảnh gia đình lên tường.', note: 'N4', hiragana: 'かべ', romaji: 'kabe' },
      { word: '床', meaningVi: 'sàn nhà', exampleSentence: '床にゴミを捨てないでください。', exampleMeaning: 'Đừng vứt rác xuống sàn.', note: 'N4', hiragana: 'ゆか', romaji: 'yuka' },
      { word: '机', meaningVi: 'bàn (học, làm việc)', exampleSentence: '机の上に本があります。', exampleMeaning: 'Trên bàn có quyển sách.', note: 'N5', hiragana: 'つくえ', romaji: 'tsukue' },
      { word: '椅子', meaningVi: 'ghế', exampleSentence: 'この椅子に座ってもいいですか。', exampleMeaning: 'Tôi ngồi ghế này được không?', note: 'N5', hiragana: 'いす', romaji: 'isu' },
      { word: 'ベッド', meaningVi: 'giường', exampleSentence: '猫がベッドの下に隠れています。', exampleMeaning: 'Con mèo đang trốn dưới gầm giường.', note: 'N5', hiragana: 'べっど', romaji: 'beddo' },
      { word: '本棚', meaningVi: 'kệ sách, giá sách', exampleSentence: '本棚に漫画がたくさん並んでいます。', exampleMeaning: 'Trên kệ sách xếp rất nhiều truyện tranh.', note: 'N4', hiragana: 'ほんだな', romaji: 'hondana' },
      { word: '冷蔵庫', meaningVi: 'tủ lạnh', exampleSentence: '冷蔵庫にジュースが入っています。', exampleMeaning: 'Trong tủ lạnh có nước hoa quả.', note: 'N5', hiragana: 'れいぞうこ', romaji: 'reizouko' },
      { word: '洗濯機', meaningVi: 'máy giặt', exampleSentence: '新しい洗濯機を買いたいです。', exampleMeaning: 'Tôi muốn mua máy giặt mới.', note: 'N4', hiragana: 'せんたくき', romaji: 'sentakuki' },
      { word: 'エアコン', meaningVi: 'máy điều hoà', exampleSentence: '暑いのでエアコンをつけましょう。', exampleMeaning: 'Nóng quá, bật điều hoà thôi.', note: 'N4', hiragana: 'えあこん', romaji: 'eakon' },
      { word: 'テレビ', meaningVi: 'ti vi', exampleSentence: '夜、家族とテレビを見ます。', exampleMeaning: 'Buổi tối tôi xem ti vi cùng gia đình.', note: 'N5', hiragana: 'てれび', romaji: 'terebi' },
      { word: '電気', meaningVi: 'điện; đèn điện', exampleSentence: '出かける前に電気を消してください。', exampleMeaning: 'Trước khi ra ngoài hãy tắt đèn.', note: 'N5', hiragana: 'でんき', romaji: 'denki' },
      { word: '時計', meaningVi: 'đồng hồ', exampleSentence: 'この時計は誕生日にもらいました。', exampleMeaning: 'Chiếc đồng hồ này tôi được tặng vào sinh nhật.', note: 'N5', hiragana: 'とけい', romaji: 'tokei' },
      { word: '鍵', meaningVi: 'chìa khoá', exampleSentence: '鍵をかけるのを忘れました。', exampleMeaning: 'Tôi quên khoá cửa.', note: 'N5', hiragana: 'かぎ', romaji: 'kagi' },
      { word: '引っ越し', meaningVi: 'chuyển nhà', exampleSentence: '来月、新しいアパートに引っ越しします。', exampleMeaning: 'Tháng sau tôi chuyển đến căn hộ mới.', note: 'N4', hiragana: 'ひっこし', romaji: 'hikkoshi' },
      { word: '家賃', meaningVi: 'tiền thuê nhà', exampleSentence: 'この部屋の家賃は月七万円です。', exampleMeaning: 'Tiền thuê phòng này là 70.000 yên một tháng.', note: 'N4', hiragana: 'やちん', romaji: 'yachin' },
      { word: 'アパート', meaningVi: 'căn hộ, chung cư nhỏ', exampleSentence: '駅の近くのアパートに住んでいます。', exampleMeaning: 'Tôi sống ở căn hộ gần nhà ga.', note: 'N5', hiragana: 'あぱーと', romaji: 'apaato' },
      { word: '掃除', meaningVi: 'dọn dẹp, quét dọn', exampleSentence: '週末に部屋の掃除をします。', exampleMeaning: 'Cuối tuần tôi dọn phòng.', note: 'N5', hiragana: 'そうじ', romaji: 'souji' },
      { word: '洗濯', meaningVi: 'giặt giũ', exampleSentence: '天気がいいから洗濯しましょう。', exampleMeaning: 'Trời đẹp nên mình giặt đồ thôi.', note: 'N5', hiragana: 'せんたく', romaji: 'sentaku' },
    ],
  },
  {
    name: 'Du lịch & Địa điểm',
    icon: '🗾',
    words: [
      { word: '観光', meaningVi: 'tham quan, du lịch ngắm cảnh', exampleSentence: '京都を観光したいです。', exampleMeaning: 'Tôi muốn tham quan Kyoto.', note: 'N4', hiragana: 'かんこう', romaji: 'kankou' },
      { word: 'ホテル', meaningVi: 'khách sạn', exampleSentence: '駅の前のホテルを予約しました。', exampleMeaning: 'Tôi đã đặt khách sạn trước nhà ga.', note: 'N5', hiragana: 'ほてる', romaji: 'hoteru' },
      { word: '旅館', meaningVi: 'nhà trọ truyền thống Nhật', exampleSentence: '温泉のある旅館に泊まりました。', exampleMeaning: 'Tôi đã nghỉ ở một ryokan có suối nước nóng.', note: 'N4', hiragana: 'りょかん', romaji: 'ryokan' },
      { word: '予約', meaningVi: 'đặt trước, đặt chỗ', exampleSentence: 'レストランを七時に予約しました。', exampleMeaning: 'Tôi đã đặt bàn nhà hàng lúc 7 giờ.', note: 'N4', hiragana: 'よやく', romaji: 'yoyaku' },
      { word: '地図', meaningVi: 'bản đồ', exampleSentence: '地図を見ながら歩きました。', exampleMeaning: 'Tôi vừa xem bản đồ vừa đi bộ.', note: 'N5', hiragana: 'ちず', romaji: 'chizu' },
      { word: '案内', meaningVi: 'hướng dẫn, chỉ dẫn', exampleSentence: '友達に東京を案内してもらいました。', exampleMeaning: 'Tôi được bạn dẫn đi tham quan Tokyo.', note: 'N4', hiragana: 'あんない', romaji: 'annai' },
      { word: 'お土産', meaningVi: 'quà lưu niệm, quà đặc sản', exampleSentence: '家族にお土産を買いました。', exampleMeaning: 'Tôi đã mua quà về cho gia đình.', note: 'N5', hiragana: 'おみやげ', romaji: 'omiyage' },
      { word: '温泉', meaningVi: 'suối nước nóng', exampleSentence: '冬は温泉に入りたいですね。', exampleMeaning: 'Mùa đông thật muốn ngâm suối nước nóng nhỉ.', note: 'N4', hiragana: 'おんせん', romaji: 'onsen' },
      { word: '神社', meaningVi: 'đền thần đạo', exampleSentence: 'お正月に神社へお参りに行きます。', exampleMeaning: 'Năm mới tôi đi lễ đền.', note: 'N4', hiragana: 'じんじゃ', romaji: 'jinja' },
      { word: 'お寺', meaningVi: 'chùa', exampleSentence: '京都には古いお寺がたくさんあります。', exampleMeaning: 'Ở Kyoto có rất nhiều ngôi chùa cổ.', note: 'N5', hiragana: 'おてら', romaji: 'otera' },
      { word: '城', meaningVi: 'lâu đài, thành', exampleSentence: '大阪城はとても大きいです。', exampleMeaning: 'Thành Osaka rất lớn.', note: 'N4', hiragana: 'しろ', romaji: 'shiro' },
      { word: '博物館', meaningVi: 'bảo tàng', exampleSentence: '博物館で日本の歴史を勉強しました。', exampleMeaning: 'Tôi đã tìm hiểu lịch sử Nhật Bản ở bảo tàng.', note: 'N4', hiragana: 'はくぶつかん', romaji: 'hakubutsukan' },
      { word: '美術館', meaningVi: 'bảo tàng mỹ thuật', exampleSentence: '美術館で有名な絵を見ました。', exampleMeaning: 'Tôi đã xem những bức tranh nổi tiếng ở bảo tàng mỹ thuật.', note: 'N4', hiragana: 'びじゅつかん', romaji: 'bijutsukan' },
      { word: '公園', meaningVi: 'công viên', exampleSentence: '朝、公園を散歩します。', exampleMeaning: 'Buổi sáng tôi đi dạo trong công viên.', note: 'N5', hiragana: 'こうえん', romaji: 'kouen' },
      { word: '海', meaningVi: 'biển', exampleSentence: '夏休みに海へ行きました。', exampleMeaning: 'Kỳ nghỉ hè tôi đã đi biển.', note: 'N5', hiragana: 'うみ', romaji: 'umi' },
      { word: '山', meaningVi: 'núi', exampleSentence: '富士山は日本で一番高い山です。', exampleMeaning: 'Núi Phú Sĩ là ngọn núi cao nhất Nhật Bản.', note: 'N5', hiragana: 'やま', romaji: 'yama' },
      { word: '川', meaningVi: 'sông', exampleSentence: '川で子供たちが遊んでいます。', exampleMeaning: 'Bọn trẻ đang chơi ở bờ sông.', note: 'N5', hiragana: 'かわ', romaji: 'kawa' },
      { word: '島', meaningVi: 'hòn đảo', exampleSentence: '日本は島の国です。', exampleMeaning: 'Nhật Bản là đất nước của những hòn đảo.', note: 'N4', hiragana: 'しま', romaji: 'shima' },
      { word: '湖', meaningVi: 'hồ', exampleSentence: '湖の水がとてもきれいです。', exampleMeaning: 'Nước hồ rất trong.', note: 'N4', hiragana: 'みずうみ', romaji: 'mizuumi' },
      { word: '撮る', meaningVi: 'chụp (ảnh)', exampleSentence: 'すみません、写真を撮ってもらえますか。', exampleMeaning: 'Xin lỗi, bạn chụp ảnh giúp tôi được không?', note: 'N5', hiragana: 'とる', romaji: 'toru' },
      { word: '外国', meaningVi: 'nước ngoài', exampleSentence: '初めて外国へ行きました。', exampleMeaning: 'Lần đầu tiên tôi đi nước ngoài.', note: 'N5', hiragana: 'がいこく', romaji: 'gaikoku' },
      { word: 'パスポート', meaningVi: 'hộ chiếu', exampleSentence: 'パスポートを見せてください。', exampleMeaning: 'Vui lòng cho xem hộ chiếu.', note: 'N5', hiragana: 'ぱすぽーと', romaji: 'pasupooto' },
      { word: '荷物', meaningVi: 'hành lý, đồ đạc', exampleSentence: '荷物をホテルに預けました。', exampleMeaning: 'Tôi đã gửi hành lý ở khách sạn.', note: 'N5', hiragana: 'にもつ', romaji: 'nimotsu' },
      { word: '到着', meaningVi: 'đến nơi', exampleSentence: '飛行機は十時に到着します。', exampleMeaning: 'Máy bay sẽ đến lúc 10 giờ.', note: 'N4', hiragana: 'とうちゃく', romaji: 'touchaku' },
      { word: '泊まる', meaningVi: 'nghỉ lại, trọ lại', exampleSentence: '友達の家に一晩泊まりました。', exampleMeaning: 'Tôi đã ngủ lại nhà bạn một đêm.', note: 'N4', hiragana: 'とまる', romaji: 'tomaru' },
      { word: '楽しむ', meaningVi: 'tận hưởng, vui chơi', exampleSentence: '旅行を楽しんでください。', exampleMeaning: 'Chúc bạn có chuyến du lịch vui vẻ.', note: 'N4', hiragana: 'たのしむ', romaji: 'tanoshimu' },
    ],
  },
];

// ============================ DATA: GRAMMAR N5 ============================
const JA_GRAMMAR_N5A: GrammarSeed[] = [
  {
    level: 'N5',
    title: '〜です／だ — là (khẳng định)',
    structure: 'Danh từ／Tính từ-na + です (lịch sự) ／ だ (thân mật)',
    explanation: '<p><strong>です</strong> đặt cuối câu để khẳng định một cách lịch sự, tương đương "là" trong tiếng Việt. Dạng thân mật là <strong>だ</strong> (thường lược bỏ trong hội thoại với tính từ-na và danh từ).</p><p>Quá khứ: でした／だった. Đây là mẫu câu nền tảng nhất của tiếng Nhật.</p>',
    examples: [
      { sentence: '私は学生です。', pronunciation: 'わたしはがくせいです。', meaningVi: 'Tôi là sinh viên.' },
      { sentence: '田中さんは親切です。', pronunciation: 'たなかさんはしんせつです。', meaningVi: 'Anh Tanaka rất tốt bụng.' },
      { sentence: '昨日は日曜日でした。', pronunciation: 'きのうはにちようびでした。', meaningVi: 'Hôm qua là chủ nhật.' },
    ],
    commonMistakes: '❌ 私は学生だです。 → ✅ 私は学生です。 (không dùng だ và です cùng lúc)',
    comparedWith: 'So với である (văn viết trang trọng): です dùng trong hội thoại lịch sự hằng ngày.',
  },
  {
    level: 'N5',
    title: '〜じゃありません — không phải là (phủ định danh từ)',
    structure: 'Danh từ + じゃありません／ではありません',
    explanation: '<p>Phủ định của です với danh từ và tính từ-na. <strong>ではありません</strong> trang trọng hơn <strong>じゃありません</strong>. Trong văn nói thân mật dùng じゃない.</p>',
    examples: [
      { sentence: '私は先生じゃありません。', pronunciation: 'わたしはせんせいじゃありません。', meaningVi: 'Tôi không phải là giáo viên.' },
      { sentence: 'ここは図書館ではありません。', pronunciation: 'ここはとしょかんではありません。', meaningVi: 'Đây không phải là thư viện.' },
      { sentence: '彼は日本人じゃない。', pronunciation: 'かれはにほんじんじゃない。', meaningVi: 'Anh ấy không phải người Nhật.' },
    ],
    commonMistakes: '❌ 学生じゃないです を dùng trong văn trang trọng → ✅ 学生ではありません (trang trọng hơn)',
    comparedWith: 'Tính từ-i phủ định bằng くない (高くない), KHÔNG dùng じゃない cho tính từ-i.',
  },
  {
    level: 'N5',
    title: 'Trợ từ は — nêu chủ đề',
    structure: 'Danh từ + は + phần thuyết minh',
    explanation: '<p><strong>は</strong> (đọc là "wa") đánh dấu <em>chủ đề</em> của câu — điều người nói muốn nói về. Thông tin sau は là phần quan trọng.</p><p>は cũng dùng để so sánh, đối chiếu hai sự vật.</p>',
    examples: [
      { sentence: '私はベトナム人です。', pronunciation: 'わたしはべとなむじんです。', meaningVi: 'Tôi là người Việt Nam.' },
      { sentence: '今日は暑いです。', pronunciation: 'きょうはあついです。', meaningVi: 'Hôm nay trời nóng.' },
      { sentence: '肉は食べますが、魚は食べません。', pronunciation: 'にくはたべますが、さかなはたべません。', meaningVi: 'Thịt thì tôi ăn, nhưng cá thì không.' },
    ],
    commonMistakes: '❌ Đọc は là "ha" khi làm trợ từ → ✅ đọc là "wa". ❌ Dùng は sau từ để hỏi (誰は？) → ✅ 誰が？',
    comparedWith: 'は nêu chủ đề (thông tin cũ), が đánh dấu chủ ngữ (thông tin mới, nhấn mạnh). Xem thêm mục trợ từ が.',
  },
  {
    level: 'N5',
    title: 'Trợ từ が — chủ ngữ, nhấn mạnh',
    structure: 'Danh từ + が + động từ／tính từ',
    explanation: '<p><strong>が</strong> đánh dấu chủ ngữ ngữ pháp, đặc biệt khi đưa ra <em>thông tin mới</em>, trả lời từ để hỏi, hoặc trong các mẫu 〜がある／いる, 〜が好き, 〜が上手, 〜が分かる.</p>',
    examples: [
      { sentence: '雨が降っています。', pronunciation: 'あめがふっています。', meaningVi: 'Trời đang mưa.' },
      { sentence: '誰が来ましたか。— 田中さんが来ました。', pronunciation: 'だれがきましたか。— たなかさんがきました。', meaningVi: 'Ai đã đến? — Anh Tanaka đã đến.' },
      { sentence: '私は日本語が少し分かります。', pronunciation: 'わたしはにほんごがすこしわかります。', meaningVi: 'Tôi hiểu tiếng Nhật một chút.' },
    ],
    commonMistakes: '❌ 私はすしが食べます → ✅ 私はすしを食べます (động từ hành động dùng を; が dùng với 好き／分かる／できる...)',
    comparedWith: 'が giới thiệu thông tin mới; は nói tiếp về chủ đề đã biết. 「猫がいます。その猫は白いです。」',
  },
  {
    level: 'N5',
    title: 'Trợ từ を — tân ngữ trực tiếp',
    structure: 'Danh từ + を + động từ tha động',
    explanation: '<p><strong>を</strong> đánh dấu tân ngữ trực tiếp của động từ. Ngoài ra を còn dùng với động từ di chuyển để chỉ nơi đi qua (公園を散歩する) hoặc nơi rời khỏi (家を出る).</p>',
    examples: [
      { sentence: '毎朝コーヒーを飲みます。', pronunciation: 'まいあさこーひーをのみます。', meaningVi: 'Mỗi sáng tôi uống cà phê.' },
      { sentence: '公園を散歩します。', pronunciation: 'こうえんをさんぽします。', meaningVi: 'Tôi đi dạo trong công viên.' },
      { sentence: '七時に家を出ます。', pronunciation: 'しちじにいえをでます。', meaningVi: 'Tôi ra khỏi nhà lúc 7 giờ.' },
    ],
    commonMistakes: '❌ 日本語をできます → ✅ 日本語ができます (できる đi với が)',
    comparedWith: 'を = tân ngữ chịu tác động; に = đích đến. 「バスに乗る」 (lên xe buýt) chứ không phải バスを乗る.',
  },
  {
    level: 'N5',
    title: 'Trợ từ に — thời điểm, nơi tồn tại, đích đến',
    structure: 'Thời gian／Nơi chốn／Người + に',
    explanation: '<p><strong>に</strong> có nhiều cách dùng chính ở N5: (1) thời điểm cụ thể (三時に), (2) nơi tồn tại với ある／いる (部屋にある), (3) đích đến của di chuyển (日本に行く), (4) người nhận (友達にあげる).</p>',
    examples: [
      { sentence: '毎晩十一時に寝ます。', pronunciation: 'まいばんじゅういちじにねます。', meaningVi: 'Mỗi tối tôi ngủ lúc 11 giờ.' },
      { sentence: '机の上に本があります。', pronunciation: 'つくえのうえにほんがあります。', meaningVi: 'Trên bàn có quyển sách.' },
      { sentence: '来年日本に行きます。', pronunciation: 'らいねんにほんにいきます。', meaningVi: 'Năm sau tôi sẽ đi Nhật.' },
    ],
    commonMistakes: '❌ 昨日に映画を見ました → ✅ 昨日映画を見ました (昨日／今日／明日 không cần に)',
    comparedWith: 'に = nơi tồn tại (tĩnh); で = nơi diễn ra hành động (động). 「教室にいます」 vs 「教室で勉強します」.',
  },
  {
    level: 'N5',
    title: 'Trợ từ で — nơi hành động, phương tiện',
    structure: 'Danh từ + で + động từ hành động',
    explanation: '<p><strong>で</strong> chỉ: (1) nơi diễn ra hành động (図書館で勉強する), (2) phương tiện, công cụ (電車で行く、箸で食べる), (3) phạm vi (世界で一番), (4) nguyên nhân (病気で休む).</p>',
    examples: [
      { sentence: 'レストランで晩ご飯を食べました。', pronunciation: 'れすとらんでばんごはんをたべました。', meaningVi: 'Tôi đã ăn tối ở nhà hàng.' },
      { sentence: '自転車で学校へ行きます。', pronunciation: 'じてんしゃでがっこうへいきます。', meaningVi: 'Tôi đến trường bằng xe đạp.' },
      { sentence: '日本で富士山が一番高いです。', pronunciation: 'にほんでふじさんがいちばんたかいです。', meaningVi: 'Ở Nhật, núi Phú Sĩ cao nhất.' },
    ],
    commonMistakes: '❌ 公園にサッカーをします → ✅ 公園でサッカーをします (nơi hành động dùng で)',
    comparedWith: 'で = nơi xảy ra hành động; に = nơi tồn tại／đích đến.',
  },
  {
    level: 'N5',
    title: 'Trợ từ へ — hướng di chuyển',
    structure: 'Danh từ chỉ nơi chốn + へ + động từ di chuyển',
    explanation: '<p><strong>へ</strong> (đọc là "e") chỉ hướng, phương hướng di chuyển. Trong đa số trường hợp có thể thay bằng に, nhưng へ nhấn mạnh "hướng về" hơn là "điểm đến".</p>',
    examples: [
      { sentence: '来週、大阪へ行きます。', pronunciation: 'らいしゅう、おおさかへいきます。', meaningVi: 'Tuần sau tôi đi Osaka.' },
      { sentence: '何時に家へ帰りますか。', pronunciation: 'なんじにいえへかえりますか。', meaningVi: 'Mấy giờ bạn về nhà?' },
      { sentence: '友達への手紙を書きました。', pronunciation: 'ともだちへのてがみをかきました。', meaningVi: 'Tôi đã viết thư gửi bạn.' },
    ],
    commonMistakes: '❌ Đọc へ là "he" khi làm trợ từ → ✅ đọc là "e".',
    comparedWith: 'へ ≈ に với động từ di chuyển; nhưng chỉ へ mới đứng trước の được (友達への手紙).',
  },
  {
    level: 'N5',
    title: 'Trợ từ と — "và", "cùng với"',
    structure: 'Danh từ + と + Danh từ ／ Người + と + động từ',
    explanation: '<p><strong>と</strong> nối hai danh từ ("và" — liệt kê đầy đủ) hoặc chỉ người cùng thực hiện hành động ("cùng với"). と còn dùng để trích dẫn (〜と言う、〜と思う).</p>',
    examples: [
      { sentence: 'パンと卵を買いました。', pronunciation: 'ぱんとたまごをかいました。', meaningVi: 'Tôi đã mua bánh mì và trứng.' },
      { sentence: '友達と映画を見に行きました。', pronunciation: 'ともだちとえいがをみにいきました。', meaningVi: 'Tôi đã đi xem phim cùng bạn.' },
      { sentence: '母と電話で話しました。', pronunciation: 'ははとでんわではなしました。', meaningVi: 'Tôi đã nói chuyện điện thoại với mẹ.' },
    ],
    commonMistakes: '❌ Dùng と để liệt kê chưa hết (khi chỉ nêu ví dụ) → ✅ dùng や khi liệt kê không đầy đủ.',
    comparedWith: 'と liệt kê trọn vẹn; や liệt kê đại diện (A や B など = A, B v.v...).',
  },
  {
    level: 'N5',
    title: 'Trợ từ も — "cũng"',
    structure: 'Danh từ + も (thay thế は／が／を)',
    explanation: '<p><strong>も</strong> nghĩa là "cũng", thay thế vị trí của は, が, を. Với các trợ từ khác thì thêm vào sau: にも, でも, へも. 「何も＋phủ định」= "không... gì cả".</p>',
    examples: [
      { sentence: '私も日本語を勉強しています。', pronunciation: 'わたしもにほんごをべんきょうしています。', meaningVi: 'Tôi cũng đang học tiếng Nhật.' },
      { sentence: '昨日は何も食べませんでした。', pronunciation: 'きのうはなにもたべませんでした。', meaningVi: 'Hôm qua tôi không ăn gì cả.' },
      { sentence: '東京にも大阪にも行ったことがあります。', pronunciation: 'とうきょうにもおおさかにもいったことがあります。', meaningVi: 'Tôi từng đi cả Tokyo lẫn Osaka.' },
    ],
    commonMistakes: '❌ 私もは学生です → ✅ 私も学生です (も thay thế は, không đứng cùng)',
    comparedWith: 'も thay thế は／が／を nhưng cộng gộp với に／で／へ (にも, でも, へも).',
  },
  {
    level: 'N5',
    title: '〜から〜まで — từ... đến...',
    structure: 'Danh từ (thời gian/nơi chốn) + から + Danh từ + まで',
    explanation: '<p><strong>から</strong> chỉ điểm bắt đầu, <strong>まで</strong> chỉ điểm kết thúc, dùng được cho cả thời gian lẫn không gian. Có thể dùng riêng từng trợ từ.</p>',
    examples: [
      { sentence: '銀行は九時から三時までです。', pronunciation: 'ぎんこうはくじからさんじまでです。', meaningVi: 'Ngân hàng mở cửa từ 9 giờ đến 3 giờ.' },
      { sentence: '家から駅まで歩いて十分です。', pronunciation: 'いえからえきまであるいてじゅっぷんです。', meaningVi: 'Từ nhà đến ga đi bộ mất 10 phút.' },
      { sentence: 'ハノイから東京まで飛行機で六時間かかります。', pronunciation: 'はのいからとうきょうまでひこうきでろくじかんかかります。', meaningVi: 'Từ Hà Nội đến Tokyo đi máy bay mất 6 tiếng.' },
    ],
    commonMistakes: '❌ Nhầm まで với までに: まで = liên tục đến thời điểm đó; までに = hạn chót (làm xong trước thời điểm đó).',
    comparedWith: 'から còn có nghĩa "vì" khi đứng sau mệnh đề (雨だから行きません).',
  },
  {
    level: 'N5',
    title: 'Trợ từ の — sở hữu, bổ nghĩa danh từ',
    structure: 'Danh từ 1 + の + Danh từ 2',
    explanation: '<p><strong>の</strong> nối hai danh từ: sở hữu (私の本), thuộc tính (日本語の先生), xuất xứ (ベトナムのコーヒー). Danh từ 2 có thể lược bỏ khi đã rõ (これは私のです).</p>',
    examples: [
      { sentence: 'これは私の傘です。', pronunciation: 'これはわたしのかさです。', meaningVi: 'Đây là ô của tôi.' },
      { sentence: '彼女は日本語の先生です。', pronunciation: 'かのじょはにほんごのせんせいです。', meaningVi: 'Cô ấy là giáo viên tiếng Nhật.' },
      { sentence: 'このかばんは誰のですか。', pronunciation: 'このかばんはだれのですか。', meaningVi: 'Cái túi này là của ai?' },
    ],
    commonMistakes: '❌ 大きいの犬 → ✅ 大きい犬 (tính từ-i bổ nghĩa trực tiếp, không cần の)',
    comparedWith: 'Tính từ-na nối danh từ bằng な (きれいな花), không phải の.',
  },
  {
    level: 'N5',
    title: '〜か — câu hỏi',
    structure: 'Câu + か。',
    explanation: '<p>Thêm <strong>か</strong> vào cuối câu để tạo câu hỏi, không đảo ngữ, không cần dấu hỏi. 「AですかBですか」 = câu hỏi lựa chọn. Từ để hỏi: 何(なに)、誰(だれ)、どこ、いつ、どう...</p>',
    examples: [
      { sentence: 'これは何ですか。', pronunciation: 'これはなんですか。', meaningVi: 'Đây là cái gì?' },
      { sentence: '明日学校へ行きますか。', pronunciation: 'あしたがっこうへいきますか。', meaningVi: 'Ngày mai bạn có đến trường không?' },
      { sentence: 'コーヒーですか、お茶ですか。', pronunciation: 'こーひーですか、おちゃですか。', meaningVi: 'Bạn uống cà phê hay trà?' },
    ],
    commonMistakes: '❌ 何ですか？ viết thêm dấu ? trong văn trang trọng → ✅ chỉ cần か và dấu 。',
    comparedWith: 'Văn nói thân mật thường bỏ か và lên giọng cuối câu: 行く？',
  },
  {
    level: 'N5',
    title: 'あります／います — tồn tại (có)',
    structure: 'Nơi chốn + に + Danh từ + が + あります(vật)／います(người, động vật)',
    explanation: '<p><strong>あります</strong> dùng cho vật vô tri, cây cối; <strong>います</strong> dùng cho người và động vật. Ngoài nghĩa tồn tại, あります còn nghĩa "sở hữu" (時間があります) và "diễn ra" (会議があります).</p>',
    examples: [
      { sentence: '冷蔵庫に牛乳があります。', pronunciation: 'れいぞうこにぎゅうにゅうがあります。', meaningVi: 'Trong tủ lạnh có sữa.' },
      { sentence: '教室に学生がいます。', pronunciation: 'きょうしつにがくせいがいます。', meaningVi: 'Trong lớp có học sinh.' },
      { sentence: '週末、時間がありますか。', pronunciation: 'しゅうまつ、じかんがありますか。', meaningVi: 'Cuối tuần bạn có thời gian không?' },
    ],
    commonMistakes: '❌ 犬があります → ✅ 犬がいます (động vật dùng います)',
    comparedWith: 'あります／います = tồn tại; です = định nghĩa "là".',
  },
];

const JA_GRAMMAR_N5B: GrammarSeed[] = [
  {
    level: 'N5',
    title: '〜ます／ません／ました — thì lịch sự của động từ',
    structure: 'V-ます／V-ません／V-ました／V-ませんでした',
    explanation: '<p>Đuôi <strong>ます</strong> là dạng lịch sự của động từ: ます (hiện tại/tương lai khẳng định), ません (phủ định), ました (quá khứ), ませんでした (quá khứ phủ định). Tiếng Nhật không chia theo ngôi.</p>',
    examples: [
      { sentence: '毎日日本語を勉強します。', pronunciation: 'まいにちにほんごをべんきょうします。', meaningVi: 'Hằng ngày tôi học tiếng Nhật.' },
      { sentence: '朝ご飯を食べませんでした。', pronunciation: 'あさごはんをたべませんでした。', meaningVi: 'Tôi đã không ăn sáng.' },
      { sentence: '昨日映画を見ました。', pronunciation: 'きのうえいがをみました。', meaningVi: 'Hôm qua tôi đã xem phim.' },
    ],
    commonMistakes: '❌ 明日行きました → ✅ 明日行きます (tương lai dùng thì hiện tại)',
    comparedWith: 'Dạng ます = lịch sự; dạng từ điển／た = thân mật (dùng với bạn bè, gia đình).',
  },
  {
    level: 'N5',
    title: 'Thể て — cách chia và vai trò',
    structure: 'V nhóm 1: う→って, く→いて, ぐ→いで, す→して, む/ぶ/ぬ→んで ／ nhóm 2: る→て ／ 来る→きて, する→して',
    explanation: '<p>Thể <strong>て</strong> là dạng biến đổi quan trọng nhất của động từ, dùng để: nối câu (食べて、寝ます), nhờ vả (〜てください), diễn tả đang làm (〜ています) và hàng loạt mẫu ngữ pháp khác.</p><p>Ngoại lệ: 行く→行って.</p>',
    examples: [
      { sentence: '朝起きて、シャワーを浴びて、会社へ行きます。', pronunciation: 'あさおきて、しゃわーをあびて、かいしゃへいきます。', meaningVi: 'Sáng tôi dậy, tắm rồi đi làm.' },
      { sentence: '買って、書いて、泳いで、話して、読んで', pronunciation: 'かって、かいて、およいで、はなして、よんで', meaningVi: '(ví dụ cách chia thể て các nhóm)' },
      { sentence: '窓を開けて、掃除をしました。', pronunciation: 'まどをあけて、そうじをしました。', meaningVi: 'Tôi mở cửa sổ rồi dọn dẹp.' },
    ],
    commonMistakes: '❌ 行く→行いて → ✅ 行って (ngoại lệ quan trọng nhất)',
    comparedWith: 'Nối câu bằng て giữ nguyên chủ ngữ và trình tự thời gian; khác với から (lý do).',
  },
  {
    level: 'N5',
    title: '〜てください — hãy làm... (nhờ vả, yêu cầu)',
    structure: 'V-て + ください',
    explanation: '<p>Dùng để nhờ hoặc yêu cầu ai làm gì một cách lịch sự. Lịch sự hơn nữa: 〜てくださいませんか. Thân mật: bỏ ください (ちょっと待って).</p>',
    examples: [
      { sentence: 'もう一度言ってください。', pronunciation: 'もういちどいってください。', meaningVi: 'Xin hãy nói lại một lần nữa.' },
      { sentence: 'ここに名前を書いてください。', pronunciation: 'ここになまえをかいてください。', meaningVi: 'Hãy viết tên vào đây.' },
      { sentence: 'ゆっくり話してください。', pronunciation: 'ゆっくりはなしてください。', meaningVi: 'Xin hãy nói chậm thôi.' },
    ],
    commonMistakes: '❌ 食べてください dùng khi mời bề trên → ✅ 召し上がってください (kính ngữ)',
    comparedWith: '〜ないでください = "xin đừng làm...". 〜てくれませんか mềm mỏng hơn てください.',
  },
  {
    level: 'N5',
    title: '〜ています — đang làm／trạng thái',
    structure: 'V-て + います',
    explanation: '<p>Diễn tả: (1) hành động đang diễn ra (今食べています), (2) trạng thái kéo dài (結婚しています、住んでいます), (3) thói quen lặp lại (毎朝走っています), (4) nghề nghiệp (銀行で働いています).</p>',
    examples: [
      { sentence: '今、雨が降っています。', pronunciation: 'いま、あめがふっています。', meaningVi: 'Bây giờ trời đang mưa.' },
      { sentence: '兄は東京に住んでいます。', pronunciation: 'あにはとうきょうにすんでいます。', meaningVi: 'Anh tôi sống ở Tokyo.' },
      { sentence: '田中さんを知っていますか。', pronunciation: 'たなかさんをしっていますか。', meaningVi: 'Bạn có biết anh Tanaka không?' },
    ],
    commonMistakes: '❌ 知っていません → ✅ 知りません (phủ định của 知っています là 知りません)',
    comparedWith: '〜ている với động từ chuyển trạng thái (結婚する、死ぬ) = trạng thái kết quả, không phải "đang".',
  },
  {
    level: 'N5',
    title: '〜てもいいです — được phép làm',
    structure: 'V-て + もいいです(か)',
    explanation: '<p>Xin phép hoặc cho phép làm gì. Câu hỏi 〜てもいいですか = "tôi làm... được không?". Trả lời cho phép: はい、どうぞ／いいですよ. Từ chối nhẹ: すみません、ちょっと…</p>',
    examples: [
      { sentence: 'ここで写真を撮ってもいいですか。', pronunciation: 'ここでしゃしんをとってもいいですか。', meaningVi: 'Tôi chụp ảnh ở đây được không?' },
      { sentence: '窓を開けてもいいですか。', pronunciation: 'まどをあけてもいいですか。', meaningVi: 'Tôi mở cửa sổ được không?' },
      { sentence: '鉛筆で書いてもいいです。', pronunciation: 'えんぴつでかいてもいいです。', meaningVi: 'Viết bằng bút chì cũng được.' },
    ],
    commonMistakes: '❌ Trả lời từ chối bằng いいえ、いけません với người lạ (quá gắt) → ✅ すみません、ちょっと…',
    comparedWith: 'Ngược nghĩa với 〜てはいけません (không được phép).',
  },
  {
    level: 'N5',
    title: '〜てはいけません — không được làm (cấm)',
    structure: 'V-て + はいけません',
    explanation: '<p>Diễn tả sự cấm đoán, dùng cho quy tắc, luật lệ hoặc người trên nói với người dưới. Văn nói: 〜ちゃいけない／〜じゃいけない.</p>',
    examples: [
      { sentence: 'ここでタバコを吸ってはいけません。', pronunciation: 'ここでたばこをすってはいけません。', meaningVi: 'Không được hút thuốc ở đây.' },
      { sentence: '授業中に携帯を使ってはいけません。', pronunciation: 'じゅぎょうちゅうにけいたいをつかってはいけません。', meaningVi: 'Trong giờ học không được dùng điện thoại.' },
      { sentence: '芝生に入ってはいけません。', pronunciation: 'しばふにはいってはいけません。', meaningVi: 'Không được giẫm lên cỏ.' },
    ],
    commonMistakes: '❌ Dùng với người trên (先生、帰ってはいけません) → ✅ chỉ dùng cho quy tắc hoặc người dưới.',
    comparedWith: '〜ないでください = nhờ đừng làm (mềm); 〜てはいけません = cấm (mạnh, quy tắc).',
  },
  {
    level: 'N5',
    title: '〜てから — sau khi làm...',
    structure: 'V1-て + から、V2',
    explanation: '<p>Nhấn mạnh trình tự: làm xong V1 rồi mới làm V2. Khác với chỉ nối bằng て, てから nhấn mạnh "sau khi xong việc thứ nhất".</p>',
    examples: [
      { sentence: '宿題をしてから、テレビを見ます。', pronunciation: 'しゅくだいをしてから、てれびをみます。', meaningVi: 'Làm bài tập xong tôi mới xem ti vi.' },
      { sentence: '手を洗ってから、ご飯を食べましょう。', pronunciation: 'てをあらってから、ごはんをたべましょう。', meaningVi: 'Rửa tay xong rồi hãy ăn cơm.' },
      { sentence: '日本に来てから、三か月になります。', pronunciation: 'にほんにきてから、さんかげつになります。', meaningVi: 'Từ khi đến Nhật đã được ba tháng.' },
    ],
    commonMistakes: '❌ Dùng てから nhiều lần trong một câu → ✅ chỉ dùng một てから, còn lại nối bằng て.',
    comparedWith: '〜たあとで cũng nghĩa "sau khi" nhưng trình tự lỏng hơn; てから nhấn mạnh nối tiếp ngay.',
  },
  {
    level: 'N5',
    title: 'Thể ない — cách chia phủ định thân mật',
    structure: 'V nhóm 1: đổi âm う→あ + ない (書く→書かない) ／ nhóm 2: る→ない ／ 来る→こない, する→しない',
    explanation: '<p>Thể <strong>ない</strong> là dạng phủ định thân mật của động từ, đồng thời là gốc của nhiều mẫu ngữ pháp: 〜ないでください, 〜なければならない, 〜ないほうがいい...</p><p>Chú ý: 会う→会わない (không phải 会あない).</p>',
    examples: [
      { sentence: '今日はどこへも行かない。', pronunciation: 'きょうはどこへもいかない。', meaningVi: 'Hôm nay tôi không đi đâu cả.' },
      { sentence: '肉を食べない人もいます。', pronunciation: 'にくをたべないひともいます。', meaningVi: 'Cũng có người không ăn thịt.' },
      { sentence: '明日は来ない?', pronunciation: 'あしたはこない?', meaningVi: 'Mai cậu không đến à?' },
    ],
    commonMistakes: '❌ 買う→買あない → ✅ 買わない (động từ đuôi う chuyển thành わ)',
    comparedWith: 'ません = phủ định lịch sự; ない = phủ định thân mật, dùng trong mẫu ngữ pháp.',
  },
  {
    level: 'N5',
    title: '〜ないでください — xin đừng làm...',
    structure: 'V-ない + でください',
    explanation: '<p>Nhờ ai đó <em>đừng</em> làm gì một cách lịch sự. Thêm 心配しないでください (đừng lo) là câu giao tiếp rất thông dụng.</p>',
    examples: [
      { sentence: 'ここにゴミを捨てないでください。', pronunciation: 'ここにごみをすてないでください。', meaningVi: 'Xin đừng vứt rác ở đây.' },
      { sentence: '心配しないでください。', pronunciation: 'しんぱいしないでください。', meaningVi: 'Xin đừng lo lắng.' },
      { sentence: '写真を撮らないでください。', pronunciation: 'しゃしんをとらないでください。', meaningVi: 'Xin đừng chụp ảnh.' },
    ],
    commonMistakes: '❌ 捨てないください → ✅ 捨てないでください (không được thiếu で)',
    comparedWith: '〜てはいけません cấm mạnh hơn; 〜ないでください là lời nhờ lịch sự.',
  },
  {
    level: 'N5',
    title: '〜なければなりません — phải làm...',
    structure: 'V-ない (bỏ い) + ければなりません ／ 〜なければいけません',
    explanation: '<p>Diễn tả nghĩa vụ "phải làm". Văn nói thường rút gọn thành <strong>〜なきゃ</strong> hoặc <strong>〜ないと</strong>. なりません thiên về nghĩa vụ chung, いけません thiên về hoàn cảnh cá nhân.</p>',
    examples: [
      { sentence: '明日までにレポートを出さなければなりません。', pronunciation: 'あしたまでにれぽーとをださなければなりません。', meaningVi: 'Tôi phải nộp báo cáo trước ngày mai.' },
      { sentence: '毎日薬を飲まなければいけません。', pronunciation: 'まいにちくすりをのまなければいけません。', meaningVi: 'Tôi phải uống thuốc hằng ngày.' },
      { sentence: 'もう帰らなきゃ。', pronunciation: 'もうかえらなきゃ。', meaningVi: 'Tôi phải về rồi.' },
    ],
    commonMistakes: '❌ 行かなければなりません khi chỉ là lựa chọn cá nhân nhẹ nhàng → có thể dùng 行かないと cho tự nhiên.',
    comparedWith: '〜なくてもいいです = không cần làm (ngược nghĩa).',
  },
  {
    level: 'N5',
    title: '〜なくてもいいです — không cần làm...',
    structure: 'V-ない (bỏ い) + くてもいいです',
    explanation: '<p>Diễn tả sự không cần thiết: "không làm cũng được". Đây là cách trả lời phổ biến cho câu hỏi 〜なければなりませんか.</p>',
    examples: [
      { sentence: '明日は来なくてもいいです。', pronunciation: 'あしたはこなくてもいいです。', meaningVi: 'Ngày mai bạn không cần đến cũng được.' },
      { sentence: '靴を脱がなくてもいいですか。', pronunciation: 'くつをぬがなくてもいいですか。', meaningVi: 'Không cởi giày có được không?' },
      { sentence: '全部食べなくてもいいですよ。', pronunciation: 'ぜんぶたべなくてもいいですよ。', meaningVi: 'Không cần ăn hết đâu.' },
    ],
    commonMistakes: '❌ 来ないでもいいです → ✅ 来なくてもいいです (ない → なくて)',
    comparedWith: '〜てもいいです = được phép làm; 〜なくてもいいです = được phép KHÔNG làm.',
  },
  {
    level: 'N5',
    title: 'Thể た + 〜たことがあります — đã từng...',
    structure: 'V-た + ことがあります',
    explanation: '<p>Thể <strong>た</strong> chia giống thể て (thay て→た). Mẫu 〜たことがあります diễn tả <em>kinh nghiệm</em> "đã từng làm". Phủ định: 〜たことがありません (chưa từng).</p>',
    examples: [
      { sentence: '富士山に登ったことがあります。', pronunciation: 'ふじさんにのぼったことがあります。', meaningVi: 'Tôi đã từng leo núi Phú Sĩ.' },
      { sentence: '納豆を食べたことがありますか。', pronunciation: 'なっとうをたべたことがありますか。', meaningVi: 'Bạn đã từng ăn natto chưa?' },
      { sentence: '日本のドラマを見たことがありません。', pronunciation: 'にほんのどらまをみたことがありません。', meaningVi: 'Tôi chưa từng xem phim truyền hình Nhật.' },
    ],
    commonMistakes: '❌ 昨日すしを食べたことがあります → ✅ 昨日すしを食べました (sự việc cụ thể vừa xảy ra dùng quá khứ thường)',
    comparedWith: '〜ました = quá khứ đơn thuần; 〜たことがある = kinh nghiệm trong đời.',
  },
  {
    level: 'N5',
    title: '〜たり〜たりします — nào là... nào là...',
    structure: 'V1-たり、V2-たり + します',
    explanation: '<p>Liệt kê <em>một vài</em> hành động tiêu biểu trong nhiều hành động (không theo trình tự). Cũng dùng với cặp từ trái nghĩa (行ったり来たり = đi đi lại lại).</p>',
    examples: [
      { sentence: '休みの日は本を読んだり、音楽を聞いたりします。', pronunciation: 'やすみのひはほんをよんだり、おんがくをきいたりします。', meaningVi: 'Ngày nghỉ tôi khi thì đọc sách, khi thì nghe nhạc.' },
      { sentence: '昨日は掃除したり、洗濯したりしました。', pronunciation: 'きのうはそうじしたり、せんたくしたりしました。', meaningVi: 'Hôm qua tôi dọn dẹp, giặt giũ các thứ.' },
      { sentence: '値段は上がったり下がったりしています。', pronunciation: 'ねだんはあがったりさがったりしています。', meaningVi: 'Giá cả cứ lên lên xuống xuống.' },
    ],
    commonMistakes: '❌ Dùng たり cho hành động theo trình tự chặt chẽ → ✅ dùng thể て khi có trình tự.',
    comparedWith: 'Thể て liệt kê theo trình tự; たり liệt kê ví dụ không theo thứ tự.',
  },
];

const JA_GRAMMAR_N5C: GrammarSeed[] = [
  {
    level: 'N5',
    title: '〜たいです — muốn làm...',
    structure: 'V-ます (bỏ ます) + たいです',
    explanation: '<p>Diễn tả mong muốn của <em>bản thân</em> người nói. たい chia như tính từ-i: たくない (không muốn), たかった (đã muốn). Tân ngữ có thể dùng が hoặc を.</p><p>Không dùng たい để nói trực tiếp về mong muốn của người thứ ba — dùng たがっています.</p>',
    examples: [
      { sentence: '日本へ旅行に行きたいです。', pronunciation: 'にほんへりょこうにいきたいです。', meaningVi: 'Tôi muốn đi du lịch Nhật Bản.' },
      { sentence: '冷たい水が飲みたいです。', pronunciation: 'つめたいみずがのみたいです。', meaningVi: 'Tôi muốn uống nước lạnh.' },
      { sentence: '今日は何もしたくないです。', pronunciation: 'きょうはなにもしたくないです。', meaningVi: 'Hôm nay tôi chẳng muốn làm gì cả.' },
    ],
    commonMistakes: '❌ 田中さんは帰りたいです → ✅ 田中さんは帰りたがっています (người thứ ba dùng たがる)',
    comparedWith: '〜がほしい = muốn CÓ vật gì; 〜たい = muốn LÀM gì.',
  },
  {
    level: 'N5',
    title: '〜がほしいです — muốn có...',
    structure: 'Danh từ + が + ほしいです',
    explanation: '<p>Diễn tả mong muốn sở hữu một vật. ほしい chia như tính từ-i. Giống たい, không dùng trực tiếp cho người thứ ba (dùng ほしがっています).</p>',
    examples: [
      { sentence: '新しいパソコンがほしいです。', pronunciation: 'あたらしいぱそこんがほしいです。', meaningVi: 'Tôi muốn có một chiếc máy tính mới.' },
      { sentence: '誕生日に何がほしいですか。', pronunciation: 'たんじょうびになにがほしいですか。', meaningVi: 'Sinh nhật bạn muốn được tặng gì?' },
      { sentence: '今は車がほしくないです。', pronunciation: 'いまはくるまがほしくないです。', meaningVi: 'Bây giờ tôi không muốn có ô tô.' },
    ],
    commonMistakes: '❌ 水をほしいです → ✅ 水がほしいです (ほしい đi với が)',
    comparedWith: '〜たい (muốn làm) vs 〜がほしい (muốn có).',
  },
  {
    level: 'N5',
    title: '〜ましょう／ましょうか — cùng làm... nhé／để tôi...',
    structure: 'V-ます (bỏ ます) + ましょう(か)',
    explanation: '<p><strong>ましょう</strong> = rủ rê "cùng làm nhé" hoặc hưởng ứng lời mời. <strong>ましょうか</strong> có hai nghĩa: đề nghị giúp đỡ ("để tôi... nhé?") và hỏi ý cùng làm.</p>',
    examples: [
      { sentence: 'ちょっと休みましょう。', pronunciation: 'ちょっとやすみましょう。', meaningVi: 'Mình nghỉ một chút đi.' },
      { sentence: '荷物を持ちましょうか。', pronunciation: 'にもつをもちましょうか。', meaningVi: 'Để tôi xách hành lý giúp nhé?' },
      { sentence: '何時に会いましょうか。', pronunciation: 'なんじにあいましょうか。', meaningVi: 'Mấy giờ chúng ta gặp nhau nhỉ?' },
    ],
    commonMistakes: '❌ Dùng ましょう đáp lại đề nghị giúp đỡ → ✅ お願いします／すみません、ありがとうございます.',
    comparedWith: '〜ませんか lịch sự hơn, để mời; 〜ましょう thân thiện, quyết định cùng làm.',
  },
  {
    level: 'N5',
    title: '〜ませんか — bạn có... không? (lời mời)',
    structure: 'V-ます (bỏ ます) + ませんか',
    explanation: '<p>Mời ai đó làm gì một cách lịch sự, tôn trọng ý muốn của đối phương hơn ましょう. Nhận lời: いいですね／ぜひ. Từ chối khéo: すみません、ちょっと…</p>',
    examples: [
      { sentence: '一緒に昼ご飯を食べませんか。', pronunciation: 'いっしょにひるごはんをたべませんか。', meaningVi: 'Bạn ăn trưa cùng tôi không?' },
      { sentence: '週末、映画を見に行きませんか。', pronunciation: 'しゅうまつ、えいがをみにいきませんか。', meaningVi: 'Cuối tuần đi xem phim không?' },
      { sentence: 'うちに遊びに来ませんか。', pronunciation: 'うちにあそびにきませんか。', meaningVi: 'Bạn đến nhà tôi chơi không?' },
    ],
    commonMistakes: '❌ Trả lời từ chối thẳng いいえ、行きません (thô lỗ) → ✅ 行きたいんですが、ちょっと用事があって…',
    comparedWith: 'ませんか mời mở, tôn trọng đối phương; ましょう khi cả hai đã sẵn lòng.',
  },
  {
    level: 'N5',
    title: '〜のが好きです／上手です／下手です — thích／giỏi／kém làm gì',
    structure: 'V thể từ điển + のが + 好き／上手／下手です',
    explanation: '<p>Danh từ hoá động từ bằng <strong>の</strong> rồi dùng với 好き (thích), 嫌い (ghét), 上手 (giỏi), 下手 (kém), 速い... Đây là cách nói về sở thích và năng lực rất thông dụng.</p>',
    examples: [
      { sentence: '音楽を聞くのが好きです。', pronunciation: 'おんがくをきくのがすきです。', meaningVi: 'Tôi thích nghe nhạc.' },
      { sentence: '妹は絵を描くのが上手です。', pronunciation: 'いもうとはえをかくのがじょうずです。', meaningVi: 'Em gái tôi vẽ tranh giỏi.' },
      { sentence: '私は歌うのが下手です。', pronunciation: 'わたしはうたうのがへたです。', meaningVi: 'Tôi hát dở.' },
    ],
    commonMistakes: '❌ 泳ぐことが好き và 泳ぐのが好き đều đúng, nhưng ❌ 泳ぎのが好き là sai (phải dùng thể từ điển + の)',
    comparedWith: 'Khen người khác giỏi dùng 上手ですね; nói về mình giỏi thường dùng 得意です (khiêm tốn hơn).',
  },
  {
    level: 'N5',
    title: '〜より／〜のほうが — so sánh hơn',
    structure: 'A は B より + tính từ ／ B より A のほうが + tính từ',
    explanation: '<p><strong>より</strong> = "hơn (so với)". Mẫu câu hỏi lựa chọn: AとBとどちらが〜ですか, trả lời bằng 〜のほうが〜です.</p>',
    examples: [
      { sentence: '新幹線はバスより速いです。', pronunciation: 'しんかんせんはばすよりはやいです。', meaningVi: 'Shinkansen nhanh hơn xe buýt.' },
      { sentence: '犬と猫とどちらが好きですか。', pronunciation: 'いぬとねことどちらがすきですか。', meaningVi: 'Chó và mèo, bạn thích con nào hơn?' },
      { sentence: '猫のほうが好きです。', pronunciation: 'ねこのほうがすきです。', meaningVi: 'Tôi thích mèo hơn.' },
    ],
    commonMistakes: '❌ どちらがもっと好きですか → ✅ どちらが好きですか (không cần もっと trong câu hỏi so sánh)',
    comparedWith: 'So sánh nhất dùng 一番 trong phạm vi 〜で／〜の中で.',
  },
  {
    level: 'N5',
    title: '〜で一番〜 — so sánh nhất',
    structure: 'Phạm vi + で／の中で + 一番 + tính từ',
    explanation: '<p><strong>一番</strong> (いちばん) = "nhất". Nêu phạm vi so sánh bằng で hoặc の中で. Câu hỏi dùng 何／誰／どこ＋が一番.</p>',
    examples: [
      { sentence: 'クラスの中で誰が一番背が高いですか。', pronunciation: 'くらすのなかでだれがいちばんせがたかいですか。', meaningVi: 'Trong lớp ai cao nhất?' },
      { sentence: '日本料理の中で寿司が一番好きです。', pronunciation: 'にほんりょうりのなかですしがいちばんすきです。', meaningVi: 'Trong các món Nhật tôi thích sushi nhất.' },
      { sentence: '一年で八月が一番暑いです。', pronunciation: 'いちねんではちがつがいちばんあついです。', meaningVi: 'Trong năm, tháng 8 nóng nhất.' },
    ],
    commonMistakes: '❌ 一番もっと高い → ✅ 一番高い (không kết hợp một lúc)',
    comparedWith: 'より = so sánh giữa hai; 一番 = so sánh nhất trong một phạm vi.',
  },
  {
    level: 'N5',
    title: '〜とき — khi...',
    structure: 'Mệnh đề (thể thường) + とき、…',
    explanation: '<p><strong>とき</strong> = "khi, lúc". Thì của động từ trước とき rất quan trọng: V-る＋とき = trước/đang khi hành động chính; V-た＋とき = sau khi hành động đã xong.</p>',
    examples: [
      { sentence: '暇なとき、音楽を聞きます。', pronunciation: 'ひまなとき、おんがくをききます。', meaningVi: 'Lúc rảnh tôi nghe nhạc.' },
      { sentence: '日本へ行くとき、カメラを買いました。', pronunciation: 'にほんへいくとき、かめらをかいました。', meaningVi: 'Lúc (sắp) đi Nhật, tôi đã mua máy ảnh (mua ở Việt Nam).' },
      { sentence: '日本へ行ったとき、カメラを買いました。', pronunciation: 'にほんへいったとき、かめらをかいました。', meaningVi: 'Khi đến Nhật rồi, tôi đã mua máy ảnh (mua ở Nhật).' },
    ],
    commonMistakes: '❌ 子供のとき viết thành 子供とき → ✅ danh từ + の + とき; tính từ-na + な + とき.',
    comparedWith: '〜ながら = hai hành động đồng thời của cùng chủ ngữ; とき chỉ mốc thời gian.',
  },
  {
    level: 'N5',
    title: '〜まえに／〜たあとで — trước khi／sau khi',
    structure: 'V-る + まえに ／ V-た + あとで ／ Danh từ + の + まえに/あとで',
    explanation: '<p><strong>まえに</strong> luôn đi với thể từ điển (dù câu ở quá khứ). <strong>あとで</strong> đi với thể た hoặc danh từ + の.</p>',
    examples: [
      { sentence: '寝る前に歯を磨きます。', pronunciation: 'ねるまえにはをみがきます。', meaningVi: 'Trước khi ngủ tôi đánh răng.' },
      { sentence: 'ご飯を食べた後で、散歩しました。', pronunciation: 'ごはんをたべたあとで、さんぽしました。', meaningVi: 'Sau khi ăn cơm, tôi đã đi dạo.' },
      { sentence: '仕事の後で、ジムに行きます。', pronunciation: 'しごとのあとで、じむにいきます。', meaningVi: 'Sau giờ làm tôi đến phòng gym.' },
    ],
    commonMistakes: '❌ 寝たまえに → ✅ 寝るまえに (まえに luôn dùng thể từ điển)',
    comparedWith: '〜てから nhấn mạnh nối tiếp và điều kiện; 〜たあとで chỉ đơn thuần thứ tự.',
  },
  {
    level: 'N5',
    title: '〜でしょう — có lẽ, chắc là',
    structure: 'Thể thường (danh từ/tính từ-na bỏ だ) + でしょう',
    explanation: '<p><strong>でしょう</strong> diễn tả suy đoán "có lẽ, chắc là", hay dùng trong dự báo thời tiết. Nói với ngữ điệu lên giọng (でしょう?) = xác nhận "đúng không?". Thân mật: だろう.</p>',
    examples: [
      { sentence: '明日は雨が降るでしょう。', pronunciation: 'あしたはあめがふるでしょう。', meaningVi: 'Ngày mai có lẽ trời sẽ mưa.' },
      { sentence: '彼はもう家に着いたでしょう。', pronunciation: 'かれはもういえについたでしょう。', meaningVi: 'Chắc anh ấy đã về đến nhà rồi.' },
      { sentence: 'この問題は難しいでしょう?', pronunciation: 'このもんだいはむずかしいでしょう?', meaningVi: 'Bài này khó đúng không?' },
    ],
    commonMistakes: '❌ 雨でしょうです → ✅ 雨でしょう (でしょう đứng cuối, không thêm です)',
    comparedWith: 'かもしれません (xác suất thấp hơn, ~50%) < でしょう (khá chắc) < です (khẳng định).',
  },
  {
    level: 'N5',
    title: '〜くなります／になります — trở nên...',
    structure: 'Tính từ-i (bỏ い) + くなります ／ Tính từ-na／Danh từ + になります',
    explanation: '<p>Diễn tả sự thay đổi trạng thái "trở nên". Tính từ-i: 寒い→寒くなる; tính từ-na và danh từ: 元気→元気になる, 医者→医者になる.</p>',
    examples: [
      { sentence: '最近、寒くなりましたね。', pronunciation: 'さいきん、さむくなりましたね。', meaningVi: 'Dạo này trời trở lạnh rồi nhỉ.' },
      { sentence: '日本語が上手になりたいです。', pronunciation: 'にほんごがじょうずになりたいです。', meaningVi: 'Tôi muốn giỏi tiếng Nhật hơn.' },
      { sentence: '弟は医者になりました。', pronunciation: 'おとうとはいしゃになりました。', meaningVi: 'Em trai tôi đã trở thành bác sĩ.' },
    ],
    commonMistakes: '❌ 寒いになります → ✅ 寒くなります (tính từ-i đổi い thành く)',
    comparedWith: '〜くします／にします = chủ động làm cho thay đổi (部屋を暖かくする).',
  },
  {
    level: 'N5',
    title: '〜という — gọi là, có tên là',
    structure: 'Tên riêng + という + Danh từ',
    explanation: '<p>Giới thiệu tên gọi mà người nghe có thể chưa biết: 「〜という + danh từ」 = "cái/người/nơi gọi là...". Hỏi tên: 何という〜ですか.</p>',
    examples: [
      { sentence: 'フォーというベトナム料理を知っていますか。', pronunciation: 'ふぉーというべとなむりょうりをしっていますか。', meaningVi: 'Bạn có biết món Việt Nam tên là phở không?' },
      { sentence: '「さくら」という店で働いています。', pronunciation: '「さくら」というみせではたらいています。', meaningVi: 'Tôi làm ở cửa hàng tên là "Sakura".' },
      { sentence: 'これは日本語で何といいますか。', pronunciation: 'これはにほんごでなんといいますか。', meaningVi: 'Cái này tiếng Nhật gọi là gì?' },
    ],
    commonMistakes: '❌ フォーとベトナム料理 (thiếu いう) → ✅ フォーというベトナム料理',
    comparedWith: '〜と言いました = trích lời nói; 〜という〜 = giới thiệu tên gọi.',
  },
  {
    level: 'N5',
    title: '〜に行きます／に来ます — đi/đến để làm gì',
    structure: 'V-ます (bỏ ます)／Danh từ động tác + に + 行きます／来ます／帰ります',
    explanation: '<p>Diễn tả mục đích của việc di chuyển: "đi đâu đó ĐỂ làm gì". Trước に là gốc động từ (買いに) hoặc danh từ chỉ hoạt động (買い物に、旅行に).</p>',
    examples: [
      { sentence: 'スーパーへ牛乳を買いに行きます。', pronunciation: 'すーぱーへぎゅうにゅうをかいにいきます。', meaningVi: 'Tôi đi siêu thị để mua sữa.' },
      { sentence: '友達が遊びに来ました。', pronunciation: 'ともだちがあそびにきました。', meaningVi: 'Bạn tôi đã đến chơi.' },
      { sentence: '日本へ日本語を勉強しに来ました。', pronunciation: 'にほんへにほんごをべんきょうしにきました。', meaningVi: 'Tôi đến Nhật để học tiếng Nhật.' },
    ],
    commonMistakes: '❌ 買うに行きます → ✅ 買いに行きます (dùng gốc ます, không dùng thể từ điển)',
    comparedWith: '〜ために (N4) trang trọng và rộng hơn; 〜に行く chỉ dùng với động từ di chuyển.',
  },
];

// ============================ DATA: GRAMMAR N4 ============================
const JA_GRAMMAR_N4A: GrammarSeed[] = [
  {
    level: 'N4',
    title: '〜と思います — tôi nghĩ rằng...',
    structure: 'Thể thường + と思います',
    explanation: '<p>Nêu ý kiến, suy đoán của người nói. Trước と là <em>thể thường</em> (だ với danh từ/tính từ-na). 〜と思っています = suy nghĩ ấp ủ từ trước hoặc ý nghĩ của người thứ ba.</p>',
    examples: [
      { sentence: '明日は晴れると思います。', pronunciation: 'あしたははれるとおもいます。', meaningVi: 'Tôi nghĩ ngày mai trời sẽ nắng.' },
      { sentence: '日本の生活は便利だと思います。', pronunciation: 'にほんのせいかつはべんりだとおもいます。', meaningVi: 'Tôi thấy cuộc sống ở Nhật rất tiện lợi.' },
      { sentence: '彼は来ないと思います。', pronunciation: 'かれはこないとおもいます。', meaningVi: 'Tôi nghĩ anh ấy sẽ không đến.' },
    ],
    commonMistakes: '❌ 便利と思います → ✅ 便利だと思います (danh từ/tính từ-na phải thêm だ)',
    comparedWith: '〜と思う (ý kiến của tôi lúc này) vs 〜と思っている (suy nghĩ kéo dài/của người khác).',
  },
  {
    level: 'N4',
    title: '〜と言いました／〜と言っていました — đã nói rằng...',
    structure: 'Câu trích dẫn + と言いました ／ 「...」と言いました',
    explanation: '<p>Trích dẫn lời nói: trực tiếp dùng 「」, gián tiếp dùng thể thường + と. <strong>〜と言っていました</strong> dùng khi truyền đạt lại lời ai đó cho người thứ ba (rất hay gặp trong bài nghe).</p>',
    examples: [
      { sentence: '先生は「明日試験があります」と言いました。', pronunciation: 'せんせいは「あしたしけんがあります」といいました。', meaningVi: 'Thầy giáo nói: "Ngày mai có bài thi".' },
      { sentence: '田中さんは来週国へ帰ると言っていました。', pronunciation: 'たなかさんはらいしゅうくにへかえるといっていました。', meaningVi: 'Anh Tanaka bảo là tuần sau sẽ về nước.' },
      { sentence: '母は疲れたと言っていました。', pronunciation: 'たいはつかれたといっていました。', meaningVi: 'Mẹ tôi nói là mẹ mệt.' },
    ],
    commonMistakes: '❌ 帰りますと言っていました → ✅ 帰ると言っていました (trích gián tiếp dùng thể thường)',
    comparedWith: '〜そうです (truyền văn) = "nghe nói" không rõ nguồn; 〜と言っていました = truyền đạt lời của người cụ thể.',
  },
  {
    level: 'N4',
    title: '〜かもしれません — có thể, không chừng',
    structure: 'Thể thường (danh từ/tính từ-na bỏ だ) + かもしれません',
    explanation: '<p>Suy đoán với độ chắc chắn thấp (~50% trở xuống): "có thể, biết đâu". Văn nói rút gọn: 〜かも.</p>',
    examples: [
      { sentence: '午後から雨が降るかもしれません。', pronunciation: 'ごごからあめがふるかもしれません。', meaningVi: 'Từ chiều trời có thể mưa.' },
      { sentence: '彼はもう帰ったかもしれません。', pronunciation: 'かれはもうかえったかもしれません。', meaningVi: 'Có thể anh ấy đã về rồi.' },
      { sentence: '来年、日本へ行けるかもしれない。', pronunciation: 'らいねん、にほんへいけるかもしれない。', meaningVi: 'Năm sau không chừng tôi đi Nhật được.' },
    ],
    commonMistakes: '❌ 雨だかもしれません → ✅ 雨かもしれません (bỏ だ trước かも)',
    comparedWith: 'Mức độ chắc chắn: かもしれない (thấp) < でしょう／だろう (khá cao) < はずです (rất cao, có căn cứ).',
  },
  {
    level: 'N4',
    title: 'Thể khả năng 〜られる／〜える — có thể làm...',
    structure: 'Nhóm 1: う→える (書く→書ける) ／ nhóm 2: る→られる ／ 来る→来られる, する→できる',
    explanation: '<p>Diễn tả năng lực hoặc khả năng được phép. Tân ngữ thường chuyển từ を sang が (日本語が話せる). Trong văn nói, nhóm 2 hay bị lược ら (見れる — ら抜き言葉) nhưng chuẩn thì phải có ら.</p>',
    examples: [
      { sentence: '私は漢字が少し読めます。', pronunciation: 'わたしはかんじがすこしよめます。', meaningVi: 'Tôi đọc được chữ Hán một chút.' },
      { sentence: '明日のパーティーに来られますか。', pronunciation: 'あしたのぱーてぃーにこられますか。', meaningVi: 'Ngày mai bạn đến dự tiệc được không?' },
      { sentence: '納豆が食べられません。', pronunciation: 'なっとうがたべられません。', meaningVi: 'Tôi không ăn được natto.' },
    ],
    commonMistakes: '❌ 日本語を話せます → ✅ 日本語が話せます (thể khả năng thường dùng が)',
    comparedWith: '〜ことができます trang trọng hơn, nghĩa tương đương.',
  },
  {
    level: 'N4',
    title: '〜ことができます — có thể làm... (trang trọng)',
    structure: 'V thể từ điển + ことができます',
    explanation: '<p>Cách nói khả năng trang trọng, hay dùng trong thông báo, văn viết. Với danh từ: Danh từ + ができます (ピアノができます).</p>',
    examples: [
      { sentence: 'ここで切符を買うことができます。', pronunciation: 'ここできっぷをかうことができます。', meaningVi: 'Bạn có thể mua vé ở đây.' },
      { sentence: '彼は三か国語を話すことができます。', pronunciation: 'かれはさんかこくごをはなすことができます。', meaningVi: 'Anh ấy nói được ba thứ tiếng.' },
      { sentence: 'このアプリで日本語を勉強することができます。', pronunciation: 'このあぷりでにほんごをべんきょうすることができます。', meaningVi: 'Bạn có thể học tiếng Nhật bằng ứng dụng này.' },
    ],
    commonMistakes: '❌ 買えることができます → ✅ 買うことができます (không dùng thể khả năng trước ことができる)',
    comparedWith: 'Thể khả năng ngắn gọn cho hội thoại; ことができる trang trọng cho văn viết/thông báo.',
  },
  {
    level: 'N4',
    title: 'Thể ý chí 〜(よ)う + 〜(よ)うと思っています — định làm...',
    structure: 'Nhóm 1: う→おう (行く→行こう) ／ nhóm 2: る→よう ／ 来る→こよう, する→しよう; + と思っています',
    explanation: '<p>Thể ý chí (volitional) là dạng thân mật của ましょう: 行こう = "đi thôi". Kết hợp <strong>〜(よ)うと思っています</strong> = "tôi đang định...". 〜(よ)うとする = "định/cố làm" (sắp sửa).</p>',
    examples: [
      { sentence: '今度の休みに海へ行こう。', pronunciation: 'こんどのやすみにうみへいこう。', meaningVi: 'Kỳ nghỉ tới đi biển thôi.' },
      { sentence: '来年、日本へ留学しようと思っています。', pronunciation: 'らいねん、にほんへりゅうがくしようとおもっています。', meaningVi: 'Tôi đang định năm sau đi du học Nhật.' },
      { sentence: '毎日運動しようと思います。', pronunciation: 'まいにちうんどうしようとおもいます。', meaningVi: 'Tôi định sẽ vận động mỗi ngày.' },
    ],
    commonMistakes: '❌ 行くうと思っています → ✅ 行こうと思っています (phải chia thể ý chí)',
    comparedWith: '〜つもりです = dự định chắc chắn hơn; 〜(よ)うと思っています = ý định đang ấp ủ.',
  },
  {
    level: 'N4',
    title: '〜つもりです — dự định...',
    structure: 'V thể từ điển／V-ない + つもりです',
    explanation: '<p>Diễn tả dự định đã suy nghĩ kỹ, kế hoạch khá chắc chắn. Phủ định: 〜ないつもりです (định không làm) hoặc 〜つもりはありません (hoàn toàn không có ý định — mạnh hơn).</p>',
    examples: [
      { sentence: '夏休みに国へ帰るつもりです。', pronunciation: 'なつやすみにくにへかえるつもりです。', meaningVi: 'Tôi dự định về nước vào kỳ nghỉ hè.' },
      { sentence: '大学を卒業したら、日本で働くつもりです。', pronunciation: 'だいがくをそつぎょうしたら、にほんではたらくつもりです。', meaningVi: 'Tốt nghiệp đại học xong tôi định làm việc ở Nhật.' },
      { sentence: 'タバコはもう吸わないつもりです。', pronunciation: 'たばこはもうすわないつもりです。', meaningVi: 'Tôi định sẽ không hút thuốc nữa.' },
    ],
    commonMistakes: '❌ 帰りますつもりです → ✅ 帰るつもりです (dùng thể từ điển)',
    comparedWith: '予定です = kế hoạch đã sắp xếp (khách quan); つもりです = ý định cá nhân.',
  },
  {
    level: 'N4',
    title: '〜予定です — theo kế hoạch sẽ...',
    structure: 'V thể từ điển／Danh từ + の + 予定です',
    explanation: '<p>Diễn tả kế hoạch, lịch trình đã được sắp xếp (khách quan hơn つもり), hay dùng cho lịch công việc, chuyến đi, sự kiện.</p>',
    examples: [
      { sentence: '飛行機は十時に着く予定です。', pronunciation: 'ひこうきはじゅうじにつくよていです。', meaningVi: 'Theo lịch, máy bay sẽ hạ cánh lúc 10 giờ.' },
      { sentence: '会議は三時から始まる予定です。', pronunciation: 'かいぎはさんじからはじまるよていです。', meaningVi: 'Cuộc họp dự kiến bắt đầu từ 3 giờ.' },
      { sentence: '来月、出張の予定があります。', pronunciation: 'らいげつ、しゅっちょうのよていがあります。', meaningVi: 'Tháng sau tôi có lịch đi công tác.' },
    ],
    commonMistakes: '❌ 着きます予定です → ✅ 着く予定です',
    comparedWith: 'つもり = ý định chủ quan; 予定 = lịch trình đã định, có thể của cả tổ chức.',
  },
  {
    level: 'N4',
    title: '〜てあげます／てくれます／てもらいます — làm cho, làm hộ',
    structure: 'V-て + あげます(tôi làm cho người khác)／くれます(người khác làm cho tôi)／もらいます(tôi nhận được việc ai làm cho)',
    explanation: '<p>Ba động từ cho–nhận gắn với thể て diễn tả làm ơn/nhận ơn: <strong>てあげる</strong> (mình → người khác; cẩn thận vì có thể nghe kể công), <strong>てくれる</strong> (người khác → mình, biết ơn), <strong>てもらう</strong> (mình nhờ/nhận từ người khác, người làm đánh dấu bằng に).</p>',
    examples: [
      { sentence: '友達に本を貸してあげました。', pronunciation: 'ともだちにほんをかしてあげました。', meaningVi: 'Tôi đã cho bạn mượn sách.' },
      { sentence: '先生が漢字を教えてくれました。', pronunciation: 'せんせいがかんじをおしえてくれました。', meaningVi: 'Thầy đã dạy chữ Hán cho tôi.' },
      { sentence: '兄に宿題を手伝ってもらいました。', pronunciation: 'あににしゅくだいをてつだってもらいました。', meaningVi: 'Tôi được anh trai giúp làm bài tập.' },
    ],
    commonMistakes: '❌ 先生が教えてもらいました → ✅ 先生に教えてもらいました (người làm ơn đánh dấu bằng に với もらう)',
    comparedWith: 'くれる: chủ ngữ là người làm ơn; もらう: chủ ngữ là người nhận ơn — cùng một sự việc, hai góc nhìn.',
  },
  {
    level: 'N4',
    title: '〜てしまいました — trót làm／làm xong mất rồi',
    structure: 'V-て + しまいます／しまいました',
    explanation: '<p>Hai nghĩa: (1) hoàn thành trọn vẹn (全部読んでしまった — đọc hết sạch), (2) tiếc nuối, lỡ làm (財布をなくしてしまった). Văn nói: 〜ちゃう／〜じゃう (なくしちゃった).</p>',
    examples: [
      { sentence: '電車の中に傘を忘れてしまいました。', pronunciation: 'でんしゃのなかにかさをわすれてしまいました。', meaningVi: 'Tôi lỡ để quên ô trên tàu mất rồi.' },
      { sentence: 'ケーキを全部食べてしまいました。', pronunciation: 'けーきをぜんぶたべてしまいました。', meaningVi: 'Tôi đã ăn hết sạch cái bánh.' },
      { sentence: '宿題を忘れちゃった。', pronunciation: 'しゅくだいをわすれちゃった。', meaningVi: 'Tớ quên làm bài tập mất rồi.' },
    ],
    commonMistakes: '❌ Hiểu てしまう chỉ là "xong" — nhiều khi nghĩa chính là tiếc nuối/lỡ.',
    comparedWith: '〜終わる chỉ nêu việc kết thúc; てしまう thêm sắc thái trọn vẹn hoặc tiếc nuối.',
  },
  {
    level: 'N4',
    title: '〜ておきます — làm sẵn, chuẩn bị trước',
    structure: 'V-て + おきます',
    explanation: '<p>Diễn tả: (1) làm trước để chuẩn bị (ホテルを予約しておく), (2) giữ nguyên trạng thái (窓を開けておいてください). Văn nói: 〜とく (買っとく).</p>',
    examples: [
      { sentence: '旅行の前に、ホテルを予約しておきます。', pronunciation: 'りょこうのまえに、ほてるをよやくしておきます。', meaningVi: 'Trước chuyến đi, tôi đặt sẵn khách sạn.' },
      { sentence: '会議の資料をコピーしておきました。', pronunciation: 'かいぎのしりょうをこぴーしておきました。', meaningVi: 'Tôi đã photo sẵn tài liệu cho cuộc họp.' },
      { sentence: 'エアコンはつけておいてください。', pronunciation: 'えあこんはつけておいてください。', meaningVi: 'Cứ để điều hoà bật nguyên như vậy.' },
    ],
    commonMistakes: '❌ Nhầm ておく (chuẩn bị có chủ đích) với てある (trạng thái tồn tại sẵn).',
    comparedWith: 'ておく nhấn mạnh hành động chuẩn bị; てある nhấn mạnh kết quả đang tồn tại.',
  },
  {
    level: 'N4',
    title: '〜てあります — được làm sẵn (trạng thái)',
    structure: 'Danh từ + が + V(tha động từ)-て + あります',
    explanation: '<p>Diễn tả trạng thái tồn tại do ai đó <em>cố ý</em> làm từ trước: 「壁にポスターが貼ってある」. Luôn dùng với tha động từ; chủ thể hành động không được nhắc đến.</p>',
    examples: [
      { sentence: '壁に地図が貼ってあります。', pronunciation: 'かべにちずがはってあります。', meaningVi: 'Trên tường có dán sẵn bản đồ.' },
      { sentence: '机の上にメモが置いてあります。', pronunciation: 'つくえのうえにめもがおいてあります。', meaningVi: 'Trên bàn có để sẵn mảnh ghi chú.' },
      { sentence: '晩ご飯はもう作ってあります。', pronunciation: 'ばんごはんはもうつくってあります。', meaningVi: 'Bữa tối đã được nấu sẵn rồi.' },
    ],
    commonMistakes: '❌ 窓が開けています → ✅ 窓が開けてあります (trạng thái do người làm) hoặc 窓が開いています (tự động từ)',
    comparedWith: '自動từ + ている (開いている: tả trạng thái trung tính) vs 他動từ + てある (開けてある: ai đó cố ý mở).',
  },
];

const JA_GRAMMAR_N4B: GrammarSeed[] = [
  {
    level: 'N4',
    title: '〜たら — nếu／sau khi (điều kiện tả)',
    structure: 'Thể た + ら｜Aい → Aかったら｜N／Aな + だったら',
    explanation:
      '<p><strong>〜たら</strong> là dạng điều kiện vạn năng nhất trong hội thoại: "nếu A thì B" hoặc "sau khi A xong thì B".</p><ul><li>Điều kiện giả định: 雨が降ったら、行きません。(Nếu trời mưa thì tôi không đi.)</li><li>Trình tự chắc chắn xảy ra: 家に帰ったら、電話します。(Về đến nhà tôi sẽ gọi — "về nhà" chắc chắn xảy ra.)</li><li>Phát hiện bất ngờ (quá khứ): 窓を開けたら、雪が降っていた。(Mở cửa sổ ra thì thấy tuyết đang rơi.)</li></ul><p>Trong văn nói, khi phân vân giữa các dạng điều kiện, dùng たら hầu như luôn đúng.</p>',
    examples: [
      { sentence: '安かったら、買います。', pronunciation: 'やすかったら、かいます。', meaningVi: 'Nếu rẻ thì tôi mua.' },
      { sentence: '駅に着いたら、連絡してください。', pronunciation: 'えきについたら、れんらくしてください。', meaningVi: 'Đến ga rồi thì hãy liên lạc cho tôi nhé.' },
      { sentence: '暇だったら、手伝ってくれませんか。', pronunciation: 'ひまだったら、てつだってくれませんか。', meaningVi: 'Nếu rảnh thì giúp tôi được không?' },
    ],
    commonMistakes: '❌ 雨が降るたら → ✅ 雨が降ったら (たら gắn vào THỂ た, không gắn vào thể từ điển)',
    comparedWith: 'たら (vạn năng, thiên văn nói) vs ば (quy luật chung) vs と (kết quả tất yếu) vs なら (dựa trên thông tin người kia vừa nói).',
  },
  {
    level: 'N4',
    title: '〜ば — nếu (điều kiện quy luật)',
    structure: 'V-る → V-eば (行く→行けば)｜Aい → Aければ｜N／Aな + なら(ば)',
    explanation:
      '<p><strong>〜ば</strong> diễn tả điều kiện mang tính quy luật, logic: "hễ A thì B".</p><ul><li>Quy luật chung: 春になれば、桜が咲きます。(Cứ đến xuân là hoa anh đào nở.)</li><li>Lời khuyên/mong ước: 薬を飲めば、治りますよ。(Uống thuốc vào là khỏi thôi.)</li><li>Thành ngữ hay gặp: 〜ばいいのに (giá mà...), どうすればいいですか (tôi nên làm thế nào?).</li></ul><p>Mệnh đề sau ば thường KHÔNG dùng mệnh lệnh/ý chí nếu chủ ngữ hai vế giống nhau — khi đó chuyển sang たら.</p>',
    examples: [
      { sentence: 'ボタンを押せば、ドアが開きます。', pronunciation: 'ぼたんをおせば、どあがあきます。', meaningVi: 'Hễ nhấn nút thì cửa mở.' },
      { sentence: '練習すれば、上手になります。', pronunciation: 'れんしゅうすれば、じょうずになります。', meaningVi: 'Cứ luyện tập là sẽ giỏi lên.' },
      { sentence: 'どうすれば日本語が早く覚えられますか。', pronunciation: 'どうすればにほんごがはやくおぼえられますか。', meaningVi: 'Làm thế nào thì nhớ tiếng Nhật nhanh được?' },
    ],
    commonMistakes: '❌ 行くば → ✅ 行けば (đổi đuôi う→えば). ❌ 高いば → ✅ 高ければ',
    comparedWith: 'ば nghiêng về quy luật "hễ...là..."; たら dùng rộng hơn cho tình huống cụ thể; と cho kết quả máy móc tất yếu (押すと開く).',
  },
  {
    level: 'N4',
    title: '〜なら — nếu là／nếu nói về',
    structure: 'N + なら｜Thể thường + なら',
    explanation:
      '<p><strong>〜なら</strong> đưa ra điều kiện dựa trên chủ đề hoặc thông tin người nghe vừa nhắc: "nếu là...", "nếu nói về...".</p><ul><li>Tư vấn theo chủ đề: 寿司なら、あの店がおいしいですよ。(Nếu là sushi thì quán kia ngon đấy.)</li><li>Phản hồi thông tin vừa nghe: 「京都へ行きます」「京都へ行くなら、新幹線が便利ですよ」</li></ul><p>Điểm đặc biệt: hành động ở vế sau có thể xảy ra TRƯỚC vế điều kiện (日本へ行くなら、ガイドブックを買ったほうがいい — mua sách trước khi đi).</p>',
    examples: [
      { sentence: '安いパソコンなら、この店で買えますよ。', pronunciation: 'やすいぱそこんなら、このみせでかえますよ。', meaningVi: 'Nếu là máy tính giá rẻ thì mua được ở cửa hàng này đấy.' },
      { sentence: '日本へ行くなら、春がいちばんいいですよ。', pronunciation: 'にほんへいくなら、はるがいちばんいいですよ。', meaningVi: 'Nếu định đi Nhật thì mùa xuân là đẹp nhất.' },
      { sentence: 'その話なら、もう聞きました。', pronunciation: 'そのはなしなら、もうききました。', meaningVi: 'Nếu là chuyện đó thì tôi nghe rồi.' },
    ],
    commonMistakes: '❌ Dùng なら cho trình tự thời gian: 家に帰るなら、電話します (sai nếu ý là "về đến nhà rồi sẽ gọi") → ✅ 家に帰ったら、電話します',
    comparedWith: 'なら = điều kiện "chủ đề" (phản hồi điều người kia nói); たら/ば = điều kiện thời gian/quy luật thực sự.',
  },
  {
    level: 'N4',
    title: '〜そうです (1) — trông có vẻ (nhìn mà đoán)',
    structure: 'V-ます(bỏ ます) + そうです｜Aい(bỏ い) + そうです｜いい → よさそう',
    explanation:
      '<p><strong>〜そうです</strong> (dạng gắn vào GỐC từ) diễn tả phán đoán từ những gì NHÌN THẤY: "trông có vẻ...".</p><ul><li>Với tính từ: おいしそうです (trông ngon quá), 高そうです (trông có vẻ đắt).</li><li>Với động từ: 雨が降りそうです (trời sắp mưa đến nơi), 落ちそうです (sắp rơi rồi kìa).</li><li>Bất quy tắc: いい → よさそう; ない → なさそう.</li></ul><p>Không dùng cho điều thấy rõ ràng 100%: thấy tuyết đang rơi thì nói 雪が降っています, không nói 降りそうです.</p>',
    examples: [
      { sentence: 'このケーキはおいしそうですね。', pronunciation: 'このけーきはおいしそうですね。', meaningVi: 'Cái bánh này trông ngon nhỉ.' },
      { sentence: '今にも雨が降りそうです。', pronunciation: 'いまにもあめがふりそうです。', meaningVi: 'Trời sắp mưa đến nơi rồi.' },
      { sentence: 'あの人は忙しそうですから、後で聞きましょう。', pronunciation: 'あのひとはいそがしそうですから、あとでききましょう。', meaningVi: 'Người kia trông có vẻ bận, mình hỏi sau đi.' },
    ],
    commonMistakes: '❌ おいしいそうです (nghĩa thành "nghe nói ngon") → ✅ おいしそうです (trông ngon). Gắn cả từ = truyền đạt, bỏ đuôi = phỏng đoán!',
    comparedWith: 'そうです(gốc từ) = đoán bằng mắt; そうです(cả câu) = nghe nói (N4-2); ようです = suy luận từ nhiều căn cứ.',
  },
  {
    level: 'N4',
    title: '〜そうです (2) — nghe nói (truyền đạt)',
    structure: 'Thể thường (câu đầy đủ) + そうです',
    explanation:
      '<p><strong>〜そうです</strong> gắn sau CÂU Ở THỂ THƯỜNG diễn tả thông tin nghe được từ nguồn khác: "nghe nói là...".</p><ul><li>天気予報によると、明日は雨が降るそうです。(Theo dự báo, nghe nói mai mưa.)</li><li>田中さんは来月結婚するそうです。(Nghe nói anh Tanaka tháng sau kết hôn.)</li></ul><p>Nguồn tin thường đi kèm 〜によると (theo...). Khác với dạng (1): ở đây giữ NGUYÊN cả từ (降る**そうです**、おいしい**そうです**).</p>',
    examples: [
      { sentence: 'ニュースによると、台風が来るそうです。', pronunciation: 'にゅーすによると、たいふうがくるそうです。', meaningVi: 'Theo tin tức, nghe nói bão sắp đến.' },
      { sentence: 'あのレストランはとてもおいしいそうです。', pronunciation: 'あのれすとらんはとてもおいしいそうです。', meaningVi: 'Nghe nói nhà hàng kia rất ngon.' },
      { sentence: '先生は昔、歌手だったそうです。', pronunciation: 'せんせいはむかし、かしゅだったそうです。', meaningVi: 'Nghe nói ngày xưa thầy từng là ca sĩ.' },
    ],
    commonMistakes: '❌ 雨が降りそうです (= sắp mưa, đoán bằng mắt) khi muốn nói "nghe nói mưa" → ✅ 雨が降るそうです',
    comparedWith: 'そうです(truyền đạt) trung lập, thuật lại y nguyên; らしいです cũng "nghe nói" nhưng kèm suy đoán của người nói.',
  },
  {
    level: 'N4',
    title: '〜ようです／〜みたいです — hình như (suy luận)',
    structure: 'Thể thường + ようです｜N + の + ようです｜みたいです (văn nói)',
    explanation:
      '<p><strong>〜ようです</strong> diễn tả suy luận dựa trên căn cứ quan sát được (giác quan, tình hình): "hình như...".</p><ul><li>Suy luận: 誰もいないようです。(Hình như không có ai.) 風邪をひいたようです。(Hình như tôi bị cảm rồi.)</li><li>So sánh ví von (như thể): 彼女は人形のようです。(Cô ấy như búp bê vậy.)</li></ul><p><strong>みたいです</strong> là bản văn nói của ようです, gắn thẳng vào danh từ không cần の: 子供みたい (như trẻ con).</p>',
    examples: [
      { sentence: '電気が消えていますから、留守のようです。', pronunciation: 'でんきがきえていますから、るすのようです。', meaningVi: 'Đèn tắt rồi nên hình như không có ai ở nhà.' },
      { sentence: '道が濡れています。夜、雨が降ったようです。', pronunciation: 'みちがぬれています。よる、あめがふったようです。', meaningVi: 'Đường ướt. Hình như đêm qua trời mưa.' },
      { sentence: '田中さんは甘いものが好きみたいです。', pronunciation: 'たなかさんはあまいものがすきみたいです。', meaningVi: 'Hình như anh Tanaka thích đồ ngọt.' },
    ],
    commonMistakes: '❌ N + ようです (先生ようです) → ✅ 先生のようです / 先生みたいです',
    comparedWith: 'ようです = tự suy luận từ căn cứ; そうです(truyền đạt) = nghe từ nguồn khác; らしい = nghe đồn + đoán.',
  },
  {
    level: 'N4',
    title: 'Thể bị động 〜られる (受身)',
    structure: 'V nhóm 1: う→あれる (書く→書かれる)｜nhóm 2: る→られる｜する→される、来る→来られる',
    explanation:
      '<p>Thể <strong>bị động (受身)</strong> diễn tả chủ ngữ CHỊU tác động của hành động, người gây ra đánh dấu bằng に.</p><ul><li>Bị động trực tiếp: 私は先生に褒められました。(Tôi được thầy khen.)</li><li>Bị động gián tiếp (thiệt hại — đặc trưng tiếng Nhật): 雨に降られました。(Bị mưa — dính mưa khổ sở.) 隣の人にタバコを吸われました。(Bị người bên cạnh hút thuốc [làm phiền].)</li><li>Sự việc chung: この本は多くの人に読まれています。(Cuốn sách này được nhiều người đọc.)</li></ul>',
    examples: [
      { sentence: '私は母に叱られました。', pronunciation: 'わたしはははにしかられました。', meaningVi: 'Tôi bị mẹ mắng.' },
      { sentence: '電車で足を踏まれました。', pronunciation: 'でんしゃであしをふまれました。', meaningVi: 'Tôi bị giẫm vào chân trên tàu điện.' },
      { sentence: 'この歌は世界中で歌われています。', pronunciation: 'このうたはせかいじゅうでうたわれています。', meaningVi: 'Bài hát này được hát trên khắp thế giới.' },
    ],
    commonMistakes: '❌ 私は雨を降られました → ✅ 私は雨に降られました (tác nhân đánh dấu bằng に, không phải を)',
    comparedWith: 'Dạng られる của V nhóm 2 trùng hình với thể KHẢ NĂNG (食べられる = "bị ăn" hoặc "ăn được") — phân biệt bằng ngữ cảnh và trợ từ.',
  },
  {
    level: 'N4',
    title: 'Thể sai khiến 〜させる (使役)',
    structure: 'V nhóm 1: う→あせる (行く→行かせる)｜nhóm 2: る→させる｜する→させる、来る→来させる',
    explanation:
      '<p>Thể <strong>sai khiến (使役)</strong> có hai nghĩa: BẮT làm và CHO PHÉP làm.</p><ul><li>Bắt buộc: 母は弟に野菜を食べさせました。(Mẹ bắt em ăn rau.)</li><li>Cho phép: 子供を公園で遊ばせました。(Cho con chơi ở công viên.)</li><li>Xin phép lịch sự (rất hay dùng ở công sở): 〜させていただきます／〜させてください。休ませていただけませんか。(Cho phép tôi nghỉ được không?)</li></ul><p>Tự động từ → người bị sai khiến đánh dấu を; tha động từ → đánh dấu に.</p>',
    examples: [
      { sentence: '先生は学生に漢字を書かせました。', pronunciation: 'せんせいはがくせいにかんじをかかせました。', meaningVi: 'Thầy giáo bắt học sinh viết kanji.' },
      { sentence: '今日は早く帰らせてください。', pronunciation: 'きょうははやくかえらせてください。', meaningVi: 'Hôm nay xin cho tôi về sớm.' },
      { sentence: '面白い話をして、みんなを笑わせました。', pronunciation: 'おもしろいはなしをして、みんなをわらわせました。', meaningVi: 'Kể chuyện hài làm mọi người cười.' },
    ],
    commonMistakes: '❌ 学生を漢字を書かせる (hai を) → ✅ 学生に漢字を書かせる (tha động từ → người làm đánh dấu に)',
    comparedWith: '使役 + てください (〜させてください) = xin phép mình làm; てください thường = nhờ người khác làm. Kết hợp 使役+受身 (させられる) học ở N3.',
  },
  {
    level: 'N4',
    title: '〜はずです — chắc chắn là (suy luận có căn cứ)',
    structure: 'Thể thường + はずです｜N + の + はずです｜Aな + な + はずです',
    explanation:
      '<p><strong>〜はずです</strong> diễn tả suy luận LOGIC có căn cứ rõ ràng: "theo lý thì chắc chắn...".</p><ul><li>会議は3時からですから、田中さんはまだ会社にいるはずです。(Họp từ 3h nên theo lý anh Tanaka vẫn ở công ty.)</li><li>Phủ định: 〜はずがありません (không thể nào — về mặt logic): 彼がうそをつくはずがありません。</li><li>〜はずでした (đáng lẽ ra... nhưng thực tế không vậy): 昨日届くはずでした。</li></ul>',
    examples: [
      { sentence: '荷物は今日届くはずです。', pronunciation: 'にもつはきょうとどくはずです。', meaningVi: 'Theo lý thì bưu kiện sẽ đến hôm nay.' },
      { sentence: '彼は10年日本に住んでいたから、日本語が上手なはずです。', pronunciation: 'かれはじゅうねんにほんにすんでいたから、にほんごがじょうずなはずです。', meaningVi: 'Anh ấy sống ở Nhật 10 năm rồi nên chắc chắn tiếng Nhật giỏi.' },
      { sentence: 'そんなはずはありません。もう一度確認してください。', pronunciation: 'そんなはずはありません。もういちどかくにんしてください。', meaningVi: 'Không thể như thế được. Hãy kiểm tra lại lần nữa đi.' },
    ],
    commonMistakes: '❌ Dùng はず cho ý chí bản thân: 私は行くはずです → ✅ 私は行くつもりです (はず là suy luận, không phải dự định)',
    comparedWith: 'はずです = suy luận logic chắc chắn cao; でしょう = phỏng đoán chung; かもしれません = khả năng thấp (50%).',
  },
  {
    level: 'N4',
    title: '〜のに — vậy mà, thế mà (trái mong đợi)',
    structure: 'Thể thường + のに｜Aな／N + な + のに',
    explanation:
      '<p><strong>〜のに</strong> nối hai vế trái ngược với sắc thái NGẠC NHIÊN, TIẾC NUỐI, BẤT MÃN: "vậy mà, thế mà".</p><ul><li>薬を飲んだのに、治りません。(Đã uống thuốc rồi vậy mà không khỏi.)</li><li>Đứng cuối câu bỏ lửng = tiếc nuối: 言ってくれればよかったのに…。(Nói với tôi có phải tốt không...)</li></ul><p>Cảm xúc mạnh hơn けど/が. Không dùng khi vế sau là mệnh lệnh, rủ rê (khi đó dùng が/けど).</p>',
    examples: [
      { sentence: '一生懸命勉強したのに、試験に落ちました。', pronunciation: 'いっしょうけんめいべんきょうしたのに、しけんにおちました。', meaningVi: 'Học hết sức vậy mà vẫn trượt kỳ thi.' },
      { sentence: '日曜日なのに、会社へ行かなければなりません。', pronunciation: 'にちようびなのに、かいしゃへいかなければなりません。', meaningVi: 'Chủ nhật vậy mà vẫn phải đi làm.' },
      { sentence: '約束したのに、彼は来ませんでした。', pronunciation: 'やくそくしたのに、かれはきませんでした。', meaningVi: 'Đã hứa rồi thế mà anh ấy không đến.' },
    ],
    commonMistakes: '❌ 日曜日のに → ✅ 日曜日なのに (danh từ + な + のに)',
    comparedWith: 'のに = trái mong đợi + cảm xúc; が/けど = "nhưng" trung lập; ても = "dù có... đi nữa" (giả định).',
  },
  {
    level: 'N4',
    title: '〜ながら — vừa... vừa...',
    structure: 'V-ます(bỏ ます) + ながら + V chính',
    explanation:
      '<p><strong>〜ながら</strong> diễn tả hai hành động của CÙNG một người diễn ra đồng thời; hành động chính đứng SAU.</p><ul><li>音楽を聞きながら、勉強します。(Vừa nghe nhạc vừa học — học là chính.)</li><li>Nghĩa mở rộng (kéo dài): 働きながら、大学に通っています。(Vừa đi làm vừa học đại học.)</li></ul>',
    examples: [
      { sentence: 'コーヒーを飲みながら、話しましょう。', pronunciation: 'こーひーをのみながら、はなしましょう。', meaningVi: 'Vừa uống cà phê vừa nói chuyện nhé.' },
      { sentence: 'スマホを見ながら歩くのは危ないです。', pronunciation: 'すまほをみながらあるくのはあぶないです。', meaningVi: 'Vừa đi vừa nhìn điện thoại rất nguy hiểm.' },
      { sentence: 'アルバイトをしながら、日本語を勉強しています。', pronunciation: 'あるばいとをしながら、にほんごをべんきょうしています。', meaningVi: 'Tôi vừa làm thêm vừa học tiếng Nhật.' },
    ],
    commonMistakes: '❌ Hai người khác nhau: 私が歌いながら、彼が踊る → ✅ ながら chỉ dùng cho MỘT chủ ngữ làm 2 việc',
    comparedWith: 'ながら = đồng thời, một người; 〜たり〜たり = liệt kê luân phiên; 〜間に = trong lúc (2 chủ ngữ được).',
  },
  {
    level: 'N4',
    title: 'Kính ngữ cơ bản — 尊敬語 & 謙譲語',
    structure: 'お+V-ます+になります (tôn kính)｜お+V-ます+します (khiêm nhường)｜động từ đặc biệt',
    explanation:
      '<p>Kính ngữ tiếng Nhật gồm hai trục chính:</p><ul><li><strong>尊敬語 (tôn kính)</strong> — nâng hành động NGƯỜI KHÁC: 先生がお帰りになりました。Động từ đặc biệt: いらっしゃる (đi/đến/ở), 召し上がる (ăn/uống), おっしゃる (nói), ご覧になる (xem).</li><li><strong>謙譲語 (khiêm nhường)</strong> — hạ hành động CỦA MÌNH: お持ちします (để tôi cầm cho). Động từ đặc biệt: 参る (đi/đến), いただく (ăn/nhận), 申す (nói), 拝見する (xem).</li></ul><p>Người mới chỉ cần nhớ các động từ đặc biệt + mẫu お〜になる／お〜する là giao tiếp được ở cửa hàng, công sở.</p>',
    examples: [
      { sentence: '社長は何時にいらっしゃいますか。', pronunciation: 'しゃちょうはなんじにいらっしゃいますか。', meaningVi: 'Mấy giờ giám đốc đến ạ? (tôn kính)' },
      { sentence: 'どうぞ召し上がってください。', pronunciation: 'どうぞめしあがってください。', meaningVi: 'Xin mời anh/chị dùng ạ. (tôn kính)' },
      { sentence: '明日、御社に伺います。', pronunciation: 'あした、おんしゃにうかがいます。', meaningVi: 'Ngày mai tôi xin đến quý công ty ạ. (khiêm nhường)' },
    ],
    commonMistakes: '❌ Dùng tôn kính cho mình: 私が召し上がります → ✅ 私がいただきます (mình thì khiêm nhường, người khác mới tôn kính)',
    comparedWith: '尊敬語 nâng người khác lên, 謙譲語 hạ mình xuống — cùng mục đích thể hiện tôn trọng nhưng ngược hướng. です/ます chỉ là 丁寧語 (lịch sự chung).',
  },
];

const JA_GRAMMAR_N3: GrammarSeed[] = [
  {
    level: 'N3',
    title: '〜ばかり — toàn là, vừa mới, chỉ mãi',
    structure: 'N + ばかり｜V-て + ばかりいる｜V-た + ばかり',
    explanation:
      '<p><strong>ばかり</strong> có ba cách dùng chính ở N3:</p><ul><li>N + ばかり: toàn là — 彼は肉ばかり食べています。(Anh ấy toàn ăn thịt.)</li><li>V-てばかりいる: chỉ mãi làm (chê trách) — 弟は遊んでばかりいます。(Thằng em chỉ mãi chơi.)</li><li>V-たばかり: vừa mới làm xong (cảm nhận "còn mới") — 日本に来たばかりです。(Tôi vừa mới đến Nhật.)</li></ul>',
    examples: [
      { sentence: '妹は甘いものばかり食べています。', pronunciation: 'いもうとはあまいものばかりたべています。', meaningVi: 'Em gái tôi toàn ăn đồ ngọt.' },
      { sentence: 'この会社に入ったばかりで、まだ慣れていません。', pronunciation: 'このかいしゃにはいったばかりで、まだなれていません。', meaningVi: 'Tôi vừa mới vào công ty này nên chưa quen.' },
      { sentence: '彼は文句を言ってばかりいます。', pronunciation: 'かれはもんくをいってばかりいます。', meaningVi: 'Anh ta chỉ mãi ca thán.' },
    ],
    commonMistakes: '❌ 来るばかりです (ý "vừa mới đến") → ✅ 来たばかりです (V-た + ばかり cho nghĩa vừa xong)',
    comparedWith: 'V-たばかり (cảm giác chủ quan "còn mới", dù đã 1 tháng vẫn nói được) vs V-たところ (đúng thời điểm vừa xong, khách quan).',
  },
  {
    level: 'N3',
    title: '〜ようになる／〜ようにする — trở nên／cố gắng để',
    structure: 'V-る／V-ない + ようになる｜V-る／V-ない + ようにする',
    explanation:
      '<p>Hai mẫu dễ lẫn nhưng khác hẳn:</p><ul><li><strong>〜ようになる</strong>: thay đổi TỰ NHIÊN theo thời gian — 日本語が話せるようになりました。(Tôi đã nói được tiếng Nhật — trước đó không nói được.)</li><li><strong>〜ようにする</strong>: NỖ LỰC có ý thức — 毎日運動するようにしています。(Tôi cố gắng vận động mỗi ngày.)</li><li>〜ようにしてください: nhờ nhẹ nhàng — 時間を守るようにしてください。</li></ul>',
    examples: [
      { sentence: '漢字が読めるようになりました。', pronunciation: 'かんじがよめるようになりました。', meaningVi: 'Tôi đã đọc được kanji (trước kia thì không).' },
      { sentence: '甘いものを食べすぎないようにしています。', pronunciation: 'あまいものをたべすぎないようにしています。', meaningVi: 'Tôi cố không ăn quá nhiều đồ ngọt.' },
      { sentence: '赤ちゃんが歩けるようになりました。', pronunciation: 'あかちゃんがあるけるようになりました。', meaningVi: 'Em bé đã biết đi rồi.' },
    ],
    commonMistakes: '❌ 毎日勉強するようになっています (ý "đang cố gắng") → ✅ 毎日勉強するようにしています (nỗ lực = する)',
    comparedWith: 'ようになる (thay đổi tự nhiên) vs ようにする (cố ý). Với khả năng, dùng thể khả năng + ようになる: 泳げるようになる.',
  },
  {
    level: 'N3',
    title: '〜ことになる／〜ことにする — được quyết định／tự quyết định',
    structure: 'V-る／V-ない + ことになる｜V-る／V-ない + ことにする',
    explanation:
      '<p>Cặp mẫu về QUYẾT ĐỊNH:</p><ul><li><strong>〜ことになりました</strong>: được quyết định bởi hoàn cảnh/tổ chức (khách quan) — 来月、大阪に転勤することになりました。(Tôi được điều chuyển đến Osaka.)</li><li><strong>〜ことにしました</strong>: bản thân tự quyết định (chủ quan) — タバコをやめることにしました。(Tôi quyết định bỏ thuốc.)</li><li>〜ことになっている: quy định, lệ — ここでは靴を脱ぐことになっています。</li></ul><p>Người Nhật hay dùng ことになりました cho cả việc mình quyết (kết hôn, nghỉ việc) để nghe khiêm tốn.</p>',
    examples: [
      { sentence: '来年、結婚することになりました。', pronunciation: 'らいねん、けっこんすることになりました。', meaningVi: 'Chúng tôi sẽ kết hôn vào năm sau (nói khiêm tốn).' },
      { sentence: '毎朝ジョギングをすることにしました。', pronunciation: 'まいあさじょぎんぐをすることにしました。', meaningVi: 'Tôi quyết định chạy bộ mỗi sáng.' },
      { sentence: '会議は金曜日に行うことになっています。', pronunciation: 'かいぎはきんようびにおこなうことになっています。', meaningVi: 'Theo quy định, cuộc họp tổ chức vào thứ Sáu.' },
    ],
    commonMistakes: '❌ Tự mình bỏ thuốc: タバコをやめることになりました (nghe như bị ép) → ✅ やめることにしました',
    comparedWith: 'ことにする ~ quyết định 1 lần; ようにする ~ nỗ lực duy trì. ことになっている = quy tắc; はずだ = suy luận.',
  },
  {
    level: 'N3',
    title: '〜うちに — trong lúc còn／tranh thủ khi',
    structure: 'V-る／V-ている／Aい／N-の + うちに｜V-ない + うちに',
    explanation:
      '<p><strong>〜うちに</strong> = làm gì TRANH THỦ trong lúc trạng thái còn kéo dài (sau này khó có cơ hội):</p><ul><li>熱いうちに食べてください。(Ăn đi lúc còn nóng.)</li><li>日本にいるうちに、富士山に登りたいです。(Tranh thủ lúc còn ở Nhật muốn leo Phú Sĩ.)</li><li><strong>V-ないうちに</strong>: trước khi kịp — 暗くならないうちに帰りましょう。(Về trước khi trời tối.)</li></ul>',
    examples: [
      { sentence: '忘れないうちにメモしておきます。', pronunciation: 'わすれないうちにめもしておきます。', meaningVi: 'Ghi chú lại trước khi quên.' },
      { sentence: '若いうちに、いろいろな国へ行ったほうがいいですよ。', pronunciation: 'わかいうちに、いろいろなくにへいったほうがいいですよ。', meaningVi: 'Lúc còn trẻ nên đi nhiều nước.' },
      { sentence: '雨が降らないうちに、洗濯物を取り込みましょう。', pronunciation: 'あめがふらないうちに、せんたくものをとりこみましょう。', meaningVi: 'Thu quần áo vào trước khi trời mưa.' },
    ],
    commonMistakes: '❌ 熱いあいだに食べて → thường dùng ✅ 熱いうちに (うちに mang ý "sau đó sẽ không còn cơ hội/trạng thái")',
    comparedWith: '間に = trong khoảng thời gian xác định (trung lập); うちに = kèm ý "tranh thủ kẻo hết cơ hội".',
  },
  {
    level: 'N3',
    title: '〜たびに — mỗi lần... là lại...',
    structure: 'V-る + たびに｜N + の + たびに',
    explanation:
      '<p><strong>〜たびに</strong> = "mỗi lần A thì lại B" — B lặp lại như một quy luật gắn với A:</p><ul><li>この歌を聞くたびに、学生時代を思い出します。(Mỗi lần nghe bài này lại nhớ thời sinh viên.)</li><li>N のたびに: 出張のたびに、お土産を買ってきてくれます。(Mỗi chuyến công tác anh ấy đều mua quà về.)</li></ul>',
    examples: [
      { sentence: 'この写真を見るたびに、家族に会いたくなります。', pronunciation: 'このしゃしんをみるたびに、かぞくにあいたくなります。', meaningVi: 'Mỗi lần xem tấm ảnh này tôi lại muốn gặp gia đình.' },
      { sentence: '彼に会うたびに、元気をもらいます。', pronunciation: 'かれにあうたびに、げんきをもらいます。', meaningVi: 'Mỗi lần gặp anh ấy tôi lại thấy có thêm năng lượng.' },
      { sentence: '引っ越しのたびに、物を捨てています。', pronunciation: 'ひっこしのたびに、ものをすてています。', meaningVi: 'Mỗi lần chuyển nhà tôi lại vứt bớt đồ.' },
    ],
    commonMistakes: '❌ V-た + たびに (見たたびに) → ✅ V-る + たびに (見るたびに) — luôn dùng thể từ điển',
    comparedWith: 'たびに = mỗi lần (kèm cảm xúc/kết quả lặp lại); 〜と (điều kiện) = hễ...là... máy móc; 毎回 chỉ là trạng từ đếm lần.',
  },
  {
    level: 'N3',
    title: '〜によって — tùy theo, bởi, bằng cách',
    structure: 'N + によって／により｜N + による + N',
    explanation:
      '<p><strong>〜によって</strong> đa nghĩa, N3 cần nắm 4 cách dùng:</p><ul><li>Tùy theo: 人によって考え方が違います。(Tùy người mà cách nghĩ khác nhau.)</li><li>Nguyên nhân: 地震によって、多くの家が壊れました。(Nhiều nhà bị sập bởi động đất.)</li><li>Phương tiện/cách thức (trang trọng): インターネットによって、世界中の情報が得られます。</li><li>Tác giả của bị động: この寺は16世紀に建てられました。有名な建築家によって設計されました。</li></ul>',
    examples: [
      { sentence: '国によって、文化や習慣が違います。', pronunciation: 'くにによって、ぶんかやしゅうかんがちがいます。', meaningVi: 'Tùy mỗi nước mà văn hóa, tập quán khác nhau.' },
      { sentence: '台風によって、電車が止まりました。', pronunciation: 'たいふうによって、でんしゃがとまりました。', meaningVi: 'Tàu điện dừng chạy do bão.' },
      { sentence: 'この小説は有名な作家によって書かれました。', pronunciation: 'このしょうせつはゆうめいなさっかによってかかれました。', meaningVi: 'Cuốn tiểu thuyết này được viết bởi một nhà văn nổi tiếng.' },
    ],
    commonMistakes: '❌ Phương tiện đời thường: バスによって行きます → ✅ バスで行きます (によって chỉ dùng văn viết/trang trọng)',
    comparedWith: 'によって (tùy theo) ≈ 〜次第で; によって (nguyên nhân) trang trọng hơn で/から.',
  },
  {
    level: 'N3',
    title: '〜として — với tư cách là',
    structure: 'N + として｜N + としては／としても',
    explanation:
      '<p><strong>〜として</strong> nêu TƯ CÁCH, VAI TRÒ, DANH NGHĨA của người/vật:</p><ul><li>留学生として日本に来ました。(Tôi đến Nhật với tư cách du học sinh.)</li><li>この部屋は倉庫として使っています。(Phòng này được dùng làm kho.)</li><li>趣味として料理を習っています。(Học nấu ăn như một sở thích.)</li></ul>',
    examples: [
      { sentence: '彼は医者として20年働いています。', pronunciation: 'かれはいしゃとしてにじゅうねんはたらいています。', meaningVi: 'Anh ấy làm việc với tư cách bác sĩ suốt 20 năm.' },
      { sentence: '京都は観光地として有名です。', pronunciation: 'きょうとはかんこうちとしてゆうめいです。', meaningVi: 'Kyoto nổi tiếng như một địa điểm du lịch.' },
      { sentence: 'お礼として、花を贈りました。', pronunciation: 'おれいとして、はなをおくりました。', meaningVi: 'Tôi tặng hoa như một lời cảm ơn.' },
    ],
    commonMistakes: '❌ 医者にとして働く → ✅ 医者として働く (không thêm に trước として)',
    comparedWith: 'として = tư cách thực; にとって = "đối với" (góc nhìn/đánh giá): 私にとって日本語は難しい.',
  },
  {
    level: 'N3',
    title: 'Thể sai khiến bị động 〜させられる (使役受身)',
    structure: 'V nhóm 1: う→あせられる／あされる (行かせられる／行かされる)｜nhóm 2: る→させられる',
    explanation:
      '<p><strong>使役受身</strong> = BỊ BẮT làm gì đó (ngoài ý muốn, thường kèm cảm giác khó chịu):</p><ul><li>子供のとき、母に野菜を食べさせられました。(Hồi nhỏ tôi bị mẹ bắt ăn rau.)</li><li>飲み会で歌を歌わせられました。(Bị bắt hát ở buổi nhậu.)</li><li>Nghĩa bóng — bị khiến phải (cảm xúc): この本にはいろいろ考えさせられました。(Cuốn sách khiến tôi phải suy nghĩ nhiều.)</li></ul><p>Động từ nhóm 1 có dạng rút gọn 〜される: 行かせられる → 行かされる (trừ động từ đuôi す).</p>',
    examples: [
      { sentence: '毎日、母に部屋を掃除させられます。', pronunciation: 'まいにち、はははにへやをそうじさせられます。', meaningVi: 'Ngày nào tôi cũng bị mẹ bắt dọn phòng.' },
      { sentence: '先輩にお酒を飲まされました。', pronunciation: 'せんぱいにおさけをのまされました。', meaningVi: 'Tôi bị đàn anh ép uống rượu.' },
      { sentence: '2時間も待たされました。', pronunciation: 'にじかんもまたされました。', meaningVi: 'Tôi bị bắt đợi những 2 tiếng.' },
    ],
    commonMistakes: '❌ 母は私に野菜を食べさせられました (chủ ngữ ngược) → ✅ 私は母に野菜を食べさせられました (người BỊ bắt làm chủ ngữ)',
    comparedWith: '使役 (させる: bắt ai làm — góc nhìn người ra lệnh) vs 使役受身 (させられる: bị bắt làm — góc nhìn nạn nhân).',
  },
  {
    level: 'N3',
    title: '〜べきだ／〜べきではない — nên／không nên (đạo lý)',
    structure: 'V-る + べきだ (する→すべき／するべき)｜V-る + べきではない',
    explanation:
      '<p><strong>〜べきだ</strong> = "nên làm" xét theo ĐẠO LÝ, LẼ PHẢI, trách nhiệm — mạnh và cứng hơn ほうがいい:</p><ul><li>約束は守るべきです。(Đã hứa thì phải giữ lời.)</li><li>Phủ định: 人の悪口を言うべきではありません。(Không nên nói xấu người khác.)</li><li>べきだった: đáng lẽ nên (hối tiếc) — もっと早く病院に行くべきでした。</li></ul><p>Không dùng べき để khuyên bề trên (thất lễ); quy định pháp luật dùng 〜なければならない.</p>',
    examples: [
      { sentence: '学生はもっと本を読むべきだと思います。', pronunciation: 'がくせいはもっとほんをよむべきだとおもいます。', meaningVi: 'Tôi nghĩ sinh viên nên đọc sách nhiều hơn.' },
      { sentence: '疲れているなら、無理をするべきではありません。', pronunciation: 'つかれているなら、むりをするべきではありません。', meaningVi: 'Nếu mệt thì không nên gắng quá sức.' },
      { sentence: '彼に本当のことを言うべきでした。', pronunciation: 'かれにほんとうのことをいうべきでした。', meaningVi: 'Đáng lẽ tôi nên nói sự thật với anh ấy.' },
    ],
    commonMistakes: '❌ 行くべきじゃなかったのに行った意味で: 行かないべきでした → ✅ 行くべきではありませんでした (phủ định đặt ở べき, không ở động từ)',
    comparedWith: 'べきだ (đạo lý, chủ quan mạnh) > ほうがいい (lời khuyên nhẹ) ; なければならない (bắt buộc khách quan/quy định).',
  },
  {
    level: 'N3',
    title: '〜わけだ／〜わけではない — thảo nào／không hẳn là',
    structure: 'Thể thường + わけだ｜Thể thường + わけではない｜V-る + わけにはいかない',
    explanation:
      '<p>Họ mẫu <strong>わけ</strong> rất hay gặp ở N3:</p><ul><li><strong>〜わけだ</strong>: kết luận tất yếu "thảo nào/tức là" — 10年日本にいたんですか。日本語が上手なわけですね。(Ở Nhật 10 năm à? Thảo nào tiếng Nhật giỏi.)</li><li><strong>〜わけではない</strong>: phủ định một phần "không hẳn là" — 肉が嫌いなわけではありませんが、あまり食べません。</li><li><strong>〜わけにはいかない</strong>: không thể (vì lý do xã hội/đạo lý) — 大事な会議があるので、休むわけにはいきません。</li></ul>',
    examples: [
      { sentence: 'エアコンがついていない？暑いわけだ。', pronunciation: 'えあこんがついていない？あついわけだ。', meaningVi: 'Điều hòa không bật à? Thảo nào nóng thế.' },
      { sentence: '甘いものを食べないわけではありません。', pronunciation: 'あまいものをたべないわけではありません。', meaningVi: 'Không hẳn là tôi không ăn đồ ngọt.' },
      { sentence: '明日試験があるので、今夜は遊ぶわけにはいきません。', pronunciation: 'あしたしけんがあるので、こんやはあそぶわけにはいきません。', meaningVi: 'Mai có bài thi nên tối nay không thể đi chơi được.' },
    ],
    commonMistakes: '❌ Nhầm わけではない với 全然〜ない: 好きなわけではない = "không hẳn thích" (vẫn có thể ăn), KHÔNG phải "hoàn toàn không thích"',
    comparedWith: 'わけだ = kết luận logic từ thông tin có sẵn; はずだ = suy đoán trước khi xác nhận; のだ/んです = giải thích lý do.',
  },
];

// ============================ DATA: CONVERSATION (50) ============================
const JA_CONVERSATION: ConversationSeed[] = [
  { question: 'お名前は何ですか。', answer: 'グエン・ヴァン・アインです。', questionPronunciation: 'おなまえはなんですか。', answerPronunciation: 'ぐえん・ゔぁん・あいんです。', meaningVi: 'Q: Bạn tên là gì? — A: Tôi là Nguyễn Văn Anh.', note: 'Hỏi tên lịch sự. Thân mật hơn: お名前は？' },
  { question: 'お国はどちらですか。', answer: 'ベトナムです。', questionPronunciation: 'おくにはどちらですか。', answerPronunciation: 'べとなむです。', meaningVi: 'Q: Bạn đến từ nước nào? — A: Việt Nam ạ.', note: 'どちら lịch sự hơn どこ.' },
  { question: 'お仕事は何をしていますか。', answer: 'エンジニアをしています。', questionPronunciation: 'おしごとはなにをしていますか。', answerPronunciation: 'えんじにあをしています。', meaningVi: 'Q: Bạn làm nghề gì? — A: Tôi là kỹ sư.', note: 'Nghề nghiệp + をしています.' },
  { question: '日本は初めてですか。', answer: 'はい、初めてです。', questionPronunciation: 'にほんははじめてですか。', answerPronunciation: 'はい、はじめてです。', meaningVi: 'Q: Đây là lần đầu bạn đến Nhật à? — A: Vâng, lần đầu ạ.', note: '初めて = lần đầu tiên.' },
  { question: '日本語はどのくらい勉強しましたか。', answer: '半年ぐらい勉強しました。', questionPronunciation: 'にほんごはどのくらいべんきょうしましたか。', answerPronunciation: 'はんとしぐらいべんきょうしました。', meaningVi: 'Q: Bạn học tiếng Nhật bao lâu rồi? — A: Khoảng nửa năm.', note: 'どのくらい hỏi khoảng thời gian/số lượng.' },
  { question: '趣味は何ですか。', answer: '映画を見ることです。', questionPronunciation: 'しゅみはなんですか。', answerPronunciation: 'えいがをみることです。', meaningVi: 'Q: Sở thích của bạn là gì? — A: Là xem phim.', note: 'V-る + こと biến động từ thành danh từ.' },
  { question: '週末は何をしますか。', answer: '友達と買い物に行きます。', questionPronunciation: 'しゅうまつはなにをしますか。', answerPronunciation: 'ともだちとかいものにいきます。', meaningVi: 'Q: Cuối tuần bạn làm gì? — A: Đi mua sắm với bạn.', note: 'N + に行く = đi để làm gì.' },
  { question: '今、何時ですか。', answer: '3時15分です。', questionPronunciation: 'いま、なんじですか。', answerPronunciation: 'さんじじゅうごふんです。', meaningVi: 'Q: Bây giờ là mấy giờ? — A: 3 giờ 15 phút.', note: 'Giờ = 〜時, phút = 〜分.' },
  { question: '今日は何曜日ですか。', answer: '木曜日です。', questionPronunciation: 'きょうはなんようびですか。', answerPronunciation: 'もくようびです。', meaningVi: 'Q: Hôm nay là thứ mấy? — A: Thứ Năm.', note: 'Nhớ bộ 7 thứ: 月火水木金土日.' },
  { question: 'お誕生日はいつですか。', answer: '11月3日です。', questionPronunciation: 'おたんじょうびはいつですか。', answerPronunciation: 'じゅういちがつみっかです。', meaningVi: 'Q: Sinh nhật bạn là khi nào? — A: Ngày 3 tháng 11.', note: 'Ngày 1–10 đọc đặc biệt: ついたち、ふつか、みっか…' },
  { question: 'すみません、駅はどこですか。', answer: 'あそこの信号を右に曲がってください。', questionPronunciation: 'すみません、えきはどこですか。', answerPronunciation: 'あそこのしんごうをみぎにまがってください。', meaningVi: 'Q: Xin lỗi, nhà ga ở đâu ạ? — A: Rẽ phải ở chỗ đèn tín hiệu đằng kia.', note: '右/左に曲がる = rẽ phải/trái.' },
  { question: 'ここから空港までどうやって行きますか。', answer: 'リムジンバスが一番便利ですよ。', questionPronunciation: 'ここからくうこうまでどうやっていきますか。', answerPronunciation: 'りむじんばすがいちばんべんりですよ。', meaningVi: 'Q: Từ đây đến sân bay đi thế nào? — A: Xe buýt limousine là tiện nhất đấy.', note: 'どうやって = bằng cách nào.' },
  { question: '新宿までいくらですか。', answer: '200円です。', questionPronunciation: 'しんじゅくまでいくらですか。', answerPronunciation: 'にひゃくえんです。', meaningVi: 'Q: Đến Shinjuku bao nhiêu tiền? — A: 200 yên.', note: 'まで = đến (điểm cuối).' },
  { question: 'この電車は渋谷に止まりますか。', answer: 'いいえ、急行なので止まりません。', questionPronunciation: 'このでんしゃはしぶやにとまりますか。', answerPronunciation: 'いいえ、きゅうこうなのでとまりません。', meaningVi: 'Q: Tàu này có dừng ở Shibuya không? — A: Không, tàu tốc hành nên không dừng.', note: '急行 = tốc hành; 各駅停車 = tàu thường.' },
  { question: '終電は何時ですか。', answer: '12時半ごろです。', questionPronunciation: 'しゅうでんはなんじですか。', answerPronunciation: 'じゅうにじはんごろです。', meaningVi: 'Q: Chuyến tàu cuối lúc mấy giờ? — A: Khoảng 12 rưỡi đêm.', note: '終電 = chuyến cuối; 始発 = chuyến đầu.' },
  { question: 'いらっしゃいませ。何名様ですか。', answer: '2人です。', questionPronunciation: 'いらっしゃいませ。なんめいさまですか。', answerPronunciation: 'ふたりです。', meaningVi: 'Q: Kính chào quý khách. Mấy người ạ? — A: 2 người.', note: '何名様 kính ngữ của 何人.' },
  { question: 'ご注文はお決まりですか。', answer: 'ラーメンと餃子をお願いします。', questionPronunciation: 'ごちゅうもんはおきまりですか。', answerPronunciation: 'らーめんとぎょうざをおねがいします。', meaningVi: 'Q: Quý khách chọn món chưa ạ? — A: Cho tôi ramen và gyoza.', note: '〜をお願いします = cho tôi món...' },
  { question: 'おすすめは何ですか。', answer: '今日は魚がおいしいですよ。', questionPronunciation: 'おすすめはなんですか。', answerPronunciation: 'きょうはさかながおいしいですよ。', meaningVi: 'Q: Quán có món gì ngon (gợi ý)? — A: Hôm nay cá ngon lắm.', note: 'おすすめ = món/điều được gợi ý.' },
  { question: 'お会計をお願いします。', answer: 'かしこまりました。全部で3,500円です。', questionPronunciation: 'おかいけいをおねがいします。', answerPronunciation: 'かしこまりました。ぜんぶでさんぜんごひゃくえんです。', meaningVi: 'Q: Cho tôi thanh toán. — A: Vâng ạ. Tổng cộng 3.500 yên.', note: '全部で = tổng cộng. かしこまりました = "vâng ạ" (nhân viên).' },
  { question: '別々に払えますか。', answer: 'はい、大丈夫ですよ。', questionPronunciation: 'べつべつにはらえますか。', answerPronunciation: 'はい、だいじょうぶですよ。', meaningVi: 'Q: Trả riêng từng người được không? — A: Vâng, được ạ.', note: '別々に = riêng rẽ. Văn hóa 割り勘 (chia đều) rất phổ biến.' },
  { question: 'これはいくらですか。', answer: '税込みで1,100円です。', questionPronunciation: 'これはいくらですか。', answerPronunciation: 'ぜいこみでせんひゃくえんです。', meaningVi: 'Q: Cái này bao nhiêu tiền? — A: 1.100 yên đã gồm thuế.', note: '税込み = đã gồm thuế; 税抜き = chưa thuế.' },
  { question: '試着してもいいですか。', answer: 'はい、試着室はあちらです。', questionPronunciation: 'しちゃくしてもいいですか。', answerPronunciation: 'はい、しちゃくしつはあちらです。', meaningVi: 'Q: Tôi mặc thử được không? — A: Vâng, phòng thử đồ ở đằng kia.', note: '〜てもいいですか = xin phép.' },
  { question: 'もう少し大きいサイズはありますか。', answer: '申し訳ありません、ただいま切らしております。', questionPronunciation: 'もうすこしおおきいさいずはありますか。', answerPronunciation: 'もうしわけありません、ただいまきらしております。', meaningVi: 'Q: Có cỡ lớn hơn một chút không? — A: Xin lỗi, hiện đang hết hàng ạ.', note: '切らしております = kính ngữ "đang hết hàng".' },
  { question: '袋はご利用ですか。', answer: 'いいえ、結構です。', questionPronunciation: 'ふくろはごりようですか。', answerPronunciation: 'いいえ、けっこうです。', meaningVi: 'Q: Quý khách có cần túi không? — A: Không, không cần đâu ạ.', note: '結構です = không cần (từ chối lịch sự). Túi nilon tính phí ở Nhật.' },
  { question: 'カードで払えますか。', answer: 'はい、お使いいただけます。', questionPronunciation: 'かーどではらえますか。', answerPronunciation: 'はい、おつかいいただけます。', meaningVi: 'Q: Trả bằng thẻ được không? — A: Vâng, quý khách dùng được ạ.', note: '現金のみ = chỉ nhận tiền mặt.' },
  { question: 'Wi-Fiのパスワードを教えてもらえますか。', answer: 'こちらの紙に書いてあります。', questionPronunciation: 'わいふぁいのぱすわーどをおしえてもらえますか。', answerPronunciation: 'こちらのかみにかいてあります。', meaningVi: 'Q: Cho tôi xin mật khẩu Wi-Fi được không? — A: Có ghi sẵn trên tờ giấy này ạ.', note: '〜てもらえますか = nhờ vả mềm. 書いてあります = được ghi sẵn (てある).' },
  { question: 'チェックインをお願いします。', answer: 'かしこまりました。パスポートをお願いします。', questionPronunciation: 'ちぇっくいんをおねがいします。', answerPronunciation: 'かしこまりました。ぱすぽーとをおねがいします。', meaningVi: 'Q: Cho tôi nhận phòng. — A: Vâng ạ. Xin cho xem hộ chiếu.', note: 'Khách sạn luôn cần hộ chiếu với khách nước ngoài.' },
  { question: '朝食は何時からですか。', answer: '7時から9時半までです。', questionPronunciation: 'ちょうしょくはなんじからですか。', answerPronunciation: 'しちじからくじはんまでです。', meaningVi: 'Q: Bữa sáng từ mấy giờ? — A: Từ 7 giờ đến 9 rưỡi.', note: 'から〜まで = từ... đến...' },
  { question: '荷物を預かってもらえますか。', answer: 'はい、お預かりします。', questionPronunciation: 'にもつをあずかってもらえますか。', answerPronunciation: 'はい、おあずかりします。', meaningVi: 'Q: Giữ hành lý giúp tôi được không? — A: Vâng, tôi xin giữ ạ.', note: '預かる = giữ hộ. Hữu ích trước giờ check-in.' },
  { question: '調子はどうですか。', answer: 'おかげさまで、元気です。', questionPronunciation: 'ちょうしはどうですか。', answerPronunciation: 'おかげさまで、げんきです。', meaningVi: 'Q: Dạo này thế nào? — A: Nhờ trời, tôi khỏe.', note: 'おかげさまで = "nhờ ơn" — đáp lễ phép quen thuộc.' },
  { question: 'どうしたんですか。顔色が悪いですよ。', answer: 'ちょっと頭が痛いんです。', questionPronunciation: 'どうしたんですか。かおいろがわるいですよ。', answerPronunciation: 'ちょっとあたまがいたいんです。', meaningVi: 'Q: Bạn sao thế? Sắc mặt kém lắm. — A: Tôi hơi đau đầu.', note: '〜んです giải thích tình trạng.' },
  { question: '病院へ行ったほうがいいですよ。', answer: 'そうですね。午後、行ってみます。', questionPronunciation: 'びょういんへいったほうがいいですよ。', answerPronunciation: 'そうですね。ごご、いってみます。', meaningVi: 'Q: Bạn nên đi bệnh viện đấy. — A: Ừ nhỉ. Chiều tôi sẽ thử đi.', note: 'V-たほうがいい = lời khuyên; V-てみる = thử làm.' },
  { question: '薬にアレルギーはありますか。', answer: 'いいえ、特にありません。', questionPronunciation: 'くすりにあれるぎーはありますか。', answerPronunciation: 'いいえ、とくにありません。', meaningVi: 'Q: Bạn có dị ứng thuốc không? — A: Không, không có gì đặc biệt.', note: '特に = đặc biệt (là). Câu hỏi thường gặp ở hiệu thuốc.' },
  { question: 'もしもし、田中さんのお宅ですか。', answer: 'はい、そうです。どちら様ですか。', questionPronunciation: 'もしもし、たなかさんのおたくですか。', answerPronunciation: 'はい、そうです。どちらさまですか。', meaningVi: 'Q: Alô, đây có phải nhà anh Tanaka không ạ? — A: Vâng đúng rồi. Xin hỏi ai đấy ạ?', note: 'もしもし chỉ dùng trên điện thoại. どちら様 = ai (kính ngữ).' },
  { question: '伝言をお願いできますか。', answer: 'はい、どうぞ。', questionPronunciation: 'でんごんをおねがいできますか。', answerPronunciation: 'はい、どうぞ。', meaningVi: 'Q: Tôi nhờ nhắn lại được không? — A: Vâng, xin mời.', note: '伝言 = lời nhắn.' },
  { question: '今、話しても大丈夫ですか。', answer: 'すみません、今ちょっと手が離せなくて…。', questionPronunciation: 'いま、はなしてもだいじょうぶですか。', answerPronunciation: 'すみません、いまちょっとてがはなせなくて…。', meaningVi: 'Q: Bây giờ nói chuyện được không? — A: Xin lỗi, giờ tôi đang dở tay…', note: '手が離せない = đang bận không dứt ra được. Bỏ lửng câu = từ chối mềm.' },
  { question: '会議は何時からですか。', answer: '10時からです。遅れないでくださいね。', questionPronunciation: 'かいぎはなんじからですか。', answerPronunciation: 'じゅうじからです。おくれないでくださいね。', meaningVi: 'Q: Cuộc họp bắt đầu mấy giờ? — A: Từ 10 giờ. Đừng đến muộn nhé.', note: '〜ないでください = xin đừng.' },
  { question: 'この書類、確認していただけますか。', answer: 'はい、後で見ておきます。', questionPronunciation: 'このしょるい、かくにんしていただけますか。', answerPronunciation: 'はい、あとでみておきます。', meaningVi: 'Q: Anh/chị xem giúp tài liệu này được không ạ? — A: Được, lát tôi sẽ xem trước.', note: '〜ていただけますか nhờ vả kính trọng; 〜ておく = làm sẵn.' },
  { question: 'お先に失礼します。', answer: 'お疲れ様でした。', questionPronunciation: 'おさきにしつれいします。', answerPronunciation: 'おつかれさまでした。', meaningVi: 'Q: Tôi xin phép về trước. — A: Anh/chị vất vả rồi.', note: 'Cặp câu chào cuối ngày làm việc kinh điển ở công sở Nhật.' },
  { question: '手伝いましょうか。', answer: 'ありがとうございます。助かります。', questionPronunciation: 'てつだいましょうか。', answerPronunciation: 'ありがとうございます。たすかります。', meaningVi: 'Q: Tôi giúp một tay nhé? — A: Cảm ơn. May quá.', note: '〜ましょうか = đề nghị giúp; 助かります = "được cứu rồi".' },
  { question: '遅れてすみません。', answer: '大丈夫ですよ。気にしないでください。', questionPronunciation: 'おくれてすみません。', answerPronunciation: 'だいじょうぶですよ。きにしないでください。', meaningVi: 'Q: Xin lỗi tôi đến muộn. — A: Không sao đâu. Đừng bận tâm.', note: '気にしないで = đừng để tâm.' },
  { question: '今度の日曜日、映画を見に行きませんか。', answer: 'いいですね。ぜひ行きましょう。', questionPronunciation: 'こんどのにちようび、えいがをみにいきませんか。', answerPronunciation: 'いいですね。ぜひいきましょう。', meaningVi: 'Q: Chủ nhật này đi xem phim không? — A: Hay đấy. Nhất định đi nhé.', note: '〜ませんか mời; ぜひ = nhất định.' },
  { question: 'すみません、日曜日はちょっと…。', answer: 'じゃあ、また今度にしましょう。', questionPronunciation: 'すみません、にちようびはちょっと…。', answerPronunciation: 'じゃあ、またこんどにしましょう。', meaningVi: 'Q: Xin lỗi, Chủ nhật thì hơi… (kẹt) — A: Vậy để dịp khác nhé.', note: 'ちょっと… bỏ lửng = cách từ chối chuẩn Nhật, không cần nói lý do.' },
  { question: '何か飲みますか。', answer: 'じゃあ、コーヒーをいただきます。', questionPronunciation: 'なにかのみますか。', answerPronunciation: 'じゃあ、こーひーをいただきます。', meaningVi: 'Q: Bạn uống gì không? — A: Vậy cho tôi cà phê.', note: 'いただきます = nhận (khiêm nhường).' },
  { question: '写真を撮ってもらえますか。', answer: 'いいですよ。はい、チーズ！', questionPronunciation: 'しゃしんをとってもらえますか。', answerPronunciation: 'いいですよ。はい、ちーず！', meaningVi: 'Q: Chụp ảnh giúp tôi được không? — A: Được chứ. Nào, cười lên!', note: 'はい、チーズ = "say cheese" phiên bản Nhật.' },
  { question: '道に迷ってしまいました。', answer: '大丈夫ですか。どこへ行きたいんですか。', questionPronunciation: 'みちにまよってしまいました。', answerPronunciation: 'だいじょうぶですか。どこへいきたいんですか。', meaningVi: 'Q: Tôi bị lạc đường mất rồi. — A: Bạn ổn chứ? Bạn muốn đi đâu?', note: '〜てしまう = trót/lỡ (việc không mong muốn).' },
  { question: '財布をなくしてしまったんですが…。', answer: 'では、こちらの用紙にご記入ください。', questionPronunciation: 'さいふをなくしてしまったんですが…。', answerPronunciation: 'では、こちらのようしにごきにゅうください。', meaningVi: 'Q: Tôi lỡ làm mất ví rồi… — A: Vậy xin điền vào mẫu này ạ.', note: 'Đến 交番 (bốt cảnh sát) khi mất đồ — tỷ lệ tìm lại ở Nhật rất cao.' },
  { question: '日本の生活はどうですか。', answer: 'もう慣れました。とても住みやすいです。', questionPronunciation: 'にほんのせいかつはどうですか。', answerPronunciation: 'もうなれました。とてもすみやすいです。', meaningVi: 'Q: Cuộc sống ở Nhật thế nào? — A: Tôi quen rồi. Rất dễ sống.', note: 'V-ます + やすい = dễ làm gì.' },
  { question: '将来、何になりたいですか。', answer: '通訳になりたいと思っています。', questionPronunciation: 'しょうらい、なにになりたいですか。', answerPronunciation: 'つうやくになりたいとおもっています。', meaningVi: 'Q: Tương lai bạn muốn trở thành gì? — A: Tôi muốn trở thành phiên dịch viên.', note: 'N + になる = trở thành.' },
  { question: 'ちょっとお聞きしたいんですが。', answer: 'はい、何でしょうか。', questionPronunciation: 'ちょっとおききしたいんですが。', answerPronunciation: 'はい、なんでしょうか。', meaningVi: 'Q: Tôi muốn hỏi một chút ạ. — A: Vâng, gì vậy ạ?', note: 'お聞きしたい = khiêm nhường của 聞きたい. Mở đầu hỏi người lạ rất tự nhiên.' },
  { question: 'これ、つまらないものですが、どうぞ。', answer: 'そんな、気を使わないでください。ありがとうございます。', questionPronunciation: 'これ、つまらないものですが、どうぞ。', answerPronunciation: 'そんな、きをつかわないでください。ありがとうございます。', meaningVi: 'Q: Đây là chút quà mọn, xin nhận cho. — A: Ôi, bạn đừng khách sáo thế. Cảm ơn nhé.', note: 'つまらないものですが = câu khiêm tốn kinh điển khi tặng quà.' },
];

// ============================ DATA: READING (10) ============================
const JA_READING: ReadingSeed[] = [
  {
    title: '私の一日',
    content: '<p>私は毎朝6時に起きます。起きてから、シャワーを浴びて、朝ご飯を食べます。朝ご飯はいつもパンと卵とコーヒーです。7時半に家を出て、電車で会社へ行きます。会社は9時から5時までです。</p><p>仕事が終わってから、ときどきスーパーで買い物をします。うちへ帰って、晩ご飯を作ります。晩ご飯の後で、日本語を1時間勉強します。それから、シャワーを浴びて、11時ごろ寝ます。</p>',
    translation: '<p>Tôi dậy lúc 6 giờ mỗi sáng. Sau khi dậy, tôi tắm rồi ăn sáng. Bữa sáng lúc nào cũng là bánh mì, trứng và cà phê. 7 rưỡi tôi ra khỏi nhà, đi tàu điện đến công ty. Công ty làm việc từ 9 giờ đến 5 giờ.</p><p>Sau giờ làm, thỉnh thoảng tôi mua sắm ở siêu thị. Về nhà, tôi nấu bữa tối. Sau bữa tối, tôi học tiếng Nhật 1 tiếng. Sau đó tắm và đi ngủ khoảng 11 giờ.</p>',
  },
  {
    title: '日本の四季',
    content: '<p>日本には四つの季節があります。春は3月から5月までです。桜が咲いて、とてもきれいです。みんな公園でお花見をします。</p><p>夏は暑くて、湿度が高いです。7月と8月には花火大会やお祭りがたくさんあります。秋は涼しくて、紅葉がきれいな季節です。食べ物もおいしいです。冬は寒いです。北の地方では雪がたくさん降ります。スキーや温泉が人気です。</p>',
    translation: '<p>Nhật Bản có bốn mùa. Mùa xuân từ tháng 3 đến tháng 5. Hoa anh đào nở rất đẹp. Mọi người ngắm hoa (hanami) ở công viên.</p><p>Mùa hè nóng và độ ẩm cao. Tháng 7 và 8 có nhiều lễ hội pháo hoa và matsuri. Mùa thu mát mẻ, là mùa lá đỏ tuyệt đẹp. Đồ ăn cũng ngon. Mùa đông lạnh. Ở vùng phía bắc tuyết rơi nhiều. Trượt tuyết và tắm onsen rất được ưa chuộng.</p>',
  },
  {
    title: 'コンビニは便利です',
    content: '<p>日本のコンビニはとても便利です。24時間開いていますから、いつでも買い物ができます。お弁当やおにぎりやパンなど、食べ物がたくさんあります。</p><p>コンビニでは、電気代や水道代を払うこともできます。荷物を送ることもできます。コピー機もATMもあります。日本に住んでいる外国人にとって、コンビニは生活に欠かせない場所です。</p>',
    translation: '<p>Cửa hàng tiện lợi ở Nhật rất tiện. Vì mở cửa 24 giờ nên lúc nào cũng mua sắm được. Có rất nhiều đồ ăn như cơm hộp, cơm nắm, bánh mì.</p><p>Ở konbini còn có thể trả tiền điện, tiền nước. Cũng có thể gửi hàng. Có cả máy photocopy và ATM. Với người nước ngoài sống ở Nhật, konbini là nơi không thể thiếu trong cuộc sống.</p>',
  },
  {
    title: '電車のマナー',
    content: '<p>日本の電車の中では、いくつかのマナーがあります。まず、電車の中で電話をしてはいけません。メールやゲームは大丈夫ですが、音を出してはいけません。</p><p>優先席の近くでは、携帯電話の電源を切ったほうがいいです。また、混んでいる電車では、リュックは前に持ちます。降りる人が先で、乗る人は後です。ルールを守って、気持ちよく電車に乗りましょう。</p>',
    translation: '<p>Trên tàu điện Nhật có một số quy tắc ứng xử. Trước hết, không được gọi điện thoại trong tàu. Nhắn tin hay chơi game thì được, nhưng không được phát ra tiếng.</p><p>Gần ghế ưu tiên, nên tắt nguồn điện thoại. Ngoài ra, khi tàu đông, ba lô phải đeo ra phía trước. Người xuống trước, người lên sau. Hãy tuân thủ quy tắc để đi tàu thoải mái.</p>',
  },
  {
    title: '富士山に登りました',
    content: '<p>先月、友達と富士山に登りました。富士山は日本で一番高い山で、高さは3,776メートルです。</p><p>夜9時に五合目から登り始めました。道は暗くて、寒かったですが、星がとてもきれいでした。朝4時半ごろ、頂上に着きました。頂上から見た日の出は、今まで見た中で一番美しい景色でした。疲れましたが、本当に登ってよかったと思います。</p>',
    translation: '<p>Tháng trước, tôi leo núi Phú Sĩ cùng bạn. Phú Sĩ là ngọn núi cao nhất Nhật Bản, cao 3.776 mét.</p><p>9 giờ tối chúng tôi bắt đầu leo từ trạm số 5. Đường tối và lạnh nhưng sao trời rất đẹp. Khoảng 4 rưỡi sáng, chúng tôi lên đến đỉnh. Cảnh mặt trời mọc nhìn từ đỉnh núi là cảnh đẹp nhất tôi từng thấy. Tuy mệt nhưng tôi thấy leo thật đáng.</p>',
  },
  {
    title: '日本の食事のマナー',
    content: '<p>日本では、食事の前に「いただきます」と言います。食事の後には「ごちそうさまでした」と言います。これは、料理を作った人や食べ物に感謝する言葉です。</p><p>はしの使い方にもルールがあります。はしからはしへ食べ物を渡してはいけません。ご飯にはしを立ててもいけません。ラーメンやそばは、音を立てて食べても大丈夫です。これは「おいしい」というサインです。</p>',
    translation: '<p>Ở Nhật, trước bữa ăn người ta nói "itadakimasu". Sau bữa ăn nói "gochisousama deshita". Đây là lời cảm ơn người nấu và đồ ăn.</p><p>Cách dùng đũa cũng có quy tắc. Không được gắp chuyền thức ăn từ đũa sang đũa. Cũng không được cắm đũa thẳng vào bát cơm. Ramen hay soba thì húp thành tiếng cũng không sao — đó là dấu hiệu "ngon".</p>',
  },
  {
    title: 'アルバイトの面接',
    content: '<p>昨日、レストランのアルバイトの面接に行きました。少し緊張しましたが、店長はやさしい人でした。</p><p>「どうしてこの店で働きたいんですか」と聞かれました。私は「日本語を使う仕事がしたいからです。それに、料理にも興味があります」と答えました。「いつから働けますか」と聞かれたので、「来週から大丈夫です」と言いました。今日、店から電話があって、採用されました。来週から週3日働きます。</p>',
    translation: '<p>Hôm qua tôi đi phỏng vấn làm thêm ở nhà hàng. Hơi hồi hộp nhưng quản lý là người hiền.</p><p>Tôi bị hỏi "Vì sao bạn muốn làm ở quán này?". Tôi trả lời "Vì tôi muốn làm công việc dùng tiếng Nhật. Hơn nữa tôi cũng thích nấu ăn". Được hỏi "Khi nào có thể bắt đầu?", tôi nói "Từ tuần sau là được ạ". Hôm nay quán gọi điện báo tôi được nhận. Từ tuần sau tôi làm 3 buổi mỗi tuần.</p>',
  },
  {
    title: '温泉の入り方',
    content: '<p>温泉は日本の文化の一つです。でも、入り方にルールがありますから、気をつけてください。</p><p>まず、お風呂に入る前に、体を洗います。タオルをお湯の中に入れてはいけません。頭にのせるか、そばに置きます。泳いではいけません。写真を撮ることも禁止です。タトゥーがある人は、入れない温泉もありますから、先に確認したほうがいいです。ルールを守れば、温泉は最高の体験になりますよ。</p>',
    translation: '<p>Onsen là một nét văn hóa Nhật. Nhưng cách tắm có quy tắc nên hãy chú ý.</p><p>Trước hết, phải tắm rửa sạch cơ thể trước khi vào bồn. Không được cho khăn vào nước. Đội lên đầu hoặc để bên cạnh. Không được bơi. Chụp ảnh cũng bị cấm. Người có hình xăm có thể không được vào một số onsen nên xác nhận trước thì tốt hơn. Nếu tuân thủ quy tắc, onsen sẽ là trải nghiệm tuyệt vời.</p>',
  },
  {
    title: 'ゴミの出し方',
    content: '<p>日本では、ゴミの分別がとても大切です。ゴミは大きく「燃えるゴミ」「燃えないゴミ」「資源ゴミ」に分けます。</p><p>燃えるゴミは生ゴミや紙などです。ペットボトルや缶やびんは資源ゴミです。ゴミを出す日は地域によって違います。例えば、月曜日と木曜日は燃えるゴミ、水曜日は資源ゴミという感じです。決められた日の朝、決められた場所に出さなければなりません。最初は難しいですが、慣れれば大丈夫です。</p>',
    translation: '<p>Ở Nhật, phân loại rác rất quan trọng. Rác được chia thành "rác cháy được", "rác không cháy được" và "rác tài nguyên".</p><p>Rác cháy được là rác thực phẩm, giấy... Chai nhựa, lon, chai thủy tinh là rác tài nguyên. Ngày đổ rác khác nhau tùy khu vực. Ví dụ thứ Hai và thứ Năm là rác cháy được, thứ Tư là rác tài nguyên. Phải đổ rác đúng nơi quy định vào sáng ngày quy định. Ban đầu thấy khó nhưng quen rồi thì không sao.</p>',
  },
  {
    title: '日本の年末年始',
    content: '<p>日本の年末年始には、特別な習慣がたくさんあります。12月31日は大晦日です。大晦日の夜、多くの人は「年越しそば」を食べます。長いそばのように、長く生きられるようにという意味です。</p><p>1月1日はお正月です。家族でおせち料理を食べたり、神社やお寺へ初詣に行ったりします。子供たちはお年玉をもらえるので、お正月が大好きです。「あけましておめでとうございます」は新年のあいさつです。</p>',
    translation: '<p>Dịp cuối năm và đầu năm ở Nhật có nhiều phong tục đặc biệt. Ngày 31/12 là Omisoka (tất niên). Đêm tất niên, nhiều người ăn "toshikoshi soba" — ý nghĩa là sống lâu như sợi mì dài.</p><p>Ngày 1/1 là Tết (Oshougatsu). Cả gia đình ăn cỗ osechi, đi hatsumode (viếng đền chùa đầu năm). Trẻ con được nhận tiền lì xì otoshidama nên rất thích Tết. "Akemashite omedetou gozaimasu" là câu chúc năm mới.</p>',
  },
];

// ============================ DATA: QNA (10) ============================
const JA_QNA: QnaSeed[] = [
  { question: '「すみません」と「ごめんなさい」はどう違いますか。', answer: '「すみません」は謝るとき、呼びかけるとき、感謝するときにも使えます。「ごめんなさい」は謝るときだけに使い、より個人的でカジュアルです。', pronunciation: '「すみません」はあやまるとき、よびかけるとき、かんしゃするときにもつかえます。「ごめんなさい」はあやまるときだけにつかい、よりこじんてきでかじゅあるです。', meaningVi: 'Sumimasen dùng được cả khi xin lỗi, gọi người khác, lẫn cảm ơn. Gomennasai chỉ dùng khi xin lỗi, thân mật và cá nhân hơn.' },
  { question: '「は」と「が」はどう使い分けますか。', answer: '「は」は話のテーマを示します。「が」は新しい情報や主語を強調するときに使います。「私は学生です」はテーマ、「私が行きます」は「私」を強調しています。', pronunciation: '「は」ははなしのてーまをしめします。「が」はあたらしいじょうほうやしゅごをきょうちょうするときにつかいます。', meaningVi: 'は nêu chủ đề câu chuyện; が đánh dấu thông tin mới hoặc nhấn mạnh chủ ngữ. 私は学生です nêu chủ đề, 私が行きます nhấn "chính tôi" đi.' },
  { question: '敬語はいつ使えばいいですか。', answer: '目上の人、初めて会う人、お客様、店や会社での場面で使います。友達や家族には普通体で話します。', pronunciation: 'めうえのひと、はじめてあうひと、おきゃくさま、みせやかいしゃでのばめんでつかいます。ともだちやかぞくにはふつうたいではなします。', meaningVi: 'Dùng kính ngữ với người trên, người mới gặp, khách hàng, và trong cửa hàng/công ty. Với bạn bè, gia đình thì nói thể thường.' },
  { question: '「あなた」を使ってもいいですか。', answer: 'あまり使いません。日本語では相手の名前に「さん」をつけて呼ぶのが自然です。「あなた」は失礼に聞こえることがあります。', pronunciation: 'あまりつかいません。にほんごではあいてのなまえに「さん」をつけてよぶのがしぜんです。「あなた」はしつれいにきこえることがあります。', meaningVi: 'Ít khi dùng. Trong tiếng Nhật, gọi tên đối phương kèm "san" là tự nhiên nhất. "Anata" đôi khi nghe thất lễ.' },
  { question: '漢字はいくつ覚えればいいですか。', answer: '日常生活には常用漢字の約2,136字が目安です。N5は約100字、N3は約650字、N1は約2,000字です。毎日少しずつ覚えるのが大切です。', pronunciation: 'にちじょうせいかつにはじょうようかんじのやくにせんひゃくさんじゅうろくじがめやすです。', meaningVi: 'Sinh hoạt hàng ngày cần khoảng 2.136 chữ kanji thông dụng. N5 khoảng 100 chữ, N3 khoảng 650, N1 khoảng 2.000. Quan trọng là học đều mỗi ngày một ít.' },
  { question: '「〜さん」「〜くん」「〜ちゃん」はどう違いますか。', answer: '「さん」は一番丁寧で、誰にでも使えます。「くん」は主に男性の後輩や同僚に、「ちゃん」は子供や親しい女性に使います。', pronunciation: '「さん」はいちばんていねいで、だれにでもつかえます。「くん」はおもにだんせいのこうはいやどうりょうに、「ちゃん」はこどもやしたしいじょせいにつかいます。', meaningVi: 'San lịch sự nhất, dùng với ai cũng được. Kun chủ yếu cho đàn em/đồng nghiệp nam, chan cho trẻ con và phụ nữ thân thiết.' },
  { question: 'カタカナは何に使いますか。', answer: '外来語（コーヒー、パソコン）、外国の名前、擬音語、強調したい言葉に使います。', pronunciation: 'がいらいご（こーひー、ぱそこん）、がいこくのなまえ、ぎおんご、きょうちょうしたいことばにつかいます。', meaningVi: 'Katakana dùng cho từ ngoại lai (coffee, computer), tên nước ngoài, từ tượng thanh, và từ muốn nhấn mạnh.' },
  { question: '日本語の語順のルールは何ですか。', answer: '基本は「主語→目的語→動詞」です。動詞は必ず文の最後に来ます。「私はりんごを食べます」のようになります。', pronunciation: 'きほんは「しゅご→もくてきご→どうし」です。どうしはかならずぶんのさいごにきます。', meaningVi: 'Trật tự cơ bản là Chủ ngữ → Tân ngữ → Động từ. Động từ luôn đứng cuối câu: watashi wa ringo o tabemasu.' },
  { question: '「大丈夫です」は「はい」ですか「いいえ」ですか。', answer: '両方の意味があります。「手伝いましょうか」「大丈夫です」は「いいえ、結構です」の意味です。文脈で判断しましょう。', pronunciation: 'りょうほうのいみがあります。「てつだいましょうか」「だいじょうぶです」は「いいえ、けっこうです」のいみです。ぶんみゃくではんだんしましょう。', meaningVi: 'Daijoubu desu có cả hai nghĩa. Khi được hỏi "Tôi giúp nhé?", trả lời "daijoubu desu" nghĩa là "không cần đâu". Phải dựa vào ngữ cảnh.' },
  { question: 'JLPTのレベルはどう選べばいいですか。', answer: '初心者はN5から始めます。日常会話ができればN3、仕事で使うならN2以上が目安です。N2があれば多くの会社に就職できます。', pronunciation: 'しょしんしゃはえぬごからはじめます。にちじょうかいわができればえぬさん、しごとでつかうならえぬにいじょうがめやすです。', meaningVi: 'Người mới bắt đầu thi N5. Giao tiếp hàng ngày được thì N3, dùng trong công việc thì cần N2 trở lên. Có N2 là xin việc được ở nhiều công ty Nhật.' },
];

// ============================ DATA: LISTENING ============================
// Intentionally empty: transcripts must match real videos exactly, so
// curate them by hand in /admin/language (Listening tab) instead of
// seeding guessed content against real YouTube URLs.
const JA_LISTENING: ListeningSeed[] = [];

// ============================ MAIN ============================
async function main(): Promise<void> {
  const language = await prisma.language.findUnique({ where: { code: 'ja' } });
  if (!language) {
    console.error("❌ Language 'ja' not found — run seed.my-language.ts first.");
    process.exit(1);
  }

  console.log(`🌱 Seeding EXTRA Japanese content (language id=${language.id})...`);
  await seedVocab(language.id, [...JA_VOCAB_PART1, ...JA_VOCAB_PART2, ...JA_VOCAB_PART3, ...JA_VOCAB_PART4]);
  await seedGrammar(language.id, [
    ...JA_GRAMMAR_N5A,
    ...JA_GRAMMAR_N5B,
    ...JA_GRAMMAR_N5C,
    ...JA_GRAMMAR_N4A,
    ...JA_GRAMMAR_N4B,
    ...JA_GRAMMAR_N3,
  ]);
  await seedListening(language.id, JA_LISTENING);
  await seedConversation(language.id, JA_CONVERSATION);
  await seedReading(language.id, JA_READING);
  await seedQna(language.id, JA_QNA);

  console.log('✅ JA-extra seed complete:');
  for (const [section, s] of Object.entries(summary)) {
    const skipped = 'skipped' in s ? ` (skipped ${(s as { skipped: number }).skipped})` : '';
    console.log(`   ${section}: +${s.created}${skipped}`);
  }
}

main()
  .catch((err) => {
    console.error('❌ JA-extra seed failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
