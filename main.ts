import {init} from "./init";
import {startServer} from "./server/server";
import {MongoClient} from "mongodb";

// Initalize Program
const succeeded = init();

if (succeeded) {
    // Connect to Database
    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
        if (err) {
            throw console.error("Error in Connecting to DB", err);
        } else {
            // Start Server
            startServer(db);

        }
    });
}
