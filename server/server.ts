import * as express from "express";
import * as https from "https";
import {readFileSync} from "fs";
var logger = require('morgan');
import {Db} from "mongodb";
import * as path from "path";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import * as bcrypt from "bcrypt";
var axios = require('axios');

export function startServer(db: Db) {
    const app = express();

    app.use(bodyParser.urlencoded({extended: false}));

    app.get("/imgur_oauth", (req: express.Request, res: express.Response, next: express.NextFunction) => {
        fs.readFile(path.join("templates", "oauth_callback_page.html"), (err, file) => {
            if (err) {
                console.error("Error in reading oauth_callback_page", err);
            } else {
                res.write(file);
                res.end();
            }
        });
    });


    app.post("/imgur_oauth", (req: express.Request, res: express.Response, next: express.NextFunction) => {

        if (req.body && req.body.access_token && req.body.refresh_token && req.body.account_username && req.body.account_id && req.body.state) {

            const users = db.collection("imgurBot");
            var chat_id = req.body.state.split("-")[1];
            users.updateOne(
                {_id: req.body.state.split("-")[0]},
                {
                    _id: req.body.state.split("-")[0],
                    iusername: req.body.account_username,
                    tchatid: req.body.state.split("-")[1],
                    iaccountid: req.body.account_id,
                }, (err, result) => {
                    if (err) {
                        console.error("Error in storing oauth information", err);
                        res.status(500).write("Internal Server Error");
                        res.end();
                    }

                    if (result.result.ok) {
                        res.status(200).write("OK");

                        axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
                            chat_id: chat_id,
                            text: 'You are successfully Logged In.'
                          }).then(function(res) {
                              console.log('msg sent');
                              res.end();
                            })
                            .catch(function(err) {
                              console.log(err);
                              res.end();
                            });

                    } else {
                        res.status(500).write("Internal Server Error");
                        res.end();
                    }
                });

        } else {
            res.status(400).write("Bad Request");
            res.end();
            console.log('error');
        }
    });

    app.use(logger('dev'));


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
