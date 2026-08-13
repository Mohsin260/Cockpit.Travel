import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const conn = await mongoose.createConnection(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
await new Promise((res, rej) => { conn.once("connected", res); conn.once("error", rej); });
const cols = await conn.db.listCollections().toArray();
console.log("collections:", cols.map(c=>c.name).join(", "));
await conn.close();
process.exit(0);
