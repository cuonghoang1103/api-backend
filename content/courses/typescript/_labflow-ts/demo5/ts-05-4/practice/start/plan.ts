export type Plan = 'FREE' | 'PRO' | 'TEAM';

// Return the monthly price. A catch-all hides a new plan — replace it so tsc guards the switch.
export function price(plan: Plan): number {
  switch (plan) {
    case 'FREE': return 0;
    case 'PRO': return 9;
    case 'TEAM': return 29;
    default: return 0;
  }
}

console.log(price('PRO'));
