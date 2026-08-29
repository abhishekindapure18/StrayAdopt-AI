require("dotenv").config();

const mongoose = require("mongoose");

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected!");
        console.log("Host:", mongoose.connection.host);
        await mongoose.disconnect();
    } catch (error) {
        console.error("MongoDB failed:", error);
    }
}

test();