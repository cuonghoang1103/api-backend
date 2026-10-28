//@from F6
// src/utils/learning.js — hàm THUẦN cho trang học
//#F7
//   + chấm bài quiz
//#end

// Link YouTube "xem" (watch?v= / youtu.be/) KHÔNG nhúng được trong <iframe> (YouTube từ chối) ⇒ đổi sang /embed/<id>.
// Không nhận ra ⇒ '' (trang hiện "No video").
export function toEmbedUrl(url = '') {
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : '';
}

// % hoàn thành, làm tròn số nguyên. Khoá chưa có bài ⇒ 0 (không chia cho 0 ra NaN)
export function calcProgress(doneCount, total) {
  return total > 0 ? Math.round((doneCount / total) * 100) : 0;
}

// Bài để "học tiếp": bài ĐẦU TIÊN chưa xong theo thứ tự; xong hết ⇒ bài đầu
export function resumeLesson(lessons, completedLessons) {
  return lessons.find((l) => !completedLessons.includes(l.id)) ?? lessons[0];
}
//#F7

export const PASS_PERCENT = 70;

// answers: { [questionId]: chỉ số phương án đã chọn }
export function scoreQuiz(questions, answers) {
  const total = questions.length;
  const score = questions.filter((q) => answers[q.id] === q.answerIndex).length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  return { score, total, percent, passed: percent >= PASS_PERCENT };
}
//#end
