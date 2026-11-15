// Valid Parentheses — watch the stack of open brackets grow and shrink.
// Change S below and run again. Codes: ( [ {  are shown by their position in S.
const S = '{[()]}(';
const input = new Array1DTracer('S (position i)');
const st = new Array1DTracer('stack (positions of still-open brackets, top = right)');
const log = new LogTracer('what happens');
const pair = { ')': '(', ']': '[', '}': '{' };
const pos = [];
for (let i = 0; i < S.length; i++) pos.push(i);
input.set(pos);
st.set([]);
log.println('S = ' + S + '   rule: every closer must match the MOST RECENT open bracket');
Tracer.delay();
const stack = [];
let ok = true;
for (let i = 0; i < S.length && ok; i++) {
  const c = S[i];
  input.select(i);
  if (c === '(' || c === '[' || c === '{') {
    stack.push(i);
    st.set(stack);
    log.println('i=' + i + "  '" + c + "' is an opener -> push. open now: " + stack.map(function (k) { return S[k]; }).join(''));
  } else if (stack.length === 0) {
    ok = false;
    log.println('i=' + i + "  '" + c + "' but nothing is open -> INVALID");
  } else {
    const top = stack[stack.length - 1];
    st.select(stack.length - 1);
    Tracer.delay();
    if (S[top] === pair[c]) {
      stack.pop();
      st.set(stack);
      log.println('i=' + i + "  '" + c + "' closes '" + S[top] + "' (top) -> pop. open now: " + (stack.map(function (k) { return S[k]; }).join('') || '(none)'));
    } else {
      ok = false;
      log.println('i=' + i + "  '" + c + "' but top is '" + S[top] + "' -> INVALID");
    }
  }
  Tracer.delay();
  input.deselect(i);
}
if (ok && stack.length > 0) { ok = false; log.println('end of string, but ' + stack.length + ' bracket(s) still open -> INVALID'); }
log.println('answer: ' + (ok ? 'valid' : 'invalid'));
Tracer.delay();
