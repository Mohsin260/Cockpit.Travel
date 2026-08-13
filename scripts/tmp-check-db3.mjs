import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const conn = await mongoose.createConnection(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
await new Promise((res, rej) => { conn.once("connected", res); conn.once("error", rej); });
const cats = await conn.db.collection("categories").find({}).limit(50).project({slug:1,label:1,name:1,locale:1,color:1,count:1}).toArray();
console.log("categories count:", cats.length);
for (const c of cats) console.log(JSON.stringify({slug:c.slug, label:c.label||c.name, locale:c.locale, color:c.color, count:c.count}));
// check article category fields actually used
const sample = await conn.db.collection("articles").findOne({locale:"ar"});
console.log("ar article sample category:", JSON.stringify({category:sample.category, categoryLabel:sample.categoryLabel}));
await conn.close();
process.exit(0);
