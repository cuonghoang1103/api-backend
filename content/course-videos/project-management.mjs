/**
 * Curated YouTube track for PMG201c — Project Management.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/project-management.mjs
 */
export default {
  courseSlug: 'project-management',
  defaultVideoTrack: 'YT',
  lessons: {
    // 0.1 About — general "what is project management" intro fits the opener.
    "pmg201c-gioi-thieu": { yt: "bw-NvGvLHtM", credit: "Max Mao — What is Project Management? | Explained in 10 Minutes" },
    // 0.2–0.6 & 5.1 are admin/exam-format lessons — no lecture video.

    "pmg201c-1-1-what-is-project": { yt: "POuGKD3xLqs", credit: "ProjectManager — The Project Management Life Cycle - Project Management Training" },
    "pmg201c-1-2-stakeholders-charter": { yt: "I4JsU42IO6g", credit: "ProjectManager — How to Write a Project Management Charter: Project Management Training" },
    "pmg201c-2-1-wbs-estimating": { yt: "akO2Lf1fHmM", credit: "Online PM Courses - Mike Clayton — What is a Work Breakdown Structure - WBS? PM in Under 5" },
    "pmg201c-2-2-critical-path": { yt: "rxGcV0tuxRU", credit: "Online PM Courses - Mike Clayton — What is the Critical Path Method (CPM)?" },
    "pmg201c-3-1-risk": { yt: "voR0FBnC2ZU", credit: "ProjectManager — What is a Risk Register & When To Use It - Project Management Training" },
    "pmg201c-3-2-comms-change": { yt: "pTtqmy6gD_M", credit: "Online PM Courses - Mike Clayton — How to Manage the Change Control Process" },
    "pmg201c-4-1-integrate-plan": { yt: "qb80N-HfKbk", credit: "David McLachlan — How to Make a Project Management Plan (Complete)" },
    "pmg201c-capstone-checklist": { yt: "Lt9_4vzPdlo", credit: "Adriana Girdler — How to Write a Project Plan [PROJECT PLANNING STEPS THAT WORK]" },
    "pmg201c-6-1-agile": { yt: "7vBPfGIg2EY", credit: "KodeKloud — Agile vs Waterfall: Which Methodology is Right for Your Project?" },
    "pmg201c-6-2-ai-pm": { yt: "NodcUIt5Qnw", credit: "Grow with Google — Intro to Using AI in Project Management | Google Project Management Certificate" },
  },
};
