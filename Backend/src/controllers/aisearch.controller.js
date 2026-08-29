
const searchService = require("../services/search.service");

async function searchPosts(req, res) {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await searchService.searchPostsByQuery(query);
    return res.status(200).json({ results });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
}

module.exports = { searchPosts };