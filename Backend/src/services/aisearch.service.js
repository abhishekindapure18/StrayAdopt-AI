
const postModel = require("../models/post.model");
const { generateEmbedding } = require("./embedding.service");

async function searchPostsByQuery(query) {
  // Step 1: embed the user's natural language query
  const queryVector = await generateEmbedding(query);

  // Step 2: ask Atlas for the closest matching posts
  const results = await postModel.aggregate([
    {
      $vectorSearch: {
        index: "post_vector_index",   // must match the Atlas index name exactly
        path: "embedding",
        queryVector: queryVector,
        numCandidates: 50,            // how many docs to scan (10-20x limit is typical)
        limit: 5,                     // how many results to return
      },
    },
    {
      $project: {
        description: 1,
        location: 1,
        images: 1,
        status: 1,
        postBy: 1,
        score: { $meta: "vectorSearchScore" }, // similarity score 0-1, higher = closer match
      },
    },
  ]);

  return results;
}

module.exports = { searchPostsByQuery };