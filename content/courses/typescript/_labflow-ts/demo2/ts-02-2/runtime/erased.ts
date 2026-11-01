// readonly lives only in the type. After type stripping it is a normal array.
const shared: readonly number[] = [480, 600];
const sneaky = shared as number[];            // a lie tsc accepts (lesson 1.2)
sneaky.push(720);
console.log('readonly array, after push:', shared);

// Object.freeze is the RUNTIME lock — and tsc already types it as readonly.
const frozen = Object.freeze([480, 600]);     // type: readonly number[]
try {
  (frozen as number[]).push(720);
} catch (e) {
  console.log('frozen array:', (e as Error).constructor.name + ':', (e as Error).message);
}
