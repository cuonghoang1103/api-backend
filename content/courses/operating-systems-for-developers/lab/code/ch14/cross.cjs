// cross.cjs — đường dẫn và xuống dòng nhìn từ Node trên từng hệ điều hành (Chương 14, bài 14.8).
// path.win32 / path.posix chạy được trên MỌI máy: thử luật đường dẫn Windows ngay trên Mac/Linux.
const path = require('path');
const os = require('os');
console.log('platform', process.platform, '| sep', JSON.stringify(path.sep), '| delimiter', JSON.stringify(path.delimiter), '| EOL', JSON.stringify(os.EOL));
console.log('path.join        ', path.join('src', 'main', '..', 'config', 'app.json'));
console.log('path.win32.join  ', path.win32.join('src', 'main', '..', 'config', 'app.json'));
console.log('path.posix.join  ', path.posix.join('src', 'main', '..', 'config', 'app.json'));
console.log('win32.resolve    ', path.win32.resolve('C:\\Users\\dev', '..\\Public', 'a.txt'));
console.log('posix.normalize  ', path.posix.normalize('src/config\\app.json'), '  <- the backslash is part of a file name');
console.log('win32.normalize  ', path.win32.normalize('src/config\\app.json'));
console.log('win32.isAbsolute("/etc") =', path.win32.isAbsolute('/etc'), '| posix.isAbsolute("C:\\\\x") =', path.posix.isAbsolute('C:\\x'));
