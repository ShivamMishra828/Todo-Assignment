const mongoose = require("mongoose");
const { ServerConfig, Logger } = require("../config");

async function connectToDB() {
    try {
        const connectionInstance = await mongoose.connect(
            ServerConfig.MONGODB_URI
        );
        console.log(
            `DB Connected Successfully !! Host:- ${connectionInstance.connection.host}`
        );
        Logger.info("DB Connected!!");
    } catch (error) {
        console.log(`MongoDB Connection Failed !! Error:- ${error}`);
    }
}

module.exports = connectToDB;
