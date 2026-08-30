const { loadAndSplitPDF } =
    require("./src/services/raglanchain/documentIngestion.service");

async function main() {

    const chunks = await loadAndSplitPDF(
       "./petCareKnowlegde/pet-care.pdf"
    );

    console.log("\n========== FIRST CHUNK ==========\n");

    console.log(chunks[0]);

    console.log("\n========== CONTENT ==========\n");

    console.log(chunks[0].pageContent);

    console.log("\n========== METADATA ==========\n");

    console.log(chunks[0].metadata);
}

main().catch((error) => {
    console.error("PDF test failed:");
    console.error(error);
});