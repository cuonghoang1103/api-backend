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
    "pro192-n2-1-solid": { yt: "_jDNAf3CzeY", credit: "Amigoscode — Learn SOLID Principles with CLEAN CODE Examples", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/10-nang-cao-java-hien-dai-thiet-ke/10-02-n2-1-solid-3417b2e4.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-bat-dau-tai-day': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/00-gioi-thieu-huong-dan-hoc/00-01-bat-dau-tai-day-2eb71fe9.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-hoc-the-nao': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/00-gioi-thieu-huong-dan-hoc/00-02-hoc-the-nao-30665ed9.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-cai-moi-truong': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/00-gioi-thieu-huong-dan-hoc/00-03-cai-moi-truong-087fe194.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-buoi-dau-tien': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/00-gioi-thieu-huong-dan-hoc/00-04-buoi-dau-tien-d2dc7bbf.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro1-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-01-slide-tu-duy-doi-tuong-tron-7058cd0b.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro3-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-02-slide-cong-nghe-java-tron-a1b5eaff.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro3-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-03-slide-chuong-trinh-dau-tien-tron-a2ddf810.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro4-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-04-slide-cu-phap-java-tron-f81afe6d.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro5-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-05-slide-lop-bao-so-39033f5a.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro5-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-06-slide-chuoi-tron-6e660769.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro6-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-07-slide-collections-tron-5aacc215.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-on-ch1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-10-thuc-hanh-tron-d66f5a00.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab-1-danh-muc-sach': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/01-tu-duy-doi-tuong-java-co-ban/01-51-lab-1-danh-muc-sach-tron-4b1e40a0.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro7-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-01-slide-quan-ly-bo-nho-tron-3ec6c7c4.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro8-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-02-slide-dong-goi-lop-tron-8b53cf6b.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro8-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-03-slide-dong-goi-lop-tham-so-1b33d2bc.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-on-ch2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-05-thuc-hanh-tron-ee33fbfc.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab-2-sach-va-thanh-vien': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/02-lop-va-doi-tuong/02-51-lab-2-sach-va-thanh-vien-tron-b8d308da.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro8-3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/03-dong-goi-truu-tuong/03-01-slide-package-access-tron-575245cd.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab-3-dong-goi-va-luat-du-lieu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/03-dong-goi-truu-tuong/03-51-lab-3-dong-goi-va-luat-du-lieu-tron-0f9136b5.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro10-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/04-ke-thua-da-hinh/04-02-slide-da-hinh-tron-68f17b3b.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro10-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/05-lop-truu-tuong-interface/05-01-slide-interface-abstract-tron-f32cea58.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-on-ch3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/03-dong-goi-truu-tuong/03-03-thuc-hanh-tron-9986fb8e.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro9-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/04-ke-thua-da-hinh/04-01-slide-ke-thua-tron-20e007a7.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-on-ch4': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/04-ke-thua-da-hinh/04-05-thuc-hanh-tron-cb2f1ce5.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab-4-ke-thua-va-da-hinh': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/04-ke-thua-da-hinh/04-51-lab-4-ke-thua-va-da-hinh-tron-73f99bda.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-on-ch5': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/05-lop-truu-tuong-interface/05-03-thuc-hanh-tron-d81c3491.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab-5-truu-tuong-va-interface': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/05-lop-truu-tuong-interface/05-51-lab-5-truu-tuong-va-interface-tron-312cf8a0.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro11-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/06-xu-ly-ngoai-le/06-01-slide-xu-ly-ngoai-le-tron-f2d49ea3.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab-6-ngoai-le-muon-tra': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/06-xu-ly-ngoai-le/06-51-lab-6-ngoai-le-muon-tra-tron-6c93117c.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro12-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/07-mang-doi-tuong/07-01-slide-mang-doi-tuong-tron-3c97bb4c.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro13-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/08-java-collections/08-01-slide-collections-tron-d2200835.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro13-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/08-java-collections/08-02-slide-set-map-tron-c52e4c03.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-on-ch8': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/08-java-collections/08-04-thuc-hanh-tron-af34d671.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro14-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-luong-doc-ghi-tep/09-01-slide-file-io-tron-ec08bf09.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-pro14-3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-luong-doc-ghi-tep/09-03-slide-file-io-nhi-phan-tron-d206da46.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-on-ch9': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-luong-doc-ghi-tep/09-05-thuc-hanh-tron-d8b8da18.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab-9-luu-tep': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-luong-doc-ghi-tep/09-51-lab-9-luu-tep-tron-a60ccc52.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-n1-1-modern-java': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/10-nang-cao-java-hien-dai-thiet-ke/10-01-n1-1-modern-java-16bab7fd.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-banking': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/10-nang-cao-java-hien-dai-thiet-ke/10-03-banking-tron-b8c5b4a5.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs1-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-01-slide-cs1-1-generics-tron-c9eae112.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-cs1-on': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-03-cs1-on-bai-tap-tron-be002c9a.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs2-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-05-slide-cs2-1-stream-tron-572e7b16.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs2-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-06-slide-cs2-2-collectors-tron-2a606b8d.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs3-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-09-slide-cs3-1-java-hien-dai-tron-5308ce1c.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs3-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-10-slide-cs3-2-sealed-switch-mau-tron-7baff6d8.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-cs3-on': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-11-cs3-on-bai-tap-tron-5c0173c9.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs4-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-13-slide-cs4-2-bat-bien-tron-7c918566.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-cs5-on': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-16-cs5-bai-tap-tron-dcae00cb.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-cs6-on': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-17-cs6-bai-tap-tron-06d1516b.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs6-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-17-slide-cs6-1-thiet-ke-tron-48a40ad7.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs6-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-17-slide-cs6-2-maven-junit-tron-5327ad10.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs7-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-25-slide-cs7-1-solid-tron-b1dbecb9.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs7-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-26-slide-cs7-2-mau-thiet-ke-tron-729aa0a8.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-cs7-on': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-27-cs7-on-bai-tap-a920148a.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs8-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-29-slide-cs8-1-da-luong-tron-6eac147e.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs8-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-30-slide-cs8-2-executor-tron-e1adac64.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-cs8-on': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-31-cs8-on-bai-tap-29ea192c.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-du-an-ct-library': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/12-du-an-cuoi-khoa-ct-library/12-01-du-an-ct-library-tron-f9924cdd.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab211-cach-qua-review': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-lab211-thuc-chien/l211-01-cach-qua-review-tron-5b2fae61.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab211-p0011-change-base-number': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-lab211-thuc-chien/l211-02-p0011-change-base-number-tron-aa235dda.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab211-p0021-student-management': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-lab211-thuc-chien/l211-03-p0021-student-management-tron-ef1750f0.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab211-p0056-worker-management': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-lab211-thuc-chien/l211-04-p0056-worker-management-tron-7c4404b7.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab211-p0070-ebank-login': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-lab211-thuc-chien/l211-05-p0070-ebank-login-tron-36ecf2cc.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab211-p0071-task-management': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-lab211-thuc-chien/l211-06-p0071-task-management-tron-185a0237.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab211-p0073-handy-expense': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/09-lab211-thuc-chien/l211-07-p0073-handy-expense-tron-27cc47c5.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-lab-8-collections': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/08-java-collections/08-51-lab-8-collections-tron-0f33897b.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs5-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-15-slide-cs5-1-jvm-tron-e4b5b4c1.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-luyen-pe-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/13-on-thi-luyen-pe/13-04-luyen-pe-2-tron-74d71835.mp4' }, defaultVideoTrack: 'VI'},
    'pro192-slide-cs5-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/object-oriented-programming/11-chuyen-sau-java-hien-dai-spring/11-15-slide-cs5-2-jvm-tron-0cf30315.mp4' }, defaultVideoTrack: 'VI' },
  },
};
