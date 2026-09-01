const express = require("express");

const ragSearchRouter = express.Router();

const { ragSearch } = require("../controllers/ragSearch.controller");

ragSearchRouter.post("/rag-search", ragSearch);

module.exports = ragSearchRouter;