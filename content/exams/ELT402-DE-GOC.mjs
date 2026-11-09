// SINH TỰ ĐỘNG bởi scripts/fx-de-thi-build.mjs — đề thi thật dạng ảnh trang đề gốc. Chạy lại script, đừng sửa tay.
export default {
 "course": {
  "courseCode": "ELT402"
 },
 "exams": [
  {
   "kind": "PE",
   "peType": "WRITE",
   "code": "SU26-FE-RE",
   "title": "ELT402 — SU26 · FE · RE (original paper)|||ELT402 — SU26 · FE · Thi lại (đề gốc)",
   "description": "Real FE paper SU26 · FE · RE: 1 page image(s) of the original paper.|||Đề Thi cuối kỳ thật SU26 · FE · Thi lại: 1 ảnh trang đề gốc.",
   "durationMinutes": 60,
   "totalPoints": 10,
   "passMark": 5,
   "source": "REAL",
   "shuffleQuestions": false,
   "shuffleOptions": false,
   "isPublished": true,
   "instructions": "<div class=\"ml-en\"><p>This is a real FPTU <b>SU26 · FE · RE</b> paper for <b>ELT402</b>, shown as the original page images (one page per question).</p><ul><li>Multiple-choice page: write the letter(s) you choose and one line of reasoning.</li><li>Practical / essay page: write your answer or solution; you may attach a photo of your work.</li><li>AI grading compares your answer with the page image; treat the score as practice feedback, not an official mark.</li></ul></div><div class=\"ml-vi\"><p>Đây là đề <b>SU26 · FE · Thi lại</b> thật của FPTU môn <b>ELT402</b>, hiển thị nguyên ảnh trang đề gốc (mỗi trang là một câu).</p><ul><li>Trang trắc nghiệm: ghi chữ cái đáp án bạn chọn và một dòng lý do.</li><li>Trang thực hành / tự luận: viết bài làm hoặc lời giải; có thể đính kèm ảnh bài làm.</li><li>AI chấm bằng cách so bài làm với ảnh đề — điểm chỉ để luyện tập, không phải điểm chính thức.</li></ul></div>",
   "questions": [
    {
     "kind": "WRITE",
     "points": 10,
     "imageUrl": "https://media.cuongthai.com/images/exam-questions/ELT402/SU26-FE-RE/001_elt402-su26-fe-re.webp",
     "prompt": "<div class=\"ml-en\"><p><b>Page 1/1</b> of the original paper — read the image and write your answer.</p></div><div class=\"ml-vi\"><p><b>Trang 1/1</b> của đề gốc — đọc ảnh rồi viết bài làm.</p></div>",
     "rubric": [
      {
       "id": "dung",
       "maxScore": 10,
       "weight": 1,
       "criterion": "Answer is correct for the question(s) shown in the page image; for multiple choice the chosen letter(s) must match the correct option.|||Bài làm đúng với câu hỏi trong ảnh trang đề; với trắc nghiệm, chữ cái chọn phải khớp đáp án đúng."
      }
     ]
    }
   ]
  }
 ]
};
