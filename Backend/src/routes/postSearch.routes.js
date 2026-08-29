
const express = require("express");
const searchRouter = express.Router();
const { searchPosts } = require("../controllers/aisearch.controller");

searchRouter.post("/search", searchPosts);

module.exports =searchRouter;