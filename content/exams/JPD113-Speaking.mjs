// JPD113 — Speaking (Vấn đáp) exam papers for Exam Room.
// Modeled as kind:'PE', peType:'SPEAK' (the ONLY existing exam kind with a
// real record-audio → transcribe → AI-grade pipeline — see
// src/services/exam.grading.service.ts). One question per exam, with
// `speakingPrompts` holding the ordered list of oral Q&A prompts (one audio
// recording per prompt, exactly matching the teacher's slide deck format:
// examiner shows a person card + an object card, asks a fixed set of
// questions about them). `rubric` carries the model answer per prompt so
// the AI grader checks factual correctness, not just fluency.
// STT + grading are Japanese-aware via course code "JPD113" (see
// src/routes/exam.routes.ts submit-speak — auto-detects language:'ja').
//
// Đề 1 reuses the teacher's own sample cards (ダニエル + 時計, from
// "JPD113 - Speaking (Q&A)" slide deck). Đề 2-5 are new person+object pairs
// (names picked from the same deck's name roster that never got a full
// card) so students get real variety while staying inside JPD113 scope.

function speakInstructions(personEn, personVi, objectEn, objectVi, qaEn, qaVi, tipsVi) {
  return (
    '<div class="ml-en"><h3>How this exam works</h3><p>The examiner shows you a <b>person card</b> and an <b>object card</b>, then asks 9 questions about them, one at a time. For the LAST question, the examiner shows a <b>picture of a place</b> instead of a card, and asks what you do there ("ここで何をしますか"). Record your spoken answer for each question (tap record, answer in Japanese, tap stop) — 10 short recordings total.</p>' +
    '<h3>Person card</h3><p>' + personEn + '</p>' +
    '<h3>Object card</h3><p>' + objectEn + '</p>' +
    '<h3>The 9 questions &amp; model answers</h3><p>' + qaEn + '</p></div>' +
    '<div class="ml-vi"><h3>Cách làm bài thi này</h3><p>Giám khảo đưa bạn một <b>thẻ nhân vật</b> và một <b>thẻ đồ vật</b>, rồi hỏi lần lượt 9 câu hỏi. Ở CÂU CUỐI, thay vì thẻ, giám khảo cho xem một <b>bức tranh vẽ một địa điểm</b> và hỏi bạn làm gì ở đó ("ここで何をしますか") — bạn nhìn tranh rồi trả lời, không có chữ ghi sẵn. Thu âm câu trả lời cho từng câu (bấm ghi âm, trả lời bằng tiếng Nhật, bấm dừng) — tổng cộng 10 đoạn ghi âm ngắn. AI sẽ nghe và chấm nội dung + ngữ pháp, có thể chấm sai lệch một chút do nhận diện giọng nói — hãy nói to, rõ, chậm rãi.</p>' +
    '<h3>Thẻ nhân vật</h3><p>' + personVi + '</p>' +
    '<h3>Thẻ đồ vật</h3><p>' + objectVi + '</p>' +
    '<h3>9 câu hỏi &amp; đáp án mẫu (học thuộc trước khi thi thật)</h3><p>' + qaVi + '</p>' +
    '<h3>Mẹo &amp; lưu ý</h3><p>' + tipsVi + '</p></div>'
  );
}

const COMMON_TIPS_VI =
  '<b>Kỹ thuật làm bài vấn đáp:</b> luôn trả lời NGUYÊN CÂU đầy đủ chủ ngữ+です/ます, đừng chỉ nói 1 từ (giám khảo chấm cả ngữ pháp, không chỉ đúng/sai thông tin). ' +
  'Với câu hỏi tuổi/ngày, đọc số CẨN THẬN theo đúng cách đọc bất quy tắc đã học (20歳=はたち, tháng 4/7/9, ngày 1-10/14/20/24). ' +
  'Với câu hỏi giá tiền, nhớ đọc đúng đơn vị (円/ドン/ドル) và biến âm ひゃく/びゃく/ぴゃく. ' +
  'Với câu "だれのですか", luôn trả lời bằng khuôn "[tên]さんのです", đừng chỉ nói tên suông.';

export default {
  course: { courseCode: 'JPD113' },
  exams: [
    // ═══════════════════ ĐỀ 1 — dựa trên đề mẫu (ダニエル + 時計) ═══════════════════
    {
      kind: 'PE', peType: 'SPEAK',
      code: 'SPEAK-D1',
      source: 'REAL',
      sortOrder: 200,
      title: 'Speaking — Set 1: Teacher Daniel & the pocket watch|||Vấn đáp — Đề 1: Thầy Daniel & chiếc đồng hồ',
      description: 'Dựa trên bộ thẻ mẫu của giáo viên (ダニエル + 時計ローレックス) — 9 câu hỏi vấn đáp đầy đủ 3 nhóm: nhân thân, đồ vật, lịch nghỉ.',
      durationMinutes: 20,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: speakInstructions(
        'Name: ダニエル (Daniel) &middot; Nationality: Australian &middot; Age: 31 &middot; Occupation: Teacher at Sakura High School &middot; Hobbies: Reading books, Cooking &middot; Date of birth: July 24th.',
        'Tên: ダニエル (Daniel) &middot; Quốc tịch: Úc &middot; Tuổi: 31 &middot; Nghề nghiệp: Giáo viên tại trường Sakura High School &middot; Sở thích: Đọc sách, Nấu ăn &middot; Sinh nhật: 24 tháng 7.',
        'Object: 時計 (pocket watch) &middot; Brand: ローレックス &middot; Made in China &middot; Price: 560,000 VND &middot; Owner: アインせんせい (a teacher, NOT Daniel — a common trap!). Also: SAKURA SCHOOL opening hours 8:10~22:30, closed Wednesday.',
        'Đồ vật: 時計 (đồng hồ bỏ túi) &middot; Thương hiệu: ローレックス &middot; Sản xuất tại Trung Quốc &middot; Giá: 560.000 VNĐ &middot; Chủ sở hữu: アインせんせい (một giáo viên KHÁC, không phải Daniel — đây là bẫy hay gặp!). Ngoài ra: trường SAKURA SCHOOL mở cửa 8h10~22h30, nghỉ thứ Tư.',
        '<b>1. この人の　おなまえは。</b> → ダニエルさんです。<br>' +
        '<b>2. ダニエルさんの　おくには　どちらですか。</b> → オーストラリアです。<br>' +
        '<b>3. ダニエルさんの　おしごとは　なんですか。</b> → せんせいです。さくらこうこうの せんせいです。<br>' +
        '<b>4. ダニエルさんは　なんさいですか。</b> → 31さいです。<br>' +
        '<b>5. ダニエルさんの　たんじょうびは　いつですか。</b> → 7月24日です。<br>' +
        '<b>6. ダニエルさんの　しゅみは　なんですか。</b> → どくしょと りょうりです。<br>' +
        '<b>7. この　とけいは　いくらですか。</b> → 560,000ドンです。<br>' +
        '<b>8. この　とけいは　だれのですか。</b> → アインせんせいのです。（ダニエルさんのじゃないです！）<br>' +
        '<b>9. さくらこうこうは　何曜日が　やすみですか。</b> → 水曜日です。<br>' +
        '<b>10. (picture) ここで　何を　しますか。</b> → にほんごを べんきょうします。',
        '<b>1. この人の　おなまえは。</b> (Tên người này là gì?) → ダニエルさんです。(Là bạn Daniel.)<br>' +
        '<b>2. ダニエルさんの　おくには　どちらですか。</b> (Daniel đến từ nước nào?) → オーストラリアです。(Nước Úc.)<br>' +
        '<b>3. ダニエルさんの　おしごとは　なんですか。</b> (Nghề nghiệp của Daniel?) → せんせいです。さくらこうこうの せんせいです。(Là giáo viên. Giáo viên trường Sakura High School.)<br>' +
        '<b>4. ダニエルさんは　なんさいですか。</b> (Daniel bao nhiêu tuổi?) → 31さいです。(31 tuổi.)<br>' +
        '<b>5. ダニエルさんの　たんじょうびは　いつですか。</b> (Sinh nhật Daniel khi nào?) → 7月24日です。(Ngày 24 tháng 7 — しちがつ にじゅうよっか.)<br>' +
        '<b>6. ダニエルさんの　しゅみは　なんですか。</b> (Sở thích của Daniel?) → どくしょと りょうりです。(Đọc sách và nấu ăn.)<br>' +
        '<b>7. この　とけいは　いくらですか。</b> (Đồng hồ này giá bao nhiêu?) → 560,000ドンです。(560.000 đồng.)<br>' +
        '<b>8. この　とけいは　だれのですか。</b> (Đồng hồ này của ai?) → アインせんせいのです。(Của thầy/cô Anh — KHÔNG PHẢI của Daniel, đây là bẫy: đồ vật và nhân vật trên hai thẻ khác nhau không nhất thiết liên quan!)<br>' +
        '<b>9. さくらこうこうは　何曜日が　やすみですか。</b> (Trường Sakura nghỉ thứ mấy?) → 水曜日です。(Thứ Tư.)<br>' +
        '<b>10. (tranh) ここで　何を　しますか。</b> (Giám khảo cho xem một bức tranh — ở đây làm gì?) → にほんごを べんきょうします。(Học tiếng Nhật — vì tranh vẽ một trường học/lớp học.)',
        COMMON_TIPS_VI + ' Bẫy riêng của đề này: đồng hồ KHÔNG phải của Daniel dù cùng xuất hiện trên bàn thi — luôn nghe kỹ câu hỏi "だれの" và tra đúng "Owner" ghi trên thẻ đồ vật, đừng mặc định gán cho người vừa nói tới.',
      ),
      questions: [
        {
          kind: 'SPEAK', points: 10,
          prompt:
            '<div class="ml-en"><p>You are shown the ダニエル (Daniel) person card and the 時計 (pocket watch) object card. Answer the 9 questions in Japanese, one recording per question, in order.</p></div>' +
            '<div class="ml-vi"><p>Bạn được đưa thẻ nhân vật ダニエル (Daniel) và thẻ đồ vật 時計 (đồng hồ). Trả lời 9 câu hỏi bằng tiếng Nhật, mỗi câu một đoạn ghi âm, theo đúng thứ tự.</p></div>',
          speakingPrompts: [
            { text: 'この人の　おなまえは。|||Tên người này là gì?' },
            { text: 'ダニエルさんの　おくには　どちらですか。|||Daniel đến từ nước nào?' },
            { text: 'ダニエルさんの　おしごとは　なんですか。|||Nghề nghiệp của Daniel là gì?' },
            { text: 'ダニエルさんは　なんさいですか。|||Daniel bao nhiêu tuổi?' },
            { text: 'ダニエルさんの　たんじょうびは　いつですか。|||Sinh nhật của Daniel khi nào?' },
            { text: 'ダニエルさんの　しゅみは　なんですか。|||Sở thích của Daniel là gì?' },
            { text: 'この　とけいは　いくらですか。|||Chiếc đồng hồ này giá bao nhiêu?' },
            { text: 'この　とけいは　だれのですか。|||Chiếc đồng hồ này của ai?' },
            { text: 'さくらこうこうは　何曜日が　やすみですか。|||Trường Sakura nghỉ thứ mấy?' },
            { text: 'ここで　何を　しますか。|||Nhìn bức tranh: ở đây bạn làm gì?', imageUrl: '/exam-assets/jpd113-speaking/gakko.svg' },
          ],
          rubric: [
            { id: 'q1', weight: 1, criterion: 'Name: ダニエルさんです。|||Tên: ダニエルさんです。' },
            { id: 'q2', weight: 1, criterion: 'Country: オーストラリアです。|||Quốc gia: オーストラリアです。' },
            { id: 'q3', weight: 1, criterion: 'Job: せんせいです／さくらこうこうのせんせいです。|||Nghề: せんせいです／さくらこうこうのせんせいです。' },
            { id: 'q4', weight: 1, criterion: 'Age: 31さいです (not はたち — only 20 uses はたち).|||Tuổi: 31さいです (không phải はたち — chỉ 20 tuổi mới đọc はたち).' },
            { id: 'q5', weight: 1, criterion: 'Birthday: 7月24日です (しちがつ にじゅうよっか).|||Sinh nhật: 7月24日です (しちがつ にじゅうよっか).' },
            { id: 'q6', weight: 1, criterion: 'Hobby: どくしょとりょうりです。|||Sở thích: どくしょとりょうりです。' },
            { id: 'q7', weight: 1, criterion: 'Price: 560,000ドンです。|||Giá: 560,000ドンです。' },
            { id: 'q8', weight: 1, criterion: 'Owner: アインせんせいのです (NOT Daniel — a trap).|||Chủ sở hữu: アインせんせいのです (KHÔNG phải Daniel — bẫy).' },
            { id: 'q9', weight: 1, criterion: 'Closed day: 水曜日です。|||Ngày nghỉ: 水曜日です。' },
            { id: 'q10', weight: 1, criterion: 'Picture shows a school — にほんごをべんきょうします (or any correct school activity, e.g. べんきょうします alone).|||Tranh vẽ trường học — にほんごをべんきょうします (hoặc bất kỳ hoạt động đúng ở trường, ví dụ chỉ cần べんきょうします).' },
          ],
        },
      ],
    },

    // ═══════════════════ ĐỀ 2 — mới (マルコ + 本) ═══════════════════
    {
      kind: 'PE', peType: 'SPEAK',
      code: 'SPEAK-D2',
      source: 'SAMPLE',
      sortOrder: 201,
      title: 'Speaking — Set 2: Marco & the Japanese book|||Vấn đáp — Đề 2: Marco & quyển sách tiếng Nhật',
      description: 'Bộ thẻ mới — sinh viên Ý và một quyển sách mua ở tiệm sách.',
      durationMinutes: 20,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: speakInstructions(
        'Name: マルコ (Marco) &middot; Nationality: Italian &middot; Age: 25 &middot; Occupation: Student at Waseda University &middot; Hobbies: Music, Traveling &middot; Date of birth: May 15th.',
        'Tên: マルコ (Marco) &middot; Quốc tịch: Ý &middot; Tuổi: 25 &middot; Nghề nghiệp: Sinh viên đại học Waseda &middot; Sở thích: Âm nhạc, Du lịch &middot; Sinh nhật: 15 tháng 5.',
        'Object: 本 (a Japanese book), bought by マルコさん at the BOOKS shop &middot; Price: 1,800 yen. Also: the BOOKS shop opens 7:15 AM, closed Saturday + Sunday.',
        'Đồ vật: 本 (một quyển sách tiếng Nhật), マルコさん đã mua ở tiệm BOOKS &middot; Giá: 1.800 yên. Ngoài ra: tiệm sách BOOKS mở cửa 7h15 sáng, nghỉ thứ Bảy và Chủ Nhật.',
        '<b>1. この人の　おなまえは。</b> → マルコさんです。<br>' +
        '<b>2. マルコさんの　おくには　どちらですか。</b> → イタリアです。<br>' +
        '<b>3. マルコさんの　おしごとは　なんですか。</b> → がくせいです。わせだ大学の がくせいです。<br>' +
        '<b>4. マルコさんは　おいくつですか。</b> → 25さいです。<br>' +
        '<b>5. マルコさんの　たんじょうびは　何月何日ですか。</b> → 5月15日です。<br>' +
        '<b>6. マルコさんの　しゅみは　なんですか。</b> → おんがくと りょこうです。<br>' +
        '<b>7. この　本は　いくらですか。</b> → 1,800円です。<br>' +
        '<b>8. この　本は　だれのですか。</b> → マルコさんのです。<br>' +
        '<b>9. ほんやは　何曜日が　やすみですか。</b> → 土曜日と 日曜日です。<br>' +
        '<b>10. (picture) ここで　何を　しますか。</b> → コーヒーを のみます。',
        '<b>1. この人の　おなまえは。</b> (Tên người này?) → マルコさんです。<br>' +
        '<b>2. マルコさんの　おくには　どちらですか。</b> (Marco đến từ nước nào?) → イタリアです。(Nước Ý.)<br>' +
        '<b>3. マルコさんの　おしごとは　なんですか。</b> (Nghề nghiệp?) → がくせいです。わせだ大学の がくせいです。(Là sinh viên. Sinh viên đại học Waseda.)<br>' +
        '<b>4. マルコさんは　おいくつですか。</b> (Bao nhiêu tuổi — dùng dạng lịch sự おいくつ vì đây là câu hỏi lịch sự thay cho 何歳) → 25さいです。<br>' +
        '<b>5. マルコさんの　たんじょうびは　何月何日ですか。</b> (Sinh nhật ngày mấy?) → 5月15日です。(15 tháng 5 — cả 5月 và 15日 đều đọc ĐỀU ĐẶN, không bất quy tắc.)<br>' +
        '<b>6. マルコさんの　しゅみは　なんですか。</b> (Sở thích?) → おんがくと りょこうです。(Âm nhạc và du lịch.)<br>' +
        '<b>7. この　本は　いくらですか。</b> (Sách giá bao nhiêu?) → 1,800円です。(せんはっぴゃくえん.)<br>' +
        '<b>8. この　本は　だれのですか。</b> (Sách của ai?) → マルコさんのです。(Của Marco — lần này ĐÚNG là của người trong thẻ, khác bẫy ở Đề 1!)<br>' +
        '<b>9. ほんやは　何曜日が　やすみですか。</b> (Tiệm sách nghỉ thứ mấy?) → 土曜日と 日曜日です。(Thứ Bảy và Chủ Nhật.)<br>' +
        '<b>10. (tranh) ここで　何を　しますか。</b> (Nhìn tranh — ở đây làm gì?) → コーヒーを のみます。(Uống cà phê — tranh vẽ quán cà phê.)',
        COMMON_TIPS_VI + ' Đề này KHÔNG có bẫy "chủ sở hữu khác người" như Đề 1 — luôn đọc kỹ thẻ trước khi giả định có bẫy hay không, đừng suy diễn máy móc.',
      ),
      questions: [
        {
          kind: 'SPEAK', points: 10,
          prompt:
            '<div class="ml-en"><p>You are shown the マルコ (Marco) person card and the 本 (book) object card. Answer the 9 questions in Japanese, one recording per question, in order.</p></div>' +
            '<div class="ml-vi"><p>Bạn được đưa thẻ nhân vật マルコ (Marco) và thẻ đồ vật 本 (sách). Trả lời 9 câu hỏi bằng tiếng Nhật, mỗi câu một đoạn ghi âm, theo đúng thứ tự.</p></div>',
          speakingPrompts: [
            { text: 'この人の　おなまえは。|||Tên người này là gì?' },
            { text: 'マルコさんの　おくには　どちらですか。|||Marco đến từ nước nào?' },
            { text: 'マルコさんの　おしごとは　なんですか。|||Nghề nghiệp của Marco là gì?' },
            { text: 'マルコさんは　おいくつですか。|||Marco bao nhiêu tuổi?' },
            { text: 'マルコさんの　たんじょうびは　何月何日ですか。|||Sinh nhật của Marco ngày mấy?' },
            { text: 'マルコさんの　しゅみは　なんですか。|||Sở thích của Marco là gì?' },
            { text: 'この　本は　いくらですか。|||Quyển sách này giá bao nhiêu?' },
            { text: 'この　本は　だれのですか。|||Quyển sách này của ai?' },
            { text: 'ほんやは　何曜日が　やすみですか。|||Tiệm sách nghỉ thứ mấy?' },
            { text: 'ここで　何を　しますか。|||Nhìn bức tranh: ở đây bạn làm gì?', imageUrl: '/exam-assets/jpd113-speaking/cafe.svg' },
          ],
          rubric: [
            { id: 'q1', weight: 1, criterion: 'Name: マルコさんです。|||Tên: マルコさんです。' },
            { id: 'q2', weight: 1, criterion: 'Country: イタリアです。|||Quốc gia: イタリアです。' },
            { id: 'q3', weight: 1, criterion: 'Job: がくせいです／わせだ大学のがくせいです。|||Nghề: がくせいです／わせだ大学のがくせいです。' },
            { id: 'q4', weight: 1, criterion: 'Age: 25さいです。|||Tuổi: 25さいです。' },
            { id: 'q5', weight: 1, criterion: 'Birthday: 5月15日です — both regular readings.|||Sinh nhật: 5月15日です — cả tháng và ngày đều đọc đều đặn.' },
            { id: 'q6', weight: 1, criterion: 'Hobby: おんがくとりょこうです。|||Sở thích: おんがくとりょこうです。' },
            { id: 'q7', weight: 1, criterion: 'Price: 1,800円です (せんはっぴゃくえん).|||Giá: 1,800円です (せんはっぴゃくえん).' },
            { id: 'q8', weight: 1, criterion: 'Owner: マルコさんのです — this time the object DOES belong to the person shown.|||Chủ sở hữu: マルコさんのです — lần này đồ vật ĐÚNG là của người trên thẻ.' },
            { id: 'q9', weight: 1, criterion: 'Closed days: 土曜日と日曜日です。|||Ngày nghỉ: 土曜日と日曜日です。' },
            { id: 'q10', weight: 1, criterion: 'Picture shows a cafe — コーヒーをのみます (or any correct cafe activity).|||Tranh vẽ quán cà phê — コーヒーをのみます (hoặc hoạt động đúng khác ở quán cà phê).' },
          ],
        },
      ],
    },

    // ═══════════════════ ĐỀ 3 — mới (アンナ + けいたいでんわ) ═══════════════════
    {
      kind: 'PE', peType: 'SPEAK',
      code: 'SPEAK-D3',
      source: 'SAMPLE',
      sortOrder: 202,
      title: 'Speaking — Set 3: Nurse Anna & her phone|||Vấn đáp — Đề 3: Y tá Anna & chiếc điện thoại',
      description: 'Bộ thẻ mới — y tá người Nga và điện thoại di động.',
      durationMinutes: 20,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: speakInstructions(
        'Name: アンナ (Anna) &middot; Nationality: Russian &middot; Age: 27 &middot; Occupation: Nurse &middot; Hobbies: Swimming, Cooking &middot; Date of birth: February 9th.',
        'Tên: アンナ (Anna) &middot; Quốc tịch: Nga &middot; Tuổi: 27 &middot; Nghề nghiệp: Y tá &middot; Sở thích: Bơi lội, Nấu ăn &middot; Sinh nhật: 9 tháng 2.',
        'Object: けいたいでんわ (mobile phone), brand サムスン, Made in Vietnam, Price 250 USD, Owner アンナさん.',
        'Đồ vật: けいたいでんわ (điện thoại di động), thương hiệu サムスン, sản xuất tại Việt Nam, Giá 250 USD, Chủ sở hữu アンナさん.',
        '<b>1. この人の　おなまえは。</b> → アンナさんです。<br>' +
        '<b>2. アンナさんの　おくには　どちらですか。</b> → ロシアです。<br>' +
        '<b>3. アンナさんの　おしごとは　なんですか。</b> → かんごしです。<br>' +
        '<b>4. アンナさんは　なんさいですか。</b> → 27さいです。<br>' +
        '<b>5. アンナさんの　たんじょうびは　いつですか。</b> → 2月9日です。<br>' +
        '<b>6. アンナさんの　しゅみは　なんですか。</b> → すいえいと りょうりです。<br>' +
        '<b>7. この　けいたいは　いくらですか。</b> → 250ドルです。<br>' +
        '<b>8. この　けいたいは　だれのですか。</b> → アンナさんのです。<br>' +
        '<b>9. アンナさんは　どこの　国の　人ですか。</b> → ロシアの 人です。<br>' +
        '<b>10. (picture) ここで　何を　しますか。</b> → しごとを します。',
        '<b>1. この人の　おなまえは。</b> (Tên người này?) → アンナさんです。<br>' +
        '<b>2. アンナさんの　おくには　どちらですか。</b> (Anna đến từ nước nào — dạng lịch sự どちら?) → ロシアです。(Nước Nga.)<br>' +
        '<b>3. アンナさんの　おしごとは　なんですか。</b> (Nghề nghiệp?) → かんごしです。(Y tá.)<br>' +
        '<b>4. アンナさんは　なんさいですか。</b> (Bao nhiêu tuổi?) → 27さいです。<br>' +
        '<b>5. アンナさんの　たんじょうびは　いつですか。</b> (Sinh nhật khi nào?) → 2月9日です。(にがつ ここのか — chú ý ここのか, một trong 10 từ ngày cổ.)<br>' +
        '<b>6. アンナさんの　しゅみは　なんですか。</b> (Sở thích?) → すいえいと りょうりです。(Bơi lội và nấu ăn.)<br>' +
        '<b>7. この　けいたいは　いくらですか。</b> (Điện thoại giá bao nhiêu?) → 250ドルです。(250 đô la — luyện đọc đơn vị tiền NƯỚC NGOÀI ドル, không phải 円 hay ドン.)<br>' +
        '<b>8. この　けいたいは　だれのですか。</b> (Điện thoại của ai?) → アンナさんのです。<br>' +
        '<b>9. アンナさんは　どこの　国の　人ですか。</b> (Anna là người của nước nào — mẫu câu hỏi thay thế cho おくにはどちらですか, đã học ở Chương 4.3) → ロシアの 人です。(Người nước Nga.)<br>' +
        '<b>10. (tranh) ここで　何を　しますか。</b> (Nhìn tranh — ở đây làm gì?) → しごとを します。(Làm việc — tranh vẽ văn phòng công ty.)',
        COMMON_TIPS_VI + ' Câu 9 dùng mẫu "どこの国の人ですか" thay vì "おくにはどちらですか" — cả hai HỎI CÙNG MỘT THÔNG TIN (quốc tịch), chỉ khác cách diễn đạt; đề thi thật hay đổi cách hỏi để test xem học sinh có hiểu bản chất câu hỏi hay chỉ học thuộc mẫu câu.',
      ),
      questions: [
        {
          kind: 'SPEAK', points: 10,
          prompt:
            '<div class="ml-en"><p>You are shown the アンナ (Anna) person card and the けいたいでんわ (mobile phone) object card. Answer the 9 questions in Japanese, one recording per question, in order.</p></div>' +
            '<div class="ml-vi"><p>Bạn được đưa thẻ nhân vật アンナ (Anna) và thẻ đồ vật けいたいでんわ (điện thoại). Trả lời 9 câu hỏi bằng tiếng Nhật, mỗi câu một đoạn ghi âm, theo đúng thứ tự.</p></div>',
          speakingPrompts: [
            { text: 'この人の　おなまえは。|||Tên người này là gì?' },
            { text: 'アンナさんの　おくには　どちらですか。|||Anna đến từ nước nào?' },
            { text: 'アンナさんの　おしごとは　なんですか。|||Nghề nghiệp của Anna là gì?' },
            { text: 'アンナさんは　なんさいですか。|||Anna bao nhiêu tuổi?' },
            { text: 'アンナさんの　たんじょうびは　いつですか。|||Sinh nhật của Anna khi nào?' },
            { text: 'アンナさんの　しゅみは　なんですか。|||Sở thích của Anna là gì?' },
            { text: 'この　けいたいは　いくらですか。|||Chiếc điện thoại này giá bao nhiêu?' },
            { text: 'この　けいたいは　だれのですか。|||Chiếc điện thoại này của ai?' },
            { text: 'アンナさんは　どこの　国の　人ですか。|||Anna là người của nước nào?' },
            { text: 'ここで　何を　しますか。|||Nhìn bức tranh: ở đây bạn làm gì?', imageUrl: '/exam-assets/jpd113-speaking/kaisha.svg' },
          ],
          rubric: [
            { id: 'q1', weight: 1, criterion: 'Name: アンナさんです。|||Tên: アンナさんです。' },
            { id: 'q2', weight: 1, criterion: 'Country: ロシアです。|||Quốc gia: ロシアです。' },
            { id: 'q3', weight: 1, criterion: 'Job: かんごしです。|||Nghề: かんごしです。' },
            { id: 'q4', weight: 1, criterion: 'Age: 27さいです。|||Tuổi: 27さいです。' },
            { id: 'q5', weight: 1, criterion: 'Birthday: 2月9日です (にがつ ここのか).|||Sinh nhật: 2月9日です (にがつ ここのか).' },
            { id: 'q6', weight: 1, criterion: 'Hobby: すいえいとりょうりです。|||Sở thích: すいえいとりょうりです。' },
            { id: 'q7', weight: 1, criterion: 'Price: 250ドルです — currency is USD, not yen/dong.|||Giá: 250ドルです — đơn vị đô la, không phải yên/đồng.' },
            { id: 'q8', weight: 1, criterion: 'Owner: アンナさんのです。|||Chủ sở hữu: アンナさんのです。' },
            { id: 'q9', weight: 1, criterion: 'Nationality (alt. phrasing): ロシアの人です — same meaning as おくにはどちらですか.|||Quốc tịch (cách hỏi khác): ロシアの人です — cùng nghĩa với おくにはどちらですか.' },
            { id: 'q10', weight: 1, criterion: 'Picture shows a company office — しごとをします／はたらきます (or any correct work activity).|||Tranh vẽ văn phòng công ty — しごとをします／はたらきます (hoặc hoạt động đúng khác liên quan công việc).' },
          ],
        },
      ],
    },

    // ═══════════════════ ĐỀ 4 — mới (パク + カメラ) ═══════════════════
    {
      kind: 'PE', peType: 'SPEAK',
      code: 'SPEAK-D4',
      source: 'SAMPLE',
      sortOrder: 203,
      title: 'Speaking — Set 4: Engineer Park & his camera|||Vấn đáp — Đề 4: Kỹ sư Park & chiếc máy ảnh',
      description: 'Bộ thẻ mới — kỹ sư người Hàn Quốc và một chiếc máy ảnh Nhật.',
      durationMinutes: 20,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: speakInstructions(
        'Name: パク (Park) &middot; Nationality: Korean &middot; Age: 34 &middot; Occupation: Engineer &middot; Hobbies: Photography, Reading &middot; Date of birth: November 3rd.',
        'Tên: パク (Park) &middot; Quốc tịch: Hàn Quốc &middot; Tuổi: 34 &middot; Nghề nghiệp: Kỹ sư &middot; Sở thích: Nhiếp ảnh, Đọc sách &middot; Sinh nhật: 3 tháng 11.',
        'Object: カメラ (camera), brand キヤノン, Made in Japan, Price 89,000 yen, Owner パクさん.',
        'Đồ vật: カメラ (máy ảnh), thương hiệu キヤノン, sản xuất tại Nhật Bản, Giá 89.000 yên, Chủ sở hữu パクさん.',
        '<b>1. この人の　おなまえは。</b> → パクさんです。<br>' +
        '<b>2. パクさんは　何人ですか。</b> → かんこくじんです。<br>' +
        '<b>3. パクさんの　おしごとは　なんですか。</b> → エンジニアです。<br>' +
        '<b>4. パクさんは　おいくつですか。</b> → 34さいです。<br>' +
        '<b>5. パクさんの　たんじょうびは　何月何日ですか。</b> → 11月3日です。<br>' +
        '<b>6. パクさんの　しゅみは　なんですか。</b> → しゃしんと どくしょです。<br>' +
        '<b>7. この　カメラは　いくらですか。</b> → 89,000円です。<br>' +
        '<b>8. この　カメラは　だれのですか。</b> → パクさんのです。<br>' +
        '<b>9. この　カメラは　どこの　くにの　カメラですか。</b> → 日本の カメラです。<br>' +
        '<b>10. (picture) ここで　何を　しますか。</b> → やさいを かいます。',
        '<b>1. この人の　おなまえは。</b> (Tên người này?) → パクさんです。<br>' +
        '<b>2. パクさんは　何人ですか。</b> (Là người nước nào — mẫu câu trực tiếp X人ですか) → かんこくじんです。(Người Hàn Quốc.)<br>' +
        '<b>3. パクさんの　おしごとは　なんですか。</b> (Nghề nghiệp?) → エンジニアです。<br>' +
        '<b>4. パクさんは　おいくつですか。</b> (Bao nhiêu tuổi?) → 34さいです。<br>' +
        '<b>5. パクさんの　たんじょうびは　何月何日ですか。</b> (Sinh nhật ngày mấy?) → 11月3日です。(じゅういちがつ みっか — 3日 là một trong 10 từ ngày cổ, đọc みっか.)<br>' +
        '<b>6. パクさんの　しゅみは　なんですか。</b> (Sở thích?) → しゃしんと どくしょです。(Nhiếp ảnh và đọc sách.)<br>' +
        '<b>7. この　カメラは　いくらですか。</b> (Máy ảnh giá bao nhiêu?) → 89,000円です。(はちまんきゅうせんえん.)<br>' +
        '<b>8. この　カメラは　だれのですか。</b> (Máy ảnh của ai?) → パクさんのです。<br>' +
        '<b>9. この　カメラは　どこの　くにの　カメラですか。</b> (Máy ảnh xuất xứ nước nào — hỏi về ĐỒ VẬT chứ không phải người, khác câu 2!) → 日本の カメラです。(Máy ảnh của Nhật Bản — dựa vào "Made in Japan" trên thẻ.)<br>' +
        '<b>10. (tranh) ここで　何を　しますか。</b> (Nhìn tranh — ở đây làm gì?) → やさいを かいます。(Mua rau — tranh vẽ siêu thị.)',
        COMMON_TIPS_VI + ' So sánh câu 2 (何人ですか — hỏi QUỐC TỊCH của NGƯỜI) với câu 9 (どこの くにの カメラですか — hỏi XUẤT XỨ của ĐỒ VẬT, dùng thông tin "Made in") — hai câu hỏi na ná nhưng tra cứu ở HAI VỊ TRÍ khác nhau trên hai thẻ.',
      ),
      questions: [
        {
          kind: 'SPEAK', points: 10,
          prompt:
            '<div class="ml-en"><p>You are shown the パク (Park) person card and the カメラ (camera) object card. Answer the 9 questions in Japanese, one recording per question, in order.</p></div>' +
            '<div class="ml-vi"><p>Bạn được đưa thẻ nhân vật パク (Park) và thẻ đồ vật カメラ (máy ảnh). Trả lời 9 câu hỏi bằng tiếng Nhật, mỗi câu một đoạn ghi âm, theo đúng thứ tự.</p></div>',
          speakingPrompts: [
            { text: 'この人の　おなまえは。|||Tên người này là gì?' },
            { text: 'パクさんは　何人ですか。|||Park là người nước nào?' },
            { text: 'パクさんの　おしごとは　なんですか。|||Nghề nghiệp của Park là gì?' },
            { text: 'パクさんは　おいくつですか。|||Park bao nhiêu tuổi?' },
            { text: 'パクさんの　たんじょうびは　何月何日ですか。|||Sinh nhật của Park ngày mấy?' },
            { text: 'パクさんの　しゅみは　なんですか。|||Sở thích của Park là gì?' },
            { text: 'この　カメラは　いくらですか。|||Chiếc máy ảnh này giá bao nhiêu?' },
            { text: 'この　カメラは　だれのですか。|||Chiếc máy ảnh này của ai?' },
            { text: 'この　カメラは　どこの　くにの　カメラですか。|||Chiếc máy ảnh này xuất xứ nước nào?' },
            { text: 'ここで　何を　しますか。|||Nhìn bức tranh: ở đây bạn làm gì?', imageUrl: '/exam-assets/jpd113-speaking/super.svg' },
          ],
          rubric: [
            { id: 'q1', weight: 1, criterion: 'Name: パクさんです。|||Tên: パクさんです。' },
            { id: 'q2', weight: 1, criterion: 'Nationality: かんこくじんです。|||Quốc tịch: かんこくじんです。' },
            { id: 'q3', weight: 1, criterion: 'Job: エンジニアです。|||Nghề: エンジニアです。' },
            { id: 'q4', weight: 1, criterion: 'Age: 34さいです。|||Tuổi: 34さいです。' },
            { id: 'q5', weight: 1, criterion: 'Birthday: 11月3日です (じゅういちがつ みっか).|||Sinh nhật: 11月3日です (じゅういちがつ みっか).' },
            { id: 'q6', weight: 1, criterion: 'Hobby: しゃしんとどくしょです。|||Sở thích: しゃしんとどくしょです。' },
            { id: 'q7', weight: 1, criterion: 'Price: 89,000円です (はちまんきゅうせんえん).|||Giá: 89,000円です (はちまんきゅうせんえん).' },
            { id: 'q8', weight: 1, criterion: 'Owner: パクさんのです。|||Chủ sở hữu: パクさんのです。' },
            { id: 'q9', weight: 1, criterion: 'Origin of the OBJECT (Made in Japan), not the person\'s nationality: 日本のカメラです。|||Xuất xứ của ĐỒ VẬT (Made in Japan), khác quốc tịch người: 日本のカメラです。' },
            { id: 'q10', weight: 1, criterion: 'Picture shows a supermarket — やさいをかいます／かいものをします (or any correct shopping activity).|||Tranh vẽ siêu thị — やさいをかいます／かいものをします (hoặc hoạt động mua sắm đúng khác).' },
          ],
        },
      ],
    },

    // ═══════════════════ ĐỀ 5 — mới (エレナ + かばん) ═══════════════════
    {
      kind: 'PE', peType: 'SPEAK',
      code: 'SPEAK-D5',
      source: 'SAMPLE',
      sortOrder: 204,
      title: 'Speaking — Set 5: Student Elena & her bag|||Vấn đáp — Đề 5: Sinh viên Elena & chiếc cặp',
      description: 'Bộ thẻ mới — sinh viên người Pháp và một chiếc cặp hàng hiệu.',
      durationMinutes: 20,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: speakInstructions(
        'Name: エレナ (Elena) &middot; Nationality: French &middot; Age: 22 &middot; Occupation: Student at Chuo University &middot; Hobbies: Cooking, Movies &middot; Date of birth: August 30th.',
        'Tên: エレナ (Elena) &middot; Quốc tịch: Pháp &middot; Tuổi: 22 &middot; Nghề nghiệp: Sinh viên đại học Chuo &middot; Sở thích: Nấu ăn, Xem phim &middot; Sinh nhật: 30 tháng 8.',
        'Object: かばん (bag), brand グッチ, Made in Italy, Price 4,500,000 VND, Owner エレナさん.',
        'Đồ vật: かばん (cặp/túi xách), thương hiệu グッチ, sản xuất tại Ý, Giá 4.500.000 VNĐ, Chủ sở hữu エレナさん.',
        '<b>1. この人の　おなまえは。</b> → エレナさんです。<br>' +
        '<b>2. エレナさんの　おくには　どちらですか。</b> → フランスです。<br>' +
        '<b>3. エレナさんの　おしごとは　なんですか。</b> → がくせいです。ちゅうおう大学の がくせいです。<br>' +
        '<b>4. エレナさんは　なんさいですか。</b> → 22さいです。<br>' +
        '<b>5. エレナさんの　たんじょうびは　いつですか。</b> → 8月30日です。<br>' +
        '<b>6. エレナさんの　しゅみは　なんですか。</b> → りょうりと えいがです。<br>' +
        '<b>7. この　かばんは　いくらですか。</b> → 4,500,000ドンです。<br>' +
        '<b>8. この　かばんは　だれのですか。</b> → エレナさんのです。<br>' +
        '<b>9. この　かばんは　どこの　くにの　かばんですか。</b> → イタリアの かばんです。<br>' +
        '<b>10. (picture) ここで　何を　しますか。</b> → ほんを よみます。',
        '<b>1. この人の　おなまえは。</b> (Tên người này?) → エレナさんです。<br>' +
        '<b>2. エレナさんの　おくには　どちらですか。</b> (Đến từ nước nào?) → フランスです。(Nước Pháp.)<br>' +
        '<b>3. エレナさんの　おしごとは　なんですか。</b> (Nghề nghiệp?) → がくせいです。ちゅうおう大学の がくせいです。(Là sinh viên. Sinh viên đại học Chuo.)<br>' +
        '<b>4. エレナさんは　なんさいですか。</b> (Bao nhiêu tuổi?) → 22さいです。<br>' +
        '<b>5. エレナさんの　たんじょうびは　いつですか。</b> (Sinh nhật khi nào?) → 8月30日です。(はちがつ さんじゅうにち — cả tháng và ngày đều đọc đều đặn.)<br>' +
        '<b>6. エレナさんの　しゅみは　なんですか。</b> (Sở thích?) → りょうりと えいがです。(Nấu ăn và xem phim.)<br>' +
        '<b>7. この　かばんは　いくらですか。</b> (Cặp giá bao nhiêu?) → 4,500,000ドンです。(4.500.000 đồng.)<br>' +
        '<b>8. この　かばんは　だれのですか。</b> (Cặp của ai?) → エレナさんのです。<br>' +
        '<b>9. この　かばんは　どこの　くにの　かばんですか。</b> (Cặp xuất xứ nước nào?) → イタリアの かばんです。(Cặp của Ý — chú ý: xuất xứ ĐỒ VẬT là Ý, khác quốc tịch NGƯỜI là Pháp — không cùng một nước!)<br>' +
        '<b>10. (tranh) ここで　何を　しますか。</b> (Nhìn tranh — ở đây làm gì?) → ほんを よみます。(Đọc sách — tranh vẽ thư viện.)',
        COMMON_TIPS_VI + ' Đề này lặp lại đúng bẫy của Đề 4 (xuất xứ đồ vật khác quốc tịch người) nhưng đổi ngữ cảnh — nếu đã làm quen Đề 4, câu 9 ở đây sẽ dễ hơn nhiều. Đây chính là lợi ích của việc luyện đủ 5 đề: các bẫy LẶP LẠI theo mẫu, không phải mỗi lần một kiểu mới.',
      ),
      questions: [
        {
          kind: 'SPEAK', points: 10,
          prompt:
            '<div class="ml-en"><p>You are shown the エレナ (Elena) person card and the かばん (bag) object card. Answer the 9 questions in Japanese, one recording per question, in order.</p></div>' +
            '<div class="ml-vi"><p>Bạn được đưa thẻ nhân vật エレナ (Elena) và thẻ đồ vật かばん (cặp). Trả lời 9 câu hỏi bằng tiếng Nhật, mỗi câu một đoạn ghi âm, theo đúng thứ tự.</p></div>',
          speakingPrompts: [
            { text: 'この人の　おなまえは。|||Tên người này là gì?' },
            { text: 'エレナさんの　おくには　どちらですか。|||Elena đến từ nước nào?' },
            { text: 'エレナさんの　おしごとは　なんですか。|||Nghề nghiệp của Elena là gì?' },
            { text: 'エレナさんは　なんさいですか。|||Elena bao nhiêu tuổi?' },
            { text: 'エレナさんの　たんじょうびは　いつですか。|||Sinh nhật của Elena khi nào?' },
            { text: 'エレナさんの　しゅみは　なんですか。|||Sở thích của Elena là gì?' },
            { text: 'この　かばんは　いくらですか。|||Chiếc cặp này giá bao nhiêu?' },
            { text: 'この　かばんは　だれのですか。|||Chiếc cặp này của ai?' },
            { text: 'この　かばんは　どこの　くにの　かばんですか。|||Chiếc cặp này xuất xứ nước nào?' },
            { text: 'ここで　何を　しますか。|||Nhìn bức tranh: ở đây bạn làm gì?', imageUrl: '/exam-assets/jpd113-speaking/toshokan.svg' },
          ],
          rubric: [
            { id: 'q1', weight: 1, criterion: 'Name: エレナさんです。|||Tên: エレナさんです。' },
            { id: 'q2', weight: 1, criterion: 'Country: フランスです。|||Quốc gia: フランスです。' },
            { id: 'q3', weight: 1, criterion: 'Job: がくせいです／ちゅうおう大学のがくせいです。|||Nghề: がくせいです／ちゅうおう大学のがくせいです。' },
            { id: 'q4', weight: 1, criterion: 'Age: 22さいです。|||Tuổi: 22さいです。' },
            { id: 'q5', weight: 1, criterion: 'Birthday: 8月30日です — both regular readings.|||Sinh nhật: 8月30日です — cả tháng và ngày đều đọc đều đặn.' },
            { id: 'q6', weight: 1, criterion: 'Hobby: りょうりとえいがです。|||Sở thích: りょうりとえいがです。' },
            { id: 'q7', weight: 1, criterion: 'Price: 4,500,000ドンです。|||Giá: 4,500,000ドンです。' },
            { id: 'q8', weight: 1, criterion: 'Owner: エレナさんのです。|||Chủ sở hữu: エレナさんのです。' },
            { id: 'q9', weight: 1, criterion: 'Origin of the OBJECT (Made in Italy) — different from Elena\'s own nationality (French): イタリアのかばんです。|||Xuất xứ ĐỒ VẬT (Made in Italy) — khác quốc tịch Elena (Pháp): イタリアのかばんです。' },
            { id: 'q10', weight: 1, criterion: 'Picture shows a library — ほんをよみます (or any correct library activity).|||Tranh vẽ thư viện — ほんをよみます (hoặc hoạt động đúng khác ở thư viện).' },
          ],
        },
      ],
    },
  ],
};
