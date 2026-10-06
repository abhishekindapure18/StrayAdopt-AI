const { PDFLoader } =
    require("@langchain/community/document_loaders/fs/pdf");

const {
    RecursiveCharacterTextSplitter
} = require("@langchain/textsplitters");

const Knowledge =
    require("../../models/ragKnowledge.model");

const {
    generateEmbedding
} = require("../embedding.service");


async function ingestPDF(filePath, category) {

    // 1. Prevent duplicate ingestion

    const existingKnowledge = await Knowledge.findOne({
        category,
        source: filePath,
    });

    if (existingKnowledge) {
        console.log(
            `Knowledge already exists for "${category}". Skipping ingestion.`
        );

        return [];  
    }


    // 2. Load PDF

    const loader = new PDFLoader(filePath);

    const documents = await loader.load();

    console.log(`Loaded ${documents.length} PDF pages`);


    // 3. Split into chunks

    const splitter =
        new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 150,
        });

    const chunks =
        await splitter.splitDocuments(documents);

    console.log(`Created ${chunks.length} chunks`);


    // 4. Generate embeddings

    const knowledgeDocuments = [];

    for (let i = 0; i < chunks.length; i++) {

        const chunk = chunks[i];

        console.log(
            `Embedding ${i + 1}/${chunks.length}`
        );

        const embedding =
            await generateEmbedding(
                chunk.pageContent
            );


        // 5. Prepare MongoDB document

        knowledgeDocuments.push({
            content: chunk.pageContent,

            source:
                chunk.metadata?.source || filePath,

            pageNumber:
                chunk.metadata?.loc?.pageNumber,

            category,

            embedding,
        });
    }


    // 6. Save to MongoDB

    await Knowledge.insertMany(
        knowledgeDocuments
    );

    console.log(
        `Saved ${knowledgeDocuments.length} knowledge chunks`
    );

    return knowledgeDocuments;
}


module.exports = {
    ingestPDF,
};