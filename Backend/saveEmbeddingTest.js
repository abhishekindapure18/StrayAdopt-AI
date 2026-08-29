require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("./src/models/post.model");

async function main() {
  await mongoose.connect(process.env.MONGO_URI); // confirm this matches your .env key name

  const post = await Post.findOne().sort({ createdAt: -1 });

  if (!post) {
    console.log("No posts found in DB.");
  } else {
    console.log("Post ID:", post._id);
    console.log("Description:", post.description);
    console.log("Has embedding:", !!post.embedding);
    console.log("Dimensions:", post.embedding?.length);
  }

  await mongoose.disconnect();
}

main().catch((err) => console.error("Test failed:", err));