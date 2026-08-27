require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function main() {

    const text = "Friendly Labrador puppy available in Noida";

    const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
    });

    const embedding = response.embeddings[0].values;

    console.log("Embedding generated!");
    console.log("Dimensions:", embedding.length);
    console.log("First 10 values:", embedding.slice(0, 10));
}

main().catch((err) => {
    console.error("Embedding failed:", err);
});