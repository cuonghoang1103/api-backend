// @ts-check
// Still a .js file: the types live in JSDoc comments, and tsc checks them.
/**
 * @param {number} startMinute
 * @param {number} length
 * @returns {number}
 */
function endMinute(startMinute, length) {
  return startMinute + length;
}

console.log(endMinute('480', 120));
