const body = '{"lab":"BE-201","seats":31}';

const raw = JSON.parse(body);        // hover it: any
const total: number = raw.seatz * 2; // typo, and tsc says nothing

console.log('total =', total);
