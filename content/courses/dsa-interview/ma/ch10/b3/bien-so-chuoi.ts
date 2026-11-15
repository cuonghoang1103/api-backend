// Edge cases for NUMBERS and STRINGS that break code which "obviously works" — printed, not claimed.
// #region bien
const show = (label: string, value: unknown) => console.log(`${label.padEnd(34)} ${String(value)}`);
show("'😀'.length", '😀'.length);                              // UTF-16: one emoji = two code units
show("[...'😀'].length", [...'😀'].length);                    // iterate by code point: 1
show("'😀'.split('').reverse().join('')", JSON.stringify('😀'.split('').reverse().join('')));  // broken halves
show("'Á' === 'Á' (NFC vs NFD)", 'Á' === 'Á');            // same letter on screen, different strings
show("' a '.trim().length", ' a '.trim().length);
show("0.1 + 0.2 === 0.3", 0.1 + 0.2 === 0.3);
show("2 ** 53 + 1 === 2 ** 53", 2 ** 53 + 1 === 2 ** 53);       // past MAX_SAFE_INTEGER integers collide
show("7 / 0", 7 / 0);                                            // no exception in JS
show("-7 % 2", -7 % 2);                                          // sign follows the left operand
show("Math.trunc(-7 / 2)", Math.trunc(-7 / 2));
show("(2147483647 + 1) | 0", (2147483647 + 1) | 0);              // forcing 32-bit: wraps like Java int
show("Math.max()", Math.max());                                  // max of an EMPTY list
// #endregion
