/**
 * Curated YouTube track for SWP391 — Software Development Project.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/software-development-project.mjs
 *
 * Pure-admin lessons (0.2 passing requirements, 0.3 CLOs, 0.5 topic bank,
 * 0.6 scoring formula, and the three Milestone checklists) are deliberately
 * absent — no general lecture matches them.
 */
export default {
  courseSlug: 'software-development-project',
  defaultVideoTrack: 'YT',
  lessons: {
    'swp391-gioi-thieu': { yt: 'SaCYkPD4_K0', credit: 'AltexSoft — Software Development Life Cycle: Explained' },
    'swp391-tai-lieu-cong-cu': { yt: 'Sxxw3qtb3_g', credit: 'Fireship — How to OVER Engineer a Website // What is a Tech Stack?' },
    'swp391-1-1-de-tai-nhom-vai-tro': { yt: 'EUALxzRTfkw', credit: 'Mountain Goat Software: Agile & Scrum Mastery — Scrum Roles: Product Owner, Scrum Master, and Developers' },
    'swp391-1-2-ai-sdlc-git-workflow': { yt: 'oFYyTZwMyAg', credit: 'LearnCode.academy — GITHUB PULL REQUEST, Branching, Merging & Team Workflow' },
    'swp391-2-1-elicitation-srs': { yt: 'zCX-N1H8Vps', credit: 'Udacity — Functional and Nonfunctional Requirements - Georgia Tech - Software Development Process' },
    'swp391-2-2-use-case-backlog': { yt: 'ogV2r9579WI', credit: 'Online PM Courses - Mike Clayton — What are Agile Epics, User Stories, and Story Points?' },
    'swp391-3-1-erd-schema': { yt: 'xsg9BDiwiJE', credit: 'Lucid Software — Entity Relationship Diagram (ERD) Tutorial - Part 1' },
    'swp391-3-2-mvc-api': { yt: 'DUg2SWWK18I', credit: 'Web Dev Simplified — MVC Explained in 4 Minutes' },
    'swp391-4-1-repository-service-sqli': { yt: 'D44si7o4ndg', credit: 'Daniel Smidstrup — Controller-Service-Repository: Simplifying Java Spring Boot' },
    'swp391-4-2-code-review-integration': { yt: 'd9_fweNDjKw', credit: 'Modern Software Engineering — Better Code Reviews in 6 SIMPLE STEPS' },
    'swp391-5-1-testing-bug-tracking': { yt: 'pf6Zhm-PDfQ', credit: 'Jelvix | TECH IN 5 MINUTES — Unit and Integration testing COMPARED' },
    'swp391-6-1-build-staging-cicd': { yt: 'AknbizcLq4w', credit: 'TechWorld with Nana — CI/CD Explained: The DevOps Skill That Makes You 10x More Valuable' },
    'swp391-7-1-teamwork-ethics': { yt: 'MZdK4SX0mfI', credit: 'Mountain Goat Software: Agile & Scrum Mastery — Daily Scrum Explained: A Better Way to Run It' },
    'swp391-7-2-report-presentation': { yt: 'rNPJKpmp3TM', credit: 'Y Combinator — The secret to better product demos' },
    'swp391-8-1-responsible-ai': { yt: 'mViFYTwWvcM', credit: 'IBM Technology — Spec-Driven Development: AI Assisted Coding Explained' },
    'swp391-9-1-docker-devops': { yt: 'pg19Z8LL06w', credit: 'TechWorld with Nana — Docker Crash Course for Absolute Beginners [NEW]' },
  },
};
