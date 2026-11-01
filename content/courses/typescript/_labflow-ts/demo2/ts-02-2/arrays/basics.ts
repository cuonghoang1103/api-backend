// Two spellings of the same array type, and what tsc infers on its own.
const labs: string[] = ['BE-201', 'BE-202'];
const starts: Array<number> = [480, 600];
const mixed = ['BE-201', 480];              // inferred: (string | number)[]

labs.push('AL-301');                          // fine: a string
labs.push(301);                               // a number in a list of strings
starts.push('08:00');                         // a string in a list of numbers
const first: string = mixed[0];               // could be a number
