/**
 * Tiện ích dùng chung cho các chương khoá "Tiếng Anh kỹ thuật khi đi làm" (tak-*).
 * mau(): khối mẫu văn bản thật (email, ticket, log…) — tự thoát ký tự HTML.
 * saiDung(): bảng "Viết sai → Viết đúng → Vì sao".
 * tuVung(): bảng 🗂 cụm từ (cụm · nghĩa · câu ví dụ).
 * Q(): một câu quiz (song ngữ "EN|||VI").
 */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const mau = (s, nhan = '') =>
  (nhan ? `<p class="note-ct">${nhan}</p>` : '') + `<pre><code>${esc(String(s).replace(/^\n/, '').replace(/\n\s*$/, ''))}</code></pre>`;

export const saiDung = (hang, en) => `
<table>
<thead><tr><th>${en ? 'What people write' : 'Hay viết'}</th><th>${en ? 'Better' : 'Nên viết'}</th><th>${en ? 'Why' : 'Vì sao'}</th></tr></thead>
<tbody>
${hang.map(([a, b, c]) => `<tr><td>❌ ${a}</td><td>✅ ${b}</td><td>${c}</td></tr>`).join('\n')}
</tbody>
</table>`;

export const tuVung = (hang, en) => `
<h3>🗂 ${en ? 'Phrases to keep' : 'Cụm từ cần giữ'}</h3>
<table>
<thead><tr><th>${en ? 'Phrase' : 'Cụm từ'}</th><th>${en ? 'Meaning' : 'Nghĩa'}</th><th>${en ? 'Example' : 'Ví dụ'}</th></tr></thead>
<tbody>
${hang.map(([a, b, c]) => `<tr><td><strong>${a}</strong></td><td>${b}</td><td><em>${c}</em></td></tr>`).join('\n')}
</tbody>
</table>`;

export const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
