import * as chalk from 'chalk'
import {Utils} from './utils/utils'

let TOKEN = "",
    NODE_ENV = "",
    PORT = "",
    colorMapping = {
        "info": chalk.green,
        "warn": chalk.yellow,
        "error": chalk.red
    };

export  function init() {

    let u = new Utils();

    // Initalise Logger
    ["warn", "error", "info"].forEach((method : string) => {
        var old = console[method].bind(console);
        console[method] = function () {
            old.apply(console, [colorMapping[method](new Date().toISOString(), u.ObjectToArray(arguments))])
        }
    });

    TOKEN = process.env.TOKEN || null;
    if (!TOKEN) {
        throw Error("$TOKEN not set")
    }
    NODE_ENV = process.env.NODE_ENV || null;
    if (!NODE_ENV) {
        console.warn("$NODE_ENV not set, Setting it to \"Development\"");
        NODE_ENV = "development"
    }
    PORT = process.env.PORT || null;
    if (!PORT) {
        throw Error("$PORT not set")
    }
}