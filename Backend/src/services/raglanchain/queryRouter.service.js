const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const routerModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.6-flash",
    temperature: 0,
});

async function routeQuery(query) {

    const prompt = `
You are the query router for StrayAdopt.

Your job is to decide which information sources are needed
to answer the user's COMPLETE question.

AVAILABLE SOURCES:

POSTS:
Contains real adoption listings from StrayAdopt.
Use POSTS when the user asks about:
- finding an animal
- available animals
- adoption listings
- a specific animal listing
- animals in a location
- puppies, kittens, dogs, cats available for adoption
- information about an animal mentioned in a StrayAdopt listing

PET_KNOWLEDGE:
Contains trusted pet-care documents.
Use PET_KNOWLEDGE when the user asks about:
- feeding
- health
- vaccinations
- training
- grooming
- behaviour
- caring for puppies
- caring for kittens
- caring for cats or dogs
- general pet ownership

IMPORTANT:

A query can require BOTH sources.

Use BOTH when the user:
1. Refers to a specific animal/adoption listing AND
2. Asks a pet-care or general animal-care question.

For example:

"I found a puppy at ABES College. How should I take care of it?"
→ BOTH

"I found a kitten on StrayAdopt. What should I feed it?"
→ BOTH

"Is there a puppy available in Delhi and how should I care for it?"
→ BOTH

"Find me a puppy in Delhi"
→ POSTS

"How should I take care of a one month old puppy?"
→ PET_KNOWLEDGE

"What should I feed my cat?"
→ PET_KNOWLEDGE

Return ONLY ONE of:

POSTS
PET_KNOWLEDGE
BOTH

Do not return explanations.

User query:
${query}
`;

    const response = await routerModel.invoke(prompt);

    const route = response.content
        .toString()
        .trim()
        .toUpperCase();

    if (!["POSTS", "PET_KNOWLEDGE", "BOTH"].includes(route)) {
        throw new Error(`Invalid router response: ${route}`);
    }

    return route;
}

module.exports = {
    routeQuery,
};