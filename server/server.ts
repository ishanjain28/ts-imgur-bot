import * as express from "express";
import * as https from "https";
import {readFileSync} from "fs";
var logger = require('morgan');
import {Db} from "mongodb";
var path = require('path');
var axios = require('axios');

export function startServer(db: Db) {
    const app = express();

    app.get("/imgur_oauth", (req, res, next)=> {
      res.sendFile(path.join(__dirname + "./../public/imgur_oauth.html"));
    });

    app.get("/catchtoken", (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.query && req.query.access_token && req.query.refresh_token && req.query.account_username && req.query.account_id && req.query.state) {

        // TODO:Hash the token and store it in Database along with username and refresh token.
          db.collection('imgurBot').insertOne({
            username: req.query.account_username,
            access_token: req.query.access_token,
            refresh_token: req.query.refresh_token,
            telegram_user_id: req.query.state
          }, function(err, r) {
              if(err) {
                return console.log(err);
              }

              axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
                chat_id: req.query.state,
                text: 'You are successfully Logged In.'
              }).then(function(res) {
                  console.log('msg sent');
                })
                .catch(function(err) {
                  console.log(err);
                });
              });
        } else {
          console.log('error in logging user');
        }

        // send url to redirect after login
         res.send(null);
    });

    app.use(logger('dev'));

    app.use(function(req, res, next) {
      next();
    })

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
