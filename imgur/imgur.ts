import * as request from "request";
var imgur = require('imgur');

export class Imgur {
    private ClientID;

    constructor(TOKEN) {
        this.ClientID = TOKEN;
        imgur.setClientId(process.env.IMGUR_CLIENT_ID);
    }

    public Authorize(userdata: string) {
        // Userdata contains,
        // <User's Telegram username>-<Chat ID>
        return `https://api.imgur.com/oauth2/authorize?client_id=${this.ClientID}&response_type=token&state=${userdata}`;

    }

    public uploadImage(url: string, callback) {
      imgur.uploadUrl(url)
        .then(function (json) {
            callback(null, json.data.link);
        })
        .catch(function (err) {
            callback(JSON.stringify(err.message));
        });
    }

}
