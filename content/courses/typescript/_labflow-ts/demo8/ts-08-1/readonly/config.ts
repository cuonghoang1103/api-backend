type Config = { host: string; port: number };

// Readonly<T> freezes every field at the type level.
const cfg: Readonly<Config> = { host: 'localhost', port: 5432 };
const port: number = cfg.port; // reading is fine
cfg.port = 5433;               // reassigning is not
console.log(port);
