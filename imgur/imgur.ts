import * as request from 'request'

class Imgur {
    private ClientID : string;
    constructor() {
        this.ClientID = process.env.IMGUR_CLIENT_ID;
        if (!this.ClientID) {
            throw console.error("$IMGUR_CLIENT_ID not set");
        }
    }

    public Authorize() {
        return `https://api.imgur.com/oauth2/authorize?client_id=${this.ClientID}&response_type=token`

    }

}