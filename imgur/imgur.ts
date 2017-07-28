import * as request from "request";

export class Imgur {
    private ClientID;

    constructor(TOKEN) {
        this.ClientID = TOKEN;
    }

    public Authorize(id) {
        return `https://api.imgur.com/oauth2/authorize?client_id=${this.ClientID}&response_type=token&state=${id}`;

    }

}
