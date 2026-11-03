// What the browser reads from one address before it does anything else
const url = new URL('https://cuongthai.com:443/courses/web-foundations/learn?lessonSlug=wf-0-2&lang=vi#journey');

console.log('protocol:', url.protocol);   // how to talk
console.log('hostname:', url.hostname);   // which machine (a name, turned into an IP by DNS)
console.log('port:', url.port || '(default for https = 443)');
console.log('pathname:', url.pathname);   // which resource on that machine
console.log('search:', url.search);       // extra options for the server
console.log('lessonSlug =', url.searchParams.get('lessonSlug'));
console.log('hash:', url.hash);           // stays in the browser, never sent to the server
console.log('origin:', url.origin);       // protocol + host + port
