const newsletter = require("../services/newsletter");
class NewsletterObserver {
  notify(data, action) {
    if (action === "albums") {
      let dataInfo = {};
      dataInfo.artistId = data.artistId;
      dataInfo.subject = `Nuevo Album para artista ${data.artistName}`;
      dataInfo.message = `Se ha agregado el album ${data.albumName} al artista ${data.artistName}`;
      newsletter.notify(dataInfo);
    }
  }
}

module.exports = NewsletterObserver;
