const mongoose = require('mongoose');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function connectDB(options = {}) {
  const DEFAULT_DOCKER_URI = 'mongodb://mongo:27017/schoolhub';
  const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/schoolhub';
  const retries = Number(options.retries ?? 10);
  const delayMs = Number(options.delayMs ?? 2000);

  let uri = process.env.MONGO_URI || DEFAULT_DOCKER_URI;
  if (!process.env.MONGO_URI) {
    console.warn('[DB] MONGO_URI not set. Falling back to', uri, '(use 127.0.0.1 if running outside Docker)');
  }

  const tryFallbackFirst = uri.includes('mongodb://mongo:');
  mongoose.set('strictQuery', true);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const opts = { autoIndex: true };
      try {
        const u = new URL(uri);
        const hasDbPath = u.pathname && u.pathname !== '/' && u.pathname.length > 1;
        const hasDbNameQuery = u.searchParams.has('dbName');
        if (!hasDbPath && !hasDbNameQuery) {
          opts.dbName = process.env.MONGO_DB || 'schoolhub';
        }
      } catch (_) {}
      await mongoose.connect(uri, opts);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      const enotfoundMongo = tryFallbackFirst && (err.code === 'ENOTFOUND' || /ENOTFOUND\s+mongo/i.test(err.message));
      const atlasBlocked = /whitelist|Access\s*List|could not connect to any servers/i.test(err.message || '');
      if (enotfoundMongo || atlasBlocked) {
        console.warn('[DB] Host "mongo" not reachable. Switching to', DEFAULT_LOCAL_URI);
        uri = DEFAULT_LOCAL_URI;
      } else {
        const remaining = retries - attempt;
        console.warn(`[DB] Connection attempt ${attempt}/${retries} failed (${err.code || err.message}).` + (remaining > 0 ? ` Retrying in ${Math.round(delayMs/1000)}s...` : ''));
        if (remaining === 0) throw err;
        await sleep(delayMs);
      }
    }
  }
}

module.exports = connectDB;
