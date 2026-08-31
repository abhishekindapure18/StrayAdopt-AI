require("dotenv").config();

const { routeQuery } = require("./src/services/raglanchain/queryRouter.service");


async function main() {

    const queries = [

        "Find me a small playful puppy in Delhi",

        "How should I take care of a one month old puppy?",

        "I found a puppy at ABES College. How should I take care of it?",

        "What should I feed my cat?",

        "Are there any dogs available for adoption in Delhi?"

    ];


    for (const query of queries) {

        console.log("\n================================");

        console.log("Query:", query);

        const route = await routeQuery(query);

        console.log("Route:", route);
    }
}


main().catch(console.error);