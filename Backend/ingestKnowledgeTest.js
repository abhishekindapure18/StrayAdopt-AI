require("dotenv").config();

const mongoose = require("mongoose");

const {
    ingestPDF
} = require("./src/services/raglanchain/documentIngestion.service");


async function main() {

    await mongoose.connect(
        process.env.MONGO_URI
    );

    console.log("MongoDB connected");


    const documents = await ingestPDF(
        "./petCareKnowlegde/pet-care.pdf",
        "pet-care"
    );


    console.log("\n========== INGESTION COMPLETE ==========\n");

    console.log(
        "Documents stored:",
        documents.length
    );

    console.log(
        "First document:"
    );

    console.log({
        content: documents[0].content,
        source: documents[0].source,
        pageNumber: documents[0].pageNumber,
        category: documents[0].category,
        dimensions: documents[0].embedding.length
    });


    await mongoose.disconnect();
}


main().catch((error) => {

    console.error(
        "Ingestion failed:"
    );

    console.error(error);

});