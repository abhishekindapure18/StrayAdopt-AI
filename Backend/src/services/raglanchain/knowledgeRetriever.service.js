const Knowledge = require("../../models/ragKnowledge.model");
const { generateEmbedding } = require("../embedding.service");

async function searchKnowledge(query) {

    // 1. Convert user's question into a vector
    const queryVector = await generateEmbedding(query);

    // 2. Search knowledge chunks in Atlas
    const results = await Knowledge.aggregate([
        {
            $vectorSearch: {
                index: "knowledge_vector_index",
                path: "embedding",
                queryVector: queryVector,
                numCandidates: 50,
                limit: 5,
            },
        },

        // 3. Return useful information
        {
            $project: {
                content: 1,
                source: 1,
                pageNumber: 1,
                category: 1,
                score: {
                    $meta: "vectorSearchScore",
                },
            },
        },
    ]);

    return results;
}

module.exports = {
    searchKnowledge,
};