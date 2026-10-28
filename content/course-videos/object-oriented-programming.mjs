/**
 * Curated YouTube track for PRO192 — Object-Oriented Programming (Java).
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/object-oriented-programming.mjs
 */
export default {
  courseSlug: 'object-oriented-programming',
  defaultVideoTrack: 'YT',
  lessons: {
    // 0.1 — About PRO192 & the course map → a full Java course as the getting-started overview
    "pro192-gioi-thieu": { yt: "xTtL8E4LzTQ", credit: "Bro Code — Java Full Course for free ☕" },
    // 1.1 — Why objects? Procedural vs OO (conceptual OOP overview)
    "pro192-1-1-tu-duy-oo": { yt: "pTB0EiLXUC8", credit: "Programming with Mosh — Object-Oriented Programming, Simplified" },
    // 1.2 — Java syntax essentials (from C to Java)
    "pro192-1-2-cu-phap-java": { yt: "eIrMbAQSU34", credit: "Programming with Mosh — Java Full Course for Beginners" },
    // 2.1 — Fields, methods & constructors
    "pro192-2-1-lop-doi-tuong": { yt: "pgBk8HC7jbU", credit: "Coding with John — Java Constructors - Full Tutorial" },
    // 3.1 — Encapsulation & abstraction
    "pro192-3-1-dong-goi": { yt: "eboNNUADeIc", credit: "Bro Code — Java encapsulation 💊" },
    // 4.1 — Inheritance
    "pro192-4-1-ke-thua": { yt: "GTP5lVEKXaU", credit: "Bro Code — Learn Java inheritance in 9 minutes! 👨‍👧‍👦" },
    // 4.2 — Polymorphism
    "pro192-4-2-da-hinh": { yt: "jhDUxynEQRI", credit: "Coding with John — Java Polymorphism Fully Explained In 7 Minutes" },
    // 5.1 — Abstract classes & interfaces
    "pro192-5-1-abstract-interface": { yt: "HvPlEJ3LHgE", credit: "Coding with John — Abstract Classes and Methods in Java Explained in 7 Minutes" },
    // 6.1 — try, catch, finally & throw
    "pro192-6-1-ngoai-le": { yt: "1XAfapkBQjk", credit: "Coding with John — Exception Handling in Java Tutorial" },
    // 7.1 — Managing many objects (array of objects)
    "pro192-7-1-mang-doi-tuong": { yt: "nhIB2S6NiFA", credit: "Bro Code — Java array of objects 🍱" },
    // 8.1 — List, Set & Map (Collections API)
    "pro192-8-1-collections": { yt: "Kn1RbK02YpM", credit: "Telusko — #91 Collection API in Java" },
    // 9.1 — Reading & writing files
    "pro192-9-1-file-io": { yt: "ScUJx4aWRi0", credit: "Coding with John — Java File Input/Output - It's Way Easier Than You Think" },
    // N2.1 — Good OO design & SOLID basics
    "pro192-n2-1-solid": { yt: "_jDNAf3CzeY", credit: "Amigoscode — Learn SOLID Principles with CLEAN CODE Examples" },
    'pro192-bat-dau-tai-day': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/00-gioi-thieu-huong-dan-hoc/00-01-bat-dau-tai-day-2eb71fe9.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-hoc-the-nao': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/00-gioi-thieu-huong-dan-hoc/00-02-hoc-the-nao-30665ed9.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-cai-moi-truong': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/00-gioi-thieu-huong-dan-hoc/00-03-cai-moi-truong-087fe194.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-buoi-dau-tien': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/00-gioi-thieu-huong-dan-hoc/00-04-buoi-dau-tien-d2dc7bbf.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro1-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-01-slide-tu-duy-doi-tuong-tron-7058cd0b.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro3-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-02-slide-cong-nghe-java-tron-a1b5eaff.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro3-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-03-slide-chuong-trinh-dau-tien-tron-a2ddf810.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro4-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-04-slide-cu-phap-java-tron-f81afe6d.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro5-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-05-slide-lop-bao-so-39033f5a.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro5-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-06-slide-chuoi-tron-6e660769.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro6-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-07-slide-collections-tron-5aacc215.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-on-ch1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-10-thuc-hanh-tron-d66f5a00.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-lab-1-danh-muc-sach': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-51-lab-1-danh-muc-sach-tron-4b1e40a0.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro7-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-01-slide-quan-ly-bo-nho-tron-3ec6c7c4.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro8-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-02-slide-dong-goi-lop-tron-8b53cf6b.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro8-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-03-slide-dong-goi-lop-tham-so-1b33d2bc.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-on-ch2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-05-thuc-hanh-tron-ee33fbfc.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-lab-2-sach-va-thanh-vien': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-51-lab-2-sach-va-thanh-vien-tron-b8d308da.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro8-3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/03-dong-goi-truu-tuong/03-01-slide-package-access-tron-575245cd.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-lab-3-dong-goi-va-luat-du-lieu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/03-dong-goi-truu-tuong/03-51-lab-3-dong-goi-va-luat-du-lieu-tron-0f9136b5.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro10-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/04-ke-thua-da-hinh/04-02-slide-da-hinh-tron-68f17b3b.mp4' }, defaultVideoTrack: 'VI' },
    'pro192-slide-pro10-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/05-lop-truu-tuong-interface/05-01-slide-interface-abstract-tron-f32cea58.mp4' }, defaultVideoTrack: 'VI' },
  },
};
