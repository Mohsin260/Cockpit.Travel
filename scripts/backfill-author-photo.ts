/**
 * Backfill author_photo on all articles (all locale versions).
 * Uses a dummy author avatar generated from the author name.
 * Run: npx tsx scripts/backfill-author-photo.ts
 */
import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

const DUMMY_PHOTO =
  "https://ui-avatars.com/api/?name=News+Author&background=0073FF&color=fff&size=150&bold=true";

async function run() {
  if (!MONGO_URI) {
    console.error("MONGO_URI not set. Run with: MONGO_URI=... npx tsx scripts/backfill-author-photo.ts");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db!;
  const collection = db.collection("articles");

  const missing = await collection.countDocuments({
    $or: [
      { author_photo: { $exists: false } },
      { author_photo: "" },
      { author_photo: null },
    ],
  });
  console.log(`Articles missing author_photo: ${missing}`);

  const result = await collection.updateMany(
    {
      $or: [
        { author_photo: { $exists: false } },
        { author_photo: "" },
        { author_photo: null },
      ],
    },
    { $set: { author_photo: DUMMY_PHOTO } }
  );
  console.log(`Updated: ${result.modifiedCount} (matched: ${result.matchedCount})`);

  const total = await collection.countDocuments({ author_photo: { $exists: true, $ne: "" } });
  console.log(`Total articles with author_photo: ${total}`);

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
