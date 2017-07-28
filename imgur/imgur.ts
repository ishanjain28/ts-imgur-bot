import * as request from "request";

export class Imgur {
    private ClientID;

    constructor(TOKEN) {
        this.ClientID = TOKEN;
    }

    public Authorize(userdata: string) {
        // Userdata contains,
        // <User's Telegram username>-<Chat ID>
        return `https://api.imgur.com/oauth2/authorize?client_id=${this.ClientID}&response_type=token&state=${userdata}`;

    }

}