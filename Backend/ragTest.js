require("dotenv").config();

const { answerUserQuery } = require("./src/services/raglanchain/rag.service");

async function main() {

    const query = "Are there any small playful puppies in Delhi?";

    console.log("User:", query);
    console.log("\nRunning RAG...\n");

    const result = await answerUserQuery(query);

    console.log("========== ANSWER ==========");
    console.log(result.answer);

    console.log("\n========== SOURCES ==========");

    result.sources.forEach((source, index) => {
        console.log(`\nSource ${index + 1}`);
        console.log("Description:", source.description);
        console.log("Location:", source.location);
        console.log("Status:", source.status);
    });
}

main().catch((error) => {
    console.error("RAG test failed:");
    console.error(error);
});