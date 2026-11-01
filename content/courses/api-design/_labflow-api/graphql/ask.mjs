// graphql/ask.mjs — gửi một câu GraphQL, in kích thước câu trả lời và số lần hỏi CSDL phía server
// node graphql/ask.mjs '<query>' [--show]
const [query, flag] = process.argv.slice(2);
const res = await fetch('http://localhost:4001/graphql', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/graphql-response+json' },
  body: JSON.stringify({ query }),
});
const text = await res.text();
const { dbCalls } = await (await fetch('http://localhost:4001/stats')).json();
console.log(`HTTP ${res.status} · ${text.length} byte · ${dbCalls} lần hỏi CSDL`);
if (flag === '--show') console.log(text);   // câu trả lời nguyên văn (JSON một dòng)
