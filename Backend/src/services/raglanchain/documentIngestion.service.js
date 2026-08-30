require("dotenv").config();

const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

async function loadAndSplitPDF(filePath) {

    // 1. Load PDF
    const loader = new PDFLoader(filePath);

    const documents = await loader.load();

    console.log(`Loaded ${documents.length} PDF pages`);

    // 2. Split pages into smaller chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 150,
    });

    const chunks = await splitter.splitDocuments(documents);

    console.log(`Created ${chunks.length} chunks`);

    return chunks;
}

module.exports = {
    loadAndSplitPDF,
};