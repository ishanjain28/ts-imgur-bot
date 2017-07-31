import {init} from "./init";
import {startServer} from "./server/server";
var Db = require("./db/Db");

// Initalize Program
const succeeded = init();

if (succeeded) {
    // Connect to Database
    Db.connectToServer( function( err, db ) {
      if(err) {
        return console.error(err);
      }
      // start Server
      startServer(db);
    });
}
