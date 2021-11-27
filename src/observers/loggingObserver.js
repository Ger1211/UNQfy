const logging = require("../services/logging");
class LoggingObserver {
  notify(data, action) {
    if(action === 'artists') {
      logging.sendArtistCreation(data);
    }
    if(action === 'albums'){
      logging.sendAlbumCreation(data);
    }
    if(action === 'tracks'){
      logging.sendTrackCreation(data);
    }
    if(action === 'deleteArtist'){
      logging.sendArtistElimination(data);
    }
    if(action === 'deleteAlbum'){
      logging.sendAlbumElimination(data);
    }
    if(action === 'deleteTrack'){
      logging.sendTrackElimination(data);
    }
  }
}

module.exports = LoggingObserver;
