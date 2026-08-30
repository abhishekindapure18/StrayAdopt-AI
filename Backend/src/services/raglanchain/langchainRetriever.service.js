require("dotenv").config();

const { MongoClient } = require("mongodb");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const { generateEmbedding } = require("../embedding.service");

// LangChain needs an embeddings object.
// We are connecting it to YOUR existing Gemini embedding service.
const embeddings = {
    async embedQuery(text) {
        return await generateEmbedding(text);
    },

    async embedDocuments(texts) {
        return await Promise.all(
            texts.map((text) => generateEmbedding(text))
        );
    }
};

const client = new MongoClient(process.env.MONGO_URI);

const db = client.db("test");
const collection = db.collection("posts");

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "post_vector_index",
    textKey: "description",
    embeddingKey: "embedding",
});

const retriever = vectorStore.asRetriever(5);

async function retrievePosts(query) {
    const documents = await retriever.invoke(query);

    return documents;
}

module.exports = {
    retrievePosts
};