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
    "swp391-0-3-tracking-monitoring": { yt: "9W4oxjdAwUs", credit: "GitLab Unfiltered — GitLab Project Management: How to use Issues, Epics, Milestones, and Roadmaps" },
    "swp391-1-3-gitlab-setup-du-an": { yt: "J5-xd88LtyQ", credit: "GitLab — GitLab for Everyone: Understanding Groups & Permissions" },
    "swp391-1-4-git-client-commit-push": { yt: "RGOj5yH7evk", credit: "freeCodeCamp.org — Git and GitHub for Beginners - Crash Course" },
    "swp391-1-5-nhanh-xung-dot-tag": { yt: "DloR0BOGNU0", credit: "Philomatics — Never fear merge conflicts again - git merge/pull tutorial" },
    "swp391-2-3-business-rules-prototyping": { yt: "I5u2QOH18W8", credit: "Grow with Google — Building Low-Fidelity Wireframes and Prototypes | Google UX Design Certificate" },
    "swp391-2-4-srs-template": { yt: "M5DY3eTyhUA", credit: "The Business Analysis Doctor - IIBA Certification — Software Requirement Specification (SRS) Tutorial and EXAMPLE | Functional Requirement Document" },
    "swp391-2-ai-ba-prompts": { yt: "b9Y2IfrDLeQ", credit: "Bridging the Gap - Resources for Business Analysts — How to Use ChatGPT as a Business Analyst | AI and Business Analysis" },
    "swp391-3-design-foundations": { yt: "WnMQ8HlmeXc", credit: "freeCodeCamp.org — UML Diagrams Full Course (Unified Modeling Language)" },
    "swp391-3-analysis-modeling": { yt: "Xe0VZ2Fw7FQ", credit: "Ave Coders — UML Communication Diagram" },
    "swp391-3-oo-design": { yt: "6XrL5jXmTwM", credit: "Lucid Software — UML class diagrams" },
    "swp391-3-sds-document": { yt: "pCK6prSq8aw", credit: "Lucid Software — How to Make a UML Sequence Diagram" },
    "swp391-3-1b-association-mapping": { yt: "hktyW5Lp0Vo", credit: "Lucid Software — Entity Relationship Diagram (ERD) Tutorial - Part 2: Primary keys, foreign keys, and bridge tables" },
    "swp391-3-1c-generalization-mapping": { yt: "zf0_jg1rXrs", credit: "Dr. Daniel Soper — Topic 04, Part 11 - Supertype and Subtype Entities" },
    "swp391-3-1d-g5-database-review": { yt: "l19Vq_27z-o", credit: "Database Star — How to Generate an ERD in MySQL Workbench" },
    "swp391-4-code-one-screen-mvc": { yt: "9ToWzrRihv4", credit: "Java Guides — JSP Servlet JDBC MySQL Create Read Update Delete (CRUD) Example" },
    "swp391-5-2-system-test-template3": { yt: "MMa4AVdBCZY", credit: "QA Madness — How to Write Test Cases for Manual Testing?" },
    "swp391-5-3-unit-tests-junit": { yt: "flpmSXVTqBI", credit: "freeCodeCamp.org — Java Testing - JUnit 5 Crash Course" },
    "swp391-6-2-db-script-demo-video": { yt: "zFS1UvYOLhI", credit: "KeepItTechie — MySQL Dump | Import and Export Databases" },
    "swp391-6-3-deploy-java-web-mailtrap": { yt: "thEk-i2OIK4", credit: "Cameron McKenzie — How to deploy a WAR file to Tomcat using Maven from Apache example tutorial" },
    "swp391-7-3-presentation-template-demo-qa": { yt: "-FOCpMAww28", credit: "TED — TED's secret to great public speaking | Chris Anderson | TED" },
    "swp391-7-4-rds-document": { yt: "bgHL41e7vgI", credit: "Clément Mihailescu — What Is A Design Doc In Software Engineering? (full example)" },
    "swp391-sample-g5-rds-requirements": { yt: "WuNQLhx3dd8", credit: "The Business Analysis Doctor - IIBA Certification — Use Case Description EXAMPLE [ Use Case Tutorial and Best Practices ]" },
  },
};
