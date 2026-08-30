require("dotenv").config();

const { retrievePosts } = require("./src/services/raglanchain/langchainRetriever.service");

async function main() {

    const query = "small playful puppy in Delhi";

    console.log("Query:", query);
    console.log("\nSearching...\n");

    const results = await retrievePosts(query);

    console.log("Results:", results.length);

    results.forEach((doc, index) => {

        console.log(`\n--- Result ${index + 1} ---`);

        console.log("Content:", doc.pageContent);
        console.log("Metadata:", doc.metadata);
    });
}

main().catch((error) => {
    console.error("LangChain test failed:");
    console.error(error);
});