/**
 * Curated YouTube track for ITE302c — IT and Data Ethics.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/it-and-data-ethics.mjs
 *
 * Pure-admin lessons (0.2 grading, 0.3 CLOs, 0.4 materials, PT.1 review) and the
 * soft-skill 4.1 stakeholder/crisis lesson are intentionally absent — no English
 * lecture matched them closely enough to include.
 */
export default {
  courseSlug: 'it-and-data-ethics',
  defaultVideoTrack: 'YT',
  lessons: {
    "ite302c-gioi-thieu": { yt: "UISZx6K9enQ", credit: "Markkula Center for Applied Ethics — What is Technology Ethics?" },
    "ite302c-1-1-bon-khung": { yt: "FRd8MmmkXs0", credit: "Christopher Kalodikis — Different Ethical Theories & Approaches" },
    "ite302c-1-2-ap-dung": { yt: "n0uwTBrgqxI", credit: "The Ethics Centre — Ethical Decision Making" },
    "ite302c-2-1-thien-kien-nhan-thuc": { yt: "d2r7Bk1NlgU", credit: "CrashCourse — Introduction to Cognitive Bias: Crash Course Scientific Thinking #1" },
    "ite302c-2-2-thien-kien-thuat-toan": { yt: "gV0_raKR2UQ", credit: "CrashCourse — Algorithmic Bias and Fairness: Crash Course AI #18" },
    "ite302c-3-1-riengtu-congbang": { yt: "pcSlowAhvUk", credit: "TED — Glenn Greenwald: Why privacy matters" },
    "ite302c-3-2-minhbach-giaithich": { yt: "22_ySOQ9uKs", credit: "Simply Explained — What is Explainable AI (XAI)? | Black Box AI, Transparency & Ethics Explained" },
    "ite302c-5-1-code-of-ethics": { yt: "OgZq59CVjTA", credit: "The Programming Professor — Software Engineering Ethics Explained - IEEE CS:ACM Code of Ethics" },
    "ite302c-5-2-quy-dinh-quan-tri-ai": { yt: "1mo3yRvvH_g", credit: "TÜV SÜD — AI Governance Explained: EU AI Act, ISO/IEC 42001, and What Businesses Need to Know" },
    "ite302c-6-1-ai-hien-dai": { yt: "WSStTnoSb_c", credit: "DW News — Deepfakes flooding your feed: Why AI videos are dangerous — and how to spot them | DW News" },
    "ite302c-7-1-case-studies": { yt: "VDR8qGmyEQg", credit: "The Verge — Facebook's Cambridge Analytica data scandal, explained" },
  },
};
