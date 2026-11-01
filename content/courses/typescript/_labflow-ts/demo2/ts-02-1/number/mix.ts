// bigint and number do not mix, and tsc knows it.
const id: bigint = 9007199254740993n;
const next = id + 1;
const asNumber: number = id;
const fixedNext = id + 1n;
const fixedText: string = id.toString();
