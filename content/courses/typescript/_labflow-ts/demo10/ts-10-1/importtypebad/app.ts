// Money is a type. Under verbatimModuleSyntax, importing it as a value is refused.
import { Money } from './money.ts';
export const a: Money = { amount: 1, currency: 'USD' };
