const axios = require("axios");

const TAVILY_API_URL = "https://api.tavily.com/search";

async function webSearch(query, maxResults = 5) {

    if (!process.env.TAVILY_API_KEY) {
        throw new Error("TAVILY_API_KEY is missing");
    }

    try {

        const response = await axios.post(TAVILY_API_URL, {
            api_key: process.env.TAVILY_API_KEY,
            query: query,
            search_depth: "basic",
            max_results: maxResults,
            include_answer: false,
            include_raw_content: false
        });

        const results = response.data?.results || [];

        return results.map((result) => ({
            title: result.title,
            url: result.url,
            content: result.content,
            score: result.score
        }));

    } catch (error) {

        console.error(
            "Tavily search failed:",
            error.response?.data || error.message
        );

        return [];
    }
}

module.exports = {
    webSearch
};