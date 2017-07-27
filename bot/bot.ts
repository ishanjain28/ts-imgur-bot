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
        switch (match[1]) {
            case "start":
                break;
            case "login":
                bot
                    .sendMessage(chatid, `Open this url in a window and Login with your imgur account\n${imgur.Authorize()}`);
                    // .then(console.log, console.log);
                break;
            case "help":
                break;
            default:
                bot.sendMessage(chatid, "Type /help to get help");
        }
    });
}
