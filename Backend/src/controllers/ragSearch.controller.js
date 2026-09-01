const { answerUserQuery } = require("../services/raglanchain/rag.service");

async function ragSearch(req, res) {
    try {
        const { query } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Query is required",
            });
        }

        const result = await answerUserQuery(query.trim());

        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error("RAG search error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process your query",
        });
    }
}

module.exports = {
    ragSearch,
};