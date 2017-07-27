import * as express from "express";
import * as https from "https";
import {readFileSync} from "fs";
import {Db} from "mongodb";

export function startServer(db: Db) {
    const app = express();

    app.get("/imgur_oauth", (req: express.Request, res: express.Response, next: express.NextFunction) => {

        if (req.query && req.query.access_token && req.query.refresh_token && req.query.account_username && req.query.account_id) {

        // TODO:Hash the token and store it in Database along with username and refresh token.

        }
        res.end();
    });

    const httpsServer = https.createServer({
        key: readFileSync("privatekey.key", "utf8"),
        cert: readFileSync("certificate.crt", "utf-8"),
    }, app);

    httpsServer.listen(process.env.PORT, error => {
        if (error) {
            throw console.error("Error in starting HTTP Server", error);
        }

        console.info(`Server Started on PORT ${process.env.PORT}`);
    });

}

