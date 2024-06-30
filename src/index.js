const app = require("./app"); // Importing the Express app setup from ./app
const connectToDB = require("./db"); // Function to connect to the database
const { Logger, ServerConfig } = require("./config"); // Logger and server configuration

const PORT = ServerConfig.PORT || 5000; // Default port 5000 if PORT is not specified in ServerConfig

connectToDB()
    .then(() => {
        // Connect to the database
        app.listen(PORT, () => {
            // Start the server and listen on PORT
            console.log(`Server Started at PORT:- ${PORT}`);
            Logger.info("Server Booted up successfully!"); // Log successful server startup
        });
    })
    .catch((error) => {
        // Handle database connection errors
        console.log(`Something went wrong while connecting to DB:- ${error}`);
        process.exit(1); // Exit the process with a non-zero code
    });
