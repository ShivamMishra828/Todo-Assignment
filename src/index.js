const app = require("./app");
const connectToDB = require("./db");
const { Logger, ServerConfig } = require("./config");

const PORT = ServerConfig.PORT || 5000;

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Started at PORT:- ${PORT}`);
            Logger.info("Server Booted up successfully!");
        });
    })
    .catch((error) => {
        console.log(`Something went wrong while connecting to DB:- ${error}`);
        process.exit(1);
    });
