// No annotation inside the callbacks: the Rule[] type flows into them (contextual typing).
import { endAfterStart, notTooLong, maxSeats } from '../rules/rules.ts';
import type { Problem, Rule } from '../rules/rules.ts';

const RULES: readonly Rule[] = [endAfterStart, notTooLong, maxSeats(40)];
const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '13:00' } as const;

export const results = RULES.map((rule) => rule(input));                 // (Problem | null)[]
export const problems = results.filter((p) => p !== null);               // Problem[] — tsc 5.5+ infers the check
export const codes = problems.map((p) => p.code);                         // ProblemCode[]
export const firstMessage: string | undefined = problems[0]?.message;

const strict: Problem[] = problems;
console.log(codes, firstMessage, strict.length);
