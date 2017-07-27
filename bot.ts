import tbot = require('node-telegram-bot-api');
import app = require('express');

class Bot {
    constructor(token : string) {
        const bot = new tbot(token)

        bot.onText('/\/(.+)/', (msg : any, match : any) => {

            const chatID = msg.chat.id;

            switch (match[0]) {
                case "/start":
                case "/help":
                default:
                    bot.sendMessage(chatID, "Invalid Command, Type /help to get help");
            }
        });

    }

}