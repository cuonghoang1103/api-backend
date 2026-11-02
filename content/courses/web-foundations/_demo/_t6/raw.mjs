// chay: tay — HTTP is just text: open a TCP connection and type a request by hand (Node 22). Needs server.mjs running.
import net from 'node:net';

const request =
  'GET /api/products/3 HTTP/1.1\r\n' +     // method, path, version
  'Host: localhost:3456\r\n' +             // which site
  'Accept: application/json\r\n' +         // what we would like back
  'Connection: close\r\n' +                // close when done
  '\r\n';                                  // an empty line ends the headers

console.log('--- what we sent, character for character ---');
console.log(request.replaceAll('\r\n', '\n'));
const socket = net.connect(3456, 'localhost', () => socket.write(request));
let response = '';
socket.on('data', (chunk) => (response += chunk));
socket.on('end', () => {
  console.log('--- what came back ---');
  console.log(response.replaceAll('\r\n', '\n').replace(/^Date: .*\n/m, 'Date: (removed)\n'));
});
