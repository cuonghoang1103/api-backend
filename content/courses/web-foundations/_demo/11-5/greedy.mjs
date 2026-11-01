const html = '<b>bold</b> and <i>italic</i>';
console.log('greedy .+  :', html.match(/<.+>/)[0]);
console.log('lazy   .+? :', html.match(/<.+?>/)[0]);
console.log('all tags   :', html.match(/<[^>]+>/g));
