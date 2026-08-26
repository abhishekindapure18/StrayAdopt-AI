require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await genAI.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: "Say hello and confirm you're working, in one short sentence.",
  });

  console.log("Gemini says:", response.text);
}

main().catch((err) => {
  console.error("Gemini test failed:", err);
});