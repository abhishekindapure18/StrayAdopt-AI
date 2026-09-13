require("dotenv").config();

const mongoose = require("mongoose");
const { answerUserQuery } = require("./src/services/raglanchain/rag.service");

async function main() {
    try {
        // ==============================
        // CONNECT TO MONGODB
        // ==============================

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // ==============================
        // TEST QUERY
        // ==============================

        const query =
            "I found a one month old puppy at ABES College. How should I take care of it?";

        console.log("\n========== QUERY ==========\n");
        console.log(query);

        console.log("\n========== RUNNING RAG ==========\n");

        // ==============================
        // RUN RAG
        // ==============================

        const result = await answerUserQuery(query);

        // ==============================
        // ANSWER
        // ==============================

        console.log("\n========== ANSWER ==========\n");
        console.log(result.answer);

        // ==============================
        // POST SOURCES
        // ==============================

        console.log("\n========== POST SOURCES ==========\n");

        result.sources.posts.forEach((post, index) => {

            console.log(`\n--- Post ${index + 1} ---`);

            console.log("ID:", post._id);
            console.log("Description:", post.description);
            console.log("Location:", post.location);
            console.log("Status:", post.status);
            console.log("Images:", post.images);

            console.log("\nPosted By:");

            console.log(
                "  ID:",
                post.postBy?._id
            );

            console.log(
                "  Username:",
                post.postBy?.username
            );
        });

        // ==============================
        // KNOWLEDGE SOURCES
        // ==============================

        console.log("\n========== KNOWLEDGE SOURCES ==========\n");

        result.sources.knowledge.forEach((source, index) => {

            console.log(`\n--- Knowledge ${index + 1} ---`);

            console.log("Source:", source.source);
            console.log("Page:", source.pageNumber);
        });

        // ==============================
        // WEB SOURCES
        // ==============================

        console.log("\n========== WEB SOURCES ==========\n");

        result.sources.web.forEach((source, index) => {

            console.log(`\n--- Web ${index + 1} ---`);

            console.log("Title:", source.title);
            console.log("URL:", source.url);
            console.log("Score:", source.score);
        });

    } catch (error) {

        console.error("\nRAG test failed:");
        console.error(error);

    } finally {

        await mongoose.disconnect();

        console.log("\nMongoDB disconnected");
    }
}

main();