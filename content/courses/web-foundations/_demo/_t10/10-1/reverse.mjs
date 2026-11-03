// Lesson 10.1 — "reverse the words": the plan that works for the simple case, then the edge cases
function reverseWordsV1(sentence) {
  return sentence.split(' ').reverse().join(' ');          // step 2 of the plan, typed directly
}

function reverseWords(sentence) {
  const words = sentence.trim().split(/\s+/);              // any run of spaces/tabs is ONE separator
  if (words.length === 1 && words[0] === '') return '';    // "" and "   " have no words
  return words.reverse().join(' ');
}

const cases = ['the sky is blue', '  the   sky  ', '', 'hello', 'one\ttwo'];
for (const s of cases) {
  console.log(JSON.stringify(s).padEnd(18), '→ v1', JSON.stringify(reverseWordsV1(s)).padEnd(18), '→ final', JSON.stringify(reverseWords(s)));
}
