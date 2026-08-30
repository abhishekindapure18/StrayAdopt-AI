require("dotenv").config();

const mongoose = require("mongoose");

const {
    searchKnowledge
} = require("./src/services/raglanchain/knowledgeRetriever.service");


async function main() {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const query =
        "How should I take care of a one month old puppy?";

    console.log("\nQuery:");
    console.log(query);

    console.log("\nSearching knowledge...\n");

    const results =
        await searchKnowledge(query);

    console.log(
        `Found ${results.length} results\n`
    );

    results.forEach((result, index) => {

        console.log(`========== RESULT ${index + 1} ==========`);

        console.log("Score:", result.score);

        console.log("Source:", result.source);

        console.log("Page:", result.pageNumber);

        console.log("\nContent:");

        console.log(result.content);

        console.log("\n");
    });

    await mongoose.disconnect();
}


main().catch((error) => {

    console.error("Knowledge search failed:");

    console.error(error);

});