const mongoose = require('mongoose');

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


const connectToDatabase = async () => {
    console.log('Connecting to MongoDB...');
    if (cached.conn) {
        console.log("MongoDB Connected successfully");
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }

        cached.promise = mongoose.connect(
            MONGODB_URI,
            opts
        );

        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error: "));
        db.once("open", function () {
            console.log("MongoDB Connected successfully");
        });
    }
    cached.conn = await cached.promise
    return cached.conn
}




module.exports = {
    connectToDatabase
}