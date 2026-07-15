/**
 * CV Builder — IT skill/technology dictionary (Phase 8).
 * A curated lexicon used to extract required skills from a pasted job
 * description deterministically (no LLM needed for the basic pass) and to match
 * them against the candidate's evidence. Not exhaustive — high-signal terms an
 * interviewer would actually probe. Admin-editable later (per spec).
 *
 * Each entry: canonical name + aliases (matched case-insensitively as whole
 * tokens). Category informs the coverage view grouping.
 */
export interface TechTerm { name: string; aliases: string[]; category: string }

export const TECH_TERMS: TechTerm[] = [
  // Languages
  { name: 'JavaScript', aliases: ['javascript', 'js'], category: 'LANGUAGE' },
  { name: 'TypeScript', aliases: ['typescript', 'ts'], category: 'LANGUAGE' },
  { name: 'Python', aliases: ['python'], category: 'LANGUAGE' },
  { name: 'Java', aliases: ['java'], category: 'LANGUAGE' },
  { name: 'Go', aliases: ['golang', 'go lang'], category: 'LANGUAGE' }, // "go" alone too noisy
  { name: 'C#', aliases: ['c#', 'csharp', '.net', 'dotnet'], category: 'LANGUAGE' },
  { name: 'C++', aliases: ['c++', 'cpp'], category: 'LANGUAGE' },
  { name: 'PHP', aliases: ['php'], category: 'LANGUAGE' },
  { name: 'Ruby', aliases: ['ruby'], category: 'LANGUAGE' },
  { name: 'Rust', aliases: ['rust'], category: 'LANGUAGE' },
  { name: 'Kotlin', aliases: ['kotlin'], category: 'LANGUAGE' },
  { name: 'Swift', aliases: ['swift'], category: 'LANGUAGE' },
  { name: 'Scala', aliases: ['scala'], category: 'LANGUAGE' },
  { name: 'SQL', aliases: ['sql'], category: 'LANGUAGE' },
  // Frameworks / libraries
  { name: 'React', aliases: ['react', 'react.js', 'reactjs'], category: 'FRAMEWORK' },
  { name: 'Next.js', aliases: ['next.js', 'nextjs'], category: 'FRAMEWORK' },
  { name: 'Vue', aliases: ['vue', 'vue.js', 'vuejs'], category: 'FRAMEWORK' },
  { name: 'Angular', aliases: ['angular'], category: 'FRAMEWORK' },
  { name: 'Node.js', aliases: ['node.js', 'nodejs', 'node'], category: 'FRAMEWORK' },
  { name: 'Express', aliases: ['express', 'express.js'], category: 'FRAMEWORK' },
  { name: 'NestJS', aliases: ['nestjs', 'nest.js'], category: 'FRAMEWORK' },
  { name: 'Spring', aliases: ['spring', 'spring boot', 'springboot'], category: 'FRAMEWORK' },
  { name: 'Django', aliases: ['django'], category: 'FRAMEWORK' },
  { name: 'Flask', aliases: ['flask'], category: 'FRAMEWORK' },
  { name: 'FastAPI', aliases: ['fastapi'], category: 'FRAMEWORK' },
  { name: 'Laravel', aliases: ['laravel'], category: 'FRAMEWORK' },
  { name: 'Rails', aliases: ['rails', 'ruby on rails'], category: 'FRAMEWORK' },
  { name: 'GraphQL', aliases: ['graphql'], category: 'FRAMEWORK' },
  { name: 'gRPC', aliases: ['grpc'], category: 'FRAMEWORK' },
  { name: 'React Native', aliases: ['react native'], category: 'FRAMEWORK' },
  { name: 'Flutter', aliases: ['flutter'], category: 'FRAMEWORK' },
  { name: 'Tailwind', aliases: ['tailwind', 'tailwindcss'], category: 'FRAMEWORK' },
  // Databases
  { name: 'PostgreSQL', aliases: ['postgresql', 'postgres'], category: 'DATABASE' },
  { name: 'MySQL', aliases: ['mysql'], category: 'DATABASE' },
  { name: 'MongoDB', aliases: ['mongodb', 'mongo'], category: 'DATABASE' },
  { name: 'Redis', aliases: ['redis'], category: 'DATABASE' },
  { name: 'Elasticsearch', aliases: ['elasticsearch', 'elastic search'], category: 'DATABASE' },
  { name: 'DynamoDB', aliases: ['dynamodb'], category: 'DATABASE' },
  { name: 'Cassandra', aliases: ['cassandra'], category: 'DATABASE' },
  { name: 'SQLite', aliases: ['sqlite'], category: 'DATABASE' },
  { name: 'Kafka', aliases: ['kafka'], category: 'DATABASE' },
  { name: 'RabbitMQ', aliases: ['rabbitmq'], category: 'DATABASE' },
  { name: 'Prisma', aliases: ['prisma'], category: 'DATABASE' },
  // Infra / DevOps / cloud
  { name: 'Docker', aliases: ['docker'], category: 'INFRA' },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s'], category: 'INFRA' },
  { name: 'AWS', aliases: ['aws', 'amazon web services'], category: 'INFRA' },
  { name: 'GCP', aliases: ['gcp', 'google cloud'], category: 'INFRA' },
  { name: 'Azure', aliases: ['azure'], category: 'INFRA' },
  { name: 'Terraform', aliases: ['terraform'], category: 'INFRA' },
  { name: 'Ansible', aliases: ['ansible'], category: 'INFRA' },
  { name: 'Nginx', aliases: ['nginx'], category: 'INFRA' },
  { name: 'CI/CD', aliases: ['ci/cd', 'cicd', 'continuous integration'], category: 'INFRA' },
  { name: 'GitHub Actions', aliases: ['github actions'], category: 'INFRA' },
  { name: 'Jenkins', aliases: ['jenkins'], category: 'INFRA' },
  { name: 'Linux', aliases: ['linux'], category: 'INFRA' },
  { name: 'Serverless', aliases: ['serverless', 'lambda'], category: 'INFRA' },
  { name: 'Prometheus', aliases: ['prometheus'], category: 'INFRA' },
  { name: 'Grafana', aliases: ['grafana'], category: 'INFRA' },
  // Practices / concepts
  { name: 'Microservices', aliases: ['microservices', 'microservice'], category: 'PRACTICE' },
  { name: 'REST', aliases: ['rest', 'restful', 'rest api'], category: 'PRACTICE' },
  { name: 'System Design', aliases: ['system design'], category: 'PRACTICE' },
  { name: 'TDD', aliases: ['tdd', 'test-driven'], category: 'PRACTICE' },
  { name: 'Agile', aliases: ['agile', 'scrum'], category: 'PRACTICE' },
  { name: 'CI', aliases: ['unit testing', 'integration testing'], category: 'PRACTICE' },
  { name: 'WebSocket', aliases: ['websocket', 'websockets', 'socket.io'], category: 'PRACTICE' },
  { name: 'OAuth', aliases: ['oauth', 'oauth2', 'jwt'], category: 'PRACTICE' },
];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Extract the canonical tech terms present in a blob of text (whole-token). */
export function extractTechTerms(text: string): string[] {
  const hay = ` ${String(text).toLowerCase()} `;
  const found = new Set<string>();
  for (const t of TECH_TERMS) {
    for (const a of t.aliases) {
      // Word-ish boundary that tolerates the symbols in c#, c++, ci/cd, node.js.
      const re = new RegExp(`(^|[^a-z0-9+#./])${escapeRe(a)}([^a-z0-9+#/]|$)`, 'i');
      if (re.test(hay)) { found.add(t.name); break; }
    }
  }
  return [...found];
}

/** True if a canonical term (or any alias) appears in the text. */
export function textHasTerm(text: string, canonical: string): boolean {
  const term = TECH_TERMS.find((t) => t.name === canonical);
  const aliases = term ? term.aliases : [canonical.toLowerCase()];
  const hay = ` ${String(text).toLowerCase()} `;
  return aliases.some((a) => new RegExp(`(^|[^a-z0-9+#./])${escapeRe(a)}([^a-z0-9+#/]|$)`, 'i').test(hay));
}

export function categoryOf(canonical: string): string {
  return TECH_TERMS.find((t) => t.name === canonical)?.category ?? 'OTHER';
}
