export type Plan = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'; // a new plan arrives

function assertNever(x: never): never {
  throw new Error('Unhandled plan: ' + String(x));
}

export function price(plan: Plan): number {
  switch (plan) {
    case 'FREE': return 0;
    case 'PRO': return 9;
    case 'TEAM': return 29;
    default: return assertNever(plan);
  }
}
