const newsletter = require("./services/newsletter");


class NewsletterObserver {
    

    notify(data,action){
       if(action === "albums"){
            newsletter.sendAlbumInfo(data);
       }
    }    

}


module.exports = NewsletterObserver;