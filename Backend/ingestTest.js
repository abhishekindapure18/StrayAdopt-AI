const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const path = require("path");

const { ingestPDF } = require("./src/services/raglanchain/documentIngestion.service");

async function main() {
    try {
        // Connect MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // PDF path
        const pdfPath = path.join(
            __dirname,
            "petCareKnowlegde",
            "pet-care.pdf"
        );

        console.log("PDF path:", pdfPath);

        // Ingest PDF
        await ingestPDF(pdfPath, "pet-care");

        console.log("\nPDF ingestion completed successfully.");

    } catch (error) {
        console.error("\nIngestion failed:");
        console.error(error);

    } finally {
        await mongoose.disconnect();
        console.log("\nMongoDB disconnected");
    }
}

main();