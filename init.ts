import * as chalk from "chalk";
import {Utils} from "./utils/utils";
import {MongoClient, Db} from "mongodb";

let TOKEN = "";
let NODE_ENV = "";
let PORT = "";
let IMGUR_CLIENT_ID = "";
let MONGODB_URI = "";
const colorMapping = {
    "info": chalk.green,
    "warn": chalk.yellow,
    "error": chalk.red,
};

function overrideLoggers() {
    const u = new Utils();

    // Initalise Logger
    ["warn", "error", "info"].forEach((method: string) => {
        let old = console[method].bind(console);
        console[method] = function () {
            old.apply(console, [colorMapping[method](new Date().toISOString(), u.ObjectToArray(arguments))]);
        };
    });
}

export function init() {

    overrideLoggers();

    TOKEN = process.env.TOKEN || null;
    if (!TOKEN) {
        console.error("$TOKEN not set");
        return false;
    }

    NODE_ENV = process.env.NODE_ENV || null;
    if (!NODE_ENV) {
        console.warn("$NODE_ENV not set, Setting it to \"Development\"");
        NODE_ENV = "development";
    }

    PORT = process.env.PORT || null;
    if (!PORT) {
        console.error("$PORT not set");
        return false;
    }

    IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || null;
    if (!IMGUR_CLIENT_ID) {
        console.error("$IMGUR_CLIENT_ID not set");
        return false;
    }

    MONGODB_URI = process.env.MONGODB_URI || null;
    if (!MONGODB_URI) {
        console.warn("$MONGODB_URI not set, Setting it to \"mongodb://localhost:27017/imgurbot\"");
        process.env.MONGODB_URI = "mongodb://localhost:27017/imgurbot";
    }
    return true;
}
