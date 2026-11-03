export type Plan = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';

function assertNever(x: never): never {
  throw new Error('Unhandled plan: ' + String(x));
}

export function price(plan: Plan): number {
  switch (plan) {
    case 'FREE': return 0;
    case 'PRO': return 9;
    case 'TEAM': return 29;
    case 'ENTERPRISE': return 99;
    default: return assertNever(plan);
  }
}

console.log(price('ENTERPRISE'));
