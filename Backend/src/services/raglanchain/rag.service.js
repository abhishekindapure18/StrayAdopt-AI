const { retrievePosts } = require("./langchainRetriever.service");
const { searchKnowledge } = require("./knowledgeRetriever.service");
const { generateAnswer } = require("./llm.service");
const { routeQuery } = require("./queryRouter.service");
const { webSearch } = require("./webSearch.service");


async function answerUserQuery(query) {

    // ==============================
    // 1. ROUTE QUERY
    // ==============================

    const routing = await routeQuery(query);

    const route = routing.route;
    const webNeeded = routing.webNeeded;

    

    // ==============================
    // 2. RETRIEVE FROM MONGODB
    // ==============================

    let posts = [];
    let knowledge = [];

    if (route === "POSTS" || route === "BOTH") {

       

        posts = await retrievePosts(query);
    }

    if (route === "PET_KNOWLEDGE" || route === "BOTH") {

       

        knowledge = await searchKnowledge(query);
        
    }


    // ==============================
    // 3. WEB SEARCH
    // ==============================

    let webResults = [];

    if (webNeeded) {

        console.log("Searching the web...");

        webResults = await webSearch(query, 5);
    }


    // ==============================
    // 4. CREATE POSTS CONTEXT
    // ==============================

    const postsContext = posts.map((doc, index) => {

        return `
Post ${index + 1}:
Description: ${doc.pageContent}
Location: ${doc.metadata.location}
Status: ${doc.metadata.status}
`;

    }).join("\n");


    // ==============================
    // 5. CREATE KNOWLEDGE CONTEXT
    // ==============================

    const knowledgeContext = knowledge.map((doc, index) => {

        return `
    Knowledge Source ${index + 1}:
    Source: ${doc.source}
    Page: ${doc.pageNumber}
    Content:
    ${doc.content}
    `;
    
    }).join("\n");

    // ==============================
    // 6. CREATE WEB CONTEXT
    // ==============================

    const webContext = webResults.map((result, index) => {

        return `
Web Source ${index + 1}:
Title: ${result.title}
URL: ${result.url}
Content:
${result.content}
`;

    }).join("\n");


    // ==============================
    // 7. COMBINE CONTEXT
    // ==============================

    const fullContext = `

========== ADOPTION POSTS ==========

${postsContext}

========== PET KNOWLEDGE ==========

${knowledgeContext}

========== WEB SOURCES ==========

${webContext}

`;


    // ==============================
    // 8. GENERATE FINAL ANSWER
    // ==============================

    const prompt = `
You are the AI assistant for StrayAdopt.

Answer the user's question using ONLY the provided context.

The context can contain:

1. Adoption posts from StrayAdopt
2. Pet-care knowledge documents
3. Current web search results

IMPORTANT RULES:

- Do not invent information.
- Treat StrayAdopt posts as the source of truth for adoption listings.
- Treat the pet-care documents as trusted knowledge.
- Web sources provide additional/current information.
- If sources disagree, clearly mention the difference.
- If information is missing, say that it is missing.
- Do not claim an animal exists unless it appears in the adoption posts.
- When using web information, mention the source naturally.
- Keep the answer helpful and concise.

CONTEXT:

${fullContext}

USER QUESTION:

${query}

ANSWER:
`;


    const answer = await generateAnswer(prompt);


    // ==============================
    // 9. RETURN ANSWER + SOURCES
    // ==============================

    return {

        answer,

        sources: {

            posts: posts.map((doc) => ({
                _id: doc.metadata._id,
                description: doc.pageContent,
                location: doc.metadata.location,
                status: doc.metadata.status,
                images: doc.metadata.images,
            })),

            knowledge: knowledge.map((doc) => ({
                source: doc.source,
                pageNumber: doc.pageNumber,
                content: doc.content,
            })),
            
            web: webResults.map((result) => ({
                title: result.title,
                url: result.url,
                score: result.score,
            })),

        },

    };
}


module.exports = {
    answerUserQuery,
};