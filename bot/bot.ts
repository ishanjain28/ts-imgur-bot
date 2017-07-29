import {Imgur} from "../imgur/imgur";
import tbot = require("node-telegram-bot-api");

const TOKEN = process.env.TOKEN;
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

export function startBot(db) {
    const bot = new tbot(TOKEN, {polling: true});
    const imgur = new Imgur(IMGUR_CLIENT_ID);
    bot
        .getMe()
        .then(me => {
            console.info(`Authorized on ${me.first_name}(${me.username})`);
        }, (error) => {
            console.error(error);
        });

    bot.onText(/\/(.+)/, (msg, match) => {

        const chatid = msg.chat.id;
        const username = msg.from.first_name;
        switch (match[1]) {
            case "start":
                break;
            case "login":
                bot
                    .sendMessage(chatid, `Open this url in a browser and Login with your imgur account\n${imgur.Authorize(`${username}-${chatid}`)}`);
                // .then(console.log, console.log);
                break;
            case "help":
                break;
            default:
                bot.sendMessage(chatid, "Type /help to get help");
        }
    });

    bot.on('message', (msg) => {
      if(Object.keys(msg).includes("photo")) {
        db.collection("Users").findOne({_id: `${msg.chat.id}`})
          .then((doc) => {
            if(!doc) {
              return console.log('null');
            }
            imgur.uploadPhoto(msg.photo[0].file_path, doc.iaccess_token, function(err, link) {
              if(err) {
                return bot.sendMessage(msg.chat.id, "Some error occurred while uploading your image please try again!");
              }
              bot.sendMessage(msg.chat.id, `Your image was successfully uploaded! Here is the link: ${link}`)
            });
          })
          .catch((err)=>{
            console.log(err);
          });
      }
    });

}
