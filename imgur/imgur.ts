import * as request from "request";
import axios from "axios";

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

    public uploadPhoto(photo_url, access_token, callback) {
      console.log(photo_url, access_token);

      axios.defaults.headers.common['authorization'] = `Bearer ${access_token}`;

      axios.post(`https://api.imgur.com/3/image`, {
          image: `https://api.telegram.org/file/bot${process.env.TOKEN}/${photo_url}`
        }).then(function(res) {
            console.log('done');
            console.log(JSON.stringify(res.data, null, 2));
            callback(null, res.data.data.link);
          })
          .catch(function(err) {
            console.log(JSON.stringify(err.data));
            callback("error uploading");
          });
    }

}
