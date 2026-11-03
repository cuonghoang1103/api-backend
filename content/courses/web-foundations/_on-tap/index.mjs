/** Tờ ôn cho 14 bài kiểm tra chương — onTapBai(slug) ⇒ HTML nối vào cuối content bài quiz. */
import { onTap } from './_lam.mjs';
import wf_1_6_quiz from './wf-1-6-quiz.mjs';
import wf_10_6_quiz from './wf-10-6-quiz.mjs';
import wf_11_6_quiz from './wf-11-6-quiz.mjs';
import wf_12_5_quiz from './wf-12-5-quiz.mjs';
import wf_13_5_quiz from './wf-13-5-quiz.mjs';
import wf_14_5_quiz from './wf-14-5-quiz.mjs';
import wf_2_6_quiz from './wf-2-6-quiz.mjs';
import wf_3_6_quiz from './wf-3-6-quiz.mjs';
import wf_4_6_quiz from './wf-4-6-quiz.mjs';
import wf_5_6_quiz from './wf-5-6-quiz.mjs';
import wf_6_6_quiz from './wf-6-6-quiz.mjs';
import wf_7_6_quiz from './wf-7-6-quiz.mjs';
import wf_8_6_quiz from './wf-8-6-quiz.mjs';
import wf_9_6_quiz from './wf-9-6-quiz.mjs';
const DU = {
  'wf-1-6-quiz': wf_1_6_quiz,
  'wf-10-6-quiz': wf_10_6_quiz,
  'wf-11-6-quiz': wf_11_6_quiz,
  'wf-12-5-quiz': wf_12_5_quiz,
  'wf-13-5-quiz': wf_13_5_quiz,
  'wf-14-5-quiz': wf_14_5_quiz,
  'wf-2-6-quiz': wf_2_6_quiz,
  'wf-3-6-quiz': wf_3_6_quiz,
  'wf-4-6-quiz': wf_4_6_quiz,
  'wf-5-6-quiz': wf_5_6_quiz,
  'wf-6-6-quiz': wf_6_6_quiz,
  'wf-7-6-quiz': wf_7_6_quiz,
  'wf-8-6-quiz': wf_8_6_quiz,
  'wf-9-6-quiz': wf_9_6_quiz,
};
export const onTapBai = (slug) => { if (!DU[slug]) throw new Error('thiếu tờ ôn ' + slug); return onTap(DU[slug]); };
