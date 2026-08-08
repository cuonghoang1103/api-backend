// studio-i18n.ts — bilingual strings for the Content Studio (/creator).
//
// Why a module-local dictionary instead of messages/{vi,en}.json
// ──────────────────────────────────────────────────────────────
// The site-wide JSON files are loaded on EVERY page of the site.
// The studio is an admin-only area with several hundred strings
// that no public visitor will ever render — folding them into the
// shared bundle would tax every page load for the benefit of one
// user. Keeping them here means they are code-split with the
// /creator route, exactly like `interview-i18n.ts` does for the
// interview room.
//
// The studio still follows the SITE locale (the same cookie the
// global switcher writes), so flipping the language anywhere flips
// it here too — there is no separate studio-only language state to
// get out of sync.
//
// Pluralisation
// ─────────────
// English entries may carry a `singular|plural` pipe. When a `{n}`
// variable is supplied, `t()` picks the side matching n === 1.
// Vietnamese has no plural inflection, so VI entries never need
// the pipe and are used as written.

import { useCallback } from 'react';
import { useTranslation } from '@/context/LocaleContext';

export type StudioLang = 'vi' | 'en';

/** A bilingual pair. Exported because studio-meta.ts holds its
 *  labels in the same shape. */
export interface StudioText {
  vi: string;
  en: string;
}

/** Resolve a bilingual pair for the active language. */
export function pick(text: StudioText, lang: StudioLang): string {
  return text[lang];
}

const S = {
  // ─── Common / actions ───────────────────────────────────────
  save: { vi: 'Lưu', en: 'Save' },
  saving: { vi: 'Đang lưu…', en: 'Saving…' },
  saved: { vi: 'Đã lưu', en: 'Saved' },
  cancel: { vi: 'Huỷ', en: 'Cancel' },
  close: { vi: 'Đóng', en: 'Close' },
  delete: { vi: 'Xoá', en: 'Delete' },
  edit: { vi: 'Sửa', en: 'Edit' },
  add: { vi: 'Thêm', en: 'Add' },
  copy: { vi: 'Chép', en: 'Copy' },
  copied: { vi: 'Đã chép', en: 'Copied' },
  restore: { vi: 'Khôi phục', en: 'Restore' },
  preview: { vi: 'Xem trước', en: 'Preview' },
  search: { vi: 'Tìm kiếm', en: 'Search' },
  all: { vi: 'Tất cả', en: 'All' },
  loading: { vi: 'Đang tải…', en: 'Loading…' },
  today: { vi: 'Hôm nay', en: 'Today' },
  tomorrow: { vi: 'Mai', en: 'Tmrw' },
  viewAll: { vi: 'Xem tất cả', en: 'View all' },
  justNow: { vi: 'vừa xong', en: 'just now' },
  minsAgo: { vi: '{n} phút trước', en: '{n}m ago' },
  hoursAgo: { vi: '{n} giờ trước', en: '{n}h ago' },
  daysAgo: { vi: '{n} ngày trước', en: '{n}d ago' },
  words: { vi: '{n} từ', en: '{n} word|{n} words' },
  lines: { vi: '{n} dòng', en: '{n} line|{n} lines' },
  chars: { vi: '{n} ký tự', en: '{n} char|{n} chars' },
  confirmDeleteProject: {
    vi: 'Xoá “{title}”? Không thể hoàn tác.',
    en: 'Delete "{title}"? This cannot be undone.',
  },

  // ─── Shell / topbar / nav ───────────────────────────────────
  studioName: { vi: 'Xưởng nội dung', en: 'Content Studio' },
  checkingAccess: { vi: 'Đang kiểm tra quyền…', en: 'Checking access…' },
  navDashboard: { vi: 'Tổng quan', en: 'Dashboard' },
  navIdeas: { vi: 'Kho ý tưởng', en: 'Idea Bank' },
  navPipeline: { vi: 'Dây chuyền', en: 'Pipeline' },
  navCalendar: { vi: 'Lịch', en: 'Calendar' },
  navList: { vi: 'Danh sách', en: 'List' },
  newProject: { vi: 'Dự án mới', en: 'New project' },
  backToAdmin: { vi: 'Quản trị', en: 'Admin' },
  switchToVi: { vi: 'Đang dùng tiếng Việt', en: 'Switch to Vietnamese' },
  switchToEn: { vi: 'Chuyển sang tiếng Anh', en: 'Using English' },
  languageLabel: { vi: 'Ngôn ngữ giao diện', en: 'Interface language' },

  // ─── Dashboard ──────────────────────────────────────────────
  dashTitle: { vi: 'Bảng điều khiển', en: 'Studio Dashboard' },
  dashTitleAccent: { vi: 'Xưởng', en: 'Dashboard' },
  dashSubtitle: {
    vi: 'Lên ý tưởng, viết kịch bản, quay, xuất bản. Một nơi duy nhất cho mọi video bạn đăng lên TikTok, YouTube, Facebook và Instagram.',
    en: 'Plan, script, film, ship. One workspace for every video you publish across TikTok, YouTube, Facebook and Instagram.',
  },
  projectsCount: { vi: '{n} dự án', en: '{n} project|{n} projects' },
  openPipeline: { vi: 'Mở dây chuyền', en: 'Open pipeline' },
  statIdeas: { vi: 'Ý tưởng', en: 'Ideas' },
  statInProgress: { vi: 'Đang làm', en: 'In progress' },
  statLive: { vi: 'Đã lên lịch + Đã đăng', en: 'Scheduled + Live' },
  statTotal: { vi: 'Tổng cộng', en: 'Total' },
  statInProgressSub: {
    vi: '{a} kịch bản · {b} quay · {c} dựng',
    en: '{a} script · {b} film · {c} cut',
  },
  statLiveSub: { vi: '{a} chờ đăng · {b} đã đăng', en: '{a} queued · {b} out' },
  emptyNoProjects: { vi: 'Chưa có dự án nào', en: 'No projects yet' },
  emptyNoProjectsHint: {
    vi: 'Ghi lại tia sáng đầu tiên. Xưởng sẽ biến nó thành một dự án có ngày quay, phân cảnh, kịch bản và kế hoạch đăng.',
    en: 'Capture your first spark. The Studio turns it into a project with days, scenes, scripts and a publish plan.',
  },
  createFirstProject: { vi: 'Tạo dự án đầu tiên', en: 'Create your first project' },
  next14Days: { vi: '14 ngày tới', en: 'Next 14 days' },
  nScheduled: { vi: '{n} dự án đã lên lịch', en: '{n} project scheduled|{n} projects scheduled' },
  nothingScheduled: { vi: 'Chưa lên lịch gì', en: 'Nothing scheduled' },
  dropFilmDateHint: {
    vi: 'Đặt ngày quay cho một dự án để nó hiện ở đây.',
    en: 'Drop a film date on a project card to see it here.',
  },
  recentlyUpdated: { vi: 'Vừa cập nhật', en: 'Recently updated' },
  nOfTotal: { vi: '{n} trên {total}', en: '{n} of {total}' },
  scriptingQueue: { vi: 'Hàng đợi viết kịch bản', en: 'Scripting queue' },
  scriptingQueueSub: {
    vi: '{n} dự án đang chờ kịch bản',
    en: '{n} project waiting for a script|{n} projects waiting for a script',
  },
  filmOn: { vi: 'Quay {date}', en: 'Film {date}' },
  noFilmDate: { vi: 'Chưa có ngày quay', en: 'No film date' },

  // ─── Create project modal ───────────────────────────────────
  createTitle: { vi: 'Tạo dự án mới', en: 'Create a new project' },
  createSubtitle: {
    vi: 'Đặt tên, chọn loại nội dung. Mọi thứ khác chỉnh sau trong trình soạn.',
    en: 'Name it and pick a type. Everything else is editable later in the editor.',
  },
  fieldTitle: { vi: 'Tiêu đề', en: 'Title' },
  fieldTitlePlaceholder: {
    vi: 'VD: PRO192 — Chương 3: Kế thừa trong Java',
    en: 'e.g. PRO192 — Chapter 3: Inheritance in Java',
  },
  fieldType: { vi: 'Loại nội dung', en: 'Content type' },
  fieldStatus: { vi: 'Trạng thái', en: 'Status' },
  fieldConceptPlaceholder: {
    vi: 'Một hai câu mô tả video này nói về gì…',
    en: 'One or two sentences describing what this video is about…',
  },
  fieldHook: { vi: 'Câu mở đầu (hook)', en: 'Main hook' },
  fieldHookPlaceholder: {
    vi: 'Câu đầu tiên giữ chân người xem trong 3 giây…',
    en: 'The first line that keeps a viewer past 3 seconds…',
  },
  fieldFilmDate: { vi: 'Ngày quay', en: 'Film date' },
  fieldPublishDate: { vi: 'Ngày đăng', en: 'Publish date' },
  fieldTags: { vi: 'Thẻ', en: 'Tags' },
  createCta: { vi: 'Tạo dự án', en: 'Create project' },
  titleRequired: { vi: 'Cần nhập tiêu đề.', en: 'A title is required.' },

  // ─── Academy binding ────────────────────────────────────────
  academySection: { vi: 'Gắn với Academy', en: 'Academy binding' },
  academyHint: {
    vi: 'Video này dạy nội dung gì? Gắn vào môn học / đề thi để dây chuyền và lịch nhóm đúng loạt bài.',
    en: 'What does this video teach? Bind it to a course or exam so the pipeline and calendar group the right series.',
  },
  fieldCourse: { vi: 'Môn học', en: 'Course' },
  fieldCoursePlaceholder: { vi: 'Chưa gắn môn nào', en: 'Not bound to a course' },
  fieldExam: { vi: 'Đề thi', en: 'Exam' },
  fieldExamPlaceholder: { vi: 'Chưa gắn đề nào', en: 'Not bound to an exam' },
  fieldLessonRef: { vi: 'Chương / bài', en: 'Chapter / lesson' },
  fieldLessonRefPlaceholder: { vi: 'VD: Chương 3 · Bài 2, Lab 4, Slot 7', en: 'e.g. Chapter 3 · Lesson 2, Lab 4, Slot 7' },
  fieldSeries: { vi: 'Tên loạt bài', en: 'Series name' },
  fieldSeriesPlaceholder: { vi: 'VD: PRO192 · Kỳ 1', en: 'e.g. PRO192 · Semester 1' },
  fieldEpisode: { vi: 'Tập số', en: 'Episode #' },
  fieldTargetDuration: { vi: 'Thời lượng dự kiến', en: 'Target duration' },
  fieldTargetDurationHint: {
    vi: 'Dùng để tính ngân sách chữ cho kịch bản (~150 từ/phút khi nói).',
    en: 'Drives the script word budget (~150 spoken words/min).',
  },
  minutesShort: { vi: 'phút', en: 'min' },
  fieldScriptLang: { vi: 'Ngôn ngữ quay', en: 'Recording language' },
  fieldScriptLangHint: {
    vi: 'Ngôn ngữ bạn NÓI trong video — độc lập với ngôn ngữ giao diện.',
    en: 'The language you SPEAK in the video — independent of the interface language.',
  },
  vietnamese: { vi: 'Tiếng Việt', en: 'Vietnamese' },
  english: { vi: 'Tiếng Anh', en: 'English' },
  loadingAcademyRefs: { vi: 'Đang tải danh sách môn học…', en: 'Loading courses…' },
  episodeShort: { vi: 'Tập {n}', en: 'Ep. {n}' },

  // ─── Editor shell ───────────────────────────────────────────
  loadingProject: { vi: 'Đang tải dự án…', en: 'Loading project…' },
  projectNotFound: { vi: 'Không tìm thấy dự án', en: 'Project not found' },
  projectNotFoundHint: {
    vi: 'Dự án này có thể đã bị xoá.',
    en: 'This project may have been deleted.',
  },
  backToPipeline: { vi: 'Về dây chuyền', en: 'Back to pipeline' },
  tabOverview: { vi: 'Tổng quan', en: 'Overview' },
  tabStoryboard: { vi: 'Phân cảnh', en: 'Storyboard' },
  tabTeleprompter: { vi: 'Nhắc lời', en: 'Teleprompter' },
  tabScript: { vi: 'Kịch bản', en: 'Script' },
  tabShotlist: { vi: 'Danh sách cảnh', en: 'Shot list' },
  tabPlatforms: { vi: 'Nền tảng', en: 'Platforms' },
  tabChecklist: { vi: 'Việc cần làm', en: 'Checklist' },
  tabPerformance: { vi: 'Hiệu quả', en: 'Performance' },
  unsaved: { vi: 'Chưa lưu', en: 'Unsaved' },
  saveFailed: { vi: 'Lưu thất bại', en: 'Save failed' },
  savedAt: { vi: 'Đã lưu lúc {time}', en: 'Saved at {time}' },

  // ─── Script tab ─────────────────────────────────────────────
  insertSection: { vi: 'Chèn phần:', en: 'Insert section:' },
  secIntro: { vi: 'MỞ ĐẦU', en: 'INTRO' },
  secHook: { vi: 'HOOK', en: 'HOOK' },
  secBody: { vi: 'NỘI DUNG', en: 'BODY' },
  secCta: { vi: 'KÊU GỌI', en: 'CTA' },
  secOutro: { vi: 'KẾT', en: 'OUTRO' },
  bold: { vi: 'Đậm', en: 'Bold' },
  italic: { vi: 'Nghiêng', en: 'Italic' },
  quote: { vi: 'Trích', en: 'Quote' },
  templates: { vi: 'Mẫu', en: 'Templates' },
  templatesTitle: { vi: 'Thư viện kịch bản mẫu', en: 'Script template library' },
  templatesSubtitle: {
    vi: 'Chọn một khung sườn chuyên nghiệp rồi viết đè lên. Mẫu dựng sẵn theo đúng loại nội dung bạn đang làm.',
    en: 'Pick a professional skeleton and write over it. Built-in templates are tailored to the content type you are making.',
  },
  templatesBuiltin: { vi: 'Mẫu dựng sẵn', en: 'Built-in' },
  templatesMine: { vi: 'Mẫu của tôi', en: 'My templates' },
  templatesNoneMine: {
    vi: 'Bạn chưa lưu mẫu nào. Viết xong một kịch bản ưng ý rồi bấm “Lưu thành mẫu”.',
    en: 'You have not saved any templates yet. Write a script you like, then press "Save as template".',
  },
  templateForType: { vi: 'Dành cho: {type}', en: 'For: {type}' },
  templateGeneric: { vi: 'Dùng cho mọi loại', en: 'Works for any type' },
  templateUsedN: { vi: 'Đã dùng {n} lần', en: 'Used {n}x' },
  applyTemplate: { vi: 'Dùng mẫu này', en: 'Use this template' },
  applyTemplateReplaceWarn: {
    vi: 'Kịch bản hiện tại sẽ được lưu thành một phiên bản trước khi thay bằng mẫu.',
    en: 'The current script is snapshotted as a version before the template replaces it.',
  },
  confirmApplyTemplate: {
    vi: 'Thay kịch bản hiện tại bằng mẫu “{name}”? Bản hiện tại sẽ được lưu lại thành phiên bản.',
    en: 'Replace the current script with the template "{name}"? The current one is saved as a version first.',
  },
  saveAsTemplate: { vi: 'Lưu thành mẫu', en: 'Save as template' },
  saveAsTemplateTitle: { vi: 'Lưu kịch bản này thành mẫu', en: 'Save this script as a template' },
  templateName: { vi: 'Tên mẫu', en: 'Template name' },
  templateNamePlaceholder: {
    vi: 'VD: Khung bài giảng 15 phút',
    en: 'e.g. 15-minute lecture skeleton',
  },
  templateDesc: { vi: 'Mô tả ngắn', en: 'Short description' },
  templateDescPlaceholder: {
    vi: 'Khi nào thì nên dùng mẫu này?',
    en: 'When should this template be used?',
  },
  templateSaved: { vi: 'Đã lưu mẫu.', en: 'Template saved.' },
  confirmDeleteTemplate: { vi: 'Xoá mẫu “{name}”?', en: 'Delete the template "{name}"?' },

  // ─── Script versions ────────────────────────────────────────
  versions: { vi: 'Phiên bản', en: 'Versions' },
  versionHistory: { vi: 'Lịch sử kịch bản', en: 'Script history' },
  versionHistorySub: {
    vi: 'Bản lưu tay không bao giờ bị autosave ghi đè. Khôi phục cũng được lưu lại, nên luôn quay ngược được.',
    en: 'Manual snapshots are never overwritten by autosave. Restoring is itself snapshotted, so you can always go back.',
  },
  saveVersion: { vi: 'Lưu phiên bản', en: 'Save version' },
  saveVersionTitle: { vi: 'Lưu một bản chụp kịch bản', en: 'Snapshot the script' },
  versionLabel: { vi: 'Nhãn (tuỳ chọn)', en: 'Label (optional)' },
  versionLabelPlaceholder: {
    vi: 'VD: trước khi cắt phần lý thuyết',
    en: 'e.g. before trimming the theory section',
  },
  noVersions: {
    vi: 'Chưa có phiên bản nào. Bấm “Lưu phiên bản” trước khi viết lại lớn.',
    en: 'No versions yet. Press "Save version" before any big rewrite.',
  },
  versionEmptyScript: {
    vi: 'Kịch bản đang trống — không có gì để lưu.',
    en: 'The script is empty — nothing to snapshot.',
  },
  originMANUAL: { vi: 'Lưu tay', en: 'Manual' },
  originTEMPLATE: { vi: 'Trước khi áp mẫu', en: 'Before template' },
  originRESTORE: { vi: 'Trước khi khôi phục', en: 'Before restore' },
  originAUTO: { vi: 'Tự động', en: 'Auto' },
  confirmRestoreVersion: {
    vi: 'Khôi phục v{n}? Kịch bản hiện tại sẽ được lưu thành một phiên bản mới trước.',
    en: 'Restore v{n}? The current script is saved as a new version first.',
  },
  confirmDeleteVersion: { vi: 'Xoá phiên bản v{n}?', en: 'Delete version v{n}?' },
  previewVersion: { vi: 'Xem nội dung v{n}', en: 'Preview v{n}' },

  // ─── Script budget / pacing ─────────────────────────────────
  wordBudget: { vi: 'Ngân sách chữ', en: 'Word budget' },
  wordBudgetOf: {
    vi: '{used} / {budget} từ cho {min} phút',
    en: '{used} / {budget} words for {min} min',
  },
  wordBudgetOver: { vi: 'Dài hơn {n} từ so với mục tiêu', en: '{n} words over target' },
  wordBudgetUnder: { vi: 'Còn {n} từ nữa là đủ', en: '{n} words to go' },
  wordBudgetNoTarget: {
    vi: 'Đặt “Thời lượng dự kiến” ở tab Tổng quan để thấy ngân sách chữ.',
    en: 'Set a target duration in the Overview tab to see a word budget.',
  },
  outline: { vi: 'Dàn ý', en: 'Outline' },
  outlineEmpty: {
    vi: 'Chưa có mục nào. Dòng bắt đầu bằng ## sẽ thành một mục trong dàn ý.',
    en: 'Nothing yet. A line starting with ## becomes an outline entry.',
  },
  scriptPlaceholder: {
    vi: 'Bắt đầu viết kịch bản…\n\nDùng thanh công cụ ở trên để chèn tiêu đề phần (Mở đầu / Hook / Nội dung / Kêu gọi / Kết), bôi đậm, in nghiêng, hoặc mở thư viện mẫu.\n\nMẹo: dòng bắt đầu bằng ## sẽ trở thành một mục trong dàn ý bên phải.',
    en: 'Start writing your script…\n\nUse the toolbar above to insert section headers (Intro / Hook / Body / CTA / Outro), bold or italicise text, or open the template library.\n\nTip: a line starting with ## becomes an entry in the outline on the right.',
  },
  scriptAutosaves: { vi: 'Tự động lưu', en: 'Auto-saves' },
  scriptFooterHelp: {
    vi: 'Văn bản thuần / markdown, tự lưu cùng phần còn lại của dự án. Dùng tab {tele} để đọc khi quay, và “Lưu phiên bản” để giữ lại bản nháp trước mỗi lần viết lại lớn.',
    en: 'Plain text / markdown, saved automatically with the rest of the project. Use the {tele} tab to read it aloud while filming, and "Save version" to keep a draft before any big rewrite.',
  },
  confirmClearScript: {
    vi: 'Xoá toàn bộ kịch bản? Không thể hoàn tác (hãy lưu phiên bản trước).',
    en: 'Clear the entire script? This cannot be undone (save a version first).',
  },
  downloadMd: { vi: 'Tải .md', en: 'Download .md' },

  // ─── Teleprompter ───────────────────────────────────────────
  teleStart: { vi: 'Chạy', en: 'Start' },
  telePause: { vi: 'Tạm dừng', en: 'Pause' },
  teleReset: { vi: 'Về đầu', en: 'Reset' },
  teleSpeed: { vi: 'Tốc độ', en: 'Speed' },
  teleFontSize: { vi: 'Cỡ chữ', en: 'Font size' },
  teleMirror: { vi: 'Lật gương', en: 'Mirror' },
  teleFullscreen: { vi: 'Toàn màn hình', en: 'Fullscreen' },
  teleSourceScript: { vi: 'Kịch bản', en: 'Script' },
  teleSourceScenes: { vi: 'Phân cảnh', en: 'Scenes' },
  teleElapsed: { vi: 'Đã trôi', en: 'Elapsed' },
  teleTitle: { vi: 'Máy nhắc lời', en: 'Teleprompter' },
  teleSubtitleScript: {
    vi: 'Đọc kịch bản bạn viết ở tab Kịch bản.',
    en: 'Reads the script you wrote in the Script tab.',
  },
  teleSubtitleScenes: {
    vi: 'Đọc lời dẫn của từng phân cảnh, theo thứ tự ngày quay.',
    en: 'Reads each scene\'s voiceover, in day order.',
  },
  teleNoScript: { vi: 'Chưa có kịch bản', en: 'No script yet' },
  teleNoScriptHint: {
    vi: 'Viết kịch bản ở tab Kịch bản — máy nhắc lời sẽ đọc chính nội dung đó. Hoặc chuyển sang nguồn Phân cảnh để đọc lời dẫn từng cảnh.',
    en: 'Write one in the Script tab — the teleprompter reads exactly that. Or switch the source to Scenes to read per-scene voiceovers.',
  },
  teleNoVoiceover: { vi: 'Chưa có lời dẫn nào', en: 'No voiceover lines yet' },
  teleNoVoiceoverHint: {
    vi: 'Thêm lời dẫn cho phân cảnh bất kỳ ở tab Phân cảnh — máy nhắc lời sẽ lấy theo thứ tự ngày quay.',
    en: 'Add a voiceover to any scene in the Storyboard tab — the teleprompter picks them up in day order.',
  },
  teleExit: { vi: 'Thoát', en: 'Exit' },
  teleMirrorTitle: {
    vi: 'Lật gương chữ — dùng cho giàn nhắc lời gắn gương trước ống kính',
    en: 'Mirror the text — for a rig with a beam-splitter glass',
  },
  teleFullscreenTitle: { vi: 'Bật/tắt toàn màn hình', en: 'Toggle fullscreen' },
  teleSceneN: { vi: 'Cảnh {n}', en: 'Scene {n}' },
  teleRemaining: { vi: 'Còn lại', en: 'Remaining' },
  teleShortcuts: {
    vi: 'Phím tắt: Space chạy/dừng · R về đầu · F toàn màn hình · ↑ ↓ đổi tốc độ',
    en: 'Shortcuts: Space play/pause · R reset · F fullscreen · ↑ ↓ speed',
  },
  teleGuide: { vi: 'Vạch đọc', en: 'Reading guide' },
  teleGuideTitle: {
    vi: 'Hiện một vạch ngang cố định để mắt bám vào khi chữ trôi',
    en: 'Show a fixed horizontal line for your eyes to track while the text scrolls',
  },
  teleAtWpm: { vi: '{n} từ/phút', en: '{n} wpm' },
  teleVoiceovers: { vi: '{n} lời dẫn', en: '{n} voiceover|{n} voiceovers' },

  // ─── Idea bank ──────────────────────────────────────────────
  ideasTitle: { vi: 'Kho ý tưởng', en: 'Idea Bank' },
  ideasSubtitle: {
    vi: 'Ghi nhanh mọi tia sáng. Cái nào đáng làm thì nâng thành dự án.',
    en: 'Capture every spark fast. Promote the ones worth making into projects.',
  },
  ideaSearchPlaceholder: { vi: 'Tìm ý tưởng…', en: 'Search ideas…' },
  ideaTitlePlaceholder: { vi: 'Tóm tắt ý tưởng trong 1 câu…', en: 'Sum up the idea in one line…' },
  ideaHookPlaceholder: {
    vi: 'Hook (tuỳ chọn) — câu mở đầu khi lên video',
    en: 'Hook (optional) — the opening line for the video',
  },
  ideaNotes: { vi: 'Ghi chú', en: 'Notes' },
  ideaScore: { vi: 'Điểm', en: 'Score' },
  ideaSuggestedType: { vi: 'Loại gợi ý', en: 'Suggested type' },
  ideaPromote: { vi: 'Nâng thành dự án', en: 'Promote to project' },
  ideaPromotedTo: { vi: 'Đã nâng thành dự án', en: 'Promoted to project' },
  ideaCapture: { vi: 'Ghi ý tưởng', en: 'Capture idea' },
  ideaExportCsv: { vi: 'Xuất CSV các ý tưởng đang lọc', en: 'Export filtered ideas as CSV' },
  ideaNoneHint: {
    vi: 'Gõ vào ô trên và nhấn Enter. Không cần chỉn chu — cứ ghi trước đã.',
    en: 'Type in the box above and hit Enter. It does not need to be polished — just capture it.',
  },
  ideaCreatedAt: { vi: 'Ngày tạo', en: 'Created at' },
  ideaUpdatedAt: { vi: 'Cập nhật', en: 'Updated at' },
  ideaPromotedAt: { vi: 'Ngày nâng', en: 'Promoted at' },
  confirmDeleteIdea: { vi: 'Xoá ý tưởng “{title}”?', en: 'Delete the idea "{title}"?' },
  ideaOpenProject: { vi: 'Mở dự án', en: 'Open project' },
  ideaArchive: { vi: 'Cất đi', en: 'Archive' },
  ideaRate: { vi: 'Chấm {n} sao', en: 'Rate {n}' },
  clearSearch: { vi: 'Xoá ô tìm kiếm', en: 'Clear search' },
  ideaNoMatch: { vi: 'Không có ý tưởng nào khớp', en: 'No ideas match' },
  ideaNoMatchHint: {
    vi: 'Thử đổi bộ lọc trạng thái hoặc xoá ô tìm kiếm.',
    en: 'Try a different status filter, or clear the search box.',
  },
  ideaBankEmpty: { vi: 'Kho ý tưởng đang trống', en: 'Your idea bank is empty' },
  ideasTotal: { vi: '{n} ý tưởng', en: '{n} idea|{n} ideas' },
  ideaCharCount: { vi: '{a}/140 · {b}/280', en: '{a}/140 · {b}/280' },
  ideasPromotedFooter: {
    vi: '{n} ý tưởng đã thành dự án.',
    en: '{n} idea promoted to a project.|{n} ideas promoted to a project.',
  },
  seePipeline: { vi: 'Xem dây chuyền', en: 'See pipeline' },
  daysAgoShort: { vi: '{n} ngày trước', en: '{n}d ago' },

  // ─── Pipeline ───────────────────────────────────────────────
  pipelineTitle: { vi: 'Dây chuyền sản xuất', en: 'Production pipeline' },
  dropHere: { vi: 'Thả vào đây', en: 'Drop here' },

  // ─── Calendar ───────────────────────────────────────────────
  calendarTitle: { vi: 'Lịch sản xuất', en: 'Production calendar' },
  calPrevMonth: { vi: 'Tháng trước', en: 'Previous month' },
  calNextMonth: { vi: 'Tháng sau', en: 'Next month' },
  calThisMonth: { vi: 'Tháng này', en: 'This month' },

  // ─── List view ──────────────────────────────────────────────
  listTitle: { vi: 'Tất cả dự án', en: 'All projects' },
  listExportCsv: { vi: 'Xuất CSV', en: 'Export CSV' },
  listNoMatch: { vi: 'Không có dự án nào khớp bộ lọc.', en: 'No projects match these filters.' },
  colTitle: { vi: 'Tiêu đề', en: 'Title' },
  colType: { vi: 'Loại', en: 'Type' },
  colStatus: { vi: 'Trạng thái', en: 'Status' },
  colFilm: { vi: 'Quay', en: 'Film' },
  colPublish: { vi: 'Đăng', en: 'Publish' },
  colUpdated: { vi: 'Cập nhật', en: 'Updated' },
  colCourse: { vi: 'Môn học', en: 'Course' },

  // ─── Series generator ───────────────────────────────────────
  seriesGen: { vi: 'Tạo loạt bài', en: 'Generate series' },
  seriesGenTitle: { vi: 'Tạo loạt bài từ môn học / dự án', en: 'Generate a series from a course or project' },
  seriesGenSubtitle: {
    vi: 'Đọc dàn bài đã có sẵn rồi sinh mỗi bài một dự án quay, gắn sẵn môn và đánh số tập. Chỉ việc mở ra viết ruột.',
    en: 'Reads an outline you already have and mints one recording project per item, pre-bound and numbered. You just fill in the body.',
  },
  seriesSource: { vi: 'Nguồn', en: 'Source' },
  seriesSourceCourse: { vi: 'Môn học / khoá học', en: 'Course' },
  seriesSourceProject: { vi: 'Dự án', en: 'Project' },
  seriesPickCourse: { vi: 'Chọn một môn…', en: 'Pick a course…' },
  seriesPickProject: { vi: 'Nhập slug dự án…', en: 'Enter a project slug…' },
  seriesLoadingOutline: { vi: 'Đang đọc dàn bài…', en: 'Reading the outline…' },
  seriesNoOutline: {
    vi: 'Môn này chưa có chương/bài nào để sinh. Thêm bài trong Academy trước đã.',
    en: 'This source has no items yet. Add lessons in Academy first.',
  },
  seriesItemsFound: { vi: 'Tìm thấy {n} mục', en: 'Found {n} item|Found {n} items' },
  seriesSelected: { vi: 'Đã chọn {n}', en: '{n} selected' },
  seriesSelectAll: { vi: 'Chọn hết', en: 'Select all' },
  seriesSelectNone: { vi: 'Bỏ chọn hết', en: 'Select none' },
  seriesHideQuiz: { vi: 'Ẩn bài quiz', en: 'Hide quizzes' },
  seriesOptions: { vi: 'Tuỳ chọn cho cả loạt', en: 'Settings for the whole series' },
  seriesApplyTemplate: { vi: 'Áp khung kịch bản', en: 'Apply a script skeleton' },
  seriesApplyTemplateHint: {
    vi: 'Mỗi dự án sinh ra sẽ có sẵn khung này trong tab Kịch bản.',
    en: 'Every generated project starts with this skeleton in its Script tab.',
  },
  seriesNoTemplate: { vi: 'Để trống kịch bản', en: 'Leave the script empty' },
  seriesCreate: { vi: 'Tạo {n} dự án', en: 'Create {n} project|Create {n} projects' },
  seriesCreating: { vi: 'Đang tạo…', en: 'Creating…' },
  seriesDoneCreated: { vi: 'Đã tạo {n} dự án.', en: 'Created {n} project.|Created {n} projects.' },
  seriesDoneSkipped: {
    vi: 'Bỏ qua {n} mục đã có sẵn trong loạt này.',
    en: 'Skipped {n} item that already exists in this series.|Skipped {n} items that already exist in this series.',
  },
  seriesDedupeHint: {
    vi: 'Chạy lại an toàn: mục nào đã có trong loạt sẽ được bỏ qua, không nhân đôi.',
    en: 'Safe to re-run: items already in the series are skipped, never duplicated.',
  },
  seriesTitlePreview: { vi: 'Tên dự án sẽ tạo', en: 'Project titles to create' },
  confirmBulkDelete: {
    vi: 'Xoá {n} dự án? Không thể hoàn tác.',
    en: 'Delete {n} project? This cannot be undone.|Delete {n} projects? This cannot be undone.',
  },
  colCounts: { vi: 'Số lượng', en: 'Counts' },
  filterCourse: { vi: 'Môn học', en: 'Course' },
  courseUnbound: { vi: 'Chưa gắn môn', en: 'No course' },
  loadingProjects: { vi: 'Đang tải dự án…', en: 'Loading projects…' },
  listNoProjectsFilter: {
    vi: 'Không có dự án nào khớp bộ lọc',
    en: 'No projects match these filters',
  },

  // ─── Checklist presets ──────────────────────────────────────
  checklistPreset: { vi: 'Dùng bộ việc mẫu', en: 'Load a checklist preset' },
  checklistPresetHint: {
    vi: 'Nạp danh sách việc chuẩn cho loại nội dung này. Việc đã có được giữ nguyên.',
    en: 'Load the standard task list for this content type. Existing items are kept.',
  },
  checklistPresetApplied: { vi: 'Đã thêm {n} việc.', en: 'Added {n} task|Added {n} tasks' },

  // ─── Calendar ───────────────────────────────────────────────
  calendarSubtitle: {
    vi: 'Nhìn toàn bộ ngày quay và ngày đăng trong một màn hình.',
    en: 'Every film date and publish date at a glance.',
  },
  calViewMonth: { vi: 'Tháng', en: 'Month' },
  calViewAgenda: { vi: 'Lịch trình', en: 'Agenda' },
  calFilming: { vi: 'Quay', en: 'Filming' },
  calPublishing: { vi: 'Đăng', en: 'Publishing' },
  calFilmingEvents: { vi: 'Các mốc quay', en: 'Filming events' },
  calPublishEvents: { vi: 'Các mốc đăng', en: 'Publish events' },
  calUpcoming: { vi: 'Sắp tới', en: 'Upcoming' },
  calUpNext: { vi: 'Tiếp theo', en: 'Up next' },
  calNothingOnDay: { vi: 'Không có gì trong ngày này.', en: 'Nothing scheduled on this day.' },
  calNothingHint: {
    vi: 'Chọn tháng khác, hoặc đặt ngày quay / ngày đăng cho một dự án.',
    en: 'Pick a different month, or set a film / publish date on a project.',
  },
  calPlanFilming: { vi: 'Lên lịch quay', en: 'Plan filming' },
  calPlanPublish: { vi: 'Lên lịch đăng', en: 'Plan publish' },

  // ─── List ───────────────────────────────────────────────────
  listSearchTitle: { vi: 'Tìm theo tiêu đề…', en: 'Search by title…' },
  listExportTitle: { vi: 'Xuất các dự án đang lọc ra CSV', en: 'Export filtered projects as CSV' },
  listClearSelection: { vi: 'Bỏ chọn', en: 'Clear selection' },
  listSetStatus: { vi: 'Đổi trạng thái…', en: 'Set status…' },
  listCaptureIdea: { vi: 'Ghi một ý tưởng', en: 'Capture an idea' },
  colSlug: { vi: 'Slug', en: 'Slug' },
  colIdeaDate: { vi: 'Ngày lên ý tưởng', en: 'Idea date' },
  colThumbnail: { vi: 'Ảnh bìa', en: 'Thumbnail URL' },
  colDays: { vi: 'Số ngày quay', en: 'Production days' },
  colProducts: { vi: 'Sản phẩm liên kết', en: 'Affiliate products' },
  colPosts: { vi: 'Bài đăng nền tảng', en: 'Platform posts' },
  colChecklist: { vi: 'Việc cần làm', en: 'Checklist items' },

  // ─── Overview tab ───────────────────────────────────────────
  ovIdentity: { vi: 'Nhận dạng', en: 'Identity' },
  ovPitch: { vi: 'Nội dung cốt lõi', en: 'The pitch' },
  ovTimeline: { vi: 'Mốc thời gian', en: 'Timeline' },
  ovThumbnail: { vi: 'Ảnh bìa', en: 'Thumbnail' },
  ovRefLinks: { vi: 'Liên kết tham khảo', en: 'Reference links' },
  ovAddTag: { vi: 'Thêm thẻ…', en: 'Add tag…' },
  ovLabel: { vi: 'Nhãn', en: 'Label' },
  ovRemoveLink: { vi: 'Xoá liên kết', en: 'Remove link' },
  ovProjectThumb: { vi: 'Ảnh bìa dự án', en: 'Project thumbnail' },
  fieldIdeaDate: { vi: 'Ngày lên ý tưởng', en: 'Idea date' },
  tagEnterHint: { vi: 'Nhấn Enter hoặc dấu phẩy để thêm thẻ.', en: 'Press Enter or comma to add a tag.' },
  fieldConceptLong: { vi: 'Ý tưởng (mô tả dài)', en: 'Concept (longer description)' },

  // ─── Storyboard ─────────────────────────────────────────────
  sbAddDay: { vi: 'Thêm ngày quay', en: 'Add filming day' },
  sbAddScene: { vi: 'Thêm phân cảnh', en: 'Add scene' },
  sbRemoveDay: { vi: 'Xoá ngày quay', en: 'Remove day' },
  sbRemoveScene: { vi: 'Xoá phân cảnh', en: 'Remove scene' },
  sbDragDay: { vi: 'Kéo để đổi thứ tự ngày', en: 'Drag to reorder day' },
  sbLocation: { vi: 'Địa điểm (VD: phòng thu tại nhà, quán cà phê…)', en: 'Location (e.g. home studio, a café…)' },
  sbDayNotes: { vi: 'Ghi chú cho ngày quay (ánh sáng, nhân sự, đạo cụ cần mang…)', en: 'Day notes (lighting, talent, props to bring…)' },
  sbNoScenes: { vi: 'Chưa có phân cảnh nào. Thêm một cảnh để bắt đầu.', en: 'No scenes yet. Add one to start the shot list.' },
  sbEmptyHint: {
    vi: 'Thêm một ngày quay để bắt đầu lên danh sách cảnh. Mỗi ngày chứa các phân cảnh của buổi quay đó.',
    en: 'Add a day to start planning your shot list. Each day holds the scenes for that session.',
  },
  scDialogue: { vi: 'Lời thoại', en: 'Dialogue' },
  scDialoguePh: { vi: 'Lời thoại xuất hiện trên hình…', en: 'On-screen dialogue…' },
  scVoiceover: { vi: 'Lời dẫn', en: 'Voiceover' },
  scVoiceoverPh: { vi: 'Lời dẫn ngoài hình…', en: 'Voiceover narration…' },
  scAction: { vi: 'Hành động / máy quay', en: 'Action / camera' },
  scActionPh: { vi: 'Chuyện gì xảy ra + hướng máy quay…', en: 'What happens + camera direction…' },
  scProps: { vi: 'Đạo cụ', en: 'Props' },
  scPropsPh: { vi: 'Đạo cụ (cách nhau bằng dấu phẩy, VD: micro, đèn, điện thoại)', en: 'Props (comma-separated, e.g. mic, ring light, phone)' },
  scBroll: { vi: 'Cảnh chèn / dựng', en: 'B-roll / editing' },
  scBrollPh: { vi: 'Cảnh chèn thêm + ghi chú khi dựng…', en: 'B-roll inserts + editing notes…' },
  scBrollNotes: { vi: 'Ghi chú cảnh chèn', en: 'B-roll notes' },
  scBrollNotesPh: { vi: 'Chèn cảnh gì vào đây…', en: 'What B-roll to drop in here…' },
  scEditingNotes: { vi: 'Ghi chú dựng', en: 'Editing notes' },
  scEditingNotesPh: { vi: 'Cắt, chuyển cảnh, nhạc, hiệu ứng tiếng…', en: 'Cut, transition, music, SFX…' },
  scCamera: { vi: 'Máy quay', en: 'Camera' },
  secondsShort: { vi: 'giây', en: 'sec' },

  // ─── Shot list ──────────────────────────────────────────────
  slScenes: { vi: 'Phân cảnh', en: 'Scenes' },
  slTotalLength: { vi: 'Tổng thời lượng', en: 'Total length' },
  slCameraAngles: { vi: 'Góc máy', en: 'Camera angles' },
  slUniqueProps: { vi: 'Đạo cụ khác nhau', en: 'Unique props' },
  slNoScenes: { vi: 'Chưa có phân cảnh nào', en: 'No scenes yet' },
  slNoScenesHint: {
    vi: 'Thêm phân cảnh ở tab Phân cảnh, chúng sẽ hiện ở đây thành danh sách cảnh quay.',
    en: 'Add scenes in the Storyboard tab and they\'ll show up here as your shot list.',
  },

  // ─── Platforms ──────────────────────────────────────────────
  plAddPost: { vi: 'Thêm bài đăng:', en: 'Add a new post:' },
  plCaptionPh: { vi: 'Nội dung bài đăng cho nền tảng này…', en: 'Caption for this platform…' },
  plPostUrl: { vi: 'Link bài đăng (sau khi đăng)', en: 'Post URL (after publish)' },
  plHashtags: { vi: 'Hashtag', en: 'Hashtags' },
  plAddTag: { vi: 'thêm thẻ…', en: 'add tag…' },
  plEmptyHint: {
    vi: 'Thêm một dòng bên dưới để soạn nội dung và hẹn giờ đăng cho nền tảng này.',
    en: 'Add a row below to schedule a caption + publish time for this platform.',
  },
  dragReorder: { vi: 'Kéo để đổi thứ tự', en: 'Drag to reorder' },

  // ─── Checklist ──────────────────────────────────────────────
  clReadiness: { vi: 'Mức độ sẵn sàng', en: 'Project readiness' },
  clNewItem: { vi: 'Việc mới', en: 'New item' },
  clItemPh: { vi: 'Tên việc cần làm…', en: 'Item label…' },
  clNoItems: { vi: 'Chưa có việc nào', en: 'No items' },

  // ─── Performance ────────────────────────────────────────────
  pfViews: { vi: 'Lượt xem', en: 'Views' },
  pfLikes: { vi: 'Lượt thích', en: 'Likes' },
  pfComments: { vi: 'Bình luận', en: 'Comments' },
  pfShares: { vi: 'Chia sẻ', en: 'Shares' },
  pfEngagement: { vi: 'Tỷ lệ tương tác', en: 'Engagement rate' },
  pfWatchTime: { vi: 'Thời gian xem trung bình', en: 'Avg watch time' },
  pfLessons: { vi: 'Rút ra được gì', en: 'Lessons learned' },
  pfLessonsPh: {
    vi: '3 giây đầu gánh cả video…',
    en: 'The first 3 seconds carried the entire video…',
  },
  pfPerPlatform: { vi: 'Chi tiết theo nền tảng', en: 'Per-platform breakdown' },
  pfNoMetrics: { vi: 'Chưa có số liệu', en: 'No metrics yet' },
  pfNoMetricsHint: {
    vi: 'Sau khi đăng, quay lại đây để ghi lại số liệu và rút kinh nghiệm cho video sau.',
    en: 'Once you publish this project, come back here to log the numbers and what you learned.',
  },
  pfStartTracking: { vi: 'Bắt đầu theo dõi', en: 'Start tracking' },
  pfJsonHint: {
    vi: 'Lưu bằng Ctrl/Cmd+S hoặc bấm ra ngoài. JSON sai định dạng sẽ được hoàn lại.',
    en: 'Save with Ctrl/Cmd+S or by clicking away. Invalid JSON is reverted.',
  },

  calFooterHint: {
    vi: 'Đặt ngày quay / ngày đăng cho dự án ở {link}, hoặc bấm vào một ngày bất kỳ để lên kế hoạch mới.',
    en: 'Set a film or publish date in the {link}, or click any day to plan a new one.',
  },
  calProjectList: { vi: 'danh sách dự án', en: 'project list' },
  calWeekOf: { vi: 'Tuần {from} – {to}', en: 'Week of {from} – {to}' },
  calNoEventsWindow: { vi: 'Không có mốc nào trong khoảng này', en: 'No events in this window' },
  pfLessonsHint: { vi: 'cái gì hiệu quả, cái gì không', en: 'what worked, what did not' },

  // ─── Save indicator ─────────────────────────────────────────
  saveReady: { vi: 'Sẵn sàng', en: 'Ready' },

  // ─── Misc ───────────────────────────────────────────────────
  searchTitleOrTag: { vi: 'Tìm tiêu đề hoặc #thẻ…', en: 'Search title or #tag…' },
  dragCardHint: {
    vi: 'Kéo để đổi thứ tự hoặc chuyển cột',
    en: 'Drag to reorder or move between columns',
  },
  badProjectLink: {
    vi: 'Đường dẫn bạn vừa mở không trỏ tới dự án nào.',
    en: 'The link you followed doesn\'t point at a real project.',
  },
} satisfies Record<string, StudioText>;

export type StudioKey = keyof typeof S;

/**
 * Resolve one key.
 *
 * `{name}` placeholders are substituted from `vars`. When `vars.n`
 * is present and the chosen string contains a `|`, the singular
 * side is used for n === 1 and the plural side otherwise — see the
 * pluralisation note at the top of this file.
 */
export function studioT(
  lang: StudioLang,
  key: StudioKey,
  vars?: Record<string, string | number>,
): string {
  const entry = S[key] as StudioText | undefined;
  // A missing key returns the key itself rather than throwing —
  // a typo should show up as visible nonsense in one label, not
  // blank out the whole studio.
  if (!entry) return String(key);

  let out = entry[lang] ?? entry.en;

  if (out.includes('|')) {
    const [one, many] = out.split('|');
    const n = vars?.n;
    out = typeof n === 'number' && n === 1 ? one : many;
  }

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.split(`{${k}}`).join(String(v));
    }
  }
  return out;
}

export type StudioTFn = (key: StudioKey, vars?: Record<string, string | number>) => string;

/**
 * Studio translator bound to the site locale.
 *
 * Returns `setLang` too, so the topbar's language button flips the
 * WHOLE site rather than only the studio — a user who switches
 * language here and then navigates to /admin expects it to have
 * stuck.
 */
export function useStudioT(): {
  t: StudioTFn;
  lang: StudioLang;
  setLang: (lang: StudioLang) => void;
  isVi: boolean;
} {
  const { locale, setLocale } = useTranslation();
  const lang: StudioLang = locale === 'vi' ? 'vi' : 'en';

  const t = useCallback<StudioTFn>(
    (key, vars) => studioT(lang, key, vars),
    [lang],
  );

  return { t, lang, setLang: setLocale, isVi: lang === 'vi' };
}
