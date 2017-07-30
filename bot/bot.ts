import {Imgur} from "./../imgur/imgur";
import tbot = require("node-telegram-bot-api");
import {EventEmitter} from "events";

const TOKEN = process.env.TOKEN;
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const imgur = new Imgur(IMGUR_CLIENT_ID);

class Bot extends EventEmitter {
    public tbot : tbot;
    constructor() {
        super();

        this.tbot = new tbot(TOKEN, {polling: true});
        this
            .tbot
            .getMe()
            .then(me => {
                console.info(`Authorized on ${me.first_name}(@${me.username})`);
            }, error => {
                console.error(error);
            });

        // Handle Commands
        this
            .tbot
            .onText(/\/(.+)/, (msg, match) => {

                const chatid = msg.chat.id;
                const username = msg.from.username;
                switch (match[1]) {
                    case "start":
                        break;
                    case "login":
                        this
                            .tbot
                            .sendMessage(chatid, `Open this url in a browser and Login with your imgur account\n${imgur.Authorize(`${username}-${chatid}`)}`);
                        // .then(console.log, console.log);
                        break;
                    case "help":
                        break;
                    default:
                        this
                            .tbot
                            .sendMessage(chatid, "Type /help to get help");
                }
            });

    }
}
const bot = new Bot();

bot.on("imgur_oauth_failed", (chatid, message) => {

    bot
        .tbot
        .sendMessage(chatid, `Authorization Rejected!\nReason: ${message}`);

});

bot.on("imgur_oauth_succeeded", (chatid, iusername) => {
    bot
        .tbot
        .sendMessage(chatid, `Successfully Received Authorization from imgur account @${iusername}`);
});

bot
    .tbot
    .on("photo", args => {
        bot
            .tbot
            .getFile(args.photo[1].file_id)
            .then((res)=>{
              imgur.uploadImage(`https://api.telegram.org/file/bot${process.env.TOKEN}/${res.file_path}`, function(err, link) {
                if(err) {
                  return console.error(err);
                }
                bot.tbot.sendMessage(args.chat.id, `Image was successfull uploaded. Here is it's link : ${link}`)
              });
            });
    });

export default bot;
