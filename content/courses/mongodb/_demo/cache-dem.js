// Bài 10.3 — một dòng tình trạng cache WiredTiger: đang dùng bao nhiêu, đã phải đọc bao nhiêu trang từ tệp vào cache.
const c = db.serverStatus().wiredTiger.cache, MiB = (x) => (x / 2 ** 20).toFixed(0);
print(`cache ${MiB(c['bytes currently in the cache'])} / ${MiB(c['maximum bytes configured'])} MiB | trang đọc từ tệp vào cache: ${c['pages read into cache']} | trang được hỏi: ${c['pages requested from the cache']}`);
