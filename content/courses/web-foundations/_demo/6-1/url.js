// Every part of a URL has a name. The browser's URL object splits it for you.
const url = new URL('https://shop.example:8443/api/products/3?sort=price&page=2#reviews');

console.log('protocol :', url.protocol);   // how to talk
console.log('hostname :', url.hostname);   // which machine (DNS turns it into an IP)
console.log('port     :', url.port);       // which door on that machine
console.log('origin   :', url.origin);     // protocol + host + port
console.log('pathname :', url.pathname);   // which resource
console.log('search   :', url.search);     // options for the server
console.log('hash     :', url.hash);       // stays in the browser, never sent

// default ports are hidden
console.log('default  :', new URL('https://shop.example:443/').port === '' ? 'port 443 is the default, so it is empty' : 'not empty');

// a relative URL is resolved against a base, like a link in a page
console.log('relative :', new URL('../cart?step=1', 'https://shop.example/api/products/3').href);
