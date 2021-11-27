const musixmatch = require("../services/musixmatch");
class Track {
  constructor(_id, _name, _genres, _duration, _albumId) {
    this.id = _id;
    this.name = _name;
    this.genres = _genres;
    this.duration = _duration;
    this.albumId = _albumId;
    this.lyrics = "";
  }

  getLyrics() {
      return musixmatch.getTrackLyric(this.name)
        .then(response => this.lyrics = response.message.body.lyrics.lyrics_body)
        .then(() => this.lyrics)
        .catch(() => console.log("The song has not lyrics."));
    
  }
}



module.exports = Track;
