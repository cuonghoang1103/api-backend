/**
 * Đề Speaking THỬ (chỉ để chạy phòng thi khi `noi-00.ts` chưa soạn xong) — khuôn mục 4.3: Part 1 Work/Study +
 * Hometown (6 câu) · Part 2 Describe a person you admire · Part 3 4 câu khó dần (fact → opinion → compare →
 * hypothesise). Tự soạn, không chép đề thật. Mở: /language/en/ielts/thi-may/noi?de=noi-demo
 */
import type { DeNoi } from './types';

export const NOI_DEMO: DeNoi = {
  id: 'noi-demo',
  kyNang: 'noi',
  ten: 'Speaking — Đề thử (Work · Hometown · A person you admire)',
  boDe: 'Đề thử',
  capDo: '4.0–8.0 (bậc thang)',
  moTa: 'Giám khảo AI hỏi đúng 3 Part như thi thật: 6 câu Part 1, thẻ đề Part 2 với 1 phút chuẩn bị, 4 câu Part 3 khó dần.',
  phut: 12,
  part1: [
    {
      chuDe: 'work or studies',
      cau: [
        'Do you work or are you a student?',
        'Why did you choose that subject, or that job?',
        'What is the most difficult part of your work or studies?',
      ],
    },
    {
      chuDe: 'your hometown',
      cau: [
        'Where is your hometown?',
        'What do you like most about your hometown?',
        'Has your hometown changed much since you were a child?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a person you admire.',
    goiY: ['who this person is', 'how you know this person', 'what this person has done', 'and explain why you admire this person.'],
    cauChot: ['Do you think other people admire this person too?'],
  },
  part3: [
    {
      chuDe: 'role models',
      cau: [
        'What kinds of people do young people in your country admire these days?',
        'Do you think famous people make good role models? Why or why not?',
      ],
    },
    {
      chuDe: 'admiration and success',
      cau: [
        'How is the way people are admired today different from the past?',
        'If there were no famous people at all, how do you think children would choose their role models?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'What do you like most about your hometown?',
      band: '7.0',
      s: 'What I appreciate most is probably the pace of life. It\'s a small coastal town, so things move a bit more slowly than in Hanoi, and people actually have time to stop and chat. I also love the seafood market near the harbour — it\'s been there since my grandmother was young, and I still go there with my mum whenever I visit.',
      phanTich: [
        'FC: trả lời thẳng, nối ý tự nhiên ("so", "I also") — không lặp, không filler.',
        'LR: "pace of life", "coastal town", "harbour" — từ chính xác, có collocation.',
        'GRA: hiện tại + hiện tại hoàn thành ("it\'s been there since…") đúng chỗ.',
        'P: ngắt theo cụm nghĩa, nhấn "appreciate", "slowly".',
      ],
    },
    {
      part: 2,
      cau: 'Describe a person you admire.',
      band: '7.0',
      s: 'The person I\'d like to talk about is my former maths teacher, Mr Tuan. I first met him when I was fifteen, in my second year of secondary school, and he taught me for three years. What made him stand out wasn\'t just his knowledge — plenty of teachers know their subject — it was his patience. If a student didn\'t understand something, he would find a second and even a third way to explain it, and he never made anyone feel stupid for asking. He also set up a free weekend class for students from poorer families, which he ran for over ten years without any payment. I admire him because he genuinely changed the direction of my life: I was about to give up on maths, and thanks to him I ended up studying engineering. Whenever I face something difficult now, I try to remember how calmly he dealt with problems.',
      phanTich: [
        'Cấu trúc 4 phần đúng thẻ đề: ai → biết thế nào → đã làm gì → vì sao ngưỡng mộ.',
        'LR: "stand out", "genuinely", "changed the direction of my life", "dealt with" — idiom dùng khéo.',
        'GRA: câu phức nhiều tầng ("If…, he would…", "which he ran…") không lỗi; quá khứ kể chuyện nhất quán.',
        'FC: ~160 từ cho 1′40″ — nói đủ 2 phút ở tốc độ tự nhiên, không cần nhắc.',
      ],
    },
    {
      part: 3,
      cau: 'Do you think famous people make good role models? Why or why not?',
      band: '7.5',
      s: 'It really depends on what they\'re famous for. Some celebrities set a genuinely positive example — athletes who talk openly about discipline and failure, for instance. But I\'d argue that fame itself is a poor reason to admire anyone, because what we see is a carefully managed image rather than the real person. So I\'d say they can be good role models, but only if we admire the behaviour rather than the fame.',
      phanTich: [
        'Part 3: trả lời có mức độ ("It depends…"), đưa ví dụ, nhượng bộ rồi chốt quan điểm.',
        'LR: "set a positive example", "carefully managed image", "I\'d argue that" — ngôn ngữ học thuật nói.',
        'GRA: mệnh đề nhượng bộ + điều kiện "only if" linh hoạt, không lỗi.',
      ],
    },
  ],
};
