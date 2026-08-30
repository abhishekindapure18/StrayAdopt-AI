const { retrievePosts } = require("./langchainRetriever.service");
const { generateAnswer } = require("./llm.service");

async function answerUserQuery(query) {

    // 1. Retrieve relevant posts
    const documents = await retrievePosts(query);

    // 2. Convert retrieved documents into context
    const context = documents.map((doc, index) => {
        return `
Post ${index + 1}:
Description: ${doc.pageContent}
Location: ${doc.metadata.location}
Status: ${doc.metadata.status}
`;
    }).join("\n");

    // 3. Give the retrieved context + question to Gemini
    const prompt = `
    You are the AI assistant for StrayAdopt, a platform
    that helps people find homes for stray animals.
    
    Use the retrieved posts to answer the user's question.
    
    Rules:
    - Treat the retrieved posts as the source of truth for available animals.
    - If one or more retrieved posts reasonably match the user's request,
      present those posts as matches.
    - Do not say "no matching post was found" if a retrieved post is relevant.
    - Do not invent animals, locations, ages, or other details.
    - If the retrieved posts do not contain enough information to answer
      the question, clearly say what information is missing.
    - Be helpful and concise.
    
    Retrieved posts:
    ${context}
    
    User question:
    ${query}
    
    Answer:
    `;

    // 4. Gemini generates the final answer
    const answer = await generateAnswer(prompt);

    return {
        answer,
        sources: documents.map((doc) => ({
            id: doc.metadata._id,
            description: doc.pageContent,
            location: doc.metadata.location,
            status: doc.metadata.status,
            images: doc.metadata.images,
        })),
    };
}

module.exports = {
    answerUserQuery,
};