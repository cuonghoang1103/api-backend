// Building a query string by hand breaks on spaces, accents and "&". URLSearchParams encodes for you.
const search = 'bút & sổ tay';
console.log('by hand :', '/api/products?q=' + search + '&page=2');

const params = new URLSearchParams({ q: search, page: 2, sort: '-price' });
console.log('encoded :', '/api/products?' + params.toString());

// reading it back (what the server does)
const url = new URL('https://shop.example/api/products?q=b%C3%BAt+%26+s%E1%BB%95+tay&page=2&tag=a&tag=b');
console.log('q       :', url.searchParams.get('q'));
console.log('page    :', url.searchParams.get('page'), typeof url.searchParams.get('page'));
console.log('tag     :', url.searchParams.getAll('tag'));
console.log('missing :', url.searchParams.get('limit'));

// a path segment is encoded differently from a query value
console.log('segment :', '/api/users/' + encodeURIComponent('Đức Anh/1'));
