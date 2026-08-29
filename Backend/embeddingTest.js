require("dotenv").config();

const { generateEmbedding } = require("../backend/src/services/embedding.service")

async function main() {
    const text = "Friendly Labrador puppy available in Noida";

    const embedding = await generateEmbedding(text);

    console.log("Embedding generated!");
    console.log("Dimensions:", embedding.length);
    console.log("First 10 values:", embedding.slice(0, 10));
}

main().catch((err) => {
    console.error("Embedding failed:", err);
});