import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mohsinreddragon260_db_user:p6gbBZVXuUtmHCUF@cluster0.90mceuy.mongodb.net/cockpittravel-db?retryWrites=true&w=majority";

async function fix() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db!;
  const result = await db.collection("adsnippets").updateOne(
    { _id: new mongoose.Types.ObjectId("6a78d0e25f88936b817f98d6") },
    { $set: { "nativeContent.categoryColor": "#54bd05" } }
  );
  console.log("Matched:", result.matchedCount, "Modified:", result.modifiedCount);
  await mongoose.disconnect();
}

fix().catch(console.error);
