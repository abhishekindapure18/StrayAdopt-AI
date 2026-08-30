const mongoose = require("mongoose");

const knowledgeSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },

        source: {
            type: String,
            required: true,
        },

        pageNumber: {
            type: Number,
        },

        category: {
            type: String,
            required: true,
        },

        embedding: {
            type: [Number],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Knowledge", knowledgeSchema);