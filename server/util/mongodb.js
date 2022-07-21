const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env');
}

if(!MONGODB_DB) {
  throw new Error('MONGODB_DB is not defined in .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
    cached = global.mongo = { conn: null, promise: null }
}

const client = new MongoClient(MONGODB_URI);
 
connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
            return {
                client,
                db: client.db(MONGODB_DB),
            }
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

module.exports = {
    connectToDatabase,
    client
}