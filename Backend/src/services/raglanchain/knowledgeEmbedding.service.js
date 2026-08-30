const { generateEmbedding } = require("../embedding.service");

async function embedDocuments(documents) {

    const embeddedDocuments = [];

    for (let i = 0; i < documents.length; i++) {

        const document = documents[i];

        console.log(
            `Embedding chunk ${i + 1}/${documents.length}`
        );

        const embedding = await generateEmbedding(
            document.pageContent
        );

        embeddedDocuments.push({
            pageContent: document.pageContent,
            metadata: document.metadata,
            embedding
        });
    }

    return embeddedDocuments;
}

module.exports = {
    embedDocuments
};