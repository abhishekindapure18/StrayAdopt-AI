require("dotenv").config();

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateAnswer(prompt) {
    const response = await llm.invoke(prompt);

    return response.content;
}

module.exports = {
    generateAnswer,
};