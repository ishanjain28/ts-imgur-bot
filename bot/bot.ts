import {Imgur} from "../imgur/imgur";
import tbot = require("node-telegram-bot-api");

const TOKEN = process.env.TOKEN;
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

export const bot = new tbot(TOKEN, {polling: true});
export const imgur = new Imgur(IMGUR_CLIENT_ID);

export function startBot(db) {
    console.log('here');
    bot
        .getMe()
        .then(me => {
            console.info(`Authorized on ${me.first_name}(${me.username})`);
        }, (error) => {
            console.error(error);
        });

    bot.onText(/\/(.+)/, (msg, match) => {

        const chatid = msg.chat.id;
        const username = msg.from.username;
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
}
