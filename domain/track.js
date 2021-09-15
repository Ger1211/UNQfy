class Track {
    constructor(_id, _name, _genres, _duration, _albumId) {
      this.id = _id;
      this.name = _name;
      this.genres = _genres;
      this.duration = _duration
      this.albumId = _albumId;
    }
  }
  
  module.exports = Track;