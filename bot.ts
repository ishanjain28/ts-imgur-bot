import tbot = require('node-telegram-bot-api');
import app = require('express');
import {init} from './init'

// Initalize Program
init()

const TOKEN = process.env.TOKEN;

const bot = new tbot(TOKEN, {polling: true});

bot
    .getMe()
    .then(me => {
        console.info(`Authorized on ${me.first_name}(${me.username})`);
    }, (error) => {
        console.error(error)
    });

bot.onText(/\/(.+)/, (msg, match) => {
    console.log(match);
    console.log(msg)
});

bot.on('message', (msg, match) => {
    console.log(msg, match)
})