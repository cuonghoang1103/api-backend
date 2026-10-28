// pool.js — pool kết nối tí hon, cùng hành vi với Pool của node-postgres: tối đa `max` kết nối; hết thì người xin
// XẾP HÀNG (FIFO); connectionTimeoutMillis = 0 (mặc định của pg) nghĩa là chờ MÃI. "Truy vấn" = chờ `ms` mili giây.
class Pool {
  constructor({ max, connectionTimeoutMillis = 0 }) { this.max = max; this.timeout = connectionTimeoutMillis; this.inUse = 0; this.queue = []; }
  connect() {
    if (this.inUse < this.max) { this.inUse++; return Promise.resolve(this.#client()); }
    return new Promise((resolve, reject) => {
      const w = { resolve };
      if (this.timeout) w.timer = setTimeout(() => {
        this.queue.splice(this.queue.indexOf(w), 1);
        reject(new Error('timeout exceeded when trying to connect'));
      }, this.timeout);
      this.queue.push(w);
    });
  }
  #client() {
    return { query: (ms) => new Promise((r) => setTimeout(r, ms)), release: () => this.#release() };
  }
  #release() {
    const w = this.queue.shift();
    if (w) { clearTimeout(w.timer); w.resolve(this.#client()); } else this.inUse--;
  }
  async query(ms) { const c = await this.connect(); try { return await c.query(ms); } finally { c.release(); } }
  stats() { return `${this.inUse} in use, ${this.max - this.inUse} idle, ${this.queue.length} waiting`; }
}
module.exports = { Pool };
