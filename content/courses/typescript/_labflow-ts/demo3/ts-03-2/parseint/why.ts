// Why tsc accepts it: write both function types down and compare them.
type MapCallback = (value: string, index: number, array: string[]) => number;
type ParseInt = (string: string, radix?: number) => number;

const parse: ParseInt = parseInt;
const asCallback: MapCallback = parse;   // radix? receives the index: 0, 1, 2, 3
console.log(['07', '08', '09', '10'].map((h, i) => 'parseInt("' + h + '", ' + i + ') = ' + asCallback(h, i, [])).join('\n'));
