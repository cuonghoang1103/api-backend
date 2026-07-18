/**
 * codelab-seed.mjs — build the Code Lab starter skeleton (English).
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates a professional taxonomy: Groups (Languages / Backend / Frontend /
 * Database / Mobile / DevOps & Cloud / Algorithms & DS / Game & Graphics /
 * Web & Networking) → Tracks (Java Core, Python, Spring Boot, Node.js, Next.js,
 * SQL, …) → a standard Module skeleton per track. Plus a couple of fully-worked
 * sample exercises (NTU-style OOP: the Circle & Rectangle classes) so the hub
 * isn't empty. Most exercises are meant to be AI-generated from /admin/code-lab.
 *
 * IDEMPOTENT — matched by slug: existing rows are skipped (your edits are safe).
 *
 *   node scripts/codelab-seed.mjs            # dry-run (default, writes nothing)
 *   node scripts/codelab-seed.mjs --apply    # write for real
 *
 * On the VPS (env DATABASE_URL comes from the container):
 *   docker exec cuonghoangdev_backend node scripts/codelab-seed.mjs --apply
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

// Must match slugify() in src/services/codeLab.service.ts.
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Standard module skeletons reused across many tracks.
const M_STD = ['Getting Started', 'Core Basics', 'Intermediate', 'Advanced'];
const M_LANG = ['Basics & Syntax', 'Control Flow', 'Functions', 'Data Structures', 'OOP', 'Advanced Topics'];
const M_FRAMEWORK = ['Setup & Fundamentals', 'Routing & Components', 'Data & State', 'APIs & Persistence', 'Testing & Deploy'];
const M_DB = ['SELECT Basics', 'Filtering & Sorting', 'Joins', 'Aggregation & Grouping', 'Subqueries & Advanced'];
const M_ALGO = ['Arrays & Strings', 'Sorting & Searching', 'Recursion', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'];

// ── Taxonomy ──────────────────────────────────────────────────────────────────
const GROUPS = [
  {
    name: 'Languages', icon: 'languages', color: '#6366f1',
    description: 'Master a programming language from zero to advanced.',
    tracks: [
      { name: 'Java Core', language: 'java', color: '#e76f00', docsUrl: 'https://docs.oracle.com/en/java/', modules: M_LANG, level: 'BEGINNER' },
      { name: 'Python', language: 'python', color: '#3776ab', docsUrl: 'https://docs.python.org/3/', modules: M_LANG },
      { name: 'JavaScript', language: 'javascript', color: '#f7df1e', docsUrl: 'https://developer.mozilla.org/docs/Web/JavaScript', modules: M_LANG },
      { name: 'TypeScript', language: 'typescript', color: '#3178c6', docsUrl: 'https://www.typescriptlang.org/docs/', modules: M_LANG },
      { name: 'C', language: 'c', color: '#5c6bc0', modules: M_LANG },
      { name: 'C++', language: 'cpp', color: '#00599c', docsUrl: 'https://en.cppreference.com/', modules: M_LANG },
      { name: 'C#', language: 'csharp', color: '#68217a', docsUrl: 'https://learn.microsoft.com/dotnet/csharp/', modules: M_LANG },
      { name: 'Go', language: 'go', color: '#00add8', docsUrl: 'https://go.dev/doc/', modules: M_LANG },
      { name: 'Rust', language: 'rust', color: '#dea584', docsUrl: 'https://doc.rust-lang.org/book/', modules: M_LANG },
      { name: 'Kotlin', language: 'kotlin', color: '#7f52ff', docsUrl: 'https://kotlinlang.org/docs/home.html', modules: M_LANG },
    ],
  },
  {
    name: 'Backend', icon: 'backend', color: '#10b981',
    description: 'Server-side frameworks, APIs, and services.',
    tracks: [
      { name: 'Spring Boot', language: 'java', color: '#6db33f', docsUrl: 'https://spring.io/projects/spring-boot', modules: M_FRAMEWORK },
      { name: 'Node.js (Express)', language: 'javascript', color: '#339933', docsUrl: 'https://expressjs.com/', modules: M_FRAMEWORK },
      { name: 'NestJS', language: 'typescript', color: '#e0234e', docsUrl: 'https://docs.nestjs.com/', modules: M_FRAMEWORK },
      { name: 'Django', language: 'python', color: '#092e20', docsUrl: 'https://docs.djangoproject.com/', modules: M_FRAMEWORK },
      { name: 'FastAPI', language: 'python', color: '#009688', docsUrl: 'https://fastapi.tiangolo.com/', modules: M_FRAMEWORK },
      { name: 'ASP.NET Core', language: 'csharp', color: '#512bd4', docsUrl: 'https://learn.microsoft.com/aspnet/core', modules: M_FRAMEWORK },
      { name: 'Laravel', language: 'php', color: '#ff2d20', docsUrl: 'https://laravel.com/docs', modules: M_FRAMEWORK },
    ],
  },
  {
    name: 'Frontend', icon: 'frontend', color: '#0ea5e9',
    description: 'Build user interfaces for the web.',
    tracks: [
      { name: 'HTML & CSS', language: 'html', color: '#e34f26', docsUrl: 'https://developer.mozilla.org/docs/Web/HTML', modules: ['HTML Basics', 'CSS Fundamentals', 'Layout (Flexbox & Grid)', 'Responsive Design', 'Advanced CSS'] },
      { name: 'React', language: 'javascript', color: '#61dafb', docsUrl: 'https://react.dev/', modules: M_FRAMEWORK },
      { name: 'Next.js', language: 'typescript', color: '#111827', docsUrl: 'https://nextjs.org/docs', modules: M_FRAMEWORK },
      { name: 'Vue', language: 'javascript', color: '#42b883', docsUrl: 'https://vuejs.org/guide/', modules: M_FRAMEWORK },
      { name: 'Angular', language: 'typescript', color: '#dd0031', docsUrl: 'https://angular.dev/', modules: M_FRAMEWORK },
      { name: 'Tailwind CSS', language: 'html', color: '#06b6d4', docsUrl: 'https://tailwindcss.com/docs', modules: M_STD },
    ],
  },
  {
    name: 'Database', icon: 'database', color: '#f59e0b',
    description: 'SQL, NoSQL, and data modeling.',
    tracks: [
      { name: 'SQL', language: 'sql', color: '#336791', docsUrl: 'https://www.postgresql.org/docs/', modules: M_DB },
      { name: 'MongoDB', language: 'javascript', color: '#47a248', docsUrl: 'https://www.mongodb.com/docs/', modules: M_STD },
      { name: 'Redis', language: 'text', color: '#dc382d', docsUrl: 'https://redis.io/docs/', modules: M_STD },
      { name: 'Prisma ORM', language: 'typescript', color: '#2d3748', docsUrl: 'https://www.prisma.io/docs', modules: M_STD },
    ],
  },
  {
    name: 'Mobile', icon: 'mobile', color: '#ec4899',
    description: 'Native and cross-platform mobile apps.',
    tracks: [
      { name: 'Android (Kotlin)', language: 'kotlin', color: '#3ddc84', docsUrl: 'https://developer.android.com/', modules: M_FRAMEWORK },
      { name: 'Flutter', language: 'dart', color: '#02569b', docsUrl: 'https://docs.flutter.dev/', modules: M_FRAMEWORK },
      { name: 'React Native', language: 'javascript', color: '#61dafb', docsUrl: 'https://reactnative.dev/', modules: M_FRAMEWORK },
      { name: 'SwiftUI (iOS)', language: 'swift', color: '#fa7343', docsUrl: 'https://developer.apple.com/documentation/swiftui', modules: M_FRAMEWORK },
    ],
  },
  {
    name: 'DevOps & Cloud', icon: 'devops', color: '#8b5cf6',
    description: 'Ship, run, and scale software.',
    tracks: [
      { name: 'Git', language: 'bash', color: '#f05032', docsUrl: 'https://git-scm.com/doc', modules: M_STD },
      { name: 'Linux & Bash', language: 'bash', color: '#4eaa25', docsUrl: 'https://www.gnu.org/software/bash/manual/', modules: M_STD },
      { name: 'Docker', language: 'dockerfile', color: '#2496ed', docsUrl: 'https://docs.docker.com/', modules: M_STD },
      { name: 'Kubernetes', language: 'yaml', color: '#326ce5', docsUrl: 'https://kubernetes.io/docs/home/', modules: M_STD },
    ],
  },
  {
    name: 'Algorithms & DS', icon: 'algorithms', color: '#ef4444',
    description: 'Problem-solving with data structures and algorithms.',
    tracks: [
      { name: 'Data Structures & Algorithms', language: 'python', color: '#ef4444', modules: M_ALGO, level: 'INTERMEDIATE' },
    ],
  },
  {
    name: 'Game & Graphics', icon: 'game', color: '#14b8a6',
    description: 'Game programming and computer graphics.',
    tracks: [
      { name: 'OpenGL', language: 'cpp', color: '#5586a4', docsUrl: 'https://www.khronos.org/opengl/', modules: M_STD, level: 'ADVANCED' },
      { name: 'Unity (C#)', language: 'csharp', color: '#222c37', docsUrl: 'https://docs.unity3d.com/', modules: M_FRAMEWORK },
    ],
  },
  {
    name: 'Web & Networking', icon: 'web', color: '#64748b',
    description: 'How the web actually works.',
    tracks: [
      { name: 'REST APIs', language: 'text', color: '#64748b', modules: M_STD },
      { name: 'GraphQL', language: 'graphql', color: '#e10098', docsUrl: 'https://graphql.org/learn/', modules: M_STD },
    ],
  },
];

// ── Sample fully-worked exercises (NTU-style) ────────────────────────────────
const SAMPLE_EXERCISES = [
  {
    trackSlug: slugify('Java Core'), moduleName: 'OOP',
    title: 'The Circle Class', difficulty: 'EASY', points: 10, estimatedMinutes: 20,
    concepts: ['classes', 'instance variables', 'constructors', 'getters', 'methods'],
    prerequisites: ['variables', 'data types'],
    problemHtml:
      '<p>Design a class named <code>Circle</code> that models a circle with a radius and a color.</p>' +
      '<ul><li>Two <strong>private</strong> instance variables: <code>radius</code> (<code>double</code>, default <code>1.0</code>) and <code>color</code> (<code>String</code>, default <code>"red"</code>).</li>' +
      '<li>Two overloaded constructors: a no-arg constructor, and one that takes a <code>double</code> for the radius.</li>' +
      '<li>Two public methods: <code>getRadius()</code> and <code>getArea()</code>, returning the radius and the area of this instance.</li></ul>' +
      '<p>Then write a test program <code>TestCircle</code> that constructs a few circles and prints their radius and area.</p>',
    inputSpec: 'None (this is a class-design exercise driven by a test program).',
    outputSpec: 'The radius and area of each Circle instance, printed to standard output.',
    constraints: 'radius >= 0. Use Math.PI for the area.',
    examples: [
      { input: 'new Circle()', output: 'radius = 1.0, area = 3.141592653589793', explanation: 'The no-arg constructor uses the default radius 1.0.' },
      { input: 'new Circle(2.0)', output: 'radius = 2.0, area = 12.566370614359172', explanation: 'Area = π × r² = π × 4.' },
    ],
    hints: [
      'Declare the fields as private so they cannot be accessed from outside the class.',
      'The no-arg constructor should set radius = 1.0 and color = "red".',
      'getArea() returns radius * radius * Math.PI.',
    ],
    starterCode: [{ name: 'Circle.java', language: 'java', code: 'public class Circle {\n    // TODO: declare private fields radius and color\n\n    // TODO: no-arg constructor (radius = 1.0, color = "red")\n\n    // TODO: constructor with a double radius\n\n    // TODO: getRadius()\n\n    // TODO: getArea()\n}\n' }],
    solutionCode: [{
      name: 'Circle.java', language: 'java', code:
        'public class Circle {\n    private double radius;\n    private String color;\n\n    public Circle() {           // 1st (default) constructor\n        radius = 1.0;\n        color = "red";\n    }\n\n    public Circle(double radius) { // 2nd constructor\n        this.radius = radius;\n        color = "red";\n    }\n\n    public double getRadius() {\n        return radius;\n    }\n\n    public double getArea() {\n        return radius * radius * Math.PI;\n    }\n}\n'
    }, {
      name: 'TestCircle.java', language: 'java', code:
        'public class TestCircle {\n    public static void main(String[] args) {\n        Circle c1 = new Circle();\n        System.out.println("radius = " + c1.getRadius() + ", area = " + c1.getArea());\n\n        Circle c2 = new Circle(2.0);\n        System.out.println("radius = " + c2.getRadius() + ", area = " + c2.getArea());\n    }\n}\n'
    }],
    solutionExplanationHtml:
      '<p>The two <code>private</code> fields enforce encapsulation. The overloaded constructors let callers build a circle with or without an explicit radius; <code>this.radius = radius</code> disambiguates the field from the parameter. <code>getArea()</code> applies the formula <code>π·r²</code> using <code>Math.PI</code>.</p>',
    tags: ['oop', 'classes', 'java'],
    referenceUrl: 'https://www3.ntu.edu.sg/home/ehchua/programming/java/J3f_OOPExercises.html',
  },
  {
    trackSlug: slugify('Java Core'), moduleName: 'OOP',
    title: 'The Rectangle Class', difficulty: 'EASY', points: 10, estimatedMinutes: 20,
    concepts: ['classes', 'constructors', 'getters and setters', 'toString'],
    prerequisites: ['classes', 'instance variables'],
    problemHtml:
      '<p>Design a class named <code>Rectangle</code> with two <code>private</code> instance variables <code>length</code> and <code>width</code> (both <code>double</code>, default <code>1.0</code>).</p>' +
      '<ul><li>A no-arg constructor and a constructor taking <code>length</code> and <code>width</code>.</li>' +
      '<li>Getters and setters for both fields.</li>' +
      '<li>Methods <code>getArea()</code> and <code>getPerimeter()</code>.</li>' +
      '<li>A <code>toString()</code> returning <code>"Rectangle[length=?,width=?]"</code>.</li></ul>',
    inputSpec: 'None (class-design exercise).',
    outputSpec: 'The area, perimeter and string form of Rectangle instances.',
    constraints: 'length, width >= 0.',
    examples: [
      { input: 'new Rectangle(3.0, 4.0)', output: 'area = 12.0, perimeter = 14.0, Rectangle[length=3.0,width=4.0]', explanation: 'area = l×w; perimeter = 2(l+w).' },
    ],
    hints: [
      'Perimeter of a rectangle is 2 × (length + width).',
      'toString() should build the string exactly as specified, including the field values.',
    ],
    starterCode: [{ name: 'Rectangle.java', language: 'java', code: 'public class Rectangle {\n    // TODO: private double length, width (default 1.0)\n\n    // TODO: constructors, getters/setters\n\n    // TODO: getArea(), getPerimeter(), toString()\n}\n' }],
    solutionCode: [{
      name: 'Rectangle.java', language: 'java', code:
        'public class Rectangle {\n    private double length = 1.0;\n    private double width = 1.0;\n\n    public Rectangle() { }\n\n    public Rectangle(double length, double width) {\n        this.length = length;\n        this.width = width;\n    }\n\n    public double getLength() { return length; }\n    public void setLength(double length) { this.length = length; }\n    public double getWidth() { return width; }\n    public void setWidth(double width) { this.width = width; }\n\n    public double getArea() { return length * width; }\n    public double getPerimeter() { return 2 * (length + width); }\n\n    @Override\n    public String toString() {\n        return "Rectangle[length=" + length + ",width=" + width + "]";\n    }\n}\n'
    }],
    solutionExplanationHtml:
      '<p>Fields default to <code>1.0</code> via field initializers, so the no-arg constructor needs no body. <code>getArea()</code> and <code>getPerimeter()</code> apply the standard formulas, and <code>toString()</code> yields a self-descriptive representation used implicitly by <code>System.out.println(rect)</code>.</p>',
    tags: ['oop', 'classes', 'java'],
    referenceUrl: 'https://www3.ntu.edu.sg/home/ehchua/programming/java/J3f_OOPExercises.html',
  },
];

async function main() {
  console.log(APPLY ? '── Code Lab seed: APPLYING ──' : '── Code Lab seed: DRY-RUN (use --apply to write) ──');
  let gCreated = 0, tCreated = 0, mCreated = 0, eCreated = 0;

  for (let gi = 0; gi < GROUPS.length; gi++) {
    const g = GROUPS[gi];
    const gSlug = slugify(g.name);
    let group = await prisma.codeGroup.findUnique({ where: { slug: gSlug } });
    if (!group) {
      console.log(`  + group  ${g.name}`);
      gCreated++;
      if (APPLY) group = await prisma.codeGroup.create({ data: { name: g.name, slug: gSlug, description: g.description, icon: g.icon, color: g.color, sortOrder: gi } });
    }
    if (!group) continue; // dry-run

    for (let ti = 0; ti < g.tracks.length; ti++) {
      const t = g.tracks[ti];
      const tSlug = slugify(t.name);
      let track = await prisma.codeTrack.findUnique({ where: { slug: tSlug } });
      if (!track) {
        console.log(`    + track  ${t.name}`);
        tCreated++;
        if (APPLY) track = await prisma.codeTrack.create({
          data: { groupId: group.id, name: t.name, slug: tSlug, language: t.language, color: t.color, docsUrl: t.docsUrl || null, level: t.level || 'BEGINNER', sortOrder: ti, status: 'PUBLISHED' },
        });
      }
      if (!track) continue;

      const mods = t.modules || M_STD;
      for (let mi = 0; mi < mods.length; mi++) {
        const mName = mods[mi];
        const mSlug = slugify(mName);
        const existing = await prisma.codeModule.findFirst({ where: { trackId: track.id, slug: mSlug } });
        if (!existing) {
          mCreated++;
          const level = mi < mods.length / 3 ? 'BEGINNER' : mi < (2 * mods.length) / 3 ? 'INTERMEDIATE' : 'ADVANCED';
          if (APPLY) await prisma.codeModule.create({ data: { trackId: track.id, name: mName, slug: mSlug, level, sortOrder: mi } });
        }
      }
    }
  }

  // Sample exercises
  for (const s of SAMPLE_EXERCISES) {
    const track = await prisma.codeTrack.findUnique({ where: { slug: s.trackSlug } });
    if (!track) { if (APPLY) console.log(`  ! sample skipped (track ${s.trackSlug} missing): ${s.title}`); continue; }
    const mod = await prisma.codeModule.findFirst({ where: { trackId: track.id, slug: slugify(s.moduleName) } });
    if (!mod) { if (APPLY) console.log(`  ! sample skipped (module ${s.moduleName} missing): ${s.title}`); continue; }
    const exSlug = slugify(s.title);
    const exists = await prisma.codeExercise.findUnique({ where: { slug: exSlug } });
    if (exists) continue;
    eCreated++;
    console.log(`    + exercise  ${s.title}`);
    if (APPLY) {
      await prisma.codeExercise.create({
        data: {
          moduleId: mod.id, trackId: track.id, title: s.title, slug: exSlug, difficulty: s.difficulty,
          language: track.language, status: 'PUBLISHED', sortOrder: 0, points: s.points, estimatedMinutes: s.estimatedMinutes,
          problemHtml: s.problemHtml, concepts: s.concepts, prerequisites: s.prerequisites,
          inputSpec: s.inputSpec, outputSpec: s.outputSpec, constraints: s.constraints,
          examplesJson: s.examples, hintsJson: s.hints, starterCodeJson: s.starterCode, solutionCodeJson: s.solutionCode,
          solutionExplanationHtml: s.solutionExplanationHtml, tags: s.tags, referenceUrl: s.referenceUrl || null,
        },
      });
    }
  }

  console.log(`\nGroups +${gCreated}, Tracks +${tCreated}, Modules +${mCreated}, Exercises +${eCreated}`);
  console.log(APPLY ? 'Done.' : 'Dry-run only — re-run with --apply to write.');
  await prisma.$disconnect();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
