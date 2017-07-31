import * as express from "express";
import * as https from "https";
import {readFileSync} from "fs";
import {Db} from "mongodb";
import * as path from "path";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import * as bcrypt from "bcrypt";
import bot from "../bot/bot";

export function startServer(db : Db) {
    const app = express();

    app.use(bodyParser.urlencoded({extended: false}));

    // Endpoint that the user'll be redirected to, when they try to login to imgur
    app.get("/imgur_oauth", (req : express.Request, res : express.Response, next : express.NextFunction) => {
        fs.readFile(path.join("templates", "oauth_callback_page.html"), (err, file) => {
            if (err) {
                console.error("Error in reading oauth_callback_page", err);
            } else {
                res.write(file);
                res.end();
            }
        });
    });

    app.post("/imgur_oauth", (req : express.Request, res : express.Response, next : express.NextFunction) => {

        if (req.body && req.body.error) {
            // When user declines from allowing our app his/her account
            bot.emit("imgur_oauth_failed", req.body.state.split("-")[1], req.body.error);
            res
                .status(200)
                .write("OK");
            res.end();
        } else if (req.body && req.body.access_token && req.body.refresh_token && req.body.account_username && req.body.account_id && req.body.state) {
            // When user allows our app to access his/her account
            const users = db.collection("users");

            const tusername = req
                .body
                .state
                .split("-")[0];
            const imgurUsername = req.body.account_username;
            const telegramChatid = req
                .body
                .state
                .split("-")[1];
            const accountID = req.body.account_id;
            const accessToken = req.body.access_token;
            const refreshToken = req.body.refresh_token;

            users.updateOne({
                _id: tusername
            }, {
                _id: tusername,
                iusername: imgurUsername,
                tchatid: telegramChatid,
                iaccountid: accountID,
                accesstoken: accessToken,
                refreshtoken: refreshToken
            }, {
                upsert: true
            }, (err, result) => {
                if (err) {
                    console.error("Error in storing oauth information", err);
                    res
                        .status(500)
                        .write("Internal Server Error");
                    res.end();
                }

                if (result.result.ok) {
                    res
                        .status(200)
                        .write("OK");
                    res.end();

                    bot.emit("imgur_oauth_succeeded", telegramChatid, imgurUsername);

                } else {
                    res
                        .status(500)
                        .write("Internal Server Error");
                    res.end();
                }
            });


        } else {
            res
                .status(400)
                .write("Bad Request");
            res.end();
            console.log('error');
        }
    });

    // Create a HTTPS Server
    const httpsServer = https.createServer({
        key: readFileSync("privatekey.key", "utf8"),
        cert: readFileSync("certificate.crt", "utf-8")
    }, app);

    // Start HTTPS Server
    httpsServer.listen(process.env.PORT, error => {
        if (error) {
            throw console.error("Error in starting HTTP Server", error);
        }
        console.info(`Server Started on PORT ${process.env.PORT}`);
    });

}
