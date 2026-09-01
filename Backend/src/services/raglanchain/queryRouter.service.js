const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const routerModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    temperature: 0,
});

async function routeQuery(query) {

    const prompt = `
You are the query router for StrayAdopt.

Decide which internal information sources are needed
to answer the user's COMPLETE question.

AVAILABLE INTERNAL SOURCES:

POSTS:
Real adoption listings from StrayAdopt.
Use when the user asks about:
- finding animals
- available animals
- adoption listings
- animals in a location
- a specific adoption listing

PET_KNOWLEDGE:
Trusted pet-care documents.
Use for:
- feeding
- health
- vaccinations
- training
- grooming
- behaviour
- caring for puppies, kittens, cats or dogs
- general pet ownership

A query can require BOTH.

WEB SEARCH:
Use web search when the question requires:
- current or latest information
- recent recommendations or guidelines
- information that may have changed recently
- current news, laws, regulations, prices or availability
- information not likely to be available in the internal sources

IMPORTANT:
A query may need internal sources AND web search.

Examples:

"Find me a puppy in Delhi"
→ POSTS, webNeeded=false

"How should I take care of a one month old puppy?"
→ PET_KNOWLEDGE, webNeeded=false

"I found a puppy at ABES College. How should I take care of it?"
→ BOTH, webNeeded=false

"I found a puppy at ABES College. What are the latest vaccination recommendations?"
→ BOTH, webNeeded=true

"What are the latest vaccination recommendations for puppies?"
→ PET_KNOWLEDGE, webNeeded=true

"Find me a puppy in Delhi and tell me the latest adoption rules"
→ POSTS, webNeeded=true

Return ONLY valid JSON in exactly this format:

{
  "route": "POSTS" | "PET_KNOWLEDGE" | "BOTH",
  "webNeeded": true | false
}

Do not return markdown.
Do not return explanations.

User query:
${query}
`;

    const response = await routerModel.invoke(prompt);

    const text = response.content
        .toString()
        .trim();

    let result;

    try {
        result = JSON.parse(text);
    } catch (error) {
        throw new Error(`Invalid router JSON: ${text}`);
    }

    if (!["POSTS", "PET_KNOWLEDGE", "BOTH"].includes(result.route)) {
        throw new Error(`Invalid route: ${result.route}`);
    }

    if (typeof result.webNeeded !== "boolean") {
        throw new Error(`Invalid webNeeded value: ${result.webNeeded}`);
    }

    return result;
}

module.exports = {
    routeQuery,
};